import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAppointments } from "@/hooks/useAppointments.js";
import { useMedicalRecords } from "@/hooks/useMedicalRecords.js";
import { useFamilyProfiles } from "@/hooks/useFamilyProfiles.js";
import { useHealthTimeline } from "@/hooks/useHealthTimeline.js";
import { useSavedItems } from "@/hooks/useSavedItems.js";
import { getDoctors } from "@/services/doctors/doctors.service.js";
import { getMedicines } from "@/services/medicines/medicines.service.js";
import { getDiseases } from "@/services/diseases/diseases.service.js";
import { getPharmacies } from "@/services/pharmacy/pharmacy.service.js";
import {
  getAllRecentEntries,
  subscribeToRecent,
} from "@/services/recent/recent.service.js";
import { resolveRecentEntries } from "@/services/dashboard/dashboard.service.js";
import {
  buildSearchIndex,
  filterSearchResults,
  buildBoostedIds,
  buildSuggestedResults,
  QUICK_ACTIONS,
  BROWSE_SUGGESTIONS,
} from "@/services/search/search.service.js";
import {
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
  subscribeToRecentSearches,
} from "@/services/search/search.repository.js";

const DEBOUNCE_MS = 200;
const EMPTY_SNAPSHOT = "[]";
const SUGGESTION_RECENT_RESOLVE_LIMIT = 8;

/**
 * Window event name used by any page-level "Search across Medighar"
 * entry point (see SearchHint.jsx) to request that the single, globally
 * mounted Command Palette instance open itself. Kept colocated with the
 * hook that owns the palette's actual state, mirroring the same
 * window-CustomEvent pattern already used by preferences/discovery
 * repositories elsewhere in the app.
 */
const GLOBAL_SEARCH_OPEN_EVENT = "global-search:open-request";

/**
 * Dispatches a request for the globally mounted Command Palette to open.
 * Safe to call from anywhere (e.g. a page-level "Search everything"
 * button) without needing its own useGlobalSearch() instance, which
 * would otherwise duplicate data-fetching and have no visible effect.
 */
export function requestGlobalSearchOpen() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(GLOBAL_SEARCH_OPEN_EVENT));
}

/**
 * Owns all state and behavior for the Global Command Palette: open/close,
 * query, debounced filtering, ranking context, keyboard navigation,
 * recent searches, empty-state suggestions, and focus recovery. Reuses
 * existing services (for static entity lists) and existing hooks (for
 * dynamic per-user data) rather than fetching or duplicating any data
 * itself.
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

  // Tracks whatever element had focus just before the palette opened
  // (the Ctrl+K/"/" shortcut leaves body focused; a SearchHint button
  // click leaves that button focused), so close() can restore it rather
  // than always dropping focus back to body.
  const previousFocusRef = useRef(null);

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
  const saved = useSavedItems();

  const allAppointments = useMemo(
    () => [...upcomingAppointments, ...pastAppointments],
    [upcomingAppointments, pastAppointments],
  );

  // Recently viewed entities: reused via the existing recent.service.js
  // store and the existing resolveRecentEntries resolver already used by
  // useDashboard.js, rather than re-implementing entity resolution here.
  const recentSnapshot = useSyncExternalStore(
    subscribeToRecent,
    () => JSON.stringify(getAllRecentEntries()),
    () => EMPTY_SNAPSHOT,
  );
  const recentEntriesRaw = useMemo(
    () => JSON.parse(recentSnapshot),
    [recentSnapshot],
  );
  const recentEntries = useMemo(
    () =>
      resolveRecentEntries(recentEntriesRaw, SUGGESTION_RECENT_RESOLVE_LIMIT),
    [recentEntriesRaw],
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

  const boostedIds = useMemo(
    () =>
      buildBoostedIds({
        recentEntries,
        savedDoctors: saved.savedDoctors,
        savedMedicines: saved.savedMedicines,
        savedDiseases: saved.savedDiseases,
        savedPharmacies: saved.savedPharmacies,
      }),
    [
      recentEntries,
      saved.savedDoctors,
      saved.savedMedicines,
      saved.savedDiseases,
      saved.savedPharmacies,
    ],
  );

  const { groups, flat } = useMemo(
    () => filterSearchResults(searchIndex, debouncedQuery, boostedIds),
    [searchIndex, debouncedQuery, boostedIds],
  );

  const suggestionGroups = useMemo(() => {
    const groupsObj = { "Quick Actions": QUICK_ACTIONS };

    buildSuggestedResults({
      recentEntries,
      savedDoctors: saved.savedDoctors,
      savedMedicines: saved.savedMedicines,
    }).forEach((item) => {
      if (!groupsObj[item.category]) groupsObj[item.category] = [];
      groupsObj[item.category].push(item);
    });

    return groupsObj;
  }, [recentEntries, saved.savedDoctors, saved.savedMedicines]);

  const suggestionsFlat = useMemo(
    () => Object.values(suggestionGroups).flat(),
    [suggestionGroups],
  );

  const hasQuery = debouncedQuery.trim().length > 0;
  const showEmptyResults = hasQuery && flat.length === 0;
  const visibleResults = hasQuery
    ? showEmptyResults
      ? BROWSE_SUGGESTIONS
      : flat
    : suggestionsFlat;

  // Reset active index whenever the visible result set changes.
  useEffect(() => {
    setActiveIndex(0);
  }, [visibleResults.length, isOpen]);

  /**
   * Restores focus to whatever was focused before the palette opened, if
   * that element is still attached to the DOM (it may not be, e.g. after
   * a navigation unmounted the page that held it).
   */
  const restorePreviousFocus = useCallback(() => {
    const target = previousFocusRef.current;
    if (target instanceof HTMLElement && document.contains(target)) {
      target.focus();
    }
    previousFocusRef.current = null;
  }, []);

  const open = useCallback(() => {
    previousFocusRef.current = document.activeElement;
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setDebouncedQuery("");
    setActiveIndex(0);
    restorePreviousFocus();
  }, [restorePreviousFocus]);

  const toggle = useCallback(() => {
    setIsOpen((previous) => {
      if (previous) {
        setQuery("");
        setDebouncedQuery("");
        setActiveIndex(0);
        restorePreviousFocus();
        return false;
      }
      previousFocusRef.current = document.activeElement;
      return true;
    });
  }, [restorePreviousFocus]);

  const selectResult = useCallback(
    (result) => {
      if (!result) return;

      if (query.trim()) {
        addRecentSearch(query.trim());
      }

      close();
      navigate(result.route);
    },
    [query, close, navigate],
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

  const setActiveIndexToStart = useCallback(() => setActiveIndex(0), []);

  const setActiveIndexToEnd = useCallback(() => {
    setActiveIndex(Math.max(visibleResults.length - 1, 0));
  }, [visibleResults.length]);

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

  // Page-level entry points (SearchHint.jsx) request an open via a
  // window event rather than holding their own hook instance.
  useEffect(() => {
    window.addEventListener(GLOBAL_SEARCH_OPEN_EVENT, open);
    return () => window.removeEventListener(GLOBAL_SEARCH_OPEN_EVENT, open);
  }, [open]);

  return {
    isOpen,
    open,
    close,
    query,
    setQuery,
    hasQuery,
    showEmptyResults,
    groups,
    suggestionGroups,
    browseSuggestions: BROWSE_SUGGESTIONS,
    visibleResults,
    activeIndex,
    setActiveIndex,
    moveActiveIndex,
    setActiveIndexToStart,
    setActiveIndexToEnd,
    selectResult,
    recentSearches,
    selectRecentSearch,
    clearRecent,
  };
}
