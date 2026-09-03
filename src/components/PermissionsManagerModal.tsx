import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Mic,
  Camera,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  Lock,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import { permissionsService, PermissionStatusState } from '../services/permissionsService';
import { triggerConfetti } from './Confetti';

interface PermissionsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PermissionsManagerModal: React.FC<PermissionsManagerModalProps> = ({
  isOpen,
  onClose
}) => {
  const [status, setStatus] = useState<PermissionStatusState>({
    microphone: 'prompt',
    camera: 'prompt',
    allGranted: false
  });
  const [isRequesting, setIsRequesting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      checkCurrentStatus();
    }
  }, [isOpen]);

  const checkCurrentStatus = async () => {
    const s = await permissionsService.checkPermissions();
    setStatus(s);
  };

  if (!isOpen) return null;

  const handleGrantAll = async () => {
    setIsRequesting(true);
    setMessage(null);

    try {
      const result = await permissionsService.requestAllPermissions();
      setMessage(result.message);
      await checkCurrentStatus();

      if (result.success) {
        triggerConfetti();
      }
    } catch (err: any) {
      console.warn('Grant all permissions error:', err);
      setMessage('Failed to request permissions: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shadow-inner border border-white/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">
                Browser Permissions Center
              </h2>
              <p className="text-xs text-emerald-100">
                Grant Microphone, Camera & Audio for voice coaching and newspaper reading
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-sm">
          {/* Main Action Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block">
                  One-Click Permission Authorization
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Click the button below so the AI Master Teacher can listen to your oral speaking, coach your pronunciation, and scan your newspaper photos without interruptions.
                </p>
              </div>
            </div>

            <button
              onClick={handleGrantAll}
              disabled={isRequesting}
              className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {isRequesting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Requesting Browser Access...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Grant All Permissions (Mic & Camera)</span>
                </>
              )}
            </button>

            {message && (
              <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-200 p-2.5 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-emerald-200 dark:border-emerald-800">
                {message}
              </p>
            )}
          </div>

          {/* Individual Permission Status Cards */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Device Permissions Status:
            </span>

            {/* Microphone */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                    Microphone (Voice Input & Speaking)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Used for oral reading, mock interviews, and teacher chat
                  </span>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center space-x-1 ${
                status.microphone === 'granted'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
              }`}>
                {status.microphone === 'granted' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Allowed ✓</span>
                  </>
                ) : (
                  <span>Ready to Allow</span>
                )}
              </span>
            </div>

            {/* Camera */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-300 flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                    Camera (Newspaper Snapshots)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Used to photograph newspapers for instant AI OCR scanning
                  </span>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center space-x-1 ${
                status.camera === 'granted'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
              }`}>
                {status.camera === 'granted' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Allowed ✓</span>
                  </>
                ) : (
                  <span>Ready to Allow</span>
                )}
              </span>
            </div>

            {/* Audio Synthesis */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                    Audio Output (Speech Synthesis)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Used for pronunciation playback and Telugu explanation audio
                  </span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Active ✓</span>
              </span>
            </div>
          </div>

          {/* Fallback Browser Instructions if blocked */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs space-y-2 text-slate-600 dark:text-slate-400">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-500" />
              <span>If your browser shows "Permission Blocked":</span>
            </span>
            <p>
              1. Look at the left side of your browser URL bar (where it says <code>localhost:3000</code>).
            </p>
            <p>
              2. Click the <strong>View site information / Tune / Lock icon</strong>.
            </p>
            <p>
              3. Set both <strong>Microphone</strong> and <strong>Camera</strong> to <strong>Allow</strong>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
