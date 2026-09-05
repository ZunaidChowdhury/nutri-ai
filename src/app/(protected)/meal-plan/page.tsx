'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  Accordion,
  Button,
  Card,
  Chip,
  Input,
  Label,
  ListBox,
  Select,
  Separator,
  TextField,
} from '@heroui/react';
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
      <span className="text-xs font-medium text-muted w-14">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-surface-secondary dark:bg-surface-secondary">
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
    <Card className="border border-border dark:border-border">
      <Card.Header className="pb-2 pt-4 px-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-accent-soft dark:bg-accent-soft text-accent font-bold text-sm">
            {day.day}
          </div>
          <h3 className="text-lg font-semibold">Day {day.day}</h3>
        </div>
      </Card.Header>
      <Card.Content className="px-5 pb-5">
        <Accordion>
          {day.meals.map((meal, i) => (
            <Accordion.Item key={i} id={`${day.day}-${i}`}>
              <Accordion.Heading>
                <Accordion.Trigger>
                  <div className="flex items-center justify-between w-full pr-4">
                    <span className="font-medium">{meal.name}</span>
                    <Chip size="sm" variant="soft" color="accent">
                      {meal.calories} cal
                    </Chip>
                  </div>
                </Accordion.Trigger>
              </Accordion.Heading>
              <Accordion.Panel>
                <Accordion.Body>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <MacroBar label="Protein" value={meal.macros.protein} color="bg-danger" />
                      <MacroBar label="Carbs" value={meal.macros.carbs} color="bg-warning" />
                      <MacroBar label="Fat" value={meal.macros.fat} color="bg-accent" />
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">
                        Ingredients
                      </h4>
                      <ul className="flex flex-wrap gap-1.5">
                        {meal.ingredients.map((ing, j) => (
                          <Chip key={j} size="sm" variant="soft" color="default">
                            {ing}
                          </Chip>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">
                        Instructions
                      </h4>
                      <p className="text-sm text-default dark:text-muted leading-relaxed">
                        {meal.instructions}
                      </p>
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Card.Content>
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
      const e = err as { code?: string; status?: number; message?: string };
      if (e?.status === 401) {
        setError('Your session has expired. Please sign in again.');
      } else if (e?.code === 'RATE_LIMITED' || e?.status === 429) {
        setError('You have reached the meal-planning limit. Please try again later.');
      } else {
        setError(e?.message || 'Failed to generate meal plan. Please try again.');
      }
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
        <p className="text-muted">
          Tell us your goals and preferences, and our AI will generate a personalized 7-day meal plan.
        </p>
      </div>

      <Card className="border border-border dark:border-border">
        <Card.Header className="pb-0 px-6 pt-6">
          <h2 className="text-lg font-semibold">Your Preferences</h2>
        </Card.Header>
        <Card.Content className="gap-5 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Select
              placeholder="Select your goal"
              value={form.goal || null}
              onChange={(key) => {
                const val = (key as string) || '';
                dispatch(setGoal(val));
              }}
              isRequired
              fullWidth
            >
              <Label>Goal</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {GOALS.map((g) => (
                    <ListBox.Item key={g.value} id={g.value} textValue={g.label}>
                      {g.label}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            <Select
              placeholder="Select budget"
              value={form.budget || null}
              onChange={(key) => {
                const val = (key as string) || '';
                dispatch(setBudget(val as 'low' | 'medium' | 'high'));
              }}
              isRequired
              fullWidth
            >
              <Label>Budget</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {BUDGETS.map((b) => (
                    <ListBox.Item key={b.value} id={b.value} textValue={b.label}>
                      {b.label}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            <Select
              placeholder="Select restrictions"
              selectionMode="multiple"
              value={form.restrictions}
              onChange={(keys) => {
                dispatch(setRestrictions(keys as string[]));
              }}
              className="md:col-span-2"
              fullWidth
            >
              <Label>Dietary Restrictions</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {RESTRICTION_OPTIONS.map((r) => (
                    <ListBox.Item key={r} id={r} textValue={r}>
                      {r}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            <TextField className="w-full md:col-span-2" isRequired>
              <Label>Daily Calorie Target</Label>
              <Input
                type="number"
                placeholder="2000"
                value={String(form.calorieTarget)}
                onChange={(e) => dispatch(setCalorieTarget(Number(e.target.value) || 2000))}
                fullWidth
              />
            </TextField>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-danger-soft dark:bg-danger-soft text-danger text-sm">
              {error}
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            onPress={handleGenerate}
            isPending={isGenerating}
            isDisabled={!form.goal}
            className="w-full"
          >
            Generate Meal Plan
          </Button>
        </Card.Content>
      </Card>

      {isGenerating && <AgentLoadingState agentName="Meal Planning" />}

      {plan && !isGenerating && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold">Your 7-Day Plan</h2>
              <Chip variant="soft" color="accent" size="sm">
                ~{Math.round(totalCalories / 7)} cal/day avg
              </Chip>
            </div>
            <Button
              variant="secondary"
              onPress={handleGenerate}
              isPending={isGenerating}
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