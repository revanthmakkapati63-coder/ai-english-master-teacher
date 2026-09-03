import React, { useState } from 'react';
import {
  Sparkles,
  Share2,
  X,
  CheckCircle2,
  Phone,
  Newspaper,
  Briefcase,
  Headphones,
  PenTool,
  BookOpen,
  Bookmark,
  Languages,
  ShieldCheck,
  Gamepad2,
  Users,
  Key,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  HelpCircle,
  Film
} from 'lucide-react';
import { AppMode } from '../types';
import { triggerConfetti } from './Confetti';

interface FeatureShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (mode: AppMode) => void;
  onOpenSettings: () => void;
  onOpenExplainInMyLanguage: () => void;
  onStartVoiceCall: () => void;
  onOpenVideoHelp?: () => void;
}

export const FeatureShowcaseModal: React.FC<FeatureShowcaseModalProps> = ({
  isOpen,
  onClose,
  onSelectMode,
  onOpenSettings,
  onOpenExplainInMyLanguage,
  onStartVoiceCall,
  onOpenVideoHelp
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const features = [
    {
      id: 'mode_a',
      title: 'Mode A: Interactive English Improvement',
      desc: 'Type any sentence. Every mistake is an interactive chip. Tap for a quick fix or long-press for word cards (spelling, pronunciation audio, meaning, and mistake notebook save).',
      icon: Sparkles,
      color: 'from-blue-600 to-indigo-600',
      badge: 'Core Mode'
    },
    {
      id: 'mode_b',
      title: 'Mode B: Roman Telugu Assistant',
      desc: 'Write Telugu in English script (e.g. "meru bagunnara"). Strictly preserved in Roman Telugu with English meaning (never converted to Telugu script) to train English thinking.',
      icon: Languages,
      color: 'from-amber-600 to-orange-600',
      badge: 'Bilingual'
    },
    {
      id: 'mode_c',
      title: 'Mode C: Master Teacher Chat Coach',
      desc: 'Conversational English tutor with gradual onboarding, voice mic input, speech playback, and commands like /lesson, /quiz, /vocab, /speaking, /interview, /progress.',
      icon: MessageSquare,
      color: 'from-blue-700 to-indigo-800',
      badge: 'AI Coach'
    },
    {
      id: 'call',
      title: '📞 Hands-Free Live Voice Call',
      desc: 'Have a real phone conversation with the AI Teacher! Teacher speaks out loud, automatically listens to your voice hands-free, transcribes speech, and corrects Telugu slips on the fly.',
      icon: Phone,
      color: 'from-blue-600 to-emerald-600',
      badge: 'Live Voice',
      action: onStartVoiceCall
    },
    {
      id: 'newspaper',
      title: '📸 Newspaper Photo Reader & GK Coach',
      desc: 'Take a photo of an English newspaper (The Hindu/Times of India) using your camera! It extracts text via AI OCR, lets you read aloud into the mic, corrects pronunciation, and gives Telugu explanations.',
      icon: Newspaper,
      color: 'from-cyan-600 to-teal-700',
      badge: 'Camera & OCR'
    },
    {
      id: 'interview',
      title: '💼 B.Tech Mock Interview Simulator',
      desc: '1-by-1 realistic interviews (HR, Technical, Internship, Placement). Generates an 8-criteria report (/10 scores) with Strengths, Weaknesses, Model Answers, and a Retry progress tracker.',
      icon: Briefcase,
      color: 'from-emerald-600 to-teal-700',
      badge: 'Placement'
    },
    {
      id: 'pronunciation',
      title: '🎧 Pronunciation & Syllable Trainer',
      desc: 'Master tricky words (Entrepreneur, Hierarchy, Architecture, Colleague) with syllable stress guides, slow 0.7x audio playback, and a live microphone pronunciation test.',
      icon: Headphones,
      color: 'from-sky-600 to-blue-700',
      badge: 'Voice Lab'
    },
    {
      id: 'writing',
      title: '✍️ Writing Practice & Rewrite Comparison',
      desc: 'Practice college leave emails, technical seminar scripts, and exam answers. Compare Attempt 1 vs Attempt 2 to see measurable score gains.',
      icon: PenTool,
      color: 'from-rose-600 to-pink-700',
      badge: 'Writing'
    },
    {
      id: 'game',
      title: '🎮 Sentence Builder & Telugu Trap Game',
      desc: 'Gamified puzzle where you tap word blocks in sequence to form sentences while dodging common Telugu translation traps. Earn XP and streaks!',
      icon: Gamepad2,
      color: 'from-purple-600 to-violet-700',
      badge: 'Gamified'
    },
    {
      id: 'roleplay',
      title: '🎭 B.Tech Campus Roleplay Studio',
      desc: 'Practice realistic college dialogues: explaining code bugs to lab professors or asking 4th-year seniors for campus placement advice.',
      icon: Users,
      color: 'from-pink-600 to-rose-600',
      badge: 'Dialogue'
    },
    {
      id: 'explain',
      title: '🗣️ Tell in My Language / నా భాషలో వివరణ',
      desc: 'Don’t understand something? Ask the AI anytime to explain in Telugu (తెలుగు), Hindi, Tamil, or Kannada with Roman transliteration and native speech audio!',
      icon: Languages,
      color: 'from-teal-600 to-emerald-600',
      badge: 'Bilingual',
      action: onOpenExplainInMyLanguage
    },
    {
      id: 'permissions',
      title: '🔐 1-Click Permissions Center',
      desc: 'One-click authorization for Microphone and Camera access so voice speech recognition and camera photo OCR work seamlessly without browser popups.',
      icon: ShieldCheck,
      color: 'from-emerald-700 to-teal-800',
      badge: 'System'
    }
  ];

  // Formatted WhatsApp message for sharing
  const handleShareToWhatsApp = () => {
    triggerConfetti();
    const shareMessage = `🎓 *AI English Master Teacher - B.Tech Fluency Coach* 🚀
_Designed for students transitioning from Telugu thinking to fluent English!_

✨ *Complete App Features:*
1️⃣ *Mode A - English Improvement:* Tap any mistake chip for spelling, pronunciation & word learning cards!
2️⃣ *Mode B - Roman Telugu Assistant:* Keeps Roman Telugu intact and teaches natural English phrasing!
3️⃣ *Mode C - Master Teacher Coach:* Interactive teacher chat with commands (/lesson, /quiz, /vocab, /speaking).
4️⃣ *Live Voice Phone Call:* Hands-free 1-on-1 voice conversation with the AI Teacher!
5️⃣ *Newspaper Photo Reader & GK:* Snap a photo of The Hindu, read aloud into the mic, and get pronunciation scoring & Telugu explanations!
6️⃣ *Mock Interview Simulator:* 8-rubric scoring & retry tracker for campus placements!
7️⃣ *Pronunciation Trainer:* Syllable stress & slow audio for tricky engineering words!
8️⃣ *Sentence Builder Game:* Tap word blocks & dodge Telugu translation traps!
9️⃣ *Campus Roleplay Studio:* Practice talking to lab professors and placed seniors!
🔟 *Tell in Telugu (నా భాషలో చెప్పండి):* Instant bilingual explanations with native voice!

👉 Access the application: http://localhost:3000/`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyShareText = () => {
    const text = `🎓 AI English Master Teacher - B.Tech Fluency Coach\nCheck out all features: http://localhost:3000/`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 sm:px-8 py-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">
              <span>🌟 App Feature Showcase & Tour</span>
              <span className="px-2 py-0.5 rounded-full bg-white/20">All 12 Features</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              What Can This AI English Teacher Do?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl mt-1">
              Built specifically for 1st-year B.Tech students in Vijayawada transitioning from Telugu thinking to confident English thinking!
            </p>
          </div>

          {/* Quick Actions: Share to WhatsApp & Close */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleShareToWhatsApp}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
              title="Share app features directly to WhatsApp"
            >
              <Share2 className="w-4 h-4" />
              <span>Share to WhatsApp</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Interactive Video Walkthrough Banner */}
        <div className="px-6 py-3 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-b border-purple-800/80">
          <div className="flex items-center space-x-2 text-purple-200">
            <Film className="w-4 h-4 text-purple-300 shrink-0" />
            <span>
              <strong>New: 4-Minute Interactive Video Walkthrough & 25+ Pro Tips!</strong> Watch demo student Kalyan Kumar explore every feature with audio narration.
            </span>
          </div>
          <button
            onClick={() => {
              onClose();
              if (onOpenVideoHelp) onOpenVideoHelp();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-black text-xs shadow-md transition-all active:scale-95 shrink-0"
          >
            ▶️ Watch Video Guide
          </button>
        </div>

        {/* API Key Quick Help Callout Banner */}
        <div className="px-6 py-3 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-200">
            <Key className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Where to insert the API key?</strong> The app works 100% free with the built-in smart engine! To add your OpenRouter, Gemini, or OpenAI key:
            </span>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenSettings();
            }}
            className="text-blue-600 dark:text-blue-400 font-bold underline shrink-0 hover:text-blue-700"
          >
            Open API Settings Modal →
          </button>
        </div>

        {/* Features Grid */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.id}
                  className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-md space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-9 h-9 rounded-2xl bg-gradient-to-tr ${f.color} text-white flex items-center justify-center shadow-sm`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                          {f.title}
                        </h3>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold uppercase">
                        {f.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        onClose();
                        if (f.action) {
                          f.action();
                        } else {
                          onSelectMode(f.id as AppMode);
                        }
                      }}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
                    >
                      <span>Try Feature Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 sm:px-8 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShareToWhatsApp}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>Share App on WhatsApp</span>
            </button>
            <button
              onClick={handleCopyShareText}
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              {copiedLink ? 'Copied to Clipboard!' : 'Copy Summary Link'}
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
          >
            Start Learning Now →
          </button>
        </div>
      </div>
    </div>
  );
};
