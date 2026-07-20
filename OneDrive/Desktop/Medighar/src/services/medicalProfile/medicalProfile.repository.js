/**
 * Owns the only data-access concern for Emergency Medical Profiles:
 * reading and writing to localStorage. Storage now holds one profile per
 * family member, keyed by memberId, under a single "profiles" object. A
 * profile previously stored as a single flat object (pre-Family-Profiles)
 * is automatically treated as belonging to "me" on read — no destructive
 * migration, no data loss, same storage key.
 */

const STORAGE_KEY = "medighar:medical-profile";
const CHANGE_EVENT = "medical-profile:change";
const DEFAULT_MEMBER_ID = "me";

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function readProfiles() {
  if (typeof window === "undefined") return {};

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};

  const parsed = safeParse(raw);
  if (!parsed) return {};

  if (parsed.profiles && typeof parsed.profiles === "object") {
    return parsed.profiles;
  }

  // Legacy flat single-profile shape: treat the whole object as "me".
  return { [DEFAULT_MEMBER_ID]: parsed };
}

function writeProfiles(profiles) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ profiles }));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Returns the stored medical profile for the given member, or null.
 * @param {string} [memberId]
 * @returns {object|null}
 */
export function getProfile(memberId = DEFAULT_MEMBER_ID) {
  return readProfiles()[memberId] ?? null;
}

/**
 * Persists a member's medical profile and notifies any subscribed hooks.
 * @param {string} memberId
 * @param {object} profile
 */
export function setProfile(memberId = DEFAULT_MEMBER_ID, profile) {
  const profiles = readProfiles();
  writeProfiles({ ...profiles, [memberId]: profile });
}

/**
 * Clears a member's stored medical profile.
 * @param {string} [memberId]
 */
export function clearProfile(memberId = DEFAULT_MEMBER_ID) {
  const profiles = readProfiles();
  const next = { ...profiles };
  delete next[memberId];
  writeProfiles(next);
}

/**
 * Subscribes to medical profile changes made anywhere in the app.
 * @param {() => void} callback
 * @returns {() => void} unsubscribe function
 */
export function subscribeToProfile(callback) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}
