import { describe, expect, it } from 'vitest';
import { chromaAlphaForPixel, selectStickerAssetKey, STICKER_SHEET_REGIONS } from '../src/app/stickerAssets';

describe('sticker asset model', () => {
  it('selects the visual sticker state from peel progress', () => {
    expect(selectStickerAssetKey({ visualProgress: 0, pullOffset: { x: 0, y: 0 }, torn: false })).toBe('flat');
    expect(selectStickerAssetKey({ visualProgress: 0.08, pullOffset: { x: -18, y: 2 }, torn: false })).toBe('lifted');
    expect(selectStickerAssetKey({ visualProgress: 0.58, pullOffset: { x: -180, y: 8 }, torn: false })).toBe('rolled');
    expect(selectStickerAssetKey({ visualProgress: 0.2, pullOffset: { x: 0, y: -90 }, torn: true })).toBe('torn');
  });

  it('keeps the Gemini sheet split into four equal sprite regions', () => {
    expect(STICKER_SHEET_REGIONS.flat).toEqual({ x: 0, y: 0, width: 704, height: 384 });
    expect(STICKER_SHEET_REGIONS.lifted).toEqual({ x: 704, y: 0, width: 704, height: 384 });
    expect(STICKER_SHEET_REGIONS.rolled).toEqual({ x: 0, y: 384, width: 704, height: 384 });
    expect(STICKER_SHEET_REGIONS.torn).toEqual({ x: 704, y: 384, width: 704, height: 384 });
  });

  it('removes green screen pixels without erasing warm sticker paper', () => {
    expect(chromaAlphaForPixel(0, 255, 0, 255)).toBe(0);
    expect(chromaAlphaForPixel(36, 125, 23, 255)).toBe(0);
    expect(chromaAlphaForPixel(24, 68, 18, 255)).toBe(0);
    expect(chromaAlphaForPixel(58, 90, 43, 255)).toBe(0);
    expect(chromaAlphaForPixel(245, 238, 216, 255)).toBe(255);
  });
});
