import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Executes a synchronous or asynchronous query function and exposes a
 * standardized loading/error/data/refetch contract. Designed so a future
 * Firestore-backed queryFn (returning a Promise) can be swapped in without
 * changing this hook or any of its consumers.
 *
 * The query re-runs whenever the serialized `deps` change or `refetch` is
 * called. Callers pass primitives (or JSON.stringify-ed objects), so JSON
 * serialization is a faithful change key.
 *
 * State is only set from the async result callbacks, never synchronously
 * inside an effect. "Loading" is derived: the stored result remembers the
 * request key it belongs to, and any result whose key differs from the
 * current one is treated as still loading (while keeping the previous
 * data available).
 * @param {() => unknown | Promise<unknown>} queryFn
 * @param {Array<unknown>} [deps]
 * @returns {{ data: unknown, loading: boolean, error: unknown, refetch: () => void }}
 */
export function useQuery(queryFn, deps = []) {
  const [refreshToken, setRefreshToken] = useState(0);
  const [result, setResult] = useState({
    key: null,
    data: undefined,
    error: null,
  });
  const queryFnRef = useRef(queryFn);

  const requestKey = `${JSON.stringify(deps)}#${refreshToken}`;

  // Declared before the fetch effect so the ref is current when it runs.
  useEffect(() => {
    queryFnRef.current = queryFn;
  });

  useEffect(() => {
    let cancelled = false;

    Promise.resolve()
      .then(() => queryFnRef.current())
      .then((data) => {
        if (cancelled) return;
        setResult({ key: requestKey, data, error: null });
      })
      .catch((error) => {
        if (cancelled) return;
        setResult((previous) => ({
          key: requestKey,
          data: previous.data,
          error,
        }));
      });

    return () => {
      cancelled = true;
    };
  }, [requestKey]);

  const refetch = useCallback(() => {
    setRefreshToken((token) => token + 1);
  }, []);

  const isCurrent = result.key === requestKey;

  return {
    data: result.data,
    loading: !isCurrent,
    error: isCurrent ? result.error : null,
    refetch,
  };
}
