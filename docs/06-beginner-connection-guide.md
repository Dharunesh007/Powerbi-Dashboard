# Beginner Connection Guide For Power BI Premium Per User

This guide explains how to connect the monitoring dashboard to your real Power BI Premium Per User (PPU) environment when you do not have a separate SQL database.

## Simple Explanation

You do not connect this dashboard to a "Power BI SQL" database. In Power BI Service with Premium Per User, the data about reports, workspaces, usage, and refreshes comes from Power BI APIs.

Important PPU note:

```text
PPU does not give you dedicated capacity CPU/memory metrics.
So do not build the CPU, memory, overload, or capacity utilization page unless your company also has dedicated Premium capacity.
```

The connection flow is:

```text
Power BI Service / Premium Per User
    ↓
Power BI Admin APIs and REST APIs
    ↓
Power BI Desktop or Dataflow
    ↓
Monitoring semantic model/report
```

For a beginner proof of concept, you can connect directly from Power BI Desktop using Power Query. Later, for production, store the API data in Power BI Dataflows, SharePoint files, OneDrive files, Dataverse, or SQL if your company adds one later.

## What You Need

| Need | Why |
| --- | --- |
| Power BI Premium Per User license | Lets users access PPU workspaces and Premium features |
| Power BI admin access | Required for tenant-wide admin APIs |
| Power BI Desktop | To build the first monitoring model |
| Permission to use Power BI Admin APIs | Required to list all workspaces, reports, datasets, and activity |
| Optional service principal | Best for production refresh without using a personal account |

## Step 1: Confirm Your Power BI Type

Open your Power BI reports.

If your URL looks like this:

```text
https://app.powerbi.com/...
```

Use this guide.

If your URL looks like this:

```text
http://your-server/reports
```

You are probably using Power BI Report Server. That is a different connection method.

## Step 2: Ask Admin To Enable API Access

Go to:

```text
Power BI Admin Portal
Tenant settings
Admin API settings
```

Enable these:

1. Service principals can access read-only admin APIs.
2. Enhance admin APIs responses with detailed metadata.
3. Optional: Enhance admin APIs responses with DAX and mashup expressions.

For a first test, you can use your own admin account in Power BI Desktop. For production, use a service principal.

## Step 3: Test Workspace API In Power BI Desktop

Open Power BI Desktop.

Go to:

```text
Get data
Blank query
Advanced Editor
```

Paste this query:

```powerquery
let
    Source =
        Json.Document(
            Web.Contents(
                "https://api.powerbi.com/v1.0/myorg/admin/groups",
                [
                    Query = [
                        #"$top" = "5000",
                        #"$expand" = "reports,datasets,dashboards,users"
                    ]
                ]
            )
        ),
    Rows = Source[value],
    TableData = Table.FromList(Rows, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    Workspaces =
        Table.ExpandRecordColumn(
            TableData,
            "Column1",
            {
                "id",
                "name",
                "type",
                "state",
                "isOnDedicatedCapacity",
                "capacityId",
                "reports",
                "datasets",
                "dashboards",
                "users"
            },
            {
                "WorkspaceId",
                "WorkspaceName",
                "WorkspaceType",
                "WorkspaceState",
                "IsOnDedicatedCapacity",
                "CapacityId",
                "Reports",
                "Datasets",
                "Dashboards",
                "Users"
            }
        )
in
    Workspaces
```

When Power BI asks for credentials:

```text
Choose Organizational account
Sign in with a Power BI admin account
```

If this works, you should see your Power BI workspaces.

## Step 4: Create Reports Table

In Power Query, right-click the `Workspaces` query and choose Reference.

Rename the new query:

```text
Reports
```

Open Advanced Editor and use:

