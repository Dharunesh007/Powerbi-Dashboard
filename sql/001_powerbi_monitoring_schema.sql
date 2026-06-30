/*
Power BI Premium Governance, Usage, and Refresh Monitoring Platform
SQL Server / Azure SQL schema

Run order:
1. Create schemas and tables.
2. Load or merge source data into stg/core tables.
3. Use governance and mart views for semantic model import.
*/

SET XACT_ABORT ON;
GO

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'stg') EXEC('CREATE SCHEMA stg');
IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'core') EXEC('CREATE SCHEMA core');
IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'governance') EXEC('CREATE SCHEMA governance');
IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'mart') EXEC('CREATE SCHEMA mart');
GO

IF OBJECT_ID('stg.ingestion_batch', 'U') IS NULL
CREATE TABLE stg.ingestion_batch (
    batch_id              bigint IDENTITY(1,1) NOT NULL CONSTRAINT pk_ingestion_batch PRIMARY KEY,
    source_system         nvarchar(80) NOT NULL,
    source_entity         nvarchar(120) NOT NULL,
    request_url           nvarchar(2048) NULL,
    request_started_utc   datetime2(3) NOT NULL CONSTRAINT df_ingestion_batch_started DEFAULT SYSUTCDATETIME(),
    request_finished_utc  datetime2(3) NULL,
    http_status_code      int NULL,
    continuation_token    nvarchar(max) NULL,
    watermark_utc         datetime2(3) NULL,
    rows_received         int NULL,
    status                nvarchar(30) NOT NULL CONSTRAINT df_ingestion_batch_status DEFAULT 'Started',
    error_message         nvarchar(max) NULL
);
GO

IF OBJECT_ID('stg.raw_api_payload', 'U') IS NULL
CREATE TABLE stg.raw_api_payload (
    raw_payload_id      bigint IDENTITY(1,1) NOT NULL CONSTRAINT pk_raw_api_payload PRIMARY KEY,
    batch_id            bigint NOT NULL,
    source_system       nvarchar(80) NOT NULL,
    source_entity       nvarchar(120) NOT NULL,
    natural_key         nvarchar(300) NULL,
    payload_json        nvarchar(max) NOT NULL,
    payload_hash        varbinary(32) NULL,
    source_modified_utc datetime2(3) NULL,
    ingested_utc        datetime2(3) NOT NULL CONSTRAINT df_raw_api_payload_ingested DEFAULT SYSUTCDATETIME(),
    CONSTRAINT fk_raw_api_payload_batch FOREIGN KEY (batch_id) REFERENCES stg.ingestion_batch(batch_id),
    CONSTRAINT ck_raw_api_payload_is_json CHECK (ISJSON(payload_json) = 1)
);
GO

IF OBJECT_ID('core.dim_date', 'U') IS NULL
CREATE TABLE core.dim_date (
    date_key          int NOT NULL CONSTRAINT pk_dim_date PRIMARY KEY,
    calendar_date     date NOT NULL CONSTRAINT uq_dim_date_calendar UNIQUE,
    calendar_year     smallint NOT NULL,
    calendar_quarter  tinyint NOT NULL,
    calendar_month    tinyint NOT NULL,
    month_name        nvarchar(20) NOT NULL,
    week_start_date   date NOT NULL,
    day_of_week       tinyint NOT NULL,
    day_name          nvarchar(20) NOT NULL,
    is_weekend        bit NOT NULL
);
GO

IF OBJECT_ID('core.dim_user', 'U') IS NULL
CREATE TABLE core.dim_user (
    user_key             bigint IDENTITY(1,1) NOT NULL CONSTRAINT pk_dim_user PRIMARY KEY,
    entra_user_id        nvarchar(64) NULL,
    user_principal_name  nvarchar(320) NOT NULL,
    mail                 nvarchar(320) NULL,
    display_name         nvarchar(300) NULL,
    department           nvarchar(200) NULL,
    job_title            nvarchar(200) NULL,
    manager_upn          nvarchar(320) NULL,
    company_name         nvarchar(200) NULL,
    user_type            nvarchar(80) NULL,
    account_enabled      bit NULL,
    is_service_account   bit NOT NULL CONSTRAINT df_dim_user_is_service DEFAULT 0,
    valid_from_utc       datetime2(3) NOT NULL CONSTRAINT df_dim_user_valid_from DEFAULT SYSUTCDATETIME(),
    valid_to_utc         datetime2(3) NULL,
    is_current           bit NOT NULL CONSTRAINT df_dim_user_is_current DEFAULT 1,
    source_system        nvarchar(80) NOT NULL CONSTRAINT df_dim_user_source DEFAULT 'Microsoft Graph',
    ingested_utc         datetime2(3) NOT NULL CONSTRAINT df_dim_user_ingested DEFAULT SYSUTCDATETIME()
);
GO

IF OBJECT_ID('core.dim_capacity', 'U') IS NULL
CREATE TABLE core.dim_capacity (
    capacity_key            bigint IDENTITY(1,1) NOT NULL CONSTRAINT pk_dim_capacity PRIMARY KEY,
    capacity_id             nvarchar(64) NOT NULL CONSTRAINT uq_dim_capacity_id UNIQUE,
    capacity_name           nvarchar(300) NOT NULL,
    sku                     nvarchar(60) NULL,
    region                  nvarchar(80) NULL,
    state                   nvarchar(60) NULL,
    capacity_admin_upn      nvarchar(320) NULL,
    purchased_cu            decimal(18,4) NULL,
    purchased_vcores        decimal(18,4) NULL,
    autoscale_enabled       bit NULL,
    created_utc             datetime2(3) NULL,
    modified_utc            datetime2(3) NULL,
    ingested_utc            datetime2(3) NOT NULL CONSTRAINT df_dim_capacity_ingested DEFAULT SYSUTCDATETIME()
);
GO

