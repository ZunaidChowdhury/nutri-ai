'use client';

import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { getUserMeals } from '@/lib/api/dashboard';
import { getAuthToken } from '@/lib/core/server';
import type { Meal } from '@/lib/types/meal';
import { Button } from '@heroui/button';
import { CaloriesLineChart } from './CaloriesLineChart';
import { MacroBreakdownChart } from './MacroBreakdownChart';
import { NutritionReportCard } from './NutritionReportCard';
import { AgentLoadingState } from '@/components/ai/AgentLoadingState';
import { analyzeNutrition } from '@/lib/api/nutrition';
import type { NutritionReport } from '@/lib/types/nutrition';

export function DashboardContent() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      } catch {
        if (!cancelled) setMeals([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border border-default-200 dark:border-default-100">
            <CardBody className="h-24" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-default-200 dark:border-default-100">
          <CardBody className="p-5">
            <p className="text-sm text-default-500">Total Meals Logged</p>
            <p className="text-2xl font-bold mt-1">{meals.length}</p>
          </CardBody>
        </Card>
        <Card className="border border-default-200 dark:border-default-100">
          <CardBody className="p-5">
            <p className="text-sm text-default-500">Total Calories</p>
            <p className="text-2xl font-bold mt-1">{totalCalories.toLocaleString()}</p>
          </CardBody>
        </Card>
        <Card className="border border-default-200 dark:border-default-100">
          <CardBody className="p-5">
            <p className="text-sm text-default-500">Avg Calories/Meal</p>
            <p className="text-2xl font-bold mt-1">
              {meals.length ? Math.round(totalCalories / meals.length) : 0}
            </p>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border border-default-200 dark:border-default-100">
          <CardHeader className="pb-0 px-5 pt-5">
            <h2 className="text-lg font-semibold">Calories Over Time</h2>
          </CardHeader>
          <CardBody className="p-5">
            <CaloriesLineChart meals={meals} />
          </CardBody>
        </Card>
        <Card className="border border-default-200 dark:border-default-100">
          <CardHeader className="pb-0 px-5 pt-5">
            <h2 className="text-lg font-semibold">Macro Breakdown</h2>
          </CardHeader>
          <CardBody className="p-5">
            <MacroBreakdownChart meals={meals} />
          </CardBody>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">AI Nutrition Analysis</h2>
          <Button
            color="secondary"
            variant="flat"
            onPress={handleAnalyzeNutrition}
            isLoading={isAnalyzing}
          >
            Analyze My Nutrition
          </Button>
        </div>

        {isAnalyzing && <AgentLoadingState agentName="Nutrition Analysis" />}

        {analysisError && (
          <div className="p-3 rounded-lg bg-danger-50 dark:bg-danger-500/10 text-danger text-sm">
            {analysisError}
          </div>
        )}

        {nutritionReport && !isAnalyzing && (
          <NutritionReportCard report={nutritionReport} />
        )}
      </div>

      <Card className="border border-default-200 dark:border-default-100">
        <CardHeader className="pb-0 px-5 pt-5">
          <h2 className="text-lg font-semibold">Recent Meals</h2>
        </CardHeader>
        <CardBody className="p-5">
          {recentMeals.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-default-400">
              <p className="text-sm">No meals logged yet.</p>
              <p className="text-xs">Start by adding a meal to see your data here.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recentMeals.map((meal) => (
                <div
                  key={meal._id}
                  className="flex items-center justify-between py-2 border-b border-default-100 dark:border-default-800 last:border-0"
                >
                  <div className="flex flex-col gap-1">
                    <p className="font-medium text-sm">{meal.title}</p>
                    <div className="flex items-center gap-2">
                      <Chip size="sm" variant="flat" color="primary">
                        {meal.cuisineTag}
                      </Chip>
                      <span className="text-xs text-default-400">
                        {new Date(meal.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{meal.calories}</p>
                    <p className="text-xs text-default-400">cal</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
