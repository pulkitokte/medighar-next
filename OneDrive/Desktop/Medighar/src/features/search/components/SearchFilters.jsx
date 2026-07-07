import { cn } from "@/shared/lib/cn.js";
import { SEARCH_FILTERS } from "@/data/search/filters.js";

function SearchFilters({ value, onChange }) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex w-max min-w-full items-center justify-center gap-2 px-1 py-1 sm:flex-wrap">
        {SEARCH_FILTERS.map((filter) => {
          const isActive = value === filter.key;

          return (
            <button
              key={filter.key}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(filter.key)}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SearchFilters;
