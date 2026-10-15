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

  // 로컬 스토리지 관리 상태들
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ironlog_profile');
    if (saved) return JSON.parse(saved);
    return { name: '', gender: '', height: '', weight: '' }; 
  });

  const [milestones, setMilestones] = useState<MilestoneStreak>(() => {
    const saved = localStorage.getItem('ironlog_milestones');
    if (saved) return JSON.parse(saved);
    return { currentStreakDays: 0, weeklyGoalCompleted: 0, weeklyGoalTarget: 4 };
  });

  // 🔴 탭 이동 시에도 유지되도록 운동 기록 데이터 상태를 App.tsx로 끌어올림
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutItem[]>(() => {
    const saved = localStorage.getItem('ironlog_current_workout');
    if (saved) return JSON.parse(saved);
    return [];
  });

  // 🔴 실제 운동 완료한 날짜들 (통계 및 홈화면 출석부 연동용)
  const [workedOutDates, setWorkedOutDates] = useState<number[]>(() => {
    const saved = localStorage.getItem('ironlog_workout_dates');
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(() => { localStorage.setItem('ironlog_profile', JSON.stringify(userProfile)); }, [userProfile]);
  useEffect(() => { localStorage.setItem('ironlog_milestones', JSON.stringify(milestones)); }, [milestones]);
  useEffect(() => { localStorage.setItem('ironlog_current_workout', JSON.stringify(currentWorkout)); }, [currentWorkout]);
  useEffect(() => { localStorage.setItem('ironlog_workout_dates', JSON.stringify(workedOutDates)); }, [workedOutDates]);

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
        
        {/* WorkoutView에 저장된 운동 상태를 전달 */}
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
                  weeklyGoalCompleted: Math.min(prev.weeklyGoalCompleted + 1, prev.weeklyGoalTarget)
                }));
              }
              
              // 운동 완료 후 폼 비우고 홈으로 이동
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