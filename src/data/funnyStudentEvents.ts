import type { GameEvent } from '@/game/types';

// ==================== [학생 카테고리 유머 밈 이벤트 30선] ====================
export const funnyStudentEvents: GameEvent[] = [
  {
    id: 'evt_funny_student_01',
    dayRange: [1, 30],
    title: '급식실 메추리알 공중 사태',
    category: 'student',
    situation: '급식실',
    narratorText: '급식 시간에 민우가 메추리알 장조림을 젓가락으로 집으려다 미끄러지는 바람에, 메추리알이 공중으로 높이 솟구쳐 옆 반 담임 선생님의 이마 정중앙에 정확히 명중했습니다! 급식실 전체가 찬물을 끼얹은 듯 조용해집니다. 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['급식실 해프닝', '메추리알 발사', '옆반담임'],
    choices: [
      {
        id: 'choice_funny_student_01_1',
        text: '옆 반 선생님께 즉시 뛰어가 예의 바르게 사과하고 장조림 대신 먹을 음료수를 건넨다.',
        intent: '공식 사과 및 수습',
        immediateEffects: [
          { stat: 'mental', value: 5 },
          { stat: 'colleagueRelation', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '옆 반 선생님은 처음엔 황당해하다가 음료수를 받고 웃으며 넘어가 주셨습니다. 훈훈하게 마무리되었으나 정신이 아찔했습니다.'
      },
      {
        id: 'choice_funny_student_01_2',
        text: '민우에게 탄성력과 각도 조절의 물리적 법칙을 장난스레 설명하며 조심해서 먹도록 지도한다.',
        intent: '유머러스한 생활지도',
        immediateEffects: [
          { stat: 'studentTrust', value: 10 },
          { stat: 'mental', value: 10 },
          { stat: 'expert', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '학생들이 선생님의 재치 있는 과학적(?) 훈화에 깔깔 웃으며 식사 예절의 중요성을 유쾌하게 깨달았습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_student_02',
    dayRange: [1, 30],
    title: '교실 내 지우개 가루 밀거래 카르텔',
    category: 'student',
    situation: '교실',
    narratorText: '쉬는 시간, 교실 뒷자리에서 아이들이 옹기종기 모여 밀거래를 하고 있는 현장을 포착했습니다. 대장은 지우개 가루를 손가락으로 뭉쳐 만든 검은 지우개 똥을 "최상급 흑요석"이라 부르며 다른 아이들의 연필과 물물교환하고 있었습니다. 어떻게 조치하시겠습니까?',
    weight: 100,
    tags: ['교실 카르텔', '지우개똥 거래', '장인정신'],
    choices: [
      {
        id: 'choice_funny_student_02_1',
        text: '거래 중인 "흑요석"을 전량 압수하고, 교실 청소 시간에 지우개 가루 청소 봉사를 시킨다.',
        intent: '시장 경제 통제',
        immediateEffects: [
          { stat: 'classManagement', value: 10 },
          { stat: 'hp', value: -5 },
          { stat: 'burnout', value: 5 }
        ],
        resultText: '압수된 지우개 똥은 쓰레기통으로 향했습니다. 아이들은 실망했으나 교실 바닥은 한결 깨끗해졌습니다.'
      },
      {
        id: 'choice_funny_student_02_2',
        text: '가루를 뭉쳐 창작 활동을 한 장인정신은 칭찬하되, 위생과 정식 학용품 소중함에 대해 타이른다.',
        intent: '창의성 존중 및 훈육',
        immediateEffects: [
          { stat: 'studentTrust', value: 12 },
          { stat: 'mental', value: 10 },
          { stat: 'expert', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '아이들은 선생님의 쿨한 반응에 만족해하며, 흑요석 생산 라인을 중단하고 정상적인 수업 준비로 돌아갔습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_student_03',
    dayRange: [1, 30],
    title: '칠판 속 담임 크로키 대참사',
    category: 'student',
    situation: '교실',
    narratorText: '수업 직전 교실에 들어서니, 칠판에 저를 그린 것으로 강력히 추정되는 거대한 초상화가 그려져 있었습니다. 콧구멍은 주먹만 하고 머리숱은 거의 없는 기괴한 야수파 스타일의 그림입니다. 범인으로 의심되는 준서가 눈치를 보며 칠판지우개를 등 뒤로 숨깁니다. 어떻게 응대하시겠습니까?',
    weight: 100,
    tags: ['칠판낙서', '담임얼굴', '야수파화가'],
    choices: [
      {
        id: 'choice_funny_student_03_1',
        text: '분필을 들고 초상화 옆에 "머리숱 보강 공사"를 직접 그려 넣어 대머리 논란을 유쾌하게 해명한다.',
        intent: '예술적 동참',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'mental', value: 15 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '선생님이 칠판에 머리카락을 풍성하게 덧그리자 반 아이들이 뒤집어지며 자지러집니다. 준서도 안도의 한숨을 내쉬며 교실 분위기가 최고조에 달합니다.'
      },
      {
        id: 'choice_funny_student_03_2',
        text: '준서에게 지우개를 주며 "수업 1분 전이니 미술학원은 방과 후에 열어라"며 칠판을 지우게 한다.',
        intent: '공적 시간 경계 구분',
        immediateEffects: [
          { stat: 'classManagement', value: 10 },
          { stat: 'expert', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '준서는 열심히 칠판을 닦아 깨끗한 수업 환경을 만들었습니다. 수업은 제시간에 차분하게 시작되었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_student_04',
    dayRange: [1, 30],
    title: '천장에 붙어버린 실내화 한 짝',
    category: 'student',
    situation: '교실',
    narratorText: '교실 청소 시간, 하늘이와 동우가 발야구 흉내를 내며 실내화를 발가락 끝으로 차 올리다가 그만 한 짝이 교실 천장의 텍스 틈새에 끼어 매달렸습니다. 실내화가 대롱대롱 매달려 낙하 직전입니다. 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['실내화투척', '천장안착', '물리공격'],
    choices: [
      {
        id: 'choice_funny_student_04_1',
        text: '교탁 옆 빗자루를 길게 뻗어 안전하게 실내화를 떼어내고, 둘에게 실내화 닦기 숙제를 준다.',
        intent: '안전 수거 및 훈육',
        immediateEffects: [
          { stat: 'classManagement', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '실내화는 흙먼지를 뿜으며 바닥으로 떨어졌고, 아이들은 조용히 실내화를 닦으며 다음부터는 신발을 던지지 않기로 약속했습니다.'
      },
      {
        id: 'choice_funny_student_04_2',
        text: '체육 선생님의 협조를 구해 강당의 긴 장대를 빌려오며 가벼운 운동 삼아 다녀온다.',
        intent: '외부 도구 활용',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 5 },
          { stat: 'mental', value: 10 },
          { stat: 'burnout', value: -5 }
        ],
        resultText: '체육 부장님이 흔쾌히 도와주셔서 쉽게 수거했습니다. 교무실 선생님들과 한바탕 웃으며 차 한잔 마실 여유를 벌었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_student_05',
    dayRange: [1, 30],
    title: '과학실 돋보기 광선 바지 테러',
    category: 'student',
    situation: '과학실',
    narratorText: '과학 탐구 실험 시간, 태양광의 굴절과 렌즈 초점 맞추기 실습을 하던 중, 지성이가 돋보기 초점을 짝꿍 웅이의 검은색 면바지 엉덩이 부분에 조준했습니다. 잠시 후 웅이가 "악! 뜨거워!"를 외치며 펄쩍 뛰어올랐고, 웅이의 바지 엉덩이에서는 얇은 연기가 모락모락 피어오릅니다. 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['과학실험', '돋보기사고', '엉덩이화재'],
    choices: [
      {
        id: 'choice_funny_student_05_1',
        text: '지성이를 안전교육 위반으로 즉시 격리하고 과학실 청소 지도 및 실험 주의 지침을 재교육한다.',
        intent: '안전사고 재발 방지',
        immediateEffects: [
          { stat: 'expert', value: 10 },
          { stat: 'classManagement', value: 10 },
          { stat: 'mental', value: -5 }
        ],
        resultText: '엄격한 훈계 덕에 과학실 내의 장난이 싹 사라졌습니다. 웅이의 바지는 다행히 구멍만 살짝 뚫렸고 다치지는 않았습니다.'
      },
      {
        id: 'choice_funny_student_05_2',
        text: '웅이의 엉덩이에 급히 찬물을 뿌려 진정시키고 보건실로 보내 상태를 점검하게 한다.',
        intent: '신속한 응급처치',
        immediateEffects: [
          { stat: 'studentTrust', value: 12 },
          { stat: 'hp', value: -5 },
          { stat: 'mental', value: 5 }
        ],
        resultText: '보건실 검사 결과 엉덩이에 붉은 자국만 났을 뿐 큰 화상은 아니었습니다. 웅이는 선생님의 빠른 수습에 고마워합니다.'
      }
    ]
  },
  {
    id: 'evt_funny_student_06',
    dayRange: [1, 30],
    title: '기상천외한 받아쓰기 창조론',
    category: 'student',
    situation: '교실',
    narratorText: '받아쓰기 채점을 하던 중 한 아이의 답안지에서 눈이 멈췄습니다. "할아버지가 밭을 가신다"라는 문제를 아이는 "하라버지 가 바틀 가신다"를 넘어 "해골바가지 바틀 박살낸다"로 기상천외한 판타지 소설을 창조해 적어 놓았습니다. 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['받아쓰기', '한글창제', '판타지오답'],
    choices: [
      {
        id: 'choice_funny_student_06_1',
        text: '정성껏 틀린 맞춤법을 빨간 펜으로 고쳐주고, 방과 후에 오답 노트를 3번 쓰도록 지도한다.',
        intent: '원칙적 맞춤법 교정',
        immediateEffects: [
          { stat: 'expert', value: 12 },
          { stat: 'burnout', value: 5 }
        ],
        resultText: '아이는 투덜대면서도 오답을 고치며 올바른 한글 표기법을 학습했습니다. 학력 향상에는 도움이 되었습니다.'
      },
      {
        id: 'choice_funny_student_06_2',
        text: '아이의 무한한 문학적 상상력에 피식 웃으며, 개별적으로 단어를 재치 있게 발음 대조 지도한다.',
        intent: '감성 피드백 및 발음 지도',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'mental', value: 15 },
          { stat: 'expert', value: 5 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '선생님이 빵 터지자 아이는 쑥스러워하면서도 신이 나 한글 쓰기 연습에 한층 긍정적인 흥미를 가지게 되었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_student_07',
    dayRange: [1, 30],
    title: '화장실 폭발음 복도 생중계 사건',
    category: 'student',
    situation: '복도',
    narratorText: '종소리 나고 복도를 지나가는데 화장실 창문 틈새로 엄청나게 우렁찬 가스 방출음과 배변 소리가 복도 교실 창문까지 쩌렁쩌렁 메아리쳤습니다. 아이들이 복도에서 "우와! 폭탄 터졌다!"라며 문 앞에서 낄낄대고 있습니다. 어떻게 지도하시겠습니까?',
    weight: 100,
    tags: ['생리현상', '복도소동', '가스폭발'],
    choices: [
      {
        id: 'choice_funny_student_07_1',
        text: '복도에 모여 조롱하는 학생들을 즉각 교실로 들여보내고, 타인의 생리 현상을 존중하라고 훈육한다.',
        intent: '엄격한 인권/예절 훈육',
        immediateEffects: [
          { stat: 'classManagement', value: 12 },
          { stat: 'expert', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '아이들은 장난기를 멈추고 부끄러워하며 교실로 복귀했습니다. 화장실 내부의 학생도 큰 수치심 없이 탈출할 수 있었습니다.'
      },
      {
        id: 'choice_funny_student_07_2',
        text: '아이들에게 웃음을 참으며 "인간의 자연스러운 생리 현상일 뿐이니 흩어지자"라며 주의를 환기시킨다.',
        intent: '온건한 해산 및 유머 대응',
        immediateEffects: [
          { stat: 'studentTrust', value: 10 },
          { stat: 'mental', value: 12 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '아이들은 선생님의 털털한 정리에 웃으며 흩어졌고, 화장실 안 주인공의 익명성과 프라이버시가 안전하게 수호되었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_student_08',
    dayRange: [1, 30],
    title: '은밀한 대왕 딱지 판돈 논쟁',
    category: 'student',
    situation: '교실',
    narratorText: '아침 조회 전, 교실 뒷자리에서 고성이 터져 나왔습니다. 정우가 지용이에게 전 재산인 "대왕 플라스틱 딱지"를 피망 딱지 10개와 교환했으나 집에 갈 때 지용이가 거래 취소를 요구하며 울어버렸습니다. 판돈(?) 조율을 요청해 옵니다. 어떻게 중재하시겠습니까?',
    weight: 100,
    tags: ['딱지거래', '판돈분쟁', '눈물의호소'],
    choices: [
      {
        id: 'choice_funny_student_08_1',
        text: '학교 내 물건 거래 금지 규칙에 근거해 거래를 무효화하고 각자 물건을 돌려주게 한다.',
        intent: '원칙 중심 거래 철회',
        immediateEffects: [
          { stat: 'classManagement', value: 12 },
          { stat: 'expert', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '강제 환불 조치로 소동이 진정되었습니다. 두 아이 모두 약간 시무룩하지만 교실 질서는 안전하게 회복되었습니다.'
      },
      {
        id: 'choice_funny_student_08_2',
        text: '서로 합의하여 빌려주는 대여 계약서(?)를 작성하게 하고 다음 주에 반납하게 중재한다.',
        intent: '창의적 계약식 중재',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'mental', value: 10 },
          { stat: 'expert', value: 8 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '아이들은 볼펜으로 서명한 딱지 대여 서명 양식에 흡족해하며 기쁘게 타협했습니다. 생활 지도 역량이 크게 인정받았습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_student_09',
    dayRange: [1, 30],
    title: '담임 선생님의 나이 탐정단',
    category: 'student',
    situation: '교실',
    narratorText: '수업 도중 아이들이 갑자기 담임 선생님의 나이 맞추기 추리쇼를 열었습니다. 리더인 윤아가 진지한 얼굴로 "우리 엄마가 서른여덟이니까 선생님은 머리 주름 보니까 오십 살인 것 같아!"라며 엄청난 확신을 보입니다. 반 전체가 웅성거리며 동의하는 눈빛입니다. 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['나이추리', '팩트폭력', '노안논란'],
    choices: [
      {
        id: 'choice_funny_student_09_1',
        text: '정색하지 않고 칠판에 큰 하트를 그리며 "선생님은 평생 영원한 스무 살 청춘이란다"라며 장난스레 받아친다.',
        intent: '유머러스한 방어',
        immediateEffects: [
          { stat: 'studentTrust', value: 12 },
          { stat: 'mental', value: 15 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '아이들은 "예이 거짓말쟁이!"라며 웃어젖혔고, 나이 논란은 화기애애하게 종결되었습니다. 마음 상하지 않고 방어해 냈습니다.'
      },
      {
        id: 'choice_funny_student_09_2',
        text: '주민등록증이나 정식 교사 프로필을 슬쩍 환기하며 "선생님 아직 젊다"고 팩트로 대처한다.',
        intent: '사실 확인 교육',
        immediateEffects: [
          { stat: 'mental', value: 5 },
          { stat: 'expert', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '생각보다 선생님이 젊다는(?) 사실에 아이들이 깜짝 놀라며 교사에 대한 동경과 호감이 약간 올랐습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_student_10',
    dayRange: [1, 30],
    title: '사마귀 교실 무단 침입 대소동',
    category: 'student',
    situation: '교실',
    narratorText: '수학 단원 평가를 보던 평화로운 교실에 방충망 틈새를 뚫고 거대한 녹색 사마귀 한 마리가 날아 들어왔습니다! 사마귀가 앞다리를 쳐들자 뒤쪽 남학생들과 여학생들이 책상 위로 올라가 교실 전체가 비명과 비명으로 난장판이 되었습니다. 어떻게 수습하시겠습니까?',
    weight: 100,
    tags: ['곤충침입', '교실난장판', '사마귀공습'],
    choices: [
      {
        id: 'choice_funny_student_10_1',
        text: '교사용 교실 빗자루와 쓰레받기를 사용해 사마귀를 신속하게 포획하여 화단 밖으로 방생한다.',
        intent: '신속한 물리적 포획 및 구출',
        immediateEffects: [
          { stat: 'classManagement', value: 15 },
          { stat: 'hp', value: -5 },
          { stat: 'mental', value: 5 }
        ],
        resultText: '선생님의 노련하고 신속한 대처에 사마귀는 숲으로 무사히 쫓겨났고, 아이들은 "와 선생님 구세주다!"라며 안심하고 시험에 복귀했습니다.'
      },
      {
        id: 'choice_funny_student_10_2',
        text: '과학 동호회 출신 아이에게 생태 관찰통을 가져오게 하여 잠시 관찰한 뒤 방생하게 유도한다.',
        intent: '생태 관찰 교육 연계',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'expert', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '곤충 소동이 순간 생태 체험 학습으로 전환되었습니다. 아이들은 사마귀의 사냥 흉내에 흥미로워하며 자연친화적인 마무리에 기뻐했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_student_11',
    dayRange: [1, 30],
    title: '급식 스파게티 빨간 수염 신선',
    category: 'student',
    situation: '급식실',
    narratorText: '급식 메뉴로 토마토 오븐 스파게티가 나온 날, 예찬이가 면치기를 격렬하게 하다가 소스를 볼과 입 주변에 빨갛게 잔뜩 묻혔습니다. 그리곤 턱 밑까지 묻은 소스를 가리키며 "선생님, 저 산타할아버지 같죠? 메리 크리스마스!"라며 급식판을 들고 산신령 흉내를 냅니다. 어떻게 지도하시겠습니까?',
    weight: 100,
    tags: ['급식스파게티', '산타흉내', '식사예절'],
    choices: [
      {
        id: 'choice_funny_student_11_1',
        text: '물티슈를 한 장 뽑아주며 "빨간 수염 신선님, 식사 예절을 지키고 입을 닦아주세요"라고 웃으며 훈육한다.',
        intent: '유머러스한 위생 지도',
        immediateEffects: [
          { stat: 'studentTrust', value: 12 },
          { stat: 'mental', value: 12 },
          { stat: 'expert', value: 5 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '예찬이는 머쓱해하며 물티슈로 입가를 닦았고, 다른 아이들도 식판 주변을 깔끔하게 정리하며 식사를 맛있게 마쳤습니다.'
      },
      {
        id: 'choice_funny_student_11_2',
        text: '조용히 다가가 식사 도중 장난을 치면 체할 수 있음을 엄중하고 정중하게 고지한다.',
        intent: '단호한 기본 생활 지도',
        immediateEffects: [
          { stat: 'classManagement', value: 10 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '급식실 질서가 단번에 정돈되었습니다. 예찬이는 남은 음식을 소리 없이 얌전하게 완식했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_student_12',
    dayRange: [1, 30],
    title: '원어민 영어 수업 피카츄 작명 사건',
    category: 'student',
    situation: '교실',
    narratorText: '원어민 선생님과 함께하는 영어 회화 시간, 아이들이 각자 영어 이름을 짓는 활동을 하고 있습니다. 하준이가 손을 번쩍 들더니 자신의 영어 이름을 "Pikachu(피카츄)"로 하겠다고 고집을 부려 원어민 선생님이 무척 곤란한 표정으로 쳐다봅니다. 어떻게 중재하시겠습니까?',
    weight: 100,
    tags: ['영어수업', '피카츄이름', '원어민소동'],
    choices: [
      {
        id: 'choice_funny_student_12_1',
        text: '하준이에게 "피카츄는 캐릭터 이름이니 해리포터나 피터팬 같은 영문 이름으로 고르자"고 타협을 유도한다.',
        intent: '적절한 대안 타협',
        immediateEffects: [
          { stat: 'expert', value: 10 },
          { stat: 'mental', value: 10 },
          { stat: 'studentTrust', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '하준이는 고민 끝에 해리포터의 "Harry"를 택했습니다. 원어민 선생님도 흡족한 미소를 띠며 고마워하셨습니다.'
      },
      {
        id: 'choice_funny_student_12_2',
        text: '원어민 선생님에게 "아이의 영어 흥미 유발을 위해 일주일만 피카츄로 부르게 허용하자"고 귓속말로 중재한다.',
        intent: '창의적 허용 중재',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'mental', value: 10 },
          { stat: 'colleagueRelation', value: 5 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '교실 전체가 "피카츄!"를 연호하며 영어 시간이 활기로 가득 찼습니다. 하준이의 영어 수업 흥미도가 폭발적으로 상승했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_student_13',
    dayRange: [1, 30],
    title: '리코더 콧구멍 듀엣 대참사',
    category: 'student',
    situation: '교실',
    narratorText: '음악 시간, 리코더 3중주 연습이 한창인 교실에서 지환이와 동우가 리코더 마우스피스를 입이 아닌 각자의 오른쪽 콧구멍에 꼽고 듀엣 연주를 선보이고 있는 기괴한 광경을 발견했습니다. 소독과 예절 지도가 시급합니다. 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['음악시간', '콧구멍리코더', '생화학연주'],
    choices: [
      {
        id: 'choice_funny_student_13_1',
        text: '즉시 리코더 연주를 중단시키고, 물비누와 소독용 알코올을 주어 화장실에서 직접 세척 소독하도록 명령한다.',
        intent: '엄격한 위생 훈육',
        immediateEffects: [
          { stat: 'classManagement', value: 12 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 5 }
        ],
        resultText: '아이들은 코로 불면 악기가 망가지고 세균이 번식한다는 훈계를 듣고 부끄러워하며 화장실로 가 깨끗하게 리코더를 소독해 왔습니다.'
      },
      {
        id: 'choice_funny_student_13_2',
        text: '피식 웃음을 참으며 "선생님은 코 대신 입으로 연주하는 정상적인 듀엣을 감상하고 싶다"고 정중히 타일러 바로잡는다.',
        intent: '부드럽고 품격 있는 유도',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'mental', value: 15 },
          { stat: 'expert', value: 5 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '아이들은 깔깔 웃으며 리코더를 깨끗이 닦았고, 다음부터는 정상적으로 입을 모아 아름다운 소리로 화음을 맞췄습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_student_14',
    dayRange: [1, 30],
    title: '교문 앞 지각 면피 슬라이딩',
    category: 'student',
    situation: '교문',
    narratorText: '아침 교문 앞 등교 안전 지도 시간, 등교 종료종이 치기 5초 전 저 멀리서 지성이가 흙먼지를 일으키며 질주해 오더니 교문 선을 넘기 위해 야구선수처럼 슬라이딩을 감행했습니다. 흙먼지와 함께 제 구두 바로 앞에 머리를 파묻고 누워 헉헉거립니다. 어떻게 응대하시겠습니까?',
    weight: 100,
    tags: ['등교지도', '지각면피', '야구슬라이딩'],
    choices: [
      {
        id: 'choice_funny_student_14_1',
        text: '무릎과 바지의 흙을 털어주며 "세이프는 맞지만 슬라이딩하다 다칠 수 있으니 다음엔 안전하게 30초만 일찍 출근하자"고 타이른다.',
        intent: '따뜻한 안전 훈육',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'mental', value: 12 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '지성이는 다행히 다치지 않았고, 선생님의 유쾌하고 따뜻한 중재에 감사해하며 씩씩하게 인사하고 교실로 달려갔습니다.'
      },
      {
        id: 'choice_funny_student_14_2',
        text: '규정대로 지각 처리 대장에 이름을 기록하고 교문 앞에서는 뛰지 않도록 벌점을 고지한다.',
        intent: '규정 중심 통제',
        immediateEffects: [
          { stat: 'classManagement', value: 10 },
          { stat: 'expert', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '지각을 면하기 위한 무리한 슬라이딩은 교칙 위반임을 경고했습니다. 교문 주변의 등교 속도가 안전하게 조정되었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_student_15',
    dayRange: [1, 30],
    title: '교과서 모서리 졸라맨 플립북',
    category: 'student',
    situation: '교실',
    narratorText: '수업 시간 순회 지도를 하던 중 민혁이의 국어 교과서 모서리가 새까맣게 변해있는 것을 보았습니다. 들춰보니 책장을 빠르게 넘기면 졸라맨이 다른 캐릭터와 격투를 벌이는 고퀄리티 2D 수작업 애니메이션이 완성되어 있었습니다. 민혁이가 긴장하며 교과서를 가슴에 품습니다. 어떻게 지도하시겠습니까?',
    weight: 100,
    tags: ['교과서낙서', '플립북애니', '교실장인'],
    choices: [
      {
        id: 'choice_funny_student_15_1',
        text: '애니메이션 연출력을 칭찬하되, 수업 시간에는 수업용 교과서 내용에 낙서 대신 공책에 필기하라고 설득한다.',
        intent: '창작성 지지와 수업 복귀',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'mental', value: 10 },
          { stat: 'expert', value: 8 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '민혁이는 자신의 그림 재능을 선생님이 알아채 준 것에 감동하여, 교과서를 펴고 정규 한글 받아쓰기 학습에 집중하기 시작했습니다.'
      },
      {
        id: 'choice_funny_student_15_2',
        text: '교과서 훼손 및 수업 태도 불량으로 낙서된 모서리를 지우개로 깨끗이 지우게 한다.',
        intent: '엄격한 교무 원칙',
        immediateEffects: [
          { stat: 'classManagement', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '민혁이는 시무룩하게 고생해 그린 플립북 애니메이션을 지우개로 문질렀습니다. 수업 분위기는 단호하게 조율되었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_student_16',
    dayRange: [1, 30],
    title: '체육 시간 직후 양말 생화학 공습',
    category: 'student',
    situation: '교실',
    narratorText: '뜨거운 햇살 아래 운동장 체육을 마치고 교실에 들어오자마자 가슴을 턱 막히게 하는 시큼하고 찌찌한 묵은 청국장 같은 냄새가 교실을 지배했습니다. 알고 보니 몇몇 남학생들이 양말을 벗고 발바닥을 땀으로 식히고 있었습니다. 교실 생화학 테러 상태입니다. 어떻게 해결하시겠습니까?',
    weight: 100,
    tags: ['체육시간후', '양말냄새', '교실환기'],
    choices: [
      {
        id: 'choice_funny_student_16_1',
        text: '즉시 교실 창문을 전면 개방하고 선풍기를 강풍으로 틀게 한 후, 양말을 반드시 착용하도록 지시한다.',
        intent: '물리적 위생 환경 개선',
        immediateEffects: [
          { stat: 'classManagement', value: 12 },
          { stat: 'hp', value: -5 },
          { stat: 'burnout', value: 5 }
        ],
        resultText: '선풍기와 자연 환기 덕에 냄새가 신속히 정화되었고, 아이들은 양말을 챙겨 신으며 쾌적한 교실 생활 환경으로 회복되었습니다.'
      },
      {
        id: 'choice_funny_student_16_2',
        text: '물휴지와 손세정제를 주어 발을 간단히 닦아 땀을 말리도록 부드럽게 지도한다.',
        intent: '체계적인 위생 조치',
        immediateEffects: [
          { stat: 'studentTrust', value: 12 },
          { stat: 'mental', value: 10 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '아이들이 재미있어하며 발을 뽀송뽀송하게 닦아 냄새의 근원을 소멸시켰습니다. 교사도 안도의 호흡을 내쉬었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_student_17',
    dayRange: [1, 30],
    title: '암호로 적힌 일기장 대도박',
    category: 'student',
    situation: '교실',
    narratorText: '초등 생활 예절 일기장 검사를 하던 중, 민우의 일기장이 펼쳐졌습니다. 본문 전체가 알파벳과 숫자가 뒤섞인 은밀한 스파이 암호 형태로 적혀 있고 맨 밑에만 한글로 "담임만 해독할 수 있는 일기"라고 적혀 있습니다. 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['일기장검사', '암호일기', '담임탐정'],
    choices: [
      {
        id: 'choice_funny_student_17_1',
        text: '암호를 조용히 대조 분석하여 "비밀 젤리 먹은 것 다 안단다"라고 암호 해독 답장을 남겨준다.',
        intent: '재치 있는 암호 해독 동참',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'mental', value: 15 },
          { stat: 'expert', value: 8 },
          { stat: 'burnout', value: 5 }
        ],
        resultText: '민우는 일기장을 돌려받고 선생님의 암호 해독 답장에 소스라치게 놀라며, 담임 선생님을 비밀 첩보원처럼 존경하기 시작했습니다.'
      },
      {
        id: 'choice_funny_student_17_2',
        text: '일기는 타인이 알아볼 수 있는 한글 원칙으로 작성해야 함을 주지시키고 다음엔 한글로 쓰도록 타이른다.',
        intent: '한글 쓰기 원칙 교정',
        immediateEffects: [
          { stat: 'classManagement', value: 10 },
          { stat: 'expert', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '민우는 아쉬워하면서도 다음번 일기에는 정자체 한글로 성실하게 일기를 써왔습니다. 한글 학습 지도에는 성공했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_student_18',
    dayRange: [1, 30],
    title: '받아쓰기 0점의 위풍당당',
    category: 'student',
    situation: '교실',
    narratorText: '받아쓰기 점수가 0점인 지용이가 시험지를 들고 오더니, 전혀 슬픈 기색 없이 해맑게 외칩니다. "선생님, 0은 무한의 가능성이자 우주의 블랙홀 같은 거예요! 제 가능성이 블랙홀처럼 가득 차 있다는 뜻이죠!" 어떻게 대응하시겠습니까?',
    weight: 100,
    tags: ['받아쓰기0점', '초긍정철학', '우주블랙홀'],
    choices: [
      {
        id: 'choice_funny_student_18_1',
        text: '아이의 긍정적인 가치관은 격려하되, 우주의 지식을 채우기 위해 방과 후 5분 낱말 복습 지도를 약속한다.',
        intent: '학습 결손 보충 및 지도',
        immediateEffects: [
          { stat: 'expert', value: 12 },
          { stat: 'studentTrust', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '지용이는 선생님의 격려와 맞춤식 낱말 카드 학습에 집중하여, 다음 받아쓰기 시험에서 당당히 50점을 뚫어냈습니다.'
      },
      {
        id: 'choice_funny_student_18_2',
        text: '"과연 우주급 철학이구나!"라며 크게 웃고 다음 주에는 블랙홀에 한글 단어를 가득 채워오라고 귀엽게 약속한다.',
        intent: '유머러스한 정서 수용',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'mental', value: 12 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '지용이는 선생님이 자신을 무시하지 않고 유머를 인정해 주자 신이 나 스스로 한글 쓰기 동화책을 읽기 시작했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_student_19',
    dayRange: [1, 30],
    title: '체험학습 버스 멀미 도미노 대위기',
    category: 'student',
    situation: '복도',
    narratorText: '수학여행 현장체험학습 버스 안, 굽이진 산길을 달리던 도중 맨 앞줄의 지성이가 "선생님... 울렁거려요..."를 속삭이더니 결국 봉투에 대고 멀미를 시작했습니다. 그 소리를 들은 옆자리의 민석이와 뒷자리의 민우마저 도미노처럼 입을 막으며 울렁거리기 시작합니다. 연쇄 생화학 반응의 위기입니다! 어떻게 해결하시겠습니까?',
    weight: 100,
    tags: ['체험학습버스', '멀미도미노', '생화학위기'],
    choices: [
      {
        id: 'choice_funny_student_19_1',
        text: '신속하게 버스 창문을 살짝 열어 찬바람을 쐬게 하고, 준비해 둔 검은 봉투와 힐링 매실 사탕을 긴급 배포한다.',
        intent: '신속한 응급 장비 가동',
        immediateEffects: [
          { stat: 'expert', value: 12 },
          { stat: 'hp', value: -10 },
          { stat: 'mental', value: 5 }
        ],
        resultText: '매실 사탕의 새콤한 맛과 신선한 자연바람 덕에 멀미 도미노 연쇄 반응을 아슬아슬하게 끊고 안전하게 목적지에 안착했습니다.'
      },
      {
        id: 'choice_funny_student_19_2',
        text: '버스 기사님께 양해를 구해 휴게소나 졸음쉼터에 임시 정차하여 아이들을 내리고 땅을 밟게 한다.',
        intent: '안전 정차 및 휴식',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'mental', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '땅을 밟자 아이들의 속이 진정되었습니다. 도착 예정 시간은 약간 늦어졌으나 안전과 위생을 완벽히 지켰습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_student_20',
    dayRange: [1, 30],
    title: '급식 우유 팩 밟기 분수 쇼',
    category: 'student',
    situation: '교실',
    narratorText: '급식 우유 시간, 윤수가 다 마신 흰 우유 팩의 주둥이를 접어 바닥에 두고 발바닥으로 세차게 밟았습니다. 그 순간 우유 팩 입구에서 미처 마시지 못한 잔여 우유가 강력한 압력 분수가 되어 수직으로 발사되어 교실 천장 텍스를 하얗게 적셨습니다. 어떻게 훈육하시겠습니까?',
    weight: 100,
    tags: ['급식우유', '우유분수', '청소위기'],
    choices: [
      {
        id: 'choice_funny_student_20_1',
        text: '윤수에게 대걸레와 사다리를 주어 천장 우유 얼룩과 교실 바닥을 깨끗이 닦게 하고 반성문을 쓰게 한다.',
        intent: '인과응보적 청소 지도',
        immediateEffects: [
          { stat: 'classManagement', value: 15 },
          { stat: 'hp', value: -5 },
          { stat: 'burnout', value: 5 }
        ],
        resultText: '윤수는 천장 닦기 고생을 겪으며 다시는 우유 팩을 밟지 않겠다고 눈물을 글썽이며 약속했습니다. 교실 질서가 복구되었습니다.'
      },
      {
        id: 'choice_funny_student_20_2',
        text: '윤수에게 물리 법칙에 따른 우유의 사출 현상을 가볍게 설명하고, 교실 청소 자원봉사자로 지정한다.',
        intent: '재치 있는 훈육 적용',
        immediateEffects: [
          { stat: 'studentTrust', value: 12 },
          { stat: 'mental', value: 10 },
          { stat: 'expert', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '윤수는 스스로의 장난에 반성하며 빗자루 청소 당번을 묵묵히 완수했습니다. 훈훈하고 위트 있는 지도로 매듭지었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_student_21',
    dayRange: [1, 30],
    title: '모둠 활동 조장 탄핵 소추안',
    category: 'student',
    situation: '교실',
    narratorText: '국어 모둠 토론 활동 시간, 3모둠 아이들이 잔뜩 화가 난 얼굴로 교탁으로 몰려왔습니다. "선생님, 조장인 준우가 자기는 지시만 하고 저희한테는 발표 자료랑 대본 쓰기만 다 시켜요! 준우 조장을 탄핵해 주세요!" 준우는 억울한 표정으로 뒤에 서 있습니다. 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['모둠활동', '조장탄핵', '정치갈등'],
    choices: [
      {
        id: 'choice_funny_student_21_1',
        text: '역할 분담표를 다시 가져오게 하여 "지시형 리더" 대신 모든 구성원이 한 가지씩 실무 업무를 전담하도록 직접 배분 중재한다.',
        intent: '실무적 역할 재배분',
        immediateEffects: [
          { stat: 'expert', value: 12 },
          { stat: 'classManagement', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '모둠 내 공평한 역할 배분이 정립되었습니다. 준우도 대본 작성 실무를 일부 맡으며 갈등이 깨끗하게 봉합되었습니다.'
      },
      {
        id: 'choice_funny_student_21_2',
        text: '준우에게 리더십의 본질은 솔선수범임을 설명하고 모둠원들에게 피자/간식(젤리) 양보를 유도해 화해시킨다.',
        intent: '리더십 훈화 및 정서 중재',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'mental', value: 12 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '준우가 고맙게도 자신의 사탕을 모둠원들에게 나누어주며 기분 좋게 타협했습니다. 모둠원들의 협동 연대가 더욱 끈끈해졌습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_student_22',
    dayRange: [1, 30],
    title: '체육 피구 시간 자비 없는 강속구',
    category: 'student',
    situation: '운동장',
    narratorText: '반 피구 경기 도중, 예서가 공을 잡더니 무서운 기세로 눈을 부릅뜨고 짝꿍인 유민이를 향해 광속 리턴 슛을 날렸습니다. 유민이는 복부에 불꽃 슛을 맞고 뒤로 튕겨 나갔습니다. 체육 시간이 우정 파괴 피구 전쟁으로 변질되고 있습니다. 어떻게 조치하시겠습니까?',
    weight: 100,
    tags: ['체육피구', '불꽃슛', '우정파괴'],
    choices: [
      {
        id: 'choice_funny_student_22_1',
        text: '즉시 경기를 중단시키고 "피구는 친구를 다치게 하는 전쟁이 아니라 패스로 조율하는 협동 게임"임을 단호하게 교육한다.',
        intent: '단호한 안전/우정 규칙 정비',
        immediateEffects: [
          { stat: 'classManagement', value: 12 },
          { stat: 'expert', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '강속구 투구가 금지되고 양손 바운드 패스 룰을 도입하여, 안전하고 평화로운 피구 놀이로 다시 전환되었습니다.'
      },
      {
        id: 'choice_funny_student_22_2',
        text: '유민이의 상태를 확인해 보건실에 데려가고, 예서에게 유민이의 땀을 닦아주며 사과하도록 정서적으로 유도한다.',
        intent: '정서적 관계 회복',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'mental', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '예서가 유민이에게 달려가 미안하다고 포옹하며 사과했고, 둘은 다시 손을 잡고 사이좋게 체육 활동을 이어갔습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_student_23',
    dayRange: [1, 30],
    title: '청소 빗자루 해리포터 비행 사고',
    category: 'student',
    situation: '교실',
    narratorText: '방과 후 교실 청소 시간, 하늘이가 청소용 플라스틱 빗자루를 가랑이 사이에 끼우고 "님부스 2000! 퀴디치 수색꾼 출격!"을 외치며 책상 사이를 달리다가 교실 사물함 모서리에 부딪혀 사물함 문짝이 어긋나 부서졌습니다. 어떻게 훈육하시겠습니까?',
    weight: 100,
    tags: ['교실청소', '퀴디치비행', '사물함파손'],
    choices: [
      {
        id: 'choice_funny_student_23_1',
        text: '하늘이의 부모님께 연락하여 사물함 힌지 수리 비용에 대해 조율하고, 하늘이에게 반성문 작성을 지시한다.',
        intent: '원칙적 손해 배상 및 훈육',
        immediateEffects: [
          { stat: 'classManagement', value: 12 },
          { stat: 'parentTrust', value: -5 },
          { stat: 'burnout', value: 5 }
        ],
        resultText: '학부모님이 흔쾌히 사과하시며 수리를 지원해주셨습니다. 하늘이도 빗자루 장난이 위험함을 뼈저리게 반성했습니다.'
      },
      {
        id: 'choice_funny_student_23_2',
        text: '하늘이에게 직접 드라이버와 테이프를 쥐여주어 담임 교사 협조 아래 사물함을 스스로 수리 복구하게 유도한다.',
        intent: '자율적 결자해지 복구',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'mental', value: 10 },
          { stat: 'expert', value: 5 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '하늘이가 땀을 뻘뻘 흘리며 사물함 문짝을 똑바로 맞춰 달았습니다. 스스로 책임을 지는 훌륭한 자율성 교육이 완수되었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_student_24',
    dayRange: [1, 30],
    title: '스마트폰 몰래 보기의 기묘한 턱 각도',
    category: 'student',
    situation: '교실',
    narratorText: '수업 도중 뒤쪽의 현우가 교과서를 세워두고 고개를 아래로 90도 꺾은 기묘한 자세로 턱을 가슴에 파묻고 있었습니다. 가까이 다가가 보니 책상 서랍 속에 스마트폰 게임 화면을 몰래 뚫어지라 보고 있었습니다. 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['스마트폰', '몰래게임', '거북목위기'],
    choices: [
      {
        id: 'choice_funny_student_24_1',
        text: '현우의 폰을 즉시 압수하여 종례 시간까지 보관하고, 수업 중 전자기기 무단 사용 규칙에 맞춰 부모님께 통지한다.',
        intent: '교칙에 따른 즉각 제재',
        immediateEffects: [
          { stat: 'classManagement', value: 12 },
          { stat: 'hp', value: 5 },
          { stat: 'parentTrust', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '휴대폰 무단 사용이 엄격히 금지되어 교실 수업 집중도가 올랐습니다. 현우는 부모님의 훈육 지침을 받아 다음엔 폰을 제출했습니다.'
      },
      {
        id: 'choice_funny_student_24_2',
        text: '현우 옆에 다가가 귀에 슬쩍 "현우야, 거북목 예방을 위해 폰은 집에서 편하게 보자"고 조용히 속삭인다.',
        intent: '부드러운 사생활 존중 주의',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'mental', value: 12 },
          { stat: 'expert', value: 5 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '현우는 화들짝 놀라며 폰을 즉시 집어넣었고, 주위 아이들도 선생님의 센스 있는 경고에 감탄하며 수업에 일제히 몰입했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_student_25',
    dayRange: [1, 30],
    title: '공포의 떡보기 오답 사건',
    category: 'student',
    situation: '교실',
    narratorText: '국어 받아쓰기 채점 중, "맛있는 떡볶이"라는 쉬운 문항에서 한 아이가 침샘 자극 스타일 오답인 "맛있는 떡보기"를 적어 둔 것을 발견했습니다. 채점하다가 너무 배가 고파집니다. 어떻게 대응하시겠습니까?',
    weight: 100,
    tags: ['받아쓰기', '한글오답', '떡볶이욕구'],
    choices: [
      {
        id: 'choice_funny_student_06_1',
        text: '빨간 펜으로 정성스레 "떡볶이"로 고쳐주고, 오답 카드를 3번씩 소리 내어 쓰게 지도한다.',
        intent: '원칙 맞춤법 교정',
        immediateEffects: [
          { stat: 'expert', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '아이는 맛있는 단어의 스펠링(?)을 똑바로 인지하며 올바른 표준어를 확실하게 습득했습니다.'
      },
      {
        id: 'choice_funny_student_25_2',
        text: '아이에게 "선생님이 떡보기가 아닌 진짜 떡볶이를 사 먹을 수 있게 한글 퀴즈 맞추기 놀이를 하자"고 유쾌하게 다가간다.',
        intent: '재치 넘치는 동기 부여',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'mental', value: 15 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '아이는 떡볶이 단어 퀴즈를 풀며 신이 났고, 맞춤법 놀이를 재미있는 간식 퀴즈 시간으로 즐기게 되었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_student_26',
    dayRange: [1, 30],
    title: '새 둥지 헤어스타일 팩트 폭격',
    category: 'student',
    situation: '교실',
    narratorText: '바쁜 아침 출근길, 제대로 거울을 보지 못해 머리가 약간 까치집처럼 부스스한 상태로 교실에 들어섰습니다. 맨 앞줄의 은우가 제 머리를 쳐다보더니 해맑은 목소리로 "선생님, 오늘 머리에 참새가 알 낳고 간 새 둥지 같아요! 너무 귀여워요!"라며 팩트 폭력을 가합니다. 어떻게 처신하시겠습니까?',
    weight: 100,
    tags: ['헤어스타일', '새둥지머리', '초딩어록'],
    choices: [
      {
        id: 'choice_funny_student_26_1',
        text: '하하 웃으며 "쉿, 사실 이 머리 안에는 참새의 황금알이 숨겨져 있단다"라고 장난스럽게 받아쳐 교실 분위기를 띄운다.',
        intent: '위트 있는 리액션',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'mental', value: 15 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '아이들이 환호하며 선생님 머리에서 황금알을 찾겠다고 몰려들어 아침 교실이 웃음바다가 되었습니다. 기분 좋은 하루가 시작되었습니다.'
      },
      {
        id: 'choice_funny_student_26_2',
        text: '교실 뒷거울로 가서 단정하게 머리를 빗고, 단정한 용모의 중요성에 대해 짧게 훈화한다.',
        intent: '용모 단정 생활지도',
        immediateEffects: [
          { stat: 'classManagement', value: 10 },
          { stat: 'expert', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '교사가 거울을 보며 솔선수범하자 아이들도 스스로의 머리와 옷매무새를 가다듬으며 단정하게 등교 맞이를 끝냈습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_student_27',
    dayRange: [1, 30],
    title: '수업 도중 모기와의 성전 선포',
    category: 'student',
    situation: '교실',
    narratorText: '사회 역사 수업 도중, 교실 앞쪽 허공에 통통하게 살이 오른 가을 모기 한 마리가 출현했습니다. 아이들은 역사 수업 대신 모기의 궤적에 온 신경을 집중하더니, 급기야 "선생님! 제가 잡을게요!"라며 반 전체가 일제히 손바닥으로 모기를 잡으려 일제 박수를 치는 진풍경이 벌어집니다. 어떻게 대응하시겠습니까?',
    weight: 100,
    tags: ['모기소동', '박수갈채', '집중력분산'],
    choices: [
      {
        id: 'choice_funny_student_27_1',
        text: '모기약을 신속히 살포해 상황을 잠재우고, 다시 칠판으로 이목을 집중시켜 진도를 나간다.',
        intent: '신속한 차단 및 수업 복귀',
        immediateEffects: [
          { stat: 'expert', value: 10 },
          { stat: 'classManagement', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '모기가 격퇴되었고 수업 진도를 지체 없이 무사히 마무리했습니다. 교사로서의 수업 제어력이 발휘되었습니다.'
      },
      {
        id: 'choice_funny_student_27_2',
        text: '아이들에게 "이 모기를 격퇴하는 모둠에게 오늘 청소 면제 쿠폰을 주마!"라며 1분간의 사냥(?) 이벤트를 허용한다.',
        intent: '돌발 이벤트 승화',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'mental', value: 15 },
          { stat: 'burnout', value: -5 }
        ],
        resultText: '엄청난 협동심으로 2모둠이 모기를 안전하게 격살했습니다! 교실은 승리감의 도가니가 되었고 흥미로운 분위기 속에 역사 수업을 유쾌하게 재개했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_student_28',
    dayRange: [1, 30],
    title: '수제 돈가스 쟁탈 최후의 눈치싸움',
    category: 'student',
    situation: '급식실',
    narratorText: '급식 메뉴로 최고 인기 메뉴인 수제 치즈 돈가스가 나왔습니다. 배식이 모두 끝나고 급식 보존용 식판에 돈가스 한 장이 남았습니다. 3명의 남학생이 배식대 주변을 어슬렁거리며 잔여 돈가스 배급을 위한 처절한 갈망의 눈빛을 발사하고 있습니다. 어떻게 조율하시겠습니까?',
    weight: 100,
    tags: ['급식돈가스', '쟁탈전', '가위바위보'],
    choices: [
      {
        id: 'choice_funny_student_28_1',
        text: '공평하게 즉석 가위바위보 단판 승부로 낙찰자를 결정하여 잔반을 배부한다.',
        intent: '공평한 게임 해결',
        immediateEffects: [
          { stat: 'studentTrust', value: 12 },
          { stat: 'mental', value: 10 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '가위바위보 승자가 환호성을 지르며 돈가스를 획득했고, 패자들도 깨끗하게 결과를 승복하며 화기애애하게 급식이 마무리되었습니다.'
      },
      {
        id: 'choice_funny_student_28_2',
        text: '남은 돈가스를 공평하게 3등분하여 사이좋게 나눠서 배분해 준다.',
        intent: '균등 분배',
        immediateEffects: [
          { stat: 'classManagement', value: 10 },
          { stat: 'expert', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '세 아이 모두가 조금씩 맛을 보며 만족스럽게 돈가스를 음미했습니다. 나눔의 가치를 실천한 훌륭한 식생활 지도가 되었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_student_29',
    dayRange: [1, 30],
    title: '외계인 지각 조우 판타지 핑계',
    category: 'student',
    situation: '교실',
    narratorText: '아침 조회 지각 시간이 다 지난 시점에 지훈이가 교실 문을 헐떡이며 열었습니다. 늦은 이유를 묻자, 지훈이는 진지한 얼굴로 "선생님, 오늘 아파트 엘리베이터 앞을 우주선과 외계인이 가로막아서 외교적 협상을 하느라 늦었습니다. 정말이에요!"라며 가슴에 손을 얹습니다. 어떻게 응대하시겠습니까?',
    weight: 100,
    tags: ['지각핑계', '외계인출현', '외교협상'],
    choices: [
      {
        id: 'choice_funny_student_29_1',
        text: '미소와 함께 "위대한 우주 외교관님, 내일부터는 외계인 협상 시간을 고려하여 10분만 우주선을 일찍 타자"며 가볍게 타이른다.',
        intent: '유머러스한 훈육 수용',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'mental', value: 15 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 4 }
        ],
        resultText: '반 아이들이 자지러지며 웃었고, 지훈이도 쑥스럽게 웃으며 다음부터는 외계인(?)을 만나도 지각하지 않게 일찍 등교하겠다고 다짐했습니다.'
      },
      {
        id: 'choice_funny_student_29_2',
        text: '허무맹랑한 핑계는 생활 기록 대장에 지각으로 기록됨을 상기시키고 단호히 경고한다.',
        intent: '사실 중심 규율 확립',
        immediateEffects: [
          { stat: 'classManagement', value: 10 },
          { stat: 'expert', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '성실하고 정직한 등교 태도의 중요성을 강조했습니다. 지훈이는 머쓱하게 인정하고 자리에 가 앉았습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_student_30',
    dayRange: [1, 30],
    title: '책상 위 38선 영토 분쟁 사태',
    category: 'student',
    situation: '교실',
    narratorText: '수업 시간, 짝꿍인 예찬이와 민우가 책상 한가운데에 네임펜으로 진하게 선을 긋고 서로 으르렁거립니다. "선생님! 예찬이 팔꿈치가 1cm 넘어왔어요! 영토 침범이니까 필통을 압수해야 해요!"라며 교실 영토 분쟁 중재를 긴급히 청해옵니다. 어떻게 개입하시겠습니까?',
    weight: 100,
    tags: ['짝꿍갈등', '영토분쟁', '책상38선'],
    choices: [
      {
        id: 'choice_funny_student_30_1',
        text: '자 대고 직접 정밀하게 중간 선을 확인해 주고, 서로 배려하는 짝꿍 조율 계약을 맺게 한다.',
        intent: '공평한 규칙 설정 및 화해',
        immediateEffects: [
          { stat: 'classManagement', value: 12 },
          { stat: 'expert', value: 5 },
          { stat: 'mental', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '서로의 영역을 양보하는 자율적 약속이 맺어졌습니다. 네임펜 흔적을 함께 지우개로 닦아내며 훈훈하게 협동심을 길렀습니다.'
      },
      {
        id: 'choice_funny_student_30_2',
        text: '선을 그은 부분을 지우게 하고, 계속 싸우면 다음 주 짝꿍을 전격 격리 조치하겠다고 선언한다.',
        intent: '단호한 격리 경고',
        immediateEffects: [
          { stat: 'classManagement', value: 10 },
          { stat: 'hp', value: 5 },
          { stat: 'burnout', value: 3 }
        ],
        resultText: '영토 싸움 장난이 즉각 소멸되었습니다. 두 아이는 다음 주에 갈라지기 싫어 얌전하게 협동적으로 수업에 동참했습니다.'
      }
    ]
  }
];
