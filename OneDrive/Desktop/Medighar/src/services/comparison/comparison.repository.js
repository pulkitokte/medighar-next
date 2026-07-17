/**
 * Owns the only data-access concern for medicine comparison selection:
 * reading and writing to localStorage. Mirrors bookmarks.repository.js and
 * recent.repository.js. This is the layer that will change if comparison
 * selection later migrates to Firestore — nothing above this file
 * (service, hooks, UI) will be affected by that migration.
 */

const STORAGE_KEY = "medighar:comparison";
export const MAX_ITEMS = 4;
const CHANGE_EVENT = "comparison:change";

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Returns the selected medicine ids currently in comparison.
 * @returns {Array<string>}
 */
export function getComparisonIds() {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? (safeParse(raw) ?? []) : [];
}

/**
 * Persists the full selection and notifies any subscribed hooks.
 * @param {Array<string>} next
 */
export function setComparisonIds(next) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Subscribes to comparison selection changes made anywhere in the app.
 * @param {() => void} callback
 * @returns {() => void} unsubscribe function
 */
export function subscribeToComparison(callback) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}
