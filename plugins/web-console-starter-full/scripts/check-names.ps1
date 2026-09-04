<# ============================================================
   web-console-starter - check-names.ps1 (name consistency gate)
   ------------------------------------------------------------
   Verifies the product-name fields are in sync after init-app:
     * app.config.js   -> name / title / subtitle / logoText / skin
     * frontend pkg    -> package.json name
     * backend pkg     -> package.json name
     * index.html      -> <title>
     * skin            -> themes/<skin>.css exists
   In an un-initialized template root the frontend/backend names
   still equal "web-console-starter(-backend)" which is treated as
   the expected template identity (OK). After init they must equal
   the new product name.

   Usage:
     powershell -ExecutionPolicy Bypass -File check-names.ps1
   Exit code 1 when a DIFF is found.
   ============================================================ #>
param(
  [string]$Path = (Split-Path $PSScriptRoot -Parent),
  [switch]$Quiet
)

$ErrorActionPreference = "Stop"
$root = (Resolve-Path $Path).Path
$templateId = 'web-console-starter'

function Get-JsStr($file, $key) {
  # File.ReadAllText defaults to UTF-8 (with BOM detection) - safe on PS 5.1
  # whose Get-Content would decode BOM-less UTF-8 as ANSI/GBK and garble CJK.
  if (-not (Test-Path $file)) { return '' }
  try { $content = [System.IO.File]::ReadAllText($file) } catch { return '' }
  if ([string]::IsNullOrEmpty($content)) { return '' }
  $m = [regex]::Match($content, "(?m)^\s*$key\s*:\s*['""]([^'""]*)['""]")
  if ($m.Success) { return $m.Groups[1].Value }
  return ''
}

$cfgFile = Join-Path $root 'app.config.js'
$fePkg   = Join-Path $root 'frontend\package.json'
$bePkg   = Join-Path $root 'backend\package.json'
$html    = Join-Path $root 'frontend\index.html'

if (-not (Test-Path $cfgFile)) { Write-Host '[names] app.config.js not found!' -ForegroundColor Red; exit 1 }

$cfgName = Get-JsStr $cfgFile 'name'
$cfgTitle = Get-JsStr $cfgFile 'title'
$cfgLogo = Get-JsStr $cfgFile 'logoText'
$cfgSkin = Get-JsStr $cfgFile 'skin'

$feName = ''; if (Test-Path $fePkg) { $feName = (ConvertFrom-Json ([System.IO.File]::ReadAllText($fePkg))).name }
$beName = ''; if (Test-Path $bePkg) { $beName = (ConvertFrom-Json ([System.IO.File]::ReadAllText($bePkg))).name }

$htmlTitle = ''
if (Test-Path $html) {
  $m = [regex]::Match([System.IO.File]::ReadAllText($html), '<title>([^<]*)</title>')
  if ($m.Success) { $htmlTitle = $m.Groups[1].Value }
}

$skinFile = Join-Path $root "frontend\src\themes\$cfgSkin.css"
$skinOk = Test-Path $skinFile

function Row($site, $expect, $actual, $ok) {
  $mark = if ($ok) { 'OK  ' } else { 'DIFF' }
  if (-not $Quiet) { Write-Host ("  [{0}] {1,-22} expect='{2}' actual='{3}'" -f $mark, $site, $expect, $actual) }
  return $ok
}

$rows = @()
# identity names: equal, OR both are the template defaults (pre-init root)
$idOk = ($feName -eq $beName) -or ($feName -eq $templateId -and $beName -eq ($templateId + '-backend'))
$rows += , (Row 'backend/pkg name' $feName $beName $idOk)
# cfg.name must equal frontend pkg name (template root keeps its own identity)
$rows += , (Row 'cfg.name vs frontend/pkg' $feName $cfgName ($feName -eq $cfgName -or ($feName -eq $templateId -and $cfgName -eq 'MyConsole')))
# title: index.html must match cfg.title (or keep placeholder marker in template)
$titleOk = ($htmlTitle -eq $cfgTitle -or ($htmlTitle -eq 'web-console-starter' -and $cfgTitle -eq 'MyConsole'))
$rows += , (Row 'index.html title' $cfgTitle $htmlTitle $titleOk)
# logo
$rows += , (Row 'logoText' 'non-empty' $cfgLogo ($cfgLogo -ne ''))
# skin
$rows += , (Row "skin '$cfgSkin' css" 'exists' $skinFile ($skinOk))

$diffCount = ($rows | Where-Object { $_ -eq $false }).Count
if (-not $Quiet) { Write-Host ("[names] {0} check(s), {1} diff(s)" -f $rows.Count, $diffCount) }
if ($diffCount -gt 0) { exit 1 } else { exit 0 }
