import { useCallback, useSyncExternalStore } from "react";
import {
  getVisitedFeatures,
  markFeatureVisited,
  isFeatureNew,
  subscribeToVisitedFeatures,
} from "@/services/discovery/discovery.service.js";

const EMPTY_SNAPSHOT = "[]";

/**
 * Exposes first-visit "New" badge state to the UI. Reused by Navbar (to
 * render badges) and MainLayout (to mark routes visited on navigation).
 */
export function useFeatureDiscovery() {
  const snapshot = useSyncExternalStore(
    subscribeToVisitedFeatures,
    () => JSON.stringify(getVisitedFeatures()),
    () => EMPTY_SNAPSHOT,
  );

  const isNew = useCallback(
    (path) => {
      // snapshot dependency keeps this recomputed on every visited-list change
      void snapshot;
      return isFeatureNew(path);
    },
    [snapshot],
  );

  return { isNew, markVisited: markFeatureVisited };
}