IF OBJECT_ID('core.dim_workspace', 'U') IS NULL
CREATE TABLE core.dim_workspace (
    workspace_key                  bigint IDENTITY(1,1) NOT NULL CONSTRAINT pk_dim_workspace PRIMARY KEY,
    workspace_id                   nvarchar(64) NOT NULL CONSTRAINT uq_dim_workspace_id UNIQUE,
    workspace_name                 nvarchar(300) NOT NULL,
    workspace_type                 nvarchar(80) NULL,
    workspace_state                nvarchar(80) NULL,
    capacity_key                   bigint NULL,
    capacity_id                    nvarchar(64) NULL,
    is_on_dedicated_capacity       bit NULL,
    default_dataset_storage_format nvarchar(60) NULL,
    description                    nvarchar(max) NULL,
    business_owner_upn             nvarchar(320) NULL,
    technical_owner_upn            nvarchar(320) NULL,
    criticality                    nvarchar(40) NULL,
    sla_tier                       nvarchar(40) NULL,
    business_domain                nvarchar(160) NULL,
    cost_center                    nvarchar(80) NULL,
    environment_name               nvarchar(40) NULL,
    created_utc                    datetime2(3) NULL,
    modified_utc                   datetime2(3) NULL,
    source_modified_utc            datetime2(3) NULL,
    is_deleted                     bit NOT NULL CONSTRAINT df_dim_workspace_deleted DEFAULT 0,
    ingested_utc                   datetime2(3) NOT NULL CONSTRAINT df_dim_workspace_ingested DEFAULT SYSUTCDATETIME(),
    CONSTRAINT fk_dim_workspace_capacity FOREIGN KEY (capacity_key) REFERENCES core.dim_capacity(capacity_key)
);
GO

IF OBJECT_ID('core.dim_dataset', 'U') IS NULL
CREATE TABLE core.dim_dataset (
    dataset_key                bigint IDENTITY(1,1) NOT NULL CONSTRAINT pk_dim_dataset PRIMARY KEY,
    dataset_id                 nvarchar(64) NOT NULL,
    workspace_key              bigint NOT NULL,
    dataset_name               nvarchar(300) NOT NULL,
    configured_by_upn          nvarchar(320) NULL,
    owner_upn                  nvarchar(320) NULL,
    storage_mode               nvarchar(80) NULL,
    content_provider_type      nvarchar(120) NULL,
    is_refreshable             bit NULL,
    is_effective_identity_required bit NULL,
    is_effective_identity_roles_required bit NULL,
    add_rows_api_enabled       bit NULL,
    endorsement                nvarchar(80) NULL,
    certified_by_upn           nvarchar(320) NULL,
    sensitivity_label_id       nvarchar(80) NULL,
    gateway_id                 nvarchar(64) NULL,
    created_utc                datetime2(3) NULL,
    modified_utc               datetime2(3) NULL,
    source_modified_utc        datetime2(3) NULL,
    is_deleted                 bit NOT NULL CONSTRAINT df_dim_dataset_deleted DEFAULT 0,
    ingested_utc               datetime2(3) NOT NULL CONSTRAINT df_dim_dataset_ingested DEFAULT SYSUTCDATETIME(),
    CONSTRAINT fk_dim_dataset_workspace FOREIGN KEY (workspace_key) REFERENCES core.dim_workspace(workspace_key),
    CONSTRAINT uq_dim_dataset_workspace UNIQUE (workspace_key, dataset_id)
);
GO

IF OBJECT_ID('core.dim_report', 'U') IS NULL
CREATE TABLE core.dim_report (
    report_key            bigint IDENTITY(1,1) NOT NULL CONSTRAINT pk_dim_report PRIMARY KEY,
    report_id             nvarchar(64) NOT NULL,
    workspace_key         bigint NOT NULL,
    dataset_key           bigint NULL,
    dataset_id            nvarchar(64) NULL,
    report_name           nvarchar(300) NOT NULL,
    report_type           nvarchar(80) NULL,
    web_url               nvarchar(2048) NULL,
    embed_url             nvarchar(2048) NULL,
    app_id                nvarchar(64) NULL,
    created_by_upn        nvarchar(320) NULL,
    modified_by_upn       nvarchar(320) NULL,
    owner_upn             nvarchar(320) NULL,
    endorsement           nvarchar(80) NULL,
    certified_by_upn      nvarchar(320) NULL,
    sensitivity_label_id  nvarchar(80) NULL,
    created_utc           datetime2(3) NULL,
    modified_utc          datetime2(3) NULL,
    source_modified_utc   datetime2(3) NULL,
    is_deleted            bit NOT NULL CONSTRAINT df_dim_report_deleted DEFAULT 0,
    ingested_utc          datetime2(3) NOT NULL CONSTRAINT df_dim_report_ingested DEFAULT SYSUTCDATETIME(),
    CONSTRAINT fk_dim_report_workspace FOREIGN KEY (workspace_key) REFERENCES core.dim_workspace(workspace_key),
    CONSTRAINT fk_dim_report_dataset FOREIGN KEY (dataset_key) REFERENCES core.dim_dataset(dataset_key),
    CONSTRAINT uq_dim_report_workspace UNIQUE (workspace_key, report_id)
);
GO

IF OBJECT_ID('core.dim_dashboard', 'U') IS NULL
CREATE TABLE core.dim_dashboard (
    dashboard_key       bigint IDENTITY(1,1) NOT NULL CONSTRAINT pk_dim_dashboard PRIMARY KEY,
    dashboard_id        nvarchar(64) NOT NULL,
    workspace_key       bigint NOT NULL,
    dashboard_name      nvarchar(300) NOT NULL,
    web_url             nvarchar(2048) NULL,
    owner_upn           nvarchar(320) NULL,
    created_utc         datetime2(3) NULL,
    modified_utc        datetime2(3) NULL,
    is_deleted          bit NOT NULL CONSTRAINT df_dim_dashboard_deleted DEFAULT 0,
    ingested_utc        datetime2(3) NOT NULL CONSTRAINT df_dim_dashboard_ingested DEFAULT SYSUTCDATETIME(),
    CONSTRAINT fk_dim_dashboard_workspace FOREIGN KEY (workspace_key) REFERENCES core.dim_workspace(workspace_key),
    CONSTRAINT uq_dim_dashboard_workspace UNIQUE (workspace_key, dashboard_id)
);
GO

