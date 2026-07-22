import {
  CalendarPlus,
  Stethoscope,
  Pill,
  FileText,
  Bell,
  FileBarChart,
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
