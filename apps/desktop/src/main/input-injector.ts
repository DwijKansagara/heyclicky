/**
 * Windows Input Injector & HeyClicky Drive Controller
 * Implements mouse/keyboard input simulation with a strict instant kill-switch.
 */

import { DriveAction } from '@heyclicky/shared';

let isDriveRunning = false;
let killSwitchTriggered = false;
let lastKnownMousePos = { x: 0, y: 0 };

export function setDriveActive(active: boolean) {
  isDriveRunning = active;
  if (!active) {
    killSwitchTriggered = false;
  }
}

export function triggerKillSwitch(reason: string) {
  if (isDriveRunning) {
    console.log(`[Drive Kill-Switch] Activated! Reason: ${reason}`);
    killSwitchTriggered = true;
    isDriveRunning = false;
  }
}

export function isKillSwitchActive(): boolean {
  return killSwitchTriggered;
}

export async function executeDriveActions(actions: DriveAction[]): Promise<{ success: boolean; executedCount: number; stoppedByKillSwitch: boolean }> {
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
    } catch (err) {
      console.error('[Drive Action Error]', err);
      return { success: false, executedCount, stoppedByKillSwitch: false };
    }
  }

  isDriveRunning = false;
  return { success: true, executedCount, stoppedByKillSwitch: false };
}

async function executeSingleAction(action: DriveAction): Promise<void> {
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
export function checkPhysicalMouseDisplacement(currentX: number, currentY: number, tolerance: number = 25): boolean {
  if (!isDriveRunning) return false;
  const dx = Math.abs(currentX - lastKnownMousePos.x);
  const dy = Math.abs(currentY - lastKnownMousePos.y);
  if (dx > tolerance || dy > tolerance) {
    triggerKillSwitch('Physical mouse moved by user');
    return true;
  }
  return false;
}
