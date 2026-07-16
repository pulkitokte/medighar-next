import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@/hooks/useQuery.js";
import { getDoctors } from "@/services/doctors/doctors.service.js";
import { parsePageParam, withUpdatedParams } from "@/shared/lib/queryParams.js";

const DEFAULT_FILTERS = {
  specialty: "All",
  experience: "All",
  location: "All",
  gender: "All",
  verifiedOnly: false,
};

const PAGE_SIZE = 6;

function readFilters(searchParams) {
  return {
    specialty: searchParams.get("specialty") || DEFAULT_FILTERS.specialty,
    experience: searchParams.get("experience") || DEFAULT_FILTERS.experience,
    location: searchParams.get("location") || DEFAULT_FILTERS.location,
    gender: searchParams.get("gender") || DEFAULT_FILTERS.gender,
    verifiedOnly: searchParams.get("verified") === "true",
  };
}

/**
 * Loads and derives the doctor listing state for the Doctors page.
 * All filter, search, sort, and pagination state is persisted to the URL
 * so refreshing or sharing a link preserves the current view.
 * @returns {{
 *   doctors: Array<object>,
 *   paginatedDoctors: Array<object>,
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
export function useDoctors() {
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
          specialty: nextFilters.specialty,
          experience: nextFilters.experience,
          location: nextFilters.location,
          gender: nextFilters.gender,
          verified: nextFilters.verifiedOnly,
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
    data: doctors,
    loading,
    error,
    refetch,
  } = useQuery(
    () => getDoctors({ searchQuery, filters, sortBy }),
    [searchQuery, JSON.stringify(filters), sortBy],
  );

  const resolvedDoctors = useMemo(() => doctors ?? [], [doctors]);

  const totalPages = Math.max(1, Math.ceil(resolvedDoctors.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedDoctors = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return resolvedDoctors.slice(start, start + PAGE_SIZE);
  }, [resolvedDoctors, safeCurrentPage]);

  return {
    doctors: resolvedDoctors,
    paginatedDoctors,
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
