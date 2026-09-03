import React, { useState } from 'react';
import {
  Volume2,
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Search,
  BookOpen,
  ArrowRight,
  Headphones
} from 'lucide-react';
import { PronunciationItem } from '../types';
import { PRONUNCIATION_LIST } from '../services/mockData';
import { speechService } from '../services/speechService';
import { triggerConfetti } from './Confetti';

export const PronunciationTrainer: React.FC = () => {
  const [selectedWord, setSelectedWord] = useState<PronunciationItem>(PRONUNCIATION_LIST[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customWordInput, setCustomWordInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSlowPlaying, setIsSlowPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [pronunciationScore, setPronunciationScore] = useState<number | null>(null);

  const filteredWords = PRONUNCIATION_LIST.filter(p =>
    p.word.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSpeak = (slow: boolean = false) => {
    if (slow) setIsSlowPlaying(true);
    else setIsPlaying(true);

    speechService.speak(selectedWord.word, {
      rate: slow ? 0.65 : 0.95,
      onEnd: () => {
        setIsPlaying(false);
        setIsSlowPlaying(false);
      }
    });
  };

  const handleTestPronunciation = () => {
    setUserTranscript('');
    setPronunciationScore(null);

    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      return;
    }

    const started = speechService.startListening(
      (transcript, isFinal) => {
        setUserTranscript(transcript);
        if (isFinal) {
          setIsListening(false);
          // Compare transcript with target word
          const cleanTarget = selectedWord.word.toLowerCase().trim();
          const cleanUser = transcript.toLowerCase().trim();

          if (cleanUser.includes(cleanTarget) || cleanTarget.includes(cleanUser)) {
            setPronunciationScore(95);
            triggerConfetti();
          } else {
            setPronunciationScore(65);
          }
        }
      },
      (err) => {
        console.warn('Speech err:', err);
        setIsListening(false);
      },
      () => setIsListening(false)
    );

    if (started) setIsListening(true);
  };

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customWordInput.trim()) return;

    // Build ad-hoc pronunciation card
    const word = customWordInput.trim();
    const syllables = word.toLowerCase().split(/(?<=[aeiouy])(?=[^aeiouy])/).join('-');

    const newItem: PronunciationItem = {
      id: 'custom-' + Date.now(),
      word,
      syllables,
      stressGuide: word.toUpperCase(),
      phoneticSpelling: `/${word.toLowerCase()}/`,
      definition: 'Custom word pronunciation test',
      example: `Practice saying "${word}" clearly in your presentations.`,
      tip: 'Listen to the audio pronunciation carefully and repeat twice.'
    };

    setSelectedWord(newItem);
    setCustomWordInput('');
    setUserTranscript('');
    setPronunciationScore(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20">Section 15</span>
              <span>Pronunciation Trainer & Syllable Stress</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              B.Tech Pronunciation Trainer
            </h1>
            <p className="mt-1 text-sm text-blue-100 max-w-xl">
              Master the exact syllables, primary stress, and clear accents for tricky engineering and academic words that Telugu speakers frequently mispronounce.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs space-y-1">
            <span className="font-bold text-sky-200 block">Active Voice Engine</span>
            <span className="text-white/90 block">Web Speech Synthesis & Speech-to-Text Recognition</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Word List */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              Tricky Academic Words
            </h3>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search words..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Word List */}
          <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
            {filteredWords.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedWord(item);
                  setUserTranscript('');
                  setPronunciationScore(null);
                }}
                className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between ${
                  selectedWord.id === item.id
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <div>
                  <span className="text-sm block">{item.word}</span>
                  <span className={`text-[11px] block font-mono ${selectedWord.id === item.id ? 'text-blue-100' : 'text-slate-400'}`}>
                    {item.stressGuide}
                  </span>
                </div>
                <Volume2 className="w-4 h-4 shrink-0 opacity-80" />
              </button>
            ))}
          </div>

          {/* Custom Word Input */}
          <form onSubmit={handleCustomSearch} className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Or test any other word:
            </label>
            <div className="flex space-x-1.5">
              <input
                type="text"
                value={customWordInput}
                onChange={(e) => setCustomWordInput(e.target.value)}
                placeholder="Type any word..."
                className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl"
              >
                Go
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Interactive Pronunciation Card (Section 15) */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          {/* Target Word & Phonetics */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Word & Stress Breakdown
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
                {selectedWord.word}
              </h2>
              <div className="flex items-center space-x-3 mt-2">
                <span className="font-mono text-sm px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-900">
                  {selectedWord.syllables}
                </span>
                <span className="text-sm font-semibold text-slate-500">
                  Phonetic: {selectedWord.phoneticSpelling}
                </span>
              </div>
            </div>

            {/* Audio Listen Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleSpeak(false)}
                disabled={isPlaying || isSlowPlaying}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
              >
                <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
                <span>Normal Speed</span>
              </button>

              <button
                onClick={() => handleSpeak(true)}
                disabled={isPlaying || isSlowPlaying}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all active:scale-95"
              >
                <Headphones className={`w-4 h-4 ${isSlowPlaying ? 'animate-bounce' : ''}`} />
                <span>Slow (0.7x)</span>
              </button>
            </div>
          </div>

          {/* Syllable Stress Guide */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Primary Stress Guide
            </span>
            <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
              {selectedWord.stressGuide}
            </p>
            <p className="text-xs text-slate-400">
              Capital letters indicate where you should emphasize your voice and hold the vowel slightly longer.
            </p>
          </div>

          {/* Telugu Speaker Common Pitfall & Pro Tip */}
          {selectedWord.commonTeluguSpeakerMistake && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <div className="text-xs space-y-1">
                  <span className="font-bold text-amber-900 dark:text-amber-200 block uppercase">
                    Common Telugu Speaker Pitfall
                  </span>
                  <p className="text-amber-800 dark:text-amber-300">
                    {selectedWord.commonTeluguSpeakerMistake}
                  </p>
                  <p className="font-semibold text-amber-900 dark:text-amber-100">
                    Pro Tip: {selectedWord.tip}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Example Sentence */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Natural Sentence Usage
            </span>
            <p className="text-sm italic text-slate-800 dark:text-slate-200 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-l-4 border-blue-500">
              "{selectedWord.example}"
            </p>
          </div>

          {/* Speaking Mic Test */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  Try Speaking This Word
                </h4>
                <p className="text-xs text-slate-400">
                  Click the mic and pronounce "{selectedWord.word}" out loud.
                </p>
              </div>

              <button
                onClick={handleTestPronunciation}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isListening ? 'Listening...' : 'Test My Pronunciation'}</span>
              </button>
            </div>

            {userTranscript && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 animate-fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">We heard:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    "{userTranscript}"
                  </span>
                </div>

                {pronunciationScore !== null && (
                  <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Pronunciation Match:
                    </span>
                    <span
                      className={`text-sm font-black ${
                        pronunciationScore >= 80 ? 'text-emerald-500' : 'text-amber-500'
                      }`}
                    >
                      {pronunciationScore >= 80 ? '✓ Excellent Clarity!' : 'Needs Practice on Stress'}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
