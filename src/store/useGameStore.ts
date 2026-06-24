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
  StatEffect
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
          stats: initialStats,
          students: JSON.parse(JSON.stringify(initialStudents)),
          parents: JSON.parse(JSON.stringify(initialParents)),
          tasks: getInitialTasks(),
          delayedEffects: [],
          hiddenFlags: [],
          currentEvent: getEventForTime(1, 'morning', [], []),
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

        // 칠판 낙서 방지 등 시간 흐름 관리
        if (timeOfDay === 'morning') {
          // 아침 -> 오후
          const nextEvent = getEventForTime(day, 'afternoon', hiddenFlags, recentLogs);
          set({
            timeOfDay: 'afternoon',
            currentEvent: nextEvent,
            selectedChoice: null,
            eventResultText: null
          });
        } else if (timeOfDay === 'afternoon') {
          // 오후 -> 저녁
          const nextEvent = getEventForTime(day, 'evening', hiddenFlags, recentLogs);
          set({
            timeOfDay: 'evening',
            currentEvent: nextEvent,
            selectedChoice: null,
            eventResultText: null
          });
        } else if (timeOfDay === 'evening') {
          // 저녁 -> 정산 화면
          set({
            timeOfDay: 'summary',
            currentEvent: null,
            selectedChoice: null,
            eventResultText: null
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

            // 날짜 전환 및 새 아침 이벤트 수령
            const nextEvent = getEventForTime(nextDay, 'morning', hiddenFlags, recentLogs);
            
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
              currentEvent: nextEvent,
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
      }
    }),
    {
      name: 'teacher-maker-save-v1', // 로컬스토리지 저장 키
      storage: createJSONStorage(() => localStorage),
    }
  )
);
