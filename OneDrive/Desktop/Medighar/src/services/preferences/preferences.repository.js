/**
 * Owns the only data-access concern for user preferences: reading and
 * writing to localStorage. Mirrors every other feature's repository
 * pattern in this project (reminders, records, reports, etc.).
 */

const STORAGE_KEY = "medighar:preferences";
const CHANGE_EVENT = "preferences:change";

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Returns the raw stored preferences object, or null if nothing has been
 * saved yet. Callers should sanitize this before use.
 * @returns {object|null}
 */
export function getStoredPreferences() {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? safeParse(raw) : null;
}

/**
 * Persists the full preferences object and notifies any subscribed hooks.
 * @param {object} preferences
 */
export function setStoredPreferences(preferences) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Clears stored preferences entirely, returning the app to defaults.
 */
export function clearStoredPreferences() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Subscribes to preference changes made anywhere in the app.
 * @param {() => void} callback
 * @returns {() => void} unsubscribe function
 */
export function subscribeToPreferences(callback) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}
