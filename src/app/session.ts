import { createInitialGameState, finishRun, resetRun, type GameState } from '../game/gameState';
import {
  createInitialPeelPhysicsState,
  updatePeelFrame,
  type PeelPhysicsState,
  type Vector
} from '../game/peelPhysics';
import type { Locale } from '../i18n';
import { getVisualPeelProgress } from './renderModel';

export type AppSessionStatus =
  | 'intro'
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
  stickerWidth?: number;
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
const RELEASE_FINISH_PROGRESS = 0.85;
const PULL_OFFSET_LIMITS = {
  minX: -420,
  maxX: 36,
  minY: -140,
  maxY: 140
};

export function createAppSession(locale: Locale = 'ko'): AppSession {
  return {
    status: 'intro',
    locale,
    game: createInitialGameState(locale),
    physics: createInitialPeelPhysicsState(),
    pullOffset: { x: 0, y: 0 },
    previousSpeed: 0,
    elapsedMs: 0
  };
}

export function startSession(session: AppSession): AppSession {
  if (session.status !== 'intro') {
    return session;
  }

  return {
    ...session,
    status: 'ready'
  };
}

export function applyDragFrame(session: AppSession, frame: DragFrame): AppSession {
  if (session.status === 'intro' || session.status === 'result') {
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
  const visualProgress = frame.stickerWidth
    ? getVisualPeelProgress({
        physicsProgress: update.state.progress,
        pullOffsetX: pullOffset.x,
        stickerWidth: frame.stickerWidth
      })
    : update.state.progress;
  const physics = {
    ...update.state,
    progress: Math.max(update.state.progress, visualProgress)
  };

  if (physics.torn) {
    return {
      ...finishSession({
        ...session,
        status: 'torn',
        physics,
        pullOffset,
        previousSpeed: update.pull.speed,
        elapsedMs
      }),
      status: 'result'
    };
  }

  if (physics.progress >= 1) {
    return {
      ...finishSession({
        ...session,
        status,
        physics,
        pullOffset,
        previousSpeed: update.pull.speed,
        elapsedMs
      }),
      status: 'result'
    };
  }

  return {
    ...session,
    status,
    physics,
    pullOffset,
    previousSpeed: update.pull.speed,
    elapsedMs
  };
}

export function finishSession(session: AppSession): AppSession {
  const game = finishRun(session.game, {
    progress: session.physics.progress,
    tearDamage: session.physics.torn ? Math.max(session.physics.tearDamage, 0.35) : session.physics.tearDamage,
    residueDamage: session.physics.residueDamage,
    elapsedMs: session.elapsedMs
  });

  return {
    ...session,
    status: 'result',
    game
  };
}

export function releaseSession(session: AppSession): AppSession {
  if (session.status === 'intro' || session.status === 'result') {
    return session;
  }

  if (session.physics.torn || session.physics.progress >= RELEASE_FINISH_PROGRESS) {
    return finishSession({
      ...session,
      status: session.physics.torn ? 'torn' : 'released'
    });
  }

  return {
    ...session,
    status: statusFromRelease(session)
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

function statusFromRelease(session: AppSession): AppSessionStatus {
  if (session.physics.progress <= 0) {
    return 'ready';
  }
  if (session.physics.tearPreview || session.physics.tension > 0.68) {
    return 'peelingDanger';
  }
  if (session.physics.tension > 0.34) {
    return 'peelingWarning';
  }
  return 'peelingSafe';
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
