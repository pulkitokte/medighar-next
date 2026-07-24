import { cn } from "@/shared/lib/cn.js";

/**
 * Presentational row for a single search result inside the Command
 * Palette. No real DOM focus is placed on this element — active state is
 * tracked via aria-activedescendant on the parent input, per the
 * accessible combobox pattern.
 * @param {{
 *   result: object,
 *   isActive: boolean,
 *   id: string,
 *   onSelect: (result: object) => void,
 *   onHover: () => void,
 * }} props
 */
function SearchResultItem({ result, isActive, id, onSelect, onHover }) {
  const Icon = result.icon;

  return (
    <li
      id={id}
      role="option"
      aria-selected={isActive}
      onMouseEnter={onHover}
      onMouseDown={(event) => {
        event.preventDefault();
        onSelect(result);
      }}
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm",
        isActive ? "bg-blue-50 text-blue-900" : "text-slate-700 hover:bg-slate-50",
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          isActive ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500",
        )}
        aria-hidden="true"
      >
        <Icon className="h-4 w-4" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-slate-900">{result.title}</p>
        {result.subtitle && (
          <p className="truncate text-xs text-slate-500">{result.subtitle}</p>
        )}
      </div>

      <span className="shrink-0 text-xs text-slate-400">{result.category}</span>
    </li>
  );
}

export default SearchResultItem;