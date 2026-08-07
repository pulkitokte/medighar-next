import { createElement } from "react";

/**
 * Escapes RegExp special characters in a raw string so it can be safely
 * interpolated into a `new RegExp(...)` pattern.
 * @param {string} value
 * @returns {string}
 */
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Wraps every case-insensitive occurrence of `query` inside `text` in a
 * <mark> element. Returns the original text unchanged when there's no
 * query or no match, so this is always safe to call unconditionally.
 * Shared by every Search module surface (Command Palette result rows via
 * SearchResultItem, Site Search result cards via ResultCard) so
 * highlighted text looks and behaves identically everywhere, rather than
 * each surface reimplementing its own highlight logic.
 * @param {string} text
 * @param {string} [query]
 * @returns {string|Array<string|import("react").ReactElement>}
 */
export function highlightText(text, query) {
  if (!text) return text;

  const trimmedQuery = query?.trim();
  if (!trimmedQuery) return text;

  const regex = new RegExp(`(${escapeRegExp(trimmedQuery)})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) => {
    const isMatch = part.toLowerCase() === trimmedQuery.toLowerCase();

    if (!isMatch) return part;

    return createElement(
      "mark",
      {
        key: `${part}-${index}`,
        className: "rounded bg-yellow-200 px-1 text-inherit",
      },
      part,
    );
  });
}
