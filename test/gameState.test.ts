import { describe, expect, it } from 'vitest';
import {
  createInitialGameState,
  finishRun,
  getResultMessageKey,
  resetRun
} from '../src/game/gameState';

describe('game state and scoring', () => {
  it('rates a clean fast run as Perfect', () => {
    const state = finishRun(createInitialGameState(), {
      progress: 1,
      tearDamage: 0,
      residueDamage: 0.02,
      elapsedMs: 18000
    });

    expect(state.result?.rating).toBe('Perfect');
    expect(state.result?.cleanPercent).toBe(98);
  });

  it('explains the visible cause of a torn result', () => {
    const state = finishRun(createInitialGameState(), {
      progress: 0.7,
      tearDamage: 0.42,
      residueDamage: 0.12,
      elapsedMs: 16000
    });

    expect(state.result?.rating).toBe('Torn');
    expect(getResultMessageKey(state.result)).toBe('resultTorn');
  });

  it('resets the run while keeping the selected locale', () => {
    const state = createInitialGameState('en');
    const finished = finishRun(state, {
      progress: 1,
      tearDamage: 0,
      residueDamage: 0,
      elapsedMs: 10000
    });

    const reset = resetRun(finished);

    expect(reset.locale).toBe('en');
    expect(reset.result).toBeNull();
    expect(reset.status).toBe('ready');
  });
});
