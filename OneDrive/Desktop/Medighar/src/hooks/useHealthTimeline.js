import { useMemo, useState, useSyncExternalStore } from "react";
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
  buildTimelineEvents,
  filterByCategory,
  filterByMember,
  searchEvents,
  computeTimelineStats,
} from "@/services/timeline/timeline.service.js";

const EMPTY_PROFILES_SNAPSHOT = "{}";
const EMPTY_REPORTS_SNAPSHOT = "[]";

export function useHealthTimeline() {
  const { upcoming: upcomingAppointments, past: pastAppointments } =
    useAppointments();
  const {
    upcoming: upcomingReminders,
    completed: completedReminders,
    disabled: disabledReminders,
  } = useReminders();
  const { filteredRecords } = useMedicalRecords();
  const { members } = useFamilyProfiles();

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

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [memberFilter, setMemberFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { events: allEvents, error } = useMemo(() => {
    try {
      const events = buildTimelineEvents({
        appointments: allAppointments,
        reminders: allReminders,
        records: filteredRecords,
        memberProfiles,
        familyMembers: members,
        reportLogs,
      });
      return { events, error: null };
    } catch (caughtError) {
      return {
        events: [],
        error:
          caughtError instanceof Error
            ? caughtError.message
            : "Failed to build timeline.",
      };
    }
  }, [
    allAppointments,
    allReminders,
    filteredRecords,
    memberProfiles,
    members,
    reportLogs,
  ]);

  const filteredEvents = useMemo(() => {
    let events = filterByCategory(allEvents, categoryFilter);
    events = filterByMember(events, memberFilter);
    events = searchEvents(events, searchQuery);
    return events;
  }, [allEvents, categoryFilter, memberFilter, searchQuery]);

  const stats = useMemo(() => computeTimelineStats(allEvents), [allEvents]);

  return {
    events: filteredEvents,
    stats,
    members,
    categoryFilter,
    setCategoryFilter,
    memberFilter,
    setMemberFilter,
    searchQuery,
    setSearchQuery,
    loading: false,
    error,
  };
}
