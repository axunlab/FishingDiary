import { FishingEntry, AppSettings } from '../types';
import * as entryRepository from '../repositories/entryRepository';
import * as settingsRepository from '../repositories/settingsRepository';

// Export data format
export interface ExportData {
  version: string;
  exportedAt: string;
  data: {
    entries: SerializedEntry[];
    settings: AppSettings;
  };
}

// Serialized entry with ISO date strings
interface SerializedEntry {
  id: string;
  createdAt: string;
  updatedAt: string;
  fishingDate: string;
  fishingTime: string;
  locationName: string;
  locationLabel?: string;
  catches: FishingEntry['catches'];
  gearUsed: string;
  fliesUsed: string;
  weather: FishingEntry['weather'];
  notes?: string;
}

// Validation result
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// Import result
export interface ImportResult {
  success: boolean;
  entriesCount: number;
  error?: string;
}

// Serialize a single entry (convert Date objects to ISO strings)
function serializeEntry(entry: FishingEntry): SerializedEntry {
  return {
    ...entry,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
    fishingDate: entry.fishingDate.toISOString(),
  };
}

// Deserialize a single entry (convert ISO strings to Date objects)
function deserializeEntry(serialized: SerializedEntry): FishingEntry {
  return {
    ...serialized,
    createdAt: new Date(serialized.createdAt),
    updatedAt: new Date(serialized.updatedAt),
    fishingDate: new Date(serialized.fishingDate),
  };
}

// Export all data
export async function exportData(): Promise<ExportData> {
  const entries = await entryRepository.getAllEntries();
  const settings = await settingsRepository.getSettings();

  const defaultSettings: AppSettings = {
    preferredUnits: 'metric',
    theme: 'auto',
    dateFormat: 'dd/MM/yyyy'
  };

  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    data: {
      entries: entries.map(serializeEntry),
      settings: settings || defaultSettings
    }
  };
}

// Download export as JSON file
export async function downloadExport(): Promise<void> {
  const data = await exportData();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  // Generate filename with current date
  const date = new Date().toISOString().split('T')[0];
  const filename = `fishing-diary-backup-${date}.json`;

  // Create temporary link and trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Parse import file
export async function parseImportFile(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        resolve(data);
      } catch {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

// Validate import data structure
export function validateImportData(data: unknown): ValidationResult {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Invalid data format'] };
  }

  const obj = data as Record<string, unknown>;

  // Check version field
  if (!obj.version) {
    errors.push('Missing version field');
  }

  // Check data object
  if (!obj.data || typeof obj.data !== 'object') {
    errors.push('Missing data field');
    return { valid: false, errors };
  }

  const dataObj = obj.data as Record<string, unknown>;

  // Check entries array
  if (!Array.isArray(dataObj.entries)) {
    errors.push('Missing or invalid entries array');
  } else {
    // Validate each entry
    dataObj.entries.forEach((entry: unknown, index: number) => {
      const entryErrors = validateEntry(entry, index);
      errors.push(...entryErrors);
    });
  }

  // Check settings object
  if (!dataObj.settings || typeof dataObj.settings !== 'object') {
    errors.push('Missing or invalid settings object');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Validate a single entry
function validateEntry(entry: unknown, index: number): string[] {
  const errors: string[] = [];
  const prefix = `Entry ${index + 1}`;

  if (!entry || typeof entry !== 'object') {
    errors.push(`${prefix}: Invalid entry format`);
    return errors;
  }

  const obj = entry as Record<string, unknown>;

  // Required fields
  if (!obj.id || typeof obj.id !== 'string') {
    errors.push(`${prefix}: Missing or invalid id`);
  }

  if (!obj.fishingDate || typeof obj.fishingDate !== 'string') {
    errors.push(`${prefix}: Missing or invalid fishingDate`);
  } else if (isNaN(Date.parse(obj.fishingDate))) {
    errors.push(`${prefix}: Invalid fishingDate format (must be ISO 8601)`);
  }

  if (!obj.locationName || typeof obj.locationName !== 'string') {
    errors.push(`${prefix}: Missing or invalid locationName`);
  }

  if (!Array.isArray(obj.catches)) {
    errors.push(`${prefix}: Missing or invalid catches array`);
  }

  // Validate date fields format
  if (obj.createdAt && typeof obj.createdAt === 'string' && isNaN(Date.parse(obj.createdAt))) {
    errors.push(`${prefix}: Invalid createdAt format`);
  }

  if (obj.updatedAt && typeof obj.updatedAt === 'string' && isNaN(Date.parse(obj.updatedAt))) {
    errors.push(`${prefix}: Invalid updatedAt format`);
  }

  return errors;
}

// Import data (replaces all existing data)
export async function importData(file: File): Promise<ImportResult> {
  try {
    // Parse file
    const rawData = await parseImportFile(file);

    // Validate structure
    const validation = validateImportData(rawData);
    if (!validation.valid) {
      return {
        success: false,
        entriesCount: 0,
        error: validation.errors.join('; ')
      };
    }

    const data = rawData as ExportData;

    // Clear existing data
    await entryRepository.clearAllEntries();

    // Deserialize and insert entries
    const entries = data.data.entries.map(deserializeEntry);
    if (entries.length > 0) {
      await entryRepository.bulkInsertEntries(entries);
    }

    // Replace settings
    await settingsRepository.replaceSettings(data.data.settings);

    return {
      success: true,
      entriesCount: entries.length
    };
  } catch (err) {
    console.error('Import error:', err);
    return {
      success: false,
      entriesCount: 0,
      error: err instanceof Error ? err.message : 'Unknown error during import'
    };
  }
}
