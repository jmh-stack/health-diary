/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TabType } from '../types/fitness';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  // 식단(diet) 제거, 4개 탭으로 심플화
  const navItems = [
    { id: 'home', label: '홈', icon: '🏠' },
    { id: 'workout', label: '운동 기록', icon: '📝' },
    { id: 'analytics', label: '통계', icon: '📊' },
    { id: 'routine', label: '내 루틴', icon: '📋' }
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-lg mx-auto bg-[#1c1f2a] border-t border-[#313540] pb-safe z-40">
      <div className="flex justify-around items-center h-20 px-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id as TabType)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
              activeTab === item.id ? 'text-[#a3e635]' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-xs font-bold mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};