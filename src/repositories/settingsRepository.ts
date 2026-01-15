import { db } from '../services/database';
import { AppSettings } from '../types';

const SETTINGS_KEY = 'appSettings';

// Get app settings
export async function getSettings(): Promise<AppSettings | undefined> {
  const result = await db.settings.get(SETTINGS_KEY);
  return result?.value;
}

// Update app settings
export async function updateSettings(settings: Partial<AppSettings>): Promise<void> {
  const currentSettings = await getSettings();

  if (currentSettings) {
    const updatedSettings: AppSettings = {
      ...currentSettings,
      ...settings
    };

    await db.settings.put({ key: SETTINGS_KEY, value: updatedSettings });
  }
}

// Reset settings to defaults
export async function resetSettings(): Promise<void> {
  const defaultSettings: AppSettings = {
    preferredUnits: 'metric',
    theme: 'auto',
    dateFormat: 'DD/MM/YYYY'
  };

  await db.settings.put({ key: SETTINGS_KEY, value: defaultSettings });
}
