'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@heroui/button';
import { Avatar } from '@heroui/avatar';
import { Chip } from '@heroui/chip';
import { Pagination } from '@heroui/pagination';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/dropdown';
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
import { getAdminUsers } from '@/lib/api/admin';
import { updateUserRole, deleteUser } from '@/lib/actions/admin';
import { getAuthToken } from '@/lib/core/server';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorFallback } from '@/components/feedback/ErrorFallback';
import { Spinner } from '@/components/feedback/Spinner';
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
      <DropdownTrigger>
        <Button size="sm" variant="flat" isDisabled={disabled}>
          <Chip
            size="sm"
            variant="flat"
            color={user.role === 'admin' ? 'success' : 'primary'}
            classNames={{ content: 'font-medium' }}
          >
            {user.role === 'admin' ? (
              <FiShield className="mr-1 inline" />
            ) : (
              <FiUser className="mr-1 inline" />
            )}
            {user.role}
          </Chip>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Change role"
        onAction={(key) => {
          if (key === 'user' || key === 'admin') onSelect(key);
        }}
      >
        <DropdownItem key="user">User</DropdownItem>
        <DropdownItem key="admin">Admin</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [actionError, setActionError] = useState('');

  const sessionUser = session?.user as { id: string } | undefined;
  const ownId = sessionUser?.id;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'users', { page }],
    queryFn: async () => {
      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');
      return getAdminUsers({ page, limit: 50 }, token);
    },
  });

  const totalPages = data?.totalPages ?? 1;
  const users = data?.data ?? [];

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

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

  if (isLoading) return <Spinner label="Loading users" />;
  if (isError) return <ErrorFallback error={error as Error} />;

  if (users.length === 0) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">All Users</h1>
        <EmptyState title="No users yet" description="No users have registered yet." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold">All Users</h1>
        <p className="text-default-500">
          {data?.total ?? 0} user{data?.total !== 1 ? 's' : ''} registered
        </p>
      </div>

      {actionError && (
        <div className="rounded-lg bg-danger-50 px-4 py-2 text-sm text-danger-600 dark:bg-danger-500/10 dark:text-danger-400">
          {actionError}
        </div>
      )}

      <div className="hidden md:block">
        <Table aria-label="All users admin table">
          <TableHeader>
            <TableColumn>USER</TableColumn>
            <TableColumn>EMAIL</TableColumn>
            <TableColumn>ROLE</TableColumn>
            <TableColumn>JOINED</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No users found.">
            {users.map((user) => {
              const isSelf = user._id === ownId;
              return (
                <TableRow key={user._id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar size="sm" name={user.name} src={user.image || ''} />
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <RoleSelector
                      user={user}
                      disabled={isSelf}
                      onSelect={(role) =>
                        roleMutation.mutate({ userId: user._id, role })
                      }
                    />
                  </TableCell>
                  <TableCell className="text-default-500">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="flat"
                      color="danger"
                      isDisabled={isSelf || deleteMutation.isPending}
                      onPress={() => setDeleteTarget(user)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden grid grid-cols-1 gap-4">
        {users.map((user) => {
          const isSelf = user._id === ownId;
          return (
            <div key={user._id} className="rounded-xl border border-default-200 p-4 dark:border-default-100">
              <div className="flex items-center gap-3">
                <Avatar name={user.name} src={user.image || ''} />
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold">{user.name}</span>
                  <span className="text-xs text-default-500 truncate">{user.email}</span>
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
                  variant="flat"
                  color="danger"
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
          <ModalHeader>Delete User</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete{' '}
              <strong>{deleteTarget?.name}</strong> ({deleteTarget?.email})? This
              will permanently remove the account, their meals, meal plans, and
              nutrition reports.
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