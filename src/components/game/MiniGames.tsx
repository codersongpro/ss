import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { Timer, Shield, Check, ShieldAlert, Award, FileText, Zap, ChevronRight, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WEEKLY_MINI_GAMES } from '@/game/miniGameDefs';
import { formatEffects } from '@/game/statLabels';

// ==========================================
// 1. 급식 전쟁 타이쿤 (Cafeteria Tycoon)
// ==========================================
interface Bubble {
  id: number;
  x: number;
  y: number;
  type: 'run' | 'spinach' | 'drop';
  timeRemaining: number; // 초 단위 잔여 시간
}

const CAFETERIA_TARGET = 12;

const CafeteriaGame: React.FC<{ onComplete: (success: boolean) => void }> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(25);
  const [hp, setHp] = useState(100);
  const [spilledCount, setSpilledCount] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const nextId = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 종료 판정이 여러 이펙트에서 동시에 걸릴 수 있어(체력 소진 + 시간 만료) 1회로 봉인한다.
  const finishedRef = useRef(false);
  const finish = useCallback(
    (success: boolean) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      if (success) confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      onComplete(success);
    },
    [onComplete]
  );

  // 게임 메인 타이머
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 버블 관리 타이머 (0.1초 단위 업데이트)
  // [FIX] 예전에는 의존성에 bubbles.length가 들어 있어 버블이 생기거나 사라질 때마다 100ms
  // 인터벌이 통째로 해제·재생성됐다. 남은 시간 감소가 그때마다 초기화되어 제한 시간 표시가
  // 실제 동작과 어긋났다. 스폰 상한 판정은 setBubbles 업데이터 안에서 최신 값으로 처리하고,
  // 인터벌은 게임 시작~종료까지 하나만 유지한다.
  useEffect(() => {
    if (timeLeft <= 0) return;

    const bubbleInterval = setInterval(() => {
      // 1. 기존 버블 시간 감소 및 패널티 정산
      setBubbles((prev) => {
        const next: Bubble[] = [];
        prev.forEach((b) => {
          const nextTime = b.timeRemaining - 0.1;
          if (nextTime <= 0) {
            // 시간이 끝남 -> 대처 실패 패널티 적용
            if (b.type === 'run') {
              setHp((h) => Math.max(0, h - 15));
            } else if (b.type === 'drop') {
              setSpilledCount((s) => s + 1);
            } else if (b.type === 'spinach') {
              setHp((h) => Math.max(0, h - 5));
            }
          } else {
            next.push({ ...b, timeRemaining: nextTime });
          }
        });

        // 2. 새로운 버블 무작위 생성 (약 15% 확률, 동시 5개 상한)
        if (Math.random() < 0.15 && next.length < 5 && containerRef.current) {
          const types: Bubble['type'][] = ['run', 'spinach', 'drop'];
          const randomType = types[Math.floor(Math.random() * types.length)];
          const timeLimit = randomType === 'drop' ? 1.5 : randomType === 'run' ? 2.5 : 3.5;
          const width = Math.max(20, containerRef.current.clientWidth - 110);
          const height = Math.max(20, containerRef.current.clientHeight - 90);
          next.push({
            id: nextId.current++,
            x: Math.random() * width,
            y: Math.random() * height,
            type: randomType,
            timeRemaining: timeLimit,
          });
        }

        return next;
      });
    }, 100);

    return () => clearInterval(bubbleInterval);
  }, [timeLeft]);

  // 체력 바닥 시 즉시 종료 (실패)
  useEffect(() => {
    if (hp <= 0 || spilledCount >= 3) {
      finish(false);
    }
  }, [hp, spilledCount, finish]);

  // 시간 만료 시 성공 판정
  useEffect(() => {
    if (timeLeft === 0) {
      finish(hp > 30 && spilledCount < 3 && resolvedCount >= CAFETERIA_TARGET);
    }
  }, [timeLeft, hp, spilledCount, resolvedCount, finish]);

  // 버블 해결 액션
  const handleResolve = (id: number, type: Bubble['type']) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
    setResolvedCount((r) => r + 1);
    if (type === 'spinach') {
      setHp((h) => Math.min(100, h + 5)); // 편식 타일러서 체력 소폭 보너스
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-2xl relative select-none">
      {/* 헤더 및 스탯 상태 바 */}
      <div className="flex justify-between items-center bg-slate-900/80 px-5 py-3 rounded-2xl border border-slate-800 backdrop-blur-md mb-6">
        <div>
          <h2 className="text-xl font-black text-rose-400 flex items-center gap-2">
            🍛 1주차 미니게임: 급식실 통제 전쟁!
          </h2>
          <p className="text-xs text-slate-400">날아다니는 돌발 상황을 마우스로 클릭해서 제지하세요!</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 font-mono text-lg font-bold">
            <Timer className="w-5 h-5 text-amber-400 animate-pulse" />
            <span className={timeLeft <= 5 ? "text-rose-500 text-xl animate-ping" : "text-slate-100"}>
              {timeLeft}s
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* 인내 체력 */}
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>인내 체력</span>
            <span className="font-mono text-emerald-400 font-bold">{hp}/100</span>
          </div>
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
            <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${hp}%` }} />
          </div>
        </div>

        {/* 엎지른 식판 */}
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex flex-col justify-center">
          <div className="text-xs text-slate-400 mb-1">엎지른 식판 (3개 누적 시 실패)</div>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  spilledCount >= i ? 'bg-rose-500 text-white animate-bounce' : 'bg-slate-800 text-slate-500'
                }`}
              >
                🍱
              </div>
            ))}
          </div>
        </div>

        {/* 해결한 수 */}
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex flex-col justify-center">
          <div className="text-xs text-slate-400">통제 성공한 횟수</div>
          <div className="font-mono text-2xl font-black text-amber-400 mt-1">{resolvedCount} / {CAFETERIA_TARGET}회 이상 필요</div>
        </div>
      </div>

      {/* 게임 화면 캔버스 영역 */}
      <div
        ref={containerRef}
        className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800 relative overflow-hidden bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]"
      >
        {bubbles.length === 0 && timeLeft > 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm animate-pulse">
            잠시 평화롭습니다... 긴장을 늦추지 마세요!
          </div>
        )}

        {bubbles.map((b) => {
          let colorClass = 'bg-rose-500 shadow-rose-500/50 border-rose-300';
          let label = '🏃‍♂️ 뛰어다님!';
          let actionLabel = '제지!';

          if (b.type === 'spinach') {
            colorClass = 'bg-amber-500 shadow-amber-500/50 border-amber-300';
            label = '🥦 시금치 투정';
            actionLabel = '달래기';
          } else if (b.type === 'drop') {
            colorClass = 'bg-sky-500 shadow-sky-500/50 border-sky-300';
            label = '🍱 식판 낙하!';
            actionLabel = '받기!';
          }

          // 남은 시간에 따른 투명도/점멸 위험도 표시
          const dangerScale = b.timeRemaining < 0.8 ? 'animate-pulse scale-110' : '';

          return (
            <button
              key={b.id}
              onClick={() => handleResolve(b.id, b.type)}
              className={`absolute flex flex-col items-center justify-center rounded-2xl border p-2 cursor-pointer transition-all active:scale-95 shadow-lg select-none ${colorClass} ${dangerScale}`}
              style={{
                left: `${b.x}px`,
                top: `${b.y}px`,
                width: '100px',
                height: '80px',
              }}
            >
              <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded font-black text-white mb-1">
                {(b.timeRemaining).toFixed(1)}s
              </span>
              <span className="text-xs font-bold whitespace-nowrap">{label}</span>
              <span className="text-[10px] font-black underline mt-1">{actionLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 2. 생기부 오탈자 & 금지어 사냥 (Proofreading Game)
// ==========================================
// 화면에 그려지는 것은 words 배열뿐이라 문장 전체를 담던 text 필드는 렌더에 쓰이지 않았고,
// 실제로 words와 내용이 어긋난 문항이 여럿 있었다(예: text에는 있는 어절이 words에는 없음).
// 어긋난 사본을 유지하는 대신 필드를 제거해 words를 단일 소스로 삼는다.
interface Question {
  words: { text: string; isError: boolean; correction: string; isClue: boolean }[]; // 단어 분할 배열
}

const ProofreadingGame: React.FC<{ onComplete: (success: boolean) => void }> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correctedCount, setCorrectedCount] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; isSuccess: boolean } | null>(null);

  // 문장 목록 데이터베이스
  const [questions, setQuestions] = useState<Question[]>([
    {
      words: [
        { text: "민우는", isError: false, correction: "", isClue: false },
        { text: "수업 태도가", isError: false, correction: "", isClue: false },
        { text: "매우", isError: false, correction: "", isClue: false },
        { text: "헤이해질", isError: true, correction: "해이해질", isClue: false },
        { text: "때가", isError: false, correction: "", isClue: false },
        { text: "있지만,", isError: false, correction: "", isClue: false },
        { text: "수학", isError: false, correction: "", isClue: false },
        { text: "문제", isError: false, correction: "", isClue: false },
        { text: "해결력은", isError: false, correction: "", isClue: false },
        { text: "우수함.", isError: false, correction: "", isClue: false },
      ],
    },
    {
      words: [
        { text: "수학", isError: false, correction: "", isClue: false },
        { text: "동아리", isError: false, correction: "", isClue: false },
        { text: "시간에", isError: false, correction: "", isClue: false },
        { text: "적극적으로", isError: false, correction: "", isClue: false },
        { text: "활동하였으며", isError: false, correction: "", isClue: false },
        { text: "올림피아드에", isError: true, correction: "[기재 금지어 - 대회명]", isClue: true },
        { text: "참가해", isError: false, correction: "", isClue: false },
        { text: "우수한", isError: false, correction: "", isClue: false },
        { text: "탐구력을", isError: false, correction: "", isClue: false },
        { text: "보임.", isError: false, correction: "", isClue: false },
      ],
    },
    {
      words: [
        { text: "성격이", isError: false, correction: "", isClue: false },
        { text: "대범헤서", isError: true, correction: "대범해서", isClue: false },
        { text: "친구들과의", isError: false, correction: "", isClue: false },
        { text: "교우", isError: false, correction: "", isClue: false },
        { text: "관계가", isError: false, correction: "", isClue: false },
        { text: "원만하고", isError: false, correction: "", isClue: false },
        { text: "주도적으로", isError: false, correction: "", isClue: false },
        { text: "반장을", isError: false, correction: "", isClue: false },
        { text: "맡음.", isError: false, correction: "", isClue: false },
      ],
    },
    {
      words: [
        { text: "어머니가", isError: true, correction: "[기재 금지어 - 부모 지위]", isClue: true },
        { text: "외교관이시라", isError: true, correction: "[기재 금지어 - 부모 직업]", isClue: true },
        { text: "외국어", isError: false, correction: "", isClue: false },
        { text: "능력이", isError: false, correction: "", isClue: false },
        { text: "탁월하며", isError: false, correction: "", isClue: false },
        { text: "다문화", isError: false, correction: "", isClue: false },
        { text: "문학", isError: false, correction: "", isClue: false },
        { text: "독서에", isError: false, correction: "", isClue: false },
        { text: "열중함.", isError: false, correction: "", isClue: false },
      ],
    },
    {
      words: [
        { text: "교외", isError: true, correction: "[기재 금지어 - 외부 활동]", isClue: true },
        { text: "백일장에서", isError: true, correction: "[기재 금지어 - 외부 대회]", isClue: true },
        { text: "장려상을", isError: true, correction: "[기재 금지어 - 수상 실적]", isClue: true },
        { text: "수상하여", isError: false, correction: "", isClue: false },
        { text: "남다른", isError: false, correction: "", isClue: false },
        { text: "시적", isError: false, correction: "", isClue: false },
        { text: "재능을", isError: false, correction: "", isClue: false },
        { text: "보임.", isError: false, correction: "", isClue: false },
      ],
    },
    {
      words: [
        { text: "도서관", isError: false, correction: "", isClue: false },
        { text: "행사에", isError: false, correction: "", isClue: false },
        { text: "성실히", isError: false, correction: "", isClue: false },
        { text: "임하며", isError: false, correction: "", isClue: false },
        { text: "도서", isError: false, correction: "", isClue: false },
        { text: "분류", isError: false, correction: "", isClue: false },
        { text: "정리를", isError: false, correction: "", isClue: false },
        { text: "꼼꼼이", isError: true, correction: "꼼꼼히", isClue: false },
        { text: "도와", isError: false, correction: "", isClue: false },
        { text: "칭찬을", isError: false, correction: "", isClue: false },
        { text: "받음.", isError: false, correction: "", isClue: false },
      ],
    },
    {
      words: [
        { text: "사설", isError: true, correction: "[기재 금지어 - 사교육]", isClue: true },
        { text: "정보", isError: false, correction: "", isClue: false },
        { text: "학원에서", isError: true, correction: "[기재 금지어 - 학원 기재]", isClue: true },
        { text: "코딩", isError: false, correction: "", isClue: false },
        { text: "강좌를", isError: false, correction: "", isClue: false },
        { text: "수강하고", isError: false, correction: "", isClue: false },
        { text: "파이썬", isError: false, correction: "", isClue: false },
        { text: "프로그래밍을", isError: false, correction: "", isClue: false },
        { text: "탐구함.", isError: false, correction: "", isClue: false },
      ],
    }
  ]);

  // 타이머 실행
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 게임 종료 판정
  useEffect(() => {
    if (timeLeft === 0) {
      const isSuccess = correctedCount >= 5;
      if (isSuccess) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      }
      onComplete(isSuccess);
    }
  }, [timeLeft, correctedCount, onComplete]);

  // 단어 클릭 처리
  const handleWordClick = (wordIdx: number) => {
    const word = questions[currentIdx].words[wordIdx];

    if (word.isError) {
      // 정답 클릭 시
      setFeedback({ msg: `정정 성공! ➔ ${word.correction}`, isSuccess: true });
      setCorrectedCount((prev) => prev + 1);

      // 단어 즉시 교정.
      // [FIX] 예전에는 next[currentIdx].words[wordIdx] = ... 로 기존 배열/객체를 그대로 변형해
      // 상태를 직접 뒤집었다. 모든 층을 새로 만들어 불변성을 지킨다.
      setQuestions((prev) =>
        prev.map((q, qi) =>
          qi !== currentIdx
            ? q
            : {
                words: q.words.map((w, wi) =>
                  wi !== wordIdx ? w : { ...w, text: w.correction, isError: false }
                )
              }
        )
      );

      // 1초 뒤 피드백 제거
      setTimeout(() => setFeedback(null), 1000);

      // [FIX] 남은 오류를 questions(교정 전 스냅샷)로 세면 방금 고친 단어가 계속 오류로 잡혀
      // remainingErrors가 항상 true였고, 그래서 자동 넘김이 한 번도 동작하지 않았다.
      // 방금 고친 인덱스를 빼고 센다.
      const remainingErrors = questions[currentIdx].words.some((w, wi) => wi !== wordIdx && w.isError);
      if (!remainingErrors) {
        // 문장 내 모든 오류를 찾았으면 잠시 뒤 다음 문장으로 자동 이동
        setTimeout(() => {
          setCurrentIdx((prev) => (prev + 1) % questions.length);
        }, 1200);
      }
    } else {
      // 정상 단어 오클릭 시 시간 패널티
      setFeedback({ msg: "올바른 표현입니다! (시간 -2초 감점)", isSuccess: false });
      setTimeLeft((prev) => Math.max(0, prev - 2));
      setTimeout(() => setFeedback(null), 1200);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-2xl relative select-none">
      {/* 헤더 */}
      <div className="flex justify-between items-center bg-slate-900/80 px-5 py-3 rounded-2xl border border-slate-800 backdrop-blur-md mb-6">
        <div>
          <h2 className="text-xl font-black text-amber-400 flex items-center gap-2">
            ✍️ 2주차 미니게임: 생활기록부 오탈자 & 금지어 사냥
          </h2>
          <p className="text-xs text-slate-400">문장 중 틀린 맞춤법이나 규정상 기재 금지어를 골라내어 클릭하세요!</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 font-mono text-lg font-bold">
            <Timer className="w-5 h-5 text-amber-400 animate-pulse" />
            <span className={timeLeft <= 5 ? "text-rose-500 text-xl animate-ping" : "text-slate-100"}>
              {timeLeft}s
            </span>
          </div>
        </div>
      </div>

      {/* 스탯 표시판 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
          <div>
            <div className="text-xs text-slate-400">교정해 낸 단어</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{correctedCount} / 5개 이상 필요</div>
          </div>
          <Award className="w-10 h-10 text-emerald-400/80" />
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
          <div>
            <div className="text-xs text-slate-400">진행 중인 생기부 서류</div>
            <div className="text-2xl font-black text-slate-200 mt-1">{currentIdx + 1} / {questions.length}</div>
          </div>
          <FileText className="w-10 h-10 text-slate-400/80" />
        </div>
      </div>

      {/* 생기부 카드 및 텍스트 클릭 영역 */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between shadow-inner relative">
        <div className="absolute top-4 left-4 bg-red-950/80 border border-red-700/50 text-[10px] text-red-300 font-bold px-2.5 py-1 rounded">
          ⚠️ 중요: 부모 신상, 교외 수상, 사설 사교육 기관 절대 기재 불가!
        </div>

        {/* 피드백 말풍선 */}
        {feedback && (
          <div
            className={`absolute top-4 right-4 text-xs font-black px-3.5 py-2 rounded-xl shadow-lg border animate-bounce ${
              feedback.isSuccess
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                : 'bg-rose-950 text-rose-300 border-rose-500'
            }`}
          >
            {feedback.msg}
          </div>
        )}

        <div className="my-auto text-center">
          <div className="inline-block border-2 border-slate-800 bg-slate-950/80 rounded-2xl p-6 shadow-2xl max-w-2xl">
            <div className="flex flex-wrap justify-center gap-x-2 gap-y-4">
              {questions[currentIdx].words.map((w, idx) => (
                <button
                  key={idx}
                  onClick={() => handleWordClick(idx)}
                  className={`text-lg px-2.5 py-1.5 rounded-lg font-bold transition-all hover:bg-slate-800 hover:scale-105 active:scale-95 cursor-pointer ${
                    w.text.startsWith('[기재') ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 line-through' : 'text-slate-100'
                  }`}
                >
                  {w.text}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 패널 */}
        <div className="flex justify-between items-center text-xs text-slate-500 pt-4 border-t border-slate-800">
          <span>잘못 클릭하면 남은 시간이 차감됩니다. 신중하게 선택하세요!</span>
          <button
            onClick={() => setCurrentIdx((prev) => (prev + 1) % questions.length)}
            className="flex items-center gap-1 hover:text-slate-300 transition-colors"
          >
            다음 서사로 넘기기 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. 교실 난투극 중재 (Conflict Resolution)
// ==========================================
// 두 아이를 동시에 이 선 아래로 끌어내리면 그 순간 중재 성공.
const CONFLICT_CALM_LINE = 20;

const ConflictGame: React.FC<{ onComplete: (success: boolean) => void }> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [minwooExcitement, setMinwooExcitement] = useState(65);
  const [jungwooExcitement, setJungwooExcitement] = useState(65);
  const [mitigationTimer, setMitigationTimer] = useState(0); // 차분한 환기 활성 시간

  const finishedRef = useRef(false);
  const finish = useCallback(
    (success: boolean) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      if (success) confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      onComplete(success);
    },
    [onComplete]
  );

  // 쿨다운 관리 상태
  const [cooldowns, setCooldowns] = useState({
    stop: 0,
    minwoo: 0,
    jungwoo: 0,
    calm: 0,
  });

  // 메인 게임 타이머 및 쿨다운 디크리먼트 (1초 단위)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });

      // 쿨다운 차감
      setCooldowns((prev) => ({
        stop: Math.max(0, prev.stop - 1),
        minwoo: Math.max(0, prev.minwoo - 1),
        jungwoo: Math.max(0, prev.jungwoo - 1),
        calm: Math.max(0, prev.calm - 1),
      }));

      // 환기 효과 지속시간 감소
      setMitigationTimer((m) => Math.max(0, m - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 학생들의 실시간 흥분도 자가 상승 (0.5초 단위)
  useEffect(() => {
    if (timeLeft <= 0) return;

    const excitementInterval = setInterval(() => {
      // 차분한 환기 켜져 있으면 상승률 50% 반감
      const divisor = mitigationTimer > 0 ? 2 : 1;
      
      // [FIX] 예전에는 두 아이가 각각 0.5초마다 2~5씩(초당 4~10) 올랐다. 스킬 최대 처리량이
      // 그에 한참 못 미쳐 "둘 다 20 이하"는 사실상 도달 불가능했고, 판정도 정확히 시간이 0이 된
      // 순간에만 이뤄져 중간에 진정시켜도 인정되지 않았다. 상승폭을 1~3으로 낮춰 실제로 밀어낼
      // 수 있는 싸움으로 만든다.
      setMinwooExcitement((prev) => {
        const delta = Math.floor(Math.random() * 3) + 1; // 1~3 상승
        return Math.min(100, prev + Math.max(1, Math.round(delta / divisor)));
      });
      setJungwooExcitement((prev) => {
        const delta = Math.floor(Math.random() * 3) + 1; // 1~3 상승
        return Math.min(100, prev + Math.max(1, Math.round(delta / divisor)));
      });
    }, 500);

    return () => clearInterval(excitementInterval);
  }, [timeLeft, mitigationTimer]);

  // 임계치 터져서 주먹다짐 발생 시 즉시 패배
  useEffect(() => {
    if (minwooExcitement >= 100 || jungwooExcitement >= 100) {
      finish(false);
    }
  }, [minwooExcitement, jungwooExcitement, finish]);

  // 둘 다 진정선 아래로 내려간 순간 즉시 성공 (시간이 0이 될 때까지 기다리지 않는다)
  useEffect(() => {
    if (minwooExcitement <= CONFLICT_CALM_LINE && jungwooExcitement <= CONFLICT_CALM_LINE) {
      finish(true);
    }
  }, [minwooExcitement, jungwooExcitement, finish]);

  // 시간 만료 시에도 진정선 도달 여부로 판정
  useEffect(() => {
    if (timeLeft === 0) {
      finish(minwooExcitement <= CONFLICT_CALM_LINE && jungwooExcitement <= CONFLICT_CALM_LINE);
    }
  }, [timeLeft, minwooExcitement, jungwooExcitement, finish]);

  // 스킬 발동 함수
  const triggerSkill = (skillType: 'stop' | 'minwoo' | 'jungwoo' | 'calm') => {
    if (cooldowns[skillType] > 0) return;

    if (skillType === 'stop') {
      setMinwooExcitement((m) => Math.max(0, m - 20));
      setJungwooExcitement((j) => Math.max(0, j - 20));
      setCooldowns((c) => ({ ...c, stop: 4 }));
    } else if (skillType === 'minwoo') {
      setMinwooExcitement((m) => Math.max(0, m - 35));
      setJungwooExcitement((j) => Math.min(100, j + 8)); // 편들면 다른 애가 소외감에 자극받음
      setCooldowns((c) => ({ ...c, minwoo: 4 }));
    } else if (skillType === 'jungwoo') {
      setJungwooExcitement((j) => Math.max(0, j - 35));
      setMinwooExcitement((m) => Math.min(100, m + 8));
      setCooldowns((c) => ({ ...c, jungwoo: 4 }));
    } else if (skillType === 'calm') {
      setMitigationTimer(5); // 5초 동안 환기
      setCooldowns((c) => ({ ...c, calm: 6 }));
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-2xl relative select-none">
      {/* 헤더 */}
      <div className="flex justify-between items-center bg-slate-900/80 px-5 py-3 rounded-2xl border border-slate-800 backdrop-blur-md mb-6">
        <div>
          <h2 className="text-xl font-black text-rose-400 flex items-center gap-2">
            💥 3주차 미니게임: 돌발 상황! 교실 난투극 중재
          </h2>
          <p className="text-xs text-slate-400">두 아이의 흥분도를 모두 {CONFLICT_CALM_LINE} 이하로 낮추면 그 즉시 중재 성공입니다! 한 명이라도 100에 도달하면 난투극이 벌어집니다.</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 font-mono text-lg font-bold">
            <Timer className="w-5 h-5 text-amber-400 animate-pulse" />
            <span className={timeLeft <= 5 ? "text-rose-500 text-xl animate-ping" : "text-slate-100"}>
              {timeLeft}s
            </span>
          </div>
        </div>
      </div>

      {/* 게임 대전 화면 (민우 VS 정우) */}
      <div className="flex-1 grid grid-cols-2 gap-8 items-center px-6">
        {/* 민우 😡 */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 flex flex-col items-center shadow-lg relative">
          <span className="text-5xl mb-2 animate-bounce">😡</span>
          <span className="text-lg font-black text-rose-400">김민우 (주먹을 꽉 쥠)</span>
          <div className="w-full bg-slate-950 h-6 rounded-full overflow-hidden border border-slate-800 mt-4 relative">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                minwooExcitement >= 80 ? 'bg-red-600 animate-pulse' : minwooExcitement >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${minwooExcitement}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center font-mono font-black text-xs text-white">
              흥분도 {minwooExcitement}%
            </span>
          </div>
          {minwooExcitement >= 80 && (
            <div className="absolute -top-3 right-4 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce">
              ⚠️ 싸움 직전!
            </div>
          )}
        </div>

        {/* 정우 🤬 */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 flex flex-col items-center shadow-lg relative">
          <span className="text-5xl mb-2 animate-bounce">🤬</span>
          <span className="text-lg font-black text-rose-400">이정우 (눈물이 맺혀 소리침)</span>
          <div className="w-full bg-slate-950 h-6 rounded-full overflow-hidden border border-slate-800 mt-4 relative">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                jungwooExcitement >= 80 ? 'bg-red-600 animate-pulse' : jungwooExcitement >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${jungwooExcitement}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center font-mono font-black text-xs text-white">
              흥분도 {jungwooExcitement}%
            </span>
          </div>
          {jungwooExcitement >= 80 && (
            <div className="absolute -top-3 right-4 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce">
              ⚠️ 주먹다짐 전조!
            </div>
          )}
        </div>
      </div>

      {/* 중재 상태 알림 */}
      {mitigationTimer > 0 && (
        <div className="my-3 bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-bold text-center py-2.5 rounded-xl animate-pulse">
          🍃 환기 효과 활성화: 아이들의 흥분 지수 증가량이 절반으로 억제되고 있습니다. ({mitigationTimer}초 남음)
        </div>
      )}

      {/* 중재 스킬 액션 바 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <button
          onClick={() => triggerSkill('stop')}
          disabled={cooldowns.stop > 0}
          className="bg-red-600 hover:bg-red-500 active:scale-95 disabled:bg-slate-800 disabled:text-slate-500 font-bold py-3 px-4 rounded-xl shadow-lg transition-all text-xs flex flex-col items-center gap-1 cursor-pointer"
        >
          <ShieldAlert className="w-5 h-5" />
          <span>단호한 제지: "싸움 멈춰!"</span>
          {cooldowns.stop > 0 && <span className="text-[10px] text-red-300 font-mono">쿨다운 {cooldowns.stop}초</span>}
        </button>

        <button
          onClick={() => triggerSkill('minwoo')}
          disabled={cooldowns.minwoo > 0}
          className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:bg-slate-800 disabled:text-slate-500 font-bold py-3 px-4 rounded-xl shadow-lg transition-all text-xs flex flex-col items-center gap-1 cursor-pointer"
        >
          <User className="w-5 h-5" />
          <span>민우 공감: "속상했지"</span>
          {cooldowns.minwoo > 0 && <span className="text-[10px] text-indigo-300 font-mono">쿨다운 {cooldowns.minwoo}초</span>}
        </button>

        <button
          onClick={() => triggerSkill('jungwoo')}
          disabled={cooldowns.jungwoo > 0}
          className="bg-purple-600 hover:bg-purple-500 active:scale-95 disabled:bg-slate-800 disabled:text-slate-500 font-bold py-3 px-4 rounded-xl shadow-lg transition-all text-xs flex flex-col items-center gap-1 cursor-pointer"
        >
          <User className="w-5 h-5" />
          <span>정우 공감: "이야기해볼래"</span>
          {cooldowns.jungwoo > 0 && <span className="text-[10px] text-purple-300 font-mono">쿨다운 {cooldowns.jungwoo}초</span>}
        </button>

        <button
          onClick={() => triggerSkill('calm')}
          disabled={cooldowns.calm > 0}
          className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:bg-slate-800 disabled:text-slate-500 font-bold py-3 px-4 rounded-xl shadow-lg transition-all text-xs flex flex-col items-center gap-1 cursor-pointer"
        >
          <Shield className="w-5 h-5" />
          <span>차분한 환기: "진정해라"</span>
          {cooldowns.calm > 0 && <span className="text-[10px] text-emerald-300 font-mono">쿨다운 {cooldowns.calm}초</span>}
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 4. 방과 후 공문 기안 / 결재선 패스 (Administrative Drafting)
// ==========================================
interface DraftItem {
  id: number;
  title: string;
  feedback: string;
  options: { key: string; text: string; isCorrect: boolean }[];
}

const DRAFT_TIME_LIMIT = 8;  // 기안서 한 개당 제한시간(초). 지문이 길어 6초는 읽기에도 빠듯했다.
const DRAFT_PASS_LINE = 8;   // 10건 중 통과해야 하는 최소 건수

const AdministrativeDraftGame: React.FC<{ onComplete: (success: boolean) => void }> = ({ onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const correctRef = useRef(0); // 지연 실행되는 최종 판정이 읽을, 항상 최신인 점수
  const [timeLeft, setTimeLeft] = useState(DRAFT_TIME_LIMIT);
  const [feedback, setFeedback] = useState<{ msg: string; isCorrect: boolean } | null>(null);

  const drafts = useRef<DraftItem[]>([
    {
      id: 1,
      title: '학급 학예회 비품 구매 품의서',
      feedback: '교감: "예산 세부 내역이 구체적이지 않습니다. 문구류 몇 개 살지 기입하세요."',
      options: [
        { key: 'A', text: '추후 구매 후 영수증만 따로 첨부하겠다고 기재한다.', isCorrect: false },
        { key: 'B', text: '수량을 \'1식\'에서 \'가위 5개, 풀 5개\' 등 상세 품목과 수량, 단가로 수정 기재한다.', isCorrect: true },
        { key: 'C', text: '예비비를 많이 잡아 예산을 대폭 늘려 상신한다.', isCorrect: false },
      ],
    },
    {
      id: 2,
      title: '현장체험학습 안전 지도 계획서',
      feedback: '교감: "체험 학습 대피 경로와 인근 비상 종합병원 정보가 누락되었습니다."',
      options: [
        { key: 'A', text: '장소 인근 종합병원 연락처와 비상 대피 지도를 수정 보완하여 추가 첨부한다.', isCorrect: true },
        { key: 'B', text: '학생 개인 알림장에 개인용 비상 상비약을 필수 지참하라고 공지한다.', isCorrect: false },
        { key: 'C', text: '기안문에 "위급 상황 시 즉시 119 신고 조치" 한 줄만 보강한다.', isCorrect: false },
      ],
    },
    {
      id: 3,
      title: '학교폭력 예방 외부 강사비 지급 기안',
      feedback: '교장: "지급 대상 강사의 이력과 강사 자격을 증빙할 만한 서류가 보이지 않습니다."',
      options: [
        { key: 'A', text: '강사의 소속 기관명을 줄글로 길게 적어 보완한다.', isCorrect: false },
        { key: 'B', text: '해당 강사의 이력서 및 관련 자격증 사본을 기안문에 첨부 파일로 추가한다.', isCorrect: true },
        { key: 'C', text: '강사비 수령용 통장 사본만 우선 기안문에 첨부한다.', isCorrect: false },
      ],
    },
    {
      id: 4,
      title: '교실 노후 청소기 구매 품의',
      feedback: '교감: "단일 업체 비교 견적서만 있네요. 타사 제품과의 금액 대조가 필요합니다."',
      options: [
        { key: 'A', text: '동일 규격 제품의 타사 견적서 1부를 추가 확보하여 비교 표 로 첨부한다.', isCorrect: true },
        { key: 'B', text: '인터넷 최저가 판매 사이트 링크 하나만 캡처하여 서류를 마무리한다.', isCorrect: false },
        { key: 'C', text: '직접 오프라인 대리점에 다녀와 사서 결제하겠다고 기재한다.', isCorrect: false },
      ],
    },
    {
      id: 5,
      title: '다문화 가정 학생 특별 멘토링 운영 계획',
      feedback: '교장: "학생들의 부모 국적이나 세부 주소 등 개인 정보 유출 우려가 있습니다."',
      options: [
        { key: 'A', text: '기안문 내 학생 개인 정보 노출 부위를 식별 코드(예: 학생 A, B)로 비식별화 처리한다.', isCorrect: true },
        { key: 'B', text: '결재 서류에 암호를 걸어 교내 메신저 전체 공지방에 송출한다.', isCorrect: false },
        { key: 'C', text: '학부모들에게 개인정보 제3자 공개 동의서 싸인을 받아 첨부한다.', isCorrect: false },
      ],
    },
    {
      id: 6,
      title: '디지털 선도학교 교사 해외 연수 참가 기안',
      feedback: '교감: "출장 기간 중 담당 학급 수업 대강이나 교과 보결 대책이 불충분합니다."',
      options: [
        { key: 'A', text: '아이들에게 자습 동영상을 보게 조치하겠다고 한 줄만 적는다.', isCorrect: false },
        { key: 'B', text: '동학년 선생님들의 보결 담당 배정표 및 보강 수업 계획 문서를 반영한다.', isCorrect: true },
        { key: 'C', text: '다녀와서 일괄 보충 수업을 개설하겠다고 임의로 대답한다.', isCorrect: false },
      ],
    },
    {
      id: 7,
      title: '학급 자치 예산 활용 학생 간식 구매 품의',
      feedback: '교감: "품목 중 컵라면 등 고칼로리 식품이 너무 많습니다. 영양 가이드에 맞지 않습니다."',
      options: [
        { key: 'A', text: '과일 컵, 저당 주스, 건강 견과류 등 친환경 웰빙 간식류로 품목을 전면 수정한다.', isCorrect: true },
        { key: 'B', text: '영양 교사 결재선을 제외하고 바로 교장/교감 라인으로 상신한다.', isCorrect: false },
        { key: 'C', text: '학생 선호도 조사에서 컵라면이 압도적이었다며 설문을 추가한다.', isCorrect: false },
      ],
    },
    {
      id: 8,
      title: '도서실용 웹툰 만화책 50권 구입 품의',
      feedback: '교장: "공인된 기관이나 학부모 위원회 심의를 통과한 교육적 도서인지 애매합니다."',
      options: [
        { key: 'A', text: '최신 인기 베스트셀러 도서 위주로 재구성하겠다고 우긴다.', isCorrect: false },
        { key: 'B', text: '학교도서관운영위원회 심의 결과 추천 도서 목록 및 심의 목적을 첨부한다.', isCorrect: true },
        { key: 'C', text: '만화책 코너 구석에 보이지 않게 비치하겠다고 추가한다.', isCorrect: false },
      ],
    },
    {
      id: 9,
      title: '교내 과학 실험 교실 학생 학습 책자 인쇄 품의',
      feedback: '교감: "인쇄 부수 산출 근거가 안 맞네요. 참여 학생은 15명인데 왜 100부입니까?"',
      options: [
        { key: 'A', text: '남는 인쇄 책자는 내년에 재사용하겠다고 항변한다.', isCorrect: false },
        { key: 'B', text: '신청 학생 15명 및 교사용 대외 보관용 부수를 포함해 최종 18부로 부수를 수정해 제출한다.', isCorrect: true },
        { key: 'C', text: '그냥 행정용 여유분으로 남겨 두겠다고 답을 남긴다.', isCorrect: false },
      ],
    },
    {
      id: 10,
      title: '교사 독서 연구회 연간 연구비 정산 보고',
      feedback: '교감: "사용 내역 중 개인 사적인 음료 결제 영수증이 포함되어 지출 반려합니다."',
      options: [
        { key: 'A', text: '누락된 정식 독서 토론 회의록과 공동 지출 연구회 영수증만 선별해 내역을 갱신 정산한다.', isCorrect: true },
        { key: 'B', text: '공부하며 마신 커피도 도서 연구의 일환이라고 항의성 소명 글을 적는다.', isCorrect: false },
        { key: 'C', text: '이전 다른 연구회의 영수증 날짜를 포토샵으로 위조해 섞어 낸다.', isCorrect: false },
      ],
    }
  ]);

  // [FIX] 예전에는 setTimeLeft 업데이터 함수 안에서 setFeedback/setTimeout을 호출했다.
  // 업데이터는 순수해야 하고 StrictMode에서는 두 번 실행되므로, 시간 초과 한 번에 다음 문제로
  // 두 번 넘어가는 일이 생겼다. 이제 업데이터는 숫자만 계산하고, 시간 초과 처리는 별도 이펙트가 맡는다.
  useEffect(() => {
    if (feedback) return; // 피드백 보일 땐 정지

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIdx, feedback]);

  // 시간 초과 -> 반려 처리 및 다음 문제로 전이
  useEffect(() => {
    if (timeLeft > 0 || feedback) return;
    setFeedback({ msg: '시간 초과! 반려되었습니다. ❌', isCorrect: false });
    const t = setTimeout(moveToNext, 1500);
    return () => clearTimeout(t);
    // moveToNext는 매 렌더 새로 만들어지지만 항상 최신 상태를 읽으므로 의존성에서 제외한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, feedback]);

  const moveToNext = () => {
    setFeedback(null);
    setTimeLeft(DRAFT_TIME_LIMIT);

    const next = currentIdx + 1;
    if (next >= drafts.current.length) {
      // 마지막 문제 완료. [FIX] 예전에는 1.5초 뒤 실행되는 이 시점에 클로저가 잡아둔 낡은
      // correctCount로 합격 여부를 계산해, 마지막 문제의 정답이 점수에 반영되지 않았다.
      // 점수는 ref에 즉시 반영해두고 최종 판정은 그 ref를 읽는다.
      const isSuccess = correctRef.current >= DRAFT_PASS_LINE;
      if (isSuccess) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      }
      onComplete(isSuccess);
    } else {
      setCurrentIdx(next);
    }
  };

  const handleSelect = (isCorrect: boolean) => {
    if (feedback) return;

    if (isCorrect) {
      correctRef.current += 1;
      setCorrectCount(correctRef.current);
      setFeedback({ msg: '결재선 최종 통과! 기안 승인 완료 ⭕', isCorrect: true });
    } else {
      setFeedback({ msg: '피드백 미반영 반려! 결재선 차단 ❌', isCorrect: false });
    }

    setTimeout(moveToNext, 1500);
  };

  const currentDraft = drafts.current[currentIdx];

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-2xl relative select-none">
      {/* 헤더 */}
      <div className="flex justify-between items-center bg-slate-900/80 px-5 py-3 rounded-2xl border border-slate-800 backdrop-blur-md mb-6">
        <div>
          <h2 className="text-xl font-black text-emerald-400 flex items-center gap-2">
            💻 4주차 미니게임: 행정 기안 & 결재선 패스 타이쿤
          </h2>
          <p className="text-xs text-slate-400">결재권자(교감/교장)의 가차 없는 반려 피드백에 알맞은 기안서 조치안을 고르세요!</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 font-mono text-lg font-bold">
            <Timer className="w-5 h-5 text-amber-400 animate-pulse" />
            <span className={timeLeft <= 2 ? "text-rose-500 text-xl animate-ping" : "text-slate-100"}>
              {timeLeft}s
            </span>
          </div>
        </div>
      </div>

      {/* 스탯 표시 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
          <div>
            <span className="text-slate-400">결재 통과된 기안문 수</span>
            <div className="text-lg font-black text-emerald-400 mt-0.5">{correctCount} / {DRAFT_PASS_LINE}개 이상 필요</div>
          </div>
          <Check className="w-6 h-6 text-emerald-400" />
        </div>
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
          <div>
            <span className="text-slate-400">진행 중인 기안 건수</span>
            <div className="text-lg font-black text-slate-300 mt-0.5">{currentIdx + 1} / {drafts.current.length}</div>
          </div>
          <FileText className="w-6 h-6 text-slate-400" />
        </div>
      </div>

      {/* 문서 뷰어 영역 */}
      <div className="flex-1 bg-white text-slate-900 rounded-2xl p-6 border-4 border-slate-300 flex flex-col justify-between shadow-2xl relative">
        {/* 공문서 서식 */}
        <div className="border border-slate-300 p-4 rounded bg-slate-50 flex-1 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b pb-1 flex justify-between">
              <span>기안 문서 수신처: 교육지원청</span>
              <span className="text-rose-500">결재 라인 대기 중</span>
            </div>
            <h3 className="text-lg font-black mt-2 text-slate-800">📝 [기안서] {currentDraft.title}</h3>
            
            {/* 결재권자 피드백 */}
            <div className="mt-4 bg-rose-50 border-l-4 border-rose-500 p-3 text-xs text-rose-800 rounded font-semibold italic animate-pulse">
              {currentDraft.feedback}
            </div>
          </div>

          {/* 피드백 전광판 */}
          {feedback && (
            <div
              className={`absolute inset-0 flex items-center justify-center bg-black/80 text-white font-black text-lg rounded-2xl animate-fade-in z-20`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{feedback.isCorrect ? '⭕ 승인 완료' : '❌ 반려됨!'}</div>
                <div className="text-sm font-light text-slate-300">{feedback.msg}</div>
              </div>
            </div>
          )}

          <div className="text-[11px] text-slate-400 mt-3 text-right">기안자: 담임 교사</div>
        </div>

        {/* 3지선다 선택 버튼 */}
        <div className="grid grid-cols-1 gap-2.5 mt-5">
          {currentDraft.options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => handleSelect(opt.isCorrect)}
              className="bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-semibold text-left py-3 px-4 rounded-xl text-xs flex gap-3 items-center transition-all cursor-pointer shadow border border-slate-800"
            >
              <span className="w-6 h-6 rounded-full bg-amber-500 text-black flex items-center justify-center font-mono font-extrabold text-[10px]">
                {opt.key}
              </span>
              <span className="flex-1">{opt.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 메인 미니게임 허브 오버레이 컴포넌트
// ==========================================
interface MiniGamesProps {
  onResolve: (success: boolean) => void;
}

export const MiniGames: React.FC<MiniGamesProps> = ({ onResolve }) => {
  const activeMiniGame = useGameStore((state) => state.activeMiniGame);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [success, setSuccess] = useState<boolean | null>(null);

  // 미니게임이 바뀌면(주차가 넘어가면) 인트로부터 다시 시작한다.
  useEffect(() => {
    setGameState('intro');
    setSuccess(null);
  }, [activeMiniGame]);

  const handleGameEnd = useCallback((isSuccess: boolean) => {
    setSuccess(isSuccess);
    setGameState('result');
  }, []);

  if (!activeMiniGame) return null;

  // [FIX] 제목·설명·보상 안내를 여기서 다시 적지 않고 miniGameDefs.ts의 정의를 그대로 읽는다.
  // 예전에는 결과 화면이 보상 수치를 손으로 복사해 두어, 스토어가 실제로 적용하는 값과
  // 어긋나 있었다(대표적으로 '학급운영 +15'는 파생 스탯이라 실제로는 적용되지 않았다).
  const def = WEEKLY_MINI_GAMES[activeMiniGame];
  const shownEffects = success ? def.successEffects : def.failEffects;

  const handleComplete = () => {
    if (success !== null) {
      onResolve(success);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:p-8 backdrop-blur-lg">
      <div className="w-full max-w-4xl h-[650px] flex flex-col">
        {gameState === 'intro' && (
          <div className="flex-1 flex flex-col justify-center items-center text-center p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden">
            {/* 네온 배경 효과 */}
            <div className={`absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br ${def.gradient} opacity-20 rounded-full blur-3xl`} />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-500 to-purple-500 opacity-20 rounded-full blur-3xl" />

            <div className="z-10 max-w-lg">
              <span className="text-7xl mb-6 block animate-bounce">{def.icon}</span>
              <h1 className="text-3xl font-black text-white tracking-tight mb-2">
                {def.title}
              </h1>
              <div className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black px-3.5 py-1 rounded-full mb-6">
                🚨 주간 마감 미니게임 발동!
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-8">
                {def.desc}
              </p>
              <button
                onClick={() => setGameState('playing')}
                className={`w-full bg-gradient-to-r ${def.gradient} hover:brightness-110 text-white font-black text-sm py-4 px-8 rounded-2xl shadow-xl transition-all cursor-pointer flex justify-center items-center gap-2`}
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>미니게임 시작하기</span>
              </button>
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="flex-1">
            {activeMiniGame === 'cafeteria' && <CafeteriaGame onComplete={handleGameEnd} />}
            {activeMiniGame === 'proofreading' && <ProofreadingGame onComplete={handleGameEnd} />}
            {activeMiniGame === 'conflict' && <ConflictGame onComplete={handleGameEnd} />}
            {activeMiniGame === 'stamp' && <AdministrativeDraftGame onComplete={handleGameEnd} />}
          </div>
        )}

        {gameState === 'result' && (
          <div className="flex-1 flex flex-col justify-center items-center text-center p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="z-10 max-w-lg">
              <span className="text-7xl mb-6 block">
                {success ? '🎉' : '😰'}
              </span>
              <h1 className="text-4xl font-black text-white tracking-tight mb-4">
                미니게임 {success ? '성공!' : '실패...'}
              </h1>
              <p className="text-slate-300 text-sm leading-relaxed mb-8">
                {success ? def.successText : def.failText}
              </p>

              {/* 스탯 영향 정보 요약 (스토어가 실제로 적용하는 효과 그대로) */}
              <div className="bg-black/40 border border-slate-800 p-4 rounded-xl mb-8 text-left text-xs text-slate-400 space-y-1">
                <div className="font-bold text-slate-300 mb-2">📋 스탯 보정 결과:</div>
                <div className={`font-semibold ${success ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatEffects(shownEffects)}
                </div>
              </div>

              <button
                onClick={handleComplete}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-950 font-black text-sm py-4 px-8 rounded-2xl shadow-xl transition-all cursor-pointer"
              >
                결과 반영하고 하루 정산하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
