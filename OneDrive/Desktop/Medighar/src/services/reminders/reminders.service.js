import {
  getReminders,
  setReminders,
  subscribeToReminders,
} from "@/services/reminders/reminders.repository.js";
import { getAllAppointments } from "@/services/appointments/appointments.service.js";

export { subscribeToReminders };

export const FREQUENCY_OPTIONS = [
  "Once Daily",
  "Twice Daily",
  "Three Times Daily",
];

export const LEAD_TIME_OPTIONS = [
  { key: "30-min", label: "30 minutes before" },
  { key: "1-hour", label: "1 hour before" },
  { key: "3-hours", label: "3 hours before" },
  { key: "1-day", label: "1 day before" },
];

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getAllReminders() {
  return getReminders();
}

export function validateMedicineReminder(values = {}) {
  const errors = {};

  if (!values.medicineId) errors.medicineId = "Please select a medicine.";
  if (!values.dosage || !values.dosage.trim())
    errors.dosage = "Dosage is required.";
  if (!values.frequency) errors.frequency = "Please select a frequency.";
  if (!values.startDate) errors.startDate = "Start date is required.";

  if (!values.endDate) {
    errors.endDate = "End date is required.";
  } else if (
    values.startDate &&
    new Date(values.endDate) < new Date(values.startDate)
  ) {
    errors.endDate = "End date must be on or after the start date.";
  }

  if (!values.reminderTime) errors.reminderTime = "Reminder time is required.";

  return { errors, isValid: Object.keys(errors).length === 0 };
}

export function createMedicineReminder(values) {
  const { errors, isValid } = validateMedicineReminder(values);

  if (!isValid) {
    return { success: false, errors };
  }

  const record = {
    id: generateId("reminder"),
    type: "medicine",
    memberId: values.memberId || "me",
    enabled: true,
    createdAt: Date.now(),
    medicineId: values.medicineId,
    dosage: values.dosage.trim(),
    frequency: values.frequency,
    startDate: values.startDate,
    endDate: values.endDate,
    reminderTime: values.reminderTime,
  };

  setReminders([...getReminders(), record]);

  return { success: true, reminder: record };
}

/**
 * Validates the appointment-reminder form. In addition to presence
 * checks, cross-references the selected appointment's actual owner
 * against the selected family member: appointment.memberId is
 * normalized with the same `?? "me"` convention used throughout the
 * app (see family.service.js, RemindersPage.jsx's dependent-record
 * counting, etc.), and a mismatch is rejected with a clear error rather
 * than silently persisted. This is defense-in-depth alongside the
 * member-filtered appointment dropdown in RemindersPage.jsx — it
 * ensures no path (including any future UI change) can create a
 * reminder whose memberId and appointment owner disagree.
 * @param {{ memberId?: string, appointmentId?: string, leadTime?: string }} values
 * @returns {{ errors: Record<string, string>, isValid: boolean }}
 */
export function validateAppointmentReminderForm(values = {}) {
  const errors = {};

  if (!values.appointmentId) {
    errors.appointmentId = "Please select an appointment.";
  } else {
    const appointment = getAllAppointments().find(
      (candidate) => candidate.id === values.appointmentId,
    );
    const selectedMemberId = values.memberId || "me";
    const appointmentMemberId = appointment
      ? (appointment.memberId ?? "me")
      : null;

    if (appointment && appointmentMemberId !== selectedMemberId) {
      errors.appointmentId =
        "This appointment does not belong to the selected family member.";
    }
  }

  if (!values.leadTime) errors.leadTime = "Please select when to be reminded.";

  return { errors, isValid: Object.keys(errors).length === 0 };
}

export function createAppointmentReminder(values) {
  const { errors, isValid } = validateAppointmentReminderForm(values);

  if (!isValid) {
    return { success: false, errors };
  }

  const record = {
    id: generateId("reminder"),
    type: "appointment",
    memberId: values.memberId || "me",
    enabled: true,
    createdAt: Date.now(),
    appointmentId: values.appointmentId,
    leadTime: values.leadTime,
  };

  setReminders([...getReminders(), record]);

  return { success: true, reminder: record };
}

export function enableReminder(id) {
  setReminders(
    getReminders().map((reminder) =>
      reminder.id === id ? { ...reminder, enabled: true } : reminder,
    ),
  );
}

export function disableReminder(id) {
  setReminders(
    getReminders().map((reminder) =>
      reminder.id === id ? { ...reminder, enabled: false } : reminder,
    ),
  );
}

export function deleteReminder(id) {
  setReminders(getReminders().filter((reminder) => reminder.id !== id));
}

export function deriveReminderStatus(reminder, context = {}) {
  if (!reminder.enabled) return "disabled";

  if (reminder.type === "medicine") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(reminder.endDate);
    end.setHours(0, 0, 0, 0);

    return end >= today ? "upcoming" : "completed";
  }

  const appointment = context.appointment;
  if (!appointment) return "completed";

  return appointment.status === "upcoming" ? "upcoming" : "completed";
}
