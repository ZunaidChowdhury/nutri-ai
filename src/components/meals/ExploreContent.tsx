'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  TextField,
  Input,
  Label,
  Select,
  ListBox,
  Button,
} from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMeals } from '@/lib/api/meal';
import type { MealsResponse } from '@/lib/types/meal';
import { useSession } from '@/lib/auth/client';
import { useSelectedMeals } from '@/lib/hooks/useSelectedMeals';
import { ResultsPagination } from '@/components/ui/ResultsPagination';
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
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { selectedIds, toggleMeal } = useSelectedMeals(userId);
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

  useEffect(() => {
    const qs = searchParams.toString();
    const currentUrl = qs ? `${pathname}?${qs}` : pathname;
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
  }, [searchParams, pathname, dispatch]);

  useEffect(() => {
    if (skipFirstUrlWrite.current) {
      skipFirstUrlWrite.current = false;
      return;
    }
    const url = buildUrl(filters);
    const qs = searchParams.toString();
    const currentUrl = qs ? `${pathname}?${qs}` : pathname;
    if (url === currentUrl) {
      return;
    }
    lastWrittenUrl.current = url;
    router.replace(url, { scroll: false });
  }, [filters, buildUrl, router, searchParams, pathname]);

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

  const [ssrParams] = useState(() => queryParams);

  const { data, isLoading, isPlaceholderData, isError, error } = useQuery({
    queryKey: ['meals', queryParams],
    queryFn: () => getAllMeals(queryParams),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
    initialData: queryParams === ssrParams ? initialData : undefined,
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
  const noun = `result${totalItems !== 1 ? 's' : ''}`;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Explore Meals</h1>
        <p className="text-muted">
          Discover nutritious meals tailored to your preferences
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <TextField className="w-full md:max-w-md" fullWidth>
          <Input
            type="text"
            placeholder="Search by name..."
            aria-label="Search meals"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </TextField>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Select
            className="w-full"
            placeholder="All cuisines"
            value={filters.cuisineTag || null}
            onChange={(key) => {
              dispatch(setCuisineTag((key as string) || ''));
            }}
          >
            <Label>Cuisine</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {CUISINE_TAGS.map((tag) => (
                  <ListBox.Item key={tag} id={tag} textValue={tag}>
                    {tag}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>

          <TextField className="w-full" fullWidth>
            <Label>Min calories</Label>
            <Input
              type="number"
              placeholder="0"
              value={minCalInput}
              onChange={(e) => setMinCalInput(e.target.value)}
              onKeyDown={handleCalKeyDown}
            />
          </TextField>

          <TextField className="w-full" fullWidth>
            <Label>Max calories</Label>
            <Input
              type="number"
              placeholder="1000"
              value={maxCalInput}
              onChange={(e) => setMaxCalInput(e.target.value)}
              onKeyDown={handleCalKeyDown}
            />
          </TextField>

          <Select
            className="w-full"
            placeholder="Sort by"
            value={`${filters.sortBy}-${filters.order}`}
            onChange={(key) => {
              const val = (key as string) || '';
              const [sortBy, order] = val.split('-') as [
                'calories' | 'rating' | 'createdAt',
                'asc' | 'desc',
              ];
              dispatch(setSortBy(sortBy));
              dispatch(setOrder(order));
            }}
          >
            <Label>Sort by</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="createdAt-desc" textValue="Newest">
                  Newest
                </ListBox.Item>
                <ListBox.Item id="calories-asc" textValue="Calories (low)">
                  Calories (low)
                </ListBox.Item>
                <ListBox.Item id="calories-desc" textValue="Calories (high)">
                  Calories (high)
                </ListBox.Item>
                <ListBox.Item id="rating-desc" textValue="Highest rated">
                  Highest rated
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="primary"
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
              variant="secondary"
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
            <Button variant="primary" onPress={handleReset}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <MealGrid
          meals={data?.data || []}
          isLoading={isLoading}
          selectedIds={selectedIds}
          onToggleSelect={toggleMeal}
        />
      )}

      {!isEmpty && totalPages > 0 && (
        <ResultsPagination
          page={filters.page}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={PAGE_SIZE}
          noun={noun}
          onPageChange={(p) => dispatch(setPage(p))}
        />
      )}
    </div>
  );
}