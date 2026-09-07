'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Chip, Table, Modal, Dropdown, Avatar, TextField, Input, useOverlayState } from '@heroui/react';
import { useSession } from '@/lib/auth/client';
import { getAdminUsers } from '@/lib/api/admin';
import { updateUserRole, deleteUser } from '@/lib/actions/admin';
import { getAuthToken } from '@/lib/core/server';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorFallback } from '@/components/feedback/ErrorFallback';
import { Spinner } from '@/components/feedback/Spinner';
import { ResultsPagination } from '@/components/ui/ResultsPagination';
import { FiUser, FiShield } from 'react-icons/fi';
import type { User } from '@/lib/types/user';

function RoleSelector({
  user,
  disabled,
  onSelect,
}: {
  user: User;
  disabled: boolean;
  onSelect: (role: 'user' | 'admin') => void;
}) {
  return (
    <Dropdown>
      <Dropdown.Trigger isDisabled={disabled}>
        <Chip
          size="sm"
          variant="soft"
          color={user.role === 'admin' ? 'success' : 'accent'}
        >
          {user.role === 'admin' ? (
            <FiShield className="mr-1 inline" />
          ) : (
            <FiUser className="mr-1 inline" />
          )}
          {user.role}
        </Chip>
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <Dropdown.Menu aria-label="Change role">
          <Dropdown.Item id="user" textValue="User" onAction={() => onSelect('user')}>User</Dropdown.Item>
          <Dropdown.Item id="admin" textValue="Admin" onAction={() => onSelect('admin')}>Admin</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

function UserAvatar({ name, src, size }: { name: string; src?: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <Avatar size={size}>
      {src && <Avatar.Image src={src} />}
      <Avatar.Fallback>{initials}</Avatar.Fallback>
    </Avatar>
  );
}

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [actionError, setActionError] = useState('');

  const sessionUser = session?.user as { id: string } | undefined;
  const ownId = sessionUser?.id;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'users', { page, search }],
    queryFn: async () => {
      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');
      return getAdminUsers(
        {
          page,
          limit: 12,
          search: search || undefined,
        },
        token
      );
    },
  });

  const [searchInput, setSearchInput] = useState('');

  const users = data?.data ?? [];
  const hasActiveSearch = !!search;

  const applySearch = (value: string) => {
    setSearchInput(value);
    setSearch(value.trim());
    setPage(1);
  };

  const roleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'user' | 'admin' }) => {
      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');
      await updateUserRole(userId, role, token);
    },
    onSuccess: () => {
      setActionError('');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (err: Error) => setActionError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');
      await deleteUser(userId, token);
    },
    onSuccess: () => {
      setActionError('');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      setDeleteTarget(null);
    },
    onError: (err: Error) => setActionError(err.message),
  });

  const deleteModalState = useOverlayState({
    isOpen: !!deleteTarget,
    onOpenChange: () => setDeleteTarget(null),
  });

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

  if (isLoading) return <Spinner label="Loading users" />;
  if (isError) return <ErrorFallback error={error as Error} />;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold">All Users</h1>
        <p className="text-muted">
          {data?.total ?? 0} user{data?.total !== 1 ? 's' : ''} registered
        </p>
      </div>

      <TextField className="w-full sm:max-w-md" fullWidth>
        <Input
          type="search"
          placeholder="Search by name or email..."
          aria-label="Search users"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') applySearch(searchInput);
          }}
        />
      </TextField>

      {actionError && (
        <div className="rounded-lg bg-danger/10 px-4 py-2 text-sm text-danger dark:bg-danger/10 dark:text-danger">
          {actionError}
        </div>
      )}

      {users.length === 0 ? (
        <EmptyState
          title={hasActiveSearch ? 'Nothing matched' : 'No users yet'}
          description={
            hasActiveSearch
              ? 'No users match your search.'
              : 'No users have registered yet.'
          }
        />
      ) : (
        <>
      <div className="hidden md:block">
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="All users admin table" className="min-w-[600px]">
              <Table.Header>
                <Table.Column isRowHeader>USER</Table.Column>
                <Table.Column>EMAIL</Table.Column>
                <Table.Column>ROLE</Table.Column>
                <Table.Column>JOINED</Table.Column>
                <Table.Column>ACTIONS</Table.Column>
              </Table.Header>
              <Table.Body>
                {users.map((user) => {
                  const isSelf = user._id === ownId;
                  return (
                    <Table.Row key={user._id}>
                      <Table.Cell>
                        <div className="flex items-center gap-2">
                          <UserAvatar name={user.name} src={user.image} size="sm" />
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>{user.email}</Table.Cell>
                      <Table.Cell>
                        <RoleSelector
                          user={user}
                          disabled={isSelf}
                          onSelect={(role) =>
                            roleMutation.mutate({ userId: user._id, role })
                          }
                        />
                      </Table.Cell>
                      <Table.Cell className="text-muted">
                        {formatDate(user.createdAt)}
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          size="sm"
                          variant="danger-soft"
                          isDisabled={isSelf || deleteMutation.isPending}
                          onPress={() => setDeleteTarget(user)}
                        >
                          Delete
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>

      <div className="md:hidden grid grid-cols-1 gap-4">
        {users.map((user) => {
          const isSelf = user._id === ownId;
          return (
            <div key={user._id} className="rounded-xl border border-border p-4 dark:border-default">
              <div className="flex items-center gap-3">
                <UserAvatar name={user.name} src={user.image} />
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold">{user.name}</span>
                  <span className="text-xs text-muted truncate">{user.email}</span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <RoleSelector
                  user={user}
                  disabled={isSelf}
                  onSelect={(role) => roleMutation.mutate({ userId: user._id, role })}
                />
                <Button
                  size="sm"
                  variant="danger-soft"
                  isDisabled={isSelf || deleteMutation.isPending}
                  onPress={() => setDeleteTarget(user)}
                >
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>
        </>
      )}

      {data && data.total > 0 && (
        <ResultsPagination
          page={page}
          totalPages={data.totalPages}
          totalItems={data.total}
          pageSize={12}
          noun={data.total !== 1 ? 'users' : 'user'}
          onPageChange={setPage}
        />
      )}

      <Modal state={deleteModalState}>
        <Modal.Backdrop />
        <Modal.Container size="md">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Delete User</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p>
                Are you sure you want to delete{' '}
                <strong>{deleteTarget?.name}</strong> ({deleteTarget?.email})? This
                will permanently remove the account, their meals, meal plans, and
                nutrition reports.
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
