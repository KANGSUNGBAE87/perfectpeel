import type { AppSession } from './session';
import { getVisualPeelProgress } from './renderModel';

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
  gradient.addColorStop(0, '#f7f0e7');
  gradient.addColorStop(0.5, '#edf2ea');
  gradient.addColorStop(1, '#d8e5df');
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
}

function getSurfaceRect(width: number, height: number): DOMRect {
  const surfaceWidth = Math.min(width * 0.9, 820);
  const surfaceHeight = Math.min(height * 0.52, 470);
  return new DOMRect((width - surfaceWidth) / 2, height * 0.19, surfaceWidth, surfaceHeight);
}

function drawSurface(context: CanvasRenderingContext2D, surface: DOMRect): void {
  context.save();
  context.shadowColor = 'rgba(22, 30, 32, 0.18)';
  context.shadowBlur = 28;
  context.shadowOffsetY = 18;
  roundedRect(context, surface.x, surface.y, surface.width, surface.height, 16);
  context.fillStyle = '#5f6d73';
  context.fill();
  context.shadowColor = 'transparent';
  context.strokeStyle = 'rgba(255, 255, 255, 0.36)';
  context.lineWidth = 2;
  context.stroke();
  context.globalAlpha = 0.2;
  for (let index = 0; index < 10; index += 1) {
    context.beginPath();
    context.moveTo(surface.x + 26, surface.y + 28 + index * 40);
    context.lineTo(surface.right - 26, surface.y + 18 + index * 40);
    context.strokeStyle = index % 2 === 0 ? '#ffffff' : '#17212b';
    context.lineWidth = 1;
    context.stroke();
  }
  context.restore();
}

function getStickerRect(surface: DOMRect, width: number, height: number): DOMRect {
  const stickerWidth = Math.min(surface.width * 0.58, width < 520 ? width * 0.78 : 450);
  const stickerHeight = Math.min(surface.height * 0.34, height < 620 ? 128 : 160);
  return new DOMRect(
    surface.x + (surface.width - stickerWidth) / 2,
    surface.y + (surface.height - stickerHeight) / 2,
    stickerWidth,
    stickerHeight
  );
}

