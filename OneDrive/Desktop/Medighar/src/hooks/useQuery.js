import { useCallback, useEffect, useRef, useState } from "react";
import {
  createLoadingState,
  createSuccessState,
  createErrorState,
} from "@/shared/lib/createAsyncState.js";

/**
 * Executes a synchronous or asynchronous query function and exposes a
 * standardized loading/error/data/refetch contract. Designed so a future
 * Firestore-backed queryFn (returning a Promise) can be swapped in without
 * changing this hook or any of its consumers.
 * @param {() => unknown | Promise<unknown>} queryFn
 * @param {Array<unknown>} [deps]
 * @returns {{ data: unknown, loading: boolean, error: unknown, refetch: () => void }}
 */
export function useQuery(queryFn, deps = []) {
  const [state, setState] = useState(() => createLoadingState());
  const requestIdRef = useRef(0);

  const execute = useCallback(() => {
    const requestId = ++requestIdRef.current;

    setState((previous) => createLoadingState(previous.data));

    Promise.resolve()
      .then(() => queryFn())
      .then((result) => {
        if (requestIdRef.current !== requestId) return;
        setState(createSuccessState(result));
      })
      .catch((err) => {
        if (requestIdRef.current !== requestId) return;
        setState((previous) => createErrorState(err, previous.data));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return {
    data: state.data,
    loading: state.status === "loading",
    error: state.error,
    refetch: execute,
  };
}
