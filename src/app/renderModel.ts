export interface VisualPeelProgressInput {
  physicsProgress: number;
  pullOffsetX: number;
  stickerWidth: number;
}

export function getVisualPeelProgress(input: VisualPeelProgressInput): number {
  const pullDistance = Math.max(0, -input.pullOffsetX);
  const pullProgress = pullDistance / Math.max(1, input.stickerWidth * 0.92);

  return clamp(Math.max(input.physicsProgress, pullProgress), 0, 1);
}

export function shouldDrawCanvasGauge(status: string): boolean {
  return status !== 'result';
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