IF OBJECT_ID('core.dim_error_category', 'U') IS NULL
CREATE TABLE core.dim_error_category (
    error_category_key   int IDENTITY(1,1) NOT NULL CONSTRAINT pk_dim_error_category PRIMARY KEY,
    error_category       nvarchar(120) NOT NULL CONSTRAINT uq_dim_error_category UNIQUE,
    error_family         nvarchar(120) NOT NULL,
    severity             nvarchar(30) NOT NULL,
    recommended_action   nvarchar(500) NULL
);
GO

IF OBJECT_ID('core.bridge_workspace_user_role', 'U') IS NULL
CREATE TABLE core.bridge_workspace_user_role (
    workspace_user_role_key bigint IDENTITY(1,1) NOT NULL CONSTRAINT pk_bridge_workspace_user_role PRIMARY KEY,
    workspace_key           bigint NOT NULL,
    user_key                bigint NULL,
    principal_identifier    nvarchar(320) NOT NULL,
    principal_type          nvarchar(80) NOT NULL,
    access_right            nvarchar(80) NOT NULL,
    is_owner_candidate      bit NOT NULL CONSTRAINT df_bridge_workspace_owner_candidate DEFAULT 0,
    valid_from_utc          datetime2(3) NOT NULL CONSTRAINT df_bridge_workspace_valid_from DEFAULT SYSUTCDATETIME(),
    valid_to_utc            datetime2(3) NULL,
    is_current              bit NOT NULL CONSTRAINT df_bridge_workspace_is_current DEFAULT 1,
    ingested_utc            datetime2(3) NOT NULL CONSTRAINT df_bridge_workspace_ingested DEFAULT SYSUTCDATETIME(),
    CONSTRAINT fk_bridge_workspace_user_role_workspace FOREIGN KEY (workspace_key) REFERENCES core.dim_workspace(workspace_key),
    CONSTRAINT fk_bridge_workspace_user_role_user FOREIGN KEY (user_key) REFERENCES core.dim_user(user_key)
);
GO

IF OBJECT_ID('core.bridge_report_user_access', 'U') IS NULL
CREATE TABLE core.bridge_report_user_access (
    report_user_access_key bigint IDENTITY(1,1) NOT NULL CONSTRAINT pk_bridge_report_user_access PRIMARY KEY,
    report_key             bigint NOT NULL,
    user_key               bigint NULL,
    principal_identifier   nvarchar(320) NOT NULL,
    principal_type         nvarchar(80) NOT NULL,
    access_right           nvarchar(80) NOT NULL,
    valid_from_utc         datetime2(3) NOT NULL CONSTRAINT df_bridge_report_valid_from DEFAULT SYSUTCDATETIME(),
    valid_to_utc           datetime2(3) NULL,
    is_current             bit NOT NULL CONSTRAINT df_bridge_report_is_current DEFAULT 1,
    ingested_utc           datetime2(3) NOT NULL CONSTRAINT df_bridge_report_ingested DEFAULT SYSUTCDATETIME(),
    CONSTRAINT fk_bridge_report_user_access_report FOREIGN KEY (report_key) REFERENCES core.dim_report(report_key),
    CONSTRAINT fk_bridge_report_user_access_user FOREIGN KEY (user_key) REFERENCES core.dim_user(user_key)
);
GO

IF OBJECT_ID('core.fact_usage_event', 'U') IS NULL
CREATE TABLE core.fact_usage_event (
    usage_event_key       bigint IDENTITY(1,1) NOT NULL CONSTRAINT pk_fact_usage_event PRIMARY KEY,
    activity_id           nvarchar(120) NOT NULL,
    event_utc             datetime2(3) NOT NULL,
    event_date_key        int NULL,
    user_key              bigint NULL,
    workspace_key         bigint NULL,
    report_key            bigint NULL,
    dashboard_key         bigint NULL,
    dataset_key           bigint NULL,
    capacity_key          bigint NULL,
    user_principal_name   nvarchar(320) NULL,
    workspace_id          nvarchar(64) NULL,
    report_id             nvarchar(64) NULL,
    dashboard_id          nvarchar(64) NULL,
    dataset_id            nvarchar(64) NULL,
    capacity_id           nvarchar(64) NULL,
    activity_name         nvarchar(160) NOT NULL,
    workload              nvarchar(80) NULL,
    operation             nvarchar(160) NULL,
    item_name             nvarchar(300) NULL,
    distribution_method   nvarchar(120) NULL,
    consumption_method    nvarchar(120) NULL,
    client_ip             nvarchar(80) NULL,
    user_agent            nvarchar(1000) NULL,
    is_view_event         bit NOT NULL CONSTRAINT df_fact_usage_is_view DEFAULT 0,
    session_id            nvarchar(120) NULL,
    session_duration_sec  int NULL,
    raw_payload_id        bigint NULL,
    ingested_utc          datetime2(3) NOT NULL CONSTRAINT df_fact_usage_ingested DEFAULT SYSUTCDATETIME(),
    CONSTRAINT fk_fact_usage_event_date FOREIGN KEY (event_date_key) REFERENCES core.dim_date(date_key),
    CONSTRAINT fk_fact_usage_event_user FOREIGN KEY (user_key) REFERENCES core.dim_user(user_key),
    CONSTRAINT fk_fact_usage_event_workspace FOREIGN KEY (workspace_key) REFERENCES core.dim_workspace(workspace_key),
    CONSTRAINT fk_fact_usage_event_report FOREIGN KEY (report_key) REFERENCES core.dim_report(report_key),
    CONSTRAINT fk_fact_usage_event_dashboard FOREIGN KEY (dashboard_key) REFERENCES core.dim_dashboard(dashboard_key),
    CONSTRAINT fk_fact_usage_event_dataset FOREIGN KEY (dataset_key) REFERENCES core.dim_dataset(dataset_key),
    CONSTRAINT fk_fact_usage_event_capacity FOREIGN KEY (capacity_key) REFERENCES core.dim_capacity(capacity_key),
    CONSTRAINT fk_fact_usage_event_raw FOREIGN KEY (raw_payload_id) REFERENCES stg.raw_api_payload(raw_payload_id),
    CONSTRAINT uq_fact_usage_event_activity UNIQUE (activity_id, event_utc)
);
GO

