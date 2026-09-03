import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  Mic,
  MicOff,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  BookmarkPlus,
  RefreshCw,
  Info
} from 'lucide-react';
import { SentenceAnalysis, WordCorrection, StudentProfile } from '../types';
import { aiService } from '../services/aiService';
import { speechService } from '../services/speechService';
import { storageService } from '../services/storageService';
import { WordDetailModal } from './WordDetailModal';
import { triggerConfetti } from './Confetti';

interface ModeAImprovementProps {
  profile: StudentProfile;
}

const SAMPLE_SENTENCES = [
  'I am go to college yesterday.',
  'Myself Karthik from Vijayawada, doing B.Tech.',
  'He do not know how to write C code.',
  'I discussed about the project with sir.',
  'Today in lab we dided laser experiment.'
];

export const ModeAImprovement: React.FC<ModeAImprovementProps> = ({ profile }) => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SentenceAnalysis | null>(null);
  const [selectedCorrection, setSelectedCorrection] = useState<WordCorrection | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<WordCorrection | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [savedAll, setSavedAll] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<number | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    setActiveTooltip(null);
    setSavedAll(false);

    try {
      const result = await aiService.analyzeEnglish(inputText, profile);
      setAnalysis(result);
      if (result.wordCorrections.length === 0) {
        triggerConfetti();
      }
    } catch (e) {
      console.error('Analysis failed:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      const started = speechService.startListening(
        (transcript, isFinal) => {
          setInputText(transcript);
          if (isFinal) {
            setIsListening(false);
          }
        },
        (err) => {
          console.warn('Voice recognition notice:', err);
          setIsListening(false);
        },
        () => setIsListening(false)
      );
      if (started) setIsListening(true);
    }
  };

  const handleSpeak = (text: string) => {
    setIsSpeaking(true);
    speechService.speak(text, {
      rate: 0.95,
      onEnd: () => setIsSpeaking(false)
    });
  };

  // Tap & Long Press handlers for interactive chips (Section 4)
  const handleTouchStart = (corr: WordCorrection) => {
    const timer = setTimeout(() => {
      setSelectedCorrection(corr); // Long press opens detailed card
    }, 600);
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleChipClick = (corr: WordCorrection) => {
    // Quick tap toggles tooltip / popover
    if (activeTooltip?.originalWord === corr.originalWord) {
      setActiveTooltip(null);
    } else {
      setActiveTooltip(corr);
    }
  };

  const handleSaveAllToNotebook = () => {
    if (!analysis) return;
    analysis.wordCorrections.forEach(corr => {
      storageService.addMistake({
        originalSentence: analysis.originalSentence,
        wrongWord: corr.originalWord,
        correctWord: corr.correctedWord,
        category: corr.category,
        explanation: corr.why,
        grammarRule: corr.grammarRule,
        naturalExample: corr.exampleSentence
      });
    });
    setSavedAll(true);
    setTimeout(() => setSavedAll(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20">Mode A</span>
              <span>English → Improved English</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Interactive English Improvement
            </h1>
            <p className="mt-1 text-sm text-blue-100 max-w-xl">
              Type or speak any sentence. Every mistake is an interactive learning chip. Tap for a quick fix or long-press for the complete learning card!
            </p>
          </div>
          <div className="hidden sm:block text-right">
            <span className="text-xs text-blue-200 block">Student Profile</span>
            <span className="font-semibold">{profile.name} • 1st Year B.Tech</span>
            <span className="block text-xs text-emerald-300 font-mono mt-0.5">Level: {profile.currentLevel}</span>
          </div>
        </div>
      </div>

      {/* Input Box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
          Enter Your English Sentence:
        </label>

        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g. I am go to college yesterday for my chemistry lab..."
            rows={3}
            className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base resize-none transition-all"
          />

          <div className="absolute right-3 bottom-3 flex items-center space-x-2">
            <button
              type="button"
              onClick={handleVoiceInput}
              title={isListening ? 'Stop listening' : 'Speak sentence using microphone'}
              className={`p-2 rounded-xl transition-all shadow-sm ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-100 hover:text-blue-600'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !inputText.trim()}
              className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold transition-all shadow-sm active:scale-95"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Improve English</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Sample Chips */}
        <div className="pt-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Try a common B.Tech Telugu-speaker mistake:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_SENTENCES.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(sample);
                  setAnalysis(null);
                }}
                className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
              >
                "{sample}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Results Display */}
      {analysis && (
        <div className="space-y-6">
          {/* Section 4: Interactive Word Token Chips */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Info className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100">
                  Interactive Word Inspector
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                Tap for quick fix • Long-press / click card for word details
              </span>
            </div>

            {/* Render Tokens */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 leading-relaxed text-lg font-medium">
              {analysis.tokens.map((tok, i) => {
                if (tok.isError && tok.correction) {
                  const corr = tok.correction;
                  const isActive = activeTooltip?.originalWord === corr.originalWord;
                  return (
                    <span key={i} className="inline-block relative my-1 mx-0.5">
                      <button
                        onClick={() => handleChipClick(corr)}
                        onMouseDown={() => handleTouchStart(corr)}
                        onMouseUp={handleTouchEnd}
                        onTouchStart={() => handleTouchStart(corr)}
                        onTouchEnd={handleTouchEnd}
                        className={`px-2.5 py-0.5 rounded-lg font-bold transition-all underline decoration-wavy decoration-rose-500 cursor-pointer ${
                          isActive
                            ? 'bg-rose-500 text-white shadow-md'
                            : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-200'
                        }`}
                      >
                        {tok.text}
                      </button>

                      {/* Quick Popover on Tap (Section 4 TAP requirement) */}
                      {isActive && (
                        <div className="absolute left-0 bottom-full mb-2 z-30 w-72 p-3.5 rounded-2xl bg-slate-900 text-white shadow-2xl text-xs space-y-2 animate-fade-in">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                            <span className="text-rose-400 font-bold">You wrote: {corr.originalWord}</span>
                            <span className="text-emerald-400 font-bold">Correct: {corr.correctedWord}</span>
                          </div>
                          <p className="text-slate-300">
                            <strong className="text-blue-300">Mistake:</strong> {corr.category}
                          </p>
                          <p className="text-slate-300">
                            <strong className="text-amber-300">Why:</strong> {corr.why}
                          </p>
                          <p className="italic text-slate-400">
                            "{corr.exampleSentence}"
                          </p>
                          <div className="pt-1 flex items-center justify-between">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCorrection(corr);
                              }}
                              className="text-blue-400 hover:text-blue-300 font-semibold underline"
                            >
                              Detailed Word Card →
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTooltip(null);
                              }}
                              className="text-slate-400 hover:text-white"
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      )}
                    </span>
                  );
                }
                return <span key={i}>{tok.text}</span>;
              })}
            </div>

            {analysis.wordCorrections.length > 0 && (
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
                <span>Found {analysis.wordCorrections.length} learning point(s). Tap highlighted words above or see cards below.</span>
              </p>
            )}
          </div>

          {/* Section 3: Standard English Improvement Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                <span>Structured Analysis Breakdown</span>
              </h2>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSpeak(analysis.correctedSentence)}
                  disabled={isSpeaking}
                  title="Listen to corrected sentence"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 text-xs font-semibold transition-colors"
                >
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-blue-600 animate-bounce' : ''}`} />
                  <span>Listen</span>
                </button>

                {analysis.wordCorrections.length > 0 && (
                  <button
                    onClick={handleSaveAllToNotebook}
                    disabled={savedAll}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 text-xs font-semibold transition-colors"
                  >
                    <BookmarkPlus className="w-4 h-4" />
                    <span>{savedAll ? 'All Saved!' : 'Save to Notebook'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Specification Format: My sentence, Correct sentence, Why, Grammar rule, Natural English */}
            <div className="space-y-4">
              {/* My sentence */}
              <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block mb-1">
                  My Sentence
                </span>
                <p className="text-base text-slate-800 dark:text-slate-200">
                  {analysis.originalSentence}
                </p>
              </div>

              {/* Correct sentence */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                  Correct Sentence
                </span>
                <p className="text-lg font-bold text-emerald-900 dark:text-emerald-200">
                  {analysis.correctedSentence}
                </p>
              </div>

              {/* Why */}
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                <div className="flex items-start space-x-2">
                  <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                      Why (Clear Explanation)
                    </span>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {analysis.why}
                    </p>
                  </div>
                </div>
              </div>

              {/* Grammar Rule */}
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
                  Grammar Rule
                </span>
                <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                  {analysis.grammarRule}
                </p>
              </div>

              {/* Natural English */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                  Natural English Alternative
                </span>
                <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200 italic">
                  "{analysis.naturalEnglish}"
                </p>
              </div>
            </div>

            {/* Individual Word Cards list if any */}
            {analysis.wordCorrections.length > 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Detected Mistake Cards ({analysis.wordCorrections.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {analysis.wordCorrections.map((corr, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedCorrection(corr)}
                      className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-800/40 cursor-pointer transition-all hover:shadow-md flex items-center justify-between group"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-600 font-bold line-through">
                            {corr.originalWord}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-600 font-bold">
                            {corr.correctedWord}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
                          {corr.category} • Tap for detailed card
                        </span>
                      </div>
                      <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detailed Word Modal (Section 4 Long Press / Card view) */}
      <WordDetailModal
        correction={selectedCorrection}
        originalSentence={analysis?.originalSentence || inputText}
        onClose={() => setSelectedCorrection(null)}
      />
    </div>
  );
};
