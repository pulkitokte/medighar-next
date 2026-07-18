import { getAvailabilityEntry } from "@/services/availability/availability.repository.js";
import { PHARMACIES } from "@/data/pharmacy/pharmacies.js";
import { MEDICINES } from "@/data/medicines/medicines.js";
import { sortItems } from "@/shared/lib/sort.js";

export const STATUS_LABELS = {
  "in-stock": "In Stock",
  "limited-stock": "Limited Stock",
  "out-of-stock": "Out of Stock",
};

const SORT_COMPARATORS = {
  nearest: (a, b) => a.distanceKm - b.distanceKm,
  "highest-stock": (a, b) => b.stockLevel - a.stockLevel,
};

/**
 * Returns every pharmacy's mock availability for the given medicine.
 * @param {string} medicineId
 * @returns {Array<{ pharmacy: object, status: string, stockLevel: number, distanceKm: number }>}
 */
export function getPharmacyAvailabilityForMedicine(medicineId) {
  return PHARMACIES.map((pharmacy) => ({
    pharmacy,
    ...getAvailabilityEntry(medicineId, pharmacy.id),
  }));
}

/**
 * Returns every medicine's mock availability at the given pharmacy.
 * @param {string} pharmacyId
 * @returns {Array<{ medicine: object, status: string, stockLevel: number }>}
 */
export function getMedicineAvailabilityForPharmacy(pharmacyId) {
  return MEDICINES.map((medicine) => {
    const { status, stockLevel } = getAvailabilityEntry(
      medicine.id,
      pharmacyId,
    );
    return { medicine, status, stockLevel };
  });
}

/**
 * Filters an availability list to in-stock entries only, when requested.
 * @param {Array<{ status: string }>} entries
 * @param {boolean} inStockOnly
 * @returns {Array<object>}
 */
export function filterInStockOnly(entries, inStockOnly) {
  if (!inStockOnly) return [...entries];
  return entries.filter((entry) => entry.status === "in-stock");
}

/**
 * Sorts a pharmacy-availability list by "nearest" or "highest-stock".
 * @param {Array<object>} entries
 * @param {"nearest"|"highest-stock"} sortBy
 * @returns {Array<object>}
 */
export function sortAvailability(entries, sortBy) {
  return sortItems(entries, sortBy, SORT_COMPARATORS);
}
