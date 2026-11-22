export type HealthResponse = {
  status: string
}

export type HealthStatus = 'checking' | 'up' | 'down'

export async function fetchHealth(): Promise<Exclude<HealthStatus, 'checking'>> {
  try {
    const response = await fetch('/actuator/health')
    if (!response.ok) {
      return 'down'
    }
    const data: HealthResponse = await response.json()
    return data.status === 'UP' ? 'up' : 'down'
  } catch {
    return 'down'
  }
}
