import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchData } from "@/hooks/useSearchData.js";
import { useDebouncedValue } from "@/hooks/useDebouncedValue.js";
import { useRecentSearchQueries } from "@/hooks/useRecentSearchQueries.js";
import {
  filterSearchResults,
  buildSuggestedResults,
  QUICK_ACTIONS,
  BROWSE_SUGGESTIONS,
} from "@/services/search/search.service.js";
import { addRecentSearch } from "@/services/search/search.repository.js";

const DEBOUNCE_MS = 200;

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
 * recent searches, empty-state suggestions, and focus recovery. Data
 * assembly is delegated to useSearchData() and recent-query state to
 * useRecentSearchQueries() — the same two hooks Site Search consumes —
 * so this hook owns only palette-specific UI state.
 * @returns {object}
 */
export function useGlobalSearch() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  // Tracks whatever element had focus just before the palette opened
  // (the Ctrl+K/"/" shortcut leaves body focused; a SearchHint button
  // click leaves that button focused), so close() can restore it rather
  // than always dropping focus back to body.
  const previousFocusRef = useRef(null);

  const { searchIndex, boostedIds, recentEntries, saved } = useSearchData();
  const { recentSearches, clearRecent } = useRecentSearchQueries();
  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS);

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
    setActiveIndex(0);
    restorePreviousFocus();
  }, [restorePreviousFocus]);

  const toggle = useCallback(() => {
    setIsOpen((previous) => {
      if (previous) {
        setQuery("");
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