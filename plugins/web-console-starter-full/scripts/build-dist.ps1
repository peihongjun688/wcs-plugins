<# ============================================================
   web-console-starter - build-dist.ps1 (release zip)
   ------------------------------------------------------------
   1. Runs scan-secrets.ps1 - FAIL aborts (privacy gate)
   2. Rebuilds frontend into backend/public (fresh bundle)
   3. Stages a clean copy (excludes node_modules/.git/db/logs/
      backend/public/.env ...) and zips it as
      dist/web-console-starter-v<version>.zip

   Usage:
     powershell -ExecutionPolicy Bypass -File build-dist.ps1
   ============================================================ #>
$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

Write-Host "[dist] 1/4 privacy scan..."
& (Join-Path $PSScriptRoot 'scan-secrets.ps1') -Path $root
if ($LASTEXITCODE -ne 0) { Write-Host "[dist] ABORT: scan-secrets failed" -ForegroundColor Red; exit 1 }

Write-Host "[dist] 2/4 building frontend..."
Push-Location (Join-Path $root 'frontend')
npm run build
if ($LASTEXITCODE -ne 0) { Pop-Location; Write-Host "[dist] ABORT: build failed" -ForegroundColor Red; exit 1 }
Pop-Location

# read version
# read version (File.ReadAllText = UTF-8 safe on PS 5.1; Get-Content would garble CJK)
$fePkg = ConvertFrom-Json ([System.IO.File]::ReadAllText((Join-Path $root 'frontend\package.json')))
$ver = $fePkg.version
$outName = "web-console-starter-v$ver"
$distDir = Join-Path $root 'dist'
New-Item -ItemType Directory -Path $distDir -Force | Out-Null

# stage a clean copy
$stageRoot = Join-Path $env:TEMP 'wcs-dist'
$stage = Join-Path $stageRoot $outName
if (Test-Path $stage) { Remove-Item -Recurse -Force $stage }
New-Item -ItemType Directory -Path $stage -Force | Out-Null

Write-Host "[dist] 3/4 staging clean copy..."
$xd = 'node_modules', '.git', 'dist', 'logs', 'data', 'backend\public'
$xf = '*.db', 'backend.log', 'backend.pid', '.env', 'vite.config.js.timestamp-*.mjs'
$args = @($root, $stage, '/E', '/NFL', '/NDL', '/NJH', '/NJS', '/NC', '/NS', '/XD') + $xd + @('/XF') + $xf
& robocopy @args | Out-Null
if ($LASTEXITCODE -gt 7) { Write-Host "[dist] ABORT: robocopy error $LASTEXITCODE" -ForegroundColor Red; exit 1 }

Write-Host "[dist] 4/4 zipping..."
$zip = Join-Path $distDir ($outName + '.zip')
if (Test-Path $zip) { Remove-Item -Force $zip }
Compress-Archive -Path $stage -DestinationPath $zip -CompressionLevel Optimal

# cleanup temp stage
Remove-Item -Recurse -Force $stageRoot -ErrorAction SilentlyContinue

Write-Host "[dist] done: $zip"
# robocopy leaves $LASTEXITCODE=1 on a successful copy; force a clean exit 0
exit 0
