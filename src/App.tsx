/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TabType } from './types/fitness';

import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
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
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // 1. 프로필 브라우저 자동 저장 (초기값 완전 공란)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ironlog_profile');
    if (saved) return JSON.parse(saved);
    return { name: '', gender: '', height: '', weight: '' }; 
  });

  // 2. 통계 브라우저 자동 저장 (초기값 0으로 세팅)
  const [milestones, setMilestones] = useState<MilestoneStreak>(() => {
    const saved = localStorage.getItem('ironlog_milestones');
    if (saved) return JSON.parse(saved);
    return { currentStreakDays: 0, weeklyGoalCompleted: 0, weeklyGoalTarget: 4 };
  });

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
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      <main className="flex flex-col relative w-full pt-16 pb-28 px-4 bg-[#0f131d] flex-1 max-w-lg mx-auto">
        {activeTab === 'home' && (
          <HomeView
            milestones={milestones}
            userProfile={userProfile}
            onStartRoutine={() => setActiveTab('workout')}
          />
        )}
        {activeTab === 'workout' && (
          <WorkoutView
            onCompleteWorkout={() => {
              const today = new Date().getDate();
              // 오늘 운동 날짜 저장 로직 (실제 출석부에 도장 찍기)
              const savedDates = localStorage.getItem('ironlog_workout_dates');
              let datesArray = savedDates ? JSON.parse(savedDates) : [];
              if (!datesArray.includes(today)) {
                datesArray.push(today);
                localStorage.setItem('ironlog_workout_dates', JSON.stringify(datesArray));
              }

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