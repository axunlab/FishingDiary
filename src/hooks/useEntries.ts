import { useState, useEffect, useCallback } from 'react';
import { FishingEntry, FishingEntryFormData } from '../types';
import * as entryService from '../services/entryService';

export function useEntries() {
  const [entries, setEntries] = useState<FishingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all entries
  const loadEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await entryService.getAllFishingEntries();
      setEntries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load entries');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new entry
  const createEntry = useCallback(async (formData: FishingEntryFormData) => {
    try {
      const newEntry = await entryService.createFishingEntry(formData);
      setEntries(prev => [newEntry, ...prev]);
      return newEntry;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create entry';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Update an existing entry
  const updateEntry = useCallback(async (id: string, formData: FishingEntryFormData) => {
    try {
      await entryService.updateFishingEntry(id, formData);
      await loadEntries(); // Reload to get updated data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update entry';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [loadEntries]);

  // Delete an entry
  const deleteEntry = useCallback(async (id: string) => {
    try {
      await entryService.deleteFishingEntry(id);
      setEntries(prev => prev.filter(entry => entry.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete entry';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Get a single entry by ID
  const getEntry = useCallback((id: string) => {
    return entries.find(entry => entry.id === id);
  }, [entries]);

  // Load entries on mount
  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  return {
    entries,
    loading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    getEntry,
    refresh: loadEntries
  };
}
