import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number.parseInt(process.argv[2] || "47844", 10);
const cacheDir = path.join(root, ".cache");

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

const DAY_MS = 24 * 60 * 60 * 1000;
const liveCache = new Map();
const usageOperations = new Set(["ViewReport", "ViewDashboard", "ViewTile"]);

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload, null, 2));
}

function cacheKeyPart(value) {
  return String(value || "all").replace(/[^a-z0-9_.@-]+/gi, "_").slice(0, 120);
}

function cachePath(days, targetUser = "") {
  return path.join(cacheDir, `live-summary-${days}-${cacheKeyPart(targetUser)}.json`);
}

async function readDiskCache(days, targetUser = "") {
  try {
    const payload = JSON.parse(await readFile(cachePath(days, targetUser), "utf8"));
    return {
      ...payload,
      cache: {
        ...(payload.cache || {}),
        source: "disk",
        loadedAt: new Date().toISOString()
      }
    };
  } catch {
    return null;
  }
}

async function writeDiskCache(days, payload, targetUser = "") {
  try {
    await mkdir(cacheDir, { recursive: true });
    await writeFile(cachePath(days, targetUser), JSON.stringify(payload), "utf8");
  } catch {
    // Cache is a performance helper; API output should still work if disk write fails.
  }
}

function clampDays(value) {
  const parsed = Number.parseInt(value || "7", 10);
  if (!Number.isFinite(parsed)) return 7;
  return Math.max(1, Math.min(30, parsed));
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function completeUtcDays(days) {
  const now = new Date();
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - DAY_MS);
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(end.getTime() - (days - 1 - index) * DAY_MS);
    return isoDate(date);
  });
}

function numberPercent(numerator, denominator) {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 1000) / 10;
}

function valueText(value) {
  if (!Number.isFinite(value)) return "0";
  if (value >= 1000) {
    const scaled = value / 1000;
    return `${scaled >= 10 ? scaled.toFixed(0) : scaled.toFixed(1)}K`;
  }
  return `${Math.round(value)}`;
}

function eventDate(event) {
  return String(event.CreationTime || "").slice(0, 10);
}

function userKey(event) {
  return event.UserId || event.UserKey || "Unknown user";
}

function workspaceName(event, workspaceMap) {
  return event.WorkSpaceName || workspaceMap.get(event.WorkspaceId)?.name || "Unknown workspace";
}

function isPersonalWorkspace(workspace) {
  const type = String(workspace?.type || workspace?.workspaceType || "").toLowerCase();
  const name = String(workspace?.name || "").toLowerCase();
  return type.includes("personal") || name === "my workspace" || name.startsWith("personalworkspace");
}

function isTkmWorkspace(workspace) {
  const name = String(workspace?.name || "").toLowerCase();
  return name.includes("tkm");
}

function normalizedEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function workspaceHasUser(workspace, targetUser) {
  const target = normalizedEmail(targetUser);
  if (!target) return false;

  return (Array.isArray(workspace?.users) ? workspace.users : []).some((user) => {
    const candidates = [
      user.emailAddress,
      user.userPrincipalName,
      user.identifier,
      user.displayName,
      user.graphId,
      user.principalName
    ].map(normalizedEmail);
    return candidates.includes(target);
  });
}

function reportName(event) {
  return event.ReportName || event.ItemName || event.ArtifactName || event.ObjectId || "Unknown report";
}

function datasetName(event) {
  return event.DatasetName || event.ArtifactName || event.ItemName || event.DatasetId || "Unknown dataset";
}

function topGroups(items, keyFn, labelFn, extraFn = () => ({}), limit = 5) {
  const groups = new Map();

  for (const item of items) {
    const key = keyFn(item) || "Unknown";
    const current = groups.get(key) || {
      key,
      label: labelFn(item) || key,
      count: 0,
      extra: extraFn(item)
    };
    current.count += 1;
    groups.set(key, current);
  }

  return [...groups.values()]
    .sort((a, b) => b.count - a.count || String(a.label).localeCompare(String(b.label)))
    .slice(0, limit);
}

async function requestJson(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let body = null;

  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!res.ok) {
    const error = new Error(`HTTP ${res.status}`);
    error.status = res.status;
    error.body = body;
    throw error;
  }

  return body;
}

