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
const DEFAULT_MEMBER_ID = "me";

/**
 * Reactive access to a single family member's Emergency Medical Profile
 * and its completion percentage. Defaults to "me" so every existing
 * caller (Dashboard, Insights, the profile page itself) continues to work
 * unchanged. Re-renders whenever any profile is saved, edited, or reset.
 * @param {string} [memberId]
 * @returns {{
 *   profile: object|null,
 *   completion: number,
 *   isComplete: boolean,
 *   save: (values: object) => object,
 *   remove: () => void,
 *   reset: () => void,
 * }}
 */
export function useMedicalProfile(memberId = DEFAULT_MEMBER_ID) {
  const snapshot = useSyncExternalStore(
    subscribeToProfile,
    () => JSON.stringify(getProfile(memberId)),
    () => EMPTY_SNAPSHOT,
  );

  const profile = useMemo(() => JSON.parse(snapshot), [snapshot]);
  const completion = useMemo(
    () => computeCompletionPercentage(profile),
    [profile],
  );

  const save = useCallback(
    (values) => saveProfile(memberId, values),
    [memberId],
  );
  const remove = useCallback(() => deleteProfile(memberId), [memberId]);
  const reset = useCallback(() => resetProfile(memberId), [memberId]);

  return {
    profile,
    completion,
    isComplete: completion === 100,
    save,
    remove,
    reset,
  };
}
