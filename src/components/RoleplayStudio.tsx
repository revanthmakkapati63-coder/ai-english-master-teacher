import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  Mic,
  MicOff,
  Volume2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  HelpCircle,
  RotateCcw,
  Bot,
  User,
  Coffee,
  Code2,
  Briefcase
} from 'lucide-react';
import { speechService } from '../services/speechService';
import { soundService } from '../services/soundService';
import { triggerConfetti } from './Confetti';

interface RoleplayTurn {
  speaker: 'partner' | 'student';
  text: string;
  suggestedOptions?: string[];
  feedbackTip?: string;
}

interface Scenario {
  id: string;
  title: string;
  partnerRole: string;
  icon: any;
  context: string;
  dialogue: RoleplayTurn[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 'sc-1',
    title: 'Explaining a Bug to Your C Programming Faculty',
    partnerRole: 'Prof. Sharma (Lab In-charge)',
    icon: Code2,
    context: 'You are in the computer lab and your program is throwing a Segmentation Fault.',
    dialogue: [
      {
        speaker: 'partner',
        text: 'Hello Karthik, I see your C program is terminating abruptly during execution. What seems to be the issue with your pointers?'
      },
      {
        speaker: 'student',
        text: 'Good afternoon Sir. My code throws a segmentation fault when accessing the array dynamically.',
        suggestedOptions: [
          'Good afternoon Sir. My code throws a segmentation fault when accessing the array dynamically.',
          'Sir, program is not coming. Error is there.',
          'Myself Karthik, pointer is giving problem sir.'
        ],
        feedbackTip: 'Option A is professional and specifies the technical error clearly.'
      },
      {
        speaker: 'partner',
        text: 'I see. Did you verify whether your malloc allocated sufficient memory before referencing the index?'
      },
      {
        speaker: 'student',
        text: 'Yes Sir, I checked the malloc return value, but I suspect I forgot to handle the null pointer check.',
        suggestedOptions: [
          'Yes Sir, I checked the malloc return value, but I suspect I forgot to handle the null pointer check.',
          'I checked it sir, but don\'t know what happened.'
        ]
      },
      {
        speaker: 'partner',
        text: 'Excellent observation! Add that null validation check and test it again. Good job articulating your problem.'
      }
    ]
  },
  {
    id: 'sc-2',
    title: 'Talking to a 4th-Year Senior About Placement Prep',
    partnerRole: 'Ananya (Final Year SDE Placed Senior)',
    icon: Briefcase,
    context: 'You met a senior outside the college auditorium who just cracked a top product company offer.',
    dialogue: [
      {
        speaker: 'partner',
        text: 'Hey Karthik! How is your first year of B.Tech going so far?'
      },
      {
        speaker: 'student',
        text: 'Hi Ananya! It is going great. Congratulations on your placement! I wanted to ask your advice on how to build strong fundamentals in Data Structures.',
        suggestedOptions: [
          'Hi Ananya! It is going great. Congratulations on your placement! I wanted to ask your advice on how to build strong fundamentals in Data Structures.',
          'Hi sister, you got job? How you got it?',
          'Myself Karthik. Give me company questions.'
        ],
        feedbackTip: 'Polite congratulations followed by a clear, respectful question sets a wonderful professional tone.'
      },
      {
        speaker: 'partner',
        text: 'Thank you so much! My biggest advice for first years: don\'t just memorize code. Implement every data structure from scratch in C or Python.'
      },
      {
        speaker: 'student',
        text: 'That makes complete sense. Should I prioritize competitive programming or building full-stack projects first?',
        suggestedOptions: [
          'That makes complete sense. Should I prioritize competitive programming or building full-stack projects first?',
          'Which one is good, coding or projects?'
        ]
      },
      {
        speaker: 'partner',
        text: 'Balance both! 1 hour of problem solving on LeetCode and 1 hour of project building. You will be unstoppable by your third year!'
      }
    ]
  }
];

