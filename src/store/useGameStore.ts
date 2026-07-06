import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { 
  Stats, 
  PlayerInfo, 
  Student, 
  Parent, 
  Task, 
  DelayedEffect, 
  GameEvent, 
  GameChoice,
  StatEffect,
  LocationType,
  DialogueChoice,
  DialogueStep,
  DialogueSession,
  MessengerNotification,
  EventValence,
  DiscoveryLogEntry
} from '@/game/types';
import { getItemById } from '@/data/items';
import { initialStudents, initialParents } from '@/data/students';
import { gameEvents } from '@/data/events';
import { colleagueDialogueEvents, studentDialogueEvents } from '@/data/npcDialoguesData';
import { parentMessengerEvents, colleaguePrivateEvents } from '@/data/parentMessengerData';
import { positiveEvents } from '@/data/positiveEventsData';
import { taskTemplates } from '@/data/tasksData';


// 전역 BGM 오디오 싱글톤 객체 및 볼륨 조절 헬퍼 [NEW]
let globalBgm: HTMLAudioElement | null = null;

const mapVolumeStepToValue = (step: number): number => {
  switch (step) {
    case 0: return 0.0;
    case 1: return 0.15;
    case 2: return 0.30;
    case 3: return 0.50;
    case 4: return 0.75;
    case 5: return 1.0;
    default: return 0.50;
  }
};

// 시간대 정의
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night' | 'summary';

// 메신저 전용 선택지 이벤트 구조 [NEW]
export interface MessengerEvent {
  id: string;
  sender: string;
  previewText: string;
  choices: {
    id: string;
    text: string;
    effects: StatEffect[];
    resultText: string;
  }[];
  notificationId?: string; // [NEW] 대응되는 알림의 고유 ID를 기록하여 해결 시 리스트에서 제거 가능하게 함
}

// Zustand 스토어 상태 인터페이스
interface GameState {
  // 메타 상태
  gameStarted: boolean;
  day: number;
  timeOfDay: TimeOfDay;
  playerInfo: PlayerInfo | null;
  endingId: string | null;
  
  // RPG 관련 추가 상태
  currentLocation: LocationType | null; // 현재 머무는 학교 장소 (null 이면 지도 화면)
  currentNpcDialogue: { npcName: string; text: string; statEffectText?: string } | null; // (레거시/하위 호환) 단순 팝업
  npcDialogueSession: DialogueSession | null; // (추가) 멀티턴 이벤트 대화 세션
  dailyNpcPlacement: Record<string, { id: string; name: string; role?: string }[]>; // [NEW] 각 장소별 당일 등장 캐릭터 목록
  messengerNotifications: MessengerNotification[]; // [NEW] 수신된 학교 메신저 목록
  activeMessengerEvent: MessengerEvent | null; // [NEW] 현재 활성화되어 팝업된 메신저 사건
  phoneAndTextNotifications: MessengerNotification[]; // [NEW] 스마트폰 수신함 목록
  activePhoneAndTextEvent: MessengerEvent | null; // [NEW] 현재 활성화된 스마트폰 팝업 사건
  
  // 핵심 데이터
  stats: Stats;
  students: Student[];
  parents: Parent[];
  tasks: Task[];
  delayedEffects: DelayedEffect[];
  hiddenFlags: string[];
  completedNpcDialoguesToday: string[]; // 오늘 대화 완료한 NPC ID 목록 [NEW]
  completedDialogueHistory: string[]; // 게임 내내 통틀어 대화 완료한 NPC ID 목록 [NEW]
  completedNpcEvents: Record<string, number[]>; // npcId => 완료된 0~49 인덱스 목록
  completedParentEvents: number[]; // 완료된 학부모 민원 인덱스 목록
  completedColleaguePrivateEvents: number[]; // 완료된 교직원 사적 요청 인덱스 목록
  completedPositiveEvents: number[]; // 완료된 긍정 격려/감사 인덱스 목록
  inventory: string[]; // [NEW] 보유 아이템 id 목록 (어드벤처 요소)
  discoveryLog: DiscoveryLogEntry[]; // [NEW] 단서/관계 일지에 쌓일 발견 기록
  recentEventDays: Record<string, number>; // [WO-08] eventId -> 마지막 발생 day. 로그 문자열 매칭 대신 쓰는 ID 기반 쿨다운
  dailyActionCounts: Record<string, number>; // [WO-12] 장소 행동 actionType -> 오늘 수행 횟수. 매일 아침 리셋되어 반복 체감(디미니싱 리턴) 판정에 쓰인다

  // 현재 진행 중인 이벤트 연출 상태
  currentEvent: GameEvent | null;
  selectedChoice: GameChoice | null;
  eventResultText: string | null;
  dayEffectsTriggered: string[]; // 오늘 발동된 지연 효과 메시지 모음
  
  // 행동 제약 상태
  actionPoints: number;
  maxActionPoints: number;
  
  // 이력 및 UI 토스트
  recentLogs: string[];
  recentValenceLog: EventValence[]; // [NEW] 최근 이벤트/대화 정서 원장 (적응형 밸런싱용, 최근 12건)
  toastMessage: string | null;
  
  // 액션 (조작 메서드)
  startGame: (info: PlayerInfo) => void;
  resetGame: () => void;
  selectChoice: (choice: GameChoice) => void;
  progressTime: () => void;
  completeTask: (taskId: string) => void;
  completeTaskWithChoice: (taskId: string, choiceEffects: { stat: string; value: number }[], resultText: string) => void;
  delegateTask: (taskId: string) => void;
  triggerDelayedEffectsForToday: () => void;
  showToast: (msg: string) => void;
  clearToast: () => void;
  checkEndingConditions: () => void;
  checkFailureConditions: () => boolean; // 즉시 실패 판정 헬퍼 [NEW]
  
  // RPG 고도화 관련 신규 액션
  moveToLocation: (loc: LocationType | null) => void;
  executeLocationAction: (actionType: 
    | 'classroom_lead' 
    | 'office_work' 
    | 'health_rest' 
    | 'playground_train' 
    | 'principal_chat'
    | 'admin_cooperate'
    | 'cafeteria_guide'
    | 'library_organize'
    | 'wee_counsel'
    | 'science_safety'
    | 'gate_safety'
    | 'gym_safety'
    | 'gym_room_organize'
    | 'grade_class_inspect'
  ) => void;
  talkToNPC: (npcId: string, npcName: string) => void;
  clearNpcDialogue: () => void;
  exploreLocation: () => void;
  closeEventResult: () => void;
  shuffleNpcPlacements: () => void; // [NEW] 매일 아침 NPC 재배치
  generateMessengerNotifications: () => void; // [NEW] 매일 아침 메신저 수신
  triggerMessengerAction: (notificationId: string) => void; // [NEW] 메신저 쪽지 클릭
  selectMessengerChoice: (choiceId: string, effects: StatEffect[], resultText: string) => void; // [NEW] 메신저 선택지 클릭
  closeMessengerEvent: () => void; // [NEW] 메신저 팝업 닫기
  generatePhoneAndTextNotifications: () => void; // [NEW] 매일 아침 스마트폰 전화/문자 수신
  triggerPhoneAndTextAction: (notificationId: string) => void; // [NEW] 스마트폰 알림 클릭
  selectPhoneAndTextChoice: (choiceId: string, effects: StatEffect[], resultText: string) => void; // [NEW] 스마트폰 선택지 클릭
  closePhoneAndTextEvent: () => void; // [NEW] 스마트폰 팝업 닫기
  
  // 멀티턴 대화 추가 액션
  selectDialogueChoice: (choice: DialogueChoice) => void;
  advanceDialogueStep: () => void;
  clearDayEffects: () => void;
  counselStudent: (
    studentId: string, 
    actionType: 'empathy' | 'rational' | 'strict' | 'strength' | 'mentoring'
  ) => { feedbackText: string; effectsText: string } | null;
  overtimeWork: () => void; // 야근 선택: 업무능력 +10 대신 건강/멘탈/번아웃 패널티
  bgmVolume: number; // 배경음 볼륨 단계 (0: off, 1~5) [NEW]
  setBgmVolume: (volume: number) => void; // 배경음 볼륨 단계 변경 [NEW]
  burnout100Days: number; // [NEW] 번아웃 100% 상태 연속 지속 일수
  showStatHints: boolean; // 스탯 힌트 표시 여부 [NEW]
  toggleStatHints: () => void; // 스탯 힌트 토글 액션 [NEW]
  diceRollState: {
    rolling: boolean;
    value: number | null;
    success: boolean | null;
    targetChoiceId: string | null;
  } | null; // 주사위 판정 상태 [NEW]
  clearDiceRollState: () => void; // 주사위 상태 초기화 [NEW]
}

// 0 ~ 100 범위 강제 헬퍼
const clamp = (val: number, min: number = 0, max: number = 100) => 
  Math.max(min, Math.min(max, val));

// 5대 핵심 교사 역량 스탯 동기화 헬퍼 [NEW]
const syncNewStats = (s: Stats): Stats => {
  return {
    ...s,
    workCapacity: clamp(Math.round(s.expert * 0.4 + s.adminPower * 0.4 + s.adminTrust * 0.2)),
    interpersonal: clamp(Math.round(s.colleagueRelation * 0.3 + s.studentTrust * 0.3 + s.parentTrust * 0.3 + s.colleagueSolidarity * 0.1)),
    familyRelation: clamp(s.familySatisfaction),
    classManagement: clamp(Math.round(s.studentTrust * 0.5 + s.parentTrust * 0.3 + s.educationSoshin * 0.2)),
    teachingResearch: clamp(Math.round(s.expert * 0.7 + s.teachingSatisfaction * 0.3))
  };
};

// ==========================================
// [NEW] 긍정/부정 적응형 밸런싱 유틸리티
// ==========================================

// 위험(높을수록 나쁨) 스탯: 효과 부호를 뒤집어 정서를 계산한다.
const RISK_STATS: (keyof Stats)[] = ['burnout', 'parentComplaint'];

// 스탯 효과 배열의 순합으로 정서(긍정/부정/중립)를 추론한다.
const inferValence = (effects: StatEffect[] | undefined): EventValence => {
  if (!effects || effects.length === 0) return 'neutral';
  const net = effects.reduce((sum, eff) => {
    const sign = RISK_STATS.includes(eff.stat) ? -1 : 1;
    return sum + sign * eff.value;
  }, 0);
  if (net >= 6) return 'positive';
  if (net <= -6) return 'negative';
  return 'neutral';
};

// 이벤트의 정서를 결정한다(명시 valence 우선, 없으면 대표 선택지 효과로 추론).
const getEventValence = (evt: GameEvent): EventValence => {
  if (evt.valence) return evt.valence;
  // 선택지 즉시 효과들을 모두 합쳐 전반적 색채를 추정
  const allEffects = evt.choices.flatMap(c => c.immediateEffects || []);
  return inferValence(allEffects);
};

// [WO-14] 30일을 7일 단위 5주차로 나눈 압박 램프의 주차 계수(1~5).
const getWeekNumber = (day: number): number => Math.min(5, Math.max(1, Math.ceil(day / 7)));

// 채널 통일 목표 긍정 비율. 위기 상태(멘탈 급락/번아웃 급증)에는 완화를 위해 긍정 비중을 추가로 끌어올린다.
// [WO-13] 완화 개입 조건을 mental<30/burnout>80에서 mental<20/burnout>90으로 좁혔다 — 예전 조건은
// 너무 일찍 개입해 회복 삼중 안전망(보건실+정시퇴근 보너스)과 겹치며 사실상 죽을 수 없는 게임을 만들었다.
// [WO-14] 평시 비율도 주차가 지날수록 낮아지게 해(1주 35% -> 5주 20%) 후반부로 갈수록 긍정 이벤트가
// 줄고 압박이 쌓이는 난이도 곡선을 만든다. 위기 완화(0.55)는 주차와 무관하게 그대로 유지.
const getTargetPositiveRatio = (stats: Stats, day: number): number => {
  const inCrisis = stats.mental < 20 || stats.burnout > 90;
  if (inCrisis) return 0.55;
  const week = getWeekNumber(day);
  return Math.max(0.20, 0.40 - week * 0.05);
};

// 긍정 후보 전체의 가중치 합이 정확히 ratio(기본 20%)가 되도록 그룹별로 재배분한다.
// 그룹 내부 상대 가중치 비율은 그대로 보존된다. 한쪽 그룹이 비어 있으면 전체를 다른 쪽에 배정.
const applyFixedPositiveRatio = <T,>(
  weighted: { item: T; valence: EventValence; baseWeight: number }[],
  ratio: number = 0.2
): { item: T; w: number }[] => {
  const total = weighted.reduce((sum, x) => sum + x.baseWeight, 0);
  if (total <= 0) {
    return weighted.map(x => ({ item: x.item, w: 1 }));
  }
  const posGroup = weighted.filter(x => x.valence === 'positive');
  const otherGroup = weighted.filter(x => x.valence !== 'positive');
  const wPos = posGroup.reduce((sum, x) => sum + x.baseWeight, 0);
  const wOther = otherGroup.reduce((sum, x) => sum + x.baseWeight, 0);

  if (wPos === 0 || wOther === 0) {
    // 한쪽 그룹이 없으면 비율 강제가 불가능하므로 기본 가중치를 그대로 사용.
    return weighted.map(x => ({ item: x.item, w: Math.max(x.baseWeight, 1) }));
  }

  return weighted.map(x => {
    const w = x.valence === 'positive'
      ? x.baseWeight * (ratio * total / wPos)
      : x.baseWeight * ((1 - ratio) * total / wOther);
    return { item: x.item, w: Math.max(w, 0.001) };
  });
};

// 가중 랜덤 선택(빈 배열이면 null).
const pickWeighted = <T,>(weighted: { item: T; w: number }[]): T | null => {
  if (weighted.length === 0) return null;
  const total = weighted.reduce((sum, x) => sum + x.w, 0);
  let r = Math.random() * total;
  for (const x of weighted) {
    r -= x.w;
    if (r <= 0) return x.item;
  }
  return weighted[weighted.length - 1].item;
};

// 긍정 요소 등장 확률을 채널 통일 목표 비율(위기 시 상향, 주차가 지날수록 낮아짐)로 고정해 후보를 고른다.
const pickBalancedEvent = (
  candidates: GameEvent[],
  stats: Stats,
  day: number
): GameEvent | null => {
  if (candidates.length === 0) return null;
  const weighted = applyFixedPositiveRatio(
    candidates.map(evt => ({ item: evt, valence: getEventValence(evt), baseWeight: evt.weight })),
    getTargetPositiveRatio(stats, day)
  );
  return pickWeighted(weighted);
};

// 정서 원장에 결과를 기록(최근 12건 유지)하는 순수 헬퍼. 통계/디버깅용으로 유지.
const pushValence = (log: EventValence[], v: EventValence): EventValence[] =>
  [v, ...log].slice(0, 12);

// NPC 대화 후보 인덱스 중 긍정 요소 등장 확률을 채널 통일 목표 비율(위기 시 상향, 주차 램프)로 고정해 하나를 고른다.
const pickBalancedDialogueIndex = (
  candidateIdxs: number[],
  events: { valence: EventValence }[],
  stats: Stats,
  day: number
): number => {
  if (candidateIdxs.length === 0) return 0;
  const weighted = applyFixedPositiveRatio(
    candidateIdxs.map(i => ({ item: i, valence: events[i]?.valence ?? 'neutral', baseWeight: 10 })),
    getTargetPositiveRatio(stats, day)
  );
  const picked = pickWeighted(weighted);
  return picked !== null ? picked : candidateIdxs[candidateIdxs.length - 1];
};

// 업무 풀 추첨에도 동일 목표 비율을 적용한다. stressCost<=6(보람/경부담 업무)을 긍정 신호로 재사용.
const pickBalancedTaskTemplate = (
  stats: Stats,
  day: number
): typeof taskTemplates[number] => {
  const weighted = applyFixedPositiveRatio(
    taskTemplates.map(t => ({
      item: t,
      valence: (t.stressCost <= 6 ? 'positive' : 'negative') as EventValence,
      baseWeight: 1
    })),
    getTargetPositiveRatio(stats, day)
  );
  return pickWeighted(weighted) ?? taskTemplates[0];
};

// 학급 평균 신뢰도가 임계치를 넘으면 비밀 이벤트의 prerequisites로 쓸 파생 플래그를 만든다.
// 영구 저장되는 hiddenFlags와 달리 매번 현재 학생 상태로부터 계산되어, 신뢰가 다시 떨어지면 사라진다.
const getTrustDerivedFlags = (students: Student[]): string[] => {
  if (students.length === 0) return [];
  const avgTrust = students.reduce((sum, s) => sum + s.teacherTrust, 0) / students.length;
  const flags: string[] = [];
  if (avgTrust >= 80) flags.push('class_trust_high');
  if (avgTrust <= 30) flags.push('class_trust_low');
  return flags;
};

// prerequisites 항목 하나를 검사한다. 'item:아이템id' 형태면 인벤토리 보유 여부를,
// 그 외에는 (트러스트 파생 플래그를 합친) effectiveFlags 보유 여부를 검사한다.
const hasPrerequisite = (flag: string, effectiveFlags: string[], inventory: string[]): boolean =>
  flag.startsWith('item:') ? inventory.includes(flag.slice(5)) : effectiveFlags.includes(flag);

// 탐험 시 낮은 확률로만 일반 후보군에 합류하는 '숨은 발견' 이벤트 태그 및 등장 확률
const HIDDEN_EXPLORATION_TAG = '히든탐험';
const HIDDEN_EXPLORATION_CHANCE = 0.12;

// 선택지의 데이터 주도 학생 효과(studentEffects)를 일괄 적용한다(증감치 + clamp).
const applyStudentEffects = (students: Student[], choice: GameChoice): Student[] => {
  if (!choice.studentEffects || choice.studentEffects.length === 0) return students;
  return students.map(stud => {
    const eff = choice.studentEffects!.find(e => e.studentId === stud.id);
    if (!eff) return stud;
    const updated: Student = { ...stud };
    (Object.entries(eff.changes) as [keyof Student, number][]).forEach(([key, delta]) => {
      const cur = updated[key];
      if (typeof cur === 'number' && typeof delta === 'number') {
        (updated[key] as number) = clamp(cur + delta);
      }
    });
    return updated;
  });
};

// 초기 스탯 프리셋 생성 헬퍼
const getInitialStats = (difficulty: 'warm' | 'realistic' | 'hard', traits: string[]): Stats => {
  // 난이도별 기본 스탯
  let baseStats: Stats = {
    hp: 80,
    mental: 80,
    burnout: 10,
    expert: 30,
    studentTrust: 40,
    parentTrust: 40,
    colleagueRelation: 50,
    adminTrust: 40,
    adminPower: 30,
    familySatisfaction: 70,
    educationSoshin: 50,
    reputation: 30,
    careerPoint: 0,
    teachingSatisfaction: 40,  // 교육적 보람 (0 ~ 100) [NEW]
    colleagueSolidarity: 40,   // 동료 교직원 연대감 (0 ~ 100) [NEW]
    parentComplaint: 0,        // 학부모 민원 수치 (0 ~ 100) [NEW]
    
    // 5대 핵심 교사 역량 초기화
    workCapacity: 0,
    interpersonal: 0,
    familyRelation: 0,
    classManagement: 0,
    teachingResearch: 0
  };

  if (difficulty === 'warm') {
    baseStats.hp = 90;
    baseStats.mental = 90;
    baseStats.burnout = 0;
    baseStats.studentTrust = 50;
    baseStats.parentTrust = 50;
  } else if (difficulty === 'hard') {
    baseStats.hp = 60;
    baseStats.mental = 60;
    baseStats.burnout = 30;
    baseStats.studentTrust = 30;
    baseStats.parentTrust = 30;
    baseStats.colleagueRelation = 40;
  }

  // 특성 보너스 적용
  if (traits.includes('교사력왕')) {
    baseStats.hp += 15;
  }
  if (traits.includes('공감형 교사')) {
    baseStats.studentTrust += 15;
    baseStats.parentTrust += 10;
  }
  if (traits.includes('행정 해결사')) {
    baseStats.adminPower += 20;
  }
  if (traits.includes('수업 장인')) {
    baseStats.expert += 20;
  }
  if (traits.includes('원칙주의자')) {
    baseStats.educationSoshin += 20;
    baseStats.adminTrust += 10;
  }
  if (traits.includes('칼퇴 수호자')) {
    baseStats.familySatisfaction += 20;
  }
  // 신규 특성 4종 보너스 연동 적용 [한글 주석 포함]
  if (traits.includes('강철 멘탈')) {
    baseStats.mental += 15;
    baseStats.hp += 5;
  }
  if (traits.includes('인싸 교사')) {
    baseStats.colleagueRelation += 15;
    baseStats.colleagueSolidarity += 15;
  }
  if (traits.includes('학부모 카운셀러')) {
    baseStats.parentTrust += 15;
    baseStats.parentComplaint = Math.max(0, baseStats.parentComplaint - 10);
  }
  if (traits.includes('열혈 멘토')) {
    baseStats.studentTrust += 10;
    baseStats.teachingSatisfaction += 15;
  }

  // 5대 핵심 교사 역량 동기화 반영 후 반환
  return syncNewStats(baseStats);
};

