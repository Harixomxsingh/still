#!/usr/bin/env bash
set -e

echo "🛡️  [STILL QUALITY GATE] Running Universal Pre-Push Verification Suite..."

echo ""
echo "▶ 1. Building Production Web Bundle..."
npm --prefix v2/web run build

echo ""
echo "▶ 2. Bundling Offline Webview into Mobile Package..."
node scripts/bundle_mobile_html.js

echo ""
echo "▶ 3. Running Web & Shared Unit / Component / Audio Tests..."
npm --prefix v2/web test

echo ""
echo "▶ 4. Running Mobile Services & Bridge Tests..."
npm --prefix v2/mobile test

echo ""
echo "▶ 5. Verifying Bundle & Release Artifact Integrity..."
node scripts/verify_bundle.js

echo ""
echo "✨ [SUCCESS] All test cases and release integrity checks passed cleanly!"
echo "🚀 Safe to push to production."
