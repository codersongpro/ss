import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import type { TimeOfDay } from '@/store/useGameStore';
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  Smartphone, 
  ChevronRight, 
  CheckCircle, 
  AlertCircle,
  AlertTriangle,
  HelpCircle,
  LogOut,
  Sparkles,
  Info,
  Volume2,
  VolumeX,
  Volume1
} from 'lucide-react';
import type { Student } from '@/game/types';

// 스탯명 한글화 및 이모지 매핑 테이블 [NEW]
const STAT_LABELS: Record<string, { label: string; icon: string }> = {
  hp: { label: "건강", icon: "🏥" },
  mental: { label: "멘탈", icon: "🧠" },
  burnout: { label: "번아웃", icon: "😓" },
  expert: { label: "전문성", icon: "📚" },
  studentTrust: { label: "학생신뢰", icon: "👥" },
  parentTrust: { label: "학부모신뢰", icon: "👪" },
  colleagueRelation: { label: "동료관계", icon: "🤝" },
  adminTrust: { label: "관리자신뢰", icon: "📋" },
  adminPower: { label: "행정실무", icon: "💻" },
  familySatisfaction: { label: "가정만족", icon: "🏠" },
  educationSoshin: { label: "교육소신", icon: "💡" },
  reputation: { label: "평판", icon: "🌟" },
  careerPoint: { label: "커리어점수", icon: "🏆" },
  teachingSatisfaction: { label: "교육보람", icon: "⭐" },
  colleagueSolidarity: { label: "동료연대", icon: "🛡️" },
  parentComplaint: { label: "학부모민원", icon: "⚠️" },
  
  // 5대 역량 스탯
  workCapacity: { label: "업무능력", icon: "⚙️" },
  interpersonal: { label: "인간관계", icon: "🌐" },
  familyRelation: { label: "가족관계", icon: "👨‍👩‍👧" },
  classManagement: { label: "학급운영", icon: "🏫" },
  teachingResearch: { label: "수업연구", icon: "🧪" }
};

