import { useEffect, useState } from 'react'
import { fetchBackendState, type BackendState } from '../api/health'

export type BackendStatusState = 'checking' | BackendState

/** Checks the backend once when the page opens: "checking" while the request is in flight. */
export function useBackendStatus(): BackendStatusState {
  const [state, setState] = useState<BackendStatusState>('checking')

  useEffect(() => {
    const controller = new AbortController()
    fetchBackendState(controller.signal).then((result) => {
      // Ignore the answer if the component is already gone.
      if (!controller.signal.aborted) {
        setState(result)
      }
    })
    return () => controller.abort()
  }, [])

  return state
}
