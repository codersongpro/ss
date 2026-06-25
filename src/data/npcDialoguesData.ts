import type { DialogueStep } from '@/game/types';

export interface DialogueEvent {
  id: string;
  title: string;
  generateSteps: (npcName: string, role?: string) => DialogueStep[];
}

// 교직원용 랜덤 대화 이벤트 50선
export const colleagueDialogueEvents: DialogueEvent[] = Array.from({ length: 50 }, (_, index) => {
  const eventId = `colleague_evt_${String(index + 1).padStart(2, '0')}`;
  
  // 50가지의 다양한 교무직 갈등 및 협조 테마 목록
  const themes = [
    {
      title: "교육과정 계획서 정정 요구",
      situation: "새 학년 교육과정 계획서를 상신했는데, 기재 서식이 예년과 다르다며 교감 선생님이 수정을 요구해 왔습니다.",
      choice1: "교감 선생님의 지적을 수용하여 밤을 새워서라도 서식을 완벽하게 통일해 재기결한다.",
      effects1: [{ stat: 'adminTrust', value: 8 }, { stat: 'burnout', value: 8 }, { stat: 'mental', value: -4 }],
      result1: "행정의 규격화에 적극 순응하여 결재 라인의 신임과 행정력을 다졌으나, 밤샘 작업으로 멘탈과 몸이 상당히 지쳤습니다.",
      choice2: "교육청 지침서의 표준 자율 서식 조항을 정중히 예로 들며 기존 보고서의 유지를 설득한다.",
      effects2: [{ stat: 'educationSoshin', value: 10 }, { stat: 'adminTrust', value: -3 }, { stat: 'mental', value: 2 }],
      result2: "교사 본연의 문서 작성 자율권을 지켜내며 교육 소신을 지켰으나, 행정부와의 보이지 않는 기싸움으로 피로가 약간 쌓였습니다."
    },
    {
      title: "학폭 의심 사안의 임의 중재",
      situation: "반 아이들 간 사소한 다툼이 학폭으로 비화할 조짐이 보이자, 부장 선생님이 학교 명예를 위해 조용히 덮자고 조언합니다.",
      choice1: "부장님의 풍부한 실무 경력을 믿고, 학부모들을 중간에서 달래며 비공식적 중재로 봉합한다.",
      effects1: [{ stat: 'colleagueRelation', value: 8 }, { stat: 'parentComplaint', value: 5 }, { stat: 'expert', value: -4 }],
      result1: "선배 교사의 권위를 존중해 교직원 관계를 다졌으나, 학폭법 미준수로 추후 민원 및 행정 감사 리스크가 소폭 증가했습니다.",
      choice2: "매뉴얼대로 즉시 학교폭력 전담 기구에 사안 보고서를 제출하여 정식 공론화 처리를 진행한다.",
      effects2: [{ stat: 'educationSoshin', value: 12 }, { stat: 'colleagueRelation', value: -4 }, { stat: 'adminTrust', value: 4 }],
      result2: "절차적 공정성을 지키고 법적 보호막을 확보하며 소신을 드높였으나, 일을 크게 만든다며 부장님은 섭섭한 기색을 내비칩니다."
    },
    {
      title: "교과실 공동 교구 분배 마찰",
      situation: "새로 보급된 학년 공용 태블릿 PC 세트를 우리 학급 수업에 많이 배정하려 하자, 옆자리 교사가 공평하지 않다며 항의합니다.",
      choice1: "이웃 학급의 양해를 구하고 수업 모델이 꼭 필요한 1주일간 우리가 독점 사용하되, 다음 주 사용권을 전권 양보한다.",
      effects1: [{ stat: 'expert', value: 8 }, { stat: 'colleagueSolidarity', value: -4 }, { stat: 'colleagueRelation', value: 4 }],
      result1: "태블릿을 접목해 고품격 수업을 제공하며 교사 역량을 뽐냈지만, 동료 교사의 불만 섞인 눈초리는 약간 남아있습니다.",
      choice2: "즉시 절반으로 균등 배분하고, 모자란 부분은 각자 교실의 스마트 칠판과 프린트물로 대체 조율한다.",
      effects2: [{ stat: 'colleagueSolidarity', value: 10 }, { stat: 'colleagueRelation', value: 8 }, { stat: 'expert', value: -2 }],
      result2: "공동체의 평화를 위해 장비를 타협 분배하여 동료 연대감을 극대화했습니다. 다만 완벽히 기획했던 수업의 스펙은 다소 내려갔습니다."
    },
    {
      title: "친목 야유회 불참 통보",
      situation: "주말에 예정된 전 교직원 단합 야유회에 개인 가족 행사가 겹쳐 불참하겠다고 하자, 체육 부장님이 난감한 표정을 짓습니다.",
      choice1: "가족 행사를 조율해 1시간만 얼굴을 비춘 후 사정을 설명하고 조기 퇴근하는 열정을 보인다.",
      effects1: [{ stat: 'colleagueRelation', value: 8 }, { stat: 'familySatisfaction', value: -8 }, { stat: 'hp', value: -4 }],
      result1: "교내 친목 활동에 충실해 동료애를 회복하고 사교성을 굳건히 다졌으나, 주말 이동 피로와 가족의 원망을 샀습니다.",
      choice2: "가족과의 소중한 시간을 최우선으로 지키기 위해 정중하게 사과하고 예정대로 불참을 관철한다.",
      effects2: [{ stat: 'familySatisfaction', value: 12 }, { stat: 'colleagueRelation', value: -6 }, { stat: 'burnout', value: -4 }],
      result2: "워라밸과 가족 사랑을 확고히 사수하며 번아웃을 예방했으나, 부서 내 '개인주의 성향 교사'로 무형의 평판이 누적되었습니다."
    },
    {
      title: "행정 기안 협조 서명 지연",
      situation: "급한 공문 서식을 상신하려는데, 협조 결재 라인의 행정실장님이 서류에 깐깐한 산출 근거가 빠졌다며 승인을 보류하고 있습니다.",
      choice1: "행정실의 요구 조건에 맞춰 단가 비교 견적서 3통을 다시 뽑아 추가 증빙을 완비해 제출한다.",
      effects1: [{ stat: 'adminPower', value: 8 }, { stat: 'adminTrust', value: 6 }, { stat: 'burnout', value: 6 }],
      result1: "완벽한 회계 서류를 보충하여 실무 기결력을 인정받고 신뢰를 샀으나, 행정부의 노가다 작업으로 손목에 무리가 갔습니다.",
      choice2: "작년 교육청 공문 예시 및 결재 완료 내역을 근거로 제시해 현재 기준으로 신속한 협조 통과를 조율한다.",
      effects2: [{ stat: 'adminPower', value: 10 }, { stat: 'burnout', value: -2 }, { stat: 'adminTrust', value: -3 }],
      result2: "명확한 규정 공세로 실무 처리를 신속히 결단하여 야근을 방지했으나, 행정실장과의 관계는 조금 껄끄러워졌습니다."
    },
    // 이하 6~50까지의 다양한 테마를 프로그램식으로 생성하되, 다양하게 한국어로 묘사
    {
      title: "수업 보조교사 배치 조율",
      situation: "기초학력 부진 지도 보조 강사가 들어왔는데, 서로 자기 반에 매 시간 배치해달라며 동료 담임 교사 간에 마찰이 생깁니다.",
      choice1: "우리 학급의 중증 학습 장애를 겪는 아이들의 절박한 상황을 조목조목 피력해 전담 배치를 강력히 얻어낸다.",
      effects1: [{ stat: 'studentTrust', value: 8 }, { stat: 'colleagueRelation', value: -8 }, { stat: 'expert', value: 4 }],
      result1: "우리 반 부진 아동에 대한 혜택을 챙겨 신뢰와 전문성을 증명했으나, 동료의 차가운 눈빛을 견뎌야 합니다.",
      choice2: "매주 교대로 요일을 나누어 합리적으로 균등 배치하는 배려의 시간표 합의안을 작성해 배포한다.",
      effects2: [{ stat: 'colleagueSolidarity', value: 10 }, { stat: 'colleagueRelation', value: 8 }, { stat: 'expert', value: -2 }],
      result2: "합리적인 조율을 유도하여 동료들과의 연대감을 획기적으로 향상시켰습니다. 다만 개별 집중 케어 시간은 다소 희석되었습니다."
    },
    {
      title: "교내 화재 대피 훈련 분담",
      situation: "교무 회의에서 합동 소방 대피 훈련 시 가장 번거롭고 혼잡한 현관 계단 차단 인솔 임무를 누군가 맡아야 하는 분위기입니다.",
      choice1: "교내 안전 관리는 다 같이 해야 하니 앞장서서 힘든 구역인 계단 통제를 도맡겠다고 자처한다.",
      effects1: [{ stat: 'colleagueRelation', value: 8 }, { stat: 'colleagueSolidarity', value: 8 }, { stat: 'hp', value: -6 }, { stat: 'burnout', value: 6 }],
      result1: "솔선수범하는 참교사로서의 면모를 보여 동료들과 연대감을 돈독히 다졌으나 체력과 스트레스가 소폭 소모됩니다.",
      choice2: "비교적 통제가 수월한 학급 단위 잔디밭 유도 구간을 맡고, 계단 구역은 전담 교무 부서에 공식 배치를 건의한다.",
      effects2: [{ stat: 'hp', value: 4 }, { stat: 'burnout', value: -2 }, { stat: 'colleagueRelation', value: -4 }],
      result2: "리스크가 낮은 편안한 구역을 사수해 체력을 아꼈으나, 힘든 일은 슬쩍 회피한다는 은근한 평가를 동료들로부터 듣게 됩니다."
    },
    {
      title: "급식 잔반 지도 규율 충돌",
      situation: "영양 교사가 급식 잔반이 너무 많이 나와 지자체 탄소 배출 경고를 받았다며, 담임 교사들에게 철저한 식판 검사를 요청합니다.",
      choice1: "환경 교육도 중요한 교육 소신이므로, 편식을 일일이 규제하여 급식을 한 숟가락이라도 다 먹도록 교실 지도를 강화한다.",
      effects1: [{ stat: 'educationSoshin', value: 10 }, { stat: 'colleagueRelation', value: 6 }, { stat: 'parentComplaint', value: 10 }, { stat: 'studentTrust', value: -6 }],
      result1: "영양교사와의 공조와 교육관을 확립했으나, '강제 배식 편식 지도'에 불만을 품은 아이와 부모의 민원 협박이 제기됩니다.",
      choice2: "아동의 자율 식생활 선택권을 중시하고, 잔반 감축을 강제하기보다 캠페인을 통한 자율 유도를 역건의한다.",
      effects2: [{ stat: 'studentTrust', value: 8 }, { stat: 'parentComplaint', value: -4 }, { stat: 'colleagueRelation', value: -5 }],
      result2: "학생들의 인권을 지켜주고 신뢰를 회복했으나, 학교 급식 환경 지표 개선에는 크게 기여하지 못해 영양 교사가 한숨을 쉽니다."
    },
    {
      title: "교장선생님과의 억지 티타임",
      situation: "교장실에서 6학년 담임 교사들을 긴급 호출하여 교육 혁신에 대한 장황한 연설과 함께 직접 탄 대추차를 함께하자고 제안하십니다.",
      choice1: "교장 선생님의 교육 철학에 적극 맞장구를 치고 수첩에 경청하는 태도를 보이며 1시간을 꽉 채운다.",
      effects1: [{ stat: 'adminTrust', value: 10 }, { stat: 'burnout', value: 8 }, { stat: 'mental', value: -6 }],
      result1: "관리자 신임을 듬뿍 얻어 평탄한 근무 평가를 약속받았으나, 영혼 없는 맞장구로 멘탈이 크게 고갈되었습니다.",
      choice2: "5교시 수업 보충 자료를 긴급하게 인쇄하여 학급에 들어가야 한다는 사정을 정중히 조율하고 15분 만에 먼저 실례한다.",
      effects2: [{ stat: 'expert', value: 6 }, { stat: 'adminTrust', value: -4 }, { stat: 'mental', value: 3 }],
      result2: "수업 준비 시간을 온전히 사수하며 전문성을 수호했으나, 교장 선생님의 은근한 시선과 권위에 금이 갔습니다."
    },
    {
      title: "교무수첩 인쇄 비용 분담",
      situation: "동료 교사가 학년 전체 공용 교무 업무 다이어리를 고급 수첩으로 제작해 나누자며 공금 2만원씩 거출하자고 제안합니다.",
      choice1: "공동체 분위기에 동참하기 위해 웃으며 회비를 제출하고, 학년 공동체의 화합을 지지한다.",
      effects1: [{ stat: 'colleagueRelation', value: 6 }, { stat: 'colleagueSolidarity', value: 6 }, { stat: 'familySatisfaction', value: -2 }],
      result1: "공동 회비 지출로 교직원 연대와 동료 관계를 원만히 다졌으나 지갑은 아주 조금 가벼워졌습니다.",
      choice2: "스마트 기기용 구글 캘린더나 무료 노션 템플릿 사용을 고수하며, 낭비성 인쇄 수첩 거출에 불참하겠다고 완곡히 거절한다.",
      effects2: [{ stat: 'educationSoshin', value: 8 }, { stat: 'colleagueRelation', value: -6 }, { stat: 'burnout', value: -2 }],
      result2: "디지털 기기 활용 소신과 낭비 배격 교육관을 관철했으나, 푼돈도 아끼는 지나치게 까다로운 동료로 찍혔습니다."
    }
  ];

  // 나머지 40개의 테마는 다양한 대한민국 학교 실무를 바탕으로 인덱스 매칭 생성
  const defaultTheme = {
    title: `학교 환경 교무 업무 조율 (${index + 1})`,
    situation: `교직원실에서 전달된 [번호: ${index + 1}] 교직 현장 관련 갈등이나 시설 관리, 협조 결재 사항입니다. 어떻게 해결하시겠습니까?`,
    choice1: "관리자 및 행정 규정을 최우선 존중하여 매뉴얼대로 빈틈없는 정석 처리를 관철한다.",
    effects1: [{ stat: 'adminTrust', value: 6 }, { stat: 'adminPower', value: 6 }, { stat: 'hp', value: -4 }, { stat: 'burnout', value: 4 }],
    result1: "철저한 기결 처리로 행정 규율을 수호하였으나 다소 피로가 누적되었습니다.",
    choice2: "동료들의 사정과 교사 자율 재량을 바탕으로 융통성 있게 우회하거나 완화하여 협동 조율한다.",
    effects2: [{ stat: 'colleagueSolidarity', value: 8 }, { stat: 'colleagueRelation', value: 6 }, { stat: 'mental', value: 2 }, { stat: 'adminTrust', value: -2 }],
    result2: "동료 교사들의 전폭적 지지와 정서적 공감을 이끌어내며 직장 연대감을 높였습니다."
  };

  // 실제 50개를 채우기 위한 텍스트 다양화 풀 (실제 학교 현장 업무 키워드 반영)
  const schoolTasks = [
    "교내 정보 보안 대장 작성", "학급 자치 회의 예산 기안", "교문 교통 지도 당번 순번", "교사 다문화 자율 동아리 가입",
    "학교 신문 편집 위원 수락", "생태 정원 화단 물주기 분담", "영어 회화 전문 강사 평가", "교장실 긴급 간담회 다과 섭외",
    "교무실 프린터 토너 교체 섭외", "과학 실험 약품 대장 인계", "스마트 기기 일제 점검 서명", "교육청 청렴도 조사 설문",
    "교직원 배구 대회 참여 요청", "보건실 격리 의심 학생 이송", "도서관 구입 희망 도서 심의", "연구 수업 참관록 피드백",
    "기초 학력 진단 보정 검사 보고", "교원 성과평가 다면 평가 기준", "동학년 주간 학습 예안 취합", "교실 환경 미화용 보조 칠판",
    "학교 생활 기록부 마감 대조", "미술실 정밀 안전 위생 검사", "동아리 외부 초빙 강사 계약", "교직원 식당 배식 순번 조율",
    "교권 보호 위원회 위원 수락", "학교 안전 점검일 시설 공문", "영재 학급 선발 시험 감독", "방송반 마이크 노이즈 점검",
    "디지털 선도 학교 예산 기안", "다목적 체육관 라인 마킹 작업", "현장 체험 학습 답사 보고서", "교직원 주차 구역 주차 시비",
    "생명 존중 교육 주간 보고서", "외부 장학사 방문 다과 세팅", "교육 실습생(교생) 지도 교사", "스마트 클래스 무선 공유기 교체",
    "흡연 예방 교육 사업 계획서", "양성 평등 글짓기 시상 기준", "학교 텃밭 가꾸기 호스 분배", "교원 힐링 직무 연수 참여"
  ];

  const t = themes[index] || {
    title: schoolTasks[index - 10] ? `${schoolTasks[index - 10]} 건의 마찰` : defaultTheme.title,
    situation: schoolTasks[index - 10]
      ? `"${schoolTasks[index - 10]}"에 관한 긴급 협조 및 결재 처리가 다가왔습니다. 행정실이나 동료 부서 간에 협조 서명 기한을 두고 보이지 않는 미묘한 갈등이 존재합니다.`
      : defaultTheme.situation,
    choice1: "공식 매뉴얼과 절차적 규정을 정밀히 준수하여 정석으로 보고서를 기결하고 결재를 상신한다.",
    effects1: [{ stat: 'adminPower', value: 8 }, { stat: 'adminTrust', value: 6 }, { stat: 'hp', value: -4 }, { stat: 'burnout', value: 6 }],
    result1: "철저한 기결 처리로 행정 규율을 완수하고 행정력을 널리 인정받았으나 피로가 가중되었습니다.",
    choice2: "절차의 형식을 간소화하고 메신저 조율을 거쳐, 서로 편한 방식으로 실무 협조를 우회 타협한다.",
    effects2: [{ stat: 'colleagueSolidarity', value: 8 }, { stat: 'colleagueRelation', value: 8 }, { stat: 'burnout', value: -4 }, { stat: 'adminTrust', value: -2 }],
    result2: "실무 협조를 융통성 있게 처리해 동료 교사들의 연대를 굳히고 피로를 대폭 낮췄습니다."
  };

  return {
    id: eventId,
    title: t.title,
    generateSteps: (npcName: string, role?: string) => [
      {
        speaker: npcName,
        text: `"${role || '동료 교사'}로서 드리는 말씀인데... ${t.situation}" ${npcName} 교사가 교무 수첩을 가리키며 긴밀히 조언합니다.`,
        choices: [
          {
            text: t.choice1,
            nextStepIndex: 1,
            effects: t.effects1 as any,
            resultText: t.result1
          },
          {
            text: t.choice2,
            nextStepIndex: 2,
            effects: t.effects2 as any,
            resultText: t.result2
          }
        ]
      },
      {
        speaker: npcName,
        text: `${npcName} 교사는 당신의 단호하고 원칙적인 태도에 고개를 끄덕이며 회의를 원활하게 마무리 지었습니다.`
      },
      {
        speaker: npcName,
        text: `${npcName} 교사는 당신의 정서적이고 유연한 공조에 크게 안심하며, 덕분에 든든한 동료애를 느꼈다며 기뻐합니다.`
      }
    ]
  };
});

