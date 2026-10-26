import React, { useState, useRef, useEffect } from 'react';
import { saveCertificateRecord } from '../utils/analyticsStore';

type ToolTab = 'typing' | 'age' | 'namedate' | 'resize';
type DifficultyLevel = 1 | 2 | 3 | 4;

interface ToolsPageProps {
  onBackToHome: () => void;
}

export const ToolsPage: React.FC<ToolsPageProps> = ({ onBackToHome }) => {
  // Default to Typing Test
  const [activeTab, setActiveTab] = useState<ToolTab>('typing');

  // ==========================================
  // TOOL 1: PROGRESSIVE LEVEL HINDI & ENGLISH TYPING TEST
  // ==========================================
  const [typingLang, setTypingLang] = useState<'english' | 'hindi'>('english');
  const [currentLevel, setCurrentLevel] = useState<DifficultyLevel>(1);
  const [testDurationMinutes, setTestDurationMinutes] = useState<number>(2);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(120);
  const [isTestRunning, setIsTestRunning] = useState<boolean>(false);
  const [isTestFinished, setIsTestFinished] = useState<boolean>(false);

  const [passageIndex, setPassageIndex] = useState<number>(0);

  // Progressive Level Passages for English (Multiple paragraphs per level for unlimited practice)
  const englishPassagesByLevel: Record<DifficultyLevel, string[]> = {
    1: [
      'the quick brown fox jumps over the lazy dog all good boys and girls go to school daily hard work is the real secret of true success in life you must practice typing every morning to get high speed and best accuracy in government exams',
      'time is money and once lost it never comes back always be honest kind and punctual in your daily work regular computer practice makes your fingers agile and confident which helps in qualifying typing exams easily',
      'early to bed and early to rise makes a person healthy wealthy and wise water is life and we should not waste a single drop save trees and protect our beautiful green nature for a better and clean tomorrow',
      'education is the most powerful weapon which you can use to change the world always respect your parents and teachers because their blessings give you inner strength to achieve great heights in every field',
      'knowledge is power and continuous learning brings wisdom keep practicing typing with both hands placed correctly on home row keys as df and jk l to build accurate muscle memory for lifetime speed',
      'simple living and high thinking leads to a peaceful and purposeful life never lose hope during tough times because every dark night is followed by a bright and sunny morning keep typing and stay inspired'
    ],
    2: [
      'Ekta Communication is situated near Sub-Registrar Office in Ekma Saran district. Thousands of citizens visit every month for land registry, revenue receipts, marriage certificates, and certified copies. Typing with speed and precision is required for Beltron and Court exams.',
      'Computer proficiency and bilingual typing have become indispensable qualifications for modern administrative posts. Candidates aspiring for Data Entry Operator and Executive Assistant roles in Bihar government must practice daily with timed paragraphs.',
      'Land records digitization in Bihar under the Bhumi portal allows raiyats to view Jamabandi Register Two, apply for online mutation, and download certified rent receipts conveniently from local common service centers without unnecessary delays.',
      'The Bihar State Electronic Development Corporation regularly conducts computerized typing skill assessments in English and Hindi font styles. Securing high speed with zero typographic blunders guarantees a meritorious rank in final selection lists.',
      'E-governance initiatives have revolutionized public service delivery across Saran district. Citizens can now submit applications for Aadhaar PVC printing, PAN card verification, and property valuation directly through authorized document facilitation counters.',
      'Effective office communication requires professional typing etiquette, proper capitalization, correct numerical formatting, and rapid punctuation keystrokes. Maintaining an upright posture and relaxed wrists prevents fatigue during long test sessions.'
    ],
    3: [
      'Under Section 17 of the Indian Registration Act 1908, immovable property deeds exceeding Rs. 100/- require mandatory registration along with PAN card, Aadhaar biometric verification, recent land revenue receipts, and two verified local witnesses.',
      'In civil appeals before the Hon\'ble High Court of Judicature at Patna, documentary evidence including non-encumbrance certificates, registered sale deeds, certified khatiyan extracts, and mutation orders must be formatted precisely with statutory court fees.',
      'Article 226 of the Constitution of India empowers High Courts to issue prerogative writs including habeas corpus, mandamus, prohibition, and certiorari for enforcement of fundamental rights and for any other justifiable administrative purpose.',
      'The Indian Evidence Act 1872 stipulates that secondary evidence relating to registered instruments may only be tendered when the primary document is destroyed, lost, or in the possession of an adverse party who refuses production upon legal notice.',
      'Comprehensive revenue survey records, cadastre maps, and revisional settlement entries maintained by the Revenue and Land Reforms Department form the definitive bedrock for determining proprietary ownership and demarcation of agricultural land.',
      'The Registration and Stamp Department regulates the execution of gift deeds, general power of attorney, partition agreements, and mortgage certificates with mandatory electronic stamp duty and web-based challan reconciliation.'
    ],
    4: [
      'The Patna High Court Stenographer & Bihar Staff Selection Commission examinations benchmark candidates at 40+ WPM net speed with 95% accuracy; rigorous proficiency in legal nomenclature, fiscal accounting clauses, and verbatim alphanumeric transcriptions is compulsory.',
      'Substantive procedural jurisprudence necessitates stringent compliance with Order VII Rule 11 of the Code of Civil Procedure, whereby plaints deficient in disclosing cause of action or undervalued regarding pecuniary jurisdiction are summarily rejected.',
      'The Indian Stamp Act 1899 dictates that instruments chargeable with duty must be duly stamped prior to or at the time of execution; unstamped documents remain inadmissible in evidentiary proceedings until verified penalties are liquidated.',
      'Judicial stenographers transcribe verbatim dictations encompassing statutory enactments, equitable remedies, cross-examination interrogatories, and interlocutory judicial pronouncements with unwavering fidelity and flawless typographic rhythm.',
      'Technological digitization of district collectorates, treasury sub-divisions, and land registration offices requires high-speed typists capable of error-free processing of bilingual cadastral records, Jamabandi ledgers, and revenue requisitions.',
      'Mastery over the universal QWERTY layout requires rhythmic actuation, sub-conscious kinesthetic feedback, synchronized thumbs on spacebar, and flawless finger traversal across all three alphanumeric tiers without visually glancing down.'
    ]
  };

  // Progressive Level Passages for Hindi (Multiple paragraphs per level for unlimited practice)
  const hindiPassagesByLevel: Record<DifficultyLevel, string[]> = {
    1: [
      'राम एक अच्छा और परिश्रमी बालक है। वह प्रतिदिन समय पर विद्यालय जाता है और गुरुजनों का आदर करता है। भारत एक विशाल और सुंदर देश है। हम सभी को अपने देश से बहुत प्रेम है। नियमित अभ्यास से सफलता अवश्य मिलती है।',
      'समय बहुत अनमोल धन है और एक बार बीत जाने पर कभी वापस नहीं आता। हमें सदा सत्य बोलना चाहिए और दूसरों की सहायता करनी चाहिए। नियमित रूप से टाइपिंग का अभ्यास करने से उंगलियाँ तेज और कुशल बन जाती हैं।',
      'पेड़-पौधे हमारे सच्चे मित्र हैं जो हमें शुद्ध हवा, फल और छाया देते हैं। हमें जल की हर बूंद बचानी चाहिए और प्रकृति की रक्षा करनी चाहिए। सच्ची लगन और कड़ी मेहनत से जीवन में हर मुकाम हासिल किया जा सकता है।',
      'शिक्षा मनुष्य का सबसे बड़ा गहना है। अच्छे विचार और नेक काम मनुष्य को समाज में सम्मान दिलाते हैं। टाइपिंग करते समय शांत मन और सही मुद्रा रखने से गति में निरंतर सुधार होता है।',
      'सदा बड़ों का आदर करें और छोटों से प्यार करें। परिश्रम ही सफलता की कुंजी है। यदि आप प्रतिदिन आधा घंटा टाइपिंग करेंगे तो कुछ ही दिनों में आपकी गति आश्चर्यजनक रूप से बढ़ जाएगी।',
      'ईमानदारी सबसे अच्छी नीति है। स्वस्थ शरीर में ही स्वस्थ मस्तिष्क का वास होता है। सुबह जल्दी उठना और व्यायाम करना स्वास्थ्य के लिए बहुत लाभकारी है। सकारात्मक सोच के साथ आगे बढ़ते रहें।'
    ],
    2: [
      'एकता कम्युनिकेशन अवर निबंधन कार्यालय एकमा के निकट स्थित एक प्रमुख दस्तावेज सेवा केंद्र है। यहाँ जमीन की ऑनलाइन रजिस्ट्री, खतियान, जमाबंदी रजिस्टर-२ और लगान रसीद का कार्य पूरी सटीकता से किया जाता है। सारण जिले के लोग इस पर भरोसा करते हैं।',
      'बिहार बेल्ट्रॉन एवं डाटा एंट्री ऑपरेटर परीक्षा में हिंदी टाइपिंग का विशेष महत्व है। अभ्यर्थियों को रेमिंगटन गेल और मंगल फॉन्ट में अभ्यास करना चाहिए ताकि सरकारी सेवा चयन प्रक्रिया में उच्च अंक प्राप्त किए जा सकें।',
      'डिजिटल बिहार पोर्टल के माध्यम से अब नागरिक घर बैठे भू-अभिलेख, दाखिल-खारिज और ऑनलाइन लगान रसीद प्राप्त कर सकते हैं। एकता कम्युनिकेशन द्वारा आम जनता को इन सेवाओं का त्वरित और सुरक्षित लाभ पहुँचाया जाता है।',
      'कार्यालयी कामकाज में गति के साथ शुद्धता का होना अत्यंत आवश्यक है। गलत शब्दों के प्रयोग से सरकारी पत्रों का अर्थ बदल सकता है, इसलिए टाइपिंग करते समय एकाग्रता और सटीकता बनाए रखना अनिवार्य है।',
      'सारण जिले के एकमा प्रखंड में स्थित एकता कम्युनिकेशन पर पैन कार्ड, आधार कार्ड प्रिंटिंग, शादी का ऑनलाइन पंजीकरण एवं जमीन रजिस्ट्री संबंधी सभी ऑनलाइन कार्य वर्षों से विश्वसनीयता के साथ किए जा रहे हैं।',
      'प्रतियोगी परीक्षाओं की तैयारी करने वाले युवाओं को नियमित रूप से समयबद्ध पैराग्राफ टाइप करना चाहिए। इससे परीक्षा कक्ष के दबाव से निपटने का आत्मविश्वास और कौशल स्वतः विकसित हो जाता है।'
    ],
    3: [
      'भारतीय निबंधन अधिनियम १९०८ की धारा १७ के अंतर्गत १०० रुपये से अधिक मूल्य की अचल संपत्ति का क्रय-विक्रय हेतु निबंधन अनिवार्य है। क्रेता और विक्रेता को मूल पहचान पत्र, दाखिल-खारिज प्रति एवं दो स्थानीय साक्षियों को प्रस्तुत करना होता है।',
      'पटना उच्च न्यायालय एवं व्यवहार न्यायालय लिपिक परीक्षा में विधिक गद्यांश पूछे जाते हैं। वादी, प्रतिवादी, विक्रय विलेख, शपथ पत्र एवं वसीयतनामा से संबंधित जटिल पारिभाषिक शब्दों पर विशेष नियंत्रण आवश्यक है।',
      'संविधान के अनुच्छेद २२६ के अधीन उच्च न्यायालय को मौलिक अधिकारों के संरक्षण एवं अन्य विधिक उपचार हेतु परमादेश, बंदी प्रत्यक्षीकरण और उत्प्रेषण रिट जारी करने का असाधारण क्षेत्राधिकार प्राप्त है।',
      'भू-राजस्व एवं भूमि सुधार विभाग द्वारा संधारित खतियान, कैडस्ट्रल सर्वे एवं चकबंदी अभिलेख न्यायालयों में मालिकाना हक और सीमांकन विवादों के निस्तारण में सर्वोपरि साक्ष्य माने जाते हैं।',
      'ई-स्टांपिंग प्रणाली के लागू होने से निबंधन शुल्क एवं स्टांप ड्यूटी का भुगतान पूरी तरह पारदर्शी हो गया है। कोषालय चालान की ऑनलाइन प्रविष्टि और सत्यापन से फर्जीवाड़े पर पूर्ण विराम लगा है।',
      'भारतीय साक्ष्य अधिनियम के प्रावधानों के अनुसार पंजीकृत विलेखों की प्रमाणित प्रतिलिपि द्वितीयक साक्ष्य के रूप में न्यायालय में ग्राह्य होती है, बशर्ते मूल अभिलेख नष्ट या अप्राप्य प्रमाणित हो।'
    ],
    4: [
      'बिहार राज्य कर्मचारी चयन आयोग एवं उच्च न्यायालय व्यवहार लिपिक परीक्षा में अभ्यर्थियों की गति एवं सूक्ष्म परिशुद्धता का मूल्यांकन किया जाता है। विधिक शब्दावली, संविधान के अनुच्छेदों एवं तकनीकी प्रारूपण में न्यूनतम ३५ शब्द प्रति मिनट की गति अनिवार्य है।',
      'सिविल प्रक्रिया संहिता के आदेश ७ नियम ११ के तहत जब वाद पत्र में वाद हेतुक का प्रकटीकरण न हो या मूल्यांकन त्रुटिपूर्ण हो, तो न्यायालय द्वारा वाद को प्रारंभिक स्तर पर ही निरस्त करने का वैधानिक प्रावधान है।',
      'दस्तावेज लेखक और लिपिकों के लिए यह अपरिहार्य है कि वे बिना कीबोर्ड की ओर देखे केवल स्क्रीन पर ध्यान केंद्रित कर न्यूनतम त्रुटि दर के साथ त्वरित गति से टंकण कार्य निष्पादित करने में प्रवीण हों।',
      'अभिलेखों के डिजिटलीकरण एवं आधुनिक ई-कोर्ट परियोजना के अंतर्गत सभी न्यायिक निर्णयों और आदेश पत्रों का त्वरित टंकण आवश्यक है, जिससे वादियों को समय पर न्याय और प्रमाणित नकल सुलभ हो सके।',
      'टाइपिंग की उच्चतम दक्षता निरंतर लगन, संतुलित उंगली संचालन, स्पेसबार का सटीक प्रयोग और हिंदी देवनागरी वर्णमाला के संयुक्ताक्षरों के निर्बाध टंकण पर निर्भर करती है।',
      'एकता कम्युनिकेशन एकमा के इस उन्नत टूल पोर्टल के माध्यम से सारण और संपूर्ण बिहार के अभ्यर्थी अपनी टंकण क्षमता को निखार कर सरकारी सेवा की परीक्षाओं में सफलता का नया कीर्तिमान स्थापित कर रहे हैं।'
    ]
  };

  const levelLabels: Record<DifficultyLevel, { nameEn: string; nameHi: string; desc: string; badge: string }> = {
    1: { nameEn: 'Level 1: Beginner', nameHi: 'लेवल १: शुरुआती (Easy)', desc: 'सरल शब्द व वाक्य (Basic Words)', badge: '🟢 Easy' },
    2: { nameEn: 'Level 2: Intermediate', nameHi: 'लेवल २: मध्यम (Medium)', desc: 'कार्यालयी सामान्य गद्यांश (SSC / Beltron)', badge: '🟡 Medium' },
    3: { nameEn: 'Level 3: Advanced', nameHi: 'लेवल ३: कठिन (Hard)', desc: 'कानूनी व तकनीकी शब्द (Court / DEO Exam)', badge: '🔴 Hard' },
    4: { nameEn: 'Level 4: Master', nameHi: 'लेवल ४: प्रो मास्टर (Pro)', desc: 'उच्च स्तरीय आधिकारिक गद्यांश (40+ WPM)', badge: '🏆 Master' }
  };

  const availablePassages = typingLang === 'english'
    ? englishPassagesByLevel[currentLevel]
    : hindiPassagesByLevel[currentLevel];

  const safePassageIndex = passageIndex % availablePassages.length;
  const activePassage = availablePassages[safePassageIndex];

  const targetWords = activePassage.trim().split(/\s+/).filter(Boolean);

  const [currentTypedWord, setCurrentTypedWord] = useState<string>('');
  const [currentWordIdx, setCurrentWordIdx] = useState<number>(0);
  const [wordResults, setWordResults] = useState<('correct' | 'wrong')[]>([]);
  const [keystrokesCount, setKeystrokesCount] = useState<number>(0);

  // Certificate Specific States
  const [typingCandidateName, setTypingCandidateName] = useState<string>('');
  const [typingCandidatePhone, setTypingCandidatePhone] = useState<string>('');
  const [certSerial, setCertSerial] = useState<string>(() => `EKTA-TYP-${Math.floor(100000 + Math.random() * 900000)}`);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const typingInputRef = useRef<HTMLInputElement | null>(null);
  const activeWordRef = useRef<HTMLSpanElement | null>(null);

  // Auto-scroll active word into view smoothly
  useEffect(() => {
    if (activeWordRef.current) {
      activeWordRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentWordIdx]);

  const startTest = () => {
    setIsTestRunning(true);
    setIsTestFinished(false);
    setTimeLeftSeconds(testDurationMinutes * 60);
    setCurrentTypedWord('');
    setCurrentWordIdx(0);
    setWordResults([]);
    setKeystrokesCount(0);
    setTimeout(() => typingInputRef.current?.focus(), 100);
  };

  const endTest = () => {
    setIsTestRunning(false);
    setIsTestFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Change Paragraph Handler for Unlimited Practice
  const handleChangeParagraph = () => {
    setPassageIndex((prev) => (prev + 1) % availablePassages.length);
    setIsTestRunning(false);
    setIsTestFinished(false);
    setTimeLeftSeconds(testDurationMinutes * 60);
    setCurrentTypedWord('');
    setCurrentWordIdx(0);
    setWordResults([]);
    setKeystrokesCount(0);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => typingInputRef.current?.focus(), 100);
  };

  useEffect(() => {
    if (isTestRunning && timeLeftSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            endTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTestRunning, timeLeftSeconds]);

  const handleTypingKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isTestRunning) {
      startTest();
    }
    const val = e.target.value;

    if (val.endsWith(' ')) {
      const typedClean = val.trim();
      const targetWord = targetWords[currentWordIdx];
      const isCorrect = typedClean === targetWord;

      setWordResults((prev) => [...prev, isCorrect ? 'correct' : 'wrong']);
      setKeystrokesCount((prev) => prev + typedClean.length + 1);
      setCurrentTypedWord('');

      if (currentWordIdx + 1 < targetWords.length) {
        setCurrentWordIdx((prev) => prev + 1);
      } else {
        // Reached end of level paragraph
        endTest();
      }
    } else {
      setCurrentTypedWord(val);
    }
  };

  const handleNextLevel = () => {
    if (currentLevel < 4) {
      const nextLvl = (currentLevel + 1) as DifficultyLevel;
      setCurrentLevel(nextLvl);
      setPassageIndex(0);
      setIsTestFinished(false);
      setIsTestRunning(false);
      setTimeLeftSeconds(testDurationMinutes * 60);
      setCurrentTypedWord('');
      setCurrentWordIdx(0);
      setWordResults([]);
    }
  };

  // Calculations
  const correctCount = wordResults.filter((r) => r === 'correct').length;
  const wrongCount = wordResults.filter((r) => r === 'wrong').length;
  const elapsedMinutes = (testDurationMinutes * 60 - timeLeftSeconds) / 60 || 0.01;
  const netWpm = Math.round(correctCount / elapsedMinutes);
  const totalWordsAttempted = correctCount + wrongCount;
  const accuracyPct = totalWordsAttempted > 0 ? Math.round((correctCount / totalWordsAttempted) * 100) : 100;
  const isQualified = netWpm >= (typingLang === 'english' ? 25 : 20) && accuracyPct >= 80;

  // Appreciation & Evaluation helper
  const getAppreciationDetails = (wpm: number, acc: number) => {
    if (wpm >= 40 && acc >= 95) {
      return {
        badge: 'GRADE A+ • DISTINCTION',
        stars: '★★★★★',
        remarkEn: 'Outstanding Speed & Flawless Precision! Demonstrates superior command over computer keyboarding, fully meeting Patna High Court, Secretariat & Beltron typing benchmarks.',
        remarkHi: 'उत्कृष्ट प्रदर्शन! आपकी टाइपिंग गति और सटीकता सर्वोच्च सरकारी एवं उच्च न्यायालय मानकों पर खरी उतरती है।',
        title: 'Outstanding Typing Mastery'
      };
    } else if (wpm >= 30 && acc >= 90) {
      return {
        badge: 'GRADE A • EXCELLENT',
        stars: '★★★★★',
        remarkEn: 'Excellent Typing Performance! High accuracy and consistent rhythm, thoroughly eligible for Bihar Beltron, DEO and competitive exam credentials.',
        remarkHi: 'अति उत्तम प्रदर्शन! आपकी गति और शुद्धता प्रतियोगी परीक्षाओं एवं कार्यालयी मानकों के अनुकूल है।',
        title: 'Excellent Proficiency'
      };
    } else if (wpm >= 20 && acc >= 80) {
      return {
        badge: 'GRADE B • QUALIFIED',
        stars: '★★★★☆',
        remarkEn: 'Good Progress & Steady Keyboarding. Possesses a solid typing base; regular structured practice will elevate speed to professional benchmarks.',
        remarkHi: 'सराहनीय प्रयास! टाइपिंग की बुनियादी समझ अच्छी है। निरंतर अभ्यास से और भी उच्च स्तर प्राप्त किया जा सकता है।',
        title: 'Qualified & Competent'
      };
    } else {
      return {
        badge: 'PARTICIPATION • PRACTICING',
        stars: '★★★☆☆',
        remarkEn: 'Active Participation in Computer Typing Assessment. Dedicated daily practice is recommended to enhance words per minute and error elimination.',
        remarkHi: 'सक्रिय सहभागिता! गति व शुद्धता बढ़ाने के लिए दैनिक अभ्यास जारी रखें।',
        title: 'Certificate of Assessment'
      };
    }
  };

  // HD Canvas Certificate Generator & Downloader
  const downloadCertificateAsImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1130;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nameToPrint = typingCandidateName.trim() || 'Candidate Name';
    const appreciation = getAppreciationDetails(netWpm, accuracyPct);
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // 1. Background Parchment
    ctx.fillStyle = '#fffdfa';
    ctx.fillRect(0, 0, 1600, 1130);

    const bgGrad = ctx.createRadialGradient(800, 565, 200, 800, 565, 950);
    bgGrad.addColorStop(0, '#ffffff');
    bgGrad.addColorStop(1, '#fef9ed');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1600, 1130);

    // 2. Borders
    // Outer Deep Navy Border
    ctx.lineWidth = 18;
    ctx.strokeStyle = '#0a2463';
    ctx.strokeRect(28, 28, 1544, 1074);

    // Gold Accent Border
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#d97706';
    ctx.strokeRect(44, 44, 1512, 1042);

    // Inner Thin Line
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#1e3a8a';
    ctx.strokeRect(52, 52, 1496, 1026);

    // Corner Ornaments
    const drawCorner = (x: number, y: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(26, 0);
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 26);
      ctx.stroke();
      ctx.restore();
    };
    drawCorner(54, 54, 0);
    drawCorner(1546, 54, Math.PI / 2);
    drawCorner(1546, 1076, Math.PI);
    drawCorner(54, 1076, (Math.PI * 3) / 2);

    // 3. Header: Brand Logo & Title (Bigger Printer Logo)
    const logoX = 120;
    const logoY = 66;
    // Blue printer body (Enlarged from 42x28 to 68x44)
    ctx.fillStyle = '#3a7bd5';
    ctx.beginPath();
    ctx.roundRect(logoX + 8, logoY + 26, 68, 44, 7);
    ctx.fill();
    // Blue top feed slot
    ctx.fillStyle = '#1b4fa8';
    ctx.beginPath();
    ctx.roundRect(logoX + 22, logoY + 12, 40, 20, 4);
    ctx.fill();
    // Top coming-out paper
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#1b4fa8';
    ctx.lineWidth = 1.8;
    ctx.fillRect(logoX + 28, logoY + 4, 28, 16);
    ctx.strokeRect(logoX + 28, logoY + 4, 28, 16);
    // Bottom output printed paper
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#1b4fa8';
    ctx.lineWidth = 1.8;
    ctx.fillRect(logoX + 25, logoY + 58, 34, 22);
    ctx.strokeRect(logoX + 25, logoY + 58, 34, 22);
    // Lines on bottom paper
    ctx.strokeStyle = '#1b4fa8';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(logoX + 31, logoY + 66);
    ctx.lineTo(logoX + 53, logoY + 66);
    ctx.moveTo(logoX + 31, logoY + 72);
    ctx.lineTo(logoX + 49, logoY + 72);
    ctx.stroke();
    // Printer indicator dot
    ctx.fillStyle = '#1b4fa8';
    ctx.beginPath();
    ctx.arc(logoX + 64, logoY + 40, 4, 0, Math.PI * 2);
    ctx.fill();
    // Orange speech bubble
    ctx.fillStyle = '#f76c1b';
    ctx.beginPath();
    ctx.roundRect(logoX + 54, logoY + 2, 30, 22, 5);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(logoX + 62, logoY + 24);
    ctx.lineTo(logoX + 58, logoY + 30);
    ctx.lineTo(logoX + 70, logoY + 24);
    ctx.fill();
    // Bubble dots
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(logoX + 63, logoY + 13, 2.5, 0, Math.PI * 2);
    ctx.arc(logoX + 69, logoY + 13, 2.5, 0, Math.PI * 2);
    ctx.arc(logoX + 75, logoY + 13, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Center Organization Text
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0a2463';
    ctx.font = 'bold 36px "Baloo 2", Georgia, sans-serif';
    ctx.fillText('EKTA COMMUNICATION', 800, 104);

    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('ONLINE REGISTRY • LAND RECORDS • TYPING & COMPUTER ASSESSMENT LAB', 800, 132);

    ctx.fillStyle = '#475569';
    ctx.font = '13px sans-serif';
    ctx.fillText('Near Sub-Registrar Office, Ekma, Saran, Bihar - 841208 | Mob: +91 94724 60132', 800, 154);

    // Separator line
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(250, 170);
    ctx.lineTo(1350, 170);
    ctx.stroke();

    // 4. Certificate Main Title
    ctx.fillStyle = '#d97706';
    ctx.font = 'bold 17px sans-serif';
    ctx.fillText('★ OFFICIAL SKILL ASSESSMENT CERTIFICATE ★', 800, 204);

    ctx.fillStyle = '#0a2463';
    ctx.font = 'bold 44px "Baloo 2", Georgia, serif';
    ctx.fillText('CERTIFICATE OF TYPING PROFICIENCY', 800, 254);

    ctx.fillStyle = '#334155';
    ctx.font = 'bold 20px "Mukta", sans-serif';
    ctx.fillText('कंप्यूटर टाइपिंग प्रवीणता एवं दक्षता प्रमाण पत्र', 800, 286);

    // 5. Candidate Name Section
    ctx.fillStyle = '#64748b';
    ctx.font = 'italic 18px Georgia, serif';
    ctx.fillText('This is to proudly certify that', 800, 326);

    ctx.fillStyle = '#0a2463';
    ctx.font = 'bold 44px "Baloo 2", Georgia, serif';
    ctx.fillText(nameToPrint.toUpperCase(), 800, 376);

    // Decorative underline for Candidate Name
    const nameMeasure = ctx.measureText(nameToPrint.toUpperCase()).width;
    const nameWidth = Math.min(Math.max(nameMeasure + 60, 360), 1050);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(800 - nameWidth / 2, 388);
    ctx.lineTo(800 + nameWidth / 2, 388);
    ctx.stroke();

    // Candidate Mobile Number (if provided)
    if (typingCandidatePhone.trim()) {
      ctx.fillStyle = '#15803d';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`📱 Verified Mobile / WhatsApp: +91 ${typingCandidatePhone.trim()}`, 800, 412);
    }

    // Secondary text
    ctx.fillStyle = '#475569';
    ctx.font = '16px sans-serif';
    const langLabel = typingLang === 'english' ? 'English' : 'हिंदी (Hindi)';
    const textY = typingCandidatePhone.trim() ? 438 : 426;
    ctx.fillText(`has successfully undertaken and qualified the Official ${langLabel} Typing Assessment (Level ${currentLevel} - ${levelLabels[currentLevel].nameEn})`, 800, textY);
    ctx.fillText('conducted under timed examination conditions with the following certified performance metrics:', 800, textY + 24);

    // 6. The 4 Key Verified Metrics
    const boxWidth = 270;
    const boxHeight = 115;
    const startX = 800 - (boxWidth * 4 + 24 * 3) / 2;
    const boxY = 485;

    const metricsData = [
      { val: `${netWpm}`, label: 'Speed (WPM)', sub: 'शुद्ध गति (प्रति मिनट)', color: '#0a2463' },
      { val: `${accuracyPct}%`, label: 'Accuracy (सटीकता)', sub: 'सटीकता प्रतिशत', color: accuracyPct >= 90 ? '#16a34a' : '#d97706' },
      { val: `${correctCount}`, label: 'Correct Words', sub: 'सही शब्द', color: '#16a34a' },
      { val: `${wrongCount}`, label: 'Errors (गलतियाँ)', sub: 'गलत शब्द', color: wrongCount === 0 ? '#16a34a' : '#dc2626' }
    ];

    metricsData.forEach((m, i) => {
      const bx = startX + i * (boxWidth + 24);
      // Box background
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(bx, boxY, boxWidth, boxHeight, 12);
      ctx.fill();
      ctx.strokeStyle = '#dbeafe';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Top colored accent bar
      ctx.fillStyle = m.color;
      ctx.beginPath();
      ctx.roundRect(bx, boxY, boxWidth, 6, [12, 12, 0, 0]);
      ctx.fill();

      // Big Value
      ctx.fillStyle = m.color;
      ctx.font = 'bold 36px "Baloo 2", sans-serif';
      ctx.fillText(m.val, bx + boxWidth / 2, boxY + 54);

      // Label
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText(m.label, bx + boxWidth / 2, boxY + 80);

      // Sublabel
      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.fillText(m.sub, bx + boxWidth / 2, boxY + 100);
    });

    // 7. Appreciation Box (प्रशंसा पत्र)
    const appBoxY = 620;
    ctx.fillStyle = '#fffbeb';
    ctx.beginPath();
    ctx.roundRect(240, appBoxY, 1120, 118, 12);
    ctx.fill();
    ctx.strokeStyle = '#fde68a';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 17px sans-serif';
    ctx.fillText(`${appreciation.stars}  APPRECIATION & EVALUATION: ${appreciation.badge}  ${appreciation.stars}`, 800, appBoxY + 30);

    ctx.fillStyle = '#1e293b';
    ctx.font = '15px sans-serif';
    ctx.fillText(`"${appreciation.remarkEn}"`, 800, appBoxY + 62);

    ctx.fillStyle = '#475569';
    ctx.font = '14px "Mukta", sans-serif';
    ctx.fillText(appreciation.remarkHi, 800, appBoxY + 92);

    // 8. Meta Assessment Bar
    const metaY = 762;
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.roundRect(240, metaY, 1120, 48, 8);
    ctx.fill();

    ctx.fillStyle = '#334155';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(`TEST DURATION: ${testDurationMinutes} MIN   |   LEVEL: ${currentLevel} (${levelLabels[currentLevel].nameEn})   |   DATE OF ISSUE: ${dateStr.toUpperCase()}   |   CERTIFICATE ID: ${certSerial}`, 800, metaY + 30);

    // 9. Official Footer: Signatures & Golden Stamp
    const footerY = 842;

    // Left: Evaluator
    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748b';
    ctx.font = '13px sans-serif';
    ctx.fillText('Assessed & Evaluated by:', 240, footerY + 20);
    ctx.fillStyle = '#0a2463';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('Ekta Typing Assessment Cell', 240, footerY + 44);
    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.fillText('Online Testing System • Beltron / DEO Format', 240, footerY + 66);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(240, footerY + 84);
    ctx.lineTo(440, footerY + 84);
    ctx.stroke();

    // Center: Official Golden Verified Stamp / Rosette
    ctx.textAlign = 'center';
    const sealX = 800;
    const sealY = footerY + 68;

    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.arc(sealX, sealY, 56, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.arc(sealX, sealY, 50, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 44, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText('★ EKTA COMMUNICATION ★', sealX, sealY - 24);
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('OFFICIAL', sealX, sealY - 6);
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('VERIFIED', sealX, sealY + 10);
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText('EKMA • SARAN', sealX, sealY + 26);

    // Right: Authorized Signatory
    ctx.textAlign = 'right';
    ctx.fillStyle = '#64748b';
    ctx.font = '13px sans-serif';
    ctx.fillText('Authorized Signatory:', 1360, footerY + 20);
    ctx.fillStyle = '#0a2463';
    ctx.font = 'italic bold 24px "Baloo 2", cursive, Georgia';
    ctx.fillText('Ekta Communication', 1360, footerY + 54);
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('Director / Center In-charge', 1360, footerY + 76);
    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.fillText('Near Sub-Registrar Office, Ekma (Saran)', 1360, footerY + 94);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(1160, footerY + 106);
    ctx.lineTo(1360, footerY + 106);
    ctx.stroke();

    // 10. Save certificate record for Admin & Trigger Download
    const cleanFileName = (nameToPrint || 'Candidate').replace(/[^a-zA-Z0-9_\u0900-\u097F]/g, '_');
    saveCertificateRecord({
      id: `CERT-${Date.now()}`,
      candidateName: nameToPrint,
      candidatePhone: typingCandidatePhone.trim() || 'Not Provided',
      netWpm,
      accuracyPct,
      correctCount,
      wrongCount,
      language: typingLang,
      level: currentLevel,
      date: dateStr,
      downloadedAt: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      certSerial
    });

    const link = document.createElement('a');
    link.download = `Ekta_Typing_Certificate_${cleanFileName}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  const handlePrintCertificate = () => {
    saveCertificateRecord({
      id: `CERT-${Date.now()}`,
      candidateName: typingCandidateName.trim() || 'Candidate Name',
      candidatePhone: typingCandidatePhone.trim() || 'Not Provided',
      netWpm,
      accuracyPct,
      correctCount,
      wrongCount,
      language: typingLang,
      level: currentLevel,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      downloadedAt: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      certSerial
    });
    window.print();
  };

  // ==========================================
  // TOOL 2: AGE CALCULATOR (TYPE DD/MM/YYYY - NO CALENDAR)
  // ==========================================
  const [dobDay, setDobDay] = useState<string>('15');
  const [dobMonth, setDobMonth] = useState<string>('08');
  const [dobYear, setDobYear] = useState<string>('2000');

  const now = new Date();
  const [asDay, setAsDay] = useState<string>(String(now.getDate()).padStart(2, '0'));
  const [asMonth, setAsMonth] = useState<string>(String(now.getMonth() + 1).padStart(2, '0'));
  const [asYear, setAsYear] = useState<string>(String(now.getFullYear()));

  const [ageResult, setAgeResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    totalWeeks: number;
    totalMonths: number;
    nextBirthdayDays: number;
  } | null>(null);
  const [ageError, setAgeError] = useState<string>('');
  const [copiedAge, setCopiedAge] = useState<boolean>(false);

  const calculateAge = () => {
    setAgeError('');
    const dDay = parseInt(dobDay, 10);
    const dMonth = parseInt(dobMonth, 10) - 1;
    const dYear = parseInt(dobYear, 10);

    const aDay = parseInt(asDay, 10);
    const aMonth = parseInt(asMonth, 10) - 1;
    const aYear = parseInt(asYear, 10);

    if (isNaN(dDay) || isNaN(dMonth) || isNaN(dYear) || isNaN(aDay) || isNaN(aMonth) || isNaN(aYear)) {
      setAgeError('कृपया सही दिन, महीना और साल टाइप करें।');
      return;
    }

    if (dDay < 1 || dDay > 31 || dMonth < 0 || dMonth > 11 || dYear < 1900 || dYear > 2099) {
      setAgeError('अमान्य जन्म तिथि। (दिन: 1-31, माह: 1-12, वर्ष: 1900-2099)');
      return;
    }

    const birth = new Date(dYear, dMonth, dDay);
    const target = new Date(aYear, aMonth, aDay);

    if (birth > target) {
      setAgeError('जन्म तिथि संदर्भ तिथि (As on Date) से पहले होनी चाहिए।');
      setAgeResult(null);
      return;
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMillis = target.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMillis / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    const nextBday = new Date(target.getFullYear(), dMonth, dDay);
    if (nextBday < target) {
      nextBday.setFullYear(target.getFullYear() + 1);
    }
    const daysToNextBday = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    setAgeResult({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      nextBirthdayDays: daysToNextBday
    });
  };

  useEffect(() => {
    calculateAge();
  }, [dobDay, dobMonth, dobYear, asDay, asMonth, asYear]);

  const setAsToday = () => {
    const today = new Date();
    setAsDay(String(today.getDate()).padStart(2, '0'));
    setAsMonth(String(today.getMonth() + 1).padStart(2, '0'));
    setAsYear(String(today.getFullYear()));
  };

  const setAsCutoff = (d: string, m: string, y: string) => {
    setAsDay(d);
    setAsMonth(m);
    setAsYear(y);
  };

  const copyAge = () => {
    if (!ageResult) return;
    const text = `${ageResult.years} Years, ${ageResult.months} Months, ${ageResult.days} Days (As on ${asDay}/${asMonth}/${asYear})`;
    navigator.clipboard.writeText(text);
    setCopiedAge(true);
    setTimeout(() => setCopiedAge(false), 2000);
  };

  // ==========================================
  // TOOL 3: PHOTO KE NICHE DATE AND NAME
  // ==========================================
  const [nameDatePhoto, setNameDatePhoto] = useState<string | null>(null);
  const [candidateName, setCandidateName] = useState<string>('RAVI KUMAR');
  const [dopDay, setDopDay] = useState<string>('25');
  const [dopMonth, setDopMonth] = useState<string>('10');
  const [dopYear, setDopYear] = useState<string>('2026');
  const [datePrefix, setDatePrefix] = useState<'D.O.P: ' | 'D.O.B: ' | 'DATE: ' | ''>('D.O.P: ');
  const [stripHeightPct, setStripHeightPct] = useState<number>(20);
  const [fontSize, setFontSize] = useState<number>(18);
  const [outputNameDateUrl, setOutputNameDateUrl] = useState<string | null>(null);

  const handleNameDateFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setNameDatePhoto(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!nameDatePhoto) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const width = img.width > 800 ? 500 : img.width;
      const height = img.width > 800 ? Math.round((img.height / img.width) * 500) : img.height;

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, width, height);

      const stripH = Math.round((height * stripHeightPct) / 100);
      const stripY = height - stripH;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, stripY, width, stripH);

      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, stripY);
      ctx.lineTo(width, stripY);
      ctx.stroke();

      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, width, height);

      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const scaledFontSize = Math.round((fontSize * width) / 350);
      ctx.font = `bold ${scaledFontSize}px sans-serif`;

      const formattedDate = `${dopDay.padStart(2, '0')}.${dopMonth.padStart(2, '0')}.${dopYear}`;
      const line1Y = stripY + stripH * 0.35;
      const line2Y = stripY + stripH * 0.72;

      ctx.fillText(candidateName.toUpperCase(), width / 2, line1Y);
      ctx.font = `bold ${Math.round(scaledFontSize * 0.85)}px sans-serif`;
      ctx.fillText(`${datePrefix}${formattedDate}`, width / 2, line2Y);

      setOutputNameDateUrl(canvas.toDataURL('image/jpeg', 0.95));
    };
    img.src = nameDatePhoto;
  }, [nameDatePhoto, candidateName, dopDay, dopMonth, dopYear, datePrefix, stripHeightPct, fontSize]);

  // ==========================================
  // TOOL 4: IMAGE RESIZE & KB COMPRESSOR
  // ==========================================
  const [resizeImage, setResizeImage] = useState<string | null>(null);
  const [origFileName, setOrigFileName] = useState<string>('photo.jpg');
  const [origSizeKb, setOrigSizeKb] = useState<number>(0);
  const [origWidth, setOrigWidth] = useState<number>(0);
  const [origHeight, setOrigHeight] = useState<number>(0);

  const [targetWidth, setTargetWidth] = useState<number>(350);
  const [targetHeight, setTargetHeight] = useState<number>(450);
  const [targetKb, setTargetKb] = useState<number>(50);
  const [format, setFormat] = useState<'image/jpeg' | 'image/png'>('image/jpeg');

  const [resizedDataUrl, setResizedDataUrl] = useState<string | null>(null);
  const [resizedSizeKb, setResizedSizeKb] = useState<number>(0);

  const handleResizeFile = (file: File) => {
    setOrigFileName(file.name);
    setOrigSizeKb(Math.round(file.size / 1024));
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setOrigWidth(img.width);
        setOrigHeight(img.height);
        setTargetWidth(img.width > 600 ? 350 : img.width);
        setTargetHeight(img.width > 600 ? Math.round((img.height / img.width) * 350) : img.height);
        setResizeImage(src);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const applyPreset = (w: number, h: number, kb: number) => {
    setTargetWidth(w);
    setTargetHeight(h);
    setTargetKb(kb);
  };

  useEffect(() => {
    if (!resizeImage) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      if (format === 'image/jpeg') {
        let minQ = 0.05;
        let maxQ = 0.98;
        let bestDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        let bestSize = Math.round((bestDataUrl.length * 3) / 4 / 1024);

        for (let i = 0; i < 7; i++) {
          const midQ = (minQ + maxQ) / 2;
          const testUrl = canvas.toDataURL('image/jpeg', midQ);
          const sizeKb = Math.round((testUrl.length * 3) / 4 / 1024);

          if (sizeKb <= targetKb) {
            bestDataUrl = testUrl;
            bestSize = sizeKb;
            minQ = midQ;
          } else {
            maxQ = midQ;
          }
        }
        setResizedDataUrl(bestDataUrl);
        setResizedSizeKb(bestSize);
      } else {
        const pngUrl = canvas.toDataURL('image/png');
        setResizedDataUrl(pngUrl);
        setResizedSizeKb(Math.round((pngUrl.length * 3) / 4 / 1024));
      }
    };
    img.src = resizeImage;
  }, [resizeImage, targetWidth, targetHeight, targetKb, format]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-100)', color: 'var(--gray-800)' }}>
      {/* ============================================================
          TOP BAR: With Official Logo & Sleek Arrow-Only Back Button
      ============================================================ */}
      <header style={{
        background: 'var(--blue-deep)',
        color: '#ffffff',
        padding: '12px 0',
        borderBottom: '3.5px solid var(--orange)',
        boxShadow: 'var(--shadow-md)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Sleek Arrow-Only Back Button */}
            <button
              onClick={onBackToHome}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.18)',
                border: '1.5px solid rgba(255,255,255,0.35)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
              title="Back to Ekta Communication Home"
              aria-label="Back to Home"
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>

            {/* Official Ekta Communication Logo + Titles */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg style={{ width: '44px', height: '44px', flexShrink: 0 }} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="12" y="28" width="46" height="30" rx="6" fill="#3a7bd5" />
                <rect x="22" y="14" width="26" height="16" rx="3" fill="#1b4fa8" />
                <rect x="27" y="8" width="16" height="12" rx="2" fill="#f0f4ff" stroke="#1b4fa8" strokeWidth="1.5" />
                <rect x="24" y="50" width="22" height="16" rx="2" fill="#f0f4ff" stroke="#1b4fa8" strokeWidth="1.5" />
                <line x1="28" y1="56" x2="42" y2="56" stroke="#1b4fa8" strokeWidth="2" strokeLinecap="round" />
                <line x1="28" y1="60" x2="40" y2="60" stroke="#1b4fa8" strokeWidth="2" strokeLinecap="round" />
                <circle cx="50" cy="38" r="3" fill="#1b4fa8" />
                <rect x="42" y="6" width="22" height="17" rx="5" fill="#f76c1b" />
                <polygon points="48,23 44,28 54,23" fill="#f76c1b" />
                <circle cx="49" cy="14" r="2" fill="white" />
                <circle cx="55" cy="14" r="2" fill="white" />
                <circle cx="61" cy="14" r="2" fill="white" />
              </svg>
              <div>
                <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.3rem', margin: 0, color: 'var(--white)', lineHeight: 1.1 }}>
                  EKTA COMMUNICATION <span style={{ color: 'var(--orange)' }}>Tools Portal</span>
                </h1>
                <span style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                  Near Registry Office, Ekma, Saran, Bihar
                </span>
              </div>
            </div>
          </div>

          <a
            href="https://wa.me/919472460132?text=Hello%20Ekta%20Communication%2C%20I%20need%20help%20with%20online%20tools."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#25d366',
              color: '#fff',
              padding: '7px 16px',
              borderRadius: '99px',
              fontWeight: 700,
              fontSize: '0.84rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <i className="fa-brands fa-whatsapp"></i> WhatsApp Help
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="container" style={{ padding: '24px 0 60px' }}>
        
        {/* Navigation Tabs (Remove BG Removed!) */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '26px'
        }}>
          {[
            { id: 'typing', label: 'Hindi & English Typing Test (Levels)', icon: 'fa-keyboard' },
            { id: 'age', label: 'Age Calculator (Type Date)', icon: 'fa-calculator' },
            { id: 'namedate', label: 'Photo Name & Date', icon: 'fa-id-badge' },
            { id: 'resize', label: 'Image Resize (KB)', icon: 'fa-compress' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ToolTab)}
              style={{
                padding: '10px 20px',
                borderRadius: '99px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-head)',
                fontWeight: 700,
                fontSize: '0.92rem',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s',
                background: activeTab === tab.id ? 'var(--blue-deep)' : 'var(--white)',
                color: activeTab === tab.id ? 'var(--white)' : 'var(--gray-800)',
                borderBottom: activeTab === tab.id ? '3px solid var(--orange)' : 'none'
              }}
            >
              <i className={`fa-solid ${tab.icon}`} style={{ marginRight: '6px', color: activeTab === tab.id ? 'var(--orange)' : 'var(--blue-mid)' }}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ============================================================
            TAB: LEVEL-BASED HINDI & ENGLISH TYPING TEST
        ============================================================ */}
        {activeTab === 'typing' && (
          <div style={{
            background: 'var(--white)',
            borderRadius: 'var(--radius)',
            padding: '30px',
            boxShadow: 'var(--shadow-md)',
            border: '1.5px solid var(--blue-pale)',
            maxWidth: '960px',
            margin: '0 auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--orange-light)', color: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                <i className="fa-solid fa-layer-group"></i>
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-head)', color: 'var(--blue-deep)', fontSize: '1.4rem', margin: 0 }}>
                  Hindi &amp; English Typing Test (प्रगतिशील स्तर - Step by Step Levels)
                </h2>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.88rem', margin: 0 }}>
                  सरल से कठिन स्तर (Level 1 से Level 4) — एक लेवल पूरा करें, फिर उससे कठिन अगला स्टेप अपने-आप खुलेगा!
                </p>
              </div>
            </div>

            {/* Level Selector Pills */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--blue-deep)' }}>
                  🎯 कठिनाई स्तर चुनें (Select Difficulty Level):
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--orange)', fontWeight: 700 }}>
                  वर्तमान स्तर: {levelLabels[currentLevel].nameHi} • पैराग्राफ: {safePassageIndex + 1}/{availablePassages.length}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                {([1, 2, 3, 4] as DifficultyLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      setCurrentLevel(lvl);
                      setPassageIndex(0);
                      setIsTestFinished(false);
                      setIsTestRunning(false);
                      setTimeLeftSeconds(testDurationMinutes * 60);
                      setCurrentTypedWord('');
                      setCurrentWordIdx(0);
                      setWordResults([]);
                      if (timerRef.current) clearInterval(timerRef.current);
                    }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      border: currentLevel === lvl ? '2.5px solid var(--orange)' : '1.5px solid var(--gray-200)',
                      background: currentLevel === lvl ? 'var(--blue-pale)' : '#fff',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <strong style={{ fontSize: '0.88rem', color: currentLevel === lvl ? 'var(--blue-deep)' : '#334155' }}>
                        Level {lvl}
                      </strong>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>{levelLabels[lvl].badge}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>
                      {levelLabels[lvl].desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Test Configuration Controls Bar */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--gray-100)',
              padding: '12px 18px',
              borderRadius: '12px',
              marginBottom: '20px',
              border: '1.5px solid var(--gray-200)'
            }}>
              
              {/* Language Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>भाषा:</span>
                <button
                  type="button"
                  onClick={() => {
                    setTypingLang('english');
                    setPassageIndex(0);
                    endTest();
                  }}
                  style={{
                    padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem',
                    background: typingLang === 'english' ? 'var(--blue-deep)' : '#fff',
                    color: typingLang === 'english' ? '#fff' : 'var(--gray-800)',
                    border: '1px solid var(--blue-deep)'
                  }}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTypingLang('hindi');
                    setPassageIndex(0);
                    endTest();
                  }}
                  style={{
                    padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem',
                    background: typingLang === 'hindi' ? 'var(--blue-deep)' : '#fff',
                    color: typingLang === 'hindi' ? '#fff' : 'var(--gray-800)',
                    border: '1px solid var(--blue-deep)'
                  }}
                >
                  हिंदी (Hindi)
                </button>
              </div>

              {/* Duration Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>समय:</span>
                {[1, 2, 5, 10].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => {
                      setTestDurationMinutes(mins);
                      setTimeLeftSeconds(mins * 60);
                      endTest();
                    }}
                    style={{
                      padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem',
                      background: testDurationMinutes === mins ? 'var(--orange)' : '#fff',
                      color: testDurationMinutes === mins ? '#fff' : 'var(--gray-800)',
                      border: '1px solid var(--gray-200)'
                    }}
                  >
                    {mins} Min
                  </button>
                ))}
              </div>

              {/* Digital Timer Clock */}
              <div style={{
                background: isTestRunning ? 'var(--orange)' : 'var(--blue-deep)',
                color: '#fff',
                padding: '6px 18px',
                borderRadius: '99px',
                fontWeight: 800,
                fontSize: '1.1rem',
                fontFamily: 'monospace',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
              }}>
                ⏱ {Math.floor(timeLeftSeconds / 60)}:{(timeLeftSeconds % 60).toString().padStart(2, '0')}
              </div>

            </div>

            {/* Test Passage Screen - Flex Wrap ensures words never overflow or spill out of the box */}
            <div style={{
              background: '#ffffff',
              padding: '20px 24px',
              borderRadius: '12px',
              border: '2px solid var(--blue-pale)',
              lineHeight: 2,
              fontSize: '1.25rem',
              minHeight: '130px',
              marginBottom: '20px',
              fontFamily: typingLang === 'hindi' ? 'var(--font-body)' : 'sans-serif',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.03)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px 8px',
              alignItems: 'center',
              boxSizing: 'border-box',
              width: '100%',
              maxWidth: '100%',
              overflow: 'hidden',
              wordBreak: 'break-word',
              overflowWrap: 'anywhere'
            }}>
              {targetWords.map((word, idx) => {
                let color = '#334155';
                let bg = 'transparent';
                let weight = 'normal';

                if (idx < currentWordIdx) {
                  color = wordResults[idx] === 'correct' ? '#16a34a' : '#ef4444';
                  if (wordResults[idx] === 'wrong') bg = '#fee2e2';
                } else if (idx === currentWordIdx) {
                  bg = '#fef08a'; // Active word highlight
                  weight = 'bold';
                  color = '#000000';
                }

                return (
                  <span
                    key={idx}
                    ref={idx === currentWordIdx ? activeWordRef : null}
                    style={{
                      color,
                      backgroundColor: bg,
                      fontWeight: weight as any,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      whiteSpace: 'nowrap',
                      border: idx === currentWordIdx ? '1.5px solid #ca8a04' : '1px solid transparent',
                      textDecoration: idx < currentWordIdx && wordResults[idx] === 'wrong' ? 'line-through' : 'none',
                      transition: 'background-color 0.15s, color 0.15s',
                      boxSizing: 'border-box'
                    }}
                  >
                    {word}
                  </span>
                );
              })}
            </div>

            {/* Typing Input */}
            <div style={{ marginBottom: '20px' }}>
              <input
                ref={typingInputRef}
                type="text"
                value={currentTypedWord}
                onChange={handleTypingKey}
                disabled={isTestFinished}
                placeholder={isTestRunning ? 'टाइप करते रहें और स्पेस बार दबाते जाएं...' : 'यहाँ टाइप करना शुरू करें (टाइमर अपने-आप शुरू होगा)...'}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: '10px',
                  border: isTestRunning ? '2.5px solid var(--orange)' : '2px solid var(--blue-mid)',
                  fontSize: '1.25rem',
                  fontFamily: typingLang === 'hindi' ? 'var(--font-body)' : 'monospace',
                  background: isTestFinished ? '#f1f5f9' : '#ffffff',
                  boxShadow: 'var(--shadow-sm)',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Actions: Start, Finish, Change Paragraph, Next Level */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={startTest}
                className="btn-primary"
                style={{ padding: '10px 22px', fontSize: '0.92rem' }}
              >
                <i className="fa-solid fa-rotate-right"></i>
                {isTestRunning ? 'Restart Level' : `Start Level ${currentLevel}`}
              </button>

              {/* CHANGE PARAGRAPH BUTTON FOR UNLIMITED PRACTICE */}
              <button
                type="button"
                onClick={handleChangeParagraph}
                style={{
                  background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 3px 10px rgba(13,148,136,0.35)',
                  transition: 'all 0.2s'
                }}
                title="नया पैराग्राफ लोड करें और असीमित अभ्यास करें"
              >
                <i className="fa-solid fa-arrows-rotate"></i>
                नया पैराग्राफ 🔄 ({safePassageIndex + 1}/{availablePassages.length})
              </button>

              {isTestRunning && (
                <button
                  type="button"
                  onClick={endTest}
                  style={{
                    background: '#ef4444', color: '#fff', border: 'none',
                    padding: '10px 20px', borderRadius: 'var(--radius-sm)',
                    fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem'
                  }}
                >
                  <i className="fa-solid fa-circle-stop"></i> Finish Test &amp; Get Certificate
                </button>
              )}

              {currentLevel < 4 && (
                <button
                  type="button"
                  onClick={handleNextLevel}
                  style={{
                    background: 'var(--blue-deep)', color: '#fff', border: 'none',
                    padding: '10px 20px', borderRadius: 'var(--radius-sm)',
                    fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
                    marginLeft: 'auto'
                  }}
                >
                  Skip to Next Harder Level →
                </button>
              )}
            </div>

            {/* Live Dashboard Meters: 4 Required Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '12px',
              textAlign: 'center'
            }}>
              <div style={{ background: 'var(--gray-100)', padding: '16px', borderRadius: '10px', border: '1px solid var(--gray-200)' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--blue-deep)' }}>{netWpm}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)', fontWeight: 700 }}>Speed (WPM)</div>
              </div>

              <div style={{ background: 'var(--gray-100)', padding: '16px', borderRadius: '10px', border: '1px solid var(--gray-200)' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: accuracyPct >= 90 ? '#16a34a' : '#ea580c' }}>{accuracyPct}%</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)', fontWeight: 700 }}>Accuracy (सटीकता)</div>
              </div>

              <div style={{ background: 'var(--gray-100)', padding: '16px', borderRadius: '10px', border: '1px solid var(--gray-200)' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#16a34a' }}>{correctCount}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)', fontWeight: 700 }}>Correct Words</div>
              </div>

              <div style={{ background: 'var(--gray-100)', padding: '16px', borderRadius: '10px', border: '1px solid var(--gray-200)' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444' }}>{wrongCount}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)', fontWeight: 700 }}>Errors (गलतियाँ)</div>
              </div>
            </div>

            {/* Pre-completion info note when test is not yet completed */}
            {(!isTestFinished || totalWordsAttempted === 0) && (
              <div style={{
                marginTop: '22px',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)',
                border: '1.5px dashed #0d9488',
                borderRadius: '12px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                color: '#134e4a'
              }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: '#ccfbf1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  color: '#0d9488',
                  flexShrink: 0
                }}>
                  <i className="fa-solid fa-award"></i>
                </div>
                <div>
                  <strong style={{ fontSize: '0.95rem', display: 'block', marginBottom: '2px' }}>
                    🏆 प्रमाणपत्र निर्माण नियम (Certificate Policy):
                  </strong>
                  <span style={{ fontSize: '0.84rem', color: '#334155' }}>
                    सर्टिफिकेट केवल तभी जनरेट होगा जब आप टेस्ट को पूरा करेंगे। टेस्ट समाप्त होते ही आपका आधिकारिक टाइपिंग प्रमाणपत्र (Speed, Accuracy, Correct Words, Errors व Appreciation के साथ) नीचे स्वतः जनरेट हो जाएगा, जिसे आप अपना नाम लिखकर HD इमेज या PDF में डाउनलोड कर सकते हैं।
                  </span>
                </div>
              </div>
            )}

            {/* Level Completion Result & Next Level Step Banner */}
            {isTestFinished && totalWordsAttempted > 0 && (
              <div style={{
                marginTop: '26px',
                background: 'linear-gradient(135deg, var(--blue-deep) 0%, var(--blue-mid) 100%)',
                color: '#fff',
                padding: '26px',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-md)'
              }}>
                <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '1.6rem', color: 'var(--orange)', marginBottom: '6px' }}>
                  {isQualified ? `🎉 Congratulations! Level ${currentLevel} Completed!` : `Level ${currentLevel} Finished`}
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#dbeafe', marginBottom: '18px' }}>
                  {typingLang === 'english' ? 'English' : 'हिंदी'} Typing • {levelLabels[currentLevel].nameEn} Result
                </p>

                <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '24px', background: 'rgba(255,255,255,0.12)', padding: '16px 28px', borderRadius: '12px', marginBottom: '20px' }}>
                  <div>
                    <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>Net Speed:</span>
                    <strong style={{ fontSize: '1.6rem', display: 'block', color: 'var(--orange)' }}>{netWpm} WPM</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>Accuracy:</span>
                    <strong style={{ fontSize: '1.6rem', display: 'block', color: '#fff' }}>{accuracyPct}%</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>Status:</span>
                    <strong style={{ fontSize: '1.2rem', display: 'block', color: isQualified ? '#4ade80' : '#f87171' }}>
                      {isQualified ? 'PASSED / QUALIFIED ✓' : 'NEEDS PRACTICE'}
                    </strong>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={startTest}
                    style={{
                      background: 'rgba(255,255,255,0.18)',
                      border: '1px solid rgba(255,255,255,0.4)',
                      color: '#fff',
                      padding: '10px 22px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.92rem'
                    }}
                  >
                    Retry Level {currentLevel}
                  </button>

                  <button
                    onClick={handleChangeParagraph}
                    style={{
                      background: '#0d9488',
                      color: '#fff',
                      border: 'none',
                      padding: '10px 22px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.92rem'
                    }}
                  >
                    नया पैराग्राफ लोड करें 🔄
                  </button>

                  {currentLevel < 4 ? (
                    <button
                      onClick={handleNextLevel}
                      style={{
                        background: 'var(--orange)',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 28px',
                        borderRadius: '8px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        fontSize: '1rem',
                        boxShadow: '0 4px 14px rgba(247,108,27,0.5)'
                      }}
                    >
                      Next Level {currentLevel + 1} (अगला कठिन स्तर) →
                    </button>
                  ) : (
                    <div style={{ color: '#4ade80', fontWeight: 800, fontSize: '1.1rem', padding: '10px' }}>
                      👑 You have conquered all Master Typing Levels!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ============================================================
                OFFICIAL ATTRACTIVE CERTIFICATE SECTION WITH NAME INPUT & DOWNLOAD
                STRICT CONDITION: Generated ONLY when test is finished and attempted!
            ============================================================ */}
            {isTestFinished && totalWordsAttempted > 0 && (
              <div style={{ marginTop: '36px' }}>
                
                {/* Name Fill & Action Controls Header */}
                <div style={{
                  background: 'linear-gradient(135deg, #f0f4ff 0%, #fff7ed 100%)',
                  border: '2px solid var(--blue-pale)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '24px',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <i className="fa-solid fa-graduation-cap" style={{ color: 'var(--orange)', fontSize: '1.5rem' }}></i>
                    <div>
                      <h3 style={{ margin: 0, fontFamily: 'var(--font-head)', color: 'var(--blue-deep)', fontSize: '1.25rem' }}>
                        अपना सर्टिफिकेट तैयार करें और डाउनलोड करें (Generate &amp; Download Your Certificate)
                      </h3>
                      <p style={{ margin: 0, color: 'var(--gray-600)', fontSize: '0.85rem' }}>
                        नीचे अपना नाम लिखें — सर्टिफिकेट पर आपका नाम तुरंत लाइव अपडेट हो जाएगा, फिर HD इमेज या PDF डाउनलोड करें।
                      </p>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '14px',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ flex: '1 1 240px' }}>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, color: 'var(--blue-deep)', marginBottom: '6px' }}>
                        ✍️ उम्मीदवार का नाम लिखें (Candidate Name):
                      </label>
                      <input
                        type="text"
                        value={typingCandidateName}
                        onChange={(e) => setTypingCandidateName(e.target.value)}
                        placeholder="उदा: Rahul Kumar / पूजा कुमारी"
                        style={{
                          width: '100%',
                          padding: '12px 18px',
                          borderRadius: '10px',
                          border: '2.5px solid var(--orange)',
                          fontSize: '1.05rem',
                          fontWeight: 700,
                          color: 'var(--blue-deep)',
                          background: '#ffffff',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div style={{ flex: '1 1 220px' }}>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, color: 'var(--blue-deep)', marginBottom: '6px' }}>
                        📱 मोबाइल / WhatsApp नंबर (Mobile No):
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        value={typingCandidatePhone}
                        onChange={(e) => setTypingCandidatePhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="10 अंकों का मोबाइल नंबर"
                        style={{
                          width: '100%',
                          padding: '12px 18px',
                          borderRadius: '10px',
                          border: '2.5px solid #16a34a',
                          fontSize: '1.05rem',
                          fontWeight: 700,
                          color: 'var(--blue-deep)',
                          background: '#ffffff',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={downloadCertificateAsImage}
                        style={{
                          background: 'linear-gradient(135deg, var(--orange), var(--orange-dark))',
                          color: '#ffffff',
                          border: 'none',
                          padding: '13px 26px',
                          borderRadius: '10px',
                          fontWeight: 800,
                          fontSize: '0.98rem',
                          cursor: 'pointer',
                          boxShadow: '0 4px 16px rgba(247,108,27,0.45)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'transform 0.2s'
                        }}
                      >
                        <i className="fa-solid fa-download"></i> Download Certificate (HD PNG)
                      </button>

                      <button
                        type="button"
                        onClick={handlePrintCertificate}
                        style={{
                          background: 'var(--blue-deep)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '13px 22px',
                          borderRadius: '10px',
                          fontWeight: 700,
                          fontSize: '0.92rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <i className="fa-solid fa-print"></i> Print / Save PDF
                      </button>
                    </div>
                  </div>
                </div>

                {/* THE ATTRACTIVE CERTIFICATE FRAME (Live Interactive Preview) */}
                <div
                  id="typingCertificateArea"
                  style={{
                    background: '#fffdf9',
                    borderRadius: '16px',
                    padding: '36px 30px',
                    position: 'relative',
                    boxShadow: '0 12px 40px rgba(10,36,99,0.18)',
                    border: '14px solid var(--blue-deep)',
                    outline: '4px solid #d97706',
                    outlineOffset: '-10px',
                    maxWidth: '880px',
                    margin: '0 auto',
                    textAlign: 'center',
                    boxSizing: 'border-box',
                    overflow: 'hidden'
                  }}
                >
                  {/* Decorative Corner Stars */}
                  <div style={{ position: 'absolute', top: '16px', left: '16px', color: '#d97706', fontSize: '1.2rem' }}>★</div>
                  <div style={{ position: 'absolute', top: '16px', right: '16px', color: '#d97706', fontSize: '1.2rem' }}>★</div>
                  <div style={{ position: 'absolute', bottom: '16px', left: '16px', color: '#d97706', fontSize: '1.2rem' }}>★</div>
                  <div style={{ position: 'absolute', bottom: '16px', right: '16px', color: '#d97706', fontSize: '1.2rem' }}>★</div>

                  {/* Header: Official Logo and Ekta Communication Identity with Scaled-up Printer Logo */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '10px' }}>
                    <svg style={{ width: '74px', height: '74px', flexShrink: 0 }} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="12" y="28" width="46" height="30" rx="6" fill="#3a7bd5" />
                      <rect x="22" y="14" width="26" height="16" rx="3" fill="#1b4fa8" />
                      <rect x="27" y="8" width="16" height="12" rx="2" fill="#f0f4ff" stroke="#1b4fa8" strokeWidth="1.5" />
                      <rect x="24" y="50" width="22" height="16" rx="2" fill="#f0f4ff" stroke="#1b4fa8" strokeWidth="1.5" />
                      <line x1="28" y1="56" x2="42" y2="56" stroke="#1b4fa8" strokeWidth="2" strokeLinecap="round" />
                      <line x1="28" y1="60" x2="40" y2="60" stroke="#1b4fa8" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="50" cy="38" r="3" fill="#1b4fa8" />
                      <rect x="42" y="6" width="22" height="17" rx="5" fill="#f76c1b" />
                      <polygon points="48,23 44,28 54,23" fill="#f76c1b" />
                      <circle cx="49" cy="14" r="2" fill="white" />
                      <circle cx="55" cy="14" r="2" fill="white" />
                      <circle cx="61" cy="14" r="2" fill="white" />
                    </svg>
                    <div>
                      <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1.9rem', color: 'var(--blue-deep)', margin: 0, lineHeight: 1.1 }}>
                        EKTA COMMUNICATION
                      </h2>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--orange)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        Government Documentation &amp; Computer Skill Assessment Lab
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--gray-600)' }}>
                        Near Sub-Registrar Office, Ekma, Saran, Bihar - 841208 | +91 94724 60132
                      </div>
                    </div>
                  </div>

                  <div style={{ width: '80%', height: '1.5px', background: 'linear-gradient(90deg, transparent, #cbd5e1, transparent)', margin: '12px auto 16px' }}></div>

                  {/* Certificate Title */}
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#d97706', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>
                    ★ Official Skill Assessment Certificate ★
                  </div>
                  <h1 style={{
                    fontFamily: 'var(--font-head)',
                    fontSize: 'clamp(1.6rem, 4vw, 2.3rem)',
                    color: 'var(--blue-deep)',
                    margin: '0 0 4px',
                    letterSpacing: '0.5px'
                  }}>
                    CERTIFICATE OF TYPING PROFICIENCY
                  </h1>
                  <div style={{ fontSize: '1.05rem', color: '#334155', fontWeight: 700, marginBottom: '18px' }}>
                    कंप्यूटर टाइपिंग प्रवीणता एवं दक्षता प्रमाण पत्र
                  </div>

                  {/* Candidate Presentation */}
                  <div style={{ fontStyle: 'italic', color: '#64748b', fontSize: '0.98rem', marginBottom: '8px' }}>
                    This is to proudly certify that
                  </div>
                  <div style={{
                    display: 'inline-block',
                    padding: '6px 28px',
                    borderBottom: '3px solid #f59e0b',
                    marginBottom: '10px'
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-head)',
                      fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                      color: 'var(--blue-deep)',
                      fontWeight: 800,
                      letterSpacing: '1px'
                    }}>
                      {typingCandidateName.trim() ? typingCandidateName.toUpperCase() : 'CANDIDATE NAME'}
                    </span>
                  </div>

                  {/* Candidate Phone Number Display */}
                  {typingCandidatePhone.trim() && (
                    <div style={{
                      fontSize: '0.95rem',
                      color: '#15803d',
                      fontWeight: 800,
                      marginBottom: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}>
                      <i className="fa-brands fa-whatsapp"></i> Verified Mobile / WhatsApp: +91 {typingCandidatePhone.trim()}
                    </div>
                  )}

                  <p style={{ maxWidth: '680px', margin: '0 auto 20px', color: '#475569', fontSize: '0.88rem', lineHeight: 1.5 }}>
                    has successfully undertaken and qualified the Official <strong>{typingLang === 'english' ? 'English' : 'हिंदी (Hindi)'} Typing Assessment (Level {currentLevel} - {levelLabels[currentLevel].nameEn})</strong> conducted under timed examination conditions with the following certified performance metrics:
                  </p>

                  {/* The 4 Core Metrics Boxes requested by User */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: '12px',
                    marginBottom: '20px'
                  }}>
                    {/* 1. Speed (WPM) */}
                    <div style={{
                      background: '#ffffff',
                      border: '2px solid #dbeafe',
                      borderRadius: '12px',
                      padding: '14px 10px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      borderTop: '5px solid var(--blue-deep)'
                    }}>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--blue-deep)', lineHeight: 1.1 }}>
                        {netWpm}
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>
                        Speed (WPM)
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        शुद्ध गति (WPM)
                      </div>
                    </div>

                    {/* 2. Accuracy (सटीकता) */}
                    <div style={{
                      background: '#ffffff',
                      border: '2px solid #dbeafe',
                      borderRadius: '12px',
                      padding: '14px 10px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      borderTop: `5px solid ${accuracyPct >= 90 ? '#16a34a' : '#d97706'}`
                    }}>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: accuracyPct >= 90 ? '#16a34a' : '#d97706', lineHeight: 1.1 }}>
                        {accuracyPct}%
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>
                        Accuracy (सटीकता)
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        शुद्धता प्रतिशत
                      </div>
                    </div>

                    {/* 3. Correct Words */}
                    <div style={{
                      background: '#ffffff',
                      border: '2px solid #dbeafe',
                      borderRadius: '12px',
                      padding: '14px 10px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      borderTop: '5px solid #16a34a'
                    }}>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: '#16a34a', lineHeight: 1.1 }}>
                        {correctCount}
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>
                        Correct Words
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        सही शब्द
                      </div>
                    </div>

                    {/* 4. Errors (गलतियाँ) */}
                    <div style={{
                      background: '#ffffff',
                      border: '2px solid #dbeafe',
                      borderRadius: '12px',
                      padding: '14px 10px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      borderTop: `5px solid ${wrongCount === 0 ? '#16a34a' : '#dc2626'}`
                    }}>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: wrongCount === 0 ? '#16a34a' : '#dc2626', lineHeight: 1.1 }}>
                        {wrongCount}
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>
                        Errors (गलतियाँ)
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        त्रुटियां
                      </div>
                    </div>
                  </div>

                  {/* Appreciation & Remark Box */}
                  <div style={{
                    background: '#fffbeb',
                    border: '1.5px solid #fde68a',
                    borderRadius: '12px',
                    padding: '14px 20px',
                    marginBottom: '18px'
                  }}>
                    <div style={{ color: '#b45309', fontWeight: 800, fontSize: '0.9rem', marginBottom: '4px' }}>
                      {getAppreciationDetails(netWpm, accuracyPct).stars} APPRECIATION &amp; EVALUATION: {getAppreciationDetails(netWpm, accuracyPct).badge} {getAppreciationDetails(netWpm, accuracyPct).stars}
                    </div>
                    <div style={{ color: '#1e293b', fontSize: '0.88rem', fontWeight: 600, fontStyle: 'italic', marginBottom: '2px' }}>
                      "{getAppreciationDetails(netWpm, accuracyPct).remarkEn}"
                    </div>
                    <div style={{ color: '#475569', fontSize: '0.82rem' }}>
                      {getAppreciationDetails(netWpm, accuracyPct).remarkHi}
                    </div>
                  </div>

                  {/* Metadata Bar */}
                  <div style={{
                    background: '#f1f5f9',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '0.75rem',
                    color: '#334155',
                    fontWeight: 700,
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                    gap: '8px',
                    marginBottom: '24px'
                  }}>
                    <span>⏱ DURATION: {testDurationMinutes} MIN</span>
                    <span>🎯 LEVEL: {currentLevel} ({levelLabels[currentLevel].nameEn})</span>
                    <span>📅 DATE: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    <span>📜 CERTIFICATE ID: {certSerial}</span>
                  </div>

                  {/* Certificate Footer: Evaluator, Stamp, and Authorized Signature */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    paddingTop: '8px',
                    borderTop: '1px dashed #cbd5e1',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}>
                    {/* Left: Evaluator Cell */}
                    <div style={{ textAlign: 'left', minWidth: '160px' }}>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Assessed &amp; Evaluated By:</div>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--blue-deep)', display: 'block' }}>Ekta Typing Lab</strong>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Beltron &amp; DEO Testing System</span>
                    </div>

                    {/* Center: Golden Verified Rosette Seal */}
                    <div style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, #fef3c7 0%, #fde68a 60%, #d97706 100%)',
                      border: '3px double #78350f',
                      boxShadow: '0 4px 12px rgba(217,119,6,0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      color: '#78350f',
                      lineHeight: 1.1
                    }}>
                      <span style={{ fontSize: '0.55rem', fontWeight: 800 }}>★ EKTA ★</span>
                      <strong style={{ fontSize: '0.75rem', fontWeight: 900 }}>VERIFIED</strong>
                      <span style={{ fontSize: '0.5rem', fontWeight: 700 }}>EKMA (SARAN)</span>
                    </div>

                    {/* Right: Authorized Signatory */}
                    <div style={{ textAlign: 'right', minWidth: '160px' }}>
                      <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.25rem', color: 'var(--blue-deep)', fontStyle: 'italic', fontWeight: 700 }}>
                        Ekta Communication
                      </div>
                      <div style={{ borderTop: '1px solid #94a3b8', width: '150px', marginLeft: 'auto', marginTop: '2px' }}></div>
                      <strong style={{ fontSize: '0.82rem', color: '#1e293b', display: 'block' }}>Authorized Signatory</strong>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Ekma, Saran, Bihar - 841208</span>
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

        {/* ============================================================
            TAB: AGE CALCULATOR (TYPED INPUTS DD/MM/YYYY - NO CALENDAR)
        ============================================================ */}
        {activeTab === 'age' && (
          <div style={{
            background: 'var(--white)',
            borderRadius: 'var(--radius)',
            padding: '30px',
            boxShadow: 'var(--shadow-md)',
            border: '1.5px solid var(--blue-pale)',
            maxWidth: '860px',
            margin: '0 auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--blue-pale)', color: 'var(--blue-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                <i className="fa-solid fa-calculator"></i>
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-head)', color: 'var(--blue-deep)', fontSize: '1.4rem', margin: 0 }}>
                  Online Age Calculator (आयु कैलकुलेटर)
                </h2>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.88rem', margin: 0 }}>
                  सीधे कीबोर्ड से टाइप करके दिन, महीना और साल भरें — बिना किसी कैलेंडर झंझट के तुरंत सटीक उम्र निकालें।
                </p>
              </div>
            </div>

            {ageError && (
              <div style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
                ⚠️ {ageError}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '24px' }}>
              
              {/* DOB: DD / MM / YYYY */}
              <div style={{ background: 'var(--gray-100)', padding: '18px', borderRadius: '12px', border: '1.5px solid var(--gray-200)' }}>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '0.92rem', marginBottom: '10px', color: 'var(--blue-deep)' }}>
                  1. Date of Birth (जन्म तिथि):
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '8px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-600)', display: 'block', marginBottom: '2px' }}>दिन (DD)</span>
                    <input
                      type="number"
                      min={1}
                      max={31}
                      placeholder="15"
                      value={dobDay}
                      onChange={(e) => setDobDay(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid var(--blue-mid)', textAlign: 'center', fontSize: '1.1rem', fontWeight: 800, background: '#fff' }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-600)', display: 'block', marginBottom: '2px' }}>माह (MM)</span>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      placeholder="08"
                      value={dobMonth}
                      onChange={(e) => setDobMonth(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid var(--blue-mid)', textAlign: 'center', fontSize: '1.1rem', fontWeight: 800, background: '#fff' }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-600)', display: 'block', marginBottom: '2px' }}>वर्ष (YYYY)</span>
                    <input
                      type="number"
                      min={1900}
                      max={2099}
                      placeholder="2000"
                      value={dobYear}
                      onChange={(e) => setDobYear(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid var(--blue-mid)', textAlign: 'center', fontSize: '1.1rem', fontWeight: 800, background: '#fff' }}
                    />
                  </div>
                </div>
              </div>

              {/* Age As On: DD / MM / YYYY */}
              <div style={{ background: 'var(--gray-100)', padding: '18px', borderRadius: '12px', border: '1.5px solid var(--gray-200)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--blue-deep)' }}>
                    2. Age As On Date (संदर्भ तिथि):
                  </label>
                  <button
                    type="button"
                    onClick={setAsToday}
                    style={{ background: 'var(--blue-pale)', border: '1px solid var(--blue-mid)', color: 'var(--blue-deep)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700 }}
                  >
                    Today (आज)
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '8px', marginBottom: '10px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-600)', display: 'block', marginBottom: '2px' }}>दिन (DD)</span>
                    <input
                      type="number"
                      min={1}
                      max={31}
                      value={asDay}
                      onChange={(e) => setAsDay(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid var(--orange)', textAlign: 'center', fontSize: '1.1rem', fontWeight: 800, background: '#fff' }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-600)', display: 'block', marginBottom: '2px' }}>माह (MM)</span>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={asMonth}
                      onChange={(e) => setAsMonth(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid var(--orange)', textAlign: 'center', fontSize: '1.1rem', fontWeight: 800, background: '#fff' }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-600)', display: 'block', marginBottom: '2px' }}>वर्ष (YYYY)</span>
                    <input
                      type="number"
                      min={1900}
                      max={2099}
                      value={asYear}
                      onChange={(e) => setAsYear(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid var(--orange)', textAlign: 'center', fontSize: '1.1rem', fontWeight: 800, background: '#fff' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setAsCutoff('01', '08', '2026')}
                    style={{ background: '#fff', border: '1px solid #ccc', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', cursor: 'pointer' }}
                  >
                    01/08/2026 (SSC/UPSC)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAsCutoff('01', '01', '2026')}
                    style={{ background: '#fff', border: '1px solid #ccc', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', cursor: 'pointer' }}
                  >
                    01/01/2026
                  </button>
                </div>
              </div>

            </div>

            {/* Results Display */}
            {ageResult && (
              <div style={{
                background: 'linear-gradient(135deg, var(--blue-deep) 0%, var(--blue-mid) 100%)',
                borderRadius: '16px',
                padding: '24px',
                color: 'var(--white)',
                boxShadow: 'var(--shadow-md)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.88rem', color: 'var(--orange-light)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}>
                    Age as on {asDay}/{asMonth}/{asYear}
                  </span>
                  <button
                    onClick={copyAge}
                    style={{
                      background: 'var(--orange)',
                      border: 'none',
                      color: '#fff',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <i className="fa-solid fa-copy"></i>
                    {copiedAge ? 'Copied!' : 'Copy Age Details'}
                  </button>
                </div>

                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px',
                  textAlign: 'center', marginBottom: '20px'
                }}>
                  <div style={{ background: 'rgba(255,255,255,0.12)', padding: '16px 10px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '2.4rem', fontWeight: 800, fontFamily: 'var(--font-head)', color: 'var(--orange)' }}>
                      {ageResult.years}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#dbeafe', fontWeight: 600 }}>Years (वर्ष)</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.12)', padding: '16px 10px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '2.4rem', fontWeight: 800, fontFamily: 'var(--font-head)', color: '#fff' }}>
                      {ageResult.months}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#dbeafe', fontWeight: 600 }}>Months (महीने)</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.12)', padding: '16px 10px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '2.4rem', fontWeight: 800, fontFamily: 'var(--font-head)', color: '#fff' }}>
                      {ageResult.days}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#dbeafe', fontWeight: 600 }}>Days (दिन)</div>
                  </div>
                </div>

                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '10px', fontSize: '0.85rem', background: 'rgba(0,0,0,0.22)', padding: '14px', borderRadius: '10px'
                }}>
                  <div>🎂 Next Birthday: <strong>{ageResult.nextBirthdayDays} days left</strong></div>
                  <div>📅 Total Months: <strong>{ageResult.totalMonths}</strong></div>
                  <div>📆 Total Weeks: <strong>{ageResult.totalWeeks}</strong></div>
                  <div>⏳ Total Days: <strong>{ageResult.totalDays}</strong></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            TAB: PHOTO KE NICHE DATE AND NAME
        ============================================================ */}
        {activeTab === 'namedate' && (
          <div style={{
            background: 'var(--white)',
            borderRadius: 'var(--radius)',
            padding: '30px',
            boxShadow: 'var(--shadow-md)',
            border: '1.5px solid var(--blue-pale)',
            maxWidth: '960px',
            margin: '0 auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--blue-pale)', color: 'var(--blue-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                <i className="fa-solid fa-id-badge"></i>
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-head)', color: 'var(--blue-deep)', fontSize: '1.4rem', margin: 0 }}>
                  Photo Name &amp; Date Generator (फोटो पर नाम और दिनांक)
                </h2>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.88rem', margin: 0 }}>
                  SSC, Bihar Police, BPSC, Railway एवं अन्य सरकारी फॉर्म के लिए पासपोर्ट फोटो के नीचे सफेद पट्टी पर नाम व D.O.P जोड़ें।
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '26px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px' }}>
                  Upload Passport Photo:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleNameDateFile(e.target.files[0])}
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1.5px dashed var(--blue-light)', background: 'var(--gray-100)', cursor: 'pointer', marginBottom: '16px' }}
                />

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', marginBottom: '4px' }}>
                    Candidate Full Name (उम्मीदवार का नाम):
                  </label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="e.g. RAHUL KUMAR"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1.5px solid var(--gray-200)', textTransform: 'uppercase', fontWeight: 700 }}
                  />
                </div>

                {/* Typed Date DD / MM / YYYY */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', marginBottom: '4px' }}>
                    Date of Photo (दिनांक - टाइप करें):
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1.5fr', gap: '6px' }}>
                    <select
                      value={datePrefix}
                      onChange={(e) => setDatePrefix(e.target.value as any)}
                      style={{ padding: '8px', borderRadius: '6px', border: '1.5px solid var(--gray-200)', background: '#fff', fontSize: '0.82rem', fontWeight: 600 }}
                    >
                      <option value="D.O.P: ">D.O.P:</option>
                      <option value="D.O.B: ">D.O.B:</option>
                      <option value="DATE: ">DATE:</option>
                      <option value="">No Prefix</option>
                    </select>

                    <input
                      type="number"
                      placeholder="DD"
                      min={1}
                      max={31}
                      value={dopDay}
                      onChange={(e) => setDopDay(e.target.value)}
                      style={{ padding: '8px', borderRadius: '6px', border: '1.5px solid var(--gray-200)', textAlign: 'center', fontWeight: 700 }}
                    />
                    <input
                      type="number"
                      placeholder="MM"
                      min={1}
                      max={12}
                      value={dopMonth}
                      onChange={(e) => setDopMonth(e.target.value)}
                      style={{ padding: '8px', borderRadius: '6px', border: '1.5px solid var(--gray-200)', textAlign: 'center', fontWeight: 700 }}
                    />
                    <input
                      type="number"
                      placeholder="YYYY"
                      min={1900}
                      max={2099}
                      value={dopYear}
                      onChange={(e) => setDopYear(e.target.value)}
                      style={{ padding: '8px', borderRadius: '6px', border: '1.5px solid var(--gray-200)', textAlign: 'center', fontWeight: 700 }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', marginBottom: '4px' }}>
                      Strip Height: {stripHeightPct}%
                    </label>
                    <input
                      type="range"
                      min={15}
                      max={30}
                      value={stripHeightPct}
                      onChange={(e) => setStripHeightPct(Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--blue-mid)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', marginBottom: '4px' }}>
                      Font Size: {fontSize}px
                    </label>
                    <input
                      type="range"
                      min={12}
                      max={26}
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--blue-mid)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div style={{ textAlign: 'center', background: 'var(--gray-100)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {outputNameDateUrl ? (
                  <>
                    <div style={{ maxHeight: '270px', overflow: 'hidden', borderRadius: '4px', boxShadow: '0 6px 16px rgba(0,0,0,0.18)', marginBottom: '14px', border: '1px solid #aaa' }}>
                      <img src={outputNameDateUrl} alt="Photo with Name & Date" style={{ maxHeight: '270px', objectFit: 'contain' }} />
                    </div>
                    <a
                      href={outputNameDateUrl}
                      download={`ekta_photo_namedate_${candidateName.toLowerCase().replace(/\s+/g, '_')}.jpg`}
                      className="btn-primary"
                      style={{ padding: '10px 24px', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                      <i className="fa-solid fa-download"></i> Download Passport Photo
                    </a>
                  </>
                ) : (
                  <div style={{ color: 'var(--gray-600)', padding: '50px 10px' }}>
                    <i className="fa-solid fa-id-card" style={{ fontSize: '3.5rem', color: 'var(--blue-mid)', marginBottom: '12px', display: 'block' }}></i>
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>Upload passport photo to add Name & Date at bottom</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB: IMAGE RESIZE & KB COMPRESSOR
        ============================================================ */}
        {activeTab === 'resize' && (
          <div style={{
            background: 'var(--white)',
            borderRadius: 'var(--radius)',
            padding: '30px',
            boxShadow: 'var(--shadow-md)',
            border: '1.5px solid var(--blue-pale)',
            maxWidth: '960px',
            margin: '0 auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--blue-pale)', color: 'var(--blue-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                <i className="fa-solid fa-compress"></i>
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-head)', color: 'var(--blue-deep)', fontSize: '1.4rem', margin: 0 }}>
                  Image Resize &amp; KB Compressor
                </h2>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.88rem', margin: 0 }}>
                  Resize photo &amp; signature to exact KB limit (20KB - 50KB) for SSC, BPSC, Police, Railway &amp; Court exams.
                </p>
              </div>
            </div>

            {/* Presets */}
            <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Quick Presets:</span>
              <button
                type="button"
                onClick={() => applyPreset(350, 450, 50)}
                style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid var(--blue-mid)', background: 'var(--blue-pale)', color: 'var(--blue-deep)', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 700 }}
              >
                📷 Passport Photo (350×450 px, 20–50 KB)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(200, 100, 20)}
                style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid var(--blue-mid)', background: 'var(--blue-pale)', color: 'var(--blue-deep)', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 700 }}
              >
                ✍️ Signature (200×100 px, 10–20 KB)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(600, 800, 100)}
                style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid var(--blue-mid)', background: 'var(--blue-pale)', color: 'var(--blue-deep)', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 700 }}
              >
                📄 Marksheet / Document (100 KB)
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '26px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px' }}>
                  Upload Image or Signature:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleResizeFile(e.target.files[0])}
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1.5px dashed var(--blue-light)', background: 'var(--gray-100)', cursor: 'pointer', marginBottom: '16px' }}
                />

                {resizeImage && (
                  <div style={{ background: 'var(--gray-100)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.84rem', marginBottom: '14px', border: '1px solid var(--gray-200)' }}>
                    <strong>Original:</strong> {origSizeKb} KB ({origWidth} × {origHeight} px)
                  </div>
                )}

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.88rem' }}>
                    <span style={{ fontWeight: 700 }}>Target File Size (KB):</span>
                    <span style={{ fontWeight: 800, color: 'var(--orange-dark)' }}>Under {targetKb} KB</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={500}
                    step={5}
                    value={targetKb}
                    onChange={(e) => setTargetKb(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--orange)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--gray-600)' }}>
                    <span>10 KB</span>
                    <span>100 KB</span>
                    <span>500 KB</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Width (px):</label>
                    <input
                      type="number"
                      value={targetWidth}
                      onChange={(e) => setTargetWidth(Number(e.target.value))}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1.5px solid var(--gray-200)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Height (px):</label>
                    <input
                      type="number"
                      value={targetHeight}
                      onChange={(e) => setTargetHeight(Number(e.target.value))}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1.5px solid var(--gray-200)' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Output Format:</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as any)}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1.5px solid var(--gray-200)', background: 'var(--white)' }}
                  >
                    <option value="image/jpeg">JPEG / JPG (Best for Forms &amp; Smaller KB)</option>
                    <option value="image/png">PNG (Lossless)</option>
                  </select>
                </div>
              </div>

              {/* Preview */}
              <div style={{ textAlign: 'center', background: 'var(--gray-100)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {resizedDataUrl ? (
                  <>
                    <div style={{ maxHeight: '250px', overflow: 'hidden', borderRadius: '8px', border: '1px solid var(--gray-200)', marginBottom: '12px' }}>
                      <img src={resizedDataUrl} alt="Resized Preview" style={{ maxHeight: '250px', objectFit: 'contain' }} />
                    </div>
                    <div style={{ background: 'var(--white)', padding: '8px 16px', borderRadius: '99px', fontSize: '0.88rem', fontWeight: 700, color: 'var(--blue-deep)', marginBottom: '16px', border: '1px solid var(--blue-pale)' }}>
                      Output Size: <span style={{ color: 'var(--orange)' }}>{resizedSizeKb} KB</span> ({targetWidth} × {targetHeight} px)
                    </div>
                    <a
                      href={resizedDataUrl}
                      download={`resized_${targetKb}kb_${origFileName}`}
                      className="btn-primary"
                      style={{ padding: '10px 24px', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                      <i className="fa-solid fa-download"></i> Download Resized Image
                    </a>
                  </>
                ) : (
                  <div style={{ color: 'var(--gray-600)', padding: '50px 10px' }}>
                    <i className="fa-solid fa-image" style={{ fontSize: '3.5rem', color: 'var(--blue-light)', marginBottom: '12px', display: 'block' }}></i>
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>Upload an image to resize and compress</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
