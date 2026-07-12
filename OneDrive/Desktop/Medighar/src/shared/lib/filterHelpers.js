/**
 * Generic, entity-agnostic filtering helpers that operate on plain arrays
 * of objects. Repositories for any future module can compose these instead
 * of duplicating equality/boolean/range/predicate filtering logic.
 *
 * Must never contain logic specific to any single domain.
 */

import { ensureArray } from "@/shared/lib/validation.js";

/**
 * Filters an array by strict equality on a field, skipping the filter
 * entirely when the value is empty or matches the wildcard.
 * @param {Array<object>} array
 * @param {string} field
 * @param {unknown} value
 * @param {{ wildcard?: unknown, transform?: (value: unknown) => unknown }} [options]
 * @returns {Array<object>}
 */
export function filterByEquality(
  array,
  field,
  value,
  { wildcard = "All", transform } = {},
) {
  const list = ensureArray(array);

  if (
    value === undefined ||
    value === null ||
    value === "" ||
    value === wildcard
  ) {
    return [...list];
  }

  const compareValue = transform ? transform(value) : value;

  return list.filter((item) => {
    const itemValue = transform ? transform(item[field]) : item[field];
    return itemValue === compareValue;
  });
}

/**
 * Filters an array to items where the given field is strictly true, only
 * when the flag itself is truthy. A falsy flag returns the array unchanged.
 * @param {Array<object>} array
 * @param {string} field
 * @param {boolean} flag
 * @returns {Array<object>}
 */
export function filterByBoolean(array, field, flag) {
  const list = ensureArray(array);

  if (!flag) return [...list];

  return list.filter((item) => item[field] === true);
}

/**
 * Filters an array to items whose numeric field falls within [min, max].
 * Either bound may be omitted.
 * @param {Array<object>} array
 * @param {string} field
 * @param {{ min?: number, max?: number }} [options]
 * @returns {Array<object>}
 */
export function filterByRange(array, field, { min, max } = {}) {
  const list = ensureArray(array);

  return list.filter((item) => {
    const itemValue = item[field];

    if (typeof itemValue !== "number") return false;
    if (min !== undefined && itemValue < min) return false;
    if (max !== undefined && itemValue > max) return false;

    return true;
  });
}

/**
 * Filters an array using a caller-supplied predicate function.
 * @param {Array<object>} array
 * @param {(item: object) => boolean} predicateFn
 * @returns {Array<object>}
 */
export function filterByPredicate(array, predicateFn) {
  const list = ensureArray(array);

  if (typeof predicateFn !== "function") return [...list];

  return list.filter(predicateFn);
}
