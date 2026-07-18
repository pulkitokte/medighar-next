import {
  getAllReviews,
  setAllReviews,
  subscribeToReviews,
} from "@/services/reviews/reviews.repository.js";

export { subscribeToReviews };

export const MIN_REVIEW_LENGTH = 10;
export const MAX_REVIEW_LENGTH = 500;

/**
 * Returns a single doctor's reviews, newest first.
 * @param {string} doctorId
 * @returns {Array<object>}
 */
export function getReviewsForDoctor(doctorId) {
  const reviews = getAllReviews()[doctorId] ?? [];
  return [...reviews].sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Validates review form values.
 * @param {{ name?: string, title?: string, text?: string, rating?: number }} values
 * @returns {{ errors: Record<string, string>, isValid: boolean }}
 */
export function validateReview(values = {}) {
  const errors = {};

  if (!values.name || !values.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!values.title || !values.title.trim()) {
    errors.title = "Review title is required.";
  }

  const text = values.text?.trim() ?? "";
  if (!text) {
    errors.text = "Review text is required.";
  } else if (text.length < MIN_REVIEW_LENGTH) {
    errors.text = `Review must be at least ${MIN_REVIEW_LENGTH} characters.`;
  } else if (text.length > MAX_REVIEW_LENGTH) {
    errors.text = `Review must be under ${MAX_REVIEW_LENGTH} characters.`;
  }

  const rating = Number(values.rating);
  if (!rating || rating < 1 || rating > 5) {
    errors.rating = "Please select a rating from 1 to 5 stars.";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
}

/**
 * Validates and creates a review for the given doctor. The review date is
 * generated automatically. Returns { success: false, errors } if
 * validation fails, or { success: true, review } if the review was saved.
 * @param {string} doctorId
 * @param {{ name: string, title: string, text: string, rating: number }} values
 * @returns {{ success: boolean, errors?: Record<string, string>, review?: object }}
 */
export function addReview(doctorId, values) {
  const { errors, isValid } = validateReview(values);

  if (!isValid) {
    return { success: false, errors };
  }

  const record = {
    id: `review-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: values.name.trim(),
    title: values.title.trim(),
    text: values.text.trim(),
    rating: Number(values.rating),
    date: new Date().toISOString(),
    createdAt: Date.now(),
  };

  const all = getAllReviews();
  const existing = all[doctorId] ?? [];

  setAllReviews({ ...all, [doctorId]: [...existing, record] });

  return { success: true, review: record };
}

/**
 * Deletes a review by id, using local state only.
 * @param {string} doctorId
 * @param {string} reviewId
 */
export function deleteReview(doctorId, reviewId) {
  const all = getAllReviews();
  const existing = all[doctorId] ?? [];

  setAllReviews({
    ...all,
    [doctorId]: existing.filter((review) => review.id !== reviewId),
  });
}

/**
 * Computes average rating, total count, and star distribution for a set of
 * reviews.
 * @param {Array<{ rating: number }>} reviews
 * @returns {{ average: number, total: number, distribution: Record<number, number> }}
 */
export function computeRatingStats(reviews = []) {
  const total = reviews.length;
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  reviews.forEach((review) => {
    if (distribution[review.rating] !== undefined) {
      distribution[review.rating] += 1;
    }
  });

  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  const average = total > 0 ? sum / total : 0;

  return { average, total, distribution };
}
