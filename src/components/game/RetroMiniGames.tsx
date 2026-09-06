import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useGameStore } from '@/store/useGameStore';
import { RETRO_MINI_GAMES, type RetroMiniGameType } from '@/game/miniGameDefs';
import { formatEffects } from '@/game/statLabels';

// ==========================================================================
// 돌발 레트로 미니게임 4종
//
// 정규(주간) 미니게임과 달리 일과 중 예고 없이 끼어드는 짧은 게임이다.
// 8비트 오락실 느낌(픽셀 테두리 · 스캔라인 · 모노스페이스 폰트)을 공통 셸에서 입히고,
// 각 게임은 그 안에 들어가는 화면만 담당한다. 모든 조작은 클릭/탭 하나로 끝나
// 모바일에서도 그대로 동작한다.
// ==========================================================================

// 공통 레트로 셸 ------------------------------------------------------------
const RetroFrame: React.FC<{
  title: string;
  hud?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, hud, children }) => (
  <div className="retro-screen retro-scanlines flex h-full flex-col gap-3 p-4 sm:p-5">
    <div className="flex flex-wrap items-center justify-between gap-2 border-b-4 border-double border-[#39ff14]/60 pb-2">
      <span className="retro-title text-sm sm:text-base">{title}</span>
      {hud}
    </div>
    {children}
  </div>
);

const RetroGauge: React.FC<{ label: string; value: number; max: number; danger?: boolean }> = ({
  label,
  value,
  max,
  danger
}) => {
  const cells = 10;
  const filled = Math.max(0, Math.min(cells, Math.round((value / max) * cells)));
  // 빈 칸은 색과 글자 모양을 모두 바꾼다. 투명도만 낮췄더니 검은 배경 위에서 채워진 칸과
  // 구분이 되지 않아, 게이지가 0일 때도 가득 찬 것처럼 보였다.
  return (
    <span className="flex items-center gap-1.5 text-[10px] sm:text-xs">
      <span className="opacity-80">{label}</span>
      <span className="tracking-[0.15em]">
        <span className={danger ? 'text-[#ff4d4d]' : 'text-[#39ff14]'}>{'█'.repeat(filled)}</span>
        <span className="text-[#2b4b2b]">{'░'.repeat(cells - filled)}</span>
      </span>
    </span>
  );
};

interface RetroGameProps {
  onComplete: (success: boolean) => void;
}

// 1. 인쇄실 용지 걸림 — 좌우로 튕기는 커서를 초록 구간에 멈추는 타이밍 게임 ------
const PRINTER_ROUNDS = 3;