```powerquery
let
    Source = Workspaces,
    KeepColumns = Table.SelectColumns(Source, {"WorkspaceId", "WorkspaceName", "Reports"}),
    ExpandList = Table.ExpandListColumn(KeepColumns, "Reports"),
    RemoveNulls = Table.SelectRows(ExpandList, each [Reports] <> null),
    ReportsTable =
        Table.ExpandRecordColumn(
            RemoveNulls,
            "Reports",
            {"id", "name", "datasetId", "reportType", "webUrl"},
            {"ReportId", "ReportName", "DatasetId", "ReportType", "WebUrl"}
        )
in
    ReportsTable
```

This gives report inventory.

## Step 5: Create Datasets Table

Reference `Workspaces` again.

Rename the new query:

```text
Datasets
```

Use:

```powerquery
let
    Source = Workspaces,
    KeepColumns = Table.SelectColumns(Source, {"WorkspaceId", "WorkspaceName", "Datasets"}),
    ExpandList = Table.ExpandListColumn(KeepColumns, "Datasets"),
    RemoveNulls = Table.SelectRows(ExpandList, each [Datasets] <> null),
    DatasetsTable =
        Table.ExpandRecordColumn(
            RemoveNulls,
            "Datasets",
            {"id", "name", "configuredBy", "isRefreshable", "targetStorageMode", "addRowsAPIEnabled"},
            {"DatasetId", "DatasetName", "ConfiguredBy", "IsRefreshable", "StorageMode", "AddRowsApiEnabled"}
        )
in
    DatasetsTable
```

This gives semantic model/dataset inventory.

## Step 6: Get Refresh History

Create a blank query named:

```text
fnRefreshHistory
```

Use:

```powerquery
(workspaceId as text, datasetId as text) as table =>
let
    Source =
        Json.Document(
            Web.Contents(
                "https://api.powerbi.com/v1.0/myorg",
                [
                    RelativePath = "groups/" & workspaceId & "/datasets/" & datasetId & "/refreshes",
                    Query = [#"$top" = "60"]
                ]
            )
        ),
    Rows = try Source[value] otherwise {},
    TableData = Table.FromList(Rows, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    Output =
        if Table.RowCount(TableData) = 0 then
            #table(
                {"requestId", "refreshType", "startTime", "endTime", "status", "serviceExceptionJson"},
                {}
            )
        else
            Table.ExpandRecordColumn(
                TableData,
                "Column1",
                {"requestId", "refreshType", "startTime", "endTime", "status", "serviceExceptionJson"},
                {"RequestId", "RefreshType", "StartTime", "EndTime", "Status", "ServiceExceptionJson"}
            )
in
    Output
```

Now reference `Datasets`.

Rename the new query:

```text
Refresh History
```

Use:

```powerquery
let
    Source = Table.SelectRows(Datasets, each [IsRefreshable] = true),
    AddRefreshHistory =
        Table.AddColumn(
            Source,
            "RefreshHistory",
            each try fnRefreshHistory([WorkspaceId], [DatasetId]) otherwise null
        ),
    ExpandHistory = Table.ExpandTableColumn(
        AddRefreshHistory,
        "RefreshHistory",
        {"RequestId", "RefreshType", "StartTime", "EndTime", "Status", "ServiceExceptionJson"},
        {"RequestId", "RefreshType", "StartTime", "EndTime", "Status", "ServiceExceptionJson"}
    )
in
    ExpandHistory
```

This gives refresh success/failure data.

## Step 7: Get Usage Events

Usage data comes from the Activity Events API. This is a tenant-level admin API.

Create a blank query named:

```text
Activity Events
```

Use this as a small first test for one day:

