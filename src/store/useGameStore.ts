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
  DialogueSession
} from '@/game/types';
import { initialStudents, initialParents } from '@/data/students';
import { gameEvents } from '@/data/events';

// 시간대 정의
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night' | 'summary';

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
  
  // 핵심 데이터
  stats: Stats;
  students: Student[];
  parents: Parent[];
  tasks: Task[];
  delayedEffects: DelayedEffect[];
  hiddenFlags: string[];
  completedNpcDialoguesToday: string[]; // 오늘 대화 완료한 NPC ID 목록 [NEW]
  completedDialogueHistory: string[]; // 게임 내내 통틀어 대화 완료한 NPC ID 목록 [NEW]
  
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
  toastMessage: string | null;
  
  // 액션 (조작 메서드)
  startGame: (info: PlayerInfo) => void;
  resetGame: () => void;
  selectChoice: (choice: GameChoice) => void;
  progressTime: () => void;
  completeTask: (taskId: string) => void;
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
  ) => void;
  talkToNPC: (npcId: string, npcName: string) => void;
  clearNpcDialogue: () => void;
  exploreLocation: () => void;
  closeEventResult: () => void;
  
  // 멀티턴 대화 추가 액션
  selectDialogueChoice: (choice: DialogueChoice) => void;
  advanceDialogueStep: () => void;
}

// 0 ~ 100 범위 강제 헬퍼
const clamp = (val: number, min: number = 0, max: number = 100) => 
  Math.max(min, Math.min(max, val));

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
    parentComplaint: 0         // 학부모 민원 수치 (0 ~ 100) [NEW]
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
  if (traits.includes('체력왕')) {
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

  return baseStats;
};

