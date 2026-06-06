export const supportedLocales = ['ko', 'en'] as const;
export type Locale = (typeof supportedLocales)[number];

export type MessageKey =
  | 'appTitle'
  | 'startHint'
  | 'safe'
  | 'warning'
  | 'danger'
  | 'retry'
  | 'language'
  | 'introBody'
  | 'startButton'
  | 'guideTitle'
  | 'guideLow'
  | 'guideMeter'
  | 'guideFinish'
  | 'clean'
  | 'tear'
  | 'residue'
  | 'time'
  | 'rating'
  | 'ratingPerfect'
  | 'ratingClean'
  | 'ratingMessy'
  | 'ratingTorn'
  | 'resultTry'
  | 'resultTorn'
  | 'resultResidue'
  | 'resultPerfect'
  | 'resultClean';

const messages: Record<Locale, Record<MessageKey, string>> = {
  ko: {
    appTitle: '스티커떼기',
    startHint: '모서리를 잡고 낮게 당기세요',
    safe: '좋아요',
    warning: '천천히',
    danger: '찢어질 수 있어요',
    retry: '다시 떼기',
    language: '언어',
    introBody: '개발 중인 촉감 테스트예요. 모서리를 잡고 천천히 낮게 당기면서, 바가 붉어지면 힘을 빼보세요. 규칙과 설명은 계속 바뀔 수 있어요.',
    startButton: '시작하기',
    guideTitle: '목표',
    guideLow: '모서리를 잡고 낮게 당기기',
    guideMeter: '바가 붉어지면 힘을 빼기',
    guideFinish: '찢지 않고 끝까지 떼기',
    clean: '깔끔도',
    tear: '찢어짐',
    residue: '접착 자국',
    time: '시간',
    rating: '등급',
    ratingPerfect: '완벽',
    ratingClean: '깔끔',
    ratingMessy: '아쉬움',
    ratingTorn: '찢어짐',
    resultTry: '깔끔하게 떼어보세요.',
    resultTorn: '위로 당겨서 찢어졌어요. 낮게 눕혀 당겨보세요.',
    resultResidue: '조금 빨랐어요. 오른쪽 끝에 접착 자국이 남았어요.',
    resultPerfect: '각도 좋아요. 거의 완벽하게 떨어졌어요.',
    resultClean: '깔끔해요. 다음엔 잔여물을 더 줄여보세요.'
  },
  en: {
    appTitle: 'Sticker Peel',
    startHint: 'Grab the corner and peel low',
    safe: 'Smooth',
    warning: 'Slow down',
    danger: 'May tear',
    retry: 'Peel again',
    language: 'Language',
    introBody: 'This is a work-in-progress feel test. Hold the corner, peel low and slow, and ease off when the bar turns red. The rules and guide may change.',
    startButton: 'Start',
    guideTitle: 'Goal',
    guideLow: 'Hold the corner and peel low',
    guideMeter: 'Ease off when the bar turns red',
    guideFinish: 'Finish without tearing',
    clean: 'Clean',
    tear: 'Tear',
    residue: 'Residue',
    time: 'Time',
    rating: 'Rating',
    ratingPerfect: 'Perfect',
    ratingClean: 'Clean',
    ratingMessy: 'Messy',
    ratingTorn: 'Torn',
    resultTry: 'Try a clean peel.',
    resultTorn: 'You pulled upward and tore it. Keep the peel low.',
    resultResidue: 'A little too fast. Sticky residue stayed behind.',
    resultPerfect: 'Great angle. Almost a perfect clean peel.',
    resultClean: 'Clean finish. Try for less residue next time.'
  }
};

export function t(key: MessageKey, locale: Locale = 'ko'): string {
  const activeLocale = supportedLocales.includes(locale) ? locale : 'ko';
  return messages[activeLocale][key];
}
