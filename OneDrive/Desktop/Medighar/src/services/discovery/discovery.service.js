import {
  getStoredVisitedFeatures,
  setStoredVisitedFeatures,
  subscribeToVisitedFeatures,
} from "@/services/discovery/discovery.repository.js";

export { subscribeToVisitedFeatures };

/**
 * Routes eligible for a "New" badge in navigation. Intentionally limited
 * to secondary/personal features (not Home, Doctors, Medicines, Diseases,
 * Pharmacy, or Dashboard, which are primary nav items every user is
 * expected to find immediately).
 */
export const DISCOVERABLE_FEATURES = [
  "/saved",
  "/recent",
  "/compare",
  "/appointments",
  "/reminders",
  "/medical-records",
  "/medical-profile",
  "/family",
  "/passport",
  "/calendar",
  "/insights",
  "/timeline",
  "/reports",
  "/notifications",
  "/settings",
];

/**
 * Returns the sanitized list of visited route paths. Always returns an
 * array, even if nothing has been stored yet.
 * @returns {string[]}
 */
export function getVisitedFeatures() {
  const stored = getStoredVisitedFeatures();
  return Array.isArray(stored) ? stored : [];
}

/**
 * Records a route path as visited. No-ops for routes that aren't in
 * DISCOVERABLE_FEATURES, and no-ops if already recorded, to avoid
 * unnecessary writes/events.
 * @param {string} path
 */
export function markFeatureVisited(path) {
  if (!DISCOVERABLE_FEATURES.includes(path)) return;

  const current = getVisitedFeatures();
  if (current.includes(path)) return;

  setStoredVisitedFeatures([...current, path]);
}

/**
 * Whether a route should currently show a "New" badge: it must be a
 * discoverable feature the user has never opened.
 * @param {string} path
 * @returns {boolean}
 */
export function isFeatureNew(path) {
  if (!DISCOVERABLE_FEATURES.includes(path)) return false;
  return !getVisitedFeatures().includes(path);
}

/**
 * Prefix distinguishing a contextual discovery hint's dismissal key from
 * a real route path in the same underlying storage array. This keeps
 * "hint dismissed" and "route visited for nav badge purposes" as
 * genuinely separate concepts — see hasSeenHint/markHintSeen below —
 * while reusing the exact same generic repository rather than
 * introducing a second localStorage key or persistence mechanism.
 * A hint key can never collide with a real route path (which always
 * starts with "/"), and is never matched by DISCOVERABLE_FEATURES, so it
 * can never accidentally affect Navbar's "New" badge logic above.
 */
const HINT_KEY_PREFIX = "hint:";

/**
 * Whether the contextual discovery hint identified by hintKey has
 * already been dismissed.
 * @param {string} hintKey e.g. "doctors", "medical-records"
 * @returns {boolean}
 */
export function hasSeenHint(hintKey) {
  return getVisitedFeatures().includes(`${HINT_KEY_PREFIX}${hintKey}`);
}

/**
 * Marks a contextual discovery hint as permanently dismissed.
 * @param {string} hintKey e.g. "doctors", "medical-records"
 */
export function markHintSeen(hintKey) {
  const storageKey = `${HINT_KEY_PREFIX}${hintKey}`;
  const current = getVisitedFeatures();
  if (current.includes(storageKey)) return;

  setStoredVisitedFeatures([...current, storageKey]);
}
