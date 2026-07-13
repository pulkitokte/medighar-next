import { cn } from "@/shared/lib/cn.js";

const SORT_OPTIONS = [
  { key: "newest", label: "Newest" },
  { key: "name-asc", label: "Name (A-Z)" },
  { key: "name-desc", label: "Name (Z-A)" },
  { key: "category", label: "Category" },
];

function MedicineSort({ value, onChange }) {
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
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
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

export default MedicineSort;
