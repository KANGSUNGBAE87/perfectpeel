# 스티커떼기 첫 프로토타입 확장 기획 리뷰

Date: 2026-06-07  
Status: planning review, ready for user approval  
Input spec: `ai/plans/2026-06-07-first-playable-prototype-spec.md`  
Market-informed direction: `ai/plans/2026-06-07-market-informed-sticker-peel-product-plan.md`  
Workflow: Superpowers brainstorming + gstack autoplan-style CEO/design/engineering review
Platform posture: Google Play release priority, Apps in Toss compatibility preserved

## Executive Decision

Build the first prototype as a tactile scoring toy, not a content-heavy game.

The prototype wins if the player understands this in 10 seconds:

> "낮게, 천천히, 결 따라 당기면 깨끗하게 떨어진다. 급하게 들면 찢어진다."

Everything in the first build should serve that sentence.

## Planning Review Summary

| Lens | Initial Gap | Upgrade Decision |
| --- | --- | --- |
| CEO/Product | The original spec had the mechanic, but not enough replay hook. | Make tension management the main drama and make every failure readable, brief, and retryable. |
| Design | The original spec named feedback types, but not first-10-second hierarchy or screen states. | Define one-screen layout, emotional arc, state table, and non-verbal teaching cues. |
| Engineering | The original spec had modules, but not state transitions or measurable tuning constants. | Add a small state machine, score formulas, adapter contracts, and testable thresholds. |
| DX/Handoff | The implementation plan could drift into generic canvas work. | Lock the implementation around `feel proof`, not visual completeness. |
| Platform | The original wording could be read as Google Play only. | Treat Google Play as current go-to-market priority while preserving Apps in Toss compatibility from the first implementation. |

## Product North Star

The player should feel like they are doing a tiny delicate physical act with immediate consequence.

The first prototype is not about many stickers, unlocks, polish, or store readiness. It is about proving a loop:

1. Notice lifted corner.
2. Pull.
3. Sense whether the pull is good or bad.
4. Adjust.
5. Release cleanly or make a satisfying mess.
6. Retry because the next attempt feels obviously improvable.

## Stronger Player Promise

Use this as the first store-facing seed, even before the final app name is chosen:

> "스티커를 찢지 않고 가장 깔끔하게 떼어내는 30초 손맛 게임."

This is better than "sticker peeling simulator" because it names the challenge, the time scale, and the satisfaction.

## First 10 Seconds

The first screen must not open with instructions. It should open with a playable object.

### Visual Priority

1. Lifted sticker corner.
2. Player finger/pointer affordance area.
3. Sticker surface and peel direction.
4. Tension gauge.
5. Score/time details.

The lifted corner is the hero. The gauge supports it; it must not compete with it.

### First-Time Teaching

Use three silent teaching cues:

- The lifted corner gently bobs once after load.
- A faint curved pull guide appears only until the player starts dragging.
- The sticker edge wrinkles immediately if the player pulls upward too aggressively.

Avoid a tutorial modal in the first prototype.

## Emotional Arc

| Moment | Player Feeling | Design Support |
| --- | --- | --- |
| Load | "I know what to touch." | Raised corner, subtle motion, no clutter. |
| First pull | "Oh, it responds." | Sticker lifts immediately within the first 80ms of drag. |
| Safe peel | "This feels smooth." | Stable peel sound, soft movement, cool tension color. |
| Warning | "I should adjust." | Wrinkle, warmer color, rougher sound, stronger pulse. |
| Mistake | "I caused that." | Tear preview before tear, residue appears at the bad pull area. |
| Finish | "That was mine." | Result reflects visible behavior, retry is instant. |

## Design Pillars

### 1. The Sticker Is The Main Character

The interface should feel like a close-up tactile object, not a dashboard.

Rules:

- No decorative panels around the game area.
- No large text competing with the sticker.
- The result overlay can be compact, but the during-play screen stays object-first.

### 2. Failure Must Teach, Not Punish

Bad pulls should create visible consequences before ending the attempt.

Rules:

- Show a tear preview before a tear counts.
- Let the player recover from warning state if they slow down or correct angle.
- Make residue look like a consequence of the exact bad area, not random dirt.

### 3. Perfect Must Be Rare But Understandable

The player should believe a better score is possible because the mistake was visible.

Rules:

- Every result metric must map to something they saw: tear line, residue mark, elapsed time, or smooth area.
- Do not use hidden penalties in the first prototype.
- A near-perfect run should still invite replay with a visible `98% clean` style result.

## One-Screen Layout

```text
+------------------------------------------------+
| compact top bar: time + current rating hint     |
|                                                |
|                                                |
|             [large surface area]               |
|                                                |
|          ┌──────────────────────┐              |
|          │       STICKER        │◜ lifted      |
|          │                      │  corner      |
|          └──────────────────────┘              |
|                                                |
|        low, thin tension gauge below sticker    |
|                                                |
| bottom: retry/settings only after result        |
+------------------------------------------------+
```

Mobile notes:

