'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { Meal } from '@/lib/types/meal';

const COLORS = {
  protein: 'hsl(var(--heroui-primary))',
  carbs: 'hsl(var(--heroui-warning))',
  fat: 'hsl(var(--heroui-danger))',
};

function aggregateMacros(meals: Meal[]) {
  const protein = meals.reduce((sum, m) => sum + m.macros.protein, 0);
  const carbs = meals.reduce((sum, m) => sum + m.macros.carbs, 0);
  const fat = meals.reduce((sum, m) => sum + m.macros.fat, 0);

  return [
    { name: 'Protein', value: protein, color: COLORS.protein },
    { name: 'Carbs', value: carbs, color: COLORS.carbs },
    { name: 'Fat', value: fat, color: COLORS.fat },
  ];
}

interface MacroBreakdownChartProps {
  meals: Meal[];
}

export function MacroBreakdownChart({ meals }: MacroBreakdownChartProps) {
  const data = aggregateMacros(meals);

  if (data.every((d) => d.value === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-default-400">
        <p className="text-sm">No macro data to display yet.</p>
        <p className="text-xs mt-1">Log meals with macro information to see your breakdown.</p>
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
                borderRadius: '8px',
                border: '1px solid hsl(var(--heroui-default-200))',
                background: 'hsl(var(--heroui-background))',
              }}
            />
            <Legend
              formatter={(value: string) => (
                <span className="text-sm text-default-600 dark:text-default-400">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-6 mt-2 text-sm">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
            <span className="text-default-500">
              {d.name}: {d.value}g
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
