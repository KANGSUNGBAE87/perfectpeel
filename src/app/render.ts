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
  gradient.addColorStop(0, '#fbf7f0');
  gradient.addColorStop(0.54, '#eef5ef');
  gradient.addColorStop(1, '#d9e9e4');
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.save();
  context.globalAlpha = 0.16;
  context.fillStyle = '#c8d4ce';
  for (let index = 0; index < 36; index += 1) {
    const x = (index * 97) % Math.max(width, 1);
    const y = (index * 53) % Math.max(height, 1);
    context.fillRect(x, y, 1, 1);
  }
  context.restore();
}

function getSurfaceRect(width: number, height: number): DOMRect {
  const surfaceWidth = Math.min(width * 0.9, 820);
  const surfaceHeight = Math.min(height * 0.52, 470);
  return new DOMRect((width - surfaceWidth) / 2, height * 0.19, surfaceWidth, surfaceHeight);
}

function drawSurface(context: CanvasRenderingContext2D, surface: DOMRect): void {
  context.save();
  context.shadowColor = 'rgba(63, 71, 62, 0.16)';
  context.shadowBlur = 34;
  context.shadowOffsetY = 20;
  roundedRect(context, surface.x, surface.y, surface.width, surface.height, 14);
  const paper = context.createLinearGradient(surface.x, surface.y, surface.right, surface.bottom);
  paper.addColorStop(0, '#fffdf7');
  paper.addColorStop(0.58, '#f1efe4');
  paper.addColorStop(1, '#e4eadf');
  context.fillStyle = paper;
  context.fill();
  context.shadowColor = 'transparent';
  context.strokeStyle = 'rgba(110, 122, 104, 0.18)';
  context.lineWidth = 2;
  context.stroke();
  context.globalAlpha = 0.16;
  for (let index = 0; index < 12; index += 1) {
    context.beginPath();
    context.moveTo(surface.x + 24, surface.y + 30 + index * 34);
    context.lineTo(surface.right - 24, surface.y + 24 + index * 34);
    context.strokeStyle = index % 2 === 0 ? '#c7d3c8' : '#ffffff';
    context.lineWidth = 1;
    context.stroke();
  }
  context.restore();
}

