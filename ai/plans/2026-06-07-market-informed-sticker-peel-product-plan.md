# 스티커떼기 시장조사 반영 기획안

Date: 2026-06-07  
Status: market-informed product plan, ready for user review  
Inputs:
- `ai/plans/2026-06-07-sticker-peel-market-research.md`
- `ai/plans/2026-06-07-first-playable-prototype-spec.md`
- `ai/plans/2026-06-07-first-playable-prototype-expanded-planning-review.md`
- `/Users/kangsungbae/Documents/지식저장소/projects/스티커떼기/platform.md`

Workflow:
- Superpowers brainstorming: market evidence -> product position -> prototype design.
- gstack autoplan-style review: CEO/Product, Design, Engineering, and DX checks with auto-decisions.

## Market Read

The market research shows that sticker-themed mobile games already exist, but most close competitors use the sticker action as a wrapper around match, sort, hidden-object, booster, or decor loops.

The opportunity is not "make a sticker game." The opportunity is:

> Make the actual act of peeling the game.

## Verified Signals

| Signal | What It Means For 스티커떼기 |
| --- | --- |
| `My Sticker Room` has large demand in cozy sticker/decor play. | Sticker/cozy/satisfying themes can scale, but decor/collection is not our first wedge. |
| `Sticker Away` and `Sticker Jam` focus on peel + match/sort puzzles. | Avoid color match, slots, boosters, and puzzle pressure as the first hook. |
| Competitor copy repeats relaxing, ASMR, tidy-up, offline, all-ages. | Use these emotional promises, but back them with a deeper touch mechanic. |
| Reviews and market notes mention ad/booster friction. | Do not make success feel gated by ads or boosters. Monetization must not block clean peeling. |
| Weak "realistic sticker peeling" competitors exist. | The fantasy is plausible, but the win depends on execution quality and retention loop. |

## Final Positioning

`스티커떼기` should be positioned as:

> Precision peel ASMR skill toy.

Korean pitch:

> 낮게, 천천히, 결 따라 당겨서 스티커를 가장 깔끔하게 떼어내는 30초 손맛 게임.

English pitch:

> A 30-second precision peeling game where every angle, pull, tear, and residue mark is your fault.

This is intentionally not:

- a sticker sorting puzzle
- a match-3 sticker game
- a room decorating game
- a booster-driven puzzle
- a tap-to-peel idle toy

## Product Bet

The product bet is that a single satisfying peel can be more memorable than another sticker sorting puzzle.

The first prototype should therefore prove:

1. The player can understand the low-angle peel rule without a tutorial.
2. The player can feel tension through visual, audio, and haptic feedback.
3. The player can see why a bad pull caused tear or residue.
4. The player wants to retry because the next run feels improvable.

## Target Player

Primary:

- Likes ASMR, organizing, cleaning, or satisfying-object mobile games.
- Wants short solo sessions.
- Dislikes heavy puzzle blockers, timers, and ad-gated progress.
- Enjoys improving a tiny physical skill.

Secondary:

- Casual game players who like high-score/perfect-run loops.
- Cozy mobile players who prefer gentle interaction over stress.

Do not target:

- Players looking for deep puzzle strategy.
- Players who want gacha, collection pressure, or competitive meta.
- Players who want social or UGC features.

## Product Shape

### Prototype V0: Feel Proof

Goal: prove the peel interaction.

Scope:

- One sticker.
- One surface.
- One screen.
- Drag the lifted corner.
- Tension feedback.
- Tear and residue.
- Result screen.
- Retry.
- No ads, no purchases, no login, no collection.

Success metric:

> A player who gets a messy result can explain what they did wrong and improve on the second attempt.

### MVP V1: Clean Peel Runs

Goal: turn the feel into a repeatable game.

Scope:

- 10 sticker/surface combinations.
- 20 short classic stages.
- Perfect run score.
- Healing mode with no failure state.
- Local records.
- Sound/haptic settings.
- Korean and English.
- Platform adapters still stubbed unless release path demands real implementations.

### Store Candidate V2

Goal: prepare for Google Play release while preserving Apps in Toss compatibility.

Scope:

- Platform build path selected.
- Store-safe content rating posture.
- Privacy and permission review.
- Ads/IAP decision document before any monetization.
- Backend entitlement plan only if purchases exist.
- Apps in Toss packaging feasibility reviewed if Toss is still an active target.

