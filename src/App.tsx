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

// 💡 [핵심 복구 로직] 과거에 저장된 데이터(v3, v2, 초기버전)를 찾아내어 영구 키(prod)로 끌어오는 함수
function loadData<T>(prodKey: string, oldKeys: string[], defaultValue: T): T {
  try {
    const savedProd = localStorage.getItem(prodKey);
    if (savedProd) return JSON.parse(savedProd);

    // 예전 이름표로 저장된 기록이 있는지 하나씩 확인
    for (const oldKey of oldKeys) {
      const savedOld = localStorage.getItem(oldKey);
      if (savedOld) {
        localStorage.setItem(prodKey, savedOld); // 찾았다면 영구 저장소(prod)로 복원 완료!
        return JSON.parse(savedOld);
      }
    }
  } catch (e) {
    console.error('Data parsing error', e);
  }
  return defaultValue;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // 1. 프로필 자동 복원 및 로드
  const [userProfile, setUserProfile] = useState<UserProfile>(() => 
    loadData('ironlog_prod_profile', ['ironlog_profile_v3', 'ironlog_profile_v2', 'ironlog_profile'], { name: '', gender: '', height: '', weight: '' })
  );

  // 2. 통계 자동 복원 및 로드
  const [milestones, setMilestones] = useState<MilestoneStreak>(() => 
    loadData('ironlog_prod_milestones', ['ironlog_milestones_v3', 'ironlog_milestones_v2', 'ironlog_milestones'], { currentStreakDays: 0 })
  );

  // 3. 현재 운동 기록 복원
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutItem[]>(() => 
    loadData('ironlog_prod_current_workout', ['ironlog_current_workout_v3', 'ironlog_current_workout_v2', 'ironlog_current_workout'], [])
  );

  // 4. 운동 출석부 날짜 복원
  const [workedOutDates, setWorkedOutDates] = useState<number[]>(() => 
    loadData('ironlog_prod_workout_dates', ['ironlog_workout_dates_v3', 'ironlog_workout_dates_v2', 'ironlog_workout_dates'], [])
  );

  // 5. 나만의 루틴 목록 자동 복원!
  const [routines, setRoutines] = useState<RoutineGroup[]>(() => 
    loadData('ironlog_prod_routines', ['ironlog_routines_v3', 'ironlog_routines'], [])
  );

  // 6. 메인 루틴 ID 복원
  const [mainRoutineId, setMainRoutineId] = useState<string>(() => {
    const savedProd = localStorage.getItem('ironlog_prod_main_routine_id');
    if (savedProd) return savedProd;
    
    const oldKeys = ['ironlog_main_routine_id_v3', 'ironlog_main_routine_id'];
    for (const oldKey of oldKeys) {
      const savedOld = localStorage.getItem(oldKey);
      if (savedOld) {
        localStorage.setItem('ironlog_prod_main_routine_id', savedOld);
        return savedOld;
      }
    }
    return '';
  });

  // 데이터 변경 시 이제 오직 'prod' (영구) 키에만 저장합니다.
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