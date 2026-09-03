import React, { useState } from 'react';
import {
  Languages,
  X,
  Volume2,
  Mic,
  MicOff,
  Sparkles,
  BookOpen,
  HelpCircle,
  ArrowRight,
  Check,
  Globe
} from 'lucide-react';
import { StudentProfile } from '../types';
import { aiService } from '../services/aiService';
import { speechService } from '../services/speechService';
import { triggerConfetti } from './Confetti';

interface ExplainInMyLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  profile: StudentProfile;
}

export const ExplainInMyLanguageModal: React.FC<ExplainInMyLanguageModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  profile
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedLanguage, setSelectedLanguage] = useState<'Telugu' | 'Hindi' | 'Tamil' | 'Kannada'>('Telugu');
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanationResult, setExplanationResult] = useState<{
    nativeExplanation: string;
    romanExplanation?: string;
    simpleEnglish: string;
    example: string;
  } | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Sync initial query if opened with selected text
  React.useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      handleExplain(initialQuery);
    }
  }, [initialQuery, isOpen]);

  if (!isOpen) return null;

  const handleExplain = async (overrideQuery?: string) => {
    const textToExplain = (overrideQuery || query).trim();
    if (!textToExplain) return;

    setIsExplaining(true);
    setExplanationResult(null);

    try {
      const res = await aiService.explainInNativeLanguage(textToExplain, selectedLanguage, profile);
      setExplanationResult(res);
      triggerConfetti();
    } catch (err) {
      console.error('Explanation error:', err);
    } finally {
      setIsExplaining(false);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      const started = speechService.startListening(
        (transcript, isFinal) => {
          setQuery(transcript);
          if (isFinal) {
            setIsListening(false);
            handleExplain(transcript);
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

  const handleSpeakExplanation = () => {
    if (!explanationResult) return;
    setIsPlayingAudio(true);

    const langCode = selectedLanguage === 'Telugu' ? 'te-IN' :
                     selectedLanguage === 'Hindi' ? 'hi-IN' :
                     selectedLanguage === 'Tamil' ? 'ta-IN' : 'kn-IN';

    // Speak native explanation or Roman transliteration
    const textToSpeak = explanationResult.nativeExplanation || explanationResult.romanExplanation || explanationResult.simpleEnglish;

    speechService.speak(textToSpeak, {
      rate: 0.9,
      voiceLang: langCode,
      onEnd: () => setIsPlayingAudio(false)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-teal-700 via-emerald-700 to-blue-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-xl shadow-inner border border-white/20">
              🗣️
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-extrabold tracking-tight">
                  Explain in My Language
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-bold uppercase">
                  నా భాషలో వివరణ
                </span>
              </div>
              <p className="text-xs text-teal-100">
                Ask the AI to explain any English word, sentence, rule, or news in your mother tongue
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Selection Bar */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
          <span className="text-slate-400 uppercase tracking-wider text-[10px]">
            Target Language:
          </span>
          <div className="flex items-center space-x-1.5">
            {[
              { id: 'Telugu', label: 'తెలుగు (Telugu)' },
              { id: 'Hindi', label: 'हिंदी (Hindi)' },
              { id: 'Tamil', label: 'தமிழ் (Tamil)' },
              { id: 'Kannada', label: 'ಕನ್ನಡ (Kannada)' }
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id as any)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  selectedLanguage === lang.id
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Query Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              What do you want the AI to explain? (Type or Speak):
            </label>
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Explain past tense vs present perfect in Telugu, or paste any newspaper sentence..."
                rows={3}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm resize-none"
              />

              <div className="absolute right-3 bottom-3 flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  title={isListening ? 'Stop recording' : 'Speak your question'}
                  className={`p-2 rounded-xl transition-all ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-teal-100 hover:text-teal-700'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleExplain()}
                  disabled={isExplaining || !query.trim()}
                  className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isExplaining ? 'Explaining...' : 'Explain'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Common Doubts */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Quick Telugu Student Questions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Why is "am went" wrong in English?',
                'Difference between has and have?',
                'Why should I not say "Myself Karthik"?',
                'Why is "discussed about" incorrect?'
              ].map((sample, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuery(sample);
                    handleExplain(sample);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                >
                  "{sample}"
                </button>
              ))}
            </div>
          </div>

          {/* Explanation Output */}
          {explanationResult && (
            <div className="p-5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/50 space-y-4 animate-fade-in">
              {/* Header with audio speaker */}
              <div className="flex items-center justify-between border-b border-teal-200 dark:border-teal-900 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 flex items-center space-x-1.5">
                  <Languages className="w-4 h-4" />
                  <span>{selectedLanguage} వివరణ (Explanation in {selectedLanguage})</span>
                </span>

                <button
                  onClick={handleSpeakExplanation}
                  disabled={isPlayingAudio}
                  title="Listen to explanation in native language"
                  className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs active:scale-95"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                  <span>{isPlayingAudio ? 'Speaking...' : 'Listen in Telugu'}</span>
                </button>
              </div>

              {/* Native Language Script */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  {selectedLanguage} Script:
                </span>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                  {explanationResult.nativeExplanation}
                </p>
              </div>

              {/* Roman Transliteration (Roman Telugu) */}
              {explanationResult.romanExplanation && (
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-teal-200 dark:border-teal-900/50 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400 block">
                    Roman {selectedLanguage} (English Letters Transliteration):
                  </span>
                  <p className="text-xs font-mono text-slate-700 dark:text-slate-300">
                    "{explanationResult.romanExplanation}"
                  </p>
                </div>
              )}

              {/* Simple English Summary */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Simple English Takeaway:
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                  "{explanationResult.simpleEnglish}"
                </p>
              </div>

              {/* Example */}
              {explanationResult.example && (
                <div className="pt-2 border-t border-teal-200 dark:border-teal-900">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    Clear Example:
                  </span>
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    "{explanationResult.example}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 italic">
            Connecting Telugu thinking to fluent English thinking.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
