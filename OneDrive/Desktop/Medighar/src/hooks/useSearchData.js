import { useMemo, useSyncExternalStore } from "react";
import { useAppointments } from "@/hooks/useAppointments.js";
import { useMedicalRecords } from "@/hooks/useMedicalRecords.js";
import { useFamilyProfiles } from "@/hooks/useFamilyProfiles.js";
import { useHealthTimeline } from "@/hooks/useHealthTimeline.js";
import { useSavedItems } from "@/hooks/useSavedItems.js";
import { getDoctors } from "@/services/doctors/doctors.service.js";
import { getMedicines } from "@/services/medicines/medicines.service.js";
import { getDiseases } from "@/services/diseases/diseases.service.js";
import { getPharmacies } from "@/services/pharmacy/pharmacy.service.js";
import {
  getAllRecentEntries,
  subscribeToRecent,
} from "@/services/recent/recent.service.js";
import { resolveRecentEntries } from "@/services/dashboard/dashboard.service.js";
import {
  buildSearchIndex,
  buildBoostedIds,
} from "@/services/search/search.service.js";

const EMPTY_SNAPSHOT = "[]";
const RECENT_RESOLVE_LIMIT = 8;

/**
 * The single shared data-gathering layer behind every search surface in
 * the app (Command Palette, Site Search, and any future search feature).
 * Builds the real, unfiltered search index and the recency/saved boost
 * sets from already-existing services and hooks — no data is fetched or
 * duplicated here beyond what those modules already own. Extracted so
 * that adding a new search surface never means re-implementing this
 * assembly step.
 *
 * Uses allRecords (the complete medical-record dataset) rather than
 * filteredRecords, since search must be able to find any record
 * regardless of whatever search/filter/sort state a separate
 * useMedicalRecords() instance on the Medical Records page happens to be
 * in — see useMedicalRecords.js for the full allRecords/filteredRecords
 * contract.
 * @returns {{
 *   searchIndex: Array<object>,
 *   boostedIds: { recentIds: Set<string>, savedIds: Set<string> },
 *   recentEntries: Array<object>,
 *   saved: object,
 * }}
 */
export function useSearchData() {
  // Static entity lists: fetched once via existing services, memoized for
  // the lifetime of the consuming component.
  const doctors = useMemo(() => getDoctors(), []);
  const medicines = useMemo(() => getMedicines(), []);
  const diseases = useMemo(() => getDiseases(), []);
  const pharmacies = useMemo(() => getPharmacies(), []);

  // Dynamic per-user data: reused directly from existing hooks.
  const { upcoming: upcomingAppointments, past: pastAppointments } =
    useAppointments();
  const { allRecords } = useMedicalRecords();
  const { members: familyMembers } = useFamilyProfiles();
  const { events: timelineEvents } = useHealthTimeline();
  const saved = useSavedItems();

  const allAppointments = useMemo(
    () => [...upcomingAppointments, ...pastAppointments],
    [upcomingAppointments, pastAppointments],
  );

  // Recently viewed entities: reused via the existing recent.service.js
  // store and the existing resolveRecentEntries resolver already used by
  // useDashboard.js, rather than re-implementing entity resolution here.
  const recentSnapshot = useSyncExternalStore(
    subscribeToRecent,
    () => JSON.stringify(getAllRecentEntries()),
    () => EMPTY_SNAPSHOT,
  );
  const recentEntriesRaw = useMemo(
    () => JSON.parse(recentSnapshot),
    [recentSnapshot],
  );
  const recentEntries = useMemo(
    () => resolveRecentEntries(recentEntriesRaw, RECENT_RESOLVE_LIMIT),
    [recentEntriesRaw],
  );

  const searchIndex = useMemo(
    () =>
      buildSearchIndex({
        doctors,
        medicines,
        diseases,
        pharmacies,
        appointments: allAppointments,
        records: allRecords,
        familyMembers,
        timelineEvents,
      }),
    [
      doctors,
      medicines,
      diseases,
      pharmacies,
      allAppointments,
      allRecords,
      familyMembers,
      timelineEvents,
    ],
  );

  const boostedIds = useMemo(
    () =>
      buildBoostedIds({
        recentEntries,
        savedDoctors: saved.savedDoctors,
        savedMedicines: saved.savedMedicines,
        savedDiseases: saved.savedDiseases,
        savedPharmacies: saved.savedPharmacies,
      }),
    [
      recentEntries,
      saved.savedDoctors,
      saved.savedMedicines,
      saved.savedDiseases,
      saved.savedPharmacies,
    ],
  );

  return { searchIndex, boostedIds, recentEntries, saved };
}
