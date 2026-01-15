import { useState, useEffect, useCallback } from 'react';
import { AppSettings } from '../types';
import * as settingsRepository from '../repositories/settingsRepository';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>({
    preferredUnits: 'metric',
    theme: 'auto',
    dateFormat: 'dd/MM/yyyy'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsRepository.getSettings();
      if (data) {
        setSettings(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  // Update settings
  const updateSettings = useCallback(async (newSettings: Partial<AppSettings>) => {
    try {
      await settingsRepository.updateSettings(newSettings);
      setSettings(prev => ({ ...prev, ...newSettings }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update settings';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Reset settings to defaults
  const resetSettings = useCallback(async () => {
    try {
      await settingsRepository.resetSettings();
      await loadSettings();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset settings';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [loadSettings]);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    loading,
    error,
    updateSettings,
    resetSettings,
    refresh: loadSettings
  };
}
