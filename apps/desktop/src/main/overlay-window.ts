import { BrowserWindow, screen, ipcMain } from 'electron';

let overlayWindow: BrowserWindow | null = null;

export function createOverlayWindow(preloadPath: string, rendererUrl: string): BrowserWindow {
  const displays = screen.getAllDisplays();

  // Compute union bounding box covering all monitors
  let minX = 0, minY = 0, maxX = 0, maxY = 0;
  for (const d of displays) {
    minX = Math.min(minX, d.bounds.x);
    minY = Math.min(minY, d.bounds.y);
    maxX = Math.max(maxX, d.bounds.x + d.bounds.width);
    maxY = Math.max(maxY, d.bounds.y + d.bounds.height);
  }

  overlayWindow = new BrowserWindow({
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    focusable: false,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Click-through by default
  overlayWindow.setIgnoreMouseEvents(true, { forward: true });

  if (rendererUrl.startsWith('http')) {
    overlayWindow.loadURL(`${rendererUrl}#overlay`);
  } else {
    overlayWindow.loadFile(rendererUrl, { hash: 'overlay' });
  }

  overlayWindow.on('closed', () => {
    overlayWindow = null;
  });

  return overlayWindow;
}

export function setOverlayClickThrough(ignore: boolean) {
  if (!overlayWindow || overlayWindow.isDestroyed()) return;
  overlayWindow.setIgnoreMouseEvents(ignore, { forward: true });
}
