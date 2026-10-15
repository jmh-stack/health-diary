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
import { DietView } from './views/DietView';
import { RoutineView } from './views/RoutineView';

export interface UserProfile {
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

  const [userProfile, setUserProfile] = useState<UserProfile>({
    gender: '',
    height: '',
    weight: '',
    skeletalMuscle: '',
    bodyFatPercentage: '',
    dailyProteinGoal: ''
  });

  const [milestones, setMilestones] = useState<MilestoneStreak>({
    currentStreakDays: 0,
    weeklyGoalCompleted: 0,
    weeklyGoalTarget: 4
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as TabType;
    if (tabParam && ['home', 'workout', 'analytics', 'diet', 'routine'].includes(tabParam)) {
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

        {activeTab === 'diet' && <DietView userProfile={userProfile} />}

        {activeTab === 'routine' && (
          <RoutineView onStartRoutine={() => setActiveTab('workout')} />
        )}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />

      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}