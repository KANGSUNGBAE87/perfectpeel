import { describe, expect, it } from 'vitest';
import { applyDragFrame, createAppSession, finishSession, resetSession } from '../src/app/session';

describe('app session', () => {
  it('starts peeling and advances progress from a drag frame', () => {
    const session = createAppSession();
    const next = applyDragFrame(session, {
      deltaMs: 100,
      dragDelta: { x: -18, y: 3 }
    });

    expect(next.status).toBe('peelingSafe');
    expect(next.physics.progress).toBeGreaterThan(session.physics.progress);
    expect(next.elapsedMs).toBe(100);
  });

  it('moves the held sticker corner with the drag and clears it on reset', () => {
    const session = createAppSession();
    const dragged = applyDragFrame(session, {
      deltaMs: 100,
      dragDelta: { x: -24, y: 8 }
    });

    expect(dragged.pullOffset).toEqual({ x: -24, y: 8 });

    const reset = resetSession(dragged);

    expect(reset.pullOffset).toEqual({ x: 0, y: 0 });
  });

  it('finishes with a result from current physics', () => {
    const session = createAppSession();
    const next = finishSession({
      ...session,
      elapsedMs: 21000,
      physics: {
        ...session.physics,
        progress: 1,
        tearDamage: 0,
        residueDamage: 0.04
      }
    });

    expect(next.status).toBe('result');
    expect(next.game.result?.rating).toBe('Clean');
  });

  it('resets while preserving locale', () => {
    const session = createAppSession('en');
    const reset = resetSession(session);

    expect(reset.locale).toBe('en');
    expect(reset.status).toBe('ready');
    expect(reset.game.result).toBeNull();
  });
});
