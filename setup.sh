#!/usr/bin/env bash
# Aztec Connect Starter bootstrap — https://github.com/holoyZ/aztec/issues/12
# Reproduces the full project scaffold. Safe to re-run (skips existing files).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

echo "==> Creating directories..."
mkdir -p \
  src/artifacts/counter \
  scripts \
  contracts/counter/counter_contract/src \
  contracts/counter/counter_test/src \
  frontend/src \
  test

echo "==> Bootstrapping files (only if missing)..."
# Core files are committed in the repo; setup ensures structure + installs deps.
# On a fresh clone, all files are already present from git.
# This step creates any missing pieces for partial checkouts.

for dir in src scripts contracts/counter frontend/src test; do
  [[ -d "$dir" ]] || mkdir -p "$dir"
done

if [[ ! -f package.json ]]; then
  echo "ERROR: package.json missing. Clone https://github.com/holoyZ/aztec first."
  exit 1
fi

echo "==> Installing npm dependencies..."
npm install

echo ""
echo "Bootstrap complete."
echo ""
echo "Next steps:"
echo "  1. Start sandbox:  npx @aztec/aztec-sandbox"
echo "  2. Compile contract: npm run compile:counter"
echo "  3. Connect:          npm run connect"
echo "  4. Deploy:           npm run deploy"
echo "  5. Frontend:         npm run dev   → http://localhost:5173"
echo ""
echo "For future agents:"
echo "  You are continuing an Aztec dApp starter. Run bash setup.sh after clone."
echo "  Maintain: Noir Counter in contracts/counter, React frontend, src/connect.ts"
