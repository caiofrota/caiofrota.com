"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

type SortValue = string | number | boolean | null | undefined;
type SortDirection = "asc" | "desc";

export type AdminDataColumn<T> = {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  sortValue?: (row: T) => SortValue;
  headerClassName?: string;
  cellClassName?: string;
};

type AdminDataTableProps<T> = {
  rows: T[];
  columns: AdminDataColumn<T>[];
  getRowId: (row: T) => string;
  renderMobileCard: (row: T) => ReactNode;
  emptyState: ReactNode;
  initialSort?: { columnId: string; direction: SortDirection };
  itemLabel?: string;
};

const PAGE_SIZES = [10, 20, 50, 100] as const;

export function AdminDataTable<T>({
  rows,
  columns,
  getRowId,
  renderMobileCard,
  emptyState,
  initialSort,
  itemLabel = "itens",
}: AdminDataTableProps<T>) {
  const sortableColumns = columns.filter((column) => column.sortValue);
  const [sort, setSort] = useState(initialSort ?? null);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);
  const [page, setPage] = useState(1);

  const sortedRows = useMemo(() => {
    if (!sort) return rows;
    const column = columns.find((item) => item.id === sort.columnId);
    if (!column?.sortValue) return rows;

    return [...rows].sort((left, right) => {
      const comparison = compareValues(column.sortValue?.(left), column.sortValue?.(right));
      return sort.direction === "asc" ? comparison : -comparison;
    });
  }, [columns, rows, sort]);

  const pageCount = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleRows = sortedRows.slice(startIndex, startIndex + pageSize);
  const firstVisible = sortedRows.length ? startIndex + 1 : 0;
  const lastVisible = Math.min(startIndex + pageSize, sortedRows.length);

  function toggleSort(columnId: string) {
    setSort((current) => ({
      columnId,
      direction: current?.columnId === columnId && current.direction === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  }

  if (!rows.length) return emptyState;

  return (
    <>
      <div className="flex items-center gap-3 border-b border-site-border bg-site-surface-strong px-5 py-3 md:hidden">
        <label className="flex min-w-0 flex-1 items-center gap-2 text-xs font-semibold text-site-muted">
          Ordenar por
          <select
            value={sort?.columnId ?? ""}
            onChange={(event) => {
              const columnId = event.target.value;
              if (columnId) {
                toggleSort(columnId);
              } else {
                setSort(null);
                setPage(1);
              }
            }}
            className="cf-ring min-w-0 flex-1 rounded-lg border border-site-border bg-site-surface px-2.5 py-2 text-xs text-site-heading"
          >
            <option value="">Ordem original</option>
            {sortableColumns.map((column) => (
              <option key={column.id} value={column.id}>
                {column.header}
              </option>
            ))}
          </select>
        </label>
        {sort ? (
          <button
            type="button"
            onClick={() => toggleSort(sort.columnId)}
            className="cf-ring grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg border border-site-border text-site-accent hover:bg-site-surface-hover"
            aria-label={sort.direction === "asc" ? "Ordenar de forma decrescente" : "Ordenar de forma crescente"}
            title={sort.direction === "asc" ? "Ordem crescente" : "Ordem decrescente"}
          >
            {sort.direction === "asc" ? (
              <ArrowUp className="size-4" aria-hidden="true" />
            ) : (
              <ArrowDown className="size-4" aria-hidden="true" />
            )}
          </button>
        ) : null}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-site-border bg-site-surface-strong">
              {columns.map((column) => {
                const isActive = sort?.columnId === column.id;
                const ariaSort = isActive ? (sort.direction === "asc" ? "ascending" : "descending") : "none";

                return (
                  <th
                    key={column.id}
                    scope="col"
                    aria-sort={column.sortValue ? ariaSort : undefined}
                    className={`px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-site-muted first:pl-6 last:pr-6 ${column.headerClassName ?? ""}`}
                  >
                    {column.sortValue ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(column.id)}
                        className="cf-ring -ml-1 inline-flex cursor-pointer items-center gap-1.5 rounded-md px-1 py-0.5 hover:text-site-heading"
                      >
                        {column.header}
                        {isActive ? (
                          sort.direction === "asc" ? (
                            <ArrowUp className="size-3.5 text-site-accent" aria-hidden="true" />
                          ) : (
                            <ArrowDown className="size-3.5 text-site-accent" aria-hidden="true" />
                          )
                        ) : (
                          <ArrowUpDown className="size-3.5 opacity-55" aria-hidden="true" />
                        )}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-site-border">
            {visibleRows.map((row) => (
              <tr key={getRowId(row)} className="transition hover:bg-site-surface-hover">
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={`px-5 py-4 align-middle text-sm text-site-heading first:pl-6 last:pr-6 ${column.cellClassName ?? ""}`}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-site-border md:hidden">
        {visibleRows.map((row) => (
          <article key={getRowId(row)} className="px-5 py-5">
            {renderMobileCard(row)}
          </article>
        ))}
      </div>

      <footer className="flex flex-col gap-3 border-t border-site-border bg-site-surface-strong px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-site-muted">
            Exibir
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
              className="cf-ring rounded-lg border border-site-border bg-site-surface px-2.5 py-1.5 text-xs text-site-heading"
              aria-label="Itens por página"
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
          <p className="text-xs text-site-muted">
            {firstVisible}–{lastVisible} de {sortedRows.length} {itemLabel}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <p className="text-xs font-medium text-site-muted">
            Página {currentPage} de {pageCount}
          </p>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={currentPage === 1}
              className="cf-ring grid size-8 cursor-pointer place-items-center rounded-lg border border-site-border text-site-accent transition hover:bg-site-surface-hover disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Página anterior"
              title="Página anterior"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
              disabled={currentPage === pageCount}
              className="cf-ring grid size-8 cursor-pointer place-items-center rounded-lg border border-site-border text-site-accent transition hover:bg-site-surface-hover disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Próxima página"
              title="Próxima página"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}

function compareValues(left: SortValue, right: SortValue) {
  if (left == null && right == null) return 0;
  if (left == null) return 1;
  if (right == null) return -1;
  if (typeof left === "number" && typeof right === "number") return left - right;
  if (typeof left === "boolean" && typeof right === "boolean") return Number(left) - Number(right);
  return String(left).localeCompare(String(right), "pt-BR", { numeric: true, sensitivity: "base" });
}
