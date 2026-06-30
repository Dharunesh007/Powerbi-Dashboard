# Semantic Model

## Modeling Pattern

Use a star schema with conformed dimensions and narrow facts. The model should feel interactive at executive speed, so detailed API payloads remain in SQL and only curated fields enter the semantic model.

Recommended import mode:

- Import for dimensions and governance snapshots.
- Incremental Import for usage, refresh, and capacity facts.
- Optional DirectQuery or composite mode only for near-real-time capacity drill-through, after performance testing.

## Tables

| Semantic Table | SQL Source | Type | Grain |
| --- | --- | --- | --- |
| Date | `core.dim_date` | Dimension | One row per calendar date |
| User | `core.dim_user` | Dimension | One row per current user identity |
| Workspace | `core.dim_workspace` | Dimension | One row per workspace |
| Report | `core.dim_report` | Dimension | One row per report |
| Dataset | `core.dim_dataset` | Dimension | One row per semantic model/dataset |
| Dashboard | `core.dim_dashboard` | Dimension | One row per dashboard |
| Capacity | `core.dim_capacity` | Dimension | One row per capacity |
| Error Category | `core.dim_error_category` | Dimension | One row per refresh error category |
| Workspace User Role | `core.bridge_workspace_user_role` | Bridge | One row per workspace/principal/role/current period |
| Report User Access | `core.bridge_report_user_access` | Bridge | One row per report/principal/access/current period |
| Usage Event | `core.fact_usage_event` | Fact | One row per Power BI activity event |
| Refresh History | `mart.vw_refresh_health` | Fact | One row per dataset refresh request |
| Capacity Metric | `mart.vw_capacity_health` | Fact | One row per capacity metric timestamp |
| Workspace Health | `governance.vw_workspace_health_score` or snapshot table | Snapshot fact | One row per workspace snapshot |
| Recommendation | `governance.asset_recommendation` or candidate view | Fact | One row per recommendation |
| Report Adoption | `mart.vw_report_adoption` | Factless snapshot/mart | One row per active report |
| Executive KPI Daily | `mart.vw_executive_kpi_daily` | Aggregate fact | One row per date |

## Relationships

| From | To | Cardinality | Direction | Active |
| --- | --- | --- | --- | --- |
| Date[Date Key] | Usage Event[Event Date Key] | 1:* | Single | Yes |
| Date[Date Key] | Refresh History[Start Date Key] | 1:* | Single | Yes |
| Date[Date Key] | Capacity Metric[Metric Date Key] | 1:* | Single | Yes |
| Date[Date Key] | Workspace Health[Snapshot Date Key] | 1:* | Single | Yes |
| User[User Key] | Usage Event[User Key] | 1:* | Single | Yes |
| Workspace[Workspace Key] | Usage Event[Workspace Key] | 1:* | Single | Yes |
| Workspace[Workspace Key] | Report[Workspace Key] | 1:* | Single | Yes |
| Workspace[Workspace Key] | Dataset[Workspace Key] | 1:* | Single | Yes |
| Workspace[Workspace Key] | Dashboard[Workspace Key] | 1:* | Single | Yes |
| Workspace[Workspace Key] | Refresh History[Workspace Key] | 1:* | Single | Yes |
| Workspace[Workspace Key] | Workspace Health[Workspace Key] | 1:* | Single | Yes |
| Workspace[Workspace Key] | Recommendation[Workspace Key] | 1:* | Single | Yes |
| Report[Report Key] | Usage Event[Report Key] | 1:* | Single | Yes |
| Report[Report Key] | Report Adoption[Report Key] | 1:1 | Single | Yes |
| Dashboard[Dashboard Key] | Usage Event[Dashboard Key] | 1:* | Single | Yes |
| Dataset[Dataset Key] | Usage Event[Dataset Key] | 1:* | Single | Yes |
| Dataset[Dataset Key] | Refresh History[Dataset Key] | 1:* | Single | Yes |
| Capacity[Capacity Key] | Workspace[Capacity Key] | 1:* | Single | Yes |
| Capacity[Capacity Key] | Usage Event[Capacity Key] | 1:* | Single | Yes |
| Capacity[Capacity Key] | Refresh History[Capacity Key] | 1:* | Single | Yes |
| Capacity[Capacity Key] | Capacity Metric[Capacity Key] | 1:* | Single | Yes |
| Error Category[Error Category Key] | Refresh History[Error Category Key] | 1:* | Single | Yes |
| Workspace[Workspace Key] | Workspace User Role[Workspace Key] | 1:* | Single | Yes |
| User[User Key] | Workspace User Role[User Key] | 1:* | Single | No |
| Report[Report Key] | Report User Access[Report Key] | 1:* | Single | Yes |
| User[User Key] | Report User Access[User Key] | 1:* | Single | No |