IF OBJECT_ID('core.fact_refresh_history', 'U') IS NULL
CREATE TABLE core.fact_refresh_history (
    refresh_key              bigint IDENTITY(1,1) NOT NULL CONSTRAINT pk_fact_refresh_history PRIMARY KEY,
    request_id               nvarchar(120) NOT NULL,
    dataset_key              bigint NOT NULL,
    workspace_key            bigint NOT NULL,
    capacity_key             bigint NULL,
    start_utc                datetime2(3) NOT NULL,
    end_utc                  datetime2(3) NULL,
    start_date_key           int NULL,
    refresh_type             nvarchar(80) NULL,
    refresh_status           nvarchar(80) NOT NULL,
    duration_sec             int NULL,
    refresh_attempt_count    int NULL,
    retry_count              int NULL,
    service_exception_json   nvarchar(max) NULL,
    error_code               nvarchar(300) NULL,
    error_category_key       int NULL,
    sla_target_minutes       int NULL,
    sla_met                  bit NULL,
    is_incremental_refresh   bit NULL,
    raw_payload_id           bigint NULL,
    ingested_utc             datetime2(3) NOT NULL CONSTRAINT df_fact_refresh_ingested DEFAULT SYSUTCDATETIME(),
    CONSTRAINT fk_fact_refresh_dataset FOREIGN KEY (dataset_key) REFERENCES core.dim_dataset(dataset_key),
    CONSTRAINT fk_fact_refresh_workspace FOREIGN KEY (workspace_key) REFERENCES core.dim_workspace(workspace_key),
    CONSTRAINT fk_fact_refresh_capacity FOREIGN KEY (capacity_key) REFERENCES core.dim_capacity(capacity_key),
    CONSTRAINT fk_fact_refresh_date FOREIGN KEY (start_date_key) REFERENCES core.dim_date(date_key),
    CONSTRAINT fk_fact_refresh_error FOREIGN KEY (error_category_key) REFERENCES core.dim_error_category(error_category_key),
    CONSTRAINT fk_fact_refresh_raw FOREIGN KEY (raw_payload_id) REFERENCES stg.raw_api_payload(raw_payload_id),
    CONSTRAINT ck_fact_refresh_exception_json CHECK (service_exception_json IS NULL OR ISJSON(service_exception_json) = 1),
    CONSTRAINT uq_fact_refresh_request UNIQUE (dataset_key, request_id, start_utc)
);
GO

IF OBJECT_ID('core.fact_capacity_metric', 'U') IS NULL
CREATE TABLE core.fact_capacity_metric (
    capacity_metric_key       bigint IDENTITY(1,1) NOT NULL CONSTRAINT pk_fact_capacity_metric PRIMARY KEY,
    capacity_key              bigint NOT NULL,
    metric_utc                datetime2(3) NOT NULL,
    metric_date_key           int NULL,
    cpu_pct                   decimal(9,4) NULL,
    memory_pct                decimal(9,4) NULL,
    cu_pct                    decimal(9,4) NULL,
    query_load_pct            decimal(9,4) NULL,
    interactive_cu_sec        decimal(18,4) NULL,
    background_cu_sec         decimal(18,4) NULL,
    concurrency_count         int NULL,
    refresh_queue_count       int NULL,
    overload_event_count      int NULL,
    throttling_sec            decimal(18,4) NULL,
    rejected_operation_count  int NULL,
    peak_operation_name       nvarchar(160) NULL,
    source_system             nvarchar(80) NOT NULL CONSTRAINT df_fact_capacity_source DEFAULT 'Fabric Capacity Metrics',
    ingested_utc              datetime2(3) NOT NULL CONSTRAINT df_fact_capacity_ingested DEFAULT SYSUTCDATETIME(),
    CONSTRAINT fk_fact_capacity_metric_capacity FOREIGN KEY (capacity_key) REFERENCES core.dim_capacity(capacity_key),
    CONSTRAINT fk_fact_capacity_metric_date FOREIGN KEY (metric_date_key) REFERENCES core.dim_date(date_key),
    CONSTRAINT uq_fact_capacity_metric UNIQUE (capacity_key, metric_utc)
);
GO

IF OBJECT_ID('governance.workspace_daily_snapshot', 'U') IS NULL
CREATE TABLE governance.workspace_daily_snapshot (
    workspace_daily_snapshot_key bigint IDENTITY(1,1) NOT NULL CONSTRAINT pk_workspace_daily_snapshot PRIMARY KEY,
    snapshot_date_key            int NOT NULL,
    workspace_key                bigint NOT NULL,
    active_user_30d_count        int NOT NULL CONSTRAINT df_workspace_snapshot_active_users DEFAULT 0,
    report_view_30d_count        int NOT NULL CONSTRAINT df_workspace_snapshot_report_views DEFAULT 0,
    failed_refresh_7d_count      int NOT NULL CONSTRAINT df_workspace_snapshot_failed_refresh DEFAULT 0,
    total_refresh_7d_count       int NOT NULL CONSTRAINT df_workspace_snapshot_total_refresh DEFAULT 0,
    idle_report_count            int NOT NULL CONSTRAINT df_workspace_snapshot_idle_reports DEFAULT 0,
    report_count                 int NOT NULL CONSTRAINT df_workspace_snapshot_report_count DEFAULT 0,
    dataset_count                int NOT NULL CONSTRAINT df_workspace_snapshot_dataset_count DEFAULT 0,
    owner_count                  int NOT NULL CONSTRAINT df_workspace_snapshot_owner_count DEFAULT 0,
    inactive_owner_count         int NOT NULL CONSTRAINT df_workspace_snapshot_inactive_owner DEFAULT 0,
    days_since_last_activity     int NULL,
    orphan_risk_flag             bit NOT NULL CONSTRAINT df_workspace_snapshot_orphan_flag DEFAULT 0,
    stale_content_flag           bit NOT NULL CONSTRAINT df_workspace_snapshot_stale_flag DEFAULT 0,
    usage_score                  decimal(9,4) NULL,
    refresh_health_score         decimal(9,4) NULL,
    ownership_score              decimal(9,4) NULL,
    activity_score               decimal(9,4) NULL,
    orphan_risk_score            decimal(9,4) NULL,
    stale_content_score          decimal(9,4) NULL,
    workspace_health_score       decimal(9,4) NULL,
    workspace_health_status      nvarchar(40) NULL,
    calculated_utc               datetime2(3) NOT NULL CONSTRAINT df_workspace_snapshot_calculated DEFAULT SYSUTCDATETIME(),
    CONSTRAINT fk_workspace_snapshot_date FOREIGN KEY (snapshot_date_key) REFERENCES core.dim_date(date_key),
    CONSTRAINT fk_workspace_snapshot_workspace FOREIGN KEY (workspace_key) REFERENCES core.dim_workspace(workspace_key),
    CONSTRAINT uq_workspace_daily_snapshot UNIQUE (snapshot_date_key, workspace_key)
);
GO

