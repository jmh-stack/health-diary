/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'n-1',
      icon: 'local_fire_department',
      color: 'text-[#ccff80]',
      title: '연속 18일 운동 기록 달성!',
      message: '월간 목표까지 단 2회의 세션이 남았습니다. 오늘도 파이팅!',
      time: '10분 전',
      unread: true,
    },
    {
      id: 'n-2',
      icon: 'restaurant',
      color: 'text-[#7bd0ff]',
      title: '야간 근합성 단백질 알림',
      message: '단 +18g 단백질을 섭취하면 오늘 160g 목표가 완성됩니다.',
      time: '1시간 전',
      unread: true,
    },
    {
      id: 'n-3',
      icon: 'military_tech',
      color: 'text-[#ccff80]',
      title: '새로운 PR 뱃지 획득 가능권',
      message: '벤치프레스 105kg 도전 권장 세션이 준비되어 있습니다.',
      time: '오늘 아침',
      unread: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-[#1c1f2a] border border-[#313540] rounded-2xl shadow-2xl p-5 flex flex-col gap-4 text-[#dfe2f1]">
        <div className="flex items-center justify-between border-b border-[#313540] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ccff80] text-[20px]">notifications_active</span>
            <h3 className="font-space text-lg font-bold">알림 센터</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#c2cab0] hover:text-white hover:bg-[#262a35]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-2.5 max-h-80 overflow-y-auto pr-1">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 rounded-xl border transition-all ${
                n.unread
                  ? 'bg-[#262a35] border-[#424936]'
                  : 'bg-[#171b26] border-transparent opacity-80'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span className={`material-symbols-outlined text-[20px] ${n.color} mt-0.5`}>
                  {n.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-space text-xs font-bold text-[#dfe2f1]">{n.title}</h4>
                    <span className="text-[10px] text-[#c2cab0]">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-[#c2cab0] mt-1 leading-relaxed">{n.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#262a35] hover:bg-[#313540] text-xs font-semibold text-[#dfe2f1] transition-colors"
        >
          확인 완료
        </button>
      </div>
    </div>
  );
};
