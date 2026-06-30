$ErrorActionPreference = "Stop"

# This dashboard is intentionally locked to one Power BI Premium Per User mailbox.
# Do not remove POWERBI_TARGET_USER unless you intentionally want the server to reject startup data calls.
if (Test-Path ".\.env.local.ps1") {
  . ".\.env.local.ps1"
}

if (-not $env:POWERBI_TENANT_ID) {
  $env:POWERBI_TENANT_ID = Read-Host "Enter Power BI tenant ID"
}

if (-not $env:POWERBI_CLIENT_ID) {
  $env:POWERBI_CLIENT_ID = Read-Host "Enter Power BI client ID"
}

if (-not $env:POWERBI_CLIENT_SECRET) {
  $env:POWERBI_CLIENT_SECRET = Read-Host "Enter Power BI client secret"
}

if (-not $env:POWERBI_TARGET_USER) {
  $env:POWERBI_TARGET_USER = Read-Host "Enter the single Power BI Premium Per User mailbox"
}

$listeners = Get-NetTCPConnection -LocalPort 47844 -State Listen -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -Unique

foreach ($processId in $listeners) {
  if ($processId -and $processId -ne $PID) {
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
  }
}

node .\prototype\server.mjs 47844
