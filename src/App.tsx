import { useState } from 'react';
import { FishingEntry, FishingEntryFormData } from './types';
import { useEntries } from './hooks/useEntries';
import { useSettings } from './hooks/useSettings';
import { EntryList } from './components/EntryList';
import { EntryForm } from './components/EntryForm';
import { EntryDetail } from './components/EntryDetail';
import { Settings } from './components/Settings';

type View = 'list' | 'add' | 'edit' | 'detail' | 'settings';

function App() {
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedEntry, setSelectedEntry] = useState<FishingEntry | null>(null);

  // Use custom hooks
  const {
    entries,
    loading: entriesLoading,
    error: entriesError,
    createEntry,
    updateEntry,
    deleteEntry
  } = useEntries();

  const {
    settings,
    loading: settingsLoading,
    updateSettings,
    resetSettings
  } = useSettings();

  // Navigation handlers
  const navigateToList = () => {
    setCurrentView('list');
    setSelectedEntry(null);
  };

  const navigateToAdd = () => {
    setCurrentView('add');
    setSelectedEntry(null);
  };

  const navigateToDetail = (entry: FishingEntry) => {
    setSelectedEntry(entry);
    setCurrentView('detail');
  };

  const navigateToEdit = () => {
    setCurrentView('edit');
  };

  const navigateToSettings = () => {
    setCurrentView('settings');
  };

  // Entry handlers
  const handleCreateEntry = async (formData: FishingEntryFormData) => {
    await createEntry(formData);
    navigateToList();
  };

  const handleUpdateEntry = async (formData: FishingEntryFormData) => {
    if (selectedEntry) {
      await updateEntry(selectedEntry.id, formData);
      navigateToList();
    }
  };

  const handleDeleteEntry = async (id: string) => {
    await deleteEntry(id);
    navigateToList();
  };

  // Settings handlers
  const handleUpdateSettings = async (newSettings: Partial<typeof settings>) => {
    await updateSettings(newSettings);
  };

  const handleResetSettings = async () => {
    await resetSettings();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-sky-500 text-white shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Fishing Diary</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* Error Display */}
        {entriesError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {entriesError}
          </div>
        )}

        {/* List View */}
        {currentView === 'list' && (
          <EntryList
            entries={entries}
            loading={entriesLoading}
            onEntryClick={navigateToDetail}
            onAddClick={navigateToAdd}
          />
        )}

        {/* Add Entry View */}
        {currentView === 'add' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <EntryForm
              onSubmit={handleCreateEntry}
              onCancel={navigateToList}
            />
          </div>
        )}

        {/* Edit Entry View */}
        {currentView === 'edit' && selectedEntry && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <EntryForm
              entry={selectedEntry}
              onSubmit={handleUpdateEntry}
              onCancel={() => navigateToDetail(selectedEntry)}
            />
          </div>
        )}

        {/* Detail View */}
        {currentView === 'detail' && selectedEntry && (
          <EntryDetail
            entry={selectedEntry}
            onBack={navigateToList}
            onEdit={navigateToEdit}
            onDelete={handleDeleteEntry}
          />
        )}

        {/* Settings View */}
        {currentView === 'settings' && !settingsLoading && (
          <Settings
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onReset={handleResetSettings}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-around items-center h-16">
          <button
            onClick={navigateToList}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentView === 'list' || currentView === 'detail' || currentView === 'edit'
                ? 'text-sky-500'
                : 'text-gray-500'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-xs mt-1">Entries</span>
          </button>

          <button
            onClick={navigateToAdd}
            className="flex flex-col items-center justify-center flex-1 h-full text-sky-500"
          >
            <div className="bg-sky-500 text-white rounded-full p-3 -mt-6 shadow-lg hover:bg-sky-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-xs mt-1">Add</span>
          </button>

          <button
            onClick={navigateToSettings}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentView === 'settings' ? 'text-sky-500' : 'text-gray-500'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs mt-1">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;
