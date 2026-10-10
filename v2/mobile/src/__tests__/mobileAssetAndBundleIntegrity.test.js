import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { WEB_APP_HTML } from '../assets/webAppBundle';
import appConfig from '../../app.json';
import promptsData from '../data/prompts.json';

describe('Mobile Assets & Webview Bundle Integrity Universal Gate', () => {
  it('validates offline web app bundle exists and meets production size threshold', () => {
    expect(WEB_APP_HTML).toBeDefined();
    expect(typeof WEB_APP_HTML).toBe('string');
    // Offline bundle must be substantial (> 50KB)
    expect(WEB_APP_HTML.length).toBeGreaterThan(50000);
  });

  it('verifies that the offline web app bundle contains complete HTML document structure', () => {
    expect(WEB_APP_HTML).toContain('<!DOCTYPE html>');
    expect(WEB_APP_HTML).toContain('<html');
    expect(WEB_APP_HTML).toContain('<head>');
    expect(WEB_APP_HTML).toContain('<body>');
    expect(WEB_APP_HTML).toContain('</html>');
  });

  it('verifies offline bundle embeds React application root and bridge scripts', () => {
    expect(WEB_APP_HTML).toContain('id="root"');
    // WebView postMessage bridge
    expect(WEB_APP_HTML).toContain('ReactNativeWebView');
  });

  it('verifies offline bundle contains Still neuro-acoustic features', () => {
    // Soundscapes
    expect(WEB_APP_HTML).toContain('alpha_sanctuary');
    expect(WEB_APP_HTML).toContain('brownian_rain');
    expect(WEB_APP_HTML).toContain('deep_delta');
    expect(WEB_APP_HTML).toContain('zen_garden');

    // Breathing halo
    expect(WEB_APP_HTML).toContain('halo');
    // Streak stats
    expect(WEB_APP_HTML).toContain('streak');
  });

  it('verifies app.json contains required Expo and native deployment configurations', () => {
    const expo = appConfig.expo;
    expect(expo).toBeDefined();
    expect(expo.name).toBe('Still');
    expect(expo.slug).toBe('still');
    expect(expo.version).toBe('2.2.0');
    expect(expo.orientation).toBe('portrait');
    expect(expo.userInterfaceStyle).toBe('dark');

    // Android configuration
    expect(expo.android).toBeDefined();
    expect(expo.android.package).toBe('com.hari.still');

    // iOS configuration
    expect(expo.ios).toBeDefined();
    expect(expo.ios.bundleIdentifier).toBe('com.hari.still');
  });

  it('verifies native ambient carrier audio file exists and has valid WAV header', () => {
    const carrierPath = path.resolve(__dirname, '../../assets/ambient_carrier.wav');
    expect(fs.existsSync(carrierPath), 'ambient_carrier.wav must exist').toBe(true);

    const stats = fs.statSync(carrierPath);
    expect(stats.size).toBeGreaterThan(100);

    const buffer = fs.readFileSync(carrierPath);
    const riffHeader = buffer.toString('ascii', 0, 4);
    const waveHeader = buffer.toString('ascii', 8, 12);
    expect(riffHeader).toBe('RIFF');
    expect(waveHeader).toBe('WAVE');
  });

  it('verifies icon assets exist in the mobile assets folder', () => {
    const iconPath = path.resolve(__dirname, '../../assets/icon.png');
    const adaptiveIconPath = path.resolve(__dirname, '../../assets/adaptive-icon.png');
    const faviconPath = path.resolve(__dirname, '../../assets/favicon.png');

    expect(fs.existsSync(iconPath), 'icon.png must exist').toBe(true);
    expect(fs.existsSync(adaptiveIconPath), 'adaptive-icon.png must exist').toBe(true);
    expect(fs.existsSync(faviconPath), 'favicon.png must exist').toBe(true);
  });

  it('verifies local prompts dataset has required slots and clean copy', () => {
    ['morning', 'afternoon', 'evening'].forEach((slot) => {
      expect(Array.isArray(promptsData[slot])).toBe(true);
      expect(promptsData[slot].length).toBeGreaterThan(0);
      promptsData[slot].forEach((item) => {
        expect(item.title.trim().length).toBeGreaterThan(0);
        expect(item.body.trim().length).toBeGreaterThan(0);
      });
    });
  });
});
