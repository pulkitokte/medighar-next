/**
 * Standardized async-state shape used by useQuery and future data hooks.
 * Kept intentionally minimal and framework-agnostic so it can back both
 * mock-data queries today and Firestore-backed queries later without
 * changing the contract consumed by hooks.
 */

export function createLoadingState(previousData = undefined) {
  return {
    status: 'loading',
    data: previousData,
    error: null,
  };
}

export function createSuccessState(data) {
  return {
    status: 'success',
    data,
    error: null,
  };
}

export function createErrorState(error, previousData = undefined) {
  return {
    status: 'error',
    data: previousData,
    error,
  };
}
