'use client';

import { HeroUIProvider } from '@heroui/react';
import { QueryProvider } from './QueryProvider';
import { ReduxProvider } from './ReduxProvider';
import { ThemeProvider } from './CustomThemeProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ReduxProvider>
        <QueryProvider>
          <HeroUIProvider>{children}</HeroUIProvider>
        </QueryProvider>
      </ReduxProvider>
    </ThemeProvider>
  );
}