function drawResidue(context: CanvasRenderingContext2D, sticker: DOMRect, session: AppSession): void {
  const residue = session.physics.residueDamage;
  const visualProgress = getVisualPeelProgress({
    physicsProgress: session.physics.progress,
    pullOffsetX: session.pullOffset.x,
    stickerWidth: sticker.width
  });
  if (residue <= 0.01 && visualProgress <= 0.01) {
    return;
  }

  const peeledWidth = sticker.width * visualProgress;
  const startX = sticker.right - peeledWidth;
  context.save();
  context.globalAlpha = Math.min(0.42, residue + visualProgress * 0.18 + 0.08);
  roundedRect(context, startX, sticker.y + 5, peeledWidth, sticker.height - 10, 7);
  context.fillStyle = '#d7c39c';
  context.fill();
  context.fillStyle = '#c9b28f';
  const count = Math.ceil((residue + visualProgress * 0.28) * 28);
  for (let index = 0; index < count; index += 1) {
    const x = startX + Math.max(10, peeledWidth) * (((index * 37) % 86) / 100);
    const y = sticker.y + 12 + ((index * 29) % Math.max(24, sticker.height - 24));
    context.beginPath();
    context.ellipse(x, y, 8 + (index % 4) * 3, 3 + (index % 3), -0.3, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();
}

function drawSticker(context: CanvasRenderingContext2D, sticker: DOMRect, session: AppSession): void {
  const visualProgress = getVisualPeelProgress({
    physicsProgress: session.physics.progress,
    pullOffsetX: session.pullOffset.x,
    stickerWidth: sticker.width
  });
  const remainingWidth = sticker.width * Math.max(0, 1 - visualProgress);
  const peelEdgeX = sticker.x + remainingWidth;
  const zoneColor = colorForSession(session);
  const heldCorner = getHeldCornerPoint(sticker, session);
  const activePeel = visualProgress > 0 || Math.abs(session.pullOffset.x) > 1 || Math.abs(session.pullOffset.y) > 1;

  context.save();
  if (remainingWidth > 2) {
    context.save();
    context.shadowColor = 'rgba(30, 22, 12, 0.18)';
    context.shadowBlur = 18;
    context.shadowOffsetY = 10;
    context.beginPath();
    context.rect(sticker.x, sticker.y, remainingWidth, sticker.height);
    context.clip();
    roundedRect(context, sticker.x, sticker.y, sticker.width, sticker.height, 8);
    context.fillStyle = '#f8f1d9';
    context.fill();
    context.shadowColor = 'transparent';
    context.strokeStyle = 'rgba(80, 64, 38, 0.2)';
    context.lineWidth = 2;
    context.stroke();
    context.restore();
  }

  if (activePeel) {
    drawLiftedRibbon(context, sticker, peelEdgeX, heldCorner, zoneColor);
  }

  if (remainingWidth > 2 && activePeel) {
    context.save();
    context.strokeStyle = zoneColor;
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(peelEdgeX, sticker.y + 4);
    context.lineTo(peelEdgeX, sticker.bottom - 4);
    context.stroke();
    context.restore();
  }

  drawStickerLines(context, sticker, remainingWidth, session);
  drawGrabTab(context, sticker, visualProgress, zoneColor, heldCorner);
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

function drawLiftedRibbon(
  context: CanvasRenderingContext2D,
  sticker: DOMRect,
  peelEdgeX: number,
  heldCorner: { x: number; y: number },
  zoneColor: string
): void {
  const topAnchor = { x: peelEdgeX, y: sticker.y + 6 };
  const bottomAnchor = { x: peelEdgeX, y: sticker.bottom - 6 };
  const handleTop = { x: heldCorner.x - 16, y: heldCorner.y - sticker.height * 0.28 };
  const handleBottom = { x: heldCorner.x + 30, y: heldCorner.y + sticker.height * 0.42 };

  context.save();
  context.shadowColor = 'rgba(30, 22, 12, 0.18)';
  context.shadowBlur = 20;
  context.shadowOffsetY = 12;
  context.beginPath();
  context.moveTo(topAnchor.x, topAnchor.y);
  context.bezierCurveTo(
    (topAnchor.x + handleTop.x) / 2,
    topAnchor.y - sticker.height * 0.28,
    handleTop.x - 12,
    handleTop.y - 6,
    handleTop.x,
    handleTop.y
  );
  context.lineTo(handleBottom.x, handleBottom.y);
  context.bezierCurveTo(
    handleBottom.x - 10,
    handleBottom.y + 12,
    (bottomAnchor.x + handleBottom.x) / 2,
    bottomAnchor.y + sticker.height * 0.24,
    bottomAnchor.x,
    bottomAnchor.y
  );
  context.closePath();
  context.fillStyle = '#fff8df';
  context.fill();
  context.shadowColor = 'transparent';
  context.strokeStyle = zoneColor;
  context.lineWidth = 2.5;
  context.stroke();
  context.globalAlpha = 0.28;
  context.strokeStyle = '#d6c89b';
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo((topAnchor.x + handleTop.x) / 2, sticker.y + 22);
  context.quadraticCurveTo(heldCorner.x - 20, heldCorner.y + 4, (bottomAnchor.x + handleBottom.x) / 2, sticker.bottom - 18);
  context.stroke();
  context.restore();
}

function drawGrabTab(
  context: CanvasRenderingContext2D,
  sticker: DOMRect,
  progress: number,
  zoneColor: string,
  heldCorner: { x: number; y: number }
): void {
  const bob = progress === 0 ? Math.sin(performance.now() / 260) * 3 : 0;
  const tabWidth = Math.min(94, sticker.width * 0.24);
  const tabHeight = Math.min(92, sticker.height * 0.7);
  context.save();
  context.translate(heldCorner.x, heldCorner.y + bob);
  context.rotate(progress === 0 ? -0.22 : -0.08);
  context.beginPath();
  roundedRect(context, -tabWidth * 0.48, -tabHeight * 0.34, tabWidth, tabHeight, 12);
  context.fillStyle = '#fff9e6';
  context.fill();
  context.strokeStyle = zoneColor;
  context.lineWidth = 2.5;
  context.stroke();
  context.globalAlpha = 0.35;
  context.strokeStyle = '#d6c89b';
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(-tabWidth * 0.24, -tabHeight * 0.16);
  context.lineTo(tabWidth * 0.18, tabHeight * 0.22);
  context.stroke();
  context.restore();
}

function getHeldCornerPoint(sticker: DOMRect, session: AppSession): { x: number; y: number } {
  return {
    x: sticker.right + 8 + session.pullOffset.x,
    y: sticker.y + sticker.height * 0.2 + session.pullOffset.y
  };
}

function drawTensionGauge(context: CanvasRenderingContext2D, sticker: DOMRect, session: AppSession): void {
  const width = sticker.width * 0.88;
  const x = sticker.x + (sticker.width - width) / 2;
  const y = sticker.bottom + 26;
  const tension = session.physics.tension;
  const progress = session.physics.progress;
  const color = colorForSession(session);

  context.save();
  roundedRect(context, x, y, width, 8, 4);
  context.fillStyle = 'rgba(255, 255, 255, 0.64)';
  context.fill();
  roundedRect(context, x, y, width * progress, 8, 4);
  context.fillStyle = '#2f85a4';
  context.fill();
  context.fillStyle = 'rgba(23, 33, 43, 0.5)';
  context.fillRect(x + width * 0.85, y - 2, 2, 12);

  const forceY = y + 18;
  roundedRect(context, x, forceY, width, 8, 4);
  context.fillStyle = 'rgba(255, 255, 255, 0.64)';
  context.fill();
  roundedRect(context, x + width * 0.28, forceY, width * 0.34, 8, 4);
  context.fillStyle = 'rgba(47, 133, 164, 0.24)';
  context.fill();
  roundedRect(context, x, forceY, width * tension, 8, 4);
  context.fillStyle = color;
  context.fill();
  context.restore();
}

function drawPullGuide(context: CanvasRenderingContext2D, sticker: DOMRect, session: AppSession): void {
  if (session.physics.progress > 0 || session.status === 'result') {
    return;
  }

  context.save();
  context.globalAlpha = 0.42;
  context.strokeStyle = '#2f85a4';
  context.lineWidth = 3;
  context.setLineDash([8, 8]);
  context.fillStyle = 'rgba(47, 133, 164, 0.1)';
  context.beginPath();
  context.moveTo(sticker.right - 12, sticker.y + 18);
  context.lineTo(sticker.right - 178, sticker.y + 2);
  context.lineTo(sticker.right - 178, sticker.y + 52);
  context.lineTo(sticker.right - 12, sticker.y + 38);
  context.closePath();
  context.fill();
  context.beginPath();
  context.moveTo(sticker.right - 18, sticker.y + 22);
  context.quadraticCurveTo(sticker.right - 78, sticker.y - 18, sticker.right - 150, sticker.y + 22);
  context.stroke();
  context.setLineDash([]);
  context.beginPath();
  context.moveTo(sticker.right - 158, sticker.y + 22);
  context.lineTo(sticker.right - 144, sticker.y + 14);
  context.lineTo(sticker.right - 146, sticker.y + 30);
  context.closePath();
  context.fillStyle = '#2f85a4';
  context.fill();
  context.restore();
}

function colorForSession(session: AppSession): string {
  if (session.status === 'peelingDanger' || session.physics.tearPreview || session.physics.torn) {
    return '#d94a45';
  }
  if (session.status === 'peelingWarning') {
    return '#d59a2c';
  }
  return '#2f85a4';
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
