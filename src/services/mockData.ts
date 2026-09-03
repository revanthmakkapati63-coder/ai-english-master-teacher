import { VocabWord, PronunciationItem } from '../types';

export const VOCABULARY_LIST: VocabWord[] = [
  {
    id: 'voc-1',
    word: 'Implement',
    partOfSpeech: 'verb',
    syllables: 'im-ple-ment',
    stress: 'IM·ple·ment',
    meaning: 'To put a decision, plan, system, or software into effect.',
    teluguMeaning: 'ఆచరణలో పెట్టడం / అమలు చేయడం (Amalu cheyadam)',
    exampleSentence: 'We implemented a binary search algorithm in our C lab project to reduce query time.',
    context: 'B.Tech / Tech',
    synonyms: ['Execute', 'Deploy', 'Apply', 'Carry out'],
    collocations: ['implement a solution', 'implement changes', 'implement code']
  },
  {
    id: 'voc-2',
    word: 'Articulate',
    partOfSpeech: 'verb / adjective',
    syllables: 'ar-tic-u-late',
    stress: 'ar·TIC·u·late',
    meaning: 'To express an idea or feeling fluently and clearly in speech or writing.',
    teluguMeaning: 'స్పష్టంగా వివరించడం / వ్యక్తీకరించడం (Spashtamga vivarinchadam)',
    exampleSentence: 'In technical interviews, you must articulate your logic step-by-step before coding.',
    context: 'Job Interview',
    synonyms: ['Express', 'Clarify', 'Enunciate', 'Communicate'],
    collocations: ['articulate thoughts', 'articulate clearly', 'articulate a vision']
  },
  {
    id: 'voc-3',
    word: 'Scalable',
    partOfSpeech: 'adjective',
    syllables: 'scal-a-ble',
    stress: 'SCAL·a·ble',
    meaning: 'Able to be changed in size or scale, especially handling growing amounts of work smoothly.',
    teluguMeaning: 'విస్తరించదగినది (Vistarinchadaginadi)',
    exampleSentence: 'Cloud computing allows engineering teams to build scalable database systems.',
    context: 'B.Tech / Tech',
    synonyms: ['Expandable', 'Adaptable', 'Extensible'],
    collocations: ['scalable architecture', 'scalable solution', 'highly scalable']
  },
  {
    id: 'voc-4',
    word: 'Elaborate',
    partOfSpeech: 'verb',
    syllables: 'e-lab-o-rate',
    stress: 'e·LAB·o·rate',
    meaning: 'To develop or present a theory, policy, or system in further detail.',
    teluguMeaning: 'విపులంగా వివరించడం (Vipulamga vivarinchadam)',
    exampleSentence: 'Could you please elaborate on how your semester project handles user authentication?',
    context: 'Job Interview',
    synonyms: ['Expand on', 'Detail', 'Flesh out'],
    collocations: ['elaborate on a point', 'elaborate further']
  },
  {
    id: 'voc-5',
    word: 'Demonstrate',
    partOfSpeech: 'verb',
    syllables: 'dem-on-strate',
    stress: 'DEM·on·strate',
    meaning: 'To clearly show the existence or truth of something by giving proof or evidence.',
    teluguMeaning: 'నిరూపించడం / చూపించడం (Choopinchadam)',
    exampleSentence: 'During our seminar, I demonstrated how the microcontroller connects to temperature sensors.',
    context: 'Presentation',
    synonyms: ['Showcase', 'Illustrate', 'Exhibit'],
    collocations: ['demonstrate ability', 'demonstrate results', 'clearly demonstrate']
  },
  {
    id: 'voc-6',
    word: 'Prerequisite',
    partOfSpeech: 'noun',
    syllables: 'pre-req-ui-site',
    stress: 'pre·REQ·ui·site',
    meaning: 'A thing that is required as a prior condition for something else to happen or exist.',
    teluguMeaning: 'ముందస్తు అవసరం (Mundastu avasaram)',
    exampleSentence: 'Understanding C pointers is an essential prerequisite for learning Data Structures.',
    context: 'College Life',
    synonyms: ['Requirement', 'Precondition', 'Must-have'],
    collocations: ['essential prerequisite', 'course prerequisite']
  },
  {
    id: 'voc-7',
    word: 'Collaborate',
    partOfSpeech: 'verb',
    syllables: 'col-lab-o-rate',
    stress: 'col·LAB·o·rate',
    meaning: 'To work jointly on an activity or project with others.',
    teluguMeaning: 'కలిసి పనిచేయడం (Kalisi panicheyadam)',
    exampleSentence: 'I collaborated with three classmates to build the college attendance tracker.',
    context: 'Professional',
    synonyms: ['Cooperate', 'Team up', 'Partner'],
    collocations: ['collaborate with peers', 'collaborate closely']
  },
  {
    id: 'voc-8',
    word: 'Consequently',
    partOfSpeech: 'adverb',
    syllables: 'con-se-quent-ly',
    stress: 'CON·se·quent·ly',
    meaning: 'As a result; therefore.',
    teluguMeaning: 'తత్ఫలితంగా / అందువలన (Anduvalana)',
    exampleSentence: 'The server ran out of memory; consequently, the application restarted automatically.',
    context: 'Presentation',
    synonyms: ['Therefore', 'As a result', 'Hence', 'Thus'],
    collocations: ['consequently led to', 'and consequently']
  }
];