```powerquery
let
    StartDateTime = "'2026-05-28T00:00:00Z'",
    EndDateTime = "'2026-05-28T23:59:59Z'",
    Source =
        Json.Document(
            Web.Contents(
                "https://api.powerbi.com/v1.0/myorg/admin/activityevents",
                [
                    Query = [
                        startDateTime = StartDateTime,
                        endDateTime = EndDateTime
                    ]
                ]
            )
        ),
    Rows = try Source[activityEventEntities] otherwise {},
    TableData = Table.FromList(Rows, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    Output =
        if Table.RowCount(TableData) = 0 then
            #table({}, {})
        else
            Table.ExpandRecordColumn(
                TableData,
                "Column1",
                {
                    "Id",
                    "CreationTime",
                    "UserId",
                    "Activity",
                    "WorkSpaceName",
                    "WorkspaceId",
                    "ReportName",
                    "ReportId",
                    "DatasetName",
                    "DatasetId",
                    "CapacityId"
                },
                {
                    "ActivityId",
                    "CreationTime",
                    "UserId",
                    "Activity",
                    "WorkspaceName",
                    "WorkspaceId",
                    "ReportName",
                    "ReportId",
                    "DatasetName",
                    "DatasetId",
                    "CapacityId"
                }
            )
in
    Output
```

Once this works for one day, convert it to a function that loops over multiple days.

## Step 8: Build Basic Relationships

In Power BI model view:

```text
Workspaces[WorkspaceId] → Reports[WorkspaceId]
Workspaces[WorkspaceId] → Datasets[WorkspaceId]
Datasets[DatasetId] → Refresh History[DatasetId]
Reports[ReportId] → Activity Events[ReportId]
```

Use one-to-many relationships where possible.

## Step 9: Add Simple Measures

Create these first:

```DAX
Total Reports =
COUNTROWS ( Reports )
```

```DAX
Total Datasets =
COUNTROWS ( Datasets )
```

```DAX
Failed Refresh Count =
CALCULATE (
    COUNTROWS ( 'Refresh History' ),
    'Refresh History'[Status] = "Failed"
)
```

```DAX
Refresh Count =
COUNTROWS ( 'Refresh History' )
```

```DAX
Failed Refresh % =
DIVIDE ( [Failed Refresh Count], [Refresh Count] )
```

```DAX
Active Users =
DISTINCTCOUNT ( 'Activity Events'[UserId] )
```

```DAX
Report Views =
CALCULATE (
    COUNTROWS ( 'Activity Events' ),
    'Activity Events'[Activity] IN { "ViewReport", "ViewDashboard" }
)
```

## Step 10: Publish To Power BI Service

1. Save the PBIX.
2. Publish it to a Premium workspace.
3. Go to the semantic model settings.
4. Set credentials for the Web/API source.
5. Schedule refresh.

If refresh fails because of credentials, move to the production service-principal approach.

## Production Recommendation

For production, avoid using a personal admin account.

Use:

```text
Microsoft Entra App Registration
    ↓
Service Principal
    ↓
Power BI Admin API settings
    ↓
Power BI Dataflow / Power Automate / Azure Function
    ↓
Storage
    ↓
Power BI monitoring report
```

Since you do not have SQL, use one of these storage options:

| Storage | Good For |
| --- | --- |
| Power BI Dataflow | Easiest no-code staging |
| SharePoint files | Small proof of concept only |
| OneDrive files | Simple proof of concept exports |
| Dataverse | Governance/action tracking |
| SQL | Best later if IT gives you a database |

## Common Errors

| Error | Meaning | Fix |
| --- | --- | --- |
| 401 Unauthorized | Not signed in or token invalid | Sign in using Organizational account |
| 403 Forbidden | Account/app lacks admin API permission | Ask Power BI admin to enable admin API tenant setting |
| 429 Too many requests | API throttling | Reduce refresh frequency and page calls |
| Empty activity events | Date range issue or audit data not available | Test one UTC day and confirm admin access |
| Refresh history missing | Dataset permission issue | Make sure caller has access to the workspace/dataset |

## First Success Target

Do not try to build everything in one day.

First target:

1. Workspaces table loads.
2. Reports table loads.
3. Datasets table loads.
4. Refresh History table loads.
5. Create one page showing:
   - total workspaces
   - total reports
   - total datasets
   - failed refresh count
   - failed refresh percentage

After this works, add usage events.

For PPU, replace capacity monitoring with:

- PPU workspace inventory
- semantic model size
- refresh frequency
- refresh failures
- slow refreshes
- unused reports
- inactive users
- workspace ownership
