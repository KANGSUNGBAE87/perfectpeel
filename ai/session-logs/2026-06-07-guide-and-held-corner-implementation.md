# Guide And Held Corner Implementation

- Date: 2026-06-07
- Actor/tool: codex with Superpowers brainstorming and TDD
- User request: add clearer game explanation, make the held sticker side move with the drag, and discuss direction/strength-based fun changes.

## Decisions

- Added a concise first-screen guide panel instead of a long tutorial.
- Added `pullOffset` to app session state so the renderer can move the held corner with the drag.
- Kept the current bar as tension/progress for this change, but documented the next concept as a target strength band.
- Interpreted player-facing "강도" as internal drag speed plus sudden acceleration, with direction handled separately.

## Files Changed

- `src/app/session.ts`
- `src/app/render.ts`
- `src/i18n.ts`
- `src/main.ts`
- `src/styles.css`
- `test/appSession.test.ts`
- `test/i18n.test.ts`
- `ai/plans/2026-06-07-direction-strength-guided-peel-concept.md`

## Verification

- Red check: new app session and i18n tests failed before implementation.
- `npm test`: 5 test files passed, 18 tests passed.
- `npm run build`: TypeScript and Vite production build passed.
- Browser QA at `http://127.0.0.1:5173/`: guide panel visible, held corner movement verified, mobile 390x844 guide layout checked, console error logs empty.

## Remaining Risks

- The held-corner movement is still a stylized canvas illusion, not a full soft-body peel simulation.
- The direction/strength target bar is only documented as the next mechanic and is not implemented yet.

## Knowledge Promotion

- No cross-project standard was promoted. Project-specific concept and implementation evidence remain in `ai/`.
