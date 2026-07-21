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
    gender: profile?.gender || "",
    emergencyContact,
    notes: "",
    isSelf: true,
  };
}

export function getAllMembers() {
  return [buildMeMember(), ...getMembers()];
}

export function getMemberById(id) {
  if (!id || id === ME_MEMBER_ID) return buildMeMember();
  return getMembers().find((member) => member.id === id) ?? null;
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
