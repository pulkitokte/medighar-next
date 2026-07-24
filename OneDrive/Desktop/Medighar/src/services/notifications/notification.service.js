import {
  CalendarClock,
  CalendarCheck,
  BellRing,
  FileText,
  IdCard,
  UserPlus,
  UserCog,
  Cake,
  Trophy,
} from "lucide-react";
import { safeSearch } from "@/shared/lib/search.js";
import { toDateKey } from "@/services/calendar/calendar.service.js";
import { buildTimelineEvents } from "@/services/timeline/timeline.service.js";
import {
  getReadIds,
  setReadIds,
  getDismissedIds,
  setDismissedIds,
  subscribeToNotifications,
} from "@/services/notifications/notifications.repository.js";
import {
  computeAppointmentStats,
  computeReminderStats,
  computeRecordStats,
  computeAchievements,
} from "@/services/insights/insights.service.js";

export { subscribeToNotifications };

/**
 * Pure aggregation logic for the Smart Notifications & Activity Center.
 * This service owns no storage beyond read/dismissed state (handled
 * entirely by the repository) — every notification and activity item is
 * derived from already-resolved data supplied by the caller. It reuses
 * buildTimelineEvents from timeline.service.js for the Activity Feed
 * rather than reimplementing cross-module aggregation.
 */

export const PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
};

export const PRIORITY_META = {
  [PRIORITY.LOW]: { label: "Low", className: "bg-slate-100 text-slate-600" },
  [PRIORITY.MEDIUM]: { label: "Medium", className: "bg-blue-50 text-blue-700" },
  [PRIORITY.HIGH]: { label: "High", className: "bg-amber-50 text-amber-700" },
  [PRIORITY.URGENT]: { label: "Urgent", className: "bg-red-50 text-red-700" },
};

/**
 * Every notification category, used by Insights and other generic
 * consumers to compute per-category breakdowns.
 */
export const NOTIFICATION_CATEGORIES = [
  { key: "all", label: "All" },
  { key: "appointments", label: "Appointments" },
  { key: "reminders", label: "Reminders" },
  { key: "records", label: "Medical Records" },
  { key: "profile", label: "Medical Profile" },
  { key: "family", label: "Family" },
  { key: "general", label: "General" },
  { key: "reports", label: "Reports" },
];

/**
 * The curated filter set shown on the Notification Center page. "unread"
 * is a read-state filter, not a category, and is handled specially by
 * filterNotificationsByFilter.
 */
export const FILTER_OPTIONS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "appointments", label: "Appointments" },
  { key: "reports", label: "Reports" },
  { key: "family", label: "Family" },
  { key: "reminders", label: "Reminders" },
  { key: "records", label: "Medical Records" },
];

const TYPE_META = {
  "appointment-upcoming": {
    icon: CalendarClock,
    category: "appointments",
    to: "/appointments",
  },
  "appointment-completed": {
    icon: CalendarCheck,
    category: "appointments",
    to: "/appointments",
  },
  "reminder-created": {
    icon: BellRing,
    category: "reminders",
    to: "/reminders",
  },
  "reminder-due-today": {
    icon: BellRing,
    category: "reminders",
    to: "/reminders",
  },
  "record-added": {
    icon: FileText,
    category: "records",
    to: "/medical-records",
  },
  "profile-updated": {
    icon: IdCard,
    category: "profile",
    to: "/medical-profile",
  },
  "family-added": { icon: UserPlus, category: "family", to: "/family" },
  "family-updated": { icon: UserCog, category: "family", to: "/family" },
  "birthday-upcoming": { icon: Cake, category: "general", to: "/family" },
  "milestone-unlocked": { icon: Trophy, category: "general", to: "/timeline" },
  "report-generated": { icon: FileText, category: "reports", to: "/reports" },
};

const DAY_MS = 24 * 60 * 60 * 1000;

function isWithinFutureDays(timestamp, now, days) {
  const diff = timestamp - now;
  return diff >= 0 && diff <= days * DAY_MS;
}

function isWithinPastDays(timestamp, now, days) {
  const diff = now - timestamp;
  return diff >= 0 && diff <= days * DAY_MS;
}

