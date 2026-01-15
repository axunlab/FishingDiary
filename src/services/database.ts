import Dexie, { Table } from 'dexie';
import { FishingEntry, AppSettings } from '../types';

// Database class extending Dexie
export class FishingDiaryDB extends Dexie {
  // Declare tables
  entries!: Table<FishingEntry, string>;
  settings!: Table<{ key: string; value: AppSettings }, string>;

  constructor() {
    super('fishingDiary');

    // Define database schema
    this.version(1).stores({
      entries: 'id, fishingDate, locationName, createdAt',
      settings: 'key'
    });
  }
}

// Create database instance
export const db = new FishingDiaryDB();

// Initialize default settings
export async function initializeDefaultSettings(): Promise<void> {
  const existingSettings = await db.settings.get('appSettings');

  if (!existingSettings) {
    const defaultSettings: AppSettings = {
      preferredUnits: 'metric',
      theme: 'auto',
      dateFormat: 'DD/MM/YYYY'
    };

    await db.settings.put({ key: 'appSettings', value: defaultSettings });
  }
}

// Initialize database with default data
export async function initializeDatabase(): Promise<void> {
  await initializeDefaultSettings();
}
