import { useCallback, useSyncExternalStore } from "react";
import {
  getComparisonIds,
  toggleComparison,
  isInComparison,
  subscribeToComparison,
  MAX_COMPARISON_ITEMS,
} from "@/services/comparison/comparison.service.js";

const EMPTY_SNAPSHOT = "[]";

/**
 * Reactive access to the current medicine comparison selection. Re-renders
 * automatically whenever the selection changes anywhere in the app.
 * @returns {{
 *   ids: Array<string>,
 *   count: number,
 *   isSelected: (id: string) => boolean,
 *   toggle: (id: string) => boolean,
 *   isFull: boolean,
 * }}
 */
export function useComparison() {
  const snapshot = useSyncExternalStore(
    subscribeToComparison,
    () => JSON.stringify(getComparisonIds()),
    () => EMPTY_SNAPSHOT,
  );

  const ids = JSON.parse(snapshot);

  const toggle = useCallback((id) => toggleComparison(id), []);
  const checkIsSelected = useCallback((id) => isInComparison(id), []);

  return {
    ids,
    count: ids.length,
    isSelected: checkIsSelected,
    toggle,
    isFull: ids.length >= MAX_COMPARISON_ITEMS,
  };
}
