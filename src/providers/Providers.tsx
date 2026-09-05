'use client';

import { QueryProvider } from './QueryProvider';
import { ReduxProvider } from './ReduxProvider';
import { ThemeProvider } from './CustomThemeProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ReduxProvider>
        <QueryProvider>{children}</QueryProvider>
      </ReduxProvider>
    </ThemeProvider>
  );
}