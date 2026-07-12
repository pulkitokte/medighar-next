/**
 * Generic, entity-agnostic defaults shared by every future domain module
 * (Doctors, Medicines, Diseases, Pharmacies, Hospitals, Clinics, Diagnostic
 * Labs, Healthcare Systems, Articles, Appointments, etc.).
 *
 * Nothing in this file may reference a specific entity or contain
 * domain-specific business logic. Individual modules may override any of
 * these values locally when their own conventions require it.
 */

// Pagination
export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 12;
export const PAGE_SIZE_OPTIONS = [6, 12, 24, 48];

// Sorting
export const DEFAULT_SORT_KEY = "newest";

// Query / search
export const DEFAULT_SEARCH_QUERY = "";

// Filters
export const FILTER_WILDCARD = "All";
export const DEFAULT_FILTERS = Object.freeze({});
