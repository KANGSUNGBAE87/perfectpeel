# 2026-06-07 디자인 리뷰 반영 구현

작업자/도구: Codex, Superpowers TDD, in-app Browser

## 사용자 요청

디자인 리뷰에서 지적한 문제를 실제 프로토타입에 개선 반영할지 물었고, 이전 디자인 리뷰를 구현 승인 범위로 보고 진행했다.

## 구현 내용

- 종료 규칙 개선
  - `progress >= 1`: 즉시 완료.
  - `torn`: 손을 놓으면 찢어진 결과.
  - `progress >= 0.85`: 손을 놓으면 `Messy` 완료.
  - `progress < 0.85`: 손을 놓아도 결과로 끝나지 않고 계속 시도 가능.
- 점수 판정 개선
  - `progress < 1`을 무조건 `Torn` 처리하지 않고, 85% 이상 중간 완료는 `Messy`로 판정.
- 물리 민감도 개선
  - 빠른 낮은 각도 당김이 첫 프레임에 바로 찢어지지 않도록 jerk 즉시 찢어짐 조건을 완화.
- UI/HUD 개선
  - 시작 설명을 하단 시트로 이동.
  - 플레이 중 하단 HUD에 떼어진 정도, 85% 완료 기준, 힘 목표 구간을 표시.
  - 기존 microcopy가 HUD와 겹치지 않도록 숨김.
- 캔버스 렌더링 개선
  - 스티커 크기와 표면 프레이밍 확대.
  - 붙은 면, peel edge, 들린 리본, 손잡이, 접착 자국 레이어를 더 명확히 그림.
  - 캔버스 미터를 진행도/힘 두 줄로 분리.

## 변경 파일

- `src/app/session.ts`
- `src/game/gameState.ts`
- `src/game/peelPhysics.ts`
- `src/app/render.ts`
- `src/main.ts`
- `src/i18n.ts`
- `src/styles.css`
- `test/appSession.test.ts`
- `test/gameState.test.ts`
- `test/peelPhysics.test.ts`
- `test/i18n.test.ts`
- `ai/plans/2026-06-07-design-fix-implementation-plan.md`

## 검증

- `npm test`: 6 files, 27 tests passed.
- `npm run build`: passed.
- `GITHUB_PAGES=true npm run build`: passed.
- in-app Browser local QA:
  - 시작 전 화면에서 하단 규칙 시트와 큰 스티커 확인.
  - 시작 후 HUD 텍스트 겹침이 사라진 것 확인.
  - 낮은 각도 드래그가 즉시 찢어지지 않고 진행도/힘 HUD를 갱신하는 것 확인.

## 남은 위험

- 현재 캔버스 렌더링은 개선됐지만 아직 최종 아트 수준은 아니다.
- 다음 단계에서는 실제 모바일 터치 속도에서 85% 완료/100% 완료까지 도달하는 감각을 더 튜닝해야 한다.

## 지식 저장소 승격

현재 내용은 프로젝트 전용 구현 로그로 유지한다. 공유 장기 지식 승격은 필요하지 않다.
