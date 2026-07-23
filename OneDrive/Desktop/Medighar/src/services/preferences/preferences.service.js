import {
  getStoredPreferences,
  setStoredPreferences,
  clearStoredPreferences,
  subscribeToPreferences,
} from "@/services/preferences/preferences.repository.js";

export { subscribeToPreferences };

export const THEME_OPTIONS = ["system", "light", "dark"];
export const FONT_SIZE_OPTIONS = ["small", "medium", "large"];
export const READING_WIDTH_OPTIONS = ["comfortable", "wide"];
export const LANGUAGE_OPTIONS = ["english", "hindi"];
export const NOTIFICATION_PREFERENCE_KEYS = [
  "appointments",
  "reminders",
  "milestones",
  "birthdays",
  "reports",
];

export const NOTIFICATION_PREFERENCE_LABELS = {
  appointments: "Appointment notifications",
  reminders: "Reminder notifications",
  milestones: "Health milestone notifications",
  birthdays: "Birthday notifications",
  reports: "Report notifications",
};

export const DEFAULT_PREFERENCES = Object.freeze({
  theme: "system",
  fontSize: "medium",
  reducedMotion: false,
  highContrast: false,
  readingWidth: "comfortable",
  compactMode: false,
  language: "english",
  notifications: Object.freeze({
    appointments: true,
    reminders: true,
    milestones: true,
    birthdays: true,
    reports: true,
  }),
});

function sanitizeEnum(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}

function sanitizeBoolean(value, fallback) {
  return typeof value === "boolean" ? value : fallback;
}

function sanitizeNotifications(rawNotifications) {
  const source =
    rawNotifications && typeof rawNotifications === "object"
      ? rawNotifications
      : {};
  const sanitized = {};

  NOTIFICATION_PREFERENCE_KEYS.forEach((key) => {
    sanitized[key] = sanitizeBoolean(
      source[key],
      DEFAULT_PREFERENCES.notifications[key],
    );
  });

  return sanitized;
}

/**
 * Validates and normalizes a raw preferences object against known enums
 * and defaults. Any missing or invalid field silently falls back to its
 * default rather than throwing, so a partially corrupt or outdated stored
 * value never breaks the app.
 * @param {object} raw
 * @returns {object}
 */
export function sanitizePreferences(raw = {}) {
  return {
    theme: sanitizeEnum(raw.theme, THEME_OPTIONS, DEFAULT_PREFERENCES.theme),
    fontSize: sanitizeEnum(
      raw.fontSize,
      FONT_SIZE_OPTIONS,
      DEFAULT_PREFERENCES.fontSize,
    ),
    reducedMotion: sanitizeBoolean(
      raw.reducedMotion,
      DEFAULT_PREFERENCES.reducedMotion,
    ),
    highContrast: sanitizeBoolean(
      raw.highContrast,
      DEFAULT_PREFERENCES.highContrast,
    ),
    readingWidth: sanitizeEnum(
      raw.readingWidth,
      READING_WIDTH_OPTIONS,
      DEFAULT_PREFERENCES.readingWidth,
    ),
    compactMode: sanitizeBoolean(
      raw.compactMode,
      DEFAULT_PREFERENCES.compactMode,
    ),
    language: sanitizeEnum(
      raw.language,
      LANGUAGE_OPTIONS,
      DEFAULT_PREFERENCES.language,
    ),
    notifications: sanitizeNotifications(raw.notifications),
  };
}

/**
 * Returns the current, fully-validated preferences. Always returns a
 * complete object, even if nothing (or something partial/corrupt) has
 * been stored yet.
 * @returns {object}
 */
export function getPreferences() {
  return sanitizePreferences(getStoredPreferences() ?? {});
}

/**
 * Updates a single top-level preference field.
 * @param {string} key
 * @param {unknown} value
 * @returns {object} the full, updated preferences object
 */
export function updatePreference(key, value) {
  const current = getPreferences();
  const next = sanitizePreferences({ ...current, [key]: value });

  setStoredPreferences(next);

  return next;
}

/**
 * Updates a single notification preference field.
 * @param {string} key
 * @param {boolean} value
 * @returns {object} the full, updated preferences object
 */
export function updateNotificationPreference(key, value) {
  const current = getPreferences();
  const next = sanitizePreferences({
    ...current,
    notifications: { ...current.notifications, [key]: value },
  });

  setStoredPreferences(next);

  return next;
}

/**
 * Resets every preference back to its default value.
 * @returns {object} the default preferences object
 */
export function resetPreferences() {
  clearStoredPreferences();
  return sanitizePreferences({});
}
