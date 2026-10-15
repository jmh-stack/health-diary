/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface FoodSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFood: (item: { title: string; calories: number; protein: number }) => void;
}

const COMMON_FITNESS_FOODS = [
  { title: '수비드 닭가슴살 1팩 (120g)', calories: 135, protein: 28 },
  { title: '삶은 달걀 2개 (완숙)', calories: 140, protein: 12 },
  { title: '오트밀 50g + 아몬드 브리즈', calories: 210, protein: 7 },
  { title: '소고기 안심 스테이크 150g', calories: 280, protein: 34 },
  { title: '고구마 150g (구운 고구마)', calories: 195, protein: 3 },
  { title: '프로틴 쉐이크 1잔 (30g 단백질)', calories: 140, protein: 30 },
  { title: '연어 구이 1토막 (150g)', calories: 310, protein: 26 },
  { title: '바나나 1개 (중간 크기)', calories: 105, protein: 1 },
];

export const FoodSearchModal: React.FC<FoodSearchModalProps> = ({
  isOpen,
  onClose,
  onAddFood,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredFoods = COMMON_FITNESS_FOODS.filter((food) =>
    food.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-[#1c1f2a] border border-[#313540] rounded-2xl shadow-2xl p-5 flex flex-col gap-3 text-[#dfe2f1]">
        <div className="flex items-center justify-between border-b border-[#313540] pb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#7bd0ff] text-[20px]">search</span>
            <h3 className="font-space text-base font-bold">음식 검색 및 추가</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#c2cab0] hover:text-white hover:bg-[#262a35]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-[#c2cab0] text-[18px]">search</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="음식명 또는 브랜드 검색 (예: 닭가슴살, 바나나)"
            className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#171b26] border border-[#313540] text-xs text-[#dfe2f1] focus:outline-none focus:border-[#7bd0ff]"
            autoFocus
          />
        </div>

        {/* Results List */}
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
          {filteredFoods.map((food, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#262a35] hover:bg-[#313540] border border-transparent hover:border-[#7bd0ff]/30 transition-all"
            >
              <div className="flex flex-col">
                <span className="font-space text-xs font-semibold text-[#dfe2f1]">{food.title}</span>
                <span className="text-[10px] text-[#c2cab0] mt-0.5">
                  {food.calories} kcal · <strong className="text-[#ccff80]">단백질 {food.protein}g</strong>
                </span>
              </div>
              <button
                onClick={() => {
                  onAddFood(food);
                  onClose();
                }}
                className="px-2.5 py-1 rounded-lg bg-[#ccff80] text-[#213600] font-space text-xs font-bold hover:brightness-105 active:scale-95 transition-all"
              >
                + 추가
              </button>
            </div>
          ))}

          {filteredFoods.length === 0 && (
            <div className="py-8 text-center text-xs text-[#c2cab0]">
              검색 결과가 없습니다. 직접 영양성분을 입력해보세요.
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#262a35] hover:bg-[#313540] text-xs text-[#c2cab0] transition-colors"
        >
          취소
        </button>
      </div>
    </div>
  );
};
