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
  EventValence
} from '@/game/types';
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

// 채널 통일 목표 긍정 비율. 위기 상태(멘탈 급락/번아웃 급증)에는 완화를 위해 긍정 비중을 추가로 끌어올린다.
const getTargetPositiveRatio = (stats: Stats): number => {
  const inCrisis = stats.mental < 30 || stats.burnout > 80;
  return inCrisis ? 0.55 : 0.35;
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

// 긍정 요소 등장 확률을 채널 통일 목표 비율(위기 시 상향)로 고정해 후보를 고른다.
const pickBalancedEvent = (
  candidates: GameEvent[],
  stats: Stats
): GameEvent | null => {
  if (candidates.length === 0) return null;
  const weighted = applyFixedPositiveRatio(
    candidates.map(evt => ({ item: evt, valence: getEventValence(evt), baseWeight: evt.weight })),
    getTargetPositiveRatio(stats)
  );
  return pickWeighted(weighted);
};

// 정서 원장에 결과를 기록(최근 12건 유지)하는 순수 헬퍼. 통계/디버깅용으로 유지.
const pushValence = (log: EventValence[], v: EventValence): EventValence[] =>
  [v, ...log].slice(0, 12);

// NPC 대화 후보 인덱스 중 긍정 요소 등장 확률을 채널 통일 목표 비율(위기 시 상향)로 고정해 하나를 고른다.
const pickBalancedDialogueIndex = (
  candidateIdxs: number[],
  events: { valence: EventValence }[],
  stats: Stats
): number => {
  if (candidateIdxs.length === 0) return 0;
  const weighted = applyFixedPositiveRatio(
    candidateIdxs.map(i => ({ item: i, valence: events[i]?.valence ?? 'neutral', baseWeight: 10 })),
    getTargetPositiveRatio(stats)
  );
  const picked = pickWeighted(weighted);
  return picked !== null ? picked : candidateIdxs[candidateIdxs.length - 1];
};

// 업무 풀 추첨에도 동일 목표 비율을 적용한다. stressCost<=6(보람/경부담 업무)을 긍정 신호로 재사용.
const pickBalancedTaskTemplate = (
  stats: Stats
): typeof taskTemplates[number] => {
  const weighted = applyFixedPositiveRatio(
    taskTemplates.map(t => ({
      item: t,
      valence: (t.stressCost <= 6 ? 'positive' : 'negative') as EventValence,
      baseWeight: 1
    })),
    getTargetPositiveRatio(stats)
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

// 특정 날짜 범위 및 조건에 맞는 이벤트 추첨 헬퍼
const getEventForTime = (
  day: number,
  time: TimeOfDay,
  hiddenFlags: string[],
  history: string[],
  stats: Stats,
  students: Student[],
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

  // 5, 10, 15, 20, 25일차 저녁(evening)에는 기획된 자녀/주말 이벤트를 강제로 반환 [NEW]
  if (time === 'evening' && [5, 10, 15, 20, 25].includes(day)) {
    const targetSuffix = String(day / 5).padStart(2, '0'); // 5->01, 10->02, 15->03, 20->04, 25->05
    const isParent = familyState === 'parent';
    const targetEventId = isParent ? `evt_child_event_${targetSuffix}` : `evt_single_weekend_${targetSuffix}`;
    const targetEvt = gameEvents.find(evt => evt.id === targetEventId);
    if (targetEvt) {
      return targetEvt;
    }
  }

  const matchesBase = (evt: GameEvent, applyHistory: boolean): boolean => {
    // 1. 카테고리 매칭
    if (!category.includes(evt.category)) return false;
    // 2. 날짜 범위 확인
    const [start, end] = evt.dayRange;
    if (day < start || day > end) return false;
    // 3. 중복 방지 (이미 실행된 이벤트 제외)
    if (applyHistory && history.includes(evt.id)) return false;
    // 4. 선결 요건 검사
    if (evt.prerequisites && evt.prerequisites.length > 0) {
      const hasAll = evt.prerequisites.every(flag => effectiveFlags.includes(flag));
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

  // 채널 통일 목표 비율(위기 시 상향)로 가중 랜덤 추출
  return pickBalancedEvent(candidates, stats);
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

// 담임 학급 배정 학생들과의 특성/고민 기반 멀티턴 대화 시나리오 동적 생성 헬퍼
const generateStudentDialogue = (student: Student): DialogueStep[] => {
  const trait = student.traits[0] || '조용하고 평범함';
  const issue = student.currentIssues[0] || '학급 적응';
  
  return [
    {
      speaker: student.name,
      text: `"선생님... 실은 요즘 학교생활이 조금 힘들어요. 제가 '${trait}' 성향이라 조심스러워서 그런데... 특히 '${issue}' 문제 때문에 자꾸 위축되고 고민이 생겨요." ${student.name} 학생이 손가락을 꼼지락거리며 털어놓습니다.`,
      choices: [
        {
          text: `“그랬구나. 선생님이 언제나 네 편이 되어 귀 기울여 줄게. 같이 고민해 보자.” (따뜻한 공감 지지)`,
          nextStepIndex: 1,
          effects: [{ stat: 'studentTrust', value: 8 }, { stat: 'mental', value: -3 }, { stat: 'hp', value: -1 }],
          resultText: `"정말요...? 선생님이 제 편이라고 해주셔서 마음속의 무거운 응어리가 녹아내리는 기분이에요. 말씀해주신 대로 해 볼게요!"`
        },
        {
          text: `“문제의 원인을 이성적으로 분석하고 해결 행동 계획을 3가지 세워서 실천해볼까?” (이성적 해법 피드백)`,
          nextStepIndex: 2,
          effects: [{ stat: 'expert', value: 7 }, { stat: 'studentTrust', value: 2 }, { stat: 'mental', value: 1 }],
          resultText: `"아... 뼈를 때리는 따끔한 말씀이네요. 맞아요, 고민만 할 게 아니라 구체적인 행동을 고쳐봐야겠어요. 오늘 당장 시작할게요!"`
        }
      ]
    },
    {
      speaker: student.name,
      text: `선생님의 지지를 받아 ${student.name} 학생의 눈가에 안도감이 돕니다. 학생과의 유대와 신뢰가 비약적으로 증가했습니다.`
    },
    {
      speaker: student.name,
      text: `${student.name} 학생은 다소 쓰라리지만 이성적인 현실 조언을 가슴에 새기고, 문제 개선을 위한 계획표 작성을 시작합니다.`
    }
  ];
};

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
      
      currentEvent: null,
      selectedChoice: null,
      eventResultText: null,
      dayEffectsTriggered: [],
      
      actionPoints: 5,
      maxActionPoints: 5,
      
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
                eff.stat === 'burnout' ? 0 : 0, 
                100
              );
            });

            // 지연 효과 큐 처리
            const currentDelayed = get().delayedEffects;
            const newDelayedEffects = [...currentDelayed];
            appliedDelayed.forEach(delayed => {
              newDelayedEffects.push({
                ...delayed,
                dayTrigger: clamp(day + delayed.dayTrigger, 1, 30)
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

            set({
              stats: syncNewStats(newStats),
              delayedEffects: newDelayedEffects,
              hiddenFlags: newFlags,
              eventResultText: resultText,
              recentLogs: updatedLogs,
              students: updatedStudents,
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
              eff.stat === 'burnout' ? 0 : 0, 
              100
            );
          });

          const newDelayedEffects = [...delayedEffects];
          if (choice.delayedEffects && choice.delayedEffects.length > 0) {
            choice.delayedEffects.forEach(delayed => {
              newDelayedEffects.push({
                ...delayed,
                dayTrigger: clamp(day + delayed.dayTrigger, 1, 30)
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

          set({
            stats: syncNewStats(newStats),
            delayedEffects: newDelayedEffects,
            hiddenFlags: newFlags,
            selectedChoice: choice,
            eventResultText: choice.resultText,
            recentLogs: updatedLogs,
            students: updatedStudents,
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
          students
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
          const nextEvent = getEventForTime(day, 'evening', hiddenFlags, recentLogs, stats, students, playerInfo?.familyState);
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

            // [NEW] 칼퇴(일반 퇴근) 시 힐링 보너스 (평일인 경우만 적용)
            const isWeekend = day % 7 === 6 || day % 7 === 0;
            if (!isWeekend) {
              penaltyStats.hp = clamp(penaltyStats.hp + 5);
              penaltyStats.mental = clamp(penaltyStats.mental + 5);
              penaltyStats.burnout = clamp(penaltyStats.burnout - 5);
              penaltyMessages.push(`[정시 퇴근 보너스] 야근 없이 정시 퇴근하여 건강 +5, 멘탈 +5 회복 및 번아웃 -5 감소했습니다.`);
            }

            // 1) 미결 업무 방치 패널티 정산
            overdueTasks.forEach(t => {
              // 행정역량 -20, 전문성 -15, 관리자신뢰 -10 차감 -> 이에 따라 업무능력 및 수업연구능력 하락 연동
              penaltyStats.adminPower = clamp(penaltyStats.adminPower - 20);
              penaltyStats.expert = clamp(penaltyStats.expert - 15);
              penaltyStats.adminTrust = clamp(penaltyStats.adminTrust - 10);
              penaltyStats.reputation = clamp(penaltyStats.reputation - 8);
              penaltyStats.burnout = clamp(penaltyStats.burnout + 10);

              penaltyMessages.push(
                `[업무 미결 패널티] "${t.title}" 업무 마감 기한 초과 방치로 인해 행정역량 -20, 전문성 -15, 관리자신뢰 -10 하락 (사유: 주요 공무 연체에 따른 실무 태만)`
              );
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
                // 긍정적 감사 연락 무응답 -> 동료관계 -5, 가정만족 -5, 학생신뢰 -5 차감
                penaltyStats.colleagueRelation = clamp(penaltyStats.colleagueRelation - 5);
                penaltyStats.familySatisfaction = clamp(penaltyStats.familySatisfaction - 5);
                penaltyStats.studentTrust = clamp(penaltyStats.studentTrust - 5);

                penaltyMessages.push(
                  `[감사 무응답 패널티] 제자/학부모의 격려 연락 무응답으로 동료관계 -5, 가정만족 -5, 학생신뢰 -5 하락 (사유: 긍정 힐링 소통 기회 방치)`
                );
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

            // 업무 기한 리셋/업데이트 (일정 날짜에 새 업무 할당 + 45% 확률로 랜덤 행정 업무 1~2개 추가)
            let updatedTasks = [...tasks];
            
            if (Math.random() < 0.45) {
              const taskCount = Math.floor(Math.random() * 2) + 1; // 1~2개
              for (let c = 0; c < taskCount; c++) {
                const randomTemplate = pickBalancedTaskTemplate(syncedStats);
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
              tasks: updatedTasks,
              activePhoneAndTextEvent: null
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
        const { tasks, stats } = get();
        const target = tasks.find(t => t.id === taskId);
        
        if (!target || target.isCompleted || !target.canDelegate) return;
        if (stats.colleagueRelation < 60) {
          get().showToast('동료 교사와의 관계 점수(60 이상 필요)가 낮아 업무 협조를 위임할 수 없습니다.');
          return;
        }

        const newStats = { ...stats };
        newStats.colleagueRelation = clamp(newStats.colleagueRelation - 15); // 관계 점수 일부 소모
        newStats.burnout = clamp(newStats.burnout + 2); // 대신 스트레스는 거의 없음
        
        set({
          tasks: tasks.map(t => t.id === taskId ? { ...t, isCompleted: true } : t),
          stats: newStats
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
              eff.stat === 'burnout' ? 0 : 0, 
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

        const { stats, hiddenFlags } = get();
        let finalEnding = 'ending_general'; // 기본 디폴트 평교사 엔딩

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
        else if (
          stats.careerPoint >= 40 &&
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
        const { currentLocation, day, hiddenFlags, recentLogs, actionPoints, stats, students } = get();
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

        // 해당 카테고리와 날짜에 맞는 후보군 필터링
        const candidates = gameEvents.filter(evt => {
          if (!categories.includes(evt.category)) return false;
          const [start, end] = evt.dayRange;
          if (day < start || day > end) return false;
          if (recentLogs.some(log => log.includes(evt.title))) return false;
          if (evt.prerequisites && evt.prerequisites.length > 0) {
            const hasAll = evt.prerequisites.every(flag => effectiveFlags.includes(flag));
            if (!hasAll) return false;
          }
          return true;
        });

        if (candidates.length === 0) {
          get().showToast('더 이상 이 장소에서 탐색할 수 있는 새로운 사건이 없습니다.');
          return;
        }

        // 채널 통일 목표 비율(위기 시 상향)로 가중 랜덤 선택
        const selectedEvt = pickBalancedEvent(candidates, stats) ?? candidates[0];

        set({
          actionPoints: actionPoints - 1,
          currentEvent: selectedEvt,
          selectedChoice: null,
          eventResultText: null
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
        const { actionPoints, stats, day, recentLogs } = get();
        if (actionPoints < 1) {
          get().showToast('교사력(TP)이 부족하여 행동을 수행할 수 없습니다.');
          return;
        }

        const newStats = { ...stats };
        let msg = '';

        if (actionType === 'classroom_lead') {
          newStats.studentTrust = clamp(newStats.studentTrust + 5);
          newStats.teachingSatisfaction = clamp(newStats.teachingSatisfaction + 5);
          newStats.hp = clamp(newStats.hp - 3);
          newStats.mental = clamp(newStats.mental - 2);
          msg = '학급 학생들과 눈을 맞추며 아침 조회와 교실 지도를 수행했습니다. 학생 신뢰도와 보람이 증가했습니다.';
        } else if (actionType === 'office_work') {
          newStats.adminPower = clamp(newStats.adminPower + 5);
          newStats.hp = clamp(newStats.hp - 5);
          newStats.mental = clamp(newStats.mental - 3);
          newStats.burnout = clamp(newStats.burnout + 5);
          msg = '교무실 책상에 앉아 밀려오는 교육청 기안 공문을 신속히 처리했습니다. 행정 역량이 증가했으나 번아웃이 늘었습니다.';
        } else if (actionType === 'health_rest') {
          newStats.hp = clamp(newStats.hp + 15);
          newStats.mental = clamp(newStats.mental + 10);
          newStats.burnout = clamp(newStats.burnout - 10);
          msg = '보건실 안락의자와 온열 매트 위에서 짧은 낮잠을 자며 피로를 풀었습니다. 건강 지표가 회복됩니다.';
        } else if (actionType === 'playground_train') {
          newStats.hp = clamp(newStats.hp + 10);
          newStats.mental = clamp(newStats.mental + 5);
          newStats.burnout = clamp(newStats.burnout - 5);
          msg = '넓은 운동장을 가볍게 조깅하며 신선한 바람을 마셨습니다. 기초 체력이 다소 회복됩니다.';
        } else if (actionType === 'principal_chat') {
          newStats.adminTrust = clamp(newStats.adminTrust + 5);
          newStats.reputation = clamp(newStats.reputation + 3);
          msg = '교장실에서 교장 선생님이 주신 따뜻한 차를 마시며 학교 경영 방침에 대해 깊은 차담을 나눴습니다.';
        } else if (actionType === 'admin_cooperate') {
          newStats.adminPower = clamp(newStats.adminPower + 5);
          newStats.colleagueSolidarity = clamp(newStats.colleagueSolidarity + 6);
          newStats.hp = clamp(newStats.hp - 4);
          msg = '행정실에 들러 현장체험학습 관련 복잡한 세무 품의서 제출 처리를 정중히 협조 요청하고 실무를 도왔습니다.';
        } else if (actionType === 'cafeteria_guide') {
          newStats.studentTrust = clamp(newStats.studentTrust + 3);
          newStats.colleagueSolidarity = clamp(newStats.colleagueSolidarity + 4);
          newStats.hp = clamp(newStats.hp - 5);
          msg = '급식실에서 아이들의 배식 및 줄서기 지도 업무를 성심껏 돕고 조리사님들께 감사 인사를 건넸습니다.';
        } else if (actionType === 'library_organize') {
          newStats.expert = clamp(newStats.expert + 5);
          newStats.teachingSatisfaction = clamp(newStats.teachingSatisfaction + 4);
          newStats.hp = clamp(newStats.hp - 3);
          msg = '조용한 도서실에서 신간 도서 분류 작업을 도우며, 최근 학계의 추천 도서 목록을 파악했습니다.';
        } else if (actionType === 'wee_counsel') {
          newStats.studentTrust = clamp(newStats.studentTrust + 6);
          newStats.teachingSatisfaction = clamp(newStats.teachingSatisfaction + 6);
          newStats.hp = clamp(newStats.hp - 2);
          msg = '상담실(Wee 클래스)에서 정서적 위기를 겪는 학급 학생의 심층 상담 일정을 조율하고 교류를 보조했습니다.';
        } else if (actionType === 'science_safety') {
          newStats.expert = clamp(newStats.expert + 4);
          newStats.adminPower = clamp(newStats.adminPower + 3);
          newStats.hp = clamp(newStats.hp - 3);
          msg = '과학실의 실험 도구 보관 상태와 시약 캐비닛 이중 잠금장치의 소독 및 관리 안전 수칙을 면밀히 점검했습니다.';
        } else if (actionType === 'gate_safety') {
          newStats.reputation = clamp(newStats.reputation + 4);
          newStats.educationSoshin = clamp(newStats.educationSoshin + 3);
          newStats.parentComplaint = clamp(newStats.parentComplaint + 2);
          newStats.hp = clamp(newStats.hp - 4);
          msg = '교문에서 배움터지킴이 보안관님과 함께 등교하는 학생들의 안전 복장 및 교통 안전 수칙 등교 지도를 실시했습니다.';
        } else if (actionType === 'gym_safety') {
          newStats.hp = clamp(newStats.hp - 4);
          newStats.studentTrust = clamp(newStats.studentTrust + 4);
          newStats.teachingSatisfaction = clamp(newStats.teachingSatisfaction + 4);
          msg = '체육관에서 아이들의 안전을 모니터링하고 체육 강당 매트를 정돈했습니다. 학생 신뢰도와 보람이 증가했습니다.';
        } else if (actionType === 'gym_room_organize') {
          newStats.hp = clamp(newStats.hp - 5);
          newStats.colleagueSolidarity = clamp(newStats.colleagueSolidarity + 5);
          newStats.adminPower = clamp(newStats.adminPower + 3);
          msg = '체육실에서 잃어버린 호루라기와 낡은 구령대 축구공 바구니를 깔끔하게 수납 정리했습니다. 동료 교직원 연대감이 증가했습니다.';
        } else if (actionType === 'grade_class_inspect') {
          newStats.expert = clamp(newStats.expert + 5);
          newStats.teachingSatisfaction = clamp(newStats.teachingSatisfaction + 3);
          newStats.hp = clamp(newStats.hp - 2);
          msg = '1~6학년 복도 교실을 돌며 동료 교사들의 수업 환경과 교실 게시판 테마를 참관 연구했습니다. 수업 전문성과 보람이 증가했습니다.';
        }

        const updatedLogs = [
          `[${day}일차] ${msg}`,
          ...recentLogs.slice(0, 19)
        ];

        set({
          actionPoints: actionPoints - 1,
          stats: syncNewStats(newStats),
          recentLogs: updatedLogs
        });

        get().showToast(msg);
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

          eventIdx = pickBalancedDialogueIndex(candidates, studentDialogueEvents, stats);
          const evt = studentDialogueEvents[eventIdx];

          const student = get().students.find(s => s.id === npcId);
          const role = student ? `${student.name} (우리 반 학생)` : '학생';
          steps = evt.generateSteps(npcName, role);
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

          eventIdx = pickBalancedDialogueIndex(candidates, colleagueDialogueEvents, stats);
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

      // 레거시 백업
      talkToNPCLegacy: (npcId: string, npcName: string) => {
        const { day, recentLogs, completedNpcDialoguesToday, completedDialogueHistory } = get();

        // 1. 이미 평생 대화한 적 있는 NPC인지 확인 (영구 중복 차단)
        if (completedDialogueHistory.includes(npcId)) {
          get().showToast(`[대화 완료] 이미 ${npcName}님과는 모든 용무와 상담을 마쳤습니다.`);
          return;
        }

        // 2. 오늘 이미 대화한 적 있는 NPC인지 확인 (당일 중복 차단)
        if (completedNpcDialoguesToday.includes(npcId)) {
          get().showToast(`[대화 제한] 오늘 이미 ${npcName}님과 대화했습니다. 내일 다시 대화할 수 있습니다.`);
          return;
        }

        let steps: DialogueStep[] = [];

        // npcId가 student_ 로 시작하는 경우 배정된 학생 10명과의 상호작용으로 판단하여 동적 대사 생성
        if (npcId.startsWith('student_')) {
          const student = get().students.find(s => s.id === npcId);
          if (student) {
            steps = generateStudentDialogue(student);
          } else {
            steps = [
              {
                speaker: npcName,
                text: `"${npcName} 학생입니다. 저는 다른 학급이라 가볍게 고개 숙여 인사하고 지나갑니다."`
              }
            ];
          }
        } 
        // 1~6학년 가상 담임교사 12명 대화 시나리오 연동 [NEW]
        else if (npcId === 'colleague_g1_a') {
          steps = [
            {
              speaker: '정민우 교사 (1학년)',
              text: '"김 선생님! 1학년 애기들 한글 홑받침이랑 겹받침 지도하다가 속이 까맣게 들어갔어요. 가나다도 헷갈리는 제자들을 어쩌면 좋죠?" 정 교사가 한숨을 쉽니다.',
              choices: [
                {
                  text: '“힘내세요! 제 교실에 있는 교구용 한글 놀이 낱말 카드와 보드게임 세트를 빌려드릴 테니 교실 뒤에서 놀이식으로 지도해 보세요.” (한글 보드게임 공유)',
                  nextStepIndex: 1,
                  effects: [{ stat: 'colleagueSolidarity', value: 8 }, { stat: 'colleagueRelation', value: 5 }, { stat: 'mental', value: -2 }],
                  resultText: '"우와, 이런 유용한 보드게임이 있었군요! 당장 내일 아침 놀이 수업 시간에 모둠별로 돌려봐야겠어요. 정말 든든한 동료십니다!"'
                },
                {
                  text: '“1학년 수준에서는 무조건 매일 아침 받아쓰기 10문항씩 고전적인 반복 학습을 진행해 기틀을 잡아주는 것이 원칙입니다.” (반복 훈련 조언)',
                  nextStepIndex: 2,
                  effects: [{ stat: 'educationSoshin', value: 6 }, { stat: 'expert', value: 4 }],
                  resultText: '"음, 확실히 기초 단계에는 눈으로 익히고 직접 써보는 훈련이 약이죠. 내일부터 받아쓰기 공책을 인쇄해서 써보게 할게요!"'
                }
              ]
            },
            {
              speaker: '정민우 교사 (1학년)',
              text: '동료에게 교실 교구를 흔쾌히 양보하고 조력하며 끈끈한 교직원 연대감과 동료애를 공고히 다졌습니다.'
            },
            {
              speaker: '정민우 교사 (1학년)',
              text: '구체적인 원칙 기반 훈육 조언을 피드백하여 교직 전문성을 입증하고 교육 소신을 확립했습니다.'
            }
          ];
        } else if (npcId === 'colleague_g1_b') {
          steps = [
            {
              speaker: '김영희 교사 (1학년)',
              text: '"아이쿠 김 선생님, 방금 복도에서 소란을 부리던 아이들 줄 세우고, 교실에서 신발끈 묶어주고 오느라 허리가 다 부러질 지경이에요. 1학년은 보모가 된 느낌이네요." 김 교사가 허리를 두드립니다.',
              choices: [
                {
                  text: '“1학년 담임의 피로는 상상을 초월하죠. 여기 따뜻한 유자차 한 잔 드시고 쉬세요. 5분 뒤 조회 지도는 제가 대신 돌아봐 드릴게요.” (동료 쉼 지원)',
                  nextStepIndex: 1,
                  effects: [{ stat: 'colleagueSolidarity', value: 10 }, { stat: 'colleagueRelation', value: 8 }, { stat: 'hp', value: -2 }],
                  resultText: '"아니, 김 선생님 반 조례도 바쁘실 텐데 이런 배려를...! 정말 눈물 나게 고맙습니다. 유자차 마시고 힘낼게요!"'
                },
                {
                  text: '“아이들이 스스로 신발끈을 묶을 수 있도록 학급 자치 규정을 세우고, 신발끈 대회 등을 열어 자조력을 키워 주시는 편이 근본적 해결책입니다.” (자립 교육 권유)',
                  nextStepIndex: 2,
                  effects: [{ stat: 'expert', value: 6 }, { stat: 'mental', value: 2 }],
                  resultText: '"아, 맞아요. 사소한 편의를 계속 봐주면 애들이 자립하지 못하죠. 스스로 묶기 챌린지를 교실에 도입해 볼게요!"'
                }
              ]
            },
            {
              speaker: '김영희 교사 (1학년)',
              text: '동료의 아침 복도 지도를 대행해주며 깊은 동료애를 쌓고 연대감을 고양했으나 약간의 체력을 썼습니다.'
            },
            {
              speaker: '김영희 교사 (1학년)',
              text: '전문적인 초등 생활 지도 기법을 제시하여, 동료의 업무 과중을 덜고 학생들의 자립도를 높이는 훈육을 전수했습니다.'
            }
          ];
        } else if (npcId === 'colleague_g2_a') {
          steps = [
            {
              speaker: '박지수 교사 (2학년)',
              text: '"김 선생님, 우리 반 지훈이가 구구단 3단과 4단을 도무지 외우질 못해서 수학 익힘책 진도를 나가지 못하고 있어요. 외우기 쉬운 요령이 있을까요?" 박 교사가 난감해합니다.',
              choices: [
                {
                  text: '“요즘 아이들은 리듬을 타는 구구단 노래 교육용 웹 게임 어플이 아주 잘 맞아요. 스마트 교실 태블릿에 설치해 사용해 보세요.” (에듀테크 융합 제안)',
                  nextStepIndex: 1,
                  effects: [{ stat: 'expert', value: 8 }, { stat: 'colleagueSolidarity', value: 6 }],
                  resultText: '"아! 태블릿을 게임처럼 활용해 구구단을 외우는군요! 요즘 애들 취향에 딱 맞겠네요. 훌륭한 수업 노하우예요!"'
                },
                {
                  text: '“방과 후 교실에 10분간 남겨서, 교사 앞에서 직접 외우고 통과 도장을 찍어주는 엄격한 면담 지도가 확실합니다.” (엄격한 오프라인 밀착 지도)',
                  nextStepIndex: 2,
                  effects: [{ stat: 'educationSoshin', value: 8 }, { stat: 'mental', value: -2 }],
                  resultText: '"흠, 역시 전통적인 면대면 끈기 훈련이 가장 확실하죠. 오늘 방과 후에 구구단 보충 지도를 열어 통과제를 해보겠습니다!"'
                }
              ]
            },
            {
              speaker: '박지수 교사 (2학년)',
              text: '에듀테크 접목 수학 지도 아이디어를 전수하여 동료를 돕고 자신의 수업 전문성을 드높였습니다.'
            },
            {
              speaker: '박지수 교사 (2학년)',
              text: '원칙 위주의 면담 보충 지도 방향을 일러주어 교사로서의 소신과 학력 고수 기조를 확립했습니다.'
            }
          ];
        } else if (npcId === 'colleague_g2_b') {
          steps = [
            {
              speaker: '최유진 교사 (2학년)',
              text: '"선생님! 오늘 아침 조회 때 교실 뒤에서 애들이 연필깎이 통을 엎어서 가루로 모래놀이를 하고 있었더라고요. 청소를 다 하느라 옷이 엉망이 되었어요." 최 교사가 울상을 짓습니다.',
              choices: [
                {
                  text: '“어이구, 아침부터 가루 폭탄을 맞으셨군요! 저희 학급에 흡입력이 강한 무선 미니 청소기가 있으니 당분간 교실에 두고 편하게 쓰세요.” (청소 용품 지원)',
                  nextStepIndex: 1,
                  effects: [{ stat: 'colleagueSolidarity', value: 10 }, { stat: 'colleagueRelation', value: 8 }],
                  resultText: '"정말요? 빗자루로는 가루가 날려서 곤란했는데, 무선 청소기 덕에 금방 치우겠어요. 김 선생님의 정성에 정말 감동했습니다!"'
                },
                {
                  text: '“학급 환경 규칙을 위반하고 공용 기물을 어지럽힌 주동 학생들에게 방과후 빗자루 청소 3일의 봉사 조치를 단호히 부과하세요.” (책임 훈육 강조)',
                  nextStepIndex: 2,
                  effects: [{ stat: 'educationSoshin', value: 8 }, { stat: 'mental', value: 3 }],
                  resultText: '"맞아요. 스스로 어지럽힌 물건은 본인들이 책임져야 기강이 서죠. 장난친 아이들을 불러 점심시간 분리수거 지도를 시키겠습니다!"'
                }
              ]
            },
            {
              speaker: '최유진 교사 (2학년)',
              text: '실질적인 학급 물품 공유와 정서 지지를 통해 교직원 연대감을 가득 다지고 강력한 우애를 도모했습니다.'
            },
            {
              speaker: '최유진 교사 (2학년)',
              text: '학생 스스로가 지은 잘못에 책임을 지도록 유도하는 책임 교육 소신을 확고히 전수했습니다.'
            }
          ];
        } else if (npcId === 'colleague_g3_a') {
          steps = [
            {
              speaker: '이성우 교사 (3학년)',
              text: '"김 선생님, 3학년이 되니까 수업 시수도 늘고, 애들이 슬슬 머리가 컸는지 말대답을 하기 시작해요. 교실 기강을 어떻게 잡아야 할지 통 감이 안 오네요." 이 교사가 걱정을 털어놓습니다.',
              choices: [
                {
                  text: '“3학년은 사춘기 진입 단계라 감정 조절이 조심스럽죠. 마주보고 다그치기보다 개별 면담을 거쳐 감정을 털어내게 도와보세요.” (상담 지향 중재)',
                  nextStepIndex: 1,
                  effects: [{ stat: 'expert', value: 7 }, { stat: 'colleagueSolidarity', value: 6 }],
                  resultText: '"개별 상담을 통해 아이의 진짜 속내를 듣는 방법이군요. 공격적인 말대답 이면의 다른 정서적 원인이 있는지 짚어보겠습니다."'
                },
                {
                  text: '“첫 기선제압이 중요합니다. 반항성 말대답 시 즉시 단호한 벌점과 반성문 쓰기 등 엄격한 훈육 원칙을 예외 없이 적용하세요.” (원칙 규율 훈육)',
                  nextStepIndex: 2,
                  effects: [{ stat: 'educationSoshin', value: 8 }, { stat: 'mental', value: 3 }],
                  resultText: '"과연, 교실 내 기강의 붕괴는 작은 말대답 용인에서 시작되죠. 단호한 학급 운영 규칙 카드를 오늘 아침 홈룸 시간에 선포해야겠어요."'
                }
              ]
            },
            {
              speaker: '이성우 교사 (3학년)',
              text: '정서 지지 상담 노하우를 공유하여 학생 중심 수업 지도 역량과 동료와의 협동성을 증진시켰습니다.'
            },
            {
              speaker: '이성우 교사 (3학년)',
              text: '엄한 기율 수호 가이드를 전수하며 공정하고 흐트러짐 없는 원칙주의 교사 소신을 다잡았습니다.'
            }
          ];
        } else if (npcId === 'colleague_g3_b') {
          steps = [
            {
              speaker: '한나래 교사 (3학년)',
              text: '"김 선생님, 미술 예체능 보조 재료 구입을 위해 행정실에 올린 30만원 품의가 교감선생님 선에서 반려되었어요. 활용도 소명이 부족하다나... 기안을 또 고치려니 힘드네요." 한 교사가 한숨을 쉽니다.',
              choices: [
                {
                  text: '“교감 선생님은 행정 서류에 예산 낭비 불식 명시를 좋아하세요. 작년에 제가 통과받았던 미술 예산 기안 서식 파일을 보내드릴 테니 고쳐 쓰세요.” (행정 기안 포맷 공유)',
                  nextStepIndex: 1,
                  effects: [{ stat: 'colleagueSolidarity', value: 10 }, { stat: 'colleagueRelation', value: 10 }, { stat: 'adminPower', value: 4 }],
                  resultText: '"세상에, 김 선생님! 기안 통과 족보 파일을 주시다니요! 이 서식의 산출 근거를 벤치마킹하면 바로 승인되겠어요. 너무 감사해요!"'
                },
                {
                  text: '“행정실 승인이 번거롭다면, 시 교육청에서 진행하는 무료 학교 교육용 기자재 무상 대여 사업을 이용해 보시는 게 어때요?” (행정 대안 제안)',
                  nextStepIndex: 2,
                  effects: [{ stat: 'adminPower', value: 8 }, { stat: 'burnout', value: -2 }],
                  resultText: '"아, 그런 복지 사업이 있었군요! 복잡한 품의 기결 없이 교육청 교구 임대로 우회하는 편이 행정 피로가 훨씬 덜하겠어요. 당장 신청할게요!"'
                }
              ]
            },
            {
              speaker: '한나래 교사 (3학년)',
              text: '성공 기안 기결 노하우를 흔쾌히 나눔으로써 동료 관계를 극상으로 향상시키고 행정 실무 상호작용력을 확보했습니다.'
            },
            {
              speaker: '한나래 교사 (3학년)',
              text: '까다로운 내부 기결 대신 우회적인 무상 대여 제도를 제안하여 행정 수완을 발휘하고 업무 효율을 늘렸습니다.'
            }
          ];
        } else if (npcId === 'colleague_g4_a') {
          steps = [
            {
              speaker: '윤태호 교사 (4학년)',
              text: '"김 선생님, 4학년 지역 역사 탐방 야외 현장학습 계획서를 수립 중인데, 안전 서류랑 버스 계약 기획이 너무 꼬이네요. 외부 행사 안전 조언 좀 주실 수 있나요?" 윤 교사가 질문합니다.',
              choices: [
                {
                  text: '“현장 체험 학습은 안전 사고 책임 소재가 민감하죠. 시 교육청 안전 연수 자료와 버스 임차 표준 계약서 작성 폴더를 제 클라우드에서 공유할게요.” (체험 학습 노하우 전수)',
                  nextStepIndex: 1,
                  effects: [{ stat: 'expert', value: 7 }, { stat: 'colleagueSolidarity', value: 7 }, { stat: 'adminPower', value: 5 }],
                  resultText: '"역시 실무 경험이 많으셔서 바로 표준 예시 자료를 턱 내주시는군요! 이 안전 지침에 맞춰 쓰면 교육청 지적을 피하겠어요. 최고예요!"'
                },
                {
                  text: '“요즘 외부 차량 계약이나 인솔 안전 리스크가 크니, 억지로 야외로 나가기보다 학교 테블릿을 활용한 메타버스 온라인 가상 역사 답사로 기획해 보세요.” (스마트 답사 대안 제시)',
                  nextStepIndex: 2,
                  effects: [{ stat: 'expert', value: 10 }, { stat: 'burnout', value: -4 }],
                  resultText: '"오, 메타버스 온라인 역사 답사라니! 안전 사고 우려도 원천 제로이고 행정 수고도 급감하겠네요. 혁신적인 대안 수업 기획에 눈을 떴어요!"'
                }
              ]
            },
            {
              speaker: '윤태호 교사 (4학년)',
              text: '야외 안전 서류 철저 보조와 실무 지원을 통해 동료애를 다지고 수업 장인으로서의 역량을 공유했습니다.'
            },
            {
              speaker: '윤태호 교사 (4학년)',
              text: '에듀테크를 응용한 지능형 메타버스 대체 학습 모델을 제시하여 수업 전문성을 극상으로 늘리고 리스크를 원천 해소했습니다.'
            }
          ];
        } else if (npcId === 'colleague_g4_b') {
          steps = [
            {
              speaker: '신지원 교사 (4학년)',
              text: '"선생님! 오늘 교내 과학실 약품 유통기한 전수 조사와 보관 시약 인벤토리 작성이 겹쳐서 기재 대장을 뒤지느라 손톱 밑이 새까맣게 탔어요. 행정이 어마어마하네요." 신 교사가 핀셋을 털어냅니다.',
              choices: [
                {
                  text: '“과학실 안전 대장 정리가 유독 번잡하죠. 엑셀 수식으로 일괄 기한 자동 계산이 되는 관리 템플릿을 메신저로 보내드릴게요.” (기획 엑셀 공유)',
                  nextStepIndex: 1,
                  effects: [{ stat: 'colleagueSolidarity', value: 10 }, { stat: 'adminPower', value: 6 }],
                  resultText: '"와, 엑셀 기한 자동 매핑 수식이라니요! 김 선생님 덕분에 하루 종일 타이핑할 노가다 작업을 단 10분 만에 마치겠어요. 고마워요!"'
                },
                {
                  text: '“소모품과 시약 관리를 일일이 대장에 적기보다, 과학실무사님과 업무 분장을 명확히 나눠 책임 대행 처리를 의뢰해 보세요.” (업무 분장 개선 제안)',
                  nextStepIndex: 2,
                  effects: [{ stat: 'adminPower', value: 8 }, { stat: 'colleagueSolidarity', value: 4 }],
                  resultText: '"하긴 실무사의 고유 영역과 분장을 칼같이 정립해 놓는 편이 나중에 업무 차질도 없고 서로 명확하겠네요. 규정대로 분장을 조율할게요."'
                }
              ]
            },
            {
              speaker: '신지원 교사 (4학년)',
              text: '전산 엑셀 포맷 전수를 통해 행정 처리를 획기적으로 개선하며 동료의 전폭적 감사와 신망을 얻었습니다.'
            },
            {
              speaker: '신지원 교사 (4학년)',
              text: '학교 행정 분장 표준 지침에 맞추어 업무 권한과 책임을 조율하여 행정 마스터로서의 입지를 다졌습니다.'
            }
          ];
        } else if (npcId === 'colleague_g5_a') {
          steps = [
            {
              speaker: '강성훈 교사 (5학년)',
              text: '"김 선생님, 우리 반 수학 기초 학습에서 분수 통분 개념을 통 이해하지 못하는 녀석이 3명이나 있어요. 보충 지도 교재를 짜야 하는데 고민이네요." 강 교사가 교재를 넘겨봅니다.',
              choices: [
                {
                  text: '“통분은 추상적인 개념이라 그림이 필수예요. 피자 조각 분수 시각화 활동지와 통분 가로축 색칠 연습 자료를 제가 복사해 드릴게요.” (시각화 교구 공유)',
                  nextStepIndex: 1,
                  effects: [{ stat: 'colleagueSolidarity', value: 10 }, { stat: 'expert', value: 8 }],
                  resultText: '"아! 피자 조각 조각으로 분모 통분을 맞추는 시각화 활동이군요! 직관적이라 아이들이 당장 눈을 크게 뜰 것 같아요. 자료 소중히 쓸게요!"'
                },
                {
                  text: '“진도를 따라오지 못하는 녀석들은 방과 후 보충 20분 자습 지도를 통해 기초 계산 문제를 반복 숙달하게 훈련하는 것이 지름길입니다.” (반복 학습 피드백)',
                  nextStepIndex: 2,
                  effects: [{ stat: 'educationSoshin', value: 8 }, { stat: 'mental', value: -1 }],
                  resultText: '"흠, 역시 계산력 자체의 반복 집중 훈련이 기초 구멍을 메우는 가장 원초적인 약이죠. 방과 후 보충 숙제를 부과해서 집중 훈련을 시킬게요!"'
                }
              ]
            },
            {
              speaker: '강성훈 교사 (5학년)',
              text: '피자 조각 시각 교구 나눔으로 수업 기법을 동료와 연대 공유하며 교육 만족과 연대감을 드높였습니다.'
            },
            {
              speaker: '강성훈 교사 (5학년)',
              text: '기초 계산 능력의 무조건적 복습과 원칙 훈련 기조를 제시해 교사 소신과 책임 훈육을 수호했습니다.'
            }
          ];
        } else if (npcId === 'colleague_g5_b') {
          steps = [
            {
              speaker: '백현우 교사 (5학년)',
              text: '"김 선생님, 내일 있을 학년 강당 체육 한마당 축제 스태프 조력자가 부족해서 체육 부장으로서 걱정이네요. 혹시 지원 교사가 없을까요?" 백 교사가 호루라기를 만지작거립니다.',
              choices: [
                {
                  text: '“체육 준비로 고생이 많으십니다. 마침 내일 5교시가 제 전담 시간이라 강당에 올라가 라인 마킹과 안전 통제 지도를 직접 도울게요.” (체육 활동 직접 조력)',
                  nextStepIndex: 1,
                  effects: [{ stat: 'colleagueSolidarity', value: 10 }, { stat: 'colleagueRelation', value: 5 }, { stat: 'hp', value: -5 }],
                  resultText: '"정말입니까 김 선생님? 5교시 빈 시간에 강당 통제를 도와주신다니 천군만마를 얻었네요! 행사를 활기차게 마무리하겠어요!"'
                },
                {
                  text: '“체육 행무 처리를 원활히 하려면, 교무실에 지원 인력 지정 요청 기안을 올려 교감 선생님의 공식 지휘 하에 교사를 공식 징집해야 합니다.” (공식 징집 기안 조언)',
                  nextStepIndex: 2,
                  effects: [{ stat: 'adminPower', value: 8 }, { stat: 'colleagueRelation', value: -2 }],
                  resultText: '"그렇네요. 개인의 호의에 기대기보다 기안 결재를 통해 공식 협조 요원을 지정하는 것이 뒤탈 없고 명확한 행정 처리죠. 바로 상신할게요."'
                }
              ]
            },
            {
              speaker: '백현우 교사 (5학년)',
              text: '행사에 직접 몸으로 뛰어들어 협조하며 강력한 동료 신뢰와 연대감을 쟁취하였으나 다소 피로해졌습니다.'
            },
            {
              speaker: '백현우 교사 (5학년)',
              text: '행정 규정에 입각한 인력 충원 가이드를 피드백하여 교내 행정 실무를 바로잡고 체계를 지켰습니다.'
            }
          ];
        } else if (npcId === 'colleague_g6_a') {
          steps = [
            {
              speaker: '송민지 교사 (6학년)',
              text: '"김 선생님, 6학년 여자애들 교실 뒤에서 은밀히 파벌을 만들고 뒷담화를 카톡으로 퍼뜨리던 사건을 중재하고 왔는데, 기가 다 빨렸어요. 사춘기 여학생 지도는 너무 어렵네요." 송 교사가 고개를 흔듭니다.',
              choices: [
                {
                  text: '“6학년 관계 지도는 살얼음판이죠. 상담실 Wee 클래스와 연계하여 교우 실태 익명 앙케이트를 먼저 실행해 보시죠.” (상담실 공조 중재)',
                  nextStepIndex: 1,
                  effects: [{ stat: 'expert', value: 8 }, { stat: 'colleagueSolidarity', value: 8 }],
                  resultText: '"상담교사와의 위클래스 연계 공조군요. 학교 전문 상담망의 조력을 받으면 학급 사태를 보다 객관적으로 수습할 수 있겠어요. 당장 신청할게요!"'
                },
                {
                  text: '“교실 분위기를 해치는 일탈 단체 톡방은 폰을 긴급 압수해 조사하고, 가담자 전원 방과후 학급 자치 규정에 따라 공식 반성문을 쓰게 엄단하세요.” (엄격 규율 선언)',
                  nextStepIndex: 2,
                  effects: [{ stat: 'educationSoshin', value: 10 }, { stat: 'mental', value: -2 }],
                  resultText: '"그렇죠. 비밀 험담방은 방임하면 사이버 학폭으로 직결되니, 단호하게 폰 수거 조사를 해 기강을 다잡고 학부모 서명 반성문을 걷겠습니다!"'
                }
              ]
            },
            {
              speaker: '송민지 교사 (6학년)',
              text: 'Wee 클래스 연계 상담 아이디어를 제시해 6학년 갈등 중재 공조를 완성하며 전문성과 연대감을 늘렸습니다.'
            },
            {
              speaker: '송민지 교사 (6학년)',
              text: '사이버 학폭 예방을 위해 엄격하고 단호한 기율을 부과하는 교육 소신을 견지했습니다.'
            }
          ];
        } else if (npcId === 'colleague_g6_b') {
          steps = [
            {
              speaker: '오윤아 교사 (6학년)',
              text: '"김 선생님! 이번 주 졸업 앨범용 아이들 개인 프로필 자유 촬영 말이에요. 서로 특이한 유튜브 밈 포즈를 취하겠다고 싸우고 있어 수업 진도가 막혔어요. 어떻게 포즈를 제한할까요?" 오 교사가 앨범 시안을 봅니다.',
              choices: [
                {
                  text: '“평생 갈 졸업 사진이니, 자유 포즈 3가지를 미리 집에서 가족과 협의해 서면으로 적어 오도록 홈룸 과제를 내보세요.” (사전 준비 과제화)',
                  nextStepIndex: 1,
                  effects: [{ stat: 'expert', value: 8 }, { stat: 'colleagueSolidarity', value: 8 }],
                  resultText: '"아! 교실에서 당일 즉흥적으로 정하지 말고, 집에서 학부모 협조 하에 포즈를 확정해 오게 과제를 내면 수업 시간에 다투지 않고 신속히 촬영하겠어요!"'
                },
                {
                  text: '“앨범 편집 일정 마감이 촉박하니, 돌발 밈 포즈는 금지하고 표준 45도 측면 미소 포즈로 전원 통일 통제해 결재 올리세요.” (표준 단일화 지시)',
                  nextStepIndex: 2,
                  effects: [{ stat: 'adminPower', value: 8 }, { stat: 'burnout', value: -2 }],
                  resultText: '"하긴, 통제 불능 자유화보다 표준 앵글로 통일해야 앨범 가공 마감에 차질이 없죠. 단일 통일 지시문을 안내장에 기재해 결재 처리할게요."'
                }
              ]
            },
            {
              speaker: '오윤아 교사 (6학년)',
              text: '학부모 협조 연계 사전 포즈 과제 설계를 가이드하여, 동료 교사의 수업 통제 전문성을 획득하고 연대를 굳혔습니다.'
            },
            {
              speaker: '오윤아 교사 (6학년)',
              text: '표준 앨범 통일 규격을 지시해 서류 마감 기한을 완수하는 기결 행정 추진력을 확립했습니다.'
            }
          ];
        }
        // 고정 NPC 대화 시나리오들 매핑
        else if (npcId === 'colleague_senior') {
          steps = [
            {
              speaker: '김 부장 교사',
              text: '"김 선생님, 교육청에서 급히 내려온 학부모 학교 만족도 조사 취합 공문이 말이야. 오늘 4시까지 기안 올려야 하는데 처리 가능하겠나?" 부장님이 조급하게 물으십니다.',
              choices: [
                {
                  text: '“네, 부장님! 하던 교실 청소를 미뤄두고 곧장 처리하여 결재 올리겠습니다.” (행정 순응)',
                  nextStepIndex: 1,
                  effects: [{ stat: 'adminTrust', value: 5 }, { stat: 'adminPower', value: 5 }, { stat: 'colleagueSolidarity', value: 5 }, { stat: 'hp', value: -10 }, { stat: 'burnout', value: 10 }],
                  resultText: '"역시 김 선생님! 일을 명확하고 기동력 있게 처리해 주니 학교가 아주 부드럽게 굴러가요! 정말 든든해."'
                },
                {
                  text: '“부장님, 현재 교실에 상담 대기 중인 학생이 있어, 대단히 죄송하지만 퇴근 전인 5시까지 처리해도 될까요?” (기한 협상)',
                  nextStepIndex: 2,
                  effects: [{ stat: 'mental', value: 5 }, { stat: 'adminTrust', value: -2 }, { stat: 'colleagueSolidarity', value: -2 }, { stat: 'studentTrust', value: 5 }],
                  resultText: '"아, 상담 중이었군! 그럼 그럼, 애들이 먼저지. 5시까지 취합해서 보고해주면 되니 상담 꼼꼼히 하고 편하게 올려줘."'
                }
              ]
            },
            {
              speaker: '김 부장 교사',
              text: '행정을 기민하게 완료하여 관리자의 깊은 신뢰를 얻었으나, 급격한 서류 작업으로 어깨가 뻐근해집니다.'
            },
            {
              speaker: '김 부장 교사',
              text: '기한을 조율하여 차분히 학생 상담을 완수하고 행정 공문도 차질 없이 마감했습니다. 자원을 영리하게 활용했습니다.'
            }
          ];
        } else if (npcId === 'colleague_mate') {
          steps = [
            {
              speaker: '박 교사',
              text: '"김 선생님! 오늘따라 어깨가 유독 축 처져 보여요. 오늘 저녁 퇴근하고 학교 앞 고깃집에서 삼겹살 구우면서 학교메신저 스트레스 털어낼까요?" 동료 교사가 물어봅니다.',
              choices: [
                {
                  text: '“좋습니다! 맛있는 고기 먹고 하소연도 하면서 힐링하고 싶네요.” (사교적 힐링)',
                  nextStepIndex: 1,
                  effects: [{ stat: 'colleagueRelation', value: 8 }, { stat: 'colleagueSolidarity', value: 10 }, { stat: 'mental', value: 15 }, { stat: 'teachingSatisfaction', value: -5 }, { stat: 'hp', value: -5 }],
                  resultText: '"나이스! 오늘 제가 기가 막힌 맛집으로 모실 테니 술 한잔 기울이면서 교직 라이프 푸념 실컷 해보자고요!"'
                },
                {
                  text: '“마음은 너무나 감사하지만, 오늘은 가정에 일이 있어서 얼른 들어가 봐야 합니다.” (가정 우선 거절)',
                  nextStepIndex: 2,
                  effects: [{ stat: 'familySatisfaction', value: 10 }, { stat: 'colleagueRelation', value: 2 }, { stat: 'colleagueSolidarity', value: 2 }],
                  resultText: '"아쉽네요! 가정이 최우선이죠. 그럼 내일 급식 다 먹고 교내 자판기 믹스커피 한잔하면서 짧고 굵게 수다 떨어요!"'
                }
              ]
            },
            {
              speaker: '박 교사',
              text: '동료와 함께 맛있는 고기를 구우며 서로의 노고를 위로했습니다. 끈끈한 연대감 속에 멘탈을 완전히 회복했습니다.'
            },
            {
              speaker: '박 교사',
              text: '가정으로 돌아가 따뜻한 집밥을 먹으며 가족들과 소중한 저녁을 지켰습니다. 일과 삶의 균형을 올바르게 맞추었습니다.'
            }
          ];
        } else if (npcId === 'nurse') {
          steps = [
            {
              speaker: '보건 선생님',
              text: '"김 선생님, 목소리가 잠기셨네요. 보건실 캐비닛에 환절기 감기 예방약이랑 발포 비타민 채워뒀는데 따뜻한 물이랑 한 잔 드시고 가실래요?" 보건 선생님이 물으십니다.',
              choices: [
                {
                  text: '“감사합니다. 약을 먹고 보건실 소파에서 10분만 엎드려 눈을 붙이고 가겠습니다.” (쉼과 수용)',
                  nextStepIndex: 1,
                  effects: [{ stat: 'hp', value: 15 }, { stat: 'mental', value: 10 }],
                  resultText: '"잘 결정하셨어요. 여기 담요 덮어드릴 테니 커튼 치고 짧게라도 푹 쉬다 가세요. 교사는 몸이 자산이에요."'
                },
                {
                  text: '“염려해 주셔서 정말 고맙습니다. 약만 챙겨서 교실 자습 감독하러 얼른 올라가 보겠습니다.” (열정형 사양)',
                  nextStepIndex: 2,
                  effects: [{ stat: 'expert', value: 3 }, { stat: 'hp', value: 5 }, { stat: 'burnout', value: 2 }],
                  resultText: '"아고 참 부지런하시기도 해라... 약 꼭 챙겨드시고, 정 무리다 싶으시면 언제든 여기 와서 누워 계세요."'
                }
              ]
            },
            {
              speaker: '보건 선생님',
              text: '보건실의 고요함 속에서 짧지만 꿀맛 같은 수면을 취했습니다. 방전되던 체력이 충전되는 것을 느낍니다.'
            },
            {
              speaker: '보건 선생님',
              text: '비타민제를 물에 타 마시고 활기차게 교실로 올라갑니다. 당장 피로는 남았지만, 학생들을 향한 밀착 의지를 다집니다.'
            }
          ];
        } else if (npcId === 'gym') {
          steps = [
            {
              speaker: '체육 선생님',
              text: '"김 선생님! 요즘 교무실에 앉아만 있어서 하체 다 풀리셨죠? 오늘 방과 후에 강당에서 저랑 배드민턴 복식 한 판 치고 땀 쫙 뺍시다!" 체육 선생님이 활기차게 라켓을 흔듭니다.',
              choices: [
                {
                  text: '“좋습니다! 요즘 땀 흘릴 기회가 없었는데 스매싱 좀 날려야겠네요!” (스포츠 체력단련)',
                  nextStepIndex: 1,
                  effects: [{ stat: 'hp', value: 15 }, { stat: 'mental', value: 5 }, { stat: 'burnout', value: -10 }, { stat: 'colleagueRelation', value: 5 }, { stat: 'colleagueSolidarity', value: 6 }],
                  resultText: '"오! 김 선생님 자세 나오시는데? 오늘 땀 범벅이 될 때까지 한번 신나게 하이클리어 날려봅시다! 하하!"'
                },
                {
                  text: '“배드민턴은 치고 싶지만, 오늘 도저히 손가락 하나 까딱할 기력이 없어서 쉬어야 할 것 같습니다...” (소극적 휴식)',
                  nextStepIndex: 2,
                  effects: [{ stat: 'mental', value: 5 }, { stat: 'hp', value: 5 }],
                  resultText: '"하하, 그렇죠. 요즘 신학기라 기력이 쭉쭉 빠지실 만도 하죠. 무리 마시고 교무실 소파에서 푹 쉬세요!"'
                }
              ]
            },
            {
              speaker: '체육 선생님',
              text: '강당 셔틀콕 소리와 함께 땀방울을 흘리며 심폐 능력을 기르고, 몸 안의 모든 스트레스를 배출했습니다.'
            },
            {
              speaker: '체육 선생님',
              text: '안정적인 정적 휴식을 통해 축적되던 극심한 피로감을 잠재웠습니다. 몸의 휴식 신호를 존중했습니다.'
            }
          ];
        } else if (npcId === 'principal') {
          steps = [
            {
              speaker: '교장 선생님',
              text: '"허허, 김 교사. 우리 학교 교육 목표인 자율과 협동에 맞춰 학급 운영을 훌륭히 해내고 있어 참 대견하네. 혹시 경영에 행정 지원이 더 필요치 않은가?" 교장실 소파에서 물으십니다.',
              choices: [
                {
                  text: '“네, 교실 환경 개선을 위해 태블릿PC 거치대 및 학급 학습 물품 예산을 증액 지원해 주십시오.” (기자재 개선 건의)',
                  nextStepIndex: 1,
                  effects: [{ stat: 'adminTrust', value: 5 }, { stat: 'educationSoshin', value: 8 }, { stat: 'adminPower', value: 5 }],
                  resultText: '"수업 환경 고도화를 위한 합리적인 건의로군! 행정실장에게 특별 기자재 구입 예산을 추경 배정하도록 협의해 보겠네."'
                },
                {
                  text: '“부적응 및 정서 위기 학생들을 위해 개별 상담실 공간 및 학급 보드게임 세트를 우선 배정해 주십시오.” (정서 지지 지원)',
                  nextStepIndex: 2,
                  effects: [{ stat: 'studentTrust', value: 5 }, { stat: 'adminTrust', value: 5 }, { stat: 'educationSoshin', value: 5 }],
                  resultText: '"허허, 아이들의 정서 돌봄을 최우선으로 여기는 김 교사의 고운 심성이 빛나는구만. 예산을 최우선 지원하겠네."'
                }
              ]
            },
            {
              speaker: '교장 선생님',
              text: '교장 선생님과의 긴밀한 차담을 통해 학교 교육 혁신을 위한 건의를 관철하고 행정 실무 점수를 획득했습니다.'
            },
            {
              speaker: '교장 선생님',
              text: '교사의 열정적인 건의 덕에 교실 내 위기 학생 복지 및 학급 놀이 자산이 증대되어 학생 신뢰도가 상승했습니다.'
            }
          ];
        } else if (npcId === 'colleague_vice_principal') {
          steps = [
            {
              speaker: '교감 선생님',
              text: '"김 선생님! 다음 주 월요일에 있을 학교 폭력 예방 캠페인 기획안 말인데, 아직 취합 결재가 안 올라왔네. 교장선생님 보고 전까지 완성해 줄 수 있나?" 교감선생님이 결재판을 들고 물으십니다.',
              choices: [
                {
                  text: '“네, 교감 선생님! 오늘 저녁 야근을 해서라도 기획안을 최종 작성하여 결재 올리겠습니다.” (업무 헌신)',
                  nextStepIndex: 1,
                  effects: [{ stat: 'adminTrust', value: 6 }, { stat: 'adminPower', value: 4 }, { stat: 'colleagueSolidarity', value: 5 }, { stat: 'hp', value: -8 }, { stat: 'burnout', value: 8 }],
                  resultText: '"음! 역시 김 교사야. 책임감 넘치고 속도가 빨라서 언제나 든든해. 기대할게!"'
                },
                {
                  text: '“교감 선생님, 현재 담임반 부적응 학생 관찰 일지 기한도 촉박하여, 업무 분장을 다른 동료와 나눌 수 있을까요?” (업무 조율 요청)',
                  nextStepIndex: 2,
                  effects: [{ stat: 'mental', value: 4 }, { stat: 'colleagueRelation', value: -3 }, { stat: 'colleagueSolidarity', value: -3 }, { stat: 'adminTrust', value: -2 }],
                  resultText: '"허허... 다들 자기 담임반 핑계로 큰 업무는 양보하려고 하니 이거 골치 아프구만. 조율은 해 보겠네."'
                }
              ]
            },
            {
              speaker: '교감 선생님',
              text: '피로를 감수하고 기안 작성을 완료하여 관리자의 강한 신뢰를 얻었으나 피로가 가중되었습니다.'
            },
            {
              speaker: '교감 선생님',
              text: '무작정 혼자 떠안기보다 합리적인 업무 조율을 요청해 멘탈을 지켰으나 동료와의 서먹함은 약간 생겼습니다.'
            }
          ];
        } else if (npcId === 'staff_admin_chief') {
          steps = [
            {
              speaker: '행정실장',
              text: '"김 선생님, 교실 물품으로 품의하신 50만원 상당의 학급 보드게임 예산 말입니다. 행정실 내부 규정상 소모품성 예산의 단일 한도를 초과하여 승인 반려 처리했습니다. 일반 용지로만 대체 구입하시죠."',
              choices: [
                {
                  text: '“행정 규정을 존중합니다. 예산 지침에 맞게 소모품 한도 내의 저렴한 학습지 세트로 전면 수정하여 재품의하겠습니다.” (규정 준수)',
                  nextStepIndex: 1,
                  effects: [{ stat: 'adminPower', value: 6 }, { stat: 'colleagueRelation', value: 3 }, { stat: 'colleagueSolidarity', value: 8 }, { stat: 'mental', value: -4 }],
                  resultText: '"협조해 주셔서 감사해요 김 선생님. 규정대로 처리되니 행정 감사 때 지적될 리 없고 참 매끄럽고 좋네요."'
                },
                {
                  text: '“실장님, 위기 학생 정서 돌봄과 학급 자치 교육에 꼭 필요한 특수 기자재 예산 항목입니다. 사업 취지를 고려해주십시오!” (소신 어필)',
                  nextStepIndex: 2,
                  effects: [{ stat: 'educationSoshin', value: 8 }, { stat: 'studentTrust', value: 5 }, { stat: 'colleagueRelation', value: -2 }, { stat: 'colleagueSolidarity', value: -5 }],
                  resultText: '"흠... 김 선생님의 소신이 워낙 완강하시니, \'교과 특별 지원 기자재\' 예산 항목으로 전용할 수 있는지 검토는 해 보겠습니다만... 복잡해지겠네요."'
                }
              ]
            },
            {
              speaker: '행정실장',
              text: '행정 부서의 절차를 존중하여 마찰 없이 행정 업무의 투명성을 지켰으나, 교실 자재는 다소 평범해졌습니다.'
            },
            {
              speaker: '행정실장',
              text: '행정 예산 전용 절차를 거치며 힘겹게 학급 교육용 놀이 자산을 쟁취하고 교육적 소신을 확립했습니다.'
            }
          ];
        } else if (npcId === 'staff_admin_worker') {
          steps = [
            {
              speaker: '행정 실무사',
              text: '"김 선생님, 이번 주말에 있는 현장체험학습 관련 차량 임차 서류랑 여행자 보험 취합이 지연되고 있어서 제 마감 기한을 넘겼어요. 빨리 서류 주셔야 해요!" 실무사님이 곤란한 표정으로 재촉합니다.',
              choices: [
                {
                  text: '“대단히 죄송합니다! 다른 서류 다 제쳐두고 지금 바로 행정실 서류철에 서명과 보험 명단을 넣어 전송하겠습니다.” (기동력 처리)',
                  nextStepIndex: 1,
                  effects: [{ stat: 'adminPower', value: 5 }, { stat: 'colleagueRelation', value: 4 }, { stat: 'colleagueSolidarity', value: 5 }, { stat: 'hp', value: -4 }],
                  resultText: '"휴, 다행이네요. 김 선생님 덕에 마감에 아슬아슬하게 세이프해서 보고 올릴 수 있겠어요. 고마워요!"'
                },
                {
                  text: '“보험 동의서 서명이 누락된 학부모님이 계셔서요. 안전 서류의 정확성이 중요한 만큼, 부득이 오늘 밤 취합 후 내일 아침 일찍 드리겠습니다.” (정교성 유지)',
                  nextStepIndex: 2,
                  effects: [{ stat: 'parentTrust', value: 4 }, { stat: 'expert', value: 4 }, { stat: 'colleagueRelation', value: -2 }, { stat: 'colleagueSolidarity', value: -2 }],
                  resultText: '"음... 행정 일정상 차질이 빚어져 곤란하지만, 동의서 서명이 누락되면 안 되니 내일 아침 출근 직후 꼭 가져다주세요."'
                }
              ]
            },
            {
              speaker: '행정 실무사',
              text: '기민하게 행정 협조를 마쳐 행정실과의 돈독한 신뢰 관계를 쌓았으나, 서두르느라 다소 지쳤습니다.'
            },
            {
              speaker: '행정 실무사',
              text: '일정 지연의 양해를 구하고 서류의 정합성과 학부모 동의를 철저히 검증하여 사고 책임을 미연에 방지했습니다.'
            }
          ];
        } else if (npcId === 'staff_cook') {
          steps = [
            {
              speaker: '급식 조리사님',
              text: '"선생님! 매일 애들 데리고 밥 묵이느라 땀 뻘뻘 흘리는 모습 보니 내 자식 같아 짠하네. 오늘 힘내라고 계란후라이 서비스 하나 더 얹어줄 테니 팍팍 묵어라!" 배식대에서 푸근하게 권하십니다.',
              choices: [
                {
                  text: '“어머님, 너무 감사합니다! 든든하게 먹고 오후 수업도 애들 성심껏 잘 가르치겠습니다.” (따뜻한 수락)',
                  nextStepIndex: 1,
                  effects: [{ stat: 'hp', value: 10 }, { stat: 'mental', value: 8 }, { stat: 'colleagueRelation', value: 5 }, { stat: 'colleagueSolidarity', value: 5 }],
                  resultText: '"오냐오냐! 잘 묵고 건강 챙겨야 아그들도 잘 돌보는 벱이제. 힘내그라 김 쌤!"'
                },
                {
                  text: '“마음은 감사하지만, 다른 동료 교사나 조리 공정 배식 기준량과의 공정성을 위해 일반 정량대로만 배식받겠습니다.” (원칙적 사양)',
                  nextStepIndex: 2,
                  effects: [{ stat: 'educationSoshin', value: 5 }, { stat: 'colleagueRelation', value: -2 }, { stat: 'colleagueSolidarity', value: -3 }],
                  resultText: '"E이... 융통성 없이 너무 원칙만 따지시네. 그래도 내 마음은 전해졌응께 맛나게 묵으소."'
                }
              ]
            },
            {
              speaker: '급식 조리사님',
              text: '조리사님들과 끈끈한 인간미를 나누며 마음의 힐링과 풍성한 영양 보충을 완료했습니다.'
            },
            {
              speaker: '급식 조리사님',
              text: '배식량 규칙 준수를 철저히 실천하여 한 치의 특혜나 불공정 시비를 원천 배제하는 청렴성을 지켰습니다.'
            }
          ];
        } else if (npcId === 'staff_librarian') {
          steps = [
            {
              speaker: '사서 교사',
              text: '"김 선생님, 요즘 우리 학교 아이들의 독서량이 급격히 줄고 있어요. 학급 아침 독서 시간을 10분만 확보하여 교실에서 지도해 주시면 큰 도움이 될 텐데 협조 가능하신가요?"',
              choices: [
                {
                  text: '“암요, 아이들의 차분한 성장을 위해 저희 반 조회 시간을 쪼개 독서 10분 운동을 책임지고 지도하겠습니다.” (독서 교육 지원)',
                  nextStepIndex: 1,
                  effects: [{ stat: 'expert', value: 7 }, { stat: 'teachingSatisfaction', value: 8 }, { stat: 'studentTrust', value: -3 }, { stat: 'colleagueRelation', value: 5 }, { stat: 'colleagueSolidarity', value: 5 }],
                  resultText: '"정말 감사해요 선생님! 교실 서가용 학급 전용 추천도서 박스 30권을 엄선하여 행정용 카트로 곧장 보내드릴게요."'
                },
                {
                  text: '“아침에는 밀린 공지전달이 많아 실천이 어렵습니다. 도서관 이용 스탬프 쿠폰을 유도하는 대안은 어떨까요?” (쿠폰 대안 제시)',
                  nextStepIndex: 2,
                  effects: [{ stat: 'studentTrust', value: 4 }, { stat: 'colleagueRelation', value: 2 }, { stat: 'colleagueSolidarity', value: 2 }, { stat: 'teachingSatisfaction', value: 3 }],
                  resultText: '"그렇군요... 담임 교실의 분주한 아침 상황도 이해합니다. 쿠폰 배부나 도서관 스탬프 랠리로 참여를 유도해볼게요."'
                }
              ]
            },
            {
              speaker: '사서 교사',
              text: '조회 시간을 독서로 할당하여 아이들의 차분한 문해력을 늘리고 독서 지도력을 인정받았으나 잔소리는 약간 늘었습니다.'
            },
            {
              speaker: '사서 교사',
              text: '지나치게 의무적인 규제보다 자율적인 쿠폰과 스탬프 참여를 독려하여 학생 부담을 덜고 학교 분위기를 살렸습니다.'
            }
          ];
        } else if (npcId === 'staff_counselor') {
          steps = [
            {
              speaker: '전문상담교사',
              text: '"선생님, 저희 Wee 클래스에서 상담을 받던 학급의 부적응 학생 말입니다. 최근 심리 검사 결과 우울 수치가 높게 나왔는데, 교실에서 혹시 교우 관계 고립이나 이상 징후를 발견하셨나요?"',
              choices: [
                {
                  text: '“네, 학생이 모둠 활동 시 고립되지 않도록 짝꿍 배치에 신경 쓰고, 정서 케어를 위해 Wee 클래스 연계 치료 일정을 적극 보조하겠습니다.” (치료적 연계)',
                  nextStepIndex: 1,
                  effects: [{ stat: 'studentTrust', value: 8 }, { stat: 'expert', value: 6 }, { stat: 'colleagueSolidarity', value: 5 }, { stat: 'teachingSatisfaction', value: 6 }, { stat: 'mental', value: -4 }],
                  resultText: '"가장 전문적이고 정석적인 치료 공조네요! 선생님이 교실에서 지켜봐 주시면 아이가 교실 내 위기를 극복하는 데 큰 힘이 될 거예요."'
                },
                {
                  text: '“외부 전문 치료 기관 연계를 급하게 서두르기보다, 제가 교실에서 매일 5분씩 밀착 일대일 차담을 하며 자연스럽게 마음의 문을 열도록 돕고 싶습니다.” (교사 밀착 돌봄)',
                  nextStepIndex: 2,
                  effects: [{ stat: 'studentTrust', value: 10 }, { stat: 'educationSoshin', value: 8 }, { stat: 'teachingSatisfaction', value: 12 }, { stat: 'colleagueSolidarity', value: 2 }, { stat: 'hp', value: -6 }, { stat: 'burnout', value: 6 }],
                  resultText: '"선생님의 깊은 제자 사랑과 소신이 느껴지네요. 혹시 교실 상담 도중 위기 대응에 필요한 자료나 피드백이 필요하면 언제든 절 불러주세요."'
                }
              ]
            },
            {
              speaker: '전문상담교사',
              text: 'Wee 클래스 및 전문 외부 시스템과의 체계적 공조를 통해 치료 안전망을 확실하게 확보했습니다.'
            },
            {
              speaker: '전문상담교사',
              text: '교사의 혼신의 노력과 밀착 돌봄으로 학생의 진정 어린 마음을 이끌었으나 체력 소모가 극심해졌습니다.'
            }
          ];
        } else if (npcId === 'staff_science_assistant') {
          steps = [
            {
              speaker: '과학실무사',
              text: '"선생님, 다음 차시에 있을 \'화학 용액 혼합 실험\' 말이에요. 위험한 시약 폐기물이 다량 발생하는데, 용액 종류별 폐기 수거함 라벨 처리를 학생들이 직접 철저히 하도록 서명 안전교육을 지도해 주셨나요?"',
              choices: [
                {
                  text: '“네, 실험 전에 폐액 규정 수칙 영상을 시청하고, 수거함 분류가 어긋날 경우 벌점을 부여할 정도로 과학실 내 안전 규칙을 철저히 훈육하겠습니다.” (안전 원칙 훈육)',
                  nextStepIndex: 1,
                  effects: [{ stat: 'educationSoshin', value: 6 }, { stat: 'colleagueRelation', value: 5 }, { stat: 'colleagueSolidarity', value: 5 }, { stat: 'studentTrust', value: -3 }],
                  resultText: '"휴, 선생님이 확실히 잡아주시니 마음이 편하네요. 안전사고 예방이 최우선이니까요. 안전 장갑과 보안경 세트를 꼼꼼히 소독해 둘게요."'
                },
                {
                  text: '“학생들이 어려워하는 분류 작업이니, 담임인 제가 직접 칠판 앞에서 주도하여 폐액 처리를 대행하고, 과학실무사님과 공동 마무리를 짓겠습니다.” (교사 솔선수범)',
                  nextStepIndex: 2,
                  effects: [{ stat: 'studentTrust', value: 5 }, { stat: 'colleagueRelation', value: 3 }, { stat: 'colleagueSolidarity', value: 3 }, { stat: 'teachingSatisfaction', value: 3 }, { stat: 'hp', value: -4 }, { stat: 'burnout', value: 3 }],
                  resultText: '"선생님이 직접 솔선수범해주셔서 감사하긴 하지만, 교사도 무리하시면 피로가 누적되니 안전 절차와 감독 위주로 챙겨주셔도 충분해요."'
                }
              ]
            },
            {
              speaker: '과학실무사',
              text: '단호한 안전 규칙 훈육으로 과학실 안전사고 위험을 0%에 수렴시켰으나 학생들은 다소 경직되었습니다.'
            },
            {
              speaker: '과학실무사',
              text: '교사가 직접 폐기 정리를 보조하여 실험 안전 책임을 다하고 실무사와의 원만한 연대를 다졌습니다.'
            }
          ];
        } else if (npcId === 'staff_guard') {
          steps = [
            {
              speaker: '배움터지킴이',
              text: '"김 선생님! 오늘 아침 등교 시간에 어떤 학부모 차량이 학교 교문 안쪽 금지 구역까지 무단 진입하려고 하더군. 제재를 가했더니 오히려 소리를 쳐서 마찰이 빚어졌는데, 담임으로서 면담과 규정 설명을 좀 부탁합니다."',
              choices: [
                {
                  text: '“알겠습니다. 학교 안전 매뉴얼에 명시된 차량 출입 규정 공문서를 출력하여, 해당 학부모님께 단호하고 냉정하게 설명해 드리겠습니다.” (원칙적 매뉴얼 조치)',
                  nextStepIndex: 1,
                  effects: [{ stat: 'parentTrust', value: -2 }, { stat: 'reputation', value: 6 }, { stat: 'educationSoshin', value: 6 }, { stat: 'colleagueSolidarity', value: 5 }, { stat: 'parentComplaint', value: 10 }, { stat: 'adminTrust', value: 5 }],
                  resultText: '"오! 지킴이로서도 규칙대로 딱 부러지게 끊어 주시니 참 든든하고 속이 시원합니다. 안전이 장난이 아니지요."'
                },
                {
                  text: '“학부모님의 개인적 사정이 급박했을 수 있으니, 우선은 유선상으로 부드럽게 사정을 여쭙고 상황을 양해하며 서서히 안전 계도를 진행하겠습니다.” (온건적 중재)',
                  nextStepIndex: 2,
                  effects: [{ stat: 'parentTrust', value: 6 }, { stat: 'colleagueRelation', value: -2 }, { stat: 'colleagueSolidarity', value: -2 }, { stat: 'parentComplaint', value: -5 }, { stat: 'mental', value: -3 }],
                  resultText: '"음... 법과 안전에는 예외가 없어야 등교 안전 지도가 서는데 조금 아쉽구만. 그래도 선생님 뜻이니 학부모 상담을 잘 마쳐주구랴."'
                }
              ]
            },
            {
              speaker: '배움터지킴이',
              text: '강경하고 완고하게 학내 교통 규정을 수호하여 교통사고 위험을 줄이고 학교 기강 평판을 세웠습니다.'
            },
            {
              speaker: '배움터지킴이',
              text: '학부모의 사정을 귀 담아 듣고 이해하여 갈등 없이 온건하게 교통안전을 설득하고 신뢰를 구축했습니다.'
            }
          ];
        } else {
          steps = [
            {
              speaker: npcName,
              text: `"${npcName} 선생님, 반갑습니다! 오늘도 가상의 우리 ss 학급을 위해 같이 힘내요!" 가볍게 미소를 나누며 복도에서 인사합니다.`
            }
          ];
        }

        const updatedLogs = [
          `[${day}일차] ${npcName} 캐릭터와 RPG 멀티턴 대화 개시`,
          ...recentLogs.slice(0, 19)
        ];

        // 대화 시작 완료에 따른 완료 이력 축적
        const nextCompletedToday = [...completedNpcDialoguesToday];
        if (!nextCompletedToday.includes(npcId)) {
          nextCompletedToday.push(npcId);
        }

        const nextCompletedHistory = [...completedDialogueHistory];
        if (!nextCompletedHistory.includes(npcId)) {
          nextCompletedHistory.push(npcId);
        }

        set({
          completedNpcDialoguesToday: nextCompletedToday,
          completedDialogueHistory: nextCompletedHistory,
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
              eff.stat === 'burnout' ? 0 : 0,
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
            eff.stat === 'burnout' ? 0 : 0, 
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
            eff.stat === 'burnout' ? 0 : 0, 
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
          const isPositive = Math.random() < getTargetPositiveRatio(stats);

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
            eff.stat === 'burnout' ? 0 : 0, 
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
          stats
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

          // 2) 미결 업무 방치 패널티 정산
          overdueTasks.forEach(t => {
            overtimeStats.adminPower = clamp(overtimeStats.adminPower - 20);
            overtimeStats.expert = clamp(overtimeStats.expert - 15);
            overtimeStats.adminTrust = clamp(overtimeStats.adminTrust - 10);
            overtimeStats.reputation = clamp(overtimeStats.reputation - 8);
            overtimeStats.burnout = clamp(overtimeStats.burnout + 10);

            penaltyMessages.push(
              `[업무 미결 패널티] "${t.title}" 업무 마감 기한 초과 방치로 인해 행정역량 -20, 전문성 -15, 관리자신뢰 -10 하락 (사유: 주요 공무 연체에 따른 실무 태만)`
            );
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
              overtimeStats.colleagueRelation = clamp(overtimeStats.colleagueRelation - 5);
              overtimeStats.familySatisfaction = clamp(overtimeStats.familySatisfaction - 5);
              overtimeStats.studentTrust = clamp(overtimeStats.studentTrust - 5);

              penaltyMessages.push(
                `[감사 무응답 패널티] 제자/학부모의 격려 연락 무응답으로 동료관계 -5, 가정만족 -5, 학생신뢰 -5 하락 (사유: 긍정 힐링 소통 기회 방치)`
              );
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

          // 7) 신규 업무 업데이트 (일정 날짜 고정 업무 + 45% 확률로 랜덤 행정 업무 1~2개 추가)
          let updatedTasks = [...tasks];
          
          if (Math.random() < 0.45) {
            const taskCount = Math.floor(Math.random() * 2) + 1; // 1~2개
            for (let c = 0; c < taskCount; c++) {
              const randomTemplate = pickBalancedTaskTemplate(syncedStats);
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
          const { playerInfo } = get();
          const isNextDayWeekend = nextDay % 7 === 6 || nextDay % 7 === 0;
          const nextEvent = isNextDayWeekend ? getWeekendHealingEvent(nextDay, playerInfo?.familyState) : null;

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
            tasks: updatedTasks,
            activePhoneAndTextEvent: null
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