IF OBJECT_ID('governance.asset_recommendation', 'U') IS NULL
CREATE TABLE governance.asset_recommendation (
    recommendation_key      bigint IDENTITY(1,1) NOT NULL CONSTRAINT pk_asset_recommendation PRIMARY KEY,
    recommendation_date_key int NOT NULL,
    asset_type              nvarchar(60) NOT NULL,
    asset_key               bigint NOT NULL,
    workspace_key           bigint NULL,
    recommendation          nvarchar(60) NOT NULL,
    risk_level              nvarchar(30) NOT NULL,
    reason                  nvarchar(1000) NOT NULL,
    owner_upn               nvarchar(320) NULL,
    due_date                date NULL,
    action_status           nvarchar(40) NOT NULL CONSTRAINT df_asset_recommendation_status DEFAULT 'Open',
    created_utc             datetime2(3) NOT NULL CONSTRAINT df_asset_recommendation_created DEFAULT SYSUTCDATETIME(),
    closed_utc              datetime2(3) NULL,
    CONSTRAINT fk_asset_recommendation_date FOREIGN KEY (recommendation_date_key) REFERENCES core.dim_date(date_key),
    CONSTRAINT fk_asset_recommendation_workspace FOREIGN KEY (workspace_key) REFERENCES core.dim_workspace(workspace_key)
);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ux_dim_user_upn_current' AND object_id = OBJECT_ID('core.dim_user'))
CREATE UNIQUE INDEX ux_dim_user_upn_current ON core.dim_user(user_principal_name) WHERE is_current = 1;

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_raw_api_payload_source_key' AND object_id = OBJECT_ID('stg.raw_api_payload'))
CREATE INDEX ix_raw_api_payload_source_key ON stg.raw_api_payload(source_system, source_entity, natural_key);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_dim_workspace_capacity' AND object_id = OBJECT_ID('core.dim_workspace'))
CREATE INDEX ix_dim_workspace_capacity ON core.dim_workspace(capacity_key, workspace_state);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_dim_report_workspace_dataset' AND object_id = OBJECT_ID('core.dim_report'))
CREATE INDEX ix_dim_report_workspace_dataset ON core.dim_report(workspace_key, dataset_key);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_dim_dataset_workspace' AND object_id = OBJECT_ID('core.dim_dataset'))
CREATE INDEX ix_dim_dataset_workspace ON core.dim_dataset(workspace_key, is_refreshable);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_usage_event_date_workspace' AND object_id = OBJECT_ID('core.fact_usage_event'))
CREATE INDEX ix_usage_event_date_workspace ON core.fact_usage_event(event_date_key, workspace_key) INCLUDE (user_key, report_key, activity_name, is_view_event);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_usage_event_report_time' AND object_id = OBJECT_ID('core.fact_usage_event'))
CREATE INDEX ix_usage_event_report_time ON core.fact_usage_event(report_key, event_utc) INCLUDE (user_key, is_view_event);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_refresh_dataset_time' AND object_id = OBJECT_ID('core.fact_refresh_history'))
CREATE INDEX ix_refresh_dataset_time ON core.fact_refresh_history(dataset_key, start_utc) INCLUDE (refresh_status, duration_sec, error_category_key);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_refresh_workspace_date' AND object_id = OBJECT_ID('core.fact_refresh_history'))
CREATE INDEX ix_refresh_workspace_date ON core.fact_refresh_history(workspace_key, start_date_key) INCLUDE (refresh_status, sla_met);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_capacity_metric_time' AND object_id = OBJECT_ID('core.fact_capacity_metric'))
CREATE INDEX ix_capacity_metric_time ON core.fact_capacity_metric(capacity_key, metric_utc) INCLUDE (cpu_pct, memory_pct, cu_pct, query_load_pct, throttling_sec);
GO

MERGE core.dim_error_category AS target
USING (VALUES
    ('Credentials', 'Authentication', 'High', 'Update credentials, gateway connection, or service principal permissions.'),
    ('Gateway', 'Connectivity', 'High', 'Validate gateway cluster availability, data source mapping, and network routes.'),
    ('Source Timeout', 'Data Source', 'Medium', 'Tune source query, add partitions, or increase command timeout where appropriate.'),
    ('Model Memory', 'Capacity', 'High', 'Reduce model size, tune refresh partitions, or move to a larger capacity.'),
    ('Capacity Throttling', 'Capacity', 'High', 'Review peak windows, scale capacity, or reschedule background workloads.'),
    ('Mashup', 'Power Query', 'Medium', 'Inspect Power Query steps, gateway mashup engine logs, and schema drift.'),
    ('Unknown', 'Unclassified', 'Medium', 'Review serviceExceptionJson and assign a durable category.')
) AS source(error_category, error_family, severity, recommended_action)
ON target.error_category = source.error_category
WHEN NOT MATCHED THEN
    INSERT (error_category, error_family, severity, recommended_action)
    VALUES (source.error_category, source.error_family, source.severity, source.recommended_action);
GO

