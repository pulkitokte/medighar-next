import { CalendarClock, Pill, FileText } from "lucide-react";
import { groupByField } from "@/shared/lib/repositoryHelpers.js";

export const EVENT_TYPES = {
  APPOINTMENT_CREATED: "appointment-created",
  APPOINTMENT_COMPLETED: "appointment-completed",
  MEDICINE_REMINDER_CREATED: "medicine-reminder-created",
  APPOINTMENT_REMINDER_CREATED: "appointment-reminder-created",
  REMINDER_COMPLETED: "reminder-completed",
  RECORD_ADDED: "record-added",
  PROFILE_UPDATED: "profile-updated",
  FAMILY_MEMBER_ADDED: "family-member-added",
  FAMILY_MEMBER_UPDATED: "family-member-updated",
  FAMILY_MEMBER_DELETED: "family-member-deleted",
  REPORT_GENERATED: "report-generated",
};

export const EVENT_TYPE_META = {
  [EVENT_TYPES.APPOINTMENT_CREATED]: {
    label: "Appointment Created",
    icon: CalendarClock,
    color: "blue",
    category: "appointments",
    to: "/appointments",
  },
  [EVENT_TYPES.APPOINTMENT_COMPLETED]: {
    label: "Appointment Completed",
    icon: CalendarClock,
    color: "green",
    category: "appointments",
    to: "/appointments",
  },
  [EVENT_TYPES.MEDICINE_REMINDER_CREATED]: {
    label: "Medicine Reminder Created",
    icon: Pill,
    color: "amber",
    category: "medicines",
    to: "/reminders",
  },
  [EVENT_TYPES.APPOINTMENT_REMINDER_CREATED]: {
    label: "Appointment Reminder Created",
    icon: Pill,
    color: "amber",
    category: "medicines",
    to: "/reminders",
  },
  [EVENT_TYPES.REMINDER_COMPLETED]: {
    label: "Reminder Completed",
    icon: Pill,
    color: "green",
    category: "medicines",
    to: "/reminders",
  },
  [EVENT_TYPES.RECORD_ADDED]: {
    label: "Medical Record Added",
    icon: FileText,
    color: "purple",
    category: "records",
    to: "/medical-records",
  },
  [EVENT_TYPES.PROFILE_UPDATED]: {
    label: "Medical Profile Updated",
    icon: FileText,
    color: "cyan",
    category: "profiles",
    to: "/medical-profile",
  },
  [EVENT_TYPES.FAMILY_MEMBER_ADDED]: {
    label: "Family Member Added",
    icon: FileText,
    color: "pink",
    category: "family",
    to: "/family",
  },
  [EVENT_TYPES.FAMILY_MEMBER_UPDATED]: {
    label: "Family Member Updated",
    icon: FileText,
    color: "pink",
    category: "family",
    to: "/family",
  },
  [EVENT_TYPES.FAMILY_MEMBER_DELETED]: {
    label: "Family Member Deleted",
    icon: FileText,
    color: "pink",
    category: "family",
    to: "/family",
  },
  [EVENT_TYPES.REPORT_GENERATED]: {
    label: "Health Report Generated",
    icon: FileText,
    color: "cyan",
    category: "reports",
    to: "/reports",
  },
};

export const FILTER_CATEGORIES = [
  { key: "all", label: "All" },
  { key: "appointments", label: "Appointments" },
  { key: "medicines", label: "Medicines" },
  { key: "records", label: "Records" },
  { key: "profiles", label: "Profiles" },
  { key: "family", label: "Family" },
  { key: "reports", label: "Reports" },
];

function buildEvent({
  id,
  type,
  memberId,
  memberName,
  title,
  description,
  date,
  to,
  source,
}) {
  const meta = EVENT_TYPE_META[type];

  return {
    id,
    type,
    memberId,
    memberName,
    title,
    description,
    date,
    icon: meta.icon,
    color: meta.color,
    category: meta.category,
    link: to,
    source,
  };
}

export function buildAppointmentEvents(appointments = []) {
  const events = [];

  appointments.forEach((appointment) => {
    const doctorName = appointment.doctor?.name ?? "a doctor";
    const memberName = appointment.member?.fullName ?? "Me";

    events.push(
      buildEvent({
        id: `appt-created-${appointment.id}`,
        type: EVENT_TYPES.APPOINTMENT_CREATED,
        memberId: appointment.memberId ?? "me",
        memberName,
        title: `Appointment booked with ${doctorName}`,
        description: `${appointment.consultationType === "video" ? "Video consultation" : "In-person visit"} · ${appointment.timeSlot}`,
        date: appointment.createdAt,
        to: "/appointments",
        source: "Appointments",
      }),
    );

    if (appointment.status === "completed") {
      events.push(
        buildEvent({
          id: `appt-completed-${appointment.id}`,
          type: EVENT_TYPES.APPOINTMENT_COMPLETED,
          memberId: appointment.memberId ?? "me",
          memberName,
          title: `Appointment with ${doctorName} completed`,
          description: `Consultation on ${appointment.date}`,
          date: new Date(appointment.date).getTime(),
          to: "/appointments",
          source: "Appointments",
        }),
      );
    }
  });

  return events;
}

