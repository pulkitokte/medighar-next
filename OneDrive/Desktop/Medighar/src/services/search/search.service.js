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
  BookUser,
} from "lucide-react";
import { safeSearch } from "@/shared/lib/search.js";
import { groupByField } from "@/shared/lib/repositoryHelpers.js";

/**
 * Pure aggregation, filtering, ranking, and suggestion logic for the
 * Global Command Palette. This service owns no storage of its own beyond
 * recent searches (handled entirely by search.repository.js). Every
 * searchable entity comes from already-resolved data supplied by the
 * caller (existing services and hooks) — this file never fetches data
 * itself and duplicates no other module's business logic.
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
    id: "nav-passport",
    title: "Health Passport",
    subtitle: "Your complete emergency-ready health summary",
    icon: BookUser,
    category: "Navigation",
    route: "/passport",
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

const BROWSE_SUGGESTION_IDS = [
  "nav-doctors",
  "nav-medicines",
  "nav-diseases",
  "nav-pharmacy",
  "nav-dashboard",
];

/**
 * Static "browse instead" suggestions shown when a search returns zero
 * results. Filtered directly from NAVIGATION_LINKS — no new route data.
 */
export const BROWSE_SUGGESTIONS = NAVIGATION_LINKS.filter((link) =>
  BROWSE_SUGGESTION_IDS.includes(link.id),
);

const RECENT_ENTRY_ICONS = {
  doctor: Stethoscope,
  medicine: Pill,
  disease: Activity,
  pharmacy: Store,
};

const SUGGESTED_RECENT_LIMIT = 4;
const SUGGESTED_SAVED_LIMIT = 3;

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
 * Ranks a matched result by how strongly it matches the query: exact
 * title match first, then title-prefix, then subtitle-prefix, then any
 * title substring, then anything else matched by safeSearch (e.g. a
 * subtitle substring). Lower is better.
 * @param {object} item
 * @param {string} normalizedQuery already-lowercased, trimmed query
 * @returns {number}
 */
function computeMatchRank(item, normalizedQuery) {
  const title = (item.title || "").toLowerCase();
  const subtitle = (item.subtitle || "").toLowerCase();

  if (title === normalizedQuery) return 0;
  if (title.startsWith(normalizedQuery)) return 1;
  if (subtitle.startsWith(normalizedQuery)) return 2;
  if (title.includes(normalizedQuery)) return 3;
  return 4;
}

/**
 * Builds the id sets used to give already-relevant results a small
 * ranking boost. Reuses the same `${type}-${id}` scheme the result
 * builders above already use, from data already resolved elsewhere
 * (recent entries, saved items) — no new tracking is introduced.
 * @param {{
 *   recentEntries?: Array<{type: string, id: string|number}>,
 *   savedDoctors?: Array<{id: string|number}>,
 *   savedMedicines?: Array<{id: string|number}>,
 *   savedDiseases?: Array<{id: string|number}>,
 *   savedPharmacies?: Array<{id: string|number}>,
 * }} sources
 * @returns {{ recentIds: Set<string>, savedIds: Set<string> }}
 */
export function buildBoostedIds({
  recentEntries = [],
  savedDoctors = [],
  savedMedicines = [],
  savedDiseases = [],
  savedPharmacies = [],
} = {}) {
  const recentIds = new Set(
    recentEntries.map((entry) => `${entry.type}-${entry.id}`),
  );

  const savedIds = new Set([
    ...savedDoctors.map((doctor) => `doctor-${doctor.id}`),
    ...savedMedicines.map((medicine) => `medicine-${medicine.id}`),
    ...savedDiseases.map((disease) => `disease-${disease.id}`),
    ...savedPharmacies.map((pharmacy) => `pharmacy-${pharmacy.id}`),
  ]);

  return { recentIds, savedIds };
}

/**
 * Filters the search index by query, ranks matches (match quality first,
 * then a small boost for recently-viewed/saved items), groups by
 * category, and caps per category. Reuses the existing generic safeSearch
 * and groupByField helpers rather than reimplementing filtering/grouping.
 * @param {Array<object>} index
 * @param {string} query
 * @param {{ recentIds: Set<string>, savedIds: Set<string> }} [boostedIds]
 * @returns {{ groups: Record<string, Array<object>>, flat: Array<object> }}
 */
export function filterSearchResults(
  index,
  query,
  boostedIds = { recentIds: new Set(), savedIds: new Set() },
) {
  const trimmed = query.trim();

  if (!trimmed) {
    return { groups: {}, flat: [] };
  }

  const normalizedQuery = trimmed.toLowerCase();
  const matched = safeSearch(index, trimmed, ["title", "subtitle"]);

  const scored = matched.map((item) => {
    const rank = computeMatchRank(item, normalizedQuery);
    const recentBoost = boostedIds.recentIds.has(item.id) ? 2 : 0;
    const savedBoost = boostedIds.savedIds.has(item.id) ? 1 : 0;
    return { item, score: rank * 10 - recentBoost - savedBoost };
  });

  scored.sort((a, b) => a.score - b.score);
  const ranked = scored.map((entry) => entry.item);

  const grouped = groupByField(ranked, "category");

  const capped = {};
  Object.entries(grouped).forEach(([category, results]) => {
    capped[category] = results.slice(0, RESULTS_PER_CATEGORY);
  });

  const flat = Object.values(capped).flat();

  return { groups: capped, flat };
}

/**
 * Builds the empty-query suggestion sections: Recently Viewed items and
 * Saved Doctors/Medicines, from data already resolved by existing hooks
 * (useRecent / useSavedItems). Returns a flat array; the caller groups it
 * by `category` for rendering, same as filterSearchResults's output.
 * @param {{
 *   recentEntries?: Array<{type: string, id: string|number, entity?: object, to?: string}>,
 *   savedDoctors?: Array<object>,
 *   savedMedicines?: Array<object>,
 * }} sources
 * @returns {Array<object>}
 */
export function buildSuggestedResults({
  recentEntries = [],
  savedDoctors = [],
  savedMedicines = [],
} = {}) {
  const recentlyViewed = recentEntries
    .slice(0, SUGGESTED_RECENT_LIMIT)
    .filter((entry) => Boolean(entry.entity?.name))
    .map((entry) => ({
      id: `suggested-recent-${entry.type}-${entry.id}`,
      title: entry.entity.name,
      subtitle: "Recently viewed",
      icon: RECENT_ENTRY_ICONS[entry.type] ?? History,
      category: "Recently Viewed",
      route: entry.to,
    }));

  const savedDoctorResults = savedDoctors
    .slice(0, SUGGESTED_SAVED_LIMIT)
    .map((doctor) => ({
      id: `suggested-saved-doctor-${doctor.id}`,
      title: doctor.name,
      subtitle: doctor.specialty,
      icon: Stethoscope,
      category: "Saved Doctors",
      route: `/doctors/${doctor.id}`,
    }));

  const savedMedicineResults = savedMedicines
    .slice(0, SUGGESTED_SAVED_LIMIT)
    .map((medicine) => ({
      id: `suggested-saved-medicine-${medicine.id}`,
      title: medicine.name,
      subtitle: medicine.brand,
      icon: Pill,
      category: "Saved Medicines",
      route: `/medicines/${medicine.id}`,
    }));

  return [...recentlyViewed, ...savedDoctorResults, ...savedMedicineResults];
}
