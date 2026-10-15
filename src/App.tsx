/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TabType } from './types/fitness.ts';
import { Header } from './components/Header.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { NotificationModal } from './components/NotificationModal.tsx';
import { ProfileModal } from './components/ProfileModal.tsx';

import { HomeView } from './views/HomeView.tsx';
import { WorkoutView } from './views/WorkoutView.tsx';
import { AnalyticsView } from './views/AnalyticsView.tsx';
import { DietView } from './views/DietView.tsx';
import { RoutineView } from './views/RoutineView.tsx';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Check URL query parameters for default tab or autostart
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as TabType;
    if (tabParam && ['home', 'workout', 'analytics', 'diet', 'routine'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  return (
    <div className="bg-[#0f131d] text-[#dfe2f1] min-h-screen flex flex-col antialiased selection:bg-[#ccff80] selection:text-[#0f131d]">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex flex-col relative w-full pt-20 pb-28 px-4 bg-[#0f131d] flex-1 max-w-lg mx-auto">
        {activeTab === 'home' && (
          <HomeView
            onStartRoutine={() => setActiveTab('workout')}
            onGoToAnalytics={() => setActiveTab('analytics')}
            onGoToRoutine={() => setActiveTab('routine')}
          />
        )}

        {activeTab === 'workout' && (
          <WorkoutView
            onGoToAnalytics={() => setActiveTab('analytics')}
          />
        )}

        {activeTab === 'analytics' && <AnalyticsView />}

        {activeTab === 'diet' && <DietView />}

        {activeTab === 'routine' && (
          <RoutineView
            onStartRoutine={() => setActiveTab('workout')}
            onGoToAnalytics={() => setActiveTab('analytics')}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />

      {/* Global Modals */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}
