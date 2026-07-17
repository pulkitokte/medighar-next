/**
 * Owns the only data-access concern for recently viewed entities: reading
 * and writing to localStorage. Mirrors bookmarks.repository.js exactly.
 * This is the layer that will change when recently-viewed history migrates
 * to Firestore (e.g. a `users/{uid}/recentlyViewed` collection) — nothing
 * above this file (service, hooks, UI) will be affected by that migration.
 */

const STORAGE_KEY = "medighar:recent";
const MAX_ENTRIES = 20;
const CHANGE_EVENT = "recent:change";

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Returns every recently viewed entry, newest first.
 * @returns {Array<{type: string, id: string, viewedAt: number}>}
 */
export function getRecentEntries() {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? (safeParse(raw) ?? []) : [];
}

/**
 * Records a view of the given entity. If it's already in the history, the
 * existing entry is removed first so it moves to the top instead of
 * creating a duplicate. Trims history to MAX_ENTRIES.
 * @param {string} type
 * @param {string} id
 */
export function addRecentEntry(type, id) {
  if (typeof window === "undefined") return;

  const existing = getRecentEntries().filter(
    (entry) => !(entry.type === type && entry.id === id),
  );

  const next = [{ type, id, viewedAt: Date.now() }, ...existing].slice(
    0,
    MAX_ENTRIES,
  );

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Subscribes to recently-viewed changes made anywhere in the app.
 * @param {() => void} callback
 * @returns {() => void} unsubscribe function
 */
export function subscribeToRecent(callback) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}
