# 스티커떼기 시장조사

Date: 2026-06-07  
Status: initial market scan  
Related brief: `ai/plans/2026-06-07-sticker-peel-game-design.md`

## Scope

현재 기획안이 상정한 핵심 경험은 단순한 스티커 테마가 아니라 `잡기 -> 낮은 각도로 당기기 -> 장력 피드백 읽기 -> 찢김/잔여물 없이 떼기`에 가까운 촉각 시뮬레이션이다.

이번 조사는 Google Play와 App Store 중심으로 다음 질문을 확인했다.

- 스티커를 떼는 모바일 게임이 이미 있는가?
- 있다면 대부분 어떤 장르 구조인가?
- `스티커떼기`가 피해야 할 겹침과 잡아야 할 차별점은 무엇인가?

## Short Answer

비슷한 소재의 게임은 있다. 특히 2025-2026년 기준 `sticker peel`, `sticker away`, `sticker jam`, `tape peel` 계열의 캐주얼 퍼즐이 확인된다.

하지만 현재 확인된 주요 경쟁작은 대부분 `탭해서 떼기 + 매치/정렬/숨은그림/부스터` 구조다. 기획안처럼 드래그 각도, 속도, 장력, 찢김, 잔여물 판정을 핵심 조작으로 삼는 정밀한 `스티커 제거 시뮬레이션`은 아직 더 빈 공간으로 보인다.

## Competitor Map

| Game | Platform signal | Similarity | Notes |
| --- | --- | --- | --- |
| My Sticker Room - Decor Game | Google Play, SayGames, 1,000만+ 다운로드, 전체이용가 | Adjacent | 스티커를 떼고 붙이는 힐링/꾸미기 게임. 대형 수요 신호는 강하지만 목표는 제거 시뮬레이션보다 장식과 수집이다. 리뷰에서 광고 빈도와 구독형 광고 제거 불만이 보인다. |
| Sticker Away - Sorting Puzzle | App Store, Shycheese, 4.8 / 97 ratings, 4+ | Direct material, different core | 3D 모델의 스티커를 떼고 3개 매치하는 퍼즐. 리뷰에는 컨셉은 좋지만 레벨이 부스터/광고를 요구한다는 불만이 반복된다. |
| Sticker Jam: Sort Puzzle | App Store / Android listings, Zego/iKame, 2026 release signal | Direct material, different core | ASMR 스티커 떼기와 `unscrew/sort` 퍼즐을 결합. 장력 조작보다 레이어 순서와 정렬 퍼즐이 중심이다. |
| Sticker Jam: Peel Off & Match | Google Play, AM Hyper Games, 500+ downloads | Direct material, smaller signal | 스티커를 떼고 색을 맞추는 퍼즐. 명확히 `peel off and match` 포지션이다. |
| Sticker Peel 3D / Unstick Em All | Android third-party listing, From Home Studio, last update 2023-12 | Direct material, older/smaller signal | 일상 물건의 스티커를 찾아 떼는 숨은그림/매치3형 게임. `perfect sticker peel` 만족감을 전면에 내세우지만 물리 조작 시뮬레이션보다는 퍼즐 구조다. |
| ASMR Sticker Peeling | Android third-party listings, Potato Toot LLC, low download/no-rating signal | Closest theme, weak market signal | `realistic sticker peeling experience`를 주장하지만 다운로드/평점 신호가 약하다. 실제 조작 깊이나 유지 성과는 불명확하다. |
| Untape Jam - Tape Sort Puzzle | App Store, SkyFury, 4.9 / 408 ratings, 4+ | Adjacent mechanic | 스티커 대신 테이프를 벗겨 3D 물체를 드러내는 정렬 퍼즐. `떼기 ASMR + 퍼즐` 수요가 현재 살아 있음을 보여준다. |
| Peeling master! Peel Off mask | App Store, Fatmee Waqar, 9+ | Adjacent ASMR peel | 피부/마스크/아크릴/테이프 등 여러 벗기기 ASMR 소재. `스티커떼기`의 all-ages, everyday object 포지션과는 톤이 다르다. |

## Market Pattern

현재 시장의 가까운 게임들은 대체로 아래 패턴이다.

