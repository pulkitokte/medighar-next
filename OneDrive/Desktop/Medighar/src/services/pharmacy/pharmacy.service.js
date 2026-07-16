import {
  getAllPharmacies,
  getPharmacyById as repositoryGetPharmacyById,
  searchPharmacies as repositorySearchPharmacies,
  filterPharmacies as repositoryFilterPharmacies,
} from "@/services/pharmacy/pharmacy.repository.js";
import { sortItems } from "@/shared/lib/sort.js";

const SORT_COMPARATORS = {
  newest: () => 0,
  "highest-rated": (a, b) => b.rating - a.rating,
  "name-asc": (a, b) => a.name.localeCompare(b.name),
  "name-desc": (a, b) => b.name.localeCompare(a.name),
};

/**
 * Returns pharmacies matching the given search query, filters, and sort
 * order. This is the single source of truth for pharmacy listing business
 * logic.
 * @param {{
 *   searchQuery?: string,
 *   filters?: {
 *     type?: string,
 *     city?: string,
 *     homeDeliveryOnly?: boolean,
 *   },
 *   sortBy?: string,
 * }} params
 * @returns {Array<object>}
 */
export function getPharmacies({
  searchQuery = "",
  filters = {},
  sortBy = "newest",
} = {}) {
  let pharmacies = getAllPharmacies();

  if (searchQuery.trim().length > 0) {
    pharmacies = repositorySearchPharmacies(searchQuery, pharmacies);
  }

  pharmacies = repositoryFilterPharmacies(
    {
      type: filters.type,
      city: filters.city,
      homeDelivery: filters.homeDeliveryOnly,
    },
    pharmacies,
  );

  return sortItems(pharmacies, sortBy, SORT_COMPARATORS);
}

/**
 * Returns a single pharmacy by id.
 * @param {string} id
 * @returns {object|null}
 */
export function getPharmacyById(id) {
  return repositoryGetPharmacyById(id);
}

/**
 * Validates the given id and returns the matching pharmacy's details, or
 * null if the id is invalid or no pharmacy is found.
 * @param {string} id
 * @returns {object|null}
 */
export function getPharmacyDetails(id) {
  if (typeof id !== "string" || id.trim().length === 0) {
    return null;
  }

  return repositoryGetPharmacyById(id);
}
