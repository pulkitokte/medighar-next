/**
 * Generates deterministic mock availability data linking medicines and
 * pharmacies. Pure, seed-based logic only — no localStorage, since
 * availability itself is mock service data rather than a user preference.
 * If a future Firestore-backed inventory system replaces this, only this
 * file needs to change.
 */

function hashPair(a, b) {
  const str = `${a}:${b}`;
  let hash = 0;

  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
}

/**
 * Returns deterministic mock availability for a single medicine+pharmacy
 * pair. The same pair always produces the same result.
 * @param {string} medicineId
 * @param {string} pharmacyId
 * @returns {{
 *   status: "in-stock"|"limited-stock"|"out-of-stock",
 *   stockLevel: number,
 *   distanceKm: number,
 * }}
 */
export function getAvailabilityEntry(medicineId, pharmacyId) {
  const bucket = hashPair(medicineId, pharmacyId) % 100;

  let status;
  let stockLevel;

  if (bucket < 15) {
    status = "out-of-stock";
    stockLevel = 0;
  } else if (bucket < 40) {
    status = "limited-stock";
    stockLevel = 1 + (bucket % 10);
  } else {
    status = "in-stock";
    stockLevel = 20 + (bucket % 80);
  }

  const distanceBucket = hashPair(pharmacyId, `${medicineId}-distance`) % 45;
  const distanceKm = Math.round((0.5 + distanceBucket * 0.1) * 10) / 10;

  return { status, stockLevel, distanceKm };
}
