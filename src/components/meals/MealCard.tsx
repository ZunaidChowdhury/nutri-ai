import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import { Image } from '@heroui/image';
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
    <Card className="w-full border border-default-200 dark:border-default-100">
      <CardHeader className="p-0 overflow-hidden">
        <Image
          alt={meal.title}
          className="object-cover w-full h-48"
          src={meal.imageUrl || '/placeholder-meal.svg'}
          fallbackSrc="/placeholder-meal.svg"
          radius="none"
        />
      </CardHeader>
      <CardBody className="gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold line-clamp-1">{meal.title}</h3>
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
        <Button
          as={Link}
          href={`/meals/${meal._id}`}
          variant="flat"
          color="primary"
          size="sm"
          fullWidth
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
