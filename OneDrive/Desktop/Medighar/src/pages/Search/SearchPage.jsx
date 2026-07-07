import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import SearchBar from "@/features/search/components/SearchBar.jsx";
import SearchCategoryTabs from "@/features/search/components/SearchCategoryTabs.jsx";
import SearchFilters from "@/features/search/components/SearchFilters.jsx";
import EmptySearchState from "@/features/search/components/EmptySearchState.jsx";
import SearchResults from "@/features/search/components/SearchResults.jsx";
import { SEARCH_CATEGORIES } from "@/data/search/categories.js";
import { SEARCH_FILTERS } from "@/data/search/filters.js";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(
    SEARCH_CATEGORIES[0].key,
  );
  const [activeFilter, setActiveFilter] = useState(SEARCH_FILTERS[0].key);

  const activeCategoryData = useMemo(
    () => SEARCH_CATEGORIES.find((category) => category.key === activeCategory),
    [activeCategory],
  );

  const hasQuery = query.length > 0;

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
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          className="w-full"
        >
          <SearchCategoryTabs
            value={activeCategory}
            onChange={setActiveCategory}
          />
        </motion.div>

        <motion.div
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
          className="w-full"
        >
          <SearchFilters value={activeFilter} onChange={setActiveFilter} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
          className="w-full"
        >
          {hasQuery ? <SearchResults /> : <EmptySearchState />}
        </motion.div>
      </Container>
    </Section>
  );
}

export default SearchPage;
