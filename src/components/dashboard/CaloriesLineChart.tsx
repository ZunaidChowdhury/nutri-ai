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
      <div className="flex flex-col items-center justify-center py-12 text-[#849A95] dark:text-[#6E8883]">
        <p className="text-sm">No calorie data to chart yet.</p>
        <p className="text-xs mt-1">Log some foods to see your trends over time.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-[#DCE9E4] dark:text-[#263835]" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#849A95' }}
            tickLine={false}
            axisLine={{ stroke: '#849A95', opacity: 0.3 }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#849A95' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] p-3 shadow-lg">
                    <p className="text-xs font-semibold text-[#163330] dark:text-[#E8F2EF] mb-1">{label}</p>
                    <p className="text-sm font-bold text-[#007F78] dark:text-[#2DD4BF]">
                      {payload[0].value} <span className="text-xs font-normal text-[#55706B] dark:text-[#A1B8B3]">calories</span>
                    </p>
                  </div>
                );
              }
              return null;
            }}
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
