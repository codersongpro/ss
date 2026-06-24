# 학교 지도 개편 및 50인 구성원 셔플링 작업 체크리스트

- [x] `@/game/types/index.ts` 내 `LocationType` 신규 장소들(1~6학년 교실, 체육실 등) 정의 추가
- [x] `@/store/useGameStore.ts` 내 `dailyNpcPlacement` 상태 필드 선언 및 초기값 지정
- [x] `@/store/useGameStore.ts` 내 일일 인물 셔플링 함수 `shuffleNpcPlacements()` 구현
- [x] `@/store/useGameStore.ts` 내 `startGame()` 및 `progressTime()`에 `shuffleNpcPlacements()` 호출 통합
- [x] `@/store/useGameStore.ts` 내 `talkToNPC()` 함수에 12인의 가상 학년 교사 대화 시나리오 구축
- [x] `@/store/useGameStore.ts` 내 `exploreLocation()` 및 `executeLocationAction()`을 16개 신규 장소로 확장
- [x] `@/components/game/DashboardLayout.tsx` 내 1층/2층 격자 맵 데이터 정의 및 `currentFloor` 상태 연동
- [x] `@/components/game/DashboardLayout.tsx` 내 `moveChar`에서 계단('ST') 밟았을 때 층 전환 및 좌표 조절 연동
- [x] `@/components/game/DashboardLayout.tsx` 내 `handleBackToMap`에서 16개 장소 문앞 복원 좌표 갱신
- [x] `@/components/game/DashboardLayout.tsx` 내 `getLocationTheme`에서 16개 장소 테마 설명문 기재
- [x] `@/components/game/DashboardLayout.tsx` 내 상주 NPC 대화 버튼을 `dailyNpcPlacement` 기준으로 동적 렌더링
- [x] 로컬 빌드 테스트 검증 (`npm run build`)
- [x] 최종 결과서 작성 및 `walkthrough.md` 업데이트
