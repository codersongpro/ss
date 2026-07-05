# 티처 메이커 — 게임 진행 알고리즘 수정 및 재미 개선 작업 지시서

> **이 문서는 AI 코딩 에이전트(하위 모델)가 단독으로 실행할 수 있도록 작성된 작업 지시서다.**
> 각 작업(WO, Work Order)은 대상 파일 · 현재 동작 · 문제 · 수정 지시 · 완료 기준을 포함한다.
> 라인 번호는 2026-07 시점 `main` 기준이며, 코드가 이동했을 수 있으므로 **항상 인용된 코드 조각을 검색해서 위치를 재확인한 뒤 수정하라.**

## 작업 규칙 (모든 Phase 공통)

1. 작업 브랜치: 지정받은 브랜치에서 작업한다. 지정이 없으면 `main`에서 새 브랜치를 딴다.
2. **Phase 순서대로, WO 번호 순서대로** 진행한다. Phase 0은 저위험 버그픽스라 서로 독립적이고, Phase 1·2는 Phase 0 완료를 전제로 한다.
3. 각 WO 완료 시마다 `npm run build`가 성공해야 한다. WO 1~3개 단위로 커밋한다 (커밋 메시지에 WO 번호 명시, 예: `fix(store): WO-02 죽은 삼항 clamp 인자 정리`).
4. 게임 텍스트·주석은 기존 코드와 동일하게 **한국어**로 작성한다.
5. 기존 데이터 구조(`GameEvent`, `GameChoice`, `StatEffect` 등 `src/game/types/index.ts`)를 재사용하고, 새 필드 추가는 각 WO에 명시된 경우에만 한다.
6. 밸런스 수치는 이 문서의 값을 기본으로 하되, 빌드·시나리오 검증(문서 말미의 회귀 체크리스트)에서 명백히 어긋나면 ±30% 내에서 조정 가능하다. 조정 시 커밋 메시지에 사유를 남긴다.

---

## 0. 진단 요약 (왜 이 작업들이 필요한가)

이 게임은 30일 교사 생존 육성 시뮬(프린세스메이커류)로, 콘텐츠 양은 충분하다
(이벤트 222개, 업무 템플릿 217개, 전화/메신저 풀 400+건, 엔딩 27종).
그런데도 재미가 없는 이유는 콘텐츠가 아니라 **진행 알고리즘과 구조**에 있다:

### 진단 ① 선택이 무의미하다
- 장소 행동(`executeLocationAction`)에 반복 상한·체감 효과가 없어 **같은 행동 반복이 항상 최적**이다.
  보건실 휴식(hp+15/mental+10/번아웃-10, 1TP)은 무한 회복 수단이고, 교장실 대화는 비용 없이 스탯만 준다.
- TP 예산(realistic 기준 주중 22일 × 9TP ≈ 198TP)이 엔딩 임계 도달 필요량(스탯당 ~10TP)의 10~20배라,
  목표를 정한 플레이어는 너무 쉽게 이기고, 아무 목표 없는 플레이어는 러버밴딩(위기 시 긍정 이벤트 55%) 때문에 지지도 않는다.
- 이벤트 선택지 다수가 "한쪽이 전부 +, 다른 쪽은 파생 스탯(무효)+HP 감소"처럼 **한쪽이 명백히 우월**하다.
- 결정적으로, 데이터 파일의 선택지 효과 **74건이 파생 스탯을 직접 타겟해 전부 무효**다 (WO-01).

### 진단 ② 긴장(리스크)이 없다
- 회복 수단 과잉 + 정시퇴근 보너스(hp/mental+5, 번아웃-5 매일) + 위기 시 긍정 이벤트 비율 상향 조합으로
  게임오버 4종은 고의적 자해 없이는 발동하지 않는다.
- 반면 압박은 전부 "방치 벌점"(미확인 메신저/전화, 미결 업무 매일 중복 차감) 형태라,
  플레이어 체감은 **위험한 결단이 아니라 알림 청소 노동**이다.
- 난이도 곡선이 없다. 업무 스폰율 45%, 패널티 수치, 이벤트 심각도 모두 30일 내내 상수이고
  플레이어 스탯만 단조 증가하므로 **후반 10일은 이미 이긴 게임을 소화하는 시간**이다.

### 진단 ③ 서사 아크가 없다
- `GameEvent.followUpEvents` 필드(이벤트 연쇄 장치)가 타입에만 존재하고 **데이터 전체에서 사용 0건**이다.
  모든 이벤트가 단발성이라 "어제의 선택이 오늘 돌아오는" 경험이 없다.
- 프린세스메이커의 재미 핵심인 **계획 → 실행 → 정기 평가(대회/수확) 리듬**이 없다.
  day 10/20 고정 업무 2건이 전부이고, 그마저 day 20 저녁 마일스톤 이벤트는 버그로 영구 미발동이다 (WO-03).

