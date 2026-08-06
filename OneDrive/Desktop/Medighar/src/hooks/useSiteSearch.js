import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchData } from "@/hooks/useSearchData.js";
import { useDebouncedValue } from "@/hooks/useDebouncedValue.js";
import { filterSearchResults } from "@/services/search/search.service.js";
import { addRecentSearch } from "@/services/search/search.repository.js";

const DEBOUNCE_MS = 200;

/**
 * Categories the Search page browses. Deliberately a subset of every
 * category the Command Palette indexes (which also includes Quick
 * Actions, Navigation, Appointments, Reports, etc.) — this page is for
 * browsing entities, not general app navigation, matching the page's
 * original intent.
 */
const PAGE_SEARCH_CATEGORIES = [
  "Doctors",
  "Medicines",
  "Diseases",
  "Pharmacies",
];

/**
 * Owns state and behavior for the Search page: query, category tab, and
 * results. Consumes the exact same search pipeline as the Command
 * Palette (useSearchData + filterSearchResults) rather than a separate
 * implementation, so ranking, matching, boosting, and category grouping
 * are identical between the two surfaces.
 * @returns {object}
 */
export function useSiteSearch() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS);

  const { searchIndex, boostedIds } = useSearchData();

  const { flat } = useMemo(
    () => filterSearchResults(searchIndex, debouncedQuery, boostedIds),
    [searchIndex, debouncedQuery, boostedIds],
  );

  const results = useMemo(() => {
    const entityResults = flat.filter((item) =>
      PAGE_SEARCH_CATEGORIES.includes(item.category),
    );

    if (activeCategory === "all") return entityResults;
    return entityResults.filter((item) => item.category === activeCategory);
  }, [flat, activeCategory]);

  const hasQuery = debouncedQuery.trim().length > 0;

  const selectResult = (result) => {
    if (!result) return;

    if (query.trim()) {
      addRecentSearch(query.trim());
    }

    navigate(result.route);
  };

  return {
    query,
    setQuery,
    activeCategory,
    setActiveCategory,
    results,
    hasQuery,
    selectResult,
  };
}
