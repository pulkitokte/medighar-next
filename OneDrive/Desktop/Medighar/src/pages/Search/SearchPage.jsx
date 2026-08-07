import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { History, Sparkles } from "lucide-react";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import SearchHint from "@/shared/components/ui/SearchHint.jsx";
import SearchBar from "@/features/search/components/SearchBar.jsx";
import SearchCategoryTabs from "@/features/search/components/SearchCategoryTabs.jsx";
import EmptySearchState from "@/features/search/components/EmptySearchState.jsx";
import SearchResults from "@/features/search/components/SearchResults.jsx";
import ResultCard from "@/features/search/components/ResultCard.jsx";
import { SEARCH_CATEGORIES } from "@/data/search/categories.js";
import { BROWSE_SUGGESTIONS } from "@/services/search/search.service.js";
import { useSiteSearch } from "@/hooks/useSiteSearch.js";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const RESULTS_PANEL_ID = "search-results-panel";

/**
 * Category -> ResultCard badge tone. Purely presentational grouping by
 * real category, not derived or fabricated data.
 */
const CATEGORY_BADGE_VARIANTS = {
  Doctors: "primary",
  Medicines: "success",
  Diseases: "warning",
  Pharmacies: "neutral",
};

const CATEGORY_CTA_LABELS = {
  Doctors: "View Doctor",
  Medicines: "View Medicine",
  Diseases: "View Disease",
  Pharmacies: "View Pharmacy",
};

/**
 * "Popular Categories" for the pre-query discovery screen: the real
 * browse-page links already defined in search.service.js, minus
 * Dashboard (not a browsable entity category). No fabricated data.
 */
const POPULAR_CATEGORY_LINKS = BROWSE_SUGGESTIONS.filter(
  (item) => item.id !== "nav-dashboard",
);

/**
 * Adapts a real search index item ({id, title, subtitle, icon, category,
 * route}) into the shape ResultCard/SearchResults expect. No fields are
 * fabricated: metadata is intentionally left empty since no real
 * per-item metadata (ratings, distance, verification) exists yet.
 * Works for both entity results (category "Doctors" etc.) and
 * suggestion results (category "Recently Viewed" / "Saved Doctors" /
 * "Saved Medicines") — unmapped categories simply fall back to a
 * neutral badge and generic CTA label.
 * @param {object} item
 * @returns {object}
 */
function toResultCardProps(item) {
  return {
    id: item.id,
    icon: item.icon,
    title: item.title,
    description: item.subtitle ?? "",
    badge: {
      label: item.category,
      variant: CATEGORY_BADGE_VARIANTS[item.category] ?? "neutral",
    },
    metadata: [],
    cta: CATEGORY_CTA_LABELS[item.category] ?? "View",
    route: item.route,
  };
}

/**
 * A plain results grid without ResultSectionHeader's "Showing N Results"
 * count — used for the discovery screen's "Suggested for You" section,
 * which already has its own heading and shouldn't show a redundant one.
 */
function SuggestionGrid({ results, onSelect }) {
  return (
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {results.map((result, index) => (
        <motion.div
          key={result.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: index * 0.04 }}
        >
          <ResultCard
            icon={result.icon}
            title={result.title}
            description={result.description}
            badge={result.badge}
            metadata={result.metadata}
            cta={result.cta}
            onSelect={() => onSelect(result)}
          />
        </motion.div>
      ))}
    </div>
  );
}

function SearchPage() {
  const {
    query,
    setQuery,
    activeCategory,
    setActiveCategory,
    results,
    suggestedResults,
    hasQuery,
    selectResult,
    recentSearches,
    clearRecent,
    selectRecentSearch,
  } = useSiteSearch();

  const navigate = useNavigate();

  const activeCategoryData = useMemo(
    () => SEARCH_CATEGORIES.find((category) => category.key === activeCategory),
    [activeCategory],
  );

  const cardResults = useMemo(() => results.map(toResultCardProps), [results]);
  const suggestedCardResults = useMemo(
    () => suggestedResults.map(toResultCardProps),
    [suggestedResults],
  );

  const statusMessage = hasQuery
    ? cardResults.length === 0
      ? `No results found for ${query.trim()}`
      : `${cardResults.length} result${cardResults.length === 1 ? "" : "s"} found for ${query.trim()}`
    : "";

  return (
    <Section paddingY="py-16 sm:py-20">
      <Container className="flex flex-col items-center gap-10">
        <motion.div
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <PageHeading
            title="Search Medighar"
            subtitle="Find doctors, medicines, diseases and healthcare services in one place."
          />
        </motion.div>

        <motion.div
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
          className="w-full max-w-2xl"
        >
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder={activeCategoryData?.placeholder}
          />
        </motion.div>

        <motion.div
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.075 }}
        >
          <SearchHint label="Prefer to search everything at once?" />
        </motion.div>

        <motion.div
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          className="w-full"
        >
          <SearchCategoryTabs
            value={activeCategory}
            onChange={setActiveCategory}
            panelId={RESULTS_PANEL_ID}
          />
        </motion.div>

        <div aria-live="polite" className="sr-only">
          {statusMessage}
        </div>

        <div
          id={RESULTS_PANEL_ID}
          role="tabpanel"
          aria-labelledby={`search-tab-${activeCategory}`}
          tabIndex={-1}
          className="w-full"
        >
          <AnimatePresence mode="wait">
            {!hasQuery ? (
              <motion.div
                key="discovery"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex w-full flex-col gap-10"
              >
                {recentSearches.length > 0 && (
                  <section
                    aria-label="Recent searches"
                    className="flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                        <History
                          className="h-4 w-4 text-slate-400"
                          aria-hidden="true"
                        />
                        Recent Searches
                      </h2>
                      <button
                        type="button"
                        onClick={clearRecent}
                        className="text-xs font-medium text-slate-400 hover:text-slate-600"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                      {recentSearches.map((recentQuery) => (
                        <button
                          key={recentQuery}
                          type="button"
                          onClick={() => selectRecentSearch(recentQuery)}
                          className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                          {recentQuery}
                        </button>
                      ))}
                    </div>
                  </section>
                )}

                {suggestedCardResults.length > 0 && (
                  <section
                    aria-label="Suggested for you"
                    className="flex flex-col gap-4"
                  >
                    <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                      <Sparkles
                        className="h-4 w-4 text-emerald-600"
                        aria-hidden="true"
                      />
                      Suggested for You
                    </h2>
                    <SuggestionGrid
                      results={suggestedCardResults}
                      onSelect={selectResult}
                    />
                  </section>
                )}

                <section
                  aria-label="Popular categories"
                  className="flex flex-col gap-4"
                >
                  <h2 className="text-base font-semibold text-slate-900">
                    Popular Categories
                  </h2>
                  <div className="flex flex-wrap justify-center gap-3">
                    {POPULAR_CATEGORY_LINKS.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => navigate(category.route)}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                          <Icon
                            className="h-4 w-4 text-slate-400"
                            aria-hidden="true"
                          />
                          {category.title}
                        </button>
                      );
                    })}
                  </div>
                </section>
              </motion.div>
            ) : cardResults.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <EmptySearchState query={query} />
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <SearchResults
                  results={cardResults}
                  query={query}
                  onSelect={selectResult}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </Section>
  );
}

export default SearchPage;
