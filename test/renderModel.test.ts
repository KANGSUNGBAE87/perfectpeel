import { describe, expect, it } from 'vitest';
import { getVisualPeelProgress, shouldDrawCanvasGauge } from '../src/app/renderModel';

describe('render model', () => {
  it('uses hand movement to keep the peeled sticker edge visually aligned', () => {
    const progress = getVisualPeelProgress({
      physicsProgress: 0.12,
      pullOffsetX: -240,
      stickerWidth: 360
    });

    expect(progress).toBeGreaterThan(0.6);
  });

  it('never renders less peeled progress than the physics model has earned', () => {
    const progress = getVisualPeelProgress({
      physicsProgress: 0.55,
      pullOffsetX: -40,
      stickerWidth: 360
    });

    expect(progress).toBe(0.55);
  });

  it('hides the canvas gauge after the run has a result', () => {
    expect(shouldDrawCanvasGauge('peelingSafe')).toBe(true);
    expect(shouldDrawCanvasGauge('result')).toBe(false);
  });
});