export function buildReminderEvents(reminders = []) {
  const events = [];

  reminders.forEach((reminder) => {
    const memberName = reminder.member?.fullName ?? "Me";
    const isMedicine = reminder.type === "medicine";

    events.push(
      buildEvent({
        id: `reminder-created-${reminder.id}`,
        type: isMedicine
          ? EVENT_TYPES.MEDICINE_REMINDER_CREATED
          : EVENT_TYPES.APPOINTMENT_REMINDER_CREATED,
        memberId: reminder.memberId ?? "me",
        memberName,
        title: isMedicine
          ? `Reminder created for ${reminder.medicine?.name ?? "a medicine"}`
          : `Appointment reminder created for ${reminder.appointment?.doctor?.name ?? "an appointment"}`,
        description: isMedicine
          ? `${reminder.dosage} · ${reminder.frequency}`
          : "Reminder linked to an upcoming appointment",
        date: reminder.createdAt,
        to: "/reminders",
        source: "Reminders",
      }),
    );

    if (reminder.status === "completed") {
      events.push(
        buildEvent({
          id: `reminder-completed-${reminder.id}`,
          type: EVENT_TYPES.REMINDER_COMPLETED,
          memberId: reminder.memberId ?? "me",
          memberName,
          title: isMedicine
            ? `${reminder.medicine?.name ?? "Medicine"} reminder completed`
            : "Appointment reminder completed",
          description: isMedicine ? `Course ended on ${reminder.endDate}` : "",
          date: isMedicine
            ? new Date(reminder.endDate).getTime()
            : reminder.appointment
              ? new Date(reminder.appointment.date).getTime()
              : reminder.createdAt,
          to: "/reminders",
          source: "Reminders",
        }),
      );
    }
  });

  return events;
}

export function buildRecordEvents(records = []) {
  return records.map((record) =>
    buildEvent({
      id: `record-${record.id}`,
      type: EVENT_TYPES.RECORD_ADDED,
      memberId: record.memberId ?? "me",
      memberName: record.member?.fullName ?? "Me",
      title: `Medical record added: ${record.title}`,
      description: `${record.type} · ${record.doctorName} · ${record.hospital}`,
      date: record.createdAt,
      to: "/medical-records",
      source: "Medical Records",
    }),
  );
}

export function buildProfileEvents(memberProfiles = []) {
  return memberProfiles
    .filter((entry) => entry.profile?.updatedAt)
    .map((entry) =>
      buildEvent({
        id: `profile-${entry.id}-${entry.profile.updatedAt}`,
        type: EVENT_TYPES.PROFILE_UPDATED,
        memberId: entry.id,
        memberName: entry.fullName,
        title: `Medical profile updated for ${entry.fullName}`,
        description: `Blood group: ${entry.profile.bloodGroup || "—"}`,
        date: entry.profile.updatedAt,
        to: `/medical-profile?member=${entry.id}`,
        source: "Medical Profile",
      }),
    );
}

export function buildFamilyEvents(members = []) {
  const events = [];

  members
    .filter((member) => !member.isSelf && member.createdAt)
    .forEach((member) => {
      events.push(
        buildEvent({
          id: `family-added-${member.id}`,
          type: EVENT_TYPES.FAMILY_MEMBER_ADDED,
          memberId: member.id,
          memberName: member.fullName,
          title: `${member.fullName} added to family`,
          description: member.relationship,
          date: member.createdAt,
          to: "/family",
          source: "Family Profiles",
        }),
      );

      if (member.updatedAt && member.updatedAt !== member.createdAt) {
        events.push(
          buildEvent({
            id: `family-updated-${member.id}-${member.updatedAt}`,
            type: EVENT_TYPES.FAMILY_MEMBER_UPDATED,
            memberId: member.id,
            memberName: member.fullName,
            title: `${member.fullName}'s details updated`,
            description: member.relationship,
            date: member.updatedAt,
            to: "/family",
            source: "Family Profiles",
          }),
        );
      }
    });

  return events;
}

/**
 * Builds "Health Report Generated" events from the reports module's
 * generation log. reportLogs is supplied by the caller (hook layer) —
 * this file never imports report.service.js, keeping the dependency
 * one-directional (report.service.js → timeline.service.js only).
 * @param {Array<object>} reportLogs
 * @returns {Array<object>}
 */
export function buildReportEvents(reportLogs = []) {
  return reportLogs.map((log) =>
    buildEvent({
      id: `report-generated-${log.id}`,
      type: EVENT_TYPES.REPORT_GENERATED,
      memberId: log.memberId ?? "all",
      memberName: log.memberLabel || "All Members",
      title: `${log.typeLabel || "Health report"} generated`,
      description: `For ${log.memberLabel || "All Members"}`,
      date: log.generatedAt,
      to: "/reports",
      source: "Health Reports",
    }),
  );
}

export function buildTimelineEvents(sources) {
  const events = [
    ...buildAppointmentEvents(sources.appointments),
    ...buildReminderEvents(sources.reminders),
    ...buildRecordEvents(sources.records),
    ...buildProfileEvents(sources.memberProfiles),
    ...buildFamilyEvents(sources.familyMembers),
    ...buildReportEvents(sources.reportLogs),
  ];

  return events
    .filter((event) => Number.isFinite(event.date))
    .sort((a, b) => b.date - a.date);
}

export function filterByCategory(events, category) {
  if (!category || category === "all") return events;
  return events.filter((event) => event.category === category);
}

export function filterByMember(events, memberId) {
  if (!memberId || memberId === "all") return events;
  return events.filter((event) => event.memberId === memberId);
}

export function searchEvents(events, query) {
  return safeSearch(events, query, ["title", "description", "memberName"]);
}

export function computeTimelineStats(events) {
  const countBy = (category) =>
    events.filter((event) => event.category === category).length;

  return {
    total: events.length,
    appointments: countBy("appointments"),
    records: countBy("records"),
    reminders: countBy("medicines"),
    profiles: countBy("profiles"),
    family: countBy("family"),
  };
}
