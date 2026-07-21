import { safeSearch } from "@/shared/lib/search.js";
import {
  CalendarClock,
  CalendarCheck,
  Pill,
  BellRing,
  FileText,
  IdCard,
  UserPlus,
  UserCog,
} from "lucide-react";

/**
 * Pure aggregation logic for the Health Timeline. This service owns no
 * storage of its own — every event is derived from already-resolved data
 * supplied by useAppointments, useReminders, useMedicalRecords, the
 * Medical Profile module, and useFamilyProfiles. It only normalizes,
 * combines, sorts, and filters — it never mutates the data it receives.
 */

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
    icon: CalendarCheck,
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
    icon: BellRing,
    color: "amber",
    category: "medicines",
    to: "/reminders",
  },
  [EVENT_TYPES.REMINDER_COMPLETED]: {
    label: "Reminder Completed",
    icon: BellRing,
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
    icon: IdCard,
    color: "cyan",
    category: "profiles",
    to: "/medical-profile",
  },
  [EVENT_TYPES.FAMILY_MEMBER_ADDED]: {
    label: "Family Member Added",
    icon: UserPlus,
    color: "pink",
    category: "family",
    to: "/family",
  },
  [EVENT_TYPES.FAMILY_MEMBER_UPDATED]: {
    label: "Family Member Updated",
    icon: UserCog,
    color: "pink",
    category: "family",
    to: "/family",
  },
  [EVENT_TYPES.FAMILY_MEMBER_DELETED]: {
    label: "Family Member Deleted",
    icon: UserCog,
    color: "pink",
    category: "family",
    to: "/family",
  },
};

export const FILTER_CATEGORIES = [
  { key: "all", label: "All" },
  { key: "appointments", label: "Appointments" },
  { key: "medicines", label: "Medicines" },
  { key: "records", label: "Records" },
  { key: "profiles", label: "Profiles" },
  { key: "family", label: "Family" },
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
    date, // epoch ms
    icon: meta.icon,
    color: meta.color,
    category: meta.category,
    link: to,
    source,
  };
}

/**
 * Builds "Appointment Created" and, where applicable, "Appointment
 * Completed" events from already-enriched appointments (each already
 * carrying a resolved `doctor` and `member`).
 * @param {Array<object>} appointments
 * @returns {Array<object>}
 */
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

/**
 * Builds reminder-creation and completion events from already-enriched
 * reminders (each already carrying a resolved `medicine`/`appointment` and
 * `member`).
 * @param {Array<object>} reminders
 * @returns {Array<object>}
 */
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

/**
 * Builds "Medical Record Added" events from already-enriched records (each
 * already carrying a resolved `member`).
 * @param {Array<object>} records
 * @returns {Array<object>}
 */
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

/**
 * Builds "Medical Profile Updated" events, one per member whose profile
 * exists and has an updatedAt timestamp.
 * @param {Array<{ id: string, fullName: string, profile: object|null }>} memberProfiles
 * @returns {Array<object>}
 */
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

/**
 * Builds "Family Member Added" and, where an updatedAt exists,
 * "Family Member Updated" events. "Family Member Deleted" is intentionally
 * never generated here — deletion removes the record with no trace left to
 * build an event from, and adding a deletion log would itself be the kind
 * of duplicate storage this module is required to avoid.
 * @param {Array<object>} members
 * @returns {Array<object>}
 */
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
 * Combines every source into one normalized, newest-first event list.
 * @param {object} sources
 * @returns {Array<object>}
 */
export function buildTimelineEvents(sources) {
  const events = [
    ...buildAppointmentEvents(sources.appointments),
    ...buildReminderEvents(sources.reminders),
    ...buildRecordEvents(sources.records),
    ...buildProfileEvents(sources.memberProfiles),
    ...buildFamilyEvents(sources.familyMembers),
  ];

  return events
    .filter((event) => Number.isFinite(event.date))
    .sort((a, b) => b.date - a.date);
}

/**
 * Filters events by category ("all" returns everything unchanged).
 * @param {Array<object>} events
 * @param {string} category
 * @returns {Array<object>}
 */
export function filterByCategory(events, category) {
  if (!category || category === "all") return events;
  return events.filter((event) => event.category === category);
}

/**
 * Filters events by member id ("all" returns everything unchanged).
 * @param {Array<object>} events
 * @param {string} memberId
 * @returns {Array<object>}
 */
export function filterByMember(events, memberId) {
  if (!memberId || memberId === "all") return events;
  return events.filter((event) => event.memberId === memberId);
}

/**
 * Searches events by title, description, or member name. Reuses the
 * existing generic safeSearch helper rather than a bespoke matcher.
 * @param {Array<object>} events
 * @param {string} query
 * @returns {Array<object>}
 */
export function searchEvents(events, query) {
  return safeSearch(events, query, ["title", "description", "memberName"]);
}

/**
 * Computes summary counts for the statistics header.
 * @param {Array<object>} events
 * @returns {{ total: number, appointments: number, records: number, reminders: number, profiles: number, family: number }}
 */
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
