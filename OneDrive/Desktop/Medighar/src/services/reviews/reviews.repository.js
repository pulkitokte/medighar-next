/**
 * Owns the only data-access concern for doctor reviews: reading and writing
 * to localStorage. Mirrors bookmarks/recent/comparison/appointments
 * repositories. Reviews are stored grouped by doctorId. This is the layer
 * that will change if reviews later migrate to Firestore (e.g. a
 * `doctors/{doctorId}/reviews` subcollection) — nothing above this file
 * (service, hooks, UI) will be affected by that migration.
 */

const STORAGE_KEY = "medighar:reviews";
const CHANGE_EVENT = "reviews:change";

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : null;
  } catch {
    return null;
  }
}

/**
 * Returns every stored review, grouped by doctorId.
 * @returns {Record<string, Array<object>>}
 */
export function getAllReviews() {
  if (typeof window === "undefined") return {};

  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? (safeParse(raw) ?? {}) : {};
}

/**
 * Persists the full grouped reviews object and notifies any subscribed
 * hooks.
 * @param {Record<string, Array<object>>} next
 */
export function setAllReviews(next) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Subscribes to review changes made anywhere in the app.
 * @param {() => void} callback
 * @returns {() => void} unsubscribe function
 */
export function subscribeToReviews(callback) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}
