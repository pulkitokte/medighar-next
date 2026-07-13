import {
  getAllDiseases,
  getDiseaseById as repositoryGetDiseaseById,
  searchDiseases as repositorySearchDiseases,
  filterDiseases as repositoryFilterDiseases,
  getDiseasesByMedicineId as repositoryGetDiseasesByMedicineId,
  getDiseasesByDoctorId as repositoryGetDiseasesByDoctorId,
} from "@/services/diseases/diseases.repository.js";
import { applySorting } from "@/shared/lib/serviceHelpers.js";

const SEVERITY_RANK = { Mild: 0, Moderate: 1, Severe: 2 };

const SORT_COMPARATORS = {
  newest: () => 0,
  "name-asc": (a, b) => a.name.localeCompare(b.name),
  "name-desc": (a, b) => b.name.localeCompare(a.name),
  severity: (a, b) =>
    (SEVERITY_RANK[a.severity] ?? 0) - (SEVERITY_RANK[b.severity] ?? 0) ||
    a.name.localeCompare(b.name),
};

/**
 * Returns diseases matching the given search query, filters, and sort
 * order. This is the single source of truth for disease listing business
 * logic.
 * @param {{
 *   searchQuery?: string,
 *   filters?: {
 *     category?: string,
 *     severity?: string,
 *     contagiousOnly?: boolean,
 *   },
 *   sortBy?: string,
 * }} params
 * @returns {Array<object>}
 */
export function getDiseases({
  searchQuery = "",
  filters = {},
  sortBy = "newest",
} = {}) {
  let diseases = getAllDiseases();

  if (searchQuery.trim().length > 0) {
    diseases = repositorySearchDiseases(searchQuery, diseases);
  }

  diseases = repositoryFilterDiseases(
    {
      category: filters.category,
      severity: filters.severity,
      contagious: filters.contagiousOnly,
    },
    diseases,
  );

  return applySorting(diseases, sortBy, SORT_COMPARATORS, {
    defaultSort: "newest",
  });
}

/**
 * Returns a single disease by id.
 * @param {string} id
 * @returns {object|null}
 */
export function getDiseaseById(id) {
  return repositoryGetDiseaseById(id);
}

/**
 * Validates the given id and returns the matching disease's details, or
 * null if the id is invalid or no disease is found.
 * @param {string} id
 * @returns {object|null}
 */
export function getDiseaseDetails(id) {
  if (typeof id !== "string" || id.trim().length === 0) {
    return null;
  }

  return repositoryGetDiseaseById(id);
}

/**
 * Returns every disease that recommends the given medicine. Powers the
 * Medicines module's "Used For Diseases" section without Medicines owning
 * any part of this relationship.
 * @param {string} medicineId
 * @returns {Array<object>}
 */
export function getDiseasesUsingMedicine(medicineId) {
  return repositoryGetDiseasesByMedicineId(medicineId);
}

/**
 * Returns every disease that recommends the given doctor. Powers the
 * Doctors module's "Treats Diseases" section without Doctors owning any
 * part of this relationship.
 * @param {string} doctorId
 * @returns {Array<object>}
 */
export function getDiseasesTreatedByDoctor(doctorId) {
  return repositoryGetDiseasesByDoctorId(doctorId);
}
