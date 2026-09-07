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
    <div className="group relative flex flex-col w-full rounded-[1.25rem] border border-[#DCE9E4] bg-white overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#007F78]/30 dark:bg-[#1a1a1a] dark:border-border dark:hover:border-accent/40">
      
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden bg-[#F7FAF8] dark:bg-surface-secondary">
        {onToggleSelect && (
          <button
            type="button"
            aria-label={selected ? 'Remove from selected meals' : 'Add to selected meals'}
            title={selected ? 'Remove from selected meals' : 'Add to selected meals'}
            onClick={() => onToggleSelect()}
            className={`absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-md transition-all cursor-pointer ${
              selected
                ? 'bg-[#22C55E] text-white border border-[#22C55E]'
                : 'bg-white/95 text-[#163330] hover:text-[#007F78] border border-[#DCE9E4] hover:border-[#007F78]/50 dark:bg-[#1a1a1a]/95 dark:text-foreground dark:border-border dark:hover:border-accent/50 dark:hover:text-accent'
            }`}
          >
            {selected ? <CheckIcon className="size-5" /> : <PlusIcon className="size-5" />}
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
        <div className="absolute top-3 left-3 flex items-center justify-center rounded-full bg-[#DDF5F0]/95 px-2.5 py-1 text-xs font-semibold capitalize text-[#007F78] shadow-sm backdrop-blur-md dark:bg-accent/80 dark:text-white">
          {meal.cuisineTag}
        </div>

        {/* Rating badge floating on image */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-[#163330] shadow-sm backdrop-blur-md dark:bg-black/80 dark:text-foreground">
          <StarIcon className="size-3.5 text-[#FACC15]" />
          <span>{meal.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          {linkDisabled ? (
             <h3 className="text-lg font-bold text-[#163330] line-clamp-1 dark:text-foreground">{meal.title}</h3>
          ) : (
             <Link href={`/meals/${meal._id}`} className="flex-1 !no-underline">
               <h3 className="text-lg font-bold text-[#163330] line-clamp-1 transition-colors group-hover:text-[#007F78] dark:text-foreground dark:group-hover:text-accent">{meal.title}</h3>
             </Link>
          )}
        </div>
        
        <p className="mb-5 text-sm text-[#55706B] line-clamp-2 dark:text-muted">
          {meal.shortDescription}
        </p>

        {/* Stats / Macros row */}
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
          <div className="flex items-center gap-1 font-bold text-[#F59E0B] bg-[#FFFBEB] px-2 py-1 rounded-md dark:bg-[#F59E0B]/10">
            <FireIcon className="size-3.5" />
            <span>{meal.calories} kcal</span>
          </div>
          <div className="flex items-center gap-2 text-[#55706B] font-medium dark:text-muted bg-[#F7FAF8] px-2 py-1 rounded-md dark:bg-surface-secondary">
             <span className="flex items-center gap-1"><span className="text-[#65B82E] font-bold">P</span>{meal.macros.protein}g</span>
             <span className="text-[#DCE9E4] dark:text-border">•</span>
             <span className="flex items-center gap-1"><span className="text-[#F59E0B] font-bold">C</span>{meal.macros.carbs}g</span>
             <span className="text-[#DCE9E4] dark:text-border">•</span>
             <span className="flex items-center gap-1"><span className="text-[#EF4444] font-bold">F</span>{meal.macros.fat}g</span>
          </div>
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="border-t border-[#DCE9E4] p-4 dark:border-border">
        {linkDisabled ? (
           <div className="flex w-full items-center justify-center rounded-lg bg-[#F7FAF8] py-2.5 text-sm font-semibold text-[#55706B] dark:bg-surface-secondary dark:text-muted">
             {meal.lockedVisibility ? 'Private · Locked' : 'Private'}
           </div>
        ) : (
           <Link
             href={`/meals/${meal._id}`}
             className="!no-underline flex w-full items-center justify-center rounded-lg bg-white border-2 border-[#DCE9E4] py-2 text-sm font-semibold text-[#163330] transition-all group-hover:bg-[#007F78] group-hover:border-[#007F78] group-hover:text-white dark:bg-transparent dark:border-border dark:text-foreground dark:group-hover:bg-accent dark:group-hover:border-accent"
           >
             View Details
           </Link>
        )}
      </div>
    </div>
  );
}