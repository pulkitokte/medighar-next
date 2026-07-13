/**
 * Generic, entity-agnostic service-layer helpers. These express business
 * intent ("apply search", "apply sorting", "apply pagination", "resolve
 * related records") on top of the generic repository helpers, so individual
 * domain services can compose consistent behavior without duplicating array
 * logic.
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

/**
 * Resolves an array of ids into an array of entity objects using a
 * caller-supplied lookup function. Missing/unresolved ids are silently
 * dropped rather than producing null entries. Used to turn relationship
 * arrays (e.g. recommendedMedicineIds) stored on one entity into the
 * actual related entities, without any domain-specific knowledge here.
 * @param {Array<unknown>} ids
 * @param {(id: unknown) => object|null} getByIdFn
 * @returns {Array<object>}
 */
export function resolveByIds(ids, getByIdFn) {
  if (!Array.isArray(ids) || typeof getByIdFn !== "function") return [];

  return ids.map((id) => getByIdFn(id)).filter(Boolean);
}
