import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@/hooks/useQuery.js";
import { getDoctors } from "@/services/doctors/doctors.service.js";
import { parsePageParam, withUpdatedParams } from "@/shared/lib/queryParams.js";
import { SPECIALTIES } from "@/data/doctors/specialties.js";
import { DOCTORS } from "@/data/doctors/doctors.js";

const DEFAULT_FILTERS = {
  specialty: "All",
  experience: "All",
  location: "All",
  gender: "All",
  verifiedOnly: false,
};

const PAGE_SIZE = 6;

/**
 * Returns the plain value of each option, whether the option list holds
 * primitives or { value, label } objects (the two shapes FilterSelect
 * accepts).
 */
function optionValues(options) {
  return options.map((option) =>
    option && typeof option === "object" && "value" in option
      ? option.value
      : option,
  );
}

// Specialty and location come from the same sources DoctorFilters renders.
const VALID_SPECIALTIES = new Set(["All", ...optionValues(SPECIALTIES)]);
const VALID_LOCATIONS = new Set([
  "All",
  ...DOCTORS.map((doctor) => doctor.city),
]);
// Mirrors DoctorFilters' EXPERIENCE_OPTIONS / GENDER_OPTIONS and the
// experience buckets in doctors.service.js.
const VALID_EXPERIENCE = new Set(["All", "0-5 yrs", "5-10 yrs", "10+ yrs"]);
const VALID_GENDERS = new Set(["All", "Male", "Female"]);
const VALID_SORTS = new Set([
  "newest",
  "highest-rated",
  "most-experienced",
  "lowest-fee",
]);

/**
 * Returns the URL value only when it is a known option; otherwise the
 * default, so a stale or hand-edited link can't leave a control on a value
 * that matches no option (or silently bypass a filter).
 */
function pickKnown(value, validValues, fallback) {
  return value && validValues.has(value) ? value : fallback;
}

function readFilters(searchParams) {
  return {
    specialty: pickKnown(
      searchParams.get("specialty"),
      VALID_SPECIALTIES,
      DEFAULT_FILTERS.specialty,
    ),
    experience: pickKnown(
      searchParams.get("experience"),
      VALID_EXPERIENCE,
      DEFAULT_FILTERS.experience,
    ),
    location: pickKnown(
      searchParams.get("location"),
      VALID_LOCATIONS,
      DEFAULT_FILTERS.location,
    ),
    gender: pickKnown(
      searchParams.get("gender"),
      VALID_GENDERS,
      DEFAULT_FILTERS.gender,
    ),
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
  const sortBy = pickKnown(searchParams.get("sort"), VALID_SORTS, "newest");
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