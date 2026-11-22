// All UI texts of the app, in English, Korean and Russian.

export const LANGUAGES = ['en', 'ko', 'ru'] as const

export type Language = (typeof LANGUAGES)[number]

export const DEFAULT_LANGUAGE: Language = 'en'

/** Each language is shown by its own name, so a user can find it in any UI language. */
export const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  ko: '한국어',
  ru: 'Русский',
}

export type Texts = {
  title: string
  subtitle: string
  languageLabel: string
  status: {
    label: string
    checking: string
    up: string
    down: string
  }
}

export const TEXTS: Record<Language, Texts> = {
  en: {
    title: 'Event Ticketing',
    subtitle: 'Find events and book your tickets.',
    languageLabel: 'Language',
    status: {
      label: 'Server',
      checking: 'Checking…',
      up: 'Up',
      down: 'Down',
    },
  },
  ko: {
    title: '이벤트 티켓',
    subtitle: '이벤트를 찾고 티켓을 예매하세요.',
    languageLabel: '언어',
    status: {
      label: '서버',
      checking: '확인 중…',
      up: '정상',
      down: '중단됨',
    },
  },
  ru: {
    title: 'Билеты на события',
    subtitle: 'Находите события и бронируйте билеты.',
    languageLabel: 'Язык',
    status: {
      label: 'Сервер',
      checking: 'Проверяем…',
      up: 'Работает',
      down: 'Не отвечает',
    },
  },
}
