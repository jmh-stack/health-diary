/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Exercise, ExerciseSet, NextExercisePreview } from '../types/fitness.ts';
import { INITIAL_EXERCISE, NEXT_UP_PREVIEW } from '../data/mockData.ts';
import { calculateSessionVolume, formatTime } from '../utils/fitnessLogic.ts';
import { ExerciseGuideModal } from '../components/ExerciseGuideModal.tsx';
import { WorkoutCompleteModal } from '../components/WorkoutCompleteModal.tsx';

interface WorkoutViewProps {
  onGoToAnalytics: () => void;
}

export const WorkoutView: React.FC<WorkoutViewProps> = ({ onGoToAnalytics }) => {
  // Exercise and Sets state
  const [exercise, setExercise] = useState<Exercise>(INITIAL_EXERCISE);
  const [nextUp, setNextUp] = useState<NextExercisePreview>(NEXT_UP_PREVIEW);
  const [isNextUpOpen, setIsNextUpOpen] = useState(false);

  // Guide modal and completion modal states
  const [guideOpen, setGuideOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);

  // Rest Timer State
  const [timerSeconds, setTimerSeconds] = useState(73); // 01:13
  const [timerMaxSeconds, setTimerMaxSeconds] = useState(90);
  const [timerRunning, setTimerRunning] = useState(true);

  // Workout Session Stopwatch State
  const [sessionSeconds, setSessionSeconds] = useState(1458); // 00:24:18
  const [sessionPaused, setSessionPaused] = useState(false);

  // Rest timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  // Workout session stopwatch effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!sessionPaused) {
      interval = setInterval(() => {
        setSessionSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionPaused]);

  const handleAdjustTimer = (addedSeconds: number) => {
    const next = timerSeconds + addedSeconds;
    setTimerSeconds(next);
    if (next > timerMaxSeconds) {
      setTimerMaxSeconds(next);
    }
  };

  const handleResetTimer = () => {
    setTimerSeconds(90);
    setTimerMaxSeconds(90);
    setTimerRunning(true);
  };

  const handleToggleSet = (setId: string) => {
    setExercise((prev) => {
      const updatedSets = prev.sets.map((s) => {
        if (s.id === setId) {
          return { ...s, completed: !s.completed };
        }
        return s;
      });
      return { ...prev, sets: updatedSets };
    });
    // Reset timer on set completion
    handleResetTimer();
  };

  const handleUpdateSetValue = (setId: string, field: 'weight' | 'reps', value: number) => {
    setExercise((prev) => ({
      ...prev,
      sets: prev.sets.map((s) => (s.id === setId ? { ...s, [field]: value } : s)),
    }));
  };

  const handleAddSet = () => {
    setExercise((prev) => {
      const nextNum = prev.sets.length;
      const lastSet = prev.sets[prev.sets.length - 1];
      const newSet: ExerciseSet = {
        id: `set-${Date.now()}`,
        setNumber: nextNum,
        previousRecord: `${lastSet.weight}kg × ${lastSet.reps}`,
        weight: lastSet.weight,
        reps: lastSet.reps,
        completed: false,
      };
      return {
        ...prev,
        sets: [...prev.sets, newSet],
      };
    });
  };

  const handleChangeExercise = () => {
    const list = [
      { name: '벤치프레스 (바벨)', pr: 'PR 100kg', muscles: ['가슴', '어깨전면', '삼두'] },
      { name: '인클라인 덤벨 프레스', pr: 'PR 32kg', muscles: ['상부가슴', '전면삼각근'] },
      { name: '딥스 (가중)', pr: 'PR +25kg', muscles: ['가슴하부', '삼두'] },
      { name: '케이블 크로스오버', pr: 'PR 35kg', muscles: ['가슴안쪽', '근신경'] },
    ];
    const currentIndex = list.findIndex((item) => item.name === exercise.name);
    const nextItem = list[(currentIndex + 1) % list.length];

    setExercise((prev) => ({
      ...prev,
      name: nextItem.name,
      prBadge: nextItem.pr,
      muscleTags: nextItem.muscles,
    }));
  };

  // Calculate telemetry
  const completedSets = exercise.sets.filter((s) => s.completed);
  // Base volume + current sets volume
  const sessionVolume = 1150 + calculateSessionVolume(exercise.sets);
  const totalPlannedSets = 16;
  const completedSetsCount = completedSets.length;

  const timerPercent = Math.min(100, Math.max(0, (timerSeconds / timerMaxSeconds) * 100));

  return (
    <div className="flex flex-col w-full gap-5">
      {/* Dynamic Rest Timer Sticky Widget */}
      <div className="sticky top-16 z-20 w-full pt-1 pb-2 bg-[#0f131d]/90 backdrop-blur-md -mx-4 px-4">
        <div className="w-full bg-[#262a35] border border-[#313540] rounded-2xl p-4 shadow-xl flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#ccff80]">
              <span className="material-symbols-outlined text-[18px] animate-pulse">timer</span>
              <span className="font-space text-xs tracking-wider uppercase text-[#dfe2f1] font-bold">
                휴식 타이머
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleAdjustTimer(15)}
                className="h-7 px-2.5 bg-[#313540] hover:bg-[#353944] active:scale-95 text-[#7bd0ff] rounded-full font-space text-xs font-semibold transition-all flex items-center justify-center border border-[#424936]/40"
              >
                +15초
              </button>
              <button
                type="button"
                onClick={() => handleAdjustTimer(30)}
                className="h-7 px-2.5 bg-[#313540] hover:bg-[#353944] active:scale-95 text-[#7bd0ff] rounded-full font-space text-xs font-semibold transition-all flex items-center justify-center border border-[#424936]/40"
              >
                +30초
              </button>
            </div>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <div className="flex items-baseline gap-2">
              <span className="font-space text-3xl font-bold tracking-tight text-[#ccff80]">
                {formatTime(timerSeconds, false)}
              </span>
              <span className="text-xs text-[#c2cab0]">권장 휴식: 90초</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setTimerRunning(!timerRunning)}
                aria-label={timerRunning ? '타이머 일시정지' : '타이머 시작'}
                className="w-9 h-9 rounded-full bg-[#1c1f2a] border border-[#313540] flex items-center justify-center text-[#dfe2f1] hover:text-[#ccff80] active:scale-90 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {timerRunning ? 'pause' : 'play_arrow'}
                </span>
              </button>
              <button
                type="button"
                onClick={handleResetTimer}
                aria-label="타이머 리셋"
                className="w-9 h-9 rounded-full bg-[#1c1f2a] border border-[#313540] flex items-center justify-center text-[#c2cab0] hover:text-[#dfe2f1] active:scale-90 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">replay</span>
              </button>
            </div>
          </div>

          {/* Linear Progress Bar */}
          <div className="w-full bg-[#0a0e18] h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-gradient-to-r from-[#7bd0ff] via-[#a3e635] to-[#ccff80] transition-all duration-300 rounded-full"
              style={{ width: `${timerPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Primary Exercise Card */}
      <section className="w-full bg-[#1c1f2a] border border-[#313540] rounded-2xl p-4 shadow-md flex flex-col gap-4">
        {/* Header: Movement Title, Badges, Metrics */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="font-space text-xs px-2 py-0.5 rounded-full bg-[#262a35] text-[#ccff80] font-semibold border border-[#313540]">
                  {exercise.orderText}
                </span>
                <span className="font-space text-xs px-2 py-0.5 rounded-full bg-[#ccff80]/15 text-[#ccff80] font-bold">
                  {exercise.prBadge}
                </span>
              </div>
              <h1 className="font-space text-2xl font-bold tracking-tight text-[#dfe2f1] flex items-center gap-1.5">
                {exercise.name}
                <button
                  type="button"
                  aria-label="운동 가이드 보기"
                  onClick={() => setGuideOpen(true)}
                  className="text-[#c2cab0] hover:text-[#ccff80] transition-colors flex items-center"
                >
                  <span className="material-symbols-outlined text-[20px]">info</span>
                </button>
              </h1>
            </div>

            <button
              type="button"
              aria-label="옵션 더보기"
              onClick={handleChangeExercise}
              className="w-9 h-9 rounded-xl bg-[#262a35] border border-[#313540] flex items-center justify-center text-[#c2cab0] hover:text-[#dfe2f1] active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
            </button>
          </div>

          {/* Muscle Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            {exercise.muscleTags.map((tag) => (
              <span
                key={tag}
                className="font-space text-xs px-2.5 py-0.5 rounded bg-[#313540] text-[#dfe2f1] font-medium"
              >
                {tag}
              </span>
            ))}
            <div className="ml-auto flex items-center gap-1 text-[#c2cab0] text-xs font-space">
              <span className="material-symbols-outlined text-[15px] text-[#7bd0ff]">trending_up</span>
              <span>{exercise.volumeComparison}</span>
            </div>
          </div>
        </div>

        {/* Set Tracking Table */}
        <div className="w-full flex flex-col gap-2 mt-1">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 px-2 py-1 text-[#c2cab0] font-space text-[11px] tracking-wider uppercase text-center items-center">
            <div className="col-span-2 text-left pl-1">세트</div>
            <div className="col-span-3 text-left">이전 기록</div>
            <div className="col-span-3">중량 (KG)</div>
            <div className="col-span-2">횟수</div>
            <div className="col-span-2 text-right pr-1">완료</div>
          </div>

          {/* Set Rows */}
          {exercise.sets.map((set, idx) => {
            const isActive = !set.completed && (idx === 0 || exercise.sets[idx - 1].completed);
            return (
              <div
                key={set.id}
                className={`grid grid-cols-12 gap-2 items-center p-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#262a35] border border-[#ccff80]/50 shadow-[0_0_12px_-2px_rgba(204,255,128,0.35)]'
                    : set.completed
                    ? 'bg-[#171b26] border border-[#313540]/60 opacity-90'
                    : 'bg-[#171b26]/50 border border-transparent opacity-60'
                }`}
              >
                {/* Set Number */}
                <div className="col-span-2 flex items-center gap-1 pl-1">
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#ccff80] animate-ping" />}
                  <span
                    className={`font-space text-xs font-bold ${
                      set.isWarmup
                        ? 'px-1.5 py-0.5 rounded bg-[#313540] text-[#c2cab0]'
                        : isActive
                        ? 'text-[#ccff80]'
                        : 'text-[#dfe2f1]'
                    }`}
                  >
                    {set.setNumber}
                  </span>
                </div>

                {/* Previous Record */}
                <div className="col-span-3 text-left text-xs text-[#c2cab0] truncate">
                  {set.previousRecord}
                </div>

                {/* Weight Input */}
                <div className="col-span-3 flex justify-center relative">
                  <input
                    type="number"
                    value={set.weight}
                    onChange={(e) => handleUpdateSetValue(set.id, 'weight', Number(e.target.value))}
                    className={`w-full h-10 text-center rounded-lg font-space text-base font-bold focus:outline-none transition-colors ${
                      isActive
                        ? 'bg-[#0a0e18] text-[#ccff80] border border-[#ccff80]/40 shadow-inner'
                        : 'bg-[#262a35] text-[#dfe2f1] border border-[#313540]'
                    }`}
                  />
                  {set.deltaBadge && (
                    <span className="absolute -top-2 right-1 font-space text-[9px] px-1 rounded bg-[#ccff80] text-[#213600] font-bold">
                      {set.deltaBadge}
                    </span>
                  )}
                </div>

                {/* Reps Input */}
                <div className="col-span-2 flex justify-center">
                  <input
                    type="number"
                    value={set.reps}
                    onChange={(e) => handleUpdateSetValue(set.id, 'reps', Number(e.target.value))}
                    className={`w-full h-10 text-center rounded-lg font-space text-base font-bold focus:outline-none transition-colors ${
                      isActive
                        ? 'bg-[#0a0e18] text-[#dfe2f1] border border-[#ccff80]/40 shadow-inner'
                        : 'bg-[#262a35] text-[#dfe2f1] border border-[#313540]'
                    }`}
                  />
                </div>

                {/* Complete Checkbox Button */}
                <div className="col-span-2 flex justify-end pr-1">
                  <button
                    type="button"
                    onClick={() => handleToggleSet(set.id)}
                    aria-label={`세트 ${set.setNumber} 완료 토글`}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      set.completed
                        ? 'bg-[#a3e635] text-[#213600] shadow-[0_0_10px_rgba(163,230,53,0.4)]'
                        : isActive
                        ? 'bg-[#313540] hover:bg-[#a3e635] text-[#c2cab0] hover:text-[#213600] active:scale-95'
                        : 'bg-[#262a35] text-[#424936]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[22px] font-bold">
                      {set.completed ? 'check' : isActive ? 'done' : 'lock'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Set Actions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={handleAddSet}
            className="h-11 rounded-xl bg-[#262a35] hover:bg-[#313540] active:scale-98 text-[#dfe2f1] font-space text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-[#313540]"
          >
            <span className="material-symbols-outlined text-[18px] text-[#ccff80]">add</span>
            세트 추가
          </button>
          <button
            type="button"
            onClick={handleChangeExercise}
            className="h-11 rounded-xl bg-[#262a35] hover:bg-[#313540] active:scale-98 text-[#c2cab0] hover:text-[#dfe2f1] font-space text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-[#313540]"
          >
            <span className="material-symbols-outlined text-[18px] text-[#7bd0ff]">fitness_center</span>
            운동 변경/추가
          </button>
        </div>
      </section>

      {/* Collapsible Next Up Routine Preview */}
      <section className="w-full bg-[#171b26] border border-[#313540] rounded-2xl p-4 shadow-sm transition-all">
        <div
          onClick={() => setIsNextUpOpen(!isNextUpOpen)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#262a35] flex items-center justify-center text-[#7bd0ff]">
              <span className="material-symbols-outlined text-[20px]">queue_play_next</span>
            </div>
            <div>
              <span className="text-[11px] text-[#c2cab0]">다음 운동 순서</span>
              <p className="font-space text-base font-bold text-[#dfe2f1]">{nextUp.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#262a35] text-[#c2cab0]">
              총 {nextUp.totalSets}세트 예정
            </span>
            <span
              className={`material-symbols-outlined text-[20px] text-[#c2cab0] transition-transform ${
                isNextUpOpen ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
          </div>
        </div>

        {/* Collapsible Content */}
        {isNextUpOpen && (
          <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-[#313540]/60 animate-fadeIn">
            <div className="flex justify-between items-center text-[#c2cab0] text-xs px-1">
              <span>{nextUp.target}</span>
              <span>{nextUp.recentPR}</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center mt-1">
              {nextUp.sets.map((item, idx) => (
                <div key={idx} className="p-2 bg-[#262a35] rounded-xl border border-[#313540]">
                  <span className="text-[10px] text-[#c2cab0] block">{item.setNumber}</span>
                  <span className="font-space text-xs font-bold text-[#dfe2f1] mt-0.5 block">
                    {item.weight}kg {item.reps}회
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Live Workout Telemetry Summary Chip */}
      <section className="grid grid-cols-3 gap-2">
        <div className="bg-[#1c1f2a] border border-[#313540] rounded-2xl p-3 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] text-[#c2cab0]">누적 볼륨</span>
          <span className="font-space text-lg font-bold text-[#ccff80] mt-0.5">
            {sessionVolume.toLocaleString()} kg
          </span>
        </div>
        <div className="bg-[#1c1f2a] border border-[#313540] rounded-2xl p-3 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] text-[#c2cab0]">총 세트 완료</span>
          <span className="font-space text-lg font-bold text-[#7bd0ff] mt-0.5">
            {completedSetsCount} / {totalPlannedSets}
          </span>
        </div>
        <div className="bg-[#1c1f2a] border border-[#313540] rounded-2xl p-3 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] text-[#c2cab0]">진행 시간</span>
          <span className="font-space text-lg font-bold text-[#dfe2f1] mt-0.5">
            {formatTime(sessionSeconds, true)}
          </span>
        </div>
      </section>

      {/* Session Bottom Controller */}
      <div className="w-full flex items-center gap-2 mt-1">
        <button
          type="button"
          onClick={() => setSessionPaused(!sessionPaused)}
          className={`h-14 px-4 rounded-2xl border flex items-center justify-center gap-1.5 transition-all shadow-md ${
            sessionPaused
              ? 'bg-[#171b26] border-[#7bd0ff] text-[#7bd0ff]'
              : 'bg-[#262a35] border-[#313540] hover:bg-[#313540] text-[#dfe2f1]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">
            {sessionPaused ? 'play_circle' : 'pause_circle'}
          </span>
          <span className="font-space text-xs font-semibold whitespace-nowrap">
            {sessionPaused ? '운동 재개하기' : '운동 일시정지'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setCompleteModalOpen(true)}
          className="flex-1 h-14 rounded-2xl bg-[#a3e635] text-[#213600] hover:brightness-105 active:scale-98 font-space text-base font-bold flex items-center justify-center gap-2 transition-all shadow-[0_8px_20px_-4px_rgba(163,230,53,0.35)]"
        >
          <span className="material-symbols-outlined text-[24px]">task_alt</span>
          운동 완료 및 저장
        </button>
      </div>

      {/* Exercise Technical Guide Modal */}
      <ExerciseGuideModal
        isOpen={guideOpen}
        onClose={() => setGuideOpen(false)}
        exercise={exercise}
      />

      {/* Workout Completion Celebratory Modal */}
      <WorkoutCompleteModal
        isOpen={completeModalOpen}
        onClose={() => setCompleteModalOpen(false)}
        volume={sessionVolume}
        completedSetsCount={completedSetsCount}
        totalSetsCount={totalPlannedSets}
        durationSeconds={sessionSeconds}
        onGoToAnalytics={onGoToAnalytics}
      />
    </div>
  );
};
