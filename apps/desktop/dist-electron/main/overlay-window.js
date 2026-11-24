"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOverlayWindow = createOverlayWindow;
exports.setOverlayClickThrough = setOverlayClickThrough;
const electron_1 = require("electron");
let overlayWindow = null;
function createOverlayWindow(preloadPath, rendererUrl) {
    const displays = electron_1.screen.getAllDisplays();
    // Compute union bounding box covering all monitors
    let minX = 0, minY = 0, maxX = 0, maxY = 0;
    for (const d of displays) {
        minX = Math.min(minX, d.bounds.x);
        minY = Math.min(minY, d.bounds.y);
        maxX = Math.max(maxX, d.bounds.x + d.bounds.width);
        maxY = Math.max(maxY, d.bounds.y + d.bounds.height);
    }
    overlayWindow = new electron_1.BrowserWindow({
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
    }
    else {
        overlayWindow.loadFile(rendererUrl, { hash: 'overlay' });
    }
    overlayWindow.on('closed', () => {
        overlayWindow = null;
    });
    return overlayWindow;
}
function setOverlayClickThrough(ignore) {
    if (!overlayWindow || overlayWindow.isDestroyed())
        return;
    overlayWindow.setIgnoreMouseEvents(ignore, { forward: true });
}
