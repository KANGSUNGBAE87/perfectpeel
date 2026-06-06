export type PullZone = 'safe' | 'warning' | 'danger';

export interface Vector {
  x: number;
  y: number;
}

export interface PeelFrameInput {
  deltaMs: number;
  dragDelta: Vector;
  idealDirection: Vector;
  previousSpeed: number;
}

export interface PeelPhysicsState {
  progress: number;
  tension: number;
  warningTimeMs: number;
  dangerTimeMs: number;
  tearDamage: number;
  residueDamage: number;
  tearPreview: boolean;
  torn: boolean;
}

export interface PullClassification {
  zone: PullZone;
  speed: number;
  angleDegrees: number;
  jerk: number;
}

export interface PeelFrameUpdate {
  zone: PullZone;
  pull: PullClassification;
  state: PeelPhysicsState;
}

const SAFE_ANGLE = 35;
const DANGER_ANGLE = 65;
const SAFE_SPEED_MAX = 260;
const WARNING_SPEED_MAX = 430;
const DANGER_JERK = 280;
const TEAR_PREVIEW_MS = 450;
const TEAR_EVENT_MS = 900;

export function createInitialPeelPhysicsState(): PeelPhysicsState {
  return {
    progress: 0,
    tension: 0,
    warningTimeMs: 0,
    dangerTimeMs: 0,
    tearDamage: 0,
    residueDamage: 0,
    tearPreview: false,
    torn: false
  };
}

export function classifyPull(input: PeelFrameInput): PullClassification {
  const speed = vectorLength(input.dragDelta) / Math.max(input.deltaMs, 1) * 1000;
  const angleDegrees = angleBetween(input.dragDelta, input.idealDirection);
  const jerk = Math.abs(speed - input.previousSpeed);

  let zone: PullZone = 'safe';
  if (angleDegrees > DANGER_ANGLE || speed > WARNING_SPEED_MAX || jerk > DANGER_JERK) {
    zone = 'danger';
  } else if (angleDegrees > SAFE_ANGLE || speed > SAFE_SPEED_MAX) {
    zone = 'warning';
  }

  return {
    zone,
    speed,
    angleDegrees,
    jerk
  };
}

export function updatePeelFrame(
  current: PeelPhysicsState,
  input: PeelFrameInput
): PeelFrameUpdate {
  const pull = classifyPull(input);
  const seconds = input.deltaMs / 1000;
  const progressGain = progressForPull(pull, seconds);
  const progress = clamp(current.progress + progressGain, 0, 1);

  const warningTimeMs =
    pull.zone === 'warning' || pull.zone === 'danger'
      ? current.warningTimeMs + input.deltaMs
      : Math.max(0, current.warningTimeMs - input.deltaMs * 2);

  const dangerTimeMs =
    pull.zone === 'danger'
      ? current.dangerTimeMs + input.deltaMs
      : Math.max(0, current.dangerTimeMs - input.deltaMs * 2);

  const tension = nextTension(current.tension, pull.zone, input.deltaMs);
  const tearPreview = dangerTimeMs >= TEAR_PREVIEW_MS && pull.zone === 'danger';
  const severeJerk = pull.jerk > DANGER_JERK * 1.35;
  const torn = current.torn || dangerTimeMs >= TEAR_EVENT_MS || severeJerk;
  const tearDamage = clamp(
    current.tearDamage + (torn ? 0.12 : pull.zone === 'danger' ? seconds * 0.08 : 0),
    0,
    1
  );
  const residueDamage = clamp(
    current.residueDamage +
      (pull.zone === 'warning' ? progressGain * 0.18 : pull.zone === 'danger' ? progressGain * 0.35 : 0),
    0,
    1
  );

  return {
    zone: pull.zone,
    pull,
    state: {
      progress,
      tension,
      warningTimeMs,
      dangerTimeMs,
      tearDamage,
      residueDamage,
      tearPreview: tearPreview && !torn,
      torn
    }
  };
}

function progressForPull(pull: PullClassification, seconds: number): number {
  if (pull.speed < 20) {
    return 0;
  }

  const base = pull.speed / 900 * seconds;
  if (pull.zone === 'safe') {
    return base;
  }
  if (pull.zone === 'warning') {
    return base * 0.72;
  }
  return base * 0.42;
}

function nextTension(current: number, zone: PullZone, deltaMs: number): number {
  const units = deltaMs / 100;
  if (zone === 'safe') {
    return clamp(current - units * 0.24, 0, 1);
  }
  if (zone === 'warning') {
    return clamp(current + units * 0.08, 0, 1);
  }
  return clamp(current + units * 0.16, 0, 1);
}

function angleBetween(a: Vector, b: Vector): number {
  const aLength = vectorLength(a);
  const bLength = vectorLength(b);
  if (aLength === 0 || bLength === 0) {
    return 0;
  }

  const dot = a.x * b.x + a.y * b.y;
  const cosine = clamp(dot / (aLength * bLength), -1, 1);
  return Math.acos(cosine) * (180 / Math.PI);
}

function vectorLength(vector: Vector): number {
  return Math.hypot(vector.x, vector.y);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
