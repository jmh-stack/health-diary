/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RoutineTemplate } from '../types/fitness.ts';

interface NewRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRoutine: (routine: RoutineTemplate) => void;
}

export const NewRoutineModal: React.FC<NewRoutineModalProps> = ({
  isOpen,
  onClose,
  onAddRoutine,
}) => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('50');
  const [exerciseText, setExerciseText] = useState('풀업, 딥스, 덤벨 숄더프레스');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const list = exerciseText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const newRoutine: RoutineTemplate = {
      id: `custom-routine-${Date.now()}`,
      title: title.trim(),
      exerciseCount: list.length || 3,
      durationMinutes: Number(duration) || 50,
      lastDoneText: '최근: 신규 생성',
      exercises: list.length ? list : ['운동 1', '운동 2', '운동 3'],
      fullExerciseList: list.map((item) => ({ name: item, sets: '4세트 · 10회' })),
    };

    onAddRoutine(newRoutine);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-[#1c1f2a] border border-[#313540] rounded-2xl shadow-2xl p-5 flex flex-col gap-4 text-[#dfe2f1]">
        <div className="flex items-center justify-between border-b border-[#313540] pb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ccff80] text-[20px]">add_circle</span>
            <h3 className="font-space text-base font-bold">새 루틴 템플릿 생성</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#c2cab0] hover:text-white hover:bg-[#262a35]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#c2cab0]">루틴 명칭</label>
            <input
              type="text"
              required
              placeholder="예: 2분할 상체 파워 루틴"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10 px-3 rounded-xl bg-[#171b26] border border-[#313540] text-xs text-[#dfe2f1] focus:outline-none focus:border-[#ccff80]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#c2cab0]">예상 소요 시간 (분)</label>
            <input
              type="number"
              min="10"
              max="180"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="h-10 px-3 rounded-xl bg-[#171b26] border border-[#313540] text-xs text-[#dfe2f1] focus:outline-none focus:border-[#ccff80]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#c2cab0]">운동 종목 목록 (쉼표 구분)</label>
            <textarea
              rows={3}
              value={exerciseText}
              onChange={(e) => setExerciseText(e.target.value)}
              placeholder="예: 바벨 벤치프레스, 인클라인 덤벨, 딥스"
              className="p-3 rounded-xl bg-[#171b26] border border-[#313540] text-xs text-[#dfe2f1] focus:outline-none focus:border-[#ccff80]"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full py-3 rounded-xl bg-[#ccff80] text-[#213600] font-space text-xs font-bold hover:brightness-105 active:scale-98 transition-all"
          >
            템플릿 저장하기
          </button>
        </form>
      </div>
    </div>
  );
};
