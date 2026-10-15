import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateEstimated1RM,
  calculateSessionVolume,
  calculateBMRAndTDEE,
  calculateMacroPercentages,
  calculateWaterProgress,
  formatTime,
} from './fitnessLogic.ts';
import type { ExerciseSet } from './fitnessLogic.ts';

test('calculateEstimated1RM calculates correct 1RM using Epley formula', () => {
  // 1 rep should be exact weight
  assert.equal(calculateEstimated1RM(100, 1), 100);

  // 10 reps of 75kg: 75 * (1 + 10/30) = 75 * 1.3333 = 100kg
  assert.equal(calculateEstimated1RM(75, 10), 100);

  // 8 reps of 80kg: 80 * (1 + 8/30) = 80 * 1.2667 = 101.3kg
  assert.equal(calculateEstimated1RM(80, 8), 101.3);

  // Zero input
  assert.equal(calculateEstimated1RM(0, 10), 0);
  assert.equal(calculateEstimated1RM(100, 0), 0);
});

test('calculateSessionVolume sums only completed sets', () => {
  const sets: ExerciseSet[] = [
    { id: '1', setNumber: 'W1', previousRecord: '40kg x 12', weight: 40, reps: 12, completed: true },
    { id: '2', setNumber: 1, previousRecord: '70kg x 10', weight: 75, reps: 10, completed: true },
    { id: '3', setNumber: 2, previousRecord: '75kg x 8', weight: 80, reps: 8, completed: false },
    { id: '4', setNumber: 3, previousRecord: '80kg x 6', weight: 80, reps: 6, completed: false },
  ];
  // 40*12 (480) + 75*10 (750) = 1230
  assert.equal(calculateSessionVolume(sets), 1230);

  // Mark set 3 as completed: 1230 + 80*8 (640) = 1870
  sets[2].completed = true;
  assert.equal(calculateSessionVolume(sets), 1870);
});

test('calculateBMRAndTDEE outputs expected values for standard athletic profile', () => {
  // Male: 74.5kg, 178cm, 28yo -> 10*74.5 + 6.25*178 - 5*28 + 5 = 745 + 1112.5 - 140 + 5 = 1722.5 ~ 1723
  const result = calculateBMRAndTDEE('male', 74.5, 178, 28, 1.46);
  assert.equal(result.bmr, 1723);
  assert.equal(result.tdee, 2516);
});

test('calculateMacroPercentages accurately maps current intake against target goals', () => {
  const current = { protein: 142, carbs: 215, fat: 54 };
  const targets = { protein: 160, carbs: 280, fat: 65 };
  const { proteinPct, carbsPct, fatPct } = calculateMacroPercentages(current, targets);

  // 142/160 = 88.75% -> 89%
  assert.equal(proteinPct, 89);
  // 215/280 = 76.78% -> 77%
  assert.equal(carbsPct, 77);
  // 54/65 = 83.07% -> 83%
  assert.equal(fatPct, 83);
});

test('calculateWaterProgress handles addition and bounds', () => {
  const progress = calculateWaterProgress(1.8, 2.5);
  // 1.8 / 2.5 = 72%
  assert.equal(progress.percent, 72);
  assert.equal(progress.remainingLiters, 0.7);

  const full = calculateWaterProgress(2.5, 2.5);
  assert.equal(full.percent, 100);
  assert.equal(full.remainingLiters, 0);
});

test('formatTime properly formats seconds to HH:MM:SS and MM:SS', () => {
  // 24 mins and 18 secs = 1458 seconds
  assert.equal(formatTime(1458, true), '00:24:18');
  assert.equal(formatTime(1458, false), '24:18');
  // 73 seconds = 01:13
  assert.equal(formatTime(73, false), '01:13');
});
