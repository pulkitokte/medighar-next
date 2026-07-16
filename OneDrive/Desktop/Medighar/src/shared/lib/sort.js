/**
 * Single, reusable sorting engine shared by every module's service.
 * Replaces the per-service sorting call pattern with one implementation.
 *
 * Must never contain logic specific to any single domain.
 */

/**
 * Sorts an array using a named comparator selected from a caller-supplied
 * comparator map. Never mutates the original array. If the given sortBy
 * key isn't found in the comparators map, returns a shallow copy of the
 * original array in its original order.
 * @param {Array<unknown>} items
 * @param {string} sortBy
 * @param {Record<string, (a: unknown, b: unknown) => number>} comparators
 * @returns {Array<unknown>}
 */
export function sortItems(items = [], sortBy, comparators = {}) {
  const copy = [...items];

  const compareFn = comparators[sortBy];

  if (typeof compareFn !== "function") {
    return copy;
  }

  return copy.sort(compareFn);
}