Use inactive User-to-bridge relationships to prevent ambiguous filtering. Role pages can activate these with `USERELATIONSHIP` only when needed.

## Date Handling

- Store all API timestamps in UTC.
- Add a report parameter for business timezone offset if leadership wants local-day cards.
- Keep `Date` as the single date table and mark it as the date table.
- Use UTC for operational SLAs because the Power BI activity log is UTC-based.

## Incremental Refresh

| Table | RangeStart/RangeEnd Column | Retention | Refresh Window |
| --- | --- | ---:| ---:|
| Usage Event | Event UTC | 36 months | Last 7 days |
| Refresh History | Start UTC | 24 months | Last 14 days |
| Capacity Metric | Metric UTC | 24 months | Last 3 days |
| Workspace Health | Snapshot Date | 36 months | Last 7 days |
| Recommendation | Created UTC | 36 months | Last 30 days |

## Aggregations

Create import aggregation tables for:

- Daily active users by date, workspace, department.
- Daily refresh health by date, workspace, dataset, status.
- 15-minute capacity health by capacity.
- Report adoption by report and date.

Set detail tables as hidden on executive pages and use aggregation-aware measures for top-level KPI cards.

## Recommended Field Parameters

| Field Parameter | Options |
| --- | --- |
| Adoption grain | Report, Dashboard, Workspace, Department, User |
| Refresh metric | Failed refresh count, Failed refresh %, Avg duration, P95 duration, SLA % |
| Capacity metric | CU %, CPU %, Memory %, Query load %, Throttling seconds, Queue length |
| Governance band | Healthy, Review, Critical, Idle > 30, Idle > 60, Idle > 90 |

## RLS Design

| Role | Filter |
| --- | --- |
| Executive | No row filter; all summary data visible |
| Platform Admin | No row filter; all operational data visible |
| Department Leader | `User[Department]` and workspace reference mapping to allowed departments |
| Workspace Owner | Workspaces where the user is an Admin/Owner in `Workspace User Role` |
| Auditor | All workspaces, but user identifiers masked through model calculation or SQL view |

Recommended Workspace Owner filter:

```DAX
Workspace[Workspace Key] IN
CALCULATETABLE (
    VALUES ( 'Workspace User Role'[Workspace Key] ),
    'Workspace User Role'[Principal Identifier] = USERPRINCIPALNAME (),
    'Workspace User Role'[Access Right] IN { "Admin", "Member" },
    'Workspace User Role'[Is Current] = TRUE ()
)
```

## Hidden Columns

Hide technical identifiers from report users unless needed in drill-through:

- Surrogate keys.
- Raw API ids.
- Embed URLs.
- Ingestion timestamps.
- JSON payload columns.
- Hash fields.

Keep technical identifiers available in a dedicated Admin Detail page with restricted RLS.

## Naming

- Measures use title case: `Failed Refresh %`, `Workspace Health Score`.
- Boolean fields use readable labels: `Is View Event`, `SLA Met`.
- Fact tables use singular business names in Power BI: `Usage Event`, not `fact_usage_event`.
- Use display folders: Adoption, Refresh, Capacity, Governance, Executive, Operations.
