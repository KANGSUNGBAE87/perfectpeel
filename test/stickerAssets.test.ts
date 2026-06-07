import { describe, expect, it } from 'vitest';
import {
  chromaAlphaForPixel,
  getDynamicStickerLayers,
  getStickerAtlasRegion,
  getStickerSpriteRegion,
  selectStickerAssetKey
} from '../src/app/stickerAssets';

describe('sticker asset model', () => {
  it('selects the visual sticker state from peel progress', () => {
    expect(selectStickerAssetKey({ visualProgress: 0, pullOffset: { x: 0, y: 0 }, torn: false })).toBe('flat');
    expect(selectStickerAssetKey({ visualProgress: 0.08, pullOffset: { x: -18, y: 2 }, torn: false })).toBe(
      'liftedSmall'
    );
    expect(selectStickerAssetKey({ visualProgress: 0.32, pullOffset: { x: -92, y: 5 }, torn: false })).toBe(
      'liftedWide'
    );
    expect(selectStickerAssetKey({ visualProgress: 0.58, pullOffset: { x: -180, y: 8 }, torn: false })).toBe('rolled');
    expect(selectStickerAssetKey({ visualProgress: 0.2, pullOffset: { x: 0, y: -90 }, torn: true })).toBe('torn');
  });

  it('splits the Gemini atlas into a 3 by 3 sprite grid', () => {
    expect(getStickerAtlasRegion('flat', { width: 1200, height: 896 })).toEqual({ x: 0, y: 0, width: 400, height: 299 });
    expect(getStickerAtlasRegion('liftedSmall', { width: 1200, height: 896 })).toEqual({
      x: 400,
      y: 0,
      width: 400,
      height: 299
    });
    expect(getStickerAtlasRegion('liftedWide', { width: 1200, height: 896 })).toEqual({
      x: 800,
      y: 0,
      width: 400,
      height: 299
    });
    expect(getStickerAtlasRegion('rolled', { width: 1200, height: 896 })).toEqual({
      x: 400,
      y: 299,
      width: 400,
      height: 298
    });
    expect(getStickerAtlasRegion('flap', { width: 1200, height: 896 })).toEqual({
      x: 800,
      y: 299,
      width: 400,
      height: 298
    });
    expect(getStickerAtlasRegion('shadow', { width: 1200, height: 896 })).toEqual({
      x: 800,
      y: 597,
      width: 400,
      height: 299
    });
  });

  it('adds crop bleed for sprites that cross their atlas cell boundary', () => {
    expect(getStickerSpriteRegion('flat', { width: 1200, height: 896 })).toEqual({
      x: 0,
      y: 0,
      width: 440,
      height: 309
    });
  });

  it('moves independent sticker layers from the drag state', () => {
    const layers = getDynamicStickerLayers({
      visualProgress: 0.62,
      pullOffset: { x: -168, y: 16 },
      tension: 0.22,
      torn: false
    });

    expect(layers.baseKey).toBe('rolled');
    expect(layers.flap.opacity).toBeGreaterThan(0.45);
    expect(layers.flap.offsetX).toBeLessThan(-15);
    expect(layers.flap.rotation).toBeLessThan(0);
    expect(layers.shadow.opacity).toBeGreaterThan(0.25);
    expect(layers.shadow.scaleX).toBeGreaterThan(1);
  });

  it('removes green screen pixels without erasing warm sticker paper', () => {
    expect(chromaAlphaForPixel(0, 255, 0, 255)).toBe(0);
    expect(chromaAlphaForPixel(36, 125, 23, 255)).toBe(0);
    expect(chromaAlphaForPixel(24, 68, 18, 255)).toBe(0);
    expect(chromaAlphaForPixel(58, 90, 43, 255)).toBe(0);
    expect(chromaAlphaForPixel(245, 238, 216, 255)).toBe(255);
  });
});
