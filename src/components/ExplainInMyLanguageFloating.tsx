import React from 'react';
import { Languages, ShieldCheck } from 'lucide-react';

interface ExplainInMyLanguageFloatingProps {
  onOpenExplain: () => void;
  onOpenPermissions: () => void;
}

export const ExplainInMyLanguageFloating: React.FC<ExplainInMyLanguageFloatingProps> = ({
  onOpenExplain,
  onOpenPermissions
}) => {
  return (
    <aside
      aria-label="Quick language assistance and permissions"
      className="fixed bottom-5 right-5 z-40 flex flex-col items-end space-y-2 animate-fade-in"
    >
      {/* Quick Permissions Status Button */}
      <button
        onClick={onOpenPermissions}
        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-white dark:bg-white/90 dark:text-slate-900 shadow-md backdrop-blur-md text-xs font-bold hover:scale-105 transition-all border border-white/20 active:scale-95"
        title="Check and grant microphone and camera permissions"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
        <span>Permissions (Mic/Cam)</span>
      </button>

      {/* Tell in My Language Floating Button */}
      <button
        onClick={onOpenExplain}
        className="flex items-center space-x-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-xl shadow-teal-500/30 text-sm font-extrabold hover:scale-105 transition-all border-2 border-white/30 active:scale-95 group"
        title="Ask AI to explain anything in your own language (Telugu / Hindi)"
      >
        <Languages className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span>Tell in Telugu / My Language (నా భాషలో చెప్పండి)</span>
      </button>
    </aside>
  );
};
