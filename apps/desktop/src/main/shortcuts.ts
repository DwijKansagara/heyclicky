import { globalShortcut, BrowserWindow } from 'electron';

let currentShortcut = 'CommandOrControl+Alt';
let lastTapTime = 0;

export function registerGlobalShortcuts(
  window: BrowserWindow,
  shortcut: string = 'CommandOrControl+Alt',
  onTrigger: (isDoubleTap: boolean) => void
) {
  try {
    globalShortcut.unregisterAll();
    currentShortcut = shortcut;

    const registered = globalShortcut.register(shortcut, () => {
      const now = Date.now();
      const isDoubleTap = now - lastTapTime < 350;
      lastTapTime = now;
      onTrigger(isDoubleTap);
    });

    if (!registered) {
      console.warn(`[Shortcuts] Failed to register global shortcut: ${shortcut}`);
    } else {
      console.log(`[Shortcuts] Registered global push-to-talk: ${shortcut}`);
    }
  } catch (err) {
    console.error('[Shortcuts] Error registering shortcuts:', err);
  }
}

export function unregisterGlobalShortcuts() {
  globalShortcut.unregisterAll();
}
