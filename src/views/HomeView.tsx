/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MilestoneStreak, UserProfile } from '../App';

interface HomeViewProps {
  milestones: MilestoneStreak;
  userProfile: UserProfile;
  mainRoutineTitle?: string;
  onStartRoutine: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ 
  userProfile, 
  mainRoutineTitle = '설정된 메인 루틴이 없습니다', 
  onStartRoutine 
}) => {
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDayInfo, setSelectedDayInfo] = useState<string | null>(null);
  const [workedOutDays, setWorkedOutDays] = useState<number[]>([]);

  useEffect(() => {
    const savedDates = localStorage.getItem('ironlog_workout_dates');
    if (savedDates) {
      setWorkedOutDays(JSON.parse(savedDates));
    }
  }, []);

  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + monthOffset);
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay();

  const emptyDays = Array.from({ length: firstDayOfWeek });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleDayClick = (day: number) => {
    if (monthOffset === 0 && workedOutDays.includes(day)) {
      setSelectedDayInfo(`${currentMonth}월 ${day}일: 운동을 완료한 날입니다!`);
    } else {
      setSelectedDayInfo(null);
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
              onClick={() => { setMonthOffset(prev => prev - 1); setSelectedDayInfo(null); }}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-[#0f131d] border border-[#313540] text-gray-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <span className="text-xs font-bold text-white min-w-[50px] text-center">
              {currentYear}.{currentMonth}
            </span>
            <button 
              onClick={() => { setMonthOffset(prev => prev + 1); setSelectedDayInfo(null); }}
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

        {selectedDayInfo && (
          <div className="mt-4 p-3 bg-[#0f131d] rounded-xl border border-[#313540] text-center animate-fade-in">
            <span className="text-[#a3e635] text-[11px] font-bold block mb-1">상세 기록</span>
            <span className="text-white text-xs font-medium">{selectedDayInfo}</span>
          </div>
        )}
      </div>
    </div>
  );
};