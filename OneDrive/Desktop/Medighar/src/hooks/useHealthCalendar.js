import { useCallback, useMemo, useState } from "react";
import { useAppointments } from "@/hooks/useAppointments.js";
import { useReminders } from "@/hooks/useReminders.js";
import { useMedicalRecords } from "@/hooks/useMedicalRecords.js";
import {
  buildCalendarEvents,
  filterEventsByVisibility,
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

/**
 * Aggregates data from the existing Appointments, Reminders, and Medical
 * Records modules into a unified calendar/timeline view. Reuses each
 * module's existing hook directly — creates no new storage and duplicates
 * no business logic; it only composes and derives calendar-ready views.
 * @returns {object}
 */
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
    return filterEventsByVisibility(events, visibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    allAppointments,
    allReminders,
    filteredRecords,
    viewRange,
    showAppointments,
    showReminders,
    showRecords,
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
    return filterEventsByVisibility(events, visibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    allAppointments,
    allReminders,
    filteredRecords,
    lookaheadRange,
    showAppointments,
    showReminders,
    showRecords,
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
    viewRange,
    eventsByDate,
    upcomingEvents,
    todayEvents,
    timelineGroups,
  };
}
