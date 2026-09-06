'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Card, Chip, Modal, useOverlayState } from '@heroui/react';
import { getUserMeals } from '@/lib/api/dashboard';
import { getMyMealPlan } from '@/lib/api/mealplan';
import { downloadMealPlanPdf } from '@/lib/mealplanExport';
import { getFoodLog, logFood, deleteFoodLog } from '@/lib/api/log';
import { getAuthToken } from '@/lib/core/server';
import type { Meal } from '@/lib/types/meal';
import type { MealPlan, MealPlanDay } from '@/lib/types/mealplan';
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border border-border dark:border-border">
            <Card.Content className="h-24" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="grid grid-cols-3 gap-4 flex-1 min-w-0">
          <Card className="border border-border dark:border-border">
            <Card.Content className="p-5">
              <p className="text-sm text-muted">Foods Logged (30d)</p>
              <p className="text-2xl font-bold mt-1">{logEntries.length}</p>
            </Card.Content>
          </Card>
          <Card className="border border-border dark:border-border">
            <Card.Content className="p-5">
              <p className="text-sm text-muted">Total Calories (30d)</p>
              <p className="text-2xl font-bold mt-1">{totalCalories.toLocaleString()}</p>
            </Card.Content>
          </Card>
          <Card className="border border-border dark:border-border">
            <Card.Content className="p-5">
              <p className="text-sm text-muted">Avg Calories/Food</p>
              <p className="text-2xl font-bold mt-1">
                {logEntries.length ? Math.round(totalCalories / logEntries.length) : 0}
              </p>
            </Card.Content>
          </Card>
        </div>
        <Button variant="primary" onPress={() => setIsLogOpen(true)}>
          + Log Meal
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border border-border dark:border-border">
          <Card.Header className="pb-0 px-5 pt-5">
            <h2 className="text-lg font-semibold">Calories Over Time</h2>
          </Card.Header>
          <Card.Content className="p-5">
            <CaloriesLineChart entries={chartEntries} />
          </Card.Content>
        </Card>
        <Card className="border border-border dark:border-border">
          <Card.Header className="pb-0 px-5 pt-5">
            <h2 className="text-lg font-semibold">Macro Breakdown</h2>
          </Card.Header>
          <Card.Content className="p-5">
            <MacroBreakdownChart entries={chartEntries} />
          </Card.Content>
        </Card>
      </div>

      <Card className="border border-border dark:border-border">
        <Card.Header className="pb-0 px-5 pt-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg font-semibold">Your 7-Day Meal Plan</h2>
            {mealPlan && (
              <Button variant="secondary" size="sm" onPress={() => downloadMealPlanPdf(mealPlan)}>
                <DownloadIcon className="size-4" />
                Download PDF
              </Button>
            )}
          </div>
        </Card.Header>
        <Card.Content className="p-5">
          {planLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-24 rounded-lg bg-surface-secondary" />
              <div className="h-24 rounded-lg bg-surface-secondary" />
            </div>
          ) : mealPlan && planStart ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between text-sm text-muted">
                <span>
                  Generated for week of {planStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
                <Link href="/meal-plan" className="text-accent hover:underline font-medium">
                  Regenerate or edit
                </Link>
              </div>
              {mealPlan.days.map((day) => {
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
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <p className="text-sm text-muted">No meal plan yet.</p>
              <p className="text-xs text-muted">
                Generate a personalized 7-day plan with the AI meal planner.
              </p>
              <Link href="/meal-plan">
                <Button variant="primary" size="sm">Generate Meal Plan</Button>
              </Link>
            </div>
          )}
        </Card.Content>
      </Card>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">AI Nutrition Analysis</h2>
          <Button variant="secondary" onPress={handleAnalyzeNutrition} isPending={isAnalyzing}>
            Analyze My Nutrition (AI)
          </Button>
        </div>
        {isAnalyzing && <AgentLoadingState agentName="Nutrition Analysis" />}
        {analysisError && (
          <div className="p-3 rounded-lg bg-danger-soft dark:bg-danger-soft text-danger text-sm">
            {analysisError}
          </div>
        )}
        {nutritionReport && !isAnalyzing && <NutritionReportCard report={nutritionReport} />}
      </div>

      <Card className="border border-border dark:border-border">
        <Card.Header className="pb-0 px-5 pt-5">
          <h2 className="text-lg font-semibold">Recently Logged</h2>
        </Card.Header>
        <Card.Content className="p-5">
          {recentLogs.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-muted">
              <p className="text-sm">No foods logged yet.</p>
              <p className="text-xs">Tap &quot;Log Meal&quot; above to track what you eat.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recentLogs.map((entry) => (
                <div
                  key={entry._id}
                  className="flex items-center justify-between py-2 border-b border-separator dark:border-separator last:border-0"
                >
                  <div className="flex flex-col gap-1">
                    <p className="font-medium text-sm">{entry.name}</p>
                    <span className="text-xs text-muted">
                      {new Date(entry.consumedOn).toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                      {entry.servings !== 1 ? ` · ${entry.servings} servings` : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-semibold text-sm">{entry.calories}</p>
                      <p className="text-xs text-muted">cal</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteLog(entry._id)}
                      className="text-muted hover:text-danger transition-colors p-1"
                      aria-label="Delete log entry"
                    >
                      <TrashIcon className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card.Content>
      </Card>

      <Modal state={logModal}>
        <Modal.Backdrop>
          <Modal.Container placement="center" size="lg">
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Heading>Log a Meal</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <div className="flex gap-2 mb-4">
                  {([['meals', 'My Meals'], ['plan', 'My Plan'], ['custom', 'Quick Custom']] as const).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => { setLogTab(key); setLogError(''); }}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                        logTab === key
                          ? 'bg-accent text-white'
                          : 'bg-surface-secondary hover:bg-surface-secondary/80 text-default'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {logError && (
                  <div className="p-2 rounded-lg bg-danger-soft text-danger text-sm mb-3">
                    {logError}
                  </div>
                )}

                {logTab === 'meals' && (
                  <div className="flex flex-col gap-4">
                    <div className="max-h-[260px] overflow-y-auto border border-border rounded-xl">
                      {meals.length === 0 ? (
                        <p className="p-4 text-sm text-muted text-center">No meals in your catalog yet.</p>
                      ) : meals.map((meal) => (
                        <button
                          key={meal._id}
                          type="button"
                          onClick={() => setSelectedMealId(meal._id)}
                          className={`w-full text-left flex items-center justify-between px-4 py-3 border-b border-separator last:border-0 transition-colors ${
                            selectedMealId === meal._id ? 'bg-accent-soft' : 'hover:bg-surface-secondary'
                          }`}
                        >
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-sm truncate">{meal.title}</span>
                            <span className="text-xs text-muted">{meal.cuisineTag}</span>
                          </div>
                          <span className="font-semibold text-sm whitespace-nowrap ml-3">{meal.calories} cal</span>
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted">Servings</span>
                        <input
                          type="number"
                          min={0.5}
                          step={0.5}
                          value={mealServings}
                          onChange={(e) => setMealServings(Number(e.target.value) || 1)}
                          className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted">Date</span>
                        <input
                          type="date"
                          value={mealDate}
                          onChange={(e) => setMealDate(e.target.value)}
                          className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {logTab === 'plan' && mealPlan && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted">Day</span>
                      <div className="flex flex-wrap gap-2">
                        {mealPlan.days.map((day, i) => (
                          <button
                            key={day.day}
                            type="button"
                            onClick={() => { setPlanDayIdx(i); setPlanMealIdx(0); }}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                              planDayIdx === i ? 'bg-accent text-white' : 'bg-surface-secondary text-default hover:bg-surface-secondary/80'
                            }`}
                          >
                            Day {day.day}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted">Meal</span>
                      <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto">
                        {mealPlan.days[planDayIdx]?.meals.map((m, i) => (
                          <button
                            key={`${planDayIdx}-${i}`}
                            type="button"
                            onClick={() => setPlanMealIdx(i)}
                            className={`w-full text-left flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${
                              planMealIdx === i
                                ? 'border-accent bg-accent-soft'
                                : 'border-border hover:bg-surface-secondary'
                            }`}
                          >
                            <span className="font-medium text-sm">{m.name}</span>
                            <span className="font-semibold text-sm text-muted">{m.calories} cal</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted">Servings</span>
                        <input
                          type="number"
                          min={0.5}
                          step={0.5}
                          value={planServings}
                          onChange={(e) => setPlanServings(Number(e.target.value) || 1)}
                          className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted">Date</span>
                        <input
                          type="date"
                          value={planDate}
                          onChange={(e) => setPlanDate(e.target.value)}
                          className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {logTab === 'plan' && !mealPlan && (
                  <p className="text-sm text-muted text-center py-6">
                    Generate a meal plan first to log meals from it.
                  </p>
                )}

                {logTab === 'custom' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted">Food name</span>
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="e.g. Post-workout Protein Shake"
                        className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted">Calories</span>
                        <input
                          type="number"
                          min={0}
                          value={customCalories}
                          onChange={(e) => setCustomCalories(e.target.value)}
                          className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted">Protein (g)</span>
                        <input
                          type="number"
                          min={0}
                          value={customProtein}
                          onChange={(e) => setCustomProtein(e.target.value)}
                          className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted">Carbs (g)</span>
                        <input
                          type="number"
                          min={0}
                          value={customCarbs}
                          onChange={(e) => setCustomCarbs(e.target.value)}
                          className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted">Fat (g)</span>
                        <input
                          type="number"
                          min={0}
                          value={customFat}
                          onChange={(e) => setCustomFat(e.target.value)}
                          className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted">Servings</span>
                        <input
                          type="number"
                          min={0.5}
                          step={0.5}
                          value={customServings}
                          onChange={(e) => setCustomServings(Number(e.target.value) || 1)}
                          className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted">Date</span>
                        <input
                          type="date"
                          value={customDate}
                          onChange={(e) => setCustomDate(e.target.value)}
                          className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
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