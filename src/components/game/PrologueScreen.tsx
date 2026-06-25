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

  // 긍정과 현실이 교차하는 입체적인 프롤로그 서사
  const prologueTexts = [
    "대한민국 공교육의 최전선.\n설렘과 두려움이 뒤섞인 채, 당신은 교문 앞에 서 있습니다.",
    "첫 출근날, 교문에 들어서자 아이들이 맑은 웃음으로 달려옵니다.\n\"선생님, 우리 선생님 맞죠? 반갑습니다!\"",
    "하지만 교실에 들어서는 순간,\n이미 메신저엔 공문 5건, 학부모 문자 3통이 쌓여 있습니다.",
    "이 일이 왜 이렇게 힘든지, 아무도 가르쳐주지 않았습니다.\n그러나 아이들의 눈빛만은 — 여전히 당신을 바라보고 있습니다.",
    `[${playerInfo.name}] 선생님, 이제 30일이 시작됩니다.\n당신은 어떤 교사로 살아가기를 선택하겠습니까?`
  ];

  useEffect(() => {
    if (activeStep >= prologueTexts.length) return;

    // 4.5초 후에 페이드아웃 시작
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
            <p className="text-xl md:text-2xl font-bold tracking-widest text-amber-400 break-keep">
              지금, 교문이 열립니다.
            </p>
            <p className="text-sm text-slate-400 font-sans tracking-wide leading-relaxed break-keep">
              아이들이 기다리고 있습니다.<br />
              공문도, 민원도, 동료의 시선도 — 모두 지금 이 순간부터 시작됩니다.<br />
              <span className="text-slate-300 font-semibold">당신이 선택한 교사의 삶을, 30일 동안 살아내세요.</span>
            </p>
            {/* 💡 교사력(TP) 규칙 안내 */}
            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-xl max-w-md mx-auto text-sm text-amber-300 font-sans leading-relaxed text-left space-y-2 my-3 shadow-inner break-keep">
              <span className="font-bold text-amber-400 flex items-center gap-1 text-base">💡 교사력(TP) 규칙 안내:</span>
              <p>• 매일 아침 교사에게는 5의 교사력(TP)이 기본으로 주어집니다.</p>
              <p>• 장소 이동, 대화, 업무, 학생 개별 지도 등 하나의 이벤트가 진행될 때마다 교사력(TP)이 1 소모됩니다.</p>
            </div>
            <div className="pt-4">
              <button
                onClick={onFinish}
                className="mx-auto flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-sans font-extrabold border-2 border-slate-900 rounded-2xl py-4 px-8 active:translate-y-0.5 shadow-[0_8px_0_#064e3b] hover:shadow-[0_6px_0_#064e3b] active:shadow-[0_2px_0_#064e3b] transition-all text-sm md:text-base cursor-pointer tracking-wider whitespace-nowrap"
              >
                <span>교단으로 출근하기</span>
                <ArrowRight className="w-5 h-5" />
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
      <div className="absolute bottom-6 text-xs text-slate-600 font-sans tracking-widest select-none">
        PROLOGUE CREDIT : TEACHER MAKER 2026
      </div>
    </div>
  );
};