- The sticker should occupy about 55-70% of the shorter viewport dimension.
- The lifted corner touch target should be at least 44px.
- The gauge should sit below the sticker, not over the peeling edge.
- Result overlay should leave the final sticker/residue visible behind it.

## Interaction State Table

| State | Trigger | What The Player Sees | What The System Tracks |
| --- | --- | --- | --- |
| `ready` | Screen loaded | Lifted corner bobs once; faint pull guide visible. | `progress=0`, `tension=0`, timer not started. |
| `peelingSafe` | Drag begins with acceptable angle/speed. | Sticker lifts smoothly; cool gauge color. | Timer starts, progress increases, low tension. |
| `peelingWarning` | Angle/speed/direction leaves safe range briefly. | Edge wrinkles, gauge warms, rough sound starts. | Tension rises, warning time accumulates. |
| `peelingDanger` | Warning persists or jerk is severe. | Red edge stress and tear preview. | Tear risk rises, haptic pulse escalates. |
| `torn` | Tear risk threshold crossed. | Sticker tears at stressed area; residue appears. | Tear percent locked, attempt can finish as torn or messy. |
| `released` | Progress reaches completion. | Final release motion and sound. | Final clean/residue/time calculated. |
| `result` | Released or failed. | Compact score overlay with retry. | Input disabled except retry/language/settings. |

## Mechanical Model

Use simple tuned rules before trying complex physics.

### Input Measurements

- `dragVector`: current pointer movement from previous frame.
- `pullAngle`: angle between drag direction and ideal peel direction.
- `pullSpeed`: pixels per second, smoothed over recent frames.
- `jerk`: sudden speed change between frames.
- `warningTimeMs`: accumulated time outside safe range.
- `dangerTimeMs`: accumulated time in red range.

### Suggested Starting Thresholds

These are initial tuning constants, not final balance:

- Safe pull angle: within 35 degrees of ideal peel direction.
- Warning angle: 35-65 degrees.
- Danger angle: over 65 degrees or mostly upward.
- Safe speed: 40-260 px/s.
- Warning speed: 260-430 px/s.
- Danger speed: over 430 px/s or abrupt jerk over 280 px/s change.
- Tear preview: 450ms continuous danger.
- Tear event: 900ms continuous danger or two severe jerks within 700ms.
- Residue: warning/danger while progress increases, weighted by bad direction.

### Recovery Rule

If the player returns to safe angle and speed:

- Tension decays quickly for the first 300ms.
- Tear preview fades if no tear has occurred.
- Residue risk remains partially accumulated.

This makes the game feel fair because adjustment matters.

## Score Formula

Use transparent scoring for the first build:

```text
cleanPercent = clamp(100 - tearPercent - residuePercent, 0, 100)
tearPercent = clamp(tearDamage * 100, 0, 100)
residuePercent = clamp(residueDamage * 100, 0, 100)
timeBonus = elapsedMs <= 18000 ? 1 : max(0, 1 - ((elapsedMs - 18000) / 22000))
```

Rating rules:

- `Perfect`: clean >= 95, tear == 0, residue <= 3, elapsedMs <= 30000.
- `Clean`: clean >= 82, tear <= 8, residue <= 12.
- `Messy`: sticker released but clean < 82.
- `Torn`: tear >= 35 or sticker fails before release.

The result copy should explain one visible reason:

- `각도 좋아요. 거의 완벽하게 떨어졌어요.`
- `조금 빨랐어요. 오른쪽 끝에 접착 자국이 남았어요.`
- `위로 당겨서 찢어졌어요. 낮게 눕혀 당겨보세요.`

## Sound And Haptic Direction

Prototype sound can be synthetic or stubbed, but events must be named clearly.

Audio events:

- `peel:safe:start`
- `peel:safe:loop`
- `peel:warning:loop`
- `peel:danger:tick`
- `peel:release`
- `peel:tear`
- `ui:retry`

Haptic events:

- `peel.safePulse`
- `peel.warningPulse`
- `peel.dangerPulse`
- `peel.releaseTap`
- `peel.tearSnap`

The adapter should support no-op fallback because desktop browsers and some devices may not allow haptics.

## UX Copy

Korean default:

- Start hint: `모서리를 잡고 낮게 당기세요`
- Safe microcopy: `좋아요`
- Warning microcopy: `천천히`
- Danger microcopy: `찢어질 수 있어요`
- Result action: `다시 떼기`

English:

- Start hint: `Grab the corner and peel low`
- Safe microcopy: `Smooth`
- Warning microcopy: `Slow down`
- Danger microcopy: `May tear`
- Result action: `Peel again`

Only show microcopy when it helps. The primary teaching should remain visual and tactile.

## Architecture Addendum

The implementation plan should use these boundaries:

```text
input -> peelPhysics -> gameState -> renderer
                         |          |
                         |          +-> i18n text lookup
                         +-> audio/haptics adapter events
```

### State Ownership

