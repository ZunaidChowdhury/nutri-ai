import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Image } from '@heroui/image';
import { Chip } from '@heroui/chip';
import { Button } from '@heroui/button';
import { getAllMeals, getMealByIdPublic } from '@/lib/api/meal';
import type { Meal } from '@/lib/types/meal';
import { MealCard } from '@/components/meals/MealCard';
import { StarIcon, FireIcon } from '@/components/ui/icons';

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const res = await getAllMeals({ limit: 100 });
    return res.data.map((meal) => ({ id: meal._id }));
  } catch {
    return [];
  }
}

interface Props {
  params: Promise<{ id: string }>;
}

function MacroBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-default-500">{value}g</span>
      </div>
      <div className="h-2 w-full bg-default-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}

export default async function MealDetailPage({ params }: Props) {
  const { id } = await params;

  let meal: Meal;
  let related: Meal[];

  try {
    const res = await getMealByIdPublic(id);
    meal = res.data;
    related = res.related;
  } catch {
    notFound();
  }

  const totalMacros = meal.macros.protein + meal.macros.carbs + meal.macros.fat;

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full p-4 md:p-8 gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-xl overflow-hidden border border-default-200 dark:border-default-100">
          <Image
            alt={meal.title}
            className="object-cover w-full aspect-square md:aspect-[4/3]"
            src={meal.imageUrl || '/placeholder-meal.svg'}
            fallbackSrc="/placeholder-meal.svg"
            radius="none"
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-2xl md:text-3xl font-bold">{meal.title}</h1>
              <Chip variant="flat" size="sm" className="shrink-0 mt-1">
                {meal.cuisineTag}
              </Chip>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-yellow-500">
                <StarIcon className="size-4" />
                {meal.rating.toFixed(1)}
              </span>
              <span className="flex items-center gap-1 text-default-500">
                <FireIcon className="size-4" />
                {meal.calories} calories
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 p-4 rounded-xl bg-default-50 dark:bg-default-100/50">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-default-500">
              Nutritional Information
            </h2>
            <MacroBar label="Protein" value={meal.macros.protein} total={totalMacros} color="bg-primary" />
            <MacroBar label="Carbs" value={meal.macros.carbs} total={totalMacros} color="bg-success" />
            <MacroBar label="Fat" value={meal.macros.fat} total={totalMacros} color="bg-warning" />
          </div>

          <p className="text-default-600 leading-relaxed">{meal.fullDescription}</p>

          <Button
            as={Link}
            href="/meals"
            variant="flat"
            className="self-start"
          >
            &larr; Back to explore
          </Button>
        </div>
      </div>

      {related.length > 0 && (
        <section className="flex flex-col gap-4 pt-4">
          <h2 className="text-xl font-semibold">Related Meals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((r) => (
              <MealCard key={r._id} meal={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
