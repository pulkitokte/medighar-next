import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import {
  getAllRecords,
  subscribeToRecords,
  searchRecords,
  filterRecordsByType,
  sortRecords,
  groupRecordsByYear,
  deleteRecord,
} from "@/services/records/records.service.js";

const EMPTY_SNAPSHOT = "[]";
const RECENT_LIMIT = 5;

/**
 * Loads every medical record, with local (non-URL-synced) search, type
 * filter, and sort state, plus a "recent" slice and a year-grouped view.
 * @returns {{
 *   filteredRecords: Array<object>,
 *   recentRecords: Array<object>,
 *   groupedByYear: Record<string, Array<object>>,
 *   sortedYears: Array<string>,
 *   totalCount: number,
 *   searchQuery: string,
 *   setSearchQuery: Function,
 *   typeFilter: string,
 *   setTypeFilter: Function,
 *   sortBy: string,
 *   setSortBy: Function,
 *   remove: (id: string) => void,
 * }}
 */
export function useMedicalRecords() {
  const snapshot = useSyncExternalStore(
    subscribeToRecords,
    () => JSON.stringify(getAllRecords()),
    () => EMPTY_SNAPSHOT,
  );

  const allRecords = useMemo(() => JSON.parse(snapshot), [snapshot]);

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const filteredRecords = useMemo(() => {
    const searched = searchRecords(allRecords, searchQuery);
    const filtered = filterRecordsByType(searched, typeFilter);
    return sortRecords(filtered, sortBy);
  }, [allRecords, searchQuery, typeFilter, sortBy]);

  const recentRecords = useMemo(
    () => sortRecords(allRecords, "newest").slice(0, RECENT_LIMIT),
    [allRecords],
  );

  const groupedByYear = useMemo(
    () => groupRecordsByYear(filteredRecords),
    [filteredRecords],
  );

  const sortedYears = useMemo(
    () => Object.keys(groupedByYear).sort((a, b) => Number(b) - Number(a)),
    [groupedByYear],
  );

  const remove = useCallback((id) => deleteRecord(id), []);

  return {
    filteredRecords,
    recentRecords,
    groupedByYear,
    sortedYears,
    totalCount: allRecords.length,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    sortBy,
    setSortBy,
    remove,
  };
}
