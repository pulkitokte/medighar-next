import { useCallback, useEffect, useState } from "react";
import {
  getRecentSearches,
  clearRecentSearches,
  subscribeToRecentSearches,
} from "@/services/search/search.repository.js";

/**
 * Shared recent-search-query state. Used identically by the Command
 * Palette and Site Search so the two surfaces never drift: a query
 * recorded from either one is immediately visible on the other, since
 * both read the same repository and react to the same change event.
 * Extracted so this state/subscribe logic exists in exactly one place.
 * @returns {{ recentSearches: string[], clearRecent: () => void }}
 */
export function useRecentSearchQueries() {
  const [recentSearches, setRecentSearches] = useState(() =>
    getRecentSearches(),
  );

  useEffect(
    () =>
      subscribeToRecentSearches(() => setRecentSearches(getRecentSearches())),
    [],
  );

  const clearRecent = useCallback(() => clearRecentSearches(), []);

  return { recentSearches, clearRecent };
}