import type { HealthStatus } from '../api/health'
import type { Texts } from '../i18n/texts'

type Props = {
  status: HealthStatus
  texts: Texts
}

function statusText(status: HealthStatus, texts: Texts): string {
  switch (status) {
    case 'checking':
      return texts.statusChecking
    case 'up':
      return texts.statusUp
    case 'down':
      return texts.statusDown
  }
}

export function BackendStatus({ status, texts }: Props) {
  return (
    <p className="backend-status" data-status={status}>
      <span className="backend-status__label">{texts.statusLabel}: </span>
      <span className="backend-status__value">{statusText(status, texts)}</span>
    </p>
  )
}