function buildNotification({
  id,
  type,
  title,
  description,
  priority,
  createdAt,
  source,
  memberId,
  memberName,
}) {
  const meta = TYPE_META[type];

  return {
    id,
    type,
    title,
    description,
    priority,
    createdAt,
    source,
    memberId,
    memberName,
    link: meta.to,
    category: meta.category,
    icon: meta.icon,
    read: false,
  };
}

export function buildAppointmentNotifications(appointments = [], now) {
  const nowMs = now.getTime();
  const notifications = [];

  appointments.forEach((appointment) => {
    const doctorName = appointment.doctor?.name ?? "a doctor";
    const memberName = appointment.member?.fullName ?? "Me";
    const appointmentMs = new Date(appointment.date).getTime();

    if (
      appointment.status === "upcoming" &&
      isWithinFutureDays(appointmentMs, nowMs, 7)
    ) {
      const isSoon = isWithinFutureDays(appointmentMs, nowMs, 1);

      notifications.push(
        buildNotification({
          id: `appt-upcoming-${appointment.id}`,
          type: "appointment-upcoming",
          title: `Upcoming appointment with ${doctorName}`,
          description: `${appointment.date} at ${appointment.timeSlot}`,
          priority: isSoon ? PRIORITY.HIGH : PRIORITY.MEDIUM,
          createdAt: appointmentMs,
          source: "Appointments",
          memberId: appointment.memberId ?? "me",
          memberName,
        }),
      );
    }

    if (
      appointment.status === "completed" &&
      isWithinPastDays(appointmentMs, nowMs, 7)
    ) {
      notifications.push(
        buildNotification({
          id: `appt-completed-${appointment.id}`,
          type: "appointment-completed",
          title: `Appointment with ${doctorName} completed`,
          description: `Consultation on ${appointment.date}`,
          priority: PRIORITY.LOW,
          createdAt: appointmentMs,
          source: "Appointments",
          memberId: appointment.memberId ?? "me",
          memberName,
        }),
      );
    }
  });

  return notifications;
}

export function buildReminderNotifications(reminders = [], now, todayKey) {
  const nowMs = now.getTime();
  const notifications = [];

  reminders.forEach((reminder) => {
    const memberName = reminder.member?.fullName ?? "Me";
    const isMedicine = reminder.type === "medicine";
    const label = isMedicine
      ? (reminder.medicine?.name ?? "a medicine")
      : (reminder.appointment?.doctor?.name ?? "an appointment");

    if (reminder.createdAt && isWithinPastDays(reminder.createdAt, nowMs, 7)) {
      notifications.push(
        buildNotification({
          id: `reminder-created-${reminder.id}`,
          type: "reminder-created",
          title: `New reminder created for ${label}`,
          description: isMedicine
            ? `${reminder.dosage} · ${reminder.frequency}`
            : "Linked to an upcoming appointment",
          priority: PRIORITY.LOW,
          createdAt: reminder.createdAt,
          source: "Reminders",
          memberId: reminder.memberId ?? "me",
          memberName,
        }),
      );
    }

    if (
      isMedicine &&
      reminder.enabled &&
      reminder.status !== "disabled" &&
      reminder.startDate <= todayKey &&
      todayKey <= reminder.endDate
    ) {
      notifications.push(
        buildNotification({
          id: `reminder-due-${reminder.id}-${todayKey}`,
          type: "reminder-due-today",
          title: `${label} reminder due today`,
          description: `${reminder.dosage} at ${reminder.reminderTime}`,
          priority: PRIORITY.HIGH,
          createdAt: nowMs,
          source: "Reminders",
          memberId: reminder.memberId ?? "me",
          memberName,
        }),
      );
    }
  });

  return notifications;
}

