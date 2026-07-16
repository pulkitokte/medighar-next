/**
 * Generic, entity-agnostic relationship-resolution helpers shared across
 * repositories. These operate on plain arrays and array-valued fields only,
 * with no knowledge of any specific domain (Doctors, Medicines, Diseases,
 * Pharmacy, etc.).
 *
 * Complements resolveByIds() in shared/lib/serviceHelpers.js, which maps an
 * array of ids into entity objects (the "forward" direction: id → entity).
 * This file covers the "reverse" direction: given an id, find every item
 * whose relationship array field contains it.
 */

/**
 * Returns every item whose given array field contains the given id.
 * Items where the field is missing or not an array are excluded rather
 * than throwing. Never mutates the source array.
 * @param {Array<object>} items
 * @param {string} field
 * @param {unknown} id
 * @returns {Array<object>}
 */
export function filterByRelationId(items = [], field, id) {
  return items.filter(
    (item) => Array.isArray(item[field]) && item[field].includes(id),
  );
}
