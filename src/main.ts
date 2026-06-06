import './styles.css';
import { getResultMessageKey, type ResultRating } from './game/gameState';
import { supportedLocales, t, type Locale, type MessageKey } from './i18n';
import { createBrowserPlatformAdapters } from './platform/browserAdapters';
import {
  applyDragFrame,
  createAppSession,
  releaseSession,
  resetSession,
  startSession,
  type AppSession
} from './app/session';
import { renderGame, type RenderLayout } from './app/render';

const platform = createBrowserPlatformAdapters();
const root = document.querySelector<HTMLDivElement>('#app');

if (!root) {
  throw new Error('Missing #app root');
}

root.innerHTML = `
  <main class="app-shell" aria-label="Sticker Peel prototype">
    <canvas class="game-canvas" aria-label="Sticker peel play surface"></canvas>
    <header class="top-bar">
      <div class="brand">
        <span class="title"></span>
        <span class="hint"></span>
      </div>
      <div class="run-stats">
        <span class="timer">0.0s</span>
        <button class="locale-toggle" type="button"></button>
      </div>
    </header>
    <section class="guide-panel" aria-live="polite">
      <h2 class="guide-title"></h2>
      <p class="intro-copy"></p>
      <ul class="guide-list">
        <li class="guide-low"></li>
        <li class="guide-meter"></li>
        <li class="guide-finish"></li>
      </ul>
      <button class="start-button" type="button"></button>
    </section>
    <section class="play-hud" aria-live="polite" hidden>
      <div class="hud-status"></div>
      <div class="hud-row">
        <div class="hud-copy">
          <span class="hud-label progress-label"></span>
          <span class="hud-value progress-value"></span>
        </div>
        <div class="hud-track progress-track">
          <span class="finish-marker"></span>
          <span class="progress-fill"></span>
        </div>
        <span class="hud-note release-note"></span>
      </div>
      <div class="hud-row">
        <div class="hud-copy">
          <span class="hud-label force-label"></span>
          <span class="hud-value force-value"></span>
        </div>
        <div class="hud-track force-track">
          <span class="force-target"></span>
          <span class="force-fill"></span>
        </div>
        <span class="hud-note force-note"></span>
      </div>
    </section>
    <div class="microcopy" aria-live="polite"></div>
    <section class="result-panel" aria-live="polite" hidden>
      <h1 class="result-rating"></h1>
      <p class="result-message"></p>
      <div class="result-grid">
        <span class="metric"><span class="metric-label clean-label"></span><span class="metric-value clean-value"></span></span>
        <span class="metric"><span class="metric-label tear-label"></span><span class="metric-value tear-value"></span></span>
        <span class="metric"><span class="metric-label residue-label"></span><span class="metric-value residue-value"></span></span>
        <span class="metric"><span class="metric-label time-label"></span><span class="metric-value time-value"></span></span>
      </div>
      <div class="result-actions">
        <button class="retry-button" type="button"></button>
      </div>
    </section>
  </main>
`;

const canvas = requireElement(root, '.game-canvas', HTMLCanvasElement);
const context = canvas.getContext('2d');
if (!context) {
  throw new Error('Canvas 2D context is unavailable');
}
const canvasContext = context;
const title = requireElement(root, '.title', HTMLSpanElement);
const hint = requireElement(root, '.hint', HTMLSpanElement);
const timer = requireElement(root, '.timer', HTMLSpanElement);
const microcopy = requireElement(root, '.microcopy', HTMLDivElement);
const playHud = requireElement(root, '.play-hud', HTMLElement);
const hudStatus = requireElement(root, '.hud-status', HTMLDivElement);
const progressLabel = requireElement(root, '.progress-label', HTMLSpanElement);
const progressValue = requireElement(root, '.progress-value', HTMLSpanElement);
const progressFill = requireElement(root, '.progress-fill', HTMLSpanElement);
const releaseNote = requireElement(root, '.release-note', HTMLSpanElement);
const forceLabel = requireElement(root, '.force-label', HTMLSpanElement);
const forceValue = requireElement(root, '.force-value', HTMLSpanElement);
const forceFill = requireElement(root, '.force-fill', HTMLSpanElement);
const forceNote = requireElement(root, '.force-note', HTMLSpanElement);
const guidePanel = requireElement(root, '.guide-panel', HTMLElement);
const guideTitle = requireElement(root, '.guide-title', HTMLHeadingElement);
const introCopy = requireElement(root, '.intro-copy', HTMLParagraphElement);
const guideLow = requireElement(root, '.guide-low', HTMLLIElement);
const guideMeter = requireElement(root, '.guide-meter', HTMLLIElement);
const guideFinish = requireElement(root, '.guide-finish', HTMLLIElement);
const startButton = requireElement(root, '.start-button', HTMLButtonElement);
const localeToggle = requireElement(root, '.locale-toggle', HTMLButtonElement);
const resultPanel = requireElement(root, '.result-panel', HTMLElement);
const resultRating = requireElement(root, '.result-rating', HTMLHeadingElement);
const resultMessage = requireElement(root, '.result-message', HTMLParagraphElement);
const retryButton = requireElement(root, '.retry-button', HTMLButtonElement);

