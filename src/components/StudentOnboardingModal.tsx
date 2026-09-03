import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Sparkles,
  BookOpen,
  MapPin,
  Languages,
  Target,
  ArrowRight,
  CheckCircle2,
  Smile
} from 'lucide-react';
import { StudentProfile, CEFRLevel } from '../types';
import { storageService } from '../services/storageService';
import { soundService } from '../services/soundService';
import { triggerConfetti } from './Confetti';

interface StudentOnboardingModalProps {
  isOpen: boolean;
  onSave: (profile: StudentProfile) => void;
  existingProfile?: StudentProfile;
}

export const StudentOnboardingModal: React.FC<StudentOnboardingModalProps> = ({
  isOpen,
  onSave,
  existingProfile
}) => {
  const [name, setName] = useState(existingProfile?.name || '');
  const [nativeLanguage, setNativeLanguage] = useState(existingProfile?.nativeLanguage || 'Telugu');
  const [hometown, setHometown] = useState(existingProfile?.hometown || '');
  const [college, setCollege] = useState(existingProfile?.btech?.college || '');
  const [branch, setBranch] = useState(existingProfile?.btech?.branch || 'Computer Science & Engineering (CSE)');
  const [year, setYear] = useState(existingProfile?.btech?.year || '1st Year');
  const [primaryGoal, setPrimaryGoal] = useState<string>('Campus Placement Interviews & Viva');
  const [confidence, setConfidence] = useState<number>(existingProfile?.englishConfidence || 5);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your name so the AI Teacher can address you properly!');
      soundService.playCorrection();
      return;
    }

    const updatedProfile: StudentProfile = {
      name: name.trim(),
      nativeLanguage,
      hometown: hometown.trim() || 'Andhra Pradesh',
      hasCompletedOnboarding: true,
      dailyAvailableMinutes: 20,
      englishConfidence: confidence,
      currentLevel: (confidence <= 4 ? 'A2' : confidence <= 7 ? 'B1' : 'B2') as CEFRLevel,
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      class10: existingProfile?.class10 || {},
      intermediate: existingProfile?.intermediate || {},
      btech: {
        college: college.trim() || 'Engineering College',
        branch: branch.trim(),
        year,
        semester: '1st Semester',
        favoriteSubjects: existingProfile?.btech?.favoriteSubjects || [],
        difficultSubjects: existingProfile?.btech?.difficultSubjects || [],
        programmingLanguages: existingProfile?.btech?.programmingLanguages || ['C', 'Python'],
        technicalSkills: existingProfile?.btech?.technicalSkills || [],
        projects: existingProfile?.btech?.projects || [],
        targetJobRoles: [primaryGoal]
      },
      stats: existingProfile?.stats || {
        mistakesLogged: 0,
        mistakesMastered: 0,
        vocabMastered: 0,
        interviewsCompleted: 0,
        writingTasksCompleted: 0,
        pronunciationsPracticed: 0
      }
    };

    storageService.saveProfile(updatedProfile);
    soundService.playSuccess();
    triggerConfetti();
    onSave(updatedProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white text-center space-y-2">
          <div className="w-14 h-14 rounded-3xl bg-white/15 flex items-center justify-center text-3xl mx-auto shadow-inner border border-white/20">
            🎓
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Welcome to AI English Master Teacher!
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-md mx-auto">
            Tell the teacher a little about yourself so your lessons, quizzes, interviews, and vocabulary are personalized to your goals.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-sm">
          {/* Quick Demo Profile Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="text-xs text-amber-900 dark:text-amber-200">
              <span className="font-extrabold flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Instant Demo Mode:</span>
              </span>
              <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                Test all 12 app features as Kalyan Kumar (1st-Yr CSE, VR Siddhartha, Telugu Native).
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setName('Kalyan Kumar');
                setNativeLanguage('Telugu');
                setHometown('Vijayawada, AP');
                setCollege('VR Siddhartha Engineering College');
                setBranch('Computer Science & Engineering (CSE)');
                setYear('1st Year');
                setPrimaryGoal('Campus Placement Interviews & Viva');
                setConfidence(6);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-xs transition-all active:scale-95 shrink-0"
            >
              Fill Demo Student
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs font-bold text-rose-700 dark:text-rose-300">
              {errorMsg}
            </div>
          )}

          {/* Section 1: Name & Language */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block flex items-center space-x-1">
              <User className="w-3.5 h-3.5 text-blue-500" />
              <span>1. Your Personal Identity</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  What is your name? <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrorMsg(null);
                  }}
                  placeholder="e.g. Rahul, Priya, Ananya..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mother Tongue / First Language:
                </label>
                <select
                  value={nativeLanguage}
                  onChange={(e) => setNativeLanguage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Telugu">Telugu (తెలుగు)</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                  <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                  <option value="Malayalam">Malayalam (മലയാളം)</option>
                  <option value="Bengali">Bengali (বাংলা)</option>
                  <option value="Marathi">Marathi (मराठी)</option>
                  <option value="Other">Other Language</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Hometown / City:
              </label>
              <input
                type="text"
                value={hometown}
                onChange={(e) => setHometown(e.target.value)}
                placeholder="e.g. Vijayawada, Hyderabad, Visakhapatnam..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Section 2: Education & Academic Goals */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block flex items-center space-x-1">
              <GraduationCap className="w-3.5 h-3.5 text-purple-500" />
              <span>2. Education & College Details</span>
            </span>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                College / University Name:
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. VR Siddhartha, JNTU, KL University, GITAM..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Branch / Major:
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Computer Science & Engineering (CSE)">Computer Science (CSE)</option>
                  <option value="Artificial Intelligence & Data Science (AI&DS)">AI & Data Science (AI&DS)</option>
                  <option value="Information Technology (IT)">Information Technology (IT)</option>
                  <option value="Electronics & Communication (ECE)">Electronics & Comm (ECE)</option>
                  <option value="Electrical & Electronics (EEE)">Electrical & Electronics (EEE)</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Other Degree / Diploma">Other Degree / Diploma</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Current Year:
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year (Final Year)">4th Year (Final Year)</option>
                  <option value="Graduate / Job Seeker">Graduate / Job Seeker</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Goals & Confidence */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block flex items-center space-x-1">
              <Target className="w-3.5 h-3.5 text-emerald-500" />
              <span>3. Your Fluency Goal & Starting Confidence</span>
            </span>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                What is your main goal?
              </label>
              <select
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Campus Placement Interviews & Viva">Campus Placement Interviews & Viva</option>
                <option value="Oral Fluency & Everyday English Speaking">Oral Fluency & Everyday English Speaking</option>
                <option value="Seminar Presentations & Lab Viva">Seminar Presentations & Lab Viva</option>
                <option value="Technical Email Writing & Grammar Mastery">Technical Email Writing & Grammar Mastery</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Current English Confidence:
                </label>
                <span className="text-xs font-black text-blue-600 dark:text-blue-400">
                  {confidence}/10 ({confidence <= 4 ? 'Beginner (A2)' : confidence <= 7 ? 'Intermediate (B1)' : 'Advanced (B2)'})
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={confidence}
                onChange={(e) => setConfidence(parseInt(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center space-x-2"
          >
            <span>Save My Profile & Start Learning 🚀</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
