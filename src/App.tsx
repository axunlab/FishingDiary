import { useState, useEffect } from 'react';
import { FishingEntry, FishingEntryFormData } from './types';
import { useEntries } from './hooks/useEntries';
import { useSettings } from './hooks/useSettings';
import { EntryList } from './components/EntryList';
import { EntryForm } from './components/EntryForm';
import { EntryDetail } from './components/EntryDetail';
import { Settings } from './components/Settings';
import * as exportImportService from './services/exportImportService';
import { isBackupOverdue, markBackupComplete, requestPersistentStorage } from './services/persistenceService';

type View = 'list' | 'add' | 'edit' | 'detail' | 'settings';

function App() {
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedEntry, setSelectedEntry] = useState<FishingEntry | null>(null);
  const [showBackupBanner, setShowBackupBanner] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Use custom hooks
  const {
    entries,
    loading: entriesLoading,
    error: entriesError,
    createEntry,
    updateEntry,
    deleteEntry,
    refresh: refreshEntries
  } = useEntries();

  const {
    settings,
    loading: settingsLoading,
    updateSettings,
    resetSettings,
    refresh: refreshSettings
  } = useSettings();

  // Show backup banner when backup is overdue
  useEffect(() => {
    if (settingsLoading) return;
    const overdue = isBackupOverdue(settings.lastBackupAt, settings.backupReminderDays ?? 7);
    setShowBackupBanner(overdue && !bannerDismissed);
  }, [settings, settingsLoading, bannerDismissed]);

  // Re-surface backup banner on app focus/visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const overdue = isBackupOverdue(settings.lastBackupAt, settings.backupReminderDays ?? 7);
        if (overdue) {
          setBannerDismissed(false);
          setShowBackupBanner(true);
        }
      } else if (document.visibilityState === 'visible') {
        const overdue = isBackupOverdue(settings.lastBackupAt, settings.backupReminderDays ?? 7);
        if (overdue && !bannerDismissed) {
          setShowBackupBanner(true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [settings.lastBackupAt, settings.backupReminderDays, bannerDismissed]);

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

  // Export/Import handlers
  const handleExport = async () => {
    await exportImportService.downloadExport();
    await markBackupComplete();
    await refreshSettings();
    setShowBackupBanner(false);
    setBannerDismissed(false);
  };

  const handleRequestPersistence = async (): Promise<boolean | null> => {
    const result = await requestPersistentStorage();
    await refreshSettings();
    return result;
  };

  const handleImport = async (file: File) => {
    const result = await exportImportService.importData(file);
    if (result.success) {
      // Refresh both entries and settings after successful import
      await refreshEntries();
      await refreshSettings();
    }
    return result;
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
        {/* Backup Reminder Banner */}
        {showBackupBanner && (
          <div className="bg-amber-50 border border-amber-300 text-amber-800 px-4 py-3 rounded-lg mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <p className="text-sm font-medium">
                {settings.lastBackupAt ? `Your last backup was more than ${settings.backupReminderDays ?? 7} days ago.` : 'You have never backed up your data.'}{' '}
                Export to avoid losing your entries.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleExport}
                className="text-sm font-semibold underline hover:no-underline whitespace-nowrap"
              >
                Back up now
              </button>
              <button
                onClick={() => { setShowBackupBanner(false); setBannerDismissed(true); }}
                aria-label="Dismiss backup reminder"
                className="text-amber-600 hover:text-amber-900"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

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
            onExport={handleExport}
            onImport={handleImport}
            onRequestPersistence={handleRequestPersistence}
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
