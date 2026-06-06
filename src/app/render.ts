import type { AppSession } from './session';

export interface RenderLayout {
  sticker: DOMRect;
  liftedCorner: DOMRect;
}

export function renderGame(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, session: AppSession): RenderLayout {
  const { width, height } = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, width, height);

  drawBackground(context, width, height);
  const surface = getSurfaceRect(width, height);
  drawSurface(context, surface);
  const sticker = getStickerRect(surface, width, height);
  drawResidue(context, sticker, session);
  drawSticker(context, sticker, session);
  drawTensionGauge(context, sticker, session);
  drawPullGuide(context, sticker, session);

  const heldCorner = getHeldCornerPoint(sticker, session);
  const liftedCorner = new DOMRect(heldCorner.x - 58, heldCorner.y - 42, 88, 88);
  return { sticker, liftedCorner };
}

function drawBackground(context: CanvasRenderingContext2D, width: number, height: number): void {
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f7f2ea');
  gradient.addColorStop(0.55, '#e9ede8');
  gradient.addColorStop(1, '#d7e0df');
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
}

function getSurfaceRect(width: number, height: number): DOMRect {
  const surfaceWidth = Math.min(width * 0.82, 760);
  const surfaceHeight = Math.min(height * 0.52, 440);
  return new DOMRect((width - surfaceWidth) / 2, height * 0.24, surfaceWidth, surfaceHeight);
}

function drawSurface(context: CanvasRenderingContext2D, surface: DOMRect): void {
  context.save();
  roundedRect(context, surface.x, surface.y, surface.width, surface.height, 18);
  context.fillStyle = '#64717b';
  context.fill();
  context.strokeStyle = 'rgba(255, 255, 255, 0.36)';
  context.lineWidth = 2;
  context.stroke();
  context.globalAlpha = 0.18;
  for (let index = 0; index < 9; index += 1) {
    context.beginPath();
    context.moveTo(surface.x + 24, surface.y + 28 + index * 38);
    context.lineTo(surface.right - 24, surface.y + 16 + index * 38);
    context.strokeStyle = index % 2 === 0 ? '#ffffff' : '#17212b';
    context.lineWidth = 1;
    context.stroke();
  }
  context.restore();
}

function getStickerRect(surface: DOMRect, width: number, height: number): DOMRect {
  const stickerWidth = Math.min(surface.width * 0.5, width < 520 ? width * 0.72 : 360);
  const stickerHeight = Math.min(surface.height * 0.3, height < 620 ? 112 : 138);
  return new DOMRect(
    surface.x + (surface.width - stickerWidth) / 2,
    surface.y + (surface.height - stickerHeight) / 2,
    stickerWidth,
    stickerHeight
  );
}