async function getPowerBiToken() {
  const tenantId = process.env.POWERBI_TENANT_ID;
  const clientId = process.env.POWERBI_CLIENT_ID;
  const clientSecret = process.env.POWERBI_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    return {
      ok: false,
      missingConfig: true,
      message: "Set POWERBI_TENANT_ID, POWERBI_CLIENT_ID, and POWERBI_CLIENT_SECRET before starting the server."
    };
  }

  const body = new URLSearchParams({
    client_id: clientId,
    scope: "https://analysis.windows.net/powerbi/api/.default",
    client_secret: clientSecret,
    grant_type: "client_credentials"
  });

  const token = await requestJson(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  return {
    ok: true,
    accessToken: token.access_token,
    expiresIn: token.expires_in,
    tenantId,
    clientId
  };
}

async function probePowerBiEndpoint(name, url, accessToken) {
  try {
    const body = await requestJson(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    return {
      name,
      ok: true,
      status: 200,
      itemCount: Array.isArray(body?.value)
        ? body.value.length
        : Array.isArray(body?.activityEventEntities)
          ? body.activityEventEntities.length
          : null,
      body
    };
  } catch (error) {
    return {
      name,
      ok: false,
      status: error.status || null,
      error: error.body?.Message || error.body?.error_description || error.message,
      body: error.body || null
    };
  }
}

async function fetchActivityEvents(accessToken, days) {
  const dates = completeUtcDays(days);
  const dayResults = [];

  async function fetchDay(day) {
    const events = [];
    let uri = `https://api.powerbi.com/v1.0/myorg/admin/activityevents?startDateTime='${day}T00:00:00Z'&endDateTime='${day}T23:59:59Z'`;
    let pageGuard = 0;
    let failure = null;

    while (uri && pageGuard < 50) {
      pageGuard += 1;

      try {
        const body = await requestJson(uri, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        events.push(...(Array.isArray(body?.activityEventEntities) ? body.activityEventEntities : []));
        uri = body?.continuationUri || null;
      } catch (error) {
        failure = {
          status: error.status || null,
          error: error.body?.Message || error.body?.error_description || error.message
        };
        uri = null;
      }
    }

    return { day, events, pageCount: pageGuard, failure };
  }

  for (let index = 0; index < dates.length; index += 4) {
    const batch = dates.slice(index, index + 4);
    dayResults.push(...(await Promise.all(batch.map(fetchDay))));
  }

  const allEvents = dayResults.flatMap((result) => result.events);
  const firstFailure = dayResults.find((result) => result.failure)?.failure || null;
  const pageCount = dayResults.reduce((sum, result) => sum + result.pageCount, 0);

  return {
    events: allEvents,
    endpoint: firstFailure
      ? {
          name: "Tenant activity events",
          ok: false,
          status: firstFailure.status,
          itemCount: allEvents.length,
          error: firstFailure.error
        }
      : {
          name: "Tenant activity events",
          ok: true,
          status: 200,
          itemCount: allEvents.length,
          error: null
        },
    pageCount,
    fromDate: dates[0],
    toDate: dates[dates.length - 1],
    dates
  };
}

async function fetchWorkspaceMetadata(accessToken) {
  const pageSize = 5000;
  const values = [];
  let skip = 0;
  let firstBody = null;

  while (skip < 50000) {
    const body = await requestJson(`https://api.powerbi.com/v1.0/myorg/admin/groups?$top=${pageSize}&$skip=${skip}&$expand=reports,datasets,dashboards,users`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const pageValues = Array.isArray(body?.value) ? body.value : [];
    if (!firstBody) firstBody = body;
    values.push(...pageValues);
    if (pageValues.length < pageSize) break;
    skip += pageSize;
  }

  return {
    name: "Tenant admin workspaces",
    ok: true,
    status: 200,
    itemCount: values.length,
    error: null,
    body: {
      ...firstBody,
      value: values
    }
  };
}

function flattenInventory(workspaces) {
  const reports = [];
  const datasets = [];
  const dashboards = [];

  for (const workspace of workspaces) {
    for (const report of Array.isArray(workspace.reports) ? workspace.reports : []) {
      reports.push({
        id: report.id,
        name: report.name || "Unnamed report",
        workspaceId: workspace.id,
        workspaceName: workspace.name || "Unnamed workspace",
        datasetId: report.datasetId || null
      });
    }

    for (const dataset of Array.isArray(workspace.datasets) ? workspace.datasets : []) {
      datasets.push({
        id: dataset.id,
        name: dataset.name || "Unnamed dataset",
        workspaceId: workspace.id,
        workspaceName: workspace.name || "Unnamed workspace",
        configuredBy: dataset.configuredBy || null
      });
    }

    for (const dashboard of Array.isArray(workspace.dashboards) ? workspace.dashboards : []) {
      dashboards.push({
        id: dashboard.id,
        name: dashboard.displayName || dashboard.name || "Unnamed dashboard",
        workspaceId: workspace.id,
        workspaceName: workspace.name || "Unnamed workspace"
      });
    }
  }

  return { reports, datasets, dashboards };
}

function summarizeUsage(events, inventory, workspaceMap, dates) {
  const usageEvents = events.filter((event) => usageOperations.has(event.Operation));
  const reportViewEvents = events.filter((event) => event.Operation === "ViewReport");
  const dashboardViewEvents = events.filter((event) => event.Operation === "ViewDashboard");
  const latestDay = dates[dates.length - 1];
  const weekStart = dates[Math.max(0, dates.length - Math.min(7, dates.length))];
  const monthStart = dates[0];

  const distinctUsers = (items) => new Set(items.map(userKey).filter(Boolean)).size;
  const inWindow = (event, startDate) => eventDate(event) >= startDate;
  const userVisitCounts = new Map();
  const workspaceUserVisits = new Map();

  for (const event of usageEvents) {
    const key = userKey(event);
    userVisitCounts.set(key, (userVisitCounts.get(key) || 0) + 1);
    const workspaceKey = event.WorkspaceId || workspaceName(event, workspaceMap);
    if (workspaceKey) {
      const bucket = workspaceUserVisits.get(workspaceKey) || new Map();
      bucket.set(key, (bucket.get(key) || 0) + 1);
      workspaceUserVisits.set(workspaceKey, bucket);
    }
  }

  const repeatUsers = [...userVisitCounts.values()].filter((count) => count > 1).length;
  const activeUserIds = [...userVisitCounts.keys()].sort((a, b) => a.localeCompare(b));
  const viewedReportIds = new Set(reportViewEvents
    .map((event) => event.ReportId || event.ArtifactId || event.ObjectId)
    .filter(Boolean)
    .map((id) => String(id).toLowerCase()));
  const reportsWithViews = new Map();

  for (const event of reportViewEvents) {
    const rawKey = event.ReportId || event.ArtifactId || event.ObjectId || reportName(event);
    const key = String(rawKey).toLowerCase();
    reportsWithViews.set(key, (reportsWithViews.get(key) || 0) + 1);
  }

  const leastViewedReports = inventory.reports
    .map((report) => ({
      report: report.name,
      workspace: report.workspaceName,
      views: reportsWithViews.get(String(report.id || "").toLowerCase()) || 0
    }))
    .sort((a, b) => a.views - b.views || a.report.localeCompare(b.report))
    .slice(0, 8);

  const dailyActiveUsers = dates.map((date) => ({
    date,
    users: distinctUsers(usageEvents.filter((event) => eventDate(event) === date)),
    views: reportViewEvents.filter((event) => eventDate(event) === date).length
  }));

  const workspaceUsageAll = topGroups(
    usageEvents,
    (event) => event.WorkspaceId || workspaceName(event, workspaceMap),
    (event) => workspaceName(event, workspaceMap),
    () => ({}),
    10000
  );

  const topReportsAll = topGroups(
    reportViewEvents,
    (event) => event.ReportId || event.ArtifactId || event.ObjectId || reportName(event),
    reportName,
    (event) => ({
      workspace: workspaceName(event, workspaceMap),
      workspaceId: event.WorkspaceId || null
    }),
    10000
  );

  const topDashboardsAll = topGroups(
    dashboardViewEvents,
    (event) => event.DashboardId || event.ArtifactId || event.ObjectId || event.ItemName,
    (event) => event.ItemName || event.ArtifactName || event.ObjectId || "Unknown dashboard",
    (event) => ({
      workspace: workspaceName(event, workspaceMap),
      workspaceId: event.WorkspaceId || null
    }),
    10000
  );

  const workspaceUserStatsAll = [...workspaceUserVisits.entries()].map(([workspaceId, visits]) => {
    const topUsers = [...visits.entries()]
      .map(([user, count]) => ({ label: user, count }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
    return {
      workspaceId,
      workspace: workspaceMap.get(workspaceId)?.name || workspaceId,
      activeUsers: visits.size,
      usageEvents: [...visits.values()].reduce((sum, count) => sum + count, 0),
      topUsers
    };
  });

  return {
    totalActivityEvents: events.length,
    usageEvents: usageEvents.length,
    reportViews: reportViewEvents.length,
    dashboardViews: dashboardViewEvents.length,
    dau: distinctUsers(usageEvents.filter((event) => eventDate(event) === latestDay)),
    wau: distinctUsers(usageEvents.filter((event) => inWindow(event, weekStart))),
    mau: distinctUsers(usageEvents.filter((event) => inWindow(event, monthStart))),
    repeatUsers,
    repeatVisitPercent: numberPercent(repeatUsers, distinctUsers(usageEvents)),
    latestDay,
    fromDate: monthStart,
    toDate: latestDay,
    dailyActiveUsers,
    topReports: topReportsAll.slice(0, 8),
    topReportsAll,
    leastViewedReports,
    topUsers: topGroups(usageEvents, userKey, userKey, () => ({}), 8),
    topUsersAll: topGroups(usageEvents, userKey, userKey, () => ({}), 10000),
    workspaceUserStatsAll,
    workspaceUsage: workspaceUsageAll.slice(0, 8),
    workspaceUsageAll,
    topDashboards: topDashboardsAll.slice(0, 8),
    topDashboardsAll,
    unavailable: {
      avgSessionDuration: "Not exposed by Power BI Activity Events API",
      departmentAdoption: "Requires Microsoft Graph user profile data",
      inactiveLicensedUsers: "Requires license/user directory data"
    },
    viewedReportIds,
    activeUserIds
  };
}

function workspaceUserIdentity(user) {
  return normalizedEmail(user.emailAddress || user.userPrincipalName || user.identifier || user.principalName || user.displayName);
}

function summarizeUsers(workspaces, usage) {
  const workspaceUsers = new Map();
  const activeUsers = new Set((usage.activeUserIds || []).map(normalizedEmail).filter(Boolean));

  for (const workspace of workspaces) {
    for (const user of Array.isArray(workspace.users) ? workspace.users : []) {
      const id = workspaceUserIdentity(user);
      if (!id || id === "unknown") continue;
      const current = workspaceUsers.get(id) || {
        user: id,
        displayName: user.displayName || id,
        workspaces: new Set(),
        roles: new Set()
      };
      current.workspaces.add(workspace.name || workspace.id);
      current.roles.add(user.groupUserAccessRight || user.workspaceUserAccessRight || "Unknown");
      workspaceUsers.set(id, current);
    }
  }

  const users = [...workspaceUsers.values()].map((user) => ({
    user: user.user,
    displayName: user.displayName,
    workspaceCount: user.workspaces.size,
    roles: [...user.roles].sort().join(", "),
    status: activeUsers.has(user.user) ? "Active" : "Non-active"
  }));

  const inactiveUsers = users
    .filter((user) => user.status === "Non-active")
    .sort((a, b) => b.workspaceCount - a.workspaceCount || a.user.localeCompare(b.user));

  return {
    workspaceUsers: users.length,
    activeUsers: users.filter((user) => user.status === "Active").length,
    inactiveUsers: inactiveUsers.length,
    inactiveUsersAll: inactiveUsers,
    inactiveUsersSample: inactiveUsers.slice(0, 50),
    topUsersAll: usage.topUsersAll || [],
    topUsers: usage.topUsers || []
  };
}

function summarizeRefresh(events, workspaceMap, dates) {
  const refreshEvents = events.filter((event) => event.Operation === "RefreshDataset");
  const failed = refreshEvents.filter((event) => event.IsSuccess === false || String(event.IsSuccess).toLowerCase() === "false");
  const succeeded = refreshEvents.filter((event) => event.IsSuccess === true || String(event.IsSuccess).toLowerCase() === "true");
  const daily = dates.map((date) => ({
    date,
    total: refreshEvents.filter((event) => eventDate(event) === date).length,
    failed: failed.filter((event) => eventDate(event) === date).length
  }));

  return {
    total: refreshEvents.length,
    succeeded: succeeded.length,
    failed: failed.length,
    failedPercent: numberPercent(failed.length, refreshEvents.length),
    daily,
    topFailingDatasets: topGroups(
      failed,
      (event) => event.DatasetId || datasetName(event),
      datasetName,
      (event) => ({
        workspace: workspaceName(event, workspaceMap),
        workspaceId: event.WorkspaceId || null
      }),
      8
    ),
    topFailingDatasetsAll: topGroups(
      failed,
      (event) => event.DatasetId || datasetName(event),
      datasetName,
      (event) => ({
        workspace: workspaceName(event, workspaceMap),
        workspaceId: event.WorkspaceId || null
      }),
      10000
    ),
    topRefreshedDatasets: topGroups(
      refreshEvents,
      (event) => event.DatasetId || datasetName(event),
      datasetName,
      (event) => ({
        workspace: workspaceName(event, workspaceMap),
        workspaceId: event.WorkspaceId || null
      }),
      8
    ),
    topRefreshedDatasetsAll: topGroups(
      refreshEvents,
      (event) => event.DatasetId || datasetName(event),
      datasetName,
      (event) => ({
        workspace: workspaceName(event, workspaceMap),
        workspaceId: event.WorkspaceId || null
      }),
      10000
    ),
    workspaceRefreshAll: topGroups(
      refreshEvents,
      (event) => event.WorkspaceId || workspaceName(event, workspaceMap),
      (event) => workspaceName(event, workspaceMap),
      () => ({}),
      10000
    ),
    workspaceFailuresAll: topGroups(
      failed,
      (event) => event.WorkspaceId || workspaceName(event, workspaceMap),
      (event) => workspaceName(event, workspaceMap),
      () => ({}),
      10000
    )
  };
}

function summarizeGovernance(workspaces, inventory, usage) {
  const viewedReportIds = usage.viewedReportIds || new Set();
  const idleReports = inventory.reports
    .filter((report) => report.id && !viewedReportIds.has(String(report.id).toLowerCase()))
    .map((report) => ({
      workspaceId: report.workspaceId,
      report: report.name,
      workspace: report.workspaceName,
      reason: `No ViewReport event between ${usage.fromDate} and ${usage.toDate}`
    }));

  const duplicateNames = topGroups(
    inventory.reports,
    (report) => report.name.toLowerCase(),
    (report) => report.name,
    () => ({}),
    20
  ).filter((item) => item.count > 1);

  const workspaceScores = workspaces.map((workspace) => {
    const users = Array.isArray(workspace.users) ? workspace.users : [];
    const admins = users.filter((user) => String(user.groupUserAccessRight || user.workspaceUserAccessRight || "").toLowerCase() === "admin");
    const reportCount = Array.isArray(workspace.reports) ? workspace.reports.length : 0;
    const datasetCount = Array.isArray(workspace.datasets) ? workspace.datasets.length : 0;
    const usageCount = usage.workspaceUsageAll.find((item) => item.key === workspace.id || item.label === workspace.name)?.count || 0;
    const ownershipScore = admins.length > 0 ? 30 : 0;
    const inventoryScore = reportCount + datasetCount > 0 ? 25 : 10;
    const usageScore = usageCount > 0 ? 35 : 0;
    const freshnessScore = reportCount === 0 || idleReports.filter((report) => report.workspace === workspace.name).length < reportCount ? 10 : 0;

    return {
      workspace: workspace.name || workspace.id,
      workspaceId: workspace.id,
      score: Math.min(100, ownershipScore + inventoryScore + usageScore + freshnessScore),
      admins: admins.length,
      users: users.length,
      reports: reportCount,
      datasets: datasetCount,
      dashboards: Array.isArray(workspace.dashboards) ? workspace.dashboards.length : 0,
      usageEvents: usageCount
    };
  });

  const orphaned = workspaceScores.filter((workspace) => workspace.admins === 0).length;
  const activeOwnerCoverage = numberPercent(workspaceScores.length - orphaned, workspaceScores.length);
  const workspaceHealthScore = workspaceScores.length
    ? Math.round(workspaceScores.reduce((sum, workspace) => sum + workspace.score, 0) / workspaceScores.length)
    : 0;

  return {
    idleReports: idleReports.slice(0, 12),
    idleReportsAll: idleReports,
    idleReportCount: idleReports.length,
    idleReportPercent: numberPercent(idleReports.length, inventory.reports.length),
    duplicateReportNames: duplicateNames.slice(0, 8),
    orphanedWorkspaces: orphaned,
    ownerCoveragePercent: activeOwnerCoverage,
    workspaceHealthScore,
    workspaceScores: workspaceScores.sort((a, b) => a.score - b.score).slice(0, 12),
    workspaceScoresAll: workspaceScores.sort((a, b) => a.workspace.localeCompare(b.workspace)),
    limitations: {
      idle60Days: "Requires stored historical Activity Events beyond the live API pull window",
      idle90Days: "Requires stored historical Activity Events beyond the live API pull window"
    }
  };
}

async function getLiveSummary(options = {}) {
  const days = clampDays(options.days);
  const targetUser = normalizedEmail(process.env.POWERBI_TARGET_USER);
  const cacheKey = `days:${days}:target:${targetUser || "all"}`;

  if (!targetUser) {
    return {
      generatedAt: new Date().toISOString(),
      token: {
        ok: false,
        message: "POWERBI_TARGET_USER is required. The dashboard is locked to a single Premium Per User mailbox and will not fetch tenant-wide workspaces."
      },
      endpoints: [],
      totals: {
        workspaces: 0,
        reports: 0,
        datasets: 0,
        dashboards: 0,
        activityEvents: 0
      },
      excluded: {
        personalWorkspaces: 0,
        tkmWorkspaces: 0,
        nonTargetUserWorkspaces: 0
      },
      targetUser: null,
      state: "missing-target-user"
    };
  }

  if (!options.refresh && liveCache.has(cacheKey)) {
    const cached = liveCache.get(cacheKey);
    return {
      ...cached.payload,
      cache: {
        ...(cached.payload.cache || {}),
        source: "memory",
        loadedAt: new Date().toISOString()
      }
    };
  }

  if (!options.refresh) {
    const cached = await readDiskCache(days, targetUser);
    if (cached) {
      liveCache.set(cacheKey, { payload: cached });
      return cached;
    }
  }

  const token = await getPowerBiToken();

  if (!token.ok) {
    return {
      generatedAt: new Date().toISOString(),
      token: {
        ok: false,
        message: token.message
      },
      endpoints: [],
      totals: {
        workspaces: 0,
        reports: 0,
        datasets: 0,
        dashboards: 0,
        activityEvents: 0
      },
      state: "missing-config"
    };
  }

  const [normalWorkspaces, adminWorkspaces, activity] = await Promise.all([
    probePowerBiEndpoint("Workspace access", "https://api.powerbi.com/v1.0/myorg/groups?$top=5000", token.accessToken),
    fetchWorkspaceMetadata(token.accessToken).catch((error) => ({
      name: "Tenant admin workspaces",
      ok: false,
      status: error.status || null,
      itemCount: null,
      error: error.body?.Message || error.body?.error_description || error.message,
      body: error.body || null
    })),
    fetchActivityEvents(token.accessToken, days)
  ]);

  const adminValues = Array.isArray(adminWorkspaces?.body?.value) ? adminWorkspaces.body.value : [];
  const normalValues = Array.isArray(normalWorkspaces?.body?.value) ? normalWorkspaces.body.value : [];
  const rawWorkspaceValues = adminValues.length ? adminValues : normalValues;
  const personalWorkspaceCount = rawWorkspaceValues.filter(isPersonalWorkspace).length;
  const nonPersonalValues = rawWorkspaceValues.filter((workspace) => !isPersonalWorkspace(workspace));
  const tkmWorkspaceCount = nonPersonalValues.filter(isTkmWorkspace).length;
  const nonTkmValues = nonPersonalValues.filter((workspace) => !isTkmWorkspace(workspace));
  const targetUserExcludedCount = targetUser
    ? nonTkmValues.filter((workspace) => !workspaceHasUser(workspace, targetUser)).length
    : 0;
  const workspaceValues = nonTkmValues.filter((workspace) => workspaceHasUser(workspace, targetUser));
  const workspaceMap = new Map(workspaceValues.map((workspace) => [workspace.id, workspace]));
  const inventory = flattenInventory(workspaceValues);
  const usage = summarizeUsage(activity.events, inventory, workspaceMap, activity.dates);
  const refresh = summarizeRefresh(activity.events, workspaceMap, activity.dates);
  const governance = summarizeGovernance(workspaceValues, inventory, usage);
  const users = summarizeUsers(workspaceValues, usage);
  const endpoints = [normalWorkspaces, adminWorkspaces, activity.endpoint];

  const totals = {
    workspaces: workspaceValues.length,
    reports: inventory.reports.length,
    datasets: inventory.datasets.length,
    dashboards: inventory.dashboards.length,
    activityEvents: activity.events.length
  };

  const payload = {
    generatedAt: new Date().toISOString(),
    window: {
      requestedDays: days,
      fromDate: activity.fromDate,
      toDate: activity.toDate,
      pagesRead: activity.pageCount
    },
    token: {
      ok: true,
      expiresIn: token.expiresIn,
      tenantId: token.tenantId,
      clientId: token.clientId
    },
    endpoints: endpoints.map((endpoint) => ({
      name: endpoint.name,
      ok: endpoint.ok,
      status: endpoint.status,
      itemCount: endpoint.itemCount,
      error: endpoint.error || null
    })),
    totals,
    excluded: {
      personalWorkspaces: personalWorkspaceCount,
      tkmWorkspaces: tkmWorkspaceCount,
      nonTargetUserWorkspaces: targetUserExcludedCount
    },
    targetUser: targetUser || null,
    sampleWorkspaces: workspaceValues.slice(0, 5).map((workspace) => ({
      id: workspace.id,
      name: workspace.name,
      type: workspace.type,
      state: workspace.state,
      reports: Array.isArray(workspace.reports) ? workspace.reports.length : 0,
      datasets: Array.isArray(workspace.datasets) ? workspace.datasets.length : 0,
      dashboards: Array.isArray(workspace.dashboards) ? workspace.dashboards.length : 0
    })),
    workspaces: workspaceValues
      .map((workspace) => ({
        id: workspace.id,
        name: workspace.name || workspace.id,
        type: workspace.type,
        state: workspace.state,
        users: Array.isArray(workspace.users) ? workspace.users.length : 0,
        reports: Array.isArray(workspace.reports) ? workspace.reports.length : 0,
        datasets: Array.isArray(workspace.datasets) ? workspace.datasets.length : 0,
        dashboards: Array.isArray(workspace.dashboards) ? workspace.dashboards.length : 0
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    usage: {
      ...usage,
      viewedReportIds: undefined,
      activeUserIds: undefined
    },
    users,
    refresh,
    governance,
    state: endpoints.every((endpoint) => endpoint.ok) ? "connected" : "limited"
  };
  payload.cache = {
    source: "live-api",
    savedAt: new Date().toISOString()
  };

  liveCache.set(cacheKey, { payload });
  await writeDiskCache(days, payload, targetUser);

  return payload;
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host}`);

    if (url.pathname === "/api/live-summary") {
      sendJson(response, 200, await getLiveSummary({
        days: url.searchParams.get("days"),
        refresh: url.searchParams.get("refresh") === "1"
      }));
      return;
    }

    const requested = url.pathname === "/" ? "/index.html" : url.pathname;
    const normalized = path.normalize(decodeURIComponent(requested)).replace(/^[/\\]+/, "");
    const filePath = path.resolve(root, normalized);

    if (!filePath.toLowerCase().startsWith(root.toLowerCase())) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    const body = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": mime[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Power BI prototype running at http://localhost:${port}/`);
});
