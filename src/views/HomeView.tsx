/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MilestoneStreak, UserProfile } from '../App';

interface HomeViewProps {
  milestones: MilestoneStreak;
  userProfile: UserProfile; // 추가됨
  onStartRoutine: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ milestones, userProfile, onStartRoutine }) => {
  return (
    <div className="space-y-6">
      {/* 1. 환영 인사 (이름 연동) */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          안녕하세요, {userProfile.name || '사용자'}님! <span className="text-2xl">🔥</span>
        </h1>
        <p className="text-sm text-gray-400 mt-1">오늘도 어제보다 강해질 시간입니다.</p>
      </div>

      {/* 2. 기상 정보 */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1c1f2a] border border-[#313540] text-[11px] text-gray-300">
        <span className="material-symbols-outlined text-[14px] text-[#a3e635]">location_on</span>
        야외 체육장
        <span className="mx-1 text-gray-600">|</span>
        ☀️ 맑음 18°C
      </div>

      {/* 3. 메인 시작 버튼 */}
      <div className="bg-[#1c1f2a] border border-[#313540] rounded-3xl p-5 shadow-lg">
        <h3 className="font-bold text-lg text-white mb-2">오늘의 운동</h3>
        <p className="text-xs text-gray-400 mb-5">나만의 커스텀 루틴으로 바로 시작하세요.</p>
        <button
          onClick={onStartRoutine}
          className="w-full py-4 bg-[#a3e635] text-[#0f131d] font-bold rounded-2xl text-base shadow-lg hover:bg-[#86efac] transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">play_arrow</span>
          내 루틴 시작하기
        </button>
      </div>
    </div>
  );
};