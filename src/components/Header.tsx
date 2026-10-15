/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TabType } from '../types/fitness';
import { UserProfile } from '../App';

interface HeaderProps {
  activeTab: TabType;
  userProfile: UserProfile;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, userProfile, onOpenNotifications, onOpenProfile }) => {
  return (
    <header className="fixed top-0 w-full max-w-lg mx-auto h-16 bg-[#0f131d]/90 backdrop-blur-md border-b border-[#313540] z-40 px-4 flex items-center justify-between">
      {/* 로고 */}
      <div className="flex items-center gap-2">
        <span className="text-[#a3e635] font-black text-xl tracking-tighter">IronLog</span>
      </div>
      
      {/* 우측 아이콘 영역 */}
      <div className="flex items-center gap-4">
        {/* 알림 아이콘 */}
        <button onClick={onOpenNotifications} className="text-gray-400 hover:text-white transition-colors">
          <span className="material-symbols-outlined text-[24px]">notifications</span>
        </button>
        
        {/* 프로필 아이콘 (사람 얼굴 제거 -> 👤 실루엣 이모지로 고정) */}
        <button 
          onClick={onOpenProfile} 
          className="w-9 h-9 rounded-full bg-[#1c1f2a] flex items-center justify-center border border-[#313540] hover:border-[#a3e635] transition-colors"
        >
          <span className="text-xl">👤</span>
        </button>
      </div>
    </header>
  );
};