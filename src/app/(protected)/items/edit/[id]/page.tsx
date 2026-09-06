'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getMealById } from '@/lib/api/meal';
import { getAuthToken } from '@/lib/core/server';
import { MealForm } from '@/components/meals/MealForm';
import { Spinner } from '@/components/feedback/Spinner';
import { ErrorFallback } from '@/components/feedback/ErrorFallback';
import { NotFound } from '@/components/feedback/NotFound';

export default function EditMealPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['meal', id],
    queryFn: async () => {
      const token = await getAuthToken();
      return getMealById(id, token || undefined);
    },
    enabled: !!id,
  });

  if (isPending) return <Spinner label="Loading meal" />;
  if (isError) {
    const status = (error as { status?: number })?.status;
    if (status === 404) return <NotFound />;
    return <ErrorFallback error={error as Error} />;
  }

  return <MealForm mode="edit" meal={data.data} />;
}