import React, { useState } from 'react';
import {
  Briefcase,
  Play,
  Mic,
  MicOff,
  Volume2,
  CheckCircle,
  BarChart2,
  TrendingUp,
  AlertCircle,
  Award,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Send,
  UserCheck
} from 'lucide-react';
import { StudentProfile, InterviewReport } from '../types';
import { MOCK_INTERVIEW_QUESTIONS } from '../services/mockData';
import { aiService } from '../services/aiService';
import { speechService } from '../services/speechService';
import { storageService } from '../services/storageService';
import { triggerConfetti } from './Confetti';

interface MockInterviewProps {
  profile: StudentProfile;
}

export const MockInterview: React.FC<MockInterviewProps> = ({ profile }) => {
  const [interviewType, setInterviewType] = useState<
    'self_intro' | 'internship' | 'hr' | 'technical' | 'campus_placement'
  >('self_intro');

  const [inProgress, setInProgress] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [recordedAnswers, setRecordedAnswers] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [report, setReport] = useState<InterviewReport | null>(null);
  const [pastReports, setPastReports] = useState<InterviewReport[]>(() =>
    storageService.getInterviewReports()
  );

  const activeQuestions = MOCK_INTERVIEW_QUESTIONS[interviewType] || MOCK_INTERVIEW_QUESTIONS.self_intro;

  const handleStartInterview = () => {
    setInProgress(true);
    setCurrentQuestionIndex(0);
    setCurrentAnswer('');
    setRecordedAnswers([]);
    setReport(null);

    // Speak first question
    speechService.speak(activeQuestions[0], { rate: 0.95 });
  };

  const handleVoiceInput = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      const started = speechService.startListening(
        (transcript, isFinal) => {
          setCurrentAnswer(transcript);
          if (isFinal) {
            setIsListening(false);
          }
        },
        (err) => {
          console.warn('Speech err:', err);
          setIsListening(false);
        },
        () => setIsListening(false)
      );
      if (started) setIsListening(true);
    }
  };

  const handleNextQuestion = async () => {
    if (!currentAnswer.trim()) return;

    const newAnswers = [...recordedAnswers, currentAnswer.trim()];
    setRecordedAnswers(newAnswers);
    setCurrentAnswer('');

    if (currentQuestionIndex + 1 < activeQuestions.length) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      speechService.speak(activeQuestions[nextIdx], { rate: 0.95 });
    } else {
      // Completed all questions -> Generate Interview Report!
      setIsEvaluating(true);
      const attemptNum = pastReports.filter(r => r.interviewType === interviewType).length + 1;

      setTimeout(() => {
        const generatedReport = aiService.generateInterviewReport(
          interviewType,
          activeQuestions,
          newAnswers,
          attemptNum
        );
        storageService.saveInterviewReport(generatedReport);
        setReport(generatedReport);
        setPastReports(storageService.getInterviewReports());
        setIsEvaluating(false);
        setInProgress(false);
        triggerConfetti();
      }, 1500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-teal-500/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20">Sections 19 – 22</span>
              <span>Real Mock Interview & Retry Tracker</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              B.Tech Mock Interview Simulator
            </h1>
            <p className="mt-1 text-sm text-emerald-100 max-w-xl">
              1-by-1 realistic interview flow with voice input. Receive an official 8-criteria evaluation report and track retry progression over time!
            </p>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-xs text-emerald-200 block">Candidate</span>
            <span className="font-bold">{profile.name}</span>
            <span className="text-xs block text-teal-200">1st Year {profile.btech.branch}</span>
          </div>
        </div>
      </div>

      {/* Mode Selector & Past Stats if not in progress */}
      {!inProgress && !report && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">
              Select Interview Category:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { id: 'self_intro', label: '1. Self-Introduction & Foundations', desc: 'Background, branch choice & goals' },
                { id: 'internship', label: '2. Early Internship Mock', desc: 'Projects, lab work & problem solving' },
                { id: 'hr', label: '3. HR & Behavioral Mock', desc: 'Strengths, deadlines & teamwork' },
                { id: 'technical', label: '4. Technical Fundamentals', desc: 'C, Data Structures & Concepts' },
                { id: 'campus_placement', label: '5. Campus Placement Round', desc: 'Full placement simulation' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setInterviewType(item.id as any)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    interviewType === item.id
                      ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/40'
                  }`}
                >
                  <span className="text-sm font-bold block">{item.label}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Questions will adapt directly to your {profile.btech.branch} profile.</span>
            </div>

            <button
              onClick={handleStartInterview}
              className="flex items-center space-x-2 px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Begin Mock Interview</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Interview Session (1 Question at a time) */}
      {inProgress && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-emerald-500/30 space-y-6 animate-fade-in">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-emerald-600 uppercase tracking-wider">
              Question {currentQuestionIndex + 1} of {activeQuestions.length}
            </span>
            <div className="w-32 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIndex + 1) / activeQuestions.length) * 100}%`
                }}
              />
            </div>
          </div>

          {/* Question Box */}
          <div className="p-6 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center space-x-1.5">
                <Briefcase className="w-4 h-4" />
                <span>Interviewer</span>
              </span>
              <button
                onClick={() => speechService.speak(activeQuestions[currentQuestionIndex], { rate: 0.95 })}
                className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 p-1"
                title="Replay audio"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
              "{activeQuestions[currentQuestionIndex]}"
            </p>
          </div>

          {/* Answer Input */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Your Answer (Speak or Type naturally):
            </label>
            <div className="relative">
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Speak using the microphone or type your response in English..."
                rows={4}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base resize-none"
              />

              <button
                onClick={handleVoiceInput}
                title={isListening ? 'Stop recording' : 'Speak using microphone'}
                className={`absolute right-3 bottom-3 p-2.5 rounded-xl transition-all shadow-sm ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-100 hover:text-emerald-600'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit answer */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400 italic">
              {currentQuestionIndex + 1 === activeQuestions.length
                ? 'Last question! Generating your 8-criteria report next.'
                : 'Take your time. Speak clearly and use complete sentences.'}
            </span>

            <button
              onClick={handleNextQuestion}
              disabled={!currentAnswer.trim()}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <span>{currentQuestionIndex + 1 === activeQuestions.length ? 'Finish & Generate Report' : 'Next Question'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Evaluating state */}
      {isEvaluating && (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 animate-fade-in">
          <Sparkles className="w-12 h-12 text-emerald-500 mx-auto animate-spin" />
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
            Analyzing Your Interview Performance...
          </h3>
          <p className="text-sm text-slate-500">
            Calculating Grammar, Fluency, Vocabulary, Clarity, and Professional scores out of 10...
          </p>
        </div>
      )}

      {/* Section 21 & 22: Comprehensive Interview Report & Retry Progression */}
      {report && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-8 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800 pb-6 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Official Interview Feedback • Attempt #{report.attemptNumber}
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                Mock Interview Performance Report
              </h2>
              <span className="text-xs text-slate-400">Date: {report.date}</span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block uppercase">Overall Score</span>
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {report.overallScore}<span className="text-sm text-slate-400">/10</span>
                </span>
              </div>
            </div>
          </div>

          {/* 8-Criteria Rubric Grid (Section 21) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Core Evaluation Metrics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Grammar', score: report.grammarScore },
                { label: 'Vocabulary', score: report.vocabularyScore },
                { label: 'Fluency', score: report.fluencyScore },
                { label: 'Clarity', score: report.clarityScore },
                { label: 'Confidence', score: report.confidenceScore },
                { label: 'Professionalism', score: report.professionalScore },
                { label: 'Content Quality', score: report.contentQualityScore },
                { label: 'Overall', score: report.overallScore }
              ].map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">{m.label}</span>
                  <div className="flex items-baseline space-x-1 mt-1">
                    <span className="text-xl font-black text-slate-900 dark:text-slate-100">{m.score}</span>
                    <span className="text-xs text-slate-400">/10</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${(m.score / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>Observed Strengths</span>
              </span>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc pl-4">
                {report.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center space-x-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>Areas for Improvement</span>
              </span>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc pl-4">
                {report.weaknesses.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Model Answers Comparison (Section 21) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Better Answer Recommendations
            </h3>
            <div className="space-y-3">
              {report.betterAnswers.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="text-xs font-bold text-emerald-600 block">Q: {item.question}</span>
                  <div className="text-xs space-y-1">
                    <p className="text-slate-500 line-through">Your Answer: "{item.studentAnswer}"</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Recommended Model Answer: {item.recommendedAnswer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 22: Retry System Button */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500">
              Retrying will test whether you have integrated the feedback and show score improvement!
            </span>
            <button
              onClick={handleStartInterview}
              className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Mock Interview (Attempt #{report.attemptNumber + 1})</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