export const PRONUNCIATION_LIST: PronunciationItem[] = [
  {
    id: 'prn-1',
    word: 'Entrepreneur',
    syllables: 'en-tre-pre-neur',
    stressGuide: 'on-truh-pruh-NUR',
    phoneticSpelling: '/ˌɒn.trə.prəˈnɜːr/',
    definition: 'A person who sets up a business, taking on financial risks in hope of profit.',
    example: 'Many B.Tech graduates aspire to become successful entrepreneurs in tech.',
    commonTeluguSpeakerMistake: 'Pronouncing as "Enter-pre-newer" or adding extra hard "r" sounds.',
    tip: 'Place the primary stress firmly on the last syllable: on-truh-pruh-NUR.'
  },
  {
    id: 'prn-2',
    word: 'Hierarchy',
    syllables: 'hi-er-ar-chy',
    stressGuide: 'HY-er-ar-kee',
    phoneticSpelling: '/ˈhaɪ.ər.ɑː.ki/',
    definition: 'A system in which members of an organization or data are ranked according to status or levels.',
    example: 'In Object-Oriented Programming, classes often follow an inheritance hierarchy.',
    commonTeluguSpeakerMistake: 'Pronouncing "ch" like "chair" (hire-ar-chee). It has a hard "k" sound!',
    tip: 'The "ch" sounds like "k": HY-er-ar-kee.'
  },
  {
    id: 'prn-3',
    word: 'Colleague',
    syllables: 'col-league',
    stressGuide: 'KOL-eeg',
    phoneticSpelling: '/ˈkɒl.iːɡ/',
    definition: 'A person with whom one works in a profession or business.',
    example: 'I asked my senior colleague for advice on preparing for campus placements.',
    commonTeluguSpeakerMistake: 'Pronouncing the end like "coll-lee-goo" or "col-lee-jee".',
    tip: 'Silent "ue"! End crisp on the "g" sound: KOL-eeg.'
  },
  {
    id: 'prn-4',
    word: 'Architecture',
    syllables: 'ar-chi-tec-ture',
    stressGuide: 'AHR-kuh-tek-cher',
    phoneticSpelling: '/ˈɑː.kɪ.tek.tʃər/',
    definition: 'The complex or carefully designed structure of something (e.g. computer architecture).',
    example: 'Von Neumann architecture is a foundational topic in Computer Science.',
    commonTeluguSpeakerMistake: 'Pronouncing "chi" as "chee" instead of "kuh".',
    tip: '"ch" is pronounced "k": AHR-kuh-tek-cher.'
  },
  {
    id: 'prn-5',
    word: 'Development',
    syllables: 'de-vel-op-ment',
    stressGuide: 'dih-VEL-up-munt',
    phoneticSpelling: '/dɪˈvel.əp.mənt/',
    definition: 'The process of developing or being developed (e.g., software development).',
    example: 'Web development requires both frontend design and backend database integration.',
    commonTeluguSpeakerMistake: 'Stressing the first syllable (DAY-vel-op-ment) instead of second.',
    tip: 'Stress the second syllable: dih-VEL-up-munt.'
  },
  {
    id: 'prn-6',
    word: 'Algorithm',
    syllables: 'al-go-rithm',
    stressGuide: 'AL-guh-ri-thum',
    phoneticSpelling: '/ˈæl.ɡə.rɪ.ðəm/',
    definition: 'A step-by-step process or set of rules to be followed in calculations or problem-solving.',
    example: 'Quicksort is an efficient divide-and-conquer sorting algorithm.',
    commonTeluguSpeakerMistake: 'Pronouncing "rithm" with a harsh rolling Telugu "r" or flat vowels.',
    tip: 'Short soft vowels: AL-guh-ri-thum.'
  },
  {
    id: 'prn-7',
    word: 'Paradigm',
    syllables: 'par-a-digm',
    stressGuide: 'PAIR-uh-dime',
    phoneticSpelling: '/ˈpær.ə.daɪm/',
    definition: 'A typical example or pattern of something; a model or programming philosophy.',
    example: 'Object-oriented programming is a major software engineering paradigm.',
    commonTeluguSpeakerMistake: 'Pronouncing the letter "g" (para-dig-um).',
    tip: 'The "g" is completely silent! PAIR-uh-dime.'
  },
  {
    id: 'prn-8',
    word: 'Subtle',
    syllables: 'sub-tle',
    stressGuide: 'SUT-ul',
    phoneticSpelling: '/ˈsʌt.əl/',
    definition: 'So delicate or precise as to be difficult to analyze or describe.',
    example: 'There is a subtle difference between "pass by value" and "pass by reference".',
    commonTeluguSpeakerMistake: 'Pronouncing the "b" (sub-till). The "b" is silent.',
    tip: 'Silent "b"! Say SUT-ul.'
  }
];

