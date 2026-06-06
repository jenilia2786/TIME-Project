import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Cpu, Heart, Scale, Shield, Landmark, BookOpen,
  FlaskConical, Star, Calendar, AlertCircle, ChevronDown,
  ExternalLink, Zap, Target, Clock, Globe, TrendingUp, Users, X, Search, Filter, ArrowRight, ChevronLeft
} from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import useThemeStore from '../store/useThemeStore'
import useStudentStore from '../store/useStudentStore'
import OnboardingPopup from '../components/ui/OnboardingPopup'

const EXAMS = [
  {
    id: 'jee-main',
    name: 'JEE Main',
    fullName: 'Joint Entrance Examination - Main',
    category: 'Engineering',
    icon: Cpu,
    emoji: '⚙️',
    gradient: 'from-teal-500 to-cyan-500',
    glow: 'rgba(20,184,166,0.3)',
    eligibility: '12th PCM with min 75% (or top 20 percentile)',
    examDate: 'Jan & Apr (Two sessions)',
    difficulty: 'Hard',
    difficultyColor: 'text-rose-600 bg-rose-50 border-rose-100',
    scope: 'Gateway to NITs, IIITs, CFTIs, and state engineering colleges',
    subjects: ['Physics', 'Chemistry', 'Maths'],
    prep: [
      'NCERT books are the backbone — master them thoroughly',
      'Solve previous 10 years papers — patterns are predictable',
      'Focus on Calculus, Mechanics, and Organic Chemistry',
      'Attempt full mock tests under timed conditions monthly',
      'Use revision notes and formula sheets for quick review',
    ],
    applicants: '12 Lakh+',
    seats: '31,000+',
    tags: ['NIT', 'IIT Feeder', 'All India'],
  },
  {
    id: 'jee-advanced',
    name: 'JEE Advanced',
    fullName: 'Joint Entrance Examination - Advanced',
    category: 'Engineering',
    icon: Cpu,
    emoji: '🧠',
    gradient: 'from-violet-500 to-purple-600',
    glow: 'rgba(139,92,246,0.3)',
    eligibility: 'Top 2.5 Lakh JEE Main qualifiers + 75% in 12th',
    examDate: 'May (After JEE Main)',
    difficulty: 'Very Hard',
    difficultyColor: 'text-rose-600 bg-rose-50 border-rose-100',
    scope: 'Admission to 23 IITs across India',
    subjects: ['Physics', 'Chemistry', 'Maths'],
    prep: [
      'Deep conceptual understanding is non-negotiable',
      'Solve HC Verma, IE Irodov for Physics',
      'Master organic reaction mechanisms for Chemistry',
      'Practice complex multi-step Maths problems daily',
      'Attempt 5+ full-length advanced mock tests',
    ],
    applicants: '2.5 Lakh',
    seats: '16,000+',
    tags: ['IIT', 'Prestigious', 'Elite'],
  },
  {
    id: 'tnea',
    name: 'TNEA',
    fullName: 'Tamil Nadu Engineering Admissions',
    category: 'Engineering',
    icon: Landmark,
    emoji: '🏛️',
    gradient: 'from-brand-500 to-cyan-500',
    glow: 'rgba(20,184,166,0.3)',
    eligibility: '12th PCM - Cutoff based (Marks-based, no entrance exam)',
    examDate: 'June - August (Counselling)',
    difficulty: 'Moderate',
    difficultyColor: 'text-amber-600 bg-amber-50 border-amber-100',
    scope: 'Admission to 578+ Engineering colleges in Tamil Nadu',
    subjects: ['Physics', 'Chemistry', 'Maths'],
    prep: [
      'Focus on maximizing 12th board marks — no entrance exam',
      'Understand cutoff patterns for your community',
      'Research colleges and fill choices strategically',
      'Track previous year cutoffs for target colleges',
      'Prepare documents: community certificate, income certificate',
    ],
    applicants: '2 Lakh+',
    seats: '1.5 Lakh+',
    tags: ['TN State', 'No Exam', 'Marks Based'],
  },
  {
    id: 'bitsat',
    name: 'BITSAT',
    fullName: 'BITS Admission Test',
    category: 'Engineering',
    icon: Cpu,
    emoji: '💻',
    gradient: 'from-sky-500 to-blue-600',
    glow: 'rgba(14,165,233,0.3)',
    eligibility: '12th PCM with min 75% — BITSAT Score',
    examDate: 'May - June',
    difficulty: 'Hard',
    difficultyColor: 'text-rose-600 bg-rose-50 border-rose-100',
    scope: 'BITS Pilani, Goa, and Hyderabad campuses',
    subjects: ['Physics', 'Chemistry', 'Maths', 'English', 'Logical Reasoning'],
    prep: [
      'Speed and accuracy are crucial — 150 questions in 180 mins',
      'NCERT + additional problems for Physics & Chemistry',
      'Mental Math drills for Logical Reasoning section',
      'Practice English vocabulary and reading comprehension',
      'Solve BITSAT previous papers and mock series',
    ],
    applicants: '3 Lakh',
    seats: '2,500+',
    tags: ['BITS', 'Private Elite', 'Computer Science'],
  },
  {
    id: 'viteee',
    name: 'VITEEE',
    fullName: 'VIT Engineering Entrance Exam',
    category: 'Engineering',
    icon: Cpu,
    emoji: '🔬',
    gradient: 'from-emerald-500 to-teal-500',
    glow: 'rgba(16,185,129,0.3)',
    eligibility: '12th PCM/PCMB with min 60%',
    examDate: 'April',
    difficulty: 'Moderate',
    difficultyColor: 'text-amber-600 bg-amber-50 border-amber-100',
    scope: 'VIT Vellore, Chennai, Bhopal, AP campuses',
    subjects: ['Physics', 'Chemistry', 'Maths/Biology', 'Aptitude', 'English'],
    prep: [
      'Focus on speed — 125 questions in 150 minutes',
      'NCERT standard for all subjects',
      'Strong emphasis on Aptitude and English sections',
      'VIT specific mock tests available online',
      'CSE branches have very high competition',
    ],
    applicants: '2.5 Lakh',
    seats: '8,000+',
    tags: ['VIT', 'Vellore', 'Top Private'],
  },
  {
    id: 'neet',
    name: 'NEET UG',
    fullName: 'National Eligibility cum Entrance Test',
    category: 'Medical',
    icon: Heart,
    emoji: '🏥',
    gradient: 'from-rose-500 to-pink-500',
    glow: 'rgba(244,63,94,0.3)',
    eligibility: '12th PCB with min 50% (40% for reserved categories)',
    examDate: 'May',
    difficulty: 'Very Hard',
    difficultyColor: 'text-rose-600 bg-rose-50 border-rose-100',
    scope: 'MBBS, BDS, BAMS, BHMS, BUMS in all Indian colleges',
    subjects: ['Physics', 'Chemistry', 'Biology (Botany + Zoology)'],
    prep: [
      'NCERT Biology is the bible — read every word twice',
      'Focus on Organic Chemistry and Human Physiology',
      'Master 3,000+ Biology concepts systematically',
      'Attempt at least 10,000 practice MCQs',
      'Full mock tests weekly in the last 3 months',
    ],
    applicants: '20 Lakh+',
    seats: '1 Lakh+',
    tags: ['MBBS', 'Medical', 'All India'],
  },
  {
    id: 'clat',
    name: 'CLAT',
    fullName: 'Common Law Admission Test',
    category: 'Law',
    icon: Scale,
    emoji: '⚖️',
    gradient: 'from-indigo-500 to-blue-600',
    glow: 'rgba(99,102,241,0.3)',
    eligibility: '12th any stream with min 45%',
    examDate: 'December',
    difficulty: 'Hard',
    difficultyColor: 'text-rose-600 bg-rose-50 border-rose-100',
    scope: '24 National Law Universities (NLUs) across India',
    subjects: ['English', 'Current Affairs', 'Legal Reasoning', 'Logical Reasoning', 'Quantitative Techniques'],
    prep: [
      'Read The Hindu daily for current affairs',
      'Practice Legal Reasoning through sample questions',
      'Build strong vocabulary and reading comprehension',
      'Solve Logical Reasoning puzzles and series daily',
      'Attempt comprehensive mock tests regularly',
    ],
    applicants: '70,000+',
    seats: '3,000+',
    tags: ['NLU', 'Law', '5-Year LLB'],
  },
  {
    id: 'nda',
    name: 'NDA',
    fullName: 'National Defence Academy Exam',
    category: 'Defence',
    icon: Shield,
    emoji: '🛡️',
    gradient: 'from-slate-600 to-slate-800',
    glow: 'rgba(71,85,105,0.3)',
    eligibility: '12th PCM (for Army/Navy/Air Force), any stream for Army',
    examDate: 'April & September (Twice a year)',
    difficulty: 'Hard',
    difficultyColor: 'text-rose-600 bg-rose-50 border-rose-100',
    scope: 'Indian Army, Navy, and Air Force as commissioned officers',
    subjects: ['Maths', 'General Ability (English + GK + Science)'],
    prep: [
      'Strong foundation in 10th/12th level Mathematics',
      'Current affairs and Science concepts are key for GAT',
      'Physical fitness training is mandatory alongside academics',
      'Personality development for SSB Interview round',
      'Previous year paper analysis is extremely helpful',
    ],
    applicants: '5 Lakh+',
    seats: '400+',
    tags: ['Army', 'Navy', 'Air Force', 'Defence'],
  },
  {
    id: 'nata',
    name: 'NATA',
    fullName: 'National Aptitude Test in Architecture',
    category: 'Architecture',
    icon: Cpu,
    emoji: '🏗️',
    gradient: 'from-amber-500 to-orange-500',
    glow: 'rgba(245,158,11,0.3)',
    eligibility: '12th PCM with min 50% + Drawing aptitude',
    examDate: 'Multiple sessions (Feb - July)',
    difficulty: 'Moderate',
    difficultyColor: 'text-amber-600 bg-amber-50 border-amber-100',
    scope: 'B.Arch admission in architecture colleges across India',
    subjects: ['Drawing Test', 'PCM (Maths)', 'General Aptitude'],
    prep: [
      'Practice 2D and 3D drawing daily for the drawing test',
      'Build spatial visualization and perspective drawing skills',
      'Revise Maths (Coordinate Geometry, Calculus)',
      'Study famous architectural works and designs',
      'Solve NATA previous year drawing questions',
    ],
    applicants: '60,000+',
    seats: '40,000+',
    tags: ['Architecture', 'B.Arch', 'Design'],
  },
  {
    id: 'cuet',
    name: 'CUET UG',
    fullName: 'Common University Entrance Test',
    category: 'General',
    icon: BookOpen,
    emoji: '📚',
    gradient: 'from-emerald-500 to-teal-500',
    glow: 'rgba(16,185,129,0.3)',
    eligibility: '12th any stream',
    examDate: 'May - June',
    difficulty: 'Moderate',
    difficultyColor: 'text-amber-600 bg-amber-50 border-amber-100',
    scope: '260+ Central and participating Universities in India',
    subjects: ['Domain-specific subjects', 'Language', 'General Test'],
    prep: [
      'NCERT for domain subjects (relevant to chosen stream)',
      'Language proficiency in English/Hindi',
      'General Aptitude test preparation needed',
      'University of Delhi and JNU admission possible',
      'Multiple subject choices available based on stream',
    ],
    applicants: '14 Lakh+',
    seats: '2 Lakh+',
    tags: ['Central Universities', 'DU', 'JNU', 'BHU'],
  },
  {
    id: 'srmjeee',
    name: 'SRMJEEE',
    fullName: 'SRM Joint Engineering Entrance Exam',
    category: 'Engineering',
    icon: Cpu,
    emoji: '🔭',
    gradient: 'from-pink-500 to-rose-500',
    glow: 'rgba(236,72,153,0.3)',
    eligibility: '12th PCM with min 60%',
    examDate: 'April',
    difficulty: 'Moderate',
    difficultyColor: 'text-amber-600 bg-amber-50 border-amber-100',
    scope: 'SRM Universities across India (Chennai, Delhi-NCR, Amaravati, Sikkim)',
    subjects: ['Physics', 'Chemistry', 'Maths/Biology'],
    prep: [
      'NCERT standard topics cover 80% of syllabus',
      'Practice SRM-specific mock tests available on portal',
      'Speed matters — 125 questions in 2.5 hours',
      'CSE and ECE branches highly competitive',
      'Scholarship criteria based on rank',
    ],
    applicants: '2 Lakh',
    seats: '10,000+',
    tags: ['SRM', 'Chennai', 'Top Private'],
  },
  {
    id: 'uceed',
    name: 'UCEED',
    fullName: 'Undergraduate Common Entrance Examination for Design',
    category: 'Design',
    icon: Target,
    emoji: '🎨',
    gradient: 'from-pink-500 to-rose-500',
    glow: 'rgba(236,72,153,0.3)',
    eligibility: '12th any stream',
    examDate: 'January',
    difficulty: 'Hard',
    difficultyColor: 'text-rose-600 bg-rose-50 border-rose-100',
    scope: 'B.Des at IIT Bombay, IIT Guwahati, IIT Hyderabad, IIITDM',
    subjects: ['Visualization', 'Observation & Design', 'Environmental & Social Awareness', 'Analytical & Logical Reasoning', 'Language', 'Design Thinking'],
    prep: [
      'Practice sketching and rapid ideation daily',
      'Develop strong observational skills',
      'Solve previous UCEED papers to understand the pattern',
      'Work on visual puzzles and logical reasoning',
    ],
    applicants: '15,000+',
    seats: '200+',
    tags: ['IIT', 'B.Des', 'Design'],
  },
  {
    id: 'nid-dat',
    name: 'NID DAT',
    fullName: 'National Institute of Design - Design Aptitude Test',
    category: 'Design',
    icon: Target,
    emoji: '🖌️',
    gradient: 'from-fuchsia-500 to-purple-500',
    glow: 'rgba(217,70,239,0.3)',
    eligibility: '12th any stream',
    examDate: 'December (Prelims)',
    difficulty: 'Hard',
    difficultyColor: 'text-rose-600 bg-rose-50 border-rose-100',
    scope: 'B.Des at NID campuses across India',
    subjects: ['Visual Design', 'Thematic Color Arrangement', 'Subjects of Design', 'Memory Drawing', 'Proportions'],
    prep: [
      'Focus heavily on creative thinking and originality',
      'Master the basics of drawing and shading',
      'Prepare a strong portfolio for the Mains stage',
      'Stay updated on current trends in design and art',
    ],
    applicants: '20,000+',
    seats: '425+',
    tags: ['NID', 'Design', 'Top Institute'],
  },
  {
    id: 'ailet',
    name: 'AILET',
    fullName: 'All India Law Entrance Test',
    category: 'Law',
    icon: Scale,
    emoji: '📜',
    gradient: 'from-blue-600 to-indigo-700',
    glow: 'rgba(37,99,235,0.3)',
    eligibility: '12th any stream with min 45%',
    examDate: 'December',
    difficulty: 'Very Hard',
    difficultyColor: 'text-rose-600 bg-rose-50 border-rose-100',
    scope: 'NLU Delhi exclusively',
    subjects: ['English', 'Logical Reasoning', 'General Knowledge'],
    prep: [
      'Focus on reading speed and comprehension (very lengthy paper)',
      'Master critical reasoning and logic',
      'Extensive vocabulary building',
      'Stay updated with daily current affairs and legal news',
    ],
    applicants: '20,000+',
    seats: '110+',
    tags: ['NLU Delhi', 'Law', 'Elite'],
  },
  {
    id: 'ipmat',
    name: 'IPMAT',
    fullName: 'Integrated Programme in Management Aptitude Test',
    category: 'Management',
    icon: Target,
    emoji: '💼',
    gradient: 'from-orange-500 to-amber-500',
    glow: 'rgba(249,115,22,0.3)',
    eligibility: '12th any stream with min 60%',
    examDate: 'May - June',
    difficulty: 'Hard',
    difficultyColor: 'text-rose-600 bg-rose-50 border-rose-100',
    scope: '5-year Integrated BBA+MBA at IIM Indore, IIM Rohtak, etc.',
    subjects: ['Quantitative Aptitude', 'Verbal Ability'],
    prep: [
      'Strong conceptual clarity in Maths (up to 10th/12th level)',
      'Extensive vocabulary and grammar practice',
      'Speed-solving techniques for quant section',
      'Prepare for the personal interview round early',
    ],
    applicants: '40,000+',
    seats: '150+',
    tags: ['IIM', 'BBA+MBA', 'Management'],
  },
  {
    id: 'nchmct-jee',
    name: 'NCHMCT JEE',
    fullName: 'National Council for Hotel Management Joint Entrance Exam',
    category: 'Hotel Management',
    icon: Target,
    emoji: '🏨',
    gradient: 'from-yellow-500 to-orange-400',
    glow: 'rgba(234,179,8,0.3)',
    eligibility: '12th any stream with English as a subject',
    examDate: 'May',
    difficulty: 'Moderate',
    difficultyColor: 'text-amber-600 bg-amber-50 border-amber-100',
    scope: 'B.Sc Hospitality and Hotel Administration in IHMs',
    subjects: ['Numerical Ability', 'Reasoning', 'General Knowledge', 'English', 'Aptitude for Service Sector'],
    prep: [
      'Focus strongly on the Service Sector Aptitude section',
      'Brush up basic mathematics and English grammar',
      'Stay aware of current affairs related to tourism and hospitality',
    ],
    applicants: '30,000+',
    seats: '12,000+',
    tags: ['IHM', 'Hospitality', 'Hotel Management'],
  },
  {
    id: 'icar-aieea',
    name: 'ICAR AIEEA (via CUET)',
    fullName: 'All India Entrance Examination for Admission',
    category: 'Agriculture',
    icon: Target,
    emoji: '🌾',
    gradient: 'from-green-500 to-emerald-600',
    glow: 'rgba(34,197,94,0.3)',
    eligibility: '12th Science (PCB/PCM/PCA)',
    examDate: 'May - June (Part of CUET)',
    difficulty: 'Moderate',
    difficultyColor: 'text-amber-600 bg-amber-50 border-amber-100',
    scope: 'B.Sc Agriculture, Horticulture, Forestry in ICAR affiliated colleges',
    subjects: ['Physics', 'Chemistry', 'Biology/Maths/Agriculture'],
    prep: [
      'NCERT books are sufficient for Physics, Chemistry, Biology',
      'If opting for Agriculture subject, use standard textbooks',
      'Practice previous ICAR/CUET domain questions',
    ],
    applicants: '1 Lakh+',
    seats: '3,000+',
    tags: ['Agriculture', 'ICAR', 'B.Sc Ag'],
  },
]

