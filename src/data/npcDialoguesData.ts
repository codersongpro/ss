import type { DialogueStep, EventValence } from '@/game/types';

export interface DialogueEvent {
  id: string;
  title: string;
  valence: EventValence; // [NEW] 대화의 정서(긍정/중립/갈등). 밸런싱 선택에 사용
  generateSteps: (npcName: string, role?: string, npcId?: string) => DialogueStep[];
}

// [NEW] 대화 한 테마(상황+선택지 묶음)의 공통 형태
interface DialogueTheme {
  title: string;
  situation: string;
  choice1?: string; effects1?: { stat: string; value: number }[]; result1?: string;
  choice2?: string; effects2?: { stat: string; value: number }[]; result2?: string;
  choice3?: string; effects3?: { stat: string; value: number }[]; result3?: string;
  choice4?: string; effects4?: { stat: string; value: number }[]; result4?: string;
  choice5?: string; effects5?: { stat: string; value: number }[]; result5?: string;
}

// [NEW] 정서별 마무리 대사 풀 (선택 후 NPC의 닫는 반응). 매번 같은 신파 마무리 반복을 줄이기 위해 풀을 넉넉히 확보한다.
const CLOSING_BY_VALENCE: Record<EventValence, string[]> = {
  positive: [
    '님은 당신의 따뜻한 호응에 환하게 웃으며 한결 가벼워진 표정으로 자리로 돌아갑니다.',
    '님은 짧지만 다정한 교류에 고마워하며, 다음엔 자신이 차를 대접하겠다고 약속합니다.',
    '님과 나눈 소소한 대화 덕분에 두 사람 모두 오후 일과를 버틸 기운을 얻었습니다.',
    '님은 흡족한 표정으로 고개를 끄덕이며, 오늘 하루도 잘 풀릴 것 같다고 덧붙입니다.',
    '님은 당신의 반응이 마음에 든 듯 가볍게 손을 흔들고 콧노래를 부르며 돌아갑니다.',
    '님은 "역시 선생님이랑 얘기하면 마음이 편해진다"며 환하게 웃어 보입니다.',
    '님은 자리로 돌아가는 길에도 연신 싱글거리며 옆자리 선생님에게도 좋은 기분을 전합니다.',
    '님은 당신의 말을 곱씹으며 작게 웃더니, 오후 일과에 한층 가벼운 발걸음을 옮깁니다.',
    '님은 고마운 마음을 감추지 못하고 책상 위에 작은 메모를 남긴 채 자리로 돌아갑니다.',
    '님은 어깨를 활짝 펴며 "오늘은 일이 잘 풀릴 것 같다"고 혼잣말처럼 중얼거립니다.',
    '님은 잠시 머뭇거리다가도 결국 미소를 참지 못하고 가벼운 발걸음으로 돌아섭니다.'
  ],
  neutral: [
    '님은 고개를 끄덕이며 필요한 이야기를 마치고 자기 일로 돌아갑니다.',
    '님과 담백하게 정보를 주고받고, 각자 할 일을 이어갑니다.',
    '님은 "그럼 그렇게 알고 있을게요" 하며 가볍게 인사를 건넵니다.',
    '님은 별다른 동요 없이 메모를 남기고 다음 일정으로 넘어갑니다.',
    '님은 잠깐의 대화를 마치고 무심한 듯 자리로 돌아가지만, 표정은 한결 풀려 있습니다.',
    '님은 짧게 알겠다는 손짓을 보이고는 평소처럼 자기 업무로 돌아갑니다.',
    '님은 시계를 한 번 보더니 "다음에 또 얘기하자"며 자리를 정리합니다.',
    '님은 대화 내용을 수첩에 메모하며 무덤덤하게 다음 일을 챙깁니다.',
    '님은 별 의미 없는 잡담처럼 흘려보내며 가볍게 손을 흔들고 멀어집니다.'
  ],
  negative: [
    '님은 표정이 완전히 풀리진 않았지만, 일단 당신의 입장을 받아들이고 돌아섭니다.',
    '님과의 사이에 미묘한 긴장이 남았지만, 대화 자체는 마무리되었습니다.',
    '님은 "알겠습니다" 하고 짧게 답한 뒤, 생각에 잠긴 채 자리로 향합니다.',
    '님은 한숨을 한 번 내쉬고는 더 말을 잇지 않은 채 자리로 돌아갑니다.',
    '님은 굳은 표정을 풀지 못한 채 가볍게 목례만 하고 멀어집니다.',
    '님은 못마땅한 기색을 숨기지 않으면서도 더 이상 따지지는 않습니다.',
    '님은 잠시 당신을 바라보다가 결국 아무 말 없이 자리로 돌아갑니다.',
    '님은 "나중에 다시 얘기하자"는 말만 남기고 무거운 발걸음으로 떠납니다.',
    '님은 애써 표정을 가다듬으며 "알겠어요" 하고 짧게 마무리합니다.'
  ]
};

const pickClosing = (valence: EventValence, npcName: string): string => {
  const pool = CLOSING_BY_VALENCE[valence];
  return `"${npcName} 교사${pool[Math.floor(Math.random() * pool.length)]}"`;
};

// 선택지 자체의 효과 부호로 NPC의 마무리 반응을 분기한다(스토어의 inferValence와 동일 로직).
const RISK_STATS_LOCAL = ['burnout', 'parentComplaint'];
const effectValence = (
  effects: { stat: string; value: number }[] | undefined,
  fallback: EventValence = 'neutral'
): EventValence => {
  if (!effects || effects.length === 0) return fallback;
  const net = effects.reduce((sum, eff) => {
    const sign = RISK_STATS_LOCAL.includes(eff.stat) ? -1 : 1;
    return sum + sign * eff.value;
  }, 0);
  if (net >= 6) return 'positive';
  if (net <= -6) return 'negative';
  return 'neutral';
};

// NPC 성향 태그. 같은 NPC와 반복 대화해도 어휘 결이 일관되게 느껴지도록 풀 선택을 편향시킨다.
type NpcPersonality = 'energetic' | 'cynical' | 'warm';
const NPC_PERSONALITY: Record<string, NpcPersonality> = {
  colleague_senior: 'warm',
  colleague_mate: 'energetic',
  colleague_vice_principal: 'cynical',
  principal: 'cynical',
  nurse: 'warm',
  gym: 'energetic',
  staff_admin_chief: 'cynical',
  staff_admin_worker: 'cynical',
  staff_cook: 'warm',
  staff_librarian: 'warm',
  staff_counselor: 'warm',
  staff_science_assistant: 'energetic',
  staff_guard: 'cynical'
};
const getPersonality = (npcId?: string): NpcPersonality => NPC_PERSONALITY[npcId ?? ''] ?? 'warm';

// 성향에 따라 풀의 한 구간을 70% 확률로 선호하고, 나머지는 전체 풀에서 고른다.
const pickFromPool = <T,>(pool: T[], personality: NpcPersonality): T => {
  const third = Math.floor(pool.length / 3);
  const ranges: Record<NpcPersonality, [number, number]> = {
    energetic: [0, third],
    warm: [third, third * 2],
    cynical: [third * 2, pool.length]
  };
  if (Math.random() < 0.7) {
    const [start, end] = ranges[personality];
    const slice = pool.slice(start, end);
    if (slice.length > 0) return slice[Math.floor(Math.random() * slice.length)];
  }
  return pool[Math.floor(Math.random() * pool.length)];
};

// [NEW] 테마 + 정서로부터 깔끔한 2단계 대화(프롬프트 → 선택별 마무리)를 생성하는 공용 헬퍼.
// 선택지가 3~5개로 가변이어도 동작하며, 마무리 스텝은 nextStepIndex:null로 명확히 종료된다.
// 마무리 반응은 테마 전체 정서가 아니라 "그 선택지의 실제 효과 부호"로 갈라져, 같은 테마라도
// 어떤 선택을 했는지에 따라 NPC 반응이 달라진다.
const buildStepsFromTheme = (
  t: DialogueTheme,
  valence: EventValence,
  npcName: string,
  opener: string
): DialogueStep[] => {
  const rec = t as unknown as Record<string, unknown>;
  const defs = [1, 2, 3, 4, 5]
    .map(n => ({
      text: rec[`choice${n}`] as string | undefined,
      effects: rec[`effects${n}`] as { stat: string; value: number }[] | undefined,
      result: rec[`result${n}`] as string | undefined
    }))
    .filter(d => !!d.text);

  const choices = defs.map((d, i) => ({
    text: d.text as string,
    nextStepIndex: i + 1,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    effects: (d.effects || []) as any,
    resultText: d.result
  }));

  const closings: DialogueStep[] = defs.map(d => ({
    speaker: npcName,
    text: pickClosing(effectValence(d.effects, valence), npcName),
    nextStepIndex: null
  }));

  return [{ speaker: npcName, text: opener, choices }, ...closings];
};

