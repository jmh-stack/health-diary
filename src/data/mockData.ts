/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Exercise,
  NextExercisePreview,
  MealItem,
  FoodRecommendation,
  RoutineTemplate,
  WorkoutHistoryItem,
  WeeklyStat,
} from '../types/fitness.ts';

export const APP_ASSETS = {
  logo: 'https://lh3.googleusercontent.com/aida/AEtjO1U5lEWpEZWksBps7NY4YKH2epCOiAjZGMZZfYMky4ZJ02qlpVOiRgd_XaAoi-khp4ORthBfvzi1YMQayDh3ZQJMIAvqKIx-77Wd3xXLZ1-4KOomU1MWA6k3KGhJVFBHyQT6wjfd6uroW9OUY9b3KQB2O0z65skv5OyPcnzWFW3J1ycggU8A6xfGsdDp3iuHVXpp7imyqnERJPYhZtObF1inTTcupzE-T4BRz_GZKAVSW3aptkDfenD6Hjs',
  profileAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9lqPcWmlivTYFQVarNt1ZNdlgFQ4WR_MBn17XPqr8YefhWfD_4Fq-ldKDtE5LtmbqAKkj4QkbvJrLNj7z10gAlfDXXZDHnuMHgNhKdGXKsA-PiGxSiR6ChaeyVarJRK7sGNSbOcf8H17rg4QfRquJHxD_mlFzY29RXDvKPs1rgaotu_UXfAC-DJBBoVl2MkGvhJR1FffcKi9k-AeIq5JpsskLT5W2e1uQ8TBTp_LWA7GSBa5jSsT-wA',
  greekYogurt: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhOq5oFZ7nGuvVFjYIdeU1KoYmIQUAbEFywzOlfthjSq-ra5Rs4-5VFclcLS8xNuw4v7XsdIf-2bNfbM3S-7KpRbfNNslORSXzdOPXmY2wmtiJDOghktrXUGf1b0cCrE38I1jbZg3cyblDQOXauBX5kEPXkTZV5xwhe2KaPBDwWQCcmo5uocUTbylEKNJi4rHT4siLcr387nCMfEFuMepAnN-0nqE15WTPncU-a7PLVc7eUuoiC2-1zg',
  proteinShake: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6GumaRBuHt-_8ylCbj6-4S8iuO6Eg0GbqH5FNEWD8EWH8M70443Y2Ft_4N-1xwM3uvBNOx96mLM392kgOaPL5EBkw6S6W1sK9Ml5H5lruWaCnRdSGZq23TUTAD5owRgF1ybrA7xupBx6P0HApzmYYdU27zzDioLuI8kb3g1VAowf5LpbmC5G98zl2UqBKKnN8CkquTn-res7aRG--AD2tYqs-VXP1qdv91L1PnYR-RrNtQjZWaW8fgg',
};

export const INITIAL_EXERCISE: Exercise = {
  id: 'bench-press',
  name: '벤치프레스 (바벨)',
  orderText: '1 / 5 운동',
  prBadge: 'PR 100kg',
  muscleTags: ['가슴', '어깨전면', '삼두'],
  volumeComparison: '지난 볼륨 대비 +5%',
  guide: {
    category: '바벨 복합 다관절 운동',
    tips: [
      '견갑골(날개뼈)을 후인하강하여 벤치에 단단히 고정합니다.',
      '바벨을 가슴 하부(명치 부근)로 수직 하강시키며 삼두와 가슴에 긴장을 유지합니다.',
      '발바닥 전체로 지면을 강하게 밀어내 레그 드라이브를 활용합니다.',
    ],
    tempo: '2-1-1-0 (이완 2초, 정지 1초, 폭발적 수축 1초)',
  },
  sets: [
    {
      id: 's-w1',
      setNumber: 'W1',
      previousRecord: '40kg × 12',
      weight: 40,
      reps: 12,
      completed: true,
      isWarmup: true,
    },
    {
      id: 's-1',
      setNumber: 1,
      previousRecord: '70kg × 10',
      weight: 75,
      reps: 10,
      completed: true,
      deltaBadge: '+5kg',
    },
    {
      id: 's-2',
      setNumber: 2,
      previousRecord: '75kg × 8',
      weight: 80,
      reps: 8,
      completed: false,
    },
    {
      id: 's-3',
      setNumber: 3,
      previousRecord: '80kg × 6',
      weight: 80,
      reps: 6,
      completed: false,
    },
  ],
};

export const NEXT_UP_PREVIEW: NextExercisePreview = {
  name: '인클라인 덤벨 프레스',
  totalSets: 4,
  target: '타겟: 상부 가슴, 전면 삼각근',
  recentPR: '최근 최고 기록: 28kg × 8회',
  sets: [
    { setNumber: '1세트', weight: 22, reps: 10 },
    { setNumber: '2세트', weight: 26, reps: 8 },
    { setNumber: '3세트', weight: 28, reps: 8 },
    { setNumber: '4세트', weight: 24, reps: 10 },
  ],
};

