import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  FastForward,
  Rewind,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  HelpCircle,
  Phone,
  Newspaper,
  Briefcase,
  Headphones,
  PenTool,
  Gamepad2,
  Users,
  Languages,
  Key,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Layers,
  Search,
  Subtitles,
  ExternalLink,
  UserCheck
} from 'lucide-react';
import { AppMode } from '../types';
import { speechService } from '../services/speechService';
import { soundService } from '../services/soundService';

interface VideoChapter {
  id: string;
  number: number;
  title: string;
  featureName: string;
  durationSeconds: number;
  icon: any;
  category: string;
  appMode?: AppMode;
  specialAction?: 'call' | 'explain' | 'ai_settings';
  description: string;
  teluguSubtitle: string;
  narrationScript: string;
  demoUI: {
    badge: string;
    studentName: string;
    inputText: string;
    highlightedMistake?: string;
    correction: string;
    teacherTip: string;
    teluguExplanation: string;
    actionButtonText: string;
  };
  proTricks: {
    title: string;
    description: string;
    tag: string;
  }[];
}

const VIDEO_CHAPTERS: VideoChapter[] = [
  {
    id: 'chap-1',
    number: 1,
    title: 'Student Onboarding & Demo Profile',
    featureName: 'Personal Identity & Goals',
    durationSeconds: 20,
    icon: UserCheck,
    category: 'Getting Started',
    description: 'How demo student Kalyan Kumar sets up his profile with Telugu mother tongue, 1st Year B.Tech CSE at VR Siddhartha, and target placement goals.',
    teluguSubtitle: 'కళ్యాణ్ కుమార్ ప్రొఫైల్ సెటప్: విజయవాడ VR సిద్ధార్థ కళాశాల, B.Tech 1వ సంవత్సరం CSE విద్యార్థిగా ప్రారంభం.',
    narrationScript: 'Welcome to the AI English Master Teacher! Here, demo student Kalyan Kumar from Vijayawada sets his native language as Telugu, branch as B.Tech CSE, and target goal as campus placement interviews.',
    demoUI: {
      badge: 'Step 1: Student Profile',
      studentName: 'Kalyan Kumar (1st Year CSE)',
      inputText: 'College: VR Siddhartha Engineering College | Target: Campus Placements',
      correction: 'Confidence Score: 6/10 (Intermediate B1)',
      teacherTip: 'The AI adapts every question, grammar lesson, and technical mock interview to your specific engineering department!',
      teluguExplanation: 'మీ బ్రాంచ్ మరియు గోల్ ఆధారంగా AI బోధనా విధానం సర్దుబాటు చేయబడుతుంది.',
      actionButtonText: 'Save Profile'
    },
    proTricks: [
      {
        title: 'Accurate Confidence Calibration',
        description: 'Set your initial confidence honestly between 4 and 6. This ensures the AI starts with practical daily speaking without overwhelming you.',
        tag: 'Profile Trick'
      },
      {
        title: '1-Click Demo Profile Switch',
        description: 'You can reload the complete Kalyan Kumar demo student anytime from the Help & Settings panel with all sample progress and mistake notes pre-populated.',
        tag: 'Quick Demo'
      }
    ]
  },
  {
    id: 'chap-2',
    number: 2,
    title: 'Mode A: Interactive English Improvement',
    featureName: 'Sentence Correction & Word Cards',
    durationSeconds: 24,
    icon: Sparkles,
    category: 'Core Fluency',
    appMode: 'mode_a',
    description: 'Type any sentence. Mistakes appear as clickable chips. Tap for quick inline correction or long-press for word cards (pronunciation audio, spelling, and mistake notebook).',
    teluguSubtitle: 'మీరు రాసిన వాక్యంలో తప్పులు రంగురంగుల చిప్స్‌గా కనిపిస్తాయి. తక్షణ మార్పు కోసం ట్యాప్ చేయండి, లేదా నోట్‌బుక్‌లో దాచడానికి లాంగ్ ప్రెస్ చేయండి.',
    narrationScript: 'In Mode A, Kalyan types: I am go to college yesterday. The app highlights am go as an interactive chip. Tapping it fixes it to went, while a long-press opens the deep phonetics card and saves it into the Mistake Notebook.',
    demoUI: {
      badge: 'Mode A: Live Analysis',
      studentName: 'Kalyan Kumar',
      inputText: 'I am go to college yesterday for the workshop.',
      highlightedMistake: 'am go',
      correction: 'went',
      teacherTip: 'Past time markers like "yesterday" require the simple past tense ("went"), not present continuous ("am go").',
      teluguExplanation: '"నిన్న" (yesterday) గురించి మాట్లాడేటప్పుడు simple past (went) మాత్రమే వాడాలి.',
      actionButtonText: 'Tap Chip to Auto-Fix'
    },
    proTricks: [
      {
        title: 'The 0.6s Long-Press Secret',
        description: 'Hold any error chip for over half a second. A comprehensive modal appears with syllable pronunciation, phonetic audio, and a 1-tap button to save it to your Mistake Notebook.',
        tag: 'Interaction Trick'
      },
      {
        title: 'Voice Mic Dictation',
        description: 'Click the Microphone button to speak your sentence aloud instead of typing. This trains both your spoken sentence formulation and pronunciation.',
        tag: 'Speaking Trick'
      }
    ]
  },
  {
    id: 'chap-3',
    number: 3,
    title: 'Mode B: Roman Telugu Assistant',
    featureName: 'Roman Telugu → Natural English Phrasing',
    durationSeconds: 22,
    icon: Languages,
    category: 'Bilingual Bridge',
    appMode: 'mode_b',
    description: 'Type thoughts in Roman Telugu (e.g. "meru repu lab ki vasthara"). Strict rule: output stays in Roman Telugu (never Telugu script) and provides natural English phrasing.',
    teluguSubtitle: 'మీ ఆలోచనలను ఇంగ్లీష్ అక్షరాలలో తెలుగుగా రాయండి. AI దానిని సహజమైన ఇంగ్లీష్ వాక్యంగా ఎలా మార్చాలో స్పష్టంగా నేర్పుతుంది.',
    narrationScript: 'In Mode B, when Kalyan writes in Roman Telugu, meru repu lab ki vasthara, the assistant keeps the Roman Telugu intact and teaches the natural English equivalent: Are you coming to the lab tomorrow?',
    demoUI: {
      badge: 'Mode B: Roman Telugu Bridge',
      studentName: 'Kalyan Kumar',
      inputText: 'meru repu lab ki vasthara, assignment discuss cheddam',
      correction: 'Are you coming to the lab tomorrow? Let us discuss the assignment.',
      teacherTip: 'Telugu sentence order is Subject + Object + Verb (SOV). English requires Subject + Verb + Object (SVO). Remember to place the verb first!',
      teluguExplanation: 'తెలుగులో క్రియ (Verb) చివర వస్తుంది, కానీ ఇంగ్లీష్‌లో సబ్జెక్ట్ తర్వాత వెంటనే క్రియ రావాలి.',
      actionButtonText: 'Convert Thought'
    },
    proTricks: [
      {
        title: 'The SOV to SVO Formula',
        description: 'In Telugu: "Nenu (S) assignment (O) chesanu (V)". In English: "I (S) did (V) the assignment (O)". Placing the action right after the person immediately creates natural English.',
        tag: 'Grammar Hack'
      },
      {
        title: 'Clean Transliteration',
        description: 'Use standard Roman Telugu spelling without special symbols. Mode B understands colloquial Telugu slang, engineering college jargon, and informal chat words.',
        tag: 'Input Tip'
      }
    ]
  },
  {
    id: 'chap-4',
    number: 4,
    title: 'Mode C: Master Teacher Conversational Coach',
    featureName: 'AI Tutor Chat & Slash Commands',
    durationSeconds: 25,
    icon: HelpCircle,
    category: 'AI Tutor',
    appMode: 'mode_c',
    description: 'Guided interactive tutor with voice input, text-to-speech, and commands like /lesson, /quiz, /vocab, /speaking, /interview, and /dailysystem.',
    teluguSubtitle: 'AI మాస్టర్ టీచర్‌తో మాట్లాడండి. /lesson, /quiz, /interview వంటి కమాండ్లతో రోజువారీ 20 నిమిషాల శిక్షణ తీసుకోండి.',
    narrationScript: 'Mode C is Kalyan\'s personal conversational tutor. By typing slash commands like slash interview or slash quiz, the teacher challenges Kalyan with instant placement drills and responds with spoken audio.',
    demoUI: {
      badge: 'Mode C: Master Teacher',
      studentName: 'Kalyan Kumar',
      inputText: '/quiz tenses in technical viva',
      correction: 'Teacher: "Question 1: How would you explain your Python mini-project using the past perfect tense?"',
      teacherTip: 'Do not just read the teacher\'s answer! Speak your reply aloud using the mic to build muscle memory.',
      teluguExplanation: 'టీచర్ అడిగిన ప్రశ్నకు మైక్రోఫోన్ ద్వారా మాట్లాడి జవాబు ఇవ్వండి.',
      actionButtonText: 'Send Command'
    },
    proTricks: [
      {
        title: 'Power Slash Commands Cheat Sheet',
        description: 'Type `/lesson` for a 5-min concept, `/quiz` for 3 rapid MCQs, `/vocab` for 3 placement words, `/speaking` for an oral prompt, and `/progress` for your score report.',
        tag: 'Command Shortcuts'
      },
      {
        title: 'Auto-Listen & Speech Speed',
        description: 'Adjust the speech rate in Settings to 0.95x or 0.9x for the most authentic and easy-to-understand Indian English teacher accent.',
        tag: 'Audio Tip'
      }
    ]
  },
  {
    id: 'chap-5',
    number: 5,
    title: '📞 Hands-Free Live Voice Call',
    featureName: 'Real-Time AI Telephone Call',
    durationSeconds: 26,
    icon: Phone,
    category: 'Oral Fluency',
    specialAction: 'call',
    description: 'Simulate a real phone call with your teacher! Teacher speaks out loud, auto-listens to your voice hands-free, transcribes speech, and flags Telugu slips on the fly.',
    teluguSubtitle: 'రియల్ ఫోన్ కాల్ లాగా AI టీచర్‌తో మాట్లాడండి. బటన్లు నొక్కాల్సిన పని లేకుండా హ్యాండ్స్-ఫ్రీగా ఆటోమేటిక్ సంభాషణ జరుగుతుంది.',
    narrationScript: 'In the Live Voice Call, Kalyan puts on earphones and talks to the teacher hands-free. As Kalyan speaks, the live audio waveform moves, and the teacher provides instant gentle correction badges without interrupting his flow.',
    demoUI: {
      badge: 'Live Call in Progress (01:14)',
      studentName: 'Kalyan Kumar (Speaking into mic)',
      inputText: '"Sir, in our C programming lab, myself wrote the pointer code."',
      highlightedMistake: 'myself wrote',
      correction: 'Gentle Slip Flag: Say "I wrote" instead of "myself wrote".',
      teacherTip: 'Hands-free turn taking is active. Speak at your natural pace—the teacher detects your voice automatically!',
      teluguExplanation: '"నేను రాశాను" అనడానికి "I wrote" అనాలి; "myself wrote" అనకూడదు.',
      actionButtonText: 'End Call (Red Button)'
    },
    proTricks: [
      {
        title: 'The Earphone Advantage',
        description: 'Always wear earphones with a built-in microphone during the Live Call. This prevents the teacher’s speaker audio from looping back into your mic and gives seamless auto turn-taking.',
        tag: 'Hardware Pro-Tip'
      },
      {
        title: 'Native Fluency Fillers',
        description: 'If you need a 2-second pause while thinking, use fillers like "Well...", "Let me consider...", or "From my perspective..." instead of long silences.',
        tag: 'Placement Hack'
      }
    ]
  },
  {
    id: 'chap-6',
    number: 6,
    title: '📸 Newspaper Photo Reader & GK Coach',
    featureName: 'On-Device OCR & Oral Pronunciation',
    durationSeconds: 24,
    icon: Newspaper,
    category: 'Reading & GK',
    appMode: 'newspaper',
    description: 'Snap a photo of The Hindu or Times of India. On-device OCR extracts text, evaluates oral reading pronunciation, calculates WPM, and provides Telugu explanations.',
    teluguSubtitle: 'ఇంగ్లీష్ న్యూస్‌పేపర్ ఫోటో తీయండి. AI టెక్స్ట్‌ని చదివి, మీ ఉచ్చారణను సరిదిద్ది, తెలుగులో వార్త సారాంశాన్ని వివరిస్తుంది.',
    narrationScript: 'Kalyan uses his camera to photograph an editorial from The Hindu. The OCR extracts the paragraphs, lets Kalyan read them aloud into the microphone, scores his pronunciation at 94%, and gives an instant Telugu summary.',
    demoUI: {
      badge: 'The Hindu Editorial • OCR Scanned',
      studentName: 'Kalyan Kumar',
      inputText: '"ISRO successfully launched the meteorological satellite into geosynchronous transfer orbit..."',
      correction: 'Reading Score: 94% | Speed: 135 WPM (Words Per Minute)',
      teacherTip: 'Pacing is excellent. Focus on stress on "geo-SYN-chronous" and "me-te-or-o-LOG-i-cal".',
      teluguExplanation: 'ఈ వార్త సారాంశం: భారత అంతరిక్ష పరిశోధనా సంస్థ (ISRO) వాతావరణ ఉపగ్రహాన్ని కక్ష్యలోకి విజయవంతంగా ప్రవేశపెట్టింది.',
      actionButtonText: 'Read Aloud into Mic'
    },
    proTricks: [
      {
        title: 'The 3-Paragraph Sweet Spot',
        description: 'For 99% OCR accuracy, do not photograph the entire broadsheet newspaper page. Zoom into 2 to 3 paragraphs with good overhead room lighting.',
        tag: 'Camera Trick'
      },
      {
        title: 'Shadowing Technique',
        description: 'Click "Listen to Teacher Read" first, then record your own voice to match the native rhythm and sentence pauses.',
        tag: 'Reading Hack'
      }
    ]
  },
  {
    id: 'chap-7',
    number: 7,
    title: '💼 B.Tech Mock Interview Simulator',
    featureName: '8-Rubric Scorecard & Placement Prep',
    durationSeconds: 25,
    icon: Briefcase,
    category: 'Placements',
    appMode: 'interview',
    description: '1-on-1 placement interviews (HR, Technical, Projects). Features 8-rubric scoring (/10), Strengths, Weaknesses, Model Answers, and a Retry progress tracker.',
    teluguSubtitle: 'క్యాంపస్ ఇంటర్వ్యూల కోసం నిజమైన అనుకరణ: 8 కొలమానాలలో మార్కులు (/10), బలహీనతలు, మరియు మోడల్ జవాబులు.',
    narrationScript: 'Here, Kalyan practices an HR Interview round. He answers: Tell me about yourself. The simulator generates an 8-criteria scorecard evaluating technical depth, grammar, body language cues, and fluency with a 1-click retry option.',
    demoUI: {
      badge: 'Placement Interview Simulator',
      studentName: 'Kalyan Kumar',
      inputText: 'Question: "Tell me about a challenging bug you fixed in your 1st-year C project."',
      correction: 'Overall Score: 8.5/10 (Grammar: 8/10, Technical Clarity: 9/10, Fluency: 8.5/10)',
      teacherTip: 'Use the STAR technique: Situation, Task, Action, and Result to explain your technical projects clearly.',
      teluguExplanation: 'ప్రాజెక్ట్ సమస్యలను వివరించేటప్పుడు పరిస్థితి, మీరు తీసుకున్న చర్య, మరియు సాధించిన ఫలితాన్ని క్రమపద్ధతిలో చెప్పండి.',
      actionButtonText: 'Generate 8-Rubric Report'
    },
    proTricks: [
      {
        title: 'The STAR Method for Engineering Viva',
        description: 'Break technical answers into: Situation ("In our C lab"), Task ("Fixing segmentation fault"), Action ("Used GDB debugger to check pointer bounds"), Result ("Achieved clean memory execution").',
        tag: 'Interview Gold'
      },
      {
        title: 'Retry Comparison Tracker',
        description: 'Never stop after one attempt! Click "Retry This Question" to implement the model answer and watch your score climb from 6 to 9.',
        tag: 'Score Booster'
      }
    ]
  },
  {
    id: 'chap-8',
    number: 8,
    title: '🎧 Pronunciation & Syllable Trainer',
    featureName: 'Technical Words & Syllable Stress',
    durationSeconds: 22,
    icon: Headphones,
    category: 'Pronunciation',
    appMode: 'pronunciation',
    description: 'Master tricky engineering words (Entrepreneur, Hierarchy, Architecture, Colleague) with syllable stress guides, slow 0.7x audio, and microphone scoring.',
    teluguSubtitle: 'కష్టమైన సాంకేతిక పదాల ఉచ్చారణ: అక్షర విభజన (Syllables), 0.7x నెమ్మది ఆడియో, మరియు మైక్రోఫోన్ పరీక్ష.',
    narrationScript: 'Kalyan trains on tricky words like Entrepreneur and Architecture. He listens to the slow 0.7x audio, observes the highlighted stressed syllable, and speaks into the mic to earn a 96% pronunciation accuracy match.',
    demoUI: {
      badge: 'Syllable Stress Studio',
      studentName: 'Kalyan Kumar',
      inputText: 'Word: "Architecture" [AHR-ki-tek-cher]',
      correction: 'Microphone Match: 96% Match! (Correct Syllable Stress on First Syllable)',
      teacherTip: 'Notice that "ch" sounds like "k" in Architecture, not like "ch" in chocolate.',
      teluguExplanation: 'Architecture లో "ch" ను "క్" లాగా పలకాలి (ఆర్కిటెక్చర్).',
      actionButtonText: 'Play 0.7x Slow Audio'
    },
    proTricks: [
      {
        title: 'The Stressed Syllable Rule',
        description: 'In English, CAPITALIZED syllables in our guides indicate higher volume and pitch (e.g., `col-LEAGUE`, not `colleague-u`). Give that syllable extra emphasis.',
        tag: 'Accent Hack'
      },
      {
        title: '0.7x Slow-Mo Training',
        description: 'Listen at 0.7x twice before speaking. It trains your ear to catch subtle vowel endings that Telugu speakers often swallow.',
        tag: 'Ear Training'
      }
    ]
  },
  {
    id: 'chap-9',
    number: 9,
    title: '✍️ Writing Practice & Rewrite Comparison',
    featureName: 'Attempt 1 vs Attempt 2 Side-by-Side',
    durationSeconds: 22,
    icon: PenTool,
    category: 'Writing',
    appMode: 'writing',
    description: 'Practice college leave emails, technical seminar scripts, and exam answers. Compare Attempt 1 vs Attempt 2 to see measurable score gains.',
    teluguSubtitle: 'కాలేజ్ ఈమెయిల్స్ మరియు ల్యాబ్ రికార్డులు రాయడం ప్రాక్టీస్ చేయండి. మొదటి మరియు రెండవ ప్రయత్నాల పోలికతో మెరుగుపడండి.',
    narrationScript: 'Kalyan drafts an email to his Head of Department requesting lab attendance. Attempt 1 receives an 82% score with 3 tips. When Kalyan rewrites it, Attempt 2 jumps to 96% with full professional tone.',
    demoUI: {
      badge: 'Email Writing: Attempt 1 vs Attempt 2',
      studentName: 'Kalyan Kumar',
      inputText: 'Attempt 1: "Respected Sir, I am unable to attend lab due to fever kindly grant leave."',
      correction: 'Attempt 2: "Dear Professor, I am writing to formally request leave of absence from today\'s lab due to fever..."',
      teacherTip: 'Score jumped from 78% → 94%! Professional salutation and formal sentence structure improved significantly.',
      teluguExplanation: 'అధికారిక ఈమెయిల్స్ రాసేటప్పుడు గౌరవప్రదమైన ప్రారంభం మరియు స్పష్టమైన కారణం ఉండాలి.',
      actionButtonText: 'Compare Rewrites'
    },
    proTricks: [
      {
        title: 'Avoid Direct Word-for-Word Translation',
        description: 'Do not write Telugu sentences in your mind and replace words one-by-one. Think of the intention (Requesting leave) and use standard English opening phrases.',
        tag: 'Writing Tip'
      }
    ]
  },
  {
    id: 'chap-10',
    number: 10,
    title: '🎮 Sentence Builder & Telugu Trap Game',
    featureName: 'Gamified Word Blocks & Streak XP',
    durationSeconds: 20,
    icon: Gamepad2,
    category: 'Gamification',
    appMode: 'game',
    description: 'Gamified puzzle where you tap word blocks in sequence to form sentences while dodging common Telugu translation traps. Earn XP and streaks!',
    teluguSubtitle: 'పదాల బ్లాకులను పేర్చి సహజమైన వాక్యాలను రూపొందించే గేమ్. తెలుగు అనువాదపు తప్పుల నుండి తప్పించుకోండి!',
    narrationScript: 'In the Sentence Builder Game, Kalyan arranges word chips in order while avoiding distractors like "did went". Solving it correctly triggers confetti, awards 50 XP, and keeps his 5-day daily streak alive.',
    demoUI: {
      badge: 'Sentence Builder • Level 3',
      studentName: 'Kalyan Kumar (Streak: 5 Days 🔥)',
      inputText: 'Trap: [did went] ❌ vs [went] ✅',
      correction: 'Completed Sentence: "She went to the library to study data structures."',
      teacherTip: 'Correct! "Did" is already past tense, so pairing it with "went" creates a double past tense trap.',
      teluguExplanation: '"Did" తో పాటు ఎప్పుడూ మొదటి రూపం verb (V1) మాత్రమే రావాలి (did go).',
      actionButtonText: 'Tap Word Blocks'
    },
    proTricks: [
      {
        title: 'The "Did" Trap Rule',
        description: 'Never say "did went" or "did saw". The golden formula is `Did + Base Verb (V1)` = "Did you go?" or "I did go".',
        tag: 'Trap Buster'
      }
    ]
  },
  {
    id: 'chap-11',
    number: 11,
    title: '🎭 B.Tech Campus Roleplay Studio',
    featureName: 'Real College Dialogue Simulation',
    durationSeconds: 22,
    icon: Users,
    category: 'Roleplay',
    appMode: 'roleplay',
    description: 'Practice realistic college dialogues: explaining code bugs to lab professors or asking 4th-year seniors for campus placement advice.',
    teluguSubtitle: 'కాలేజ్ ప్రొఫెసర్లు మరియు సీనియర్లతో మాట్లాడే సంభాషణల అనుకరణ. ల్యాబ్ వైవాలో ధైర్యంగా మాట్లాడండి.',
    narrationScript: 'Kalyan simulates explaining a segmentation fault bug to his C programming lab faculty. The AI acts as the professor, testing Kalyan\'s confidence and academic technical English.',
    demoUI: {
      badge: 'Roleplay: Lab Faculty Viva',
      studentName: 'Kalyan Kumar (Student Role)',
      inputText: '"Professor, I traced the memory allocation error to an uninitialized pointer on line 42."',
      correction: 'Professor: "Good catch, Kalyan. Now show me how you will free the allocated memory using free()."',
      teacherTip: 'Polite, clear, and technically precise. Your viva score would be an easy 10/10.',
      teluguExplanation: 'ల్యాబ్ ప్రొఫెసర్‌తో మాట్లాడేటప్పుడు కోడ్ లైన్ నంబర్లు మరియు ఖచ్చితమైన టెక్నికల్ పదాలు వాడండి.',
      actionButtonText: 'Simulate Response'
    },
    proTricks: [
      {
        title: 'Technical Precision Over Long Sentences',
        description: 'In engineering vivas, professors appreciate concise answers with proper keywords (pointers, recursion, complexity) rather than circular descriptions.',
        tag: 'Viva Hack'
      }
    ]
  },
  {
    id: 'chap-12',
    number: 12,
    title: '🗣️ Tell in My Language / నా భాషలో వివరణ',
    featureName: 'Instant Bilingual Rescue with Native Audio',
    durationSeconds: 20,
    icon: Languages,
    category: 'Bilingual Support',
    specialAction: 'explain',
    description: 'Stuck anywhere? Ask the AI to explain in Telugu (తెలుగు), Hindi, Tamil, or Kannada with Roman transliteration and native voice playback!',
    teluguSubtitle: 'ఎక్కడైనా సందేహం వస్తే, వెంటనే నా భాషలో బటన్ నొక్కి తెలుగులో స్పష్టమైన వివరణ మరియు ఆడియో వినండి.',
    narrationScript: 'Whenever Kalyan feels confused by an English grammar term, he taps the floating Tell in Telugu button. The AI instantly breaks down the rule in simple Telugu with audio pronunciation.',
    demoUI: {
      badge: 'Bilingual Explainer: Telugu Active',
      studentName: 'Kalyan Kumar',
      inputText: 'Query: "What is the difference between \'since\' and \'for\'?"',
      correction: 'Telugu: "Since అనేది ప్రారంభ సమయానికి వాడాలి (Since 2024). For అనేది మొత్తం కాల వ్యవధికి వాడాలి (For 3 hours)."',
      teacherTip: 'Click the Listen in Telugu button to hear natural native Telugu explanation audio.',
      teluguExplanation: 'కాల వ్యవధి మొత్తం (duration) అయితే "for", నిర్దిష్ట ప్రారంభ సమయం (point of time) అయితే "since".',
      actionButtonText: 'Listen in Telugu 🔊'
    },
    proTricks: [
      {
        title: 'Floating Action Button',
        description: 'The Telugu explanation button floats on every screen at the bottom right. You can tap it without leaving your current lesson or mock test.',
        tag: 'Quick Rescue'
      }
    ]
  },
  {
    id: 'chap-13',
    number: 13,
    title: '🔑 AI Engines & API Key Setup',
    featureName: '100% Free Offline Engine & Frontier LLMs',
    durationSeconds: 20,
    icon: Key,
    category: 'Configuration',
    specialAction: 'ai_settings',
    description: 'Works 100% free with the built-in smart engine. Option to connect OpenRouter, Gemini, or OpenAI with automatic ISO-8859-1 error protection.',
    teluguSubtitle: 'ఉచితంగా ఆఫ్‌లైన్‌లో వాడుకోవచ్చు లేదా మీ స్వంత API కీలను (Gemini, OpenRouter) జోడించవచ్చు.',
    narrationScript: 'The AI English Master Teacher works 100% free and offline right out of the box! You can also plug in OpenRouter or Google Gemini keys with built-in ISO-8859-1 header error sanitization.',
    demoUI: {
      badge: 'AI Engine Configuration',
      studentName: 'Kalyan Kumar',
      inputText: 'Provider: Built-in Smart Pedagogical Engine (Active & Free)',
      correction: 'Status: Fully Configured | Zero Setup Required | 100% Free',
      teacherTip: 'Every prompt and fetch call includes automatic ISO-8859-1 header sanitization to protect your browser from network exceptions.',
      teluguExplanation: 'ఎలాంటి కీలు లేకుండా ఉచితంగా వెంటనే ప్రాక్టీస్ ప్రారంభించవచ్చు.',
      actionButtonText: 'Configure Engine'
    },
    proTricks: [
      {
        title: 'No API Key Needed',
        description: 'The built-in engine contains full offline pedagogical rules for all 12 modes. You can practice all year without spending a rupee on API tokens.',
        tag: 'Free Forever'
      },
      {
        title: 'ISO-8859-1 Header Fix',
        description: 'The app automatically sanitizes HTTP headers, stripping non-ASCII characters to eliminate the common browser fetch error completely.',
        tag: 'Stability Fix'
      }
    ]
  }
];

