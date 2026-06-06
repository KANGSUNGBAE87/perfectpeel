# Start Intro And Peel Visual Fix

- Date: 2026-06-07
- Actor/tool: codex with Superpowers debugging and TDD
- User request: fix the held sticker handle stopping, add a start button, and add mutable game explanation copy.

## Decisions

- Added an `intro` app session state so the game waits for the player to press start before accepting drag input.
- Added a short in-progress explanation and `시작하기` button to the guide panel.
- Increased pull offset bounds so the held corner no longer stops at the earlier `-180px` limit.
- Changed tear handling so a torn state does not immediately freeze into a result during drag; the result is finalized when the player releases.
- Added a render model that uses hand movement to estimate visual peel progress, so the sticker and peeled surface do not separate into an oversized blob when the hand has moved far.

## Files Changed

- `src/app/session.ts`
- `src/app/render.ts`
- `src/app/renderModel.ts`
- `src/i18n.ts`
- `src/main.ts`
- `src/platform/adapters.ts`
- `src/platform/browserAdapters.ts`
- `src/styles.css`
- `test/appSession.test.ts`
- `test/i18n.test.ts`
- `test/renderModel.test.ts`

## Verification

- Red checks: app session tests failed before start gating and post-tear movement were implemented; render model test failed before `renderModel.ts` existed.
- `npm test`: 6 test files passed, 22 tests passed.
- `npm run build`: TypeScript and Vite production build passed.
- `GITHUB_PAGES=true npm run build`: GitHub Pages production build passed.
- Browser QA on local dev server: intro/start screen visible, start button works, long drag keeps the handle moving past the old stop point, mobile 390x844 intro layout checked, console error logs empty.

## Remaining Risks

- The visual peel is still a stylized 2D approximation, not a full physical sticker simulation.
- The next large polish pass should model the sticker as attached surface, lifted strip, and held corner as distinct shapes.

## Knowledge Promotion

- No cross-project standard was promoted. Project-specific implementation evidence remains in `ai/`.
