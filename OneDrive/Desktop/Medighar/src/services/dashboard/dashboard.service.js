import { CalendarPlus, Stethoscope, Pill, FileText, Bell } from "lucide-react";
import { getDoctorById } from "@/services/doctors/doctors.service.js";
import { getMedicineById } from "@/services/medicines/medicines.service.js";
import { getDiseaseById } from "@/services/diseases/diseases.service.js";
import { getPharmacyById } from "@/services/pharmacy/pharmacy.service.js";

/**
 * Pure aggregation logic for the Personal Health Dashboard. This service
 * owns no storage of its own — every value it works with is read from the
 * existing Saved, Recently Viewed, Appointments, Reminders, Medical
 * Records, and Reviews services. Its only job is to combine and normalize
 * that data for display.
 */

const ENTITY_RESOLVERS = {
  doctor: getDoctorById,
  medicine: getMedicineById,
  disease: getDiseaseById,
  pharmacy: getPharmacyById,
};

const ENTITY_ROUTES = {
  doctor: (id) => `/doctors/${id}`,
  medicine: (id) => `/medicines/${id}`,
  disease: (id) => `/diseases/${id}`,
  pharmacy: (id) => `/pharmacy/${id}`,
};

export const QUICK_ACTIONS = [
  {
    key: "book-appointment",
    label: "Book Appointment",
    description: "Find a doctor and schedule a visit.",
    to: "/doctors",
    icon: CalendarPlus,
  },
  {
    key: "browse-doctors",
    label: "Browse Doctors",
    description: "Explore doctors across specialties.",
    to: "/doctors",
    icon: Stethoscope,
  },
  {
    key: "browse-medicines",
    label: "Browse Medicines",
    description: "Search medicines and their details.",
    to: "/medicines",
    icon: Pill,
  },
  {
    key: "medical-records",
    label: "Medical Records",
    description: "View and manage your health records.",
    to: "/medical-records",
    icon: FileText,
  },
  {
    key: "reminder-center",
    label: "Reminder Center",
    description: "Manage your medicine and appointment reminders.",
    to: "/reminders",
    icon: Bell,
  },
];

/**
 * Resolves raw recently-viewed entries ({type, id, viewedAt}) into their
 * actual entities, dropping any whose entity no longer exists. Reuses each
 * module's existing getXById function; introduces no new data access.
 * @param {Array<{type: string, id: string, viewedAt: number}>} entries
 * @param {number} [limit]
 * @returns {Array<{type: string, id: string, viewedAt: number, entity: object, to: string}>}
 */
export function resolveRecentEntries(entries = [], limit = 5) {
  return entries
    .map((entry) => {
      const resolver = ENTITY_RESOLVERS[entry.type];
      const entity = resolver ? resolver(entry.id) : null;

      if (!entity) return null;

      return {
        ...entry,
        entity,
        to: ENTITY_ROUTES[entry.type](entry.id),
      };
    })
    .filter(Boolean)
    .slice(0, limit);
}

/**
 * Builds a unified, newest-first activity timeline from already-resolved
 * data supplied by the caller (appointments, reminders, records, resolved
 * recent-view entries, and flattened reviews). Purely a normalize + sort
 * operation; no data is fetched or stored here.
 * @param {{
 *   appointments?: Array<object>,
 *   reminders?: Array<object>,
 *   records?: Array<object>,
 *   recentEntries?: Array<object>,
 *   reviews?: Array<object>,
 * }} sources
 * @param {number} [limit]
 * @returns {Array<{ id: string, type: string, message: string, timestamp: number, to: string }>}
 */
export function buildActivityTimeline(
  {
    appointments = [],
    reminders = [],
    records = [],
    recentEntries = [],
    reviews = [],
  },
  limit = 15,
) {
  const events = [];

  appointments.forEach((appointment) => {
    events.push({
      id: `appointment-${appointment.id}`,
      type: "appointment",
      message: `Appointment booked with ${appointment.doctor?.name ?? "a doctor"}`,
      timestamp: appointment.createdAt,
      to: "/appointments",
    });
  });

  reminders.forEach((reminder) => {
    const message =
      reminder.type === "medicine"
        ? `Medicine reminder created for ${reminder.medicine?.name ?? "a medicine"}`
        : `Appointment reminder created for ${reminder.appointment?.doctor?.name ?? "an appointment"}`;

    events.push({
      id: `reminder-${reminder.id}`,
      type: "reminder",
      message,
      timestamp: reminder.createdAt,
      to: "/reminders",
    });
  });

  records.forEach((record) => {
    events.push({
      id: `record-${record.id}`,
      type: "record",
      message: `Medical record added: ${record.title}`,
      timestamp: record.createdAt,
      to: "/medical-records",
    });
  });

  recentEntries.forEach((entry) => {
    events.push({
      id: `recent-${entry.type}-${entry.id}`,
      type: "recent",
      message: `Viewed ${entry.entity?.name ?? "an item"}`,
      timestamp: entry.viewedAt,
      to: entry.to,
    });
  });

  reviews.forEach((review) => {
    events.push({
      id: `review-${review.id}`,
      type: "review",
      message: `Review added for ${review.doctor?.name ?? "a doctor"}`,
      timestamp: review.createdAt,
      to: review.doctorId ? `/doctors/${review.doctorId}` : "/doctors",
    });
  });

  return events
    .filter((event) => Number.isFinite(event.timestamp))
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}
