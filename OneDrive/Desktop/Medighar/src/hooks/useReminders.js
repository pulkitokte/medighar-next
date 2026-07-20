import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  getAllReminders,
  deriveReminderStatus,
  enableReminder,
  disableReminder,
  deleteReminder,
  subscribeToReminders,
} from "@/services/reminders/reminders.service.js";
import { getMedicineById } from "@/services/medicines/medicines.service.js";
import { getMemberById } from "@/services/family/family.service.js";
import { useAppointments } from "@/hooks/useAppointments.js";

const EMPTY_SNAPSHOT = "[]";

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
        const memberId = reminder.memberId ?? "me";

        if (reminder.type === "medicine") {
          const medicine = getMedicineById(reminder.medicineId);
          return {
            ...reminder,
            memberId,
            medicine,
            member: getMemberById(memberId),
            status: deriveReminderStatus(reminder),
          };
        }

        const appointment =
          allAppointments.find(
            (candidate) => candidate.id === reminder.appointmentId,
          ) ?? null;

        return {
          ...reminder,
          memberId,
          appointment,
          member: getMemberById(memberId),
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
