#!/usr/bin/env bash
# ============================================================
# web-console-starter - stop.sh
# Stops backend started by start.sh (uses backend/backend.pid)
# ============================================================
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PID_FILE="$ROOT/backend/backend.pid"

if [ -f "$PID_FILE" ]; then
  PID="$(cat "$PID_FILE")"
  if kill -0 "$PID" 2>/dev/null; then
    kill "$PID"
    echo "[wcs] stopped pid $PID"
  else
    echo "[wcs] pid $PID not running"
  fi
  rm -f "$PID_FILE"
else
  echo "[wcs] no pid file ($PID_FILE)"
fi
