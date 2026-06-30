const pages = {
  executive: {
    title: "Power BI Premium Command Center",
    trendKicker: "Adoption",
    trendTitle: "Active User Trend",
    trendStatus: ["Healthy", "healthy"],
    kpis: [
      { label: "Total Active Users", value: "18.4K", status: ["+12.6%", "healthy"], meta: ["DAU 2.8K", "WAU 9.6K", "MAU 18.4K"], spark: [24, 29, 31, 28, 36, 42, 47] },
      { label: "Failed Refreshes Today", value: "37", status: ["4.8%", "critical"], meta: ["Top: Finance Model", "Gateway 41%", "Timeout 27%"], spark: [18, 16, 22, 19, 30, 28, 37] },
      { label: "Idle Reports > 60 Days", value: "412", status: ["Review", "review"], meta: ["96 owners", "143 workspaces", "61 never viewed"], spark: [520, 498, 476, 460, 444, 429, 412] },
      { label: "Refresh Reliability", value: "94%", status: ["Watch", "review"], meta: ["37 failed today", "9 SLA missed", "146 retries"], spark: [91, 92, 93, 92, 94, 93, 94] },
      { label: "Workspace Health", value: "82", status: ["Healthy", "healthy"], meta: ["312 healthy", "48 review", "11 critical"], spark: [74, 75, 78, 79, 80, 81, 82] }
    ],
    trend: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      series: [
        { name: "DAU", color: "azure", values: [2100, 2350, 2480, 2390, 2710, 2600, 2820] },
        { name: "WAU", color: "violet", values: [8200, 8500, 8740, 9100, 9300, 9480, 9600] },
        { name: "MAU", color: "teal", values: [16300, 16600, 17000, 17300, 17700, 18100, 18400] }
      ]
    },
    bars: [
      ["Completed", 91, "healthy"],
      ["Failed", 5, "critical"],
      ["SLA missed", 8, "review"],
      ["Retried", 14, "review"]
    ],
    heatmap: [
      ["Sales", 91], ["Finance", 72], ["Ops", 84], ["HR", 67], ["IT", 88], ["Risk", 55],
      ["Supply", 79], ["Legal", 62], ["Marketing", 86], ["CX", 92], ["Data", 77], ["Audit", 58]
    ],
    table: {
      headers: ["Priority", "Asset", "Owner", "Workspace", "Status"],
      rows: [
        ["P1", "Finance Executive Model", "A. Mehra", "Corp Finance", "Critical"],
        ["P1", "Premium Capacity P1", "Platform Ops", "Tenant", "Watch"],
        ["P2", "Sales Pipeline Report", "D. Rao", "Sales BI", "Review"],
        ["P2", "Unused Procurement Pack", "M. Shah", "Supply Chain", "Idle"]
      ]
    },
    actions: [
      ["Stabilize finance refresh", "Credentials and gateway failures are driving 41% of today's failed refreshes."],
      ["Review idle executive assets", "23 high-criticality reports have no views in more than 60 days."],
      ["Shift background refresh window", "Capacity pressure peaks between 08:30 and 10:00 local time."]
    ]
  },
  refresh: {
    title: "Dataset Refresh Control Tower",
    trendKicker: "Refresh",
    trendTitle: "Duration and Failure Trend",
    trendStatus: ["37 failures", "critical"],
    kpis: [
      { label: "Failures Today", value: "37", status: ["Critical", "critical"], meta: ["4.8% failed", "9 SLA missed", "14 retries"], spark: [12, 14, 10, 18, 22, 31, 37] },
      { label: "Refresh SLA", value: "94.2%", status: ["-1.8%", "review"], meta: ["Target 98%", "P95 42 min", "9 missed"], spark: [98, 97, 96, 95, 96, 94, 94] },
      { label: "Slow Datasets", value: "28", status: ["Review", "review"], meta: ["P95 > 45 min", "11 critical", "6 growing"], spark: [21, 24, 20, 23, 25, 27, 28] },
      { label: "Stale Datasets", value: "19", status: ["Review", "review"], meta: ["12 > 24 hrs", "7 disabled", "5 no owner"], spark: [31, 28, 26, 24, 21, 20, 19] },
      { label: "Retry Pressure", value: "146", status: ["High", "critical"], meta: ["Finance top", "Gateway 41%", "Timeout 27%"], spark: [88, 92, 100, 112, 130, 138, 146] }
    ],
    trend: {
      labels: ["00", "04", "08", "12", "16", "20", "24"],
      series: [
        { name: "Failures", color: "red", values: [2, 4, 13, 7, 5, 4, 2] },
        { name: "P95 min", color: "amber", values: [28, 31, 57, 46, 39, 34, 30] },
        { name: "Retries", color: "violet", values: [16, 18, 44, 28, 21, 13, 6] }
      ]
    },
    bars: [
      ["Credentials", 41, "critical"],
      ["Gateway", 29, "critical"],
      ["Source timeout", 18, "review"],
      ["Mashup", 12, "review"]
    ],
    heatmap: [
      ["Finance", 52], ["Sales", 77], ["Ops", 69], ["HR", 83], ["Supply", 61], ["Risk", 58],
      ["Legal", 90], ["Audit", 64], ["Marketing", 86], ["CX", 79], ["IT", 74], ["Data", 68]
    ],
    table: {
      headers: ["Dataset", "Workspace", "Last Status", "Duration", "Owner"],
      rows: [
        ["Finance Executive Model", "Corp Finance", "Failed", "61 min", "A. Mehra"],
        ["Revenue Forecast", "Sales BI", "Failed", "49 min", "D. Rao"],
        ["Inventory Snapshot", "Supply Chain", "Completed", "52 min", "M. Shah"],
        ["Claims Lake Model", "Risk Analytics", "Failed", "33 min", "N. Iyer"]
      ]
    },
    actions: [
      ["Reset gateway credentials", "Finance Executive Model failed four times with credential exceptions."],
      ["Reschedule heavy refreshes", "Seven large semantic models overlap during the 08:00 peak window."],
      ["Partition inventory model", "Inventory Snapshot has a stable success rate but a rising P95 duration."]
    ]
  },
  adoption: {
    title: "Usage and Adoption Analytics",
    trendKicker: "Adoption",
    trendTitle: "Engagement by User Segment",
    trendStatus: ["Growing", "healthy"],
    kpis: [
      { label: "Daily Active Users", value: "2.8K", status: ["+8.1%", "healthy"], meta: ["Viewers today", "1.6K repeat", "340 new"], spark: [2100, 2210, 2350, 2420, 2500, 2680, 2820] },
      { label: "Weekly Active Users", value: "9.6K", status: ["+5.4%", "healthy"], meta: ["52% of monthly users", "2.1K power users", "1.4K inactive"], spark: [8200, 8400, 8600, 8900, 9200, 9480, 9600] },
      { label: "Monthly Active Users", value: "18.4K", status: ["+12.6%", "healthy"], meta: ["77 departments", "312 workspaces", "894 reports"], spark: [16300, 16600, 17000, 17300, 17700, 18100, 18400] },
      { label: "Retention", value: "68%", status: ["+3.2%", "healthy"], meta: ["30-day cohort", "22% weekly", "10% dormant"], spark: [58, 60, 61, 63, 64, 66, 68] },
      { label: "Avg Session", value: "11m", status: ["Stable", "info"], meta: ["Repeat 18m", "New 6m", "Mobile 14%"], spark: [8, 9, 11, 10, 12, 11, 11] }
    ],
    trend: {
      labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7"],
      series: [
        { name: "Power", color: "violet", values: [1600, 1700, 1820, 1900, 1990, 2070, 2120] },
        { name: "Repeat", color: "green", values: [4400, 4600, 4800, 5100, 5300, 5520, 5780] },
        { name: "Inactive", color: "red", values: [2400, 2300, 2180, 2050, 1920, 1730, 1410] }
      ]
    },
    bars: [
      ["Sales", 92, "healthy"],
      ["Finance", 88, "healthy"],
      ["Operations", 74, "review"],
      ["HR", 61, "review"]
    ],
    heatmap: [
      ["Sales", 92], ["Finance", 88], ["Ops", 74], ["HR", 61], ["IT", 84], ["Risk", 69],
      ["Supply", 77], ["Legal", 58], ["Marketing", 81], ["CX", 86], ["Data", 94], ["Audit", 63]
    ],
    table: {
      headers: ["Report", "Workspace", "Views 30 Days", "Users", "Trend"],
      rows: [
        ["Revenue Pulse", "Sales BI", "48.2K", "7.1K", "+18%"],
        ["Finance Close", "Corp Finance", "33.7K", "4.8K", "+9%"],
        ["Inventory Control", "Supply Chain", "21.4K", "3.2K", "+4%"],
        ["HR Workforce", "People Analytics", "12.1K", "2.4K", "-2%"]
      ]
    },
    actions: [
      ["Target inactive managers", "1.4K licensed users have not consumed governed content in 30 days."],
      ["Promote high-retention reports", "Revenue Pulse and Finance Close are strong adoption anchors."],
      ["Review low-repeat areas", "Legal and HR show lower repeat visit behavior than tenant average."]
    ]
  },
  idle: {
    title: "Idle Asset Governance Center",
    trendKicker: "Idle assets",
    trendTitle: "Idle Aging Funnel",
    trendStatus: ["412 idle", "review"],
    kpis: [
      { label: "Idle > 30 Days", value: "738", status: ["18%", "review"], meta: ["Reports", "51 dashboards", "44 models"], spark: [810, 790, 770, 755, 748, 742, 738] },
      { label: "Idle > 60 Days", value: "412", status: ["10%", "review"], meta: ["143 workspaces", "96 owners", "61 never viewed"], spark: [520, 498, 476, 460, 444, 429, 412] },
      { label: "Idle > 90 Days", value: "233", status: ["High", "critical"], meta: ["58 high-risk", "31 certified", "22 apps"], spark: [260, 255, 248, 244, 239, 236, 233] },
      { label: "Duplicates", value: "86", status: ["Review", "review"], meta: ["31 names", "18 owners", "9 domains"], spark: [102, 99, 96, 91, 90, 88, 86] },
      { label: "Abandoned Workspaces", value: "11", status: ["Critical", "critical"], meta: ["No active owner", "4 critical", "7 inactive"], spark: [8, 8, 9, 10, 10, 11, 11] }
    ],
    trend: {
      labels: ["Active", "30D", "60D", "90D", "Never", "Archive", "Retain"],
      series: [
        { name: "Assets", color: "amber", values: [3160, 738, 412, 233, 61, 164, 92] },
        { name: "High risk", color: "red", values: [120, 82, 71, 58, 29, 45, 13] }
      ]
    },
    bars: [
      ["Archive", 44, "critical"],
      ["Review", 31, "review"],
      ["Optimize", 17, "info"],
      ["Retain", 8, "healthy"]
    ],
    heatmap: [
      ["Sales", 74], ["Finance", 61], ["Ops", 56], ["HR", 68], ["IT", 82], ["Risk", 49],
      ["Supply", 54], ["Legal", 47], ["Marketing", 78], ["CX", 72], ["Data", 86], ["Audit", 51]
    ],
    table: {
      headers: ["Asset", "Owner", "Workspace", "Idle Age", "Recommendation"],
      rows: [
        ["Legacy Margin Pack", "A. Mehra", "Corp Finance", "117 days", "Archive"],
        ["Procurement Snapshot", "M. Shah", "Supply Chain", "96 days", "Review"],
        ["Campaign Draft", "R. Gill", "Marketing", "74 days", "Optimize"],
        ["Audit Binder", "N. Iyer", "Risk Analytics", "Never", "Review"]
      ]
    },
    actions: [
      ["Archive low-risk idle reports", "164 reports meet archive criteria and have no criticality override."],
      ["Confirm certified idle assets", "31 certified assets have no consumption in more than 90 days."],
      ["Clean abandoned workspaces", "11 workspaces need owner remediation before deletion decisions."]
    ]
  },
  workspace: {
    title: "Workspace Governance",
    trendKicker: "Governance",
    trendTitle: "Workspace Score Distribution",
    trendStatus: ["82 avg", "healthy"],
    kpis: [
      { label: "Workspaces", value: "371", status: ["Active", "info"], meta: ["312 healthy", "48 review", "11 critical"], spark: [350, 354, 360, 362, 366, 369, 371] },
      { label: "Avg Health", value: "82", status: ["Healthy", "healthy"], meta: ["Usage 86", "Refresh 91", "Owner 78"], spark: [74, 75, 78, 79, 80, 81, 82] },
      { label: "Orphaned", value: "11", status: ["Critical", "critical"], meta: ["4 high critical", "7 inactive", "0 owner"], spark: [7, 7, 9, 9, 10, 10, 11] },
      { label: "Inactive WS", value: "38", status: ["Review", "review"], meta: [">60 days", "12 prod", "8 certified"], spark: [44, 43, 42, 41, 39, 38, 38] },
      { label: "Owner Coverage", value: "91%", status: ["+2%", "healthy"], meta: ["2+ active owners", "17 single owner", "11 none"], spark: [84, 85, 86, 88, 89, 90, 91] }
    ],
    trend: {
      labels: ["0-50", "50-60", "60-70", "70-80", "80-90", "90-100"],
      series: [
        { name: "Workspaces", color: "green", values: [11, 18, 30, 62, 146, 104] },
        { name: "Criticality", color: "red", values: [8, 11, 16, 24, 31, 20] }
      ]
    },
    bars: [
      ["Usage", 86, "healthy"],
      ["Refresh", 91, "healthy"],
      ["Ownership", 78, "review"],
      ["Stale content", 74, "review"]
    ],
    heatmap: [
      ["Sales", 91], ["Finance", 77], ["Ops", 82], ["HR", 69], ["IT", 88], ["Risk", 57],
      ["Supply", 75], ["Legal", 66], ["Marketing", 83], ["CX", 90], ["Data", 87], ["Audit", 59]
    ],
    table: {
      headers: ["Workspace", "Owner", "Members", "Assets", "Score"],
      rows: [
        ["Sales BI", "D. Rao", "184", "91", "91"],
        ["Corp Finance", "A. Mehra", "96", "64", "77"],
        ["Risk Analytics", "N. Iyer", "42", "38", "57"],
        ["Supply Chain", "M. Shah", "88", "49", "75"]
      ]
    },
    actions: [
      ["Add secondary owners", "17 production workspaces have only one active admin."],
      ["Remediate orphaned workspaces", "11 workspaces have no active owner and need reassignment."],
      ["Review low-score domains", "Risk and Audit have the highest concentration of critical scores."]
    ]
  },
  capacity: {
    title: "Premium Per User Monitoring",
    trendKicker: "PPU Workspaces",
    trendTitle: "Refresh Load and Usage Signals",
    trendStatus: ["Healthy", "healthy"],
    kpis: [
      { label: "PPU Workspaces", value: "126", status: ["Active", "info"], meta: ["94 governed", "18 review", "14 critical"], spark: [102, 108, 112, 116, 119, 123, 126] },
      { label: "Refreshes Today", value: "684", status: ["Normal", "healthy"], meta: ["37 failed", "9 SLA missed", "146 retries"], spark: [420, 462, 510, 590, 642, 671, 684] },
      { label: "Failed Refreshes", value: "37", status: ["Critical", "critical"], meta: ["Gateway 41%", "Timeout 27%", "Credentials 18%"], spark: [12, 14, 10, 18, 22, 31, 37] },
      { label: "Large Semantic Models", value: "18", status: ["Review", "review"], meta: ["Near 100GB limit", "6 growing", "3 critical"], spark: [11, 12, 13, 15, 16, 17, 18] },
      { label: "PPU Licensed Users", value: "2.4K", status: ["Active", "healthy"], meta: ["1.8K active", "420 inactive", "140 new"], spark: [1900, 1980, 2050, 2110, 2220, 2320, 2400] }
    ],
    trend: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      series: [
        { name: "Refreshes", color: "teal", values: [510, 544, 601, 590, 642, 671, 684] },
        { name: "Failures", color: "red", values: [18, 16, 22, 19, 30, 28, 37] },
        { name: "Views", color: "azure", values: [2100, 2350, 2480, 2390, 2710, 2600, 2820] }
      ]
    },
    bars: [
      ["Refresh load", 76, "review"],
      ["Model size risk", 42, "review"],
      ["Inactive users", 18, "info"],
      ["Owner risk", 11, "critical"]
    ],
    heatmap: [
      ["Sales", 89], ["Finance", 72], ["Ops", 81], ["HR", 67], ["IT", 86], ["Risk", 58],
      ["Supply", 77], ["Legal", 63], ["Marketing", 84], ["CX", 90], ["Data", 83], ["Audit", 60]
    ],
    table: {
      headers: ["Workspace", "Signal", "Count", "Risk", "Owner"],
      rows: [
        ["Corp Finance", "Failed refreshes", "14", "Critical", "A. Mehra"],
        ["Sales BI", "Large semantic models", "5", "Review", "D. Rao"],
        ["Supply Chain", "Inactive users", "42", "Review", "M. Shah"],
        ["Risk Analytics", "Single owner", "1", "Critical", "N. Iyer"]
      ]
    },
    actions: [
      ["Monitor refresh pressure", "PPU does not expose CPU or memory metrics, so refresh failures and durations are the best operational signal."],
      ["Review large semantic models", "18 models are approaching high-size governance thresholds and need owner review."],
      ["Clean inactive PPU access", "420 licensed users have no recent report activity and should be reviewed."]
    ]
  }
};

