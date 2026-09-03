import React, { useState } from 'react';
import {
  Presentation,
  FileCheck,
  CheckCircle,
  Lightbulb,
  Volume2,
  ArrowRight,
  BookOpen,
  Sparkles,
  HelpCircle,
  Cpu
} from 'lucide-react';
import { speechService } from '../services/speechService';

export const PresentationTrainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'seminar' | 'exam'>('seminar');
  const [selectedPhase, setSelectedPhase] = useState<'intro' | 'transition' | 'diagram' | 'qa' | 'conclusion'>('intro');

  const seminarPhrases = {
    intro: [
      {
        bad: 'Myself Karthik. Today I am telling about Artificial Intelligence.',
        good: 'Good morning respected faculty and dear friends. My name is Karthik, and today I will be presenting on the fundamentals and real-world applications of Artificial Intelligence.',
        why: 'Avoid "Myself [Name]". Use a professional greeting, state your full name clearly, and outline the topic with active phrasing.'
      },
      {
        bad: 'Our topic is Cloud. Let us see first slide.',
        good: 'The objective of our presentation today is to explore scalable Cloud Computing architectures and how modern distributed systems handle data replication.',
        why: 'Specify the technical objective rather than just stating the generic keyword.'
      }
    ],
    transition: [
      {
        bad: 'Next slide is about sorting algorithms.',
        good: 'Now that we have covered the basics of array manipulation, let us transition to comparing the time complexities of various sorting algorithms.',
        why: 'Use signposting language: "Now that we have covered X, let us transition to Y".'
      },
      {
        bad: 'Over. Next one.',
        good: 'This brings us to the next crucial component of our system: database normalization.',
        why: '"This brings us to..." creates a natural bridge between two slides.'
      }
    ],
    diagram: [
      {
        bad: 'Here diagram is there you can see user and server.',
        good: 'As illustrated in this architectural diagram, the client application communicates with the backend REST API through secure JSON tokens.',
        why: 'Say "As illustrated in this diagram" or "This flowchart depicts" instead of "here diagram is there".'
      }
    ],
    qa: [
      {
        bad: 'I don\'t know sir.',
        good: 'That is an insightful question, sir. While our current implementation did not account for edge-case memory overflows, we plan to explore that optimization in our next iteration.',
        why: 'Show respect for the question, acknowledge boundaries professionally, and outline future steps.'
      }
    ],
    conclusion: [
      {
        bad: 'Done sir, thank you.',
        good: 'To summarize, we examined the performance tradeoffs and hardware requirements of this prototype. Thank you for your attention, and I would now be delighted to take any questions.',
        why: 'Summarize key takeaways and formally invite questions.'
      }
    ]
  };

  const examTemplates = [
    {
      topic: 'How to Write a High-Scoring Definition in B.Tech Exams',
      formula: 'Term + Category / Class + Specific Function / Distinction + Standard Example',
      exampleBad: 'Operating system is a software for running system.',
      exampleGood: 'An Operating System (OS) is system software that acts as an intermediary between computer hardware and application software, managing CPU scheduling, memory allocation, and I/O operations (e.g., Linux, Windows, macOS).',
      rules: [
        'Always start with the precise technical classification (system software, protocol, algorithm, hardware interface).',
        'State the primary objective or functional role.',
        'List at least two key components or properties.',
        'Always provide a concrete, industry-standard example.'
      ]
    },
    {
      topic: 'Point-by-Point Technical Comparison (e.g. TCP vs UDP)',
      formula: 'Feature / Parameter → Technology A → Technology B',
      exampleBad: 'TCP is slow and UDP is fast. TCP checks error UDP not checks.',
      exampleGood: '1. Connection Type: TCP is connection-oriented (requires 3-way handshake); UDP is connectionless.\n2. Reliability: TCP guarantees packet delivery via acknowledgments; UDP is best-effort.\n3. Overhead: TCP has higher latency (20-byte header); UDP has minimal overhead (8-byte header).\n4. Applications: TCP is used in HTTP/FTP; UDP is used in VoIP/live streaming.',
      rules: [
        'Use explicit tabular or bulleted parameter headings (Connection, Reliability, Overhead, Protocols).',
        'Avoid casual adjectives like "good" or "bad"; use "deterministic", "low-latency", "connection-oriented".'
      ]
    }
  ];

  const handleSpeak = (text: string) => {
    speechService.speak(text, { rate: 0.9 });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-200 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20">Sections 23 & 24</span>
              <span>B.Tech Presentations & Semester Exam English</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Presentation & Exam Excellence
            </h1>
            <p className="mt-1 text-sm text-indigo-100 max-w-xl">
              Master the exact phrases required for engineering seminars, project viva presentations, and structured, high-scoring B.Tech semester exam answers.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-white/10 p-1.5 rounded-2xl backdrop-blur-md">
            <button
              onClick={() => setActiveTab('seminar')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'seminar'
                  ? 'bg-white text-indigo-700 shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              🎤 Seminars & Viva
            </button>
            <button
              onClick={() => setActiveTab('exam')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'exam'
                  ? 'bg-white text-indigo-700 shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              📝 Exam English
            </button>
          </div>
        </div>
      </div>

      {/* SEMINAR & VIVA MODE */}
      {activeTab === 'seminar' && (
        <div className="space-y-6">
          {/* Phase Navigation */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-3 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-around overflow-x-auto no-scrollbar">
            {[
              { id: 'intro', label: '1. Opening Script' },
              { id: 'transition', label: '2. Slide Transitions' },
              { id: 'diagram', label: '3. Explaining Diagrams' },
              { id: 'qa', label: '4. Handling Q&A / Faculty' },
              { id: 'conclusion', label: '5. Conclusion & Wrap-up' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPhase(p.id as any)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                  selectedPhase === p.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Phrases Comparison */}
          <div className="space-y-4">
            {seminarPhrases[selectedPhase].map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Common mistake */}
                  <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600 block">
                      Common Telugu Student Habit
                    </span>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 line-through">
                      "{item.bad}"
                    </p>
                  </div>

                  {/* High-Impact Professional Alternative */}
                  <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-900/50 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                        Professional Presentation Standard
                      </span>
                      <button
                        onClick={() => handleSpeak(item.good)}
                        className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 p-1"
                        title="Listen to phrase"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-emerald-950 dark:text-emerald-100">
                      "{item.good}"
                    </p>
                  </div>
                </div>

                {/* Explanation */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-start space-x-2 text-xs text-slate-600 dark:text-slate-300">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Why:</strong> {item.why}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EXAM ENGLISH MODE */}
      {activeTab === 'exam' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-xs text-blue-900 dark:text-blue-200">
            <strong>Section 24 Rule:</strong> Never make technical English sound needlessly complex just to look fancy. Prioritize clarity, correct terminology, point-by-point structuring, and standard diagrams/examples.
          </div>

          <div className="space-y-6">
            {examTemplates.map((t, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-5"
              >
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Exam Strategy Template #{idx + 1}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {t.topic}
                  </h3>
                </div>

                {/* Structural Formula */}
                <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50">
                  <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase block mb-1">
                    Structured Blueprint:
                  </span>
                  <p className="font-mono text-xs font-bold text-indigo-900 dark:text-indigo-100">
                    {t.formula}
                  </p>
                </div>

                {/* Bad vs Good */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 space-y-1">
                    <span className="text-xs font-bold text-rose-600 block uppercase">
                      Weak / Low-Scoring Answer
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                      "{t.exampleBad}"
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-900 space-y-1">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block uppercase">
                      High-Scoring Structured Answer
                    </span>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                      {t.exampleGood}
                    </p>
                  </div>
                </div>

                {/* Rules */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Key Scoring Rules:
                  </span>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-4">
                    {t.rules.map((r, rIdx) => (
                      <li key={rIdx}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
