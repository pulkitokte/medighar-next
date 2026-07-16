/**
 * Generic, entity-agnostic helpers for URL-synced listing state (search,
 * filters, sort, pagination). Used by every module's listing hook to avoid
 * duplicating identical URLSearchParams handling four times over.
 */

/**
 * Returns whether a value should be treated as "not set" and therefore
 * omitted from the URL rather than written as a query param.
 * @param {unknown} value
 * @param {string} [wildcard]
 * @returns {boolean}
 */
export function isDefaultValue(value, wildcard = "All") {
  return (
    value === undefined ||
    value === null ||
    value === "" ||
    value === wildcard ||
    value === false
  );
}

/**
 * Parses a 1-based page number from URLSearchParams, defaulting to 1 for
 * missing, non-numeric, or non-positive values.
 * @param {URLSearchParams} searchParams
 * @param {string} [key]
 * @returns {number}
 */
export function parsePageParam(searchParams, key = "page") {
  const raw = parseInt(searchParams.get(key) || "1", 10);
  return Number.isFinite(raw) && raw > 0 ? raw : 1;
}

/**
 * Returns a new URLSearchParams with the given updates applied on top of
 * the previous params. Keys whose value is a "default" value (per
 * isDefaultValue) are removed rather than written, keeping the URL clean.
 * Optionally clears the page param, for use whenever search/filters/sort
 * change and pagination should reset to page 1.
 * @param {URLSearchParams} previousParams
 * @param {Record<string, unknown>} updates
 * @param {{ resetPage?: boolean }} [options]
 * @returns {URLSearchParams}
 */
export function withUpdatedParams(
  previousParams,
  updates,
  { resetPage = false } = {},
) {
  const next = new URLSearchParams(previousParams);

  Object.entries(updates).forEach(([key, value]) => {
    if (isDefaultValue(value)) {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
  });

  if (resetPage) {
    next.delete("page");
  }

  return next;
}
