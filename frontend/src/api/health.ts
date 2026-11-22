// The only call to the backend so far: Spring Boot Actuator health check.
// In dev mode Vite proxies /actuator to http://localhost:8080 (see vite.config.ts).

/** Part of the Actuator answer we use. When the app is up, `status` is "UP". */
export type HealthResponse = {
  status: string
}

export type BackendState = 'up' | 'down'

/**
 * Asks the backend whether it is up. Never throws: a non-2xx answer, a network error
 * or any status other than "UP" all mean "down".
 */
export async function fetchBackendState(signal?: AbortSignal): Promise<BackendState> {
  try {
    const response = await fetch('/actuator/health', { signal })
    if (!response.ok) {
      return 'down'
    }
    const body = (await response.json()) as HealthResponse
    return body.status === 'UP' ? 'up' : 'down'
  } catch {
    return 'down'
  }
}
