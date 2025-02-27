'use client'

import { useState } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Transaction } from '../types/transaction'
import { formatCurrency } from '@/lib/utils/currency'
import { formatDate } from '@/lib/utils/date'
import { TransactionDialog } from './transaction-dialog'
import { TransactionDeleteDialog } from './transaction-delete-dialog'
import { useTransactions } from '../hooks/use-transactions'
import { cn } from '@/lib/utils'

interface TransactionTableProps {
  transactions: Transaction[]
  isLoading?: boolean
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const { removeTransaction } = useTransactions()

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => formatDate(row.getValue("date")),
    },
    {
      accessorKey: "category",
      header: "Category",
      size: 150,
      cell: ({ row }) => {
        const category = row.original.category;
        return category?.name || "-";
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = row.getValue("amount") as number;
        const type = row.getValue("type") as string;

        return (
          <div className="text-right">
            <span
              className={type === "EXPENSE" ? "text-red-500" : "text-green-500"}
            >
              {type === "EXPENSE" ? "-" : "+"}
              {formatCurrency(amount)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      size: 200,
    },
    {
      accessorKey: "type",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Type
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <span
          className={
            row.getValue("type") === "EXPENSE"
              ? "text-red-500"
              : "text-green-500"
          }
        >
          {row.getValue("type")}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const transaction = row.original;

        return (
          <div className="flex items-center justify-end gap-2">
            <TransactionDialog
              transaction={transaction}
              trigger={
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
              }
            />
            <TransactionDeleteDialog
              onConfirm={() => removeTransaction(transaction.id)}
            />
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    defaultColumn: {
      size: 100,
    }
  })

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table style={{ tableLayout: "fixed" }}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: `${cell.column.getSize()}px`,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => table.previousPage()}
                className={cn(
                  !table.getCanPreviousPage() &&
                    "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>
            {(() => {
              const currentPage = table.getState().pagination.pageIndex;
              const totalPages = table.getPageCount();
              const delta = 1; // Number of pages to show before and after current page

              const pages = [];

              // Always show first page
              pages.push(0);

              // Calculate range around current page
              let rangeStart = Math.max(1, currentPage - delta);
              let rangeEnd = Math.min(totalPages - 2, currentPage + delta);

              // Adjust range to show more pages when at the edges
              if (currentPage <= delta) {
                rangeEnd = Math.min(totalPages - 2, 2 * delta);
              }
              if (currentPage >= totalPages - delta - 1) {
                rangeStart = Math.max(1, totalPages - 2 * delta - 1);
              }

              // Add ellipsis and range
              if (rangeStart > 1) {
                pages.push(-1); // represents ellipsis
              }
              for (let i = rangeStart; i <= rangeEnd; i++) {
                pages.push(i);
              }
              if (rangeEnd < totalPages - 2) {
                pages.push(-1); // represents ellipsis
              }

              // Always show last page if there is more than one page
              if (totalPages > 1) {
                pages.push(totalPages - 1);
              }

              return pages.map((pageIndex, i) => (
                <PaginationItem key={i}>
                  {pageIndex === -1 ? (
                    <span className="px-4 text-sm text-muted-foreground">
                      ...
                    </span>
                  ) : (
                    <PaginationLink
                      onClick={() => table.setPageIndex(pageIndex)}
                      isActive={currentPage === pageIndex}
                    >
                      {pageIndex + 1}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ));
            })()}
            <PaginationItem>
              <PaginationNext
                onClick={() => table.nextPage()}
                className={cn(
                  !table.getCanNextPage() && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
