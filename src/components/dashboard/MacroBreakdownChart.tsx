'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface MacroEntry {
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

const COLORS = {
  protein: '#007F78',
  carbs: '#F59E0B',
  fat: '#EF4444',
};

function aggregateMacros(entries: MacroEntry[]) {
  const protein = entries.reduce((sum, e) => sum + e.macros.protein, 0);
  const carbs = entries.reduce((sum, e) => sum + e.macros.carbs, 0);
  const fat = entries.reduce((sum, e) => sum + e.macros.fat, 0);

  return [
    { name: 'Protein', value: protein, color: COLORS.protein, key: 'protein' },
    { name: 'Carbs', value: carbs, color: COLORS.carbs, key: 'carbs' },
    { name: 'Fat', value: fat, color: COLORS.fat, key: 'fat' },
  ];
}

interface MacroBreakdownChartProps {
  entries: MacroEntry[];
}

export function MacroBreakdownChart({ entries }: MacroBreakdownChartProps) {
  const data = aggregateMacros(entries);

  if (data.every((d) => d.value === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] dark:bg-[#F59E0B]/20 flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-[#163330] dark:text-[#E8F2EF]">No macro data recorded yet</p>
        <p className="text-xs text-[#849A95] dark:text-[#6E8883] mt-1 max-w-[240px]">
          Log meals with macronutrients to see your protein, carb, and fat distribution.
        </p>
      </div>
    );
  }

  const totalGrams = data.reduce((sum, d) => sum + d.value, 0);
  const totalMacroCal = (data[0].value * 4) + (data[1].value * 4) + (data[2].value * 9);

  return (
    <div className="flex flex-col items-center w-full gap-4">
      <div className="w-full h-[220px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              cornerRadius={6}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const entry = payload[0];
                  const val = Number(entry.value);
                  const pct = totalGrams > 0 ? Math.round((val / totalGrams) * 100) : 0;
                  return (
                    <div className="rounded-xl border border-[#DCE9E4] dark:border-[#263835] bg-white/95 dark:bg-[#161f1e]/95 backdrop-blur-md p-3 shadow-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.payload.fill }} />
                        <p className="text-xs font-semibold text-[#163330] dark:text-[#E8F2EF]">{entry.name}</p>
                      </div>
                      <p className="text-sm font-bold text-[#163330] dark:text-[#E8F2EF]">
                        {val}g <span className="text-xs font-medium text-[#55706B] dark:text-[#A1B8B3]">({pct}% of intake)</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Donut Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs font-medium text-[#849A95] dark:text-[#6E8883]">Total</span>
          <span className="text-xl font-bold text-[#163330] dark:text-[#E8F2EF]">{totalGrams}g</span>
          <span className="text-[10px] text-[#55706B] dark:text-[#A1B8B3]">{totalMacroCal} kcal</span>
        </div>
      </div>

      {/* Custom Macro Legend Cards */}
      <div className="grid grid-cols-3 gap-2 w-full pt-1">
        {data.map((d) => {
          const pct = totalGrams > 0 ? Math.round((d.value / totalGrams) * 100) : 0;
          return (
            <div
              key={d.name}
              className="flex flex-col gap-1 p-2.5 rounded-xl border border-[#DCE9E4] dark:border-[#263835] bg-[#F7FAF8] dark:bg-[#121918]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#163330] dark:text-[#E8F2EF] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name}
                </span>
                <span className="text-xs font-bold" style={{ color: d.color }}>{pct}%</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold text-[#163330] dark:text-[#E8F2EF]">{d.value}g</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#DCE9E4]/60 dark:bg-[#263835] overflow-hidden mt-0.5">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: d.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
