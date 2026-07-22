import { filterByMember } from "@/services/timeline/timeline.service.js";
import {
  getReportLog,
  addReportLogEntry,
  subscribeToReports,
} from "@/services/reports/reports.repository.js";

export { subscribeToReports };

/**
 * Pure aggregation logic for the Health Report Generator. This service
 * owns no storage beyond the report-generation log (handled entirely by
 * the repository) — every report's content is built from already-resolved
 * data supplied by the caller (Appointments, Reminders, Medical Records,
 * Family Profiles, Medical Profile, Health Insights, Health Timeline). It
 * never mutates the data it receives and duplicates no other module's
 * business logic — it reuses filterByMember from timeline.service.js
 * rather than reimplementing member filtering.
 */

export const REPORT_TYPES = {
  COMPLETE_SUMMARY: "complete-summary",
  MEDICAL_RECORDS: "medical-records",
  APPOINTMENT_HISTORY: "appointment-history",
  MEDICINE_REMINDERS: "medicine-reminders",
  FAMILY_SUMMARY: "family-summary",
};

export const REPORT_TYPE_META = {
  [REPORT_TYPES.COMPLETE_SUMMARY]: {
    label: "Complete Health Summary",
    description:
      "A full overview of medical ID, family, appointments, reminders, records, and insights.",
    sections: [
      "medicalId",
      "family",
      "appointments",
      "reminders",
      "records",
      "activity",
      "achievements",
      "insights",
    ],
  },
  [REPORT_TYPES.MEDICAL_RECORDS]: {
    label: "Medical Records Report",
    description: "All medical records within the selected range.",
    sections: ["records"],
  },
  [REPORT_TYPES.APPOINTMENT_HISTORY]: {
    label: "Appointment History Report",
    description: "Appointment history within the selected range.",
    sections: ["appointments"],
  },
  [REPORT_TYPES.MEDICINE_REMINDERS]: {
    label: "Medicine & Reminder Report",
    description:
      "Medicine and appointment reminders within the selected range.",
    sections: ["reminders"],
  },
  [REPORT_TYPES.FAMILY_SUMMARY]: {
    label: "Family Health Summary",
    description: "Medical ID and health overview for each family member.",
    sections: ["medicalId", "family"],
  },
};

function toDayKey(value) {
  if (!value) return "";
  return typeof value === "number"
    ? new Date(value).toISOString().slice(0, 10)
    : String(value).slice(0, 10);
}

function isWithinDateRange(value, from, to) {
  const key = toDayKey(value);
  if (!key) return false;
  if (from && key < from) return false;
  if (to && key > to) return false;
  return true;
}

function filterAppointmentsByDateRange(appointments, from, to) {
  if (!from && !to) return appointments;
  return appointments.filter((appointment) =>
    isWithinDateRange(appointment.date, from, to),
  );
}

function filterRemindersByDateRange(reminders, from, to) {
  if (!from && !to) return reminders;
  return reminders.filter((reminder) =>
    isWithinDateRange(
      reminder.type === "medicine" ? reminder.startDate : reminder.createdAt,
      from,
      to,
    ),
  );
}

function filterRecordsByDateRange(records, from, to) {
  if (!from && !to) return records;
  return records.filter((record) => isWithinDateRange(record.date, from, to));
}

/**
 * Builds a normalized report object from already-resolved data supplied by
 * the caller. Pure aggregation only — filters (member, date range) reuse
 * the existing filterByMember helper rather than duplicating it.
 * @param {{
 *   type: string,
 *   memberFilter?: string,
 *   dateRange?: { from?: string, to?: string },
 *   sources: object,
 * }} params
 * @returns {object}
 */
export function buildReportData({
  type,
  memberFilter = "all",
  dateRange = {},
  sources,
}) {
  const { from, to } = dateRange;

  const appointments = filterAppointmentsByDateRange(
    filterByMember(sources.appointments ?? [], memberFilter),
    from,
    to,
  );
  const reminders = filterRemindersByDateRange(
    filterByMember(sources.reminders ?? [], memberFilter),
    from,
    to,
  );
  const records = filterRecordsByDateRange(
    filterByMember(sources.records ?? [], memberFilter),
    from,
    to,
  );

  const familyMembers = (sources.familyMembers ?? []).filter(
    (member) => memberFilter === "all" || member.id === memberFilter,
  );

  const medicalId = (sources.memberProfiles ?? []).filter(
    (entry) => memberFilter === "all" || entry.id === memberFilter,
  );

  const recentActivity = (sources.recentEvents ?? [])
    .filter(
      (event) => memberFilter === "all" || event.memberId === memberFilter,
    )
    .slice(0, 10);

  return {
    id: `report-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    generatedAt: Date.now(),
    memberFilter,
    dateRange: { from: from || null, to: to || null },
    appointments,
    reminders,
    records,
    familyMembers,
    medicalId,
    recentActivity,
    achievements: sources.achievements ?? [],
    insightsSummary: sources.insightsSummary ?? [],
  };
}

/**
 * Logs that a report was generated. The only new persisted data this
 * feature introduces — report content is never stored here, only enough
 * metadata to power the Timeline's and Notification Center's dynamic
 * "Health Report Generated" activity.
 * @param {{ type: string, typeLabel: string, memberFilter: string, memberLabel: string }} params
 * @returns {object} the created log entry
 */
export function logGeneratedReport({
  type,
  typeLabel,
  memberFilter,
  memberLabel,
}) {
  const entry = {
    id: `report-log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    typeLabel,
    memberId: memberFilter,
    memberLabel: memberLabel || "All Members",
    generatedAt: Date.now(),
  };

  addReportLogEntry(entry);

  return entry;
}

/**
 * Returns every logged report-generation entry.
 * @returns {Array<object>}
 */
export function getAllReportLogs() {
  return getReportLog();
}

/**
 * Triggers the browser's print dialog, scoped via page-level print CSS to
 * the report preview element. No PDF library (e.g. jsPDF) is currently
 * installed in this project, so this function is intentionally isolated
 * as the single point that would be swapped for real PDF generation
 * later — nothing outside this function needs to change when that
 * happens.
 */
export function exportReportAsPdf() {
  if (typeof window !== "undefined") {
    window.print();
  }
}
