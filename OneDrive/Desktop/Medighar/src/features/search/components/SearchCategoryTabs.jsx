import { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/cn.js";
import { SEARCH_CATEGORIES } from "@/data/search/categories.js";

/**
 * @param {{
 *   value: string,
 *   onChange: (key: string) => void,
 *   panelId?: string,
 * }} props
 */
function SearchCategoryTabs({ value, onChange, panelId }) {
  const tabRefs = useRef({});

  const focusTab = (key) => {
    tabRefs.current[key]?.focus();
  };

  // Standard ARIA APG tabs keyboard pattern: Left/Right move between
  // tabs and activate on arrival, Home/End jump to the first/last tab.
  // Matches the same Home/End precedent already established in the
  // Command Palette, for a consistent feel across both search surfaces.
  const handleKeyDown = (event, index) => {
    const relevantKeys = ["ArrowRight", "ArrowLeft", "Home", "End"];
    if (!relevantKeys.includes(event.key)) return;

    event.preventDefault();

    let nextIndex = index;
    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % SEARCH_CATEGORIES.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + SEARCH_CATEGORIES.length) % SEARCH_CATEGORIES.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = SEARCH_CATEGORIES.length - 1;
    }

    const nextCategory = SEARCH_CATEGORIES[nextIndex];
    onChange(nextCategory.key);
    focusTab(nextCategory.key);
  };

  return (
    <div
      role="tablist"
      aria-label="Search categories"
      className="flex w-full flex-wrap items-center justify-center gap-3"
    >
      {SEARCH_CATEGORIES.map((category, index) => {
        const Icon = category.icon;
        const isActive = value === category.key;

        return (
          <button
            key={category.key}
            ref={(node) => {
              tabRefs.current[category.key] = node;
            }}
            type="button"
            role="tab"
            id={`search-tab-${category.key}`}
            aria-selected={isActive}
            aria-controls={panelId}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(category.key)}
            onKeyDown={(event) => handleKeyDown(event, index)}
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