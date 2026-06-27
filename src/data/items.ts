import type { InventoryItem } from '@/game/types';

// 어드벤처 요소: 특정 선택지(grantsItem)로 얻는 소지품. prerequisites에 'item:아이템id'로
// 적으면 해당 아이템을 보유하고 있을 때만 발동하는 이벤트/선택지를 만들 수 있다.
export const INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'class_diary',
    name: '학급 다이어리',
    description: '아이들이 몰래 돌려 쓰던 공책. 답장을 적어 돌려준 뒤로도 가끔 새로운 이야기가 더해진다.'
  },
  {
    id: 'class_council_charter',
    name: '학생 자치 헌장',
    description: '아이들이 직접 정한 학급 규칙 초안. 학급의 자율성을 보여주는 증표.'
  },
  {
    id: 'student_sketchbook',
    name: '비밀 스케치북',
    description: '한 학생이 보여준 그림이 담긴 스케치북. 재능을 알아본 순간의 기억.'
  },
  {
    id: 'jihun_letter',
    name: '지훈이의 손편지',
    description: '삐뚤빼뚤한 글씨로 적힌 감사 편지. 화해를 도와준 보답으로 받았다.'
  },
  {
    id: 'mystery_note',
    name: '익명의 쪽지',
    description: '누가 적었는지 알 수 없는 짧은 한 줄. 학급의 냉랭함을 일깨워준 단서.'
  }
];

export const getItemById = (itemId: string): InventoryItem | undefined =>
  INVENTORY_ITEMS.find(item => item.id === itemId);
