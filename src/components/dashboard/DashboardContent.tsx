'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Card, Chip } from '@heroui/react';
import { getUserMeals } from '@/lib/api/dashboard';
import { getMyMealPlan } from '@/lib/api/mealplan';
import { downloadMealPlanPdf } from '@/lib/mealplanExport';
import { getAuthToken } from '@/lib/core/server';
import type { Meal } from '@/lib/types/meal';
import type { MealPlan } from '@/lib/types/mealplan';
import { DayCard } from '@/components/mealplan/DayCard';
import { CaloriesLineChart } from './CaloriesLineChart';
import { MacroBreakdownChart } from './MacroBreakdownChart';
import { NutritionReportCard } from './NutritionReportCard';
import { AgentLoadingState } from '@/components/ai/AgentLoadingState';
import { analyzeNutrition } from '@/lib/api/nutrition';
import { ErrorFallback } from '@/components/feedback/ErrorFallback';
import { DownloadIcon } from '@/components/ui/icons';
import type { NutritionReport } from '@/lib/types/nutrition';

export function DashboardContent() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [nutritionReport, setNutritionReport] = useState<NutritionReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState('');

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

  const planStart = mealPlan?.createdAt ? new Date(mealPlan.createdAt) : null;

  const handleAnalyzeNutrition = async () => {
    setAnalysisError('');
    setIsAnalyzing(true);

    try {
      const token = await getAuthToken();
      if (!token) return;

      const result = await analyzeNutrition(token);
      if (result) {
        setNutritionReport(result);
      } else {
        setAnalysisError('Failed to analyze nutrition. Please try again.');
      }
    } catch {
      setAnalysisError('Failed to analyze nutrition. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const recentMeals = meals.slice(0, 5);

  if (loadError) {
    return <ErrorFallback error={loadError} />;
  }

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-border dark:border-border">
          <Card.Content className="p-5">
            <p className="text-sm text-muted">Total Meals Logged</p>
            <p className="text-2xl font-bold mt-1">{meals.length}</p>
          </Card.Content>
        </Card>
        <Card className="border border-border dark:border-border">
          <Card.Content className="p-5">
            <p className="text-sm text-muted">Total Calories</p>
            <p className="text-2xl font-bold mt-1">{totalCalories.toLocaleString()}</p>
          </Card.Content>
        </Card>
        <Card className="border border-border dark:border-border">
          <Card.Content className="p-5">
            <p className="text-sm text-muted">Avg Calories/Meal</p>
            <p className="text-2xl font-bold mt-1">
              {meals.length ? Math.round(totalCalories / meals.length) : 0}
            </p>
          </Card.Content>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border border-border dark:border-border">
          <Card.Header className="pb-0 px-5 pt-5">
            <h2 className="text-lg font-semibold">Calories Over Time</h2>
          </Card.Header>
          <Card.Content className="p-5">
            <CaloriesLineChart meals={meals} />
          </Card.Content>
        </Card>
        <Card className="border border-border dark:border-border">
          <Card.Header className="pb-0 px-5 pt-5">
            <h2 className="text-lg font-semibold">Macro Breakdown</h2>
          </Card.Header>
          <Card.Content className="p-5">
            <MacroBreakdownChart meals={meals} />
          </Card.Content>
        </Card>
      </div>

      <Card className="border border-border dark:border-border">
        <Card.Header className="pb-0 px-5 pt-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg font-semibold">Your 7-Day Meal Plan</h2>
            {mealPlan && (
              <Button
                variant="secondary"
                size="sm"
                onPress={() => downloadMealPlanPdf(mealPlan)}
              >
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
                <Link
                  href="/meal-plan"
                  className="text-accent hover:underline font-medium"
                >
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
                <Button variant="primary" size="sm">
                  Generate Meal Plan
                </Button>
              </Link>
            </div>
          )}
        </Card.Content>
      </Card>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">AI Nutrition Analysis</h2>
          <Button
            variant="secondary"
            onPress={handleAnalyzeNutrition}
            isPending={isAnalyzing}
          >
            Analyze My Nutrition (AI)
          </Button>
        </div>

        {isAnalyzing && <AgentLoadingState agentName="Nutrition Analysis" />}

        {analysisError && (
          <div className="p-3 rounded-lg bg-danger-soft dark:bg-danger-soft text-danger text-sm">
            {analysisError}
          </div>
        )}

        {nutritionReport && !isAnalyzing && (
          <NutritionReportCard report={nutritionReport} />
        )}
      </div>

      <Card className="border border-border dark:border-border">
        <Card.Header className="pb-0 px-5 pt-5">
          <h2 className="text-lg font-semibold">Recent Meals</h2>
        </Card.Header>
        <Card.Content className="p-5">
          {recentMeals.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-muted">
              <p className="text-sm">No meals logged yet.</p>
              <p className="text-xs">Start by adding a meal to see your data here.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recentMeals.map((meal) => (
                <div
                  key={meal._id}
                  className="flex items-center justify-between py-2 border-b border-separator dark:border-separator last:border-0"
                >
                  <div className="flex flex-col gap-1">
                    <p className="font-medium text-sm">{meal.title}</p>
                    <div className="flex items-center gap-2">
                      <Chip size="sm" variant="soft" color="accent">
                        {meal.cuisineTag}
                      </Chip>
                      <span className="text-xs text-muted">
                        {new Date(meal.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{meal.calories}</p>
                    <p className="text-xs text-muted">cal</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
}