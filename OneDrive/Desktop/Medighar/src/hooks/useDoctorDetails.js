import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getDoctorDetails } from "@/services/doctors/doctors.service.js";
import { getDiseasesTreatedByDoctor } from "@/services/diseases/diseases.service.js";
import { useRecordRecentView } from "@/hooks/useRecordRecentView.js";

/**
 * Loads a single doctor's details for the Doctor Details page, along with
 * the diseases they treat. The reverse relationship is owned by the
 * Diseases module (via recommendedDoctorIds), so it's resolved here by
 * calling diseases.service directly rather than duplicating the
 * relationship on the doctor record. Also registers this doctor as
 * recently viewed automatically.
 * @returns {{
 *   doctor: object|null,
 *   treatsDiseases: Array<object>,
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

  const treatsDiseases = useMemo(
    () => (doctorId ? getDiseasesTreatedByDoctor(doctorId) : []),
    [doctorId],
  );

  const notFound = !loading && !error && doctor === null;

  useRecordRecentView("doctor", doctor ? doctorId : null);

  return {
    doctor,
    treatsDiseases,
    loading,
    error,
    notFound,
  };
}