// ==========================================
// [1] 교직원용 랜덤 대화 이벤트 150선
export const colleagueDialogueEvents: DialogueEvent[] = Array.from({ length: 150 }, (_, index) => {
  const eventId = `colleague_evt_${String(index + 1).padStart(3, '0')}`;

  // 말투 다변화를 위한 30가지 이상의 다양한 긍정 묘사 파츠들 [NEW]
  const PREFIX_TEMPLATES = [
    "선생님, 오늘 날씨가 참 좋은데 잠깐 티타임 어떠세요?",
    "김 선생님, 옆자리에서 보니까 오늘 엄청 힘이 넘쳐 보이시네요!",
    "선생님, 다른 게 아니라 이번에 새로 나온 차가 맛있어서 한 잔 우려왔어요.",
    "선생님! 혹시 최근에 추천받은 힐링 책 있으신가요?",
    "바쁘신 와중이지만, 요 앞 화단에 꽃이 정말 예쁘게 피었더라고요.",
    "선생님, 오늘 아침 출근길에 가벼운 음악을 들었는데 기분이 참 좋네요.",
    "선생님, 항상 웃으며 인사해주셔서 아침마다 큰 에너지를 얻어요.",
    "선생님 덕분에 교무실 분위기가 늘 화사하고 밝은 것 같습니다.",
    "선생님, 점심 식사 맛있게 하셨나요? 가볍게 동네 산책 어때요?",
    "선생님께 드릴 기분 좋은 소식이 하나 있답니다!",
    "선생님, 어제 주말에 가족들이랑 맛있는 걸 먹었는데 선생님 생각이 나더라고요.",
    "오늘 선생님 옷 스타일이 너무 단정하고 잘 어울리세요!",
    "선생님, 항상 묵묵히 곁에서 든든하게 지켜주셔서 감사해요.",
    "선생님, 오늘 텀블러 색감이 완전 제 취향저격이라 눈이 가네요!",
    "선생님, 이번 주 내내 고생 많으셨는데 기분 전환 삼아 수다 좀 떨까요?",
    "선생님, 가끔은 머리를 식히는 소소한 여유가 필요한 법이죠.",
    "선생님과 이야기하다 보면 긍정적인 기운이 막 샘솟는 것 같아요.",
    "선생님, 오늘 급식 반찬이 정말 기대되지 않나요?",
    "선생님, 매번 겪는 일상이지만 오늘은 유독 더 산뜻한 느낌이에요.",
    "선생님! 요즘 들어 교실 창밖의 구름이 매일 신비롭게 피어나네요.",
    "선생님, 늘 친절하게 챙겨주시는 배려에 깊이 감사드리고 있어요.",
    "선생님, 이번에 새로 산 필기구 필기감이 진짜 예술인데 써보실래요?",
    "선생님, 오늘따라 따스한 햇살이 교실 복도 끝까지 가득 들어오네요.",
    "선생님, 가볍게 미소 짓는 것만으로도 하루 피로가 싹 가시는 느낌입니다.",
    "선생님, 혹시 퇴근하고 가볍게 저녁 노을 산책길 걸어보실 생각 있으세요?",
    "선생님 덕에 교직 생활의 활력과 든든한 의리를 몸소 느낍니다.",
    "선생님, 항상 깔끔하고 예쁜 학급 환경 가꾸시는 비결이 뭔가요?",
    "선생님, 오늘 커피 한 잔에 소소한 담소를 곁들이면 천국이 따로 없겠네요.",
    "선생님과 나누는 유쾌한 수다는 제 하루 중 가장 즐거운 쉼터예요.",
    "선생님! 우리 반 아이가 오늘 선생님 너무 멋지시다고 얘기하더라고요."
  ];

  const MIDDLE_TEMPLATES = [
    "소소하게 가져온 간식을 같이 나눠 먹으면서,",
    "은은한 홍차 향이 퍼지는 머그잔을 조심스레 내려놓으며,",
    "재미있는 성격 심리 검사 링크를 띄운 모니터를 보며,",
    "귀여운 강아지가 꼬리를 흔드는 영상을 다 같이 구경하면서,",
    "따스한 햇살이 비치는 창가 옆 소파에 편안하게 앉아,",
    "동료 교사가 직접 내려준 신선한 핸드드립 커피를 음미하며,",
    "서로 고생 많았다고 어깨를 가볍게 토닥여주며,",
    "화단에 활짝 핀 꽃 향기를 맡으러 복도 창문을 활짝 열고,",
    "선물 받은 예쁜 문구류와 캐릭터 스티커를 이리저리 나눠주면서,",
    "오늘 급식실 조리사님이 정성껏 마련해주신 맛난 반찬 이야기를 나누며,",
    "주말에 다녀왔던 숨겨진 조용한 숲길 둘레길 코스를 지도 앱으로 짚어주며,",
    "서로의 강점과 소중한 교육관을 칭찬하는 훈훈한 대화를 도란도란 나누며,",
    "새콤달콤한 비타민 음료를 한 병씩 뚜껑을 따서 건네주며,",
    "책상 위에 놓인 귀여운 작은 반려 다육식물 화분을 살살 다듬어주며,",
    "학창 시절 추억의 옛날 노래를 나지막한 볼륨으로 함께 들으면서,",
    "교실 뒤편 게시판에 붙일 화사한 풍선 데코 디자인을 고민하면서,",
    "한바탕 웃음이 터지는 쾌활한 학교 밈 에피소드를 주고받으며,",
    "선생님이 가져오신 은은한 민트향 핸드크림을 손등에 듬뿍 덜어 바르며,",
    "가정 시간에 아이들이 직접 구워 선물로 준 컵케이크를 한 입씩 배어 물고,",
    "학교 근처 새로 생긴 디저트 베이커리의 소금빵 대기 줄 소식을 나누며,",
    "지나가는 아이들이 해맑게 손 흔드는 모습을 흐뭇한 미소로 보며,",
    "교직원 동호회에서 준비한 힐링 꽃꽂이 클래스의 싱싱한 카네이션을 정리하며,",
    "서로의 건강을 챙겨주는 유기농 발효 매실 원액을 생수에 따뜻하게 타 마시며,",
    "복도 게시판에 걸어둘 알록달록한 아이들의 그림 전시회를 감상하며,",
    "기분이 한결 상쾌해지는 라벤더 아로마 오일 스틱을 관자놀이에 살짝 바르고,",
    "주말 동안 푹 자고 일어나 한층 개운해진 컨디션을 즐겁게 뽐내며,",
    "나이스 시스템이 마침 점검 중이라 생긴 소중한 10분의 공백을 틈타,",
    "서로가 작년 학기 말에 썼던 웃음 가득한 교무수첩의 일기를 꺼내어 보며,",
    "지친 눈을 맑게 해주는 결명자차를 따스하게 한 모금 넘기면서,",
    "오늘 가벼운 정시 퇴근 후 각자 즐길 취미 생활의 신나는 계획을 조잘거리며,"
  ];

  const HARMONY_TEMPLATES = [
    "마음의 스트레스와 걱정이 사르르 녹아내리는 온기가 교무실을 듬뿍 채웁니다.",
    "서로를 깊이 신뢰하고 지지해주는 따뜻한 동료애가 물씬 느껴집니다.",
    "이 유쾌한 시간 덕분에 온종일 쌓였던 교직의 피로가 싹 가시는 느낌이에요.",
    "이심전심으로 통하는 마음들이 모여 교직원실의 햇살이 더욱 밝게 비춥니다.",
    "서로 눈빛만 봐도 웃음이 터지는 편안한 연대감이 우리를 끈끈하게 감싸 안습니다.",
    "이런 든든한 동료 교사들이 곁에 있다는 사실만으로도 큰 위안이 됩니다.",
    "한낮의 가벼운 티타임이 가져다주는 소소한 평화에 마음이 아늑해집니다.",
    "정겨운 대화 속에 배어나는 격려 덕분에 오후 수업을 해낼 자신감이 솟구쳐요.",
    "누구 하나 찡그림 없이 서로의 일상을 진심으로 축복하고 기원해 줍니다.",
    "마치 숲속 힐링 카페에 온 듯한 아늑함과 잔잔한 행복이 맴돕니다.",
    "작은 배려와 웃음들이 꽃 피어 교무실 전체가 기분 좋은 향기로 물듭니다.",
    "오늘 나눈 이 친밀한 유대감이 학교 생활을 지탱하는 가장 큰 힘이 될 거예요.",
    "아이들의 교육에 전념하느라 잠시 잊고 있던 미소와 활력을 되찾았습니다.",
    "서로의 수고를 알아주는 짧은 눈빛 교환에서 눈물이 날 만큼 찡함이 전해져요.",
    "서로가 지닌 개성과 가치를 아낌없이 존중해주는 품격 있는 대화가 이어집니다.",
    "언제나 기댈 수 있는 버팀목 같은 동료애 덕분에 생존력이 배가됩니다.",
    "유머러스한 농담 한마디에 다 같이 파안대소하며 한낮의 졸음을 날려 보냅니다.",
    "따뜻한 배려와 긍정 에너지가 순환하며 교직 생태계를 더욱 풍요롭게 만드네요.",
    "서로의 건강 비법을 신나게 공유하며 100세 시대 청춘 교육을 함께 약속합니다.",
    "지나치게 딱딱했던 학교 규칙을 넘어선 인간적인 소통의 가치를 깨닫습니다.",
    "서로의 훌륭한 교육 소신과 철학을 칭찬하며 참스승의 길을 격려해 줍니다.",
    "아무런 조건 없이 건네는 진심 어린 격려의 한마디가 심장을 두근거리게 해요.",
    "서로에게 가장 밝은 에너지를 아낌없이 전달하려는 훈훈한 노력이 엿보입니다.",
    "함께하는 동료 교직원들의 환한 웃음소리가 복도를 타고 퍼져 나갑니다.",
    "교무실 책상 사이를 오가는 작은 초콜릿 한 알에 마음이 다정해집니다.",
    "어려운 학급 일도 함께 머리를 맞대고 지혜를 구하면 무엇이든 풀릴 것 같습니다.",
    "서로를 위해 직접 타온 둥굴레차의 구수함이 온 몸의 감각을 평온하게 해줍니다.",
    "아무런 사심 없이 나누는 맑고 투명한 친목의 시간에 멘탈 게이지가 차오릅니다.",
    "서로가 가진 재능과 멋진 노하우를 즐거운 마음으로 선물하듯 주고받습니다.",
    "우리의 마음에 평화와 행복의 씨앗이 심어져 하루가 더욱 아름다워집니다."
  ];

  const ACTION_TEMPLATES = [
    "기쁜 미소를 한가득 머금은 채 당신에게 어깨동무를 하며 귀띔합니다.",
    "눈을 반짝이며 당신이 건넨 차의 향을 즐겁게 감상합니다.",
    "웃음꽃이 만발한 얼굴로 수첩에 적어둔 행복 메모를 짚어 줍니다.",
    "두 손을 모으고 당신의 따뜻한 공감에 큰 힘을 얻었다며 기뻐합니다.",
    "따뜻하게 데워진 머그잔을 꼭 쥔 채 당신을 보며 맑게 웃어 보입니다.",
    "고개를 끄덕이며 연신 감탄 어린 박수로 화답을 보냅니다.",
    "복도 창밖의 파란 하늘을 가리키며 어린아이처럼 쾌활하게 손짓합니다.",
    "주머니에서 고이 아껴둔 홍삼 젤리를 쏙 꺼내 당신 손바닥에 쥐여줍니다.",
    "안경을 고쳐 쓰며 당신의 훌륭한 교육적 유머 감각에 파안대소합니다.",
    "가슴을 쓸어내리며 역시 우리 학교 최고의 활력소라며 극찬을 아끼지 않습니다.",
    "책상 서랍에서 고이고이 아껴둔 수제 비스킷을 꺼내 살포시 넘겨줍니다.",
    "당신의 긍정적인 눈빛에 매료되어 든든한 동료의 악수를 덥석 건넵니다.",
    "두 엄지손가락을 척 올리며 당신의 넉살 좋은 태도에 빵 터져 웃습니다.",
    "가볍게 윙크를 해 보이며 퇴근 후 맛집 탐방 약속을 즐겁게 속삭입니다.",
    "화초 이파리에 분무기로 물을 살살 뿌리며 평화로운 미소를 지어 보입니다.",
    "수첩에 하트 무늬 스티커를 꾹 붙여주며 깊은 우정의 징표를 선물합니다.",
    "당신의 어깨를 다정하게 두드리며 언제든 힘들면 얘기하라고 다짐합니다.",
    "양 손에 차를 들고 즐겁게 스텝을 밟으며 다정한 눈인사를 보냅니다.",
    "소녀처럼 손으로 입을 가리고 까르르 웃으며 화사한 기류를 뿜어냅니다.",
    "기분 좋은 콧노래를 부르며 사무용품 수납함에서 예쁜 볼펜을 골라 줍니다.",
    "따뜻하게 우러난 보리차 향을 깊이 들이마시며 평온함을 만끽합니다.",
    "당신의 따스한 말동무가 되어준 배려에 연신 고마움의 눈빛을 보냅니다.",
    "책상 위 화분 위치를 볕이 잘 드는 곳으로 옮겨놓으며 즐겁게 말합니다.",
    "자신의 다이어리에 적힌 위로의 명언을 조용히 소리 내어 읽어 줍니다.",
    "당신의 쾌활한 반응에 고개를 흔들며 귀여운 장난기로 맞받아칩니다.",
    "주변의 화사한 햇살을 온몸으로 받으며 기지개를 시원하게 켭니다.",
    "품속에서 깜찍한 고양이 엽서를 꺼내 손글씨로 쓴 응원글을 건넵니다.",
    "당신의 손등에 허브 아로마 오일을 한 방울 톡 떨어뜨리며 윙크합니다.",
    "가벼운 허그와 함께 오늘 하루도 고생 많으셨다고 따뜻하게 격려합니다.",
    "손가락으로 하트를 만들어 보이며 이 훈훈한 쉼표를 오래 간직하길 기원합니다."
  ];

  // 10가지 긍정적이고 유쾌한 일상/힐링 테마 (업무 배제, 갈등 배제) [NEW]
  const positiveThemes = [
    {
      title: "향기로운 원두 커피 나눔",
      situation: "직접 볶아온 고급 콜롬비아 원두 향이 온 교무실을 향긋하게 채우고 커피 한 잔을 대접하는 모습",
      choice1: "“콜롬비아 특유의 아로마가 일품이네요!” 따뜻한 에스프레소 한 잔을 정성껏 받아 마신다.",
      effects1: [{ stat: 'hp', value: 10 }, { stat: 'mental', value: 10 }],
      result1: "“진정한 커피 매니아시군요! 이 원두는 갓 볶아서 산미가 특히 훌륭하답니다.” 동료가 미소를 짓습니다.",
      choice2: "“커피엔 역시 달달한 수제 비스킷이죠!” 서랍 속 비스킷을 꺼내 나눠 먹는다.",
      effects2: [{ stat: 'colleagueRelation', value: 15 }, { stat: 'mental', value: 10 }],
      result2: "“우와, 유자 비스킷과의 페어링이 환상적이네요!” 다 함께 커피를 나눠 먹으며 즐겁게 하하호호 웃음지었습니다.",
      choice3: "“점심 후에 마시면 완벽하겠어요!” 텀블러에 아이스 아메리카노로 채워 오후에 마신다.",
      effects3: [{ stat: 'hp', value: 8 }, { stat: 'mental', value: 10 }],
      result3: "오후 피로 시간대에 텀블러를 열자 그윽한 향이 퍼지며 온몸의 세포가 맑아져 큰 활력이 돋아났습니다.",
      choice4: "“카페인이 약해서 물을 듬뿍 타 연하게 부탁드립니다!” 구수한 아메리카노로 힐링한다.",
      effects4: [{ stat: 'hp', value: 12 }, { stat: 'mental', value: 5 }],
      result4: "연하고 숭늉처럼 구수한 커피가 위장을 따스하게 감싸며 온몸의 긴장이 부드럽게 풀려 편안해졌습니다.",
      choice5: "“향기만으로도 온 뇌가 맑아지는 느낌입니다!” 향을 천천히 음미하며 대화를 즐긴다.",
      effects5: [{ stat: 'colleagueSolidarity', value: 15 }, { stat: 'mental', value: 8 }],
      result5: "원두 향이 가득한 교무실 한구석에서 서로의 지친 손을 다독이며 끈끈한 힐링 동료애를 재확인했습니다."
    },
    {
      title: "달콤한 수제 초코 쿠키 선물",
      situation: "주말에 직접 베이킹을 했다며 갓 포장한 예쁜 수제 초코 쿠키 세트를 손에 쥐여주는 모습",
      choice1: "“진짜 파는 것보다 더 쫀득하고 맛있어요!” 감탄하며 즉석에서 시식한다.",
      effects1: [{ stat: 'mental', value: 15 }, { stat: 'hp', value: 5 }],
      result1: "“입맛에 맞으시다니 다행이네요! 다음 주엔 무화과 스콘도 구워올게요!” 기쁜 화답이 돌아왔습니다.",
      choice2: "“이 귀한 걸 주시다니, 제 아침 주스랑 교환해요!” 시원한 자몽 주스를 건넨다.",
      effects2: [{ stat: 'colleagueRelation', value: 15 }, { stat: 'mental', value: 10 }],
      result2: "자몽 주스의 상큼함과 쿠키의 달콤함이 교차하며 교무실 책상 사이가 웃음바다로 물들었습니다.",
      choice3: "“오후 당 떨어질 때를 위해 아껴두었다 먹겠습니다!” 서랍에 소중히 보관한다.",
      effects3: [{ stat: 'hp', value: 10 }, { stat: 'mental', value: 10 }],
      result3: "오후 3시 마의 시간대, 쿠키 한 입을 베어 물자 번아웃 게이지가 눈 녹듯 녹아내리며 에너지가 솟았습니다.",
      choice4: "“초콜릿의 달콤함이 하루 스트레스를 싹 날려주네요!” 크게 기뻐하며 리액션한다.",
      effects4: [{ stat: 'burnout', value: -15 }, { stat: 'mental', value: 10 }],
      result4: "당신의 활기찬 리액션에 힘을 얻은 동료 교사도 기뻐하며 수줍게 브이(V) 자를 그려 보였습니다.",
      choice5: "“우리 학년실 단체 힐링 과자 파티로 확산합시다!” 다른 쌤들과도 한 조각씩 나눈다.",
      effects5: [{ stat: 'colleagueSolidarity', value: 20 }, { stat: 'colleagueRelation', value: 10 }],
      result5: "순식간에 3반, 4반 선생님들까지 모여 쿠키 번개를 하며 서로의 건강과 안부를 다정히 보살폈습니다."
    },
    {
      title: "마음을 울리는 칭찬 롤링페이퍼",
      situation: "비밀리에 돌려 적은 나의 장점과 감사 쪽지가 가득 적힌 미니 롤링페이퍼가 책상에 놓여진 모습",
      choice1: "“제 묵묵한 노력을 알아주셨다니 감동입니다.” 한 자 한 자 소리 내어 정독한다.",
      effects1: [{ stat: 'mental', value: 20 }, { stat: 'educationSoshin', value: 15 }],
      result1: "따뜻한 격려 문구들에 눈가가 촉촉해지며 교사로서의 보람과 교육적 소신이 마음 깊숙이 샘솟았습니다.",
      choice2: "“저도 동료분들께 보답 칭찬 엽서를 써야겠어요!” 알록달록한 메모지에 답장을 적어 붙인다.",
      effects2: [{ stat: 'colleagueRelation', value: 20 }, { stat: 'colleagueSolidarity', value: 15 }],
      result2: "칭찬의 선순환이 일어나며 교무실 파티션 너머로 다정한 미소와 감사 인사가 쉴 새 없이 오고 갔습니다.",
      choice3: "수첩 가장 첫 페이지에 보물처럼 꾹 끼워두고 피로할 때마다 꺼내보기로 한다.",
      effects3: [{ stat: 'hp', value: 10 }, { stat: 'mental', value: 15 }],
      result3: "수첩을 열 때마다 든든한 동료들의 손글씨가 빛을 발해, 어떤 시련이 와도 버텨낼 정신력이 다져졌습니다.",
      choice4: "교무실 한가운데서 큰 소리로 “여러분 사랑합니다!” 외치며 유쾌한 에너지를 뿜는다.",
      effects4: [{ stat: 'reputation', value: 15 }, { stat: 'colleagueRelation', value: 12 }],
      result4: "선생님들의 웃음소리가 울려 퍼지며 교직원들 사이에서 ‘쾌활하고 인간미 넘치는 최고의 동료’로 평가받았습니다.",
      choice5: "글씨체들을 보며 어느 선생님이 썼는지 맞추는 즐거운 성격 퀴즈 담소를 나눈다.",
      effects5: [{ stat: 'colleagueSolidarity', value: 18 }, { stat: 'mental', value: 10 }],
      result5: "“이 삐뚤빼뚤 정겨운 글씨는 체육 쌤이네!” 서로 폭소를 터뜨리며 한낮의 정겨운 교류를 즐겼습니다."
    },
    {
      title: "귀염 뽀짝 반려동물 재롱 잔치",
      situation: "스마트폰 화면을 들이밀며 반려묘/반려견이 부린 치명적인 애교 사진을 자랑하며 웃는 모습",
      choice1: "“어머나, 이 솜방망이 같은 발바닥 좀 봐!” 귀여움에 몸서리치며 같이 우쭈쭈한다.",
      effects1: [{ stat: 'mental', value: 20 }, { stat: 'hp', value: 5 }],
      result1: "동그랗게 뜬 고양이의 눈망울 사진을 연신 확대해 보며 마음이 몽글몽글해지는 극상의 정서 안정을 얻었습니다.",
      choice2: "“우리 집 앵무새 재롱도 만만치 않답니다!” 키우는 동물 사진을 꺼내 배틀을 벌인다.",
      effects2: [{ stat: 'colleagueRelation', value: 15 }, { stat: 'mental', value: 15 }],
      result2: "동물 장기자랑 배틀로 이어지며 앵무새의 “안녕!” 목소리 녹음에 교무실이 한바탕 시끌벅적 웃음꽃을 피웠습니다.",
      choice3: "동물의 힐링 에너지를 전수받아 쌓였던 스트레스를 한 번에 정화한다.",
      effects3: [{ stat: 'burnout', value: -18 }, { stat: 'hp', value: 8 }],
      result3: "동물의 꼬리 흔드는 짤막한 움짤이 뇌세포의 지친 회로를 치유해주어 머리가 상쾌하게 정화되었습니다.",
      choice4: "“이 귀여운 사진, 단톡방에도 올려서 모두 힐링하게 해주세요!” 단톡방 공유를 청한다.",
      effects4: [{ stat: 'colleagueSolidarity', value: 15 }, { stat: 'reputation', value: 10 }],
      result4: "학년 단톡방이 하트 이모티콘과 웃음으로 도배되며 오늘 하루의 친목 기류가 훈훈하게 고조되었습니다.",
      choice5: "동물들의 간식 정보와 건강 관리 노하우를 즐겁게 수다 떨며 친목을 돈독히 한다.",
      effects5: [{ stat: 'colleagueRelation', value: 18 }, { stat: 'mental', value: 8 }],
      result5: "수제 간식 매장을 공유하고 반려동물 공동 집사 모임을 약속하며 다정한 친목 관계를 형성했습니다."
    },
    {
      title: "기력 보강 홍삼 에센스 선물",
      situation: "안색이 조금 지쳐 보였는지 다가와 힘내라며 최고급 홍삼 정과 스틱을 슥 쥐여주는 모습",
      choice1: "“크으, 역시 우리 쌤밖에 없습니다!” 즉석에서 이로 뜯어 쓴맛을 삼킨다.",
      effects1: [{ stat: 'hp', value: 20 }, { stat: 'mental', value: 10 }],
      result1: "입안 가득 퍼지는 정통 사포닌의 쓴맛에 정신이 번쩍 들며, 다리에 뜨거운 혈류가 도는 기력을 회복했습니다.",
      choice2: "“귀한 한약을 주셨으니, 제가 가진 비타민C 젤리를 듬뿍 드릴게요!” 보답을 전한다.",
      effects2: [{ stat: 'colleagueRelation', value: 15 }, { stat: 'hp', value: 15 }],
      result2: "서로의 건강 주치의를 자처하며 영양제를 가득 교환해, 신체 활력 지표가 최고조로 올라섰습니다.",
      choice3: "따뜻한 온수에 홍삼 스틱을 짜 넣고 홍삼차로 우려내어 향긋하게 마신다.",
      effects3: [{ stat: 'hp', value: 18 }, { stat: 'mental', value: 12 }],
      result3: "은은한 약초 향이 목구멍을 부드럽게 감싸고 돌며 땀구멍이 싹 열리더니 몸이 아주 가뿐해졌습니다.",
      choice4: "“호랑이 기운이 솟아나네요! 오후 수업 자신 있습니다!” 우렁차게 감사한다.",
      effects4: [{ stat: 'expert', value: 10 }, { stat: 'hp', value: 12 }],
      result4: "힘찬 포효와 미소로 감사를 전하자 교무실 분위기가 덩달아 활기를 띠며 긍정 에너지가 순환했습니다.",
      choice5: "“우리 건강하게 정년퇴임까지 함께 달려갑시다!” 손을 맞잡고 끈끈한 의리를 다진다.",
      effects5: [{ stat: 'colleagueSolidarity', value: 20 }, { stat: 'colleagueRelation', value: 10 }],
      result5: "“김 쌤, 나 아프면 대신 병가 기결 올려주기다!” 끈끈한 교직 전우애를 웃으며 맹세했습니다."
    },
    {
      title: "라벤더 아로마 미니 캔들 힐링",
      situation: "교무실 한구석에 은은한 숲속 향이 나는 라벤더 아로마 미니 캔들을 켜서 긴장을 완화해 주는 모습",
      choice1: "“마치 아로마 마사지 숍에 온 듯 안락하네요.” 눈을 감고 깊은 쉼을 취한다.",
      effects1: [{ stat: 'hp', value: 18 }, { stat: 'mental', value: 15 }],
      result1: "은은한 불빛과 향기에 10분간 뇌를 완전 휴식하여 오염된 스트레스 수치가 대폭 디톡스되었습니다.",
      choice2: "라벤더 향이 가장 잘 퍼지도록 가습기 바람 방향을 맞추어 최적의 쾌적함을 즐긴다.",
      effects2: [{ stat: 'mental', value: 18 }, { stat: 'burnout', value: -12 }],
      result2: "쾌적하고 건조하지 않은 완벽한 힐링 대기가 조성되어 눈의 피로와 어깨 결림이 편안히 풀어졌습니다.",
      choice3: "허브 향이 가득한 교무실에서 차분한 음악을 깔아 다른 선생님들과 힐링 명상을 한다.",
      effects3: [{ stat: 'colleagueSolidarity', value: 18 }, { stat: 'colleagueRelation', value: 12 }],
      result3: "교무실이 마치 요가 센터처럼 변모하며 선생님들과 함께 깊은 심호흡으로 정서적 안정을 이뤄냈습니다.",
      choice4: "캔들의 은은한 불빛 아래에서 소소한 차를 곁들이며 아늑한 티타임을 나눈다.",
      effects4: [{ stat: 'hp', value: 12 }, { stat: 'mental', value: 12 }],
      result4: "잔잔히 타오르는 불꽃을 멍하니 응시(불멍)하며 교직의 바쁜 속도를 늦추고 삶의 평화를 음미했습니다.",
      choice5: "“향기 테라피 최고예요!” 보건 선생님께 머그잔 가득 따뜻한 매실차를 대접한다.",
      effects5: [{ stat: 'colleagueRelation', value: 20 }, { stat: 'mental', value: 8 }],
      result5: "보건 선생님은 “어머, 김 쌤 센스 쟁이!”라며 감동하여 고급 허브 티백 한 상자를 추가 보너스로 안겨주셨습니다."
    },
    {
      title: "비밀의 학교 뒷산 숲길 산책",
      situation: "학교 뒷마당과 연결된 교직원들만 아는 호젓하고 조용한 솔밭 산책길 코스를 신나게 브리핑해 주는 모습",
      choice1: "“오늘 점심 먹고 바로 10분만 숲길 피톤치드 쐬러 가요!” 즉석 약속을 잡는다.",
      effects1: [{ stat: 'hp', value: 18 }, { stat: 'colleagueRelation', value: 15 }],
      result1: "울창한 소나무 아래 흙길을 밟으며 신선한 솔바람을 쐬니 묵었던 다리 피로가 시원하게 날아갔습니다.",
      choice2: "숲길에 핀 들꽃과 야생화 사진들을 같이 보며 꽃 구경 삼매경에 빠진다.",
      effects2: [{ stat: 'mental', value: 18 }, { stat: 'hp', value: 8 }],
      result2: "노란 아기 민들레와 제비꽃 사진을 확대해보며 온 세상이 맑고 순수해지는 심미적 힐링을 누렸습니다.",
      choice3: "솔향 가득한 바람길 코스를 가슴속에 저장해두고 혼자만의 아지트로 삼기로 한다.",
      effects3: [{ stat: 'mental', value: 15 }, { stat: 'educationSoshin', value: 10 }],
      result3: "바람이 불 때마다 사각거리는 대나무 소리가 뇌리에 맴돌아, 교실에서 흔들리지 않을 교육 소신을 채웠습니다.",
      choice4: "“그 길에 벤치 놓아달라고 행정실에 건의해볼까요?” 유쾌한 의견을 제안한다.",
      effects4: [{ stat: 'colleagueSolidarity', value: 15 }, { stat: 'reputation', value: 10 }],
      result4: "“오, 그거 명안이네!” 부장 선생님들까지 합세해 학교 힐링 로드 기획안 수립에 힘을 보탰습니다.",
      choice5: "“체육 부장님이 가이드해주시니 더 든든하네요!” 고마운 마음을 전하며 손을 흔든다.",
      effects5: [{ stat: 'colleagueRelation', value: 18 }, { stat: 'mental', value: 10 }],
      result5: "체육 선생님은 어깨를 으쓱하며 “김 쌤이 좋아하시니 매주 한 번씩 숲길 가이드를 해드리겠다”며 흔쾌히 웃었습니다."
    },
    {
      title: "빵 터지는 성격 타로 심리 테스트",
      situation: "쉬는 시간 스마트폰 앱으로 해볼 수 있는 유쾌한 교사 전용 심리 테스트 결과를 맞춰보는 모습",
      choice1: "“어머, ‘아이들을 너무 사랑해서 둥지를 트는 어미새 유형’이라니 딱 제 이야기네요!” 빵 터져 웃는다.",
      effects1: [{ stat: 'mental', value: 20 }, { stat: 'colleagueRelation', value: 12 }],
      result1: "동료 교사들이 격하게 고개를 끄덕이며 “어미새 김 선생님!”이라고 놀리며 교무실이 함박웃음으로 가득 찼습니다.",
      choice2: "동료들의 ‘외유내강 츤데레 댕댕이 교사’ 같은 반전 결과를 보며 손뼉을 치며 깔깔 웃는다.",
      effects2: [{ stat: 'colleagueSolidarity', value: 20 }, { stat: 'mental', value: 15 }],
      result2: "늘 엄격해 보였던 선배 교사님이 사실 댕댕이 성향이라는 귀여운 사실에 모두가 한바탕 뒤집어지게 웃었습니다.",
      choice3: "재미로 보는 결과지만 서로의 장점과 애로사항을 깊이 이해하고 따스하게 안아준다.",
      effects3: [{ stat: 'colleagueRelation', value: 18 }, { stat: 'colleagueSolidarity', value: 18 }],
      result3: "“김 선생님도 참 많이 외로우셨겠어요.” 툭 던진 위로 한마디에 정서적 응어리가 따뜻하게 봉합되었습니다.",
      choice4: "“우리 이 기세를 몰아 교직원 성격 유형 분석 학술회로 승화시킬까요?” 농담한다.",
      effects4: [{ stat: 'expert', value: 10 }, { stat: 'mental', value: 10 }],
      result4: "학생 지도와 동료 교제 시 성격 성향별 매칭 노하우를 깨닫는 은밀하고 유익한 성찰의 시간을 가졌습니다.",
      choice5: "서로의 숨겨진 고민과 위로를 심리 테스트 결과를 빌려 스스럼없이 나누며 돈독해진다.",
      effects5: [{ stat: 'mental', value: 15 }, { stat: 'hp', value: 8 }],
      result5: "“마음이 통하니 학교가 더 이상 직장으로만 느껴지지 않네요.” 깊은 신뢰를 구축했습니다."
    },
    {
      title: "건조한 손길을 녹이는 허브 핸드크림",
      situation: "구입한 은은한 시트러스 유자향 핸드크림을 듬뿍 짜서 촉촉하게 바르라고 내밀어 주는 모습",
      choice1: "“유자향이 정말 상큼하고 싱그럽네요!” 손등 전체에 듬뿍 덜어 부드럽게 바른다.",
      effects1: [{ stat: 'hp', value: 15 }, { stat: 'mental', value: 15 }],
      result1: "겨울철 트고 따갑던 손 피부가 촉촉해지고, 퍼지는 천연 유자향에 코끝이 찡할 정도로 향기 힐링을 만끽했습니다.",
      choice2: "“손이 많이 트셨는데 제 것도 좀 발라보세요!” 시어버터 밤을 건네며 교환한다.",
      effects2: [{ stat: 'colleagueRelation', value: 18 }, { stat: 'hp', value: 10 }],
      result2: "유자와 시어버터 향이 화사하게 섞여 퍼지며 교무실 파티션 사이가 숲속 온실처럼 다정하게 변모했습니다.",
      choice3: "상큼한 유자향을 맡으며 손 지압 마사지 노하우를 서로 시연해주며 유쾌하게 힐링한다.",
      effects3: [{ stat: 'hp', value: 20 }, { stat: 'mental', value: 8 }],
      result3: "“아이고, 거기 지압하니 눈이 번쩍 뜨이네요!” 혈자리 마사지로 피로를 싹 풀고 어깨도 가벼워졌습니다.",
      choice4: "“손이 촉촉해지니 기분까지 맑아지네요!” 동료 선생님 책상에 예쁜 귤 하나를 올려둔다.",
      effects4: [{ stat: 'colleagueRelation', value: 15 }, { stat: 'mental', value: 12 }],
      result4: "주거니 받거니 건네는 소소한 귤 한 알에서 따뜻한 온기가 마음까지 촉촉하게 적셔주었습니다.",
      choice5: "“우리 교무실 대표 촉촉 손 관리 동맹을 맺읍시다!” 즐겁게 하이파이브를 한다.",
      effects5: [{ stat: 'colleagueSolidarity', value: 18 }, { stat: 'mental', value: 10 }],
      result5: "“좋아요! 내일은 페퍼민트 핸드크림 당번입니다!” 하이파이브 소리와 함께 동료애의 웃음이 터졌습니다."
    },
    {
      title: "학년실을 화사하게 채우는 꽃병 화초",
      situation: "정원에서 꺾어온 싱싱한 노란 프리지아 꽃다발과 작은 유리 꽃병을 가져와 책상 가운데 올려두는 모습",
      choice1: "“꽃이 있고 없고의 차이가 어마어마하네요!” 매일 물을 갈아주는 당번을 수락한다.",
      effects1: [{ stat: 'colleagueRelation', value: 18 }, { stat: 'mental', value: 15 }],
      result1: "매일 아침 꽃병에 맑은 물을 채우는 소소한 기쁨이 등굣길 발걸음을 가볍고 상쾌하게 채워줍니다.",
      choice2: "노란 꽃망울을 지그시 바라보며 마음속 쌓였던 스트레스를 봄눈 녹듯 정화한다.",
      effects2: [{ stat: 'burnout', value: -20 }, { stat: 'hp', value: 8 }],
      result2: "초록 잎새와 밝은 노랑빛이 시야에 들어올 때마다 뇌파가 차분히 진정되어 안정을 선물받았습니다.",
      choice3: "꽃병 옆에 예쁜 스탠드 조명을 켜서 미니 교무실 가든 같은 근사한 포토존을 만든다.",
      effects3: [{ stat: 'mental', value: 18 }, { stat: 'reputation', value: 12 }],
      result3: "교무실을 방문하는 다른 학년 쌤들이 “어머, 여긴 카페 같네!”라며 연신 감탄과 부러움을 뿜었습니다.",
      choice4: "“향기가 너무 달콤해서 하루 내내 행복하겠어요!” 꽃 선물을 해준 쌤을 격하게 안아준다.",
      effects4: [{ stat: 'colleagueSolidarity', value: 20 }, { stat: 'colleagueRelation', value: 15 }],
      result4: "다정하고 쾌활한 포옹과 인사를 나누며 삭막했던 일터에 따스한 인간성과 동료 교류의 꽃을 피웠습니다.",
      choice5: "“프리지아의 꽃말은 ‘당신의 시작을 응원합니다’라더군요. 우리 모두 힘냅시다!” 메시지를 적는다.",
      effects5: [{ stat: 'educationSoshin', value: 15 }, { stat: 'mental', value: 10 }],
      result5: "프리지아 메시지 카드가 전해준 잔잔한 감동이 온 학년 선생님들의 마음의 짐을 가볍게 다독였습니다."
    }
  ];

  // [NEW] 중립(잡담/정보 교환) 테마 — 소폭의 정보·관계 변화. 항상-긍정 일색을 깬다.
  const neutralThemes: DialogueTheme[] = [
    {
      title: "다음 주 시간표 변경 공유",
      situation: "다음 주 학년 행사 때문에 시간표가 조금 바뀐다며 변경안을 같이 들여다보자고 합니다.",
      choice1: "“미리 알려주셔서 감사해요. 우리 반 진도도 같이 맞춰볼게요.”", effects1: [{ stat: 'colleagueRelation', value: 5 }, { stat: 'expert', value: 2 }], result1: "두 사람은 진도와 시간표를 깔끔히 정리해 서로의 부담을 덜었습니다.",
      choice2: "“바뀌는 김에 우리 반 체육이랑 한 칸만 바꿔주실 수 있을까요?”", effects2: [{ stat: 'colleagueRelation', value: 3 }, { stat: 'mental', value: 3 }], result2: "사소한 조정이지만 서로 융통성 있게 맞춰주며 가벼운 호의를 주고받았습니다.",
      choice3: "“복잡하네요. 일단 공유해주신 대로 따라갈게요.”", effects3: [{ stat: 'mental', value: -1 }], result3: "특별한 이견 없이 변경안을 받아들이고 각자 준비에 들어갔습니다."
    },
    {
      title: "학년 공동 학습지 자료 교환",
      situation: "이번 단원 학습지를 자기가 만든 게 있다며 파일을 공유해줄지 묻습니다.",
      choice1: "“정말 감사해요! 저도 제가 만든 평가 자료 드릴게요.”", effects1: [{ stat: 'colleagueSolidarity', value: 8 }, { stat: 'expert', value: 4 }], result1: "서로의 자료를 주고받으며 수업 준비 부담을 크게 덜었습니다.",
      choice2: "“좋아요. 대신 출처랑 난이도만 같이 확인해봐요.”", effects2: [{ stat: 'expert', value: 5 }, { stat: 'colleagueRelation', value: 3 }], result2: "자료의 완성도를 함께 점검하며 실속 있는 협업을 했습니다.",
      choice3: "“마음은 감사한데, 저는 제 스타일대로 만들어 볼게요.”", effects3: [{ stat: 'educationSoshin', value: 4 }, { stat: 'colleagueRelation', value: -2 }], result3: "정중히 사양했지만, 상대도 각자의 방식을 존중해주었습니다."
    },
    {
      title: "점심 메뉴와 주말 잡담",
      situation: "급식 메뉴 이야기로 시작해 주말에 뭐 했는지 가볍게 수다를 겁니다.",
      choice1: "“주말에 푹 쉬었어요. 선생님은요?” 자연스럽게 안부를 주고받는다.", effects1: [{ stat: 'mental', value: 6 }, { stat: 'colleagueRelation', value: 4 }], result1: "별것 아닌 잡담이지만 잠시 긴장을 풀고 웃을 수 있었습니다.",
      choice2: "“사실 주말에도 일 생각만 했네요.” 솔직하게 털어놓는다.", effects2: [{ stat: 'mental', value: 3 }, { stat: 'colleagueSolidarity', value: 5 }], result2: "비슷한 고충에 공감하며 서로를 다독였습니다.",
      choice3: "“얘기 좋은데 제가 곧 수업이라, 다음에 마저 해요.” 가볍게 마무리한다.", effects3: [{ stat: 'mental', value: 1 }], result3: "짧게 인사를 나누고 각자 일과로 돌아갔습니다."
    },
    {
      title: "신규 업무 시스템 사용법 문의",
      situation: "새로 바뀐 행정 시스템 입력 방식을 잘 모르겠다며 혹시 아느냐고 물어봅니다.",
      choice1: "“제가 아는 만큼 같이 해봐요.” 옆에서 차근차근 알려준다.", effects1: [{ stat: 'colleagueSolidarity', value: 7 }, { stat: 'hp', value: -2 }], result1: "함께 머리를 맞대 입력을 끝냈고, 상대는 진심으로 고마워했습니다.",
      choice2: "“저도 헷갈려서요. 행정실에 같이 물어보러 갈까요?”", effects2: [{ stat: 'colleagueRelation', value: 4 }, { stat: 'adminPower', value: 2 }], result2: "둘이 함께 확인하러 가 정확한 방법을 익혔습니다.",
      choice3: "“제가 정리해둔 매뉴얼 메모가 있어요. 보내드릴게요.”", effects3: [{ stat: 'expert', value: 4 }, { stat: 'reputation', value: 3 }], result3: "깔끔한 메모 공유에 ‘일 잘하는 선생님’이라는 인상을 남겼습니다."
    }
  ];

  // [NEW] 갈등/고민 테마 — 선택에 따라 관계·소신·멘탈이 오르내린다. 부정적 결과도 가능.
  const conflictThemes: DialogueTheme[] = [
    {
      title: "은근한 업무 떠넘기기",
      situation: "“선생님이 컴퓨터를 잘하시니까…” 하며 학년 공통 업무를 슬쩍 떠넘기려 합니다.",
      choice1: "“이번엔 도와드릴게요. 대신 다음 공통 업무는 같이 나눠요.” 조건을 걸고 수락한다.", effects1: [{ stat: 'colleagueRelation', value: 5 }, { stat: 'burnout', value: 8 }, { stat: 'hp', value: -5 }], result1: "당장은 부담이 늘었지만, 형평성을 짚어 둔 덕에 다음을 기약할 수 있었습니다.",
      choice2: "“죄송하지만 저도 지금 일이 많아서요. 이건 같이 분담했으면 해요.” 정중히 선을 긋는다.", effects2: [{ stat: 'educationSoshin', value: 8 }, { stat: 'colleagueRelation', value: -8 }, { stat: 'mental', value: -4 }], result2: "관계엔 약간 금이 갔지만, 부당한 떠넘기기에 휘둘리지 않는 원칙을 지켰습니다.",
      choice3: "“부장님께 업무 분장을 다시 정리해달라고 함께 건의해봐요.” 공식 절차로 돌린다.", effects3: [{ stat: 'adminPower', value: 5 }, { stat: 'colleagueSolidarity', value: 3 }, { stat: 'colleagueRelation', value: -3 }], result3: "감정 다툼 대신 공식 분장 조정으로 끌고 가 깔끔하게 정리했습니다."
    },
    {
      title: "학생 지도 방식 의견 충돌",
      situation: "같은 학년 교사가 “그 반은 너무 풀어준다”며 당신의 생활지도 방식을 에둘러 지적합니다.",
      choice1: "“의견 감사해요. 다만 우리 반 상황은 제가 더 잘 아니, 방향은 제가 정할게요.” 부드럽지만 단호히 답한다.", effects1: [{ stat: 'educationSoshin', value: 8 }, { stat: 'mental', value: -3 }, { stat: 'colleagueRelation', value: -5 }], result1: "교육 소신을 지켰지만, 동료와는 미묘한 거리감이 남았습니다.",
      choice2: "“그렇게 보이셨군요. 어떤 점이 걱정되셨는지 더 듣고 싶어요.” 일단 경청한다.", effects2: [{ stat: 'colleagueRelation', value: 6 }, { stat: 'mental', value: -2 }], result2: "방어 대신 경청을 택하자 상대도 누그러져 진짜 우려를 나눌 수 있었습니다.",
      choice3: "“우리 지도 기준을 학년 차원에서 한번 맞춰볼까요?” 공동 기준 마련을 제안한다.", effects3: [{ stat: 'colleagueSolidarity', value: 8 }, { stat: 'expert', value: 3 }, { stat: 'burnout', value: 4 }], result3: "갈등을 학년 공동 규칙 정비의 계기로 바꿔, 오히려 협력 분위기를 만들었습니다."
    },
    {
      title: "회식 불참을 둘러싼 서운함",
      situation: "학년 회식에 또 빠진다는 말에 “요즘 통 안 어울린다”며 서운함을 내비칩니다.",
      choice1: "“가족이랑 한 약속이라서요. 다음 점심은 제가 살게요.” 솔직히 말하고 대안을 낸다.", effects1: [{ stat: 'familySatisfaction', value: 5 }, { stat: 'colleagueRelation', value: 2 }, { stat: 'mental', value: 2 }], result1: "사정을 솔직히 전하고 대안을 제시하자 상대도 이해하며 풀어졌습니다.",
      choice2: "“마음 불편하게 해드렸네요. 이번엔 잠깐이라도 들를게요.” 무리해서 맞춘다.", effects2: [{ stat: 'colleagueRelation', value: 7 }, { stat: 'hp', value: -6 }, { stat: 'familySatisfaction', value: -5 }], result2: "관계는 좋아졌지만, 개인 시간과 체력을 적잖이 내주어야 했습니다.",
      choice3: "“회식 문화 자체를 좀 가볍게 바꿔보면 어떨까요?” 분위기 자체에 의견을 낸다.", effects3: [{ stat: 'educationSoshin', value: 5 }, { stat: 'colleagueRelation', value: -4 }, { stat: 'reputation', value: 3 }], result3: "민감한 주제를 건드렸지만, 비슷한 생각을 하던 동료들의 은근한 지지를 받았습니다."
    },
    {
      title: "공개수업 참관 부담 토로",
      situation: "다가오는 공개수업 참관단에 서로 들어가야 하는데, 자기 대신 들어가 줄 수 있냐고 부탁 같은 압박을 합니다.",
      choice1: "“이번엔 제가 들어갈게요. 대신 다음 차례는 부탁드려요.” 흔쾌히 맡되 차후를 정한다.", effects1: [{ stat: 'colleagueSolidarity', value: 6 }, { stat: 'burnout', value: 5 }], result1: "부담을 나눠 지는 대신 다음 순번을 분명히 해 서로 공평함을 지켰습니다.",
      choice2: "“저도 그날 우리 반 수업 준비가 빠듯해서요. 원래대로 가는 게 좋겠어요.” 정중히 거절한다.", effects2: [{ stat: 'educationSoshin', value: 6 }, { stat: 'colleagueRelation', value: -6 }], result2: "부탁을 거절해 잠시 어색해졌지만, 자기 수업을 지키는 선택을 했습니다.",
      choice3: "“공정하게 제비뽑기로 정하는 게 어때요?” 객관적 방법을 제안한다.", effects3: [{ stat: 'reputation', value: 4 }, { stat: 'colleagueRelation', value: -2 }, { stat: 'mental', value: 2 }], result3: "감정 소모 없이 공정한 방식으로 정하자고 제안해 깔끔하게 매듭지었습니다."
    }
  ];

  // [NEW] 150개 슬롯을 긍정(50%)·중립(30%)·갈등(20%)으로 분배해 항상-긍정 반복을 깬다.
  const slot = index % 10;
  let valence: EventValence;
  let t: DialogueTheme;
  if (slot < 5) {
    valence = 'positive';
    t = positiveThemes[index % positiveThemes.length] as DialogueTheme;
  } else if (slot < 8) {
    valence = 'neutral';
    t = neutralThemes[index % neutralThemes.length];
  } else {
    valence = 'negative';
    t = conflictThemes[index % conflictThemes.length];
  }

  return {
    id: eventId,
    title: t.title,
    valence,
    generateSteps: (npcName: string, role?: string, npcId?: string) => {
      const roleLabel = role || '동료 교사';
      const personality = getPersonality(npcId);
      let opener: string;
      if (valence === 'positive') {
        // 긍정 테마는 성향별로 편향된 템플릿 조합 + 여러 문장 뼈대 중 하나를 골라 말문을 연다
        const prefix = pickFromPool(PREFIX_TEMPLATES, personality);
        const middle = pickFromPool(MIDDLE_TEMPLATES, personality);
        const harmony = pickFromPool(HARMONY_TEMPLATES, personality);
        const action = pickFromPool(ACTION_TEMPLATES, personality);
        const skeletons = [
          `"${roleLabel}로서 드리는 말씀인데... ${prefix} ${middle} ${harmony}" ${npcName} 교사가 ${action}`,
          `${npcName} 교사가 슬며시 다가와 운을 뗍니다. "${prefix} ${middle} ${harmony}" 그리고는 ${action}`,
          `"${prefix}" ${npcName} 교사(${roleLabel})가 ${middle} ${harmony} 그러면서 ${action}`,
          `복도에서 마주친 ${npcName} 교사가 말을 건넵니다. "${prefix}" ${middle} ${harmony} ${npcName} 교사가 ${action}`
        ];
        opener = skeletons[Math.floor(Math.random() * skeletons.length)];
      } else if (valence === 'neutral') {
        const wrappers = [
          `"${npcName} 교사(${roleLabel})가 가볍게 다가옵니다. ${t.situation}"`,
          `"${npcName} 교사가 서류를 든 채 슬쩍 말을 건넵니다. ${t.situation}"`,
          `"지나가던 ${npcName} 교사가 잠시 멈춰 섭니다. ${t.situation}"`,
          `"${npcName} 교사(${roleLabel})와 복도에서 마주쳤습니다. ${t.situation}"`
        ];
        opener = wrappers[Math.floor(Math.random() * wrappers.length)];
      } else {
        const wrappers = [
          `"${npcName} 교사(${roleLabel})의 표정이 평소와 조금 다릅니다. ${t.situation}"`,
          `"${npcName} 교사가 다소 굳은 얼굴로 다가옵니다. ${t.situation}"`,
          `"${npcName} 교사가 머뭇거리다 입을 엽니다. ${t.situation}"`,
          `"평소와 다르게 ${npcName} 교사의 목소리에 날이 서 있습니다. ${t.situation}"`
        ];
        opener = wrappers[Math.floor(Math.random() * wrappers.length)];
      }
      return buildStepsFromTheme(t, valence, npcName, opener);
    }
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
      choice4: "학급 아이들 전체에게 익명 사례로 공표하여, ‘생성형 인공지능과 학문적 정직성’에 관한 학급 자치 자율 규칙을 토론해 제정한다.",
      effects4: [{ stat: 'classManagement', value: 10 }, { stat: 'studentTrust', value: 4 }, { stat: 'burnout', value: 2 }],
      result4: "학급 자치 회의를 기화로 학생들 스스로 평가 규범을 만들게 조율하여 학급 운영 능력을 돋보이게 다졌습니다.",
      choice5: "학교 정보 전문 부장님 및 교내 인공지능 선도 교사에게 의뢰하여, 표절 검증 솔루션을 통한 객관적 피드백 세션으로 이송 처리한다.",
      effects5: [{ stat: 'expert', value: 10 }, { stat: 'adminTrust', value: 6 }, { stat: 'mental', value: 2 }],
      result5: "교내 전문 교사 지원 망을 구축해 과학적인 표절 방지 기법 컨설팅을 도입하여 사안을 매끄럽게 처리했습니다."
    },
    {
      title: "교실 은따 방치 위기 중재",
      situation: "반 아이들 몇 명이 단체 카톡방에서 특정 한 명을 초대하고 조롱하거나 내쫓는 ‘카톡 감옥’을 주도한 정황을 포착했습니다.",
      choice1: "학교 폭력 예방 매뉴얼에 따라 가해 학생 전원의 스마트폰을 임시 수거하고 부모 소환 면담 조치로 단호히 처벌한다.",
      effects1: [{ stat: 'educationSoshin', value: 10 }, { stat: 'parentComplaint', value: 10 }, { stat: 'studentTrust', value: 4 }],
      result1: "강력한 생활 지도로 교내 학폭 범죄 기조에 엄격히 대처했으나, 가해측 학부모들의 단체 항의와 민원이 빗발칠 예정입니다.",
      choice2: "방과 후에 당사자 학생들을 모두 Wee클래스에 의뢰하고 역할극 등의 집단 상담 치료를 통해 교우 관계를 중재한다.",
      effects2: [{ stat: 'studentTrust', value: 8 }, { stat: 'mental', value: -4 }, { stat: 'expert', value: 8 }],
      result2: "Wee클래스와 연계한 전문적 집단 상담 솔루션을 적용해 장기적인 교우 관계 복원에 집중했습니다. 단, 집중 조율을 위해 에너지가 크게 쓰였습니다.",
      choice3: "가해 학생 부모들에게 즉시 상황의 심각성을 설명하는 전화를 걸어, 가가호호 스마트폰 사용 시간 제어 및 가정 연계 지도를 촉구한다.",
      effects3: [{ stat: 'parentTrust', value: 8 }, { stat: 'studentTrust', value: 2 }, { stat: 'mental', value: -3 }],
      result3: "부모들에게 사실을 명확히 전달하여 사건의 가해를 원천 차단하는 신속한 학부모 연대 대책을 취했습니다.",
      choice4: "학급 회의 시간표를 활용해 ‘우리가 만드는 사이버 폭력 없는 단톡방 약속’을 자발적으로 제정하여 학급 자치 서약을 맺게 한다.",
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
      choice4: "학급 전체 자치 토론 안건으로 ‘수업 시간 방해 행동 대처 벌칙 규칙’을 상정해 아이들 스스로 반항 행동의 제재안을 정하게 유도한다.",
      effects4: [{ stat: 'classManagement', value: 10 }, { stat: 'studentTrust', value: 4 }, { stat: 'adminPower', value: -2 }],
      result4: "학급 자치 규칙에 힘입어 교사 개인의 감정 소모 없이 학급 운영 가이드를 확립했습니다.",
      choice5: "학교 상담 전문 Wee클래스에 학생을 ‘분노 조절 장애 및 규칙 거부’로 일차 상담 인계 이송하여 위탁 치료를 개시한다.",
      effects5: [{ stat: 'expert', value: 8 }, { stat: 'adminTrust', value: 6 }, { stat: 'mental', value: 4 }],
      result5: "교내 전문 상담 센터에 사건 지도를 이송해 교사의 멘탈 방어와 객관적인 솔루션 배정을 완료했습니다."
    }
  ];

  const defaultTheme = {
    title: `학급 아동 개별 지도 (${index + 1})`,
    situation: `학급 내 [번호: ${index + 1}] 아동이 교탁 앞으로 다가와 최근 학업 고민이나 친구 관계, 학교 규칙 위반에 대해 털어놓기 시작합니다.`,
    choice1: "학교의 합리적 규칙 및 훈육 가이드에 근거해 단호하고 객관적인 원칙주의 지도를 부과한다.",
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
    // 학생 상담은 정답이 갈리는 딜레마이므로 중립으로 분류해 밸런싱에 자연스럽게 섞이게 한다
    valence: 'neutral',
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
        text: `"${npcName} 학생은 비로소 얼굴에 밝은 미소를 띠며 고마워합니다. 선생님의 따뜻한 품에서 자존감이 살아납니다."`,
        nextStepIndex: null
      },
      {
        speaker: npcName,
        text: `"${npcName} 학생은 고개를 숙인 채 조용히 교실로 돌아갑니다. 단호한 가이드를 통해 문제 해결 능력을 기르게 되었습니다."`,
        nextStepIndex: null
      },
      {
        speaker: npcName,
        text: `"${npcName} 학생은 교사의 세련된 연계 지도 지침을 경청하며, 부모님과 함께 차근차근 문제를 개선해 나가기로 약속합니다."`,
        nextStepIndex: null
      },
      {
        speaker: npcName,
        text: `"${npcName} 학생은 반의 친구들과 함께 자치 회의 합의안에 따라 스스로 책임을 지며 서로 화해하기로 결정했습니다."`,
        nextStepIndex: null
      },
      {
        speaker: npcName,
        text: `"${npcName} 학생은 Wee클래스의 따뜻하고 안락한 분위기에서 전문적인 케어 서비스를 수령하며 마음의 평정을 찾아갑니다."`,
        nextStepIndex: null
      }
    ]
  };
});
