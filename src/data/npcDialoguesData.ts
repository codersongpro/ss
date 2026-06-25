import type { DialogueStep } from '@/game/types';

export interface DialogueEvent {
  id: string;
  title: string;
  generateSteps: (npcName: string, role?: string) => DialogueStep[];
}

// ==========================================
// [1] 교직원용 랜덤 대화 이벤트 150선
// ==========================================
export const colleagueDialogueEvents: DialogueEvent[] = Array.from({ length: 150 }, (_, index) => {
  const eventId = `colleague_evt_${String(index + 1).padStart(3, '0')}`;
  
  // 관리자군 및 주요 시나리오 테마 목록 (우선순위 수동 배정용)
  const themes = [
    {
      title: "교육과정 계획서 정정 요구",
      situation: "새 학년 교육과정 계획서를 상신했는데, 기재 서식이 예년과 다르다며 교감 선생님이 수정을 요구해 왔습니다.",
      choice1: "교감 선생님의 지적을 수용하여 밤을 새워서라도 서식을 완벽하게 통일해 재기결한다.",
      effects1: [{ stat: 'adminTrust', value: 8 }, { stat: 'burnout', value: 8 }, { stat: 'mental', value: -4 }],
      result1: "행정의 규격화에 적극 순응하여 결재 라인의 신임과 행정력을 다졌으나, 밤샘 작업으로 멘탈과 몸이 상당히 지쳤습니다.",
      choice2: "교육청 지침서의 표준 자율 서식 조항을 정중히 예로 들며 기존 보고서의 유지를 설득한다.",
      effects2: [{ stat: 'educationSoshin', value: 10 }, { stat: 'adminTrust', value: -3 }, { stat: 'mental', value: 2 }],
      result2: "교사 본연의 문서 작성 자율권을 지켜내며 교육 소신을 지켰으나, 행정부와의 보이지 않는 기싸움으로 피로가 약간 쌓였습니다.",
      choice3: "동료 부장 교사에게 서식 수정에 대한 자문을 구하고, 공용 서식 템플릿을 얻어 대강 정돈해 빠르게 타협한다.",
      effects3: [{ stat: 'colleagueRelation', value: 6 }, { stat: 'burnout', value: 2 }, { stat: 'adminTrust', value: 2 }],
      result3: "동료들의 노하우를 빌려 피로를 최소화하며 빠르게 업무 타협안을 상신해 통과시켰습니다.",
      choice4: "일단 결재를 보류하고, 다른 학급 선생님들의 의견을 취합하여 공동 성명 형태로 이의 제기를 논의한다.",
      effects4: [{ stat: 'colleagueSolidarity', value: 8 }, { stat: 'adminTrust', value: -4 }, { stat: 'hp', value: -2 }],
      result4: "학년의 일치된 목소리를 유도하여 동료 연대감을 높였으나, 결재권자인 교감 선생님의 은근한 주의를 끌게 되었습니다.",
      choice5: "교육청 소속 장학사에게 직접 서면 질의를 보내 규정 해석의 공식 가이드를 회신받아 제출한다.",
      effects5: [{ stat: 'expert', value: 8 }, { stat: 'adminTrust', value: 6 }, { stat: 'burnout', value: 4 }],
      result5: "공식 유권 해석을 통해 누구도 반박할 수 없는 전문적 기결 근거를 확보하며 규정을 사수했습니다."
    },
    {
      title: "학폭 의심 사안의 임의 중재",
      situation: "반 아이들 간 사소한 다툼이 학폭으로 비화할 조짐이 보이자, 부장 선생님이 학교 명예를 위해 조용히 덮자고 조언합니다.",
      choice1: "부장님의 풍부한 실무 경력을 믿고, 학부모들을 중간에서 달래며 비공식적 중재로 봉합한다.",
      effects1: [{ stat: 'colleagueRelation', value: 8 }, { stat: 'parentComplaint', value: 5 }, { stat: 'expert', value: -4 }],
      result1: "선배 교사의 권위를 존중해 교직원 관계를 다졌으나, 학폭법 미준수로 추후 민원 및 행정 감사 리스크가 소폭 증가했습니다.",
      choice2: "매뉴얼대로 즉시 학교폭력 전담 기구에 사안 보고서를 제출하여 정식 공론화 처리를 진행한다.",
      effects2: [{ stat: 'educationSoshin', value: 12 }, { stat: 'colleagueRelation', value: -4 }, { stat: 'adminTrust', value: 4 }],
      result2: "절차적 공정성을 지키고 법적 보호막을 확보하며 소신을 드높였으나, 일을 크게 만든다며 부장님은 섭섭한 기색을 내비칩니다.",
      choice3: "전문 상담 기관(Wee클래스)에 일차 상담을 이관 조치하고, 당사자들의 공식 의사를 며칠 더 지켜보기로 끈기를 발휘한다.",
      effects3: [{ stat: 'expert', value: 6 }, { stat: 'mental', value: 4 }, { stat: 'colleagueRelation', value: 2 }],
      result3: "책임을 전문 부서와 정석 분할하여 내 멘탈과 안정을 사수하고 합리적인 중재 시간을 확보했습니다.",
      choice4: "내가 직접 개입하지 않고 양가 부모에게 직접 연락해 학교 밖 카페에서 당사자들끼리 합의하도록 방조 조치한다.",
      effects4: [{ stat: 'hp', value: 6 }, { stat: 'burnout', value: -4 }, { stat: 'studentTrust', value: -6 }],
      result4: "내 몸과 스트레스는 피했으나, 담임 교사의 무관심한 회피 태도에 제자들은 깊은 서운함을 느꼈습니다.",
      choice5: "교육청 학교폭력 전담 지원 센터에 익명으로 법률 해석을 신청하여, 책임 면제 조항의 정합성을 컨설팅받는다.",
      effects5: [{ stat: 'expert', value: 10 }, { stat: 'adminTrust', value: 6 }, { stat: 'burnout', value: 3 }],
      result5: "법률 전문가의 코칭을 확보하여 차후 발생할 모든 책임 소지를 완벽하게 예방하는 전문성을 과시했습니다."
    },
    {
      title: "교장선생님의 억지 티타임",
      situation: "교장실에서 담임 교사들을 긴급 호출하여 교육 혁신에 대한 장황한 연설과 함께 직접 탄 대추차를 함께하자고 제안하십니다.",
      choice1: "교장 선생님의 교육 철학에 적극 맞장구를 치고 수첩에 경청하는 태도를 보이며 1시간을 꽉 채운다.",
      effects1: [{ stat: 'adminTrust', value: 10 }, { stat: 'burnout', value: 8 }, { stat: 'mental', value: -6 }],
      result1: "관리자 신임을 듬뿍 얻어 평탄한 근무 평가를 약속받았으나, 영혼 없는 맞장구로 멘탈이 크게 고갈되었습니다.",
      choice2: "5교시 수업 보충 자료를 긴급하게 인쇄하여 학급에 들어가야 한다는 사정을 정중히 조율하고 15분 만에 먼저 실례한다.",
      effects2: [{ stat: 'expert', value: 6 }, { stat: 'adminTrust', value: -4 }, { stat: 'mental', value: 3 }],
      result2: "수업 준비 시간을 온전히 사수하며 전문성을 수호했으나, 교장 선생님의 은근한 시선과 권위에 금이 갔습니다.",
      choice3: "자리를 지키되 스마트폰 알람 타이머를 30분 뒤로 맞춰 놓고 교무 메신저가 온 척 다급한 업무 처리를 핑계 대며 적당히 빠진다.",
      effects3: [{ stat: 'adminPower', value: 6 }, { stat: 'mental', value: 2 }, { stat: 'adminTrust', value: 1 }],
      result3: "재빠른 행정 잔기술로 명분을 사수하면서 스트레스를 최소화하며 중간 타협을 완수했습니다.",
      choice4: "교장실 대추차 마시기 자리에 아예 동료 교사들과 다 함께 몰려가서 개인 하소연과 급식 민원 토론회로 화제를 돌린다.",
      effects4: [{ stat: 'colleagueSolidarity', value: 8 }, { stat: 'adminTrust', value: -2 }, { stat: 'mental', value: 1 }],
      result4: "동료 교사들의 참여를 유도해 지루한 훈시를 공동체 토론으로 희석하며 개인의 정신적 피로도를 아꼈습니다.",
      choice5: "교장 선생님의 교육관을 학급 교육과정 혁신 모형으로 보고서화하여 결재 라인에 탑재하고 공식 컨설팅을 요청한다.",
      effects5: [{ stat: 'expert', value: 8 }, { stat: 'adminTrust', value: 8 }, { stat: 'burnout', value: 4 }],
      result5: "장황한 연설을 공식 교육 정책 보고서로 승화시켜 관리자 신임과 기획 능력을 다졌습니다."
    }
  ];

  const defaultTheme = {
    title: `학교 행정 및 교직 조율 (${index + 1})`,
    situation: `교무실 및 행정실에서 조율 요청이 온 [번호: ${index + 1}] 교직 관련 협조 사항입니다. 어떻게 대처하시겠습니까?`,
    choice1: "공식 매뉴얼과 절차 규정을 100% 준수하여 정석으로 보고서를 기결하고 승인을 진행한다.",
    effects1: [{ stat: 'adminPower', value: 8 }, { stat: 'adminTrust', value: 6 }, { stat: 'hp', value: -4 }, { stat: 'burnout', value: 6 }],
    result1: "철저한 기결 처리로 행정 규율을 완수하고 행정력을 널리 인정받았으나 피로가 가중되었습니다.",
    choice2: "동료 교사들의 고충과 사정을 감안해 유연하고 정서적인 양보를 전격 결정한다.",
    effects2: [{ stat: 'colleagueRelation', value: 8 }, { stat: 'colleagueSolidarity', value: 6 }, { stat: 'hp', value: -4 }],
    result2: "동료들의 사정을 수용하여 두터운 정서적 신뢰와 인간관계를 회복했습니다.",
    choice3: "학년 공동 회의에 부쳐 공평한 업무 분담표를 새로 작성하고 합리적 조율을 이끌어낸다.",
    effects3: [{ stat: 'colleagueSolidarity', value: 10 }, { stat: 'colleagueRelation', value: 4 }, { stat: 'mental', value: -2 }],
    result3: "합리적인 연대와 조율을 통해 공동체의 평화와 분담률을 최적화시켰습니다.",
    choice4: "이번 안건은 교무부서의 공식 결정에 전적으로 맡기고, 개인 일과 수호와 건강 보호를 위해 뒤로 빠진다.",
    effects4: [{ stat: 'hp', value: 6 }, { stat: 'burnout', value: -4 }, { stat: 'colleagueRelation', value: -3 }],
    result4: "불필요한 갈등에서 거리를 둠으로써 개인의 체력과 번아웃을 지켜냈으나, 다소 개인주의적이라는 평가를 받습니다.",
    choice5: "교육청 학교 자치 컨설팅 부서에 공식 정비 요청을 보내, 상부의 공식 지침 지도를 수령해 대응한다.",
    effects5: [{ stat: 'expert', value: 8 }, { stat: 'adminTrust', value: 6 }, { stat: 'burnout', value: 2 }],
    result5: "장학사 공식 피드백을 활용하여 누구도 마찰을 빚을 수 없는 상부 공식 가이드를 탑재했습니다."
  };

  // 교직 업무 풀 150종 (100종 추가 증설)
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
    "흡연 예방 교육 사업 계획서", "양성 평등 글짓기 시상 기준", "학교 텃밭 가꾸기 호스 분배", "교원 힐링 직무 연수 참여",
    "급식 모니터링 학부모 섭외", "교재 교구 구입 품의 요청", "학년실 무선 청소기 충전 관리", "학교 폭력 실태조사 입력 독려",
    "학교 정화 구역 유해 시설 점검", "교육 통계 연보 취합 보고", "교원 동아리 활동 보고서 작성", "나이스 학생 사진 일제 업로드",
    "교사용 PC 윈도우 일제 업데이트", "학년 협의회 회의록 간사 수락",
    "학교 안전 대피 훈련 시나리오 검토", "교직원 심폐소생술 의무 교육 일정 조율", "교육복지 대상 학생 지원금 품의", "신임 교사 멘토링 연수 보고서 상신",
    "교무실 유선 전화기 정비 협조", "동료 교사 공개 수업 참관 일정표 조정", "교외 체험학습 학생 수송 버스 계약 검토", "학교 예산 참여제 의견 수렴 취합",
    "학부모 공개 수업 참관록 수집 분석", "교내 에너지 절약 실천 점검부 작성", "방과후 프로그램 위탁 강사 추가 모집 공고", "인공지능 선도학교 현판식 행사 준비",
    "교실 칠판 노후화 교체 수량 파악", "학급 환경 정화 구역 유해 매체물 순찰", "학교 체육 비품 노후화 폐기 신청 대조", "교원 자율 연수 경비 영수증 증빙 정산",
    "교외 미세먼지 심화 시 야외 수업 대체 가이드", "학년말 교실 이사 공간 배치 분담 조율", "학교 폭력 예방 캠페인 피켓 제작 수배", "교사 연구회 학술 심포지엄 포스터 인쇄",
    
    // 추가 신규 교직 행정 및 대화 갈등 업무 80종 시작 [NEW]
    "교실 온풍기 필터 청소 업자 대조 서명", "영어 교실 원어민 교사 재계약 근무 평가서", "나이스 학생 출결 기재 정합성 교감 결재", "학예회 무대 배경 현수막 디자인 심의",
    "교직원 상조회 연말 결산 영수증 검수", "학교 홈페이지 개인정보 누출 방지 일제 진단", "학부모 총회용 학급 소개 유인물 복사", "교무실 캐비닛 보안 열쇠 보관 대장 인계",
    "교내 텃밭 퇴비 분량 수령 배분 대장", "양성평등 백일장 은상 수상자 생활기록부 기재", "동아리 외부 심사 위원 프로필 서면 결재", "학교 급식 배식 보조 인력 고용 계약 검토",
    "보건실 구급용 밴드 및 소독제 조달 품의", "과학 실험실 약품 안전 보관 가이드라인 배포", "체육 교구 배드민턴 라켓 네트 교체 기안", "연구 부장 연말 성과 공정 분배 공고문",
    "교장 공로패 추천 후보자 동료 교사 연명", "학급 교실 창문 잠금 고리 노후 교체 수요", "소방 안전 합동 훈련 소방서 연락 대조", "독서 주간 권장 도서 목록 도서실 심의",
    "디지털 교과서 태블릿 비밀번호 전수 리셋", "교문 교통 지도 깃발 및 안전 조끼 재고 파악", "교직원 주말 산행 동호회 차량 배정 조율", "늘봄학교 다과류 영수증 지출 증빙",
    "나이스 교직원 비밀번호 분기 정기 만료 갱신", "미술실 아동 물감 세척 개수대 수리 의뢰", "교무실 행정 복사기 정기 리스 갱신 날인", "교직원 식당 퇴식구 청결 안내문 부착",
    "체육관 무대 조명 컨트롤러 기기 AS 접수", "가족 동반 여행 신청서 출석 인정 한도 심의", "연구학교 보고회 발표 ppt 검토 및 인쇄", "학교 화단 잡초 제거용 호미 보급 관리",
    "교내 응급 환자 이송 대책 차량 배정 공문", "학교운영위원회 위원 소집 통지서 발송", "방과후 특강 강사 결근 대강 보강비 청구", "과학실 환풍기 작동 모터 수리 품의서",
    "교내 우유 급식 미신청자 명단 최종 대조", "학교 홈페이지 서버 정기 점검 알림 팝업", "교직원 소방 심폐소생술 마네킹 조달 협조", "학년실 무선 청소기 흡입 필터 먼지 제거",
    "학폭 피조사 학생 가가호호 연락 대기 유선", "교감 표창 포상 후보 동료 교사 심사표", "교내 환경 정화 구역 내 담배 꽁초 수거 분담", "영어 도서실 보조 인력 출근부 대조 서명",
    "학교 텃밭 가을 무 모종 구입 영수증 기결", "동아리 자율 예산 카드 정산 확인 날인", "나이스 학생 수상 내역 이중 입력 전수 검사", "교내 과학 창의 축전 부스 배치표 정비",
    "교무실 유선 전화기 다이얼 버튼 노후 고장", "동료 교사 공개 수업 참관 일정 엑셀 정리", "교외 체험학습 수송 관광 버스 연식 대조", "학교 예산 참여제 학부모 건의 의견 분류",
    "학부모 공개 수업 대기실 다과 세팅 의뢰", "교내 소방 교육 시청각 자료 파일 업로드", "학생 지각계 증빙서 진단서 누락 확인 전송", "체육실 뜀틀 안전 패드 매트 고정 끈 수리",
    "교장 주재 회의 교감 훈시 안건 초안 보고", "전교 자치회 선거용 투표함 먼지 털기 대행", "학교 시설 이용 학부모 릴레이 민원 분석", "과학교구 세입세출 예산 차액 검증 대조",
    "교직원 주차 딱지 미부착 차주 전원 문자", "학교 정화조 방역 소독 완료 확인 서명", "교내 안전 관리 대책 포털 정기 공지 확인", "학교 폭력 예방 캠페인 피켓 인쇄 수배",
    "교실 암막 커튼 전수 먼지 털이 분담 조율", "체육 강사 채용 공고문 서식 나이스 탑재", "수업 보강 강사 수당 입금 확인 및 조치", "학교 예산 변경 공고 교육 포털 탑재 결재",
    "교사 포럼 세미나실 무료 사용 협조 날인", "학교 앞 신호등 고장 구청 도로 교통과 이관", "자율 동아리 최종 성과 리플렛 문구 대조", "늘봄학교 다과류 납품 수량 정산 품의 기안",
    "학생 생활 기록부 나이스 마감 정합성 대조", "스승의 날 카네이션 수수 청탁금지법 공지", "교내 위생 해충 방역 공사 일정표 교감 결재", "교사용 연구 도서 신청 대장 서 서명",
    "학교 보안 서약서 미제출 교사 연락 대조", "교내 소방 기재 작동 여부 전수 점검 날인", "학생 결석계 증빙서 미비자 보완 요구 연락", "체육실 매트 보관대 바퀴 균열 보수 신청"
  ];

  const t = themes[index] || {
    title: schoolTasks[index - 3] ? `${schoolTasks[index - 3]} 조율` : defaultTheme.title,
    situation: schoolTasks[index - 3]
      ? `"${schoolTasks[index - 3]}"에 관한 긴급 협조 및 결재 처리가 다가왔습니다. 행정실이나 동료 부서 간에 협조 서명 기한을 두고 보이지 않는 미묘한 갈등이 존재합니다.`
      : defaultTheme.situation,
    choice1: defaultTheme.choice1,
    effects1: defaultTheme.effects1,
    result1: defaultTheme.result1,
    choice2: defaultTheme.choice2,
    effects2: defaultTheme.effects2,
    result2: defaultTheme.result2,
    choice3: defaultTheme.choice3,
    effects3: defaultTheme.effects3,
    result3: defaultTheme.result3,
    choice4: defaultTheme.choice4,
    effects4: defaultTheme.effects4,
    result4: defaultTheme.result4,
    choice5: defaultTheme.choice5,
    effects5: defaultTheme.effects5,
    result5: defaultTheme.result5
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
          },
          {
            text: t.choice3,
            nextStepIndex: 3,
            effects: t.effects3 as any,
            resultText: t.result3
          },
          {
            text: t.choice4,
            nextStepIndex: 4,
            effects: t.effects4 as any,
            resultText: t.result4
          },
          {
            text: t.choice5,
            nextStepIndex: 5,
            effects: t.effects5 as any,
            resultText: t.result5
          }
        ]
      },
      {
        speaker: npcName,
        text: `"${npcName} 교사는 당신의 단호하고 원칙적인 태도에 고개를 끄덕이며 회의를 원활하게 마무리 지었습니다."`
      },
      {
        speaker: npcName,
        text: `"${npcName} 교사는 당신의 정서적이고 유연한 공조에 크게 안심하며, 덕분에 든든한 동료애를 느꼈다며 기뻐합니다."`
      },
      {
        speaker: npcName,
        text: `"${npcName} 교사는 당신이 제시한 학년 공동 합리 분담표에 감탄하며, 앞으로도 이 체계대로 함께하겠다고 서명해 줍니다."`
      },
      {
        speaker: npcName,
        text: `"${npcName} 교사는 당신이 한 발 뒤로 물러서서 관망하는 태도를 취하자 약간 씁쓸해하면서도, 어쩔 수 없다는 듯 스스로 해결하기 위해 돌아섰습니다."`
      },
      {
        speaker: npcName,
        text: `"${npcName} 교사는 교육청 공식 컨설팅 결과 지침서의 엄격한 조항을 확인하고는, 이견 없이 깔끔하게 수긍하며 기안을 즉시 결재했습니다."`
      }
    ]
  };
});

