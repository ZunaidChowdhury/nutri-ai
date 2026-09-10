'use client';

import {
  AreaChart,
  Area,
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
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#DDF5F0] dark:bg-[#007F78]/20 flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-[#007F78] dark:text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-[#163330] dark:text-[#E8F2EF]">No calorie data recorded yet</p>
        <p className="text-xs text-[#849A95] dark:text-[#6E8883] mt-1 max-w-[240px]">
          Log your daily meals to automatically visualize your calorie intake trends.
        </p>
      </div>
    );
  }

  const maxCal = Math.max(...data.map(d => d.calories));
  const avgCal = Math.round(data.reduce((s, d) => s + d.calories, 0) / data.length);

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between text-xs text-[#849A95] dark:text-[#6E8883] px-1">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#007F78] inline-block" />
            Daily Calories
          </span>
          <span className="hidden sm:inline">Avg: <strong className="text-[#163330] dark:text-[#E8F2EF]">{avgCal} kcal</strong></span>
        </div>
        <span>Peak: <strong className="text-[#007F78] dark:text-[#2DD4BF]">{maxCal} kcal</strong></span>
      </div>

      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 12, right: 12, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="calGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#007F78" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#007F78" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-[#DCE9E4]/60 dark:text-[#263835]/60" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#849A95' }}
              tickLine={false}
              axisLine={{ stroke: '#849A95', opacity: 0.2 }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#849A95' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value;
                  return (
                    <div className="rounded-xl border border-[#DCE9E4] dark:border-[#263835] bg-white/95 dark:bg-[#161f1e]/95 backdrop-blur-md p-3 shadow-xl">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#007F78]" />
                        <p className="text-xs font-semibold text-[#163330] dark:text-[#E8F2EF]">{label}</p>
                      </div>
                      <p className="text-base font-bold text-[#007F78] dark:text-[#2DD4BF]">
                        {val} <span className="text-xs font-medium text-[#55706B] dark:text-[#A1B8B3]">kcal</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="calories"
              stroke="#007F78"
              strokeWidth={3}
              fill="url(#calGradient)"
              activeDot={{ r: 6, fill: '#005F5A', stroke: '#DDF5F0', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
