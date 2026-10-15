/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MealItem } from '../types/fitness.ts';
import { INITIAL_MEALS, AI_RECOMMENDATIONS } from '../data/mockData.ts';
import { FoodSearchModal } from '../components/FoodSearchModal.tsx';
import { FoodCameraModal } from '../components/FoodCameraModal.tsx';
import { FoodBarcodeModal } from '../components/FoodBarcodeModal.tsx';

export const DietView: React.FC = () => {
  // Meals state
  const [meals, setMeals] = useState<MealItem[]>(INITIAL_MEALS);
  const [dateOffset, setDateOffset] = useState(0);

  // Recommendations Quick Add state
  const [recAdded, setRecAdded] = useState(false);

  // Water Tracker state
  const [waterLiters, setWaterLiters] = useState(1.8);
  const targetWater = 2.5;

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);

  // Totals calculation
  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const targetCalories = 2500;
  const remainingCalories = Math.max(0, targetCalories - totalCalories);

  const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);
  const targetProtein = 160;
  const remainingProtein = Math.max(0, targetProtein - totalProtein);

  const carbs = 215;
  const targetCarbs = 280;
  const fat = 54;
  const targetFat = 65;

  const calPercent = Math.min(100, Math.round((totalCalories / targetCalories) * 100));
  const proteinPercent = Math.min(100, Math.round((totalProtein / targetProtein) * 100));
  const carbsPercent = Math.min(100, Math.round((carbs / targetCarbs) * 100));
  const fatPercent = Math.min(100, Math.round((fat / targetFat) * 100));

  const handleAddWater = () => {
    setWaterLiters((prev) => Math.min(3.5, +(prev + 0.25).toFixed(2)));
  };

  const handleAddRecommendation = () => {
    if (recAdded) return;
    const newSnack: MealItem = {
      id: `snack-rec-${Date.now()}`,
      type: 'snack',
      title: '야간 근합성 간식',
      time: '21:30',
      calories: 250,
      protein: 39,
      description: '그릭 요거트 150g, 블루베리 30g, WPI 프로틴 쉐이크',
      completed: true,
    };
    setMeals((prev) => [...prev, newSnack]);
    setRecAdded(true);
    setTimeout(() => setRecAdded(false), 3000);
  };

  const handleAddCustomFood = (food: { title: string; calories: number; protein: number }) => {
    const newMeal: MealItem = {
      id: `custom-food-${Date.now()}`,
      type: 'snack',
      title: '스마트 추가 간식',
      time: '18:00',
      calories: food.calories,
      protein: food.protein,
      description: food.title,
      completed: true,
    };
    setMeals((prev) => [...prev, newMeal]);
  };

  // Date formatting
  const getDateLabel = () => {
    if (dateOffset === 0) return '오늘, 10월 24일';
    if (dateOffset === -1) return '어제, 10월 23일';
    if (dateOffset === 1) return '내일, 10월 25일';
    const day = 24 + dateOffset;
    return `10월 ${day}일`;
  };

  const waterPercent = Math.min(100, Math.round((waterLiters / targetWater) * 100));

  return (
    <div className="flex flex-col w-full gap-5">
      {/* Date Navigator & Header Summary */}
      <section className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setDateOffset((prev) => prev - 1)}
              aria-label="이전 날짜"
              className="w-9 h-9 rounded-full bg-[#262a35] border border-[#313540] flex items-center justify-center text-[#c2cab0] hover:text-[#ccff80] transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>

            <div className="flex items-center gap-1.5 px-1">
              <span className="font-space text-base font-bold text-[#dfe2f1]">
                {getDateLabel()}
              </span>
              <span className="font-space text-xs px-1.5 py-0.5 rounded bg-[#313540] text-[#ccff80] font-bold">
                목
              </span>
            </div>

            <button
              onClick={() => setDateOffset((prev) => prev + 1)}
              aria-label="다음 날짜"
              className="w-9 h-9 rounded-full bg-[#262a35] border border-[#313540] flex items-center justify-center text-[#c2cab0] hover:text-[#ccff80] transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>

          <button
            aria-label="캘린더 열기"
            className="w-9 h-9 rounded-full bg-[#262a35] border border-[#313540] flex items-center justify-center text-[#c2cab0] hover:text-[#ccff80] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
          </button>
        </div>

        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ccff80] animate-pulse" />
            <span className="text-xs text-[#c2cab0]">
              일일 영양 목표 대비{' '}
              <span className="font-space text-xs text-[#ccff80] font-bold">{calPercent}%</span>{' '}
              달성 중
            </span>
          </div>
          <span className="font-space text-[10px] text-[#7bd0ff] tracking-wider uppercase font-bold">
            High-Protein Day
          </span>
        </div>
      </section>

      {/* Calorie & Macro Target Progress Card */}
      <section className="relative overflow-hidden bg-[#171b26] border border-[#313540] rounded-2xl p-5 shadow-xl">
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-[#ccff80]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-[#7bd0ff]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-4">
          {/* Main Calorie Numbers */}
          <div className="flex items-end justify-between">
            <div>
              <span className="font-space text-[11px] uppercase tracking-wider text-[#c2cab0] block mb-1">
                섭취 칼로리 요약
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-space text-3xl font-bold tracking-tight text-[#dfe2f1]">
                  {totalCalories.toLocaleString()}
                </span>
                <span className="font-space text-xs text-[#c2cab0]">/ {targetCalories.toLocaleString()} kcal</span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 bg-[#ccff80]/15 border border-[#ccff80]/30 px-2.5 py-1 rounded-full">
                <span className="material-symbols-outlined text-[14px] text-[#ccff80]">bolt</span>
                <span className="font-space text-[11px] text-[#ccff80] font-bold">
                  {remainingCalories} kcal 남음
                </span>
              </div>
            </div>
          </div>

          {/* Main Calorie Progress Bar with Glow */}
          <div className="w-full bg-[#313540] h-3 rounded-full overflow-hidden p-[2px]">
            <div
              className="bg-gradient-to-r from-[#a3e635] via-[#ccff80] to-[#ccff80] h-full rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(163,230,53,0.5)]"
              style={{ width: `${Math.min(100, (totalCalories / targetCalories) * 100)}%` }}
            />
          </div>

          {/* 3 Key Macronutrient Cards Grid */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {/* Protein */}
            <div className="bg-[#1c1f2a] border border-[#313540]/60 p-3 rounded-xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="font-space text-xs text-[#ccff80] font-bold">단백질</span>
                <span className="font-space text-[11px] text-[#c2cab0] font-medium">{proteinPercent}%</span>
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="font-space text-base text-[#dfe2f1] font-bold">{totalProtein}</span>
                <span className="font-space text-[11px] text-[#c2cab0]">/{targetProtein}g</span>
              </div>
              <div className="w-full bg-[#313540] h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-[#ccff80] h-full rounded-full" style={{ width: `${proteinPercent}%` }} />
              </div>
            </div>

            {/* Carbs */}
            <div className="bg-[#1c1f2a] border border-[#313540]/60 p-3 rounded-xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="font-space text-xs text-[#7bd0ff] font-bold">탄수화물</span>
                <span className="font-space text-[11px] text-[#c2cab0] font-medium">{carbsPercent}%</span>
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="font-space text-base text-[#dfe2f1] font-bold">{carbs}</span>
                <span className="font-space text-[11px] text-[#c2cab0]">/{targetCarbs}g</span>
              </div>
              <div className="w-full bg-[#313540] h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-[#7bd0ff] h-full rounded-full" style={{ width: `${carbsPercent}%` }} />
              </div>
            </div>

            {/* Fat */}
            <div className="bg-[#1c1f2a] border border-[#313540]/60 p-3 rounded-xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="font-space text-xs text-[#c2cab0] font-bold">지방</span>
                <span className="font-space text-[11px] text-[#c2cab0] font-medium">{fatPercent}%</span>
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="font-space text-base text-[#dfe2f1] font-bold">{fat}</span>
                <span className="font-space text-[11px] text-[#c2cab0]">/{targetFat}g</span>
              </div>
              <div className="w-full bg-[#313540] h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-[#c2cab0] h-full rounded-full" style={{ width: `${fatPercent}%` }} />
              </div>
            </div>
          </div>

          {/* Protein Synthesis Callout */}
          <div className="flex items-center justify-between bg-[#262a35] border border-[#424936]/40 px-3 py-2 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-base leading-none">🔥</span>
              <span className="text-xs text-[#dfe2f1]">
                {remainingProtein > 0 ? (
                  <>
                    단 <strong className="text-[#ccff80] font-semibold">+{remainingProtein}g</strong>만 더 섭취하면 오늘 근합성 목표 달성!
                  </>
                ) : (
                  <span className="text-[#ccff80] font-bold">오늘 근합성 단백질 목표 100% 달성 완료!</span>
                )}
              </span>
            </div>
            <span className="material-symbols-outlined text-[#ccff80] text-[18px]">verified</span>
          </div>
        </div>
      </section>

      {/* Smart AI Nutrition Recommendation Card */}
      <section className="bg-gradient-to-br from-[#171b26] to-[#1c1f2a] border border-[#313540] p-5 rounded-2xl flex flex-col gap-4 shadow-md">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#ccff80]/15 flex items-center justify-center text-[#ccff80]">
              <span className="material-symbols-outlined text-[18px]">smart_toy</span>
            </div>
            <div>
              <h2 className="font-space text-base font-bold text-[#dfe2f1] leading-tight">
                운동 맞춤 AI 영양 추천
              </h2>
              <span className="text-[11px] text-[#ccff80]">실시간 생체 회복 알고리즘</span>
            </div>
          </div>
          <span className="font-space text-[11px] px-2.5 py-0.5 rounded-full bg-[#313540] text-[#7bd0ff] font-bold border border-[#313540]">
            상체 고강도
          </span>
        </div>

        <p className="text-xs text-[#c2cab0] leading-relaxed">
          오늘 상체 고강도 프레스 루틴 소화 완료! 빠른 근섬유 복원과 야간 근합성을 위해 취침 전{' '}
          <span className="text-[#dfe2f1] font-medium">고단백 저지방 간식</span>을 권장합니다.
        </p>

        {/* Visual Meal Recommendations Grid */}
        <div className="grid grid-cols-2 gap-2">
          {AI_RECOMMENDATIONS.map((rec) => (
            <div
              key={rec.id}
              className="bg-[#262a35] border border-[#313540] p-2.5 rounded-xl flex flex-col justify-between hover:bg-[#313540] transition-colors cursor-pointer group"
            >
              <div className="w-full h-24 rounded-lg overflow-hidden mb-2 bg-[#313540]">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  data-alt={rec.dataAlt}
                  src={rec.image}
                  alt={rec.title}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-space text-xs text-[#dfe2f1] line-clamp-1 font-bold">
                  {rec.title}
                </span>
                <span className="text-[10px] text-[#c2cab0]">{rec.subtitle}</span>
                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#313540]/60">
                  <span className="font-space text-xs text-[#ccff80] font-bold">P {rec.protein}g</span>
                  <span className="font-space text-[11px] text-[#c2cab0]">{rec.calories} kcal</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddRecommendation}
          className={`w-full py-3 rounded-xl font-space text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-[0.99] border ${
            recAdded
              ? 'bg-[#ccff80] text-[#213600] border-[#ccff80]'
              : 'bg-[#313540] hover:bg-[#353944] text-[#ccff80] border-[#424936]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {recAdded ? 'check' : 'add_circle'}
          </span>
          <span>{recAdded ? '간식 기록에 추가되었습니다!' : '추천 식단에 바로 기록하기'}</span>
        </button>
      </section>

      {/* Meal Logger by Time of Day */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="font-space text-base font-bold text-[#dfe2f1]">끼니별 기록</span>
            <span className="font-space text-xs px-2 py-0.5 rounded-full bg-[#262a35] text-[#c2cab0] border border-[#313540]">
              {meals.length}끼 완료
            </span>
          </div>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="text-xs text-[#c2cab0] hover:text-[#ccff80] transition-colors flex items-center gap-0.5"
          >
            <span>전체 상세</span>
            <span className="material-symbols-outlined text-[14px]">tune</span>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {meals.map((meal) => {
            const iconMap: Record<string, string> = {
              breakfast: 'wb_twilight',
              lunch: 'light_mode',
              snack: 'fitness_center',
              dinner: 'bedtime',
            };
            return (
              <div
                key={meal.id}
                className="bg-[#171b26] border border-[#313540] rounded-2xl p-3.5 flex flex-col gap-1.5 hover:bg-[#1c1f2a] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#262a35] flex items-center justify-center text-[#ccff80]">
                      <span className="material-symbols-outlined text-[18px]">
                        {iconMap[meal.type] || 'restaurant'}
                      </span>
                    </div>
                    <div>
                      <span className="font-space text-sm font-bold text-[#dfe2f1]">{meal.title}</span>
                      <span className="text-xs text-[#c2cab0] ml-1.5">{meal.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="font-space text-xs font-bold text-[#dfe2f1]">
                        {meal.calories} kcal
                      </span>
                      <span className="text-[10px] text-[#ccff80] block font-space font-medium">
                        단백질 {meal.protein}g
                      </span>
                    </div>
                    <button
                      aria-label="끼니 옵션"
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#c2cab0] hover:text-[#dfe2f1]"
                    >
                      <span className="material-symbols-outlined text-[18px]">more_vert</span>
                    </button>
                  </div>
                </div>

                <div className="bg-[#1c1f2a] rounded-xl p-2.5 flex items-center justify-between border border-[#313540]/50">
                  <p className="text-xs text-[#c2cab0] truncate pr-2">{meal.description}</p>
                  <span className="material-symbols-outlined text-[#ccff80] text-[16px] shrink-0">
                    check_circle
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Logging Hub Bar */}
        <div className="bg-[#262a35] border border-[#313540] rounded-2xl p-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="font-space text-xs font-bold text-[#dfe2f1]">+ 빠른 식단 추가</span>
            <span className="text-[11px] text-[#c2cab0]">원터치 스마트 기록</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setIsCameraOpen(true)}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-[#1c1f2a] hover:bg-[#313540] text-[#dfe2f1] transition-all active:scale-95 group border border-[#313540]/60"
            >
              <div className="w-10 h-10 rounded-full bg-[#313540] flex items-center justify-center text-[#ccff80] group-hover:bg-[#ccff80] group-hover:text-[#213600] transition-colors">
                <span className="material-symbols-outlined text-[20px]">photo_camera</span>
              </div>
              <span className="font-space text-xs font-semibold">사진 촬영</span>
            </button>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-[#1c1f2a] hover:bg-[#313540] text-[#dfe2f1] transition-all active:scale-95 group border border-[#313540]/60"
            >
              <div className="w-10 h-10 rounded-full bg-[#313540] flex items-center justify-center text-[#7bd0ff] group-hover:bg-[#7bd0ff] group-hover:text-[#00354a] transition-colors">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </div>
              <span className="font-space text-xs font-semibold">음식 검색</span>
            </button>

            <button
              onClick={() => setIsBarcodeOpen(true)}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-[#1c1f2a] hover:bg-[#313540] text-[#dfe2f1] transition-all active:scale-95 group border border-[#313540]/60"
            >
              <div className="w-10 h-10 rounded-full bg-[#313540] flex items-center justify-center text-[#b2f746] group-hover:bg-[#b2f746] group-hover:text-[#121f00] transition-colors">
                <span className="material-symbols-outlined text-[20px]">barcode_scanner</span>
              </div>
              <span className="font-space text-xs font-semibold">바코드 스캔</span>
            </button>
          </div>
        </div>
      </section>

      {/* Weekly Macro Balance Mini Insight & Water Tracker */}
      <section className="bg-[#171b26] border border-[#313540] rounded-2xl p-5 flex flex-col gap-4 mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ccff80] text-[20px]">insights</span>
            <h3 className="font-space text-base font-bold text-[#dfe2f1]">
              주간 영양 &amp; 수분 밸런스
            </h3>
          </div>
          <span className="font-space text-[10px] px-2 py-0.5 rounded bg-[#ccff80]/20 text-[#ccff80] font-bold">
            최우수
          </span>
        </div>

        {/* Insight Paragraph */}
        <div className="p-3 bg-[#1c1f2a] rounded-xl border border-[#313540]/60">
          <p className="text-xs text-[#dfe2f1] leading-relaxed">
            이번 주 평균 단백질 달성률 <strong className="text-[#ccff80] font-bold">94%</strong>로
            매우 이상적인 동화 상태입니다! 다만 최적의 대사 효율을 위해 수분 섭취를 유지해주세요.
          </p>
        </div>

        {/* Water Intake Widget */}
        <div className="bg-[#1c1f2a] border border-[#313540]/60 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#7bd0ff]/15 flex items-center justify-center text-[#7bd0ff]">
              <span className="material-symbols-outlined text-[22px]">water_drop</span>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-space text-xl font-bold text-[#dfe2f1]">
                  {waterLiters.toFixed(1)}
                </span>
                <span className="font-space text-xs text-[#c2cab0]">/ {targetWater} L</span>
              </div>
              <span className="text-[10px] text-[#7bd0ff] font-space font-semibold">
                오늘 목표 {waterPercent}% 충족
              </span>
            </div>
          </div>

          <button
            onClick={handleAddWater}
            className="px-3 py-2 rounded-xl bg-[#313540] hover:bg-[#7bd0ff] hover:text-[#00354a] transition-all flex items-center gap-1 active:scale-95 group border border-[#424936]"
          >
            <span className="material-symbols-outlined text-[16px] text-[#7bd0ff] group-hover:text-[#00354a]">
              add
            </span>
            <span className="font-space text-xs font-semibold text-[#dfe2f1] group-hover:text-[#00354a]">
              +250ml
            </span>
          </button>
        </div>
      </section>

      {/* Modals */}
      <FoodSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onAddFood={handleAddCustomFood}
      />
      <FoodCameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onConfirmDetection={handleAddCustomFood}
      />
      <FoodBarcodeModal
        isOpen={isBarcodeOpen}
        onClose={() => setIsBarcodeOpen(false)}
        onConfirmBarcode={handleAddCustomFood}
      />
    </div>
  );
};
