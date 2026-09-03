import React, { useState } from 'react';
import {
  Gamepad2,
  Sparkles,
  Trophy,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Volume2,
  ArrowRight,
  Flame,
  Award,
  HelpCircle,
  Zap
} from 'lucide-react';
import { soundService } from '../services/soundService';
import { speechService } from '../services/speechService';
import { triggerConfetti } from './Confetti';

interface SentenceChallenge {
  id: string;
  teluguPrompt: string;
  romanTelugu: string;
  context: string;
  correctTokens: string[];
  distractorTraps: { token: string; reason: string }[];
}

const CHALLENGES: SentenceChallenge[] = [
  {
    id: 'ch-1',
    teluguPrompt: 'నేను నిన్న కెమిస్ట్రీ ల్యాబ్‌కు వెళ్లాను.',
    romanTelugu: 'Nenu ninna chemistry lab ki vellaanu.',
    context: 'College Daily Life',
    correctTokens: ['I', 'went', 'to', 'the', 'chemistry', 'lab', 'yesterday.'],
    distractorTraps: [
      { token: 'am go', reason: '"am go" is incorrect. For past events, use simple past "went".' },
      { token: 'am went', reason: 'Never use auxiliary "am" with past verb "went".' }
    ]
  },
  {
    id: 'ch-2',
    teluguPrompt: 'మేము మా ప్రొఫెసర్‌తో ప్రాజెక్ట్ గురించి చర్చించాము.',
    romanTelugu: 'Memu maa professor tho project gurinchi charchinchaamu.',
    context: 'Academic Discussion',
    correctTokens: ['We', 'discussed', 'the', 'project', 'with', 'our', 'professor.'],
    distractorTraps: [
      { token: 'about', reason: 'Common Telugu trap! "Discuss" directly takes the object without the preposition "about".' }
    ]
  },
  {
    id: 'ch-3',
    teluguPrompt: 'నా పేరు కార్తీక్, నేను మొదటి సంవత్సరం కంప్యూటర్ సైన్స్ విద్యార్థిని.',
    romanTelugu: 'Naa peru Karthik, nenu first year CSE student ni.',
    context: 'Placement Self-Intro',
    correctTokens: ['My', 'name', 'is', 'Karthik,', 'a', 'first-year', 'CSE', 'student.'],
    distractorTraps: [
      { token: 'Myself', reason: 'Avoid starting formal introductions with reflexive "Myself". Say "My name is" or "I am".' }
    ]
  },
  {
    id: 'ch-4',
    teluguPrompt: 'అతనికి ప్రోగ్రామ్ ఎలా డీబగ్ చేయాలో తెలియదు.',
    romanTelugu: 'Athaniki program ela debug cheyaalo teliyadu.',
    context: 'Technical Lab Discussion',
    correctTokens: ['He', 'does', 'not', 'know', 'how', 'to', 'debug', 'code.'],
    distractorTraps: [
      { token: 'do not', reason: 'Subject-Verb Agreement! Third-person singular "He" takes "does not", never "do not".' }
    ]
  },
  {
    id: 'ch-5',
    teluguPrompt: 'నేను నిన్న నా ఫిజిక్స్ అసైన్‌మెంట్ పూర్తి చేశాను.',
    romanTelugu: 'Nenu ninna naa physics assignment poorthi chesaanu.',
    context: 'Assignment Submission',
    correctTokens: ['I', 'completed', 'my', 'physics', 'assignment', 'yesterday.'],
    distractorTraps: [
      { token: 'have completed', reason: 'Never use present perfect "have completed" with specific past time word "yesterday". Use simple past.' },
      { token: 'dided', reason: '"dided" is incorrect English.' }
    ]
  }
];

