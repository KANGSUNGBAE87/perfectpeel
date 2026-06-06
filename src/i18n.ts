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
  | 'peelProgress'
  | 'releaseAt'
  | 'force'
  | 'forceTarget'
  | 'earlyRelease'
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
    startHint: '오른쪽 모서리를 잡고 낮게 당기세요',
    safe: '좋아요. 낮고 일정하게 당기고 있어요.',
    warning: '조금 세요. 힘을 목표 구간으로 낮춰요.',
    danger: '위로 당기거나 너무 빨라요. 찢어질 수 있어요.',
    retry: '다시 떼기',
    language: '언어',
    introBody: '끝까지 떼면 성공, 85% 이후에 놓으면 지저분한 완료예요. 힘 미터의 목표 구간 안에서 낮게 당겨보세요.',
    startButton: '시작하기',
    guideTitle: '규칙',
    guideLow: '낮은 각도로 왼쪽으로 당기기',
    guideMeter: '힘을 목표 구간 안에 유지하기',
    guideFinish: '100%까지 떼면 성공',
    peelProgress: '떼어진 정도',
    releaseAt: '85% 이후 놓으면 완료',
    force: '힘',
    forceTarget: '목표 구간',
    earlyRelease: '아직 덜 떼어졌어요. 계속 당겨보세요.',
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
    resultTorn: '위로 당기거나 너무 빨라서 찢어졌어요. 다음엔 더 낮게, 더 천천히.',
    resultResidue: '조금 빨랐어요. 오른쪽 끝에 접착 자국이 남았어요.',
    resultPerfect: '각도 좋아요. 거의 완벽하게 떨어졌어요.',
    resultClean: '깔끔해요. 다음엔 잔여물을 더 줄여보세요.'
  },
  en: {
    appTitle: 'Sticker Peel',
    startHint: 'Grab the right corner and peel low',
    safe: 'Smooth. Keep it low and steady.',
    warning: 'Too much force. Ease back into the target band.',
    danger: 'Too high or too fast. It may tear.',
    retry: 'Peel again',
    language: 'Language',
    introBody: 'Peel to 100% to win. Releasing after 85% counts as a messy finish. Keep force inside the target band.',
    startButton: 'Start',
    guideTitle: 'Rules',
    guideLow: 'Pull left at a low angle',
    guideMeter: 'Keep force in the target band',
    guideFinish: 'Reach 100% to finish clean',
    peelProgress: 'Peel progress',
    releaseAt: 'Release after 85% to finish',
    force: 'Force',
    forceTarget: 'Target band',
    earlyRelease: 'Not peeled enough. Keep pulling.',
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
    resultTorn: 'Too high or too fast. Next time, pull lower and slower.',
    resultResidue: 'A little too fast. Sticky residue stayed behind.',
    resultPerfect: 'Great angle. Almost a perfect clean peel.',
    resultClean: 'Clean finish. Try for less residue next time.'
  }
};

export function t(key: MessageKey, locale: Locale = 'ko'): string {
  const activeLocale = supportedLocales.includes(locale) ? locale : 'ko';
  return messages[activeLocale][key];
}
