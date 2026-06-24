import React, { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import type { TimeOfDay } from '@/store/useGameStore';
import { 
  Heart, 
  Brain, 
  Flame, 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  Smartphone, 
  ChevronRight, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  LogOut,
  Sparkles,
  Info
} from 'lucide-react';
import type { Student } from '@/game/types';

interface DashboardLayoutProps {
  onExitGame: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onExitGame }) => {
  const {
    day,
    timeOfDay,
    playerInfo,
    stats,
    students,
    tasks,
    currentEvent,
    selectedChoice,
    eventResultText,
    dayEffectsTriggered,
    actionPoints,
    maxActionPoints,
    recentLogs,
    toastMessage,
    selectChoice,
    progressTime,
    completeTask,
    delegateTask,
    clearToast,
    
    currentLocation,
    moveToLocation,
    executeLocationAction,
    talkToNPC,
    clearNpcDialogue,
    exploreLocation,
    closeEventResult,
    
    npcDialogueSession,
    selectDialogueChoice,
    advanceDialogueStep,

    dailyNpcPlacement,
    completedNpcDialoguesToday,
    completedDialogueHistory,
    messengerNotifications,
    activeMessengerEvent,
    triggerMessengerAction,
    selectMessengerChoice,
    closeMessengerEvent
  } = useGameStore();

  // 모바일 화면용 탭 상태 ('center' = 교실/사건, 'left' = 학급현황, 'right' = 스마트폰/업무)
  const [activeTab, setActiveTab] = useState<'center' | 'left' | 'right'>('center');
  
  // 층간 상태 (1층 ⇄ 2층)
  const [currentFloor, setCurrentFloor] = useState<1 | 2>(1);

  // 장소별 한글 명칭 및 테마 스타일 설정 헬퍼
  const getLocationTheme = (loc: string) => {
    switch (loc) {
      case 'classroom':
        return { name: '우리 반 교실', color: 'bg-emerald-900 border-emerald-500 text-white', desc: '아이들의 열기와 소음이 가득한 우리 반 교실입니다. 학급 조회를 하거나 학생 지도를 할 수 있습니다.' };
      case 'office':
        return { name: '교무실', color: 'bg-slate-800 border-slate-500 text-white', desc: '밀린 공문과 전화벨 소리가 요란한 행정의 요람입니다. 행정 처리가 가능합니다.' };
      case 'health_room':
        return { name: '보건실', color: 'bg-teal-900 border-teal-500 text-white', desc: '아늑하고 조용한 쉼터입니다. 지친 피로와 스트레스를 충전하세요.' };
      case 'playground':
        return { name: '운동장', color: 'bg-orange-950 border-orange-600 text-white', desc: '푸른 잔디와 트랙이 시원하게 뻗어 있습니다. 기초 체력을 단련하기 좋습니다.' };
      case 'principal_room':
        return { name: '교장실', color: 'bg-amber-950 border-amber-600 text-white', desc: '묵직하고 조용한 차실입니다. 관리자들과 면담하고 소신을 피력하세요.' };
      case 'admin_office':
        return { name: '행정실', color: 'bg-cyan-900 border-cyan-600 text-white', desc: '학교의 예산과 시설 기획 처리가 진행되는 곳입니다. 재무 협조를 요청하세요.' };
      case 'cafeteria':
        return { name: '급식실', color: 'bg-yellow-950 border-yellow-600 text-white', desc: '고소한 냄새가 진동하는 조리실 앞입니다. 급식 지도 및 배식 봉사를 도우세요.' };
      case 'library':
        return { name: '도서실', color: 'bg-blue-950 border-blue-600 text-white', desc: '차분한 정적이 흐르는 지식의 보고입니다. 신간 정리나 도서 지도 노하우를 얻으세요.' };
      case 'wee_class':
        return { name: '상담실(Wee 클래스)', color: 'bg-pink-900 border-pink-500 text-white', desc: '위기 학생의 쉼터와 심리 상담이 연동되는 상담 교실입니다.' };
      case 'science_lab':
        return { name: '과학실', color: 'bg-violet-950 border-violet-600 text-white', desc: '현미경과 온갖 실험 용액이 가득한 연구실입니다. 안전 수칙을 면밀히 관리하세요.' };
      case 'school_gate':
        return { name: '교문', color: 'bg-stone-900 border-stone-500 text-white', desc: '학생들이 활기차게 등교하는 학교의 입구입니다. 등교 안전 지도를 할 수 있습니다.' };
      case 'gym_room':
        return { name: '체육실', color: 'bg-emerald-950 border-emerald-600 text-white', desc: '체육 전담 교사가 상주하는 교구 비품실 성격의 공간입니다.' };
      case 'gymnasium':
        return { name: '체육관', color: 'bg-teal-950 border-teal-600 text-white', desc: '넓은 실내 농구 골대와 강당이 갖춰진 넓은 체육관입니다. 안전 점검이 필요합니다.' };
      case 'class_grade1':
        return { name: '1학년 교실', color: 'bg-red-950 border-red-600 text-white', desc: '파릇파릇한 1학년 꼬마들이 있는 곳입니다. 기초 한글 낱말 지도를 관찰 연구하세요.' };
      case 'class_grade2':
        return { name: '2학년 교실', color: 'bg-amber-900 border-amber-500 text-white', desc: '구구단을 외우는 초등 2학년 교실입니다. 기초 학습 보충 가이드가 필요합니다.' };
      case 'class_grade3':
        return { name: '3학년 교실', color: 'bg-yellow-900 border-yellow-500 text-white', desc: '말대답이 늘기 시작하고 사춘기에 접어드는 3학년 교실입니다.' };
      case 'class_grade4':
        return { name: '4학년 교실', color: 'bg-lime-950 border-lime-600 text-white', desc: '디지털 기기 활용과 역사 야외 답사 기획이 융합된 4학년 교실입니다.' };
      case 'class_grade5':
        return { name: '5학년 교실', color: 'bg-indigo-950 border-indigo-600 text-white', desc: '통분 수학 보충 지도가 필요한 고학년 진입반 5학년 교실입니다.' };
      case 'class_grade6':
        return { name: '6학년 교실', color: 'bg-purple-950 border-purple-600 text-white', desc: '은밀한 카톡 파벌 갈등과 졸업 앨범 촬영 포즈 다툼이 있는 6학년 교실입니다.' };
      default:
        return { name: '학교', color: 'bg-slate-900 border-slate-500 text-white', desc: '학교 내부 공간입니다.' };
    }
  };
  
  // 학생 프로필 모달을 띄우기 위한 상태
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // 격자 지도 좌표 상태 및 맵 데이터 선언
  const [charPos, setCharPos] = useState({ x: 4, y: 3 }); // 1층중앙계단(4,4) 앞 안전 복도로 초기화
  
  // ============================================================
  // 1층(1F) 맵 구성: 가운데 복도(row 3)를 길게 일직선 배치
  // 복도 위쪽(row 1): G1(1학년), G2(2학년), G3(3학년), PR(교장실)
  // 복도 아래쪽(row 5): CF(급식실), AD(행정실), HR(보건실), GR(체육실)
  // 복도 왼쪽 끝(0,3): PG(운동장 출입구)
  // 복도 오른쪽 끝(8,3): ST(2층으로 올라가는 계단)
  // row 2, row 4: 각 방에서 복도로 나오는 짧은 통로
  // ============================================================
  const SHIELD_MAP_1F = [
    ['W',  'W',  'W',  'W',  'W',  'W',  'W',  'W',  'W'],
    ['W',  'G1', 'W',  'G2', 'W',  'G3', 'W',  'PR', 'W'],
    ['W',  'P',  'W',  'P',  'W',  'P',  'W',  'P',  'W'],
    ['PG', 'P',  'P',  'P',  'P',  'P',  'P',  'P',  'ST'],
    ['W',  'P',  'W',  'P',  'W',  'P',  'W',  'P',  'W'],
    ['W',  'CF', 'W',  'AD', 'W',  'HR', 'W',  'GR', 'W'],
    ['W',  'W',  'W',  'W',  'W',  'W',  'W',  'W',  'W'],
    ['W',  'W',  'W',  'W',  'W',  'W',  'W',  'W',  'W'],
    ['W',  'W',  'W',  'W',  'W',  'W',  'W',  'W',  'W']
  ];

  // ============================================================
  // 2층(2F) 맵 구성: 1층과 동일한 일직선 복도 구조
  // 복도 위쪽(row 1): G4(4학년), G5(5학년), G6(6학년), OF(교무실)
  // 복도 아래쪽(row 5): CR(우리반 교실), LB(도서실), SC(과학실), GY(체육관)
  // 복도 오른쪽 끝(8,3): ST(1층으로 내려가는 계단)
  // ============================================================
  const SHIELD_MAP_2F = [
    ['W',  'W',  'W',  'W',  'W',  'W',  'W',  'W',  'W'],
    ['W',  'G4', 'W',  'G5', 'W',  'G6', 'W',  'OF', 'W'],
    ['W',  'P',  'W',  'P',  'W',  'P',  'W',  'P',  'W'],
    ['W',  'P',  'P',  'P',  'P',  'P',  'P',  'P',  'ST'],
    ['W',  'P',  'W',  'P',  'W',  'P',  'W',  'P',  'W'],
    ['W',  'CR', 'W',  'LB', 'W',  'SC', 'W',  'GY', 'W'],
    ['W',  'W',  'W',  'W',  'W',  'W',  'W',  'W',  'W'],
    ['W',  'W',  'W',  'W',  'W',  'W',  'W',  'W',  'W'],
    ['W',  'W',  'W',  'W',  'W',  'W',  'W',  'W',  'W']
  ];

  const currentMap = currentFloor === 1 ? SHIELD_MAP_1F : SHIELD_MAP_2F;

  // 캐릭터 이동 제어 헬퍼 함수
  const moveChar = React.useCallback((dx: number, dy: number) => {
    // 현재 퀴즈 이벤트가 진행 중이거나 방 내부에 있다면 격자 이동을 차단합니다.
    if (useGameStore.getState().currentLocation !== null || useGameStore.getState().currentEvent !== null) return;
    
    setCharPos((prev) => {
      const newX = prev.x + dx;
      const newY = prev.y + dy;
      
      // 맵 범위를 벗어나는지 체크
      if (newX < 0 || newX >= 9 || newY < 0 || newY >= 9) return prev;
      
      // 가려는 타일의 성격 파악
      const tile = currentMap[newY][newX];
      if (tile === 'W') return prev; // 벽은 통과할 수 없습니다.
      
      // 장소 포탈 타일 도달 시 처리 (react batch 및 state 타이밍 보호를 위해 setTimeout으로 지연 격발)
      if (tile === 'CR') {
        setTimeout(() => moveToLocation('classroom'), 50);
      } else if (tile === 'OF') {
        setTimeout(() => moveToLocation('office'), 50);
      } else if (tile === 'HR') {
        setTimeout(() => moveToLocation('health_room'), 50);
      } else if (tile === 'PG') {
        setTimeout(() => moveToLocation('playground'), 50);
      } else if (tile === 'PR') {
        setTimeout(() => moveToLocation('principal_room'), 50);
      } else if (tile === 'AD') {
        setTimeout(() => moveToLocation('admin_office'), 50);
      } else if (tile === 'CF') {
        setTimeout(() => moveToLocation('cafeteria'), 50);
      } else if (tile === 'LB') {
        setTimeout(() => moveToLocation('library'), 50);
      } else if (tile === 'SC') {
        setTimeout(() => moveToLocation('science_lab'), 50);
      } else if (tile === 'GR') {
        setTimeout(() => moveToLocation('gym_room'), 50);
      } else if (tile === 'GY') {
        setTimeout(() => moveToLocation('gymnasium'), 50);
      } else if (tile === 'G1') {
        setTimeout(() => moveToLocation('class_grade1'), 50);
      } else if (tile === 'G2') {
        setTimeout(() => moveToLocation('class_grade2'), 50);
      } else if (tile === 'G3') {
        setTimeout(() => moveToLocation('class_grade3'), 50);
      } else if (tile === 'G4') {
        setTimeout(() => moveToLocation('class_grade4'), 50);
      } else if (tile === 'G5') {
        setTimeout(() => moveToLocation('class_grade5'), 50);
      } else if (tile === 'G6') {
        setTimeout(() => moveToLocation('class_grade6'), 50);
      } else if (tile === 'ST') {
        setTimeout(() => {
          setCurrentFloor((prevFloor) => (prevFloor === 1 ? 2 : 1));
          setCharPos({ x: 7, y: 3 }); // 계단(8,3) 바로 왼쪽 복도(7,3)로 안전 리스폰
          useGameStore.getState().showToast(`[층간 이동] ${currentFloor === 1 ? '2층' : '1층'}으로 이동했습니다.`);
        }, 50);
      }
      
      return { x: newX, y: newY };
    });
  }, [moveToLocation, currentFloor, currentMap]);

  // 키보드 입력(WASD, 방향키) 리스너
  React.useEffect(() => {
    if (currentLocation !== null || currentEvent !== null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          moveChar(0, -1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          moveChar(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          moveChar(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          moveChar(1, 0);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentLocation, currentEvent, moveChar]);

  // 각 방 내부 뷰에서 [지도로 돌아가기] 버튼을 누를 때 호출되는 UX 안전 조치 핸들러
  // 캐릭터가 다시 포탈 위에 스폰되어 방에 무한 진입하는 루프 버그를 방지하기 위해 
  // 방에서 나오는 순간 해당 포탈 바로 앞의 안전한 'P'(복도/길) 타일로 캐릭터 위치를 변경합니다.
  const handleBackToMap = () => {
    // =============================================
    // 장소에서 나올 때 포탈 타일 위가 아닌 인접 복도('P') 타일로 리스폰
    // → 포탈 재진입 무한 루프 버그를 방지합니다.
    // =============================================

    // === 1층 장소 복귀 좌표 ===
    if (currentLocation === 'class_grade1') {
      setCurrentFloor(1);
      setCharPos({ x: 1, y: 2 }); // G1(1,1) → 바로 아래 통로(1,2)
    } else if (currentLocation === 'class_grade2') {
      setCurrentFloor(1);
      setCharPos({ x: 3, y: 2 }); // G2(3,1) → 바로 아래 통로(3,2)
    } else if (currentLocation === 'class_grade3') {
      setCurrentFloor(1);
      setCharPos({ x: 5, y: 2 }); // G3(5,1) → 바로 아래 통로(5,2)
    } else if (currentLocation === 'principal_room') {
      setCurrentFloor(1);
      setCharPos({ x: 7, y: 2 }); // PR(7,1) → 바로 아래 통로(7,2)
    } else if (currentLocation === 'cafeteria') {
      setCurrentFloor(1);
      setCharPos({ x: 1, y: 4 }); // CF(1,5) → 바로 위 통로(1,4)
    } else if (currentLocation === 'admin_office') {
      setCurrentFloor(1);
      setCharPos({ x: 3, y: 4 }); // AD(3,5) → 바로 위 통로(3,4)
    } else if (currentLocation === 'health_room') {
      setCurrentFloor(1);
      setCharPos({ x: 5, y: 4 }); // HR(5,5) → 바로 위 통로(5,4)
    } else if (currentLocation === 'gym_room') {
      setCurrentFloor(1);
      setCharPos({ x: 7, y: 4 }); // GR(7,5) → 바로 위 통로(7,4)
    } else if (currentLocation === 'playground') {
      setCurrentFloor(1);
      setCharPos({ x: 1, y: 3 }); // PG(0,3) → 오른쪽 복도(1,3)
    }
    // === 2층 장소 복귀 좌표 ===
    else if (currentLocation === 'class_grade4') {
      setCurrentFloor(2);
      setCharPos({ x: 1, y: 2 }); // G4(1,1) → 바로 아래 통로(1,2)
    } else if (currentLocation === 'class_grade5') {
      setCurrentFloor(2);
      setCharPos({ x: 3, y: 2 }); // G5(3,1) → 바로 아래 통로(3,2)
    } else if (currentLocation === 'class_grade6') {
      setCurrentFloor(2);
      setCharPos({ x: 5, y: 2 }); // G6(5,1) → 바로 아래 통로(5,2)
    } else if (currentLocation === 'office') {
      setCurrentFloor(2);
      setCharPos({ x: 7, y: 2 }); // OF(7,1) → 바로 아래 통로(7,2)
    } else if (currentLocation === 'classroom') {
      setCurrentFloor(2);
      setCharPos({ x: 1, y: 4 }); // CR(1,5) → 바로 위 통로(1,4)
    } else if (currentLocation === 'library') {
      setCurrentFloor(2);
      setCharPos({ x: 3, y: 4 }); // LB(3,5) → 바로 위 통로(3,4)
    } else if (currentLocation === 'science_lab') {
      setCurrentFloor(2);
      setCharPos({ x: 5, y: 4 }); // SC(5,5) → 바로 위 통로(5,4)
    } else if (currentLocation === 'gymnasium') {
      setCurrentFloor(2);
      setCharPos({ x: 7, y: 4 }); // GY(7,5) → 바로 위 통로(7,4)
    } else {
      setCharPos({ x: 4, y: 3 }); // 디폴트: 복도 한가운데 스폰
    }
    moveToLocation(null);
  };

  // 시간대별 한글 설명 및 스타일 헬퍼
  const getTimeLabel = (time: TimeOfDay) => {
    switch (time) {
      case 'morning': return { label: '아침 조회 및 오전 일과', color: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'afternoon': return { label: '오후 수업 및 학생 지도', color: 'bg-sky-100 text-sky-900 border-sky-300' };
      case 'evening': return { label: '방과 후 민원 및 업무 조정', color: 'bg-indigo-100 text-indigo-900 border-indigo-300' };
      case 'night': return { label: '퇴근 후 저녁 및 가정 시간', color: 'bg-purple-100 text-purple-900 border-purple-300' };
      case 'summary': return { label: '하루 정산 및 교직 일기', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    }
  };

  const timeStyle = getTimeLabel(timeOfDay);

  // 토스트 메시지 자동 해제 (3초 후)
  React.useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        clearToast();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, clearToast]);

  return (
    <div className="min-h-screen bg-[#F0ECE3] flex flex-col text-slate-800 transition-colors duration-300">
      {/* 1. 상단 바: 핵심 지표 */}
      <header className="bg-white border-b-4 border-slate-900 px-4 py-3 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* 날짜, 신상 정보 */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 text-white rounded-xl px-4 py-2 border-2 border-black flex items-center gap-2 shadow-school-press">
              <Calendar className="w-5 h-5 text-amber-400" />
              <span className="font-school font-bold text-lg">{day}일 차</span>
            </div>
            <div>
              <h1 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
                <span>{playerInfo?.name} 교사</span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-300">
                  {playerInfo?.grade}학년 담임
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">부임지: {playerInfo?.schoolType}</p>
            </div>
          </div>

          {/* 스탯 바 그룹 (체력, 멘탈, 번아웃) */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            {/* 체력 */}
            <div className="flex items-center gap-2">
              <div className="bg-rose-100 p-1.5 rounded-lg border-2 border-black shadow-school-press">
                <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
              </div>
              <div className="w-24 md:w-32">
                <div className="flex justify-between text-xs font-bold mb-0.5">
                  <span>체력</span>
                  <span>{stats.hp}</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full border border-black overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full transition-all duration-300" style={{ width: `${stats.hp}%` }} />
                </div>
              </div>
            </div>

            {/* 멘탈 */}
            <div className="flex items-center gap-2">
              <div className="bg-sky-100 p-1.5 rounded-lg border-2 border-black shadow-school-press">
                <Brain className="w-4 h-4 text-sky-600 fill-sky-600" />
              </div>
              <div className="w-24 md:w-32">
                <div className="flex justify-between text-xs font-bold mb-0.5">
                  <span>멘탈</span>
                  <span>{stats.mental}</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full border border-black overflow-hidden">
                  <div className="bg-sky-400 h-full rounded-full transition-all duration-300" style={{ width: `${stats.mental}%` }} />
                </div>
              </div>
            </div>

            {/* 번아웃 */}
            <div className="flex items-center gap-2">
              <div className="bg-amber-100 p-1.5 rounded-lg border-2 border-black shadow-school-press">
                <Flame className="w-4 h-4 text-amber-600 fill-amber-600" />
              </div>
              <div className="w-24 md:w-32">
                <div className="flex justify-between text-xs font-bold mb-0.5">
                  <span>번아웃</span>
                  <span className={stats.burnout > 75 ? 'text-red-600 font-extrabold animate-pulse' : ''}>
                    {stats.burnout}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full border border-black overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-300" style={{ width: `${stats.burnout}%` }} />
                </div>
              </div>
            </div>

            {/* 행동 포인트 (AP) */}
            <div className="flex items-center gap-1.5 bg-yellow-100 border-2 border-yellow-400 rounded-xl px-3 py-1.5 shadow-school-press">
              <Clock className="w-4 h-4 text-yellow-700" />
              <span className="text-xs font-bold text-yellow-800">
                AP {actionPoints} / {maxActionPoints}
              </span>
            </div>
            
            {/* 타이틀 복귀 */}
            <button
              onClick={onExitGame}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg border-2 border-black active:translate-y-0.5 shadow-school-press"
              title="게임 저장 후 타이틀로"
            >
              <LogOut className="w-4 h-4 text-slate-700" />
            </button>
          </div>
        </div>
      </header>

      {/* 모바일 하단 탭 컨트롤 바 (Lg 미만에서만 노출) */}
      <div className="lg:hidden flex border-b-2 border-black bg-white sticky top-[64px] z-20">
        <button
          onClick={() => setActiveTab('left')}
          className={`flex-1 py-2 text-xs font-bold border-r border-black flex items-center justify-center gap-1 ${activeTab === 'left' ? 'bg-amber-100' : ''}`}
        >
          <Users className="w-4 h-4 text-amber-700" />
          학급 현황
        </button>
        <button
          onClick={() => setActiveTab('center')}
          className={`flex-1 py-2 text-xs font-bold border-r border-black flex items-center justify-center gap-1 ${activeTab === 'center' ? 'bg-emerald-100' : ''}`}
        >
          <Sparkles className="w-4 h-4 text-emerald-700" />
          교실 사건
        </button>
        <button
          onClick={() => setActiveTab('right')}
          className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1 ${activeTab === 'right' ? 'bg-sky-100' : ''}`}
        >
          <FileText className="w-4 h-4 text-sky-700" />
          업무 & 스마트폰
        </button>
      </div>

      {/* 2. 메인 3단 그리드 영역 */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        
        {/* ================= 좌측 패널 (lg:col-span-3): 학급현황 ================= */}
        <section className={`lg:col-span-3 space-y-4 ${activeTab === 'left' ? 'block' : 'hidden lg:block'}`}>
          <div className="paper-card bg-white p-4">
            <h3 className="font-school font-bold text-slate-900 border-b-2 border-slate-900 pb-2 mb-3 flex items-center gap-1.5">
              <Users className="w-5 h-5 text-emerald-600" />
              학급 교무수첩 (학생 현황)
            </h3>
            <p className="text-xs text-slate-500 mb-3 font-medium">이름을 누르면 상세 성향/상태 카드를 확인합니다.</p>
            <div className="space-y-2">
              {students.map(stud => (
                <button
                  key={stud.id}
                  onClick={() => setSelectedStudent(stud)}
                  className="w-full text-left p-2.5 rounded-lg border-2 border-black bg-slate-50 hover:bg-amber-50 active:translate-y-0.5 shadow-school-press transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      {stud.name}
                      <span className="text-xs bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-normal">
                        {stud.traits[0]}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 font-medium truncate max-w-[200px]">
                      이슈: {stud.currentIssues[0] || '특이사항 없음'}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {/* 스탯 상세 지표 모음 */}
          <div className="paper-card bg-white p-4">
            <h3 className="font-school font-bold text-slate-900 border-b-2 border-slate-900 pb-2 mb-3">
              🏫 누적 교육 신뢰 지표
            </h3>
            <div className="space-y-2 text-xs font-semibold">
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                <span className="text-slate-600">수업 전문성</span>
                <span className="text-emerald-700 font-mono">{stats.expert} / 100</span>
              </div>
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                <span className="text-slate-600">학생 신뢰도</span>
                <span className="text-emerald-700 font-mono">{stats.studentTrust} / 100</span>
              </div>
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                <span className="text-slate-600">학부모 신뢰도</span>
                <span className="text-emerald-700 font-mono">{stats.parentTrust} / 100</span>
              </div>
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                <span className="text-slate-600">동료 관계</span>
                <span className="text-emerald-700 font-mono">{stats.colleagueRelation} / 100</span>
              </div>
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                <span className="text-slate-600">교장/교감 신뢰</span>
                <span className="text-emerald-700 font-mono">{stats.adminTrust} / 100</span>
              </div>
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                <span className="text-slate-600">행정 실무 능력</span>
                <span className="text-emerald-700 font-mono">{stats.adminPower} / 100</span>
              </div>
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                <span className="text-slate-600">가정 만족도</span>
                <span className="text-emerald-700 font-mono">{stats.familySatisfaction} / 100</span>
              </div>
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                <span className="text-slate-600">교육 소신</span>
                <span className="text-emerald-700 font-mono">{stats.educationSoshin} / 100</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">커리어 가산점</span>
                <span className="text-amber-600 font-mono">{stats.careerPoint} p</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 중앙 패널 (lg:col-span-6): 메인 사건 극장 및 학교 맵 ================= */}
        <section className={`lg:col-span-6 space-y-4 ${activeTab === 'center' ? 'block' : 'hidden lg:block'}`}>
          {/* 시간대 레이블 안내 */}
          <div className={`p-2.5 rounded-xl border-2 border-black font-bold text-center text-xs flex items-center justify-center gap-1.5 shadow-school-press ${timeStyle.color}`}>
            <Clock className="w-4 h-4" />
            <span>현재 일과: {timeStyle.label}</span>
          </div>

          {/* 하루 정산(summary) 시간대인 경우 */}
          {timeOfDay === 'summary' ? (
            <div className="paper-card bg-white p-6 space-y-6 animate-fade-in border-4 border-slate-900 shadow-school-deep">
              <h2 className="text-2xl font-school font-bold text-slate-900 border-b-2 border-black pb-2 flex items-center gap-1.5">
                📝 {day}일 차 일과 정산 일기
              </h2>

              <div className="space-y-4">
                {/* 1. 지연 효과 알림 출력 */}
                <div>
                  <h4 className="font-bold text-sm text-slate-800 mb-2">🔔 오늘 도착한 후속 사건 결과 피드백</h4>
                  {dayEffectsTriggered.length > 0 ? (
                    <div className="space-y-2">
                      {dayEffectsTriggered.map((msg, idx) => (
                        <div key={idx} className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
                          <Info className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
                          <span>{msg}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">오늘은 이전에 결정했던 일로 발생한 돌발 소식이 없습니다.</p>
                  )}
                </div>

                {/* 2. 현재 상태 브리핑 */}
                <div className="bg-slate-50 border-2 border-black rounded-xl p-4 space-y-2">
                  <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">오늘 하루 동안의 누적 상태 요약</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-slate-500">생존 체력/멘탈</span>
                      <span className="text-slate-900 font-mono">체력 {stats.hp} | 멘탈 {stats.mental}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-slate-500">교무실 번아웃</span>
                      <span className={`font-mono ${stats.burnout > 75 ? 'text-red-600 font-extrabold' : 'text-slate-900'}`}>
                        {stats.burnout} %
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-slate-500">학생 신뢰 / 학부모 신뢰</span>
                      <span className="text-slate-900 font-mono">학생 {stats.studentTrust} | 학부모 {stats.parentTrust}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-slate-500">가족 만족도 / 교육 소신</span>
                      <span className="text-slate-900 font-mono">가족 {stats.familySatisfaction} | 소신 {stats.educationSoshin}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 다음 날로 진행 */}
              <button
                onClick={progressTime}
                className="w-full btn-school-accent flex items-center justify-center gap-1.5 py-3 text-lg"
              >
                교무수첩을 덮고 퇴근하기 (다음 날로)
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            /* RPG 공간 탐색 및 이벤트 처리 영역 */
            <>
              {currentEvent ? (
                /* 상황 A. 퀴즈 이벤트 진행 중일 때 (칠판 극장) */
                <div className="chalkboard-bg p-6 text-white min-h-[400px] flex flex-col justify-between rounded-2xl border-4 border-slate-900 shadow-school-deep">
                  <div>
                    <div className="flex items-center justify-between border-b border-white/20 pb-3 mb-4">
                      <span className="text-xs font-bold tracking-widest uppercase bg-emerald-700/60 px-2.5 py-1 rounded-full text-emerald-200">
                        {currentEvent.category === 'student' ? '학급 지도' : 
                         currentEvent.category === 'parent' ? '학부모 민원' : 
                         currentEvent.category === 'colleague' ? '동료 교사' : 
                         currentEvent.category === 'admin' ? '관리자 지시' : 
                         currentEvent.category === 'family' ? '가정 생활' : '기획 사건'}
                      </span>
                      <span className="text-xs text-white/60 font-mono flex items-center gap-1">
                        📍 위치: {currentEvent.situation}
                      </span>
                    </div>

                    <h2 className="text-xl md:text-2xl font-bold mb-4 chalk-text">
                      {currentEvent.title}
                    </h2>

                    {/* 내레이션 설명글 */}
                    <div className="text-sm md:text-base leading-relaxed text-white/90 font-light mb-6 whitespace-pre-line bg-black/10 p-3 rounded-lg">
                      {currentEvent.narratorText}
                    </div>
                  </div>

                  {/* 선택지 혹은 결과 노출 */}
                  <div className="space-y-3 mt-4">
                    {eventResultText ? (
                      /* 결과 피드백 창 */
                      <div className="bg-black/35 border-2 border-dashed border-emerald-400 rounded-xl p-4 animate-fade-in space-y-4">
                        <div className="text-sm md:text-base leading-relaxed font-light text-emerald-100 whitespace-pre-line">
                          {eventResultText}
                        </div>
                        
                        {/* 스탯 변동 브리핑 */}
                        {selectedChoice && selectedChoice.immediateEffects.length > 0 && (
                          <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-xs font-bold text-white/50">즉각 변동 지표:</span>
                            {selectedChoice.immediateEffects.map((eff, i) => {
                              const isPositive = eff.value > 0;
                              return (
                                <span 
                                  key={i} 
                                  className={`text-xs font-bold px-2 py-0.5 rounded border ${
                                    isPositive 
                                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800' 
                                      : 'bg-rose-950/80 text-rose-400 border-rose-900'
                                  }`}
                                >
                                  {eff.stat === 'hp' ? '체력' :
                                   eff.stat === 'mental' ? '멘탈' :
                                   eff.stat === 'burnout' ? '번아웃' :
                                   eff.stat === 'expert' ? '전문성' :
                                   eff.stat === 'studentTrust' ? '학생신뢰' :
                                   eff.stat === 'parentTrust' ? '학부모신뢰' :
                                   eff.stat === 'colleagueRelation' ? '동료관계' :
                                   eff.stat === 'adminTrust' ? '관리자신뢰' :
                                   eff.stat === 'familySatisfaction' ? '가정만족' : '소신'} {isPositive ? '+' : ''}{eff.value}
                                </span>
                              );
                            })}
                          </div>
                        )}

                        {selectedChoice?.delayedEffects && selectedChoice.delayedEffects.length > 0 && (
                          <div className="text-xs text-yellow-300 font-medium italic flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>시간 흐름에 따른 지연된 후속 효과가 조용히 예약되었습니다.</span>
                          </div>
                        )}

                        {/* 복귀/진행 버튼 분기 */}
                        {timeOfDay === 'evening' ? (
                          <button
                            onClick={progressTime}
                            className="w-full btn-school-accent flex items-center justify-center gap-1 py-2 text-sm"
                          >
                            하루 정리하러 가기
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={closeEventResult}
                            className="w-full btn-school-accent flex items-center justify-center gap-1 py-2 text-sm"
                          >
                            장소로 돌아가기
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ) : (
                      /* 일반 선택지 목록 */
                      <div className="space-y-2.5">
                        {currentEvent.choices.map((choice, index) => (
                          <button
                            key={choice.id}
                            onClick={() => selectChoice(choice)}
                            className="w-full text-left p-3 md:p-4 rounded-xl border-2 border-white/40 bg-white/5 hover:bg-white/15 active:bg-white/20 transition-all duration-150 flex items-start gap-3 group text-xs md:text-sm"
                          >
                            <span className="bg-emerald-800 text-emerald-200 border border-emerald-600 rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                              {index + 1}
                            </span>
                            <div className="flex-1">
                              <p className="font-medium text-white/95 leading-snug">{choice.text}</p>
                              <span className="text-xs text-white/50 font-mono mt-1 block">
                                [의도: {choice.intent}]
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* 상황 B. 대기 중일 때 (지도 또는 개별 장소 뷰) */
                <>
                  {currentLocation === null ? (
                    /* 1) 학교 지도 (School Map) */
                    <div className="paper-card bg-white p-6 border-4 border-slate-900 shadow-school-deep flex flex-col justify-between min-h-[450px]">
                      <div>
                        <div className="flex justify-between items-center border-b-2 border-slate-900 pb-3 mb-4">
                          <h2 className="text-xl font-school font-bold text-slate-900 flex items-center gap-1.5">
                            🏫 학교 지도 (School Map)
                          </h2>
                          <button
                            onClick={progressTime}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold border-2 border-black rounded-lg active:translate-y-0.5 shadow-school-press text-xs transition-colors flex items-center gap-1"
                          >
                            <span>{timeOfDay === 'morning' ? '오후 일과로 전진' : '퇴근/방과후로 전진'}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                        <p className="text-xs text-slate-500 mb-4 font-medium leading-relaxed">
                          방향키나 WASD, 혹은 하단 D-Pad를 눌러 캐릭터(👨‍🏫)를 움직여 이동하세요. 
                          특정 장소 포탈(이모지 타일)에 도착하면 방 안으로 입장합니다. 타일을 직접 터치하여 빠른 순간이동도 가능합니다.
                        </p>

                        {/* 격자 기반 2D 학교 맵 */}
                        <div className="flex flex-col items-center justify-center bg-slate-100 rounded-xl p-4 border border-slate-200">
                          <div className="w-full max-w-[360px] aspect-square bg-slate-800 border-4 border-slate-950 rounded-xl p-1.5 shadow-inner grid grid-cols-9 gap-1">
                            {currentMap.flatMap((row, y) => 
                              row.map((tile, x) => {
                                const isChar = charPos.x === x && charPos.y === y;
                                
                                // 타일별 스타일 및 이모지 대응
                                let bgClass = "bg-slate-700 border-slate-650 rounded-md shadow-inner";
                                let content: React.ReactNode = null;
                                
                                if (tile === 'W') {
                                  bgClass = "bg-slate-750 border-slate-800 rounded-md opacity-90 cursor-not-allowed";
                                  content = <span className="text-xs text-slate-600 font-extrabold select-none">🧱</span>;
                                } else if (tile === 'P') {
                                  bgClass = "bg-[#FAF7EE] border-amber-100 rounded-md hover:bg-amber-50/80 cursor-pointer transition-colors";
                                } else if (tile === 'CR') {
                                  bgClass = "bg-emerald-100 border-emerald-400 rounded-md cursor-pointer hover:bg-emerald-200 text-emerald-800 font-bold flex items-center justify-center shadow-sm";
                                  content = <span className="text-sm select-none" title="우리반교실">🏫</span>;
                                } else if (tile === 'OF') {
                                  bgClass = "bg-indigo-100 border-indigo-400 rounded-md cursor-pointer hover:bg-indigo-200 text-indigo-800 font-bold flex items-center justify-center shadow-sm";
                                  content = <span className="text-sm select-none" title="교무실">💼</span>;
                                } else if (tile === 'HR') {
                                  bgClass = "bg-teal-100 border-teal-400 rounded-md cursor-pointer hover:bg-teal-200 text-teal-800 font-bold flex items-center justify-center shadow-sm";
                                  content = <span className="text-sm select-none" title="보건실">🏥</span>;
                                } else if (tile === 'PG') {
                                  bgClass = "bg-orange-100 border-orange-400 rounded-md cursor-pointer hover:bg-orange-200 text-orange-850 font-bold flex items-center justify-center shadow-sm";
                                  content = <span className="text-sm select-none" title="운동장">🏃‍♂️</span>;
                                } else if (tile === 'PR') {
                                  bgClass = "bg-amber-100 border-amber-400 rounded-md cursor-pointer hover:bg-amber-200 text-amber-900 font-bold flex items-center justify-center shadow-sm";
                                  content = <span className="text-sm select-none" title="교장실">🍵</span>;
                                } else if (tile === 'AD') {
                                  bgClass = "bg-cyan-100 border-cyan-400 rounded-md cursor-pointer hover:bg-cyan-200 text-cyan-800 font-bold flex items-center justify-center shadow-sm";
                                  content = <span className="text-sm select-none" title="행정실">📂</span>;
                                } else if (tile === 'CF') {
                                  bgClass = "bg-yellow-100 border-yellow-400 rounded-md cursor-pointer hover:bg-yellow-200 text-yellow-900 font-bold flex items-center justify-center shadow-sm";
                                  content = <span className="text-sm select-none" title="급식실">🍱</span>;
                                } else if (tile === 'LB') {
                                  bgClass = "bg-blue-100 border-blue-400 rounded-md cursor-pointer hover:bg-blue-200 text-blue-800 font-bold flex items-center justify-center shadow-sm";
                                  content = <span className="text-sm select-none" title="도서실">📚</span>;
                                } else if (tile === 'SC') {
                                  bgClass = "bg-violet-100 border-violet-400 rounded-md cursor-pointer hover:bg-violet-200 text-violet-800 font-bold flex items-center justify-center shadow-sm";
                                  content = <span className="text-sm select-none" title="과학실">🧪</span>;
                                } else if (tile === 'GR') {
                                  bgClass = "bg-emerald-50 border-emerald-300 rounded-md cursor-pointer hover:bg-emerald-100 text-emerald-950 font-bold flex items-center justify-center shadow-sm";
                                  content = <span className="text-sm select-none" title="체육실">👟</span>;
                                } else if (tile === 'GY') {
                                  bgClass = "bg-teal-50 border-teal-300 rounded-md cursor-pointer hover:bg-teal-100 text-teal-950 font-bold flex items-center justify-center shadow-sm";
                                  content = <span className="text-sm select-none" title="체육관">🏟️</span>;
                                } else if (tile === 'ST') {
                                  bgClass = "bg-slate-200 border-slate-400 rounded-md cursor-pointer hover:bg-slate-300 text-slate-900 font-bold flex items-center justify-center shadow-sm animate-pulse";
                                  content = <span className="text-sm select-none" title="중앙 계단">🪜</span>;
                                } else if (tile.startsWith('G')) {
                                  bgClass = "bg-rose-100 border-rose-300 rounded-md cursor-pointer hover:bg-rose-200 text-rose-800 font-bold flex items-center justify-center shadow-sm";
                                  content = <span className="text-xs select-none" title={`${tile[1]}학년 교실`}>{tile[1]}🎒</span>;
                                }
                                
                                return (
                                  <div 
                                    key={`${y}-${x}`} 
                                    onClick={() => {
                                      if (tile !== 'W') {
                                        setCharPos({ x, y });
                                        if (tile === 'CR') moveToLocation('classroom');
                                        else if (tile === 'OF') moveToLocation('office');
                                        else if (tile === 'HR') moveToLocation('health_room');
                                        else if (tile === 'PG') moveToLocation('playground');
                                        else if (tile === 'PR') moveToLocation('principal_room');
                                        else if (tile === 'AD') moveToLocation('admin_office');
                                        else if (tile === 'CF') moveToLocation('cafeteria');
                                        else if (tile === 'LB') moveToLocation('library');
                                        else if (tile === 'SC') moveToLocation('science_lab');
                                        else if (tile === 'GR') moveToLocation('gym_room');
                                        else if (tile === 'GY') moveToLocation('gymnasium');
                                        else if (tile === 'G1') moveToLocation('class_grade1');
                                        else if (tile === 'G2') moveToLocation('class_grade2');
                                        else if (tile === 'G3') moveToLocation('class_grade3');
                                        else if (tile === 'G4') moveToLocation('class_grade4');
                                        else if (tile === 'G5') moveToLocation('class_grade5');
                                        else if (tile === 'G6') moveToLocation('class_grade6');
                                        else if (tile === 'ST') {
                                          setCurrentFloor(prev => prev === 1 ? 2 : 1);
                                          setCharPos({ x: 7, y: 3 }); // 계단(8,3) 옆 복도(7,3)로 리스폰
                                          useGameStore.getState().showToast(`[층간 이동] ${currentFloor === 1 ? '2층' : '1층'}으로 이동했습니다.`);
                                        }
                                      }
                                    }}
                                    className={`relative aspect-square border flex items-center justify-center transition-all duration-100 ${bgClass}`}
                                  >
                                    {isChar ? (
                                      <span className="text-lg md:text-xl z-20 animate-bounce select-none">👨‍🏫</span>
                                    ) : (
                                      content
                                    )}
                                  </div>
                                );
                              })
                            )}
                          </div>

                          {/* D-Pad 조작 인터페이스 */}
                          <div className="flex flex-col items-center gap-1 mt-4">
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">D-PAD 조작</span>
                            
                            <button 
                              onClick={() => moveChar(0, -1)}
                              className="w-10 h-10 bg-slate-800 hover:bg-slate-700 text-white font-extrabold border-2 border-black rounded-xl shadow-school-press flex items-center justify-center transition-all active:translate-y-0.5 active:shadow-none hover:scale-105"
                            >
                              ▲
                            </button>
                            <div className="flex gap-8">
                              <button 
                                onClick={() => moveChar(-1, 0)}
                                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 text-white font-extrabold border-2 border-black rounded-xl shadow-school-press flex items-center justify-center transition-all active:translate-y-0.5 active:shadow-none hover:scale-105"
                              >
                                ◀
                              </button>
                              <button 
                                onClick={() => moveChar(1, 0)}
                                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 text-white font-extrabold border-2 border-black rounded-xl shadow-school-press flex items-center justify-center transition-all active:translate-y-0.5 active:shadow-none hover:scale-105"
                              >
                                ▶
                              </button>
                            </div>
                            <button 
                              onClick={() => moveChar(0, 1)}
                              className="w-10 h-10 bg-slate-800 hover:bg-slate-700 text-white font-extrabold border-2 border-black rounded-xl shadow-school-press flex items-center justify-center transition-all active:translate-y-0.5 active:shadow-none hover:scale-105"
                            >
                              ▼
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* 포탈 설명 레전드 */}
                      <div className="mt-4 flex flex-wrap gap-2 justify-center text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 p-2 rounded-lg">
                        <span className="bg-slate-200 px-1.5 py-0.5 rounded font-extrabold text-slate-700">현재 {currentFloor}층</span>
                        <span className="flex items-center gap-0.5">🏫 우리반</span>
                        <span className="flex items-center gap-0.5">💼 교무실</span>
                        <span className="flex items-center gap-0.5">🏥 보건실</span>
                        <span className="flex items-center gap-0.5">🏃‍♂️ 운동장</span>
                        <span className="flex items-center gap-0.5">🍵 교장실</span>
                        <span className="flex items-center gap-0.5">📂 행정실</span>
                        <span className="flex items-center gap-0.5">🍱 급식실</span>
                        <span className="flex items-center gap-0.5">📚 도서실</span>
                        <span className="flex items-center gap-0.5">🧪 과학실</span>
                        <span className="flex items-center gap-0.5">👟 체육실</span>
                        <span className="flex items-center gap-0.5">🏟️ 체육관</span>
                        <span className="flex items-center gap-0.5">🪜 계단</span>
                        <span className="flex items-center gap-0.5">🎒 1~6학년교실</span>
                      </div>
                    </div>
                  ) : (
                    /* 2) 개별 장소 뷰 */
                    (() => {
                      const theme = getLocationTheme(currentLocation);
                      return (
                        <div className={`paper-card p-6 border-4 border-slate-900 shadow-school-deep flex flex-col justify-between min-h-[450px] text-slate-800 bg-[#FAF9F6]`}>
                          <div>
                            {/* 장소 헤더 */}
                            <div className="flex justify-between items-center border-b-2 border-slate-900 pb-3 mb-4">
                              <h2 className="text-xl font-school font-bold text-slate-900 flex items-center gap-1.5">
                                📍 {theme.name} 내부
                              </h2>
                              <button
                                onClick={handleBackToMap}
                                className="px-3 py-1.5 bg-slate-100 text-slate-800 hover:bg-slate-200 font-bold border-2 border-black rounded-lg active:translate-y-0.5 shadow-school-press text-xs transition-colors"
                              >
                                ◀ 지도로 돌아가기
                              </button>
                            </div>
                            
                            <p className="text-xs text-slate-500 mb-6 italic leading-relaxed font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                              {theme.desc}
                            </p>

                            <div className="space-y-6">
                              {/* 1. 상주 NPC 구역 */}
                              <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">👥 상주하는 인물과 대화 (AP 소모 없음)</h4>
                                <div className="flex flex-wrap gap-2.5">
                                  {(() => {
                                    const npcs = dailyNpcPlacement[currentLocation || ''] || [];
                                    if (npcs.length === 0) {
                                      return (
                                        <p className="text-xs text-slate-400 italic bg-slate-100/50 p-2.5 rounded-lg border border-dashed border-slate-200">
                                          현재 이 장소에 대화할 수 있는 인물이 없습니다.
                                        </p>
                                      );
                                    }
                                    return npcs.map((npc) => {
                                      const isTodayDone = completedNpcDialoguesToday.includes(npc.id);
                                      const isHistoryDone = completedDialogueHistory.includes(npc.id);
                                      const isDone = isTodayDone || isHistoryDone;
                                      
                                      return (
                                        <button
                                          key={npc.id}
                                          onClick={() => talkToNPC(npc.id, npc.name)}
                                          disabled={isDone}
                                          className={`px-3 py-2 border-2 border-black rounded-xl text-xs font-bold active:translate-y-0.5 shadow-school-press transition-all flex items-center gap-1 ${
                                            isDone
                                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed border-slate-350 shadow-none transform-none'
                                              : 'bg-emerald-50 hover:bg-emerald-100 text-slate-800'
                                          }`}
                                        >
                                          <span>💬 {npc.name} {npc.role ? `(${npc.role})` : ''}</span>
                                          {isDone && <span className="text-xs bg-slate-300 text-slate-600 px-1 rounded font-normal">완료</span>}
                                        </button>
                                      );
                                    });
                                  })()}
                                </div>
                              </div>

                              {/* 2. 장소 고유 행동 & 돌발 사건 구역 */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-200 pt-4">
                                <div>
                                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">⚡ 장소 고유 행동 (AP 1 소모)</h4>
                                  {currentLocation === 'classroom' && (
                                    <button
                                      onClick={() => executeLocationAction('classroom_lead')}
                                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold border-2 border-black rounded-xl text-xs text-center transition-all active:translate-y-0.5 shadow-school-press"
                                    >
                                      📢 학급 조회 및 밀착 생활 지도
                                    </button>
                                  )}
                                  {currentLocation === 'office' && (
                                    <button
                                      onClick={() => executeLocationAction('office_work')}
                                      className="w-full py-2.5 px-4 bg-slate-600 hover:bg-slate-500 text-white font-bold border-2 border-black rounded-xl text-xs text-center transition-all active:translate-y-0.5 shadow-school-press"
                                    >
                                      ✍️ 행정 나이스(NEIS) 공문 기안 처리
                                    </button>
                                  )}
                                  {currentLocation === 'health_room' && (
                                    <button
                                      onClick={() => executeLocationAction('health_rest')}
                                      className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-500 text-white font-bold border-2 border-black rounded-xl text-xs text-center transition-all active:translate-y-0.5 shadow-school-press"
                                    >
                                      🛌 보건실 침대에서 간이 낮잠 휴식
                                    </button>
                                  )}
                                  {currentLocation === 'playground' && (
                                    <button
                                      onClick={() => executeLocationAction('playground_train')}
                                      className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold border-2 border-black rounded-xl text-xs text-center transition-all active:translate-y-0.5 shadow-school-press"
                                    >
                                      🏃 운동장 조깅 및 기초 체력 훈련
                                    </button>
                                  )}
                                  {currentLocation === 'principal_room' && (
                                    <button
                                      onClick={() => executeLocationAction('principal_chat')}
                                      className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white font-bold border-2 border-black rounded-xl text-xs text-center transition-all active:translate-y-0.5 shadow-school-press"
                                    >
                                      🍵 관리자 면담 및 차담 건의
                                    </button>
                                  )}
                                  {currentLocation === 'admin_office' && (
                                    <button
                                      onClick={() => executeLocationAction('admin_cooperate')}
                                      className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold border-2 border-black rounded-xl text-xs text-center transition-all active:translate-y-0.5 shadow-school-press"
                                    >
                                      📂 행정 품의서 지출 기안 조율
                                    </button>
                                  )}
                                  {currentLocation === 'cafeteria' && (
                                    <button
                                      onClick={() => executeLocationAction('cafeteria_guide')}
                                      className="w-full py-2.5 px-4 bg-yellow-600 hover:bg-yellow-500 text-white font-bold border-2 border-black rounded-xl text-xs text-center transition-all active:translate-y-0.5 shadow-school-press"
                                    >
                                      🍱 급식실 줄서기 및 위생 지도
                                    </button>
                                  )}
                                  {currentLocation === 'library' && (
                                    <button
                                      onClick={() => executeLocationAction('library_organize')}
                                      className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold border-2 border-black rounded-xl text-xs text-center transition-all active:translate-y-0.5 shadow-school-press"
                                    >
                                      📚 도서 정리 및 자습 환경 감독
                                    </button>
                                  )}
                                  {currentLocation === 'wee_class' && (
                                    <button
                                      onClick={() => executeLocationAction('wee_counsel')}
                                      className="w-full py-2.5 px-4 bg-pink-600 hover:bg-pink-500 text-white font-bold border-2 border-black rounded-xl text-xs text-center transition-all active:translate-y-0.5 shadow-school-press"
                                    >
                                      💗 Wee 클래스 1:1 심층 우울 상담
                                    </button>
                                  )}
                                  {currentLocation === 'science_lab' && (
                                    <button
                                      onClick={() => executeLocationAction('science_safety')}
                                      className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-500 text-white font-bold border-2 border-black rounded-xl text-xs text-center transition-all active:translate-y-0.5 shadow-school-press"
                                    >
                                      🧪 과학 실험용 소독 및 시약 안전관리
                                    </button>
                                  )}
                                  {currentLocation === 'gym_room' && (
                                    <button
                                      onClick={() => executeLocationAction('gym_room_organize')}
                                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold border-2 border-black rounded-xl text-xs text-center transition-all active:translate-y-0.5 shadow-school-press"
                                    >
                                      👟 체육실 비품 보관함 수납 정리
                                    </button>
                                  )}
                                  {currentLocation === 'gymnasium' && (
                                    <button
                                      onClick={() => executeLocationAction('gym_safety')}
                                      className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-500 text-white font-bold border-2 border-black rounded-xl text-xs text-center transition-all active:translate-y-0.5 shadow-school-press"
                                    >
                                      🏟️ 체육 강당 시설 안전 모니터링
                                    </button>
                                  )}
                                  {currentLocation?.startsWith('class_grade') && (
                                    <button
                                      onClick={() => executeLocationAction('grade_class_inspect')}
                                      className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold border-2 border-black rounded-xl text-xs text-center transition-all active:translate-y-0.5 shadow-school-press"
                                    >
                                      🎒 동료 교사 수업 환경 교실 참관
                                    </button>
                                  )}
                                </div>

                                <div>
                                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">🔍 돌발 사건 탐색 (AP 1 소모)</h4>
                                  {currentLocation === 'health_room' ? (
                                    <p className="text-xs text-slate-400 italic mt-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-center font-medium">
                                      보건실은 회복 전용 구역이므로 사건이 일어나지 않습니다.
                                    </p>
                                  ) : (
                                    <button
                                      onClick={exploreLocation}
                                      className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-extrabold border-2 border-black rounded-xl text-xs text-center transition-all active:translate-y-0.5 shadow-school-press"
                                    >
                                      🔎 주변 탐색 (이벤트/민원 마주치기)
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  )}
                </>
              )}
            </>
          )}
        </section>

        {/* ================= 우측 패널 (lg:col-span-3): 업무보드 & 스마트폰 ================= */}
        <section className={`lg:col-span-3 space-y-4 ${activeTab === 'right' ? 'block' : 'hidden lg:block'}`}>
          {/* 업무 보드 */}
          <div className="paper-card bg-white p-4">
            <h3 className="font-school font-bold text-slate-900 border-b-2 border-slate-900 pb-2 mb-3 flex items-center gap-1.5">
              <FileText className="w-5 h-5 text-emerald-600" />
              미결 행정 업무 리스트
            </h3>
            
            {tasks.filter(t => !t.isCompleted).length > 0 ? (
              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                {tasks.filter(t => !t.isCompleted).map(task => (
                  <div key={task.id} className="border-2 border-black rounded-lg p-2.5 bg-slate-50 text-xs flex flex-col justify-between gap-2 shadow-school-press">
                    <div>
                      <div className="font-bold text-slate-900 leading-tight mb-1 flex items-start gap-1 justify-between">
                        <span>{task.title}</span>
                        <span className="text-xs bg-red-100 text-red-700 px-1 py-0.5 rounded flex-shrink-0 font-normal">
                          기한 {task.deadlineDay}일차
                        </span>
                      </div>
                      <div className="flex gap-2 text-xs text-slate-500 font-semibold mb-2">
                        <span>요구 AP: {task.estimatedTime}</span>
                        <span>피로도: +{task.stressCost}</span>
                      </div>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => completeTask(task.id)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold border border-black rounded p-1 text-xs transition-colors active:translate-y-0.5 shadow-school-press"
                      >
                        직접 결재 처리
                      </button>
                      {task.canDelegate && (
                        <button
                          onClick={() => delegateTask(task.id)}
                          className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold border border-black rounded p-1 text-xs transition-colors active:translate-y-0.5 shadow-school-press"
                        >
                          선배위임
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 text-slate-400 text-xs italic bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                모든 긴급 행무 서류가 기한 내에 결재 완료되었습니다! 평화로운 교실입니다.
              </div>
            )}
          </div>

          {/* 가상 스마트폰 메신저 피드 */}
          <div className="paper-card bg-white p-4">
            <h3 className="font-school font-bold text-slate-900 border-b-2 border-slate-900 pb-2 mb-3 flex items-center gap-1.5">
              <Smartphone className="w-5 h-5 text-emerald-600" />
              학교메신저 & 알림
            </h3>
            
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {messengerNotifications.length > 0 ? (
                messengerNotifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => triggerMessengerAction(notif.id)}
                    className={`w-full text-left p-2.5 rounded-xl border-2 border-black text-xs transition-all active:translate-y-0.5 shadow-school-press flex items-start gap-2 ${
                      notif.isRead ? 'bg-slate-50 border-slate-300 shadow-none' : 'bg-sky-50 border-sky-500 font-bold'
                    }`}
                  >
                    <AlertCircle className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${notif.isRead ? 'text-slate-400' : 'text-sky-600 animate-pulse'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center text-xs text-slate-500 mb-0.5">
                        <span className="font-extrabold">{notif.sender}</span>
                        {!notif.isRead && <span className="bg-sky-600 text-white text-xs px-1 rounded font-normal">NEW</span>}
                      </div>
                      <p className="leading-snug truncate text-slate-800 text-xs">{notif.previewText}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-slate-400 text-xs text-center p-4 italic bg-slate-50 rounded-lg">
                  메신저에 새로운 알림이 없습니다.
                </div>
              )}

              {/* 최근 역사 로그 간이 표출 */}
              <div className="border-t border-slate-200 pt-3 mt-2">
                <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-1.5">최근 행동 이력</h4>
                <div className="space-y-1 font-mono text-xs text-slate-500 overflow-y-auto max-h-[80px]">
                  {recentLogs.slice(0, 5).map((log, i) => (
                    <div key={i} className="truncate">{log}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* 3. 학생 상세 프로필 카드 모달 (오버레이) */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border-4 border-black rounded-2xl p-6 max-w-md w-full shadow-school-deep relative">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-3 right-3 border-2 border-black rounded-lg w-8 h-8 flex items-center justify-center font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:translate-y-0.5 shadow-school-press"
            >
              X
            </button>

            <div className="border-b-2 border-black pb-3 mb-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                {selectedStudent.name} 학생 프로필
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                  {selectedStudent.traits[0]}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">상세 성향 분석 카드</p>
            </div>

            {/* 스탯 게이지 목록 */}
            <div className="space-y-3 text-xs mb-4">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>학업 성과 지표 (Academic)</span>
                  <span>{selectedStudent.academicLevel} / 100</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full border border-black overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${selectedStudent.academicLevel}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>학업 동기 (Motivation)</span>
                  <span>{selectedStudent.motivation} / 100</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full border border-black overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: `${selectedStudent.motivation}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>정서 및 자존감 (Self-Esteem)</span>
                  <span>{selectedStudent.selfEsteem} / 100</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full border border-black overflow-hidden">
                  <div className="bg-sky-400 h-full rounded-full" style={{ width: `${selectedStudent.selfEsteem}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>행동 성향 (Behavior)</span>
                  <span>{selectedStudent.behavior} / 100</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full border border-black overflow-hidden">
                  <div className="bg-purple-400 h-full rounded-full" style={{ width: `${selectedStudent.behavior}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>교우 관계도 (Peer Relations)</span>
                  <span>{selectedStudent.peerRelation} / 100</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full border border-black overflow-hidden">
                  <div className="bg-pink-400 h-full rounded-full" style={{ width: `${selectedStudent.peerRelation}%` }} />
                </div>
              </div>
            </div>

            {/* 숨겨진 욕구 */}
            <div className="bg-slate-50 border-2 border-black rounded-xl p-3 text-xs mb-4">
              <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                교무수첩 비공개 관찰기록
              </h4>
              <p className="text-slate-600 font-medium leading-relaxed">
                {selectedStudent.hiddenNeed}
              </p>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              💡 위 수치는 교사의 개별 상담과 대응 방식에 따라 실시간으로 변동합니다.
            </div>
          </div>
        </div>
      )}

      {/* 5. RPG 캐릭터 멀티턴 대화 모달 (오버레이) */}
      {npcDialogueSession && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in animate-duration-200">
          <div className="bg-[#FAF9F6] border-4 border-black rounded-2xl p-6 max-w-lg w-full shadow-school-deep relative flex flex-col justify-between min-h-[340px] text-slate-800">
            <div>
              {/* 스피커 이름 헤더 */}
              <div className="border-b-2 border-slate-900 pb-2 mb-4 flex items-center justify-between">
                <span className="text-sm font-bold bg-slate-900 text-white px-3 py-1 rounded-lg border border-black flex items-center gap-1.5 shadow-school-press">
                  🗣️ {npcDialogueSession.npcName}
                </span>
                <button
                  onClick={clearNpcDialogue}
                  className="text-xs font-bold text-slate-400 hover:text-slate-950 transition-colors"
                >
                  대화 스킵(X)
                </button>
              </div>

              {/* 피드백 리액션 노출 분기 */}
              {npcDialogueSession.activeFeedbackText !== null ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="text-base font-medium leading-relaxed bg-emerald-50 border-2 border-emerald-500 p-4 rounded-xl text-emerald-950 font-school italic">
                    {npcDialogueSession.activeFeedbackText}
                  </div>
                  
                  {/* 피드백 스탯 변화 브리핑 */}
                  {npcDialogueSession.activeFeedbackEffects && npcDialogueSession.activeFeedbackEffects.length > 0 && (
                    <div className="flex flex-wrap gap-2 items-center bg-slate-100 border border-slate-300 p-2.5 rounded-lg">
                      <span className="text-xs font-bold text-slate-500">효과 변동:</span>
                      {npcDialogueSession.activeFeedbackEffects.map((eff, i) => {
                        const isPositive = eff.value > 0;
                        return (
                          <span 
                            key={i} 
                            className={`text-xs font-bold px-2 py-0.5 rounded border ${
                              isPositive 
                                ? 'bg-emerald-100 text-emerald-700 border-emerald-400' 
                                : 'bg-rose-100 text-rose-700 border-rose-400'
                            }`}
                          >
                            {eff.stat === 'hp' ? '체력' :
                             eff.stat === 'mental' ? '멘탈' :
                             eff.stat === 'burnout' ? '번아웃' :
                             eff.stat === 'expert' ? '전문성' :
                             eff.stat === 'studentTrust' ? '학생신뢰' :
                             eff.stat === 'parentTrust' ? '학부모신뢰' :
                             eff.stat === 'colleagueRelation' ? '동료관계' :
                             eff.stat === 'adminTrust' ? '관리자신뢰' :
                             eff.stat === 'familySatisfaction' ? '가정만족' : '소신'} {isPositive ? '+' : ''}{eff.value}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                /* 일반 대사 및 선택지 분기 */
                <div className="space-y-4 animate-fade-in">
                  <div className="text-base font-semibold leading-relaxed bg-white border-2 border-black p-4 rounded-xl text-slate-800 shadow-school-press min-h-[90px]">
                    {npcDialogueSession.steps[npcDialogueSession.currentStepIndex].text}
                  </div>
                </div>
              )}
            </div>

            {/* 하단 컨트롤 영역 (대화 닫기 / 전진 / 선택지) */}
            <div className="mt-6 border-t border-slate-200 pt-4">
              {npcDialogueSession.activeFeedbackText !== null ? (
                /* 피드백 대사 노출 시에는 클릭해 다음 대사나 종료로 이동 */
                <button
                  onClick={advanceDialogueStep}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold border-2 border-black rounded-xl py-3 active:translate-y-0.5 shadow-school-press text-sm transition-all flex items-center justify-center gap-1"
                >
                  <span>계속하기 ➔</span>
                </button>
              ) : (
                /* 일반 단계 */
                (() => {
                  const currentStep = npcDialogueSession.steps[npcDialogueSession.currentStepIndex];
                  
                  if (currentStep.choices && currentStep.choices.length > 0) {
                    /* 선택지가 있는 경우 리스트 나열 */
                    return (
                      <div className="space-y-2">
                        {currentStep.choices.map((choice, idx) => (
                          <button
                            key={idx}
                            onClick={() => selectDialogueChoice(choice)}
                            className="w-full text-left p-3.5 rounded-xl border-2 border-black bg-white hover:bg-amber-50 active:bg-amber-100 transition-all font-semibold text-xs md:text-sm text-slate-800 shadow-school-press flex items-start gap-2.5 group"
                          >
                            <span className="bg-slate-900 text-white border border-slate-900 rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover:bg-amber-600 transition-colors">
                              {idx + 1}
                            </span>
                            <span className="flex-1 leading-snug">{choice.text}</span>
                          </button>
                        ))}
                      </div>
                    );
                  } else {
                    /* 선택지가 없는 단방향 대사일 때 */
                    const isLast = currentStep.nextStepIndex === null || 
                                   (currentStep.nextStepIndex === undefined && 
                                    npcDialogueSession.currentStepIndex === npcDialogueSession.steps.length - 1);
                    return (
                      <button
                        onClick={advanceDialogueStep}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold border-2 border-black rounded-xl py-3 active:translate-y-0.5 shadow-school-press text-sm transition-all flex items-center justify-center gap-1"
                      >
                        <span>{isLast ? '대화 마치기' : '다음 대사 ➔'}</span>
                      </button>
                    );
                  }
                })()
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. 전역 시스템 토스트 피드백 */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border-2 border-black rounded-xl py-3 px-5 shadow-school-deep text-xs font-bold animate-fade-in-up flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 6. 스마트폰 메신저 선택형 이벤트 모달 (오버레이) */}
      {activeMessengerEvent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border-4 border-sky-500 rounded-2xl p-6 max-w-md w-full shadow-school-deep text-white relative">
            <div className="border-b border-sky-500/30 pb-3 mb-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-sky-400 flex items-center gap-2">
                <Smartphone className="w-5 h-5 animate-pulse" />
                학교 메신저 긴급 수신
              </h3>
              <span className="text-xs bg-sky-950 text-sky-300 border border-sky-700 px-2 py-0.5 rounded">
                발신: {activeMessengerEvent.sender}
              </span>
            </div>

            <div className="bg-slate-950/80 border border-sky-900/50 rounded-xl p-4 mb-5 text-xs md:text-sm leading-relaxed text-slate-100 whitespace-pre-line font-light font-school">
              {activeMessengerEvent.previewText}
            </div>

            {/* 선택지 혹은 확인 버튼 */}
            <div className="space-y-3">
              {activeMessengerEvent.choices.length > 0 ? (
                activeMessengerEvent.choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => selectMessengerChoice(choice.id, choice.effects, choice.resultText)}
                    className="w-full text-left p-3.5 rounded-xl border border-sky-500/40 bg-sky-950/20 hover:bg-sky-900/30 active:bg-sky-900/50 transition-all font-semibold text-xs md:text-sm text-slate-200 flex items-start gap-3 group animate-fade-in"
                  >
                    <div className="flex-1 leading-snug">
                      {choice.text}
                    </div>
                  </button>
                ))
              ) : (
                <button
                  onClick={closeMessengerEvent}
                  className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold border border-black rounded-xl py-3 active:translate-y-0.5 shadow-school-press text-xs md:text-sm transition-all animate-fade-in"
                >
                  확인 및 닫기
                </button>
              )}
            </div>
            
            <div className="mt-5 text-xs text-slate-400 text-center">
              ⚠️ 메신저 대응 선택에 따른 스탯 변화가 시스템에 즉각 반영되었습니다.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
