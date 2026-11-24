"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGlobalShortcuts = registerGlobalShortcuts;
exports.unregisterGlobalShortcuts = unregisterGlobalShortcuts;
const electron_1 = require("electron");
let currentShortcut = 'CommandOrControl+Alt';
let lastTapTime = 0;
function registerGlobalShortcuts(window, shortcut = 'CommandOrControl+Alt', onTrigger) {
    try {
        electron_1.globalShortcut.unregisterAll();
        currentShortcut = shortcut;
        const registered = electron_1.globalShortcut.register(shortcut, () => {
            const now = Date.now();
            const isDoubleTap = now - lastTapTime < 350;
            lastTapTime = now;
            onTrigger(isDoubleTap);
        });
        if (!registered) {
            console.warn(`[Shortcuts] Failed to register global shortcut: ${shortcut}`);
        }
        else {
            console.log(`[Shortcuts] Registered global push-to-talk: ${shortcut}`);
        }
    }
    catch (err) {
        console.error('[Shortcuts] Error registering shortcuts:', err);
    }
}
function unregisterGlobalShortcuts() {
    electron_1.globalShortcut.unregisterAll();
}
