import { DOCTORS } from "@/data/doctors/doctors.js";
import { safeSearch } from "@/shared/lib/repositoryHelpers.js";

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
  return DOCTORS.find((doctor) => doctor.id === id) ?? null;
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

  return source.filter((doctor) => {
    if (specialty && specialty !== "All" && doctor.specialty !== specialty)
      return false;
    if (
      gender &&
      gender !== "All" &&
      doctor.gender.toLowerCase() !== gender.toLowerCase()
    ) {
      return false;
    }
    if (city && city !== "All" && doctor.city !== city) return false;
    if (verified && doctor.verified !== true) return false;

    return true;
  });
}
