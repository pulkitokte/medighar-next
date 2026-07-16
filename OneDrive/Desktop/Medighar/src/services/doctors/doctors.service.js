import {
  getAllDoctors,
  getDoctorById as repositoryGetDoctorById,
  searchDoctors as repositorySearchDoctors,
  filterDoctors as repositoryFilterDoctors,
} from "@/services/doctors/doctors.repository.js";
import { sortItems } from "@/shared/lib/sort.js";
import { isValidId } from "@/shared/lib/validation.js";

const SORT_COMPARATORS = {
  "highest-rated": (a, b) => b.rating - a.rating,
  "most-experienced": (a, b) => b.experienceYears - a.experienceYears,
  "lowest-fee": (a, b) => a.fee - b.fee,
  newest: () => 0,
};

function matchesExperience(doctor, experience) {
  if (!experience || experience === "All") return true;
  if (experience === "0-5 yrs") return doctor.experienceYears <= 5;
  if (experience === "5-10 yrs")
    return doctor.experienceYears > 5 && doctor.experienceYears <= 10;
  if (experience === "10+ yrs") return doctor.experienceYears > 10;
  return true;
}

/**
 * Returns doctors matching the given search query, filters, and sort order.
 * This is the single source of truth for doctor listing business logic.
 * @param {{
 *   searchQuery?: string,
 *   filters?: {
 *     specialty?: string,
 *     experience?: string,
 *     location?: string,
 *     gender?: string,
 *     verifiedOnly?: boolean,
 *   },
 *   sortBy?: string,
 * }} params
 * @returns {Array<object>}
 */
export function getDoctors({
  searchQuery = "",
  filters = {},
  sortBy = "newest",
} = {}) {
  let doctors = getAllDoctors();

  if (searchQuery.trim().length > 0) {
    doctors = repositorySearchDoctors(searchQuery, doctors);
  }

  doctors = repositoryFilterDoctors(
    {
      specialty: filters.specialty,
      gender: filters.gender,
      city: filters.location,
      verified: filters.verifiedOnly,
    },
    doctors,
  );

  doctors = doctors.filter((doctor) =>
    matchesExperience(doctor, filters.experience),
  );

  return sortItems(doctors, sortBy, SORT_COMPARATORS);
}

/**
 * Returns a single doctor by id.
 * @param {string} id
 * @returns {object|null}
 */
export function getDoctorById(id) {
  return repositoryGetDoctorById(id);
}

/**
 * Validates the given id and returns the matching doctor's details, or null
 * if the id is invalid or no doctor is found.
 * @param {string} id
 * @returns {object|null}
 */
export function getDoctorDetails(id) {
  if (!isValidId(id)) {
    return null;
  }

  return repositoryGetDoctorById(id);
}
