/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TabType } from '../types/fitness.ts';
import { APP_ASSETS } from '../data/mockData.ts';

interface HeaderProps {
  activeTab: TabType;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
}

const TAB_SUBTITLES: Record<TabType, string> = {
  home: 'Today Workout Dashboard',
  workout: 'Workout Logger',
  analytics: 'Analytics',
  diet: 'Diet Nutrition Tracker',
  routine: 'Routine Manager',
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenNotifications,
  onOpenProfile,
}) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#0f131d]/85 backdrop-blur-xl border-b border-[#313540]/50 pt-safe">
      <div className="h-16 px-4 flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          {/* IronLog Dumbbell Logo */}
          <div className="w-8 h-8 rounded-lg bg-[#1c1f2a] border border-[#ccff80]/40 flex items-center justify-center shadow-[0_0_12px_rgba(204,255,128,0.25)]">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#ccff80]" fill="currentColor">
              <rect x="4" y="5" width="3" height="14" rx="1.5" />
              <rect x="7" y="7" width="2" height="10" rx="0.8" />
              <rect x="9" y="11" width="6" height="2" />
              <rect x="15" y="7" width="2" height="10" rx="0.8" />
              <rect x="17" y="5" width="3" height="14" rx="1.5" />
            </svg>
          </div>
          <span className="font-space text-lg font-bold tracking-tight text-[#dfe2f1]">
            IronLog
          </span>
          <span className="font-space text-xs text-[#c2cab0] font-medium hidden sm:inline-block ml-1">
            {TAB_SUBTITLES[activeTab]}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            aria-label="알림 열기"
            onClick={onOpenNotifications}
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-[#c2cab0] hover:text-[#ccff80] hover:bg-[#1c1f2a] transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#ccff80] rounded-full ring-2 ring-[#0f131d] animate-pulse" />
          </button>

          <button
            aria-label="내 프로필"
            onClick={onOpenProfile}
            className="w-10 h-10 rounded-full flex items-center justify-center p-0.5 hover:ring-2 hover:ring-[#ccff80] transition-all"
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-[#313540]"
              src={APP_ASSETS.profileAvatar}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
