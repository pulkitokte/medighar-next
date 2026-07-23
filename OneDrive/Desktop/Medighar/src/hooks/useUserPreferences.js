import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  getPreferences,
  updatePreference as updatePreferenceService,
  updateNotificationPreference as updateNotificationPreferenceService,
  resetPreferences as resetPreferencesService,
  subscribeToPreferences,
  DEFAULT_PREFERENCES,
} from "@/services/preferences/preferences.service.js";

const EMPTY_SNAPSHOT = JSON.stringify(DEFAULT_PREFERENCES);

/**
 * Reactive access to the centralized user preferences. Every page/hook
 * that needs appearance, accessibility, notification, or language
 * preferences should read them through this hook rather than touching the
 * service or repository directly.
 * @returns {{
 *   preferences: object,
 *   updatePreference: (key: string, value: unknown) => void,
 *   updateNotificationPreference: (key: string, value: boolean) => void,
 *   resetPreferences: () => void,
 * }}
 */
export function useUserPreferences() {
  const snapshot = useSyncExternalStore(
    subscribeToPreferences,
    () => JSON.stringify(getPreferences()),
    () => EMPTY_SNAPSHOT,
  );

  const preferences = useMemo(() => JSON.parse(snapshot), [snapshot]);

  const updatePreference = useCallback((key, value) => {
    updatePreferenceService(key, value);
  }, []);

  const updateNotificationPreference = useCallback((key, value) => {
    updateNotificationPreferenceService(key, value);
  }, []);

  const resetPreferences = useCallback(() => {
    resetPreferencesService();
  }, []);

  return {
    preferences,
    updatePreference,
    updateNotificationPreference,
    resetPreferences,
  };
}
