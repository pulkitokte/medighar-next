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

/**
 * Returns the first item whose key field matches the given id, or null.
 * @param {Array<object>} array
 * @param {unknown} id
 * @param {{ key?: string }} [options]
 * @returns {object|null}
 */
export function findById(array = [], id, { key = "id" } = {}) {
  return array.find((item) => item[key] === id) ?? null;
}

/**
 * Returns a new array with the item matching the given id removed. Never
 * mutates the source array.
 * @param {Array<object>} array
 * @param {unknown} id
 * @param {{ key?: string }} [options]
 * @returns {Array<object>}
 */
export function removeById(array = [], id, { key = "id" } = {}) {
  return array.filter((item) => item[key] !== id);
}

/**
 * Returns a new array with the item matching the given id replaced. The
 * replacement can be a plain object or an updater function that receives
 * the existing item and returns the replacement. Items that don't match
 * are left untouched. Never mutates the source array.
 * @param {Array<object>} array
 * @param {unknown} id
 * @param {object | ((item: object) => object)} replacement
 * @param {{ key?: string }} [options]
 * @returns {Array<object>}
 */
export function replaceById(array = [], id, replacement, { key = "id" } = {}) {
  return array.map((item) => {
    if (item[key] !== id) return item;

    return typeof replacement === "function" ? replacement(item) : replacement;
  });
}

/**
 * Returns a new array with the item matching the given id shallow-merged
 * with the given partial updates. Never mutates the source array.
 * @param {Array<object>} array
 * @param {unknown} id
 * @param {object} updates
 * @param {{ key?: string }} [options]
 * @returns {Array<object>}
 */
export function updateCollection(
  array = [],
  id,
  updates = {},
  { key = "id" } = {},
) {
  return array.map((item) =>
    item[key] === id ? { ...item, ...updates } : item,
  );
}

/**
 * Returns a new, sorted copy of an array ordered by a single field.
 * @param {Array<object>} array
 * @param {string} field
 * @param {{ direction?: 'asc' | 'desc' }} [options]
 * @returns {Array<object>}
 */
export function sortByField(array = [], field, { direction = "asc" } = {}) {
  const multiplier = direction === "desc" ? -1 : 1;

  return sortArray(array, (a, b) => {
    const valueA = a[field];
    const valueB = b[field];

    if (valueA === valueB) return 0;
    if (valueA === undefined || valueA === null) return 1;
    if (valueB === undefined || valueB === null) return -1;

    return valueA > valueB ? multiplier : -multiplier;
  });
}

/**
 * Groups items into an object keyed by the given field's value.
 * @param {Array<object>} array
 * @param {string | ((item: object) => unknown)} key
 * @returns {Record<string, Array<object>>}
 */
export function groupByField(array = [], key) {
  return array.reduce((groups, item) => {
    const groupKey = typeof key === "function" ? key(item) : item[key];
    const bucket = groups[groupKey] ?? [];

    bucket.push(item);
    groups[groupKey] = bucket;

    return groups;
  }, {});
}

/**
 * Builds a Map of items keyed by the given field's value, for fast lookup.
 * If multiple items share a key, the last one wins.
 * @param {Array<object>} array
 * @param {string | ((item: object) => unknown)} key
 * @returns {Map<unknown, object>}
 */
export function indexByKey(array = [], key) {
  const map = new Map();

  array.forEach((item) => {
    const indexKey = typeof key === "function" ? key(item) : item[key];
    map.set(indexKey, item);
  });

  return map;
}
