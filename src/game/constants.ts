// [WO-16] TP(교사력) 경제·회복·패널티·압박 램프 관련 수치를 한곳에 모은 단일 소스.
// 스토어(useGameStore.ts)와 UI(튜토리얼/툴팁 안내 문구)가 모두 이 값을 참조하므로,
// 여기서 값을 바꾸면 실제 게임 동작과 안내 문구가 항상 일치한다.

import type { PlayerInfo } from '@/game/types';

export const TOTAL_GAME_DAYS = 30;

// 난이도별 매일 아침 기본 교사력(TP)
export const DIFFICULTY_TP: Record<PlayerInfo['difficulty'], number> = {
  warm: 15,
  realistic: 9,
  hard: 7
};

// '교사력왕' 특성 보유 시 매일 아침 TP 추가 보너스
export const TP_TRAIT_BONUS_STRONG_TEACHER = 2;

// 컨디션 악화 시 다음 날 TP가 깎이는 기준선
export const LOW_HP_TP_PENALTY_THRESHOLD = 30; // hp가 이 값 미만이면 다음 날 TP -1
export const HIGH_BURNOUT_TP_PENALTY_THRESHOLD = 80; // burnout이 이 값 초과면 다음 날 TP -1
export const MIN_DAILY_TP = 1; // 페널티가 겹쳐도 최소 이만큼은 보장

// 야근(overtimeWork) 선택 시 다음 날 받는 TP 보너스
export const OVERTIME_TP_BONUS = 1;

// 장소 행동/탐색/대화/학생 상담 등 대부분의 단일 행동에 소모되는 기본 TP
export const ACTION_TP_COST = 1;

// [WO-13] 보건실(health_rest) 회복이 실제로 적용되는 하루 최대 횟수. 초과분은 효과 없이 TP만 소모.
export const HEALTH_REST_DAILY_CAP = 2;

// [WO-13] 난이도별 평일 기본 일일 소모(가만히 있어도 닳는 hp/burnout)
export const DAILY_ATTRITION_BY_DIFFICULTY: Record<PlayerInfo['difficulty'], { hp: number; burnout: number }> = {
  warm: { hp: 0, burnout: 0 },
  realistic: { hp: 3, burnout: 2 },
  hard: { hp: 5, burnout: 3 }
};

// [WO-14] 30일을 7일 단위로 나눈 압박 램프 주차 수 및 마지막 주(학기말 정산 카운트다운) 시작일
export const RAMP_TOTAL_WEEKS = 5;
export const FINAL_WEEK_START_DAY = 26;
