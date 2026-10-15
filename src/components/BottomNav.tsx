/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TabType } from '../types/fitness.ts';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const navItems: { id: TabType; label: string; icon: string }[] = [
    { id: 'home', label: '홈', icon: 'today' },
    { id: 'workout', label: '운동 기록', icon: 'fitness_center' },
    { id: 'analytics', label: '분석·통계', icon: 'trending_up' },
    { id: 'diet', label: '식단 관리', icon: 'restaurant' },
    { id: 'routine', label: '루틴 관리', icon: 'event_note' },
  ];

  return (
    <nav
      className="fixed bottom-0 w-full z-50 pb-safe bg-[#0f131d]/90 backdrop-blur-xl border-t border-[#313540]/60 shadow-[0_-4px_24px_rgba(0,0,0,0.5)]"
      role="navigation"
      aria-label="하단 메인 메뉴"
    >
      <div className="grid grid-cols-5 h-16 px-1 items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 transition-all ${
                isActive
                  ? 'text-[#ccff80] font-semibold scale-105'
                  : 'text-[#c2cab0] hover:text-[#dfe2f1]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={{
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {item.icon}
              </span>
              <span className="font-space text-[10px] tracking-tight leading-tight text-center truncate w-full">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
