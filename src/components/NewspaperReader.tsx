import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Newspaper,
  Volume2,
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  HelpCircle,
  RotateCcw,
  Languages,
  Award,
  Globe,
  Lightbulb,
  FileText,
  Clock,
  RefreshCw,
  Video,
  X
} from 'lucide-react';
import { NewspaperArticle, ReadingEvaluation } from '../types';
import { SAMPLE_NEWSPAPERS, newspaperService } from '../services/newspaperService';
import { speechService } from '../services/speechService';
import { triggerConfetti } from './Confetti';

export const NewspaperReader: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<NewspaperArticle>(SAMPLE_NEWSPAPERS[0]);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

  // Camera Snapshot state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // Reading Aloud state
  const [isReading, setIsReading] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [readingStartTime, setReadingStartTime] = useState<number | null>(null);
  const [evaluation, setEvaluation] = useState<ReadingEvaluation | null>(null);

  // Model voice reading
  const [isTeacherReading, setIsTeacherReading] = useState(false);

  // "If Do Not Understand" active tab
  const [understandTab, setUnderstandTab] = useState<'simple_english' | 'telugu' | 'gk' | 'vocab'>('telugu');

  // Handle Photo File Upload / Mobile Camera Capture
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show image preview
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Process OCR
    setIsOcrProcessing(true);
    setOcrProgress(15);
    setEvaluation(null);
    setSpokenTranscript('');

    try {
      setOcrProgress(40);
      const extractedText = await newspaperService.extractTextFromImage(file, (p) => {
        setOcrProgress(Math.round(p * 100));
      });

      const comprehension = newspaperService.generateComprehensionFromText(extractedText);

      const customArticle: NewspaperArticle = {
        id: 'news-user-' + Date.now(),
        title: comprehension.title || 'Captured Newspaper Article',
        source: 'Your Newspaper Photo',
        date: 'Today',
        category: 'National & AP',
        text: extractedText,
        simpleEnglishExplanation: comprehension.simpleEnglishExplanation || 'Here is the simplified explanation of the text from your photo.',
        teluguExplanation: comprehension.teluguExplanation || 'మీరు ఫోటో తీసిన న్యూస్‌పేపర్ వార్త యొక్క తెలుగు వివరణ ఇది.',
        gkTakeaways: comprehension.gkTakeaways || [
          'Reading daily newspapers builds General Knowledge (GK) for placements.',
          'Notice new vocabulary and sentence structures to speak confidently.'
        ],
        keyVocabulary: comprehension.keyVocabulary || []
      };

      setSelectedArticle(customArticle);
      triggerConfetti();
    } catch (err: any) {
      console.error('OCR Extraction error:', err);
      alert('Could not extract clear text from photo. Please make sure the photo is sharp and well lit, or choose one of our sample newspaper clippings.');
    } finally {
      setIsOcrProcessing(false);
      setOcrProgress(0);
    }
  };

  // HTML5 Webcam direct snapshot
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      alert('Camera access could not be started. You can still use the "Upload Newspaper Photo" button or sample clippings!');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const captureCameraSnapshot = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    stopCamera();

    const dataUrl = canvas.toDataURL('image/jpeg');
    setUploadedImagePreview(dataUrl);

    setIsOcrProcessing(true);
    setOcrProgress(20);
    setEvaluation(null);

    try {
      const extractedText = await newspaperService.extractTextFromImage(dataUrl);
      const comprehension = newspaperService.generateComprehensionFromText(extractedText);

      const customArticle: NewspaperArticle = {
        id: 'news-snap-' + Date.now(),
        title: comprehension.title || 'Newspaper Snapshot',
        source: 'Live Camera Snapshot',
        date: 'Today',
        category: 'Technology',
        text: extractedText,
        simpleEnglishExplanation: comprehension.simpleEnglishExplanation || 'Plain English summary of the captured text.',
        teluguExplanation: comprehension.teluguExplanation || 'ఈ ఫోటోలోని వార్త తెలుగు వివరణ.',
        gkTakeaways: comprehension.gkTakeaways || ['General knowledge current affairs point.'],
        keyVocabulary: comprehension.keyVocabulary || []
      };

      setSelectedArticle(customArticle);
      triggerConfetti();
    } catch (err) {
      console.error('Snapshot OCR err:', err);
    } finally {
      setIsOcrProcessing(false);
    }
  };

  // Oral Reading Aloud: "Press button, then speak, then it listens and corrects it"
  const handleToggleReading = () => {
    if (isReading) {
      // Stop reading and evaluate
      speechService.stopListening();
      setIsReading(false);

      const duration = readingStartTime ? (Date.now() - readingStartTime) / 1000 : 15;
      const evalResult = newspaperService.evaluateOralReading(
        selectedArticle.text,
        spokenTranscript,
        duration
      );
      setEvaluation(evalResult);
      if (evalResult.accuracyPercentage >= 80) {
        triggerConfetti();
      }
    } else {
      // Start reading
      setSpokenTranscript('');
      setEvaluation(null);
      setReadingStartTime(Date.now());

      const started = speechService.startListening(
        (transcript, isFinal) => {
          setSpokenTranscript(transcript);
        },
        (err) => {
          console.warn('Speech err:', err);
          setIsReading(false);
        },
        () => {
          setIsReading(false);
        }
      );

      if (started) {
        setIsReading(true);
      }
    }
  };

  // Listen to Teacher model pronunciation
  const handleTeacherModelReading = () => {
    if (isTeacherReading) {
      speechService.stopSpeaking();
      setIsTeacherReading(false);
      return;
    }

    setIsTeacherReading(true);
    speechService.speak(selectedArticle.text, {
      rate: 0.9,
      onEnd: () => setIsTeacherReading(false)
    });
  };

  const handleSpeakWord = (word: string, slow: boolean = false) => {
    speechService.speak(word, { rate: slow ? 0.7 : 0.95 });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-700 via-teal-700 to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-teal-500/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-200 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20">AI Newspaper Coach</span>
              <span>General Knowledge • Oral Reading • Pronunciation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Newspaper Photo Reader & GK Coach
            </h1>
            <p className="mt-1 text-sm text-cyan-100 max-w-xl">
              Snap a photo of your English newspaper (*The Hindu, Times of India*). Read it aloud with the microphone to get live pronunciation correction and Telugu comprehension!
            </p>
          </div>

          {/* Action Buttons: Take Photo or Upload */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={startCamera}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-white text-teal-800 hover:bg-cyan-50 font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <Camera className="w-4 h-4 text-teal-600" />
              <span>Take Photo (Camera)</span>
            </button>

            <label className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95 border border-white/20">
              <Upload className="w-4 h-4" />
              <span>Upload Photo</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Live Webcam Modal if active */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                <Camera className="w-4 h-4 text-teal-600" />
                <span>Snap Newspaper Photo</span>
              </h3>
              <button
                onClick={stopCamera}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-4 border-2 border-dashed border-white/60 rounded-xl pointer-events-none flex items-center justify-center">
                <span className="text-[11px] bg-black/60 text-white px-2 py-1 rounded-lg">
                  Position newspaper headline inside frame
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={stopCamera}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={captureCameraSnapshot}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md"
              >
                Capture & OCR Extract
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OCR Loading Overlay */}
      {isOcrProcessing && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-teal-500/40 shadow-sm text-center space-y-3 animate-fade-in">
          <RefreshCw className="w-8 h-8 text-teal-600 mx-auto animate-spin" />
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
            Scanning & Extracting English Text from Newspaper Photo...
          </h3>
          <div className="w-64 mx-auto bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-teal-500 h-full transition-all duration-300"
              style={{ width: `${ocrProgress || 65}%` }}
            />
          </div>
          <p className="text-xs text-slate-400">
            Applying Tesseract AI OCR and analyzing General Knowledge keywords...
          </p>
        </div>
      )}

      {/* Sample Newspaper Clippings Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <Newspaper className="w-3.5 h-3.5 text-teal-600" />
            <span>Or Choose a Curated B.Tech / National News Clipping:</span>
          </span>
          {uploadedImagePreview && (
            <span className="text-xs text-teal-600 font-semibold">
              Currently showing your photo capture
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
          {SAMPLE_NEWSPAPERS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedArticle(item);
                setUploadedImagePreview(null);
                setEvaluation(null);
                setSpokenTranscript('');
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 border flex items-center space-x-2 ${
                selectedArticle.id === item.id && !uploadedImagePreview
                  ? 'border-teal-600 bg-teal-50/80 dark:bg-teal-950/40 text-teal-900 dark:text-teal-100 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-teal-50/40'
              }`}
            >
              <span>{item.source}: {item.category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Newspaper Article & Reading Station */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Article Text & Oral Reading Controls */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          {/* Article Header */}
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2.5 py-0.5 rounded-full">
                {selectedArticle.source} • {selectedArticle.category}
              </span>
              <button
                onClick={handleTeacherModelReading}
                className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-teal-600 p-1"
                title="Hear Teacher read this article out loud"
              >
                <Volume2 className={`w-4 h-4 ${isTeacherReading ? 'text-teal-600 animate-bounce' : ''}`} />
                <span>{isTeacherReading ? 'Pause Teacher' : 'Listen to Model Reading'}</span>
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 leading-snug">
              {selectedArticle.title}
            </h2>
          </div>

          {/* Newspaper Passage (Interactive Highlighting when evaluated) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Newspaper English Passage:
              </span>
              <span className="text-xs text-slate-400">
                Tap words below to hear correct pronunciation
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-base leading-relaxed font-serif text-slate-800 dark:text-slate-200">
              {evaluation ? (
                // Highlight evaluated words!
                <div className="flex flex-wrap gap-1">
                  {evaluation.wordStatuses.map((item, idx) => (
                    <span
                      key={idx}
                      onClick={() => handleSpeakWord(item.word, true)}
                      title={item.isMatched ? 'Pronounced correctly! Tap to hear' : 'Mispronounced or skipped! Tap to hear correct audio'}
                      className={`px-1.5 py-0.5 rounded cursor-pointer transition-all ${
                        item.isMatched
                          ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-medium'
                          : 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 font-bold underline decoration-wavy decoration-rose-500'
                      }`}
                    >
                      {item.word}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{selectedArticle.text}</p>
              )}
            </div>
          </div>

          {/* ORAL READING BUTTON & CONTROLS */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-slate-800/80 dark:to-slate-800/40 border border-teal-200 dark:border-slate-700 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <Mic className="w-4 h-4 text-teal-600" />
                  <span>Oral Reading Practice Station</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Click the button, read the newspaper passage above out loud, and click again to get your correction report!
                </p>
              </div>

              <button
                onClick={handleToggleReading}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95 shrink-0 ${
                  isReading
                    ? 'bg-rose-600 text-white animate-pulse shadow-rose-500/20'
                    : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-500/20'
                }`}
              >
                {isReading ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                <span>{isReading ? 'Done Reading (Analyze)' : 'Start Reading Aloud'}</span>
              </button>
            </div>

            {/* Live Transcript Stream */}
            {isReading && (
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-teal-200 dark:border-slate-700 text-xs space-y-1 animate-fade-in">
                <span className="font-bold text-teal-600 flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  <span>Listening to your speech...</span>
                </span>
                <p className="italic text-slate-600 dark:text-slate-300">
                  {spokenTranscript || 'Speak clearly into your microphone...'}
                </p>
              </div>
            )}
          </div>

          {/* Reading Evaluation Report (When finished reading) */}
          {evaluation && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-500/40 shadow-sm space-y-5 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Award className="w-6 h-6 text-emerald-600" />
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                    Oral Reading Evaluation & Pronunciation Check
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400">Accuracy:</span>
                  <span className="text-xl font-black text-emerald-600">
                    {evaluation.accuracyPercentage}%
                  </span>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">Words Matched</span>
                  <span className="text-base font-bold text-emerald-600">
                    {evaluation.matchedWordsCount} / {evaluation.totalWords}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">Reading Speed</span>
                  <span className="text-base font-bold text-slate-800 dark:text-slate-200">
                    {evaluation.fluencyWpm} WPM
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">Rating</span>
                  <span className="text-base font-bold text-teal-600">
                    {evaluation.accuracyPercentage >= 85 ? 'Fluent' : 'Developing'}
                  </span>
                </div>
              </div>

              {/* Feedback */}
              <p className="text-xs text-slate-700 dark:text-slate-300 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
                <strong>Teacher's Observation:</strong> {evaluation.feedback}
              </p>

              {/* Mispronounced Words Correction List */}
              {evaluation.mispronouncedWords.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600 block">
                    Words to Refine & Pronounce Clearly:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {evaluation.mispronouncedWords.map((item, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                            {item.word}
                          </span>
                          <span className="text-[10px] text-slate-500 block font-mono">
                            {item.suggestedPronunciation}
                          </span>
                        </div>
                        <button
                          onClick={() => handleSpeakWord(item.word, true)}
                          title="Listen to slow pronunciation"
                          className="p-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column (1 col): "IF DO NOT UNDERSTAND" Assistant & GK Hub */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-5">
          {/* Header */}
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                If You Do Not Understand:
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Never get stuck on difficult newspaper English. Get instant Telugu explanations and GK points!
            </p>
          </div>

          {/* Subtabs for Comprehension */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setUnderstandTab('telugu')}
              className={`py-1.5 rounded-xl transition-all ${
                understandTab === 'telugu'
                  ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              తెలుగు వివరణ
            </button>
            <button
              onClick={() => setUnderstandTab('simple_english')}
              className={`py-1.5 rounded-xl transition-all ${
                understandTab === 'simple_english'
                  ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Simple English
            </button>
            <button
              onClick={() => setUnderstandTab('gk')}
              className={`py-1.5 rounded-xl transition-all ${
                understandTab === 'gk'
                  ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              GK Exam Points
            </button>
            <button
              onClick={() => setUnderstandTab('vocab')}
              className={`py-1.5 rounded-xl transition-all ${
                understandTab === 'vocab'
                  ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              News Vocab
            </button>
          </div>

          {/* Content Views */}
          <div className="space-y-4">
            {/* TELUGU EXPLANATION */}
            {understandTab === 'telugu' && (
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2 animate-fade-in">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
                  తెలుగు వివరణ (Telugu Meaning & Context):
                </span>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                  {selectedArticle.teluguExplanation}
                </p>
                <p className="text-[11px] text-amber-700 dark:text-amber-400 italic pt-1">
                  *Tip: Notice how understanding the story in Telugu first helps you connect the English terms naturally!
                </p>
              </div>
            )}

            {/* SIMPLE ENGLISH */}
            {understandTab === 'simple_english' && (
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 space-y-2 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">
                    Plain Everyday English:
                  </span>
                  <button
                    onClick={() => speechService.speak(selectedArticle.simpleEnglishExplanation)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Listen"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                  "{selectedArticle.simpleEnglishExplanation}"
                </p>
              </div>
            )}

            {/* GK EXAM POINTS */}
            {understandTab === 'gk' && (
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-2.5 animate-fade-in">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                  General Knowledge (GK) Facts for Placement & Exams:
                </span>
                <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2 list-disc pl-4">
                  {selectedArticle.gkTakeaways.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* VOCABULARY */}
            {understandTab === 'vocab' && (
              <div className="space-y-2.5 animate-fade-in">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Journalistic Words in this Article:
                </span>
                {selectedArticle.keyVocabulary.map((v, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-teal-700 dark:text-teal-300">
                        {v.word}
                      </span>
                      <button
                        onClick={() => handleSpeakWord(v.word)}
                        className="text-slate-400 hover:text-teal-600"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      {v.meaning}
                    </p>
                    {v.teluguMeaning && (
                      <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                        తెలుగు: {v.teluguMeaning}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