export const WRITING_TASKS = [
  {
    id: 'wrt-1',
    category: 'Sentence' as const,
    title: 'Daily College Routine Sentence',
    prompt: 'Write a single complete sentence explaining what you did in your college lab or classroom today. Focus on using past tense correctly.',
    sampleAttempt: 'Today I am went to physics lab and we dided one experiment on laser.',
    hint: 'Watch out for double past tense (am went, dided) and articles.'
  },
  {
    id: 'wrt-2',
    category: 'Paragraph' as const,
    title: 'Why I Chose My B.Tech Branch',
    prompt: 'Write a short 4-5 sentence paragraph explaining why you chose your branch (CSE/ECE/etc.) and what you hope to learn during your 4 years.',
    sampleAttempt: 'I choose CSE branch because from childhood I having passion in computer games. In four years I want to become full stack developer. My parents also supported me for this branch.',
    hint: 'Use present perfect (I have had a passion) and future tenses (I aim to become).'
  },
  {
    id: 'wrt-3',
    category: 'Email' as const,
    title: 'Requesting Leave / Permissions from College Professor',
    prompt: 'Write a formal email to your Head of Department (HOD) or subject faculty requesting 2 days of leave due to illness or family event.',
    sampleAttempt: 'Respected Sir, I am Karthik 1st year CSE. I am not coming to college tomorrow because suffering from fever. Please give leave permission. Thanking you sir.',
    hint: 'Include subject line, formal salutation, specific dates, assurance to cover missed lectures, and formal sign-off.'
  },
  {
    id: 'wrt-4',
    category: 'Presentation' as const,
    title: 'Opening Script for a Technical Seminar',
    prompt: 'Write a 1-minute opening speech introducing yourself and introducing your seminar topic (e.g., "Artificial Intelligence in Healthcare" or "Cloud Storage").',
    sampleAttempt: 'Good morning respected faculty and friends. Today myself Karthik going to talk about Cloud Computing. Let us see slides.',
    hint: 'Use professional greeting, hook the audience, state your agenda clearly, and avoid "myself [Name]".'
  },
  {
    id: 'wrt-5',
    category: 'Technical' as const,
    title: 'Explain "What is an Operating System" to a Beginner',
    prompt: 'Explain the core concept of an Operating System in simple, natural English without using excessive jargon.',
    sampleAttempt: 'Operating system is a software. It controls computer parts and user can run application. Without OS we cannot operate system.',
    hint: 'Use clear definitions, analogies (like a bridge or manager), and active voice.'
  },
  {
    id: 'wrt-6',
    category: 'Exam' as const,
    title: 'B.Tech Exam Answer: Difference Between Compiler and Interpreter',
    prompt: 'Write a structured, point-by-point exam answer comparing Compilers and Interpreters with clear technical terminology.',
    sampleAttempt: 'Compiler translates all program at one time. Interpreter translates line by line. Compiler gives error list. Interpreter stops at first error.',
    hint: 'Structure with points, mention execution speed, memory requirements, and examples (C vs Python).'
  }
];

export const MOCK_INTERVIEW_QUESTIONS = {
  self_intro: [
    "Good morning! Please introduce yourself and tell me a bit about your background.",
    "Thank you. Why did you decide to pursue B.Tech in your specific branch?",
    "What subjects or technical topics have you enjoyed learning most so far in your first year?",
    "Where do you see yourself in the next 3 to 4 years as you complete your degree?"
  ],
  internship: [
    "Welcome to this interview. Tell me about your academic journey and what motivated you to apply for an internship early in your college career.",
    "Can you describe a technical project, coding assignment, or lab experiment you recently worked on?",
    "What was the most challenging obstacle or bug you faced during that project, and how did you resolve it?",
    "How do you usually collaborate when working with classmates on team assignments?"
  ],
  hr: [
    "Tell me about yourself, highlighting your key strengths and what drives you.",
    "Can you share an instance where you had to manage tight deadlines or balance college studies with other commitments?",
    "How do you handle constructive criticism or feedback from your teachers or peers?",
    "Why should a company hire you over other candidates from your batch?"
  ],
  technical: [
    "To start off, could you explain the difference between a high-level programming language and machine language?",
    "Explain what a data structure is and why selecting the right data structure matters in software development.",
    "How would you explain the concept of Object-Oriented Programming (OOP) to someone new to coding?",
    "What happens under the hood when a C or Python program executes on your computer?"
  ],
  campus_placement: [
    "Tell me about yourself and summarize your academic achievements from Class 10 to B.Tech.",
    "What technical skills and programming languages are you currently most confident with?",
    "If you are assigned to a project using a tech stack you have never used before, how would you approach learning it?",
    "Do you have any questions for me regarding our team or company culture?"
  ]
};