export const INITIAL_MEALS: MealItem[] = [
  {
    id: 'm-1',
    type: 'breakfast',
    title: '아침',
    time: '08:20',
    calories: 520,
    protein: 38,
    description: '닭가슴살 볶음밥 200g, 달걀 후라이 2개, 사과 반쪽',
    completed: true,
  },
  {
    id: 'm-2',
    type: 'lunch',
    title: '점심',
    time: '12:45',
    calories: 780,
    protein: 52,
    description: '소고기 우둔살 150g, 현미밥 1공기, 샐러드 & 올리브유',
    completed: true,
  },
  {
    id: 'm-3',
    type: 'snack',
    title: '간식 (운동 전/후)',
    time: '16:10',
    calories: 240,
    protein: 22,
    description: '바나나 1개, 프로틴 바 1개',
    completed: true,
  },
  {
    id: 'm-4',
    type: 'dinner',
    title: '저녁',
    time: '19:30',
    calories: 400,
    protein: 30,
    description: '연어 구이 180g, 구운 아스파라거스 & 파프리카',
    completed: true,
  },
];

export const AI_RECOMMENDATIONS: FoodRecommendation[] = [
  {
    id: 'rec-1',
    title: '그릭 요거트 150g',
    subtitle: '+ 블루베리 30g',
    protein: 15,
    calories: 130,
    image: APP_ASSETS.greekYogurt,
    dataAlt: 'Close up artisanal shot of thick Greek yogurt topped with fresh blueberries in a dark matte ceramic bowl',
  },
  {
    id: 'rec-2',
    title: 'WPI 프로틴 쉐이크',
    subtitle: '초코맛 1스쿱 (30g)',
    protein: 24,
    calories: 120,
    image: APP_ASSETS.proteinShake,
    dataAlt: 'Chilled Whey Isolate protein shake inside a sleek matte black metallic shaker cup',
  },
];

export const ROUTINE_TEMPLATES: RoutineTemplate[] = [
  {
    id: 'r-1',
    title: '3분할 A: 가슴 & 삼두',
    isRecommended: true,
    exerciseCount: 5,
    durationMinutes: 55,
    lastDoneText: '최근: 어제',
    exercises: ['벤치프레스', '인클라인 덤벨', '딥스', '케이블 플라이', '트라이셉스 푸시다운'],
    fullExerciseList: [
      { name: '바벨 벤치프레스', sets: '5세트 · 5-8회' },
      { name: '인클라인 덤벨 프레스', sets: '4세트 · 8-12회' },
      { name: '딥스 (체중/가중)', sets: '4세트 · 10-12회' },
      { name: '케이블 크로스오버 플라이', sets: '3세트 · 15회' },
      { name: '트라이셉스 로프 푸시다운', sets: '4세트 · 12-15회' },
    ],
  },
  {
    id: 'r-2',
    title: '3분할 B: 등 & 이두',
    exerciseCount: 6,
    durationMinutes: 60,
    lastDoneText: '최근: 3일 전',
    exercises: ['데드리프트', '랫풀다운', '시티드로우', '바벨컬', '+2개'],
    fullExerciseList: [
      { name: '컨벤셔널 데드리프트', sets: '4세트 · 5회' },
      { name: '랫 풀 다운 (와이드그립)', sets: '4세트 · 10회' },
      { name: '시티드 케이블 로우', sets: '4세트 · 12회' },
      { name: '원암 덤벨 로우', sets: '3세트 · 10회' },
      { name: 'EZ바 바벨 컬', sets: '4세트 · 12회' },
      { name: '인클라인 덤벨 해머컬', sets: '3세트 · 15회' },
    ],
  },
  {
    id: 'r-3',
    title: '3분할 C: 하체 & 어깨',
    exerciseCount: 5,
    durationMinutes: 65,
    lastDoneText: '최근: 5일 전',
    exercises: ['바벨 스쿼트', '레그프레스', '밀리터리 프레스', '사이드 레터럴'],
    fullExerciseList: [
      { name: '바벨 백 스쿼트', sets: '5세트 · 5-8회' },
      { name: '파워 레그 프레스', sets: '4세트 · 10-12회' },
      { name: '오버헤드 밀리터리 프레스', sets: '4세트 · 6-8회' },
      { name: '덤벨 사이드 레터럴 레이즈', sets: '5세트 · 15-20회' },
      { name: '레그 익스텐션 & 컬 컴파운드', sets: '3세트 · 15회' },
    ],
  },
];

