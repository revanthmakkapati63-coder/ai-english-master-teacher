import React, { useState, useEffect } from 'react';
import { AppMode, StudentProfile } from './types';
import { storageService, AppSettings } from './services/storageService';
import { Navbar } from './components/Navbar';
import { ModeAImprovement } from './components/ModeAImprovement';
import { ModeBRomanTelugu } from './components/ModeBRomanTelugu';
import { ModeCTeacher } from './components/ModeCTeacher';
import { MockInterview } from './components/MockInterview';
import { PronunciationTrainer } from './components/PronunciationTrainer';
import { WritingPractice } from './components/WritingPractice';
import { VocabularyHub } from './components/VocabularyHub';
import { MistakeNotebook } from './components/MistakeNotebook';
import { PresentationTrainer } from './components/PresentationTrainer';
import { NewspaperReader } from './components/NewspaperReader';
import { StudentProfileModal } from './components/StudentProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { ExplainInMyLanguageModal } from './components/ExplainInMyLanguageModal';
import { PermissionsManagerModal } from './components/PermissionsManagerModal';
import { ExplainInMyLanguageFloating } from './components/ExplainInMyLanguageFloating';
import { LiveVoiceCallModal } from './components/LiveVoiceCallModal';
import { SentenceBuilderGame } from './components/SentenceBuilderGame';
import { RoleplayStudio } from './components/RoleplayStudio';
import { FeatureShowcaseModal } from './components/FeatureShowcaseModal';
import { AndroidShareModal } from './components/AndroidShareModal';
import { ReviewModal } from './components/ReviewModal';
import { StudentOnboardingModal } from './components/StudentOnboardingModal';

export const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<AppMode>('mode_c');
  const [profile, setProfile] = useState<StudentProfile>(() => storageService.getProfile());
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState<'video' | 'tricks' | 'ai'>('video');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => !profile.name || !profile.hasCompletedOnboarding);
  const [isExplainOpen, setIsExplainOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [explainInitialQuery, setExplainInitialQuery] = useState('');

  // Show Feature Showcase tour on first start
  useEffect(() => {
    const shown = localStorage.getItem('agy_tour_shown');
    if (!shown) {
      setIsTourOpen(true);
      localStorage.setItem('agy_tour_shown', 'true');
    }
  }, []);

  // Update last active date & streak check
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (profile.lastActiveDate !== today) {
      const updated = {
        ...profile,
        lastActiveDate: today,
        streakDays: profile.streakDays + 1
      };
      setProfile(updated);
      storageService.saveProfile(updated);
    }
  }, []);

  const handleLoadDemoStudent = () => {
    const demo = storageService.loadDemoProfile();
    setProfile(demo);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={(mode) => setCurrentMode(mode)}
        profile={profile}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSettings={() => {
          setSettingsInitialTab('ai');
          setIsSettingsOpen(true);
        }}
        onOpenVideoHelp={() => {
          setSettingsInitialTab('video');
          setIsSettingsOpen(true);
        }}
        onOpenExplainInMyLanguage={() => {
          setExplainInitialQuery('');
          setIsExplainOpen(true);
        }}
        onOpenPermissions={() => setIsPermissionsOpen(true)}
        onStartVoiceCall={() => setIsCallModalOpen(true)}
        onOpenFeaturesTour={() => setIsTourOpen(true)}
        onOpenAndroidShare={() => setIsAndroidModalOpen(true)}
        onOpenReview={() => setIsReviewModalOpen(true)}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentMode === 'mode_a' && <ModeAImprovement profile={profile} />}
        {currentMode === 'mode_b' && <ModeBRomanTelugu />}
        {currentMode === 'mode_c' && (
          <ModeCTeacher
            profile={profile}
            onNavigateToTab={(tab) => setCurrentMode(tab as AppMode)}
            onStartVoiceCall={() => setIsCallModalOpen(true)}
          />
        )}
        {currentMode === 'interview' && <MockInterview profile={profile} />}
        {currentMode === 'pronunciation' && <PronunciationTrainer />}
        {currentMode === 'writing' && <WritingPractice />}
        {currentMode === 'vocab' && <VocabularyHub />}
        {currentMode === 'mistakes' && <MistakeNotebook />}
        {currentMode === 'presentation' && <PresentationTrainer />}
        {currentMode === 'newspaper' && <NewspaperReader />}
        {currentMode === 'game' && <SentenceBuilderGame />}
        {currentMode === 'roleplay' && <RoleplayStudio />}
      </main>

      {/* Floating Action Button for Instant Mother Tongue / Telugu Explanation */}
      <ExplainInMyLanguageFloating
        onOpenExplain={() => {
          setExplainInitialQuery('');
          setIsExplainOpen(true);
        }}
        onOpenPermissions={() => setIsPermissionsOpen(true)}
      />

      {/* Footer with Pedagogical Golden Rule */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-6 bg-white dark:bg-slate-900/60 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              AI English Master Teacher
            </span>{' '}
            • Designed for B.Tech students transitioning from Telugu thinking to fluent English thinking.
          </div>
          <div className="text-[11px] italic text-slate-400">
            Golden Rule: "Teach the student. Challenge the student. Gradually make the student independent."
          </div>
        </div>
      </footer>

      {/* Modals */}
      <StudentOnboardingModal
        isOpen={isOnboardingOpen}
        existingProfile={profile}
        onSave={(updated) => {
          setProfile(updated);
          setIsOnboardingOpen(false);
        }}
      />

      <StudentProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onUpdateProfile={(updated) => setProfile(updated)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialTab={settingsInitialTab}
        onSettingsSaved={() => setProfile(storageService.getProfile())}
        onSelectFeature={(mode) => setCurrentMode(mode)}
        onOpenVoiceCall={() => setIsCallModalOpen(true)}
        onOpenExplain={() => {
          setExplainInitialQuery('');
          setIsExplainOpen(true);
        }}
        onLoadDemoStudent={handleLoadDemoStudent}
        studentName={profile.name || 'Kalyan Kumar'}
      />

      <ExplainInMyLanguageModal
        isOpen={isExplainOpen}
        onClose={() => setIsExplainOpen(false)}
        initialQuery={explainInitialQuery}
        profile={profile}
      />

      <PermissionsManagerModal
        isOpen={isPermissionsOpen}
        onClose={() => setIsPermissionsOpen(false)}
      />

      <LiveVoiceCallModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        profile={profile}
      />

      <FeatureShowcaseModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onSelectMode={(mode) => setCurrentMode(mode)}
        onOpenSettings={() => {
          setSettingsInitialTab('ai');
          setIsSettingsOpen(true);
        }}
        onOpenVideoHelp={() => {
          setSettingsInitialTab('video');
          setIsSettingsOpen(true);
        }}
        onOpenExplainInMyLanguage={() => {
          setExplainInitialQuery('');
          setIsExplainOpen(true);
        }}
        onStartVoiceCall={() => setIsCallModalOpen(true)}
      />

      <AndroidShareModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
        onOpenReview={() => setIsReviewModalOpen(true)}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        profile={profile}
      />
    </div>
  );
};

export default App;
