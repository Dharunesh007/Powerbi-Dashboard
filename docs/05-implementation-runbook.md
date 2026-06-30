# Implementation Runbook

## Phase 0: Decisions

Confirm these before build starts:

| Decision | Recommended Default |
| --- | --- |
| Warehouse | Azure SQL Database or SQL Server managed by BI platform team |
| Orchestrator | Fabric Data Factory pipeline or Azure Function plus SQL Agent equivalent |
| Identity | Dedicated service principal with approved Fabric admin API access |
| Report mode | Import with incremental refresh |
| Usage source | Activity Events API as primary source |
| Capacity source | Fabric Capacity Metrics export or supported internal telemetry copy |
| Ownership source | Power BI artifact users plus SharePoint owner override list |
| RLS | Executive, platform admin, department leader, workspace owner, auditor |

## Phase 1: Foundation

1. Create the SQL monitoring database.
2. Run [sql/001_powerbi_monitoring_schema.sql](../sql/001_powerbi_monitoring_schema.sql).
3. Create database roles:
   - `pbi_monitor_ingest_writer`
   - `pbi_monitor_model_reader`
   - `pbi_monitor_admin_reader`
   - `pbi_monitor_exec_reader`
4. Create service principal and store secrets outside Power BI files.
5. Enable Power BI/Fabric admin API tenant settings for the service principal security group.
6. Create SharePoint governance lists:
   - `Power BI Workspace Owners`
   - `Power BI Governance Exceptions`
   - `Power BI SLA Overrides`
   - `Power BI Business Catalog`

## Phase 2: Ingestion

| Pipeline | Source | Cadence | Destination |
| --- | --- | ---:| --- |
| Workspace inventory | Admin Groups API and Workspace Scanner | Daily full, hourly delta | `core.dim_workspace`, artifact dims, bridges |
| Activity events | Admin Activity Events API | Hourly | `core.fact_usage_event` |
| Refresh history | Dataset refresh APIs | Hourly | `core.fact_refresh_history` |
| Capacity metrics | Fabric Capacity Metrics export | 15 minutes | `core.fact_capacity_metric` |
| Entra users | Microsoft Graph users | Daily | `core.dim_user` |
| SharePoint reference | Governance lists/files | Daily | workspace owner overrides and exceptions |
| SQL reference | Enterprise mapping tables | Daily | workspace/domain/SLA enrichment |

Minimum ingestion controls:

- Persist raw API payloads before transformation.
- Track one `stg.ingestion_batch` row per request or logical page.
- Dedupe facts with natural keys.
- Use continuation token support for activity events.
- Respect API limits with exponential backoff.
- Alert on stale pipelines.

## Phase 3: Transform and Score

1. Normalize workspace, report, dashboard, dataset, user, and capacity dimensions.
2. Join activity events to artifacts using workspace/report/dashboard/dataset ids.
3. Classify view events into `is_view_event`.
4. Categorize refresh errors with `core.dim_error_category`.
5. Calculate refresh duration, retry count, and SLA status.
6. Calculate daily workspace health components:
   - Usage score.
   - Refresh health score.
   - Ownership score.
   - Activity score.
   - Orphan risk score.
   - Stale content score.
7. Materialize `governance.workspace_daily_snapshot` for historical trend reporting.
8. Generate recommendation candidates and route open actions to owners.

## Phase 4: Semantic Model

1. Import dimensions and facts from `core`, `governance`, and `mart` views.
2. Rename tables to business-friendly names.
3. Create relationships from [docs/02-data-model.md](02-data-model.md).
4. Add measures from [dax/measures.dax](../dax/measures.dax).
5. Configure incremental refresh.
6. Add RLS roles.
7. Hide technical columns.
8. Create field parameters:
   - Adoption grain.
   - Refresh metric.
   - Capacity metric.
   - Governance band.
9. Add calculation group for time intelligence if Tabular Editor is approved.

## Phase 5: Report Build

Build pages in this order:

1. Executive Overview.
2. Dataset Refresh Control Tower.
3. Premium Capacity Monitoring.
4. Idle Asset Governance Center.
5. Usage and Adoption Analytics.
6. Workspace Governance.

Reason: executive health, refresh failure, and capacity risk are the highest-operational-value surfaces. Adoption and workspace governance then complete the management picture.

Use the exact layout map in [docs/03-wireframes.md](03-wireframes.md).

## Phase 6: Validation

### Data Reconciliation

| Check | Expected |
| --- | --- |
| Workspace count | Matches Power BI Admin portal within metadata refresh SLA |
| Report count | Matches Admin API inventory for active workspaces |
| Activity event count | Matches API batch row counts after continuation paging |
| Refresh history | No duplicate `dataset_key/request_id/start_utc` combinations |
| Failed refresh % | Equals failed refresh count divided by total refresh count |
| Idle report list | Last viewed date reconciles to raw activity events |
| Capacity metrics | Peaks reconcile to Fabric Capacity Metrics source |

### UX Validation

- Executive page loads in under 5 seconds after semantic cache warm-up.
- No page has more than 12 primary visuals.
- All KPI cards display source freshness.
- Hover tooltips show definitions and operational detail.
- Critical alerts are visible without scrolling.
- Tables retain column alignment at 125% browser zoom.

### Security Validation

- Workspace owner RLS only shows assigned workspaces.
- Department leader RLS only shows mapped department data.
- Auditor role masks user details if required.
- Service principal has no unnecessary write permissions.
- Raw payload tables are not exposed to non-admin report users.

## Operational Alerts

| Alert | Trigger | Owner |
| --- | --- | --- |
| Activity ingestion stale | No successful batch in 2 hours | BI platform engineering |
| Refresh ingestion stale | No successful batch in 2 hours | BI platform engineering |
| Capacity metric stale | No successful batch in 30 minutes | Capacity admin |
| Failed refresh spike | Failed refresh % > 10% over 2 hours | Dataset owner and BI operations |
| Capacity overload | CU or CPU >= 100% or throttling > 0 | Capacity admin |
| Orphaned workspace | Owner count = 0 | BI governance |
| Idle critical content | Criticality high and no views > 60 days | Business owner |

## Deployment

Recommended environments:

| Environment | Purpose |
| --- | --- |
| Dev | Build and test schema, transformations, and report visuals |
| Test/UAT | Validate RLS, reconciliation, refresh performance, stakeholder review |
| Prod | Certified semantic model and published governance report app |

Deployment checklist:

- SQL schema deployed by migration script.
- Ingestion service principal secret rotated and stored securely.
- Semantic model parameters set for production SQL endpoint.
- Incremental refresh applied and first full refresh completed.
- Report theme applied.
- RLS tested with representative accounts.
- Report endorsed as Certified.
- App audience configured for executives, platform admins, governance, and workspace owners.

## Backlog Enhancements

- Teams or Power Automate workflow for recommendation assignment.
- ML-based anomaly detection for refresh duration and capacity spikes.
- Cost allocation by workspace and department.
- Purview sensitivity label compliance scoring.
- Deployment pipeline compliance checks.
- Git-integrated report definition validation for PBIR reports.
- Embedded admin action center with writeback for recommendation status.
