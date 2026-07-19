import {
  getReminders,
  setReminders,
  subscribeToReminders,
} from "@/services/reminders/reminders.repository.js";

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

/**
 * Returns every stored reminder record.
 * @returns {Array<object>}
 */
export function getAllReminders() {
  return getReminders();
}

/**
 * Validates medicine reminder form values.
 * @param {object} values
 * @returns {{ errors: Record<string, string>, isValid: boolean }}
 */
export function validateMedicineReminder(values = {}) {
  const errors = {};

  if (!values.medicineId) {
    errors.medicineId = "Please select a medicine.";
  }

  if (!values.dosage || !values.dosage.trim()) {
    errors.dosage = "Dosage is required.";
  }

  if (!values.frequency) {
    errors.frequency = "Please select a frequency.";
  }

  if (!values.startDate) {
    errors.startDate = "Start date is required.";
  }

  if (!values.endDate) {
    errors.endDate = "End date is required.";
  } else if (
    values.startDate &&
    new Date(values.endDate) < new Date(values.startDate)
  ) {
    errors.endDate = "End date must be on or after the start date.";
  }

  if (!values.reminderTime) {
    errors.reminderTime = "Reminder time is required.";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
}

/**
 * Validates and creates a medicine reminder.
 * @param {{ medicineId: string, dosage: string, frequency: string, startDate: string, endDate: string, reminderTime: string }} values
 * @returns {{ success: boolean, errors?: Record<string, string>, reminder?: object }}
 */
export function createMedicineReminder(values) {
  const { errors, isValid } = validateMedicineReminder(values);

  if (!isValid) {
    return { success: false, errors };
  }

  const record = {
    id: generateId("reminder"),
    type: "medicine",
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
 * Validates appointment reminder form values.
 * @param {object} values
 * @returns {{ errors: Record<string, string>, isValid: boolean }}
 */
export function validateAppointmentReminderForm(values = {}) {
  const errors = {};

  if (!values.appointmentId) {
    errors.appointmentId = "Please select an appointment.";
  }

  if (!values.leadTime) {
    errors.leadTime = "Please select when to be reminded.";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
}

/**
 * Validates and creates a reminder linked to an existing appointment.
 * @param {{ appointmentId: string, leadTime: string }} values
 * @returns {{ success: boolean, errors?: Record<string, string>, reminder?: object }}
 */
export function createAppointmentReminder(values) {
  const { errors, isValid } = validateAppointmentReminderForm(values);

  if (!isValid) {
    return { success: false, errors };
  }

  const record = {
    id: generateId("reminder"),
    type: "appointment",
    enabled: true,
    createdAt: Date.now(),
    appointmentId: values.appointmentId,
    leadTime: values.leadTime,
  };

  setReminders([...getReminders(), record]);

  return { success: true, reminder: record };
}

/**
 * Enables a reminder by id, using local state only.
 * @param {string} id
 */
export function enableReminder(id) {
  setReminders(
    getReminders().map((reminder) =>
      reminder.id === id ? { ...reminder, enabled: true } : reminder,
    ),
  );
}

/**
 * Disables a reminder by id, using local state only.
 * @param {string} id
 */
export function disableReminder(id) {
  setReminders(
    getReminders().map((reminder) =>
      reminder.id === id ? { ...reminder, enabled: false } : reminder,
    ),
  );
}

/**
 * Deletes a reminder by id, using local state only.
 * @param {string} id
 */
export function deleteReminder(id) {
  setReminders(getReminders().filter((reminder) => reminder.id !== id));
}

/**
 * Derives a reminder's current status. A manually disabled reminder always
 * reports "disabled" regardless of dates. Otherwise, medicine reminders are
 * "completed" once their end date has passed; appointment reminders follow
 * the linked appointment's own derived status.
 * @param {object} reminder
 * @param {{ appointment?: object|null }} [context]
 * @returns {"upcoming"|"completed"|"disabled"}
 */
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
