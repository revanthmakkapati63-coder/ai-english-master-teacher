import {
  StudentProfile,
  MistakeNotebookItem,
  InterviewReport,
  WritingTaskSubmission,
  VocabWord,
  ChatMessage
} from '../types';

export interface AppSettings {
  aiProvider: 'offline' | 'openrouter' | 'gemini' | 'openai';
  openRouterKey: string;
  geminiKey: string;
  openAiKey: string;
  openRouterModel: string;
  geminiModel: string;
  openAiModel: string;
  autoSpeakTeacher: boolean;
  speechRate: number;
}

export const DEMO_STUDENT_PROFILE: StudentProfile = {
  name: 'Kalyan Kumar',
  nativeLanguage: 'Telugu',
  hometown: 'Vijayawada, Andhra Pradesh',
  hasCompletedOnboarding: true,
  dailyAvailableMinutes: 25,
  englishConfidence: 6,
  currentLevel: 'B1',
  streakDays: 5,
  lastActiveDate: new Date().toISOString().split('T')[0],
  class10: {
    school: 'Zilla Parishad High School, Krishna District',
    favoriteSubject: 'Mathematics & Physical Sciences',
    difficultSubject: 'English Grammar & Composition',
    achievements: 'School 2nd Rank in 10th SSC Public Exams (9.8 GPA)'
  },
  intermediate: {
    college: 'Sri Chaitanya Junior College, Benz Circle, Vijayawada',
    stream: 'MPC (Mathematics, Physics, Chemistry)',
    favoriteSubject: 'Mathematics (1A, 1B, 2A, 2B)',
    difficultSubject: 'English Prose & Poetry',
    whyBTech: 'Passion for coding, building AI software, and cracking campus placements'
  },
  btech: {
    college: 'VR Siddhartha Engineering College (VRSEC), Vijayawada',
    branch: 'Computer Science & Engineering (CSE)',
    year: '1st Year',
    semester: '1st Semester',
    favoriteSubjects: ['Problem Solving with C', 'Data Structures & Algorithms', 'Engineering Physics'],
    difficultSubjects: ['Technical English Communication', 'Digital Electronics'],
    programmingLanguages: ['C', 'Python', 'Basic Java'],
    technicalSkills: ['Algorithms', 'Logic Building', 'Git Basics'],
    projects: ['Campus Waste Management System in C', 'Library Book Tracker in Python'],
    targetJobRoles: ['Software Development Engineer', 'Campus Placement (TCS, Infosys, Cognizant)']
  },
  stats: {
    mistakesLogged: 14,
    mistakesMastered: 8,
    vocabMastered: 22,
    interviewsCompleted: 3,
    writingTasksCompleted: 4,
    pronunciationsPracticed: 18
  }
};

const DEFAULT_PROFILE: StudentProfile = DEMO_STUDENT_PROFILE;

const env = (import.meta as any)?.env || {};

const DEFAULT_SETTINGS: AppSettings = {
  aiProvider: (env.VITE_OPENROUTER_API_KEY ? 'openrouter' :
               env.VITE_GEMINI_API_KEY ? 'gemini' :
               env.VITE_OPENAI_API_KEY ? 'openai' : 'offline'),
  openRouterKey: env.VITE_OPENROUTER_API_KEY || '',
  geminiKey: env.VITE_GEMINI_API_KEY || '',
  openAiKey: env.VITE_OPENAI_API_KEY || '',
  openRouterModel: 'anthropic/claude-3.5-sonnet',
  geminiModel: 'gemini-2.0-flash',
  openAiModel: 'gpt-4o-mini',
  autoSpeakTeacher: false,
  speechRate: 0.95
};

const SEED_MISTAKES: MistakeNotebookItem[] = [
  {
    id: 'mst-1',
    originalSentence: 'I am go to college yesterday.',
    wrongWord: 'go',
    correctWord: 'went',
    category: 'Tense',
    explanation: '"Yesterday" denotes a completed past action, which requires the simple past tense (went), not present simple (go).',
    grammarRule: 'Past time adverbials (yesterday, last week, ago) require simple past verb forms.',
    naturalExample: 'I went to college yesterday for the lab session.',
    dateAdded: '2026-08-28',
    occurrences: 3,
    practiceStatus: 'unmastered'
  },
  {
    id: 'mst-2',
    originalSentence: 'He do not know how to write code.',
    wrongWord: 'do not',
    correctWord: 'does not',
    category: 'Subject-Verb Agreement',
    explanation: 'Third-person singular subjects (he, she, it) take "does", not "do".',
    grammarRule: 'Subject-Verb Agreement: He/She/It + does not + base verb.',
    naturalExample: 'He does not know how to write code yet.',
    dateAdded: '2026-08-30',
    occurrences: 2,
    practiceStatus: 'unmastered'
  },
  {
    id: 'mst-3',
    originalSentence: 'I discussed about the project with sir.',
    wrongWord: 'discussed about',
    correctWord: 'discussed',
    category: 'Preposition',
    explanation: '"Discuss" is a transitive verb that directly takes the object without "about". In Telugu, we think "dani gurinchi matladamu", which makes us add "about".',
    grammarRule: 'Discuss + direct object (do not use preposition "about").',
    naturalExample: 'I discussed the project with our professor.',
    dateAdded: '2026-08-31',
    occurrences: 4,
    practiceStatus: 'unmastered'
  },
  {
    id: 'mst-4',
    originalSentence: 'Myself Karthik from Vijayawada.',
    wrongWord: 'Myself',
    correctWord: 'I am / My name is',
    category: 'Natural English',
    explanation: 'Reflexive pronouns like "Myself" cannot be used as the grammatical subject of a sentence in formal English.',
    grammarRule: 'Use "My name is [Name]" or "I am [Name]" for professional introductions.',
    naturalExample: 'I am Karthik from Vijayawada, pursuing B.Tech in CSE.',
    dateAdded: '2026-09-01',
    occurrences: 5,
    practiceStatus: 'unmastered'
  }
];

