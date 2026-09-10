export const dynamic = 'force-dynamic';

import { DashboardContent } from '@/components/dashboard/DashboardContent';

export default function DashboardPage() {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="flex flex-col gap-6 px-4 md:px-8 py-6 md:py-8 max-w-[1280px] mx-auto w-full">
      <DashboardContent greeting={greeting} />
    </div>
  );
}