## Core Loop

```text
See lifted corner
-> drag low and slow
-> tension responds
-> adjust before tear
-> release or make residue
-> result explains cause
-> retry immediately
```

The loop should take 20-45 seconds.

## Differentiation Rules

1. Peel by drag, not tap.
2. Score the quality of the physical action, not puzzle completion.
3. Teach with tactile feedback before text.
4. Make failure local and visible: the tear happens where the bad pull happened.
5. Keep monetization away from success/failure in early versions.
6. Keep the game all-ages and everyday-object focused.

## First 10 Seconds

The first screen should show a large sticker on a familiar surface. One corner is lifted. No modal tutorial appears.

Priority order:

1. Lifted corner.
2. Finger/pointer affordance.
3. Surface texture and peel direction.
4. Tension gauge.
5. Time or rating hint.

Silent teaching:

- Corner bob on load.
- Faint low-angle guide until first drag.
- Immediate wrinkle if the player pulls too high.
- Tension color shifts before tear.

## Interaction Model

The game judges:

- pull angle
- pull speed
- pull direction
- jerk
- time spent in warning/danger
- recovery after correction

Recommended first thresholds:

- Safe angle: within 35 degrees of ideal direction.
- Warning angle: 35-65 degrees.
- Danger angle: over 65 degrees or mostly upward.
- Safe speed: 40-260 px/s.
- Warning speed: 260-430 px/s.
- Danger speed: over 430 px/s or sudden jerk.
- Tear preview: 450ms in continuous danger.
- Tear event: 900ms in continuous danger or repeated severe jerk.

These constants are not balance truth. They are implementation starting points for playtest tuning.

## Scoring

Use visible, explainable results:

- `Clean`
- `Tear`
- `Residue`
- `Time`
- `Rating`

Ratings:

- `Perfect`: clean >= 95, tear == 0, residue <= 3, time <= 30s.
- `Clean`: clean >= 82, tear <= 8, residue <= 12.
- `Messy`: released but residue/tear is noticeable.
- `Torn`: tear >= 35 or sticker fails before release.

Result copy must name the cause:

- `위로 당겨서 찢어졌어요. 낮게 눕혀 당겨보세요.`
- `조금 빨랐어요. 오른쪽 끝에 접착 자국이 남았어요.`
- `각도 좋아요. 거의 완벽하게 떨어졌어요.`

## UX And Visual Direction

Visual tone:

- Close-up tactile object.
- Clean everyday surfaces.
- Soft but not childish.
- No busy puzzle board.
- No decorative UI frame around the main game area.

First surface:

- Matte laptop lid or notebook cover.

First sticker:

- Rectangular paper label with one lifted top-right corner.

Why:

- Familiar, all-ages-safe, readable.
- Matte surfaces make residue visible.
- Rectangular sticker makes peel progress and angle easier to read.

## Platform Plan

Platform order:

1. Google Play remains the current go-to-market priority.
2. Apps in Toss compatibility remains required from the first implementation.

Prototype runtime:

- Vite + TypeScript + Canvas 2D.

Adapter requirements from V0:

- `AuthAdapter`: no-op guest identity.
- `AdsAdapter`: no placements in V0, no-op interface exists.
- `PaymentAdapter`: no products in V0, no-op interface exists.
- `StorageAdapter`: local settings and records.
- `AnalyticsAdapter`: no-op event sink.
- `HapticsAdapter`: web vibration/no-op fallback.
- `AudioAdapter`: named sound events, browser-safe fallback.
- `ShareAdapter`: no-op.
- `BackendTransport`: no-op.
- `LocaleAdapter`: Korean default, English selectable.

Product and game logic must not import Apps in Toss, Toss login, Google login, AdMob, Google Play Billing, or platform SDKs directly.

### Readiness Rule For Ads, Purchases, And Login

Ads, purchases, and login are always implementation-ready, even when disabled in the current product slice.

Implementation-ready means:

- A named adapter interface exists.
- A no-op implementation exists for V0.
- Product logic calls the adapter, not a platform SDK.
- Platform-specific config and IDs have a future home outside game logic.
- Backend verification is planned before any paid entitlement is granted.

