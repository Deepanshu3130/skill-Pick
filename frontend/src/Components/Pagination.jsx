import React from 'react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

/**
 * Reusable, responsive pagination component using DaisyUI & Tailwind.
 *
 * Props:
 * - currentPage: number (1-based index)
 * - totalItems: number
 * - pageSize: number
 * - onPageChange: (newPage: number) => void
 * - onPageSizeChange?: (newSize: number) => void
 * - pageSizeOptions?: number[] (default: [6, 12, 24])
 * - className?: string
 */
function Pagination({
  currentPage = 1,
  totalItems = 0,
  pageSize = 12,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [6, 12, 24],
  className = ''
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  if (totalItems <= 0) return null;

  const startItem = (safeCurrentPage - 1) * pageSize + 1;
  const endItem = Math.min(safeCurrentPage * pageSize, totalItems);

  // Helper to generate page numbers with ellipsis
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (safeCurrentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (safeCurrentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, '...', totalPages];
  };

  const pages = getPageNumbers();

  const handlePageClick = (page) => {
    if (page === '...' || page === safeCurrentPage) return;
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t border-base-300 ${className}`}>
      {/* Result Count Summary & Page Size Selector */}
      <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-base-content/70">
        <span>
          Showing <span className="font-semibold text-base-content">{startItem}</span> to{' '}
          <span className="font-semibold text-base-content">{endItem}</span> of{' '}
          <span className="font-semibold text-base-content">{totalItems}</span> results
        </span>

        {onPageSizeChange && pageSizeOptions && pageSizeOptions.length > 1 && (
          <div className="flex items-center gap-1.5 ml-2 pl-3 border-l border-base-300">
            <span className="text-xs">Show:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
              }}
              className="select select-bordered select-xs rounded-md text-xs font-medium focus:select-primary"
              aria-label="Items per page"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} / page
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Pagination Navigation Controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1" role="navigation" aria-label="Pagination Navigation">
          {/* First Page (desktop only) */}
          <button
            onClick={() => handlePageClick(1)}
            disabled={safeCurrentPage === 1}
            className="btn btn-sm btn-ghost btn-square hidden sm:inline-flex disabled:opacity-40"
            aria-label="First page"
            title="First page"
          >
            <FiChevronsLeft className="size-4" />
          </button>

          {/* Previous Page */}
          <button
            onClick={() => handlePageClick(safeCurrentPage - 1)}
            disabled={safeCurrentPage === 1}
            className="btn btn-sm btn-outline gap-1 px-2.5 rounded-lg disabled:opacity-40"
            aria-label="Previous page"
          >
            <FiChevronLeft className="size-4" />
            <span className="hidden sm:inline text-xs">Prev</span>
          </button>

          {/* Page numbers (Desktop) */}
          <div className="hidden sm:flex items-center gap-1">
            {pages.map((p, idx) => {
              if (p === '...') {
                return (
                  <span key={`ellipsis-${idx}`} className="px-2 text-base-content/40 text-xs select-none">
                    •••
                  </span>
                );
              }
              const isActive = p === safeCurrentPage;
              return (
                <button
                  key={`page-${p}`}
                  onClick={() => handlePageClick(p)}
                  className={`btn btn-sm btn-square rounded-lg text-xs font-semibold ${
                    isActive ? 'btn-primary' : 'btn-ghost'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`Page ${p}`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          {/* Mobile indicator (e.g. Page 2 of 10) */}
          <div className="sm:hidden px-3 py-1 bg-base-200 rounded-lg text-xs font-semibold text-base-content/80">
            {safeCurrentPage} / {totalPages}
          </div>

          {/* Next Page */}
          <button
            onClick={() => handlePageClick(safeCurrentPage + 1)}
            disabled={safeCurrentPage === totalPages}
            className="btn btn-sm btn-outline gap-1 px-2.5 rounded-lg disabled:opacity-40"
            aria-label="Next page"
          >
            <span className="hidden sm:inline text-xs">Next</span>
            <FiChevronRight className="size-4" />
          </button>

          {/* Last Page (desktop only) */}
          <button
            onClick={() => handlePageClick(totalPages)}
            disabled={safeCurrentPage === totalPages}
            className="btn btn-sm btn-ghost btn-square hidden sm:inline-flex disabled:opacity-40"
            aria-label="Last page"
            title="Last page"
          >
            <FiChevronsRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default Pagination;
