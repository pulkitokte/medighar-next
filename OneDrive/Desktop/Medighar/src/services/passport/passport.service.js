import { safeSearch } from "@/shared/lib/search.js";
import { getDiseases } from "@/services/diseases/diseases.service.js";
import {
  getPassportLog,
  addPassportLogEntry,
  subscribeToPassport,
} from "@/services/passport/passport.repository.js";

export { subscribeToPassport };

/**
 * Pure aggregation logic for the Health Passport. This service owns no
 * storage beyond the action log (handled entirely by the repository) —
 * every section is built from already-resolved data supplied by the
 * caller (Medical Profile, Reminders, Medical Records, Family Profiles,
 * Appointments, Diseases). It never mutates the data it receives and
 * duplicates no other module's business logic.
 */

export const PASSPORT_ACTIONS = {
  GENERATED: "generated",
  PRINTED: "printed",
};

function splitListField(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * Computes age in years from a "YYYY-MM-DD" date of birth.
 * @param {string} dob
 * @returns {number|null}
 */
export function computeAge(dob) {
  if (!dob) return null;

  const [year, month, day] = dob.split("-").map(Number);
  if (!year || !month || !day) return null;

  const today = new Date();
  let age = today.getFullYear() - year;
  const hasHadBirthdayThisYear =
    today.getMonth() + 1 > month ||
    (today.getMonth() + 1 === month && today.getDate() >= day);

  if (!hasHadBirthdayThisYear) age -= 1;

  return age;
}

/**
 * Reuses the already-enriched reminder objects from the Reminders module
 * (each carrying a resolved `medicine`) rather than performing a separate
 * medicine lookup.
 * @param {Array<object>} reminders
 * @returns {Array<object>}
 */
export function buildCurrentMedicines(reminders = []) {
  return reminders
    .filter(
      (reminder) =>
        reminder.type === "medicine" &&
        reminder.status !== "disabled" &&
        reminder.medicine,
    )
    .map((reminder) => ({
      id: reminder.id,
      name: reminder.medicine.name,
      dosage: reminder.dosage,
      frequency: reminder.frequency,
    }));
}

/**
 * Filters Medical Records to those of type "Vaccination Record" — an
 * exact existing field, no heuristic needed.
 * @param {Array<object>} records
 * @returns {Array<object>}
 */
export function buildVaccinationSummary(records = []) {
  return records
    .filter((record) => record.type === "Vaccination Record")
    .map((record) => ({
      id: record.id,
      title: record.title,
      date: record.date,
      hospital: record.hospital,
    }));
}

/**
 * Surfaces medical records that likely represent past surgeries or
 * procedures. No dedicated "surgery" field exists anywhere in Medical
 * Records, so this reuses the existing generic safeSearch helper against
 * already-loaded records (keyword match on title/notes) rather than
 * inventing a new field or storage location. Results are clearly labeled
 * in the UI as keyword-matched, not an authoritative surgical history.
 * @param {Array<object>} records
 * @returns {Array<object>}
 */
export function buildPastSurgeries(records = []) {
  const matched = safeSearch(records, "surg", ["title", "notes"]);
  return matched.map((record) => ({
    id: record.id,
    title: record.title,
    date: record.date,
    hospital: record.hospital,
  }));
}

/**
 * Cross-references each free-text chronic condition on the Medical
 * Profile against the Diseases module, reusing the existing getDiseases
 * search rather than duplicating disease-lookup logic. Conditions with no
 * match are still returned, just without a link.
 * @param {object|null} profile
 * @returns {Array<{ name: string, diseaseId: string|null, diseaseLink: string|null }>}
 */
export function buildChronicConditions(profile) {
  return splitListField(profile?.chronicConditions).map((condition) => {
    const matches = getDiseases({ searchQuery: condition });
    const disease = matches[0] ?? null;

    return {
      name: condition,
      diseaseId: disease?.id ?? null,
      diseaseLink: disease ? `/diseases/${disease.id}` : null,
    };
  });
}

export function buildAllergies(profile) {
  return splitListField(profile?.allergies);
}

/**
 * Reuses Family Profiles data directly — no new family data model.
 * @param {Array<object>} members
 * @returns {Array<object>}
 */
export function buildFamilyHistorySummary(members = []) {
  return members
    .filter((member) => !member.isSelf)
    .map((member) => ({
      id: member.id,
      fullName: member.fullName,
      relationship: member.relationship,
      bloodGroup: member.bloodGroup,
    }));
}

/**
 * Builds the complete Health Passport from already-resolved data supplied
 * by the caller. Pure aggregation only.
 * @param {{
 *   profile: object|null,
 *   reminders: Array<object>,
 *   records: Array<object>,
 *   familyMembers: Array<object>,
 *   recentAppointment: object|null,
 * }} sources
 * @returns {object}
 */
export function buildPassportData({
  profile,
  reminders = [],
  records = [],
  familyMembers = [],
  recentAppointment,
}) {
  return {
    medicalId: {
      fullName: profile?.fullName || "",
      bloodGroup: profile?.bloodGroup || "",
      dob: profile?.dob || "",
      gender: profile?.gender || "",
      height: profile?.height || "",
      weight: profile?.weight || "",
      emergencyContactName: profile?.emergencyContactName || "",
      emergencyContactNumber: profile?.emergencyContactNumber || "",
      organDonor: profile?.organDonor || "",
      primaryDoctor: profile?.primaryDoctor || "",
      notes: profile?.notes || "",
      updatedAt: profile?.updatedAt || null,
    },
    recentAppointment,
    currentMedicines: buildCurrentMedicines(reminders),
    allergies: buildAllergies(profile),
    chronicConditions: buildChronicConditions(profile),
    pastSurgeries: buildPastSurgeries(records),
    vaccinations: buildVaccinationSummary(records),
    familyHistory: buildFamilyHistorySummary(familyMembers),
    insurance: null, // Explicit placeholder — no insurance module exists yet.
  };
}

/**
 * Logs a passport action ("generated" or "printed"). The only new
 * persisted data this feature introduces — passport content is never
 * stored here, only enough metadata to power the Timeline's and
 * Notification Center's dynamic activity.
 * @param {string} action
 * @param {string} memberLabel
 * @returns {object} the created log entry
 */
export function logPassportAction(action, memberLabel) {
  const entry = {
    id: `passport-log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    action,
    memberLabel: memberLabel || "Me",
    generatedAt: Date.now(),
  };

  addPassportLogEntry(entry);

  return entry;
}

/**
 * Returns every logged passport action entry.
 * @returns {Array<object>}
 */
export function getAllPassportLogs() {
  return getPassportLog();
}

/**
 * Triggers the browser's print dialog (also used as the "Download PDF"
 * fallback, since no PDF library exists in this project — same isolated,
 * swappable-later approach established by report.service.js).
 */
export function printPassport() {
  if (typeof window !== "undefined") {
    window.print();
  }
}
