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
  return (
    <div className="space-y-6">
      {/* 타이틀 */}
      <div>
        <h2 className="text-xl font-bold text-white">운동 통계 요약</h2>
        <p className="text-xs text-gray-400">현재까지 쌓아온 나의 운동 성과입니다.</p>
      </div>

      {/* 심플 통계 카드 2종 */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* 연속 운동 달성 */}
        <div className="bg-[#1c1f2a] border border-[#313540] rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-lg">
          <span className="material-symbols-outlined text-[40px] text-[#a3e635] mb-3">
            local_fire_department
          </span>
          <div className="text-[11px] text-gray-400 mb-1 font-medium">연속 운동 달성</div>
          <div className="text-3xl font-black text-white tracking-tight">
            {milestones.currentStreakDays} <span className="text-base font-normal text-gray-300">일째</span>
          </div>
        </div>

        {/* 주간 목표 달성 */}
        <div className="bg-[#1c1f2a] border border-[#313540] rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-lg">
          <span className="material-symbols-outlined text-[40px] text-[#a3e635] mb-3">
            task_alt
          </span>
          <div className="text-[11px] text-gray-400 mb-1 font-medium">이번 주 목표</div>
          <div className="text-3xl font-black text-white tracking-tight">
            {milestones.weeklyGoalCompleted}
            <span className="text-sm font-normal text-gray-500"> / {milestones.weeklyGoalTarget}회</span>
          </div>
        </div>

      </div>
    </div>
  );
};