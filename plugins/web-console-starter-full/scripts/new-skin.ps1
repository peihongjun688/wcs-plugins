<# ============================================================
   web-console-starter - skin generator (new-skin.ps1)
   NOTE: keep this file ASCII-only so it parses correctly under
   Windows PowerShell 5.1 (GBK console). No CJK characters.
   ------------------------------------------------------------
   Usage:
     powershell -ExecutionPolicy Bypass -File new-skin.ps1 ^
       -Name ocean -Accent "#0EA5E9"              # dark glass (default)
     powershell -ExecutionPolicy Bypass -File new-skin.ps1 ^
       -Name paper -Accent "#0F766E" -Mode light   # light theme

   Output:
     ..\frontend\src\themes\<Name>.css  (full token contract)

   After generation (see AI-GUIDE.md):
     1) register the skin in frontend/src/app.skin.js -> SKINS
     2) npm run build and screenshot all pages to verify
   ============================================================ #>
param(
  [Parameter(Mandatory = $true)]
  [string]$Name,          # skin id: lowercase english with dashes
  [Parameter(Mandatory = $true)]
  [string]$Accent,        # primary color hex, e.g. "#0EA5E9"
  [string]$Accent2 = "",  # secondary gradient hex; empty = auto derive
  [ValidateSet("dark", "light")]
  [string]$Mode = "dark",
  [switch]$Force
)

$ErrorActionPreference = "Stop"

# ---------- utils ----------
function HexToRgb($hex) {
  $h = $hex.TrimStart('#')
  if ($h.Length -eq 3) { $h = ($h.ToCharArray() | ForEach-Object { "$_$_" }) -join '' }
  return [pscustomobject]@{
    R = [Convert]::ToInt32($h.Substring(0, 2), 16)
    G = [Convert]::ToInt32($h.Substring(2, 2), 16)
    B = [Convert]::ToInt32($h.Substring(4, 2), 16)
  }
}

function RgbToHex($r, $g, $b) {
  $rr = [int][Math]::Round([Math]::Max(0, [Math]::Min(255, $r)))
  $gg = [int][Math]::Round([Math]::Max(0, [Math]::Min(255, $g)))
  $bb = [int][Math]::Round([Math]::Max(0, [Math]::Min(255, $b)))
  return ('#{0:X2}{1:X2}{2:X2}' -f $rr, $gg, $bb)
}

# linear mix: w = weight of color a (0..1)
function Mix($a, $b, $w) {
  $ar = HexToRgb $a; $br = HexToRgb $b
  return (RgbToHex ($ar.R * $w + $br.R * (1 - $w)) ($ar.G * $w + $br.G * (1 - $w)) ($ar.B * $w + $br.B * (1 - $w)))
}

# rotate hue by deg (degrees) to build a harmonious palette
function Hue($hex, $deg) {
  $c = HexToRgb $hex
  $r = $c.R / 255.0; $g = $c.G / 255.0; $b = $c.B / 255.0
  $max = [Math]::Max($r, [Math]::Max($g, $b)); $min = [Math]::Min($r, [Math]::Min($g, $b))
  $l = ($max + $min) / 2
  $d = $max - $min
  if ($d -eq 0) { $h = 0 } else {
    if ($max -eq $r) { $h = ((($g - $b) / $d) % 6) } elseif ($max -eq $g) { $h = (($b - $r) / $d) + 2 } else { $h = (($r - $g) / $d) + 4 }
    $h = $h * 60
    if ($h -lt 0) { $h += 360 }
  }
  $h = (($h + $deg) % 360 + 360) % 360
  if ($d -eq 0) { $s = 0 } else { $s = $d / (1 - [Math]::Abs(2 * $l - 1)) }
  $cc = (1 - [Math]::Abs(2 * $l - 1)) * $s
  $x = $cc * (1 - [Math]::Abs((($h / 60) % 2) - 1))
  $m = $l - $cc / 2
  if ($h -lt 60) { $rr = $cc; $gg = $x; $bb = 0 }
  elseif ($h -lt 120) { $rr = $x; $gg = $cc; $bb = 0 }
  elseif ($h -lt 180) { $rr = 0; $gg = $cc; $bb = $x }
  elseif ($h -lt 240) { $rr = 0; $gg = $x; $bb = $cc }
  elseif ($h -lt 300) { $rr = $x; $gg = 0; $bb = $cc }
  else { $rr = $cc; $gg = 0; $bb = $x }
  return (RgbToHex (($rr + $m) * 255) (($gg + $m) * 255) (($bb + $m) * 255))
}

# ---------- normalize args ----------
if ($Accent -notmatch '^#[0-9A-Fa-f]{6}$') { throw "Accent must be a 6-digit hex (e.g. #0EA5E9): $Accent" }
if ($Accent2 -ne '' -and $Accent2 -notmatch '^#[0-9A-Fa-f]{6}$') { throw "Accent2 must be a 6-digit hex or empty" }
$Name = $Name.ToLower() -replace '[^a-z0-9-]', '-'
if ($Name.Length -eq 0 -or $Name.Length -gt 32) { throw "Bad skin name: $Name" }

