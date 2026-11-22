import { BackendStatus } from './components/BackendStatus'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { TEXTS } from './i18n/texts'
import { useLanguage } from './i18n/useLanguage'
import './App.css'

function App() {
  const [language, setLanguage] = useLanguage()
  const texts = TEXTS[language]

  return (
    <main className="home">
      <header className="home__header">
        <LanguageSwitcher language={language} label={texts.languageLabel} onChange={setLanguage} />
      </header>
      <h1>{texts.title}</h1>
      <p className="home__subtitle">{texts.subtitle}</p>
      <BackendStatus texts={texts.status} />
    </main>
  )
}

export default App
