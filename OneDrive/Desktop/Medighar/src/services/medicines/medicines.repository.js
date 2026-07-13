import { MEDICINES } from "@/data/medicines/medicines.js";
import { safeSearch, findById } from "@/shared/lib/repositoryHelpers.js";
import {
  filterByEquality,
  filterByBoolean,
} from "@/shared/lib/filterHelpers.js";

/**
 * Returns every medicine record.
 * Later this will be replaced by a Firestore collection read.
 * @returns {Array<object>}
 */
export function getAllMedicines() {
  return [...MEDICINES];
}

/**
 * Returns a single medicine by id, or null if not found.
 * @param {string} id
 * @returns {object|null}
 */
export function getMedicineById(id) {
  return findById(MEDICINES, id);
}

/**
 * Performs a simple text match against a medicine's core identifying fields.
 * @param {string} query
 * @param {Array<object>} [source]
 * @returns {Array<object>}
 */
export function searchMedicines(query, source = MEDICINES) {
  return safeSearch(source, query, [
    "name",
    "genericName",
    "brand",
    "category",
  ]);
}

/**
 * Filters medicines by simple equality and boolean fields.
 * @param {{category?: string, dosageForm?: string, prescriptionOnly?: boolean}} filters
 * @param {Array<object>} [source]
 * @returns {Array<object>}
 */
export function filterMedicines(filters = {}, source = MEDICINES) {
  const { category, dosageForm, prescriptionOnly } = filters;

  let result = [...source];

  result = filterByEquality(result, "category", category);
  result = filterByEquality(result, "dosageForm", dosageForm);
  result = filterByBoolean(result, "prescriptionRequired", prescriptionOnly);

  return result;
}
