"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const api = {
    captureScreens: () => electron_1.ipcRenderer.invoke('CAPTURE_SCREENS'),
    resizeIsland: (width, height) => electron_1.ipcRenderer.send('RESIZE_ISLAND', { width, height }),
    updateCursorPos: (x, y) => electron_1.ipcRenderer.send('UPDATE_CURSOR_POS', { x, y }),
    setOverlayClickThrough: (ignore) => electron_1.ipcRenderer.send('SET_OVERLAY_CLICK_THROUGH', ignore),
    executeDriveActions: (actions) => electron_1.ipcRenderer.invoke('EXECUTE_DRIVE_ACTIONS', actions),
    triggerDriveKillSwitch: (reason) => electron_1.ipcRenderer.send('TRIGGER_DRIVE_KILL_SWITCH', reason),
    openSidebar: (tab) => electron_1.ipcRenderer.send('OPEN_SIDEBAR', tab),
    encryptString: (plainText) => electron_1.ipcRenderer.invoke('ENCRYPT_STRING', plainText),
    decryptString: (cipherBase64) => electron_1.ipcRenderer.invoke('DECRYPT_STRING', cipherBase64),
    sendToExtension: (data) => electron_1.ipcRenderer.send('SEND_TO_EXTENSION', data),
    onShortcutTriggered: (callback) => {
        const sub = (_e, data) => callback(data);
        electron_1.ipcRenderer.on('SHORTCUT_TRIGGERED', sub);
        return () => electron_1.ipcRenderer.removeListener('SHORTCUT_TRIGGERED', sub);
    },
    onExtensionMessage: (callback) => {
        const sub = (_e, data) => callback(data);
        electron_1.ipcRenderer.on('EXTENSION_MESSAGE', sub);
        return () => electron_1.ipcRenderer.removeListener('EXTENSION_MESSAGE', sub);
    },
};
electron_1.contextBridge.exposeInMainWorld('electronAPI', api);