export function buildRecordNotifications(records = [], now) {
  const nowMs = now.getTime();

  return records
    .filter(
      (record) =>
        record.createdAt && isWithinPastDays(record.createdAt, nowMs, 7),
    )
    .map((record) =>
      buildNotification({
        id: `record-added-${record.id}`,
        type: "record-added",
        title: `Medical record added: ${record.title}`,
        description: `${record.type} · ${record.doctorName}`,
        priority: PRIORITY.LOW,
        createdAt: record.createdAt,
        source: "Medical Records",
        memberId: record.memberId ?? "me",
        memberName: record.member?.fullName ?? "Me",
      }),
    );
}

export function buildProfileNotifications(memberProfiles = [], now) {
  const nowMs = now.getTime();

  return memberProfiles
    .filter(
      (entry) =>
        entry.profile?.updatedAt &&
        isWithinPastDays(entry.profile.updatedAt, nowMs, 7),
    )
    .map((entry) =>
      buildNotification({
        id: `profile-updated-${entry.id}-${entry.profile.updatedAt}`,
        type: "profile-updated",
        title: `Medical profile updated for ${entry.fullName}`,
        description: `Blood group: ${entry.profile.bloodGroup || "—"}`,
        priority: PRIORITY.LOW,
        createdAt: entry.profile.updatedAt,
        source: "Medical Profile",
        memberId: entry.id,
        memberName: entry.fullName,
      }),
    );
}

export function buildFamilyNotifications(members = [], now) {
  const nowMs = now.getTime();
  const notifications = [];

  members
    .filter((member) => !member.isSelf)
    .forEach((member) => {
      if (member.createdAt && isWithinPastDays(member.createdAt, nowMs, 7)) {
        notifications.push(
          buildNotification({
            id: `family-added-${member.id}`,
            type: "family-added",
            title: `${member.fullName} added to family`,
            description: member.relationship,
            priority: PRIORITY.MEDIUM,
            createdAt: member.createdAt,
            source: "Family Profiles",
            memberId: member.id,
            memberName: member.fullName,
          }),
        );
      }

      if (
        member.updatedAt &&
        member.updatedAt !== member.createdAt &&
        isWithinPastDays(member.updatedAt, nowMs, 7)
      ) {
        notifications.push(
          buildNotification({
            id: `family-updated-${member.id}-${member.updatedAt}`,
            type: "family-updated",
            title: `${member.fullName}'s details updated`,
            description: member.relationship,
            priority: PRIORITY.LOW,
            createdAt: member.updatedAt,
            source: "Family Profiles",
            memberId: member.id,
            memberName: member.fullName,
          }),
        );
      }
    });

  return notifications;
}

function daysUntilNextBirthday(dob, today) {
  const [, month, day] = dob.split("-").map(Number);
  if (!month || !day) return Infinity;

  let candidate = new Date(today.getFullYear(), month - 1, day);
  if (candidate < today) {
    candidate = new Date(today.getFullYear() + 1, month - 1, day);
  }

  return Math.round((candidate.getTime() - today.getTime()) / DAY_MS);
}

export function buildBirthdayNotifications(memberProfiles = [], now) {
  const year = now.getFullYear();

  return memberProfiles
    .filter((entry) => entry.profile?.dob)
    .map((entry) => {
      const daysUntil = daysUntilNextBirthday(entry.profile.dob, now);
      if (daysUntil > 30) return null;

      return buildNotification({
        id: `birthday-${entry.id}-${year}`,
        type: "birthday-upcoming",
        title: `${entry.fullName}'s birthday is coming up`,
        description:
          daysUntil === 0
            ? "Today!"
            : `In ${daysUntil} day${daysUntil === 1 ? "" : "s"}`,
        priority: daysUntil <= 7 ? PRIORITY.MEDIUM : PRIORITY.LOW,
        createdAt: now.getTime(),
        source: "Family Profiles",
        memberId: entry.id,
        memberName: entry.fullName,
      });
    })
    .filter(Boolean);
}

