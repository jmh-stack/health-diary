/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RoutineTemplate } from '../types/fitness.ts';
import { ROUTINE_TEMPLATES, WORKOUT_HISTORIES } from '../data/mockData.ts';
import { NewRoutineModal } from '../components/NewRoutineModal.tsx';

interface RoutineViewProps {
  onStartRoutine: (routineId?: string) => void;
  onGoToAnalytics: () => void;
}

export const RoutineView: React.FC<RoutineViewProps> = ({
  onStartRoutine,
  onGoToAnalytics,
}) => {
  const [routines, setRoutines] = useState<RoutineTemplate[]>(ROUTINE_TEMPLATES);
  const [activeSegment, setActiveSegment] = useState<'templates' | 'history'>('templates');

  // Privacy & InBody state
  const [isMasked, setIsMasked] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [inBodySynced, setInBodySynced] = useState(false);
  const [ocrActive, setOcrActive] = useState(false);

  // New Routine Modal
  const [isNewRoutineOpen, setIsNewRoutineOpen] = useState(false);

  const handleInBodySync = () => {
    setInBodySynced(true);
    setTimeout(() => setInBodySynced(false), 2000);
  };

  const handleOcrSimulate = () => {
    setOcrActive(true);
    setTimeout(() => setOcrActive(false), 2000);
  };

  const handleAddRoutine = (newRoutine: RoutineTemplate) => {
    setRoutines((prev) => [...prev, newRoutine]);
  };

  return (
    <div className="flex flex-col w-full gap-5">
      {/* Dynamic Motivational Banner & Streak Card */}
      <section className="relative overflow-hidden rounded-2xl bg-[#262a35] border border-[#313540] p-4 shadow-md">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#ccff80]/10 blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-[#313540] shadow-sm">
              <span
                className="material-symbols-outlined text-[#ccff80] text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_fire_department
              </span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ccff80] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ccff80]" />
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-space text-base font-bold text-[#dfe2f1]">
                  5일 연속 달성 중!
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-[#ccff80]/20 text-[#ccff80] font-space text-[10px] font-bold">
                  STREAK
                </span>
              </div>
              <p className="text-xs text-[#c2cab0] mt-0.5">이번 주 목표 4회 중 3회 완료 (75%)</p>
            </div>
          </div>

          <button
            onClick={onGoToAnalytics}
            aria-label="스트릭 통계"
            className="w-9 h-9 rounded-xl bg-[#1c1f2a] border border-[#313540] flex items-center justify-center text-[#c2cab0] hover:text-[#ccff80] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">insights</span>
          </button>
        </div>
      </section>

      {/* Private Body Spec & Nutritional Reference Card */}
      <section className="rounded-2xl bg-[#171b26] border border-[#424936]/40 p-4 shadow-sm flex flex-col gap-3 relative overflow-hidden">
        {/* Header with Privacy Badge and Action */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#313540] flex items-center justify-center text-[#ccff80] shrink-0">
              <span className="material-symbols-outlined text-[18px]">lock</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-space text-sm font-bold text-[#dfe2f1] whitespace-nowrap">
                  신체 스펙 &amp; 영양 기준
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#313540] text-[#ccff80] font-space text-[10px] tracking-wide flex items-center gap-0.5 shrink-0">
                  <span className="material-symbols-outlined text-[12px]">verified_user</span>
                  비공개
                </span>
              </div>
              <span className="text-[11px] text-[#c2cab0] truncate">식단·권장 칼로리 계산 전용 레퍼런스</span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              aria-label="민감 정보 가리기 토글"
              onClick={() => setIsMasked(!isMasked)}
              className="h-7 px-2 rounded-lg bg-[#1c1f2a] border border-[#313540] flex items-center gap-1 text-[#c2cab0] hover:text-[#dfe2f1] text-[11px] whitespace-nowrap transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">
                {isMasked ? 'visibility_off' : 'visibility'}
              </span>
              <span>표시 토글</span>
            </button>

            <button
              aria-label="신체 정보 설정 토글"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="h-7 px-2 rounded-lg bg-[#ccff80]/15 hover:bg-[#ccff80]/25 text-[#ccff80] border border-[#ccff80]/30 flex items-center gap-1 text-[11px] font-semibold whitespace-nowrap transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">tune</span>
              <span>설정·수정</span>
            </button>
          </div>
        </div>

        {/* InBody Smart Sync Integration Bar */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#1c1f2a] border border-[#313540]/60">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="px-1.5 py-0.5 rounded bg-[#ccff80] text-[#213600] font-bold text-[10px] tracking-wide shrink-0">
              InBody
            </span>
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-[11px] font-semibold text-[#dfe2f1] flex items-center gap-1 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ccff80]" />
                연동 완료
              </span>
              <span className="text-[10px] text-[#c2cab0] truncate">(최근 동기화: 3일 전)</span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleOcrSimulate}
              className="h-6 px-1.5 rounded-lg bg-[#313540] hover:bg-[#353944] text-[#c2cab0] hover:text-[#dfe2f1] flex items-center gap-0.5 text-[10px] whitespace-nowrap transition-colors"
            >
              <span className="material-symbols-outlined text-[12px]">document_scanner</span>
              <span>{ocrActive ? '스캔 중' : '결과지 OCR'}</span>
            </button>
            <button
              onClick={handleInBodySync}
              className="h-6 px-1.5 rounded-lg bg-[#ccff80]/20 hover:bg-[#ccff80]/30 text-[#ccff80] flex items-center gap-0.5 text-[10px] font-semibold whitespace-nowrap transition-colors"
            >
              <span className="material-symbols-outlined text-[12px]">
                {inBodySynced ? 'check' : 'sync'}
              </span>
              <span>{inBodySynced ? '완료' : '동기화'}</span>
            </button>
          </div>
        </div>

        {/* Maskable Summary Metrics with InBody Indicators */}
        <div className="grid grid-cols-4 gap-2 py-1">
          <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#262a35] border border-[#313540]">
            <span className="text-[10px] font-space text-[#c2cab0]">성별 / 키</span>
            <span className="text-xs font-semibold text-[#dfe2f1] mt-0.5">
              {isMasked ? '*** · ***cm' : '남성 · 178cm'}
            </span>
            <span className="text-[9px] text-[#c2cab0]/70 mt-0.5">프로필 기준</span>
          </div>

          <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#262a35] border border-[#ccff80]/30">
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-space text-[#c2cab0]">체중</span>
              <span className="text-[9px] text-[#ccff80] font-bold">IB</span>
            </div>
            <span className="font-space text-xs font-bold text-[#ccff80] mt-0.5">
              {isMasked ? '**. * kg' : '74.5 kg'}
            </span>
            <span className="text-[9px] text-[#ccff80]/80 mt-0.5 flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[10px]">sync</span>
              InBody
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#262a35] border border-[#ccff80]/30">
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-space text-[#c2cab0]">골격근량</span>
              <span className="text-[9px] text-[#ccff80] font-bold">IB</span>
            </div>
            <span className="font-space text-xs font-bold text-[#ccff80] mt-0.5">
              {isMasked ? '**. * kg' : '36.2 kg'}
            </span>
            <span className="text-[9px] text-[#ccff80]/80 mt-0.5 flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[10px]">sync</span>
              InBody
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#262a35] border border-[#7bd0ff]/30">
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-space text-[#c2cab0]">체지방률</span>
              <span className="text-[9px] text-[#7bd0ff] font-bold">IB</span>
            </div>
            <span className="font-space text-xs font-bold text-[#7bd0ff] mt-0.5">
              {isMasked ? '**. * %' : '14.8 %'}
            </span>
            <span className="text-[9px] text-[#7bd0ff]/80 mt-0.5 flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[10px]">sync</span>
              InBody
            </span>
          </div>
        </div>

        {/* Collapsible Form & Nutritional Formula Reference Area */}
        {isDrawerOpen && (
          <div className="flex flex-col gap-2.5 pt-2 border-t border-[#313540] animate-fadeIn">
            <div className="grid grid-cols-2 gap-2 bg-[#1c1f2a] p-3 rounded-xl border border-[#313540]/60">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-space text-[#c2cab0]">성별</label>
                <div className="grid grid-cols-2 gap-1 p-0.5 bg-[#0a0e18] rounded-lg">
                  <button className="py-1 text-xs rounded-md bg-[#ccff80] text-[#213600] font-bold">
                    남성
                  </button>
                  <button className="py-1 text-xs rounded-md text-[#c2cab0] hover:text-[#dfe2f1]">
                    여성
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-space text-[#c2cab0]">활동 대사 수준</label>
                <div className="h-8 px-2.5 flex items-center justify-between rounded-lg bg-[#0a0e18] text-xs text-[#dfe2f1]">
                  <span>고강도 트레이닝 (주 4~5회)</span>
                  <span className="material-symbols-outlined text-[16px] text-[#c2cab0]">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            {/* Auto-calculated Nutritional Output Targets */}
            <div className="flex items-center justify-between bg-[#313540]/60 px-4 py-2.5 rounded-xl border border-[#424936]/40">
              <div className="flex flex-col">
                <span className="text-[10px] font-space text-[#c2cab0]">기초대사량 (BMR)</span>
                <span className="font-space text-sm text-[#dfe2f1] font-semibold">1,740 kcal</span>
              </div>
              <div className="h-6 w-px bg-[#424936]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-space text-[#ccff80]">유지 칼로리 (TDEE)</span>
                <span className="font-space text-sm text-[#ccff80] font-bold">2,520 kcal</span>
              </div>
              <div className="h-6 w-px bg-[#424936]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-space text-[#7bd0ff]">권장 단백질 목표</span>
                <span className="font-space text-sm text-[#7bd0ff] font-bold">149 ~ 160g</span>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Guide Tooltip Note */}
        <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-[#1c1f2a]/70 text-[11px] text-[#c2cab0] leading-relaxed border border-[#313540]/40">
          <span className="material-symbols-outlined text-[15px] text-[#ccff80] shrink-0 mt-0.5">
            verified
          </span>
          <span>
            입력 및 InBody 연동된 신체 정보는 외부에 노출되지 않으며, [식단 관리] 탭의 일일 칼로리 권장량(2,500 kcal) 및 근합성 단백질 목표 정밀 산출에만 비공개 연동됩니다.
          </span>
        </div>
      </section>

      {/* Mini Calendar & Workout Activity Section */}
      <section className="flex flex-col rounded-2xl bg-[#1c1f2a] border border-[#313540] p-4 shadow-sm gap-3">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-space text-base font-bold text-[#dfe2f1]">2024년 10월</span>
            <span className="material-symbols-outlined text-[#ccff80] text-[18px]">verified</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              aria-label="이전 달"
              className="w-8 h-8 rounded-lg bg-[#262a35] flex items-center justify-center text-[#c2cab0] hover:text-[#dfe2f1]"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button
              aria-label="다음 달"
              className="w-8 h-8 rounded-lg bg-[#262a35] flex items-center justify-center text-[#c2cab0] hover:text-[#dfe2f1]"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Weekday Labels */}
        <div className="grid grid-cols-7 text-center text-[11px] text-[#c2cab0]/70 font-space">
          <span>일</span>
          <span>월</span>
          <span>화</span>
          <span>수</span>
          <span>목</span>
          <span>금</span>
          <span>토</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-y-2 place-items-center">
          {/* Week 1 */}
          <span className="font-space text-xs text-[#424936]">29</span>
          <span className="font-space text-xs text-[#424936]">30</span>
          <div className="flex flex-col items-center justify-center w-8 h-8 rounded-lg text-[#dfe2f1]">
            <span className="font-space text-xs">1</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ccff80] mt-0.5" />
          </div>
          <div className="flex items-center justify-center w-8 h-8 rounded-lg text-[#c2cab0]">
            <span className="font-space text-xs">2</span>
          </div>
          <div className="flex flex-col items-center justify-center w-8 h-8 rounded-lg text-[#dfe2f1]">
            <span className="font-space text-xs">3</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ccff80] mt-0.5" />
          </div>
          <div className="flex items-center justify-center w-8 h-8 rounded-lg text-[#c2cab0]">
            <span className="font-space text-xs">4</span>
          </div>
          <div className="flex items-center justify-center w-8 h-8 rounded-lg text-[#c2cab0]">
            <span className="font-space text-xs">5</span>
          </div>

          {/* Current Active Week */}
          <div className="flex items-center justify-center w-8 h-8 rounded-lg text-[#c2cab0]">
            <span className="font-space text-xs">20</span>
          </div>

          {/* Oct 21 */}
          <div className="flex flex-col items-center justify-center w-8 h-8 rounded-lg bg-[#262a35] text-[#dfe2f1] shadow-sm border border-[#313540]">
            <span className="font-space text-xs">21</span>
            <span
              className="material-symbols-outlined text-[#ccff80] text-[10px] leading-none"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_fire_department
            </span>
          </div>

          {/* Oct 22 */}
          <div className="flex items-center justify-center w-8 h-8 rounded-lg text-[#c2cab0]">
            <span className="font-space text-xs">22</span>
          </div>

          {/* Oct 23 */}
          <div className="flex flex-col items-center justify-center w-8 h-8 rounded-lg bg-[#262a35] text-[#dfe2f1] shadow-sm border border-[#313540]">
            <span className="font-space text-xs">23</span>
            <span
              className="material-symbols-outlined text-[#ccff80] text-[10px] leading-none"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_fire_department
            </span>
          </div>

          {/* Today (Oct 24) Active */}
          <div className="flex flex-col items-center justify-center w-8 h-8 rounded-lg bg-[#ccff80] text-[#213600] font-bold shadow-md">
            <span className="font-space text-xs">24</span>
            <span className="w-1 h-1 rounded-full bg-[#213600] mt-0.5" />
          </div>

          {/* Oct 25 */}
          <div className="flex items-center justify-center w-8 h-8 rounded-lg text-[#c2cab0]">
            <span className="font-space text-xs">25</span>
          </div>

          {/* Oct 26 */}
          <div className="flex items-center justify-center w-8 h-8 rounded-lg text-[#c2cab0]">
            <span className="font-space text-xs">26</span>
          </div>
        </div>

        {/* Calendar Key Summary */}
        <div className="flex items-center justify-between bg-[#171b26] px-3 py-2 rounded-xl border border-[#313540]/60">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ccff80]" />
            <span className="text-xs text-[#c2cab0]">총 14일 기록</span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className="material-symbols-outlined text-[#ccff80] text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bolt
            </span>
            <span className="text-xs text-[#dfe2f1] font-space font-semibold">볼륨 42,850 kg</span>
          </div>
        </div>
      </section>

      {/* Segmented Tab Navigation */}
      <div className="grid grid-cols-2 p-1 rounded-xl bg-[#0a0e18] border border-[#313540] gap-1">
        <button
          onClick={() => setActiveSegment('templates')}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg font-space text-xs font-semibold transition-all ${
            activeSegment === 'templates'
              ? 'bg-[#262a35] text-[#ccff80] shadow-sm'
              : 'text-[#c2cab0] hover:text-[#dfe2f1]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">fitness_center</span>
          <span>내 루틴 템플릿 ({routines.length})</span>
        </button>

        <button
          onClick={() => setActiveSegment('history')}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg font-space text-xs font-semibold transition-all ${
            activeSegment === 'history'
              ? 'bg-[#262a35] text-[#ccff80] shadow-sm'
              : 'text-[#c2cab0] hover:text-[#dfe2f1]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">history</span>
          <span>과거 일지 히스토리</span>
        </button>
      </div>

      {/* Routine Cards or History */}
      {activeSegment === 'templates' ? (
        <div className="flex flex-col gap-3">
          {routines.map((routine) => (
            <div
              key={routine.id}
              className={`group relative flex flex-col rounded-2xl p-5 shadow-md transition-all border ${
                routine.isRecommended
                  ? 'bg-[#262a35] border-[#ccff80]/50 hover:bg-[#313540]'
                  : 'bg-[#1c1f2a] border-[#313540] hover:bg-[#262a35]'
              }`}
            >
              {routine.isRecommended && (
                <div className="absolute left-0 top-4 bottom-4 w-1 bg-[#ccff80] rounded-r-full" />
              )}

              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex flex-col">
                  {routine.isRecommended && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="px-2 py-0.5 rounded-full bg-[#ccff80]/15 text-[#ccff80] font-space text-[10px] font-bold">
                        오늘 추천 루틴
                      </span>
                      <span className="font-space text-xs text-[#c2cab0]">
                        {routine.exerciseCount}개 운동 구성
                      </span>
                    </div>
                  )}
                  <h2 className="font-space text-lg font-bold text-[#dfe2f1]">
                    {routine.title}
                  </h2>
                </div>

                <button
                  aria-label="루틴 옵션"
                  className="w-8 h-8 rounded-lg bg-[#1c1f2a] border border-[#313540] flex items-center justify-center text-[#c2cab0] hover:text-[#dfe2f1]"
                >
                  <span className="material-symbols-outlined text-[18px]">more_vert</span>
                </button>
              </div>

              {/* Quick Info Meta Chips */}
              <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-[#c2cab0]">
                <div className="flex items-center gap-1 bg-[#171b26] px-2.5 py-1 rounded-full border border-[#313540]/60">
                  <span className="material-symbols-outlined text-[14px] text-[#ccff80]">schedule</span>
                  <span className="text-[#dfe2f1]">평균 {routine.durationMinutes}분 소요</span>
                </div>
                <div className="flex items-center gap-1 bg-[#171b26] px-2.5 py-1 rounded-full border border-[#313540]/60">
                  <span className="material-symbols-outlined text-[14px] text-[#7bd0ff]">update</span>
                  <span className="text-[#dfe2f1]">{routine.lastDoneText}</span>
                </div>
              </div>

              {/* Exercise Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {routine.exercises.map((ex, idx) => (
                  <span
                    key={idx}
                    className="font-space text-[11px] px-2 py-0.5 rounded bg-[#0a0e18] text-[#c2cab0] border border-[#313540]/50"
                  >
                    {ex}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              {routine.isRecommended ? (
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => onStartRoutine(routine.id)}
                    className="col-span-1 h-11 flex items-center justify-center gap-1 rounded-xl bg-[#1c1f2a] border border-[#313540] text-[#dfe2f1] font-space text-xs font-semibold hover:bg-[#313540] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                    <span>수정</span>
                  </button>
                  <button
                    onClick={() => onStartRoutine(routine.id)}
                    className="col-span-3 h-11 flex items-center justify-center gap-1.5 rounded-xl bg-[#ccff80] text-[#213600] font-space text-xs font-bold shadow-sm hover:brightness-105 active:scale-[0.98] transition-all"
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      play_arrow
                    </span>
                    <span>운동 시작하기</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onStartRoutine(routine.id)}
                  className="w-full h-11 flex items-center justify-center gap-1.5 rounded-xl bg-[#313540] hover:bg-[#ccff80] text-[#dfe2f1] hover:text-[#213600] font-space text-xs font-bold active:scale-[0.98] transition-all border border-[#424936]"
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    play_arrow
                  </span>
                  <span>시작</span>
                </button>
              )}
            </div>
          ))}

          {/* Create New Routine Button Action */}
          <button
            onClick={() => setIsNewRoutineOpen(true)}
            className="group w-full h-14 rounded-2xl border border-[#ccff80]/40 bg-[#262a35] hover:bg-[#313540] flex items-center justify-center gap-2 text-[#ccff80] transition-all active:scale-[0.99] shadow-sm"
          >
            <div className="w-8 h-8 rounded-full bg-[#ccff80]/15 flex items-center justify-center group-hover:bg-[#ccff80] group-hover:text-[#213600] transition-all">
              <span className="material-symbols-outlined text-[20px]">add</span>
            </div>
            <span className="font-space text-xs font-bold tracking-wide">+ 새 루틴 생성하기</span>
          </button>
        </div>
      ) : (
        /* Past Workout Log Snippets Section */
        <div className="flex flex-col gap-3">
          {WORKOUT_HISTORIES.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-[#1c1f2a] border border-[#313540] hover:bg-[#262a35] transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#262a35] border border-[#313540] flex items-center justify-center text-[#ccff80] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">
                    {item.isPR ? 'fitness_center' : 'check_circle'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-space text-xs font-bold text-[#dfe2f1]">
                      {item.dateText}
                    </span>
                    {item.isPR && (
                      <span className="px-1.5 py-0.2 rounded bg-[#ccff80]/20 text-[#ccff80] font-space text-[10px] font-bold">
                        PR 달성
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#c2cab0] mt-0.5">{item.highlightText}</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#c2cab0]/50 text-[18px]">
                chevron_right
              </span>
            </div>
          ))}
        </div>
      )}

      {/* New Routine Modal */}
      <NewRoutineModal
        isOpen={isNewRoutineOpen}
        onClose={() => setIsNewRoutineOpen(false)}
        onAddRoutine={handleAddRoutine}
      />
    </div>
  );
};