Implementation-ready does not mean:

- V0 shows ads.
- V0 sells products.
- V0 requires login.
- V0 imports Toss, AdMob, Google Play Billing, Google login, or Toss login SDKs.

## Monetization Position

Do not design the first prototype around ads, boosters, or paid continues.

Market research shows ad/booster friction is a known pain in adjacent games. `스티커떼기` should initially win trust by making improvement skill-based, not ad-gated.

Later monetization candidates:

- Optional remove-ads purchase if ads are introduced.
- Cosmetic sticker/surface packs.
- Premium healing pack.

Avoid:

- Random paid rewards.
- Paid boosters required to clear stages.
- Interrupting a peel attempt with ads.

## SEO / Store Keyword Direction

Korean:

- 스티커 떼기
- 스티커 제거
- 힐링 게임
- ASMR 게임
- 테이프 떼기
- 깔끔하게 떼기
- 접착제 잔여물

English:

- sticker peel
- peel sticker
- satisfying peel
- ASMR peel
- clean peel
- residue
- precision peeling
- tape peel

Store copy should avoid sounding like a generic puzzle:

- Prefer: `정밀하게 떼는 손맛`
- Avoid: `스티커를 맞추고 정렬하세요`

## gstack / Superpowers Review

### CEO/Product Review

Score: 8.5/10 after market correction.

What improved:

- The plan now has a sharper wedge: `precision peel ASMR skill toy`.
- It avoids direct competition with sorting/match sticker games.
- It responds to known market pain: ads, boosters, artificial blockers.

Remaining risk:

- The whole product depends on tactile feel. If the first peel is mediocre, the differentiation collapses.

Decision:

- Keep V0 brutally small and optimize for feel proof before adding content.

### Design Review

Score: 8/10 after market correction.

What improved:

- The first screen is object-first.
- The first 10 seconds have a hierarchy.
- Failure is designed as visible feedback, not a hidden penalty.

Remaining risk:

- No visual mockup yet. The plan should get a visual/design QA pass after the first canvas prototype exists.

Decision:

- Do not add menus, level maps, collection, or store framing to V0.

### Engineering Review

Score: 8.5/10 after market correction.

What improved:

- Physics constants, state machine, scoring, adapters, and testable units are clear.
- Platform SDKs are kept out of product logic.

Remaining risk:

- Canvas deformation can become messy if physics and rendering are coupled.

Decision:

- Implement peel physics as pure TypeScript before Canvas rendering.

### DX / Handoff Review

Score: 8/10 after market correction.

What improved:

- The implementation plan has a clear TDD route.
- The "why" behind product choices is now explicit.

Remaining risk:

- Engineers may overbuild platform adapters too early.

Decision:

- V0 adapters should be no-op interfaces only, not real Toss/Google implementations.

## Implementation Plan Requirements

The next implementation plan must include:

1. Failing tests for angle/speed classification.
2. Failing tests for tension accumulation and recovery.
3. Failing tests for rating calculation.
4. No-op platform adapter interfaces before UI calls them.
5. Explicit readiness seams for login, ads, purchases, platform config, and future backend verification.
6. i18n dictionaries before user-facing copy appears.
7. Pointer input and Canvas rendering after physics tests pass.
8. Browser QA on desktop and 390px mobile viewport.
9. Manual feel checklist:
   - safe peel
   - warning recover
   - danger tear
   - residue
   - release
   - retry

## Supersedes / Updates

This plan supersedes the product direction in:

- `ai/plans/2026-06-07-first-playable-prototype-spec.md`
- `ai/plans/2026-06-07-first-playable-prototype-expanded-planning-review.md`

Those files remain useful as detailed mechanics and review notes, but implementation planning should now treat this market-informed plan as the lead product direction.

## Approval Gate

Recommended defaults:

- Positioning: precision peel ASMR skill toy.
- V0 goal: feel proof, not content volume.
- First surface: matte laptop or notebook.
- First sticker: rectangular paper label.
- Runtime: Vite + TypeScript + Canvas 2D.
- Platform posture: Google Play first, Apps in Toss compatible.
- Monetization: no ads/IAP/boosters in prototype.

When these defaults are approved, move to `ai/plans/2026-06-07-first-playable-prototype-implementation-plan.md`.
