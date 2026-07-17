import { useMemo, useSyncExternalStore } from "react";
import {
  getAllRecentEntries,
  subscribeToRecent,
} from "@/services/recent/recent.service.js";
import { resolveByIds } from "@/shared/lib/serviceHelpers.js";
import { getDoctorById } from "@/services/doctors/doctors.service.js";
import { getMedicineById } from "@/services/medicines/medicines.service.js";
import { getDiseaseById } from "@/services/diseases/diseases.service.js";
import { getPharmacyById } from "@/services/pharmacy/pharmacy.service.js";

const EMPTY_SNAPSHOT = "[]";

function idsByType(entries, type) {
  return entries
    .filter((entry) => entry.type === type)
    .map((entry) => entry.id);
}

/**
 * Resolves every recently viewed entry (across all four entity types) into
 * the actual viewed entities, newest first, for the Recent page. Mirrors
 * useSavedItems.js exactly, reusing the existing resolveByIds helper and
 * each module's existing getXById service function.
 * @returns {{
 *   recentDoctors: Array<object>,
 *   recentMedicines: Array<object>,
 *   recentDiseases: Array<object>,
 *   recentPharmacies: Array<object>,
 *   totalCount: number,
 * }}
 */
export function useRecentItems() {
  const snapshot = useSyncExternalStore(
    subscribeToRecent,
    () => JSON.stringify(getAllRecentEntries()),
    () => EMPTY_SNAPSHOT,
  );

  const entries = useMemo(() => JSON.parse(snapshot), [snapshot]);

  const recentDoctors = useMemo(
    () => resolveByIds(idsByType(entries, "doctor"), getDoctorById),
    [entries],
  );
  const recentMedicines = useMemo(
    () => resolveByIds(idsByType(entries, "medicine"), getMedicineById),
    [entries],
  );
  const recentDiseases = useMemo(
    () => resolveByIds(idsByType(entries, "disease"), getDiseaseById),
    [entries],
  );
  const recentPharmacies = useMemo(
    () => resolveByIds(idsByType(entries, "pharmacy"), getPharmacyById),
    [entries],
  );

  const totalCount =
    recentDoctors.length +
    recentMedicines.length +
    recentDiseases.length +
    recentPharmacies.length;

  return {
    recentDoctors,
    recentMedicines,
    recentDiseases,
    recentPharmacies,
    totalCount,
  };
}
