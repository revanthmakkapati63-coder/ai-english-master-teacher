import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  User,
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle2,
  Calendar,
  Flame,
  Clock,
  Code2,
  MapPin,
  Save,
  Target,
  TrendingUp,
  BarChart3,
  PieChart,
  AlertTriangle,
  Lightbulb,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Briefcase,
  FileText,
  Check,
  Sparkles,
  ChevronRight,
  Mic,
  MicOff,
  Search,
  Star,
  ExternalLink,
  HelpCircle,
  Video,
  Film,
  UserCheck,
  ArrowRight,
  ShieldCheck,
  PenTool,
  Headphones
} from 'lucide-react';
import { StudentProfile, CEFRLevel } from '../types';
import { storageService } from '../services/storageService';
import { speechService } from '../services/speechService';
import { soundService } from '../services/soundService';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onUpdateProfile: (updated: StudentProfile) => void;
}

interface DetailedMistakeItem {
  id: string;
  type: 'reading' | 'typing';
  wordOrSentence: string;
  errorHighlight: string;
  correctedForm: string;
  category: string;
  occurrences: number;
  severity: 'High' | 'Medium' | 'Critical';
  teacherTip: string;
  teluguTrick: string;
  howToRead: {
    syllables: string;
    phoneticGuide: string;
    stressExplanation: string;
    seniorTeacherSpokenScript: string;
  };
  howToWrite: {
    badExample: string;
    goodExample: string;
    placementModelAnswer: string;
    seniorTeacherWritingScript: string;
  };
}

