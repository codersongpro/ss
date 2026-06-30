import React from 'react';
import { Award, ArrowLeft, RefreshCw } from 'lucide-react';
import { endingImages, uiImages, type EndingImageId } from '@/assets/gameImageAssets';

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

  // 20종 엔딩 목록 정보 정의
  const galleryEndings = [
    {
      id: 'ending_gameover_hp',
      title: '🚑 체력 전방위 방전',
      desc: '지옥의 행무와 지도를 버티지 못하고 누적 피로로 부축받으며 구급차에 실려간 요양 엔딩',
      condition: '게임 진행 도중 체력(hp) 0 이하 도달',
      icon: '🚑'
    },
    {
      id: 'ending_gameover_mental',
      title: '🚨 정서적 탈진 및 사직',
      desc: '악성 민원과 학생 통제 불능 속에 공황 장애 판정을 받고 눈물을 흘리며 신청한 조기 명예퇴직',
      condition: '게임 진행 도중 멘탈(mental) 0 이하 도달',
      icon: '🚨'
    },
    {
      id: 'ending_gameover_burnout',
      title: '🔥 번아웃 105% 임계점 돌파',
      desc: '행정실의 깐깐한 반려와 결재 재촉 속에 사명감이 소멸해 교무실 책상에 던져버린 사직서',
      condition: '게임 진행 도중 번아웃(burnout) 100 이상 도달',
      icon: '🔥'
    },
    {
      id: 'ending_gameover_complaint',
      title: '💣 민원 대폭발 직위해제',
      desc: '학부모 악성 민원이 폭발하여 교육청 직권 감사와 함께 직위해제 통보서가 내려오는 비극',
      condition: '게임 진행 도중 학부모 민원 수치(parentComplaint) 100 이상 도달',
      icon: '💣'
    },
    {
      id: 'ending_true_mentor',
      title: '🕯️ 참된 스승 (히든)',
      desc: '한 학기 동안 아이들이 건넨 손편지·다이어리·스케치북 등 서사 단서를 두루 모으고 신뢰까지 쌓아야 열리는 숨겨진 엔딩',
      condition: '서사 단서 아이템 5종 중 4종 이상 수집 + 학생 신뢰도 70 이상',
      icon: '🕯️'
    },
    {
      id: 'ending_legendary_mentor',
      title: '🌟 전설의 참된 은사',
      desc: '학생의 아픔을 공감하며 헌신해 온 결과 졸업식 날 감동의 롤링페이퍼와 눈물의 파티를 선사받는 참스승',
      condition: '학생 신뢰도 90 이상, 교육적 보람 80 이상 달성',
      icon: '🌟'
    },
    {
      id: 'ending_labor_union_leader',
      title: '✊ 교사 권익 수호 노조의장',
      desc: '학교의 부조리한 지시와 교육계 관행에 당당히 맞서 동료들의 전폭적 신임으로 교사 노조의 수장이 되는 길',
      condition: '교육 소신 85 이상, 동료 연대감 75 이상 달성',
      icon: '✊'
    },
    {
      id: 'ending_supervisor',
      title: '📚 장학사 · 교육전문직',
      desc: '현장 지도를 넘어 교육청에 임용되어 더 넓은 교육 정책을 입안하고 제도를 혁신하는 교육전문직의 길',
      condition: '커리어 포인트 40 이상, 행정 역량 70 이상, 교육 소신 60 이상 달성',
      icon: '📚'
    },
    {
      id: 'ending_administrator',
      title: '💼 학교 관리자 (교장·교감)',
      desc: '관리자와 교사 간 갈등을 조율하고 학교 공동체를 후방 지원하여 책임감 있는 학교 경영자로 성장하는 길',
      condition: '관리자 신뢰 75 이상, 평판 70 이상, 동료 관계 60 이상 달성',
      icon: '💼'
    },
    {
      id: 'ending_best_selling_author',
      title: '📖 베스트셀러 교육 서적 작가',
      desc: '교실 속 감동적 이야기와 독창적 수업 지도법을 엮은 에세이가 히트해 스타 강사이자 인기 저술가가 되는 길',
      condition: '수업 전문성 80 이상, 교육적 보람 70 이상, 평판 70 이상 달성',
      icon: '📖'
    },
    {
      id: 'ending_expert',
      title: '👩‍🏫 원로교사 · 수업 전문가',
      desc: '학생들의 두터운 신뢰와 교실 지도를 끝까지 고수하며 정년 퇴임까지 아이들의 등불로 남는 스승',
      condition: '학생 신뢰 80 이상, 수업 전문성 75 이상, 교육 소신 70 이상 달성',
      icon: '👩‍🏫'
    },
    {
      id: 'ending_innovator',
      title: '💻 에듀테크 선도 혁신교사',
      desc: '스마트 교실 도입 및 인공지능 프로젝트 수업을 개척하여 학교 현장의 낡은 수업 방식을 혁신하는 선도교사',
      condition: '혁신 성향 보유, 수업 전문성 70 이상, 평판 60 이상 달성',
      icon: '💻'
    },
    {
      id: 'ending_office_master',
      title: '🖨️ 행정의 신 (막후의 학교 실세)',
      desc: '까다로운 세무 기안과 보고서를 완벽 무결하게 처리해 행정실장마저 고개를 숙이게 하는 행정전문가',
      condition: '행정 역량 90 이상, 동료 연대감 80 이상 달성',
      icon: '🖨️'
    },
    {
      id: 'ending_peacekeeper',
      title: '🕊️ 학교 평화 갈등 조정가',
      desc: '학폭 소송전과 극심한 학부모 갈등을 감정 중재로 깔끔히 조정해 분쟁 조정 위원으로 위촉되는 해결사',
      condition: '학부모 신뢰 80 이상, 학생 신뢰 80 이상, 동료 연대감 70 이상 달성',
      icon: '🕊️'
    },
    {
      id: 'ending_family_first',
      title: '🏡 워라밸 완벽 조율 수호자',
      desc: '동료 신망 속에 칼퇴를 지키고 매일 저녁 가족 밥상을 지키며 행복을 다진 이상적인 균형 수호 교사',
      condition: '가정 만족도 90 이상, 동료 연대감 60 이상, 체력 70 이상 달성',
      icon: '🏡'
    },
    {
      id: 'ending_coop_star',
      title: '💖 동료애 넘치는 인싸교사',
      desc: '학교의 모든 직종 구성원을 헌신적으로 도와 아플 때 음료와 선물이 가득 배달되는 교무실 사랑방 주인의 길',
      condition: '동료 연대감 90 이상, 동료 관계 80 이상 달성',
      icon: '💖'
    },
    {
      id: 'ending_great_escapist',
      title: '🚀 교육 벤처 스타트업 창업가',
      desc: '공교육의 물리적 한계를 벗어나고자 사직서를 던지고 유니콘 교육 기업을 세워 벤처 투자를 받는 경영자',
      condition: '수업 전문성 70 이상, 번아웃 70 이상, 교육 소신 75 이상 달성',
      icon: '🚀'
    },
    {
      id: 'ending_burnout',
      title: '🏥 영웅적 헌신 후의 병가 및 휴직',
      desc: '혼자 모든 서류와 지도를 떠안은 끝에 면역력이 붕괴되어 학기 도중 휴직계를 내는 아픈 쉼표',
      condition: '30일 완주 성공 시점에서 번아웃 90 이상 또는 체력 15 이하',
      icon: '🏥'
    },
    {
      id: 'ending_family_rupture',
      title: '💔 교실은 지켰으나 멀어진 가정',
      desc: '밤늦은 지도와 출장으로 동료들의 찬사는 한몸에 받았으나 집에는 얼어붙은 한숨만 남은 쓸쓸한 엔딩',
      condition: '30일 완주 성공 시점에서 가정 만족도 30 이하',
      icon: '💔'
    },
    {
      id: 'ending_hobbyist',
      title: '🎨 교문 밖의 취미 만랩 예술가',
      desc: '학교 직무는 최소한으로 무난히 마치고 퇴근 후 밴드나 창작 활동에 혼을 실어 제2의 자아를 꽃피운 예술가',
      condition: '가정 만족 80 이상, 멘탈 75 이상, 수업 전문성 60 미만 상태로 완주',
      icon: '🎨'
    },
    {
      id: 'ending_sustainable',
      title: '🌱 지속 가능한 롱런 평교사',
      desc: '최고의 영웅 대신 영리하게 일과 삶을 나누며 평생 교탁을 지킬 수 있는 지혜로운 웰빙 교사',
      condition: '가정 만족 80 이상, 학생 신뢰 50 이상 유지하며 30일 완주',
      icon: '🌱'
    },
    {
      id: 'ending_class_master',
      title: '🥇 학급 경영의 달인',
      desc: '질서와 온기가 가득한 이상적인 학급 공동체를 설계하고, 동료 교사들의 학급 경영 멘토가 되는 교사',
      condition: '30일차에 학급운영 85 이상 달성',
      icon: '🥇'
    },
    {
      id: 'ending_teaching_scholar',
      title: '💡 수업 연구의 대가',
      desc: '수업 연구에 헌신하여 교과 장학 우수 사례로 등극하고 공교육 최고의 참지성 수업 전문가로 성장하는 길',
      condition: '30일차에 수업연구능력 85 이상 달성',
      icon: '💡'
    },
    {
      id: 'ending_family_peacekeeper',
      title: '🚲 가정 평화 수호자',
      desc: '업무나 승진 욕심을 내려놓고 정시 퇴근과 주말 가족 생활을 완벽히 지켜내어 가정의 넘치는 행복을 누리는 스승',
      condition: '30일차에 가족관계 85 이상, 업무능력 60 미만 달성',
      icon: '🚲'
    },
    {
      id: 'ending_innovation_director',
      title: '🎯 학교 혁신 장학관',
      desc: '최정상급의 행정 실무 능력과 전문적 교육학적 혜안을 융합하여 국가 교육 혁신을 선도하는 스타 장학관의 탄생',
      condition: '30일차에 업무능력 80 이상, 수업연구능력 80 이상 달성',
      icon: '🎯'
    },
    {
      id: 'ending_myway',
      title: '🦅 독고다이 마이웨이 교사',
      desc: '교무실 친목이나 권력의 눈치를 거부하고 오로지 강인한 신념과 굳건한 훈육 원칙으로 교실을 통솔하는 고고한 학의 길',
      condition: '30일차에 교육소신 80 이상, 인간관계 40 미만 달성',
      icon: '🦅'
    },
    {
      id: 'ending_general',
      title: '🚶‍♂️ 묵묵히 자리를 지킨 평교사',
      desc: '화려한 영예나 표창은 없어도 큰 사고 없이 매일 교탁을 소독하고 교실 조종례를 지켜낸 든든한 기둥',
      condition: '상기 특정 조건에 해당하지 않고 무사히 30일 종례를 마칠 시 해금',
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
            const endingImage = endingImages[ending.id as EndingImageId];
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
                    <img
                      src={endingImage}
                      alt={`${ending.title} 일러스트`}
                      className="w-20 h-20 object-cover bg-white border-2 border-black rounded-lg shadow-school-press flex-shrink-0"
                    />
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
                    <span className="relative bg-slate-200 border-2 border-dashed border-slate-400 rounded-lg w-20 h-20 flex items-center justify-center flex-shrink-0 text-slate-400 overflow-hidden">
                      <img
                        src={endingImage}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover grayscale opacity-25"
                      />
                      <img
                        src={uiImages.lockEnding}
                        alt=""
                        className="relative z-10 w-8 h-8 object-contain opacity-80"
                      />
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
