import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppointments } from "@/hooks/useAppointments.js";
import { useMedicalRecords } from "@/hooks/useMedicalRecords.js";
import { useFamilyProfiles } from "@/hooks/useFamilyProfiles.js";
import { useHealthTimeline } from "@/hooks/useHealthTimeline.js";
import { getDoctors } from "@/services/doctors/doctors.service.js";
import { getMedicines } from "@/services/medicines/medicines.service.js";
import { getDiseases } from "@/services/diseases/diseases.service.js";
import { getPharmacies } from "@/services/pharmacy/pharmacy.service.js";
import {
  buildSearchIndex,
  filterSearchResults,
  QUICK_ACTIONS,
} from "@/services/search/search.service.js";
import {
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
  subscribeToRecentSearches,
} from "@/services/search/search.repository.js";

const DEBOUNCE_MS = 200;

/**
 * Owns all state and behavior for the Global Command Palette: open/close,
 * query, debounced filtering, keyboard navigation, and recent searches.
 * Reuses existing services (for static entity lists) and existing hooks
 * (for dynamic per-user data) rather than fetching or duplicating any
 * data itself.
 * @returns {object}
 */
export function useGlobalSearch() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState(() =>
    getRecentSearches(),
  );

  // Static entity lists: fetched once via existing services, memoized for
  // the lifetime of the palette instance.
  const doctors = useMemo(() => getDoctors(), []);
  const medicines = useMemo(() => getMedicines(), []);
  const diseases = useMemo(() => getDiseases(), []);
  const pharmacies = useMemo(() => getPharmacies(), []);

  // Dynamic per-user data: reused directly from existing hooks.
  const { upcoming: upcomingAppointments, past: pastAppointments } =
    useAppointments();
  const { filteredRecords } = useMedicalRecords();
  const { members: familyMembers } = useFamilyProfiles();
  const { events: timelineEvents } = useHealthTimeline();

  const allAppointments = useMemo(
    () => [...upcomingAppointments, ...pastAppointments],
    [upcomingAppointments, pastAppointments],
  );

  // Debounce the raw query.
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(
    () =>
      subscribeToRecentSearches(() => setRecentSearches(getRecentSearches())),
    [],
  );

  const searchIndex = useMemo(
    () =>
      buildSearchIndex({
        doctors,
        medicines,
        diseases,
        pharmacies,
        appointments: allAppointments,
        records: filteredRecords,
        familyMembers,
        timelineEvents,
      }),
    [
      doctors,
      medicines,
      diseases,
      pharmacies,
      allAppointments,
      filteredRecords,
      familyMembers,
      timelineEvents,
    ],
  );

  const { groups, flat } = useMemo(
    () => filterSearchResults(searchIndex, debouncedQuery),
    [searchIndex, debouncedQuery],
  );

  const hasQuery = debouncedQuery.trim().length > 0;
  const visibleResults = hasQuery ? flat : QUICK_ACTIONS;

  // Reset active index whenever the visible result set changes.
  useEffect(() => {
    setActiveIndex(0);
  }, [visibleResults.length, isOpen]);

  const open = useCallback(() => setIsOpen(true), []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setDebouncedQuery("");
    setActiveIndex(0);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((previous) => {
      if (previous) {
        setQuery("");
        setDebouncedQuery("");
        setActiveIndex(0);
      }
      return !previous;
    });
  }, []);

  const selectResult = useCallback(
    (result) => {
      if (!result) return;

      if (query.trim()) {
        addRecentSearch(query.trim());
      }

      navigate(result.route);
      close();
    },
    [query, navigate, close],
  );

  const selectRecentSearch = useCallback((recentQuery) => {
    setQuery(recentQuery);
    setDebouncedQuery(recentQuery);
  }, []);

  const moveActiveIndex = useCallback(
    (direction) => {
      setActiveIndex((previous) => {
        const length = visibleResults.length;
        if (length === 0) return 0;

        const next = (previous + direction + length) % length;
        return next;
      });
    },
    [visibleResults.length],
  );

  const clearRecent = useCallback(() => clearRecentSearches(), []);

  // Global keyboard shortcuts: Cmd/Ctrl+K toggles from anywhere, "/" opens
  // when not typing inside an input/textarea/contenteditable element,
  // Escape closes while open.
  useEffect(() => {
    function handleKeyDown(event) {
      const isMetaCombo =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";

      if (isMetaCombo) {
        event.preventDefault();
        toggle();
        return;
      }

      if (isOpen) {
        if (event.key === "Escape") {
          close();
        }
        return;
      }

      const target = event.target;
      const isTyping =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        open();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, open, close, toggle]);

  return {
    isOpen,
    open,
    close,
    query,
    setQuery,
    hasQuery,
    groups,
    visibleResults,
    activeIndex,
    setActiveIndex,
    moveActiveIndex,
    selectResult,
    recentSearches,
    selectRecentSearch,
    clearRecent,
  };
}
