import React, { useState, useEffect } from 'react';
import type { PlayerInfo } from '@/game/types';
import { Film, ArrowRight } from 'lucide-react';

interface PrologueScreenProps {
  playerInfo: PlayerInfo;
  onFinish: () => void;
}

export const PrologueScreen: React.FC<PrologueScreenProps> = ({ playerInfo, onFinish }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  const prologueTexts = [
    "대한민국 공교육의 최전선, 초등학교 교실...",
    "누군가에게는 따뜻한 배움의 안식처이지만,",
    "누군가에게는 끝없는 행정과 격무의 사투장입니다.",
    "연일 울려대는 메신저의 공문 결재 소리,\n그리고 긴장을 늦출 수 없는 학부모들의 전화와 문자...",
    `그 폭풍의 한가운데, 신임 교사 [${playerInfo.name}] 선생님의\n30일간의 처절하고 숭고한 생존기가 지금 시작됩니다.`
  ];

  useEffect(() => {
    if (activeStep >= prologueTexts.length) return;

    // 4.2초 후에 페이드아웃 시작 (클릭을 안 했을 때 자동 전진용 기한을 조금 더 줌)
    const fadeOutTimer = setTimeout(() => {
      setFadeState('out');
    }, 4500);

    // 5초 후에 다음 문구로 전환 (페이드인 복구)
    const nextStepTimer = setTimeout(() => {
      setActiveStep(prev => prev + 1);
      setFadeState('in');
    }, 5000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(nextStepTimer);
    };
  }, [activeStep, prologueTexts.length]);

  // 화면 클릭 시 수동 전진 처리 헬퍼
  const handleContainerClick = (e: React.MouseEvent) => {
    // 버튼 클릭 시에는 컨테이너 클릭 이벤트 무시
    if ((e.target as HTMLElement).closest('button')) return;

    if (activeStep < prologueTexts.length) {
      setFadeState('out');
      setTimeout(() => {
        setActiveStep(prev => prev + 1);
        setFadeState('in');
      }, 300);
    }
  };

  return (
    <div 
      onClick={handleContainerClick}
      className="fixed inset-0 z-50 bg-black text-slate-100 flex flex-col items-center justify-center p-6 font-serif select-none animate-fade-in animate-duration-1000 cursor-pointer"
    >
      {/* 우측 상단 영화 스킵 버튼 */}
      {activeStep < prologueTexts.length && (
        <button
          onClick={onFinish}
          className="absolute top-6 right-6 flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-200 transition-colors font-sans font-bold bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-1.5 cursor-pointer shadow-lg active:scale-95 z-10"
        >
          <Film className="w-3.5 h-3.5" />
          <span>오프닝 스킵 (Skip ➔)</span>
        </button>
      )}

      {/* 시네마틱 텍스트 영역 */}
      <div className="max-w-2xl w-full text-center min-h-[160px] flex items-center justify-center">
        {activeStep < prologueTexts.length ? (
          <p
            className={`text-lg md:text-xl font-medium leading-relaxed whitespace-pre-line tracking-wider text-slate-200 transition-all duration-500 ${
              fadeState === 'in' ? 'opacity-100 scale-100 filter blur-0' : 'opacity-0 scale-95 filter blur-sm'
            }`}
          >
            {prologueTexts[activeStep]}
          </p>
        ) : (
          /* 모든 시놉시스 스크롤이 끝났을 때 나타나는 부임 개시 버튼 */
          <div className="space-y-6 animate-fade-in animate-duration-1000">
            <p className="text-xl md:text-2xl font-bold tracking-widest text-amber-400">
              교문의 벨소리가 울려 퍼집니다.
            </p>
            <p className="text-xs md:text-sm text-slate-400 font-sans tracking-wide leading-relaxed">
              긴장되는 첫 출근길, 아이들이 교문 저편에서 웃으며 달려오고 있습니다.<br />
              김 부장 선생님의 기안 독촉 메신저와 학부모의 카톡 알림이 스마트폰을 흔듭니다.
            </p>
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl max-w-md mx-auto text-xs text-amber-300 font-sans leading-relaxed text-left space-y-1 my-3 shadow-inner">
              <span className="font-bold text-amber-400 flex items-center gap-1">💡 체력 규칙 안내:</span>
              <p>• 매일 아침 교사에게는 5의 체력이 기본으로 주어집니다.</p>
              <p>• 장소 이동, 대화, 업무, 학생 개별 지도 등 하나의 이벤트가 벌어질 때마다 체력이 1 소모됩니다.</p>
            </div>
            <div className="pt-4">
              <button
                onClick={onFinish}
                className="mx-auto flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-sans font-extrabold border-2 border-slate-900 rounded-2xl py-4 px-8 active:translate-y-0.5 shadow-[0_8px_0_#064e3b] hover:shadow-[0_6px_0_#064e3b] active:shadow-[0_2px_0_#064e3b] transition-all text-sm md:text-base cursor-pointer tracking-wider"
              >
                <span>초등학교 교단으로 출근하기</span>
                <ArrowRight className="w-5 h-5 animate-bounce-horizontal" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 화면 클릭 안내 메시지 */}
      {activeStep < prologueTexts.length && (
        <div className="absolute bottom-16 text-xs text-slate-500 font-sans tracking-wide animate-pulse">
          화면 아무 곳이나 클릭하면 빠르게 진행됩니다
        </div>
      )}

      {/* 영화 느낌의 하단 레터박스 여백 데코 */}
      <div className="absolute bottom-6 text-[10px] text-slate-600 font-sans tracking-widest select-none">
        PROLOGUE CREDIT : TEACHER MAKER 2026
      </div>
    </div>
  );
};
