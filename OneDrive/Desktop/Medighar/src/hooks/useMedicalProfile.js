import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  getProfile,
  saveProfile,
  deleteProfile,
  resetProfile,
  computeCompletionPercentage,
  subscribeToProfile,
} from "@/services/medicalProfile/medicalProfile.service.js";

const EMPTY_SNAPSHOT = "null";

/**
 * Reactive access to the single Emergency Medical Profile record and its
 * completion percentage. Re-renders automatically whenever the profile is
 * saved, edited, or reset anywhere in the app.
 * @returns {{
 *   profile: object|null,
 *   completion: number,
 *   isComplete: boolean,
 *   save: (values: object) => { success: boolean, errors?: object, profile?: object },
 *   remove: () => void,
 *   reset: () => void,
 * }}
 */
export function useMedicalProfile() {
  const snapshot = useSyncExternalStore(
    subscribeToProfile,
    () => JSON.stringify(getProfile()),
    () => EMPTY_SNAPSHOT,
  );

  const profile = useMemo(() => JSON.parse(snapshot), [snapshot]);
  const completion = useMemo(
    () => computeCompletionPercentage(profile),
    [profile],
  );

  const save = useCallback((values) => saveProfile(values), []);
  const remove = useCallback(() => deleteProfile(), []);
  const reset = useCallback(() => resetProfile(), []);

  return {
    profile,
    completion,
    isComplete: completion === 100,
    save,
    remove,
    reset,
  };
}