CREATE OR ALTER VIEW mart.vw_report_adoption
AS
WITH view_events AS (
    SELECT
        report_key,
        MAX(event_utc) AS last_viewed_utc,
        COUNT_BIG(*) AS view_event_count_all_time,
        COUNT_BIG(CASE WHEN event_utc >= DATEADD(day, -30, SYSUTCDATETIME()) THEN 1 END) AS view_event_count_30d,
        COUNT_BIG(CASE WHEN event_utc >= DATEADD(day, -7, SYSUTCDATETIME()) THEN 1 END) AS view_event_count_7d,
        COUNT(DISTINCT CASE WHEN event_utc >= DATEADD(day, -30, SYSUTCDATETIME()) THEN user_key END) AS unique_viewer_count_30d,
        COUNT(DISTINCT CASE WHEN event_utc >= DATEADD(day, -7, SYSUTCDATETIME()) THEN user_key END) AS unique_viewer_count_7d
    FROM core.fact_usage_event
    WHERE is_view_event = 1
      AND report_key IS NOT NULL
    GROUP BY report_key
)
SELECT
    r.report_key,
    r.report_id,
    r.report_name,
    r.report_type,
    r.owner_upn,
    r.workspace_key,
    w.workspace_name,
    r.dataset_key,
    d.dataset_name,
    v.last_viewed_utc,
    DATEDIFF(day, v.last_viewed_utc, SYSUTCDATETIME()) AS days_since_last_view,
    COALESCE(v.view_event_count_all_time, 0) AS view_event_count_all_time,
    COALESCE(v.view_event_count_30d, 0) AS view_event_count_30d,
    COALESCE(v.view_event_count_7d, 0) AS view_event_count_7d,
    COALESCE(v.unique_viewer_count_30d, 0) AS unique_viewer_count_30d,
    COALESCE(v.unique_viewer_count_7d, 0) AS unique_viewer_count_7d,
    CASE
        WHEN r.is_deleted = 1 THEN 'Deleted'
        WHEN v.last_viewed_utc IS NULL THEN 'Never Viewed'
        WHEN DATEDIFF(day, v.last_viewed_utc, SYSUTCDATETIME()) > 90 THEN 'Idle > 90 Days'
        WHEN DATEDIFF(day, v.last_viewed_utc, SYSUTCDATETIME()) > 60 THEN 'Idle > 60 Days'
        WHEN DATEDIFF(day, v.last_viewed_utc, SYSUTCDATETIME()) > 30 THEN 'Idle > 30 Days'
        ELSE 'Active'
    END AS adoption_status
FROM core.dim_report r
JOIN core.dim_workspace w ON w.workspace_key = r.workspace_key
LEFT JOIN core.dim_dataset d ON d.dataset_key = r.dataset_key
LEFT JOIN view_events v ON v.report_key = r.report_key
WHERE r.is_deleted = 0;
GO

CREATE OR ALTER VIEW mart.vw_refresh_health
AS
SELECT
    f.refresh_key,
    f.request_id,
    f.start_utc,
    f.end_utc,
    f.start_date_key,
    f.refresh_type,
    f.refresh_status,
    f.duration_sec,
    CAST(f.duration_sec / 60.0 AS decimal(18,2)) AS duration_minutes,
    f.refresh_attempt_count,
    f.retry_count,
    f.sla_target_minutes,
    f.sla_met,
    f.error_code,
    ec.error_category,
    ec.error_family,
    ec.severity AS error_severity,
    d.dataset_key,
    d.dataset_id,
    d.dataset_name,
    w.workspace_key,
    w.workspace_id,
    w.workspace_name,
    c.capacity_key,
    c.capacity_name,
    CASE WHEN f.refresh_status = 'Failed' THEN 1 ELSE 0 END AS failed_refresh_flag,
    CASE WHEN f.end_utc IS NULL AND f.start_utc < DATEADD(hour, -4, SYSUTCDATETIME()) THEN 1 ELSE 0 END AS stuck_refresh_flag,
    CASE WHEN f.refresh_status <> 'Completed' AND f.start_utc < DATEADD(day, -1, SYSUTCDATETIME()) THEN 1 ELSE 0 END AS stale_refresh_flag
FROM core.fact_refresh_history f
JOIN core.dim_dataset d ON d.dataset_key = f.dataset_key
JOIN core.dim_workspace w ON w.workspace_key = f.workspace_key
LEFT JOIN core.dim_capacity c ON c.capacity_key = f.capacity_key
LEFT JOIN core.dim_error_category ec ON ec.error_category_key = f.error_category_key;
GO

CREATE OR ALTER VIEW mart.vw_capacity_health
AS
SELECT
    cm.capacity_metric_key,
    cm.capacity_key,
    c.capacity_id,
    c.capacity_name,
    c.sku,
    cm.metric_utc,
    cm.metric_date_key,
    cm.cpu_pct,
    cm.memory_pct,
    cm.cu_pct,
    cm.query_load_pct,
    cm.interactive_cu_sec,
    cm.background_cu_sec,
    cm.concurrency_count,
    cm.refresh_queue_count,
    cm.overload_event_count,
    cm.throttling_sec,
    cm.rejected_operation_count,
    CASE
        WHEN COALESCE(cm.cu_pct, cm.cpu_pct, 0) >= 100 OR COALESCE(cm.throttling_sec, 0) > 0 THEN 'Overloaded'
        WHEN COALESCE(cm.cu_pct, cm.cpu_pct, 0) >= 85 THEN 'Watch'
        ELSE 'Healthy'
    END AS capacity_status
FROM core.fact_capacity_metric cm
JOIN core.dim_capacity c ON c.capacity_key = cm.capacity_key;
GO

