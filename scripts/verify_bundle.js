/**
 * Universal Build & Bundle Verification Gate
 * Validates web build output, mobile web bundle, and static deployment assets
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
let errors = [];

function checkFileExists(filePath, minSizeBytes = 100, description = '') {
  const fullPath = path.resolve(rootDir, filePath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`❌ Missing required artifact: ${filePath} (${description})`);
    return false;
  }
  const stats = fs.statSync(fullPath);
  if (stats.size < minSizeBytes) {
    errors.push(`❌ Artifact too small or corrupt: ${filePath} (Size: ${stats.size} bytes, minimum expected: ${minSizeBytes} bytes)`);
    return false;
  }
  console.log(`✅ Verified artifact: ${filePath} (${(stats.size / 1024).toFixed(1)} KB)`);
  return true;
}

console.log('🔍 [1/3] Verifying Production Web Singlefile Bundle...');
if (checkFileExists('v2/web/dist/index.html', 5000, 'Web Production Singlefile Bundle')) {
  const htmlContent = fs.readFileSync(path.resolve(rootDir, 'v2/web/dist/index.html'), 'utf8');
  if (!htmlContent.includes('<html') || !htmlContent.includes('</html>')) {
    errors.push('❌ v2/web/dist/index.html is not valid HTML markup');
  }
  if (!htmlContent.includes('Still') && !htmlContent.includes('neuro-acoustic')) {
    errors.push('❌ v2/web/dist/index.html does not contain Still application bundle');
  }
}

console.log('\n🔍 [2/3] Verifying Mobile Web Offline Bundle...');
if (checkFileExists('v2/mobile/src/assets/webAppBundle.js', 5000, 'Mobile Webview Bundle')) {
  const bundleContent = fs.readFileSync(path.resolve(rootDir, 'v2/mobile/src/assets/webAppBundle.js'), 'utf8');
  if (!bundleContent.includes('export const WEB_APP_HTML =')) {
    errors.push('❌ v2/mobile/src/assets/webAppBundle.js does not export WEB_APP_HTML');
  }
}

console.log('\n🔍 [3/3] Verifying Version & Manifest Consistency...');
if (checkFileExists('version.json', 20, 'Root Version Metadata')) {
  try {
    const versionData = JSON.parse(fs.readFileSync(path.resolve(rootDir, 'version.json'), 'utf8'));
    if (!versionData.version) {
      errors.push('❌ version.json missing "version" property');
    } else {
      console.log(`✅ Version metadata verified: v${versionData.version}`);
    }
  } catch (e) {
    errors.push(`❌ version.json is not valid JSON: ${e.message}`);
  }
}

if (checkFileExists('manifest.json', 50, 'PWA Web Manifest')) {
  try {
    const manifest = JSON.parse(fs.readFileSync(path.resolve(rootDir, 'manifest.json'), 'utf8'));
    if (!manifest.name || !manifest.icons || !Array.isArray(manifest.icons)) {
      errors.push('❌ manifest.json missing required PWA fields (name, icons)');
    } else {
      console.log(`✅ PWA Manifest verified: "${manifest.name}"`);
    }
  } catch (e) {
    errors.push(`❌ manifest.json is not valid JSON: ${e.message}`);
  }
}

console.log('\n==========================================');
if (errors.length > 0) {
  console.error('❌ BUNDLE VERIFICATION FAILED:');
  errors.forEach((err) => console.error(err));
  process.exit(1);
} else {
  console.log('✨ ALL PRODUCTION BUNDLES & ARTIFACTS VERIFIED SUCCESSFULLY!');
  process.exit(0);
}
