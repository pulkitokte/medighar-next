import {
  getProfile,
  setProfile,
  clearProfile,
  subscribeToProfile,
} from "@/services/medicalProfile/medicalProfile.repository.js";

export { getProfile, subscribeToProfile };

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
export const GENDER_OPTIONS = ["Male", "Female", "Other"];
export const ORGAN_DONOR_OPTIONS = ["Yes", "No"];

export const PROFILE_FIELDS = [
  "fullName",
  "dob",
  "bloodGroup",
  "height",
  "weight",
  "gender",
  "emergencyContactName",
  "emergencyContactNumber",
  "primaryDoctor",
  "allergies",
  "chronicConditions",
  "currentMedications",
  "organDonor",
  "notes",
];

function isFilled(value) {
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}

/**
 * Validates the minimum fields needed for a profile to be useful in an
 * emergency. Every other field is optional and only affects completion.
 * @param {object} values
 * @returns {{ errors: Record<string, string>, isValid: boolean }}
 */
export function validateProfile(values = {}) {
  const errors = {};

  if (!isFilled(values.fullName)) errors.fullName = "Full name is required.";
  if (!isFilled(values.bloodGroup))
    errors.bloodGroup = "Blood group is required.";
  if (!isFilled(values.emergencyContactName)) {
    errors.emergencyContactName = "Emergency contact name is required.";
  }
  if (!isFilled(values.emergencyContactNumber)) {
    errors.emergencyContactNumber = "Emergency contact number is required.";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
}

/**
 * Validates and saves a member's medical profile.
 * @param {string} memberId
 * @param {object} values
 * @returns {{ success: boolean, errors?: Record<string, string>, profile?: object }}
 */
export function saveProfile(memberId, values) {
  const { errors, isValid } = validateProfile(values);

  if (!isValid) {
    return { success: false, errors };
  }

  const record = {};
  PROFILE_FIELDS.forEach((field) => {
    record[field] =
      typeof values[field] === "string"
        ? values[field].trim()
        : (values[field] ?? "");
  });
  record.updatedAt = Date.now();

  setProfile(memberId, record);

  return { success: true, profile: record };
}

/**
 * Deletes a member's medical profile entirely, using local state only.
 * @param {string} memberId
 */
export function deleteProfile(memberId) {
  clearProfile(memberId);
}

/**
 * Alias for deleteProfile — "Reset" clears the stored profile back to
 * empty for the given member.
 * @param {string} memberId
 */
export function resetProfile(memberId) {
  clearProfile(memberId);
}

/**
 * Computes the percentage of profile fields that have been filled in.
 * @param {object|null} profile
 * @returns {number}
 */
export function computeCompletionPercentage(profile) {
  if (!profile) return 0;

  const filledCount = PROFILE_FIELDS.filter((field) =>
    isFilled(profile[field]),
  ).length;

  return Math.round((filledCount / PROFILE_FIELDS.length) * 100);
}

/**
 * Splits a comma-separated free-text field (allergies, conditions,
 * medications) into a clean list for display purposes.
 * @param {string} value
 * @returns {Array<string>}
 */
export function splitListField(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
