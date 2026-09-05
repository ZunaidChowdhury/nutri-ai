'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Chip,
  Modal,
  Table,
  useOverlayState,
} from '@heroui/react';
import { useSession } from '@/lib/auth/client';
import { getAllMeals } from '@/lib/api/meal';
import { deleteMeal } from '@/lib/actions/meal';
import { getAuthToken } from '@/lib/core/server';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorFallback } from '@/components/feedback/ErrorFallback';
import { Spinner } from '@/components/feedback/Spinner';
import { MealCard } from '@/components/meals/MealCard';
import { MealListFilters } from '@/components/meals/MealListFilters';
import { ResultsPagination } from '@/components/ui/ResultsPagination';
import type { Meal } from '@/lib/types/meal';

export default function ManageMealsPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<Meal | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [cuisineTag, setCuisineTag] = useState('');

  const deleteModal = useOverlayState({
    isOpen: !!deleteTarget,
    onOpenChange: () => setDeleteTarget(null),
  });

  const userId = session?.user?.id;
  const user = session?.user as { id: string; role?: 'user' | 'admin' } | undefined;
  const userRole = user?.role;

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['meals', 'manage', { page, userId, search, cuisineTag }],
    queryFn: () =>
      getAllMeals({
        limit: 12,
        page,
        ownerId: userId,
        search: search || undefined,
        cuisineTag: cuisineTag || undefined,
      }),
    enabled: !!userId,
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
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      setDeleteTarget(null);
    },
  });

  const canDelete = (meal: Meal) =>
    userRole === 'admin' || meal.ownerId === userId;

  const hasActiveFilters = !!search || !!cuisineTag;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-bold">Manage Meals</h1>
          {!isPending && !isError && (
            <p className="text-muted">
              {data?.total ?? 0} meal{data?.total !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <Link href="/items/add">
          <Button variant="primary">
            Add Meal
          </Button>
        </Link>
      </div>

      <MealListFilters
        searchOnEnter
        search={search}
        cuisineTag={cuisineTag}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onCuisineTagChange={(value) => {
          setCuisineTag(value);
          setPage(1);
        }}
      />

      {isPending ? (
        <Spinner label="Loading meals" />
      ) : isError ? (
        <ErrorFallback error={error as Error} />
      ) : meals.length === 0 ? (
        hasActiveFilters ? (
          <EmptyState
            title="Nothing matched"
            description="No meals match your search or cuisine filter."
            action={
              <Button
                variant="secondary"
                onPress={() => {
                  setSearch('');
                  setCuisineTag('');
                  setPage(1);
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <EmptyState
            title="No meals yet"
            description="You haven't added any meals yet. Create your first meal!"
            action={
              <Link href="/items/add">
                <Button variant="primary">
                  Add Meal
                </Button>
              </Link>
            }
          />
        )
      ) : (
        <>
          <div className="hidden md:block">
            <Table className="rounded-xl border border-border">
              <Table.ScrollContainer>
                <Table.Content aria-label="Manage meals table" className="min-w-[600px]">
                  <Table.Header>
                    <Table.Column>IMAGE</Table.Column>
                    <Table.Column isRowHeader>TITLE</Table.Column>
                    <Table.Column>CUISINE</Table.Column>
                    <Table.Column>CALORIES</Table.Column>
                    <Table.Column>RATING</Table.Column>
                    <Table.Column>ACTIONS</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {meals.map((meal) => (
                      <Table.Row key={meal._id} id={meal._id}>
                        <Table.Cell>
                          <img
                            src={meal.imageUrl || '/placeholder-meal.svg'}
                            alt={meal.title}
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-meal.svg';
                            }}
                          />
                        </Table.Cell>
                        <Table.Cell className="font-medium">{meal.title}</Table.Cell>
                        <Table.Cell>
                          <Chip size="sm" variant="soft">
                            {meal.cuisineTag}
                          </Chip>
                        </Table.Cell>
                        <Table.Cell>{meal.calories}</Table.Cell>
                        <Table.Cell>{meal.rating.toFixed(1)}</Table.Cell>
                        <Table.Cell>
                          <div className="flex gap-2">
                            <Link href={`/meals/${meal._id}`}>
                              <Button size="sm" variant="secondary">
                                View
                              </Button>
                            </Link>
                            {canDelete(meal) && (
                              <Button
                                size="sm"
                                variant="danger-soft"
                                onPress={() => setDeleteTarget(meal)}
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </div>

          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {meals.map((meal) => (
              <div key={meal._id} className="relative">
                <MealCard meal={meal} />
                {canDelete(meal) && (
                  <Button
                    size="sm"
                    variant="danger-soft"
                    className="absolute top-2 right-2 z-10"
                    onPress={() => setDeleteTarget(meal)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            ))}
          </div>

          {data && data.total > 0 && (
            <ResultsPagination
              page={page}
              totalPages={totalPages}
              totalItems={data.total}
              pageSize={12}
              noun={data.total !== 1 ? 'meals' : 'meal'}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      <Modal state={deleteModal}>
        <Modal.Backdrop />
        <Modal.Container placement="center" size="md">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Delete Meal</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p>
                Are you sure you want to delete{' '}
                <strong>{deleteTarget?.title}</strong>? This action cannot be
                undone.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onPress={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                isPending={deleteMutation.isPending}
                onPress={() => {
                  if (deleteTarget) deleteMutation.mutate(deleteTarget._id);
                }}
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal>
    </div>
  );
}