// [NEW] 주말용 힐링 이벤트 생성 헬퍼 함수 (자녀 유무에 따른 동적 분기)
const getWeekendHealingEvent = (day: number, familyState?: string): GameEvent => {
  const isSaturday = day % 7 === 6;
  const dayName = isSaturday ? '토요일' : '일요일';
  const isParent = familyState === 'parent';

  if (isParent) {
    // 자녀가 있는 교사를 위한 주말 이벤트 5종
    const parentEvents = [
      {
        id: `weekend_parent_amusement_${day}`,
        title: `🏡 주말(${dayName}) 자녀와 놀이공원 나들이`,
        category: 'random',
        situation: 'weekend',
        weight: 1,
        tags: ['weekend'],
        narratorText: `즐거운 주말 아침이 밝았습니다! 오늘은 자녀와 함께 테마파크 놀이공원으로 나들이를 떠납니다. 다리가 아플 것 같지만 자녀의 활짝 웃는 얼굴이 눈에 아른거립니다. 오늘 어떻게 나들이를 즐기시겠습니까?`,
        choices: [
          {
            id: 'weekend_parent_choice_play_hard',
            text: '아이의 손을 잡고 타고 싶다는 놀이기구를 끝까지 다 같이 타며 온몸으로 놀아주기 (가족관계 +30, 멘탈 +20, 건강 -15, 번아웃 -10)',
            intent: '열정양육',
            immediateEffects: [
              { stat: 'familySatisfaction', value: 30 },
              { stat: 'mental', value: 20 },
              { stat: 'hp', value: -15 },
              { stat: 'burnout', value: -10 }
            ],
            resultText: '아이와 회전목마부터 롤러코스터까지 열정적으로 탔습니다. 온몸은 땀과 피로로 찌들었지만, 세상을 다 가진 듯 기뻐하는 자녀의 미소에 정신적 피로가 눈 녹듯 사라집니다.'
          },
          {
            id: 'weekend_parent_choice_play_calm',
            text: '아늑한 벤치에 앉아 아이스크림을 먹으며 자녀의 모습을 따뜻하게 지켜보기 (가족관계 +15, 멘탈 +15, 건강 +10, 번아웃 -15)',
            intent: '온화양육',
            immediateEffects: [
              { stat: 'familySatisfaction', value: 15 },
              { stat: 'mental', value: 15 },
              { stat: 'hp', value: 10 },
              { stat: 'burnout', value: -15 }
            ],
            resultText: '따스한 햇살 아래 자녀가 안전하게 뛰노는 모습을 바라보며 달콤한 휴식을 취했습니다. 가족과의 따뜻한 교감과 함께 육체적 피로도 회복되었습니다.'
          },
          {
            id: 'weekend_parent_choice_play_work',
            text: '아이가 놀이기구를 타는 동안 돗자리를 펴고 누워 노트북으로 교육청 업무 공문 검토하기 (전문성 +10, 가족관계 -10, 건강 +5, 번아웃 +5)',
            intent: '업무병행',
            immediateEffects: [
              { stat: 'expert', value: 10 },
              { stat: 'familySatisfaction', value: -10 },
              { stat: 'hp', value: 5 },
              { stat: 'burnout', value: 5 }
            ],
            resultText: '돗자리 위에서 한눈을 파는 사이 자녀가 토라졌습니다. 다음 주 공무 준비는 일부 마쳤지만, 자녀의 서운한 눈빛에 마음이 다소 무겁습니다.'
          }
        ],
        dayRange: [1, 30]
      },
      {
        id: `weekend_parent_study_${day}`,
        title: `🏡 주말(${dayName}) 자녀와 홈스쿨링 & 독서`,
        category: 'random',
        situation: 'weekend',
        weight: 1,
        tags: ['weekend'],
        narratorText: `주말 아침, 자녀의 학교 주간 학습 안내장을 봅니다. 밀린 단어 받아쓰기 연습과 숙제 지도가 필요한 시점입니다. 현직 초등교사로서의 전문성을 발휘할 때가 왔습니다. 어떻게 자녀를 지도하시겠습니까?`,
        choices: [
          {
            id: 'weekend_parent_choice_study_pro',
            text: '교직 전문 지식을 총동원하여 게임화 놀이 형식의 특급 독서 지도 홈스쿨링 열기 (가족관계 +20, 전문성 +10, 번아웃 -5)',
            intent: '전문교육',
            immediateEffects: [
              { stat: 'familySatisfaction', value: 20 },
              { stat: 'expert', value: 10 },
              { stat: 'burnout', value: -5 }
            ],
            resultText: '역시 현직 교사의 노하우는 다릅니다! 아이가 공부를 놀이처럼 느끼며 대만족합니다. 부모로서의 든든한 권위와 교사로서의 전문적 보람을 동시에 충족했습니다.'
          },
          {
            id: 'weekend_parent_choice_study_read',
            text: '자녀와 서재방에 나란히 앉아 각자 좋아하는 책을 조용히 읽는 시간 갖기 (가족관계 +15, 멘탈 +20, 건강 +10, 번아웃 -15)',
            intent: '조용한독서',
            immediateEffects: [
              { stat: 'familySatisfaction', value: 15 },
              { stat: 'mental', value: 20 },
              { stat: 'hp', value: 10 },
              { stat: 'burnout', value: -15 }
            ],
            resultText: '클래식 음악을 틀어놓고 자녀와 함께 차분하게 책장을 넘겼습니다. 집안에 흐르는 평화로운 지적 충만감 속에 쌓인 피로가 정화됩니다.'
          },
          {
            id: 'weekend_parent_choice_study_phone',
            text: '숙제 대충 동그라미 쳐주고 자녀에게 스마트폰 유튜브를 보여준 뒤 침대에 누워 자기 (가족관계 -5, 멘탈 +10, 건강 +15, 번아웃 -10)',
            intent: '방임휴식',
            immediateEffects: [
              { stat: 'familySatisfaction', value: -5 },
              { stat: 'mental', value: 10 },
              { stat: 'hp', value: 15 },
              { stat: 'burnout', value: -10 }
            ],
            resultText: '아이가 스마트폰 화면에 빠져있는 동안 침대에 누워 푹 잤습니다. 체력은 회복되었으나 자녀의 미디어 과몰입과 교육적 방임에 마음 한구석이 찌뿌둥합니다.'
          }
        ],
        dayRange: [1, 30]
      },
      {
        id: `weekend_parent_cooking_${day}`,
        title: `🏡 주말(${dayName}) 자녀와 홈베이킹 쿠킹 클래스`,
        category: 'random',
        situation: 'weekend',
        weight: 1,
        tags: ['weekend'],
        narratorText: `아이가 주방에서 밀가루 놀이와 과자 굽기를 하고 싶다고 졸라댑니다. 뒤처리와 설거지가 눈앞에 선하지만 자녀와의 소중한 식생활 교육 추억을 만들 기회입니다. 어떻게 대처하시겠습니까?`,
        choices: [
          {
            id: 'weekend_parent_choice_cook_hard',
            text: '밀가루와 반죽을 뒤집어쓰며 자녀와 정성껏 피자와 쿠키 굽기 (가족관계 +25, 멘탈 +20, 건강 -10, 번아웃 -10)',
            intent: '직접쿠킹',
            immediateEffects: [
              { stat: 'familySatisfaction', value: 25 },
              { stat: 'mental', value: 20 },
              { stat: 'hp', value: -10 },
              { stat: 'burnout', value: -10 }
            ],
            resultText: '주방이 초토화되었지만 고소한 빵 냄새 속에 자녀가 환하게 웃습니다. 싱크대 가득한 설거지는 버겁지만 최고의 오감 만족 힐링을 선사했습니다.'
          },
          {
            id: 'weekend_parent_choice_cook_easy',
            text: '전자레인지 밀키트나 간편 냉동 식품으로 가볍게 함께 조리하며 놀기 (가족관계 +15, 멘탈 +15, 건강 +5, 번아웃 -10)',
            intent: '간편조리',
            immediateEffects: [
              { stat: 'familySatisfaction', value: 15 },
              { stat: 'mental', value: 15 },
              { stat: 'hp', value: 5 },
              { stat: 'burnout', value: -10 }
            ],
            resultText: '초간단 밀키트로 아이와 아기자기하게 요리하고 깔끔하게 뒷정리했습니다. 큰 육체적 무리 없이 평화로운 주말 간식을 마쳤습니다.'
          },
          {
            id: 'weekend_parent_choice_cook_game',
            text: '음식은 배달 치킨으로 대체하고 남은 시간 동안 거실에서 보드게임 놀이하기 (가족관계 +20, 멘탈 +15, 건강 +10, 번아웃 -15)',
            intent: '배달보드게임',
            immediateEffects: [
              { stat: 'familySatisfaction', value: 20 },
              { stat: 'mental', value: 15 },
              { stat: 'hp', value: 10 },
              { stat: 'burnout', value: -15 }
            ],
            resultText: '요리의 번거로움 대신 편하게 치킨을 시켜 먹고 자녀와 부드러운 룰 보드게임을 즐겼습니다. 가족 모두가 편하고 행복한 주말 오후가 되었습니다.'
          }
        ],
        dayRange: [1, 30]
      },
      {
        id: `weekend_parent_sports_${day}`,
        title: `🏡 주말(${dayName}) 자녀 스포츠 클럽 응원`,
        category: 'random',
        situation: 'weekend',
        weight: 1,
        tags: ['weekend'],
        narratorText: `주말 아침, 자녀의 어린이 동네 축구 리그 경기(또는 태권도 학원 공개 심사)가 열립니다. 관중석에 부모님들이 가득 모여 있습니다. 어떻게 자녀를 응원하시겠습니까?`,
        choices: [
          {
            id: 'weekend_parent_choice_sport_hard',
            text: '관중석 맨 앞에서 목청껏 자녀의 이름을 외치며 열정적으로 격려하고 경기 후 고기 구워주기 (가족관계 +30, 멘탈 +20, 건강 -15, 번아웃 -10)',
            intent: '열혈응원',
            immediateEffects: [
              { stat: 'familySatisfaction', value: 30 },
              { stat: 'mental', value: 20 },
              { stat: 'hp', value: -15 },
              { stat: 'burnout', value: -10 }
            ],
            resultText: '목이 완전히 쉬어버렸고 다리도 아프지만, 자녀는 관중석의 부모를 보며 최고로 자신감 넘치는 골을 넣었습니다. 아이에게 평생 잊지 못할 자부심을 심어주었습니다.'
          },
          {
            id: 'weekend_parent_choice_sport_video',
            text: '뒤편 벤치에서 캠코더와 스마트폰으로 자녀의 경기 동작을 묵묵히 기록하며 격려하기 (가족관계 +20, 멘탈 +15, 건강 +5, 번아웃 -10)',
            intent: '기록응원',
            immediateEffects: [
              { stat: 'familySatisfaction', value: 20 },
              { stat: 'mental', value: 15 },
              { stat: 'hp', value: 5 },
              { stat: 'burnout', value: -10 }
            ],
            resultText: '차분하게 경기 영상을 녹화하고 하이라이트 편집본을 자녀에게 보여주었습니다. 자녀가 자신의 멋진 활약상을 되돌아보며 무척 신나합니다.'
          },
          {
            id: 'weekend_parent_choice_sport_chat',
            text: '경기장에서 한눈팔며 스마트폰으로 동료 학년 단톡방 및 밀린 교육 행정 연락 대응하기 (학부모민원 -10, 가족관계 -10, 번아웃 +5)',
            intent: '행정처리',
            immediateEffects: [
              { stat: 'parentComplaint', value: -10 },
              { stat: 'familySatisfaction', value: -10 },
              { stat: 'burnout', value: 5 }
            ],
            resultText: '밀린 학교 연락은 신속히 수습했으나, 아이가 "엄마/아빠는 나 축구하는 거 안 보고 계속 핸드폰만 했잖아"라며 입술을 비쭉 내밉니다. 아이의 기가 꺾였습니다.'
          }
        ],
        dayRange: [1, 30]
      },
      {
        id: `weekend_parent_camping_${day}`,
        title: `🏡 주말(${dayName}) 가족 자연 휴양 캠핑`,
        category: 'random',
        situation: 'weekend',
        weight: 1,
        tags: ['weekend'],
        narratorText: `도시의 요란함과 번잡한 학부모 카톡 알림을 완전히 잊기 위해 자연 속 숲속 캠핑장(또는 글램핑)으로 떠납니다. 완벽한 디지털 디톡스 데이입니다. 어떤 스타일로 캠핑을 즐기시겠습니까?`,
        choices: [
          {
            id: 'weekend_parent_choice_camp_tent',
            text: '불편하지만 직접 텐트를 치고 자녀와 모닥불을 피우며 마시멜로 구우며 대화하기 (가족관계 +30, 멘탈 +25, 건강 -10, 번아웃 -20)',
            intent: '야생캠핑',
            immediateEffects: [
              { stat: 'familySatisfaction', value: 30 },
              { stat: 'mental', value: 25 },
              { stat: 'hp', value: -10 },
              { stat: 'burnout', value: -20 }
            ],
            resultText: '텐트를 치느라 진땀을 뺐지만 모닥불 앞에서 나눈 진솔한 대화는 자녀와의 거리를 좁혀주었습니다. 자연 속 타오르는 불꽃 아래 완벽히 번아웃을 떨쳐냅니다.'
          },
          {
            id: 'weekend_parent_choice_camp_glam',
            text: '쾌적한 글램핑이나 숲속 통나무 카라반을 대여해 편하고 안락하게 자연 힐링하기 (가족관계 +20, 멘탈 +20, 건강 +15, 번아웃 -20)',
            intent: '글램핑힐링',
            immediateEffects: [
              { stat: 'familySatisfaction', value: 20 },
              { stat: 'mental', value: 20 },
              { stat: 'hp', value: 15 },
              { stat: 'burnout', value: -20 }
            ],
            resultText: '몸이 무척 편안한 럭셔리 캠핑을 즐겼습니다. 쾌적한 잠자리 덕분에 육체 피로가 확실히 리셋되었으며 맑은 피톤치드를 한껏 머금었습니다.'
          },
          {
            id: 'weekend_parent_choice_camp_photo',
            text: '캠핑 숲 속을 돌아다니며 다음 주 과학 환경 교육 수업에 쓸 곤충 및 식물 사진 채집하기 (전문성 +10, 가족관계 +10, 번아웃 -5)',
            intent: '수업자료수집',
            immediateEffects: [
              { stat: 'expert', value: 10 },
              { stat: 'familySatisfaction', value: 10 },
              { stat: 'burnout', value: -5 }
            ],
            resultText: '자녀와 함께 채집통을 들고 숲을 걸으며 신기한 무당벌레와 풀잎을 수집해 멋진 교육 슬라이드 소스를 다량 건졌습니다. 자녀에게도 나름의 생태 탐구 추억이 되었습니다.'
          }
        ],
        dayRange: [1, 30]
      }
    ];

    // 날짜별로 균등하게 5종 자녀 이벤트를 분산 추첨
    const eventIndex = (day + 3) % parentEvents.length;
    return parentEvents[eventIndex] as GameEvent;
  }

  // 자녀가 없는 교사(독신/무자녀)를 위한 기존 주말 힐링 이벤트
  return {
    id: `weekend_healing_${day}`,
    title: `🏡 주말(${dayName}) 힐링 활동`,
    category: 'random',
    situation: 'weekend',
    weight: 1,
    tags: ['weekend'],
    narratorText: `즐거운 주말(${dayName}) 아침이 밝았습니다! 오늘은 학교 업무에서 벗어나 온전히 나를 위한 시간을 보낼 수 있습니다. 오늘 하루를 어떻게 보내시겠습니까?`,
    choices: [
      {
        id: 'weekend_choice_rest',
        text: '집에서 아무것도 하지 않고 푹 쉬며 수면 보충하기 (건강 +20, 멘탈 +20, 번아웃 -20)',
        intent: '휴식',
        immediateEffects: [
          { stat: 'hp', value: 20 },
          { stat: 'mental', value: 20 },
          { stat: 'burnout', value: -20 }
        ],
        resultText: '하루 종일 침대와 한 몸이 되어 밀린 잠을 청했습니다. 몸의 피로가 싹 가시고 정신이 맑아집니다.'
      },
      {
        id: 'weekend_choice_exercise',
        text: '가벼운 조깅이나 등산 등 야외 운동 즐기기 (건강 +15, 멘탈 +25, 번아웃 -15)',
        intent: '운동',
        immediateEffects: [
          { stat: 'hp', value: 15 },
          { stat: 'mental', value: 25 },
          { stat: 'burnout', value: -15 }
        ],
        resultText: '맑은 공기를 마시며 구슬땀을 흘렸습니다. 신선한 에너지가 솟구치고 멘탈이 상쾌해집니다.'
      },
      {
        id: 'weekend_choice_hobby',
        text: '친구를 만나거나 취미 및 문화생활 즐기기 (건강 +10, 멘탈 +30, 번아웃 -15)',
        intent: '취미',
        immediateEffects: [
          { stat: 'hp', value: 10 },
          { stat: 'mental', value: 30 },
          { stat: 'burnout', value: -15 }
        ],
        resultText: '평소 해보고 싶었던 문화생활과 취미에 몰두하며 스트레스를 해소했습니다. 큰 정신적 위안을 얻었습니다.'
      },
      {
        id: 'weekend_choice_work',
        text: '불안한 마음을 달래기 위해 다음 주 수업 자료 및 밀린 행정 업무 정리하기 (전문성 +12, 행정력 +12, 건강 -10, 번아웃 +10)',
        intent: '업무',
        immediateEffects: [
          { stat: 'expert', value: 12 },
          { stat: 'adminPower', value: 12 },
          { stat: 'hp', value: -10 },
          { stat: 'burnout', value: 10 }
        ],
        resultText: '결국 일거리를 붙잡았습니다. 다음 주 업무 준비는 철저해졌으나, 주말 휴식을 온전히 누리지 못해 피로가 누적됩니다.'
      }
    ],
    dayRange: [1, 30]
  };
};

// 기획된 마일스톤 자녀/주말 이벤트가 강제 배정되는 날짜 -> 접미사 매핑.
// day 20 대신 19일차를 쓰는 이유: 20일차(토요일, day % 7 === 6)는 저녁 페이즈가 없어
// 그 자리에 두면 이벤트가 영구히 발동하지 못한다.
const MILESTONE_DAYS: Record<number, string> = { 5: '01', 10: '02', 15: '03', 19: '04', 25: '05' };

// 특정 날짜 범위 및 조건에 맞는 이벤트 추첨 헬퍼
const getEventForTime = (
  day: number,
  time: TimeOfDay,
  hiddenFlags: string[],
  history: string[],
  stats: Stats,
  students: Student[],
  inventory: string[],
  familyState?: string
): GameEvent | null => {
  const effectiveFlags = [...hiddenFlags, ...getTrustDerivedFlags(students)];
  let category: GameEvent['category'][] = [];
  
  if (time === 'morning') {
    category = ['student', 'colleague', 'admin', 'random'];
  } else if (time === 'afternoon') {
    category = ['student', 'parent', 'colleague', 'admin', 'random'];
  } else if (time === 'evening') {
    category = ['parent', 'family', 'career', 'random'];
  } else {
    return null;
  }

  // 5, 10, 15, 19, 25일차 저녁(evening)에는 기획된 자녀/주말 이벤트를 강제로 반환 [NEW]
  // 주의: 20일차는 토요일(day % 7 === 6)이라 저녁 페이즈 자체가 없으므로(progressTime의 주말 스킵),
  // 4번째 마일스톤은 19일차(평일)로 당겨서 배정한다.
  if (time === 'evening' && MILESTONE_DAYS[day]) {
    const targetSuffix = MILESTONE_DAYS[day];
    const isParent = familyState === 'parent';
    const targetEventId = isParent ? `evt_child_event_${targetSuffix}` : `evt_single_weekend_${targetSuffix}`;
    const targetEvt = gameEvents.find(evt => evt.id === targetEventId);
    if (targetEvt) {
      return targetEvt;
    }
  }

  const matchesBase = (evt: GameEvent, applyHistory: boolean): boolean => {
    // 0. 히든 탐험 이벤트는 exploreLocation에서만 낮은 확률로 등장 (시간대 자동 추첨에서는 제외)
    if (evt.tags.includes(HIDDEN_EXPLORATION_TAG)) return false;
    // 0-1. [NEW · 장소 서사] location 전용 이벤트는 해당 장소 탐색으로만 등장 (저녁 자동추첨에서 제외)
    if (evt.location) return false;
    // 1. 카테고리 매칭
    if (!category.includes(evt.category)) return false;
    // 2. 날짜 범위 확인
    const [start, end] = evt.dayRange;
    if (day < start || day > end) return false;
    // 3. 중복 방지 (이미 실행된 이벤트 제외)
    if (applyHistory && history.includes(evt.id)) return false;
    // 4. 선결 요건 검사
    if (evt.prerequisites && evt.prerequisites.length > 0) {
      const hasAll = evt.prerequisites.every(flag => hasPrerequisite(flag, effectiveFlags, inventory));
      if (!hasAll) return false;
    }
    return true;
  };

  // 후보 산출. 중복 제거로 후보가 고갈되면(후반부 카테고리 소진) 히스토리 무시 폴백.
  let candidates = gameEvents.filter(evt => matchesBase(evt, true));
  if (candidates.length === 0) {
    candidates = gameEvents.filter(evt => matchesBase(evt, false));
  }
  if (candidates.length === 0) return null;

  // 채널 통일 목표 비율(위기 시 상향, 주차 램프)로 가중 랜덤 추출
  return pickBalancedEvent(candidates, stats, day);
};

