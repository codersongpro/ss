import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { TitleScreen } from '@/components/game/TitleScreen';
import { CharacterCreator } from '@/components/game/CharacterCreator';
import { PrologueScreen } from '@/components/game/PrologueScreen';
import { DashboardLayout } from '@/components/game/DashboardLayout';
import { EndingScreen } from '@/components/game/EndingScreen';
import { EndingGallery } from '@/components/game/EndingGallery';
import type { PlayerInfo } from '@/game/types';

type ViewState = 'title' | 'create' | 'prologue' | 'playing' | 'ending' | 'gallery';

function App() {
  const { gameStarted, endingId, resetGame, startGame } = useGameStore();
  const [viewState, setViewState] = useState<ViewState>('title');
  const [tempPlayerInfo, setTempPlayerInfo] = useState<PlayerInfo | null>(null);

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

  // 다시 처음부터 하기
  const handleRestart = () => {
    resetGame();
    setTempPlayerInfo(null);
    setViewState('title');
  };

  return (
    <>
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
