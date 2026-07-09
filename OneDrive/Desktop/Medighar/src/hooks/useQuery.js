import { useCallback, useEffect, useState } from 'react'
import {
  createLoadingState,
  createSuccessState,
  createErrorState,
} from '@/shared/lib/createAsyncState.js'

/**
 * Executes a synchronous (or eventually async) query function and exposes a
 * standardized loading/error/data/refetch contract. Designed so a future
 * Firestore-backed queryFn can be swapped in without changing this hook.
 * @param {() => unknown} queryFn
 * @param {Array<unknown>} [deps]
 * @returns {{ data: unknown, loading: boolean, error: unknown, refetch: () => void }}
 */
export function useQuery(queryFn, deps = []) {
  const [state, setState] = useState(() => createLoadingState())

  const execute = useCallback(() => {
    setState((previous) => createLoadingState(previous.data))

    try {
      const result = queryFn()
      setState(createSuccessState(result))
    } catch (err) {
      setState((previous) => createErrorState(err, previous.data))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    execute()
  }, [execute])

  return {
    data: state.data,
    loading: state.status === 'loading',
    error: state.error,
    refetch: execute,
  }
}