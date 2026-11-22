export type HealthResponse = {
  status: string
}

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch('/actuator/health')
  if (!response.ok) {
    throw new Error('Health request failed')
  }
  return (await response.json()) as HealthResponse
}
