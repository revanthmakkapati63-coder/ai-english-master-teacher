import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  GraduationCap,
  BookOpen,
  HelpCircle,
  Clock,
  Award,
  Zap,
  CheckCircle,
  MessageSquare,
  Phone
} from 'lucide-react';
import { ChatMessage, StudentProfile } from '../types';
import { aiService } from '../services/aiService';
import { speechService } from '../services/speechService';
import { storageService } from '../services/storageService';

interface ModeCTeacherProps {
  profile: StudentProfile;
  onNavigateToTab?: (tab: string) => void;
  onStartVoiceCall?: () => void;
}

const SHORTCUT_COMMANDS = [
  { cmd: '/lesson', label: '📘 Lesson', desc: 'Grammar & Concept' },
  { cmd: '/quiz', label: '📝 Quiz', desc: 'Targeted Practice' },
  { cmd: '/vocab', label: '💡 Vocab', desc: 'B.Tech Vocabulary' },
  { cmd: '/speaking', label: '🎙️ Speaking', desc: 'Verbal Challenge' },
  { cmd: '/interview', label: '💼 Interview', desc: 'Placement Prep' },
  { cmd: '/dailysystem', label: '🗓️ Daily Plan', desc: '20-Min Routine' },
  { cmd: '/mistakes', label: '📓 Mistakes', desc: 'Review Weak Spots' },
  { cmd: '/progress', label: '📊 Progress', desc: 'CEFR Level & Stats' },
];

