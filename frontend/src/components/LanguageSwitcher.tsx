import { languageOptions, type Language } from '../i18n/texts'

type Props = {
  language: Language
  label: string
  onChange: (language: Language) => void
}

export function LanguageSwitcher({ language, label, onChange }: Props) {
  return (
    <div className="language-switcher">
      <span className="language-switcher__label" id="language-label">
        {label}
      </span>
      <div
        className="language-switcher__buttons"
        role="group"
        aria-labelledby="language-label"
      >
        {languageOptions.map((option) => (
          <button
            key={option.code}
            type="button"
            className={
              option.code === language
                ? 'language-switcher__button language-switcher__button--active'
                : 'language-switcher__button'
            }
            aria-pressed={option.code === language}
            onClick={() => onChange(option.code)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
