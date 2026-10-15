/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface FoodBarcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmBarcode: (food: { title: string; calories: number; protein: number }) => void;
}

export const FoodBarcodeModal: React.FC<FoodBarcodeModalProps> = ({
  isOpen,
  onClose,
  onConfirmBarcode,
}) => {
  const [scanned, setScanned] = useState(false);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setScanned(true);
  };

  const barcodeFood = {
    title: '신타6 엣지 프로틴 파우더 1서빙 (38g)',
    calories: 155,
    protein: 24,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-[#1c1f2a] border border-[#313540] rounded-2xl shadow-2xl p-5 flex flex-col gap-4 text-[#dfe2f1]">
        <div className="flex items-center justify-between border-b border-[#313540] pb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ccff80] text-[20px]">barcode_scanner</span>
            <h3 className="font-space text-base font-bold">바코드 영양 스캐너</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#c2cab0] hover:text-white hover:bg-[#262a35]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Barcode Frame */}
        <div className="relative w-full h-44 bg-[#0a0e18] rounded-xl overflow-hidden flex flex-col items-center justify-center border border-[#313540]">
          <div className="w-3/4 h-24 border-2 border-[#ccff80] rounded-lg relative flex items-center justify-center">
            <div className="w-full h-0.5 bg-red-500 shadow-[0_0_8px_red] animate-pulse" />
          </div>
          <span className="text-[11px] text-[#c2cab0] mt-3">식품 뒷면 바코드를 중앙 라인에 비춰주세요</span>
        </div>

        {scanned ? (
          <div className="flex flex-col gap-2 p-3 rounded-xl bg-[#262a35] border border-[#ccff80]">
            <span className="text-[10px] text-[#ccff80] font-bold">국내외 영양성분 DB 매칭 완료</span>
            <span className="font-space text-xs font-bold text-[#dfe2f1]">{barcodeFood.title}</span>
            <span className="text-xs text-[#c2cab0]">
              {barcodeFood.calories} kcal · <strong className="text-[#ccff80]">단백질 {barcodeFood.protein}g</strong>
            </span>
            <button
              onClick={() => {
                onConfirmBarcode(barcodeFood);
                onClose();
              }}
              className="mt-1 w-full py-2 rounded-lg bg-[#ccff80] text-[#213600] font-space text-xs font-bold hover:brightness-105"
            >
              식단에 바로 기록하기
            </button>
          </div>
        ) : (
          <button
            onClick={handleSimulateScan}
            className="w-full py-3 rounded-xl bg-[#ccff80] text-[#213600] font-space text-xs font-bold hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
            바코드 즉시 스캔
          </button>
        )}
      </div>
    </div>
  );
};
