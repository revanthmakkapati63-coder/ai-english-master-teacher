// Web Speech API wrapper for Speech Synthesis and Recognition

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private recognition: any = null;
  private isListening: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.voices.length && this.synth) {
      this.loadVoices();
    }
    return this.voices.filter(v => v.lang.startsWith('en'));
  }

  public speak(
    text: string,
    options?: {
      rate?: number; // 0.7 for slow/pronunciation, 1.0 for normal
      pitch?: number;
      voiceLang?: 'en-IN' | 'en-GB' | 'en-US' | 'te-IN' | 'hi-IN' | 'ta-IN' | 'kn-IN' | string;
      onEnd?: () => void;
    }
  ): void {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser.');
      options?.onEnd?.();
      return;
    }

    this.synth.cancel(); // cancel any ongoing speech

    // Clean text of markdown artifacts for natural speaking
    const cleanText = text
      .replace(/[*_#`~[\]]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      options?.onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = options?.rate ?? 1.0;
    utterance.pitch = options?.pitch ?? 1.0;

    // Pick best matching voice
    const targetLang = options?.voiceLang || 'en-IN';
    const preferredVoice =
      this.voices.find(v => v.lang.toLowerCase() === targetLang.toLowerCase()) ||
      this.voices.find(v => v.lang.toLowerCase().startsWith(targetLang.toLowerCase().slice(0, 2))) ||
      this.voices.find(v => v.lang.startsWith('en-IN')) ||
      this.voices.find(v => v.lang.startsWith('en-GB')) ||
      this.voices.find(v => v.lang.startsWith('en-US')) ||
      this.voices.find(v => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      options?.onEnd?.();
    };

    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      options?.onEnd?.();
    };

    this.synth.speak(utterance);
  }

  public stopSpeaking(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  public startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): boolean {
    if (!this.isSpeechRecognitionSupported()) {
      onError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return false;
    }

    if (this.isListening) {
      this.stopListening();
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-IN'; // Indian English accent recognition

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        if (text) {
          onResult(text, Boolean(finalTranscript));
        }
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          onError('Microphone permission denied. Please allow microphone access.');
        } else if (event.error !== 'no-speech') {
          onError(`Speech recognition error: ${event.error}`);
        }
        this.isListening = false;
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onEnd();
      };

      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      onError(err?.message || 'Could not start speech recognition.');
      this.isListening = false;
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (err) {
        console.warn('Recognition stop error:', err);
      }
      this.isListening = false;
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

export const speechService = new SpeechService();
