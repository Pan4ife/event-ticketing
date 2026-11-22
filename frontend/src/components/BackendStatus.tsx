import { useBackendStatus } from '../hooks/useBackendStatus'
import type { Texts } from '../i18n/texts'

type Props = {
  texts: Texts['status']
}

export function BackendStatus({ texts }: Props) {
  const state = useBackendStatus()

  return (
    <p className="status" aria-live="polite">
      <span>{texts.label}:</span>
      <span className={`status__badge status__badge--${state}`}>{texts[state]}</span>
    </p>
  )
}
