import type { GameEvent } from '@/game/types';

// ==================== [관리자 카테고리 유머 밈 이벤트 30선] ====================
export const funnyAdminEvents: GameEvent[] = [
  {
    id: 'evt_funny_admin_01',
    dayRange: [1, 30],
    title: '교장 선생님의 잡초 뽑기 챌린지',
    category: 'admin',
    situation: '학교 화단',
    narratorText: '방과 후 퇴근하려는데, 교장 선생님께서 학교 화단에서 땀을 뻘뻘 흘리며 맨손으로 흙을 파헤쳐 잡초를 뽑고 계십니다. 마침 나와 눈이 딱 마주치자 "어이 김 선생! 마침 잘 왔네. 여기 화단에 핀 잡초들이 학생들의 정서 순화를 방해하고 있어. 같이 화초의 평화를 지키지 않겠나?"라며 여분의 호미를 건네십니다. 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['교장선생님', '잡초뽑기', '화단봉사'],
    choices: [
      {
        id: 'choice_funny_admin_01_1',
        text: '호미를 쥐고 무릎을 꿇은 채 화단 구석구석을 이 잡듯 뒤져 대왕 민들레 뿌리까지 완벽하게 추출하여 화단 평화를 구축한다. (adminTrust +20, hp -15, burnout +10)',
        intent: '화단 올인 봉사',
        immediateEffects: [
          { stat: 'adminTrust', value: 20 },
          { stat: 'hp', value: -15 },
          { stat: 'burnout', value: 10 }
        ],
        resultText: '교장 선생님은 내 성실함에 눈물을 흘리시며 "김 선생이야말로 참된 대지의 교육자야!"라며 내일 교무실에 시원한 식혜 한 병을 직접 서빙해 주셨습니다.'
      },
      {
        id: 'choice_funny_admin_01_2',
        text: '"교장 선생님의 명품 원예 솜씨에 감탄했습니다! 다만 제가 지금 교실에 학부모 긴급 폰 알림 상담이 잡혀 있어서 먼저 퇴실을 허가받고자 합니다"라며 부드럽게 빠져나간다. (멘탈 +15, hp +5, adminTrust +5)',
        intent: '업무 핑계 합리적 회피',
        immediateEffects: [
          { stat: 'mental', value: 15 },
          { stat: 'hp', value: 5 },
          { stat: 'adminTrust', value: 5 }
        ],
        resultText: '교장 선생님은 "오, 학부모 상담이 더 중요하지!"라며 흔쾌히 가라고 하셨고, 덕분에 정시 퇴근에 성공하여 집에서 온전히 휴식했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_admin_02',
    dayRange: [1, 30],
    title: '교감 선생님의 서체 철학 1시간 특강',
    category: 'admin',
    situation: '교무실 교감석 앞',
    narratorText: '수업 연구 보고서를 결재 받으러 교감 선생님 자리에 섰습니다. 교감 선생님은 기안문을 모니터로 빤히 보시더니 안경을 내리고 말씀하십니다. "김 선생, 공문서의 핵심은 바탕체와 굴림체의 조화로운 비례일세. 바탕체는 진중한 교육의 뼈대를 상징하고 굴림체는 유연한 행정을 상징하지. 자, 여기 1998년 교육청 표준 서식 폰트 비례집을 보게나..." 폰트 철학 설교가 30분째 이어집니다. 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['교감선생님', '서체철학', '굴림체러브'],
    choices: [
      {
        id: 'choice_funny_admin_02_1',
        text: '공책을 꺼내 교감 선생님의 서체 비율 철학을 꼼꼼히 받아 적으며 "바탕체의 획 끝에 깃든 교육 철학에 깊이 동감합니다"라고 감탄을 보낸다. (adminTrust +15, adminPower +10, hp -5)',
        intent: '지적 경청 및 아부',
        immediateEffects: [
          { stat: 'adminTrust', value: 15 },
          { stat: 'adminPower', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '교감 선생님은 크게 흡족해하시며 즉시 마우스 클릭 결재를 완료해 주셨고, 교무실 표준 서식 작성의 1인자로 지목하셨습니다.'
      },
      {
        id: 'choice_funny_admin_02_2',
        text: '"다음 수업 예비 종이 1분 남아서 교실로 신속히 이동해 수업 질서를 사수하겠습니다"라며 서류를 올려두고 빠르게 복귀한다. (expert +15, 멘탈 +10)',
        intent: '수업 핑계 긴급 탈출',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'mental', value: 10 }
        ],
        resultText: '교감 선생님은 아쉬워하셨으나 수업 시간 준수 의지에 만족하시며 즉각 결재 도장을 찍어 주셨습니다. 훈화 감옥 탈출에 성공했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_admin_03',
    dayRange: [1, 30],
    title: '교장실 손수 달인 십전대보차 챌린지',
    category: 'admin',
    situation: '교장실',
    narratorText: '교장실에 학급 일지를 전달하러 갔는데, 교장 선생님이 "김 선생! 마침 내가 지리산에서 캐온 당귀와 대추로 48시간 동안 푹 고아 끓인 십전대보 대추차가 있네!"라며 머그잔에 석탄 수준으로 걸쭉하고 시커먼 액체를 가득 부어 건네십니다. 머그잔에서 한약재 쓴내가 방 안을 지배합니다. 이 차를 어떻게 처리하시겠습니까?',
    weight: 100,
    tags: ['교장실다과', '대추차원샷', '한약체험'],
    choices: [
      {
        id: 'choice_funny_admin_03_1',
        text: '숨을 꾹 참고 뜨거운 십전대보 대추차를 한 방울도 남김없이 단숨에 원샷한 뒤, 컵을 내려놓으며 "인생의 깊은 교육의 맛입니다!"라고 선언한다. (adminTrust +20, hp +10, 멘탈 -5)',
        intent: '의리의 한약 원샷',
        immediateEffects: [
          { stat: 'adminTrust', value: 20 },
          { stat: 'hp', value: 10 },
          { stat: 'mental', value: -5 }
        ],
        resultText: '목구멍이 타들어 가는 쓴맛이었으나 교장 선생님은 "과연 젊은이의 기백이야!"라며 크게 감격하시고 주머니에서 홍삼 사탕을 한 움큼 쥐여주셨습니다. 체력도 소폭 회복되었습니다.'
      },
      {
        id: 'choice_funny_admin_03_2',
        text: '"의사 선생님이 한약재가 현재 복용 중인 영양제와 상극이라 금하라고 하셔서..."라며 정중하게 찻잔을 내려놓고 마음만 수령한다. (멘탈 +12, adminTrust +5)',
        intent: '의학적 핑계 정중 거절',
        immediateEffects: [
          { stat: 'mental', value: 12 },
          { stat: 'adminTrust', value: 5 }
        ],
        resultText: '교장 선생님은 아쉬워하셨으나 건강이 우선이라며 찻잔을 거두셨고 대신 옥수수수염차 캔을 따서 훈훈하게 대화를 마쳤습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_admin_04',
    dayRange: [1, 30],
    title: '장학사 참관 교장 선생님 이름 돌발 퀴즈',
    category: 'admin',
    situation: '교실',
    narratorText: '수업 공개 장학 장학사님이 뒷자리에서 참관 중인 조용한 교실, 갑자기 교장 선생님이 뒷문으로 조용히 들어오시더니 학생들을 향해 손을 흔드십니다. 그리곤 뜬금없이 외치십니다. "어린이 여러분! 혹시 우리 학교 교장 선생님 성함이 무엇인지 아는 사람?" 장학 장학사 앞에서 돌발 퀴즈가 펼쳐졌습니다. 어떻게 중재하시겠습니까?',
    weight: 100,
    tags: ['장학장학', '교장선생님성함', '돌발퀴즈'],
    choices: [
      {
        id: 'choice_funny_admin_04_1',
        text: '칠판에 교장 선생님의 이름을 크고 예쁜 정자체로 판서하고, 전교생과 함께 우렁찬 소리로 교장 선생님 이름을 연호하도록 리드한다. (adminTrust +20, studentTrust +10, hp -5)',
        intent: '우렁찬 교장 성함 연호 리드',
        immediateEffects: [
          { stat: 'adminTrust', value: 20 },
          { stat: 'studentTrust', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '교실 전체가 교장 선생님의 이름을 삼총사 연호하듯 힘차게 부르자, 교장 선생님은 광대가 승천하셨고 장학사님도 교실의 활기찬 결속력을 높이 평가해 보고서에 극찬을 남기셨습니다.'
      },
      {
        id: 'choice_funny_admin_04_2',
        text: '"어린이 여러분, 교장 선생님께서 수업의 몰입도를 높이기 위해 재치 있는 한글 퀴즈를 내주셨군요!"라며 수학 단원 내용과 자연스럽게 결부지어 흐름을 가져온다. (expert +18, 멘탈 +10)',
        intent: '지적인 수업 연계 중재',
        immediateEffects: [
          { stat: 'expert', value: 18 },
          { stat: 'mental', value: 10 }
        ],
        resultText: '퀴즈가 교육적 훈화로 자연스럽게 흡수되며 수업 진도가 오차 없이 마무리되었습니다. 장학사님은 담임의 뛰어난 수업 조율 스킬을 대호평하셨습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_admin_05',
    dayRange: [1, 30],
    title: '교감 선생님의 시속 10km 복도 파워워킹 목격',
    category: 'admin',
    situation: '교실 복도',
    narratorText: '쉬는 시간, 복도 지도 시간입니다. 교감 선생님이 평소 "복도에서는 질서를 위해 절대 뛰면 안 된다"고 신규 교사들과 학생들에게 훈계하셨는데, 본인은 행정실 급한 예산 공문 결재 확인을 위해 경보선수 수준인 시속 10km의 빠른 골반 무빙 파워워킹으로 질주하고 계시는 모순을 포착했습니다. 저 멀리서 다가오십니다. 어떻게 응대하시겠습니까?',
    weight: 100,
    tags: ['복도경보', '모순포착', '교감인사'],
    choices: [
      {
        id: 'choice_funny_admin_05_1',
        text: '공손하게 허리를 굽혀 90도 각도로 인사하며 "교감 선생님의 등교 안전 쾌속 경보 무빙이 국가대표급이십니다! 역시 행정 처리 속도도 남다르십니다!"라고 칭찬한다. (adminTrust +15, colleagueRelation +10, 멘탈 +10)',
        intent: '유쾌한 경보 무빙 칭찬',
        immediateEffects: [
          { stat: 'adminTrust', value: 15 },
          { stat: 'colleagueRelation', value: 10 },
          { stat: 'mental', value: 10 }
        ],
        resultText: '교감 선생님은 흠칫 걸음을 늦추며 허허 웃으셨고, "음! 김 선생도 아침 조깅 운동 삼아 같이 걷게나" 하며 탕비실 꿀음료수를 한 병 주셨습니다.'
      },
      {
        id: 'choice_funny_admin_05_2',
        text: '모르는 척 복도 학생들에게 "얘들아, 복도에서는 교감 선생님처럼 안전하게 파워워킹 경보로 다니자"라며 주의를 환기해 교감을 띄워준다. (expert +15, adminTrust +12)',
        intent: '아동 훈육 연계형 기지',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'adminTrust', value: 12 }
        ],
        resultText: '아이들이 재미있어하며 엉덩이를 흔들며 경보 보행을 따라 했습니다. 교감 선생님은 체면을 세워 준 나에게 흐뭇한 윙크를 보내셨습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_admin_06',
    dayRange: [1, 30],
    title: '교장 선생님 친필 시집 친필 사인 기증',
    category: 'admin',
    situation: '교무실 내 자리',
    narratorText: '교장 선생님이 다가오시더니, 한지 표지에 거칠게 인쇄된 얇은 서적 한 권을 내미십니다. 제목은 [그루터기의 낙엽 찬가]. 교장 선생님이 이번 가을에 자비로 출판하신 개인 시집이라고 합니다. 친필 사인과 함께 "김 선생, 주말에 이 시를 읽고 감성이 풍부한 3학년 문학 지도 팁과 시 독후 소감을 메신저로 넌지시 적어주게나"라고 하십니다. 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['친필시집', '독후감고뇌', '문학교육'],
    choices: [
      {
        id: 'choice_funny_admin_06_1',
        text: '주말에 시집의 3대 명시(낙엽, 흙먼지, 빗자루)를 정독하고 감성적인 은유 기법을 극찬하는 A4 반 페이지 분량의 문학 소감 답장을 보낸다. (adminTrust +20, 멘탈 +10, hp -5)',
        intent: '문학 소감 성실 답장',
        immediateEffects: [
          { stat: 'adminTrust', value: 20 },
          { stat: 'mental', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '교장 선생님은 월요일 아침 조회 시간에 "3반 김 선생의 풍부한 문학적 혜안에 감탄했다"며 전 교직원 앞에서 내 이름을 드높이고 박수를 유도하셨습니다.'
      },
      {
        id: 'choice_funny_admin_06_2',
        text: '"과연 명문 시집이네요! 교실 독서 코너에 비치해 반 아이들에게 아름다운 자연의 은유를 낭독해 주겠습니다"라며 기증본을 보관한다. (studentTrust +12, adminTrust +12, 멘탈 +5)',
        intent: '교실 비치 및 낭독 활용',
        immediateEffects: [
          { stat: 'studentTrust', value: 12 },
          { stat: 'adminTrust', value: 12 },
          { stat: 'mental', value: 5 }
        ],
        resultText: '교장 선생님은 자기 시가 교실에 울려 퍼진다는 사실에 기쁨의 춤을 추셨고, 학급 도서 구매 비용으로 15만 원을 특별 추가 배정해 주셨습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_admin_07',
    dayRange: [1, 30],
    title: '교장실 요가 타임 문 두드리기 눈치 게임',
    category: 'admin',
    situation: '교장실 문 앞',
    narratorText: '급한 공문 결재를 받으러 교장실 문 앞에 섰습니다. 문 노크를 하려는데 투명 유리창 틈새로 교장 선생님이 책상 위에 다리를 올리고 거꾸로 서는 요가 물구나무서기 자세를 취하고 계신 실루엣이 보입니다. 이대로 노크를 하면 교장 선생님의 척추 안전과 체면에 심각한 타격이 올 것 같습니다. 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['교장실방문', '요가타임', '노크타이밍'],
    choices: [
      {
        id: 'choice_funny_admin_07_1',
        text: '복도에서 발소리를 크게 내어 "크흠! 교감 선생님, 행정실 공문 처리하러 가겠습니다!"라고 외쳐 교장이 요가를 해체할 시간을 벌어주고 노크한다. (adminTrust +15, 멘탈 +10, expert +5)',
        intent: '소리로 경보 발령 및 대기',
        immediateEffects: [
          { stat: 'adminTrust', value: 15 },
          { stat: 'mental', value: 10 },
          { stat: 'expert', value: 5 }
        ],
        resultText: '교장 선생님은 잽싸게 물구나무를 풀고 옷매무새를 가다듬어 단정하게 결재 서명을 해주셨습니다. 서로의 품위를 안전하게 수호했습니다.'
      },
      {
        id: 'choice_funny_admin_07_2',
        text: '노크를 생략하고 교장실 비서실(교무실) 결재 보관함에 공문서류철을 살짝 꽂아놓은 뒤 행정망으로 원격 서명을 유도한다. (expert +12, hp +5)',
        intent: '서면 원격 결재 우회',
        immediateEffects: [
          { stat: 'expert', value: 12 },
          { stat: 'hp', value: 5 }
        ],
        resultText: '오후에 전자 서명 시스템을 통해 공문이 통과되었습니다. 어색한 조우 없이 완벽한 업무 처리를 끝냈습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_admin_08',
    dayRange: [1, 30],
    title: '교감 선생님의 회식 후 비스킷 비밀 주머니 투척',
    category: 'admin',
    situation: '교무실 복도',
    narratorText: '행정 예산 회의가 끝난 늦은 오후, 복도에서 마주친 교감 선생님이 좌우를 두리번거리시더니 내 바지 주머니에 비닐봉지에 포장된 수제 버터 비스킷 2개를 쓱 쑤셔 넣어 주십니다. "김 선생, 아까 회의 때 보니까 혈색이 안 좋더군. 이건 부장 회의 다과로 남은 건데 혼자서 조용히 탕비실 구석에서 씹어 먹게나. 부장들이 보면 뺏기니 기밀일세." 어떻게 반응하시겠습니까?',
    weight: 100,
    tags: ['교감선생님', '탕비실기밀', '버터비스킷'],
    choices: [
      {
        id: 'choice_funny_admin_08_1',
        text: '주머니를 움켜쥐고 소리 없이 "이 은혜는 올해 행정 평가 만점으로 반드시 보답하겠습니다!"라고 비장하게 속삭인다. (colleagueRelation +15, 멘탈 +12, hp +5)',
        intent: '기밀 준수형 맹세 피드백',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'mental', value: 12 },
          { stat: 'hp', value: 5 }
        ],
        resultText: '교감 선생님은 흐뭇한 미소를 띠며 스파이처럼 사라지셨습니다. 버터 비스킷은 영혼을 치유할 만큼 고소하고 달콤했습니다.'
      },
      {
        id: 'choice_funny_admin_08_2',
        text: '비스킷을 들고 옆 반 신규 동료 선생님 자리로 가 반씩 쪼개 먹으며 간식의 동료애 연대를 전파한다. (colleagueRelation +12, colleagueSolidarity +15)',
        intent: '동료 연대 간식 반띵',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 12 },
          { stat: 'colleagueSolidarity', value: 15 }
        ],
        resultText: '신규 선생님은 "김 선생님은 제 생명의 은인이에요!"라며 감격하셨고 둘의 학교 협력 도가 대폭 굳건해졌습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_admin_09',
    dayRange: [1, 30],
    title: '방학식 날 교장 선생님의 5분 약속의 30분 훈화',
    category: 'admin',
    situation: '강당 방학식',
    narratorText: '드디어 고대하던 여름방학 방학식 날 아침, 교장 선생님께서 교상에 올라 마이크를 잡으시며 "사랑하는 어린이 여러분, 오늘 훈화는 방학을 맞아 딱 5분만 짧게 끝내겠습니다!"라고 장담하셨습니다. 하지만 애국가 4절 가사 해설부터 시작해 훈화가 30분째 물 흐르듯 흐르고 있습니다. 학생들은 지루해서 쓰러지기 일보 직전입니다. 어떻게 표정 관리를 하시겠습니까?',
    weight: 100,
    tags: ['방학식', '5분약속', '30분훈화'],
    choices: [
      {
        id: 'choice_funny_admin_09_1',
        text: '가장 진중하고 감명받은 눈빛으로 교상 위 교장 선생님을 빤히 바라보며 중간중간 수첩에 필기하는 척 연출한다. (adminTrust +20, hp -5, burnout +5)',
        intent: '감명받은 필기형 표정 사수',
        immediateEffects: [
          { stat: 'adminTrust', value: 20 },
          { stat: 'hp', value: -5 },
          { stat: 'burnout', value: 5 }
        ],
        resultText: '교장 선생님은 나를 향해 훈화의 시선을 던지시며 더욱 열정적으로 강연을 마감하셨습니다. 방학식 후 교장실로 불려가 따뜻한 매실 주스를 포상받았습니다.'
      },
      {
        id: 'choice_funny_admin_09_2',
        text: '아이들의 지루함을 덜어주기 위해 조용히 수신호로 "방학 퀴즈 이벤트가 교실에 대기 중"임을 암시해 학생들의 질서를 사수한다. (studentTrust +15, classManagement +15)',
        intent: '수신호 활용 학생 질서 유지',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'classManagement', value: 15 }
        ],
        resultText: '아이들은 선생님의 퀴즈 힌트를 받으며 얌전하게 훈화를 경청했고 방학식은 큰 소동 없이 질서 정연하게 종료되었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_admin_10',
    dayRange: [1, 30],
    title: '교장실 참새 침입 대결 수호전',
    category: 'admin',
    situation: '교장실',
    narratorText: '결재 보고 중, 창문을 열어둔 교장실로 작은 참새 한 마리가 무단 침입했습니다! 놀란 참새가 교장실 명품 도자기와 난초 화분 사이를 비명을 지르며 날아다니고, 교장 선생님은 "김 선생! 내 화분과 도자기를 지켜주게나!"라며 비서실 소독 빗자루를 던져주십니다. 어떻게 참새를 유도하시겠습니까?',
    weight: 100,
    tags: ['참새소동', '교장실기물', '빗자루결투'],
    choices: [
      {
        id: 'choice_funny_admin_10_1',
        text: '신속하게 교장실 모든 에어컨을 끄고 넓은 외측 창문들을 전면 개방한 뒤, 빗자루를 휘둘러 안전하게 창문 쪽 화단 밖으로 방생 유도한다. (adminTrust +20, hp -5, expert +10)',
        intent: '신속한 방생 및 기물 수호',
        immediateEffects: [
          { stat: 'adminTrust', value: 20 },
          { stat: 'hp', value: -5 },
          { stat: 'expert', value: 10 }
        ],
        resultText: '참새는 다친 곳 없이 화단 나무로 탈출했고 교장실의 귀중한 도자기도 완벽하게 무사했습니다. 교장 선생님은 내 위기 대처 순발력을 최고조로 칭찬하셨습니다.'
      },
      {
        id: 'choice_funny_admin_10_2',
        text: '보건 선생님과 생물 동아리 학생을 소환하여 생태 구조 포획용 뜰채 장비를 지원받아 공적으로 안전 포획한다. (colleagueRelation +10, 멘탈 +10, studentTrust +10)',
        intent: '생태 구조팀 공적 소환',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 10 },
          { stat: 'mental', value: 10 },
          { stat: 'studentTrust', value: 10 }
        ],
        resultText: '뜰채로 참새를 안전히 생포하여 방생했습니다. 참새 소동이 훈훈한 생태 교실 학습 사례로 전파되었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_admin_11',
    dayRange: [1, 30],
    title: '교감 선생님의 공지 카톡 이모티콘 고민',
    category: 'admin',
    situation: '교무실 내 자리',
    narratorText: '교감 선생님께서 메신저 메인 방에 "내일 교육청 공문 기한 엄수 바람."이라는 딱딱한 단체 메시지를 올리셨습니다. 신규 교사인 나에게 동료 교사가 다급히 속사입니다. "김 선생! 여기다 답장으로 정중한 90도 폴더폰 이모티콘을 달아야 할까, 아니면 파이팅 넘치는 엄지척 스티커를 달아야 할까? 교감 쌤이 이모티콘으로 충성도를 모니터링하신다네!" 어떻게 대응하시겠습니까?',
    weight: 100,
    tags: ['이모티콘', '교감카톡', '충성도테스트'],
    choices: [
      {
        id: 'choice_funny_admin_11_1',
        text: '가장 예의 바르고 단정한 "네! 알겠습니다 부장님!" 멘트와 함께 폴더인사 90도 고전 스티커를 전송해 충성도를 사수한다. (adminTrust +15, colleagueRelation +10, 멘탈 +5)',
        intent: '폴더인사형 표준 대응',
        immediateEffects: [
          { stat: 'adminTrust', value: 15 },
          { stat: 'colleagueRelation', value: 10 },
          { stat: 'mental', value: 5 }
        ],
        resultText: '교감 선생님은 내 단정한 답글 밑에 하트 이모티콘을 달아 흡족함을 표시하셨습니다. 직장 내 프로 예절을 수호했습니다.'
      },
      {
        id: 'choice_funny_admin_11_2',
        text: '이모티콘 경쟁 대신 조용히 내 행정 시스템을 켜서 해당 기한 공문 결재 기안 서류를 10분 먼저 결재 올려 행동으로 신속히 보여준다. (expert +18, adminTrust +15, hp -5)',
        intent: '기안 실행으로 실무 충성 표출',
        immediateEffects: [
          { stat: 'expert', value: 18 },
          { stat: 'adminTrust', value: 15 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '이모티콘을 누르는 대신 업무를 해결해 버리자 교감 선생님이 전화로 "역시 김 선생이 일 처리는 에이스야!"라며 감격하셨습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_admin_12',
    dayRange: [1, 30],
    title: '교장 선생님의 커피차 1인 1메뉴 짠돌이 플렉스',
    category: 'admin',
    situation: '학교 운동장 커피차 앞',
    narratorText: '오늘 교장 선생님께서 "김 선생! 내가 이번 주 행정 노고를 치하하기 위해 학교 운동장에 커피차 플렉스를 쐈네!"라며 교직원들을 대동하셨습니다. 그런데 커피차 메뉴판을 보니 교장 선생님의 특별 조건으로 [오직 아이스 아메리카노(L) 단일 메뉴만 주문 가능. 시럽 추가 불가, 카페라떼 주문 시 개인 추가금 1,500원 자부담]이라고 적혀 있습니다. 어떻게 반응하시겠습니까?',
    weight: 100,
    tags: ['짠돌이커피차', '아메리카노', '교장선생님플렉스'],
    choices: [
      {
        id: 'choice_funny_admin_12_1',
        text: '"아메리카노의 깊은 쓴맛이야말로 행정의 쓴맛과 단맛을 모두 담은 교장 선생님의 인생 커피 철학입니다!"라며 원샷하고 극찬한다. (adminTrust +20, hp +5, 멘탈 +10)',
        intent: '아메리카노 철학화 극찬 아부',
        immediateEffects: [
          { stat: 'adminTrust', value: 20 },
          { stat: 'hp', value: 5 },
          { stat: 'mental', value: 10 }
        ],
        resultText: '교장 선생님은 "과연 내 맘을 아는군!"이라며 껄껄 웃으셨고, 동료 교사들에게도 쓴맛의 가치를 설교하시며 기분 좋게 커피 타임을 마쳤습니다.'
      },
      {
        id: 'choice_funny_admin_12_2',
        text: '내 지갑에서 1,500원을 꺼내 당당히 자부담 결제하고 평소 먹고 싶던 달콤한 돌체 멜론 라떼를 휘핑 가득 얹어 먹는다. (멘탈 +18, hp +10, adminTrust +5)',
        intent: '실속 자부담 달콤 라떼 획득',
        immediateEffects: [
          { stat: 'mental', value: 18 },
          { stat: 'hp', value: 10 },
          { stat: 'adminTrust', value: 5 }
        ],
        resultText: '1,500원으로 내 입맛의 힐링을 완벽하게 쟁취했습니다. 달달한 휘핑크림 덕에 오후 수업을 활기차게 리드했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_admin_13',
    dayRange: [1, 30],
    title: '명절 전날 교감 선생님의 개량 한복 등교 권고',
    category: 'admin',
    situation: '교무실',
    narratorText: '추석 명절을 하루 앞둔 출근길, 교감 선생님이 교직원 회의에서 넌지시 말씀하십니다. "내일은 우리 민족 최대의 명절인데, 교직원들이 한복이나 개량 한복을 입고 출근하여 교문에서 등교 지도를 서면 아이들이 우리 전통문화의 예절을 직관적으로 배울 텐데... 강요는 아니고 자율 권장사항이네." 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['개량한복', '전통문화', '명절등교'],
    choices: [
      {
        id: 'choice_funny_admin_13_1',
        text: '장롱 속에 묵혀두었던 알록달록한 전통 개량 한복 바지를 착용하고 출근해 교문 앞을 훈훈한 잔치 분위기로 연출한다. (adminTrust +18, studentTrust +15, hp -10)',
        intent: '한복 착용 동참',
        immediateEffects: [
          { stat: 'adminTrust', value: 18 },
          { stat: 'studentTrust', value: 15 },
          { stat: 'hp', value: -10 }
        ],
        resultText: '아이들이 "우와 선생님 세배해야 하나요?"라며 엄청 기뻐하며 등교했고, 교감 선생님은 전통문화 수호 교사라며 엄지척 사진을 찍어 학교 신문에 올리셨습니다.'
      },
      {
        id: 'choice_funny_admin_13_2',
        text: '깔끔하고 단정한 네이비 셔츠와 슬랙스 평상복을 고수하여, 안전 등교 지도 활동 시 옷자락 밟힘 사고 등을 사전에 차단한다. (expert +15, 멘탈 +12, adminTrust +5)',
        intent: '실용 평상복 복장 고수',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'mental', value: 12 },
          { stat: 'adminTrust', value: 5 }
        ],
        resultText: '활동성이 우수한 옷차림 덕에 등교하는 아이들의 돌발 킥보드 충돌 사고를 순발력 있게 몸으로 막아내 안전지도를 성공리에 끝냈습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_admin_14',
    dayRange: [1, 30],
    title: '교장실 귀중 화분 개운죽 물뿌리개 전담 당번 요청',
    category: 'admin',
    situation: '교장실',
    narratorText: '교장실을 나설 때 교장 선생님이 촉촉한 눈망울로 물뿌리개를 쥐여주십니다. "김 선생, 행정실 주무관들이 흙먼지가 날린다며 교장실 개운죽 화분 물주기를 거부하더군. 식물도 교육의 일환이네. 주 1회 교장실에 들러 개운죽 잎사귀 물뿌리개와 비료 케어를 해줄 수 있겠나?" 화분 관리 요청입니다. 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['개운죽화분', '교장실화분', '물주기당번'],
    choices: [
      {
        id: 'choice_funny_admin_14_1',
        text: '기분 좋게 물뿌리개를 받아 매주 수요일 공강 시간에 화분에 영양제를 꽂아주며 교장 선생님과 가벼운 커피 차담을 진행한다. (adminTrust +20, colleagueRelation +10, hp -5)',
        intent: '개운죽 물주기 및 차담 동참',
        immediateEffects: [
          { stat: 'adminTrust', value: 20 },
          { stat: 'colleagueRelation', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '개운죽이 아주 싱싱하게 잎사귀를 뻗어냈고 교장 선생님은 나를 최고 측근으로 여기시며 교내 주요 의사결정 때마다 내 의견을 경청해주셨습니다.'
      },
      {
        id: 'choice_funny_admin_14_2',
        text: '"식물 원예 관리는 시설 관리 행정망 공식 직무 영역이므로, 행정실 원예 보조 용역 예산을 청구하겠다"며 공문 처리 대안을 세운다. (expert +15, adminPower +10)',
        intent: '공식 원예 용역 예산 청구',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'adminPower', value: 10 }
        ],
        resultText: '학교 운영 위원회 심의를 통과해 사설 화초 관리 용역 예산이 승인되어, 내 노동 없이 교장실 화분이 윤택하게 셋팅되었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_admin_15',
    dayRange: [1, 30],
    title: '교감 선생님의 서류 철 클립 90도 각도기 훈화',
    category: 'admin',
    situation: '교무실 교감석 앞',
    narratorText: '제출한 학생 상담 보고서 철의 금속 클립 결속 각도를 보시고 교감 선생님이 각도기를 대듯 돋보기안경을 내려 쓰십니다. "김 선생, 종이철을 묶는 금속 클립은 철심과 종이 모서리가 정확히 90도 평행을 이루어야 보관 시 구김이 없고 행정의 엄정함이 느껴지지. 각도가 어긋나면 마음도 어긋나는 법일세." 클립 각도 훈화입니다. 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['교감선생님', '클립각도', '서류철정리'],
    choices: [
      {
        id: 'choice_funny_admin_15_1',
        text: '즉시 그 자리에서 클립 철심을 90도 직각 자를 대듯 똑바로 고쳐 조율하고 "행정의 시작은 정렬이라는 점을 뼈저리게 배웠습니다!"라고 깍듯이 답한다. (adminTrust +15, adminPower +12, hp -5)',
        intent: '정밀 서류 정렬 아부',
        immediateEffects: [
          { stat: 'adminTrust', value: 15 },
          { stat: 'adminPower', value: 12 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '교감 선생님은 고개를 크게 끄덕이셨고 내 결재 기안 서식 정밀도를 100점 만점으로 호평해 즉시 서명 도장을 쐈습니다.'
      },
      {
        id: 'choice_funny_admin_15_2',
        text: '"요즘은 친환경 페이퍼리스(Paperless) 교육청 방침에 따라 금속 클립을 아예 쓰지 않는 전자 문서 PDF 편철로 전환하겠다"고 딜한다. (expert +18, adminTrust +10, 멘탈 +10)',
        intent: '디지털 전자편철 전환',
        immediateEffects: [
          { stat: 'expert', value: 18 },
          { stat: 'adminTrust', value: 10 },
          { stat: 'mental', value: 10 }
        ],
        resultText: '서류철을 아예 안 쓰고 전자 보관함 폴더에 바로 올림으로써 클립 각도 스트레스에서 완벽하게 해방되었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_admin_16',
    dayRange: [1, 30],
    title: '교육청 장학사 다과 레이아웃 황금비율 배치',
    category: 'admin',
    situation: '교장실 손님맞이 상',
    narratorText: '교육청 장학사 장학점검일 아침, 교감 선생님이 교장실 티 테이블에 녹차 잔과 귤, 몽쉘 크림케이크의 접시 배치 각도가 엇갈려 장학사의 심기를 건드릴 수 있다며 나를 소환하십니다. "김 선생! 녹차 잔 손잡이는 정확히 동북쪽 45도를 가리키고, 몽쉘은 귤보다 2cm 뒤에 레이아웃해야 황금비율일세. 자, 같이 맞춰보세!" 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['다과레이아웃', '황금비율', '장학사맞이'],
    choices: [
      {
        id: 'choice_funny_admin_16_1',
        text: '교감의 손을 잡고 몽쉘과 귤을 자 대고 잰 듯 2cm 황금비율로 배치하고 녹차 잔 손잡이를 45도로 완벽 셋팅해 낸다. (adminTrust +15, colleagueRelation +10, hp -5)',
        intent: '황금비율 다과 셋팅 동참',
        immediateEffects: [
          { stat: 'adminTrust', value: 15 },
          { stat: 'colleagueRelation', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '장학사님이 교장실에 들어와 "다과 정렬 상태를 보니 학교 행정 정돈력이 탁월하군요!"라며 장학 점검 등급 A를 주셨고 교장실 파티가 성황리에 마무리되었습니다.'
      },
      {
        id: 'choice_funny_admin_16_2',
        text: '"장학의 본질은 수업 참관이오니 교무실에 올려둔 국어 평가 포트폴리오 기안 서류 최종 검수하러 가겠다"며 자리를 옮긴다. (expert +18, 멘탈 +10)',
        intent: '수업 성과물 검수 복귀',
        immediateEffects: [
          { stat: 'expert', value: 18 },
          { stat: 'mental', value: 10 }
        ],
        resultText: '학습 성과물 피드백 검수가 완벽하게 진행되어 장학사 참관 평가회에서 우수 모범 교사상을 수여받았습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_admin_17',
    dayRange: [1, 30],
    title: '교장 선생님의 주말 스크린 골프 매칭 대타 소환',
    category: 'admin',
    situation: '교무실 전화기',
    narratorText: '금요일 퇴근 30분 전, 교장 선생님으로부터 다급한 전화가 왔습니다. "어이 김 선생, 주말 토요일 오전 교직원 친목 스크린 골프 4인조 매칭 중 1명이 갈비뼈 통증으로 펑크가 났네! 골프 못 쳐도 되네. 헛스윙만 해도 좋으니 내일 아침 8시 백두 골프장 대타로 나와 줄 수 있겠나?" 대타 소환입니다. 어떻게 거절 혹은 수락하시겠습니까?',
    weight: 100,
    tags: ['스크린골프', '대타소환', '교장선생님'],
    choices: [
      {
        id: 'choice_funny_admin_17_1',
        text: '"주말에 마침 손목 건초염 한의원 침 물리치료 패키지가 잡혀 있어 골프채 그립만 쥐어도 손이 꺾입니다"라며 아쉬움 가득 담아 거절한다. (멘탈 +15, hp +10, adminTrust +5)',
        intent: '건초염 핑계 정중 거절',
        immediateEffects: [
          { stat: 'mental', value: 15 },
          { stat: 'hp', value: 10 },
          { stat: 'adminTrust', value: 5 }
        ],
        resultText: '교장 선생님은 "에고 아프면 쉬어야지!"라며 대타를 다른 부장 교사에게 넘기셨고 주말 독신 자유 꿀잠을 안전히 수호했습니다.'
      },
      {
        id: 'choice_funny_admin_17_2',
        text: '"머리 올리러 출격하겠습니다!"라며 스크린 골프장으로 향해, 혼신의 헛스윙 리액션으로 교장실 VIP 친목을 다진다. (adminTrust +20, hp -15, burnout +10)',
        intent: '스크린골프 올인 친목 동참',
        immediateEffects: [
          { stat: 'adminTrust', value: 20 },
          { stat: 'hp', value: -15 },
          { stat: 'burnout', value: 10 }
        ],
        resultText: '공은 산으로 날아갔으나 교장 선생님은 "자네 유머러스한 헛스윙이 아주 매력적이야!"라며 크게 기뻐하시며 점심으로 프리미엄 소갈비를 사 주셨습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_admin_18',
    dayRange: [1, 30],
    title: '교감 선생님의 공무원 행동 강령 조항 아침 낭독회',
    category: 'admin',
    situation: '교무실 아침조회',
    narratorText: '월요일 아침 조회 시간, 교감 선생님이 마이크를 잡으시더니 두꺼운 책자를 펼치십니다. "교직원 청렴과 도덕 수호를 위해 오늘 아침엔 공무원 행동 강령 제5조 금품 및 향응 금지 항목을 한 글자씩 함께 소리 내 낭독하며 한 주를 시작하겠습니다." 교무실 전체에 한문 가득한 낭독음이 울려 퍼집니다. 어떻게 동참하시겠습니까?',
    weight: 100,
    tags: ['아침조회', '행동강령', '청렴교육'],
    choices: [
      {
        id: 'choice_funny_admin_18_1',
        text: '목소리를 가장 크게 하여 낭독 성우처럼 "제 5조 1항! 부정 청탁을 금하노라!"라고 웅장하게 발음해 교감의 청렴 의지에 부응한다. (adminTrust +15, expert +10, 멘탈 +5)',
        intent: '웅장한 강령 낭독 동참',
        immediateEffects: [
          { stat: 'adminTrust', value: 15 },
          { stat: 'expert', value: 10 },
          { stat: 'mental', value: 5 }
        ],
        resultText: '교감 선생님은 크게 기뻐하시며 "김 선생 목소리에 청렴한 선비의 혼이 깃들었다"며 교무실 청렴 리더로 임명하셨습니다.'
      },
      {
        id: 'choice_funny_admin_18_2',
        text: '조용히 눈을 감고 아침 묵상을 하는 척하며 머릿속으로 오늘 3교시 수학 분수 수업 진행 교안 레이아웃을 완성해 체력을 아낀다. (expert +15, hp +5, 멘탈 +10)',
        intent: '아침 묵상 우회 체력 보존',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'hp', value: 5 },
          { stat: 'mental', value: 10 }
        ],
        resultText: '머릿속으로 조립한 수업 교안 덕분에 3교시 수업이 대성공을 거두며 반 아이들이 분수의 원리를 완벽하게 깨달았습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_admin_19',
    dayRange: [1, 30],
    title: '교장 선생님 먼지 검열 흰 장갑 교무실 순회',
    category: 'admin',
    situation: '교무실 내 자리',
    narratorText: '수업 시작 10분 전, 교장 선생님이 하얀 장갑을 끼고 교무실 창틀을 슥 훑으며 청결도 순회를 돌고 계십니다! 내 책상 구석에는 어제 먹고 남은 대왕 꿀 젤리 빈 봉지와 과자 부스러기가 쌓여 있습니다. 교장의 백장갑 레이더가 내 자리 쪽으로 좁혀오고 있습니다. 어떻게 은폐하시겠습니까?',
    weight: 100,
    tags: ['백장갑검열', '책상청소', '젤리봉지은폐'],
    choices: [
      {
        id: 'choice_funny_admin_19_1',
        text: '빛의 속도로 빈 봉지를 서랍 속에 쳐 넣고, 책상 위에 물티슈를 얹어 교장 선생님 발 앞의 책상 왁스 광을 미친 듯이 낸다. (adminTrust +15, classManagement +10, hp -5)',
        intent: '초고속 물티슈 광내기',
        immediateEffects: [
          { stat: 'adminTrust', value: 15 },
          { stat: 'classManagement', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '교장 선생님은 번쩍이는 내 책상을 만져보시고 하얀 장갑이 깨끗하자 "음! 김 선생은 자기 주변 정리가 아주 칼같군!"이라며 대만족을 남기셨습니다.'
      },
      {
        id: 'choice_funny_admin_19_2',
        text: '정직하게 쓰레기통에 젤리 봉지를 버리고 오며 "아이들에게 정리정돈의 모범을 보이기 위해 마침 쓰레기 배출 중이었습니다"라고 대답한다. (expert +15, 멘탈 +10)',
        intent: '정직한 쓰레기 수거 연출',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'mental', value: 10 }
        ],
        resultText: '교무실 분리배출 룰을 철저히 실천하여 친환경 녹색 교사 이미지를 굳건히 각인시켰습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_admin_20',
    dayRange: [1, 30],
    title: '급식실 교감 선생님의 마라탕 청나라 인문학 강연',
    category: 'admin',
    situation: '급식실 식사 테이블',
    narratorText: '오늘 급식 특식으로 마라탕과 꿔바로우가 나왔습니다. 교감 선생님이 마침 내 옆자리에 식판을 놓으시더니 마라탕 건더기를 건져 올리며 말씀하십니다. "김 선생, 마라의 유래는 사실 청나라 건륭제 시절 사천 지방의 선원들이 배 위에서..."라며 꿔바로우 고기 한 입을 드시고는 역사 강의를 길게 늘어놓으십니다. 밥이 코로 들어갈 것 같습니다. 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['급식대화', '마라탕역사', '교감선생님'],
    choices: [
      {
        id: 'choice_funny_admin_20_1',
        text: '꿔바로우를 씹으며 "와! 청나라 건륭제의 사천 요리 철학이 이 꿔바로우 소스의 단맛에 고스란히 묻어있군요!"라며 극도로 유창한 역사 맞장구를 쳐준다. (colleagueRelation +15, 멘탈 +10, hp +5)',
        intent: '식탁 인문학 맞장구',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'mental', value: 10 },
          { stat: 'hp', value: 5 }
        ],
        resultText: '교감 선생님은 너무 신이 나셔서 내 식판 위에 꿔바로우 고기 조각을 본인 식판에서 3개나 더 얹어 주시며 기분 좋게 식사하셨습니다.'
      },
      {
        id: 'choice_funny_admin_20_2',
        text: '"마라의 매운 캡사이신 열독이 위벽을 자극할 수 있으니 침묵 속에 천천히 씹어 드시어 위장 안전을 도모합시다"라며 조용히 식사에 전념한다. (expert +12, hp +10)',
        intent: '침묵 웰빙 식사 고수',
        immediateEffects: [
          { stat: 'expert', value: 12 },
          { stat: 'hp', value: 10 }
        ],
        resultText: '식사는 안전하고 소화가 아주 잘 되게 마쳤습니다. 교감 선생님도 조용히 낙지 수프를 비우셨습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_admin_21',
    dayRange: [1, 30],
    title: '교장 선생님의 안경 뿌염 크리너 클렌징 헌신',
    category: 'admin',
    situation: '교장실',
    narratorText: '수업 기안문 서명을 받기 위해 대기하던 중, 교장 선생님이 만년필을 쥐셨으나 돋보기안경 알이 입김과 콧김 먼지로 뿌옇게 흐려져 인상을 쓰십니다. "김 선생, 안경알이 먼지로 덮여 결재선 글씨가 도저히 안 보정이 안 되는군. 결재 서명 보류하겠네." 서명 파기 위기입니다. 어떻게 헌신하시겠습니까?',
    weight: 100,
    tags: ['교장안경', '클리너천', '결재서명수호'],
    choices: [
      {
        id: 'choice_funny_admin_21_1',
        text: '주머니 속 최고급 극세사 초극세 안경 클리너 타월 천을 꺼내 "교장 선생님, 안구의 광명을 복원해 드리겠습니다!"라며 안경을 반짝이게 닦아 드린다. (adminTrust +20, expert +10, 멘탈 +10)',
        intent: '안경 닦기 헌신',
        immediateEffects: [
          { stat: 'adminTrust', value: 20 },
          { stat: 'expert', value: 10 },
          { stat: 'mental', value: 10 }
        ],
        resultText: '교장 선생님은 안경을 쓰시고 "오! 라식 수술을 한 듯 해상도가 4K로 올라갔네!"라며 즉시 싸인 펜으로 서명을 휘갈겨 결재를 끝내주셨습니다. 안경 천은 영구 기증했습니다.'
      },
      {
        id: 'choice_funny_admin_21_2',
        text: '교장실 테이블 위에 있던 티슈에 물을 살짝 묻혀 건네며 스스로 안경을 닦도록 배려 유도한다. (adminTrust +10, hp +5)',
        intent: '티슈 제공 자립 닦기',
        immediateEffects: [
          { stat: 'adminTrust', value: 10 },
          { stat: 'hp', value: 5 }
        ],
        resultText: '교장 선생님은 휴지로 슥슥 안경을 닦으셨고 다소 기포 얼룩이 남았으나 결재 서명은 완수되었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_admin_22',
    dayRange: [1, 30],
    title: '교감 선생님의 주말 행정 연수 카톡 선물 오폭',
    category: 'admin',
    situation: '교무실 내 자리',
    narratorText: '교감 선생님으로부터 카카오톡 개인 메시지가 도착했습니다. 설레는 맘으로 열었는데, 스타벅스 쿠폰이 아니라 [토요일 오전 9시 교육공무원 예산 혁신 온라인 비대면 연수 신청 좌표 링크]였습니다! "김 선생, 주말에 이 연수를 들으면 내년 기안 결재 능력이 2배는 상승할 걸세. 강요는 절대 아니고 추천이네!" 눈물이 흐릅니다. 주말 연수를 들으시겠습니까?',
    weight: 100,
    tags: ['주말연수', '예산기안', '교감선생님선물'],
    choices: [
      {
        id: 'choice_funny_admin_22_1',
        text: '"주말에 마침 양가 조모님의 생신 제사가 겹쳐 시골 가문 행사 참가가 예약되어 있어 눈물을 머금고 거절합니다"라고 공손히 사절 답장한다. (멘탈 +18, hp +10, adminTrust +5)',
        intent: '조모님 제사 핑계 사절',
        immediateEffects: [
          { stat: 'mental', value: 18 },
          { stat: 'hp', value: 10 },
          { stat: 'adminTrust', value: 5 }
        ],
        resultText: '교감 선생님은 "아, 효도는 중대사지! 가문에 충실하게"라며 흔쾌히 납득하셨고 주말 이불 속 꿀잠을 안전히 수호했습니다.'
      },
      {
        id: 'choice_funny_admin_22_2',
        text: '토요일 오전 노트북 줌을 켜놓고 연수를 완독 청강하여 예산 기안 항목 처리 수료증을 획득한다. (expert +18, adminTrust +20, hp -10)',
        intent: '주말 연수 이수 올인',
        immediateEffects: [
          { stat: 'expert', value: 18 },
          { stat: 'adminTrust', value: 20 },
          { stat: 'hp', value: -10 }
        ],
        resultText: '수료증 캡쳐를 교감 선생님께 전송하자 교감 선생님은 감격의 눈물을 띠며 내년 부장 교사 초고속 승진 기안에 적극 참고하겠다고 약속하셨습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_admin_23',
    dayRange: [1, 30],
    title: '교장 선생님의 등굣길 에어로폰 베토벤 연주 사건',
    category: 'admin',
    situation: '교문 앞',
    narratorText: '음악 애호가이신 교장 선생님께서 아침 교문 앞 등교 지도 때 직접 기계식 색소폰(에어로폰)을 들고 등교하는 학생들을 위해 베토벤 합창 교향곡을 연주하자고 제안하십니다. "김 선생이 옆에서 탬버린을 흔들어 박자를 맞춰주면 아이들 정서 힐링에 우주급 효과가 있을 걸세!" 등굣길 미니 연주회 제안입니다. 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['등교연주', '에어로폰', '탬버린기사'],
    choices: [
      {
        id: 'choice_funny_admin_23_1',
        text: '탬버린을 흔들며 교장의 클래식 연주 박자를 완벽히 정밀 메이킹해 훌륭한 교문 음악회를 완수한다. (adminTrust +20, studentTrust +15, hp -10)',
        intent: '탬버린 반주 동참',
        immediateEffects: [
          { stat: 'adminTrust', value: 20 },
          { stat: 'studentTrust', value: 15 },
          { stat: 'hp', value: -10 }
        ],
        resultText: '학생들이 교문 통과할 때 박수를 치고 흥겨워했고, 등굣길 소동이 지역 신문 교육 미담 란에 사진과 함께 대문짝만하게 장식되었습니다.'
      },
      {
        id: 'choice_funny_admin_23_2',
        text: '"아침 공기가 쌀쌀하여 교장 선생님의 고귀한 성대와 기관지 안전을 위해 음악회는 따뜻한 실내 강당 행사로 연기하시죠"라며 보건적 제안을 한다. (expert +15, adminTrust +12)',
        intent: '건강 보호용 대안 지연',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'adminTrust', value: 12 }
        ],
        resultText: '교장 선생님은 목을 짚으며 "음! 건강이 우선이군!"이라며 에어로폰을 케이스에 넣으셨습니다. 아침 등굣길이 평화롭게 정돈되었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_admin_24',
    dayRange: [1, 30],
    title: '교감 선생님 보고서 표지 3D 무지개 그라데이션 훈수',
    category: 'admin',
    situation: '교무실 교감석 앞',
    narratorText: '수업 만족도 조사 기안 보고서를 제출했습니다. 교감 선생님이 표지 디자인을 보시고 고개를 갸우뚱하십니다. "김 선생, 요즘 신세대 디자인은 표지 제목에 3D 무지개 그라데이션 광원 입체 효과가 뿜어져 나와야 가독성이 2배는 오르는 법일세. 심심한 검은 글씨는 너무 세기말이야." 3D 훈수 디자인입니다. 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['보고서디자인', '3D그라데이션', '교감디자이너'],
    choices: [
      {
        id: 'choice_funny_admin_24_1',
        text: '즉시 내 노트북 파워포인트를 켜서 제목 글씨에 네온 광원과 3D 무지개 회전 효과를 흠뻑 난사한 표지로 수정해 올린다. (adminTrust +15, adminPower +12, 멘탈 +5)',
        intent: '3D 무지개 광원 수정 완료',
        immediateEffects: [
          { stat: 'adminTrust', value: 15 },
          { stat: 'adminPower', value: 12 },
          { stat: 'mental', value: 5 }
        ],
        resultText: '교감 선생님은 모니터를 보며 "오! 역시 무지개 입체 효과야! 교직원의 품격이 철철 흐르는군!"이라며 대칭찬과 함께 결재를 쐈습니다.'
      },
      {
        id: 'choice_funny_admin_24_2',
        text: '정식 교육청 공식 기안문 문서 작성 매뉴얼 책자를 펼쳐 "표지 디자인은 오직 공문서 흰색 바탕 검정 명조 16포인트 단일 포맷 규정"임을 차분히 안내한다. (expert +18, adminTrust +10)',
        intent: '교육청 표준 매뉴얼 사수',
        immediateEffects: [
          { stat: 'expert', value: 18 },
          { stat: 'adminTrust', value: 10 }
        ],
        resultText: '교감 선생님은 교육청 룰북에 수긍하시며 아쉬워하셨으나 즉각 결재 도장을 누르셨습니다. 정제된 기안을 수호했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_admin_25',
    dayRange: [1, 30],
    title: '교장실 삽목 비밀 개운죽 헌정 대소동',
    category: 'admin',
    situation: '교실 뒷문',
    narratorText: '수업 시작 직전 교실 뒷문으로 교장 선생님이 도자기에 꽂힌 푸른 개운죽 대나무 화분을 들고 직접 들어오셨습니다. "김 선생! 내가 교장실에서 손수 삽목해 키운 개운죽 수경 화분이네. 매일 잎사귀 물을 주고 개수를 기록해 아이들 자연 학습에 활용해 보게나!" 개운죽 헌정입니다. 어떻게 관리하시겠습니까?',
    weight: 100,
    tags: ['개운죽화분', '자연친화', '교장선생님기부'],
    choices: [
      {
        id: 'choice_funny_admin_25_1',
        text: '교실 뒤 개운죽 일일 당번 학생을 지정하고 매주 개운죽의 잎사귀 성장 그래프 관찰 일지를 교실 뒷판 환경 미화판에 화려하게 공지한다. (studentTrust +15, adminTrust +18, 멘탈 +10)',
        intent: '성장일지 뒷판 환경 구성',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'adminTrust', value: 18 },
          { stat: 'mental', value: 10 }
        ],
        resultText: '교장 선생님이 학교 순회 중 교실 뒷판의 정밀한 개운죽 성장 관찰지를 보시고 눈물을 글썽이며 대대적인 학급 물품 전폭 기부를 약속하셨습니다.'
      },
      {
        id: 'choice_funny_admin_25_2',
        text: '교실 구석 그늘진 책장 위에 두고 자연 가습기 효과 대용으로 얌전하고 깨끗하게 배치 보존만 해둔다. (classManagement +12, hp +5)',
        intent: '미니멀 가습 배치',
        immediateEffects: [
          { stat: 'classManagement', value: 12 },
          { stat: 'hp', value: 5 }
        ],
        resultText: '화분은 조용하고 안전하게 실내 천연 가습 효과를 내어 주었습니다. 교실 기본 환경 관리에 기여했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_admin_26',
    dayRange: [1, 30],
    title: '교감 선생님의 보고서 빨간 펜 맞춤법 과외 교실',
    category: 'admin',
    situation: '교무실 교감석 앞',
    narratorText: '제출한 수업 행사 기안문의 문맥 중 조사 "및"을 썼는데 교감 선생님이 빨간 볼펜을 들고 동그라미를 치십니다. "김 선생, 한국인의 얼은 조사 \'그리고\'나 \'아울러\'에서 나오네. \'및\'은 너무 한자어 번역투의 굳은 느낌이지. 자, 이 기안의 모든 \'및\'을 교정해 오게나." 조사 맞춤법 훈수입니다. 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['맞춤법교정', '빨간펜교감', '및그리고'],
    choices: [
      {
        id: 'choice_funny_admin_26_1',
        text: '신속히 자리로 돌아가 문서 내 모든 "및"을 "아울러"와 "그리고"로 자동 치환 수정하여 광속 재기안을 완료해 올린다. (adminTrust +15, adminPower +12, hp -5)',
        intent: '아울러 그리고 치환',
        immediateEffects: [
          { stat: 'adminTrust', value: 15 },
          { stat: 'adminPower', value: 12 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '교감 선생님은 만족의 비명이 섞인 미소를 지으시며 "아! 한글의 조화로운 미학이 흐르는 명문 공문이 완성되었군!"이라며 즉시 결재 승인 클릭을 하셨습니다.'
      },
      {
        id: 'choice_funny_admin_26_2',
        text: '국립국어원 표준 표준어 규격 가이드를 들어 "및"도 공식 허용되는 최고 빈도의 표준 조사임을 넌지시 설명하고 원안 결재를 요청한다. (expert +18, adminTrust +5)',
        intent: '국립국어원 규격 설득',
        immediateEffects: [
          { stat: 'expert', value: 18 },
          { stat: 'adminTrust', value: 5 }
        ],
        resultText: '교감 선생님은 다소 씁쓸해하셨으나 표준어 규정에 수긍하여 결재 서명을 완료하셨습니다. 문법 논의 역량이 향상되었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_admin_27',
    dayRange: [1, 30],
    title: '교장실 기밀 비상 아이스크림 팥빙수 수혜',
    category: 'admin',
    situation: '교장실',
    narratorText: '폭염 경보가 쏟아진 더운 오후, 교무 부장님 심부름으로 교장실 서류를 전달하러 갔습니다. 교장 선생님이 창가 에어컨을 강풍으로 틀고 혼자 소파에 앉아 땀을 닦으시더니, 소파 뒤 비밀 미니 냉장고에서 번쩍이는 수제 컵 팥빙수 아이스크림을 하나 꺼내 주십니다. "김 선생! 이건 부장들이 오면 다 뺏기니까, 둘이서 숟가락으로 조용히 컵을 긁어 먹으며 회포를 풀세!" 어떻게 대응하시겠습니까?',
    weight: 100,
    tags: ['교장아이스크림', '비밀냉장고', '폭염팥빙수'],
    choices: [
      {
        id: 'choice_funny_admin_27_1',
        text: '숟가락을 쥐고 팥빙수를 싹싹 긁어 마시며 "교장 선생님과 먹는 팥빙수의 시원함이 올해 폭염을 완벽하게 삭제해 줍니다!"라며 감격을 나눈다. (adminTrust +20, hp +10, 멘탈 +12)',
        intent: '팥빙수 올인 원샷',
        immediateEffects: [
          { stat: 'adminTrust', value: 20 },
          { stat: 'hp', value: 10 },
          { stat: 'mental', value: 12 }
        ],
        resultText: '아이스크림의 단맛이 온몸의 피로를 날려주었습니다. 교장 선생님은 나를 최고 에이스 교사로 여기며 주간 보직 교사 승진 코치 면담을 은밀히 진행해주셨습니다.'
      },
      {
        id: 'choice_funny_admin_27_2',
        text: '팥빙수를 들고 교무실 공용 테이블로 나와 동료 신규 교사들에게 자랑스럽게 배포하며 기쁨을 전파한다. (colleagueRelation +15, colleagueSolidarity +12)',
        intent: '아이스크림 동료 배포',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'colleagueSolidarity', value: 12 }
        ],
        resultText: '동료 교사들과 달콤한 아이스크림 간식 타임을 가지며 교무실 내 민원 극복 꿀팁을 전수하는 유익한 휴식을 보냈습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_admin_28',
    dayRange: [1, 30],
    title: '교감 선생님의 친목 발야구 만루 홈런 조율 딜레마',
    category: 'admin',
    situation: '학교 운동장',
    narratorText: '교직원 친목 발야구 경기, 내 투수 피칭 차례인데 타석에 교감 선생님이 비장한 얼굴로 다리를 털고 들어서셨습니다. 현재 2사 만루 상황입니다. 여기서 강력한 커브 강속구를 던져 삼진을 잡으면 경기 승률은 오르나 교감의 얼굴에 그늘이 질 것 같고, 홈런용 느린 배팅볼을 던져주면 부장들의 야유가 쏟아질 대고뇌의 투구 순간입니다. 어떤 피칭을 던지시겠습니까?',
    weight: 100,
    tags: ['친목발야구', '만루상황', '교감타석'],
    choices: [
      {
        id: 'choice_funny_admin_28_1',
        text: '누구나 걷어차기 편한 한가운데 5km짜리 대포알 무회전 풍선 배팅볼을 얌전하게 굴려 드려 교감의 만루 홈런 포문을 가동한다. (adminTrust +20, colleagueRelation +10, hp +5)',
        intent: '만루 홈런용 배팅볼 헌정',
        immediateEffects: [
          { stat: 'adminTrust', value: 20 },
          { stat: 'colleagueRelation', value: 10 },
          { stat: 'hp', value: 5 }
        ],
        resultText: '교감 선생님의 킥으로 발사된 공이 운동장 펜스를 크게 넘는 만루 대홈런을 기록했습니다! 교감 선생님은 기뻐서 운동장을 춤추며 도셨고 저녁에 삼겹살 한 판을 테이블 전체에 쏘셨습니다.'
      },
      {
        id: 'choice_funny_admin_28_2',
        text: '스포츠맨십의 엄정함을 지키기 위해 강속구 체인지업 슬라이더를 굴려 무참히 삼진 아웃으로 복귀시킨다. (expert +18, 멘탈 +12, adminTrust -5)',
        intent: '엄정 삼진 아웃 피칭',
        immediateEffects: [
          { stat: 'expert', value: 18 },
          { stat: 'mental', value: 12 },
          { stat: 'adminTrust', value: -5 }
        ],
        resultText: '완벽한 삼진으로 팀을 위기에서 구해내 동료들의 극찬 헹가래를 받았습니다. 교감 선생님은 벤치에서 홀로 매실차를 들이켜셨습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_admin_29',
    dayRange: [1, 30],
    title: '교장 선생님의 학교 홈페이지 프로필 눈포샵 요구',
    category: 'admin',
    situation: '교무실 내 책상',
    narratorText: '학교 홈페이지에 교직원 프로필 단체 사진을 올려야 하는데, 교장 선생님이 사진 파일을 들고 찾아와 수줍게 속삭이십니다. "김 선생, 내 눈이 너무 매섭게 나왔어. 보정 툴로 눈 크기를 1.5배로 키우고 턱을 보들보들한 20대 아이돌 턱으로 깎아줄 수 있겠나? 학부모들이 보기에 온화하고 앙증맞아 보여야 하니까 말일세." 포토샵 보정 요청입니다. 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['프로필보정', '포토샵요청', '아이돌턱교장'],
    choices: [
      {
        id: 'choice_funny_admin_29_1',
        text: '즉시 이미지 보정 앱을 켜서 눈망울에 별빛 광원을 칠하고 볼살을 갸름한 K팝 보이그룹 멤버처럼 깎아 초호화 뷰티 필터 단체 보정을 완료한다. (adminTrust +20, expert +10, hp -5)',
        intent: 'K팝보이그룹형 필터 보정',
        immediateEffects: [
          { stat: 'adminTrust', value: 20 },
          { stat: 'expert', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '홈페이지에 사진이 올라가자 학부모님들 사이에서 "교장 선생님 얼굴에 꽃이 피었다"며 온화한 미청년 교장으로 큰 찬사 루머가 돌아 교장 선생님의 충성도 스탯이 대폭 승천했습니다.'
      },
      {
        id: 'choice_funny_admin_29_2',
        text: '정식 프로필용 사진의 과도한 왜곡은 교육청 실물 신원 대조 규정에 어긋나므로 표준 조명 보정만 미세 적용해 품위를 지킨다. (expert +15, adminTrust +10)',
        intent: '표준 조명 보정 사수',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'adminTrust', value: 10 }
        ],
        resultText: '실물과 어긋나지 않는 단정하고 우아한 프로필 사진이 승인되어 지적이고 정직한 교직 프로필 규격을 수호했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_admin_30',
    dayRange: [1, 30],
    title: '교장실 화단 가을 국화 남동쪽 45도 배치 전우애',
    category: 'admin',
    situation: '학교 정원 화단',
    narratorText: '가을을 맞아 학교 교문 정원 화단에 국화꽃 화분 50개가 트럭으로 배달되었습니다. 교장 선생님이 화분들을 정렬하시며 나를 소환하십니다. "김 선생! 국화 꽃망울의 방향이 정확히 남동쪽 45도 각도를 바라보며 일렬로 서야 광합성이 극대화되고 학교 풍수지리상 교육운이 뿜어져 나오지. 자, 각도 조율에 동참하세!" 어떻게 국화 꽃잎 방향을 조율하시겠습니까?',
    weight: 100,
    tags: ['화단정리', '가을국화', '풍수지리'],
    choices: [
      {
        id: 'choice_funny_admin_30_1',
        text: '나침반 앱을 켜서 남동쪽 45도 방향을 조준하고 국화 화분 50개의 꽃잎 각도를 1도 오차 없이 일렬로 칼정렬해 배치 완료한다. (adminTrust +20, hp -15, burnout +10)',
        intent: '나침반 국화 칼정렬',
        immediateEffects: [
          { stat: 'adminTrust', value: 20 },
          { stat: 'hp', value: -15 },
          { stat: 'burnout', value: 10 }
        ],
        resultText: '꽃잎들이 남동쪽을 향해 완벽하게 각 맞춰 서자, 교장 선생님은 "김 선생의 손끝에서 가을의 기적이 연출되었군!"이라며 대만족하시고 학교 가을 숲 연찬회 우수 추진 교사로 임명해주셨습니다.'
      },
      {
        id: 'choice_funny_admin_30_2',
        text: '"화분 배치는 전문 조경 업체 계약 기안의 실무 범위에 해당하오니, 행정망을 통해 안전 조경팀 출장 수배를 넣겠다"고 딜한다. (expert +15, adminPower +10)',
        intent: '조경 수배 행정망 처리',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'adminPower', value: 10 }
        ],
        resultText: '조경 업체의 즉각적인 조치로 화단이 완벽하게 가을 정원으로 데코레이션 완료되었습니다. 불필요한 노역 없이 학교 미화를 사수했습니다.'
      }
    ]
  }
];
