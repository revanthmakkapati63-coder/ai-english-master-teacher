import { createWorker } from 'tesseract.js';
import { NewspaperArticle, ReadingEvaluation } from '../types';

export const SAMPLE_NEWSPAPERS: NewspaperArticle[] = [
  {
    id: 'news-1',
    title: 'India Semiconductor Mission: New Chip Testing & Fab Facility in Andhra Pradesh',
    source: 'The Hindu',
    date: 'September 2026',
    category: 'Technology',
    text: 'Under the India Semiconductor Mission, the Union Cabinet has approved a major semiconductor packaging and testing facility in Andhra Pradesh. The project aims to accelerate indigenous chip manufacturing, generate specialized engineering jobs, and bolster the domestic electronics supply chain. State officials emphasized that local universities and engineering colleges in Vijayawada and Visakhapatnam will establish specialized VLSI design and microelectronics laboratories to prepare first-year students for emerging hardware careers.',
    simpleEnglishExplanation: 'The Indian government approved a new computer chip factory in Andhra Pradesh. This factory will test and assemble microchips. It will create many high-paying jobs for engineering students in fields like VLSI and electronics design.',
    teluguExplanation: 'భారత ప్రభుత్వం ఆంధ్రప్రదేశ్‌లో కొత్త సెమీకండక్టర్ (చిప్స్) తయారీ మరియు టెస్టింగ్ కేంద్రాన్ని ఏర్పాటు చేయడానికి ఆమోదం తెలిపింది. దీని వలన ఇంజనీరింగ్ విద్యార్థులకు విఎల్ఎస్ఐ (VLSI) మరియు ఎలక్ట్రానిక్స్ రంగాల్లో విస్తృత ఉద్యోగ అవకాశాలు లభిస్తాయి. (Andhra Pradesh lo kottha chip testing facility raavadam tho B.Tech students ki manchi career opportunities untaayi.)',
    gkTakeaways: [
      'India Semiconductor Mission (ISM) was launched by the Ministry of Electronics and IT (MeitY).',
      'Andhra Pradesh is emerging as a prominent hardware and electronics manufacturing cluster.',
      'VLSI stands for Very Large Scale Integration, crucial for modern computer microprocessor design.'
    ],
    keyVocabulary: [
      {
        word: 'Indigenous',
        pronunciation: 'in-DIJ-uh-nus',
        meaning: 'Originating or occurring naturally in a particular place; native or domestic.',
        teluguMeaning: 'స్వదేశీ / స్థానిక (Swadeshi / sthaanika)'
      },
      {
        word: 'Bolster',
        pronunciation: 'BOHL-ster',
        meaning: 'To support, strengthen, or fortify something.',
        teluguMeaning: 'బలోపేతం చేయడం (Balopetam cheyadam)'
      },
      {
        word: 'Semiconductor',
        pronunciation: 'SEM-ee-kun-duk-ter',
        meaning: 'A solid substance that conducts electricity under some conditions but not others, making it the foundation of computer chips.',
        teluguMeaning: 'అర్థవాహకం (Microchips tayareeki upayoginchedi)'
      }
    ]
  },
  {
    id: 'news-2',
    title: 'ISRO Announces Next-Gen Heavy Lift Launch Vehicle for Space Station Mission',
    source: 'Times of India',
    date: 'August 2026',
    category: 'Science & Space',
    text: 'The Indian Space Research Organisation (ISRO) successfully conducted a hot test of its indigenous semi-cryogenic engine at the propulsion complex. This milestone is a prerequisite for launching the Next-Generation Heavy Lift Vehicle, designed to deploy the proposed Bharatiya Antariksh Station by 2035. Scientists noted that cryogenic propulsion relies on liquid hydrogen and liquid oxygen stored at sub-zero temperatures to produce massive thrust with exceptional efficiency.',
    simpleEnglishExplanation: 'ISRO tested a powerful new rocket engine that uses liquid fuel at extremely cold temperatures. This rocket will help India build its own space station in orbit by the year 2035.',
    teluguExplanation: 'ఇస్రో (ISRO) స్వదేశీ సెమీ-క్రయోజెనిక్ రాకెట్ ఇంజిన్ పరీక్షను విజయవంతంగా పూర్తి చేసింది. ఈ శక్తివంతమైన రాకెట్ ద్వారా 2035 నాటికి భారతదేశం అంతరిక్షంలో సొంత అంతరిక్ష కేంద్రాన్ని (Bharatiya Antariksh Station) నిర్మించాలని లక్ష్యంగా పెట్టుకుంది.',
    gkTakeaways: [
      'ISRO headquarters is located in Bengaluru, Karnataka; primary launch base is Sriharikota, AP.',
      'Semi-cryogenic engines use refined kerosene (Isrosene) and liquid oxygen.',
      'Bharatiya Antariksh Station (BAS) is India’s planned modular space station.'
    ],
    keyVocabulary: [
      {
        word: 'Prerequisite',
        pronunciation: 'pree-REK-wuh-zit',
        meaning: 'A required condition before something else can happen.',
        teluguMeaning: 'ముందస్తు అవసరం (Mundastu avasaram)'
      },
      {
        word: 'Propulsion',
        pronunciation: 'pruh-PUL-shun',
        meaning: 'The action of driving or pushing forwards with force.',
        teluguMeaning: 'ముందుకు నెట్టే చోదక శక్తి (Chodaka shakti)'
      },
      {
        word: 'Sub-zero',
        pronunciation: 'SUB-ZEER-oh',
        meaning: 'Temperatures below zero degrees Celsius.',
        teluguMeaning: 'సున్నా డిగ్రీల కన్నా తక్కువ ఉష్ణోగ్రత'
      }
    ]
  },
  {
    id: 'news-3',
    title: 'AP State Council Mandates Generative AI and Ethics in First-Year B.Tech Syllabi',
    source: 'Deccan Chronicle',
    date: 'September 2026',
    category: 'Education',
    text: 'The Andhra Pradesh State Council of Higher Education has restructured the first-year engineering curriculum across autonomous and affiliated colleges. The revised syllabus introduces applied artificial intelligence, algorithmic problem solving, and professional communication skills right from the initial semesters. Officials emphasized that early exposure to coding frameworks and natural language tools will equip engineering students for multi-national corporate recruitment.',
    simpleEnglishExplanation: 'Universities in Andhra Pradesh updated their B.Tech first-year syllabus to teach AI and communication skills right from semester 1. This helps students get ready for software company interviews early.',
    teluguExplanation: 'ఆంధ్రప్రదేశ్ ఉన్నత విద్యా మండలి B.Tech మొదటి సంవత్సరం సిలబస్‌లో మార్పులు చేసి, ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ (AI) మరియు ప్రొఫెషనల్ కమ్యూనికేషన్ నైపుణ్యాలను తప్పనిసరి చేసింది.',
    gkTakeaways: [
      'APSCHE governs collegiate and technical higher education in Andhra Pradesh.',
      'Early integration of communication skills addresses the employability gap in campus placements.',
      'Generative AI models leverage large language data to automate coding and communication tasks.'
    ],
    keyVocabulary: [
      {
        word: 'Curriculum',
        pronunciation: 'kuh-RIK-yuh-lum',
        meaning: 'The subjects comprising a course of study in a school or college.',
        teluguMeaning: 'పాఠ్య ప్రణాళిక (Paathya pranaalika)'
      },
      {
        word: 'Restructure',
        pronunciation: 'ree-STRUK-cher',
        meaning: 'Organize differently; provide a new structure.',
        teluguMeaning: 'పునర్వ్యవస్థీకరించడం (Punar-vyavastheekarinchadam)'
      },
      {
        word: 'Mandate',
        pronunciation: 'MAN-dayt',
        meaning: 'An official order or commission to do something.',
        teluguMeaning: 'అధికారిక ఆదేశం (Adhikaarika aadesham)'
      }
    ]
  }
];

