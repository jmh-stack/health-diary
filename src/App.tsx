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

// 💡 날짜별 운동 상세 기록을 담기 위한 타입
export interface DailyRecord {
  date: number; // 일자 (1~31)
  exercises: WorkoutItem[]; // 그날 수행한 운동 목록
}

function loadData<T>(prodKey: string, oldKeys: string[], defaultValue: T): T {
  try {
    const savedProd = localStorage.getItem(prodKey);
    if (savedProd) return JSON.parse(savedProd);
    for (const oldKey of oldKeys) {
      const savedOld = localStorage.getItem(oldKey);
      if (savedOld) {
        localStorage.setItem(prodKey, savedOld);
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

  const [userProfile, setUserProfile] = useState<UserProfile>(() => 
    loadData('ironlog_prod_profile', [], { name: '', gender: '', height: '', weight: '' })
  );

  const [milestones, setMilestones] = useState<MilestoneStreak>(() => 
    loadData('ironlog_prod_milestones', [], { currentStreakDays: 0 })
  );

  const [currentWorkout, setCurrentWorkout] = useState<WorkoutItem[]>(() => 
    loadData('ironlog_prod_current_workout', [], [])
  );

  const [routines, setRoutines] = useState<RoutineGroup[]>(() => 
    loadData('ironlog_prod_routines', [], [])
  );

  const [mainRoutineId, setMainRoutineId] = useState<string>(() => {
    return localStorage.getItem('ironlog_prod_main_routine_id') || '';
  });

  // 💡 단순 날짜 배열이 아닌, { date, exercises } 객체 배열로 변경!
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>(() => 
    loadData('ironlog_prod_daily_records', [], [])
  );

  useEffect(() => { localStorage.setItem('ironlog_prod_profile', JSON.stringify(userProfile)); }, [userProfile]);
  useEffect(() => { localStorage.setItem('ironlog_prod_milestones', JSON.stringify(milestones)); }, [milestones]);
  useEffect(() => { localStorage.setItem('ironlog_prod_current_workout', JSON.stringify(currentWorkout)); }, [currentWorkout]);
  useEffect(() => { localStorage.setItem('ironlog_prod_routines', JSON.stringify(routines)); }, [routines]);
  useEffect(() => { localStorage.setItem('ironlog_prod_main_routine_id', mainRoutineId); }, [mainRoutineId]);
  useEffect(() => { localStorage.setItem('ironlog_prod_daily_records', JSON.stringify(dailyRecords)); }, [dailyRecords]);

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
      <Header activeTab={activeTab} userProfile={userProfile} onOpenProfile={() => setIsProfileOpen(true)} />

      <main className="flex flex-col relative w-full pt-16 pb-28 px-4 bg-[#0f131d] flex-1 max-w-lg mx-auto">
        {activeTab === 'home' && (
          <HomeView
            userProfile={userProfile}
            dailyRecords={dailyRecords} // 💡 상세 기록 데이터 홈으로 전달
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
              // '완료 체크' 된 종목만 필터링하여 저장
              const completedExercises = currentWorkout.filter(ex => ex.completed);
              
              if (completedExercises.length > 0) {
                // 이미 오늘 기록이 있다면 덮어씌우거나 추가 (여기선 덮어쓰기)
                setDailyRecords(prev => {
                  const filtered = prev.filter(r => r.date !== today);
                  return [...filtered, { date: today, exercises: completedExercises }];
                });

                // 스트릭 증가
                const hasWorkedOutToday = dailyRecords.some(r => r.date === today);
                if (!hasWorkedOutToday) {
                  setMilestones(prev => ({ currentStreakDays: prev.currentStreakDays + 1 }));
                }
              }
              
              setCurrentWorkout([]);
              setActiveTab('home');
            }}
          />
        )}
        
        {activeTab === 'analytics' && (
          <AnalyticsView 
            milestones={milestones} 
            workedOutDays={dailyRecords.map(r => r.date)} 
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