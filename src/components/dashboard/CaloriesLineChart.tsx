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
import type { Meal } from '@/lib/types/meal';

function groupCaloriesByDay(meals: Meal[]): { date: string; calories: number }[] {
  const map = new Map<string, number>();

  for (const meal of meals) {
    const day = new Date(meal.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    map.set(day, (map.get(day) || 0) + meal.calories);
  }

  return Array.from(map.entries())
    .map(([date, calories]) => ({ date, calories }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

interface CaloriesLineChartProps {
  meals: Meal[];
}

export function CaloriesLineChart({ meals }: CaloriesLineChartProps) {
  const data = groupCaloriesByDay(meals);

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-default-400">
        <p className="text-sm">No calorie data to chart yet.</p>
        <p className="text-xs mt-1">Log some meals to see your trends over time.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-default-200 dark:stroke-default-700" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            className="text-default-500"
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            className="text-default-500"
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid hsl(var(--heroui-default-200))',
              background: 'hsl(var(--heroui-background))',
            }}
            labelStyle={{ fontWeight: 600 }}
          />
          <Line
            type="monotone"
            dataKey="calories"
            stroke="hsl(var(--heroui-primary))"
            strokeWidth={2}
            dot={{ r: 4, fill: 'hsl(var(--heroui-primary))' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