// ==========================================
// [2] 학생용 랜덤 대화 이벤트 150선
// ==========================================
export const studentDialogueEvents: DialogueEvent[] = Array.from({ length: 150 }, (_, index) => {
  const eventId = `student_evt_${String(index + 1).padStart(3, '0')}`;

  const themes = [
    {
      title: "AI 수행평가 대필 의혹 고백",
      situation: "수행평가로 제출한 글쓰기 과제가 생성형 AI로 대필한 흔적이 뚜렷해 묻자, 아이가 눈물을 흘리며 사실을 털어놓습니다.",
      choice1: "평가 공정성 원칙에 따라 수행평가 규정을 엄격히 적용해 0점 처리하고 재시험 기회를 차단한다.",
      effects1: [{ stat: 'educationSoshin', value: 12 }, { stat: 'studentTrust', value: -4 }, { stat: 'expert', value: 4 }],
      result1: "엄격한 공정성 교육으로 타 학생들과의 형평성을 사수하고 기율을 확립했으나, 고백한 학생은 마음의 문을 닫아 신뢰가 깎였습니다.",
      choice2: "고백한 정직함을 참작하여, 최하점을 부여하되 방과 후에 스스로 다시 써 오면 기본 점수를 상향 조정해주기로 한다.",
      effects2: [{ stat: 'studentTrust', value: 10 }, { stat: 'educationSoshin', value: -3 }, { stat: 'mental', value: -2 }],
      result2: "용기를 내어 진실을 털어놓은 아이의 성장을 따뜻하게 격려하고 강한 신뢰를 회복했으나, 다소 교육적 소신에는 금이 갔습니다.",
      choice3: "오늘 방과 후에 학부모와 유선 상담하여 가정에서 AI 윤리에 대해 대화하고 스스로 고쳐 쓰도록 연계 지도를 약속받는다.",
      effects3: [{ stat: 'parentTrust', value: 8 }, { stat: 'studentTrust', value: 4 }, { stat: 'mental', value: -2 }],
      result3: "학부모에게 아이의 학업 지도를 협력 요청하여 신뢰 관계를 다지고 가정 연대 지도를 일구어 냈습니다.",
      choice4: "학급 아이들 전체에게 익명 사례로 공표하여, '생성형 인공지능과 학문적 정직성'에 관한 학급 자치 자율 규칙을 토론해 제정한다.",
      effects4: [{ stat: 'classManagement', value: 10 }, { stat: 'studentTrust', value: 4 }, { stat: 'burnout', value: 2 }],
      result4: "학급 자치 회의를 기화로 학생들 스스로 평가 규범을 만들게 조율하여 학급 운영 능력을 돋보이게 다졌습니다.",
      choice5: "학교 정보 전문 부장님 및 교내 인공지능 선도 교사에게 의뢰하여, 표절 검증 솔루션을 통한 객관적 피드백 세션으로 이송 처리한다.",
      effects5: [{ stat: 'expert', value: 10 }, { stat: 'adminTrust', value: 6 }, { stat: 'mental', value: 2 }],
      result5: "교내 전문 교사 지원 망을 구축해 과학적인 표절 방지 기법 컨설팅을 도입하여 사안을 매끄럽게 처리했습니다."
    },
    {
      title: "교실 은따 방치 위기 중재",
      situation: "반 아이들 몇 명이 단체 카톡방에서 특정 한 명을 초대하고 조롱하거나 내쫓는 '카톡 감옥'을 주도한 정황을 포착했습니다.",
      choice1: "학교 폭력 예방 매뉴얼에 따라 가해 학생 전원의 스마트폰을 임시 수거하고 부모 소환 면담 조치로 단호히 처벌한다.",
      effects1: [{ stat: 'educationSoshin', value: 10 }, { stat: 'parentComplaint', value: 10 }, { stat: 'studentTrust', value: 4 }],
      result1: "강력한 생활 지도로 교내 학폭 범죄 기조에 엄격히 대처했으나, 가해측 학부모들의 단체 항의와 민원이 빗발칠 예정입니다.",
      choice2: "방과 후에 당사자 학생들을 모두 Wee클래스에 의뢰하고 역할극 등의 집단 상담 치료를 통해 교우 관계를 중재한다.",
      effects2: [{ stat: 'studentTrust', value: 8 }, { stat: 'mental', value: -4 }, { stat: 'expert', value: 8 }],
      result2: "Wee클래스와 연계한 전문적 집단 상담 솔루션을 적용해 장기적인 교우 관계 복원에 집중했습니다. 단, 집중 조율을 위해 에너지가 크게 쓰였습니다.",
      choice3: "가해 학생 부모들에게 즉시 상황의 심각성을 설명하는 전화를 걸어, 가가호호 스마트폰 사용 시간 제어 및 가정 연계 지도를 촉구한다.",
      effects3: [{ stat: 'parentTrust', value: 8 }, { stat: 'studentTrust', value: 2 }, { stat: 'mental', value: -3 }],
      result3: "부모들에게 사실을 명확히 전달하여 사건의 가해를 원천 차단하는 신속한 학부모 연대 대책을 취했습니다.",
      choice4: "학급 회의 시간표를 활용해 '우리가 만드는 사이버 폭력 없는 단톡방 약속'을 자발적으로 제정하여 학급 자치 서약을 맺게 한다.",
      effects4: [{ stat: 'classManagement', value: 12 }, { stat: 'studentTrust', value: 6 }, { stat: 'adminPower', value: -2 }],
      result4: "학급 공동체의 자율적 정화 역량을 활용해 자치 기풍을 진작시켰으나, 일부 개별 행동 교정에는 다소 시간이 걸립니다.",
      choice5: "학교 전담 경찰관(SPO)에게 의뢰하여 다음 주 아침 조회 시간에 교실로 직접 방문해 사이버 학폭 특별 예방 훈련 특강을 진행하게 이송한다.",
      effects5: [{ stat: 'expert', value: 10 }, { stat: 'adminTrust', value: 8 }, { stat: 'mental', value: 3 }],
      result5: "공식 경찰 인프라를 활용하여 누구도 반발할 수 없는 강한 법적 경고와 공식 예방 지도를 완수했습니다."
    },
    {
      title: "스마트폰 소지 제한 반항",
      situation: "수업 중 몰래 모바일 게임을 하다가 적발되어 스마트폰을 교단 보관함에 반납하라고 지시하자, 학생이 화를 내며 책상을 칩니다.",
      choice1: "교실 기강 수호를 위해 즉시 학생부장 및 교감선생님께 긴급 지원 협조를 청구해 격리 지도 조치한다.",
      effects1: [{ stat: 'adminTrust', value: 6 }, { stat: 'educationSoshin', value: 8 }, { stat: 'studentTrust', value: -6 }],
      result1: "공식 기결 라인에 연계해 교실 내 교권을 보호하고 규칙을 엄수했으나, 담임 교사로서 학생과의 단절감은 극에 달했습니다.",
      choice2: "화를 누르고 학생을 복도로 따로 불러 1:1 면담을 통해 화가 난 심정을 듣고, 수업 종료 후 자발적 제출을 조율한다.",
      effects2: [{ stat: 'studentTrust', value: 10 }, { stat: 'mental', value: -4 }, { stat: 'hp', value: -4 }],
      result2: "학생의 일시적 분노 표출 이면의 감정을 차분히 청취하여 극적인 유대와 신뢰를 복원했으나, 멘탈과 에너지가 탈탈 털렸습니다.",
      choice3: "학부모에게 오늘 오후 수업 중 발생한 행동 반항 사건을 유선 전화로 설명하고, 가정에서 규칙 수용 교육을 부탁한다.",
      effects3: [{ stat: 'parentTrust', value: 8 }, { stat: 'studentTrust', value: 2 }, { stat: 'mental', value: -2 }],
      result3: "학부모와의 가정 연대 전화를 통해 부담을 덜고 깔끔하게 원칙 제어를 진행했습니다.",
      choice4: "학급 전체 자치 토론 안건으로 '수업 시간 방해 행동 대처 벌칙 규칙'을 상정해 아이들 스스로 반항 행동의 제재안을 정하게 유도한다.",
      effects4: [{ stat: 'classManagement', value: 10 }, { stat: 'studentTrust', value: 4 }, { stat: 'adminPower', value: -2 }],
      result4: "학급 자치 규칙에 힘입어 교사 개인의 감정 소모 없이 학급 운영 가이드를 확립했습니다.",
      choice5: "학교 상담 전문 Wee클래스에 학생을 '분노 조절 장애 및 규칙 거부'로 일차 상담 인계 이송하여 위탁 치료를 개시한다.",
      effects5: [{ stat: 'expert', value: 8 }, { stat: 'adminTrust', value: 6 }, { stat: 'mental', value: 4 }],
      result5: "교내 전문 상담 센터에 사건 지도를 이송해 교사의 멘탈 방어와 객관적인 솔루션 배정을 완료했습니다."
    }
  ];

  const defaultTheme = {
    title: `학급 아동 개별 지도 (${index + 1})`,
    situation: `학급 내 [번호: ${index + 1}] 아동이 교탁 앞으로 다가와 최근 학업 고민이나 친구 관계, 학교 규칙 위반에 대해 털어놓기 시작합니다.`,
    choice1: "학교의 합리적 규칙 and 훈육 가이드에 근거해 단호하고 객관적인 원칙주의 지도를 부과한다.",
    effects1: [{ stat: 'expert', value: 6 }, { stat: 'educationSoshin', value: 6 }, { stat: 'mental', value: -2 }],
    result1: "전문적인 학업 및 행동 원칙을 지도해 교사 소신과 전문 역량을 다잡았습니다.",
    choice2: "아이의 눈을 맞추며 정서적 감정에 공감하고, 규칙 적용 대신 정서적 지지와 격려를 최우선으로 돌려준다.",
    effects2: [{ stat: 'studentTrust', value: 8 }, { stat: 'hp', value: -2 }, { stat: 'burnout', value: 2 }],
    result2: "아이와의 정서적 끈을 굳히고 깊은 학생 신뢰를 확보했습니다.",
    choice3: "일단 아이를 안심시키고, 방과 후에 학부모와 유선 연계하여 가정 내 스트레스 환경 상담을 진행한다.",
    effects3: [{ stat: 'parentTrust', value: 8 }, { stat: 'studentTrust', value: 2 }, { stat: 'mental', value: -3 }],
    result3: "학부모와의 긴밀한 연대를 다져 정교한 입체 지도를 약조받고 학부모 만족을 높였습니다.",
    choice4: "학급 회의 안건으로 상정하여, 아이들 간에 자발적으로 도우미 또래 상담 프렌즈를 구성해주기로 유도한다.",
    effects4: [{ stat: 'classManagement', value: 8 }, { stat: 'studentTrust', value: 4 }, { stat: 'adminPower', value: -2 }],
    result4: "학생들 스스로 자치 우애 협약을 유도해 학급 장벽을 낮추고 평화 분위기를 마련했습니다.",
    choice5: "Wee클래스 아동 전문 심리 분석 서비스에 이송 신청서를 정식 작성하여 전문적인 면담 컨설팅을 연계한다.",
    effects5: [{ stat: 'expert', value: 8 }, { stat: 'adminTrust', value: 6 }, { stat: 'mental', value: 3 }],
    result5: "학교 공식 치료 네트워크로 지도를 연동하여 교사의 직접 고갈 없이 사안의 대안 솔루션을 획득했습니다."
  };

  // 학생 이슈 풀 150종 (100종 추가 증설)
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
    "쉬는 시간 과격한 레슬링 장난", "수행평가 점수 소수점 이의 신청", "동아리 반장 권력 독점 갈등", "교실 내 부적절 욕설 스티커 부착",
    "자율 동아리 시간 뒷담화 상처 상담", "일기장에 적힌 친구의 험담 문구 발견", "체육관 농구대 선점 시비 갈등", "수업 시간 턱 괴고 낙서하는 집중력 결여",
    "화장실 내 부적절한 낙서 제보 자백", "숙제 노트를 베끼다 적발된 정직성 시비", "부모님 맞벌이로 인한 정서적 고독 토로", "미술 수업 재료 독점 욕심 갈등",
    "학급 단체 카톡방 탈퇴 거부 괴롭힘", "청소 용구함 무단 잠금 장난 자백", "친구의 사적인 비밀 누설 의혹 폭로", "교복 자율화 복장 규정 위반 적발 지적",
    "쉬는 시간 책상 밑 기어 들어가기 기행", "학예회 무대 공포증으로 인한 독창 기피", "친구와의 교환 일기 유출 갈등", "급식 반찬 편법 교환 및 독점 장난",
    "시험 직전 샤프심 무단 대여 갈등", "가정 내 스마트 기기 과사용 통제 호소", "자신의 외모에 대한 급격한 자존감 하락", "모둠 리더의 일방적 의사결정 소외 불만",
    
    // 추가 신규 학생 교우/진로/학업 딜레마 고민 80종 시작 [NEW]
    "짝꿍의 연필 쾅쾅 내리찍는 소음 스트레스", "교실 창가 자리 일조량 눈부심 자리 이동 요구", "우유 급식 몰래 우유팩 터뜨리기 장난 자백", "모둠 과학 과제 무임승차 조원 제외 요구",
    "가방에 꽂아둔 인형 도난 의심 하소연", "체육 계주 꼴찌 후 조원들의 은근한 타박 상처", "시험 범위 누락하여 공부 못했다는 핑계 불만", "점심 시간 축구 경기 중 태클 시비 말다툼",
    "영어 단어 재시험 대상자 낙인감 자괴감", "학원 시간 겹쳐 청소 안 하고 도망간 친구 폭로", "교실 온풍기 직접 온도 조작 장난 적발", "받아쓰기 오답 빨간 줄 낙서 자존심 상함",
    "친구의 사생활 일기장 무단 열람 유포 갈등", "모둠 활동 리더 권력 독점 조원 소외 갈등", "등교 시 가져온 모형 장난감 총 압수 반발", "급식 돈가스 크기 다른 조원 편애 의혹 서운함",
    "다이어리 꾸미기 희귀 스티커 무단 도난 의심", "체육대회 반티 색상 선정 분열 갈등", "수행평가 제출 마감 기한 경과 감점 구제 호소", "교과서 필기 안 하고 멍하니 창밖 보기 집중력",
    "동아리 반장 선출 1표 차 낙선 후 우울감", "유튜브 쇼츠 챌린지 댄스 촬영 아동 초상권", "자신의 외모 콤플렉스 단톡방 조롱 상처", "부모님 맞벌이로 인한 저녁 시간 외로움",
    "독서 골든벨 도서 대출 연체 대출 정지 불만", "체육 피구 공 피하기 꾀병 보건실 출입 의심", "수학 시험 서술형 부분 점수 소수점 이의 신청", "동아리 부스 안전 요원 강제 차출 힘듦",
    "친구들의 과제 무단 대필 요구 거절 고민", "체육관 농구장 사용 코트 점유 싸움 중재", "학예회 주인공 배역 오디션 낙방 후 들러리감", "학급 청소 시간 화장실 빗자루 칼싸움 장난",
    "교실 온풍기 온도로 인한 안구 건조 피부 각질", "짝꿍과의 비밀 교환일기 부모 유출 갈등", "방과후 수업 숙제 과다 피로 아침 조회 수면", "모둠 과제 결과물 친구의 무단 훼손 갈등",
    "급식 반찬 특정 아동 편애 배식 불만 토로", "교무실 앞 복도 전력 질주 교감 선생님 지적", "체육대회 달리기 등수 공개제 수치심 상담", "유튜브 촬영용 불법 완구 교실 무단 반입 적발",
    "전교 학생회 선거용 피켓 문구 경쟁 갈등", "교실 뒤 게시판 그림 배치 구석 자리 소외감", "짝꿍의 잦은 콧소리 재채기 소음 스트레스", "쉬는 시간 책상 밑 기어 들어가기 기행 반복",
    "영어 교실 원어민 교사 질문에 대한 극심한 공포", "급식 오이 편식 오이 향 구역질 하소연", "학예회 댄스 대열 센터 배역 독점 시비 갈등", "체육 시간 스펀지 피구 공 얼굴 경미 상해",
    "시험 직전 샤프심 무단 대여 후 미반납 갈등", "부모님의 학원 뺑뺑이 강요 공부 탈진 번아웃", "가출한 단짝 친구의 야간 편의점 배회 비밀 폭로", "생기부 소극적 성격 기재 우려 수정 부탁",
    "모둠 토론 중 자기 의견 묵살당한 눈물 호소", "과학 실험 비커 깨뜨리고 숨겼던 죄책감 자백", "체육 시간 무더위 운동장 조회 중 일사병 어지러움", "교실 화단 토마토 화분 물 안 줘서 고사 상처",
    "영어 단어 시험 범위 100개 스트레스 탈모 걱정", "짝꿍의 연필 쥔 손가락 힘 조절 못해 학습지 찢음", "친구의 부모님 직업 비하 험담 귓속말 상처", "청소 시간 물총 장난으로 복도 바닥 침수 장난",
    "학습지 밀린 숙제 면제 요구 떼쓰기 반항", "교내 정보 보안 정기 만료 인증서 재발급 귀찮음", "체육실 뜀틀 뛰기 공포증 안전 패드 신뢰도", "자율 동아리 최종 결과 보고서 기획 분담 갈등",
    "급식 배식 당번 국물 흘림 시비 다툼 중재", "교사용 PC 윈도우 정기 업데이트 중 게임 불가 불만", "체육 교구 배드민턴 채 파손 은폐 은근 슬쩍 반납", "나이스 학생 사진 초등학교 시절 사진 촌스러움",
    "교문 지도 중 교권 침해 비속어 혼잣말 적발", "과학실 환기 불량 두통 호소 보건실 조기 퇴실", "단군 신화 단원 특정 종교 미신 배제 요구 자습", "체육대회 이어달리기 꼴찌 후 주자 비난 갈등",
    "받아쓰기 20점 시험지 부모 서명 서류 위조 자백", "가족 동반 체험학습 기한 초과 미인정 결석 서글픔", "교실 블라인드 끈 잡아당겨 고장 낸 은폐 자백", "학부모 공개수업 부모 불참으로 인한 소외감",
    "쉬는 시간 과격한 레슬링 암바 장난 타박상", "모둠 과제 준비물 미지참 조원 탓 미루기 갈등", "자신의 성적이 스마트폰 과사용 탓이라는 한탄", "교실 화분 흙 뒤엎어 바닥 더럽힌 장난 자백"
  ];

  const t = themes[index] || studentIssues[index - 3] || defaultTheme;

  return {
    id: eventId,
    title: t.title,
    generateSteps: (npcName: string, _role?: string) => [
      {
        speaker: npcName,
        text: `"${npcName} 학생입니다. 선생님... 실은 요즘 학교생활이 조금 힘들어요. 실은... ${t.situation || t}"`,
        choices: [
          {
            text: 'choice1' in t ? (t as any).choice1 : "아이의 눈을 맞추며 정서적 감정에 공감하고, 규칙 적용 대신 따뜻한 지지와 격려를 최우선으로 돌려준다.",
            nextStepIndex: 1,
            effects: ('effects1' in t ? (t as any).effects1 : [
              { stat: 'studentTrust', value: 8 },
              { stat: 'hp', value: -2 },
              { stat: 'burnout', value: 2 }
            ]) as any,
            resultText: 'result1' in t ? (t as any).result1 : "아이와의 정서적 끈을 굳히고 깊은 학생 신뢰를 확보했습니다."
          },
          {
            text: 'choice2' in t ? (t as any).choice2 : "학교의 합리적 규칙에 근거해 단호하고 객관적인 원칙주의 지도를 부과한다.",
            nextStepIndex: 2,
            effects: ('effects2' in t ? (t as any).effects2 : [
              { stat: 'expert', value: 6 },
              { stat: 'educationSoshin', value: 6 },
              { stat: 'mental', value: -2 }
            ]) as any,
            resultText: 'result2' in t ? (t as any).result2 : "전문적인 학업 및 행동 원칙을 지도해 교사 소신과 전문 역량을 다잡았습니다."
          },
          {
            text: 'choice3' in t ? (t as any).choice3 : "일단 아이를 안심시키고, 방과 후에 학부모와 유선 연계하여 가정 내 스트레스 환경 상담을 진행한다.",
            nextStepIndex: 3,
            effects: ('effects3' in t ? (t as any).effects3 : [
              { stat: 'parentTrust', value: 8 },
              { stat: 'studentTrust', value: 2 },
              { stat: 'mental', value: -3 }
            ]) as any,
            resultText: 'result3' in t ? (t as any).result3 : "학부모와의 긴밀한 연대를 다져 정교한 입체 지도를 약조받고 학부모 신뢰를 높였습니다."
          },
          {
            text: 'choice4' in t ? (t as any).choice4 : "학급 회의 안건으로 상정하여, 아이들 간에 자발적으로 도우미 또래 상담 프렌즈를 구성해주기로 유도한다.",
            nextStepIndex: 4,
            effects: ('effects4' in t ? (t as any).effects4 : [
              { stat: 'classManagement', value: 8 },
              { stat: 'studentTrust', value: 4 },
              { stat: 'adminPower', value: -2 }
            ]) as any,
            resultText: 'result4' in t ? (t as any).result4 : "학생들 스스로 자치 우애 협약을 유도해 학급 장벽을 낮추고 평화 분위기를 마련했습니다."
          },
          {
            text: 'choice5' in t ? (t as any).choice5 : "Wee클래스 아동 전문 심리 분석 서비스에 이송 신청서를 정식 작성하여 전문적인 면담 컨설팅을 연계한다.",
            nextStepIndex: 5,
            effects: ('effects5' in t ? (t as any).effects5 : [
              { stat: 'expert', value: 8 },
              { stat: 'adminTrust', value: 6 },
              { stat: 'mental', value: 3 }
            ]) as any,
            resultText: 'result5' in t ? (t as any).result5 : "학교 공식 치료 네트워크로 지도를 연동하여 교사의 직접 고갈 없이 사안의 대안 솔루션을 획득했습니다."
          }
        ]
      },
      {
        speaker: npcName,
        text: `"${npcName} 학생은 비로소 얼굴에 밝은 미소를 띠며 고마워합니다. 선생님의 따뜻한 품에서 자존감이 살아납니다."`
      },
      {
        speaker: npcName,
        text: `"${npcName} 학생은 고개를 숙인 채 조용히 교실로 돌아갑니다. 단호한 가이드를 통해 문제 해결 능력을 기르게 되었습니다."`
      },
      {
        speaker: npcName,
        text: `"${npcName} 학생은 교사의 세련된 연계 지도 지침을 경청하며, 부모님과 함께 차근차근 문제를 개선해 나가기로 약속합니다."`
      },
      {
        speaker: npcName,
        text: `"${npcName} 학생은 반의 친구들과 함께 자치 회의 합의안에 따라 스스로 책임을 지며 서로 화해하기로 결정했습니다."`
      },
      {
        speaker: npcName,
        text: `"${npcName} 학생은 Wee클래스의 따뜻하고 안락한 분위기에서 전문적인 케어 서비스를 수령하며 마음의 평정을 찾아갑니다."`
      }
    ]
  };
});
