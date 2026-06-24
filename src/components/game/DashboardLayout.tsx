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
    advanceDialogueStep
  } = useGameStore();

  // 모바일 화면용 탭 상태 ('center' = 교실/사건, 'left' = 학급현황, 'right' = 스마트폰/업무)
  const [activeTab, setActiveTab] = useState<'center' | 'left' | 'right'>('center');
  
  // 장소별 한글 명칭 및 테마 스타일 설정 헬퍼
  const getLocationTheme = (loc: string) => {
    switch (loc) {
      case 'classroom':
        return { name: '교실', color: 'bg-emerald-900 border-emerald-500 text-white', desc: '아이들의 열기와 소음이 가득한 교실입니다. 학생 지도를 할 수 있습니다.' };
      case 'office':
        return { name: '교무실', color: 'bg-slate-800 border-slate-500 text-white', desc: '밀린 공문과 전화벨 소리가 요란한 행정의 요람입니다. 행정 처리가 가능합니다.' };
      case 'health_room':
        return { name: '보건실', color: 'bg-teal-900 border-teal-500 text-white', desc: '아늑하고 조용한 쉼터입니다. 지친 피로와 스트레스를 충전하세요.' };
      case 'playground':
        return { name: '운동장', color: 'bg-orange-950 border-orange-600 text-white', desc: '푸른 잔디와 트랙이 시원하게 뻗어 있습니다. 기초 체력을 단련하기 좋습니다.' };
      case 'principal_room':
        return { name: '교장실', color: 'bg-amber-950 border-amber-600 text-white', desc: '묵직하고 조용한 회의실입니다. 관리자들과 면담하고 소신을 피력하세요.' };
      default:
        return { name: '학교', color: 'bg-slate-900 border-slate-500 text-white', desc: '학교 내부 공간입니다.' };
    }
  };
  
  // 학생 프로필 모달을 띄우기 위한 상태
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

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
                <div className="flex justify-between text-[11px] font-bold mb-0.5">
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
                <div className="flex justify-between text-[11px] font-bold mb-0.5">
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
                <div className="flex justify-between text-[11px] font-bold mb-0.5">
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
            <p className="text-[11px] text-slate-500 mb-3 font-medium">이름을 누르면 상세 성향/상태 카드를 확인합니다.</p>
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
                      <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-normal">
                        {stud.traits[0]}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 font-medium truncate max-w-[150px]">
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
                          <div className="text-[10px] text-yellow-300 font-medium italic flex items-center gap-1">
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
                              <span className="text-[10px] text-white/50 font-mono mt-1 block">
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
                            🏫 가상의 학교 지도 (School Map)
                          </h2>
                          <button
                            onClick={progressTime}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold border-2 border-black rounded-lg active:translate-y-0.5 shadow-school-press text-xs transition-colors flex items-center gap-1"
                          >
                            <span>{timeOfDay === 'morning' ? '오후 일과로 전진' : '퇴근/방과후로 전진'}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 mb-6 font-medium">
                          가고 싶은 학교 장소를 선택해 이동하세요. 각 장소마다 만날 수 있는 인물(NPC)과 수행할 수 있는 행동이 다릅니다. (탐색 및 행동 시 AP 소모)
                        </p>

                        {/* 학교 건물 평면도풍 그리드 레이아웃 */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {/* 교실 */}
                          <button
                            onClick={() => moveToLocation('classroom')}
                            className="border-2 border-black rounded-xl p-4 bg-emerald-50 hover:bg-emerald-100 active:translate-y-0.5 shadow-school-press text-left transition-all group"
                          >
                            <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">👩‍🏫</span>
                            <h4 className="font-bold text-sm text-slate-800">교실 (Classroom)</h4>
                            <p className="text-[10px] text-slate-500 mt-1">우리 반 학생들을 지도하고 조회합니다.</p>
                          </button>

                          {/* 교무실 */}
                          <button
                            onClick={() => moveToLocation('office')}
                            className="border-2 border-black rounded-xl p-4 bg-slate-50 hover:bg-slate-100 active:translate-y-0.5 shadow-school-press text-left transition-all group"
                          >
                            <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">💼</span>
                            <h4 className="font-bold text-sm text-slate-800">교무실 (Staff Office)</h4>
                            <p className="text-[10px] text-slate-500 mt-1">동료 교사와 대화하고 서류 처리를 보강합니다.</p>
                          </button>

                          {/* 보건실 */}
                          <button
                            onClick={() => moveToLocation('health_room')}
                            className="border-2 border-black rounded-xl p-4 bg-teal-50 hover:bg-teal-100 active:translate-y-0.5 shadow-school-press text-left transition-all group"
                          >
                            <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">🏥</span>
                            <h4 className="font-bold text-sm text-slate-800">보건실 (Infirmary)</h4>
                            <p className="text-[10px] text-slate-500 mt-1">지친 체력과 멘탈을 회복할 수 있는 쉼터.</p>
                          </button>

                          {/* 운동장 */}
                          <button
                            onClick={() => moveToLocation('playground')}
                            className="border-2 border-black rounded-xl p-4 bg-orange-50 hover:bg-orange-100 active:translate-y-0.5 shadow-school-press text-left transition-all group"
                          >
                            <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">🏃‍♂️</span>
                            <h4 className="font-bold text-sm text-slate-800">운동장 (Playground)</h4>
                            <p className="text-[10px] text-slate-500 mt-1">체력을 보강하고 맑은 공기를 쐽니다.</p>
                          </button>

                          {/* 교장실 */}
                          <button
                            onClick={() => moveToLocation('principal_room')}
                            className="border-2 border-black rounded-xl p-4 bg-amber-50 hover:bg-amber-100 active:translate-y-0.5 shadow-school-press text-left transition-all group"
                          >
                            <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">🍵</span>
                            <h4 className="font-bold text-sm text-slate-800">교장실 (Principal Office)</h4>
                            <p className="text-[10px] text-slate-500 mt-1">학교 관리자들과 깊은 자문과 차담을 합니다.</p>
                          </button>
                        </div>
                      </div>

                      <div className="mt-8 bg-slate-50 border border-slate-200 p-3 rounded-lg text-[10px] text-slate-400">
                        💡 <b>가이드:</b> 장소를 탐색하거나 고유 행동을 하면 행동 포인트(AP)가 소모됩니다. AP를 다 썼거나 다음 일과로 넘어가고 싶으시다면 상단의 [일과 전진]을 눌러 다음 시간대로 가세요.
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
                                onClick={() => moveToLocation(null)}
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
                                  {currentLocation === 'classroom' && (
                                    <>
                                      <button
                                        onClick={() => talkToNPC('student_jihun', '박지훈')}
                                        className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 border-2 border-black rounded-xl text-xs font-bold active:translate-y-0.5 text-slate-800 shadow-school-press transition-all"
                                      >
                                        💬 박지훈 (장난꾸러기)
                                      </button>
                                      <button
                                        onClick={() => talkToNPC('student_minjun', '최민준')}
                                        className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 border-2 border-black rounded-xl text-xs font-bold active:translate-y-0.5 text-slate-800 shadow-school-press transition-all"
                                      >
                                        💬 최민준 (모범생)
                                      </button>
                                      <button
                                        onClick={() => talkToNPC('student_jihyun', '이지현')}
                                        className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 border-2 border-black rounded-xl text-xs font-bold active:translate-y-0.5 text-slate-800 shadow-school-press transition-all"
                                      >
                                        💬 이지현 (관찰자)
                                      </button>
                                    </>
                                  )}
                                  {currentLocation === 'office' && (
                                    <>
                                      <button
                                        onClick={() => talkToNPC('colleague_senior', '부장 선생님')}
                                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border-2 border-black rounded-xl text-xs font-bold active:translate-y-0.5 text-slate-800 shadow-school-press transition-all"
                                      >
                                        💬 김 부장 교사
                                      </button>
                                      <button
                                        onClick={() => talkToNPC('colleague_mate', '옆자리 박선생님')}
                                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border-2 border-black rounded-xl text-xs font-bold active:translate-y-0.5 text-slate-800 shadow-school-press transition-all"
                                      >
                                        💬 박 교사 (동료)
                                      </button>
                                    </>
                                  )}
                                  {currentLocation === 'health_room' && (
                                    <button
                                      onClick={() => talkToNPC('nurse', '보건 선생님')}
                                      className="px-3 py-2 bg-teal-50 hover:bg-teal-100 border-2 border-black rounded-xl text-xs font-bold active:translate-y-0.5 text-slate-800 shadow-school-press transition-all"
                                    >
                                      💬 보건 교사
                                    </button>
                                  )}
                                  {currentLocation === 'playground' && (
                                    <button
                                      onClick={() => talkToNPC('gym', '체육 선생님')}
                                      className="px-3 py-2 bg-orange-50 hover:bg-orange-100 border-2 border-black rounded-xl text-xs font-bold active:translate-y-0.5 text-slate-800 shadow-school-press transition-all"
                                    >
                                      💬 체육 교사
                                    </button>
                                  )}
                                  {currentLocation === 'principal_room' && (
                                    <button
                                      onClick={() => talkToNPC('principal', '교장 선생님')}
                                      className="px-3 py-2 bg-amber-50 hover:bg-amber-100 border-2 border-black rounded-xl text-xs font-bold active:translate-y-0.5 text-slate-800 shadow-school-press transition-all"
                                    >
                                      💬 교장 선생님
                                    </button>
                                  )}
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
                        <span className="text-[9px] bg-red-100 text-red-700 px-1 py-0.5 rounded flex-shrink-0 font-normal">
                          기한 {task.deadlineDay}일차
                        </span>
                      </div>
                      <div className="flex gap-2 text-[10px] text-slate-500 font-semibold mb-2">
                        <span>요구 AP: {task.estimatedTime}</span>
                        <span>피로도: +{task.stressCost}</span>
                      </div>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => completeTask(task.id)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold border border-black rounded p-1 text-[10px] transition-colors active:translate-y-0.5 shadow-school-press"
                      >
                        직접 결재 처리
                      </button>
                      {task.canDelegate && (
                        <button
                          onClick={() => delegateTask(task.id)}
                          className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold border border-black rounded p-1 text-[10px] transition-colors active:translate-y-0.5 shadow-school-press"
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
              쿨메신저 & 알림
            </h3>
            
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {dayEffectsTriggered.length > 0 ? (
                dayEffectsTriggered.map((msg, i) => (
                  <div key={i} className="bg-indigo-50 border border-indigo-200 rounded-xl p-2 text-[10px] text-indigo-900 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <p className="leading-snug">{msg}</p>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 text-[11px] text-center p-4 italic bg-slate-50 rounded-lg">
                  메신저에 새로운 알림이 없습니다.
                </div>
              )}

              {/* 최근 역사 로그 간이 표출 */}
              <div className="border-t border-slate-200 pt-3 mt-2">
                <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">최근 교직 행동 이력</h4>
                <div className="space-y-1 font-mono text-[9px] text-slate-500 overflow-y-auto max-h-[80px]">
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

            <div className="text-[10px] text-slate-500 font-medium">
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
                      <span className="text-[10px] font-bold text-slate-500">효과 변동:</span>
                      {npcDialogueSession.activeFeedbackEffects.map((eff, i) => {
                        const isPositive = eff.value > 0;
                        return (
                          <span 
                            key={i} 
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
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
    </div>
  );
};
