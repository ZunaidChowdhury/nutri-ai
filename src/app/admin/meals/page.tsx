'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Chip, Table, Modal, Dropdown, useOverlayState } from '@heroui/react';
import { getAdminMeals } from '@/lib/api/admin';
import { deleteMeal } from '@/lib/actions/meal';
import { updateMealVisibility as adminUpdateMealVisibility } from '@/lib/actions/admin';
import { getAuthToken } from '@/lib/core/server';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorFallback } from '@/components/feedback/ErrorFallback';
import { Spinner } from '@/components/feedback/Spinner';
import { MealListFilters } from '@/components/meals/MealListFilters';
import { ResultsPagination } from '@/components/ui/ResultsPagination';
import type { Meal } from '@/lib/types/meal';

function MealVisibilityControl({ meal }: { meal: Meal }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      mealId,
      visibility,
      locked,
    }: {
      mealId: string;
      visibility: 'public' | 'private';
      locked: boolean;
    }) => {
      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');
      return adminUpdateMealVisibility(mealId, visibility, locked, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'meals'] });
    },
  });

  const selected = meal.lockedVisibility ? 'private-locked' : meal.visibility;

  return (
    <Dropdown>
      <Dropdown.Trigger isDisabled={mutation.isPending}>
        <Chip
          size="sm"
          className={
            meal.lockedVisibility
              ? 'bg-[#FEF3C7] dark:bg-[#F59E0B]/20 text-[#92400E] dark:text-[#FCD34D] cursor-pointer'
              : meal.visibility === 'public'
                ? 'bg-[#EAF7DE] dark:bg-[#65B82E]/20 text-[#166534] dark:text-[#86EFAC] cursor-pointer'
                : 'bg-[#EEF7F3] dark:bg-[#1b2b28] text-[#55706B] dark:text-[#A1B8B3] cursor-pointer'
          }
        >
          {selected === 'public'
            ? 'Public'
            : selected === 'private'
              ? 'Private'
              : 'Private · Locked'}
        </Chip>
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <Dropdown.Menu aria-label="Set meal visibility">
          <Dropdown.Item
            id="public"
            textValue="Public"
            onAction={() =>
              mutation.mutate({ mealId: meal._id, visibility: 'public', locked: false })
            }
          >
            Public
          </Dropdown.Item>
          <Dropdown.Item
            id="private"
            textValue="Private"
            onAction={() =>
              mutation.mutate({ mealId: meal._id, visibility: 'private', locked: false })
            }
          >
            Private
          </Dropdown.Item>
          <Dropdown.Item
            id="private-locked"
            textValue="Private (Locked)"
            onAction={() =>
              mutation.mutate({ mealId: meal._id, visibility: 'private', locked: true })
            }
          >
            Private (Locked)
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

export default function AdminMealsPage() {
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<Meal | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [cuisineTag, setCuisineTag] = useState('');

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['admin', 'meals', { page, search, cuisineTag }],
    queryFn: async () => {
      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');
      return getAdminMeals(
        {
          page,
          limit: 12,
          search: search || undefined,
          cuisineTag: cuisineTag || undefined,
        },
        token
      );
    },
  });

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

  const deleteModalState = useOverlayState({
    isOpen: !!deleteTarget,
    onOpenChange: () => setDeleteTarget(null),
  });

  const hasActiveFilters = !!search || !!cuisineTag;

  return (
    <div className="flex flex-col gap-6 px-4 md:px-8 py-6 md:py-8 max-w-[1280px] mx-auto w-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold text-[#163330] dark:text-[#E8F2EF]">All Meals</h1>
        {!isPending && !isError && (
          <p className="text-[#55706B] dark:text-[#A1B8B3]">
            {data?.total ?? 0} meal{data?.total !== 1 ? 's' : ''} on the platform
          </p>
        )}
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
        <Spinner label="Loading all meals" />
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
                className="bg-transparent border border-[#DCE9E4] dark:border-[#263835] text-[#55706B] dark:text-[#A1B8B3] hover:bg-[#EEF7F3] dark:hover:bg-[#1b2b28]"
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <EmptyState
            title="No meals yet"
            description="No meals have been added to the platform yet."
          />
        )
      ) : (
        <> 
      <div className="hidden md:block">
        <Table className="rounded-2xl border border-[#DCE9E4] dark:border-[#263835] dark:bg-[#161f1e]">
          <Table.ScrollContainer>
            <Table.Content aria-label="All meals admin table" className="min-w-[600px]">
              <Table.Header>
                <Table.Column><span className="text-[#849A95] dark:text-[#6E8883] text-xs font-semibold uppercase tracking-wide">IMAGE</span></Table.Column>
                <Table.Column isRowHeader><span className="text-[#849A95] dark:text-[#6E8883] text-xs font-semibold uppercase tracking-wide">TITLE</span></Table.Column>
                <Table.Column><span className="text-[#849A95] dark:text-[#6E8883] text-xs font-semibold uppercase tracking-wide">OWNER</span></Table.Column>
                <Table.Column><span className="text-[#849A95] dark:text-[#6E8883] text-xs font-semibold uppercase tracking-wide">CUISINE</span></Table.Column>
                <Table.Column><span className="text-[#849A95] dark:text-[#6E8883] text-xs font-semibold uppercase tracking-wide">CALORIES</span></Table.Column>
                <Table.Column><span className="text-[#849A95] dark:text-[#6E8883] text-xs font-semibold uppercase tracking-wide">RATING</span></Table.Column>
                <Table.Column><span className="text-[#849A95] dark:text-[#6E8883] text-xs font-semibold uppercase tracking-wide">VISIBILITY</span></Table.Column>
                <Table.Column><span className="text-[#849A95] dark:text-[#6E8883] text-xs font-semibold uppercase tracking-wide">ACTIONS</span></Table.Column>
              </Table.Header>
              <Table.Body>
                {meals.map((meal) => (
                  <Table.Row key={meal._id} id={meal._id} className="hover:bg-[#F7FAF8] dark:hover:bg-[#1b2b28] transition-colors">
                    <Table.Cell>
                      <img
                        src={meal.imageUrl || '/placeholder-meal.svg'}
                        alt={meal.title}
                        className="w-12 h-12 object-cover rounded-xl"
                      />
                    </Table.Cell>
                    <Table.Cell className="font-medium text-[#163330] dark:text-[#E8F2EF]">{meal.title}</Table.Cell>
                    <Table.Cell>
                      {meal.owner ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-[#163330] dark:text-[#E8F2EF]">{meal.owner.name}</span>
                          <span className="text-xs text-[#849A95] dark:text-[#6E8883]">{meal.owner.email}</span>
                        </div>
                      ) : (
                        <span className="text-[#849A95] dark:text-[#6E8883]">—</span>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <Chip size="sm" className="bg-[#EEF7F3] dark:bg-[#1b2b28] text-[#163330] dark:text-[#E8F2EF] border border-[#DCE9E4] dark:border-[#263835]">
                        {meal.cuisineTag}
                      </Chip>
                    </Table.Cell>
                    <Table.Cell className="text-[#163330] dark:text-[#E8F2EF]">{meal.calories}</Table.Cell>
                    <Table.Cell className="text-[#163330] dark:text-[#E8F2EF]">{meal.rating.toFixed(1)}</Table.Cell>
                    <Table.Cell>
                      <MealVisibilityControl meal={meal} />
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex gap-2">
                        <Link href={`/meals/${meal._id}`} className="!no-underline">
                          <Button size="sm" className="bg-transparent border border-[#DCE9E4] dark:border-[#263835] text-[#55706B] dark:text-[#A1B8B3] hover:bg-[#EEF7F3] dark:hover:bg-[#1b2b28]">
                            View
                          </Button>
                        </Link>
                        <Link href={`/items/edit/${meal._id}`} className="!no-underline">
                          <Button size="sm" className="bg-transparent border border-[#DCE9E4] dark:border-[#263835] text-[#55706B] dark:text-[#A1B8B3] hover:bg-[#EEF7F3] dark:hover:bg-[#1b2b28]">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          onPress={() => setDeleteTarget(meal)}
                          className="bg-transparent border border-red-200 dark:border-red-500/30 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                        >
                          Delete
                        </Button>
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
          <div key={meal._id}>
            <Link
              href={`/meals/${meal._id}`}
              className="flex flex-col gap-2 rounded-xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] p-3 !no-underline"
            >
              <img
                src={meal.imageUrl || '/placeholder-meal.svg'}
                alt={meal.title}
                className="w-full h-36 object-cover rounded-lg"
              />
              <span className="font-semibold text-[#163330] dark:text-[#E8F2EF]">{meal.title}</span>
              <span className="text-xs text-[#55706B] dark:text-[#A1B8B3]">
                {meal.owner?.name || 'Unknown owner'} · {meal.cuisineTag} ·{' '}
                {meal.calories} cal
              </span>
            </Link>
            <Button
              size="sm"
              className="mt-2 w-full bg-transparent border border-red-200 dark:border-red-500/30 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
              onPress={() => setDeleteTarget(meal)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>

      {data && data.total > 0 && (
        <ResultsPagination
          page={page}
          totalPages={data.totalPages}
          totalItems={data.total}
          pageSize={12}
          noun={data.total !== 1 ? 'meals' : 'meal'}
          onPageChange={setPage}
        />
      )}
        </>
      )}

      <Modal state={deleteModalState}>
        <Modal.Backdrop>
          <Modal.Container placement="center" size="md">
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Heading>Delete Meal</Modal.Heading>
              </Modal.Header>
              <Modal.Body className="text-[#55706B] dark:text-[#A1B8B3]">
                <p>
                  Are you sure you want to delete{' '}
                  <strong className="text-[#163330] dark:text-[#E8F2EF] font-semibold">{deleteTarget?.title}</strong>? This action cannot be
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
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
