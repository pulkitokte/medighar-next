import { PHARMACIES } from "@/data/pharmacy/pharmacies.js";
import { safeSearch, findById } from "@/shared/lib/repositoryHelpers.js";
import {
  filterByEquality,
  filterByBoolean,
} from "@/shared/lib/filterHelpers.js";

/**
 * Returns every pharmacy record.
 * Later this will be replaced by a Firestore collection read.
 * @returns {Array<object>}
 */
export function getAllPharmacies() {
  return [...PHARMACIES];
}

/**
 * Returns a single pharmacy by id, or null if not found.
 * @param {string} id
 * @returns {object|null}
 */
export function getPharmacyById(id) {
  return findById(PHARMACIES, id);
}

/**
 * Performs a simple text match against a pharmacy's core identifying fields.
 * @param {string} query
 * @param {Array<object>} [source]
 * @returns {Array<object>}
 */
export function searchPharmacies(query, source = PHARMACIES) {
  return safeSearch(source, query, ["name", "city", "address", "type"]);
}

/**
 * Filters pharmacies by simple equality and boolean fields.
 * @param {{type?: string, city?: string, homeDelivery?: boolean}} filters
 * @param {Array<object>} [source]
 * @returns {Array<object>}
 */
export function filterPharmacies(filters = {}, source = PHARMACIES) {
  const { type, city, homeDelivery } = filters;

  let result = [...source];

  result = filterByEquality(result, "type", type);
  result = filterByEquality(result, "city", city);
  result = filterByBoolean(result, "homeDelivery", homeDelivery);

  return result;
}
