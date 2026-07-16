import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@/hooks/useQuery.js";
import { getDiseases } from "@/services/diseases/diseases.service.js";
import { parsePageParam, withUpdatedParams } from "@/shared/lib/queryParams.js";

const DEFAULT_FILTERS = {
  category: "All",
  severity: "All",
  contagiousOnly: false,
};

const PAGE_SIZE = 6;

function readFilters(searchParams) {
  return {
    category: searchParams.get("category") || DEFAULT_FILTERS.category,
    severity: searchParams.get("severity") || DEFAULT_FILTERS.severity,
    contagiousOnly: searchParams.get("contagious") === "true",
  };
}

/**
 * Loads and derives the disease listing state for the Diseases page.
 * All filter, search, sort, and pagination state is persisted to the URL
 * so refreshing or sharing a link preserves the current view.
 * @returns {{
 *   diseases: Array<object>,
 *   paginatedDiseases: Array<object>,
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
export function useDiseases() {
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
          category: nextFilters.category,
          severity: nextFilters.severity,
          contagious: nextFilters.contagiousOnly,
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
    data: diseases,
    loading,
    error,
    refetch,
  } = useQuery(
    () => getDiseases({ searchQuery, filters, sortBy }),
    [searchQuery, JSON.stringify(filters), sortBy],
  );

  const resolvedDiseases = useMemo(() => diseases ?? [], [diseases]);

  const totalPages = Math.max(
    1,
    Math.ceil(resolvedDiseases.length / PAGE_SIZE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedDiseases = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return resolvedDiseases.slice(start, start + PAGE_SIZE);
  }, [resolvedDiseases, safeCurrentPage]);

  return {
    diseases: resolvedDiseases,
    paginatedDiseases,
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