interface HelpVideoGuideProps {
  onSelectFeature?: (mode: AppMode) => void;
  onOpenVoiceCall?: () => void;
  onOpenExplain?: () => void;
  onOpenSettingsTab?: (tab: 'ai') => void;
  onLoadDemoStudent?: () => void;
  currentStudentName?: string;
  onClose?: () => void;
}

export const HelpVideoGuide: React.FC<HelpVideoGuideProps> = ({
  onSelectFeature,
  onOpenVoiceCall,
  onOpenExplain,
  onOpenSettingsTab,
  onLoadDemoStudent,
  currentStudentName = 'Kalyan Kumar',
  onClose
}) => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'video' | 'tricks'>('video');
  const [progressPercent, setProgressPercent] = useState(0);
  const [simulatedTime, setSimulatedTime] = useState(0);
  const [selectedTrickCategory, setSelectedTrickCategory] = useState<string>('all');

  const playbackTimerRef = useRef<number | null>(null);
  const totalVideoDuration = VIDEO_CHAPTERS.reduce((acc, c) => acc + c.durationSeconds, 0);

  const currentChapter = VIDEO_CHAPTERS[activeChapterIndex] || VIDEO_CHAPTERS[0];

  const getChapterStartTime = (index: number) => {
    return VIDEO_CHAPTERS.slice(0, index).reduce((acc, c) => acc + c.durationSeconds, 0);
  };

  useEffect(() => {
    if (isPlaying) {
      playbackTimerRef.current = window.setInterval(() => {
        setSimulatedTime((prev) => {
          const next = prev + 1 * playbackSpeed;
          const currentChapterEnd = getChapterStartTime(activeChapterIndex) + currentChapter.durationSeconds;

          if (next >= currentChapterEnd) {
            if (activeChapterIndex < VIDEO_CHAPTERS.length - 1) {
              setActiveChapterIndex((idx) => idx + 1);
            } else {
              setIsPlaying(false);
              return totalVideoDuration;
            }
          }

          const pct = Math.min(100, Math.round((next / totalVideoDuration) * 100));
          setProgressPercent(pct);
          return next;
        });
      }, 1000);
    } else {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
        playbackTimerRef.current = null;
      }
      speechService.stopSpeaking();
    }

    return () => {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
      }
    };
  }, [isPlaying, activeChapterIndex, playbackSpeed, currentChapter.durationSeconds, totalVideoDuration]);

  useEffect(() => {
    if (isPlaying && !isMuted) {
      speechService.stopSpeaking();
      speechService.speak(currentChapter.narrationScript, {
        rate: 0.95 * playbackSpeed,
        pitch: 1.0
      });
    }
  }, [activeChapterIndex, isPlaying, isMuted, playbackSpeed]);

  const handlePlayPause = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      soundService.playSuccess();
    } else {
      setIsPlaying(false);
      speechService.stopSpeaking();
    }
  };

  const handleRestart = () => {
    setIsPlaying(false);
    speechService.stopSpeaking();
    setActiveChapterIndex(0);
    setSimulatedTime(0);
    setProgressPercent(0);
  };

  const handleSelectChapter = (index: number) => {
    setActiveChapterIndex(index);
    const startTime = getChapterStartTime(index);
    setSimulatedTime(startTime);
    setProgressPercent(Math.round((startTime / totalVideoDuration) * 100));
    if (isPlaying && !isMuted) {
      speechService.stopSpeaking();
      speechService.speak(VIDEO_CHAPTERS[index].narrationScript, {
        rate: 0.95 * playbackSpeed,
        pitch: 1.0
      });
    }
  };

  const handleNextChapter = () => {
    if (activeChapterIndex < VIDEO_CHAPTERS.length - 1) {
      handleSelectChapter(activeChapterIndex + 1);
    }
  };

  const handlePrevChapter = () => {
    if (activeChapterIndex > 0) {
      handleSelectChapter(activeChapterIndex - 1);
    }
  };

  const handleLaunchFeature = () => {
    speechService.stopSpeaking();
    setIsPlaying(false);
    if (onClose) onClose();

    if (currentChapter.specialAction === 'call' && onOpenVoiceCall) {
      onOpenVoiceCall();
    } else if (currentChapter.specialAction === 'explain' && onOpenExplain) {
      onOpenExplain();
    } else if (currentChapter.specialAction === 'ai_settings' && onOpenSettingsTab) {
      onOpenSettingsTab('ai');
    } else if (currentChapter.appMode && onSelectFeature) {
      onSelectFeature(currentChapter.appMode);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const allTricks = VIDEO_CHAPTERS.flatMap((chap) =>
    chap.proTricks.map((trick) => ({
      ...trick,
      chapterName: chap.title,
      chapterIcon: chap.icon,
      featureName: chap.featureName,
      appMode: chap.appMode
    }))
  );

  const filteredTricks = allTricks.filter((trick) => {
    const matchesSearch =
      searchQuery === '' ||
      trick.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trick.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trick.chapterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trick.tag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedTrickCategory === 'all' ||
      trick.tag.toLowerCase().includes(selectedTrickCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Welcome & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-extrabold text-[11px] uppercase tracking-wider">
              Interactive Video Guide & Help
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Demo Student: <strong className="text-slate-800 dark:text-slate-200">{currentStudentName}</strong>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Master Every Feature in 4 Minutes 🎥
          </h2>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-2">
          {onLoadDemoStudent && (
            <button
              onClick={() => {
                onLoadDemoStudent();
                soundService.playSuccess();
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 text-xs font-bold transition-all flex items-center space-x-1"
              title="Reset profile to Demo Student Kalyan Kumar"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Load Kalyan's Demo Profile</span>
            </button>
          )}

          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center space-x-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('video')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'video'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Video Player ({VIDEO_CHAPTERS.length} Chapters)</span>
            </button>
            <button
              onClick={() => setActiveTab('tricks')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'tricks'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span>Pro Tricks & Tips ({allTricks.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIDEO PLAYER TAB */}
      {activeTab === 'video' && (
        <div className="space-y-6">
          {/* Main 16:9 Cinema Screen Player */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white shadow-2xl border border-slate-800 flex flex-col justify-between min-h-[360px] sm:min-h-[420px]">
            {/* Top Screen Bar */}
            <div className="p-4 sm:p-5 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between z-10">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-[11px] font-mono tracking-widest text-rose-400 font-black uppercase">
                  DEMO WALKTHROUGH • 1080P HD
                </span>
                <span className="text-slate-500">|</span>
                <span className="text-xs font-bold text-slate-300">
                  Chapter {currentChapter.number} of {VIDEO_CHAPTERS.length}: {currentChapter.title}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSubtitles(!showSubtitles)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 transition-colors ${
                    showSubtitles ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Toggle Telugu & English Subtitles"
                >
                  <Subtitles className="w-3.5 h-3.5" />
                  <span>CC</span>
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  title={isMuted ? 'Unmute Voice Narration' : 'Mute Voice Narration'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>
              </div>
            </div>

            {/* Middle Screen Display: Animated Live App Demonstration */}
            <div className="flex-1 px-4 sm:px-8 py-4 flex flex-col justify-center items-center relative z-10">
              <div className="w-full max-w-2xl bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-700/80 p-5 sm:p-6 shadow-2xl space-y-4 animate-scale-in">
                {/* Feature Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                      {React.createElement(currentChapter.icon, { className: 'w-4 h-4' })}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">
                        {currentChapter.demoUI.badge}
                      </span>
                      <h4 className="font-extrabold text-sm sm:text-base text-white">
                        {currentChapter.featureName}
                      </h4>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
                    {currentChapter.demoUI.studentName}
                  </span>
                </div>

                {/* Animated Input Simulation */}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                    Simulated Student Input:
                  </span>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-slate-200 flex items-center justify-between">
                    <span>
                      {currentChapter.demoUI.inputText}
                      {isPlaying && <span className="inline-block w-1.5 h-4 bg-blue-400 ml-1 animate-pulse" />}
                    </span>
                    {currentChapter.demoUI.highlightedMistake && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-900/70 border border-rose-500 text-rose-200 text-xs font-bold animate-bounce">
                        ⚠️ Error: {currentChapter.demoUI.highlightedMistake}
                      </span>
                    )}
                  </div>
                </div>

                {/* Simulated Teacher Response & Correction */}
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs sm:text-sm space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-300 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>AI Teacher Evaluation: {currentChapter.demoUI.correction}</span>
                  </div>
                  <p className="text-slate-300 text-xs italic pl-6">
                    💡 Tip: {currentChapter.demoUI.teacherTip}
                  </p>
                </div>

                {/* Live Action Button on the Screen */}
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[11px] text-amber-300 font-semibold flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{currentChapter.demoUI.teluguExplanation}</span>
                  </span>

                  <button
                    onClick={handleLaunchFeature}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-500/30 transition-all active:scale-95"
                  >
                    <span>Try In App Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Subtitles Overlay (English + Telugu) */}
            {showSubtitles && (
              <div className="px-6 py-2.5 bg-black/85 backdrop-blur-sm border-t border-slate-800/80 text-center space-y-1 z-10">
                <p className="text-xs sm:text-sm font-semibold text-slate-100">
                  {currentChapter.description}
                </p>
                <p className="text-xs text-amber-300 font-medium">
                  {currentChapter.teluguSubtitle}
                </p>
              </div>
            )}

            {/* Video Controls Bar */}
            <div className="p-4 bg-gradient-to-t from-black via-slate-950 to-transparent space-y-3 z-10">
              {/* Seekbar Timeline */}
              <div className="space-y-1">
                <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden cursor-pointer">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>{formatSeconds(simulatedTime)}</span>
                  <span className="font-bold text-slate-300">
                    Chapter {currentChapter.number}: {currentChapter.title}
                  </span>
                  <span>{formatSeconds(totalVideoDuration)}</span>
                </div>
              </div>

              {/* Bottom Control Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrevChapter}
                    disabled={activeChapterIndex === 0}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Previous Chapter"
                  >
                    <Rewind className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handlePlayPause}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-blue-500/30 transition-all active:scale-95"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 fill-current" />
                        <span>Pause Video</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>Play Video Demo</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleNextChapter}
                    disabled={activeChapterIndex === VIDEO_CHAPTERS.length - 1}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Next Chapter"
                  >
                    <FastForward className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleRestart}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                    title="Restart Video From Beginning"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Speed Selector & Open Feature */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1 text-xs">
                    <span className="text-slate-400 text-[10px] font-bold">Speed:</span>
                    {[0.75, 1.0, 1.25, 1.5].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setPlaybackSpeed(rate)}
                        className={`px-1.5 py-0.5 rounded-md font-bold text-[11px] ${
                          playbackSpeed === rate
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleLaunchFeature}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all active:scale-95"
                  >
                    <span>Open Feature Now</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Chapters Selector Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-blue-500" />
                <span>Video Chapters (Click to Jump Directly):</span>
              </span>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                {activeChapterIndex + 1} of {VIDEO_CHAPTERS.length} Selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {VIDEO_CHAPTERS.map((chap, idx) => {
                const isCurrent = idx === activeChapterIndex;
                return (
                  <button
                    key={chap.id}
                    onClick={() => handleSelectChapter(idx)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-start space-x-3 ${
                      isCurrent
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                        isCurrent
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate block">
                          {chap.title}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-1">
                          {chap.durationSeconds}s
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {chap.featureName}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TRICKS & TIPS TAB */}
      {activeTab === 'tricks' && (
        <div className="space-y-5 animate-fade-in">
          {/* Header Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg space-y-2">
            <div className="flex items-center space-x-2 text-amber-200 text-xs font-bold uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-amber-200 fill-current" />
              <span>B.Tech Telugu-to-English Master Playbook</span>
            </div>
            <h3 className="text-xl font-extrabold tracking-tight">
              25+ Pro Tricks & Telugu Thinking Hacks
            </h3>
            <p className="text-xs sm:text-sm text-amber-100 max-w-2xl">
              Proven hacks to bridge mother tongue thinking, score 10/10 in campus placement viva, and overcome common grammar traps effortlessly!
            </p>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tricks (e.g. STAR, Did trap, mic, SOV)..."
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
              {['all', 'grammar', 'speaking', 'interview', 'hardware', 'trap'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedTrickCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0 ${
                    selectedTrickCategory === cat
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat === 'all' ? 'All Tricks' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tricks List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTricks.map((trick, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/50 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 font-extrabold text-[10px] uppercase">
                      {trick.tag}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {trick.chapterName}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{trick.title}</span>
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {trick.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 italic">
                    Applicable to: {trick.featureName}
                  </span>
                  {trick.appMode && onSelectFeature && (
                    <button
                      onClick={() => {
                        if (onClose) onClose();
                        onSelectFeature(trick.appMode as AppMode);
                      }}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
                    >
                      <span>Practice Trick</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredTricks.length === 0 && (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm font-semibold">No tips found matching "{searchQuery}".</p>
              <p className="text-xs">Try searching for words like "STAR", "SOV", "mic", or "past".</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
