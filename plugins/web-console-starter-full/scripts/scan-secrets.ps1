<# ============================================================
   web-console-starter - scan-secrets.ps1 (privacy gate)
   ------------------------------------------------------------
   Scans a target tree for internal/private keywords. Any hit
   (outside the demo-allowlist) fails the scan with exit code 1.
   build-dist.ps1 refuses to package unless this passes.

   Usage:
     powershell -ExecutionPolicy Bypass -File scan-secrets.ps1
       # scans the template root
     powershell -ExecutionPolicy Bypass -File scan-secrets.ps1 -Path D:\x\my-app -Extra @("prod-server","my-ip")
       # extra keywords to also flag
   ============================================================ #>
param(
  [string]$Path = (Split-Path $PSScriptRoot -Parent),
  [string[]]$Extra = @(),
  [switch]$Quiet
)

$ErrorActionPreference = "Stop"

# internal keywords that must never appear in a distributable package
# (case-insensitive regex). Extend as needed.
$patterns = @(
  'epdm', 'acestep', 'solidworks',
  '10\.168\.', '192\.168\.',
  '20-workbuddy-qy', 'obsidian',
  'Administrator\\', '\\Administrator'
)

if ($Extra.Count -gt 0) { $patterns += $Extra }

# demo-only allowlist file (contains the documented default demo account
# admin/admin123 in .env.example so the starter is runnable out of the box).
# NOTE: .env (the real one) is never shipped; build-dist excludes it.
$allowFile = 'backend\.env\.example$'

# directories / file extensions never scanned
$skipDirs = @('node_modules', '.git', 'dist', 'logs', 'data', 'coverage', '.workbuddy')
$skipExt  = @('.db', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.map', '.lock', '.zip', '.woff', '.woff2', '.ttf')

function Test-TextFile($file) {
  try {
    $bytes = [System.IO.File]::ReadAllBytes($file)
    $len = [Math]::Min(8000, $bytes.Length)
    for ($i = 0; $i -lt $len; $i++) { if ($bytes[$i] -eq 0) { return $false } }
    return $true
  } catch { return $false }
}

$root = (Resolve-Path $Path).Path
$hits = @()
$files = Get-ChildItem -Path $root -Recurse -File -ErrorAction SilentlyContinue

foreach ($f in $files) {
  $rel = $f.FullName.Substring($root.Length).TrimStart('\', '/')
  $parts = $rel -split '[\\/]'
  $skip = $false
  foreach ($d in $skipDirs) { if ($parts -contains $d) { $skip = $true; break } }
  if ($skip) { continue }
  if ($f.Name -match ($skipExt -join '|')) { continue }

  # the gate script itself declares these keywords as scan data (by design);
  # skip it by filename wherever it lives (source tree or staged copy)
  if ($f.Name -eq 'scan-secrets.ps1') { continue }

  # vite build artifacts (temporary config-loader files) may embed absolute
  # dev-machine paths such as the repo location; never scanned, never shipped
  if ($f.Name -match '^vite\.config\.js\.timestamp-.*\.mjs$') { continue }

  # demo-allowlist file
  if ($rel -match $allowFile) { continue }

  if (-not (Test-TextFile $f.FullName)) { continue }

  $lineNo = 0
  foreach ($line in [System.IO.File]::ReadLines($f.FullName)) {
    $lineNo++
    foreach ($p in $patterns) {
      if ($line -match $p) {
        $snip = $line.Trim()
        if ($snip.Length -gt 120) { $snip = $snip.Substring(0, 120) + '...' }
        $hits += [pscustomobject]@{ File = $rel; Line = $lineNo; Pattern = $p; Snippet = $snip }
        break # one hit per line is enough
      }
    }
  }
}

if ($hits.Count -eq 0) {
  if (-not $Quiet) { Write-Host "[scan] OK - 0 hits in $root" -ForegroundColor Green }
  exit 0
}

Write-Host "[scan] FAIL - $($hits.Count) hit(s) found:" -ForegroundColor Red
$hits | ForEach-Object {
  Write-Host ("  {0}:{1}  [{2}]  {3}" -f $_.File, $_.Line, $_.Pattern, $_.Snippet)
}
Write-Host "[scan] remove/desensitize these before packaging (see docs/design-spec or scan-secrets header)."
exit 1
