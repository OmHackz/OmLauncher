# ============================================================================
# OmLauncher — Local Dev Helper (optional)
# GitHub Actions is the primary build path: push to `main` and .github/workflows/build.yml
# compiles the app for Windows + Linux automatically.
#
# Use this script only if you want to run the Tauri dev server locally.
# Requires: Node.js + Rust (MSVC toolchain) + MSVC linker (link.exe).
# ============================================================================
$ErrorActionPreference = 'Stop'
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "  OmLauncher Local Dev Helper" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "NOTE: Prefer GitHub Actions for builds. This script is for local iteration only." -ForegroundColor Yellow

# --------------------------------------------------------------------------
# 1. Check/install Rust toolchain
# --------------------------------------------------------------------------
if (-not (Get-Command cargo -ErrorAction SilentlyContinue)) {
    Write-Host "`n[1/3] Rust not found. Installing via winget..." -ForegroundColor Yellow
    winget install --id Rustlang.Rust.3 --silent --accept-package-agreements --accept-source-agreements
    Write-Host "`nIMPORTANT: RESTART your terminal so 'cargo' is on PATH, then re-run this script." -ForegroundColor Red
    exit
} else {
    Write-Host "[1/3] Rust toolchain found: $(cargo --version)" -ForegroundColor Green
}

# Check for MSVC linker (required by Tauri/Rust on Windows)
$linkPaths = @(
    "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Tools\MSVC\*\bin\Hostx64\x64\link.exe",
    "C:\Program Files\Microsoft Visual Studio\2022\BuildTools\VC\Tools\MSVC\*\bin\Hostx64\x64\link.exe"
)
$linkFound = $false
foreach ($p in $linkPaths) {
    if (Get-ChildItem $p -ErrorAction SilentlyContinue) { $linkFound = $true; break }
}
if (-not $linkFound) {
    Write-Host "`n[!] MSVC linker (link.exe) not found. Install Visual Studio Build Tools:" -ForegroundColor Red
    Write-Host "    winget install Microsoft.VisualStudio.2022.BuildTools" -ForegroundColor Red
    Write-Host "    Then add the VC\Tools\MSVC\*\bin\Hostx64\x64 folder to PATH." -ForegroundColor Red
    exit
}

# --------------------------------------------------------------------------
# 2. Install npm dependencies
# --------------------------------------------------------------------------
Write-Host "`n[2/3] Installing npm dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "npm install failed." -ForegroundColor Red
    exit 1
}
Write-Host "npm dependencies installed." -ForegroundColor Green

# --------------------------------------------------------------------------
# 3. Launch the Tauri dev app
# --------------------------------------------------------------------------
Write-Host "`n[3/3] Launching OmLauncher..." -ForegroundColor Yellow
Write-Host "Login with your Ely.by account (or click 'Enter launcher' for offline mode)." -ForegroundColor Cyan
npm run tauri dev
