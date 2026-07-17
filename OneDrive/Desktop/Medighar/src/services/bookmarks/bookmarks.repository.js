/**
 * Owns the only data-access concern for bookmarks: reading and writing to
 * localStorage. This is the layer that will change when bookmarks migrate
 * to Firestore (e.g. a `users/{uid}/bookmarks` document) — everything above
 * this file (service, hooks, UI) will be unaffected by that migration.
 */

const STORAGE_KEY = "medighar:bookmarks";

const EMPTY_BOOKMARKS = {
  doctor: [],
  medicine: [],
  disease: [],
  pharmacy: [],
};

const CHANGE_EVENT = "bookmarks:change";

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Returns the full bookmarks object, keyed by entity type. Always returns
 * all four keys, even if nothing has been saved yet.
 * @returns {{doctor: Array<string>, medicine: Array<string>, disease: Array<string>, pharmacy: Array<string>}}
 */
export function getBookmarks() {
  if (typeof window === "undefined") return { ...EMPTY_BOOKMARKS };

  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = raw ? safeParse(raw) : null;

  return { ...EMPTY_BOOKMARKS, ...parsed };
}

/**
 * Persists the full bookmarks object and notifies any subscribed hooks.
 * @param {object} next
 */
export function setBookmarks(next) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Subscribes to bookmark changes made anywhere in the app (any tab/card).
 * @param {() => void} callback
 * @returns {() => void} unsubscribe function
 */
export function subscribeToBookmarks(callback) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}
