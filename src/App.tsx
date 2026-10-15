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
import { ProfileEditModal } from './components/ProfileEditModal.tsx'; // 신체 스펙 간편 수정 모달

// 5대 탭 뷰 (홈 심플화, 루틴 반복 다이어리, AI 제거, 식단 기록, 마일스톤 반영)
import { HomeView } from './views/HomeView.tsx';
import { WorkoutView } from './views/WorkoutView.tsx';
import { AnalyticsView } from './views/AnalyticsView.tsx';
import { DietView } from './views/DietView.tsx';
import { RoutineView } from './views/RoutineView.tsx';

// 사용자 프로필 및 신체 스펙 타입
export interface UserProfile {
  gender: 'male' | 'female';
  height: number; // cm
  weight: number; // kg
  skeletalMuscle: number; // kg
  bodyFatPercentage: number; // %
  bmr: number; // 기초대사량 (자동 계산 레퍼런스)
  tdee: number; // 유지 칼로리
  dailyProteinGoal: number; // 단백질 섭취 목표 (g)
  isPrivateMasked: boolean; // 프라이버시 마스킹 여부
  lastInBodySyncDate?: string; // 인바디 연동 일자
}

// 마일스톤 및 꾸준함 달성 기록 타입
export interface MilestoneStreak {
  currentStreakDays: number;
  weeklyGoalCompleted: number;
  weeklyGoalTarget: number;
  totalVolumeMonthKg: number;
  totalRecordedDaysMonth: number;
  recentMilestoneBadge: string; // 예: "5일 연속 출석 달성", "누적 볼륨 40,000kg 돌파"
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);

  // 1. 사용자 신체 프로필 상태 (이메일 배제, 직접 간편 수정 및 레퍼런스 기준)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    gender: 'male',
    height: 178,
    weight: 74.5,
    skeletalMuscle: 36.2,
    bodyFatPercentage: 14.8,
    bmr: 1740,
    tdee: 2520,
    dailyProteinGoal: 160,
    isPrivateMasked: false,
    lastInBodySyncDate: '3일 전 자동 동기화'
  });

  // 2. 마일스톤 & 운동 연속 달성(Streak) 상태 (꾸준함 동기부여)
  const [milestones, setMilestones] = useState<MilestoneStreak>({
    currentStreakDays: 5,
    weeklyGoalCompleted: 3,
    weeklyGoalTarget: 4,
    totalVolumeMonthKg: 42850,
    totalRecordedDaysMonth: 14,
    recentMilestoneBadge: '5일 연속 달성 (상위 15%)'
  });

  // URL 쿼리 파라미터 기반 탭 동기화
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as TabType;
    if (tabParam && ['home', 'workout', 'analytics', 'diet', 'routine'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  // 신체 스펙 업데이트 핸들러 (BMR, 유지칼로리 자동 레퍼런스 동기화)
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const next = { ...prev, ...updated };
      // Mifflin-St Jeor 간이 레퍼런스 계산 (AI 추천이 아닌 사용자 입력 기반 공식)
      const calculatedBmr = Math.round(
        10 * next.weight + 6.25 * next.height - 5 * 28 + (next.gender === 'male' ? 5 : -161)
      );
      const calculatedTdee = Math.round(calculatedBmr * 1.45); // 보통 활동량 기준
      return {
        ...next,
        bmr: calculatedBmr,
        tdee: calculatedTdee
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#0f131d] text-white flex flex-col">
      {/* 
        [상단 헤더]:
        - 불필요한 계정/이메일 배제
        - 미니멀 로고(IronLog), 알림, 프로필 간편 수정 진입 버튼 
      */}
      <Header
        activeTab={activeTab}
        userProfile={userProfile}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenProfile={() => setIsProfileEditOpen(true)}
      />

      {/* 메인 뷰 컨테이너 */}
      <main className="flex flex-col relative w-full pt-16 pb-28 px-4 bg-[#0f131d] flex-1 max-w-lg mx-auto">
        {/* 
          1. 홈 뷰 (HomeView):
          - 피로도 최소화 / 미니멀한 구성
          - 야외 산스장 실시간 날씨 및 기온
          - 시의적절한 오늘의 동기부여 문구
          - 마일스톤 & 연속 달성(Streak) 배지
          - 내가 정한 오늘의 고정 루틴 바로 시작 (원터치 CTA)
        */}
        {activeTab === 'home' && (
          <HomeView
            milestones={milestones}
            onStartRoutine={() => setActiveTab('workout')}
            onGoToRoutine={() => setActiveTab('routine')}
            onOpenProfileEdit={() => setIsProfileEditOpen(true)}
          />
        )}

        {/* 
          2. 운동 기록 뷰 (WorkoutView):
          - 세트/중량/횟수/휴식 타이머 직관적 다이어리 기록
          - 지난 기록과 즉시 비교 가능한 담백한 입력창
        */}
        {activeTab === 'workout' && (
          <WorkoutView
            onCompleteWorkout={() => {
              // 마일스톤 업데이트 트리거
              setMilestones(prev => ({
                ...prev,
                currentStreakDays: prev.currentStreakDays + 1,
                weeklyGoalCompleted: Math.min(prev.weeklyGoalCompleted + 1, prev.weeklyGoalTarget),
                totalRecordedDaysMonth: prev.totalRecordedDaysMonth + 1
              }));
              setActiveTab('routine');
            }}
            onGoToAnalytics={() => setActiveTab('analytics')}
          />
        )}

        {/* 
          3. 분석·통계 뷰 (AnalyticsView):
          - 주차별 기록표, 총 볼륨 추이, 꾸준함 마일스톤 리포트
        */}
        {activeTab === 'analytics' &&