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
  const volumeData = [
    { label: '1주차', value: 12400 },
    { label: '2주차', value: 14200 },
    { label: '3주차', value: 13800 },
    { label: '4주차', value: 16500 },
    { label: '이번주', value: 18450 },
  ];
  const maxVolume = Math.max(...volumeData.map(d => d.value));

  // 이번 달 출석률 계산 (예시: 한 달을 30일로 가정)
  const currentMonthDays = 30;
  // 임시로 연속 운동 일수를 출석 일수로 사용 (App.tsx 연동 로직에 따라 달라질 수 있음)
  const attendanceCount = Math.max(milestones.currentStreakDays, 12); 
  const attendanceRate = Math.round((attendanceCount / currentMonthDays) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">운동 통계 분석</h2>
        <p className="text-xs text-gray-400">데이터로 확인하는 나의 성장 추이입니다.</p>
      </div>

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

      <div className="bg-[#1c1f2a] border border-[#313540] rounded-3xl p-5 shadow-lg">
        <h3 className="font-bold text-sm text-white mb-1">최근 5주 볼륨 성장 추이</h3>
        <p className="text-[10px] text-gray-400 mb-6">매주 들어올린 총 무게(kg)</p>
        
        <div className="flex items-end justify-between h-32 gap-3 mt-4">
          {volumeData.map((data, idx) => (
            <div key={idx} className="flex flex-col items-center flex-1 h-full">
              <div className="w-full flex flex-col justify-end h-full mb-2 group relative">
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[10px] py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                  {data.value.toLocaleString()} kg
                </div>
                <div 
                  className={`w-full rounded-t-md transition-all duration-700 ease-out ${
                    idx === volumeData.length - 1 ? 'bg-[#a3e635] shadow-[0_0_12px_rgba(163,230,53,0.3)]' : 'bg-[#313540]'
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

      {/* 캘린더 대신 가로 막대 그래프로 표현된 운동 달성도 */}
      <div className="bg-[#1c1f2a] border border-[#313540] rounded-3xl p-5 shadow-lg">
        <h3 className="font-bold text-sm text-white mb-1">이번 달 누적 출석률</h3>
        <p className="text-[10px] text-gray-400 mb-5">이번 달 총 {currentMonthDays}일 중 {attendanceCount}일 운동했습니다.</p>
        
        <div className="relative w-full h-4 bg-[#0f131d] rounded-full overflow-hidden border border-[#313540]">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#86efac] to-[#a3e635] transition-all duration-1000 ease-out"
            style={{ width: `${attendanceRate}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs font-bold text-[#a3e635]">{attendanceRate}% 달성</span>
          <span className="text-[10px] text-gray-500">목표: 100%</span>
        </div>
      </div>
    </div>
  );
};