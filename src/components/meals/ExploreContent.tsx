'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
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
  HiSearch,
  HiX,
  HiFire,
  HiSparkles,
  HiAdjustments,
  HiChevronDown,
  HiArrowRight,
  HiCheck,
  HiChevronLeft,
  HiChevronRight,
} from 'react-icons/hi';
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
import { useCuisines } from '@/lib/hooks/useCuisines';

const CALORIE_PRESETS = [
  { label: 'All Calories', min: '', max: '' },
  { label: '< 400 kcal', min: '', max: '400' },
  { label: '400 - 600 kcal', min: '400', max: '600' },
  { label: '600 - 800 kcal', min: '600', max: '800' },
  { label: '> 800 kcal', min: '800', max: '' },
];

const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Newest Added' },
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'calories-asc', label: 'Calories: Low to High' },
  { value: 'calories-desc', label: 'Calories: High to Low' },
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
  const { cuisineNames } = useCuisines();
  const allCuisineTags = useMemo(() => ['All', ...cuisineNames], [cuisineNames]);

  const [searchInput, setSearchInput] = useState(
    () => searchParams.get('search') || ''
  );
  const [minCalInput, setMinCalInput] = useState(
    () => searchParams.get('minCalories') || ''
  );
  const [maxCalInput, setMaxCalInput] = useState(
    () => searchParams.get('maxCalories') || ''
  );
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const cuisineScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollPosition = useCallback(() => {
    const el = cuisineScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = cuisineScrollRef.current;
    if (!el) return;

    checkScrollPosition();

    const resizeObserver = new ResizeObserver(() => {
      checkScrollPosition();
    });
    resizeObserver.observe(el);

    window.addEventListener('resize', checkScrollPosition);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [checkScrollPosition, allCuisineTags]);

  const scrollCarousel = useCallback((direction: 'left' | 'right') => {
    const el = cuisineScrollRef.current;
    if (!el) return;
    const scrollAmount = Math.max(el.clientWidth * 0.7, 240);
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    if (!filters.cuisineTag || !cuisineScrollRef.current) return;
    const activeBtn = cuisineScrollRef.current.querySelector<HTMLButtonElement>(
      '[data-selected="true"]'
    );
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [filters.cuisineTag]);

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

  const clearSearch = useCallback(() => {
    setSearchInput('');
    dispatch(setSearch(''));
  }, [dispatch]);

  const applyCalorieFilter = useCallback(() => {
    dispatch(setMinCalories(minCalInput));
    dispatch(setMaxCalories(maxCalInput));
  }, [dispatch, minCalInput, maxCalInput]);

  const applyCaloriePreset = useCallback(
    (min: string, max: string) => {
      setMinCalInput(min);
      setMaxCalInput(max);
      dispatch(setMinCalories(min));
      dispatch(setMaxCalories(max));
    },
    [dispatch]
  );

  const handleCalKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') applyCalorieFilter();
    },
    [applyCalorieFilter]
  );

  const handleCuisineSelect = useCallback(
    (tag: string, e?: React.MouseEvent<HTMLButtonElement>) => {
      const selected = tag === 'All' ? '' : tag;
      dispatch(setCuisineTag(selected));
      if (e?.currentTarget) {
        e.currentTarget.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    },
    [dispatch]
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
  const noun = `meal${totalItems !== 1 ? 's' : ''}`;

  const hasActiveFilters = !!(
    filters.search ||
    filters.cuisineTag ||
    filters.minCalories ||
    filters.maxCalories ||
    filters.sortBy !== 'createdAt' ||
    filters.order !== 'desc'
  );

  const activeCuisine = filters.cuisineTag || 'All';
  const selectedCount = selectedIds?.size ?? 0;

  return (
    <div className="w-full bg-[#F7FAF8] min-h-screen dark:bg-[#0a0a0a]">
      {/* 1. Sleek Compact Header */}
      <div className="w-full border-b border-[#DCE9E4] bg-white/80 backdrop-blur-md dark:border-border dark:bg-[#121c19]/80">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-[#65B82E]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#007F78] dark:text-accent">
                  NutriAI Meal Library
                </span>
              </div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#163330] dark:text-foreground">
                Explore Nutritious Meals
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-[#55706B] dark:text-muted">
                Hand-curated, macro-balanced dishes calibrated for health and flavor.
              </p>
            </div>

            {/* Results Count Badge */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              {!isLoading && totalItems > 0 && (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#DCE9E4] bg-[#F7FAF8] px-3.5 py-1.5 text-xs font-semibold text-[#163330] shadow-2xs dark:border-border dark:bg-surface-secondary dark:text-foreground">
                  <span className="text-[#007F78] dark:text-accent font-bold">{totalItems}</span>
                  <span>{noun} available</span>
                </div>
              )}
            </div>
          </div>

          {/* 2. Horizontal Cuisine Quick-Pills Carousel with Navigation Arrows */}
          <div className="relative mt-5">
            {/* Left Arrow Button with Gradient Fade */}
            <div
              className={`pointer-events-none absolute left-0 top-0 bottom-0 z-10 flex items-center pr-8 pl-0.5 bg-gradient-to-r from-white via-white/95 to-transparent transition-all duration-300 dark:from-[#121c19] dark:via-[#121c19]/95 dark:to-transparent ${
                canScrollLeft ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
              }`}
            >
              <button
                type="button"
                disabled={!canScrollLeft}
                onClick={() => scrollCarousel('left')}
                aria-label="Scroll cuisines left"
                title="Scroll cuisines left"
                className={`flex h-7 w-7 items-center justify-center rounded-full border border-[#DCE9E4] bg-white text-[#163330] shadow-sm transition-all duration-200 hover:scale-110 hover:border-[#007F78] hover:bg-[#DDF5F0] hover:text-[#007F78] active:scale-95 dark:border-border dark:bg-[#1a1a1a] dark:text-foreground dark:hover:border-accent dark:hover:bg-accent/20 dark:hover:text-accent ${
                  canScrollLeft ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none cursor-default'
                }`}
              >
                <HiChevronLeft className="h-4 w-4" />
              </button>
            </div>

            {/* Scroll Container */}
            <div
              ref={cuisineScrollRef}
              onScroll={checkScrollPosition}
              className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
            >
              {allCuisineTags.map((tag) => {
                const isSelected =
                  tag === 'All'
                    ? !filters.cuisineTag
                    : filters.cuisineTag.toLowerCase() === tag.toLowerCase();
                return (
                  <button
                    key={tag}
                    type="button"
                    data-selected={isSelected}
                    onClick={(e) => handleCuisineSelect(tag, e)}
                    className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#007F78] text-white shadow-xs dark:bg-accent'
                        : 'bg-white text-[#55706B] border border-[#DCE9E4] hover:border-[#007F78]/40 hover:text-[#007F78] hover:bg-[#F7FAF8] dark:bg-[#1a1a1a] dark:border-border dark:text-muted dark:hover:text-accent dark:hover:border-accent/40'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            {/* Right Arrow Button with Gradient Fade */}
            <div
              className={`pointer-events-none absolute right-0 top-0 bottom-0 z-10 flex items-center pl-8 pr-0.5 bg-gradient-to-l from-white via-white/95 to-transparent transition-all duration-300 dark:from-[#121c19] dark:via-[#121c19]/95 dark:to-transparent ${
                canScrollRight ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
              }`}
            >
              <button
                type="button"
                disabled={!canScrollRight}
                onClick={() => scrollCarousel('right')}
                aria-label="Scroll cuisines right"
                title="Scroll cuisines right"
                className={`flex h-7 w-7 items-center justify-center rounded-full border border-[#DCE9E4] bg-white text-[#163330] shadow-sm transition-all duration-200 hover:scale-110 hover:border-[#007F78] hover:bg-[#DDF5F0] hover:text-[#007F78] active:scale-95 dark:border-border dark:bg-[#1a1a1a] dark:text-foreground dark:hover:border-accent dark:hover:bg-accent/20 dark:hover:text-accent ${
                  canScrollRight ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none cursor-default'
                }`}
              >
                <HiChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Page Area constrained to 1280px */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* 3. Floating Selected Meals Banner (Connects to AI Planner) */}
        {selectedCount > 0 && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-[#007F78]/30 bg-[#DDF5F0]/70 p-4 shadow-sm backdrop-blur-xs dark:border-accent/30 dark:bg-accent/10">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#007F78] text-white dark:bg-accent">
                <HiCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-[#163330] dark:text-foreground">
                  {selectedCount} {selectedCount === 1 ? 'meal' : 'meals'} selected
                </p>
                <p className="text-xs text-[#55706B] dark:text-muted">
                  Ready to incorporate into your customized weekly meal plan.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <Link
                href="/items/selected"
                className="!no-underline rounded-xl border border-[#DCE9E4] bg-white px-3.5 py-2 text-xs font-semibold text-[#163330] shadow-2xs hover:bg-[#F7FAF8] dark:border-border dark:bg-[#1a1a1a] dark:text-foreground"
              >
                Review Selected
              </Link>
              <Link
                href="/meal-plan"
                className="!no-underline inline-flex items-center gap-1.5 rounded-xl bg-[#007F78] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#005F5A] dark:bg-accent dark:hover:bg-accent/90"
              >
                <HiSparkles className="h-3.5 w-3.5" />
                <span>Build AI Plan</span>
              </Link>
            </div>
          </div>
        )}

        {/* 4. Search & Controls Bar */}
        <div className="rounded-2xl border border-[#DCE9E4] bg-white p-3 sm:p-4 shadow-xs dark:border-border dark:bg-[#151f1c]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <HiSearch className="h-4 w-4 text-[#849A95] dark:text-muted" />
              </div>
              <input
                type="text"
                placeholder="Search meals by title, ingredient, or recipe..."
                aria-label="Search meals"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full rounded-xl border border-[#DCE9E4] bg-[#F7FAF8] py-2.5 pl-10 pr-9 text-xs sm:text-sm text-[#163330] outline-none transition-all placeholder:text-[#849A95] focus:border-[#007F78] focus:bg-white focus:ring-2 focus:ring-[#007F78]/20 dark:border-border dark:bg-surface-secondary dark:text-foreground dark:focus:border-accent"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#849A95] hover:text-[#163330] cursor-pointer dark:hover:text-foreground"
                >
                  <HiX className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown (Custom styled native select) */}
            <div className="relative shrink-0">
              <select
                aria-label="Sort meals"
                value={`${filters.sortBy}-${filters.order}`}
                onChange={(e) => {
                  const [sortBy, order] = e.target.value.split('-') as [
                    'calories' | 'rating' | 'createdAt',
                    'asc' | 'desc',
                  ];
                  dispatch(setSortBy(sortBy));
                  dispatch(setOrder(order));
                }}
                className="w-full sm:w-48 appearance-none rounded-xl border border-[#DCE9E4] bg-[#F7FAF8] py-2.5 pl-3.5 pr-8 text-xs sm:text-sm font-semibold text-[#163330] outline-none transition-all hover:border-[#007F78]/40 focus:border-[#007F78] focus:bg-white dark:border-border dark:bg-surface-secondary dark:text-foreground cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[#849A95]">
                <HiChevronDown className="h-4 w-4" />
              </div>
            </div>

            {/* Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 ${
                showAdvancedFilters || (filters.minCalories || filters.maxCalories)
                  ? 'border-[#007F78] bg-[#DDF5F0] text-[#007F78] dark:border-accent dark:bg-accent/20 dark:text-accent'
                  : 'border-[#DCE9E4] bg-[#F7FAF8] text-[#55706B] hover:border-[#007F78]/40 hover:text-[#007F78] dark:border-border dark:bg-surface-secondary dark:text-muted'
              }`}
            >
              <HiAdjustments className="h-4 w-4" />
              <span>Calories</span>
              {(filters.minCalories || filters.maxCalories) && (
                <span className="flex h-2 w-2 rounded-full bg-[#007F78] dark:bg-accent" />
              )}
            </button>

            {/* Reset All Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-1 rounded-xl border border-[#DCE9E4] bg-white px-3 py-2.5 text-xs font-semibold text-[#EF4444] transition-all hover:bg-red-50 cursor-pointer dark:border-border dark:bg-[#1a1a1a] dark:hover:bg-red-950/20"
              >
                <HiX className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>

          {/* 5. Calorie Filters Panel (Smooth Collapse) */}
          {showAdvancedFilters && (
            <div className="mt-4 border-t border-[#DCE9E4] pt-4 dark:border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Calorie Presets */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-semibold text-[#55706B] dark:text-muted mr-1">
                    Quick Targets:
                  </span>
                  {CALORIE_PRESETS.map((preset) => {
                    const isSelected =
                      filters.minCalories === preset.min &&
                      filters.maxCalories === preset.max;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => applyCaloriePreset(preset.min, preset.max)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#F59E0B] text-white shadow-2xs'
                            : 'bg-[#F7FAF8] text-[#55706B] border border-[#DCE9E4] hover:border-[#F59E0B]/50 hover:text-[#F59E0B] dark:bg-surface-secondary dark:border-border dark:text-muted'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>

                {/* Manual Range Input */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      placeholder="Min"
                      aria-label="Minimum calories"
                      value={minCalInput}
                      onChange={(e) => setMinCalInput(e.target.value)}
                      onKeyDown={handleCalKeyDown}
                      className="w-20 rounded-lg border border-[#DCE9E4] bg-[#F7FAF8] px-2.5 py-1.5 text-xs text-[#163330] outline-none focus:border-[#007F78] focus:bg-white dark:border-border dark:bg-surface-secondary dark:text-foreground"
                    />
                    <span className="text-xs text-[#849A95]">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      aria-label="Maximum calories"
                      value={maxCalInput}
                      onChange={(e) => setMaxCalInput(e.target.value)}
                      onKeyDown={handleCalKeyDown}
                      className="w-20 rounded-lg border border-[#DCE9E4] bg-[#F7FAF8] px-2.5 py-1.5 text-xs text-[#163330] outline-none focus:border-[#007F78] focus:bg-white dark:border-border dark:bg-surface-secondary dark:text-foreground"
                    />
                    <span className="text-xs text-[#849A95]">kcal</span>
                  </div>

                  <button
                    type="button"
                    onClick={applyCalorieFilter}
                    className="rounded-lg bg-[#007F78] px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-[#005F5A] cursor-pointer dark:bg-accent"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 6. Active Filter Chips Display */}
          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-[#DCE9E4]/60 pt-3 dark:border-border/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#849A95] dark:text-muted mr-1">
                Active:
              </span>
              {filters.cuisineTag && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#DDF5F0] px-2.5 py-0.5 text-xs font-semibold text-[#007F78] dark:bg-accent/20 dark:text-accent">
                  {filters.cuisineTag}
                  <button
                    type="button"
                    onClick={() => dispatch(setCuisineTag(''))}
                    className="hover:opacity-75 cursor-pointer ml-0.5"
                  >
                    <HiX className="h-3 w-3" />
                  </button>
                </span>
              )}
              {(filters.minCalories || filters.maxCalories) && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FFFBEB] px-2.5 py-0.5 text-xs font-semibold text-[#F59E0B] dark:bg-[#F59E0B]/20">
                  <HiFire className="h-3 w-3" />
                  <span>
                    {filters.minCalories && !filters.maxCalories && `≥ ${filters.minCalories} kcal`}
                    {!filters.minCalories && filters.maxCalories && `≤ ${filters.maxCalories} kcal`}
                    {filters.minCalories && filters.maxCalories && `${filters.minCalories} - ${filters.maxCalories} kcal`}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMinCalInput('');
                      setMaxCalInput('');
                      dispatch(setMinCalories(''));
                      dispatch(setMaxCalories(''));
                    }}
                    className="hover:opacity-75 cursor-pointer ml-0.5"
                  >
                    <HiX className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.search && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF7F3] px-2.5 py-0.5 text-xs font-semibold text-[#163330] dark:bg-surface-secondary dark:text-foreground">
                  &ldquo;{filters.search}&rdquo;
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="hover:opacity-75 cursor-pointer ml-0.5"
                  >
                    <HiX className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* 7. Grid of Meals */}
        <div className="mt-8">
          {isError ? (
            <ErrorFallback error={error as Error} />
          ) : isEmpty ? (
            <div className="rounded-[1.75rem] border border-[#DCE9E4] bg-white p-12 text-center shadow-xs dark:border-border dark:bg-[#151f1c]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DDF5F0] text-[#007F78] dark:bg-accent/20 dark:text-accent mb-4">
                <HiSearch className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-[#163330] dark:text-foreground">
                No matching meals found
              </h3>
              <p className="mt-2 text-sm text-[#55706B] dark:text-muted max-w-md mx-auto">
                We couldn&apos;t find any recipes matching your current filters. Try relaxing your calorie range or searching for another ingredient.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-[#007F78] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#005F5A] cursor-pointer dark:bg-accent dark:hover:bg-accent/90"
              >
                <span>Clear all filters</span>
              </button>
            </div>
          ) : (
            <MealGrid
              meals={data?.data || []}
              isLoading={isLoading}
              selectedIds={selectedIds}
              onToggleSelect={toggleMeal}
            />
          )}
        </div>

        {/* 8. Results Pagination */}
        {!isEmpty && totalPages > 0 && (
          <div className="mt-10 border-t border-[#DCE9E4] pt-8 dark:border-border">
            <ResultsPagination
              page={filters.page}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={PAGE_SIZE}
              noun={noun}
              onPageChange={(p) => dispatch(setPage(p))}
            />
          </div>
        )}
      </div>
    </div>
  );
}