/**
 * Owns the only data-access concern for reminders: reading and writing to
 * localStorage. Mirrors appointments/reviews/bookmarks/recent/comparison
 * repositories. This is the layer that will change if reminders later
 * migrate to Firestore — nothing above this file (service, hooks, UI) will
 * be affected by that migration.
 */

const STORAGE_KEY = "medighar:reminders";
const CHANGE_EVENT = "reminders:change";

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Returns every stored reminder record.
 * @returns {Array<object>}
 */
export function getReminders() {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? (safeParse(raw) ?? []) : [];
}

/**
 * Persists the full reminder list and notifies any subscribed hooks.
 * @param {Array<object>} next
 */
export function setReminders(next) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Subscribes to reminder changes made anywhere in the app.
 * @param {() => void} callback
 * @returns {() => void} unsubscribe function
 */
export function subscribeToReminders(callback) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}
