import { globalShortcut, BrowserWindow, app } from 'electron';
import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import fs from 'fs';
import { triggerKillSwitch } from './input-injector.js';

let hookProcess: ChildProcess | null = null;
let lastTapTime = 0;
let isHookActive = false;

export function getHookStatus(): { active: boolean; type: string } {
  return {
    active: isHookActive,
    type: isHookActive ? 'Low-Level WH_KEYBOARD_LL (Ctrl+Alt)' : 'GlobalShortcut (Ctrl+Alt+Space)',
  };
}

export function registerGlobalShortcuts(
  window: BrowserWindow | null,
  fallbackShortcut: string = 'CommandOrControl+Alt+Space',
  onTrigger: (isDoubleTap: boolean) => void
) {
  // 1. Try launching low-level C# keyboard hook for genuine push-to-talk (Ctrl+Alt)
  startLowLevelKeyboardHook(window);

  // 2. Register globalShortcut fallback (Ctrl+Alt+Space)
  try {
    globalShortcut.unregisterAll();
    const registered = globalShortcut.register(fallbackShortcut, () => {
      const now = Date.now();
      const isDoubleTap = now - lastTapTime < 350;
      lastTapTime = now;
      console.log(`[HOOK] GlobalShortcut ${fallbackShortcut} fired (isDoubleTap=${isDoubleTap})`);
      onTrigger(isDoubleTap);
    });

    if (registered) {
      console.log(`[Shortcuts] Registered fallback global shortcut: ${fallbackShortcut}`);
    } else {
      console.warn(`[Shortcuts] Could not register global shortcut: ${fallbackShortcut}`);
    }
  } catch (err) {
    console.error('[Shortcuts] Error registering fallback global shortcut:', err);
  }
}

function findHookExecutable(): string | null {
  // In development: apps/desktop/native/bin/KeyboardHook.exe
  const devPath = path.join(__dirname, '../../native/bin/KeyboardHook.exe');
  if (fs.existsSync(devPath)) return devPath;

  // In packaged app: resources/native/KeyboardHook.exe
  if (app.isPackaged) {
    const prodPath = path.join(process.resourcesPath, 'native/KeyboardHook.exe');
    if (fs.existsSync(prodPath)) return prodPath;

    const altProdPath = path.join(process.resourcesPath, 'app.asar.unpacked/native/bin/KeyboardHook.exe');
    if (fs.existsSync(altProdPath)) return altProdPath;
  }

  // Local fallback path relative to cwd
  const cwdPath = path.resolve(process.cwd(), 'native/bin/KeyboardHook.exe');
  if (fs.existsSync(cwdPath)) return cwdPath;

  return null;
}

function startLowLevelKeyboardHook(window: BrowserWindow | null) {
  const hookExe = findHookExecutable();
  if (!hookExe) {
    console.warn('[Shortcuts] KeyboardHook.exe not found. Falling back to globalShortcut.');
    return;
  }

  try {
    console.log(`[Shortcuts] Spawning low-level hook from: ${hookExe}`);
    hookProcess = spawn(hookExe, [], {
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    });

    let buffer = '';

    hookProcess.stdout?.on('data', (data: Buffer) => {
      buffer += data.toString();
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        if (trimmed.startsWith('[HOOK_READY]')) {
          isHookActive = true;
          console.log('[HOOK] Low-level WH_KEYBOARD_LL hook active and monitoring Ctrl+Alt');
        } else if (trimmed === 'CTRL_ALT_DOWN') {
          console.log('[HOOK] CTRL+ALT DOWN');
          window?.webContents.send('TALK_START');
        } else if (trimmed === 'CTRL_ALT_UP') {
          console.log('[HOOK] CTRL+ALT UP');
          window?.webContents.send('TALK_STOP');
        } else if (trimmed === 'ESCAPE_KILL_SWITCH') {
          console.log('[HOOK] ESCAPE_KILL_SWITCH triggered');
          triggerKillSwitch('Escape key pressed via low-level hook');
          window?.webContents.send('DRIVE_KILL_SWITCH');
        } else if (trimmed === 'CTRL_ALT_SPACE') {
          console.log('[HOOK] CTRL+ALT+SPACE detected via low-level hook');
          window?.webContents.send('SHORTCUT_TRIGGERED', { isDoubleTap: false });
        }
      }
    });

    hookProcess.stderr?.on('data', (errData: Buffer) => {
      console.warn(`[Shortcuts Hook Stderr] ${errData.toString().trim()}`);
    });

    hookProcess.on('exit', (code) => {
      console.log(`[Shortcuts] KeyboardHook process exited with code ${code}`);
      isHookActive = false;
      hookProcess = null;
    });

    hookProcess.on('error', (err) => {
      console.error('[Shortcuts] Failed to spawn KeyboardHook process:', err);
      isHookActive = false;
      hookProcess = null;
    });
  } catch (err) {
    console.error('[Shortcuts] Exception while starting low-level hook:', err);
  }
}

export function unregisterGlobalShortcuts() {
  globalShortcut.unregisterAll();
  if (hookProcess) {
    try {
      hookProcess.kill();
    } catch {
      // ignore
    }
    hookProcess = null;
    isHookActive = false;
  }
}
