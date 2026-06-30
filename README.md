# Power BI Premium Governance, Usage, and Refresh Monitoring Platform

This repository contains an implementation-ready blueprint and local live prototype for an enterprise Power BI Premium Per User observability platform. It is designed for IT, BI governance, platform engineering, and executive stakeholders who need one governed source of truth for adoption, refresh health, workspace risk, and access/security review.

## Artifact Map

| Area | File |
| --- | --- |
| Architecture and operating model | [docs/01-architecture.md](docs/01-architecture.md) |
| SQL warehouse schema and scoring views | [sql/001_powerbi_monitoring_schema.sql](sql/001_powerbi_monitoring_schema.sql) |
| Power Query ingestion templates | [power-query/PowerBI_Admin_Ingestion.pq](power-query/PowerBI_Admin_Ingestion.pq) |
| Semantic model and relationships | [docs/02-data-model.md](docs/02-data-model.md) |
| DAX measure library | [dax/measures.dax](dax/measures.dax) |
| Page-by-page Power BI wireframes | [docs/03-wireframes.md](docs/03-wireframes.md) |
| Enterprise UI design system | [docs/04-design-system.md](docs/04-design-system.md) |
| Implementation and operations runbook | [docs/05-implementation-runbook.md](docs/05-implementation-runbook.md) |
| Live dashboard prototype | [prototype/index.html](prototype/index.html) |
| Local run script | [run-dashboard.ps1](run-dashboard.ps1) |
| Environment template | [.env.example.ps1](.env.example.ps1) |

## Local Live Prototype

The local prototype uses a small Node.js server to call Power BI REST APIs. It is locked to one configured Premium Per User mailbox through `POWERBI_TARGET_USER`; it will not fall back to tenant-wide reporting if that value is missing.

1. Copy `.env.example.ps1` to `.env.local.ps1`.
2. Fill in tenant ID, client ID, client secret, and the target PPU mailbox.
3. Run:

```powershell
PowerShell -ExecutionPolicy Bypass -File .\run-dashboard.ps1
```

4. Open:

```text
http://127.0.0.1:47844/
```

Do not commit `.env.local.ps1`. It is ignored by Git because it contains secrets.

## GitHub Hosting Note

GitHub Pages can host only static HTML/CSS/JS. This dashboard needs a backend server because the Power BI client secret must never be exposed in browser JavaScript. Use GitHub for source control, and host the live app on an internal VM, Azure App Service, IIS Node hosting, or another secure internal server where environment variables can be protected.

## Intended Platform Shape

- **Bronze:** immutable raw JSON/API extracts from Power BI Admin APIs, Activity Events, refresh APIs, Microsoft Graph/Entra ID, SharePoint, and optional reference data.
- **Silver:** normalized SQL Server tables for users, workspaces, reports, semantic models, refreshes, activity, capacity telemetry, and governance snapshots.
- **Gold:** semantic views and a Power BI model optimized around executive KPIs, drill-through analysis, governance recommendations, and operational triage.
- **Presentation:** six Power BI report pages plus a premium executive experience pattern captured in the local HTML prototype.

## Current Microsoft API References Used

- [Power BI Admin Activity Events API](https://learn.microsoft.com/en-us/rest/api/power-bi/admin/get-activity-events)
- [Power BI Admin Groups API](https://learn.microsoft.com/en-us/rest/api/power-bi/admin/groups-get-groups-as-admin)
- [Power BI Workspace Scanner result API](https://learn.microsoft.com/en-us/rest/api/power-bi/admin/workspace-info-get-scan-result)
- [Power BI Dataset Refresh History API](https://learn.microsoft.com/en-us/rest/api/power-bi/datasets/get-refresh-history)
- [Microsoft Fabric Capacity Metrics app](https://learn.microsoft.com/en-us/power-bi/connect-data/service-connect-to-pbi-premium-capacity-metrics)
- [Power BI tenant-level auditing guidance](https://learn.microsoft.com/en-us/power-bi/guidance/powerbi-implementation-planning-auditing-monitoring-tenant-level-auditing)
- [Microsoft Graph Entra identity APIs](https://learn.microsoft.com/en-us/graph/identity-network-access-overview/)

## Build Notes

- The SQL schema is SQL Server/Azure SQL compatible.
- The Power Query scripts are templates intended to be parameterized with secure token handling in Power BI Dataflows, Fabric Data Factory, or a managed orchestration layer.
- The DAX file assumes the table names and columns produced by the SQL schema/views.
- The live prototype must be run through `run-dashboard.ps1` so the backend API proxy can safely use protected environment variables.
