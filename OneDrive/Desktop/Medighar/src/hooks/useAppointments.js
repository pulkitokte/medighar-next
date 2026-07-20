import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  getAllAppointments,
  cancelAppointment,
  deriveAppointmentStatus,
  subscribeToAppointments,
} from "@/services/appointments/appointments.service.js";
import { getDoctorById } from "@/services/doctors/doctors.service.js";
import { getMemberById } from "@/services/family/family.service.js";

const EMPTY_SNAPSHOT = "[]";

export function useAppointments() {
  const snapshot = useSyncExternalStore(
    subscribeToAppointments,
    () => JSON.stringify(getAllAppointments()),
    () => EMPTY_SNAPSHOT,
  );

  const enriched = useMemo(() => {
    const appointments = JSON.parse(snapshot);

    return appointments.map((appointment) => {
      const memberId = appointment.memberId ?? "me";

      return {
        ...appointment,
        memberId,
        status: deriveAppointmentStatus(appointment),
        doctor: getDoctorById(appointment.doctorId),
        member: getMemberById(memberId),
      };
    });
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
