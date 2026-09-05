'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Image } from '@heroui/image';
import { Pagination } from '@heroui/pagination';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/modal';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@heroui/table';
import { getAdminMeals } from '@/lib/api/admin';
import { deleteMeal } from '@/lib/actions/meal';
import { getAuthToken } from '@/lib/core/server';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorFallback } from '@/components/feedback/ErrorFallback';
import { Spinner } from '@/components/feedback/Spinner';
import type { Meal } from '@/lib/types/meal';

export default function AdminMealsPage() {
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<Meal | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'meals', { page }],
    queryFn: async () => {
      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');
      return getAdminMeals({ page, limit: 50 }, token);
    },
  });

  const totalPages = data?.totalPages ?? 1;
  const meals = data?.data ?? [];

  const deleteMutation = useMutation({
    mutationFn: async (mealId: string) => {
      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');
      await deleteMeal(mealId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'meals'] });
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      setDeleteTarget(null);
    },
  });

  if (isLoading) return <Spinner label="Loading all meals" />;
  if (isError) return <ErrorFallback error={error as Error} />;

  if (meals.length === 0) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">All Meals</h1>
        <EmptyState
          title="No meals yet"
          description="No meals have been added to the platform yet."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold">All Meals</h1>
        <p className="text-default-500">
          {data?.total ?? 0} meal{data?.total !== 1 ? 's' : ''} on the platform
        </p>
      </div>

      <div className="hidden md:block">
        <Table aria-label="All meals admin table">
          <TableHeader>
            <TableColumn>IMAGE</TableColumn>
            <TableColumn>TITLE</TableColumn>
            <TableColumn>OWNER</TableColumn>
            <TableColumn>CUISINE</TableColumn>
            <TableColumn>CALORIES</TableColumn>
            <TableColumn>RATING</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No meals found.">
            {meals.map((meal) => (
              <TableRow key={meal._id}>
                <TableCell>
                  <Image
                    src={meal.imageUrl || '/placeholder-meal.svg'}
                    alt={meal.title}
                    className="w-12 h-12 object-cover rounded"
                    radius="sm"
                    fallbackSrc="/placeholder-meal.svg"
                  />
                </TableCell>
                <TableCell className="font-medium">{meal.title}</TableCell>
                <TableCell>
                  {meal.owner ? (
                    <div className="flex flex-col">
                      <span className="font-medium">{meal.owner.name}</span>
                      <span className="text-xs text-default-500">{meal.owner.email}</span>
                    </div>
                  ) : (
                    <span className="text-default-400">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Chip size="sm" variant="flat">
                    {meal.cuisineTag}
                  </Chip>
                </TableCell>
                <TableCell>{meal.calories}</TableCell>
                <TableCell>{meal.rating.toFixed(1)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Link href={`/meals/${meal._id}`}>
                      <Button size="sm" variant="flat">
                        View
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="flat"
                      color="danger"
                      onPress={() => setDeleteTarget(meal)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {meals.map((meal) => (
          <div key={meal._id}>
            <Link
              href={`/meals/${meal._id}`}
              className="flex flex-col gap-2 rounded-xl border border-default-200 p-3 dark:border-default-100"
            >
              <Image
                src={meal.imageUrl || '/placeholder-meal.svg'}
                alt={meal.title}
                className="w-full h-36 object-cover rounded-lg"
                radius="sm"
                fallbackSrc="/placeholder-meal.svg"
              />
              <span className="font-semibold">{meal.title}</span>
              <span className="text-xs text-default-500">
                {meal.owner?.name || 'Unknown owner'} · {meal.cuisineTag} ·{' '}
                {meal.calories} cal
              </span>
            </Link>
            <Button
              size="sm"
              variant="flat"
              color="danger"
              className="mt-2 w-full"
              onPress={() => setDeleteTarget(meal)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-2">
          <Pagination
            total={totalPages}
            page={page}
            onChange={setPage}
            color="primary"
            showControls
          />
        </div>
      )}

      <Modal
        isOpen={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        placement="center"
      >
        <ModalContent>
          <ModalHeader>Delete Meal</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete{' '}
              <strong>{deleteTarget?.title}</strong>? This action cannot be
              undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              color="danger"
              isLoading={deleteMutation.isPending}
              onPress={() => {
                if (deleteTarget) deleteMutation.mutate(deleteTarget._id);
              }}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}