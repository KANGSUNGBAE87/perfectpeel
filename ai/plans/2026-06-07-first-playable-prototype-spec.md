# 스티커떼기 첫 플레이어블 프로토타입 스펙

Date: 2026-06-07  
Status: draft for user review  
Stage: spec/planning  
Platform posture: Google Play first for current release strategy, Apps in Toss compatible from the first implementation

Planning expansion: `ai/plans/2026-06-07-first-playable-prototype-expanded-planning-review.md`
Market-informed direction: `ai/plans/2026-06-07-market-informed-sticker-peel-product-plan.md`

## Workflow Used

- Superpowers brainstorming: narrowed the creative direction before implementation.
- gstack-style spec review: treated this as a backlog-ready prototype slice with explicit scope, risks, and pass/fail criteria.
- Superpowers writing-plans: next step after this spec is approved.

## Goal

Build the smallest playable version that proves the core feel of `스티커떼기`: grab a lifted sticker edge, peel at the right angle and speed, feel tension build, avoid tearing, and finish with a satisfying result.

The prototype should answer one question:

> Is peeling a sticker with drag direction, tension, tearing risk, residue, sound, and haptic feedback immediately understandable and satisfying?

## Recommended Direction

Use a hybrid tone for the first prototype:

- ASMR/tactile feedback is the emotional base.
- Classic scoring gives replay pressure.
- Failure should still feel satisfying enough that the player wants another try.

This is stronger than a pure healing prototype because it tests the actual game loop, and safer than a pure precision challenge because the first build should not feel punishing before the peel interaction is tuned.

## Approaches Considered

### Recommended: Tactile Classic Hybrid

The player peels one sticker on one surface. Good peeling produces smooth motion, soft sound, light vibration, and a high clean score. Bad peeling causes warning color, rough sound, tear lines, residue, and lower score.

Tradeoff: Slightly more tuning work than a pure ASMR toy, but it proves the real game earlier.

### Alternative: Healing ASMR Toy

No failure state. The player peels slowly and receives only pleasant feedback.

Tradeoff: Fast to make and pleasant, but it does not prove scoring, tension, or replay hooks.

### Alternative: Precision Challenge

The player must maintain a tight angle and speed window. Mistakes quickly tear the sticker.

Tradeoff: Clear game pressure, but the first prototype may feel unfair before feedback is tuned.

## Prototype Scope

In scope:

- One screen.
- One background surface, initially a laptop-like flat object.
- One rectangular sticker with a visibly lifted corner.
- Pointer/touch drag from the lifted corner.
- Peel progress based on drag direction, angle, speed, and tension.
- Tension gauge with safe, warning, and danger states.
- Tear and residue judgement.
- Basic sound event stubs.
- Basic haptic event stubs.
- Result screen with clean, tear, residue, time, and rating.
- Korean default UI copy and English strings prepared through an i18n boundary.
- Platform-neutral stubs for auth, ads, IAP, storage, analytics, haptics, share, and backend transport so Google Play and Apps in Toss implementations can be added later without changing game logic.

Out of scope:

- Multiple sticker types.
- Multiple stages.
- Collection page.
- Ads, login, in-app purchase, analytics, backend, or store release assets.
- Direct Apps in Toss SDK, Google Play Billing, AdMob, Google login, or Toss login integration.
- Real mobile packaging.
- Advanced physics simulation.

## Product Flow

1. The game opens directly on a surface with one sticker.
2. One sticker corner is lifted so the start point is visually obvious.
3. The player drags the lifted corner.
4. The lifted sticker area grows when the pull angle and speed are good.
5. The gauge and sticker edge warn the player when tension rises.
6. If the player keeps pulling badly, the sticker tears or leaves residue.
7. When the sticker is removed or fails, the result screen appears.
8. The player can retry immediately.

## Interaction Model

The prototype should judge four input signals:

- Pull angle: low-angle backward peeling is good; straight-up pulling is risky.
- Pull direction: peeling along the release direction is good; pulling against it is risky.
- Pull speed: steady speed is good; sudden jerks increase tension.
- Tension duration: staying in the red warning zone creates tears and residue.

The correct action should be readable through feedback. The player should not need a text tutorial to understand what went wrong.

## Feedback Model

Visual feedback:

- Smooth lifted sticker shape when the angle is good.
- Wrinkles near the dragged edge when direction is poor.
- Tension color from cool/safe to yellow/warning to red/danger.
- Tear line preview before a real tear.
- Residue marks on the surface after bad peeling.

Audio feedback:

- Smooth peel loop while safe.
- Rougher peel loop during warning.
- Short release sound on success.
- Rip or sticky snap sound on tear.

Haptic feedback:

