// 게임 내에서 관리할 핵심 스탯(능력치) 인터페이스
export interface Stats {
  hp: number;                 // 체력 (0 ~ 100)
  mental: number;             // 멘탈 (0 ~ 100)
  burnout: number;            // 번아웃 (0 ~ 100, 높을수록 위험)
  expert: number;             // 전문성 (수업, 평가, 학생 이해 등 - 0 ~ 100)
  studentTrust: number;       // 학생 신뢰도 (0 ~ 100)
  parentTrust: number;        // 학부모 신뢰도 (0 ~ 100)
  colleagueRelation: number;  // 동료 교사 관계 (0 ~ 100)
  adminTrust: number;         // 관리자(교장/교감) 신뢰도 (0 ~ 100)
  adminPower: number;         // 행정 역량 (공문, 계획 처리 등 - 0 ~ 100)
  familySatisfaction: number; // 가정 만족도 (0 ~ 100)
  educationSoshin: number;    // 교육적 소신 (0 ~ 100)
  reputation: number;         // 대외 평판 (0 ~ 100)
  careerPoint: number;        // 커리어 포인트 (엔딩 진로 해금용)
}

// 플레이어 기본 신상 정보
export interface PlayerInfo {
  name: string;               // 이름 또는 별명
  experience: 'newbie' | 'junior' | 'senior'; // 교직 경력 (신규, 3-5년차, 10년차 이상 등)
  grade: number;              // 담당 학년
  isClassTeacher: boolean;    // 담임 여부
  familyState: 'single' | 'married' | 'parent'; // 가족 상태 (독신, 기혼, 자녀 있음)
  commuteDistance: 'short' | 'medium' | 'long'; // 출퇴근 거리
  traits: string[];           // 초기 특성 2개 (예: '수업 장인', '칼퇴 수호자' 등)
  schoolType: string;         // 학교 유형 ('도심 대규모', '신도시', '농산촌' 등)
  difficulty: 'warm' | 'realistic' | 'hard'; // 난이도
}

// 스탯 변동 효과
export interface StatEffect {
  stat: keyof Stats;          // 변동을 줄 스탯
  value: number;              // 변동량 (양수 또는 음수)
}

// n일 후 발생할 지연 효과 데이터
export interface DelayedEffect {
  dayTrigger: number;         // 발동될 날짜 (1 ~ 30)
  effects: StatEffect[];      // 발동 시 변동될 스탯 목록
  message: string;            // 발동 시 플레이어에게 보일 알림 메시지
  eventId?: string;           // (옵션) 연계되어 발생할 이벤트 ID
}

// 선택지 구조
export interface GameChoice {
  id: string;
  text: string;               // 선택지 텍스트
  intent: string;             // 교사의 의도 (예: "공감형 지도", "단호한 징계", "관리자 보고")
  immediateEffects: StatEffect[]; // 즉각적인 스탯 변화
  delayedEffects?: DelayedEffect[]; // 나중에 일어날 지연 효과들
  hiddenFlags?: string[];     // 누적될 숨겨진 성향 플래그 (예: 'student_center', 'work_avoid' 등)
  resultText: string;         // 선택 후 보여질 피드백 텍스트
  riskText?: string;          // 선택 시 동반되는 부작용에 대한 경고 메시지
}

// 학교 내부의 공간 정의
export type LocationType = 'classroom' | 'office' | 'health_room' | 'playground' | 'principal_room';

// 이벤트 구조
export interface GameEvent {
  id: string;
  dayRange: [number, number]; // 발생 가능한 날짜 범위 (예: [1, 10])
  title: string;              // 이벤트 제목
  category: 'student' | 'parent' | 'colleague' | 'admin' | 'family' | 'career' | 'random'; // 카테고리
  situation: string;          // 상황 설명 (예: "교실", "교무실")
  location?: LocationType;    // (추가) 이벤트가 발생할 학교 내부의 특정 장소
  narratorText: string;       // 내레이션 및 묘사 텍스트
  choices: GameChoice[];      // 선택할 수 있는 지문들 (3~5개)
  prerequisites?: string[];   // 발동을 위해 미리 켜져있어야 하는 hiddenFlags
  weight: number;             // 랜덤 등장 가중치
  cooldown?: number;          // 재등장 방지 쿨다운 일수
  followUpEvents?: string[];  // 후속으로 예약할 이벤트 ID 목록
  tags: string[];             // 이벤트 필터용 태그
}

