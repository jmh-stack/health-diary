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
import { RoutineView, RoutineGroup } from './views/RoutineView';

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

  // 1. 프로필 상태
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ironlog_profile');
    if (saved) return JSON.parse(saved);
    return { name: '', gender: '', height: '', weight: '' }; 
  });

  // 2. 통계 (마일스톤) 상태
  const [milestones, setMilestones] = useState<MilestoneStreak>(() => {
    const saved = localStorage.getItem('ironlog_milestones');
    if (saved) return JSON.parse(saved);
    return { currentStreakDays: 0, weeklyGoalCompleted: 0, weeklyGoalTarget: 7 };
  });

  // 3. 현재 진행 중인 운동 상태
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutItem[]>(() => {
    const saved = localStorage.getItem('ironlog_current_workout');
    if (saved) return JSON.parse(saved);
    return [];
  });

  // 4. 운동 완료 출석부 (날짜 배열)
  const [workedOutDates, setWorkedOutDates] = useState<number[]>(() => {
    const saved = localStorage.getItem('ironlog_workout_dates');
    if (saved) return JSON.parse(saved);
    return [];
  });

  // 5. 커스텀 루틴 목록 및 메인 루틴 설정 상태 (동기화 핵심)
  const [routines, setRoutines] = useState<RoutineGroup[]>(() => {
    const saved = localStorage.getItem('ironlog_routines');
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [mainRoutineId, setMainRoutineId] = useState<string>(() => {
    return localStorage.getItem('ironlog_main_routine_id') || '';
  });

  // 데이터가 변경될 때마다 로컬 기기(브라우저)에 영구 저장
  useEffect(() => { localStorage.setItem('ironlog_profile', JSON.stringify(userProfile)); }, [userProfile]);
  useEffect(() => { localStorage.setItem('ironlog_milestones', JSON.stringify(milestones)); }, [milestones]);
  useEffect(() => { localStorage.setItem('ironlog_current_workout', JSON.stringify(currentWorkout)); }, [currentWorkout]);
  useEffect(() => { localStorage.setItem('ironlog_workout_dates', JSON.stringify(workedOutDates)); }, [workedOutDates]);
  useEffect(() => { localStorage.setItem('ironlog_routines', JSON.stringify(routines)); }, [routines]);
  useEffect(() => { localStorage.setItem('ironlog_main_routine_id', mainRoutineId); }, [mainRoutineId]);

  // URL 탭 파라미터 동기화
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as TabType;
    if (tabParam && ['home', 'workout', 'analytics', 'routine'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  // 홈 화면에 넘겨줄 메인 루틴 이름 찾기
  const mainRoutine = routines.find(r => r.id === mainRoutineId);
  const mainRoutineTitle = mainRoutine ? mainRoutine.title : undefined;

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
            mainRoutineTitle={mainRoutineTitle} // 홈 화면으로 이름 전달
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
        
        {activeTab === 'routine' && (
          <RoutineView 
            routines={routines}
            setRoutines={setRoutines}
            mainRoutineId={mainRoutineId}
            setMainRoutineId={setMainRoutineId}
            onStartRoutine={() => setActiveTab('workout')} 
          />
        )}
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