// 스탯 키 -> 한글 라벨/이모지 매핑 단일 소스.
// 대시보드의 지표 브리핑, 미니게임 보상 안내 등 여러 화면이 같은 표를 참조하도록 분리했다.
// (예전에는 DashboardLayout 안에만 있어서 미니게임 결과 화면이 라벨을 손으로 다시 적었고,
//  그 결과 실제 적용 스탯과 안내 문구가 어긋나는 일이 생겼다.)

import type { StatEffect } from '@/game/types';

export const STAT_LABELS: Record<string, { label: string; icon: string }> = {
  hp: { label: '건강', icon: '🏥' },
  mental: { label: '멘탈', icon: '🧠' },
  burnout: { label: '번아웃', icon: '😓' },
  expert: { label: '전문성', icon: '📚' },
  studentTrust: { label: '학생신뢰', icon: '👥' },
  parentTrust: { label: '학부모신뢰', icon: '👪' },
  colleagueRelation: { label: '동료관계', icon: '🤝' },
  adminTrust: { label: '관리자신뢰', icon: '📋' },
  adminPower: { label: '행정실무', icon: '💻' },
  familySatisfaction: { label: '가정만족', icon: '🏠' },
  educationSoshin: { label: '교육소신', icon: '💡' },
  reputation: { label: '평판', icon: '🌟' },
  careerPoint: { label: '커리어점수', icon: '🏆' },
  teachingSatisfaction: { label: '교육보람', icon: '⭐' },
  colleagueSolidarity: { label: '동료연대', icon: '🛡️' },
  parentComplaint: { label: '학부모민원', icon: '⚠️' },

  // 5대 역량 스탯 (기반 스탯으로부터 파생 계산되는 값)
  workCapacity: { label: '업무능력', icon: '⚙️' },
  interpersonal: { label: '인간관계', icon: '🌐' },
  familyRelation: { label: '가족관계', icon: '👨‍👩‍👧' },
  classManagement: { label: '학급운영', icon: '🏫' },
  teachingResearch: { label: '수업연구', icon: '🧪' }
};

export const getStatLabel = (key: string): { label: string; icon: string } =>
  STAT_LABELS[key] ?? { label: key, icon: '📈' };

// StatEffect 배열을 "학생신뢰 +10, 번아웃 -5" 형태의 한 줄 문자열로 만든다.
export const formatEffects = (effects: StatEffect[]): string =>
  effects
    .map(eff => `${getStatLabel(eff.stat).label} ${eff.value > 0 ? '+' : ''}${eff.value}`)
    .join(', ');