### 진단 ④ 목표가 보이지 않는다
- 엔딩 조건은 잠긴 갤러리의 힌트 텍스트로만 존재하고, 플레이 중 "지금 어느 엔딩에 가까운지" 표시가 없다.
- 파생 스탯 5종(업무능력 등)은 공식이 숨겨져 있어 플레이어가 올리는 방법을 알 수 없다.

### 진단 ⑤ 마찰이 재미를 갉아먹는다
- 이벤트 내레이션 타자기 연출(15ms/자)을 스킵할 수 없다.
- 아침 브리핑 모달 + 번아웃 경고 모달 + `window.confirm` 퇴근 경고가 매일 겹친다.
- 타일맵 이동은 TP 무비용 + 타일 클릭 순간이동이라 사실상 장식인데, 튜토리얼은 "이동 1TP"라고 가르친다.

아래 Phase 0(버그픽스) → Phase 1(알고리즘·밸런스) → Phase 2(재미 구조) 순서로 고친다.

---

## Phase 0 — 정합성 버그픽스 (저위험 · 상호 독립)

### WO-01. 파생 스탯 직접 효과 74건을 기반 스탯으로 치환

- **대상**: `src/data/events.ts`, `src/data/funnyStudentEvents.ts`, `src/data/funnyParentEvents.ts`,
  `src/data/funnyColleagueEvents.ts`, `src/data/funnyAdminEvents.ts`, `src/data/funnyRandomEvents.ts`,
  `src/data/npcDialoguesData.ts`
- **현재 동작**: 선택지 `immediateEffects`/`effects`에 `{ stat: 'classManagement', value: N }` 등
  파생 스탯 효과가 총 74건 존재한다 (classManagement 61, workCapacity 7, teachingResearch 5, interpersonal 1).
  그러나 파생 스탯 5종은 `src/store/useGameStore.ts`의 `syncNewStats()`(약 :186)가
  **모든 스탯 적용 경로(16개 호출 지점)에서 기반 스탯으로부터 재계산해 덮어쓰므로**, 이 효과들은 전부 무효다.
  ```ts
  // useGameStore.ts:186 — 파생 스탯은 항상 이 공식으로 덮어써진다
  workCapacity   = expert*0.4 + adminPower*0.4 + adminTrust*0.2
  interpersonal  = colleagueRelation*0.3 + studentTrust*0.3 + parentTrust*0.3 + colleagueSolidarity*0.1
  familyRelation = familySatisfaction
  classManagement = studentTrust*0.5 + parentTrust*0.3 + educationSoshin*0.2
  teachingResearch = expert*0.7 + teachingSatisfaction*0.3
  ```
- **수정 지시**: 데이터 파일의 파생 스탯 효과를 아래 매핑으로 **일괄 치환**하라 (값·부호 유지):
  | 잘못된 타겟 | 치환할 기반 스탯 |
  |---|---|
  | `classManagement` | `studentTrust` |
  | `workCapacity` | `adminPower` |
  | `teachingResearch` | `expert` |
  | `interpersonal` | `colleagueRelation` |
  | `familyRelation` | `familySatisfaction` |
  치환 후 `grep -rn "stat: 'classManagement'\|stat: 'workCapacity'\|stat: 'teachingResearch'\|stat: 'interpersonal'\|stat: 'familyRelation'" src/data/` 결과가 0건이어야 한다.
- **재발 방지**: `src/game/types/index.ts`에 기반 스탯만 허용하는 타입을 추가하고 `StatEffect.stat`에 적용하라:
  ```ts
  export type DerivedStatKey = 'workCapacity' | 'interpersonal' | 'familyRelation' | 'classManagement' | 'teachingResearch';
  export type BaseStatKey = Exclude<keyof Stats, DerivedStatKey>;
  // StatEffect.stat: keyof Stats  →  stat: BaseStatKey
  ```
  이 변경으로 타입 에러가 나는 곳이 남아 있으면 그것이 곧 놓친 치환 지점이다.
- **완료 기준**: grep 0건 + `npm run build` 성공.

### WO-02. 죽은 삼항 정리 (`clamp(v, cond ? 0 : 0, 100)`)

- **대상**: `src/store/useGameStore.ts` — 7곳 (:1113, :1185, :1606, :2966, :3559, :3735, :3968)
- **현재 동작**: `clamp(newStats[eff.stat] + eff.value, eff.stat === 'burnout' ? 0 : 0, 100)` —
  삼항 양쪽이 모두 `0`이라 무의미하다 (원래 의도는 불명).
