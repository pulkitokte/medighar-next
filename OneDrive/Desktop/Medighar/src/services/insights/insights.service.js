import { groupByField, uniqueValues } from "@/shared/lib/repositoryHelpers.js";
import { buildActivityTimeline } from "@/services/dashboard/dashboard.service.js";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function computeAppointmentStats({ upcoming = [], past = [] }) {
  const all = [...upcoming, ...past];
  const completed = all.filter(
    (appointment) => appointment.status === "completed",
  );

  const byMonth = MONTH_LABELS.map((label) => ({ label, count: 0 }));
  all.forEach((appointment) => {
    const monthIndex = new Date(appointment.date).getMonth();
    if (byMonth[monthIndex]) byMonth[monthIndex].count += 1;
  });

  const specialtyGroups = groupByField(
    all,
    (appointment) => appointment.doctor?.specialty ?? "Unknown",
  );
  const bySpecialty = Object.entries(specialtyGroups)
    .map(([specialty, list]) => ({ specialty, count: list.length }))
    .sort((a, b) => b.count - a.count);

  const doctorGroups = groupByField(all, (appointment) => appointment.doctorId);
  const mostVisitedDoctors = Object.values(doctorGroups)
    .map((list) => ({ doctor: list[0].doctor, count: list.length }))
    .filter((entry) => entry.doctor)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    total: all.length,
    completed: completed.length,
    upcoming: upcoming.length,
    byMonth,
    bySpecialty,
    mostVisitedDoctors,
  };
}

export function computeReminderStats({
  upcoming = [],
  completed = [],
  disabled = [],
}) {
  const all = [...upcoming, ...completed, ...disabled];
  const medicineCount = all.filter(
    (reminder) => reminder.type === "medicine",
  ).length;
  const appointmentCount = all.filter(
    (reminder) => reminder.type === "appointment",
  ).length;

  return {
    total: all.length,
    medicineCount,
    appointmentCount,
    active: upcoming.length,
    completed: completed.length,
    disabled: disabled.length,
  };
}

export function computeRecordStats(records = []) {
  const byType = Object.entries(groupByField(records, "type"))
    .map(([type, list]) => ({ type, count: list.length }))
    .sort((a, b) => b.count - a.count);

  const byYear = Object.entries(
    groupByField(records, (record) => new Date(record.date).getFullYear()),
  )
    .map(([year, list]) => ({ year, count: list.length }))
    .sort((a, b) => Number(b.year) - Number(a.year));

  return { total: records.length, byType, byYear };
}

export function computeActivityStats({
  recentCount = 0,
  reviewCount = 0,
  timelineCount = 0,
}) {
  return { recentCount, reviewCount, timelineCount };
}

const ACHIEVEMENT_RULES = [
  {
    key: "first-appointment",
    label: "First Appointment",
    description: "Booked your first appointment.",
    check: (stats) => stats.appointments.total >= 1,
  },
  {
    key: "first-review",
    label: "First Review",
    description: "Wrote your first doctor review.",
    check: (stats) => stats.activity.reviewCount >= 1,
  },
  {
    key: "five-records",
    label: "Five Medical Records",
    description: "Added 5 or more medical records.",
    check: (stats) => stats.records.total >= 5,
  },
  {
    key: "ten-saved",
    label: "Ten Saved Items",
    description: "Saved 10 or more items.",
    check: (stats) => stats.savedCount >= 10,
  },
  {
    key: "seven-reminders",
    label: "Seven Active Reminders",
    description: "Managing 7 or more active reminders.",
    check: (stats) => stats.reminders.active >= 7,
  },
  {
    key: "health-organizer",
    label: "Health Organizer",
    description: "Used appointments, reminders, and medical records together.",
    check: (stats) =>
      stats.appointments.total >= 1 &&
      stats.reminders.total >= 1 &&
      stats.records.total >= 1,
  },
];

export function computeAchievements(stats) {
  return ACHIEVEMENT_RULES.map((rule) => ({
    key: rule.key,
    label: rule.label,
    description: rule.description,
    unlocked: rule.check(stats),
  }));
}

export function generateSummaries(stats) {
  const summaries = [];

  if (stats.appointments.upcoming > 0) {
    summaries.push(
      `You have ${stats.appointments.upcoming} upcoming appointment${stats.appointments.upcoming === 1 ? "" : "s"}.`,
    );
  }
  if (stats.records.total > 0) {
    summaries.push(
      `You have added ${stats.records.total} medical record${stats.records.total === 1 ? "" : "s"}.`,
    );
  }
  if (stats.activity.reviewCount > 0) {
    const reviewedDoctorCount = uniqueValues(
      stats.reviewedDoctorIds ?? [],
    ).length;
    summaries.push(
      `You've reviewed ${reviewedDoctorCount} doctor${reviewedDoctorCount === 1 ? "" : "s"}.`,
    );
  }
  if (stats.reminders.active > 0) {
    summaries.push(
      `You currently manage ${stats.reminders.active} active reminder${stats.reminders.active === 1 ? "" : "s"}.`,
    );
  }
  if (stats.savedCount > 0) {
    summaries.push(
      `You have ${stats.savedCount} saved item${stats.savedCount === 1 ? "" : "s"} for quick access.`,
    );
  }
  if (stats.appointments.completed > 0) {
    summaries.push(
      `You've completed ${stats.appointments.completed} appointment${stats.appointments.completed === 1 ? "" : "s"} so far.`,
    );
  }

  return summaries;
}

export function buildHealthInsights(sources) {
  const appointments = computeAppointmentStats(sources.appointments);
  const reminders = computeReminderStats(sources.reminders);
  const records = computeRecordStats(sources.records);
  const activity = computeActivityStats(sources.activity);

  const stats = {
    appointments,
    reminders,
    records,
    activity,
    savedCount: sources.savedCount,
    reviewedDoctorIds: sources.reviewedDoctorIds,
  };

  const timeline = buildActivityTimeline(sources.timelineSources, 500);

  return {
    ...stats,
    timelineActivityCount: timeline.length,
    achievements: computeAchievements(stats),
    summaries: generateSummaries(stats),
  };
}

/**
 * Computes family-related insight statistics: total member count and blood
 * group distribution across all members (including "Me").
 * @param {Array<object>} members
 * @returns {{ count: number, bloodGroupDistribution: Array<{ bloodGroup: string, count: number }> }}
 */
export function computeFamilyStats(members = []) {
  const withBloodGroup = members.filter((member) => member.bloodGroup);
  const groups = groupByField(withBloodGroup, "bloodGroup");

  const bloodGroupDistribution = Object.entries(groups)
    .map(([bloodGroup, list]) => ({ bloodGroup, count: list.length }))
    .sort((a, b) => b.count - a.count);

  return { count: members.length, bloodGroupDistribution };
}
