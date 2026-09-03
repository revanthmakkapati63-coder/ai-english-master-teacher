import React, { useState } from 'react';
import {
  PenTool,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  TrendingUp,
  FileText,
  Lightbulb,
  Award
} from 'lucide-react';
import { WRITING_TASKS } from '../services/mockData';
import { aiService } from '../services/aiService';
import { storageService } from '../services/storageService';
import { triggerConfetti } from './Confetti';

export const WritingPractice: React.FC = () => {
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(0);
  const [step, setStep] = useState<'attempt1' | 'feedback1' | 'attempt2' | 'comparison'>('attempt1');
  const [attempt1Text, setAttempt1Text] = useState('');
  const [attempt2Text, setAttempt2Text] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback1, setFeedback1] = useState<any>(null);
  const [comparison, setComparison] = useState<any>(null);

  const currentTask = WRITING_TASKS[selectedTaskIndex];

  const handleSelectTask = (index: number) => {
    setSelectedTaskIndex(index);
    setStep('attempt1');
    setAttempt1Text('');
    setAttempt2Text('');
    setFeedback1(null);
    setComparison(null);
  };

  const handleSubmitAttempt1 = async () => {
    if (!attempt1Text.trim()) return;
    setIsEvaluating(true);

    try {
      const evaluation = await aiService.evaluateWritingAttempt(currentTask.prompt, attempt1Text, 1);
      setFeedback1(evaluation);
      setStep('feedback1');
    } catch (e) {
      console.error('Writing evaluation error:', e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleStartRewrite = () => {
    setStep('attempt2');
  };

  const handleSubmitAttempt2 = async () => {
    if (!attempt2Text.trim()) return;
    setIsEvaluating(true);

    try {
      const result = await aiService.evaluateWritingAttempt(
        currentTask.prompt,
        attempt2Text,
        2,
        feedback1
      );
      setComparison(result.comparison);
      setStep('comparison');
      triggerConfetti();

      // Save to storage
      storageService.saveWritingSubmission({
        id: 'wrt-' + Date.now(),
        taskId: currentTask.id,
        taskTitle: currentTask.title,
        taskCategory: currentTask.category,
        prompt: currentTask.prompt,
        attempt1: attempt1Text,
        attempt1Feedback: feedback1,
        attempt2: attempt2Text,
        attempt2Comparison: result.comparison,
        date: new Date().toISOString().split('T')[0]
      });
    } catch (e) {
      console.error('Writing attempt 2 evaluation error:', e);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-rose-500/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-rose-200 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20">Section 13</span>
              <span>Writing Practice & Rewrite Comparison</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Academic & Professional Writing Coach
            </h1>
            <p className="mt-1 text-sm text-rose-100 max-w-xl">
              Write sentences, emails to professors, seminar scripts, and exam answers. Receive detailed feedback, rewrite, and compare Attempt 1 vs Attempt 2!
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs space-y-1">
            <span className="font-bold text-rose-200 block">Teaching Cycle</span>
            <span className="text-white/90 block">Draft → Error Diagnosis → Model Version → Rewrite → Compare</span>
          </div>
        </div>
      </div>

      {/* Task Selector Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 overflow-x-auto flex items-center space-x-2 no-scrollbar">
        {WRITING_TASKS.map((t, i) => (
          <button
            key={t.id}
            onClick={() => handleSelectTask(i)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center space-x-2 ${
              selectedTaskIndex === i
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600'
            }`}
          >
            <span>{t.category}: {t.title}</span>
          </button>
        ))}
      </div>

      {/* Task Prompt Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Task #{selectedTaskIndex + 1} • {currentTask.category}
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {currentTask.title}
            </h3>
          </div>

          <button
            onClick={() => setAttempt1Text(currentTask.sampleAttempt)}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline"
          >
            Load Common Student Draft
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
            {currentTask.prompt}
          </p>
          <p className="text-xs text-slate-500 italic">
            💡 Hint: {currentTask.hint}
          </p>
        </div>

        {/* STEP 1: Attempt 1 Submission */}
        {step === 'attempt1' && (
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Your First Attempt (Draft 1):
            </label>
            <textarea
              value={attempt1Text}
              onChange={(e) => setAttempt1Text(e.target.value)}
              placeholder="Write your answer in English here..."
              rows={5}
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 text-base"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSubmitAttempt1}
                disabled={isEvaluating || !attempt1Text.trim()}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit Attempt 1 for Feedback</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Feedback on Attempt 1 & Call to Rewrite */}
        {step === 'feedback1' && feedback1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                  Attempt 1 Diagnosis
                </span>
                <span className="text-sm font-black text-rose-600">
                  Initial Score: {feedback1.score}/10
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">Identified Error Patterns:</span>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                  {feedback1.errors.map((err: string, i: number) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-rose-200 dark:border-rose-900/50">
                <p className="text-xs font-semibold text-rose-900 dark:text-rose-200">
                  Grammar Rule: {feedback1.grammarPatterns}
                </p>
              </div>
            </div>

            {/* Model Version */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                Recommended Model Phrasing
              </span>
              <p className="text-sm text-slate-800 dark:text-slate-200 italic">
                {feedback1.modelVersion}
              </p>
            </div>

            {/* Call to Rewrite Action */}
            <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-blue-900 dark:text-blue-200">
                  Section 13 Rule: Now Rewrite It Yourself!
                </h4>
                <p className="text-xs text-blue-800 dark:text-blue-300 mt-0.5">
                  Do not copy-paste. Apply the feedback and write Attempt 2 from memory.
                </p>
              </div>

              <button
                onClick={handleStartRewrite}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all shrink-0 active:scale-95"
              >
                <span>Start Rewrite (Attempt 2) →</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Attempt 2 (Rewrite) */}
        {step === 'attempt2' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs space-y-1">
              <span className="font-bold text-slate-500">Your First Draft:</span>
              <p className="italic text-slate-600 dark:text-slate-400">"{attempt1Text}"</p>
            </div>

            <label className="block text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Your Second Attempt (Rewrite):
            </label>
            <textarea
              value={attempt2Text}
              onChange={(e) => setAttempt2Text(e.target.value)}
              placeholder="Rewrite your paragraph applying the grammar corrections..."
              rows={5}
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            />

            <div className="flex justify-end">
              <button
                onClick={handleSubmitAttempt2}
                disabled={isEvaluating || !attempt2Text.trim()}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all active:scale-95"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Evaluate Rewrite & Compare</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Attempt 1 vs Attempt 2 Side-by-Side Comparison (Section 13) */}
        {step === 'comparison' && comparison && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="w-6 h-6 text-emerald-600" />
                <div>
                  <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                    Measurable Writing Improvement!
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300">
                    {comparison.scoreImprovement}
                  </p>
                </div>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-600 text-white font-bold">
                Mastered!
              </span>
            </div>

            {/* Side by side cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-500 block">
                  First Attempt (Draft)
                </span>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-through">
                  "{attempt1Text}"
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-900 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">
                  Second Attempt (Mastered Rewrite)
                </span>
                <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                  "{attempt2Text}"
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl italic">
              Teacher's Remarks: "{comparison.praise}"
            </p>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => handleSelectTask((selectedTaskIndex + 1) % WRITING_TASKS.length)}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all"
              >
                Next Writing Task →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
