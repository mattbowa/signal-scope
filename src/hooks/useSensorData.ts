import { useState, useEffect, useMemo } from 'react';
import { SensorData, TagWithContext } from '../types';

/**
 * Custom hook to load and flatten sensor data for easy access
 * Demonstrates: useState, useEffect, useMemo
 */
export function useSensorData() {
  const [data, setData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    async function loadData() {
      try {
        // const response = await fetch('/data.json');
        const response = await fetch('/down.json');
        if (!response.ok) {
          throw new Error('Failed to load data');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Flatten tags with site/asset context for easier selection
  // useMemo prevents recalculation on every render
  const allTags = useMemo<TagWithContext[]>(() => {
    if (!data) return [];

    const tags: TagWithContext[] = [];
    data.sites.forEach((site) => {
      site.assets.forEach((asset) => {
        asset.tags.forEach((tag) => {
          tags.push({
            ...tag,
            siteName: site.name,
            assetName: asset.name,
            fullPath: `${site.name} > ${asset.name} > ${tag.label}`,
          });
        });
      });
    });
    return tags;
  }, [data]);

  return { data, loading, error, allTags };
}