// 학생용 랜덤 대화 이벤트 50선
export const studentDialogueEvents: DialogueEvent[] = Array.from({ length: 50 }, (_, index) => {
  const eventId = `student_evt_${String(index + 1).padStart(2, '0')}`;

  const themes = [
    {
      title: "AI 수행평가 대필 의혹 고백",
      situation: "수행평가로 제출한 글쓰기 과제가 생성형 AI로 대필한 흔적이 뚜렷해 묻자, 아이가 눈물을 흘리며 사실을 털어놓습니다.",
      choice1: "평가 공정성 원칙에 따라 수행평가 규정을 엄격히 적용해 0점 처리하고 재시험 기회를 차단한다.",
      effects1: [{ stat: 'educationSoshin', value: 12 }, { stat: 'studentTrust', value: -4 }, { stat: 'expert', value: 4 }],
      result1: "엄격한 공정성 교육으로 타 학생들과의 형평성을 사수하고 기율을 확립했으나, 고백한 학생은 마음의 문을 닫아 신뢰가 깎였습니다.",
      choice2: "고백한 정직함을 참작하여, 최하점을 부여하되 방과 후에 스스로 다시 써 오면 기본 점수를 상향 조정해주기로 한다.",
      effects2: [{ stat: 'studentTrust', value: 10 }, { stat: 'educationSoshin', value: -3 }, { stat: 'mental', value: -2 }],
      result2: "용기를 내어 진실을 털어놓은 아이의 성장을 따뜻하게 격려하고 강한 신뢰를 회복했으나, 다소 교육적 소신에는 금이 갔습니다."
    },
    {
      title: "교실 은따 방치 위기 중재",
      situation: "반 아이들 몇 명이 단체 카톡방에서 특정 한 명을 초대하고 조롱하거나 내쫓는 '카톡 감옥'을 주도한 정황을 포착했습니다.",
      choice1: "학교 폭력 예방 매뉴얼에 따라 가해 학생 전원의 스마트폰을 임시 수거하고 부모 소환 면담 조치로 단호히 처벌한다.",
      effects1: [{ stat: 'educationSoshin', value: 10 }, { stat: 'parentComplaint', value: 10 }, { stat: 'studentTrust', value: 4 }],
      result1: "강력한 생활 지도로 교내 학폭 범죄 기조에 엄격히 대처했으나, 가해측 학부모들의 단체 항의와 민원이 빗발칠 예정입니다.",
      choice2: "방과 후에 당사자 학생들을 모두 Wee클래스에 의뢰하고 역할극 등의 집단 상담 치료를 통해 교우 관계를 중재한다.",
      effects2: [{ stat: 'studentTrust', value: 8 }, { stat: 'mental', value: -4 }, { stat: 'expert', value: 8 }],
      result2: "Wee클래스와 연계한 전문적 집단 상담 솔루션을 적용해 장기적인 교우 관계 복원에 집중했습니다. 단, 집중 조율을 위해 에너지가 크게 쓰였습니다."
    },
    {
      title: "스마트폰 소지 제한 반항",
      situation: "수업 중 몰래 모바일 게임을 하다가 적발되어 스마트폰을 교단 보관함에 반납하라고 지시하자, 학생이 화를 내며 책상을 칩니다.",
      choice1: "교실 기강 수호를 위해 즉시 학생부장 및 교감선생님께 긴급 지원 협조를 청구해 격리 지도 조치한다.",
      effects1: [{ stat: 'adminTrust', value: 6 }, { stat: 'educationSoshin', value: 8 }, { stat: 'studentTrust', value: -6 }],
      result1: "공식 기결 라인에 연계해 교실 내 교권을 보호하고 규칙을 엄수했으나, 담임 교사로서 학생과의 단절감은 극에 달했습니다.",
      choice2: "화를 누르고 학생을 복도로 따로 불러 1:1 면담을 통해 화가 난 심정을 듣고, 수업 종료 후 자발적 제출을 조율한다.",
      effects2: [{ stat: 'studentTrust', value: 10 }, { stat: 'mental', value: -4 }, { stat: 'hp', value: -4 }],
      result2: "학생의 일시적 분노 표출 이면의 감정을 차분히 청취하여 극적인 유대와 신뢰를 복원했으나, 멘탈과 에너지가 탈탈 털렸습니다."
    },
    {
      title: "성적 압박으로 인한 커터칼 자해 징후",
      situation: "어느 학생의 필통 안에서 피 묻은 문구용 칼 조각과 휴지가 발견되었고, 최근 성적 집착 불안을 호소하는 글이 확인되었습니다.",
      choice1: "위기 조치 즉각 발동 규정에 따라 즉시 부모와 보건 교사에게 긴급 인계 통보하고 전문 소아정신과 연계를 진행한다.",
      effects1: [{ stat: 'adminTrust', value: 10 }, { stat: 'expert', value: 8 }, { stat: 'studentTrust', value: -6 }, { stat: 'parentComplaint', value: 8 }],
      result1: "법적 안전 매뉴얼을 준수해 생명 예방 긴급 조치를 완수했으나, 아이는 자신의 비밀이 유포되었다며 선생님을 강하게 불신합니다.",
      choice2: "오늘 방과 후 둘만의 차분한 미술 심리 대화 상담 시간을 개설해 마음을 안정시키고 점진적으로 전문 위클래스 연계를 약속한다.",
      effects2: [{ stat: 'studentTrust', value: 12 }, { stat: 'mental', value: -6 }, { stat: 'hp', value: -2 }],
      result2: "정서적인 밀착 상담으로 상처받은 영혼을 다독이고 교사에 대한 무한 신뢰를 회복했으나, 상담을 진행하느라 기운이 다 소진되었습니다."
    },
    {
      title: "운동부 학생의 교과 수업 전면 졸음",
      situation: "오후 훈련으로 극도로 피곤한 축구부 학생이 5교시 수학 시간에 침을 흘리며 깊은 잠에 빠져 학습지가 젖어 있습니다.",
      choice1: "일어서서 듣기 혹은 세수하고 오기 등 공평한 면학 수호 원칙을 단호히 적용해 즉각 깨워 수업에 참여시킨다.",
      effects1: [{ stat: 'educationSoshin', value: 8 }, { stat: 'studentTrust', value: -4 }, { stat: 'expert', value: 6 }],
      result1: "수업 참여 기조의 교육 소신과 학력 고수를 지켰으나, 축구로 만성 피로인 학생은 시무룩한 표정으로 억지 참관을 진행합니다.",
      choice2: "체육 특기 아동의 극도 피로를 감안하여 뒷자리 매트에서 15분간 숙면을 임시 허용하되, 방과 후에 핵심 프린트만 따로 점검한다.",
      effects2: [{ stat: 'studentTrust', value: 10 }, { stat: 'expert', value: -2 }, { stat: 'mental', value: 2 }],
      result2: "자비롭고 현실적인 건강 케어로 학생의 두터운 신망을 쟁취하였으나, 교실 면학 분위기가 붕괴되었다는 동료 평가가 있을 수 있습니다."
    }
  ];

  const defaultTheme = {
    title: `학급 학생 상담 지도 (${index + 1})`,
    situation: `학급 내 [번호: ${index + 1}] 아동이 교탁 앞으로 다가와 최근 학업 고민이나 친구 관계, 학교 규칙 위반에 대해 털어놓기 시작합니다.`,
    choice1: "학교의 합리적 규칙 and 훈육 가이드에 근거해 단호하고 객관적인 원칙주의 지도를 부과한다.",
    effects1: [{ stat: 'expert', value: 6 }, { stat: 'educationSoshin', value: 6 }, { stat: 'mental', value: -2 }],
    result1: "전문적인 학업 및 행동 원칙을 지도해 교사 소신과 전문 역량을 다잡았습니다.",
    choice2: "아이의 눈을 맞추며 정서적 감정에 공감하고, 규칙 적용 대신 정서적 지지와 격려를 최우선으로 돌려준다.",
    effects2: [{ stat: 'studentTrust', value: 8 }, { stat: 'hp', value: -2 }, { stat: 'burnout', value: 2 }],
    result2: "아이와의 정서적 끈을 굳히고 깊은 학생 신뢰를 확보했습니다."
  };

  const studentIssues = [
    "모둠 활동 시 발표 기피", "급식 시간 특정 편식 시비", "학급 자치 청소 구역 무단 이탈", "친구의 필통 파손 시비",
    "교실 뒤 장난 중 경미한 찰과상", "수업 시간 잦은 화장실 출입", "준비물 미지참으로 인한 태도 지적", "체육 시간 달리기 꼴찌 자괴감",
    "시험지 낙서로 인한 학업 무기력", "학원 뺑뺑이 피로로 인한 아침 조회 수면", "익명 욕설 편지 배후 자백", "청소용 빗자루 칼싸움 장난",
    "교실 온풍기 에어컨 제어 시비", "도서관 대출 도서 연체 저항", "학습 부진 아동 낙인 불안감", "미술 시간 물감 무단 살포 사고",
    "과학 실험 비커 파손 은폐", "방과후 집단 PC방 게임 몰두", "학부모의 과도한 성적 집착 하소연", "학급 반장 선거 탈락 후 소외감",
    "친한 친구의 다른 모둠 이동 섭섭함", "일기장에 적은 부모님 험담 의논", "급식실 새치기 방관 시비", "복도 전력질주로 인한 충돌",
    "선생님 편애 의혹에 대한 서운함", "유튜브 자극적 채널 촬영 관련", "소셜미디어 내 단톡방 험담", "가족 불화로 인한 심리 상담",
    "스마트폰 유튜브 쇼츠 몰입 피로", "가정 환경 방임 의심 신체 위생", "창작 글짓기 모방 시비", "학예회 연극 배역 들러리 불만",
    "수행평가 제출 마감 기한 초과", "교과서 분실로 인한 필기 태만", "수업 시간 돌발 소리 지르기", "교탁 낙서 장난 배후 자백",
    "주변 소음에 극단적 예민함 호소", "컴퓨터실 인터넷 해킹 툴 호기심", "다이어리 꾸미기 스티커 도난 의심", "청소 시간 물총 장난으로 복도 침수",
    "친구의 일방적 대화 단절 절망", "우등생 친구의 이과적 거만함 중재", "학습지 의도적 연필 찢기 반항", "보건실 잦은 꾀병 출입 의심",
    "쉬는 시간 과격한 레슬링 장난"
  ];

  const t = themes[index] || {
    title: studentIssues[index - 5] ? `${studentIssues[index - 5]} 상담` : defaultTheme.title,
    situation: studentIssues[index - 5]
      ? `"${studentIssues[index - 5]}" 문제로 학생이 눈동자를 굴리며 교사의 지도를 바라고 있습니다. 평소 교실 기강과 학생 정서 케어 중 어느 쪽에 집중하시겠습니까?`
      : defaultTheme.situation,
    choice1: "공동체의 규율 수호와 자기 책임 학습법을 차분하고 공정하게 훈육한다.",
    effects1: [{ stat: 'educationSoshin', value: 8 }, { stat: 'expert', value: 6 }, { stat: 'studentTrust', value: -2 }],
    result1: "원칙 기반 훈육을 적용해 학습 태도의 기강과 교육 소신을 지켰으나 학생은 조금 주눅 들었습니다.",
    choice2: "아이의 서투른 문제 행동 뒤에 숨겨진 상처와 필요를 공감하고 부드럽게 용서해 준다.",
    effects2: [{ stat: 'studentTrust', value: 10 }, { stat: 'mental', value: -2 }, { stat: 'burnout', value: 4 }],
    result2: "따뜻한 용서와 격려로 학생 신뢰를 한가득 얻었으나 상담으로 인한 정신 피로도가 조금 늘었습니다."
  };

  return {
    id: eventId,
    title: t.title,
    generateSteps: (npcName: string, _role?: string) => [
      {
        speaker: npcName,
        text: `"${npcName} 학생입니다. 선생님... 실은 ${t.situation}"`,
        choices: [
          {
            text: t.choice1,
            nextStepIndex: 1,
            effects: t.effects1 as any,
            resultText: t.result1
          },
          {
            text: t.choice2,
            nextStepIndex: 2,
            effects: t.effects2 as any,
            resultText: t.result2
          }
        ]
      },
      {
        speaker: npcName,
        text: `"${npcName} 학생은 고개를 숙인 채 조용히 교실로 돌아갑니다. 단호한 가이드를 통해 문제 해결 능력을 기르게 되었습니다."`
      },
      {
        speaker: npcName,
        text: `"${npcName} 학생은 비로소 얼굴에 밝은 미소를 띠며 고마워합니다. 선생님의 따뜻한 품에서 자존감이 살아납니다."`
      }
    ]
  };
});
