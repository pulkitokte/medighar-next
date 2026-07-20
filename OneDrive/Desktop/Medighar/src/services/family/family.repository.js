/**
 * Owns the only data-access concern for family members: reading and
 * writing to localStorage. Stores ONLY additional members — "Me" is never
 * stored here; it is derived from the existing Medical Profile module, so
 * this repository never duplicates that data.
 */

const STORAGE_KEY = "medighar:family-members";
const CHANGE_EVENT = "family:change";

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Returns every stored family member (excluding "Me").
 * @returns {Array<object>}
 */
export function getMembers() {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? (safeParse(raw) ?? []) : [];
}

/**
 * Persists the family member list and notifies any subscribed hooks.
 * @param {Array<object>} next
 */
export function setMembers(next) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Subscribes to family member changes made anywhere in the app.
 * @param {() => void} callback
 * @returns {() => void} unsubscribe function
 */
export function subscribeToFamily(callback) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}