// 특정 날짜 범위 및 조건에 맞는 이벤트 추첨 헬퍼
const getEventForTime = (
  day: number, 
  time: TimeOfDay, 
  hiddenFlags: string[],
  history: string[]
): GameEvent | null => {
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

  const candidates = gameEvents.filter(evt => {
    // 1. 카테고리 매칭
    if (!category.includes(evt.category)) return false;
    
    // 2. 날짜 범위 확인
    const [start, end] = evt.dayRange;
    if (day < start || day > end) return false;
    
    // 3. 중복 방지 (이미 실행된 이벤트 제외)
    if (history.includes(evt.id)) return false;
    
    // 4. 선결 요건 검사
    if (evt.prerequisites && evt.prerequisites.length > 0) {
      const hasAll = evt.prerequisites.every(flag => hiddenFlags.includes(flag));
      if (!hasAll) return false;
    }
    
    return true;
  });

  if (candidates.length === 0) return null;

  // 가중치 비례 랜덤 추출
  const totalWeight = candidates.reduce((sum, e) => sum + e.weight, 0);
  let randomVal = Math.random() * totalWeight;
  
  for (const evt of candidates) {
    randomVal -= evt.weight;
    if (randomVal <= 0) {
      return evt;
    }
  }

  return candidates[0];
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
        parentComplaint: 0
      },
      students: [],
      parents: [],
      tasks: [],
      delayedEffects: [],
      hiddenFlags: [],
      completedNpcDialoguesToday: [],
      completedDialogueHistory: [],
      
      currentEvent: null,
      selectedChoice: null,
      eventResultText: null,
      dayEffectsTriggered: [],
      
      actionPoints: 4,
      maxActionPoints: 4,
      
      recentLogs: [],
      toastMessage: null,

      // 알림 표출
      showToast: (msg: string) => set({ toastMessage: msg }),
      clearToast: () => set({ toastMessage: null }),

      // 1. 새로운 게임 시작
      startGame: (info: PlayerInfo) => {
        const initialStats = getInitialStats(info.difficulty, info.traits);
        
        // 난이도 및 교직 경력에 따른 행동 포인트 한도 조절
        let maxAP = 4;
        if (info.traits.includes('체력왕')) maxAP = 5;
        if (info.difficulty === 'hard') maxAP = 3;

        // Fisher-Yates 셔플 알고리즘으로 학생 풀 40명 셔플링
        const shuffledStudents = [...initialStudents];
        for (let i = shuffledStudents.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledStudents[i], shuffledStudents[j]] = [shuffledStudents[j], shuffledStudents[i]];
        }
        
        // 상위 10명 선택
        const selectedStudents = shuffledStudents.slice(0, 10);
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
          currentEvent: null, // 시작 직후 아침에는 지도를 보고 탐색하도록 null 설정
          selectedChoice: null,
          eventResultText: null,
          dayEffectsTriggered: [],
          actionPoints: maxAP,
          maxActionPoints: maxAP,
          recentLogs: ['새 학기 첫 출근을 시작했습니다. 90일 교사 서사가 막을 올립니다.']
        });
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
          recentLogs: []
        });
      },

      // 3. 선택지 선택
      selectChoice: (choice: GameChoice) => {
        const { stats, hiddenFlags, delayedEffects, day, recentLogs, students } = get();
        
        // 스탯 즉각 효과 반영
        const newStats = { ...stats };
        choice.immediateEffects.forEach((eff: StatEffect) => {
          newStats[eff.stat] = clamp(
            newStats[eff.stat] + eff.value, 
            eff.stat === 'burnout' ? 0 : 0, 
            100
          );
        });

        // 지연 효과 큐 처리
        const newDelayedEffects = [...delayedEffects];
        if (choice.delayedEffects && choice.delayedEffects.length > 0) {
          choice.delayedEffects.forEach(delayed => {
            newDelayedEffects.push({
              ...delayed,
              // dayTrigger에 상대 날짜 갭 더하기 (현재 날짜 + Gap)
              dayTrigger: clamp(day + delayed.dayTrigger, 1, 30)
            });
          });
        }

        // 숨겨진 성향 카운터 업데이트 및 플래그 적재
        const newFlags = [...hiddenFlags];
        if (choice.hiddenFlags) {
          choice.hiddenFlags.forEach(flag => {
            if (!newFlags.includes(flag)) {
              newFlags.push(flag);
            }
          });
        }

        // 로그 기록
        const updatedLogs = [
          `[${day}일차] ${choice.intent} 선택 -> ${choice.text}`,
          ...recentLogs.slice(0, 19)
        ];

        // 학생 수치 동기화 예외 처리 (선택지에 따라 특정 학생 상태 보정)
        const updatedStudents = students.map(stud => {
          // 지훈 관련 카테고리
          if (choice.id.includes('s05_2') && stud.id === 'student_jihun') {
            return { ...stud, behavior: clamp(stud.behavior + 15), teacherTrust: clamp(stud.teacherTrust + 20) };
          }
          if (choice.id.includes('s05_3') && stud.id === 'student_jihun') {
            return { ...stud, behavior: clamp(stud.behavior - 10), peerRelation: clamp(stud.peerRelation - 15) };
          }
          // 민준 불안 극복
          if (choice.id.includes('s07_1') && stud.id === 'student_minjun') {
            return { ...stud, selfEsteem: clamp(stud.selfEsteem + 15), teacherTrust: clamp(stud.teacherTrust + 15) };
          }
          if (choice.id.includes('s07_2') && stud.id === 'student_minjun') {
            return { ...stud, selfEsteem: clamp(stud.selfEsteem - 15), motivation: clamp(stud.motivation + 5) };
          }
          return stud;
        });

        set({
          stats: newStats,
          delayedEffects: newDelayedEffects,
          hiddenFlags: newFlags,
          selectedChoice: choice,
          eventResultText: choice.resultText,
          recentLogs: updatedLogs,
          students: updatedStudents
        });
      },

      // 4. 시간 흐름 전진
      progressTime: () => {
        const { 
          day, 
          timeOfDay, 
          recentLogs, 
          hiddenFlags, 
          maxActionPoints 
        } = get();

        if (timeOfDay === 'morning') {
          // 아침 -> 오후 (지도를 통해 다시 이동하도록 location을 null로 초기화)
          set({
            timeOfDay: 'afternoon',
            currentLocation: null,
            currentEvent: null,
            selectedChoice: null,
            eventResultText: null,
            currentNpcDialogue: null
          });
        } else if (timeOfDay === 'afternoon') {
          // 오후 -> 저녁 (저녁은 집/개인 활동이므로 기존 방식대로 저녁 이벤트를 자동 추점)
          const nextEvent = getEventForTime(day, 'evening', hiddenFlags, recentLogs);
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
            const { tasks } = get();
            const overdueTasks = tasks.filter(t => !t.isCompleted && t.deadlineDay < nextDay);
            const penaltyStats = { ...get().stats };
            let repLoss = 0;
            let stressGain = 0;

            overdueTasks.forEach(() => {
              repLoss += 8;
              stressGain += 10;
            });

            if (overdueTasks.length > 0) {
              penaltyStats.reputation = clamp(penaltyStats.reputation - repLoss);
              penaltyStats.burnout = clamp(penaltyStats.burnout + stressGain);
              penaltyStats.adminTrust = clamp(penaltyStats.adminTrust - 5);
            }

            // 매일 아침 행동 포인트(AP) 갱신 (체력이 바닥이거나 번아웃이 극심하면 AP 차감)
            let dailyAP = maxActionPoints;
            if (penaltyStats.hp < 30) dailyAP -= 1;
            if (penaltyStats.burnout > 80) dailyAP -= 1;
            dailyAP = Math.max(1, dailyAP);

            // RPG 버전: 새 날 아침 시작 시 지도가 먼저 열려야 하므로 아침 랜덤 이벤트 자동 추첨은 제거
            
            // 업무 기한 리셋/업데이트 (일정 날짜에 새 업무 할당)
            let updatedTasks = [...tasks];
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

            set({
              day: nextDay,
              timeOfDay: 'morning',
              stats: penaltyStats,
              actionPoints: dailyAP,
              currentLocation: null,
              currentNpcDialogue: null,
              currentEvent: null, // 지도를 보고 아침 활동 시작
              selectedChoice: null,
              eventResultText: null,
              dayEffectsTriggered: [],
              completedNpcDialoguesToday: [],
              tasks: updatedTasks
            });
          }
        }
      },

      // 5. 수동 행정 업무 완료
      completeTask: (taskId: string) => {
        const { tasks, actionPoints, stats } = get();
        const target = tasks.find(t => t.id === taskId);
        
        if (!target || target.isCompleted) return;
        if (actionPoints < target.estimatedTime) {
          get().showToast('행동 포인트(AP)가 부족하여 업무를 완료할 수 없습니다.');
          return;
        }

        const newStats = { ...stats };
        // 업무 완료 보상 및 패널티 스탯 반영
        newStats.adminPower = clamp(newStats.adminPower + 5);
        newStats.adminTrust = clamp(newStats.adminTrust + target.reputationReward);
        newStats.burnout = clamp(newStats.burnout + target.stressCost);
        newStats.hp = clamp(newStats.hp - 10);

        set({
          tasks: tasks.map(t => t.id === taskId ? { ...t, isCompleted: true } : t),
          actionPoints: actionPoints - target.estimatedTime,
          stats: newStats
        });
        
        get().showToast(`[업무완료] "${target.title}"을 완수하여 평판이 올랐습니다!`);
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
          stats: newStats,
          delayedEffects: remainingEffects,
          dayEffectsTriggered: effectMessages
        });
        get().checkFailureConditions();
      },

      // 8. 30일차 최종 엔딩 조건 계산
      checkEndingConditions: () => {
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
        const { stats } = get();
        if (stats.hp <= 0) {
          set({ endingId: 'ending_gameover_hp' });
          return true;
        }
        if (stats.mental <= 0) {
          set({ endingId: 'ending_gameover_mental' });
          return true;
        }
        if (stats.burnout >= 100) {
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

      // 11. RPG 장소 탐색 (사건 트리거, AP 1 소모)
      exploreLocation: () => {
        const { currentLocation, day, hiddenFlags, recentLogs, actionPoints } = get();
        if (!currentLocation) return;
        if (actionPoints < 1) {
          get().showToast('행동 포인트(AP)가 부족하여 탐색할 수 없습니다.');
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
            const hasAll = evt.prerequisites.every(flag => hiddenFlags.includes(flag));
            if (!hasAll) return false;
          }
          return true;
        });

        if (candidates.length === 0) {
          get().showToast('더 이상 이 장소에서 탐색할 수 있는 새로운 사건이 없습니다.');
          return;
        }

        // 랜덤 가중치로 선택
        const totalWeight = candidates.reduce((sum, e) => sum + e.weight, 0);
        let randomVal = Math.random() * totalWeight;
        let selectedEvt = candidates[0];

        for (const evt of candidates) {
          randomVal -= evt.weight;
          if (randomVal <= 0) {
            selectedEvt = evt;
            break;
          }
        }

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
      ) => {
        const { actionPoints, stats, day, recentLogs } = get();
        if (actionPoints < 1) {
          get().showToast('행동 포인트(AP)가 부족하여 행동을 수행할 수 없습니다.');
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
        }

        const updatedLogs = [
          `[${day}일차] ${msg}`,
          ...recentLogs.slice(0, 19)
        ];

        set({
          actionPoints: actionPoints - 1,
          stats: newStats,
          recentLogs: updatedLogs
        });

        get().showToast(msg);
        get().checkFailureConditions();
      },

      // 13. RPG 캐릭터 대화 개시 (AP를 소모하지 않는 이벤트성 대화)
      talkToNPC: (npcId: string, npcName: string) => {
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
        } else if (npcId === 'staff_nutritionist') {
          steps = [
            {
              speaker: '영양 교사',
              text: '"선생님, 오늘 점심에 나간 \'마라 떡볶이\' 식단 말이에요. 몇몇 학부모님들께서 아이들이 배가 아프다고 학교 홈페이지에 매운맛 자제를 요하는 민원을 올리셨다는데, 학급 학생들의 의견은 어땠나요?"',
              choices: [
                {
                  text: '“아이들은 매우 맛있게 먹었으나, 매운맛 조절이 어려운 저학년 및 위장이 약한 아이들을 위해 덜 매운 식단으로 조정을 건의드립니다.” (민원 수용적 중재)',
                  nextStepIndex: 1,
                  effects: [{ stat: 'parentTrust', value: 6 }, { stat: 'colleagueRelation', value: 4 }, { stat: 'colleagueSolidarity', value: 5 }, { stat: 'parentComplaint', value: -5 }, { stat: 'studentTrust', value: -2 }],
                  resultText: '"그렇군요. 학부모님들 걱정도 일리가 있으니, 다음 식단 편성 시에는 고춧가루 비율을 줄여 백 마라나 순한 맛으로 변경할게요."'
                },
                {
                  text: '“요즘 학생들의 다양한 트렌드 식단 선호도와 식사 자율성을 존중할 필요가 있습니다. 민원 제기자만을 위한 과도한 규제는 피하는 게 맞습니다.” (급식 자율성 옹호)',
                  nextStepIndex: 2,
                  effects: [{ stat: 'studentTrust', value: 6 }, { stat: 'educationSoshin', value: 5 }, { stat: 'colleagueSolidarity', value: -2 }, { stat: 'parentComplaint', value: 5 }, { stat: 'parentTrust', value: -4 }],
                  resultText: '"하긴... 급식 때 애들 눈빛이 마라 떡볶이 보고 엄청 반짝이긴 했죠. 다각도로 수렴해서 맛과 영양, 민원의 절충안을 찾아볼게요."'
                }
              ]
            },
            {
              speaker: '영양 교사',
              text: '민원을 합리적으로 조율하여 급식실 식단 안전 조정을 유도하고 학부모 신뢰를 지켜냈습니다.'
            },
            {
              speaker: '영양 교사',
              text: '학생들의 선호도를 수호하여 학생들의 행복 지수를 높였으나 매운 음식에 대한 학부모 일부 불만은 지속됩니다.'
            }
          ];
        } else if (npcId === 'staff_cook') {
          steps = [
            {
              speaker: '조리원 아주머니',
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
              speaker: '조리원 아주머니',
              text: '조리원분들과 끈끈한 인간미를 나누며 마음의 힐링과 풍성한 영양 보충을 완료했습니다.'
            },
            {
              speaker: '조리원 아주머니',
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

        // 결과 리액션 피드백이 있는 경우
        if (choice.resultText) {
          set({
            stats: newStats,
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
              stats: newStats,
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
              stats: newStats,
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
      }
    }),
    {
      name: 'teacher-maker-save-v1', // 로컬스토리지 저장 키
      storage: createJSONStorage(() => localStorage),
    }
  )
);