let session: AppSession = createAppSession();
let layout: RenderLayout | null = null;
let dragging = false;
let lastPoint: { x: number; y: number; at: number } | null = null;
let lastEmittedStatus = session.status;

const metricNodes = {
  cleanLabel: requireElement(root, '.clean-label', HTMLSpanElement),
  cleanValue: requireElement(root, '.clean-value', HTMLSpanElement),
  tearLabel: requireElement(root, '.tear-label', HTMLSpanElement),
  tearValue: requireElement(root, '.tear-value', HTMLSpanElement),
  residueLabel: requireElement(root, '.residue-label', HTMLSpanElement),
  residueValue: requireElement(root, '.residue-value', HTMLSpanElement),
  timeLabel: requireElement(root, '.time-label', HTMLSpanElement),
  timeValue: requireElement(root, '.time-value', HTMLSpanElement)
};

function frame(): void {
  layout = renderGame(canvas, canvasContext, session);
  syncDom();
  requestAnimationFrame(frame);
}

function syncDom(): void {
  document.documentElement.lang = session.locale;
  document.title = t('appTitle', session.locale);
  title.textContent = t('appTitle', session.locale);
  hint.textContent = session.status === 'ready' ? t('startHint', session.locale) : statusText(session);
  timer.textContent = `${(session.elapsedMs / 1000).toFixed(1)}s`;
  localeToggle.textContent = session.locale === 'ko' ? 'EN' : 'KO';
  microcopy.textContent = statusText(session);
  microcopy.hidden = true;
  guidePanel.hidden = session.status !== 'intro';
  playHud.hidden = session.status === 'intro' || session.status === 'result';
  playHud.dataset.zone = hudZone(session);
  hudStatus.textContent = statusText(session);
  syncHud();
  guideTitle.textContent = t('guideTitle', session.locale);
  introCopy.textContent = t('introBody', session.locale);
  guideLow.textContent = t('guideLow', session.locale);
  guideMeter.textContent = t('guideMeter', session.locale);
  guideFinish.textContent = t('guideFinish', session.locale);
  startButton.textContent = t('startButton', session.locale);
  retryButton.textContent = t('retry', session.locale);

  if (!session.game.result) {
    resultPanel.hidden = true;
    return;
  }

  const result = session.game.result;
  resultPanel.hidden = false;
  resultRating.textContent = t(resultRatingKey(result.rating), session.locale);
  resultMessage.textContent = t(getResultMessageKey(result), session.locale);
  metricNodes.cleanLabel.textContent = t('clean', session.locale);
  metricNodes.cleanValue.textContent = `${result.cleanPercent}%`;
  metricNodes.tearLabel.textContent = t('tear', session.locale);
  metricNodes.tearValue.textContent = `${result.tearPercent}%`;
  metricNodes.residueLabel.textContent = t('residue', session.locale);
  metricNodes.residueValue.textContent = `${result.residuePercent}%`;
  metricNodes.timeLabel.textContent = t('time', session.locale);
  metricNodes.timeValue.textContent = `${(result.elapsedMs / 1000).toFixed(1)}s`;
}

function syncHud(): void {
  const progressPercent = Math.round(session.physics.progress * 100);
  const forcePercent = Math.round(session.physics.tension * 100);
  progressLabel.textContent = t('peelProgress', session.locale);
  progressValue.textContent = `${progressPercent}%`;
  progressFill.style.width = `${Math.min(100, progressPercent)}%`;
  releaseNote.textContent = progressPercent >= 85 ? t('releaseAt', session.locale) : t('earlyRelease', session.locale);
  forceLabel.textContent = t('force', session.locale);
  forceValue.textContent = `${forcePercent}%`;
  forceFill.style.width = `${Math.min(100, forcePercent)}%`;
  forceNote.textContent = t('forceTarget', session.locale);
}

function statusText(current: AppSession): string {
  if (current.status === 'peelingDanger' || current.status === 'torn') {
    return t('danger', current.locale);
  }
  if (current.status === 'peelingWarning') {
    return t('warning', current.locale);
  }
  if (current.status === 'peelingSafe' || current.status === 'released') {
    return t('safe', current.locale);
  }
  return t('startHint', current.locale);
}