const PrinterGame: React.FC<RetroGameProps> = ({ onComplete }) => {
  const [cursor, setCursor] = useState(0); // 0~100
  const [zone, setZone] = useState({ start: 40, width: 22 });
  const [cleared, setCleared] = useState(0);
  const [misses, setMisses] = useState(0);
  const [flash, setFlash] = useState<{ ok: boolean; msg: string } | null>(null);

  const dirRef = useRef(1);
  const speedRef = useRef(2.4);
  const lockedRef = useRef(false); // 판정 연출 중에는 커서를 멈추고 입력을 막는다

  useEffect(() => {
    const id = setInterval(() => {
      if (lockedRef.current) return;
      setCursor(prev => {
        let next = prev + dirRef.current * speedRef.current;
        if (next >= 100) {
          next = 100;
          dirRef.current = -1;
        } else if (next <= 0) {
          next = 0;
          dirRef.current = 1;
        }
        return next;
      });
    }, 16);
    return () => clearInterval(id);
  }, []);

  const handleStop = () => {
    if (lockedRef.current) return;
    lockedRef.current = true;

    const hit = cursor >= zone.start && cursor <= zone.start + zone.width;
    setFlash(
      hit
        ? { ok: true, msg: '롤러 해제! 종이가 딸려 나옵니다' }
        : { ok: false, msg: '헛손질! 종이가 조금 찢어졌습니다' }
    );

    const nextCleared = cleared + (hit ? 1 : 0);
    const nextMisses = misses + (hit ? 0 : 1);
    setCleared(nextCleared);
    setMisses(nextMisses);

    setTimeout(() => {
      setFlash(null);
      if (nextCleared >= PRINTER_ROUNDS) {
        confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
        onComplete(true);
        return;
      }
      if (nextMisses >= 3) {
        onComplete(false);
        return;
      }
      // 라운드가 올라갈수록 구간이 좁아지고 커서가 빨라진다
      const step = nextCleared;
      setZone({ start: 18 + Math.random() * 55, width: Math.max(10, 22 - step * 4) });
      speedRef.current = 2.4 + step * 0.9;
      lockedRef.current = false;
    }, 750);
  };

  return (
    <RetroFrame
      title="🖨️ PAPER JAM"
      hud={
        <span className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] sm:text-xs">
            해제 <b className="text-[#39ff14]">{cleared}</b>/{PRINTER_ROUNDS}
          </span>
          <RetroGauge label="찢김" value={misses} max={3} danger />
        </span>
      }
    >
      <div className="flex flex-1 flex-col justify-center gap-6">
        <p className="text-center text-[11px] leading-relaxed opacity-80 sm:text-xs">
          커서가 <span className="text-[#39ff14]">초록 롤러 구간</span>에 들어왔을 때 멈추세요.
          <br />
          {PRINTER_ROUNDS}번 성공하면 종이를 온전히 빼낼 수 있습니다.
        </p>

        <div className="relative h-14 border-4 border-[#39ff14]/70 bg-black/60">
          <div
            className="absolute inset-y-0 bg-[#39ff14]/25 border-x-2 border-[#39ff14]"
            style={{ left: `${zone.start}%`, width: `${zone.width}%` }}
          />
          <div
            className="absolute inset-y-0 w-1.5 bg-[#ffd400] shadow-[0_0_12px_#ffd400]"
            style={{ left: `calc(${cursor}% - 3px)` }}
          />
        </div>

        {flash && (
          <div
            className={`text-center text-xs font-bold sm:text-sm ${
              flash.ok ? 'text-[#39ff14]' : 'text-[#ff4d4d]'
            }`}
          >
            {flash.ok ? '▶ ' : '✖ '}
            {flash.msg}
          </div>
        )}

        <button onClick={handleStop} disabled={!!flash} className="retro-btn mx-auto w-full max-w-xs">
          ▼ 롤러 잡기
        </button>
      </div>
    </RetroFrame>
  );
};

// 2. 아이들 이름 외우기 — 얼굴/이름 짝 맞추기 메모리 게임 --------------------
interface MemoryCard {
  key: number;
  pairId: number;
  face: string; // 얼굴 이모지 또는 이름
  isName: boolean;
}

const NAMEFACE_PAIRS = [
  { face: '🧒', name: '민우' },
  { face: '👧', name: '지유' },
  { face: '🧑', name: '태풍' },
  { face: '👦', name: '하은' },
  { face: '🧑‍🦱', name: '예준' },
  { face: '👩‍🦰', name: '다혜' }
];

const NameFaceGame: React.FC<RetroGameProps> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(40);
  const [cards] = useState<MemoryCard[]>(() => {
    const deck: MemoryCard[] = [];
    NAMEFACE_PAIRS.forEach((p, i) => {
      deck.push({ key: i * 2, pairId: i, face: p.face, isName: false });
      deck.push({ key: i * 2 + 1, pairId: i, face: p.name, isName: true });
    });
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  });
  const [flipped, setFlipped] = useState<number[]>([]); // 현재 열어둔 카드 key (최대 2)
  const [matched, setMatched] = useState<number[]>([]); // 맞춘 pairId
  const [misses, setMisses] = useState(0);

  const finishedRef = useRef(false);
  const finish = useCallback(
    (success: boolean) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      if (success) confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
      onComplete(success);
    },
    [onComplete]
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) finish(false);
  }, [timeLeft, finish]);

  useEffect(() => {
    if (matched.length === NAMEFACE_PAIRS.length) finish(true);
  }, [matched.length, finish]);

  const handleFlip = (card: MemoryCard) => {
    if (flipped.length >= 2) return;
    if (flipped.includes(card.key) || matched.includes(card.pairId)) return;

    const next = [...flipped, card.key];
    setFlipped(next);
    if (next.length < 2) return;

    const [a, b] = next.map(k => cards.find(c => c.key === k)!);
    if (a.pairId === b.pairId) {
      setMatched(prev => [...prev, a.pairId]);
      setTimeout(() => setFlipped([]), 350);
    } else {
      setMisses(m => m + 1);
      setTimeout(() => setFlipped([]), 750);
    }
  };

  return (
    <RetroFrame
      title="🪪 NAME MATCH"
      hud={
        <span className="flex flex-wrap items-center gap-3 text-[10px] sm:text-xs">
          <span>
            TIME <b className={timeLeft <= 8 ? 'text-[#ff4d4d]' : 'text-[#39ff14]'}>{timeLeft}</b>s
          </span>
          <span>
            짝 <b className="text-[#39ff14]">{matched.length}</b>/{NAMEFACE_PAIRS.length}
          </span>
          <span className="opacity-70">헛손질 {misses}</span>
        </span>
      }
    >
      <p className="text-center text-[11px] opacity-80 sm:text-xs">
        얼굴 카드와 이름 카드를 짝지어 주세요. 시간 안에 모두 맞춰야 합니다.
      </p>
      <div className="grid min-h-0 flex-1 grid-cols-4 grid-rows-3 gap-2 sm:gap-3">
        {cards.map(card => {
          const isOpen = flipped.includes(card.key) || matched.includes(card.pairId);
          const isDone = matched.includes(card.pairId);
          return (
            <button
              key={card.key}
              onClick={() => handleFlip(card)}
              className={`retro-card ${isOpen ? 'retro-card-open' : ''} ${isDone ? 'retro-card-done' : ''}`}
            >
              {/* 뒷면일 때는 글자 크기를 통일한다. 이름 카드(작은 글씨)와 얼굴 카드(큰 글씨)의
                  크기가 달라, 뒤집기 전에도 어느 쪽인지 알 수 있어 게임이 성립하지 않았다. */}
              <span
                className={
                  !isOpen
                    ? 'text-xl sm:text-2xl'
                    : card.isName
                      ? 'text-xs sm:text-sm'
                      : 'text-2xl sm:text-3xl'
                }
              >
                {isOpen ? card.face : '?'}
              </span>
            </button>
          );
        })}
      </div>
    </RetroFrame>
  );
};

