import { DOCTORS } from "@/data/doctors/doctors.js";

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
  const normalizedQuery = query?.trim().toLowerCase();

  if (!normalizedQuery) return [...source];

  return source.filter((doctor) => {
    const haystack = [
      doctor.name,
      doctor.specialty,
      doctor.qualification,
      doctor.city,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
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
