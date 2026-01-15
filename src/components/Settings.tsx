import { useState } from 'react';
import { AppSettings } from '../types';

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  onReset: () => Promise<void>;
}

export function Settings({ settings, onUpdateSettings, onReset }: SettingsProps) {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdateSettings(localSettings);
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      await onReset();
      setShowResetConfirm(false);
      alert('Settings reset to defaults');
    } catch (error) {
      alert('Failed to reset settings');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Settings</h2>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Reset Settings?</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to reset all settings to their default values?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Preferred Units */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Units
          </label>
          <select
            value={localSettings.preferredUnits}
            onChange={(e) => setLocalSettings({
              ...localSettings,
              preferredUnits: e.target.value as 'metric' | 'imperial'
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="metric">Metric (cm, kg, °C)</option>
            <option value="imperial">Imperial (inches, lbs, °F)</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Default unit system for new entries
          </p>
        </div>

        {/* Theme */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Theme
          </label>
          <select
            value={localSettings.theme}
            onChange={(e) => setLocalSettings({
              ...localSettings,
              theme: e.target.value as 'light' | 'dark' | 'auto'
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto (System)</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Choose your preferred color scheme
          </p>
        </div>

        {/* Date Format */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Format
          </label>
          <select
            value={localSettings.dateFormat}
            onChange={(e) => setLocalSettings({
              ...localSettings,
              dateFormat: e.target.value
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="dd/MM/yyyy">DD/MM/YYYY (15/01/2026)</option>
            <option value="MM/dd/yyyy">MM/DD/YYYY (01/15/2026)</option>
            <option value="yyyy-MM-dd">YYYY-MM-DD (2026-01-15)</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            How dates are displayed throughout the app
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-sky-500 text-white py-3 rounded-lg font-medium hover:bg-sky-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">About</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>App Name:</span>
            <span className="font-medium">Fishing Diary</span>
          </div>
          <div className="flex justify-between">
            <span>Version:</span>
            <span className="font-medium">1.0.0 (MVP)</span>
          </div>
          <div className="flex justify-between">
            <span>Storage:</span>
            <span className="font-medium">Local (IndexedDB)</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            All your data is stored locally on your device. No data is sent to any server.
            This is a Progressive Web App that works offline.
          </p>
        </div>
      </div>

      {/* Installation Instructions for iOS */}
      <div className="bg-sky-50 rounded-lg p-6 border border-sky-100">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Install on iPhone</h3>
        <ol className="space-y-2 text-sm text-gray-600">
          <li>1. Open this page in Safari</li>
          <li>2. Tap the Share button (square with arrow)</li>
          <li>3. Scroll down and tap "Add to Home Screen"</li>
          <li>4. Tap "Add" to install</li>
        </ol>
        <p className="mt-3 text-xs text-gray-500">
          The app will appear on your home screen like a native app and work offline.
        </p>
      </div>
    </div>
  );
}
