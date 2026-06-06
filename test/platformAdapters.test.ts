import { describe, expect, it } from 'vitest';
import { createNoopPlatformAdapters } from '../src/platform/adapters';

describe('platform adapter readiness', () => {
  it('provides no-op seams for auth, ads, purchases, storage, analytics, haptics, share, backend, and audio', async () => {
    const platform = createNoopPlatformAdapters();

    await expect(platform.auth.getCurrentUser()).resolves.toEqual({
      id: 'guest',
      kind: 'guest'
    });
    await expect(platform.ads.showPlacement('stage_complete')).resolves.toEqual({
      shown: false,
      reason: 'not_configured'
    });
    await expect(platform.payments.purchase('remove_ads')).resolves.toEqual({
      granted: false,
      reason: 'not_configured'
    });
    await expect(platform.storage.get('locale')).resolves.toBeNull();
    expect(() => platform.analytics.track('peel_started')).not.toThrow();
    expect(() => platform.haptics.emit('peel.safePulse')).not.toThrow();
    expect(() => platform.audio.emit('peel:safe:start')).not.toThrow();
    await expect(platform.share.shareResult({ rating: 'Perfect' })).resolves.toEqual({
      shared: false,
      reason: 'not_configured'
    });
    await expect(platform.backend.request('/entitlements')).resolves.toEqual({
      ok: false,
      reason: 'not_configured'
    });
  });
});
