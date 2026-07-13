import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getDiseaseDetails } from "@/services/diseases/diseases.service.js";

/**
 * Loads a single disease's details for the Disease Details page.
 * The disease id is read from the route params. UI components never touch
 * the repository or service directly.
 * @returns {{
 *   disease: object|null,
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
  const notFound = !loading && !error && disease === null;

  return {
    disease,
    loading,
    error,
    notFound,
  };
}
