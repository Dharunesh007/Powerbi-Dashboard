# Power BI Wireframes

## Canvas Standard

- Canvas: 1920 x 1080, 16:9.
- Navigation rail: x 0, y 0, w 88, h 1080.
- Page header: x 112, y 32, w 1768, h 86.
- Content region: x 112, y 136, w 1768, h 904.
- Card radius: 8 px.
- Inner card padding: 20 px.
- Visual spacing: 16 px.
- Default slicer behavior: top header menu opens as overlay panel, not persistent clutter.
- Drill-through pages preserve selected workspace, report, dataset, capacity, owner, and date range.

## Common Shell

| Element | X | Y | W | H | Notes |
| --- | ---:| ---:| ---:| ---:| --- |
| Left rail background | 0 | 0 | 88 | 1080 | Dark glass rail, compact icon navigation |
| Logo mark | 24 | 24 | 40 | 40 | Product mark |
| Nav icon: Executive | 20 | 120 | 48 | 48 | Active page indicator |
| Nav icon: Refresh | 20 | 184 | 48 | 48 | Dataset refresh control tower |
| Nav icon: Adoption | 20 | 248 | 48 | 48 | Usage analytics |
| Nav icon: Idle | 20 | 312 | 48 | 48 | Idle governance |
| Nav icon: Workspace | 20 | 376 | 48 | 48 | Workspace governance |
| Nav icon: Capacity | 20 | 440 | 48 | 48 | Capacity monitoring |
| Global date range | 1310 | 42 | 210 | 40 | Dropdown chip |
| Capacity selector | 1536 | 42 | 184 | 40 | Dropdown chip |
| Alert button | 1736 | 42 | 48 | 40 | Badge count |
| Refresh timestamp | 1800 | 46 | 80 | 32 | Compact freshness text |

## Page 1: Executive Overview

Purpose: boardroom-ready landing page that answers platform health, user adoption, refresh risk, idle content, and capacity status in under 10 seconds.

| Visual | X | Y | W | H | Type | Details |
| --- | ---:| ---:| ---:| ---:| --- | --- |
| Page title | 112 | 32 | 580 | 46 | Text | "Power BI Premium Command Center" |
| Health score ring | 112 | 136 | 270 | 218 | Custom donut/card | Platform Health Score, status, 6-point trend |
| KPI: Active users | 398 | 136 | 270 | 218 | KPI card | DAU, WAU, MAU, trend vs prior period, sparkline |
| KPI: Failed refreshes | 684 | 136 | 270 | 218 | KPI card | Failed Refreshes Today, Failed Refresh %, top error chip |
| KPI: Idle reports | 970 | 136 | 270 | 218 | KPI card | Idle Reports > 60 Days, owner/workspace preview |
| KPI: Capacity utilization | 1256 | 136 | 270 | 218 | KPI card | P95 CU %, CPU, memory, query load |
| KPI: Workspace health | 1542 | 136 | 338 | 218 | KPI card | Avg Workspace Health Score, healthy/review/critical split |
| Adoption trend | 112 | 374 | 560 | 260 | Line + area | DAU, WAU, MAU with date brush |
| Refresh health summary | 688 | 374 | 384 | 260 | Stacked bar + summary | Completed, failed, SLA missed, retry trend |
| Capacity pressure | 1088 | 374 | 384 | 260 | Combo line | CU %, throttling seconds, overload bands |
| Alert summary | 1488 | 374 | 392 | 260 | Prioritized list | Critical alerts with age, owner, recommended next action |
| Top used reports | 112 | 654 | 560 | 250 | Ranked list | Report, workspace, views 30D, unique viewers, trend |
| Least used reports | 688 | 654 | 384 | 250 | Ranked list | Idle age, owner, recommendation |
| Workspace health matrix | 1088 | 654 | 384 | 250 | Heatmap | Workspaces by health component |
| Action recommendations | 1488 | 654 | 392 | 250 | Action list | Archive, review, optimize, retain |
| Narrative insight strip | 112 | 924 | 1768 | 116 | Smart narrative | 3 generated insight bullets with metric callouts |

Interactions:

- Click KPI cards to drill to corresponding page.
- Alert list opens a detail tooltip with error category, affected assets, owner, and suggested action.
- Workspace health matrix cross-filters all lower visuals.
- Top/least report lists use report URL as an admin-only action button.

## Page 2: Dataset Refresh Control Tower

Purpose: identify failing, slow, stale, and SLA-breaching semantic models instantly.

