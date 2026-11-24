import { contextBridge, ipcRenderer } from 'electron';

export interface ElectronAPI {
  captureScreens: () => Promise<any[]>;
  resizeIsland: (width: number, height: number) => void;
  updateCursorPos: (x: number, y: number) => void;
  setOverlayClickThrough: (ignore: boolean) => void;
  executeDriveActions: (actions: any[]) => Promise<any>;
  triggerDriveKillSwitch: (reason: string) => void;
  openSidebar: (tab?: string) => void;
  closeSidebar: () => void;
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  getSystemTheme: () => Promise<'light' | 'dark'>;
  getHookStatus: () => Promise<{ active: boolean; type: string }>;
  encryptString: (plainText: string) => Promise<string>;
  decryptString: (cipherBase64: string) => Promise<string>;
  sendToExtension: (data: any) => void;
  onShortcutTriggered: (callback: (data: { isDoubleTap: boolean }) => void) => () => void;
  onTalkStart: (callback: () => void) => () => void;
  onTalkStop: (callback: () => void) => () => void;
  onDriveKillSwitch: (callback: () => void) => () => void;
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
  closeSidebar: () => ipcRenderer.send('CLOSE_SIDEBAR'),
  minimizeWindow: () => ipcRenderer.send('MINIMIZE_WINDOW'),
  maximizeWindow: () => ipcRenderer.send('MAXIMIZE_WINDOW'),
  getSystemTheme: () => ipcRenderer.invoke('GET_SYSTEM_THEME'),
  getHookStatus: () => ipcRenderer.invoke('GET_HOOK_STATUS'),
  encryptString: (plainText) => ipcRenderer.invoke('ENCRYPT_STRING', plainText),
  decryptString: (cipherBase64) => ipcRenderer.invoke('DECRYPT_STRING', cipherBase64),
  sendToExtension: (data) => ipcRenderer.send('SEND_TO_EXTENSION', data),
  onShortcutTriggered: (callback) => {
    const sub = (_e: any, data: any) => callback(data);
    ipcRenderer.on('SHORTCUT_TRIGGERED', sub);
    return () => ipcRenderer.removeListener('SHORTCUT_TRIGGERED', sub);
  },
  onTalkStart: (callback) => {
    const sub = () => callback();
    ipcRenderer.on('TALK_START', sub);
    return () => ipcRenderer.removeListener('TALK_START', sub);
  },
  onTalkStop: (callback) => {
    const sub = () => callback();
    ipcRenderer.on('TALK_STOP', sub);
    return () => ipcRenderer.removeListener('TALK_STOP', sub);
  },
  onDriveKillSwitch: (callback) => {
    const sub = () => callback();
    ipcRenderer.on('DRIVE_KILL_SWITCH', sub);
    return () => ipcRenderer.removeListener('DRIVE_KILL_SWITCH', sub);
  },
  onExtensionMessage: (callback) => {
    const sub = (_e: any, data: any) => callback(data);
    ipcRenderer.on('EXTENSION_MESSAGE', sub);
    return () => ipcRenderer.removeListener('EXTENSION_MESSAGE', sub);
  },
};

contextBridge.exposeInMainWorld('electronAPI', api);