const colorMap = {
  azure: "--azure",
  green: "--green",
  amber: "--amber",
  red: "--red",
  violet: "--violet",
  teal: "--teal"
};

const dateFilters = {
  "7": { label: "Last 7 days", factor: 0.35 },
  "30": { label: "Last 30 days", factor: 1 }
};

const scopeFilters = {
  all: { label: "all governed workspaces, excluding personal and TKM workspaces", factor: 1, score: 0 }
};

let activePage = "executive";
let filterState = {
  dateRange: "7",
  scope: "all"
};
let liveSummary = null;
let trendHoverData = null;

function cssVar(name) {
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

function statusClass(label) {
  const value = String(label).toLowerCase();
  if (value.includes("critical") || value.includes("failed") || value.includes("archive")) return "critical";
  if (value.includes("watch") || value.includes("review") || value.includes("idle")) return "review";
  if (value.includes("healthy") || value.includes("completed") || value.includes("retain")) return "healthy";
  return "info";
}

function currentFilterContext() {
  const workspace = selectedWorkspace();
  const userSuffix = liveSummary?.targetUser ? ` for ${liveSummary.targetUser}` : "";
  return {
    date: dateFilters[filterState.dateRange],
    scope: workspace
      ? { label: workspace.name, factor: 1, score: 0 }
      : {
          ...(scopeFilters[filterState.scope] || scopeFilters.all),
          label: `${(scopeFilters[filterState.scope] || scopeFilters.all).label}${userSuffix}`
        }
  };
}

function formatCount(value) {
  if (value >= 1000) {
    const scaled = value / 1000;
    return `${scaled >= 10 ? scaled.toFixed(0) : scaled.toFixed(1)}K`;
  }
  return `${Math.max(0, Math.round(value))}`;
}

function formatApiCount(value) {
  if (!Number.isFinite(value)) return "0";
  return formatCount(value);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function pct(value) {
  const number = Number(value || 0);
  return `${Number.isInteger(number) ? number.toFixed(0) : number.toFixed(1)}%`;
}

function safeNumber(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function numberPercent(numerator, denominator) {
  if (!denominator) return 0;
  return Math.round((safeNumber(numerator) / safeNumber(denominator)) * 1000) / 10;
}

function compactSpark(values) {
  const cleaned = values.map((value) => safeNumber(value));
  if (cleaned.length >= 2) return cleaned;
  return [0, cleaned[0] || 0];
}

function barValue(value, max) {
  if (!max) return 0;
  return Math.max(0, Math.min(100, Math.round((value / max) * 100)));
}

function statusForPercent(value, warningAt, criticalAt) {
  if (value >= criticalAt) return "critical";
  if (value >= warningAt) return "review";
  return "healthy";
}

function statusForScore(value) {
  if (value >= 80) return "healthy";
  if (value >= 60) return "review";
  return "critical";
}

function shortDateLabel(date) {
  return String(date || "").slice(5) || "API";
}

function emptyRows(message, columns) {
  return [[message, ...Array.from({ length: columns - 1 }, () => "No API data")]];
}

function selectedWorkspace() {
  if (filterState.scope === "all") return null;
  return (liveSummary?.workspaces || []).find((workspace) => workspace.id === filterState.scope) || null;
}

function isSelectedWorkspace(item, workspace) {
  if (!workspace) return true;
  return item?.workspaceId === workspace.id || item?.extra?.workspaceId === workspace.id || item?.workspace === workspace.name || item?.label === workspace.name;
}

function firstMetric(items, workspace) {
  return (items || []).find((item) => isSelectedWorkspace(item, workspace)) || null;
}

function workspaceScoped(items) {
  const workspace = selectedWorkspace();
  if (!workspace) return items || [];
  return (items || []).filter((item) => isSelectedWorkspace(item, workspace));
}

function tableHtml(headers, rows) {
  const head = headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("");
  const body = rows.length
    ? rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")
    : `<tr><td colspan="${headers.length}">No API data returned for this selection</td></tr>`;
  return `<div class="data-table"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

function modalStats(stats) {
  return `<div class="detail-grid">${stats.map(([label, value]) => `
    <div class="detail-stat">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `).join("")}</div>`;
}

function metricPage(title) {
  const labels = ["Loading", "API"];
  return {
    title,
    trendKicker: "Power BI API",
    trendTitle: "Loading Live Data",
    trendStatus: ["Loading", "info"],
    kpis: [
      { label: "API Connection", value: "Loading", status: ["Starting", "info"], meta: ["No dummy data", "Waiting for API", "Live only"], spark: [0, 0] },
      { label: "Workspaces", value: "0", status: ["Loading", "info"], meta: ["API total", "No mock values", "Live only"], spark: [0, 0] },
      { label: "Reports", value: "0", status: ["Loading", "info"], meta: ["API total", "No mock values", "Live only"], spark: [0, 0] },
      { label: "Datasets", value: "0", status: ["Loading", "info"], meta: ["API total", "No mock values", "Live only"], spark: [0, 0] },
      { label: "Activity Events", value: "0", status: ["Loading", "info"], meta: ["API total", "No mock values", "Live only"], spark: [0, 0] }
    ],
    trend: {
      labels,
      series: [
        { name: "API", color: "azure", values: [0, 0] }
      ]
    },
    bars: [["Loading API", 0, "info"]],
    heatmap: [["API", 0]],
    table: {
      headers: ["Status", "Source", "Window", "Scope", "Result"],
      rows: [["Loading", "Power BI REST API", "Waiting", "Accessible workspaces", "No dummy data"]]
    },
    actions: [["Waiting for API", "The dashboard will render only values returned by Power BI REST APIs."]]
  };
}

function buildLoadingPages() {
  return {
    executive: metricPage("Power BI Premium Command Center"),
    refresh: metricPage("Dataset Refresh Control Tower"),
    adoption: metricPage("Usage and Adoption Analytics"),
    idle: metricPage("Idle Asset Governance Center"),
    workspace: metricPage("Workspace Governance"),
    capacity: metricPage("Premium Per User Monitoring")
  };
}

function buildApiPages() {
  if (!liveSummary?.token?.ok) return buildLoadingPages();

  const selected = selectedWorkspace();
  const globalTotals = liveSummary.totals || {};
  const usage = liveSummary.usage || {};
  const refresh = liveSummary.refresh || {};
  const governance = liveSummary.governance || {};
  const windowInfo = liveSummary.window || {};
  const dailyUsage = usage.dailyActiveUsers || [];
  const dailyRefresh = refresh.daily || [];
  const workspaceMetric = selected ? (governance.workspaceScoresAll || []).find((item) => item.workspaceId === selected.id) : null;
  const workspaceUsageMetric = selected ? firstMetric(usage.workspaceUsageAll || [], selected) : null;
  const workspaceRefreshMetric = selected ? firstMetric(refresh.workspaceRefreshAll || [], selected) : null;
  const workspaceFailureMetric = selected ? firstMetric(refresh.workspaceFailuresAll || [], selected) : null;
  const workspaceUserStats = selected ? (usage.workspaceUserStatsAll || []).find((item) => item.workspaceId === selected.id || item.workspace === selected.name) : null;
  const totals = selected
    ? {
        workspaces: 1,
        reports: selected.reports || workspaceMetric?.reports || 0,
        datasets: selected.datasets || workspaceMetric?.datasets || 0,
        dashboards: selected.dashboards || workspaceMetric?.dashboards || 0,
        activityEvents: (workspaceUsageMetric?.count || 0) + (workspaceRefreshMetric?.count || 0)
      }
    : globalTotals;
  const selectedReportViews = selected ? (workspaceUsageMetric?.count || 0) : usage.reportViews;
  const selectedRefreshTotal = selected ? (workspaceRefreshMetric?.count || 0) : refresh.total;
  const selectedRefreshFailed = selected ? (workspaceFailureMetric?.count || 0) : refresh.failed;
  const selectedFailedPercent = numberPercent(selectedRefreshFailed, selectedRefreshTotal);
  const selectedIdleReports = selected ? (governance.idleReportsAll || []).filter((item) => item.workspaceId === selected.id) : (governance.idleReports || []);
  const selectedTopReports = selected ? (usage.topReportsAll || []).filter((item) => isSelectedWorkspace(item, selected)).slice(0, 8) : (usage.topReports || []);
  const selectedTopFailingDatasets = selected ? (refresh.topFailingDatasetsAll || []).filter((item) => isSelectedWorkspace(item, selected)).slice(0, 8) : (refresh.topFailingDatasets || []);
  const selectedTopRefreshedDatasets = selected ? (refresh.topRefreshedDatasetsAll || []).filter((item) => isSelectedWorkspace(item, selected)).slice(0, 8) : (refresh.topRefreshedDatasets || []);
  const selectedWorkspaceScores = selected && workspaceMetric ? [workspaceMetric] : (governance.workspaceScores || []);
  const labels = compactSpark(dailyUsage.map((day) => day.users)).map((_, index) => shortDateLabel(dailyUsage[index]?.date || dailyRefresh[index]?.date || `D${index + 1}`));
  const reportViews = dailyUsage.map((day) => safeNumber(day.views));
  const activeUsers = dailyUsage.map((day) => safeNumber(day.users));
  const refreshFailures = dailyRefresh.map((day) => safeNumber(day.failed));
  const refreshTotals = dailyRefresh.map((day) => safeNumber(day.total));
  const maxRefresh = Math.max(...refreshTotals, 1);
  const maxUsage = Math.max(...reportViews, ...activeUsers, 1);
  const healthScore = selected ? safeNumber(workspaceMetric?.score) : safeNumber(governance.workspaceHealthScore);
  const failedPercent = selected ? safeNumber(selectedFailedPercent) : safeNumber(refresh.failedPercent);
  const idlePercent = selected ? numberPercent(selectedIdleReports.length, totals.reports) : safeNumber(governance.idleReportPercent);
  const selectedIdleCount = selected ? selectedIdleReports.length : safeNumber(governance.idleReportCount);
  const selectedOrphaned = selected ? (safeNumber(workspaceMetric?.admins) === 0 ? 1 : 0) : safeNumber(governance.orphanedWorkspaces);
  const selectedOwnerCoverage = selected ? (selectedOrphaned ? 0 : 100) : safeNumber(governance.ownerCoveragePercent);
  const selectedActiveUsers = selected ? safeNumber(workspaceUserStats?.activeUsers) : safeNumber((liveSummary.users || {}).activeUsers || usage.mau);
  const selectedWorkspaceUsers = selected ? safeNumber(workspaceMetric?.users) : safeNumber((liveSummary.users || {}).workspaceUsers);
  const selectedInactiveUsers = Math.max(0, selectedWorkspaceUsers - selectedActiveUsers);
  const sampleWorkspaces = liveSummary.sampleWorkspaces || [];
  const workspaceScores = selectedWorkspaceScores;

  const topReportRows = selectedTopReports.map((item) => [
    item.label,
    item.extra?.workspace || "Unknown workspace",
    formatApiCount(item.count),
    "ViewReport",
    "API"
  ]);

  const topUserRows = (usage.topUsers || []).map((item) => [
    item.label,
    formatApiCount(item.count),
    "Activity Events",
    `${windowInfo.fromDate || ""} to ${windowInfo.toDate || ""}`,
    "API"
  ]);

  const failingDatasetRows = selectedTopFailingDatasets.map((item) => [
    item.label,
    item.extra?.workspace || "Unknown workspace",
    formatApiCount(item.count),
    pct(failedPercent),
    "Failed"
  ]);

  const refreshedDatasetRows = selectedTopRefreshedDatasets.map((item) => [
    item.label,
    item.extra?.workspace || "Unknown workspace",
    formatApiCount(item.count),
    "RefreshDataset",
    "API"
  ]);

  const idleRows = selectedIdleReports.slice(0, 12).map((item) => [
    item.report,
    item.workspace,
    windowInfo.requestedDays ? `${windowInfo.requestedDays} days` : "API window",
    item.reason,
    "Review"
  ]);

  const workspaceRows = (workspaceScores.length ? workspaceScores : sampleWorkspaces).map((item) => [
    item.workspace || item.name,
    formatApiCount(item.users || 0),
    formatApiCount(item.reports || 0),
    formatApiCount(item.datasets || 0),
    item.score ?? "API"
  ]);

  const workspaceHeat = (workspaceScores.length ? workspaceScores.slice(0, 12) : sampleWorkspaces).map((item) => [
    item.workspace || item.name,
    safeNumber(item.score ?? (item.reports || 0) + (item.datasets || 0))
  ]);

  return {
    executive: {
      title: "Power BI Premium Command Center",
      trendKicker: "Live API",
      trendTitle: "Usage and Refresh Trend",
      trendStatus: [liveSummary.state === "connected" ? "Connected" : "Limited", liveSummary.state === "connected" ? "healthy" : "review"],
      kpis: [
        { label: "Workspaces", value: formatApiCount(totals.workspaces), status: ["API", "healthy"], meta: [`Reports ${formatApiCount(totals.reports)}`, `Datasets ${formatApiCount(totals.datasets)}`, `Dashboards ${formatApiCount(totals.dashboards)}`], spark: [0, totals.workspaces] },
        { label: "Monthly Active Users", value: formatApiCount(selectedActiveUsers), status: ["Activity Events", "healthy"], meta: [`DAU ${formatApiCount(selected ? selectedActiveUsers : usage.dau)}`, `WAU ${formatApiCount(selected ? selectedActiveUsers : usage.wau)}`, `Window ${windowInfo.requestedDays || 0} days`], spark: compactSpark(activeUsers) },
        { label: "Report Views", value: formatApiCount(selectedReportViews), status: ["ViewReport", "info"], meta: [`Usage events ${formatApiCount(selectedReportViews)}`, `Repeat ${pct(usage.repeatVisitPercent)}`, `Pages ${formatApiCount(windowInfo.pagesRead)}`], spark: compactSpark(reportViews) },
        { label: "Failed Refreshes", value: formatApiCount(selectedRefreshFailed), status: [pct(failedPercent), statusForPercent(failedPercent, 5, 15)], meta: [`Refreshes ${formatApiCount(selectedRefreshTotal)}`, `Succeeded ${formatApiCount(Math.max(0, selectedRefreshTotal - selectedRefreshFailed))}`, `API events`], spark: compactSpark(refreshFailures) },
        { label: "Workspace Health", value: formatApiCount(healthScore), status: [statusForScore(healthScore), statusForScore(healthScore)], meta: [`Orphaned ${formatApiCount(selectedOrphaned)}`, `Owner coverage ${pct(selectedOwnerCoverage)}`, `Idle reports ${formatApiCount(selectedIdleCount)}`], spark: compactSpark(workspaceScores.map((item) => item.score)) }
      ],
      trend: {
        labels,
        series: [
          { name: "Active users", color: "azure", values: compactSpark(activeUsers) },
          { name: "Report views", color: "teal", values: compactSpark(reportViews) },
          { name: "Refresh failures", color: "red", values: compactSpark(refreshFailures) }
        ]
      },
      bars: [
        ["Refresh failure rate", Math.min(100, Math.round(failedPercent)), statusForPercent(failedPercent, 5, 15)],
        ["Idle report share", Math.min(100, Math.round(idlePercent)), statusForPercent(idlePercent, 25, 50)],
        ["Owner coverage", Math.min(100, Math.round(governance.ownerCoveragePercent || 0)), "healthy"],
        ["Repeat usage", Math.min(100, Math.round(usage.repeatVisitPercent || 0)), "info"]
      ],
      heatmap: workspaceHeat.length ? workspaceHeat : [["No workspace scores", 0]],
      table: {
        headers: ["Priority", "Asset", "Workspace", "Count", "Signal"],
        rows: failingDatasetRows.length
          ? failingDatasetRows.slice(0, 4).map((row) => ["Refresh failure", row[0], row[1], row[2], row[4]])
          : (topReportRows.length ? topReportRows.slice(0, 4).map((row) => ["Usage", row[0], row[1], row[2], row[3]]) : emptyRows("No API priority items", 5))
      },
      actions: [
        ["Use API data only", `Rendered from Power BI Admin Groups and Activity Events from ${windowInfo.fromDate} to ${windowInfo.toDate}.`],
        ["Refresh failures", `${formatApiCount(selectedRefreshFailed)} failed refresh events found in the selected API window.`],
        ["Idle review", `${formatApiCount(selectedIdleCount)} reports have no ViewReport event in the selected API window.`]
      ]
    },
    refresh: {
      title: "Dataset Refresh Control Tower",
      trendKicker: "RefreshDataset API Events",
      trendTitle: "Refresh Volume and Failures",
      trendStatus: [selectedRefreshFailed ? `${formatApiCount(selectedRefreshFailed)} failures` : "No failures", selectedRefreshFailed ? statusForPercent(failedPercent, 5, 15) : "healthy"],
      kpis: [
        { label: "Refresh Events", value: formatApiCount(selectedRefreshTotal), status: ["API", "info"], meta: [`Window ${windowInfo.requestedDays} days`, `Pages ${formatApiCount(windowInfo.pagesRead)}`, `Activity Events`], spark: compactSpark(refreshTotals) },
        { label: "Succeeded", value: formatApiCount(Math.max(0, selectedRefreshTotal - selectedRefreshFailed)), status: ["Success", "healthy"], meta: [`Total ${formatApiCount(selectedRefreshTotal)}`, `Failed ${formatApiCount(selectedRefreshFailed)}`, `RefreshDataset`], spark: compactSpark(refreshTotals.map((total, index) => total - refreshFailures[index])) },
        { label: "Failed", value: formatApiCount(selectedRefreshFailed), status: [pct(failedPercent), statusForPercent(failedPercent, 5, 15)], meta: [`Failure rate`, `API reported`, `No manual data`], spark: compactSpark(refreshFailures) },
        { label: "Datasets", value: formatApiCount(totals.datasets), status: ["Inventory", "info"], meta: [`From Admin Groups`, `Reports ${formatApiCount(totals.reports)}`, `Workspaces ${formatApiCount(totals.workspaces)}`], spark: [0, totals.datasets] },
        { label: "Top Failing Datasets", value: formatApiCount(selectedTopFailingDatasets.length), status: [selectedRefreshFailed ? "Review" : "Clean", selectedRefreshFailed ? "review" : "healthy"], meta: [`Failed events ${formatApiCount(selectedRefreshFailed)}`, `Grouped by DatasetId`, `API only`], spark: compactSpark(selectedTopFailingDatasets.map((item) => item.count)) }
      ],
      trend: {
        labels,
        series: [
          { name: "Refreshes", color: "teal", values: compactSpark(refreshTotals) },
          { name: "Failures", color: "red", values: compactSpark(refreshFailures) }
        ]
      },
      bars: [
        ["Failure rate", Math.min(100, Math.round(failedPercent)), statusForPercent(failedPercent, 5, 15)],
        ["Success rate", Math.max(0, Math.round(100 - failedPercent)), "healthy"],
        ["Top dataset share", barValue(selectedTopRefreshedDatasets[0]?.count || 0, selectedRefreshTotal), "info"],
        ["API page read share", Math.min(100, safeNumber(windowInfo.pagesRead)), "info"]
      ],
      heatmap: selectedTopRefreshedDatasets.slice(0, 12).map((item) => [item.label, barValue(item.count, selectedRefreshTotal)]) || [["No refresh API data", 0]],
      table: {
        headers: ["Dataset", "Workspace", "Event Count", "Rate", "Status"],
        rows: failingDatasetRows.length ? failingDatasetRows : (refreshedDatasetRows.length ? refreshedDatasetRows : emptyRows("No refresh events returned", 5))
      },
      actions: [
        ["Investigate failed refreshes", `${formatApiCount(selectedRefreshFailed)} failed RefreshDataset events returned by Activity Events.`],
        ["Review top refresh load", `${selectedTopRefreshedDatasets[0]?.label || "No dataset"} has the highest refresh event count in this window.`],
        ["No duration metric shown", "Duration is not present in Activity Events; use dataset refresh history API per dataset for exact duration."]
      ]
    },
    adoption: {
      title: "Usage and Adoption Analytics",
      trendKicker: "Activity Events API",
      trendTitle: "Active Users and Report Views",
      trendStatus: [usage.usageEvents ? "API usage found" : "No usage events", usage.usageEvents ? "healthy" : "review"],
      kpis: [
        { label: "Daily Active Users", value: formatApiCount(selected ? selectedActiveUsers : usage.dau), status: ["Latest day", "info"], meta: [`Date ${usage.latestDay || windowInfo.toDate}`, `View events only`, `API`], spark: compactSpark(activeUsers.slice(-7)) },
        { label: "Weekly Active Users", value: formatApiCount(selected ? selectedActiveUsers : usage.wau), status: ["7 days", "healthy"], meta: [`Activity users`, `No Graph needed`, `API`], spark: compactSpark(activeUsers.slice(-7)) },
        { label: "Monthly Active Users", value: formatApiCount(selectedActiveUsers), status: [`${windowInfo.requestedDays} days`, "healthy"], meta: [`From ${windowInfo.fromDate}`, `To ${windowInfo.toDate}`, `Distinct users`], spark: compactSpark(activeUsers) },
        { label: "Report Views", value: formatApiCount(selectedReportViews), status: ["ViewReport", "info"], meta: [`Dashboards ${formatApiCount(usage.dashboardViews)}`, `Usage events ${formatApiCount(selectedReportViews)}`, `Activity Events`], spark: compactSpark(reportViews) },
        { label: "Non-Active Users", value: formatApiCount(selectedInactiveUsers), status: ["Access review", "review"], meta: [`Active ${formatApiCount(selectedActiveUsers)}`, `Workspace users ${formatApiCount(selectedWorkspaceUsers)}`, `Click to review`], spark: [0, selectedInactiveUsers] }
      ],
      trend: {
        labels,
        series: [
          { name: "Active users", color: "azure", values: compactSpark(activeUsers) },
          { name: "Report views", color: "teal", values: compactSpark(reportViews) }
        ]
      },
      bars: [
        ["Report view share", barValue(selectedReportViews, selected ? selectedReportViews : usage.usageEvents), "info"],
        ["Dashboard view share", barValue(usage.dashboardViews, usage.usageEvents), "info"],
        ["Repeat users", Math.min(100, Math.round(usage.repeatVisitPercent || 0)), "healthy"],
        ["Graph enrichment", 0, "review"]
      ],
      heatmap: (selected ? [workspaceUsageMetric].filter(Boolean) : (usage.workspaceUsage || [])).slice(0, 12).map((item) => [item.label, barValue(item.count, selected ? selectedReportViews : usage.usageEvents)]) || [["No workspace usage", 0]],
      table: {
        headers: ["Report/User", "Workspace/Events", "Count", "Source", "Status"],
        rows: topReportRows.length ? topReportRows : (topUserRows.length ? topUserRows : emptyRows("No usage events returned", 5))
      },
      actions: [
        ["Adoption source", "DAU, WAU, MAU, top reports, and repeat users are calculated only from Activity Events API."],
        ["Department adoption unavailable", usage.unavailable?.departmentAdoption || "Requires Microsoft Graph user profile data."],
        ["Session duration unavailable", usage.unavailable?.avgSessionDuration || "Not exposed by Activity Events API."]
      ]
    },
    idle: {
      title: "Idle Asset Governance Center",
      trendKicker: "Admin Groups + Activity Events",
      trendTitle: "Reports Without ViewReport Events",
      trendStatus: [`${formatApiCount(selectedIdleCount)} reports`, statusForPercent(idlePercent, 25, 50)],
      kpis: [
        { label: "Reports Inventoried", value: formatApiCount(totals.reports), status: ["Admin Groups", "info"], meta: [`Workspaces ${formatApiCount(totals.workspaces)}`, `Datasets ${formatApiCount(totals.datasets)}`, `API`], spark: [0, totals.reports] },
        { label: "No Views in Window", value: formatApiCount(selectedIdleCount), status: [pct(idlePercent), statusForPercent(idlePercent, 25, 50)], meta: [`Window ${windowInfo.requestedDays} days`, `ViewReport only`, `API`], spark: [totals.reports, selectedIdleCount] },
        { label: "Idle Report %", value: pct(idlePercent), status: [statusForPercent(idlePercent, 25, 50), statusForPercent(idlePercent, 25, 50)], meta: [`Reports ${formatApiCount(totals.reports)}`, `Idle ${formatApiCount(selectedIdleCount)}`, `Calculated`], spark: [0, idlePercent] },
        { label: "Duplicate Names", value: formatApiCount((governance.duplicateReportNames || []).length), status: ["API derived", "review"], meta: ["Report inventory", "Name match", "Review"], spark: compactSpark((governance.duplicateReportNames || []).map((item) => item.count)) },
        { label: "60/90 Day Idle", value: "N/A", status: ["Needs history", "review"], meta: ["Live API max", "Store events first", "No dummy"], spark: [0, 0] }
      ],
      trend: {
        labels,
        series: [
          { name: "Report views", color: "teal", values: compactSpark(reportViews) },
          { name: "Idle reports", color: "amber", values: compactSpark(labels.map(() => selectedIdleCount || 0)) }
        ]
      },
      bars: [
        ["Idle in selected window", Math.min(100, Math.round(idlePercent)), statusForPercent(idlePercent, 25, 50)],
        ["Viewed reports", Math.max(0, Math.round(100 - idlePercent)), "healthy"],
        ["Duplicate names", barValue((governance.duplicateReportNames || []).length, totals.reports), "review"],
        ["Long history available", 0, "review"]
      ],
      heatmap: (governance.duplicateReportNames || []).slice(0, 12).map((item) => [item.label, Math.min(100, item.count * 10)]) || [["No duplicate names", 0]],
      table: {
        headers: ["Report", "Workspace", "Window", "Evidence", "Recommendation"],
        rows: idleRows.length ? idleRows : emptyRows("No idle reports returned", 5)
      },
      actions: [
        ["Review no-view reports", `${formatApiCount(selectedIdleCount)} reports have no ViewReport event in this API window.`],
        ["Do not claim 60/90 days yet", governance.limitations?.idle60Days || "Needs stored history."],
        ["Duplicate report names", `${formatApiCount((governance.duplicateReportNames || []).length)} duplicate report-name groups found from API inventory.`]
      ]
    },
    workspace: {
      title: "Workspace Governance",
      trendKicker: "Admin Groups API",
      trendTitle: "Workspace Inventory and Governance Score",
      trendStatus: [`${formatApiCount(totals.workspaces)} workspaces`, "healthy"],
      kpis: [
        { label: "Workspaces", value: formatApiCount(totals.workspaces), status: ["API", "healthy"], meta: [`Reports ${formatApiCount(totals.reports)}`, `Datasets ${formatApiCount(totals.datasets)}`, `Dashboards ${formatApiCount(totals.dashboards)}`], spark: [0, totals.workspaces] },
        { label: "Avg Health", value: formatApiCount(healthScore), status: [statusForScore(healthScore), statusForScore(healthScore)], meta: ["Derived from API", "Ownership", "Usage"], spark: compactSpark(workspaceScores.map((item) => item.score)) },
        { label: "Orphaned", value: formatApiCount(selectedOrphaned), status: [selectedOrphaned ? "Review" : "None", selectedOrphaned ? "review" : "healthy"], meta: ["No admin user", "Admin Groups", "API"], spark: [0, selectedOrphaned] },
        { label: "Owner Coverage", value: pct(selectedOwnerCoverage), status: [statusForScore(selectedOwnerCoverage), statusForScore(selectedOwnerCoverage)], meta: ["Workspace users", "Admin role", "API"], spark: [0, selectedOwnerCoverage] },
        { label: "Activity Events", value: formatApiCount(totals.activityEvents), status: ["API", "info"], meta: [`Pages ${formatApiCount(windowInfo.pagesRead)}`, `From ${windowInfo.fromDate}`, `To ${windowInfo.toDate}`], spark: [0, totals.activityEvents] }
      ],
      trend: {
        labels: workspaceScores.slice(0, 8).map((item) => item.workspace.slice(0, 10)) || ["API", "Data"],
        series: [
          { name: "Score", color: "green", values: compactSpark(workspaceScores.slice(0, 8).map((item) => item.score)) },
          { name: "Usage", color: "azure", values: compactSpark(workspaceScores.slice(0, 8).map((item) => item.usageEvents)) }
        ]
      },
      bars: [
        ["Owner coverage", Math.min(100, Math.round(governance.ownerCoveragePercent || 0)), "healthy"],
        ["Workspace health", Math.min(100, Math.round(healthScore)), statusForScore(healthScore)],
        ["Orphaned share", barValue(selectedOrphaned, totals.workspaces), selectedOrphaned ? "review" : "healthy"],
        ["Idle report share", Math.min(100, Math.round(idlePercent)), statusForPercent(idlePercent, 25, 50)]
      ],
      heatmap: workspaceHeat.length ? workspaceHeat : [["No workspace scores", 0]],
      table: {
        headers: ["Workspace", "Users", "Reports", "Datasets", "Score"],
        rows: workspaceRows.length ? workspaceRows : emptyRows("No workspaces returned", 5)
      },
      actions: [
        ["Governance source", "Workspace score is derived from Admin Groups inventory, workspace users, report inventory, and Activity Events usage."],
        ["Owner remediation", `${formatApiCount(selectedOrphaned)} workspaces have no admin user returned by the API.`],
        ["Inventory verified", `${formatApiCount(totals.reports)} reports and ${formatApiCount(totals.datasets)} datasets returned by Admin Groups API.`]
      ]
    },
    capacity: {
      title: "Premium Per User Monitoring",
      trendKicker: "PPU API Signals",
      trendTitle: "Refresh Load and Usage Signals",
      trendStatus: ["PPU live", "healthy"],
      kpis: [
        { label: "PPU Workspaces", value: formatApiCount(totals.workspaces), status: ["API", "healthy"], meta: ["Admin Groups", "Accessible tenant", "Live"], spark: [0, totals.workspaces] },
        { label: "Refresh Events", value: formatApiCount(selectedRefreshTotal), status: ["Activity API", "info"], meta: [`Failed ${formatApiCount(selectedRefreshFailed)}`, `Succeeded ${formatApiCount(Math.max(0, selectedRefreshTotal - selectedRefreshFailed))}`, `Window ${windowInfo.requestedDays} days`], spark: compactSpark(refreshTotals) },
        { label: "Failed Refreshes", value: formatApiCount(selectedRefreshFailed), status: [pct(failedPercent), statusForPercent(failedPercent, 5, 15)], meta: ["RefreshDataset", "Activity Events", "API"], spark: compactSpark(refreshFailures) },
        { label: "Report Views", value: formatApiCount(selectedReportViews), status: ["ViewReport", "info"], meta: [`Users ${formatApiCount(usage.mau)}`, `Events ${formatApiCount(selectedReportViews)}`, `API`], spark: compactSpark(reportViews) },
        { label: "CPU/Memory", value: "N/A", status: ["Not exposed", "review"], meta: ["PPU license", "No capacity API", "No dummy"], spark: [0, 0] }
      ],
      trend: {
        labels,
        series: [
          { name: "Refreshes", color: "teal", values: compactSpark(refreshTotals) },
          { name: "Failures", color: "red", values: compactSpark(refreshFailures) },
          { name: "Views", color: "azure", values: compactSpark(reportViews) }
        ]
      },
      bars: [
        ["Refresh load", barValue(selectedRefreshTotal, Math.max(selectedRefreshTotal, selectedReportViews, 1)), "info"],
        ["Usage load", barValue(selectedReportViews, Math.max(selectedRefreshTotal, selectedReportViews, 1)), "info"],
        ["Failure rate", Math.min(100, Math.round(failedPercent)), statusForPercent(failedPercent, 5, 15)],
        ["Capacity metric availability", 0, "review"]
      ],
      heatmap: (selected ? [workspaceUsageMetric].filter(Boolean) : (usage.workspaceUsage || [])).slice(0, 12).map((item) => [item.label, barValue(item.count, selected ? selectedReportViews : usage.usageEvents)]) || [["No PPU signal", 0]],
      table: {
        headers: ["Workspace/Signal", "Metric", "Count", "Risk", "Source"],
        rows: (selected ? [workspaceUsageMetric].filter(Boolean) : (usage.workspaceUsage || [])).slice(0, 8).map((item) => [
          item.label,
          "Usage events",
          formatApiCount(item.count),
          item.count ? "API signal" : "No signal",
          "Activity Events"
        ])
      },
      actions: [
        ["PPU capacity note", "Dedicated CPU/memory capacity metrics are not exposed for Premium Per User through this API path."],
        ["Use operational signals", "For PPU, the dashboard uses refresh failures, refresh volume, report views, workspace inventory, and activity events."],
        ["No dummy capacity values", "CPU, memory, throttling, and overload are shown as unavailable unless a supported capacity data source is added."]
      ]
    }
  };
}

function endpointClass(endpoint) {
  if (!endpoint) return "info";
  if (endpoint.ok) return "healthy";
  if (endpoint.status === 401 || endpoint.status === 403) return "critical";
  return "review";
}

function renderLiveSummary() {
  const title = document.getElementById("live-status-title");
  const detail = document.getElementById("live-status-detail");
  const grid = document.getElementById("live-status-grid");
  const alertCount = document.getElementById("alert-count");

  if (!title || !detail || !grid) return;

  if (!liveSummary) {
    title.textContent = "Checking Power BI access";
    detail.textContent = "Connecting to Microsoft token service and Power BI REST APIs.";
    grid.innerHTML = '<span class="status-chip info">Starting</span>';
    if (alertCount) alertCount.textContent = "0";
    return;
  }

  const tokenOk = liveSummary.token?.ok;
  const adminWorkspace = liveSummary.endpoints?.find((endpoint) => endpoint.name === "Tenant admin workspaces");
  const activity = liveSummary.endpoints?.find((endpoint) => endpoint.name === "Tenant activity events");
  const workspace = liveSummary.endpoints?.find((endpoint) => endpoint.name === "Workspace access");
  const hasAnyData = (liveSummary.totals?.workspaces || 0) > 0;
  const realAlertCount = safeNumber(liveSummary.refresh?.failed) + safeNumber(liveSummary.governance?.orphanedWorkspaces);
  if (alertCount) alertCount.textContent = formatApiCount(realAlertCount);

  if (!tokenOk) {
    title.textContent = liveSummary.state === "local-error"
      ? "Live backend is not reachable"
      : "Power BI credentials not configured";
    detail.textContent = liveSummary.token?.message || "Start the local server with the Power BI tenant, client, and secret environment variables.";
  } else if (hasAnyData) {
    title.textContent = "Power BI data connected";
    detail.textContent = `Loaded API data from ${liveSummary.window?.fromDate || "Power BI"} to ${liveSummary.window?.toDate || "now"} at ${new Date(liveSummary.generatedAt).toLocaleString()}.`;
  } else {
    title.textContent = "Power BI login works, data access is limited";
    detail.textContent = "The token is valid, but workspace/admin API permissions currently return no tenant data.";
  }

  const metrics = [
    ["Token", tokenOk ? "Connected" : "Missing", tokenOk ? "Bearer token issued" : "Needs env config", tokenOk ? "healthy" : "review"],
    ["Workspace API", workspace?.ok ? `${workspace.itemCount || 0}` : "Blocked", workspace?.ok ? "Accessible workspaces" : workspace?.error || "No access", endpointClass(workspace)],
    ["Admin Metadata", adminWorkspace?.ok ? `${adminWorkspace.itemCount || 0}` : `${adminWorkspace?.status || "Blocked"}`, adminWorkspace?.ok ? "Tenant scan enabled" : adminWorkspace?.error || "Admin API blocked", endpointClass(adminWorkspace)],
    ["Activity Events", activity?.ok ? `${activity.itemCount || 0}` : `${activity?.status || "Blocked"}`, activity?.ok ? "Audit events readable" : activity?.error || "Activity API blocked", endpointClass(activity)],
    ["Reports", formatApiCount(liveSummary.totals?.reports || 0), "Live API total", hasAnyData ? "healthy" : "info"],
    ["Usage Events", formatApiCount(liveSummary.usage?.usageEvents || 0), "View activity only", liveSummary.usage?.usageEvents ? "healthy" : "info"]
  ];

  grid.innerHTML = metrics.map(([label, value, note, state]) => `
    <div class="live-metric">
      <span>${escapeHtml(label)}</span>
      <strong class="${state}">${escapeHtml(value)}</strong>
      <small>${escapeHtml(note)}</small>
    </div>
  `).join("");
}

function updateWorkspaceScopeOptions() {
  const select = document.getElementById("scope-filter");
  if (!select || !liveSummary?.workspaces) return;

  const current = filterState.scope;
  const workspaces = [...liveSummary.workspaces]
    .filter((workspace) => workspace.id && workspace.name)
    .sort((a, b) => a.name.localeCompare(b.name));

  select.innerHTML = [
    `<option value="all">All governed workspaces, excluding personal/TKM (${formatApiCount(workspaces.length)})</option>`,
    ...workspaces.map((workspace) => {
      const label = `${workspace.name} (${formatApiCount(workspace.reports)} reports, ${formatApiCount(workspace.datasets)} datasets)`;
      return `<option value="${escapeHtml(workspace.id)}">${escapeHtml(label)}</option>`;
    })
  ].join("");

  if (current !== "all" && workspaces.some((workspace) => workspace.id === current)) {
    select.value = current;
  } else {
    filterState.scope = "all";
    select.value = "all";
  }
}

function syncPageTitleForWorkspace(page) {
  const workspace = selectedWorkspace();
  if (!workspace) return page;
  page.title = `${page.title} - ${workspace.name}`;
  return page;
}

function detailConfig(kind) {
  const usage = liveSummary?.usage || {};
  const users = liveSummary?.users || {};
  const refresh = liveSummary?.refresh || {};
  const governance = liveSummary?.governance || {};
  const totals = liveSummary?.totals || {};
  const windowInfo = liveSummary?.window || {};
  const scope = selectedWorkspace()?.name || "All selected workspaces";
  const selected = selectedWorkspace();
  const workspaceUserStats = selected ? (usage.workspaceUserStatsAll || []).find((item) => item.workspaceId === selected.id || item.workspace === selected.name) : null;

  const topReports = workspaceScoped(usage.topReportsAll).slice(0, 100).map((item, index) => [
    index + 1,
    item.label,
    item.extra?.workspace || "Unknown workspace",
    item.count,
    "ViewReport"
  ]);
  const refreshFailures = workspaceScoped(refresh.topFailingDatasetsAll).slice(0, 100).map((item, index) => [
    index + 1,
    item.label,
    item.extra?.workspace || "Unknown workspace",
    item.count,
    "Failed refresh"
  ]);
  const idleReports = workspaceScoped(governance.idleReportsAll).slice(0, 150).map((item, index) => [
    index + 1,
    item.report,
    item.workspace,
    item.reason,
    "Review / archive"
  ]);
  const workspaceScores = workspaceScoped(governance.workspaceScoresAll).slice(0, 150).map((item, index) => [
    index + 1,
    item.workspace,
    item.score,
    item.users,
    item.reports,
    item.datasets,
    item.usageEvents
  ]);
  const sourceTopUsers = selected ? (workspaceUserStats?.topUsers || []) : (users.topUsersAll || []);
  const topUsers = sourceTopUsers.slice(0, 150).map((item, index) => [
    index + 1,
    item.label,
    item.count,
    "Accessed content"
  ]);
  const inactiveUsersSource = selected
    ? (users.inactiveUsersAll || []).filter((item) => safeNumber(item.workspaceCount) > 0).slice(0, 150)
    : (users.inactiveUsersAll || []).slice(0, 150);
  const inactiveUsers = inactiveUsersSource.map((item, index) => [
    index + 1,
    item.user,
    item.workspaceCount,
    item.roles,
    item.status
  ]);

  const configs = {
    reports: {
      kicker: "Usage",
      title: "Most Used Reports",
      subtitle: `${scope} | ${windowInfo.fromDate || ""} to ${windowInfo.toDate || ""}`,
      stats: [["Report views", formatApiCount(usage.reportViews || 0)], ["Reports", formatApiCount(totals.reports || 0)], ["Usage events", formatApiCount(usage.usageEvents || 0)], ["Repeat users", formatApiCount(usage.repeatUsers || 0)]],
      headers: ["Rank", "Report", "Workspace", "Views", "Operation"],
      rows: topReports
    },
    refresh: {
      kicker: "Operations",
      title: "Refresh Failures",
      subtitle: `${scope} | Failed RefreshDataset events`,
      stats: [["Refresh events", formatApiCount(refresh.total || 0)], ["Failures", formatApiCount(refresh.failed || 0)], ["Failure %", pct(refresh.failedPercent || 0)], ["Datasets", formatApiCount(totals.datasets || 0)]],
      headers: ["Rank", "Dataset", "Workspace", "Failures", "Signal"],
      rows: refreshFailures
    },
    idle: {
      kicker: "Optimization",
      title: "Idle Reports",
      subtitle: `${scope} | No ViewReport event in selected API window`,
      stats: [["Idle reports", formatApiCount(governance.idleReportCount || 0)], ["Idle %", pct(governance.idleReportPercent || 0)], ["Reports", formatApiCount(totals.reports || 0)], ["Window", `${windowInfo.requestedDays || 0} days`]],
      headers: ["#", "Report", "Workspace", "Evidence", "Recommendation"],
      rows: idleReports
    },
    users: {
      kicker: "Security",
      title: "Top Accessed User IDs",
      subtitle: `${scope} | Activity Events API user ranking for selected API window`,
      stats: [["Active users", formatApiCount(selected ? (workspaceUserStats?.activeUsers || 0) : (users.activeUsers || usage.mau || 0))], ["Workspace users", formatApiCount(selected ? (selected.users || 0) : (users.workspaceUsers || 0))], ["Non-active users", formatApiCount(selected ? Math.max(0, (selected.users || 0) - (workspaceUserStats?.activeUsers || 0)) : (users.inactiveUsers || 0))], ["Top user rows", formatApiCount(topUsers.length)]],
      headers: ["Rank", "User ID", "Events", "Signal"],
      rows: topUsers
    },
    inactive: {
      kicker: "Security",
      title: "Non-Active Workspace Users",
      subtitle: `${scope} | Workspace users without usage events in this API window`,
      stats: [["Non-active users", formatApiCount(selected ? Math.max(0, (selected.users || 0) - (workspaceUserStats?.activeUsers || 0)) : (users.inactiveUsers || 0))], ["Active users", formatApiCount(selected ? (workspaceUserStats?.activeUsers || 0) : (users.activeUsers || 0))], ["Workspace users", formatApiCount(selected ? (selected.users || 0) : (users.workspaceUsers || 0))], ["Privacy action", "Review access"]],
      headers: ["#", "User ID", "Workspace Count", "Roles", "Status"],
      rows: inactiveUsers
    },
    governance: {
      kicker: "Governance",
      title: "Workspace Security and Optimization",
      subtitle: `${scope} | Ownership, usage, idle content`,
      stats: [["Health score", formatApiCount(governance.workspaceHealthScore || 0)], ["Owner coverage", pct(governance.ownerCoveragePercent || 0)], ["Orphaned", formatApiCount(governance.orphanedWorkspaces || 0)], ["Workspaces", formatApiCount(totals.workspaces || 0)]],
      headers: ["#", "Workspace", "Score", "Users", "Reports", "Datasets", "Usage Events"],
      rows: workspaceScores
    }
  };

  return configs[kind] || configs.governance;
}

function openDetail(kind) {
  if (!liveSummary?.token?.ok) return;
  const config = detailConfig(kind);
  document.getElementById("modal-kicker").textContent = config.kicker;
  document.getElementById("modal-title").textContent = config.title;
  document.getElementById("modal-subtitle").textContent = config.subtitle;
  document.getElementById("modal-body").innerHTML = `${modalStats(config.stats)}${tableHtml(config.headers, config.rows)}`;
  const modal = document.getElementById("detail-modal");
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

function closeDetail() {
  const modal = document.getElementById("detail-modal");
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

function detailKindForLabel(label) {
  const text = String(label).toLowerCase();
  if (text.includes("refresh") || text.includes("failed")) return "refresh";
  if (text.includes("idle") || text.includes("no views")) return "idle";
  if (text.includes("user") || text.includes("active")) return "users";
  if (text.includes("report") || text.includes("view")) return "reports";
  if (text.includes("orphan") || text.includes("owner") || text.includes("health") || text.includes("workspace")) return "governance";
  return "governance";
}

function applyLiveSummary(pageKey, page) {
  if (!liveSummary?.token?.ok) return page;

  const totals = liveSummary.totals || {};
  const workspaceEndpoint = liveSummary.endpoints?.find((endpoint) => endpoint.name === "Workspace access");
  const adminEndpoint = liveSummary.endpoints?.find((endpoint) => endpoint.name === "Tenant admin workspaces");
  const activityEndpoint = liveSummary.endpoints?.find((endpoint) => endpoint.name === "Tenant activity events");
  const hasAnyData = (totals.workspaces || 0) > 0;

  if (pageKey === "executive") {
    page.kpis[0] = {
      ...page.kpis[0],
      label: "Live Workspaces Returned",
      value: formatApiCount(totals.workspaces || 0),
      status: [hasAnyData ? "Connected" : "No workspace access", hasAnyData ? "healthy" : "review"],
      meta: [`Reports ${totals.reports || 0}`, `Datasets ${totals.datasets || 0}`, `Dashboards ${totals.dashboards || 0}`],
      spark: [0, 0, 0, 0, 0, totals.workspaces || 0, totals.workspaces || 0]
    };
    page.kpis[1] = {
      ...page.kpis[1],
      label: "Admin API Status",
      value: adminEndpoint?.ok ? "OK" : `${adminEndpoint?.status || "Blocked"}`,
      status: [adminEndpoint?.ok ? "Enabled" : "Blocked", adminEndpoint?.ok ? "healthy" : "critical"],
      meta: ["Tenant metadata", adminEndpoint?.error || "Read access", "Admin portal setting"],
      spark: [0, 0, 0, 0, adminEndpoint?.ok ? 1 : 0, adminEndpoint?.ok ? 1 : 0, adminEndpoint?.ok ? 1 : 0]
    };
    page.kpis[2] = {
      ...page.kpis[2],
      label: "Activity API Status",
      value: activityEndpoint?.ok ? formatApiCount(totals.activityEvents || 0) : `${activityEndpoint?.status || "Blocked"}`,
      status: [activityEndpoint?.ok ? "Readable" : "Blocked", activityEndpoint?.ok ? "healthy" : "critical"],
      meta: ["Usage events", activityEndpoint?.error || "Audit logs", "Yesterday window"],
      spark: [0, 0, 0, totals.activityEvents || 0, totals.activityEvents || 0, totals.activityEvents || 0, totals.activityEvents || 0]
    };
  }

  if (pageKey === "workspace") {
    page.kpis[0].value = formatApiCount(totals.workspaces || 0);
    page.kpis[0].status = [workspaceEndpoint?.ok ? "API OK" : "Blocked", endpointClass(workspaceEndpoint)];
    page.table.rows = liveSummary.sampleWorkspaces?.length
      ? liveSummary.sampleWorkspaces.map((workspace) => [
          workspace.name || workspace.id,
          workspace.state || "Unknown",
          `${workspace.reports} reports`,
          `${workspace.datasets} datasets`,
          "Live"
        ])
      : [["No workspaces returned", "Service principal", "0 reports", "0 datasets", "Needs access"]];
  }

  return page;
}

function scaleMetric(value, factor, options = {}) {
  const match = String(value).match(/^([\d.]+)(K|M|%|s|m)?$/);
  if (!match) return value;

  const number = Number.parseFloat(match[1]);
  const suffix = match[2] || "";
  if (!Number.isFinite(number)) return value;

  if (suffix === "%") {
    if (!options.scalePercent) return value;
    const scaled = Math.max(0, Math.min(100, number * factor));
    return `${scaled % 1 === 0 ? scaled.toFixed(0) : scaled.toFixed(1)}%`;
  }

  if (suffix === "K") return formatCount(number * 1000 * factor);
  if (suffix === "M") return `${Math.max(0, number * factor).toFixed(1)}M`;
  if (suffix === "s") return `${Math.max(0, Math.round(number * factor))}s`;
  if (suffix === "m") return value;

  return formatCount(number * factor);
}

function adjustScoreValue(value, adjustment) {
  const number = Number.parseFloat(value);
  if (!Number.isFinite(number)) return value;
  return `${Math.max(0, Math.min(100, Math.round(number + adjustment)))}`;
}

function capacityStatus(value) {
  const number = Number.parseFloat(value);
  if (!Number.isFinite(number)) return ["P95", "info"];
  if (number >= 95) return ["Critical", "critical"];
  if (number >= 80) return ["Watch", "review"];
  return ["Healthy", "healthy"];
}

function clonePage(page) {
  return JSON.parse(JSON.stringify(page));
}

function transformKpi(kpi, pageKey, context) {
  const transformed = { ...kpi, meta: [...kpi.meta], spark: [...kpi.spark], status: [...kpi.status] };
  const label = transformed.label.toLowerCase();
  const countFactor = context.date.factor * context.scope.factor;
  const isCapacityMetric =
    label.includes("capacity") ||
    label === "cpu" ||
    label === "memory" ||
    label.includes("throttling") ||
    label.includes("concurrency");
  const isScoreMetric =
    label.includes("health") ||
    label.includes("sla") ||
    label.includes("retention") ||
    label.includes("coverage");

  if (isCapacityMetric && transformed.value.includes("%")) {
    transformed.value = scaleMetric(transformed.value, 1, { scalePercent: true });
    transformed.status = capacityStatus(transformed.value);
  } else if (isCapacityMetric && transformed.value.endsWith("s")) {
    transformed.value = scaleMetric(transformed.value, 1);
  } else if (isScoreMetric && /^\d+$/.test(transformed.value)) {
    transformed.value = adjustScoreValue(transformed.value, context.scope.score);
  } else if (!isScoreMetric && !transformed.value.includes("%") && !transformed.value.endsWith("m")) {
    transformed.value = scaleMetric(transformed.value, countFactor);
  }

  transformed.spark = transformed.spark.map((value) => {
    if (isCapacityMetric) return Math.max(0, Math.min(120, value));
    if (isScoreMetric) return Math.max(0, Math.min(100, value + context.scope.score));
    return value * countFactor;
  });

  return transformed;
}

function transformPage(pageKey) {
  const sourcePages = liveSummary?.token?.ok ? buildApiPages() : buildLoadingPages();
  return syncPageTitleForWorkspace(clonePage(sourcePages[pageKey]));
}

function renderFilterSummary() {
  const context = currentFilterContext();
  if (liveSummary?.window?.fromDate && liveSummary?.window?.toDate) {
    document.getElementById("filter-summary").textContent =
      `Showing Power BI API data from ${liveSummary.window.fromDate} to ${liveSummary.window.toDate} across ${context.scope.label}`;
    return;
  }
  document.getElementById("filter-summary").textContent =
    `Showing ${context.date.label} across ${context.scope.label}`;
}

function renderPage(key) {
  const page = transformPage(key);
  activePage = key;
  renderFilterSummary();
  renderLiveSummary();
  document.getElementById("page-title").textContent = page.title;
  document.getElementById("trend-kicker").textContent = page.trendKicker;
  document.getElementById("trend-title").textContent = page.trendTitle;
  document.getElementById("trend-status").textContent = page.trendStatus[0];
  document.getElementById("trend-status").className = `status-chip ${page.trendStatus[1]}`;
  document.getElementById("bar-title").textContent = key === "executive" ? "Refresh Health" : "Signal Mix";
  document.getElementById("matrix-title").textContent = key === "capacity" ? "Peak Windows" : "Workspace Health";
  document.getElementById("table-title").textContent = key === "executive" ? "Priority Queue" : "Operational Detail";

  renderKpis(page.kpis);
  renderBars(page.bars);
  renderHeatmap(page.heatmap);
  renderTable(page.table);
  renderActions(page.actions);
  drawTrend(page.trend);
}

function renderKpis(kpis) {
  const grid = document.getElementById("kpi-grid");
  grid.innerHTML = "";
  kpis.forEach((kpi) => {
    const card = document.createElement("article");
    card.className = "kpi-card";
    card.innerHTML = `
      <div class="kpi-head">
        <span class="kpi-label">${escapeHtml(kpi.label)}</span>
        <span class="status-chip ${kpi.status[1]}">${escapeHtml(kpi.status[0])}</span>
      </div>
      <div class="kpi-value">${escapeHtml(kpi.value)}</div>
      <div class="kpi-foot">
        <div class="kpi-meta">
          ${kpi.meta.map((item) => `<span><strong>${escapeHtml(item.split(" ")[0])}</strong> ${escapeHtml(item.split(" ").slice(1).join(" "))}</span>`).join("")}
        </div>
        <canvas class="sparkline" width="160" height="84"></canvas>
      </div>
    `;
    card.addEventListener("click", () => openDetail(detailKindForLabel(kpi.label)));
    grid.appendChild(card);
    drawSparkline(card.querySelector("canvas"), kpi.spark, kpi.status[1]);
  });
}

function drawSparkline(canvas, values, status) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(1, max - min);
  const color = status === "critical" ? cssVar("--red") : status === "review" ? cssVar("--amber") : cssVar("--green");
  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.strokeStyle = color;
  ctx.beginPath();
  values.forEach((value, index) => {
    const x = 8 + index * ((width - 16) / (values.length - 1));
    const y = height - 8 - ((value - min) / span) * (height - 18);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

function drawTrend(trend) {
  const canvas = document.getElementById("trend-chart");
  const bounds = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const width = Math.max(320, Math.floor(bounds.width));
  const height = 260;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const padding = { left: 48, right: 22, top: 18, bottom: 34 };
  const allValues = trend.series.flatMap((series) => series.values);
  const min = Math.min(0, Math.min(...allValues));
  const max = Math.max(...allValues);
  const span = Math.max(1, max - min);
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  ctx.strokeStyle = cssVar("--border");
  ctx.lineWidth = 1;
  ctx.fillStyle = cssVar("--text-muted");
  ctx.font = "11px Segoe UI, Arial";

  for (let i = 0; i <= 4; i += 1) {
    const y = padding.top + (plotH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }

  trend.labels.forEach((label, index) => {
    const x = padding.left + index * (plotW / (trend.labels.length - 1));
    ctx.fillText(label, x - 8, height - 12);
  });

  trend.series.forEach((series) => {
    const color = cssVar(colorMap[series.color]);
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    ctx.beginPath();
    series.values.forEach((value, index) => {
      const x = padding.left + index * (plotW / (series.values.length - 1));
      const y = padding.top + plotH - ((value - min) / span) * plotH;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  });

  let legendX = padding.left;
  trend.series.forEach((series) => {
    const color = cssVar(colorMap[series.color]);
    ctx.fillStyle = color;
    ctx.fillRect(legendX, 8, 9, 9);
    ctx.fillStyle = cssVar("--text-soft");
    ctx.fillText(series.name, legendX + 15, 16);
    legendX += 94;
  });

  trendHoverData = {
    labels: trend.labels,
    series: trend.series,
    padding,
    plotW,
    width,
    height
  };
}

function renderBars(bars) {
  const target = document.getElementById("bar-list");
  target.innerHTML = bars.map(([label, value, state]) => `
    <div class="bar-row" data-detail="${escapeHtml(detailKindForLabel(label))}">
      <div class="bar-row-head">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}%</strong>
      </div>
      <div class="bar-track">
        <div class="bar-fill ${state === "critical" ? "warn" : ""}" style="width:${Math.min(100, value)}%"></div>
      </div>
    </div>
  `).join("");
  target.querySelectorAll("[data-detail]").forEach((item) => {
    item.addEventListener("click", () => openDetail(item.dataset.detail));
  });
}

function renderHeatmap(cells) {
  const target = document.getElementById("heatmap");
  target.innerHTML = cells.map(([label, score]) => {
    const scoreClass = score >= 80 ? "score-high" : score >= 60 ? "score-mid" : "score-low";
    return `
      <div class="heat-cell ${scoreClass}">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(score)}</strong>
      </div>
    `;
  }).join("");
  target.querySelectorAll(".heat-cell").forEach((item) => {
    item.addEventListener("click", () => openDetail("governance"));
  });
}

function renderTable(table) {
  const target = document.getElementById("data-table");
  const headers = table.headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("");
  const rows = table.rows.map((row) => `
    <tr>
      ${row.map((cell, index) => {
        const content = index === 0 ? `<strong>${escapeHtml(cell)}</strong>` : escapeHtml(cell);
        const chip = index === row.length - 1 ? `<span class="status-chip ${statusClass(cell)}">${escapeHtml(cell)}</span>` : content;
        return `<td>${chip}</td>`;
      }).join("")}
    </tr>
  `).join("");
  target.innerHTML = `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
  target.querySelectorAll("tbody tr").forEach((row) => {
    row.addEventListener("click", () => openDetail(detailKindForLabel(document.getElementById("table-title").textContent)));
  });
}

function renderActions(actions) {
  const target = document.getElementById("actions");
  target.innerHTML = actions.map(([title, detail]) => `
    <div class="action-item" data-detail="${escapeHtml(detailKindForLabel(title))}">
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(detail)}</span>
    </div>
  `).join("");
  target.querySelectorAll("[data-detail]").forEach((item) => {
    item.addEventListener("click", () => openDetail(item.dataset.detail));
  });
}

function ensureChartTooltip() {
  let tooltip = document.getElementById("chart-tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.id = "chart-tooltip";
    tooltip.className = "chart-tooltip";
    document.body.appendChild(tooltip);
  }
  return tooltip;
}

function showChartTooltip(event) {
  if (!trendHoverData) return;
  const canvas = document.getElementById("trend-chart");
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const { labels, series, padding, plotW } = trendHoverData;
  const index = Math.max(0, Math.min(labels.length - 1, Math.round((x - padding.left) / (plotW / Math.max(1, labels.length - 1)))));
  const tooltip = ensureChartTooltip();
  tooltip.innerHTML = `
    <strong>${escapeHtml(labels[index] || "Point")}</strong>
    ${series.map((item) => `<span>${escapeHtml(item.name)}: ${escapeHtml(formatApiCount(safeNumber(item.values[index])))}</span>`).join("")}
  `;
  tooltip.style.left = `${event.clientX + 14}px`;
  tooltip.style.top = `${event.clientY + 14}px`;
  tooltip.style.display = "block";
}

function hideChartTooltip() {
  const tooltip = document.getElementById("chart-tooltip");
  if (tooltip) tooltip.style.display = "none";
}

document.querySelectorAll(".nav-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".nav-button").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    renderPage(button.dataset.page);
  });
});

