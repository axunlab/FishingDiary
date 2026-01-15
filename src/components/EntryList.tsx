import { FishingEntry } from '../types';
import { formatDate } from '../services/dateService';

interface EntryListProps {
  entries: FishingEntry[];
  loading: boolean;
  onEntryClick: (entry: FishingEntry) => void;
  onAddClick: () => void;
}

export function EntryList({ entries, loading, onEntryClick, onAddClick }: EntryListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading entries...</div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h2 className="mt-4 text-xl text-gray-600 font-medium">No entries yet</h2>
        <p className="mt-2 text-gray-500">Start logging your fishing trips!</p>
        <button
          onClick={onAddClick}
          className="mt-6 bg-sky-500 text-white px-6 py-3 rounded-lg hover:bg-sky-600 transition-colors font-medium"
        >
          Add Your First Entry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Fishing Entries</h2>
        <span className="text-sm text-gray-500">{entries.length} entries</span>
      </div>

      <div className="space-y-3">
        {entries.map((entry) => (
          <div
            key={entry.id}
            onClick={() => onEntryClick(entry)}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
          >
            {/* Header: Date and Time */}
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-lg font-semibold text-gray-800">
                  {formatDate(entry.fishingDate, 'dd MMM yyyy')}
                </div>
                <div className="text-sm text-gray-500">{entry.fishingTime}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-sky-600">{entry.weather.conditions}</div>
                {entry.weather.temperature && (
                  <div className="text-sm text-gray-500">{entry.weather.temperature}°</div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="mb-3">
              <div className="flex items-center text-gray-700">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <span className="font-medium">{entry.locationName}</span>
              </div>
              {entry.locationLabel && (
                <div className="text-sm text-gray-500 ml-5">{entry.locationLabel}</div>
              )}
            </div>

            {/* Catches Summary */}
            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                {entry.catches.map((catch_, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center bg-sky-50 text-sky-700 px-3 py-1 rounded-full text-sm"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                      />
                    </svg>
                    <span className="font-medium">{catch_.species}</span>
                    {(catch_.size || catch_.weight) && (
                      <span className="ml-1 text-xs">
                        ({catch_.size && `${catch_.size}${catch_.unit === 'metric' ? 'cm' : 'in'}`}
                        {catch_.size && catch_.weight && ', '}
                        {catch_.weight && `${catch_.weight}${catch_.unit === 'metric' ? 'kg' : 'lbs'}`})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Gear */}
            <div className="text-sm text-gray-600 line-clamp-1">
              <span className="font-medium">Gear:</span> {entry.gearUsed}
            </div>
            <div className="text-sm text-gray-600 line-clamp-1">
              <span className="font-medium">Flies:</span> {entry.fliesUsed}
            </div>

            {/* Notes preview if exists */}
            {entry.notes && (
              <div className="mt-2 text-sm text-gray-500 italic line-clamp-2">
                "{entry.notes}"
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
