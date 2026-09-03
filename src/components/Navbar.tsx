import React from 'react';
import {
  GraduationCap,
  Sparkles,
  Languages,
  MessageSquare,
  Briefcase,
  Headphones,
  PenTool,
  BookOpen,
  Bookmark,
  Presentation,
  Flame,
  Settings,
  User,
  Volume2,
  Newspaper,
  ShieldCheck,
  Phone,
  Gamepad2,
  Users,
  Share2,
  Key,
  Smartphone,
  Star,
  Film
} from 'lucide-react';
import { AppMode, StudentProfile } from '../types';

interface NavbarProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  profile: StudentProfile;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenExplainInMyLanguage?: () => void;
  onOpenPermissions?: () => void;
  onStartVoiceCall?: () => void;
  onOpenFeaturesTour?: () => void;
  onOpenAndroidShare?: () => void;
  onOpenReview?: () => void;
  onOpenVideoHelp?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  profile,
  onOpenProfile,
  onOpenSettings,
  onOpenExplainInMyLanguage,
  onOpenPermissions,
  onStartVoiceCall,
  onOpenFeaturesTour,
  onOpenAndroidShare,
  onOpenReview,
  onOpenVideoHelp
}) => {
  const navItems: { id: AppMode; label: string; icon: any; badge?: string }[] = [
    { id: 'mode_a', label: 'Mode A: Improve', icon: Sparkles },
    { id: 'mode_b', label: 'Mode B: Roman Telugu', icon: Languages },
    { id: 'mode_c', label: 'Mode C: Teacher', icon: MessageSquare, badge: 'Core' },
    { id: 'interview', label: 'Mock Interview', icon: Briefcase },
    { id: 'pronunciation', label: 'Pronunciation', icon: Headphones },
    { id: 'writing', label: 'Writing & Rewrite', icon: PenTool },
    { id: 'vocab', label: 'B.Tech Vocab', icon: BookOpen },
    { id: 'mistakes', label: 'Mistake Notebook', icon: Bookmark },
    { id: 'presentation', label: 'Presentation & Exam', icon: Presentation },
    { id: 'newspaper', label: '📸 Newspaper GK', icon: Newspaper, badge: 'GK' },
    { id: 'game', label: '🎮 Sentence Game', icon: Gamepad2, badge: 'Fun' },
    { id: 'roleplay', label: '🎭 Campus Roleplay', icon: Users, badge: 'Live' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Branding & Status Row */}
        <div className="flex items-center justify-between h-16">
          {/* Logo & Student Info */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onOpenProfile}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 font-black text-lg">
              🎓
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-slate-900 dark:text-slate-100 text-base sm:text-lg tracking-tight">
                  AI ENGLISH MASTER TEACHER
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold uppercase hidden sm:inline">
                  B.Tech Edition
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personal Fluency Coach for {profile.name} • Vijayawada, AP
              </p>
            </div>
          </div>

          {/* Right Status Badges & Controls */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* Live Voice Call Button */}
            {onStartVoiceCall && (
              <button
                onClick={onStartVoiceCall}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95 animate-pulse"
                title="Start a real-time hands-free voice call with your English teacher"
              >
                <Phone className="w-3.5 h-3.5 fill-current" />
                <span>Live Call</span>
              </button>
            )}

            {/* Tell in My Language Button */}
            {onOpenExplainInMyLanguage && (
              <button
                onClick={onOpenExplainInMyLanguage}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold text-xs shadow-xs transition-all active:scale-95"
                title="Ask AI to explain anything in Telugu or your own language"
              >
                <Languages className="w-3.5 h-3.5" />
                <span className="hidden md:inline">నా భాషలో (Tell in Telugu)</span>
                <span className="md:hidden">తెలుగు</span>
              </button>
            )}

            {/* Features Tour Button */}
            {onOpenFeaturesTour && (
              <button
                onClick={onOpenFeaturesTour}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800 text-xs font-bold transition-all"
                title="View all 12 app features and guide"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span className="hidden sm:inline">Tour</span>
              </button>
            )}

            {/* Help & Video Guide Button */}
            {onOpenVideoHelp && (
              <button
                onClick={onOpenVideoHelp}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs shadow-md shadow-purple-500/20 transition-all active:scale-95"
                title="Watch Video Walkthrough & 25+ Pro Tips"
              >
                <Film className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">🎥 Video & Help</span>
                <span className="sm:hidden">Video</span>
              </button>
            )}

            {/* Android App Install & Share Button */}
            {onOpenAndroidShare && (
              <button
                onClick={onOpenAndroidShare}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                title="Install and share this app on Android phone"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Android App</span>
              </button>
            )}

            {/* Review Button */}
            {onOpenReview && (
              <button
                onClick={onOpenReview}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                title="Rate and submit review via WhatsApp"
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="hidden md:inline">Review</span>
              </button>
            )}

            {/* WhatsApp Share Button */}
            <button
              onClick={() => {
                const shareText = `🎓 *AI English Master Teacher - B.Tech Fluency Coach* 🚀\nDesigned for students transitioning from Telugu thinking to confident English!\n\n✨ Try all 12 features (Live Voice Call, Newspaper Photo OCR & Oral Reading, Mock Interviews, Sentence Game, Tell in Telugu):\n👉 http://localhost:3000/`;
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
              }}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
              title="Share app to WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            {/* API Key Shortcut Button */}
            <button
              onClick={onOpenSettings}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 text-xs font-bold transition-all"
              title="Insert or configure API Key (OpenRouter, Gemini, OpenAI)"
            >
              <Key className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden lg:inline">API Key</span>
            </button>

            {/* Permissions Button */}
            {onOpenPermissions && (
              <button
                onClick={onOpenPermissions}
                className="hidden xl:flex items-center space-x-1 px-2.5 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold transition-colors"
                title="Browser Permissions (Microphone & Camera)"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Permissions</span>
              </button>
            )}

            {/* Streak */}
            <div
              onClick={onOpenProfile}
              className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900 cursor-pointer hover:scale-105 transition-transform"
              title="Daily Active Learning Streak"
            >
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span className="font-bold text-xs">{profile.streakDays}d Streak</span>
            </div>

            {/* Profile Button */}
            <button
              onClick={onOpenProfile}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Student Profile & Background"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="AI Engines & Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center space-x-1 overflow-x-auto py-2.5 no-scrollbar border-t border-slate-100 dark:border-slate-800/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectMode(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 relative ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                    isActive ? 'bg-white/25 text-white' : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
