import React, { useState, useEffect } from 'react';
import {
  X,
  Settings,
  Key,
  Cpu,
  Volume2,
  Check,
  ShieldCheck,
  Code2,
  Info,
  Copy,
  Eye,
  EyeOff,
  ClipboardPaste,
  ExternalLink,
  Film,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import { AppSettings, storageService } from '../services/storageService';
import { AppMode } from '../types';
import { HelpVideoGuide } from './HelpVideoGuide';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsSaved: (settings: AppSettings) => void;
  initialTab?: 'video' | 'tricks' | 'ai';
  onSelectFeature?: (mode: AppMode) => void;
  onOpenVoiceCall?: () => void;
  onOpenExplain?: () => void;
  onLoadDemoStudent?: () => void;
  studentName?: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSettingsSaved,
  initialTab = 'video',
  onSelectFeature,
  onOpenVoiceCall,
  onOpenExplain,
  onLoadDemoStudent,
  studentName = 'Kalyan Kumar'
}) => {
  const [settings, setSettings] = useState<AppSettings>(() => storageService.getSettings());
  const [activeTab, setActiveTab] = useState<'video' | 'tricks' | 'ai'>(initialTab);
  const [saved, setSaved] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showOpenRouterKey, setShowOpenRouterKey] = useState(false);

  // Sync initialTab when modal opens
  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleSave = () => {
    storageService.saveSettings(settings);
    onSettingsSaved(settings);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  const headerSanitizationSnippet = `// Solution for: "Failed to execute 'fetch' on 'Window': 
// Failed to read the 'headers' property from 'RequestInit': 
// String contains non ISO-8859-1 code point."

/**
 * Strips or encodes non-ASCII/non-ISO-8859-1 characters from HTTP header values
 */
export function sanitizeHeaderValue(value: string): string {
  if (!value) return '';
  // Strips any character outside standard ASCII range (code points > 127)
  return value.replace(/[^\\x00-\\x7F]/g, '').trim();
}

export function encodeHeaderValue(value: string): string {
  // If UTF-8 characters (like emojis or Telugu script) must be preserved:
  return encodeURIComponent(value);
}

// Example usage in your fetch call:
const headers: HeadersInit = {
  'Content-Type': 'application/json',
  'Authorization': \`Bearer \${sanitizeHeaderValue(apiKey)}\`,
  'HTTP-Referer': 'https://localhost:3000',
  'X-Title': encodeHeaderValue('AI English Master Teacher 🎓')
};

const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers,
  body: JSON.stringify(payload)
});`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(headerSanitizationSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                Help & Settings Center
              </h2>
              <p className="text-xs text-slate-400">
                Video Walkthrough, B.Tech Pro Tips, and AI Engine Setup
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-1.5 text-xs font-bold">
            <button
              onClick={() => setActiveTab('video')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'video'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>🎥 Video Guide & Walkthrough</span>
            </button>

            <button
              onClick={() => setActiveTab('tricks')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'tricks'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Lightbulb className="w-4 h-4 text-amber-300" />
              <span>💡 25+ Pro Tricks & Tips</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'ai'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>⚙️ AI Engine & API Keys</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 hidden md:block">
            Student: <strong>{studentName}</strong>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm">
          {/* VIDEO & HELP GUIDE TAB */}
          {(activeTab === 'video' || activeTab === 'tricks') && (
            <HelpVideoGuide
              onSelectFeature={onSelectFeature}
              onOpenVoiceCall={onOpenVoiceCall}
              onOpenExplain={onOpenExplain}
              onOpenSettingsTab={(tab) => setActiveTab(tab)}
              onLoadDemoStudent={onLoadDemoStudent}
              currentStudentName={studentName}
              onClose={onClose}
            />
          )}

          {/* AI ENGINE & SETTINGS TAB */}
          {activeTab === 'ai' && (
            <div className="space-y-6 animate-fade-in">
              {/* API Key Instructions Banner */}
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 space-y-1.5 text-xs text-blue-900 dark:text-blue-200">
                <span className="font-bold flex items-center space-x-1.5 text-blue-800 dark:text-blue-300">
                  <Key className="w-4 h-4 text-blue-600" />
                  <span>Where to Insert the API Key?</span>
                </span>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>Option 1 (Direct in Browser):</strong> Select your provider below (OpenRouter, Gemini, or OpenAI), paste your key into the text box, and click <strong>"Save Changes"</strong>.
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>Option 2 (.env file):</strong> Create a <code>.env</code> file in your project root with <code>VITE_OPENROUTER_API_KEY=...</code>, <code>VITE_GEMINI_API_KEY=...</code>, or <code>VITE_OPENAI_API_KEY=...</code>.
                </p>
                <p className="text-emerald-700 dark:text-emerald-300 font-semibold pt-1">
                  ✓ The <strong>Built-in Smart Engine</strong> works 100% free with zero API keys required!
                </p>
              </div>

              {/* AI Provider Selection */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Select AI Engine:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'offline',
                      name: 'Built-in Smart Engine (Recommended)',
                      desc: 'Immediate, offline, zero setup, fully tuned pedagogical responses'
                    },
                    {
                      id: 'openrouter',
                      name: 'OpenRouter (Multi-Model)',
                      desc: 'Routes to Claude 3.5, GPT-4o, Gemini 2.5, DeepSeek-R1'
                    },
                    {
                      id: 'gemini',
                      name: 'Google Gemini Direct',
                      desc: 'Uses Gemini 2.0 Flash / 1.5 Pro directly'
                    },
                    {
                      id: 'openai',
                      name: 'OpenAI Direct',
                      desc: 'Uses GPT-4o / GPT-4o-mini directly'
                    }
                  ].map((prov) => (
                    <button
                      key={prov.id}
                      onClick={() => setSettings({ ...settings, aiProvider: prov.id as any })}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        settings.aiProvider === prov.id
                          ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">{prov.name}</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">{prov.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* API Key Inputs if external provider chosen */}
              {settings.aiProvider === 'openrouter' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                      <Key className="w-3.5 h-3.5 text-blue-500" />
                      <span>OpenRouter API Key</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const text = await navigator.clipboard.readText();
                            if (text) {
                              setSettings({ ...settings, openRouterKey: text.trim() });
                            }
                          } catch {
                            // Fallback
                          }
                        }}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1 font-semibold"
                      >
                        <ClipboardPaste className="w-3.5 h-3.5" />
                        <span>Paste Key</span>
                      </button>
                      <a
                        href="https://openrouter.ai/keys"
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-slate-500 hover:underline flex items-center space-x-1"
                      >
                        <span>Get Key</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type={showOpenRouterKey ? 'text' : 'password'}
                      value={settings.openRouterKey}
                      onChange={(e) => setSettings({ ...settings, openRouterKey: e.target.value })}
                      placeholder="Paste your OpenRouter key here: sk-or-v1-..."
                      className="w-full px-3.5 py-2.5 pr-10 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-slate-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOpenRouterKey(!showOpenRouterKey)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showOpenRouterKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {settings.openRouterKey && (
                    <div className="flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Key detected! Click "Save Changes" below to activate.</span>
                    </div>
                  )}
                  <p className="text-[11px] text-slate-400">
                    Uses the specification mapping: /lesson & /interview → Claude 3.5 Sonnet, /quiz → GPT-4o, /vocab → Gemini Flash, /mistakes → DeepSeek-R1.
                  </p>
                </div>
              )}

              {settings.aiProvider === 'gemini' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                      <Key className="w-3.5 h-3.5 text-blue-500" />
                      <span>Google Gemini API Key</span>
                    </label>
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600 hover:underline flex items-center space-x-1"
                    >
                      <span>Get Gemini Key</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="password"
                    value={settings.geminiKey}
                    onChange={(e) => setSettings({ ...settings, geminiKey: e.target.value })}
                    placeholder="AIzaSy..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
              )}

              {settings.aiProvider === 'openai' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                      <Key className="w-3.5 h-3.5 text-blue-500" />
                      <span>OpenAI API Key</span>
                    </label>
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600 hover:underline flex items-center space-x-1"
                    >
                      <span>Get OpenAI Key</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="password"
                    value={settings.openAiKey}
                    onChange={(e) => setSettings({ ...settings, openAiKey: e.target.value })}
                    placeholder="sk-..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
              )}

              {/* Voice Settings */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Speech & Audio Settings
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                      Pronunciation & Speech Rate: {settings.speechRate}x
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Default 0.95x for clear Indian English comprehension
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.6"
                    max="1.2"
                    step="0.05"
                    value={settings.speechRate}
                    onChange={(e) => setSettings({ ...settings, speechRate: parseFloat(e.target.value) })}
                    className="w-32"
                  />
                </div>
              </div>

              {/* ISO-8859-1 Header Fix Section */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                      Fixed: ISO-8859-1 Header Error Solution
                    </span>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center space-x-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 hover:underline"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedCode ? 'Copied Code!' : 'Copy Code Snippet'}</span>
                  </button>
                </div>

                <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                  The application automatically sanitizes all request headers so that emojis and non-ASCII characters never cause the browser error: <code>"Failed to read 'headers' property: String contains non ISO-8859-1 code point."</code>
                </p>

                <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[10px] overflow-x-auto leading-tight">
                  {headerSanitizationSnippet}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>

          {activeTab === 'ai' ? (
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('ai')}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-bold text-xs transition-all"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Configure AI Engine →</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
