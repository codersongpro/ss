import type { GameEvent } from '@/game/types';

// ==================== [NPC 갈등 카테고리 유머 밈 이벤트 6선] ====================
export const funnyConflictEvents: GameEvent[] = [
  {
    id: 'evt_conflict_01',
    dayRange: [1, 30],
    title: '부장 회의 장기화 및 영혼 탈곡 사태',
    category: 'colleague',
    situation: '교무실 회의실',
    narratorText: '퇴근을 딱 15분 앞둔 금요일 오후 4시 15분, 학년 부장님이 다급하게 회의실 문을 열며 교사들을 소집합니다. "다들 가방 놓으시고 회의실로 모이세요! 이번 학교 축제 부스 환경 정리 지침서 기결안에 대해 긴급 재검토가 있겠습니다." 회의가 시작되자 부장님의 옛날 썰과 잔소리가 끝날 기미 없이 30분째 이어지고 있습니다. 어떻게 탈출하시겠습니까?',
    weight: 120,
    tags: ['회의장기화', '퇴근저지', '학년부장님'],
    choices: [
      {
        id: 'choice_conflict_01_1',
        text: '회의록 여백에 볼펜으로 "환경 미화 3대 규칙"을 일목요연하게 정리해 부장님께 불쑥 들이밀며 "이 3안으로 빠르게 결론을 내는 것이 어떨까요?"라며 정리를 유도한다. (expert +15, 멘탈 +5, hp -5)',
        intent: '논리적 회의 속속 종결 유도',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'mental', value: 5 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '부장님은 "오! 역시 김 선생이야. 정리가 아주 깔끔하군!"이라며 흐뭇해하셨고, 그 안을 채택하여 회의를 즉시 끝내주셨습니다. 가까스로 30분 초과 야근으로 막아냈습니다.'
      },
      {
        id: 'choice_conflict_01_2',
        text: '갑자기 스마트폰 시계를 들여다보며 "앗! 오늘 아침 교감 선생님께서 퇴근 직전까지 2학기 예산 보정 기안 검토 회람을 끝내라고 지시하신 게 떠올랐습니다!"라며 관리자 업무 핑계로 탈출한다. (성공률 70%) (멘탈 +15, hp +5, colleagueRelation -10)',
        intent: '교감 업무 핑계 탈출',
        successRate: 70,
        immediateEffects: [
          { stat: 'mental', value: 15 },
          { stat: 'hp', value: 5 },
          { stat: 'colleagueRelation', value: -10 }
        ],
        successResultText: '부장님은 "교감님 지시라면 어쩔 수 없지. 김 선생은 먼저 가보게"라며 보내주셨고, 덕분에 칼퇴근에 골인했습니다. 남겨진 동료 교사들의 원망 어린 따가운 눈빛이 뒤통수에 박혔습니다.',
        failEffects: [
          { stat: 'mental', value: -15 },
          { stat: 'colleagueRelation', value: -15 },
          { stat: 'burnout', value: 20 }
        ],
        failResultText: '부장님이 회의실 유선 전화를 교감실로 즉시 돌리며 확인하려 하십니다! "내가 지금 교감님께 양해 전화를 드릴 테니 마저 회의 듣게." 거짓말이 들통나며 엄청난 망신을 당했고, 회의가 끝난 뒤 축제 쓰레기 분리수거 총괄 당번으로 강제 징발당했습니다.'
      }
    ]
  },
  {
    id: 'evt_conflict_02',
    dayRange: [1, 30],
    title: '동료 교사의 얄미운 급식 지도 꼼수',
    category: 'colleague',
    situation: '급식실 복도',
    narratorText: '이번 주 등교 및 급식 지도 2인 1조 파트너인 옆 반 담임 선생님이, 지도가 시작되는 오전 11시 50분만 되면 "갑자기 배가 아파 화장실에 급히 다녀오겠다"며 매일 사라집니다. 결국 500명이 넘는 전교생의 왁자지껄한 대기 줄 통제와 배식 혼란 지도를 당신 혼자 독박으로 서서 감당하고 있습니다. 오늘도 그는 슬그머니 사라지려 합니다. 어떻게 하시겠습니까?',
    weight: 110,
    tags: ['급식지도', '얄미운동료', '업무태만'],
    choices: [
      {
        id: 'choice_conflict_02_1',
        text: '조용히 다가가 그의 소매를 꽉 잡고 "선생님, 위장 장애가 심해 보이시니 오늘 지도는 제가 부장님께 대강 보강을 공식 접수하고, 선생님은 정식 병가를 내고 조기 퇴근하시죠!"라며 단호하게 압박한다. (expert +12, colleagueRelation -15, 멘탈 +10)',
        intent: '병가 권유식 압박 방어',
        immediateEffects: [
          { stat: 'expert', value: 12 },
          { stat: 'colleagueRelation', value: -15 },
          { stat: 'mental', value: 10 }
        ],
        resultText: '상대 교사는 흠칫 놀라며 얼굴이 붉어졌고, "아... 아니네! 갑자기 속이 좀 편안해진 것 같아"라며 꼬리를 내리고 빗자루를 쥐고 지도 대열에 합류했습니다. 정당한 권리를 지켜냈습니다.'
      },
      {
        id: 'choice_conflict_02_2',
        text: '그의 근무 태만 일지를 일주일간 꼼꼼히 기록하여, 다음 주 학년 교육과정 협의회 때 학년 부장님께 공식 건의하여 지도의 공정 배정을 강력 청구한다. (adminTrust +12, colleagueRelation -20, mental +5)',
        intent: '기록 기반 공식 행정 건의',
        immediateEffects: [
          { stat: 'adminTrust', value: 12 },
          { stat: 'colleagueRelation', value: -20 },
          { stat: 'mental', value: 5 }
        ],
        resultText: '부장님의 엄격한 경고와 조율 지시가 떨어져 당직 시간표가 칼같이 개편되었습니다. 다만 상대 교사는 당신을 \'피도 눈물도 없는 신고자\'라며 교무실 파티션 뒤에서 수군거리기 시작했습니다.'
      }
    ]
  },
  {
    id: 'evt_conflict_03',
    dayRange: [1, 30],
    title: '교장 선생님의 휴일 사적 동원 챌린지',
    category: 'admin',
    situation: '교장실',
    narratorText: '금요일 오후, 교장 선생님이 교장실로 당신을 은밀히 부르십니다. "김 선생! 이번 주 토요일에 우리 학교 화단 조경용 자연석 채취를 위해 내 고향 안동 앞산으로 가벼운 친목 드라이브를 갈까 하는데... 강제는 아니고, 맑은 공기 마시며 힐링하는 소풍일세. 자네 SUV 차량 뒷자리가 마침 넓지 않던가?" 주말 사적 동원의 그림자가 드리웁니다.',
    weight: 120,
    tags: ['교장선생님', '주말동원', '사적지시'],
    choices: [
      {
        id: 'choice_conflict_03_1',
        text: '주말 일정을 전격 취소하고 "교장 선생님과 고향의 맑은 흙 내음을 맡으며 대지의 조경 철학을 전수받겠습니다!"라며 기꺼이 SUV 열쇠를 헌납한다. (adminTrust +25, hp -25, burnout +20, colleagueRelation +5)',
        intent: '충성심 가득 주말 봉사',
        immediateEffects: [
          { stat: 'adminTrust', value: 25 },
          { stat: 'hp', value: -25 },
          { stat: 'burnout', value: 20 },
          { stat: 'colleagueRelation', value: 5 }
        ],
        resultText: '토요일 내내 안동 앞산에서 대왕 바위와 자갈 50포대를 차 뒷자리에 싣고 나르느라 허리가 나갈 뻔했습니다. 차 쇼크 업쇼버가 주저앉았으나, 월요일 아침 교장실로부터 1등급 자연산 참깨 세트가 포상으로 내려왔습니다.'
      },
      {
        id: 'choice_conflict_03_2',
        text: '"정말 가고 싶지만, 토요일에 장모님(혹은 부모님) 칠순 잔치 가족 모임이 안동 반대편인 여수에서 있어 불참이 불가피합니다"라며 가족 핑계로 정중히 거절한다. (성공률 60%) (멘탈 +15, hp +10, adminTrust -15)',
        intent: '가족 대소사 핑계 회피',
        successRate: 60,
        immediateEffects: [
          { stat: 'mental', value: 15 },
          { stat: 'hp', value: 10 },
          { stat: 'adminTrust', value: -15 }
        ],
        successResultText: '교장 선생님은 혀를 슬쩍 차시며 "허허, 효심이 깊군. 가족 모임이 먼저지!"라며 물러나 주셨고, 무사히 개인 주말의 달콤한 늦잠을 사수했습니다.',
        failEffects: [
          { stat: 'mental', value: -15 },
          { stat: 'adminTrust', value: -25 },
          { stat: 'burnout', value: 15 }
        ],
        failResultText: '교장 선생님이 눈을 부릅뜨십니다. "여수? 마침 내 고향 안동에서 올리고당 채취 작업을 끝내고 여수로 넘어가면 딱이네! 내 차로 같이 안동 찍고 여수 잔치 잔치국수 먹으러 가세!" 결국 거절도 못 하고 교장과 1박 2일 전국 일주 조경 노동 드라이브를 돌게 되었습니다.'
      }
    ]
  },
  {
    id: 'evt_conflict_04',
    dayRange: [1, 30],
    title: '교감 선생님의 현미경식 결재 반려 굴레',
    category: 'admin',
    situation: '교무실 교감석 앞',
    narratorText: '어렵게 밤새워 작성한 2학기 학교 현장체험학습 계획 기안문을 들고 결재를 받으러 갔습니다. 교감 선생님은 기안문의 빨간 펜 돋보기를 들여다보듯 훑어보시더니 반려 단추를 누르십니다. "김 선생, 여기 14페이지 하단 첨부 문서의 가로 격자 선 굵기가 0.12mm가 아니라 0.15mm로 굵게 셋팅되었군. 규정 양식 어긋남일세. 다시 작성해 오게." 벌써 4번째 반려입니다. 어떻게 대처하시겠습니까?',
    weight: 115,
    tags: ['교감선생님', '품의반려', '현미경결재'],
    choices: [
      {
        id: 'choice_conflict_04_1',
        text: '자리로 돌아와 한글 프로그램 한계선 셋팅 수치를 0.1200mm 소수점 4자리까지 칼같이 수정하고, 행정실 공문서 서식 표준 매뉴얼 표지를 보기 좋게 첨부하여 완벽하게 재기안한다. (expert +18, mental -10, hp -5)',
        intent: '완벽주의 행정 정석 돌파',
        immediateEffects: [
          { stat: 'expert', value: 18 },
          { stat: 'mental', value: -10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '교감 선생님은 재상신된 기안문을 보고 돋보기를 내리시더니 "흠, 역시 김 선생의 행정 솜씨는 빈틈이 없구만"이라며 흐뭇하게 승인 단추를 꾹 눌러주셨습니다. 마침내 기안 지옥에서 해방되었습니다.'
      },
      {
        id: 'choice_conflict_04_2',
        text: '뜨끈한 원두커피 한 잔을 타서 교감 선생님 책상 위에 다정하게 내려놓으며 "교감 선생님의 예리한 안목 덕에 공문서의 품격이 살아납니다! 제 눈이 미숙했으니 한 번만 눈감아 기결해 주십시오"라고 넉살을 떤다. (colleagueRelation +15, 멘탈 +10, hp -2)',
        intent: '커피와 넉살 아부 딜',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 15 },
          { stat: 'mental', value: 10 },
          { stat: 'hp', value: -2 }
        ],
        resultText: '교감 선생님은 껄껄 웃으시며 커피를 한 모금 들이켜시더니 "허허 김 선생 참 넉살도 좋군. 다음부턴 칼같이 맞추게나"라며 마우스 클릭 한 번으로 통과시켜 주셨습니다. 훈훈하게 폭탄을 해체했습니다.'
      }
    ]
  },
  {
    id: 'evt_conflict_05',
    dayRange: [1, 30],
    title: '수업 시간 대놓고 취침하는 반항 학생',
    category: 'student',
    situation: '교실',
    narratorText: '중요한 수학 곱셈 단원 수업 시간, 맨 앞자리의 지훈이가 책상을 넓게 차지하고 대놓고 엎드려 단잠을 자고 있습니다. 다가가 어깨를 살며시 두드리며 "지훈아, 일어나서 책 봐야지"라고 하자, 지훈이는 짜증 가득한 눈으로 쳐다보며 "아 진짜, 피곤해 죽겠는데 왜 자꾸 귀찮게 깨워요!"라고 소리를 지르며 필통을 바닥으로 쾅 집어던졌습니다. 반 아이들이 숨을 죽입니다.',
    weight: 120,
    tags: ['수업반항', '교권침해', '생활지도'],
    choices: [
      {
        id: 'choice_conflict_05_1',
        text: '감정을 억누르고 차분하고 단호한 목소리로 "교실은 모두가 함께 공부하는 공간이며, 물건을 던지거나 소리를 지르는 것은 수업 질서를 해치는 행동이다. 필통을 주워 책상에 올리고 복도에서 마음을 가라앉히고 오너라"고 대처한다. (expert +15, mental -10, studentTrust +15)',
        intent: '차분하고 엄격한 복도 격리 지도',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'mental', value: -10 },
          { stat: 'studentTrust', value: 15 }
        ],
        resultText: '지훈이는 씩씩거리며 필통을 주워 복도로 나갔습니다. 수업은 즉각 정상 궤도를 찾았고, 교사의 흔들림 없는 단호한 대인배 대처에 반 아이들이 신뢰의 눈빛을 보냅니다.'
      },
      {
        id: 'choice_conflict_05_2',
        text: '사태의 심각성을 감안하여 즉각 학생부장 선생님과 교감 선생님께 긴급 무선 지원을 청구해 지훈이를 학년실로 인계 수송하고 교권 보호 절차를 논의한다. (adminTrust +10, studentTrust -15, mental -15)',
        intent: '공식 제도 및 관리자 이송',
        immediateEffects: [
          { stat: 'adminTrust', value: 10 },
          { stat: 'studentTrust', value: -15 },
          { stat: 'mental', value: -15 }
        ],
        resultText: '학생부장님이 신속하게 와서 지훈이를 학년실로 데리고 가 격리 훈육을 집행했습니다. 교실 기강은 확실하게 수호했으나, 지훈이와는 마음의 문을 완전히 걸어 잠근 차가운 벽이 생겼습니다.'
      }
    ]
  },
  {
    id: 'evt_conflict_06',
    dayRange: [1, 30],
    title: '모둠 과제 중 발생한 극단적 편가르기 갈등',
    category: 'student',
    situation: '교실',
    narratorText: '사회 시간 모둠 과제 발표를 준비하던 중, 서연이가 울먹이며 교탁 앞으로 다가옵니다. "선생님... 준서랑 민준이가 저 공부 못한다고 자기 모둠에서 자료 조사도 안 시켜주고 투명 인간 취급해요." 준서 무리에게 가보니 "선생님, 서연이는 참여도 안 하고 무임승차만 하려 하잖아요!"라며 팽팽하게 대립합니다. 어떻게 조율하시겠습니까?',
    weight: 110,
    tags: ['모둠갈등', '편가르기', '은따방지'],
    choices: [
      {
        id: 'choice_conflict_06_1',
        text: '모둠을 전격 일시 정지시키고, 각 역할(타이핑, 자료 서치, 발표 보조)을 교사가 직접 서면 분장표로 공평하게 나누어 서명하게 한 뒤, 수행 성실도를 1:1로 체크하는 개별 모둠제를 도입한다. (studentTrust +20, expert +10, hp -10)',
        intent: '역할 분장표 강제 세분화',
        immediateEffects: [
          { stat: 'studentTrust', value: 20 },
          { stat: 'expert', value: 10 },
          { stat: 'hp', value: -10 }
        ],
        resultText: '세분화된 분장표 덕에 서연이도 자신의 몫(파워포인트 디자인 선택)을 훌륭히 해냈고, 준서와 민준이도 무임승차 시비를 거두었습니다. 담임의 깐깐한 조율 능력이 빛을 발했습니다.'
      },
      {
        id: 'choice_conflict_06_2',
        text: '방과 후에 세 학생을 상담실에 모이게 하고 서로의 속상한 감정을 이야기하게 돕는 회복적 생활지도(화해 중재 1시간)를 집행한다. (studentTrust +20, hp -15, mental -10)',
        intent: '회복적 화해 중재 모임',
        immediateEffects: [
          { stat: 'studentTrust', value: 20 },
          { stat: 'hp', value: -15 },
          { stat: 'mental', value: -10 }
        ],
        resultText: '기나긴 감정 조율 과정 끝에 준서는 서연이에게 배척했던 감정을 사과했고, 서연이도 자료 조사에 좀 더 책임감 있게 참여하겠다고 약속했습니다. 눈물을 흘리며 악수하는 훈훈한 성장이 이뤄졌습니다.'
      }
    ]
  }
];
