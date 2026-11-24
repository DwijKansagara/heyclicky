import { BrowserWindow, screen } from 'electron';
import path from 'path';

let islandWindow: BrowserWindow | null = null;

export function createFloatingIslandWindow(preloadPath: string, rendererUrl: string): BrowserWindow {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width } = primaryDisplay.workAreaSize;

  islandWindow = new BrowserWindow({
    width: 440,
    height: 64,
    x: Math.round(width / 2 - 220),
    y: 12,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: true,
    hasShadow: true,
    focusable: true,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (rendererUrl.startsWith('http')) {
    islandWindow.loadURL(`${rendererUrl}#island`);
  } else {
    islandWindow.loadFile(rendererUrl, { hash: 'island' });
  }

  // Update position when mouse moves across displays
  islandWindow.on('closed', () => {
    islandWindow = null;
  });

  return islandWindow;
}

export function resizeIsland(width: number, height: number) {
  if (!islandWindow || islandWindow.isDestroyed()) return;
  const bounds = islandWindow.getBounds();
  const currentDisplay = screen.getDisplayNearestPoint({ x: bounds.x, y: bounds.y });
  const centerX = currentDisplay.bounds.x + Math.round(currentDisplay.bounds.width / 2 - width / 2);
  islandWindow.setBounds({
    x: centerX,
    y: currentDisplay.bounds.y + 12,
    width,
    height,
  });
}

export function moveToNearestDisplay(cursorX: number, cursorY: number) {
  if (!islandWindow || islandWindow.isDestroyed()) return;
  const targetDisplay = screen.getDisplayNearestPoint({ x: cursorX, y: cursorY });
  const bounds = islandWindow.getBounds();
  const newX = targetDisplay.bounds.x + Math.round(targetDisplay.bounds.width / 2 - bounds.width / 2);
  const newY = targetDisplay.bounds.y + 12;

  // Only move if display changed
  if (Math.abs(bounds.x - newX) > 100 || Math.abs(bounds.y - newY) > 50) {
    islandWindow.setPosition(newX, newY);
  }
}
