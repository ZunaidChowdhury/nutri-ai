import { Spinner as HeroSpinner } from '@heroui/react';

interface SpinnerProps {
  label?: string;
}

export function Spinner({ label = 'Loading' }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <HeroSpinner className="text-accent" size="md" />
      {label && <span className="ml-2 text-sm text-muted">{label}</span>}
    </div>
  );
}
