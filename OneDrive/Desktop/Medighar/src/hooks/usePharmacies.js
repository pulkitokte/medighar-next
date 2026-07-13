import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@/hooks/useQuery.js";
import { getPharmacies } from "@/services/pharmacy/pharmacy.service.js";

const DEFAULT_FILTERS = {
  type: "All",
  city: "All",
  homeDeliveryOnly: false,
};

const PAGE_SIZE = 6;

function readFilters(searchParams) {
  return {
    type: searchParams.get("type") || DEFAULT_FILTERS.type,
    city: searchParams.get("city") || DEFAULT_FILTERS.city,
    homeDeliveryOnly: searchParams.get("delivery") === "true",
  };
}

function isDefaultValue(value) {
  return (
    value === undefined ||
    value === null ||
    value === "" ||
    value === "All" ||
    value === false
  );
}

/**
 * Loads and derives the pharmacy listing state for the Pharmacies page.
 * All filter, search, sort, and pagination state is persisted to the URL
 * so refreshing or sharing a link preserves the current view.
 * Data loading goes through useQuery(), which will require no changes when
 * the underlying service starts reading from a real backend.
 * UI components never touch the repository or service directly.
 * @returns {{
 *   pharmacies: Array<object>,
 *   paginatedPharmacies: Array<object>,
 *   loading: boolean,
 *   error: unknown,
 *   refetch: Function,
 *   filters: object,
 *   setFilters: Function,
 *   sortBy: string,
 *   setSortBy: Function,
 *   searchQuery: string,
 *   setSearchQuery: Function,
 *   currentPage: number,
 *   setCurrentPage: Function,
 *   totalPages: number,
 * }}
 */
export function usePharmacies() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";
  const filters = useMemo(() => readFilters(searchParams), [searchParams]);
  const sortBy = searchParams.get("sort") || "newest";
  const rawPage = parseInt(searchParams.get("page") || "1", 10);
  const currentPage = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  const updateParams = useCallback(
    (updates, { resetPage = false } = {}) => {
      setSearchParams((previous) => {
        const next = new URLSearchParams(previous);

        Object.entries(updates).forEach(([key, value]) => {
          if (isDefaultValue(value)) {
            next.delete(key);
          } else {
            next.set(key, String(value));
          }
        });

        if (resetPage) {
          next.delete("page");
        }

        return next;
      });
    },
    [setSearchParams],
  );

  const setSearchQuery = useCallback(
    (value) => updateParams({ search: value }, { resetPage: true }),
    [updateParams],
  );

  const setFilters = useCallback(
    (nextFilters) => {
      updateParams(
        {
          type: nextFilters.type,
          city: nextFilters.city,
          delivery: nextFilters.homeDeliveryOnly,
        },
        { resetPage: true },
      );
    },
    [updateParams],
  );

  const setSortBy = useCallback(
    (value) => updateParams({ sort: value }, { resetPage: true }),
    [updateParams],
  );

  const setCurrentPage = useCallback(
    (page) => updateParams({ page: page > 1 ? page : undefined }),
    [updateParams],
  );

  const {
    data: pharmacies,
    loading,
    error,
    refetch,
  } = useQuery(
    () => getPharmacies({ searchQuery, filters, sortBy }),
    [searchQuery, JSON.stringify(filters), sortBy],
  );

  const resolvedPharmacies = useMemo(() => pharmacies ?? [], [pharmacies]);

  const totalPages = Math.max(
    1,
    Math.ceil(resolvedPharmacies.length / PAGE_SIZE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedPharmacies = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return resolvedPharmacies.slice(start, start + PAGE_SIZE);
  }, [resolvedPharmacies, safeCurrentPage]);

  return {
    pharmacies: resolvedPharmacies,
    paginatedPharmacies,
    loading,
    error,
    refetch,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    currentPage: safeCurrentPage,
    setCurrentPage,
    totalPages,
  };
}