document.getElementById("date-range").addEventListener("change", (event) => {
  filterState.dateRange = event.target.value;
  loadLiveSummary(false);
});

document.getElementById("scope-filter").addEventListener("change", (event) => {
  filterState.scope = event.target.value;
  renderPage(activePage);
});

document.getElementById("refresh-api").addEventListener("click", () => {
  loadLiveSummary(true);
});

document.getElementById("trend-chart").addEventListener("mousemove", showChartTooltip);
document.getElementById("trend-chart").addEventListener("mouseleave", hideChartTooltip);

document.querySelector(".alert-button").addEventListener("click", () => {
  openDetail("inactive");
});

document.getElementById("modal-close").addEventListener("click", closeDetail);
document.getElementById("detail-modal").addEventListener("click", (event) => {
  if (event.target.id === "detail-modal") closeDetail();
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeDetail();
});

window.addEventListener("resize", () => drawTrend(transformPage(activePage).trend));

async function loadLiveSummary(refresh = false) {
  const refreshButton = document.getElementById("refresh-api");
  if (refreshButton) {
    refreshButton.disabled = true;
    refreshButton.classList.add("is-loading");
    refreshButton.textContent = refresh ? "Refreshing..." : "Loading...";
  }
  liveSummary = null;
  renderPage(activePage);
  renderLiveSummary();
  try {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), filterState.dateRange === "30" ? 150000 : 90000);
    const params = new URLSearchParams({
      days: filterState.dateRange
    });
    if (refresh) params.set("refresh", "1");
    const response = await fetch(`/api/live-summary?${params.toString()}`, {
      cache: "no-store",
      signal: controller.signal
    });
    window.clearTimeout(timeout);
    liveSummary = await response.json();
    updateWorkspaceScopeOptions();
  } catch (error) {
    liveSummary = {
      generatedAt: new Date().toISOString(),
      token: {
        ok: false,
        message: error.name === "AbortError"
          ? "The live Power BI API pull is still running. Use Last 7 days for quick loading, or retry Last 30 days after a minute."
          : `Local live API failed: ${error.message}`
      },
      endpoints: [],
      totals: { workspaces: 0, reports: 0, datasets: 0, dashboards: 0, activityEvents: 0 },
      state: "local-error"
    };
  } finally {
    if (refreshButton) {
      refreshButton.disabled = false;
      refreshButton.classList.remove("is-loading");
      refreshButton.textContent = "Refresh API";
    }
  }
  renderPage(activePage);
}

renderPage(activePage);
loadLiveSummary();
