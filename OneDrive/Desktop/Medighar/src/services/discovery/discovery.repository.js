/**
 * Owns the only data-access concern for feature-discovery state: which
 * routes the user has ever opened. Mirrors the preferences repository
 * pattern used throughout this project.
 */

const STORAGE_KEY = "medighar:visitedFeatures";
const CHANGE_EVENT = "visitedFeatures:change";

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Returns the raw list of visited route paths, or null if nothing has
 * been saved yet. Callers should treat a null/missing value as "no
 * routes visited."
 * @returns {string[]|null}
 */
export function getStoredVisitedFeatures() {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? safeParse(raw) : null;
}

/**
 * Persists the full list of visited route paths and notifies any
 * subscribed hooks.
 * @param {string[]} visited
 */
export function setStoredVisitedFeatures(visited) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(visited));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Subscribes to visited-feature changes made anywhere in the app.
 * @param {() => void} callback
 * @returns {() => void} unsubscribe function
 */
export function subscribeToVisitedFeatures(callback) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}