/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EXERCISE_ANALYTICS_DATA, WEEKLY_STATS } from '../data/mockData.ts';

type AnalyticsTab = 'exercise' | 'weeklyVolume' | 'consistency';

export const AnalyticsView: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<AnalyticsTab>('exercise');
  const [exerciseKey, setExerciseKey] = useState<string>('bench-press');
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number | null>(7);

  const currentExercise = EXERCISE_ANALYTICS_DATA[exerciseKey] || EXERCISE_ANALYTICS_DATA['bench-press'];

  const exercises = [
    { key: 'bench-press', name: '벤치프레스 (바벨)' },
    { key: 'deadlift', name: '데드리프트 (컨벤셔널)' },
    { key: 'squat', name: '백 스쿼트' },
    { key: 'overhead-press', name: '오버헤드 프레스' },
  ];

  const handleCycleExercise = () => {
    const keys = Object.keys(EXERCISE_ANALYTICS_DATA);
    const currentIndex = keys.indexOf(exerciseKey);
    const nextKey = keys[(currentIndex + 1) % keys.length];
    setExerciseKey(nextKey);
  };

  // Convert chart points to SVG coordinates
  // SVG viewbox 0 0 320 150
  const points = currentExercise.chartPoints;
  const minVal = points[0].value;
  const maxVal = points[points.length - 1].value;
  const valRange = maxVal - minVal || 1;

  const svgCoords = points.map((p, i) => {
    const x = 10 + (i * (300 / (points.length - 1)));
    const y = 135 - ((p.value - minVal) / valRange) * 115;
    return { x, y, value: p.value, week: p.week };
  });

  const pathD = svgCoords.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${svgCoords[svgCoords.length - 1].x} 140 L ${svgCoords[0].x} 140 Z`;

  return (
    <div className="flex flex-col w-full gap-5">
      {/* Sub-Header / Segment Navigation */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-[#ccff80] text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              insights
            </span>
            <span className="font-space text-lg font-bold text-[#dfe2f1]">
              성장 및 통계 분석
            </span>
          </div>
          <span className="font-space text-[10px] px-2.5 py-1 rounded-full bg-[#262a35] text-[#7bd0ff] font-bold border border-[#313540]">
            LIVE DATA
          </span>
        </div>

        {/* Segmented Tabs */}
        <div className="flex p-1 rounded-xl bg-[#171b26] border border-[#313540] gap-1" role="tablist">
          <button
            onClick={() => setSelectedTab('exercise')}
            className={`flex-1 py-2 px-1 rounded-lg font-space text-xs text-center transition-all flex items-center justify-center gap-1 ${
              selectedTab === 'exercise'
                ? 'bg-[#262a35] text-[#ccff80] font-bold shadow-sm'
                : 'text-[#c2cab0] hover:text-[#dfe2f1]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">show_chart</span>
            종목별 성장
          </button>
          <button
            onClick={() => setSelectedTab('weeklyVolume')}
            className={`flex-1 py-2 px-1 rounded-lg font-space text-xs text-center transition-all flex items-center justify-center gap-1 ${
              selectedTab === 'weeklyVolume'
                ? 'bg-[#262a35] text-[#ccff80] font-bold shadow-sm'
                : 'text-[#c2cab0] hover:text-[#dfe2f1]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">bar_chart</span>
            주간 볼륨
          </button>
          <button
            onClick={() => setSelectedTab('consistency')}
            className={`flex-1 py-2 px-1 rounded-lg font-space text-xs text-center transition-all flex items-center justify-center gap-1 ${
              selectedTab === 'consistency'
                ? 'bg-[#262a35] text-[#ccff80] font-bold shadow-sm'
                : 'text-[#c2cab0] hover:text-[#dfe2f1]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
            꾸준함 지표
          </button>
        </div>
      </section>

      {/* Exercise Dropdown & 1RM Hero Card */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={handleCycleExercise}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#262a35] border border-[#313540] text-[#dfe2f1] font-space text-xs font-semibold hover:bg-[#313540] transition-colors active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined text-[#7bd0ff] text-[18px]">fitness_center</span>
            <span>{currentExercise.name}</span>
            <span className="material-symbols-outlined text-[#c2cab0] text-[16px]">expand_more</span>
          </button>

          <span className="font-space text-xs text-[#c2cab0] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ccff80] animate-pulse" />
            8주간 추적 중
          </span>
        </div>

        {/* Metric Highlight Bento Card */}
        <div className="p-5 rounded-2xl bg-[#1c1f2a] border border-[#313540] relative overflow-hidden shadow-lg flex flex-col gap-4">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#ccff80]/10 blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between">
            <div>
              <span className="font-space text-xs text-[#c2cab0] block mb-1">
                예상 1RM 퍼포먼스
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-space text-4xl font-bold text-[#ccff80] tracking-tight">
                  {currentExercise.estimated1RM.toFixed(1)}
                </span>
                <span className="font-space text-lg text-[#ccff80] font-medium">kg</span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="px-2.5 py-1 rounded-lg bg-[#a3e635]/20 text-[#ccff80] font-space text-xs font-semibold flex items-center gap-0.5 shadow-sm border border-[#ccff80]/20">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                {currentExercise.improvement}
              </span>
              <span className="text-[11px] text-[#c2cab0] mt-1">{currentExercise.baseline}</span>
            </div>
          </div>

          {/* Quick Exercise Specs Strip */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="flex flex-col p-2.5 rounded-xl bg-[#262a35] border border-[#313540]/60">
              <span className="text-[11px] text-[#c2cab0]">최고 중량</span>
              <span className="font-space text-sm font-bold text-[#dfe2f1] mt-0.5">
                {currentExercise.maxWeight.toFixed(1)} kg
              </span>
            </div>
            <div className="flex flex-col p-2.5 rounded-xl bg-[#262a35] border border-[#313540]/60">
              <span className="text-[11px] text-[#c2cab0]">최대 볼륨</span>
              <span className="font-space text-sm font-bold text-[#dfe2f1] mt-0.5">
                {currentExercise.maxVolume.toLocaleString()} kg
              </span>
            </div>
            <div className="flex flex-col p-2.5 rounded-xl bg-[#262a35] border border-[#313540]/60">
              <span className="text-[11px] text-[#c2cab0]">누적 세트</span>
              <span className="font-space text-sm font-bold text-[#7bd0ff] mt-0.5">
                {currentExercise.totalSets} sets
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Progress Chart */}
      <section className="flex flex-col gap-2 p-5 rounded-2xl bg-[#1c1f2a] border border-[#313540] shadow-md relative">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-space text-base font-bold text-[#dfe2f1]">중량 성장 궤적</h3>
            <p className="text-xs text-[#c2cab0]">지난 8주간 추정 1RM 성장 추이</p>
          </div>

          {/* Chart Tooltip Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ccff80]/10 border border-[#ccff80]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ccff80]" />
            <span className="font-space text-xs text-[#ccff80] font-semibold">
              최근 최고 {currentExercise.estimated1RM}kg
            </span>
          </div>
        </div>

        {/* SVG Line Chart Canvas */}
        <div className="relative w-full h-48 mt-3 select-none">
          <svg className="w-full h-full overflow-visible" fill="none" preserveAspectRatio="none" viewBox="0 0 320 150">
            <defs>
              <linearGradient id="chartGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ccff80" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ccff80" stopOpacity="0.0" />
              </linearGradient>
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#a3e635" floodOpacity="0.6" />
              </filter>
            </defs>

            {/* Horizontal Guide Lines */}
            <line x1="0" x2="320" y1="20" y2="20" stroke="#313540" strokeDasharray="3 3" strokeWidth="1" />
            <line x1="0" x2="320" y1="60" y2="60" stroke="#313540" strokeDasharray="3 3" strokeWidth="1" />
            <line x1="0" x2="320" y1="100" y2="100" stroke="#313540" strokeDasharray="3 3" strokeWidth="1" />
            <line x1="0" x2="320" y1="140" y2="140" stroke="#313540" strokeWidth="1" />

            {/* Area Fill */}
            <path d={areaD} fill="url(#chartGrad)" />

            {/* Main Line */}
            <path
              d={pathD}
              filter="url(#neonGlow)"
              stroke="#ccff80"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Knots */}
            {svgCoords.map((pt, idx) => (
              <g key={idx} onClick={() => setSelectedWeekIndex(idx)} className="cursor-pointer">
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={selectedWeekIndex === idx ? 5 : 3.5}
                  fill="#0f131d"
                  stroke="#ccff80"
                  strokeWidth="2"
                />
              </g>
            ))}

            {/* Peak Beacon at the end */}
            <circle
              cx={svgCoords[svgCoords.length - 1].x}
              cy={svgCoords[svgCoords.length - 1].y}
              r="7"
              fill="#ccff80"
              fillOpacity="0.25"
              className="animate-ping"
            />
            <circle
              cx={svgCoords[svgCoords.length - 1].x}
              cy={svgCoords[svgCoords.length - 1].y}
              r="5"
              fill="#ccff80"
              stroke="#0f131d"
              strokeWidth="2"
            />
          </svg>

          {/* Interactive Tooltip Pin */}
          {selectedWeekIndex !== null && (
            <div
              className="absolute -top-3 transform -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all"
              style={{
                left: `${(selectedWeekIndex / (points.length - 1)) * 100}%`,
              }}
            >
              <div className="px-2 py-0.5 rounded bg-[#ccff80] text-[#213600] font-space text-[10px] font-bold shadow-lg">
                {points[selectedWeekIndex].value}kg
              </div>
            </div>
          )}
        </div>

        {/* Weeks Axis Scale */}
        <div className="flex items-center justify-between text-[#c2cab0] font-space text-xs pt-1">
          {points.map((pt, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedWeekIndex(idx)}
              className={`hover:text-[#ccff80] transition-colors ${
                selectedWeekIndex === idx ? 'text-[#ccff80] font-bold' : ''
              }`}
            >
              {pt.week}
            </button>
          ))}
        </div>
      </section>

      {/* Weekly Comparison Log Matrix */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="font-space text-base font-bold text-[#dfe2f1]">주차별 종합 기록표</h3>
            <p className="text-xs text-[#c2cab0]">볼륨 량 및 트레이닝 밀도 집계</p>
          </div>
          <button className="font-space text-xs text-[#7bd0ff] hover:underline flex items-center">
            전체보기
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {WEEKLY_STATS.map((stat, idx) => {
            const isPositive = stat.changeRate > 0;
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl flex flex-col gap-1.5 transition-all border ${
                  stat.isCurrent
                    ? 'bg-[#1c1f2a] border-[#ccff80]/40 shadow-sm'
                    : 'bg-[#171b26] border-[#313540]/60 hover:bg-[#1c1f2a]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        stat.isCurrent ? 'bg-[#ccff80]' : 'bg-[#313540]'
                      }`}
                    />
                    <span className="font-space text-sm font-bold text-[#dfe2f1]">
                      {stat.weekLabel}
                    </span>
                    {stat.isCurrent && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-space bg-[#313540] text-[#c2cab0]">
                        이번 주
                      </span>
                    )}
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full font-space text-xs font-bold flex items-center gap-0.5 ${
                      isPositive
                        ? 'bg-[#ccff80]/15 text-[#ccff80]'
                        : 'bg-red-500/20 text-red-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {isPositive ? 'arrow_drop_up' : 'arrow_drop_down'}
                    </span>
                    {isPositive ? `+${stat.changeRate}%` : `${stat.changeRate}%`}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#c2cab0]">총 볼륨</span>
                    <span className="font-space text-base font-bold text-[#dfe2f1]">
                      {stat.totalVolume.toLocaleString()}
                      <span className="text-xs font-normal text-[#c2cab0] ml-0.5">kg</span>
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#c2cab0]">운동 빈도</span>
                    <span className="font-space text-base font-bold text-[#dfe2f1]">
                      {stat.frequency}
                      <span className="text-xs font-normal text-[#c2cab0] ml-0.5">회</span>
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#c2cab0]">수행 세트</span>
                    <span
                      className={`font-space text-base font-bold ${
                        stat.isCurrent ? 'text-[#ccff80]' : 'text-[#dfe2f1]'
                      }`}
                    >
                      {stat.completedSets}
                      <span className="text-xs font-normal text-[#c2cab0] ml-0.5">sets</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Consistency & Streak Card */}
      <section className="p-5 rounded-2xl bg-[#1c1f2a] border border-[#313540] relative overflow-hidden shadow-lg flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[#7bd0ff]">
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_fire_department
            </span>
            <span className="font-space text-xs font-bold">연속 18일 기록 달성 중</span>
          </div>
          <h4 className="font-space text-lg font-bold text-[#dfe2f1]">
            이번 달 목표 달성률 92%
          </h4>
          <p className="text-xs text-[#c2cab0]">
            월간 루틴 계획까지 단 2회의 세션이 남았습니다!
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#262a35] text-[#c2cab0] font-space text-[11px] border border-[#313540]">
              체계적 점진 과부하 유지 중
            </span>
          </div>
        </div>

        {/* Circular Progress Ring */}
        <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#262a35"
              strokeWidth="3.5"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#7bd0ff"
              strokeDasharray="92, 100"
              strokeLinecap="round"
              strokeWidth="3.8"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="font-space text-sm font-bold text-[#dfe2f1]">92%</span>
          </div>
        </div>
      </section>

      {/* Visual Coaching Delight Banner */}
      <section className="p-4 rounded-2xl bg-[#171b26] border border-[#313540] flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#262a35] border border-[#313540] flex items-center justify-center shrink-0 text-[#ccff80]">
          <span className="material-symbols-outlined text-[28px]">military_tech</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-space text-xs font-bold text-[#dfe2f1] truncate">
            새로운 PR 뱃지 획득 가능권
          </span>
          <span className="text-xs text-[#c2cab0] truncate">{currentExercise.targetBadge}</span>
        </div>
      </section>
    </div>
  );
};
