/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile, DailyRecord } from '../App';

interface HomeViewProps {
  userProfile: UserProfile;
  dailyRecords: DailyRecord[]; // 💡 상세 기록 데이터 수신
  mainRoutineTitle?: string;
  onStartRoutine: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ 
  userProfile, 
  dailyRecords,
  mainRoutineTitle = '설정된 메인 루틴이 없습니다', 
  onStartRoutine 
}) => {
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedRecord, setSelectedRecord] = useState<DailyRecord | null>(null);

  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + monthOffset);
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay();

  const emptyDays = Array.from({ length: firstDayOfWeek });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // 현재 월의 운동한 날짜 목록 (숫자만)
  const workedOutDays = monthOffset === 0 ? dailyRecords.map(r => r.date) : [];

  const handleDayClick = (day: number) => {
    if (monthOffset === 0 && workedOutDays.includes(day)) {
      const record = dailyRecords.find(r => r.date === day);
      if (record) setSelectedRecord(record);
    } else {
      setSelectedRecord(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          안녕하세요, {userProfile.name || '사용자'}님! <span className="text-2xl">🔥</span>
        </h1>
        <p className="text-sm text-gray-400 mt-1">오늘도 어제보다 강해질 시간입니다.</p>
      </div>

      <div className="bg-[#1c1f2a] border border-[#313540] rounded-3xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-white">오늘의 운동</h3>
          <span className="text-[10px] text-[#a3e635] bg-[#a3e635]/10 px-2 py-1 rounded-md font-bold">내 메인 루틴</span>
        </div>
        
        <div className="bg-[#0f131d] border border-[#313540] rounded-2xl p-4 mb-4 text-center">
          <p className="font-bold text-white text-lg">{mainRoutineTitle}</p>
          <p className="text-[11px] text-gray-500 mt-1">루틴 탭에서 메인 루틴을 변경할 수 있습니다.</p>
        </div>

        <button
          onClick={onStartRoutine}
          className="w-full py-4 bg-[#a3e635] text-[#0f131d] font-bold rounded-2xl text-base shadow-lg hover:bg-[#86efac] transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">play_arrow</span>
          바로 시작하기
        </button>
      </div>

      <div className="bg-[#1c1f2a] border border-[#313540] rounded-3xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-sm text-white">운동 출석부</h3>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { setMonthOffset(prev => prev - 1); setSelectedRecord(null); }}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-[#0f131d] border border-[#313540] text-gray-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <span className="text-xs font-bold text-white min-w-[50px] text-center">
              {currentYear}.{currentMonth}
            </span>
            <button 
              onClick={() => { setMonthOffset(prev => prev + 1); setSelectedRecord(null); }}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-[#0f131d] border border-[#313540] text-gray-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5 mb-2 text-center">
          {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
            <span key={idx} className={`text-[10px] font-bold ${idx === 0 ? 'text-red-400' : idx === 6 ? 'text-blue-400' : 'text-gray-500'}`}>
              {day}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-center relative">
          {emptyDays.map((_, idx) => (
            <div key={`empty-${idx}`} className="h-9"></div>
          ))}
          {days.map(day => {
            const isWorkedOut = monthOffset === 0 && workedOutDays.includes(day);
            return (
              <button 
                key={day}
                onClick={() => handleDayClick(day)}
                className={`h-9 flex items-center justify-center rounded-lg text-xs font-bold transition-all duration-200 ${
                  isWorkedOut 
                    ? 'bg-[#a3e635] text-[#0f131d] shadow-[0_0_8px_rgba(163,230,53,0.3)] hover:scale-110 cursor-pointer active:scale-95' 
                    : 'bg-[#0f131d] text-gray-600 border border-[#2d313e] cursor-default'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* 💡 날짜 탭 시 렌더링되는 상세 기록 리스트 영역 */}
        {selectedRecord && (
          <div className="mt-5 p-4 bg-[#0f131d] rounded-2xl border border-[#313540] animate-fade-in space-y-3">
            <h4 className="text-sm font-bold text-[#a3e635] border-b border-[#313540] pb-2">
              {currentMonth}월 {selectedRecord.date}일 운동 기록
            </h4>
            
            <div className="space-y-2">
              {selectedRecord.exercises.length > 0 ? (
                selectedRecord.exercises.map((ex, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-white font-medium">{ex.name}</span>
                    <span className="text-gray-400">
                      {ex.weight ? `${ex.weight}kg · ` : '맨몸 · '} 
                      {ex.reps ? `${ex.reps}회` : '-'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-500 text-center py-2">저장된 종목 내역이 없습니다.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};