function hudZone(current: AppSession): 'safe' | 'warning' | 'danger' {
  if (current.status === 'peelingDanger' || current.status === 'torn') {
    return 'danger';
  }
  if (current.status === 'peelingWarning') {
    return 'warning';
  }
  return 'safe';
}

canvas.addEventListener('pointerdown', (event) => {
  if (!layout || session.status === 'intro' || session.status === 'result') {
    return;
  }

  const point = eventPoint(event);
  if (!pointInRect(point, layout.liftedCorner) && !pointInRect(point, layout.sticker)) {
    return;
  }

  dragging = true;
  canvas.classList.add('dragging');
  canvas.setPointerCapture(event.pointerId);
  lastPoint = { ...point, at: performance.now() };
  platform.analytics.track('peel_started');
  platform.audio.emit('peel:safe:start');
});

canvas.addEventListener('pointermove', (event) => {
  if (!dragging || !lastPoint) {
    return;
  }

  const point = eventPoint(event);
  const now = performance.now();
  const deltaMs = Math.max(16, now - lastPoint.at);
  session = applyDragFrame(session, {
    deltaMs,
    dragDelta: {
      x: point.x - lastPoint.x,
      y: point.y - lastPoint.y
    }
  });
  emitFeedback(session);
  lastPoint = { ...point, at: now };
});

canvas.addEventListener('pointerup', endDrag);
canvas.addEventListener('pointercancel', endDrag);

startButton.addEventListener('click', () => {
  session = startSession(session);
  lastEmittedStatus = session.status;
  platform.analytics.track('peel_game_started');
  platform.audio.emit('ui:start');
});

function endDrag(event: PointerEvent): void {
  if (!dragging) {
    return;
  }

  dragging = false;
  canvas.classList.remove('dragging');
  if (canvas.hasPointerCapture(event.pointerId)) {
    canvas.releasePointerCapture(event.pointerId);
  }
  lastPoint = null;
  session = releaseSession(session);
  emitFeedback(session);
}

localeToggle.addEventListener('click', async () => {
  const nextLocale = nextLocaleFor(session.locale);
  session = {
    ...session,
    locale: nextLocale,
    game: {
      ...session.game,
      locale: nextLocale
    }
  };
  await platform.storage.set('locale', nextLocale);
});

retryButton.addEventListener('click', () => {
  platform.audio.emit('ui:retry');
  session = startSession(resetSession(session));
  lastEmittedStatus = session.status;
});

function emitFeedback(current: AppSession): void {
  if (current.status === lastEmittedStatus) {
    return;
  }

  lastEmittedStatus = current.status;
  if (current.status === 'peelingSafe') {
    platform.haptics.emit('peel.safePulse');
    platform.audio.emit('peel:safe:loop');
  } else if (current.status === 'peelingWarning') {
    platform.haptics.emit('peel.warningPulse');
    platform.audio.emit('peel:warning:loop');
  } else if (current.status === 'peelingDanger') {
    platform.haptics.emit('peel.dangerPulse');
    platform.audio.emit('peel:danger:tick');
  } else if (current.status === 'torn' || (current.status === 'result' && current.game.result?.rating === 'Torn')) {
    platform.haptics.emit('peel.tearSnap');
    platform.audio.emit('peel:tear');
  } else if (current.status === 'result') {
    platform.haptics.emit('peel.releaseTap');
    platform.audio.emit('peel:release');
  }
}

function eventPoint(event: PointerEvent): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

function pointInRect(point: { x: number; y: number }, rect: DOMRect): boolean {
  return point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
}

function nextLocaleFor(locale: Locale): Locale {
  const index = supportedLocales.indexOf(locale);
  return supportedLocales[(index + 1) % supportedLocales.length];
}

function resultRatingKey(rating: ResultRating): MessageKey {
  const keys: Record<ResultRating, MessageKey> = {
    Perfect: 'ratingPerfect',
    Clean: 'ratingClean',
    Messy: 'ratingMessy',
    Torn: 'ratingTorn'
  };
  return keys[rating];
}

function requireElement<T extends Element>(
  parent: ParentNode,
  selector: string,
  constructor: new (...args: never[]) => T
): T {
  const element = parent.querySelector(selector);
  if (!(element instanceof constructor)) {
    throw new Error(`Missing element: ${selector}`);
  }
  return element;
}

void platform.storage.get('locale').then((storedLocale) => {
  if (storedLocale === 'ko' || storedLocale === 'en') {
    session = createAppSession(storedLocale);
  }
});

requestAnimationFrame(frame);