function getStickerRect(surface: DOMRect, width: number, height: number): DOMRect {
  const stickerWidth = Math.min(surface.width * 0.66, width < 520 ? width * 0.82 : 520);
  const stickerHeight = Math.min(surface.height * 0.22, height < 620 ? 96 : 118);
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
  context.globalAlpha = Math.min(0.32, residue + visualProgress * 0.14 + 0.06);
  roundedRect(context, startX, sticker.y + 5, peeledWidth, sticker.height - 10, 7);
  context.fillStyle = '#e6cf93';
  context.fill();
  context.fillStyle = '#d6b767';
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
  const visualProgress =
    session.status === 'result' && !session.physics.torn
      ? 1
      : getVisualPeelProgress({
          physicsProgress: session.physics.progress,
          pullOffsetX: session.pullOffset.x,
          stickerWidth: sticker.width
        });
  const remainingWidth = sticker.width * Math.max(0, 1 - visualProgress);
  const peelEdgeX = sticker.x + remainingWidth;
  const zoneColor = colorForSession(session);
  const heldCorner = getHeldCornerPoint(sticker, session);
  const activePeel = visualProgress > 0 || Math.abs(session.pullOffset.x) > 1 || Math.abs(session.pullOffset.y) > 1;
  const removedResult = session.status === 'result' && visualProgress >= 0.99 && !session.physics.torn;

  context.save();
  if (removedResult) {
    context.restore();
    return;
  }

  if (remainingWidth > 2) {
    context.save();
    context.shadowColor = 'rgba(45, 41, 22, 0.1)';
    context.shadowBlur = 14;
    context.shadowOffsetY = 7;
    context.beginPath();
    context.rect(sticker.x, sticker.y, remainingWidth, sticker.height);
    context.clip();
    roundedRect(context, sticker.x, sticker.y, sticker.width, sticker.height, 8);
    const tape = context.createLinearGradient(sticker.x, sticker.y, sticker.x, sticker.bottom);
    tape.addColorStop(0, 'rgba(255, 250, 216, 0.64)');
    tape.addColorStop(0.48, 'rgba(255, 238, 171, 0.46)');
    tape.addColorStop(1, 'rgba(244, 217, 128, 0.38)');
    context.fillStyle = tape;
    context.fill();
    context.shadowColor = 'transparent';
    context.strokeStyle = 'rgba(178, 143, 54, 0.28)';
    context.lineWidth = 1.5;
    context.stroke();
    drawTapeHighlights(context, sticker, remainingWidth);
    context.restore();
  }

  if (activePeel) {
    drawLiftedRibbon(context, sticker, peelEdgeX, heldCorner, zoneColor);
  }

  if (remainingWidth > 2 && activePeel) {
    context.save();
    context.strokeStyle = zoneColor;
    context.lineWidth = 2.2;
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
  context.globalAlpha = 0.2;
  context.strokeStyle = '#bca45b';
  context.lineWidth = 1;
  const maxX = sticker.x + Math.max(remainingWidth, 16);
  for (let y = sticker.y + 20; y < sticker.bottom - 10; y += 24) {
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
  const handleTop = { x: heldCorner.x - 18, y: heldCorner.y - sticker.height * 0.3 };
  const handleBottom = { x: heldCorner.x + 28, y: heldCorner.y + sticker.height * 0.46 };

  context.save();
  context.shadowColor = 'rgba(45, 41, 22, 0.18)';
  context.shadowBlur = 22;
  context.shadowOffsetY = 13;
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
  const ribbon = context.createLinearGradient(topAnchor.x, sticker.y, heldCorner.x, heldCorner.y + sticker.height);
  ribbon.addColorStop(0, 'rgba(255, 250, 219, 0.72)');
  ribbon.addColorStop(0.55, 'rgba(255, 232, 145, 0.5)');
  ribbon.addColorStop(1, 'rgba(255, 248, 216, 0.76)');
  context.fillStyle = ribbon;
  context.fill();
  context.shadowColor = 'transparent';
  context.strokeStyle = zoneColor;
  context.lineWidth = 2;
  context.stroke();
  context.globalAlpha = 0.42;
  context.strokeStyle = '#fffdf1';
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo((topAnchor.x + handleTop.x) / 2 - 6, sticker.y + 18);
  context.quadraticCurveTo(heldCorner.x - 28, heldCorner.y - 8, (bottomAnchor.x + handleBottom.x) / 2 - 8, sticker.bottom - 20);
  context.stroke();
  context.globalAlpha = 0.22;
  context.strokeStyle = '#bca45b';
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
  const tabWidth = Math.min(112, sticker.width * 0.24);
  const tabHeight = Math.min(76, sticker.height * 0.72);
  context.save();
  context.translate(heldCorner.x, heldCorner.y + bob);
  context.rotate(progress === 0 ? -0.22 : -0.08);
  context.shadowColor = 'rgba(45, 41, 22, 0.18)';
  context.shadowBlur = 16;
  context.shadowOffsetY = 8;
  roundedRect(context, -tabWidth * 0.46, -tabHeight * 0.34, tabWidth, tabHeight, 10);
  const tab = context.createLinearGradient(0, -tabHeight * 0.34, 0, tabHeight * 0.5);
  tab.addColorStop(0, 'rgba(255, 253, 228, 0.82)');
  tab.addColorStop(1, 'rgba(255, 228, 143, 0.56)');
  context.fillStyle = tab;
  context.fill();
  context.shadowColor = 'transparent';
  context.strokeStyle = zoneColor;
  context.lineWidth = 2;
  context.stroke();
  context.globalAlpha = 0.55;
  context.strokeStyle = '#fffdf1';
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(-tabWidth * 0.24, -tabHeight * 0.16);
  context.lineTo(tabWidth * 0.22, -tabHeight * 0.08);
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
  roundedRect(context, x, y, width, 7, 4);
  context.fillStyle = 'rgba(255, 255, 255, 0.72)';
  context.fill();
  if (progress > 0.005) {
    roundedRect(context, x, y, width * progress, 7, 4);
    context.fillStyle = '#2f85a4';
    context.fill();
  }
  context.fillStyle = 'rgba(23, 33, 43, 0.5)';
  context.fillRect(x + width * 0.85, y - 2, 2, 12);

  const forceY = y + 18;
  roundedRect(context, x, forceY, width, 7, 4);
  context.fillStyle = 'rgba(255, 255, 255, 0.72)';
  context.fill();
  roundedRect(context, x + width * 0.28, forceY, width * 0.34, 7, 4);
  context.fillStyle = 'rgba(47, 133, 164, 0.24)';
  context.fill();
  if (tension > 0.005) {
    roundedRect(context, x, forceY, width * tension, 7, 4);
    context.fillStyle = color;
    context.fill();
  }
  context.restore();
}

function drawTapeHighlights(context: CanvasRenderingContext2D, sticker: DOMRect, remainingWidth: number): void {
  const right = sticker.x + remainingWidth;
  context.save();
  context.globalAlpha = 0.48;
  context.strokeStyle = '#fffdf1';
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(sticker.x + 18, sticker.y + 12);
  context.lineTo(right - 18, sticker.y + 10);
  context.stroke();
  context.globalAlpha = 0.18;
  context.strokeStyle = '#9d8442';
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(sticker.x + 22, sticker.bottom - 12);
  context.lineTo(right - 18, sticker.bottom - 14);
  context.stroke();
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
