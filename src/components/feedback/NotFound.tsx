'use client';

import { Card, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import Link from 'next/link';

export function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md border border-default-200 dark:border-default-100">
        <CardBody className="flex flex-col items-center gap-4 py-12 px-8">
          <div className="w-12 h-12 rounded-full bg-warning-100 dark:bg-warning-900/30 flex items-center justify-center">
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
              className="text-warning"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">Page not found</h3>
          <p className="text-sm text-default-500 text-center max-w-xs">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link href="/">
            <Button
              color="primary"
              variant="flat"
            >
              Go home
            </Button>
          </Link>
        </CardBody>
      </Card>
    </div>
  );
}
