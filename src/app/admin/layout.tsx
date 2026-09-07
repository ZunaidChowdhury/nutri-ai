'use client';

import { useSession } from '@/lib/auth/client';
import { Spinner } from '@/components/feedback/Spinner';
import Forbidden from '@/components/feedback/Forbidden';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const role = (session?.user as { role?: 'user' | 'admin' } | undefined)?.role;

  if (isPending) return <Spinner label="Checking permissions" />;
  if (!session?.user || role !== 'admin') return <Forbidden />;

  return <>{children}</>;
}