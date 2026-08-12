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

function buildMeMember() {
  const profile = getProfile(ME_MEMBER_ID);

  const emergencyContact = profile?.emergencyContactName
    ? `${profile.emergencyContactName}${profile.emergencyContactNumber ? ` · ${profile.emergencyContactNumber}` : ""}`
    : "";

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
    emergencyContact,
    notes: "",
    isSelf: true,
  };
}

/**
 * Overlays the resolved (Medical-Profile-aware) blood group onto a raw
 * stored family member record, without mutating or persisting anything.
 * Every other field on the record — including gender, which is
 * intentionally NOT part of this resolution — passes through unchanged.
 * @param {object} member
 * @returns {object}
 */
function resolveMember(member) {
  const { bloodGroup, bloodGroupManagedByMedicalProfile } = resolveBloodGroup(
    member.id,
    member.bloodGroup,
  );

  return { ...member, bloodGroup, bloodGroupManagedByMedicalProfile };
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
 * Note: this still writes whatever bloodGroup value is submitted into
 * the raw family-member record, exactly as before. That write is
 * harmless even for a member whose blood group is Medical-Profile-
 * managed, since resolveMember() always overrides it on read — but the
 * UI layer (FamilyProfilesPage) additionally disables the blood-group
 * field for such members so this case should not normally occur via the
 * form.
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