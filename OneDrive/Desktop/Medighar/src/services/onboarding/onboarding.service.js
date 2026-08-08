import {
  getStoredHasSeenWelcome,
  setStoredHasSeenWelcome,
  subscribeToOnboarding,
} from "@/services/onboarding/onboarding.repository.js";

export { subscribeToOnboarding };

/**
 * Returns whether the user has already seen (dismissed) the first-visit
 * welcome card. Defaults to false — a genuinely new visitor, or anyone
 * whose localStorage has never recorded this flag — so the card is
 * shown until explicitly dismissed once.
 * @returns {boolean}
 */
export function getHasSeenWelcome() {
  const stored = getStoredHasSeenWelcome();
  return stored === null ? false : stored;
}

/**
 * Marks the welcome card as permanently dismissed.
 */
export function markWelcomeSeen() {
  setStoredHasSeenWelcome(true);
}
