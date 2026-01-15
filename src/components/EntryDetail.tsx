import { useState } from 'react';
import { FishingEntry } from '../types';
import { formatDate } from '../services/dateService';

interface EntryDetailProps {
  entry: FishingEntry;
  onBack: () => void;
  onEdit: () => void;
  onDelete: (id: string) => Promise<void>;
}

export function EntryDetail({ entry, onBack, onEdit, onDelete }: EntryDetailProps) {
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(entry.id);
      onBack();
    } catch (error) {
      alert('Failed to delete entry');
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-sky-500 hover:text-sky-700"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Entry?</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this fishing entry? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-400 transition-colors"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Entry Details */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Date & Time */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {formatDate(entry.fishingDate, 'EEEE, MMMM d, yyyy')}
          </h2>
          <div className="text-gray-600">Time: {entry.fishingTime}</div>
        </div>

        {/* Location */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Location</h3>
          <div className="flex items-start">
            <svg className="w-5 h-5 mr-2 text-sky-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div>
              <div className="text-gray-800 font-medium">{entry.locationName}</div>
              {entry.locationLabel && (
                <div className="text-gray-600 text-sm">{entry.locationLabel}</div>
              )}
            </div>
          </div>
        </div>

        {/* Catches */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Catches</h3>
          <div className="space-y-3">
            {entry.catches.map((catch_, index) => (
              <div key={index} className="bg-sky-50 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 mr-2 text-sky-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                    />
                  </svg>
                  <div>
                    <div className="font-medium text-gray-800">{catch_.species}</div>
                    {(catch_.size || catch_.weight) && (
                      <div className="text-sm text-gray-600 mt-1">
                        {catch_.size && (
                          <span>Length: {catch_.size} {catch_.unit === 'metric' ? 'cm' : 'inches'}</span>
                        )}
                        {catch_.size && catch_.weight && <span> • </span>}
                        {catch_.weight && (
                          <span>Weight: {catch_.weight} {catch_.unit === 'metric' ? 'kg' : 'lbs'}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gear & Flies */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Gear & Flies</h3>
          <div className="space-y-2">
            <div>
              <span className="text-gray-600 font-medium">Gear: </span>
              <span className="text-gray-800">{entry.gearUsed}</span>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Flies: </span>
              <span className="text-gray-800">{entry.fliesUsed}</span>
            </div>
          </div>
        </div>

        {/* Weather */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Weather</h3>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm text-gray-600">Conditions</div>
                <div className="font-medium text-gray-800">{entry.weather.conditions}</div>
              </div>
              {entry.weather.temperature && (
                <div>
                  <div className="text-sm text-gray-600">Temperature</div>
                  <div className="font-medium text-gray-800">{entry.weather.temperature}°</div>
                </div>
              )}
              {entry.weather.windSpeed && (
                <div>
                  <div className="text-sm text-gray-600">Wind Speed</div>
                  <div className="font-medium text-gray-800">{entry.weather.windSpeed}</div>
                </div>
              )}
              {entry.weather.windDirection && (
                <div>
                  <div className="text-sm text-gray-600">Wind Direction</div>
                  <div className="font-medium text-gray-800">{entry.weather.windDirection}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notes */}
        {entry.notes && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Notes</h3>
            <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
              {entry.notes}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <div>Created: {formatDate(entry.createdAt, 'PPpp')}</div>
            <div>Updated: {formatDate(entry.updatedAt, 'PPpp')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
