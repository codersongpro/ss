import React, { useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { Mail, Heart, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EndingScreenProps {
  onRestart: () => void;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({ onRestart }) => {
  const { endingId, stats, students } = useGameStore();

  // 엔딩 진입 시 폭죽 효과 및 해금 영속 저장
  useEffect(() => {
    if (endingId) {
      const unlockedStr = localStorage.getItem('teacher-maker-unlocked-endings') || '[]';
      try {
        const unlocked = JSON.parse(unlockedStr);
        if (Array.isArray(unlocked) && !unlocked.includes(endingId)) {
          unlocked.push(endingId);
          localStorage.setItem('teacher-maker-unlocked-endings', JSON.stringify(unlocked));
        }
      } catch (e) {
        localStorage.setItem('teacher-maker-unlocked-endings', JSON.stringify([endingId]));
      }
    }

    // 번아웃이나 가정 파탄 같은 배드 엔딩이 아닐 때만 폭죽 연출
    if (endingId && !['ending_burnout', 'ending_family_rupture'].includes(endingId)) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // 왼쪽과 오른쪽에서 발사
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [endingId]);

  // 엔딩 콘텐츠 매퍼
  const getEndingDetails = (id: string | null) => {
    switch (id) {
      case 'ending_supervisor':
        return {
          title: '장학사 · 교육전문직',
          subtitle: '교실의 생생한 경험을 교육 정책으로',
          desc: '당신은 교실 안의 지도를 넘어 학교 전반의 행정과 교육 기획의 가치를 입증했습니다. 교육청에 임용되어 현장의 아픔을 보듬는 실천적 제도를 입안하는 교육전문직 장학사의 길을 걷기 시작합니다.',
          badgeColor: 'bg-indigo-600 text-white',
          illustration: '📚📝🏫'
        };
      case 'ending_administrator':
        return {
          title: '학교 관리자 (교감 · 교장 패스)',
          subtitle: '학교 공동체를 뒤에서 움직이는 조율자',
          desc: '당신은 관리자와 동료 교사들의 압도적 신뢰를 바탕으로 위기를 현명하게 조율했습니다. 조직을 이해하고 행정을 지혜롭게 경영하여 미래 학교를 이끌어가는 책임감 있는 관리자로 성장해 나갑니다.',
          badgeColor: 'bg-amber-600 text-white',
          illustration: '💼👔🏫'
        };
      case 'ending_expert':
        return {
          title: '원로교사 · 수업 교육 전문가',
          subtitle: '아이들의 삶의 궤적을 바꾼 진정한 스승',
          desc: '당신은 교실을 지켰습니다. 학생들의 깊은 신뢰와 탁월한 수업 전문성을 바탕으로 동료들이 기댈 수 있는 큰 그늘이 되었으며, 정년 퇴임까지 아이들의 눈빛 속에 등불로 남을 것입니다.',
          badgeColor: 'bg-emerald-600 text-white',
          illustration: '👩‍🏫👨‍🏫❤️'
        };
      case 'ending_innovator':
        return {
          title: '혁신 · 에듀테크 선도교사',
          subtitle: '오래된 공교육 시스템에 혁신의 바람을',
          desc: '당신은 인공지능 수행평가, 최신 에듀테크와 진보적 프로젝트 수업을 통해 학교의 해묵은 교육 관행을 바꿨습니다. 전국 단위 연구회 강사로 활약하며 수업 혁신 트렌드를 주도합니다.',
          badgeColor: 'bg-cyan-600 text-white',
          illustration: '💻🚀✨'
        };
      case 'ending_burnout':
        return {
          title: '영웅적 헌신 후의 병가 / 번아웃',
          subtitle: '모든 짐을 혼자 떠안았던 영웅의 슬픈 쉼표',
          desc: '모든 요구를 다 수용하려 애썼고, 홀로 밤을 지새우며 교직을 지탱하려 했습니다. 그러나 남겨진 것은 가득 헐어버린 구내염과 마비된 멘탈이었습니다. 결국 한 학기 병가를 내고 긴 요양을 떠납니다.',
          badgeColor: 'bg-rose-600 text-white',
          illustration: '🏥💊🩹'
        };
      case 'ending_family_rupture':
        return {
          title: '교실은 지켰으나 멀어진 가정',
          subtitle: '타인의 아이들은 챙겼으나 내 가족은 잃었다',
          desc: '학교 평판과 학생들의 찬사는 얻었을지 모릅니다. 그러나 늦은 밤 긴 전화와 주말 출장으로 당신의 식탁에는 정적과 차가운 한숨만이 굳었습니다. 배우자 및 가족들과의 감정적 거리는 걷잡을 수 없이 어긋났습니다.',
          badgeColor: 'bg-slate-700 text-white',
          illustration: '💔🚪❄️'
        };
      case 'ending_sustainable':
        return {
          title: '오래 가는 지속 가능한 교사',
          subtitle: '교실과 나 자신의 삶을 동시에 지켜낸 승리자',
          desc: '당신은 최고의 영웅이 되기 위해 수명을 갈아 넣지 않았습니다. 영리하게 거절하고, 동료와 나누었으며, 정시에 퇴근해 사랑하는 이들과 따뜻한 밥을 먹었습니다. 이 건강함이 당신을 평생 교단에서 지켜줄 것입니다.',
          badgeColor: 'bg-teal-600 text-white',
          illustration: '🏡☕🌱'
        };
      default:
        return {
          title: '평범하지만 묵묵한 평교사',
          subtitle: '오늘도 조용히 자리를 지키는 학교의 허리',
          desc: '큰 명예나 승진 점수는 챙기지 못했을지라도, 매일 조회와 종례를 돌보며 교실을 무사히 청소하고 지켜왔습니다. 수많은 선택 속에서 조용히 생존한 당신이야말로 학교의 진짜 기둥입니다.',
          badgeColor: 'bg-slate-600 text-white',
          illustration: '🚶‍♂️📖🏫'
        };
    }
  };

  const details = getEndingDetails(endingId);

  // 학생들의 익명 편지 생성
  const generateLetters = () => {
    return students.map(stud => {
      let letterContent = '';
      let isPositive = stud.teacherTrust >= 60;

      if (stud.id === 'student_minjun') {
        letterContent = isPositive 
          ? '선생님, 시험 치기 전에 너무 떨릴 때 보건실 보내주셔서 감사했어요. 점수보다 제 건강이 더 소중하다고 해주신 말씀 평생 기억할게요.'
          : '선생님, 제가 시험 점수 때문에 너무 괴로울 때도 규정을 칼같이 대하시며 굳은 표정으로 계셔서 사실 좀 서운하고 무서웠어요...';
      } else if (stud.id === 'student_seoyeon') {
        letterContent = isPositive
          ? '선생님, 제가 맨날 구구단 늦게 외우고 수학 다 틀려도 한 번도 화 안내시고 지켜봐 주셔서 수학 공부할 용기가 생겼어요! 감사해요.'
          : '선생님, 제가 느려서 그런지 방과후 프로그램만 등록해 두시고 저랑 깊게 대화는 안 하시는 것 같아서 조금 쓸쓸했어요...';
      } else if (stud.id === 'student_jihun') {
        letterContent = isPositive
          ? '쌤, 저 맨날 사고만 치는 꼴통이었는데 다른 반 녀석이랑 싸웠을 때 제 억울한 말 끝까지 들어주시고 편들어주셔서 진짜 감동이었어요. 저 이제 싸움 안 할게요.'
          : '쌤, 저도 잘못하긴 했지만 맨날 무슨 일만 생기면 제 필적부터 의심하고 혼부터 내셔서 솔직히 학교 오기가 매일 짜증 났었습니다.';
      } else if (stud.id === 'student_haeun') {
        letterContent = isPositive
          ? '선생님, 친구들이 저 단톡방에서 빼고 괴롭히는 거 알아차려 주시고 안전하게 위센터 연결해 주셔서 감사해요. 다시 학교 나올 힘을 얻었어요.'
          : '선생님, 제가 너무 외로워서 일기장에 힌트 많이 적어뒀는데 조용히 지나치시는 걸 보고 아무도 제 편은 없다고 느꼈었어요...';
      } else if (stud.id === 'student_yejun') {
        letterContent = isPositive
          ? '선생님, 수업 중에 그린 낙서 뺏지 않으시고 제 예술적 재능을 응원해 주셔서 감사해요. 수학 공부도 이제 틈틈이 해볼게요!'
          : '선생님, 부모님이 시키는 의대 뺑뺑이 학원 숙제 안 했다고 교실 뒤에 서있게 하셔서 너무 싫었어요. 제 낙서장 뺏긴 것도 슬펐어요.';
      } else {
        // 수아
        letterContent = isPositive
          ? '선생님! 매일 5교시 끝나고 조퇴계 낼 때 눈치 안 주시고 파이팅하라고 악수해 주셔서 전국 대회 잘 치를 수 있었어요. 담임 쌤이 최고예요!'
          : '선생님, 제가 운동 훈련 가야 하는데 조퇴계 서류 보완해오라고 결재 계속 미뤄두셔서 눈치가 보이고 훈련 늦어서 힘들었어요...';
      }

      return {
        name: isPositive ? `${stud.name}` : '익명의 학생',
        content: letterContent,
        isPositive
      };
    });
  };

  const letters = generateLetters();

  return (
    <div className="min-h-screen py-12 px-4 bg-[#FAF8F5] flex flex-col items-center justify-center font-sans">
      <div className="max-w-4xl w-full space-y-8 animate-fade-in">
        
        {/* 1. 최종 엔딩 카드 */}
        <div className="paper-card bg-white p-8 border-4 border-slate-900 shadow-school-deep text-center space-y-6">
          <div className="text-6xl">{details.illustration}</div>
          
          <div className="space-y-2">
            <span className={`inline-block px-4 py-1.5 rounded-full border-2 border-black text-sm font-bold shadow-school-press ${details.badgeColor}`}>
              최종 임무 달성 엔딩
            </span>
            <h2 className="text-3xl md:text-4xl font-school font-bold text-slate-900 chalk-text">
              {details.title}
            </h2>
            <p className="text-base text-slate-500 font-semibold font-school">{details.subtitle}</p>
          </div>

          <p className="text-sm md:text-base leading-relaxed text-slate-600 max-w-xl mx-auto font-light border-y border-slate-200 py-6">
            {details.desc}
          </p>

          {/* 최종 스탯 요약 레포트 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border-2 border-black rounded-xl p-4 text-xs font-mono text-left">
            <div>
              <span className="text-slate-400 block mb-0.5">최종 체력/멘탈</span>
              <span className="text-slate-900 font-bold">{stats.hp} / {stats.mental}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">번아웃 지표</span>
              <span className="text-slate-900 font-bold">{stats.burnout} %</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">교실 내 학생신뢰</span>
              <span className="text-slate-900 font-bold">{stats.studentTrust} / 100</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">가정 내 만족도</span>
              <span className="text-slate-900 font-bold">{stats.familySatisfaction} / 100</span>
            </div>
          </div>
        </div>

        {/* 2. 아이들의 롤링페이퍼 편지함 */}
        <div className="paper-card bg-white p-6 border-4 border-slate-900 shadow-school-deep">
          <h3 className="text-xl font-school font-bold text-slate-900 border-b-2 border-slate-900 pb-3 mb-6 flex items-center gap-2">
            <Mail className="w-6 h-6 text-emerald-600 animate-float" />
            30일의 마지막 종례, 책상 위에 남겨진 편지꾸러미
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {letters.map((letObj, idx) => (
              <div 
                key={idx} 
                className={`postit-card flex flex-col justify-between ${
                  letObj.isPositive 
                    ? 'bg-school-postit-yellow border-emerald-900 text-slate-800' 
                    : 'bg-school-postit-pink border-rose-950 text-slate-800'
                }`}
                style={{ transform: `rotate(${(idx % 3) * 1.5 - 1.5}deg)` }}
              >
                <p className="text-xs md:text-sm leading-relaxed mb-4 italic font-medium">
                  "{letObj.content}"
                </p>
                <div className="flex items-center justify-between border-t border-black/10 pt-2 text-[10px] font-bold">
                  <span className="text-slate-400">학급 종례 발신</span>
                  <span className="flex items-center gap-0.5 text-slate-800">
                    <Heart className={`w-3.5 h-3.5 ${letObj.isPositive ? 'text-red-500 fill-red-500' : 'text-slate-400'}`} />
                    From. {letObj.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 재도전 및 갤러리 */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onRestart}
            className="btn-school-primary py-3 px-8 text-lg flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            다시 새 학기 준비하기 (처음으로)
          </button>
        </div>

      </div>
    </div>
  );
};
