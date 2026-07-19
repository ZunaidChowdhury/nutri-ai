import { Spinner as HeroSpinner } from '@heroui/spinner';

interface SpinnerProps {
  label?: string;
}

export function Spinner({ label = 'Loading' }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <HeroSpinner
        label={label}
        color="primary"
        labelColor="primary"
      />
    </div>
  );
}
