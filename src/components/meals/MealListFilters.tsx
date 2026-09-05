'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { TextField, Input, Label, Select, ListBox } from '@heroui/react';

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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <TextField className="w-full sm:max-w-md" fullWidth>
        <Input
          type="search"
          placeholder={searchPlaceholder}
          aria-label="Search meals"
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          onKeyDown={searchOnEnter ? handleSearchKeyDown : undefined}
        />
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
            {CUISINE_TAGS.map((tag) => (
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