const CATEGORIES = ['All', 'Engineering', 'Medical', 'Law', 'Design', 'Defence', 'Architecture', 'Management', 'Hotel Management', 'Agriculture', 'General']

const DIFFICULTY_COLORS = {
  'Easy': 'text-emerald-600 bg-emerald-50 border border-emerald-100',
  'Moderate': 'text-amber-600 bg-amber-50 border border-amber-100',
  'Hard': 'text-rose-600 bg-rose-50 border border-rose-100',
  'Very Hard': 'text-rose-700 bg-rose-100 border border-rose-200',
}

/* ── Exam Card ───────────────────────────────────────────── */
function ExamCard({ exam, delay, onSelect, onSave, saved }) {
  const Icon = exam.icon
  const timerRef = useRef(null)

  const handleClick = (e) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
      onSave()
    } else {
      timerRef.current = setTimeout(() => {
        timerRef.current = null
        onSelect(exam)
      }, 250)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay, type: 'spring', bounce: 0.3 }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="relative w-full aspect-[4/5] sm:aspect-auto sm:h-[300px] rounded-[2rem] overflow-hidden cursor-pointer group"
    >
      {/* Rotating glowing border layer */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        className="absolute -inset-[100%] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: `conic-gradient(from 0deg, transparent 70%, ${exam.glow.replace('0.3', '1')} 100%)`
        }}
      />
      {/* Static subtle border when not hovering */}
      <div className="absolute inset-0 border border-neutral-200 dark:border-neutral-800 rounded-[2rem] group-hover:border-transparent transition-colors z-10" />

      {/* Inner Responsive Card */}
      <div className="absolute inset-[2px] bg-white dark:bg-[#0A0A0A] rounded-[1.9rem] p-6 flex flex-col justify-between overflow-hidden z-20">
        
        {/* Wishlist indicator */}
        <motion.div
          key={`heart-${saved}`}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={`absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center border shadow-sm transition-all z-30 ${
            saved ? 'bg-rose-50 border-rose-200' : 'bg-white border-neutral-200'
          }`}
          onClick={(e) => {
            e.stopPropagation()
            if (timerRef.current) {
              clearTimeout(timerRef.current)
              timerRef.current = null
            }
            onSave()
          }}
        >
          <Heart size={14} className={saved ? 'text-rose-500 fill-rose-500' : 'text-neutral-300'} />
        </motion.div>

        {/* Animated Twinkling Stars */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute opacity-0 mix-blend-overlay dark:mix-blend-screen"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                color: exam.glow.replace('0.3', '0.8'), // Extract base color
              }}
              animate={{
                opacity: [0, 0.4, 0],
                scale: [0.5, 1, 0.5],
                rotate: [0, 45, 90],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
            >
              <Star size={3 + Math.random() * 4} fill="currentColor" />
            </motion.div>
          ))}
        </div>

        {/* Top Section */}
        <div className="relative z-10">
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 bg-gradient-to-br ${exam.gradient} shadow-sm`}>
             <Icon size={24} className="text-white" />
           </div>
           <h3 className="text-xl font-black text-neutral-900 dark:text-white mb-2 leading-tight">{exam.name}</h3>
           <p className="text-neutral-500 dark:text-neutral-400 text-xs font-medium leading-relaxed line-clamp-3">{exam.fullName}</p>
        </div>

        {/* Bottom Section */}
        <div className="space-y-3 mt-4 relative z-10">
          <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-[11px] font-bold">
            <Calendar size={12} /> {exam.examDate}
          </div>
          <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-[11px] font-bold">
            <Users size={12} /> {exam.applicants}
          </div>
          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-white`}>
              {exam.difficulty}
            </span>
            <span className={`text-[10px] font-bold text-white px-3 py-1 rounded-full bg-gradient-to-r ${exam.gradient} shadow-sm`}>
              View Details
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Exam Detail Modal ───────────────────────────────────── */
function ExamModal({ exam, onClose, onSave, saved }) {
  const Icon = exam.icon
  const scrollRef = useRef(null)
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false)

  useEffect(() => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight } = scrollRef.current
      if (scrollHeight <= clientHeight) {
        setIsScrolledToBottom(true)
      }
    }
  }, [])

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    setIsScrolledToBottom(scrollHeight - scrollTop <= clientHeight + 20)
  }

  const modalContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 pointer-events-none"
    >
      <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-md pointer-events-none" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.92, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 30 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        className="relative z-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden flex flex-col max-w-2xl w-full max-h-[85vh] pointer-events-auto shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${exam.gradient} p-7 relative overflow-hidden shrink-0`}>
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onSave(); }} 
              className="w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors"
            >
              <Heart size={14} className={saved ? 'fill-rose-500 text-rose-500' : 'text-white'} />
            </button>
            <button 
              onClick={onClose} 
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-black/10 hover:bg-black/20 text-white font-bold text-sm transition-colors"
            >
              <ChevronLeft size={16} /> Go Back
            </button>
          </div>
          <motion.div
            className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white opacity-10"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <div className="relative z-10">
            <Icon size={42} className="text-white mb-4" />
            <h2 className="text-2xl font-black text-white mb-1">{exam.name}</h2>
            <p className="text-white/70 text-sm mb-3">{exam.fullName}</p>
            <div className="flex flex-wrap gap-2">
              {exam.tags.map((tag) => (
                <span key={tag} className="text-[10px] font-black text-white bg-white/20 px-2.5 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="p-7 space-y-6 overflow-y-auto scrollbar-hide relative flex-1 pb-16" 
          data-lenis-prevent="true"
        >
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Applicants', value: exam.applicants, icon: Globe },
              { label: 'Available Seats', value: exam.seats, icon: Target },
              { label: 'Difficulty', value: exam.difficulty, icon: Zap },
            ].map((stat) => {
              const SIcon = stat.icon
              return (
                <div key={stat.label} className="text-center p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <SIcon size={14} className="text-brand-500 mx-auto mb-1" />
                  <p className="text-xs font-black text-neutral-900">{stat.value}</p>
                  <p className="text-[9px] text-neutral-400 font-medium">{stat.label}</p>
                </div>
              )
            })}
          </div>

          {/* Eligibility */}
          <div>
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Eligibility</p>
            <div className="flex items-start gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <AlertCircle size={13} className="text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-700 font-medium">{exam.eligibility}</p>
            </div>
          </div>

          {/* Exam Date */}
          <div>
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Exam Date / Schedule</p>
            <div className="flex items-center gap-2 p-3 bg-sky-50 rounded-xl border border-sky-100">
              <Calendar size={13} className="text-sky-500 shrink-0" />
              <p className="text-sm text-sky-700 font-medium">{exam.examDate}</p>
            </div>
          </div>

          {/* Subjects */}
          <div>
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3">Subjects / Sections</p>
            <div className="flex flex-wrap gap-2">
              {exam.subjects.map((s) => (
                <span key={s} className="text-xs font-bold px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-700">{s}</span>
              ))}
            </div>
          </div>

          {/* Scope */}
          <div>
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Scope</p>
            <p className="text-sm text-neutral-600 leading-relaxed">{exam.scope}</p>
          </div>

          {/* Preparation */}
          <div>
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3">Preparation Guidance</p>
            <div className="space-y-2">
              {exam.prep.map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-2.5 p-3 bg-neutral-50 rounded-xl border border-neutral-100"
                >
                  <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-brand-400 to-cyan-400 flex items-center justify-center text-[9px] font-black text-white shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-xs text-neutral-600 font-medium leading-relaxed">{tip}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className={`w-full py-3.5 rounded-2xl bg-gradient-to-r ${exam.gradient} text-white font-bold text-sm shadow-lg`}
          >
            Got It!
          </motion.button>
        </div>

        {/* Scroll Indicator */}
        <AnimatePresence>
          {!isScrolledToBottom && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 dark:from-neutral-900 dark:via-neutral-900/80 to-transparent pointer-events-none flex items-end justify-center pb-4 z-20"
            >
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest animate-bounce">
                Scroll for more <ChevronDown size={12} />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
  return createPortal(modalContent, document.body)
}

/* ── Top Domain Selector ──────────────────────────────── */
function DomainSelector({ categories, activeCategory, onChange }) {
  return (
    <div className="flex pointer-events-none py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-neutral-200 dark:border-slate-800 p-2.5 rounded-2xl shadow-sm pointer-events-auto flex flex-wrap gap-2 max-w-full overflow-x-auto scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`px-4 py-2.5 rounded-xl text-[11px] font-black tracking-wide uppercase transition-all whitespace-nowrap shrink-0 ${
              activeCategory === cat 
              ? 'bg-brand-600 dark:bg-white text-white dark:text-neutral-900 shadow-md scale-[1.02]' 
                : 'bg-neutral-100/80 dark:bg-slate-800/80 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-slate-700 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── Main Exams Page ─────────────────────────────────────── */
export default function Exams() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedExam, setSelectedExam] = useState(null)
  const [showRelevantOnly, setShowRelevantOnly] = useState(false)
  const [savedExams, setSavedExams] = useState([])
  const [saveToast, setSaveToast] = useState('')
  const collapsed = useThemeStore((s) => s.sidebarCollapsed)
  const { student, wishlistExams, addToWishlist, removeFromWishlist } = useStudentStore()
  const studentStandard = student?.standard || ''

  const handleSave = (exam) => {
    const isAlreadySaved = wishlistExams.find(w => w.id === exam.id)
    if (isAlreadySaved) {
      removeFromWishlist('Exams', exam.id)
    } else {
      addToWishlist('Exams', {
        id: exam.id,
        name: exam.name,
        fullName: exam.fullName,
        category: exam.category,
      })
    }
  }

  const getStudentStage = (standard) => {
    const s = (standard || '').toLowerCase()
    if (s.includes('10') || s.includes('sslc')) return '10th'
    if (s.includes('11') || s.includes('12') || s.includes('hsc') || s.includes('+2')) return '12th'
    if (s.includes('ug') || s.includes('b.e') || s.includes('b.tech') || s.includes('degree')) return 'UG'
    if (s.includes('pg') || s.includes('m.tech') || s.includes('mba')) return 'PG'
    return 'all'
  }

  const stage = getStudentStage(studentStandard)

  // Stage-to-category mapping
  const getRelevantCategories = (stage) => {
    if (stage === '10th') return ['Defence'] // NDA can be applied after 10th in some forms
    if (stage === '12th') return ['Engineering', 'Medical', 'Law', 'Architecture', 'Design', 'Management', 'Defence', 'General']
    if (stage === 'UG') return ['Management', 'General', 'Law']
    return CATEGORIES
  }

  const relevantCategories = getRelevantCategories(stage)

  const filtered = EXAMS.filter(e => {
    if (activeCategory !== 'All' && e.category !== activeCategory) return false
    if (showRelevantOnly && stage !== 'all' && !relevantCategories.includes(e.category)) return false
    return true
  })


  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-6 pb-40">
        <OnboardingPopup
          pageKey="exams"
          title="Explore Entrance Exams"
          message="Double tap an exam card to save it to your Exams Wishlist."
          icon="📝"
        />
        {/* Top Bar Container */}
        <div className="flex flex-col gap-6 mb-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col gap-1 max-w-7xl mx-auto w-full transition-all duration-300`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shrink-0"
                style={{ boxShadow: '0 4px 15px rgba(139,92,246,0.4)' }}>
                <FlaskConical size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-neutral-900 dark:text-neutral-100" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Exams
                </h1>
                <p className="text-sm text-neutral-500">All entrance exams after 10th and 12th in one place</p>
              </div>
            </div>
          </motion.div>

          {/* Domain Selector + Relevant toggle */}
          <div className="max-w-7xl mx-auto w-full flex flex-col gap-2">
            <DomainSelector categories={CATEGORIES} activeCategory={activeCategory} onChange={setActiveCategory} />
            {stage !== 'all' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowRelevantOnly(v => !v)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black transition-all border ${showRelevantOnly ? 'bg-brand-600 text-white border-brand-600' : 'bg-white dark:bg-neutral-800 text-brand-600 border-brand-200 hover:bg-brand-50'}`}
                >
                  <Zap size={11} />
                  {showRelevantOnly ? `Showing exams for ${stage} students` : `Show relevant for ${stage} students`}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-6 p-4 bg-gradient-to-r from-brand-50 to-violet-50 rounded-2xl border border-brand-100"
        >
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-brand-500" />
            <span className="text-xs font-bold text-brand-700">Showing {filtered.length} exams</span>
          </div>
          <div className="h-4 w-px bg-brand-200" />
          <span className="text-xs text-brand-600 font-medium">Click any exam card for full details & preparation guide</span>

        </motion.div>

        {/* Exams Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((exam, i) => (
              <ExamCard 
                key={exam.id} 
                exam={exam} 
                delay={i * 0.04} 
                onSelect={setSelectedExam} 
                onSave={() => handleSave(exam)}
                saved={!!(wishlistExams && wishlistExams.find(w => w.id === exam.id))}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedExam && (
          <ExamModal 
            exam={selectedExam} 
            onClose={() => setSelectedExam(null)} 
            onSave={() => handleSave(selectedExam)}
            saved={!!(wishlistExams && wishlistExams.find(w => w.id === selectedExam.id))}
          />
        )}
      </AnimatePresence>
    </PageWrapper>
  )
}
