import { useMemo, useSyncExternalStore } from "react";
import { useSavedItems } from "@/hooks/useSavedItems.js";
import { useAppointments } from "@/hooks/useAppointments.js";
import { useReminders } from "@/hooks/useReminders.js";
import { useMedicalRecords } from "@/hooks/useMedicalRecords.js";
import { useMedicalProfile } from "@/hooks/useMedicalProfile.js";
import { useFamilyProfiles } from "@/hooks/useFamilyProfiles.js";
import { useNotifications } from "@/hooks/useNotifications.js";
import {
  getAllRecentEntries,
  subscribeToRecent,
} from "@/services/recent/recent.service.js";
import {
  getAllReviewsFlat,
  subscribeToReviews,
} from "@/services/reviews/reviews.service.js";
import { getDoctorById } from "@/services/doctors/doctors.service.js";
import {
  resolveRecentEntries,
  buildActivityTimeline,
  buildSetupChecklist,
  buildSmartSuggestions,
  QUICK_ACTIONS,
} from "@/services/dashboard/dashboard.service.js";

const EMPTY_SNAPSHOT = "[]";
const RECENT_PREVIEW_LIMIT = 5;
const APPOINTMENT_PREVIEW_LIMIT = 3;
const REMINDER_PREVIEW_LIMIT = 5;
const FAMILY_PREVIEW_LIMIT = 5;

export function useDashboard() {
  const saved = useSavedItems();
  const { upcoming: upcomingAppointments, past: pastAppointments } =
    useAppointments();
  const {
    upcoming: upcomingReminders,
    completed: completedReminders,
    disabled: disabledReminders,
  } = useReminders();
  const {
    recentRecords,
    allRecords,
    totalCount: recordsCount,
  } = useMedicalRecords();
  const { completion: profileCompletion } = useMedicalProfile();
  const { members } = useFamilyProfiles();
  const { recentNotifications, stats: notificationStats } = useNotifications();

  // `members` includes the user's own "Me" entry. The Dashboard's family
  // count, setup checklist and Family list are about other people.
  const familyMembers = useMemo(
    () => members.filter((member) => !member.isSelf),
    [members],
  );

  const recentSnapshot = useSyncExternalStore(
    subscribeToRecent,
    () => JSON.stringify(getAllRecentEntries()),
    () => EMPTY_SNAPSHOT,
  );
  const recentEntriesRaw = useMemo(
    () => JSON.parse(recentSnapshot),
    [recentSnapshot],
  );
  // Resolve the full history once. Entries whose entity no longer exists
  // are dropped here (the stored history itself is left untouched), so the
  // count below matches what the Recent page renders.
  const resolvedRecentEntries = useMemo(
    () => resolveRecentEntries(recentEntriesRaw, Infinity),
    [recentEntriesRaw],
  );
  const recentEntries = useMemo(
    () => resolvedRecentEntries.slice(0, RECENT_PREVIEW_LIMIT),
    [resolvedRecentEntries],
  );

  const reviewsSnapshot = useSyncExternalStore(
    subscribeToReviews,
    () => JSON.stringify(getAllReviewsFlat()),
    () => EMPTY_SNAPSHOT,
  );
  const reviewsFlat = useMemo(() => {
    const reviews = JSON.parse(reviewsSnapshot);
    return reviews.map((review) => ({
      ...review,
      doctor: getDoctorById(review.doctorId),
    }));
  }, [reviewsSnapshot]);

  const allAppointments = useMemo(
    () => [...upcomingAppointments, ...pastAppointments],
    [upcomingAppointments, pastAppointments],
  );
  const allReminders = useMemo(
    () => [...upcomingReminders, ...completedReminders, ...disabledReminders],
    [upcomingReminders, completedReminders, disabledReminders],
  );

  // Records are passed in full: recentRecords is sorted by the record's own
  // date, while timeline events are ordered by createdAt, so a truncated
  // list could omit a record that was just added.
  const timeline = useMemo(
    () =>
      buildActivityTimeline({
        appointments: allAppointments,
        reminders: allReminders,
        records: allRecords,
        recentEntries,
        reviews: reviewsFlat,
      }),
    [allAppointments, allReminders, allRecords, recentEntries, reviewsFlat],
  );

  const overview = {
    savedCount: saved.totalCount,
    recentCount: resolvedRecentEntries.length,
    upcomingAppointmentsCount: upcomingAppointments.length,
    activeRemindersCount: upcomingReminders.length,
    recordsCount,
    familyMembersCount: familyMembers.length,
    unreadNotificationsCount: notificationStats.unread,
  };

  const setupChecklist = useMemo(
    () =>
      buildSetupChecklist({
        profileCompletion,
        familyMembersCount: familyMembers.length,
        appointmentsCount: allAppointments.length,
        remindersCount: allReminders.length,
        recordsCount,
        savedCount: saved.totalCount,
      }),
    [
      profileCompletion,
      familyMembers.length,
      allAppointments.length,
      allReminders.length,
      recordsCount,
      saved.totalCount,
    ],
  );

  const smartSuggestions = useMemo(
    () => buildSmartSuggestions(setupChecklist),
    [setupChecklist],
  );

  return {
    overview,
    saved,
    upcomingAppointments: upcomingAppointments.slice(
      0,
      APPOINTMENT_PREVIEW_LIMIT,
    ),
    activeReminders: upcomingReminders.slice(0, REMINDER_PREVIEW_LIMIT),
    recentRecords,
    recentEntries,
    timeline,
    quickActions: QUICK_ACTIONS,
    profileCompletion,
    familyMembers: familyMembers.slice(0, FAMILY_PREVIEW_LIMIT),
    recentNotifications,
    setupChecklist: setupChecklist.items,
    setupProgress: setupChecklist.progress,
    smartSuggestions,
  };
}
