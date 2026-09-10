export const dynamic = 'force-dynamic';

import { DashboardContent } from '@/components/dashboard/DashboardContent';

export default function DashboardPage() {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="flex flex-col gap-6 px-4 md:px-8 py-6 md:py-8 max-w-[1280px] mx-auto w-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold text-[#163330] dark:text-[#E8F2EF]">
          {greeting} 👋
        </h1>
        <p className="text-[#55706B] dark:text-[#A1B8B3]">
          Track your nutrition and meal history at a glance.
        </p>
      </div>
      <DashboardContent />
    </div>
  );
}
