/**
 * Single, reusable search engine shared by every module's repository.
 * Replaces the per-repository search patterns (and the transform-based
 * array workaround previously needed for fields like `symptoms`) with one
 * implementation that natively understands nested string arrays.
 *
 * Must never contain logic specific to any single domain.
 */

/**
 * Normalizes a raw query string: trims whitespace and lowercases it.
 * @param {unknown} query
 * @returns {string}
 */
function normalizeQuery(query) {
  return typeof query === "string" ? query.trim().toLowerCase() : "";
}

/**
 * Converts a single field's value into searchable text. Strings pass
 * through as-is; arrays of strings (e.g. languages, uses, symptoms,
 * services) are joined into a single space-separated string; anything
 * else is coerced to a string. Nullish values contribute nothing.
 * @param {unknown} value
 * @returns {string}
 */
function fieldToSearchableText(value) {
  if (value === undefined || value === null) return "";

  if (Array.isArray(value)) {
    return value.filter((entry) => typeof entry === "string").join(" ");
  }

  if (typeof value === "string") return value;

  return String(value);
}

/**
 * Performs a case-insensitive substring search across the given fields of
 * each item. Fields may be plain strings or arrays of strings (nested
 * string arrays are searched natively, no transform required). An empty or
 * whitespace-only query returns a shallow copy of the original array.
 * Never mutates the source array.
 * @param {Array<object>} items
 * @param {string} query
 * @param {Array<string>} searchableFields
 * @returns {Array<object>}
 */
export function safeSearch(items = [], query = "", searchableFields = []) {
  const normalizedQuery = normalizeQuery(query);

  if (!normalizedQuery) return [...items];

  return items.filter((item) => {
    const haystack = searchableFields
      .map((field) => fieldToSearchableText(item[field]))
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}
