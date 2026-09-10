'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import {
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
import {
  HiSparkles,
  HiLightningBolt,
  HiFire,
  HiScale,
  HiCheckCircle,
  HiArrowRight,
  HiDocumentDownload,
  HiBookmark,
  HiGlobeAlt,
  HiShieldCheck,
  HiChevronLeft,
  HiChevronRight,
  HiViewGrid,
  HiViewList,
} from 'react-icons/hi';
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
  {
    value: 'lose',
    label: 'Weight Loss',
    icon: '🔥',
    desc: 'Caloric deficit focused on sustainable fat loss',
    tag: '-500 kcal target',
  },
  {
    value: 'maintain',
    label: 'Maintain Weight',
    icon: '⚖️',
    desc: 'Equilibrium nutrition for consistent vitality',
    tag: 'Metabolic balance',
  },
  {
    value: 'gain',
    label: 'Muscle Building',
    icon: '💪',
    desc: 'Nutrient-dense caloric surplus for hypertrophy',
    tag: 'High protein surplus',
  },
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
  { value: 'low', label: 'Budget-Friendly', icon: '💵', desc: 'Affordable staples & bulk ingredients' },
  { value: 'medium', label: 'Balanced', icon: '💳', desc: 'Everyday fresh produce & variety' },
  { value: 'high', label: 'Premium', icon: '💎', desc: 'Specialty cuts & organic ingredients' },
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
  const [activeDayTab, setActiveDayTab] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'focused' | 'all'>('focused');

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
      setActiveDayTab(0);
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
    // If user already picked a pending source on page, confirm or run
    runGeneration(pendingSource);
  };

  const confirmSource = () => {
    setIsSourceModalOpen(false);
    runGeneration(pendingSource);
  };

  // Plan totals
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

  // Live estimated macro distribution before plan generation
  const estimatedMacros = useMemo(() => {
    const cals = form.calorieTarget || 2000;
    let pRatio = 0.3;
    let cRatio = 0.45;
    let fRatio = 0.25;

    if (form.goal === 'lose') {
      pRatio = 0.35;
      cRatio = 0.35;
      fRatio = 0.3;
    } else if (form.goal === 'gain') {
      pRatio = 0.3;
      cRatio = 0.5;
      fRatio = 0.2;
    }

    if (form.restrictions.includes('keto') || form.restrictions.includes('low-carb')) {
      pRatio = 0.3;
      cRatio = 0.1;
      fRatio = 0.6;
    }

    const pGrams = Math.round((cals * pRatio) / 4);
    const cGrams = Math.round((cals * cRatio) / 4);
    const fGrams = Math.round((cals * fRatio) / 9);

    return {
      proteinGrams: pGrams,
      carbsGrams: cGrams,
      fatGrams: fGrams,
      proteinPct: Math.round(pRatio * 100),
      carbsPct: Math.round(cRatio * 100),
      fatPct: Math.round(fRatio * 100),
    };
  }, [form.calorieTarget, form.goal, form.restrictions]);

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
    <div className="flex flex-col gap-8 p-4 md:p-8 max-w-[1280px] mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE9E4]/60 dark:border-[#263835]/60 pb-6">
        <div className="flex flex-col gap-1.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] px-3.5 py-1 w-fit shadow-2xs">
            <span className="flex h-2 w-2 rounded-full bg-[#007F78] animate-pulse dark:bg-[#2DD4BF]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#007F78] dark:text-[#2DD4BF]">
              Autonomous Nutrition Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#163330] dark:text-[#E8F2EF] tracking-tight">
            AI Meal Planner Studio
          </h1>
          <p className="text-sm sm:text-base text-[#55706B] dark:text-[#A1B8B3] max-w-2xl">
            Configure your biometrics, budget, and dietary preferences. Our multi-agent AI synthesizes an optimal 7-day meal plan with zero ingredient conflicts.
          </p>
        </div>

        {plan && (
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="secondary"
              onPress={handleDownloadPdf}
              className="bg-white dark:bg-[#161f1e] border border-[#DCE9E4] dark:border-[#263835] text-[#163330] dark:text-[#E8F2EF] hover:bg-[#EEF7F3] dark:hover:bg-[#1b2b28] text-xs sm:text-sm font-semibold cursor-pointer"
            >
              <HiDocumentDownload className="size-4 text-[#007F78] dark:text-[#2DD4BF]" />
              Download PDF
            </Button>
            <Button
              onPress={() => runGeneration(lastSource)}
              isPending={isGenerating}
              className="bg-[#007F78] text-white hover:bg-[#005F5A] text-xs sm:text-sm font-semibold cursor-pointer"
            >
              <HiSparkles className="size-4" />
              Regenerate
            </Button>
          </div>
        )}
      </div>

      {/* AI Studio Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Preferences & Macro Configuration (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="rounded-2xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] shadow-sm overflow-hidden">
            <Card.Header className="px-6 pt-6 pb-2 border-b border-[#DCE9E4]/60 dark:border-[#263835]/60">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DDF5F0] dark:bg-[#007F78]/25 text-[#007F78] dark:text-[#2DD4BF] text-sm">
                    <HiScale className="size-4" />
                  </span>
                  <h2 className="text-lg font-bold text-[#163330] dark:text-[#E8F2EF]">
                    Nutrition Objectives & Constraints
                  </h2>
                </div>
                <span className="text-xs font-semibold text-[#849A95] dark:text-[#6E8883]">
                  Step 1 of 2
                </span>
              </div>
            </Card.Header>

            <Card.Content className="p-6 flex flex-col gap-6">
              {/* Step 1: Goal Interactive Cards */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#163330] dark:text-[#E8F2EF]">
                    Primary Fitness Goal
                  </label>
                  <span className="text-xs text-[#007F78] dark:text-[#2DD4BF] font-semibold">
                    {GOALS.find(g => g.value === form.goal)?.tag || 'Select a goal'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {GOALS.map((g) => {
                    const isSelected = form.goal === g.value;
                    return (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() => dispatch(setGoal(g.value))}
                        className={`group relative flex flex-col justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#007F78] bg-[#DDF5F0]/50 dark:border-[#2DD4BF] dark:bg-[#007F78]/25 shadow-xs'
                            : 'border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#121918] hover:border-[#007F78]/40 hover:bg-[#F7FAF8] dark:hover:bg-[#161f1e]'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-2">
                          <span className="text-2xl">{g.icon}</span>
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                              isSelected
                                ? 'border-[#007F78] bg-[#007F78] text-white'
                                : 'border-[#DCE9E4] dark:border-[#263835]'
                            }`}
                          >
                            {isSelected && <CheckIcon className="size-2.5" />}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[#163330] dark:text-[#E8F2EF]">
                            {g.label}
                          </h3>
                          <p className="mt-1 text-[11px] leading-relaxed text-[#55706B] dark:text-[#A1B8B3]">
                            {g.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Budget Segmented Control */}
              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#163330] dark:text-[#E8F2EF]">
                  Grocery Budget Level
                </label>
                <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl border border-[#DCE9E4] dark:border-[#263835] bg-[#F7FAF8] dark:bg-[#121918]">
                  {BUDGETS.map((b) => {
                    const isSelected = form.budget === b.value;
                    return (
                      <button
                        key={b.value}
                        type="button"
                        onClick={() => dispatch(setBudget(b.value as 'low' | 'medium' | 'high'))}
                        className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white dark:bg-[#161f1e] text-[#007F78] dark:text-[#2DD4BF] shadow-xs'
                            : 'text-[#55706B] dark:text-[#A1B8B3] hover:text-[#163330] dark:hover:text-[#E8F2EF]'
                        }`}
                      >
                        <span>{b.icon}</span>
                        <span>{b.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Dietary Restrictions & Allergens */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#163330] dark:text-[#E8F2EF]">
                    Dietary Restrictions & Allergens
                  </label>
                  <span className="text-xs text-[#849A95] dark:text-[#6E8883]">
                    {form.restrictions.length} active filter{form.restrictions.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
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
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#DDF5F0] dark:bg-[#007F78]/25 text-[#007F78] dark:text-[#2DD4BF] border-[#007F78] shadow-2xs'
                            : 'bg-white dark:bg-[#121918] text-[#55706B] dark:text-[#A1B8B3] border-[#DCE9E4] dark:border-[#263835] hover:border-[#007F78]/30 hover:bg-[#F7FAF8] dark:hover:bg-[#1b2b28]'
                        }`}
                      >
                        {isSelected && <HiCheckCircle className="size-3.5 text-[#007F78] dark:text-[#2DD4BF]" />}
                        <span className="capitalize">{r}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Calorie Target & Real-Time Macro Split Estimator */}
              <div className="flex flex-col gap-3 rounded-2xl border border-[#DCE9E4] dark:border-[#263835] bg-[#F7FAF8] dark:bg-[#121918] p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#163330] dark:text-[#E8F2EF]">
                      Daily Calorie Target
                    </label>
                    <span className="text-xs text-[#55706B] dark:text-[#A1B8B3]">
                      Energy target per 24-hour cycle
                    </span>
                  </div>
                  <span className="text-xl font-black text-[#007F78] dark:text-[#2DD4BF]">
                    {form.calorieTarget || 2000} kcal
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={1200}
                    max={4000}
                    step={50}
                    value={form.calorieTarget || 2000}
                    onChange={(e) => dispatch(setCalorieTarget(Number(e.target.value)))}
                    className="w-full accent-[#007F78] cursor-pointer h-2 bg-[#DCE9E4] dark:bg-[#263835] rounded-lg"
                  />
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] text-[#849A95] dark:text-[#6E8883]">Quick presets:</span>
                  <div className="flex gap-2">
                    {[1600, 2000, 2400, 2800].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => dispatch(setCalorieTarget(val))}
                        className={`px-2.5 py-1 text-xs rounded-lg border transition-all cursor-pointer ${
                          form.calorieTarget === val
                            ? 'bg-[#007F78] text-white border-[#007F78] font-bold shadow-2xs'
                            : 'bg-white dark:bg-[#161f1e] text-[#55706B] dark:text-[#A1B8B3] border-[#DCE9E4] dark:border-[#263835] hover:bg-[#EEF7F3] dark:hover:bg-[#1b2b28]'
                        }`}
                      >
                        {val} kcal
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Estimated Macro Split preview bar */}
                <div className="mt-2 pt-3 border-t border-[#DCE9E4] dark:border-[#263835] flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#55706B] dark:text-[#A1B8B3]">
                    <span>Estimated Macro Allocation</span>
                    <span className="text-[#163330] dark:text-[#E8F2EF]">
                      P: {estimatedMacros.proteinPct}% • C: {estimatedMacros.carbsPct}% • F: {estimatedMacros.fatPct}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white dark:bg-[#161f1e] flex">
                    <div style={{ width: `${estimatedMacros.proteinPct}%` }} className="bg-[#007F78] transition-all duration-300" />
                    <div style={{ width: `${estimatedMacros.carbsPct}%` }} className="bg-[#F59E0B] transition-all duration-300" />
                    <div style={{ width: `${estimatedMacros.fatPct}%` }} className="bg-[#EF4444] transition-all duration-300" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#849A95] dark:text-[#6E8883]">
                    <span className="text-[#007F78] dark:text-[#2DD4BF] font-semibold">
                      Protein ~{estimatedMacros.proteinGrams}g
                    </span>
                    <span className="text-[#F59E0B] font-semibold">
                      Carbs ~{estimatedMacros.carbsGrams}g
                    </span>
                    <span className="text-red-500 font-semibold">
                      Fat ~{estimatedMacros.fatGrams}g
                    </span>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Right Column: Source Selection & Generation Trigger (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card className="rounded-2xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] shadow-sm">
            <Card.Header className="px-6 pt-6 pb-2 border-b border-[#DCE9E4]/60 dark:border-[#263835]/60">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DDF5F0] dark:bg-[#007F78]/25 text-[#007F78] dark:text-[#2DD4BF] text-sm">
                    <HiBookmark className="size-4" />
                  </span>
                  <h2 className="text-lg font-bold text-[#163330] dark:text-[#E8F2EF]">
                    Meal Bank Source
                  </h2>
                </div>
                <span className="text-xs font-semibold text-[#849A95] dark:text-[#6E8883]">
                  Step 2 of 2
                </span>
              </div>
            </Card.Header>

            <Card.Content className="p-6 flex flex-col gap-4">
              <p className="text-xs text-[#55706B] dark:text-[#A1B8B3] leading-relaxed">
                Choose whether the AI explores the entire verified meal database or restricts generation to your personal bookmarked recipes.
              </p>

              {/* Source Option A: Global Catalog */}
              <button
                type="button"
                onClick={() => setPendingSource('random')}
                className={`flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  pendingSource === 'random'
                    ? 'border-[#007F78] bg-[#DDF5F0]/50 dark:border-[#2DD4BF] dark:bg-[#007F78]/25 shadow-2xs'
                    : 'border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#121918] hover:border-[#007F78]/30 hover:bg-[#F7FAF8] dark:hover:bg-[#161f1e]'
                }`}
              >
                <span
                  className={`mt-0.5 flex items-center justify-center w-5 h-5 rounded-full border flex-shrink-0 ${
                    pendingSource === 'random'
                      ? 'border-[#007F78] bg-[#007F78] text-white'
                      : 'border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e]'
                  }`}
                >
                  {pendingSource === 'random' && <CheckIcon className="size-3" />}
                </span>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-[#163330] dark:text-[#E8F2EF]">
                    <HiGlobeAlt className="size-4 text-[#007F78] dark:text-[#2DD4BF]" />
                    <span>Global Nutrition Catalog</span>
                  </div>
                  <p className="text-xs text-[#55706B] dark:text-[#A1B8B3] leading-relaxed">
                    AI picks from the full verified recipe repository, optimizing for your exact calorie target and macro requirements.
                  </p>
                </div>
              </button>

              {/* Source Option B: Selected Meals */}
              <button
                type="button"
                disabled={!selectedEnabled}
                onClick={() => setPendingSource('selected')}
                className={`flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  !selectedEnabled
                    ? 'opacity-60 cursor-not-allowed bg-[#F7FAF8] dark:bg-[#121918] border-[#DCE9E4] dark:border-[#263835]'
                    : pendingSource === 'selected'
                      ? 'border-[#007F78] bg-[#DDF5F0]/50 dark:border-[#2DD4BF] dark:bg-[#007F78]/25 shadow-2xs'
                      : 'border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#121918] hover:border-[#007F78]/30 hover:bg-[#F7FAF8] dark:hover:bg-[#161f1e]'
                }`}
              >
                <span
                  className={`mt-0.5 flex items-center justify-center w-5 h-5 rounded-full border flex-shrink-0 ${
                    pendingSource === 'selected'
                      ? 'border-[#007F78] bg-[#007F78] text-white'
                      : 'border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e]'
                  }`}
                >
                  {pendingSource === 'selected' && <CheckIcon className="size-3" />}
                </span>
                <div className="flex flex-col gap-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-sm text-[#163330] dark:text-[#E8F2EF]">
                      <HiBookmark className="size-4 text-[#007F78] dark:text-[#2DD4BF]" />
                      <span>My Bookmarked Meals</span>
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        selectedEnabled
                          ? 'bg-[#EAF7DE] dark:bg-[#65B82E]/20 text-[#65B82E]'
                          : 'bg-[#FEF3C7] dark:bg-[#F59E0B]/20 text-[#92400E] dark:text-[#FCD34D]'
                      }`}
                    >
                      {selectedCount} / 10 required
                    </span>
                  </div>
                  <p className="text-xs text-[#55706B] dark:text-[#A1B8B3] leading-relaxed">
                    Builds exclusively from your saved favorite recipes in your personal library.
                  </p>

                  {!selectedEnabled && (
                    <div className="mt-2 flex items-center justify-between text-xs pt-1 border-t border-[#DCE9E4]/60 dark:border-[#263835]/60">
                      <span className="text-amber-700 dark:text-amber-400 font-medium">
                        Select {MIN_SELECTED - selectedCount} more meal{MIN_SELECTED - selectedCount === 1 ? '' : 's'}
                      </span>
                      <Link
                        href="/meals"
                        className="text-[#007F78] dark:text-[#2DD4BF] hover:underline font-bold"
                      >
                        Browse meals →
                      </Link>
                    </div>
                  )}
                </div>
              </button>

              {/* Engine Highlights */}
              <div className="rounded-xl border border-[#DCE9E4] dark:border-[#263835] bg-[#F7FAF8] dark:bg-[#121918] p-3.5 flex flex-col gap-2 mt-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#163330] dark:text-[#E8F2EF]">
                  <HiShieldCheck className="size-4 text-[#007F78] dark:text-[#2DD4BF]" />
                  <span>Multi-Agent Constraint Verification</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#55706B] dark:text-[#A1B8B3]">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#65B82E]" />
                    Zero allergen conflicts
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#65B82E]" />
                    Balanced daily macros
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#65B82E]" />
                    Full 7-day schedule
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#65B82E]" />
                    Instant PDF export
                  </span>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 text-xs sm:text-sm">
                  {error}
                </div>
              )}

              {/* Primary Launch Button */}
              <Button
                size="lg"
                onPress={handleGenerate}
                isPending={isGenerating}
                isDisabled={!form.goal}
                className="w-full bg-gradient-to-r from-[#007F78] to-[#005F5A] hover:from-[#005F5A] hover:to-[#004743] text-white rounded-xl shadow-md shadow-[#007F78]/20 font-bold text-sm sm:text-base py-3.5 cursor-pointer mt-1"
              >
                <HiSparkles className="size-5" />
                <span>{isGenerating ? 'Synthesizing 7-Day Plan...' : 'Generate 7-Day Meal Plan'}</span>
              </Button>
            </Card.Content>
          </Card>
        </div>
      </div>

      {/* Loading State Animation */}
      {isGenerating && (
        <div className="py-8">
          <AgentLoadingState agentName="Meal Planning" />
        </div>
      )}

      {/* Generated Plan Section */}
      {plan && !isGenerating && (
        <div className="flex flex-col gap-6 mt-4 pt-4 border-t border-[#DCE9E4]/60 dark:border-[#263835]/60">
          {/* Metabolic Summary Dashboard Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#849A95] dark:text-[#6E8883]">
                Total Week Energy
              </span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-[#163330] dark:text-[#E8F2EF]">
                  {totalCalories.toLocaleString()}
                </span>
                <span className="text-xs text-[#55706B] dark:text-[#A1B8B3]">kcal</span>
              </div>
              <span className="mt-1 text-[11px] text-[#007F78] dark:text-[#2DD4BF] font-semibold">
                Across 21 curated meals
              </span>
            </div>

            <div className="rounded-2xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#849A95] dark:text-[#6E8883]">
                Daily Calorie Average
              </span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-[#163330] dark:text-[#E8F2EF]">
                  ~{Math.round(totalCalories / 7)}
                </span>
                <span className="text-xs text-[#55706B] dark:text-[#A1B8B3]">kcal / day</span>
              </div>
              <span className="mt-1 text-[11px] text-[#65B82E] font-semibold">
                Target: {form.calorieTarget || 2000} kcal
              </span>
            </div>

            <div className="rounded-2xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#849A95] dark:text-[#6E8883]">
                Macro Balance Split
              </span>
              <div className="mt-2 flex items-center gap-2 text-sm font-bold">
                <span className="text-[#007F78] dark:text-[#2DD4BF]">{pPct}% P</span>
                <span className="text-[#F59E0B]">{cPct}% C</span>
                <span className="text-[#EF4444]">{fPct}% F</span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-[#EEF7F3] dark:bg-[#1b2b28] flex overflow-hidden">
                <div style={{ width: `${pPct}%` }} className="bg-[#007F78]" />
                <div style={{ width: `${cPct}%` }} className="bg-[#F59E0B]" />
                <div style={{ width: `${fPct}%` }} className="bg-[#EF4444]" />
              </div>
            </div>

            <div className="rounded-2xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#849A95] dark:text-[#6E8883]">
                Plan Intelligence
              </span>
              <div className="mt-2 flex items-center gap-1.5 font-bold text-sm text-[#163330] dark:text-[#E8F2EF]">
                <HiShieldCheck className="size-4 text-[#007F78] dark:text-[#2DD4BF]" />
                <span>
                  {lastSource === 'selected' ? 'Curated Library' : 'Global Catalog'}
                </span>
              </div>
              <span className="mt-1 text-[11px] text-[#849A95] dark:text-[#6E8883]">
                Status: Ready for PDF & Kitchen
              </span>
            </div>
          </div>

          {/* Interactive Week Controller Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3">
              <h3 className="text-xl sm:text-2xl font-bold text-[#163330] dark:text-[#E8F2EF]">
                Your 7-Day Weekly Schedule
              </h3>
              <Chip className="bg-[#DDF5F0] dark:bg-[#007F78]/25 text-[#007F78] dark:text-[#2DD4BF] font-bold border-none" size="sm">
                7 Days Generated
              </Chip>
            </div>

            {/* View Mode Switcher (Focused Day vs All Days) */}
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-xl border border-[#DCE9E4] dark:border-[#263835] p-0.5 bg-[#F7FAF8] dark:bg-[#121918]">
                <button
                  type="button"
                  onClick={() => setViewMode('focused')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    viewMode === 'focused'
                      ? 'bg-white dark:bg-[#161f1e] text-[#007F78] dark:text-[#2DD4BF] shadow-xs'
                      : 'text-[#55706B] dark:text-[#A1B8B3] hover:text-[#163330]'
                  }`}
                >
                  <HiViewList className="size-3.5" />
                  <span>Day Focus</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('all')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    viewMode === 'all'
                      ? 'bg-white dark:bg-[#161f1e] text-[#007F78] dark:text-[#2DD4BF] shadow-xs'
                      : 'text-[#55706B] dark:text-[#A1B8B3] hover:text-[#163330]'
                  }`}
                >
                  <HiViewGrid className="size-3.5" />
                  <span>All 7 Days</span>
                </button>
              </div>

              <Button
                variant="secondary"
                onPress={handleDownloadPdf}
                className="bg-white dark:bg-[#161f1e] border border-[#DCE9E4] dark:border-[#263835] text-[#163330] dark:text-[#E8F2EF] hover:bg-[#EEF7F3] dark:hover:bg-[#1b2b28] text-xs font-bold cursor-pointer"
              >
                <DownloadIcon className="size-3.5" />
                PDF
              </Button>
            </div>
          </div>

          {/* 7-Day Tab Navigator (Always available for quick jump) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {plan.map((day, idx) => {
              const isSelected = activeDayTab === idx;
              const dayCal = day.meals.reduce((sum, m) => sum + (m.calories || 0), 0);
              return (
                <button
                  key={day.day}
                  type="button"
                  onClick={() => {
                    setActiveDayTab(idx);
                    if (viewMode === 'all') setViewMode('focused');
                  }}
                  className={`flex flex-col items-center min-w-[90px] p-2.5 rounded-xl border transition-all cursor-pointer flex-1 ${
                    isSelected
                      ? 'border-[#007F78] bg-[#007F78] text-white shadow-sm'
                      : 'border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] text-[#55706B] dark:text-[#A1B8B3] hover:border-[#007F78]/40 hover:bg-[#F7FAF8] dark:hover:bg-[#1b2b28]'
                  }`}
                >
                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-[#163330] dark:text-[#E8F2EF]'}`}>
                    Day {day.day}
                  </span>
                  <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#849A95] dark:text-[#6E8883]'}`}>
                    {dayCal} kcal
                  </span>
                </button>
              );
            })}
          </div>

          {/* Day Cards Presentation Area */}
          {viewMode === 'focused' ? (
            <div className="flex flex-col gap-4">
              {/* Day focus navigation arrows */}
              <div className="flex items-center justify-between px-1">
                <button
                  type="button"
                  disabled={activeDayTab === 0}
                  onClick={() => setActiveDayTab(prev => Math.max(0, prev - 1))}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#55706B] dark:text-[#A1B8B3] hover:text-[#007F78] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <HiChevronLeft className="size-4" />
                  <span>Previous Day</span>
                </button>

                <span className="text-xs font-bold text-[#849A95] dark:text-[#6E8883]">
                  Showing Day {plan[activeDayTab]?.day} of 7
                </span>

                <button
                  type="button"
                  disabled={activeDayTab === plan.length - 1}
                  onClick={() => setActiveDayTab(prev => Math.min(plan.length - 1, prev + 1))}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#55706B] dark:text-[#A1B8B3] hover:text-[#007F78] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>Next Day</span>
                  <HiChevronRight className="size-4" />
                </button>
              </div>

              {plan[activeDayTab] && (
                <DayCard day={plan[activeDayTab]} />
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {plan.map((day) => (
                <DayCard key={day.day} day={day} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Legacy Source Modal fallback support */}
      <Modal state={sourceModal}>
        <Modal.Backdrop>
          <Modal.Container placement="center" size="md">
            <Modal.Dialog className="rounded-2xl bg-white dark:bg-[#161f1e] border border-[#DCE9E4] dark:border-[#263835]">
              <Modal.Header>
                <Modal.Heading className="text-lg font-bold text-[#163330] dark:text-[#E8F2EF]">
                  Confirm Plan Source
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <p className="text-sm text-[#55706B] dark:text-[#A1B8B3]">
                  Choose which meals the AI should pull from when generating your 7-day plan.
                </p>
                <div className="flex flex-col gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setPendingSource('random')}
                    className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                      pendingSource === 'random'
                        ? 'border-[#007F78] bg-[#DDF5F0] dark:bg-[#007F78]/25'
                        : 'border-[#DCE9E4] dark:border-[#263835] hover:bg-[#F7FAF8] dark:hover:bg-[#203330] bg-white dark:bg-[#1b2b28]'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex items-center justify-center w-5 h-5 rounded-full border ${
                        pendingSource === 'random'
                          ? 'border-[#007F78] bg-[#007F78] text-white'
                          : 'border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e]'
                      }`}
                    >
                      {pendingSource === 'random' && <CheckIcon className="size-3" />}
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="font-medium text-[#163330] dark:text-[#E8F2EF]">
                        <PlusIcon className="size-4 inline mr-1 -mt-0.5" />
                        Global catalog meals
                      </span>
                      <span className="text-xs text-[#55706B] dark:text-[#A1B8B3]">
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
                        ? 'opacity-50 cursor-not-allowed bg-white dark:bg-[#1b2b28] border-[#DCE9E4] dark:border-[#263835]'
                        : pendingSource === 'selected'
                          ? 'border-[#007F78] bg-[#DDF5F0] dark:bg-[#007F78]/25'
                          : 'border-[#DCE9E4] dark:border-[#263835] hover:bg-[#F7FAF8] dark:hover:bg-[#203330] bg-white dark:bg-[#1b2b28]'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex items-center justify-center w-5 h-5 rounded-full border ${
                        pendingSource === 'selected'
                          ? 'border-[#007F78] bg-[#007F78] text-white'
                          : 'border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e]'
                      }`}
                    >
                      {pendingSource === 'selected' && <CheckIcon className="size-3" />}
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="font-medium text-[#163330] dark:text-[#E8F2EF]">
                        Selected meals ({selectedCount})
                      </span>
                      <span className="text-xs text-[#55706B] dark:text-[#A1B8B3]">
                        The AI builds your plan exclusively from your bookmarked meal list.
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
                  className="bg-[#EEF7F3] dark:bg-[#1b2b28] text-[#163330] dark:text-[#E8F2EF] hover:bg-[#DCE9E4] dark:hover:bg-[#263835]"
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