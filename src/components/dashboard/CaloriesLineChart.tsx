'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ChartEntry {
  date: string;
  calories: number;
}

function groupCaloriesByDay(entries: ChartEntry[]): { date: string; calories: number }[] {
  const map = new Map<string, number>();

  for (const entry of entries) {
    const day = entry.date;
    map.set(day, (map.get(day) || 0) + entry.calories);
  }

  return Array.from(map.entries())
    .map(([date, calories]) => ({ date, calories }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

interface CaloriesLineChartProps {
  entries: ChartEntry[];
}

export function CaloriesLineChart({ entries }: CaloriesLineChartProps) {
  const data = groupCaloriesByDay(entries);

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-[#849A95]">
        <p className="text-sm">No calorie data to chart yet.</p>
        <p className="text-xs mt-1">Log some foods to see your trends over time.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#DCE9E4" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#55706B' }}
            tickLine={false}
            axisLine={{ stroke: '#DCE9E4' }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#55706B' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #DCE9E4',
              background: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            }}
            labelStyle={{ fontWeight: 600, color: '#163330' }}
            itemStyle={{ color: '#007F78' }}
          />
          <Line
            type="monotone"
            dataKey="calories"
            stroke="#007F78"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#007F78', strokeWidth: 2, stroke: '#FFFFFF' }}
            activeDot={{ r: 6, fill: '#005F5A', stroke: '#DDF5F0', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
