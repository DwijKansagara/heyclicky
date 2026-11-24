import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, safeStorage } from 'electron';
import path from 'path';
import { createFloatingIslandWindow, resizeIsland, moveToNearestDisplay } from './floating-island.js';
import { createOverlayWindow, setOverlayClickThrough } from './overlay-window.js';
import { captureAllScreens } from './screen-capture.js';
import { registerGlobalShortcuts, unregisterGlobalShortcuts } from './shortcuts.js';
import { startWebSocketBridge, stopWebSocketBridge, broadcastToExtension } from './ws-bridge.js';
import { executeDriveActions, triggerKillSwitch, checkPhysicalMouseDisplacement } from './input-injector.js';

let tray: Tray | null = null;
let islandWin: BrowserWindow | null = null;
let overlayWin: BrowserWindow | null = null;
let sidebarWin: BrowserWindow | null = null;

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
const rendererUrl = isDev
  ? 'http://localhost:5173'
  : path.join(__dirname, '../../dist-renderer/index.html');
const preloadPath = path.join(__dirname, '../preload/index.js');

// Enforce single instance
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

app.whenReady().then(() => {
  setupTray();
  overlayWin = createOverlayWindow(preloadPath, rendererUrl);
  islandWin = createFloatingIslandWindow(preloadPath, rendererUrl);

  // Global Push-To-Talk shortcut (Default Ctrl+Alt)
  registerGlobalShortcuts(islandWin, 'CommandOrControl+Alt', (isDoubleTap) => {
    islandWin?.webContents.send('SHORTCUT_TRIGGERED', { isDoubleTap });
    overlayWin?.webContents.send('SHORTCUT_TRIGGERED', { isDoubleTap });
  });

  // Start WebSocket bridge for Companion extension
  startWebSocketBridge((clientMsg) => {
    islandWin?.webContents.send('EXTENSION_MESSAGE', clientMsg);
    overlayWin?.webContents.send('EXTENSION_MESSAGE', clientMsg);
  });

  setupIpcHandlers();
});

function setupTray() {
  // Simple clean icon for system tray
  const icon = nativeImage.createEmpty();
  tray = new Tray(icon);
  tray.setToolTip('HeyClicky for Windows (100% Free & Open Source)');

  const contextMenu = Menu.buildFromTemplate([
    { label: 'HeyClicky v1.1.7 (Made by Dwij Kansagara)', enabled: false },
    { type: 'separator' },
    {
      label: 'Open Island',
      click: () => {
        islandWin?.show();
        islandWin?.focus();
      },
    },
    {
      label: 'Open Settings',
      click: () => {
        openSidebarWindow('settings');
      },
    },
    {
      label: 'Start Onboarding Tour',
      click: () => {
        openSidebarWindow('onboarding');
      },
    },
    { type: 'separator' },
    {
      label: 'Launch on Windows Startup',
      type: 'checkbox',
      checked: app.getLoginItemSettings().openAtLogin,
      click: (item) => {
        app.setLoginItemSettings({ openAtLogin: item.checked });
      },
    },
    { type: 'separator' },
    {
      label: 'Quit HeyClicky',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
}

function openSidebarWindow(initialTab: string = 'chat') {
  if (sidebarWin && !sidebarWin.isDestroyed()) {
    sidebarWin.show();
    sidebarWin.focus();
    sidebarWin.webContents.send('NAVIGATE_TAB', initialTab);
    return;
  }

  sidebarWin = new BrowserWindow({
    width: 960,
    height: 680,
    minWidth: 700,
    minHeight: 500,
    frame: true,
    title: 'HeyClicky - Windows Assistant & Settings',
    backgroundColor: '#0f172a',
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const url = isDev ? `${rendererUrl}#sidebar` : rendererUrl;
  if (isDev) {
    sidebarWin.loadURL(`${rendererUrl}#sidebar?tab=${initialTab}`);
  } else {
    sidebarWin.loadFile(rendererUrl, { hash: `sidebar?tab=${initialTab}` });
  }

  sidebarWin.on('closed', () => {
    sidebarWin = null;
  });
}

function setupIpcHandlers() {
  // Screen Capture
  ipcMain.handle('CAPTURE_SCREENS', async () => {
    return await captureAllScreens();
  });

  // Floating Island Resizing & Display tracking
  ipcMain.on('RESIZE_ISLAND', (_e, { width, height }) => {
    resizeIsland(width, height);
  });

  ipcMain.on('UPDATE_CURSOR_POS', (_e, { x, y }) => {
    moveToNearestDisplay(x, y);
    // Check if user physically touched mouse while Drive is active
    checkPhysicalMouseDisplacement(x, y);
  });

  // Overlay click-through toggle (for when user draws ink or clicks 3D popups)
  ipcMain.on('SET_OVERLAY_CLICK_THROUGH', (_e, ignore: boolean) => {
    setOverlayClickThrough(ignore);
  });

  // Drive Computer Control execution & Kill Switch
  ipcMain.handle('EXECUTE_DRIVE_ACTIONS', async (_e, actions) => {
    return await executeDriveActions(actions);
  });

  ipcMain.on('TRIGGER_DRIVE_KILL_SWITCH', (_e, reason: string) => {
    triggerKillSwitch(reason);
  });

  // Open sidebar / settings window
  ipcMain.on('OPEN_SIDEBAR', (_e, tab?: string) => {
    openSidebarWindow(tab);
  });

  // Encrypted Secure Storage using DPAPI / electron.safeStorage
  ipcMain.handle('ENCRYPT_STRING', (_e, plainText: string) => {
    if (safeStorage.isEncryptionAvailable()) {
      const encrypted = safeStorage.encryptString(plainText);
      return encrypted.toString('base64');
    }
    // Fallback if DPAPI not available in current container
    return Buffer.from(plainText).toString('base64');
  });

  ipcMain.handle('DECRYPT_STRING', (_e, cipherBase64: string) => {
    try {
      const buffer = Buffer.from(cipherBase64, 'base64');
      if (safeStorage.isEncryptionAvailable()) {
        return safeStorage.decryptString(buffer);
      }
      return buffer.toString('utf-8');
    } catch {
      return '';
    }
  });

  // Send message to companion browser extension
  ipcMain.on('SEND_TO_EXTENSION', (_e, data) => {
    broadcastToExtension(data);
  });
}

app.on('will-quit', () => {
  unregisterGlobalShortcuts();
  stopWebSocketBridge();
});
