'use client';

import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Button } from '@heroui/button';
import Link from 'next/link';
import type { Meal } from '@/lib/types/meal';
import { FireIcon, StarIcon } from '@/components/ui/icons';

interface MealCardProps {
  meal: Meal;
}

export function MealCard({ meal }: MealCardProps) {
  return (
    <Card className="group w-full border border-default-200 dark:border-default-100">
      <CardHeader className="p-0 overflow-hidden">
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
      </CardHeader>
      <CardBody className="gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/meals/${meal._id}`}>
            <h3 className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">{meal.title}</h3>
          </Link>
          <Chip
            size="sm"
            variant="flat"
            className="shrink-0"
          >
            {meal.cuisineTag}
          </Chip>
        </div>
        <p className="text-sm text-default-500 line-clamp-2">
          {meal.shortDescription}
        </p>
        <div className="flex items-center gap-3 text-xs text-default-400">
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
      </CardBody>
      <CardFooter className="p-4 pt-0">
        <Link
          href={`/meals/${meal._id}`}
          className="w-full"
        >
          <Button
            variant="flat"
            color="primary"
            size="sm"
            fullWidth
          >
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
