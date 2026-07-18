import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  getReviewsForDoctor,
  addReview,
  deleteReview,
  computeRatingStats,
  subscribeToReviews,
} from "@/services/reviews/reviews.service.js";

const EMPTY_SNAPSHOT = "[]";

/**
 * Reactive access to a single doctor's reviews and derived rating stats.
 * Mirrors useSavedItems.js / useRecentItems.js / useComparisonItems.js's
 * useSyncExternalStore pattern. Used both by DoctorDetailsPage (full
 * reviews list + write/delete) and DoctorCard (stats only).
 * @param {string} doctorId
 * @returns {{
 *   reviews: Array<object>,
 *   stats: { average: number, total: number, distribution: Record<number, number> },
 *   submitReview: (values: object) => { success: boolean, errors?: object, review?: object },
 *   removeReview: (reviewId: string) => void,
 * }}
 */
export function useDoctorReviews(doctorId) {
  const snapshot = useSyncExternalStore(
    subscribeToReviews,
    () => JSON.stringify(getReviewsForDoctor(doctorId)),
    () => EMPTY_SNAPSHOT,
  );

  const reviews = useMemo(() => JSON.parse(snapshot), [snapshot]);
  const stats = useMemo(() => computeRatingStats(reviews), [reviews]);

  const submitReview = useCallback(
    (values) => addReview(doctorId, values),
    [doctorId],
  );

  const removeReview = useCallback(
    (reviewId) => deleteReview(doctorId, reviewId),
    [doctorId],
  );

  return { reviews, stats, submitReview, removeReview };
}
