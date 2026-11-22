export type Language = 'en' | 'ko' | 'ru'

export const texts = {
  en: {
    home: 'Event Ticketing home', language: 'Choose language', eyebrow: 'FIND YOUR NEXT EXPERIENCE',
    title: 'Make room for\na little magic.', description: 'The moments you remember start with a ticket. Discover what’s happening and find your next reason to get out there.',
    explore: 'Explore the experience', service: 'PLATFORM STATUS', checking: 'Checking connection…',
    up: 'All systems ready', down: 'Service unavailable', statusDescription: 'Live connection to the Event Ticketing service.', footer: 'MADE FOR THE MOMENTS THAT MATTER',
  },
  ko: {
    home: 'Event Ticketing 홈', language: '언어 선택', eyebrow: '다음 경험을 찾아보세요',
    title: '일상에 작은\n마법을 더하세요.', description: '오래 기억될 순간은 티켓 한 장에서 시작됩니다. 새로운 이벤트를 발견하고 다음 외출을 계획해 보세요.',
    explore: '서비스 둘러보기', service: '플랫폼 상태', checking: '연결 확인 중…',
    up: '모든 시스템 정상', down: '서비스를 사용할 수 없습니다', statusDescription: 'Event Ticketing 서비스에 실시간으로 연결합니다.', footer: '소중한 순간을 위해 만들었습니다',
  },
  ru: {
    home: 'Главная Event Ticketing', language: 'Выбрать язык', eyebrow: 'ВАШЕ СЛЕДУЮЩЕЕ ВПЕЧАТЛЕНИЕ',
    title: 'Добавьте немного\nволшебства.', description: 'Яркие воспоминания начинаются с билета. Узнайте, что происходит, и найдите повод выйти из дома.',
    explore: 'Открыть платформу', service: 'СОСТОЯНИЕ ПЛАТФОРМЫ', checking: 'Проверяем соединение…',
    up: 'Все системы работают', down: 'Сервис недоступен', statusDescription: 'Текущее подключение к сервису Event Ticketing.', footer: 'ДЛЯ ВАЖНЫХ МОМЕНТОВ',
  },
} satisfies Record<Language, Record<string, string>>
