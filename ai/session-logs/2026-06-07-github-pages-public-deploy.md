# GitHub Pages Public Deploy

- Date: 2026-06-07
- Actor/tool: codex with gstack deploy routing and GitHub CLI
- User request: make the prototype available from a public URL.

## Decisions

- Used GitHub Pages because the repository `KANGSUNGBAE87/perfectpeel` is public and GitHub authentication was available.
- Avoided GitHub Actions workflow deployment because the current OAuth token lacks the `workflow` scope.
- Published the built static files directly to the `gh-pages` branch.
- Kept `main` as the source branch and ignored local/generated folders: `.agents/skills/`, `.claude/`, `.codex/`, `graphify-out/`, `dist/`, and `node_modules/`.

## Files Changed

- `.gitignore`
- `vite.config.ts`
- `package.json`
- `package-lock.json`
- `ai/session-logs/2026-06-07-github-pages-public-deploy.md`

## Verification

- `npm test`: 5 test files passed, 18 tests passed.
- `GITHUB_PAGES=true npm run build`: TypeScript and Vite production build passed.
- `git push -u origin main`: source branch pushed successfully.
- `git push origin gh-pages`: static deployment branch pushed successfully.
- GitHub Pages run `27069951134`: completed with success.
- Public URL checked in browser: `https://kangsungbae87.github.io/perfectpeel/`
- Public page rendered the Korean guide, Canvas game surface, and assets from `/perfectpeel/assets/`.
- Public page drag interaction worked and console error logs were empty.

## Remaining Risks

- This is a direct `gh-pages` branch deployment. Future deploys need either another manual `dist` push or a GitHub token with `workflow` scope to enable Actions deployment.
- The visual peel model still needs redesign: the sticker/surface boundary and held-corner movement are serviceable for feedback but not yet polished.

## Knowledge Promotion

- No cross-project standard was promoted. The deploy evidence remains project-local.
