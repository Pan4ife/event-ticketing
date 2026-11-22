export type Language = 'en' | 'ko' | 'ru'

export type Texts = {
  appTitle: string
  statusLabel: string
  statusChecking: string
  statusUp: string
  statusDown: string
  languageLabel: string
}

export const texts: Record<Language, Texts> = {
  en: {
    appTitle: 'Event Ticketing',
    statusLabel: 'Backend status',
    statusChecking: 'Checking…',
    statusUp: 'Up',
    statusDown: 'Down',
    languageLabel: 'Language',
  },
  ko: {
    appTitle: 'Event Ticketing',
    statusLabel: '백엔드 상태',
    statusChecking: '확인 중…',
    statusUp: '정상',
    statusDown: '중단',
    languageLabel: '언어',
  },
  ru: {
    appTitle: 'Event Ticketing',
    statusLabel: 'Статус бэкенда',
    statusChecking: 'Проверка…',
    statusUp: 'Работает',
    statusDown: 'Недоступен',
    languageLabel: 'Язык',
  },
}

export const languageOptions: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'ko', label: '한국어' },
  { code: 'ru', label: 'Русский' },
]

const STORAGE_KEY = 'language'

export function loadLanguage(): Language {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'en' || stored === 'ko' || stored === 'ru') {
    return stored
  }
  return 'en'
}

export function saveLanguage(language: Language): void {
  localStorage.setItem(STORAGE_KEY, language)
}
