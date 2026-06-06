import { createInitialGameState, finishRun, resetRun, type GameState } from '../game/gameState';
import {
  createInitialPeelPhysicsState,
  updatePeelFrame,
  type PeelPhysicsState,
  type Vector
} from '../game/peelPhysics';
import type { Locale } from '../i18n';

export type AppSessionStatus =
  | 'ready'
  | 'peelingSafe'
  | 'peelingWarning'
  | 'peelingDanger'
  | 'torn'
  | 'released'
  | 'result';

export interface DragFrame {
  deltaMs: number;
  dragDelta: Vector;
}

export interface AppSession {
  status: AppSessionStatus;
  locale: Locale;
  game: GameState;
  physics: PeelPhysicsState;
  pullOffset: Vector;
  previousSpeed: number;
  elapsedMs: number;
}

const IDEAL_DIRECTION: Vector = { x: -1, y: 0 };
const PULL_OFFSET_LIMITS = {
  minX: -180,
  maxX: 36,
  minY: -96,
  maxY: 96
};

export function createAppSession(locale: Locale = 'ko'): AppSession {
  return {
    status: 'ready',
    locale,
    game: createInitialGameState(locale),
    physics: createInitialPeelPhysicsState(),
    pullOffset: { x: 0, y: 0 },
    previousSpeed: 0,
    elapsedMs: 0
  };
}

export function applyDragFrame(session: AppSession, frame: DragFrame): AppSession {
  if (session.status === 'result') {
    return session;
  }

  const update = updatePeelFrame(session.physics, {
    deltaMs: frame.deltaMs,
    dragDelta: frame.dragDelta,
    idealDirection: IDEAL_DIRECTION,
    previousSpeed: session.previousSpeed
  });

  const elapsedMs = session.elapsedMs + frame.deltaMs;
  const status = statusFromUpdate(update.zone, update.state);
  const pullOffset = nextPullOffset(session.pullOffset, frame.dragDelta);

  if (update.state.progress >= 1 || update.state.torn) {
    return {
      ...finishSession({
        ...session,
        status,
        physics: update.state,
        pullOffset,
        previousSpeed: update.pull.speed,
        elapsedMs
      }),
      status: update.state.torn ? 'result' : 'result'
    };
  }

  return {
    ...session,
    status,
    physics: update.state,
    pullOffset,
    previousSpeed: update.pull.speed,
    elapsedMs
  };
}

export function finishSession(session: AppSession): AppSession {
  const game = finishRun(session.game, {
    progress: session.physics.progress,
    tearDamage: session.physics.tearDamage,
    residueDamage: session.physics.residueDamage,
    elapsedMs: session.elapsedMs
  });

  return {
    ...session,
    status: 'result',
    game
  };
}

export function resetSession(session: AppSession): AppSession {
  return {
    ...createAppSession(session.locale),
    game: resetRun(session.game)
  };
}

function statusFromUpdate(zone: 'safe' | 'warning' | 'danger', physics: PeelPhysicsState): AppSessionStatus {
  if (physics.torn) {
    return 'torn';
  }
  if (physics.progress >= 1) {
    return 'released';
  }
  if (zone === 'safe') {
    return 'peelingSafe';
  }
  if (zone === 'warning') {
    return 'peelingWarning';
  }
  return 'peelingDanger';
}

function nextPullOffset(current: Vector, dragDelta: Vector): Vector {
  return {
    x: clamp(current.x + dragDelta.x, PULL_OFFSET_LIMITS.minX, PULL_OFFSET_LIMITS.maxX),
    y: clamp(current.y + dragDelta.y, PULL_OFFSET_LIMITS.minY, PULL_OFFSET_LIMITS.maxY)
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
