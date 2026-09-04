@echo off
rem ============================================================
rem  web-console-starter - start.bat (Windows one-key start)
rem  Starts backend (Express serves built SPA + API) in a
rem  minimized console, then opens the browser.
rem  Stop it with stop.bat. No service registration.
rem ============================================================
setlocal EnableDelayedExpansion
cd /d "%~dp0.."
set "ROOT=%CD%"
echo [wcs] root: %ROOT%

where node >nul 2>nul
if errorlevel 1 (
  echo [ERR] node.js not found in PATH. Install Node >= 22.13 first.
  exit /b 1
)

rem --- deps ---
if not exist "%ROOT%\backend\node_modules" (
  echo [wcs] installing backend deps...
  pushd "%ROOT%\backend"
  call npm install --no-audit --no-fund
  popd
)

rem --- build SPA if missing (first run) ---
if not exist "%ROOT%\backend\public\index.html" (
  if not exist "%ROOT%\frontend\node_modules" (
    echo [wcs] installing frontend deps...
    pushd "%ROOT%\frontend"
    call npm install --no-audit --no-fund
    popd
  )
  echo [wcs] building frontend...
  pushd "%ROOT%\frontend"
  call npm run build
  popd
)

rem --- read PORT from backend\.env (default 3000) ---
set "PORT=3000"
if exist "%ROOT%\backend\.env" (
  for /f "usebackq tokens=1,* delims==" %%a in ("%ROOT%\backend\.env") do (
    if /i "%%a"=="PORT" set "PORT=%%b"
  )
)

rem --- start backend minimized ---
cd /d "%ROOT%\backend"
start "wcs-backend" /min cmd /c "node src/server.js > ..\backend.log 2>&1"
timeout /t 1 /nobreak >nul
echo [wcs] started:  http://127.0.0.1:%PORT%
echo [wcs] log file:  %ROOT%\backend.log
start "" "http://127.0.0.1:%PORT%"
endlocal
