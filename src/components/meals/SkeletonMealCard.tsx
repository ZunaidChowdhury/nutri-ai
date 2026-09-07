import { Skeleton } from '@heroui/react';

export function SkeletonMealCard() {
  return (
    <div className="flex flex-col w-full rounded-[1.25rem] border border-[#DCE9E4] bg-white overflow-hidden shadow-sm dark:bg-[#1a1a1a] dark:border-border">
      <div className="h-48 w-full bg-[#F7FAF8] dark:bg-surface-secondary">
        <Skeleton className="w-full h-full rounded-none before:!duration-1000" />
      </div>
      
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <Skeleton className="h-6 w-3/5 rounded-md before:!duration-1000" />
          <Skeleton className="h-6 w-16 rounded-full shrink-0 before:!duration-1000" />
        </div>
        
        <div className="mb-5 space-y-2">
          <Skeleton className="h-4 w-full rounded-md before:!duration-1000" />
          <Skeleton className="h-4 w-4/5 rounded-md before:!duration-1000" />
        </div>
        
        <div className="mt-auto flex gap-3">
          <Skeleton className="h-6 w-20 rounded-md before:!duration-1000" />
          <Skeleton className="h-6 w-32 rounded-md before:!duration-1000" />
        </div>
      </div>
      
      <div className="border-t border-[#DCE9E4] p-4 dark:border-border">
        <Skeleton className="h-[42px] w-full rounded-lg before:!duration-1000" />
      </div>
    </div>
  );
}