/**
 * Generic, entity-agnostic frontend contract shared by every future domain
 * module (Doctors, Medicines, Diseases, Pharmacies, Hospitals, Clinics,
 * Diagnostic Labs, Healthcare Systems, Articles, Appointments, etc.).
 *
 * These are NOT Firestore models. They describe the shape a frontend
 * repository record is expected to follow so future modules stay
 * consistent with each other, independent of where the data ultimately
 * comes from (mock data today, Firestore later).
 *
 * Nothing in this file may reference a specific entity or contain
 * domain-specific business logic.
 */

export const ENTITY_STATUS = Object.freeze({
  ACTIVE: "active",
  INACTIVE: "inactive",
  DRAFT: "draft",
  ARCHIVED: "archived",
});

/**
 * @typedef {object} EntityTimestamps
 * @property {string|null} createdAt
 * @property {string|null} updatedAt
 */

/**
 * @typedef {object} BaseEntity
 * @property {string} id
 * @property {EntityTimestamps} timestamps
 * @property {string} status
 * @property {Record<string, unknown>} metadata
 */

/**
 * Builds a normalized timestamps object.
 * @param {{ createdAt?: string|null, updatedAt?: string|null }} [input]
 * @returns {EntityTimestamps}
 */
export function createTimestamps({ createdAt = null, updatedAt = null } = {}) {
  return { createdAt, updatedAt };
}

/**
 * Builds a base entity envelope. Domain-specific fields should be spread
 * alongside this, not embedded inside it.
 * @param {{
 *   id: string,
 *   timestamps?: { createdAt?: string|null, updatedAt?: string|null },
 *   status?: string,
 *   metadata?: Record<string, unknown>,
 * }} input
 * @returns {BaseEntity}
 */
export function createBaseEntity({
  id,
  timestamps,
  status = ENTITY_STATUS.ACTIVE,
  metadata = {},
} = {}) {
  return {
    id,
    timestamps: createTimestamps(timestamps ?? {}),
    status,
    metadata: { ...metadata },
  };
}

/**
 * Returns whether the given entity is currently active.
 * @param {BaseEntity} entity
 * @returns {boolean}
 */
export function isActiveEntity(entity) {
  return entity?.status === ENTITY_STATUS.ACTIVE;
}