- **수정 지시**: 7곳 모두 `clamp(newStats[eff.stat] + eff.value, 0, 100)`으로 단순화하라. 동작 변화 없음.
- **완료 기준**: `grep -n "? 0 : 0" src/store/useGameStore.ts` 0건 + 빌드 성공.

### WO-03. day 20 마일스톤 이벤트 도달 불가 수정

- **대상**: `src/store/useGameStore.ts`의 `getEventForTime` (약 :779)
- **현재 동작**: 5/10/15/20/25일차 **저녁**에 기획 이벤트(`evt_child_event_NN` / `evt_single_weekend_NN`)를 강제 주입한다.
  ```ts
  if (time === 'evening' && [5, 10, 15, 20, 25].includes(day)) { ... }
  ```
  그런데 `progressTime()`(약 :1260)에서 주말(`day % 7 === 6 || day % 7 === 0`)은 morning→summary로
  건너뛰어 저녁 페이즈가 없다. **day 20은 토요일(20%7===6)이므로 `evt_child_event_04`/`evt_single_weekend_04`는 영구 미발동**이다.
- **수정 지시**: 마일스톤 날짜를 주중으로 옮겨라: `[5, 10, 15, 20, 25]` → `[5, 10, 15, 19, 25]`
  (19%7===5, 주중). 접미사 계산이 `day / 5` 기반이므로 함께 수정해야 한다 — 날짜→접미사 매핑을 명시적으로 바꿔라:
  ```ts
  const MILESTONE_DAYS: Record<number, string> = { 5: '01', 10: '02', 15: '03', 19: '04', 25: '05' };
  if (time === 'evening' && MILESTONE_DAYS[day]) {
    const targetSuffix = MILESTONE_DAYS[day];
    ...
  }
  ```
- **완료 기준**: 19일차 저녁에 해당 이벤트가 발동하는지 수동 확인(회귀 체크리스트 시나리오 참조) + 빌드 성공.

### WO-04. careerPoint 고아화 해소

- **대상**: `src/data/events.ts`, `src/store/useGameStore.ts`의 `checkEndingConditions`(약 :1670)
- **현재 동작**: `ending_supervisor`(장학사)는 `careerPoint >= 40`을 요구하지만, careerPoint를 주는 이벤트는
  `events.ts`에 ~5개뿐(최대 +30, :1642/:1838/:1945/:2041/:2191 부근)이고 전부 `family`/`colleague` 카테고리다.
  저녁 추첨 카테고리 목록에는 `'career'`가 있으나(**getEventForTime :773**) `category: 'career'`인 이벤트는 0개다.
- **수정 지시** (둘 다 수행):
  1. `events.ts`에 `category: 'career'` 이벤트를 **4개 신규 작성**하라 — 소재: 대학원 진학 설명회, 교육청 파견 제안,
     수업 연구대회 공고, 승진 가산점 연수. 각 이벤트 구조는 기존 이벤트와 동일하게 3지선다,
     careerPoint +8~+15를 주는 선택지에는 반드시 대가(hp/mental/familySatisfaction 감소 또는 burnout 증가)를 붙여라.
     `dayRange`는 [3,27], `weight: 60~80`, `valence: 'neutral'`.
  2. `ending_supervisor` 조건을 `careerPoint >= 30`으로 완화하라 (지급 총량 대비 40은 여전히 과함).
- **완료 기준**: `grep -c "category: 'career'" src/data/events.ts` ≥ 4 + 빌드 성공.

### WO-05. delegateTask TP 미소모 수정

- **대상**: `src/store/useGameStore.ts`의 `delegateTask` (약 :1569~1590)
- **현재 동작**: 위임은 colleagueRelation -15, burnout +2만 소모하고 `actionPoints`를 전혀 차감하지 않는다
  → 완료(`completeTask`, 1~2TP) 대비 공짜 대안. 또한 `set({ stats: newStats })`(약 :1585)가
  `syncNewStats()` 없이 스탯을 기록해 파생 스탯이 다음 정산까지 낡은 값으로 남는다 (다른 경로는 전부 감싸고 있음).
- **수정 지시**: 위임에 고정 1TP 비용을 부과하라 (`actionPoints < 1`이면 토스트로 거부, 성공 시 `actionPoints - 1`).
  부탁하러 다니는 시간이라는 명분으로 로그 문구도 추가. 아울러 `stats: newStats` → `stats: syncNewStats(newStats)`로 수정하라.
- **완료 기준**: 위임 실행 시 TP가 1 줄어드는 것 확인 + 빌드 성공.

### WO-06. 미결 업무 방치 패널티의 무한 중복 적용 완화