CREATE OR ALTER VIEW governance.vw_workspace_health_score
AS
WITH usage_30d AS (
    SELECT
        workspace_key,
        COUNT(DISTINCT user_key) AS active_user_30d_count,
        COUNT_BIG(CASE WHEN is_view_event = 1 THEN 1 END) AS report_view_30d_count,
        MAX(event_utc) AS last_activity_utc
    FROM core.fact_usage_event
    WHERE event_utc >= DATEADD(day, -30, SYSUTCDATETIME())
      AND workspace_key IS NOT NULL
    GROUP BY workspace_key
),
refresh_7d AS (
    SELECT
        workspace_key,
        COUNT_BIG(*) AS total_refresh_7d_count,
        COUNT_BIG(CASE WHEN refresh_status = 'Failed' THEN 1 END) AS failed_refresh_7d_count
    FROM core.fact_refresh_history
    WHERE start_utc >= DATEADD(day, -7, SYSUTCDATETIME())
    GROUP BY workspace_key
),
owners AS (
    SELECT
        bur.workspace_key,
        COUNT_BIG(*) AS owner_count,
        COUNT_BIG(CASE WHEN u.account_enabled = 0 THEN 1 END) AS inactive_owner_count
    FROM core.bridge_workspace_user_role bur
    LEFT JOIN core.dim_user u
        ON u.user_key = bur.user_key
       AND u.is_current = 1
    WHERE bur.is_current = 1
      AND (bur.access_right = 'Admin' OR bur.is_owner_candidate = 1)
    GROUP BY bur.workspace_key
),
reports AS (
    SELECT
        r.workspace_key,
        COUNT_BIG(*) AS report_count,
        COUNT_BIG(CASE
            WHEN a.last_viewed_utc IS NULL THEN 1
            WHEN DATEDIFF(day, a.last_viewed_utc, SYSUTCDATETIME()) > 60 THEN 1
        END) AS idle_report_count
    FROM core.dim_report r
    LEFT JOIN mart.vw_report_adoption a ON a.report_key = r.report_key
    WHERE r.is_deleted = 0
    GROUP BY r.workspace_key
),
datasets AS (
    SELECT workspace_key, COUNT_BIG(*) AS dataset_count
    FROM core.dim_dataset
    WHERE is_deleted = 0
    GROUP BY workspace_key
),
scores AS (
    SELECT
        w.workspace_key,
        w.workspace_id,
        w.workspace_name,
        COALESCE(u.active_user_30d_count, 0) AS active_user_30d_count,
        COALESCE(u.report_view_30d_count, 0) AS report_view_30d_count,
        COALESCE(rf.failed_refresh_7d_count, 0) AS failed_refresh_7d_count,
        COALESCE(rf.total_refresh_7d_count, 0) AS total_refresh_7d_count,
        COALESCE(rep.idle_report_count, 0) AS idle_report_count,
        COALESCE(rep.report_count, 0) AS report_count,
        COALESCE(ds.dataset_count, 0) AS dataset_count,
        COALESCE(o.owner_count, 0) AS owner_count,
        COALESCE(o.inactive_owner_count, 0) AS inactive_owner_count,
        DATEDIFF(day, u.last_activity_utc, SYSUTCDATETIME()) AS days_since_last_activity,
        CASE
            WHEN COALESCE(u.active_user_30d_count, 0) >= 50 THEN CAST(100 AS decimal(9,4))
            WHEN COALESCE(u.active_user_30d_count, 0) >= 20 THEN CAST(85 AS decimal(9,4))
            WHEN COALESCE(u.active_user_30d_count, 0) >= 5 THEN CAST(70 AS decimal(9,4))
            WHEN COALESCE(u.active_user_30d_count, 0) >= 1 THEN CAST(45 AS decimal(9,4))
            ELSE CAST(0 AS decimal(9,4))
        END AS usage_score,
        CASE
            WHEN COALESCE(rf.total_refresh_7d_count, 0) = 0 THEN CAST(75 AS decimal(9,4))
            ELSE CAST(100.0 - (100.0 * COALESCE(rf.failed_refresh_7d_count, 0) / NULLIF(rf.total_refresh_7d_count, 0)) AS decimal(9,4))
        END AS refresh_health_score,
        CASE
            WHEN COALESCE(o.owner_count, 0) >= 2 AND COALESCE(o.inactive_owner_count, 0) = 0 THEN CAST(100 AS decimal(9,4))
            WHEN COALESCE(o.owner_count, 0) = 1 AND COALESCE(o.inactive_owner_count, 0) = 0 THEN CAST(70 AS decimal(9,4))
            WHEN COALESCE(o.owner_count, 0) > 0 THEN CAST(45 AS decimal(9,4))
            ELSE CAST(0 AS decimal(9,4))
        END AS ownership_score,
        CASE
            WHEN u.last_activity_utc IS NULL THEN CAST(0 AS decimal(9,4))
            WHEN DATEDIFF(day, u.last_activity_utc, SYSUTCDATETIME()) <= 7 THEN CAST(100 AS decimal(9,4))
            WHEN DATEDIFF(day, u.last_activity_utc, SYSUTCDATETIME()) <= 30 THEN CAST(80 AS decimal(9,4))
            WHEN DATEDIFF(day, u.last_activity_utc, SYSUTCDATETIME()) <= 60 THEN CAST(55 AS decimal(9,4))
            ELSE CAST(20 AS decimal(9,4))
        END AS activity_score,
        CASE
            WHEN COALESCE(o.owner_count, 0) = 0 OR COALESCE(o.inactive_owner_count, 0) >= COALESCE(o.owner_count, 0) THEN CAST(0 AS decimal(9,4))
            WHEN COALESCE(o.inactive_owner_count, 0) > 0 THEN CAST(60 AS decimal(9,4))
            ELSE CAST(100 AS decimal(9,4))
        END AS orphan_risk_score,
        CASE
            WHEN COALESCE(rep.report_count, 0) = 0 THEN CAST(75 AS decimal(9,4))
            ELSE CAST(100.0 - (100.0 * COALESCE(rep.idle_report_count, 0) / NULLIF(rep.report_count, 0)) AS decimal(9,4))
        END AS stale_content_score
    FROM core.dim_workspace w
    LEFT JOIN usage_30d u ON u.workspace_key = w.workspace_key
    LEFT JOIN refresh_7d rf ON rf.workspace_key = w.workspace_key
    LEFT JOIN owners o ON o.workspace_key = w.workspace_key
    LEFT JOIN reports rep ON rep.workspace_key = w.workspace_key
    LEFT JOIN datasets ds ON ds.workspace_key = w.workspace_key
    WHERE w.is_deleted = 0
)
SELECT
    *,
    CAST(ROUND(
        (usage_score * 0.20) +
        (refresh_health_score * 0.25) +
        (ownership_score * 0.15) +
        (activity_score * 0.15) +
        (orphan_risk_score * 0.10) +
        (stale_content_score * 0.15), 2) AS decimal(9,2)) AS workspace_health_score,
    CASE
        WHEN ROUND(
            (usage_score * 0.20) +
            (refresh_health_score * 0.25) +
            (ownership_score * 0.15) +
            (activity_score * 0.15) +
            (orphan_risk_score * 0.10) +
            (stale_content_score * 0.15), 2) >= 80 THEN 'Healthy'
        WHEN ROUND(
            (usage_score * 0.20) +
            (refresh_health_score * 0.25) +
            (ownership_score * 0.15) +
            (activity_score * 0.15) +
            (orphan_risk_score * 0.10) +
            (stale_content_score * 0.15), 2) >= 60 THEN 'Review'
        ELSE 'Critical'
    END AS workspace_health_status
