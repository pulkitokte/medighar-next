import {
  getMembers,
  setMembers,
  subscribeToFamily,
} from "@/services/family/family.repository.js";
import { getProfile } from "@/services/medicalProfile/medicalProfile.service.js";

export { subscribeToFamily };

export const ME_MEMBER_ID = "me";

export const RELATIONSHIPS = [
  "Spouse",
  "Child",
  "Parent",
  "Sibling",
  "Grandparent",
  "Grandchild",
  "Other",
];

function generateId() {
  return `member-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function isFilled(value) {
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}

/**
 * Composes a display emergency-contact string from a Medical Profile's
 * separate name/number fields. Mirrors the exact composition
 * buildMeMember() already uses for "me", so "me" and every other member
 * end up formatted identically regardless of source.
 * @param {object} profile
 * @returns {string}
 */
function composeEmergencyContact(profile) {
  if (!isFilled(profile?.emergencyContactName)) return "";

  return `${profile.emergencyContactName}${
    profile.emergencyContactNumber ? ` · ${profile.emergencyContactNumber}` : ""
  }`;
}

/**
 * Resolves the authoritative blood group for a member id: if a Medical
 * Profile exists for that id and has a non-empty bloodGroup, that value
 * takes precedence — mirroring the derivation already used for "me" in
 * buildMeMember(). Otherwise falls back to the family record's own
 * stored bloodGroup. This is a pure read-layer resolution: it never
 * writes to either the family or Medical Profile store, and never
 * mutates the values it receives.
 * @param {string} memberId
 * @param {string} fallbackBloodGroup
 * @returns {{ bloodGroup: string, bloodGroupManagedByMedicalProfile: boolean }}
 */
function resolveBloodGroup(memberId, fallbackBloodGroup) {
  const profile = getProfile(memberId);

  if (profile && isFilled(profile.bloodGroup)) {
    return {
      bloodGroup: profile.bloodGroup,
      bloodGroupManagedByMedicalProfile: true,
    };
  }

  return {
    bloodGroup: fallbackBloodGroup || "",
    bloodGroupManagedByMedicalProfile: false,
  };
}

/**
 * Resolves the authoritative emergency contact for a member id, using
 * the same precedence rule as resolveBloodGroup(): a Medical Profile's
 * emergencyContactName/emergencyContactNumber take precedence when
 * present, otherwise the family record's own free-text emergencyContact
 * string is used. Authoritative-ness is keyed off emergencyContactName
 * specifically, since medicalProfile.service.js's validateProfile
 * requires both emergencyContactName and emergencyContactNumber to save
 * a profile in the first place — a saved profile is never missing one
 * while having the other. Pure read-layer resolution; writes nothing.
 * @param {string} memberId
 * @param {string} fallbackEmergencyContact
 * @returns {{ emergencyContact: string, emergencyContactManagedByMedicalProfile: boolean }}
 */
function resolveEmergencyContact(memberId, fallbackEmergencyContact) {
  const profile = getProfile(memberId);

  if (profile && isFilled(profile.emergencyContactName)) {
    return {
      emergencyContact: composeEmergencyContact(profile),
      emergencyContactManagedByMedicalProfile: true,
    };
  }

  return {
    emergencyContact: fallbackEmergencyContact || "",
    emergencyContactManagedByMedicalProfile: false,
  };
}

function buildMeMember() {
  const profile = getProfile(ME_MEMBER_ID);

  return {
    id: ME_MEMBER_ID,
    fullName: profile?.fullName || "Me",
    relationship: "Self",
    age: null,
    bloodGroup: profile?.bloodGroup || "",
    // "me" has no independent family-store record at all — its blood
    // group has always come exclusively from the Medical Profile module,
    // so it is always considered Medical-Profile-managed. In practice
    // this never reaches an editable form, since "me" is never editable
    // via updateMember/MemberForm.
    bloodGroupManagedByMedicalProfile: true,
    gender: profile?.gender || "",
    emergencyContact: composeEmergencyContact(profile),
    // Same reasoning as bloodGroupManagedByMedicalProfile above.
    emergencyContactManagedByMedicalProfile: true,
    notes: "",
    isSelf: true,
  };
}

/**
 * Overlays the resolved (Medical-Profile-aware) blood group and
 * emergency contact onto a raw stored family member record, without
 * mutating or persisting anything. Every other field on the record —
 * including gender, which is intentionally NOT part of this resolution —
 * passes through unchanged.
 * @param {object} member
 * @returns {object}
 */
function resolveMember(member) {
  const { bloodGroup, bloodGroupManagedByMedicalProfile } = resolveBloodGroup(
    member.id,
    member.bloodGroup,
  );
  const { emergencyContact, emergencyContactManagedByMedicalProfile } =
    resolveEmergencyContact(member.id, member.emergencyContact);

  return {
    ...member,
    bloodGroup,
    bloodGroupManagedByMedicalProfile,
    emergencyContact,
    emergencyContactManagedByMedicalProfile,
  };
}

export function getAllMembers() {
  return [buildMeMember(), ...getMembers().map(resolveMember)];
}

export function getMemberById(id) {
  if (!id || id === ME_MEMBER_ID) return buildMeMember();

  const member = getMembers().find((candidate) => candidate.id === id);
  return member ? resolveMember(member) : null;
}

export function validateMember(values = {}) {
  const errors = {};

  if (!values.fullName || !values.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (!values.relationship) {
    errors.relationship = "Relationship is required.";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
}

export function createMember(values) {
  const { errors, isValid } = validateMember(values);

  if (!isValid) {
    return { success: false, errors };
  }

  const record = {
    id: generateId(),
    fullName: values.fullName.trim(),
    relationship: values.relationship,
    age: values.age ? Number(values.age) : null,
    bloodGroup: values.bloodGroup || "",
    gender: values.gender || "",
    emergencyContact: values.emergencyContact?.trim() ?? "",
    notes: values.notes?.trim() ?? "",
    createdAt: Date.now(),
  };

  setMembers([...getMembers(), record]);

  return { success: true, member: record };
}

/**
 * Validates and updates an existing family member. "Me" cannot be edited
 * through this function since it isn't a stored record. Now stamps
 * updatedAt on every edit so the Health Timeline can surface a
 * "Family Member Updated" event without any additional storage.
 *
 * Note: this still writes whatever bloodGroup/emergencyContact values
 * are submitted into the raw family-member record, exactly as before.
 * Those writes are harmless even for a member whose fields are Medical-
 * Profile-managed, since resolveMember() always overrides them on read —
 * but the UI layer (FamilyProfilesPage) additionally disables both
 * fields for such members so this case should not normally occur via
 * the form.
 * @param {string} id
 * @param {object} values
 * @returns {{ success: boolean, errors?: Record<string, string>, member?: object }}
 */
export function updateMember(id, values) {
  if (id === ME_MEMBER_ID) {
    return {
      success: false,
      errors: {
        fullName: "\u201cMe\u201d is managed via the Medical Profile page.",
      },
    };
  }

  const { errors, isValid } = validateMember(values);

  if (!isValid) {
    return { success: false, errors };
  }

  let updated = null;

  const next = getMembers().map((member) => {
    if (member.id !== id) return member;

    updated = {
      ...member,
      fullName: values.fullName.trim(),
      relationship: values.relationship,
      age: values.age ? Number(values.age) : null,
      bloodGroup: values.bloodGroup || "",
      gender: values.gender || "",
      emergencyContact: values.emergencyContact?.trim() ?? "",
      notes: values.notes?.trim() ?? "",
      updatedAt: Date.now(),
    };

    return updated;
  });

  setMembers(next);

  return { success: true, member: updated };
}

export function deleteMember(id) {
  if (id === ME_MEMBER_ID) return;
  setMembers(getMembers().filter((member) => member.id !== id));
}