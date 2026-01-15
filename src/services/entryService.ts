import { v4 as uuidv4 } from 'uuid';
import { FishingEntry, FishingEntryFormData } from '../types';
import * as entryRepository from '../repositories/entryRepository';
import { validateFishingEntry } from './validationService';

// Create a new fishing entry
export async function createFishingEntry(formData: FishingEntryFormData): Promise<FishingEntry> {
  // Validate form data
  const validation = validateFishingEntry(formData);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
  }

  // Create entry object
  const entry: FishingEntry = {
    id: uuidv4(),
    ...formData,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Save to database
  await entryRepository.createEntry(entry);

  return entry;
}

// Get entry by ID
export async function getFishingEntry(id: string): Promise<FishingEntry | undefined> {
  return await entryRepository.getEntryById(id);
}

// Get all entries
export async function getAllFishingEntries() {
  return await entryRepository.getAllEntries();
}

// Update an existing entry
export async function updateFishingEntry(
  id: string,
  formData: FishingEntryFormData
): Promise<void> {
  // Validate form data
  const validation = validateFishingEntry(formData);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
  }

  // Update entry
  await entryRepository.updateEntry(id, {
    ...formData,
    updatedAt: new Date()
  });
}

// Delete an entry
export async function deleteFishingEntry(id: string): Promise<void> {
  await entryRepository.deleteEntry(id);
}

// Get recent entries
export async function getRecentFishingEntries(limit: number = 10) {
  return await entryRepository.getRecentEntries(limit);
}