export const WORKOUT_HISTORIES: WorkoutHistoryItem[] = [
  {
    id: 'h-1',
    dateText: '10월 23일 (수) 등·이두 완료',
    title: '등 & 이두 고강도 세션',
    isPR: true,
    highlightText: '데드리프트 140kg 달성 · 총 16세트 (62분)',
    totalSets: 16,
    durationMinutes: 62,
  },
  {
    id: 'h-2',
    dateText: '10월 21일 (월) 가슴·삼두 완료',
    title: '가슴 볼륨 타깃 세션',
    isPR: false,
    highlightText: '벤치프레스 85kg 외 4개 종목 · 총 18세트 (54분)',
    totalSets: 18,
    durationMinutes: 54,
  },
  {
    id: 'h-3',
    dateText: '10월 19일 (토) 하체 파워 세션 완료',
    title: '하체 근력 증진',
    isPR: true,
    highlightText: '스쿼트 120kg 달성 · 총 15세트 (58분)',
    totalSets: 15,
    durationMinutes: 58,
  },
];

export const WEEKLY_STATS: WeeklyStat[] = [
  {
    weekLabel: '10월 4주차',
    isCurrent: true,
    changeRate: 5.2,
    totalVolume: 22400,
    frequency: 5,
    completedSets: 62,
  },
  {
    weekLabel: '10월 3주차',
    changeRate: 3.8,
    totalVolume: 21300,
    frequency: 4,
    completedSets: 54,
  },
  {
    weekLabel: '10월 2주차',
    changeRate: -1.2,
    totalVolume: 20500,
    frequency: 4,
    completedSets: 50,
  },
  {
    weekLabel: '10월 1주차',
    changeRate: 8.0,
    totalVolume: 20800,
    frequency: 5,
    completedSets: 58,
  },
];

export const EXERCISE_ANALYTICS_DATA: Record<string, {
  name: string;
  estimated1RM: number;
  improvement: string;
  baseline: string;
  maxWeight: number;
  maxVolume: number;
  totalSets: number;
  chartPoints: { week: string; value: number }[];
  targetBadge: string;
}> = {
  'bench-press': {
    name: '벤치프레스 (바벨)',
    estimated1RM: 102.5,
    improvement: '+12.5kg 향상',
    baseline: '시작 90.0kg 대비',
    maxWeight: 100.0,
    maxVolume: 4850,
    totalSets: 48,
    chartPoints: [
      { week: '1주', value: 90.0 },
      { week: '2주', value: 92.5 },
      { week: '3주', value: 94.0 },
      { week: '4주', value: 96.0 },
      { week: '5주', value: 97.5 },
      { week: '6주', value: 99.0 },
      { week: '7주', value: 101.0 },
      { week: '8주차', value: 102.5 },
    ],
    targetBadge: '벤치프레스 105kg 도전 준비 완료!',
  },
  'deadlift': {
    name: '데드리프트 (컨벤셔널)',
    estimated1RM: 145.0,
    improvement: '+20.0kg 향상',
    baseline: '시작 125.0kg 대비',
    maxWeight: 140.0,
    maxVolume: 6200,
    totalSets: 42,
    chartPoints: [
      { week: '1주', value: 125.0 },
      { week: '2주', value: 127.5 },
      { week: '3주', value: 130.0 },
      { week: '4주', value: 132.5 },
      { week: '5주', value: 135.0 },
      { week: '6주', value: 137.5 },
      { week: '7주', value: 140.0 },
      { week: '8주차', value: 145.0 },
    ],
    targetBadge: '데드리프트 150kg 도전 준비 완료!',
  },
  'squat': {
    name: '백 스쿼트',
    estimated1RM: 127.5,
    improvement: '+15.0kg 향상',
    baseline: '시작 112.5kg 대비',
    maxWeight: 120.0,
    maxVolume: 5800,
    totalSets: 46,
    chartPoints: [
      { week: '1주', value: 112.5 },
      { week: '2주', value: 115.0 },
      { week: '3주', value: 117.5 },
      { week: '4주', value: 120.0 },
      { week: '5주', value: 122.5 },
      { week: '6주', value: 125.0 },
      { week: '7주', value: 125.0 },
      { week: '8주차', value: 127.5 },
    ],
    targetBadge: '스쿼트 130kg 클리어 임박!',
  },
  'overhead-press': {
    name: '오버헤드 프레스',
    estimated1RM: 65.0,
    improvement: '+7.5kg 향상',
    baseline: '시작 57.5kg 대비',
    maxWeight: 62.5,
    maxVolume: 3200,
    totalSets: 36,
    chartPoints: [
      { week: '1주', value: 57.5 },
      { week: '2주', value: 58.5 },
      { week: '3주', value: 60.0 },
      { week: '4주', value: 60.0 },
      { week: '5주', value: 61.5 },
      { week: '6주', value: 62.5 },
      { week: '7주', value: 63.5 },
      { week: '8주차', value: 65.0 },
    ],
    targetBadge: '밀리터리 프레스 체중비 0.9 달성!',
  },
};