// 스탯 변동 전후 팝업 상세 브리핑 헬퍼 컴포넌트 [NEW]
const StatChangeBriefing: React.FC<{ prev: any; current: any }> = ({ prev, current }) => {
  if (!prev || !current) return null;
  
  const changes = Object.keys(current).filter(key => {
    return key in prev && prev[key] !== current[key] && key !== 'careerPoint'; // 커리어점수 제외 또는 포함
  });

  if (changes.length === 0) return null;

  return (
    <div className="mt-4 bg-slate-900 text-white rounded-xl p-3 border border-slate-700 space-y-1.5 shadow-xl animate-fade-in text-left">
      <div className="text-[11px] font-bold text-slate-400 border-b border-slate-700 pb-1 flex items-center justify-between">
        <span>📊 실시간 지표 변동 결과 피드백</span>
        <span className="text-emerald-400 font-mono text-[10px]">이전 수치 ➔ 현재 잔량 (변동치)</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {changes.map(key => {
          const info = STAT_LABELS[key] || { label: key, icon: "📈" };
          const pVal = prev[key];
          const cVal = current[key];
          const diff = cVal - pVal;
          const diffText = diff > 0 ? `+${diff}` : `${diff}`;
          const diffColor = diff > 0 ? 'text-emerald-400 font-extrabold' : 'text-rose-400 font-extrabold';
          
          return (
            <div key={key} className="flex justify-between items-center bg-black/30 px-2 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-300 font-medium">
                {info.icon} {info.label}
              </span>
              <span className="font-mono font-semibold">
                {pVal} ➔ <strong className="text-white">{cVal}</strong>
                <span className={`ml-2 ${diffColor} text-[10px]`}>({diffText})</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface TutorialStepData {
  title: string;
  desc: string;
  targetId: string;
  forcedTab?: 'left' | 'right' | 'center';
  positionClass: string;
}

const TUTORIAL_STEPS: TutorialStepData[] = [
  {
    title: "👨‍🏫 티처 메이커에 오신 것을 환영합니다!",
    desc: "신임 교사로서 앞으로 30일간 학급을 이끌고 생존하기 위한 기본적인 규칙과 UI 사용법을 안내해 드릴게요. 1분만 투자해 가이드를 따라와 보세요!",
    targetId: "",
    positionClass: "bottom-6 left-1/2 -translate-x-1/2 lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2"
  },
  {
    title: "⚡ 우주 최강의 에너지: 교사력 (TP - Teacher Power)",
    desc: "가장 중요한 '교사력' 표시등입니다. 매일 아침 7TP의 교사력이 기본으로 주어집니다.\n\n여기서 TP(Teacher Power)란 교사로서 하루 동안 발휘할 수 있는 에너지의 총량입니다. 위치 이동, 대화, 업무, 학생 개별 지도 등 하나의 이벤트가 실행될 때마다 1TP가 소모됩니다.",
    targetId: "tutorial-hp-bar",
    positionClass: "bottom-6 left-1/2 -translate-x-1/2 lg:top-28 lg:right-6 lg:left-auto lg:translate-x-0"
  },
  {
    title: "📊 8대 핵심 교직 스탯 (생존 및 역량)",
    desc: "교사로서 지닌 8가지 핵심 상태 지표(건강, 멘탈, 번아웃 및 5대 업무 역량)입니다. 각 게이지에 마우스를 올리거나 터치하면 어떠한 행동에 의해 상승/하락하는지 공식과 근거를 볼 수 있습니다. 이 스탯 중 건강/멘탈이 0이 되거나 번아웃이 100%가 되면 즉시 게임오버가 되니 늘 집중관리해야 합니다!",
    targetId: "tutorial-stats-panel",
    forcedTab: "left",
    positionClass: "bottom-6 left-1/2 -translate-x-1/2 lg:top-[30%] lg:left-[28%] lg:translate-x-0"
  },
  {
    title: "📋 학급 교무수첩 (학생 명단)",
    desc: "선생님이 담당하는 우리 반 학생 10명의 목록입니다. 학생의 이름을 누르면 상세 정보와 숨겨진 성향 카드가 열립니다. 여기서 학생에게 꼭 맞는 지도 방침(💬공감, 💡이성, 🛡️훈육, 🎨강점, 🤝멘토링)을 선택해 교사력 1TP를 소모하고 개별 지도를 진행할 수 있습니다. 학생의 숨겨진 특성과의 상성에 따라 반응이 극명히 엇갈립니다.",
    targetId: "tutorial-students-panel",
    forcedTab: "left",
    positionClass: "bottom-6 left-1/2 -translate-x-1/2 lg:top-[45%] lg:left-[28%] lg:translate-x-0"
  },
  {
    title: "📂 미결 행정 업무 리스트",
    desc: "교사에게 부여된 공문 및 행정 업무들입니다. 요구되는 교사력을 소모하여 결재 처리하거나 선배에게 위임할 수 있습니다. 마감일 이전에 해결하지 않고 방치한 채 퇴근하여 날을 넘기면, 다음 날 아침 강력한 업무 해태 패널티(스탯 대폭 차감)가 찾아옵니다.",
    targetId: "tutorial-tasks-panel",
    forcedTab: "right",
    positionClass: "bottom-6 left-1/2 -translate-x-1/2 lg:top-[30%] lg:right-[28%] lg:left-auto lg:translate-x-0"
  },
  {
    title: "🏫 학교 메신저 및 스마트폰 연락",
    desc: "교육청/교감선생님이 보낸 공적 연락과 학부모 민원, 동료 교사의 사적 문자가 들어옵니다. 확인하지 않고 날을 넘기면 소통 방치에 따른 막대한 스탯 감소와 민원 급증 패널티를 받게 됩니다. 하루가 지나기 전 잊지 말고 꼭 확인해서 답장하세요!",
    targetId: "tutorial-alerts-panel",
    forcedTab: "right",
    positionClass: "bottom-6 left-1/2 -translate-x-1/2 lg:top-[50%] lg:right-[28%] lg:left-auto lg:translate-x-0"
  },
  {
    title: "🏃‍♂️ 2D 학교 맵 (장소 이동)",
    desc: "교사력(TP)이 남아 있다면 학교 지도를 보고 캐릭터(👨‍🏫)를 교실, 교무실, 행정실 등으로 움직여 원하는 장소로 가세요. 각 장소에 있는 다양한 인물들과 대화하거나, 장소별 조사를 통해 예기치 못한 돌발 사건을 맞이하고 이를 극복해 나갑니다.",
    targetId: "tutorial-navigation-panel",
    forcedTab: "center",
    positionClass: "bottom-6 left-1/2 -translate-x-1/2 lg:top-[30%] lg:left-[38%] lg:translate-x-0"
  }
];

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
    closeMessengerEvent,
    phoneAndTextNotifications,
    activePhoneAndTextEvent,
    triggerPhoneAndTextAction,
    selectPhoneAndTextChoice,
    closePhoneAndTextEvent,
    clearDayEffects,
    counselStudent,
    overtimeWork,
    bgmVolume,
    setBgmVolume
  } = useGameStore();

  const toggleVolume = () => {
    const nextVolume = (bgmVolume + 1) % 6;
    setBgmVolume(nextVolume);
  };

  const getVolumeIcon = () => {
    if (bgmVolume === 0) return <VolumeX className="w-4 h-4 text-red-500" />;
    if (bgmVolume <= 2) return <Volume1 className="w-4 h-4 text-slate-500 font-bold" />;
    return <Volume2 className="w-4 h-4 text-emerald-600 font-bold" />;
  };

  // 모바일 화면용 탭 상태 ('center' = 교실/사건, 'left' = 학급현황, 'right' = 스마트폰/업무)
  const [activeTab, setActiveTab] = useState<'center' | 'left' | 'right'>('center');
  
  // 층간 상태 (1층 ⇄ 2층)
  const [currentFloor, setCurrentFloor] = useState<1 | 2>(1);

  // 스탯 전후 변화 추적용 로컬 상태
  const [prevStats, setPrevStats] = useState<any>(null);

  // 1. 일반 선택지 클릭 래퍼 핸들러
  const handleSelectChoice = (choice: any) => {
    setPrevStats({ ...stats });
    selectChoice(choice);
  };

  // 2. 학생 개별 지도 래핑 핸들러
  const handleCounselStudent = (
    studentId: string, 
    actionType: 'empathy' | 'rational' | 'strict' | 'strength' | 'mentoring'
  ) => {
    setPrevStats({ ...stats });
    const result = counselStudent(studentId, actionType);
    setCounselResult(result);
  };

  // 3. 메신저 선택지 클릭 래핑 핸들러
  const handleSelectMessengerChoice = (choiceId: string, effects: any[], resultText: string) => {
    setPrevStats({ ...stats });
    selectMessengerChoice(choiceId, effects, resultText);
  };

  // 4. 스마트폰 선택지 클릭 래핑 핸들러
  const handleSelectPhoneAndTextChoice = (choiceId: string, effects: any[], resultText: string) => {
    setPrevStats({ ...stats });
    selectPhoneAndTextChoice(choiceId, effects, resultText);
  };

  // 개별 학생 1:1 지도 결과 피드백 로컬 상태
  const [counselResult, setCounselResult] = useState<{ feedbackText: string; effectsText: string } | null>(null);

  // iorad 스타일 첫날 튜토리얼 로컬 상태
  const [isTutorialActive, setIsTutorialActive] = useState<boolean>(false);
  const [tutorialStep, setTutorialStep] = useState<number>(0);

  // 첫날 시작 시 튜토리얼 자동 트리거
  useEffect(() => {
    const isDone = localStorage.getItem('teacher_maker_tutorial_done') === 'true';
    if (day === 1 && timeOfDay === 'morning' && !isDone) {
      setIsTutorialActive(true);
      setTutorialStep(0);
    }
  }, [day, timeOfDay]);

  // 튜토리얼 단계 전환 시 적절한 패널 자동 활성화 (반응형 탭 연동)
  useEffect(() => {
    if (!isTutorialActive) return;
    const currentStepData = TUTORIAL_STEPS[tutorialStep];
    if (currentStepData && currentStepData.forcedTab) {
      setActiveTab(currentStepData.forcedTab);
    }
  }, [tutorialStep, isTutorialActive]);

  // 미확인 메신저, 스마트폰 연락, 미결 업무 사전 체크 래퍼 함수
  const handleProgressTime = () => {
    if (timeOfDay === 'summary') {
      const nextDay = day + 1;
      const overdueTasks = tasks.filter(t => !t.isCompleted && t.deadlineDay < nextDay);
      const unreadMessengers = messengerNotifications.filter(m => !m.isRead);
      const unreadPhones = phoneAndTextNotifications.filter(p => !p.isRead);

      if (overdueTasks.length > 0 || unreadMessengers.length > 0 || unreadPhones.length > 0) {
        const confirmMsg = `⚠️ [방치 경고] 아직 확인하지 않은 메신저(${unreadMessengers.length}건), 스마트폰 연락(${unreadPhones.length}건) 혹은 미결된 마감 업무(${overdueTasks.length}건)가 남아있습니다.\n\n이대로 퇴근하여 날을 넘길 시, 다음 날 아침에 핵심 교사 역량 스탯에 심각한 부정적 패널티가 가해질 수 있습니다.\n\n정말로 퇴근을 진행하시겠습니까?`;
        if (!window.confirm(confirmMsg)) {
          return;
        }
      }
    }
    progressTime();
  };

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
      {/* 1. 상단 바: 날짜 및 교사력 (체력/멘탈/번아웃은 8대 통합 스탯으로 이동) */}
      <header className={`bg-white border-b-4 border-slate-900 px-4 py-3 sticky top-0 shadow-md transition-all duration-300 ${
        isTutorialActive && tutorialStep === 1 ? 'z-[1000] relative' : 'z-30'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* 날짜, 신상 정보 (1단계 가이드 중 비타겟이므로 흐리게 처리) */}
          <div className={`flex items-center gap-3 transition-opacity duration-300 ${
            isTutorialActive && tutorialStep === 1 ? 'opacity-30 pointer-events-none' : ''
          }`}>
            <div className="bg-slate-900 text-white rounded-xl px-4 py-2 border-2 border-black flex items-center gap-2 shadow-school-press">
              <Calendar className="w-5 h-5 text-amber-400" />
              <span className="font-school font-bold text-lg">{day}일 차</span>
            </div>
            <div>
              <h1 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
                <span>{playerInfo?.name} 교사</span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-300 whitespace-nowrap">
                  {playerInfo?.grade}학년 담임
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">부임지: {playerInfo?.schoolType}</p>
            </div>
          </div>

          {/* 교사력 및 나가기 버튼 */}
          <div className="flex items-center gap-4 justify-between sm:justify-end">
            {/* 교사력 (TP) - 1단계 하이라이트 */}
            <div 
              id="tutorial-hp-bar"
              className={`flex items-center gap-1.5 bg-yellow-100 border-2 border-yellow-400 rounded-xl px-3 py-1.5 shadow-school-press relative group cursor-help transition-all duration-300 ${
                isTutorialActive && tutorialStep === 1 
                  ? 'ring-4 ring-[#FF007F] ring-offset-2 border-[#FF007F] scale-105' 
                  : ''
              }`}
            >
              <Clock className="w-4 h-4 text-yellow-700 animate-pulse" />
              <span className="text-xs font-bold text-yellow-800 whitespace-nowrap">
                교사력 {actionPoints} / {maxActionPoints} TP
              </span>
              
              {/* 마우스오버 규칙 설명 툴팁 */}
              <div className="absolute top-full right-0 mt-2 w-72 bg-slate-900 text-white text-xs p-3.5 rounded-xl border border-slate-700 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-[1050] leading-relaxed font-semibold break-keep text-left">
                <span className="font-extrabold text-yellow-400 flex items-center gap-1 mb-1">⚡ 교사력 (Teacher Power) 관리 규칙:</span>
                <p>• 매일 아침 교사에게는 7TP의 교사력이 기본으로 주어집니다.</p>
                <p className="mt-1">• 위치 이동, 대화, 업무, 학생 개별 지도 등 하나의 이벤트가 발생할 때마다 교사력 1TP가 소모됩니다.</p>
              </div>
            </div>
            
            {/* 배경음 BGM 볼륨 조작 버튼 [NEW] */}
            <button
              onClick={toggleVolume}
              className={`p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg border-2 border-black active:translate-y-0.5 shadow-school-press transition-opacity duration-300 flex items-center gap-1 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer ${
                isTutorialActive && tutorialStep === 1 ? 'opacity-30 pointer-events-none' : ''
              }`}
              title="배경음 볼륨 조절 (0~5)"
            >
              {getVolumeIcon()}
              <span className="font-mono">{bgmVolume === 0 ? 'OFF' : `LV.${bgmVolume}`}</span>
            </button>

            {/* 타이틀 복귀 (1단계 가이드 중 비타겟이므로 흐리게 처리) */}
            <button
              onClick={onExitGame}
              className={`p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg border-2 border-black active:translate-y-0.5 shadow-school-press transition-opacity duration-300 ${
                isTutorialActive && tutorialStep === 1 ? 'opacity-30 pointer-events-none' : ''
              }`}
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
        <section className={`lg:col-span-3 space-y-4 ${activeTab === 'left' ? 'block' : 'hidden lg:block'} transition-all duration-300 ${
          isTutorialActive && (tutorialStep === 2 || tutorialStep === 3) ? 'z-[1000] relative' : ''
        }`}>
          {/* 1. [상단 배치] 8대 핵심 교직 스탯 (생존 및 역량 스탯 통합) */}
          <div 
            id="tutorial-stats-panel"
            className={`paper-card bg-white p-4 space-y-3.5 transition-all duration-300 ${
              isTutorialActive && tutorialStep === 2 
                ? 'ring-4 ring-[#FF007F] ring-offset-2 border-[#FF007F] scale-[1.01]' 
                : isTutorialActive && tutorialStep === 3
                  ? 'opacity-20 pointer-events-none' 
                  : ''
            }`}
          >
            <h3 className="font-school font-bold text-slate-900 border-b-2 border-slate-900 pb-2 flex items-center gap-1.5 text-base">
              <span>📊 주인공 스테이터스</span>
            </h3>
            <p className="text-xs text-slate-400 font-medium">항목별 터치/마우스 오버 시 세부 정보와 생존 조건이 표시됩니다.</p>
            
            <div className="space-y-3.5">
              {/* [생존 스탯 1] 건강 */}
              <div className="relative group cursor-help">
                <div className="flex justify-between text-sm font-bold mb-1">
                  <span className="text-slate-700 flex items-center gap-1">🏥 건강 (물리 체력)</span>
                  <span className={`font-mono ${stats.hp < 30 ? 'text-red-600 font-extrabold animate-pulse' : 'text-rose-600'}`}>{stats.hp} / 100</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full border border-slate-300 overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full transition-all duration-300" style={{ width: `${stats.hp}%` }} />
                </div>
                {/* 건강 툴팁 */}
                <div className="absolute left-0 bottom-full mb-2 w-72 bg-slate-900 text-white text-xs rounded-xl p-3.5 shadow-xl hidden group-hover:block z-50 border border-slate-700 leading-relaxed pointer-events-none animate-fade-in font-normal break-keep text-left">
                  <p className="font-bold text-rose-300 mb-1 text-sm">🏥 건강 (Health Points)</p>
                  <p className="text-slate-200">교사의 육체적 에너지입니다. 출퇴근 거리, 피로 축적, 일부 사건 해결 및 업무 과중에 따라 하락합니다. 보건실에서 요양하거나 정시 퇴근하면 충전됩니다. <strong className="text-red-400 font-extrabold">0이 되면 번아웃 병가로 실직(게임 오버)합니다.</strong></p>
                </div>
              </div>

              {/* [생존 스탯 2] 멘탈 */}
              <div className="relative group cursor-help">
                <div className="flex justify-between text-sm font-bold mb-1">
                  <span className="text-slate-700 flex items-center gap-1">🧠 멘탈 (정신력)</span>
                  <span className={`font-mono ${stats.mental < 30 ? 'text-red-600 font-extrabold animate-pulse' : 'text-sky-650'}`}>{stats.mental} / 100</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full border border-slate-300 overflow-hidden">
                  <div className="bg-sky-400 h-full rounded-full transition-all duration-300" style={{ width: `${stats.mental}%` }} />
                </div>
                {/* 멘탈 툴팁 */}
                <div className="absolute left-0 bottom-full mb-2 w-72 bg-slate-900 text-white text-xs rounded-xl p-3.5 shadow-xl hidden group-hover:block z-50 border border-slate-700 leading-relaxed pointer-events-none animate-fade-in font-normal break-keep text-left">
                  <p className="font-bold text-sky-300 mb-1 text-sm">🧠 멘탈 (Mental Balance)</p>
                  <p className="text-slate-200">정신적 평정심과 정신력입니다. 학부모 민원 폭탄, 교실 난동 사건, 동료와의 불화 시 크게 깎입니다. 상담, 휴식, 긍정적인 메시지 확인 등으로 복구할 수 있습니다. <strong className="text-red-400 font-extrabold">0이 되면 번아웃 휴직(게임 오버)합니다.</strong></p>
                </div>
              </div>

              {/* [생존 스탯 3] 번아웃 */}
              <div className="relative group cursor-help">
                <div className="flex justify-between text-sm font-bold mb-1">
                  <span className="text-slate-700 flex items-center gap-1">🔥 번아웃 (피로도)</span>
                  <span className={`font-mono ${stats.burnout > 70 ? 'text-red-600 font-extrabold animate-pulse' : 'text-amber-600'}`}>{stats.burnout} %</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full border border-slate-300 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-300" style={{ width: `${stats.burnout}%` }} />
                </div>
                {/* 번아웃 툴팁 */}
                <div className="absolute left-0 bottom-full mb-2 w-72 bg-slate-900 text-white text-xs rounded-xl p-3.5 shadow-xl hidden group-hover:block z-50 border border-slate-700 leading-relaxed pointer-events-none animate-fade-in font-normal break-keep text-left">
                  <p className="font-bold text-amber-300 mb-1 text-sm">🔥 번아웃 지표 (Burnout Rate)</p>
                  <p className="text-slate-200">일과 후 누적되는 극심한 피로도 비율입니다. 미결 업무 방치, 밤샘 야근, 주말 당직 시 상승합니다. 칼퇴근 및 적당한 위임으로 누적을 늦출 수 있습니다. <strong className="text-red-400 font-extrabold">100%에 도달하면 탈진 퇴직(게임 오버)합니다.</strong></p>
                </div>
              </div>

              <div className="border-t border-slate-200 my-2 pt-2" />

              {/* [역량 스탯 1] 업무능력 */}
              <div className="relative group cursor-help">
                <div className="flex justify-between text-sm font-bold mb-1">
                  <span className="text-slate-700">💼 업무능력</span>
                  <span className="text-indigo-700 font-mono">{stats.workCapacity} / 100</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full border border-slate-300 overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full transition-all duration-300" style={{ width: `${stats.workCapacity}%` }} />
                </div>
                {/* 툴팁 */}
                <div className="absolute left-0 bottom-full mb-2 w-72 bg-slate-900 text-white text-xs rounded-xl p-3.5 shadow-xl hidden group-hover:block z-50 border border-slate-700 leading-relaxed pointer-events-none animate-fade-in font-normal break-keep text-left">
                  <p className="font-bold text-indigo-300 mb-1 text-sm">💼 업무능력 (Work Capacity)</p>
                  <p className="mb-1 text-slate-300 font-mono text-[10.5px]">공식: 전문성 40% + 행정 40% + 관리자신뢰 20%</p>
                  <p className="text-slate-200">공문 기안 완수, 행정 예산 협조, 미결 업무의 당일 결재 완료 시 <strong className="text-emerald-400">상승</strong>합니다. 미결 업무나 메신저를 방치하고 날을 넘길 시 <strong className="text-rose-400">급격히 하락</strong>합니다.</p>
                </div>
              </div>

              {/* [역량 스탯 2] 인간관계 */}
              <div className="relative group cursor-help">
                <div className="flex justify-between text-sm font-bold mb-1">
                  <span className="text-slate-700">🤝 인간관계</span>
                  <span className="text-emerald-700 font-mono">{stats.interpersonal} / 100</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full border border-slate-300 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${stats.interpersonal}%` }} />
                </div>
                {/* 툴팁 */}
                <div className="absolute left-0 bottom-full mb-2 w-72 bg-slate-900 text-white text-xs rounded-xl p-3.5 shadow-xl hidden group-hover:block z-50 border border-slate-700 leading-relaxed pointer-events-none animate-fade-in font-normal break-keep text-left">
                  <p className="font-bold text-emerald-300 mb-1 text-sm">🤝 인간관계 (Interpersonal)</p>
                  <p className="mb-1 text-slate-300 font-mono text-[10.5px]">공식: 동료관계 30% + 학생신뢰 30% + 학부모신뢰 30% + 동료연대감 10%</p>
                  <p className="text-slate-200">동료들과의 사교, 학생/학부모 개별 상담, 스마트폰 감사 연락 답장 시 <strong className="text-emerald-400">상승</strong>합니다. 전화/문자 민원이나 연락을 방치할 시 <strong className="text-rose-400">급격히 하락</strong>합니다.</p>
                </div>
              </div>

              {/* [역량 스탯 3] 가족관계 */}
              <div className="relative group cursor-help">
                <div className="flex justify-between text-sm font-bold mb-1">
                  <span className="text-slate-700">❤️ 가족관계</span>
                  <span className="text-rose-700 font-mono">{stats.familyRelation} / 100</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full border border-slate-300 overflow-hidden">
                  <div className="bg-rose-400 h-full rounded-full transition-all duration-300" style={{ width: `${stats.familyRelation}%` }} />
                </div>
                {/* 툴팁 */}
                <div className="absolute left-0 bottom-full mb-2 w-72 bg-slate-900 text-white text-xs rounded-xl p-3.5 shadow-xl hidden group-hover:block z-50 border border-slate-700 leading-relaxed pointer-events-none animate-fade-in font-normal break-keep text-left">
                  <p className="font-bold text-rose-300 mb-1 text-sm">❤️ 가족관계 (Family Relation)</p>
                  <p className="mb-1 text-slate-300 font-mono text-[10.5px]">공식: 가정만족도와 1:1 비례</p>
                  <p className="text-slate-200">칼퇴근 고수, 주말 사적인 동원 거절, 스마트폰 격려 연락 답장 시 <strong className="text-emerald-400">상승</strong>합니다. 야근 수행, 주말 친목 모임 강제 참석 시 <strong className="text-rose-400">하락</strong>합니다.</p>
                </div>
              </div>

              {/* [역량 스탯 4] 학급운영 */}
              <div className="relative group cursor-help">
                <div className="flex justify-between text-sm font-bold mb-1">
                  <span className="text-slate-700">🎒 학급운영</span>
                  <span className="text-amber-700 font-mono">{stats.classManagement} / 100</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full border border-slate-300 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-300" style={{ width: `${stats.classManagement}%` }} />
                </div>
                {/* 툴팁 */}
                <div className="absolute left-0 bottom-full mb-2 w-72 bg-slate-900 text-white text-xs rounded-xl p-3.5 shadow-xl hidden group-hover:block z-50 border border-slate-700 leading-relaxed pointer-events-none animate-fade-in font-normal break-keep text-left">
                  <p className="font-bold text-amber-300 mb-1 text-sm">🎒 학급운영 (Class Management)</p>
                  <p className="mb-1 text-slate-300 font-mono text-[10.5px]">공식: 학생신뢰 50% + 학부모신뢰 30% + 교육소신 20%</p>
                  <p className="text-slate-200">아침 교실 조회, 급식 지도, 교문 등교 안전 지도, 책임 훈육 실천 시 <strong className="text-emerald-400">상승</strong>합니다. 학부모 민원을 방임하거나 학생 갈등을 무시하고 날을 넘길 시 <strong className="text-rose-400">하락</strong>합니다.</p>
                </div>
              </div>

              {/* [역량 스탯 5] 수업연구능력 */}
              <div className="relative group cursor-help">
                <div className="flex justify-between text-sm font-bold mb-1">
                  <span className="text-slate-700">💡 수업연구능력</span>
                  <span className="text-sky-700 font-mono">{stats.teachingResearch} / 100</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full border border-slate-300 overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full transition-all duration-300" style={{ width: `${stats.teachingResearch}%` }} />
                </div>
                {/* 툴팁 */}
                <div className="absolute left-0 bottom-full mb-2 w-72 bg-slate-900 text-white text-xs rounded-xl p-3.5 shadow-xl hidden group-hover:block z-50 border border-slate-700 leading-relaxed pointer-events-none animate-fade-in font-normal break-keep text-left">
                  <p className="font-bold text-sky-300 mb-1 text-sm">💡 수업연구능력 (Teaching Research)</p>
                  <p className="mb-1 text-slate-300 font-mono text-[10.5px]">공식: 수업전문성 70% + 교육적보람 30%</p>
                  <p className="text-slate-200">타 교실 수업 참관, 도서실 교안 정리, 과학실 안전 점검 시 <strong className="text-emerald-400">상승</strong>합니다. 업무 미결 방치 및 수업 준비 미흡 시 <strong className="text-rose-400">하락</strong>합니다.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. 학급 교무수첩 (학생 현황) - 3단계 하이라이트 */}
          <div 
            id="tutorial-students-panel"
            className={`paper-card bg-white p-4 transition-all duration-300 ${
              isTutorialActive && tutorialStep === 3 
                ? 'ring-4 ring-[#FF007F] ring-offset-2 border-[#FF007F] scale-[1.01]' 
                : isTutorialActive && tutorialStep === 2
                  ? 'opacity-20 pointer-events-none' 
                  : ''
            }`}
          >
            <h3 className="font-school font-bold text-slate-900 border-b-2 border-slate-900 pb-2 mb-3 flex items-center gap-1.5 text-base">
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

          {/* 3. 누적 교육 신뢰 지표 모음 카드 */}
          <div className={`paper-card bg-white p-4 transition-all duration-300 ${
            isTutorialActive ? 'opacity-30 pointer-events-none' : ''
          }`}>
            <h3 className="font-school font-bold text-slate-900 border-b-2 border-slate-900 pb-2 mb-3 text-base">
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
                      <span className="text-slate-500">생존 건강/멘탈</span>
                      <span className="text-slate-900 font-mono">건강 {stats.hp} | 멘탈 {stats.mental}</span>
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

              {/* 다음 날로 진행 선택 */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleProgressTime}
                  className="w-full btn-school flex items-center justify-center gap-1.5 py-3 text-lg bg-slate-100 hover:bg-slate-200 border-2 border-black text-slate-800 font-bold transition-all shadow-school-press"
                >
                  교무수첩을 덮고 퇴근하기
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="text-center text-[11px] text-slate-500 -mt-2 mb-1">
                  (추가적인 부작용 없이 다음 날로 넘어갑니다.)
                </div>

                <button
                  onClick={() => {
                    overtimeWork();
                  }}
                  className="w-full btn-school-accent flex items-center justify-center gap-1.5 py-3 text-lg bg-amber-500 hover:bg-amber-600 border-2 border-black text-white font-bold transition-all shadow-school-deep"
                >
                  🔥 퇴근 대신 야근하기
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="text-xs text-slate-600 bg-amber-50 border border-amber-300 rounded-lg p-2.5 space-y-1">
                  <div className="font-bold text-amber-900 text-center">⚠️ 야근 선택 시 예상되는 변화:</div>
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-left px-1">
                    <span className="text-emerald-700">📈 행정실무 +15, 전문성 +10, 관리자신뢰 +5</span>
                    <span className="text-red-600">📉 건강 -15, 멘탈 -10, 가정만족 -15, 번아웃 +15</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold italic border-t border-amber-200 pt-1 mt-1 text-center">
                    💡 다음 날 교사력(TP) +1 보너스를 추가로 얻습니다.
                  </div>
                </div>
              </div>
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

                        {/* 스탯 변동 상세 브리핑 추가 [NEW] */}
                        <StatChangeBriefing prev={prevStats} current={stats} />

                        {/* 복귀/진행 버튼 분기 */}
                        {timeOfDay === 'evening' ? (
                          <button
                            onClick={() => {
                              handleProgressTime();
                              setPrevStats(null);
                            }}
                            className="w-full btn-school-accent flex items-center justify-center gap-1 py-2 text-sm"
                          >
                            하루 정리하러 가기
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              closeEventResult();
                              setPrevStats(null);
                            }}
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
                            onClick={() => handleSelectChoice(choice)}
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
                            onClick={handleProgressTime}
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
                        <div 
                          id="tutorial-navigation-panel"
                          className={`flex flex-col items-center justify-center bg-slate-100 rounded-xl p-4 border border-slate-200 transition-all duration-300 ${
                            isTutorialActive && tutorialStep === 6 
                              ? 'z-[1000] relative ring-4 ring-[#FF007F] ring-offset-4 ring-offset-slate-900 animate-pulse border-[#FF007F]' 
                              : ''
                          }`}
                        >
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
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">👥 상주하는 인물과 대화 (교사력 소모 없음)</h4>
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
                                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">⚡ 장소 고유 행동 (TP 1 소모)</h4>
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
                                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">🔍 돌발 사건 탐색 (TP 1 소모)</h4>
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
        <section className={`lg:col-span-3 space-y-4 ${activeTab === 'right' ? 'block' : 'hidden lg:block'} transition-all duration-300 ${
          isTutorialActive && (tutorialStep === 4 || tutorialStep === 5) ? 'z-[1000] relative' : ''
        }`}>
          {/* 업무 보드 */}
          <div 
            id="tutorial-tasks-panel"
            className={`paper-card bg-white p-4 transition-all duration-300 ${
              isTutorialActive && tutorialStep === 4 
                ? 'ring-4 ring-[#FF007F] ring-offset-2 border-[#FF007F] scale-[1.01]' 
                : isTutorialActive && tutorialStep === 5
                  ? 'opacity-20 pointer-events-none' 
                  : ''
            }`}
          >
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
                        <span>요구 TP: {task.estimatedTime}TP</span>
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

          {/* 가상 스마트폰 메신저 피드 (공무 전용) */}
          <div 
            id="tutorial-alerts-panel"
            className={`paper-card bg-white p-4 transition-all duration-300 ${
              isTutorialActive && tutorialStep === 5 
                ? 'ring-4 ring-[#FF007F] ring-offset-2 border-[#FF007F] scale-[1.01]' 
                : isTutorialActive && tutorialStep === 4
                  ? 'opacity-20 pointer-events-none' 
                  : ''
            }`}
          >
            <h3 className="font-school font-bold text-slate-900 border-b-2 border-slate-900 pb-2 mb-3 flex items-center gap-1.5">
              <Smartphone className="w-5 h-5 text-emerald-600" />
              🏫 학교 메신저 (공무전용)
            </h3>
            
            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
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
                  메신저에 새로운 공무 알림이 없습니다.
                </div>
              )}
            </div>
          </div>

          {/* 개인 스마트폰 수신함 */}
          <div className="paper-card bg-white p-4">
            <h3 className="font-school font-bold text-slate-900 border-b-2 border-slate-900 pb-2 mb-3 flex items-center gap-1.5">
              <Smartphone className="w-5 h-5 text-rose-500" />
              📱 개인 스마트폰 (전화 & 문자)
            </h3>
            
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {phoneAndTextNotifications.length > 0 ? (
                phoneAndTextNotifications.map((notif) => {
                  const isPositive = notif.id.includes('positive');
                  const isPhone = notif.type === 'phone';
                  
                  let cardBg = 'bg-rose-50/50 border-rose-250';
                  let iconColor = 'text-rose-500';
                  let badgeText = '💝 감사격려';
                  let badgeBg = 'bg-rose-100 text-rose-850';

                  if (!isPositive) {
                    cardBg = 'bg-violet-50/40 border-violet-250';
                    iconColor = 'text-violet-500';
                    badgeText = '🚨 민원부탁';
                    badgeBg = 'bg-violet-100 text-violet-850';
                  }

                  if (notif.isRead) {
                    cardBg = 'bg-slate-50/80 border-slate-200 opacity-75 shadow-none';
                  }

                  return (
                    <button
                      key={notif.id}
                      onClick={() => triggerPhoneAndTextAction(notif.id)}
                      className={`w-full text-left p-2.5 rounded-xl border-2 border-black text-xs transition-all active:translate-y-0.5 shadow-school-press flex items-start gap-2 ${cardBg}`}
                    >
                      <span className={`text-sm mt-0.5 flex-shrink-0 ${iconColor}`}>
                        {isPhone ? '☎️' : '💬'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center text-xs text-slate-500 mb-0.5">
                          <span className="font-extrabold text-slate-800">{notif.sender}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${badgeBg}`}>
                            {badgeText}
                          </span>
                        </div>
                        <p className="leading-snug truncate text-slate-750 text-xs">{notif.previewText}</p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-slate-400 text-xs text-center p-4 italic bg-slate-50 rounded-lg">
                  스마트폰 알림 수신함이 비어있습니다.
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

      {/* ☀️ 새 아침 브리핑 팝업 모달 (미처리 방치 패널티 결과 보고) */}
      {timeOfDay === 'morning' && dayEffectsTriggered.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border-4 border-slate-900 rounded-2xl p-6 max-w-lg w-full shadow-school-deep relative">
            <div className="border-b-2 border-slate-900 pb-3 mb-4">
              <h3 className="text-2xl font-school font-bold text-slate-900 flex items-center gap-2">
                ☀️ 새 아침 브리핑 (어제 방치된 업무와 연락 결과)
              </h3>
              <p className="text-sm text-slate-500 mt-1.5">어제 처리하지 않은 메신저, 스마트폰 연락, 마감 업무에 대한 정산 결과 보고입니다.</p>
            </div>

            <div className="max-h-65 overflow-y-auto space-y-2.5 mb-6 pr-1">
              {dayEffectsTriggered.map((msg, idx) => (
                <div key={idx} className="bg-rose-50 border border-rose-300 rounded-xl p-4 text-sm text-rose-900 flex items-start gap-2.5 shadow-sm">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
                  <span className="leading-relaxed font-semibold">{msg}</span>
                </div>
              ))}
            </div>

            <button
              onClick={clearDayEffects}
              className="w-full btn-school-accent py-3 text-base font-bold flex items-center justify-center gap-1.5"
            >
              오늘의 업무 개시하기
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* 3. 학생 상세 프로필 카드 모달 (오버레이) */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border-4 border-black rounded-2xl p-6 max-w-md w-full shadow-school-deep relative">
            <button
              onClick={() => {
                setSelectedStudent(null);
                setCounselResult(null);
              }}
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

            {/* 개별 맞춤 지도 영역 */}
            <div className="border-t-2 border-black pt-3 mt-4 space-y-3">
              <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <span>👨‍🏫 개별 맞춤 지도 (교사력 1TP 소모)</span>
              </h4>

              {counselResult ? (
                /* 지도 실행 결과 브리핑 창 */
                <div className="bg-amber-50 border-2 border-dashed border-amber-400 rounded-xl p-4 space-y-2.5 animate-fade-in">
                  <p className="text-xs font-extrabold text-amber-800 flex items-center gap-1">
                    📢 지도 결과 피드백
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                    {counselResult.feedbackText}
                  </p>
                  <div className="text-[11px] bg-white border border-amber-300 rounded px-2.5 py-1.5 font-bold text-emerald-800 font-mono">
                    {counselResult.effectsText}
                  </div>

                  {/* 스탯 변동 상세 브리핑 추가 [NEW] */}
                  <StatChangeBriefing prev={prevStats} current={stats} />

                  <button
                    onClick={() => {
                      setCounselResult(null);
                      setPrevStats(null);
                    }}
                    className="w-full mt-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold py-1.5 rounded-lg text-xs border border-black shadow-school-press"
                  >
                    확인
                  </button>
                </div>
              ) : (
                /* 지도 버튼 목록 */
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <button
                    onClick={() => handleCounselStudent(selectedStudent.id, 'empathy')}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-850 p-2.5 rounded-xl border border-emerald-300 transition-colors flex flex-col items-center gap-1"
                    title="유리멘탈, 내성적 아동에 상성 보충"
                  >
                    <span>💬 감정 공감 지지</span>
                    <span className="text-[9px] font-normal text-emerald-600">신뢰·자존감 회복</span>
                  </button>
                  <button
                    onClick={() => handleCounselStudent(selectedStudent.id, 'rational')}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-850 p-2.5 rounded-xl border border-indigo-300 transition-colors flex flex-col items-center gap-1"
                    title="우등생, 성실파 아동에 상성 보충"
                  >
                    <span>💡 이성 솔루션</span>
                    <span className="text-[9px] font-normal text-indigo-600">학력·동기 상승</span>
                  </button>
                  <button
                    onClick={() => handleCounselStudent(selectedStudent.id, 'strict')}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-850 p-2.5 rounded-xl border border-rose-300 transition-colors flex flex-col items-center gap-1"
                    title="트러블메이커, 규칙위반 아동에 상성 보충"
                  >
                    <span>🛡️ 엄격 규율 훈육</span>
                    <span className="text-[9px] font-normal text-rose-600">행동교정·기강 확립</span>
                  </button>
                  <button
                    onClick={() => handleCounselStudent(selectedStudent.id, 'strength')}
                    className="bg-amber-50 hover:bg-amber-100 text-amber-850 p-2.5 rounded-xl border border-amber-300 transition-colors flex flex-col items-center gap-1"
                    title="예체능 특기자, 끼 있는 아동에 상성 보충"
                  >
                    <span>🎨 강점 진로 격려</span>
                    <span className="text-[9px] font-normal text-amber-600">재능·자아 인정</span>
                  </button>
                  <button
                    onClick={() => handleCounselStudent(selectedStudent.id, 'mentoring')}
                    className="col-span-2 bg-sky-50 hover:bg-sky-100 text-sky-850 p-2.5 rounded-xl border border-sky-300 transition-colors flex flex-col items-center gap-1"
                    title="부진아, 잠만보 아동에 상성 보충"
                  >
                    <span>🤝 밀착 1:1 멘토링</span>
                    <span className="text-[9px] font-normal text-sky-600">학력보충·생활 동행</span>
                  </button>
                </div>
              )}
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
                    onClick={() => handleSelectMessengerChoice(choice.id, choice.effects, choice.resultText)}
                    className="w-full text-left p-3.5 rounded-xl border border-sky-500/40 bg-sky-950/20 hover:bg-sky-900/30 active:bg-sky-900/50 transition-all font-semibold text-xs md:text-sm text-slate-200 flex items-start gap-3 group animate-fade-in"
                  >
                    <div className="flex-1 leading-snug">
                      {choice.text}
                    </div>
                  </button>
                ))
              ) : (
                <>
                  {/* 스탯 변동 상세 브리핑 추가 [NEW] */}
                  <StatChangeBriefing prev={prevStats} current={stats} />
                  <button
                    onClick={() => {
                      closeMessengerEvent();
                      setPrevStats(null);
                    }}
                    className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold border border-black rounded-xl py-3 active:translate-y-0.5 shadow-school-press text-xs md:text-sm transition-all animate-fade-in"
                  >
                    확인 및 닫기
                  </button>
                </>
              )}
            </div>
            
            <div className="mt-5 text-xs text-slate-400 text-center">
              ⚠️ 메신저 대응 선택에 따른 스탯 변화가 시스템에 즉각 반영되었습니다.
            </div>
          </div>
        </div>
      )}

      {/* 7. 스마트폰 개인 연락(전화/문자) 선택형 이벤트 모달 (오버레이) [NEW] */}
      {activePhoneAndTextEvent && (() => {
        const isPositive = activePhoneAndTextEvent.id.startsWith('positive_parent_') || 
                           activePhoneAndTextEvent.id.startsWith('positive_colleague_') || 
                           activePhoneAndTextEvent.id.startsWith('positive_student_');
        
        // 긍정 격려 vs 부정 민원 디자인 분기
        const modalBg = isPositive 
          ? 'bg-rose-50 border-rose-400 text-rose-950 shadow-lg' 
          : 'bg-slate-900 border-violet-500 text-white';
        const headerTextColor = isPositive ? 'text-rose-600' : 'text-violet-400';
        const innerBoxBg = isPositive 
          ? 'bg-white border-rose-200 text-rose-900' 
          : 'bg-slate-950/80 border-violet-900/50 text-slate-100';
        const infoBadgeBg = isPositive 
          ? 'bg-rose-100 text-rose-800 border-rose-300' 
          : 'bg-violet-950 text-violet-300 border-violet-700';
        const choiceBtnStyle = isPositive
          ? 'border-rose-300 bg-white hover:bg-rose-100/50 active:bg-rose-100 text-rose-900 shadow-sm'
          : 'border-violet-500/40 bg-violet-950/20 hover:bg-violet-900/30 active:bg-violet-900/50 text-slate-200';
        const closeBtnStyle = isPositive
          ? 'bg-rose-600 hover:bg-rose-500 text-white border-2 border-black rounded-xl'
          : 'bg-violet-600 hover:bg-violet-500 text-white border-2 border-black rounded-xl';

        return (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className={`border-4 rounded-2xl p-6 max-w-md w-full shadow-school-deep relative ${modalBg}`}>
              <div className={`border-b pb-3 mb-4 flex justify-between items-center ${isPositive ? 'border-rose-200' : 'border-violet-500/30'}`}>
                <h3 className={`text-lg font-bold flex items-center gap-2 ${headerTextColor}`}>
                  <Smartphone className="w-5 h-5 animate-pulse" />
                  {isPositive ? '💝 격려/감사 수신' : '🚨 스마트폰 연락 수신'}
                </h3>
                <span className={`text-xs border px-2 py-0.5 rounded font-bold ${infoBadgeBg}`}>
                  발신: {activePhoneAndTextEvent.sender}
                </span>
              </div>

              <div className={`border rounded-xl p-4 mb-5 text-xs md:text-sm leading-relaxed whitespace-pre-line font-school ${innerBoxBg}`}>
                {activePhoneAndTextEvent.previewText}
              </div>

              {/* 선택지 혹은 확인 버튼 */}
              <div className="space-y-3">
                {activePhoneAndTextEvent.choices.length > 0 ? (
                  activePhoneAndTextEvent.choices.map((choice) => (
                    <button
                      key={choice.id}
                      onClick={() => handleSelectPhoneAndTextChoice(choice.id, choice.effects, choice.resultText)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all font-semibold text-xs md:text-sm flex items-start gap-3 group active:translate-y-0.5 shadow-school-press ${choiceBtnStyle}`}
                    >
                      <div className="flex-1 leading-snug">
                        {choice.text}
                      </div>
                    </button>
                  ))
                ) : (
                  <>
                    {/* 스탯 변동 상세 브리핑 추가 [NEW] */}
                    <StatChangeBriefing prev={prevStats} current={stats} />
                    <button
                      onClick={() => {
                        closePhoneAndTextEvent();
                        setPrevStats(null);
                      }}
                      className={`w-full font-bold py-3 active:translate-y-0.5 shadow-school-press text-xs md:text-sm transition-all ${closeBtnStyle}`}
                    >
                      확인 및 닫기
                    </button>
                  </>
                )}
              </div>
              
              <div className={`mt-5 text-xs text-center ${isPositive ? 'text-rose-600/70 font-semibold' : 'text-slate-400'}`}>
                {isPositive 
                  ? '✨ 이 격려 연락은 교사력 소모가 없으며, 힐링 및 버프 효과를 제공합니다!'
                  : '⚠️ 이 스마트폰 대응은 완료 시 교사력 1TP가 소모되며 딜레마 처리가 완료됩니다.'
                }
              </div>
            </div>
          </div>
        );
      })()}

      {/* iorad 스타일 첫날 튜토리얼 오버레이 */}
      {isTutorialActive && (
        <>
          {/* 어두운 반투명 마스크 - pointer-events-none 으로 하이라이트 요소 클릭 막지 않음 */}
          <div className="fixed inset-0 z-[990] bg-black/65 pointer-events-none select-none" />

          {/* 설명 말풍선 카드 - 항상 최상단(z-[1100])에 고정 배치 */}
          <div 
            className={`fixed z-[1100] pointer-events-auto max-w-sm w-[calc(100vw-2rem)] bg-white border-4 border-black rounded-2xl p-5 shadow-[8px_8px_0_#000] text-slate-800 animate-fade-in animate-duration-300 font-sans ${
              // 스텝 0은 정중앙, 이후 단계는 뷰포트 하단 고정
              tutorialStep === 0
                ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                : 'bottom-4 left-1/2 -translate-x-1/2'
            }`}
          >
            {/* 상단 진행률 바 */}
            <div className="flex justify-between items-center text-xs text-slate-400 font-bold mb-3">
              <span className="bg-[#FF007F] text-white px-2.5 py-0.5 rounded-full font-mono text-[10px]">TUTORIAL GUIDE</span>
              <span>{tutorialStep + 1} / {TUTORIAL_STEPS.length}</span>
            </div>

            {/* 타이틀 */}
            <h4 className="font-extrabold text-sm md:text-base text-slate-900 mb-2 flex items-center gap-1.5 leading-tight">
              {TUTORIAL_STEPS[tutorialStep].title}
            </h4>

            {/* 설명 본문 */}
            <p className="text-xs text-slate-600 font-semibold leading-relaxed mb-4 whitespace-pre-line line-clamp-6">
              {TUTORIAL_STEPS[tutorialStep].desc}
            </p>

            {/* 제어 버튼 */}
            <div className="flex gap-2 justify-between pt-3 border-t-2 border-dashed border-slate-200">
              <button
                onClick={() => {
                  localStorage.setItem('teacher_maker_tutorial_done', 'true');
                  setIsTutorialActive(false);
                }}
                className="text-xs text-slate-400 hover:text-rose-500 font-extrabold underline transition-colors"
              >
                건너뛰기
              </button>

              <div className="flex gap-2">
                {tutorialStep > 0 && (
                  <button
                    onClick={() => setTutorialStep(prev => prev - 1)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold border-2 border-black rounded-xl px-3 py-1.5 text-xs active:translate-y-0.5"
                  >
                    이전
                  </button>
                )}
                
                <button
                  onClick={() => {
                    if (tutorialStep < TUTORIAL_STEPS.length - 1) {
                      setTutorialStep(prev => prev + 1);
                    } else {
                      localStorage.setItem('teacher_maker_tutorial_done', 'true');
                      setIsTutorialActive(false);
                    }
                  }}
                  className="bg-[#FF007F] hover:bg-[#E00070] text-white font-extrabold border-2 border-black rounded-xl px-4 py-1.5 text-xs active:translate-y-0.5 shadow-[2px_2px_0_#000]"
                >
                  {tutorialStep === TUTORIAL_STEPS.length - 1 ? '출근하기! ➔' : '다음 단계'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
