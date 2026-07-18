import { useMemo, useState } from "react";
import {
  getPharmacyAvailabilityForMedicine,
  filterInStockOnly,
  sortAvailability,
} from "@/services/availability/availability.service.js";

/**
 * Loads and derives pharmacy availability for a single medicine, with
 * local (non-URL-synced) filter and sort state — this is a Details-page
 * subsection, not a standalone listing page, so it doesn't need the
 * URL-sync pattern used by the main listing pages.
 * @param {string} medicineId
 * @returns {{
 *   entries: Array<object>,
 *   inStockOnly: boolean,
 *   setInStockOnly: Function,
 *   sortBy: string,
 *   setSortBy: Function,
 * }}
 */
export function useMedicineAvailability(medicineId) {
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("nearest");

  const allEntries = useMemo(
    () => (medicineId ? getPharmacyAvailabilityForMedicine(medicineId) : []),
    [medicineId],
  );

  const entries = useMemo(() => {
    const filtered = filterInStockOnly(allEntries, inStockOnly);
    return sortAvailability(filtered, sortBy);
  }, [allEntries, inStockOnly, sortBy]);

  return { entries, inStockOnly, setInStockOnly, sortBy, setSortBy };
}
