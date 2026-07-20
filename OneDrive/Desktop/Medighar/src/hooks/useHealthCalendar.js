import { useCallback, useMemo, useState } from "react";
import { useAppointments } from "@/hooks/useAppointments.js";
import { useReminders } from "@/hooks/useReminders.js";
import { useMedicalRecords } from "@/hooks/useMedicalRecords.js";
import { useFamilyProfiles } from "@/hooks/useFamilyProfiles.js";
import {
  buildCalendarEvents,
  filterEventsByVisibility,
  filterEventsByMember,
  groupEventsByDate,
  getUpcomingEvents,
  getTodayEvents,
  buildTimelineGroups,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
} from "@/services/calendar/calendar.service.js";

const LOOKAHEAD_DAYS = 60;

export function useHealthCalendar() {
  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const { upcoming: upcomingAppointments, past: pastAppointments } =
    useAppointments();
  const {
    upcoming: upcomingReminders,
    completed: completedReminders,
    disabled: disabledReminders,
  } = useReminders();
  const { filteredRecords } = useMedicalRecords();
  const { members } = useFamilyProfiles();

  const allAppointments = useMemo(
    () => [...upcomingAppointments, ...pastAppointments],
    [upcomingAppointments, pastAppointments],
  );
  const allReminders = useMemo(
    () => [...upcomingReminders, ...completedReminders, ...disabledReminders],
    [upcomingReminders, completedReminders, disabledReminders],
  );

  const [viewMode, setViewMode] = useState("month");
  const [cursorDate, setCursorDate] = useState(today);
  const [showAppointments, setShowAppointments] = useState(true);
  const [showReminders, setShowReminders] = useState(true);
  const [showRecords, setShowRecords] = useState(true);
  const [memberFilter, setMemberFilter] = useState("all");

  const visibility = { showAppointments, showReminders, showRecords };

  const goToToday = useCallback(() => setCursorDate(today), [today]);
  const goToPrevious = useCallback(() => {
    setCursorDate((previous) =>
      viewMode === "week"
        ? addDays(previous, -7)
        : addDays(startOfMonth(previous), -1),
    );
  }, [viewMode]);
  const goToNext = useCallback(() => {
    setCursorDate((previous) =>
      viewMode === "week"
        ? addDays(previous, 7)
        : addDays(endOfMonth(previous), 1),
    );
  }, [viewMode]);

  const viewRange = useMemo(() => {
    if (viewMode === "week") {
      return { start: startOfWeek(cursorDate), end: endOfWeek(cursorDate) };
    }
    return {
      start: startOfWeek(startOfMonth(cursorDate)),
      end: endOfWeek(endOfMonth(cursorDate)),
    };
  }, [viewMode, cursorDate]);

  const viewEvents = useMemo(() => {
    const events = buildCalendarEvents(
      {
        appointments: allAppointments,
        reminders: allReminders,
        records: filteredRecords,
      },
      viewRange.start,
      viewRange.end,
    );
    const visible = filterEventsByVisibility(events, visibility);
    return filterEventsByMember(visible, memberFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    allAppointments,
    allReminders,
    filteredRecords,
    viewRange,
    showAppointments,
    showReminders,
    showRecords,
    memberFilter,
  ]);

  const eventsByDate = useMemo(
    () => groupEventsByDate(viewEvents),
    [viewEvents],
  );

  const lookaheadRange = useMemo(
    () => ({ start: today, end: addDays(today, LOOKAHEAD_DAYS) }),
    [today],
  );

  const lookaheadEvents = useMemo(() => {
    const events = buildCalendarEvents(
      {
        appointments: allAppointments,
        reminders: allReminders,
        records: filteredRecords,
      },
      lookaheadRange.start,
      lookaheadRange.end,
    );
    const visible = filterEventsByVisibility(events, visibility);
    return filterEventsByMember(visible, memberFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    allAppointments,
    allReminders,
    filteredRecords,
    lookaheadRange,
    showAppointments,
    showReminders,
    showRecords,
    memberFilter,
  ]);

  const upcomingEvents = useMemo(
    () => getUpcomingEvents(lookaheadEvents, today, 7),
    [lookaheadEvents, today],
  );
  const todayEvents = useMemo(
    () => getTodayEvents(lookaheadEvents, today),
    [lookaheadEvents, today],
  );
  const timelineGroups = useMemo(
    () => buildTimelineGroups(lookaheadEvents, today),
    [lookaheadEvents, today],
  );

  return {
    today,
    viewMode,
    setViewMode,
    cursorDate,
    goToToday,
    goToPrevious,
    goToNext,
    visibility,
    setShowAppointments,
    setShowReminders,
    setShowRecords,
    memberFilter,
    setMemberFilter,
    familyMembers: members,
    viewRange,
    eventsByDate,
    upcomingEvents,
    todayEvents,
    timelineGroups,
  };
}
