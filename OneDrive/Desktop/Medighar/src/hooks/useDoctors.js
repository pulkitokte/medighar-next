import { useMemo, useState } from "react";
import { getDoctors } from "@/services/doctors/doctors.service.js";

const DEFAULT_FILTERS = {
  specialty: "All",
  experience: "All",
  location: "All",
  gender: "All",
  verifiedOnly: false,
};

/**
 * Loads and derives the doctor listing state for the Doctors page.
 * UI components never touch the repository or service directly.
 * @returns {{
 *   doctors: Array<object>,
 *   loading: boolean,
 *   error: unknown,
 *   filters: object,
 *   setFilters: Function,
 *   sortBy: string,
 *   setSortBy: Function,
 *   searchQuery: string,
 *   setSearchQuery: Function,
 * }}
 */
export function useDoctors() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  const [loading] = useState(false);
  const [error] = useState(null);

  const doctors = useMemo(
    () => getDoctors({ searchQuery, filters, sortBy }),
    [searchQuery, filters, sortBy],
  );

  return {
    doctors,
    loading,
    error,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
  };
}
