import { DriveAction, DriveState, DrivePermissionMode } from '@heyclicky/shared';
import { loadUserSettings, saveUserSettings } from './storage.js';

class DriveService {
  private state: DriveState = {
    isActive: false,
    permissionMode: 'always_allow', // Persistent permission default
    killSwitchTriggered: false,
  };
  private subscribers = new Set<(state: DriveState) => void>();

  constructor() {
    this.init();
    // Listen for Escape key locally
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.state.isActive) {
        this.haltKillSwitch('User pressed Escape key');
      }
    });
  }

  private async init() {
    const settings = await loadUserSettings();
    this.state.permissionMode = settings.drivePermissionMode || 'always_allow';
    this.notify();
  }

  public subscribe(cb: (state: DriveState) => void): () => void {
    this.subscribers.add(cb);
    cb({ ...this.state });
    return () => this.subscribers.delete(cb);
  }

  private notify() {
    const copy = { ...this.state };
    for (const sub of this.subscribers) {
      sub(copy);
    }
  }

  public async setPersistentPermission(mode: DrivePermissionMode) {
    this.state.permissionMode = mode;
    const settings = await loadUserSettings();
    settings.drivePermissionMode = mode;
    await saveUserSettings(settings);
    this.notify();
  }

  /**
   * Executes autonomous actions.
   * If permission is 'always_allow', starts immediately without showing repeat popups.
   */
  public async executeActions(
    actions: DriveAction[],
    actionDescription: string = 'Automating action...'
  ): Promise<{ success: boolean; stoppedByKillSwitch: boolean }> {
    if (this.state.permissionMode === 'denied') {
      return { success: false, stoppedByKillSwitch: false };
    }

    this.state.isActive = true;
    this.state.currentAction = actionDescription;
    this.state.killSwitchTriggered = false;
    this.notify();

    if (window.electronAPI) {
      const result = await window.electronAPI.executeDriveActions(actions);
      this.state.isActive = false;
      this.state.currentAction = undefined;
      this.notify();
      return result;
    }

    // In-browser preview simulation
    await new Promise((r) => setTimeout(r, 600));
    this.state.isActive = false;
    this.state.currentAction = undefined;
    this.notify();
    return { success: true, stoppedByKillSwitch: false };
  }

  /**
   * Instant Hard Kill-Switch
   */
  public haltKillSwitch(reason: string = 'User interaction detected') {
    if (this.state.isActive) {
      console.warn(`[Drive Kill Switch] Halted: ${reason}`);
      this.state.isActive = false;
      this.state.killSwitchTriggered = true;
      this.state.currentAction = undefined;
      if (window.electronAPI) {
        window.electronAPI.triggerDriveKillSwitch(reason);
      }
      this.notify();
    }
  }

  public getState(): DriveState {
    return { ...this.state };
  }
}

export const driveService = new DriveService();
