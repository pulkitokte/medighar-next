/**
 * Generic, entity-agnostic repository-layer helpers. These operate on plain
 * arrays only and must never contain logic specific to any single domain
 * (Doctors, Medicines, Diseases, etc.). Repositories for any future module
 * can compose these directly against their own mock data today, and against
 * query results from Firestore later, without changing this file.
 */

/**
 * Returns a page-sized slice of an array.
 * @param {Array<unknown>} array
 * @param {{ page?: number, pageSize?: number }} [options]
 * @returns {Array<unknown>}
 */
export function paginateArray(array = [], { page = 1, pageSize } = {}) {
  if (!Array.isArray(array) || !pageSize || pageSize <= 0) {
    return [...array];
  }

  const safePage = page > 0 ? page : 1;
  const start = (safePage - 1) * pageSize;

  return array.slice(start, start + pageSize);
}

/**
 * Returns a new, sorted copy of an array using the given comparator.
 * Never mutates the source array.
 * @param {Array<unknown>} array
 * @param {(a: unknown, b: unknown) => number} [compareFn]
 * @returns {Array<unknown>}
 */
export function sortArray(array = [], compareFn) {
  const copy = [...array];

  if (typeof compareFn !== "function") return copy;

  return copy.sort(compareFn);
}

/**
 * Performs a case-insensitive substring match across the given fields of
 * each item. Returns a new copy of the array; never mutates the source.
 * @param {Array<object>} array
 * @param {string} query
 * @param {Array<string>} fields
 * @param {{ transform?: (item: object, field: string) => unknown }} [options]
 * @returns {Array<object>}
 */
export function safeSearch(
  array = [],
  query = "",
  fields = [],
  { transform } = {},
) {
  const normalizedQuery = query?.trim().toLowerCase();

  if (!normalizedQuery) return [...array];

  return array.filter((item) => {
    const haystack = fields
      .map((field) => (transform ? transform(item, field) : item[field]))
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

/**
 * Returns the distinct, defined values for a given field (or accessor
 * function) across an array of items. Useful for deriving filter options.
 * @param {Array<object>} array
 * @param {string | ((item: object) => unknown)} key
 * @returns {Array<unknown>}
 */
export function uniqueValues(array = [], key) {
  const values = array
    .map((item) => (typeof key === "function" ? key(item) : item[key]))
    .filter((value) => value !== undefined && value !== null && value !== "");

  return [...new Set(values)];
}
