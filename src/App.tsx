import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { TitleScreen } from '@/components/game/TitleScreen';
import { CharacterCreator } from '@/components/game/CharacterCreator';
import { DashboardLayout } from '@/components/game/DashboardLayout';
import { EndingScreen } from '@/components/game/EndingScreen';
import { EndingGallery } from '@/components/game/EndingGallery';

type ViewState = 'title' | 'create' | 'playing' | 'ending' | 'gallery';

function App() {
  const { gameStarted, endingId, resetGame } = useGameStore();
  const [viewState, setViewState] = useState<ViewState>('title');

  // 스토어의 핵심 진행 상태가 바뀔 때 뷰 상태 자동 동기화
  useEffect(() => {
    if (endingId) {
      setViewState('ending');
    } else if (gameStarted) {
      setViewState('playing');
    } else {
      setViewState('title');
    }
  }, [gameStarted, endingId]);

  // 다시 처음부터 하기
  const handleRestart = () => {
    resetGame();
    setViewState('title');
  };

  return (
    <>
      {viewState === 'title' && (
        <TitleScreen
          onStartNewGame={() => setViewState('create')}
          onOpenGallery={() => setViewState('gallery')}
        />
      )}

      {viewState === 'create' && (
        <CharacterCreator
          onBackToTitle={() => setViewState('title')}
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
