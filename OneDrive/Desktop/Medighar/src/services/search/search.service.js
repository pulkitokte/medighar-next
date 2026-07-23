import {
  Stethoscope,
  Pill,
  Activity,
  Store,
  CalendarClock,
  FileText,
  Users,
  Clock3,
  FileBarChart,
  LayoutDashboard,
  Calendar,
  Bell,
  Settings,
  Search as SearchIcon,
  Bookmark,
  History,
  GitCompare,
  IdCard,
  BarChart3,
  CalendarPlus,
} from "lucide-react";
import { safeSearch } from "@/shared/lib/search.js";
import { groupByField } from "@/shared/lib/repositoryHelpers.js";

/**
 * Pure aggregation and filtering logic for the Global Command Palette.
 * This service owns no storage of its own beyond recent searches (handled
 * entirely by search.repository.js). Every searchable entity comes from
 * already-resolved data supplied by the caller (existing services and
 * hooks) — this file never fetches data itself and duplicates no other
 * module's business logic.
 */

export const RESULTS_PER_CATEGORY = 6;

export const QUICK_ACTIONS = [
  {
    id: "action-dashboard",
    title: "Open Dashboard",
    subtitle: "View your health activity overview",
    icon: LayoutDashboard,
    category: "Quick Actions",
    route: "/dashboard",
  },
  {
    id: "action-book-appointment",
    title: "Book Appointment",
    subtitle: "Choose a doctor to book with",
    icon: CalendarPlus,
    category: "Quick Actions",
    route: "/doctors",
  },
  {
    id: "action-reports",
    title: "Open Health Reports",
    subtitle: "Generate a printable health report",
    icon: FileBarChart,
    category: "Quick Actions",
    route: "/reports",
  },
  {
    id: "action-notifications",
    title: "Open Notifications",
    subtitle: "View your notification center",
    icon: Bell,
    category: "Quick Actions",
    route: "/notifications",
  },
  {
    id: "action-timeline",
    title: "Open Health Timeline",
    subtitle: "See your health history in order",
    icon: Clock3,
    category: "Quick Actions",
    route: "/timeline",
  },
  {
    id: "action-settings",
    title: "Open Settings",
    subtitle: "Manage appearance and preferences",
    icon: Settings,
    category: "Quick Actions",
    route: "/settings",
  },
];

export const NAVIGATION_LINKS = [
  {
    id: "nav-doctors",
    title: "Doctors",
    subtitle: "Browse all doctors",
    icon: Stethoscope,
    category: "Navigation",
    route: "/doctors",
  },
  {
    id: "nav-medicines",
    title: "Medicines",
    subtitle: "Browse all medicines",
    icon: Pill,
    category: "Navigation",
    route: "/medicines",
  },
  {
    id: "nav-diseases",
    title: "Diseases",
    subtitle: "Browse all diseases",
    icon: Activity,
    category: "Navigation",
    route: "/diseases",
  },
  {
    id: "nav-pharmacy",
    title: "Pharmacies",
    subtitle: "Browse all pharmacies",
    icon: Store,
    category: "Navigation",
    route: "/pharmacy",
  },
  {
    id: "nav-saved",
    title: "Saved",
    subtitle: "Your saved items",
    icon: Bookmark,
    category: "Navigation",
    route: "/saved",
  },
  {
    id: "nav-recent",
    title: "Recently Viewed",
    subtitle: "Items you've recently viewed",
    icon: History,
    category: "Navigation",
    route: "/recent",
  },
  {
    id: "nav-compare",
    title: "Compare Medicines",
    subtitle: "Compare medicines side by side",
    icon: GitCompare,
    category: "Navigation",
    route: "/compare",
  },
  {
    id: "nav-appointments",
    title: "My Appointments",
    subtitle: "Your upcoming and past appointments",
    icon: CalendarClock,
    category: "Navigation",
    route: "/appointments",
  },
  {
    id: "nav-reminders",
    title: "Reminder Center",
    subtitle: "Manage your reminders",
    icon: Bell,
    category: "Navigation",
    route: "/reminders",
  },
  {
    id: "nav-records",
    title: "Medical Records",
    subtitle: "Your prescriptions and reports",
    icon: FileText,
    category: "Navigation",
    route: "/medical-records",
  },
  {
    id: "nav-dashboard",
    title: "Dashboard",
    subtitle: "Your health activity overview",
    icon: LayoutDashboard,
    category: "Navigation",
    route: "/dashboard",
  },
  {
    id: "nav-calendar",
    title: "Health Calendar",
    subtitle: "Appointments and reminders by date",
    icon: Calendar,
    category: "Navigation",
    route: "/calendar",
  },
  {
    id: "nav-insights",
    title: "Health Insights",
    subtitle: "Statistics and achievements",
    icon: BarChart3,
    category: "Navigation",
    route: "/insights",
  },
  {
    id: "nav-medical-profile",
    title: "Medical ID",
    subtitle: "Your emergency medical profile",
    icon: IdCard,
    category: "Navigation",
    route: "/medical-profile",
  },
  {
    id: "nav-family",
    title: "Family",
    subtitle: "Manage family health profiles",
    icon: Users,
    category: "Navigation",
    route: "/family",
  },
  {
    id: "nav-timeline",
    title: "Health Timeline",
    subtitle: "Your health history in order",
    icon: Clock3,
    category: "Navigation",
    route: "/timeline",
  },
  {
    id: "nav-notifications",
    title: "Notifications",
    subtitle: "Your notification center",
    icon: Bell,
    category: "Navigation",
    route: "/notifications",
  },
  {
    id: "nav-reports",
    title: "Health Reports",
    subtitle: "Generate a printable health report",
    icon: FileBarChart,
    category: "Navigation",
    route: "/reports",
  },
  {
    id: "nav-settings",
    title: "Settings",
    subtitle: "Appearance, accessibility, and preferences",
    icon: Settings,
    category: "Navigation",
    route: "/settings",
  },
  {
    id: "nav-search",
    title: "Search Medighar",
    subtitle: "Search doctors, medicines, diseases and more",
    icon: SearchIcon,
    category: "Navigation",
    route: "/search",
  },
];

