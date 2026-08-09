import { useCallback, useSyncExternalStore } from "react";
import {
  getVisitedFeatures,
  markFeatureVisited,
  isFeatureNew,
  hasSeenHint,
  markHintSeen,
  subscribeToVisitedFeatures,
} from "@/services/discovery/discovery.service.js";

const EMPTY_SNAPSHOT = "[]";

/**
 * Exposes first-visit "New" badge state and contextual discovery-hint
 * state to the UI, both backed by the same underlying visited-features
 * store (see discovery.service.js for how the two concepts stay
 * distinct). Reused by Navbar (badges) and MainLayout (route tracking)
 * for the former, and by individual pages (e.g. DiscoveryHint mounts)
 * for the latter.
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

  const isHintSeen = useCallback(
    (hintKey) => {
      // snapshot dependency keeps this recomputed on every visited-list change
      void snapshot;
      return hasSeenHint(hintKey);
    },
    [snapshot],
  );

  return {
    isNew,
    markVisited: markFeatureVisited,
    isHintSeen,
    dismissHint: markHintSeen,
  };
}
