import {
  getProfile,
  getAllProfiles,
  setProfile,
  clearProfile,
  subscribeToProfile,
} from "@/services/medicalProfile/medicalProfile.repository.js";

export { getProfile, getAllProfiles, subscribeToProfile };

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

export function deleteProfile(memberId) {
  clearProfile(memberId);
}

export function resetProfile(memberId) {
  clearProfile(memberId);
}

export function computeCompletionPercentage(profile) {
  if (!profile) return 0;

  const filledCount = PROFILE_FIELDS.filter((field) =>
    isFilled(profile[field]),
  ).length;

  return Math.round((filledCount / PROFILE_FIELDS.length) * 100);
}

export function splitListField(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
