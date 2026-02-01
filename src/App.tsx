import { useState, useMemo, useTransition } from 'react';
import { useSensorData } from './hooks/useSensorData';
import { TagSelector } from './components/TagSelector';
import { TimeSeriesChart } from './components/TimeSeriesChart';

/**
 * Main App component
 * Demonstrates proper state management and component composition
 */
function App() {
  // Custom hook for data management
  const { loading, error, allTags } = useSensorData();

  // React 18 useTransition for non-blocking UI updates
  const [isPending, startTransition] = useTransition();

  // State for selected tag IDs
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  // State for quality filter (all selected by default)
  const [qualityFilter, setQualityFilter] = useState<Set<string>>(
    new Set(['good', 'uncertain', 'bad']),
  );

  // Toggle tag selection with transition for large datasets
  const handleToggleTag = (tagId: string) => {
    startTransition(() => {
      setSelectedTagIds((prev) =>
        prev.includes(tagId)
          ? prev.filter((id) => id !== tagId)
          : [...prev, tagId],
      );
    });
  };

  // Toggle quality filter
  const handleQualityFilterChange = (quality: string) => {
    setQualityFilter((prev) => {
      const newFilter = new Set(prev);
      if (newFilter.has(quality)) {
        newFilter.delete(quality);
      } else {
        newFilter.add(quality);
      }
      return newFilter;
    });
  };

  // Get full tag objects for selected IDs
  // useMemo prevents recalculation on every render
  const selectedTags = useMemo(
    () => allTags.filter((tag) => selectedTagIds.includes(tag.id)),
    [allTags, selectedTagIds],
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading sensor data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <div className="text-4xl mb-4">⚠️</div>
          <div className="text-xl font-semibold mb-2">Error Loading Data</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-full px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Signal Scope</h1>
          <p className="text-sm text-gray-600 mt-1">
            Murray Irrigation - Sensor Data Monitoring
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-full px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Tag Selection */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 sticky top-6">
              <TagSelector
                tags={allTags}
                selectedTagIds={selectedTagIds}
                onToggleTag={handleToggleTag}
              />
            </div>
          </aside>

          {/* Main Chart Area */}
          <section className="lg:col-span-3">
            <div
              className={`bg-white rounded-lg shadow p-6 transition-opacity ${
                isPending ? 'opacity-60' : 'opacity-100'
              }`}
              style={{ height: '600px' }}
            >
              {isPending && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                  Loading...
                </div>
              )}
              <TimeSeriesChart
                selectedTags={selectedTags}
                qualityFilter={qualityFilter}
                onQualityFilterChange={handleQualityFilterChange}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
