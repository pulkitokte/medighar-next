import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getMedicineDetails } from "@/services/medicines/medicines.service.js";

/**
 * Loads a single medicine's details for the Medicine Details page.
 * The medicine id is read from the route params. UI components never touch
 * the repository or service directly.
 * @returns {{
 *   medicine: object|null,
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
  const notFound = !loading && !error && medicine === null;

  return {
    medicine,
    loading,
    error,
    notFound,
  };
}
