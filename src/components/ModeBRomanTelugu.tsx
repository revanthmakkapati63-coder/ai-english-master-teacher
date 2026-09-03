import React, { useState } from 'react';
import {
  Languages,
  ArrowRight,
  HelpCircle,
  Volume2,
  Sparkles,
  CheckCircle2,
  Info,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { RomanTeluguAnalysis } from '../types';
import { aiService } from '../services/aiService';
import { speechService } from '../services/speechService';

const SAMPLE_ROMAN_TELUGU = [
  'meru bagunnara',
  'naku ardham kaledu',
  'nenu college ki velthunnanu',
  'naku chala akali vestundi',
  'e roju physics lab undi',
  'assignments eppudu submit cheyali'
];

export const ModeBRomanTelugu: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<RomanTeluguAnalysis | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleConvert = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);

    try {
      const data = await aiService.analyzeRomanTelugu(inputText);
      setResult(data);
    } catch (err) {
      console.error('Roman Telugu analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSpeakEnglish = (text: string) => {
    setIsSpeaking(true);
    speechService.speak(text, {
      rate: 0.95,
      onEnd: () => setIsSpeaking(false)
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-orange-500/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-200 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20">Mode B</span>
              <span>Roman Telugu → Corrected Roman Telugu</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Roman Telugu Assistant
            </h1>
            <p className="mt-1 text-sm text-amber-100 max-w-xl">
              Express your thoughts in Telugu using English letters. Learn clean Roman transliteration and the natural English equivalent.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-xs space-y-1 max-w-xs">
            <div className="flex items-center space-x-1.5 font-bold text-amber-200">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>STRICT PEDAGOGICAL RULE</span>
            </div>
            <p className="text-white/90">
              Output is <strong>NEVER converted to Telugu script</strong>. It remains clean Roman Telugu with the English translation so you bridge your thoughts naturally to English!
            </p>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
          Enter Roman Telugu (e.g. "meru bagunnara", "naku ardham kaledu"):
        </label>

        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type Telugu in English letters here..."
            rows={3}
            className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-base resize-none transition-all"
          />

          <div className="absolute right-3 bottom-3">
            <button
              onClick={handleConvert}
              disabled={isAnalyzing || !inputText.trim()}
              className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-semibold transition-all shadow-sm active:scale-95"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Refine & Translate</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Sample Prompts */}
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Try standard conversational Roman Telugu:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_ROMAN_TELUGU.map((sample, i) => (
              <button
                key={i}
                onClick={() => {
                  setInputText(sample);
                  setResult(null);
                }}
                className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
              >
                "{sample}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result Card */}
      {result && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              <span>Roman Telugu Refinement & English Transition</span>
            </h2>
            <div className="flex items-center space-x-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Preserved in Roman Script</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Corrected Roman Telugu */}
            <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                Corrected Roman Telugu
              </span>
              <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-sans">
                {result.correctedRomanTelugu}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                Clean capitalization, proper vowel elongation (aa, ee, oo), and natural punctuation.
              </p>
            </div>

            {/* English Meaning */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  English Meaning & Phrasing
                </span>
                <button
                  onClick={() => handleSpeakEnglish(result.englishMeaning)}
                  disabled={isSpeaking}
                  title="Listen to English pronunciation"
                  className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm active:scale-95"
                >
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce' : ''}`} />
                </button>
              </div>
              <p className="text-xl font-extrabold text-emerald-900 dark:text-emerald-200">
                "{result.englishMeaning}"
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                This is how you say this thought naturally in English without word-for-word translation.
              </p>
            </div>
          </div>

          {/* Explanation & Telugu tip */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <div className="text-xs space-y-1">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {result.explanation}
                </p>
                {result.teluguTip && (
                  <p className="text-slate-600 dark:text-slate-400">
                    {result.teluguTip}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
