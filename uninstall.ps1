$ErrorActionPreference = "Stop"

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

Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  Second Sidebar Uninstaller (Windows)" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

$firefoxDir = Find-FirefoxInstallDir
$profiles = Find-FirefoxProfiles
$selected = Select-Profile $profiles
$profilePath = $selected.FullName
$t = Get-ProfileType $selected.Name
Write-Host "  Firefox: $firefoxDir" -ForegroundColor Cyan
Write-Host "  Profile: $profilePath $t" -ForegroundColor Cyan

$chromeJS = Join-Path $profilePath "chrome\JS"
$ucFile = Join-Path $chromeJS "second_sidebar.uc.mjs"
$sidebarDir = Join-Path $chromeJS "second_sidebar"

$hasScript = Test-Path $ucFile
$hasFxAutoconfigProgram = $false
$hasFxAutoconfigProfile = $false

if ($firefoxDir) {
  $hasFxAutoconfigProgram = Test-Path "$firefoxDir\config.js"
}
$hasFxAutoconfigProfile = Test-Path (Join-Path $profilePath "chrome\utils\boot.sys.mjs")

if (-not $hasScript -and -not $hasFxAutoconfigProgram -and -not $hasFxAutoconfigProfile) {
  Write-Host ""
  Write-Host "Nothing to uninstall." -ForegroundColor Yellow
  Read-Host "Press Enter to exit"
  exit 0
}

Write-Host ""
Write-Host "Found:" -ForegroundColor Cyan
if ($hasScript) { Write-Host "  - Second Sidebar script" -ForegroundColor White }
if ($hasFxAutoconfigProfile) { Write-Host "  - fx-autoconfig profile files" -ForegroundColor White }
if ($hasFxAutoconfigProgram) { Write-Host "  - fx-autoconfig program files" -ForegroundColor White }

Write-Host ""
$removeScript = $false
$removeFxProfile = $false
$removeFxProgram = $false

if ($hasScript) {
  $a = Read-Host "Remove Second Sidebar script? (y/n)"
  if ($a -eq "y") { $removeScript = $true }
}
if ($hasFxAutoconfigProfile) {
  $a = Read-Host "Remove fx-autoconfig profile files? (y/n)"
  if ($a -eq "y") { $removeFxProfile = $true }
}
if ($hasFxAutoconfigProgram) {
  $a = Read-Host "Remove fx-autoconfig program files (config.js)? (y/n)"
  if ($a -eq "y") { $removeFxProgram = $true }
}

if (-not $removeScript -and -not $removeFxProfile -and -not $removeFxProgram) {
  Write-Host ""
  Write-Host "Cancelled." -ForegroundColor Yellow
  Read-Host "Press Enter to exit"
  exit 0
}

Write-Host ""
Write-Host "Removing..." -ForegroundColor Yellow

if ($removeScript) {
  if (Test-Path $sidebarDir) { Remove-Item -Path $sidebarDir -Recurse -Force }
  if (Test-Path $ucFile) { Remove-Item -Path $ucFile -Force }
  Write-Host "  Removed: chrome/JS/second_sidebar/" -ForegroundColor DarkGray
  Write-Host "  Removed: chrome/JS/second_sidebar.uc.mjs" -ForegroundColor DarkGray
}

if ($removeFxProfile) {
  $utilsDir = Join-Path $profilePath "chrome\utils"
  if (Test-Path $utilsDir) { Remove-Item -Path $utilsDir -Recurse -Force }
  Write-Host "  Removed: chrome/utils/" -ForegroundColor DarkGray
  $chromeDir = Join-Path $profilePath "chrome"
  if (Test-Path $chromeDir) {
    $remaining = Get-ChildItem $chromeDir -Force
    if ($remaining.Count -eq 0) {
      Remove-Item -Path $chromeDir -Force
      Write-Host "  Removed: chrome/ (empty)" -ForegroundColor DarkGray
    }
  }
}

if ($removeFxProgram) {
  try {
    $cfgJs = Join-Path $firefoxDir "config.js"
    $cfgPrefs = Join-Path $firefoxDir "defaults\pref\config-prefs.js"
    if (Test-Path $cfgJs) { Remove-Item -Path $cfgJs -Force }
    if (Test-Path $cfgPrefs) { Remove-Item -Path $cfgPrefs -Force }
    Write-Host "  Removed: Firefox/config.js" -ForegroundColor DarkGray
    Write-Host "  Removed: Firefox/defaults/pref/config-prefs.js" -ForegroundColor DarkGray
  } catch {
    Write-Host "  [ERROR] Failed to remove program files: $_" -ForegroundColor Red
    Write-Host "  Please manually delete:" -ForegroundColor Yellow
    Write-Host "    $firefoxDir\config.js" -ForegroundColor White
    Write-Host "    $firefoxDir\defaults\pref\config-prefs.js" -ForegroundColor White
  }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Uninstall complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Read-Host "Press Enter to exit"
