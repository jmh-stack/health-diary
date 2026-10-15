/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

export interface WorkoutItem {
  id: string;
  name: string;
  weight: number | '';
  reps: number | '';
  completed: boolean;
}

interface WorkoutViewProps {
  onCompleteWorkout: () => void;
}

export const WorkoutView: React.FC<WorkoutViewProps> = ({ onCompleteWorkout }) => {
  const [exercises, setExercises] = useState<WorkoutItem[]>([
    { id: '1', name: '벤치프레스', weight: 80, reps: 10, completed: false },
    { id: '2', name: '인클라인 덤벨 프레스', weight: 24, reps: 12, completed: false },
    { id: '3', name: '딥스', weight: 0, reps: 15, completed: false }
  ]);
  const [newExerciseName, setNewExerciseName] = useState('');

  // 종목 추가
  const handleAddExercise = () => {
    if (!newExerciseName.trim()) return;
    const newItem: WorkoutItem = {
      id: Date.now().toString(),
      name: newExerciseName.trim(),
      weight: '',
      reps: '',
      completed: false
    };
    setExercises(prev => [...prev, newItem]);
    setNewExerciseName('');
  };

  // 종목 삭제
  const handleDeleteExercise = (id: string) => {
    setExercises(prev => prev.filter(item => item.id !== id));
  };

  // 종목 수치 변경
  const handleUpdate = (id: string, field: 'weight' | 'reps', value: string) => {
    const num = value === '' ? '' : Number(value);
    setExercises(prev =>
      prev.map(item => (item.id === id ? { ...item, [field]: num } : item))
    );
  };

  // 완료 토글
  const handleToggle = (id: string) => {
    setExercises(prev =>
      prev.map(item => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">오늘의 운동 기록</h2>
          <p className="text-xs text-gray-400">자유롭게 종목을 구성하고 수행한 횟수를 입력하세요.</p>
        </div>
      </div>

      {/* 새 종목 자유 추가 */}
      <div className="flex gap-2 bg-[#1c1f2a] p-2 rounded-xl border border-[#313540]">
        <input
          type="text"
          value={newExerciseName}
          onChange={e => setNewExerciseName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAddExercise()}
          placeholder="추가할 운동 종목명 입력"
          className="flex-1 bg-transparent px-3 py-2 text-sm text-white focus:outline-none placeholder-gray-500"
        />
        <button
          onClick={handleAddExercise}
          className="px-4 py-2 bg-[#a3e635] text-[#0f131d] font-bold text-xs rounded-lg hover:bg-[#86efac]"
        >
          + 종목 추가
        </button>
      </div>

      {/* 종목 리스트 */}
      <div className="space-y-3">
        {exercises.map((item, index) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border transition-all ${
              item.completed
                ? 'bg-[#151822] border-[#22c55e]/30'
                : 'bg-[#1c1f2a] border-[#313540]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#a3e635] bg-[#a3e635]/10 px-2 py-0.5 rounded">
                  #{index + 1}
                </span>
                <span className={`font-bold text-sm ${item.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                  {item.name}
                </span>
              </div>
              <button
                onClick={() => handleDeleteExercise(item.id)}
                className="text-xs text-red-400 hover:text-red-300"
              >
                삭제
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <div>
                <label className="block text-[10px] text-gray-400 mb-1">중량 (kg)</label>
                <input
                  type="number"
                  value={item.weight}
                  onChange={e => handleUpdate(item.id, 'weight', e.target.value)}
                  placeholder="0"
                  className="w-full bg-[#0f131d] border border-[#313540] rounded-lg px-2 py-1.5 text-xs text-white text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 mb-1">총 횟수 (회)</label>
                <input
                  type="number"
                  value={item.reps}
                  onChange={e => handleUpdate(item.id, 'reps', e.target.value)}
                  placeholder="0"
                  className="w-full bg-[#0f131d] border border-[#313540] rounded-lg px-2 py-1.5 text-xs text-white text-center"
                />
              </div>
              <div className="flex items-end h-full pt-4">
                <button
                  onClick={() => handleToggle(item.id)}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    item.completed
                      ? 'bg-[#22c55e] text-white border-[#22c55e]'
                      : 'bg-transparent text-gray-400 border-[#313540] hover:border-[#a3e635] hover:text-white'
                  }`}
                >
                  {item.completed ? '완료됨 ✓' : '완료 체크'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 전체 운동 완료 CTA */}
      <button
        onClick={onCompleteWorkout}
        className="w-full py-4 bg-[#a3e635] text-[#0f131d] font-bold rounded-2xl text-base shadow-lg hover:bg-[#86efac] transition-colors"
      >
        오늘 운동 완수 및 기록 저장
      </button>
    </div>
  );
};