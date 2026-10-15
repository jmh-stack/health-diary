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
import { ProfileModal } from './components/ProfileModal'; // ProfileModal로 변경

// 5대 탭 뷰
import { HomeView } from './views/HomeView';
import { WorkoutView } from './views/WorkoutView';
import { AnalyticsView } from './views/AnalyticsView';
import { DietView } from './views/DietView';
import { RoutineView } from './views/RoutineView';

// 1. 간소화된 사용자 프로필
export interface UserProfile {
  gender: 'male' | 'female' | '';
  height?: number | ''; // cm
  weight?: number | ''; // kg
  skeletalMuscle?: number | ''; // kg
  bodyFatPercentage?: number | ''; // %
  dailyProteinGoal?: number | ''; // g
}

// 2. 운동 종목별 총 횟수 기록 타입
export interface FreeWorkoutEntry {
  id: string;
  name: string;
  weight?: number | '';
  totalReps: number | '';
  completed: boolean;
}

// 마일스톤 스트릭
export interface MilestoneStreak {
  currentStreakDays: number;
  weeklyGoalCompleted: number;
  weeklyGoalTarget: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // 1. 사용자 신체 프로필
  const [userProfile, setUserProfile] = useState<UserProfile>({
    gender: '',
    height: '',
    weight: '',
    skeletalMuscle: '',
    bodyFatPercentage: '',
    dailyProteinGoal: ''
  });

  // 2. 마일스톤 상태
  const [milestones, setMilestones] = useState<MilestoneStreak>({
    currentStreakDays: 0,
    weeklyGoalCompleted: 0,
    weeklyGoalTarget: 4
  });

  // URL 파라미터 동기화
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as TabType;
    if (tabParam && ['home', 'workout', 'analytics', 'diet', 'routine'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  return (
    <div className="bg-[#0f131d] text-[#dfe2f1] min-h-screen flex flex-col antialiased selection:bg-[#a3e635] selection:text-[#0f131d]">
      {/* 상단 헤더 */}
      <Header
        activeTab={activeTab}
        userProfile={userProfile}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* 메인 뷰 컨테이너 */}
      <main className="flex flex-col relative w-full pt-16 pb-28 px-4 bg-[#0f131d] flex-1 max-w-lg mx-auto">
        {/* 1. 홈 뷰 */}
        {activeTab === 'home' && (
          <HomeView
            milestones={milestones}
            onStartRoutine={() => setActiveTab('workout')}
          />
        )}

        {/* 2. 운동 기록 뷰 */}
        {activeTab === 'workout' && (
          <WorkoutView
            onCompleteWorkout={() => {
              setMilestones(prev => ({
                ...prev,
                currentStreakDays: prev.currentStreakDays + 1