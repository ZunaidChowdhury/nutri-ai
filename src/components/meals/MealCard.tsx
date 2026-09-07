'use client';

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
    <div className="group relative flex flex-col h-full w-full rounded-[1.25rem] border border-[#DCE9E4] bg-white overflow-hidden shadow-xs transition-all duration-300 hover:shadow-md hover:border-[#007F78]/40 dark:bg-[#1a1a1a] dark:border-border dark:hover:border-accent/40">
      
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden bg-[#F7FAF8] dark:bg-surface-secondary shrink-0">
        {onToggleSelect && (
          <button
            type="button"
            aria-label={selected ? 'Remove from selected meals' : 'Add to selected meals'}
            title={selected ? 'Remove from selected meals' : 'Add to selected meals'}
            onClick={() => onToggleSelect()}
            className={`absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full shadow-md transition-all cursor-pointer ${
              selected
                ? 'bg-[#22C55E] text-white border border-[#22C55E]'
                : 'bg-white/95 text-[#163330] hover:text-[#007F78] border border-[#DCE9E4] hover:border-[#007F78]/50 dark:bg-[#1a1a1a]/95 dark:text-foreground dark:border-border dark:hover:border-accent/50 dark:hover:text-accent'
            }`}
          >
            {selected ? <CheckIcon className="size-4" /> : <PlusIcon className="size-4" />}
          </button>
        )}

        {linkDisabled ? (
          <img
            alt={meal.title}
            className="h-full w-full object-cover"
            src={meal.imageUrl || '/placeholder-meal.svg'}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-meal.svg';
            }}
          />
        ) : (
          <Link href={`/meals/${meal._id}`} className="block h-full w-full">
            <img
              alt={meal.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={meal.imageUrl || '/placeholder-meal.svg'}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-meal.svg';
              }}
            />
          </Link>
        )}
        
        {/* Cuisine tag floating on image */}
        {meal.cuisineTag && (
          <div className="absolute top-3 left-3 z-10 flex items-center justify-center rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold capitalize text-[#007F78] shadow-sm backdrop-blur-md dark:bg-[#1a1a1a]/90 dark:text-accent border border-[#DCE9E4]/60 dark:border-border">
            {meal.cuisineTag}
          </div>
        )}

        {/* Rating badge floating on image */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-[#163330] shadow-sm backdrop-blur-md dark:bg-[#1a1a1a]/90 dark:text-foreground border border-[#DCE9E4]/60 dark:border-border">
          <StarIcon className="size-3 text-[#FACC15]" />
          <span>{Number(meal.rating || 0).toFixed(1)}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2">
          {linkDisabled ? (
            <h3 className="text-base font-bold text-[#163330] line-clamp-1 dark:text-foreground title-meal" title={meal.title}>
              {meal.title}
            </h3>
          ) : (
            <Link href={`/meals/${meal._id}`} className="block !no-underline" title={meal.title}>
              <h3 className="text-base font-bold text-[#163330] line-clamp-1 transition-colors hover:text-[#007F78] dark:text-foreground dark:hover:text-accent">
                {meal.title}
              </h3>
            </Link>
          )}
        </div>
        
        <p className="mb-4 text-xs leading-relaxed text-[#55706B] line-clamp-2 min-h-[2rem] dark:text-muted">
          {meal.shortDescription || 'Nutritious and balanced meal prepared with healthy ingredients.'}
        </p>

        {/* Stats / Macros row - neatly aligned */}
        <div className="mt-auto pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1 font-bold text-[#F59E0B] bg-[#FFFBEB] px-2 py-1 rounded-md border border-[#F59E0B]/20 dark:bg-[#F59E0B]/10">
            <FireIcon className="size-3.5 shrink-0" />
            <span>{meal.calories} kcal</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#55706B] bg-[#F7FAF8] px-2 py-1 rounded-md border border-[#DCE9E4] dark:bg-surface-secondary dark:border-border dark:text-muted">
            <span title="Protein">
              <strong className="text-[#65B82E] font-bold">P</strong> {meal.macros?.protein ?? 0}g
            </span>
            <span className="text-[#DCE9E4] dark:text-border">•</span>
            <span title="Carbs">
              <strong className="text-[#F59E0B] font-bold">C</strong> {meal.macros?.carbs ?? 0}g
            </span>
            <span className="text-[#DCE9E4] dark:text-border">•</span>
            <span title="Fat">
              <strong className="text-[#EF4444] font-bold">F</strong> {meal.macros?.fat ?? 0}g
            </span>
          </div>
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="border-t border-[#DCE9E4] p-4 pt-3 dark:border-border mt-auto">
        {linkDisabled ? (
          <div className="flex w-full items-center justify-center rounded-xl bg-[#F7FAF8] py-2 text-xs font-semibold text-[#55706B] dark:bg-surface-secondary dark:text-muted">
            {meal.lockedVisibility ? 'Private · Locked' : 'Private'}
          </div>
        ) : (
          <Link
            href={`/meals/${meal._id}`}
            className="!no-underline flex w-full items-center justify-center rounded-xl border border-[#DCE9E4] bg-white py-2.5 text-xs font-semibold text-[#163330] shadow-2xs transition-all hover:bg-[#007F78] hover:border-[#007F78] hover:text-white dark:border-border dark:bg-[#1f2b27] dark:text-foreground dark:hover:bg-accent dark:hover:border-accent"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
}