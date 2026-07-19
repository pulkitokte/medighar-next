/**
 * Owns the only data-access concern for medical records: reading and
 * writing to localStorage. Mirrors reminders/appointments/reviews
 * repositories. This is the layer that will change if records later
 * migrate to Firestore — nothing above this file (service, hooks, UI) will
 * be affected by that migration.
 */

const STORAGE_KEY = "medighar:records";
const CHANGE_EVENT = "records:change";

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Returns every stored medical record.
 * @returns {Array<object>}
 */
export function getRecords() {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? (safeParse(raw) ?? []) : [];
}

/**
 * Persists the full record list and notifies any subscribed hooks.
 * @param {Array<object>} next
 */
export function setRecords(next) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Subscribes to record changes made anywhere in the app.
 * @param {() => void} callback
 * @returns {() => void} unsubscribe function
 */
export function subscribeToRecords(callback) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}
