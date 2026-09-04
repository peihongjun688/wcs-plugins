@echo off
rem ============================================================
rem  web-console-starter - stop.bat
rem  Stops the backend started by start.bat (kills the process
rem  listening on the PORT from backend\.env).
rem ============================================================
setlocal
cd /d "%~dp0.."

set "PORT=3000"
if exist "backend\.env" (
  for /f "usebackq tokens=1,* delims==" %%a in ("backend\.env") do (
    if /i "%%a"=="PORT" set "PORT=%%b"
  )
)

powershell -NoProfile -Command "$c = Get-NetTCPConnection -LocalPort %PORT% -State Listen -ErrorAction SilentlyContinue; if ($c) { Stop-Process -Id $c.OwningProcess -Force; Write-Host ('[wcs] stopped :' + %PORT%) } else { Write-Host ('[wcs] no listener on :' + %PORT%) }"
endlocal
