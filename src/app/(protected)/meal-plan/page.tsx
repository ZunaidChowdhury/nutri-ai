'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { Button } from '@heroui/button';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Accordion, AccordionItem } from '@heroui/accordion';
import { Divider } from '@heroui/divider';
import { generateMealPlan } from '@/lib/api/mealplan';
import { getAuthToken } from '@/lib/core/server';
import { AgentLoadingState } from '@/components/ai/AgentLoadingState';
import type { RootState, AppDispatch } from '@/store/store';
import {
  setGoal,
  setRestrictions,
  setBudget,
  setCalorieTarget,
} from '@/store/mealPlanFormSlice';
import type { MealPlanDay, MealPlanDayMeal } from '@/lib/types/mealplan';

const GOALS = [
  { value: 'lose', label: 'Weight Loss' },
  { value: 'maintain', label: 'Maintain Weight' },
  { value: 'gain', label: 'Weight Gain / Muscle Building' },
];

const RESTRICTION_OPTIONS = [
  'vegetarian',
  'vegan',
  'gluten-free',
  'dairy-free',
  'keto',
  'low-carb',
  'low-fat',
  'halal',
  'kosher',
];

const BUDGETS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

function MacroBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-default-500 w-14">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-default-200 dark:bg-default-700">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${Math.min(value / 3, 100)}%` }}
        />
      </div>
      <span className="text-xs font-semibold w-10 text-right">{value}g</span>
    </div>
  );
}

function DayCard({ day }: { day: MealPlanDay }) {
  return (
    <Card className="border border-default-200 dark:border-default-100">
      <CardHeader className="pb-2 pt-4 px-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary font-bold text-sm">
            {day.day}
          </div>
          <h3 className="text-lg font-semibold">Day {day.day}</h3>
        </div>
      </CardHeader>
      <CardBody className="px-5 pb-5">
        <Accordion variant="splitted">
          {day.meals.map((meal, i) => (
            <AccordionItem
              key={i}
              title={
                <div className="flex items-center justify-between w-full pr-4">
                  <span className="font-medium">{meal.name}</span>
                  <Chip size="sm" variant="flat" color="primary">
                    {meal.calories} cal
                  </Chip>
                </div>
              }
            >
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <MacroBar label="Protein" value={meal.macros.protein} color="bg-danger-400" />
                  <MacroBar label="Carbs" value={meal.macros.carbs} color="bg-warning-400" />
                  <MacroBar label="Fat" value={meal.macros.fat} color="bg-primary-400" />
                </div>

                <Divider />

                <div>
                  <h4 className="text-xs font-semibold text-default-500 uppercase tracking-wide mb-1.5">
                    Ingredients
                  </h4>
                  <ul className="flex flex-wrap gap-1.5">
                    {meal.ingredients.map((ing, j) => (
                      <Chip key={j} size="sm" variant="flat" color="default">
                        {ing}
                      </Chip>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-default-500 uppercase tracking-wide mb-1.5">
                    Instructions
                  </h4>
                  <p className="text-sm text-default-600 dark:text-default-400 leading-relaxed">
                    {meal.instructions}
                  </p>
                </div>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </CardBody>
    </Card>
  );
}

export default function MealPlanPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const form = useSelector((state: RootState) => state.mealPlanForm);

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [plan, setPlan] = useState<MealPlanDay[] | null>(null);

  const handleGenerate = async () => {
    setError('');
    setIsGenerating(true);

    try {
      const token = await getAuthToken();
      if (!token) {
        router.push('/login');
        return;
      }

      const result = await generateMealPlan(
        form.goal,
        form.restrictions,
        form.budget,
        form.calorieTarget,
        token
      );

      setPlan(result.days);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e?.message || 'Failed to generate meal plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const totalCalories =
    plan
      ?.flatMap((d) => d.meals)
      .reduce((sum, m) => sum + m.calories, 0) ?? 0;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-4xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold">AI Meal Planner</h1>
        <p className="text-default-500">
          Tell us your goals and preferences, and our AI will generate a personalized 7-day meal plan.
        </p>
      </div>

      <Card className="border border-default-200 dark:border-default-100">
        <CardHeader className="pb-0 px-6 pt-6">
          <h2 className="text-lg font-semibold">Your Preferences</h2>
        </CardHeader>
        <CardBody className="gap-5 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Select
              label="Goal"
              placeholder="Select your goal"
              selectedKeys={form.goal ? [form.goal] : []}
              onSelectionChange={(keys) => {
                const val = Array.from(keys as Set<string>)[0] as string;
                dispatch(setGoal(val || ''));
              }}
              isRequired
            >
              {GOALS.map((g) => (
                <SelectItem key={g.value}>{g.label}</SelectItem>
              ))}
            </Select>

            <Select
              label="Budget"
              placeholder="Select budget"
              selectedKeys={form.budget ? [form.budget] : []}
              onSelectionChange={(keys) => {
                const val = Array.from(keys as Set<string>)[0] as string;
                dispatch(setBudget(val as 'low' | 'medium' | 'high'));
              }}
              isRequired
            >
              {BUDGETS.map((b) => (
                <SelectItem key={b.value}>{b.label}</SelectItem>
              ))}
            </Select>

            <Select
              label="Dietary Restrictions"
              placeholder="Select restrictions"
              selectionMode="multiple"
              selectedKeys={new Set(form.restrictions)}
              onSelectionChange={(keys) => {
                dispatch(setRestrictions(Array.from(keys as Set<string>)));
              }}
              className="md:col-span-2"
            >
              {RESTRICTION_OPTIONS.map((r) => (
                <SelectItem key={r}>{r}</SelectItem>
              ))}
            </Select>

            <Input
              label="Daily Calorie Target"
              type="number"
              placeholder="2000"
              value={String(form.calorieTarget)}
              onValueChange={(v) => dispatch(setCalorieTarget(Number(v) || 2000))}
              isRequired
              className="md:col-span-2"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-danger-50 dark:bg-danger-500/10 text-danger text-sm">
              {error}
            </div>
          )}

          <Button
            color="primary"
            size="lg"
            onPress={handleGenerate}
            isLoading={isGenerating}
            isDisabled={!form.goal}
            className="w-full"
          >
            Generate Meal Plan
          </Button>
        </CardBody>
      </Card>

      {isGenerating && <AgentLoadingState agentName="Meal Planning" />}

      {plan && !isGenerating && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold">Your 7-Day Plan</h2>
              <Chip variant="flat" color="primary" size="sm">
                ~{Math.round(totalCalories / 7)} cal/day avg
              </Chip>
            </div>
            <Button
              variant="flat"
              color="secondary"
              onPress={handleGenerate}
              isLoading={isGenerating}
            >
              Regenerate
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            {plan.map((day) => (
              <DayCard key={day.day} day={day} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
