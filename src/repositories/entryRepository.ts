import { db } from '../services/database';
import { FishingEntry, EntryFilters, SortField, SortOrder } from '../types';

// Create a new fishing entry
export async function createEntry(entry: FishingEntry): Promise<string> {
  return await db.entries.add(entry);
}

// Get a fishing entry by ID
export async function getEntryById(id: string): Promise<FishingEntry | undefined> {
  return await db.entries.get(id);
}

// Get all fishing entries with optional sorting
export async function getAllEntries(
  sortField: SortField = 'fishingDate',
  sortOrder: SortOrder = 'desc'
): Promise<FishingEntry[]> {
  let collection = db.entries.orderBy(sortField);

  if (sortOrder === 'desc') {
    collection = collection.reverse();
  }

  return await collection.toArray();
}

// Update a fishing entry
export async function updateEntry(id: string, changes: Partial<FishingEntry>): Promise<number> {
  return await db.entries.update(id, {
    ...changes,
    updatedAt: new Date()
  });
}

// Delete a fishing entry
export async function deleteEntry(id: string): Promise<void> {
  await db.entries.delete(id);
}

// Search/filter entries
export async function searchEntries(filters: EntryFilters): Promise<FishingEntry[]> {
  let collection = db.entries.toCollection();

  // Apply location filter
  if (filters.locationName) {
    collection = collection.filter(entry =>
      entry.locationName.toLowerCase().includes(filters.locationName!.toLowerCase())
    );
  }

  // Apply species filter
  if (filters.species) {
    collection = collection.filter(entry =>
      entry.catches.some(c =>
        c.species.toLowerCase().includes(filters.species!.toLowerCase())
      )
    );
  }

  // Apply date range filters
  if (filters.dateFrom) {
    collection = collection.filter(entry =>
      entry.fishingDate >= filters.dateFrom!
    );
  }

  if (filters.dateTo) {
    collection = collection.filter(entry =>
      entry.fishingDate <= filters.dateTo!
    );
  }

  // Apply gear filter
  if (filters.gearUsed) {
    collection = collection.filter(entry =>
      entry.gearUsed.toLowerCase().includes(filters.gearUsed!.toLowerCase())
    );
  }

  // Apply flies filter
  if (filters.fliesUsed) {
    collection = collection.filter(entry =>
      entry.fliesUsed.toLowerCase().includes(filters.fliesUsed!.toLowerCase())
    );
  }

  return await collection.toArray();
}

// Get entries count
export async function getEntriesCount(): Promise<number> {
  return await db.entries.count();
}

// Get recent entries (last N entries)
export async function getRecentEntries(limit: number = 10): Promise<FishingEntry[]> {
  return await db.entries
    .orderBy('createdAt')
    .reverse()
    .limit(limit)
    .toArray();
}

// Clear all entries (for import)
export async function clearAllEntries(): Promise<void> {
  await db.entries.clear();
}

// Bulk insert entries (for import)
export async function bulkInsertEntries(entries: FishingEntry[]): Promise<void> {
  await db.entries.bulkAdd(entries);
}
