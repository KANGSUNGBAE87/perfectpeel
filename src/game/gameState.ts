import type { Locale } from '../i18n';

export type GameStatus = 'ready' | 'peeling' | 'result';
export type ResultRating = 'Perfect' | 'Clean' | 'Messy' | 'Torn';
export type ResultMessageKey = 'resultTry' | 'resultTorn' | 'resultResidue' | 'resultPerfect' | 'resultClean';

export interface FinishRunInput {
  progress: number;
  tearDamage: number;
  residueDamage: number;
  elapsedMs: number;
}

export interface RunResult {
  cleanPercent: number;
  tearPercent: number;
  residuePercent: number;
  elapsedMs: number;
  rating: ResultRating;
}

export interface GameState {
  status: GameStatus;
  locale: Locale;
  startedAt: number | null;
  result: RunResult | null;
}

export function createInitialGameState(locale: Locale = 'ko'): GameState {
  return {
    status: 'ready',
    locale,
    startedAt: null,
    result: null
  };
}

export function finishRun(state: GameState, input: FinishRunInput): GameState {
  const tearPercent = toPercent(input.tearDamage);
  const residuePercent = toPercent(input.residueDamage);
  const cleanPercent = clamp(Math.round(input.progress * 100 - tearPercent - residuePercent), 0, 100);
  const result: RunResult = {
    cleanPercent,
    tearPercent,
    residuePercent,
    elapsedMs: input.elapsedMs,
    rating: rateRun(cleanPercent, tearPercent, residuePercent, input.elapsedMs, input.progress)
  };

  return {
    ...state,
    status: 'result',
    result
  };
}

export function resetRun(state: GameState): GameState {
  return createInitialGameState(state.locale);
}

export function getResultMessageKey(result: RunResult | null): ResultMessageKey {
  if (!result) {
    return 'resultTry';
  }

  if (result.rating === 'Torn') {
    return 'resultTorn';
  }

  if (result.residuePercent > 8) {
    return 'resultResidue';
  }

  if (result.rating === 'Perfect') {
    return 'resultPerfect';
  }

  return 'resultClean';
}

function rateRun(
  cleanPercent: number,
  tearPercent: number,
  residuePercent: number,
  elapsedMs: number,
  progress: number
): ResultRating {
  if (tearPercent >= 35 || progress < 0.85) {
    return 'Torn';
  }
  if (progress < 1) {
    return 'Messy';
  }
  if (cleanPercent >= 95 && tearPercent === 0 && residuePercent <= 3 && elapsedMs <= 30000) {
    return 'Perfect';
  }
  if (cleanPercent >= 82 && tearPercent <= 8 && residuePercent <= 12) {
    return 'Clean';
  }
  return 'Messy';
}

function toPercent(value: number): number {
  return clamp(Math.round(value * 100), 0, 100);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
