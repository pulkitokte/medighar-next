import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@/hooks/useQuery.js";
import { getPharmacies } from "@/services/pharmacy/pharmacy.service.js";
import { parsePageParam, withUpdatedParams } from "@/shared/lib/queryParams.js";

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

/**
 * Loads and derives the pharmacy listing state for the Pharmacies page.
 * All filter, search, sort, and pagination state is persisted to the URL
 * so refreshing or sharing a link preserves the current view.
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
  const currentPage = parsePageParam(searchParams);

  const updateParams = useCallback(
    (updates, options) => {
      setSearchParams((previous) =>
        withUpdatedParams(previous, updates, options),
      );
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
