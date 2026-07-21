/**
 * Owns the only data-access concern for notifications: which notification
 * ids have been marked read. Notifications themselves are never persisted
 * — they're regenerated dynamically from existing modules on every read.
 * This repository stores nothing but a flat array of read ids.
 */

const STORAGE_KEY = "medighar:notifications-read";
const CHANGE_EVENT = "notifications:change";

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Returns every notification id currently marked as read.
 * @returns {Array<string>}
 */
export function getReadIds() {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? (safeParse(raw) ?? []) : [];
}

/**
 * Persists the read-id list and notifies any subscribed hooks.
 * @param {Array<string>} next
 */
export function setReadIds(next) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Subscribes to read-state changes made anywhere in the app.
 * @param {() => void} callback
 * @returns {() => void} unsubscribe function
 */
export function subscribeToNotifications(callback) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}
