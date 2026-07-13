import { DISEASES } from "@/data/diseases/diseases.js";
import { safeSearch, findById } from "@/shared/lib/repositoryHelpers.js";
import {
  filterByEquality,
  filterByBoolean,
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
  return safeSearch(
    source,
    query,
    ["name", "category", "overview", "symptoms"],
    {
      transform: (item, field) =>
        field === "symptoms" ? item.symptoms.join(" ") : item[field],
    },
  );
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
