import { useMemo, useSyncExternalStore } from "react";
import { useAppointments } from "@/hooks/useAppointments.js";
import { useReminders } from "@/hooks/useReminders.js";
import { useMedicalRecords } from "@/hooks/useMedicalRecords.js";
import { useSavedItems } from "@/hooks/useSavedItems.js";
import {
  getAllRecentEntries,
  subscribeToRecent,
} from "@/services/recent/recent.service.js";
import {
  getAllReviewsFlat,
  subscribeToReviews,
} from "@/services/reviews/reviews.service.js";
import { getDoctorById } from "@/services/doctors/doctors.service.js";
import { buildHealthInsights } from "@/services/insights/insights.service.js";

const EMPTY_SNAPSHOT = "[]";

/**
 * Aggregates data from every existing module (Appointments, Reminders,
 * Medical Records, Saved, Recently Viewed, Reviews) into the Health
 * Insights & Statistics view. Reuses each module's existing hooks/services
 * directly — creates no storage of its own and duplicates no business
 * logic beyond composing already-exported aggregation functions.
 * @returns {object}
 */
export function useHealthInsights() {
  const appointments = useAppointments();
  const reminders = useReminders();
  const { filteredRecords } = useMedicalRecords();
  const saved = useSavedItems();

  const recentSnapshot = useSyncExternalStore(
    subscribeToRecent,
    () => JSON.stringify(getAllRecentEntries()),
    () => EMPTY_SNAPSHOT,
  );
  const recentEntries = useMemo(
    () => JSON.parse(recentSnapshot),
    [recentSnapshot],
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
    () => [...appointments.upcoming, ...appointments.past],
    [appointments.upcoming, appointments.past],
  );
  const allReminders = useMemo(
    () => [
      ...reminders.upcoming,
      ...reminders.completed,
      ...reminders.disabled,
    ],
    [reminders.upcoming, reminders.completed, reminders.disabled],
  );

  const insights = useMemo(
    () =>
      buildHealthInsights({
        appointments: {
          upcoming: appointments.upcoming,
          past: appointments.past,
        },
        reminders: {
          upcoming: reminders.upcoming,
          completed: reminders.completed,
          disabled: reminders.disabled,
        },
        records: filteredRecords,
        activity: {
          recentCount: recentEntries.length,
          reviewCount: reviewsFlat.length,
        },
        savedCount: saved.totalCount,
        reviewedDoctorIds: reviewsFlat.map((review) => review.doctorId),
        timelineSources: {
          appointments: allAppointments,
          reminders: allReminders,
          records: filteredRecords,
          recentEntries: [],
          reviews: reviewsFlat,
        },
      }),
    [
      appointments.upcoming,
      appointments.past,
      reminders.upcoming,
      reminders.completed,
      reminders.disabled,
      filteredRecords,
      recentEntries,
      reviewsFlat,
      saved.totalCount,
      allAppointments,
      allReminders,
    ],
  );

  return insights;
}
