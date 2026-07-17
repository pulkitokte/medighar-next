import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getMedicineDetails } from "@/services/medicines/medicines.service.js";
import { getDiseasesUsingMedicine } from "@/services/diseases/diseases.service.js";
import { useRecordRecentView } from "@/hooks/useRecordRecentView.js";

/**
 * Loads a single medicine's details for the Medicine Details page, along
 * with the diseases that recommend it. The reverse relationship is owned by
 * the Diseases module (via recommendedMedicineIds), so it's resolved here
 * by calling diseases.service directly rather than duplicating the
 * relationship on the medicine record. Also registers this medicine as
 * recently viewed automatically.
 * @returns {{
 *   medicine: object|null,
 *   usedForDiseases: Array<object>,
 *   loading: boolean,
 *   error: unknown,
 *   notFound: boolean,
 * }}
 */
export function useMedicineDetails() {
  const { medicineId } = useParams();

  const [loading] = useState(false);
  const [error] = useState(null);

  const medicine = useMemo(() => getMedicineDetails(medicineId), [medicineId]);

  const usedForDiseases = useMemo(
    () => (medicineId ? getDiseasesUsingMedicine(medicineId) : []),
    [medicineId],
  );

  const notFound = !loading && !error && medicine === null;

  useRecordRecentView("medicine", medicine ? medicineId : null);

  return {
    medicine,
    usedForDiseases,
    loading,
    error,
    notFound,
  };
}
