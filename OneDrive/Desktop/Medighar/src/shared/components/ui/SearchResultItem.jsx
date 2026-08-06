import { cn } from "@/shared/lib/cn.js";

/**
 * Highlights the first case-insensitive occurrence of `query` inside
 * `text` using a semantic <mark> element. Returns the original text
 * unchanged when there's no query or no match, so this is always safe
 * to call unconditionally.
 * @param {string} text
 * @param {string} query
 * @returns {string|Array<string|JSX.Element>}
 */
function highlightMatch(text, query) {
  if (!text) return text;

  const trimmedQuery = query.trim();
  if (!trimmedQuery) return text;

  const matchIndex = text.toLowerCase().indexOf(trimmedQuery.toLowerCase());
  if (matchIndex === -1) return text;

  const before = text.slice(0, matchIndex);
  const match = text.slice(matchIndex, matchIndex + trimmedQuery.length);
  const after = text.slice(matchIndex + trimmedQuery.length);

  return (
    <>
      {before}
      <mark className="rounded-[2px] bg-amber-100 text-inherit">{match}</mark>
      {after}
    </>
  );
}

/**
 * Presentational row for a single search result inside the Command
 * Palette. No real DOM focus is placed on this element — active state is
 * tracked via aria-activedescendant on the parent input, per the
 * accessible combobox pattern. Padding is sized for comfortable touch
 * targets on mobile as well as desktop pointer use.
 * @param {{
 *   result: object,
 *   query?: string,
 *   isActive: boolean,
 *   id: string,
 *   onSelect: (result: object) => void,
 *   onHover: () => void,
 * }} props
 */
function SearchResultItem({
  result,
  query = "",
  isActive,
  id,
  onSelect,
  onHover,
}) {
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
        "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-sm",
        isActive
          ? "bg-blue-50 text-blue-900"
          : "text-slate-700 hover:bg-slate-50",
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          isActive
            ? "bg-blue-100 text-blue-600"
            : "bg-slate-100 text-slate-500",
        )}
        aria-hidden="true"
      >
        <Icon className="h-4 w-4" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-slate-900">
          {highlightMatch(result.title, query)}
        </p>
        {result.subtitle && (
          <p className="truncate text-xs text-slate-500">
            {highlightMatch(result.subtitle, query)}
          </p>
        )}
      </div>

      <span className="shrink-0 text-xs text-slate-400">{result.category}</span>
    </li>
  );
}

export default SearchResultItem;
