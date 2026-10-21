/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { LandingView } from './components/landing/LandingView';
import { TeacherLogin } from './components/teacher/TeacherLogin';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { FacialRecognitionModal } from './components/student/FacialRecognitionModal';
import { StudentHome } from './components/student/StudentHome';
import { FloatingAudioNarrator } from './components/common/FloatingAudioNarrator';

const MainAppContent: React.FC = () => {
  const { viewMode } = useAuth();
  const [teacherTab, setTeacherTab] = useState<string>('dashboard');
  const [studentTab, setStudentTab] = useState<string>('home');

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F8FF] text-[#173B70]">
      {/* Top Bar adhering to the Universal 3-zone contract */}
      <Header
        currentTab={viewMode === 'teacher_app' ? teacherTab : studentTab}
        onTabChange={(tab) => {
          if (viewMode === 'teacher_app') setTeacherTab(tab);
          if (viewMode === 'student_app') setStudentTab(tab);
        }}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {viewMode === 'landing' && <LandingView />}
        {viewMode === 'teacher_login' && <TeacherLogin />}
        {viewMode === 'teacher_app' && (
          <TeacherDashboard
            currentTab={teacherTab}
            onTabChange={(tab) => setTeacherTab(tab)}
          />
        )}
        {viewMode === 'student_auth' && <FacialRecognitionModal />}
        {viewMode === 'student_app' && <StudentHome currentTab={studentTab} />}
      </main>

      {/* Persistent Accessible Audio Reader for Students with Reading Difficulties */}
      <FloatingAudioNarrator />
    </div>
  );
};

export default function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </AccessibilityProvider>
  );
}