function drawResidue(context: CanvasRenderingContext2D, sticker: DOMRect, session: AppSession): void {
  const residue = session.physics.residueDamage;
  if (residue <= 0.01) {
    return;
  }

  context.save();
  context.globalAlpha = Math.min(0.38, residue + 0.1);
  context.fillStyle = '#c9b28f';
  const count = Math.ceil(residue * 20);
  for (let index = 0; index < count; index += 1) {
    const x = sticker.x + sticker.width * (0.45 + ((index * 37) % 48) / 100);
    const y = sticker.y + 12 + ((index * 29) % Math.max(24, sticker.height - 24));
    context.beginPath();
    context.ellipse(x, y, 8 + (index % 4) * 3, 3 + (index % 3), -0.3, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();
}

function drawSticker(context: CanvasRenderingContext2D, sticker: DOMRect, session: AppSession): void {
  const progress = session.physics.progress;
  const remainingWidth = sticker.width * Math.max(0, 1 - progress);
  const peelEdgeX = sticker.x + remainingWidth;
  const zoneColor = session.status === 'peelingDanger' || session.physics.tearPreview ? '#d94a45' : session.status === 'peelingWarning' ? '#d59a2c' : '#2f85a4';
  const heldCorner = getHeldCornerPoint(sticker, session);
  const activePeel = progress > 0 || Math.abs(session.pullOffset.x) > 1 || Math.abs(session.pullOffset.y) > 1;

  context.save();
  if (remainingWidth > 2) {
    context.save();
    context.beginPath();
    context.rect(sticker.x, sticker.y, remainingWidth, sticker.height);
    context.clip();
    roundedRect(context, sticker.x, sticker.y, sticker.width, sticker.height, 8);
    context.fillStyle = '#f8f1d9';
    context.fill();
    context.strokeStyle = 'rgba(80, 64, 38, 0.2)';
    context.lineWidth = 2;
    context.stroke();
    context.restore();
  }

  if (activePeel) {
    const flapWidth = sticker.width * Math.min(0.48, Math.max(0.18, progress * 0.58));
    const handleTop = {
      x: heldCorner.x,
      y: heldCorner.y - sticker.height * 0.18
    };
    const handleBottom = {
      x: heldCorner.x + Math.max(14, flapWidth * 0.18),
      y: heldCorner.y + sticker.height * 0.5
    };
    context.save();
    context.shadowColor = 'rgba(30, 22, 12, 0.14)';
    context.shadowBlur = 18;
    context.shadowOffsetY = 10;
    context.beginPath();
    context.moveTo(peelEdgeX, sticker.y);
    context.quadraticCurveTo(
      (peelEdgeX + handleTop.x) / 2,
      Math.min(sticker.y - sticker.height * 0.32, handleTop.y - sticker.height * 0.18),
      handleTop.x,
      handleTop.y
    );
    context.lineTo(handleBottom.x, handleBottom.y);
    context.quadraticCurveTo(
      (peelEdgeX + handleBottom.x) / 2,
      Math.max(sticker.bottom + sticker.height * 0.22, handleBottom.y + sticker.height * 0.18),
      peelEdgeX,
      sticker.bottom
    );
    context.closePath();
    context.fillStyle = '#fff9e6';
    context.fill();
    context.strokeStyle = zoneColor;
    context.lineWidth = 2.5;
    context.stroke();
    context.restore();
  }

  drawStickerLines(context, sticker, remainingWidth, session);
  drawLiftedCorner(context, sticker, progress, zoneColor, heldCorner);
  context.restore();
}

function drawStickerLines(context: CanvasRenderingContext2D, sticker: DOMRect, remainingWidth: number, session: AppSession): void {
  context.save();
  context.globalAlpha = 0.32;
  context.strokeStyle = '#d6c89b';
  context.lineWidth = 1;
  const maxX = sticker.x + Math.max(remainingWidth, 16);
  for (let y = sticker.y + 18; y < sticker.bottom - 10; y += 18) {
    context.beginPath();
    context.moveTo(sticker.x + 14, y);
    context.lineTo(maxX - 12, y + (session.status === 'peelingWarning' ? Math.sin(y) * 2 : 0));
    context.stroke();
  }
  context.restore();

  if (session.physics.tearPreview || session.physics.torn) {
    context.save();
    context.strokeStyle = '#c4312f';
    context.lineWidth = 2;
    context.beginPath();
    const tearX = sticker.x + Math.max(remainingWidth, sticker.width * 0.28);
    context.moveTo(tearX, sticker.y + 18);
    context.lineTo(tearX + 12, sticker.y + 38);
    context.lineTo(tearX - 4, sticker.y + 62);
    context.lineTo(tearX + 16, sticker.y + 88);
    context.stroke();
    context.restore();
  }
}

function drawLiftedCorner(
  context: CanvasRenderingContext2D,
  sticker: DOMRect,
  progress: number,
  zoneColor: string,
  heldCorner: { x: number; y: number }
): void {
  const bob = progress === 0 ? Math.sin(performance.now() / 260) * 3 : 0;
  context.beginPath();
  context.moveTo(heldCorner.x - sticker.width * 0.16, heldCorner.y - sticker.height * 0.16);
  context.quadraticCurveTo(
    heldCorner.x - sticker.width * 0.08,
    heldCorner.y - sticker.height * 0.42 + bob,
    heldCorner.x + 14,
    heldCorner.y + bob
  );
  context.lineTo(heldCorner.x - sticker.width * 0.08, heldCorner.y + sticker.height * 0.1);
  context.quadraticCurveTo(
    heldCorner.x - sticker.width * 0.13,
    heldCorner.y + sticker.height * 0.02,
    heldCorner.x - sticker.width * 0.16,
    heldCorner.y - sticker.height * 0.16
  );
  context.fillStyle = '#fff9e6';
  context.fill();
  context.strokeStyle = zoneColor;
  context.lineWidth = 2.5;
  context.stroke();
}

function getHeldCornerPoint(sticker: DOMRect, session: AppSession): { x: number; y: number } {
  return {
    x: sticker.right + 8 + session.pullOffset.x,
    y: sticker.y + sticker.height * 0.2 + session.pullOffset.y
  };
}

function drawTensionGauge(context: CanvasRenderingContext2D, sticker: DOMRect, session: AppSession): void {
  const width = sticker.width * 0.82;
  const x = sticker.x + (sticker.width - width) / 2;
  const y = sticker.bottom + 30;
  const tension = session.physics.tension;
  const color = tension > 0.68 ? '#d94a45' : tension > 0.34 ? '#d59a2c' : '#2f85a4';

  context.save();
  roundedRect(context, x, y, width, 10, 5);
  context.fillStyle = 'rgba(255, 255, 255, 0.62)';
  context.fill();
  roundedRect(context, x, y, width * tension, 10, 5);
  context.fillStyle = color;
  context.fill();
  context.restore();
}

function drawPullGuide(context: CanvasRenderingContext2D, sticker: DOMRect, session: AppSession): void {
  if (session.physics.progress > 0 || session.status === 'result') {
    return;
  }

  context.save();
  context.globalAlpha = 0.38;
  context.strokeStyle = '#2f85a4';
  context.lineWidth = 3;
  context.setLineDash([8, 8]);
  context.beginPath();
  context.moveTo(sticker.right - 18, sticker.y + 22);
  context.quadraticCurveTo(sticker.right - 78, sticker.y - 18, sticker.right - 150, sticker.y + 22);
  context.stroke();
  context.restore();
}

function roundedRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number): void {
  const right = x + width;
  const bottom = y + height;
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(right - radius, y);
  context.quadraticCurveTo(right, y, right, y + radius);
  context.lineTo(right, bottom - radius);
  context.quadraticCurveTo(right, bottom, right - radius, bottom);
  context.lineTo(x + radius, bottom);
  context.quadraticCurveTo(x, bottom, x, bottom - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}
