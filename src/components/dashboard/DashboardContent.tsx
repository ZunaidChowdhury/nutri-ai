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
import { DayCard } from '@/components/mealplan/DayCard';
import { CaloriesLineChart } from './CaloriesLineChart';
import { MacroBreakdownChart } from './MacroBreakdownChart';
import { NutritionReportCard } from './NutritionReportCard';
import { AgentLoadingState } from '@/components/ai/AgentLoadingState';
import { analyzeNutrition } from '@/lib/api/nutrition';
import { ErrorFallback } from '@/components/feedback/ErrorFallback';
import { DownloadIcon, TrashIcon } from '@/components/ui/icons';
import type { NutritionReport } from '@/lib/types/nutrition';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

type LogTab = 'meals' | 'plan' | 'custom';

export function DashboardContent() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);

  const [logEntries, setLogEntries] = useState<FoodLogEntry[]>([]);
  const [logLoading, setLogLoading] = useState(true);
  const [logRefreshKey, setLogRefreshKey] = useState(0);

  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [planLoading, setPlanLoading] = useState(true);

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

  const planStart = mealPlan?.createdAt ? new Date(mealPlan.createdAt) : null;

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
  const recentLogs = logEntries.slice(0, 5);

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
          macros: { protein: Math.round(m.macros.protein * planServings), carbs: Math.round(m.macros.carbs * planServings), fat: Math.round(m.macros.fat * planServings) },
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

  const handleDeleteLog = async (id: string) => {
    const token = await getAuthToken();
    if (!token) return;
    await deleteFoodLog(token, id);
    setLogEntries((prev) => prev.filter((e) => e._id !== id));
  };

  if (loadError) return <ErrorFallback error={loadError} />;
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] h-[100px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Foods Logged */}
        <div className="rounded-2xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] p-5 flex items-center gap-4">
          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#DDF5F0] dark:bg-[#007F78]/25 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#007F78] dark:text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-[#849A95] dark:text-[#6E8883]">Foods Logged (30d)</p>
            <p className="text-2xl font-bold text-[#163330] dark:text-[#E8F2EF]">{logEntries.length}</p>
          </div>
        </div>

        {/* Total Calories */}
        <div className="rounded-2xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] p-5 flex items-center gap-4">
          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#FEF3C7] dark:bg-[#F59E0B]/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-[#849A95] dark:text-[#6E8883]">Total Calories (30d)</p>
            <p className="text-2xl font-bold text-[#163330] dark:text-[#E8F2EF]">{totalCalories.toLocaleString()}</p>
          </div>
        </div>

        {/* Avg Calories/Day */}
        <div className="rounded-2xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] p-5 flex items-center gap-4">
          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#EAF7DE] dark:bg-[#65B82E]/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#65B82E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-[#849A95] dark:text-[#6E8883]">Avg Cal / Food</p>
            <p className="text-2xl font-bold text-[#163330] dark:text-[#E8F2EF]">
              {logEntries.length ? Math.round(totalCalories / logEntries.length) : 0}
            </p>
          </div>
        </div>

        {/* Macro Balance */}
        <div className="rounded-2xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] p-5 flex items-center gap-4">
          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#DDF5F0] dark:bg-[#007F78]/25 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#007F78] dark:text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-[#849A95] dark:text-[#6E8883]">Macro Split (P/C/F)</p>
            <p className="text-lg font-bold text-[#163330] dark:text-[#E8F2EF]">
              {totalProtein}g / {totalCarbs}g / {totalFat}g
            </p>
          </div>
        </div>
      </div>

      {/* ── Log Meal Button ── */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsLogOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#007F78] hover:bg-[#005F5A] text-white text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Log Meal
        </button>
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] overflow-hidden">
          <div className="px-5 pt-5 pb-2">
            <h2 className="text-lg font-semibold text-[#163330] dark:text-[#E8F2EF]">Calories Over Time</h2>
            <p className="text-xs text-[#849A95] dark:text-[#6E8883] mt-0.5">Last 30 days</p>
          </div>
          <div className="px-5 pb-5">
            <CaloriesLineChart entries={chartEntries} />
          </div>
        </div>
        <div className="rounded-2xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] overflow-hidden">
          <div className="px-5 pt-5 pb-2">
            <h2 className="text-lg font-semibold text-[#163330] dark:text-[#E8F2EF]">Macro Breakdown</h2>
            <p className="text-xs text-[#849A95] dark:text-[#6E8883] mt-0.5">Aggregated over 30 days</p>
          </div>
          <div className="px-5 pb-5">
            <MacroBreakdownChart entries={chartEntries} />
          </div>
        </div>
      </div>

      {/* ── Meal Plan Preview ── */}
      <div className="rounded-2xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] overflow-hidden">
        <div className="px-5 pt-5 pb-3 flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-lg font-semibold text-[#163330] dark:text-[#E8F2EF]">Your 7-Day Meal Plan</h2>
          <div className="flex items-center gap-2">
            {mealPlan && (
              <button
                type="button"
                onClick={() => downloadMealPlanPdf(mealPlan)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[#55706B] dark:text-[#A1B8B3] border border-[#DCE9E4] dark:border-[#263835] hover:bg-[#EEF7F3] dark:hover:bg-[#1b2b28] transition-colors"
              >
                <DownloadIcon className="size-4" />
                PDF
              </button>
            )}
            <Link
              href="/meal-plan"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-[#007F78] dark:text-[#2DD4BF] hover:bg-[#DDF5F0] dark:hover:bg-[#007F78]/25 transition-colors !no-underline"
            >
              {mealPlan ? 'Edit Plan' : 'Generate Plan'}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
        <div className="px-5 pb-5">
          {planLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-24 rounded-xl bg-[#EEF7F3] dark:bg-[#1b2b28]" />
              <div className="h-24 rounded-xl bg-[#EEF7F3] dark:bg-[#1b2b28]" />
            </div>
          ) : mealPlan && planStart ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between text-sm text-[#849A95] dark:text-[#6E8883]">
                <span>
                  Generated for week of {planStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
              {mealPlan.days.slice(0, 3).map((day) => {
                const dayDate = new Date(planStart);
                dayDate.setDate(planStart.getDate() + (day.day - 1));
                return (
                  <DayCard
                    key={day.day}
                    day={day}
                    dateLabel={dayDate.toLocaleDateString(undefined, {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                    })}
                  />
                );
              })}
              {mealPlan.days.length > 3 && (
                <Link
                  href="/meal-plan"
                  className="text-center text-sm font-medium text-[#007F78] dark:text-[#2DD4BF] hover:text-[#005F5A] py-2 !no-underline"
                >
                  View all {mealPlan.days.length} days →
                </Link>
              )}
            </div>
          ) : (
            <div className="rounded-xl bg-[#EEF7F3] dark:bg-[#1b2b28] border border-[#DCE9E4] dark:border-[#263835] p-8 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-[#DDF5F0] dark:bg-[#007F78]/25 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#007F78] dark:text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-sm font-medium text-[#163330] dark:text-[#E8F2EF]">No meal plan yet</p>
              <p className="text-xs text-[#849A95] dark:text-[#6E8883]">
                Generate a personalized 7-day plan with the AI meal planner.
              </p>
              <Link href="/meal-plan" className="!no-underline">
                <button
                  type="button"
                  className="mt-1 px-4 py-2 rounded-xl bg-[#007F78] hover:bg-[#005F5A] text-white text-sm font-medium transition-colors"
                >
                  Generate Meal Plan
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── AI Nutrition Analysis ── */}
      <div className="rounded-2xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] overflow-hidden">
        <div className="flex items-start gap-3 border-l-4 border-l-[#007F78] px-5 pt-5 pb-3">
          <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#DDF5F0] dark:bg-[#007F78]/25 flex items-center justify-center mt-0.5">
            <svg className="w-5 h-5 text-[#007F78] dark:text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-[#163330] dark:text-[#E8F2EF]">AI Nutrition Analysis</h2>
            <p className="text-xs text-[#849A95] dark:text-[#6E8883] mt-0.5">Get AI-powered insights from your food log</p>
          </div>
          <button
            type="button"
            onClick={handleAnalyzeNutrition}
            disabled={isAnalyzing}
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#007F78] hover:bg-[#005F5A] disabled:opacity-50 text-white text-sm font-medium transition-colors"
          >
            {isAnalyzing ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
        <div className="px-5 pb-5">
          {isAnalyzing && <AgentLoadingState agentName="Nutrition Analysis" />}
          {analysisError && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 text-sm">
              {analysisError}
            </div>
          )}
          {nutritionReport && !isAnalyzing && <NutritionReportCard report={nutritionReport} />}
        </div>
      </div>

      {/* ── Recently Logged ── */}
      <div className="rounded-2xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] overflow-hidden">
        <div className="px-5 pt-5 pb-3">
          <h2 className="text-lg font-semibold text-[#163330] dark:text-[#E8F2EF]">Recently Logged</h2>
          <p className="text-xs text-[#849A95] dark:text-[#6E8883] mt-0.5">Your last 5 food entries</p>
        </div>
        <div className="px-5 pb-5">
          {recentLogs.length === 0 ? (
            <div className="rounded-xl bg-[#EEF7F3] dark:bg-[#1b2b28] border border-[#DCE9E4] dark:border-[#263835] p-8 flex flex-col items-center gap-2 text-center">
              <div className="w-10 h-10 rounded-full bg-[#DDF5F0] dark:bg-[#007F78]/25 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#007F78] dark:text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-sm text-[#55706B] dark:text-[#A1B8B3]">No foods logged yet.</p>
              <p className="text-xs text-[#849A95] dark:text-[#6E8883]">Tap &quot;Log Meal&quot; above to track what you eat.</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-[#DCE9E4] dark:divide-[#263835]">
              {recentLogs.map((entry) => (
                <div
                  key={entry._id}
                  className="flex items-center justify-between py-3 group hover:bg-[#F7FAF8] dark:hover:bg-[#1b2b28] -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <p className="font-medium text-sm text-[#163330] dark:text-[#E8F2EF] truncate">{entry.name}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-[#849A95] dark:text-[#6E8883]">
                        {new Date(entry.consumedOn).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                        {entry.servings !== 1 ? ` · ${entry.servings} servings` : ''}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#DDF5F0] dark:bg-[#007F78]/25 text-[#007F78] dark:text-[#2DD4BF]">
                          P {entry.macros.protein}g
                        </span>
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#FEF3C7] dark:bg-[#F59E0B]/20 text-[#92400E] dark:text-[#FCD34D]">
                          C {entry.macros.carbs}g
                        </span>
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400">
                          F {entry.macros.fat}g
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="font-semibold text-sm text-[#163330] dark:text-[#E8F2EF]">{entry.calories}</p>
                      <p className="text-[10px] text-[#849A95] dark:text-[#6E8883]">cal</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteLog(entry._id)}
                      className="text-[#849A95] dark:text-[#6E8883] hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                      aria-label="Delete log entry"
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

      {/* ── Log Modal ── */}
      <Modal state={logModal}>
        <Modal.Backdrop>
          <Modal.Container placement="center" size="lg">
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Heading>Log a Meal</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                {/* Tab pills */}
                <div className="flex gap-2 mb-4">
                  {([['meals', 'My Meals'], ['plan', 'My Plan'], ['custom', 'Quick Custom']] as const).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => { setLogTab(key); setLogError(''); }}
                      className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                        logTab === key
                          ? 'bg-[#007F78] text-white'
                          : 'bg-[#EEF7F3] dark:bg-[#1b2b28] hover:bg-[#DDF5F0] dark:hover:bg-[#203330] text-[#55706B] dark:text-[#A1B8B3]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {logError && (
                  <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 text-sm mb-3">
                    {logError}
                  </div>
                )}

                {/* My Meals Tab */}
                {logTab === 'meals' && (
                  <div className="flex flex-col gap-4">
                    <div className="max-h-[260px] overflow-y-auto border border-[#DCE9E4] dark:border-[#263835] rounded-xl">
                      {meals.length === 0 ? (
                        <p className="p-4 text-sm text-[#849A95] dark:text-[#6E8883] text-center">No meals in your catalog yet.</p>
                      ) : meals.map((meal) => (
                        <button
                          key={meal._id}
                          type="button"
                          onClick={() => setSelectedMealId(meal._id)}
                          className={`w-full text-left flex items-center justify-between px-4 py-3 border-b border-[#DCE9E4] dark:border-[#263835] last:border-0 transition-colors ${
                            selectedMealId === meal._id ? 'bg-[#DDF5F0] dark:bg-[#007F78]/25' : 'hover:bg-[#EEF7F3] dark:hover:bg-[#1b2b28]'
                          }`}
                        >
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-sm text-[#163330] dark:text-[#E8F2EF] truncate">{meal.title}</span>
                            <span className="text-xs text-[#849A95] dark:text-[#6E8883]">{meal.cuisineTag}</span>
                          </div>
                          <span className="font-semibold text-sm text-[#55706B] dark:text-[#A1B8B3] whitespace-nowrap ml-3">{meal.calories} cal</span>
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-[#849A95] dark:text-[#6E8883] font-medium">Servings</span>
                        <input
                          type="number"
                          min={0.5}
                          step={0.5}
                          value={mealServings}
                          onChange={(e) => setMealServings(Number(e.target.value) || 1)}
                          className="px-3 py-2 rounded-lg border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#121918] text-sm text-[#163330] dark:text-[#E8F2EF] focus:outline-none focus:ring-2 focus:ring-[#007F78]/30 focus:border-[#007F78]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-[#849A95] dark:text-[#6E8883] font-medium">Date</span>
                        <input
                          type="date"
                          value={mealDate}
                          onChange={(e) => setMealDate(e.target.value)}
                          className="px-3 py-2 rounded-lg border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#121918] text-sm text-[#163330] dark:text-[#E8F2EF] focus:outline-none focus:ring-2 focus:ring-[#007F78]/30 focus:border-[#007F78]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* My Plan Tab */}
                {logTab === 'plan' && mealPlan && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-[#849A95] dark:text-[#6E8883] font-medium">Day</span>
                      <div className="flex flex-wrap gap-2">
                        {mealPlan.days.map((day, i) => (
                          <button
                            key={day.day}
                            type="button"
                            onClick={() => { setPlanDayIdx(i); setPlanMealIdx(0); }}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                              planDayIdx === i ? 'bg-[#007F78] text-white' : 'bg-[#EEF7F3] dark:bg-[#1b2b28] text-[#55706B] dark:text-[#A1B8B3] hover:bg-[#DDF5F0] dark:hover:bg-[#203330]'
                            }`}
                          >
                            Day {day.day}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-[#849A95] dark:text-[#6E8883] font-medium">Meal</span>
                      <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto">
                        {mealPlan.days[planDayIdx]?.meals.map((m, i) => (
                          <button
                            key={`${planDayIdx}-${i}`}
                            type="button"
                            onClick={() => setPlanMealIdx(i)}
                            className={`w-full text-left flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${
                              planMealIdx === i
                                ? 'border-[#007F78] bg-[#DDF5F0] dark:bg-[#007F78]/25'
                                : 'border-[#DCE9E4] dark:border-[#263835] hover:bg-[#EEF7F3] dark:hover:bg-[#1b2b28]'
                            }`}
                          >
                            <span className="font-medium text-sm text-[#163330] dark:text-[#E8F2EF]">{m.name}</span>
                            <span className="font-semibold text-sm text-[#849A95] dark:text-[#6E8883]">{m.calories} cal</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-[#849A95] dark:text-[#6E8883] font-medium">Servings</span>
                        <input
                          type="number"
                          min={0.5}
                          step={0.5}
                          value={planServings}
                          onChange={(e) => setPlanServings(Number(e.target.value) || 1)}
                          className="px-3 py-2 rounded-lg border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#121918] text-sm text-[#163330] dark:text-[#E8F2EF] focus:outline-none focus:ring-2 focus:ring-[#007F78]/30 focus:border-[#007F78]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-[#849A95] dark:text-[#6E8883] font-medium">Date</span>
                        <input
                          type="date"
                          value={planDate}
                          onChange={(e) => setPlanDate(e.target.value)}
                          className="px-3 py-2 rounded-lg border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#121918] text-sm text-[#163330] dark:text-[#E8F2EF] focus:outline-none focus:ring-2 focus:ring-[#007F78]/30 focus:border-[#007F78]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {logTab === 'plan' && !mealPlan && (
                  <p className="text-sm text-[#849A95] dark:text-[#6E8883] text-center py-6">
                    Generate a meal plan first to log meals from it.
                  </p>
                )}

                {/* Custom Tab */}
                {logTab === 'custom' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-[#849A95] dark:text-[#6E8883] font-medium">Food name</span>
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="e.g. Post-workout Protein Shake"
                        className="px-3 py-2 rounded-lg border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#121918] text-sm text-[#163330] dark:text-[#E8F2EF] placeholder:text-[#849A95] dark:placeholder:text-[#6E8883] focus:outline-none focus:ring-2 focus:ring-[#007F78]/30 focus:border-[#007F78]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-[#849A95] dark:text-[#6E8883] font-medium">Calories</span>
                        <input
                          type="number"
                          min={0}
                          value={customCalories}
                          onChange={(e) => setCustomCalories(e.target.value)}
                          className="px-3 py-2 rounded-lg border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#121918] text-sm text-[#163330] dark:text-[#E8F2EF] focus:outline-none focus:ring-2 focus:ring-[#007F78]/30 focus:border-[#007F78]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-[#849A95] dark:text-[#6E8883] font-medium">Protein (g)</span>
                        <input
                          type="number"
                          min={0}
                          value={customProtein}
                          onChange={(e) => setCustomProtein(e.target.value)}
                          className="px-3 py-2 rounded-lg border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#121918] text-sm text-[#163330] dark:text-[#E8F2EF] focus:outline-none focus:ring-2 focus:ring-[#007F78]/30 focus:border-[#007F78]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-[#849A95] dark:text-[#6E8883] font-medium">Carbs (g)</span>
                        <input
                          type="number"
                          min={0}
                          value={customCarbs}
                          onChange={(e) => setCustomCarbs(e.target.value)}
                          className="px-3 py-2 rounded-lg border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#121918] text-sm text-[#163330] dark:text-[#E8F2EF] focus:outline-none focus:ring-2 focus:ring-[#007F78]/30 focus:border-[#007F78]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-[#849A95] dark:text-[#6E8883] font-medium">Fat (g)</span>
                        <input
                          type="number"
                          min={0}
                          value={customFat}
                          onChange={(e) => setCustomFat(e.target.value)}
                          className="px-3 py-2 rounded-lg border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#121918] text-sm text-[#163330] dark:text-[#E8F2EF] focus:outline-none focus:ring-2 focus:ring-[#007F78]/30 focus:border-[#007F78]"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-[#849A95] dark:text-[#6E8883] font-medium">Servings</span>
                        <input
                          type="number"
                          min={0.5}
                          step={0.5}
                          value={customServings}
                          onChange={(e) => setCustomServings(Number(e.target.value) || 1)}
                          className="px-3 py-2 rounded-lg border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#121918] text-sm text-[#163330] dark:text-[#E8F2EF] focus:outline-none focus:ring-2 focus:ring-[#007F78]/30 focus:border-[#007F78]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-[#849A95] dark:text-[#6E8883] font-medium">Date</span>
                        <input
                          type="date"
                          value={customDate}
                          onChange={(e) => setCustomDate(e.target.value)}
                          className="px-3 py-2 rounded-lg border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#121918] text-sm text-[#163330] dark:text-[#E8F2EF] focus:outline-none focus:ring-2 focus:ring-[#007F78]/30 focus:border-[#007F78]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onPress={() => { resetLogForm(); setIsLogOpen(false); }}>
                  Cancel
                </Button>
                <Button variant="primary" onPress={handleLogSubmit} isPending={isLogging}>
                  Log Food
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}