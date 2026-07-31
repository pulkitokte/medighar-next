import { cn } from "@/shared/lib/cn.js";

const SORT_OPTIONS = [
  { key: "newest", label: "Newest" },
  { key: "name-asc", label: "Name (A-Z)" },
  { key: "name-desc", label: "Name (Z-A)" },
  { key: "severity", label: "Severity" },
];

function DiseaseSort({ value, onChange }) {
  return (
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
      <span className="text-sm font-medium text-slate-700">Sort by</span>
      <div className="flex flex-wrap items-center gap-2">
        {SORT_OPTIONS.map((option) => {
          const isActive = value === option.key;

          return (
            <button
              key={option.key}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(option.key)}
              className={cn(
                "transition-premium rounded-full border px-4 py-1.5 text-sm font-medium",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600",
                isActive
                  ? "border-amber-600 bg-amber-600 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-amber-200 hover:bg-amber-50",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default DiseaseSort;