const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../v2/web/dist/index.html');
const outPath = path.join(__dirname, '../v2/mobile/src/assets/webAppBundle.js');

if (!fs.existsSync(path.dirname(outPath))) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
}

const html = fs.readFileSync(htmlPath, 'utf8');
const jsContent = `// Auto-generated offline single-file Web App Bundle
export const WEB_APP_HTML = ${JSON.stringify(html)};
`;

fs.writeFileSync(outPath, jsContent, 'utf8');
console.log('Successfully bundled offline web app HTML into mobile bundle!');
