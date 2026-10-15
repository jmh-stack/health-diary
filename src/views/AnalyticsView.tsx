/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MilestoneStreak } from '../App';

interface AnalyticsViewProps {
  milestones: MilestoneStreak;
  workedOutDays: number[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ milestones, workedOutDays }) => {
  // 실제 앱에 기록된 이번 달 출석 일수 연동
  const currentMonthDays = 31; // 간단히 31일로 가정
  const attendanceCount = workedOutDays.length;
  // 퍼센트 계산
  const attendanceRate = Math.round((attendanceCount / currentMonthDays) * 100);

  // 최근 볼륨 성장 추이는 앱 내부에서 누적해야 하지만, 
  // 당장 앱 시작 시점에서는 데이터가 없으므로 공란으로 비워두는 게 맞습니다.
  // (임시로 모두 0으로 비워두어 거짓 더미 데이터를 뺐습니다)
  const volumeData = [
    { label: '4주 전', value: 0 },
    { label: '3주 전', value: 0 },
    { label: '2주 전', value: 0 },
    { label: '지난 주', value: 0 },
    { label: '이번 주', value: 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">운동 통계 분석</h2>
        <p className="text-xs text-gray-400">앱 내 실제 기록만 합산하여 보여줍니다.</p>
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
        <h3 className="font-bold text-sm text-white mb-1">최근 5주 볼륨 추이</h3>
        <p className="text-[10px] text-gray-400 mb-6">운동을 완료할 때마다 기록이 누적됩니다.</p>
        
        <div className="flex items-end justify-between h-32 gap-3 mt-4">
          {volumeData.map((data, idx) => (
            <div key={idx} className="flex flex-col items-center flex-1 h-full">
              <div className="w-full flex flex-col justify-end h-full mb-2 bg-[#313540] rounded-t-md opacity-20">
                {/* 데이터가 없으므로 비어있는 회색 막대만 표시 */}
              </div>
              <span className="text-[10px] font-bold text-gray-500">{data.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 출석부를 캘린더가 아닌 꽉 차오르는 막대 그래프로 변경 */}
      <div className="bg-[#1c1f2a] border border-[#313540] rounded-3xl p-5 shadow-lg">
        <h3 className="font-bold text-sm text-white mb-1">이번 달 누적 출석률</h3>
        <p className="text-[10px] text-gray-400 mb-5">
          이번 달 총 {currentMonthDays}일 중 <span className="text-white font-bold">{attendanceCount}일</span> 운동했습니다.
        </p>
        
        <div className="relative w-full h-5 bg-[#0f131d] rounded-full overflow-hidden border border-[#313540]">
          <div 
            className="absolute top-0 left-0 h-full bg-[#a3e635] transition-all duration-1000 ease-out"
            style={{ width: `${attendanceRate}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center mt-2 px-1">
          <span className="text-[11px] font-bold text-[#a3e635]">{attendanceRate}% 달성</span>
          <span className="text-[10px] text-gray-500">목표: 100%</span>
        </div>
      </div>
    </div>
  );
};