- Light continuous pulse while safe.
- Stronger pulse while near tear.
- Short tap on final release.

The first browser prototype may implement audio and haptic as adapter calls with fallback no-ops when the platform does not support them.

## Score Model

Track these values during a run:

- `cleanPercent`: how much of the sticker came off cleanly.
- `tearPercent`: how much was damaged.
- `residuePercent`: how much adhesive was left behind.
- `elapsedMs`: total clear time.
- `rating`: `Perfect`, `Clean`, `Messy`, or `Torn`.

Suggested first rating rules:

- `Perfect`: clean >= 95, tear == 0, residue <= 3.
- `Clean`: clean >= 80 and tear <= 10.
- `Messy`: sticker removed, but residue or tearing is noticeable.
- `Torn`: tear >= 35 or the sticker fails before removal.

## Architecture Recommendation

Use a small web prototype first: Vite, TypeScript, and Canvas 2D.

Reason:

- It lets Codex and Claude test the core feel quickly in a browser.
- Pointer input covers both mouse and touch-style interaction.
- Canvas is enough for one sticker, deformation hints, residue marks, and gauges.
- Platform services can remain behind adapters from the beginning.
- If the feel works, the project can later choose the packaging path with better confidence: Apps in Toss WebView/Granite, Google Play web shell, native Android, React Native, Godot, or another mobile path.

Initial module boundaries:

- `game/state`: run state, scoring, tension, result.
- `game/peelPhysics`: angle, speed, direction, progress, tear/residue calculation.
- `game/render`: canvas drawing for surface, sticker, tension, residue, result.
- `platform/audio`: sound adapter.
- `platform/haptics`: haptic adapter.
- `platform/capabilities`: platform-neutral stubs for auth, ads, IAP, storage, analytics, share, and backend transport.
- `i18n`: Korean and English strings.

## Platform Matrix

| Concern | Prototype | Apps in Toss path | Google Play path |
| --- | --- | --- | --- |
| Runtime | Vite + TypeScript + Canvas 2D in browser | Apps in Toss WebView/Granite-compatible web bundle | Android web shell, TWA, native WebView, or later native port |
| Auth | No-op `AuthAdapter` | Toss login + server token verification | Credential Manager, Google Sign-In, or Play Games Services |
| Ads | No-op `AdsAdapter` | Apps in Toss ads only | AdMob / Google Mobile Ads |
| IAP | No-op `PaymentAdapter` | Apps in Toss IAP with backend entitlement verification | Google Play Billing with backend entitlement verification |
| Storage | Local run state only | Toss-compatible storage or backend sync | Android/local/cloud storage behind adapter |
| Analytics | No-op `AnalyticsAdapter` | Toss-compatible analytics if used | Firebase/GA or approved analytics |
| Haptics | Web vibration/no-op fallback | Toss/native bridge or WebView fallback | Android haptics |
| Locale | `ko` default, `en` selectable through i18n | App setting plus Toss/device locale hint | App setting plus Android/device locale hint |
| Safe area | Browser viewport QA | Must respect Toss safe area and close-button expectations | Must respect Android device cutouts and system UI |

## Acceptance Criteria

- A first-time player can identify the lifted corner and start peeling without reading instructions.
- Dragging the lifted corner peels the sticker visually.
- Slow low-angle pulling usually reaches a clean result.
- Fast straight-up pulling produces warning feedback and can tear the sticker.
- Residue appears when the player pulls in a poor direction for long enough.
- The tension gauge changes state during play and never hides the sticker edge.
- Result screen shows clean, tear, residue, time, rating, and a retry action.
- All user-facing text comes from the i18n layer.
- Audio and haptic calls go through adapters, even if the first browser build uses no-op fallbacks.
- Product and game logic do not import platform SDKs directly.
- Auth, ads, IAP, storage, analytics, haptics, share, and backend transport exist as no-op adapter interfaces or explicit adapter entries in the implementation plan.
- The prototype runs in desktop and mobile browser viewports without overlapping UI.

## Review Questions

These are the only decisions that should block implementation planning:

1. Confirm the first tone: hybrid tactile scoring, not pure healing or pure precision.
2. Confirm the first prototype stack: Vite + TypeScript + Canvas 2D.
3. Confirm the first surface: laptop-like flat surface.
4. Confirm platform posture: Google Play release priority, Apps in Toss compatibility preserved.

## Next Step

After approval, write `ai/plans/2026-06-07-first-playable-prototype-implementation-plan.md` with bite-sized TDD tasks:

1. Scaffold the web app.
2. Add i18n and platform adapters.
3. Implement peel state and scoring tests.
4. Implement pointer input.
5. Render sticker, tension, tear, and residue.
6. Add result screen.
7. Run browser QA on desktop and mobile viewports.
