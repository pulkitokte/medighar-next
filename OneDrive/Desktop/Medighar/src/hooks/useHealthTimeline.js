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
  buildTimelineEvents,
  filterByCategory,
  filterByMember,
  searchEvents,
  computeTimelineStats,
} from "@/services/timeline/timeline.service.js";

const EMPTY_PROFILES_SNAPSHOT = "{}";

/**
 * Aggregates data from every existing module (Appointments, Reminders,
 * Medical Records, Medical Profile, Family Profiles) into the Health
 * Timeline view. Reuses each module's existing hooks/services directly —
 * creates no storage of its own and duplicates no business logic.
 *
 * Important: the Medical Profile snapshot below must reflect actual store
 * content (not a clock value like Date.now()), or useSyncExternalStore
 * will never see two equal snapshots in a row and will re-render forever.
 * Event construction happens inside a single useMemo with no setState
 * calls in its body — errors are returned as part of the memoized result,
 * never set as a side effect during render.
 * @returns {object}
 */
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

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [memberFilter, setMemberFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Single memo, no setState inside its body. Errors are a plain part of
  // the returned, memoized value rather than a side effect.
  const { events: allEvents, error } = useMemo(() => {
    try {
      const events = buildTimelineEvents({
        appointments: allAppointments,
        reminders: allReminders,
        records: filteredRecords,
        memberProfiles,
        familyMembers: members,
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
  }, [allAppointments, allReminders, filteredRecords, memberProfiles, members]);

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
