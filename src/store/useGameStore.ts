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
  
  // RPG 고도화 관련 신규 액션
  moveToLocation: (loc: LocationType | null) => void;
  executeLocationAction: (actionType: 'classroom_lead' | 'office_work' | 'health_rest' | 'playground_train' | 'principal_chat') => void;
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
    careerPoint: 0
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
        careerPoint: 0
      },
      students: [],
      parents: [],
      tasks: [],
      delayedEffects: [],
      hiddenFlags: [],
      
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
          students: JSON.parse(JSON.stringify(initialStudents)),
          parents: JSON.parse(JSON.stringify(initialParents)),
          tasks: getInitialTasks(),
          delayedEffects: [],
          hiddenFlags: [],
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
      },

      // 8. 30일차 최종 엔딩 조건 계산
      checkEndingConditions: () => {
        const { stats, hiddenFlags } = get();
        let finalEnding = 'ending_sustainable'; // 기본 엔딩

        // 장학사 엔딩 조건
        if (
          stats.careerPoint >= 40 &&
          stats.adminPower >= 70 &&
          stats.educationSoshin >= 60
        ) {
          finalEnding = 'ending_supervisor';
        }
        // 관리자 엔딩 조건
        else if (
          stats.adminTrust >= 75 &&
          stats.reputation >= 70 &&
          stats.colleagueRelation >= 60
        ) {
          finalEnding = 'ending_administrator';
        }
        // 원로 교육전문가 엔딩 조건
        else if (
          stats.studentTrust >= 80 &&
          stats.expert >= 75 &&
          stats.educationSoshin >= 70
        ) {
          finalEnding = 'ending_expert';
        }
        // 혁신/테크 교사 엔딩 조건
        else if (
          hiddenFlags.includes('innovation_tendency') &&
          stats.expert >= 70 &&
          stats.reputation >= 60
        ) {
          finalEnding = 'ending_innovator';
        }
        // 번아웃으로 인한 건강 탈출 엔딩
        else if (stats.burnout >= 90 || stats.hp <= 15) {
          finalEnding = 'ending_burnout';
        }
        // 학급/가정 불화 대폭발 엔딩
        else if (stats.familySatisfaction <= 30) {
          finalEnding = 'ending_family_rupture';
        }
        // 평범하게 칼퇴하며 가정을 지킨 훌륭한 생존 교사
        else if (stats.familySatisfaction >= 80 && stats.studentTrust >= 50) {
          finalEnding = 'ending_sustainable';
        }
        // 일반 평교사로 마감
        else {
          finalEnding = 'ending_general';
        }

        set({ endingId: finalEnding });
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

      // 11. RPG 장소 탐색 (사건 트리거)
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
        } else {
          // 보건실은 이벤트 없음
          get().showToast('이 장소는 평화롭습니다. 휴식을 취하세요.');
          return;
        }

        // 해당 카테고리와 날짜에 맞는 후보군 필터링
        const candidates = gameEvents.filter(evt => {
          if (!categories.includes(evt.category)) return false;
          const [start, end] = evt.dayRange;
          if (day < start || day > end) return false;
          if (recentLogs.some(log => log.includes(evt.title))) return false; // 최근 로그 기반 중복 방지 (간단 체크)
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

      // 12. RPG 장소 고유 행동 (AP 1 소모)
      executeLocationAction: (actionType: 'classroom_lead' | 'office_work' | 'health_rest' | 'playground_train' | 'principal_chat') => {
        const { actionPoints, stats } = get();
        if (actionPoints < 1) {
          get().showToast('행동 포인트(AP)가 부족하여 행동을 수행할 수 없습니다.');
          return;
        }

        const newStats = { ...stats };
        let msg = '';

        if (actionType === 'classroom_lead') {
          newStats.studentTrust = clamp(newStats.studentTrust + 5);
          newStats.mental = clamp(newStats.mental - 2);
          msg = '교실에서 학급 훈육 및 조회를 진행했습니다. (학생 신뢰도 +5, 멘탈 -2)';
        } else if (actionType === 'office_work') {
          newStats.adminPower = clamp(newStats.adminPower + 5);
          newStats.mental = clamp(newStats.mental - 2);
          msg = '교무실에서 밀린 기안 공문을 우선적으로 처리했습니다. (행정 역량 +5, 멘탈 -2)';
        } else if (actionType === 'health_rest') {
          newStats.hp = clamp(newStats.hp + 15);
          newStats.mental = clamp(newStats.mental + 10);
          newStats.burnout = clamp(newStats.burnout - 10, 0, 100);
          msg = '보건실 간이 침대에서 휴식을 취했습니다. (체력 +15, 멘탈 +10, 번아웃 -10)';
        } else if (actionType === 'playground_train') {
          newStats.hp = clamp(newStats.hp + 10);
          newStats.burnout = clamp(newStats.burnout - 15, 0, 100);
          msg = '운동장을 산책하며 체력을 기르고 스트레스를 날렸습니다. (체력 +10, 번아웃 -15)';
        } else if (actionType === 'principal_chat') {
          newStats.adminTrust = clamp(newStats.adminTrust + 5);
          newStats.educationSoshin = clamp(newStats.educationSoshin + 5);
          msg = '교장선생님과 따뜻한 차를 마시며 교육 건의를 했습니다. (관리자 신뢰 +5, 교육 소신 +5)';
        }

        set({
          actionPoints: actionPoints - 1,
          stats: newStats
        });

        get().showToast(msg);
      },

      // 13. RPG NPC 상호작용 대화 (멀티턴 세션 바인딩)
      talkToNPC: (npcId: string, npcName: string) => {
        const { day, recentLogs } = get();
        let steps: DialogueStep[] = [];

        if (npcId === 'student_jihun') {
          steps = [
            {
              speaker: '박지훈',
              text: '"쌤! 이번 방과후 컴퓨터 실습 시간에 몰래 게임 깔아도 돼요? 제발요~ 쌤 진짜 믿어요!" 지훈이가 눈을 반짝이며 애원합니다.',
              choices: [
                {
                  text: '“안 돼! 컴퓨터실은 학습 공간이야. 규정을 지켜야 해.” (단호한 훈육)',
                  nextStepIndex: 1,
                  effects: [{ stat: 'studentTrust', value: -5 }, { stat: 'educationSoshin', value: 5 }],
                  resultText: '"쳇, 쌤은 너무 깐깐해요... 애들 다 뒤에서 몰래 하는데... 선생님만 몰라요."'
                },
                {
                  text: '“수업 진도를 완벽히 끝마치고 남는 시간에만 허락할게.” (협상 및 타협)',
                  nextStepIndex: 2,
                  effects: [{ stat: 'studentTrust', value: 5 }, { stat: 'expert', value: 3 }, { stat: 'mental', value: -2 }],
                  resultText: '"오! 진짜죠? 약속한 거예요! 오늘 수업 완전 초집중해서 1등으로 다 끝낼게요!" 지훈이의 눈빛이 살아납니다.'
                }
              ]
            },
            {
              speaker: '박지훈',
              text: '지훈이가 입술을 삐죽거리며 컴퓨터 책상으로 돌아갑니다. 단호하지만 필요한 원칙을 세웠습니다.'
            },
            {
              speaker: '박지훈',
              text: '지훈이는 놀랍게도 수업 시간 내내 딴짓을 하지 않고 과제를 먼저 제출하려 노력합니다. 적당한 보상이 유효했습니다.'
            }
          ];
        } else if (npcId === 'student_minjun') {
          steps = [
            {
              speaker: '최민준',
              text: '"선생님, 이번 시험 성적이 조금 떨어졌다고 집에서 부모님께 심한 말을 들었어요... 더 공부해야 하는데 숨이 턱턱 막혀요." 민준이가 고개를 숙인 채 말합니다.',
              choices: [
                {
                  text: '“성적보다 민준이 네 노력이 소중해. 부모님께는 내가 잘 설명할게.” (정서적 지지)',
                  nextStepIndex: 1,
                  effects: [{ stat: 'studentTrust', value: 8 }, { stat: 'mental', value: 5 }, { stat: 'burnout', value: 2 }],
                  resultText: '"진짜요...? 부모님이 쌤 말씀은 잘 들으시니까... 왠지 마음이 훨씬 가벼워졌어요. 감사해요 쌤..."'
                },
                {
                  text: '“아쉬운 부분은 있지만, 오답 노트를 분석해 다음 실수를 줄여나가자.” (이성적 해법)',
                  nextStepIndex: 2,
                  effects: [{ stat: 'expert', value: 5 }, { stat: 'studentTrust', value: -2 }],
                  resultText: '"네... 그렇겠죠. 제가 실수를 줄였어야 했는데... 오답 분석 다시 철저하게 해서 보완할게요."'
                }
              ]
            },
            {
              speaker: '최민준',
              text: '민준이의 표정이 한결 부드러워졌습니다. 마음의 불안감을 덜어주는 교사의 격려가 큰 위로가 되었습니다.'
            },
            {
              speaker: '최민준',
              text: '민준이가 깊이 숨을 고르고 시험지를 다시 꺼냅니다. 학업 분석을 통해 다음 도전을 준비할 에너지를 충전했습니다.'
            }
          ];
        } else if (npcId === 'student_jihyun') {
          steps = [
            {
              speaker: '이지현',
              text: '"선생님... 모둠 과학 탐구 과제를 할 때 친구들이 은근히 저를 모둠에 끼워주지 않는 것 같아요. 눈치 보여서 먼저 말을 못 걸겠어요." 지현이가 조심스레 말합니다.',
              choices: [
                {
                  text: '“지현아, 선생님이 직접 모둠장에게 조용히 얘기해서 널 활달한 조에 매칭해 줄게.” (밀착 중재)',
                  nextStepIndex: 1,
                  effects: [{ stat: 'studentTrust', value: 4 }, { stat: 'mental', value: -2 }],
                  resultText: '"감사해요 쌤... 하지만 혹시 친구들이 제가 일러바쳤다고 생각해서 더 어색해지면 어쩌죠...?"'
                },
                {
                  text: '“그럼 모둠 구성을 공정하게 제비뽑기로 다시 돌려서 다 같이 섞이게 하자.” (제도적 배려)',
                  nextStepIndex: 2,
                  effects: [{ stat: 'studentTrust', value: 5 }, { stat: 'educationSoshin', value: 5 }],
                  resultText: '"네! 차라리 제비뽑기로 정해지면 저도 친구들도 억울하거나 불편할 일 없이 마음 편하게 섞일 수 있을 것 같아요!"'
                }
              ]
            },
            {
              speaker: '이지현',
              text: '지현이가 걱정 반 기대 반의 눈빛으로 돌아갑니다. 세심한 관찰을 동반한 교사의 중재가 지속적으로 필요해 보입니다.'
            },
            {
              speaker: '이지현',
              text: '제비뽑기로 무사히 모둠이 재구성되어 지현이가 자연스레 팀에 안착했습니다. 교실 안의 소외 없는 공정함을 실천했습니다.'
            }
          ];
        } else if (npcId === 'colleague_senior') {
          steps = [
            {
              speaker: '김 부장 교사',
              text: '"김 선생님, 교육청에서 급히 내려온 학부모 학교 만족도 조사 취합 공문이 말이야. 오늘 4시까지 기안 올려야 하는데 처리 가능하겠나?" 부장님이 조급하게 물으십니다.',
              choices: [
                {
                  text: '“네, 부장님! 하던 교실 청소를 미뤄두고 곧장 처리하여 결재 올리겠습니다.” (행정 순응)',
                  nextStepIndex: 1,
                  effects: [{ stat: 'adminTrust', value: 5 }, { stat: 'adminPower', value: 5 }, { stat: 'hp', value: -10 }, { stat: 'burnout', value: 10 }],
                  resultText: '"역시 김 선생님! 일을 명확하고 기동력 있게 처리해 주니 학교가 아주 부드럽게 굴러가요! 정말 든든해."'
                },
                {
                  text: '“부장님, 현재 교실에 상담 대기 중인 학생이 있어, 대단히 죄송하지만 퇴근 전인 5시까지 처리해도 될까요?” (기한 협상)',
                  nextStepIndex: 2,
                  effects: [{ stat: 'mental', value: 5 }, { stat: 'adminTrust', value: -2 }, { stat: 'studentTrust', value: 5 }],
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
              text: '"김 선생님! 오늘따라 어깨가 유독 축 처져 보여요. 오늘 저녁 퇴근하고 학교 앞 고깃집에서 삼겹살 구우면서 쿨메신저 스트레스 털어낼까요?" 동료 교사가 물어봅니다.',
              choices: [
                {
                  text: '“좋습니다! 맛있는 고기 먹고 하소연도 하면서 힐링하고 싶네요.” (사교적 힐링)',
                  nextStepIndex: 1,
                  effects: [{ stat: 'colleagueRelation', value: 8 }, { stat: 'mental', value: 15 }, { stat: 'familySatisfaction', value: -10 }, { stat: 'hp', value: -5 }],
                  resultText: '"나이스! 오늘 제가 기가 막힌 맛집으로 모실 테니 술 한잔 기울이면서 교직 라이프 푸념 실컷 해보자고요!"'
                },
                {
                  text: '“마음은 너무나 감사하지만, 오늘은 가정에 일이 있어서 얼른 들어가 봐야 합니다.” (가정 우선 거절)',
                  nextStepIndex: 2,
                  effects: [{ stat: 'familySatisfaction', value: 10 }, { stat: 'colleagueRelation', value: 2 }],
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
                  resultText: '"아보고 참 부지런하시기도 해라... 약 꼭 챙겨드시고, 정 무리다 싶으시면 언제든 여기 와서 누워 계세요."'
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
                  effects: [{ stat: 'hp', value: 15 }, { stat: 'mental', value: 5 }, { stat: 'burnout', value: -10 }, { stat: 'colleagueRelation', value: 5 }],
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
        } else {
          steps = [
            {
              speaker: npcName,
              text: `"${npcName} 선생님, 반갑습니다! 오늘도 우리 ss 학급을 위해 같이 힘내요!" 가볍게 미소를 나누며 복도에서 인사합니다.`
            }
          ];
        }

        const updatedLogs = [
          `[${day}일차] ${npcName} 캐릭터와 RPG 멀티턴 대화 개시`,
          ...recentLogs.slice(0, 19)
        ];

        set({
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
