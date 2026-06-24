import type { Student, Parent } from '@/game/types';

// MVP에 참여하는 6명의 개성 있는 학생 설정
export const initialStudents: Student[] = [
  {
    id: 'student_minjun',
    name: '김민준',
    academicLevel: 92,
    motivation: 88,
    selfEsteem: 45, // 성적은 좋으나 자존감이 낮고 불안함
    behavior: 90,
    peerRelation: 70,
    teacherTrust: 80,
    familySupport: 95, // 학부모의 과도한 서포트
    hiddenNeed: '성적 압박에서 벗어나 있는 그대로 인정받고 싶어 함.',
    traits: ['우등생', '유리멘탈', '성적집착'],
    currentIssues: ['시험 불안증', '학업 스트레스']
  },
  {
    id: 'student_seoyeon',
    name: '이서연',
    academicLevel: 42, // 학습 부진
    motivation: 75,
    selfEsteem: 60,
    behavior: 95, // 온순하고 성실함
    peerRelation: 65,
    teacherTrust: 85,
    familySupport: 30, // 가정 내 방임 상태
    hiddenNeed: '느리지만 끝까지 포기하지 않고 가르쳐 줄 멘토가 필요함.',
    traits: ['성실파', '노력형 부진아', '조용한 성격'],
    currentIssues: ['기초학력 부진', '가정 방임 우려']
  },
  {
    id: 'student_jihun',
    name: '박지훈',
    academicLevel: 55,
    motivation: 40,
    selfEsteem: 50,
    behavior: 35, // 문제 행동이 자주 관찰됨
    peerRelation: 45, // 교우 마찰 빈번
    teacherTrust: 50,
    familySupport: 60,
    hiddenNeed: '긍정적인 방식으로 인정과 관심을 받고 싶어 함.',
    traits: ['트러블메이커', '인정욕구', '외향적'],
    currentIssues: ['주의산만', '교우 다툼', '생성형 AI 대필 논란']
  },
  {
    id: 'student_haeun',
    name: '최하은',
    academicLevel: 78,
    motivation: 65,
    selfEsteem: 40,
    behavior: 90,
    peerRelation: 30, // 관계 맺기에 심각한 어려움
    teacherTrust: 75,
    familySupport: 80,
    hiddenNeed: '무리 속에서 소외되지 않고 안전하다고 느끼고 싶어 함.',
    traits: ['보이지않는아이', '내성적', '관계불안'],
    currentIssues: ['은따 징후', '등교 거부 의사']
  },
  {
    id: 'student_yejun',
    name: '정예준',
    academicLevel: 85,
    motivation: 50, // 무기력
    selfEsteem: 55,
    behavior: 80,
    peerRelation: 75,
    teacherTrust: 65,
    familySupport: 90,
    hiddenNeed: '학부모가 정한 완벽한 루트가 아닌 자신이 좋아하는 미술을 존중받고 싶어 함.',
    traits: ['학습무기력', '예술가기질', '부모기대압박'],
    currentIssues: ['수업 중 딴짓(미술 낙서)', '학원 뺑뺑이 피로']
  },
  {
    id: 'student_sua',
    name: '한수아',
    academicLevel: 68,
    motivation: 90, // 체육 활동에 강한 동기
    selfEsteem: 85,
    behavior: 85,
    peerRelation: 90, // 마당발
    teacherTrust: 80,
    familySupport: 85,
    hiddenNeed: '운동선수 꿈을 격려받고, 공교육 내에서 최소한의 학업을 포기하지 않도록 돕는 것.',
    traits: ['체육특기자', '친화력왕', '직설적'],
    currentIssues: ['교외 훈련으로 인한 잦은 조퇴', '기초수업 참여 미진']
  }
];

// 각 학생에 매핑되는 학부모 6명 설정
export const initialParents: Parent[] = [
  {
    id: 'parent_minjun',
    studentId: 'student_minjun',
    studentName: '김민준',
    parentType: 'pressure', // 성취 압박형
    visibleRequest: '민준이가 시험에서 실수하지 않도록 특별히 어려운 문항을 많이 내고 지도시 신경 써주세요.',
    hiddenConcern: '자녀가 명문대에 가지 못하면 자신의 사회적 체면과 노후가 위협받는다고 느낌.',
    emotionLevel: 65,
    evidenceLevel: 40,
    relationshipHistory: 50
  },
  {
    id: 'parent_seoyeon',
    studentId: 'student_seoyeon',
    studentName: '이서연',
    parentType: 'info', // 정보 요구형 (하지만 생업으로 방임하는 면이 있음)
    visibleRequest: '서연이가 학교에서 친구들과는 잘 지내는지, 수업은 잘 따라가는지 가끔 문자로 알려주세요.',
    hiddenConcern: '맞벌이로 인해 아이를 챙겨주지 못한다는 심한 죄책감과 막연한 불안감.',
    emotionLevel: 45,
    evidenceLevel: 20,
    relationshipHistory: 60
  },
  {
    id: 'parent_jihun',
    studentId: 'student_jihun',
    studentName: '박지훈',
    parentType: 'emotional', // 감정 폭발형
    visibleRequest: '우리 지훈이만 항상 다툼의 원인으로 지목되는 것 같아 억울합니다. 상대방 부모의 사과를 받아내 주세요!',
    hiddenConcern: '아이가 엇나가는 것을 인정하기 힘들어 공격적인 방어 태세를 취함.',
    emotionLevel: 80, // 감정 수치 매우 높음
    evidenceLevel: 30,
    relationshipHistory: 35
  },
  {
    id: 'parent_haeun',
    studentId: 'student_haeun',
    studentName: '최하은',
    parentType: 'right', // 권리 주장형
    visibleRequest: '하은이가 은따를 당하고 있는 정황이 있으니 학교 학교폭력대책심의위원회를 열거나 단체 징계를 내려주세요.',
    hiddenConcern: '아이가 상처받은 사실에 극도로 예민해져 있으며 학교 시스템에 대한 깊은 불신이 있음.',
    emotionLevel: 75,
    evidenceLevel: 70, // 단톡방 캡처본 등 나름의 수집 자료가 있음
    relationshipHistory: 40
  },
  {
    id: 'parent_yejun',
    studentId: 'student_yejun',
    studentName: '정예준',
    parentType: 'pressure', // 성취 압박형
    visibleRequest: '예준이가 쓸데없는 낙서나 미술 활동을 학교에서 하지 못하게 지도해 주시고 의대를 가도록 엄격히 다그쳐 주세요.',
    hiddenConcern: '미술 진로로는 성공할 수 없다는 완고한 교육관과 통제 욕구.',
    emotionLevel: 60,
    evidenceLevel: 50,
    relationshipHistory: 45
  },
  {
    id: 'parent_sua',
    studentId: 'student_sua',
    studentName: '한수아',
    parentType: 'cooperative', // 협력형
    visibleRequest: '수아가 운동 훈련 때문에 수업을 빠지는 경우가 많은데, 학급 친구들에게 피해를 주지 않고 학습 결손을 메울 방법이 있을까요?',
    hiddenConcern: '아이의 운동 진로를 도우면서도 기본 학력 저하로 고등학교 진학에 차질이 생길까 우려함.',
    emotionLevel: 35,
    evidenceLevel: 60,
    relationshipHistory: 70
  }
];
