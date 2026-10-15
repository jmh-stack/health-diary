/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MilestoneStreak, UserProfile } from '../App';

interface HomeViewProps {
  milestones: MilestoneStreak;
  userProfile: UserProfile;
  // 루틴 탭에서 메인으로 설정한 루틴의 이름 (없으면 '선택된 메인 루틴 없음')
  mainRoutineTitle?: string;
  onStartRoutine: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ 
  milestones, 
  userProfile, 
  mainRoutineTitle = '설정된 메인 루틴이 없습니다', 
  onStartRoutine 
}) => {
  // 캘린더 월(Month) 스크롤 관리를 위한 상태 (0은 이번 달, -1은 저번 달 등)
  const [monthOffset, setMonthOffset] = useState(0);
  
  // 날짜 클릭 시 운동량 조회를 위한 상태
  const [selectedDayInfo, setSelectedDayInfo] = useState<string | null>(null);

  // 현재 날짜 기준 달력 계산
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + monthOffset);
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // 해당 월의 총 일수
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  // 해당 월 1일의 요일 (0: 일요일, 1: 월요일...)
  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay();

  // 캘린더 배열 구성
  const emptyDays = Array.from({ length: firstDayOfWeek });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // 더미 운동 데이터 (월 이동 시 초기화되도록 세팅)
  // 실제 구현에서는 localStorage의 완료된 운동 기록 날짜를 가져와 매칭합니다.
  const workedOutDays = monthOffset === 0 ? [2, 5, 8, 12, 15, 20, 22] : [];

  const handleDayClick = (day: number) => {
    if (workedOutDays.includes(day)) {
      // 운동을 한 날짜라면 더미 운동량 표시
      setSelectedDayInfo(`${currentMonth}월 ${day}일: 총 볼륨 14,200kg (48세트 완료)`);
    } else {
      setSelectedDayInfo(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. 환영 인사 */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          안녕하세요, {userProfile.name || '사용자'}님! <span className="text-2xl">🔥</span>
        </h1>
        <p className="text-sm text-gray-400 mt-1">오늘도 어제보다 강해질 시간입니다.</p>
      </div>

      {/* 2. 메인 루틴 시작 버튼 */}
      <div className="bg-[#1c1f2a] border border-[#313540] rounded-3xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-white">오늘의 운동</h3>
          <span className="text-[10px] text-[#a3e635] bg-[#a3e635]/10 px-2 py-1 rounded-md font-bold">
            내 메인 루틴
          </span>
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

      {/* 3. 월간 운동 출석부 캘린더 */}
      <div className="bg-[#1c1f2a] border border-[#313540] rounded-3xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-sm text-white">운동 출석부</h3>
          
          {/* 월 이동 컨트롤 */}
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

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-1.5 mb-2 text-center">
          {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
            <span key={idx} className={`text-[10px] font-bold ${idx === 0 ? 'text-red-400' : idx === 6 ? 'text-blue-400' : 'text-gray-500'}`}>
              {day}
            </span>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-1.5 text-center relative">
          {emptyDays.map((_, idx) => (
            <div key={`empty-${idx}`} className="h-9"></div>
          ))}
          {days.map(day => {
            const isWorkedOut = workedOutDays.includes(day);
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

        {/* 날짜 탭 시 상세 정보 표시 영역 */}
        {selectedDayInfo && (
          <div className="mt-4 p-3 bg-[#0f131d] rounded-xl border border-[#313540] text-center animate-fade-in">
            <span className="text-[#a3e635] text-[11px] font-bold block mb-1">운동 상세 기록</span>
            <span className="text-white text-xs font-medium">{selectedDayInfo}</span>
          </div>
        )}
      </div>
    </div>
  );
};