import { useCallback, useSyncExternalStore } from "react";
import {
  getHasSeenWelcome,
  markWelcomeSeen,
  subscribeToOnboarding,
} from "@/services/onboarding/onboarding.service.js";

/**
 * Exposes the first-visit welcome card's dismissed state to the UI.
 * Currently consumed only by DashboardPage.jsx, but built as a
 * repository/service/hook triple like every other piece of persisted
 * state in this app, rather than local component state, so the
 * dismissal genuinely persists across sessions.
 * @returns {{ hasSeenWelcome: boolean, dismiss: () => void }}
 */
export function useFirstVisit() {
  const hasSeenWelcome = useSyncExternalStore(
    subscribeToOnboarding,
    getHasSeenWelcome,
    () => false,
  );

  const dismiss = useCallback(() => markWelcomeSeen(), []);

  return { hasSeenWelcome, dismiss };
}
