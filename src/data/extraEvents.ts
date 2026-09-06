import type { GameEvent } from '@/game/types';

// ==========================================================================
// 추가 사건군 — 기존 이벤트 풀이 다루지 않던 교직 현장의 국면들을 채운다.
//
// 구성 의도
//  1) 장소 전용 사건: location을 지정해 해당 장소를 탐색할 때만 등장 (장소마다 갈 이유를 준다)
//  2) 2~3단계 서사 아크: followUpEvents로 며칠 뒤 결과가 돌아오는 인과 사슬
//  3) 히든 탐험 사건: '히든탐험' 태그가 붙어 낮은 확률로만 발견되는 보상 사건
//  4) 후반부 압박 사건: dayRange를 뒤쪽에 두어 학기말 난이도 곡선을 지지
//
// 후속 전용 단계(*_follow, *_result)는 스토어의 SCHEDULED_ONLY_EVENT_IDS가 자동으로
// 랜덤 추첨에서 제외하므로, 도입부 없이 뜬금없이 등장하지 않는다.
// ==========================================================================

export const extraEvents: GameEvent[] = [
  // ==================== 1. 교실 · 학생 ====================
  {
    id: 'evt_extra_lost_wallet',
    dayRange: [4, 20],
    title: '사라진 지갑',
    category: 'student',
    situation: '교실',
    location: 'classroom',
    narratorText:
      '5교시가 끝나자 소윤이가 울먹이며 다가옵니다. 사물함에 둔 지갑이 사라졌다고 합니다. 안에는 할머니가 주신 오천 원과 가족사진이 들어 있었습니다. 아이들의 시선이 서로를 향하며 교실 공기가 순식간에 싸늘해집니다.',
    weight: 110,
    cooldown: 8,
    tags: ['학급운영', '갈등'],
    valence: 'negative',
    choices: [
      {
        id: 'choice_extra_wallet_1',
        text: '전원 가방 검사를 실시해 지금 이 자리에서 범인을 찾는다.',
        intent: '즉각 색출',
        immediateEffects: [
          { stat: 'studentTrust', value: -12 },
          { stat: 'parentComplaint', value: 10 },
          { stat: 'educationSoshin', value: -8 }
        ],
        hiddenFlags: ['rules_strict'],
        riskText: '전체 소지품 검사는 인권 침해 소지가 있습니다.',
        resultText:
          '지갑은 끝내 나오지 않았고, 아이들은 서로를 의심하는 눈으로 바라봅니다. 그날 저녁 한 학부모에게서 "우리 아이를 도둑 취급했다"는 항의 전화가 걸려옵니다.'
      },
      {
        id: 'choice_extra_wallet_2',
        text: '"쉬는 시간에 아무도 없을 때 제자리에 두면 아무 일 없었던 걸로 하겠다"고 공지한다.',
        intent: '익명 회수 기회 부여',
        successRate: 70,
        immediateEffects: [
          { stat: 'studentTrust', value: 10 },
          { stat: 'educationSoshin', value: 10 },
          { stat: 'teachingSatisfaction', value: 8 }
        ],
        successResultText:
          '다음 날 아침, 지갑은 사물함 위에 조용히 놓여 있었습니다. 누가 두었는지 아무도 묻지 않았고, 소윤이는 가족사진을 꼭 끌어안았습니다.',
        failEffects: [
          { stat: 'studentTrust', value: -5 },
          { stat: 'mental', value: -8 }
        ],
        failResultText:
          '며칠이 지나도 지갑은 돌아오지 않았습니다. 믿고 기다린 시간이 헛되었다는 무력감이 남습니다.',
        followUpEvents: ['evt_extra_lost_wallet_follow'],
        hiddenFlags: ['student_center']
      },
      {
        id: 'choice_extra_wallet_3',
        text: '학생들에게는 알리지 않고, 방과 후 CCTV 확인과 담당 부장 상의를 먼저 거친다.',
        intent: '절차적 처리',
        immediateEffects: [
          { stat: 'adminPower', value: 6 },
          { stat: 'colleagueSolidarity', value: 6 },
          { stat: 'studentTrust', value: -3 },
          { stat: 'hp', value: -5 }
        ],
        hiddenFlags: ['organism_adapt'],
        resultText:
          '복도 CCTV에는 아무것도 잡히지 않았지만, 절차를 밟아둔 덕에 이후 학부모 문의에 흔들리지 않고 답할 수 있었습니다.'
      }
    ]
  },
  {
    id: 'evt_extra_lost_wallet_follow',
    dayRange: [1, 30],
    title: '지갑을 돌려놓은 아이',
    category: 'student',
    situation: '교실',
    narratorText:
      '며칠 뒤 방과 후, 한 아이가 교실 문 앞에서 한참을 서성이다 들어옵니다. "선생님... 그거, 제가 그랬어요." 고개를 들지 못한 채 손끝만 만지작거립니다. 학원비를 잃어버려 혼날까 봐 겁이 났다고 합니다.',
    weight: 999,
    tags: ['서사 아크', '학급운영'],
    valence: 'neutral',
    choices: [
      {
        id: 'choice_extra_wallet_follow_1',
        text: '"말해줘서 고맙다"고 먼저 말하고, 함께 사과할 방법을 찾아본다.',
        intent: '회복적 생활교육',
        immediateEffects: [
          { stat: 'studentTrust', value: 14 },
          { stat: 'teachingSatisfaction', value: 14 },
          { stat: 'educationSoshin', value: 10 },
          { stat: 'mental', value: 5 }
        ],
        hiddenFlags: ['student_center', 'restorative_practice'],
        grantsItem: 'class_diary',
        resultText:
          '아이는 소윤이에게 직접 편지를 썼고, 두 아이는 어색하게 웃으며 화해했습니다. 이 학급이 어떤 곳인지 아이들 스스로 배운 하루였습니다.'
      },
      {
        id: 'choice_extra_wallet_follow_2',
        text: '규정대로 학부모를 부르고 선도 절차를 안내한다.',
        intent: '원칙 적용',
        immediateEffects: [
          { stat: 'educationSoshin', value: 6 },
          { stat: 'adminTrust', value: 6 },
          { stat: 'studentTrust', value: -8 },
          { stat: 'parentComplaint', value: 6 }
        ],
        hiddenFlags: ['rules_strict'],
        resultText:
          '절차는 깔끔했지만, 용기를 내어 찾아온 아이의 얼굴이 하루 종일 마음에 걸립니다.'
      }
    ]
  },
  {
    id: 'evt_extra_silent_kid',
    dayRange: [6, 24],
    title: '한 달째 말이 없는 아이',
    category: 'student',
    situation: '교실',
    location: 'classroom',
    narratorText:
      '학기가 시작된 지 한참인데도 지원이는 교실에서 한마디도 하지 않습니다. 발표는커녕 대답도 고갯짓으로만 합니다. 그런데 오늘 청소 시간, 아무도 없는 교실에서 혼자 흥얼거리는 노랫소리를 우연히 들었습니다.',
    weight: 100,
    cooldown: 10,
    tags: ['학생이해', '정서지원'],
    valence: 'neutral',
    choices: [
      {
        id: 'choice_extra_silent_1',
        text: '노래 이야기는 꺼내지 않고, 매일 아침 짧은 인사만 건네며 기다린다.',
        intent: '조급하지 않은 관계 형성',
        immediateEffects: [
          { stat: 'studentTrust', value: 8 },
          { stat: 'teachingSatisfaction', value: 6 },
          { stat: 'expert', value: 4 }
        ],
        hiddenFlags: ['student_center'],
        followUpEvents: ['evt_extra_silent_kid_follow'],
        resultText:
          '지원이는 여전히 말이 없지만, 아침 인사에 손을 살짝 들어 답하기 시작했습니다. 무언가가 조금씩 움직이고 있습니다.'
      },
      {
        id: 'choice_extra_silent_2',
        text: 'Wee 클래스 상담 선생님과 사례 협의를 요청해 전문 개입을 연계한다.',
        intent: '전문 자원 연계',
        immediateEffects: [
          { stat: 'expert', value: 8 },
          { stat: 'colleagueSolidarity', value: 8 },
          { stat: 'studentTrust', value: 5 },
          { stat: 'hp', value: -4 }
        ],
        hiddenFlags: ['collaboration'],
        followUpEvents: ['evt_extra_silent_kid_follow'],
        resultText:
          '상담 선생님이 선택적 함구증 가능성을 언급하며 단계적 접근을 제안했습니다. 혼자 끌어안지 않아도 된다는 사실이 큰 위안이 됩니다.'
      },
      {
        id: 'choice_extra_silent_3',
        text: '전체 앞에서 발표 기회를 만들어 자연스럽게 말을 유도해본다.',
        intent: '노출을 통한 개입',
        successRate: 25,
        immediateEffects: [
          { stat: 'studentTrust', value: 6 },
          { stat: 'teachingSatisfaction', value: 6 }
        ],
        successResultText: '뜻밖에도 지원이가 아주 작은 목소리로 한 문장을 읽어냈습니다. 교실에 박수가 터졌습니다.',
        failEffects: [
          { stat: 'studentTrust', value: -10 },
          { stat: 'parentComplaint', value: 8 },
          { stat: 'mental', value: -6 }
        ],
        failResultText:
          '지원이는 굳어버린 채 아무 말도 하지 못했고, 몇몇 아이가 킥킥거렸습니다. 그날 이후 지원이는 눈도 마주치지 않습니다.'
      }
    ]
  },
  {
    id: 'evt_extra_silent_kid_follow',
    dayRange: [1, 30],
    title: '작은 목소리',
    category: 'student',
    situation: '교실',
    narratorText:
      '며칠 뒤 하교 시간, 지원이가 교탁 앞에 서 있습니다. 한참을 망설이더니, 들릴 듯 말 듯한 목소리로 말합니다. "선생님... 내일도... 인사해 주세요."',
    weight: 999,
    tags: ['서사 아크', '정서지원'],
    valence: 'positive',
    choices: [
      {
        id: 'choice_extra_silent_follow_1',
        text: '"당연하지. 내일도, 그다음 날도."라고 눈을 맞추며 답한다.',
        intent: '약속',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'teachingSatisfaction', value: 18 },
          { stat: 'mental', value: 10 },
          { stat: 'educationSoshin', value: 8 }
        ],
        hiddenFlags: ['student_center', 'true_mentor_moment'],
        grantsItem: 'student_sketchbook',
        resultText:
          '지원이가 처음으로 웃었습니다. 이 일을 왜 계속하는지, 오늘 하루로 충분히 설명이 됩니다.'
      }
    ]
  },

  // ==================== 2. 장소 전용 사건 ====================
  {
    id: 'evt_extra_library_note',
    dayRange: [5, 28],
    title: '반납된 책 사이의 쪽지',
    category: 'student',
    situation: '도서실',
    location: 'library',
    narratorText:
      '도서실 반납대를 정리하다 책장 사이에서 접힌 쪽지를 발견했습니다. 삐뚤빼뚤한 글씨로 "아무도 나한테 말 안 걸어"라고만 적혀 있습니다. 이름은 없습니다.',
    weight: 90,
    cooldown: 12,
    tags: ['히든탐험', '정서지원'],
    valence: 'neutral',
    choices: [
      {
        id: 'choice_extra_library_note_1',
        text: '쪽지를 간직하고, 다음 주 학급 활동에 "친구에게 말 걸기" 시간을 슬며시 끼워 넣는다.',
        intent: '드러내지 않는 개입',
        immediateEffects: [
          { stat: 'studentTrust', value: 8 },
          { stat: 'educationSoshin', value: 8 },
          { stat: 'teachingSatisfaction', value: 8 },
          { stat: 'expert', value: 5 }
        ],
        hiddenFlags: ['student_center'],
        grantsItem: 'mystery_note',
        resultText:
          '누가 쓴 쪽지인지는 끝내 모릅니다. 다만 그 주 이후, 혼자 앉아 있던 자리가 하나 줄었습니다.'
      },
      {
        id: 'choice_extra_library_note_2',
        text: '학급 전체에 "이런 쪽지를 주웠다"고 알리며 쓴 사람을 찾는다.',
        intent: '공개 확인',
        immediateEffects: [
          { stat: 'studentTrust', value: -8 },
          { stat: 'mental', value: -5 }
        ],
        resultText:
          '아무도 손을 들지 않았습니다. 다만 한 아이의 얼굴이 하얗게 질리는 것을 보았고, 그 뒤로 그 아이는 도서실에 오지 않습니다.'
      }
    ]
  },
  {
    id: 'evt_extra_health_room_regular',
    dayRange: [8, 28],
    title: '보건실 단골손님',
    category: 'student',
    situation: '보건실',
    location: 'health_room',
    narratorText:
      '보건 선생님이 조심스럽게 부릅니다. "선생님 반 하준이 말인데요, 이번 주만 다섯 번째예요. 매번 아픈 곳이 다르고, 매번 4교시 수학 시간이에요." 체온도 혈색도 정상입니다.',
    weight: 95,
    cooldown: 10,
    tags: ['학생이해', '수업'],
    valence: 'neutral',
    choices: [
      {
        id: 'choice_extra_health_1',
        text: '수학 시간에 하준이가 어디서 막히는지부터 조용히 관찰한다.',
        intent: '원인 진단',
        immediateEffects: [
          { stat: 'expert', value: 10 },
          { stat: 'studentTrust', value: 8 },
          { stat: 'teachingSatisfaction', value: 6 },
          { stat: 'hp', value: -3 }
        ],
        hiddenFlags: ['student_center'],
        resultText:
          '두 자릿수 나눗셈에서 손이 멈춥니다. 아픈 게 아니라 부끄러웠던 것입니다. 다음 날부터 아침 10분씩 함께 풀기로 했습니다.'
      },
      {
        id: 'choice_extra_health_2',
        text: '"꾀병은 안 된다"고 단호히 말하고 보건실 출입을 제한한다.',
        intent: '규율 우선',
        immediateEffects: [
          { stat: 'studentTrust', value: -10 },
          { stat: 'parentComplaint', value: 8 },
          { stat: 'educationSoshin', value: -5 }
        ],
        hiddenFlags: ['rules_strict'],
        resultText:
          '하준이는 더 이상 보건실에 가지 않습니다. 대신 4교시마다 책상에 엎드려 있습니다.'
      },
      {
        id: 'choice_extra_health_3',
        text: '보건 선생님께 협조를 구해 "쉼 쿠폰 3장" 같은 완충 장치를 함께 설계한다.',
        intent: '협업적 대안 설계',
        immediateEffects: [
          { stat: 'colleagueSolidarity', value: 10 },
          { stat: 'studentTrust', value: 6 },
          { stat: 'expert', value: 6 },
          { stat: 'hp', value: -3 }
        ],
        hiddenFlags: ['collaboration'],
        resultText:
          '스스로 쓸 수 있는 쉼표가 생기자 하준이는 오히려 쿠폰을 아꼈습니다. 이번 주 보건실 방문은 한 번뿐이었습니다.'
      }
    ]
  },
  {
    id: 'evt_extra_science_lab_spill',
    dayRange: [10, 28],
    title: '과학실 시약 유출',
    category: 'admin',
    situation: '과학실',
    location: 'science_lab',
    narratorText:
      '과학실 점검 중 캐비닛 아래에서 라벨이 벗겨진 시약병이 새고 있는 것을 발견했습니다. 관리 대장에는 폐기 처리된 것으로 적혀 있습니다. 서류와 현실이 어긋나 있습니다.',
    weight: 100,
    cooldown: 12,
    tags: ['안전', '행정'],
    valence: 'negative',
    choices: [
      {
        id: 'choice_extra_science_1',
        text: '즉시 학생 출입을 통제하고 사진과 함께 정식으로 안전 사고 보고를 올린다.',
        intent: '원칙적 안전 보고',
        immediateEffects: [
          { stat: 'adminPower', value: 10 },
          { stat: 'educationSoshin', value: 10 },
          { stat: 'reputation', value: 6 },
          { stat: 'colleagueRelation', value: -6 },
          { stat: 'hp', value: -5 }
        ],
        hiddenFlags: ['rules_strict', 'safety_first'],
        resultText:
          '관리 담당 선생님이 곤란해졌지만, 아이들이 드나드는 공간의 위험은 사라졌습니다. 교감 선생님이 "그건 잘한 일"이라고 짧게 말했습니다.'
      },
      {
        id: 'choice_extra_science_2',
        text: '조용히 처리하고 관리 담당 선생님께만 귀띔한다.',
        intent: '관계 보호',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 8 },
          { stat: 'educationSoshin', value: -8 },
          { stat: 'mental', value: -6 }
        ],
        hiddenFlags: ['conflict_avoidance'],
        delayedEffects: [
          {
            dayTrigger: 30,
            effects: [
              { stat: 'mental', value: -8 },
              { stat: 'adminTrust', value: -6 }
            ],
            message: '[지연] 과학실 안전 점검에서 같은 문제가 다시 지적되었습니다. 그때 덮은 것이 마음에 걸립니다.'
          }
        ],
        resultText: '담당 선생님은 고마워하며 서둘러 처리했습니다. 다만 대장은 여전히 사실과 다릅니다.'
      }
    ]
  },
  {
    id: 'evt_extra_gate_late',
    dayRange: [3, 26],
    title: '교문 앞, 매일 늦는 아이',
    category: 'student',
    situation: '교문',
    location: 'school_gate',
    narratorText:
      '등교 지도 중 오늘도 서진이가 마지막으로 뛰어 들어옵니다. 벌써 여섯 번째입니다. 가까이서 보니 교복 셔츠가 어제와 같고, 아침을 먹지 않은 듯 얼굴이 창백합니다.',
    weight: 105,
    cooldown: 9,
    tags: ['학생이해', '복지'],
    valence: 'neutral',
    choices: [
      {
        id: 'choice_extra_gate_1',
        text: '지각 기록을 남기기 전에, 오늘 아침이 어땠는지부터 물어본다.',
        intent: '배경 확인',
        immediateEffects: [
          { stat: 'studentTrust', value: 10 },
          { stat: 'expert', value: 6 },
          { stat: 'teachingSatisfaction', value: 6 }
        ],
        hiddenFlags: ['student_center'],
        followUpEvents: ['evt_extra_gate_late_follow'],
        resultText:
          '서진이는 한참 머뭇거리다 "동생 어린이집 데려다주고 와요"라고 말했습니다. 지각의 이유가 게으름이 아니었습니다.'
      },
      {
        id: 'choice_extra_gate_2',
        text: '규정대로 지각 처리하고 반복 시 학부모 통보 예정임을 안내한다.',
        intent: '규정 안내',
        immediateEffects: [
          { stat: 'adminPower', value: 5 },
          { stat: 'educationSoshin', value: 3 },
          { stat: 'studentTrust', value: -8 }
        ],
        hiddenFlags: ['rules_strict'],
        resultText: '서진이는 고개를 끄덕이고 조용히 교실로 갔습니다. 다음 날도, 그다음 날도 마지막으로 들어옵니다.'
      }
    ]
  },
  {
    id: 'evt_extra_gate_late_follow',
    dayRange: [1, 30],
    title: '복지 연계 회의',
    category: 'career',
    situation: '교무실',
    narratorText:
      '서진이의 가정 상황을 확인한 뒤, 교육복지사 선생님과 마주 앉았습니다. 지원 가능한 제도가 몇 가지 있지만, 어느 것도 서류 없이는 시작되지 않습니다. 퇴근 시간은 이미 지났습니다.',
    weight: 999,
    tags: ['서사 아크', '복지'],
    valence: 'neutral',
    choices: [
      {
        id: 'choice_extra_gate_follow_1',
        text: '남아서 필요한 서류와 신청서를 하나하나 함께 채운다.',
        intent: '끝까지 연결',
        immediateEffects: [
          { stat: 'studentTrust', value: 12 },
          { stat: 'teachingSatisfaction', value: 15 },
          { stat: 'colleagueSolidarity', value: 8 },
          { stat: 'hp', value: -12 },
          { stat: 'familySatisfaction', value: -8 },
          { stat: 'burnout', value: 8 }
        ],
        hiddenFlags: ['self_sacrifice', 'student_center'],
        resultText:
          '밤 9시가 넘어 학교를 나섰습니다. 다음 달부터 서진이네는 아침 돌봄과 급식 지원을 받게 됩니다. 몸은 무겁지만 발걸음은 가볍습니다.'
      },
      {
        id: 'choice_extra_gate_follow_2',
        text: '안내문만 전달하고 나머지는 가정에서 진행하도록 맡긴다.',
        intent: '역할 경계 유지',
        immediateEffects: [
          { stat: 'hp', value: 5 },
          { stat: 'familySatisfaction', value: 5 },
          { stat: 'teachingSatisfaction', value: -6 },
          { stat: 'studentTrust', value: -4 }
        ],
        hiddenFlags: ['work_boundary'],
        resultText:
          '안내문은 전달했지만 신청은 이뤄지지 않았습니다. 교사가 할 수 있는 일의 경계가 어디까지인지, 답이 나오지 않습니다.'
      }
    ]
  },

  // ==================== 3. 동료 · 관리자 ====================
  {
    id: 'evt_extra_credit_stolen',
    dayRange: [12, 28],
    title: '내 자료가 남의 이름으로',
    category: 'colleague',
    situation: '교무실',
    narratorText:
      '전체 교직원 메신저에 올라온 우수 사례 자료를 열어봅니다. 지난달 직접 만들어 동학년 폴더에 올려둔 수업 자료가, 표지만 바뀐 채 다른 선생님의 이름으로 교육청에 제출되어 있습니다.',
    weight: 105,
    cooldown: 12,
    tags: ['동료갈등', '전문성'],
    valence: 'negative',
    choices: [
      {
        id: 'choice_extra_credit_1',
        text: '해당 선생님에게 조용히 찾아가 원본 파일 기록을 보여주며 정정을 요청한다.',
        intent: '직접 대면 정정 요구',
        successRate: 60,
        immediateEffects: [
          { stat: 'reputation', value: 10 },
          { stat: 'educationSoshin', value: 8 },
          { stat: 'expert', value: 5 }
        ],
        successResultText:
          '그 선생님은 크게 당황하며 공동 제작으로 정정 신청을 올렸습니다. 관계는 어색해졌지만 이름은 되찾았습니다.',
        failEffects: [
          { stat: 'colleagueRelation', value: -12 },
          { stat: 'mental', value: -10 },
          { stat: 'colleagueSolidarity', value: -8 }
        ],
        failResultText:
          '"동학년 공유 폴더 자료는 공동 자산 아닌가요?"라는 답이 돌아왔습니다. 대화는 평행선을 달렸고, 교무실 공기가 며칠간 얼어붙었습니다.'
      },
      {
        id: 'choice_extra_credit_2',
        text: '교감 선생님께 경위를 정리해 공식적으로 보고한다.',
        intent: '공식 절차 제기',
        immediateEffects: [
          { stat: 'adminTrust', value: 8 },
          { stat: 'adminPower', value: 6 },
          { stat: 'colleagueRelation', value: -15 },
          { stat: 'colleagueSolidarity', value: -10 },
          { stat: 'reputation', value: 5 }
        ],
        hiddenFlags: ['rules_strict'],
        resultText:
          '공적으로는 정리되었습니다. 다만 그 뒤로 동학년 협의회에서 아무도 먼저 말을 걸지 않습니다.'
      },
      {
        id: 'choice_extra_credit_3',
        text: '넘어가고, 대신 앞으로는 개인 폴더에만 원본을 보관하기로 한다.',
        intent: '자기 방어로 전환',
        immediateEffects: [
          { stat: 'mental', value: -12 },
          { stat: 'colleagueSolidarity', value: -6 },
          { stat: 'teachingSatisfaction', value: -8 },
          { stat: 'adminPower', value: 4 }
        ],
        hiddenFlags: ['conflict_avoidance'],
        resultText:
          '아무 일도 일어나지 않았습니다. 다만 다음 자료를 만들 때, 예전만큼 신이 나지 않습니다.'
      }
    ]
  },
  {
    id: 'evt_extra_newbie_mentor',
    dayRange: [7, 26],
    title: '옆 반 신규 선생님의 SOS',
    category: 'colleague',
    situation: '교무실',
    location: 'office',
    narratorText:
      '퇴근하려는데 옆 반 신규 선생님이 모니터 앞에서 울고 있습니다. 첫 학부모 상담 주간을 앞두고 무엇을 어떻게 말해야 할지 하나도 모르겠다고 합니다. 이미 저녁 7시입니다.',
    weight: 100,
    cooldown: 10,
    tags: ['동료', '멘토링'],
    valence: 'neutral',
    choices: [
      {
        id: 'choice_extra_newbie_1',
        text: '내가 쓰던 상담 시나리오와 기록 양식을 통째로 넘겨주고 30분간 코칭한다.',
        intent: '적극적 멘토링',
        immediateEffects: [
          { stat: 'colleagueSolidarity', value: 15 },
          { stat: 'colleagueRelation', value: 12 },
          { stat: 'reputation', value: 8 },
          { stat: 'hp', value: -8 },
          { stat: 'familySatisfaction', value: -5 }
        ],
        hiddenFlags: ['leadership', 'collaboration'],
        followUpEvents: ['evt_extra_newbie_mentor_follow'],
        resultText:
          '신규 선생님은 몇 번이나 고개를 숙였습니다. 집에 늦게 갔지만, 오늘의 30분이 그 선생님의 1년을 바꿀지도 모릅니다.'
      },
      {
        id: 'choice_extra_newbie_2',
        text: '"저도 처음엔 그랬어요"라고 다독이고 양식만 메신저로 보내준다.',
        intent: '가벼운 지원',
        immediateEffects: [
          { stat: 'colleagueSolidarity', value: 6 },
          { stat: 'colleagueRelation', value: 5 },
          { stat: 'hp', value: -2 }
        ],
        resultText: '작은 도움이었지만 신규 선생님의 표정이 조금 풀렸습니다. 오늘은 정시에 퇴근합니다.'
      },
      {
        id: 'choice_extra_newbie_3',
        text: '내 일도 밀려 있어 모른 척하고 조용히 나선다.',
        intent: '거리 두기',
        immediateEffects: [
          { stat: 'colleagueSolidarity', value: -10 },
          { stat: 'mental', value: -5 },
          { stat: 'hp', value: 5 },
          { stat: 'familySatisfaction', value: 6 }
        ],
        hiddenFlags: ['work_boundary'],
        resultText:
          '주차장까지 걸어가는 내내 그 울음소리가 따라옵니다. 내 앞가림도 벅찬 게 사실이지만, 개운하지는 않습니다.'
      }
    ]
  },
  {
    id: 'evt_extra_newbie_mentor_follow',
    dayRange: [1, 30],
    title: '신규 선생님의 답례',
    category: 'colleague',
    situation: '교무실',
    narratorText:
      '며칠 뒤 아침, 책상 위에 커피 한 잔과 쪽지가 놓여 있습니다. "선생님 덕분에 상담 무사히 마쳤어요. 한 어머님이 저한테 고맙다고 하셨어요. 태어나서 제일 기뻤습니다."',
    weight: 999,
    tags: ['서사 아크', '동료'],
    valence: 'positive',
    choices: [
      {
        id: 'choice_extra_newbie_follow_1',
        text: '커피를 들고 가 "다음엔 선생님이 후배한테 그렇게 해주면 돼요"라고 답한다.',
        intent: '선순환 잇기',
        immediateEffects: [
          { stat: 'colleagueSolidarity', value: 12 },
          { stat: 'mental', value: 12 },
          { stat: 'teachingSatisfaction', value: 10 },
          { stat: 'reputation', value: 6 }
        ],
        hiddenFlags: ['leadership'],
        resultText:
          '그날 이후 그 선생님은 무슨 일이 생기면 가장 먼저 달려와 돕습니다. 교무실에 편이 하나 생겼습니다.'
      }
    ]
  },
  {
    id: 'evt_extra_principal_showcase',
    dayRange: [16, 28],
    title: '교장 선생님의 갑작스러운 제안',
    category: 'admin',
    situation: '교장실',
    location: 'principal_room',
    narratorText:
      '교장 선생님이 차를 권하며 말을 꺼냅니다. "다음 달 교육청 우수 수업 사례 발표, 우리 학교에서 한 명 나가야 하는데 선생님 생각이 나서요." 영광스러운 제안이지만, 준비 기간은 3주뿐이고 이미 일정은 포화 상태입니다.',
    weight: 110,
    cooldown: 15,
    tags: ['커리어', '관리자'],
    valence: 'neutral',
    choices: [
      {
        id: 'choice_extra_principal_1',
        text: '기회를 잡는다. "해보겠습니다."',
        intent: '커리어 확장',
        successRate: 55,
        immediateEffects: [
          { stat: 'careerPoint', value: 15 },
          { stat: 'reputation', value: 12 },
          { stat: 'adminTrust', value: 10 },
          { stat: 'burnout', value: 12 },
          { stat: 'familySatisfaction', value: -10 }
        ],
        hiddenFlags: ['performance_center'],
        successResultText:
          '발표는 성공적이었고, 여러 학교에서 자료 요청이 들어왔습니다. 다만 3주간 집에는 잠만 자러 들어갔습니다.',
        failEffects: [
          { stat: 'burnout', value: 20 },
          { stat: 'mental', value: -12 },
          { stat: 'adminTrust', value: -8 },
          { stat: 'familySatisfaction', value: -12 }
        ],
        failResultText:
          '준비 시간이 절대적으로 부족했습니다. 발표는 무난했지만 인상적이지 않았고, 남은 것은 소진된 3주뿐입니다.'
      },
      {
        id: 'choice_extra_principal_2',
        text: '"지금 학급 상황상 어렵습니다"라고 솔직히 사양한다.',
        intent: '한계 선언',
        immediateEffects: [
          { stat: 'adminTrust', value: -8 },
          { stat: 'careerPoint', value: -3 },
          { stat: 'mental', value: 8 },
          { stat: 'familySatisfaction', value: 8 },
          { stat: 'educationSoshin', value: 6 }
        ],
        hiddenFlags: ['work_boundary', 'family_first'],
        resultText:
          '교장 선생님은 아쉬워했지만 "솔직해서 좋네요"라고 했습니다. 거절할 수 있다는 것도 능력입니다.'
      },
      {
        id: 'choice_extra_principal_3',
        text: '"동학년 공동 발표라면 하겠습니다"라고 조건을 제안한다.',
        intent: '협업 조건 협상',
        successRate: 65,
        immediateEffects: [
          { stat: 'colleagueSolidarity', value: 12 },
          { stat: 'careerPoint', value: 8 },
          { stat: 'reputation', value: 8 },
          { stat: 'adminTrust', value: 6 },
          { stat: 'burnout', value: 5 }
        ],
        hiddenFlags: ['collaboration', 'leadership'],
        successResultText:
          '동학년 세 명이 함께 준비했습니다. 부담은 3분의 1이 되었고, 발표는 오히려 더 풍성해졌습니다.',
        failEffects: [
          { stat: 'adminTrust', value: -6 },
          { stat: 'colleagueRelation', value: -8 },
          { stat: 'mental', value: -6 }
        ],
        failResultText:
          '동학년 선생님들이 모두 손사래를 쳤습니다. 결국 제안은 없던 일이 되었고, 교장 선생님의 표정이 미묘해졌습니다.'
      }
    ]
  },

  // ==================== 4. 학부모 ====================
  {
    id: 'evt_extra_parent_group_chat',
    dayRange: [9, 27],
    title: '학부모 단톡방 캡처',
    category: 'parent',
    situation: '교무실',
    narratorText:
      '한 학부모가 조심스럽게 캡처 이미지를 보내왔습니다. 학급 학부모 단톡방에서 담임의 수업 방식과 성격을 두고 험담이 오간 대화입니다. "선생님이 아셔야 할 것 같아서요"라는 말이 덧붙어 있습니다.',
    weight: 110,
    cooldown: 12,
    tags: ['민원', '학부모'],
    valence: 'negative',
    choices: [
      {
        id: 'choice_extra_group_chat_1',
        text: '내용은 못 본 것으로 하되, 다음 주 학급 통신문에 수업 의도를 상세히 설명해 싣는다.',
        intent: '정면 대응 대신 설명 강화',
        immediateEffects: [
          { stat: 'parentTrust', value: 10 },
          { stat: 'parentComplaint', value: -8 },
          { stat: 'expert', value: 5 },
          { stat: 'mental', value: -6 },
          { stat: 'hp', value: -4 }
        ],
        hiddenFlags: ['communication_first'],
        resultText:
          '통신문을 읽은 학부모 몇 분이 따로 감사 메시지를 보내왔습니다. 오해는 대체로 설명 부족에서 옵니다.'
      },
      {
        id: 'choice_extra_group_chat_2',
        text: '상담 주간을 앞당겨 개별 면담으로 오해를 하나씩 푼다.',
        intent: '개별 접촉',
        immediateEffects: [
          { stat: 'parentTrust', value: 14 },
          { stat: 'parentComplaint', value: -12 },
          { stat: 'hp', value: -12 },
          { stat: 'burnout', value: 10 },
          { stat: 'familySatisfaction', value: -6 }
        ],
        hiddenFlags: ['self_sacrifice'],
        resultText:
          '일주일 내내 저녁 상담이 이어졌습니다. 단톡방의 온도는 확실히 내려갔지만, 몸이 남아나지 않습니다.'
      },
      {
        id: 'choice_extra_group_chat_3',
        text: '캡처를 근거로 교권보호위원회 상담을 신청한다.',
        intent: '제도적 대응',
        successRate: 45,
        immediateEffects: [
          { stat: 'educationSoshin', value: 12 },
          { stat: 'colleagueSolidarity', value: 10 },
          { stat: 'parentComplaint', value: -10 }
        ],
        successResultText:
          '학교가 공식적으로 개입하자 단톡방의 언급은 즉시 멈췄습니다. 혼자 감당할 일이 아니었습니다.',
        failEffects: [
          { stat: 'parentComplaint', value: 20 },
          { stat: 'parentTrust', value: -12 },
          { stat: 'mental', value: -12 }
        ],
        failResultText:
          '"사적 대화를 문제 삼는다"는 역공이 시작되었습니다. 캡처를 보낸 학부모까지 곤란해졌습니다.'
      }
    ]
  },
  {
    id: 'evt_extra_parent_gift',
    dayRange: [6, 24],
    title: '봉투를 든 학부모',
    category: 'parent',
    situation: '교실',
    narratorText:
      '상담을 마치고 일어서던 학부모가 가방에서 흰 봉투를 꺼내 책상 위에 밀어 놓습니다. "선생님, 우리 아이 잘 부탁드립니다. 정말 작은 성의예요." 복도에는 다음 상담 학부모가 기다리고 있습니다.',
    weight: 100,
    cooldown: 10,
    tags: ['청탁금지법', '학부모'],
    valence: 'neutral',
    choices: [
      {
        id: 'choice_extra_gift_1',
        text: '그 자리에서 봉투를 되돌려주며 청탁금지법 규정을 차분히 설명한다.',
        intent: '원칙 고수',
        immediateEffects: [
          { stat: 'educationSoshin', value: 12 },
          { stat: 'reputation', value: 8 },
          { stat: 'parentTrust', value: 5 },
          { stat: 'mental', value: -4 }
        ],
        hiddenFlags: ['fairness', 'rules_strict'],
        resultText:
          '학부모는 얼굴을 붉히며 봉투를 거뒀습니다. 어색했지만, 나중에 "그때 그러셔서 오히려 믿음이 갔다"는 말을 듣게 됩니다.'
      },
      {
        id: 'choice_extra_gift_2',
        text: '일단 받아 두고, 다음 날 학교 행정실을 통해 공식 반환 처리한다.',
        intent: '체면을 살린 절차 반환',
        immediateEffects: [
          { stat: 'adminPower', value: 8 },
          { stat: 'educationSoshin', value: 6 },
          { stat: 'parentTrust', value: -3 },
          { stat: 'hp', value: -3 }
        ],
        hiddenFlags: ['organism_adapt'],
        resultText:
          '그 자리의 민망함은 피했고 절차도 남겼습니다. 다만 하루 동안 봉투를 가방에 넣고 다니는 기분이 썩 좋지는 않았습니다.'
      }
    ]
  },

  // ==================== 5. 후반부 압박 · 가정 ====================
  {
    id: 'evt_extra_semester_report_crunch',
    dayRange: [24, 30],
    title: '학기말, 세 가지가 동시에',
    category: 'admin',
    situation: '교무실',
    narratorText:
      '같은 날 마감이 셋입니다. 생활기록부 최종 입력, 학년 교육과정 평가 보고서, 그리고 내일 아침 학부모 공개 상담 준비. 시계는 이미 오후 6시를 가리키고, 셋 다 제대로 할 시간은 없습니다.',
    weight: 130,
    cooldown: 6,
    tags: ['학기말', '압박'],
    valence: 'negative',
    choices: [
      {
        id: 'choice_extra_crunch_1',
        text: '생기부에 집중한다. 아이들의 1년이 남는 기록이 우선이다.',
        intent: '기록 우선',
        immediateEffects: [
          { stat: 'expert', value: 10 },
          { stat: 'teachingSatisfaction', value: 10 },
          { stat: 'adminTrust', value: -8 },
          { stat: 'burnout', value: 10 },
          { stat: 'hp', value: -8 }
        ],
        hiddenFlags: ['student_center'],
        resultText:
          '생기부 문장은 어느 해보다 정성스러웠습니다. 대신 평가 보고서는 마감을 넘겼고, 교감 선생님의 독촉 메시지가 세 통 쌓였습니다.'
      },
      {
        id: 'choice_extra_crunch_2',
        text: '보고서를 먼저 끝낸다. 마감이 곧 신뢰다.',
        intent: '행정 우선',
        immediateEffects: [
          { stat: 'adminPower', value: 12 },
          { stat: 'adminTrust', value: 10 },
          { stat: 'teachingSatisfaction', value: -8 },
          { stat: 'burnout', value: 8 },
          { stat: 'hp', value: -6 }
        ],
        hiddenFlags: ['performance_center', 'organism_adapt'],
        resultText:
          '보고서는 정시에 올라갔습니다. 생기부는 결국 복사-붙여넣기로 채웠고, 그 문장을 읽을 아이들 얼굴이 스칩니다.'
      },
      {
        id: 'choice_extra_crunch_3',
        text: '동학년에 솔직히 알리고 보고서 분담을 요청한다.',
        intent: '분담 요청',
        successRate: 60,
        immediateEffects: [
          { stat: 'colleagueSolidarity', value: 10 },
          { stat: 'adminPower', value: 6 },
          { stat: 'expert', value: 6 },
          { stat: 'burnout', value: -5 }
        ],
        hiddenFlags: ['collaboration'],
        successResultText:
          '두 분이 보고서 절반을 가져갔습니다. 셋 다 제시간에 끝났고, 다음엔 내가 갚기로 했습니다.',
        failEffects: [
          { stat: 'colleagueRelation', value: -8 },
          { stat: 'burnout', value: 12 },
          { stat: 'mental', value: -8 }
        ],
        failResultText:
          '"저희도 똑같아요"라는 답이 돌아왔습니다. 다들 각자의 세 가지를 안고 있었습니다. 결국 혼자 밤을 새웠습니다.'
      }
    ]
  },
  {
    id: 'evt_extra_family_dinner',
    dayRange: [10, 29],
    title: '오늘은 꼭 일찍 온다고 했잖아',
    category: 'family',
    situation: '집',
    narratorText:
      '가방을 챙기는데 학부모 상담 요청 전화가 걸려옵니다. 오늘은 가족과 저녁 약속을 한 날입니다. 이미 두 번 미뤘고, 휴대폰에는 "몇 시에 와?"라는 메시지가 와 있습니다.',
    weight: 115,
    cooldown: 8,
    tags: ['가정', '워라밸'],
    valence: 'neutral',
    choices: [
      {
        id: 'choice_extra_family_1',
        text: '전화를 받고 상담을 진행한다. 지금 급한 쪽은 학교다.',
        intent: '업무 우선',
        immediateEffects: [
          { stat: 'parentTrust', value: 10 },
          { stat: 'parentComplaint', value: -8 },
          { stat: 'familySatisfaction', value: -15 },
          { stat: 'mental', value: -8 },
          { stat: 'hp', value: -6 }
        ],
        hiddenFlags: ['self_sacrifice'],
        resultText:
          '상담은 잘 마무리되었습니다. 집에 도착했을 때 식탁 위 음식은 이미 식어 있었고, 아무도 화를 내지 않아서 더 미안했습니다.'
      },
      {
        id: 'choice_extra_family_2',
        text: '"내일 오전에 연락드리겠다"고 정중히 안내하고 퇴근한다.',
        intent: '경계 지키기',
        immediateEffects: [
          { stat: 'familySatisfaction', value: 15 },
          { stat: 'mental', value: 12 },
          { stat: 'hp', value: 8 },
          { stat: 'burnout', value: -8 },
          { stat: 'parentComplaint', value: 6 }
        ],
        hiddenFlags: ['family_first', 'work_boundary'],
        resultText:
          '오랜만에 식탁에 다 같이 앉았습니다. 학부모는 조금 서운했겠지만, 다음 날 오전 통화로 충분히 풀렸습니다.'
      },
      {
        id: 'choice_extra_family_3',
        text: '가는 길에 차 안에서 통화로 처리한다.',
        intent: '동시 처리',
        successRate: 50,
        immediateEffects: [
          { stat: 'parentTrust', value: 6 },
          { stat: 'familySatisfaction', value: 5 },
          { stat: 'burnout', value: 5 }
        ],
        successResultText:
          '요점만 짚어 10분 만에 정리하고 약속 시간에 맞춰 도착했습니다. 오늘은 운이 좋았습니다.',
        failEffects: [
          { stat: 'parentTrust', value: -8 },
          { stat: 'familySatisfaction', value: -10 },
          { stat: 'mental', value: -10 },
          { stat: 'burnout', value: 10 }
        ],
        failResultText:
          '통화는 40분을 넘겼고 약속에는 늦었습니다. 학부모도 가족도 모두 서운해하는, 최악의 절충이 되었습니다.'
      }
    ]
  },
  {
    id: 'evt_extra_burnout_signal',
    dayRange: [18, 30],
    title: '거울 앞에서',
    category: 'family',
    situation: '집',
    narratorText:
      '아침에 거울을 보다 문득 멈춥니다. 언제부터인지 아이들 얼굴이 잘 기억나지 않고, 어제 한 말도 흐릿합니다. 출근 준비를 하는 손이 이유 없이 떨립니다. 몸이 보내는 신호가 분명해지고 있습니다.',
    weight: 120,
    cooldown: 8,
    prerequisites: [],
    tags: ['번아웃', '자기돌봄'],
    valence: 'negative',
    choices: [
      {
        id: 'choice_extra_burnout_1',
        text: '연가를 내고 하루 완전히 쉰다. 병가 사유서도 함께 준비한다.',
        intent: '적극적 회복',
        immediateEffects: [
          { stat: 'hp', value: 20 },
          { stat: 'mental', value: 20 },
          { stat: 'burnout', value: -25 },
          { stat: 'adminTrust', value: -6 },
          { stat: 'teachingSatisfaction', value: -4 }
        ],
        hiddenFlags: ['self_care'],
        resultText:
          '하루를 통째로 비웠습니다. 죄책감이 없지는 않지만, 다음 날 교실 문을 여는 손이 훨씬 가벼웠습니다.'
      },
      {
        id: 'choice_extra_burnout_2',
        text: '동료에게 솔직히 털어놓고 당분간 업무 일부를 나눈다.',
        intent: '도움 요청',
        successRate: 70,
        immediateEffects: [
          { stat: 'burnout', value: -15 },
          { stat: 'mental', value: 12 },
          { stat: 'colleagueSolidarity', value: 12 },
          { stat: 'hp', value: 8 }
        ],
        hiddenFlags: ['collaboration', 'self_care'],
        successResultText:
          '"진작 말하지 그랬어요." 두 분이 각각 업무를 하나씩 가져갔습니다. 말하는 데 필요한 건 용기뿐이었습니다.',
        failEffects: [
          { stat: 'mental', value: -10 },
          { stat: 'colleagueSolidarity', value: -6 },
          { stat: 'burnout', value: 5 }
        ],
        failResultText:
          '모두가 자기 몫으로 버거운 시기였습니다. 위로는 받았지만 짐은 그대로 남았습니다.'
      },
      {
        id: 'choice_extra_burnout_3',
        text: '커피를 한 잔 더 내리고 평소처럼 출근한다.',
        intent: '무시하고 버티기',
        immediateEffects: [
          { stat: 'burnout', value: 12 },
          { stat: 'hp', value: -8 },
          { stat: 'mental', value: -8 },
          { stat: 'adminPower', value: 5 }
        ],
        delayedEffects: [
          {
            dayTrigger: 30,
            effects: [
              { stat: 'hp', value: -12 },
              { stat: 'burnout', value: 12 },
              { stat: 'mental', value: -10 }
            ],
            message: '[지연] 미뤄둔 피로가 한꺼번에 몰려왔습니다. 몸이 더는 버티지 못합니다.'
          }
        ],
        hiddenFlags: ['self_sacrifice'],
        riskText: '지금 신호를 무시하면 며칠 뒤 더 큰 대가를 치릅니다.',
        resultText:
          '오늘도 무사히 넘겼습니다. 무사히 넘긴 날이 몇 번째인지는 이제 세지 않습니다.'
      }
    ]
  },

  // ==================== 6. 히든 탐험 보상 사건 ====================
  {
    id: 'evt_extra_hidden_old_yearbook',
    dayRange: [8, 30],
    title: '창고에서 나온 낡은 졸업앨범',
    category: 'random',
    situation: '체육실 창고',
    location: 'gym_room',
    narratorText:
      '체육실 창고를 정리하다 먼지 쌓인 상자에서 20년 전 졸업앨범을 발견했습니다. 펼쳐보니 지금은 은퇴한 선생님들의 젊은 얼굴과, 아이들이 직접 쓴 손편지가 빼곡히 붙어 있습니다.',
    weight: 80,
    cooldown: 20,
    tags: ['히든탐험', '비밀이벤트'],
    valence: 'positive',
    choices: [
      {
        id: 'choice_extra_yearbook_1',
        text: '한 장 한 장 천천히 읽어본다.',
        intent: '교직의 시간 돌아보기',
        immediateEffects: [
          { stat: 'mental', value: 15 },
          { stat: 'teachingSatisfaction', value: 15 },
          { stat: 'educationSoshin', value: 10 },
          { stat: 'burnout', value: -10 }
        ],
        hiddenFlags: ['teacher_identity'],
        grantsItem: 'class_council_charter',
        resultText:
          '"선생님, 저는 커서 선생님이 될 거예요." 20년 전 아이의 글씨를 손끝으로 따라 읽습니다. 지금 내 교실에도 그런 아이가 앉아 있을지 모릅니다.'
      },
      {
        id: 'choice_extra_yearbook_2',
        text: '교무실로 가져가 선생님들과 함께 펼쳐본다.',
        intent: '함께 나누기',
        immediateEffects: [
          { stat: 'colleagueSolidarity', value: 14 },
          { stat: 'colleagueRelation', value: 10 },
          { stat: 'mental', value: 10 },
          { stat: 'burnout', value: -8 }
        ],
        hiddenFlags: ['collaboration'],
        resultText:
          '오후 내내 교무실에 웃음이 끊이지 않았습니다. "우리 학교에 이런 시절이 있었네요." 오랜만에 다들 교사 이야기를 했습니다.'
      }
    ]
  },
  {
    id: 'evt_extra_hidden_rooftop',
    dayRange: [12, 30],
    title: '아무도 없는 옥상 계단',
    category: 'random',
    situation: '체육관 위층',
    location: 'gymnasium',
    narratorText:
      '점심시간, 인적 없는 체육관 위층 계단참에서 한 아이가 무릎을 안고 앉아 있습니다. 우리 반 아이는 아닙니다. 눈이 마주치자 급히 눈물을 닦고 일어서려 합니다.',
    weight: 85,
    cooldown: 18,
    tags: ['히든탐험', '정서지원'],
    valence: 'neutral',
    choices: [
      {
        id: 'choice_extra_rooftop_1',
        text: '옆에 조용히 앉아 아무것도 묻지 않고 함께 있어준다.',
        intent: '곁에 있어주기',
        immediateEffects: [
          { stat: 'teachingSatisfaction', value: 14 },
          { stat: 'educationSoshin', value: 12 },
          { stat: 'studentTrust', value: 6 },
          { stat: 'mental', value: 6 }
        ],
        hiddenFlags: ['student_center', 'true_mentor_moment'],
        resultText:
          '10분쯤 지나 아이가 먼저 입을 열었습니다. 담임도 아닌 사람에게 털어놓기가 오히려 쉬웠던 모양입니다. 헤어질 때 아이가 꾸벅 인사를 했습니다.'
      },
      {
        id: 'choice_extra_rooftop_2',
        text: '담임 선생님께 상황을 알리고 자리를 비켜준다.',
        intent: '담당자 연계',
        immediateEffects: [
          { stat: 'colleagueSolidarity', value: 8 },
          { stat: 'expert', value: 5 },
          { stat: 'adminPower', value: 3 }
        ],
        hiddenFlags: ['collaboration'],
        resultText:
          '담임 선생님이 고마워하며 곧장 올라갔습니다. 적절한 판단이었지만, 그 아이의 눈빛이 하루 종일 남습니다.'
      }
    ]
  }
];
