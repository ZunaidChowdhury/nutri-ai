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
  Modal,
  Select,
  TextField,
  useOverlayState,
} from '@heroui/react';
import { generateMealPlan } from '@/lib/api/mealplan';
import { downloadMealPlanPdf } from '@/lib/mealplanExport';
import { getAuthToken } from '@/lib/core/server';
import { AgentLoadingState } from '@/components/ai/AgentLoadingState';
import { DayCard } from '@/components/mealplan/DayCard';
import { useSession } from '@/lib/auth/client';
import { useSelectedMeals } from '@/lib/hooks/useSelectedMeals';
import { CheckIcon, DownloadIcon, PlusIcon } from '@/components/ui/icons';
import type { RootState, AppDispatch } from '@/store/store';
import {
  setGoal,
  setRestrictions,
  setBudget,
  setCalorieTarget,
} from '@/store/mealPlanFormSlice';
import type { MealPlanDay } from '@/lib/types/mealplan';

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

export default function MealPlanPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const form = useSelector((state: RootState) => state.mealPlanForm);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { selectedMeals } = useSelectedMeals(userId);

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [plan, setPlan] = useState<MealPlanDay[] | null>(null);
  const [planCreatedAt, setPlanCreatedAt] = useState<string | null>(null);
  const [lastSource, setLastSource] = useState<'random' | 'selected'>('random');
  const [pendingSource, setPendingSource] = useState<'random' | 'selected'>('random');
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);

  const sourceModal = useOverlayState({
    isOpen: isSourceModalOpen,
    onOpenChange: setIsSourceModalOpen,
  });

  const selectedCount = selectedMeals.length;
  const MIN_SELECTED = 10;
  const selectedEnabled = selectedCount >= MIN_SELECTED;

  const runGeneration = async (source: 'random' | 'selected') => {
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
        source,
        token
      );

      setPlan(result.days);
      setPlanCreatedAt(new Date().toISOString());
      setLastSource(source);
    } catch (err: unknown) {
      const e = err as { code?: string; status?: number; message?: string };
      if (e?.status === 401) {
        setError('Your session has expired. Please sign in again.');
      } else if (e?.code === 'RATE_LIMITED' || e?.status === 429) {
        setError('You have reached the meal-planning limit. Please try again later.');
      } else if (e?.status === 400 && e?.message) {
        setError(e.message);
      } else {
        setError(e?.message || 'Failed to generate meal plan. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = () => {
    setPendingSource('random');
    setIsSourceModalOpen(true);
  };

  const confirmSource = () => {
    setIsSourceModalOpen(false);
    runGeneration(pendingSource);
  };

  const totalCalories =
    plan
      ?.flatMap((d) => d.meals)
      .reduce((sum, m) => sum + m.calories, 0) ?? 0;

  const totalMacros = plan?.flatMap(d => d.meals).reduce((acc, m) => {
    acc.protein += m.macros.protein;
    acc.carbs += m.macros.carbs;
    acc.fat += m.macros.fat;
    return acc;
  }, { protein: 0, carbs: 0, fat: 0 }) ?? { protein: 0, carbs: 0, fat: 0 };
  
  const totalMacrosSum = totalMacros.protein + totalMacros.carbs + totalMacros.fat;
  const pPct = totalMacrosSum ? Math.round((totalMacros.protein / totalMacrosSum) * 100) : 0;
  const cPct = totalMacrosSum ? Math.round((totalMacros.carbs / totalMacrosSum) * 100) : 0;
  const fPct = totalMacrosSum ? Math.round((totalMacros.fat / totalMacrosSum) * 100) : 0;

  const handleDownloadPdf = () => {
    if (!plan) return;
    downloadMealPlanPdf({
      inputs: {
        goal: form.goal,
        restrictions: form.restrictions,
        budget: form.budget,
        calorieTarget: form.calorieTarget,
        source: lastSource,
      },
      days: plan,
      createdAt: planCreatedAt ?? undefined,
    });
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1280px] mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold text-[#163330]">✨ AI Meal Planner</h1>
        <p className="text-[#55706B]">
          Tell us your goals and preferences, and our AI will generate a personalized 7-day meal plan.
        </p>
      </div>

      <Card className="rounded-2xl border border-[#DCE9E4] shadow-sm">
        <Card.Header className="pb-0 px-6 pt-6">
          <h2 className="text-lg font-semibold text-[#163330]">Your Preferences</h2>
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

            <div className="md:col-span-2">
              <Label className="mb-2 block">Dietary Restrictions</Label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {RESTRICTION_OPTIONS.map((r) => {
                  const isSelected = form.restrictions.includes(r);
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          dispatch(setRestrictions(form.restrictions.filter(x => x !== r)));
                        } else {
                          dispatch(setRestrictions([...form.restrictions, r]));
                        }
                      }}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                        isSelected 
                          ? 'bg-[#DDF5F0] text-[#007F78] border-[#007F78] font-medium' 
                          : 'bg-white text-[#55706B] border-[#DCE9E4] hover:bg-[#F7FAF8]'
                      }`}
                    >
                      {r}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <TextField isRequired fullWidth>
                <Label>Daily Calorie Target</Label>
                <Input
                  type="number"
                  placeholder="2000"
                  value={String(form.calorieTarget)}
                  onChange={(e) => dispatch(setCalorieTarget(Number(e.target.value) || 2000))}
                  fullWidth
                />
              </TextField>
              <div className="flex gap-2">
                {[1500, 2000, 2500].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => dispatch(setCalorieTarget(val))}
                    className="px-3 py-1 text-xs rounded-full border border-[#DCE9E4] bg-white text-[#55706B] hover:bg-[#F7FAF8] transition-colors"
                  >
                    {val} kcal
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 mt-2 rounded-xl bg-red-50 text-red-600 border border-red-200 text-sm">
              {error}
            </div>
          )}

          <Button
            size="lg"
            onPress={handleGenerate}
            isPending={isGenerating}
            isDisabled={!form.goal}
            className="w-full mt-4 bg-[#007F78] hover:bg-[#005F5A] text-white rounded-xl"
          >
            ✨ Generate Meal Plan
          </Button>
        </Card.Content>
      </Card>

      {isGenerating && <AgentLoadingState agentName="Meal Planning" />}

      {plan && !isGenerating && (
        <div className="flex flex-col gap-6 mt-4">
          <div className="bg-[#EEF7F3] rounded-2xl p-4 md:px-6 flex flex-wrap gap-6 items-center justify-between border border-[#DCE9E4]">
            <div className="flex gap-8">
              <div className="flex flex-col">
                <span className="text-xs text-[#849A95] uppercase tracking-wide font-semibold">Total Calories</span>
                <span className="font-semibold text-lg text-[#163330]">{totalCalories}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#849A95] uppercase tracking-wide font-semibold">Avg/Day</span>
                <span className="font-semibold text-lg text-[#163330]">~{Math.round(totalCalories / 7)}</span>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex flex-col items-end">
                <span className="text-xs text-[#849A95] uppercase tracking-wide font-semibold mb-1">Macro Split</span>
                <div className="flex gap-2 text-sm font-medium">
                  <span className="text-[#007F78]">{pPct}% P</span>
                  <span className="text-[#F59E0B]">{cPct}% C</span>
                  <span className="text-[#EF4444]">{fPct}% F</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-[#163330]">Your 7-Day Plan</h2>
              <Chip className="bg-[#DDF5F0] text-[#007F78] font-medium border-none" size="sm">
                ~{Math.round(totalCalories / 7)} cal/day avg
              </Chip>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onPress={handleDownloadPdf}
                className="bg-white border border-[#DCE9E4] text-[#163330] hover:bg-[#F7FAF8]"
              >
                <DownloadIcon className="size-4" />
                Download PDF
              </Button>
              <Button
                variant="outline"
                onPress={() => runGeneration(lastSource)}
                isPending={isGenerating}
                className="border-[#DCE9E4] text-[#163330] hover:bg-[#F7FAF8]"
              >
                Regenerate
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {plan.map((day) => (
              <DayCard key={day.day} day={day} />
            ))}
          </div>
        </div>
      )}

      <Modal state={sourceModal}>
        <Modal.Backdrop>
          <Modal.Container placement="center" size="md">
            <Modal.Dialog className="rounded-2xl">
              <Modal.Header>
                <Modal.Heading className="text-lg font-bold text-[#163330]">How should your plan be built?</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <p className="text-sm text-[#55706B]">
                  Choose which meals the AI should pull from when generating your 7-day plan.
                </p>
                <div className="flex flex-col gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setPendingSource('random')}
                    className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                      pendingSource === 'random'
                        ? 'border-[#007F78] bg-[#DDF5F0]'
                        : 'border-[#DCE9E4] hover:bg-[#F7FAF8] bg-white'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex items-center justify-center w-5 h-5 rounded-full border ${
                        pendingSource === 'random'
                          ? 'border-[#007F78] bg-[#007F78] text-white'
                          : 'border-[#DCE9E4] bg-white'
                      }`}
                    >
                      {pendingSource === 'random' && <CheckIcon className="size-3" />}
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="font-medium text-[#163330]">
                        <PlusIcon className="size-4 inline mr-1 -mt-0.5" />
                        Random meals
                      </span>
                      <span className="text-sm text-[#55706B]">
                        The AI picks from the whole nutrition catalog, matching your goal, restrictions and calorie target.
                      </span>
                    </span>
                  </button>

                  <button
                    type="button"
                    disabled={!selectedEnabled}
                    onClick={() => setPendingSource('selected')}
                    className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                      !selectedEnabled
                        ? 'opacity-50 cursor-not-allowed bg-white border-[#DCE9E4]'
                        : pendingSource === 'selected'
                          ? 'border-[#007F78] bg-[#DDF5F0]'
                          : 'border-[#DCE9E4] hover:bg-[#F7FAF8] bg-white'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex items-center justify-center w-5 h-5 rounded-full border ${
                        pendingSource === 'selected'
                          ? 'border-[#007F78] bg-[#007F78] text-white'
                          : 'border-[#DCE9E4] bg-white'
                      }`}
                    >
                      {pendingSource === 'selected' && <CheckIcon className="size-3" />}
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="font-medium text-[#163330]">Selected meals ({selectedCount})</span>
                      <span className="text-sm text-[#55706B]">
                        The AI builds your plan exclusively from your selected meal list.
                      </span>
                      {!selectedEnabled && (
                        <span className="text-xs text-[#EF4444] mt-1">
                          Select at least {MIN_SELECTED} meals to use this option.
                        </span>
                      )}
                    </span>
                  </button>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button 
                  variant="secondary" 
                  onPress={() => setIsSourceModalOpen(false)}
                  className="bg-[#EEF7F3] text-[#163330] hover:bg-[#DCE9E4]"
                >
                  Cancel
                </Button>
                <Button 
                  onPress={confirmSource}
                  className="bg-[#007F78] text-white hover:bg-[#005F5A]"
                >
                  Continue
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}