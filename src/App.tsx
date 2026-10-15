/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TabType } from './types/fitness.ts';

// Core Navigation & Global Shell Components
import { Header } from './components/Header.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { NotificationModal } from './components/NotificationModal.tsx';
import { SimpleProfileModal } from './components/SimpleProfileModal.tsx'; // 간편 프로필 모달 (우측 상단 탭 진입)

// 5대 탭 뷰
import { HomeView } from './views/HomeView.tsx';
import { WorkoutView } from './views/WorkoutView.tsx';
import { AnalyticsView } from './views/AnalyticsView.tsx';
import { DietView } from './views/DietView.tsx';
import { RoutineView } from './views/RoutineView.tsx';

// 1. 간소화된 사용자 프로필 (프라이버시/마스킹 제거, 직관적 수치만 유지)
export interface UserProfile {
  gender: 'male' | 'female' | '';
  height?: number | ''; // cm
  weight?: number | ''; // kg
  skeletalMuscle?: number | ''; // kg
  bodyFatPercentage?: number | ''; // %
  dailyProteinGoal?: number | ''; // g
}

// 2. 운동 종목별 총 횟수 기록 타입 (세트/타이머 제거, 종목명과 총 횟수/중량만 자유 기입)
export interface FreeWorkoutEntry {
  id: string;
  name: string; // 종목명 (예시 없이 공란 시작)
  weight?: number | ''; // 중량(kg) (선택)
  totalReps: number | ''; // 총 횟수 (세트 구분 없이 통합 기재)
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
  const [isProfileOpen, setIsProfileOpen] = useState(false); // 우측 상단 프로필 아이콘 클릭 시 오픈

  // 1. 사용자 신체 프로필 (기본 예시 없이 공란 또는 초기값 미설정 상태)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    gender: '',
    height: '',
    weight: '',
    skeletalMuscle: '',
    bodyFatPercentage: '',
    dailyProteinGoal: ''
  });

  // 2. 마일스톤 상태 (연속 운동 달성 현황)
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
      {/* 
        [상단 헤더]:
        - 불필요한 정보 제거, IronLog 로고 + 알림 + [우측 상단 프로필 아이콘]
        - 우측 상단 프로필 아이콘 터치 시 바로 간편 입력 모달(SimpleProfileModal) 오픈
      */}
      <Header
        activeTab={activeTab}
        userProfile={userProfile}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* 메인 뷰 컨테이너 */}
      <main className="flex flex-col relative w-full pt-16 pb-28 px-4 bg-[#0f131d] flex-1 max-w-lg mx-auto">
        {/* 
          1. 홈 뷰 (HomeView):
          - 복잡한 추천 루틴 카드 완전 제거
          - 야외 체육장 날씨 & 기온
          - 오늘의 동기부여 문구
          - 심플한 단일 CTA: [내 루틴 시작하기]
        */}
        {activeTab === 'home' && (
          <HomeView
            milestones={milestones}
            onStartRoutine={() => setActiveTab('workout')}
          />
        )}

        {/* 
          2. 운동 기록 뷰 (WorkoutView):
          - [휴식 타이머 완전 제거]
          - [세트 분할 제거]: 1세트, 2세트 나누지 않고 종목별 '총 횟수'만 바로 적는 방식
          - [자유로운 스크롤 입력]: 운동 순서 상관없이 상하 스크롤하며 원하는 종목부터 자유 기입
          - 기본 예시 데이터 전부 공란 처리 (+ 운동 추가 버튼으로 자유 기재)
        */}
        {activeTab === 'workout' && (
          <WorkoutView
            onCompleteWorkout={() => {
              setMilestones(prev => ({
                ...prev,
                currentStreakDays: prev.currentStreakDays + 1,
                weeklyGoalCompleted: Math.min(prev.weeklyGoalCompleted + 1, prev.weeklyGoalTarget)
              }));
              setActiveTab('home');
            }}
          />
        )}

        {/* 3. 분석·통계 뷰 (AnalyticsView) */}
        {activeTab === 'analytics' && (
          <AnalyticsView milestones={milestones} />
        )}

        {/* 4. 식단 관리 뷰 (DietView): 예시 없는 공란 다이어리 */}
        {activeTab === 'diet' && (
          <DietView userProfile={userProfile} />
        )}

        {/* 5. 루틴 관리 뷰 (RoutineView): 번거로운 카드 분할 배제, 내 고정 루틴 리스트 */}
        {activeTab === 'routine' && (
          <RoutineView
            onStartRoutine={() => setActiveTab('workout')}
          />
        )}
      </main>

      {/* 하단 고정 탭 네비게이션 */}
      <BottomNav activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />

      {/* 알림 모달 */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      {/* 
        [초간편 프로필 모달]:
        - 프라이버시/마스킹 기능 완전 삭제
        - 우측 상단 프로필 아이콘 클릭 시 즉시 노출
        - 키(cm), 몸무게(kg), 골격근량(kg), 체지방률(%) 직관적 단일 폼 입력
      */}
      <SimpleProfileModal
        isOpen={isProfileOpen}
        userProfile={userProfile}
        onSave={(updated) => {
          handleUpdateProfile(updated);
          setIsProfileOpen(false);
        }}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}
