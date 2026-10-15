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
  const navItems = [
    { id: 'home', label: '홈', icon: 'home' },
    { id: 'workout', label: '운동 기록', icon: 'edit_document' },
    { id: 'analytics', label: '통계', icon: 'bar_chart' },
    { id: 'routine', label: '내 루틴', icon: 'list_alt' }
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
            <span className="material-symbols-outlined text-[26px] mb-0.5">{item.icon}</span>
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};