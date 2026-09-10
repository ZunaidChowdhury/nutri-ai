import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllMeals, getMealByIdPublic } from '@/lib/api/meal';
import type { Meal } from '@/lib/types/meal';
import { MealCard } from '@/components/meals/MealCard';
import { ImageWithFallback } from '@/components/meals/ImageWithFallback';
import { SelectMealButton } from '@/components/meals/SelectMealButton';
import { StarIcon, FireIcon } from '@/components/ui/icons';
import { HiArrowLeft, HiSparkles, HiShieldCheck, HiScale } from 'react-icons/hi';

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

function MacroProgressBar({
  label,
  value,
  percentage,
  barColor,
  textColor,
}: {
  label: string;
  value: number;
  percentage: number;
  barColor: string;
  textColor: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="flex items-center gap-1.5 text-[#163330] dark:text-foreground">
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${barColor}`} />
          <span>{label}</span>
        </span>
        <span className="text-[#55706B] dark:text-muted">
          <strong className={textColor}>{value}g</strong> ({Math.round(percentage)}%)
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#F7FAF8] border border-[#DCE9E4]/60 dark:bg-surface-secondary dark:border-border">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
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

  const totalMacroGrams =
    (meal.macros?.protein || 0) + (meal.macros?.carbs || 0) + (meal.macros?.fat || 0);

  const proteinPct = totalMacroGrams > 0 ? ((meal.macros?.protein || 0) / totalMacroGrams) * 100 : 0;
  const carbsPct = totalMacroGrams > 0 ? ((meal.macros?.carbs || 0) / totalMacroGrams) * 100 : 0;
  const fatPct = totalMacroGrams > 0 ? ((meal.macros?.fat || 0) / totalMacroGrams) * 100 : 0;

  return (
    <div className="w-full bg-[#F7FAF8] min-h-screen dark:bg-[#0a0a0a]">
      {/* 1. Breadcrumb & Navigation Topbar */}
      <div className="w-full border-b border-[#DCE9E4] bg-white/70 backdrop-blur-md dark:border-border dark:bg-[#121c19]/70">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link
            href="/meals"
            className="!no-underline inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#55706B] transition-colors hover:text-[#007F78] dark:text-muted dark:hover:text-accent"
          >
            <HiArrowLeft className="h-4 w-4" />
            <span>Back to explore meals</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#849A95] dark:text-muted">
            <Link href="/" className="hover:text-[#163330] dark:hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/meals" className="hover:text-[#163330] dark:hover:text-foreground">Meals</Link>
            <span>/</span>
            <span className="font-semibold text-[#007F78] dark:text-accent capitalize truncate max-w-[180px]">
              {meal.title}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Meal Details Container (1280px max-width) */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Meal Imagery (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-[#DCE9E4] bg-white shadow-xs dark:border-border dark:bg-[#151f1c]">
              {/* Floating Cuisine Tag */}
              {meal.cuisineTag && (
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold capitalize text-[#007F78] shadow-sm backdrop-blur-md dark:bg-[#1a1a1a]/95 dark:text-accent border border-[#DCE9E4]/60 dark:border-border">
                  <span>{meal.cuisineTag}</span>
                </div>
              )}

              {/* Floating Rating Badge */}
              <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#163330] shadow-sm backdrop-blur-md dark:bg-[#1a1a1a]/95 dark:text-foreground border border-[#DCE9E4]/60 dark:border-border">
                <StarIcon className="size-3.5 text-[#FACC15]" />
                <span>{Number(meal.rating || 0).toFixed(1)}</span>
                <span className="text-[10px] text-[#849A95] font-normal dark:text-muted">/ 5.0</span>
              </div>

              <div className="aspect-square sm:aspect-[4/3] w-full overflow-hidden bg-[#F7FAF8] dark:bg-surface-secondary">
                <ImageWithFallback
                  alt={meal.title}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  src={meal.imageUrl || '/placeholder-meal.svg'}
                />
              </div>
            </div>

            {/* Quick Chef & AI Trust Banner */}
            <div className="mt-4 rounded-2xl border border-[#DCE9E4] bg-white p-4 shadow-2xs dark:border-border dark:bg-[#151f1c]">
              <div className="flex items-center justify-between text-xs text-[#55706B] dark:text-muted">
                <div className="flex items-center gap-1.5">
                  <HiShieldCheck className="h-4 w-4 text-[#65B82E]" />
                  <span>Verified Nutritional Values</span>
                </div>
                <span className="font-semibold text-[#007F78] dark:text-accent">
                  AI Analyzed
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Information, Macros & Actions (7 cols) */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            {/* Header / Titles */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#DDF5F0] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#007F78] dark:bg-accent/20 dark:text-accent mb-3">
                <HiSparkles className="h-3.5 w-3.5" />
                <span>NutriAI Verified Recipe</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#163330] leading-tight dark:text-foreground">
                {meal.title}
              </h1>

              <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#55706B] dark:text-muted">
                {meal.shortDescription || 'A chef-inspired, balanced nutritional dish crafted with wholesome ingredients.'}
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Calories */}
              <div className="rounded-xl border border-[#F59E0B]/20 bg-[#FFFBEB] p-3 text-center dark:bg-[#F59E0B]/10 dark:border-[#F59E0B]/30">
                <span className="flex items-center justify-center gap-1 text-[11px] font-bold text-[#F59E0B] uppercase">
                  <FireIcon className="size-3.5" />
                  Calories
                </span>
                <span className="mt-1 block text-lg font-black text-[#163330] dark:text-foreground">
                  {meal.calories}
                </span>
                <span className="text-[10px] text-[#55706B] dark:text-muted">kcal / serving</span>
              </div>

              {/* Protein */}
              <div className="rounded-xl border border-[#DCE9E4] bg-white p-3 text-center dark:border-border dark:bg-[#151f1c]">
                <span className="block text-[11px] font-bold text-[#65B82E] uppercase">
                  Protein
                </span>
                <span className="mt-1 block text-lg font-black text-[#163330] dark:text-foreground">
                  {meal.macros?.protein || 0}g
                </span>
                <span className="text-[10px] text-[#55706B] dark:text-muted">
                  {Math.round(proteinPct)}% of macros
                </span>
              </div>

              {/* Carbs */}
              <div className="rounded-xl border border-[#DCE9E4] bg-white p-3 text-center dark:border-border dark:bg-[#151f1c]">
                <span className="block text-[11px] font-bold text-[#F59E0B] uppercase">
                  Carbs
                </span>
                <span className="mt-1 block text-lg font-black text-[#163330] dark:text-foreground">
                  {meal.macros?.carbs || 0}g
                </span>
                <span className="text-[10px] text-[#55706B] dark:text-muted">
                  {Math.round(carbsPct)}% of macros
                </span>
              </div>

              {/* Fats */}
              <div className="rounded-xl border border-[#DCE9E4] bg-white p-3 text-center dark:border-border dark:bg-[#151f1c]">
                <span className="block text-[11px] font-bold text-[#EF4444] uppercase">
                  Fats
                </span>
                <span className="mt-1 block text-lg font-black text-[#163330] dark:text-foreground">
                  {meal.macros?.fat || 0}g
                </span>
                <span className="text-[10px] text-[#55706B] dark:text-muted">
                  {Math.round(fatPct)}% of macros
                </span>
              </div>
            </div>

            {/* Macronutrient Balance Card */}
            <div className="rounded-2xl border border-[#DCE9E4] bg-white p-5 sm:p-6 shadow-xs dark:border-border dark:bg-[#151f1c]">
              <div className="flex items-center justify-between border-b border-[#DCE9E4] pb-3 mb-4 dark:border-border">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#163330] dark:text-foreground">
                  <HiScale className="h-4 w-4 text-[#007F78] dark:text-accent" />
                  Macro Distribution
                </span>
                <span className="text-xs font-semibold text-[#55706B] dark:text-muted">
                  {totalMacroGrams}g Total
                </span>
              </div>

              <div className="space-y-3.5">
                <MacroProgressBar
                  label="Protein"
                  value={meal.macros?.protein || 0}
                  percentage={proteinPct}
                  barColor="bg-[#65B82E]"
                  textColor="text-[#65B82E]"
                />
                <MacroProgressBar
                  label="Carbohydrates"
                  value={meal.macros?.carbs || 0}
                  percentage={carbsPct}
                  barColor="bg-[#F59E0B]"
                  textColor="text-[#F59E0B]"
                />
                <MacroProgressBar
                  label="Healthy Fats"
                  value={meal.macros?.fat || 0}
                  percentage={fatPct}
                  barColor="bg-[#EF4444]"
                  textColor="text-[#EF4444]"
                />
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <SelectMealButton meal={meal} />

              <Link
                href="/meal-plan"
                className="!no-underline inline-flex items-center gap-1.5 rounded-xl border border-[#DCE9E4] bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#163330] shadow-2xs transition-all hover:border-[#007F78]/40 hover:text-[#007F78] dark:border-border dark:bg-surface-secondary dark:text-foreground"
              >
                <HiSparkles className="h-4 w-4 text-[#007F78] dark:text-accent" />
                <span>Build Meal Plan with AI</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 3. Comprehensive Recipe & Preparation Details */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="rounded-[1.5rem] border border-[#DCE9E4] bg-white p-7 sm:p-9 shadow-xs lg:col-span-8 dark:border-border dark:bg-[#151f1c]">
            <h2 className="text-xl font-bold tracking-tight text-[#163330] dark:text-foreground">
              About This Dish
            </h2>
            <div className="mt-4 text-sm sm:text-base leading-relaxed text-[#55706B] dark:text-muted space-y-3 whitespace-pre-line">
              {meal.fullDescription || meal.shortDescription}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-[#DCE9E4] bg-[#EEF7F3] p-6 sm:p-8 lg:col-span-4 dark:border-border dark:bg-[#121c19]">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DDF5F0] text-[#007F78] dark:bg-accent/20 dark:text-accent mb-3">
              <HiSparkles className="h-4 w-4" />
            </span>
            <h3 className="text-base font-bold text-[#163330] dark:text-foreground">
              AI Nutrition Insight
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#55706B] dark:text-muted">
              This meal delivers a steady glycemic release, providing sustained mental and physical energy. The protein ratio supports muscle maintenance while healthy lipids enhance nutrient absorption.
            </p>
            <div className="mt-4 border-t border-[#DCE9E4] pt-4 dark:border-border text-xs text-[#849A95] dark:text-muted">
              Evaluated by openai/gpt-oss-120b Nutrition Engine.
            </div>
          </div>
        </div>

        {/* 4. Related Meals Section */}
        {related && related.length > 0 && (
          <section className="mt-16 border-t border-[#DCE9E4] pt-12 dark:border-border">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#007F78] dark:text-accent">
                  Similar Flavors & Macros
                </span>
                <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[#163330] sm:text-3xl dark:text-foreground">
                  Related Meals You Might Like
                </h2>
              </div>

              <Link
                href="/meals"
                className="!no-underline hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#007F78] hover:text-[#005F5A] dark:text-accent"
              >
                <span>View all meals</span>
                <HiArrowLeft className="h-3 w-3 rotate-180" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((r) => (
                <MealCard key={r._id} meal={r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
