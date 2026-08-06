import { cn } from "@/shared/lib/cn.js";
import Button from "@/shared/components/ui/Button.jsx";
import ResultBadge from "@/features/search/components/ResultBadge.jsx";
import { highlightText } from "@/features/search/utils/highlightText.js";

/**
 * The whole card is the interactive target (not just the CTA button),
 * matching how every other clickable card in the app behaves (see
 * StatTile / QuickActionCard in DashboardPage.jsx). Previously this card
 * had no onSelect wiring at all and wasn't keyboard-operable — fixed here
 * as a correctness fix, not a visual redesign; no className/layout below
 * has changed.
 */
function ResultCard({
  icon: Icon,
  title,
  description,
  badge,
  metadata = [],
  cta,
  query = "",
  onSelect,
  className,
}) {
  const handleKeyDown = (event) => {
    if (!onSelect) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      aria-label={onSelect ? title : undefined}
      className={cn(
        "flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition",
        "hover:-translate-y-1 hover:shadow-lg",
        onSelect &&
          "cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
          {Icon && (
            <Icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
          )}
        </span>

        {badge && (
          <ResultBadge variant={badge.variant}>{badge.label}</ResultBadge>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-slate-900">
          {highlightText(title, query)}
        </h3>
        <p className="text-sm text-slate-600">
          {highlightText(description, query)}
        </p>
      </div>

      {metadata.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
          {metadata.map((item, index) => (
            <span key={item} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true">&bull;</span>}
              {item}
            </span>
          ))}
        </div>
      )}

      {cta && (
        <div className="mt-auto pt-2">
          <Button variant="outline" size="sm" fullWidth>
            {cta}
          </Button>
        </div>
      )}
    </div>
  );
}

export default ResultCard;
