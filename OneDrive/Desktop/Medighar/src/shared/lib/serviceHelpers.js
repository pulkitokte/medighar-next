/**
 * Generic, entity-agnostic service-layer helpers. These express business
 * intent ("apply search", "apply sorting", "apply pagination") on top of the
 * generic repository helpers, so individual domain services can compose
 * consistent behavior without duplicating array logic.
 *
 * Must never contain logic specific to any single domain.
 */

import {
  paginateArray,
  sortArray,
  safeSearch,
} from "@/shared/lib/repositoryHelpers.js";

/**
 * Applies a text search to an array, either via a default field-based
 * substring match or a custom search function supplied by the caller.
 * @param {Array<object>} array
 * @param {string} query
 * @param {{
 *   fields?: Array<string>,
 *   transform?: (item: object, field: string) => unknown,
 *   searchFn?: (array: Array<object>, query: string) => Array<object>,
 * }} [options]
 * @returns {Array<object>}
 */
export function applySearch(
  array,
  query,
  { fields = [], transform, searchFn } = {},
) {
  if (typeof searchFn === "function") {
    return searchFn(array, query);
  }

  return safeSearch(array, query, fields, { transform });
}

/**
 * Applies sorting to an array using a named comparator from a
 * caller-supplied comparator map, falling back to a default sort key.
 * @param {Array<unknown>} array
 * @param {string} sortBy
 * @param {Record<string, (a: unknown, b: unknown) => number>} comparators
 * @param {{ defaultSort?: string }} [options]
 * @returns {Array<unknown>}
 */
export function applySorting(
  array,
  sortBy,
  comparators = {},
  { defaultSort } = {},
) {
  const key = sortBy in comparators ? sortBy : defaultSort;
  const compareFn = comparators[key];

  return sortArray(array, compareFn);
}

/**
 * Applies pagination to an array.
 * @param {Array<unknown>} array
 * @param {{ page?: number, pageSize?: number }} [options]
 * @returns {Array<unknown>}
 */
export function applyPagination(array, { page, pageSize } = {}) {
  return paginateArray(array, { page, pageSize });
}
