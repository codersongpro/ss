// 미니게임 정의 단일 소스.
//
// 예전에는 성공/실패 보상이 useGameStore.resolveMiniGame() 안에 if 사다리로 하드코딩되어 있고,
// 결과 화면(MiniGames.tsx)이 같은 수치를 손으로 다시 적어 두 곳이 어긋났다. 실제로 '갈등 중재'
// 성공 보상은 classManagement(파생 스탯)를 겨냥해 syncNewStats()가 즉시 덮어쓰는 바람에
// 안내 문구에만 존재하고 실제로는 적용되지 않았다.
//
// 이제 보상은 전부 여기 StatEffect[]로 선언한다. StatEffect.stat은 BaseStatKey로 제한되어 있어
// 파생 스탯을 겨냥하는 실수가 타입 단계에서 차단되고, 결과 화면은 이 표를 그대로 읽어 출력한다.

import type { StatEffect } from '@/game/types';

// 주 1회 열리는 정규 미니게임 (주차 마감 이벤트)
export type WeeklyMiniGameType = 'cafeteria' | 'proofreading' | 'conflict' | 'stamp';

// 일과 중 예고 없이 끼어드는 레트로 돌발 미니게임
export type RetroMiniGameType = 'printer' | 'nameface' | 'hallway' | 'attendance';

export type AnyMiniGameType = WeeklyMiniGameType | RetroMiniGameType;

export interface MiniGameDef {
  title: string;          // 인트로/결과 화면 제목
  icon: string;
  gradient: string;       // 인트로 배경 그라디언트 (tailwind from-/to- 클래스)
  desc: string;           // 인트로 규칙 설명
  successEffects: StatEffect[];
  failEffects: StatEffect[];
  successText: string;    // 정산 토스트에 쓸 성공 서술
  failText: string;       // 정산 토스트에 쓸 실패 서술
}

export const WEEKLY_MINI_GAMES: Record<WeeklyMiniGameType, MiniGameDef> = {
  cafeteria: {
    title: '급식 전쟁 타이쿤',
    icon: '🍛',
    gradient: 'from-rose-500 to-amber-500',
    desc: '급식실에서 일어나는 아이들의 돌발 행동을 제한 시간 안에 클릭해 진정시키세요. 식판을 3개 엎지르거나 인내 체력이 바닥나면 실패합니다!',
    successEffects: [
      { stat: 'studentTrust', value: 10 },
      { stat: 'teachingSatisfaction', value: 10 },
      { stat: 'burnout', value: -5 }
    ],
    failEffects: [
      { stat: 'burnout', value: 15 },
      { stat: 'hp', value: -10 },
      { stat: 'studentTrust', value: -5 }
    ],
    successText: '급식실 소란을 성공적으로 통제했습니다. 아이들이 선생님의 신호에 척척 반응합니다.',
    failText: '급식실이 엉망진창이 되었습니다. 뒷정리까지 도맡으며 체력이 바닥났습니다.'
  },
  proofreading: {
    title: '생기부 오탈자 & 금지어 사냥',
    icon: '✍️',
    gradient: 'from-amber-500 to-yellow-500',
    desc: '생활기록부는 공정성과 규정이 생명입니다. 기재 금지어(외부 대회, 부모 직업 등)와 오탈자를 문장에서 골라 정정하세요. 5개 이상 잡아야 합니다.',
    successEffects: [
      { stat: 'adminPower', value: 15 },
      { stat: 'reputation', value: 10 },
      { stat: 'adminTrust', value: 5 }
    ],
    failEffects: [
      { stat: 'burnout', value: 15 },
      { stat: 'adminTrust', value: -10 },
      { stat: 'reputation', value: -5 }
    ],
    successText: '생기부 오탈자와 기재 금지어를 말끔히 정리해 제출했습니다.',
    failText: '교육청 제출 서류에서 기재 금지어가 그대로 발견되어 정정 요구를 받았습니다.'
  },
  conflict: {
    title: '돌발 상황! 교실 난투극 중재',
    icon: '💥',
    gradient: 'from-red-500 to-purple-500',
    desc: '민우와 정우가 붙었습니다! 두 아이의 흥분 게이지가 100에 닿기 전에, 중재 스킬로 둘 다 진정선(20) 아래로 끌어내려 자리에 앉히세요.',
    // [FIX] 예전에는 파생 스탯 classManagement를 직접 올리려 해서 보상이 실제로는 0이었다.
    // 학급운영은 studentTrust*0.5 + parentTrust*0.3 + educationSoshin*0.2로 계산되므로,
    // 기반 스탯을 올려 같은 체감(학급운영 상승)을 실제로 만들어낸다.
    successEffects: [
      { stat: 'studentTrust', value: 12 },
      { stat: 'educationSoshin', value: 8 },
      { stat: 'teachingSatisfaction', value: 6 },
      { stat: 'colleagueSolidarity', value: 5 }
    ],
    failEffects: [
      { stat: 'mental', value: -15 },
      { stat: 'parentComplaint', value: 20 },
      { stat: 'parentTrust', value: -10 }
    ],
    successText: '두 아이를 지혜롭게 중재해 나란히 앉혔습니다. 학급 전체가 선생님의 말을 다시 신뢰합니다.',
    failText: '다툼이 주먹다짐으로 번졌습니다. 양쪽 학부모의 항의 전화가 이어집니다.'
  },
  stamp: {
    title: '방과 후 공문 기안 / 결재선 패스',
    icon: '💻',
    gradient: 'from-emerald-500 to-teal-500',
    desc: '퇴근 직전 상신한 문서들이 반려 피드백과 함께 되돌아옵니다. 결재권자의 반려 사유를 읽고 알맞은 수정안을 골라 8건 이상 최종 결재를 받아내세요!',
    successEffects: [
      { stat: 'adminPower', value: 15 },
      { stat: 'adminTrust', value: 15 },
      { stat: 'careerPoint', value: 5 }
    ],
    failEffects: [
      { stat: 'adminTrust', value: -15 },
      { stat: 'reputation', value: -10 },
      { stat: 'burnout', value: 10 }
    ],
    successText: '반려된 기안을 모두 손봐 결재선을 통과시켰습니다.',
    failText: '상신한 기안이 연달아 반려되어 마감 기한을 넘겼습니다.'
  }
};

