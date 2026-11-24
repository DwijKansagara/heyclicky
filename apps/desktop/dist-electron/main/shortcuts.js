"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHookStatus = getHookStatus;
exports.registerGlobalShortcuts = registerGlobalShortcuts;
exports.unregisterGlobalShortcuts = unregisterGlobalShortcuts;
const electron_1 = require("electron");
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const input_injector_js_1 = require("./input-injector.js");
let hookProcess = null;
let lastTapTime = 0;
let isHookActive = false;
function getHookStatus() {
    return {
        active: isHookActive,
        type: isHookActive ? 'Low-Level WH_KEYBOARD_LL (Ctrl+Alt)' : 'GlobalShortcut (Ctrl+Alt+Space)',
    };
}
function registerGlobalShortcuts(window, fallbackShortcut = 'CommandOrControl+Alt+Space', onTrigger) {
    // 1. Try launching low-level C# keyboard hook for genuine push-to-talk (Ctrl+Alt)
    startLowLevelKeyboardHook(window);
    // 2. Register globalShortcut fallback (Ctrl+Alt+Space)
    try {
        electron_1.globalShortcut.unregisterAll();
        const registered = electron_1.globalShortcut.register(fallbackShortcut, () => {
            const now = Date.now();
            const isDoubleTap = now - lastTapTime < 350;
            lastTapTime = now;
            console.log(`[HOOK] GlobalShortcut ${fallbackShortcut} fired (isDoubleTap=${isDoubleTap})`);
            onTrigger(isDoubleTap);
        });
        if (registered) {
            console.log(`[Shortcuts] Registered fallback global shortcut: ${fallbackShortcut}`);
        }
        else {
            console.warn(`[Shortcuts] Could not register global shortcut: ${fallbackShortcut}`);
        }
    }
    catch (err) {
        console.error('[Shortcuts] Error registering fallback global shortcut:', err);
    }
}
function findHookExecutable() {
    // In development: apps/desktop/native/bin/KeyboardHook.exe
    const devPath = path_1.default.join(__dirname, '../../native/bin/KeyboardHook.exe');
    if (fs_1.default.existsSync(devPath))
        return devPath;
    // In packaged app: resources/native/KeyboardHook.exe
    if (electron_1.app.isPackaged) {
        const prodPath = path_1.default.join(process.resourcesPath, 'native/KeyboardHook.exe');
        if (fs_1.default.existsSync(prodPath))
            return prodPath;
        const altProdPath = path_1.default.join(process.resourcesPath, 'app.asar.unpacked/native/bin/KeyboardHook.exe');
        if (fs_1.default.existsSync(altProdPath))
            return altProdPath;
    }
    // Local fallback path relative to cwd
    const cwdPath = path_1.default.resolve(process.cwd(), 'native/bin/KeyboardHook.exe');
    if (fs_1.default.existsSync(cwdPath))
        return cwdPath;
    return null;
}
function startLowLevelKeyboardHook(window) {
    const hookExe = findHookExecutable();
    if (!hookExe) {
        console.warn('[Shortcuts] KeyboardHook.exe not found. Falling back to globalShortcut.');
        return;
    }
    try {
        console.log(`[Shortcuts] Spawning low-level hook from: ${hookExe}`);
        hookProcess = (0, child_process_1.spawn)(hookExe, [], {
            stdio: ['ignore', 'pipe', 'pipe'],
            windowsHide: true,
        });
        let buffer = '';
        hookProcess.stdout?.on('data', (data) => {
            buffer += data.toString();
            const lines = buffer.split(/\r?\n/);
            buffer = lines.pop() || '';
            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed)
                    continue;
                if (trimmed.startsWith('[HOOK_READY]')) {
                    isHookActive = true;
                    console.log('[HOOK] Low-level WH_KEYBOARD_LL hook active and monitoring Ctrl+Alt');
                }
                else if (trimmed === 'CTRL_ALT_DOWN') {
                    console.log('[HOOK] CTRL+ALT DOWN');
                    window?.webContents.send('TALK_START');
                }
                else if (trimmed === 'CTRL_ALT_UP') {
                    console.log('[HOOK] CTRL+ALT UP');
                    window?.webContents.send('TALK_STOP');
                }
                else if (trimmed === 'ESCAPE_KILL_SWITCH') {
                    console.log('[HOOK] ESCAPE_KILL_SWITCH triggered');
                    (0, input_injector_js_1.triggerKillSwitch)('Escape key pressed via low-level hook');
                    window?.webContents.send('DRIVE_KILL_SWITCH');
                }
                else if (trimmed === 'CTRL_ALT_SPACE') {
                    console.log('[HOOK] CTRL+ALT+SPACE detected via low-level hook');
                    window?.webContents.send('SHORTCUT_TRIGGERED', { isDoubleTap: false });
                }
            }
        });
        hookProcess.stderr?.on('data', (errData) => {
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
    }
    catch (err) {
        console.error('[Shortcuts] Exception while starting low-level hook:', err);
    }
}
function unregisterGlobalShortcuts() {
    electron_1.globalShortcut.unregisterAll();
    if (hookProcess) {
        try {
            hookProcess.kill();
        }
        catch {
            // ignore
        }
        hookProcess = null;
        isHookActive = false;
    }
}
