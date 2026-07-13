import { DOCTORS } from "@/data/doctors/doctors.js";
import { safeSearch, findById } from "@/shared/lib/repositoryHelpers.js";
import {
  filterByEquality,
  filterByBoolean,
} from "@/shared/lib/filterHelpers.js";

/**
 * Returns every doctor record.
 * Later this will be replaced by a Firestore collection read.
 * @returns {Array<object>}
 */
export function getAllDoctors() {
  return [...DOCTORS];
}

/**
 * Returns a single doctor by id, or null if not found.
 * @param {string} id
 * @returns {object|null}
 */
export function getDoctorById(id) {
  return findById(DOCTORS, id);
}

/**
 * Performs a simple text match against a doctor's core identifying fields.
 * @param {string} query
 * @param {Array<object>} [source]
 * @returns {Array<object>}
 */
export function searchDoctors(query, source = DOCTORS) {
  return safeSearch(source, query, [
    "name",
    "specialty",
    "qualification",
    "city",
  ]);
}

/**
 * Filters doctors by simple equality fields.
 * @param {{specialty?: string, gender?: string, city?: string, verified?: boolean}} filters
 * @param {Array<object>} [source]
 * @returns {Array<object>}
 */
export function filterDoctors(filters = {}, source = DOCTORS) {
  const { specialty, gender, city, verified } = filters;

  let result = [...source];

  result = filterByEquality(result, "specialty", specialty);
  result = filterByEquality(result, "gender", gender, {
    transform: (value) => value?.toLowerCase(),
  });
  result = filterByEquality(result, "city", city);
  result = filterByBoolean(result, "verified", verified);

  return result;
}
