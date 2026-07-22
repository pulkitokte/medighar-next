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
import {
  getReadIds,
  setReadIds,
  subscribeToNotifications,
} from "@/services/notifications/notifications.repository.js";
import {
  computeAppointmentStats,
  computeReminderStats,
  computeRecordStats,
  computeAchievements,
} from "@/services/insights/insights.service.js";

export { subscribeToNotifications };

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

export const NOTIFICATION_CATEGORIES = [
  { key: "all", label: "All" },
  { key: "appointments", label: "Appointments" },
  { key: "reminders", label: "Reminders" },
  { key: "records", label: "Medical Records" },
  { key: "profile", label: "Medical Profile" },
  { key: "family", label: "Family" },
  { key: "general", label: "General" },
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
  "report-generated": { icon: FileText, category: "general", to: "/reports" },
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

/**
 * Builds "Health Report Generated" notifications from the reports
 * module's generation log. reportLogs is supplied by the caller (hook
 * layer) — this file never imports report.service.js, keeping the
 * dependency one-directional.
 * @param {Array<object>} reportLogs
 * @param {Date} now
 * @returns {Array<object>}
 */
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

export function buildNotifications(sources, now, todayKey) {
  const readIds = new Set(getReadIds());

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
    .map((notification) => ({
      ...notification,
      read: readIds.has(notification.id),
    }))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function markAsRead(id) {
  const readIds = getReadIds();
  if (readIds.includes(id)) return;
  setReadIds([...readIds, id]);
}

export function markAllAsRead(ids) {
  const readIds = new Set(getReadIds());
  ids.forEach((id) => readIds.add(id));
  setReadIds([...readIds]);
}

export function filterByCategory(notifications, category) {
  if (!category || category === "all") return notifications;
  return notifications.filter(
    (notification) => notification.category === category,
  );
}

export function searchNotifications(notifications, query) {
  return safeSearch(notifications, query, [
    "title",
    "description",
    "memberName",
  ]);
}

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
