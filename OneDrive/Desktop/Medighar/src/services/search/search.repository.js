/**
 * Owns the only data-access concern for global search: the recent-search
 * query list. Search results themselves are never persisted — they're
 * always recomputed live from existing modules. Mirrors every other
 * feature's repository pattern in this project.
 */

const STORAGE_KEY = "medighar:recent-searches";
const CHANGE_EVENT = "search:change";
const MAX_RECENT = 10;

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Returns the last searched queries, newest first.
 * @returns {Array<string>}
 */
export function getRecentSearches() {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? (safeParse(raw) ?? []) : [];
}

/**
 * Adds a query to the recent-search list, moving it to the front if it
 * already exists (case-insensitive), capped at 10 entries.
 * @param {string} query
 */
export function addRecentSearch(query) {
  const trimmed = query.trim();
  if (!trimmed) return;

  const existing = getRecentSearches().filter(
    (entry) => entry.toLowerCase() !== trimmed.toLowerCase(),
  );

  const next = [trimmed, ...existing].slice(0, MAX_RECENT);

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Clears every recent search.
 */
export function clearRecentSearches() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Subscribes to recent-search changes made anywhere in the app.
 * @param {() => void} callback
 * @returns {() => void} unsubscribe function
 */
export function subscribeToRecentSearches(callback) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}
