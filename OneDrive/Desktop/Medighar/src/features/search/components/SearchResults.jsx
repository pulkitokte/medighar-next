import { motion } from "framer-motion";
import ResultCard from "@/features/search/components/ResultCard.jsx";
import ResultSectionHeader from "@/features/search/components/ResultSectionHeader.jsx";

function SearchResults({ results, query = "" }) {
  return (
    <div className="flex w-full flex-col gap-6">
      <ResultSectionHeader count={results.length} />

      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((result, index) => (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              ease: "easeOut",
              delay: index * 0.05,
            }}
          >
            <ResultCard
              icon={result.icon}
              title={result.title}
              description={result.description}
              badge={result.badge}
              metadata={result.metadata}
              cta={result.cta}
              query={query}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default SearchResults;
