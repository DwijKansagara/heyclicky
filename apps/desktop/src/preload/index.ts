import { contextBridge, ipcRenderer } from 'electron';

export interface ElectronAPI {
  captureScreens: () => Promise<any[]>;
  resizeIsland: (width: number, height: number) => void;
  updateCursorPos: (x: number, y: number) => void;
  setOverlayClickThrough: (ignore: boolean) => void;
  executeDriveActions: (actions: any[]) => Promise<any>;
  triggerDriveKillSwitch: (reason: string) => void;
  openSidebar: (tab?: string) => void;
  encryptString: (plainText: string) => Promise<string>;
  decryptString: (cipherBase64: string) => Promise<string>;
  sendToExtension: (data: any) => void;
  onShortcutTriggered: (callback: (data: { isDoubleTap: boolean }) => void) => () => void;
  onExtensionMessage: (callback: (data: any) => void) => () => void;
}

const api: ElectronAPI = {
  captureScreens: () => ipcRenderer.invoke('CAPTURE_SCREENS'),
  resizeIsland: (width, height) => ipcRenderer.send('RESIZE_ISLAND', { width, height }),
  updateCursorPos: (x, y) => ipcRenderer.send('UPDATE_CURSOR_POS', { x, y }),
  setOverlayClickThrough: (ignore) => ipcRenderer.send('SET_OVERLAY_CLICK_THROUGH', ignore),
  executeDriveActions: (actions) => ipcRenderer.invoke('EXECUTE_DRIVE_ACTIONS', actions),
  triggerDriveKillSwitch: (reason) => ipcRenderer.send('TRIGGER_DRIVE_KILL_SWITCH', reason),
  openSidebar: (tab) => ipcRenderer.send('OPEN_SIDEBAR', tab),
  encryptString: (plainText) => ipcRenderer.invoke('ENCRYPT_STRING', plainText),
  decryptString: (cipherBase64) => ipcRenderer.invoke('DECRYPT_STRING', cipherBase64),
  sendToExtension: (data) => ipcRenderer.send('SEND_TO_EXTENSION', data),
  onShortcutTriggered: (callback) => {
    const sub = (_e: any, data: any) => callback(data);
    ipcRenderer.on('SHORTCUT_TRIGGERED', sub);
    return () => ipcRenderer.removeListener('SHORTCUT_TRIGGERED', sub);
  },
  onExtensionMessage: (callback) => {
    const sub = (_e: any, data: any) => callback(data);
    ipcRenderer.on('EXTENSION_MESSAGE', sub);
    return () => ipcRenderer.removeListener('EXTENSION_MESSAGE', sub);
  },
};

contextBridge.exposeInMainWorld('electronAPI', api);
