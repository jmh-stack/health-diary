/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TabType = 'home' | 'workout' | 'analytics' | 'diet' | 'routine';

export interface ExerciseSet {
  id: string;
  setNumber: number | string;
  previousRecord: string;
  weight: number;
  reps: number;
  completed: boolean;
  deltaBadge?: string;
  isWarmup?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  orderText: string;
  prBadge: string;
  muscleTags: string[];
  volumeComparison: string;
  sets: ExerciseSet[];
  guide: {
    category: string;
    tips: string[];
    tempo: string;
  };
}

export interface NextExercisePreview {
  name: string;
  totalSets: number;
  target: string;
  recentPR: string;
  sets: { setNumber: string; weight: number; reps: number }[];
}

export interface MealItem {
  id: string;
  type: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  title: string;
  time: string;
  calories: number;
  protein: number;
  description: string;
  completed: boolean;
}

export interface FoodRecommendation {
  id: string;
  title: string;
  subtitle: string;
  protein: number;
  calories: number;
  image: string;
  dataAlt: string;
}

export interface RoutineTemplate {
  id: string;
  title: string;
  isRecommended?: boolean;
  exerciseCount: number;
  durationMinutes: number;
  lastDoneText: string;
  exercises: string[];
  fullExerciseList?: { name: string; sets: string }[];
}

export interface WorkoutHistoryItem {
  id: string;
  dateText: string;
  title: string;
  isPR?: boolean;
  highlightText: string;
  totalSets: number;
  durationMinutes: number;
}

export interface WeeklyStat {
  weekLabel: string;
  isCurrent?: boolean;
  changeRate: number; // percentage, e.g. +5.2 or -1.2
  totalVolume: number;
  frequency: number;
  completedSets: number;
}
