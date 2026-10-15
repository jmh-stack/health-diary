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
  isOpen,
  userProfile,
  onSave,
  onClose
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<UserProfile>(userProfile);

  useEffect(() => {
    setForm(userProfile);
    setIsEditing(false);
  }, [userProfile, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof UserProfile, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(form);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#1a1d27] border border-[#2d313e] rounded-3xl shadow-2xl overflow-hidden p-6 text-white space-y-6">
        
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-[#2d313e] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[#a3e635] text-xl">👤</span>
            <h3 className="font-bold text-lg">내 프로필</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>

        {/* 1. 프로필 카드 : [이름 + 성별 아이콘만 배치] */}
        <div className="flex items-center justify-between bg-[#0f131d] p-4 rounded-2xl border border-[#2d313e]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#a3e635]/20 text-[#a3e635] flex items-center justify-center font-bold text-lg">
              {form.gender === 'female' ? '♀' : '♂'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white">
                  {form.name || '사용자'}
                </span>
                <span className="text-xs text-[#a3e635] bg-[#a3e635]/10 px-2 py-0.5 rounded-full font-semibold">
                  {form.gender === 'female' ? '여성' : '남성'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs text-gray-400 hover:text-[#a3e635] underline"
          >
            {isEditing ? '보기 모드' : '수정하기'}
          </button>
        </div>

        {/* 2. 보기 모드 (수정 버튼 안 눌렀을 때 : 픽토그램 카드) */}
        {!isEditing ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0f131d] p-3.5 rounded-2xl border border-[#2d313e] flex items-center gap-3">
              <span className="text-2xl">📏</span>
              <div>
                <p className="text-[10px] text-gray-400">신장 (키)</p>
                <p className="font-bold text-base text-white">{form.height ? `${form.height} cm` : '-'}</p>
              </div>
            </div>

            <div className="bg-[#0f131d] p-3.5 rounded-2xl border border-[#2d313e] flex items-center gap-3">
              <span className="text-2xl">⚖️</span>
              <div>
                <p className="text-[10px] text-gray-400">체중 (몸무게)</p>
                <p className="font-bold text-base text-white">{form.weight ? `${form.weight} kg` : '-'}</p>
              </div>
            </div>

            <div className="bg-[#0f131d] p-3.5 rounded-2xl border border-[#2d313e] flex items-center gap-3">
              <span className="text-2xl">💪</span>
              <div>
                <p className="text-[10px] text-gray-400">골격근량</p>
                <p className="font-bold text-base text-white">{form.skeletalMuscle ? `${form.skeletalMuscle} kg` : '-'}</p>
              </div>
            </div>

            <div className="bg-[#0f131d] p-3.5 rounded-2xl border border-[#2d313e] flex items-center gap-3">
              <span className="text-2xl">💧</span>
              <div>
                <p className="text-[10px] text-gray-400">체지방률</p>
                <p className="font-bold text-base text-white">{form.bodyFatPercentage ? `${form.bodyFatPercentage} %` : '-'}</p>
              </div>
            </div>
          </div>
        ) : (
          /* 3. 수정 모드 (직접 입력창) */
          <div className="space-y-3 bg-[#0f131d] p-4 rounded-2xl border border-[#2d313e]">
            <div>
              <label className="block text-[11px] text-gray-400 mb-1">이름</label>
              <input
                type="text"
                value={form.name || ''}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="이름 입력"
                className="w-full bg-[#1a1d27] border border-[#2d313e] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#a3e635]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">성별</label>
                <select
                  value={form.gender || 'male'}
                  onChange={e => handleChange('gender', e.target.value)}
                  className="w-full bg-[#1a1d27] border border-[#2d313e] rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">키 (cm)</label>
                <input
                  type="number"
                  value={form.height || ''}
                  onChange={e => handleChange('height', e.target.value ? Number(e.target.value) : '')}
                  placeholder="178"
                  className="w-full bg-[#1a1d27] border border-[#2d313e] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#a3e635]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] text-gray-400 mb-1">체중(kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.weight || ''}
                  onChange={e => handleChange('weight', e.target.value ? Number(e.target.value) : '')}
                  placeholder="74.5"
                  className="w-full bg-[#1a1d27] border border-[#2d313e] rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 mb-1">골격근(kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.skeletalMuscle || ''}
                  onChange={e => handleChange('skeletalMuscle', e.target.value ? Number(e.target.value) : '')}
                  placeholder="36.2"
                  className="w-full bg-[#1a1d27] border border-[#2d313e] rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 mb-1">체지방(%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.bodyFatPercentage || ''}
                  onChange={e => handleChange('bodyFatPercentage', e.target.value ? Number(e.target.value) : '')}
                  placeholder="14.8"
                  className="w-full bg-[#1a1d27] border border-[#2d313e] rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full py-2.5 bg-[#a3e635] text-[#0f131d] font-bold rounded-xl text-xs hover:bg-[#86efac] transition-colors mt-2"
            >
              수정 완료 및 저장
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 bg-[#2d313e] text-gray-300 font-semibold rounded-2xl text-xs hover:bg-[#3a3f50] transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  );
};