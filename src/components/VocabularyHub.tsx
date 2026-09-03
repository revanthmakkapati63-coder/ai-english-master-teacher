import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  HelpCircle,
  Layers,
  ArrowRight,
  Bookmark
} from 'lucide-react';
import { VocabWord } from '../types';
import { VOCABULARY_LIST } from '../services/mockData';
import { speechService } from '../services/speechService';
import { triggerConfetti } from './Confetti';

export const VocabularyHub: React.FC = () => {
  const [words, setWords] = useState<VocabWord[]>(VOCABULARY_LIST);
  const [selectedContext, setSelectedContext] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWord, setSelectedWord] = useState<VocabWord>(VOCABULARY_LIST[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const contexts = ['B.Tech / Tech', 'Job Interview', 'Presentation', 'College Life', 'Professional'];

  const filtered = words.filter(w => {
    const matchesContext = selectedContext === 'all' || w.context === selectedContext;
    const matchesSearch =
      w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.teluguMeaning && w.teluguMeaning.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesContext && matchesSearch;
  });

  const handleSpeak = (text: string) => {
    setIsPlaying(true);
    speechService.speak(text, {
      rate: 0.85,
      onEnd: () => setIsPlaying(false)
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-teal-500/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-teal-200 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20">Section 14</span>
              <span>B.Tech & Career Vocabulary Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Professional Vocabulary Hub
            </h1>
            <p className="mt-1 text-sm text-teal-100 max-w-xl">
              Learn high-impact English words with syllable stress, Telugu translations, engineering collocations, and pronunciation playback.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs space-y-1">
            <span className="font-bold text-teal-200 block">Active Vocab Bank</span>
            <span className="text-white/90 block">Tailored for 1st Year B.Tech Seminars & Placements</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vocabulary, meaning, or Telugu terms..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedContext('all')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedContext === 'all'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              All Categories
            </button>
            {contexts.map((ctx, i) => (
              <button
                key={i}
                onClick={() => setSelectedContext(ctx)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedContext === ctx
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {ctx}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Word Cards List */}
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {filtered.map((w) => (
            <div
              key={w.id}
              onClick={() => setSelectedWord(w)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-1 ${
                selectedWord.id === w.id
                  ? 'border-teal-500 bg-teal-50/60 dark:bg-teal-950/30 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{w.word}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
                  {w.partOfSpeech}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">{w.meaning}</p>
              {w.teluguMeaning && (
                <p className="text-[11px] text-teal-700 dark:text-teal-400 font-medium line-clamp-1">
                  {w.teluguMeaning}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Right Column: Detailed Word Card */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                {selectedWord.context}
              </span>
              <div className="flex items-baseline space-x-3 mt-1">
                <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100">
                  {selectedWord.word}
                </h2>
                <span className="text-xs font-semibold text-slate-400 italic">
                  ({selectedWord.partOfSpeech})
                </span>
              </div>
            </div>

            <button
              onClick={() => handleSpeak(selectedWord.word)}
              disabled={isPlaying}
              className="p-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white shadow-md transition-all active:scale-95"
              title="Listen to pronunciation"
            >
              <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-bounce' : ''}`} />
            </button>
          </div>

          {/* Syllables & Stress */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Syllables
              </span>
              <span className="font-mono text-sm font-bold text-teal-600 dark:text-teal-400">
                {selectedWord.syllables}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Voice Stress Guide
              </span>
              <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">
                {selectedWord.stress}
              </span>
            </div>
          </div>

          {/* Meaning & Telugu Meaning */}
          <div className="space-y-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Definition
              </span>
              <p className="text-base text-slate-800 dark:text-slate-200 font-medium">
                {selectedWord.meaning}
              </p>
            </div>

            {selectedWord.teluguMeaning && (
              <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50">
                <span className="text-xs font-bold text-teal-800 dark:text-teal-300 block mb-0.5">
                  తెలుగు వివరణ (Telugu Meaning):
                </span>
                <p className="text-sm font-semibold text-teal-900 dark:text-teal-100">
                  {selectedWord.teluguMeaning}
                </p>
              </div>
            )}
          </div>

          {/* Natural Example */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Natural Sentence Usage
            </span>
            <p className="text-sm italic text-slate-800 dark:text-slate-200 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-l-4 border-teal-500">
              "{selectedWord.exampleSentence}"
            </p>
          </div>

          {/* Synonyms & Collocations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Synonyms
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedWord.synonyms.map((s, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Common Collocations
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedWord.collocations.map((c, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-medium border border-teal-200 dark:border-teal-900">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
