import React from 'react';
import { Award, Lock, ArrowLeft, RefreshCw } from 'lucide-react';

interface EndingGalleryProps {
  onBackToTitle: () => void;
}

export const EndingGallery: React.FC<EndingGalleryProps> = ({ onBackToTitle }) => {
  // 로컬스토리지에 저장된 해금 엔딩 리스트 로드
  const unlockedStr = localStorage.getItem('teacher-maker-unlocked-endings') || '[]';
  let unlockedList: string[] = [];
  try {
    unlockedList = JSON.parse(unlockedStr);
  } catch (e) {
    unlockedList = [];
  }

  // 8종 엔딩 목록 정보 정의
  const galleryEndings = [
    {
      id: 'ending_supervisor',
      title: '장학사 · 교육전문직',
      desc: '교직 경험을 기반으로 공교육 전체의 질을 끌어올리는 정책 입안 전문가의 길',
      condition: '커리어 포인트 40p 이상, 행정 실무 70 이상, 교육 소신 60 이상 달성',
      icon: '📚'
    },
    {
      id: 'ending_administrator',
      title: '학교 관리자 (교감·교장)',
      desc: '조직 구성원의 갈등을 해소하고 학교 공동체를 이끄는 중추 경영인의 길',
      condition: '교장/교감 신뢰 75 이상, 평판 70 이상, 동료 관계 60 이상 달성',
      icon: '💼'
    },
    {
      id: 'ending_expert',
      title: '원로교사 · 수업 전문가',
      desc: '수많은 아이들의 삶의 등불이 되며 교실에서 묵묵히 정년을 맞는 진정한 스승',
      condition: '학생 신뢰 80 이상, 수업 전문성 75 이상, 교육 소신 70 이상 달성',
      icon: '👩‍🏫'
    },
    {
      id: 'ending_innovator',
      title: '혁신 · 에듀테크 선도교사',
      desc: '에듀테크 프로젝트를 선도하며 교단에 새로운 수업 모델을 개척한 혁신 리더',
      condition: '이벤트에서 혁신 성향 획득, 수업 전문성 70 이상, 평판 60 이상 달성',
      icon: '💻'
    },
    {
      id: 'ending_sustainable',
      title: '지속 가능한 훌륭한 교사',
      desc: '일에 매몰되지 않고 자신과 가정을 현명하게 지켜낸 모범적 롱런 교사',
      condition: '가정 만족도 80 이상, 학생 신뢰 50 이상 유지하며 30일 완주',
      icon: '🏡'
    },
    {
      id: 'ending_burnout',
      title: '모든 짐을 떠안은 번아웃 병가',
      desc: '일과 헌신에 몸과 마음을 갈아 넣은 끝에 입원 휴직계를 낸 슬픈 쉼표',
      condition: '번아웃 수치 90 이상 도달 또는 체력 15 이하로 추락',
      icon: '🏥'
    },
    {
      id: 'ending_family_rupture',
      title: '교실은 지켰으나 멀어진 가정',
      desc: '학교 평판은 최고를 찍었으나 늦은 밤 야근으로 가정이 얼어붙은 씁쓸한 결과',
      condition: '가정 만족도 수치 30 이하로 추락',
      icon: '💔'
    },
    {
      id: 'ending_general',
      title: '묵묵히 자리를 지킨 평교사',
      desc: '눈부신 영예는 없을지라도 안전사고 없이 무사히 30일 교탁을 지켜낸 굳건함',
      condition: '기타 일반적인 상태로 30일차 최종 종례 완수',
      icon: '🚶‍♂️'
    }
  ];

  // 도감 초기화 헬퍼
  const handleClearGallery = () => {
    if (confirm('해금 도감을 모두 초기화하시겠습니까? 클리어 기록이 전부 사라집니다.')) {
      localStorage.removeItem('teacher-maker-unlocked-endings');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-[#FAF8F5] flex flex-col items-center justify-center font-sans">
      <div className="max-w-4xl w-full space-y-6">
        
        {/* 도감 상단바 */}
        <div className="paper-card bg-white p-6 border-4 border-slate-900 shadow-school-deep flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-school font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-7 h-7 text-amber-500 animate-float" />
              티처 메이커 해금 엔딩 도감
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-semibold">
              수집률: {unlockedList.length} / {galleryEndings.length} ({Math.round((unlockedList.length / galleryEndings.length) * 100)}%)
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleClearGallery}
              className="btn-school-secondary flex items-center gap-1 text-red-600 border-red-600 hover:bg-red-50 text-xs py-1.5 px-3"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              도감 초기화
            </button>
            <button
              onClick={onBackToTitle}
              className="btn-school-primary flex items-center gap-1 text-xs py-1.5 px-3"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              타이틀로
            </button>
          </div>
        </div>

        {/* 도감 그리드 리스트 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {galleryEndings.map(ending => {
            const isUnlocked = unlockedList.includes(ending.id);
            return (
              <div 
                key={ending.id}
                className={`paper-card bg-white border-2 border-black p-5 rounded-xl transition-all duration-200 ${
                  isUnlocked 
                    ? 'hover:-translate-y-1 shadow-school-flat hover:shadow-school-deep bg-amber-50/20' 
                    : 'bg-slate-100/50 opacity-80'
                }`}
              >
                {isUnlocked ? (
                  /* 해금된 상태 */
                  <div className="flex items-start gap-4">
                    <span className="text-4xl bg-white border-2 border-black rounded-lg w-12 h-12 flex items-center justify-center shadow-school-press flex-shrink-0">
                      {ending.icon}
                    </span>
                    <div className="space-y-1 flex-1">
                      <h4 className="font-bold text-slate-900 text-base">{ending.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-light">{ending.desc}</p>
                      <div className="pt-2 text-[10px] text-emerald-600 font-bold">
                        ✓ 해금 완료
                      </div>
                    </div>
                  </div>
                ) : (
                  /* 잠겨있는 상태 */
                  <div className="flex items-start gap-4 select-none">
                    <span className="text-4xl bg-slate-200 border-2 border-dashed border-slate-400 rounded-lg w-12 h-12 flex items-center justify-center flex-shrink-0 text-slate-400">
                      <Lock className="w-5 h-5 text-slate-400" />
                    </span>
                    <div className="space-y-1 flex-1">
                      <h4 className="font-bold text-slate-400 text-base">??? (기밀 서류)</h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-light italic">
                        "수많은 선택의 소용돌이 속에서 어떤 인연이 이 경로를 해금해 줄지 알 수 없습니다."
                      </p>
                      <div className="pt-2 text-[10px] text-indigo-500 font-semibold flex items-start gap-1">
                        <span className="text-slate-500">조건:</span>
                        <span>{ending.condition}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
