import { useCallback, useSyncExternalStore } from "react";
import {
  getBookmarkedIds,
  isBookmarked,
  toggleBookmark,
  subscribeToBookmarks,
} from "@/services/bookmarks/bookmarks.service.js";

const EMPTY_SNAPSHOT = "[]";

/**
 * Reactive access to bookmarked ids for a single entity type ("doctor",
 * "medicine", "disease", "pharmacy"). Re-renders automatically whenever a
 * bookmark of that type is toggled anywhere in the app.
 * @param {"doctor"|"medicine"|"disease"|"pharmacy"} type
 * @returns {{ bookmarkedIds: Array<string>, isBookmarked: (id: string) => boolean, toggle: (id: string) => boolean }}
 */
export function useBookmarks(type) {
  const snapshot = useSyncExternalStore(
    subscribeToBookmarks,
    () => JSON.stringify(getBookmarkedIds(type)),
    () => EMPTY_SNAPSHOT,
  );

  const bookmarkedIds = JSON.parse(snapshot);

  const toggle = useCallback((id) => toggleBookmark(type, id), [type]);
  const checkIsBookmarked = useCallback((id) => isBookmarked(type, id), [type]);

  return { bookmarkedIds, isBookmarked: checkIsBookmarked, toggle };
}
