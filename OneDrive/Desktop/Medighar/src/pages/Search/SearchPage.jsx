import { useMemo } from "react";
import { motion } from "framer-motion";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import SearchHint from "@/shared/components/ui/SearchHint.jsx";
import SearchBar from "@/features/search/components/SearchBar.jsx";
import SearchCategoryTabs from "@/features/search/components/SearchCategoryTabs.jsx";
import EmptySearchState from "@/features/search/components/EmptySearchState.jsx";
import SearchResults from "@/features/search/components/SearchResults.jsx";
import { SEARCH_CATEGORIES } from "@/data/search/categories.js";
import { useSiteSearch } from "@/hooks/useSiteSearch.js";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

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
 * Adapts a real search index item ({id, title, subtitle, icon, category,
 * route}) into the shape ResultCard/SearchResults expect. No fields are
 * fabricated: metadata is intentionally left empty since no real
 * per-item metadata (ratings, distance, verification) exists yet.
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

function SearchPage() {
  const {
    query,
    setQuery,
    activeCategory,
    setActiveCategory,
    results,
    hasQuery,
    selectResult,
  } = useSiteSearch();

  const activeCategoryData = useMemo(
    () => SEARCH_CATEGORIES.find((category) => category.key === activeCategory),
    [activeCategory],
  );

  const cardResults = useMemo(() => results.map(toResultCardProps), [results]);

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
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
          className="w-full"
        >
          {cardResults.length === 0 ? (
            <EmptySearchState query={hasQuery ? query : ""} />
          ) : (
            <SearchResults
              results={cardResults}
              query={query}
              onSelect={selectResult}
            />
          )}
        </motion.div>
      </Container>
    </Section>
  );
}

export default SearchPage;