$accent = $Accent.ToUpper()
if ($Accent2 -eq '') { $accent2 = Hue $accent 40 } else { $accent2 = $Accent2.ToUpper() }
$out = Join-Path $PSScriptRoot "..\frontend\src\themes\$Name.css"
if ((Test-Path $out) -and -not $Force) { throw "Already exists: $out (add -Force to overwrite)" }

$ac = HexToRgb $accent
$acRgb = "$($ac.R), $($ac.G), $($ac.B)"

# ---------- derive token set per mode ----------
if ($Mode -eq 'dark') {
  $bg0        = Mix '#05060f' $accent 0.20
  $bg1        = Mix '#05060f' $accent 0.45
  $panelSolid = Mix '#0a0d1c' $accent 0.25
  $txt        = '#cfe3ff'
  $txtDim     = Mix $txt '#6b7fa3' 0.55
  $txtStrong  = '#f2f7ff'
  $fgOnAccent = '#05101c'
  $radial1    = Mix '#05060f' $accent 0.55
  $radial2    = Mix '#05060f' $accent2 0.35
  $sideBg     = 'rgba(5, 8, 18, 0.55)'
  $topBg      = 'rgba(5, 8, 18, 0.35)'
  $panelVal   = 'rgba(255, 255, 255, 0.05)'
  $inputBg    = 'rgba(255, 255, 255, 0.06)'
  $trackVal   = 'rgba(255, 255, 255, 0.07)'
  $lineVal    = 'rgba(255, 255, 255, 0.09)'
  $panelBd    = 'rgba(255, 255, 255, 0.10)'
  $inputBd    = 'rgba(255, 255, 255, 0.16)'
  $scheme     = 'dark'
  $shadowBase = '0 6px 22px rgba(0, 0, 0, 0.25)'
  $shadowHov  = '0 10px 30px rgba(0, 0, 0, 0.38)'
} else {
  $bg0        = '#eef2f7'
  $bg1        = '#f7f9fc'
  $panelSolid = '#ffffff'
  $txt        = '#1c2c4a'
  $txtDim     = '#64748b'
  $txtStrong  = '#0f1e3a'
  $fgOnAccent = '#ffffff'
  $radial1    = Mix '#ffffff' $accent 0.12
  $radial2    = Mix '#ffffff' $accent2 0.10
  $sideBg     = 'rgba(255, 255, 255, 0.62)'
  $topBg      = 'rgba(255, 255, 255, 0.55)'
  $panelVal   = 'rgba(255, 255, 255, 0.85)'
  $inputBg    = '#ffffff'
  $trackVal   = 'rgba(15, 42, 88, 0.08)'
  $lineVal    = 'rgba(15, 42, 88, 0.10)'
  $panelBd    = 'rgba(15, 42, 88, 0.12)'
  $inputBd    = 'rgba(15, 42, 88, 0.22)'
  $scheme     = 'light'
  $shadowBase = '0 4px 16px rgba(15, 42, 88, 0.08)'
  $shadowHov  = '0 8px 24px rgba(15, 42, 88, 0.14)'
}

$menuActiveBg = "rgba($acRgb, 0.16)"
$hoverBg      = "rgba($acRgb, 0.10)"

# chart palette: accent + 9 hues rotated by 36 deg
$charts = @($accent)
for ($i = 1; $i -lt 10; $i++) { $charts += (Hue $accent (36 * $i)) }
$chartBlock = ''
for ($i = 0; $i -lt 10; $i++) { $chartBlock += "--chart-$($i+1): $($charts[$i]);  " }

# ---------- render css ----------
$css = @"
/* ============================================================
   web-console-starter - skin: $Name (generated by new-skin.ps1)
   accent $accent / accent2 $accent2 / mode $Mode
   Tune tokens below; components/layout need no change.
   ============================================================ */
html[data-skin="$Name"] {
  color-scheme: $scheme;

  --app-mode: $Mode;

  --bg-0: $bg0;
  --bg-1: $bg1;

  --panel: $panelVal;
  --panel-bd: $panelBd;
  --panel-solid: $panelSolid;

  --side-bg: $sideBg;
  --top-bg: $topBg;

  --txt: $txt;
  --txt-dim: $txtDim;
  --txt-strong: $txtStrong;

  --accent: $accent;
  --accent2: $accent2;

  --logo-fg: $fgOnAccent;
  --btn-fg: $fgOnAccent;

  --menu-active-bg: $menuActiveBg;
  --menu-active-txt: $accent;
  --hover-bg: $hoverBg;

  --input-bg: $inputBg;
  --input-bd: $inputBd;

  --line: $lineVal;
  --track: $trackVal;

  $chartBlock
}

html[data-skin="$Name"] body {
  background:
    radial-gradient(1200px 800px at 18% -10%, $radial1 0%, transparent 55%),
    radial-gradient(1000px 700px at 100% 0%, $radial2 0%, transparent 50%),
    linear-gradient(135deg, $bg1 0%, $bg0 100%);
  background-attachment: fixed;
}

html[data-skin="$Name"] .panel {
  box-shadow: $shadowBase;
}
html[data-skin="$Name"] .panel:hover {
  box-shadow: $shadowHov;
}
"@

# ---------- write ----------
$dir = Split-Path $out
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
Set-Content -Path $out -Value $css -Encoding UTF8
Write-Host "Skin generated: $out"
Write-Host "Next: register in frontend/src/app.skin.js -> SKINS ('$Name': 'label'), then npm run build."
