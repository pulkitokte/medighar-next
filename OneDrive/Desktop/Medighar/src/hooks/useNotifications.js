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
  filterByCategory,
  searchNotifications,
  computeNotificationStats,
  markAsRead,
  markAllAsRead,
  subscribeToNotifications,
} from "@/services/notifications/notification.service.js";
import { getReadIds } from "@/services/notifications/notifications.repository.js";
import { toDateKey } from "@/services/calendar/calendar.service.js";

const EMPTY_SNAPSHOT = "[]";
const EMPTY_PROFILES_SNAPSHOT = "{}";
const EMPTY_REPORTS_SNAPSHOT = "[]";

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
    // readSnapshot intentionally drives recomputation of resolved read state
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
    ],
  );

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotifications = useMemo(() => {
    let notifications = filterByCategory(allNotifications, categoryFilter);
    notifications = searchNotifications(notifications, searchQuery);
    return notifications;
  }, [allNotifications, categoryFilter, searchQuery]);

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

  return {
    notifications: filteredNotifications,
    recentNotifications: allNotifications.slice(0, 5),
    stats,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    markRead,
    markAllRead,
    loading: false,
    error: null,
  };
}
