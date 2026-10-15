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
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userProfile, onOpenProfile }) => {
  return (
    <header className="fixed top-0 w-full max-w-lg mx-auto h-16 bg-[#0f131d]/90 backdrop-blur-md border-b border-[#313540] z-40 px-4 flex items-center justify-between">
      {/* 로고를 HOME-ㅌ 로 변경 */}
      <div className="flex items-center gap-2">
        <span className="text-[#a3e635] font-black text-xl tracking-tighter">HOME-ㅌ</span>
      </div>
      
      {/* 우측 알림 아이콘 삭제, 프로필만 남김 */}
      <div className="flex items-center">
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