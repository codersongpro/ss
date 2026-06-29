import type { GameEvent } from '@/game/types';

// ==================== [사생활/랜덤 카테고리 유머 밈 이벤트 30선] ====================
export const funnyRandomEvents: GameEvent[] = [
  {
    id: 'evt_funny_random_01',
    dayRange: [1, 30],
    title: '퇴근길 지하철 극성 비글단 조우',
    category: 'random',
    situation: '퇴근길 만원 지하철',
    narratorText: '지옥철이라 불리는 퇴근길 지하철 안, 손잡이에 매달려 멍하니 스마트폰을 보고 있었습니다. 그런데 저 문 앞에 우리 반에서 가장 목소리가 크고 장난기가 넘치는 남학생 3명이 가방을 던지며 왁자지껄 탑승했습니다! 내 바로 옆으로 다가옵니다. 눈이 마주치기 직전입니다! 어떻게 은폐 대피하시겠습니까?',
    weight: 100,
    tags: ['퇴근길지하철', '학생조우', '은폐엄수'],
    choices: [
      {
        id: 'choice_funny_random_01_1',
        text: '스마트폰으로 신문 사설 화면을 켜서 얼굴 정중앙에 수직으로 밀착하고, 가방 뒤로 고개를 푹 숙여 철저하게 기척을 지우는 지하철 닌자가 된다.',
        intent: '철저한 은폐 닌자 모드',
        immediateEffects: [
          { stat: 'mental', value: 15 },
          { stat: 'hp', value: 5 },
          { stat: 'colleagueRelation', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '아이들은 선생님을 알아보지 못하고 장난을 치며 다음 역에서 우르르 내렸습니다. 소중한 사생활과 퇴근길 힐링 평화를 완벽하게 사수했습니다.'
      },
      {
        id: 'choice_funny_random_01_2',
        text: '"너희들 지하철 내 공공예절 준수 캠페인을 담임이 몸소 지켜보겠다!"라며 장난스레 인사하고, 교통카드를 찍어주며 하이파이브를 나눈다.',
        intent: '쾌활한 조우 및 인사',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'mental', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '아이들은 "우와 담임 쌤이다!"라며 신기해했고 지하철 내 질서를 얌전하게 지켰습니다. 학생 신뢰도가 크게 올랐습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_random_02',
    dayRange: [1, 30],
    title: '왼쪽 흰색 오른쪽 검은색 짝짝이 양말 대작전',
    category: 'random',
    situation: '교무실 내 자리',
    narratorText: '아침 등교 버스를 간신히 타고 출근하여 자리에 앉았는데, 슬랙스 밑단 사이로 보이는 발목이 이상합니다. 확인해 보니 왼쪽은 솜털이 뿜어져 나오는 두툼한 흰색 스포츠 양말을, 오른쪽은 얇고 반짝이는 정장용 검은색 신사 양말을 짝짝이로 신고 출근했습니다! 오늘 학급 청소 지도 및 복도 지도가 3타임 있습니다. 어떻게 은폐하시겠습니까?',
    weight: 100,
    tags: ['짝짝이양말', '패션파괴', '교탁은폐'],
    choices: [
      {
        id: 'choice_funny_random_02_1',
        text: '교탁 뒤에 서서 다리를 절대 밖으로 뻗지 않는 정자세 훈육 모드를 발동하고, 이동 시 슬랙스 밑단을 뒤꿈치 밑으로 한껏 당겨 밟고 걷는다.',
        intent: '교탁 사수 및 슬랙스 하강 엄수',
        immediateEffects: [
          { stat: 'classManagement', value: 12 },
          { stat: 'hp', value: -5 },
          { stat: 'mental', value: 10 }
        ],
        resultText: '하루 종일 엉거주춤 걸었으나 아무도 짝짝이 양말을 눈치채지 못하고 무사히 일과가 끝났습니다. 은밀하게 비밀을 지켰습니다.'
      },
      {
        id: 'choice_funny_random_02_2',
        text: '교무실 보건 선생님을 찾아가 "양말 정전기 방지용 임시 흰색 붕대를 발목에 감아 달라"고 보건 대책을 요청한다.',
        intent: '보건 붕대 위장술',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'mental', value: 12 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '보건 선생님은 박장대소하시며 반짝이는 붕대를 감아주셨고, 오히려 구호 양말 한 켤레를 기증해 주셔서 쾌적한 양말 패션으로 복귀했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_random_03',
    dayRange: [1, 30],
    title: '학부모 면담 직전 대왕 고춧가루 앞니 저격',
    category: 'random',
    situation: '교무실 상담석',
    narratorText: '오늘 급식 메뉴로 나온 김치볶음밥을 맛있게 비우고, 5분 뒤 바로 학부모 상담 면담이 시작되었습니다. 진중하게 영수의 진로 발달에 관해 이야기하며 미소를 짓던 중, 상담실 탁상 거울로 슬쩍 내 앞니 정중앙에 대왕 고춧가루 한 톨이 신호등 빨간불처럼 강렬하게 안착해 있는 것을 목격했습니다! 학부모님은 내 입술을 빤히 쳐다보고 계십니다. 어떻게 해결하시겠습니까?',
    weight: 100,
    tags: ['고춧가루테러', '학부모면담', '앞니화재'],
    choices: [
      {
        id: 'choice_funny_random_03_1',
        text: '목이 잠긴 척 "크흠! 차 한 모금 마시겠습니다"라며 앞에 놓인 따뜻한 녹차를 들이키며 고난도 물 가글 혀 무빙을 시전해 삼킨다.',
        intent: '녹차 가글 혀 무빙 추출',
        immediateEffects: [
          { stat: 'parentTrust', value: 10 },
          { stat: 'mental', value: 8 },
          { stat: 'hp', value: 3 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '고춧가루가 흔적도 없이 목구멍으로 소멸했습니다. 학부모님은 깔끔하고 유창한 담임의 진로 상담 태도에 깊은 인상을 받으셨습니다.'
      },
      {
        id: 'choice_funny_random_03_2',
        text: '"어머나! 급식 김치볶음밥이 너무 맛있어서 훈장 뱃지가 앞니에 남아있었군요!"라며 털털하고 유쾌하게 고춧가루를 물티슈로 닦아내 웃어넘긴다.',
        intent: '털털 유쾌 자백 해결',
        immediateEffects: [
          { stat: 'parentTrust', value: 15 },
          { stat: 'mental', value: 12 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '학부모님은 선생님의 인간적이고 유머러스한 털털함에 빵 터지시며 딱딱했던 상담 분위기가 단숨에 아주 훈훈하게 풀렸습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_random_04',
    dayRange: [1, 30],
    title: '출근 버스 정시 사수를 위한 게걸음 질주',
    category: 'random',
    situation: '동네 정류장 앞 횡단보도',
    narratorText: '지각 종료종이 울리기 20분 전, 저 멀리 출근용 100번 버스가 정류장에 정차하는 것이 보입니다. 신호등은 파란불이 켜졌고, 거리에는 등교하는 다른 중고등학생들이 가득 차 있습니다. 교사의 단정함과 지적 윤리를 유지하면서 이 버스를 기필코 타려면 질주를 감행해야 합니다. 어떻게 달리시겠습니까?',
    weight: 100,
    tags: ['출근지각', '버스질주', '교사체면'],
    choices: [
      {
        id: 'choice_funny_random_04_1',
        text: '가방을 가슴에 단단히 움켜쥐고 전력 질주 질주를 감행하여 버스 문이 닫히기 1초 전에 세이프 골인한다.',
        intent: '전력 질주 버스 세이프',
        immediateEffects: [
          { stat: 'hp', value: -15 },
          { stat: 'mental', value: 10 },
          { stat: 'burnout', value: 5 }
        ],
        resultText: '숨이 턱밑까지 차올랐으나 지각 위기를 아슬아슬하게 넘기고 교실 조회 정각 안착에 성공했습니다. 성실한 출근도가 유지되었습니다.'
      },
      {
        id: 'choice_funny_random_04_2',
        text: '택시 호출 앱을 가동해 7,500원 프리미엄 택시 수급 딜을 시전하여 우아하고 단정하게 조수석에서 내린다.',
        intent: '자본 활용 우아 출근',
        immediateEffects: [
          { stat: 'mental', value: 15 },
          { stat: 'hp', value: 10 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '지갑 사정은 조금 얇아졌으나 체력을 완벽히 비축한 상태로 단정한 구두 소리를 내며 교문에 입성해 교사의 품위를 사수했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_random_05',
    dayRange: [1, 30],
    title: '교무실 주머니 딱풀 립밤 오폭 대참사',
    category: 'random',
    situation: '교무실 내 자리',
    narratorText: '오후 수업 준비 중, 입술이 너무 건조하여 눈을 감은 채 주머니에서 원통형 립밤을 꺼내 입술에 위아래로 잔뜩 난사했습니다. 그런데 입술이 서로 쩍 엉겨 붙으며 단단한 우주적 마찰력이 느껴집니다. 깜짝 놀라 눈을 뜨니 립밤이 아니라 교실 환경용 고체 딱풀(강력 찰딱풀)이었습니다! 어떻게 해결하시겠습니까?',
    weight: 100,
    tags: ['딱풀립밤', '탕비실해프닝', '입술봉인'],
    choices: [
      {
        id: 'choice_funny_random_05_1',
        text: '탕비실로 신속히 대피해 따뜻한 온수 주전자를 켜고, 스팀 가습 타월을 만들어 입술의 접착력을 살살 녹여 분리해 낸다.',
        intent: '스팀 세척 분리 수습',
        immediateEffects: [
          { stat: 'hp', value: -5 },
          { stat: 'mental', value: 10 },
          { stat: 'expert', value: 5 }
        ],
        resultText: '입술 껍질이 약간 따끔했으나 접착제 성분을 깨끗하게 분리 완료했습니다. 역시 신속한 과학적 수습이 돋보였습니다.'
      },
      {
        id: 'choice_funny_colleague_05_2',
        text: '보건실로 뛰어가 보건 선생님의 특급 아동용 글리세린 보습 오일을 처방받아 입술 분리 및 케어를 완수한다.',
        intent: '보건실 긴급 처방 구호',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'hp', value: 10 },
          { stat: 'mental', value: 12 },
          { stat: 'burnout', value: 5 }
        ],
        resultText: '보건 선생님은 "어머 김 선생님, 딱풀의 맛은 어때요?"라며 크게 웃으시며 립 케어 전용 에센스를 선물해 주셨습니다. 탕비실 다과 유대감이 한층 올랐습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_random_06',
    dayRange: [1, 30],
    title: '주말 대형 마트 시식코너 한우의 눈빛 조우',
    category: 'random',
    situation: '동네 대형 마트 시식 코너',
    narratorText: '주말 오후, 꼬질꼬질한 추리닝에 슬리퍼를 질질 끌고 마트 시식 코너 앞에 줄을 섰습니다. 마침내 갓 구운 육즙이 흐르는 횡성 한우 등심 한 조각을 이쑤시개로 쿡 집어 입에 넣으려는 순간, 바로 맞은편 카트를 밀며 다가오는 사람이 우리 반 동우 어머님과 눈이 정확하게 정면 조우했습니다! 어떻게 반응하시겠습니까?',
    weight: 100,
    tags: ['마트시식', '추리닝외출', '학부모조우'],
    choices: [
      {
        id: 'choice_funny_random_06_1',
        text: '이쑤시개를 든 채 "어머님! 마트 한우 신선도가 학급 단백질 급식 기준에 매우 적합한지 담임이 주말 검수 중이었습니다!"라고 넉살 좋게 받아친다.',
        intent: '넉살 좋게 급식 검수 개그',
        immediateEffects: [
          { stat: 'parentTrust', value: 15 },
          { stat: 'mental', value: 12 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '어머님은 선생님의 호쾌한 유머에 빵 터지시며 한우 한 팩을 사서 내 카트에 선물로 턱 얹어 주셨습니다. 주말 고기 도파민이 폭발했습니다.'
      },
      {
        id: 'choice_funny_random_06_2',
        text: '조용히 눈을 내리깔고 시식용 고기 컵만 든 채 가전 코너 방향으로 번개처럼 카트를 꺾어 시야에서 초고속 이탈한다.',
        intent: '초고속 시야 회피 이탈',
        immediateEffects: [
          { stat: 'mental', value: 15 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '기척 없이 군중 속으로 사라졌습니다. 꼬질꼬질한 내 홈웨어 프라이버시를 안전하게 수호하는 데 성공했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_random_07',
    dayRange: [1, 30],
    title: '주말 청소기 필터 해체 세척의 지옥',
    category: 'random',
    situation: '내 자취방 화장실',
    narratorText: '주말을 맞아 방 청소를 하려고 청소기를 가동했는데, 필터 막힘 경고등과 함께 묵은 먼지 냄새가 뿜어져 나왔습니다. 청소기 필터를 분해해 보니 먼지 뭉치와 머리카락이 꽉 찬 지옥의 상태였습니다. 이를 청소하려면 솔로 털어내고 물 세척 후 24시간을 건조해야 합니다. 주말 청소 지옥이 열렸습니다. 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['집안일지옥', '청소기세척', '자취생활'],
    choices: [
      {
        id: 'choice_funny_random_07_1',
        text: '팔을 걷고 칫솔과 세제를 쥐어 필터 속 미세 먼지망을 반짝반짝하게 물세척 세탁하고 베란다에 단정하게 건조한다.',
        intent: '필터 물세척 대청소',
        immediateEffects: [
          { stat: 'hp', value: -10 },
          { stat: 'familySatisfaction', value: 15 },
          { stat: 'burnout', value: -5 }
        ],
        resultText: '자취방 공기가 맑아지고 청소기가 새것처럼 흡입력을 복원했습니다. 내 삶의 환경이 한결 쾌적하게 정돈되었습니다.'
      },
      {
        id: 'choice_funny_random_07_2',
        text: '필터 조립을 그대로 덮어두고 로봇청소기 전원 버튼만 원클릭 가동한 뒤 침대에 누워 모바일 서핑을 즐긴다.',
        intent: '로봇청소기 우회 휴식',
        immediateEffects: [
          { stat: 'mental', value: 15 },
          { stat: 'hp', value: 10 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '로봇 청소기가 덜덜거리며 먼지를 쓸고 다니는 소리를 자장가 삼아 달콤한 토요일 꿀잠을 한껏 즐겼습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_random_08',
    dayRange: [1, 30],
    title: '동네 사우나 온탕 속 학부모 조우 대참사',
    category: 'random',
    situation: '동네 사우나 온탕',
    narratorText: '주말 피로를 날리기 위해 동네 목욕탕 온탕에 목까지 푹 담그고 "어우 시원하다"를 온 동네 아저씨처럼 연발하고 있었습니다. 그런데 바로 옆자리 뜨끈한 열탕에서 수건을 머리에 얹고 땀을 뻘뻘 흘리시던 아버님이 "어머나! 영수 담임 선생님 아니십니까!"라며 반갑게 악수를 청해 오십니다! 온몸이 무방비인 목욕탕 상태입니다. 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['동네사우나', '무방비조우', '사생활보호'],
    choices: [
      {
        id: 'choice_funny_random_08_1',
        text: '당당하게 미소를 지으며 온탕 속 악수를 나누고 "아버님과 뜨거운 교육열의(?) 온도를 함께 나누어 주말의 보람이 뜨겁습니다!"라고 호탕하게 넉살 딜한다.',
        intent: '목욕탕 호탕 맞장구 악수',
        immediateEffects: [
          { stat: 'parentTrust', value: 20 },
          { stat: 'mental', value: 12 },
          { stat: 'hp', value: 10 },
          { stat: 'burnout', value: 5 }
        ],
        resultText: '아버님은 선생님의 꾸밈없는 소탈함에 감동하셨고 목욕탕 요금을 직접 대신 계산해 주셨습니다. 잊지 못할 탕내 상담이 끝났습니다.'
      },
      {
        id: 'choice_funny_random_08_2',
        text: '"목이 잠겨 온천 열기가 어지럽습니다"라며 다급히 냉탕 샤워실로 조용하고 신속하게 잠수 탈출을 감행한다.',
        intent: '냉탕 신속 기밀 잠수',
        immediateEffects: [
          { stat: 'mental', value: 15 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '차가운 냉수 샤워를 맞으며 정신이 확 깼습니다. 사생활 영역의 알몸 비주얼(?)을 안전하게 보호하는 데 안도했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_random_09',
    dayRange: [1, 30],
    title: '선생님은 화장실 안 가요? 질문 공세',
    category: 'random',
    situation: '등굣길 교실 앞',
    narratorText: '등교 시간, 초등학교 1학년 지우가 내 셔츠 소매를 꼬옥 잡고 똥그란 눈망울로 진지하게 물어봅니다. "선생님, 친구가 그러는데 선생님들은 다 이슬만 먹고 수업하셔서 똥오줌 화장실 안 간다는데 진짜예요? 선생님 화장실 가는 거 본 사람이 한 명도 없어요!" 순수한 질문 공세에 어떻게 답변해 주시겠습니까?',
    weight: 100,
    tags: ['초등학생질문', '화장실미스터리', '이슬만먹음'],
    choices: [
      {
        id: 'choice_funny_random_09_1',
        text: '지우의 볼을 살짝 꼬집으며 "사실 선생님도 매일 삼겹살을 먹어서 너희들보다 2배는 더 화장실에 간다"고 인간적인 팩트로 털털하게 밝힌다.',
        intent: '인간적 생리 팩트 고백',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'mental', value: 12 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '지우는 "아! 선생님도 우리랑 똑같은 사람이구나!"라며 깔깔 웃어젖혔고, 담임 선생님을 한층 더 다정하고 친근한 부모처럼 따르기 시작했습니다.'
      },
      {
        id: 'choice_funny_random_09_2',
        text: '"쉿! 이건 일급비밀인데 선생님들은 밤에 교실 소독할 때만 비밀 화장실 문이 열린단다"라며 판타지 신비주의를 사수한다.',
        intent: '교직 신비주의 가이드',
        immediateEffects: [
          { stat: 'studentTrust', value: 10 },
          { stat: 'mental', value: 15 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '지우는 눈을 반짝이며 비밀 첩보원처럼 비밀을 지키겠다고 다짐했습니다. 교사의 환상적인 신비도가 유지되었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_random_10',
    dayRange: [1, 30],
    title: '주말 침대 초중력 상태 물아일체 챌린지',
    category: 'random',
    situation: '내 침대 속',
    narratorText: '토요일 오전 11시, 눈을 떴으나 온몸에 지구 중심 방향으로 향하는 100배의 초중력이 걸린 것처럼 침대 매트리스에서 등가죽이 한 치도 떨어지지 않습니다. 손가락만 움직여 스마트폰 배달 앱을 들여다보고 있는 귀차니즘의 극한 상태입니다. 주말 힐링을 위해 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['주말방콕', '귀차니즘', '이불밖은위험'],
    choices: [
      {
        id: 'choice_funny_random_10_1',
        text: '기필코 침대를 차고 일어나 샤워를 마친 후, 가벼운 면바지를 입고 동네 공원 잔디밭으로 30분 산책을 다녀와 태양광 에너지를 받는다.',
        intent: '광합성 산책 활력 충전',
        immediateEffects: [
          { stat: 'hp', value: 15 },
          { stat: 'mental', value: 12 },
          { stat: 'burnout', value: -10 }
        ],
        resultText: '맑은 바깥바람과 햇빛 덕분에 뇌 세포가 살아나고 월요병 걱정을 날릴 건강한 체력을 대폭 보충해 냈습니다.'
      },
      {
        id: 'choice_funny_random_10_2',
        text: '배달 앱으로 달콤한 생크림 와플과 뜨거운 아메리카노 세트를 주문하고 이불 속에서 넷플릭스 영화 3편을 정주행한다.',
        intent: '이불속 넷플릭스 딜',
        immediateEffects: [
          { stat: 'mental', value: 20 },
          { stat: 'hp', value: 5 },
          { stat: 'familySatisfaction', value: 10 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '와플의 단맛이 도파민을 무제한 공급해 주었습니다. 침대와 완벽하게 물아일체가 되어 가장 아늑한 휴식 토요일을 만끽했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_random_11',
    dayRange: [1, 30],
    title: '건조한 겨울철 2만 볼트 피카츄 정전기 스파크',
    category: 'random',
    situation: '교실 복도 손잡이 앞',
    narratorText: '겨울철 건조한 오후, 복도 문을 열고 교무실에 가려는데 금속 문 손잡이 근처에 손을 대자마자 "팍!" 소리와 함께 파란 불꽃 정전기 스파크가 튀었습니다! 손끝이 찌릿찌릿하며 소름이 돋습니다. 정전기 공포증에 휩싸여 문 손잡이 잡기가 두려워졌습니다. 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['겨울정전기', '피카츄스파크', '문손잡이'],
    choices: [
      {
        id: 'choice_funny_random_11_1',
        text: '입바람을 손잡이에 훅 불어 습기를 공급하고, 옷 소매 깃으로 손잡이를 꼼꼼히 문질러 정전기 방전 작업을 거쳐 안전하게 문을 연다.',
        intent: '습기 충전 방전 열기',
        immediateEffects: [
          { stat: 'hp', value: 5 },
          { stat: 'mental', value: 10 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '스파크 없이 부드럽게 문이 열렸습니다. 사소하지만 정전기 공포증을 이겨내고 쾌적한 이동을 사수했습니다.'
      },
      {
        id: 'choice_funny_random_11_2',
        text: '뒤따라오던 남학생 유민이에게 "유민아, 과학 시간에 배운 정전기 전도 현상을 확인하기 위해 문을 먼저 열어보겠니?"라며 교육용 기지를 유도한다.',
        intent: '아동 전도 실험 유도',
        immediateEffects: [
          { stat: 'studentTrust', value: 12 },
          { stat: 'expert', value: 10 },
          { stat: 'mental', value: 10 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '유민이가 씩씩하게 문을 열어 주었습니다! 유민이는 정전기를 느끼지 않고 쿨하게 통과했고, 훌륭한 물리 생태 교육이 완수되었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_random_12',
    dayRange: [1, 30],
    title: '지하철 거북목 밈 조우와 척추 곧게 펴기',
    category: 'random',
    situation: '퇴근 전철 안',
    narratorText: '퇴근 지하철을 타고 서서 가는데, 내 바로 앞자리에 앉은 청년의 거북목이 정확히 90도 각도로 휘어 스마트폰을 코앞에 대고 있는 기묘한 자세를 목격했습니다. 보기만 해도 내 목디스크 척추 뼈마디가 저려오는 강렬한 비주얼입니다. 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['지하철풍경', '거북목탈출', '웰빙척추'],
    choices: [
      {
        id: 'choice_funny_random_12_1',
        text: '그 즉시 내 턱을 뒤로 바짝 당기고 어깨를 활짝 펴서 기립근과 척추 뼈를 대나무처럼 일렬로 곧게 세우는 웰빙 스트레칭을 감행한다.',
        intent: '즉각 척추 기립 스트레칭',
        immediateEffects: [
          { stat: 'hp', value: 15 },
          { stat: 'mental', value: 10 },
          { stat: 'burnout', value: -5 }
        ],
        resultText: '목 뒤가 뻐근해지며 시원한 혈액순환이 느껴졌습니다. 지하철 거북목 밈 조우 덕분에 디스크 예방 자세 사수에 성공했습니다.'
      },
      {
        id: 'choice_funny_random_12_2',
        text: '눈을 감고 스마트폰 블루라이트 안구 피로 방지를 위해 이어폰으로 힐링 숲 소리 음악을 들으며 아늑하게 퇴근길을 보낸다.',
        intent: '안구 보호 숲소리 청강',
        immediateEffects: [
          { stat: 'mental', value: 15 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '안구 건조가 크게 해소되고 마음의 평화를 되찾아 쾌적하게 동네 역에 하차했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_random_13',
    dayRange: [1, 30],
    title: '교탁 뒷자리 비밀 발가락 요가 포즈 조우',
    category: 'random',
    situation: '교실 교탁 뒤',
    narratorText: '3교시 수학 문제 풀이 시간, 아이들이 자율 풀이를 하느라 조용한 틈을 타, 다리가 저려 교탁 뒤에 숨어 왼쪽 다리를 허벅지 뒤로 꺾어 올리고 학다리 정 자세 요가 자세를 취하고 있었습니다. 그때 뒤쪽 사물함에서 공책을 꺼내러 가던 혜원이가 교탁 옆으로 쑥 고개를 들이밀며 내 학다리 포즈를 빤히 쳐다봅니다! 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['교실해프닝', '학다리요가', '들통남'],
    choices: [
      {
        id: 'choice_funny_random_13_1',
        text: '당황하지 않고 한 다리로 서서 지휘봉을 가볍게 휘두르며 "혜원아, 공부를 잘하려면 뇌에 피가 돌아야 하니 한 다리 서기 스트레칭 3초를 같이 해볼까?"라며 가동한다.',
        intent: '학다리 스트레칭 즉석 연출',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'mental', value: 12 },
          { stat: 'expert', value: 5 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '혜원이도 교탁 옆에서 신이 나 한 다리로 서며 장난을 쳤고, 교실 내 가벼운 요가 체조 분위기가 펼쳐져 활기가 가득 찼습니다.'
      },
      {
        id: 'choice_funny_random_13_2',
        text: '빛의 속도로 다리를 내려 양발 착지를 완료하고, 헛기침을 하며 준수하게 수학 오답 대장을 들춰 문제를 지목한다.',
        intent: '엄숙 정자세 신속 복귀',
        immediateEffects: [
          { stat: 'classManagement', value: 12 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '혜원이는 의심 없이 수학 책을 들고 자리로 돌아갔습니다. 담임 교사의 단정하고 단호한 위엄을 즉시 복원했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_random_14',
    dayRange: [1, 30],
    title: '배달 주소 오인 교무실 안마 침대 배달 소동',
    category: 'random',
    situation: '교무실 내 자리 앞',
    narratorText: '어젯밤 홈쇼핑 채널을 보다가 수면 부족 상태로 거대 전신 안마 침대(진동 온열 매트)를 결제했는데, 배송지 주소를 자취방이 아닌 [학교 3학년 교무실 김 선생님 책상 앞]으로 실수 셋팅해 버렸습니다! 오늘 오후 교무실 한복판에 대형 택배 박스를 든 기사님이 "김 선생님, 안마 침대 배달 왔습니다!"라며 박스를 풀어놓으십니다. 교감과 동료들이 구경하러 모입니다. 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['배송지오류', '안마침대', '교무실소동'],
    choices: [
      {
        id: 'choice_funny_random_14_1',
        text: '"교무실의 열악한 척추 환경을 위해 제가 사비로 기부한 공용 척추 힐링 안마존 매트입니다! 교감 선생님부터 누워 보세요!"라며 넉살 좋게 기부한다.',
        intent: '교무실 공용 안마존 기부 플렉스',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 20 },
          { stat: 'adminTrust', value: 15 },
          { stat: 'mental', value: 10 },
          { stat: 'burnout', value: 6 }
        ],
        resultText: '교감 선생님이 매트 위에 누워 "어우 등뼈가 펴지는구만! 김 선생은 학교 복지의 락스타야!"라며 대찬사를 보냈고 교무실 내 꿀복지 명당이 완성되었습니다.'
      },
      {
        id: 'choice_funny_random_14_2',
        text: '택시비 15,000원을 내고 주말 배송으로 자취방 주소지 강제 이관 퀵서비스를 긴급 호출해 돌려보낸다.',
        intent: '퀵서비스 자취방 즉각 회수',
        immediateEffects: [
          { stat: 'mental', value: 15 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '택배가 10분 만에 조용히 사라졌습니다. 교무실 공사 구분을 위해 개인 살림살이 유출 소동을 안전하게 진화 완료했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_random_15',
    dayRange: [1, 30],
    title: '주말 핫플레이스 돈가스 맛집의 대기 70팀',
    category: 'random',
    situation: '시내 돈가스 핫플레이스 앞',
    narratorText: '주말 점심, 인스타그램에서 난리가 난 겉바속촉 수제 치즈 돈가스 맛집 앞에 도착했습니다. 입구 태블릿 예약기를 눌렀더니 [현재 대기 번호 71번, 예상 웨이팅 타임 140분]이라는 충격적인 화면이 떴습니다. 밖에는 뙤약볕이 내리쬐고 뱃가죽은 등가죽에 달라붙어 있습니다. 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['맛집웨이팅', '치즈돈가스', '골목짜장면'],
    choices: [
      {
        id: 'choice_funny_random_15_1',
        text: '웨이팅 예약을 걸어두고, 바로 옆 골목의 한산한 고전 만화카페방에 입장해 시원한 에어컨 바람과 함께 짜장 라면을 먹으며 느긋하게 2시간을 보낸다.',
        intent: '만화방 짜장라면 우회 대기',
        immediateEffects: [
          { stat: 'hp', value: 15 },
          { stat: 'mental', value: 12 },
          { stat: 'burnout', value: -10 }
        ],
        resultText: '만화책을 보며 먹은 짜장 라면도 꿀맛이었고, 2시간 뒤 무사히 입장해 먹은 치즈 돈가스도 극도로 맛있어서 주말 미식 성공 도파민을 가득 채웠습니다.'
      },
      {
        id: 'choice_funny_random_15_2',
        text: '대기를 전면 철회하고 바로 옆 분식집에 들어가 떡볶이와 튀김을 신속히 비우고 자취방 침대로 신속 귀환한다.',
        intent: '분식집 신속 타협 자취방 복귀',
        immediateEffects: [
          { stat: 'mental', value: 15 },
          { stat: 'hp', value: 10 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '뙤약볕 노출 없이 빠르게 포만감을 채우고 이불 속에서 긴 낮잠을 즐겨 체력을 완벽히 충전했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_random_16',
    dayRange: [1, 30],
    title: '출근길 물웅덩이 폭격 양말 찝찝사',
    category: 'random',
    situation: '횡단보도 앞 물웅덩이',
    narratorText: '비가 추적추적 내리는 출근길 아침, 횡단보도를 지나가는데 옆 골목 차 바퀴가 튕겨낸 빗물 폭탄을 밟아 오른쪽 구두 속에 웅덩이 흙탕물이 흘러 들어왔습니다! 오른쪽 발가락 양말 끝부분이 축축하게 젖어 찝찝함이 극에 달했습니다. 교실 서랍에는 여분 양말이 없습니다. 어떻게 하루를 버티시겠습니까?',
    weight: 100,
    tags: ['출근길테러', '젖은양말', '교실드라이기'],
    choices: [
      {
        id: 'choice_funny_random_16_1',
        text: '보건실에서 신소독용 붕대 밴드를 빌려 양말을 벗고 발가락에 알코올 소독 후 붕대 감싸기 셋팅으로 보송함을 사수한다.',
        intent: '보건실 소독 붕대 발가락 수호',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'hp', value: 10 },
          { stat: 'mental', value: 10 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '보건 선생님의 친절한 보습 케어로 양말 없이도 쾌적하게 보송한 발을 유지하여 하루 일과를 건강하게 마쳤습니다.'
      },
      {
        id: 'choice_funny_random_16_2',
        text: '수업 내내 교실 무선 온풍기나 미니 선풍기를 오른쪽 발밑에 강풍으로 틀어놓고 양말 건조 작업을 묵묵히 진행한다.',
        intent: '발밑 무선선풍기 건조',
        immediateEffects: [
          { stat: 'classManagement', value: 12 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '오후가 되어서야 양말이 완전히 말랐습니다. 찝찝했지만 수업을 제시간에 차분하게 완료했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_random_17',
    dayRange: [1, 30],
    title: '스트레스 해소용 5단계 엽기 떡볶이의 심판',
    category: 'random',
    situation: '자취방 저녁 식탁',
    narratorText: '일과 스트레스를 날리기 위해 저녁에 매운 맛 5단계인 지옥의 엽기 떡볶이 닭발 세트를 콧물을 흘리며 땀나게 완식했습니다. 단맛과 매운맛의 도파민이 폭발했으나, 다음 날 아침 교문 등교 지도 안전 시간이 개시되자마자 아랫배 속에서 지옥의 핏빛 화산 불꽃놀이가 터져 나오기 시작했습니다! 땀이 송글송글 맺힙니다. 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['매운떡볶이', '화산대폭발', '교문대피'],
    choices: [
      {
        id: 'choice_funny_random_17_1',
        text: '교문 당번 동료에게 "아랫배에 화재가 나 3분 긴급 탕비실 대피 승인을 구한다"고 외치고 신속하게 비상 화장실로 스프린트한다.',
        intent: '동료 양해 비상 화장실 대피',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 12 },
          { stat: 'hp', value: 10 },
          { stat: 'mental', value: 10 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '동료 쌤이 흔쾌히 교문을 교대해주어 안전하게 뱃속 화산을 진화했습니다. 서로의 의리가 한층 단단해졌습니다.'
      },
      {
        id: 'choice_funny_random_17_2',
        text: '이빨을 꽉 깨물고 전신 케겔 운동 요법을 발동해 30분간 교문에 말뚝처럼 서서 고통을 참아내며 완수한다.',
        intent: '인내의 말뚝 교문 수호',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'hp', value: -15 },
          { stat: 'burnout', value: 10 }
        ],
        resultText: '식은땀을 흘리며 정각 지도를 마쳤습니다. 학생들이 선생님의 눈빛에서 범접할 수 없는 비장한 카리스마를 느끼고 줄을 칼같이 맞춰 등교했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_random_18',
    dayRange: [1, 30],
    title: '미용실 이마 투명 덮개 씌운 채 교감과 거울 조우',
    category: 'random',
    situation: '시내 헤어 살롱 미용실',
    narratorText: '주말에 머리를 하러 단골 미용실에 앉았습니다. 약품 보호를 위해 이마에 닭 벼슬 같은 투명 플라스틱 물막이 덮개를 이마에 착 붙이고 뽀글뽀글 외계인 펌 헬멧 기계를 머리에 쓴 채 폰을 보고 있었습니다. 그런데 거울 속 옆 라인 자리에 앉은 분의 이마 투명 덮개 위로 낯익은 주름살이 보입니다. 바로 우리 학교 교감 선생님이십니다! 어떻게 반응하시겠습니까?',
    weight: 100,
    tags: ['미용실해프닝', '이마덮개', '교감선생님'],
    choices: [
      {
        id: 'choice_funny_random_18_1',
        text: '덮개를 붙인 채 손을 번쩍 흔들며 "교감 선생님! 주말 헤어 살롱 스타일 셋팅 매칭이 환상적입니다! 서로의 이마 덮개가 아주 앙증맞네요!"라며 호쾌히 인사한다.',
        intent: '이마 덮개 씌움 쾌활 조우',
        immediateEffects: [
          { stat: 'adminTrust', value: 20 },
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'mental', value: 10 },
          { stat: 'burnout', value: 6 }
        ],
        resultText: '교감 선생님은 빵 터지시며 "하하! 김 선생도 파마하는구만!"이라며 디자이너에게 내 커트 비용을 본인 카드 플렉스로 대신 결제해 주셨습니다.'
      },
      {
        id: 'choice_funny_random_18_2',
        text: '눈을 바짝 감고 잡지 [원예 가을 국화] 책으로 얼굴을 완전히 가린 채 잠든 척 2시간을 고수한다.',
        intent: '잡지 얼굴 가리기 취침모드',
        immediateEffects: [
          { stat: 'mental', value: 15 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '눈물겨운 잡지 장막 덕분에 어색한 대화 없이 평온하게 헤어 스타일 셋팅을 마칠 수 있었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_random_19',
    dayRange: [1, 30],
    title: '일요일 밤 9시 주말 테마곡 월요병 신드롬',
    category: 'random',
    situation: '자취방 침대 위 저녁',
    narratorText: '일요일 저녁 9시 15분, 주말 예능 개그 프로그램의 신나는 시그널 브라스 음악이 방 안에 울려 퍼집니다. 이 음악이 흐른다는 것은 주말이 시한부 2시간 남았으며 내일 아침 출근 버스 전쟁이 열린다는 파멸의 예보입니다! 등줄기에 식은땀이 흐르고 월요병이 급습합니다. 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['일요일밤', '월요병급습', '주말정산'],
    choices: [
      {
        id: 'choice_funny_random_19_1',
        text: '즉시 가방 속에 힐링 향수 라벤더 오일을 귀 밑에 바르고 따뜻한 우유를 끓여 마신 후 10시 정각 취침 모드로 침대에 누워 건강을 수호한다.',
        intent: '라벤더 오일 온수 취침',
        immediateEffects: [
          { stat: 'hp', value: 15 },
          { stat: 'mental', value: 12 },
          { stat: 'burnout', value: -10 }
        ],
        resultText: '월요일 아침 눈을 떴을 때 안구 건조가 싹 사라지고 꿀잠 활력 상태로 씩씩하게 출근 정문에 골인했습니다.'
      },
      {
        id: 'choice_funny_random_19_2',
        text: '월요병 탈출을 위해 배달 치킨 닭강정과 꿀 맥주 캔을 꺼내 동료 교사에게 "내일 출근 거부 동맹" 푸념 전화를 걸어 12시까지 수다를 떤다.',
        intent: '치킨 수다 동맹 수다',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'colleagueSolidarity', value: 15 },
          { stat: 'hp', value: -10 }
        ],
        resultText: '수다로 마음의 불안은 다 태워 버렸으나 다음 날 아침 다소 퉁퉁 부은 얼굴로 출근 횡단보도를 건넜습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_random_20',
    dayRange: [1, 30],
    title: '교실 창밖 에어컨 실외기 비둘기 둥지 건설',
    category: 'random',
    situation: '교실 창밖',
    narratorText: '수업 도중 교실 뒤쪽 창가에서 웅성웅성 비명이 터졌습니다. 확인해 보니 창밖 에어컨 실외기 틈새에 거대한 회색 비둘기 한 쌍이 나뭇가지를 물어다 둥지를 틀고 알을 2개 낳아 놓았습니다! 아이들은 신이 나서 "와 비둘기 가족 탄생이다! 이름 지어주자!"라며 창가에 다닥다닥 붙어 수업 진도를 방해합니다. 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['교실창밖', '비둘기둥지', '생태대소동'],
    choices: [
      {
        id: 'choice_funny_random_20_1',
        text: '비둘기 유해 조수 위생 문제를 들어 창문을 철저히 닫아 시야를 잠그고, 행정실에 비둘기 퇴치 그물망 설비 설치 공문을 올린다.',
        intent: '창문 차단 및 행정망 방지망 설치',
        immediateEffects: [
          { stat: 'classManagement', value: 15 },
          { stat: 'expert', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '행정실의 신속한 퇴치망 설치로 교실 위생 안전을 수호했고, 아이들은 아쉬워했으나 공부 질서에 신속 복귀했습니다.'
      },
      {
        id: 'choice_funny_random_20_2',
        text: '쉬는 시간 5분 동안만 비둘기 생태 성장 관찰 타임을 공식 허용하고, 수업 중에는 창문을 커튼으로 가려 통제한다.',
        intent: '생태관찰 쉬는시간 한정 허용',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'classManagement', value: 12 },
          { stat: 'mental', value: 10 },
          { stat: 'burnout', value: 5 }
        ],
        resultText: '아이들은 쉬는 시간에만 관찰기를 적으며 약속을 칼같이 지켰고, 수업 시간에는 칠판 필기에 고도의 집중도를 보였습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_random_21',
    dayRange: [1, 30],
    title: '스마트워치 일일 만 보 걷기 링 채우기 강박',
    category: 'random',
    situation: '자취방 침대 옆 밤 11시',
    narratorText: '양치를 다 마치고 잘 자려고 누웠는데 손목의 스마트워치가 징 진동하며 [오늘 활동량 9,850보. 조금만 더 걸으면 만 보 활동 링이 완성됩니다!] 알림을 보냅니다. 150보만 채우면 온전한 건강 링 아이콘이 번쩍이며 도파민을 줄 것 같습니다. 잘 것인가, 채울 것인가? 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['스마트워치', '만보채우기', '제자리뛰기'],
    choices: [
      {
        id: 'choice_funny_random_11_1',
        text: '침대에서 스프링처럼 일어나 내복 차림으로 방바닥을 쿵쾅대며 제자리 뛰기와 발구르기 유산소를 시전해 기필코 만 보 링을 채운다.',
        intent: '제자리 유산소 만보 사수',
        immediateEffects: [
          { stat: 'hp', value: 12 },
          { stat: 'familySatisfaction', value: 10 },
          { stat: 'mental', value: 10 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '만 보가 완성되자 시계화면에 불꽃 축제 그래픽이 터졌습니다. 소소한 건강 성취감 도파민을 한껏 쥐고 기쁘게 수면에 들었습니다.'
      },
      {
        id: 'choice_funny_random_11_2',
        text: '스마트워치를 풀어서 책상 서랍 속에 던져 버리고 이불을 턱밑까지 감싸 침묵 수면을 지속한다.',
        intent: '워치 해제 완전 숙면',
        immediateEffects: [
          { stat: 'mental', value: 15 },
          { stat: 'hp', value: 10 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '알림 강박에서 해방되어 아주 부드럽고 평온하게 깊은 숙면 체력 회복을 사수해 냈습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_random_22',
    dayRange: [1, 30],
    title: '주말 넷플릭스 16부작 좀비 정주행 대란',
    category: 'random',
    situation: '금요일 저녁 자취방',
    narratorText: '금요일 밤 9시, "방학 전 힐링 예능 드라마 1화만 맛보기로 보고 자야지" 하며 넷플릭스를 켰습니다. 그런데 각 화의 마지막 장면이 너무 쫄깃하여 나도 모르게 [다음 화 재생] 버튼을 새벽 내내 클릭했습니다. 정신을 차려보니 토요일 아침 8시 해가 중천에 떴고 16부작 정주행이 완수되었습니다. 눈은 시뻘겋고 온몸이 찌뿌둥합니다. 어떻게 수습하시겠습니까?',
    weight: 100,
    tags: ['넷플릭스', '좀비정주행', '새벽샘'],
    choices: [
      {
        id: 'choice_funny_random_22_1',
        text: '즉시 커튼을 쳐 방을 암실로 셋팅하고 힐링 귀마개를 착용한 채 토요일 오후 4시까지 긴급 숙면 좀비 회복실을 가동한다.',
        intent: '암실 긴급 수면 회복',
        immediateEffects: [
          { stat: 'hp', value: 15 },
          { stat: 'mental', value: 10 },
          { stat: 'burnout', value: -5 }
        ],
        resultText: '토요일 늦은 오후 개운하게 눈을 떴습니다. 드라마 대박 수급의 만족감을 품에 안고 건강한 저녁밥을 지어 먹었습니다.'
      },
      {
        id: 'choice_funny_random_22_2',
        text: '초췌한 눈빛으로 커피 두 잔을 들이키며 동네 헬스장에 가 혼신의 데드리프트를 당기며 근육 각성을 시도한다.',
        intent: '헬스장 근육 각성 운동',
        immediateEffects: [
          { stat: 'hp', value: -15 },
          { stat: 'expert', value: 10 },
          { stat: 'mental', value: 12 }
        ],
        resultText: '근육에 묵직한 펌핑이 들어왔습니다. 몸은 피곤했으나 신체 단련과 정신력 극복에 뿌듯한 보람을 느꼈습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_random_23',
    dayRange: [1, 30],
    title: '교무실 프라이버시 모니터 보안 필름 거북목 소동',
    category: 'random',
    situation: '교무실 내 자리',
    narratorText: '학부모 상담 자료와 성적 기안 보안을 위해 내 노트북 모니터 화면에 특수 보안 정보 필름을 부착했습니다. 그런데 필름 시야각이 너무 좁아서 정면 정자세 90도 각도에서만 화면이 보이고 조금만 비껴 앉으면 검은 불통 화면이 됩니다. 어느새 글자를 읽기 위해 모니터 코앞 10cm까지 턱을 뻗고 있는 거북목 포즈의 나를 발견했습니다. 어떻게 조치하시겠습니까?',
    weight: 100,
    tags: ['보안필름', '거북목위기', '안구피로'],
    choices: [
      {
        id: 'choice_funny_random_23_1',
        text: '보안 필름을 즉시 떼어내고, 대신 교무실 뒤쪽 보행자 시선을 차단하도록 등 뒤 파티션 높낮이 연장 설비를 행정실에 기부 요청한다.',
        intent: '파티션 연장 및 필름 해제',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'adminPower', value: 10 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '파티션 연장 보강판이 설치되어 안구 피로도와 거북목 압박에서 완벽하게 해방되었습니다. 쾌적한 결재 보안 환경을 사수했습니다.'
      },
      {
        id: 'choice_funny_random_23_2',
        text: '거북목 방지 독서 책받침대를 모니터 밑에 거치하여 모니터 높이를 강제로 안구 수평선으로 맞추는 웰빙 정돈을 한다.',
        intent: '책받침 거치 안구 수평',
        immediateEffects: [
          { stat: 'hp', value: 12 },
          { stat: 'mental', value: 10 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '모니터 높이가 정돈되어 목디스크 뻐근함이 크게 경감되었습니다. 지적인 스마트 교사 책상이 셋팅되었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_random_24',
    dayRange: [1, 30],
    title: '등교길 문전 컵떡볶이 학생 5명 포위 대란',
    category: 'random',
    situation: '학교 앞 분식집',
    narratorText: '금요일 퇴근길, 학교 앞 골목 추억의 대왕 분식집에서 꼬치 어묵 국물과 빨간 떡볶이를 맛있게 컵에 담아 호호 불며 먹고 있었습니다. 그 순간 우리 반 남학생 5명이 자전거를 타고 골목으로 돌입하더니 나를 발견하고 포위했습니다! "와! 담임 선생님이다! 선생님, 컵떡볶이 1개씩만 쏴 주세요!" 똥그란 강아지 눈들입니다. 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['분식집포위', '컵떡볶이', '자전거비글'],
    choices: [
      {
        id: 'choice_funny_random_24_1',
        text: '"좋아! 대신 이번 주 수학 받아쓰기 모둠 오답 노트를 완벽히 완성해 온다는 딜이다!"라며 5명에게 총 5,000원어치 컵떡볶이를 플렉스한다.',
        intent: '떡볶이 5컵 플렉스 딜',
        immediateEffects: [
          { stat: 'studentTrust', value: 20 },
          { stat: 'mental', value: 12 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '아이들은 "선생님 최고! 3반 만세!"를 연호하며 떡볶이를 흡입했고 월요일에 모둠 오답 노트를 아주 성실하게 완성해 제출했습니다. 교육적 딜 대성공!'
      },
      {
        id: 'choice_funny_random_24_2',
        text: '"아쉽지만 길거리 음식 단 음식은 비만과 충치 위생에 해로우니, 각자 어머님이 싸 주신 웰빙 저녁밥을 맛있게 먹자"라며 정중하게 훈계 지도하고 귀가시킨다.',
        intent: '생활 예절 훈계 귀가',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'classManagement', value: 12 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '아이들은 수긍하며 안전하게 집으로 귀가했습니다. 방과 후 하굣길 안전 수칙을 명확히 각인시켰습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_random_25',
    dayRange: [1, 30],
    title: '길거리 단팥 붕어빵 마차 3천 원 계좌이체 챌린지',
    category: 'random',
    situation: '동네 지하철 역 출구 앞 붕어빵 마차',
    narratorText: '찬바람이 불어 으슬으슬 추운 저녁, 지하철 역 출구 앞 길거리에서 노릇노릇 모락모락 김이 나는 슈크림 단팥 붕어빵 마차를 발견했습니다! 당장 3개에 3,000원어치를 사고 싶어 지갑을 열었으나 카드만 있고 지폐 현금이 한 장도 없습니다. 붕어빵 이모님은 카드 단말기가 없으십니다. 붕어빵을 향한 계좌이체 챌린지, 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['붕어빵', '계좌이체', '단팥슈크림'],
    choices: [
      {
        id: 'choice_funny_random_25_1',
        text: '추위 속에 장갑을 벗고 모바일 뱅킹 앱을 켜서 이모님이 벽에 써붙인 긴 농협 계좌번호 14자리를 덜덜 떨며 입력해 3,000원 이체를 완료하고 뜨끈한 붕어빵 봉지를 쟁취한다.',
        intent: '이체 뱅킹 붕어빵 획득',
        immediateEffects: [
          { stat: 'hp', value: 10 },
          { stat: 'mental', value: 15 },
          { stat: 'burnout', value: -5 }
        ],
        resultText: '품에 안은 붕어빵이 난로처럼 손을 녹여주었습니다. 자취방에 도착해 우유와 함께 먹은 팥 붕어빵은 인생 최고의 도파민 힐링이었습니다.'
      },
      {
        id: 'choice_funny_random_25_2',
        text: '단 음식을 참기로 결심하고 바로 옆 편의점에 들러 웰빙 다이어트 무설탕 아몬드 음료 한 팩을 사 마시며 자취방으로 귀환한다.',
        intent: '무설탕 아몬드 타협 귀가',
        immediateEffects: [
          { stat: 'hp', value: 12 },
          { stat: 'mental', value: 10 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '밀가루 탄수화물과 설탕 섭취를 억제하여 주말 체중 감량과 혈당 스탯 안정 수호에 성공했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_random_26',
    dayRange: [1, 30],
    title: '자취방 청소 중 초등 3학년 주의산만 성적표 발견',
    category: 'random',
    situation: '자취방 책장 앞',
    narratorText: '주말 자취방 대청소를 하던 중, 먼지 쌓인 옛날 상자 구석에서 내 초등학교 3학년 시절 종이 성적표를 발견했습니다! 펼쳐보니 종합 행동 발달 의견 란에 담임 선생님의 친필로 "말이 많고 장난이 심하며 교탁 옆 친구들과 잡담이 잦아 고도의 주의 산만함이 관찰됨"이라고 적힌 흑역사를 포착했습니다. 어떻게 성찰하시겠습니까?',
    weight: 100,
    tags: ['성적표발견', '어릴적흑역사', '자아성찰'],
    choices: [
      {
        id: 'choice_funny_random_26_1',
        text: '"역시 나도 비글단 출신이었구나!"라며 크게 웃고, 내일 교실에서 장난치는 아이들의 눈빛 장난을 역지사지의 마음으로 깊이 포용하기로 결심한다.',
        intent: '비글 동지애 정서적 수용',
        immediateEffects: [
          { stat: 'studentTrust', value: 18 },
          { stat: 'mental', value: 15 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 5 }
        ],
        resultText: '교정에서 비글 장난을 치는 동우에게 화내는 대신 윙크를 던지며 넉살 좋게 다독였습니다. 아이들이 담임 선생님의 넓은 우주적 포용력에 감복했습니다.'
      },
      {
        id: 'choice_funny_random_26_2',
        text: '성적표 종이를 앨범 사진 철에 고이 보관하고 교사 연구 노트에 초등 아동 심리 행동 발달의 장기 관찰 팁을 교재 연구용으로 필기해 둔다.',
        intent: '성적표 보관 및 교직 연구 기록',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '아동 관찰 지표 데이터에 대한 통찰이 깊어져 학부모 진로 상담 시 우수한 정서적 설득력을 확보했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_random_27',
    dayRange: [1, 30],
    title: '비 오는 출근길 체육관 앞 물웅덩이 슬라이딩 대참사',
    category: 'random',
    situation: '학교 정문 앞 진흙밭 물웅덩이',
    narratorText: '비 오는 아침 조회 시작 5분 전, 급한 행정 결재 서류철을 품에 안고 체육관 앞 흙길을 뛰어 지나가던 중, 물웅덩이에 디딘 구두가 제어력을 잃고 "지이익!" 미끄러지며 야구 슬라이딩을 감행했습니다. 5미터를 진흙 속에 미끄러져 슬랙스 엉덩이가 완벽한 갈색으로 염색되었습니다. 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['슬라이딩사고', '바지염색', '보건실구호'],
    choices: [
      {
        id: 'choice_funny_random_27_1',
        text: '보건실로 엉덩이를 가린 채 게걸음 대피하여 보건 선생님께 보조용 체육 교사 파란색 트레이닝 바지를 빌려 입고 하루를 보낸다.',
        intent: '보건실 파란 체육복 수급',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'hp', value: 5 },
          { stat: 'mental', value: 10 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '파란색 체육복 바지가 아주 편안하여 하루 종일 에너지가 솟구쳤습니다. 보건 선생님과의 끈끈한 구호 연대가 확립되었습니다.'
      },
      {
        id: 'choice_funny_random_27_2',
        text: '물티슈 1통을 다 문질러 흙탕물을 닦아내고 교탁 뒤에 말뚝처럼 서서 엉덩이 진흙 자국을 철저히 교무실 의자 뒤로 은폐한다.',
        intent: '교탁 은폐 및 물티슈 세척',
        immediateEffects: [
          { stat: 'classManagement', value: 12 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '하루 종일 의자에 앉은 채 결재를 보냈습니다. 엉덩이 진흙 비밀을 안전하게 봉인하며 하루가 지났습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_random_28',
    dayRange: [1, 30],
    title: '주말 편의점 고단백 초코 음료 1+1 싹쓸이의 도파민',
    category: 'random',
    situation: '동네 편의점 냉장고 앞',
    narratorText: '주말 헬스장 운동을 마치고 단백질 충전을 위해 편의점에 들렀습니다. 내가 평소 좋아하는 꿀맛 고단백 다이어트 초코유 음료 매대에 [1+1 기획 특별 행사] 빨간 스티커가 붙어 있는 것을 목격했습니다! 마침 매대 구석에 정확히 8개의 병이 남아 있습니다. 이 단백질 음료를 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['편의점행사', '고단백초코', '소소한도파민'],
    choices: [
      {
        id: 'choice_funny_random_28_1',
        text: '매대의 8개 병을 양팔 한가득 안고 계산대로 가 1+1 포상을 다 받아 자취방 냉장고 홈바에 반짝이게 도열해 채워둔다.',
        intent: '1+1 음료 8병 싹쓸이 도파민',
        immediateEffects: [
          { stat: 'hp', value: 15 },
          { stat: 'familySatisfaction', value: 15 },
          { stat: 'burnout', value: -10 }
        ],
        resultText: '초코 단백질 병이 냉장고에 꽉 차자 엄청난 시각적 행복 도파민이 터졌습니다. 다음 일주일간 운동 후 영양 걱정은 완벽히 삭제되었습니다.'
      },
      {
        id: 'choice_funny_random_28_2',
        text: '뒤에 올 다른 동네 헬스인들의 영양 보충을 위해 딱 2병(1+1)만 집어 들고 유유히 편의점을 빠져나온다.',
        intent: '헬스 배려 2병 실속 구매',
        immediateEffects: [
          { stat: 'mental', value: 15 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '양보의 미덕을 실천하여 마음의 청량함과 소박한 단백질 힐링을 맛있게 완료했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_random_29',
    dayRange: [1, 30],
    title: '퇴근 후 교탁 지퍼 미스터리 수사극',
    category: 'random',
    situation: '교무실 내 자리 퇴근 전',
    narratorText: '격렬했던 4교시 수업과 급식 지도를 마치고 퇴근하려 자리에서 일어섰습니다. 짐을 싸다가 무심코 내려다본 바지 앞 지퍼가 반쯤 열려 이른바 "남대문"이 개방돼 있는 아찔한 상황을 발견했습니다! 오늘 4교시 내내 도대체 몇 명의 아이들이 이걸 눈치챘을지 등골이 서늘해집니다. 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['지퍼열림', '비밀봉인', '교실미스터리'],
    choices: [
      {
        id: 'choice_funny_random_29_1',
        text: '어차피 교탁 뒤 가림판 덕분에 아이들 시선 높이에서는 안 보였을 거라고 과학적인 가상 각도 시각을 분석해 멘탈을 급속 자가 치유한다.',
        intent: '가상 시야각 과학적 자가치유',
        immediateEffects: [
          { stat: 'mental', value: 15 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '교탁 나무판의 넓은 가림 면적을 계산해 보니 지퍼 각도는 완벽하게 가려졌음이 판명되어 안도의 한숨과 함께 쾌활하게 퇴근했습니다.'
      },
      {
        id: 'choice_funny_random_29_2',
        text: '동료 신규 교사에게 쪽지로 "오늘 교실 순회 지도할 때 바지 결속 상태 체크 팁"을 유머 쪽지로 공유해 서로의 비밀을 지키는 룰을 세운다.',
        intent: '유머러스한 지퍼 경보 전파',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'colleagueSolidarity', value: 15 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '신규 교사들끼리 "어머 저도 그런 적 있어요!"라며 엄청난 웃음꽃 공감 단톡방 수다가 터져 위로를 얻었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_random_30',
    dayRange: [1, 30],
    title: '동창회 번개 카톡 거절의 이불 힐링 기술',
    category: 'random',
    situation: '자취방 침대 위 토요일 저녁',
    narratorText: '토요일 저녁 7시, 고교 동창 6명 메인 방에 "오늘 강남역 삼겹살 소맥 번개 모임 어떰? 다들 8시 정각 집합 고고!"라는 카톡 폭탄 번개가 떨어졌습니다. 하지만 일주일 행정 노역으로 무릎 뼈마디가 쑤셔 이불 밖으로 1cm도 나가고 싶지 않습니다. 어떻게 이불 속 힐링을 수호하시겠습니까?',
    weight: 100,
    tags: ['동창회번개', '이불속수호', '사생활방어'],
    choices: [
      {
        id: 'choice_funny_random_30_1',
        text: '"미안해 친구들아! 학부모 긴급 아동 야간 상담 전화를 대기 대조 중이라 강남역까지 전파가 안 잡힌다 ㅠㅠ 다음엔 내가 쏜다!"라고 공적인 핑계로 정중히 방어한다.',
        intent: '업무 핑계 정중 이불 수호',
        immediateEffects: [
          { stat: 'mental', value: 18 },
          { stat: 'hp', value: 10 },
          { stat: 'familySatisfaction', value: 10 },
          { stat: 'burnout', value: 5 }
        ],
        resultText: '친구들은 "오 역시 참된 은사님 바쁘시군!"이라며 꿀 응원을 보내왔고 따뜻한 꿀물과 함께 이불 속에서 주말 평화를 완벽하게 사수했습니다.'
      },
      {
        id: 'choice_funny_random_30_2',
        text: '눈을 질끈 감고 카카오톡 폰 진동을 무음으로 셋팅한 뒤 홈 피트니스 다리 운동 3세트를 하고 푹 잔다.',
        intent: '진동 무음 정통 수면',
        immediateEffects: [
          { stat: 'hp', value: 12 },
          { stat: 'mental', value: 10 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '다음날 아침 아주 개운하게 눈을 떴습니다. 신체 건강과 정신 안정을 소박하게 지켜냈습니다.'
      }
    ]
  }
];
