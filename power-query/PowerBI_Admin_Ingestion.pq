/*
Power Query M ingestion templates for the Power BI Premium Monitoring Platform.

Security:
- Treat AccessToken as a development placeholder only.
- In production, use managed Fabric/Dataflow connections, Key Vault backed orchestration,
  or a service principal token generated outside the semantic model.

Parameters expected:
- AccessToken as text
- PowerBIBaseUrl as text = "https://api.powerbi.com/v1.0/myorg"
- GraphBaseUrl as text = "https://graph.microsoft.com/v1.0"
- RangeStartUtc as datetimezone
- RangeEndUtc as datetimezone
- SharePointSiteUrl as text
- SqlServerName as text
- SqlDatabaseName as text
*/

section PowerBIMonitoring;

shared PowerBIBaseUrl = "https://api.powerbi.com/v1.0/myorg";
shared GraphBaseUrl = "https://graph.microsoft.com/v1.0";
shared AccessToken = "";
shared RangeStartUtc = #datetimezone(2026, 05, 28, 00, 00, 00, 0, 0);
shared RangeEndUtc = #datetimezone(2026, 05, 28, 23, 59, 59, 0, 0);
shared SharePointSiteUrl = "https://contoso.sharepoint.com/sites/PowerBIGovernance";
shared SqlServerName = "contoso-sql.database.windows.net";
shared SqlDatabaseName = "PowerBIMonitoring";

shared fnAuthHeaders = () as record =>
    [
        Authorization = "Bearer " & AccessToken,
        Accept = "application/json"
    ];

shared fnPowerBIJson = (relativePath as text, optional query as nullable record) as any =>
let
    queryRecord = if query = null then [] else query,
    response =
        Json.Document(
            Web.Contents(
                PowerBIBaseUrl,
                [
                    RelativePath = relativePath,
                    Query = queryRecord,
                    Headers = fnAuthHeaders(),
                    Timeout = #duration(0, 0, 2, 0)
                ]
            )
        )
in
    response;

shared fnGraphJson = (relativePath as text, optional query as nullable record) as any =>
let
    queryRecord = if query = null then [] else query,
    response =
        Json.Document(
            Web.Contents(
                GraphBaseUrl,
                [
                    RelativePath = relativePath,
                    Query = queryRecord,
                    Headers = fnAuthHeaders(),
                    Timeout = #duration(0, 0, 2, 0)
                ]
            )
        )
in
    response;

