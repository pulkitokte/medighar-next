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
import { getMemberById } from "@/services/family/family.service.js";

const EMPTY_SNAPSHOT = "[]";
const RECENT_LIMIT = 5;

export function useMedicalRecords() {
  const snapshot = useSyncExternalStore(
    subscribeToRecords,
    () => JSON.stringify(getAllRecords()),
    () => EMPTY_SNAPSHOT,
  );

  const allRecords = useMemo(() => {
    const records = JSON.parse(snapshot);
    return records.map((record) => {
      const memberId = record.memberId ?? "me";
      return { ...record, memberId, member: getMemberById(memberId) };
    });
  }, [snapshot]);

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
