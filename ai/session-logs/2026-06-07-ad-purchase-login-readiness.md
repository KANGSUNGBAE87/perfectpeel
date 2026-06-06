# Session Log: Ads, Purchases, And Login Readiness

Date: 2026-06-07  
Actor/tool: codex  
Project: `/Users/kangsungbae/Documents/스티커떼기`

## User Request

Confirm that ads, purchases, and login are always prepared for implementation.

## Decision

Yes. Ads, purchases, and login should always be implementation-ready through platform adapters, even when the current slice keeps the real features disabled.

For V0, implementation-ready means:

- `AuthAdapter` exists with a no-op or guest implementation.
- `AdsAdapter` exists with no placements enabled.
- `PaymentAdapter` exists with no products enabled.
- Product logic calls adapters rather than platform SDKs.
- Platform-specific config has a future home outside game logic.
- Backend verification is planned before paid entitlements are granted.

Implementation-ready does not mean V0 shows ads, sells products, requires login, or imports Apps in Toss / Google Play SDKs directly.

## Files Changed

- `ai/plans/2026-06-07-market-informed-sticker-peel-product-plan.md`
- `ai/session-logs/2026-06-07-ad-purchase-login-readiness.md`

## Knowledge Promotion

No separate shared promotion needed. The global app platform standard already contains this rule, and the project plan now restates it for `스티커떼기`.
