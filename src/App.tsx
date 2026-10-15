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
import { WorkoutView, WorkoutItem } from './views/WorkoutView';
import { AnalyticsView } from './views/AnalyticsView';
import { RoutineView } from './views/RoutineView';

export interface UserProfile {
  name?: string;
  gender: 'male' | 'female' | '';
  height?: number | '';
  weight?: number | '';
}

export interface MilestoneStreak {
  currentStreakDays: number;
  weeklyGoalCompleted: number;
  weeklyGoalTarget: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // v2 키를 사용하여 기존 브라우저에 남은 더미 데이터를 무시하고 완전 공란으로 시작
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ironlog_profile_v2');
    if (saved) return JSON.parse(saved);
    return { name: '', gender: '', height: '', weight: '' }; 
  });

  // 목표 7일, 현재 0일의 완전 초기 데이터
  const [milestones, setMilestones] = useState<MilestoneStreak>(() => {
    const saved = localStorage.getItem('ironlog_milestones_v2');
    if (saved) return JSON.parse(saved);
    return { currentStreakDays: 0, weeklyGoalCompleted: 0, weeklyGoalTarget: 7 };
  });

  const [currentWorkout, setCurrentWorkout] = useState<WorkoutItem[]>(() => {
    const saved = localStorage.getItem('ironlog_current_workout_v2');
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [workedOutDates, setWorkedOutDates] = useState<number[]>(() => {
    const saved = localStorage.getItem('ironlog_workout_dates_v2');
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(() => { localStorage.setItem('ironlog_profile_v2', JSON.stringify(userProfile)); }, [userProfile]);
  useEffect(() => { localStorage.setItem('ironlog_milestones_v2', JSON.stringify(milestones)); }, [milestones]);
  useEffect(() => { localStorage.setItem('ironlog_current_workout_v2', JSON.stringify(currentWorkout)); }, [currentWorkout]);
  useEffect(() => { localStorage.setItem('ironlog_workout_dates_v2', JSON.stringify(workedOutDates)); }, [workedOutDates]);

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
            userProfile={userProfile}
            workedOutDays={workedOutDates}
            onStartRoutine={() => setActiveTab('workout')}
          />
        )}
        
        {activeTab === 'workout' && (
          <WorkoutView
            exercises={currentWorkout}
            setExercises={setCurrentWorkout}
            onCompleteWorkout={() => {
              const today = new Date().getDate();
              
              if (!workedOutDates.includes(today)) {
                setWorkedOutDates(prev => [...prev, today]);
                setMilestones((prev) => ({
                  ...prev,
                  currentStreakDays: prev.currentStreakDays + 1,
                  // 주 7일 목표 적용
                  weeklyGoalCompleted: Math.min(prev.weeklyGoalCompleted + 1, prev.weeklyGoalTarget)
                }));
              }
              
              setCurrentWorkout([]);
              setActiveTab('home');
            }}
          />
        )}
        
        {activeTab === 'analytics' && (
          <AnalyticsView 
            milestones={milestones} 
            workedOutDays={workedOutDates} 
          />
        )}
        
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