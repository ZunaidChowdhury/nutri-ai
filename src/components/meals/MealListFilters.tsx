'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { TextField, Input, Label, Select, ListBox } from '@heroui/react';
import { useCuisines, FALLBACK_CUISINES } from '@/lib/hooks/useCuisines';

export const CUISINE_TAGS = FALLBACK_CUISINES;

const SEARCH_DEBOUNCE_MS = 400;

interface MealListFiltersProps {
  search: string;
  cuisineTag: string;
  onSearchChange: (value: string) => void;
  onCuisineTagChange: (value: string) => void;
  searchPlaceholder?: string;
  searchOnEnter?: boolean;
}

export function MealListFilters({
  search,
  cuisineTag,
  onSearchChange,
  onCuisineTagChange,
  searchPlaceholder = 'Search by name...',
  searchOnEnter = false,
}: MealListFiltersProps) {
  const { cuisineNames } = useCuisines();
  const [searchInput, setSearchInput] = useState(search);
  const [prevSearch, setPrevSearch] = useState(search);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (prevSearch !== search) {
    setPrevSearch(search);
    setSearchInput(search);
  }

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      if (searchOnEnter) return;
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        onSearchChange(value);
      }, SEARCH_DEBOUNCE_MS);
    },
    [onSearchChange, searchOnEnter]
  );

  const handleSearchKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        onSearchChange(searchInput);
      }
    },
    [onSearchChange, searchInput]
  );

  return (
    <div className="bg-white dark:bg-[#161f1e] rounded-2xl border border-[#DCE9E4] dark:border-[#263835] p-4 flex flex-col gap-3 sm:flex-row sm:items-end w-full">
      <TextField className="w-full sm:max-w-md" fullWidth>
        <Label>Search</Label>
        <div className="relative w-full">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#849A95] dark:text-[#6E8883] pointer-events-none z-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <Input
            type="search"
            placeholder={searchPlaceholder}
            aria-label="Search meals"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={searchOnEnter ? handleSearchKeyDown : undefined}
            className="pl-10 placeholder:text-[#849A95] dark:placeholder:text-[#6E8883]"
          />
        </div>
      </TextField>

      <Select
        className="w-full sm:max-w-xs"
        placeholder="All cuisines"
        value={cuisineTag || null}
        onChange={(key) => onCuisineTagChange((key as string) || '')}
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
            {cuisineNames.map((tag) => (
              <ListBox.Item key={tag} id={tag} textValue={tag}>
                {tag}
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}