import { Search } from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import { requestGlobalSearchOpen } from "@/hooks/useGlobalSearch.js";

/**
 * Secondary entry point into the single, globally mounted Command
 * Palette. Does not hold its own useGlobalSearch() instance (that would
 * duplicate data-fetching and have no visible effect, since the palette
 * that's actually rendered lives in MainLayout) — instead it requests
 * that instance to open via the same window-event pattern already used
 * elsewhere in the app.
 * @param {{ label?: string, className?: string }} props
 */
function SearchHint({ label = "Search across Medighar", className = "" }) {
  return (
    <button
      type="button"
      onClick={requestGlobalSearchOpen}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700",
        className,
      )}
    >
      <Search className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
      {label}
      <span className="text-slate-300" aria-hidden="true">
        ·
      </span>
      <span className="font-medium text-slate-500">Ctrl/Cmd + K</span>
    </button>
  );
}

export default SearchHint;
