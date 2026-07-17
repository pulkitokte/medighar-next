import {
  getBookmarks,
  setBookmarks,
  subscribeToBookmarks,
} from "@/services/bookmarks/bookmarks.repository.js";

export { getBookmarks, subscribeToBookmarks };

/**
 * Returns the bookmarked ids for a single entity type.
 * @param {"doctor"|"medicine"|"disease"|"pharmacy"} type
 * @returns {Array<string>}
 */
export function getBookmarkedIds(type) {
  return getBookmarks()[type] ?? [];
}

/**
 * Returns whether the given entity is currently bookmarked.
 * @param {"doctor"|"medicine"|"disease"|"pharmacy"} type
 * @param {string} id
 * @returns {boolean}
 */
export function isBookmarked(type, id) {
  return getBookmarkedIds(type).includes(id);
}

/**
 * Toggles a bookmark on or off for the given entity. Returns the new
 * bookmarked state (true if now saved, false if now removed).
 * @param {"doctor"|"medicine"|"disease"|"pharmacy"} type
 * @param {string} id
 * @returns {boolean}
 */
export function toggleBookmark(type, id) {
  const bookmarks = getBookmarks();
  const current = bookmarks[type] ?? [];
  const next = current.includes(id)
    ? current.filter((existingId) => existingId !== id)
    : [...current, id];

  setBookmarks({ ...bookmarks, [type]: next });

  return next.includes(id);
}