export const SentenceBuilderGame: React.FC = () => {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [availableTokens, setAvailableTokens] = useState<string[]>(() => {
    return prepareTokens(CHALLENGES[0]);
  });
  const [trapNotice, setTrapNotice] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  function prepareTokens(challenge: SentenceChallenge): string[] {
    const all = [...challenge.correctTokens, ...challenge.distractorTraps.map(d => d.token)];
    // Random shuffle
    return all.sort(() => 0.5 - Math.random());
  }

  const currentChallenge = CHALLENGES[challengeIndex % CHALLENGES.length];

  const handleTokenClick = (token: string) => {
    soundService.playPop();
    setTrapNotice(null);

    // Check if clicked token is a Telugu distractor trap
    const trap = currentChallenge.distractorTraps.find(t => t.token === token);
    if (trap) {
      soundService.playCorrection();
      setTrapNotice(`Trap Avoided! ${trap.reason}`);
      return;
    }

    // Move to selected
    const updatedSelected = [...selectedTokens, token];
    setSelectedTokens(updatedSelected);
    setAvailableTokens(prev => {
      const idx = prev.indexOf(token);
      if (idx !== -1) {
        const copy = [...prev];
        copy.splice(idx, 1);
        return copy;
      }
      return prev;
    });

    // Check if sentence matches target
    if (updatedSelected.length === currentChallenge.correctTokens.length) {
      const isCorrect = updatedSelected.every((tok, i) => tok === currentChallenge.correctTokens[i]);
      if (isCorrect) {
        soundService.playSuccess();
        triggerConfetti();
        setScore(prev => prev + 100);
        setStreak(prev => prev + 1);
        setIsCompleted(true);
        // Speak sentence
        speechService.speak(updatedSelected.join(' '), { rate: 0.95 });
      }
    }
  };

  const handleRemoveToken = (token: string, index: number) => {
    soundService.playPop();
    const updatedSelected = selectedTokens.filter((_, i) => i !== index);
    setSelectedTokens(updatedSelected);
    setAvailableTokens(prev => [...prev, token]);
    setIsCompleted(false);
  };

  const handleReset = () => {
    setSelectedTokens([]);
    setAvailableTokens(prepareTokens(currentChallenge));
    setTrapNotice(null);
    setIsCompleted(false);
  };

  const handleNextChallenge = () => {
    const nextIdx = (challengeIndex + 1) % CHALLENGES.length;
    setChallengeIndex(nextIdx);
    setSelectedTokens([]);
    setAvailableTokens(prepareTokens(CHALLENGES[nextIdx]));
    setTrapNotice(null);
    setIsCompleted(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-purple-500/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-purple-200 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20">Gamified Fluency</span>
              <span>Sentence Builder & Telugu Trap Defeater</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Interactive Sentence Builder
            </h1>
            <p className="mt-1 text-sm text-purple-100 max-w-xl">
              Tap word blocks in sequence to form natural English sentences. Watch out for common Telugu literal translation trap chips!
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <span className="text-[10px] uppercase font-bold text-purple-200 block">Score</span>
              <span className="text-xl font-black text-white">{score}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <span className="text-[10px] uppercase font-bold text-purple-200 block">Streak</span>
              <span className="text-xl font-black text-amber-300 flex items-center justify-center space-x-1">
                <Flame className="w-4 h-4 fill-amber-300" />
                <span>{streak}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
        {/* Challenge Goal in Telugu */}
        <div className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Target Meaning in Telugu (తెలుగు భావం):</span>
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              {currentChallenge.context}
            </span>
          </div>

          <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
            "{currentChallenge.teluguPrompt}"
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Roman Telugu: {currentChallenge.romanTelugu}
          </p>
        </div>

        {/* Selected Tokens (Your Built Sentence) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Your Sentence (Tap word chips to remove):
            </span>
            {selectedTokens.length > 0 && (
              <button
                onClick={handleReset}
                className="text-xs text-purple-600 hover:text-purple-700 font-bold flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          <div className="min-h-[75px] p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-wrap items-center gap-2">
            {selectedTokens.length === 0 ? (
              <span className="text-xs text-slate-400 italic">
                Tap the word blocks below in correct grammatical order...
              </span>
            ) : (
              selectedTokens.map((tok, i) => (
                <button
                  key={i}
                  onClick={() => handleRemoveToken(tok, i)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-sm transition-all active:scale-95 animate-fade-in"
                >
                  {tok}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Trap Alert Notice */}
        {trapNotice && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start space-x-2 text-xs text-rose-800 dark:text-rose-300 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="font-semibold">{trapNotice}</span>
          </div>
        )}

        {/* Success Banner */}
        {isCompleted && (
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-7 h-7 text-emerald-500 shrink-0" />
              <div>
                <h4 className="font-extrabold text-sm text-emerald-900 dark:text-emerald-100">
                  Perfect English Construction! (+100 XP)
                </h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  You avoided Telugu literal translation traps and built a natural sentence.
                </p>
              </div>
            </div>

            <button
              onClick={handleNextChallenge}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all shrink-0 active:scale-95"
            >
              <span>Next Challenge →</span>
            </button>
          </div>
        )}

        {/* Available Tokens (Scrambled Chips) */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Available Words (Beware of the red trap distractors!):
          </span>
          <div className="flex flex-wrap gap-2.5">
            {availableTokens.map((tok, i) => {
              const isTrap = currentChallenge.distractorTraps.some(d => d.token === tok);
              return (
                <button
                  key={i}
                  onClick={() => handleTokenClick(tok)}
                  className={`px-4 py-2.5 rounded-2xl font-bold text-sm shadow-xs transition-all active:scale-95 border-2 ${
                    isTrap
                      ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900 hover:bg-rose-100'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 hover:border-purple-500 hover:bg-purple-50'
                  }`}
                >
                  {tok}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
