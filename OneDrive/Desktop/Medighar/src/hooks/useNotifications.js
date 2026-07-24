import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { useAppointments } from "@/hooks/useAppointments.js";
import { useReminders } from "@/hooks/useReminders.js";
import { useMedicalRecords } from "@/hooks/useMedicalRecords.js";
import { useFamilyProfiles } from "@/hooks/useFamilyProfiles.js";
import {
  getAllProfiles,
  subscribeToProfile,
} from "@/services/medicalProfile/medicalProfile.service.js";
import {
  getAllReportLogs,
  subscribeToReports,
} from "@/services/reports/report.service.js";
import {
  buildNotifications,
  buildActivityFeed,
  filterNotificationsByFilter,
  searchNotifications,
  computeNotificationStats,
  groupNotificationsByRecency,
  markAsRead,
  markAllAsRead,
  dismissNotification,
  clearAllNotifications,
  subscribeToNotifications,
} from "@/services/notifications/notification.service.js";
import {
  getReadIds,
  getDismissedIds,
} from "@/services/notifications/notifications.repository.js";
import { toDateKey } from "@/services/calendar/calendar.service.js";

const EMPTY_SNAPSHOT = "[]";
const EMPTY_PROFILES_SNAPSHOT = "{}";
const EMPTY_REPORTS_SNAPSHOT = "[]";

/**
 * Aggregates data from every existing module (Appointments, Reminders,
 * Medical Records, Medical Profile, Family Profiles, Health Reports) into
 * the Smart Notifications & Activity Center. Reuses each module's existing
 * hooks/services directly — creates no storage of its own beyond
 * read/dismissed state, and duplicates no business logic.
 * @returns {object}
 */
export function useNotifications() {
  const { upcoming: upcomingAppointments, past: pastAppointments } =
    useAppointments();
  const {
    upcoming: upcomingReminders,
    completed: completedReminders,
    disabled: disabledReminders,
  } = useReminders();
  const { filteredRecords } = useMedicalRecords();
  const { members } = useFamilyProfiles();

  const readSnapshot = useSyncExternalStore(
    subscribeToNotifications,
    () => JSON.stringify(getReadIds()),
    () => EMPTY_SNAPSHOT,
  );

  const dismissedSnapshot = useSyncExternalStore(
    subscribeToNotifications,
    () => JSON.stringify(getDismissedIds()),
    () => EMPTY_SNAPSHOT,
  );

  const profilesSnapshot = useSyncExternalStore(
    subscribeToProfile,
    () => JSON.stringify(getAllProfiles()),
    () => EMPTY_PROFILES_SNAPSHOT,
  );

  const reportsSnapshot = useSyncExternalStore(
    subscribeToReports,
    () => JSON.stringify(getAllReportLogs()),
    () => EMPTY_REPORTS_SNAPSHOT,
  );

  const now = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => toDateKey(now), [now]);

  const allAppointments = useMemo(
    () => [...upcomingAppointments, ...pastAppointments],
    [upcomingAppointments, pastAppointments],
  );
  const allReminders = useMemo(
    () => [...upcomingReminders, ...completedReminders, ...disabledReminders],
    [upcomingReminders, completedReminders, disabledReminders],
  );

  const memberProfiles = useMemo(() => {
    const profiles = JSON.parse(profilesSnapshot);

    return members.map((member) => ({
      id: member.id,
      fullName: member.fullName,
      profile: profiles[member.id] ?? null,
    }));
  }, [profilesSnapshot, members]);

  const reportLogs = useMemo(
    () => JSON.parse(reportsSnapshot),
    [reportsSnapshot],
  );

  const allNotifications = useMemo(
    () =>
      buildNotifications(
        {
          appointments: allAppointments,
          reminders: allReminders,
          records: filteredRecords,
          memberProfiles,
          familyMembers: members,
          reportLogs,
          rawAppointments: {
            upcoming: upcomingAppointments,
            past: pastAppointments,
          },
          rawReminders: {
            upcoming: upcomingReminders,
            completed: completedReminders,
            disabled: disabledReminders,
          },
        },
        now,
        todayKey,
      ),
    // readSnapshot/dismissedSnapshot intentionally drive recomputation of
    // resolved read/dismissed state
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      allAppointments,
      allReminders,
      filteredRecords,
      memberProfiles,
      members,
      reportLogs,
      now,
      todayKey,
      readSnapshot,
      dismissedSnapshot,
    ],
  );

  const activityFeed = useMemo(
    () =>
      buildActivityFeed(allNotifications, {
        appointments: allAppointments,
        reminders: allReminders,
        records: filteredRecords,
        memberProfiles,
        familyMembers: members,
        reportLogs,
      }),
    [
      allNotifications,
      allAppointments,
      allReminders,
      filteredRecords,
      memberProfiles,
      members,
      reportLogs,
    ],
  );

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotifications = useMemo(() => {
    let notifications = filterNotificationsByFilter(
      allNotifications,
      activeFilter,
    );
    notifications = searchNotifications(notifications, searchQuery);
    return notifications;
  }, [allNotifications, activeFilter, searchQuery]);

  const groupedNotifications = useMemo(
    () => groupNotificationsByRecency(filteredNotifications, now),
    [filteredNotifications, now],
  );

  const stats = useMemo(
    () => computeNotificationStats(allNotifications),
    [allNotifications],
  );

  const allIds = useMemo(
    () => allNotifications.map((notification) => notification.id),
    [allNotifications],
  );

  const markRead = useCallback((id) => markAsRead(id), []);
  const markAllRead = useCallback(() => markAllAsRead(allIds), [allIds]);
  const dismiss = useCallback((id) => dismissNotification(id), []);
  const clearAll = useCallback(() => clearAllNotifications(allIds), [allIds]);

  return {
    notifications: filteredNotifications,
    groupedNotifications,
    recentNotifications: allNotifications.slice(0, 5),
    activityFeed,
    stats,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    markRead,
    markAllRead,
    dismiss,
    clearAll,
    loading: false,
    error: null,
  };
}
