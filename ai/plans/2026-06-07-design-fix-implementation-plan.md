# 디자인 리뷰 반영 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development for behavior changes, then verify with browser screenshots before release.

**Goal:** 현재 퍼블릭 프로토타입에서 보이지 않는 종료 기준, 약한 HUD, 구분 안 되는 스티커 레이어를 한 번에 개선한다.

**Architecture:** 게임 규칙은 `src/app/session.ts`와 `src/game/gameState.ts`에 유지하고, 렌더링은 `src/app/render.ts`의 캔버스 모델을 정리한다. DOM UI는 `src/main.ts`, `src/i18n.ts`, `src/styles.css`에서 bottom-sheet와 HUD copy 중심으로 조정한다.

**Tech Stack:** Vite, TypeScript, Vitest, Canvas 2D, GitHub Pages.

---

## Scope

- 중간 손 놓기 규칙을 추가한다.
  - `progress >= 1`: 깔끔한 완료.
  - `torn`: 손을 놓으면 찢어진 결과.
  - `progress >= 0.85`에서 손을 놓으면 지저분한 완료.
  - `progress < 0.85`에서 손을 놓으면 결과로 끝내지 않고 계속 시도 가능.
- 결과 판정에서 `progress < 1`을 무조건 `Torn`으로 처리하지 않는다.
- 시작 설명 카드를 약하게 만들고, 게임 오브젝트와 하단 HUD가 규칙을 설명하게 한다.
- 캔버스 스티커를 "붙은 면 / peel edge / 들린 리본 / 손잡이 / 접착 자국" 레이어로 다시 정리한다.
- 브라우저 캡처로 시작 전, 플레이 중, 결과 상태를 확인한다.

## Implementation Tasks

1. TDD: `releaseSession()`의 중간 손 놓기와 85% 이상 완료 규칙 테스트를 추가하고 실패를 확인한다.
2. TDD: `finishRun()`이 85% 이상 중간 완료를 `Messy`로 판정하는 테스트를 추가하고 실패를 확인한다.
3. 세션/스코어링 구현을 최소 수정으로 통과시킨다.
4. i18n 문구와 DOM 구조를 HUD 중심으로 조정한다.
5. 캔버스 렌더링의 표면/스티커/리본/손잡이/미터를 다시 그린다.
6. `npm test`, `npm run build`, `GITHUB_PAGES=true npm run build`를 실행한다.
7. 로컬 또는 퍼블릭 브라우저로 캡처 검증 후 배포한다.
