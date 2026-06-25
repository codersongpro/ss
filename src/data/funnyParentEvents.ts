import type { GameEvent } from '@/game/types';

// ==================== [학부모 카테고리 유머 밈 이벤트 30선] ====================
export const funnyParentEvents: GameEvent[] = [
  {
    id: 'evt_funny_parent_01',
    dayRange: [1, 30],
    title: '이모티콘 답장 엄격 검열 사건',
    category: 'parent',
    situation: '교무실',
    narratorText: '어제 퇴근 직전 한 어머님께서 보내신 "우리가 주말에 가족 여행을 가는데 아이 과제는 어떻게 할까요?"라는 장문의 문자에, 정신이 없어 "👍" 따봉 이모티콘 하나만 답장으로 보냈습니다. 오늘 아침, 그 학부모님으로부터 "선생님의 무성의한 따봉 하나에 밤새 잠을 설쳤습니다"라는 장문의 항의 쪽지가 도착했습니다. 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['학부모문자', '따봉테러', '이모티콘소동'],
    choices: [
      {
        id: 'choice_funny_parent_01_1',
        text: '정중하고 상세하게 해명 문자를 작성해 보내고 앞으론 텍스트 위주로 정성껏 쓰겠다고 다짐한다. (parentTrust +10, hp -5, burnout +5)',
        intent: '공식적 해명 및 사과',
        immediateEffects: [
          { stat: 'parentTrust', value: 10 },
          { stat: 'hp', value: -5 },
          { stat: 'burnout', value: 5 }
        ],
        resultText: '학부모님은 "선생님이 바쁘셨나 보네요"라며 오해를 풀었습니다. 하지만 텍스트 한 자 한 자를 고민하느라 눈이 침침해졌습니다.'
      },
      {
        id: 'choice_funny_parent_01_2',
        text: '전화로 목소리를 톤 업하여 "아이의 훌륭한 과제 의지를 격하게 칭찬하고자 보낸 감탄의 엄지척이었습니다!"라고 넉살 좋게 넘긴다. (parentTrust +15, 멘탈 +10, parentComplaint -10)',
        intent: '유머러스한 넉살 돌파',
        immediateEffects: [
          { stat: 'parentTrust', value: 15 },
          { stat: 'mental', value: 10 },
          { stat: 'parentComplaint', value: -10 }
        ],
        resultText: '학부모님은 쾌활한 해명에 빵 터지시며 "선생님의 큰 뜻을 몰라봤다"며 아주 흡족하게 통화를 마쳤습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_parent_02',
    dayRange: [1, 30],
    title: '전생에 왕세자였던 우리 아이',
    category: 'parent',
    situation: '교무실 상담석',
    narratorText: '학부모 한 분이 비장한 얼굴로 면담을 신청하셨습니다. 그리곤 귓속말로 소곤거리십니다. "선생님, 사실 용한 무당에게 타로를 봤는데 저희 지우가 전생에 조선의 왕세자였다고 하네요. 그래서 교실에서 기를 죽이면 안 되고, 가끔 반말을 하더라도 넓은 아량으로 보필(?)해 주셔야 우주의 기운이 살아서 나라를 구합니다." 어떻게 대답하시겠습니까?',
    weight: 100,
    tags: ['상담소동', '전생체험', '왕세자설'],
    choices: [
      {
        id: 'choice_funny_parent_02_1',
        text: '학교는 민주주의 공화국이며, 왕세자라 할지라도 헌법과 학교 규칙은 동일하게 적용된다고 단호하게 훈육 지침을 안내한다. (expert +15, classManagement +10, parentTrust -5)',
        intent: '공화국 원칙 고수',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'classManagement', value: 10 },
          { stat: 'parentTrust', value: -5 }
        ],
        resultText: '학부모님은 헌법 언급에 당황하셨으나, 학교 내에서는 규칙을 준수시키겠다고 약속했습니다. 교사의 카리스마가 부각되었습니다.'
      },
      {
        id: 'choice_funny_parent_02_2',
        text: '"과연 눈빛이 남다르더군요! 하지만 훌륭한 군주가 되기 위해선 서당에서 혹독한 민초의 삶과 공정함을 먼저 배워야 합니다"라며 맞장구를 쳐준다. (parentTrust +15, 멘탈 +15, studentTrust +10)',
        intent: '학부모 눈높이 퓨전 상담',
        immediateEffects: [
          { stat: 'parentTrust', value: 15 },
          { stat: 'mental', value: 15 },
          { stat: 'studentTrust', value: 10 }
        ],
        resultText: '학부모님은 무릎을 탁 치며 "역시 훌륭한 은사님!"이라며 감탄하셨고, 지우는 학교에서 가장 모범적인 서민(?)의 모습으로 헌신하기 시작했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_parent_03',
    dayRange: [1, 30],
    title: '학부모 단톡방 오폭 대참사',
    category: 'parent',
    situation: '퇴근길 지하철',
    narratorText: '퇴근하는 지하철 안, 스마트폰이 불이 납니다. 학부모 공식 알림방에 한 어머님께서 실수로 "아니 시어머니 또 오신대 진짜 숨 막혀 죽겠음 ㅠㅠ 단톡방 어머님들 시댁 올 때 핑계 대는 꿀팁 공유 좀"이라는 폭탄 카톡을 오폭하셨습니다. 5초 뒤 메시지가 급히 삭제되었으나 이미 모두가 목격한 상태입니다. 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['단톡방오폭', '시월드대폭발', '익명보장'],
    choices: [
      {
        id: 'choice_funny_parent_03_1',
        text: '모르는 척 철저히 침묵을 유지하며 해당 학부모님이 머쓱하지 않도록 다른 공지사항을 올려 화제를 전환한다. (parentTrust +12, 멘탈 +10, expert +5)',
        intent: '철저한 눈감아주기',
        immediateEffects: [
          { stat: 'parentTrust', value: 12 },
          { stat: 'mental', value: 10 },
          { stat: 'expert', value: 5 }
        ],
        resultText: '해당 학부모님은 개인 메시지로 "선생님 살려주셔서 감사합니다"라며 평생의 충성을 서약해 오셨습니다.'
      },
      {
        id: 'choice_funny_parent_03_2',
        text: '학부모님께 개인 톡으로 "가끔 환기가 필요할 때 매실차 한잔 타 드시며 힘내라"고 따뜻한 위로 쪽지를 살짝 보낸다. (parentTrust +15, 멘탈 +12, hp +5)',
        intent: '인간미 있는 개인 소통',
        immediateEffects: [
          { stat: 'parentTrust', value: 15 },
          { stat: 'mental', value: 12 },
          { stat: 'hp', value: 5 }
        ],
        resultText: '선생님의 속 깊은 동감과 배려에 감동하신 어머님은 든든한 학급 지원자로 변모하셨습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_parent_04',
    dayRange: [1, 30],
    title: '숟가락 왼손 파지법 영재론',
    category: 'parent',
    situation: '교무실',
    narratorText: '급식 지도를 마쳤는데, 민석이 어머님께서 전화를 걸어오셨습니다. "선생님, 민석이가 오늘 집에서 숟가락을 왼손으로 쥐고 국을 떴어요! 이거 왼손잡이 뇌가 자극되어 창의성과 우뇌가 초발달하는 영재의 신호 아닌가요? 학교 영재 학급이나 특별 심화 지도를 즉각 가동해 주세요!" 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['학부모상담', '왼손잡이영재', '숟가락의기적'],
    choices: [
      {
        id: 'choice_funny_parent_04_1',
        text: '정식 영재 판정 기준과 학교 교육과정을 상세히 설명하며 객관적 관찰의 필요성을 알린다. (expert +12, parentTrust +5)',
        intent: '학술적/객관적 해명',
        immediateEffects: [
          { stat: 'expert', value: 12 },
          { stat: 'parentTrust', value: 5 }
        ],
        resultText: '학부모님은 차분한 학술적 피드백에 수긍하시며, 일단 집에서 왼손 글씨 연습을 가볍게 시켜보겠다고 하셨습니다.'
      },
      {
        id: 'choice_funny_parent_04_2',
        text: '"민석이가 손재주와 응용력이 뛰어나긴 하죠! 교실에서도 양손 다목적 그리기 놀이로 두뇌를 자극해보겠습니다"라며 기분 좋게 응대한다. (parentTrust +15, studentTrust +10, 멘탈 +10)',
        intent: '기분 좋은 수용과 대안',
        immediateEffects: [
          { stat: 'parentTrust', value: 15 },
          { stat: 'studentTrust', value: 10 },
          { stat: 'mental', value: 10 }
        ],
        resultText: '민석이는 교실에서 자유롭게 그림을 그리며 즐거워했고, 학부모님은 선생님의 영재 맞춤형 케어(?)에 큰 신뢰를 보내왔습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_parent_05',
    dayRange: [1, 30],
    title: '급식 오이 알레르기 전수조사',
    category: 'parent',
    situation: '교무실',
    narratorText: '내일 급식 메뉴에 짜장면과 오이채가 예정되어 있습니다. 한 어머님께서 심각하게 민원을 넣으셨습니다. "우리 예찬이가 오이 알레르기가 있는데 오이를 보기만 해도 심리적으로 가려움증을 느낍니다. 오이 알레르기 가짜인지 진짜인지 논란이 많지만 예찬이를 위해 급식 오이채 전수조사를 하거나 급식실 전체 오이 배급을 금지해 주세요!" 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['오이민원', '급식조율', '알레르기'],
    choices: [
      {
        id: 'choice_funny_parent_05_1',
        text: '영양 교사님과 조율하여 예찬이 식판에만 오이를 제외하고 배식하도록 급식실에 명확한 수급 지침을 올린다. (expert +10, hp -5, colleagueRelation +5)',
        intent: '공식 행정적 차단',
        immediateEffects: [
          { stat: 'expert', value: 10 },
          { stat: 'hp', value: -5 },
          { stat: 'colleagueRelation', value: 5 }
        ],
        resultText: '급식실 이모님들이 수고해 주셔서 오이를 완벽히 격리 배식했습니다. 안전 사고 없이 식사를 마쳤습니다.'
      },
      {
        id: 'choice_funny_parent_05_2',
        text: '학부모님께 의학적 소견서나 진단서 제출 규정을 넌지시 설명하고 절차대로 유도한다. (classManagement +12, parentComplaint -10)',
        intent: '절차 지향 해결',
        immediateEffects: [
          { stat: 'classManagement', value: 12 },
          { stat: 'parentComplaint', value: -10 }
        ],
        resultText: '학부모님은 사실 의사 진단서는 없고 단순 편식 성향이라고 이실직고하셨고, 오이를 골라내고 먹는 지도로 타협했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_parent_06',
    dayRange: [1, 30],
    title: '숙제 대신 해준 아빠의 상장 오열',
    category: 'parent',
    situation: '교무실 전화기',
    narratorText: '가족 신문 만들기 과제에서 정우가 은상을 받았습니다. 그런데 오늘 밤 정우 아버님께서 거나하게 한잔하시고 전화를 걸어오셨습니다. "선생님... 솔직히 그 신문 제가 어젯밤 새벽 3시까지 코팅지 붙여서 만든 제 영혼의 역작입니다. 제가 미대 출신인데 어떻게 이게 금상이 아니라 은상입니까? 채점 기준표를 공개해 주십시오!" 어떻게 위로해 드리겠습니까?',
    weight: 100,
    tags: ['아빠의숙제', '대리창작', '미대출신아빠'],
    choices: [
      {
        id: 'choice_funny_parent_06_1',
        text: '원칙적으로 학생이 스스로 만든 과제에만 높은 점수를 주며 대리 제작은 채점 감점 요인임을 정중히 지적한다. (classManagement +15, expert +10, parentTrust -5)',
        intent: '원칙 고수 및 훈계',
        immediateEffects: [
          { stat: 'classManagement', value: 15 },
          { stat: 'expert', value: 10 },
          { stat: 'parentTrust', value: -5 }
        ],
        resultText: '아버님은 허를 찔려 머쓱해하며 전화를 끊으셨고, 정우는 앞으로 숙제는 스스로 하겠다고 결심했습니다.'
      },
      {
        id: 'choice_funny_parent_06_2',
        text: '"아버님의 뛰어난 예술 감각에 감탄했습니다! 은상도 대단한 쾌거이며 정우가 아빠를 엄청 자랑스러워했습니다"라고 감성적으로 치하한다. (parentTrust +15, 멘탈 +12, hp -5)',
        intent: '정서적 공감 및 아부(? )',
        immediateEffects: [
          { stat: 'parentTrust', value: 15 },
          { stat: 'mental', value: 12 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '아버님은 울컥하시며 "선생님이 제 예술성을 알아봐 주시네요!"라며 감격하셨고, 다음 학급 환경 미화 작업에 페인트 도구를 들고 자원봉사를 오시기로 약속했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_parent_07',
    dayRange: [1, 30],
    title: '교실 개인 CCTV 설치 요청 건의',
    category: 'parent',
    situation: '교무실',
    narratorText: '헬리콥터 맘으로 유명한 윤아 어머님께서 신박한 요청서를 보냈습니다. "우리 윤아가 교실 사물함 정리가 잘 안 된다는데, 제가 집에서 폰 앱으로 실시간 지도하고 싶어요. 사물함 위에 제 개인 미니 홈캠 웹캠을 설치할 수 있게 허용해 주세요. 담임 선생님은 신경 안 쓰셔도 됩니다!" 어떻게 대응하시겠습니까?',
    weight: 100,
    tags: ['홈캠설치', '개인정보보호', '헬리콥터맘'],
    choices: [
      {
        id: 'choice_funny_parent_07_1',
        text: '개인정보 보호법 및 다른 학생들의 사생활 침해 규정을 들어 법적 불허 기준을 정중하고 단호히 고지한다. (expert +15, classManagement +12, parentComplaint -10)',
        intent: '법령 기준 단호 대처',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'classManagement', value: 12 },
          { stat: 'parentComplaint', value: -10 }
        ],
        resultText: '법적 침해 문제가 부각되자 어머님은 꼬리를 내리셨습니다. 교실 내 학생 사생활 안전지대를 굳건히 수호했습니다.'
      },
      {
        id: 'choice_funny_parent_07_2',
        text: '매주 금요일에 사물함 사진을 찍어 학급 밴드에 올리는 타협안을 제시하며 어머님의 불안을 다독인다. (parentTrust +12, hp -10, burnout +8)',
        intent: '불안 해소형 대안 타협',
        immediateEffects: [
          { stat: 'parentTrust', value: 12 },
          { stat: 'hp', value: -10 },
          { stat: 'burnout', value: 8 }
        ],
        resultText: '어머님은 사진 전송 대안에 만족하셨습니다. 매주 사진을 찍어 전송하는 행정 업무가 하나 추가되어 조금 번거롭습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_parent_08',
    dayRange: [1, 30],
    title: '운명 공동체 사주 상극 민원',
    category: 'parent',
    situation: '교무실',
    narratorText: '한 어머님께서 얼굴을 붉히며 메신저를 보내셨습니다. "선생님, 제가 용한 철학관에 가서 담임 선생님 사주와 우리 지용이 사주를 넣었더니 상극 중의 상극이래요! 올해 지용이가 선생님을 만나면 공부운이 다 막히고 사고가 난다는데, 반을 바꾸거나 옆 반 선생님과 맞교환을 해주실 수 있나요?" 황당한 사주 민원입니다. 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['철학관민원', '사주상극', '반이동요청'],
    choices: [
      {
        id: 'choice_funny_parent_08_1',
        text: '공교육 시스템의 원칙과 학급 배정은 사주 등 종교적 이유로 변경이 절대 불가능함을 공식 공문 기준에 따라 설명한다. (expert +12, classManagement +12, parentComplaint -5)',
        intent: '원칙 및 시스템 안내',
        immediateEffects: [
          { stat: 'expert', value: 12 },
          { stat: 'classManagement', value: 12 },
          { stat: 'parentComplaint', value: -5 }
        ],
        resultText: '학부모님은 머쓱해하며 어쩔 수 없이 수긍하셨습니다. 철저히 시스템에 근거해 오차 없이 처리했습니다.'
      },
      {
        id: 'choice_funny_parent_08_2',
        text: '"사실 저도 제 사주에 올해 지용이 같은 복덩이 귀인을 만나 크게 성공한다고 들었습니다! 지용이가 바로 제 인생의 보물입니다"라고 긍정적 사주 프레임으로 대처한다. (parentTrust +15, 멘탈 +15, studentTrust +10)',
        intent: '재치 있는 긍정 프레임 전환',
        immediateEffects: [
          { stat: 'parentTrust', value: 15 },
          { stat: 'mental', value: 15 },
          { stat: 'studentTrust', value: 10 }
        ],
        resultText: '학부모님은 귀인이라는 말에 안심하시며 "철학관이 엉터리였다"며 지용이의 수업을 전폭적으로 응원해 주기 시작하셨습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_parent_09',
    dayRange: [1, 30],
    title: '한자 획수 불길 출석 번호 민원',
    category: 'parent',
    situation: '교무실',
    narratorText: '출석 번호 4번인 동우의 아버님께서 연락을 주셨습니다. "선생님, 동우 한자 이름 획수와 출석 번호 4번이 겹치면 동우가 올해 낙상 수가 든다고 합니다. 동우 번호를 7번이나 행운의 번호로 변경해 주시면 안 됩니까? 교육청에 물어보니 담임 권한이라던데요!" 어떻게 답하시겠습니까?',
    weight: 100,
    tags: ['출석번호', '한자획수', '낙상수방지'],
    choices: [
      {
        id: 'choice_funny_parent_09_1',
        text: '출석 번호는 성씨 가나다순 공식 원칙에 따라 지정되며 개별 변경은 불가능함을 정중히 설득한다. (classManagement +12, expert +10)',
        intent: '가나다순 원칙 설득',
        immediateEffects: [
          { stat: 'classManagement', value: 12 },
          { stat: 'expert', value: 10 }
        ],
        resultText: '동우 아버님은 아쉬워하셨으나 공식 룰에 납득하시고, 동우가 다치지 않게 교실 조심 지도를 당부하셨습니다.'
      },
      {
        id: 'choice_funny_parent_09_2',
        text: '"동우의 안전을 위해 교실 자리에 푹신한 매트를 깔아주고, 4번은 행운의 사(四)잎 클로버의 번호라고 동우에게 설명해 격려해 주겠다"고 한다. (parentTrust +15, studentTrust +12, 멘탈 +10)',
        intent: '유연하고 긍정적인 대응',
        immediateEffects: [
          { stat: 'parentTrust', value: 15 },
          { stat: 'studentTrust', value: 12 },
          { stat: 'mental', value: 10 }
        ],
        resultText: '아버님은 긍정적인 해명과 교실 배려에 흡족해하시며 민원을 취하하셨고 동우도 4번을 좋아하게 되었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_parent_10',
    dayRange: [1, 30],
    title: '보건실 감기약 음모론 양파 요법',
    category: 'parent',
    situation: '교무실 상담실',
    narratorText: '보건실에서 감기약을 받아먹은 지환이의 어머님께서 전화를 걸어 "선생님, 양약은 다 제약회사의 돈벌이 음모이며 아이들 자연치유력을 갉아먹습니다. 앞으로 지환이가 감기 기운을 보이면 교탁 밑이나 아이 사물함 뒤에 생양파를 반으로 쪼개 얹어놓아 천연 살균이 되게 조치해 주세요"라고 꿋꿋하게 건의하셨습니다. 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['보건지도', '자연치유', '교실생양파'],
    choices: [
      {
        id: 'choice_funny_parent_10_1',
        text: '교실 위생과 냄새 문제로 생양파 배치는 곤란하며, 보건실 처방은 공식 매뉴얼에 따른 것임을 분명히 밝힌다. (classManagement +12, colleagueRelation +5)',
        intent: '교내 위생 우선 및 정중 거절',
        immediateEffects: [
          { stat: 'classManagement', value: 12 },
          { stat: 'colleagueRelation', value: 5 }
        ],
        resultText: '어머님은 교실 냄새 우려에 수긍하시며, 양파 대신 허브 사탕을 주머니에 넣어 등교시키는 방향으로 선회하셨습니다.'
      },
      {
        id: 'choice_funny_parent_10_2',
        text: '어머님의 우려를 존중하되, 감기 시 보건실로 보내기 전 부모님께 무조건 먼저 전화를 걸어 약 수급 여부를 사전 승인받는 폰 알림 규칙을 만든다. (parentTrust +15, 멘탈 +10, hp -5)',
        intent: '사전 전화 확인 대책 수립',
        immediateEffects: [
          { stat: 'parentTrust', value: 15 },
          { stat: 'mental', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '어머님은 선생님의 맞춤형 위생 컨설팅에 큰 위안을 얻으셨고, 교탁 밑 양파 배치 주장은 깔끔히 잊어주셨습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_parent_11',
    dayRange: [1, 30],
    title: '선생님 삼촌 한의사 소개 압박',
    category: 'parent',
    situation: '교무실 전화기',
    narratorText: '상담 기간인데, 하준이 어머님께서 하준이 상담은 뒷전이고 선생님의 결혼 계획을 캐묻기 시작하십니다. "우리 시동생이 서울 강남에서 아주 유명한 한의원 원장인데 나이도 맞고 외모도 출중해요. 선생님이 마음에 쏙 드는데 주말에 소개팅 어떠세요? 사주도 미리 봐놨는데 환상적입니다!" 소개 압박이 들어옵니다. 어떻게 받아치시겠습니까?',
    weight: 100,
    tags: ['선생님소개팅', '한의사삼촌', '사적질문'],
    choices: [
      {
        id: 'choice_funny_parent_11_1',
        text: '정중하고 차분하게 "학교 상담 시간에는 학생의 학교 생활과 학습 발달에 대한 내용만 논의하는 것이 규정"임을 밝히며 상담 본질로 복귀한다. (expert +15, classManagement +10)',
        intent: '상담 본질로의 회귀',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'classManagement', value: 10 }
        ],
        resultText: '어머님은 아쉬워하셨으나 쑥스러워하시며 하준이의 영어 학습 태도 상담으로 서둘러 화제를 돌려 모범적인 상담을 끝마쳤습니다.'
      },
      {
        id: 'choice_funny_parent_11_2',
        text: '"제가 지금은 온통 우리 하준이와 반 아이들을 가르치는 매력에 깊이 빠져 있어서 연애할 틈이 전혀 없답니다!"라며 위트 넘치게 방어한다. (parentTrust +15, 멘탈 +12, hp +5)',
        intent: '위트 있는 교육자형 방어',
        immediateEffects: [
          { stat: 'parentTrust', value: 15 },
          { stat: 'mental', value: 12 },
          { stat: 'hp', value: 5 }
        ],
        resultText: '어머님은 "역시 지극한 제자 사랑!"이라며 크게 호응하시고, 한의원에 좋은 도라지청을 지어 선물로 보내주시겠다고 하셨습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_parent_12',
    dayRange: [1, 30],
    title: '일기장에 유출된 부부싸움 소동',
    category: 'parent',
    situation: '교무실 상담석',
    narratorText: '어제 제출된 준우의 생활 일기에 "어제 엄마가 아빠한테 화가 나서 냄비를 집어던졌다. 냄비가 찌그러져 아빠가 베란다에 나가서 잤다"라고 엄청나게 적나라하게 묘사되어 있었습니다. 오늘 아침 준우 어머님께서 몹시 상기된 목소리로 메신저를 보냈습니다. "선생님, 일기 검사 시 부부 프라이버시는 비밀로 덮어주시고 일기 피드백을 가볍게 넘겨주세요... 부끄럽습니다!" 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['일기장폭로', '부부싸움', '냄비폭격'],
    choices: [
      {
        id: 'choice_funny_parent_12_1',
        text: '모르는 척 넘어가는 한편 준우에게 일기에는 가족들의 싸움 대신 준우가 느낀 생각 위주로 쓰는 법을 조용히 코칭한다. (studentTrust +12, expert +10, parentTrust +10)',
        intent: '아동 개인 코칭 및 기밀 유지',
        immediateEffects: [
          { stat: 'studentTrust', value: 12 },
          { stat: 'expert', value: 10 },
          { stat: 'parentTrust', value: 10 }
        ],
        resultText: '준우는 다음부터 부부싸움 대신 자신이 좋아하는 만화에 대해 썼고, 어머님은 마음을 깊이 놓으셨습니다.'
      },
      {
        id: 'choice_funny_parent_12_2',
        text: '어머님께 "누구나 부부싸움은 할 수 있으니 전혀 부끄러워하실 필요 없다"며 상담 톡으로 격려하며 매실차 기프티콘을 보낸다. (parentTrust +15, 멘탈 +10, hp -5)',
        intent: '정서적 지지 및 공감대 형성',
        immediateEffects: [
          { stat: 'parentTrust', value: 15 },
          { stat: 'mental', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '어머님은 눈물을 흘리시며 인생 상담 상대로 선생님을 믿고 따르며 학교 행사에 가장 헌신적인 학부모가 되어 주셨습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_parent_13',
    dayRange: [1, 30],
    title: '현장체험 도시락 3단 찬합 경쟁',
    category: 'parent',
    situation: '교실',
    narratorText: '수학여행 소풍 날이 다가옵니다. 한 어머님께서 민원을 제기하셨습니다. "저번 체험학습 때 옆집 아이가 3단 수제 캐릭터 리락쿠마 도시락을 싸 와서 우리 지성이가 기가 팍 죽어 왔어요. 소풍 도시락은 오직 삼각김밥이나 일회용 팩 김밥 1줄로 통일하는 학교 특별 규정을 제정해 주십시오!" 도시락 단일화 민원입니다. 어떻게 답변하시겠습니까?',
    weight: 100,
    tags: ['소풍도시락', '3단찬합', '비교의슬픔'],
    choices: [
      {
        id: 'choice_funny_parent_13_1',
        text: '소풍 도시락은 학부모 자율 준비 영역이므로 학교가 직접 메뉴를 제한하거나 단일화 규정을 만드는 것은 불가능하다고 설명한다. (classManagement +12, expert +5)',
        intent: '자율성 존중 및 원칙 고수',
        immediateEffects: [
          { stat: 'classManagement', value: 12 },
          { stat: 'expert', value: 5 }
        ],
        resultText: '학부모님은 아쉬워하셨으나, 현실적인 조율에 따라 예쁘게 유부초밥을 싸 주기로 협의했습니다.'
      },
      {
        id: 'choice_funny_parent_13_2',
        text: '아이들에게 "소풍의 진짜 재미는 반 친구들끼리 서로 다양한 반찬을 골고루 나누어 먹는 기쁨"임을 교육하고 학부모를 격려한다. (studentTrust +15, parentTrust +12, 멘탈 +10)',
        intent: '나눔과 나눔 가치 교육',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'parentTrust', value: 12 },
          { stat: 'mental', value: 10 }
        ],
        resultText: '실제로 소풍날 아이들은 서로 도시락을 바꾸어 먹으며 우정이 깊어졌고, 도시락 경쟁 심리도 말끔히 사라졌습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_parent_14',
    dayRange: [1, 30],
    title: '학부모 총회 앙드레 김 패션쇼',
    category: 'parent',
    situation: '교실',
    narratorText: '학부모 총회 날, 하늘이 어머님께서 앙드레 김 패션쇼를 방불케 하는 순백의 화려한 드레스와 깃털 모자를 착용하고 등장하셨습니다. 교실 내 다른 학부모님들이 부담스러워하며 수군거리기 시작합니다. 교실 분위기가 다소 어색해졌습니다. 어떻게 수습하시겠습니까?',
    weight: 100,
    tags: ['학부모총회', '화려한패션', '교실소동'],
    choices: [
      {
        id: 'choice_funny_parent_14_1',
        text: '차분하게 총회 식순과 담임 소개 피피티를 진행하여, 학부모들의 시선을 옷이 아닌 학교 교육 설명회 내용으로 돌린다. (expert +12, classManagement +12)',
        intent: '설명회 본질 집중 유도',
        immediateEffects: [
          { stat: 'expert', value: 12 },
          { stat: 'classManagement', value: 12 }
        ],
        resultText: '짜임새 있는 학급 교육 안내 덕분에 어색하던 학부모 총회가 아주 지적이고 유익한 시간으로 원만하게 종료되었습니다.'
      },
      {
        id: 'choice_funny_parent_14_2',
        text: '"오늘 하늘이 어머님 덕분에 교실이 한층 더 환하고 우아하게 빛이 나네요!"라며 센스 있게 환영 멘트를 던진다. (parentTrust +15, 멘탈 +12, hp +5)',
        intent: '센스 넘치는 패션 칭찬 및 환영',
        immediateEffects: [
          { stat: 'parentTrust', value: 15 },
          { stat: 'mental', value: 12 },
          { stat: 'hp', value: 5 }
        ],
        resultText: '하늘이 어머님은 얼굴을 붉히며 기뻐하셨고, 다른 학부모님들도 다 함께 웃으며 딱딱하던 교실 분위기가 순식간에 화기애애하게 풀렸습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_parent_15',
    dayRange: [1, 30],
    title: '대역 죄인 삭발 상소 해프닝',
    category: 'parent',
    situation: '교문 앞',
    narratorText: '동우가 어제 수학 단원평가에서 10점을 맞았습니다. 오늘 아침 출근길 교문 앞에 동우 아버님이 삼베옷을 입고 "자식을 제대로 훈육하지 못한 부덕의 소치로 삭발을 결심하고 대령했습니다"라며 비장하게 무릎을 꿇고 서 계십니다. 등교하는 아이들과 교사들이 경악하고 있습니다. 어떻게 조치하시겠습니까?',
    weight: 100,
    tags: ['교문앞소동', '삼베옷아빠', '학업과몰입'],
    choices: [
      {
        id: 'choice_funny_parent_15_1',
        text: '동우 아버님을 정중히 일으켜 세워 교무실 상담실로 신속히 격리 인도하여 주변 시선을 차단하고 이성을 다독인다. (classManagement +15, expert +12, hp -5)',
        intent: '신속한 시선 차단 및 설득',
        immediateEffects: [
          { stat: 'classManagement', value: 15 },
          { stat: 'expert', value: 12 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '아버님을 따뜻한 차로 진정시켰습니다. 동우의 성적은 일시적일 뿐이며 동우의 성격과 재능을 차분히 설명하여 안심시켜 드렸습니다.'
      },
      {
        id: 'choice_funny_parent_15_2',
        text: '교장 선생님과 보건 선생님의 도움을 요청하여 공식적인 학교 차원의 안전 조치 상담 프로세스를 가동한다. (colleagueRelation +10, 멘탈 +10, parentTrust -5)',
        intent: '학교 관리자 연대 공동 대응',
        immediateEffects: [
          { stat: 'colleagueRelation', value: 10 },
          { stat: 'mental', value: 10 },
          { stat: 'parentTrust', value: -5 }
        ],
        resultText: '교장 교감 선생님이 함께 중재에 나서면서 아버님은 머쓱해하며 삼베옷을 벗고 씩씩하게 집으로 돌아가셨습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_parent_16',
    dayRange: [1, 30],
    title: '우주의 에너지가 솟구치는 집중 팔찌',
    category: 'parent',
    situation: '교실',
    narratorText: '수업 시간, 태민이가 손목에 번쩍이는 크리스탈 돌 팔찌를 차고 있습니다. 짝꿍들이 신기해서 만지며 장난을 칩니다. 태민이 어머님께서 "그 팔찌는 히말라야 우주 에너지가 함축되어 태민이의 주의력을 흐트러지지 않게 수호해 주는 집중 팔찌이니, 수업 중에 절대 뺏거나 압수하지 말아 주세요"라고 신신당부 문자를 남기셨습니다. 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['집중팔찌', '히말라야기운', '교실질서'],
    choices: [
      {
        id: 'choice_funny_parent_16_1',
        text: '수업 시간에 팔찌를 만지며 소리를 내는 행위는 교실 학습 분위기를 흐리므로 필통 속에 넣어두도록 규칙을 적용한다. (classManagement +12, expert +10)',
        intent: '교실 학습 환경 사수',
        immediateEffects: [
          { stat: 'classManagement', value: 12 },
          { stat: 'expert', value: 10 }
        ],
        resultText: '태민이는 수업 시간엔 팔찌를 가방에 넣고 쉬는 시간에만 착용했습니다. 학급 공부 질서가 회복되었습니다.'
      },
      {
        id: 'choice_funny_parent_16_2',
        text: '태민이에게 "우주의 기운이 담긴 멋진 팔찌구나! 단, 친구들이 만져서 기운이 흩어지지 않게 옷 소매로 꼭 덮어서 숨겨두자"고 약속한다. (studentTrust +15, parentTrust +15, 멘탈 +10)',
        intent: '감성적 타협 가리기',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'parentTrust', value: 15 },
          { stat: 'mental', value: 10 }
        ],
        resultText: '태민이는 팔찌를 옷 소매로 꽁꽁 감싸며 뿌듯해했고, 친구들의 호기심도 자연스럽게 시들해져 성공적으로 집중하게 되었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_parent_17',
    dayRange: [1, 30],
    title: '걷기 대회 참가자 기념 상장 조작단',
    category: 'parent',
    situation: '교무실',
    narratorText: '체육 시간 교내 걷기 대회 행사가 끝난 후, 민석이 어머님께서 섭섭함을 가득 담아 전화하셨습니다. "우리 민석이가 꼴찌로 완주하긴 했지만, 포기하지 않는 도전정신을 보였으니 칭찬해 주셔야죠. 담임 선생님 도장이 찍힌 \'포기하지 않는 불굴의 완주상\'을 종이에 프린트해서 한 장 수여해 주세요. 아이 기가 살아야죠!" 상장 제작 요청입니다. 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['상장민원', '불굴의의지', '기념상장'],
    choices: [
      {
        id: 'choice_funny_parent_17_1',
        text: '공식 상장은 학교 규정과 심사 위원회의 승인이 있어야 발급되므로 개별 사설 상장은 발급할 수 없다고 법령 원칙을 안내한다. (expert +12, classManagement +12)',
        intent: '공식 상장 남발 금지 원칙',
        immediateEffects: [
          { stat: 'expert', value: 12 },
          { stat: 'classManagement', value: 12 }
        ],
        resultText: '어머님은 규정이 그렇다면 어쩔 수 없다고 수긍하셨고, 민석이는 교실 칭찬 나무에 스티커 1장을 붙이는 것으로 아쉬움을 달랬습니다.'
      },
      {
        id: 'choice_funny_parent_17_2',
        text: '반 아이들 모두에게 각자의 장점(완주, 유머, 배려 등)을 하나씩 골라 수여하는 \'학급 전원 시상 칭찬 엽서식 배지\'를 다 함께 나눠준다. (studentTrust +15, parentTrust +12, 멘탈 +10)',
        intent: '전원 포용적 격려 시상',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'parentTrust', value: 12 },
          { stat: 'mental', value: 10 }
        ],
        resultText: '반 전체 학생들이 엽서 배지를 받고 기뻐서 자랑했습니다. 학급에 긍정적인 자부심 에너지가 풍성하게 채워졌습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_parent_18',
    dayRange: [1, 30],
    title: '아동 모델 1차 통과 주 4일 빠짐 대란',
    category: 'parent',
    situation: '교무실',
    narratorText: '예나 어머님께서 흥분한 목소리로 전화를 하셨습니다. "선생님, 예나가 유아 아동 의류 키즈모델 1차 서류를 기적적으로 통과했어요! 이제 매주 프로필 사진 촬영과 기획사 미팅을 가야 하니, 매달 주 4일씩 현장체험학습 신청서를 내고 학교를 빠지겠습니다. 출석은 정식 인정해 주시겠죠?" 어떻게 답변하시겠습니까?',
    weight: 100,
    tags: ['체험학습민원', '키즈모델', '출석인정'],
    choices: [
      {
        id: 'choice_funny_parent_18_1',
        text: '연간 체험학습 인정 최대 일수 제한 규정과 학업 결손이 생기면 학년급 진급 및 아동 정서 발달에 미칠 부작용을 명확히 안내한다. (expert +15, classManagement +12, parentComplaint -10)',
        intent: '규정 한도 엄격 준수 및 조율',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'classManagement', value: 12 },
          { stat: 'parentComplaint', value: -10 }
        ],
        resultText: '어머님은 규정된 체험학습 일수 내에서만 미팅 일정을 조율하겠다며 한 걸음 물러서셨습니다. 수업 출석 질서를 튼튼히 사수했습니다.'
      },
      {
        id: 'choice_funny_parent_18_2',
        text: '"예나의 꿈을 축하합니다! 단, 촬영이 없는 날에는 학교에 나와 친구들과 소중한 사회성 추억을 쌓는 것이 더 큰 배우가 되는 발판"이라고 다정하게 타이른다. (parentTrust +15, studentTrust +10, 멘탈 +10)',
        intent: '진로 지지 및 출석 설득',
        immediateEffects: [
          { stat: 'parentTrust', value: 15 },
          { stat: 'studentTrust', value: 10 },
          { stat: 'mental', value: 10 }
        ],
        resultText: '학부모님은 감격하셨고, 예나는 주말과 방과 후에만 모델 활동을 하고 평일에는 성실히 학교에 등교하여 친구들과 활발히 보냈습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_parent_19',
    dayRange: [1, 30],
    title: '교내 모기 박멸 군용 연막탄 민원',
    category: 'parent',
    situation: '교무실',
    narratorText: '지성이 아버님께서 교무실로 전화를 하셨습니다. "요즘 교실에 산모기가 많아 지성이가 긁다가 딱지가 생겼습니다. 학교 보건 소독 스프레이는 효과가 미비하니, 이번 주말에 아버님 동창이 운영하는 군용 연막탄 방역 업체를 무료로 불러 교무실과 교실 전체에 연막탄 가스 소독을 흠뻑 뿌리게 조치해 주십시오!" 강력한 화력(?)의 방역 건의입니다. 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['방역건의', '산모기공포', '군용연막탄'],
    choices: [
      {
        id: 'choice_funny_parent_19_1',
        text: '학교 내 화학 방역은 공식 지침과 인증된 보건 약품으로만 소독하도록 법으로 엄격히 제한되어 있어 사설 연막탄은 불가함을 알린다. (expert +12, colleagueRelation +5)',
        intent: '보건 안전 법령 준수',
        immediateEffects: [
          { stat: 'expert', value: 12 },
          { stat: 'colleagueRelation', value: 5 }
        ],
        resultText: '아버님은 학교 안전 규정에 동의하시며 대신 교실 모기향 매트를 기부해주기로 협의하셨습니다.'
      },
      {
        id: 'choice_funny_parent_19_2',
        text: '"지성이의 예쁜 다리를 위해 친환경 모기 퇴치 팔찌를 학급 전체에 선물로 배부하고 교실 창틀 물구멍 물막이 스티커를 다 함께 붙이겠다"고 대처한다. (studentTrust +15, parentTrust +15, 멘탈 +10)',
        intent: '친환경 및 아동 중심 해결책',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'parentTrust', value: 15 },
          { stat: 'mental', value: 10 }
        ],
        resultText: '아이들은 모기 스티커 붙이기 놀이에 신이 났고, 지성이 아버님은 교실 모기 차단 스티커 아이디어에 감동하여 엄지척을 보내셨습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_parent_20',
    dayRange: [1, 30],
    title: '한의사 아버님의 강제 맥박 진맥 면담',
    category: 'parent',
    situation: '교무실 상담석',
    narratorText: '학부모 면담일에 한의원을 운영하시는 지훈이 아버님이 들어오셨습니다. 지훈이 이야기 대신 턱밑이 까매진 담임 교사를 빤히 보시더니 갑자기 손목을 홱 낚아채 진맥을 짚으십니다. "선생님, 지금 지훈이가 문제가 아니라 신장 기운이 완전히 소진되고 심장에 열독이 꽉 찼습니다! 당장 침 맞고 십전대보탕 수급 안 하면 쓰러집니다!" 당혹스러운 한의학 진단입니다. 어떻게 응대하시겠습니까?',
    weight: 100,
    tags: ['한의사상담', '강제진맥', '보약강매의혹'],
    choices: [
      {
        id: 'choice_funny_parent_20_1',
        text: '염려해 주셔서 감사하나 건강관리는 개인 주치의와 상담하겠다고 밝히며, 지훈이의 친구 관계 상담 피피티로 다시 리드한다. (expert +15, classManagement +10)',
        intent: '정중한 공사 구분 및 복귀',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'classManagement', value: 10 }
        ],
        resultText: '아버님은 허허 웃으시며 지훈이 상담에 집중하셨습니다. 상담 후 차분하게 지훈이의 성실한 태도를 함께 칭찬했습니다.'
      },
      {
        id: 'choice_funny_parent_20_2',
        text: '"안 그래도 피로가 극에 달했는데 한의학 명의 아버님을 뵙게 되어 천군만마를 얻은 것 같습니다!"라며 아버님의 조언을 경청한다. (parentTrust +15, 멘탈 +15, hp +10)',
        intent: '학부모 전문성 전폭 존중',
        immediateEffects: [
          { stat: 'parentTrust', value: 15 },
          { stat: 'mental', value: 15 },
          { stat: 'hp', value: 10 }
        ],
        resultText: '아버님은 한의원으로 초대하여 아주 저렴한 학부모 할인가로 특급 총명 공진단을 한 갑 지어 주셨습니다. 덕분에 기력을 크게 회복했습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_parent_21',
    dayRange: [1, 30],
    title: '전교회장 당선 백설기 떡 돌리기 금지령',
    category: 'parent',
    situation: '교무실',
    narratorText: '하준이가 전교어린이회 회장에 당선되었습니다. 하준이 어머님께서 기쁨을 이기지 못하고 "전교생과 전 교직원에게 당선 감사 백설기 떡과 꿀 음료 500세트를 내일 아침 학교로 발송했습니다!"라고 문자를 주셨습니다. 교무실에 김영란법 위반 및 형평성 문제로 비상이 걸렸습니다. 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['전교회장당선', '백설기대소동', '청탁금지법'],
    choices: [
      {
        id: 'choice_funny_parent_21_1',
        text: '부정청탁 및 금품 수수 금지법에 따라 외부 떡 돌리기는 절대 불가능하므로, 당장 배달을 취소해 달라고 학부모님께 법적 근거를 설명한다. (expert +15, colleagueRelation +10, parentTrust -5)',
        intent: '청탁금지법 의거 즉각 취소',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'colleagueRelation', value: 10 },
          { stat: 'parentTrust', value: -5 }
        ],
        resultText: '어머님은 규정이 무서워 깜짝 놀라 즉시 떡 배달을 취소하셨습니다. 학교의 법적 청렴함을 완벽히 고수했습니다.'
      },
      {
        id: 'choice_funny_parent_21_2',
        text: '어머님과 소통하여 떡을 반 전체에 돌리는 대신, 반 아이들이 직접 그린 축하 손편지 롤링페이퍼로 당선 행사를 갈음하게 설득한다. (studentTrust +15, parentTrust +15, 멘탈 +10)',
        intent: '돈 대신 마음 나누기 대안책',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'parentTrust', value: 15 },
          { stat: 'mental', value: 10 }
        ],
        resultText: '하준이는 반 친구들의 진심 어린 손편지 선물을 받고 눈물을 흘리며 기뻐했고, 학부모님은 떡보다 뜻깊은 교실 행사에 감복하셨습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_parent_22',
    dayRange: [1, 30],
    title: '선생님 목소리 톤 한 옥타브 올림 민원',
    category: 'parent',
    situation: '교무실',
    narratorText: '웅이 어머님께서 넌지시 불편 쪽지를 보내셨습니다. "선생님, 목소리가 너무 나긋나긋하고 중저음이시라, 집에서 웅이가 대답할 때 선생님 환청이 들리면서 꾸벅꾸벅 잠이 온대요. 수업하실 때 부디 솔톤이나 레몬 에이드처럼 앙증맞고 한 옥타브 높은 맑은 목소리로 리드해 주세요!" 황당한 보이스 피드백입니다. 어떻게 하시겠습니까?',
    weight: 100,
    tags: ['목소리톤', '앙증맞은솔톤', '환청소동'],
    choices: [
      {
        id: 'choice_funny_parent_22_1',
        text: '개인의 성대 톤과 목소리는 조절의 대상이 아니며, 수업 전달을 위해 또박또박 발음하겠다고 쿨하게 안내한다. (expert +12, classManagement +12)',
        intent: '전문성 기반 발음 강조 및 선 긋기',
        immediateEffects: [
          { stat: 'expert', value: 12 },
          { stat: 'classManagement', value: 12 }
        ],
        resultText: '어머님은 다소 까칠한 반응에 당황하셨지만 더는 목소리로 트집을 잡지 않으셨습니다. 수업 내용 전달력은 고수했습니다.'
      },
      {
        id: 'choice_funny_parent_22_2',
        text: '어머님께 유쾌하게 답장하며 "웅이가 조는 날에는 교실 앞자리로 불러 귀엽게 박수를 쳐 주며 솔톤으로 깨워 보겠다"고 약속한다. (studentTrust +15, parentTrust +15, 멘탈 +12)',
        intent: '귀엽고 유쾌한 교실 밀착 케어',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'parentTrust', value: 15 },
          { stat: 'mental', value: 12 }
        ],
        resultText: '실제로 웅이는 선생님의 전담 마크 박수 덕분에 잠이 확 깼고, 어머님은 웅이가 학교 수업이 너무 재미있다고 집에서 난리라며 대만족하셨습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_parent_23',
    dayRange: [1, 30],
    title: '등교 지도 롤스로이스 힙합 클럽 해프닝',
    category: 'parent',
    situation: '교문',
    narratorText: '아침 교문 앞 등교 지도 시간, 번쩍이는 롤스로이스 한 대가 교문 횡단보도를 가로막고 섰습니다. 차 안에서 클럽용 데시벨 높은 힙합 음악이 교정에 울려 퍼지고, 동우 아버님이 금목걸이를 하시고 내리더니 "동우야! 오늘도 기 팍 펴고 학교 찢어라!"라며 춤을 추듯 하이파이브를 하십니다. 아이들이 구경하느라 복새통을 이룹니다. 어떻게 수습하시겠습니까?',
    weight: 100,
    tags: ['교문지도', '슈퍼카등교', '힙합아빠'],
    choices: [
      {
        id: 'choice_funny_parent_23_1',
        text: '아버님께 다가가 정중하게 횡단보도는 학생들의 보행 안전 구역이므로 주정차를 금지해 주시고 볼륨을 줄여 달라고 안내한다. (expert +15, classManagement +12, parentTrust -5)',
        intent: '보행 안전 제일주의 정중 권고',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'classManagement', value: 12 },
          { stat: 'parentTrust', value: -5 }
        ],
        resultText: '아버님은 "아, 안전이 우선이죠!"라며 황급히 볼륨을 줄이고 차를 빼 주셨습니다. 안전한 등굣길 질서를 즉각 수호했습니다.'
      },
      {
        id: 'choice_funny_parent_23_2',
        text: '아버님께 가볍게 인사하며 "동우가 힙합 그루브를 닮아 리듬감이 우수하다"고 농담을 건네며 안전 구역 이동 주차를 넉살 좋게 권한다. (parentTrust +15, studentTrust +12, 멘탈 +10)',
        intent: '그루브형 넉살 주차 권고',
        immediateEffects: [
          { stat: 'parentTrust', value: 15 },
          { stat: 'studentTrust', value: 12 },
          { stat: 'mental', value: 10 }
        ],
        resultText: '아버님은 신이 나 동우를 안고 멀리 안전한 하차 구역으로 가 주차하셨습니다. 동우 아버님은 담임 선생님의 힙함(?)을 극찬하셨습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_parent_24',
    dayRange: [1, 30],
    title: '조선 훈장님 빙의 서예 장인 할아버지의 전화',
    category: 'parent',
    situation: '교무실 전화기',
    narratorText: '방과후 서예 교실에서 손자 민우의 서예 획이 삐뚤어졌는데 피드백이 빈약했다며, 붓글씨 명필이신 민우 할아버지께서 전화를 걸어오셨습니다. "붓은 마음의 거울이거늘! 훈장 담임 선생은 손자의 붓 쥐는 획법을 교정하지 않고 묵인한 이유가 무엇인가! 내 교사 관상이 삐뚤어졌는지 전수 검사하겠소!" 훈장님의 호통입니다. 어떻게 중재하시겠습니까?',
    weight: 100,
    tags: ['훈장님할아버지', '붓글씨훈육', '관상비판'],
    choices: [
      {
        id: 'choice_funny_parent_24_1',
        text: '방과후 서예 교실은 외부 전문 강사님이 전담 지도하므로 방과후 코디네이터 강사님께 이관하여 원칙적인 절차 지도를 거친다. (expert +12, colleagueRelation +5)',
        intent: '방과후 강사 이관 및 행정 처리',
        immediateEffects: [
          { stat: 'expert', value: 12 },
          { stat: 'colleagueRelation', value: 5 }
        ],
        resultText: '민우 할아버님은 방과후 전문 강사님의 상세한 한글 서법 해명을 듣고 납득하여 호통 전화를 원만하게 거두셨습니다.'
      },
      {
        id: 'choice_funny_parent_24_2',
        text: '"할아버님의 심오한 명필 사상을 담아 민우가 먹향의 정신을 배우도록 교실 일기장 붓펜 글씨 쓰기 특별 지도를 약속하겠다"고 깎듯이 말씀드린다. (parentTrust +15, studentTrust +12, 멘탈 +10)',
        intent: '전통 존중형 깎듯한 응대',
        immediateEffects: [
          { stat: 'parentTrust', value: 15 },
          { stat: 'studentTrust', value: 12 },
          { stat: 'mental', value: 10 }
        ],
        resultText: '할아버님은 "아직 예의범절이 살아있는 젊은 은사로고!"라며 감격하셨고, 학교로 손수 쓴 명필 가훈 족자를 선물로 보내오셨습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_parent_25',
    dayRange: [1, 30],
    title: '학급 전담 사설 청소 용역 위탁 건의',
    category: 'parent',
    situation: '교무실',
    narratorText: '예나 어머님을 필두로 한 5명의 학부모님이 찾아오셨습니다. "우리 예쁜 아이들이 빗자루질을 하면 손바닥에 굳은살이 생기고 먼지를 마셔 기관지에 해롭습니다. 저희가 학급 총회비를 모아 외부 전문 빌딩 청소 용역 업체를 고용해 매일 방과 후 교실을 청소하도록 허용해 주세요!" 청소 용역 위탁 건의입니다. 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['교실청소', '청소용역', '과잉보호'],
    choices: [
      {
        id: 'choice_funny_parent_25_1',
        text: '공동체 생활 속 교실 청소 활동은 자기 책임을 배우는 공교육 교육과정의 핵심 생활 지도 영역임을 단호히 밝힌다. (classManagement +15, expert +12, parentComplaint -10)',
        intent: '생활 지도 가치 및 공교육 고수',
        immediateEffects: [
          { stat: 'classManagement', value: 15 },
          { stat: 'expert', value: 12 },
          { stat: 'parentComplaint', value: -10 }
        ],
        resultText: '학부모님들은 청소의 교육적 취지에 공감하며 용역 고용 건의를 전면 철회하셨고, 예나는 교실 먼지 털기 반장으로 성실히 복무했습니다.'
      },
      {
        id: 'choice_funny_parent_25_2',
        text: '아이들의 손바닥 자극을 막기 위해 부드러운 극세사 먼지털이와 미니 무선 청소기 세트를 교실에 도입해 가볍게 청소 놀이를 유도한다. (studentTrust +15, parentTrust +12, 멘탈 +10)',
        intent: '기발한 위생 교구 도입',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'parentTrust', value: 12 },
          { stat: 'mental', value: 10 }
        ],
        resultText: '아이들은 무선 청소기 놀이에 열광하며 춤을 추듯 교실을 반짝반짝하게 청소했고, 학부모님들도 아동 중심 청소 교구에 엄지를 세우셨습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_parent_26',
    dayRange: [1, 30],
    title: '캠핑장에서 마주친 한우 뇌물 쇼',
    category: 'parent',
    situation: '주말 캠핑장',
    narratorText: '주말에 자연을 만끽하러 교외 캠핑장에 텐트를 쳤는데, 옆 사이트에 윤하 어머님 가족이 텐트를 치고 있었습니다! 윤하 어머님이 비명을 지르며 반가워하시더니, "선생님을 캠핑장에서 영접하다니 이건 운명입니다!"라며 석쇠 위에 갓 구운 육즙이 흐르는 횡성 한우 살치살 3인분과 수제 쌈장 플레이트를 텐트 안으로 끊임없이 들이미십니다. 이 한우 살치살을 받아야 할까요?',
    weight: 100,
    tags: ['주말캠핑', '한우살치살', '부담스런이웃'],
    choices: [
      {
        id: 'choice_funny_parent_26_1',
        text: '"한우의 냄새만으로도 주말의 영광입니다!"라며 마음만 정중히 사양하고, 자신이 가져온 가벼운 캠핑 컵라면 세트를 나누어 주며 적절한 사적 거리를 고수한다. (expert +15, parentTrust +10, 멘탈 +10)',
        intent: '정중한 뇌물 사절 및 거리 고수',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'parentTrust', value: 10 },
          { stat: 'mental', value: 10 }
        ],
        resultText: '살치살의 치명적인 유혹을 이겨내고 청렴한 교사 상을 확립했습니다. 윤하 어머님은 선생님의 올곧음에 탄복하셨습니다.'
      },
      {
        id: 'choice_funny_parent_26_2',
        text: '"캠핑의 미덕은 나눔이죠!"라며 고기를 맛있게 먹고 답례로 윤하에게 힐링 마시멜로 구이 세트를 함께 구워 선물하며 주말 우정을 다진다. (parentTrust +15, studentTrust +15, hp +10, 멘탈 +12)',
        intent: '주말 한정 힐링 나눔',
        immediateEffects: [
          { stat: 'parentTrust', value: 15 },
          { stat: 'studentTrust', value: 15 },
          { stat: 'hp', value: 10 },
          { stat: 'mental', value: 12 }
        ],
        resultText: '살치살은 입에서 살살 녹았고, 마시멜로 캠핑 파티를 즐긴 윤하는 월요일에 교실에서 담임 선생님 말이라면 자다가도 깨는 우등생이 되었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_parent_27',
    dayRange: [1, 30],
    title: '체력장 아빠 대리 턱걸이 시험 건의',
    category: 'parent',
    situation: '교무실 전화기',
    narratorText: '수행평가가 포함된 체력장 날, 민우가 턱걸이를 단 1개도 매달리지 못해 0점을 받았습니다. 오늘 밤 민우 아버님께서 비장한 숨소리를 내며 연락하셨습니다. "선생님, 제가 해병대 출신이라 하루에 철봉 50개는 가뿐히 합니다. 제가 내일 학교 운동장 철봉에서 대리 턱걸이를 시전하고 민우에게 만점을 주시면 안 되겠습니까? 부전자전이니 제 턱걸이가 곧 민우의 피와 살입니다!" 기상천외한 대리 체력장 요청입니다. 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['체력장', '대리턱걸이', '해병대아빠'],
    choices: [
      {
        id: 'choice_funny_parent_27_1',
        text: '모든 평가는 학생 본인의 실질적 수행 능력을 측정하는 국가 교육과정 공식 규정이므로 대리 턱걸이는 즉시 0점 및 부정행위 대상임을 알린다. (expert +15, classManagement +12)',
        intent: '부정행위 차단 및 평가 원칙',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'classManagement', value: 12 }
        ],
        resultText: '아버님은 군인 정신으로 원칙을 깔끔하게 수긍하셨고, 민우는 매일 철봉 매달리기 연습을 해 체력을 증진했습니다.'
      },
      {
        id: 'choice_funny_parent_27_2',
        text: '"아버님의 우수한 철봉 체력 유전자가 민우에게 발현되도록, 점수 대신 운동장에서 아빠와 민우가 함께 턱걸이 훈련을 하는 힐링 브이로그 과제를 추천하겠다"고 타협한다. (parentTrust +15, studentTrust +12, 멘탈 +10)',
        intent: '아빠와 함께하는 힐링 과제 권유',
        immediateEffects: [
          { stat: 'parentTrust', value: 15 },
          { stat: 'studentTrust', value: 12 },
          { stat: 'mental', value: 10 }
        ],
        resultText: '아버님은 아들과 주말 철봉 훈련 홈비디오를 찍어 보내며 크게 만족하셨고 민우의 턱걸이 근력도 실제로 소폭 향상되었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_parent_28',
    dayRange: [1, 30],
    title: '겨울왕국 엘사 드레스 등교 통제 미루기',
    category: 'parent',
    situation: '교무실',
    narratorText: '예나 어머님께서 곤란함을 가득 담아 메신저를 보냈습니다. "선생님, 예나가 요즘 애니메이션 겨울왕국 엘사에 너무 과몰입해서 매일 아침 바닥에 끌리는 반짝이 하늘색 겨울왕국 드레스와 왕관을 쓰고 등교하겠다고 누워 울부짖어요. 집에서는 도저히 통제가 안 되니 담임 선생님께서 교실에서 엄격하게 훈육해서 다른 평상복만 입고 오도록 혼쭐을 내주세요!" 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['엘사드레스', '과몰입등교', '훈육위임'],
    choices: [
      {
        id: 'choice_funny_parent_28_1',
        text: '복장 지도는 기본 가정 교육의 책임 영역이며, 학교 내에서는 활동성과 안전을 위해 실용적인 체육복 바지 규정을 착용해야 함을 단호히 밝힌다. (classManagement +12, expert +12)',
        intent: '가정 훈육 책임 강조 및 안전 규정',
        immediateEffects: [
          { stat: 'classManagement', value: 12 },
          { stat: 'expert', value: 12 }
        ],
        resultText: '어머님은 반성하시며 집에서 예나를 설득해 청바지와 티셔츠를 입혀 등교시키기 시작하셨습니다. 교실 질서가 단정해졌습니다.'
      },
      {
        id: 'choice_funny_parent_28_2',
        text: '예나에게 "매주 금요일은 엘사 여왕님의 왕실 드레스 데이"로 1주일에 단 하루만 가방에 담아와 쉬는 시간에만 입도록 타협 칭찬을 가동한다. (studentTrust +15, parentTrust +12, 멘탈 +10)',
        intent: '여왕님 주 1회 가동 타협',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'parentTrust', value: 12 },
          { stat: 'mental', value: 10 }
        ],
        resultText: '예나는 금요일만 오매불망 기다리며 평일에는 평상복을 성실하게 입어주어, 가정 내 실랑이가 깨끗하게 해소되었습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_parent_29',
    dayRange: [1, 30],
    title: '담임 카톡 프로필 바다 사진 훈수',
    category: 'parent',
    situation: '교무실 메신저',
    narratorText: '주말에 친구들과 동해 바다에 놀러 가 찍은 시원한 파도 배경의 셀카 사진을 카카오톡 프로필에 올렸습니다. 월요일 아침, 하늘이 어머님께서 넌지시 문자를 남기셨습니다. "선생님, 프로필 바다 사진 속 어깨 라인이 약간 드러난 여름옷이 아이들 정서 발달과 모범적 교사 윤리상 조금 개방적이라 여겨집니다. 교육을 위해 화사하고 단정한 정장 사진이나 칠판 배경 사진으로 교체하시는 게 어떨까요?" 황당한 카톡 훈수입니다. 어떻게 대처하시겠습니까?',
    weight: 100,
    tags: ['카톡프로필', '사생활침해', '교사윤리훈수'],
    choices: [
      {
        id: 'choice_funny_parent_29_1',
        text: '사적인 메신저 프로필은 개인 사생활 영역이며 학교 업무용 폰 번호로 멀티프로필을 따로 설정하여 물리적으로 학부모 연락 채널을 차단한다. (expert +15, classManagement +12, parentComplaint -10)',
        intent: '멀티프로필 가동 사생활 차단',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'classManagement', value: 12 },
          { stat: 'parentComplaint', value: -10 }
        ],
        resultText: '학부모 전용 멀티프로필에는 단정한 칠판 그림만 보이게 설정하여, 귀찮은 훈수 민원을 완벽하게 예방 차단했습니다.'
      },
      {
        id: 'choice_funny_parent_29_2',
        text: '"파도처럼 시원하고 거침없이 공부하자는 교육적 암시였는데 오해를 샀군요!"라며 귀엽고 능글맞은 답장으로 웃어넘기며 유지한다. (parentTrust +12, 멘탈 +12, hp +5)',
        intent: '시원한 교육적 비유로 방어',
        immediateEffects: [
          { stat: 'parentTrust', value: 12 },
          { stat: 'mental', value: 12 },
          { stat: 'hp', value: 5 }
        ],
        resultText: '어머님은 선생님의 재치 있는 파도 비유에 웃음을 터뜨리며 더는 프로필 옷차림을 트집 잡지 않고 응원해주기 시작하셨습니다.'
      }
    ]
  },
  {
    id: 'evt_funny_parent_30',
    dayRange: [1, 30],
    title: '장난감 녹음기 뱃지 도청 논쟁',
    category: 'parent',
    situation: '교실 뒷자리',
    narratorText: '교실 청소 시간 중 웅이의 가방에 달린 기여운 곰인형 뱃지의 눈 부분이 미세하게 반짝이는 것을 발견했습니다. 확인해 보니 소형 녹음 칩이 내장된 기기였습니다! 웅이 어머님께 전화를 걸자 "어머 선생님, 도청이라니요! 웅이가 학교에서 소외당하거나 담임 선생님이 무섭게 하진 않는지 정서적 안정을 위해 달아준 소리 모니터 뱃지일 뿐입니다!"라며 억울함을 외치십니다. 어떻게 대응하시겠습니까?',
    weight: 100,
    tags: ['녹음기뱃지', '교실도청', '기밀보호'],
    choices: [
      {
        id: 'choice_funny_parent_30_1',
        text: '타인의 동의 없는 교실 내 대화 녹음은 통신비밀보호법 위반 및 교권 침해 소지가 다분함을 엄격하게 주지시키고 뱃지를 반납 조치한다. (expert +15, classManagement +15, parentTrust -10)',
        intent: '법적 침해 고지 및 철저 금지',
        immediateEffects: [
          { stat: 'expert', value: 15 },
          { stat: 'classManagement', value: 15 },
          { stat: 'parentTrust', value: -10 }
        ],
        resultText: '어머님은 법적 문제에 당황하며 정중하게 사과하셨고 녹음 뱃지를 수거했습니다. 교실 내 자유로운 표현의 안전지대를 굳게 지켰습니다.'
      },
      {
        id: 'choice_funny_parent_30_2',
        text: '"교실 수업과 대화 내용은 매일 알림장에 요약해 드리니 안심하시고, 웅이의 불안을 덜기 위해 보건 상담을 매일 5분씩 진행하겠다"고 정서적으로 타협한다. (studentTrust +15, parentTrust +15, 멘탈 +10, hp -5)',
        intent: '불안 다독임 보건 상담 연계',
        immediateEffects: [
          { stat: 'studentTrust', value: 15 },
          { stat: 'parentTrust', value: 15 },
          { stat: 'mental', value: 10 },
          { stat: 'hp', value: -5 }
        ],
        resultText: '선생님의 세심한 밀착 상담에 어머님은 마음을 푹 놓으시고 녹음기를 즉각 회수하셨습니다. 지극한 교사애로 위기를 넘겼습니다.'
      }
    ]
  }
];
