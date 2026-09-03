import React, { useState } from 'react';
import {
  Star,
  X,
  MessageSquare,
  Share2,
  CheckCircle2,
  Sparkles,
  Send,
  Heart,
  Smile
} from 'lucide-react';
import { StudentProfile } from '../types';
import { triggerConfetti } from './Confetti';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  profile
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    '📞 Live Voice Call',
    '📸 Newspaper Photo OCR',
    '🗣️ Tell in Telugu'
  ]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const featuresList = [
    '📞 Live Voice Call',
    '📸 Newspaper Photo OCR',
    '🗣️ Tell in Telugu',
    '💼 Mock Interview Simulator',
    '🎮 Sentence Builder Game',
    '🎧 Pronunciation Trainer',
    '✍️ Writing & Rewrite Practice',
    '🎭 Campus Roleplay Studio'
  ];

  const toggleFeature = (feat: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feat) ? prev.filter(f => f !== feat) : [...prev, feat]
    );
  };

  const handleSendReviewWhatsApp = () => {
    triggerConfetti();
    setIsSubmitted(true);

    const starsStr = '⭐'.repeat(rating);
    const message = `⭐ *AI English Master Teacher - Android User Review* ⭐
👤 *Reviewer:* ${profile.name} (1st Year B.Tech, ${profile.btech.branch || 'Engineering'})
🌟 *Rating:* ${rating}/5 Stars (${starsStr})

🔥 *Features Tested:*
${selectedFeatures.map(f => `• ${f}`).join('\n')}

💬 *Review & Feedback:*
"${feedbackText || 'Amazing English learning app! The oral pronunciation corrections and Telugu explanations are super helpful.'}"

📱 *Tested on Android / Web App*
👉 App Link: http://localhost:3000/`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shadow-inner border border-white/20">
              ⭐
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">
                Rate & Review This App
              </h2>
              <p className="text-xs text-amber-100">
                Share your review and suggestions directly via WhatsApp
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
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-sm">
          {/* Star Rating */}
          <div className="text-center space-y-2 py-2 bg-amber-50/60 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900/50">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              Your Overall Rating:
            </span>
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400 drop-shadow-md'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-semibold text-amber-900 dark:text-amber-200">
              {rating === 5 && 'Outstanding! (5/5) 🔥'}
              {rating === 4 && 'Very Good! (4/5) 👍'}
              {rating === 3 && 'Good / Useful (3/5) 🙂'}
              {rating === 2 && 'Needs Improvement (2/5) 🛠️'}
              {rating === 1 && 'Poor (1/5) ⚠️'}
            </p>
          </div>

          {/* Features Tested */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Which features did you test on Android?
            </label>
            <div className="flex flex-wrap gap-1.5">
              {featuresList.map((f) => {
                const isSelected = selectedFeatures.includes(f);
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleFeature(f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {f} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback Text Area */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Your Review / Suggestions for the Developer:
            </label>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="What did you like the most? What should we add or improve for your B.Tech English practice?"
              rows={4}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* WhatsApp Direct Send Action */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 space-y-3">
            <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
              <Share2 className="w-4 h-4 text-emerald-600" />
              <span>Send Your Review Directly to the Creator:</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Clicking below will format your star rating and review into WhatsApp so you can send it to the developer or group in 1 second.
            </p>

            <button
              onClick={handleSendReviewWhatsApp}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Send Review via WhatsApp</span>
            </button>
          </div>

          {isSubmitted && (
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-200 text-center animate-fade-in">
              ✓ Thank you! WhatsApp has been opened with your review.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