export const ModeCTeacher: React.FC<ModeCTeacherProps> = ({ profile, onNavigateToTab, onStartVoiceCall }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Load chat history or seed first friendly welcome message
  useEffect(() => {
    const history = storageService.getChatHistory();
    if (history.length > 0) {
      setMessages(history);
    } else {
      // First-time onboarding opening message according to Section 7 & 30
      const initialTeacherMessage: ChatMessage = {
        id: 'msg-welcome',
        sender: 'teacher',
        content: `Namaste **${profile.name}**! I am your AI Master English Teacher and Communication Coach. 

My mission is to help you build confident English speaking, writing, and interview communication for your B.Tech career at **${profile.btech.college || 'college'}**—so you gradually start thinking directly in English without translating from Telugu.

We will learn through natural conversation:
1. **Teach & Ask:** I'll ask questions or give a short lesson.
2. **Answer in English:** You respond naturally.
3. **Gentle Feedback:** I will gently show improvements without any pressure!

To begin our journey, **what technical subject or programming language did you study this week?**`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([initialTeacherMessage]);
      storageService.saveChatHistory([initialTeacherMessage]);
    }
  }, [profile]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'student',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setInputText('');
    setIsTyping(true);

    try {
      const historyFormatted = updated.map(m => ({
        sender: m.sender,
        content: m.content
      }));

      const reply = await aiService.generateTeacherChat(text, historyFormatted, profile);

      const teacherMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'teacher',
        content: reply.responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies: reply.clarificationQuestion ? ['Yes, that is what I meant', 'No, let me rephrase'] : undefined
      };

      const finalMessages = [...updated, teacherMsg];
      setMessages(finalMessages);
      storageService.saveChatHistory(finalMessages);

      if (autoSpeak) {
        handleSpeakMessage(teacherMsg.id, teacherMsg.content);
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsTyping(false);
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
          console.warn('Speech recognition notice:', err);
          setIsListening(false);
        },
        () => setIsListening(false)
      );
      if (started) setIsListening(true);
    }
  };

  const handleSpeakMessage = (id: string, text: string) => {
    if (speakingMessageId === id) {
      speechService.stopSpeaking();
      setSpeakingMessageId(null);
      return;
    }
    setSpeakingMessageId(id);
    speechService.speak(text, {
      rate: 0.95,
      onEnd: () => setSpeakingMessageId(null)
    });
  };

  const renderFormattedContent = (content: string) => {
    // Process markdown-like bold, brackets [corrected], headers
    const lines = content.split('\n');
    return (
      <div className="space-y-2">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-bold text-base text-blue-600 dark:text-blue-400 mt-2 mb-1">
                {line.replace('### ', '')}
              </h4>
            );
          }
          if (line.startsWith('---')) {
            return <hr key={idx} className="my-2 border-slate-200 dark:border-slate-700" />;
          }

          // Highlight [corrected] patterns
          const parts = line.split(/(\[[^\]]+\]|\*\*[^*]+\*\*)/g);
          return (
            <p key={idx} className="leading-relaxed">
              {parts.map((part, pIdx) => {
                if (part.startsWith('[') && part.endsWith(']')) {
                  return (
                    <span
                      key={pIdx}
                      className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800"
                    >
                      {part}
                    </span>
                  );
                }
                if (part.startsWith('**') && part.endsWith('**')) {
                  return (
                    <strong key={pIdx} className="font-bold text-slate-900 dark:text-slate-100">
                      {part.slice(2, -2)}
                    </strong>
                  );
                }
                return part;
              })}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[750px] bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in">
      {/* Teacher Header Bar */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-xl shadow-inner">
            🎓
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-extrabold text-base tracking-tight">
                AI Master English Teacher
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 font-semibold">
                Online Coach
              </span>
            </div>
            <p className="text-xs text-blue-200">
              Personalized for {profile.name} • Vijayawada • Level {profile.currentLevel}
            </p>
          </div>
        </div>

        {/* Audio controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            title={autoSpeak ? 'Disable auto voice playback' : 'Enable auto voice playback'}
            className={`p-2 rounded-xl text-xs flex items-center space-x-1.5 transition-all ${
              autoSpeak
                ? 'bg-blue-500/40 text-white border border-white/30'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            {autoSpeak ? <Volume2 className="w-4 h-4 text-emerald-300" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">Auto-Voice</span>
          </button>
        </div>
      </div>

      {/* Shortcut Command Bar (Specification Line 996-1006) */}
      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 overflow-x-auto flex items-center space-x-2 no-scrollbar">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 pl-1">
          Commands:
        </span>
        {SHORTCUT_COMMANDS.map((sc, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(sc.cmd)}
            className="px-3 py-1 rounded-xl bg-white dark:bg-slate-700 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 transition-all shrink-0 active:scale-95 shadow-2xs"
          >
            {sc.label}
          </button>
        ))}
      </div>

      {/* Live Voice Call Interactive Banner */}
      {onStartVoiceCall && (
        <div className="px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/80 dark:to-slate-800/40 border-b border-blue-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Interactive Voice Speaking: Practice hands-free phone conversation with the Teacher!
            </span>
          </div>
          <button
            onClick={onStartVoiceCall}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95 shrink-0"
          >
            <Phone className="w-3.5 h-3.5 fill-current" />
            <span>Start Live Call</span>
          </button>
        </div>
      )}

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50 dark:bg-slate-950/40">
        {messages.map((msg) => {
          const isTeacher = msg.sender === 'teacher';
          const isSpeakingThis = speakingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isTeacher ? '' : 'flex-row-reverse space-x-reverse'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-1 shadow-xs ${
                  isTeacher
                    ? 'bg-blue-600 text-white'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                {isTeacher ? <GraduationCap className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm shadow-xs ${
                  isTeacher
                    ? 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                    : 'bg-blue-600 text-white'
                }`}
              >
                {isTeacher ? (
                  <>
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5 mb-2">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        AI Master Teacher
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                        <button
                          onClick={() => handleSpeakMessage(msg.id, msg.content)}
                          title="Listen to teacher"
                          className="text-slate-400 hover:text-blue-600 transition-colors p-0.5"
                        >
                          <Volume2 className={`w-3.5 h-3.5 ${isSpeakingThis ? 'text-blue-600 animate-bounce' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <div className="text-sm">
                      {renderFormattedContent(msg.content)}
                    </div>

                    {msg.quickReplies && (
                      <div className="pt-3 flex flex-wrap gap-2">
                        {msg.quickReplies.map((reply, rIdx) => (
                          <button
                            key={rIdx}
                            onClick={() => handleSendMessage(reply)}
                            className="text-xs px-3 py-1 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-medium transition-colors"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <span className="text-[10px] text-blue-200 block text-right mt-1">
                      {msg.timestamp}
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-xs text-slate-400 font-medium ml-1">Teacher is thinking...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <button
            type="button"
            onClick={handleVoiceInput}
            title={isListening ? 'Stop listening' : 'Voice input (Web Speech API)'}
            className={`p-3 rounded-2xl transition-all ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message in English or type /lesson, /quiz, /vocab..."
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-all shadow-sm active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
