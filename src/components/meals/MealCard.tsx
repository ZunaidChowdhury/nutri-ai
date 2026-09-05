'use client';

import { Card } from '@heroui/react';
import { Chip } from '@heroui/react';
import { Button } from '@heroui/react';
import Link from 'next/link';
import type { Meal } from '@/lib/types/meal';
import { FireIcon, StarIcon } from '@/components/ui/icons';

interface MealCardProps {
  meal: Meal;
}

export function MealCard({ meal }: MealCardProps) {
  return (
    <Card className="group w-full border border-border">
      <Card.Header className="p-0 overflow-hidden">
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
      </Card.Header>
      <Card.Content className="gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/meals/${meal._id}`}>
            <h3 className="text-lg font-semibold line-clamp-1 group-hover:text-accent transition-colors">{meal.title}</h3>
          </Link>
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
      </Card.Footer>
    </Card>
  );
}