import * as settingsRepository from '../repositories/settingsRepository';

// Request persistent storage from the browser.
// Returns true if granted, false if denied, null if API is not supported.
// Writes result to settings so the UI can reflect it without re-querying.
// Note: On iOS Safari, persist() requires the PWA to be installed as a Home Screen app
// and even then may silently return false on older iOS versions.
export async function requestPersistentStorage(): Promise<boolean | null> {
  if (!navigator.storage?.persist) {
    return null;
  }

  try {
    const granted = await navigator.storage.persist();
    await settingsRepository.updateSettings({ storageIsPersistent: granted });
    return granted;
  } catch {
    return null;
  }
}

// Check current persistence status without requesting or writing to settings.
// Returns true if already persistent, false if not, null if API unsupported.
export async function checkStoragePersistence(): Promise<boolean | null> {
  if (!navigator.storage?.persisted) {
    return null;
  }

  try {
    return await navigator.storage.persisted();
  } catch {
    return null;
  }
}

// Returns true if a backup is overdue.
// - thresholdDays === 0: reminders disabled, always returns false
// - lastBackupAt undefined: never backed up, always returns true
// - otherwise: returns true if days since last backup >= thresholdDays
export function isBackupOverdue(
  lastBackupAt: string | undefined,
  thresholdDays: number
): boolean {
  if (thresholdDays === 0) return false;
  if (!lastBackupAt) return true;

  const daysSince = (Date.now() - Date.parse(lastBackupAt)) / 86_400_000;
  return daysSince >= thresholdDays;
}

// Records the current timestamp as the last backup time in settings.
// Call this immediately after a successful export/download.
export async function markBackupComplete(): Promise<void> {
  await settingsRepository.updateSettings({ lastBackupAt: new Date().toISOString() });
}
