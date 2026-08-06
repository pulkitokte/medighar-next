import { useEffect, useState } from "react";

/**
 * Returns a debounced copy of `value` that updates only after `delayMs`
 * has elapsed without `value` changing again. Shared by every search
 * surface (Command Palette, Site Search) so debounce timing is identical
 * everywhere instead of being reimplemented per consumer.
 * @param {*} value
 * @param {number} delayMs
 * @returns {*}
 */
export function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
}
