import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { useAppointments } from "@/hooks/useAppointments.js";
import { useReminders } from "@/hooks/useReminders.js";
import { useMedicalRecords } from "@/hooks/useMedicalRecords.js";
import { useFamilyProfiles } from "@/hooks/useFamilyProfiles.js";
import { useHealthInsights } from "@/hooks/useHealthInsights.js";
import { useHealthTimeline } from "@/hooks/useHealthTimeline.js";
import {
  getAllProfiles,
  subscribeToProfile,
} from "@/services/medicalProfile/medicalProfile.service.js";
import {
  REPORT_TYPES,
  REPORT_TYPE_META,
  buildReportData,
  logGeneratedReport,
  exportReportAsPdf,
} from "@/services/reports/report.service.js";

const EMPTY_PROFILES_SNAPSHOT = "{}";

/**
 * Aggregates data from every existing module (Appointments, Reminders,
 * Medical Records, Family Profiles, Medical Profile, Health Insights,
 * Health Timeline) into the Health Report Generator. Reuses each module's
 * existing hooks/services directly — creates no storage beyond the report
 * log and duplicates no business logic.
 * @returns {object}
 */
export function useHealthReports() {
  const { upcoming: upcomingAppointments, past: pastAppointments } =
    useAppointments();
  const {
    upcoming: upcomingReminders,
    completed: completedReminders,
    disabled: disabledReminders,
  } = useReminders();
  const { filteredRecords } = useMedicalRecords();
  const { members } = useFamilyProfiles();
  const insights = useHealthInsights();
  const { events: timelineEvents } = useHealthTimeline();

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

  const [reportType, setReportType] = useState(REPORT_TYPES.COMPLETE_SUMMARY);
  const [memberFilter, setMemberFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);

  const reportPreview = useMemo(
    () =>
      buildReportData({
        type: reportType,
        memberFilter,
        dateRange: { from: dateFrom, to: dateTo },
        sources: {
          appointments: allAppointments,
          reminders: allReminders,
          records: filteredRecords,
          familyMembers: members,
          memberProfiles,
          recentEvents: timelineEvents,
          achievements: insights.achievements,
          insightsSummary: insights.summaries,
        },
      }),
    [
      reportType,
      memberFilter,
      dateFrom,
      dateTo,
      allAppointments,
      allReminders,
      filteredRecords,
      members,
      memberProfiles,
      timelineEvents,
      insights.achievements,
      insights.summaries,
    ],
  );

  const generateReport = useCallback(() => {
    const memberLabel =
      memberFilter === "all"
        ? "All Members"
        : (members.find((member) => member.id === memberFilter)?.fullName ??
          "Unknown Member");

    logGeneratedReport({
      type: reportType,
      typeLabel: REPORT_TYPE_META[reportType].label,
      memberFilter,
      memberLabel,
    });

    setHasGenerated(true);
  }, [reportType, memberFilter, members]);

  const exportPdf = useCallback(() => {
    exportReportAsPdf();
  }, []);

  return {
    reportType,
    setReportType,
    memberFilter,
    setMemberFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    members,
    reportPreview,
    hasGenerated,
    generateReport,
    exportPdf,
  };
}
