# Direction And Strength Guided Peel Concept

- Date: 2026-06-07
- Status: discussion note, not yet implemented
- Context: User feedback after first playable prototype.

## Problem

The current prototype makes tearing feel too one-dimensional: pulling upward causes a tear, but repeatedly punishing one direction can feel arbitrary. The player also needs clearer guidance before the tactile rules become fun.

## Proposed Fun Shift

Make each sticker a small dexterity prompt:

- Direction: show the peel direction the sticker wants, such as low-left, low-right, shallow-up-left, or curved peel.
- Strength: show a target force band on the lower bar.
- Speed: implement strength mostly as drag speed plus sudden acceleration, but present it to the player as "힘".
- Goal: keep the current pull marker inside the target band while following the direction cue.

## Recommended Model

Use a `target pull window` instead of a simple danger bar:

- The lower bar shows a green target zone.
- A live marker shows the player's current pull strength.
- Too weak: progress barely moves.
- In range: clean peel progress and satisfying feedback.
- Too strong or too jerky: tension rises, adhesive residue increases, then tear preview appears.
- Wrong direction: strength marker can still move, but the direction cue flashes and tear risk rises.

This keeps the fantasy tactile: the player is not just avoiding "up", they are reading the sticker's material and matching the pull.

## V0.1 Scope Candidate

- Add a pre-run cue: direction arrow plus "약하게 / 보통 / 강하게" target.
- Replace the current tension-only lower bar with a target strength band and live pull marker.
- Keep the existing result metrics, but add one internal score component for direction match.
- Keep platform adapters unchanged.

## Open Decision

Decide whether every sticker should have a random target each run, or whether early stages should teach one target at a time.

Recommendation: early stages should teach one target at a time, then later stickers combine direction and strength variations.
