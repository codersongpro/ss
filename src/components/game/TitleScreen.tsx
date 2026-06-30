import React from 'react';
import { useGameStore } from '@/store/useGameStore';
import { BookOpen, Play, RotateCcw, Award } from 'lucide-react';
import { titleHeroImage } from '@/assets/gameImageAssets';

interface TitleScreenProps {
  onStartNewGame: () => void;
  onOpenGallery: () => void;
  onContinueGame: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartNewGame,
  onOpenGallery,
  onContinueGame,
}) => {
  const { gameStarted, resetGame } = useGameStore();

  // 기존 저장 데이터 여부 확인 (Zustand persist 스토어에서 읽어옴)
  const handleContinue = () => {
    // Autoplay 정책 우회를 위해 사용자 인터랙션 발생 시 볼륨을 명시적으로 기동
    const { bgmVolume, setBgmVolume } = useGameStore.getState();
    setBgmVolume(bgmVolume);
    if (gameStarted) {
      onContinueGame();
    } else {
      alert('저장된 게임이 없습니다. 새 게임을 시작해 주세요!');
    }
  };

  const handleStartNew = () => {
    const { bgmVolume, setBgmVolume } = useGameStore.getState();
    setBgmVolume(bgmVolume);
    onStartNewGame();
  };

  return (
    <div className="min-height-screen flex flex-col items-center justify-center p-6 bg-[#FAF8F5] relative overflow-hidden" style={{ minHeight: '100vh' }}>
      {/* 칠판 테마 배경 컨테이너 */}
      <div className="max-w-4xl w-full chalkboard-bg p-8 md:p-12 text-center flex flex-col items-center justify-center relative">
        {/* 분필 장식 라인 */}
        <div className="absolute top-4 left-4 right-4 h-1 border-t border-dashed border-white/30" />
        <div className="absolute bottom-4 left-4 right-4 h-1 border-b border-dashed border-white/30" />

        {/* 장식용 아이콘 */}
        <BookOpen className="w-16 h-16 text-emerald-300 mb-4 animate-float" />

        <img
          src={titleHeroImage}
          alt="칠판 앞에서 새 학기를 바라보는 교사의 뒷모습"
          className="w-full max-w-2xl aspect-[16/9] object-cover rounded-lg border-4 border-black shadow-school-press mb-6 bg-black/20"
        />

        {/* 대문 타이틀 */}
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-3 chalk-text leading-tight">
          티처 메이커
        </h1>
        <p className="text-base md:text-xl text-emerald-200 mb-8 font-school font-bold tracking-wide">
          30일 동안 교사로 살아남는 로그라이크 게임
        </p>

        {/* 서브 설명글 */}
        <div className="max-w-md bg-black/25 backdrop-blur-sm rounded-lg p-4 border border-white/10 text-white/90 text-sm md:text-base mb-10 leading-relaxed font-light">
          "새 학기 첫날, 낯선 교무실 문이 열립니다.<br />
          학생의 성장, 학부모 민원, 행정업무 속에서<br />
          당신은 어떤 교사로 살아가기를 선택하시겠습니까?"
        </div>

        {/* 메뉴 버튼 그룹 */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full justify-center max-w-lg">
          {gameStarted ? (
            <button
              onClick={handleContinue}
              className="flex-1 min-w-[140px] btn-school-accent flex items-center justify-center gap-2 py-3 px-6 text-lg whitespace-nowrap"
            >
              <Play className="w-5 h-5" />
              이어하기
            </button>
          ) : (
            <button
              onClick={handleStartNew}
              className="flex-1 min-w-[140px] btn-school-primary flex items-center justify-center gap-2 py-3 px-6 text-lg whitespace-nowrap"
            >
              <Play className="w-5 h-5" />
              새 게임 시작
            </button>
          )}

          {gameStarted && (
            <button
              onClick={() => {
                if (confirm('진행 중인 모든 기록이 초기화됩니다. 정말 새 게임을 시작할까요?')) {
                  resetGame();
                  handleStartNew();
                }
              }}
              className="flex-1 min-w-[160px] btn-school-secondary flex items-center justify-center gap-2 py-3 px-6 text-lg text-slate-700 whitespace-nowrap"
            >
              <RotateCcw className="w-5 h-5" />
              처음부터 하기
            </button>
          )}

          <button
            onClick={onOpenGallery}
            className="flex-1 min-w-[140px] btn-school-secondary flex items-center justify-center gap-2 py-3 px-6 text-lg text-slate-700 whitespace-nowrap"
          >
            <Award className="w-5 h-5" />
            엔딩 갤러리
          </button>
        </div>



        {/* 개발 정보 및 가상 이야기 고지 */}
        <div className="mt-8 text-center text-slate-500 text-xs md:text-sm max-w-xl space-y-1.5 select-none font-sans font-medium">
          <p className="font-extrabold text-slate-700 text-sm">개발: Dustin</p>
          <p className="leading-relaxed">
            이 게임은 학교생활을 소재로 한 가상의 이야기입니다. 등장인물과 사건은 모두 허구이며, 특정 개인·학교·기관을 지칭하거나 비하할 의도가 없습니다. 실제 상황과 구분하여 재미로 즐겨 주세요.
          </p>
        </div>
      </div>
    </div>
  );
};
