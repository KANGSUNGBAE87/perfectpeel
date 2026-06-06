import { createNoopPlatformAdapters, type AudioEvent, type HapticEvent, type PlatformAdapters } from './adapters';

const hapticDurations: Record<HapticEvent, number> = {
  'peel.safePulse': 8,
  'peel.warningPulse': 18,
  'peel.dangerPulse': 32,
  'peel.releaseTap': 22,
  'peel.tearSnap': 44
};

const audioFrequencies: Record<AudioEvent, number> = {
  'peel:safe:start': 330,
  'peel:safe:loop': 280,
  'peel:warning:loop': 190,
  'peel:danger:tick': 140,
  'peel:release': 520,
  'peel:tear': 90,
  'ui:retry': 390
};

export function createBrowserPlatformAdapters(): PlatformAdapters {
  const base = createNoopPlatformAdapters();

  return {
    ...base,
    haptics: {
      emit(eventName) {
        if ('vibrate' in navigator) {
          navigator.vibrate(hapticDurations[eventName]);
        }
      }
    },
    audio: {
      emit(eventName) {
        playTone(audioFrequencies[eventName], eventName);
      }
    }
  };
}

function playTone(frequency: number, eventName: AudioEvent): void {
  const AudioContextClass = window.AudioContext;
  if (!AudioContextClass) {
    return;
  }

  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const duration = eventName === 'peel:tear' ? 0.16 : 0.08;

  oscillator.frequency.value = frequency;
  oscillator.type = eventName === 'peel:tear' ? 'sawtooth' : 'sine';
  gain.gain.value = eventName === 'peel:warning:loop' || eventName === 'peel:danger:tick' ? 0.035 : 0.05;
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + duration);
  oscillator.addEventListener('ended', () => {
    context.close().catch(() => {});
  });
}
