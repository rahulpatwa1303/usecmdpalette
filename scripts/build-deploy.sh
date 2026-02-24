#!/usr/bin/env bash
# Build the library, landing page, and all demos into combined-dist/
# Each app is built with --base /usecmdpalette/<name>/ so asset paths are correct
# when served at https://rahulpatwa1303.github.io/usecmdpalette/
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/combined-dist"

echo "▶ Cleaning output directory..."
rm -rf "$OUT"
mkdir -p "$OUT"

# Prevent GitHub Pages from running Jekyll (needed for _assets dirs etc.)
touch "$OUT/.nojekyll"

# ── 1. Library (needed so demos can import from built dist if needed) ──────
echo ""
echo "▶ Building library..."
cd "$ROOT"
npm ci --prefer-offline
npm run build

# ── 2. Landing page ────────────────────────────────────────────────────────
echo ""
echo "▶ Building landing page..."
cd "$ROOT/landing"
npm ci --prefer-offline
npx vite build --base /usecmdpalette/    # outputs to landing/dist/
cp -r "$ROOT/landing/dist/." "$OUT/"

# ── 3. Demos ───────────────────────────────────────────────────────────────
for DEMO in demo demo-css demo-tailwind demo-mui; do
  echo ""
  echo "▶ Building $DEMO..."
  cd "$ROOT/$DEMO"
  npm ci --prefer-offline
  # --base sets the public URL prefix so asset paths are /usecmdpalette/demo-name/assets/...
  npx vite build --base "/usecmdpalette/$DEMO/"
  mkdir -p "$OUT/$DEMO"
  cp -r "$ROOT/$DEMO/dist/." "$OUT/$DEMO/"
done

echo ""
echo "✓ Done — output in combined-dist/"
echo "  /usecmdpalette/              → landing page"
echo "  /usecmdpalette/demo/         → basic demo"
echo "  /usecmdpalette/demo-css/     → plain CSS demo"
echo "  /usecmdpalette/demo-tailwind/→ Tailwind demo"
echo "  /usecmdpalette/demo-mui/     → MUI demo"
