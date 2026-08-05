import {
  CalendarPlus,
  Stethoscope,
  Pill,
  FileText,
  Bell,
  FileBarChart,
  IdCard,
} from "lucide-react";
import { getDoctorById } from "@/services/doctors/doctors.service.js";
import { getMedicineById } from "@/services/medicines/medicines.service.js";
import { getDiseaseById } from "@/services/diseases/diseases.service.js";
import { getPharmacyById } from "@/services/pharmacy/pharmacy.service.js";

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
  {
    key: "generate-report",
    label: "Generate Report",
    description: "Create a printable health report to share.",
    to: "/reports",
    icon: FileBarChart,
  },
  {
    key: "health-passport",
    label: "Health Passport",
    description: "View your complete emergency-ready health summary.",
    to: "/passport",
    icon: IdCard,
  },
];

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

/**
 * Definitions for the Dashboard "Health Setup" checklist. Each item's
 * `isComplete` function receives the same context object built from data
 * useDashboard() already fetches — no new hooks or queries.
 */
const SETUP_CHECKLIST_DEFINITIONS = [
  {
    key: "medical-profile",
    label: "Complete your Medical Profile",
    description: "Add your medical ID details for quick access in emergencies.",
    to: "/medical-profile",
    ctaLabel: "Complete Profile",
    isComplete: (ctx) => ctx.profileCompletion >= 100,
  },
  {
    key: "family",
    label: "Add a Family Member",
    description: "Track health information for the people you care for.",
    to: "/family",
    ctaLabel: "Add Family Member",
    isComplete: (ctx) => ctx.familyMembersCount > 0,
  },
  {
    key: "appointment",
    label: "Book your first Appointment",
    description: "Find a doctor and schedule a consultation.",
    to: "/doctors",
    ctaLabel: "Find a Doctor",
    isComplete: (ctx) => ctx.appointmentsCount > 0,
  },
  {
    key: "reminder",
    label: "Set a Reminder",
    description: "Never miss a medicine dose or appointment.",
    to: "/reminders",
    ctaLabel: "Set a Reminder",
    isComplete: (ctx) => ctx.remindersCount > 0,
  },
  {
    key: "record",
    label: "Add a Medical Record",
    description: "Keep prescriptions and reports in one place.",
    to: "/medical-records",
    ctaLabel: "Add a Record",
    isComplete: (ctx) => ctx.recordsCount > 0,
  },
  {
    key: "saved",
    label: "Save a Doctor or Medicine",
    description: "Bookmark items you want to find quickly later.",
    to: "/doctors",
    ctaLabel: "Browse Doctors",
    isComplete: (ctx) => ctx.savedCount > 0,
  },
];

/**
 * Builds the Health Setup checklist and its overall completion
 * percentage from data the Dashboard already has. This is the single
 * source of truth for "setup completeness" — buildSmartSuggestions()
 * below reuses it rather than recomputing the same conditions.
 * @param {{profileCompletion:number, familyMembersCount:number, appointmentsCount:number, remindersCount:number, recordsCount:number, savedCount:number}} context
 * @returns {{items: object[], progress: number}}
 */
export function buildSetupChecklist(context) {
  const items = SETUP_CHECKLIST_DEFINITIONS.map((definition) => ({
    key: definition.key,
    label: definition.label,
    description: definition.description,
    to: definition.to,
    ctaLabel: definition.ctaLabel,
    completed: definition.isComplete(context),
  }));

  const completedCount = items.filter((item) => item.completed).length;
  const progress = Math.round((completedCount / items.length) * 100);

  return { items, progress };
}

const MAX_SUGGESTIONS = 3;

/**
 * Builds lightweight Dashboard suggestion cards from the same checklist
 * items — each suggestion automatically disappears once its underlying
 * checklist item is completed, since it's simply omitted from the
 * incomplete-items list.
 * @param {{items: object[]}} checklist result from buildSetupChecklist()
 * @returns {object[]}
 */
export function buildSmartSuggestions({ items }) {
  return items
    .filter((item) => !item.completed)
    .slice(0, MAX_SUGGESTIONS)
    .map((item) => ({
      key: item.key,
      label: item.label,
      description: item.description,
      to: item.to,
      ctaLabel: item.ctaLabel,
    }));
}