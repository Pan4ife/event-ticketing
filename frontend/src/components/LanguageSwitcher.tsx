import { LANGUAGE_NAMES, LANGUAGES, type Language } from '../i18n/texts'

type Props = {
  language: Language
  label: string
  onChange: (language: Language) => void
}

export function LanguageSwitcher({ language, label, onChange }: Props) {
  return (
    <div className="language-switcher" role="group" aria-label={label}>
      {LANGUAGES.map((option) => (
        <button
          key={option}
          type="button"
          lang={option}
          aria-pressed={option === language}
          onClick={() => onChange(option)}
        >
          {LANGUAGE_NAMES[option]}
        </button>
      ))}
    </div>
  )
}
