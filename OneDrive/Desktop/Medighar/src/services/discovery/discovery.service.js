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