import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  HelpCircle,
  GraduationCap,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Clock,
  Languages,
  RotateCcw
} from 'lucide-react';
import { StudentProfile } from '../types';
import { speechService } from '../services/speechService';
import { aiService } from '../services/aiService';
import { soundService } from '../services/soundService';
import { triggerConfetti } from './Confetti';

interface LiveVoiceCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
}

export const LiveVoiceCallModal: React.FC<LiveVoiceCallModalProps> = ({
  isOpen,
  onClose,
  profile
}) => {
  const [callState, setCallState] = useState<'connecting' | 'teacher_speaking' | 'student_listening' | 'analyzing' | 'ended'>('connecting');
  const [currentTeacherSpeech, setCurrentTeacherSpeech] = useState('');
  const [studentTranscript, setStudentTranscript] = useState('');
  const [callSeconds, setCallSeconds] = useState(0);
  const [correctionsList, setCorrectionsList] = useState<{ original: string; correct: string; tip: string }[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [teluguEmergencyExplanation, setTeluguEmergencyExplanation] = useState<string | null>(null);

  const conversationHistory = useRef<{ role: string; content: string }[]>([]);
  const callTimerRef = useRef<number | null>(null);

  // Initialize Call
  useEffect(() => {
    if (isOpen) {
      setCallState('connecting');
      setCallSeconds(0);
      setCorrectionsList([]);
      setStudentTranscript('');
      setTeluguEmergencyExplanation(null);
      conversationHistory.current = [];

      callTimerRef.current = setInterval(() => {
        setCallSeconds(prev => prev + 1);
      }, 1000);

      // Start call after short connection ring
      setTimeout(() => {
        startTeacherGreeting();
      }, 1200);
    } else {
      cleanupCall();
    }

    return () => {
      cleanupCall();
    };
  }, [isOpen]);

  const cleanupCall = () => {
    speechService.stopSpeaking();
    speechService.stopListening();
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
  };

  const startTeacherGreeting = () => {
    const greeting = `Hello ${profile.name}! I am so glad we are speaking on this voice call. In our first-year B.Tech journey, speaking English daily is the secret to sounding natural in campus placements. How was your day at college today? What classes or labs did you attend?`;
    playTeacherUtterance(greeting);
  };

  const playTeacherUtterance = (text: string) => {
    setCallState('teacher_speaking');
    setCurrentTeacherSpeech(text);
    conversationHistory.current.push({ role: 'teacher', content: text });

    speechService.speak(text, {
      rate: 0.95,
      pitch: 1.0,
      onEnd: () => {
        // Teacher finished speaking -> Auto activate listening to the student hands-free!
        startListeningToStudent();
      }
    });
  };

  const startListeningToStudent = () => {
    setCallState('student_listening');
    setStudentTranscript('');

    const started = speechService.startListening(
      (transcript, isFinal) => {
        setStudentTranscript(transcript);
        if (isFinal) {
          // Process student's response when finished speaking
          handleStudentFinishedSpeaking(transcript);
        }
      },
      (err) => {
        console.warn('Voice call mic notice:', err);
      },
      () => {
        // Recognition ended
      }
    );

    if (!started) {
      setCallState('student_listening');
    }
  };

  const handleStudentFinishedSpeaking = async (spokenText: string) => {
    if (!spokenText.trim()) return;

    speechService.stopListening();
    setCallState('analyzing');
    conversationHistory.current.push({ role: 'student', content: spokenText });

    // Detect Telugu speaker mistake patterns on the fly
    const lower = spokenText.toLowerCase();
    const detectedCorrections: { original: string; correct: string; tip: string }[] = [];

    if (lower.includes('am go') || lower.includes('am went')) {
      detectedCorrections.push({
        original: 'am go / am went',
        correct: 'went',
        tip: 'In past actions, say "I went" instead of "I am go".'
      });
      soundService.playCorrection();
    } else if (lower.includes('myself')) {
      detectedCorrections.push({
        original: 'myself',
        correct: 'My name is / I am',
        tip: 'Avoid reflexive "myself" as the subject in professional calls.'
      });
      soundService.playCorrection();
    } else if (lower.includes('discussed about')) {
      detectedCorrections.push({
        original: 'discussed about',
        correct: 'discussed',
        tip: '"Discuss" takes the object directly without "about".'
      });
      soundService.playCorrection();
    } else {
      soundService.playSuccess();
    }

    if (detectedCorrections.length > 0) {
      setCorrectionsList(prev => [...detectedCorrections, ...prev]);
    }

    // Generate natural conversational follow-up
    setTimeout(() => {
      let teacherReply = `That is wonderful! `;
      if (detectedCorrections.length > 0) {
        teacherReply += `By the way, notice a small tip: instead of "${detectedCorrections[0].original}", it sounds much more natural to say "${detectedCorrections[0].correct}". `;
      }
      teacherReply += `Could you elaborate on what you enjoyed most about that experience, or what technical challenge you solved?`;

      playTeacherUtterance(teacherReply);
    }, 1200);
  };

  const handleExplainInTeluguDuringCall = async () => {
    soundService.playPop();
    const explanation = await aiService.explainInNativeLanguage(
      currentTeacherSpeech,
      'Telugu',
      profile
    );
    setTeluguEmergencyExplanation(explanation.nativeExplanation);

    // Speak in Telugu
    speechService.speak(explanation.nativeExplanation, {
      rate: 0.9,
      voiceLang: 'te-IN',
      onEnd: () => {
        startListeningToStudent();
      }
    });
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-800 overflow-hidden flex flex-col text-white">
        {/* Call Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30 text-lg">
              🎓
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight text-white flex items-center space-x-2">
                <span>AI Master Teacher Live Call</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              </h3>
              <p className="text-xs text-slate-400">
                1-on-1 Interactive Speaking Coach • B.Tech Fluency
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-emerald-400">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatTimer(callSeconds)}</span>
          </div>
        </div>

        {/* Interactive Visualizer & Avatar Area */}
        <div className="p-8 flex flex-col items-center justify-center text-center space-y-6">
          {/* Pulsing Avatar */}
          <div className="relative">
            {callState === 'teacher_speaking' && (
              <>
                <div className="absolute -inset-4 rounded-full bg-blue-500/20 animate-ping"></div>
                <div className="absolute -inset-2 rounded-full bg-blue-500/30 animate-pulse"></div>
              </>
            )}

            {callState === 'student_listening' && (
              <>
                <div className="absolute -inset-4 rounded-full bg-emerald-500/20 animate-ping"></div>
                <div className="absolute -inset-2 rounded-full bg-emerald-500/30 animate-pulse"></div>
              </>
            )}

            <div className={`w-28 h-28 rounded-full flex items-center justify-center text-5xl shadow-2xl relative transition-all duration-300 border-4 ${
              callState === 'teacher_speaking'
                ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 border-blue-400 scale-105'
                : callState === 'student_listening'
                ? 'bg-gradient-to-tr from-emerald-600 to-teal-600 border-emerald-400 scale-105'
                : 'bg-slate-800 border-slate-700'
            }`}>
              {callState === 'teacher_speaking' ? '🗣️' : callState === 'student_listening' ? '🎙️' : '🎓'}
            </div>
          </div>

          {/* Current State Status */}
          <div className="space-y-1">
            <span className={`text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full ${
              callState === 'teacher_speaking'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : callState === 'student_listening'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {callState === 'teacher_speaking' && 'Teacher is Speaking...'}
              {callState === 'student_listening' && 'Listening to You Hands-Free...'}
              {callState === 'analyzing' && 'Analyzing Your Fluency...'}
            </span>
            <p className="text-xs text-slate-400">
              {callState === 'student_listening' ? 'Speak your answer naturally in English. When you stop, the teacher will answer.' : 'Listen carefully and prepare your response.'}
            </p>
          </div>

          {/* Live Closed Caption / Speech Bubble */}
          <div className="w-full p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 min-h-[90px] flex items-center justify-center text-center">
            {callState === 'teacher_speaking' && (
              <p className="text-sm font-medium text-blue-200 leading-relaxed italic">
                "{currentTeacherSpeech}"
              </p>
            )}
            {callState === 'student_listening' && (
              <p className="text-sm font-bold text-emerald-300 leading-relaxed">
                {studentTranscript ? `"${studentTranscript}"` : 'Listening for your voice... speak now!'}
              </p>
            )}
            {callState === 'analyzing' && (
              <p className="text-xs text-amber-300 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Teacher is reflecting on your grammar and crafting follow-up...</span>
              </p>
            )}
          </div>

          {/* Telugu Emergency Button */}
          <button
            onClick={handleExplainInTeluguDuringCall}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all active:scale-95"
            title="Didn't understand? Ask the teacher to explain the question in Telugu"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>Didn't Understand? Tell in Telugu (తెలుగులో చెప్పండి)</span>
          </button>

          {teluguEmergencyExplanation && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200 text-left animate-fade-in">
              <strong>తెలుగు వివరణ:</strong> {teluguEmergencyExplanation}
            </div>
          )}

          {/* Real-Time Live Corrections Popups */}
          {correctionsList.length > 0 && (
            <div className="w-full space-y-2 text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Live Speech Corrections:
              </span>
              <div className="max-h-24 overflow-y-auto space-y-1.5 no-scrollbar">
                {correctionsList.map((c, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="text-rose-400 line-through mr-2 font-bold">{c.original}</span>
                      <span className="text-emerald-400 font-bold">→ {c.correct}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{c.tip}</p>
                    </div>
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Call Footer Controls */}
        <div className="p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-around">
          {/* Speak / Stop Toggle */}
          <button
            onClick={() => {
              if (callState === 'student_listening') {
                handleStudentFinishedSpeaking(studentTranscript || 'I went to college today.');
              } else {
                startListeningToStudent();
              }
            }}
            className="flex flex-col items-center space-y-1 text-slate-400 hover:text-white"
          >
            <div className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white transition-all shadow-md active:scale-95">
              <Mic className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-[10px] font-semibold">Done Speaking</span>
          </button>

          {/* End Call Button */}
          <button
            onClick={() => {
              cleanupCall();
              soundService.playPop();
              onClose();
              triggerConfetti();
            }}
            className="flex flex-col items-center space-y-1 text-rose-400 hover:text-rose-300"
          >
            <div className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 flex items-center justify-center text-white transition-all shadow-lg shadow-rose-600/30 active:scale-95">
              <PhoneOff className="w-7 h-7 fill-current" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">End Call</span>
          </button>

          {/* Replay Teacher */}
          <button
            onClick={() => playTeacherUtterance(currentTeacherSpeech)}
            className="flex flex-col items-center space-y-1 text-slate-400 hover:text-white"
          >
            <div className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white transition-all shadow-md active:scale-95">
              <RotateCcw className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-[10px] font-semibold">Repeat Question</span>
          </button>
        </div>
      </div>
    </div>
  );
};
