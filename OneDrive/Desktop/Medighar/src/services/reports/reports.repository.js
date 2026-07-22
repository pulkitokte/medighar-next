/**
 * Owns the only data-access concern for the Health Report Generator: a
 * minimal log of when reports were generated. Report content itself is
 * NEVER persisted — it's always recomputed live from existing modules.
 * This log exists solely so the Timeline and Notification Center can
 * dynamically surface "Health Report Generated" activity, the same way
 * every other module's own timestamps already power those two features.
 */

const STORAGE_KEY = "medighar:reports-log";
const CHANGE_EVENT = "reports:change";

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Returns every logged report-generation entry.
 * @returns {Array<object>}
 */
export function getReportLog() {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? (safeParse(raw) ?? []) : [];
}

/**
 * Appends one report-generation log entry and notifies any subscribed
 * hooks.
 * @param {object} entry
 */
export function addReportLogEntry(entry) {
  if (typeof window === "undefined") return;

  const next = [...getReportLog(), entry];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Subscribes to report-log changes made anywhere in the app.
 * @param {() => void} callback
 * @returns {() => void} unsubscribe function
 */
export function subscribeToReports(callback) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}
