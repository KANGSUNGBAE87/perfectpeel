import type { ResultRating } from '../game/gameState';

export interface PlatformUser {
  id: string;
  kind: 'guest' | 'authenticated';
}

export interface NotConfiguredResult {
  reason: 'not_configured';
}

export interface AuthAdapter {
  getCurrentUser(): Promise<PlatformUser>;
}

export interface AdsAdapter {
  showPlacement(placement: string): Promise<{ shown: boolean } & NotConfiguredResult>;
}

export interface PaymentAdapter {
  purchase(productId: string): Promise<{ granted: boolean } & NotConfiguredResult>;
}

export interface StorageAdapter {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
}

export interface AnalyticsAdapter {
  track(eventName: string, properties?: Record<string, unknown>): void;
}

export type HapticEvent =
  | 'peel.safePulse'
  | 'peel.warningPulse'
  | 'peel.dangerPulse'
  | 'peel.releaseTap'
  | 'peel.tearSnap';

export interface HapticsAdapter {
  emit(eventName: HapticEvent): void;
}

export type AudioEvent =
  | 'peel:safe:start'
  | 'peel:safe:loop'
  | 'peel:warning:loop'
  | 'peel:danger:tick'
  | 'peel:release'
  | 'peel:tear'
  | 'ui:retry';

export interface AudioAdapter {
  emit(eventName: AudioEvent): void;
}

export interface ShareAdapter {
  shareResult(result: { rating: ResultRating }): Promise<{ shared: boolean } & NotConfiguredResult>;
}

export interface BackendTransport {
  request(path: string): Promise<{ ok: boolean } & NotConfiguredResult>;
}

export interface PlatformAdapters {
  auth: AuthAdapter;
  ads: AdsAdapter;
  payments: PaymentAdapter;
  storage: StorageAdapter;
  analytics: AnalyticsAdapter;
  haptics: HapticsAdapter;
  audio: AudioAdapter;
  share: ShareAdapter;
  backend: BackendTransport;
}

export function createNoopPlatformAdapters(): PlatformAdapters {
  const memory = new Map<string, string>();

  return {
    auth: {
      async getCurrentUser() {
        return { id: 'guest', kind: 'guest' };
      }
    },
    ads: {
      async showPlacement(_placement: string) {
        return { shown: false, reason: 'not_configured' };
      }
    },
    payments: {
      async purchase(_productId: string) {
        return { granted: false, reason: 'not_configured' };
      }
    },
    storage: {
      async get(key: string) {
        return memory.get(key) ?? null;
      },
      async set(key: string, value: string) {
        memory.set(key, value);
      }
    },
    analytics: {
      track(_eventName: string, _properties?: Record<string, unknown>) {}
    },
    haptics: {
      emit(_eventName: HapticEvent) {}
    },
    audio: {
      emit(_eventName: AudioEvent) {}
    },
    share: {
      async shareResult(_result: { rating: ResultRating }) {
        return { shared: false, reason: 'not_configured' };
      }
    },
    backend: {
      async request(_path: string) {
        return { ok: false, reason: 'not_configured' };
      }
    }
  };
}
