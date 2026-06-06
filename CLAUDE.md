
## Project Identity: 스티커떼기

`스티커떼기` is a solo, instant-satisfaction mobile casual game project.

Project rules:
- Treat Google Play Store mobile game release as the primary go-to-market target unless the user changes the release strategy.
- Plan platform architecture for both Google Play and Apps in Toss from the first implementation. For `스티커떼기`, Google Play is the current release priority, but Apps in Toss compatibility must remain explicit through adapters, i18n, safe-area behavior, sound/haptic settings, and SDK-free product logic.
- Keep the core game understandable within 10 seconds: grab a sticker edge, peel slowly, avoid tearing, and finish cleanly.
- Preserve the tactile fantasy: low-angle peeling, tension feedback, tearing risk, adhesive residue, satisfying sound, and haptics.
- Aim for all-ages-friendly content. Avoid gambling, casino mechanics, real-money random rewards, gore, weapons, sexual content, chat, UGC, or unnecessary sensitive permissions.
- Store game specs, implementation plans, QA notes, and release notes under `ai/` first so Codex and Claude can share the same project context.
- The current canonical design brief is `ai/plans/2026-06-07-sticker-peel-game-design.md`.

## Shared Knowledge Sources

- Reuse the shared long-term knowledge repository at `/Users/kangsungbae/Documents/지식저장소`.
- Before substantial planning, architecture, or coding work, read `/Users/kangsungbae/Documents/지식저장소/AI_CONTEXT.md`, then `agent/index.md`, `agent/profile.md`, `agent/operating-rules.md`, and the relevant `sessions/` or `projects/` notes.
- Treat `/Users/kangsungbae/Documents/최종관리자` as a historical/reference workspace when relevant. Search its dated folders for explicit files, but prefer promoted knowledge in `/Users/kangsungbae/Documents/지식저장소` as the durable source of truth.
- When reusable knowledge appears during `스티커떼기` work, promote it into Markdown under `/Users/kangsungbae/Documents/지식저장소` so Codex, Claude, and future AI assistants can share it.
- Keep sync token-light: do not replay all raw logs, do not paste full transcripts, and do not repeatedly read large logs or generated graph files unless the task specifically requires it.
- Answer the user in Korean by default unless the task or requested artifact clearly calls for another language.

## understand-anything

This project uses Understand-Anything project memory in `.understand-anything/`.

Rules:
- For architecture mapping, onboarding, codebase Q&A, domain flow, or diff-risk analysis, prefer the installed Understand-Anything skills before doing a broad source walk.
- Keep `.understand-anything/config.json` with `"language": "ko"`, `"outputLanguage": "ko"`, and `"autoUpdate": true` unless the user asks otherwise.
- Refresh Understand-Anything only after meaningful project or code architecture changes. Do not run it for policy-only, copy-only, or note-only changes.

## Project Plans and Session Logs

This project stores AI-generated planning and session evidence under `ai/`.

Rules:
- Save Claude or Codex plans, specs, implementation briefs, review briefs, QA plans, and release plans in `ai/plans/` as dated Markdown files.
- Save meaningful session change logs in `ai/session-logs/` as dated Markdown files. Include user request, decisions, files changed, commands or verification, risks, next steps, and knowledge-store promotion status.
- Keep plans and logs concise. Do not paste full chat transcripts or full tool logs unless the raw evidence itself is the artifact being preserved.
- Keep `ai/` available to project-local Graphify; do not ignore it in `.graphifyignore`.
- Promote reusable knowledge from these logs to `/Users/kangsungbae/Documents/지식저장소`.
- Follow `/Users/kangsungbae/Documents/지식저장소/docs/workflows/graph-refresh-policy.md` for graph timing.
- Refresh project Graphify after new project setup, verified feature completion, finalized important project docs, durable decisions, or handoffs that depend on recent files.
- Do not refresh project Graphify for ordinary conversation, tiny copy edits, or short unsaved opinions.
- Use `graphify update . --no-cluster` as the routine structural fallback when a refresh is worthwhile.

## App Platform Portability

If this project is an app, follow `/Users/kangsungbae/Documents/지식저장소/docs/workflows/app-platform-standard.md`.

Rules:
- Project-specific target order: Google Play first, Apps in Toss compatible from the first implementation.
- Preserve Apps in Toss and Google Play portability from the first implementation.
- Keep authentication/login, ads, in-app purchase, storage, analytics, haptics, share, and backend transport behind platform adapters.
- Do not import Apps in Toss, Google Play Billing, AdMob, Google login, or other platform SDKs directly from product/domain logic.
- Implement i18n from the first app version: Korean (`ko`) is the default, and English (`en`) must be user-selectable.
- Route UI copy, LLM prompts, notifications, purchase copy, errors, empty states, and onboarding through the active locale instead of hard-coding user-facing strings.
- Plan MVP stubs for login, ads, and IAP even when the first release does not enable them.
- Apps in Toss implementations should use Toss login, Apps in Toss ads, and Apps in Toss IAP.
- Google Play implementations should use Credential Manager or Play Games Services, AdMob, and Google Play Billing.
- Verify paid entitlements on a backend. Do not put store secrets, receipt-verification credentials, or LLM API keys in app bundles.
- Keep a project platform note in `/Users/kangsungbae/Documents/지식저장소/projects/<project-name>/platform.md` when the project becomes an app.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, invoke the Skill tool with `skill: "graphify"` before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- Follow `/Users/kangsungbae/Documents/지식저장소/docs/workflows/graph-refresh-policy.md` for graph refresh timing.
- Refresh project Graphify after new project setup, verified feature completion, finalized important project docs, durable decisions, or handoffs that depend on recent files.
- Do not refresh project Graphify for ordinary conversation, tiny copy edits, or short unsaved opinions.
- Use `graphify update . --no-cluster` as the routine structural fallback when a refresh is worthwhile.
