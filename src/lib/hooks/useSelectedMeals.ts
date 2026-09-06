'use client';

import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSelectedMeals } from '@/lib/api/meal';
import { addSelectedMeal, removeSelectedMeal } from '@/lib/actions/meal';
import { getAuthToken } from '@/lib/core/server';
import type { Meal } from '@/lib/types/meal';

export function useSelectedMeals(userId?: string) {
  const queryClient = useQueryClient();
  const queryKey = ['selectedMeals', userId] as const;

  const { data = [], isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const token = await getAuthToken();
      if (!token) return [] as Meal[];
      return getSelectedMeals(token);
    },
    enabled: !!userId,
    staleTime: 60_000,
  });

  const selectedIds = useMemo(
    () => new Set(data.map((m) => m._id)),
    [data]
  );

  const isSelected = (mealId: string) => selectedIds.has(mealId);

  const mutation = useMutation({
    mutationFn: async ({ meal, add }: { meal: Meal; add: boolean }) => {
      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');
      if (add) {
        await addSelectedMeal(meal._id, token);
      } else {
        await removeSelectedMeal(meal._id, token);
      }
    },
    onMutate: async ({ meal, add }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Meal[]>(queryKey) ?? [];
      const optimistic = add
        ? previous.some((m) => m._id === meal._id)
          ? previous
          : [...previous, meal]
        : previous.filter((m) => m._id !== meal._id);
      queryClient.setQueryData(queryKey, optimistic);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
  });

  const toggleMeal = (meal: Meal) => {
    mutation.mutate({ meal, add: !isSelected(meal._id) });
  };

  return {
    selectedMeals: data,
    selectedIds,
    isSelected,
    toggleMeal,
    isLoading,
    isError,
    error,
  };
}