export function buildMilestoneNotifications(sources, now) {
  const appointmentStats = computeAppointmentStats(sources.appointments);
  const reminderStats = computeReminderStats(sources.reminders);
  const recordStats = computeRecordStats(sources.records);

  const stats = {
    appointments: appointmentStats,
    reminders: reminderStats,
    records: recordStats,
    activity: { recentCount: 0, reviewCount: 0 },
    savedCount: 0,
  };

  const achievements = computeAchievements(stats);

  return achievements
    .filter((achievement) => achievement.unlocked)
    .map((achievement) =>
      buildNotification({
        id: `milestone-${achievement.key}`,
        type: "milestone-unlocked",
        title: `Milestone unlocked: ${achievement.label}`,
        description: achievement.description,
        priority: PRIORITY.MEDIUM,
        createdAt: now.getTime(),
        source: "Health Insights",
        memberId: "me",
        memberName: "Me",
      }),
    );
}

export function buildReportNotifications(reportLogs = [], now) {
  const nowMs = now.getTime();

  return reportLogs
    .filter((log) => isWithinPastDays(log.generatedAt, nowMs, 7))
    .map((log) =>
      buildNotification({
        id: `report-generated-${log.id}`,
        type: "report-generated",
        title: `${log.typeLabel || "Health report"} generated`,
        description: `For ${log.memberLabel || "All Members"}`,
        priority: PRIORITY.LOW,
        createdAt: log.generatedAt,
        source: "Health Reports",
        memberId: log.memberId ?? "all",
        memberName: log.memberLabel || "All Members",
      }),
    );
}

/**
 * Combines every source into one normalized, newest-first notification
 * list with read and dismissed state resolved against the repository.
 * Dismissed notifications are filtered out entirely.
 * @param {object} sources
 * @param {Date} now
 * @param {string} todayKey
 * @returns {Array<object>}
 */
