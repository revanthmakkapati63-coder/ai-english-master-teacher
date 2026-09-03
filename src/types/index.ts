export type AppMode = 'mode_a' | 'mode_b' | 'mode_c' | 'interview' | 'pronunciation' | 'writing' | 'vocab' | 'mistakes' | 'presentation' | 'newspaper' | 'game' | 'roleplay';

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface StudentProfile {
  // Personal
  name: string;
  nativeLanguage: string; // Telugu, Hindi, etc.
  hometown: string;
  hasCompletedOnboarding?: boolean;
  dailyAvailableMinutes: number;
  englishConfidence: number; // 1 to 10
  currentLevel: CEFRLevel;
  streakDays: number;
  lastActiveDate: string;

  // Academic Background
  class10: {
    school?: string;
    favoriteSubject?: string;
    difficultSubject?: string;
    achievements?: string;
  };
  intermediate: {
    college?: string;
    stream?: string; // MPC, BiPC, etc.
    favoriteSubject?: string;
    difficultSubject?: string;
    whyBTech?: string;
  };
  btech: {
    college?: string;
    branch?: string; // CSE, ECE, AI&DS, IT, etc.
    year?: string; // 1st Year
    semester?: string; // 1st / 2nd Semester
    favoriteSubjects?: string[];
    difficultSubjects?: string[];
    programmingLanguages?: string[];
    technicalSkills?: string[];
    projects?: string[];
    targetJobRoles?: string[];
  };

  // Learning Progress
  stats: {
    mistakesLogged: number;
    mistakesMastered: number;
    vocabMastered: number;
    interviewsCompleted: number;
    writingTasksCompleted: number;
    pronunciationsPracticed: number;
  };
}

export type MistakeCategory =
  | 'Spelling'
  | 'Grammar'
  | 'Tense'
  | 'Vocabulary'
  | 'Preposition'
  | 'Article'
  | 'Subject-Verb Agreement'
  | 'Word Order'
  | 'Sentence Structure'
  | 'Natural English'
  | 'Pronunciation';

export interface WordCorrection {
  originalWord: string;
  correctedWord: string;
  category: MistakeCategory;
  why: string;
  grammarRule: string;
  spellingBreakdown?: string; // e.g. "W-E-N-T"
  syllables?: string; // e.g. "en-tre-pre-neur"
  stress?: string; // e.g. "en·tre·pre·NEUR"
  meaning?: string;
  exampleSentence: string;
}

export interface SentenceAnalysis {
  originalSentence: string;
  correctedSentence: string;
  why: string;
  grammarRule: string;
  naturalEnglish: string;
  wordCorrections: WordCorrection[];
  tokens: {
    text: string;
    isError: boolean;
    correction?: WordCorrection;
  }[];
  clarificationNeeded?: boolean;
  clarificationQuestion?: string;
}

export interface RomanTeluguAnalysis {
  originalInput: string;
  correctedRomanTelugu: string;
  englishMeaning: string;
  explanation: string;
  teluguTip?: string;
  clarificationNeeded?: boolean;
  clarificationQuestion?: string;
}

export interface MistakeNotebookItem {
  id: string;
  originalSentence: string;
  wrongWord: string;
  correctWord: string;
  category: MistakeCategory;
  explanation: string;
  grammarRule: string;
  naturalExample: string;
  dateAdded: string;
  occurrences: number;
  practiceStatus: 'unmastered' | 'practiced' | 'mastered';
}

export interface ChatMessage {
  id: string;
  sender: 'student' | 'teacher' | 'system';
  content: string;
  timestamp: string;
  mode?: AppMode;
  analysis?: SentenceAnalysis;
  romanAnalysis?: RomanTeluguAnalysis;
  isClarification?: boolean;
  quickReplies?: string[];
  audioPlayed?: boolean;
}

export interface InterviewMetric {
  score: number; // 0 to 10
  feedback: string;
}

export interface InterviewReport {
  id: string;
  attemptNumber: number;
  date: string;
  interviewType: 'internship' | 'hr' | 'technical' | 'campus_placement' | 'self_intro';
  grammarScore: number;
  vocabularyScore: number;
  fluencyScore: number;
  clarityScore: number;
  confidenceScore: number;
  professionalScore: number;
  contentQualityScore: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  repeatedMistakes: string[];
  betterAnswers: { question: string; studentAnswer: string; recommendedAnswer: string }[];
  recommendedPractice: string[];
}

export interface WritingTaskSubmission {
  id: string;
  taskId: string;
  taskTitle: string;
  taskCategory: 'Sentence' | 'Paragraph' | 'Email' | 'Presentation' | 'Technical' | 'Exam';
  prompt: string;
  attempt1: string;
  attempt1Feedback?: {
    errors: string[];
    grammarPatterns: string;
    modelVersion: string;
    score: number;
  };
  attempt2?: string;
  attempt2Comparison?: {
    scoreImprovement: string;
    persistingErrors: string[];
    praise: string;
  };
  date: string;
}

export interface VocabWord {
  id: string;
  word: string;
  partOfSpeech: string;
  syllables: string;
  stress: string;
  meaning: string;
  teluguMeaning?: string;
  exampleSentence: string;
  context: 'B.Tech / Tech' | 'Job Interview' | 'Presentation' | 'College Life' | 'Professional';
  synonyms: string[];
  collocations: string[];
  isBookmarked?: boolean;
}

export interface PronunciationItem {
  id: string;
  word: string;
  syllables: string;
  stressGuide: string;
  phoneticSpelling: string;
  definition: string;
  example: string;
  commonTeluguSpeakerMistake?: string;
  tip: string;
}

export interface NewspaperArticle {
  id: string;
  title: string;
  source: string;
  date: string;
  category: 'Technology' | 'National & AP' | 'Science & Space' | 'Economy' | 'Education';
  text: string;
  simpleEnglishExplanation: string;
  teluguExplanation: string;
  gkTakeaways: string[];
  keyVocabulary: {
    word: string;
    meaning: string;
    pronunciation: string;
    teluguMeaning: string;
  }[];
}

export interface ReadingEvaluation {
  accuracyPercentage: number;
  totalWords: number;
  matchedWordsCount: number;
  wordStatuses: {
    word: string;
    isMatched: boolean;
    spokenWord?: string;
  }[];
  mispronouncedWords: {
    word: string;
    suggestedPronunciation: string;
    tip: string;
  }[];
  fluencyWpm: number;
  feedback: string;
}
