'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Modal, useOverlayState } from '@heroui/react';
import { getUserMeals } from '@/lib/api/dashboard';
import { getMyMealPlan } from '@/lib/api/mealplan';
import { downloadMealPlanPdf } from '@/lib/mealplanExport';
import { getFoodLog, logFood, deleteFoodLog } from '@/lib/api/log';
import { getAuthToken } from '@/lib/core/server';
import type { Meal } from '@/lib/types/meal';
import type { MealPlan } from '@/lib/types/mealplan';
import type { FoodLogEntry } from '@/lib/types/foodlog';
import { CaloriesLineChart } from './CaloriesLineChart';
import { MacroBreakdownChart } from './MacroBreakdownChart';
import { NutritionReportCard } from './NutritionReportCard';
import { AgentLoadingState } from '@/components/ai/AgentLoadingState';
import { analyzeNutrition } from '@/lib/api/nutrition';
import { ErrorFallback } from '@/components/feedback/ErrorFallback';
import { DownloadIcon, TrashIcon } from '@/components/ui/icons';
import { HiSparkles } from 'react-icons/hi';
import type { NutritionReport } from '@/lib/types/nutrition';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

type LogTab = 'meals' | 'plan' | 'custom';

export function DashboardContent({ greeting }: { greeting?: string } = {}) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);

  const [logEntries, setLogEntries] = useState<FoodLogEntry[]>([]);
  const [logLoading, setLogLoading] = useState(true);
  const [logRefreshKey, setLogRefreshKey] = useState(0);

  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [activePlanDay, setActivePlanDay] = useState(0);

  const [nutritionReport, setNutritionReport] = useState<NutritionReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState('');

  const [isLogOpen, setIsLogOpen] = useState(false);
  const logModal = useOverlayState({ isOpen: isLogOpen, onOpenChange: setIsLogOpen });
  const [logTab, setLogTab] = useState<LogTab>('meals');

  const [selectedMealId, setSelectedMealId] = useState<string>('');
  const [mealServings, setMealServings] = useState(1);
  const [mealDate, setMealDate] = useState(todayStr());

  const [planDayIdx, setPlanDayIdx] = useState(0);
  const [planMealIdx, setPlanMealIdx] = useState(0);
  const [planServings, setPlanServings] = useState(1);
  const [planDate, setPlanDate] = useState(todayStr());

  const [customName, setCustomName] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFat, setCustomFat] = useState('');
  const [customServings, setCustomServings] = useState(1);
  const [customDate, setCustomDate] = useState(todayStr());

  const [isLogging, setIsLogging] = useState(false);
  const [logError, setLogError] = useState('');
  const [quickLoggingIdx, setQuickLoggingIdx] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await getAuthToken();
      if (cancelled || !token) return;
      try {
        const { authClient } = await import('@/lib/auth/client');
        const { data: session } = await authClient.getSession();
        const ownerId = session?.user?.id;
        if (!ownerId) return;
        const res = await getUserMeals(ownerId, token, 30);
        if (!cancelled) setMeals(res.data);
      } catch (err) {
        if (!cancelled) {
          setMeals([]);
          setLoadError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await getAuthToken();
      if (cancelled || !token) return;
      try {
        const plan = await getMyMealPlan(token);
        if (!cancelled) setMealPlan(plan);
      } catch {
        if (!cancelled) setMealPlan(null);
      } finally {
        if (!cancelled) setPlanLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await getAuthToken();
      if (cancelled || !token) return;
      try {
        const { data } = await getFoodLog(token, { days: 30 });
        if (!cancelled) setLogEntries(data);
      } catch {
        if (!cancelled) setLogEntries([]);
      } finally {
        if (!cancelled) setLogLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [logRefreshKey]);

  const handleAnalyzeNutrition = async () => {
    setAnalysisError('');
    setIsAnalyzing(true);
    try {
      const token = await getAuthToken();
      if (!token) return;
      const result = await analyzeNutrition(token);
      if (result) setNutritionReport(result);
      else setAnalysisError('Failed to analyze nutrition. Please try again.');
    } catch {
      setAnalysisError('Failed to analyze nutrition. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const totalCalories = logEntries.reduce((sum, e) => sum + e.calories, 0);
  const totalProtein = logEntries.reduce((sum, e) => sum + e.macros.protein, 0);
  const totalCarbs = logEntries.reduce((sum, e) => sum + e.macros.carbs, 0);
  const totalFat = logEntries.reduce((sum, e) => sum + e.macros.fat, 0);
  const totalMacroGrams = totalProtein + totalCarbs + totalFat;
  const proteinPct = totalMacroGrams > 0 ? Math.round((totalProtein / totalMacroGrams) * 100) : 0;
  const carbsPct = totalMacroGrams > 0 ? Math.round((totalCarbs / totalMacroGrams) * 100) : 0;
  const fatPct = totalMacroGrams > 0 ? Math.round((totalFat / totalMacroGrams) * 100) : 0;

  const todayEntries = logEntries.filter((e) => e.consumedOn.slice(0, 10) === todayStr());
  const todayCalories = todayEntries.reduce((sum, e) => sum + e.calories, 0);
  const recentLogs = logEntries.slice(0, 6);

  const chartEntries = logEntries.map((e) => ({
    date: new Date(e.consumedOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    calories: e.calories,
    macros: e.macros,
  }));

  const refreshLog = async () => {
    const token = await getAuthToken();
    if (!token) return;
    const { data } = await getFoodLog(token, { days: 30 });
    setLogEntries(data);
  };

  const resetLogForm = () => {
    setSelectedMealId('');
    setMealServings(1);
    setMealDate(todayStr());
    setPlanDayIdx(0);
    setPlanMealIdx(0);
    setPlanServings(1);
    setPlanDate(todayStr());
    setCustomName('');
    setCustomCalories('');
    setCustomProtein('');
    setCustomCarbs('');
    setCustomFat('');
    setCustomServings(1);
    setCustomDate(todayStr());
    setLogError('');
  };

  const handleLogSubmit = async () => {
    const token = await getAuthToken();
    if (!token) return;
    setIsLogging(true);
    setLogError('');

    try {
      if (logTab === 'meals') {
        if (!selectedMealId) { setLogError('Select a meal first.'); return; }
        await logFood(token, { mealId: selectedMealId, servings: mealServings, consumedOn: `${mealDate}T13:00:00.000Z` });
      } else if (logTab === 'plan') {
        if (!mealPlan) { setLogError('No meal plan available.'); return; }
        const day = mealPlan.days[planDayIdx];
        const m = day?.meals[planMealIdx];
        if (!m) { setLogError('Select a meal from your plan.'); return; }
        await logFood(token, {
          name: m.name,
          calories: Math.round(m.calories * planServings),
          macros: {
            protein: Math.round(m.macros.protein * planServings),
            carbs: Math.round(m.macros.carbs * planServings),
            fat: Math.round(m.macros.fat * planServings),
          },
          servings: planServings,
          consumedOn: `${planDate}T13:00:00.000Z`,
        });
      } else {
        if (!customName || !customCalories || !customProtein || !customCarbs || !customFat) {
          setLogError('All fields are required.'); return;
        }
        await logFood(token, {
          name: customName,
          calories: Number(customCalories),
          macros: { protein: Number(customProtein), carbs: Number(customCarbs), fat: Number(customFat) },
          servings: customServings,
          consumedOn: `${customDate}T13:00:00.000Z`,
        });
      }
      await refreshLog();
      resetLogForm();
      setIsLogOpen(false);
    } catch {
      setLogError('Failed to log food. Please try again.');
    } finally {
      setIsLogging(false);
    }
  };

  const handleQuickLogPlanMeal = async (mealIdx: number) => {
    if (!mealPlan) return;
    const day = mealPlan.days[activePlanDay];
    const m = day?.meals[mealIdx];
    if (!m) return;

    const token = await getAuthToken();
    if (!token) return;

    setQuickLoggingIdx(mealIdx);
    try {
      await logFood(token, {
        name: m.name,
        calories: Math.round(m.calories),
        macros: {
          protein: Math.round(m.macros.protein),
          carbs: Math.round(m.macros.carbs),
          fat: Math.round(m.macros.fat),
        },
        servings: 1,
        consumedOn: `${todayStr()}T13:00:00.000Z`,
      });
      await refreshLog();
    } catch {
      // ignore or alert
    } finally {
      setQuickLoggingIdx(null);
    }
  };

  const handleDeleteLog = async (id: string) => {
    const token = await getAuthToken();
    if (!token) return;
    await deleteFoodLog(token, id);
    setLogEntries((prev) => prev.filter((e) => e._id !== id));
  };

  if (loadError) return <ErrorFallback error={loadError} />;
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-28 rounded-3xl bg-[#EEF7F3] dark:bg-[#161f1e] border border-[#DCE9E4] dark:border-[#263835]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] h-[110px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] h-[320px]" />
          <div className="rounded-3xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] h-[320px]" />
        </div>
      </div>
    );
  }

  const todayFormatted = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col gap-8">
      {/* ── Top Hero Command Banner ── */}
      <div className="relative overflow-hidden rounded-3xl border border-[#DCE9E4] dark:border-[#263835] bg-gradient-to-br from-white via-[#F7FAF8] to-[#EEF7F3] dark:from-[#161f1e] dark:via-[#141b1a] dark:to-[#1a2926] p-6 md:p-8 shadow-sm">
        {/* Glow ambient background element */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-[#007F78]/10 dark:bg-[#007F78]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 rounded-full bg-[#65B82E]/10 dark:bg-[#65B82E]/15 blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#DDF5F0] dark:bg-[#007F78]/25 text-[#007F78] dark:text-[#2DD4BF] border border-[#007F78]/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#007F78] dark:bg-[#2DD4BF] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#007F78] dark:text-[#2DD4BF]" />
                </span>
                Nutri AI Engine Live
              </span>
              <span className="text-xs font-medium text-[#849A95] dark:text-[#6E8883]">
                {todayFormatted}
              </span>
              {mealPlan && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EAF7DE] text-[#166534] dark:bg-[#65B82E]/20 dark:text-[#86EFAC]">
                  7-Day Plan Active
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#163330] dark:text-[#E8F2EF] tracking-tight">
              {greeting ? `${greeting} 👋` : 'Nutrition Command Center'}
            </h1>
            <p className="text-sm md:text-base text-[#55706B] dark:text-[#A1B8B3] max-w-xl">
              Track your daily energy balance, explore AI-guided insights, and achieve your wellness goals with intelligent precision.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0 flex-wrap sm:flex-nowrap">
            <Link
              href="/meal-plan"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#121918] hover:bg-[#EEF7F3] dark:hover:bg-[#1b2b28] text-sm font-semibold text-[#163330] dark:text-[#E8F2EF] transition-all !no-underline shadow-sm"
            >
              <svg className="w-4 h-4 text-[#007F78] dark:text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
              AI Meal Studio
            </Link>

            <button
              type="button"
              onClick={() => setIsLogOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#007F78] to-[#005F5A] hover:from-[#005F5A] hover:to-[#004743] text-white text-sm font-semibold shadow-md shadow-[#007F78]/25 hover:shadow-lg hover:shadow-[#007F78]/30 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Quick Log Meal
            </button>
          </div>
        </div>
      </div>

      {/* ── Key Performance Metrics Grid (4 Cards) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Foods Logged */}
        <div className="relative overflow-hidden rounded-2xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] p-5 shadow-sm hover:border-[#007F78]/30 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#849A95] dark:text-[#6E8883]">
              Activity
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#DDF5F0] dark:bg-[#007F78]/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#007F78] dark:text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl lg:text-3xl font-extrabold text-[#163330] dark:text-[#E8F2EF]">
              {logEntries.length}
            </p>
            <p className="text-xs font-medium text-[#55706B] dark:text-[#A1B8B3] mt-1">
              Foods logged over past 30 days
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#DCE9E4]/60 dark:border-[#263835] flex items-center justify-between text-[11px] text-[#849A95] dark:text-[#6E8883]">
            <span>Today: {todayEntries.length} logged</span>
            <span className="text-[#007F78] dark:text-[#2DD4BF] font-semibold">Active</span>
          </div>
        </div>

        {/* Card 2: Total Calories */}
        <div className="relative overflow-hidden rounded-2xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] p-5 shadow-sm hover:border-[#F59E0B]/30 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#849A95] dark:text-[#6E8883]">
              Energy (30d)
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] dark:bg-[#F59E0B]/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl lg:text-3xl font-extrabold text-[#163330] dark:text-[#E8F2EF]">
              {totalCalories.toLocaleString()}
              <span className="text-xs font-normal text-[#849A95] dark:text-[#6E8883] ml-1">kcal</span>
            </p>
            <p className="text-xs font-medium text-[#55706B] dark:text-[#A1B8B3] mt-1">
              Cumulative calorie intake
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#DCE9E4]/60 dark:border-[#263835] flex items-center justify-between text-[11px] text-[#849A95] dark:text-[#6E8883]">
            <span>Today: {todayCalories} kcal</span>
            <span className="text-[#F59E0B] font-semibold">Tracked</span>
          </div>
        </div>

        {/* Card 3: Calorie Density / Average */}
        <div className="relative overflow-hidden rounded-2xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] p-5 shadow-sm hover:border-[#65B82E]/30 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#849A95] dark:text-[#6E8883]">
              Average Density
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#EAF7DE] dark:bg-[#65B82E]/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#65B82E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl lg:text-3xl font-extrabold text-[#163330] dark:text-[#E8F2EF]">
              {logEntries.length ? Math.round(totalCalories / logEntries.length) : 0}
              <span className="text-xs font-normal text-[#849A95] dark:text-[#6E8883] ml-1">kcal / meal</span>
            </p>
            <p className="text-xs font-medium text-[#55706B] dark:text-[#A1B8B3] mt-1">
              Average intake per logged food
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#DCE9E4]/60 dark:border-[#263835] flex items-center justify-between text-[11px] text-[#849A95] dark:text-[#6E8883]">
            <span>Optimal baseline</span>
            <span className="text-[#65B82E] font-semibold">Balanced</span>
          </div>
        </div>

        {/* Card 4: Macro Split Ratio */}
        <div className="relative overflow-hidden rounded-2xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] p-5 shadow-sm hover:border-[#007F78]/30 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#849A95] dark:text-[#6E8883]">
              Macro Split
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#DDF5F0] dark:bg-[#007F78]/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#007F78] dark:text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-lg lg:text-xl font-extrabold text-[#163330] dark:text-[#E8F2EF]">
              {totalProtein}g <span className="text-xs text-[#849A95]">/</span> {totalCarbs}g <span className="text-xs text-[#849A95]">/</span> {totalFat}g
            </p>
            <div className="w-full h-2 rounded-full bg-[#EEF7F3] dark:bg-[#263835] flex overflow-hidden mt-2">
              <div style={{ width: `${proteinPct}%` }} className="bg-[#007F78] h-full" title={`Protein: ${proteinPct}%`} />
              <div style={{ width: `${carbsPct}%` }} className="bg-[#F59E0B] h-full" title={`Carbs: ${carbsPct}%`} />
              <div style={{ width: `${fatPct}%` }} className="bg-[#EF4444] h-full" title={`Fat: ${fatPct}%`} />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#DCE9E4]/60 dark:border-[#263835] flex items-center justify-between text-[11px] text-[#849A95] dark:text-[#6E8883]">
            <span className="text-[#007F78] dark:text-[#2DD4BF] font-semibold">P {proteinPct}%</span>
            <span className="text-[#F59E0B] font-semibold">C {carbsPct}%</span>
            <span className="text-[#EF4444] font-semibold">F {fatPct}%</span>
          </div>
        </div>
      </div>

      {/* ── Visual Charts Studio (Line & Donut) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calorie Trend Area Chart */}
        <div className="rounded-3xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-[#163330] dark:text-[#E8F2EF]">
                Calories Over Time
              </h2>
              <p className="text-xs text-[#849A95] dark:text-[#6E8883] mt-0.5">
                Trajectory analysis across the last 30 logged days
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF7F3] dark:bg-[#1b2b28] text-[#007F78] dark:text-[#2DD4BF] border border-[#DCE9E4] dark:border-[#263835]">
              Daily Trajectory
            </span>
          </div>
          <CaloriesLineChart entries={chartEntries} />
        </div>

        {/* Macro Distribution Donut Chart */}
        <div className="rounded-3xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-[#163330] dark:text-[#E8F2EF]">
                Macronutrient Breakdown
              </h2>
              <p className="text-xs text-[#849A95] dark:text-[#6E8883] mt-0.5">
                Proportional distribution of Protein, Carbs, and Fats
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF7F3] dark:bg-[#1b2b28] text-[#55706B] dark:text-[#A1B8B3] border border-[#DCE9E4] dark:border-[#263835]">
              Cumulative
            </span>
          </div>
          <MacroBreakdownChart entries={chartEntries} />
        </div>
      </div>

      {/* ── Interactive 7-Day Meal Plan Section ── */}
      <div className="rounded-3xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[#DCE9E4] dark:border-[#263835] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DDF5F0] dark:bg-[#007F78]/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#007F78] dark:text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#163330] dark:text-[#E8F2EF]">
                Your 7-Day Meal Plan
              </h2>
              <p className="text-xs text-[#849A95] dark:text-[#6E8883]">
                {mealPlan ? 'Browse daily meals and log them directly into your tracker with one click' : 'No active meal plan generated yet'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {mealPlan && (
              <button
                type="button"
                onClick={() => downloadMealPlanPdf(mealPlan)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#55706B] dark:text-[#A1B8B3] border border-[#DCE9E4] dark:border-[#263835] hover:bg-[#EEF7F3] dark:hover:bg-[#1b2b28] transition-all cursor-pointer"
              >
                <DownloadIcon className="size-3.5" />
                Export PDF
              </button>
            )}
            <Link
              href="/meal-plan"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#007F78] hover:bg-[#005F5A] text-white transition-all !no-underline shadow-sm"
            >
              {mealPlan ? 'Open Full Studio' : 'Generate AI Plan'}
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="p-6">
          {planLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-10 rounded-2xl bg-[#EEF7F3] dark:bg-[#1b2b28] w-72" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-40 rounded-2xl bg-[#EEF7F3] dark:bg-[#1b2b28]" />
                <div className="h-40 rounded-2xl bg-[#EEF7F3] dark:bg-[#1b2b28]" />
                <div className="h-40 rounded-2xl bg-[#EEF7F3] dark:bg-[#1b2b28]" />
              </div>
            </div>
          ) : mealPlan && mealPlan.days.length > 0 ? (
            <div className="flex flex-col gap-5">
              {/* Day Selector Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {mealPlan.days.map((day, idx) => (
                  <button
                    key={day.day}
                    type="button"
                    onClick={() => setActivePlanDay(idx)}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activePlanDay === idx
                        ? 'bg-[#007F78] text-white shadow-md shadow-[#007F78]/25'
                        : 'bg-[#EEF7F3] dark:bg-[#1b2b28] text-[#55706B] dark:text-[#A1B8B3] hover:bg-[#DDF5F0] dark:hover:bg-[#203330]'
                    }`}
                  >
                    Day {day.day}
                  </button>
                ))}
              </div>

              {/* Active Day Meals Grid */}
              {mealPlan.days[activePlanDay] && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mealPlan.days[activePlanDay].meals.map((meal, mealIdx) => (
                    <div
                      key={mealIdx}
                      className="rounded-2xl border border-[#DCE9E4] dark:border-[#263835] bg-[#F7FAF8] dark:bg-[#121918] p-4 flex flex-col justify-between hover:border-[#007F78]/40 transition-all group"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#007F78] dark:text-[#2DD4BF] bg-[#DDF5F0] dark:bg-[#007F78]/25 px-2.5 py-0.5 rounded-full">
                            Meal {mealIdx + 1}
                          </span>
                          <span className="text-xs font-bold text-[#163330] dark:text-[#E8F2EF]">
                            {meal.calories} kcal
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-[#163330] dark:text-[#E8F2EF] line-clamp-1">
                          {meal.name}
                        </h3>
                        <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                          <span className="px-2 py-0.5 rounded bg-[#DDF5F0] dark:bg-[#007F78]/20 text-[#007F78] dark:text-[#2DD4BF] font-semibold">
                            P: {meal.macros.protein}g
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#FEF3C7] dark:bg-[#F59E0B]/20 text-[#92400E] dark:text-[#FCD34D] font-semibold">
                            C: {meal.macros.carbs}g
                          </span>
                          <span className="px-2 py-0.5 rounded bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400 font-semibold">
                            F: {meal.macros.fat}g
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#DCE9E4]/60 dark:border-[#263835] flex items-center justify-between">
                        <span className="text-[11px] text-[#849A95] dark:text-[#6E8883]">
                          1 serving
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuickLogPlanMeal(mealIdx)}
                          disabled={quickLoggingIdx === mealIdx}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#007F78]/10 hover:bg-[#007F78] text-[#007F78] hover:text-white transition-all cursor-pointer disabled:opacity-50"
                        >
                          {quickLoggingIdx === mealIdx ? (
                            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                          ) : (
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                          )}
                          Log Meal
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl bg-gradient-to-br from-[#EEF7F3] to-[#F7FAF8] dark:from-[#1b2b28] dark:to-[#121918] border border-dashed border-[#007F78]/30 p-10 flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#DDF5F0] dark:bg-[#007F78]/25 flex items-center justify-center">
                <svg className="w-7 h-7 text-[#007F78] dark:text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#163330] dark:text-[#E8F2EF]">
                No Meal Plan Generated Yet
              </h3>
              <p className="text-xs text-[#55706B] dark:text-[#A1B8B3] max-w-sm">
                Harness our AI nutrition engine to craft a personalized 7-day meal roadmap matched to your precise calories and macronutrient ratios.
              </p>
              <Link href="/meal-plan" className="!no-underline mt-2">
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-xl bg-[#007F78] hover:bg-[#005F5A] text-white text-xs font-bold transition-all shadow-md shadow-[#007F78]/25 cursor-pointer"
                >
                  Create Your 7-Day Plan →
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── AI Nutrition Copilot Analysis ── */}
      <div className="rounded-3xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[#DCE9E4] dark:border-[#263835] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#007F78] to-[#65B82E] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#163330] dark:text-[#E8F2EF]">
                  Nutri AI Nutrition Copilot
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DDF5F0] dark:bg-[#007F78]/25 text-[#007F78] dark:text-[#2DD4BF]">
                  Intelligence v2
                </span>
              </div>
              <p className="text-xs text-[#849A95] dark:text-[#6E8883] mt-0.5">
                AI-driven diagnosis of your logged intake patterns, micronutrient risks, and meal timing
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAnalyzeNutrition}
            disabled={isAnalyzing}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#007F78] to-[#005F5A] hover:from-[#005F5A] hover:to-[#004743] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyzing Dietary Logs...
              </>
            ) : (
              <>
                <HiSparkles className="w-4 h-4 text-white" />
                {nutritionReport ? 'Re-run AI Analysis' : 'Analyze Nutrition'}
              </>
            )}
          </button>
        </div>

        <div className="p-6">
          {isAnalyzing && <AgentLoadingState agentName="Nutrition Intelligence" />}
          {analysisError && (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 text-xs font-medium">
              {analysisError}
            </div>
          )}
          {nutritionReport && !isAnalyzing ? (
            <NutritionReportCard report={nutritionReport} />
          ) : !isAnalyzing && (
            <div className="rounded-2xl bg-[#F7FAF8] dark:bg-[#121918] border border-[#DCE9E4] dark:border-[#263835] p-8 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#DDF5F0] dark:bg-[#007F78]/25 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#007F78] dark:text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.516 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
              </div>
              <p className="text-sm font-bold text-[#163330] dark:text-[#E8F2EF]">
                Ready to Evaluate Your Nutrition
              </p>
              <p className="text-xs text-[#849A95] dark:text-[#6E8883] max-w-sm">
                Click &quot;Analyze Nutrition&quot; to review your meal history, uncover potential micronutrient deficits, and receive actionable dietary adjustments.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Recently Logged Activity Feed ── */}
      <div className="rounded-3xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[#DCE9E4] dark:border-[#263835] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#163330] dark:text-[#E8F2EF]">
              Recent Food Logs
            </h2>
            <p className="text-xs text-[#849A95] dark:text-[#6E8883] mt-0.5">
              Live chronological feed of your recently consumed foods
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsLogOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#007F78] dark:text-[#2DD4BF] hover:text-[#005F5A] cursor-pointer"
          >
            + Add Entry
          </button>
        </div>

        <div className="p-6">
          {recentLogs.length === 0 ? (
            <div className="rounded-2xl bg-[#F7FAF8] dark:bg-[#121918] border border-[#DCE9E4] dark:border-[#263835] p-10 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#DDF5F0] dark:bg-[#007F78]/25 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#007F78] dark:text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-[#163330] dark:text-[#E8F2EF]">No food entries logged yet</p>
              <p className="text-xs text-[#849A95] dark:text-[#6E8883] max-w-xs">
                Start tracking what you eat to see real-time calorie counts and macronutrient analytics.
              </p>
              <button
                type="button"
                onClick={() => setIsLogOpen(true)}
                className="mt-1 px-4 py-2 rounded-xl bg-[#007F78] hover:bg-[#005F5A] text-white text-xs font-bold transition-all cursor-pointer"
              >
                Log Your First Meal
              </button>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-[#DCE9E4]/60 dark:divide-[#263835]">
              {recentLogs.map((entry) => (
                <div
                  key={entry._id}
                  className="flex items-center justify-between py-3.5 px-3 -mx-3 rounded-2xl hover:bg-[#F7FAF8] dark:hover:bg-[#121918] transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#DDF5F0] dark:bg-[#007F78]/20 text-[#007F78] dark:text-[#2DD4BF] flex items-center justify-center flex-shrink-0 font-bold text-sm">
                      {entry.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <p className="font-bold text-sm text-[#163330] dark:text-[#E8F2EF] truncate">
                        {entry.name}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap mt-0.5">
                        <span className="text-xs text-[#849A95] dark:text-[#6E8883]">
                          {new Date(entry.consumedOn).toLocaleDateString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                          {entry.servings !== 1 ? ` · ${entry.servings} servings` : ''}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#DDF5F0] dark:bg-[#007F78]/25 text-[#007F78] dark:text-[#2DD4BF]">
                            P {entry.macros.protein}g
                          </span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#FEF3C7] dark:bg-[#F59E0B]/20 text-[#92400E] dark:text-[#FCD34D]">
                            C {entry.macros.carbs}g
                          </span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400">
                            F {entry.macros.fat}g
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <p className="font-extrabold text-sm text-[#163330] dark:text-[#E8F2EF]">
                        {entry.calories}
                      </p>
                      <p className="text-[10px] text-[#849A95] dark:text-[#6E8883]">kcal</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteLog(entry._id)}
                      className="text-[#849A95] dark:text-[#6E8883] hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 opacity-0 group-hover:opacity-100 cursor-pointer"
                      aria-label="Delete entry"
                    >
                      <TrashIcon className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Redesigned Log Food Modal ── */}
      <Modal state={logModal}>
        <Modal.Backdrop>
          <Modal.Container placement="center" size="lg">
            <Modal.Dialog className="rounded-3xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] shadow-2xl p-6">
              <Modal.Header className="p-0 pb-4">
                <Modal.Heading className="text-xl font-extrabold text-[#163330] dark:text-[#E8F2EF]">
                  Log Food Entry
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body className="p-0">
                {/* Segmented Tab Pill Selector */}
                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#EEF7F3] dark:bg-[#121918] mb-5 border border-[#DCE9E4] dark:border-[#263835]">
                  {([['meals', 'My Catalog'], ['plan', 'From Plan'], ['custom', 'Custom Food']] as const).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => { setLogTab(key); setLogError(''); }}
                      className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        logTab === key
                          ? 'bg-white dark:bg-[#1b2b28] text-[#007F78] dark:text-[#2DD4BF] shadow-sm'
                          : 'text-[#55706B] dark:text-[#A1B8B3] hover:text-[#163330] dark:hover:text-[#E8F2EF]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {logError && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 text-xs font-semibold mb-4">
                    {logError}
                  </div>
                )}

                {/* My Meals Catalog Tab */}
                {logTab === 'meals' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-bold text-[#163330] dark:text-[#E8F2EF]">
                        Select from your Catalog
                      </span>
                      <div className="max-h-[220px] overflow-y-auto border border-[#DCE9E4] dark:border-[#263835] rounded-2xl divide-y divide-[#DCE9E4]/60 dark:divide-[#263835]">
                        {meals.length === 0 ? (
                          <div className="p-6 text-xs text-[#849A95] dark:text-[#6E8883] text-center">
                            No meals in your catalog. Add meals in &quot;Manage Meals&quot; or use Custom Food.
                          </div>
                        ) : (
                          meals.map((meal) => (
                            <button
                              key={meal._id}
                              type="button"
                              onClick={() => setSelectedMealId(meal._id)}
                              className={`w-full text-left flex items-center justify-between px-4 py-3 transition-all cursor-pointer ${
                                selectedMealId === meal._id
                                  ? 'bg-[#DDF5F0] dark:bg-[#007F78]/25 text-[#007F78] dark:text-[#2DD4BF]'
                                  : 'hover:bg-[#F7FAF8] dark:hover:bg-[#1b2b28]'
                              }`}
                            >
                              <div className="flex flex-col min-w-0">
                                <span className="font-bold text-sm text-[#163330] dark:text-[#E8F2EF] truncate">
                                  {meal.title}
                                </span>
                                <span className="text-xs text-[#849A95] dark:text-[#6E8883]">
                                  {meal.cuisineTag}
                                </span>
                              </div>
                              <span className="font-extrabold text-sm text-[#007F78] dark:text-[#2DD4BF] whitespace-nowrap ml-3">
                                {meal.calories} kcal
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-[#849A95] dark:text-[#6E8883]">Servings</span>
                        <input
                          type="number"
                          min={0.5}
                          step={0.5}
                          value={mealServings}
                          onChange={(e) => setMealServings(Number(e.target.value) || 1)}
                          className="px-3.5 py-2.5 rounded-xl border border-[#DCE9E4] dark:border-[#263835] bg-[#F7FAF8] dark:bg-[#121918] text-sm font-semibold text-[#163330] dark:text-[#E8F2EF] focus:outline-none focus:ring-2 focus:ring-[#007F78]/30 focus:border-[#007F78]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-[#849A95] dark:text-[#6E8883]">Consumed Date</span>
                        <input
                          type="date"
                          value={mealDate}
                          onChange={(e) => setMealDate(e.target.value)}
                          className="px-3.5 py-2.5 rounded-xl border border-[#DCE9E4] dark:border-[#263835] bg-[#F7FAF8] dark:bg-[#121918] text-sm font-semibold text-[#163330] dark:text-[#E8F2EF] focus:outline-none focus:ring-2 focus:ring-[#007F78]/30 focus:border-[#007F78]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* From Plan Tab */}
                {logTab === 'plan' && mealPlan && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold text-[#849A95] dark:text-[#6E8883]">Select Day</span>
                      <div className="flex flex-wrap gap-1.5">
                        {mealPlan.days.map((day, i) => (
                          <button
                            key={day.day}
                            type="button"
                            onClick={() => { setPlanDayIdx(i); setPlanMealIdx(0); }}
                            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                              planDayIdx === i
                                ? 'bg-[#007F78] text-white'
                                : 'bg-[#EEF7F3] dark:bg-[#1b2b28] text-[#55706B] dark:text-[#A1B8B3] hover:bg-[#DDF5F0]'
                            }`}
                          >
                            Day {day.day}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold text-[#849A95] dark:text-[#6E8883]">Select Meal</span>
                      <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto">
                        {mealPlan.days[planDayIdx]?.meals.map((m, i) => (
                          <button
                            key={`${planDayIdx}-${i}`}
                            type="button"
                            onClick={() => setPlanMealIdx(i)}
                            className={`w-full text-left flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
                              planMealIdx === i
                                ? 'border-[#007F78] bg-[#DDF5F0] dark:bg-[#007F78]/25'
                                : 'border-[#DCE9E4] dark:border-[#263835] hover:bg-[#EEF7F3] dark:hover:bg-[#1b2b28]'
                            }`}
                          >
                            <span className="font-bold text-sm text-[#163330] dark:text-[#E8F2EF]">{m.name}</span>
                            <span className="font-extrabold text-sm text-[#007F78] dark:text-[#2DD4BF]">{m.calories} kcal</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-[#849A95] dark:text-[#6E8883]">Servings</span>
                        <input
                          type="number"
                          min={0.5}
                          step={0.5}
                          value={planServings}
                          onChange={(e) => setPlanServings(Number(e.target.value) || 1)}
                          className="px-3.5 py-2.5 rounded-xl border border-[#DCE9E4] dark:border-[#263835] bg-[#F7FAF8] dark:bg-[#121918] text-sm font-semibold text-[#163330] dark:text-[#E8F2EF] focus:outline-none focus:ring-2 focus:ring-[#007F78]/30 focus:border-[#007F78]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-[#849A95] dark:text-[#6E8883]">Consumed Date</span>
                        <input
                          type="date"
                          value={planDate}
                          onChange={(e) => setPlanDate(e.target.value)}
                          className="px-3.5 py-2.5 rounded-xl border border-[#DCE9E4] dark:border-[#263835] bg-[#F7FAF8] dark:bg-[#121918] text-sm font-semibold text-[#163330] dark:text-[#E8F2EF] focus:outline-none focus:ring-2 focus:ring-[#007F78]/30 focus:border-[#007F78]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {logTab === 'plan' && !mealPlan && (
                  <p className="text-xs text-[#849A95] dark:text-[#6E8883] text-center py-8">
                    Generate an AI meal plan first to log planned meals directly.
                  </p>
                )}

                {/* Custom Food Tab */}
                {logTab === 'custom' && (
                  <div className="flex flex-col gap-3.5">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-[#849A95] dark:text-[#6E8883]">Food Name</span>
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="e.g., Avocado Toast & Poached Egg"
                        className="px-3.5 py-2.5 rounded-xl border border-[#DCE9E4] dark:border-[#263835] bg-[#F7FAF8] dark:bg-[#121918] text-sm font-semibold text-[#163330] dark:text-[#E8F2EF] placeholder:text-[#849A95] dark:placeholder:text-[#6E8883] focus:outline-none focus:ring-2 focus:ring-[#007F78]/30 focus:border-[#007F78]"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-[#849A95] dark:text-[#6E8883]">Calories</span>
                        <input
                          type="number"
                          min={0}
                          value={customCalories}
                          onChange={(e) => setCustomCalories(e.target.value)}
                          placeholder="kcal"
                          className="px-3 py-2 rounded-xl border border-[#DCE9E4] dark:border-[#263835] bg-[#F7FAF8] dark:bg-[#121918] text-sm font-semibold text-[#163330] dark:text-[#E8F2EF] focus:outline-none focus:ring-2 focus:ring-[#007F78]/30 focus:border-[#007F78]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-[#849A95] dark:text-[#6E8883]">Protein (g)</span>
                        <input
                          type="number"
                          min={0}
                          value={customProtein}
                          onChange={(e) => setCustomProtein(e.target.value)}
                          placeholder="g"
                          className="px-3 py-2 rounded-xl border border-[#DCE9E4] dark:border-[#263835] bg-[#F7FAF8] dark:bg-[#121918] text-sm font-semibold text-[#163330] dark:text-[#E8F2EF] focus:outline-none focus:ring-2 focus:ring-[#007F78]/30 focus:border-[#007F78]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-[#849A95] dark:text-[#6E8883]">Carbs (g)</span>
                        <input
                          type="number"
                          min={0}
                          value={customCarbs}
                          onChange={(e) => setCustomCarbs(e.target.value)}
                          placeholder="g"
                          className="px-3 py-2 rounded-xl border border-[#DCE9E4] dark:border-[#263835] bg-[#F7FAF8] dark:bg-[#121918] text-sm font-semibold text-[#163330] dark:text-[#E8F2EF] focus:outline-none focus:ring-2 focus:ring-[#007F78]/30 focus:border-[#007F78]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-[#849A95] dark:text-[#6E8883]">Fat (g)</span>
                        <input
                          type="number"
                          min={0}
                          value={customFat}
                          onChange={(e) => setCustomFat(e.target.value)}
                          placeholder="g"
                          className="px-3 py-2 rounded-xl border border-[#DCE9E4] dark:border-[#263835] bg-[#F7FAF8] dark:bg-[#121918] text-sm font-semibold text-[#163330] dark:text-[#E8F2EF] focus:outline-none focus:ring-2 focus:ring-[#007F78]/30 focus:border-[#007F78]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-[#849A95] dark:text-[#6E8883]">Servings</span>
                        <input
                          type="number"
                          min={0.5}
                          step={0.5}
                          value={customServings}
                          onChange={(e) => setCustomServings(Number(e.target.value) || 1)}
                          className="px-3.5 py-2.5 rounded-xl border border-[#DCE9E4] dark:border-[#263835] bg-[#F7FAF8] dark:bg-[#121918] text-sm font-semibold text-[#163330] dark:text-[#E8F2EF] focus:outline-none focus:ring-2 focus:ring-[#007F78]/30 focus:border-[#007F78]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-[#849A95] dark:text-[#6E8883]">Consumed Date</span>
                        <input
                          type="date"
                          value={customDate}
                          onChange={(e) => setCustomDate(e.target.value)}
                          className="px-3.5 py-2.5 rounded-xl border border-[#DCE9E4] dark:border-[#263835] bg-[#F7FAF8] dark:bg-[#121918] text-sm font-semibold text-[#163330] dark:text-[#E8F2EF] focus:outline-none focus:ring-2 focus:ring-[#007F78]/30 focus:border-[#007F78]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer className="p-0 pt-5 flex items-center justify-end gap-2 border-t border-[#DCE9E4]/60 dark:border-[#263835] mt-5">
                <Button
                  variant="secondary"
                  onPress={() => { resetLogForm(); setIsLogOpen(false); }}
                  className="rounded-xl px-4 py-2.5 text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onPress={handleLogSubmit}
                  isPending={isLogging}
                  className="rounded-xl px-5 py-2.5 text-xs font-bold bg-[#007F78] hover:bg-[#005F5A] text-white shadow-md shadow-[#007F78]/25"
                >
                  Confirm & Log Food
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}