export function buildNotifications(sources, now, todayKey) {
  const readIds = new Set(getReadIds());
  const dismissedIds = new Set(getDismissedIds());

  const notifications = [
    ...buildAppointmentNotifications(sources.appointments, now),
    ...buildReminderNotifications(sources.reminders, now, todayKey),
    ...buildRecordNotifications(sources.records, now),
    ...buildProfileNotifications(sources.memberProfiles, now),
    ...buildFamilyNotifications(sources.familyMembers, now),
    ...buildBirthdayNotifications(sources.memberProfiles, now),
    ...buildMilestoneNotifications(
      {
        appointments: sources.rawAppointments,
        reminders: sources.rawReminders,
        records: sources.records,
      },
      now,
    ),
    ...buildReportNotifications(sources.reportLogs, now),
  ];

  return notifications
    .filter((notification) => !dismissedIds.has(notification.id))
    .map((notification) => ({
      ...notification,
      read: readIds.has(notification.id),
    }))
    .sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Marks a single notification as read.
 * @param {string} id
 */
export function markAsRead(id) {
  const readIds = getReadIds();
  if (readIds.includes(id)) return;
  setReadIds([...readIds, id]);
}

/**
 * Marks every given notification id as read.
 * @param {Array<string>} ids
 */
export function markAllAsRead(ids) {
  const readIds = new Set(getReadIds());
  ids.forEach((id) => readIds.add(id));
  setReadIds([...readIds]);
}

/**
 * Dismisses (deletes) a single notification. It will not reappear on
 * future generation.
 * @param {string} id
 */
export function dismissNotification(id) {
  const dismissedIds = getDismissedIds();
  if (dismissedIds.includes(id)) return;
  setDismissedIds([...dismissedIds, id]);
}

/**
 * Dismisses (clears) every given notification id.
 * @param {Array<string>} ids
 */
export function clearAllNotifications(ids) {
  const dismissedIds = new Set(getDismissedIds());
  ids.forEach((id) => dismissedIds.add(id));
  setDismissedIds([...dismissedIds]);
}

/**
 * Filters notifications by category ("all" returns everything unchanged).
 * @param {Array<object>} notifications
 * @param {string} category
 * @returns {Array<object>}
 */
export function filterByCategory(notifications, category) {
  if (!category || category === "all") return notifications;
  return notifications.filter(
    (notification) => notification.category === category,
  );
}

/**
 * Filters notifications by the Notification Center's filter bar, which
 * includes both real categories and the "unread" read-state filter.
 * @param {Array<object>} notifications
 * @param {string} filterKey
 * @returns {Array<object>}
 */
export function filterNotificationsByFilter(notifications, filterKey) {
  if (!filterKey || filterKey === "all") return notifications;
  if (filterKey === "unread")
    return notifications.filter((notification) => !notification.read);
  return filterByCategory(notifications, filterKey);
}

/**
 * Searches notifications by title, description, or member name. Reuses
 * the existing generic safeSearch helper.
 * @param {Array<object>} notifications
 * @param {string} query
 * @returns {Array<object>}
 */
export function searchNotifications(notifications, query) {
  return safeSearch(notifications, query, [
    "title",
    "description",
    "memberName",
  ]);
}

/**
 * Computes summary counts for the statistics header and for the
 * Insights integration.
 * @param {Array<object>} notifications
 * @returns {{ total: number, unread: number, byCategory: Record<string, number> }}
 */
export function computeNotificationStats(notifications) {
  const byCategory = {};

  NOTIFICATION_CATEGORIES.filter((category) => category.key !== "all").forEach(
    (category) => {
      byCategory[category.key] = notifications.filter(
        (notification) => notification.category === category.key,
      ).length;
    },
  );

  return {
    total: notifications.length,
    unread: notifications.filter((notification) => !notification.read).length,
    byCategory,
  };
}

/**
 * Groups notifications into Today / Yesterday / This Week / Older
 * buckets, using local calendar-day comparisons (reuses toDateKey from
 * calendar.service.js rather than writing new date-bucketing logic).
 * @param {Array<object>} notifications
 * @param {Date} now
 * @returns {{ Today: Array<object>, Yesterday: Array<object>, "This Week": Array<object>, Older: Array<object> }}
 */
export function groupNotificationsByRecency(notifications, now) {
  const todayKey = toDateKey(now);
  const yesterdayKey = toDateKey(new Date(now.getTime() - DAY_MS));
  const weekAgoMs = now.getTime() - 7 * DAY_MS;

  const groups = { Today: [], Yesterday: [], "This Week": [], Older: [] };

  notifications.forEach((notification) => {
    const key = toDateKey(notification.createdAt);

    if (key === todayKey) {
      groups.Today.push(notification);
    } else if (key === yesterdayKey) {
      groups.Yesterday.push(notification);
    } else if (notification.createdAt >= weekAgoMs) {
      groups["This Week"].push(notification);
    } else {
      groups.Older.push(notification);
    }
  });

  return groups;
}

/**
 * Formats a timestamp as a short, human-readable relative time string
 * (e.g. "5 minutes ago"), suitable for both visible display and
 * screen-reader announcement via an accessible <time> element.
 * @param {number} timestamp
 * @param {number} [now]
 * @returns {string}
 */
export function formatRelativeTime(timestamp, now = Date.now()) {
  const diffMinutes = Math.round((now - timestamp) / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60)
    return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24)
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

  return new Date(timestamp).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Merges notifications with important user activities (reusing
 * buildTimelineEvents from timeline.service.js) into one chronological
 * feed. This is the Activity Feed's entire implementation — no
 * aggregation logic is duplicated here, only merged and sorted.
 * @param {Array<object>} notifications
 * @param {object} timelineSources
 * @param {number} [limit]
 * @returns {Array<object>}
 */
export function buildActivityFeed(notifications, timelineSources, limit = 30) {
  const timelineEvents = buildTimelineEvents(timelineSources);

  const activityItems = timelineEvents.map((event) => ({
    id: `activity-${event.id}`,
    kind: "activity",
    title: event.title,
    description: event.description,
    timestamp: event.date,
    icon: event.icon,
    category: event.category,
    link: event.link,
    memberName: event.memberName,
  }));

  const notificationItems = notifications.map((notification) => ({
    id: `notification-${notification.id}`,
    kind: "notification",
    title: notification.title,
    description: notification.description,
    timestamp: notification.createdAt,
    icon: notification.icon,
    category: notification.category,
    link: notification.link,
    memberName: notification.memberName,
    priority: notification.priority,
    read: notification.read,
  }));

  return [...activityItems, ...notificationItems]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}
