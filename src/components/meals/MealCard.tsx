'use client';

import { Card } from '@heroui/react';
import { Chip } from '@heroui/react';
import { Button } from '@heroui/react';
import Link from 'next/link';
import type { Meal } from '@/lib/types/meal';
import { FireIcon, StarIcon, PlusIcon, CheckIcon } from '@/components/ui/icons';

interface MealCardProps {
  meal: Meal;
  linkDisabled?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
}

export function MealCard({ meal, linkDisabled = false, selected = false, onToggleSelect }: MealCardProps) {
  return (
    <Card className="group w-full border border-border">
      <Card.Header className="p-0 overflow-hidden relative">
        {onToggleSelect && (
          <button
            type="button"
            aria-label={selected ? 'Remove from selected meals' : 'Add to selected meals'}
            title={selected ? 'Remove from selected meals' : 'Add to selected meals'}
            onClick={() => onToggleSelect()}
            className={`absolute top-2 right-2 z-10 flex items-center justify-center w-8 h-8 rounded-full shadow-sm transition-colors cursor-pointer ${
              selected
                ? 'bg-success text-background border border-success'
                : 'bg-background/90 text-muted hover:text-foreground border border-border'
            }`}
          >
            {selected ? <CheckIcon className="size-4" /> : <PlusIcon className="size-4" />}
          </button>
        )}
        {linkDisabled ? (
          <div className="block w-full h-48 overflow-hidden">
            <img
              alt={meal.title}
              className="w-full h-full object-cover"
              src={meal.imageUrl || '/placeholder-meal.svg'}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-meal.svg';
              }}
            />
          </div>
        ) : (
          <Link href={`/meals/${meal._id}`} className="block w-full h-48 overflow-hidden">
            <img
              alt={meal.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              src={meal.imageUrl || '/placeholder-meal.svg'}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-meal.svg';
              }}
            />
          </Link>
        )}
      </Card.Header>
      <Card.Content className="gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          {linkDisabled ? (
            <h3 className="text-lg font-semibold line-clamp-1">{meal.title}</h3>
          ) : (
            <Link href={`/meals/${meal._id}`}>
              <h3 className="text-lg font-semibold line-clamp-1 group-hover:text-accent transition-colors">{meal.title}</h3>
            </Link>
          )}
          <Chip
            size="sm"
            variant="soft"
            className="shrink-0"
          >
            {meal.cuisineTag}
          </Chip>
        </div>
        <p className="text-sm text-muted line-clamp-2">
          {meal.shortDescription}
        </p>
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="flex items-center gap-1">
            <FireIcon className="size-3.5" />
            {meal.calories} cal
          </span>
          <span className="flex items-center gap-1">
            <StarIcon className="size-3.5" />
            {meal.rating.toFixed(1)}
          </span>
          <span>
            P {meal.macros.protein}g · C {meal.macros.carbs}g · F {meal.macros.fat}g
          </span>
        </div>
      </Card.Content>
      <Card.Footer className="p-4 pt-0">
        {linkDisabled ? (
          <Chip size="sm" variant="soft" color="default">
            {meal.lockedVisibility ? 'Private · Locked' : 'Private'}
          </Chip>
        ) : (
          <Link
            href={`/meals/${meal._id}`}
            className="w-full"
          >
            <Button
              variant="primary"
              size="sm"
              fullWidth
            >
              View Details
            </Button>
          </Link>
        )}
      </Card.Footer>
    </Card>
  );
}