| Visual | X | Y | W | H | Type | Details |
| --- | ---:| ---:| ---:| ---:| --- | --- |
| Page title | 112 | 32 | 520 | 46 | Text | "Dataset Refresh Control Tower" |
| Filter bar | 112 | 136 | 1768 | 64 | Slicer row | Workspace, owner, dataset, status, SLA, date range |
| KPI: Failures today | 112 | 220 | 300 | 146 | KPI card | Count, trend, failure % |
| KPI: SLA compliance | 428 | 220 | 300 | 146 | KPI card | Refresh SLA %, missed count |
| KPI: Avg duration | 744 | 220 | 300 | 146 | KPI card | Avg/P95 duration, slow dataset count |
| KPI: Stale datasets | 1060 | 220 | 300 | 146 | KPI card | No refresh or old refresh |
| KPI: Retry pressure | 1376 | 220 | 504 | 146 | KPI card | Retry count, top retrying dataset |
| Refresh timeline | 112 | 386 | 840 | 300 | Timeline/Gantt | Dataset refresh windows, overlaps, failed markers |
| Failure categories | 968 | 386 | 420 | 300 | Horizontal bar | Credentials, gateway, timeout, memory, mashup |
| Duration outliers | 1404 | 386 | 476 | 300 | Scatter | Duration vs refresh count, colored by status |
| Dataset operations table | 112 | 706 | 1208 | 334 | Table | Dataset, workspace, owner, last, next, status, duration, SLA, error |
| Triage queue | 1336 | 706 | 544 | 334 | Action panel | Failing datasets, root cause, owner, recommended action |

Interactions:

- Table row drill-through opens dataset detail with full refresh history and exception JSON.
- Scatter selects slow datasets and filters the operations table.
- Failure category bars filter by error family.
- Triage queue includes buttons for Assign, Acknowledge, and Open Dataset in Power BI when embedded in a secure admin report.

## Page 3: Usage and Adoption Analytics

Purpose: understand report, dashboard, workspace, user, and department engagement.

| Visual | X | Y | W | H | Type | Details |
| --- | ---:| ---:| ---:| ---:| --- | --- |
| Page title | 112 | 32 | 520 | 46 | Text | "Usage and Adoption Analytics" |
| Filter bar | 112 | 136 | 1768 | 64 | Slicer row | Department, workspace, artifact type, user segment, date |
| KPI: DAU | 112 | 220 | 250 | 138 | KPI card | Daily active users |
| KPI: WAU | 378 | 220 | 250 | 138 | KPI card | Weekly active users |
| KPI: MAU | 644 | 220 | 250 | 138 | KPI card | Monthly active users |
| KPI: Retention | 910 | 220 | 250 | 138 | KPI card | 30D retention % |
| KPI: Repeat visit | 1176 | 220 | 250 | 138 | KPI card | Repeat visit % |
| KPI: Avg session | 1442 | 220 | 438 | 138 | KPI card | Avg session duration, engagement score |
| Adoption trend | 112 | 378 | 700 | 300 | Multi-line chart | DAU, WAU, MAU, report views |
| Department adoption | 828 | 378 | 480 | 300 | Bar + bullet | Department active users vs eligible users |
| Cohort retention | 1324 | 378 | 556 | 300 | Matrix heatmap | First-use cohort vs returning users |
| Top content | 112 | 698 | 560 | 342 | Ranked table | Reports and dashboards by views, unique users, repeat users |
| User segments | 688 | 698 | 410 | 342 | Donut + list | Power users, occasional, inactive |
| Workspace adoption | 1114 | 698 | 766 | 342 | Treemap/table hybrid | Workspace adoption, report count, owner |

Interactions:

- Toggle field parameter changes grain between report, dashboard, workspace, user, and department.
- Department bar drill-through opens department adoption profile.
- Cohort heatmap cross-filters power users and inactive users.

## Page 4: Idle Asset Governance Center

Purpose: convert stale content discovery into a governed action queue.

| Visual | X | Y | W | H | Type | Details |
| --- | ---:| ---:| ---:| ---:| --- | --- |
| Page title | 112 | 32 | 540 | 46 | Text | "Idle Asset Governance Center" |
| Filter bar | 112 | 136 | 1768 | 64 | Slicer row | Workspace, owner, asset type, age band, recommendation |
| KPI: Idle > 30 days | 112 | 220 | 282 | 138 | KPI card | Count and % |
| KPI: Idle > 60 days | 410 | 220 | 282 | 138 | KPI card | Count and % |
| KPI: Idle > 90 days | 708 | 220 | 282 | 138 | KPI card | Count and % |
| KPI: Duplicate assets | 1006 | 220 | 282 | 138 | KPI card | Candidate count |
| KPI: Abandoned workspaces | 1304 | 220 | 282 | 138 | KPI card | No owner/recent activity |
| KPI: Potential savings | 1602 | 220 | 278 | 138 | KPI card | Storage/CU opportunity |
| Idle aging funnel | 112 | 378 | 520 | 290 | Funnel | Active to idle bands |
| Recommendation mix | 648 | 378 | 420 | 290 | Donut/bar | Archive, review, delete, retain, optimize |
| Governance risk map | 1084 | 378 | 796 | 290 | Matrix heatmap | Workspace vs asset type and risk |
| Recommendation queue | 112 | 688 | 1240 | 352 | Table | Asset, owner, workspace, last viewed, risk, recommendation, due |
| Owner action load | 1368 | 688 | 512 | 352 | Ranked list | Owners with open recommendations, overdue, high risk |

Interactions:

- Recommendation queue supports drill-through to asset detail.
- Age band cards cross-filter the queue.
- Owner action load filters queue and sends action context to workspace governance page.

## Page 5: Workspace Governance

