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

/**
 * Builds the virtual "Me" member from the existing Medical Profile module.
 * Never stored as a family record — reused directly, satisfying "Do NOT
 * duplicate Medical Profile logic."
 * @returns {object}
 */
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

/**
 * Returns every family member, with the virtual "Me" entry always first.
 * @returns {Array<object>}
 */
export function getAllMembers() {
  return [buildMeMember(), ...getMembers()];
}

/**
 * Returns a single member by id, or null if not found. "Me" always
 * resolves via the Medical Profile module.
 * @param {string} id
 * @returns {object|null}
 */
export function getMemberById(id) {
  if (!id || id === ME_MEMBER_ID) return buildMeMember();
  return getMembers().find((member) => member.id === id) ?? null;
}

/**
 * Validates family member form values.
 * @param {object} values
 * @returns {{ errors: Record<string, string>, isValid: boolean }}
 */
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

/**
 * Validates and creates a new family member.
 * @param {object} values
 * @returns {{ success: boolean, errors?: Record<string, string>, member?: object }}
 */
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
 * through this function since it isn't a stored record.
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
    };

    return updated;
  });

  setMembers(next);

  return { success: true, member: updated };
}

/**
 * Deletes a family member by id, using local state only. "Me" cannot be
 * deleted.
 * @param {string} id
 */
export function deleteMember(id) {
  if (id === ME_MEMBER_ID) return;
  setMembers(getMembers().filter((member) => member.id !== id));
}
