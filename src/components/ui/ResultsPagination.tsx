'use client';

import { Pagination } from '@heroui/react';

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | 'ellipsis')[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push('ellipsis');
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push('ellipsis');
  pages.push(total);

  return pages;
}

interface ResultsPaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  noun: string;
  onPageChange: (page: number) => void;
}

export function ResultsPagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  noun,
  onPageChange,
}: ResultsPaginationProps) {
  if (totalItems <= 0) return null;

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);
  const summary = `${startItem}-${endItem} of ${totalItems} ${noun}`;
  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="mt-4 flex w-full flex-col items-center justify-center gap-3">
      <Pagination>
        <Pagination.Summary className="text-sm text-muted">
          Showing {summary}
        </Pagination.Summary>
        <Pagination.Content>
          <Pagination.Item>
            <Pagination.Previous
              isDisabled={page <= 1}
              aria-label="Previous page"
              onPress={() => onPageChange(Math.max(1, page - 1))}
            >
              <Pagination.PreviousIcon />
            </Pagination.Previous>
          </Pagination.Item>

          {pageNumbers.map((p, idx) =>
            p === 'ellipsis' ? (
              <Pagination.Item key={`ellipsis-${idx}`}>
                <Pagination.Ellipsis />
              </Pagination.Item>
            ) : (
              <Pagination.Item key={p}>
                <Pagination.Link
                  isActive={p === page}
                  onPress={() => onPageChange(p)}
                  aria-label={`Page ${p}`}
                >
                  {p}
                </Pagination.Link>
              </Pagination.Item>
            )
          )}

          <Pagination.Item>
            <Pagination.Next
              isDisabled={page >= totalPages}
              aria-label="Next page"
              onPress={() => onPageChange(Math.min(totalPages, page + 1))}
            >
              <Pagination.NextIcon />
            </Pagination.Next>
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>
    </div>
  );
}