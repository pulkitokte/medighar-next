import { cn } from "@/shared/lib/cn.js";
import ResultBadge from "@/features/search/components/ResultBadge.jsx";
import { highlightText } from "@/shared/lib/highlightText.js";

/**
 * The whole card is the interactive target (not just the CTA), matching
 * how every other clickable card in the app behaves (see StatTile /
 * QuickActionCard in DashboardPage.jsx). The CTA is rendered as a
 * non-interactive visual label rather than a real <Button> — nesting a
 * second focusable/clickable control inside an element that already
 * carries role="button" would be a genuine nested-interactive-controls
 * violation and would duplicate the card's own click/Enter/Space
 * handling. The label's styling is copied verbatim from Button's
 * outline/sm/fullWidth combination so the visual result is unchanged.
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

  const accessibleLabel = [title, cta].filter(Boolean).join(". ");

  return (
    <div
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      aria-label={onSelect ? accessibleLabel : undefined}
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
          <span
            aria-hidden="true"
            className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-900 transition-colors"
          >
            {cta}
          </span>
        </div>
      )}
    </div>
  );
}

export default ResultCard;
