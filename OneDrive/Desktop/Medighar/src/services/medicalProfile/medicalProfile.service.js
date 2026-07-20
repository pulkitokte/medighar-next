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

/**
 * Every profile field, in form order. Used both for form rendering context
 * and for computing profile completion percentage — one source of truth,
 * reused rather than re-listed anywhere else.
 */
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

const REQUIRED_FIELDS = [
  "fullName",
  "bloodGroup",
  "emergencyContactName",
  "emergencyContactNumber",
];

function isFilled(value) {
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}

/**
 * Validates the minimum fields needed for the profile to be useful in an
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
 * Validates and saves the medical profile, creating or overwriting the
 * single stored record.
 * @param {object} values
 * @returns {{ success: boolean, errors?: Record<string, string>, profile?: object }}
 */
export function saveProfile(values) {
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

  setProfile(record);

  return { success: true, profile: record };
}

/**
 * Deletes the medical profile entirely, using local state only.
 */
export function deleteProfile() {
  clearProfile();
}

/**
 * Alias for deleteProfile — "Reset" clears the stored profile back to
 * empty, same underlying operation as delete.
 */
export function resetProfile() {
  clearProfile();
}

/**
 * Computes the percentage of profile fields that have been filled in.
 * Reused by both the Medical Profile page itself and the Dashboard /
 * Insights integrations, so completion logic exists in exactly one place.
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
