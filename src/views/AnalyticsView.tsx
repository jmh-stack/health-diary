/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MilestoneStreak } from '../App';

interface AnalyticsViewProps {
  milestones: MilestoneStreak;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ milestones }) => {
  // 1. 변화 추이 차트를 위한 데이터 (총 볼륨 추이 예시)
  const volumeData = [
    { label: '1주차', value: 12400 },
    { label: '2주차', value: 14200 },
    { label: '3주차', value: 13800 },
    { label: '4주차', value: 16500 },
    { label: '이번주', value: 18450 },
  ];
  // 그래프 높이 비율 계산용 최대값
  const maxVolume = Math.max(...volumeData.map(d => d.value));

  // 2. 캘린더용 데이터 (이번 달 운동한 날짜들 예시)
  const daysInMonth = 31; 
  const workedOutDays = [2, 3, 5, 8, 9, 10, 12, 15, 16, 18, 22, 23, 24, 25]; // 출석한 날짜
  
  // 달력 레이아웃을 위한 배열 생성 (예: 목요일부터 시작한다고 가정)
  const emptyDays = Array.from({ length: 4 }); 
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* 상단 타이틀 */}
      <div>
        <h2 className="text-xl font-bold text-white">운동 통계 분석</h2>
        <p className="text-xs text-gray-400">데이터로 확인하는 나의 성장 추이입니다.</p>
      </div>

      {/* 심플 요약 카드 (상단에 작게 배치) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#1c1f2a] border border-[#313540] rounded-3xl p-4 flex flex-col items-center justify-center text-center shadow-md">
          <div className="text-[11px] text-gray-400 mb-1 font-medium">연속 운동</div>
          <div className="text-2xl font-black text-white tracking-tight">
            {milestones.currentStreakDays} <span className="text-sm font-normal text-gray-400">일째</span>
          </div>
        </div>
        <div className="bg-[#1c1f2a] border border-[#313540] rounded-3xl p-4 flex flex-col items-center justify-center text-center shadow-md">
          <div className="text-[11px] text-gray-400 mb-1 font-medium">이번 주 달성</div>
          <div className="text-2xl font-black text-[#a3e635] tracking-tight">
            {milestones.weeklyGoalCompleted}
            <span className="text-sm font-normal text-gray-500"> / {milestones.weeklyGoalTarget}</span>
          </div>
        </div>
      </div>

      {/* 1. 변화 추이 (볼륨 막대 그래프) */}
      <div className="bg-[#1c1f2a] border border-[#313540] rounded-3xl p-5 shadow-lg">
        <h3 className="font-bold text-sm text-white mb-1">최근 5주 볼륨 성장 추이</h3>
        <p className="text-[10px] text-gray-400 mb-6">매주 들어올린 총 무게(kg)</p>
        
        {/* CSS Flexbox를 활용한 순수 바 차트 */}
        <div className="flex items-end justify-between h-32 gap-3 mt-4">
          {volumeData.map((data, idx) => (
            <div key={idx} className="flex flex-col items-center flex-1 h-full">
              <div className="w-full flex flex-col justify-end h-full mb-2 group relative">
                {/* 툴팁 (막대에 마우스/터치 시 상세 수치 표시) */}
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[10px] py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                  {data.value.toLocaleString()} kg
                </div>
                {/* 실제 막대 */}
                <div 
                  className={`w-full rounded-t-md transition-all duration-700 ease-out ${
                    idx === volumeData.length - 1 ? 'bg-[#a3e635] shadow-[0_0_12px_rgba(163,230,53,0.3)]' : 'bg-[#313540] group-hover:bg-[#404552]'
                  }`}
                  style={{ height: `${(data.value / maxVolume) * 100}%` }}
                ></div>
              </div>
              <span className={`text-[10px] font-bold ${idx === volumeData.length - 1 ? 'text-[#a3e635]' : 'text-gray-400'}`}>
                {data.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 월간 달성 캘린더 (잔디 심기) */}
      <div className="bg-[#1c1f2a] border border-[#313540] rounded-3xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-sm text-white">이번 달 운동 출석부</h3>
            <p className="text-[11px] font-bold text-[#a3e635] mt-1">{workedOutDays.length}일 출석 완료!</p>
          </div>
          <span className="text-xs font-bold text-white bg-[#0f131d] px-3 py-1.5 rounded-full border border-[#313540]">
            10월
          </span>
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
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {/* 시작 요일을 맞추기 위한 빈 칸 */}
          {emptyDays.map((_, idx) => (
            <div key={`empty-${idx}`} className="h-8"></div>
          ))}
          {/* 실제 날짜 칸 */}
          {days.map(day => {
            const isWorkedOut = workedOutDays.includes(day);
            return (
              <div 
                key={day} 
                className={`h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all duration-300 ${
                  isWorkedOut 
                    ? 'bg-[#a3e635] text-[#0f131d] shadow-[0_0_8px_rgba(163,230,53,0.4)] scale-105' 
                    : 'bg-[#0f131d] text-gray-500 border border-[#2d313e]'
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};