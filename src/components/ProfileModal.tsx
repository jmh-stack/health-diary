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
      <div className="w-full max-w-sm bg-[#1c1f2a] border border-[#313540] rounded-2xl overflow-hidden p-6 text-white shadow-2xl">
        
        <div className="flex items-center justify-between border-b border-[#313540] pb-4 mb-5">
          <h3 className="font-bold text-lg">내 프로필</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-lg">✕</button>
        </div>

        {!isEditing ? (
          // 보기 모드 (이모지 없음)
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-[#0f131d] p-4 rounded-xl border border-[#313540]">
              <div>
                <h4 className="font-bold text-xl tracking-tight">{form.name || '미등록 사용자'}</h4>
                <p className="text-xs text-[#a3e635] mt-1 font-semibold">
                  {form.gender === 'female' ? '여성' : form.gender === 'male' ? '남성' : '성별 미등록'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0f131d] p-4 rounded-xl border border-[#313540] flex flex-col items-center">
                <span className="text-[10px] text-gray-400 mb-1">키</span>
                <span className="font-black text-xl">{form.height || '-'} <span className="text-[10px] font-normal text-gray-500">cm</span></span>
              </div>
              <div className="bg-[#0f131d] p-4 rounded-xl border border-[#313540] flex flex-col items-center">
                <span className="text-[10px] text-gray-400 mb-1">몸무게</span>
                <span className="font-black text-xl">{form.weight || '-'} <span className="text-[10px] font-normal text-gray-500">kg</span></span>
              </div>
            </div>

            <button onClick={() => setIsEditing(true)} className="w-full py-3 bg-[#313540] hover:bg-[#404552] rounded-xl text-sm font-bold mt-2">
              수정하기
            </button>
          </div>
        ) : (
          // 수정 모드
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-gray-400 pl-1">이름</label>
              <input
                type="text"
                value={form.name || ''}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="이름 입력"
                className="w-full mt-1 bg-[#0f131d] border border-[#313540] rounded-xl px-4 py-2.5 text-sm focus:border-[#a3e635] outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 pl-1">성별</label>
              <select
                value={form.gender || ''}
                onChange={e => setForm({ ...form, gender: e.target.value as any })}
                className="w-full mt-1 bg-[#0f131d] border border-[#313540] rounded-xl px-4 py-2.5 text-sm focus:border-[#a3e635] outline-none"
              >
                <option value="">선택 안함</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-gray-400 pl-1">키 (cm)</label>
                <input
                  type="number"
                  value={form.height || ''}
                  onChange={e => setForm({ ...form, height: e.target.value ? Number(e.target.value) : '' })}
                  placeholder="예: 175"
                  className="w-full mt-1 bg-[#0f131d] border border-[#313540] rounded-xl px-4 py-2.5 text-sm focus:border-[#a3e635] outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 pl-1">몸무게 (kg)</label>
                <input
                  type="number"
                  value={form.weight || ''}
                  onChange={e => setForm({ ...form, weight: e.target.value ? Number(e.target.value) : '' })}
                  placeholder="예: 70"
                  className="w-full mt-1 bg-[#0f131d] border border-[#313540] rounded-xl px-4 py-2.5 text-sm focus:border-[#a3e635] outline-none"
                />
              </div>
            </div>
            
            <button onClick={handleSave} className="w-full py-3 bg-[#a3e635] text-[#0f131d] rounded-xl text-sm font-bold mt-2 hover:bg-[#86efac]">
              저장
            </button>
          </div>
        )}
      </div>
    </div>
  );
};