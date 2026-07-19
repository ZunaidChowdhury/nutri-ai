import { Card, CardBody } from '@heroui/card';

interface EmptyStateProps {
  title: string;
  description: string;
  image?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, image, action }: EmptyStateProps) {
  return (
    <Card className="w-full max-w-md mx-auto border border-default-200 dark:border-default-100">
      <CardBody className="flex flex-col items-center gap-4 py-12 px-8">
        {image && (
          <img
            src={image}
            alt=""
            className="w-24 h-24 object-contain opacity-60"
          />
        )}
        <h3 className="text-lg font-semibold text-center">{title}</h3>
        <p className="text-sm text-default-500 text-center max-w-xs">
          {description}
        </p>
        {action}
      </CardBody>
    </Card>
  );
}
