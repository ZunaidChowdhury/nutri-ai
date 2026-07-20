export const dynamic = 'force-dynamic';

import { DashboardContent } from '@/components/dashboard/DashboardContent';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-5xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-default-500">Track your nutrition and meal history at a glance.</p>
      </div>
      <DashboardContent />
    </div>
  );
}
