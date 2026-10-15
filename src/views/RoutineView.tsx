/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';

export interface RoutineGroup {
  id: string;
  title: string;
  exercises: string[];
}

interface RoutineViewProps {
  onStartRoutine: () => void;
}

export const RoutineView: React.FC<RoutineViewProps> = ({ onStartRoutine }) => {
  // 루틴 브라우저 자동 저장 (localStorage)
  const [routines, setRoutines] = useState<RoutineGroup[]>(() => {
    const saved = localStorage.getItem('ironlog_routines');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', title: '상체 메인 루틴', exercises: ['벤치프레스', '인클라인 덤벨 프레스', '케이블 트라이셉스 푸시다운'] },
      { id: '2', title: '하체 & 어깨 루틴', exercises: ['스쿼트', '레그 프레스', '사이드 레터럴 레이즈'] }
    ];
  });

  // 상태가 바뀔 때마다 브라우저에 즉시 저장
  useEffect(() => {
    localStorage.setItem('ironlog_routines', JSON.stringify(routines));
  }, [routines]);

  const [newRoutineTitle, setNewRoutineTitle] = useState('');
  const [addingExerciseToId, setAddingExerciseToId] = useState<string | null>(null);
  const [newExName, setNewExName] = useState('');

  const handleCreateRoutine = () => {
    if (!newRoutineTitle.trim()) return;
    setRoutines(prev => [...prev, { id: Date.now().toString(), title: newRoutineTitle.trim(), exercises: [] }]);
    setNewRoutineTitle('');
  };

  const handleDeleteRoutine = (id: string) => {
    setRoutines(prev => prev.filter(r => r.id !== id));
  };

  const handleAddExerciseToRoutine = (routineId: string) => {
    if (!newExName.trim()) return;
    setRoutines(prev =>
      prev.map(r => r.id === routineId ? { ...r, exercises: [...r.exercises, newExName.trim()] } : r)
    );
    setNewExName('');
    setAddingExerciseToId(null);
  };

  const handleRemoveExercise = (routineId: string, index: number) => {
    setRoutines(prev =>
      prev.map(r => r.id === routineId ? { ...r, exercises: r.exercises.filter((_, i) => i !== index) } : r)
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">나만의 커스텀 루틴</h2>
        <p className="text-xs text-gray-400">자주 수행하는 루틴을 자유롭게 만들고 관리하세요.</p>
      </div>

      <div className="flex gap-2 bg-[#1c1f2a] p-2 rounded-xl border border-[#313540]">
        <input
          type="text"
          value={newRoutineTitle}
          onChange={e => setNewRoutineTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreateRoutine()}
          placeholder="새 루틴 이름 (예: 등 & 이두)"
          className="flex-1 bg-transparent px-3 py-2 text-sm text-white focus:outline-none placeholder-gray-500"
        />
        <button
          onClick={handleCreateRoutine}
          className="px-4 py-2 bg-[#a3e635] text-[#0f131d] font-bold text-xs rounded-lg hover:bg-[#86efac]"
        >
          + 루틴 생성
        </button>
      </div>

      <div className="space-y-4">
        {routines.map(routine => (
          <div key={routine.id} className="bg-[#1c1f2a] border border-[#313540] rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#313540] pb-2">
              <h3 className="font-bold text-sm text-white">{routine.title}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onStartRoutine()}
                  className="px-3 py-1 bg-[#a3e635]/20 text-[#a3e635] hover:bg-[#a3e635] hover:text-[#0f131d] rounded-lg text-xs font-bold transition-colors"
                >
                  이 루틴으로 시작
                </button>
                <button
                  onClick={() => handleDeleteRoutine(routine.id)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  삭제
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {routine.exercises.map((ex, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 bg-[#0f131d] text-gray-300 border border-[#313540] text-xs px-2.5 py-1 rounded-lg"
                >
                  {ex}
                  <button onClick={() => handleRemoveExercise(routine.id, idx)} className="text-gray-500 hover:text-red-400 text-xs ml-1">✕</button>
                </span>
              ))}
              {routine.exercises.length === 0 && <p className="text-xs text-gray-500 py-1">등록된 종목이 없습니다.</p>}
            </div>

            {addingExerciseToId === routine.id ? (
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newExName}
                  onChange={e => setNewExName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddExerciseToRoutine(routine.id)}
                  placeholder="종목 이름"
                  className="flex-1 bg-[#0f131d] border border-[#313540] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                />
                <button onClick={() => handleAddExerciseToRoutine(routine.id)} className="px-3 py-1 bg-[#a3e635] text-[#0f131d] font-bold text-xs rounded-lg">
                  추가
                </button>
                <button onClick={() => setAddingExerciseToId(null)} className="px-2 py-1 text-xs text-gray-400 hover:text-white">
                  취소
                </button>
              </div>
            ) : (
              <button onClick={() => setAddingExerciseToId(routine.id)} className="text-xs text-gray-400 hover:text-[#a3e635] pt-1 block">
                + 종목 추가하기
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};