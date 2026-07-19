'use client';

import { HeroUIProvider } from '@heroui/react';
import { QueryProvider } from './QueryProvider';
import { ReduxProvider } from './ReduxProvider';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ReduxProvider>
        <QueryProvider>
          <HeroUIProvider>{children}</HeroUIProvider>
        </QueryProvider>
      </ReduxProvider>
    </ThemeProvider>
  );
}
