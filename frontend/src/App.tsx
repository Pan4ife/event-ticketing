import { useEffect, useState } from 'react'
import { getHealth } from './api/health'
import { texts, type Language } from './i18n/texts'
import './App.css'

type HealthState = 'checking' | 'up' | 'down'

function initialLanguage(): Language {
  const saved = window.localStorage.getItem('language')
  return saved === 'en' || saved === 'ko' || saved === 'ru' ? saved : 'en'
}

function App() {
  const [language, setLanguage] = useState<Language>(initialLanguage)
  const [health, setHealth] = useState<HealthState>('checking')
  const copy = texts[language]

  useEffect(() => {
    let active = true

    getHealth()
      .then((response) => {
        if (active) setHealth(response.status === 'UP' ? 'up' : 'down')
      })
      .catch(() => {
        if (active) setHealth('down')
      })

    return () => {
      active = false
    }
  }, [])

  function changeLanguage(nextLanguage: Language) {
    window.localStorage.setItem('language', nextLanguage)
    setLanguage(nextLanguage)
  }

  return (
    <main className="home-page">
      <header className="topbar">
        <a className="brand" href="/" aria-label={copy.home}>
          <span className="brand-mark" aria-hidden="true">E</span>
          <span>Event Ticketing</span>
        </a>
        <nav className="language-switcher" aria-label={copy.language}>
          {(['en', 'ko', 'ru'] as const).map((option) => (
            <button
              className={language === option ? 'language-button active' : 'language-button'}
              key={option}
              type="button"
              aria-pressed={language === option}
              onClick={() => changeLanguage(option)}
            >
              {option.toUpperCase()}
            </button>
          ))}
        </nav>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <span className="eyebrow">{copy.eyebrow}</span>
          <h1 id="hero-title">{copy.title}</h1>
          <p className="hero-description">{copy.description}</p>
          <a className="explore-link" href="#service-status">
            {copy.explore}<span aria-hidden="true"> ↗</span>
          </a>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-ticket">
            <span className="ticket-kicker">LIVE · SOON</span>
            <span className="ticket-star">✳</span>
            <span className="ticket-lines"><i /><i /><i /></span>
            <span className="ticket-label">YOUR NEXT<br />GREAT NIGHT</span>
            <span className="ticket-number">№ 001</span>
          </div>
          <span className="spark spark-a">✳</span>
          <span className="spark spark-b">✦</span>
          <span className="art-caption">MAKE IT<br />A MOMENT</span>
        </div>
      </section>

      <section className="status-card" id="service-status" aria-live="polite">
        <div className="status-icon" aria-hidden="true"><span /></div>
        <div className="status-copy">
          <span className="status-label">{copy.service}</span>
          <h2>{copy[health]}</h2>
          <p>{copy.statusDescription}</p>
        </div>
        <span className={`status-pill ${health}`}>
          <span className="status-dot" />{copy[health]}
        </span>
      </section>

      <footer className="footer">
        <span>© 2026 Event Ticketing</span>
        <span>{copy.footer}</span>
      </footer>
    </main>
  )
}

export default App
