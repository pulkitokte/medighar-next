/**
 * Owns the only data-access concern for the Emergency Medical Profile:
 * reading and writing to localStorage. Unlike every other module, this
 * stores a single record (or null), not a list. This is the layer that
 * will change if the profile later migrates to Firestore — nothing above
 * this file (service, hook, UI) will be affected by that migration.
 */

const STORAGE_KEY = "medighar:medical-profile";
const CHANGE_EVENT = "medical-profile:change";

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Returns the stored medical profile, or null if none exists.
 * @returns {object|null}
 */
export function getProfile() {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? safeParse(raw) : null;
}

/**
 * Persists the medical profile and notifies any subscribed hooks.
 * @param {object} profile
 */
export function setProfile(profile) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Clears the stored medical profile entirely.
 */
export function clearProfile() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Subscribes to medical profile changes made anywhere in the app.
 * @param {() => void} callback
 * @returns {() => void} unsubscribe function
 */
export function subscribeToProfile(callback) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}
