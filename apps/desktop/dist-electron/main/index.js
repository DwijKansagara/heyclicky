"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const floating_island_js_1 = require("./floating-island.js");
const overlay_window_js_1 = require("./overlay-window.js");
const screen_capture_js_1 = require("./screen-capture.js");
const shortcuts_js_1 = require("./shortcuts.js");
const ws_bridge_js_1 = require("./ws-bridge.js");
const input_injector_js_1 = require("./input-injector.js");
let tray = null;
let islandWin = null;
let overlayWin = null;
let sidebarWin = null;
const isDev = process.env.NODE_ENV === 'development' || !electron_1.app.isPackaged;
const rendererUrl = isDev
    ? 'http://localhost:5173'
    : path_1.default.join(__dirname, '../../dist-renderer/index.html');
const preloadPath = path_1.default.join(__dirname, '../preload/index.js');
// Enforce single instance
const gotTheLock = electron_1.app.requestSingleInstanceLock();
if (!gotTheLock) {
    electron_1.app.quit();
}
electron_1.app.whenReady().then(() => {
    setupTray();
    overlayWin = (0, overlay_window_js_1.createOverlayWindow)(preloadPath, rendererUrl);
    islandWin = (0, floating_island_js_1.createFloatingIslandWindow)(preloadPath, rendererUrl);
    // Global Push-To-Talk shortcut (Default Ctrl+Alt)
    (0, shortcuts_js_1.registerGlobalShortcuts)(islandWin, 'CommandOrControl+Alt', (isDoubleTap) => {
        islandWin?.webContents.send('SHORTCUT_TRIGGERED', { isDoubleTap });
        overlayWin?.webContents.send('SHORTCUT_TRIGGERED', { isDoubleTap });
    });
    // Start WebSocket bridge for Companion extension
    (0, ws_bridge_js_1.startWebSocketBridge)((clientMsg) => {
        islandWin?.webContents.send('EXTENSION_MESSAGE', clientMsg);
        overlayWin?.webContents.send('EXTENSION_MESSAGE', clientMsg);
    });
    setupIpcHandlers();
});
function setupTray() {
    // Simple clean icon for system tray
    const icon = electron_1.nativeImage.createEmpty();
    tray = new electron_1.Tray(icon);
    tray.setToolTip('HeyClicky for Windows (100% Free & Open Source)');
    const contextMenu = electron_1.Menu.buildFromTemplate([
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
            checked: electron_1.app.getLoginItemSettings().openAtLogin,
            click: (item) => {
                electron_1.app.setLoginItemSettings({ openAtLogin: item.checked });
            },
        },
        { type: 'separator' },
        {
            label: 'Quit HeyClicky',
            click: () => {
                electron_1.app.quit();
            },
        },
    ]);
    tray.setContextMenu(contextMenu);
}
function openSidebarWindow(initialTab = 'chat') {
    if (sidebarWin && !sidebarWin.isDestroyed()) {
        sidebarWin.show();
        sidebarWin.focus();
        sidebarWin.webContents.send('NAVIGATE_TAB', initialTab);
        return;
    }
    const isDark = electron_1.nativeTheme.shouldUseDarkColors;
    sidebarWin = new electron_1.BrowserWindow({
        width: 980,
        height: 700,
        minWidth: 720,
        minHeight: 520,
        frame: false,
        transparent: true,
        hasShadow: true,
        skipTaskbar: false,
        title: 'HeyClicky for Windows',
        backgroundColor: '#00000000',
        webPreferences: {
            preload: preloadPath,
            nodeIntegration: false,
            contextIsolation: true,
        },
    });
    const url = isDev ? `${rendererUrl}#sidebar` : rendererUrl;
    if (isDev) {
        sidebarWin.loadURL(`${rendererUrl}#sidebar?tab=${initialTab}`);
    }
    else {
        sidebarWin.loadFile(rendererUrl, { hash: `sidebar?tab=${initialTab}` });
    }
    sidebarWin.on('closed', () => {
        sidebarWin = null;
    });
}
function setupIpcHandlers() {
    // Screen Capture
    electron_1.ipcMain.handle('CAPTURE_SCREENS', async () => {
        return await (0, screen_capture_js_1.captureAllScreens)();
    });
    // Floating Island Resizing & Display tracking
    electron_1.ipcMain.on('RESIZE_ISLAND', (_e, { width, height }) => {
        (0, floating_island_js_1.resizeIsland)(width, height);
    });
    electron_1.ipcMain.on('UPDATE_CURSOR_POS', (_e, { x, y }) => {
        (0, floating_island_js_1.moveToNearestDisplay)(x, y);
        // Check if user physically touched mouse while Drive is active
        (0, input_injector_js_1.checkPhysicalMouseDisplacement)(x, y);
    });
    // Overlay click-through toggle (for when user draws ink or clicks 3D popups)
    electron_1.ipcMain.on('SET_OVERLAY_CLICK_THROUGH', (_e, ignore) => {
        (0, overlay_window_js_1.setOverlayClickThrough)(ignore);
    });
    // Drive Computer Control execution & Kill Switch
    electron_1.ipcMain.handle('EXECUTE_DRIVE_ACTIONS', async (_e, actions) => {
        return await (0, input_injector_js_1.executeDriveActions)(actions);
    });
    electron_1.ipcMain.on('TRIGGER_DRIVE_KILL_SWITCH', (_e, reason) => {
        (0, input_injector_js_1.triggerKillSwitch)(reason);
    });
    // Window management
    electron_1.ipcMain.handle('GET_SYSTEM_THEME', () => {
        return electron_1.nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
    });
    electron_1.ipcMain.on('MINIMIZE_WINDOW', (event) => {
        const win = electron_1.BrowserWindow.fromWebContents(event.sender);
        win?.minimize();
    });
    electron_1.ipcMain.on('MAXIMIZE_WINDOW', (event) => {
        const win = electron_1.BrowserWindow.fromWebContents(event.sender);
        if (!win)
            return;
        if (win.isMaximized()) {
            win.unmaximize();
        }
        else {
            win.maximize();
        }
    });
    electron_1.ipcMain.on('CLOSE_SIDEBAR', () => {
        sidebarWin?.close();
    });
    // Encrypted Secure Storage using DPAPI / electron.safeStorage
    electron_1.ipcMain.handle('GET_HOOK_STATUS', () => {
        return (0, shortcuts_js_1.getHookStatus)();
    });
    electron_1.ipcMain.handle('ENCRYPT_STRING', (_e, plainText) => {
        if (electron_1.safeStorage.isEncryptionAvailable()) {
            const encrypted = electron_1.safeStorage.encryptString(plainText);
            return encrypted.toString('base64');
        }
        // Fallback if DPAPI not available in current container
        return Buffer.from(plainText).toString('base64');
    });
    electron_1.ipcMain.handle('DECRYPT_STRING', (_e, cipherBase64) => {
        try {
            const buffer = Buffer.from(cipherBase64, 'base64');
            if (electron_1.safeStorage.isEncryptionAvailable()) {
                return electron_1.safeStorage.decryptString(buffer);
            }
            return buffer.toString('utf-8');
        }
        catch {
            return '';
        }
    });
    // Send message to companion browser extension
    electron_1.ipcMain.on('SEND_TO_EXTENSION', (_e, data) => {
        (0, ws_bridge_js_1.broadcastToExtension)(data);
    });
}
electron_1.app.on('will-quit', () => {
    (0, shortcuts_js_1.unregisterGlobalShortcuts)();
    (0, ws_bridge_js_1.stopWebSocketBridge)();
});
