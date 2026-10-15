/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface WorkoutCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  volume: number;
  completedSetsCount: number;
  totalSetsCount: number;
  durationSeconds: number;
  onGoToAnalytics: () => void;
}

export const WorkoutCompleteModal: React.FC<WorkoutCompleteModalProps> = ({
  isOpen,
  onClose,
  volume,
  completedSetsCount,
  totalSetsCount,
  durationSeconds,
  onGoToAnalytics,
}) => {
  if (!isOpen) return null;

  const mm = String(Math.floor((durationSeconds % 3600) / 60)).padStart(2, '0');
  const ss = String(durationSeconds % 60).padStart(2, '0');
  const hh = Math.floor(durationSeconds / 3600);
  const durationText = hh > 0 ? `${hh}시간 ${mm}분` : `${mm}분 ${ss}초`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-[#1c1f2a] border border-[#ccff80]/40 rounded-3xl shadow-[0_0_35px_rgba(204,255,128,0.2)] p-6 flex flex-col items-center text-center gap-4 text-[#dfe2f1]">
        {/* Animated Trophy Icon */}
        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-[#ccff80]/15 ring-2 ring-[#ccff80] shadow-[0_0_20px_rgba(204,255,128,0.3)]">
          <span className="material-symbols-outlined text-[36px] text-[#ccff80]">trophy</span>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ccff80] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#ccff80]"></span>
          </span>
        </div>

        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#ccff80]/20 text-[#ccff80] text-[11px] font-bold tracking-wide">
            SESSION FINISHED
          </span>
          <h2 className="font-space text-2xl font-bold text-[#dfe2f1] mt-1.5">
            오늘 운동 완료!
          </h2>
          <p className="text-xs text-[#c2cab0] mt-1">
            점진적 과부하 달성 성공! 근합성을 위해 고단백 영양을 보충하세요.
          </p>
        </div>

        {/* Stats Bento Grid */}
        <div className="w-full grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#171b26] border border-[#313540]">
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#262a35]">
            <span className="text-[10px] text-[#c2cab0]">누적 볼륨</span>
            <span className="font-space text-sm font-bold text-[#ccff80] mt-0.5">
              {volume.toLocaleString()} kg
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#262a35]">
            <span className="text-[10px] text-[#c2cab0]">수행 세트</span>
            <span className="font-space text-sm font-bold text-[#7bd0ff] mt-0.5">
              {completedSetsCount} / {totalSetsCount}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#262a35]">
            <span className="text-[10px] text-[#c2cab0]">소요 시간</span>
            <span className="font-space text-sm font-bold text-[#dfe2f1] mt-0.5">
              {durationText}
            </span>
          </div>
        </div>

        {/* PR Badge notification */}
        <div className="w-full flex items-center justify-between p-3 rounded-xl bg-[#262a35] border border-[#424936]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ccff80] text-[20px]">verified</span>
            <span className="text-xs font-semibold text-left">벤치프레스 80kg 8회 성공</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#ccff80]/20 text-[#ccff80] font-bold">
            NEW PR
          </span>
        </div>

        <div className="w-full flex flex-col gap-2 pt-1">
          <button
            onClick={() => {
              onClose();
              onGoToAnalytics();
            }}
            className="w-full py-3 rounded-xl bg-[#ccff80] text-[#213600] font-space text-xs font-bold hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(204,255,128,0.25)]"
          >
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            성장 통계 그래프 확인하기
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#262a35] hover:bg-[#313540] text-xs font-semibold text-[#c2cab0] transition-colors"
          >
            세션 종료하고 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
