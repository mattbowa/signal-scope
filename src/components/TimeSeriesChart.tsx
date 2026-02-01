import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TagWithContext } from '../types';

interface TimeSeriesChartProps {
  selectedTags: TagWithContext[];
}

// Colors for different tags
const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

// Quality indicator colors
const QUALITY_COLORS = {
  good: '#10b981',
  uncertain: '#f59e0b',
  bad: '#ef4444',
};

/**
 * Custom dot component to show quality indicators
 */
function QualityDot(props: any) {
  const { cx, cy, payload, dataKey } = props;

  if (!payload || !payload[`${dataKey}_quality`]) {
    return null;
  }

  const quality = payload[`${dataKey}_quality`];

  // Only show dots for uncertain and bad quality
  if (quality === 'good') {
    return null;
  }

  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill={QUALITY_COLORS[quality as keyof typeof QUALITY_COLORS]}
      stroke="white"
      strokeWidth={2}
    />
  );
}

/**
 * Time series chart component
 * Demonstrates useMemo for performance optimization
 */
export function TimeSeriesChart({ selectedTags }: TimeSeriesChartProps) {
  // Transform data for Recharts format
  // useMemo prevents recalculation on every render
  const chartData = useMemo(() => {
    if (selectedTags.length === 0) return [];

    // Get all unique timestamps across all tags
    const timestampSet = new Set<string>();
    selectedTags.forEach((tag) => {
      tag.points.forEach((point) => {
        timestampSet.add(point.ts);
      });
    });

    const timestamps = Array.from(timestampSet).sort();

    // Create chart data with all tags for each timestamp
    return timestamps.map((ts) => {
      const dataPoint: any = { timestamp: ts };

      selectedTags.forEach((tag) => {
        const point = tag.points.find((p) => p.ts === ts);
        if (point) {
          dataPoint[tag.id] = point.value;
          dataPoint[`${tag.id}_quality`] = point.q;
        }
      });

      return dataPoint;
    });
  }, [selectedTags]);

  // Calculate Y-axis label based on selected tags' units
  const yAxisLabel = useMemo(() => {
    if (selectedTags.length === 0) return '';

    const firstUnit = selectedTags[0].unit;
    const allSameUnit = selectedTags.every((tag) => tag.unit === firstUnit);

    return allSameUnit ? firstUnit : 'Mixed Units';
  }, [selectedTags]);

  // Format timestamp for display
  const formatTimestamp = (ts: string) => {
    const date = new Date(ts);
    return date.toLocaleTimeString('en-AU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (selectedTags.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <div className="text-lg">Select sensors to view data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Sensor Data Comparison
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {chartData.length} data points • Quality indicators: 🟡 Uncertain, 🔴
          Bad
        </p>
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatTimestamp}
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
              labelFormatter={(label) =>
                new Date(label).toLocaleString('en-AU')
              }
              formatter={(value: any, name: string) => {
                const tag = selectedTags.find((t) => t.id === name);
                return [`${value} ${tag?.unit || ''}`, tag?.label || name];
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '14px' }}
              formatter={(value) => {
                const tag = selectedTags.find((t) => t.id === value);
                return tag?.fullPath || value;
              }}
            />
            {selectedTags.map((tag, index) => (
              <Line
                key={tag.id}
                type="monotone"
                dataKey={tag.id}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={<QualityDot dataKey={tag.id} />}
                isAnimationActive={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