class NewspaperService {
  // OCR: Extract text from image file or blob
  public async extractTextFromImage(
    imageSource: File | Blob | string,
    onProgress?: (progress: number, status: string) => void
  ): Promise<string> {
    try {
      const worker = await createWorker('eng');
      
      const ret = await worker.recognize(imageSource);
      await worker.terminate();

      const cleaned = ret.data.text
        .replace(/\r\n/g, ' ')
        .replace(/\n+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      return cleaned || 'No readable English text detected. Please try a clearer image with good lighting.';
    } catch (err: any) {
      console.error('OCR Error:', err);
      throw new Error(`OCR Processing Failed: ${err?.message || 'Could not process image'}`);
    }
  }

  // Generate GK & Comprehension for custom captured newspaper text
  public generateComprehensionFromText(rawText: string): Partial<NewspaperArticle> {
    const words = rawText.split(/\s+/).filter(Boolean);
    const title = words.slice(0, 10).join(' ') + '...';

    return {
      title,
      source: 'Custom Newspaper Capture',
      date: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      category: 'National & AP',
      text: rawText,
      simpleEnglishExplanation: `This news article discusses: "${rawText.slice(0, 180)}...". In simple terms, it highlights key developments, events, and their impact on society, technology, or governance.`,
      teluguExplanation: `ఈ వార్తాంశం ముఖ్యమైన విషయాలను తెలియజేస్తుంది. మీరు ఇంగ్లీష్ వార్తలను రోజువారీగా చదవడం ద్వారా మీ జనరల్ నాలెడ్జ్ (GK) మరియు కమ్యూనికేషన్ స్కిల్స్ సులభంగా మెరుగుపడతాయి. (Ee news article chadavadam valla meeku current affairs mariyu vocabulary baaga artham avutaayi.)`,
      gkTakeaways: [
        'Reading daily newspapers enhances analytical vocabulary and general awareness for technical & HR interviews.',
        'Key terms in this article provide context for group discussions (GD) and competitive exams.',
        'Noticing sentence transitions in journalism helps develop clear formal writing.'
      ],
      keyVocabulary: [
        {
          word: words.find(w => w.length > 7)?.replace(/[^a-zA-Z]/g, '') || 'Development',
          pronunciation: 'dih-VEL-up-munt',
          meaning: 'A specified state of growth or advancement.',
          teluguMeaning: 'అభివృద్ధి (Abhivrudhi)'
        },
        {
          word: words.find(w => w.length > 8 && !w.includes('ing'))?.replace(/[^a-zA-Z]/g, '') || 'Significant',
          pronunciation: 'sig-NIF-uh-kunt',
          meaning: 'Sufficiently great or important to be worthy of attention.',
          teluguMeaning: 'ముఖ్యమైనది (Mukhyamainadi)'
        }
      ]
    };
  }

  // Oral Reading Assessment: Compares what the student read out loud with the original newspaper text
  public evaluateOralReading(
    originalText: string,
    spokenTranscript: string,
    durationSeconds: number = 15
  ): ReadingEvaluation {
    const cleanWord = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, '');

    const targetWords = originalText.split(/\s+/).filter(Boolean);
    const spokenWords = spokenTranscript.split(/\s+/).filter(Boolean).map(cleanWord);

    const wordStatuses: { word: string; isMatched: boolean; spokenWord?: string }[] = [];
    const missedWords: { word: string; suggestedPronunciation: string; tip: string }[] = [];

    let matchedCount = 0;
    let spokenIndex = 0;

    for (let i = 0; i < targetWords.length; i++) {
      const orig = targetWords[i];
      const cleanOrig = cleanWord(orig);

      if (!cleanOrig) continue;

      // Look ahead up to 3 words in spoken text to match flow
      let foundMatch = false;
      let matchedAt = -1;

      for (let s = spokenIndex; s < Math.min(spokenIndex + 4, spokenWords.length); s++) {
        if (spokenWords[s] === cleanOrig) {
          foundMatch = true;
          matchedAt = s;
          break;
        }
      }

      if (foundMatch) {
        wordStatuses.push({
          word: orig,
          isMatched: true,
          spokenWord: spokenWords[matchedAt]
        });
        matchedCount++;
        spokenIndex = matchedAt + 1;
      } else {
        wordStatuses.push({
          word: orig,
          isMatched: false
        });

        // If it's a prominent word, add to mispronounced/stumbled list
        if (cleanOrig.length > 5 && missedWords.length < 5) {
          missedWords.push({
            word: orig.replace(/[^a-zA-Z]/g, ''),
            suggestedPronunciation: cleanOrig.toUpperCase(),
            tip: `Break it into syllables: ${cleanOrig.slice(0, 3)}-${cleanOrig.slice(3)}. Practice saying it slowly.`
          });
        }
      }
    }

    const accuracyPercentage = Math.min(100, Math.round((matchedCount / Math.max(1, wordStatuses.length)) * 100));
    const wordsPerMinute = Math.round((spokenWords.length / Math.max(1, durationSeconds)) * 60);

    let feedback = 'Good attempt!';
    if (accuracyPercentage >= 90) {
      feedback = 'Outstanding oral reading! Your pronunciation, pacing, and word recognition are clear and natural.';
    } else if (accuracyPercentage >= 75) {
      feedback = 'Very good reading fluency! You pronounced most words accurately. Take a look at the highlighted words to refine stress.';
    } else {
      feedback = 'Encouraging start! Reading newspaper English aloud takes practice. Listen to the audio for difficult words and try reading one sentence at a time.';
    }

    return {
      accuracyPercentage,
      totalWords: wordStatuses.length,
      matchedWordsCount: matchedCount,
      wordStatuses,
      mispronouncedWords: missedWords,
      fluencyWpm: wordsPerMinute,
      feedback
    };
  }
}

export const newspaperService = new NewspaperService();
