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

  // 신임 교사로서의 설렘, 학생의 응원, 학부모의 긍정적인 반응 등 긍정적 서사 융합
  const prologueTexts = [
    "대한민국 공교육의 최전선, 설렘과 열정이 가득한 초등학교 교실...",
    "첫 출근날, 교문에 들어서자 아이들이 맑은 웃음으로 인사하며 달려옵니다.",
    "\"선생님, 올해 우리 담임 선생님이세요? 만나서 정말 기뻐요!\"\n학부모님들의 따뜻한 격려 문자와 동료 교사들의 응원이 가슴을 벅차게 만듭니다.",
    "물론 매일 쏟아지는 공문 결재와 바쁜 교무실의 일상도 기다리고 있지만,\n선생님의 열정은 그 무엇보다 뜨겁습니다.",
    `신임 교사 [${playerInfo.name}] 선생님의 가슴 벅찬 도전!\n아이들과 함께 성장해 나갈 30일간의 아름다운 여정이 지금 시작됩니다.`
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
      {/* 우측 상단 영화 스킵 버튼 (12px = text-xs 확보) */}
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
              교문의 벨소리가 울려 퍼집니다.
            </p>
            <p className="text-sm text-slate-400 font-sans tracking-wide leading-relaxed break-keep">
              긴장되는 첫 출근길, 아이들이 교문 저편에서 웃으며 달려오고 있습니다.<br />
              김 부장 선생님의 기안 독촉 메신저와 학부모의 카톡 알림이 스마트폰을 흔듭니다.
            </p>
            {/* 💡 체력 규칙을 5의 교사력(TP)으로 수정하고 폰트 크기 및 줄바꿈 보완 */}
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

      {/* 영화 느낌의 하단 레터박스 여백 데코 (12px = text-xs 확보) */}
      <div className="absolute bottom-6 text-xs text-slate-600 font-sans tracking-widest select-none">
        PROLOGUE CREDIT : TEACHER MAKER 2026
      </div>
    </div>
  );
};0_6px_0_#064e3b] active:shadow-[0_2px_0_#064e3b] transition-all text-sm md:text-base cursor-pointer tracking-wider"
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
