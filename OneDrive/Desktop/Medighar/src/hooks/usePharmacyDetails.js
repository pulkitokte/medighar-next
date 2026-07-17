import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getPharmacyDetails } from "@/services/pharmacy/pharmacy.service.js";
import { useRecordRecentView } from "@/hooks/useRecordRecentView.js";

/**
 * Loads a single pharmacy's details for the Pharmacy Details page.
 * The pharmacy id is read from the route params. UI components never touch
 * the repository or service directly. Also registers this pharmacy as
 * recently viewed automatically.
 * @returns {{
 *   pharmacy: object|null,
 *   loading: boolean,
 *   error: unknown,
 *   notFound: boolean,
 * }}
 */
export function usePharmacyDetails() {
  const { pharmacyId } = useParams();

  const [loading] = useState(false);
  const [error] = useState(null);

  const pharmacy = useMemo(() => getPharmacyDetails(pharmacyId), [pharmacyId]);
  const notFound = !loading && !error && pharmacy === null;

  useRecordRecentView("pharmacy", pharmacy ? pharmacyId : null);

  return {
    pharmacy,
    loading,
    error,
    notFound,
  };
}
