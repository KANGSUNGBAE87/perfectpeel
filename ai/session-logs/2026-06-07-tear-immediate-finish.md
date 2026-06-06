# 2026-06-07 찢어짐 즉시 종료 수정

작업자/도구: Codex, Superpowers systematic-debugging/TDD, in-app Browser

## 사용자 요청

찢어졌을 때 왜 그만두지 않고 계속 진행되는지 질문했다.

## 원인

`applyDragFrame()`은 `physics.torn`을 세션 상태 `torn`으로만 표시했고 결과를 만들지 않았다. 결과 전환은 `pointerup`에서 `releaseSession()`이 호출될 때만 일어났다. 그래서 사용자가 포인터를 계속 누르고 있으면 찢어진 상태에서도 계속 드래그가 가능한 것처럼 보였다.

## 구현 내용

- `applyDragFrame()`에서 `physics.torn`이 되는 즉시 `finishSession()`으로 결과 상태 전환.
- 찢어진 결과는 진행도와 무관하게 `Torn` 판정이 되도록 `finishSession()`에서 최소 tear damage를 보정.
- 기존 테스트를 "찢어진 뒤 계속 움직임"에서 "찢어지는 순간 즉시 결과"로 변경.

## 변경 파일

- `src/app/session.ts`
- `test/appSession.test.ts`

## 검증

- `npm test -- test/appSession.test.ts`: 11 tests passed.
- `npm test`: 6 files, 30 tests passed.
- `npm run build`: passed.
- `GITHUB_PAGES=true npm run build`: passed.
- in-app Browser local QA:
  - 시작 후 위로 끌어 찢어짐 입력.
  - 즉시 결과 패널 표시.
  - HUD 숨김, 다시 떼기 버튼 표시 확인.

## 남은 위험

- 찢어짐 순간의 연출은 아직 딱딱하다. 다음 단계에서 짧은 찢어짐 애니메이션/사운드/햅틱을 넣으면 좋다.

## 지식 저장소 승격

프로젝트 전용 버그 수정 기록으로 유지한다. 공유 장기 지식 승격은 필요하지 않다.
