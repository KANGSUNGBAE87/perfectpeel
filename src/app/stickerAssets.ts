export type StickerAssetKey =
  | 'flat'
  | 'liftedSmall'
  | 'liftedWide'
  | 'torn'
  | 'rolled'
  | 'flap'
  | 'tornAlt'
  | 'residue'
  | 'shadow';

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

interface StickerAtlasCell {
  column: number;
  row: number;
}

export interface StickerLayerPose {
  offsetX: number;
  offsetY: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
}

export interface DynamicStickerLayers {
  baseKey: StickerAssetKey;
  flap: StickerLayerPose;
  residue: StickerLayerPose;
  shadow: StickerLayerPose;
}

const STICKER_ASSET_KEYS: StickerAssetKey[] = [
  'flat',
  'liftedSmall',
  'liftedWide',
  'torn',
  'rolled',
  'flap',
  'tornAlt',
  'residue',
  'shadow'
];

const STICKER_ATLAS_CELLS: Record<StickerAssetKey, StickerAtlasCell> = {
  flat: { column: 0, row: 0 },
  liftedSmall: { column: 1, row: 0 },
  liftedWide: { column: 2, row: 0 },
  torn: { column: 0, row: 1 },
  rolled: { column: 1, row: 1 },
  flap: { column: 2, row: 1 },
  tornAlt: { column: 0, row: 2 },
  residue: { column: 1, row: 2 },
  shadow: { column: 2, row: 2 }
};

const STICKER_CROP_BLEED: Partial<Record<StickerAssetKey, { left?: number; right?: number; top?: number; bottom?: number }>> = {
  flat: { right: 40, bottom: 10 },
  torn: { right: 28 },
  tornAlt: { right: 28 },
  rolled: { right: 28, top: 8, bottom: 12 },
  flap: { left: 18, right: 20, top: 8, bottom: 10 },
  shadow: { left: 12, right: 8, top: 8, bottom: 8 }
};

export function selectStickerAssetKey(input: {
  visualProgress: number;
  pullOffset: { x: number; y: number };
  torn: boolean;
}): StickerAssetKey {
  if (input.torn) {
    return 'torn';
  }

  if (input.visualProgress >= 0.48) {
    return 'rolled';
  }

  if (input.visualProgress >= 0.18 || Math.abs(input.pullOffset.x) > 70) {
    return 'liftedWide';
  }

  if (input.visualProgress > 0.025 || Math.abs(input.pullOffset.x) > 2 || Math.abs(input.pullOffset.y) > 2) {
    return 'liftedSmall';
  }

  return 'flat';
}

export function getStickerAtlasRegion(
  key: StickerAssetKey,
  sheet: { width: number; height: number }
): StickerSheetRegion {
  const cell = STICKER_ATLAS_CELLS[key];
  const x = Math.round((sheet.width * cell.column) / 3);
  const nextX = Math.round((sheet.width * (cell.column + 1)) / 3);
  const y = Math.round((sheet.height * cell.row) / 3);
  const nextY = Math.round((sheet.height * (cell.row + 1)) / 3);

  return {
    x,
    y,
    width: nextX - x,
    height: nextY - y
  };
}

export function getStickerSpriteRegion(
  key: StickerAssetKey,
  sheet: { width: number; height: number }
): StickerSheetRegion {
  const region = getStickerAtlasRegion(key, sheet);
  const bleed = STICKER_CROP_BLEED[key] ?? {};
  const x = Math.max(0, region.x - (bleed.left ?? 0));
  const y = Math.max(0, region.y - (bleed.top ?? 0));
  const right = Math.min(sheet.width, region.x + region.width + (bleed.right ?? 0));
  const bottom = Math.min(sheet.height, region.y + region.height + (bleed.bottom ?? 0));

  return {
    x,
    y,
    width: right - x,
    height: bottom - y
  };
}

export function getDynamicStickerLayers(input: {
  visualProgress: number;
  pullOffset: { x: number; y: number };
  tension: number;
  torn: boolean;
}): DynamicStickerLayers {
  const progress = clamp(input.visualProgress, 0, 1);
  const pullDistance = Math.max(0, -input.pullOffset.x);
  const peelAmount = clamp(progress * 1.3 + pullDistance / 520, 0, 1);
  const upwardRisk = clamp(Math.max(0, -input.pullOffset.y) / 120, 0, 1);
  const curl = clamp(peelAmount + input.tension * 0.35 + upwardRisk * 0.18, 0, 1);
  const flapVisible = input.torn ? 0 : clamp((progress - 0.16) / 0.34, 0, 1);

  return {
    baseKey: input.torn ? (progress > 0.32 ? 'tornAlt' : 'torn') : selectStickerAssetKey(input),
    flap: {
      offsetX: -18 - pullDistance * 0.12,
      offsetY: input.pullOffset.y * 0.08 - curl * 10,
      rotation: -0.09 - curl * 0.18 + clamp(input.pullOffset.y / 260, -0.09, 0.06),
      scaleX: 0.84 + curl * 0.2,
      scaleY: 0.8 + curl * 0.16,
      opacity: flapVisible * 0.5
    },
    residue: {
      offsetX: -progress * 42,
      offsetY: 10 + input.pullOffset.y * 0.02,
      rotation: -0.05,
      scaleX: 0.62 + progress * 0.38,
      scaleY: 0.48 + progress * 0.28,
      opacity: input.torn ? 0.2 : clamp(progress * 0.42, 0, 0.42)
    },
    shadow: {
      offsetX: -8 - pullDistance * 0.07,
      offsetY: 32 + curl * 16,
      rotation: -0.04,
      scaleX: 0.82 + curl * 0.42,
      scaleY: 0.5 + curl * 0.28,
      opacity: input.torn ? 0.1 : clamp(0.18 + curl * 0.36, 0, 0.52)
    }
  };
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
  const sprites = {} as StickerSprites;
  for (const key of STICKER_ASSET_KEYS) {
    sprites[key] = createSprite(image, getStickerSpriteRegion(key, image));
  }
  return sprites;
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

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
