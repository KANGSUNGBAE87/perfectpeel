# 스티커떼기 게임 디자인 브리프

Date: 2026-06-07  
Status: concept migrated, ready for detailed spec or prototype plan  
Primary target: Google Play Store mobile game

## Source Context

This brief migrates the sticker-peeling game concept discussed in `/Users/kangsungbae/Documents/인사이트도출` into the dedicated `스티커떼기` project.

The broader portfolio direction is solo, immediately satisfying casual games: understandable within 10 seconds, responsive on the first touch, playable in short rounds, and safe for broad mobile release.

## Product Goal

Create a one-hand mobile casual game where the player peels stickers cleanly from everyday surfaces.

The game should feel like a tactile toy with score pressure layered on top. It should be easy to understand, satisfying even on failure, and strong enough to support repeated short plays.

## Core Fantasy

"찢지 말고, 남기지 말고, 가장 깔끔하게 떼어내세요."

The player grabs a curled sticker edge, pulls slowly, feels resistance, adjusts the angle, and gets a satisfying final release when the sticker comes off cleanly.

## Core Loop

1. A sticker appears on a surface such as a laptop, cup, box, notebook, or window.
2. One corner is slightly lifted so the player knows where to start.
3. The player drags the sticker edge to peel it.
4. The game continuously evaluates peel direction, angle, speed, and tension.
5. Good peeling expands the lifted area smoothly.
6. Bad peeling increases tension, creates wrinkles, tears the sticker, or leaves adhesive residue.
7. The stage ends with a clean score, tear score, residue score, time score, and rating.

## Peeling Rule

The player should not need to memorize a hidden answer. The correct direction must be readable through feedback.

Good peeling generally means:
- Pull at a low angle, almost folding the sticker back over itself.
- Pull along the adhesive release direction rather than straight upward.
- Keep a steady speed and avoid sudden jerks.
- Adjust when the sticker wrinkles, reddens, vibrates, or makes rough sounds.

Bad peeling generally means:
- Pull straight upward.
- Pull too fast.
- Pull against the sticker grain.
- Keep pulling while the tension warning is red.

## Feedback System

Use feedback as the main teaching tool.

Visual feedback:
- Lifted sticker surface grows smoothly when the angle is good.
- Sticker edge wrinkles when the direction is poor.
- Stress color shifts from blue to yellow to red.
- Tear lines appear before an actual tear.
- Adhesive residue remains when the player pulls badly.

Audio feedback:
- Smooth peel: stable "찌이이익" sound.
- Dangerous peel: rough, shaky tearing sound.
- Final success: clean "착" release sound.
- Failure: paper rip or sticky snap sound.

Haptic feedback:
- Light continuous vibration during safe peeling.
- Stronger pulsing vibration near tearing.
- Short satisfying tap when the sticker releases.

## Score Model

Recommended result metrics:
- Clean peel percentage
- Tear percentage
- Adhesive residue percentage
- Time
- Perfect streak

Example result:

```text
PERFECT PEEL
Clean: 98%
Tear: 0%
Residue: 2%
Time: 18.4s
```

## Modes

### Classic

Stage-based progression. Each stage introduces a new sticker material, shape, or surface.

### Perfect Challenge

The stage only succeeds if tearing stays at 0%.

### Time Attack

Peel as many stickers as possible before time runs out. Speed matters more, but tearing still reduces score.

### Healing Mode

No failure state. The focus is ASMR peeling, soft sounds, and visual satisfaction.

## Stage Ideas

1. Laptop logo sticker
2. Glass cup price label
3. Delivery box label
4. Notebook name tag
5. Snack bag promo sticker
6. Phone protective film
7. Window sticker
8. Old paper sticker on a wall
9. Circular seal sticker
10. Long tape strip

Difficulty can increase by changing sticker material, shape, adhesive strength, surface texture, and allowed peel angle.

## MVP Scope

Prototype MVP:
- 5 sticker types
- 2 background surfaces
- One classic mode
- Tension gauge
- Tearing and residue judgement
- Basic sound and haptic events
- Result screen with clean, tear, residue, and time

First store-candidate MVP:
- 10 sticker types
- 3 background surfaces
- 20 classic stages
- Perfect Challenge mode
- Basic collection page for peeled stickers
- Korean and English text
- Store-safe content rating posture

## Release Guardrails

This is a Google Play Store mobile game project.

Keep early versions all-ages-friendly:
- No gambling, casino, betting, loot boxes, or real-money random rewards.
- No blood, gore, weapons, realistic injury, or aggressive violence.
- No sexual content or suggestive character framing.
- No chat, UGC, public profiles, or user-to-user communication.
- No location, contacts, microphone, camera, SMS, call log, or other unnecessary sensitive permissions.
- Keep ads and purchases out of the prototype. If later added, route them through platform adapters and document the policy impact.

## Open Decisions

- Final title: `스티커떼기`, `Perfect Peel`, `착! 스티커`, or another store-facing name.
- Primary tone: healing ASMR, precision challenge, or a hybrid with Healing Mode plus Classic scoring.
- Implementation stack: to be decided when moving from concept to implementation plan.
- Visual style: realistic everyday objects, cute toy-like objects, or clean minimal puzzle style.

## Recommended Next Step

Write a prototype implementation plan for the first playable version:

- One screen.
- One sticker object.
- Drag-to-peel interaction.
- Tension gauge.
- Tear/residue scoring.
- Result screen.

Only after this prototype feels good should the project expand into modes, collection, store assets, and release preparation.
