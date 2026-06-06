import { describe, expect, it } from 'vitest';
import { applyDragFrame, createAppSession, finishSession, releaseSession, resetSession, startSession } from '../src/app/session';

describe('app session', () => {
  it('waits for the player to press start before accepting drag input', () => {
    const session = createAppSession();
    const draggedBeforeStart = applyDragFrame(session, {
      deltaMs: 100,
      dragDelta: { x: -24, y: 4 }
    });

    expect(session.status).toBe('intro');
    expect(draggedBeforeStart.status).toBe('intro');
    expect(draggedBeforeStart.physics.progress).toBe(0);
    expect(draggedBeforeStart.elapsedMs).toBe(0);

    const ready = startSession(session);

    expect(ready.status).toBe('ready');
  });

  it('starts peeling and advances progress from a drag frame', () => {
    const session = startSession(createAppSession());
    const next = applyDragFrame(session, {
      deltaMs: 100,
      dragDelta: { x: -18, y: 3 }
    });

    expect(next.status).toBe('peelingSafe');
    expect(next.physics.progress).toBeGreaterThan(session.physics.progress);
    expect(next.elapsedMs).toBe(100);
  });

  it('moves the held sticker corner with the drag and clears it on reset', () => {
    let dragged = startSession(createAppSession());
    for (let index = 0; index < 10; index += 1) {
      dragged = applyDragFrame(dragged, {
        deltaMs: 100,
        dragDelta: { x: -24, y: 8 }
      });
    }

    expect(dragged.pullOffset.x).toBeLessThan(-180);
    expect(dragged.pullOffset.y).toBe(80);

    const reset = resetSession(dragged);

    expect(reset.pullOffset).toEqual({ x: 0, y: 0 });
    expect(reset.status).toBe('intro');
  });

  it('keeps the held corner moving after a tear until the run is explicitly finished', () => {
    const session = startSession(createAppSession());
    const torn = applyDragFrame(session, {
      deltaMs: 100,
      dragDelta: { x: 0, y: -80 }
    });

    expect(torn.status).toBe('torn');
    expect(torn.game.result).toBeNull();

    const continued = applyDragFrame(torn, {
      deltaMs: 100,
      dragDelta: { x: -60, y: 0 }
    });

    expect(continued.status).toBe('torn');
    expect(continued.pullOffset.x).toBeLessThan(torn.pullOffset.x);
    expect(continued.game.result).toBeNull();
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

  it('keeps a partial non-torn release playable below the finish threshold', () => {
    const session = startSession({
      ...createAppSession(),
      physics: {
        ...createAppSession().physics,
        progress: 0.62,
        tearDamage: 0,
        residueDamage: 0.03,
        torn: false
      }
    });

    const released = releaseSession(session);

    expect(released.status).toBe('peelingSafe');
    expect(released.game.result).toBeNull();
  });

  it('finishes as a messy result when released near completion', () => {
    const session = startSession({
      ...createAppSession(),
      elapsedMs: 18000,
      physics: {
        ...createAppSession().physics,
        progress: 0.9,
        tearDamage: 0,
        residueDamage: 0.04,
        torn: false
      }
    });

    const released = releaseSession(session);

    expect(released.status).toBe('result');
    expect(released.game.result?.rating).toBe('Messy');
    expect(released.game.result?.cleanPercent).toBe(86);
  });

  it('finishes a torn release immediately', () => {
    const session = startSession({
      ...createAppSession(),
      elapsedMs: 1200,
      physics: {
        ...createAppSession().physics,
        progress: 0.18,
        tearDamage: 0.42,
        residueDamage: 0.08,
        torn: true
      }
    });

    const released = releaseSession(session);

    expect(released.status).toBe('result');
    expect(released.game.result?.rating).toBe('Torn');
  });

  it('resets while preserving locale', () => {
    const session = createAppSession('en');
    const reset = resetSession(session);

    expect(reset.locale).toBe('en');
    expect(reset.status).toBe('intro');
    expect(reset.game.result).toBeNull();
  });
});
