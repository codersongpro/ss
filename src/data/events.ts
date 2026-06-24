import type { GameEvent } from '@/game/types';

export const gameEvents: GameEvent[] = [
  // ==================== [학부모 악성 민원 사건군 (evt_complaint_01 ~ 03) [NEW]] ====================
  {
    id: 'evt_complaint_01',
    dayRange: [10, 15],
    title: '교탁 밑 도청 녹음기 발견',
    category: 'parent',
    situation: '교실',
    narratorText: '수업을 마치고 교실 교탁 밑을 정리하던 중, 검은 절연테이프로 숨겨진 소형 도청 녹음기가 켜진 채 작동 중인 것을 발견했습니다. 확인 결과 학급 예준이 부모님이 아이 가방과 교탁 밑에 붙여둔 녹음기임이 파악되었습니다. 어떻게 대처하시겠습니까?',
    weight: 120,
    tags: ['민원', '도청', '교권침해'],
    choices: [
      {
        id: 'choice_complaint_01_1',
        text: '통신비밀보호법 위반으로 경찰에 신고하고 교권보호위원회 소집을 강력히 요구한다.',
        intent: '법적 강경 대응',
        immediateEffects: [
          { stat: 'parentComplaint', value: 25 },
          { stat: 'educationSoshin', value: 15 },
          { stat: 'mental', value: -15 },
          { stat: 'colleagueSolidarity', value: 5 }
        ],
        hiddenFlags: ['rules_strict'],
        resultText: '학부모 측은 크게 당황하면서도 "오죽하면 녹음기를 넣었겠느냐, 아동학대로 맞고소하겠다"며 극단적인 민원 공세를 퍼붓기 시작합니다.'
      },
      {
        id: 'choice_complaint_01_2',
        text: '학부모를 조용히 상담실로 불러 녹음 사실을 환기하며 원만한 타협과 대안을 찾는다.',
        intent: '온건적 면담 중재',
        immediateEffects: [
          { stat: 'parentComplaint', value: 5 },
          { stat: 'mental', value: -20 },
          { stat: 'parentTrust', value: 10 },
          { stat: 'colleagueSolidarity', value: -5 }
        ],
        hiddenFlags: ['conflict_avoidance'],
        resultText: '학부모는 도청의 잘못을 시인하고 눈물을 흘리며 사과했습니다. 꼬인 실타래를 풀었으나 교사 본인의 가슴에는 깊은 정서적 상처가 남았습니다.'
      }
    ]
  },
  {
    id: 'evt_complaint_02',
    dayRange: [18, 22],
    title: '상대 학생 즉시 전학 요구',
    category: 'parent',
    situation: '교무실',
    narratorText: '체육 시간 도중 민준이가 넘어지며 지현이와 부딪혀 무릎에 가벼운 찰과상을 입었습니다. 이에 민준이 부모님은 지현이를 학교 폭력 가해자로 즉각 징계하고 다른 학교로 강제 전학시킬 것을 강력히 촉구하며 매일 아침 교무실로 전화를 걸어옵니다.',
    weight: 120,
    tags: ['민원', '학폭', '관계갈등'],
    choices: [
      {
        id: 'choice_complaint_02_1',
        text: '의도성이 없고 경미한 접촉이므로 전학 처리는 법적으로 불가능함을 정중하지만 단호하게 고지한다.',
        intent: '법적 한계 고지 및 원칙 종결',
        immediateEffects: [
          { stat: 'parentComplaint', value: 30 },
          { stat: 'educationSoshin', value: 10 },
          { stat: 'parentTrust', value: -15 },
          { stat: 'colleagueSolidarity', value: 5 }
        ],
        hiddenFlags: ['rules_strict'],
        resultText: '민준 부모님은 "교사가 가해 학생을 비호하며 학폭을 은폐 축소하려 한다"고 교육청 국민신문고에 실명 민원을 제기했습니다.'
      },
      {
        id: 'choice_complaint_02_2',
        text: '교감 선생님께 공식 중재를 구하고 매뉴얼에 따른 학폭 공동대응과 화해 조정을 진행한다.',
        intent: '관리자 조율 및 분쟁 조정',
        immediateEffects: [
          { stat: 'parentComplaint', value: 10 },
          { stat: 'adminTrust', value: -5 },
          { stat: 'adminPower', value: 10 },
          { stat: 'mental', value: -10 },
          { stat: 'colleagueSolidarity', value: 8 }
        ],
        hiddenFlags: ['collaboration'],
        resultText: '관리자의 노련한 중재와 정식 화해 권고 절차 덕에 학부모들도 감정을 가라앉히고 치료비 실비 정산 선에서 합의했습니다.'
      }
    ]
  },
  {
    id: 'evt_complaint_03',
    dayRange: [24, 28],
    title: '심야 카톡 알림장 항의',
    category: 'parent',
    situation: 'evening',
    narratorText: '일요일 밤 11시 30분, 하은이 어머님으로부터 개인 모바일 카카오톡 메신저로 불만 섞인 폭탄 문자가 날아옵니다. "선생님, 월요일 준비물 공지를 왜 늦게 올려주시나요? 아이 재우다 깜짝 놀라 다이소에 급하게 다녀왔는데 사과해 주시죠."',
    weight: 120,
    tags: ['민원', '퇴근후연락', '사생활침해'],
    choices: [
      {
        id: 'choice_complaint_03_1',
        text: '근무 시간 외 사적 연락 금지 안내문을 띄우고 월요일 아침 출근 직후 정중하게 회신한다.',
        intent: '사생활 경계 확립',
        immediateEffects: [
          { stat: 'parentComplaint', value: 15 },
          { stat: 'familySatisfaction', value: 15 },
          { stat: 'educationSoshin', value: 10 },
          { stat: 'parentTrust', value: -10 }
        ],
        hiddenFlags: ['family_first'],
        resultText: '개인 휴식을 확보하고 워라밸을 지켰으나, 월요일 아침 교문에 들어서자마자 하은 어머님이 교장실로 교사의 태도에 대한 항의 민원을 넣어 소란이 빚어집니다.'
      },
      {
        id: 'choice_complaint_03_2',
        text: '학부모의 과격한 화를 누그러뜨리기 위해 심야 시간임에도 불구하고 곧장 사과와 해명을 섞은 장문의 답장을 보낸다.',
        intent: '감정적 비위 맞추기',
        immediateEffects: [
          { stat: 'parentComplaint', value: -10 },
          { stat: 'burnout', value: 20 },
          { stat: 'mental', value: -15 },
          { stat: 'familySatisfaction', value: -15 }
        ],
        hiddenFlags: ['conflict_avoidance'],
        resultText: '학부모는 납득하며 고맙다고 말했습니다. 하지만 당신을 본인의 개인 비서처럼 여겨 사소한 용무로 수시로 심야 전화를 거는 나쁜 선례를 열고 말았습니다.'
      }
    ]
  },

  // ==================== [카테고리 1: 학생 지도 (evt_student_01 ~ 10)] ====================
  {
    id: 'evt_student_01',
    dayRange: [1, 3],
    title: '새 학기 자리 배치',
    category: 'student',
    situation: '교실',
    narratorText: '3월 초, 아이들이 자리를 바꿔달라며 아우성이다. 성적이 우수하지만 불안이 많은 민준이와, 산만하고 충돌이 잦은 지훈이를 어떻게 배치할까?',
    weight: 100,
    tags: ['자리배치', '신학기'],
    choices: [
      {
        id: 'choice_s01_1',
        text: '민준이와 지훈이를 짝으로 배치해 멘토-멘티로 돕게 한다.',
        intent: '협력과 교우 유도',
        immediateEffects: [
          { stat: 'hp', value: -5 },
          { stat: 'mental', value: -5 },
          { stat: 'studentTrust', value: 10 },
          { stat: 'educationSoshin', value: 5 }
        ],
        delayedEffects: [
          {
            dayTrigger: 4,
            effects: [
              { stat: 'parentTrust', value: -15 }, // 민준 부모님의 학습 방해 항의
              { stat: 'studentTrust', value: -10 } // 민준이의 엄청난 스트레스
            ],
            message: '민준이 어머님으로부터 "지훈이 때문에 공부를 못 하겠다"는 다소 격양된 전화가 왔습니다. 민준이 역시 짝꿍 스트레스를 호소합니다.'
          }
        ],
        hiddenFlags: ['student_center', 'self_sacrifice'],
        resultText: '당장은 두 아이가 교사의 의도를 따르는 듯 보이지만, 민준이의 표정이 어두워지고 지훈이는 수업 시간에 종종 딴청을 부립니다.'
      },
      {
        id: 'choice_s01_2',
        text: '제비뽑기로 무작위 배치를 진행하여 논란의 여지를 없앤다.',
        intent: '공정성과 절차 준수',
        immediateEffects: [
          { stat: 'mental', value: 5 },
          { stat: 'educationSoshin', value: -5 }
        ],
        hiddenFlags: ['fairness', 'conflict_avoidance'],
        resultText: '아이들은 투덜댔지만 절차적 정당성이 있어 누구도 강하게 이의를 제기하지 못합니다. 다만, 서로 서먹한 아이들이 짝이 되어 교실에 어색한 침묵이 흐릅니다.'
      },
      {
        id: 'choice_s01_3',
        text: '개별 면담을 거쳐 성향이 비슷한 아이들끼리 조용히 지정해 준다.',
        intent: '세심한 맞춤형 예방',
        immediateEffects: [
          { stat: 'hp', value: -10 },
          { stat: 'expert', value: 10 },
          { stat: 'studentTrust', value: 10 },
          { stat: 'teachingSatisfaction', value: 5 }
        ],
        hiddenFlags: ['student_center'],
        resultText: '학기 초 교사의 분석력이 빛을 발합니다. 아이들은 큰 트러블 없이 자리에 만족하는 눈치입니다. 다만, 자리를 배치하기 위해 퇴근 시간이 1시간 늦어졌습니다.'
      }
    ]
  },
  {
    id: 'evt_student_02',
    dayRange: [4, 7],
    title: '생성형 AI 과제 제출 논란',
    category: 'student',
    situation: '교실',
    narratorText: '수행평가 보고서 검토 중, 박지훈의 과제물이 지나치게 문장력이 수려하고 용어가 전문적이다. 교사인 당신이 보기엔 인공지능이 대필해준 흔적이 역력한데...',
    weight: 90,
    tags: ['수행평가', 'AI'],
    choices: [
      {
        id: 'choice_s02_1',
        text: '의심은 가지만 물증이 없으므로 다른 학생들과 동일하게 고득점을 준다.',
        intent: '불필요한 갈등 회피',
        immediateEffects: [
          { stat: 'mental', value: 5 },
          { stat: 'educationSoshin', value: -15 },
          { stat: 'expert', value: -5 }
        ],
        delayedEffects: [
          {
            dayTrigger: 10,
            effects: [
              { stat: 'parentTrust', value: -10 },
              { stat: 'studentTrust', value: -10 }
            ],
            message: '수행평가 고득점 결과를 확인한 우등생 학부모들이 "지훈이가 AI를 써서 대충 낸 숙제가 어떻게 만점이냐"며 공정성 문제를 제기해 교무실 분위기가 굳어집니다.'
          }
        ],
        hiddenFlags: ['conflict_avoidance'],
        resultText: '당장의 성가신 확인 절차는 건너뛰었습니다. 하지만 교육자로서의 소신에 마음 한구석이 찝찝해집니다.'
      },
      {
        id: 'choice_s02_2',
        text: '지훈이를 방과 후에 따로 불러 작성한 과정과 주요 키워드의 의미를 차분히 캐묻는다.',
        intent: '개별 확인 및 교육적 계도',
        immediateEffects: [
          { stat: 'hp', value: -5 },
          { stat: 'expert', value: 10 },
          { stat: 'studentTrust', value: 5 }
        ],
        hiddenFlags: ['student_center', 'fairness'],
        resultText: '질문에 땀을 흘리던 지훈이는 결국 학원 형의 도움과 AI 툴을 썼다고 자백했습니다. 직접 수정 보완하도록 재기회를 주고, 정직하게 쓰는 일의 가치를 가르쳤습니다.'
      },
      {
        id: 'choice_s02_3',
        text: '평가 기준표의 규정을 칼같이 적용하여 "대필/표절"로 처리하고 0점 부여 조치를 취한다.',
        intent: '원칙 엄수',
        immediateEffects: [
          { stat: 'adminTrust', value: 5 },
          { stat: 'educationSoshin', value: 10 },
          { stat: 'studentTrust', value: -15 }
        ],
        delayedEffects: [
          {
            dayTrigger: 8,
            effects: [
              { stat: 'hp', value: -10 },
              { stat: 'mental', value: -15 },
              { stat: 'parentTrust', value: -20 }
            ],
            message: '지훈이 부모님이 학교로 전화를 걸어 "아이가 스스로 인터넷을 검색하며 쓴 글을 교사가 확증편향을 가지고 무시했다"며 고성을 질렀습니다.'
          }
        ],
        hiddenFlags: ['performance_center', 'fairness'],
        resultText: '규정을 매우 엄격하고 깨끗하게 지켰습니다. 다만 지훈이는 마음의 문을 완전히 닫은 듯한 싸늘한 눈빛으로 변했습니다.'
      }
    ]
  },
  {
    id: 'evt_student_03',
    dayRange: [8, 12],
    title: '예준이의 수업 중 딴짓',
    category: 'student',
    situation: '교실',
    narratorText: '수학 수업 도중, 예준이가 연습장에 정신없이 무언가를 끄적이고 있다. 다가가서 보니 수학 기호들을 의인화한 정교한 캐릭터 만화 캐릭터들이 가득하다. 눈이 반짝이고 있지만 수학 공부는 손을 놓았다.',
    weight: 85,
    tags: ['수업태도', '진로'],
    choices: [
      {
        id: 'choice_s03_1',
        text: '연습장을 압수하고, 뒤에 서서 수학 문제 5개를 풀고 자리에 앉으라고 훈육한다.',
        intent: '엄격한 수업 통제',
        immediateEffects: [
          { stat: 'mental', value: 5 },
          { stat: 'studentTrust', value: -10 },
          { stat: 'adminTrust', value: 5 }
        ],
        hiddenFlags: ['performance_center'],
        resultText: '반 전체에 팽팽한 긴장감이 돌며 수업 분위기는 즉시 정돈되었습니다. 예준이는 위축된 표정으로 억지로 수학 책을 펼쳤지만 멍하니 칠판을 봅니다.'
      },
      {
        id: 'choice_s03_2',
        text: '지적하되 만화 수준의 정교함을 가볍게 칭찬하고, 쉬는 시간에 연습장을 가져와서 이야기하자고 제안한다.',
        intent: '재능 인정 및 타협',
        immediateEffects: [
          { stat: 'hp', value: -5 },
          { stat: 'studentTrust', value: 15 },
          { stat: 'expert', value: 10 }
        ],
        delayedEffects: [
          {
            dayTrigger: 13,
            effects: [
              { stat: 'parentTrust', value: -10 } // 예준 부모님이 미술 방치 의혹 제기
            ],
            message: '예준이의 만화 솜씨를 장려하고 대화했다는 소식을 듣고 예준 어머님이 "학교에서 미술 바람을 더 불어넣으시면 어떡합니까?"라는 불만 섞인 문자를 발송했습니다.'
          }
        ],
        hiddenFlags: ['student_center'],
        resultText: '예준이는 선생님이 자신의 재능을 알아봐 주었다는 사실에 감격합니다. 수학 시간에는 최소한의 기본 활동을 꼭 마치고 남는 시간에만 만화를 그리기로 조율했습니다.'
      },
      {
        id: 'choice_s03_3',
        text: '아무 말 없이 어깨를 가볍게 톡톡 두드려 수학 교재를 가리킨 후 조용히 지나간다.',
        intent: '비침해적 개입',
        immediateEffects: [
          { stat: 'hp', value: 0 },
          { stat: 'studentTrust', value: 5 }
        ],
        hiddenFlags: ['conflict_avoidance'],
        resultText: '공개적인 망신을 주지 않으면서 스스로 올바른 행동으로 돌아오게 유도했습니다. 예준이는 머쓱해하며 연습장을 덮고 눈치를 봅니다.'
      }
    ]
  },
  {
    id: 'evt_student_04',
    dayRange: [11, 15],
    title: '최하은의 급격한 결석',
    category: 'student',
    situation: '교무실',
    narratorText: '교우 관계에 어려움을 겪던 하은이가 오늘 아침에도 "몸이 아파 학교에 갈 수 없다"며 이틀 연속 질병 결석계를 냈다. 단짝 무리에서 배척당하는 은따 징후가 의심된다.',
    weight: 95,
    tags: ['등교거부', '학교폭력'],
    choices: [
      {
        id: 'choice_s04_1',
        text: '단톡방 대화 내역이나 목격담을 취합하고 공식적으로 전문 위센터(Wee) 상담과 조사를 시작한다.',
        intent: '공식 절차 대응',
        immediateEffects: [
          { stat: 'hp', value: -15 },
          { stat: 'adminPower', value: 10 },
          { stat: 'adminTrust', value: 5 }
        ],
        delayedEffects: [
          {
            dayTrigger: 16,
            effects: [
              { stat: 'colleagueRelation', value: -5 },
              { stat: 'parentTrust', value: 15 } // 하은 부모의 학교 신뢰 회복
            ],
            message: '하은이의 학폭/상담 접수로 관련 공문이 다수 쏟아지며, 동료 교사들의 연대 협조를 구하는 과정에서 업무 강도가 가중되었습니다.'
          }
        ],
        hiddenFlags: ['fairness', 'leadership'],
        resultText: '공식적인 학교 안전망 시스템을 활용해 하은이를 적극 보호하기로 결정했습니다. 하은 부모님은 교사가 책임을 회피하지 않고 나섰다는 것에 크게 위안을 얻었습니다.'
      },
      {
        id: 'choice_s04_2',
        text: '방과 후에 하은이와 1:1 전화 상담을 길게 나누고, 하은이의 말벗이 되어줄 배려 깊은 다른 친구를 연결해준다.',
        intent: '교육적 중재',
        immediateEffects: [
          { stat: 'hp', value: -10 },
          { stat: 'mental', value: -10 },
          { stat: 'studentTrust', value: 20 },
          { stat: 'expert', value: 10 }
        ],
        hiddenFlags: ['student_center', 'self_sacrifice'],
        resultText: '하은이는 교사에게 마음을 열며 단톡방에서 있었던 외로웠던 감정들을 쏟아내며 펑펑 울었습니다. 신뢰를 바탕으로 한 지도로 하은이가 등교할 힘을 다시 얻었습니다.'
      },
      {
        id: 'choice_s04_3',
        text: '아이가 몸이 많이 약해서 그런 듯하니 일단 병원 통원 치료를 잘 받고 쉴 수 있도록 편지를 써서 보낸다.',
        intent: '신중한 관망',
        immediateEffects: [
          { stat: 'hp', value: 5 },
          { stat: 'mental', value: 10 },
          { stat: 'educationSoshin', value: -10 }
        ],
        hiddenFlags: ['conflict_avoidance'],
        resultText: '당장 학급 갈등을 직면하지 않고 회피했습니다. 하은이는 선생님에게 말해봐야 변할 것은 없다는 절망감에 더욱 소외됩니다.'
      }
    ]
  },
  {
    id: 'evt_student_05',
    dayRange: [15, 18],
    title: '급식소 앞의 어깨 충돌 다툼',
    category: 'student',
    situation: '교실',
    narratorText: '급식소 앞에서 박지훈이 다른 반 학생과 어깨가 부딪친 것 때문에 주먹다짐 직전까지 가는 큰 소란이 벌어졌다. 배움터지킴이 선생님이 지훈이를 단단히 붙잡고 학년실로 데리고 왔다.',
    weight: 90,
    tags: ['학교폭력', '생활지도'],
    choices: [
      {
        id: 'choice_s05_1',
        text: '상황을 교감선생님께 즉시 보고하고 학교폭력 규정에 따라 경위서 작성을 지시한다.',
        intent: '안정적 법률 대응',
        immediateEffects: [
          { stat: 'hp', value: -10 },
          { stat: 'adminTrust', value: 10 },
          { stat: 'educationSoshin', value: -5 }
        ],
        hiddenFlags: ['organism_adaptation', 'fairness'],
        resultText: '관리자들은 매뉴얼대로 대처했다며 흡족해합니다. 하지만 지훈이는 억울함에 책상을 쾅 치며 "상대방 녀석이 먼저 욕했다고요!"라고 소리를 지릅니다.'
      },
      {
        id: 'choice_s05_2',
        text: '상대방 교사와 협력하여 두 학생을 한자리에서 만나게 하고, 회복적 대화 모임(화해 중재)을 열어 오해를 풀게 한다.',
        intent: '관계 회복 중재',
        immediateEffects: [
          { stat: 'hp', value: -15 },
          { stat: 'mental', value: -10 },
          { stat: 'studentTrust', value: 15 },
          { stat: 'expert', value: 15 }
        ],
        hiddenFlags: ['student_center', 'collaboration'],
        resultText: '매우 힘들고 에너지가 크게 소모되는 화해 중재 과정이었습니다. 다행히 상대방 교사와 원만하게 소통되어 두 학생은 서로의 오해를 깨닫고 악수하며 마무리했습니다.'
      },
      {
        id: 'choice_s05_3',
        text: '두 아이에게 반성문 한 장씩을 쓰게 한 뒤, 가볍게 악수하게 하고 돌려보낸다.',
        intent: '봉합 및 종결',
        immediateEffects: [
          { stat: 'hp', value: 5 },
          { stat: 'mental', value: 5 },
          { stat: 'studentTrust', value: -10 }
        ],
        delayedEffects: [
          {
            dayTrigger: 20,
            effects: [
              { stat: 'parentTrust', value: -15 }
            ],
            message: '당시 가볍게 악수하고 끝낸 다툼이 앙금으로 남아 주말 학원가에서 다시 충돌하였고, 결국 상대방 학부모가 민원을 접수했습니다.'
          }
        ],
        hiddenFlags: ['conflict_avoidance'],
        resultText: '일단 현장에서는 빠르게 끝을 보았습니다. 아이들은 억지로 화해한 척 악수를 나누었지만, 돌아서는 복도에서 험악한 욕설을 주고받습니다.'
      }
    ]
  },
  {
    id: 'evt_student_06',
    dayRange: [18, 22],
    title: '서연이의 눈물 젖은 공책',
    category: 'student',
    situation: '교실',
    narratorText: '수업 시간이 끝난 방과후, 느리게 학습하는 서연이가 혼자 교실에 남아 빨간 가위표투성이인 수학 시험지를 바라보며 소리 없이 어깨를 들썩이며 눈물을 뚝뚝 흘리고 있다.',
    weight: 80,
    tags: ['학습부진', '정서지원'],
    choices: [
      {
        id: 'choice_s06_1',
        text: '옆에 앉아 조용히 눈물을 닦아주고, "어려운 수학을 포기하지 않은 게 진짜 용기"라며 위로해 준다.',
        intent: '감정 정서적 격려',
        immediateEffects: [
          { stat: 'mental', value: -5 },
          { stat: 'studentTrust', value: 20 },
          { stat: 'expert', value: 5 }
        ],
        hiddenFlags: ['student_center'],
        resultText: '서연이는 눈물을 닦으며 다음에는 하나 더 맞혀보겠다며 수줍게 미소를 지었습니다. 교사를 향한 아이의 신뢰감이 수직 상승했습니다.'
      },
      {
        id: 'choice_s06_2',
        text: '이번 기회에 서연이를 "기초학력 부진아 지원 프로그램(두드림 학교)" 예산 지원 대상에 적극 등록한다.',
        intent: '시스템적 자원 연계',
        immediateEffects: [
          { stat: 'hp', value: -10 },
          { stat: 'adminPower', value: 15 },
          { stat: 'expert', value: 10 }
        ],
        hiddenFlags: ['organism_adaptation', 'fairness'],
        resultText: '학교의 각종 기초학력 보정 자료와 대학생 보조교사 멘토링 매칭 혜택을 서연이에게 연결해주었습니다. 예산 보고 처리를 하느라 행정 역량이 향상되었습니다.'
      },
      {
        id: 'choice_s06_3',
        text: '더 열심히 공부해야 결과를 낼 수 있다고 냉정하게 다독이고 공부 계획표를 스스로 짜서 확인받으라고 지시한다.',
        intent: '학업 목표주의',
        immediateEffects: [
          { stat: 'hp', value: 0 },
          { stat: 'studentTrust', value: -5 },
          { stat: 'educationSoshin', value: -5 }
        ],
        hiddenFlags: ['performance_center'],
        resultText: '서연이는 압박감을 느끼며 공책을 가방에 급하게 쑤셔 넣고 죄송하다며 도망치듯 교실을 나섰습니다.'
      }
    ]
  },
  {
    id: 'evt_student_07',
    dayRange: [22, 25],
    title: '민준이의 시험 불안 폭발',
    category: 'student',
    situation: '교실',
    narratorText: '단원평가 시작 직전, 김민준이 극심한 식은땀을 흘리며 호흡 곤란 증세를 보인다. 책상 위 시험지를 노려보다가 기어코 "시험 못 보겠어요!"라며 머리를 감싸 쥐었다.',
    weight: 90,
    tags: ['시험불안', '위기지도'],
    choices: [
      {
        id: 'choice_s07_1',
        text: '민준이를 보건실로 편안히 보내 쉬게 하고, 이번 시험은 인정점(대체 시험) 처리를 논의하겠다고 안심시킨다.',
        intent: '안전 최우선 대처',
        immediateEffects: [
          { stat: 'hp', value: -5 },
          { stat: 'studentTrust', value: 15 },
          { stat: 'expert', value: 10 }
        ],
        delayedEffects: [
          {
            dayTrigger: 27,
            effects: [
              { stat: 'parentTrust', value: 10 }
            ],
            message: '민준이 학부모로부터 위기 상황에서 아이를 먼저 보살펴 주어 감사하다는 정성 어린 카카오톡 감사 메시지가 도착했습니다.'
          }
        ],
        hiddenFlags: ['student_center'],
        resultText: '보건실 침대에서 안정을 찾은 민준이는 자신을 무작정 다그치지 않은 담임 선생님께 깊은 감사와 안도감을 표했습니다.'
      },
      {
        id: 'choice_s07_2',
        text: '평가의 공정성을 위해 약과 물을 마시게 한 후 교실 뒷자리나 학년 교무실 빈자리에서 시험을 보게 한다.',
        intent: '학업 완수 독려',
        immediateEffects: [
          { stat: 'mental', value: -10 },
          { stat: 'educationSoshin', value: 5 },
          { stat: 'studentTrust', value: -10 }
        ],
        hiddenFlags: ['performance_center', 'fairness'],
        resultText: '아이는 간신히 시험을 끝까지 마쳤습니다. 그러나 교사를 대하는 태도에 약간의 차가운 벽이 생겼으며, 시험 내내 두려움에 떨었습니다.'
      },
      {
        id: 'choice_s07_3',
        text: '시간이 지나면 괜찮아질 것이라 생각하고 교실 밖 복도에 서서 신선한 공기를 쐬다 돌아오라고 말한다.',
        intent: '스스로의 극복 유도',
        immediateEffects: [
          { stat: 'hp', value: 0 },
          { stat: 'mental', value: -5 },
          { stat: 'studentTrust', value: -15 }
        ],
        hiddenFlags: ['conflict_avoidance'],
        resultText: '하마터면 민준이가 복도에서 쓰러질 뻔했습니다. 주변을 지나던 동료 교사가 발견하여 보건실로 긴급 이송했고, 무책임했다는 지적을 동료들 사이에서 받았습니다.'
      }
    ]
  },
  {
    id: 'evt_student_08',
    dayRange: [24, 27],
    title: '수아의 대량 훈련 조퇴 요청',
    category: 'student',
    situation: '교실',
    narratorText: '체육특기자 수아가 다음 주부터 열리는 전국 대회 집중 훈련을 위해 매일 5교시 종료 후 조퇴해야 한다며 훈련 참가 확인 결재 문서를 수줍게 내민다. 교과 교사들은 수아의 학업 결손을 매우 걱정하고 있다.',
    weight: 80,
    tags: ['체육생', '조퇴결재'],
    choices: [
      {
        id: 'choice_s08_1',
        text: '수아의 장래 희망을 위해 서류를 군말 없이 결재하고, 학업 대체 과제를 스스로 정리하도록 격려한다.',
        intent: '자녀 진로 최우선 지원',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'parentTrust', value: 10 },
          { stat: 'expert', value: -5 }
        ],
        hiddenFlags: ['student_center'],
        resultText: '수아는 가벼운 발걸음으로 운동장에 훈련하러 나갔습니다. 그러나 몇몇 핵심 교과 교사들이 "담임이 수아의 성적과 수업 참가를 지나치게 신경 안 쓰는 것 같다"며 눈총을 보냅니다.'
      },
      {
        id: 'choice_s08_2',
        text: '수아와 어머님을 함께 상담실로 불러, 훈련 기간에도 온라인 EBS 클립을 매일 이수하고 담임에게 체크받도록 약속을 받아낸 후 서류를 처리한다.',
        intent: '학습권 보장 및 타협',
        immediateEffects: [
          { stat: 'hp', value: -10 },
          { stat: 'expert', value: 15 },
          { stat: 'parentTrust', value: 15 }
        ],
        hiddenFlags: ['performance_center', 'collaboration'],
        resultText: '수아 어머님은 수아의 기본 학습을 보장해주려는 교사의 따뜻하고 깐깐한 배려에 대단히 감동했습니다. 수아도 힘겨워하긴 했지만 성실히 인강을 들으려 노력합니다.'
      },
      {
        id: 'choice_s08_3',
        text: '공문 규정을 확인하고, 미진한 서류나 날짜 절차에 대한 책임을 묻고 보완될 때까지 결재를 며칠 보류한다.',
        intent: '행정적 꼼꼼함',
        immediateEffects: [
          { stat: 'adminPower', value: 10 },
          { stat: 'studentTrust', value: -10 }
        ],
        hiddenFlags: ['organism_adaptation'],
        resultText: '체육부서 담당 교사 및 외부 코치진이 행정 절차 지연에 불만을 쏟아냈습니다. 결국 형식적 결재를 왜 이렇게 미루냐는 빈축을 동료 교사들로부터 샀습니다.'
      }
    ]
  },
  {
    id: 'evt_student_09',
    dayRange: [26, 29],
    title: '보이지 않게 소외된 소민이의 일기장',
    category: 'student',
    situation: '교실',
    narratorText: '수도 없이 조용해서 학급 명렬표 구석에 있는지 없는지 가끔 잊어버리곤 하던 소민이의 일기장을 우연히 검사하던 중, "아무도 내게 말을 걸지 않는다. 나는 투명 인간이다. 학교가 지옥 같다."는 심각한 낙서를 발견했다.',
    weight: 90,
    tags: ['소외학생', '비상지도'],
    choices: [
      {
        id: 'choice_s09_1',
        text: '하교길에 소민이를 남겨 가볍게 맛있는 간식을 사 주며 일상적인 가벼운 고민부터 따뜻하게 대화를 이끌어낸다.',
        intent: '정서적 래포 형성',
        immediateEffects: [
          { stat: 'hp', value: -5 },
          { stat: 'mental', value: -5 },
          { stat: 'studentTrust', value: 25 },
          { stat: 'expert', value: 10 }
        ],
        hiddenFlags: ['student_center', 'self_sacrifice'],
        resultText: '소민이는 처음에 경계했으나, 담임 선생님의 다정한 떡볶이 상담에 결국 눈물을 글썽이며 학교 안에서 겪은 소외감을 고백했습니다. 깊은 유대감이 생겼습니다.'
      },
      {
        id: 'choice_s09_2',
        text: '학급 자치회의 안건으로 "소외된 친구를 챙겨주는 또래 멘토링 활동"을 기획하여 반 전체가 참여하도록 판을 깐다.',
        intent: '구조적 해결 도모',
        immediateEffects: [
          { stat: 'hp', value: -15 },
          { stat: 'colleagueRelation', value: 5 },
          { stat: 'educationSoshin', value: 15 }
        ],
        hiddenFlags: ['leadership', 'collaboration'],
        resultText: '훌륭한 교육적 기획력입니다. 학급 전반에 고립된 학생을 돌보는 따뜻한 연대의 가치가 심어졌습니다. 다만 행사를 주관하느라 극심한 피로가 몰려옵니다.'
      },
      {
        id: 'choice_s09_3',
        text: '아이의 개인적인 우울 성향일 가능성을 고려하여 교무수첩의 관찰 일지에 조용히 기록한 후 며칠 더 눈여겨보기로 한다.',
        intent: '신중한 관망',
        immediateEffects: [
          { stat: 'mental', value: 5 },
          { stat: 'educationSoshin', value: -10 }
        ],
        hiddenFlags: ['conflict_avoidance'],
        resultText: '교사는 한걸음 뒤로 물러났습니다. 소민이는 아무 일도 일어나지 않는 학교를 바라보며 자신이 철저히 버림받았다고 생각해 마음을 꽁꽁 얼려버립니다.'
      }
    ]
  },
  {
    id: 'evt_student_10',
    dayRange: [28, 30],
    title: '공개 칠판 반항 사건',
    category: 'student',
    situation: '교실',
    narratorText: '아침 조회를 가려고 교실 뒷문을 여니, 칠판 한가운데에 누군가 굵은 빨간 보드마카로 교사를 향해 "선생님 꼰대 같다. 짜증 난다"는 조롱 낙서를 낙서해 두었고, 아이들이 킥킥거리며 웃고 있다.',
    weight: 95,
    tags: ['교권침해', '생활지도'],
    choices: [
      {
        id: 'choice_s10_1',
        text: '이성을 잃지 않고 조용히 칠판을 지운 후, "혹시 내게 건의 사항이 있는 친구는 언제든 교무실로 찾아와 달라"고 차분하고 단호하게 대처한다.',
        intent: '품위와 자제력 유지',
        immediateEffects: [
          { stat: 'mental', value: -10 },
          { stat: 'expert', value: 15 },
          { stat: 'studentTrust', value: 10 }
        ],
        hiddenFlags: ['education_soshin', 'conflict_avoidance'],
        resultText: '반 아이들은 교사의 대인배 같은 침착함에 압도되어 이내 조용해졌습니다. 소란스럽던 킥킥 소리가 사라지고 선생님을 진심으로 리스펙트하는 공기가 퍼집니다.'
      },
      {
        id: 'choice_s10_2',
        text: '자백할 때까지 반 전체를 교실에 서 있게 한 뒤, 필적을 조사하고 철저한 범인 색출을 진행한다.',
        intent: '규율과 사법적 권위 엄수',
        immediateEffects: [
          { stat: 'hp', value: -15 },
          { stat: 'mental', value: -15 },
          { stat: 'studentTrust', value: -25 },
          { stat: 'adminTrust', value: 10 }
        ],
        delayedEffects: [
          {
            dayTrigger: 30,
            effects: [
              { stat: 'parentTrust', value: -20 }
            ],
            message: '낙서를 핑계로 반 전체 학생들에게 집단 연대책임을 물어 가혹하게 훈육했다며 몇몇 성난 학부모님들의 단체 성토 글이 커뮤니티에 올라왔습니다.'
          }
        ],
        hiddenFlags: ['fairness', 'performance_center'],
        resultText: '결국 소리를 지르던 끝에 범인(박지훈)을 잡아내 교무실로 끌고 가 훈계했습니다. 하지만 교실은 공포와 적개심으로 가득 찬 공간이 되었습니다.'
      },
      {
        id: 'choice_s10_3',
        text: '교감선생님께 이 심각한 교권 침해 상황을 즉시 고발하고, 교권보호위원회 소집 절차를 공식 문의한다.',
        intent: '제도적 보호 장치 활용',
        immediateEffects: [
          { stat: 'adminTrust', value: 10 },
          { stat: 'adminPower', value: 10 },
          { stat: 'studentTrust', value: -10 }
        ],
        hiddenFlags: ['organism_adaptation', 'fairness'],
        resultText: '공식 절차대로 보호를 요청했습니다. 교감은 적극 대처를 지시했지만, 동료 교사들 사이에서는 "학급 관리를 저렇게 제도에만 의존하나"라는 미묘한 우려도 나옵니다.'
      }
    ]
  },

  // ==================== [카테고리 2: 학부모 민원 (evt_parent_01 ~ 10)] ====================
  {
    id: 'evt_parent_01',
    dayRange: [2, 5],
    title: '받아쓰기 채점 항의 문자',
    category: 'parent',
    situation: '교무실',
    narratorText: '수업 후 오후 5시 30분, 민준이 어머님에게 연락이 왔다. 어제 치른 받아쓰기 평가에서 민준이가 쓴 글자의 \'ㅁ\' 꼬리가 약간 길어 틀리게 채점한 것에 대한 장문의 불만 문자다. "다른 반은 맞았다고 처리했다는데, 지나치게 야박하시네요."',
    weight: 90,
    tags: ['평가항의', '민원'],
    choices: [
      {
        id: 'choice_p01_1',
        text: '민준이 어머니께 전화를 걸어 채점 기준표의 엄격함에 대해 차근차근 규정을 자세히 설명하고 원칙을 고수한다.',
        intent: '원칙 고수 설명',
        immediateEffects: [
          { stat: 'hp', value: -5 },
          { stat: 'parentTrust', value: -10 },
          { stat: 'educationSoshin', value: 10 }
        ],
        hiddenFlags: ['fairness', 'performance_center'],
        resultText: '기본 규칙을 정확히 어필했습니다. 그러나 학부모는 "선생님이 융통성도 없고 너무 고집이 세시다"라며 전화를 툭 끊어 불신의 단초가 되었습니다.'
      },
      {
        id: 'choice_p01_2',
        text: '어머니의 전화를 받고 당황하여 "다음에는 더 융통성 있게 채점하도록 조치하겠다"고 꼬리를 내리며 한 수 접어준다.',
        intent: '민원 무마 및 양보',
        immediateEffects: [
          { stat: 'mental', value: -5 },
          { stat: 'parentTrust', value: 10 },
          { stat: 'educationSoshin', value: -15 }
        ],
        hiddenFlags: ['conflict_avoidance'],
        resultText: '학부모의 마음은 당장 누그러뜨렸습니다. 하지만 교사로서의 권위와 일관성은 타격을 입었습니다.'
      },
      {
        id: 'choice_p01_3',
        text: '민준이가 글씨 쓰기 습관을 바르게 잡을 수 있도록 교육적 차원에서 한 조치임을 어필하며, 오탈자 오답 노트를 같이 제안한다.',
        intent: '교육적 상담 유도',
        immediateEffects: [
          { stat: 'hp', value: -10 },
          { stat: 'expert', value: 15 },
          { stat: 'parentTrust', value: 15 }
        ],
        hiddenFlags: ['student_center'],
        resultText: '교사의 교육적 소신과 열정이 진심으로 느껴진 상담이었습니다. 학부모는 고집부려 죄송하다며, 아이의 바른 글쓰기 교육에 협조하겠다고 마음을 돌렸습니다.'
      }
    ]
  },
  {
    id: 'evt_parent_02',
    dayRange: [5, 8],
    title: '늦은 밤 학부모의 하소연 전화',
    category: 'parent',
    situation: '집',
    narratorText: '집에서 저녁 10시 30분, 따뜻하게 샤워하고 쉬려는데 지훈이 어머님에게 전화 진동이 울린다. 전화를 받자마자 지훈이의 거친 행동 때문에 본인도 너무 괴롭고 남편과 불화가 심하다며 꺼이꺼이 우시기 시작한다. 퇴근 시간이 훌쩍 지났는데...',
    weight: 85,
    tags: ['심야전화', '가정생활'],
    choices: [
      {
        id: 'choice_p02_1',
        text: '속상하신 마음을 모두 들어주며 1시간가량 심야 전화를 친절하게 받아준다.',
        intent: '과도한 헌신과 공감',
        immediateEffects: [
          { stat: 'hp', value: -15 },
          { stat: 'mental', value: -10 },
          { stat: 'parentTrust', value: 20 },
          { stat: 'familySatisfaction', value: -20 }
        ],
        hiddenFlags: ['student_center', 'self_sacrifice'],
        resultText: '지훈이 어머님은 펑펑 울면서 교사 덕분에 살 힘을 얻었다며 신뢰를 전했습니다. 그러나 같이 쉬어야 할 당신의 배우자와 가족들은 짜증 섞인 한숨을 깊게 내쉬었습니다.'
      },
      {
        id: 'choice_p02_2',
        text: '정중하게 끊으며 "어머님, 지금은 늦은 시간이니 내일 오전 중 정식 통화를 통해 진지하게 도와드리겠다"고 선을 긋는다.',
        intent: '경계 설정과 프로의식',
        immediateEffects: [
          { stat: 'hp', value: 10 },
          { stat: 'familySatisfaction', value: 10 },
          { stat: 'parentTrust', value: 5 }
        ],
        hiddenFlags: ['family_first', 'conflict_avoidance'],
        resultText: '단호하고 정중한 거절로 퇴근 후의 소중한 개인 저녁 삶을 안전하게 보호했습니다. 다음 날 아침 통화에서도 정돈된 상담을 이어갔습니다.'
      },
      {
        id: 'choice_p02_3',
        text: '귀찮다는 듯 냉랭하게 전화를 받아 "퇴근 후 연락은 교육청 지침상 곤란하니 정식 상담 창구를 이용하라"고 냉랭하게 툭 끊는다.',
        intent: '방어적 선긋기',
        immediateEffects: [
          { stat: 'mental', value: 10 },
          { stat: 'parentTrust', value: -25 },
          { stat: 'reputation', value: -10 }
        ],
        hiddenFlags: ['conflict_avoidance'],
        resultText: '학부모는 큰 거절감과 멸시를 느꼈습니다. 다음 날 학교 홈페이지에 "교사가 전화를 쌀쌀맞게 끊었다"는 불친절 고발 민원이 조용히 올라옵니다.'
      }
    ]
  },
  {
    id: 'evt_parent_03',
    dayRange: [9, 13],
    title: '학부모 단톡방의 근거 없는 루머',
    category: 'parent',
    situation: '교무실',
    narratorText: '친한 동료 교사가 다가와 조용히 폰을 보여준다. 학급 학부모 비공식 단톡방 캡처본인데, "담임 쌤이 젊어서(또는 남자라서/여자라서) 애들 기싸움에서 밀려 지훈이 같은 일진 애들을 방치하고 유독 민준이 같은 공부 잘하는 집만 편애한다"는 무서운 루머가 퍼지고 있다.',
    weight: 95,
    tags: ['루머대응', '단톡방'],
    choices: [
      {
        id: 'choice_p03_1',
        text: '학급 전체 알림장과 공식 메시지를 통해 학급 경영관을 다시 한번 소상히 밝히고 모든 지도는 일관됨을 공표한다.',
        intent: '정면 신뢰 극복',
        immediateEffects: [
          { stat: 'hp', value: -10 },
          { stat: 'mental', value: -15 },
          { stat: 'parentTrust', value: 20 },
          { stat: 'educationSoshin', value: 15 }
        ],
        hiddenFlags: ['leadership', 'fairness'],
        resultText: '당당하고 흔들림 없는 태도로 교사의 입장을 명확히 밝히자, 단톡방 안에서도 "우리가 너무 성급하게 억측했다"는 여론이 형성되며 루머가 빠르게 가라앉았습니다.'
      },
      {
        id: 'choice_p03_2',
        text: '단톡방의 방장 격인 주요 학부모(민준 어머님) 등 몇 명에게 따로 비밀리에 전화하여 사정을 은근히 흘리고 해명해달라고 간접적으로 도움을 청한다.',
        intent: '정치적 포섭 해결',
        immediateEffects: [
          { stat: 'hp', value: -10 },
          { stat: 'colleagueRelation', value: -5 },
          { stat: 'parentTrust', value: 10 }
        ],
        hiddenFlags: ['conflict_avoidance'],
        resultText: '지원을 끌어내는 데는 성공했지만, 이로 인해 교사가 일부 친밀한 학부모 학회장 라인에게 휘둘리거나 의존한다는 미묘한 족쇄가 생겼습니다.'
      },
      {
        id: 'choice_p03_3',
        text: '교권 침해적인 모욕으로 간주하고, 캡처본을 증거로 교육청 교권 법률지원센터에 법적 고소 절차를 수소문한다.',
        intent: '법적 초강수',
        immediateEffects: [
          { stat: 'hp', value: -15 },
          { stat: 'mental', value: -20 },
          { stat: 'parentTrust', value: -30 },
          { stat: 'adminTrust', value: -10 }
        ],
        hiddenFlags: ['fairness'],
        resultText: '법적 대응 준비 소식에 학부모 전체가 극단적인 적대 관계 혹은 얼어붙은 방어 자세로 돌아섰습니다. 교실과 학급 소통은 사실상 완전히 파탄 났습니다.'
      }
    ]
  },
  {
    id: 'evt_parent_04',
    dayRange: [13, 16],
    title: '성적 부진 서연 부모님의 방임',
    category: 'parent',
    situation: '교무실',
    narratorText: '서연이의 학력 보충 동의서를 받기 위해 퇴근 시간 전 서연이 아버님께 전화를 걸었다. 하지만 아버님은 "가게 일 때문에 바쁘니까 학교에서 알아서 가르치든 말든 하라"며 매우 무관심하고 짜증 섞인 목소리로 대답한다.',
    weight: 80,
    tags: ['방임학부모', '기초학력'],
    choices: [
      {
        id: 'choice_p04_1',
        text: '바쁘신 처지를 공감해 드린 뒤, 밤늦게라도 서연이가 동의서에 부모 서명을 직접 받아올 수 있게 서연이를 설득한다.',
        intent: '아동을 통한 소통 확보',
        immediateEffects: [
          { stat: 'hp', value: -5 },
          { stat: 'studentTrust', value: 10 },
          { stat: 'parentTrust', value: 10 }
        ],
        hiddenFlags: ['student_center'],
        resultText: '서연이가 집에서 아빠의 도장을 꾹 찍어왔습니다. 비록 부모와 직접 소통하진 못했지만 서연이를 지원할 최소한의 행정 요건은 충족했습니다.'
      },
      {
        id: 'choice_p04_2',
        text: '지속해서 전화와 긴 장문의 편지를 발송하며 서연이가 가정에서 방치되고 있는 부분에 대한 의무적 책임을 강경하게 환기한다.',
        intent: '부모 책임론 강조',
        immediateEffects: [
          { stat: 'hp', value: -10 },
          { stat: 'mental', value: -10 },
          { stat: 'parentTrust', value: -15 },
          { stat: 'educationSoshin', value: 10 }
        ],
        hiddenFlags: ['fairness'],
        resultText: '부모의 죄책감과 거부 반응을 강하게 건드렸습니다. 아버님은 "내가 애를 굶기길 했냐 때리길 했냐"며 학교 측의 훈계조 전화에 크게 반발하며 갈등을 빚었습니다.'
      },
      {
        id: 'choice_p04_3',
        text: '학교 사회복지사 선생님 또는 지역 아동 센터와 긴밀히 연계하여 담임 대신 가정 방문 및 아동 복지 조율을 부탁한다.',
        intent: '전문 연대 협력',
        immediateEffects: [
          { stat: 'adminPower', value: 15 },
          { stat: 'colleagueRelation', value: 10 },
          { stat: 'parentTrust', value: 15 }
        ],
        hiddenFlags: ['collaboration', 'leadership'],
        resultText: '아동 센터와의 협력으로 서연이 아버님도 감정을 누그러뜨리고 지역 연계 복지 서비스를 받아들였습니다. 서연이의 방과후 학습과 돌봄이 동시에 안정화되었습니다.'
      }
    ]
  },
  {
    id: 'evt_parent_05',
    dayRange: [16, 19],
    title: '특별 대우를 바라는 쪽지',
    category: 'parent',
    situation: '교실',
    narratorText: '예준이 어머님으로부터 쇼핑백에 담긴 고급 수제 쿠키 상자와 함께 "선생님, 우리 예준이가 급식을 골고루 먹게 담임 쌤이 급식실에서 옆에 앉아 챙겨주시고, 앞자리에만 앉혀주세요."라는 손 편지 쪽지가 들어있다. 김영란법도 걱정되는데...',
    weight: 90,
    tags: ['김영란법', '특별대우'],
    choices: [
      {
        id: 'choice_p05_1',
        text: '선물과 쿠키는 단호히 반려하여 정중히 돌려보내고, 모든 학급 규칙은 학생들에게 공정하게 동일 적용됨을 명시한다.',
        intent: '청렴성과 공정성 사수',
        immediateEffects: [
          { stat: 'mental', value: 5 },
          { stat: 'parentTrust', value: -5 },
          { stat: 'educationSoshin', value: 15 }
        ],
        hiddenFlags: ['fairness'],
        resultText: '청렴한 원칙을 엄격하게 지켰습니다. 예준 어머님은 면전에서 선물이 거절당한 것에 자존심이 상했지만 교사의 올바른 공정성 원칙에 이의를 제기하진 못했습니다.'
      },
      {
        id: 'choice_p05_2',
        text: '정성어린 쿠키는 반 아이들 모두와 나눠 먹으며 감사 문자를 보낸 뒤, 예준이의 건강 상태를 수시로 체크하겠다고 전한다.',
        intent: '융통성 있는 수용과 무마',
        immediateEffects: [
          { stat: 'hp', value: -5 },
          { stat: 'parentTrust', value: 15 },
          { stat: 'studentTrust', value: 5 }
        ],
        hiddenFlags: ['conflict_avoidance'],
        resultText: '아이들과 쿠키를 나눠 먹으며 훈훈한 분위기를 만들었고 학부모 관계도 유연하게 챙겼습니다. 청렴 수칙의 경계선을 아주 지혜롭게 넘었습니다.'
      },
      {
        id: 'choice_p05_3',
        text: '불쾌감을 담아 관리자에게 보고하고 공식 클린 신고 센터에 접수한 후 학부모에게 규정 위반 경고 조치를 취한다.',
        intent: '매뉴얼식 사법 대응',
        immediateEffects: [
          { stat: 'adminTrust', value: 15 },
          { stat: 'parentTrust', value: -30 },
          { stat: 'mental', value: -10 }
        ],
        hiddenFlags: ['organism_adaptation', 'fairness'],
        resultText: '학교 청렴도를 빛내는 담임 교사의 모범 사례로 교장선생님의 폭풍 칭찬을 들었습니다. 다만 그 학부모와의 관계는 완벽하게 무덤 속으로 들어갔습니다.'
      }
    ]
  },
  {
    id: 'evt_parent_06',
    dayRange: [19, 21],
    title: '옆 학급과의 집요한 비교 민원',
    category: 'parent',
    situation: '교무실',
    narratorText: '수아 어머님으로부터 장문의 문자가 날아왔다. "옆 반 2반 담임 선생님은 체험학습 사진도 매일 키즈노트에 수십 장씩 올려주시고 영어 받아쓰기도 매주 꼼꼼히 보시는데, 왜 우리 반은 소식이 뜸하고 활동이 부족한가요?"',
    weight: 85,
    tags: ['옆반비교', '민원'],
    choices: [
      {
        id: 'choice_p06_1',
        text: '옆 반 선생님의 학급 운영 방식도 훌륭하지만, 본인은 아이들의 자율성과 행정 활동 효율을 중시하여 주 1회 모아서 공지하는 교육 철학을 친절하고 상세히 설명한다.',
        intent: '소신 교육관 어필',
        immediateEffects: [
          { stat: 'mental', value: 5 },
          { stat: 'parentTrust', value: 10 },
          { stat: 'educationSoshin', value: 15 }
        ],
        hiddenFlags: ['education_soshin'],
        resultText: '흔들리지 않고 담임 교사로서의 확고한 교육관을 차분히 설득해 나갔습니다. 학부모는 담임의 단단한 주관과 진정성에 신뢰를 보냈습니다.'
      },
      {
        id: 'choice_p06_2',
        text: '옆 반 담임에게 밀리기 싫은 마음에, 오늘부터 매일 수업 사진 50장씩을 찍어 부랴부랴 앨범을 만들어 업로드하기 시작한다.',
        intent: '민원 맞춤형 굴복',
        immediateEffects: [
          { stat: 'hp', value: -15 },
          { stat: 'mental', value: -10 },
          { stat: 'parentTrust', value: 15 }
        ],
        hiddenFlags: ['conflict_avoidance', 'self_sacrifice'],
        resultText: '학부모 요구는 충족했습니다. 그러나 매일 사진 찍고 올리는 과도한 서비스성 노동에 수업 준비 시간과 쉬는 시간 소통은 완전히 박살 나기 시작했습니다.'
      },
      {
        id: 'choice_p06_3',
        text: '옆 반 선생님과 학급 상황이 엄연히 다르며 타 반과의 단순 비교는 교사의 고유 권한인 학급 편성권을 침해하는 행위라며 차갑게 문자를 반려한다.',
        intent: '전문성 방어',
        immediateEffects: [
          { stat: 'mental', value: 5 },
          { stat: 'colleagueRelation', value: -10 },
          { stat: 'parentTrust', value: -20 }
        ],
        hiddenFlags: ['fairness'],
        resultText: '차가운 철벽 방어를 세웠습니다. 학부모들은 "말 한마디 붙이기 무섭다"며 단톡방에서 교사의 불친절한 태도를 비난하는 눈초리를 보냅니다.'
      }
    ]
  },
  {
    id: 'evt_parent_07',
    dayRange: [21, 23],
    title: '학폭 신고 처벌 수위 불만',
    category: 'parent',
    situation: '교무실',
    narratorText: '지훈이의 지속적인 마찰 행동으로 인해 열린 화해조정 모임 이후, 상대 학생의 부모가 담임 교실로 직접 전화를 걸어왔다. "선생님이 가해자인 지훈이 편을 드는 거 아닙니까? 강제 전학이나 강력한 출석 정지 처분을 당장 내려주세요!"',
    weight: 90,
    tags: ['학교폭력', '처벌요구'],
    choices: [
      {
        id: 'choice_p07_1',
        text: '교사의 중재 권한 한계를 정중히 명시하고, 처벌의 수위는 담임 임의가 아닌 공식 학폭 자치위원회에서 법에 의해 최종 결정됨을 설명한다.',
        intent: '제도적 선긋기',
        immediateEffects: [
          { stat: 'hp', value: -5 },
          { stat: 'adminTrust', value: 10 },
          { stat: 'parentTrust', value: 5 }
        ],
        hiddenFlags: ['organism_adaptation', 'fairness'],
        resultText: '학교 규정과 법적 경계를 명확하게 전달하여 교사가 표적이 되는 상황을 차분히 차단했습니다.'
      },
      {
        id: 'choice_p07_2',
        text: '상대방 부모의 분노를 온전히 받아내며 지훈이가 많이 반성하고 있음을 읍소하고, 기회를 한 번만 더 달라고 자신이 보증을 서 준다.',
        intent: '가교형 자기희생',
        immediateEffects: [
          { stat: 'hp', value: -15 },
          { stat: 'mental', value: -15 },
          { stat: 'studentTrust', value: 15 },
          { stat: 'parentTrust', value: -10 }
        ],
        hiddenFlags: ['student_center', 'self_sacrifice'],
        resultText: '지훈이의 신뢰는 깊어졌지만, 상대 학부모는 "선생님도 한통속이네!"라며 교사의 중립성 의무를 시청 및 교육청에 신고하겠다고 크게 협박했습니다.'
      },
      {
        id: 'choice_p07_3',
        text: '지훈이를 다시 학년실로 세차게 불러 호되게 화를 내며 "너 때문에 교사가 이런 소리까지 들어야겠냐"고 책망한다.',
        intent: '감정 배출 훈육',
        immediateEffects: [
          { stat: 'hp', value: -5 },
          { stat: 'mental', value: 10 },
          { stat: 'studentTrust', value: -20 },
          { stat: 'parentTrust', value: 10 }
        ],
        hiddenFlags: ['performance_center'],
        resultText: '당장 지훈이에게 화를 내어 감정은 좀 가라앉았지만, 지훈이는 "선생님도 똑같은 위선자였다"며 배신감 어린 충격을 받았습니다.'
      }
    ]
  },
  {
    id: 'evt_parent_08',
    dayRange: [23, 26],
    title: '상담 내용 녹취 폭로 협박',
    category: 'parent',
    situation: '교무실',
    narratorText: '지훈이 문제로 상담하던 중, 지훈이 어머님이 흥분하여 "지난주 선생님이 교실에서 지훈이에게 윽박지르고 벌을 서게 한 정황을 아이 녹음기를 통해 다 확보해 놨어요! 이번 사건 좋게 해결 안 하시면 교육청 게시판과 언론에 터뜨리겠습니다!"라며 소리를 지른다.',
    weight: 95,
    tags: ['녹취', '협박', '위기'],
    choices: [
      {
        id: 'choice_p08_1',
        text: '상담 장소에서의 무단 녹취는 심각한 불법이자 교권 침해 행위임을 침착하고 강경하게 통보하고, 부장과 교감선생님을 동석시켜 삼자 대면으로 전환한다.',
        intent: '강경하고 절차적인 방어',
        immediateEffects: [
          { stat: 'hp', value: -10 },
          { stat: 'mental', value: -20 },
          { stat: 'adminTrust', value: 10 },
          { stat: 'adminPower', value: 10 }
        ],
        hiddenFlags: ['fairness', 'leadership'],
        resultText: '법과 공적 제도를 기반으로 한 흔들림 없는 태도에 학부모는 위축되며 꼬리를 내렸습니다. 학교 관리자들이 든든한 방패 역할을 해주었습니다.'
      },
      {
        id: 'choice_p08_2',
        text: '녹취 폭로에 큰 겁을 먹고, 학부모의 무리한 요구(상대방 학생의 강제 교실 격리 등)를 그대로 받아주기로 약속한다.',
        intent: '굴욕적 굴복',
        immediateEffects: [
          { stat: 'mental', value: -30 }, // 극심한 멘탈 붕괴
          { stat: 'parentTrust', value: 15 },
          { stat: 'studentTrust', value: -10 }
        ],
        delayedEffects: [
          {
            dayTrigger: 28,
            effects: [
              { stat: 'adminTrust', value: -20 },
              { stat: 'colleagueRelation', value: -15 }
            ],
            message: '무리하게 격리된 상대 학생 학부모가 "담임이 지훈 부모의 협박에 넘어가 불공정한 학급 운영을 했다"며 교육청에 민원을 넣어 온 학교가 발칵 뒤집혔습니다.'
          }
        ],
        hiddenFlags: ['conflict_avoidance'],
        resultText: '위기는 당장 모면한 듯 보이지만, 스스로 비굴하게 굴었다는 자책감과 극심한 자존감 손상이 밀려옵니다.'
      },
      {
        id: 'choice_p08_3',
        text: '일단 상대 부모님의 성난 감정부터 깊이 공감하고 물을 건네며 진정시킨 뒤, 차분하게 당시 교실 지도 상황의 맥락을 객관적 사실관계만 확인시킨다.',
        intent: '비폭력 평화 대화',
        immediateEffects: [
          { stat: 'hp', value: -15 },
          { stat: 'mental', value: -10 },
          { stat: 'expert', value: 20 },
          { stat: 'parentTrust', value: 15 }
        ],
        hiddenFlags: ['student_center'],
        resultText: '교사의 탁월한 정서적 조절 능력과 진심 어린 어조가 학부모의 가시 돋친 경계를 녹였습니다. 흥분이 가라앉은 학부모는 울음을 터뜨리며 공격을 멈추고 사과해 왔습니다.'
      }
    ]
  },
  {
    id: 'evt_parent_09',
    dayRange: [25, 28],
    title: '성적 압박형 부모님의 성적 집착',
    category: 'parent',
    situation: '교무실',
    narratorText: '민준이 어머니가 교무실로 찾아와 아이의 내신 석차 등급 소수점 셋째 자리까지 꼼꼼히 확인하며 "이번 단원평가에서 민준이가 서술형 문항 1점 깎인 것에 대해 출제 오류 소지가 다분하다"며 시중 기출 족보 책을 들이밀며 항의한다.',
    weight: 85,
    tags: ['성적민원', '평가'],
    choices: [
      {
        id: 'choice_p09_1',
        text: '출제 검토 위원회 규정에 따라 해당 문제의 답안 채점에는 한 치의 오류도 없었음을 출제 근거 문서와 함께 엄격하게 반박한다.',
        intent: '학업 평가 권위 고수',
        immediateEffects: [
          { stat: 'mental', value: 5 },
          { stat: 'parentTrust', value: -10 },
          { stat: 'adminPower', value: 10 }
        ],
        hiddenFlags: ['fairness', 'performance_center'],
        resultText: '지극히 객관적인 논리와 데이터를 제시해 채점의 철저함을 입증했습니다. 민준 어머니는 불평했지만 더는 꼬투리를 잡지 못하고 물러섰습니다.'
      },
      {
        id: 'choice_p09_2',
        text: '민준이의 극심한 학습 불안과 완벽주의 스트레스 상태를 전달하며 성적 수치보다는 아이의 자존감 치료가 우선임을 끈질기게 설득한다.',
        intent: '성적보다 학생 건강 설득',
        immediateEffects: [
          { stat: 'hp', value: -10 },
          { stat: 'expert', value: 15 },
          { stat: 'parentTrust', value: 10 }
        ],
        hiddenFlags: ['student_center'],
        resultText: '아이에 대한 깊은 관찰이 담긴 면담에 어머니는 성적 자료를 내려놓고 민준이가 요새 밤잠을 설치며 괴로워하던 모습을 상기하며 눈시울을 붉혔습니다.'
      },
      {
        id: 'choice_p09_3',
        text: '평가의 신뢰성이 흔들리면 학교 전체의 권위가 떨어지므로, 교무부장님과 학년 부장님께 지원군으로 자리를 채워달라고 요청한다.',
        intent: '동료 연대 방어',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 5 },
          { stat: 'adminTrust', value: 5 },
          { stat: 'hp', value: -5 }
        ],
        hiddenFlags: ['organism_adaptation', 'collaboration'],
        resultText: '부장 선생님들의 노련한 민원 응대 내공 덕분에 큰 힘을 들이지 않고 상황이 깔끔하게 정리되었습니다.'
      }
    ]
  },
  {
    id: 'evt_parent_10',
    dayRange: [27, 30],
    title: '인터넷 커뮤니티 고발 글 유포',
    category: 'parent',
    situation: '교무실',
    narratorText: '지역 맘카페 및 블로그에 "ㅇㅇ초등학교 담임교사의 불성실한 자격 미달 실태를 고발합니다"라는 제목의 저격 글이 게시되었다. 구체적인 교사 실명은 없으나, 당신 반 교실 묘사와 있었던 갈등 사례가 교묘히 짜집기 되어 조회수가 급상승 중이다.',
    weight: 95,
    tags: ['온라인유포', '위기', '맘카페'],
    choices: [
      {
        id: 'choice_p10_1',
        text: '허위 사실 유포와 명예훼손 혐의로 사이버수사대에 정식 고소장을 접수하고, 사실과 다른 부분에 대한 객관적 증빙 자료를 수집해 교육청 언론대응팀에 전달한다.',
        intent: '법적 정면 승부',
        immediateEffects: [
          { stat: 'hp', value: -15 },
          { stat: 'mental', value: -20 },
          { stat: 'adminPower', value: 15 },
          { stat: 'reputation', value: 10 }
        ],
        hiddenFlags: ['fairness', 'leadership'],
        resultText: '강력하고 기민한 법적 조치 소식에 맘카페 운영자가 고발 글을 자진 삭제했습니다. 교사의 명예를 단단히 지켜냈습니다.'
      },
      {
        id: 'choice_p10_2',
        text: '사태가 걷잡을 수 없이 커지는 것을 막기 위해, 카페 작성자(지훈 어머님으로 강하게 의심됨)를 찾아가 싹싹 빌며 유화적인 합의와 글 삭제를 호소한다.',
        intent: '비굴한 타협 봉합',
        immediateEffects: [
          { stat: 'mental', value: -35 }, // 멘탈 대폭 붕괴
          { stat: 'parentTrust', value: 10 },
          { stat: 'reputation', value: -20 }
        ],
        hiddenFlags: ['conflict_avoidance'],
        resultText: '글은 지워졌지만 동료 교사들과 관리자들은 비굴하고 원칙 없는 대처로 학교 망신을 자초했다며 당신을 아주 싸늘하고 은밀한 시선으로 멀리하기 시작했습니다.'
      },
      {
        id: 'choice_p10_3',
        text: '교장선생님 주재 하에 전체 부장 긴급대응 회의를 열어 학교의 일치단결된 공식 입장문을 발표하고, 교사 개인을 향한 악성 테러에 단호히 맞서기로 결의한다.',
        intent: '집단적 리더십 대응',
        immediateEffects: [
          { stat: 'hp', value: -10 },
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'adminTrust', value: 15 },
          { stat: 'educationSoshin', value: 20 }
        ],
        hiddenFlags: ['leadership', 'collaboration'],
        resultText: '학교라는 거대한 든든한 조직 공동체가 당신을 따뜻하게 안아주고 정당성을 보호해 주었습니다. 동료와 관리자 사이에서 끈끈한 전우애와 강한 신뢰가 싹텄습니다.'
      }
    ]
  },

  // ==================== [카테고리 3: 동료·관리자 (evt_colleague_01 ~ 10)] ====================
  {
    id: 'evt_colleague_01',
    dayRange: [3, 6],
    title: '과학의 날 행사 총괄 폭탄',
    category: 'colleague',
    situation: '교무실',
    narratorText: '부장 교사가 머쓱한 웃음을 지으며 다가왔다. "선생님, 올해 과학의 날 전교 행사 총괄 담당자가 공석인데... 신임 선생님이 새로운 열정으로 한번 맡아주면 보고서 쓰기에도 참 좋은 경력이 될 거야." 모두가 피하는 고된 업무다.',
    weight: 90,
    tags: ['행정업무', '업무폭탄'],
    choices: [
      {
        id: 'choice_c01_1',
        text: '교직 생활 첫인상과 평판을 관리하기 위해 기쁜 기색으로 흔쾌히 업무를 수락한다.',
        intent: '적극 수용과 평판 획득',
        immediateEffects: [
          { stat: 'hp', value: -15 },
          { stat: 'adminTrust', value: 15 },
          { stat: 'adminPower', value: 10 },
          { stat: 'reputation', value: 5 }
        ],
        delayedEffects: [
          {
            dayTrigger: 7,
            effects: [
              { stat: 'hp', value: -10 },
              { stat: 'burnout', value: 15 } // 업무 폭풍으로 인한 피로
            ],
            message: '과학의 날 예산안 결재와 기안문 작성으로 연일 야근을 하며 입안이 헐었습니다.'
          }
        ],
        hiddenFlags: ['organism_adaptation', 'self_sacrifice'],
        resultText: '교장, 교감과 부장 선생님들의 얼굴에 함박웃음이 피어났습니다. "역시 요즘 신규 쌤들은 참 패기가 있네!"라며 등을 토닥여 줍니다.'
      },
      {
        id: 'choice_c01_2',
        text: '정중하되 단호히 거절하며, 현재 맡은 학급 부진아 특별 지도와 생활지도 업무 카드를 들이밀며 한계를 설득한다.',
        intent: '경계 설정을 통한 방어',
        immediateEffects: [
          { stat: 'hp', value: 10 },
          { stat: 'adminTrust', value: -10 },
          { stat: 'educationSoshin', value: 10 }
        ],
        hiddenFlags: ['family_first', 'conflict_avoidance'],
        resultText: '당장 야근 지옥에서 자신을 구했습니다. 다만 교무실 뒤편에서 "요즘 신규들은 너무 칼 같고 이기적이야"라는 부장 교사들의 수근거림이 흘러나옵니다.'
      },
      {
        id: 'choice_c01_3',
        text: '조건부로 수락하되, 다른 과중한 자잘한 행정 공문 3개를 다른 동료에게 이관해 달라고 딜(Deal)을 제안한다.',
        intent: '업무 조율과 협상',
        immediateEffects: [
          { stat: 'hp', value: -5 },
          { stat: 'adminPower', value: 15 },
          { stat: 'colleagueRelation', value: -10 }
        ],
        hiddenFlags: ['leadership'],
        resultText: '탁월한 협상가적 면모를 보였습니다. 자잘한 행정 업무를 털어내 실익은 챙겼으나, 졸지에 졸속으로 일을 떠안은 동료 교사의 싸늘한 곁눈질을 받았습니다.'
      }
    ]
  },
  {
    id: 'evt_colleague_02',
    dayRange: [6, 9],
    title: '동료 교사의 은밀한 업무 전가',
    category: 'colleague',
    situation: '교무실',
    narratorText: '같은 학년의 고참 2반 교사가 시무룩한 표정으로 커피 한 잔을 건넨다. "선생님, 내가 오늘 급한 가사 사정이 있어서 그런데, 오늘 오후 제출인 학교 교육과정 설문 통계 보고서 취합 기안 좀 대신 올려줄 수 있을까? 컴퓨터 잘 다루잖아~"',
    weight: 85,
    tags: ['동료관계', '업무전가'],
    choices: [
      {
        id: 'choice_c02_1',
        text: '좋은 선후배 관계 형성을 위해 미소를 지으며 "제가 할 테니 걱정 말고 들어가세요"라며 업무를 가져온다.',
        intent: '과도한 양보',
        immediateEffects: [
          { stat: 'hp', value: -10 },
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'familySatisfaction', value: -5 }
        ],
        delayedEffects: [
          {
            dayTrigger: 11,
            effects: [
              { stat: 'colleagueRelation', value: 5 }
            ],
            message: '지난번 호의를 보낸 덕분인지, 2반 선생님이 고맙다며 고급 디저트 선물 세트를 책상 위에 얹어 두었습니다.'
          }
        ],
        hiddenFlags: ['collaboration', 'self_sacrifice'],
        resultText: '선배 선생님의 칭송과 따뜻한 유대를 얻었습니다. 다만 퇴근 지하철 안에서 밀린 본인의 수행평가 채점을 하느라 눈이 피로해집니다.'
      },
      {
        id: 'choice_c02_2',
        text: '기분 상하지 않게 "저도 오늘 학부모 급한 대면 상담이 잡혀 있어서 아쉽지만 돕기 곤란하다"고 거짓 핑계를 대며 정중히 피한다.',
        intent: '영리한 갈등 회피',
        immediateEffects: [
          { stat: 'hp', value: 5 },
          { stat: 'colleagueRelation', value: -5 }
        ],
        hiddenFlags: ['conflict_avoidance'],
        resultText: '부담스러운 덤터기 업무를 깔끔하게 피했습니다. 2반 선생님은 아쉬운 표정으로 다른 만만한 저경력 교사를 찾아 떠납니다.'
      },
      {
        id: 'choice_c02_3',
        text: '규정과 절차대로 메신저 공식 대행 지정 기능이나 결재권자 승인을 먼저 얻고 오시라고 철저히 선을 긋는다.',
        intent: '원칙적 단호함',
        immediateEffects: [
          { stat: 'mental', value: 5 },
          { stat: 'colleagueRelation', value: -15 },
          { stat: 'educationSoshin', value: 10 }
        ],
        hiddenFlags: ['fairness'],
        resultText: '공사 구분을 명확히 하는 사람이라는 인상을 깊게 심었습니다. 다만 학년 교무실 내에서 지나치게 융통성 없고 깐깐한 후배라는 소문이 돌기 시작합니다.'
      }
    ]
  },
  {
    id: 'evt_colleague_03',
    dayRange: [10, 14],
    title: '신임 교사 공개수업 압박',
    category: 'colleague',
    situation: '교무실',
    narratorText: '부장 회의를 마친 학년 부장님이 어두운 표정으로 들어오시더니 학년실 전체 교사들에게 말한다. "교장선생님이 이번 혁신 시범 공개수업에 우리 학년에서 최소 1명은 무조건 먼저 나서야 분위기가 산다고 하시는데... 어떻게 할까?" 다들 먼 산을 보며 침묵하고 있다.',
    weight: 90,
    tags: ['공개수업', '성과주의'],
    choices: [
      {
        id: 'choice_c03_1',
        text: '눈치를 보며 팽팽한 침묵이 이어지자, 자신이 총대를 메고 먼저 공개수업을 자원하겠다고 일어선다.',
        intent: '희생적 분위기 주도',
        immediateEffects: [
          { stat: 'hp', value: -20 }, // 극심한 수업 준비 노동
          { stat: 'adminTrust', value: 20 },
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'expert', value: 15 }
        ],
        hiddenFlags: ['leadership', 'self_sacrifice'],
        resultText: '학년실 전체 교사들이 당신을 구세주로 바라보며 어깨를 두드려 줍니다. 교장실에서도 "역시 우리 학교의 보배"라며 극찬이 흘러나옵니다.'
      },
      {
        id: 'choice_c03_2',
        text: '끝까지 다른 선배 교사의 낯가죽을 바라보며 찻잔을 든 채 고개를 푹 숙이고 완벽한 침묵을 유지한다.',
        intent: '안전 우선 방어',
        immediateEffects: [
          { stat: 'hp', value: 10 },
          { stat: 'mental', value: 5 },
          { stat: 'adminTrust', value: -5 }
        ],
        hiddenFlags: ['conflict_avoidance'],
        resultText: '결국 견디다 못한 기간제 선생님이 자원하며 조용히 상황이 넘어갔습니다. 수업 연구의 압박에서 벗어나 평온한 하루를 지켜냈습니다.'
      },
      {
        id: 'choice_c03_3',
        text: '동학년 공동 수업 개발을 제안하며, 네 명이 한 차시씩 나눠서 공동 작성하고 대표로 본인이 공개하겠다는 집단 지성을 발휘한다.',
        intent: '공동체적 혁신 유도',
        immediateEffects: [
          { stat: 'hp', value: -10 },
          { stat: 'colleagueRelation', value: 20 },
          { stat: 'expert', value: 20 },
          { stat: 'educationSoshin', value: 15 }
        ],
        hiddenFlags: ['collaboration', 'leadership'],
        resultText: '최고의 리더십입니다. 동료 교사들과 함께 밤을 새우며 수업을 다듬고 훌륭한 나눔의 문화를 만들었습니다. 교직 사회 내에서 당신의 교육 전문가적 브랜드가 드높아졌습니다.'
      }
    ]
  },
  {
    id: 'evt_colleague_04',
    dayRange: [14, 17],
    title: '병가 동료 교사의 급작스러운 대행',
    category: 'colleague',
    situation: '교무실',
    narratorText: '아침 8시 10분, 옆 반 2반 선생님이 독감으로 급하게 3일간 병가를 냈다. 대체 기간제 강사를 구하지 못해, 오늘 당장 2반의 보결(대행 수업) 및 학급 조종례 업무를 나누어 맡아달라는 긴급 요청이 떨어졌다.',
    weight: 85,
    tags: ['보결', '업무협조'],
    choices: [
      {
        id: 'choice_c04_1',
        text: '동료의 위기 상황이므로, 흔쾌히 2반 조례와 2개 교시 보결 수업을 모두 받아들여 열심히 지도한다.',
        intent: '아낌없는 동료 지원',
        immediateEffects: [
          { stat: 'hp', value: -15 },
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'adminTrust', value: 5 }
        ],
        hiddenFlags: ['collaboration', 'self_sacrifice'],
        resultText: '몸은 녹초가 되었지만 병가에서 돌아온 2반 선생님은 눈물을 글썽이며 너무나 고마워했습니다. 신뢰와 협동의 학년실 분위기가 견고해집니다.'
      },
      {
        id: 'choice_c04_2',
        text: '나의 오늘 학급 생활지도 및 수행 채점 일정이 꽉 차 있음을 설명하고, 공평하게 다른 반 교사들과 교시를 골고루 분할하자고 건의한다.',
        intent: '공정한 업무 배분',
        immediateEffects: [
          { stat: 'mental', value: 5 },
          { stat: 'colleagueRelation', value: 5 },
          { stat: 'adminPower', value: 10 }
        ],
        hiddenFlags: ['fairness'],
        resultText: '비록 약간의 조율 과정은 거쳤지만, 다른 선생님들도 고개를 끄덕이며 각자 한 시간씩 공평하게 보결을 나눠 가졌습니다. 합리적인 규칙이 정립되었습니다.'
      },
      {
        id: 'choice_c04_3',
        text: '보결 수업에 들어가서 아이들에게 영화나 자습을 주고, 자신은 교실 구석에서 밀린 개인 업무를 바쁘게 처리한다.',
        intent: '형식적 임무 완수',
        immediateEffects: [
          { stat: 'hp', value: 5 },
          { stat: 'adminPower', value: 10 },
          { stat: 'studentTrust', value: -10 }
        ],
        hiddenFlags: ['conflict_avoidance'],
        resultText: '밀린 개인 서류는 다 해치웠습니다. 그러나 2반 아이들은 담임이 아픈 사이에 온 임시 담임이 대충 영화만 틀어준 사실에 약간 서운해합니다.'
      }
    ]
  },
  {
    id: 'evt_colleague_05',
    dayRange: [17, 20],
    title: '교육청 혁신 보고서 공동 작성 갈등',
    category: 'colleague',
    situation: '교무실',
    narratorText: '학교의 큰 성과가 걸린 혁신학교 공모 계획서를 동료 교무부 소속 교사와 공동 작성 중이다. 하지만 상대 교사는 과거 작년 보고서를 거의 그대로 긁어오며 대충 분량 채우기식 복붙 작업을 강요하고 있다. "선생님, 적당히 해. 교육청 장학사들은 이런 거 대충 제목만 봐."',
    weight: 90,
    tags: ['기획서', '성과주의'],
    choices: [
      {
        id: 'choice_c05_1',
        text: '불필요한 동료와의 기싸움을 피해 "예, 알겠습니다"라며 작년 보고서를 그대로 복사해 오탈자만 고치고 마감한다.',
        intent: '조직 관행 타협',
        immediateEffects: [
          { stat: 'mental', value: 10 },
          { stat: 'colleagueRelation', value: 10 },
          { stat: 'educationSoshin', value: -15 }
        ],
        hiddenFlags: ['conflict_avoidance', 'organism_adaptation'],
        resultText: '마찰 없이 아주 쉽고 빠르게 일처리를 끝냈습니다. 하지만 스스로 교육의 혁신을 가장한 형식주의자가 된 것 같아 마음에 씁쓸한 바람이 붑니다.'
      },
      {
        id: 'choice_c05_2',
        text: '교육청 심사의 수준을 낮추지 않고, 최신 에듀테크와 학생 성장 데이터를 활용해 직접 새로운 기획서를 처음부터 끝까지 혼자 밤새워 재작성해 간다.',
        intent: '교육적 완벽주의',
        immediateEffects: [
          { stat: 'hp', value: -25 }, // 밤샘으로 인한 극단적 피로
          { stat: 'expert', value: 20 },
          { stat: 'adminTrust', value: 15 },
          { stat: 'reputation', value: 10 }
        ],
        delayedEffects: [
          {
            dayTrigger: 22,
            effects: [
              { stat: 'reputation', value: 15 },
              { stat: 'colleagueRelation', value: -15 }
            ],
            message: '작성한 기획서가 교육청 최우수 사례로 선정되는 대박이 났습니다! 그러나 함께 작업하며 게으름을 지적당한 동료는 당신을 잘난 척하는 미운 오리로 몰아세웁니다.'
          }
        ],
        hiddenFlags: ['innovation_tendency', 'self_sacrifice'],
        resultText: '압도적인 고품질의 보고서를 세상에 내놓았습니다. 관리자들은 당신의 탁월한 기획력에 박수를 아끼지 않습니다.'
      },
      {
        id: 'choice_c05_3',
        text: '부장 선생님께 정식 면담을 신청해 공동 파트너의 태만 문제를 조용히 알리고, 각자 구역을 정밀하게 분할하여 서명/결재를 분리 제출하겠다고 건의한다.',
        intent: '조직적 중재 조치',
        immediateEffects: [
          { stat: 'hp', value: -5 },
          { stat: 'adminPower', value: 15 },
          { stat: 'colleagueRelation', value: -10 }
        ],
        hiddenFlags: ['fairness', 'leadership'],
        resultText: '일을 공평하게 쪼개 책임을 명확히 분리했습니다. 영리하게 선을 그었지만, 고자질쟁이 후배라는 소리를 동료 뒤편에서 듣는 대가를 치렀습니다.'
      }
    ]
  },
  {
    id: 'evt_colleague_06',
    dayRange: [20, 23],
    title: '동료 교사의 공개 비판 사건',
    category: 'colleague',
    situation: '교무실',
    narratorText: '전체 교직원 주간 회의 도중, 옆 반 고참 교사가 마이크를 잡더니 "요즘 신임 선생님들이 학급 규칙을 너무 유연하게 적용해 학생들이 선을 넘고 규칙을 무시한다. 학교 전체의 위계질서가 흔들린다"며 사실상 당신의 온건한 지도를 저격하는 비판을 가했다. 교무실 전체의 이목이 집중된다.',
    weight: 90,
    tags: ['회의충돌', '평판'],
    choices: [
      {
        id: 'choice_c06_1',
        text: '얼굴을 붉히지 않고 침착하게 "선배 선생님의 질서 우려도 충분히 공감합니다. 다만 저는 아이들의 회복적 성장에 집중하고 있으며, 교실 상황에 맞는 유연함이 주는 긍정적 측면도 있습니다"라고 조리 있게 소신을 밝힌다.',
        intent: '소신 교육관 논리 방어',
        immediateEffects: [
          { stat: 'mental', value: -10 },
          { stat: 'educationSoshin', value: 20 },
          { stat: 'reputation', value: 10 }
        ],
        hiddenFlags: ['education_soshin', 'leadership'],
        resultText: '논리정연하고 당당한 대처에 회의장의 많은 젊은 교사들이 고개를 끄덕이며 지지해 주었습니다. 당신의 교육자적 품격이 크게 입증되었습니다.'
      },
      {
        id: 'choice_c06_2',
        text: '회의 자리에서 즉시 고개를 숙이고 "미숙한 지도로 심려를 끼쳐 죄송합니다. 선배님의 말씀대로 엄격한 생활지도 규칙을 전적으로 따르겠습니다"라고 고개를 숙인다.',
        intent: '조직 굴복과 봉합',
        immediateEffects: [
          { stat: 'mental', value: -20 },
          { stat: 'colleagueRelation', value: 10 },
          { stat: 'adminTrust', value: 5 },
          { stat: 'studentTrust', value: -10 }
        ],
        hiddenFlags: ['organism_adaptation', 'conflict_avoidance'],
        resultText: '회의실의 긴장된 공기는 즉시 누그러졌습니다. 고참 교사는 고개를 끄덕였지만, 당신은 교육자로서 자존감에 깊은 내상을 입었습니다.'
      },
      {
        id: 'choice_c06_3',
        text: '회의 때는 가만히 침묵하고, 회의가 끝난 직후 개인 메신저나 교장실 면담을 통해 회의실에서의 공개 저격 발언에 대한 불쾌함과 교권 침해 소지를 공식 항의한다.',
        intent: '물밑 절차식 항의',
        immediateEffects: [
          { stat: 'mental', value: 5 },
          { stat: 'adminTrust', value: -5 },
          { stat: 'colleagueRelation', value: -15 }
        ],
        hiddenFlags: ['fairness'],
        resultText: '뒤에서 강력히 이의를 제기했습니다. 교장과 부장들은 곤혹스러워하며 다음 회의 때 비난 조의 발언을 자제해 달라며 고참 교사에게 주의를 주었습니다. 동료 관계는 더욱 얼어붙었습니다.'
      }
    ]
  },
  {
    id: 'evt_colleague_07',
    dayRange: [22, 25],
    title: '학폭 절차 누락 압박',
    category: 'colleague',
    situation: '교무실',
    narratorText: '지훈이의 다툼 사건과 관련해, 교감선생님이 조용히 교감실로 부른다. "김 선생님, 올해 우리 학교가 \'학폭 없는 우수 학교\' 지정을 받아 장학금과 예산이 걸려 있는데... 지훈이 건은 웬만하면 정식 접수하지 말고 학교 자체 해결로 묻어주면 안 될까? 내가 학부모 양쪽은 잘 달래볼게."',
    weight: 95,
    tags: ['학교폭력', '압박', '위기'],
    choices: [
      {
        id: 'choice_c07_1',
        text: '법적 절차 누락은 추후 담임교사에게 치명적인 징계로 되돌아올 수 있으므로, 단호히 거절하고 법적 규정대로 정식 매뉴얼대로 서류를 접수하겠다고 선언한다.',
        intent: '원칙 및 준법 사수',
        immediateEffects: [
          { stat: 'adminTrust', value: -20 },
          { stat: 'educationSoshin', value: 20 },
          { stat: 'adminPower', value: 15 }
        ],
        delayedEffects: [
          {
            dayTrigger: 27,
            effects: [
              { stat: 'reputation', value: 15 },
              { stat: 'adminTrust', value: 10 } // 뒤늦게 교육청 감사 통과 후 교감의 화해 제스처
            ],
            message: '교육청 학폭 정기 감사 결과, 학교 측의 규정 준수가 확인되어 징계 위기를 모면하고 오히려 표창 기회가 생겼습니다.'
          }
        ],
        hiddenFlags: ['fairness', 'organism_adaptation'],
        resultText: '관리자의 압박에도 굴하지 않고 아이들과 스스로를 법적으로 단단히 지키는 원칙을 고수했습니다. 교감은 얼굴을 붉히며 언짢은 내색을 감추지 못합니다.'
      },
      {
        id: 'choice_c07_2',
        text: '관리자의 강력한 지시이고 학교 예산도 걸려 있으므로, 교감의 중재안을 따라 양쪽 부모를 적극 설득해 학폭 서류를 취하하게 만든다.',
        intent: '조직 충성 및 타협',
        immediateEffects: [
          { stat: 'hp', value: -10 },
          { stat: 'adminTrust', value: 20 },
          { stat: 'educationSoshin', value: -20 }
        ],
        hiddenFlags: ['organism_adaptation', 'conflict_avoidance'],
        resultText: '교감은 대만족하며 "김 선생, 정말 일 잘하네!"라며 적극 신뢰를 표했습니다. 하지만 피해 학생 측은 담임이 학교 실적을 위해 가해 사실을 은폐 회유하려 했다며 깊은 배신감을 표했습니다.'
      },
      {
        id: 'choice_c07_3',
        text: '교사와 학교폭력 전담 기구 위원들, 전문 장학사에게 자문 전화를 걸어 사태의 합법적 해결을 위한 중재법을 공동 자문한다.',
        intent: '전문가 연대 자문',
        immediateEffects: [
          { stat: 'hp', value: -10 },
          { stat: 'expert', value: 20 },
          { stat: 'colleagueRelation', value: 10 }
        ],
        hiddenFlags: ['collaboration', 'leadership'],
        resultText: '합법적이고 유연한 공식 자체 해결 절차를 밟음으로써, 학교 예산 지정과 학생 권리 보호라는 두 마리 토끼를 다 잡는 지혜를 발휘했습니다.'
      }
    ]
  },
  {
    id: 'evt_colleague_08',
    dayRange: [24, 27],
    title: '부장 승진 사다리 제안',
    category: 'colleague',
    situation: '교무실',
    narratorText: '교장선생님이 교장실로 조용히 불러 차를 권한다. "김 선생, 올해 공석이 되는 교육연구부장직을 내년에 젊은 패기로 맡아보는 게 어때? 내후년에 장학사 시험 준비에도 적극 밀어주고 승진 점수 가산점도 챙겨줄게. 대신 주말에도 공문 검토를 해줘야 해."',
    weight: 90,
    tags: ['승진', '가산점'],
    choices: [
      {
        id: 'choice_c08_1',
        text: '교직 생활 승진과 장기 커리어 리더십을 위해 교장선생님의 제안을 감사히 즉시 수락한다.',
        intent: '승진 사다리 탑승',
        immediateEffects: [
          { stat: 'hp', value: -15 },
          { stat: 'adminTrust', value: 25 },
          { stat: 'careerPoint', value: 20 },
          { stat: 'familySatisfaction', value: -10 }
        ],
        hiddenFlags: ['leadership', 'organism_adaptation'],
        resultText: '교장파 승진 라인에 단단히 올라탔습니다. 미래의 교육전문직 패스가 열렸으나, 당장 다음 달부터 퇴근 시간 이후에도 공문 검토 단축 회의가 잡히기 시작합니다.'
      },
      {
        id: 'choice_c08_2',
        text: '정중하게 감사 표시를 드린 후, "아직 학급 아이들을 현장에서 직접 교감하고 지도하는 평교사 활동에 더 머물고 싶다"며 거절 의사를 밝힌다.',
        intent: '교실 사수 주의',
        immediateEffects: [
          { stat: 'mental', value: 10 },
          { stat: 'studentTrust', value: 10 },
          { stat: 'familySatisfaction', value: 10 },
          { stat: 'careerPoint', value: -10 }
        ],
        hiddenFlags: ['student_center', 'family_first'],
        resultText: '승진 압박에서 벗어나 교실 속 평교사로서 오래 아이들과 호흡하며 삶의 워라밸을 지키는 방향을 선택했습니다. 교장은 다소 아쉬운 입맛을 다십니다.'
      },
      {
        id: 'choice_c08_3',
        text: '부장직은 너무 중책이니, "동 학년 동료 선생님들과 상의해 더 적합한 경력자 선생님을 조율해 추천해 올리겠다"고 조율을 시도한다.',
        intent: '민주적 양보와 분산',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'adminPower', value: 10 }
        ],
        hiddenFlags: ['collaboration'],
        resultText: '동료 교사들 사이에서 책임을 무작정 혼자 독식하거나 거절하지 않고 학년 구성원의 의견을 모아 지혜롭게 대처했다며 리더십을 높이 평가받았습니다.'
      }
    ]
  },
  {
    id: 'evt_colleague_09',
    dayRange: [26, 29],
    title: '성과급 등급 산정 갈등',
    category: 'colleague',
    situation: '교무실',
    narratorText: '올해 교사 성과상여금 등급 발표가 났다. 당신은 나름 행정 업무를 열심히 했으나 가장 낮은 B등급을 받았고, 친목과 잡담만 일삼던 모 선배 교사가 기안 건수가 많다는 이유로 최고 S등급을 받은 것을 확인했다. 부당함에 속이 뒤틀리는데...',
    weight: 85,
    tags: ['성과급', '평가'],
    choices: [
      {
        id: 'choice_c09_1',
        text: '평가 기준표의 맹점을 조목조목 짚어 공식 이의신청서를 작성해 행정실에 당당하게 접수한다.',
        intent: '제도적 권리 요구',
        immediateEffects: [
          { stat: 'mental', value: -10 },
          { stat: 'adminTrust', value: -10 },
          { stat: 'educationSoshin', value: 15 }
        ],
        hiddenFlags: ['fairness'],
        resultText: '당신의 이의 제기로 성과급 평가 기준이 일부 재검토 논의에 들어갔습니다. 소신을 지켰으나 관리자들은 당신을 까다롭고 성가신 후배로 보기 시작합니다.'
      },
      {
        id: 'choice_c09_2',
        text: '돈 몇 푼에 더러운 갈등을 만들기 싫으므로 "더 열심히 행정 점수를 따라는 계기"로 털고 넘기며 씁쓸한 맥주를 한잔 마신다.',
        intent: '정신 승리 및 수용',
        immediateEffects: [
          { stat: 'mental', value: 5 },
          { stat: 'educationSoshin', value: -10 }
        ],
        hiddenFlags: ['conflict_avoidance'],
        resultText: '화를 가라앉히며 조용히 상황을 흘려보냈습니다. 하지만 교무실에서 일하는 내내 기안 건수 숫자만 노리는 허무한 분위기에 냉소적인 교사가 되어갑니다.'
      },
      {
        id: 'choice_c09_3',
        text: '동료 저경력 교사들과 함께 모여 "정성적 학급 지도와 수업 연구가 반영되지 않는 현행 정량 성과급 평가의 부조리"에 대한 토론 스터디 모임을 열고 개선을 촉구한다.',
        intent: '연대 행동 연구',
        immediateEffects: [
          { stat: 'hp', value: -5 },
          { stat: 'colleagueRelation', value: 20 },
          { stat: 'educationSoshin', value: 20 }
        ],
        hiddenFlags: ['innovation_tendency', 'collaboration'],
        resultText: '저경력 교사들의 마음을 모아 훌륭한 연대 모임을 만들었습니다. 비록 등급은 즉각 바뀌지 않았지만, 학교를 바꾸는 차세대 교육 주체로 동료들의 엄청난 인정을 받았습니다.'
      }
    ]
  },
  {
    id: 'evt_colleague_10',
    dayRange: [28, 30],
    title: '교육과정 보고회 총괄 마무리',
    category: 'colleague',
    situation: '교무실',
    narratorText: '30일간의 여정을 마무리하는 학년말 교육과정 성과 보고회 전날이다. 교감이 다가와 다 완성된 슬라이드에 오류가 없는지, 마지막으로 밤새 검토해 총괄 발표를 멋지게 해달라고 당신을 신뢰 어린 미소로 지목했다. 온 몸이 천근만근인데...',
    weight: 95,
    tags: ['보고회', '성과'],
    choices: [
      {
        id: 'choice_c10_1',
        text: '학교의 1년(혹은 30일) 성과를 대외에 뽐낼 기회이므로 완벽한 프레젠테이션을 위해 밤새 PPT를 뜯어고친다.',
        intent: '완벽한 성과 마무리',
        immediateEffects: [
          { stat: 'hp', value: -20 },
          { stat: 'adminTrust', value: 20 },
          { stat: 'reputation', value: 20 },
          { stat: 'familySatisfaction', value: -10 }
        ],
        hiddenFlags: ['performance_center', 'self_sacrifice'],
        resultText: '보고회 당일, 대강당에 모인 교육청 관계자들과 전 교직원 앞에서 화려한 스피치로 박수갈채를 받았습니다. 학교의 스타 교사로 등극했습니다.'
      },
      {
        id: 'choice_c10_2',
        text: '동 학년 동료 교사들에게 파트를 정중히 나눠 공동 분담을 요청하여 함께 슬라이드를 완성하고 돌아가며 발표한다.',
        intent: '민주적 공동 마무리',
        immediateEffects: [
          { stat: 'hp', value: -5 },
          { stat: 'colleagueRelation', value: 20 },
          { stat: 'expert', value: 15 }
        ],
        hiddenFlags: ['collaboration', 'leadership'],
        resultText: '특정 개인의 독주가 아닌, 학년 전체가 함께 빛나는 모범적이고 따뜻한 보고회를 만들었습니다. 동료애가 두텁게 쌓이며 최고의 유종의 미를 거두었습니다.'
      },
      {
        id: 'choice_c10_3',
        text: '기존 템플릿의 양식 그대로 가볍게 줄글만 정리해 올리고 정시 퇴근하여 내일 발표 때 가독성 있게만 읽어 넘긴다.',
        intent: '지속 가능한 워라밸 마무리',
        immediateEffects: [
          { stat: 'hp', value: 15 },
          { stat: 'familySatisfaction', value: 15 },
          { stat: 'adminTrust', value: -5 }
        ],
        hiddenFlags: ['family_first', 'conflict_avoidance'],
        resultText: '비록 보고회 발표는 무난하고 약간 지루하게 끝났지만, 당신의 체력과 가정의 저녁은 완벽하게 안전했습니다.'
      }
    ]
  },

  // ==================== [카테고리 4: 가정·커리어 (evt_family_01 ~ 10)] ====================
  {
    id: 'evt_family_01',
    dayRange: [3, 7],
    title: '배우자(또는 가족)와의 저녁 외식 약속',
    category: 'family',
    situation: '교무실',
    narratorText: '오늘은 배우자(혹은 오랜만에 만나는 부모님)와 맛집에서 만나기로 약속한 날이다. 오후 4시 20분, 갑자기 교감선생님이 다급히 부르더니 "내일 아침까지 내야 하는 교육청 시급 공문이 있으니 부서 전체 긴급 회람용 데이터 취합을 위해 야근을 해달라"고 지시한다.',
    weight: 90,
    tags: ['가족약속', '돌발야근'],
    choices: [
      {
        id: 'choice_f01_1',
        text: '배우자(가족)에게 급한 사정을 문자하고 미안함을 전한 뒤, 남아서 늦게까지 공문을 완성한다.',
        intent: '조직과 업무 최우선',
        immediateEffects: [
          { stat: 'hp', value: -10 },
          { stat: 'adminTrust', value: 15 },
          { stat: 'familySatisfaction', value: -20 },
          { stat: 'adminPower', value: 10 }
        ],
        hiddenFlags: ['organism_adaptation', 'self_sacrifice'],
        resultText: '교감은 공문을 제때 올렸다며 매우 기뻐했습니다. 하지만 늦게 귀가하자 싸늘한 정적과 함께 "맨날 말로만 미안하지?"라는 날 선 한탄을 감내해야 했습니다.'
      },
      {
        id: 'choice_f01_2',
        text: '교감에게 "선생님, 제가 오늘 미리 잡힌 피할 수 없는 중요한 집안 경조사가 있어서 이 부분만 입력해두고 정시 퇴근하여 내일 아침 일찍 나와 완성하겠다"고 딜을 시도한다.',
        intent: '스마트한 타협 정시퇴근',
        immediateEffects: [
          { stat: 'hp', value: 10 },
          { stat: 'familySatisfaction', value: 15 },
          { stat: 'adminTrust', value: -5 }
        ],
        hiddenFlags: ['family_first', 'conflict_avoidance'],
        resultText: '가족과의 외식 약속을 성황리에 마쳐 정서적 충전이 가득 찼습니다. 다음 날 아침 7시 30분에 피곤하긴 해도 무사히 출근해 기한 전에 공문을 제출했습니다.'
      },
      {
        id: 'choice_f01_3',
        text: '동료 2반 선생님에게 "커피 한 잔 살 테니 이것만 취합해 달라"고 애원하며 업무를 강제 대행 위임해 버린다.',
        intent: '동료 의존',
        immediateEffects: [
          { stat: 'hp', value: 5 },
          { stat: 'colleagueRelation', value: -15 },
          { stat: 'familySatisfaction', value: 10 }
        ],
        hiddenFlags: ['conflict_avoidance'],
        resultText: '외식은 지켰으나, 다음 날 2반 선생님의 표정이 눈에 띄게 뚱해지며 교무실 커피 머신 앞에서 당신을 봐도 인사를 건성으로 합니다.'
      }
    ]
  },
  {
    id: 'evt_family_02',
    dayRange: [7, 10],
    title: '주말 멘토링 연수 참여 제안',
    category: 'family',
    situation: '교무실',
    narratorText: '교육 연구원에서 주최하는 "학생 심리 상담 기법 전문가 1박 2일 워크숍" 참여 제안서가 내려왔다. 이수를 마치면 교육전문성 포인트가 크게 올라가지만, 이번 주말은 가족들과 바다 여행을 가기로 작년 겨울부터 약속해 둔 날인데...',
    weight: 85,
    tags: ['연수', '주말활동'],
    choices: [
      {
        id: 'choice_f02_1',
        text: '가족에게 "내가 이 연수를 들어야 향후 더 좋은 진로를 뚫을 수 있다"고 설득하고 1박 2일 연수에 참여한다.',
        intent: '커리어 향상 최우선',
        immediateEffects: [
          { stat: 'hp', value: -15 },
          { stat: 'expert', value: 20 },
          { stat: 'careerPoint', value: 15 },
          { stat: 'familySatisfaction', value: -25 }
        ],
        hiddenFlags: ['performance_center', 'leadership'],
        resultText: '상담 전문가 뱃지를 획득하며 교육 전문 역량과 평판은 훌륭하게 올라갔습니다. 그러나 아이들과 배우자의 여행 불참으로 가슴 아픈 원망을 오래 견뎌야 합니다.'
      },
      {
        id: 'choice_f02_2',
        text: '연수 신청을 과감히 포기하고, 예정대로 스마트폰을 꺼둔 채 가족들과 신나는 힐링 바다 여행을 다녀온다.',
        intent: '가족 만족과 리프레시',
        immediateEffects: [
          { stat: 'hp', value: 20 },
          { stat: 'mental', value: 20 },
          { stat: 'familySatisfaction', value: 25 },
          { stat: 'careerPoint', value: -5 }
        ],
        hiddenFlags: ['family_first'],
        resultText: '완벽한 번아웃 탈출과 아이들의 맑은 웃음을 건졌습니다. 온 몸에 생기가 돌며 월요일 아침 교탁 앞에 선 당신의 표정에 활력이 가득합니다.'
      },
      {
        id: 'choice_f02_3',
        text: '연수 신청서만 접수해 두고, 토요일 오전 교육만 슬쩍 참관한 뒤 몰래 빠져나와 늦게라도 가족 여행지로 합류하는 꼼수를 부린다.',
        intent: '아슬아슬한 이중 혜택',
        immediateEffects: [
          { stat: 'hp', value: -10 },
          { stat: 'mental', value: -10 },
          { stat: 'careerPoint', value: 5 }
        ],
        delayedEffects: [
          {
            dayTrigger: 12,
            effects: [
              { stat: 'reputation', value: -15 },
              { stat: 'adminTrust', value: -10 }
            ],
            message: '연수 장소 무단이탈 사실을 주최 측이 뒤늦게 인지하여 학교로 "교사 출결 관리 소홀" 공문을 띄웠고 교무실 망신을 샀습니다.'
          }
        ],
        hiddenFlags: ['conflict_avoidance'],
        resultText: '양쪽 모두를 챙기려다가 몸만 만신창이가 되었고 어느 한 곳도 집중하지 못한 최악의 선택이 되었습니다.'
      }
    ]
  },
  {
    id: 'evt_family_03',
    dayRange: [10, 14],
    title: '배우자(또는 가족)의 지친 한마디',
    category: 'family',
    situation: '집',
    narratorText: '집에 늦게 도착해 숟가락을 드는데, 배우자(가족)가 한숨을 쉬며 말한다. "당신 학교 아이들 사정이나 학부모 민원은 다 듣고 오면서, 정작 우리 집 아이들이 오늘 유치원(학교)에서 속상했던 일이나 내 고달픈 하루 얘기는 한 번이라도 제대로 귀 기울여 들어준 적 있어?"',
    weight: 90,
    tags: ['가족소통', '가정사'],
    choices: [
      {
        id: 'choice_f03_1',
        text: '숟가락을 내려놓고 배우자를 따뜻하게 안아준 뒤, 폰을 멀리 치우고 밤늦게까지 가족의 이야기에 온전히 집중해 들어준다.',
        intent: '가정 지지 회복',
        immediateEffects: [
          { stat: 'mental', value: -5 },
          { stat: 'familySatisfaction', value: 25 },
          { stat: 'hp', value: 5 }
        ],
        hiddenFlags: ['family_first'],
        resultText: '가족은 자신의 외로움을 이해해 주어 고맙다며 화를 풀었고 따뜻한 온기가 집안에 돌았습니다. 집이 든든한 휴식처이자 요람으로 거듭납니다.'
      },
      {
        id: 'choice_f03_2',
        text: '짜증이 섞여 "나도 학교에서 학부모 단톡방 민원에, 애들 학폭에 시달려 머리가 깨질 것 같은데 집에서까지 이런 타박을 들어야 하냐"며 방문을 쾅 닫고 들어간다.',
        intent: '스트레스 방출 대립',
        immediateEffects: [
          { stat: 'mental', value: -15 },
          { stat: 'familySatisfaction', value: -25 },
          { stat: 'hp', value: -5 }
        ],
        hiddenFlags: ['self_sacrifice'],
        resultText: '가정은 차가운 빙하기로 접어들었으며, 집에서도 쉴 공간을 잃어버려 멘탈 지표가 심각하게 타격을 입었습니다.'
      },
      {
        id: 'choice_f03_3',
        text: '미안하다고 대답하며, 주말에 엄청나게 비싸고 좋은 근사한 식당과 선물을 예약할 테니 당장은 피곤하니 쉬게 해달라고 물질적 타협을 건넨다.',
        intent: '물질적 회피 조율',
        immediateEffects: [
          { stat: 'hp', value: 5 },
          { stat: 'familySatisfaction', value: 10 }
        ],
        hiddenFlags: ['conflict_avoidance'],
        resultText: '일단 당장은 갈등 상황을 피했습니다. 하지만 가족의 표정에 채워지지 않는 감정적 앙금이 쓸쓸히 서려 있습니다.'
      }
    ]
  },
  {
    id: 'evt_family_04',
    dayRange: [13, 17],
    title: '장학사 추천 도서 저술 제안',
    category: 'family',
    situation: '교무실',
    narratorText: '평소 따르던 명망 높은 교육청 수석 교사 선배로부터 연락이 왔다. "김 선생, 요즘 학교 현장의 고민을 담은 단행본 공동 집필진에 합류하지 않을래? 책이 발간되면 교계 베스트셀러가 될 거고 교육 전문 출판계에 이름이 널리 알려져 미래 진로에 큰 발판이 될 거야. 대신 원고 마감이 엄청 빡빡해."',
    weight: 80,
    tags: ['커리어', '출판'],
    choices: [
      {
        id: 'choice_f04_1',
        text: '전문 저술가 및 연구 전문가 경로로 발돋움하기 위해 피로를 무릅쓰고 필진 합류를 결정한다.',
        intent: '전문 연구 성과 지향',
        immediateEffects: [
          { stat: 'hp', value: -15 },
          { stat: 'expert', value: 20 },
          { stat: 'careerPoint', value: 25 },
          { stat: 'familySatisfaction', value: -15 }
        ],
        hiddenFlags: ['innovation_tendency', 'leadership'],
        resultText: '교사 저술가 파이프라인에 가입했습니다. 전국 교사 워크숍 강사 섭외 제안이 오기 시작하며 학술 연구 교사로서의 강력한 평판이 세워집니다.'
      },
      {
        id: 'choice_f04_2',
        text: '지금은 학급 아이들 지도와 현재 내 건강 상태를 추스르는 것도 벅차다며, 좋은 기회를 주어 감사하지만 정중하게 다음 기회로 양해를 구한다.',
        intent: '에너지 비축 사수',
        immediateEffects: [
          { stat: 'hp', value: 15 },
          { stat: 'mental', value: 10 },
          { stat: 'careerPoint', value: -10 }
        ],
        hiddenFlags: ['family_first'],
        resultText: '어깨 위의 큰 무거운 원고 짐을 털어내고 자유를 누렸습니다. 교실 수업 지도에 전념할 체력을 확보했습니다.'
      },
      {
        id: 'choice_f04_3',
        text: '선배 교사의 명예를 훼손하지 않기 위해, 원고 마감을 뒤로 미뤄주거나 본인의 부담 분량을 대폭 낮춰주는 조건으로만 합류하겠다고 제안한다.',
        intent: '안전한 성과 지분 획득',
        immediateEffects: [
          { stat: 'hp', value: -5 },
          { stat: 'careerPoint', value: 10 }
        ],
        hiddenFlags: ['conflict_avoidance'],
        resultText: '분량 조율에 성공하여 숟가락만 얹는 수준으로 참여하긴 했습니다. 선배 교사도 당신이 엄청난 헌신을 하지는 않는다는 걸 영리하게 눈치채고 있습니다.'
      }
    ]
  },
  {
    id: 'evt_family_05',
    dayRange: [16, 20],
    title: '건강검진 결과 번아웃 경고',
    category: 'family',
    situation: '집',
    narratorText: '지난달 학교 단체 건강검진 결과 우편물이 왔다. "극심한 불면증 및 자율신경계 과활성화, 위궤양 의심 징후. 당장 하루 7시간 이상의 수면을 확보하고 정신의학적 심리 스트레스 휴식을 권장합니다." 멘탈 지수 경고등이 켜졌다.',
    weight: 90,
    tags: ['건강위기', '번아웃'],
    choices: [
      {
        id: 'choice_f05_1',
        text: '당장 이번 주말에 모든 학교 업무 파일을 집으로 가져오지 않고, 병원 치료를 예약한 뒤 오직 수면과 산책으로만 몸을 돌본다.',
        intent: '적극적 휴식 및 건강 사수',
        immediateEffects: [
          { stat: 'hp', value: 25 },
          { stat: 'mental', value: 20 },
          { stat: 'adminPower', value: -5 }
        ],
        hiddenFlags: ['family_first'],
        resultText: '몸의 에너지가 놀랍게 충전되었습니다. 얼굴에 생기가 도니 아이들을 볼 때 짜증도 줄어들고 훈육이 한결 다정하고 유연해졌습니다.'
      },
      {
        id: 'choice_f05_2',
        text: '수행평가 마감과 학교 공개수업 계획서 제출이 다음 주 코앞이므로 약통에 진통제를 가득 담아 출근 가방에 넣고 모른 척 야근을 강행한다.',
        intent: '희생적 일 추진',
        immediateEffects: [
          { stat: 'hp', value: -20 },
          { stat: 'mental', value: -15 },
          { stat: 'burnout', value: 25 }, // 번아웃 위험도 폭증
          { stat: 'adminPower', value: 15 }
        ],
        hiddenFlags: ['self_sacrifice', 'performance_center'],
        resultText: '일은 완벽하게 쳐냈으나, 아침마다 위산이 솟아 역류성 식도염으로 헛구역질을 하며 가까스로 버팁니다. 번아웃 상태가 목 끝까지 차올랐습니다.'
      },
      {
        id: 'choice_f05_3',
        text: '가족에게 다리가 너무 아프다고 하소연하며 온종일 집에서 가족들이 차려주는 밥을 먹고 수발을 받아 가며 조용히 쉰다.',
        intent: '가족 지원 의존',
        immediateEffects: [
          { stat: 'hp', value: 15 },
          { stat: 'familySatisfaction', value: -10 }
        ],
        hiddenFlags: ['conflict_avoidance'],
        resultText: '체력은 조금 늘었지만, 지친 가사 노동과 간호를 도맡은 배우자는 당신의 지쳐서 징징거리는 칭얼거림에 지친 한숨을 뒤로 내쉬고 있습니다.'
      }
    ]
  },
  {
    id: 'evt_family_06',
    dayRange: [19, 22],
    title: '대학원 진학 및 학술 연구 기회',
    category: 'family',
    situation: '교무실',
    narratorText: '교육대학원 가을 학기 모집 요강이 발표되었다. 매주 화요일, 목요일 야간에 수업을 들어야 하지만, 이수를 마치면 임용고시 가산점과 함께 장학사/교육연구직 시험 응시 자격에 결정적인 가점을 얻는다. 대신 퇴근 후 시간은 완전히 전멸하게 되는데...',
    weight: 85,
    tags: ['대학원', '가산점'],
    choices: [
      {
        id: 'choice_f06_1',
        text: '연구 중심형 리더 장학사를 목표로 하기 위해, 밤샘 피로를 감수하고 대학원 진학 지원서에 교장의 도장을 받으러 간다.',
        intent: '연구 전문가 커리어 패스',
        immediateEffects: [
          { stat: 'hp', value: -10 },
          { stat: 'expert', value: 20 },
          { stat: 'careerPoint', value: 20 },
          { stat: 'familySatisfaction', value: -20 }
        ],
        hiddenFlags: ['performance_center', 'innovation_tendency'],
        resultText: '교장이 적극 추천 도장을 찍어주며 응원해 줍니다. 당신의 커리어 목표에 학문적 기반이 든든하게 실리는 궤도에 진입했습니다.'
      },
      {
        id: 'choice_f06_2',
        text: '지금도 야간 학부모 전화 대응과 체력 관리가 벅차다며, 지원서를 휴지통에 넣고 퇴근길 시원한 밤바람을 만끽한다.',
        intent: '현재에 충실한 워라밸',
        immediateEffects: [
          { stat: 'hp', value: 10 },
          { stat: 'mental', value: 10 },
          { stat: 'familySatisfaction', value: 15 },
          { stat: 'careerPoint', value: -10 }
        ],
        hiddenFlags: ['family_first'],
        resultText: '커리어 가산점 욕심은 내려놓았지만, 마음이 한결 넓어지고 현재 학급 아이들의 자잘한 얼굴빛을 관찰하는 여유를 매일 확보하게 되었습니다.'
      },
      {
        id: 'choice_f06_3',
        text: '대학원보다 비교적 과업이 느슨하고 온라인으로만 이수 가능한 60시간짜리 원격 직무 연수로 타협해 학점을 채운다.',
        intent: '타협적 이수',
        immediateEffects: [
          { stat: 'hp', value: -5 },
          { stat: 'expert', value: 10 },
          { stat: 'careerPoint', value: 5 }
        ],
        hiddenFlags: ['conflict_avoidance'],
        resultText: '적은 노력으로 최소한의 교육 이수 가점을 메웠습니다. 실리는 챙겼으나 강력한 커리어 점프업 카드로는 다소 미진합니다.'
      }
    ]
  },
  {
    id: 'evt_family_07',
    dayRange: [22, 25],
    title: '배우자의 큰 수술과 연가 신청',
    category: 'family',
    situation: '교무실',
    narratorText: '배우자(혹은 연로하신 부모님)가 가벼운 증상인 줄 알았으나 쓸개 돌 제거 수술을 위해 모레 2일간 긴급 입원해야 한다며 연가(휴가)를 써서 병간호를 해달라고 연락이 왔다. 하필 모레는 교장 교감이 총출동해 지켜보는 올해 가장 중요한 교육청 장학 지도 방문 평가 당일인데...',
    weight: 95,
    tags: ['가족입원', '연가결재', '위기'],
    choices: [
      {
        id: 'choice_f07_1',
        text: '교장선생님께 고개를 숙이고 사정을 설명한 뒤, 장학 지도는 동료 교무 교사들에게 백배사죄하여 인계하고 연가를 내어 병원으로 향한다.',
        intent: '가족 최우선 돌봄',
        immediateEffects: [
          { stat: 'adminTrust', value: -20 },
          { stat: 'familySatisfaction', value: 30 },
          { stat: 'colleagueRelation', value: -10 },
          { stat: 'mental', value: 15 }
        ],
        hiddenFlags: ['family_first'],
        resultText: '수술실 옆에서 밤새 손을 꼭 잡아주며 배우자의 눈물을 보았습니다. 평생을 같이할 동반자에게 가장 든든한 배우자라는 평생의 신뢰를 획득했습니다. 다만 학교 교장실과 동료 교무부의 표정에는 불쾌한 냉기가 서려 있습니다.'
      },
      {
        id: 'choice_f07_2',
        text: '수술은 병원 간병인 서비스에게 돈을 주고 전적으로 맡긴 뒤, 단정히 출근하여 장학 평가 위원회 발표와 행사 총괄을 완벽히 소화해 낸다.',
        intent: '투철한 직업의식 완수',
        immediateEffects: [
          { stat: 'hp', value: -10 },
          { stat: 'adminTrust', value: 25 },
          { stat: 'familySatisfaction', value: -30 }, // 극심한 가정 불화
          { stat: 'reputation', value: 20 }
        ],
        hiddenFlags: ['organism_adaptation', 'self_sacrifice'],
        resultText: '장학 장학관들로부터 "이 학교의 시스템과 김 교사의 브리핑은 일류"라는 극찬을 듣고 기안 실적도 멋지게 남겼습니다. 하지만 홀로 수술실 침대에서 깨어난 배우자는 당신에 대해 차갑고 영원한 상처를 마음에 새겼습니다.'
      },
      {
        id: 'choice_f07_3',
        text: '장학 지도가 열리는 오전 시간대에만 학교에 출근해 중요한 브리핑을 급하게 해치우고, 오후에 수술실 앞으로 부리나케 조퇴해 달려가는 2중 달리기를 시도한다.',
        intent: '아슬아슬한 양방 절충',
        immediateEffects: [
          { stat: 'hp', value: -20 },
          { stat: 'mental', value: -10 },
          { stat: 'familySatisfaction', value: 10 },
          { stat: 'adminTrust', value: 5 }
        ],
        hiddenFlags: ['conflict_avoidance', 'leadership'],
        resultText: '심장이 터져라 복도와 고속도로를 왕복하며 양쪽 다 위태롭게 챙기긴 했습니다. 온몸이 부스러질 것 같은 극한의 피로가 엄습합니다.'
      }
    ]
  },
  {
    id: 'evt_family_08',
    dayRange: [24, 27],
    title: '후배 교사의 절박한 멘토 요청',
    category: 'family',
    situation: '교무실',
    narratorText: '올해 갓 발령받은 옆 학년 신규 선생님이 울먹이는 표정으로 책상 앞으로 다가와 커피를 내려놓는다. "선생님, 학부모가 교무실로 찾아와 뺨을 치겠다고 협박 전화를 걸어와서 숨을 못 쉬겠어요... 어떻게 해야 할지 제발 한 번만 도와주세요." 과거 당신의 첫날이 오버랩되는데...',
    weight: 90,
    tags: ['멘토링', '신임교사'],
    choices: [
      {
        id: 'choice_f08_1',
        text: '내 일처럼 나서서 우는 신규 교사를 교감실로 데리고 가 보호받게 하고, 학부모 통화 대행 및 민원 일지 작성을 직접 끝까지 함께 해결해 준다.',
        intent: '이타적인 리더십 구제',
        immediateEffects: [
          { stat: 'hp', value: -15 },
          { stat: 'colleagueRelation', value: 25 },
          { stat: 'reputation', value: 15 },
          { stat: 'expert', value: 10 }
        ],
        hiddenFlags: ['leadership', 'self_sacrifice'],
        resultText: '당신의 든든한 조력 덕분에 후배 교사는 사직 위기를 딛고 안정을 찾았습니다. 후배 교사는 당신을 "평생의 은인 담임 선배"로 섬기며 깊은 존경을 보냅니다.'
      },
      {
        id: 'choice_f08_2',
        text: '안타깝지만 내 학급 일도 감당이 안 되므로 "부장 선생님께 정식으로 가보거나 교육청 교권 치유 센터 전화를 알려줄 테니 힘내라"고 다독이며 돌려보낸다.',
        intent: '안전한 책임 토스',
        immediateEffects: [
          { stat: 'hp', value: 5 },
          { stat: 'mental', value: 10 },
          { stat: 'colleagueRelation', value: -5 }
        ],
        hiddenFlags: ['conflict_avoidance'],
        resultText: '남의 불타는 갈등에 직접 뛰어들지 않고 현명하게 안전 거리를 확보했습니다. 신규 교사는 외로이 부장 교사를 찾아 고개를 떨구고 걸어갑니다.'
      },
      {
        id: 'choice_f08_3',
        text: '학년 부서 전체 단톡방에 후배의 상황을 공론화하여, 동 학년 전체 선배 교사들이 공동으로 긴급 민원 대책반을 구성하도록 주도한다.',
        intent: '조직적 협동 대응',
        immediateEffects: [
          { stat: 'hp', value: -10 },
          { stat: 'colleagueRelation', value: 20 },
          { stat: 'adminTrust', value: 10 }
        ],
        hiddenFlags: ['collaboration', 'leadership'],
        resultText: '최고의 집단지성적 대처였습니다. 혼자 독박 쓰지 않으면서 학교 전체가 악성 민원에 함께 맞서는 건강한 대응 시스템을 만드는데 주도적 공을 세웠습니다.'
      }
    ]
  },
  {
    id: 'evt_family_09',
    dayRange: [26, 29],
    title: '명예로운 교육 혁신 대상 후보 선정',
    category: 'family',
    situation: '교무실',
    narratorText: '교육청 주관 "올해의 교육 혁신 대상 우수 실천가" 최종 후보 3인에 당신의 이름이 등록되었다. 최종 심사를 통과하려면 지난 30일간의 학급 성장 사례 기록과 학생 소통 포트폴리오 100페이지를 일주일 내에 철저히 검증 작성해 제출해야 한다. 대단히 명예롭지만 막판 에너지가 곤두박질친다.',
    weight: 90,
    tags: ['커리어', '영예'],
    choices: [
      {
        id: 'choice_f09_1',
        text: '혁신 교사의 최고 영예를 차지하기 위해 마지막 남은 한 방울의 체력까지 쥐어짜 일주일간 매일 밤 11시까지 보고서를 완성한다.',
        intent: '영예를 향한 질주',
        immediateEffects: [
          { stat: 'hp', value: -25 },
          { stat: 'burnout', value: 25 },
          { stat: 'careerPoint', value: 30 },
          { stat: 'reputation', value: 25 }
        ],
        hiddenFlags: ['performance_center', 'self_sacrifice'],
        resultText: '피눈물 나는 원고 작업 끝에 교육 혁신 대상을 수상하는 영광을 누렸습니다! 로비에 사진이 걸리며 교육감 표창장을 들고 교장의 함박웃음과 함께 세리머니를 벌였습니다.'
      },
      {
        id: 'choice_f09_2',
        text: '이미 충분히 열심히 살아왔고 이런 보여주기식 서류 검증에 더는 내 수명과 건강을 갈아 넣고 싶지 않다며 후보직 사퇴를 정중히 알린다.',
        intent: '지속 가능한 삶의 만족',
        immediateEffects: [
          { stat: 'hp', value: 20 },
          { stat: 'mental', value: 20 },
          { stat: 'familySatisfaction', value: 20 },
          { stat: 'reputation', value: -10 }
        ],
        hiddenFlags: ['family_first'],
        resultText: '수류탄 같은 명예 보고서 경쟁을 내려놓고 가뿐하게 웃으며 퇴근합니다. 당신의 저녁 식탁에서 가족들은 당신의 밝은 웃음을 아주 기뻐합니다.'
      },
      {
        id: 'choice_f09_3',
        text: '동료 교사들에게 자료 취합 편집을 아르바이트 급여나 맛있는 저녁 식사 대접을 약속하고 품을 사서 대신 편집해 올리게 한다.',
        intent: '자본주의식 협업 아웃소싱',
        immediateEffects: [
          { stat: 'hp', value: -5 },
          { stat: 'colleagueRelation', value: -10 },
          { stat: 'careerPoint', value: 15 }
        ],
        hiddenFlags: ['conflict_avoidance'],
        resultText: '몸은 사렸으나, 뒤에서 돈을 줘가며 실적 포장을 했다는 소문이 영리한 동료들 사이에서 돌아 품격 점수에 다소 흠집이 생겼습니다.'
      }
    ]
  },
  {
    id: 'evt_family_10',
    dayRange: [29, 30],
    title: '30일째 마지막 종례 시간',
    category: 'family',
    situation: '교실',
    narratorText: '드디어 30일(MVP 축약)의 기나긴 긴 여정이 끝나고 마지막 종례 시간이 찾아왔다. 교탁 위에는 분필 가루와 함께 아이들이 수줍게 모아 둔 교무수첩과, 칠판 가득 적힌 롤링페이퍼가 당신을 조용히 맞이하고 있다.',
    weight: 100,
    tags: ['마지막날', '종례'],
    choices: [
      {
        id: 'choice_f10_1',
        text: '지난 한 달간 겪었던 수많은 갈등과 성장을 소회하며 아이들에게 따뜻한 포옹과 눈물의 종례 훈시를 나눈다.',
        intent: '사랑 어린 헌신적 작별',
        immediateEffects: [
          { stat: 'mental', value: 15 },
          { stat: 'studentTrust', value: 20 }
        ],
        hiddenFlags: ['student_center'],
        resultText: '아이들도 눈물을 훔치며 교사 주변으로 와 다정하게 매달렸습니다. 지훈이도 쑥스러운 표정으로 "선생님 죄송했고 감사했어요"라며 작은 초콜릿을 건넸습니다.'
      },
      {
        id: 'choice_f10_2',
        text: '앞으로 다가올 방학식 일정과 행정 안내 지시를 정확히 낭독한 후, 마지막까지 엄격하고 깔끔하게 원칙을 공지하고 종례를 마감한다.',
        intent: '철저한 절차적 마무리',
        immediateEffects: [
          { stat: 'adminPower', value: 15 },
          { stat: 'adminTrust', value: 10 }
        ],
        hiddenFlags: ['fairness', 'organism_adaptation'],
        resultText: '단 한 건의 안전사고나 안내 전달 누락 없이 깔끔하고 군더더기 없는 완벽한 프로의 행정으로 마무리되었습니다. 관리자들이 박수를 보냅니다.'
      },
      {
        id: 'choice_f10_3',
        text: '아이들과 칠판을 배경으로 다 함께 익살스러운 포즈로 단체 브이 사진을 찍고 남은 간식을 나눠 먹으며 웃으며 종례를 해산한다.',
        intent: '유쾌하고 자유로운 마무리',
        immediateEffects: [
          { stat: 'hp', value: 10 },
          { stat: 'studentTrust', value: 15 },
          { stat: 'familySatisfaction', value: 15 }
        ],
        hiddenFlags: ['family_first', 'conflict_avoidance'],
        resultText: '아이들은 가장 즐겁고 기억에 남는 담임 교사와의 인생 샷을 건졌다며 소리를 지르고 쾌활하게 교실을 뛰어나갔습니다.'
      }
    ]
  }
];
