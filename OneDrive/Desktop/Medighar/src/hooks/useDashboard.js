import { useMemo, useSyncExternalStore } from "react";
import { useSavedItems } from "@/hooks/useSavedItems.js";
import { useAppointments } from "@/hooks/useAppointments.js";
import { useReminders } from "@/hooks/useReminders.js";
import { useMedicalRecords } from "@/hooks/useMedicalRecords.js";
import { useMedicalProfile } from "@/hooks/useMedicalProfile.js";
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
  QUICK_ACTIONS,
} from "@/services/dashboard/dashboard.service.js";

const EMPTY_SNAPSHOT = "[]";
const RECENT_PREVIEW_LIMIT = 5;
const APPOINTMENT_PREVIEW_LIMIT = 3;
const REMINDER_PREVIEW_LIMIT = 5;

/**
 * Aggregates data from every existing module (Saved, Recently Viewed,
 * Appointments, Reminders, Medical Records, Reviews, Medical Profile) for
 * the Personal Health Dashboard. Reuses each module's existing
 * hooks/services directly — this hook creates no storage of its own and
 * duplicates no business logic; it only composes and derives summaries.
 * @returns {object}
 */
export function useDashboard() {
  const saved = useSavedItems();
  const { upcoming: upcomingAppointments, past: pastAppointments } =
    useAppointments();
  const {
    upcoming: upcomingReminders,
    completed: completedReminders,
    disabled: disabledReminders,
  } = useReminders();
  const { recentRecords, totalCount: recordsCount } = useMedicalRecords();
  const { completion: profileCompletion } = useMedicalProfile();

  const recentSnapshot = useSyncExternalStore(
    subscribeToRecent,
    () => JSON.stringify(getAllRecentEntries()),
    () => EMPTY_SNAPSHOT,
  );
  const recentEntriesRaw = useMemo(
    () => JSON.parse(recentSnapshot),
    [recentSnapshot],
  );
  const recentEntries = useMemo(
    () => resolveRecentEntries(recentEntriesRaw, RECENT_PREVIEW_LIMIT),
    [recentEntriesRaw],
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

  const timeline = useMemo(
    () =>
      buildActivityTimeline({
        appointments: allAppointments,
        reminders: allReminders,
        records: recentRecords,
        recentEntries,
        reviews: reviewsFlat,
      }),
    [allAppointments, allReminders, recentRecords, recentEntries, reviewsFlat],
  );

  const overview = {
    savedCount: saved.totalCount,
    recentCount: recentEntriesRaw.length,
    upcomingAppointmentsCount: upcomingAppointments.length,
    activeRemindersCount: upcomingReminders.length,
    recordsCount,
  };

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
  };
}
