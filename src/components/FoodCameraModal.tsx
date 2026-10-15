/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface FoodCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDetection: (food: { title: string; calories: number; protein: number }) => void;
}

export const FoodCameraModal: React.FC<FoodCameraModalProps> = ({
  isOpen,
  onClose,
  onConfirmDetection,
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [detected, setDetected] = useState(false);

  if (!isOpen) return null;

  const handleSnap = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setDetected(true);
    }, 1400);
  };

  const detectedFood = {
    title: '구운 닭가슴살 샐러드 & 아몬드',
    calories: 340,
    protein: 36,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-[#1c1f2a] border border-[#313540] rounded-2xl shadow-2xl p-5 flex flex-col gap-4 text-[#dfe2f1]">
        <div className="flex items-center justify-between border-b border-[#313540] pb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ccff80] text-[20px]">photo_camera</span>
            <h3 className="font-space text-base font-bold">스마트 사진 식단 인식</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#c2cab0] hover:text-white hover:bg-[#262a35]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Viewfinder Preview */}
        <div className="relative w-full h-52 bg-[#0a0e18] rounded-xl overflow-hidden flex flex-col items-center justify-center border border-[#313540]">
          {/* Target grid overlay */}
          <div className="absolute inset-4 border border-dashed border-[#ccff80]/40 rounded-lg pointer-events-none flex items-center justify-center">
            {analyzing && (
              <div className="absolute inset-x-0 h-1 bg-[#ccff80] animate-bounce shadow-[0_0_12px_#ccff80]" />
            )}
          </div>

          {!analyzing && !detected && (
            <div className="flex flex-col items-center gap-2 text-[#c2cab0] px-4 text-center">
              <span className="material-symbols-outlined text-[36px] text-[#ccff80]">center_focus_strong</span>
              <span className="text-xs">식판이나 음식 접시를 사각형 안에 맞춰주세요</span>
            </div>
          )}

          {analyzing && (
            <div className="flex flex-col items-center gap-2 text-[#ccff80]">
              <span className="material-symbols-outlined text-[32px] animate-spin">autorenew</span>
              <span className="font-space text-xs font-bold">AI 식품 영양 성분 정밀 분석 중...</span>
            </div>
          )}

          {detected && (
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-[#1c1f2a]/90 backdrop-blur border border-[#ccff80] mx-4 text-center animate-fadeIn">
              <span className="text-[10px] text-[#ccff80] font-bold">인식 성공 98.4%</span>
              <span className="font-space text-sm font-bold text-[#dfe2f1]">{detectedFood.title}</span>
              <span className="text-xs text-[#c2cab0]">
                {detectedFood.calories} kcal · <strong className="text-[#ccff80]">단백질 {detectedFood.protein}g</strong>
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        {!detected ? (
          <button
            onClick={handleSnap}
            disabled={analyzing}
            className="w-full py-3 rounded-xl bg-[#ccff80] text-[#213600] font-space text-xs font-bold hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">camera</span>
            사진 촬영 및 분석
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setDetected(false)}
              className="flex-1 py-2.5 rounded-xl bg-[#262a35] text-xs text-[#c2cab0] hover:text-[#dfe2f1]"
            >
              다시 촬영
            </button>
            <button
              onClick={() => {
                onConfirmDetection(detectedFood);
                onClose();
              }}
              className="flex-2 py-2.5 rounded-xl bg-[#ccff80] text-[#213600] font-space text-xs font-bold hover:brightness-105"
            >
              식단에 바로 기록하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