Purpose: provide a governed inventory of all workspaces with ownership, activity, storage, and health scoring.

| Visual | X | Y | W | H | Type | Details |
| --- | ---:| ---:| ---:| ---:| --- | --- |
| Page title | 112 | 32 | 520 | 46 | Text | "Workspace Governance" |
| Filter bar | 112 | 136 | 1768 | 64 | Slicer row | Domain, owner, capacity, criticality, score band |
| KPI: Workspace count | 112 | 220 | 270 | 138 | KPI card | Active/deleted split |
| KPI: Avg health score | 398 | 220 | 270 | 138 | KPI card | Score and band |
| KPI: Orphaned workspaces | 684 | 220 | 270 | 138 | KPI card | Count and risk trend |
| KPI: Inactive workspaces | 970 | 220 | 270 | 138 | KPI card | >60 days no activity |
| KPI: Storage footprint | 1256 | 220 | 270 | 138 | KPI card | Storage, growth |
| KPI: Owner coverage | 1542 | 220 | 338 | 138 | KPI card | Workspaces with 2+ active owners |
| Governance score distribution | 112 | 378 | 440 | 290 | Histogram | Health score bands |
| Workspace health components | 568 | 378 | 640 | 290 | Radar/small multiples | Usage, refresh, ownership, activity, stale content |
| Ownership risk | 1224 | 378 | 656 | 290 | Stacked bar | No owner, single owner, inactive owner, service-only |
| Workspace inventory | 112 | 688 | 1280 | 352 | Table | Workspace, owner, members, storage, datasets, reports, last modified, last viewed, score |
| Governance detail panel | 1408 | 688 | 472 | 352 | Detail card | Selected workspace health, risks, recommendations |

Interactions:

- Selecting a workspace reveals owner/member composition and recommendations.
- Score distribution filters inventory by health band.
- Drill-through to refresh, adoption, and idle pages with workspace context.

## Page 6: Premium Capacity Monitoring

Purpose: reveal capacity load, throttling, bottlenecks, and exhaustion forecasts.

| Visual | X | Y | W | H | Type | Details |
| --- | ---:| ---:| ---:| ---:| --- | --- |
| Page title | 112 | 32 | 560 | 46 | Text | "Premium Capacity Monitoring" |
| Filter bar | 112 | 136 | 1768 | 64 | Slicer row | Capacity, workload, operation, date/time grain |
| KPI: CU utilization | 112 | 220 | 282 | 138 | KPI card | P95, peak, trend |
| KPI: CPU | 410 | 220 | 282 | 138 | KPI card | Avg and peak |
| KPI: Memory | 708 | 220 | 282 | 138 | KPI card | Avg and peak |
| KPI: Concurrency | 1006 | 220 | 282 | 138 | KPI card | Peak concurrent operations |
| KPI: Refresh queue | 1304 | 220 | 282 | 138 | KPI card | Max queue, average wait |
| KPI: Throttling | 1602 | 220 | 278 | 138 | KPI card | Seconds, rejected operations |
| Capacity utilization trend | 112 | 378 | 840 | 310 | Multi-axis line | CU %, CPU %, memory %, threshold bands |
| Workload pressure | 968 | 378 | 420 | 310 | Stacked area | Interactive vs background CU seconds |
| Forecast | 1404 | 378 | 476 | 310 | Forecast line | Projected exhaustion and confidence |
| Bottleneck matrix | 112 | 708 | 760 | 332 | Matrix heatmap | Workspace/item by CU, query load, throttling |
| Peak windows | 888 | 708 | 452 | 332 | Calendar heatmap | Hour of day/day of week peaks |
| Mitigation playbook | 1356 | 708 | 524 | 332 | Action panel | Scale, reschedule, optimize, isolate workloads |

Interactions:

- Capacity trend selects a time window and filters bottleneck matrix.
- Bottleneck matrix drill-through opens workspace and item detail.
- Forecast visual includes a scenario toggle for current trend, +15% growth, +30% growth.

## Tooltip Standards

| Tooltip | Trigger | Content |
| --- | --- | --- |
| KPI card hover | Any KPI card | Current value, prior period, trend line, definition, last refreshed |
| Report hover | Report rows/lists | Owner, workspace, last view, 30D views, unique viewers, recommendation |
| Dataset hover | Dataset rows/charts | Last refresh, next refresh, P95 duration, failure category, SLA |
| Workspace hover | Health visuals | Component scores, owner count, idle content count, critical recommendations |
| Capacity hover | Capacity charts | CU %, CPU %, memory %, throttling, top operation, timestamp |

## Drill-through Targets

| Target | Inputs | Output |
| --- | --- | --- |
| Report Detail | Report key, workspace key | Adoption trend, users, owner, recommendations, access list |
| Dataset Detail | Dataset key, workspace key | Refresh history, duration profile, failures, lineage, gateway |
| Workspace Detail | Workspace key | Governance score, owners, members, assets, activity, exceptions |
| User Detail | User key | Usage profile, departments, reports viewed, inactive risk |
| Capacity Detail | Capacity key, time window | Bottlenecks, operations, workspace pressure, forecast |
