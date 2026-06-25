import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { TitleScreen } from '@/components/game/TitleScreen';
import { CharacterCreator } from '@/components/game/CharacterCreator';
import { PrologueScreen } from '@/components/game/PrologueScreen';
import { DashboardLayout } from '@/components/game/DashboardLayout';
import { EndingScreen } from '@/components/game/EndingScreen';
import { EndingGallery } from '@/components/game/EndingGallery';
import type { PlayerInfo } from '@/game/types';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';

type ViewState = 'title' | 'create' | 'prologue' | 'playing' | 'ending' | 'gallery';

function App() {
  const { gameStarted, endingId, resetGame, startGame, bgmVolume, setBgmVolume } = useGameStore();
  const [viewState, setViewState] = useState<ViewState>('title');
  const [tempPlayerInfo, setTempPlayerInfo] = useState<PlayerInfo | null>(null);

  const toggleVolume = () => {
    const nextVolume = (bgmVolume + 1) % 6;
    setBgmVolume(nextVolume);
  };

  const getVolumeIcon = () => {
    if (bgmVolume === 0) return <VolumeX className="w-4 h-4 text-rose-500 font-bold" />;
    if (bgmVolume <= 2) return <Volume1 className="w-4 h-4 text-slate-300 font-bold" />;
    return <Volume2 className="w-4 h-4 text-emerald-400 font-bold" />;
  };

  // 스토어의 핵심 진행 상태가 바뀔 때 뷰 상태 자동 동기화
  useEffect(() => {
    if (endingId) {
      setViewState('ending');
    } else if (gameStarted) {
      setViewState('playing');
    } else {
      // 캐릭터 생성 중이거나 프롤로그 화면에 진입한 도중에는 title로 리셋되지 않게 분기 보호
      if (viewState !== 'create' && viewState !== 'prologue') {
        setViewState('title');
      }
    }
  }, [gameStarted, endingId]);

  // 사용자가 페이지 접속 후 최초 1회 화면을 클릭/터치하거나 키를 입력하면 배경음을 즉시 재생시키는 우회 자동재생 리스너 [NEW]
  useEffect(() => {
    const startAudioOnFirstInteraction = () => {
      const { bgmVolume, setBgmVolume } = useGameStore.getState();
      if (bgmVolume > 0) {
        setBgmVolume(bgmVolume);
      }
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('click', startAudioOnFirstInteraction);
      window.removeEventListener('touchstart', startAudioOnFirstInteraction);
      window.removeEventListener('keydown', startAudioOnFirstInteraction);
    };

    window.addEventListener('click', startAudioOnFirstInteraction);
    window.addEventListener('touchstart', startAudioOnFirstInteraction);
    window.addEventListener('keydown', startAudioOnFirstInteraction);

    return cleanup;
  }, []);

  // 다시 처음부터 하기
  const handleRestart = () => {
    resetGame();
    setTempPlayerInfo(null);
    setViewState('title');
  };

  return (
    <>
      {/* 전역 볼륨 컨트롤러: 게임 대시보드 화면(playing)이 아닐 때만 고정 노출 */}
      {viewState !== 'playing' && (
        <div className="fixed top-6 right-6 z-[1000] flex items-center gap-1.5 bg-black/60 hover:bg-black/85 backdrop-blur-sm border-2 border-black rounded-full px-3.5 py-1.5 text-white text-xs font-bold shadow-lg select-none transition-all">
          <button 
            onClick={toggleVolume}
            className="hover:text-emerald-300 transition-colors flex items-center gap-1.5 focus:outline-none cursor-pointer"
            title="배경음 볼륨 조절 (0~5)"
          >
            {getVolumeIcon()}
            <span className="font-mono font-extrabold">
              {bgmVolume === 0 ? 'OFF' : `LV.${bgmVolume}`}
            </span>
          </button>
        </div>
      )}

      {viewState === 'title' && (
        <TitleScreen
          onStartNewGame={() => setViewState('create')}
          onOpenGallery={() => setViewState('gallery')}
          onContinueGame={() => setViewState('playing')}
        />
      )}

      {viewState === 'create' && (
        <CharacterCreator
          onBackToTitle={() => setViewState('title')}
          onComplete={(info) => {
            setTempPlayerInfo(info);
            setViewState('prologue');
          }}
        />
      )}

      {viewState === 'prologue' && tempPlayerInfo && (
        <PrologueScreen
          playerInfo={tempPlayerInfo}
          onFinish={() => {
            startGame(tempPlayerInfo);
            setViewState('playing');
          }}
        />
      )}

      {viewState === 'playing' && (
        <DashboardLayout
          onExitGame={() => {
            if (confirm('현재 진행 상황이 안전하게 저장됩니다. 타이틀 화면으로 나갈까요?')) {
              setViewState('title');
            }
          }}
        />
      )}

      {viewState === 'ending' && (
        <EndingScreen
          onRestart={handleRestart}
        />
      )}

      {viewState === 'gallery' && (
        <EndingGallery
          onBackToTitle={() => setViewState('title')}
        />
      )}
    </>
  );
}

export default App;