- **대상**: `src/store/useGameStore.ts`의 `progressTime` 내 정산 로직 (약 :1328)
- **현재 동작**: `overdueTasks.forEach`가 **마감 지난 미완료 업무마다, 매일 밤마다** adminPower-20/expert-15/adminTrust-10/
  reputation-8/burnout+10을 반복 차감한다. 업무 2개를 3일 방치하면 행정력 -120 상당 — 회복 불가능한 나선.
- **수정 지시**:
  1. 첫 연체일에만 전액 패널티, 이후 연체일은 25%로 감쇠: `Task`에 `overduePenaltyApplied?: boolean` 필드를 추가하고
     첫 적용 시 true로 마킹, 이미 true면 각 수치를 1/4(반올림)로 적용하라.
  2. 연체 3일째 밤에는 업무를 자동 소멸시키고("교감 선생님이 대신 처리했다"는 메시지와 함께)
     adminTrust -10, reputation -5의 **1회성 청산 패널티**로 종결하라.
- **완료 기준**: 같은 업무로 이틀 연속 전액 패널티가 나오지 않음 + 3일째 자동 소멸 + 빌드 성공.

### WO-07. 긍정(감사) 전화 미확인 벌점 제거

- **대상**: `src/store/useGameStore.ts` 정산 로직 (약 :1357, `phone_positive_` 분기)
- **현재 동작**: 감사·격려 전화를 안 읽으면 colleagueRelation/familySatisfaction/studentTrust 각 -5 벌점.
  힐링 콘텐츠가 부채로 작동한다.
- **수정 지시**: `phone_positive_` 분기의 벌점을 삭제하라. 대신 미확인 긍정 전화는 다음 날로 이월하되
  2일 지나면 조용히 사라지게 하라 (벌점 없음). 이월/만료 로직이 복잡하면 "벌점 삭제 + 당일 만료"만 해도 된다.
- **완료 기준**: 긍정 전화 방치 시 어떤 스탯도 감소하지 않음 + 빌드 성공.

### WO-08. 탐색 이벤트 중복 방지를 로그 문자열 매칭에서 ID 기반으로 교체

- **대상**: `src/store/useGameStore.ts`의 `exploreLocation` (약 :1869)
- **현재 동작**: `recentLogs.some(log => log.includes(evt.title))`로 최근 등장 이벤트를 걸러낸다.
  `recentLogs`는 20건만 유지되므로 로그가 밀리면 같은 이벤트가 재등장하고, 제목이 다른 로그 문구에 포함되면 오탐한다.
- **수정 지시**: 상태에 `recentEventDays: Record<string, number>` (eventId → 마지막 발생 day)를 추가하고,
  이벤트 발동 시 기록, 필터 시 `day - recentEventDays[evt.id] < (evt.cooldown ?? 5)`이면 제외하라.
  `getEventForTime`의 history 파라미터(:800)도 같은 구조를 쓰도록 통일하면 좋다(선택).
- **완료 기준**: 문자열 매칭 코드 제거 + 5일 쿨다운 동작 + 빌드 성공.

### WO-09. 게임 규칙 안내 문구와 실제 코드 일치화

- **대상**: `src/components/game/DashboardLayout.tsx`, `src/components/game/PrologueScreen.tsx`
- **현재 동작 / 수정 지시** (코드가 아닌 **문구를 코드에 맞춰 수정**한다. 단, ①은 예외):
  | # | 불일치 | 위치 | 지시 |
  |---|---|---|---|
  | ① | "이동 1TP 소모" 안내 ↔ 실제 이동 무비용 | 튜토리얼 :315, 프롤로그 PrologueScreen.tsx:113, 툴팁 :966 | 문구에서 "이동 1TP" 삭제 — "이동은 자유, 행동에만 교사력 소모"로 수정 (이동 유료화는 Phase 1에서 하지 않기로 함) |
  | ② | NPC 대화 "교사력 소모 없음" 표기 ↔ 실제 1TP 차감(useGameStore.ts :2035, :2134) | DashboardLayout.tsx :1854 | 표기를 "대화 (교사력 1 소모)"로 수정 |
  | ③ | "매일 아침 7TP" ↔ 실제 9/15/7(난이도별) | 튜토리얼 :315, 프롤로그 :112, 툴팁 :965 | `maxActionPoints` 값을 동적으로 표기하거나 "난이도에 따라 매일 7~15" 로 수정 |
  | ④ | 번아웃 툴팁 "100%=즉시 게임오버" ↔ 실제 3일 유예(useGameStore.ts :1784) | DashboardLayout.tsx :1160 (모달 :2909는 올바름) | 툴팁을 "100% 상태 3일 지속 시 게임오버"로 수정 |
- **완료 기준**: 네 문구 모두 실제 규칙과 일치 + 빌드 성공.

### WO-10. 죽은 코드 제거