export const RoleplayStudio: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<Scenario>(SCENARIOS[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userSpokenInput, setUserSpokenInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentTurn = activeScenario.dialogue[currentStepIndex];

  const handleSelectOption = (optText: string) => {
    soundService.playPop();
    setUserSpokenInput(optText);

    // Check feedback
    if (currentTurn.feedbackTip) {
      setFeedback(currentTurn.feedbackTip);
    }

    // Advance to next step
    setTimeout(() => {
      advanceDialogue();
    }, 1500);
  };

  const advanceDialogue = () => {
    if (currentStepIndex + 1 < activeScenario.dialogue.length) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      setUserSpokenInput('');
      setFeedback(null);

      // If next is partner, speak it
      const nextTurn = activeScenario.dialogue[nextIdx];
      if (nextTurn.speaker === 'partner') {
        speechService.speak(nextTurn.text, { rate: 0.95 });
      }
    } else {
      triggerConfetti();
      soundService.playSuccess();
    }
  };

  const handleVoiceSpeak = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      setUserSpokenInput('');
      const started = speechService.startListening(
        (transcript, isFinal) => {
          setUserSpokenInput(transcript);
          if (isFinal) {
            setIsListening(false);
            advanceDialogue();
          }
        },
        () => setIsListening(false),
        () => setIsListening(false)
      );
      if (started) setIsListening(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-rose-500/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-rose-200 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20">Interactive Dialogue</span>
              <span>B.Tech Campus Roleplay Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Real-World College Roleplay
            </h1>
            <p className="mt-1 text-sm text-rose-100 max-w-xl">
              Practice real conversational exchanges with lab faculty, placed seniors, and project teammates using voice or guided options.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => {
                  setActiveScenario(sc);
                  setCurrentStepIndex(0);
                  setUserSpokenInput('');
                  setFeedback(null);
                }}
                className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all border ${
                  activeScenario.id === sc.id
                    ? 'bg-white text-rose-700 border-white shadow-md'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }`}
              >
                {sc.partnerRole.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Roleplay Stage */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Scenario: {activeScenario.title}
            </span>
            <p className="text-xs text-slate-500 mt-0.5">{activeScenario.context}</p>
          </div>

          <button
            onClick={() => {
              setCurrentStepIndex(0);
              setUserSpokenInput('');
              setFeedback(null);
            }}
            className="text-xs text-slate-400 hover:text-slate-600 flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>
        </div>

        {/* Conversation Stream up to current step */}
        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
          {activeScenario.dialogue.slice(0, currentStepIndex + 1).map((turn, i) => {
            const isPartner = turn.speaker === 'partner';
            return (
              <div
                key={i}
                className={`flex items-start space-x-3 ${isPartner ? '' : 'flex-row-reverse space-x-reverse'}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-1 shadow-xs ${
                  isPartner ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {isPartner ? <Users className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className={`max-w-[80%] p-4 rounded-2xl text-sm shadow-xs ${
                  isPartner
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                    : 'bg-rose-600 text-white'
                }`}>
                  <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-1 mb-1.5 text-xs font-bold">
                    <span>{isPartner ? activeScenario.partnerRole : 'You (Karthik)'}</span>
                    {isPartner && (
                      <button
                        onClick={() => speechService.speak(turn.text)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p>{turn.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Response Controls (When it is student's turn) */}
        {currentTurn && currentTurn.speaker === 'student' && (
          <div className="p-5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300">
                Choose or Speak Your Response:
              </span>
              <button
                onClick={handleVoiceSpeak}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                }`}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isListening ? 'Listening...' : 'Speak via Mic'}</span>
              </button>
            </div>

            {/* Suggested branching response options */}
            {currentTurn.suggestedOptions && (
              <div className="space-y-2">
                {currentTurn.suggestedOptions.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(opt)}
                    className="w-full text-left p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/70 hover:border-rose-500 text-xs font-medium text-slate-800 dark:text-slate-200 transition-all hover:shadow-sm flex items-center justify-between group"
                  >
                    <span>{opt}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-colors" />
                  </button>
                ))}
              </div>
            )}

            {feedback && (
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-200 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{feedback}</span>
              </div>
            )}
          </div>
        )}

        {/* Completed Scenario */}
        {currentStepIndex >= activeScenario.dialogue.length - 1 && (
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400 text-center space-y-2 animate-fade-in">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <h4 className="font-extrabold text-base text-emerald-900 dark:text-emerald-100">
              Roleplay Scenario Completed!
            </h4>
            <p className="text-xs text-emerald-800 dark:text-emerald-300">
              You navigated this professional B.Tech conversation with confidence and clear vocabulary.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