class StorageService {
  private getItem<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return fallback;
      return JSON.parse(data) as T;
    } catch (e) {
      console.error(`Error loading ${key} from storage:`, e);
      return fallback;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving ${key} to storage:`, e);
    }
  }

  // Profile
  public getProfile(): StudentProfile {
    return this.getItem<StudentProfile>('agy_student_profile', DEFAULT_PROFILE);
  }

  public saveProfile(profile: StudentProfile): void {
    this.setItem('agy_student_profile', profile);
  }

  public resetProfile(): StudentProfile {
    try {
      localStorage.removeItem('agy_student_profile');
      localStorage.removeItem('agy_chat_history');
      localStorage.removeItem('agy_mistake_notebook');
      localStorage.removeItem('agy_interview_reports');
      localStorage.removeItem('agy_writing_submissions');
    } catch (e) {
      console.warn('Error clearing storage:', e);
    }
    return DEFAULT_PROFILE;
  }

  public loadDemoProfile(): StudentProfile {
    this.saveProfile(DEMO_STUDENT_PROFILE);
    return DEMO_STUDENT_PROFILE;
  }

  // Settings
  public getSettings(): AppSettings {
    return this.getItem<AppSettings>('agy_settings', DEFAULT_SETTINGS);
  }

  public saveSettings(settings: AppSettings): void {
    this.setItem('agy_settings', settings);
  }

  // Mistake Notebook
  public getMistakes(): MistakeNotebookItem[] {
    return this.getItem<MistakeNotebookItem[]>('agy_mistakes', SEED_MISTAKES);
  }

  public saveMistakes(mistakes: MistakeNotebookItem[]): void {
    this.setItem('agy_mistakes', mistakes);
  }

  public addMistake(mistake: Omit<MistakeNotebookItem, 'id' | 'dateAdded' | 'occurrences' | 'practiceStatus'>): MistakeNotebookItem {
    const list = this.getMistakes();
    // Check if word or sentence already logged
    const existingIndex = list.findIndex(
      m => m.wrongWord.toLowerCase() === mistake.wrongWord.toLowerCase() ||
           m.correctWord.toLowerCase() === mistake.correctWord.toLowerCase()
    );

    if (existingIndex >= 0) {
      list[existingIndex].occurrences += 1;
      list[existingIndex].practiceStatus = 'unmastered';
      this.saveMistakes(list);
      return list[existingIndex];
    }

    const newItem: MistakeNotebookItem = {
      ...mistake,
      id: 'mst-' + Date.now(),
      dateAdded: new Date().toISOString().split('T')[0],
      occurrences: 1,
      practiceStatus: 'unmastered'
    };

    const updated = [newItem, ...list];
    this.saveMistakes(updated);

    // Increment profile stats
    const profile = this.getProfile();
    profile.stats.mistakesLogged += 1;
    this.saveProfile(profile);

    return newItem;
  }

  public updateMistakeStatus(id: string, status: 'unmastered' | 'practiced' | 'mastered'): void {
    const list = this.getMistakes();
    const item = list.find(m => m.id === id);
    if (item) {
      const wasMastered = item.practiceStatus === 'mastered';
      item.practiceStatus = status;
      this.saveMistakes(list);

      if (status === 'mastered' && !wasMastered) {
        const profile = this.getProfile();
        profile.stats.mistakesMastered += 1;
        this.saveProfile(profile);
      }
    }
  }

  // Interview Reports
  public getInterviewReports(): InterviewReport[] {
    return this.getItem<InterviewReport[]>('agy_interview_reports', []);
  }

  public saveInterviewReport(report: InterviewReport): void {
    const list = this.getInterviewReports();
    this.setItem('agy_interview_reports', [report, ...list]);

    const profile = this.getProfile();
    profile.stats.interviewsCompleted += 1;
    this.saveProfile(profile);
  }

  // Writing Submissions
  public getWritingSubmissions(): WritingTaskSubmission[] {
    return this.getItem<WritingTaskSubmission[]>('agy_writing_submissions', []);
  }

  public saveWritingSubmission(sub: WritingTaskSubmission): void {
    const list = this.getWritingSubmissions();
    const existingIndex = list.findIndex(s => s.id === sub.id);
    if (existingIndex >= 0) {
      list[existingIndex] = sub;
      this.setItem('agy_writing_submissions', list);
    } else {
      this.setItem('agy_writing_submissions', [sub, ...list]);
    }

    const profile = this.getProfile();
    profile.stats.writingTasksCompleted += 1;
    this.saveProfile(profile);
  }

  // Chat History for Teacher Mode
  public getChatHistory(): ChatMessage[] {
    return this.getItem<ChatMessage[]>('agy_teacher_chat', []);
  }

  public saveChatHistory(messages: ChatMessage[]): void {
    this.setItem('agy_teacher_chat', messages.slice(-50)); // keep last 50
  }
}

export const storageService = new StorageService();
