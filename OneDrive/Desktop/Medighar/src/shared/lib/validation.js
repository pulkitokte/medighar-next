/**
 * Generic, entity-agnostic validation and normalization helpers used across
 * repositories and services for defensive data handling. Must never contain
 * logic specific to any single domain.
 */

/**
 * Returns whether the given value is a usable entity id.
 * @param {unknown} id
 * @returns {boolean}
 */
export function isValidId(id) {
  return typeof id === "string" && id.trim().length > 0;
}

/**
 * Returns the value if it's an array, otherwise an empty array.
 * @param {unknown} value
 * @returns {Array<unknown>}
 */
export function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

/**
 * Returns the value if it's a plain object, otherwise an empty object.
 * @param {unknown} value
 * @returns {Record<string, unknown>}
 */
export function ensureObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

/**
 * Returns a deep clone of the given value, safe for arrays, objects, and
 * primitives. Falls back to JSON-based cloning if structuredClone is
 * unavailable.
 * @param {unknown} value
 * @returns {unknown}
 */
export function safeClone(value) {
  if (value === undefined) return value;

  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
}

/**
 * Trims and lowercases a string for consistent comparison. Returns an
 * empty string for non-string input.
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeString(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}
