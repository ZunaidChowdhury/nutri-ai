'use client';

import { useQuery } from '@tanstack/react-query';
import { getAllCuisines, type Cuisine } from '@/lib/api/cuisine';

export const FALLBACK_CUISINES = [
  'American',
  'Arabian',
  'Bangladeshi',
  'Chinese',
  'French',
  'Indian',
  'Iranian',
  'Italian',
  'Japanese',
  'Korean',
  'Mediterranean',
  'Mexican',
  'Middle Eastern',
  'Pakistani',
  'Russian',
  'Thai',
  'Turkish',
  'Vietnamese',
];

export function formatCuisineName(name: string): string {
  if (!name) return '';
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function useCuisines() {
  const query = useQuery<Cuisine[], Error>({
    queryKey: ['cuisines'],
    queryFn: getAllCuisines,
    staleTime: 5 * 60 * 1000,
  });

  const cuisines = query.data ?? [];
  const cuisineNames: string[] =
    cuisines.length > 0
      ? cuisines.map((c) => formatCuisineName(c.name))
      : FALLBACK_CUISINES;

  return {
    ...query,
    cuisines,
    cuisineNames,
  };
}