- `peelPhysics` owns raw calculations and returns a frame update.
- `gameState` owns durable run state, rating, and result.
- `renderer` is pure drawing from state and should not decide scores.
- `platform` adapters receive named events and decide whether the environment can play them.
- `i18n` owns all user-facing strings.

### Testable Units

- Angle and speed classification.
- Tension accumulation and recovery.
- Tear preview and tear event thresholds.
- Residue accumulation.
- Rating calculation.
- i18n lookup fallback.
- Audio/haptic adapter no-op behavior.

## Design Review Score

| Dimension | Before | After This Review | Remaining Risk |
| --- | ---: | ---: | --- |
| Information hierarchy | 6/10 | 9/10 | Needs visual QA after implementation. |
| Interaction states | 5/10 | 9/10 | Actual feel depends on tuning. |
| Emotional arc | 5/10 | 9/10 | Failure feedback must avoid feeling random. |
| Specific UI direction | 6/10 | 8/10 | A visual style pass is still needed after prototype. |
| Responsive/accessibility | 5/10 | 8/10 | Needs mobile viewport QA and touch target checks. |
| Engineering handoff | 6/10 | 9/10 | Constants will need real playtest iteration. |

## Not In Scope For First Prototype

- Sticker collection.
- Multiple surfaces.
- Skin shop or unlocks.
- Ads, purchase, login, cloud save, analytics.
- Daily challenges.
- Native app build.
- Store listing assets.
- Advanced mesh deformation or real adhesive simulation.

## Dual Platform Planning Addendum

This project should be planned for both Google Play and Apps in Toss, with a clear order:

1. Google Play remains the current go-to-market priority for `스티커떼기`.
2. Apps in Toss compatibility must be preserved from the first implementation.
3. Product logic must not import platform SDKs directly.
4. Platform services should start as adapters with no-op prototype implementations.

### Platform Compatibility Requirements

| Area | First Prototype Decision | Apps in Toss Future | Google Play Future |
| --- | --- | --- | --- |
| Runtime | Web-first Canvas prototype | WebView/Granite-compatible bundle if selected | Android web shell, native WebView, TWA, or later native implementation |
| Auth | No-op `AuthAdapter` | Toss login and backend token verification | Credential Manager, Google Sign-In, or Play Games Services |
| Ads | No-op `AdsAdapter` | Apps in Toss ad placements only | AdMob / Google Mobile Ads placements |
| IAP | No-op `PaymentAdapter` | Apps in Toss IAP, backend entitlement verification | Google Play Billing, backend entitlement verification |
| Storage | Local state for prototype | Toss-compatible storage or backend sync | Android/local/cloud storage through adapter |
| Analytics | No-op `AnalyticsAdapter` | Toss-compatible analytics if enabled | Firebase/GA or approved analytics |
| Haptics | `HapticsAdapter` with web/no-op fallback | Toss/native bridge or WebView fallback | Android haptics |
| Share | No-op `ShareAdapter` | Toss-compatible share/deeplink path if allowed | Android share sheet / Play-compatible share path |
| Backend | No backend in prototype | Required for token/payment verification when enabled | Required for billing/entitlement verification when enabled |
| i18n | `ko` default, `en` selectable | Same product dictionary, Toss locale hints optional | Same product dictionary, Android locale hints optional |

### Apps in Toss-Specific Guardrails

- The prototype should avoid browser history tricks, iframe flows, external URL redirects, and `eval`-style external code execution.
- The game should be able to open quickly and remain understandable within 10 seconds.
- Sound and haptic settings should be planned because Toss game checks expect controllable media behavior.
- Safe area behavior must be tested before Toss packaging.
- Apps in Toss ads/IAP/login must be added only through platform adapters.

### Google Play-Specific Guardrails

- Keep all-ages-friendly game content and avoid sensitive permissions.
- Use Google Play Billing only through `PaymentAdapter` if digital goods are added.
- Use AdMob only through `AdsAdapter` if ads are added.
- Keep store credentials, billing verification secrets, and API keys out of the app bundle.

## Implementation Planning Requirements

The next implementation plan must include:

1. A failing unit test for angle/speed classification before implementing physics.
2. A failing unit test for tension recovery before rendering.
3. A tiny state machine before pointer input is wired to Canvas.
4. i18n and platform adapters before result copy, audio, or haptics are used.
5. No-op adapter interfaces for auth, ads, IAP, storage, analytics, haptics, share, and backend transport before platform-specific code exists.
6. Browser QA with at least two viewports: desktop and 390px-wide mobile.
7. A manual feel checklist: safe peel, warning recover, tear, residue, release, retry.

## Approval Gate

Recommended defaults:

- Tone: tactile classic hybrid.
- First surface: laptop-like matte surface.
- First sticker: rectangular paper sticker with one lifted top-right corner.
- Prototype stack: Vite + TypeScript + Canvas 2D.
- Platform posture: Google Play first, Apps in Toss compatible.
- First success metric: a player can improve their second attempt after seeing why the first attempt scored poorly.

If these defaults are approved, implementation planning can begin.
