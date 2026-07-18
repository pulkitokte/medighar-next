import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  getAllAppointments,
  cancelAppointment,
  deriveAppointmentStatus,
  subscribeToAppointments,
} from "@/services/appointments/appointments.service.js";
import { getDoctorById } from "@/services/doctors/doctors.service.js";

const EMPTY_SNAPSHOT = "[]";

/**
 * Loads every stored appointment, enriched with its derived status and
 * resolved doctor, split into upcoming and past. Mirrors
 * useSavedItems.js / useRecentItems.js's reactive subscription pattern.
 * @returns {{
 *   upcoming: Array<object>,
 *   past: Array<object>,
 *   totalCount: number,
 *   cancel: (id: string) => void,
 * }}
 */
export function useAppointments() {
  const snapshot = useSyncExternalStore(
    subscribeToAppointments,
    () => JSON.stringify(getAllAppointments()),
    () => EMPTY_SNAPSHOT,
  );

  const enriched = useMemo(() => {
    const appointments = JSON.parse(snapshot);

    return appointments.map((appointment) => ({
      ...appointment,
      status: deriveAppointmentStatus(appointment),
      doctor: getDoctorById(appointment.doctorId),
    }));
  }, [snapshot]);

  const upcoming = useMemo(
    () =>
      enriched
        .filter((appointment) => appointment.status === "upcoming")
        .sort((a, b) => new Date(a.date) - new Date(b.date)),
    [enriched],
  );

  const past = useMemo(
    () =>
      enriched
        .filter((appointment) => appointment.status !== "upcoming")
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [enriched],
  );

  const cancel = useCallback((id) => cancelAppointment(id), []);

  return { upcoming, past, totalCount: enriched.length, cancel };
}
