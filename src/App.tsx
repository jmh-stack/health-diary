/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TabType } from './types/fitness';

// Core Navigation & Global Shell Components
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { NotificationModal } from './components/NotificationModal';
import { ProfileEditModal } from './components/ProfileEditModal';

// 5대 탭 뷰
import { HomeView } from './views/HomeView';
import { WorkoutView } from './views/WorkoutView';
import { AnalyticsView } from './views/AnalyticsView';
import { DietView } from './views/DietView';
import { RoutineView } from './views/RoutineView';

// 사용자 프로필 및 신체 스펙 타입
export interface UserProfile {
  gender: 'male' | 'female';
  height: number;
  weight: number;
  skeletalMuscle: number;
  bodyFatPercentage: number;
  bmr: number;
  tdee: number;
  dailyProteinGoal: number;
  isPrivateMasked: boolean;
  lastInBodySyncDate?: string;
}

// 마일스톤 및 꾸준함 달성 기록 타입
export interface MilestoneStreak {
  currentStreakDays: number;
  weeklyGoalCompleted: number;
  weeklyGoalTarget: number;
  totalVolumeMonthKg: number;
  totalRecordedDaysMonth: number;
  recentMilestoneBadge: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);

  // 1. 사용자 신체 프로필 상태
  const [userProfile, setUserProfile] = useState<UserProfile>({
    gender: 'male',
    height: 178,
    weight: 74.5,
    skeletalMuscle: 36.2,
    bodyFatPercentage: 14.8,
    bmr: 1740,
    tdee: 2520,
    dailyProteinGoal: 160,
    isPrivateMasked: false,
    lastInBodySyncDate: '3일 전 자동 동기화'
  });

  // 2. 마일스톤 & 운동 연속 달성(Streak) 상태
  const [milestones, setMilestones] = useState<MilestoneStreak>({
    currentStreakDays: 5,
    weeklyGoalCompleted: 3,
    weeklyGoalTarget: 4,
    totalVolumeMonthKg: 42850,
    totalRecordedDaysMonth: 14,
    recentMilestoneBadge: '5일 연속 달성 (상위 15%)'
  });

  // URL 쿼리 파라미터 기반 탭 동기화
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as TabType;
    if (tabParam && ['home', 'workout', 'analytics', 'diet', 'routine'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  // 신체 스펙 업데이트 핸들러
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const next = { ...prev, ...updated };
      const calculatedBmr = Math.round(
        10 * next.weight + 6.25 * next.height - 5 * 28 + (next.gender === 'male' ? 5 : -161)
      );
      const calculatedTdee = Math.round(calculatedBmr * 1.45);
      return {
        ...next,
        bmr: calculatedBmr,
        tdee: calculatedTdee
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#0f131d] text-white flex flex-col">
      {/* 상단 헤더 */}
      <Header
        activeTab={activeTab}
        userProfile={userProfile}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenProfile={() => setIsProfileEditOpen(true)}
      />

      {/* 메인 뷰 컨테이너 */}
      <main className="flex flex-col relative w-full pt-16 pb-28 px-4 bg-[#0f131d] flex-1 max-w-lg mx-auto">
        {activeTab === 'home' && (
          <HomeView
            milestones={milestones}
            onStartRoutine={() => setActiveTab('workout')}
            onGoToRoutine={() => setActiveTab('routine')}
            onOpenProfileEdit={() => setIsProfileEditOpen(true)}
          />
        )}

        {activeTab === 'workout' && (
          <WorkoutView
            onCompleteWorkout={() => {
              setMilestones((prev) => ({
                ...prev,
                currentStreakDays: prev.currentStreakDays + 1,
                weeklyGoalCompleted: Math.min(prev.weeklyGoalCompleted + 1, prev.weeklyGoalTarget),
                totalRecordedDaysMonth: prev.totalRecordedDaysMonth + 1
              }));
              setActiveTab('routine');
            }}
            onGoToAnalytics={() => setActiveTab('analytics')}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView milestones={milestones} />
        )}

        {activeTab === 'diet' && (
          <DietView userProfile={userProfile} />
        )}

        {activeTab === 'routine' && (
          <RoutineView
            userProfile={userProfile}
            milestones={milestones}
            onUpdateProfile={handleUpdateProfile}
            onOpenProfileModal={() => setIsProfileEditOpen(true)}
            onStartRoutine={() => setActiveTab('workout')}
            onGoToAnalytics={() => setActiveTab('analytics')}
          />
        )}
      </main>

      {/* 하단 고정 탭 네비게이션 */}
      <BottomNav activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />

      {/* 알림 모달 */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      {/* 프로필 수정 모달 */}
      <ProfileEditModal
        isOpen={isProfileEditOpen}
        userProfile={userProfile}
        onSave={(updated) => {
          handleUpdateProfile(updated);
          setIsProfileEditOpen(false);
        }}
        onClose={() => setIsProfileEditOpen(false)}
      />
    </div>
  );
}