export function buildDoctorResults(doctors = []) {
  return doctors.map((doctor) => ({
    id: `doctor-${doctor.id}`,
    title: doctor.name,
    subtitle: doctor.specialty,
    icon: Stethoscope,
    category: "Doctors",
    route: `/doctors/${doctor.id}`,
  }));
}

export function buildMedicineResults(medicines = []) {
  return medicines.map((medicine) => ({
    id: `medicine-${medicine.id}`,
    title: medicine.name,
    subtitle: medicine.brand,
    icon: Pill,
    category: "Medicines",
    route: `/medicines/${medicine.id}`,
  }));
}

export function buildDiseaseResults(diseases = []) {
  return diseases.map((disease) => ({
    id: `disease-${disease.id}`,
    title: disease.name,
    subtitle: disease.category,
    icon: Activity,
    category: "Diseases",
    route: `/diseases/${disease.id}`,
  }));
}

export function buildPharmacyResults(pharmacies = []) {
  return pharmacies.map((pharmacy) => ({
    id: `pharmacy-${pharmacy.id}`,
    title: pharmacy.name,
    subtitle: pharmacy.city,
    icon: Store,
    category: "Pharmacies",
    route: `/pharmacy/${pharmacy.id}`,
  }));
}

export function buildAppointmentResults(appointments = []) {
  return appointments.map((appointment) => ({
    id: `appointment-${appointment.id}`,
    title: `Appointment with ${appointment.doctor?.name ?? "a doctor"}`,
    subtitle: `${appointment.date} · ${appointment.timeSlot}`,
    icon: CalendarClock,
    category: "Appointments",
    route: "/appointments",
  }));
}

export function buildRecordResults(records = []) {
  return records.map((record) => ({
    id: `record-${record.id}`,
    title: record.title,
    subtitle: `${record.type} · ${record.doctorName}`,
    icon: FileText,
    category: "Medical Records",
    route: "/medical-records",
  }));
}

export function buildFamilyResults(members = []) {
  return members.map((member) => ({
    id: `family-${member.id}`,
    title: member.fullName,
    subtitle: member.relationship,
    icon: Users,
    category: "Family Members",
    route: "/family",
  }));
}

/**
 * Splits already-built timeline events into "Timeline Events" and
 * "Reports" search results. Reuses the events array as-is from
 * useHealthTimeline() rather than re-deriving report activity separately.
 * @param {Array<object>} timelineEvents
 * @returns {{ timeline: Array<object>, reports: Array<object> }}
 */
export function buildTimelineAndReportResults(timelineEvents = []) {
  const timeline = [];
  const reports = [];

  timelineEvents.forEach((event) => {
    const result = {
      id: `timeline-${event.id}`,
      title: event.title,
      subtitle: event.memberName,
      icon: event.category === "reports" ? FileBarChart : Clock3,
      category: event.category === "reports" ? "Reports" : "Timeline Events",
      route: event.link,
    };

    if (event.category === "reports") {
      reports.push(result);
    } else {
      timeline.push(result);
    }
  });

  return { timeline, reports };
}

/**
 * Builds the complete, unfiltered search index from already-resolved
 * data supplied by the caller.
 * @param {object} sources
 * @returns {Array<object>}
 */
export function buildSearchIndex(sources) {
  const { timeline, reports } = buildTimelineAndReportResults(
    sources.timelineEvents,
  );

  return [
    ...QUICK_ACTIONS,
    ...NAVIGATION_LINKS,
    ...buildDoctorResults(sources.doctors),
    ...buildMedicineResults(sources.medicines),
    ...buildDiseaseResults(sources.diseases),
    ...buildPharmacyResults(sources.pharmacies),
    ...buildAppointmentResults(sources.appointments),
    ...buildRecordResults(sources.records),
    ...buildFamilyResults(sources.familyMembers),
    ...timeline,
    ...reports,
  ];
}

/**
 * Filters the search index by query, grouped by category and capped per
 * category. Reuses the existing generic safeSearch and groupByField
 * helpers rather than reimplementing filtering/grouping.
 * @param {Array<object>} index
 * @param {string} query
 * @returns {{ groups: Record<string, Array<object>>, flat: Array<object> }}
 */
export function filterSearchResults(index, query) {
  const trimmed = query.trim();

  if (!trimmed) {
    return { groups: {}, flat: [] };
  }

  const matched = safeSearch(index, trimmed, ["title", "subtitle"]);
  const grouped = groupByField(matched, "category");

  const capped = {};
  Object.entries(grouped).forEach(([category, results]) => {
    capped[category] = results.slice(0, RESULTS_PER_CATEGORY);
  });

  const flat = Object.values(capped).flat();

  return { groups: capped, flat };
}
