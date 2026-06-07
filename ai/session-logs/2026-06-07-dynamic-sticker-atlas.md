# 2026-06-07 Dynamic Sticker Atlas

- Actor/tool: codex
- User request: Use the new Gemini atlas and make the sticker feel more dynamic.
- Stage: implementation

## Decisions

- Replaced the previous 4-up sticker sheet with a cleaner 3x3 green-background Gemini atlas.
- Treated the atlas as a runtime sprite atlas with 9 keys: `flat`, `liftedSmall`, `liftedWide`, `torn`, `rolled`, `flap`, `tornAlt`, `residue`, and `shadow`.
- Added proportional atlas splitting because the source image is `1200 x 896`, so row heights are not exactly equal integers.
- Added crop bleed for sprites that cross cell boundaries, then removed rolled-left bleed after it pulled in a torn-edge artifact from the neighboring cell.
- Added dynamic layer poses so the flap and shadow move, rotate, scale, and fade based on visual progress, pull offset, tension, and torn state.
- Kept the core game physics and result rules unchanged.

## Files Changed

- `public/assets/stickers/sticker-sheet.png`
- `src/app/stickerAssets.ts`
- `src/app/render.ts`
- `test/stickerAssets.test.ts`
- `ai/session-logs/2026-06-07-dynamic-sticker-atlas.md`

## Verification

- `npm test -- test/stickerAssets.test.ts`
- `npm test`
- `npm run build`
- Browser QA on `http://127.0.0.1:5173/`
  - Intro renders the new atlas flat sticker without clipping.
  - Mid-drag and late-drag states move the curled layer independently.
  - Late-drag no longer shows the neighboring torn-edge artifact.
  - Fast upward drag still ends immediately as a torn result.
  - Browser console had no errors.

## Risks / Follow-up

- This is still 2.5D compositing, not real mesh deformation.
- The source atlas still bakes some lighting and shape into each cell, so the motion is more convincing than fully physical.
- A later Three.js or mesh-warp pass would be the path for truly continuous sticker bending.
