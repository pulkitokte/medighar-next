import {
  getComparisonIds,
  setComparisonIds,
  subscribeToComparison,
  MAX_ITEMS,
} from "@/services/comparison/comparison.repository.js";

export { getComparisonIds, subscribeToComparison };

export const MAX_COMPARISON_ITEMS = MAX_ITEMS;
export const MIN_COMPARISON_ITEMS = 2;

/**
 * Returns whether the given medicine is currently selected for comparison.
 * @param {string} id
 * @returns {boolean}
 */
export function isInComparison(id) {
  return getComparisonIds().includes(id);
}

/**
 * Toggles a medicine's comparison selection on or off. If the medicine is
 * not already selected and the selection is already at MAX_COMPARISON_ITEMS,
 * this is a no-op (the medicine is not added). Returns the new selected
 * state (true if now selected, false if now removed or unchanged at max).
 * @param {string} id
 * @returns {boolean}
 */
export function toggleComparison(id) {
  const current = getComparisonIds();

  if (current.includes(id)) {
    setComparisonIds(current.filter((existingId) => existingId !== id));
    return false;
  }

  if (current.length >= MAX_COMPARISON_ITEMS) {
    return false;
  }

  setComparisonIds([...current, id]);
  return true;
}
