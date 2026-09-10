'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
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
    { name: 'Protein', value: protein, color: COLORS.protein },
    { name: 'Carbs', value: carbs, color: COLORS.carbs },
    { name: 'Fat', value: fat, color: COLORS.fat },
  ];
}

interface MacroBreakdownChartProps {
  entries: MacroEntry[];
}

export function MacroBreakdownChart({ entries }: MacroBreakdownChartProps) {
  const data = aggregateMacros(entries);

  if (data.every((d) => d.value === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-[#849A95]">
        <p className="text-sm">No macro data to display yet.</p>
        <p className="text-xs mt-1">Log foods with macro information to see your breakdown.</p>
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `${value}g (${Math.round((value / total) * 100)}%)`}
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #DCE9E4',
                background: '#FFFFFF',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              }}
            />
            <Legend
              formatter={(value: string) => (
                <span className="text-sm text-[#55706B]">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-6 mt-2 text-sm">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
            <span className="text-[#55706B]">
              {d.name}: {d.value}g
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
