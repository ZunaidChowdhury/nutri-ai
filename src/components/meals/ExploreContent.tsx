'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { Button } from '@heroui/button';
import { Pagination } from '@heroui/pagination';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMeals } from '@/lib/api/meal';
import { MealGrid } from './MealGrid';
import { EmptyState } from '@/components/feedback/EmptyState';
import {
  setSearch,
  setCuisineTag,
  setMinCalories,
  setMaxCalories,
  setSortBy,
  setOrder,
  setPage,
  resetFilters,
} from '@/store/filtersSlice';
import type { RootState } from '@/store/store';
const CUISINE_TAGS = [
  'Italian',
  'Mexican',
  'Japanese',
  'Indian',
  'American',
  'Mediterranean',
  'Chinese',
  'Thai',
  'French',
  'Korean',
  'Middle Eastern',
  'Vietnamese',
];

export function ExploreContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = useSelector((state: RootState) => state.filters);
  const [searchInput, setSearchInput] = useState('');
  const [minCalInput, setMinCalInput] = useState('');
  const [maxCalInput, setMaxCalInput] = useState('');

  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlMin = searchParams.get('minCalories') || '';
    const urlMax = searchParams.get('maxCalories') || '';
    setSearchInput(urlSearch);
    setMinCalInput(urlMin);
    setMaxCalInput(urlMax);
    dispatch(setSearch(urlSearch));
    dispatch(setCuisineTag(searchParams.get('cuisineTag') || ''));
    dispatch(setMinCalories(urlMin));
    dispatch(setMaxCalories(urlMax));
    dispatch(
      setSortBy(
        (searchParams.get('sortBy') as 'calories' | 'rating' | 'createdAt') ||
          'createdAt'
      )
    );
    dispatch(
      setOrder(
        (searchParams.get('order') as 'asc' | 'desc') || 'desc'
      )
    );
    dispatch(setPage(Number(searchParams.get('page')) || 1));
  }, []);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      dispatch(setSearch(value));
    },
    [dispatch]
  );

  const applyCalorieFilter = useCallback(() => {
    dispatch(setMinCalories(minCalInput));
    dispatch(setMaxCalories(maxCalInput));
  }, [dispatch, minCalInput, maxCalInput]);

  const handleCalKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') applyCalorieFilter();
    },
    [applyCalorieFilter]
  );

  const queryParams = useMemo(
    () => ({
      search: filters.search || undefined,
      cuisineTag: filters.cuisineTag ? filters.cuisineTag.toLowerCase() : undefined,
      minCalories: filters.minCalories ? Number(filters.minCalories) : undefined,
      maxCalories: filters.maxCalories ? Number(filters.maxCalories) : undefined,
      sortBy: filters.sortBy,
      order: filters.order,
      page: filters.page,
      limit: 12,
    }),
    [filters]
  );

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ['meals', queryParams],
    queryFn: () => getAllMeals(queryParams),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });

  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.cuisineTag) params.set('cuisineTag', filters.cuisineTag);
    if (filters.minCalories) params.set('minCalories', filters.minCalories);
    if (filters.maxCalories) params.set('maxCalories', filters.maxCalories);
    if (filters.sortBy !== 'createdAt') params.set('sortBy', filters.sortBy);
    if (filters.order !== 'desc') params.set('order', filters.order);
    if (filters.page > 1) params.set('page', String(filters.page));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [filters, pathname, router]);

  useEffect(() => {
    updateUrl();
  }, [updateUrl]);

  const handleReset = useCallback(() => {
    setSearchInput('');
    setMinCalInput('');
    setMaxCalInput('');
    dispatch(resetFilters());
  }, [dispatch]);

  const total = data?.total ?? 0;
  const showingCount = data?.data?.length ?? 0;
  const totalPages = data?.totalPages || 1;
  const isEmpty = !isLoading && !isPlaceholderData && (!data?.data || data.data.length === 0);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Explore Meals</h1>
        <p className="text-default-500">
          Discover nutritious meals tailored to your preferences
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Input
          label="Search meals"
          placeholder="Search by name..."
          value={searchInput}
          onValueChange={handleSearchChange}
          className="w-full md:max-w-md"
          isClearable
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Select
            label="Cuisine"
            placeholder="All cuisines"
            selectedKeys={
              filters.cuisineTag ? [filters.cuisineTag] : []
            }
            onSelectionChange={(keys) => {
              const val = Array.from(keys)[0] as string;
              dispatch(setCuisineTag(val || ''));
            }}
          >
            {CUISINE_TAGS.map((tag) => (
              <SelectItem key={tag}>{tag}</SelectItem>
            ))}
          </Select>

          <Input
            label="Min calories"
            type="number"
            placeholder="0"
            value={minCalInput}
            onValueChange={setMinCalInput}
            onKeyDown={handleCalKeyDown}
          />

          <Input
            label="Max calories"
            type="number"
            placeholder="1000"
            value={maxCalInput}
            onValueChange={setMaxCalInput}
            onKeyDown={handleCalKeyDown}
          />

          <Select
            label="Sort by"
            selectedKeys={[`${filters.sortBy}-${filters.order}`]}
            onSelectionChange={(keys) => {
              const val = Array.from(keys)[0] as string;
              const [sortBy, order] = val.split('-') as [
                'calories' | 'rating' | 'createdAt',
                'asc' | 'desc',
              ];
              dispatch(setSortBy(sortBy));
              dispatch(setOrder(order));
            }}
          >
            <SelectItem key="createdAt-desc">Newest</SelectItem>
            <SelectItem key="calories-asc">Calories (low)</SelectItem>
            <SelectItem key="calories-desc">Calories (high)</SelectItem>
            <SelectItem key="rating-desc">Highest rated</SelectItem>
          </Select>
        </div>

        {(filters.search ||
          filters.cuisineTag ||
          filters.minCalories ||
          filters.maxCalories ||
          filters.sortBy !== 'createdAt' ||
          filters.order !== 'desc') && (
          <Button
            variant="flat"
            size="sm"
            className="self-start"
            onPress={handleReset}
          >
            Clear all filters
          </Button>
        )}
      </div>

      {!isLoading && !isEmpty && (
        <p className="text-sm text-default-500">
          Showing {showingCount} of {total} meal{total !== 1 ? 's' : ''}
        </p>
      )}

      {isEmpty ? (
        <EmptyState
          title="No meals found"
          description="Try adjusting your search or filters to find what you're looking for."
          action={
            <Button variant="flat" color="primary" onPress={handleReset}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <MealGrid meals={data?.data || []} isLoading={isLoading} />
      )}

      {!isEmpty && totalPages > 0 && (
        <div className="flex justify-center mt-4">
          <Pagination
            total={totalPages}
            page={filters.page}
            onChange={(p) => dispatch(setPage(p))}
            color="primary"
            showControls
          />
        </div>
      )}
    </div>
  );
}
