/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile } from '../App';

interface ProfileModalProps {
  isOpen: boolean;
  userProfile: UserProfile;
  onSave: (updated: Partial<UserProfile>) => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen, userProfile, onSave, onClose
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<UserProfile>(userProfile);

  useEffect(() => {
    setForm(userProfile);
    setIsEditing(false);
  }, [userProfile, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(form);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-sm bg-[#1c1f2a] border border-[#313540] rounded-3xl overflow-hidden p-6 text-white shadow-2xl">
        
        <div className="flex items-center justify-between border-b border-[#313540] pb-4 mb-4">
          <h3 className="font-bold text-xl text-[#a3e635]">내 프로필</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        {!isEditing ? (
          // --- 보기 모드 (심플 픽토그램) ---
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-[#0f131d] p-4 rounded-2xl border border-[#313540]">
              <div className="text-4xl">{form.gender === 'female' ? '👩' : '👨'}</div>
              <div>
                <h4 className="font-bold text-lg">{form.name || '이름 없음'}</h4>
                <p className="text-xs text-[#a3e635]">{form.gender === 'female' ? '여성' : '남성'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0f131d] p-4 rounded-2xl border border-[#313540] text-center">
                <div className="text-2xl mb-1">📏</div>
                <div className="text-[10px] text-gray-400">키 (cm)</div>
                <div className="font-bold text-lg">{form.height || '-'}</div>
              </div>
              <div className="bg-[#0f131d] p-4 rounded-2xl border border-[#313540] text-center">
                <div className="text-2xl mb-1">⚖️</div>
                <div className="text-[10px] text-gray-400">몸무게 (kg)</div>
                <div className="font-bold text-lg">{form.weight || '-'}</div>
              </div>
            </div>

            <button onClick={() => setIsEditing(true)} className="w-full py-3 bg-[#313540] hover:bg-[#404552] rounded-xl text-sm font-bold mt-2">
              정보 수정하기
            </button>
          </div>
        ) : (
          // --- 수정 모드 (직접 입력창) ---
          <div className="space-y-4">
            <input
              type="text"
              value={form.name || ''}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="이름"
              className="w-full bg-[#0f131d] border border-[#313540] rounded-xl px-4 py-3 text-sm focus:border-[#a3e635] outline-none"
            />
            <select
              value={form.gender || 'male'}
              onChange={e => setForm({ ...form, gender: e.target.value as any })}
              className="w-full bg-[#0f131d] border border-[#313540] rounded-xl px-4 py-3 text-sm focus:border-[#a3e635] outline-none"
            >
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={form.height || ''}
                onChange={e => setForm({ ...form, height: e.target.value ? Number(e.target.value) : '' })}
                placeholder="키(cm)"
                className="w-full bg-[#0f131d] border border-[#313540] rounded-xl px-4 py-3 text-sm focus:border-[#a3e635] outline-none"
              />
              <input
                type="number"
                value={form.weight || ''}
                onChange={e => setForm({ ...form, weight: e.target.value ? Number(e.target.value) : '' })}
                placeholder="몸무게(kg)"
                className="w-full bg-[#0f131d] border border-[#313540] rounded-xl px-4 py-3 text-sm focus:border-[#a3e635] outline-none"
              />
            </div>
            
            <button onClick={handleSave} className="w-full py-3 bg-[#a3e635] text-[#0f131d] rounded-xl text-sm font-bold mt-2 hover:bg-[#86efac]">
              저장 완료
            </button>
          </div>
        )}
      </div>
    </div>
  );
};