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
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // 영구 저장소(prod) 키 적용: 이후 코드 업데이트 시에도 이 키들은 절대 변경하지 않아 데이터가 영구 보존됩니다.
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ironlog_prod_profile');
    if (saved) return JSON.parse(saved);
    return { name: '', gender: '', height: '', weight: '' }; 
  });

  const [milestones, setMilestones] = useState<MilestoneStreak>(() => {
    const saved = localStorage.getItem('ironlog_prod_milestones');
    if (saved) return JSON.parse(saved);
    return { currentStreakDays: 0 };
  });

  const [currentWorkout, setCurrentWorkout] = useState<WorkoutItem[]>(() => {
    const saved = localStorage.getItem('ironlog_prod_current_workout');
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [workedOutDates, setWorkedOutDates] = useState<number[]>(() => {
    const saved = localStorage.getItem('ironlog_prod_workout_dates');
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [routines, setRoutines] = useState<RoutineGroup[]>(() => {
    const saved = localStorage.getItem('ironlog_prod_routines');
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [mainRoutineId, setMainRoutineId] = useState<string>(() => {
    return localStorage.getItem('ironlog_prod_main_routine_id') || '';
  });

  useEffect(() => { localStorage.setItem('ironlog_prod_profile', JSON.stringify(userProfile)); }, [userProfile]);
  useEffect(() => { localStorage.setItem('ironlog_prod_milestones', JSON.stringify(milestones)); }, [milestones]);
  useEffect(() => { localStorage.setItem('ironlog_prod_current_workout', JSON.stringify(currentWorkout)); }, [currentWorkout]);
  useEffect(() => { localStorage.setItem('ironlog_prod_workout_dates', JSON.stringify(workedOutDates)); }, [workedOutDates]);
  useEffect(() => { localStorage.setItem('ironlog_prod_routines', JSON.stringify(routines)); }, [routines]);
  useEffect(() => { localStorage.setItem('ironlog_prod_main_routine_id', mainRoutineId); }, [mainRoutineId]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as TabType;
    if (tabParam && ['home', 'workout', 'analytics', 'routine'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  const mainRoutine = routines.find(r => r.id === mainRoutineId);
  const mainRoutineTitle = mainRoutine ? mainRoutine.title : undefined;

  const handleStartRoutine = (targetRoutineId?: string) => {
    const routineIdToStart = targetRoutineId || mainRoutineId;
    const routineToStart = routines.find(r => r.id === routineIdToStart);

    if (routineToStart && routineToStart.exercises.length > 0) {
      const loadedWorkout: WorkoutItem[] = routineToStart.exercises.map((exName, index) => ({
        id: `${Date.now()}-${index}`,
        name: exName,
        weight: '',
        reps: '',
        completed: false
      }));
      setCurrentWorkout(loadedWorkout);
    }
    
    setActiveTab('workout');
  };

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
            mainRoutineTitle={mainRoutineTitle}
            onStartRoutine={() => handleStartRoutine()}
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
                setMilestones(prev => ({
                  currentStreakDays: prev.currentStreakDays + 1
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
            onStartRoutine={handleStartRoutine}
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