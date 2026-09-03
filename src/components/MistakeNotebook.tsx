import React, { useState } from 'react';
import {
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Search,
  Filter,
  Volume2,
  ArrowRight,
  BookOpen,
  Trophy,
  HelpCircle
} from 'lucide-react';
import { MistakeNotebookItem, MistakeCategory } from '../types';
import { storageService } from '../services/storageService';
import { speechService } from '../services/speechService';
import { triggerConfetti } from './Confetti';

export const MistakeNotebook: React.FC = () => {
  const [mistakes, setMistakes] = useState<MistakeNotebookItem[]>(() => storageService.getMistakes());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'unmastered' | 'mastered'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Smart Review Quiz state (Section 17)
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswerSelected, setQuizAnswerSelected] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const categories: MistakeCategory[] = [
    'Spelling',
    'Grammar',
    'Tense',
    'Vocabulary',
    'Preposition',
    'Article',
    'Subject-Verb Agreement',
    'Word Order',
    'Sentence Structure',
    'Natural English',
    'Pronunciation'
  ];

  const filteredMistakes = mistakes.filter(m => {
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || m.practiceStatus === selectedStatus;
    const matchesSearch =
      m.wrongWord.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.correctWord.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.originalSentence.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleToggleMastered = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'mastered' ? 'unmastered' : 'mastered';
    storageService.updateMistakeStatus(id, newStatus);
    const updated = storageService.getMistakes();
    setMistakes(updated);
    if (newStatus === 'mastered') {
      triggerConfetti();
    }
  };

  const handleSpeak = (text: string) => {
    speechService.speak(text, { rate: 0.9 });
  };

  // Start Smart Review Quiz (Section 17)
  const startSmartQuiz = () => {
    if (mistakes.length === 0) return;
    setIsQuizMode(true);
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setQuizAnswerSelected(null);
    setQuizFinished(false);
  };

  const currentQuizItem = mistakes[currentQuizIndex % mistakes.length];
  // Create two options: A = correct, B = wrong (or flipped)
  const options = currentQuizItem
    ? [
        {
          text: currentQuizItem.naturalExample || currentQuizItem.originalSentence.replace(currentQuizItem.wrongWord, currentQuizItem.correctWord),
          isCorrect: true
        },
        {
          text: currentQuizItem.originalSentence,
          isCorrect: false
        }
      ].sort(() => 0.5 - Math.random())
    : [];

  const handleSelectQuizOption = (index: number) => {
    if (quizAnswerSelected !== null) return;
    setQuizAnswerSelected(index);
    if (options[index].isCorrect) {
      setQuizScore(prev => prev + 1);
      triggerConfetti();
      storageService.updateMistakeStatus(currentQuizItem.id, 'mastered');
      setMistakes(storageService.getMistakes());
    }
  };

  const handleNextQuiz = () => {
    setQuizAnswerSelected(null);
    if (currentQuizIndex + 1 < Math.min(5, mistakes.length)) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-purple-500/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-purple-200 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20">Sections 16 & 17</span>
              <span>Mistake Notebook & Smart Review</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Personal Mistake Notebook
            </h1>
            <p className="mt-1 text-sm text-purple-100 max-w-xl">
              Track repeated Telugu-to-English error patterns, view grammar rules, and take targeted Smart Review quizzes to master them forever.
            </p>
          </div>

          <button
            onClick={startSmartQuiz}
            className="flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-white text-purple-700 hover:bg-purple-50 font-bold text-sm shadow-md transition-all active:scale-95 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Start Smart Review Quiz</span>
          </button>
        </div>
      </div>

      {/* Smart Review Quiz Modal / View */}
      {isQuizMode && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-purple-500/40 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Targeted Mistake Exercise ({currentQuizIndex + 1} of {Math.min(5, mistakes.length)})
              </h2>
            </div>
            <button
              onClick={() => setIsQuizMode(false)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold"
            >
              Exit Quiz
            </button>
          </div>

          {!quizFinished ? (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 block mb-1">
                  Target Error Topic: {currentQuizItem.category}
                </span>
                <p className="text-base font-medium text-slate-800 dark:text-slate-200">
                  Choose the grammatically natural sentence:
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {options.map((opt, idx) => {
                  const isSelected = quizAnswerSelected === idx;
                  let btnStyle = 'border-slate-200 dark:border-slate-700 hover:border-purple-500 bg-slate-50 dark:bg-slate-800/50';

                  if (quizAnswerSelected !== null) {
                    if (opt.isCorrect) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200';
                    } else if (isSelected) {
                      btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectQuizOption(idx)}
                      disabled={quizAnswerSelected !== null}
                      className={`w-full text-left p-4 rounded-2xl border-2 font-medium text-base transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>
                        <strong className="mr-2 text-purple-600">{idx === 0 ? 'A.' : 'B.'}</strong>
                        {opt.text}
                      </span>
                      {quizAnswerSelected !== null && opt.isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation after selection */}
              {quizAnswerSelected !== null && (
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 space-y-2 animate-fade-in">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-600 block">
                    Teacher's Explanation
                  </span>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {currentQuizItem.explanation}
                  </p>
                  <p className="text-xs font-mono text-slate-500 italic">
                    Rule: {currentQuizItem.grammarRule}
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={handleNextQuiz}
                      className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-colors"
                    >
                      Next Question →
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <Trophy className="w-16 h-16 text-amber-500 mx-auto animate-bounce" />
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                Quiz Completed!
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                You scored <strong>{quizScore}</strong> out of {Math.min(5, mistakes.length)}! Corrected items have been updated in your profile.
              </p>
              <button
                onClick={() => setIsQuizMode(false)}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-md"
              >
                Return to Notebook
              </button>
            </div>
          )}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mistakes, words, or sentences..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Categories</option>
              {categories.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="unmastered">Unmastered</option>
              <option value="mastered">Mastered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mistake Cards List */}
      <div className="space-y-4">
        {filteredMistakes.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-2">
            <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-700 dark:text-slate-300">No mistakes found</h3>
            <p className="text-xs text-slate-400">
              When you improve English in Mode A or talk in Teacher Mode, you can save tricky mistakes here to master them!
            </p>
          </div>
        ) : (
          filteredMistakes.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4 transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      Occurred {item.occurrences} time(s) • Added {item.dateAdded}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 pt-1">
                    <span className="text-base font-bold text-rose-600 line-through">
                      {item.wrongWord}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                    <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                      {item.correctWord}
                    </span>
                    <button
                      onClick={() => handleSpeak(item.correctWord)}
                      title="Listen"
                      className="text-slate-400 hover:text-purple-600 transition-colors"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleMastered(item.id, item.practiceStatus)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    item.practiceStatus === 'mastered'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{item.practiceStatus === 'mastered' ? 'Mastered' : 'Mark Mastered'}</span>
                </button>
              </div>

              {/* Sentences */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-sm space-y-1.5">
                <p className="text-slate-500 dark:text-slate-400 line-through text-xs">
                  Original: "{item.originalSentence}"
                </p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Natural English: "{item.naturalExample}"
                </p>
              </div>

              {/* Explanation & Rule */}
              <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400 bg-purple-50/50 dark:bg-purple-950/20 p-3 rounded-xl border border-purple-100 dark:border-purple-900/30">
                <p>
                  <strong className="text-purple-700 dark:text-purple-300">Explanation:</strong> {item.explanation}
                </p>
                {item.grammarRule && (
                  <p className="italic font-mono text-purple-900 dark:text-purple-200">
                    Rule: {item.grammarRule}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
