'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  Button,
  Chip,
  Input,
  Label,
  ListBox,
  Select,
  Table,
  TextField,
} from '@heroui/react';
import { FiPlus } from 'react-icons/fi';
import { useSession } from '@/lib/auth/client';
import { useSelectedMeals } from '@/lib/hooks/useSelectedMeals';
import { MealCard } from '@/components/meals/MealCard';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorFallback } from '@/components/feedback/ErrorFallback';
import { Spinner } from '@/components/feedback/Spinner';
import { ResultsPagination } from '@/components/ui/ResultsPagination';

export const CUISINE_TAGS = [
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

export default function SelectedMealsPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { selectedMeals, selectedIds, toggleMeal, isLoading, isError, error } =
    useSelectedMeals(userId);

  const [search, setSearch] = useState('');
  const [cuisineTag, setCuisineTag] = useState('');
  const [minCal, setMinCal] = useState('');
  const [maxCal, setMaxCal] = useState('');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const min = minCal ? Number(minCal) : null;
    const max = maxCal ? Number(maxCal) : null;
    return selectedMeals.filter((m) => {
      if (term && !m.title.toLowerCase().includes(term)) return false;
      if (cuisineTag && m.cuisineTag.toLowerCase() !== cuisineTag.toLowerCase())
        return false;
      if (min !== null && m.calories < min) return false;
      if (max !== null && m.calories > max) return false;
      return true;
    });
  }, [selectedMeals, search, cuisineTag, minCal, maxCal]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = useMemo(
    () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filtered, safePage]
  );

  const handleFilterChange = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setCuisineTag('');
    setMinCal('');
    setMaxCal('');
    setPage(1);
  };

  const hasFilters = !!(search || cuisineTag || minCal || maxCal);
  const canPlan = selectedMeals.length >= 10;

  if (isError) {
    return (
      <div className="flex flex-col gap-6 px-4 md:px-8 py-6 md:py-8 max-w-[1280px] mx-auto w-full">
        <ErrorFallback error={error as Error} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-4 md:px-8 py-6 md:py-8 max-w-[1280px] mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-bold text-[#163330]">
            Selected Meals
          </h1>
          <p className="text-[#55706B]">
            {selectedMeals.length} meal{selectedMeals.length !== 1 ? 's' : ''} in your collection
            {canPlan ? ' • Ready for AI meal planning' : ' • Select at least 10 to generate an AI plan'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/meals" className="!no-underline">
            <button className="flex items-center gap-1.5 border border-[#DCE9E4] text-[#55706B] hover:bg-[#EEF7F3] px-3.5 py-2 rounded-xl transition-colors font-medium text-sm">
              <FiPlus size={16} />
              Browse Meals
            </button>
          </Link>

          <Link href="/meal-plan" className="!no-underline">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors font-medium text-sm ${
                canPlan
                  ? 'bg-[#007F78] hover:bg-[#005F5A] text-white'
                  : 'bg-[#EEF7F3] text-[#55706B] hover:bg-[#DDF5F0]'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate Meal Plan
            </button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Spinner label="Loading selected meals..." />
        </div>
      ) : selectedMeals.length === 0 ? (
        <div className="px-4 py-12 w-full">
          <EmptyState
            title="No selected meals yet"
            description="Tap the + bookmark button on any meal card across Nutri AI to add it to your selection."
            action={
              <Link href="/meals" className="!no-underline">
                <button className="flex items-center gap-2 bg-[#007F78] hover:bg-[#005F5A] text-white px-5 py-2.5 rounded-xl transition-colors font-medium">
                  <FiPlus size={18} />
                  Browse Meals
                </button>
              </Link>
            }
          />
        </div>
      ) : (
        <>
          {/* AI Meal Plan Readiness Callout */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#EEF7F3] border border-[#DCE9E4] flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#DDF5F0] flex items-center justify-center text-[#007F78] flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#163330]">
                  {canPlan
                    ? `Ready to generate! You have ${selectedMeals.length} selected meals.`
                    : `Select ${10 - selectedMeals.length} more meal${10 - selectedMeals.length === 1 ? '' : 's'} to unlock AI meal planning from this list.`}
                </p>
                <p className="text-xs text-[#55706B]">
                  {canPlan
                    ? 'The AI can now create a tailored 7-day plan exclusively from your chosen items.'
                    : 'The AI meal planner requires at least 10 meals to build a healthy, balanced weekly variety.'}
                </p>
              </div>
            </div>

            {canPlan ? (
              <Link href="/meal-plan" className="!no-underline">
                <button className="px-4 py-2 rounded-xl bg-[#007F78] hover:bg-[#005F5A] text-white text-xs font-semibold transition-colors">
                  Create AI Plan →
                </button>
              </Link>
            ) : (
              <Link href="/meals" className="!no-underline">
                <button className="px-4 py-2 rounded-xl bg-white border border-[#DCE9E4] text-[#007F78] hover:bg-[#DDF5F0] text-xs font-semibold transition-colors">
                  Explore More
                </button>
              </Link>
            )}
          </div>

          {/* Filter Bar (matching /items/manage) */}
          <div className="bg-white rounded-2xl border border-[#DCE9E4] p-4 flex flex-col gap-3 lg:flex-row lg:items-end w-full">
            {/* Search */}
            <div className="w-full lg:max-w-sm">
              <TextField className="w-full" fullWidth>
                <Label>Search</Label>
                <div className="relative w-full">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#849A95] pointer-events-none z-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <Input
                    type="search"
                    placeholder="Search by meal name..."
                    aria-label="Search selected meals"
                    value={search}
                    onChange={(e) => handleFilterChange(setSearch)(e.target.value)}
                    className="pl-9 placeholder:text-[#849A95]"
                  />
                </div>
              </TextField>
            </div>

            {/* Cuisine Select */}
            <div className="w-full lg:max-w-xs">
              <Select
                className="w-full"
                placeholder="All cuisines"
                value={cuisineTag || null}
                onChange={(key) =>
                  handleFilterChange(setCuisineTag)((key as string) || '')
                }
              >
                <Label>Cuisine</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    <ListBox.Item id="" textValue="All cuisines">
                      All cuisines
                    </ListBox.Item>
                    {CUISINE_TAGS.map((tag) => (
                      <ListBox.Item key={tag} id={tag} textValue={tag}>
                        {tag}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            {/* Calorie Range */}
            <div className="grid grid-cols-2 gap-2 w-full lg:max-w-xs">
              <TextField className="w-full" fullWidth>
                <Label>Min cal</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={minCal}
                  onChange={(e) => handleFilterChange(setMinCal)(e.target.value)}
                />
              </TextField>
              <TextField className="w-full" fullWidth>
                <Label>Max cal</Label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={maxCal}
                  onChange={(e) => handleFilterChange(setMaxCal)(e.target.value)}
                />
              </TextField>
            </div>

            {/* Clear filters & View Toggle */}
            <div className="flex items-center gap-2 lg:ml-auto">
              {hasFilters && (
                <Button
                  variant="secondary"
                  size="sm"
                  onPress={clearFilters}
                  className="bg-transparent border border-[#DCE9E4] text-[#55706B] hover:bg-[#EEF7F3]"
                >
                  Clear filters
                </Button>
              )}

              {/* View switch (desktop) */}
              <div className="hidden md:flex items-center rounded-xl border border-[#DCE9E4] p-0.5 bg-[#F7FAF8]">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    viewMode === 'table'
                      ? 'bg-white text-[#007F78] shadow-sm font-semibold'
                      : 'text-[#55706B] hover:text-[#163330]'
                  }`}
                  aria-label="Table view"
                >
                  Table
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-[#007F78] shadow-sm font-semibold'
                      : 'text-[#55706B] hover:text-[#163330]'
                  }`}
                  aria-label="Card grid view"
                >
                  Cards
                </button>
              </div>
            </div>
          </div>

          {/* Meal List Content */}
          {filtered.length === 0 ? (
            <div className="px-4 py-8 w-full">
              <EmptyState
                title="Nothing matched"
                description="No selected meals match your search or calorie filters."
                action={
                  <Button
                    variant="secondary"
                    onPress={clearFilters}
                    className="bg-transparent border border-[#DCE9E4] text-[#55706B] hover:bg-[#EEF7F3]"
                  >
                    Clear filters
                  </Button>
                }
              />
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              {viewMode === 'table' ? (
                <div className="hidden md:block">
                  <Table className="rounded-2xl border border-[#DCE9E4]">
                    <Table.ScrollContainer>
                      <Table.Content aria-label="Selected meals table" className="min-w-[600px]">
                        <Table.Header>
                          <Table.Column>
                            <span className="text-[#849A95] text-xs font-semibold uppercase tracking-wide">
                              IMAGE
                            </span>
                          </Table.Column>
                          <Table.Column isRowHeader>
                            <span className="text-[#849A95] text-xs font-semibold uppercase tracking-wide">
                              TITLE
                            </span>
                          </Table.Column>
                          <Table.Column>
                            <span className="text-[#849A95] text-xs font-semibold uppercase tracking-wide">
                              CUISINE
                            </span>
                          </Table.Column>
                          <Table.Column>
                            <span className="text-[#849A95] text-xs font-semibold uppercase tracking-wide">
                              CALORIES
                            </span>
                          </Table.Column>
                          <Table.Column>
                            <span className="text-[#849A95] text-xs font-semibold uppercase tracking-wide">
                              MACROS (P / C / F)
                            </span>
                          </Table.Column>
                          <Table.Column>
                            <span className="text-[#849A95] text-xs font-semibold uppercase tracking-wide">
                              RATING
                            </span>
                          </Table.Column>
                          <Table.Column>
                            <span className="text-[#849A95] text-xs font-semibold uppercase tracking-wide">
                              ACTIONS
                            </span>
                          </Table.Column>
                        </Table.Header>
                        <Table.Body>
                          {pageItems.map((meal) => (
                            <Table.Row key={meal._id} id={meal._id} className="hover:bg-[#F7FAF8] transition-colors">
                              <Table.Cell>
                                <img
                                  src={meal.imageUrl || '/placeholder-meal.svg'}
                                  alt={meal.title}
                                  className="w-12 h-12 object-cover rounded-xl"
                                  onError={(e) => {
                                    e.currentTarget.src = '/placeholder-meal.svg';
                                  }}
                                />
                              </Table.Cell>
                              <Table.Cell className="font-medium text-[#163330]">
                                {meal.title}
                              </Table.Cell>
                              <Table.Cell>
                                <Chip size="sm" className="bg-[#EEF7F3] text-[#163330] border border-[#DCE9E4]">
                                  {meal.cuisineTag}
                                </Chip>
                              </Table.Cell>
                              <Table.Cell className="font-semibold text-[#163330]">
                                {meal.calories}
                              </Table.Cell>
                              <Table.Cell>
                                <div className="flex items-center gap-1.5 text-xs">
                                  <span className="px-1.5 py-0.5 rounded bg-[#DDF5F0] text-[#007F78] font-medium">
                                    {meal.macros?.protein ?? 0}g
                                  </span>
                                  <span className="px-1.5 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] font-medium">
                                    {meal.macros?.carbs ?? 0}g
                                  </span>
                                  <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-600 font-medium">
                                    {meal.macros?.fat ?? 0}g
                                  </span>
                                </div>
                              </Table.Cell>
                              <Table.Cell className="text-[#163330]">
                                ⭐ {meal.rating?.toFixed(1) ?? '4.5'}
                              </Table.Cell>
                              <Table.Cell>
                                <div className="flex items-center gap-2">
                                  <Link href={`/meals/${meal._id}`} className="!no-underline">
                                    <Button
                                      size="sm"
                                      className="bg-transparent border border-[#DCE9E4] text-[#55706B] hover:bg-[#EEF7F3]"
                                    >
                                      View
                                    </Button>
                                  </Link>
                                  <Button
                                    size="sm"
                                    onPress={() => toggleMeal(meal)}
                                    className="bg-transparent border border-red-200 text-red-500 hover:bg-red-50"
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table.Content>
                    </Table.ScrollContainer>
                  </Table>
                </div>
              ) : (
                /* Desktop Grid View */
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {pageItems.map((meal) => (
                    <div key={meal._id} className="flex flex-col gap-2">
                      <MealCard
                        meal={meal}
                        selected={true}
                        onToggleSelect={() => toggleMeal(meal)}
                      />
                      <div className="flex gap-2">
                        <Link href={`/meals/${meal._id}`} className="flex-1 !no-underline">
                          <Button size="sm" className="w-full bg-transparent border border-[#DCE9E4] text-[#55706B] hover:bg-[#EEF7F3]">
                            View
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          onPress={() => toggleMeal(meal)}
                          className="flex-1 bg-transparent border border-red-200 text-red-500 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Mobile Card Grid (always cards on mobile like /items/manage) */}
              <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pageItems.map((meal) => (
                  <div key={meal._id} className="flex flex-col gap-2">
                    <MealCard
                      meal={meal}
                      selected={selectedIds.has(meal._id)}
                      onToggleSelect={() => toggleMeal(meal)}
                    />
                    <div className="flex gap-2">
                      <Link href={`/meals/${meal._id}`} className="flex-1 !no-underline">
                        <Button size="sm" className="w-full bg-transparent border border-[#DCE9E4] text-[#55706B] hover:bg-[#EEF7F3]">
                          View
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        onPress={() => toggleMeal(meal)}
                        className="flex-1 bg-transparent border border-red-200 text-red-500 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {filtered.length > 0 && (
                <ResultsPagination
                  page={safePage}
                  totalPages={totalPages}
                  totalItems={filtered.length}
                  pageSize={PAGE_SIZE}
                  noun={filtered.length !== 1 ? 'meals' : 'meal'}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}