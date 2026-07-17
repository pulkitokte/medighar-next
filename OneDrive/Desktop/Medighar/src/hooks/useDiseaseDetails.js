import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getDiseaseDetails,
  getDiseaseById,
} from "@/services/diseases/diseases.service.js";
import { getMedicineById } from "@/services/medicines/medicines.service.js";
import { getDoctorById } from "@/services/doctors/doctors.service.js";
import { getPharmacyById } from "@/services/pharmacy/pharmacy.service.js";
import { resolveByIds } from "@/shared/lib/serviceHelpers.js";
import { useRecordRecentView } from "@/hooks/useRecordRecentView.js";

/**
 * Loads a single disease's details for the Disease Details page, along with
 * its related medicines, doctors, pharmacies, and other diseases. Each
 * relationship is resolved from the disease's own id arrays by calling the
 * relevant module's existing service — no cross-domain service imports
 * anywhere except here, at the hook layer. Also registers this disease as
 * recently viewed automatically.
 * @returns {{
 *   disease: object|null,
 *   recommendedMedicines: Array<object>,
 *   relatedDiseases: Array<object>,
 *   recommendedDoctors: Array<object>,
 *   recommendedPharmacies: Array<object>,
 *   loading: boolean,
 *   error: unknown,
 *   notFound: boolean,
 * }}
 */
export function useDiseaseDetails() {
  const { diseaseId } = useParams();

  const [loading] = useState(false);
  const [error] = useState(null);

  const disease = useMemo(() => getDiseaseDetails(diseaseId), [diseaseId]);

  const recommendedMedicines = useMemo(
    () => resolveByIds(disease?.recommendedMedicineIds, getMedicineById),
    [disease],
  );

  const relatedDiseases = useMemo(
    () => resolveByIds(disease?.relatedDiseaseIds, getDiseaseById),
    [disease],
  );

  const recommendedDoctors = useMemo(
    () => resolveByIds(disease?.recommendedDoctorIds, getDoctorById),
    [disease],
  );

  const recommendedPharmacies = useMemo(
    () => resolveByIds(disease?.recommendedPharmacyIds, getPharmacyById),
    [disease],
  );

  const notFound = !loading && !error && disease === null;

  useRecordRecentView("disease", disease ? diseaseId : null);

  return {
    disease,
    recommendedMedicines,
    relatedDiseases,
    recommendedDoctors,
    recommendedPharmacies,
    loading,
    error,
    notFound,
  };
}