- **대상**: `src/store/useGameStore.ts`
- **현재 동작**: `generateStudentDialogue`(약 :867), `talkToNPCLegacy`(약 :2148)는 어떤 UI 경로에서도 호출되지 않는다
  (150건 대화 풀 기반의 현행 `talkToNPC`가 대체). 초기 `actionPoints: 5 / maxActionPoints: 5`(:965)는
  어떤 난이도(7/9/15)와도 일치하지 않는 사전값이다(시작 시 덮어써져 무해하나 오해 소지).
- **수정 지시**: 두 함수와 그 타입 선언·참조를 삭제하라. 삭제 전 `grep`으로 참조 0건을 확인하라.
  초기값은 `actionPoints: 9, maxActionPoints: 9`(realistic 기본)로 맞춰라.
- **완료 기준**: 삭제 후 빌드 성공(참조 에러 없음).

### WO-11. 오타 수정

- **대상**: `src/components/game/DashboardLayout.tsx` :2091
- **수정 지시**: `getTaskChoices`의 키워드 분기 `'교욕과정'` → `'교육과정'`. 이 오타 때문에 교육과정 관련 업무가
  전용 선택지 대신 폴백 선택지를 받는다.
- **완료 기준**: 수정 + 빌드 성공.

---

## Phase 1 — 진행 알고리즘·밸런스 재설계

> 목표: "같은 행동 반복 = 최적"을 깨고, 30일에 걸친 압박 곡선을 만들고, 엔딩 판정을 공정하게 만든다.

### WO-12. 장소 행동 일일 반복 체감(디미니싱 리턴) 도입

- **대상**: `src/store/useGameStore.ts`의 `executeLocationAction`(약 :1925), 상태 정의부
- **현재 동작**: 모든 장소 행동이 1TP에 고정 효과이며 반복 상한·체감 없음. 보건실(hp+15/mental+10/번아웃-10),
  교장실(비용 없이 adminTrust+5/reputation+3) 스팸이 지배 전략이다.
- **수정 지시**:
  1. 상태에 `dailyActionCounts: Record<string, number>` 추가 (매일 아침 정산 시 `{}`로 리셋 — `progressTime`의 다음 날 set 블록).
  2. 같은 `actionType` 실행 횟수에 따라 효과 배율 적용: 1회째 100%, 2회째 100%, 3회째 50%, 4회째 이후 25% (반올림, 최소 ±1).
     비용(hp 감소 등 음수 효과)은 배율을 적용하지 **않는다** — 반복할수록 손해가 커지게.
  3. UI(DashboardLayout.tsx 장소 행동 버튼)에 "오늘 N회 수행 — 효율 M%" 배지를 표시하라.
  4. 교장실 대화(`principal_chat`)에 비용을 추가하라: mental -3 (아부의 정신적 비용).
- **완료 기준**: 같은 행동 4회째에 획득 효과가 1회째의 25%로 표시·적용됨 + 빌드 성공.

### WO-13. 회복 경제 조정 (죽을 수 있는 게임으로)

- **대상**: `src/store/useGameStore.ts`
- **현재 동작**: 보건실 무한 회복 + 정시퇴근 보너스(hp/mental+5, 번아웃-5, :1318) + 위기 시 긍정 이벤트 55%
  (`getTargetPositiveRatio` :225) 삼중 안전망으로 게임오버가 사실상 불가능하다.
- **수정 지시**:
  1. 보건실 회복은 WO-12의 체감 대상에 포함시키되, 추가로 **하루 2회로 제한**하라 (3회째부터 "양호 선생님이 꾀병을 의심한다" 토스트와 함께 효과 0, TP만 소모).
  2. 정시퇴근 보너스는 **당일 미결 업무가 0건일 때만** 지급하라 (조건 없는 매일 +5/+5/-5는 삭제).
  3. `getTargetPositiveRatio`의 위기 완화(0.55)는 유지하되 발동 조건을 `mental < 20 || burnout > 90`으로 좁혀라
     (지금은 mental<30/burnout>80이라 너무 일찍 개입한다).
  4. **기본 일일 소모** 추가: 매일 정산 시 hp -3, burnout +2 (평일만). 교직은 가만히 있어도 닳는다.
     이 값은 난이도별로 warm 0/-0, realistic -3/+2, hard -5/+3으로 차등하라.
- **완료 기준**: realistic에서 회복 행동 없이 15일 방치 플레이 시 hp/번아웃이 위험 구간에 진입함(수동 시나리오) + 빌드 성공.

### WO-14. 주차별 압박 램프 (난이도 곡선)

