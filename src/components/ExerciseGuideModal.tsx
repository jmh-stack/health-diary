/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Exercise } from '../types/fitness.ts';

interface ExerciseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: Exercise;
}

export const ExerciseGuideModal: React.FC<ExerciseGuideModalProps> = ({
  isOpen,
  onClose,
  exercise,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-[#1c1f2a] border border-[#313540] rounded-2xl shadow-2xl p-5 flex flex-col gap-4 text-[#dfe2f1]">
        <div className="flex items-center justify-between border-b border-[#313540] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#7bd0ff] text-[20px]">fitness_center</span>
            <div>
              <h3 className="font-space text-base font-bold">{exercise.name}</h3>
              <span className="text-[10px] text-[#ccff80]">{exercise.guide.category}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#c2cab0] hover:text-white hover:bg-[#262a35]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Target Muscles */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold text-[#c2cab0] uppercase tracking-wider">주동근 및 보조근</span>
          <div className="flex flex-wrap gap-1.5">
            {exercise.muscleTags.map((muscle) => (
              <span
                key={muscle}
                className="px-2.5 py-1 rounded-md bg-[#262a35] text-xs text-[#ccff80] font-medium border border-[#313540]"
              >
                {muscle}
              </span>
            ))}
          </div>
        </div>

        {/* Key Form Cues */}
        <div className="flex flex-col gap-2 p-3 rounded-xl bg-[#171b26] border border-[#313540]">
          <span className="text-[11px] font-bold text-[#7bd0ff] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">checklist</span>
            트레이너 핵심 큐 포인트
          </span>
          <ul className="flex flex-col gap-2">
            {exercise.guide.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-[#dfe2f1] leading-relaxed">
                <span className="w-4 h-4 rounded-full bg-[#ccff80]/20 text-[#ccff80] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Tempo */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#262a35]">
          <span className="text-xs text-[#c2cab0]">권장 템포</span>
          <span className="font-space text-xs font-bold text-[#ccff80]">{exercise.guide.tempo}</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#ccff80] text-[#213600] font-space text-xs font-bold hover:brightness-105 active:scale-98 transition-all"
        >
          확인하고 운동 계속하기
        </button>
      </div>
    </div>
  );
};
