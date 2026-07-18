/**
 * Owns the only data-access concern for appointments: reading and writing
 * to localStorage. Mirrors bookmarks/recent/comparison repositories. This
 * is the layer that will change if appointments later migrate to
 * Firestore — nothing above this file (service, hooks, UI) will be
 * affected by that migration.
 */

const STORAGE_KEY = "medighar:appointments";
const CHANGE_EVENT = "appointments:change";

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Returns every stored appointment record.
 * @returns {Array<object>}
 */
export function getAppointments() {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? (safeParse(raw) ?? []) : [];
}

/**
 * Persists the full appointment list and notifies any subscribed hooks.
 * @param {Array<object>} next
 */
export function setAppointments(next) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Subscribes to appointment changes made anywhere in the app.
 * @param {() => void} callback
 * @returns {() => void} unsubscribe function
 */
export function subscribeToAppointments(callback) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}