'use client';

import { Card, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import Unauthorized from './Unauthorized';
import Forbidden from './Forbidden';

interface ErrorFallbackProps {
  error?: Error;
  reset?: () => void;
}

function getStatus(error?: Error): number | undefined {
  if (!error) return undefined;
  const e = error as Error & { code?: string; status?: number };
  if (typeof e.status === 'number') return e.status;
  if (e.code === 'UNAUTHORIZED') return 401;
  if (e.code === 'FORBIDDEN') return 403;
  return undefined;
}

export function ErrorFallback({ error, reset }: ErrorFallbackProps) {
  const status = getStatus(error);

  if (status === 401) return <Unauthorized />;
  if (status === 403) return <Forbidden />;

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md border border-danger-200">
        <CardBody className="flex flex-col items-center gap-4 py-12 px-8">
          <div className="w-12 h-12 rounded-full bg-danger-100 dark:bg-danger-900/30 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-danger"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">Something went wrong</h3>
          <p className="text-sm text-default-500 text-center max-w-xs">
            {error?.message || 'An unexpected error occurred. Please try again.'}
          </p>
          {reset && (
            <Button color="primary" variant="flat" onPress={reset}>
              Try again
            </Button>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
