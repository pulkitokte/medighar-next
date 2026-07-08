import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getDoctors } from "@/services/doctors/doctors.service.js";

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
 * Loads and derives the doctor listing state for the Doctors page.
 * All filter, search, sort, and pagination state is persisted to the URL
 * so refreshing or sharing a link preserves the current view.
 * UI components never touch the repository or service directly.
 * @returns {{
 *   doctors: Array<object>,
 *   paginatedDoctors: Array<object>,
 *   loading: boolean,
 *   error: unknown,
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
  const rawPage = parseInt(searchParams.get("page") || "1", 10);
  const currentPage = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  const [loading] = useState(false);
  const [error] = useState(null);

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

  const doctors = useMemo(
    () => getDoctors({ searchQuery, filters, sortBy }),
    [searchQuery, filters, sortBy],
  );

  const totalPages = Math.max(1, Math.ceil(doctors.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedDoctors = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return doctors.slice(start, start + PAGE_SIZE);
  }, [doctors, safeCurrentPage]);

  return {
    doctors,
    paginatedDoctors,
    loading,
    error,
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
