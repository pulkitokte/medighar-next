import { useMemo, useSyncExternalStore } from "react";
import {
  getComparisonIds,
  subscribeToComparison,
} from "@/services/comparison/comparison.service.js";
import { getMedicineById } from "@/services/medicines/medicines.service.js";
import { resolveByIds } from "@/shared/lib/serviceHelpers.js";

const EMPTY_SNAPSHOT = "[]";

/**
 * Resolves the selected comparison ids into actual medicine entities, for
 * the Compare Medicines page. Reuses the existing resolveByIds helper and
 * the existing getMedicineById service function, mirroring
 * useSavedItems.js / useRecentItems.js.
 * @returns {{ medicines: Array<object>, count: number }}
 */
export function useComparisonItems() {
  const snapshot = useSyncExternalStore(
    subscribeToComparison,
    () => JSON.stringify(getComparisonIds()),
    () => EMPTY_SNAPSHOT,
  );

  const ids = useMemo(() => JSON.parse(snapshot), [snapshot]);

  const medicines = useMemo(() => resolveByIds(ids, getMedicineById), [ids]);

  return { medicines, count: medicines.length };
}
