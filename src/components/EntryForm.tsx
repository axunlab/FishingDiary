import { useState } from 'react';
import { FishingEntry, FishingEntryFormData, Catch } from '../types';
import { getCurrentDate, getCurrentTime, formatDate } from '../services/dateService';

interface EntryFormProps {
  entry?: FishingEntry;
  onSubmit: (data: FishingEntryFormData) => Promise<void>;
  onCancel: () => void;
}

export function EntryForm({ entry, onSubmit, onCancel }: EntryFormProps) {
  const [formData, setFormData] = useState<FishingEntryFormData>({
    fishingDate: entry?.fishingDate || getCurrentDate(),
    fishingTime: entry?.fishingTime || getCurrentTime(),
    locationName: entry?.locationName || '',
    locationLabel: entry?.locationLabel || '',
    catches: entry?.catches || [{ species: '', size: undefined, weight: undefined, unit: 'metric' }],
    gearUsed: entry?.gearUsed || '',
    fliesUsed: entry?.fliesUsed || '',
    weather: entry?.weather || {
      temperature: undefined,
      conditions: '',
      windSpeed: undefined,
      windDirection: ''
    },
    notes: entry?.notes || ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update catch at index
  const updateCatch = (index: number, field: keyof Catch, value: any) => {
    const newCatches = [...formData.catches];
    newCatches[index] = { ...newCatches[index], [field]: value };
    setFormData({ ...formData, catches: newCatches });
  };

  // Add new catch
  const addCatch = () => {
    setFormData({
      ...formData,
      catches: [...formData.catches, { species: '', size: undefined, weight: undefined, unit: 'metric' }]
    });
  };

  // Remove catch at index
  const removeCatch = (index: number) => {
    if (formData.catches.length > 1) {
      const newCatches = formData.catches.filter((_, i) => i !== index);
      setFormData({ ...formData, catches: newCatches });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save entry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        {entry ? 'Edit Entry' : 'New Fishing Entry'}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Date & Time Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">When</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formatDate(formData.fishingDate, 'yyyy-MM-dd')}
              onChange={(e) => setFormData({ ...formData, fishingDate: new Date(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={formData.fishingTime}
              onChange={(e) => setFormData({ ...formData, fishingTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              required
            />
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Where</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.locationName}
            onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
            placeholder="e.g., Smith River - North Pool"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location Label (Optional)
          </label>
          <input
            type="text"
            value={formData.locationLabel}
            onChange={(e) => setFormData({ ...formData, locationLabel: e.target.value })}
            placeholder="Additional location details"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Catches Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-700">Catches</h3>
          <button
            type="button"
            onClick={addCatch}
            className="text-sky-500 hover:text-sky-700 text-sm font-medium"
          >
            + Add Catch
          </button>
        </div>

        {formData.catches.map((catch_, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Catch {index + 1}</span>
              {formData.catches.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCatch(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Species <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={catch_.species}
                onChange={(e) => updateCatch(index, 'species', e.target.value)}
                placeholder="e.g., Rainbow Trout"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size (optional)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={catch_.size || ''}
                  onChange={(e) => updateCatch(index, 'size', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="Length"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (optional)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={catch_.weight || ''}
                  onChange={(e) => updateCatch(index, 'weight', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="Weight"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select
                value={catch_.unit}
                onChange={(e) => updateCatch(index, 'unit', e.target.value as 'metric' | 'imperial')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="metric">Metric (cm, kg)</option>
                <option value="imperial">Imperial (in, lbs)</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Gear & Flies Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Gear & Flies</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gear Used <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.gearUsed}
            onChange={(e) => setFormData({ ...formData, gearUsed: e.target.value })}
            placeholder="e.g., 9ft 5wt rod, floating line"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Flies Used <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.fliesUsed}
            onChange={(e) => setFormData({ ...formData, fliesUsed: e.target.value })}
            placeholder="e.g., Elk Hair Caddis, Copper John"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      {/* Weather Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Weather</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Conditions <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.weather.conditions}
            onChange={(e) => setFormData({ ...formData, weather: { ...formData.weather, conditions: e.target.value } })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            required
          >
            <option value="">Select condition</option>
            <option value="Sunny">Sunny</option>
            <option value="Partly Cloudy">Partly Cloudy</option>
            <option value="Overcast">Overcast</option>
            <option value="Rainy">Rainy</option>
            <option value="Stormy">Stormy</option>
            <option value="Foggy">Foggy</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Temperature (optional)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.weather.temperature || ''}
              onChange={(e) => setFormData({
                ...formData,
                weather: { ...formData.weather, temperature: e.target.value ? parseFloat(e.target.value) : undefined }
              })}
              placeholder="°C or °F"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wind Speed (optional)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.weather.windSpeed || ''}
              onChange={(e) => setFormData({
                ...formData,
                weather: { ...formData.weather, windSpeed: e.target.value ? parseFloat(e.target.value) : undefined }
              })}
              placeholder="km/h or mph"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Wind Direction (optional)
          </label>
          <select
            value={formData.weather.windDirection}
            onChange={(e) => setFormData({ ...formData, weather: { ...formData.weather, windDirection: e.target.value } })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="">Select direction</option>
            <option value="N">North</option>
            <option value="NE">Northeast</option>
            <option value="E">East</option>
            <option value="SE">Southeast</option>
            <option value="S">South</option>
            <option value="SW">Southwest</option>
            <option value="W">West</option>
            <option value="NW">Northwest</option>
          </select>
        </div>
      </div>

      {/* Notes Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes (optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes about the trip..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        />
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-sky-500 text-white py-3 rounded-lg font-medium hover:bg-sky-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Saving...' : entry ? 'Update Entry' : 'Save Entry'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
