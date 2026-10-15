/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface HomeViewProps {
  onStartRoutine: () => void;
  onGoToAnalytics: () => void;
  onGoToRoutine: () => void;
}

const QUOTES = [
  '상쾌한 야외 공기 마시며 턱걸이 당기기 딱 좋은 날씨! 오늘도 어제보다 한 걸음 더.',
  '중량이 무거울수록 호흡을 견고히 잡고 코어 텐션을 끝까지 유지하세요.',
  '근비대는 체계적인 점진 과부하와 충분한 수면에서 결정됩니다.',
  '어제의 한계를 오늘 극복하는 것이 진정한 스트렝스 트레이닝입니다.',
];

export const HomeView: React.FC<HomeViewProps> = ({
  onStartRoutine,
  onGoToAnalytics,
  onGoToRoutine,
}) => {
  const [boostActive, setBoostActive] = useState(true);
  const [quoteIdx, setQuoteIdx] = useState(0);

  const cycleQuote = () => {
    setQuoteIdx((prev) => (prev + 1) % QUOTES.length);
  };

  return (
    <div className="flex flex-col w-full gap-5">
      {/* User Greeting & Boost Status */}
      <section className="flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-space text-2xl font-bold tracking-tight text-[#dfe2f1] flex items-center gap-1.5">
              안녕하세요, 민우님! <span className="text-xl">🔥</span>
            </h1>
            <p className="text-xs text-[#c2cab0] mt-0.5">
              오늘도 어제보다 강해질 시간입니다.
            </p>
          </div>

          <button
            onClick={() => setBoostActive(!boostActive)}
            className={`px-2.5 py-1.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
              boostActive
                ? 'bg-[#ccff80]/15 border-[#ccff80] text-[#ccff80] shadow-[0_0_12px_rgba(204,255,128,0.25)]'
                : 'bg-[#171b26] border-[#313540] text-[#c2cab0]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            <span className="text-[10px] font-bold tracking-tight">부스트 {boostActive ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Location & Weather Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1c1f2a] border border-[#313540] text-[11px] text-[#c2cab0] w-fit">
          <span className="flex items-center gap-1 text-[#ccff80]">
            <span className="material-symbols-outlined text-[14px]">location_on</span>
            남산 야외 체육장
          </span>
          <span className="text-[#424936]">·</span>
          <span className="flex items-center gap-1 text-[#dfe2f1]">
            <span>☀️</span> 맑음 18°C
          </span>
          <span className="text-[#424936]">·</span>
          <span>습도 45%</span>
        </div>
      </section>

      {/* Week Streak Tracker Strip */}
      <section className="p-4 rounded-2xl bg-[#1c1f2a] border border-[#313540] flex flex-col gap-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#dfe2f1]">이번 주 4일 연속 운동 달성중!</span>
          </div>
          <span className="text-[11px] text-[#ccff80] font-space font-semibold px-2 py-0.5 rounded-full bg-[#ccff80]/15">
            연속 12일째
          </span>
        </div>

        {/* Day Badges */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {[
            { day: '월', done: true },
            { day: '화', done: true },
            { day: '수', done: true },
            { day: '오늘', done: true, isToday: true },
            { day: '금', done: false },
            { day: '토', done: false },
            { day: '일', done: false, isRest: true },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <span className={`text-[11px] font-space ${item.isToday ? 'text-[#ccff80] font-bold' : 'text-[#c2cab0]'}`}>
                {item.day}
              </span>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  item.isToday
                    ? 'bg-[#ccff80] text-[#213600] font-bold shadow-[0_0_10px_rgba(204,255,128,0.4)]'
                    : item.done
                    ? 'bg-[#a3e635] text-[#213600]'
                    : item.isRest
                    ? 'bg-[#171b26] text-[#c2cab0] border border-[#313540]'
                    : 'bg-[#171b26] text-[#424936] border border-[#313540]'
                }`}
              >
                {item.done ? (
                  <span className="material-symbols-outlined text-[18px] font-bold">check</span>
                ) : item.isRest ? (
                  <span className="text-xs">🛏️</span>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#424936]"></span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mountain Gym Motivation Banner */}
      <section className="p-3.5 rounded-2xl bg-[#171b26] border border-[#424936]/50 flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#ccff80]/10 flex items-center justify-center text-[#ccff80] shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[20px]">forest</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#ccff80]/20 text-[#ccff80] font-bold">
                산스장 모드
              </span>
              <span className="text-[10px] text-[#7bd0ff] font-semibold">오늘의 한마디</span>
            </div>
            <p className="text-xs text-[#dfe2f1] leading-relaxed italic">
              "{QUOTES[quoteIdx]}"
            </p>
          </div>
        </div>
        <button
          onClick={cycleQuote}
          aria-label="한마디 새로고침"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#c2cab0] hover:text-[#ccff80] transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">replay</span>
        </button>
      </section>

      {/* Today's Recommended Routine Card */}
      <section className="relative overflow-hidden p-5 rounded-2xl bg-[#1c1f2a] border border-[#313540] flex flex-col gap-4 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full bg-[#ccff80]/15 text-[#ccff80] font-space text-[11px] font-bold">
            오늘의 추천 루틴
          </span>
          <span className="text-xs font-semibold text-[#7bd0ff] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">tune</span>
            맞춤 설계됨
          </span>
        </div>

        <div>
          <h2 className="font-space text-2xl font-bold text-[#dfe2f1]">상체 프레스 루틴</h2>
          <p className="text-xs text-[#c2cab0] mt-1">
            가슴 상부 볼륨 증대 &amp; 삼두 근신경 집중 타깃
          </p>
        </div>

        {/* Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#262a35] text-xs text-[#dfe2f1]">
            <span className="material-symbols-outlined text-[14px] text-[#ccff80]">schedule</span>
            <span>55분</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#262a35] text-xs text-[#dfe2f1]">
            <span className="material-symbols-outlined text-[14px] text-[#7bd0ff]">fitness_center</span>
            <span>5개 운동</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#262a35] text-xs text-[#dfe2f1]">
            <span className="material-symbols-outlined text-[14px] text-[#ccff80]">speed</span>
            <span>RPE 8.5</span>
          </div>
        </div>

        {/* Exercise Previews */}
        <div className="flex flex-col gap-2 pt-1 border-t border-[#313540]/60">
          <div className="flex items-center justify-between text-xs text-[#dfe2f1]">
            <span className="font-semibold">1. 인클라인 덤벨 프레스</span>
            <span className="text-[#c2cab0] font-space">4 세트 · 8-12 회</span>
          </div>
          <div className="flex items-center justify-between text-xs text-[#dfe2f1]">
            <span className="font-semibold">2. 바벨 벤치프레스</span>
            <span className="text-[#c2cab0] font-space">5 세트 · 5-8 회</span>
          </div>
          <div className="flex items-center justify-between text-xs text-[#dfe2f1]">
            <span className="font-semibold">3. 케이블 트라이셉스 푸시다운</span>
            <span className="text-[#c2cab0] font-space">3 세트 · 15 회</span>
          </div>
        </div>

        {/* Big Start Button */}
        <button
          onClick={onStartRoutine}
          className="w-full py-3.5 rounded-xl bg-[#ccff80] text-[#213600] font-space text-sm font-bold shadow-[0_8px_20px_-4px_rgba(204,255,128,0.4)] hover:brightness-105 active:scale-98 transition-all flex flex-col items-center justify-center"
        >
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[20px]">play_arrow</span>
            <span>내 루틴 시작하기</span>
          </div>
          <span className="text-[10px] text-[#213600]/80 font-normal">설정된 무게·횟수로 바로 기록</span>
        </button>
      </section>

      {/* Weekly Metric Summary */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-space text-base font-bold text-[#dfe2f1]">이번 주 성과 요약</h3>
          <span className="text-[11px] text-[#c2cab0]">월요일 기준 갱신</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-xl bg-[#1c1f2a] border border-[#313540] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#c2cab0]">이번 주 볼륨</span>
              <span className="material-symbols-outlined text-[#ccff80] text-[16px]">hourglass_empty</span>
            </div>
            <div className="mt-2">
              <span className="font-space text-lg font-bold text-[#dfe2f1]">18,450<span className="text-xs font-normal text-[#c2cab0] ml-0.5">kg</span></span>
              <span className="text-[10px] text-[#ccff80] font-semibold flex items-center gap-0.5 mt-0.5">
                <span className="material-symbols-outlined text-[12px]">trending_up</span> +8%
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#1c1f2a] border border-[#313540] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#c2cab0]">운동 시간</span>
              <span className="material-symbols-outlined text-[#7bd0ff] text-[16px]">schedule</span>
            </div>
            <div className="mt-2">
              <span className="font-space text-lg font-bold text-[#dfe2f1]">3<span className="text-xs">h</span> 40<span className="text-xs">m</span></span>
              <span className="text-[10px] text-[#c2cab0] block mt-0.5">목표 5시간</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#1c1f2a] border border-[#313540] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#c2cab0]">완료 세트</span>
              <span className="material-symbols-outlined text-[#ccff80] text-[16px]">check_circle</span>
            </div>
            <div className="mt-2">
              <span className="font-space text-lg font-bold text-[#ccff80]">48<span className="text-xs font-normal text-[#c2cab0] ml-0.5">세트</span></span>
              <span className="text-[10px] text-[#ccff80] block mt-0.5">달성률 92%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity Card */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-space text-base font-bold text-[#dfe2f1]">최근 활동</h3>
          <button
            onClick={onGoToRoutine}
            className="text-xs text-[#ccff80] hover:underline flex items-center"
          >
            전체 보기
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        <div
          onClick={onGoToAnalytics}
          className="p-3.5 rounded-2xl bg-[#1c1f2a] border border-[#313540] hover:bg-[#262a35] transition-all flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#262a35] flex items-center justify-center text-[#ccff80]">
              <span className="material-symbols-outlined text-[24px]">military_tech</span>
            </div>
            <div className="flex flex-col">
              <span className="font-space text-xs font-bold text-[#dfe2f1] flex items-center gap-1">
                어제: 하체 &amp; 코어 완료 🏆
              </span>
              <span className="text-[11px] text-[#ccff80] font-semibold mt-0.5">
                스쿼트 신기록 120kg 달성!
              </span>
              <span className="text-[10px] text-[#c2cab0]">
                총 볼륨 6,800kg · 52분 소요
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] text-[#c2cab0]">어제 19:42</span>
            <span className="material-symbols-outlined text-[18px] text-[#c2cab0] group-hover:text-[#ccff80] transition-transform group-hover:translate-x-0.5">
              arrow_forward
            </span>
          </div>
        </div>
      </section>

      {/* Tip Callout */}
      <section className="p-3.5 rounded-xl bg-[#171b26] border border-[#424936]/40 flex items-start gap-2.5">
        <span className="material-symbols-outlined text-[#7bd0ff] text-[20px] shrink-0 mt-0.5">lightbulb</span>
        <p className="text-xs text-[#dfe2f1] leading-relaxed">
          지난주 목요일 대비 가슴 세션 볼륨을 <strong className="text-[#ccff80]">1세트 더 소화</strong>하면 새로운 주간 최고 기록을 경신합니다!
        </p>
      </section>
    </div>
  );
};