FROM scores;
GO

CREATE OR ALTER VIEW governance.vw_recommendation_candidates
AS
SELECT
    CAST(FORMAT(CAST(SYSUTCDATETIME() AS date), 'yyyyMMdd') AS int) AS recommendation_date_key,
    'Report' AS asset_type,
    a.report_key AS asset_key,
    a.workspace_key,
    CASE
        WHEN a.adoption_status = 'Never Viewed' THEN 'Review'
        WHEN a.days_since_last_view > 90 THEN 'Archive'
        WHEN a.days_since_last_view > 60 THEN 'Review'
        WHEN a.view_event_count_30d < 5 THEN 'Optimize'
        ELSE 'Retain'
    END AS recommendation,
    CASE
        WHEN a.adoption_status = 'Never Viewed' OR a.days_since_last_view > 90 THEN 'High'
        WHEN a.days_since_last_view > 60 THEN 'Medium'
        ELSE 'Low'
    END AS risk_level,
    CONCAT(
        a.report_name,
        ' in ',
        a.workspace_name,
        ' has adoption status ',
        a.adoption_status,
        '.'
    ) AS reason,
    a.owner_upn
FROM mart.vw_report_adoption a
WHERE a.adoption_status IN ('Never Viewed', 'Idle > 90 Days', 'Idle > 60 Days', 'Idle > 30 Days')
UNION ALL
SELECT
    CAST(FORMAT(CAST(SYSUTCDATETIME() AS date), 'yyyyMMdd') AS int),
    'Workspace',
    h.workspace_key,
    h.workspace_key,
    CASE WHEN h.workspace_health_status = 'Critical' THEN 'Review' ELSE 'Optimize' END,
    CASE WHEN h.workspace_health_status = 'Critical' THEN 'High' ELSE 'Medium' END,
    CONCAT(h.workspace_name, ' has health score ', h.workspace_health_score, ' and requires governance review.'),
    NULL
FROM governance.vw_workspace_health_score h
WHERE h.workspace_health_status IN ('Critical', 'Review');
GO

CREATE OR ALTER VIEW mart.vw_executive_kpi_daily
AS
WITH today_usage AS (
    SELECT
        CAST(event_utc AS date) AS metric_date,
        COUNT(DISTINCT CASE WHEN is_view_event = 1 THEN user_key END) AS daily_active_users,
        COUNT_BIG(CASE WHEN is_view_event = 1 THEN 1 END) AS report_views
    FROM core.fact_usage_event
    GROUP BY CAST(event_utc AS date)
),
today_refresh AS (
    SELECT
        CAST(start_utc AS date) AS metric_date,
        COUNT_BIG(*) AS refresh_count,
        COUNT_BIG(CASE WHEN refresh_status = 'Failed' THEN 1 END) AS failed_refresh_count
    FROM core.fact_refresh_history
    GROUP BY CAST(start_utc AS date)
),
today_capacity AS (
    SELECT
        CAST(metric_utc AS date) AS metric_date,
        AVG(COALESCE(cu_pct, cpu_pct)) AS avg_capacity_utilization_pct,
        MAX(COALESCE(cu_pct, cpu_pct)) AS peak_capacity_utilization_pct,
        SUM(COALESCE(overload_event_count, 0)) AS overload_event_count,
        SUM(COALESCE(throttling_sec, 0)) AS throttling_sec
    FROM core.fact_capacity_metric
    GROUP BY CAST(metric_utc AS date)
),
idle AS (
    SELECT
        CAST(SYSUTCDATETIME() AS date) AS metric_date,
        COUNT_BIG(CASE WHEN days_since_last_view > 60 OR adoption_status = 'Never Viewed' THEN 1 END) AS idle_report_60d_count
    FROM mart.vw_report_adoption
)
SELECT
    COALESCE(u.metric_date, r.metric_date, c.metric_date, i.metric_date) AS metric_date,
    COALESCE(u.daily_active_users, 0) AS daily_active_users,
    COALESCE(u.report_views, 0) AS report_views,
    COALESCE(r.refresh_count, 0) AS refresh_count,
    COALESCE(r.failed_refresh_count, 0) AS failed_refresh_count,
    CAST(100.0 * COALESCE(r.failed_refresh_count, 0) / NULLIF(r.refresh_count, 0) AS decimal(9,2)) AS failed_refresh_pct,
    COALESCE(i.idle_report_60d_count, 0) AS idle_report_60d_count,
    CAST(c.avg_capacity_utilization_pct AS decimal(9,2)) AS avg_capacity_utilization_pct,
    CAST(c.peak_capacity_utilization_pct AS decimal(9,2)) AS peak_capacity_utilization_pct,
    COALESCE(c.overload_event_count, 0) AS overload_event_count,
    COALESCE(c.throttling_sec, 0) AS throttling_sec
FROM today_usage u
FULL JOIN today_refresh r ON r.metric_date = u.metric_date
FULL JOIN today_capacity c ON c.metric_date = COALESCE(u.metric_date, r.metric_date)
FULL JOIN idle i ON i.metric_date = COALESCE(u.metric_date, r.metric_date, c.metric_date);
GO
