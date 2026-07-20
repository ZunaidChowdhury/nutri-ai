'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Image } from '@heroui/image';
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
import { useSession } from '@/lib/auth/client';
import { getAllMeals } from '@/lib/api/meal';
import { deleteMeal } from '@/lib/actions/meal';
import { getAuthToken } from '@/lib/core/server';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Spinner } from '@/components/feedback/Spinner';
import { MealCard } from '@/components/meals/MealCard';
import type { Meal } from '@/lib/types/meal';

export default function ManageMealsPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<Meal | null>(null);

  const userId = session?.user?.id;
  const user = session?.user as { id: string; role?: 'user' | 'admin' } | undefined;
  const userRole = user?.role;

  const { data, isLoading } = useQuery({
    queryKey: ['meals', 'manage'],
    queryFn: () => getAllMeals({ limit: 100 }),
    enabled: !!userId,
  });

  const meals = useMemo(() => {
    if (!data?.data) return [];
    if (userRole === 'admin') return data.data;
    return data.data.filter((m) => m.ownerId === userId);
  }, [data, userId, userRole]);

  const deleteMutation = useMutation({
    mutationFn: async (mealId: string) => {
      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');
      await deleteMeal(mealId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      setDeleteTarget(null);
    },
  });

  const canDelete = (meal: Meal) =>
    userRole === 'admin' || meal.ownerId === userId;

  if (isLoading) return <Spinner label="Loading meals" />;

  if (meals.length === 0) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Manage Meals</h1>
        <EmptyState
          title="No meals yet"
          description={
            userRole === 'admin'
              ? 'No meals have been added to the platform yet.'
              : "You haven't added any meals yet. Create your first meal!"
          }
          action={
            <Link href="/items/add">
              <Button color="primary" variant="flat">
                Add Meal
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-bold">Manage Meals</h1>
          <p className="text-default-500">
            {meals.length} meal{meals.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/items/add">
          <Button color="primary" variant="flat">
            Add Meal
          </Button>
        </Link>
      </div>

      <div className="hidden md:block">
        <Table aria-label="Manage meals table">
          <TableHeader>
            <TableColumn>IMAGE</TableColumn>
            <TableColumn>TITLE</TableColumn>
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
                  <Chip size="sm" variant="flat">
                    {meal.cuisineTag}
                  </Chip>
                </TableCell>
                <TableCell>{meal.calories}</TableCell>
                <TableCell>{meal.rating.toFixed(1)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Link href={`/meals/${meal._id}`}>
                      <Button
                        size="sm"
                        variant="flat"
                      >
                        View
                      </Button>
                    </Link>
                    {canDelete(meal) && (
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        onPress={() => setDeleteTarget(meal)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {meals.map((meal) => (
          <div key={meal._id} className="relative">
            <MealCard meal={meal} />
            {canDelete(meal) && (
              <Button
                size="sm"
                variant="flat"
                color="danger"
                className="absolute top-2 right-2 z-10"
                onPress={() => setDeleteTarget(meal)}
              >
                Delete
              </Button>
            )}
          </div>
        ))}
      </div>

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
