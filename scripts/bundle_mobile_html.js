const fs = require('fs');
const path = require('path');

const webDistHtmlPath = path.join(__dirname, '../v2/web/dist/index.html');
const rootHtmlPath = path.join(__dirname, '../index.html');
const mobileOutPath = path.join(__dirname, '../v2/mobile/src/assets/webAppBundle.js');
const webPublicDir = path.join(__dirname, '../v2/web/public');
const rootDir = path.join(__dirname, '..');

if (!fs.existsSync(webDistHtmlPath)) {
  console.error('Error: v2/web/dist/index.html does not exist. Run build:web first.');
  process.exit(1);
}

const html = fs.readFileSync(webDistHtmlPath, 'utf8');

// 1. Sync to root index.html for GitHub Pages static production
fs.writeFileSync(rootHtmlPath, html, 'utf8');
console.log('✅ Synchronized latest build to root production index.html');

// 2. Sync to mobile webview bundle
if (!fs.existsSync(path.dirname(mobileOutPath))) {
  fs.mkdirSync(path.dirname(mobileOutPath), { recursive: true });
}
const jsContent = `// Auto-generated offline single-file Web App Bundle
export const WEB_APP_HTML = ${JSON.stringify(html)};
`;
fs.writeFileSync(mobileOutPath, jsContent, 'utf8');
console.log('✅ Successfully bundled offline web app HTML into mobile bundle!');

// 3. Copy image assets to root for GitHub Pages static hosting
if (fs.existsSync(webPublicDir)) {
  const files = fs.readdirSync(webPublicDir);
  for (const file of files) {
    if (file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.webp') || file.endsWith('.wav')) {
      const srcFile = path.join(webPublicDir, file);
      const destFile = path.join(rootDir, file);
      fs.copyFileSync(srcFile, destFile);
      console.log(`✅ Synced asset to root: ${file}`);
    }
  }
}