// 돌발 레트로 미니게임.
// 정규 미니게임보다 훨씬 짧고 자주 등장하므로 보상/패널티 폭을 의도적으로 작게 잡았다.
export const RETRO_MINI_GAMES: Record<RetroMiniGameType, MiniGameDef & { situation: string }> = {
  printer: {
    title: '인쇄실 용지 걸림',
    icon: '🖨️',
    gradient: 'from-cyan-400 to-blue-600',
    situation: '5교시 학습지 120장을 뽑던 중 인쇄기가 "철컹" 소리를 내며 멈췄습니다. 종이가 롤러에 말려 들어갔습니다.',
    desc: '좌우로 튕기는 커서를 초록 구간(롤러 해제 지점)에 정확히 멈추세요. 3번 성공하면 종이를 찢지 않고 빼낼 수 있습니다.',
    successEffects: [
      { stat: 'adminPower', value: 5 },
      { stat: 'expert', value: 3 },
      { stat: 'mental', value: 3 }
    ],
    failEffects: [
      { stat: 'burnout', value: 6 },
      { stat: 'hp', value: -4 },
      { stat: 'mental', value: -4 }
    ],
    successText: '롤러를 정확히 눌러 종이를 온전히 빼냈습니다. 학습지를 제시간에 들고 교실로 향합니다.',
    failText: '종이가 찢겨 롤러 안쪽에 남았습니다. 결국 행정실에 수리를 부탁하고 판서로 수업을 때웠습니다.'
  },
  nameface: {
    title: '아이들 이름 외우기',
    icon: '🪪',
    gradient: 'from-fuchsia-400 to-purple-600',
    situation: '새 학기 둘째 주. 아이들이 우르르 몰려와 "선생님, 제 이름 아직 모르시죠?"라며 눈을 반짝입니다.',
    desc: '카드를 두 장씩 뒤집어 같은 아이의 얼굴과 이름을 짝지으세요. 제한 시간 안에 모든 짝을 맞춰야 합니다.',
    successEffects: [
      { stat: 'studentTrust', value: 6 },
      { stat: 'teachingSatisfaction', value: 5 }
    ],
    failEffects: [
      { stat: 'studentTrust', value: -4 },
      { stat: 'mental', value: -3 }
    ],
    successText: '한 명도 빠짐없이 이름을 불러주었습니다. 아이들이 "우리 선생님 최고!"라며 환호합니다.',
    failText: '몇 명의 이름을 끝내 헷갈렸습니다. 한 아이가 시무룩한 표정으로 자리로 돌아갑니다.'
  },
  hallway: {
    title: '복도 안전 지도',
    icon: '🏃',
    gradient: 'from-amber-400 to-orange-600',
    situation: '쉬는 시간 종이 울리자마자 복도에서 우당탕 소리가 터집니다. 아이들이 사방으로 뛰기 시작했습니다.',
    desc: '복도 칸에서 튀어나오는 아이를 재빨리 눌러 걷게 하세요. 안전 게이지가 바닥나기 전에 목표 인원을 지도해야 합니다.',
    successEffects: [
      { stat: 'studentTrust', value: 4 },
      { stat: 'reputation', value: 4 },
      { stat: 'parentComplaint', value: -4 }
    ],
    failEffects: [
      { stat: 'parentComplaint', value: 8 },
      { stat: 'hp', value: -5 }
    ],
    successText: '복도가 금세 조용해졌습니다. 지나가던 교감 선생님이 흐뭇하게 고개를 끄덕입니다.',
    failText: '결국 한 아이가 모퉁이에서 부딪혀 넘어졌습니다. 보건실 동행과 학부모 연락이 기다립니다.'
  },
  attendance: {
    title: '아침 조회 호명 순서',
    icon: '🔔',
    gradient: 'from-emerald-400 to-teal-600',
    situation: '아침 조회 시간. 아이들이 순서대로 손을 들며 "저요!"를 외칩니다. 오늘 발표 순서를 기억해야 합니다.',
    desc: '아이들이 손을 든 순서를 잘 보고, 같은 순서대로 눌러주세요. 단계가 올라갈수록 순서가 길어집니다.',
    successEffects: [
      { stat: 'studentTrust', value: 5 },
      { stat: 'mental', value: 4 },
      { stat: 'teachingSatisfaction', value: 3 }
    ],
    failEffects: [
      { stat: 'studentTrust', value: -3 },
      { stat: 'mental', value: -4 }
    ],
    successText: '순서를 하나도 틀리지 않고 호명했습니다. 아이들이 "우와" 하며 박수를 칩니다.',
    failText: '순서를 헷갈려 한 아이를 건너뛰었습니다. "선생님 저는요?" 하는 목소리가 마음에 걸립니다.'
  }
};

export const getMiniGameDef = (type: AnyMiniGameType): MiniGameDef =>
  (WEEKLY_MINI_GAMES as Record<string, MiniGameDef>)[type] ??
  (RETRO_MINI_GAMES as Record<string, MiniGameDef>)[type];
