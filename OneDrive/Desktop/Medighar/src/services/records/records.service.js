import {
  getRecords,
  setRecords,
  subscribeToRecords,
} from "@/services/records/records.repository.js";
import { safeSearch } from "@/shared/lib/search.js";
import { filterByEquality } from "@/shared/lib/filterHelpers.js";
import { sortItems } from "@/shared/lib/sort.js";
import { groupByField } from "@/shared/lib/repositoryHelpers.js";

export { subscribeToRecords };

export const RECORD_TYPES = [
  "Prescription",
  "Lab Report",
  "Scan / Imaging",
  "Vaccination Record",
  "Other",
];

export const ATTACHMENT_FILE_TYPES = ["PDF", "Image", "Document", "Other"];

const SORT_COMPARATORS = {
  newest: (a, b) => new Date(b.date) - new Date(a.date),
  oldest: (a, b) => new Date(a.date) - new Date(b.date),
};

function generateId() {
  return `record-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildAttachment(values) {
  const fileName = values.attachmentFileName?.trim();
  if (!fileName) return null;

  return {
    fileName,
    fileType: values.attachmentFileType || "Other",
  };
}

/**
 * Returns every stored medical record.
 * @returns {Array<object>}
 */
export function getAllRecords() {
  return getRecords();
}

/**
 * Validates medical record form values.
 * @param {object} values
 * @returns {{ errors: Record<string, string>, isValid: boolean }}
 */
export function validateRecordForm(values = {}) {
  const errors = {};

  if (!values.title || !values.title.trim()) {
    errors.title = "Record title is required.";
  }

  if (!values.type || !RECORD_TYPES.includes(values.type)) {
    errors.type = "Please select a record type.";
  }

  if (!values.doctorName || !values.doctorName.trim()) {
    errors.doctorName = "Doctor name is required.";
  }

  if (!values.hospital || !values.hospital.trim()) {
    errors.hospital = "Hospital / Clinic is required.";
  }

  if (!values.date) {
    errors.date = "Record date is required.";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
}

/**
 * Validates and creates a new medical record.
 * @param {object} values
 * @returns {{ success: boolean, errors?: Record<string, string>, record?: object }}
 */
export function createRecord(values) {
  const { errors, isValid } = validateRecordForm(values);

  if (!isValid) {
    return { success: false, errors };
  }

  const record = {
    id: generateId(),
    title: values.title.trim(),
    type: values.type,
    doctorName: values.doctorName.trim(),
    hospital: values.hospital.trim(),
    date: values.date,
    notes: values.notes?.trim() ?? "",
    attachment: buildAttachment(values),
    createdAt: Date.now(),
  };

  setRecords([...getRecords(), record]);

  return { success: true, record };
}

/**
 * Validates and updates an existing medical record.
 * @param {string} id
 * @param {object} values
 * @returns {{ success: boolean, errors?: Record<string, string>, record?: object }}
 */
export function updateRecord(id, values) {
  const { errors, isValid } = validateRecordForm(values);

  if (!isValid) {
    return { success: false, errors };
  }

  let updated = null;

  const next = getRecords().map((record) => {
    if (record.id !== id) return record;

    updated = {
      ...record,
      title: values.title.trim(),
      type: values.type,
      doctorName: values.doctorName.trim(),
      hospital: values.hospital.trim(),
      date: values.date,
      notes: values.notes?.trim() ?? "",
      attachment: buildAttachment(values),
    };

    return updated;
  });

  setRecords(next);

  return { success: true, record: updated };
}

/**
 * Deletes a medical record by id, using local state only.
 * @param {string} id
 */
export function deleteRecord(id) {
  setRecords(getRecords().filter((record) => record.id !== id));
}

/**
 * Performs a text search against record title and doctor name.
 * @param {Array<object>} records
 * @param {string} query
 * @returns {Array<object>}
 */
export function searchRecords(records, query) {
  return safeSearch(records, query, ["title", "doctorName"]);
}

/**
 * Filters records by type, "All" (or empty) returns every record.
 * @param {Array<object>} records
 * @param {string} type
 * @returns {Array<object>}
 */
export function filterRecordsByType(records, type) {
  return filterByEquality(records, "type", type);
}

/**
 * Sorts records by date, newest or oldest first.
 * @param {Array<object>} records
 * @param {"newest"|"oldest"} sortBy
 * @returns {Array<object>}
 */
export function sortRecords(records, sortBy) {
  return sortItems(records, sortBy, SORT_COMPARATORS);
}

/**
 * Groups records by the year of their record date.
 * @param {Array<object>} records
 * @returns {Record<string, Array<object>>}
 */
export function groupRecordsByYear(records) {
  return groupByField(records, (record) => new Date(record.date).getFullYear());
}