// 3. 복도 안전 지도 — 3x3 칸에서 튀어나오는 아이 누르기 ----------------------
const HALLWAY_TARGET = 12;

const HallwayGame: React.FC<RetroGameProps> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(25);
  const [safety, setSafety] = useState(100);
  const [caught, setCaught] = useState(0);
  const [active, setActive] = useState<{ cell: number; kind: 'run' | 'walk' } | null>(null);

  const finishedRef = useRef(false);
  const finish = useCallback(
    (success: boolean) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      if (success) confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
      onComplete(success);
    },
    [onComplete]
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // 등장/퇴장 사이클. 놓친 '뛰는 아이'는 안전 게이지를 깎는다.
  useEffect(() => {
    if (timeLeft === 0) return;
    const id = setInterval(() => {
      setActive(prev => {
        if (prev) {
          // 시간 안에 못 눌렀다 -> 뛰는 아이면 감점
          if (prev.kind === 'run') setSafety(s => Math.max(0, s - 12));
          return null;
        }
        return {
          cell: Math.floor(Math.random() * 9),
          // 걷는 아이(누르면 안 되는 대상)를 섞어 무지성 연타를 막는다
          kind: Math.random() < 0.75 ? 'run' : 'walk'
        };
      });
    }, 700);
    return () => clearInterval(id);
  }, [timeLeft]);

  useEffect(() => {
    if (safety <= 0) finish(false);
  }, [safety, finish]);

  useEffect(() => {
    if (timeLeft === 0) finish(caught >= HALLWAY_TARGET && safety > 0);
  }, [timeLeft, caught, safety, finish]);

  useEffect(() => {
    if (caught >= HALLWAY_TARGET) finish(true);
  }, [caught, finish]);

  const handleCell = (cell: number) => {
    if (!active || active.cell !== cell) return;
    if (active.kind === 'run') {
      setCaught(c => c + 1);
    } else {
      // 얌전히 걷던 아이를 붙잡아 세웠다 -> 억울해진 아이, 안전 게이지 소폭 하락
      setSafety(s => Math.max(0, s - 6));
    }
    setActive(null);
  };

  return (
    <RetroFrame
      title="🏃 HALLWAY PATROL"
      hud={
        <span className="flex flex-wrap items-center gap-3 text-[10px] sm:text-xs">
          <span>
            TIME <b className={timeLeft <= 5 ? 'text-[#ff4d4d]' : 'text-[#39ff14]'}>{timeLeft}</b>s
          </span>
          <span>
            지도 <b className="text-[#39ff14]">{caught}</b>/{HALLWAY_TARGET}
          </span>
          <RetroGauge label="안전" value={safety} max={100} danger={safety <= 30} />
        </span>
      }
    >
      <p className="text-center text-[11px] leading-relaxed opacity-80 sm:text-xs">
        <span className="text-[#ff4d4d]">🏃 뛰는 아이</span>만 눌러 세우세요.
        <span className="ml-2 text-[#39ff14]">🚶 걷는 아이</span>를 잡으면 억울해합니다.
      </p>
      <div className="mx-auto grid min-h-0 w-full max-w-sm flex-1 grid-cols-3 grid-rows-3 gap-2 sm:gap-3">
        {Array.from({ length: 9 }, (_, cell) => {
          const here = active?.cell === cell ? active : null;
          return (
            <button key={cell} onClick={() => handleCell(cell)} className="retro-cell">
              {here && (
                <span className="animate-[retroPop_0.2s_ease-out] text-2xl sm:text-3xl">
                  {here.kind === 'run' ? '🏃' : '🚶'}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </RetroFrame>
  );
};

// 4. 아침 조회 호명 순서 — 사이먼 세즈 방식의 순서 기억 게임 ------------------
const ATTENDANCE_KIDS = ['🧒', '👧', '🧑', '👦'];
const ATTENDANCE_CLEAR_ROUND = 5; // 이 라운드를 통과하면 성공

const randomKid = () => Math.floor(Math.random() * ATTENDANCE_KIDS.length);

const AttendanceGame: React.FC<RetroGameProps> = ({ onComplete }) => {
  // 순서는 라운드를 넘길 때(이벤트 핸들러)만 늘린다. 재생 이펙트는 이미 확정된 순서를
  // 보여주기만 하므로, 이펙트 안에서 상태를 다시 세팅하는 연쇄 렌더가 생기지 않는다.
  const [sequence, setSequence] = useState<number[]>(() => [randomKid()]);
  const [phase, setPhase] = useState<'watch' | 'input' | 'judge'>('watch');
  const [highlight, setHighlight] = useState<number | null>(null);
  const [inputIdx, setInputIdx] = useState(0);
  const [round, setRound] = useState(1);
  const [msg, setMsg] = useState('1단계 — 순서를 기억하세요');

  const finishedRef = useRef(false);
  const finish = useCallback(
    (success: boolean) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      if (success) confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
      onComplete(success);
    },
    [onComplete]
  );

  // 현재 순서를 순차 재생하고, 끝나면 입력 단계로 넘긴다.
  useEffect(() => {
    if (phase !== 'watch') return;

    const timers: number[] = [];
    sequence.forEach((kid, i) => {
      timers.push(window.setTimeout(() => setHighlight(kid), 600 * i + 400));
      timers.push(window.setTimeout(() => setHighlight(null), 600 * i + 850));
    });
    timers.push(
      window.setTimeout(() => {
        setInputIdx(0);
        setPhase('input');
        setMsg('이제 같은 순서대로 눌러주세요!');
      }, 600 * sequence.length + 500)
    );

    return () => timers.forEach(t => clearTimeout(t));
  }, [phase, sequence]);

  const handlePick = (kid: number) => {
    if (phase !== 'input') return;

    if (sequence[inputIdx] !== kid) {
      setPhase('judge');
      setMsg('순서를 놓쳤습니다...');
      setTimeout(() => finish(false), 700);
      return;
    }

    setHighlight(kid);
    setTimeout(() => setHighlight(null), 180);

    const nextIdx = inputIdx + 1;
    if (nextIdx < sequence.length) {
      setInputIdx(nextIdx);
      return;
    }

    // 이번 라운드 통과
    setPhase('judge');
    if (round >= ATTENDANCE_CLEAR_ROUND) {
      setMsg('전원 호명 완료!');
      setTimeout(() => finish(true), 700);
    } else {
      setMsg('좋아요! 다음 아이가 손을 듭니다');
      setTimeout(() => {
        setRound(r => r + 1);
        setSequence(prev => [...prev, randomKid()]); // 다음 라운드 순서를 여기서 늘린다
        setPhase('watch');
      }, 800);
    }
  };

  return (
    <RetroFrame
      title="🔔 ROLL CALL"
      hud={
        <span className="text-[10px] sm:text-xs">
          STAGE <b className="text-[#39ff14]">{round}</b>/{ATTENDANCE_CLEAR_ROUND}
        </span>
      }
    >
      <p className="text-center text-xs font-bold text-[#ffd400] sm:text-sm">{msg}</p>
      <div className="grid min-h-0 flex-1 grid-cols-2 content-center gap-3 sm:grid-cols-4">
        {ATTENDANCE_KIDS.map((kid, idx) => (
          <button
            key={idx}
            onClick={() => handlePick(idx)}
            disabled={phase !== 'input'}
            className={`retro-cell text-4xl transition-all sm:text-5xl ${
              highlight === idx ? 'retro-cell-lit' : ''
            } ${phase === 'input' ? 'cursor-pointer' : 'cursor-default'}`}
          >
            {kid}
          </button>
        ))}
      </div>
      <p className="text-center text-[10px] opacity-60 sm:text-xs">
        {phase === 'input' ? `${inputIdx} / ${sequence.length} 호명` : '재생 중...'}
      </p>
    </RetroFrame>
  );
};

// ==========================================================================
// 돌발 미니게임 오버레이 (인트로 → 플레이 → 결과)
// ==========================================================================
const GAME_COMPONENTS: Record<RetroMiniGameType, React.FC<RetroGameProps>> = {
  printer: PrinterGame,
  nameface: NameFaceGame,
  hallway: HallwayGame,
  attendance: AttendanceGame
};

interface RetroMiniGamesProps {
  gameType: RetroMiniGameType;
  onResolve: (success: boolean) => void;
}

export const RetroMiniGames: React.FC<RetroMiniGamesProps> = ({ gameType, onResolve }) => {
  const [stage, setStage] = useState<'intro' | 'playing' | 'result'>('intro');
  const [success, setSuccess] = useState<boolean | null>(null);
  const def = RETRO_MINI_GAMES[gameType];
  const GameComponent = GAME_COMPONENTS[gameType];

  const handleEnd = useCallback((isSuccess: boolean) => {
    setSuccess(isSuccess);
    setStage('result');
  }, []);

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/92 p-3 backdrop-blur-md sm:p-6">
      <div className="flex h-[min(92vh,640px)] w-full max-w-3xl flex-col">
        {stage === 'intro' && (
          <div className="retro-screen retro-scanlines flex flex-1 flex-col items-center justify-center gap-5 p-6 text-center sm:p-10">
            <span className="retro-blink text-xs tracking-[0.3em] text-[#ffd400] sm:text-sm">
              !! 돌발 상황 발생 !!
            </span>
            <span className="text-6xl sm:text-7xl">{def.icon}</span>
            <h1 className="retro-title text-xl sm:text-2xl">{def.title}</h1>
            <p className="max-w-md text-[11px] leading-relaxed opacity-85 sm:text-sm">{def.situation}</p>
            <p className="max-w-md border-2 border-dashed border-[#39ff14]/50 p-3 text-[11px] leading-relaxed sm:text-xs">
              {def.desc}
            </p>
            <button onClick={() => setStage('playing')} className="retro-btn w-full max-w-xs">
              ▶ PRESS START
            </button>
          </div>
        )}

        {stage === 'playing' && (
          <div className="flex-1 overflow-hidden">
            <GameComponent onComplete={handleEnd} />
          </div>
        )}

        {stage === 'result' && (
          <div className="retro-screen retro-scanlines flex flex-1 flex-col items-center justify-center gap-5 p-6 text-center sm:p-10">
            <span className="text-6xl sm:text-7xl">{success ? '🏅' : '💧'}</span>
            <h1 className={`retro-title text-xl sm:text-2xl ${success ? '' : 'text-[#ff4d4d]'}`}>
              {success ? 'STAGE CLEAR!' : 'GAME OVER'}
            </h1>
            <p className="max-w-md text-[11px] leading-relaxed opacity-85 sm:text-sm">
              {success ? def.successText : def.failText}
            </p>
            <div className="w-full max-w-sm border-2 border-[#39ff14]/50 p-3 text-left text-[11px] sm:text-xs">
              <div className="mb-1 opacity-70">▷ 스탯 보정</div>
              <div className={success ? 'text-[#39ff14]' : 'text-[#ff4d4d]'}>
                {formatEffects(success ? def.successEffects : def.failEffects)}
              </div>
            </div>
            <button
              onClick={() => success !== null && onResolve(success)}
              className="retro-btn w-full max-w-xs"
            >
              결과 반영하고 일과로 복귀
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// 스토어와 직접 연결되는 래퍼 — 대시보드는 이것만 렌더링하면 된다.
export const RetroMiniGameHost: React.FC = () => {
  const activeRetroMiniGame = useGameStore(state => state.activeRetroMiniGame);
  const resolveRetroMiniGame = useGameStore(state => state.resolveRetroMiniGame);

  if (!activeRetroMiniGame) return null;
  return <RetroMiniGames gameType={activeRetroMiniGame} onResolve={resolveRetroMiniGame} />;
};
