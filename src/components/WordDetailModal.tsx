import React, { useState } from 'react';
import { Volume2, BookmarkPlus, Check, X, BookOpen, AlertCircle } from 'lucide-react';
import { WordCorrection } from '../types';
import { speechService } from '../services/speechService';
import { storageService } from '../services/storageService';

interface WordDetailModalProps {
  correction: WordCorrection | null;
  originalSentence?: string;
  onClose: () => void;
  onAddedToNotebook?: () => void;
}

export const WordDetailModal: React.FC<WordDetailModalProps> = ({
  correction,
  originalSentence = '',
  onClose,
  onAddedToNotebook
}) => {
  const [saved, setSaved] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!correction) return null;

  const handleSpeak = () => {
    setIsPlaying(true);
    speechService.speak(correction.correctedWord, {
      rate: 0.75, // slow, deliberate pronunciation
      onEnd: () => setIsPlaying(false)
    });
  };

  const handleSendToNotebook = () => {
    storageService.addMistake({
      originalSentence: originalSentence || `I wrote: "${correction.originalWord}" instead of "${correction.correctedWord}"`,
      wrongWord: correction.originalWord,
      correctWord: correction.correctedWord,
      category: correction.category,
      explanation: correction.why,
      grammarRule: correction.grammarRule,
      naturalExample: correction.exampleSentence
    });
    setSaved(true);
    onAddedToNotebook?.();
    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  const spellingSpaced = correction.spellingBreakdown ||
    correction.correctedWord.toUpperCase().split('').join(' - ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-200" />
            <h3 className="font-bold text-lg">Word Learning Card</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Mistake Comparison */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-xs font-semibold text-rose-500 uppercase tracking-wider block">You wrote</span>
              <span className="text-base font-medium line-through text-slate-500 dark:text-slate-400">
                {correction.originalWord}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Correct Form</span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {correction.correctedWord}
              </span>
            </div>
          </div>

          {/* Category Badge */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
              {correction.category}
            </span>
            {correction.syllables && (
              <span className="text-xs font-mono px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {correction.syllables}
              </span>
            )}
          </div>

          {/* Spelling & Pronunciation */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Spelling</span>
              <span className="text-sm font-mono font-bold tracking-widest text-indigo-600 dark:text-indigo-400">
                {spellingSpaced}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Pronunciation</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {correction.stress || correction.correctedWord}
                </span>
              </div>
              <button
                onClick={handleSpeak}
                disabled={isPlaying}
                title="Listen to pronunciation"
                className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm active:scale-95"
              >
                <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
              </button>
            </div>
          </div>

          {/* Meaning */}
          {correction.meaning && (
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Meaning
              </span>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {correction.meaning}
              </p>
            </div>
          )}

          {/* Why & Grammar Rule */}
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <div className="text-xs space-y-1">
                <p className="font-semibold text-amber-900 dark:text-amber-200">
                  Why: {correction.why}
                </p>
                {correction.grammarRule && (
                  <p className="text-amber-800 dark:text-amber-300/90 italic">
                    Rule: {correction.grammarRule}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Example Sentence */}
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Natural Example
            </span>
            <p className="text-sm italic text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border-l-4 border-emerald-500">
              "{correction.exampleSentence}"
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handleSendToNotebook}
            disabled={saved}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm ${
              saved
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
            }`}
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved to Mistake Notebook!</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-4 h-4" />
                <span>Send to Mistake Notebook</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
