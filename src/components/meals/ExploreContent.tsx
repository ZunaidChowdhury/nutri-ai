'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { Button } from '@heroui/button';
import { Pagination } from '@heroui/pagination';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMeals } from '@/lib/api/meal';
import type { MealsResponse } from '@/lib/types/meal';
import { MealGrid } from './MealGrid';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorFallback } from '@/components/feedback/ErrorFallback';
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

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 400;

export function ExploreContent({
  initialData,
}: {
  initialData?: MealsResponse;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = useSelector((state: RootState) => state.filters);
  const [searchInput, setSearchInput] = useState(
    () => searchParams.get('search') || ''
  );
  const [minCalInput, setMinCalInput] = useState(
    () => searchParams.get('minCalories') || ''
  );
  const [maxCalInput, setMaxCalInput] = useState(
    () => searchParams.get('maxCalories') || ''
  );

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastWrittenUrl = useRef<string | null>(null);
  const skipFirstUrlWrite = useRef(true);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const buildUrl = useCallback(
    (f: RootState['filters']) => {
      const params = new URLSearchParams();
      if (f.search) params.set('search', f.search);
      if (f.cuisineTag) params.set('cuisineTag', f.cuisineTag);
      if (f.minCalories) params.set('minCalories', f.minCalories);
      if (f.maxCalories) params.set('maxCalories', f.maxCalories);
      if (f.sortBy !== 'createdAt') params.set('sortBy', f.sortBy);
      if (f.order !== 'desc') params.set('order', f.order);
      if (f.page > 1) params.set('page', String(f.page));
      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [pathname]
  );

  // Sync Redux state (and the uncontrolled input mirrors) from the URL,
  // but ignore URL updates that we wrote ourselves.
  useEffect(() => {
    const currentUrl = `${pathname}${searchParams.toString()}`;
    if (lastWrittenUrl.current !== null && lastWrittenUrl.current === currentUrl) {
      lastWrittenUrl.current = null;
      return;
    }

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
      setOrder((searchParams.get('order') as 'asc' | 'desc') || 'desc')
    );
    dispatch(setPage(Number(searchParams.get('page')) || 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, pathname, dispatch]);

  // Write the filter state back to the URL. Skipped on first render so the
  // initial sync from the URL wins.
  useEffect(() => {
    if (skipFirstUrlWrite.current) {
      skipFirstUrlWrite.current = false;
      return;
    }
    const url = buildUrl(filters);
    lastWrittenUrl.current = url;
    router.replace(url, { scroll: false });
  }, [filters, buildUrl, router]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        dispatch(setSearch(value));
      }, SEARCH_DEBOUNCE_MS);
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
      limit: PAGE_SIZE,
    }),
    [filters]
  );

  const { data, isLoading, isPlaceholderData, isError, error } = useQuery({
    queryKey: ['meals', queryParams],
    queryFn: () => getAllMeals(queryParams),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
    initialData,
  });

  const handleReset = useCallback(() => {
    setSearchInput('');
    setMinCalInput('');
    setMaxCalInput('');
    dispatch(resetFilters());
  }, [dispatch]);

  const totalItems = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const isEmpty =
    !isLoading &&
    !isPlaceholderData &&
    (!data?.data || data.data.length === 0);
  const startItem = totalItems === 0 ? 0 : (filters.page - 1) * PAGE_SIZE + 1;
  const endItem = totalItems === 0 ? 0 : Math.min(filters.page * PAGE_SIZE, totalItems);

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
            selectedKeys={filters.cuisineTag ? [filters.cuisineTag] : []}
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

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="flat"
            color="primary"
            size="sm"
            onPress={applyCalorieFilter}
          >
            Apply calorie filter
          </Button>
          {(filters.search ||
            filters.cuisineTag ||
            filters.minCalories ||
            filters.maxCalories ||
            filters.sortBy !== 'createdAt' ||
            filters.order !== 'desc') && (
            <Button
              variant="flat"
              size="sm"
              onPress={handleReset}
            >
              Clear all filters
            </Button>
          )}
        </div>
      </div>

      {isError ? (
        <ErrorFallback error={error as Error} />
      ) : isEmpty ? (
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

      {!isEmpty && totalPages > 1 && (
        <div className="mt-4 flex w-full flex-col items-center justify-center gap-3">
          <p className="text-sm text-default-500">
            Showing {startItem}-{endItem} of {totalItems} result
            {totalItems !== 1 ? 's' : ''}
          </p>
          <Pagination
            total={totalPages}
            page={filters.page}
            onChange={(p) => dispatch(setPage(p))}
            color="primary"
            variant="light"
            showControls
            siblings={1}
            boundaries={1}
          />
        </div>
      )}

      {!isEmpty && totalPages === 1 && (
        <p className="mt-4 text-center text-sm text-default-500">
          Showing {startItem}-{endItem} of {totalItems} result
          {totalItems !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}