import { useMemo, useSyncExternalStore } from "react";
import {
  getBookmarks,
  subscribeToBookmarks,
} from "@/services/bookmarks/bookmarks.service.js";
import { resolveByIds } from "@/shared/lib/serviceHelpers.js";
import { getDoctorById } from "@/services/doctors/doctors.service.js";
import { getMedicineById } from "@/services/medicines/medicines.service.js";
import { getDiseaseById } from "@/services/diseases/diseases.service.js";
import { getPharmacyById } from "@/services/pharmacy/pharmacy.service.js";

const EMPTY_SNAPSHOT = JSON.stringify({
  doctor: [],
  medicine: [],
  disease: [],
  pharmacy: [],
});

/**
 * Resolves every bookmarked id (across all four entity types) into the
 * actual saved entities, for the Saved page. Reuses each module's existing
 * getXById service function and the existing resolveByIds helper — no new
 * cross-module coupling beyond what relationship sections already do.
 * @returns {{
 *   savedDoctors: Array<object>,
 *   savedMedicines: Array<object>,
 *   savedDiseases: Array<object>,
 *   savedPharmacies: Array<object>,
 *   totalCount: number,
 * }}
 */
export function useSavedItems() {
  const snapshot = useSyncExternalStore(
    subscribeToBookmarks,
    () => JSON.stringify(getBookmarks()),
    () => EMPTY_SNAPSHOT,
  );

  const bookmarks = useMemo(() => JSON.parse(snapshot), [snapshot]);

  const savedDoctors = useMemo(
    () => resolveByIds(bookmarks.doctor, getDoctorById),
    [bookmarks.doctor],
  );
  const savedMedicines = useMemo(
    () => resolveByIds(bookmarks.medicine, getMedicineById),
    [bookmarks.medicine],
  );
  const savedDiseases = useMemo(
    () => resolveByIds(bookmarks.disease, getDiseaseById),
    [bookmarks.disease],
  );
  const savedPharmacies = useMemo(
    () => resolveByIds(bookmarks.pharmacy, getPharmacyById),
    [bookmarks.pharmacy],
  );

  const totalCount =
    savedDoctors.length +
    savedMedicines.length +
    savedDiseases.length +
    savedPharmacies.length;

  return {
    savedDoctors,
    savedMedicines,
    savedDiseases,
    savedPharmacies,
    totalCount,
  };
}
