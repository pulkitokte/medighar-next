import {
  getAllMedicines,
  getMedicineById as repositoryGetMedicineById,
  searchMedicines as repositorySearchMedicines,
  filterMedicines as repositoryFilterMedicines,
} from "@/services/medicines/medicines.repository.js";
import { sortItems } from "@/shared/lib/sort.js";
import { isValidId } from "@/shared/lib/validation.js";

const SORT_COMPARATORS = {
  newest: () => 0,
  "name-asc": (a, b) => a.name.localeCompare(b.name),
  "name-desc": (a, b) => b.name.localeCompare(a.name),
  category: (a, b) =>
    a.category.localeCompare(b.category) || a.name.localeCompare(b.name),
};

/**
 * Returns medicines matching the given search query, filters, and sort
 * order. This is the single source of truth for medicine listing business
 * logic.
 * @param {{
 *   searchQuery?: string,
 *   filters?: {
 *     category?: string,
 *     dosageForm?: string,
 *     prescriptionOnly?: boolean,
 *   },
 *   sortBy?: string,
 * }} params
 * @returns {Array<object>}
 */
export function getMedicines({
  searchQuery = "",
  filters = {},
  sortBy = "newest",
} = {}) {
  let medicines = getAllMedicines();

  if (searchQuery.trim().length > 0) {
    medicines = repositorySearchMedicines(searchQuery, medicines);
  }

  medicines = repositoryFilterMedicines(
    {
      category: filters.category,
      dosageForm: filters.dosageForm,
      prescriptionOnly: filters.prescriptionOnly,
    },
    medicines,
  );

  return sortItems(medicines, sortBy, SORT_COMPARATORS);
}

/**
 * Returns a single medicine by id.
 * @param {string} id
 * @returns {object|null}
 */
export function getMedicineById(id) {
  return repositoryGetMedicineById(id);
}

/**
 * Validates the given id and returns the matching medicine's details, or
 * null if the id is invalid or no medicine is found.
 * @param {string} id
 * @returns {object|null}
 */
export function getMedicineDetails(id) {
  if (!isValidId(id)) {
    return null;
  }

  return repositoryGetMedicineById(id);
}
