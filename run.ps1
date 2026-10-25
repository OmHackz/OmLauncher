# ============================================================================
# OmLauncher — Run (assumes setup.ps1 has already been run)
# ============================================================================
$ErrorActionPreference = 'Stop'
if (-not (Get-Command cargo -ErrorAction SilentlyContinue)) {
    Write-Host "Rust (cargo) not found. Please run .\setup.ps1 first." -ForegroundColor Red
    exit 1
}
Write-Host "Launching OmLauncher..." -ForegroundColor Cyan
npm run tauri dev
