import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppointments } from "@/hooks/useAppointments.js";
import { useReminders } from "@/hooks/useReminders.js";
import { useMedicalRecords } from "@/hooks/useMedicalRecords.js";
import { useFamilyProfiles } from "@/hooks/useFamilyProfiles.js";
import {
  getProfile,
  subscribeToProfile,
} from "@/services/medicalProfile/medicalProfile.service.js";
import {
  buildPassportData,
  computeAge,
  logPassportAction,
  printPassport,
  PASSPORT_ACTIONS,
} from "@/services/passport/passport.service.js";

const EMPTY_PROFILE_SNAPSHOT = "null";

/**
 * Aggregates data from every existing module (Medical Profile, Reminders,
 * Medical Records, Family Profiles, Appointments, Diseases) into the
 * Health Passport. Reuses each module's existing hooks/services
 * directly — creates no storage beyond the passport action log and
 * duplicates no business logic.
 * @returns {object}
 */
export function useHealthPassport() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { members } = useFamilyProfiles();
  const memberId = searchParams.get("member") || "me";

  const profileSnapshot = useSyncExternalStore(
    subscribeToProfile,
    () => JSON.stringify(getProfile(memberId)),
    () => EMPTY_PROFILE_SNAPSHOT,
  );
  const profile = useMemo(() => JSON.parse(profileSnapshot), [profileSnapshot]);

  const { upcoming: upcomingAppointments, past: pastAppointments } =
    useAppointments();
  const {
    upcoming: upcomingReminders,
    completed: completedReminders,
    disabled: disabledReminders,
  } = useReminders();
  const { allRecords } = useMedicalRecords();

  const memberAppointments = useMemo(
    () =>
      [...upcomingAppointments, ...pastAppointments].filter(
        (appointment) => (appointment.memberId ?? "me") === memberId,
      ),
    [upcomingAppointments, pastAppointments, memberId],
  );
  const memberReminders = useMemo(
    () =>
      [
        ...upcomingReminders,
        ...completedReminders,
        ...disabledReminders,
      ].filter((reminder) => (reminder.memberId ?? "me") === memberId),
    [upcomingReminders, completedReminders, disabledReminders, memberId],
  );
  const memberRecords = useMemo(
    () => allRecords.filter((record) => (record.memberId ?? "me") === memberId),
    [allRecords, memberId],
  );

  const recentAppointment = useMemo(() => {
    const sorted = [...memberAppointments].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
    return sorted[0] ?? null;
  }, [memberAppointments]);

  const passportData = useMemo(
    () =>
      buildPassportData({
        profile,
        reminders: memberReminders,
        records: memberRecords,
        familyMembers: members,
        recentAppointment,
      }),
    [profile, memberReminders, memberRecords, members, recentAppointment],
  );

  const age = useMemo(() => computeAge(profile?.dob), [profile]);

  const [emergencyMode, setEmergencyMode] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const memberLabel = useMemo(
    () => members.find((member) => member.id === memberId)?.fullName ?? "Me",
    [members, memberId],
  );

  const setMemberId = useCallback(
    (id) => {
      setSearchParams(id === "me" ? {} : { member: id });
    },
    [setSearchParams],
  );

  const generatePassport = useCallback(() => {
    logPassportAction(PASSPORT_ACTIONS.GENERATED, memberLabel);
    setHasGenerated(true);
  }, [memberLabel]);

  const printPassportAction = useCallback(() => {
    logPassportAction(PASSPORT_ACTIONS.PRINTED, memberLabel);
    printPassport();
  }, [memberLabel]);

  const buildEmergencySummaryText = useCallback(() => {
    const {
      fullName,
      bloodGroup,
      emergencyContactName,
      emergencyContactNumber,
      allergies,
    } = {
      ...passportData.medicalId,
      allergies: passportData.allergies.join(", ") || "None listed",
    };

    return [
      fullName || "Unnamed",
      bloodGroup ? `Blood Group: ${bloodGroup}` : "Blood Group: —",
      `Emergency Contact: ${emergencyContactName || "—"}${emergencyContactNumber ? ` (${emergencyContactNumber})` : ""}`,
      `Allergies: ${allergies}`,
    ].join(" | ");
  }, [passportData]);

  const copyEmergencyInfo = useCallback(async () => {
    const text = buildEmergencySummaryText();

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        return false;
      }
    }

    return false;
  }, [buildEmergencySummaryText]);

  const sharePassport = useCallback(async () => {
    const text = buildEmergencySummaryText();

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Health Passport", text });
        return true;
      } catch {
        return false;
      }
    }

    return copyEmergencyInfo();
  }, [buildEmergencySummaryText, copyEmergencyInfo]);

  return {
    members,
    memberId,
    setMemberId,
    passportData,
    age,
    emergencyMode,
    setEmergencyMode,
    hasGenerated,
    generatePassport,
    printPassportAction,
    copyEmergencyInfo,
    sharePassport,
  };
}
