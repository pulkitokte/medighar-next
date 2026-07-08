import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getDoctorDetails } from "@/services/doctors/doctors.service.js";

/**
 * Loads a single doctor's details for the Doctor Details page.
 * The doctor id is read from the route params. UI components never touch
 * the repository or service directly.
 * @returns {{
 *   doctor: object|null,
 *   loading: boolean,
 *   error: unknown,
 *   notFound: boolean,
 * }}
 */
export function useDoctorDetails() {
  const { doctorId } = useParams();

  const [loading] = useState(false);
  const [error] = useState(null);

  const doctor = useMemo(() => getDoctorDetails(doctorId), [doctorId]);
  const notFound = !loading && !error && doctor === null;

  return {
    doctor,
    loading,
    error,
    notFound,
  };
}
