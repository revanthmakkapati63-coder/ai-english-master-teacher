import React, { useState } from 'react';
import {
  Smartphone,
  X,
  Share2,
  Download,
  Globe,
  Wifi,
  Copy,
  Check,
  Star,
  ExternalLink,
  QrCode,
  ArrowRight
} from 'lucide-react';
import { triggerConfetti } from './Confetti';

interface AndroidShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReview: () => void;
}

export const AndroidShareModal: React.FC<AndroidShareModalProps> = ({
  isOpen,
  onClose,
  onOpenReview
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const currentHost = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

  const handleShareToWhatsApp = () => {
    triggerConfetti();
    const text = `🎓 *Try AI English Master Teacher on Android!* 📱
_Personal B.Tech English Fluency & Placement Coach_

✨ *Features on Mobile:*
• 📞 *Live Hands-Free Voice Call* (Talk to AI tutor like a phone call)
• 📸 *Newspaper Photo Reader* (Snap photo of The Hindu, read aloud, get oral accuracy scores)
• 🗣️ *Tell in Telugu (నా భాషలో చెప్పండి)* (Instant native explanations)
• 💼 *Mock Placement Interviews & Questions*
• 🎮 *Interactive Sentence Game & Campus Roleplay*

📲 *How to Install on Android:*
1. Open this link in Google Chrome on your phone:
👉 ${currentHost}
2. Tap the *3 dots (⋮)* in the top-right of Chrome.
3. Tap *“Install app”* or *“Add to Home Screen”*.
4. It will install on your home screen like a native Android app!

⭐ *After testing, please click the "Review" button inside the app to send your feedback!*`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentHost);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shadow-inner border border-white/20">
              📱
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-extrabold tracking-tight">
                  Share to Android Users & Collect Reviews
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-bold uppercase">
                  PWA Mobile App
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                Install as a native app on Android phones without the Google Play Store
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Main Action Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 flex items-center space-x-1.5">
                <Share2 className="w-4 h-4" />
                <span>Share with Classmates & Reviewers via WhatsApp</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Send the app link directly to your WhatsApp contacts or college study groups so they can install it on their Android phones and send you reviews.
            </p>

            <button
              onClick={handleShareToWhatsApp}
              className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 transition-all active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>Share App & Invite Reviews via WhatsApp</span>
            </button>
          </div>

          {/* How Android Users Install It As An App */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              How Android Users Install It (Zero Play Store Needed):
            </span>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                    Open in Chrome on Android
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Open the link in Google Chrome or Samsung Internet.
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                    Tap "Install App" or "Add to Home Screen"
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Tap the <strong>3 dots (⋮)</strong> menu in Chrome, then tap <strong>"Install app"</strong> or <strong>"Add to Home Screen"</strong>.
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                    Launches Full Screen Like a Real APK
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    The 🎓 English AI app icon appears on their phone's app drawer and opens full-screen without any browser address bar!
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Ways to Share */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              3 Ways to Give Android Users Access:
            </span>

            {/* Method A: Free 1-Minute Public Hosting */}
            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-blue-900 dark:text-blue-200 flex items-center space-x-1.5">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>Method 1: Free Public Link (Works for Anyone, Anywhere)</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 font-bold">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                To give your friends a permanent online link (e.g. <code>https://ai-english-teacher.netlify.app</code>) in 60 seconds:
              </p>
              <ol className="text-xs list-decimal list-inside space-y-1 text-slate-700 dark:text-slate-300 pl-1">
                <li>Go to <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="text-blue-600 underline font-bold">app.netlify.com/drop</a> in your browser.</li>
                <li>Drag and drop your built <code>dist</code> folder into the webpage.</li>
                <li>It instantly gives you a live HTTPS link that you can share with any Android user on WhatsApp!</li>
              </ol>
            </div>

            {/* Method B: Same Wi-Fi Access */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                  <Wifi className="w-4 h-4 text-emerald-500" />
                  <span>Method 2: Same Wi-Fi / Mobile Hotspot</span>
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                If the Android phone is connected to the same Wi-Fi or your mobile hotspot, they can open your computer's IP address (e.g. <code>http://192.168.x.x:3000</code>) directly in Chrome!
              </p>
            </div>

            {/* Method C: Package into an Actual APK File */}
            <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-purple-900 dark:text-purple-200 flex items-center space-x-1.5">
                  <Download className="w-4 h-4 text-purple-600" />
                  <span>Method 3: Convert to an Actual APK File (.apk)</span>
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                If you want a physical <code>.apk</code> file to send directly through WhatsApp:
              </p>
              <ul className="text-xs list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 pl-1">
                <li>
                  <strong>1-Click Free Tool (No Android Studio):</strong> Put your link on <a href="https://www.pwabuilder.com" target="_blank" rel="noreferrer" className="text-purple-600 underline font-bold">PWABuilder.com</a> $\to$ Click <strong>"Package for Android"</strong> $\to$ Download the generated <code>app.apk</code>!
                </li>
                <li>
                  <strong>Native Capacitor:</strong> Run <code>npx cap add android</code> and <code>npx cap open android</code> in your terminal to build using Android Studio.
                </li>
              </ul>
            </div>
          </div>

          {/* Collect Reviews Button */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-xs text-amber-900 dark:text-amber-200 flex items-center space-x-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>Test & Give Your Own Review</span>
              </span>
              <p className="text-[11px] text-slate-500">
                Try the app's built-in review system to see how Android users will submit feedback.
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenReview();
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-all active:scale-95 shrink-0"
            >
              Open Review Form →
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handleCopyLink}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-300"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
