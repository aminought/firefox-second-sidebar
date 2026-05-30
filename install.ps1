$ErrorActionPreference = "Stop"

$FX_AUTOCONFIG_URL = "https://github.com/MrOtherGuy/fx-autoconfig/archive/refs/heads/master.zip"
$SECOND_SIDEBAR_URL = "https://github.com/aminought/firefox-second-sidebar/archive/refs/heads/master.zip"
$TEMP_DIR = Join-Path $env:TEMP "second-sidebar-install"

if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
  $scriptPath = $MyInvocation.MyCommand.Path
  Start-Process powershell -Verb RunAs -ArgumentList "-ExecutionPolicy Bypass -File `"$scriptPath`""
  exit 0
}

function Find-FirefoxInstallDir {
  $candidates = @(
    "C:\Program Files\Mozilla Firefox",
    "C:\Program Files (x86)\Mozilla Firefox",
    "${env:ProgramFiles}\Mozilla Firefox",
    "${env:ProgramFiles(x86)}\Mozilla Firefox"
  )
  foreach ($dir in $candidates) {
    if (Test-Path "$dir\firefox.exe") { return $dir }
  }
  return $null
}

function Find-FirefoxProfiles {
  $profilesDir = "${env:APPDATA}\Mozilla\Firefox\Profiles"
  if (-not (Test-Path $profilesDir)) { return @() }
  return @(Get-ChildItem $profilesDir -Directory | Where-Object {
    Test-Path "$($_.FullName)\prefs.js"
  })
}

function Get-ProfileType {
  param([string]$Name)
  if ($Name -match "default-release") { return "(Release)" }
  if ($Name -match "dev-edition-default") { return "(Developer Edition)" }
  if ($Name -match "nightly") { return "(Nightly)" }
  if ($Name -match "default$") { return "(Default)" }
  return ""
}

function Select-Profile {
  param([array]$Profiles)
  if ($Profiles.Count -eq 0) {
    Write-Host "[ERROR] No Firefox profile found." -ForegroundColor Red
    Write-Host "Please start Firefox at least once." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
  }
  if ($Profiles.Count -eq 1) { return $Profiles[0] }
  Write-Host "Multiple profiles detected:" -ForegroundColor Cyan
  for ($i = 0; $i -lt $Profiles.Count; $i++) {
    $t = Get-ProfileType $Profiles[$i].Name
    Write-Host "  [$i] $($Profiles[$i].Name) $t"
  }
  $choice = Read-Host "Select profile number (default 0)"
  if ([string]::IsNullOrWhiteSpace($choice)) { $choice = "0" }
  $idx = [int]$choice
  if ($idx -lt 0 -or $idx -ge $Profiles.Count) {
    Write-Host "[ERROR] Invalid selection." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
  }
  return $Profiles[$idx]
}

function Download-Zip {
  param([string]$Url, [string]$OutFile)
  Write-Host "  Downloading $Url ..." -ForegroundColor DarkGray
  try {
    Invoke-WebRequest -Uri $Url -OutFile $OutFile -UseBasicParsing
  } catch {
    Write-Host "[ERROR] Download failed: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
  }
}

function Extract-Zip {
  param([string]$ZipFile, [string]$OutDir)
  Write-Host "  Extracting..." -ForegroundColor DarkGray
  Expand-Archive -Path $ZipFile -DestinationPath $OutDir -Force
}

function Copy-FileSafe {
  param([string]$Source, [string]$Dest)
  $destDir = Split-Path -Parent $Dest
  if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
  }
  Copy-Item -Path $Source -Destination $Dest -Force
}

function Copy-DirContents {
  param([string]$SourceDir, [string]$DestDir)
  if (-not (Test-Path $DestDir)) {
    New-Item -ItemType Directory -Path $DestDir -Force | Out-Null
  }
  Get-ChildItem -Path $SourceDir -Recurse | ForEach-Object {
    $rel = $_.FullName.Substring($SourceDir.Length + 1)
    $dest = Join-Path $DestDir $rel
    if ($_.PSIsContainer) {
      if (-not (Test-Path $dest)) {
        New-Item -ItemType Directory -Path $dest -Force | Out-Null
      }
    } else {
      $d = Split-Path -Parent $dest
      if (-not (Test-Path $d)) {
        New-Item -ItemType Directory -Path $d -Force | Out-Null
      }
      Copy-Item -Path $_.FullName -Destination $dest -Force
    }
  }
}

function Test-FileExists {
  param([string]$Path, [string]$Label)
  if (Test-Path $Path) {
    Write-Host "  [OK] $Label" -ForegroundColor Green
    return $true
  } else {
    Write-Host "  [FAIL] $Label" -ForegroundColor Red
    return $false
  }
}

# ============================================================
# Install
# ============================================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Second Sidebar Installer (Windows)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# --- Step 1: Detect Firefox ---
Write-Host "[1/5] Detecting Firefox..." -ForegroundColor Yellow
$firefoxDir = Find-FirefoxInstallDir
if (-not $firefoxDir) {
  Write-Host "Firefox not found automatically." -ForegroundColor Yellow
  $firefoxDir = Read-Host "Enter Firefox install path (e.g. C:\Program Files\Mozilla Firefox)"
  if (-not (Test-Path "$firefoxDir\firefox.exe")) {
    Write-Host "[ERROR] firefox.exe not found at: $firefoxDir" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
  }
}
Write-Host "  Firefox: $firefoxDir" -ForegroundColor Green

$profiles = Find-FirefoxProfiles
$selected = Select-Profile $profiles
$profilePath = $selected.FullName
$t = Get-ProfileType $selected.Name
Write-Host "  Profile: $profilePath $t" -ForegroundColor Green

# --- Step 2: Download ---
Write-Host ""
Write-Host "[2/5] Downloading from GitHub..." -ForegroundColor Yellow

if (Test-Path $TEMP_DIR) { Remove-Item -Path $TEMP_DIR -Recurse -Force }
New-Item -ItemType Directory -Path $TEMP_DIR -Force | Out-Null

$fxZip = Join-Path $TEMP_DIR "fx-autoconfig.zip"
$ssZip = Join-Path $TEMP_DIR "second-sidebar.zip"

Download-Zip $FX_AUTOCONFIG_URL $fxZip
Download-Zip $SECOND_SIDEBAR_URL $ssZip

Extract-Zip $fxZip $TEMP_DIR
Extract-Zip $ssZip $TEMP_DIR

$fxDir = Get-ChildItem "$TEMP_DIR\fx-autoconfig-*" -Directory | Select-Object -First 1
$ssDir = Get-ChildItem "$TEMP_DIR\firefox-second-sidebar-*" -Directory | Select-Object -First 1

if (-not $fxDir -or -not $ssDir) {
  Write-Host "[ERROR] Failed to extract downloaded files." -ForegroundColor Red
  Read-Host "Press Enter to exit"
  exit 1
}
Write-Host "  Download complete." -ForegroundColor Green

# --- Step 3: Install fx-autoconfig program files ---
Write-Host ""
Write-Host "[3/5] Installing fx-autoconfig (program files)..." -ForegroundColor Yellow

$programFailed = $false
try {
  Copy-FileSafe "$($fxDir.FullName)\program\config.js" "$firefoxDir\config.js"
  Copy-FileSafe "$($fxDir.FullName)\program\defaults\pref\config-prefs.js" "$firefoxDir\defaults\pref\config-prefs.js"
  Write-Host "  config.js -> OK" -ForegroundColor DarkGray
  Write-Host "  defaults/pref/config-prefs.js -> OK" -ForegroundColor DarkGray
} catch {
  $programFailed = $true
  Write-Host "  [ERROR] Copy failed: $_" -ForegroundColor Red
  Write-Host ""
  Write-Host "  Please manually copy:" -ForegroundColor Yellow
  Write-Host "    $($fxDir.FullName)\program\config.js" -ForegroundColor White
  Write-Host "    -> $firefoxDir\config.js" -ForegroundColor White
  Write-Host ""
  Write-Host "    $($fxDir.FullName)\program\defaults\pref\config-prefs.js" -ForegroundColor White
  Write-Host "    -> $firefoxDir\defaults\pref\config-prefs.js" -ForegroundColor White
  Write-Host ""
  $cont = Read-Host "Copied manually? Continue? (y/n)"
  if ($cont -ne "y") {
    Read-Host "Press Enter to exit"
    exit 1
  }
}

# --- Step 4: Install fx-autoconfig profile + Second Sidebar ---
Write-Host ""
Write-Host "[4/5] Installing fx-autoconfig (profile) + Second Sidebar..." -ForegroundColor Yellow

$chromeDir = Join-Path $profilePath "chrome"
if (-not (Test-Path $chromeDir)) {
  New-Item -ItemType Directory -Path $chromeDir -Force | Out-Null
}

$fxChromeDir = Join-Path $fxDir.FullName "profile\chrome"
Copy-DirContents "$fxChromeDir\utils" "$chromeDir\utils"
Write-Host "  chrome/utils/ -> OK" -ForegroundColor DarkGray

$chromeJS = Join-Path $chromeDir "JS"
if (-not (Test-Path $chromeJS)) {
  New-Item -ItemType Directory -Path $chromeJS -Force | Out-Null
}

Copy-FileSafe "$($ssDir.FullName)\src\second_sidebar.uc.mjs" "$chromeJS\second_sidebar.uc.mjs"
Write-Host "  chrome/JS/second_sidebar.uc.mjs -> OK" -ForegroundColor DarkGray

Copy-DirContents "$($ssDir.FullName)\src\second_sidebar" "$chromeJS\second_sidebar"
Write-Host "  chrome/JS/second_sidebar/ -> OK" -ForegroundColor DarkGray

# --- Step 5: Verify ---
Write-Host ""
Write-Host "[5/5] Verifying installation..." -ForegroundColor Yellow

$allOk = $true

if (-not $programFailed) {
  if (-not (Test-FileExists "$firefoxDir\config.js" "Firefox/config.js")) { $allOk = $false }
  if (-not (Test-FileExists "$firefoxDir\defaults\pref\config-prefs.js" "Firefox/defaults/pref/config-prefs.js")) { $allOk = $false }
}

$checks = @(
  @("$chromeDir\utils\boot.sys.mjs", "chrome/utils/boot.sys.mjs"),
  @("$chromeDir\utils\chrome.manifest", "chrome/utils/chrome.manifest"),
  @("$chromeDir\utils\uc_api.sys.mjs", "chrome/utils/uc_api.sys.mjs"),
  @("$chromeJS\second_sidebar.uc.mjs", "chrome/JS/second_sidebar.uc.mjs"),
  @("$chromeJS\second_sidebar\sidebar_injector.mjs", "chrome/JS/second_sidebar/sidebar_injector.mjs"),
  @("$chromeJS\second_sidebar\i18n\index.mjs", "chrome/JS/second_sidebar/i18n/index.mjs"),
  @("$chromeJS\second_sidebar\i18n\en-US.mjs", "chrome/JS/second_sidebar/i18n/en-US.mjs"),
  @("$chromeJS\second_sidebar\i18n\zh-CN.mjs", "chrome/JS/second_sidebar/i18n/zh-CN.mjs")
)

foreach ($c in $checks) {
  if (-not (Test-FileExists $c[0] $c[1])) { $allOk = $false }
}

# Cleanup
Write-Host ""
Write-Host "Cleaning up temp files..." -ForegroundColor DarkGray
Remove-Item -Path $TEMP_DIR -Recurse -Force -ErrorAction SilentlyContinue

# Result
Write-Host ""
if ($allOk) {
  Write-Host "========================================" -ForegroundColor Green
  Write-Host "  Installation complete!" -ForegroundColor Green
  Write-Host "========================================" -ForegroundColor Green
} else {
  Write-Host "========================================" -ForegroundColor Yellow
  Write-Host "  Installation finished with warnings" -ForegroundColor Yellow
  Write-Host "========================================" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Restart Firefox" -ForegroundColor White
Write-Host "  2. Right-click toolbar -> Customize Toolbar" -ForegroundColor White
Write-Host "  3. Drag 'Second Sidebar' button to toolbar" -ForegroundColor White
Write-Host ""
Write-Host "Troubleshooting:" -ForegroundColor DarkGray
Write-Host "  - Clear startup cache: about:support -> Clear startup cache" -ForegroundColor DarkGray
Write-Host "  - Check about:config: toolkit.legacyUserProfileCustomizations.stylesheets = true" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Uninstall: irm https://raw.githubusercontent.com/aminought/firefox-second-sidebar/master/uninstall.ps1 | iex" -ForegroundColor DarkGray
Read-Host "Press Enter to exit"
