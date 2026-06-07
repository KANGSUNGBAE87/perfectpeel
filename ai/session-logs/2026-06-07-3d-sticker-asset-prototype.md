# 2026-06-07 3D Sticker Asset Prototype

- Actor/tool: codex
- User request: Apply the Gemini-generated sticker sheet to improve the prototype visuals.
- Stage: implementation

## Decisions

- Kept the existing canvas physics, drag handling, i18n, and platform adapters intact.
- Added the Gemini PNG as a public runtime asset at `public/assets/stickers/sticker-sheet.png`.
- Added `src/app/stickerAssets.ts` to split the 4-up sheet into `flat`, `lifted`, `rolled`, and `torn` sprite states at runtime.
- Used chroma-key cleanup for the bright green background and green shadow pixels.
- Kept the original vector sticker path as fallback when the image asset fails to load.
- Hid the in-canvas tension gauge on result screens to avoid visual clutter behind the result panel.

## Files Changed

- `public/assets/stickers/sticker-sheet.png`
- `src/app/stickerAssets.ts`
- `src/app/render.ts`
- `src/app/renderModel.ts`
- `src/main.ts`
- `src/vite-env.d.ts`
- `test/stickerAssets.test.ts`
- `test/renderModel.test.ts`

## Verification

- `npm test -- test/stickerAssets.test.ts`
- `npm test -- test/renderModel.test.ts`
- `npm test`
- `npm run build`
- Browser QA on `http://127.0.0.1:5173/`
  - Intro screen renders the 3D flat sticker.
  - Active peel switches to the rolled sticker state.
  - Upward fast drag switches to torn result immediately.
  - Result panel is visible and play HUD is hidden.
  - Browser console had no errors.

## Risks / Follow-up

- The source image is one sheet with baked-in lighting, so sprite shadows are not fully independent layers.
- Further polish should request separate transparent PNG layers from Gemini: flat sticker, underside, curl, torn edge, residue, and shadow.
- No reusable long-term knowledge promotion needed yet; this is project-local implementation evidence.
