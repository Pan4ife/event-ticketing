import { useEffect, useState } from 'react'
import { fetchHealth, type HealthStatus } from './api/health'
import { BackendStatus } from './components/BackendStatus'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import {
  loadLanguage,
  saveLanguage,
  texts,
  type Language,
} from './i18n/texts'
import './App.css'

function App() {
  const [language, setLanguage] = useState<Language>(() => loadLanguage())
  const [status, setStatus] = useState<HealthStatus>('checking')

  useEffect(() => {
    let cancelled = false

    async function checkHealth() {
      setStatus('checking')
      const result = await fetchHealth()
      if (!cancelled) {
        setStatus(result)
      }
    }

    void checkHealth()

    return () => {
      cancelled = true
    }
  }, [])

  function handleLanguageChange(next: Language) {
    setLanguage(next)
    saveLanguage(next)
  }

  const t = texts[language]

  return (
    <main className="home">
      <header className="home__header">
        <h1 className="home__title">{t.appTitle}</h1>
        <LanguageSwitcher
          language={language}
          label={t.languageLabel}
          onChange={handleLanguageChange}
        />
      </header>
      <BackendStatus status={status} texts={t} />
    </main>
  )
}

export default App