// 학생 상세 정보
export interface Student {
  id: string;
  name: string;               // 학생 이름
  academicLevel: number;      // 학업 역량 (0 ~ 100)
  motivation: number;         // 학습 동기 (0 ~ 100)
  selfEsteem: number;         // 자존감 (0 ~ 100)
  behavior: number;           // 행동 성향 (0 ~ 100, 낮을수록 반항적)
  peerRelation: number;       // 교우 관계 (0 ~ 100)
  teacherTrust: number;       // 교사 신뢰도 (0 ~ 100)
  familySupport: number;      // 가정의 지원 및 관심도 (0 ~ 100)
  hiddenNeed: string;         // 겉으로 보이지 않는 진짜 필요
  traits: string[];           // 학생 특성 (예: '유리멘탈', '츤데레' 등)
  currentIssues: string[];    // 현재 겪고 있는 문제 리스트
}

// 학부모 정보
export interface Parent {
  id: string;
  studentId: string;          // 연결된 학생 ID
  studentName: string;        // 연결된 학생 이름
  parentType: 'info' | 'anxious' | 'pressure' | 'right' | 'emotional' | 'cooperative'; // 학부모 성향 유형
  visibleRequest: string;     // 표면적인 요구 사항
  hiddenConcern: string;      // 실제 숨겨진 걱정
  emotionLevel: number;       // 현재 감정 고조도 (0 ~ 100)
  evidenceLevel: number;      // 가지고 있는 증거나 정보량 (0 ~ 100)
  relationshipHistory: number; // 교사와의 신뢰 관계 (0 ~ 100)
}

// 행정 업무 정보
export interface Task {
  id: string;
  title: string;              // 업무 제목
  category: 'teaching' | 'admin' | 'student' | 'parent' | 'event' | 'career'; // 업무 분야
  urgency: number;            // 긴급도 (1 ~ 5)
  importance: number;         // 중요도 (1 ~ 5)
  estimatedTime: number;      // 예상 소요 행동 포인트 (보통 1~2)
  stressCost: number;         // 처리 시 소모될 스트레스/체력 비용
  reputationReward: number;   // 성공 시 얻는 대외적 평판/관리자 신뢰 보상
  deadlineDay: number;        // 마감 기한 (날짜)
  canDelegate: boolean;       // 동료에게 위임 가능 여부
  canNegotiate: boolean;      // 관리자와 기한 협상 가능 여부
  isCompleted: boolean;       // 완료 여부
}

// 숨겨진 플레이어 성향 카운터 (엔딩 판정에 기여)
export interface HiddenTendencies {
  studentCenter: number;      // 학생 중심성
  performanceCenter: number;  // 성과 중심성
  organismAdaptation: number; // 조직 순응도
  innovationTendency: number; // 혁신 성향
  conflictAvoidance: number;  // 갈등 회피
  fairness: number;           // 공정성
  collaboration: number;      // 협업 성향
  selfSacrifice: number;      // 자기희생
  familyFirst: number;        // 가정 우선
  leadership: number;         // 리더십
}

// NPC 대화 시 선택 가능한 교사의 반응
export interface DialogueChoice {
  text: string;                  // 선택지 텍스트
  nextStepIndex: number | null;  // 선택 후 이어질 단계 인덱스 (null이면 대화 종료)
  effects?: StatEffect[];        // 선택 시 변동 스탯 목록
  resultText?: string;           // 대답 후 NPC가 보일 피드백 대사 (있을 경우 팝업 처리)
}

// NPC 대화의 한 단계(Turn)
export interface DialogueStep {
  speaker: string;               // 대사를 말하는 사람 이름
  text: string;                  // 대사 본문
  choices?: DialogueChoice[];    // (선택) 교사가 고를 답변들
  nextStepIndex?: number | null; // (선택) 선택지가 없을 때 클릭하여 넘어갈 다음 단계 (null이면 대화 종료)
}

// 진행 중인 NPC 대화 세션 정보
export interface DialogueSession {
  npcId: string;                 // 대화 상대의 ID
  npcName: string;               // 대화 상대의 이름
  currentStepIndex: number;      // 현재 진행 중인 대사 스텝 인덱스
  steps: DialogueStep[];         // 전체 대화 스텝 시나리오
  activeFeedbackText: string | null;     // 선택한 답변에 대한 NPC의 즉각 반응 텍스트
  activeFeedbackEffects: StatEffect[] | null; // 피드백 수반 스탯 효과
}
