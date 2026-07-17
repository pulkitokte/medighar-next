import {
  getRecentEntries,
  addRecentEntry,
  subscribeToRecent,
} from "@/services/recent/recent.repository.js";

export { subscribeToRecent };

/**
 * Records that the given entity was viewed. Newest first, duplicates move
 * to the top instead of creating a second entry, capped at 20 entries.
 * @param {"doctor"|"medicine"|"disease"|"pharmacy"} type
 * @param {string} id
 */
export function recordView(type, id) {
  addRecentEntry(type, id);
}

/**
 * Returns every recently viewed entry, newest first.
 * @returns {Array<{type: string, id: string, viewedAt: number}>}
 */
export function getAllRecentEntries() {
  return getRecentEntries();
}

/**
 * Returns the recently viewed ids for a single entity type, newest first.
 * @param {"doctor"|"medicine"|"disease"|"pharmacy"} type
 * @returns {Array<string>}
 */
export function getRecentIdsByType(type) {
  return getRecentEntries()
    .filter((entry) => entry.type === type)
    .map((entry) => entry.id);
}
