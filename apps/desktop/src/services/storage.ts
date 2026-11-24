import { UserSettings, DEFAULT_SETTINGS } from '@heyclicky/shared';

const SETTINGS_KEY = 'heyclicky_user_settings_v1';

export async function loadUserSettings(): Promise<UserSettings> {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);

    // If API key is encrypted, decrypt it
    if (parsed.encryptedApiKey && window.electronAPI) {
      parsed.geminiApiKey = await window.electronAPI.decryptString(parsed.encryptedApiKey);
    }

    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (err) {
    console.error('Failed to load user settings:', err);
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveUserSettings(settings: UserSettings): Promise<void> {
  try {
    const toSave: any = { ...settings };
    if (settings.geminiApiKey && window.electronAPI) {
      toSave.encryptedApiKey = await window.electronAPI.encryptString(settings.geminiApiKey);
      toSave.geminiApiKey = ''; // Don't store in plain text
    }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(toSave));
  } catch (err) {
    console.error('Failed to save user settings:', err);
  }
}