// 초기화용 디폴트 업무 리스트 생성 헬퍼
const getInitialTasks = (): Task[] => [
  {
    id: 'task_01',
    title: '신학기 학급 교육과정 수립 보고서 제출',
    category: 'admin',
    urgency: 4,
    importance: 4,
    estimatedTime: 2,
    stressCost: 15,
    reputationReward: 10,
    deadlineDay: 5,
    canDelegate: false,
    canNegotiate: true,
    isCompleted: false
  },
  {
    id: 'task_02',
    title: '기초학력 진단평가 결과 분석 입력',
    category: 'teaching',
    urgency: 3,
    importance: 4,
    estimatedTime: 1,
    stressCost: 10,
    reputationReward: 8,
    deadlineDay: 8,
    canDelegate: true,
    canNegotiate: false,
    isCompleted: false
  },
  {
    id: 'task_03',
    title: '환경 정리 및 교실 게시판 꾸미기',
    category: 'event',
    urgency: 2,
    importance: 2,
    estimatedTime: 1,
    stressCost: 5,
    reputationReward: 5,
    deadlineDay: 12,
    canDelegate: true,
    canNegotiate: false,
    isCompleted: false
  }
];


export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // 초기 상태 정의
      gameStarted: false,
      day: 1,
      timeOfDay: 'morning',
      playerInfo: null,
      endingId: null,
      
      // RPG 고도화 상태 초기값
      currentLocation: null,
      currentNpcDialogue: null,
      npcDialogueSession: null,
      dailyNpcPlacement: {},
      messengerNotifications: [],
      activeMessengerEvent: null,
      phoneAndTextNotifications: [],
      activePhoneAndTextEvent: null,
      
      stats: {
        hp: 80,
        mental: 80,
        burnout: 0,
        expert: 0,
        studentTrust: 0,
        parentTrust: 0,
        colleagueRelation: 0,
        adminTrust: 0,
        adminPower: 0,
        familySatisfaction: 0,
        educationSoshin: 0,
        reputation: 0,
        careerPoint: 0,
        teachingSatisfaction: 0,
        colleagueSolidarity: 0,
        parentComplaint: 0,
        
        // 5대 핵심 교사 역량 스탯 초기값 [NEW]
        workCapacity: 0,
        interpersonal: 0,
        familyRelation: 0,
        classManagement: 0,
        teachingResearch: 0
      },
      students: [],
      parents: [],
      tasks: [],
      delayedEffects: [],
      hiddenFlags: [],
      completedNpcDialoguesToday: [],
      completedDialogueHistory: [],
      completedNpcEvents: {},
      completedParentEvents: [],
      completedColleaguePrivateEvents: [],
      completedPositiveEvents: [],
      inventory: [],
      discoveryLog: [],
      recentEventDays: {},
      dailyActionCounts: {},

      currentEvent: null,
      selectedChoice: null,
      eventResultText: null,
      dayEffectsTriggered: [],
      
      // [WO-10] 게임 시작 전 사전값 — startGame()에서 난이도별(7/9/15)로 즉시 덮어쓰지만,
      // realistic 기본값과 맞춰 어떤 난이도와도 불일치하는 값(5)으로 오해를 주지 않게 한다.
      actionPoints: 9,
      maxActionPoints: 9,
      
      recentLogs: [],
      recentValenceLog: [],
      toastMessage: null,
      bgmVolume: 3, // 기본 배경음 볼륨 단계 3 [NEW]
      burnout100Days: 0, // 기본 번아웃 지속 일수 0 [NEW]
      showStatHints: false, // 기본은 스탯 힌트 숨김 — 수치 최적화가 아닌 역할 판단을 유도(토글로 켤 수 있음) [NEW]
      diceRollState: null, // 초기 주사위 판정 상태는 null [NEW]

      toggleStatHints: () => set({ showStatHints: !get().showStatHints }), // 스탯 힌트 토글 액션 [NEW]
      clearDiceRollState: () => set({ diceRollState: null }), // 주사위 상태 초기화 액션 [NEW]

      // 알림 표출
      showToast: (msg: string) => set({ toastMessage: msg }),
      clearToast: () => set({ toastMessage: null }),

      // 1. 새로운 게임 시작
      startGame: (info: PlayerInfo) => {
        const initialStats = getInitialStats(info.difficulty, info.traits);
        
        // 난이도에 따른 교사력(TP) 한도 조절
        // warm(쉬움)=15, realistic(중간)=9, hard(어려움)=7
        let maxTP = 9; // 기본값 = 중간 난이도
        if (info.difficulty === 'warm') maxTP = 15;
        if (info.difficulty === 'hard') maxTP = 7;
        if (info.traits.includes('교사력왕')) maxTP += 2; // 특성 보너스: +2

        // Fisher-Yates 셔플 알고리즘으로 학생 풀 40명 셔플링
        const shuffledStudents = [...initialStudents];
        for (let i = shuffledStudents.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledStudents[i], shuffledStudents[j]] = [shuffledStudents[j], shuffledStudents[i]];
        }
        
        // 랜덤 5명 선택
        const selectedStudents = shuffledStudents.slice(0, 5);
        const selectedStudentIds = selectedStudents.map(s => s.id);
        
        // 매칭되는 학부모 선택
        const selectedParents = initialParents.filter(p => selectedStudentIds.includes(p.studentId));

        set({
          gameStarted: true,
          day: 1,
          timeOfDay: 'morning',
          playerInfo: info,
          endingId: null,
          currentLocation: null,
          currentNpcDialogue: null,
          npcDialogueSession: null,
          stats: initialStats,
          students: JSON.parse(JSON.stringify(selectedStudents)),
          parents: JSON.parse(JSON.stringify(selectedParents)),
          tasks: getInitialTasks(),
          delayedEffects: [],
          hiddenFlags: [],
          completedNpcDialoguesToday: [],
          completedDialogueHistory: [],
          completedNpcEvents: {},
          completedParentEvents: [],
          completedColleaguePrivateEvents: [],
          completedPositiveEvents: [],
          inventory: [],
          discoveryLog: [],
          recentEventDays: {},
          dailyActionCounts: {},
          phoneAndTextNotifications: [],
          activePhoneAndTextEvent: null,
          currentEvent: null, // 시작 직후 아침에는 지도를 보고 탐색하도록 null 설정
          selectedChoice: null,
          eventResultText: null,
          dayEffectsTriggered: [],
          actionPoints: maxTP,
          maxActionPoints: maxTP,
          recentLogs: ['새 학기 첫 출근을 시작했습니다. 30일 교사 서사가 막을 올립니다.'],
          recentValenceLog: []
        });

        // [NEW] 캐릭터 배치 셔플 및 메신저 생성
        get().shuffleNpcPlacements();
        get().generateMessengerNotifications();
        get().generatePhoneAndTextNotifications();
      },

      // 2. 게임 리셋
      resetGame: () => {
        set({
          gameStarted: false,
          day: 1,
          timeOfDay: 'morning',
          playerInfo: null,
          endingId: null,
          currentLocation: null,
          currentNpcDialogue: null,
          npcDialogueSession: null,
          currentEvent: null,
          selectedChoice: null,
          eventResultText: null,
          dayEffectsTriggered: [],
          completedNpcDialoguesToday: [],
          completedDialogueHistory: [],
          completedNpcEvents: {},
          completedParentEvents: [],
          completedColleaguePrivateEvents: [],
          completedPositiveEvents: [],
          inventory: [],
          discoveryLog: [],
          recentEventDays: {},
          dailyActionCounts: {},
          phoneAndTextNotifications: [],
          activePhoneAndTextEvent: null,
          recentLogs: [],
          recentValenceLog: []
        });
      },

      // 3. 선택지 선택
      selectChoice: (choice: GameChoice) => {
        const { stats, hiddenFlags, delayedEffects, day, recentLogs, students, recentValenceLog } = get();
        
        // 주사위 판정(성공률)이 있는 선택지인 경우
        if (choice.successRate !== undefined) {
          // 주사위 롤링 애니메이션 상태 돌입
          set({
            diceRollState: {
              rolling: true,
              value: null,
              success: null,
              targetChoiceId: choice.id
            },
            selectedChoice: choice,
            eventResultText: null // 판정이 끝날 때까지 결과 텍스트는 임시 은폐
          });

          // 1.2초간 주사위가 굴러가는 연출 시간 대기 후 최종 판정
          setTimeout(() => {
            const rollValue = Math.floor(Math.random() * 100) + 1; // 1 ~ 100
            const isSuccess = rollValue <= choice.successRate!;

            // 성공/실패 여부에 따른 효과 및 결과 텍스트 분기
            const appliedEffects = isSuccess ? choice.immediateEffects : (choice.failEffects || []);
            const appliedDelayed = isSuccess ? (choice.delayedEffects || []) : (choice.failDelayedEffects || []);
            const resultText = isSuccess ? (choice.successResultText || choice.resultText) : (choice.failResultText || '판정에 실패하여 아쉬운 결과가 초래되었습니다.');

            // 스탯 효과 반영
            const currentStats = get().stats; // 비동기 지연 시간 동안 변화했을 수 있는 최신 스탯 참조
            const newStats = { ...currentStats };
            appliedEffects.forEach((eff: StatEffect) => {
              newStats[eff.stat] = clamp(
                newStats[eff.stat] + eff.value, 
                0,
                100
              );
            });

            // 지연 효과 큐 처리
            const currentDelayed = get().delayedEffects;
            const newDelayedEffects = [...currentDelayed];
            appliedDelayed.forEach(delayed => {
              newDelayedEffects.push({
                ...delayed,
                // dayTrigger는 '발동될 절대 날짜(1~30)'. 과거로 예약되지 않도록 최소 내일(day+1)로 보정. [FIX]
                dayTrigger: clamp(delayed.dayTrigger, Math.min(day + 1, 30), 30)
              });
            });

            // 플래그 적재
            const currentFlags = get().hiddenFlags;
            const newFlags = [...currentFlags];
            if (choice.hiddenFlags) {
              choice.hiddenFlags.forEach(flag => {
                if (!newFlags.includes(flag)) {
                  newFlags.push(flag);
                }
              });
            }

            // 로그 기록 (주사위 판정 상세 수치 기록)
            const updatedLogs = [
              `[${day}일차] ${choice.intent} 판정 ${isSuccess ? '성공' : '실패'} (${rollValue}/${choice.successRate}%) -> ${choice.text}`,
              ...get().recentLogs.slice(0, 19)
            ];

            // 학생 수치 보정 (데이터 주도 studentEffects 일괄 적용)
            const updatedStudents = applyStudentEffects(get().students, choice);

            // 아이템 획득 (성공 시에만 grantsItem 지급, 중복 보유 방지)
            const currentInventory = get().inventory;
            const grantedItem = isSuccess && choice.grantsItem && !currentInventory.includes(choice.grantsItem) ? choice.grantsItem : null;
            const newInventory = grantedItem ? [...currentInventory, grantedItem] : currentInventory;
            const itemInfo = grantedItem ? getItemById(grantedItem) : undefined;
            const newDiscoveryLog = itemInfo
              ? [...get().discoveryLog, { id: `disc_item_${grantedItem}`, label: `소지품 획득: ${itemInfo.name}`, day }]
              : get().discoveryLog;

            set({
              stats: syncNewStats(newStats),
              delayedEffects: newDelayedEffects,
              hiddenFlags: newFlags,
              eventResultText: resultText,
              recentLogs: updatedLogs,
              students: updatedStudents,
              inventory: newInventory,
              discoveryLog: newDiscoveryLog,
              recentValenceLog: pushValence(get().recentValenceLog, inferValence(appliedEffects)),
              diceRollState: {
                rolling: false,
                value: rollValue,
                success: isSuccess,
                targetChoiceId: choice.id
              }
            });

            get().checkFailureConditions();
          }, 1200);

        } else {
          // 주사위 판정이 없는 일반 선택지 처리
          const newStats = { ...stats };
          choice.immediateEffects.forEach((eff: StatEffect) => {
            newStats[eff.stat] = clamp(
              newStats[eff.stat] + eff.value, 
              0,
              100
            );
          });

          const newDelayedEffects = [...delayedEffects];
          if (choice.delayedEffects && choice.delayedEffects.length > 0) {
            choice.delayedEffects.forEach(delayed => {
              newDelayedEffects.push({
                ...delayed,
                // dayTrigger는 '발동될 절대 날짜(1~30)'. 과거로 예약되지 않도록 최소 내일(day+1)로 보정. [FIX]
                dayTrigger: clamp(delayed.dayTrigger, Math.min(day + 1, 30), 30)
              });
            });
          }

          const newFlags = [...hiddenFlags];
          if (choice.hiddenFlags) {
            choice.hiddenFlags.forEach(flag => {
              if (!newFlags.includes(flag)) {
                newFlags.push(flag);
              }
            });
          }

          const updatedLogs = [
            `[${day}일차] ${choice.intent} 선택 -> ${choice.text}`,
            ...recentLogs.slice(0, 19)
          ];

          // 데이터 주도 studentEffects 일괄 적용
          const updatedStudents = applyStudentEffects(students, choice);

          // 아이템 획득 (grantsItem 지급, 중복 보유 방지)
          const currentInventory = get().inventory;
          const grantedItem = choice.grantsItem && !currentInventory.includes(choice.grantsItem) ? choice.grantsItem : null;
          const newInventory = grantedItem ? [...currentInventory, grantedItem] : currentInventory;
          const itemInfo = grantedItem ? getItemById(grantedItem) : undefined;
          const newDiscoveryLog = itemInfo
            ? [...get().discoveryLog, { id: `disc_item_${grantedItem}`, label: `소지품 획득: ${itemInfo.name}`, day }]
            : get().discoveryLog;

          set({
            stats: syncNewStats(newStats),
            delayedEffects: newDelayedEffects,
            hiddenFlags: newFlags,
            selectedChoice: choice,
            eventResultText: choice.resultText,
            recentLogs: updatedLogs,
            students: updatedStudents,
            inventory: newInventory,
            discoveryLog: newDiscoveryLog,
            recentValenceLog: pushValence(recentValenceLog, inferValence(choice.immediateEffects)),
            diceRollState: null // 일반 선택지는 주사위 상태 무시
          });
        }
      },

      // 4. 시간 흐름 전진
      progressTime: () => {
        const {
          day,
          timeOfDay,
          recentLogs,
          hiddenFlags,
          maxActionPoints,
          playerInfo,
          stats,
          students,
          inventory
        } = get();

        if (timeOfDay === 'morning') {
          // 아침 -> 오후 (지도를 통해 다시 이동하도록 location을 null로 초기화)
          // 주말(토, 일)인 경우 바로 정산(summary)으로 건너뜀
          const isWeekend = day % 7 === 6 || day % 7 === 0;
          if (isWeekend) {
            set({
              timeOfDay: 'summary',
              currentLocation: null,
              currentEvent: null,
              selectedChoice: null,
              eventResultText: null,
              currentNpcDialogue: null
            });
            get().triggerDelayedEffectsForToday();
          } else {
            set({
              timeOfDay: 'afternoon',
              currentLocation: null,
              currentEvent: null,
              selectedChoice: null,
              eventResultText: null,
              currentNpcDialogue: null
            });
          }
        } else if (timeOfDay === 'afternoon') {
          // 오후 -> 저녁 (저녁은 집/개인 활동이므로 기존 방식대로 저녁 이벤트를 자동 추점)
          const nextEvent = getEventForTime(day, 'evening', hiddenFlags, recentLogs, stats, students, inventory, playerInfo?.familyState);
          set({
            timeOfDay: 'evening',
            currentLocation: null,
            currentEvent: nextEvent,
            selectedChoice: null,
            eventResultText: null,
            currentNpcDialogue: null
          });
        } else if (timeOfDay === 'evening') {
          // 저녁 -> 정산 화면
          set({
            timeOfDay: 'summary',
            currentLocation: null,
            currentEvent: null,
            selectedChoice: null,
            eventResultText: null,
            currentNpcDialogue: null
          });
          // 오늘자 정산 및 지연 효과 일제 작동
          get().triggerDelayedEffectsForToday();
        } else if (timeOfDay === 'summary') {
          // 정산 완료 후 -> 다음 날 아침으로 전이
          const nextDay = day + 1;
          
          if (nextDay > 30) {
            // 30일 도달 시 게임 종료 및 엔딩 체크
            get().checkEndingConditions();
          } else {
            // 미해결 업무 지연 패널티 정산
            const { tasks, messengerNotifications, phoneAndTextNotifications } = get();
            const overdueTasks = tasks.filter(t => !t.isCompleted && t.deadlineDay < nextDay);
            const penaltyStats = { ...get().stats };
            const penaltyMessages: string[] = [];

            // [WO-13] 칼퇴(일반 퇴근) 시 힐링 보너스 (평일 + 당일 미결 업무 0건일 때만 적용)
            // 과거에는 조건 없이 매일 지급되어 회복 삼중 안전망의 한 축이 되었다 — 업무를 다 처리한 날에만
            // 주는 보상으로 바꿔, "일을 미뤄도 어차피 매일 회복된다"는 감각을 없앤다.
            const isWeekend = day % 7 === 6 || day % 7 === 0;
            const hasIncompleteTasks = tasks.some(t => !t.isCompleted);
            if (!isWeekend && !hasIncompleteTasks) {
              penaltyStats.hp = clamp(penaltyStats.hp + 5);
              penaltyStats.mental = clamp(penaltyStats.mental + 5);
              penaltyStats.burnout = clamp(penaltyStats.burnout - 5);
              penaltyMessages.push(`[정시 퇴근 보너스] 오늘 업무를 모두 마치고 정시 퇴근하여 건강 +5, 멘탈 +5 회복 및 번아웃 -5 감소했습니다.`);
            }

            // [WO-13] 기본 일일 소모 — 회복 수단이 아무리 좋아도 교직은 가만히 있어도 닳는다.
            // 난이도별 차등: warm(쉬움) 없음, realistic(보통) hp-3/번아웃+2, hard(어려움) hp-5/번아웃+3.
            if (!isWeekend) {
              const attrition = playerInfo?.difficulty === 'warm'
                ? { hp: 0, burnout: 0 }
                : playerInfo?.difficulty === 'hard'
                ? { hp: 5, burnout: 3 }
                : { hp: 3, burnout: 2 };
              if (attrition.hp > 0 || attrition.burnout > 0) {
                penaltyStats.hp = clamp(penaltyStats.hp - attrition.hp);
                penaltyStats.burnout = clamp(penaltyStats.burnout + attrition.burnout);
                penaltyMessages.push(`[일일 소모] 하루 종일 이어진 수업과 잡무로 건강 -${attrition.hp}, 번아웃 +${attrition.burnout} 누적되었습니다.`);
              }
            }

            // 1) 미결 업무 방치 패널티 정산 [WO-06]
            // 과거에는 연체 업무 1건당 매일 밤 전액 패널티가 무한 반복되어(2건 방치 시 하룻밤 행정력 -40)
            // 회복 불가능한 나선이 됐다. 연체 1일째만 전액, 2일째부터는 25%로 감쇠시키고,
            // 3일째 밤에는 업무를 강제 종결(자동 소멸)해 1회성 청산 패널티로 끝낸다.
            const autoResolvedTaskIds: string[] = [];
            overdueTasks.forEach(t => {
              const daysOverdue = nextDay - t.deadlineDay;
              if (daysOverdue >= 3) {
                penaltyStats.adminTrust = clamp(penaltyStats.adminTrust - 10);
                penaltyStats.reputation = clamp(penaltyStats.reputation - 5);
                autoResolvedTaskIds.push(t.id);
                penaltyMessages.push(
                  `[업무 강제 종결] "${t.title}" 업무를 3일째 방치해 교감선생님이 대신 처리했습니다. 관리자신뢰 -10, 평판 -5 (사유: 반복된 업무 방치로 인한 신뢰 실추)`
                );
              } else {
                const scale = daysOverdue >= 2 ? 0.25 : 1;
                const dAdminPower = Math.round(20 * scale);
                const dExpert = Math.round(15 * scale);
                const dAdminTrust = Math.round(10 * scale);
                const dReputation = Math.round(8 * scale);
                const dBurnout = Math.round(10 * scale);
                penaltyStats.adminPower = clamp(penaltyStats.adminPower - dAdminPower);
                penaltyStats.expert = clamp(penaltyStats.expert - dExpert);
                penaltyStats.adminTrust = clamp(penaltyStats.adminTrust - dAdminTrust);
                penaltyStats.reputation = clamp(penaltyStats.reputation - dReputation);
                penaltyStats.burnout = clamp(penaltyStats.burnout + dBurnout);

                penaltyMessages.push(
                  `[업무 미결 패널티] "${t.title}" 업무 마감 기한 초과 방치로 인해 행정역량 -${dAdminPower}, 전문성 -${dExpert}, 관리자신뢰 -${dAdminTrust} 하락 (사유: 주요 공무 연체에 따른 실무 태만)`
                );
              }
            });

            // 2) 미확인 학교 메신저 방치 패널티 정산
            const unreadMessengers = messengerNotifications.filter(m => !m.isRead);
            unreadMessengers.forEach(m => {
              // 메신저 요청 무시 -> 동료관계 -10, 행정역량 -10, 평판 -5 차감 -> 이에 따라 인간관계 및 업무능력 하락 연동
              penaltyStats.colleagueRelation = clamp(penaltyStats.colleagueRelation - 10);
              penaltyStats.adminPower = clamp(penaltyStats.adminPower - 10);
              penaltyStats.reputation = clamp(penaltyStats.reputation - 5);

              penaltyMessages.push(
                `[메신저 방치 패널티] "${m.sender}"의 메신저 요청 무시로 인해 동료관계 -10, 행정역량 -10, 평판 -5 하락 (사유: 교내 공적 소통 방치 및 협조 거부)`
              );
            });

            // 3) 미확인 스마트폰 연락 방치 패널티 정산
            const unreadPhones = phoneAndTextNotifications.filter(p => !p.isRead);
            unreadPhones.forEach(p => {
              if (p.id.startsWith('phone_positive_')) {
                // [WO-07] 감사·격려 전화는 힐링 콘텐츠인데, 안 읽었다고 벌점을 주면 힐링이 빚으로
                // 둔갑한다. 패널티 없이 당일 만료(읽음 처리)만 시켜 다음 날로 넘어가지 않게 한다.
                // (실제 만료 처리는 아래 최종 set()에서 phoneAndTextNotifications를 갱신한다.)
              } else if (p.id.startsWith('phone_parent_')) {
                // 학부모 민원 무시 -> 학부모신뢰 -10, 학생신뢰 -5 차감, 민원수치 +12 상승 -> 이에 따라 인간관계, 학급운영 하락 연동
                penaltyStats.parentTrust = clamp(penaltyStats.parentTrust - 10);
                penaltyStats.studentTrust = clamp(penaltyStats.studentTrust - 5);
                penaltyStats.parentComplaint = clamp(penaltyStats.parentComplaint + 12);

                penaltyMessages.push(
                  `[민원 방치 패널티] 학부모 전화 민원 무시로 학부모 민원 수치 +12, 학부모신뢰 -10, 학생신뢰 -5 하락 (사유: 학부모와의 소통 거부로 인한 불만 가중)`
                );
              } else if (p.id.startsWith('phone_colleague_')) {
                // 교직원 사적 요청 무시 -> 동료관계 -10, 평판 -5 차감
                penaltyStats.colleagueRelation = clamp(penaltyStats.colleagueRelation - 10);
                penaltyStats.reputation = clamp(penaltyStats.reputation - 5);

                penaltyMessages.push(
                  `[교직원 요청 방치 패널티] 동료 교직원의 사적인 요청 연락 무시로 인해 동료관계 -10, 평판 -5 하락 (사유: 교직원 친목 및 협조 거부)`
                );
              }
            });

            // 매일 아침 교사력(TP) 갱신 (체력이 바닥이거나 번아웃이 극심하면 TP 차감)
            let dailyTP = maxActionPoints;
            if (penaltyStats.hp < 30) dailyTP -= 1;
            if (penaltyStats.burnout > 80) dailyTP -= 1;
            dailyTP = Math.max(1, dailyTP);

            // 5대 핵심 스탯 동기화 및 즉시 게임오버 검사
            const syncedStats = syncNewStats(penaltyStats);

            // 번아웃 100% 임계 연속 일수 정산 [NEW]
            let nextBurnout100Days = get().burnout100Days;
            if (syncedStats.burnout >= 100) {
              nextBurnout100Days += 1;
            } else {
              nextBurnout100Days = 0;
            }

            // 업무 기한 리셋/업데이트 (일정 날짜에 새 업무 할당 + 주차별 램프 확률로 랜덤 행정 업무 추가) [WO-06][WO-14]
            // 3일째 자동 종결된 업무는 완료 처리해 다음 날부터 연체 목록에서 빠지게 한다.
            let updatedTasks = tasks.map(t => autoResolvedTaskIds.includes(t.id) ? { ...t, isCompleted: true } : t);

            // [WO-14] 주차별 압박 램프: 1주 38% -> 5주 70%로 업무 스폰 확률이 오르고,
            // 4주차부터는 한 번에 최대 3개까지 몰아친다.
            const spawnWeek = getWeekNumber(nextDay);
            const taskSpawnChance = 0.30 + spawnWeek * 0.08;
            const taskSpawnMax = spawnWeek >= 4 ? 3 : 2;
            if (Math.random() < taskSpawnChance) {
              const taskCount = Math.floor(Math.random() * taskSpawnMax) + 1;
              for (let c = 0; c < taskCount; c++) {
                const randomTemplate = pickBalancedTaskTemplate(syncedStats, nextDay);
                // 중복 가드
                if (!updatedTasks.some(t => !t.isCompleted && t.title === randomTemplate.title)) {
                  updatedTasks.push({
                    id: `task_dynamic_${nextDay}_${Math.random().toString(36).substring(2, 7)}`,
                    title: randomTemplate.title,
                    category: randomTemplate.category,
                    urgency: randomTemplate.urgency,
                    importance: randomTemplate.importance,
                    estimatedTime: randomTemplate.estimatedTime,
                    stressCost: randomTemplate.stressCost,
                    reputationReward: randomTemplate.reputationReward,
                    deadlineDay: nextDay + randomTemplate.deadlineLimit,
                    canDelegate: randomTemplate.canDelegate,
                    canNegotiate: randomTemplate.canNegotiate !== undefined ? randomTemplate.canNegotiate : true,
                    isCompleted: false
                  });
                }
              }
            }

            if (nextDay === 10) {
              updatedTasks.push({
                id: 'task_04',
                title: '학급 교육공개수업 세부 지도안 설계',
                category: 'teaching',
                urgency: 4,
                importance: 5,
                estimatedTime: 2,
                stressCost: 20,
                reputationReward: 15,
                deadlineDay: 16,
                canDelegate: false,
                canNegotiate: true,
                isCompleted: false
              });
            }
            if (nextDay === 20) {
              updatedTasks.push({
                id: 'task_05',
                title: '전교 학교폭력 예방 교육 주간 행사 보고',
                category: 'event',
                urgency: 5,
                importance: 3,
                estimatedTime: 2,
                stressCost: 15,
                reputationReward: 12,
                deadlineDay: 25,
                canDelegate: true,
                canNegotiate: false,
                isCompleted: false
              });
            }

            // 다음 날이 주말(토, 일)인지 확인하여 주말 힐링 이벤트 설정
            const isNextDayWeekend = nextDay % 7 === 6 || nextDay % 7 === 0;
            const nextEvent = isNextDayWeekend ? getWeekendHealingEvent(nextDay, playerInfo?.familyState) : null;

            // [WO-14] 마지막 주(26~30일)에는 학기말 정산이 다가온다는 것을 서사적으로 알려 압박을 체감시킨다.
            if (nextDay >= 26) {
              penaltyMessages.push(`[학기말 정산 D-${30 - nextDay}] 한 학기의 끝이 다가오고 있습니다. 남은 기록과 평가가 마무리될 시간입니다.`);
            }

            set({
              day: nextDay,
              timeOfDay: 'morning',
              stats: syncedStats,
              actionPoints: dailyTP,
              burnout100Days: nextBurnout100Days,
              currentLocation: null,
              currentNpcDialogue: null,
              currentEvent: nextEvent, // [MODIFIED] 주말인 경우 힐링 이벤트 강제 세팅
              selectedChoice: null,
              eventResultText: null,
              dayEffectsTriggered: penaltyMessages, // 아침 브리핑용 패널티 메시지 저장
              completedNpcDialoguesToday: [],
              dailyActionCounts: {}, // [WO-12] 장소 행동 반복 체감 카운트를 매일 아침 리셋
              tasks: updatedTasks,
              activePhoneAndTextEvent: null,
              // [WO-07] 벌점 없이 당일 만료 — 미확인 감사 전화를 읽음 처리해 다음 날로 이월되지 않게 한다.
              phoneAndTextNotifications: phoneAndTextNotifications.map(p =>
                p.id.startsWith('phone_positive_') && !p.isRead ? { ...p, isRead: true } : p
              )
            });

            // [NEW] 캐릭터 배치 셔플 및 메신저 생성
            get().shuffleNpcPlacements();
            get().generateMessengerNotifications();
            get().generatePhoneAndTextNotifications();
            get().checkFailureConditions(); // 다음 날 아침 실패 조건 전수 검사 [NEW]
          }
        }
      },

      // 5. 수동 행정 업무 완료
      completeTask: (taskId: string) => {
        const { tasks, actionPoints, stats } = get();
        const target = tasks.find(t => t.id === taskId);
        
        if (!target || target.isCompleted) return;
        if (actionPoints < target.estimatedTime) {
          get().showToast('교사력(TP)이 부족하여 업무를 완료할 수 없습니다.');
          return;
        }

        const newStats = { ...stats };
        // 업무 완료 보상 및 패널티 스탯 반영
        newStats.adminPower = clamp(newStats.adminPower + 5);
        newStats.adminTrust = clamp(newStats.adminTrust + target.reputationReward);
        newStats.burnout = clamp(newStats.burnout + target.stressCost);

        // [NEW] 모든 업무가 똑같이 소모적이지 않도록 분기:
        // - 부담이 낮은 업무(stressCost<=6)는 체력 소모를 완화한다.
        // - 수업/교육(teaching) 업무는 교육적 보람과 멘탈 회복을 제공한다.
        const isLight = target.stressCost <= 6;
        newStats.hp = clamp(newStats.hp - (isLight ? 4 : 10));
        const isRewarding = target.category === 'teaching';
        if (isRewarding) {
          newStats.teachingSatisfaction = clamp(newStats.teachingSatisfaction + 8);
          newStats.mental = clamp(newStats.mental + 5);
        }

        set({
          tasks: tasks.map(t => t.id === taskId ? { ...t, isCompleted: true } : t),
          actionPoints: actionPoints - target.estimatedTime,
          stats: syncNewStats(newStats),
          recentValenceLog: pushValence(get().recentValenceLog, isRewarding || isLight ? 'positive' : 'negative')
        });

        get().showToast(
          isRewarding
            ? `[업무완료] "${target.title}"을 마치며 가르치는 보람을 느꼈습니다!`
            : `[업무완료] "${target.title}"을 완수하여 평판이 올랐습니다!`
        );
        get().checkFailureConditions();
      },

      // 5-2. 선택지 기반 행정 업무 완료 (다이나믹 스탯 반영)
      completeTaskWithChoice: (taskId: string, choiceEffects: { stat: string; value: number }[], resultText: string) => {
        const { tasks, actionPoints, stats } = get();
        const target = tasks.find(t => t.id === taskId);

        if (!target || target.isCompleted) return;
        if (actionPoints < target.estimatedTime) {
          get().showToast('교사력(TP)이 부족하여 업무를 완료할 수 없습니다.');
          return;
        }

        const newStats = { ...stats };
        // 선택지별 커스텀 스탯 효과 적용
        choiceEffects.forEach((eff) => {
          const key = eff.stat as keyof Stats;
          if (key in newStats) {
            newStats[key] = clamp((newStats[key] as number) + eff.value);
          }
        });
        // 기본 행정력 보상은 항상 적용
        newStats.adminPower = clamp(newStats.adminPower + 3);

        set({
          tasks: tasks.map(t => t.id === taskId ? { ...t, isCompleted: true } : t),
          actionPoints: actionPoints - target.estimatedTime,
          stats: syncNewStats(newStats)
        });

        get().showToast(`[결재완료] "${target.title}" — ${resultText}`);
        get().checkFailureConditions();
      },

      // 6. 업무 동료에게 위임
      delegateTask: (taskId: string) => {
        const { tasks, stats, actionPoints } = get();
        const target = tasks.find(t => t.id === taskId);

        if (!target || target.isCompleted || !target.canDelegate) return;
        if (stats.colleagueRelation < 60) {
          get().showToast('동료 교사와의 관계 점수(60 이상 필요)가 낮아 업무 협조를 위임할 수 없습니다.');
          return;
        }
        // [WO-05] 위임도 부탁하러 다니는 실제 시간이 든다 — completeTask와 동일하게 TP를 소모시켜
        // "위임이 완료보다 항상 공짜로 저렴한" 경제 구멍을 막는다.
        if (actionPoints < 1) {
          get().showToast('교사력(TP)이 부족하여 업무를 위임할 수 없습니다.');
          return;
        }

        const newStats = { ...stats };
        newStats.colleagueRelation = clamp(newStats.colleagueRelation - 15); // 관계 점수 일부 소모
        newStats.burnout = clamp(newStats.burnout + 2); // 대신 스트레스는 거의 없음

        set({
          tasks: tasks.map(t => t.id === taskId ? { ...t, isCompleted: true } : t),
          actionPoints: actionPoints - 1,
          stats: syncNewStats(newStats)
        });

        get().showToast(`[업무위임] 동료에게 도움을 요청해 "${target.title}" 업무를 처리했습니다.`);
        get().checkFailureConditions();
      },

      // 7. 지연 효과 발동 (summary 시점에 호출)
      triggerDelayedEffectsForToday: () => {
        const { day, delayedEffects, stats } = get();
        
        const todayEffects = delayedEffects.filter(eff => eff.dayTrigger === day);
        if (todayEffects.length === 0) return;

        const newStats = { ...stats };
        const effectMessages: string[] = [];

        todayEffects.forEach(delayed => {
          delayed.effects.forEach((eff: StatEffect) => {
            newStats[eff.stat] = clamp(
              newStats[eff.stat] + eff.value, 
              0,
              100
            );
          });
          effectMessages.push(delayed.message);
        });

        // 큐에서 처리된 이벤트 소거
        const remainingEffects = delayedEffects.filter(eff => eff.dayTrigger !== day);

        set({
          stats: syncNewStats(newStats),
          delayedEffects: remainingEffects,
          dayEffectsTriggered: effectMessages
        });
        get().checkFailureConditions();
      },

      // 8. 30일차 최종 엔딩 조건 계산
      checkEndingConditions: () => {
        const currentEnding = get().endingId;
        // 이미 게임오버나 다른 엔딩 상태가 세팅되어 있다면 즉시 반환하여 중복 해금을 차단합니다. [NEW]
        if (currentEnding) return;

        const { stats, hiddenFlags, inventory } = get();
        let finalEnding = 'ending_general'; // 기본 디폴트 평교사 엔딩

        // [NEW · 어드벤처] 0. 비밀 엔딩 '참된 스승' — 한 학기 동안 아이들이 건넨 흔적(서사 단서 아이템)을
        // 충분히 모으고(5종 중 4종 이상) 신뢰까지 쌓아야만 해금되는 최상위 히든 엔딩.
        const storyItems = ['jihun_letter', 'class_diary', 'class_council_charter', 'student_sketchbook', 'mystery_note'];
        const collectedStoryItems = storyItems.filter(id => inventory.includes(id)).length;
        if (collectedStoryItems >= 4 && stats.studentTrust >= 70) {
          set({ endingId: 'ending_true_mentor' });
          return;
        }

        // 1. 전설의 멘토 엔딩 (학생 신뢰도 극상, 보람 극상)
        if (stats.studentTrust >= 90 && stats.teachingSatisfaction >= 80) {
          finalEnding = 'ending_legendary_mentor';
        }
        // 2. 교사 권익 수호 노조 의장 엔딩 (교육 소신 극상, 연대감 극상)
        else if (stats.educationSoshin >= 85 && stats.colleagueSolidarity >= 75) {
          finalEnding = 'ending_labor_union_leader';
        }
        // [신규] 2-1. 학교 혁신 장학관 엔딩 (업무능력 우수, 수업연구 우수)
        else if (stats.workCapacity >= 80 && stats.teachingResearch >= 80) {
          finalEnding = 'ending_innovation_director';
        }
        // [신규] 2-2. 학급 경영의 달인 엔딩 (학급운영 극상)
        else if (stats.classManagement >= 85) {
          finalEnding = 'ending_class_master';
        }
        // [신규] 2-3. 수업 연구의 대가 엔딩 (수업연구 극상)
        else if (stats.teachingResearch >= 85) {
          finalEnding = 'ending_teaching_scholar';
        }
        // [신규] 2-4. 가정 평화 수호자 엔딩 (가족관계 극상, 업무능력 낮음)
        else if (stats.familyRelation >= 85 && stats.workCapacity < 60) {
          finalEnding = 'ending_family_peacekeeper';
        }
        // [신규] 2-5. 독고다이 마이웨이 교사 엔딩 (교육소신 높음, 인간관계 낮음)
        else if (stats.educationSoshin >= 80 && stats.interpersonal < 40) {
          finalEnding = 'ending_myway';
        }
        // 3. 장학사 엔딩 (커리어 포인트, 행정력, 소신 우수)
        // [WO-04] careerPoint 지급 총량 대비 40은 과도해 사실상 도달 불가 → 30으로 완화
        else if (
          stats.careerPoint >= 30 &&
          stats.adminPower >= 70 &&
          stats.educationSoshin >= 60
        ) {
          finalEnding = 'ending_supervisor';
        }
        // 4. 학교 관리자 엔딩 (관리자 신뢰도, 평판, 관계 우수)
        else if (
          stats.adminTrust >= 75 &&
          stats.reputation >= 70 &&
          stats.colleagueRelation >= 60
        ) {
          finalEnding = 'ending_administrator';
        }
        // 5. 베스트셀러 작가 교사 엔딩 (수업 전문성, 보람, 평판 우수)
        else if (
          stats.expert >= 80 &&
          stats.teachingSatisfaction >= 70 &&
          stats.reputation >= 70
        ) {
          finalEnding = 'ending_best_selling_author';
        }
        // 6. 원로 교육 전문가 엔딩 (학생 신뢰도, 전문성, 소신 우수)
        else if (
          stats.studentTrust >= 80 &&
          stats.expert >= 75 &&
          stats.educationSoshin >= 70
        ) {
          finalEnding = 'ending_expert';
        }
        // 7. 에듀테크 선도교사 혁신가 엔딩 (혁신 성향 및 전문성, 평판)
        else if (
          hiddenFlags.includes('innovation_tendency') &&
          stats.expert >= 70 &&
          stats.reputation >= 60
        ) {
          finalEnding = 'ending_innovator';
        }
        // 8. 공문서 행정의 신 엔딩 (행정역량 극상, 연대감 우수)
        else if (stats.adminPower >= 90 && stats.colleagueSolidarity >= 80) {
          finalEnding = 'ending_office_master';
        }
        // 9. 학교 갈등 중재 전문가 평화 조정자 엔딩 (학부모/학생 신뢰, 연대감)
        else if (
          stats.parentTrust >= 80 &&
          stats.studentTrust >= 80 &&
          stats.colleagueSolidarity >= 70
        ) {
          finalEnding = 'ending_peacekeeper';
        }
        // 10. 워라밸 종결자 가정 수호자 엔딩 (가정 만족 극상, 연대감, 체력 안정)
        else if (
          stats.familySatisfaction >= 90 &&
          stats.colleagueSolidarity >= 60 &&
          stats.hp >= 70
        ) {
          finalEnding = 'ending_family_first';
        }
        // 11. 인싸교사 동료애 스타 엔딩 (교직원 연대감 극상, 관계 우수)
        else if (stats.colleagueSolidarity >= 90 && stats.colleagueRelation >= 80) {
          finalEnding = 'ending_coop_star';
        }
        // 12. 에듀테크 창업가 대탈출 엔딩 (전문성, 번아웃, 소신 높음)
        else if (
          stats.expert >= 70 &&
          stats.burnout >= 70 &&
          stats.educationSoshin >= 75
        ) {
          finalEnding = 'ending_great_escapist';
        }
        // 13. 만성 번아웃 병가 엔딩 (번아웃 극상 또는 건강 악화)
        else if (stats.burnout >= 90 || stats.hp <= 15) {
          finalEnding = 'ending_burnout';
        }
        // 14. 무너진 가정 엔딩 (가정 만족도 극소)
        else if (stats.familySatisfaction <= 30) {
          finalEnding = 'ending_family_rupture';
        }
        // 15. 교문 밖의 예술가 취미 교사 엔딩 (가정 만족, 멘탈 양호, 수업 평범)
        else if (
          stats.familySatisfaction >= 80 &&
          stats.mental >= 75 &&
          stats.expert < 60
        ) {
          finalEnding = 'ending_hobbyist';
        }
        // 16. 지속 가능한 평교사 엔딩 (가정 만족도 양호, 학생 신뢰 양호)
        else if (stats.familySatisfaction >= 80 && stats.studentTrust >= 50) {
          finalEnding = 'ending_sustainable';
        }
        // 17. 디폴트 평교사로 마감
        else {
          finalEnding = 'ending_general';
        }

        set({ endingId: finalEnding });
      },
      
      // 즉시 실패(게임오버) 판정 헬퍼 [NEW]
      checkFailureConditions: () => {
        // 이미 엔딩이나 실패 상태가 설정되어 있다면 추가 갱신 없이 즉시 잠급니다. [NEW]
        if (get().endingId) return true;

        const { stats, burnout100Days } = get();
        if (stats.hp <= 0) {
          set({ endingId: 'ending_gameover_hp' });
          return true;
        }
        if (stats.mental <= 0) {
          set({ endingId: 'ending_gameover_mental' });
          return true;
        }
        if (burnout100Days >= 3) {
          set({ endingId: 'ending_gameover_burnout' });
          return true;
        }
        if (stats.parentComplaint >= 100) {
          set({ endingId: 'ending_gameover_complaint' });
          return true;
        }
        return false;
      },

      // 9. RPG 장소 이동
      moveToLocation: (loc: LocationType | null) => {
        set({ 
          currentLocation: loc,
          currentNpcDialogue: null 
        });
      },

      // 10. 이벤트 결과창 닫기 (이벤트 완료 후 장소로 컴백)
      closeEventResult: () => {
        set({
          currentEvent: null,
          selectedChoice: null,
          eventResultText: null
        });
      },

      // 11. RPG 장소 탐색 (사건 트리거, TP 1 소모)
      exploreLocation: () => {
        const { currentLocation, day, hiddenFlags, actionPoints, stats, students, inventory, recentEventDays } = get();
        const effectiveFlags = [...hiddenFlags, ...getTrustDerivedFlags(students)];
        if (!currentLocation) return;
        if (actionPoints < 1) {
          get().showToast('교사력(TP)이 부족하여 탐색할 수 없습니다.');
          return;
        }

        // 장소에 맞는 카테고리 매핑
        let categories: GameEvent['category'][] = [];
        if (currentLocation === 'classroom') {
          categories = ['student'];
        } else if (currentLocation === 'office') {
          categories = ['colleague', 'parent'];
        } else if (currentLocation === 'principal_room') {
          categories = ['admin'];
        } else if (currentLocation === 'playground') {
          categories = ['random'];
        } else if (currentLocation === 'admin_office') {
          categories = ['admin', 'colleague'];
        } else if (currentLocation === 'cafeteria') {
          categories = ['colleague', 'random', 'parent'];
        } else if (currentLocation === 'library') {
          categories = ['student', 'random'];
        } else if (currentLocation === 'wee_class') {
          categories = ['student'];
        } else if (currentLocation === 'science_lab') {
          categories = ['admin', 'colleague'];
        } else if (currentLocation === 'school_gate') {
          categories = ['parent', 'student', 'random'];
        } else if (currentLocation === 'gym_room') {
          categories = ['colleague', 'admin', 'random'];
        } else if (currentLocation === 'gymnasium') {
          categories = ['student', 'random'];
        } else if (
          currentLocation === 'class_grade1' ||
          currentLocation === 'class_grade2' ||
          currentLocation === 'class_grade3' ||
          currentLocation === 'class_grade4' ||
          currentLocation === 'class_grade5' ||
          currentLocation === 'class_grade6'
        ) {
          categories = ['student'];
        } else {
          get().showToast('이 장소는 평화롭습니다. 휴식을 취하세요.');
          return;
        }

        // 해당 카테고리와 날짜에 맞는 후보군 필터링 (일반 후보 / 히든 탐험 후보 분리)
        const matchesExploreBase = (evt: GameEvent): boolean => {
          if (!categories.includes(evt.category)) return false;
          // [NEW · 장소 서사] location 지정 이벤트는 해당 장소를 탐색할 때만 등장 (장소 전용 스레드)
          if (evt.location && evt.location !== currentLocation) return false;
          const [start, end] = evt.dayRange;
          if (day < start || day > end) return false;
          // [WO-08] 로그 문자열 매칭(최근 20건 스크롤 아웃 시 재등장) 대신 ID 기반 쿨다운으로 판정한다.
          const lastSeenDay = recentEventDays[evt.id];
          if (lastSeenDay !== undefined && day - lastSeenDay < (evt.cooldown ?? 5)) return false;
          if (evt.prerequisites && evt.prerequisites.length > 0) {
            const hasAll = evt.prerequisites.every(flag => hasPrerequisite(flag, effectiveFlags, inventory));
            if (!hasAll) return false;
          }
          return true;
        };

        const normalCandidates = gameEvents.filter(evt => !evt.tags.includes(HIDDEN_EXPLORATION_TAG) && matchesExploreBase(evt));
        const hiddenCandidates = gameEvents.filter(evt => evt.tags.includes(HIDDEN_EXPLORATION_TAG) && matchesExploreBase(evt));

        // 숨은 발견 후보가 있으면 낮은 확률로만 이번 탐색의 후보군에 합류시켜 "가끔 발견되는" 느낌을 준다.
        const candidates = (hiddenCandidates.length > 0 && Math.random() < HIDDEN_EXPLORATION_CHANCE)
          ? [...normalCandidates, ...hiddenCandidates]
          : normalCandidates;

        if (candidates.length === 0) {
          get().showToast('더 이상 이 장소에서 탐색할 수 있는 새로운 사건이 없습니다.');
          return;
        }

        // 채널 통일 목표 비율(위기 시 상향)로 가중 랜덤 선택
        const selectedEvt = pickBalancedEvent(candidates, stats, day) ?? candidates[0];

        // 비밀/히든 탐험 이벤트와 마주친 경우 단서/관계 일지에 발견 기록을 남긴다.
        const isDiscoveryWorthy = selectedEvt.tags.includes(HIDDEN_EXPLORATION_TAG) || selectedEvt.tags.includes('비밀이벤트');
        const newDiscoveryLog = isDiscoveryWorthy
          ? [...get().discoveryLog, { id: `disc_evt_${selectedEvt.id}`, label: `발견: ${selectedEvt.title}`, day }]
          : get().discoveryLog;

        set({
          actionPoints: actionPoints - 1,
          currentEvent: selectedEvt,
          selectedChoice: null,
          eventResultText: null,
          discoveryLog: newDiscoveryLog,
          recentEventDays: { ...recentEventDays, [selectedEvt.id]: day } // [WO-08]
        });

        get().showToast(`[사건 발생] ${selectedEvt.title} 상황에 마주쳤습니다!`);
      },
      executeLocationAction: (actionType: 
        | 'classroom_lead' 
        | 'office_work' 
        | 'health_rest' 
        | 'playground_train' 
        | 'principal_chat'
        | 'admin_cooperate'
        | 'cafeteria_guide'
        | 'library_organize'
        | 'wee_counsel'
        | 'science_safety'
        | 'gate_safety'
        | 'gym_safety'
        | 'gym_room_organize'
        | 'grade_class_inspect'
      ) => {
        const { actionPoints, stats, day, recentLogs, dailyActionCounts } = get();
        if (actionPoints < 1) {
          get().showToast('교사력(TP)이 부족하여 행동을 수행할 수 없습니다.');
          return;
        }

        // [WO-12] 이 행동을 오늘 몇 번째로 실행하는지 미리 계산해둔다 (health_rest의 WO-13 일일 상한 판정에도 재사용).
        const timesToday = (dailyActionCounts[actionType] || 0) + 1;

        let effects: StatEffect[] = [];
        let msg = '';

        if (actionType === 'classroom_lead') {
          effects = [
            { stat: 'studentTrust', value: 5 },
            { stat: 'teachingSatisfaction', value: 5 },
            { stat: 'hp', value: -3 },
            { stat: 'mental', value: -2 }
          ];
          msg = '학급 학생들과 눈을 맞추며 아침 조회와 교실 지도를 수행했습니다. 학생 신뢰도와 보람이 증가했습니다.';
        } else if (actionType === 'office_work') {
          effects = [
            { stat: 'adminPower', value: 5 },
            { stat: 'hp', value: -5 },
            { stat: 'mental', value: -3 },
            { stat: 'burnout', value: 5 }
          ];
          msg = '교무실 책상에 앉아 밀려오는 교육청 기안 공문을 신속히 처리했습니다. 행정 역량이 증가했으나 번아웃이 늘었습니다.';
        } else if (actionType === 'health_rest') {
          // [WO-13] 보건실은 무한 회복 수단이었다 — 하루 2회까지만 실제로 회복되고,
          // 3회째부터는 효과 없이 TP만 소모된다(양호 선생님이 꾀병을 의심).
          if (timesToday > 2) {
            effects = [];
            msg = '양호 선생님이 "오늘 벌써 두 번째인데, 혹시 꾀병 아니에요?"라며 눈을 흘깁니다. 더 이상의 휴식은 허락되지 않았습니다.';
          } else {
            effects = [
              { stat: 'hp', value: 15 },
              { stat: 'mental', value: 10 },
              { stat: 'burnout', value: -10 }
            ];
            msg = '보건실 안락의자와 온열 매트 위에서 짧은 낮잠을 자며 피로를 풀었습니다. 건강 지표가 회복됩니다.';
          }
        } else if (actionType === 'playground_train') {
          effects = [
            { stat: 'hp', value: 10 },
            { stat: 'mental', value: 5 },
            { stat: 'burnout', value: -5 }
          ];
          msg = '넓은 운동장을 가볍게 조깅하며 신선한 바람을 마셨습니다. 기초 체력이 다소 회복됩니다.';
        } else if (actionType === 'principal_chat') {
          effects = [
            { stat: 'adminTrust', value: 5 },
            { stat: 'reputation', value: 3 },
            // [WO-12] 이전에는 비용이 전혀 없어 스팸 가능한 무비용 스탯원이었다 — 아부의 정신적 비용을 추가.
            { stat: 'mental', value: -3 }
          ];
          msg = '교장실에서 교장 선생님이 주신 따뜻한 차를 마시며 학교 경영 방침에 대해 깊은 차담을 나눴습니다.';
        } else if (actionType === 'admin_cooperate') {
          effects = [
            { stat: 'adminPower', value: 5 },
            { stat: 'colleagueSolidarity', value: 6 },
            { stat: 'hp', value: -4 }
          ];
          msg = '행정실에 들러 현장체험학습 관련 복잡한 세무 품의서 제출 처리를 정중히 협조 요청하고 실무를 도왔습니다.';
        } else if (actionType === 'cafeteria_guide') {
          effects = [
            { stat: 'studentTrust', value: 3 },
            { stat: 'colleagueSolidarity', value: 4 },
            { stat: 'hp', value: -5 }
          ];
          msg = '급식실에서 아이들의 배식 및 줄서기 지도 업무를 성심껏 돕고 조리사님들께 감사 인사를 건넸습니다.';
        } else if (actionType === 'library_organize') {
          effects = [
            { stat: 'expert', value: 5 },
            { stat: 'teachingSatisfaction', value: 4 },
            { stat: 'hp', value: -3 }
          ];
          msg = '조용한 도서실에서 신간 도서 분류 작업을 도우며, 최근 학계의 추천 도서 목록을 파악했습니다.';
        } else if (actionType === 'wee_counsel') {
          effects = [
            { stat: 'studentTrust', value: 6 },
            { stat: 'teachingSatisfaction', value: 6 },
            { stat: 'hp', value: -2 }
          ];
          msg = '상담실(Wee 클래스)에서 정서적 위기를 겪는 학급 학생의 심층 상담 일정을 조율하고 교류를 보조했습니다.';
        } else if (actionType === 'science_safety') {
          effects = [
            { stat: 'expert', value: 4 },
            { stat: 'adminPower', value: 3 },
            { stat: 'hp', value: -3 }
          ];
          msg = '과학실의 실험 도구 보관 상태와 시약 캐비닛 이중 잠금장치의 소독 및 관리 안전 수칙을 면밀히 점검했습니다.';
        } else if (actionType === 'gate_safety') {
          effects = [
            { stat: 'reputation', value: 4 },
            { stat: 'educationSoshin', value: 3 },
            { stat: 'parentComplaint', value: 2 },
            { stat: 'hp', value: -4 }
          ];
          msg = '교문에서 배움터지킴이 보안관님과 함께 등교하는 학생들의 안전 복장 및 교통 안전 수칙 등교 지도를 실시했습니다.';
        } else if (actionType === 'gym_safety') {
          effects = [
            { stat: 'hp', value: -4 },
            { stat: 'studentTrust', value: 4 },
            { stat: 'teachingSatisfaction', value: 4 }
          ];
          msg = '체육관에서 아이들의 안전을 모니터링하고 체육 강당 매트를 정돈했습니다. 학생 신뢰도와 보람이 증가했습니다.';
        } else if (actionType === 'gym_room_organize') {
          effects = [
            { stat: 'hp', value: -5 },
            { stat: 'colleagueSolidarity', value: 5 },
            { stat: 'adminPower', value: 3 }
          ];
          msg = '체육실에서 잃어버린 호루라기와 낡은 구령대 축구공 바구니를 깔끔하게 수납 정리했습니다. 동료 교직원 연대감이 증가했습니다.';
        } else if (actionType === 'grade_class_inspect') {
          effects = [
            { stat: 'expert', value: 5 },
            { stat: 'teachingSatisfaction', value: 3 },
            { stat: 'hp', value: -2 }
          ];
          msg = '1~6학년 복도 교실을 돌며 동료 교사들의 수업 환경과 교실 게시판 테마를 참관 연구했습니다. 수업 전문성과 보람이 증가했습니다.';
        }

        // [WO-12] 같은 장소 행동을 오늘 몇 번째 반복하는지에 따라 "이득" 효과에만 체감(디미니싱 리턴)을
        // 적용한다: 1~2회째 100%, 3회째 50%, 4회째부터 25%. 손해(비용) 효과는 배율 없이 그대로 적용해
        // 반복할수록 순손실이 커지게 함으로써 "같은 행동 반복이 항상 최적"인 상태를 깬다.
        const efficiency = timesToday <= 2 ? 1 : timesToday === 3 ? 0.5 : 0.25;

        const newStats = { ...stats };
        effects.forEach(eff => {
          const isRisk = RISK_STATS.includes(eff.stat);
          const isGain = isRisk ? eff.value < 0 : eff.value > 0; // 위험 스탯은 감소가 이득
          const appliedValue = isGain ? Math.round(eff.value * efficiency) : eff.value;
          newStats[eff.stat] = clamp(newStats[eff.stat] + appliedValue, 0, 100);
        });

        const efficiencyNote = efficiency < 1 ? ` (오늘 ${timesToday}번째 반복 — 효율 ${Math.round(efficiency * 100)}%)` : '';
        const updatedLogs = [
          `[${day}일차] ${msg}${efficiencyNote}`,
          ...recentLogs.slice(0, 19)
        ];

        set({
          actionPoints: actionPoints - 1,
          stats: syncNewStats(newStats),
          recentLogs: updatedLogs,
          dailyActionCounts: { ...dailyActionCounts, [actionType]: timesToday }
        });

        get().showToast(`${msg}${efficiencyNote}`);
        get().checkFailureConditions();
      },

      // 13. RPG 캐릭터 대화 개시 (TP를 소모하지 않는 이벤트성 대화)
      // 13. RPG 캐릭터 대화 개시 (TP 1 소모 및 100선 랜덤 대화 연동)
      talkToNPC: (npcId: string, npcName: string) => {
        const { day, recentLogs, completedNpcDialoguesToday, completedNpcEvents, actionPoints, stats } = get();

        // 오늘 이미 대화한 적 있는 NPC인지 확인 (당일 중복 차단)
        if (completedNpcDialoguesToday.includes(npcId)) {
          get().showToast(`[대화 제한] 오늘 이미 ${npcName}님과 대화했습니다. 내일 다시 대화할 수 있습니다.`);
          return;
        }

        // 대화 시 체력 1 소모 체크
        if (actionPoints < 1) {
          get().showToast('교사력(TP)이 부족하여 NPC와 대화할 수 없습니다. 퇴근 후 다음 날로 진행하세요.');
          return;
        }

        let steps: DialogueStep[] = [];
        let eventIdx = 0;

        // npcId가 student_ 로 시작하는 경우 학생 대화 150선 연동
        if (npcId.startsWith('student_')) {
          const completedIdxs = completedNpcEvents[npcId] || [];
          const dialogueCount = studentDialogueEvents.length;
          let candidates = Array.from({ length: dialogueCount }, (_, i) => i).filter(i => !completedIdxs.includes(i));
          
          if (candidates.length === 0) {
            candidates = Array.from({ length: dialogueCount }, (_, i) => i);
            completedNpcEvents[npcId] = [];
          }

          eventIdx = pickBalancedDialogueIndex(candidates, studentDialogueEvents, stats, day);
          const evt = studentDialogueEvents[eventIdx];

          const student = get().students.find(s => s.id === npcId);
          const role = student ? `${student.name} (우리 반 학생)` : '학생';
          steps = evt.generateSteps(npcName, role);

          // [NEW · 어드벤처] NPC가 그동안의 관계와 선택을 '기억'하도록, 누적 신뢰도/서사 플래그에 따라
          // 첫 대사 앞에 짧은 회상 인사를 덧붙인다. (스텝 인덱스 참조가 깨지지 않게 본문만 가공)
          if (student && steps.length > 0) {
            const flags = get().hiddenFlags;
            let memory = '';
            if (npcId === 'student_jihun' && flags.includes('arc_jihun_helped')) {
              memory = '(선생님을 보자 지훈이가 멋쩍게 웃으며) "선생님! 그때 제 얘기 끝까지 들어주신 거… 저 아직도 기억해요."';
            } else if (npcId === 'student_jihun' && flags.includes('arc_jihun_neglected')) {
              memory = '(지훈이가 선생님과 눈을 피하며 시큰둥하게) "…아, 네. 선생님."';
            } else if (student.teacherTrust >= 75) {
              memory = `(${student.name}이(가) 반갑게 다가오며) "선생님이랑 얘기하는 거 이제 진짜 편해요!"`;
            } else if (student.teacherTrust <= 30) {
              memory = `(${student.name}이(가) 아직은 조심스러운 표정으로 선생님을 바라본다.)`;
            }
            if (memory) {
              steps = steps.map((s, i) => (i === 0 ? { ...s, text: `${memory}\n\n${s.text}` } : s));
            }
          }
        }
        // 그 외에는 교직원 대화 150선 연동
        else {
          const completedIdxs = completedNpcEvents[npcId] || [];
          const dialogueCount = colleagueDialogueEvents.length;
          let candidates = Array.from({ length: dialogueCount }, (_, i) => i).filter(i => !completedIdxs.includes(i));
          
          if (candidates.length === 0) {
            candidates = Array.from({ length: dialogueCount }, (_, i) => i);
            completedNpcEvents[npcId] = [];
          }

          eventIdx = pickBalancedDialogueIndex(candidates, colleagueDialogueEvents, stats, day);
          const evt = colleagueDialogueEvents[eventIdx];

          // 역할 매핑
          let role = '동료 교사';
          if (npcId === 'colleague_senior') role = '부장 선생님';
          else if (npcId === 'colleague_mate') role = '옆자리 동료 교사';
          else if (npcId === 'colleague_vice_principal') role = '교감 선생님';
          else if (npcId === 'principal') role = '교장 선생님';
          else if (npcId === 'nurse') role = '보건 교사';
          else if (npcId === 'gym') role = '체육 교사';
          else if (npcId.startsWith('staff_')) {
            if (npcId === 'staff_admin_chief') role = '행정실장';
            else if (npcId === 'staff_admin_worker') role = '행정 주무관';
            else if (npcId === 'staff_cook') role = '조리사님';
            else if (npcId === 'staff_librarian') role = '사서 교사';
            else if (npcId === 'staff_counselor') role = '전문 상담 교사';
            else if (npcId === 'staff_science_assistant') role = '과학 실무사';
            else if (npcId === 'staff_guard') role = '배움터 지킴이';
          }

          steps = evt.generateSteps(npcName, role, npcId);
        }

        const updatedLogs = [
          `[${day}일차] ${npcName} 캐릭터와 대화 개시 (체력 1 소모)`,
          ...recentLogs.slice(0, 19)
        ];

        const nextCompletedToday = [...completedNpcDialoguesToday];
        if (!nextCompletedToday.includes(npcId)) {
          nextCompletedToday.push(npcId);
        }

        const updatedCompletedNpcEvents = { ...completedNpcEvents };
        if (!updatedCompletedNpcEvents[npcId]) {
          updatedCompletedNpcEvents[npcId] = [];
        }
        updatedCompletedNpcEvents[npcId].push(eventIdx);

        set({
          completedNpcDialoguesToday: nextCompletedToday,
          completedNpcEvents: updatedCompletedNpcEvents,
          actionPoints: actionPoints - 1, // 체력 1 소모
          npcDialogueSession: {
            npcId,
            npcName,
            currentStepIndex: 0,
            steps,
            activeFeedbackText: null,
            activeFeedbackEffects: null
          },
          recentLogs: updatedLogs
        });
      },

      // 14. NPC 대화창 닫기 (강제 및 초기화)
      clearNpcDialogue: () => {
        set({ 
          npcDialogueSession: null,
          currentNpcDialogue: null // 하위호환 백업
        });
      },

      // 15. 멀티턴 대화 선택지 선택 처리
      selectDialogueChoice: (choice: DialogueChoice) => {
        const { npcDialogueSession, stats } = get();
        if (!npcDialogueSession) return;

        // 즉각 스탯 변동 효과 반영
        const newStats = { ...stats };
        if (choice.effects && choice.effects.length > 0) {
          choice.effects.forEach(eff => {
            newStats[eff.stat] = clamp(
              newStats[eff.stat] + eff.value,
              0,
              100
            );
          });
        }

        // 대화 선택의 정서를 전역 원장에 반영해 이후 이벤트 밸런싱에 함께 작용하게 한다
        const dialogueValence = inferValence(choice.effects as StatEffect[] | undefined);

        // 결과 리액션 피드백이 있는 경우
        if (choice.resultText) {
          set({
            stats: syncNewStats(newStats),
            recentValenceLog: pushValence(get().recentValenceLog, dialogueValence),
            npcDialogueSession: {
              ...npcDialogueSession,
              activeFeedbackText: choice.resultText,
              activeFeedbackEffects: choice.effects || null,
              currentStepIndex: choice.nextStepIndex !== null ? choice.nextStepIndex : npcDialogueSession.currentStepIndex
            }
          });
        } else {
          // 바로 다음 스텝으로 이동하거나 대화 세션 종료
          if (choice.nextStepIndex !== null) {
            set({
              stats: syncNewStats(newStats),
              npcDialogueSession: {
                ...npcDialogueSession,
                currentStepIndex: choice.nextStepIndex,
                activeFeedbackText: null,
                activeFeedbackEffects: null
              }
            });
          } else {
            // 대화 즉시 종료
            set({
              stats: syncNewStats(newStats),
              npcDialogueSession: null
            });
          }
        }
        get().checkFailureConditions();
      },

      // 16. 단방향 대사 클릭 전진 및 피드백 닫기
      advanceDialogueStep: () => {
        const { npcDialogueSession } = get();
        if (!npcDialogueSession) return;

        // 만약 선택 후 피드백 리액션(activeFeedbackText) 화면이었다면 피드백을 지우고 현재 스텝의 텍스트로 이동
        if (npcDialogueSession.activeFeedbackText !== null) {
          set({
            npcDialogueSession: {
              ...npcDialogueSession,
              activeFeedbackText: null,
              activeFeedbackEffects: null
            }
          });
          return;
        }

        // 일반 대사 단계인 경우
        const currentStep = npcDialogueSession.steps[npcDialogueSession.currentStepIndex];
        const nextIndex = currentStep.nextStepIndex !== undefined ? currentStep.nextStepIndex : (npcDialogueSession.currentStepIndex + 1);

        if (nextIndex === null || nextIndex >= npcDialogueSession.steps.length) {
          // 대화 최종 종료
          set({ npcDialogueSession: null });
        } else {
          set({
            npcDialogueSession: {
              ...npcDialogueSession,
              currentStepIndex: nextIndex
            }
          });
        }
      },

      clearDayEffects: () => {
        set({ dayEffectsTriggered: [] });
      },

      counselStudent: (studentId, actionType) => {
        const { actionPoints, students, stats, day, recentLogs } = get();

        // 1. 교사력(TP) 체크
        if (actionPoints < 1) {
          get().showToast('교사력(TP)이 부족하여 학생을 지도할 수 없습니다.');
          return null;
        }

        const student = students.find(s => s.id === studentId);
        if (!student) return null;

        const newStats = { ...stats };
        let studentTrustDiff = 0;
        let selfEsteemDiff = 0;
        let behaviorDiff = 0;
        let academicLevelDiff = 0;
        let motivationDiff = 0;

        let teacherHpDiff = 0;
        let teacherMentalDiff = 0;
        let teacherSoshinDiff = 0;
        let teacherSatisfactionDiff = 0;
        let teacherExpertDiff = 0;

        let feedbackText = '';
        let effectsText = '';

        // 2. 상성 판정 및 점수 계산
        if (actionType === 'empathy') {
          // 따뜻한 공감 지지
          const hasGoodTrait = student.traits.some(t => 
            ['유리멘탈', '보이지않는아이', '내성적', '속앓이', '예민한정서', '소외감', '관계불안', '감정기복'].includes(t)
          );
          const hasBadTrait = student.traits.some(t => 
            ['트러블메이커', '규칙위반', '독단성'].includes(t)
          );

          if (hasGoodTrait) {
            studentTrustDiff = 15;
            selfEsteemDiff = 10;
            teacherMentalDiff = -3;
            teacherHpDiff = -1;
            feedbackText = `"${student.name} 학생의 여리고 지친 마음에 깊은 위로와 지지를 전했습니다. 아이는 참아왔던 눈물을 왈칵 쏟아내며, 자신의 아픔을 온전히 알아주는 선생님에게 평생 잊지 못할 깊은 고마움을 느낍니다."`;
            effectsText = `효과: 학생 신뢰도 +15, 자존감 +10 | 교사 멘탈 -3, 체력 -1`;
          } else if (hasBadTrait) {
            behaviorDiff = -10;
            teacherSoshinDiff = -3;
            teacherMentalDiff = -3;
            feedbackText = `"${student.name} 학생의 일탈 행동에 대해 훈육 대신 온정적인 지지만 베풀었습니다. 아이는 이를 '대충 넘어가도 된다'는 신호로 받아들여 학급 기강이 흐트러지고 반항적 경향이 늘었습니다."`;
            effectsText = `효과: 학생 행동성향 -10 | 교사 소신 -3, 멘탈 -3`;
          } else {
            studentTrustDiff = 5;
            selfEsteemDiff = 5;
            teacherMentalDiff = -2;
            feedbackText = `"${student.name} 학생의 이야기를 경청하며 다정한 조언을 건넸습니다. 특별한 상성은 없었으나 마음을 한결 가볍게 털어내고 돌아갑니다."`;
            effectsText = `효과: 학생 신뢰도 +5, 자존감 +5 | 교사 멘탈 -2`;
          }
        } else if (actionType === 'rational') {
          // 이성적 솔루션
          const hasGoodTrait = student.traits.some(t => 
            ['우등생', '성실파', '노력형 부진아', '기획자', '코딩신동', '과학고지망', '이과형인재'].includes(t)
          );
          const hasBadTrait = student.traits.some(t => 
            ['유리멘탈', '걱정많음', '소녀감성'].includes(t)
          );

          if (hasGoodTrait) {
            academicLevelDiff = 10;
            motivationDiff = 15;
            teacherExpertDiff = 8;
            teacherMentalDiff = -2;
            feedbackText = `"${student.name} 학생에게 현 상황을 정밀하게 피드백하고 구체적인 극복 계획과 행동 수칙을 제시했습니다. 계획적인 성향의 아이는 교사의 체계적인 교육관에 탄복하며 즉시 실천 의지를 불태웁니다."`;
            effectsText = `효과: 학생 학업역량 +10, 학습동기 +15 | 교사 전문성 +8, 멘탈 -2`;
          } else if (hasBadTrait) {
            selfEsteemDiff = -10;
            studentTrustDiff = -8;
            feedbackText = `"${student.name} 학생의 정서적 힘겨움은 고려하지 않은 채, 지독하게 이성적인 팩트와 해야 할 행동 수칙만 조목조목 들이댔습니다. 아이는 강한 심리적 압박감을 느끼며 마음에 큰 상처를 받았습니다."`;
            effectsText = `효과: 학생 자존감 -10, 신뢰도 -8`;
          } else {
            academicLevelDiff = 5;
            motivationDiff = 5;
            teacherExpertDiff = 2;
            feedbackText = `"${student.name} 학생에게 실현 가능한 학업 방향 및 과제 스케줄을 조율해주었습니다. 평범하고 무난한 도움이 되었습니다."`;
            effectsText = `효과: 학생 학업역량 +5, 학습동기 +5 | 교사 전문성 +2`;
          }
        } else if (actionType === 'strict') {
          // 엄격한 규율 훈육
          const hasGoodTrait = student.traits.some(t => 
            ['트러블메이커', '규칙위반', '독단성', '주의산만', '오지랖', '지각쟁이', '다혈질'].includes(t)
          );
          const hasBadTrait = student.traits.some(t => 
            ['내성적', '유리멘탈', '경계심'].includes(t)
          );

          if (hasGoodTrait) {
            behaviorDiff = 20;
            teacherSoshinDiff = 10;
            studentTrustDiff = -3;
            teacherMentalDiff = -4;
            feedbackText = `"${student.name} 학생이 지켜야 할 학급 규율과 한계를 엄정하고 단호한 어조로 지도했습니다. 평소 산만하고 경계가 모호했던 아이는 흐트러진 규율을 다잡고 자신의 그릇된 행동을 조심하기 시작합니다."`;
            effectsText = `효과: 학생 행동성향 +20, 신뢰도 -3 | 교사 소신 +10, 멘탈 -4`;
          } else if (hasBadTrait) {
            studentTrustDiff = -15;
            selfEsteemDiff = -12;
            teacherMentalDiff = -5;
            feedbackText = `"${student.name} 학생의 여린 성향을 헤아리지 못한 채 매서운 어조와 엄벌 기조로 강하게 훈육했습니다. 내성적인 아이는 극심한 위축감과 불신감을 느끼며 문을 닫아 걸어버렸습니다."`;
            effectsText = `효과: 학생 신뢰도 -15, 자존감 -12 | 교사 멘탈 -5`;
          } else {
            behaviorDiff = 6;
            teacherSoshinDiff = 3;
            teacherMentalDiff = -2;
            feedbackText = `"${student.name} 학생이 반성해야 할 사안에 대해 조목조목 이치에 맞는 훈육을 집행했습니다. 기강 정돈에 도움이 되었습니다."`;
            effectsText = `효과: 학생 행동성향 +6 | 교사 소신 +3, 멘탈 -2`;
          }
        } else if (actionType === 'strength') {
          // 강점 진로 격려
          const hasGoodTrait = student.traits.some(t => 
            ['예술가기질', '체육특기자', '아이돌지망생', '크리에이터꿈나무', '기계덕후', '곤충박사', '일러스트레이터', '피아노장인', '댄싱퀸', '요리사지망'].includes(t)
          );
          const hasBadTrait = student.traits.some(t => 
            ['성적집착', '완벽주의'].includes(t)
          );

          if (hasGoodTrait) {
            motivationDiff = 20;
            selfEsteemDiff = 15;
            studentTrustDiff = 10;
            teacherSatisfactionDiff = 8;
            feedbackText = `"${student.name} 학생의 성적 이면에 잠재된 뛰어난 끼와 고유한 재능을 조명하며, 진심 어린 격려와 지지를 보냈습니다. 아이는 자신의 꿈을 알아봐 준 교사에게 큰 희망을 느끼고 자존감을 한껏 드높입니다."`;
            effectsText = `효과: 학생 학습동기 +20, 자존감 +15, 신뢰도 +10 | 교사 보람 +8`;
          } else if (hasBadTrait) {
            motivationDiff = -8;
            feedbackText = `"${student.name} 학생에게 성적이 전부가 아니니 부담을 내려놓고 다른 취미나 진로를 보라고 과도하게 권했습니다. 그러나 성적과 완벽함에 강하게 집착하는 아이는 오히려 갈피를 잃고 의욕을 상실합니다."`;
            effectsText = `효과: 학생 학습동기 -8`;
          } else {
            motivationDiff = 6;
            selfEsteemDiff = 5;
            feedbackText = `"${student.name} 학생의 긍정적인 면모와 장점을 칭찬해 주었습니다. 아이의 눈가에 작은 활력과 자부심이 깃듭니다."`;
            effectsText = `효과: 학생 학습동기 +6, 자존감 +5`;
          }
        } else if (actionType === 'mentoring') {
          // 밀착 1:1 멘토링
          const hasGoodTrait = student.traits.some(t => 
            ['노력형 부진아', '잠만보', '만성피로', '조용한반항아', '학업방치', '행동느림', '느림보'].includes(t)
          );
          const hasBadTrait = student.traits.some(t => 
            ['아웃사이더', '독서광', '비사교적'].includes(t)
          );

          if (hasGoodTrait) {
            academicLevelDiff = 10;
            behaviorDiff = 12;
            studentTrustDiff = 10;
            teacherHpDiff = -8;
            teacherMentalDiff = -4;
            feedbackText = `"${student.name} 학생을 위해 방과 후 개인 시간을 대거 할애하여 1:1 보충 지도를 수행하고 규칙적인 생활 습관을 다독였습니다. 끈기 있는 헌신 덕에 아이의 더딘 발걸음이 크게 전진하기 시작합니다."`;
            effectsText = `효과: 학생 학업역량 +10, 행동성향 +12, 신뢰도 +10 | 교사 체력 -8, 멘탈 -4`;
          } else if (hasBadTrait) {
            studentTrustDiff = -10;
            feedbackText = `"${student.name} 학생을 돕겠다며 그의 사적 바운더리에 과도하게 침범하여 억지 밀착 솔루션을 시도했습니다. 사색을 중요시하는 아이는 강한 거부감을 느끼며 선생님을 더 멀리하기 시작합니다."`;
            effectsText = `효과: 학생 신뢰도 -10`;
          } else {
            academicLevelDiff = 4;
            behaviorDiff = 4;
            teacherHpDiff = -4;
            feedbackText = `"${student.name} 학생을 옆자리에 앉히고 차근차근 학급 실무와 뒤처진 학습지 작성을 꼼꼼하게 도왔습니다. 실질적인 서포트가 이루어졌습니다."`;
            effectsText = `효과: 학생 학업역량 +4, 행동성향 +4 | 교사 체력 -4`;
          }
        }

        // 3. 학생 지표 및 교사 지표 반영
        const updatedStudents = students.map(s => {
          if (s.id === studentId) {
            return {
              ...s,
              academicLevel: clamp(s.academicLevel + academicLevelDiff),
              motivation: clamp(s.motivation + motivationDiff),
              selfEsteem: clamp(s.selfEsteem + selfEsteemDiff),
              behavior: clamp(s.behavior + behaviorDiff),
              teacherTrust: clamp(s.teacherTrust + studentTrustDiff)
            };
          }
          return s;
        });

        if (teacherHpDiff !== 0) newStats.hp = clamp(newStats.hp + teacherHpDiff);
        if (teacherMentalDiff !== 0) newStats.mental = clamp(newStats.mental + teacherMentalDiff);
        if (teacherSoshinDiff !== 0) newStats.educationSoshin = clamp(newStats.educationSoshin + teacherSoshinDiff);
        if (teacherSatisfactionDiff !== 0) newStats.teachingSatisfaction = clamp(newStats.teachingSatisfaction + teacherSatisfactionDiff);
        if (teacherExpertDiff !== 0) newStats.expert = clamp(newStats.expert + teacherExpertDiff);

        // 스탯 동기화
        const syncedStats = syncNewStats(newStats);

        const updatedLogs = [
          `[${day}일차] 반 학생 ${student.name} 1:1 개별 지도 수행 (${actionType})`,
          ...recentLogs.slice(0, 19)
        ];

        set({
          students: updatedStudents,
          stats: syncedStats,
          actionPoints: actionPoints - 1,
          recentLogs: updatedLogs
        });

        get().showToast(`[학생지도] ${student.name} 학생을 지도하여 상태가 변동되었습니다.`);
        get().checkFailureConditions();

        return { feedbackText, effectsText };
      },

      // [NEW] 매일 아침 각 장소별 등장 캐릭터 일일 셔플링
      shuffleNpcPlacements: () => {
        const { students } = get();
        if (students.length === 0) return;

        // 1. 교실: 우리 반 학생 10명 중 무작위 3명 선별
        const shuffledClassStudents = [...students];
        for (let i = shuffledClassStudents.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledClassStudents[i], shuffledClassStudents[j]] = [shuffledClassStudents[j], shuffledClassStudents[i]];
        }
        const classroomNPCs = shuffledClassStudents.slice(0, 3).map(s => ({
          id: s.id,
          name: s.name,
          role: `${s.name} (우리 반 학생)`
        }));

        // 2. 교무실: 교감선생님, 박교사, 부장선생님 중 무작위 2명
        const officePool = [
          { id: 'colleague_senior', name: '김 부장 교사', role: '부장 선생님' },
          { id: 'colleague_mate', name: '박 교사', role: '옆자리 동료 교사' },
          { id: 'colleague_vice_principal', name: '교감 선생님', role: '교감 선생님' }
        ];
        const shuffledOffice = [...officePool].sort(() => Math.random() - 0.5);
        const officeNPCs = shuffledOffice.slice(0, 2);

        // 3. 보건실: 보건교사 상주 + 30% 확률로 아픈 학생 1명 추가
        const healthNPCs = [{ id: 'nurse', name: '보건 선생님', role: '보건 교사' }];
        if (Math.random() < 0.3) {
          const sickStudent = students[Math.floor(Math.random() * students.length)];
          healthNPCs.push({ id: sickStudent.id, name: sickStudent.name, role: `${sickStudent.name} (보건실 안정을 취하는 중)` });
        }

        // 4. 체육실 (GR): 체육교사 상주 + 30% 확률로 학생 1명
        const gymRoomNPCs = [{ id: 'gym', name: '체육 선생님', role: '체육 교사' }];
        if (Math.random() < 0.3) {
          const student = students[Math.floor(Math.random() * students.length)];
          gymRoomNPCs.push({ id: student.id, name: student.name, role: `${student.name} (체육 비품실 정리 보조)` });
        }

        // 5. 체육관 (GY): 운동 조력 학생 1~2명
        const gymnasiumNPCs: { id: string; name: string; role?: string }[] = [];
        const student1 = students[Math.floor(Math.random() * students.length)];
        gymnasiumNPCs.push({ id: student1.id, name: student1.name, role: `${student1.name} (농구 연습 중인 제자)` });
        if (Math.random() < 0.5) {
          const student2 = students.filter(s => s.id !== student1.id)[Math.floor(Math.random() * (students.length - 1))];
          if (student2) {
            gymnasiumNPCs.push({ id: student2.id, name: student2.name, role: `${student2.name} (강당 배드민턴 연습 중)` });
          }
        }

        // 6. 행정실: 행정실장, 행정실무사 중 1~2명
        const adminPool = [
          { id: 'staff_admin_chief', name: '행정실장', role: '행정부 부서장' },
          { id: 'staff_admin_worker', name: '행정 실무사', role: '행정실 실무 담당자' }
        ];
        const adminNPCs = [...adminPool].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 2) + 1);

        // 7. 급식실: 급식 조리사님 배치
        const cookPool = [
          { id: 'staff_cook', name: '급식 조리사님', role: '조리 배식 담당' }
        ];
        const cookNPCs = [...cookPool];

        // 8. 도서실: 사서교사 상주 + 40% 확률로 자습 학생
        const libraryNPCs = [{ id: 'staff_librarian', name: '사서 교사', role: '도서관 도서 관리자' }];
        if (Math.random() < 0.4) {
          const reader = students[Math.floor(Math.random() * students.length)];
          libraryNPCs.push({ id: reader.id, name: reader.name, role: `${reader.name} (도서 코너 독서 삼매경)` });
        }

        // 9. 과학실: 과학실무사 상주 + 30% 확률로 조력 학생
        const scienceNPCs = [{ id: 'staff_science_assistant', name: '과학실무사', role: '과학 교구 관리자' }];
        if (Math.random() < 0.3) {
          const assistant = students[Math.floor(Math.random() * students.length)];
          scienceNPCs.push({ id: assistant.id, name: assistant.name, role: `${assistant.name} (과학실 청소 보조)` });
        }

        // 10. Wee 클래스: 전문상담교사 상주 + 30% 확률로 상담 학생
        const weeNPCs = [{ id: 'staff_counselor', name: '전문상담교사', role: '상담실 책임 교사' }];
        if (Math.random() < 0.3) {
          const counselStudent = students[Math.floor(Math.random() * students.length)];
          weeNPCs.push({ id: counselStudent.id, name: counselStudent.name, role: `${counselStudent.name} (Wee클래스 고민 상담 중)` });
        }

        // 11. 교문: 지킴이보안관 상주 + 40% 확률로 등교 학생
        const gateNPCs = [{ id: 'staff_guard', name: '배움터지킴이', role: '등교 안전 보안관' }];
        if (Math.random() < 0.4) {
          const student = students[Math.floor(Math.random() * students.length)];
          gateNPCs.push({ id: student.id, name: student.name, role: `${student.name} (지각 면담 지도 중인 학생)` });
        }

        // 12. 교장실: 교장 선생님 상주
        const principalNPCs = [{ id: 'principal', name: '교장 선생님', role: '학교 최고 경영자' }];

        // 13. 1~6학년 교실: 각각 2명씩 고유한 가상의 교사 캐릭터 정의하여 1~2명 무작위 배치
        const gradeTeachers: Record<string, { id: string; name: string; role: string }[]> = {
          class_grade1: [
            { id: 'colleague_g1_a', name: '정민우 교사', role: '1학년 1반 담임교사' },
            { id: 'colleague_g1_b', name: '김영희 교사', role: '1학년 2반 담임교사' }
          ],
          class_grade2: [
            { id: 'colleague_g2_a', name: '박지수 교사', role: '2학년 1반 담임교사' },
            { id: 'colleague_g2_b', name: '최유진 교사', role: '2학년 2반 담임교사' }
          ],
          class_grade3: [
            { id: 'colleague_g3_a', name: '이성우 교사', role: '3학년 1반 담임교사' },
            { id: 'colleague_g3_b', name: '한나래 교사', role: '3학년 2반 담임교사' }
          ],
          class_grade4: [
            { id: 'colleague_g4_a', name: '윤태호 교사', role: '4학년 1반 담임교사' },
            { id: 'colleague_g4_b', name: '신지원 교사', role: '4학년 과학전담교사' }
          ],
          class_grade5: [
            { id: 'colleague_g5_a', name: '강성훈 교사', role: '5학년 1반 담임교사' },
            { id: 'colleague_g5_b', name: '백현우 교사', role: '5학년 체육전담교사' }
          ],
          class_grade6: [
            { id: 'colleague_g6_a', name: '송민지 교사', role: '6학년 1반 담임교사' },
            { id: 'colleague_g6_b', name: '오윤아 교사', role: '6학년 영어전담교사' }
          ]
        };

        const placement: Record<string, { id: string; name: string; role?: string }[]> = {
          classroom: classroomNPCs,
          office: officeNPCs,
          health_room: healthNPCs,
          gym_room: gymRoomNPCs,
          gymnasium: gymnasiumNPCs,
          admin_office: adminNPCs,
          cafeteria: cookNPCs,
          library: libraryNPCs,
          science_lab: scienceNPCs,
          wee_class: weeNPCs,
          school_gate: gateNPCs,
          principal_room: principalNPCs
        };

        // 학년별 1~2명 배치 반영
        Object.keys(gradeTeachers).forEach(grade => {
          const list = [...gradeTeachers[grade]];
          placement[grade] = list.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 2) + 1);
        });

        set({ dailyNpcPlacement: placement });
      },

      // [NEW] 매일 아침 학교 메신저 메시지 일일 생성
      // [NEW] 매일 아침 학교 메신저 메시지 일일 생성 (대한민국 현실 민원 50선 랜덤 연동)
      generateMessengerNotifications: () => {
        const { day } = get();
        const newNotifs: MessengerNotification[] = [];

        // 1. 교육청/학교 긴급 공문 알림 (항상 1개)
        newNotifs.push({
          id: `msg_edu_${day}`,
          sender: '교육청 초등교육과',
          previewText: '디지털 교과서 설문 취합 긴급 지침',
          type: 'messenger_event',
          targetId: 'messenger_evt_edu_01',
          isRead: false
        });

        // 2. 교직원 협조 요청 알림 (50% 확률)
        if (Math.random() < 0.5) {
          newNotifs.push({
            id: `msg_school_${day}`,
            sender: '교무부 행사기획계',
            previewText: '교내 과학 체험 창의 융합 축전 행사용 보조교사 지원 요청',
            type: 'messenger_event',
            targetId: 'messenger_evt_school_01',
            isRead: false
          });
        }

        // 최대 6개까지만 쌓이도록 제한
        if (newNotifs.length > 6) {
          set({ messengerNotifications: newNotifs.slice(newNotifs.length - 6) });
        } else {
          set({ messengerNotifications: newNotifs });
        }
      },

      // [NEW] 학교 메신저 알림 클릭 시 액션 (체력 1 소모 연계 및 파싱)
      triggerMessengerAction: (notificationId: string) => {
        const { messengerNotifications, actionPoints } = get();
        const target = messengerNotifications.find(n => n.id === notificationId);
        if (!target) return;

        // 메신저 이벤트 처리를 시작하려면 교사력이 최소 1이 필요합니다.
        if (actionPoints < 1) {
          get().showToast('교사력(TP)이 부족하여 메신저 요청을 처리할 수 없습니다. 다음 날로 넘어가 교사력을 회복하세요.');
          return;
        }

        // 읽음 처리
        set({
          messengerNotifications: messengerNotifications.map(n => 
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        });

        // 1. NPC 대화 연계인 경우 (바로 리스트에서 제거)
        if (target.type === 'npc_dialogue') {
          set({
            messengerNotifications: get().messengerNotifications.filter(n => n.id !== notificationId)
          });
          get().talkToNPC(target.targetId, target.targetName || '동료 교사');
        } 
        // 2. 메신저 전용 A/B 선택형 사건인 경우
        else if (target.type === 'messenger_event') {
          let eventDetails: MessengerEvent | null = null;
          
          // 학부모 리얼 민원 50선 파싱
          if (target.targetId.startsWith('parent_msg_')) {
            const idx = parseInt(target.targetId.replace('parent_msg_', ''), 10);
            const parentEvt = parentMessengerEvents[idx];
            if (parentEvt) {
              eventDetails = {
                id: parentEvt.id,
                sender: parentEvt.sender,
                previewText: parentEvt.previewText,
                choices: parentEvt.choices.map(c => ({
                  id: c.id,
                  text: c.text,
                  effects: c.effects,
                  resultText: c.resultText
                })),
                notificationId: target.id // [NEW] 알림 고유 ID 매핑
              };
            }
          } 
          // 그 외 고정 공문들
          else if (target.targetId === 'messenger_evt_edu_01') {
            eventDetails = {
              id: target.targetId,
              sender: target.sender,
              previewText: '교육청 초등교육과에서 온 디지털 교과서 설문 취합 긴급 지침입니다. 오늘 4시까지 전 학년 활용 수치 통계를 보고해야 합니다. 어떻게 행동하시겠습니까?',
              choices: [
                {
                  id: 'choice_edu_01_1',
                  text: '교실 청소 지도를 자습으로 대체하고 정보실에 올라가 즉각 보고서 취합 기안을 상신한다.',
                  effects: [{ stat: 'adminPower', value: 8 }, { stat: 'burnout', value: 12 }, { stat: 'mental', value: -8 }, { stat: 'studentTrust', value: -3 }],
                  resultText: '정보 부서 결재를 안전하게 뚫고 교육청 공문 처리를 완수하여 관리자의 평판이 오르고 행정 역량을 입증했으나, 담임 교실 지도가 누설되고 몸이 극도로 피로해졌습니다.'
                },
                {
                  id: 'choice_edu_01_2',
                  text: '메신저로 부장님과 행무 실무사님께 사정을 구해 내일 오전 중으로 협조 보고를 늦춰 작성한다.',
                  effects: [{ stat: 'colleagueSolidarity', value: 10 }, { stat: 'hp', value: -3 }, { stat: 'burnout', value: -5 }],
                  resultText: '행정 부서 간 조율을 거치며 동료들과 협동적 연대를 다졌고 오늘 밤 야근을 피했습니다. 단, 공문 마감일이 밀려 행정실의 깐깐한 결재 압박은 약간 남아있습니다.'
                }
              ],
              notificationId: target.id // [NEW] 알림 고유 ID 매핑
            };
          } else if (target.targetId === 'messenger_evt_school_01') {
            eventDetails = {
              id: target.targetId,
              sender: target.sender,
              previewText: '교내 과학 창의 융합 축전 행사입니다. 각 학급 부스 운영을 도울 스태프 교사가 부족하여 지원을 바라는 긴급 공고입니다. 어떻게 응대하시겠습니까?',
              choices: [
                {
                  id: 'choice_school_01_1',
                  text: '적극 지원하여 우주 과학 실험 부스를 책임지고 당당히 종일 운영한다.',
                  effects: [{ stat: 'expert', value: 10 }, { stat: 'teachingSatisfaction', value: 10 }, { stat: 'hp', value: -10 }, { stat: 'burnout', value: 10 }],
                  resultText: '과학 부스를 열어 아이들에게 경이로운 실험 체험을 제공하고 수업 전문성과 보람을 드높였습니다. 교무실 평판도 훌륭하지만 체력 소진이 엄청납니다.'
                },
                {
                  id: 'choice_school_01_2',
                  text: '교실에서 부적응 학생 개별 상담 일정이 밀려 있어 부스 행사 지원을 정중히 양해 구하고 거절한다.',
                  effects: [{ stat: 'studentTrust', value: 8 }, { stat: 'colleagueSolidarity', value: -5 }, { stat: 'mental', value: 3 }],
                  resultText: '체육 축제나 과학 행사 동원 대신 교실에서 지현이와 민준이 등 위기 학생과의 밀착 상담에 집중해 학생들의 절대적인 지지와 신뢰를 얻어냈습니다.'
                }
              ],
              notificationId: target.id // [NEW] 알림 고유 ID 매핑
            };
          }

          if (eventDetails) {
            set({ activeMessengerEvent: eventDetails });
          }
        }
      },

      // [NEW] 학교 메신저 선택지 클릭 시 스탯 적용 및 피드백 출력 (교사력 1TP 소모)
      selectMessengerChoice: (_choiceId: string, effects: StatEffect[], resultText: string) => {
        const { stats, recentLogs, day, actionPoints, completedParentEvents, activeMessengerEvent } = get();
        
        // 교사력 1TP 소모 체크
        if (actionPoints < 1) {
          get().showToast('교사력(TP)이 부족하여 메신저 사건을 완료할 수 없습니다.');
          return;
        }

        // 스탯 변동 적용
        const newStats = { ...stats };
        effects.forEach((eff: StatEffect) => {
          newStats[eff.stat] = clamp(
            newStats[eff.stat] + eff.value, 
            0,
            100
          );
        });

        const logMsg = `[메신저 처리] ${resultText.slice(0, 30)}...`;
        const updatedLogs = [
          `[${day}일차] 메신저 응답 (교사력 1TP 소모): ${logMsg}`,
          ...recentLogs.slice(0, 19)
        ];

        // 학부모 민원 완료 이력 기록
        const updatedCompletedParentEvents = [...completedParentEvents];
        if (activeMessengerEvent && activeMessengerEvent.id.startsWith('parent_msg_')) {
          const idx = parseInt(activeMessengerEvent.id.replace('parent_msg_', ''), 10);
          if (!updatedCompletedParentEvents.includes(idx)) {
            updatedCompletedParentEvents.push(idx);
          }
        }

        if (activeMessengerEvent) {
          set({
            stats: syncNewStats(newStats),
            recentLogs: updatedLogs,
            actionPoints: actionPoints - 1, // 교사력 1TP 소모
            completedParentEvents: updatedCompletedParentEvents,
            activeMessengerEvent: {
              ...activeMessengerEvent,
              previewText: resultText,
              choices: [] // 선택지 배열을 지워서 확인 버튼만 띄우게 함
            }
          });
        }
        
        get().checkFailureConditions();
      },

      // 레거시 메신저 액션 백업
      generateMessengerNotificationsLegacy: () => {
        const { day, messengerNotifications } = get();
        
        // 기존 메신저 리스트 백업
        const newNotifs = [...messengerNotifications];

        // 1. 교육청 지침 공문 (35% 확률)
        if (Math.random() < 0.35) {
          const id = `msg_edu_${day}_${Math.floor(Math.random() * 1000)}`;
          newNotifs.push({
            id,
            sender: '시교육청 초등교육과',
            previewText: '디지털 교과서 도입 대비 정보 인프라 활용 실태 긴급 조사 및 취합 지시 건',
            type: 'messenger_event',
            targetId: 'messenger_evt_edu_01',
            isRead: false
          });
        }

        // 2. 학교 공식 행사 안내 (35% 확률)
        if (Math.random() < 0.35) {
          const id = `msg_school_${day}_${Math.floor(Math.random() * 1000)}`;
          newNotifs.push({
            id,
            sender: '교무부 행사기획계',
            previewText: '교내 과학 체험 창의 융합 축전 행사용 보조교사(부스 운영 전담) 긴급 자원 요청의 건',
            type: 'messenger_event',
            targetId: 'messenger_evt_school_01',
            isRead: false
          });
        }

        // 최대 6개까지만 쌓이도록 제한
        if (newNotifs.length > 6) {
          set({ messengerNotifications: newNotifs.slice(newNotifs.length - 6) });
        } else {
          set({ messengerNotifications: newNotifs });
        }
      },

      // [NEW] 학교 메신저 알림 클릭 시 액션
      triggerMessengerActionLegacy: (notificationId: string) => {
        const { messengerNotifications } = get();
        const target = messengerNotifications.find(n => n.id === notificationId);
        if (!target) return;

        // 읽음 처리
        set({
          messengerNotifications: messengerNotifications.map(n => 
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        });

        // 1. NPC 대화 연계인 경우
        if (target.type === 'npc_dialogue') {
          get().talkToNPC(target.targetId, target.targetName || '동료 교사');
        } 
        // 2. 메신저 전용 A/B 선택형 사건인 경우
        else if (target.type === 'messenger_event') {
          let eventDetails: MessengerEvent | null = null;
          
          if (target.targetId === 'messenger_evt_edu_01') {
            eventDetails = {
              id: target.targetId,
              sender: target.sender,
              previewText: '교육청 초등교육과에서 온 디지털 교과서 설문 취합 긴급 지침입니다. 오늘 4시까지 전 학년 활용 수치 통계를 보고해야 합니다. 어떻게 행동하시겠습니까?',
              choices: [
                {
                  id: 'choice_edu_01_1',
                  text: '교실 청소 지도를 자습으로 대체하고 정보실에 올라가 즉각 보고서 취합 기안을 상신한다.',
                  effects: [{ stat: 'adminPower', value: 8 }, { stat: 'burnout', value: 12 }, { stat: 'mental', value: -8 }, { stat: 'studentTrust', value: -3 }],
                  resultText: '정보 부서 결재를 안전하게 뚫고 교육청 공문 처리를 완수하여 관리자의 평판이 오르고 행정 역량을 입증했으나, 담임 교실 지도가 누설되고 몸이 극도로 피로해졌습니다.'
                },
                {
                  id: 'choice_edu_01_2',
                  text: '메신저로 부장님과 행무 실무사님께 사정을 구해 내일 오전 중으로 협조 보고를 늦춰 작성한다.',
                  effects: [{ stat: 'colleagueSolidarity', value: 10 }, { stat: 'hp', value: -3 }, { stat: 'burnout', value: -5 }],
                  resultText: '행정 부서 간 조율을 거치며 동료들과 협동적 연대를 다졌고 오늘 밤 야근을 피했습니다. 단, 공문 마감일이 밀려 행정실의 깐깐한 결재 압박은 약간 남아있습니다.'
                }
              ]
            };
          } else if (target.targetId === 'messenger_evt_school_01') {
            eventDetails = {
              id: target.targetId,
              sender: target.sender,
              previewText: '교내 과학 창의 융합 축전 행사입니다. 각 학급 부스 운영을 도울 스태프 교사가 부족하여 지원을 바라는 긴급 공고입니다. 어떻게 응대하시겠습니까?',
              choices: [
                {
                  id: 'choice_school_01_1',
                  text: '적극 지원하여 우주 과학 실험 부스를 책임지고 당당히 종일 운영한다.',
                  effects: [{ stat: 'expert', value: 10 }, { stat: 'teachingSatisfaction', value: 10 }, { stat: 'hp', value: -10 }, { stat: 'burnout', value: 10 }],
                  resultText: '과학 부스를 열어 아이들에게 경이로운 실험 체험을 제공하고 수업 전문성과 보람을 드높였습니다. 교무실 평판도 훌륭하지만 체력 소진이 엄청납니다.'
                },
                {
                  id: 'choice_school_01_2',
                  text: '교실에서 부적응 학생 개별 상담 일정이 밀려 있어 부스 행사 지원을 정중히 양해 구하고 거절한다.',
                  effects: [{ stat: 'studentTrust', value: 8 }, { stat: 'colleagueSolidarity', value: -5 }, { stat: 'mental', value: 3 }],
                  resultText: '체육 축제나 과학 행사 동원 대신 교실에서 지현이와 민준이 등 위기 학생과의 밀착 상담에 집중해 학생들의 절대적인 지지와 신뢰를 얻어냈습니다.'
                }
              ]
            };
          } else if (target.targetId === 'messenger_evt_parent_01') {
            eventDetails = {
              id: target.targetId,
              sender: target.sender,
              previewText: '학부모 민준 어머님의 개인적인 메신저 쪽지입니다. "우리 민준이가 지난번 단원평가에서 틀린 오답 문항들에 대한 오답 원인 피드백 노트를 메신저로 꼼꼼히 정리해 보내주세요."',
              choices: [
                {
                  id: 'choice_parent_01_1',
                  text: '민원 최소화와 신뢰 구축을 위해, 퇴근 후 시험지를 분석해 민준이 전용 오답 피드백 3단 노트를 전송한다.',
                  effects: [{ stat: 'parentTrust', value: 10 }, { stat: 'parentComplaint', value: -10 }, { stat: 'hp', value: -6 }, { stat: 'burnout', value: 8 }],
                  resultText: '학부모가 감동하여 감사 인사를 보내며 학부모 신뢰가 크게 쌓이고 민원 위험성이 낮아졌습니다. 대신 개인 사생활 시간의 침해로 약간의 스트레스가 유발됩니다.'
                },
                {
                  id: 'choice_parent_01_2',
                  text: '학급 전체 단원평가 공통 오답 분석지만 메신저로 전송하고, 개별 피드백은 교실 방과후 지도로 조율한다.',
                  effects: [{ stat: 'educationSoshin', value: 10 }, { stat: 'familySatisfaction', value: 10 }, { stat: 'parentTrust', value: -5 }],
                  resultText: '개인 맞춤형 초과 요구에 선을 긋고 공통 교육안을 제시하여 소신을 확립하고 워라밸을 지켰으나, 학부모의 섭섭함이 교장실 간접 불만으로 누적될 수 있습니다.'
                }
              ]
            };
          }

          if (eventDetails) {
            set({ activeMessengerEvent: eventDetails });
          }
        }
      },

      // [NEW] 학교 메신저 선택지 클릭 시 스탯 적용 및 피드백 출력
      selectMessengerChoiceLegacy: (_choiceId: string, effects: StatEffect[], resultText: string) => {
        const { stats, recentLogs, day } = get();
        
        // 스탯 변동 적용
        const newStats = { ...stats };
        effects.forEach((eff: StatEffect) => {
          newStats[eff.stat] = clamp(
            newStats[eff.stat] + eff.value, 
            0,
            100
          );
        });

        const logMsg = `[메신저 처리] ${resultText.slice(0, 30)}...`;
        const updatedLogs = [
          `[${day}일차] 메신저 응답: ${logMsg}`,
          ...recentLogs.slice(0, 19)
        ];

        // 팝업 내부 피드백 상태 반영
        const { activeMessengerEvent } = get();
        if (activeMessengerEvent) {
          set({
            stats: newStats,
            recentLogs: updatedLogs,
            activeMessengerEvent: {
              ...activeMessengerEvent,
              previewText: resultText,
              choices: [] // 선택지 배열을 지워서 확인 버튼만 띄우게 함
            }
          });
        }
        
        get().checkFailureConditions();
      },

      // [NEW] 메신저 팝업 닫기 (알림 제거 연동)
      closeMessengerEvent: () => {
        const { activeMessengerEvent, messengerNotifications } = get();
        if (activeMessengerEvent && activeMessengerEvent.notificationId) {
          set({
            messengerNotifications: messengerNotifications.filter(
              n => n.id !== activeMessengerEvent.notificationId
            )
          });
        }
        set({ activeMessengerEvent: null });
      },

      // [NEW] 매일 아침 스마트폰 전화/문자 수신 (학부모 민원 50선 + 교직원 사적 20선 vs 긍정 힐링 150선)
      generatePhoneAndTextNotifications: () => {
        const { day, completedParentEvents, completedColleaguePrivateEvents, completedPositiveEvents, phoneAndTextNotifications, stats } = get();
        const newNotifs: MessengerNotification[] = [];

        // 매일 아침 75% 확률로 스마트폰 피드 알림 생성
        if (Math.random() < 0.75) {
          // 긍정 힐링 vs 부정 딜레마 결정. 채널 통일 목표 비율(위기 시 상향) 적용.
          const isPositive = Math.random() < getTargetPositiveRatio(stats, day);

          if (isPositive) {
            // [긍정 힐링 150선 생성]
            let candidates = Array.from({ length: 150 }, (_, i) => i).filter(i => !completedPositiveEvents.includes(i));
            if (candidates.length === 0) {
              candidates = Array.from({ length: 150 }, (_, i) => i);
              set({ completedPositiveEvents: [] });
            }
            const randomIdx = candidates[Math.floor(Math.random() * candidates.length)];
            const posEvt = positiveEvents[randomIdx];
            const type = Math.random() < 0.5 ? 'phone' : 'text';

            newNotifs.push({
              id: `phone_positive_${day}_${randomIdx}`,
              sender: posEvt.sender,
              previewText: type === 'phone' 
                ? `☎️ [전화] ${posEvt.sender} 님이 전화를 걸었습니다.` 
                : `💬 [문자] ${posEvt.previewText.slice(0, 35)}...`,
              type: type,
              targetId: `positive_phone_text_${randomIdx}`,
              isRead: false
            });
          } else {
            // [부정 딜레마 생성 - 학부모 민원 50선 + 교직원 사적 20선]
            const isParentComplaint = Math.random() < 0.7; // 부정 딜레마 안에서 70% 확률로 학부모 민원

            if (isParentComplaint) {
              const complaintsCount = parentMessengerEvents.length;
              let candidates = Array.from({ length: complaintsCount }, (_, i) => i).filter(i => !completedParentEvents.includes(i));
              if (candidates.length === 0) {
                candidates = Array.from({ length: complaintsCount }, (_, i) => i);
                set({ completedParentEvents: [] });
              }
              const randomIdx = candidates[Math.floor(Math.random() * candidates.length)];
              const parentEvt = parentMessengerEvents[randomIdx];
              const type = Math.random() < 0.5 ? 'phone' : 'text';

              newNotifs.push({
                id: `phone_parent_${day}_${randomIdx}`,
                sender: parentEvt.sender,
                previewText: type === 'phone' 
                  ? `☎️ [전화] ${parentEvt.sender} 님이 민원 전화를 걸었습니다.` 
                  : `💬 [문자] ${parentEvt.previewText.slice(0, 35)}...`,
                type: type,
                targetId: `parent_phone_text_${randomIdx}`,
                isRead: false
              });
            } else {
              // 교직원 사적 요청 20선
              let candidates = Array.from({ length: 20 }, (_, i) => i).filter(i => !completedColleaguePrivateEvents.includes(i));
              if (candidates.length === 0) {
                candidates = Array.from({ length: 20 }, (_, i) => i);
                set({ completedColleaguePrivateEvents: [] });
              }
              const randomIdx = candidates[Math.floor(Math.random() * candidates.length)];
              const colleagueEvt = colleaguePrivateEvents[randomIdx];
              const type = Math.random() < 0.5 ? 'phone' : 'text';

              newNotifs.push({
                id: `phone_colleague_${day}_${randomIdx}`,
                sender: colleagueEvt.sender,
                previewText: type === 'phone' 
                  ? `☎️ [전화] ${colleagueEvt.sender} 님이 사적인 요청 전화를 걸었습니다.` 
                  : `💬 [문자] ${colleagueEvt.previewText.slice(0, 35)}...`,
                type: type,
                targetId: `colleague_phone_text_${randomIdx}`,
                isRead: false
              });
            }
          }
        }

        // 스마트폰 알림은 누적되며 최대 6개까지만 쌓이도록 제한
        const combined = [...phoneAndTextNotifications, ...newNotifs];
        if (combined.length > 6) {
          set({ phoneAndTextNotifications: combined.slice(combined.length - 6) });
        } else {
          set({ phoneAndTextNotifications: combined });
        }
      },

      // [NEW] 스마트폰 알림 클릭 시 액션 (교사력 1TP 소모 체크 - 긍정 격려 이벤트는 프리패스)
      triggerPhoneAndTextAction: (notificationId: string) => {
        const { phoneAndTextNotifications, actionPoints } = get();
        const target = phoneAndTextNotifications.find(n => n.id === notificationId);
        if (!target) return;

        // 부정 딜레마 알림(parent 또는 colleague) 처리를 시작하려면 교사력이 최소 1이 필요합니다.
        const isPositive = target.targetId.startsWith('positive_phone_text_');
        if (!isPositive && actionPoints < 1) {
          get().showToast('교사력(TP)이 부족하여 스마트폰 민원을 처리할 수 없습니다. 다음 날로 넘어가 교사력을 회복하세요.');
          return;
        }

        // 읽음 처리
        set({
          phoneAndTextNotifications: phoneAndTextNotifications.map(n => 
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        });

        let eventDetails: MessengerEvent | null = null;

        if (target.targetId.startsWith('parent_phone_text_')) {
          const idx = parseInt(target.targetId.replace('parent_phone_text_', ''), 10);
          const parentEvt = parentMessengerEvents[idx];
          if (parentEvt) {
            eventDetails = {
              id: parentEvt.id,
              sender: `${parentEvt.sender} (${target.type === 'phone' ? '전화 민원' : '문자 답장'})`,
              previewText: parentEvt.previewText,
              choices: parentEvt.choices.map(c => ({
                id: c.id,
                text: c.text,
                effects: c.effects,
                resultText: c.resultText
              })),
              notificationId: target.id // [NEW] 알림 고유 ID 매핑
            };
          }
        } else if (target.targetId.startsWith('colleague_phone_text_')) {
          const idx = parseInt(target.targetId.replace('colleague_phone_text_', ''), 10);
          const colleagueEvt = colleaguePrivateEvents[idx];
          if (colleagueEvt) {
            eventDetails = {
              id: colleagueEvt.id,
              sender: `${colleagueEvt.sender} (${target.type === 'phone' ? '사적 통화' : '사적 문자'})`,
              previewText: colleagueEvt.previewText,
              choices: colleagueEvt.choices.map(c => ({
                id: c.id,
                text: c.text,
                effects: c.effects,
                resultText: c.resultText
              })),
              notificationId: target.id // [NEW] 알림 고유 ID 매핑
            };
          }
        } else if (target.targetId.startsWith('positive_phone_text_')) {
          const idx = parseInt(target.targetId.replace('positive_phone_text_', ''), 10);
          const posEvt = positiveEvents[idx];
          if (posEvt) {
            eventDetails = {
              id: posEvt.id,
              sender: `${posEvt.sender} (${target.type === 'phone' ? '격려 전화' : '격려 문자'})`,
              previewText: posEvt.previewText,
              choices: posEvt.choices.map(c => ({
                id: c.id,
                text: c.text,
                effects: c.effects,
                resultText: c.resultText
              })),
              notificationId: target.id // [NEW] 알림 고유 ID 매핑
            };
          }
        }

        if (eventDetails) {
          set({ activePhoneAndTextEvent: eventDetails });
        }
      },

      // [NEW] 스마트폰 선택지 클릭 시 스탯 적용 및 피드백 출력 (교사력 소모/회복 연계)
      selectPhoneAndTextChoice: (_choiceId: string, effects: StatEffect[], resultText: string) => {
        const { stats, recentLogs, day, actionPoints, maxActionPoints, completedParentEvents, completedColleaguePrivateEvents, completedPositiveEvents, activePhoneAndTextEvent } = get();
        
        if (!activePhoneAndTextEvent) return;

        // 긍정 격려 이벤트인지 체크
        const isPositive = activePhoneAndTextEvent.id.startsWith('positive_parent_') || 
                           activePhoneAndTextEvent.id.startsWith('positive_colleague_') || 
                           activePhoneAndTextEvent.id.startsWith('positive_student_');

        // 부정 딜레마인데 교사력이 없으면 진행 불가
        if (!isPositive && actionPoints < 1) {
          get().showToast('교사력(TP)이 부족하여 완료할 수 없습니다.');
          return;
        }

        // 스탯 변동 적용
        const newStats = { ...stats };
        effects.forEach((eff: StatEffect) => {
          newStats[eff.stat] = clamp(
            newStats[eff.stat] + eff.value, 
            0,
            100
          );
        });

        // 긍정 이벤트일 때 15% 확률로 힐링 커피/차 기프티콘 보너스 (교사력 1TP 충전) [한글 주석 포함]
        let apChange = -1;
        let logActionType = '스마트폰 대응';
        let apMsg = '교사력 1TP 소모';
        let finalResultText = resultText;

        if (isPositive) {
          logActionType = '스마트폰 격려';
          // 15% 확률로 TP 1 회복 보너스 당첨
          const isTpBonus = Math.random() < 0.15;
          if (isTpBonus) {
            apChange = 1;
            apMsg = '선물 힐링으로 교사력 1TP 회복!';
            finalResultText = `${resultText}\n\n🎁 [힐링 보너스] 학부모 또는 동료 교사의 따뜻한 감사 선물(기프티콘/매실차 등) 덕분에 힘이 납니다! (교사력(TP) +1 회복!)`;
          } else {
            apChange = 0;
            apMsg = '교사력 소모 없음';
          }
        }

        const logMsg = `[폰 연락 처리] ${finalResultText.slice(0, 30)}...`;
        const updatedLogs = [
          `[${day}일차] ${logActionType} (${apMsg}): ${logMsg}`,
          ...recentLogs.slice(0, 19)
        ];

        // 완료 목록 기록
        const updatedCompletedParentEvents = [...completedParentEvents];
        const updatedCompletedColleaguePrivateEvents = [...completedColleaguePrivateEvents];
        const updatedCompletedPositiveEvents = [...completedPositiveEvents];

        if (activePhoneAndTextEvent.id.startsWith('parent_msg_')) {
          const idx = parseInt(activePhoneAndTextEvent.id.replace('parent_msg_', ''), 10) - 1;
          if (!updatedCompletedParentEvents.includes(idx)) {
            updatedCompletedParentEvents.push(idx);
          }
        } else if (activePhoneAndTextEvent.id.startsWith('colleague_private_')) {
          const idx = parseInt(activePhoneAndTextEvent.id.replace('colleague_private_', ''), 10) - 1;
          if (!updatedCompletedColleaguePrivateEvents.includes(idx)) {
            updatedCompletedColleaguePrivateEvents.push(idx);
          }
        } else if (isPositive) {
          const idx = positiveEvents.findIndex(e => e.id === activePhoneAndTextEvent.id);
          if (idx !== -1 && !updatedCompletedPositiveEvents.includes(idx)) {
            updatedCompletedPositiveEvents.push(idx);
          }
        }

        set({
          stats: syncNewStats(newStats),
          recentLogs: updatedLogs,
          actionPoints: clamp(actionPoints + apChange, 0, maxActionPoints),
          completedParentEvents: updatedCompletedParentEvents,
          completedColleaguePrivateEvents: updatedCompletedColleaguePrivateEvents,
          completedPositiveEvents: updatedCompletedPositiveEvents,
          activePhoneAndTextEvent: {
            ...activePhoneAndTextEvent,
            previewText: finalResultText,
            choices: [] // 선택지 배열을 지워서 확인 버튼만 띄우게 함
          }
        });
        
        get().checkFailureConditions();
      },

      // [NEW] 스마트폰 팝업 닫기 (알림 제거 연동)
      closePhoneAndTextEvent: () => {
        const { activePhoneAndTextEvent, phoneAndTextNotifications } = get();
        if (activePhoneAndTextEvent && activePhoneAndTextEvent.notificationId) {
          set({
            phoneAndTextNotifications: phoneAndTextNotifications.filter(
              n => n.id !== activePhoneAndTextEvent.notificationId
            )
          });
        }
        set({ activePhoneAndTextEvent: null });
      },

      // [NEW] 퇴근 대신 야근하기 선택 시 처리
      overtimeWork: () => {
        const {
          day,
          timeOfDay,
          maxActionPoints,
          tasks,
          stats,
          playerInfo
        } = get();

        // 정산 시간대(summary)가 아니면 무시
        if (timeOfDay !== 'summary') return;

        // 1) 야근에 따른 직접적인 스탯 변동
        // 행정 실무 능력 +15, 전문성 +10, 관리자 신뢰도 +5 상승
        // 번아웃 +15, 건강 -15, 멘탈 -10, 가정만족도 -15 차감
        const overtimeStats = { ...stats };
        overtimeStats.burnout = clamp(overtimeStats.burnout + 15);
        overtimeStats.hp = clamp(overtimeStats.hp - 15);
        overtimeStats.mental = clamp(overtimeStats.mental - 10);
        overtimeStats.familySatisfaction = clamp(overtimeStats.familySatisfaction - 15);
        overtimeStats.adminPower = clamp(overtimeStats.adminPower + 15);
        overtimeStats.expert = clamp(overtimeStats.expert + 10);
        overtimeStats.adminTrust = clamp(overtimeStats.adminTrust + 5);

        const nextDay = day + 1;

        if (nextDay > 30) {
          // 30일 도달로 게임 종료 시, 야근 스탯 업데이트 및 엔딩 조건 판정
          set({ stats: syncNewStats(overtimeStats) });
          get().checkEndingConditions();
        } else {
          // 미해결 업무 지연 패널티 정산
          const { messengerNotifications, phoneAndTextNotifications } = get();
          const overdueTasks = tasks.filter(t => !t.isCompleted && t.deadlineDay < nextDay);
          const penaltyMessages: string[] = [];

          // [WO-13] 기본 일일 소모 — progressTime의 정산 로직과 동일하게 야근한 날도 하루의 기본 소모는 적용된다.
          const isWeekend = day % 7 === 6 || day % 7 === 0;
          if (!isWeekend) {
            const attrition = playerInfo?.difficulty === 'warm'
              ? { hp: 0, burnout: 0 }
              : playerInfo?.difficulty === 'hard'
              ? { hp: 5, burnout: 3 }
              : { hp: 3, burnout: 2 };
            if (attrition.hp > 0 || attrition.burnout > 0) {
              overtimeStats.hp = clamp(overtimeStats.hp - attrition.hp);
              overtimeStats.burnout = clamp(overtimeStats.burnout + attrition.burnout);
              penaltyMessages.push(`[일일 소모] 하루 종일 이어진 수업과 잡무로 건강 -${attrition.hp}, 번아웃 +${attrition.burnout} 누적되었습니다.`);
            }
          }

          // 2) 미결 업무 방치 패널티 정산 [WO-06] — progressTime의 정산 로직과 동일하게 감쇠·자동 종결 적용
          const autoResolvedTaskIds: string[] = [];
          overdueTasks.forEach(t => {
            const daysOverdue = nextDay - t.deadlineDay;
            if (daysOverdue >= 3) {
              overtimeStats.adminTrust = clamp(overtimeStats.adminTrust - 10);
              overtimeStats.reputation = clamp(overtimeStats.reputation - 5);
              autoResolvedTaskIds.push(t.id);
              penaltyMessages.push(
                `[업무 강제 종결] "${t.title}" 업무를 3일째 방치해 교감선생님이 대신 처리했습니다. 관리자신뢰 -10, 평판 -5 (사유: 반복된 업무 방치로 인한 신뢰 실추)`
              );
            } else {
              const scale = daysOverdue >= 2 ? 0.25 : 1;
              const dAdminPower = Math.round(20 * scale);
              const dExpert = Math.round(15 * scale);
              const dAdminTrust = Math.round(10 * scale);
              const dReputation = Math.round(8 * scale);
              const dBurnout = Math.round(10 * scale);
              overtimeStats.adminPower = clamp(overtimeStats.adminPower - dAdminPower);
              overtimeStats.expert = clamp(overtimeStats.expert - dExpert);
              overtimeStats.adminTrust = clamp(overtimeStats.adminTrust - dAdminTrust);
              overtimeStats.reputation = clamp(overtimeStats.reputation - dReputation);
              overtimeStats.burnout = clamp(overtimeStats.burnout + dBurnout);

              penaltyMessages.push(
                `[업무 미결 패널티] "${t.title}" 업무 마감 기한 초과 방치로 인해 행정역량 -${dAdminPower}, 전문성 -${dExpert}, 관리자신뢰 -${dAdminTrust} 하락 (사유: 주요 공무 연체에 따른 실무 태만)`
              );
            }
          });

          // 3) 미확인 학교 메신저 방치 패널티 정산
          const unreadMessengers = messengerNotifications.filter(m => !m.isRead);
          unreadMessengers.forEach(m => {
            overtimeStats.colleagueRelation = clamp(overtimeStats.colleagueRelation - 10);
            overtimeStats.adminPower = clamp(overtimeStats.adminPower - 10);
            overtimeStats.reputation = clamp(overtimeStats.reputation - 5);

            penaltyMessages.push(
              `[메신저 방치 패널티] "${m.sender}"의 메신저 요청 무시로 인해 동료관계 -10, 행정역량 -10, 평판 -5 하락 (사유: 교내 공적 소통 방치 및 협조 거부)`
            );
          });

          // 4) 미확인 스마트폰 연락 방치 패널티 정산
          const unreadPhones = phoneAndTextNotifications.filter(p => !p.isRead);
          unreadPhones.forEach(p => {
            if (p.id.startsWith('phone_positive_')) {
              // [WO-07] 감사 전화는 벌점 없이 당일 만료(읽음 처리)만 — 아래 최종 set()에서 처리.
            } else if (p.id.startsWith('phone_parent_')) {
              overtimeStats.parentTrust = clamp(overtimeStats.parentTrust - 10);
              overtimeStats.studentTrust = clamp(overtimeStats.studentTrust - 5);
              overtimeStats.parentComplaint = clamp(overtimeStats.parentComplaint + 12);

              penaltyMessages.push(
                `[민원 방치 패널티] 학부모 전화 민원 무시로 학부모 민원 수치 +12, 학부모신뢰 -10, 학생신뢰 -5 하락 (사유: 학부모와의 소통 거부로 인한 불만 가중)`
              );
            } else if (p.id.startsWith('phone_colleague_')) {
              overtimeStats.colleagueRelation = clamp(overtimeStats.colleagueRelation - 10);
              overtimeStats.reputation = clamp(overtimeStats.reputation - 5);

              penaltyMessages.push(
                `[교직원 요청 방치 패널티] 동료 교직원의 사적인 요청 연락 무시로 인해 동료관계 -10, 평판 -5 하락 (사유: 교직원 친목 및 협조 거부)`
              );
            }
          });

          // 5) 매일 아침 교사력(TP) 갱신 (야근 시 기본 TP에 +1 추가 보너스)
          let dailyTP = maxActionPoints + 1;
          if (overtimeStats.hp < 30) dailyTP -= 1;
          if (overtimeStats.burnout > 80) dailyTP -= 1;
          dailyTP = Math.max(1, dailyTP);

          // 6) 5대 핵심 스탯 동기화
          const syncedStats = syncNewStats(overtimeStats);

          // 7) 신규 업무 업데이트 (일정 날짜 고정 업무 + 주차별 램프 확률로 랜덤 행정 업무 추가) [WO-06][WO-14]
          // 3일째 자동 종결된 업무는 완료 처리해 다음 날부터 연체 목록에서 빠지게 한다.
          let updatedTasks = tasks.map(t => autoResolvedTaskIds.includes(t.id) ? { ...t, isCompleted: true } : t);

          const spawnWeek = getWeekNumber(nextDay);
          const taskSpawnChance = 0.30 + spawnWeek * 0.08;
          const taskSpawnMax = spawnWeek >= 4 ? 3 : 2;
          if (Math.random() < taskSpawnChance) {
            const taskCount = Math.floor(Math.random() * taskSpawnMax) + 1;
            for (let c = 0; c < taskCount; c++) {
              const randomTemplate = pickBalancedTaskTemplate(syncedStats, nextDay);
              // 중복 가드
              if (!updatedTasks.some(t => !t.isCompleted && t.title === randomTemplate.title)) {
                updatedTasks.push({
                  id: `task_dynamic_${nextDay}_${Math.random().toString(36).substring(2, 7)}`,
                  title: randomTemplate.title,
                  category: randomTemplate.category,
                  urgency: randomTemplate.urgency,
                  importance: randomTemplate.importance,
                  estimatedTime: randomTemplate.estimatedTime,
                  stressCost: randomTemplate.stressCost,
                  reputationReward: randomTemplate.reputationReward,
                  deadlineDay: nextDay + randomTemplate.deadlineLimit,
                  canDelegate: randomTemplate.canDelegate,
                  canNegotiate: randomTemplate.canNegotiate !== undefined ? randomTemplate.canNegotiate : true,
                  isCompleted: false
                });
              }
            }
          }

          if (nextDay === 10) {
            updatedTasks.push({
              id: 'task_04',
              title: '학급 교육공개수업 세부 지도안 설계',
              category: 'teaching',
              urgency: 4,
              importance: 5,
              estimatedTime: 2,
              stressCost: 20,
              reputationReward: 15,
              deadlineDay: 16,
              canDelegate: false,
              canNegotiate: true,
              isCompleted: false
            });
          }
          if (nextDay === 20) {
            updatedTasks.push({
              id: 'task_05',
              title: '전교 학교폭력 예방 교육 주간 행사 보고',
              category: 'event',
              urgency: 5,
              importance: 3,
              estimatedTime: 2,
              stressCost: 15,
              reputationReward: 12,
              deadlineDay: 25,
              canDelegate: true,
              canNegotiate: false,
              isCompleted: false
            });
          }

          // 다음 날이 주말(토, 일)인지 확인하여 주말 힐링 이벤트 설정
          const isNextDayWeekend = nextDay % 7 === 6 || nextDay % 7 === 0;
          const nextEvent = isNextDayWeekend ? getWeekendHealingEvent(nextDay, playerInfo?.familyState) : null;

          // [WO-14] 마지막 주(26~30일)에는 학기말 정산이 다가온다는 것을 서사적으로 알려 압박을 체감시킨다.
          if (nextDay >= 26) {
            penaltyMessages.push(`[학기말 정산 D-${30 - nextDay}] 한 학기의 끝이 다가오고 있습니다. 남은 기록과 평가가 마무리될 시간입니다.`);
          }

          // 상태 커밋
          set({
            day: nextDay,
            timeOfDay: 'morning',
            stats: syncedStats,
            actionPoints: dailyTP,
            currentLocation: null,
            currentNpcDialogue: null,
            currentEvent: nextEvent, // [MODIFIED] 주말인 경우 힐링 이벤트 강제 세팅
            selectedChoice: null,
            eventResultText: null,
            dayEffectsTriggered: [
              `[야근 실시] 어젯밤 늦게까지 교무실에 남아 행정 업무와 수업 준비에 매진했습니다. (행정실무 +15, 전문성 +10, 관리자신뢰 +5 / 건강 -15, 멘탈 -10, 가정만족도 -15, 번아웃 +15, 오늘 교사력 +1 보너스)`,
              ...penaltyMessages
            ],
            completedNpcDialoguesToday: [],
            dailyActionCounts: {}, // [WO-12] 장소 행동 반복 체감 카운트를 매일 아침 리셋
            tasks: updatedTasks,
            activePhoneAndTextEvent: null,
            // [WO-07] 벌점 없이 당일 만료 — 미확인 감사 전화를 읽음 처리해 다음 날로 이월되지 않게 한다.
            phoneAndTextNotifications: phoneAndTextNotifications.map(p =>
              p.id.startsWith('phone_positive_') && !p.isRead ? { ...p, isRead: true } : p
            )
          });

          // 부가 동작 처리
          get().shuffleNpcPlacements();
          get().generateMessengerNotifications();
          get().generatePhoneAndTextNotifications();
          get().checkFailureConditions();
        }
      },

      // [NEW] BGM 볼륨 세팅 및 동적 재생/멈춤 제어
      setBgmVolume: (volume: number) => {
        const val = Math.max(0, Math.min(5, volume));
        set({ bgmVolume: val });

        if (typeof window !== 'undefined') {
          if (!globalBgm) {
            globalBgm = new Audio('/Chalk_and_Coffee.mp4');
            globalBgm.loop = true;
          }

          globalBgm.volume = mapVolumeStepToValue(val);

          if (val > 0) {
            globalBgm.play().catch(err => {
              console.log('Autoplay blocked. Waiting for user interaction.', err);
            });
          } else {
            globalBgm.pause();
          }
        }
      }
    }),
    {
      name: 'teacher-maker-save-v1', // 로컬스토리지 저장 키
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== 'undefined') {
          // 저장된 BGM 볼륨 수치를 Audio 객체 볼륨과 안전하게 연동 동기화합니다.
          const savedVol = state.bgmVolume !== undefined ? state.bgmVolume : 3;
          if (!globalBgm) {
            globalBgm = new Audio('/Chalk_and_Coffee.mp4');
            globalBgm.loop = true;
          }
          globalBgm.volume = mapVolumeStepToValue(savedVol);
          if (savedVol > 0) {
            // 브라우저 최초 클릭 시 재생될 수 있으므로 예외는 안전하게 삼킵니다.
            globalBgm.play().catch(() => {});
          } else {
            globalBgm.pause();
          }
        }
      }
    }
  )
);
