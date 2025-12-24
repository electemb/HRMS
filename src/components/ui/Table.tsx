import React, { useState, useMemo } from "react";
import { Input } from "./Input";
import "./Table.css";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  searchable?: boolean;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  keyExtractor: (item: T) => string | number;
  onRowClick?: (item: T) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  paginated?: boolean;
  pageSize?: number;
}

type SortDirection = "asc" | "desc" | null;

export function Table<T>({
  columns,
  data,
  loading = false,
  emptyMessage = "No data available",
  keyExtractor,
  onRowClick,
  searchable = false,
  searchPlaceholder = "Search...",
  paginated = false,
  pageSize = 10,
}: TableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchable || !searchQuery) return data;

    const query = searchQuery.toLowerCase();
    return data.filter((item) => {
      return columns.some((column) => {
        if (column.searchable === false) return false;
        const value = (item as Record<string, unknown>)[column.key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, searchable, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = (a as Record<string, unknown>)[sortKey];
      const bValue = (b as Record<string, unknown>)[sortKey];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!paginated) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, paginated, currentPage, pageSize]);

  const totalPages = paginated ? Math.ceil(sortedData.length / pageSize) : 1;

  const handleSort = (columnKey: string, sortable?: boolean) => {
    if (sortable === false) return;

    if (sortKey === columnKey) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortKey(null);
        setSortDirection(null);
      }
    } else {
      setSortKey(columnKey);
      setSortDirection("asc");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="table-container">
        <div className="table-loading">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      {searchable && (
        <div className="table-search">
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            leftIcon="🔍"
          />
          {searchQuery && (
            <span className="table-search-results">
              {filteredData.length}{" "}
              {filteredData.length === 1 ? "result" : "results"}
            </span>
          )}
        </div>
      )}

      {paginatedData.length === 0 ? (
        <div className="table-empty">
          <span className="table-empty-icon">📋</span>
          <p className="table-empty-text">
            {searchQuery
              ? `No results found for "${searchQuery}"`
              : emptyMessage}
          </p>
        </div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="table">
              <thead className="table-header">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`table-header-cell table-header-cell--${
                        column.align || "left"
                      } ${
                        column.sortable !== false
                          ? "table-header-cell--sortable"
                          : ""
                      } ${
                        sortKey === column.key
                          ? "table-header-cell--sorted"
                          : ""
                      }`}
                      onClick={() => handleSort(column.key, column.sortable)}
                    >
                      <div className="table-header-content">
                        <span>{column.header}</span>
                        {column.sortable !== false && (
                          <span className="table-sort-icon">
                            {sortKey === column.key
                              ? sortDirection === "asc"
                                ? "↑"
                                : "↓"
                              : "↕"}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="table-body">
                {paginatedData.map((item) => {
                  const key = keyExtractor(item);
                  return (
                    <tr
                      key={key}
                      className={`table-row ${
                        onRowClick ? "table-row--clickable" : ""
                      }`}
                      onClick={() => onRowClick?.(item)}
                    >
                      {columns.map((column) => (
                        <td
                          key={`${key}-${column.key}`}
                          className={`table-cell table-cell--${
                            column.align || "left"
                          }`}
                        >
                          {column.render
                            ? column.render(item)
                            : String(
                                (item as Record<string, unknown>)[column.key] ??
                                  "-"
                              )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {paginated && totalPages > 1 && (
            <div className="table-pagination">
              <div className="table-pagination-info">
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
                {sortedData.length}{" "}
                {sortedData.length === 1 ? "entry" : "entries"}
              </div>
              <div className="table-pagination-controls">
                <button
                  className="table-pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <div className="table-pagination-pages">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      // Show first page, last page, current page, and pages around current
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            className={`table-pagination-page ${
                              page === currentPage
                                ? "table-pagination-page--active"
                                : ""
                            }`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span
                            key={page}
                            className="table-pagination-ellipsis"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    }
                  )}
                </div>
                <button
                  className="table-pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
