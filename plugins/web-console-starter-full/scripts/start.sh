#!/usr/bin/env bash
# ============================================================
# web-console-starter - start.sh (Linux/macOS one-key start)
# Runs backend (serves built SPA + API) in background, writes
# PID to backend/backend.pid and log to backend.log.
# Stop it with stop.sh. No service registration.
# ============================================================
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
echo "[wcs] root: $ROOT"

command -v node >/dev/null 2>&1 || { echo "[ERR] node.js not found. Install Node >= 22.13 first."; exit 1; }

# deps
if [ ! -d backend/node_modules ]; then
  echo "[wcs] installing backend deps..."
  (cd backend && npm install --no-audit --no-fund)
fi

# build SPA if missing
if [ ! -f backend/public/index.html ]; then
  if [ ! -d frontend/node_modules ]; then
    echo "[wcs] installing frontend deps..."
    (cd frontend && npm install --no-audit --no-fund)
  fi
  echo "[wcs] building frontend..."
  (cd frontend && npm run build)
fi

# read PORT from backend/.env
PORT="$(grep -E '^PORT=' backend/.env 2>/dev/null | head -1 | cut -d= -f2 | tr -d '[:space:]')"
[ -z "$PORT" ] && PORT=3000

if [ -f backend/backend.pid ] && kill -0 "$(cat backend/backend.pid)" 2>/dev/null; then
  echo "[wcs] already running pid $(cat backend/backend.pid)"
  exit 0
fi

cd backend
nohup node src/server.js > ../backend.log 2>&1 &
echo $! > backend.pid
cd "$ROOT"
echo "[wcs] started pid $(cat backend/backend.pid): http://127.0.0.1:$PORT"
echo "[wcs] log: $ROOT/backend.log"
