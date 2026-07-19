import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import { Skeleton } from '@heroui/skeleton';

export function SkeletonMealCard() {
  return (
    <Card className="w-full border border-default-200 dark:border-default-100">
      <CardHeader className="p-0 overflow-hidden">
        <Skeleton className="w-full h-48 rounded-none" />
      </CardHeader>
      <CardBody className="gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-5 w-3/5 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-full shrink-0" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full rounded-md" />
          <Skeleton className="h-3 w-4/5 rounded-md" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-16 rounded-md" />
          <Skeleton className="h-3 w-12 rounded-md" />
          <Skeleton className="h-3 w-24 rounded-md" />
        </div>
      </CardBody>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-8 w-full rounded-lg" />
      </CardFooter>
    </Card>
  );
}