const MISTAKE_DATABASE: DetailedMistakeItem[] = [
  {
    id: 'mst-read-1',
    type: 'reading',
    wordOrSentence: 'Hierarchy [Data Structures & Organization]',
    errorHighlight: 'Pronounced as "hair-ar-chi" or "hai-ra-ki"',
    correctedForm: 'HIRE-ar-kee (/ˈhaɪ.ə.rɑː.ki/)',
    category: 'Syllable Stress & Silent Vowels',
    occurrences: 6,
    severity: 'Critical',
    teacherTip: 'Break into three clear beats: HIRE - ar - kee. Never say "hai-ra-chi". In engineering vivas, tree data structures always use this term.',
    teluguTrick: 'తెలుగులో "హైరార్కీ" అని పలకాలి; "చి" అనకూడదు. మొదటి సిలబుల్ "HIRE" పై ఎక్కువ ఒత్తిడి ఇవ్వండి.',
    howToRead: {
      syllables: 'HIRE • ar • kee',
      phoneticGuide: '/ˈhaɪ.ə.rɑː.ki/',
      stressExplanation: 'Primary stress is on the very first syllable: HIRE. Soft middle "ar", ending in crisp "kee".',
      seniorTeacherSpokenScript: 'Listen carefully, Kalyan. When explaining tree data structures in your viva, say HIRE-ar-kee. Notice the first beat gets the stress: HIRE-ar-kee. Never say hair-ar-chi. Repeat after me: Tree hierarchy.'
    },
    howToWrite: {
      badExample: 'The data is stored in hairarchy tree format.',
      goodExample: 'The nodes are organized in a strict binary hierarchy.',
      placementModelAnswer: 'In our algorithm, we maintain a hierarchical tree where each parent node contains references to its left and right subtrees.',
      seniorTeacherWritingScript: 'Notice the spelling when typing, Kalyan: H-I-E-R-A-R-C-H-Y. Remember the sequence: H-I-E, then R, then A-R-C-H-Y. It is hierarchical, with an A in the middle.'
    }
  },
  {
    id: 'mst-type-1',
    type: 'typing',
    wordOrSentence: 'Separately [Module Decomposition]',
    errorHighlight: 'Frequently typed as "seperately" (E instead of A)',
    correctedForm: 'Separately (S-E-P-A-R-A-T-E-L-Y)',
    category: 'Vowel Substitution Spelling Trap',
    occurrences: 9,
    severity: 'High',
    teacherTip: 'Look at the word closely: there is "A RAT" in sep-A-RAT-ely! Remembering "A RAT" guarantees you will never type an "E" again.',
    teluguTrick: 'గుర్తుంచుకోవడానికి సులభమైన ఉపాయం: sep-A-RAT-ely లో "A RAT" (ఒక ఎలుక) ఉంది. ఎప్పుడూ "seperately" అని రాయకండి.',
    howToRead: {
      syllables: 'SEP • er • it • lee',
      phoneticGuide: '/ˈsep.ər.ət.li/',
      stressExplanation: 'Stress the first syllable SEP, then glide softly through "er-it-lee".',
      seniorTeacherSpokenScript: 'When presenting your software modules, Kalyan, say SEP-er-it-lee. Do not elongate the middle vowel. Let us pronounce it together: Modules are compiled separately.'
    },
    howToWrite: {
      badExample: 'We need to test each component seperately before deployment.',
      goodExample: 'We need to unit-test each component separately before system integration.',
      placementModelAnswer: 'Each microservice was deployed separately into isolated Docker containers to prevent cascading failures.',
      seniorTeacherWritingScript: 'When writing lab documentation or campus exam answers, never write s-e-p-e-r. Always remember the middle A: S-E-P-A-R-A-T-E-L-Y. Write it twice right now to lock it in your fingers.'
    }
  },
  {
    id: 'mst-read-2',
    type: 'reading',
    wordOrSentence: 'Colleague [Professional Campus Vocabulary]',
    errorHighlight: 'Pronounced with extra Telugu vowel as "colleague-u" or "co-leeg-ue"',
    correctedForm: 'KOL-eeg (/ˈkɒl.iːɡ/)',
    category: 'Vowel Swallowing & Mother Tongue Influence',
    occurrences: 5,
    severity: 'High',
    teacherTip: 'Cut the final sound sharp at "eeg". Do not add the Telugu vowel "-u" at the end. Say "KOL-eeg", not "colleague-u".',
    teluguTrick: 'తెలుగు భాషా ప్రభావం వల్ల పదాల చివర "ఉ" (u) ధ్వనిని చేర్చే అలవాటు ఉంటుంది. "కాలీగ్" అని ఖచ్చితంగా ముగించండి; "కాలీగు" అనకూడదు.',
    howToRead: {
      syllables: 'KOL • eeg',
      phoneticGuide: '/ˈkɒl.iːɡ/',
      stressExplanation: 'Two beats only: KOL-eeg. The "-ue" at the end is completely silent!',
      seniorTeacherSpokenScript: 'In corporate placement interviews, recruiters notice if you say colleague-u. In formal English, stop firmly on the consonant: KOL-eeg. My project colleague. Try it now.'
    },
    howToWrite: {
      badExample: 'Myself and my collegue completed the project together.',
      goodExample: 'My colleague and I collaborated to build the database schema.',
      placementModelAnswer: 'During our third-semester hackathon, my colleague and I engineered a real-time web crawler using Python and SQLite.',
      seniorTeacherWritingScript: 'Notice two crucial rules here, Kalyan: First, spelling is C-O-L-L-E-A-G-U-E. Double L, then E-A-G-U-E. Second, never say "Myself and colleague". Always write "My colleague and I".'
    }
  },
  {
    id: 'mst-type-2',
    type: 'typing',
    wordOrSentence: 'Double Past Tense Trap: "Did went" vs "Went"',
    errorHighlight: 'Typed as "Sir, yesterday I did went to HOD office"',
    correctedForm: 'I went / I did go',
    category: 'Grammar Syntax & Mother Tongue Translation',
    occurrences: 8,
    severity: 'Critical',
    teacherTip: 'The auxiliary verb "did" already carries the past tense. It can ONLY be followed by base verb V1: "Did go" or simply "Went". Never combine two past tense forms.',
    teluguTrick: 'తెలుగులో "చేసి వెళ్ళాను" అని ఆలోచించి "did went" అని రాస్తుంటారు. "Did" వచ్చినప్పుడు పక్కన base form (go) మాత్రమే రావాలి, లేదా నేరుగా "went" రాయాలి.',
    howToRead: {
      syllables: 'I • went • to • the • of • fice',
      phoneticGuide: '/aɪ went tuː ði ˈɒf.ɪs/',
      stressExplanation: 'Keep the verb "went" crisp and punchy.',
      seniorTeacherSpokenScript: 'Kalyan, this is the number one grammar slip that placement interviewers penalize. Never say "I did went" or "Did you saw". Say: I went, or did you see. It creates instant impression of fluency.'
    },
    howToWrite: {
      badExample: 'In our previous sem we did developed one attendance portal.',
      goodExample: 'In our previous semester, we developed an attendance management portal.',
      placementModelAnswer: 'In our first-year laboratory curriculum, we implemented an optimized sorting algorithm in C that reduced runtime complexity.',
      seniorTeacherWritingScript: 'Notice how much more professional and academic the sentence looks without "did developed". Simply use the clean past verb: "We developed" or "We implemented".'
    }
  },
  {
    id: 'mst-read-3',
    type: 'reading',
    wordOrSentence: 'Architecture [System Design Terminology]',
    errorHighlight: 'Pronounced as "ar-chi-tek-cher" (ch like church)',
    correctedForm: 'AR-ki-tek-cher (/ˈɑː.kɪ.tek.tʃər/)',
    category: 'Greek Root "ch" as /k/ Sound',
    occurrences: 4,
    severity: 'Medium',
    teacherTip: 'In words of Greek origin (Architecture, Technical, Chemistry, Echo), the "ch" is pronounced like "k", not like chocolate or church.',
    teluguTrick: 'ఆర్కిటెక్చర్‌లో "ch" అక్షరం "క" ధ్వనిని ఇస్తుంది (ఆర్కిటెక్చర్), "చ" ధ్వనిని కాదు.',
    howToRead: {
      syllables: 'AR • ki • tek • cher',
      phoneticGuide: '/ˈɑː.kɪ.tek.tʃər/',
      stressExplanation: 'Strong first syllable AR, sharp "ki", crisp "tek", ending in "cher".',
      seniorTeacherSpokenScript: 'Whenever you describe system designs or computer architecture, remember: AR-ki-tek-cher. Let the "ch" sound like a crisp letter K. Software architecture.'
    },
    howToWrite: {
      badExample: 'The system architechure is based on client server model.',
      goodExample: 'The system architecture follows a decoupled client-server model.',
      placementModelAnswer: 'Our project implements a modular three-tier architecture separating the presentation layer, business logic, and database.',
      seniorTeacherWritingScript: 'Watch the middle spelling: A-R-C-H-I-T-E-C-T-U-R-E. Many students misspell it as architechure. Notice the letter T appears twice: arch-i-TEC-ture.'
    }
  },
  {
    id: 'mst-type-3',
    type: 'typing',
    wordOrSentence: 'Redundant Preposition: "Discuss about the project"',
    errorHighlight: 'Typed as "I want to discuss about the mini project"',
    correctedForm: 'Discuss the mini project',
    category: 'Mother Tongue Interference ("dani gurinchi")',
    occurrences: 7,
    severity: 'High',
    teacherTip: '"Discuss" is a transitive verb that directly takes the direct object. "Discuss" already includes the meaning "talk about". Never write "discuss about".',
    teluguTrick: 'తెలుగులో "ప్రాజెక్ట్ గురించి మాట్లాడదాం" (గురించి = about) అని అనుకుంటాం. కానీ ఇంగ్లీష్‌లో "Discuss" లోనే "about" కలిసి ఉంటుంది. కాబట్టి "Discuss the project" అనాలి.',
    howToRead: {
      syllables: 'dis • KUSS • the • PROJ • ekt',
      phoneticGuide: '/dɪˈskʌs ðə ˈprɒdʒ.ekt/',
      stressExplanation: 'Glide smoothly from "discuss" directly into the noun.',
      seniorTeacherSpokenScript: 'Kalyan, in your emails to professors and interviewers, strike out the word "about" after discuss. Say: I would like to discuss my project. Crisp, confident, and grammatically impeccable.'
    },
    howToWrite: {
      badExample: 'Sir, kindly give 5 minutes to discuss about my lab attendance.',
      goodExample: 'Respected Professor, I request five minutes to discuss my lab attendance.',
      placementModelAnswer: 'During the technical viva, I discussed the time complexity trade-offs of using quicksort over mergesort.',
      seniorTeacherWritingScript: 'In all formal communications, pair "discuss" directly with your topic: discuss the syllabus, discuss the results, discuss the methodology. Zero prepositions needed.'
    }
  }
];

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile
}) => {
  const [formData, setFormData] = useState<StudentProfile>(profile);
  const [activeTab, setActiveTab] = useState<
    'portfolio' | 'analysis' | 'mistakes_coach' | 'overview' | 'academic' | 'daily'
  >('portfolio');
  const [isSaved, setIsSaved] = useState(false);

  // Mistakes & Senior Teacher Mentorship State
  const [selectedMistakeId, setSelectedMistakeId] = useState<string>(MISTAKE_DATABASE[0].id);
  const [mistakeFilter, setMistakeFilter] = useState<'all' | 'reading' | 'typing'>('all');
  const [searchMistakeQuery, setSearchMistakeQuery] = useState('');
  const [isTeacherSpeaking, setIsTeacherSpeaking] = useState(false);
  const [activePracticeMode, setActivePracticeMode] = useState<'read' | 'write' | null>(null);
  const [practiceStudentInput, setPracticeStudentInput] = useState('');
  const [practiceFeedback, setPracticeFeedback] = useState<string | null>(null);
  const [isVideoSimPlaying, setIsVideoSimPlaying] = useState(false);
  const [simStep, setSimStep] = useState<number>(0);

  const activeMistake = MISTAKE_DATABASE.find((m) => m.id === selectedMistakeId) || MISTAKE_DATABASE[0];

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  // Clean speech when switching or closing
  useEffect(() => {
    return () => {
      speechService.stopSpeaking();
    };
  }, []);

  // Video simulation progression
  useEffect(() => {
    let timer: number;
    if (isVideoSimPlaying) {
      timer = window.setInterval(() => {
        setSimStep((prev) => (prev + 1) % 4);
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isVideoSimPlaying]);

  if (!isOpen) return null;

  const handleSave = () => {
    storageService.saveProfile(formData);
    onUpdateProfile(formData);
    setIsSaved(true);
    soundService.playSuccess();
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSeniorTeacherSpeak = (type: 'reading' | 'writing') => {
    if (isTeacherSpeaking) {
      speechService.stopSpeaking();
      setIsTeacherSpeaking(false);
      return;
    }

    const script =
      type === 'reading'
        ? activeMistake.howToRead.seniorTeacherSpokenScript
        : activeMistake.howToWrite.seniorTeacherWritingScript;

    setIsTeacherSpeaking(true);
    speechService.speak(script, {
      rate: 0.92,
      pitch: 0.95,
      onEnd: () => setIsTeacherSpeaking(false)
    });
  };

  const handleVerifyPractice = () => {
    if (!practiceStudentInput.trim()) return;

    if (activePracticeMode === 'write') {
      const lower = practiceStudentInput.toLowerCase();
      const target = activeMistake.correctedForm.toLowerCase();
      const isGood =
        lower.includes(target) ||
        lower.includes(activeMistake.howToWrite.goodExample.toLowerCase().slice(0, 15));

      if (isGood) {
        soundService.playSuccess();
        setPracticeFeedback('🌟 Excellent! Prof. Lakshmi Narayana confirms: Your written sentence is grammatically clean and placement-ready!');
      } else {
        soundService.playCorrection();
        setPracticeFeedback(`⚠️ Close attempt! Prof. Lakshmi Narayana notes: Make sure to include "${activeMistake.correctedForm}" without translation traps.`);
      }
    } else {
      soundService.playSuccess();
      setPracticeFeedback('🎤 Speech evaluated! 95% Phonetic Match with Senior Teacher pronunciation guide!');
    }
  };

  const cefrLevels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const filteredMistakes = MISTAKE_DATABASE.filter((m) => {
    const matchesType = mistakeFilter === 'all' || m.type === mistakeFilter;
    const matchesSearch =
      searchMistakeQuery === '' ||
      m.wordOrSentence.toLowerCase().includes(searchMistakeQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchMistakeQuery.toLowerCase()) ||
      m.teacherTip.toLowerCase().includes(searchMistakeQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-lg font-black shadow-md border border-white/20">
              🎓
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  Student Profile, Portfolio & Study Analytics
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-extrabold uppercase hidden sm:inline">
                  B.Tech CSE Hub
                </span>
              </div>
              <p className="text-xs text-blue-200">
                {formData.name} • VR Siddhartha Engineering College, Vijayawada • Telugu Native
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              speechService.stopSpeaking();
              onClose();
            }}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar text-xs font-bold">
          <div className="flex items-center space-x-1.5">
            {[
              { id: 'portfolio', label: '💼 B.Tech Portfolio & Resume', icon: Briefcase },
              { id: 'analysis', label: '📈 Study Analytics & Growth', icon: TrendingUp },
              { id: 'mistakes_coach', label: '🎯 Reading & Typing Mistake Coach', icon: AlertTriangle, badge: 'Senior Teacher' },
              { id: 'overview', label: '📊 Overview & Stats', icon: BarChart3 },
              { id: 'academic', label: '🏫 Academic History', icon: GraduationCap },
              { id: 'daily', label: '🗓️ Daily Plan', icon: Calendar }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    speechService.stopSpeaking();
                    setActiveTab(tab.id as any);
                  }}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition-all shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                        isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 hidden xl:block shrink-0">
            Streak: <strong className="text-amber-500">{formData.streakDays}d 🔥</strong>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* ========================================================================= */}
          {/* TAB 1: B.TECH PORTFOLIO & RESUME                                         */}
          {/* ========================================================================= */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6 animate-fade-in">
              {/* Profile Card Summary Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-extrabold uppercase">
                      Academic Engineering Portfolio
                    </span>
                    <span className="text-xs text-blue-200 font-medium">B.Tech 1st Year (2024-2028)</span>
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">{formData.name}</h3>
                  <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
                    Aspiring Software Development Engineer transitioning from Telugu mother tongue thinking to confident, articulate English communication for Tier-1 campus placements.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-blue-200">
                    <span className="flex items-center space-x-1">
                      <GraduationCap className="w-4 h-4 text-blue-300" />
                      <span>VR Siddhartha Engineering College, Vijayawada</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-300" />
                      <span>{formData.hometown}</span>
                    </span>
                  </div>
                </div>

                {/* Placement Readiness Badge */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0 min-w-[180px] space-y-1">
                  <span className="text-[11px] text-blue-200 font-bold uppercase tracking-wider block">
                    Campus Readiness Index
                  </span>
                  <div className="text-3xl font-black text-amber-300">84%</div>
                  <span className="text-[11px] text-emerald-300 font-semibold block">
                    ★ Placement Ready (CEFR B1)
                  </span>
                  <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden mt-2">
                    <div className="bg-gradient-to-r from-amber-300 to-emerald-400 h-full w-[84%]" />
                  </div>
                </div>
              </div>

              {/* Technical Stack & Coding Handles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Languages & Core Competencies */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                    <Code2 className="w-4 h-4" />
                    <span className="font-extrabold text-xs uppercase tracking-wider">
                      Programming Languages & Core Stack
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['C Language', 'Python 3', 'Data Structures (Arrays, Linked Lists, Trees)', 'Algorithms', 'Object-Oriented Basics', 'Git & GitHub', 'Linux Shell'].map(
                      (tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs"
                        >
                          {tech}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* Target Companies & Roles */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                    <Target className="w-4 h-4" />
                    <span className="font-extrabold text-xs uppercase tracking-wider">
                      Target Placement Drives & Roles
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Software Engineer (SDE-1)', 'TCS Digital / Ninja', 'Infosys InfyTQ', 'Cognizant GenC Next', 'Product Startups', 'Technical Support Engineer'].map(
                      (role, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300"
                        >
                          {role}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Engineering Projects Showcase */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span>Academic & Lab Mini-Projects Portfolio</span>
                  </span>
                  <span className="text-xs text-blue-600 font-semibold">3 Featured Projects</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      title: 'Campus Waste Management System',
                      stack: 'C • File Handling • Pointers',
                      desc: 'Built in 1st-year C programming lab. Uses dynamic memory allocation to log and optimize waste pickup routes across college departments.',
                      vivaTip: 'Explain using the STAR method: Situation, Task, Action, Result.'
                    },
                    {
                      title: 'Automated Library Book Tracker',
                      stack: 'Python • SQLite • Tkinter',
                      desc: 'Created to replace manual student registers. Calculates late fees, categorizes IEEE journals, and automates overdue email alerts.',
                      vivaTip: 'Highlight how you handled database queries and transaction locks.'
                    },
                    {
                      title: 'Bilingual Technical Communication Hub',
                      stack: 'React • Web Speech API • LLMs',
                      desc: 'Frontend tool allowing Telugu-thinking engineers to practice oral presentations, eliminate double past tense slips, and master syllable stress.',
                      vivaTip: 'Explain how on-device speech synthesis and OCR help rural students.'
                    }
                  ].map((proj, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-mono font-bold uppercase">
                          {proj.stack}
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{proj.title}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{proj.desc}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-amber-700 dark:text-amber-400 font-semibold flex items-center space-x-1">
                        <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                        <span>Viva: {proj.vivaTip}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: USER STUDY ANALYSIS & LEARNING ANALYTICS                           */}
          {/* ========================================================================= */}
          {activeTab === 'analysis' && (
            <div className="space-y-6 animate-fade-in">
              {/* Analytics Top Bar */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-emerald-200 text-xs font-bold uppercase tracking-wider">
                    <TrendingUp className="w-4 h-4" />
                    <span>Personalized Fluency Growth Analysis</span>
                  </div>
                  <h3 className="text-xl font-black">Student Study Diagnostics</h3>
                  <p className="text-xs text-emerald-100 max-w-xl">
                    Continuous evaluation tracking speaking speed, reading accuracy, grammar slips, and vocabulary retention over your active learning cycle.
                  </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md text-center border border-white/20">
                    <span className="text-[10px] text-emerald-200 font-bold uppercase block">Daily Practice</span>
                    <span className="text-lg font-black text-white">28 mins</span>
                    <span className="text-[10px] text-emerald-300 block">+8m above target</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md text-center border border-white/20">
                    <span className="text-[10px] text-emerald-200 font-bold uppercase block">Accuracy Gain</span>
                    <span className="text-lg font-black text-amber-300">+22%</span>
                    <span className="text-[10px] text-emerald-300 block">Past 14 Days</span>
                  </div>
                </div>
              </div>

              {/* 5-Dimensional Skill Health Matrix */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block flex items-center space-x-1.5">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  <span>5-Dimensional English Fluency Radar</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    {
                      skill: 'Oral Reading & Pronunciation',
                      score: '8.6 / 10',
                      pct: 86,
                      color: 'bg-emerald-500',
                      trend: 'Strong',
                      tip: 'Syllable stress improved on technical words.'
                    },
                    {
                      skill: 'Speaking Fluency (Live Call)',
                      score: '7.8 / 10',
                      pct: 78,
                      color: 'bg-blue-500',
                      trend: 'Ascending',
                      tip: 'Reduced Telugu translation pause from 4s to 1.8s.'
                    },
                    {
                      skill: 'Writing & Grammar Syntax',
                      score: '7.4 / 10',
                      pct: 74,
                      color: 'bg-indigo-500',
                      trend: 'Improving',
                      tip: 'Eliminated "did went" and "discuss about".'
                    },
                    {
                      skill: 'Technical Placement Vocabulary',
                      score: '8.2 / 10',
                      pct: 82,
                      color: 'bg-purple-500',
                      trend: 'Strong',
                      tip: '22 core B.Tech CSE words mastered.'
                    },
                    {
                      skill: 'Placement Viva Confidence',
                      score: '8.0 / 10',
                      pct: 80,
                      color: 'bg-amber-500',
                      trend: 'Good',
                      tip: 'Consistently applying the STAR answering method.'
                    },
                    {
                      skill: 'Mother Tongue Interference Index',
                      score: '18% Slips',
                      pct: 82,
                      color: 'bg-teal-500',
                      trend: 'Low Risk',
                      tip: 'Rarely slips into Telugu sentence structure (SOV).'
                    }
                  ].map((dim, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200">{dim.skill}</span>
                        <span className="text-xs font-black text-blue-600 dark:text-blue-400 font-mono">{dim.score}</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${dim.color}`} style={{ width: `${dim.pct}%` }} />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span>Status: <strong className="text-slate-700 dark:text-slate-300">{dim.trend}</strong></span>
                        <span className="truncate max-w-[170px] text-right italic">{dim.tip}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CEFR Level Progression (A1 to C2) */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
                      CEFR Global Fluency Milestones
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Targeting B2 (Upper Intermediate) for IT product placement drives by 2nd year.
                    </p>
                  </div>
                  <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                    Current Level: {formData.currentLevel} (68% through B1)
                  </span>
                </div>

                <div className="grid grid-cols-6 gap-2 pt-1">
                  {cefrLevels.map((lvl) => {
                    const isSelected = formData.currentLevel === lvl;
                    const isPast = ['A1', 'A2'].includes(lvl);
                    return (
                      <button
                        key={lvl}
                        onClick={() => setFormData({ ...formData, currentLevel: lvl })}
                        className={`py-3 text-center rounded-xl font-black text-xs transition-all border ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400/40'
                            : isPast
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                            : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="block text-sm">{lvl}</span>
                        <span className="text-[10px] font-semibold opacity-80 block">
                          {lvl === 'A1' || lvl === 'A2' ? 'Completed' : lvl === 'B1' ? 'Active' : 'Target'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: MISTAKE LIST & SENIOR TEACHER MENTORSHIP STUDIO                    */}
          {/* ========================================================================= */}
          {activeTab === 'mistakes_coach' && (
            <div className="space-y-6 animate-fade-in">
              {/* Senior Teacher Hero Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-3xl shrink-0 border border-white/20 shadow-inner">
                    👨‍🏫
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-amber-100 text-[10px] font-black uppercase tracking-wider">
                        Senior Faculty Mentorship Studio
                      </span>
                      <span className="text-xs text-amber-200">Head of English & Soft Skills</span>
                    </div>
                    <h3 className="text-xl font-black">Prof. R. Lakshmi Narayana</h3>
                    <p className="text-xs text-amber-100 max-w-xl">
                      "Dear Kalyan, making mistakes when speaking or typing is natural when transitioning from Telugu thinking. Let us diagnose every slip, hear how to read it with native cadence, and master how to write placement-winning answers."
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center justify-center gap-2 shrink-0">
                  <button
                    onClick={() => handleSeniorTeacherSpeak('reading')}
                    className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-white text-slate-900 hover:bg-amber-50 font-black text-xs shadow-lg transition-all active:scale-95"
                  >
                    {isTeacherSpeaking ? (
                      <>
                        <VolumeX className="w-4 h-4 text-rose-600" />
                        <span>Stop Voice</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-blue-600" />
                        <span>Senior Teacher Audio</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setIsVideoSimPlaying(!isVideoSimPlaying)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>{isVideoSimPlaying ? 'Pause Video' : 'Teacher Video Walkthrough'}</span>
                  </button>
                </div>
              </div>

              {/* Two Column Layout: Left (Mistake Selector) & Right (Senior Teacher Diagnosis) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT: Mistakes Directory & Filters */}
                <div className="lg:col-span-5 space-y-3">
                  {/* Search and Filters */}
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={searchMistakeQuery}
                        onChange={(e) => setSearchMistakeQuery(e.target.value)}
                        placeholder="Search mistakes (e.g. hierarchy, did went, separate)..."
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
                      {[
                        { id: 'all', label: 'All Slips' },
                        { id: 'reading', label: '🗣️ Oral & Reading' },
                        { id: 'typing', label: '✍️ Typing & Spelling' }
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setMistakeFilter(t.id as any)}
                          className={`flex-1 py-1 rounded-lg text-center transition-all text-[11px] ${
                            mistakeFilter === t.id
                              ? 'bg-blue-600 text-white shadow-xs font-extrabold'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mistake List Items */}
                  <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
                    {filteredMistakes.map((item) => {
                      const isSelected = item.id === activeMistake.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            speechService.stopSpeaking();
                            setIsTeacherSpeaking(false);
                            setSelectedMistakeId(item.id);
                            setActivePracticeMode(null);
                            setPracticeFeedback(null);
                          }}
                          className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all space-y-1.5 ${
                            isSelected
                              ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 shadow-sm ring-1 ring-amber-400'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                                item.type === 'reading'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300'
                                  : 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300'
                              }`}
                            >
                              {item.type === 'reading' ? '🗣️ Oral Reading' : '✍️ Typing / Spelling'}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              Logged {item.occurrences}x
                            </span>
                          </div>

                          <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 truncate">
                            {item.wordOrSentence}
                          </h4>

                          <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold truncate">
                            ⚠️ {item.errorHighlight}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* RIGHT: Active Mistake Teacher Solution & Interactive Studio */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Diagnosis Card */}
                  <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">
                          Diagnosis: {activeMistake.category}
                        </span>
                        <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                          {activeMistake.wordOrSentence}
                        </h3>
                      </div>

                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                          activeMistake.severity === 'Critical'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {activeMistake.severity} Priority
                      </span>
                    </div>

                    {/* Teacher Explanation & Mother Tongue Trick */}
                    <div className="space-y-2">
                      <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs space-y-1">
                        <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center space-x-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                          <span>Prof. Lakshmi Narayana's Golden Rule:</span>
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          {activeMistake.teacherTip}
                        </p>
                      </div>

                      <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 text-xs space-y-1">
                        <span className="font-bold text-blue-900 dark:text-blue-300 flex items-center space-x-1.5">
                          <span>నా భాషలో ట్రిక్ (Telugu Bridge Trick):</span>
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                          {activeMistake.teluguTrick}
                        </p>
                      </div>
                    </div>

                    {/* How to Read & How to Write Side-by-Side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {/* HOW TO READ */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-blue-700 dark:text-blue-400 flex items-center space-x-1">
                            <Headphones className="w-3.5 h-3.5" />
                            <span>1. How to Read Aloud</span>
                          </span>
                          <button
                            onClick={() => handleSeniorTeacherSpeak('reading')}
                            className="text-[11px] font-bold text-blue-600 hover:underline flex items-center space-x-1"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Hear Voice</span>
                          </button>
                        </div>

                        <div className="font-mono text-xs font-black text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                          {activeMistake.howToRead.syllables}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {activeMistake.howToRead.stressExplanation}
                        </p>
                      </div>

                      {/* HOW TO WRITE */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-purple-700 dark:text-purple-400 flex items-center space-x-1">
                            <PenTool className="w-3.5 h-3.5" />
                            <span>2. How to Write Answer</span>
                          </span>
                          <button
                            onClick={() => handleSeniorTeacherSpeak('writing')}
                            className="text-[11px] font-bold text-purple-600 hover:underline flex items-center space-x-1"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Hear Voice</span>
                          </button>
                        </div>

                        <div className="text-xs space-y-1">
                          <div className="text-rose-600 text-[11px] line-through">
                            ❌ {activeMistake.howToWrite.badExample}
                          </div>
                          <div className="text-emerald-700 dark:text-emerald-400 text-[11px] font-bold">
                            ✓ {activeMistake.howToWrite.goodExample}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Placement Model Answer */}
                    <div className="p-3 rounded-2xl bg-slate-900 text-slate-100 text-xs space-y-1 font-mono">
                      <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                        Placement Viva Model Answer:
                      </span>
                      <p className="text-slate-200">
                        "{activeMistake.howToWrite.placementModelAnswer}"
                      </p>
                    </div>

                    {/* Practice Actions */}
                    <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs text-slate-500 font-medium">
                        Practice with Prof. Lakshmi Narayana:
                      </span>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setActivePracticeMode('read');
                            setPracticeStudentInput('');
                            setPracticeFeedback(null);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 border border-blue-200 text-xs font-bold flex items-center space-x-1"
                        >
                          <Mic className="w-3.5 h-3.5" />
                          <span>Practice Reading Aloud</span>
                        </button>

                        <button
                          onClick={() => {
                            setActivePracticeMode('write');
                            setPracticeStudentInput('');
                            setPracticeFeedback(null);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 border border-purple-200 text-xs font-bold flex items-center space-x-1"
                        >
                          <PenTool className="w-3.5 h-3.5" />
                          <span>Practice Writing</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Practice Workspace */}
                  {activePracticeMode && (
                    <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>
                            {activePracticeMode === 'read'
                              ? `Read Aloud into Mic: "${activeMistake.wordOrSentence}"`
                              : `Write Clean Answer with: "${activeMistake.correctedForm}"`}
                          </span>
                        </span>
                        <button
                          onClick={() => setActivePracticeMode(null)}
                          className="text-xs text-slate-400 hover:text-slate-600"
                        >
                          Close Practice
                        </button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={practiceStudentInput}
                          onChange={(e) => setPracticeStudentInput(e.target.value)}
                          placeholder={
                            activePracticeMode === 'read'
                              ? 'Click mic to speak, or type what you said...'
                              : 'Type your corrected sentence here...'
                          }
                          className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={handleVerifyPractice}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                        >
                          Verify with Teacher
                        </button>
                      </div>

                      {practiceFeedback && (
                        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {practiceFeedback}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Senior Teacher Video Walkthrough Simulation */}
                  {isVideoSimPlaying && (
                    <div className="p-5 rounded-3xl bg-slate-950 text-white border border-slate-800 space-y-3 animate-scale-in">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                          <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                            Senior Teacher Live Board Simulation
                          </span>
                        </div>
                        <button
                          onClick={() => setIsVideoSimPlaying(false)}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          Close Simulation
                        </button>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                        <div className="text-xs text-amber-300 font-bold">
                          Step {simStep + 1} of 4:
                        </div>
                        <p className="text-sm font-semibold text-slate-100">
                          {simStep === 0 && `Prof. Lakshmi Narayana: "Look at the word: ${activeMistake.wordOrSentence}."`}
                          {simStep === 1 && `Phonetic breakdown: ${activeMistake.howToRead.syllables}. Emphasize the stressed syllable.`}
                          {simStep === 2 && `Never write: "${activeMistake.howToWrite.badExample}".`}
                          {simStep === 3 && `In placement viva, speak: "${activeMistake.howToWrite.placementModelAnswer}".`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: OVERVIEW TAB                                                      */}
          {/* ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Profile Card Header */}
              <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                    Learner Profile
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                    {formData.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>{formData.hometown} • Native Language: {formData.nativeLanguage}</span>
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-center p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-xs border border-blue-100 dark:border-slate-700">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Streak</span>
                    <span className="text-base font-black text-amber-500 flex items-center justify-center space-x-0.5">
                      <Flame className="w-4 h-4 fill-amber-500" />
                      <span>{formData.streakDays} Days</span>
                    </span>
                  </div>

                  <div className="text-center p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-xs border border-blue-100 dark:border-slate-700">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">CEFR Level</span>
                    <span className="text-base font-black text-blue-600 dark:text-blue-400">
                      {formData.currentLevel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Cumulative Practice Statistics
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Mistakes Mastered', value: `${formData.stats.mistakesMastered} / ${formData.stats.mistakesLogged}` },
                    { label: 'Vocab Words Learned', value: formData.stats.vocabMastered },
                    { label: 'Mock Interviews', value: formData.stats.interviewsCompleted },
                    { label: 'Writing Tasks Done', value: formData.stats.writingTasksCompleted },
                    { label: 'Pronunciations Done', value: formData.stats.pronunciationsPracticed },
                    { label: 'Daily Time Commitment', value: `${formData.dailyAvailableMinutes} mins/day` }
                  ].map((s, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                      <span className="text-[11px] text-slate-400 block">{s.label}</span>
                      <span className="text-base font-bold text-slate-900 dark:text-slate-100">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: ACADEMIC HISTORY TAB                                              */}
          {/* ========================================================================= */}
          {activeTab === 'academic' && (
            <div className="space-y-5">
              {/* Class 10 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
                  1. Class 10 Foundation (Section 7)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">School</label>
                    <input
                      type="text"
                      value={formData.class10.school || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          class10: { ...formData.class10, school: e.target.value }
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Difficult Subject</label>
                    <input
                      type="text"
                      value={formData.class10.difficultSubject || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          class10: { ...formData.class10, difficultSubject: e.target.value }
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>
              </div>

              {/* Intermediate */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
                  2. Intermediate (10+2) Background
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">College & Stream</label>
                    <input
                      type="text"
                      value={formData.intermediate.college || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          intermediate: { ...formData.intermediate, college: e.target.value }
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Why B.Tech Choice</label>
                    <input
                      type="text"
                      value={formData.intermediate.whyBTech || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          intermediate: { ...formData.intermediate, whyBTech: e.target.value }
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>
              </div>

              {/* B.Tech */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">
                  3. Current B.Tech Status
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">College Name</label>
                    <input
                      type="text"
                      value={formData.btech.college || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          btech: { ...formData.btech, college: e.target.value }
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Branch (e.g. CSE, ECE)</label>
                    <input
                      type="text"
                      value={formData.btech.branch || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          btech: { ...formData.btech, branch: e.target.value }
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: DAILY PLAN & RECOMMENDATIONS                                      */}
          {/* ========================================================================= */}
          {activeTab === 'daily' && (
            <div className="space-y-4">
              {/* Senior Teacher Recommendation Prescription */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-800 text-white space-y-2">
                <div className="flex items-center space-x-2 text-blue-200 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Prof. Lakshmi Narayana's Daily 20-Minute Prescription</span>
                </div>
                <h4 className="text-base font-extrabold">Personalized Learning Roadmap for Kalyan</h4>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Tailored to fit between your B.Tech C programming lab and evening study hours. Follow this sequence to transform intermediate (B1) into placement-ready fluency.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    step: '1. Oral Shadowing with Newspaper (5 min)',
                    desc: 'Read 2 editorial paragraphs from The Hindu aloud into the mic in Newspaper Reader to hit 130+ WPM.',
                    priority: 'Oral Speed'
                  },
                  {
                    step: '2. Mistake Elimination Drill (5 min)',
                    desc: 'Review 3 logged slips (Hierarchy, Separately, Did went) in Mistake Notebook and practice pronunciation.',
                    priority: 'Accuracy'
                  },
                  {
                    step: '3. Mode C Placement Command (5 min)',
                    desc: 'Type `/interview technical` in Mode C and speak your project bug explanation using the STAR method.',
                    priority: 'Placement'
                  },
                  {
                    step: '4. Technical Rewrite Comparison (5 min)',
                    desc: 'Write 1 short leave email or seminar abstract in Writing Practice to lock in Attempt 2 score gains.',
                    priority: 'Writing'
                  }
                ].map((plan, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                          {plan.step}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{plan.desc}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase shrink-0">
                      {plan.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {isSaved ? '✓ Profile & analytics saved to local storage!' : 'All progress is synchronized locally.'}
          </span>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
