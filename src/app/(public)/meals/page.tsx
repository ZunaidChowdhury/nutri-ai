import { Suspense } from 'react';
import { ExploreContent } from '@/components/meals/ExploreContent';

export default function MealsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading meals...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
