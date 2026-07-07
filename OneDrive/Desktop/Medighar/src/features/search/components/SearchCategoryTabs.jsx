import { motion } from "framer-motion";
import { cn } from "@/shared/lib/cn.js";
import { SEARCH_CATEGORIES } from "@/data/search/categories.js";

function SearchCategoryTabs({ value, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Search categories"
      className="flex w-full flex-wrap items-center justify-center gap-3"
    >
      {SEARCH_CATEGORIES.map((category) => {
        const Icon = category.icon;
        const isActive = value === category.key;

        return (
          <button
            key={category.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(category.key)}
            className={cn(
              "relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            )}
          >
            {isActive && (
              <motion.span
                layoutId="search-category-active-pill"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className="absolute inset-0 rounded-full bg-blue-600 shadow-sm"
              />
            )}
            <Icon className="relative h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="relative">{category.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default SearchCategoryTabs;