- **대상**: `src/store/useGameStore.ts`의 `progressTime` 정산 블록 (약 :1406)
- **현재 동작**: 업무 스폰 확률 45%/일, 1~2개 고정. 이벤트 심각도·패널티 모두 30일 내내 상수.
- **수정 지시**: 주차 계수 `week = Math.ceil(day / 7)` (1~5)를 도입하고:
  1. 업무 스폰 확률: `0.30 + week * 0.08` (1주 38% → 4주 62%).
  2. 스폰 개수: 1~2개 → 4주차부터 1~3개.
  3. 이벤트 추첨(`pickBalancedEvent`)의 목표 긍정 비율: 평시 0.35 → `Math.max(0.20, 0.40 - week * 0.05)` (1주 35% → 5주 20%. 위기 완화 비율은 WO-13-3 유지).
  4. day 26~30(마지막 주)에는 아침 브리핑에 "학기말 정산 D-N" 카운트다운 메시지를 추가해 압박을 서사적으로 알려라.
- **완료 기준**: 콘솔 로그 또는 수동 확인으로 4주차 업무 스폰율 상승 확인 + 빌드 성공.

### WO-15. 엔딩 판정 점수화 (사다리 가림 해소)

- **대상**: `src/store/useGameStore.ts`의 `checkEndingConditions` (약 :1625~1768)
- **현재 동작**: if/else 사다리(우선순위 고정)라 상위 조건이 하위 엔딩을 구조적으로 가린다.
  - `ending_class_master`(classManagement≥85)가 같은 스탯 기반의 `ending_peacekeeper`(#9)를 거의 항상 선점.
  - `ending_family_peacekeeper`(#2-4)가 `ending_sustainable`/`ending_hobbyist`를 가림.
  - `ending_burnout`(번아웃≥90)은 번아웃 100 3일 게임오버가 먼저 발동해 사실상 사장.
  - `ending_great_escapist`는 번아웃 70~89를 30일차에 정확히 유지해야 하는 칼끝 조건.
- **수정 지시**: 사다리를 **점수 기반 선택**으로 교체하라.
  1. 각 엔딩을 `{ id, conditions: Array<{stat, op, threshold}>, flags?, items?, tier }` 데이터로 선언하라 (별도 배열, 기존 조건 값 그대로 이관. `ending_true_mentor`는 tier 0 최우선 유지).
  2. 판정: 조건을 **전부** 만족한 엔딩들 중 `달성도 점수 = Σ min(stat/threshold, 1.25) / 조건수 + 조건수 * 0.1`
     이 가장 높은 것을 선택하라. 조건수 가중치(+0.1/조건)로 더 구체적인(조건 많은) 엔딩이 이기게 한다.
     동점이면 tier 낮은(희귀한) 쪽.
  3. 개별 조건 수정:
     - `ending_burnout`: `burnout >= 75 || hp <= 25`로 완화 (게임오버와 밴드 분리).
     - `ending_great_escapist`: `burnout >= 55`로 완화.
     - `ending_class_master`: `classManagement >= 85` → `>= 88` 상향 + 조건에 `parentComplaint <= 30` 추가 (peacekeeper와 차별화).
  4. 어떤 엔딩도 조건을 만족하지 못하면 기존대로 `ending_general`.
- **완료 기준**: 회귀 체크리스트의 엔딩 3종 시나리오에서 의도한 엔딩이 나옴 + 빌드 성공.

### WO-16. TP 경제 상수 정리 및 단일 소스화

- **대상**: `src/store/useGameStore.ts`, `src/components/game/DashboardLayout.tsx`
- **현재 동작**: TP 관련 수치(9/15/7, 행동별 1TP, 야근 +1 등)가 코드 곳곳에 매직 넘버로 흩어져 있고 안내 문구와 어긋난다(WO-09에서 문구는 정리됨).
- **수정 지시**: `src/game/constants.ts` 파일을 신설해 TP/난이도/회복/패널티/램프 상수를 모아 export하고,
  스토어·UI가 이를 import해 쓰도록 치환하라. 튜토리얼·툴팁 문구도 이 상수를 보간해 렌더링하라.
- **완료 기준**: 난이도별 TP를 상수 파일에서 바꾸면 게임·안내 문구가 함께 바뀜 + 빌드 성공.

---

## Phase 2 — 재미 구조 (프린세스메이커의 리듬 이식)

### WO-17. 이벤트 체인(서사 아크) 4개 신설 — `followUpEvents` 활성화

- **대상**: `src/data/events.ts`, `src/store/useGameStore.ts`
- **현재 동작**: `GameEvent.followUpEvents` 필드가 존재하나 데이터 전체에서 사용 0건. 스토어에도 예약 발동 로직이 없다(확인 후, 있다면 재사용).
- **수정 지시**:
  1. 스토어에 예약 큐를 구현하라: 선택지 처리(`selectChoice`) 시 이벤트에 `followUpEvents`가 있으면
     `scheduledEvents: Array<{eventId, triggerDay}>`에 `triggerDay = day + 2~3`으로 push하고,
     해당 날짜의 이벤트 추첨에서 **최우선으로** 반환하라 (마일스톤 주입 다음 순위).
  2. 3~4단계짜리 체인 이벤트를 **4개 아크** 신설하라 (각 아크 = GameEvent 3~4개, `dayRange`는 넉넉히):
     - **학교폭력 의심 아크** (student): 낌새 목격 → 피해 학생 면담(선택에 따라 분기) → 학부모 개입 → 해결/폭발.
       중간 선택이 나쁘면 parentComplaint +25의 폭발 결말로.
     - **동학년 무임승차 동료 아크** (colleague): 업무 떠넘김 → 참을지/맞설지 → 교무실 소문 → 연대 또는 고립.
     - **악성 민원 학부모 아크** (parent): 사소한 항의 → 증거 수집 여부 선택 → 교장실 삼자대면 → 민원 취하/교육청 이관.
     - **공개수업 아크** (career): 지명 통보 → 준비 방식 선택(수업연구/보여주기) → 리허설 → D-day 판정(WO-18과 연결).
  3. 각 단계 선택지는 최소 1개가 **리스크 감수형**(successRate 사용, 실패 시 아크가 나쁜 분기로)이어야 한다.
- **완료 기준**: 아크 1개를 처음부터 끝까지 플레이해 분기 2종 확인 + 빌드 성공.

### WO-18. 주간 마일스톤 판정 이벤트 (프메식 '대회')

- **대상**: `src/data/events.ts`, `src/store/useGameStore.ts`
- **현재 동작**: 정기 평가 이벤트가 없어 스탯을 올릴 이유가 서사적으로 보이지 않는다.
- **수정 지시**: 매주 금요일(day 5, 12, 19, 26) 저녁에 **고정 판정 이벤트**를 주입하라 (WO-03의 마일스톤 주입 로직 확장):
  | 날짜 | 이벤트 | 판정 스탯 | 성공 기준(예시) | 성공/실패 효과 |
  |---|---|---|---|---|
  | 5 | 주간 학급회의 | studentTrust | ≥50 | 성공: studentTrust+8, 보람+8 / 실패: studentTrust-5, 학급 붕괴 조짐 서사 |
  | 12 | 동학년 협의회 발표 | expert | ≥55 | 성공: 평판+10, adminTrust+5 / 실패: 평판-5 |
  | 19 | 공개수업 D-day | expert+teachingSatisfaction 평균 | ≥60 | 성공: careerPoint+10, 평판+12 / 실패: adminTrust-10, mental-10 |
  | 26 | 학기말 학부모 간담회 | parentTrust | ≥60, parentComplaint≤40 | 성공: parentTrust+10, 민원-15 / 실패: parentComplaint+15 |
  판정은 문턱 통과 시 자동 성공이 아니라 `successRate = clamp(30 + (스탯 - 기준) * 2, 5, 95)`의 주사위 판정(기존 diceRoll 시스템 재사용)으로 하라 — 준비가 잘 될수록 확률이 오르는 구조.
  기존 day 10/20 고정 업무(:1430, :1446)는 각각 19일/26일 마일스톤의 "준비 업무"로 문구를 연결하라 (업무 완료 시 해당 판정에 successRate +15 보정).
- **완료 기준**: 4개 판정이 각 날짜 저녁에 발동, 주사위 연출로 성패 분기 + 빌드 성공.

### WO-19. 엔딩 진행도 나침반 UI

- **대상**: `src/components/game/DashboardLayout.tsx`, (판정 데이터는 WO-15의 엔딩 선언 배열 재사용)
- **현재 동작**: 플레이 중 목표 표시가 없어 스탯을 왜 올리는지 알 수 없다.
- **수정 지시**: 좌측 패널(또는 단서/관계 일지 모달)에 "진로 나침반" 카드를 추가하라:
  1. WO-15의 엔딩 선언 데이터로 **현재 달성도 상위 3개 엔딩**을 계산해, 엔딩명 + 부족 조건을 표시
     (예: "전설의 멘토 — 학생신뢰 72/90, 보람 65/80").
  2. 게임오버 4종은 제외, `ending_true_mentor`는 단서 2개 이상 모았을 때만 노출.
  3. 갱신은 렌더 시 계산으로 충분 (스토어 상태 추가 불필요).
- **완료 기준**: 스탯 변화에 따라 상위 3개와 수치가 갱신됨 + 빌드 성공.

### WO-20. 마찰 제거 — 타자기 스킵·모달 통합

- **대상**: `src/components/game/DashboardLayout.tsx`
- **수정 지시**:
  1. `TypewriterText`(약 :119): 출력 중 텍스트 영역 클릭 시 전체 문장을 즉시 표시하도록 수정하라 (두 번째 클릭이 아니라 첫 클릭에 완성).
  2. 아침 브리핑 모달(:2421)과 번아웃 경고 모달(:2962)을 하나의 "아침 브리핑" 모달로 통합하라 (경고는 브리핑 내 섹션으로).
  3. `window.confirm`/`alert` 사용처(퇴근 경고 :618, 캐릭터 생성 검증, 갤러리 초기화 등)를 기존 커스텀 모달 스타일로 교체하라.
- **완료 기준**: 이벤트 텍스트 1클릭 완성, 아침 모달 1개, native confirm/alert 0건 + 빌드 성공.

### WO-21. 선택지 기회비용 감사(audit) — strictly dominant 제거

- **대상**: `src/data/funny*.ts` 5개 파일 (이벤트 150개)
- **현재 동작**: 다수 이벤트가 2지선다인데 한쪽이 순증(+trust/+mental/+expert), 다른 쪽이 순손해(파생 스탯 무효분 + hp 감소)로
  **선택이 아니라 정답 찾기**다. 예: `funnyStudentEvents.ts` evt_funny_student_01~03.
- **수정 지시**: 150개 이벤트를 순회하며 다음 규칙을 적용하라:
  1. 모든 선택지는 **득 1개 이상 + 실 1개 이상**을 갖는다 (실 = hp/mental 감소, burnout/parentComplaint 증가, 또는 다른 신뢰 스탯 감소).
  2. 한 이벤트의 선택지들은 **서로 다른 스탯 축**을 밀어야 한다 (예: A안=학생신뢰↑/동료관계↓, B안=동료관계↑/학생신뢰↓).
  3. 순 효과 합(양수 합 - 음수 합)은 선택지 간 ±4 이내로 맞춰라 — 어느 쪽도 산술적 정답이 아니게.
  4. WO-01의 치환 결과를 이 감사에서 함께 반영하라 (치환된 스탯이 축 분리에 쓰일 수 있다).
  텍스트(narratorText/resultText)는 유지하고 효과 수치만 조정하는 것을 원칙으로 하되, 효과와 서사가 모순되면 resultText를 소폭 수정해도 된다.
- **완료 기준**: 무작위 표본 15개 이벤트에서 규칙 1~3 충족 확인 + 빌드 성공.

---

## 회귀 체크리스트 (각 Phase 완료 시 실행)

1. `npm run build` 성공, `npx tsc --noEmit` 에러 0건.
2. **30일 완주 시나리오**: 새 게임(realistic) → 매일 행동 2~3개 + 시간 진행으로 30일 완주 → 엔딩 화면 도달, 콘솔 에러 0건.
3. **엔딩 도달 시나리오 3종** (Phase 1 완료 후):
   - 학생신뢰 집중(교실/Wee) 플레이 → `ending_legendary_mentor` 또는 `ending_expert` 계열.
   - 행정 집중(교무실/행정실) + 민원 방치 → `ending_office_master` 또는 민원 게임오버.
   - 완전 방치(매일 시간만 진행) → WO-13 이후에는 hp/번아웃 위험 구간 진입이 보여야 함.
4. **마일스톤 확인** (Phase 2 완료 후): day 5/12/19/26 저녁 판정 이벤트 발동, day 19 공개수업 주사위 연출.
5. 수치 밸런스가 명백히 어긋나면(예: 3번 시나리오에서 10일 내 게임오버) 이 문서 작업 규칙 6에 따라 ±30% 내 조정.

---

## 부록 — 참조용 핵심 수치 (수정 전 기준)

- 30일 = 주중 22일 + 주말 8일(6,7,13,14,20,21,27,28 — morning→summary 직행).
- TP: warm 15 / realistic 9 / hard 7, `교사력왕` 특성 +2. hp<30 또는 burnout>80이면 다음 날 -1씩.
- 초기 스탯(realistic): hp/mental 80, burnout 10, expert 30, studentTrust/parentTrust/adminTrust 40, colleagueRelation 50, adminPower 30, familySatisfaction 70, educationSoshin 50, reputation 30, careerPoint 0, 보람/연대감 40, 민원 0.
- 게임오버: hp≤0, mental≤0, 번아웃 100 3일 연속, parentComplaint≥100.
- 이벤트 풀: GameEvent 222개(funny 150 + events.ts 72), 업무 템플릿 217, 긍정 전화 150, 학부모 메신저 250, 동료 사담 20, 학생/동료 대화 각 150.
- 이벤트 추첨: 긍정 비율 목표 35%(위기 시 55%), 탐색 허탕 25%, 히든 탐험 태그 합류 12%.
