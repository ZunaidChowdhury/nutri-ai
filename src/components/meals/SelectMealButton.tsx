'use client';

import { Button } from '@heroui/react';
import { useSession } from '@/lib/auth/client';
import { useSelectedMeals } from '@/lib/hooks/useSelectedMeals';
import { CheckIcon, PlusIcon } from '@/components/ui/icons';
import type { Meal } from '@/lib/types/meal';

export function SelectMealButton({ meal }: { meal: Meal }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { isSelected, toggleMeal } = useSelectedMeals(userId);

  if (!userId) return null;

  const selected = isSelected(meal._id);

  return (
    <Button
      variant={selected ? 'primary' : 'secondary'}
      onPress={() => toggleMeal(meal)}
      className="self-start"
    >
      {selected ? (
        <>
          <CheckIcon className="size-4" /> Selected
        </>
      ) : (
        <>
          <PlusIcon className="size-4" /> Select
        </>
      )}
    </Button>
  );
}