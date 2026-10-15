/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { APP_ASSETS } from '../data/mockData.ts';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const [synced, setSynced] = useState(false);

  if (!isOpen) return null;

  const handleSync = () => {
    setSynced(true);
    setTimeout(() => setSynced(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-[#1c1f2a] border border-[#313540] rounded-2xl shadow-2xl p-5 flex flex-col gap-4 text-[#dfe2f1]">
        <div className="flex items-center justify-between border-b border-[#313540] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ccff80] text-[20px]">account_circle</span>
            <h3 className="font-space text-lg font-bold">내 운동 프로필</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#c2cab0] hover:text-white hover:bg-[#262a35]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#171b26] border border-[#313540]">
          <img
            src={APP_ASSETS.profileAvatar}
            alt="Profile Avatar"
            className="w-14 h-14 rounded-full object-cover ring-2 ring-[#ccff80]"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-space text-base font-bold text-[#dfe2f1]">민우 (Minwoo)</span>
              <span className="px-1.5 py-0.2 rounded bg-[#ccff80]/20 text-[#ccff80] text-[10px] font-bold">PRO</span>
            </div>
            <span className="text-xs text-[#c2cab0]">jm.h@fastfive.co.kr</span>
            <span className="text-[11px] text-[#7bd0ff] mt-0.5">남산 파워리프팅 클럽 · 8주차 진행 중</span>
          </div>
        </div>

        {/* InBody Snapshot */}
        <div className="flex flex-col gap-2 p-3 rounded-xl bg-[#262a35]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-[#ccff80] text-[#213600] font-bold text-[10px]">InBody</span>
              <span className="text-xs font-semibold">최신 생체 측정치</span>
            </div>
            <button
              onClick={handleSync}
              className="text-[11px] text-[#ccff80] hover:underline flex items-center gap-0.5"
            >
              <span className="material-symbols-outlined text-[13px]">{synced ? 'check' : 'sync'}</span>
              <span>{synced ? '동기화됨!' : '즉시 동기화'}</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-1 text-center">
            <div className="p-2 rounded-lg bg-[#1c1f2a]">
              <span className="text-[10px] text-[#c2cab0] block">체중</span>
              <span className="font-space text-sm font-bold text-[#dfe2f1]">74.5 kg</span>
            </div>
            <div className="p-2 rounded-lg bg-[#1c1f2a]">
              <span className="text-[10px] text-[#c2cab0] block">골격근량</span>
              <span className="font-space text-sm font-bold text-[#ccff80]">36.2 kg</span>
            </div>
            <div className="p-2 rounded-lg bg-[#1c1f2a]">
              <span className="text-[10px] text-[#c2cab0] block">체지방률</span>
              <span className="font-space text-sm font-bold text-[#7bd0ff]">14.8 %</span>
            </div>
          </div>
        </div>

        {/* Integration Links */}
        <div className="flex flex-col gap-1.5 text-xs text-[#c2cab0]">
          <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-[#171b26]">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#7bd0ff] text-[16px]">watch</span>
              스마트워치 심박 연동
            </span>
            <span className="text-[#ccff80] text-[11px] font-semibold">연결됨 (Garmin)</span>
          </div>
          <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-[#171b26]">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#ccff80] text-[16px]">fitness_center</span>
              현재 타깃 프로그램
            </span>
            <span className="text-[#dfe2f1] text-[11px] font-semibold">3분할 근비대 + 파워</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#ccff80] text-[#213600] font-space text-xs font-bold hover:brightness-105 active:scale-98 transition-all"
        >
          닫기
        </button>
      </div>
    </div>
  );
};
