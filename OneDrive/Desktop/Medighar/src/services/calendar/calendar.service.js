import { CalendarClock, Pill, FileText } from "lucide-react";
import { groupByField } from "@/shared/lib/repositoryHelpers.js";

export const EVENT_TYPES = {
  APPOINTMENT: "appointment",
  MEDICINE_REMINDER: "medicine-reminder",
  MEDICAL_RECORD: "medical-record",
};

export const EVENT_TYPE_META = {
  [EVENT_TYPES.APPOINTMENT]: {
    label: "Appointment",
    icon: CalendarClock,
    to: "/appointments",
  },
  [EVENT_TYPES.MEDICINE_REMINDER]: {
    label: "Medicine Reminder",
    icon: Pill,
    to: "/reminders",
  },
  [EVENT_TYPES.MEDICAL_RECORD]: {
    label: "Medical Record",
    icon: FileText,
    to: "/medical-records",
  },
};

function parseDateOnly(value) {
  if (value instanceof Date) return value;
  const [year, month, day] = String(value).split("-").map(Number);
  if (!year || !month || !day) return new Date(value);
  return new Date(year, month - 1, day);
}

export function toDateKey(value) {
  const date = parseDateOnly(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
export function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
export function startOfWeek(date) {
  return addDays(date, -date.getDay());
}
export function endOfWeek(date) {
  return addDays(startOfWeek(date), 6);
}

function isWithinRange(dateKey, startKey, endKey) {
  return dateKey >= startKey && dateKey <= endKey;
}

export function buildAppointmentEvents(appointments, rangeStart, rangeEnd) {
  const startKey = toDateKey(rangeStart);
  const endKey = toDateKey(rangeEnd);

  return appointments
    .filter((appointment) =>
      isWithinRange(toDateKey(appointment.date), startKey, endKey),
    )
    .map((appointment) => ({
      id: `appointment-${appointment.id}`,
      type: EVENT_TYPES.APPOINTMENT,
      title: appointment.doctor?.name
        ? `Appointment with ${appointment.doctor.name}`
        : "Appointment",
      date: toDateKey(appointment.date),
      time: appointment.timeSlot,
      memberId: appointment.memberId ?? "me",
      to: EVENT_TYPE_META[EVENT_TYPES.APPOINTMENT].to,
    }));
}

export function buildMedicineReminderEvents(reminders, rangeStart, rangeEnd) {
  const startKey = toDateKey(rangeStart);
  const endKey = toDateKey(rangeEnd);
  const events = [];

  reminders
    .filter(
      (reminder) =>
        reminder.type === "medicine" && reminder.status !== "disabled",
    )
    .forEach((reminder) => {
      const reminderStartKey = toDateKey(reminder.startDate);
      const reminderEndKey = toDateKey(reminder.endDate);

      const activeStartKey =
        reminderStartKey > startKey ? reminderStartKey : startKey;
      const activeEndKey = reminderEndKey < endKey ? reminderEndKey : endKey;

      if (activeStartKey > activeEndKey) return;

      let cursor = parseDateOnly(activeStartKey);
      const lastKey = activeEndKey;

      while (toDateKey(cursor) <= lastKey) {
        events.push({
          id: `reminder-${reminder.id}-${toDateKey(cursor)}`,
          type: EVENT_TYPES.MEDICINE_REMINDER,
          title: reminder.medicine?.name
            ? `${reminder.medicine.name} (${reminder.dosage})`
            : "Medicine reminder",
          date: toDateKey(cursor),
          time: reminder.reminderTime,
          memberId: reminder.memberId ?? "me",
          to: EVENT_TYPE_META[EVENT_TYPES.MEDICINE_REMINDER].to,
        });
        cursor = addDays(cursor, 1);
      }
    });

  return events;
}

export function buildMedicalRecordEvents(records, rangeStart, rangeEnd) {
  const startKey = toDateKey(rangeStart);
  const endKey = toDateKey(rangeEnd);

  return records
    .filter((record) => isWithinRange(toDateKey(record.date), startKey, endKey))
    .map((record) => ({
      id: `record-${record.id}`,
      type: EVENT_TYPES.MEDICAL_RECORD,
      title: record.title,
      date: toDateKey(record.date),
      time: null,
      memberId: record.memberId ?? "me",
      to: EVENT_TYPE_META[EVENT_TYPES.MEDICAL_RECORD].to,
    }));
}

export function buildCalendarEvents(
  { appointments = [], reminders = [], records = [] },
  rangeStart,
  rangeEnd,
) {
  return [
    ...buildAppointmentEvents(appointments, rangeStart, rangeEnd),
    ...buildMedicineReminderEvents(reminders, rangeStart, rangeEnd),
    ...buildMedicalRecordEvents(records, rangeStart, rangeEnd),
  ].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? -1 : 1;
    return (a.time ?? "").localeCompare(b.time ?? "");
  });
}

export function filterEventsByVisibility(events, visibility) {
  return events.filter((event) => {
    if (event.type === EVENT_TYPES.APPOINTMENT)
      return visibility.showAppointments;
    if (event.type === EVENT_TYPES.MEDICINE_REMINDER)
      return visibility.showReminders;
    if (event.type === EVENT_TYPES.MEDICAL_RECORD)
      return visibility.showRecords;
    return true;
  });
}

/**
 * Filters events to a single family member, or returns every event when
 * "all" is passed.
 * @param {Array<object>} events
 * @param {string} memberFilter
 * @returns {Array<object>}
 */
export function filterEventsByMember(events, memberFilter) {
  if (!memberFilter || memberFilter === "all") return events;
  return events.filter((event) => event.memberId === memberFilter);
}

export function groupEventsByDate(events) {
  return groupByField(events, "date");
}

export function getUpcomingEvents(events, today, limit = 7) {
  const todayKey = toDateKey(today);
  return events.filter((event) => event.date >= todayKey).slice(0, limit);
}

export function getTodayEvents(events, today) {
  const todayKey = toDateKey(today);
  return events.filter((event) => event.date === todayKey);
}

export function buildTimelineGroups(events, today) {
  const todayKey = toDateKey(today);
  const tomorrowKey = toDateKey(addDays(today, 1));
  const weekEndKey = toDateKey(addDays(today, 7));

  const groups = { Today: [], Tomorrow: [], "This Week": [], Later: [] };

  events
    .filter((event) => event.date >= todayKey)
    .forEach((event) => {
      if (event.date === todayKey) groups.Today.push(event);
      else if (event.date === tomorrowKey) groups.Tomorrow.push(event);
      else if (event.date <= weekEndKey) groups["This Week"].push(event);
      else groups.Later.push(event);
    });

  return groups;
}
