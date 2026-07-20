import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  getAllMembers,
  createMember,
  updateMember,
  deleteMember,
  subscribeToFamily,
} from "@/services/family/family.service.js";
import { subscribeToProfile } from "@/services/medicalProfile/medicalProfile.service.js";

const EMPTY_SNAPSHOT = "[]";

/**
 * Subscribes to both family-member changes and Medical Profile changes,
 * since the virtual "Me" member's display fields are derived from the
 * Medical Profile module.
 * @param {() => void} callback
 * @returns {() => void}
 */
function subscribeToFamilyAndProfile(callback) {
  const unsubFamily = subscribeToFamily(callback);
  const unsubProfile = subscribeToProfile(callback);
  return () => {
    unsubFamily();
    unsubProfile();
  };
}

/**
 * Reactive access to every family member (including the virtual "Me"
 * entry). Re-renders automatically whenever a member or the Medical
 * Profile changes anywhere in the app.
 * @returns {{
 *   members: Array<object>,
 *   create: (values: object) => object,
 *   update: (id: string, values: object) => object,
 *   remove: (id: string) => void,
 * }}
 */
export function useFamilyProfiles() {
  const snapshot = useSyncExternalStore(
    subscribeToFamilyAndProfile,
    () => JSON.stringify(getAllMembers()),
    () => EMPTY_SNAPSHOT,
  );

  const members = useMemo(() => JSON.parse(snapshot), [snapshot]);

  const create = useCallback((values) => createMember(values), []);
  const update = useCallback((id, values) => updateMember(id, values), []);
  const remove = useCallback((id) => deleteMember(id), []);

  return { members, create, update, remove };
}
