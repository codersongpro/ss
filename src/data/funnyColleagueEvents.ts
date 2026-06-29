import type { GameEvent } from '@/game/types';

// ==================== [동료교사 카테고리 유머 밈 이벤트 30선] ====================
export const funnyColleagueEvents: GameEvent[] = [
  {
    id: 'evt_funny_colleague_01',
    dayRange: [1, 30],
    title: '교내 메신저 귓속말 오배송 대참사',
    category: 'colleague',
    situation: '교무실',
    narratorText: '교무 부장님이 회의 시간에 30분째 옛날 썰을 풀고 계십니다. 동료 교사에게 "부장님 오늘도 브레이크 고장 났다 ㅠㅠ 퇴근 다 했네"라고 귓속말을 보낸다는 것이, 그만 마우스 클릭 실수로 교무 부장님 당사자에게 다이렉트 귓속말로 전송해 버렸습니다! 부장님의 모니터가 번쩍이고, 부장님이 안경을 고쳐 쓰십니다. 어떻게 수습하시겠습니까?',
    weight: 100,
    tags: ['메신저실수', '귓속말오폭', '교무부장님'],
    choices: [
      {
        id: 'choice_funny_colleague_01_1',
        text: '빛의 속도로 달려가 "부장님의 열정적인 교육 철학 썰(Soul)을 혼자만 듣기 아까워 교무실 전체에 브레이크 없이(?) 공유하자는 찬사였습니다!"라고 아부한다.',
        intent: '현란한 아부 수습',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'mental', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '부장님은 껄껄 웃으시며 "역시 내 교육 열정을 알아주는군!"이라며 오히려 좋아하셨고 회의를 신속히 끝내주셨습니다.'
      },
      {
        id: 'choice_funny_colleague_01_2',
        text: '정직하게 기술적 메신저 키보드 오작동 에러임을 실토하고 정중하게 고개 숙여 사과한다.',
        intent: '정직한 사실 고백',
        immediateEffects: [
          { stat: 'expert', value: 12 },
          { stat: 'mental', value: -5 },
          { stat: 'colleagueRelation', value: 5 }
        ],
        resultText: '부장님은 다소 씁쓸한 미소를 지으시며 "허허 컴퓨터가 낡았구만" 하고 넘어가 주셨습니다. 아찔한 순간이었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_colleague_02',
    dayRange: [1, 30],
    title: '교무실 냉장고 부장님 한과 쟁탈전',
    category: 'colleague',
    situation: '교무실 탕비실',
    narratorText: '당이 떨어져 교무실 공용 냉장고를 뒤지던 중, 은박지에 정성스럽게 싸여 있는 명품 개성 약과 세트를 발견했습니다. 배고픔에 눈이 멀어 2개를 덥석 집어 먹었는데, 은박지 뒤쪽에 작은 글씨로 "교무부장 개인 간식 - 손대면 사문서 위조죄 적용함"이라고 적힌 포스트잇을 발견했습니다! 부장님이 탕비실 문을 열고 들어오십니다. 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['냉장고도둑', '약과도난', '교무실간식'],
    choices: [
      {
        id: 'choice_funny_colleague_02_1',
        text: '입가에 묻은 약과 가루를 털어내며 "너무 맛있어서 영혼을 빼앗겼습니다. 퇴근 길에 꿀약과 한 상자 사서 냉장고에 보충해 놓겠습니다!"라고 이실직고한다.',
        intent: '솔직한 자백 및 보상 약속',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'hp', value: -5 },
          { stat: 'mental', value: 10 }
        ],
        resultText: '부장님은 "오 역시 미식가구만!"이라며 허허 웃으셨고, 오히려 약과 2개를 더 쥐여주셨습니다. 훈훈한 간식 동맹이 결성되었습니다.'
      },
      {
        id: 'choice_funny_colleague_02_2',
        text: '옆에 있던 체육 선생님을 가리키며 "아까 체육 쌤이 탕비실에 침입하시는 것을 얼핏 본 것 같습니다..."라며 은밀하게 물타기를 시도한다.',
        intent: '타인 용의자 지목 물타기',
        immediateEffects: [
          { stat: 'interpersonal', value: -5 },
          { stat: 'colleagueRelation', value: -10 },
          { stat: 'mental', value: 5 }
        ],
        resultText: '부장님은 의혹을 품고 체육 선생님의 자리로 향하셨고, 비밀은 지켰으나 동료 교사 관계 스탯에 먹구름이 꼈습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_colleague_03',
    dayRange: [1, 30],
    title: '연수 시간 침 흘림 수호자',
    category: 'colleague',
    situation: '시청각실',
    narratorText: '지루하기 짝이 없는 안전 보건 의무 교육 연수 시간, 시청각실 맨 뒷자리에서 옆자리의 4년 차 영어 선생님이 고개를 뒤로 꺾고 입을 벌린 채 단잠에 빠져들었습니다. 턱밑으로 침이 한 방울 떨어지기 직전, 저 멀리 복도에서 교감 선생님이 시찰을 위해 눈을 부릅뜨고 시청각실 문으로 다가오고 계십니다! 어떻게 구출하시겠습니까?',
    weight: 100,
    tags: ['의무연수', '취침수호', '교감시찰'],
    choices: [
      {
        id: 'choice_funny_colleague_03_1',
        text: '팔꿈치로 옆구리를 세게 툭 쳐서 깨우고, 내 교재를 그 선생님 이마 위에 덮어주어 열공하는 척 연출한다.',
        intent: '신속한 동료 구출',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'mental', value: 10 },
          { stat: 'expert', value: 5 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '영어 선생님은 흠칫 깨어나 침을 닦고 교과서를 읽는 척했고, 교감 선생님은 흐뭇한 미소를 지으며 지나가셨습니다. 전우애가 싹텄습니다.'
      },
      {
        id: 'choice_funny_colleague_03_2',
        text: '교감 선생님의 시선을 돌리기 위해 손을 번쩍 들고 "강사님! 심폐소생술 압박 깊이에 대해 질문이 있습니다!"라고 우렁차게 질문을 던진다.',
        intent: '지적 질문으로 미끼 역할',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'colleagueRelation', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '시청각실 전체의 이목이 나에게 쏠리는 사이 영어 선생님이 안전하게 잠에서 깨어났습니다. 명석한 질문 능력으로 전문성도 부각되었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_colleague_04',
    dayRange: [1, 30],
    title: '체육 부장의 주말 등산 동호회 납치극',
    category: 'colleague',
    situation: '교무실',
    narratorText: '근육질의 체육 부장님이 등산용 지팡이를 교탁에 탁 걸치며 다가오십니다. "선생님, 이번 주말에 소백산 종주 친목 등산회가 있습니다. 강제성은 1도 없고, 오직 맑은 공기와 한우 곱창 뒷풀이가 있는 힐링 소풍이죠. 자, 여기 참가 서명 대장인데 당연히 가는 걸로 알고 이름 쓰겠습니다?" 눈빛이 갈구하고 있습니다. 어떻게 거절 혹은 수락하시겠습니까?',
    weight: 100,
    tags: ['주말등산', '체육부장님', '자율참석'],
    choices: [
      {
        id: 'choice_funny_colleague_04_1',
        text: '"주말에 마침 무릎 슬개골 연골 연화증 치료 물리치료가 예약되어 있습니다"라며 아쉬운 척 무릎을 짚고 거절한다.',
        intent: '의학적 핑계 거절',
        immediateEffects: [
          { stat: 'mental', value: 15 },
          { stat: 'hp', value: 10 },
          { stat: 'colleagueRelation', value: -5 }
        ],
        resultText: '체육 부장님은 "에고 관절이 벌써 상했군!"이라며 짠해하셨고, 주말의 소중한 혼자만의 자유 시간을 완벽하게 지켜냈습니다.'
      },
      {
        id: 'choice_funny_colleague_04_2',
        text: '"산사나이 체육 부장님을 따라 산의 정기를 받아오겠습니다!"라며 기분 좋게 신청서에 서명한다.',
        intent: '조직 융화형 등산 동참',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 20 },
          { stat: 'hp', value: -15 },
          { stat: 'burnout', value: 10 }
        ],
        resultText: '주말에 네 발로 기어 산을 등반하느라 허벅지가 터질 것 같았으나, 회식 자리에서 부장님의 특급 파트너로 인정받아 친목이 대폭 올랐습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_colleague_05',
    dayRange: [1, 30],
    title: '교무실 원두커피 머신 청소 스파이 게임',
    category: 'colleague',
    situation: '교무실 탕비실',
    narratorText: '교무실 공용 에스프레소 커피 머신 액정에 빨간 글씨로 [내부 세척 및 원두 찌꺼기 비우기 필수] 경고등이 떴습니다. 이 머신을 청소하려면 필터를 분해하고 물때를 닦아야 해서 최소 10분이 걸립니다. 교사들이 에스프레소를 마시고 싶어 하면서도 누구 하나 경고등을 해결하지 않고 먼발치서 눈치만 보고 있습니다. 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['커피머신', '눈치싸움', '탕비실청소'],
    choices: [
      {
        id: 'choice_funny_colleague_05_1',
        text: '팔을 걷어붙이고 10분 동안 구석구석 완벽하게 물때를 닦아내고 원두 찌꺼기를 비워 쾌적하게 셋팅해 둔다.',
        intent: '희생적 청소 솔선수범',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'hp', value: -5 },
          { stat: 'colleagueSolidarity', value: 10 }
        ],
        resultText: '커피를 마시러 온 선생님들이 "우와 누가 닦아놨어? 은인이다!"라며 감격하셨고, 오후에 고마움의 뜻으로 샌드위치가 책상 위에 배달되었습니다.'
      },
      {
        id: 'choice_funny_colleague_05_2',
        text: '경고등을 슬쩍 보고는 믹스커피 포트를 끓여 노란 봉지 믹스커피를 타 마시며 눈치 게임에서 조용히 탈출한다.',
        intent: '믹스커피 우회 전술',
        immediateEffects: [
          { stat: 'mental', value: 10 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '노란 믹스의 달달함이 스트레스를 날려주었습니다. 커피 머신은 결국 오후에 교무 부장님이 투덜대며 청소하셨습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_colleague_06',
    dayRange: [1, 30],
    title: '회식 3차 노래방 탬버린 탈출 지휘관',
    category: 'colleague',
    situation: '노래방 대기실',
    narratorText: '학교 친목 공식 회식 날, 2차 삼겹살을 마치고 마침내 3차 백두산 노래방 입구에 도달했습니다. 시계는 이미 밤 10시를 가리키고 있는데, 음악 부장님이 "교장 선생님 18번 트로트 반주에 맞춰 탬버린 흔들 신규 교사들 어디 갔어!"라며 끌고 들어가려 하십니다. 이때 어떻게 탈출하시겠습니까?',
    weight: 100,
    tags: ['회식3차', '탬버린기사', '탈출작전'],
    choices: [
      {
        id: 'choice_funny_colleague_06_1',
        text: '택시 호출 화면을 보여주며 "아차, 아내가 문간에 빗자루를 들고 서 있다는 연락이 와서 내무부장관 결재 서류 처리를 위해 먼저 가보겠습니다"라며 코믹하게 빠져나간다.',
        intent: '가정 핑계 유머 탈출',
        immediateEffects: [
          { stat: 'mental', value: 15 },
          { stat: 'hp', value: 10 },
          { stat: 'colleagueRelation', value: -5 }
        ],
        resultText: '부장님들은 "하하, 내무부장관님 결재는 어쩔 수 없지!"라며 웃으며 보내주셨습니다. 집에서 온전히 꿀잠을 잤습니다.'
      },
      {
        id: 'choice_funny_colleague_06_2',
        text: '탬버린 두 개를 양손에 쥐고 현란한 엇박자 탬버린 롤링을 시전하여 교장 선생님의 무대를 콘서트 홀로 메이킹한다.',
        intent: '무대 예술 동참형 올인',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 20 },
          { stat: 'hp', value: -15 },
          { stat: 'burnout', value: 12 }
        ],
        resultText: '교장 선생님은 "자네 박자감이 예사롭지 않군!"이라며 칭찬하셨고, 다음날 학교 등교길에 교장실로 불려가 프리미엄 건강 녹용 음료를 대접받았습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_colleague_07',
    dayRange: [1, 30],
    title: '부장 교사의 기계식 독수리 타자 결재 건의',
    category: 'colleague',
    situation: '교무실 내 자리',
    narratorText: '학교 교육 계획서 입력 기한 전날, 옆 자리의 정년 퇴임을 2년 앞두신 부장 교사님이 돋보기안경을 쓰시고 손가락 두 개로 키보드를 기계식 타자기 치듯 독수리 타법으로 두드리고 계십니다. 그리곤 한숨을 푹 쉬며 커피 캔을 내미십니다. "김 선생, 내가 품의 기안 올리는 엑셀 파일 표가 다 깨져 버렸는데 결재 좀 대신 만져주면 안 될까?" 어떻게 도와드릴까요?',
    weight: 100,
    tags: ['독수리타법', '품의기안', '부장님구출'],
    choices: [
      {
        id: 'choice_funny_colleague_07_1',
        text: '친절하게 부장님 컴퓨터 앞에 앉아 깨진 표 라인을 바로잡고 기안 입력 팁을 원클릭 매크로 형식으로 셋팅해 드린다.',
        intent: '실무 기술 기부 및 훈훈 조력',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'expert', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '부장님은 "역시 젊은 선생들이 컴퓨터 천재야!"라며 감격하셨고, 매점 갈 때마다 주머니에 단팥빵과 초코우유를 꽂아 주시기 시작했습니다.'
      },
      {
        id: 'choice_funny_colleague_07_2',
        text: '행정실 공식 공문 작성 가이드북 피디에프 파일을 바탕화면에 깔아 드리고 스스로 입력하시도록 조언한다.',
        intent: '자립심 유도 가이드 전달',
        immediateEffects: [
          { stat: 'expert', value: 12 },
          { stat: 'colleagueRelation', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '부장님은 안경을 고쳐 쓰며 가이드를 읽고 스스로 입력하셨습니다. 시간은 다소 걸렸으나 업무 자립도가 높아졌습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_colleague_08',
    dayRange: [1, 30],
    title: '아리송한 청첩장의 3만원 vs 5만원 배틀',
    category: 'colleague',
    situation: '교무실 내 책상',
    narratorText: '교무실 우편함에 다른 학년 교과 선생님의 청첩장이 꽂혀 있었습니다. 한 학기 동안 오가며 가벼운 목인사만 나누었던 서먹한 관계입니다. 축의금 봉투를 준비해야 하는데, 3만 원을 넣자니 다소 성의 없어 보이고 5만 원을 넣자니 다음 달 지갑 사정이 얇아져 깊은 고뇌에 빠졌습니다. 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['경조사비', '축의금고민', '스마트생활'],
    choices: [
      {
        id: 'choice_funny_colleague_08_1',
        text: '동료들과 금액을 5만 원으로 통일하여 내고, 주말 식장에 참석하여 갈비탕 식사를 푸짐하게 완식하여 본전을 뽑는다.',
        intent: '동료 연대감 통일 및 식사 참가',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 12 },
          { stat: 'hp', value: 5 },
          { stat: 'mental', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '동료들과 우정을 다지며 맛있는 뷔페를 먹어 스트레스가 풀렸습니다. 경조사 예절을 깔끔하게 치러냈습니다.'
      },
      {
        id: 'choice_funny_colleague_08_2',
        text: '3만 원을 봉투에 넣고 조용히 봉투만 전달한 뒤 주말에는 온전한 개인 홈 힐링(집순이/집돌이)을 택한다.',
        intent: '미니멀 실속 경조사',
        immediateEffects: [
          { stat: 'mental', value: 15 },
          { stat: 'hp', value: 10 },
          { stat: 'colleagueRelation', value: 5 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '경제적 지출을 최소화하고 주말 동안 이불 속에서 뒹굴거리며 체력을 대폭 완벽 회복해 냈습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_colleague_09',
    dayRange: [1, 30],
    title: '급식실 영양사님 친절 민원 협상',
    category: 'colleague',
    situation: '급식실 배식대',
    narratorText: '오늘 급식 메뉴로 바삭바삭한 수제 등심 돈가스가 나왔습니다. 내 배식 차례에 돈가스 조각이 다소 작은 조각 1개만 얹어졌습니다. 뒤에는 대기 줄이 길게 늘어서 있고 배식 담당 영양사님의 눈빛이 바빠 보입니다. 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['급식협상', '돈가스조각', '영양사님'],
    choices: [
      {
        id: 'choice_funny_colleague_09_1',
        text: '"영양사님! 오늘 돈가스 튀김 상태가 호텔 미슐랭급 예술이네요!"라며 화사한 꽃미소 칭찬을 건네며 슬쩍 식판을 내민다.',
        intent: '칭찬 기반 추가 배식 획득',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'hp', value: 10 },
          { stat: 'mental', value: 10 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '영양사님은 광대가 승천하시며 "어머 김 선생, 돈가스 큰 조각으로 하나 더 먹어!"라며 왕돈가스 크기를 투척해 주셨습니다. 포만감이 가득 찼습니다.'
      },
      {
        id: 'choice_funny_colleague_09_2',
        text: '배식 기준 수량을 묵묵히 준수하며 작은 돈가스 조각에 만족하고 남들 눈치 없이 식사 자리로 이동한다.',
        intent: '공평 배식 룰 준수',
        immediateEffects: [
          { stat: 'expert', value: 10 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '뒤에 서 있던 남학생들의 배식 돈가스 수량이 넉넉하게 돌아갔습니다. 모범적인 교육자 상을 유지했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_colleague_10',
    dayRange: [1, 30],
    title: '친목 배드민턴 타짜 부장들의 스매싱',
    category: 'colleague',
    situation: '강당',
    narratorText: '수요일 방과 후 친목 체육 배드민턴 동호회 시간, 분명 "초보 환영 힐링 랠리"라고 홍보해 놓고 부장 선생님들이 전문 운동선수용 무릎 아대와 고급 요넥스 라켓을 쥐고 눈에 핏발을 세우고 계십니다. 서브를 넣자마자 머리 위로 시속 200km짜리 광속 스매싱이 날아왔습니다! 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['체육동호회', '배드민턴', '광속스매싱'],
    choices: [
      {
        id: 'choice_funny_colleague_10_1',
        text: '부장님들의 강력한 실력을 과장되게 칭찬하며 공 줍기 셔틀 자원봉사 및 리액션 담당으로 역할을 전환한다.',
        intent: '아부형 리액션 요원',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'mental', value: 10 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '부장님들은 스매싱할 때마다 "아자! 나이스 샷!"을 외치는 내 모습에 흡족해하시며 회식 자리에서 삼겹살 쌈을 먹여주셨습니다.'
      },
      {
        id: 'choice_funny_colleague_10_2',
        text: '체력 소모를 각오하고 전신 슬라이딩을 감행하여 셔틀콕을 기필코 받아 넘기는 혼신의 배틀을 벌인다.',
        intent: '스포츠맨십 올인 투혼',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 20 },
          { stat: 'hp', value: -15 },
          { stat: 'burnout', value: 10 }
        ],
        resultText: '기적적으로 1점을 따내자 강당 전체가 환호의 도가니가 되었습니다. 온몸에 근육통이 왔으나 열정 넘치는 교사로 각인되었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_colleague_11',
    dayRange: [1, 30],
    title: '인쇄기 고장 범인의 은폐 비밀 동맹',
    category: 'colleague',
    situation: '교무실 인쇄실',
    narratorText: '수업 직전 시험지 인쇄를 위해 인쇄실에 들어갔는데, 옆 반 수학 선생님이 복합기 내부를 열어놓고 잔뜩 사색이 되어 계십니다. 에이포 용지가 내부 롤러에 뱀처럼 꼬여서 복합기에서 모락모락 탄내가 나는 상태입니다. 수학 쌤이 애처롭게 바라보며 속삭입니다. "선생님... 이거 제가 한 거 비밀로 해주시면 안 될까요? 지금 부장님이 아시면 전 죽음입니다 ㅠㅠ" 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['복합기고장', '인쇄실대피', '비밀동맹'],
    choices: [
      {
        id: 'choice_funny_colleague_11_1',
        text: '조용히 다가가 복합기 롤러 수동 핀셋을 쥐고 함께 종이를 조심스레 잡아당겨 찢어내고 찌꺼기를 안전하게 제거 수리해 준다.',
        intent: '실무적 비밀 수리 공조',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'expert', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '기계 조작 솜씨로 꼬인 종이를 무사히 빼냈습니다. 수학 선생님은 눈물을 글썽이며 내 몫의 인쇄물까지 직접 돌려주겠다고 맹세하셨습니다.'
      },
      {
        id: 'choice_funny_colleague_11_2',
        text: '공식 고장 접수를 행정실에 신속하게 대리 등록해 주며, 수학 쌤의 과실을 감추고 공공 기계 노후화 오작동으로 처리되게 돕는다.',
        intent: '행정실 이관 및 은폐 공조',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 12 },
          { stat: 'expert', value: 5 },
          { stat: 'mental', value: 10 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '행정실 주무관님이 신속히 와서 교체 수리해 주셨습니다. 수학 선생님의 자존심과 프라이버시가 안전하게 수호되었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_colleague_12',
    dayRange: [1, 30],
    title: '지옥의 친목 독서 동아리 독후감 폭격',
    category: 'colleague',
    situation: '교무실',
    narratorText: '친목 도모를 위해 가입한 교사 연대 독서 클럽 첫 모임, 가벼운 에세이인 줄 알았더니 역사 부장님이 두께 700페이지짜리 [총, 균, 쇠]와 [사피엔스] 완독본을 들이미십니다. 그리곤 "다음 주 수요일까지 개인별 A4 3장 분량의 요약 독후감 쪽지를 메신저로 선착순 제출입니다!"라고 웃으며 선언하셨습니다. 어떻게 탈출하시겠습니까?',
    weight: 100,
    tags: ['독서동아리', '독후감폭탄', '사피엔스'],
    choices: [
      {
        id: 'choice_funny_colleague_12_1',
        text: '유튜브나 도서 요약 앱을 가동해 10분짜리 요약본 내용을 바탕으로 그럴듯한 서평 문장 10줄을 재치 있게 조합해 제출한다.',
        intent: '영리한 도서 요약 활용',
        immediateEffects: [
          { stat: 'expert', value: 12 },
          { stat: 'mental', value: 10 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '역사 부장님은 "오! 문명의 통찰이 예리하구만!"이라며 칭찬하셨고 서평 베스트 교사로 선정되었습니다. 실속과 체력을 다 챙겼습니다.'
      },
      {
        id: 'choice_funny_colleague_12_2',
        text: '정직하게 밤을 새워 700페이지를 읽으며 줄치고 독서노트를 성실히 작성하여 교육 연구용으로 제출한다.',
        intent: '학술적 정공법 완독',
        immediateEffects: [
          { stat: 'expert', value: 18 },
          { stat: 'hp', value: -15 },
          { stat: 'burnout', value: 12 }
        ],
        resultText: '코밑이 거뭇해졌으나 인문학적 깊이가 남다른 교사로 인정받아 학급 국어 독서 토론 수업 자료로 유용하게 연계 활용되었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_colleague_13',
    dayRange: [1, 30],
    title: '행정실 주무관님과의 여비 품의 딜레마',
    category: 'colleague',
    situation: '행정실',
    narratorText: '지난주 출장 여비 2만 원을 청구했는데 행정실 주무관님으로부터 메신저가 왔습니다. "김 선생님, 출장 복명서 첨부 파일에 영수증 도장이 0.1mm 삐뚤어졌고 관외 교통비 산출 방식에 가솔린 기준 단가가 누락되어 기안이 반려되었습니다. 행정실로 내려오셔서 소명해 주세요." 귀찮은 행정 규정 반려 사태입니다. 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['행정실', '품의반려', '출장여비'],
    choices: [
      {
        id: 'choice_funny_colleague_13_1',
        text: '비타민 음료 한 병을 들고 행정실로 내려가 눈웃음과 함께 "주무관님의 철저하고 명석한 예산 감시 덕에 나라 지갑이 튼튼합니다!"라며 넉살스럽게 딜한다.',
        intent: '음료 공세 및 넉살 딜',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'mental', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '주무관님은 "어머 김 선생님도 참!"이라며 수줍어하시더니, 자리에서 엑셀 서식을 직접 수정해 주시며 즉각 결재 통과 처리를 완료해 주셨습니다.'
      },
      {
        id: 'choice_funny_colleague_13_2',
        text: '규정집을 꼼꼼히 대조하며 한 치의 오차도 없는 표준 주행 연비 산출 수식으로 문서를 정식 재기안한다.',
        intent: '완벽한 정석 행정 처리',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'hp', value: -10 },
          { stat: 'burnout', value: 5 }
        ],
        resultText: '주무관님도 감탄할 만큼의 완벽한 예산 기안 양식이 통과되었습니다. 행정 역량에 기여했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_colleague_14',
    dayRange: [1, 30],
    title: '교무실 에어컨 온도 리모컨 전쟁',
    category: 'colleague',
    situation: '교무실 에어컨 밑',
    narratorText: '한여름 교무실, 체육 수업을 마치고 온 땀 범벅 체육 선생님은 리모컨을 들고 에어컨 온도를 터보 냉방 18도로 난사합니다. 잠시 후, 옆자리 보건 선생님은 수족냉증으로 입술을 파르르 떨며 가디건을 싸매고 리모컨을 몰래 탈취해 온도를 희망온도 27도 미풍으로 올려놓습니다. 리모컨 쟁탈전 2라운드가 열리려 합니다. 어떻게 조율하시겠습니까?',
    weight: 100,
    tags: ['교무실온도', '에어컨전쟁', '리모컨탈취'],
    choices: [
      {
        id: 'choice_funny_colleague_14_1',
        text: '리모컨을 압수하여 공공 희망온도인 24도 제습 강풍으로 설정하고, 체육 쌤에겐 탁상 미풍 선풍기를, 보건 쌤에겐 꿀약차 핫팩을 선물한다.',
        intent: '솔로몬식 물리 중재',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'mental', value: 10 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '양측 모두 만족하는 24도 평화 조약이 성립되었습니다. 교무실 중재자의 권위가 한층 드높아졌습니다.'
      },
      {
        id: 'choice_funny_colleague_14_2',
        text: '에어컨 바람막이 가림판 설치 기안 공문을 행정실에 정식 품의하여 에어컨 사각지대 구조를 영구 개선한다.',
        intent: '기물 구조 개선 기안',
        immediateEffects: [
          { stat: 'expert', value: 12 },
          { stat: 'colleagueSolidarity', value: 10 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '바람 가림막 설치로 직바람이 차단되어 교무실 전체의 냉방 만족도가 평화롭게 영구 안착되었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_colleague_15',
    dayRange: [1, 30],
    title: '잔반 제로 운동 날의 식판 은폐 대작전',
    category: 'colleague',
    situation: '급식실 퇴식구',
    narratorText: '수요일은 잔반 없는 날입니다. 그런데 오늘 매운 낙지볶음 소스가 너무 매워 밥과 낙지를 식판 한 구석에 수북이 남겼습니다. 잔반 줄이기 어깨띠를 두르고 퇴식구 앞을 도끼눈을 뜨고 감시하시는 부장 선생님의 눈망울이 보입니다. 이 밥과 소스를 안 남긴 것처럼 어떻게 은폐 퇴출하시겠습니까?',
    weight: 100,
    tags: ['급식잔반', '잔반제로', '퇴식구은폐'],
    choices: [
      {
        id: 'choice_funny_colleague_15_1',
        text: '국그릇을 밥 위에 뒤집어엎어 빈 그릇처럼 보이게 하는 고난도 탑 쌓기 기술을 발휘해 뻔뻔하게 퇴식구를 통과한다.',
        intent: '식판 위장 위장술',
        immediateEffects: [
          { stat: 'mental', value: 12 },
          { stat: 'hp', value: 5 },
          { stat: 'colleagueRelation', value: -5 }
        ],
        resultText: '부장 선생님은 국그릇 탑만 보고 통과시켜 주셨습니다. 아슬아슬하게 매운 소스 잔반 버리기에 안착했습니다.'
      },
      {
        id: 'choice_funny_colleague_15_2',
        text: '정직하게 숟가락으로 남은 소스까지 매워 눈물을 흘리며 쓱쓱 다 비우고 당당히 확인 스탬프를 받는다.',
        intent: '성실한 완식 솔선수범',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'hp', value: -10 },
          { stat: 'colleagueRelation', value: 10 }
        ],
        resultText: '혀에 불이 날 것 같았으나 완식을 본 부장 선생님이 "오 역시 모범 교사야!"라며 감격하셨고 친목 도장이 올랐습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_colleague_16',
    dayRange: [1, 30],
    title: '비 새는 교실 옆 반 쌤의 방수 매트 의리',
    category: 'colleague',
    situation: '교실',
    narratorText: '폭우가 쏟아지는 오후, 3학년 우리 반 교실 사물함 뒤 천장에서 빗물이 뚝뚝 떨어져 바닥이 한강이 될 대위기가 찾아왔습니다. 다급히 물통을 놓는 나에게, 옆 반 2반 담임 선생님이 자신의 교실 캠핑용 대형 타포린 방수 매트와 미니 양동이 3개를 들고 땀을 뻘뻘 흘리며 달려오셨습니다. 어떻게 감사를 표하시겠습니까?',
    weight: 100,
    tags: ['우천누수', '방수매트', '옆반의리'],
    choices: [
      {
        id: 'choice_funny_colleague_16_1',
        text: '방수 타포린을 사물함 뒤에 함께 설치하고, 감사와 의리의 뜻으로 다음 날 달콤한 생초콜릿 크로플 상자를 책상 위에 배달한다.',
        intent: '디저트 답례 및 우정 돈독',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'mental', value: 10 },
          { stat: 'colleagueSolidarity', value: 15 },
          { stat: 'burnout', value: 5 }
        ],
        resultText: '2반 선생님은 크로플에 큰 에너지를 얻으셨고, 앞으로 학년 행사 때마다 서로의 교실에 보건/체육 꿀팁을 전수하는 의남매가 되었습니다.'
      },
      {
        id: 'choice_funny_colleague_16_2',
        text: '신속하게 행정실 시설관리 긴급 전화를 돌려 방수 공사 주무관님을 소환해 사태를 공적으로 해결한다.',
        intent: '신속한 공적 시설물 해결',
        immediateEffects: [
          { stat: 'expert', value: 12 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '행정실 방수 긴급 땜빵 작업으로 누수가 차단되었습니다. 옆 반 쌤에게는 감사 인사 톡을 성실히 보냈습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_colleague_17',
    dayRange: [1, 30],
    title: '교감 선생님 차 카풀 퇴근의 기묘한 침묵',
    category: 'colleague',
    situation: '교감선생님 차 조수석',
    narratorText: '퇴근하는 길에 교감 선생님께서 "김 선생, 마침 나랑 같은 동네 사는데 내 차 타고 편하게 퇴근하지!"라며 낚아채셨습니다. 에어컨 바람이 시원하게 불어나오는 고급 세단 조수석에 앉았으나, 차 문이 닫히자마자 라디오 소리조차 없는 묵직하고 기묘한 침묵의 공기가 차 안을 장악했습니다. 목적지까지 25분이 남았습니다. 어떻게 침묵을 깨시겠습니까?',
    weight: 100,
    tags: ['카풀퇴근', '교감선생님차', '기묘한침묵'],
    choices: [
      {
        id: 'choice_funny_colleague_17_1',
        text: '교감 선생님의 운전 실력과 차 내의 클래식 디퓨저 향이 고품격이라고 칭찬을 드린 뒤 교육부 최신 공문 이슈에 대한 고견을 묻는다.',
        intent: '고품격 업무 질문 대화 개시',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'mental', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '교감 선생님은 신이 나 25분 동안 쉬지 않고 교육 정책 강연을 펼치셨습니다. 귀는 다소 얼얼했으나 매우 신임받는 교사가 되었습니다.'
      },
      {
        id: 'choice_funny_colleague_17_2',
        text: '피곤함을 핑계로 "교감 선생님, 사실 오늘 수업 에너지를 다 쏟아서 목이 좀 잠겼습니다"라며 눈을 가볍게 감고 자는 척을 감행한다.',
        intent: '자는 척 침묵 고수',
        immediateEffects: [
          { stat: 'mental', value: 15 },
          { stat: 'hp', value: 10 },
          { stat: 'colleagueRelation', value: 5 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '교감 선생님은 라디오를 미풍으로 틀어 배려해 주셨고, 조용하고 아늑하게 집 근처 전철역에 도착해 에너지를 보존했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_colleague_18',
    dayRange: [1, 30],
    title: '친목 교사 밴드 탬버린 락스타 오디션',
    category: 'colleague',
    situation: '교무실',
    narratorText: '교내 친목 락 밴드 [그린 보드(Green Board)] 단원인 음악 부장님이 다가오십니다. "김 선생, 베이스 기타 세션이 비었는데 코인 노래방에서 락 발라드나 트로트 부른 인증 스크린샷 있으면 단원으로 즉각 영입하겠네! 주말 연습실 합류 어떤가?" 락스타(?) 오디션 제안입니다. 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['교사밴드', '베이스기타', '친목동호회'],
    choices: [
      {
        id: 'choice_funny_colleague_18_1',
        text: '"과거 대학 밴드 동아리 시절의 소울을 불태워 보겠습니다!"라며 밴드 가입 원서를 제출하고 주말 잼 세션에 참여한다.',
        intent: '락 스피릿 교사 밴드 가입',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 20 },
          { stat: 'hp', value: -15 },
          { stat: 'burnout', value: 10 }
        ],
        resultText: '주말 내내 일렉 베이스를 둥둥 치느라 지문이 닳아 없어지는 줄 알았으나, 축제 공연에서 폭발적인 인기를 끌며 교직원 연대감이 폭발했습니다.'
      },
      {
        id: 'choice_funny_colleague_18_2',
        text: '"저는 심각한 음치 박치라 악기 연주 시 헤드폰 볼륨이 터집니다"라며 대신 관객으로서 응원 도구(야광봉)를 지참해 가겠다고 딜한다.',
        intent: '특급 관객 서포터 딜',
        immediateEffects: [
          { stat: 'mental', value: 15 },
          { stat: 'hp', value: 5 },
          { stat: 'colleagueRelation', value: 10 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '합리적인 서포터 지원으로 밴드 멤버들과 유대감은 높이고 내 개인 주말 휴식 에너지는 성공적으로 사수했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_colleague_19',
    dayRange: [1, 30],
    title: '비대면 꿀 연수 수급 좌표의 은밀한 귓속말',
    category: 'colleague',
    situation: '교무실 복도',
    narratorText: '복도를 지나가는데 옆 반 베테랑 10년 차 지리 선생님이 나를 탕비실 구석으로 조용히 끌고 가 속삭입니다. "김 선생, 내일부터 신청하는 방학 연수 중에 대면 출석 없고 오직 줌(Zoom) 비대면 클릭에다 매주 한우 육포 세트 기부해 주는 특급 꿀 연수가 있어! 내일 아침 8시 59분에 신청 좌표 열리니까 선착순 준비해!" 은밀한 연수 정보 유출입니다. 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['비대면연수', '꿀팁유출', '선착순클릭'],
    choices: [
      {
        id: 'choice_funny_colleague_19_1',
        text: '아침 8시 58분에 노트북 시계를 켜놓고 네이비즘 서버 시간 대조 후 정각에 미친 광클로 연수 신청 수급에 골인한다.',
        intent: '광클릭 꿀연수 수령',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'mental', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '수강 신청 대성공! 방학 때 집에서 시원한 에어컨 쐬며 한우 육포를 뜯으며 온라인 자격증 연수를 들을 꿀 행운을 얻었습니다.'
      },
      {
        id: 'choice_funny_colleague_19_2',
        text: '아침 조회 시간이 겹쳐 수강 신청 타이밍을 놓치고 대신 다른 동료에게 정보를 더 뿌려 동료애를 올린다.',
        intent: '정보 공유 및 친목 확보',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'colleagueSolidarity', value: 12 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '나는 비록 실패했으나 내 꿀 정보로 성공한 다른 학년 선생님들이 감격하며 점심에 프리미엄 매콤 부대찌개를 사 주셨습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_colleague_20',
    dayRange: [1, 30],
    title: '민원 푸념 단톡방 관리자 포함 오폭',
    category: 'colleague',
    situation: '퇴근 후 카페',
    narratorText: '학부모 한 분의 무리한 요구로 멘탈이 나가 동료 교사 3명만 있는 단톡방에 "아니 오늘 영수 어머님 자꾸 숙제 검열 오라고 하시는데 진짜 탈모 올 것 같음 ㅠㅠ"이라고 보냈습니다. 그런데 핸드폰 진동이 미친 듯이 울려 확인해보니, 그 방이 아니라 교장/교감 선생님을 포함한 교직원 전체 메인 업무 공지 단톡방이었습니다! 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['단톡방오폭', '탈모하소연', '교장교감님'],
    choices: [
      {
        id: 'choice_funny_colleague_20_1',
        text: '1초 만에 메시지를 삭제하고, "방금 영수 어머님의 뜨거운 과제 교육 열의에 대해 감탄하며 동료 교사 연구방에 쓸 글이 오폭되었습니다. 교무 질서를 어지럽혀 송구합니다"라고 수습 문자를 올린다.',
        intent: '초고속 삭제 및 업무형 포장',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'colleagueRelation', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '교감 선생님은 단톡방에 "허허 역시 교육 연구에 몰두하는군! 탈모 조심하게"라며 격려 이모티콘을 남겨 훈훈하게 폭탄을 해체했습니다.'
      },
      {
        id: 'choice_funny_colleague_20_2',
        text: '멘붕이 와서 조용히 폰을 비행기 모드로 바꾸고 침대에 이불을 덮고 누워 깊은 현실 도피 잠을 청한다.',
        intent: '비행기모드 현실도피',
        immediateEffects: [
          { stat: 'mental', value: -10 },
          { stat: 'hp', value: 10 },
          { stat: 'burnout', value: 12 }
        ],
        resultText: '다음날 출근길 교무실 자리에 앉자 동료 교사들이 안타까운 얼굴로 바나나 우유를 밀어주었습니다. 이불킥은 하루 종일 이어졌습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_colleague_21',
    dayRange: [1, 30],
    title: '옆 반 꿀약과 비밀 탕수 간식 첩보전',
    category: 'colleague',
    situation: '교실 복도',
    narratorText: '2교시를 마치고 옆 반에 교재를 빌리러 갔는데, 옆 반 선생님이 교탁 맨 아래 첫 번째 비밀 서랍 속에서 갓 구운 달콤한 시나몬 약과와 고급 헤이즐넛 커피 팩을 꺼내 드시는 은밀한 간식 흡입 현장을 포착했습니다! 2반 선생님이 흠칫 놀라며 간식을 뒤로 숨깁니다. 어떻게 딜을 제안하시겠습니까?',
    weight: 100,
    tags: ['비밀간식', '약과첩보전', '물물교환'],
    choices: [
      {
        id: 'choice_funny_colleague_21_1',
        text: '내 주머니에 들어있던 최애 힐링 에너지바 2개와 매실 캔디 3개를 물물교환 카드로 내밀며 공동 간식 동맹을 제안한다.',
        intent: '포켓 간식 물물교환',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'hp', value: 5 },
          { stat: 'mental', value: 10 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '2반 선생님은 기뻐하며 약과 절반을 떼어 주셨고, 두 교실 교탁 비밀 서랍은 매일 간식이 채워지는 연합 간식 저장고가 되었습니다.'
      },
      {
        id: 'choice_funny_colleague_21_2',
        text: '간식은 보지 못한 척 예의 바르게 교재만 빌려 조용히 우리 반 교실로 복귀해 업무를 지속한다.',
        intent: '엄격한 선 긋기 및 교재 수급',
        immediateEffects: [
          { stat: 'expert', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '수업 준비용 도서를 안전하게 빌려 정규 3교시 수학 수업을 차분하고 완벽하게 개시해 냈습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_colleague_22',
    dayRange: [1, 30],
    title: '교무 부장님의 20년 전 훈화 개그 호응 쇼',
    category: 'colleague',
    situation: '교무실 회의실',
    narratorText: '주간 학년 협의회 시간, 학년 부장님이 "내가 말이야, 2002년 한일 월드컵 때 교문 앞에서 붉은악마 셔츠를 입고 애들 붉은악마 율동 지도를 했는데 말이야..."라며 10번째 들은 월드컵 전설을 늘어놓으십니다. 주변 베테랑 선생님들은 눈동자가 초점을 잃은 채 영혼 없는 미소를 짓고 있습니다. 어떻게 리액션을 감행하시겠습니까?',
    weight: 100,
    tags: ['월드컵개그', '부장님썰', '폭풍리액션'],
    choices: [
      {
        id: 'choice_funny_colleague_22_1',
        text: '양손으로 가상의 붉은악마 박수를 치며 "와! 부장님이 바로 그 4강 신화의 교내 숨은 주역이셨군요! 완전 소름 돋았습니다!"라고 격렬하게 춤추듯 리액션한다.',
        intent: '락스타급 격렬 리액션',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 20 },
          { stat: 'mental', value: 12 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '부장님은 얼굴이 붉어지며 "오 역시 김 선생이 역사를 아는구만!"이라며 매우 흡족해하시더니, 회의비 법인카드로 맛있는 점심 낙지덮밥을 특급 결제해주셨습니다.'
      },
      {
        id: 'choice_funny_colleague_22_2',
        text: '영혼 없는 차분한 목인사로 고개를 끄덕인 뒤 회의록 문서 대장에 회의 내용을 성실히 타이핑 정리한다.',
        intent: '회의록 작성 집중',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '회의록이 깔끔하게 행정망에 등록되었습니다. 부장님은 썰을 멈추고 공식 안건 논의로 서둘러 회의를 봉합하셨습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_colleague_23',
    dayRange: [1, 30],
    title: '동료 생일 선물 5천 원 송금 독촉 대작전',
    category: 'colleague',
    situation: '교무실 내 자리',
    narratorText: '친목계 총무를 맡은 미술 선생님이 쪽지를 보냈습니다. "선생님, 오늘 4반 선생님 생일 케이크랑 텀블러 선물용으로 친목회비 외에 개인별 5,000원씩 모금 중인데 김 선생님 송금만 아직 안 들어왔어요. 조속히 계좌로 쏴주세요!" 5천 원 깜빡 소동입니다. 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['친목모금', '생일선물', '5천원독촉'],
    choices: [
      {
        id: 'choice_funny_colleague_23_1',
        text: '즉시 모바일 앱을 켜서 계좌이체로 5,000원을 송금하고, 미술 쌤 자리에 귀여운 미니 젤리 한 봉지를 얹어주며 깜빡해서 미안하다고 전한다.',
        intent: '신속 송금 및 사과',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'hp', value: -5 },
          { stat: 'mental', value: 10 }
        ],
        resultText: '미술 선생님은 "에이 뭘 젤리까지 줘요!"라며 웃으셨고, 점심시간에 4반 쌤 생일 케이크 촛불 식사 자리에서 가장 앞줄에 앉아 기쁨을 나눴습니다.'
      },
      {
        id: 'choice_funny_colleague_23_2',
        text: '5,000원 송금 대신 지갑 속의 신사임당 5만 원권 현금을 건네며 "다음 달 친목 독서회 비용까지 통 크게 선납 처리해 달라"고 한다.',
        intent: '선납 딜 처리',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 12 },
          { stat: 'mental', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '총무 쌤은 장부 정리가 편해졌다며 대환영했습니다. 통 큰 교사 이미지로 쾌활하게 정리되었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_colleague_24',
    dayRange: [1, 30],
    title: '보건실 비밀 낮잠 연합 구축 사건',
    category: 'colleague',
    situation: '보건실 침대',
    narratorText: '5교시 공강 시간, 너무 피곤하여 보건 선생님께 양해를 구하고 보건실 안쪽 3번 침대 커튼을 치고 누웠습니다. 5분 뒤, 1번 침대 쪽에서 우렁차고 묵직한 코골이 소리가 뿜어져 나옵니다. 커튼 틈새로 보니 바로 교무 부장님이 눈가리개를 하시고 깊은 수면에 빠져 계십니다. 보건실 비밀 낮잠 연맹이 결성되는 순간입니다. 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['보건실낮잠', '교무부장님', '코골이소리'],
    choices: [
      {
        id: 'choice_funny_colleague_24_1',
        text: '부장님의 단잠을 깨우지 않도록 숨소리를 죽이고 커튼을 쳐 비밀을 엄수해 준 뒤 공강 시간이 끝날 때 조용히 퇴각한다.',
        intent: '비밀 엄수형 공조 낮잠',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'hp', value: 10 },
          { stat: 'mental', value: 10 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '부장님은 나중에 잠에서 깨어 "김 선생도 보건실 다녀갔다며? 교직이란 피곤한 법이지"라며 넌지시 동지애 어린 윙크를 보내오셨습니다.'
      },
      {
        id: 'choice_funny_colleague_24_2',
        text: '보건 선생님께 살짝 "부장님 코골이 가습기가 필요해 보입니다"라고 장난스레 조율하며 교무실 복귀용 차 한잔을 같이 마신다.',
        intent: '보건실 탕비실 대화',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 12 },
          { stat: 'colleagueSolidarity', value: 10 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '보건 선생님과의 비밀 탕비실 다과 대화로 스트레스가 풀렸고 교무실 내 보건 라인(?) 유대감이 공고해졌습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_colleague_25',
    dayRange: [1, 30],
    title: '영하 10도 교문 지도 핫팩 수혈의 눈빛',
    category: 'colleague',
    situation: '교문 앞',
    narratorText: '칼바람이 부는 영하 10도의 아침, 교문 등교 안전 지도를 서느라 온몸이 꽁꽁 얼어붙고 손가락 감각이 소실되었습니다. 입술을 벌벌 떨며 서 있는 나에게, 함께 당번인 6학년 체육 부장님이 씩 웃으시더니 자신의 주머니 속에 고이 간직하던 뜨끈뜨끈한 군용 대용량 핫팩을 양손에 쥐여주셨습니다. 어떻게 반응하시겠습니까?',
    weight: 100,
    tags: ['한파등교지도', '군용핫팩', '체육부장님'],
    choices: [
      {
        id: 'choice_funny_colleague_25_1',
        text: '뜨끈한 핫팩을 쥐고 눈물을 글썽이며 "부장님은 얼어붙은 교정에 따뜻한 등대 같은 존재이십니다!"라며 감사의 눈빛을 보낸다.',
        intent: '폭풍 감사 및 극찬 피드백',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 20 },
          { stat: 'hp', value: 10 },
          { stat: 'mental', value: 10 },
          { stat: 'burnout', value: 5 }
        ],
        resultText: '부장님은 가슴을 퉁퉁 치며 "이 정도 추위는 해병대 정신으로 껌이지!"라며 신이 나셨고, 교문 지도 시간이 훈훈한 수다 시간으로 채워졌습니다.'
      },
      {
        id: 'choice_funny_colleague_25_2',
        text: '핫팩의 든든한 화력에 힘입어 교문 앞 빙판길 안전 염화칼슘 뿌리기 작업을 자원하여 교문 앞 안전을 책임진다.',
        intent: '핫팩 파워 기반 안전 지도 솔선수범',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '교문 앞 빙판길이 완벽히 정비되어 학생들이 단 한 명도 미끄러지지 않고 등교를 완료했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_colleague_26',
    dayRange: [1, 30],
    title: '동료의 파격 뽀글 브로콜리 펌 칭찬 압박',
    category: 'colleague',
    situation: '교무실 커피 테이블',
    narratorText: '옆 반 3반 담임 선생님이 주말에 미용실에 다녀오셨는지, 머리를 앙드레 마티유 스타일의 파격적인 브로콜리 뽀글이 파마를 하고 출근하셨습니다. 그리곤 내 책상 앞으로 다가와 고개를 좌우로 흔들며 "김 선생님, 나 머리 볶았는데 어때요? 10년은 젊어 보이죠? 빨리 솔직하게 말해봐요!"라며 눈빛 레이저를 쏩니다. 어떻게 답하시겠습니까?',
    weight: 100,
    tags: ['뽀글이파마', '헤어스타일', '칭찬요청'],
    choices: [
      {
        id: 'choice_funny_colleague_26_1',
        text: '"와! 완전 런던 패션위크 런웨이 모델인 줄 알았습니다! 상큼함이 터져서 교실이 환해졌어요!"라고 리액션 폭발을 시전한다.',
        intent: '우주급 패션 리액션',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'mental', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '3반 선생님은 입꼬리가 찢어지시며 "역시 김 선생님이 안목이 있어!"라며 아주 기뻐하셨고 서랍 속 마카롱 세트를 기부해주셨습니다.'
      },
      {
        id: 'choice_funny_colleague_26_2',
        text: '"단정하고 활동성이 좋아서 아이들 급식 지도할 때 머리카락 흘러내릴 걱정은 제로겠네요"라며 극도로 실용적인 교육적 관점으로 답한다.',
        intent: '교육 실용적 칭찬',
        immediateEffects: [
          { stat: 'expert', value: 12 },
          { stat: 'colleagueRelation', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '3반 선생님은 묘하게 현실적인 피드백에 풋 웃음을 터뜨리며 다음 수업 교재 연구 회의 준비로 자리를 옮기셨습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_colleague_27',
    dayRange: [1, 30],
    title: '교무 부장님의 스마트폰 묶어보내기 족집게 과외',
    category: 'colleague',
    situation: '교무실 내 책상',
    narratorText: '교무 부장님이 핸드폰을 들고 잔뜩 화가 난 얼굴로 찾아오셨습니다. "김 선생, 스마트폰 카카오톡 사진을 30장 보냈더니 채팅방 알림 소리가 30번 띵동 띵동 울려 옆 반 쌤이 시끄럽다고 눈치를 주네. 이거 한 번에 조용히 묶어 보내는 꿀팁이 도대체 뭔가?" 스마트폰 활용 특강 요청입니다. 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['스마트폰과외', '카톡묶어보내기', '부장님구출'],
    choices: [
      {
        id: 'choice_funny_colleague_27_1',
        text: '부장님 폰을 직접 쥐어드리고 [사진 묶어보내기] 체크박스 위치를 크레파스로 그리듯 상세히 눌러 설명해 드리고 단축 버튼 설정을 셋팅해 드린다.',
        intent: '상세 IT 교육 기부',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'expert', value: 10 },
          { stat: 'mental', value: 10 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '부장님은 "와! 이게 바로 디지털 묶음의 기적이구만!"이라며 탄복하셨고, 다음 주 학년 예산 배정 회의에서 내 교실 학급 문구용품 예산을 최우선 배정해 주셨습니다.'
      },
      {
        id: 'choice_funny_colleague_27_2',
        text: '카카오톡 공식 고객센터 도움말 화면 링크를 메신저로 넌지시 전송하여 스스로 공부하시도록 가이드를 드린다.',
        intent: '고객센터 링크 활용',
        immediateEffects: [
          { stat: 'expert', value: 12 },
          { stat: 'colleagueRelation', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '부장님은 링크를 보며 혼자 연구해 마침내 성공하셨습니다. 약간 퉁명스러우시지만 성취감을 맛보셨습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_colleague_28',
    dayRange: [1, 30],
    title: '행정실 반려 공문 캔음료 구걸 작전',
    category: 'colleague',
    situation: '행정실 입구',
    narratorText: '학교 과학실 부품 수급을 위해 올린 예산 기안 품의가 행정실 주무관님 컴퓨터 선에서 "예산 항목 번호 오기 및 글자 폰트 규격 불일치" 사유로 무참히 반려되었습니다. 이대로면 기한 내에 과학 실험 도구를 살 수 없습니다. 행정실로 직접 가봐야 합니다. 어떻게 딜을 하시겠습니까?',
    weight: 100,
    tags: ['공문반려', '행정실방문', '커피뇌물'],
    choices: [
      {
        id: 'choice_funny_colleague_28_1',
        text: '주머니에 시원한 보리차 캔 2개를 넣고 행정실로 내려가 "주무관님의 칼 같은 공문 검수력 덕에 학교 예산이 낭비 없이 철저히 보존됩니다!"라며 기분 좋은 아부를 시전한다.',
        intent: '보리차 신속 아부 딜',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'mental', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '주무관님은 미소를 띠며 "김 선생님 성의를 봐서 이번만 제가 규격 폰트를 바로 수정해 드릴게요"라며 즉시 승인해주셨고 부품 조달이 무사히 진행되었습니다.'
      },
      {
        id: 'choice_funny_colleague_28_2',
        text: '정식 반려 사유 지침을 메모해 내 자리에 돌아와 공문 한 자 한 자 자와 각도를 맞추듯 완벽히 대조 수정해 재기안한다.',
        intent: '완벽한 서체 교정 재기안',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'hp', value: -10 },
          { stat: 'burnout', value: 5 }
        ],
        resultText: '행정실 주무관님도 토를 달지 못할 만큼의 교과서적인 완벽 공문이 승인되었습니다. 행정 공문 처리 스킬이 상승했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_colleague_29',
    dayRange: [1, 30],
    title: '첫 수업 공개 전날의 밤샘 데코 의리 연대',
    category: 'colleague',
    situation: '어두워진 교실',
    narratorText: '내일 아침은 학부모 참관 첫 공개 수업 날입니다. 교실 뒷판 환경 정리가 덜 끝나 긴장 속에 밤 8시가 넘도록 혼자 야근하며 환경 미화를 채우고 있었습니다. 눈가가 흐려지는 그때, 2반 담임 선생님과 체육 선생님이 피자 한 상자를 들고 "김 선생! 우리가 가위질이랑 칠판 글씨 쓰기 전담 마커들이다! 다 비켜라!"라며 교실 문을 차고 들어오셨습니다. 어떻게 감사를 표하시겠습니까?',
    weight: 100,
    tags: ['공개수업전날', '밤샘야근', '피자수혈'],
    choices: [
      {
        id: 'choice_funny_colleague_29_1',
        text: '피자를 함께 뜯어 먹으며 동료들의 폭풍 가위질 지원을 받아 30분 만에 화려하게 환경 정리를 완료하고, 다음 공개 수업 때 똑같이 도와주기로 약속한다.',
        intent: '피자 수혈 및 동료 야간 공조',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 20 },
          { stat: 'mental', value: 15 },
          { stat: 'colleagueSolidarity', value: 20 },
          { stat: 'burnout', value: 7 }
        ],
        resultText: '동료들의 빛의 속도 가위질 덕분에 교실이 갤러리 미술관처럼 예쁘게 꾸며졌고, 다음 날 학부모 공개 수업은 초대박 성공을 기록했습니다.'
      },
      {
        id: 'choice_funny_colleague_29_2',
        text: '동료들의 고생에 미안함을 느껴 "괜찮으니 피자만 맛있게 먹고 얼른 퇴근하라"며 서둘러 돌려보내고 혼자 야근을 마저 처리한다.',
        intent: '동료 부담 배제 배려',
        immediateEffects: [
          { stat: 'expert', value: 12 },
          { stat: 'hp', value: -10 },
          { stat: 'burnout', value: 8 }
        ],
        resultText: '피자 에너지를 얻어 혼자 2시간 더 작업해 정리를 마쳤습니다. 몸은 피곤했으나 스스로 끝마친 보람이 있었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_colleague_30',
    dayRange: [1, 30],
    title: '회식 자리의 마스터 셰프 한우 굽기 좌장',
    category: 'colleague',
    situation: '삼겹살 식당',
    narratorText: '학년 전체 친목 회식 삼겹살 식당, 집게를 잡은 체육 선생님이 고기를 태워 연기를 뿜어내자 교감 선생님이 헛기침을 하십니다. 이때 내 앞에 놓인 삼겹살 불판의 불 조절과 마늘 구이 타이밍 조율이 시급합니다. 집게를 탈취해 마스터 셰프급 솜씨를 부려야 할까요?',
    weight: 100,
    tags: ['친목회식', '고기굽기장인', '삼겹살협상'],
    choices: [
      {
        id: 'choice_funny_colleague_30_1',
        text: '집게를 과감히 쥐고 마늘과 고기를 겉바속촉 미디움 웰던 규격으로 구워 교감 선생님과 동료들의 식판에 조용히 얹어준다.',
        intent: '고기 굽기 신공 아부',
        successRate: 70,
        immediateEffects: [
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'hp', value: 5 },
          { stat: 'mental', value: 10 },
          { stat: 'burnout', value: 4 }
        ],
        successResultText: '교감 선생님은 노릇노릇한 삼겹살을 드시고 "음! 고기 굽는 솜씨를 보니 행정 공문 처리 솜씨도 명품이겠군!"이라며 대만족을 선언하셨습니다.',
        failEffects: [
          { stat: 'colleagueRelation', value: -10 },
          { stat: 'mental', value: -10 },
          { stat: 'hp', value: -5 }
        ],
        failResultText: '불판 화력 조절에 실패하여 삼겹살이 새까맣게 타며 유독 가스가 테이블을 지배했습니다. 교감 선생님이 연신 기침을 하시며 "김 선생은 펜대만 굴리는 게 낫겠군" 하고 핀잔을 주셨습니다. 분위기가 아찔해졌습니다.',
        resultText: '삼겹살 굽기 결과'
      },
      {
        id: 'choice_funny_colleague_30_2',
        text: '집게를 다른 동료에게 양보하고 얌전하게 상추에 고기를 싸 먹으며 수다와 친목 대화 리스닝에만 조용히 전념한다.',
        intent: '얌전한 식사 및 대화 경청',
        immediateEffects: [
          { stat: 'mental', value: 12 },
          { stat: 'hp', value: 10 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '조용하고 아늑한 대화 참여로 동료 교사들의 최근 민원 고충을 자세히 경청하여 공감대를 넓혔습니다.'
      }
    ]
  }
];
