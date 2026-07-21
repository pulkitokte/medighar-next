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

  return { [DEFAULT_MEMBER_ID]: parsed };
}

function writeProfiles(profiles) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ profiles }));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function getProfile(memberId = DEFAULT_MEMBER_ID) {
  return readProfiles()[memberId] ?? null;
}

/**
 * Returns every stored profile, keyed by memberId. Read-only, additive —
 * used by modules (like the Health Timeline) that need to react to any
 * profile changing, not just one specific member's profile.
 * @returns {Record<string, object>}
 */
export function getAllProfiles() {
  return readProfiles();
}

export function setProfile(memberId = DEFAULT_MEMBER_ID, profile) {
  const profiles = readProfiles();
  writeProfiles({ ...profiles, [memberId]: profile });
}

export function clearProfile(memberId = DEFAULT_MEMBER_ID) {
  const profiles = readProfiles();
  const next = { ...profiles };
  delete next[memberId];
  writeProfiles(next);
}

export function subscribeToProfile(callback) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}
