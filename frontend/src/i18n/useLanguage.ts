import { useEffect, useState } from 'react'
import { DEFAULT_LANGUAGE, LANGUAGES, type Language } from './texts'

const STORAGE_KEY = 'language'

function isLanguage(value: string | null): value is Language {
  return LANGUAGES.some((language) => language === value)
}

function readSavedLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return isLanguage(saved) ? saved : DEFAULT_LANGUAGE
  } catch {
    // localStorage can be blocked (for example, by browser privacy settings) — use the default.
    return DEFAULT_LANGUAGE
  }
}

/** Current UI language: restored from localStorage on start, saved there on every change. */
export function useLanguage(): [Language, (language: Language) => void] {
  const [language, setLanguage] = useState<Language>(readSavedLanguage)

  useEffect(() => {
    document.documentElement.lang = language
    try {
      localStorage.setItem(STORAGE_KEY, language)
    } catch {
      // Not saved — the page still works, the choice just will not survive a refresh.
    }
  }, [language])

  return [language, setLanguage]
}