- 스티커/테이프를 `정밀하게 당기는 것`보다 `탭해서 제거하는 것`이 많다.
- 제거 행동은 핵심 손맛이라기보다 매치3, 정렬, 숨은그림, 레이어 순서 퍼즐의 보상 액션으로 쓰인다.
- `ASMR`, `satisfying`, `relaxing`, `tidy up`, `no timer`, `offline`, `all ages` 문구가 반복된다.
- 부스터, 슬롯, 광고, 불가능하게 느껴지는 퍼즐 난이도에 대한 불만이 반복된다.

## Opportunity For 스티커떼기

`스티커떼기`의 차별화는 소재가 아니라 입력 감각이다.

추천 포지션:

- `Sticker sorting puzzle`이 아니라 `precision peel ASMR skill toy`.
- 첫 화면부터 하나의 스티커를 손가락으로 직접 잡아 저각도로 접어 떼는 조작.
- 성공 조건은 매치/정렬이 아니라 `찢김 0%, 잔여물 최소, 안정적인 장력`.
- 실패도 불쾌하지 않게, 찢어짐/잔여물/거친 소리로 즉시 배우게 만든다.

피해야 할 겹침:

- 색상 3개 매치, 슬롯/부스터 중심의 `Sticker Away/Jam`식 구조를 MVP 핵심으로 삼지 않는다.
- `tap to peel`만으로 끝나는 구현은 기존작과 너무 가까워진다.
- 광고나 부스터가 성공을 막는 느낌은 이 장르의 이미 확인된 불만을 반복할 가능성이 높다.

## Prototype Implication

첫 플레이어블은 경쟁작보다 기능이 적어도 된다. 대신 아래 한 가지가 반드시 좋아야 한다.

> 손가락을 움직이는 방향과 속도에 따라 스티커가 살짝 버티고, 잘못 당기면 찢어질 것 같고, 잘 당기면 부드럽게 벗겨지는 느낌.

MVP 판단 기준:

- 10초 안에 이해된다.
- 첫 터치 2초 안에 스티커 모서리가 살아 움직인다.
- 장력 색/소리/진동만으로 좋은 방향을 읽을 수 있다.
- 결과 화면에서 `Clean`, `Tear`, `Residue`, `Time`이 조작 결과처럼 느껴진다.

## Suggested Keywords

- Korean: 스티커 떼기, 스티커 제거, 힐링 게임, ASMR 게임, 테이프 떼기, 접착제 잔여물, 깔끔하게 떼기
- English: sticker peel, peel sticker, satisfying peel, ASMR peel, tape peel, clean peel, residue, precision peeling

## Sources Checked

- Project brief: `ai/plans/2026-06-07-sticker-peel-game-design.md`
- Google Play: My Sticker Room - https://play.google.com/store/apps/details?hl=ko&id=com.playstrom.my.sticker.room
- Google Play: Sticker Jam: Peel Off & Match - https://play.google.com/store/apps/details?hl=en_US&id=com.amhypergames.stickerjam
- App Store: Sticker Away - Sorting Puzzle - https://apps.apple.com/us/app/sticker-away-sorting-puzzle/id6756044022
- App Store: Sticker Jam: Sort Puzzle - https://apps.apple.com/us/app/sticker-jam-sort-puzzle/id6758762667
- App Store: Untape Jam - Tape Sort Puzzle - https://apps.apple.com/us/app/untape-jam-tape-sort-puzzle/id6757353720
- App Store: Peeling master! Peel Off mask - https://apps.apple.com/us/app/peeling-master-peel-off-mask/id1624426575
- AppBrain: Sticker Away Android listing - https://www.appbrain.com/app/sticker-away-stickers-match-3d/sticker.jam.away.match.puzzlegames
- AppBrain: ASMR Sticker Peeling - https://www.appbrain.com/app/asmr-sticker-peeling/com.potatotootllc.asmr
- APKPure: Sticker Peel 3D / Unstick Em All - https://apkpure.net/unstick-em-all/fun.fromhome.unstickemall
- AppAgg: Sticker Jam Android listing - https://appagg.com/android-games/puzzle/sticker-jam-sort-puzzle-41387907.html
