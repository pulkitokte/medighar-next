import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  getAllReminders,
  subscribeToReminders,
  deriveReminderStatus,
  enableReminder,
  disableReminder,
  deleteReminder,
} from "@/services/reminders/reminders.service.js";
import { getMedicineById } from "@/services/medicines/medicines.service.js";
import { useAppointments } from "@/hooks/useAppointments.js";

const EMPTY_SNAPSHOT = "[]";

/**
 * Loads every reminder, enriched with its resolved medicine or appointment
 * and derived status, split into upcoming / completed / disabled. Reuses
 * useAppointments() to resolve appointment-linked reminders rather than
 * re-deriving appointment data here.
 * @returns {{
 *   upcoming: Array<object>,
 *   completed: Array<object>,
 *   disabled: Array<object>,
 *   totalCount: number,
 *   enable: (id: string) => void,
 *   disable: (id: string) => void,
 *   remove: (id: string) => void,
 * }}
 */
export function useReminders() {
  const snapshot = useSyncExternalStore(
    subscribeToReminders,
    () => JSON.stringify(getAllReminders()),
    () => EMPTY_SNAPSHOT,
  );

  const reminders = useMemo(() => JSON.parse(snapshot), [snapshot]);

  const { upcoming: upcomingAppointments, past: pastAppointments } =
    useAppointments();

  const allAppointments = useMemo(
    () => [...upcomingAppointments, ...pastAppointments],
    [upcomingAppointments, pastAppointments],
  );

  const enriched = useMemo(
    () =>
      reminders.map((reminder) => {
        if (reminder.type === "medicine") {
          const medicine = getMedicineById(reminder.medicineId);
          return {
            ...reminder,
            medicine,
            status: deriveReminderStatus(reminder),
          };
        }

        const appointment =
          allAppointments.find(
            (candidate) => candidate.id === reminder.appointmentId,
          ) ?? null;

        return {
          ...reminder,
          appointment,
          status: deriveReminderStatus(reminder, { appointment }),
        };
      }),
    [reminders, allAppointments],
  );

  const upcoming = useMemo(
    () => enriched.filter((reminder) => reminder.status === "upcoming"),
    [enriched],
  );
  const completed = useMemo(
    () => enriched.filter((reminder) => reminder.status === "completed"),
    [enriched],
  );
  const disabled = useMemo(
    () => enriched.filter((reminder) => reminder.status === "disabled"),
    [enriched],
  );

  const enable = useCallback((id) => enableReminder(id), []);
  const disable = useCallback((id) => disableReminder(id), []);
  const remove = useCallback((id) => deleteReminder(id), []);

  return {
    upcoming,
    completed,
    disabled,
    totalCount: enriched.length,
    enable,
    disable,
    remove,
  };
}
