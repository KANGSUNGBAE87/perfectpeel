import { describe, expect, it } from 'vitest';
import {
  classifyPull,
  updatePeelFrame,
  type PeelFrameInput,
  type PeelPhysicsState
} from '../src/game/peelPhysics';

const baseInput: PeelFrameInput = {
  deltaMs: 100,
  dragDelta: { x: -18, y: 4 },
  idealDirection: { x: -1, y: 0 },
  previousSpeed: 180
};

const baseState: PeelPhysicsState = {
  progress: 0.2,
  tension: 0,
  warningTimeMs: 0,
  dangerTimeMs: 0,
  tearDamage: 0,
  residueDamage: 0,
  tearPreview: false,
  torn: false
};

describe('peel physics', () => {
  it('classifies low, steady pulls as safe', () => {
    const pull = classifyPull(baseInput);

    expect(pull.zone).toBe('safe');
    expect(pull.speed).toBeGreaterThan(40);
    expect(pull.angleDegrees).toBeLessThan(35);
  });

  it('classifies upward pulls as danger', () => {
    const pull = classifyPull({
      ...baseInput,
      dragDelta: { x: 0, y: -60 }
    });

    expect(pull.zone).toBe('danger');
    expect(pull.angleDegrees).toBeGreaterThan(65);
  });

  it('accumulates tension and tear preview during sustained danger', () => {
    const next = updatePeelFrame(baseState, {
      ...baseInput,
      deltaMs: 500,
      dragDelta: { x: 0, y: -70 }
    });

    expect(next.zone).toBe('danger');
    expect(next.state.tension).toBeGreaterThan(baseState.tension);
    expect(next.state.tearPreview).toBe(true);
    expect(next.state.dangerTimeMs).toBeGreaterThanOrEqual(500);
  });

  it('recovers tension when the player returns to a safe pull', () => {
    const dangerState: PeelPhysicsState = {
      ...baseState,
      tension: 0.85,
      warningTimeMs: 700,
      dangerTimeMs: 500,
      tearPreview: true
    };

    const next = updatePeelFrame(dangerState, baseInput);

    expect(next.zone).toBe('safe');
    expect(next.state.tension).toBeLessThan(dangerState.tension);
    expect(next.state.tearPreview).toBe(false);
  });
});
