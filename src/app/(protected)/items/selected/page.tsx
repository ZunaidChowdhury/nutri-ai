'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  TextField,
  Input,
  Label,
  Select,
  ListBox,
  Button,
} from '@heroui/react';
import { useSession } from '@/lib/auth/client';
import { useSelectedMeals } from '@/lib/hooks/useSelectedMeals';
import { MealGrid } from '@/components/meals/MealGrid';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorFallback } from '@/components/feedback/ErrorFallback';
import { ResultsPagination } from '@/components/ui/ResultsPagination';
import { Chip } from '@heroui/react';

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

  const hasFilters = !!(search || cuisineTag || minCal || maxCal);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold">Selected Meals</h1>
        <p className="text-muted">
          Your hand-picked meals. The AI meal planner builds your 7-day plan
          from these when you choose &quot;Selected Meals&quot; — select at least 10
          to use them.
        </p>
      </div>

      {isError ? (
        <ErrorFallback error={error as Error} />
      ) : selectedMeals.length === 0 && !isLoading ? (
        <EmptyState
          title="No selected meals yet"
          description="Tap the + icon on any public meal card in Explore, or on your own meals in Manage Meals, to build your selection."
          action={
            <Link href="/meals">
              <Button variant="primary">Browse meals</Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Chip variant="soft" color="accent" size="sm">
                {selectedMeals.length} selected
              </Chip>
              <span className="text-xs text-muted">
                Tap the check icon to remove a meal.
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <TextField className="w-full md:max-w-md" fullWidth>
              <Input
                type="text"
                placeholder="Search by name..."
                aria-label="Search selected meals"
                value={search}
                onChange={(e) => handleFilterChange(setSearch)(e.target.value)}
              />
            </TextField>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                  value={minCal}
                  onChange={(e) => handleFilterChange(setMinCal)(e.target.value)}
                />
              </TextField>

              <TextField className="w-full" fullWidth>
                <Label>Max calories</Label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={maxCal}
                  onChange={(e) => handleFilterChange(setMaxCal)(e.target.value)}
                />
              </TextField>

              <div className="flex items-end">
                {hasFilters && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onPress={() => {
                      setSearch('');
                      setCuisineTag('');
                      setMinCal('');
                      setMaxCal('');
                      setPage(1);
                    }}
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              title="No meals match your filters"
              description="Try adjusting the search, cuisine, or calorie range."
              action={
                hasFilters ? (
                  <Button
                    variant="primary"
                    onPress={() => {
                      setSearch('');
                      setCuisineTag('');
                      setMinCal('');
                      setMaxCal('');
                      setPage(1);
                    }}
                  >
                    Clear filters
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <>
              <MealGrid
                meals={pageItems}
                isLoading={isLoading}
                selectedIds={selectedIds}
                onToggleSelect={toggleMeal}
              />
              <ResultsPagination
                page={safePage}
                totalPages={totalPages}
                totalItems={filtered.length}
                pageSize={PAGE_SIZE}
                noun="result"
                onPageChange={setPage}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}