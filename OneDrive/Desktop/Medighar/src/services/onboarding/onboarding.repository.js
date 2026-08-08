/**
 * Owns the only data-access concern for the first-visit welcome flag:
 * reading and writing to localStorage. Mirrors every other repository's
 * pattern in this project (preferences, discovery, search, etc.).
 * Deliberately separate from discovery.repository.js — that module
 * stores an array of visited route paths, a fundamentally different
 * shape than this single boolean, so extending it would blur two
 * unrelated responsibilities rather than reuse one.
 */

const STORAGE_KEY = "medighar:hasSeenWelcome";
const CHANGE_EVENT = "onboarding:change";

/**
 * Returns whether the first-visit welcome card has already been
 * dismissed, or null if nothing has been stored yet.
 * @returns {boolean|null}
 */
export function getStoredHasSeenWelcome() {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw === null ? null : raw === "true";
}

/**
 * Persists the welcome-seen flag and notifies any subscribed hooks.
 * @param {boolean} value
 */
export function setStoredHasSeenWelcome(value) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, String(value));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Subscribes to welcome-flag changes made anywhere in the app.
 * @param {() => void} callback
 * @returns {() => void} unsubscribe function
 */
export function subscribeToOnboarding(callback) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}
