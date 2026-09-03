# 🎓 AI English Master Teacher

> **An intelligent, personal English fluency, communication, and campus placement coach designed for students transitioning from mother tongue thinking (Telugu/Hindi) to confident English thinking.**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-teal)
![PWA](https://img.shields.io/badge/PWA-Ready-green)

---

## 🌟 Key Features

1. **Mode A: Interactive English Improvement**  
   Type any sentence; errors appear as interactive chips. Tap for quick fixes or long-press for word cards (spelling, pronunciation audio, meaning, and mistake notebook).

2. **Mode B: Roman Telugu Assistant**  
   Preserves Roman Telugu input and teaches natural English phrasing without converting to Telugu script.

3. **Mode C: Master Teacher Conversational Coach**  
   Guided interactive tutor with voice microphone input, speech synthesis, and shortcut commands (`/lesson`, `/quiz`, `/vocab`, `/speaking`, `/interview`, `/dailysystem`, `/mistakes`, `/progress`).

4. **📞 Hands-Free Live Voice Call**  
   Practice oral speaking like talking on a phone call with your AI tutor. Features hands-free auto turn-taking and real-time correction badges.

5. **📸 Newspaper Photo Reader & GK Coach**  
   Photograph any English newspaper (*The Hindu*, *Times of India*). On-device OCR extracts text, evaluates oral reading pronunciation, calculates accuracy % & WPM, and provides Telugu explanations.

6. **💼 B.Tech Mock Interview Simulator**  
   Realistic placement interviews (HR, Technical, Projects) with 8-criteria scoring (/10) and a retry progress tracker.

7. **🎧 Pronunciation & Syllable Trainer**  
   Master tricky technical words with syllable stress guides, slow 0.7x audio, and speech recognition scoring.

8. **✍️ Writing Practice & Rewrite Comparison**  
   Practice emails, seminar scripts, and exam answers with side-by-side Attempt 1 vs. Attempt 2 evaluation.

9. **🎮 Interactive Sentence Builder Game**  
   Tap word chips to construct natural English sentences while dodging common mother-tongue translation traps.

10. **🎭 B.Tech Campus Roleplay Studio**  
    Simulate real college dialogues (explaining code bugs to lab faculty, asking seniors for placement advice).

11. **🗣️ Tell in My Language / నా భాషలో వివరణ**  
    Ask the AI anytime to explain any word, sentence, or grammar rule in Telugu (తెలుగు), Hindi, Tamil, or Kannada with native voice playback.

12. **📱 Progressive Web App (PWA) & Android Ready**  
    Install directly on Android phones as a native app via Google Chrome ("Install app") with full-screen standalone support.

---

## 🚀 Quick Start (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ai-english-master-teacher.git
cd ai-english-master-teacher
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 🔑 AI Engine Configuration

The app includes a **Built-in Smart Pedagogical Engine** that works **100% free and offline** with zero setup or API keys.

If you wish to connect frontier LLMs (Claude 3.5 Sonnet, GPT-4o, Gemini 2.5 Flash, DeepSeek-R1):
1. Click the **`🔑 API Key`** button in the top navigation bar.
2. Select **OpenRouter**, **Google Gemini**, or **OpenAI**, paste your API key, and click **Save Changes**.
3. Alternatively, create a `.env` file based on `.env.example`:
   ```env
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key
   ```

---

## 📱 Running on Android & Mobile

1. Run with network access:
   ```bash
   npm run dev -- --host
   ```
2. Open Chrome on your Android phone and navigate to `http://<your-computer-ip>:3000`.
3. Tap the **three dots (`⋮`)** in Chrome and select **"Install app"** or **"Add to Home Screen"**.
4. The app installs on your Android phone's home screen and runs in full-screen standalone mode.

---

## 🛡️ Privacy & Zero Hardcoded Data

* **No personal data is saved in this repository.**
* When any new user opens the app, an interactive onboarding setup wizard prompts for their name, native language, branch, and college.
* All data is stored locally in the user's browser via `localStorage`.

---

## 📄 License
MIT License. Free for students, educators, and developers.
