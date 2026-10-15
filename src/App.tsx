/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TabType } from './types/fitness';

import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { NotificationModal } from './components/NotificationModal';
import { ProfileModal } from './components/ProfileModal';

import { HomeView } from './views/HomeView';
import { WorkoutView } from './views/WorkoutView';
import { AnalyticsView } from './views/AnalyticsView';
import { RoutineView } from './views/RoutineView';

export interface UserProfile {
  name?: string;
  gender: 'male' | 'female' | '';
  height?: number | '';
  weight?: number | '';
  skeletalMuscle?: number | '';
  bodyFatPercentage?: number | '';
  dailyProteinGoal?: number | '';
}

export interface MilestoneStreak {
  currentStreakDays: number;
  weeklyGoalCompleted: number;
  weeklyGoalTarget: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // 1. 프로필 브라우저 자동 저장 (localStorage)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ironlog_profile');
    if (saved) return JSON.parse(saved);
    return { name: '민우', gender: 'male', height: 178, weight: 74.5 };
  });

  // 2. 통계 브라우저 자동 저장
  const [milestones, setMilestones] = useState<MilestoneStreak>(() => {
    const saved = localStorage.getItem('ironlog_milestones');
    if (saved) return JSON.parse(saved);
    return { currentStreakDays: 5, weeklyGoalCompleted: 3, weeklyGoalTarget: 4 };
  });

  // 상태가 바뀔 때마다 브라우저에 즉시 저장
  useEffect(() => {
    localStorage.setItem('ironlog_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('ironlog_milestones', JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as TabType;
    if (tabParam && ['home', 'workout', 'analytics', 'routine'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  return (
    <div className="bg-[#0f131d] text-[#dfe2f1] min-h-screen flex flex-col antialiased">
      <Header
        activeTab={activeTab}
        userProfile={userProfile}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      <main className="flex flex-col relative w-full pt-16 pb-28 px-4 bg-[#0f131d] flex-1 max-w-lg mx-auto">
        {activeTab === 'home' && (
          <HomeView
            milestones={milestones}
            userProfile={userProfile} // 홈 화면에 프로필 전달
            onStartRoutine={() => setActiveTab('workout')}
          />
        )}
        {activeTab === 'workout' && (
          <WorkoutView
            onCompleteWorkout={() => {
              setMilestones((prev) => ({
                ...prev,
                currentStreakDays: prev.currentStreakDays + 1,
                weeklyGoalCompleted: Math.min(prev.weeklyGoalCompleted + 1, prev.weeklyGoalTarget)
              }));
              setActiveTab('home');
            }}
          />
        )}
        {activeTab === 'analytics' && <AnalyticsView milestones={milestones} />}
        {activeTab === 'routine' && <RoutineView onStartRoutine={() => setActiveTab('workout')} />}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />

      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        userProfile={userProfile}
        onSave={(updated) => {
          setUserProfile((prev) => ({ ...prev, ...updated }));
          setIsProfileOpen(false);
        }}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}