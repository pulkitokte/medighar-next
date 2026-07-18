import { useMemo } from "react";
import { getMedicineAvailabilityForPharmacy } from "@/services/availability/availability.service.js";

const STATUS_RANK = { "in-stock": 0, "limited-stock": 1, "out-of-stock": 2 };

/**
 * Loads mock medicine availability for a single pharmacy, sorted with
 * in-stock items first for usefulness.
 * @param {string} pharmacyId
 * @returns {{ entries: Array<object> }}
 */
export function usePharmacyAvailability(pharmacyId) {
  const entries = useMemo(() => {
    if (!pharmacyId) return [];

    return [...getMedicineAvailabilityForPharmacy(pharmacyId)].sort(
      (a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status],
    );
  }, [pharmacyId]);

  return { entries };
}
