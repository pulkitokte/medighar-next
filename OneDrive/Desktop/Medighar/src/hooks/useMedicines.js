import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@/hooks/useQuery.js";
import { getMedicines } from "@/services/medicines/medicines.service.js";
import { parsePageParam, withUpdatedParams } from "@/shared/lib/queryParams.js";

const DEFAULT_FILTERS = {
  category: "All",
  dosageForm: "All",
  prescriptionOnly: false,
};

const PAGE_SIZE = 6;

function readFilters(searchParams) {
  return {
    category: searchParams.get("category") || DEFAULT_FILTERS.category,
    dosageForm: searchParams.get("dosage") || DEFAULT_FILTERS.dosageForm,
    prescriptionOnly: searchParams.get("prescription") === "true",
  };
}

/**
 * Loads and derives the medicine listing state for the Medicines page.
 * All filter, search, sort, and pagination state is persisted to the URL
 * so refreshing or sharing a link preserves the current view.
 * @returns {{
 *   medicines: Array<object>,
 *   paginatedMedicines: Array<object>,
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
export function useMedicines() {
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
          dosage: nextFilters.dosageForm,
          prescription: nextFilters.prescriptionOnly,
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
    data: medicines,
    loading,
    error,
    refetch,
  } = useQuery(
    () => getMedicines({ searchQuery, filters, sortBy }),
    [searchQuery, JSON.stringify(filters), sortBy],
  );

  const resolvedMedicines = useMemo(() => medicines ?? [], [medicines]);

  const totalPages = Math.max(
    1,
    Math.ceil(resolvedMedicines.length / PAGE_SIZE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedMedicines = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return resolvedMedicines.slice(start, start + PAGE_SIZE);
  }, [resolvedMedicines, safeCurrentPage]);

  return {
    medicines: resolvedMedicines,
    paginatedMedicines,
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
