/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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

/**
 * Calculates Estimated 1RM using the validated Epley formula.
 * 1RM = Weight * (1 + Reps / 30)
 */
export function calculateEstimated1RM(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return weight;
  const raw1RM = weight * (1 + reps / 30);
  return Math.round(raw1RM * 10) / 10;
}

/**
 * Calculates total session volume from completed sets (Weight * Reps).
 */
export function calculateSessionVolume(sets: ExerciseSet[]): number {
  return sets.reduce((total, set) => {
    if (set.completed && set.weight > 0 && set.reps > 0) {
      return total + set.weight * set.reps;
    }
    return total;
  }, 0);
}

/**
 * Calculates BMR and TDEE using Mifflin-St Jeor formula.
 */
export function calculateBMRAndTDEE(
  gender: 'male' | 'female',
  weightKg: number,
  heightCm: number,
  age: number,
  activityMultiplier: number = 1.45
): { bmr: number; tdee: number } {
  let bmrBase = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'male') {
    bmrBase += 5;
  } else {
    bmrBase -= 161;
  }
  const bmr = Math.round(bmrBase);
  const tdee = Math.round(bmr * activityMultiplier);
  return { bmr, tdee };
}

/**
 * Calculates macro percentages based on ingested grams vs targets.
 */
export function calculateMacroPercentages(
  current: { protein: number; carbs: number; fat: number },
  targets: { protein: number; carbs: number; fat: number }
): { proteinPct: number; carbsPct: number; fatPct: number } {
  const proteinPct = targets.protein > 0 ? Math.round((current.protein / targets.protein) * 100) : 0;
  const carbsPct = targets.carbs > 0 ? Math.round((current.carbs / targets.carbs) * 100) : 0;
  const fatPct = targets.fat > 0 ? Math.round((current.fat / targets.fat) * 100) : 0;
  return { proteinPct, carbsPct, fatPct };
}

/**
 * Calculates water intake progress.
 */
export function calculateWaterProgress(
  currentLiters: number,
  targetLiters: number = 2.5
): { percent: number; remainingLiters: number } {
  const percent = targetLiters > 0 ? Math.min(100, Math.round((currentLiters / targetLiters) * 100)) : 0;
  const remaining = Math.max(0, Math.round((targetLiters - currentLiters) * 100) / 100);
  return { percent, remainingLiters: remaining };
}

/**
 * Formats seconds into HH:MM:SS or MM:SS string.
 */
export function formatTime(totalSeconds: number, includeHours: boolean = true): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  if (includeHours) {
    const hh = String(hours).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}