shared fnPowerBIPagedValue = (
    relativePath as text,
    pageSize as number,
    optional expand as nullable text,
    optional filter as nullable text
) as list =>
let
    getPage = (skip as number) as record =>
        let
            baseQuery = [#"$top" = Text.From(pageSize), #"$skip" = Text.From(skip)],
            withExpand = if expand = null then baseQuery else Record.AddField(baseQuery, "$expand", expand),
            withFilter = if filter = null then withExpand else Record.AddField(withExpand, "$filter", filter),
            page = fnPowerBIJson(relativePath, withFilter)
        in
            page,
    pages =
        List.Generate(
            () => [Skip = 0, Page = getPage(0), Rows = Record.FieldOrDefault(getPage(0), "value", {})],
            each List.Count([Rows]) > 0,
            each
                let
                    nextSkip = [Skip] + pageSize,
                    nextPage = getPage(nextSkip),
                    nextRows = Record.FieldOrDefault(nextPage, "value", {})
                in
                    [Skip = nextSkip, Page = nextPage, Rows = nextRows],
            each [Rows]
        ),
    rows = List.Combine(pages)
in
    rows;

shared AdminWorkspacesExpanded =
let
    rows = fnPowerBIPagedValue("admin/groups", 5000, "users,reports,dashboards,datasets", null),
    table = Table.FromRecords(rows),
    typed =
        Table.TransformColumnTypes(
            table,
            {
                {"id", type text},
                {"name", type text},
                {"type", type text},
                {"state", type text},
                {"isOnDedicatedCapacity", type logical},
                {"capacityId", type text}
            },
            "en-US"
        )
in
    typed;

shared WorkspaceUsers =
let
    source = AdminWorkspacesExpanded,
    keep = Table.SelectColumns(source, {"id", "name", "users"}, MissingField.UseNull),
    expandUsers = Table.ExpandListColumn(keep, "users"),
    expandRecord =
        Table.ExpandRecordColumn(
            expandUsers,
            "users",
            {"identifier", "principalType", "groupUserAccessRight", "displayName", "emailAddress"},
            {"principal_identifier", "principal_type", "access_right", "display_name", "email_address"}
        ),
    renamed = Table.RenameColumns( expandRecord, {{"id", "workspace_id"}, {"name", "workspace_name"}} )
in
    renamed;

shared WorkspaceReports =
let
    source = AdminWorkspacesExpanded,
    keep = Table.SelectColumns(source, {"id", "name", "reports"}, MissingField.UseNull),
    expandReports = Table.ExpandListColumn(keep, "reports"),
    expandRecord =
        Table.ExpandRecordColumn(
            expandReports,
            "reports",
            {"id", "name", "datasetId", "reportType", "webUrl", "embedUrl", "createdBy", "createdDateTime", "modifiedBy", "modifiedDateTime", "endorsementDetails", "sensitivityLabel"},
            {"report_id", "report_name", "dataset_id", "report_type", "web_url", "embed_url", "created_by", "created_utc", "modified_by", "modified_utc", "endorsement_details", "sensitivity_label"}
        ),
    renamed = Table.RenameColumns(expandRecord, {{"id", "workspace_id"}, {"name", "workspace_name"}})
in
    renamed;

shared WorkspaceDatasets =
let
    source = AdminWorkspacesExpanded,
    keep = Table.SelectColumns(source, {"id", "name", "datasets"}, MissingField.UseNull),
    expandDatasets = Table.ExpandListColumn(keep, "datasets"),
    expandRecord =
        Table.ExpandRecordColumn(
            expandDatasets,
            "datasets",
            {"id", "name", "configuredBy", "isRefreshable", "targetStorageMode", "contentProviderType", "addRowsAPIEnabled", "gatewayId", "endorsementDetails", "sensitivityLabel"},
            {"dataset_id", "dataset_name", "configured_by", "is_refreshable", "storage_mode", "content_provider_type", "add_rows_api_enabled", "gateway_id", "endorsement_details", "sensitivity_label"}
        ),
    renamed = Table.RenameColumns(expandRecord, {{"id", "workspace_id"}, {"name", "workspace_name"}})
in
    renamed;

shared WorkspaceDashboards =
let
    source = AdminWorkspacesExpanded,
    keep = Table.SelectColumns(source, {"id", "name", "dashboards"}, MissingField.UseNull),
    expandDashboards = Table.ExpandListColumn(keep, "dashboards"),
    expandRecord =
        Table.ExpandRecordColumn(
            expandDashboards,
            "dashboards",
            {"id", "displayName", "webUrl", "embedUrl", "isReadOnly"},
            {"dashboard_id", "dashboard_name", "web_url", "embed_url", "is_read_only"}
        ),
    renamed = Table.RenameColumns(expandRecord, {{"id", "workspace_id"}, {"name", "workspace_name"}})
in
    renamed;

shared fnActivityEventsForUtcDay = (startUtc as datetimezone, endUtc as datetimezone) as table =>
let
    quotedStart = "'" & DateTimeZone.ToText(startUtc, "yyyy-MM-ddTHH:mm:ssZ") & "'",
    quotedEnd = "'" & DateTimeZone.ToText(endUtc, "yyyy-MM-ddTHH:mm:ssZ") & "'",
    firstPage = fnPowerBIJson("admin/activityevents", [startDateTime = quotedStart, endDateTime = quotedEnd]),
    pages =
        List.Generate(
            () => [Page = firstPage, Token = Record.FieldOrDefault(firstPage, "continuationToken", null)],
            each [Page] <> null,
            each
                let
                    nextPage =
                        if [Token] = null
                        then null
                        else fnPowerBIJson("admin/activityevents", [continuationToken = [Token]]),
                    nextToken =
                        if nextPage = null
                        then null
                        else Record.FieldOrDefault(nextPage, "continuationToken", null)
                in
                    [Page = nextPage, Token = nextToken],
            each Record.FieldOrDefault([Page], "activityEventEntities", {})
        ),
    rows = List.Combine(pages),
    table = Table.FromRecords(rows)
in
    table;

shared ActivityEvents =
let
    startDate = Date.From(DateTimeZone.RemoveZone(RangeStartUtc)),
    endDate = Date.From(DateTimeZone.RemoveZone(RangeEndUtc)),
    dayCount = Duration.Days(endDate - startDate) + 1,
    dates = List.Dates(startDate, dayCount, #duration(1, 0, 0, 0)),
    dayTables =
        List.Transform(
            dates,
            each
                let
                    dayStart = DateTime.AddZone(DateTime.From(_), 0),
                    dayEnd = DateTime.AddZone(DateTime.From(_) + #duration(0, 23, 59, 59), 0)
                in
                    fnActivityEventsForUtcDay(dayStart, dayEnd)
        ),
    combined =
        if List.Count(dayTables) = 0
        then #table({}, {})
        else Table.Combine(dayTables)
in
    combined;

shared fnRefreshHistory = (workspaceId as text, datasetId as text) as list =>
let
    path = "groups/" & workspaceId & "/datasets/" & datasetId & "/refreshes",
    response = fnPowerBIJson(path, [#"$top" = "60"]),
    rows = Record.FieldOrDefault(response, "value", {})
in
    rows;

shared DatasetRefreshHistory =
let
    datasets = Table.SelectRows(WorkspaceDatasets, each [dataset_id] <> null and [workspace_id] <> null),
    withRefreshRows =
        Table.AddColumn(
            datasets,
            "refresh_history",
            each try fnRefreshHistory([workspace_id], [dataset_id]) otherwise {},
            type list
        ),
    expanded = Table.ExpandListColumn(withRefreshRows, "refresh_history"),
    refresh =
        Table.ExpandRecordColumn(
            expanded,
            "refresh_history",
            {"requestId", "refreshType", "startTime", "endTime", "status", "serviceExceptionJson", "refreshAttempts"},
            {"request_id", "refresh_type", "start_utc", "end_utc", "refresh_status", "service_exception_json", "refresh_attempts"}
        ),
    typed =
        Table.TransformColumnTypes(
            refresh,
            {
                {"start_utc", type datetimezone},
                {"end_utc", type datetimezone},
                {"refresh_status", type text},
                {"request_id", type text}
            },
            "en-US"
        )
in
    typed;

shared Capacities =
let
    response = fnPowerBIJson("capacities", null),
    rows = Record.FieldOrDefault(response, "value", {}),
    table = Table.FromRecords(rows)
in
    table;

shared CapacityRefreshables =
let
    response = fnPowerBIJson("capacities/refreshables", null),
    rows = Record.FieldOrDefault(response, "value", {}),
    table = Table.FromRecords(rows)
in
    table;

shared GraphUsers =
let
    firstPage =
        fnGraphJson(
            "users",
            [
                #"$select" = "id,userPrincipalName,displayName,mail,department,jobTitle,companyName,accountEnabled,userType,createdDateTime",
                #"$top" = "999"
            ]
        ),
    pages =
        List.Generate(
            () => [Page = firstPage, NextLink = Record.FieldOrDefault(firstPage, "@odata.nextLink", null)],
            each [Page] <> null,
            each
                let
                    nextPage =
                        if [NextLink] = null
                        then null
                        else Json.Document(Web.Contents([NextLink], [Headers = fnAuthHeaders(), Timeout = #duration(0, 0, 2, 0)])),
                    nextLink =
                        if nextPage = null
                        then null
                        else Record.FieldOrDefault(nextPage, "@odata.nextLink", null)
                in
                    [Page = nextPage, NextLink = nextLink],
            each Record.FieldOrDefault([Page], "value", {})
        ),
    rows = List.Combine(pages),
    table = Table.FromRecords(rows)
in
    table;

shared SharePointGovernanceLists =
let
    lists = SharePoint.Tables(SharePointSiteUrl, [Implementation = "2.0", ViewMode = "All"])
in
    lists;

shared WorkspaceOwnerOverrides =
let
    lists = SharePointGovernanceLists,
    ownerList = Table.SelectRows(lists, each [Title] = "Power BI Workspace Owners"),
    items = if Table.RowCount(ownerList) = 0 then #table({}, {}) else ownerList{0}[Items]
in
    items;

shared GovernanceExceptions =
let
    lists = SharePointGovernanceLists,
    exceptionList = Table.SelectRows(lists, each [Title] = "Power BI Governance Exceptions"),
    items = if Table.RowCount(exceptionList) = 0 then #table({}, {}) else exceptionList{0}[Items]
in
    items;

shared SqlReferenceData =
let
    source = Sql.Database(SqlServerName, SqlDatabaseName),
    reference = source{[Schema = "dbo", Item = "PowerBIWorkspaceReference"]}[Data]
in
    reference;
