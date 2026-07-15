import { DISEASES } from "@/data/diseases/diseases.js";
import { findById } from "@/shared/lib/repositoryHelpers.js";
import { safeSearch } from "@/shared/lib/search.js";
import {
  filterByEquality,
  filterByBoolean,
  filterByPredicate,
} from "@/shared/lib/filterHelpers.js";

/**
 * Returns every disease record.
 * Later this will be replaced by a Firestore collection read.
 * @returns {Array<object>}
 */
export function getAllDiseases() {
  return [...DISEASES];
}

/**
 * Returns a single disease by id, or null if not found.
 * @param {string} id
 * @returns {object|null}
 */
export function getDiseaseById(id) {
  return findById(DISEASES, id);
}

/**
 * Performs a simple text match against a disease's core identifying fields.
 * @param {string} query
 * @param {Array<object>} [source]
 * @returns {Array<object>}
 */
export function searchDiseases(query, source = DISEASES) {
  return safeSearch(source, query, [
    "name",
    "category",
    "overview",
    "symptoms",
  ]);
}

/**
 * Filters diseases by simple equality and boolean fields.
 * @param {{category?: string, severity?: string, contagious?: boolean}} filters
 * @param {Array<object>} [source]
 * @returns {Array<object>}
 */
export function filterDiseases(filters = {}, source = DISEASES) {
  const { category, severity, contagious } = filters;

  let result = [...source];

  result = filterByEquality(result, "category", category);
  result = filterByEquality(result, "severity", severity);
  result = filterByBoolean(result, "contagious", contagious);

  return result;
}

/**
 * Returns every disease whose recommendedMedicineIds includes the given
 * medicine id. Used to power a medicine's "Used For Diseases" section
 * without duplicating the relationship on the medicine record itself.
 * @param {string} medicineId
 * @param {Array<object>} [source]
 * @returns {Array<object>}
 */
export function getDiseasesByMedicineId(medicineId, source = DISEASES) {
  return filterByPredicate(
    source,
    (disease) =>
      Array.isArray(disease.recommendedMedicineIds) &&
      disease.recommendedMedicineIds.includes(medicineId),
  );
}

/**
 * Returns every disease whose recommendedDoctorIds includes the given
 * doctor id. Used to power a doctor's "Treats Diseases" section without
 * duplicating the relationship on the doctor record itself.
 * @param {string} doctorId
 * @param {Array<object>} [source]
 * @returns {Array<object>}
 */
export function getDiseasesByDoctorId(doctorId, source = DISEASES) {
  return filterByPredicate(
    source,
    (disease) =>
      Array.isArray(disease.recommendedDoctorIds) &&
      disease.recommendedDoctorIds.includes(doctorId),
  );
}
