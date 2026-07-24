/**
 * Owns the only data-access concern for notifications: which notification
 * ids have been marked read, and which have been dismissed/deleted.
 * Notifications themselves are never persisted — they're regenerated
 * dynamically from existing modules on every read. This repository stores
 * nothing but two small id lists.
 */

const STORAGE_KEY = "medighar:notifications-read";
const DISMISSED_STORAGE_KEY = "medighar:notifications-dismissed";
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
 * Returns every notification id the user has dismissed/deleted. Dismissed
 * notifications are permanently excluded from future generation — this is
 * the only persisted trace of a "deleted" notification, since the
 * notification content itself is never stored.
 * @returns {Array<string>}
 */
export function getDismissedIds() {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(DISMISSED_STORAGE_KEY);
  return raw ? (safeParse(raw) ?? []) : [];
}

/**
 * Persists the dismissed-id list and notifies any subscribed hooks.
 * @param {Array<string>} next
 */
export function setDismissedIds(next) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(DISMISSED_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Subscribes to notification state changes (read or dismissed) made
 * anywhere in the app.
 * @param {() => void} callback
 * @returns {() => void} unsubscribe function
 */
export function subscribeToNotifications(callback) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}
