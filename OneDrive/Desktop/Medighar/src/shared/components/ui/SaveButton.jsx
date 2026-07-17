import { Bookmark } from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import { useBookmarks } from "@/hooks/useBookmarks.js";

/**
 * Reusable, entity-agnostic save/bookmark toggle. Works for any module by
 * passing its bookmark type ("doctor", "medicine", "disease", "pharmacy")
 * and the entity's id. Stops click propagation so it can be placed inside
 * clickable/navigable cards without triggering navigation.
 * @param {{ type: "doctor"|"medicine"|"disease"|"pharmacy", id: string, className?: string }} props
 */
function SaveButton({ type, id, className }) {
  const { isBookmarked, toggle } = useBookmarks(type);
  const saved = isBookmarked(id);

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggle(id);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save for later"}
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border shadow-sm transition-colors",
        saved
          ? "border-blue-200 bg-blue-50 text-blue-600"
          : "border-slate-200 bg-white text-slate-400 hover:text-slate-600",
        className,
      )}
    >
      <Bookmark
        className={cn("h-4 w-4", saved && "fill-blue-600")}
        aria-hidden="true"
      />
    </button>
  );
}

export default SaveButton;
