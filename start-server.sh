#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-8000}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVE_DIR="${SCRIPT_DIR}/public"

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 is vereist om de server te starten." >&2
  exit 1
fi

echo "Start lokale server op http://localhost:${PORT}/ (map: ${SERVE_DIR})"
python3 -m http.server "${PORT}" --directory "${SERVE_DIR}"
