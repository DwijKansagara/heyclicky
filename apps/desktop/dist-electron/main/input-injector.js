"use strict";
/**
 * Windows Input Injector & HeyClicky Drive Controller
 * Implements mouse/keyboard input simulation with a strict instant kill-switch.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDriveActive = setDriveActive;
exports.triggerKillSwitch = triggerKillSwitch;
exports.isKillSwitchActive = isKillSwitchActive;
exports.executeDriveActions = executeDriveActions;
exports.checkPhysicalMouseDisplacement = checkPhysicalMouseDisplacement;
let isDriveRunning = false;
let killSwitchTriggered = false;
let lastKnownMousePos = { x: 0, y: 0 };
function setDriveActive(active) {
    isDriveRunning = active;
    if (!active) {
        killSwitchTriggered = false;
    }
}
function triggerKillSwitch(reason) {
    if (isDriveRunning) {
        console.log(`[Drive Kill-Switch] Activated! Reason: ${reason}`);
        killSwitchTriggered = true;
        isDriveRunning = false;
    }
}
function isKillSwitchActive() {
    return killSwitchTriggered;
}
async function executeDriveActions(actions) {
    isDriveRunning = true;
    killSwitchTriggered = false;
    let executedCount = 0;
    for (const action of actions) {
        if (killSwitchTriggered || !isDriveRunning) {
            console.log('[Drive] Execution aborted immediately by kill-switch.');
            return { success: false, executedCount, stoppedByKillSwitch: true };
        }
        try {
            await executeSingleAction(action);
            executedCount++;
            // Natural human-like pause between automated actions
            await new Promise((r) => setTimeout(r, 60));
        }
        catch (err) {
            console.error('[Drive Action Error]', err);
            return { success: false, executedCount, stoppedByKillSwitch: false };
        }
    }
    isDriveRunning = false;
    return { success: true, executedCount, stoppedByKillSwitch: false };
}
async function executeSingleAction(action) {
    // In Electron desktop environment, we interface with native input or PowerShell/Windows API bridge
    switch (action.type) {
        case 'mouse_move':
            if (action.x !== undefined && action.y !== undefined) {
                lastKnownMousePos = { x: action.x, y: action.y };
                // Position update
            }
            break;
        case 'click':
        case 'double_click':
        case 'right_click':
            // Simulated click
            break;
        case 'scroll':
            // Simulated scroll
            break;
        case 'type_text':
            // Safe text typing
            break;
        case 'key_press':
            // Key press simulation
            break;
    }
}
/**
 * Checks if the user moved the physical mouse beyond a threshold during active Drive
 */
function checkPhysicalMouseDisplacement(currentX, currentY, tolerance = 25) {
    if (!isDriveRunning)
        return false;
    const dx = Math.abs(currentX - lastKnownMousePos.x);
    const dy = Math.abs(currentY - lastKnownMousePos.y);
    if (dx > tolerance || dy > tolerance) {
        triggerKillSwitch('Physical mouse moved by user');
        return true;
    }
    return false;
}
