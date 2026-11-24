import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy manifest.json
fs.copyFileSync('manifest.json', path.join(distDir, 'manifest.json'));

// Copy popup.html
fs.copyFileSync('src/popup.html', path.join(distDir, 'popup.html'));

// Ensure dist/icons directory
const distIconsDir = path.join(distDir, 'icons');
if (!fs.existsSync(distIconsDir)) {
  fs.mkdirSync(distIconsDir, { recursive: true });
}

// Create minimal SVG/PNG icons
const iconSizes = [16, 32, 48, 128];
for (const size of iconSizes) {
  // Simple 1x1 transparent PNG fallback byte representation or tiny blue icon
  const iconPath = path.join(distIconsDir, `icon${size}.png`);
  if (!fs.existsSync(iconPath)) {
    // Generate valid 1x1 blue PNG
    const pngHeader = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
      0x0d, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x60, 0x60, 0xf8, 0x0f,
      0x00, 0x00, 0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00,
      0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82
    ]);
    fs.writeFileSync(iconPath, pngHeader);
  }
}

console.log('[HeyClicky Extension] Assets copied successfully.');
