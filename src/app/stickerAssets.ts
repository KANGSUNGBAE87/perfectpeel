export type StickerAssetKey = 'flat' | 'lifted' | 'rolled' | 'torn';

export interface StickerSheetRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface StickerSprite {
  image: CanvasImageSource;
  width: number;
  height: number;
}

export type StickerSprites = Record<StickerAssetKey, StickerSprite>;

export const STICKER_SHEET_REGIONS: Record<StickerAssetKey, StickerSheetRegion> = {
  flat: { x: 0, y: 0, width: 704, height: 384 },
  lifted: { x: 704, y: 0, width: 704, height: 384 },
  rolled: { x: 0, y: 384, width: 704, height: 384 },
  torn: { x: 704, y: 384, width: 704, height: 384 }
};

export function selectStickerAssetKey(input: {
  visualProgress: number;
  pullOffset: { x: number; y: number };
  torn: boolean;
}): StickerAssetKey {
  if (input.torn) {
    return 'torn';
  }

  if (input.visualProgress >= 0.52) {
    return 'rolled';
  }

  if (input.visualProgress > 0.025 || Math.abs(input.pullOffset.x) > 2 || Math.abs(input.pullOffset.y) > 2) {
    return 'lifted';
  }

  return 'flat';
}

export function chromaAlphaForPixel(red: number, green: number, blue: number, alpha: number): number {
  if (alpha === 0) {
    return 0;
  }

  const greenDominance = green - Math.max(red, blue);
  const isStrongGreen = green >= 150 && greenDominance >= 55;
  const isGreenShadow = green >= 95 && greenDominance >= 45 && green > red * 1.45 && green > blue * 1.45;
  const isDarkGreenShadow = green >= 45 && greenDominance >= 22 && green > red * 1.25 && green > blue * 1.25;

  if (isStrongGreen || isGreenShadow || isDarkGreenShadow) {
    return 0;
  }

  return alpha;
}

export async function loadStickerSprites(sheetUrl: string): Promise<StickerSprites> {
  const image = await loadImage(sheetUrl);
  return {
    flat: createSprite(image, STICKER_SHEET_REGIONS.flat),
    lifted: createSprite(image, STICKER_SHEET_REGIONS.lifted),
    rolled: createSprite(image, STICKER_SHEET_REGIONS.rolled),
    torn: createSprite(image, STICKER_SHEET_REGIONS.torn)
  };
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load sticker sheet: ${url}`));
    image.src = url;
  });
}

function createSprite(image: HTMLImageElement, region: StickerSheetRegion): StickerSprite {
  const canvas = document.createElement('canvas');
  canvas.width = region.width;
  canvas.height = region.height;

  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) {
    throw new Error('Canvas 2D context is unavailable for sticker sprite processing');
  }

  context.drawImage(image, region.x, region.y, region.width, region.height, 0, 0, region.width, region.height);
  const data = context.getImageData(0, 0, region.width, region.height);
  removeGreenScreen(data);
  context.putImageData(data, 0, 0);

  return {
    image: canvas,
    width: region.width,
    height: region.height
  };
}

function removeGreenScreen(imageData: ImageData): void {
  const { data } = imageData;
  for (let index = 0; index < data.length; index += 4) {
    data[index + 3] = chromaAlphaForPixel(data[index], data[index + 1], data[index + 2], data[index + 3]);
  }
}
