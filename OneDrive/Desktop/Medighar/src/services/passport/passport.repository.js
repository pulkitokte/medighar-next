/**
 * Owns the only data-access concern for the Health Passport: a minimal
 * action log (generated/printed). Passport content is NEVER persisted —
 * it's always recomputed live from existing modules. Mirrors
 * reports.repository.js exactly.
 */

const STORAGE_KEY = "medighar:passport-log";
const CHANGE_EVENT = "passport:change";

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Returns every logged passport action entry.
 * @returns {Array<object>}
 */
export function getPassportLog() {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? (safeParse(raw) ?? []) : [];
}

/**
 * Appends one passport action log entry and notifies any subscribed
 * hooks.
 * @param {object} entry
 */
export function addPassportLogEntry(entry) {
  if (typeof window === "undefined") return;

  const next = [...getPassportLog(), entry];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Subscribes to passport-log changes made anywhere in the app.
 * @param {() => void} callback
 * @returns {() => void} unsubscribe function
 */
export function subscribeToPassport(callback) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}