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

    // 배드엔딩이나 게임오버가 아닐 때만 축하 폭죽 연출 [NEW]
    if (
      endingId && 
      ![
        'ending_burnout', 
        'ending_family_rupture', 
        'ending_gameover_hp', 
        'ending_gameover_mental', 
        'ending_gameover_burnout', 
        'ending_gameover_complaint'
      ].includes(endingId)
    ) {
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
      case 'ending_gameover_hp':
        return {
          title: '🚑 체력 전방위 방전 (응급 요양)',
          subtitle: '지옥의 행무와 지도를 견디지 못하고 실려간 교사',
          desc: '체력 지표가 기어코 0에 달했습니다. 교실 앞 지도를 열거나 복도를 걸어가려다 주저앉아 동료들의 부축으로 구급차에 실려갔습니다. 진단명은 과도한 누적 피로와 면역계 파탄. 장기 병가 승인이 떨어지며 교단의 서사는 비정하게 차단됩니다. (세이브 파일 파괴)',
          badgeColor: 'bg-rose-700 text-white',
          illustration: '🚑🏥🛌'
        };
      case 'ending_gameover_mental':
        return {
          title: '🚨 정서적 탈진 및 사직 (멘탈 파산)',
          subtitle: '독한 민원과 학급 갈등을 이겨내지 못한 마음',
          desc: '멘탈 지표가 0에 수렴했습니다. 악성 민원의 시달림과 교실 안의 잦은 붕괴 사고 속에서 당신은 공황 장애 판정을 받았습니다. 학생들의 눈빛조차 무서워져 출근 종소리를 들으며 울음을 터뜨렸고, 결국 조용한 명예퇴직을 신청해 가방을 쌉니다. (세이브 파일 파괴)',
          badgeColor: 'bg-indigo-950 text-white',
          illustration: '😭🚪❄'
        };
      case 'ending_gameover_burnout':
        return {
          title: '🔥 번아웃 105% 임계점 돌파 (사직서 제출)',
          subtitle: '이따위 서류 작업과 예산을 위해 임용을 겪었나',
          desc: '번아웃 수치가 100% 한계를 뚫었습니다. 행정실의 깐깐한 품의 반려와 관리자의 기획안 독촉, 가방을 팽개치는 무기력한 제자들을 지켜보며 교사로서의 모든 애정과 사명감이 잿더미로 변했습니다. 주인공은 교무실 책상에 사직서를 내려놓고 교문을 나섭니다. (세이브 파일 파괴)',
          badgeColor: 'bg-orange-850 text-white',
          illustration: '🔥📝🔥'
        };
      case 'ending_gameover_complaint':
        return {
          title: '💣 민원 대폭발로 인한 직위해제',
          subtitle: '악성 민원의 무게를 견디지 못한 담임 교사의 비극',
          desc: '학부모 민원 수치가 100% 임계점을 돌파했습니다. 연일 계속되는 교장실 소환, 교육청 감사 지시, 인터넷 커뮤니티의 왜곡된 실명 폭로와 함께 언론 보도가 나기 시작합니다. 결국 담임 교사 직위해제 명령서가 교무실 책상 위에 배달되고 주인공은 쓸쓸히 교문을 나섭니다. (세이브 파일 파괴)',
          badgeColor: 'bg-red-950 text-white',
          illustration: '💣📢📰'
        };
      case 'ending_true_mentor':
        return {
          title: '🕯️ 참된 스승 (히든 엔딩)',
          subtitle: '아이들이 남긴 작은 흔적들이 한 권의 이야기가 되던 날',
          desc: '지훈이의 삐뚤빼뚤한 손편지, 몰래 돌려 쓰던 학급 다이어리, 누군가의 비밀 스케치북, 익명의 쪽지… 한 학기 동안 아이들이 당신에게만 슬며시 건넨 흔적들이 책상 서랍 가득 쌓였습니다. 마지막 날, 아이들은 그 흔적들을 엮어 만든 단 한 권뿐인 학급 문집을 내밉니다. 화려한 성과도, 거창한 직함도 아니지만 당신은 아이 하나하나의 마음에 닿은 진짜 스승이었습니다. 이 이야기는 오래도록 그들 곁에 남을 것입니다.',
          badgeColor: 'bg-gradient-to-r from-amber-300 to-rose-300 text-slate-900',
          illustration: '🕯️📖💛'
        };
      case 'ending_legendary_mentor':
        return {
          title: '🌟 전설의 참된 은사 (레전더리 멘토)',
          subtitle: '아이들의 삶에 평생 마르지 않을 샘물을 남기다',
          desc: '당신은 언제나 아이들의 편이었고, 학업 고민과 왕따 극복을 위해 혼신의 힘을 쏟았습니다. 30일이 지난 마지막 종례 날, 반 학생들이 직접 쓴 수십 장의 비밀 롤링페이퍼와 눈물의 깜짝 송별 파티를 선물합니다. 당신은 아이들의 가슴에 전설적인 은사로 기억될 것입니다.',
          badgeColor: 'bg-amber-400 text-slate-900',
          illustration: '🌟🎁😭'
        };
      case 'ending_labor_union_leader':
        return {
          title: '✊ 교사 권익 수호의 투사 (교사노조 의장)',
          subtitle: '부조리한 공교육 시스템에 당당히 맞선 동료들의 목소리',
          desc: '그 누구보다 확고한 교육 소신과 동료 연대감으로 학교의 부당한 지시와 교육계의 모순에 정면 대항했습니다. 당신의 당당함을 알아본 동료 교사들의 압도적인 지지를 업고 교직원 조합의 위원장으로 선출되어 공교육 체질 개선을 위한 입법 투쟁에 돌입합니다.',
          badgeColor: 'bg-red-700 text-white',
          illustration: '✊🚩📢'
        };
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
      case 'ending_best_selling_author':
        return {
          title: '📖 베스트셀러 교육 서적 작가',
          subtitle: '교실에서의 기적을 한 권의 책으로 엮어내다',
          desc: '자신만의 독창적인 수업 지도법과 담임 교실의 따뜻한 학생 상담 이야기를 엮어 출판한 수필이 메가 히트를 쳤습니다. 교육 베스트셀러 1위 작가로 등극하며, 전국 교육 연수원의 대표 강사로 초빙되어 교단 밖에서도 선한 영향력을 넓힙니다.',
          badgeColor: 'bg-violet-600 text-white',
          illustration: '✍️📚🎉'
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
      case 'ending_office_master':
        return {
          title: '🖨️ 행정의 신 (교무/행정실의 참지배자)',
          subtitle: '어떤 난해한 결재와 공문도 무결점으로 돌파하다',
          desc: '결재선이 어긋나기 쉬운 시도 공문과 난해한 감사 지적 사안들을 기가 막힌 서류 처리 능력으로 무마하며 교무실에서 추앙받습니다. 교장실과 행정실 직원들 모두가 결재 지도를 위해 당신에게 자문을 구하러 찾아옵니다.',
          badgeColor: 'bg-slate-800 text-white',
          illustration: '💻📃👑'
        };
      case 'ending_peacekeeper':
        return {
          title: '🕊️ 학교 평화 갈등 조정 전문가',
          subtitle: '학폭 갈등과 민원 대폭발도 조용히 잠재우는 자',
          desc: '학부모 간의 날선 소송전 공방과 학생들의 해묵은 학교 폭력 사태들을 고도의 소통 및 공감 대화법으로 완벽히 화해시켰습니다. 분쟁 조정 위원회의 주축 전문 위원으로 임용되어 전국에 갈등의 소용돌이를 진정시킵니다.',
          badgeColor: 'bg-emerald-500 text-white',
          illustration: '🕊️🤝✨'
        };
      case 'ending_family_first':
        return {
          title: '🏡 워라밸 완벽 조율 수호자',
          subtitle: '학교에서는 훌륭한 담임, 가정에서는 최고의 가족',
          desc: '어떤 급박한 업무 독촉에도 흔들리지 않고 가정을 수호하는 칼퇴근 지침을 완벽히 지켰습니다. 매일 저녁 정시에 가족들과 밥을 먹으며 얻은 긍정 에너지로 교실 학생들에게도 세심한 지도를 선사하여 최고의 밸런스를 달성했습니다.',
          badgeColor: 'bg-sky-500 text-white',
          illustration: '🏡🍽️🚲'
        };
      case 'ending_coop_star':
        return {
          title: '💖 동료애 넘치는 교무실의 인싸교사',
          subtitle: '교사, 조리사, 실무직원 모두가 사랑하는 동료 교직원',
          desc: '보건실, 행정실, 과학실, 급식소 등 학교 내부 모든 구성원의 고충을 먼저 듣고 따뜻하게 공조했습니다. 주인공이 독감에 걸려 결근한 날에는 온 학교의 교직원이 보낸 비타민과 선물이 교무실 책상에 산더미처럼 쌓일 정도의 사랑을 누립니다.',
          badgeColor: 'bg-pink-500 text-white',
          illustration: '💖☕🎁'
        };
      case 'ending_great_escapist':
        return {
          title: '🚀 교육용 벤처 에듀테크 창업가',
          subtitle: '경직된 학교 문을 박차고 새로운 교육 생태계로',
          desc: '교단에서의 풍부한 실무 경험과 학교 현장의 고질적인 불편함을 해결하기 위해 사직서를 던지고 교육 정보격차를 해소할 에듀테크 스타트업을 창업합니다. 현장에 최적화된 앱으로 수십 억의 투자 유치에 성공하여 혁신 기업가로 거듭납니다.',
          badgeColor: 'bg-rose-500 text-white',
          illustration: '🚀💼💡'
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
      case 'ending_hobbyist':
        return {
          title: '🎨 교문 밖의 예술가 (취미 만랩 교사)',
          subtitle: '학교에서는 무난하게, 퇴근 후에는 나만의 찬란한 자아실현',
          desc: '수업 및 학교 업무는 적절하고 무난하게 완수하면서, 퇴근 후의 밴드 음악 활동이나 가죽 공예, 미술 창작에 혼을 실었습니다. 전국 직장인 동호회 전시회에서 수상하거나 음반을 발매하며 찬란한 투잡 라이프의 진수를 이룩합니다.',
          badgeColor: 'bg-amber-500 text-white',
          illustration: '🎨🎸🥂'
        };
      case 'ending_sustainable':
        return {
          title: '오래 가는 지속 가능한 교사',
          subtitle: '교실과 나 자신의 삶을 동시에 지켜낸 승리자',
          desc: '당신은 최고의 영웅이 되기 위해 수명을 갈아 넣지 않았습니다. 영리하게 거절하고, 동료와 나누었으며, 정시에 퇴근해 사랑하는 이들과 따뜻한 밥을 먹었습니다. 이 건강함이 당신을 평생 교단에서 지켜줄 것입니다.',
          badgeColor: 'bg-teal-600 text-white',
          illustration: '🏡☕🌱'
        };
      case 'ending_class_master':
        return {
          title: '🥇 학급 경영의 달인 (클래스 마스터)',
          subtitle: '빈틈없는 질서와 끈끈한 사랑으로 교실을 통일하다',
          desc: '당신은 탁월한 학급 운영 능력으로 교실을 질서와 온기가 가득한 이상적인 공동체로 만들었습니다. 규칙은 합리적이었고 소통은 투명했습니다. 학생들은 스스로 학급을 가꾸고 갈등은 대화로 풀었으며 학부모들은 무한한 지지를 보냅니다. 동료 교사들도 당신의 교실 자치 노하우를 배우러 매일 노크합니다.',
          badgeColor: 'bg-yellow-500 text-slate-900',
          illustration: '🥇🏫🤝'
        };
      case 'ending_teaching_scholar':
        return {
          title: '💡 수업 연구의 대가 (티칭 숄라)',
          subtitle: '지루한 지식을 흥미진진한 탐구로 바꾼 명강사',
          desc: '당신은 수업 준비와 연구에 대한 끝없는 열정으로 공교육 최고의 교육과정을 실천했습니다. 아이들은 학습 동기부여를 얻어 눈빛을 반짝였고, 교과 연구회와 동료 장학 등에서 당신의 수업안이 우수 사례로 등극했습니다. 수업을 통해 아이들의 삶을 변화시키는 참된 지성인으로서 동료들의 교과 멘토가 됩니다.',
          badgeColor: 'bg-emerald-600 text-white',
          illustration: '💡🎓📖'
        };
      case 'ending_family_peacekeeper':
        return {
          title: '🚲 가정 평화 수호자 (패밀리 피스키퍼)',
          subtitle: '업무의 무게를 내려놓고 내 가족의 품으로',
          desc: '당신은 무리한 행정 업무나 과도한 승진 경쟁을 과감히 거절하고 내 가정의 행복을 최우선으로 지켜냈습니다. 퇴근 시간에 울리는 메신저는 쿨하게 덮어두고, 주말에는 온전히 소중한 이들과 시간을 보냈습니다. 비록 교내 승진 평판은 평범할지언정, 당신의 식탁에는 늘 따뜻한 웃음과 사랑이 흘러 넘칩니다.',
          badgeColor: 'bg-pink-400 text-slate-950',
          illustration: '🚲🏡❤️'
        };
      case 'ending_innovation_director':
        return {
          title: '🎯 학교 혁신 장학관 (이노베이션 디렉터)',
          subtitle: '압도적인 실무 행정과 교육학적 조예의 완벽한 융합',
          desc: '당신은 기가 막히게 세련된 공문 기안 능력과 전문적인 수업 설계 지식 양쪽 모두를 거머쥔 학교 최고의 인재입니다. 관리자들의 절대적 조력과 동료들의 존경 속에서, 복잡한 학교 혁신 사업을 주도하여 예산 확보와 환경 개선을 동시에 이룩해냈습니다. 교육 혁신을 선도하는 스타 장학관의 선두 주자로 발탁됩니다.',
          badgeColor: 'bg-indigo-700 text-white',
          illustration: '🎯💼🏢'
        };
      case 'ending_myway':
        return {
          title: '🦅 독고다이 마이웨이 교사 (아웃사이더 싱어)',
          subtitle: '교무실의 눈치와 사교를 거부하고 나만의 교육 철학으로',
          desc: '당신은 교무실의 인맥 관리나 친목 다지기, 혹은 상사의 눈치 보기 같은 사교 활동에 전혀 에너지를 쓰지 않았습니다. 동료들과의 관계는 무미건조하지만 오로지 단단한 원칙과 뜨거운 신념으로 교실을 이끌었습니다. 눈치는 보지 않고 할 말은 시원하게 지르는, 그 누구도 건드릴 수 없는 뚝심의 아웃사이더 스승이 되었습니다.',
          badgeColor: 'bg-slate-700 text-white',
          illustration: '🦅🛡️🍂'
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
      
      const trait = stud.traits[0] || '조용한';
      const issue = stud.currentIssues[0] || '학업';

      if (isPositive) {
        letterContent = `선생님! 매일 조회 시간마다 따뜻하게 챙겨주셔서 고마웠어요. 제가 '${trait}' 성향이라 부끄러움이 많았는데, 선생님 덕분에 '${issue}' 문제를 이겨낼 용기를 얻고 무사히 학기를 보냈어요!`;
      } else {
        letterContent = `선생님, 제가 '${issue}' 문제로 한창 불안해하고 끙끙 앓고 있을 때도 바쁘다는 이유로 굳은 얼굴로 행무 결재 서류만 보고 계셔서 사실은 조금 다가가기 어려웠어요...`;
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
              <span className="text-slate-400 block mb-0.5">최종 건강/멘탈</span>
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
        {!['ending_gameover_hp', 'ending_gameover_mental', 'ending_gameover_burnout', 'ending_gameover_complaint'].includes(endingId || '') ? (
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
        ) : (
          <div className="paper-card bg-rose-50 p-8 border-4 border-rose-950 shadow-school-deep text-center space-y-3">
            <h3 className="text-lg font-bold text-rose-950 flex items-center justify-center gap-2">
              💀 로그라이크 중도 퇴직 (게임 오버)
            </h3>
            <p className="text-sm text-rose-900 leading-relaxed font-light">
              교직 생활 30일을 완수하지 못하고 중도 하차했습니다. 교실 안에 정적만 맴돌며, 아이들은 갑자기 담임 교사를 잃고 말았습니다. 편지꾸러미는 쓸쓸히 텅 비어 있습니다.
            </p>
          </div>
        )}

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
