import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import {
  Cpu, Heart, BookOpen, Scale, PenTool, Briefcase,
  CheckCircle2, Circle, ArrowDown, ChevronRight,
  MapPin, Lightbulb, Target, GraduationCap, ArrowRight, Map,
  BookMarked, FlaskConical, TrendingUp, Star, Clock
} from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import useThemeStore from '../store/useThemeStore'
import useStudentStore from '../store/useStudentStore'

/* ─────────────────────────────────────────────────────────
   CAREER PATHS DATA
───────────────────────────────────────────────────────── */
const PATHS = [
  {
    id: 'engineering',
    title: 'Engineering',
    icon: Cpu,
    color: '#0ea5e9',
    accent: '#0284c7',
    bgFrom: '#f0f9ff',
    bgTo: '#e0f2fe',
    borderColor: '#bae6fd',
    tagline: 'Build the world of tomorrow.',
    desc: 'From classroom to code — your journey through engineering, technology, and innovation.',
    chapters: [
      {
        chapter: '01',
        label: '10th Standard',
        sublabel: 'Foundation Phase',
        desc: 'Your academic journey begins here. A strong foundation in Science and Mathematics opens every engineering door ahead.',
        status: 'done',
        icon: BookMarked,
        keyFacts: ['Focus on Maths & Science', 'Explore coding basics', 'Build logical thinking'],
        color: '#0ea5e9',
      },
      {
        chapter: '02',
        label: '11th & 12th — PCM',
        sublabel: 'Core Building Phase',
        desc: 'Physics, Chemistry, and Mathematics become your core subjects. Simultaneously, preparation for competitive entrance exams begins.',
        status: 'done',
        icon: FlaskConical,
        keyFacts: ['PCM is mandatory', 'JEE / TNEA preparation starts', 'Consistent practice is key'],
        color: '#0284c7',
      },
      {
        chapter: '03',
        label: 'Entrance Examination',
        sublabel: 'Gateway Phase',
        desc: 'TNEA for Tamil Nadu colleges, JEE Main & Advanced for NITs and IITs. This milestone determines your college and specialization.',
        status: 'current',
        icon: Target,
        keyFacts: ['TNEA: Cutoff-based', 'JEE: National level', 'BITSAT / VITEEE: Private elite'],
        color: '#7c3aed',
      },
      {
        chapter: '04',
        label: 'B.E / B.Tech',
        sublabel: 'Undergraduate Phase',
        desc: '4 years of engineering education. Choose your specialization — Computer Science, Mechanical, Civil, Electronics, or beyond.',
        status: 'future',
        icon: GraduationCap,
        keyFacts: ['4-year programme', 'Specialization choice', 'Internships & projects'],
        color: '#0ea5e9',
      },
      {
        chapter: '05',
        label: 'Career or Higher Studies',
        sublabel: 'Launch Phase',
        desc: 'Campus placements, GATE for M.Tech, CAT for MBA, GRE for MS abroad. Multiple pathways diverge here — all leading to excellence.',
        status: 'future',
        icon: TrendingUp,
        keyFacts: ['Campus placements', 'M.Tech via GATE', 'MS/MBA options'],
        color: '#0369a1',
      },
    ],
    actions: ['Complete TNEA application on time', 'Maximize 12th board marks', 'Explore domain specializations early', 'Build a technical portfolio'],
  },
  {
    id: 'medical',
    title: 'Medicine',
    icon: Heart,
    color: '#e11d48',
    accent: '#be123c',
    bgFrom: '#fff1f2',
    bgTo: '#ffe4e6',
    borderColor: '#fecdd3',
    tagline: 'Heal. Lead. Transform lives.',
    desc: 'A calling more than a career — the path through medicine demands dedication, compassion, and years of committed learning.',
    chapters: [
      {
        chapter: '01',
        label: '10th Standard',
        sublabel: 'Foundation Phase',
        desc: 'Science and Biology become your foundation. Academic rigor begins early for those aspiring to medicine.',
        status: 'done',
        icon: BookMarked,
        keyFacts: ['Strong in Biology', 'Chemistry fundamentals', 'Disciplined study habits'],
        color: '#e11d48',
      },
      {
        chapter: '02',
        label: '11th & 12th — PCB',
        sublabel: 'Core Building Phase',
        desc: 'Physics, Chemistry, Biology — the holy trinity of medical preparation. NEET coaching alongside board exams is the norm.',
        status: 'done',
        icon: FlaskConical,
        keyFacts: ['PCB is mandatory', 'NEET prep from day one', 'NCERT is the bible'],
        color: '#be123c',
      },
      {
        chapter: '03',
        label: 'NEET UG',
        sublabel: 'Gateway Phase',
        desc: 'The single national gateway to medical education. 720 marks, one shot. This examination shapes the trajectory of your medical career.',
        status: 'current',
        icon: Target,
        keyFacts: ['720 total marks', 'Single national exam', 'Requires 3+ years of prep'],
        color: '#7c3aed',
      },
      {
        chapter: '04',
        label: 'MBBS',
        sublabel: 'Undergraduate Phase',
        desc: '5.5 years of medical education including a mandatory internship. Clinical rotations, hospital postings, and patient care training.',
        status: 'future',
        icon: GraduationCap,
        keyFacts: ['4.5 years academics', '1 year internship', 'Clinical training'],
        color: '#e11d48',
      },
      {
        chapter: '05',
        label: 'PG & Specialization',
        sublabel: 'Mastery Phase',
        desc: 'NEET PG opens doors to MD, MS, and Diploma programmes. Specialization determines your ultimate role — surgeon, cardiologist, radiologist.',
        status: 'future',
        icon: TrendingUp,
        keyFacts: ['MD / MS / DNB', 'Super-specialization (DM/MCh)', '3–6 year residency'],
        color: '#9f1239',
      },
    ],
    actions: ['Master NCERT Biology thoroughly', 'Attempt 10,000+ NEET MCQs', 'Take weekly mock tests', 'Track performance by subject'],
  },
  {
    id: 'commerce',
    title: 'Commerce',
    icon: Briefcase,
    color: '#d97706',
    accent: '#b45309',
    bgFrom: '#fffbeb',
    bgTo: '#fef3c7',
    borderColor: '#fde68a',
    tagline: 'Build businesses. Lead economies.',
    desc: 'From numbers to leadership — the commerce path leads to CA, MBA, banking, and entrepreneurship.',
    chapters: [
      {
        chapter: '01',
        label: '10th Standard',
        sublabel: 'Foundation Phase',
        desc: 'Aptitude for numbers and economics signals the commerce path. Business thinking starts developing naturally.',
        status: 'done',
        icon: BookMarked,
        keyFacts: ['Strong in Maths', 'Analytical thinking', 'Business awareness'],
        color: '#d97706',
      },
      {
        chapter: '02',
        label: '11th & 12th — Commerce',
        sublabel: 'Core Building Phase',
        desc: 'Accountancy, Economics, Business Studies, and Mathematics build the foundation for every commerce career.',
        status: 'future',
        icon: FlaskConical,
        keyFacts: ['Accountancy fundamentals', 'Economic theory', 'Business studies'],
        color: '#b45309',
      },
      {
        chapter: '03',
        label: 'UG Entrance & Enrolment',
        sublabel: 'Gateway Phase',
        desc: 'CUET for central universities, CA Foundation after 12th, or direct BBA/B.Com admission opens multiple pathways simultaneously.',
        status: 'future',
        icon: Target,
        keyFacts: ['CA Foundation option', 'CUET / State CET', 'BBA / B.Com / BMS'],
        color: '#7c3aed',
      },
      {
        chapter: '04',
        label: 'Undergraduate & CA',
        sublabel: 'Professional Phase',
        desc: 'B.Com, BBA, or parallel CA articleship. Three years of building professional and academic credentials simultaneously.',
        status: 'future',
        icon: GraduationCap,
        keyFacts: ['3-year degree', 'CA articleship option', 'Industry internships'],
        color: '#d97706',
      },
      {
        chapter: '05',
        label: 'MBA / CA Final / Leadership',
        sublabel: 'Excellence Phase',
        desc: 'CAT for IIM MBA, CA Final for Chartered Accountancy, or specialized finance programmes. This phase defines your professional stature.',
        status: 'future',
        icon: TrendingUp,
        keyFacts: ['CAT / XAT for MBA', 'CA Final exams', 'CFA / ACCA options'],
        color: '#92400e',
      },
    ],
    actions: ['Register for CA Foundation early', 'Prepare for CUET or BBA entrances', 'Stay updated with financial news', 'Build spreadsheet and data skills'],
  },
  {
    id: 'arts',
    title: 'Arts & Humanities',
    icon: BookOpen,
    color: '#7c3aed',
    accent: '#6d28d9',
    bgFrom: '#f5f3ff',
    bgTo: '#ede9fe',
    borderColor: '#ddd6fe',
    tagline: 'Think critically. Lead boldly.',
    desc: 'Civil services, law, journalism, psychology — the arts path builds the thinkers and leaders society needs most.',
    chapters: [
      {
        chapter: '01',
        label: '10th Standard',
        sublabel: 'Foundation Phase',
        desc: 'Curiosity about society, history, and language marks the beginning. Arts students develop the broadest perspectives.',
        status: 'done',
        icon: BookMarked,
        keyFacts: ['Strong reading habit', 'Analytical writing', 'Social awareness'],
        color: '#7c3aed',
      },
      {
        chapter: '02',
        label: '11th & 12th — Arts',
        sublabel: 'Core Building Phase',
        desc: 'History, Geography, Political Science, Sociology, and Languages form the curriculum. Writing and reasoning are honed every day.',
        status: 'future',
        icon: FlaskConical,
        keyFacts: ['History & Geography', 'Political Science', 'Language mastery'],
        color: '#6d28d9',
      },
      {
        chapter: '03',
        label: 'Entrance & Specialization',
        sublabel: 'Gateway Phase',
        desc: 'CLAT for Law, CUET for central universities, Psychology entrance exams, or Journalism admissions — multiple doors open simultaneously.',
        status: 'future',
        icon: Target,
        keyFacts: ['CLAT for Law', 'CUET for DU/JNU', 'Psychology programmes'],
        color: '#7c3aed',
      },
      {
        chapter: '04',
        label: 'Bachelor\'s Degree',
        sublabel: 'Academic Phase',
        desc: 'BA, LLB, B.Sc Psychology, B.Journalism — three to five years of deep academic immersion and identity formation.',
        status: 'future',
        icon: GraduationCap,
        keyFacts: ['3–5 year degree', 'Research projects', 'Internships & fieldwork'],
        color: '#7c3aed',
      },
      {
        chapter: '05',
        label: 'Civil Services / Professional Career',
        sublabel: 'Impact Phase',
        desc: 'UPSC / TNPSC for IAS/IPS, Bar exam for lawyers, media houses for journalists. The arts graduate becomes a change-maker.',
        status: 'future',
        icon: TrendingUp,
        keyFacts: ['UPSC / TNPSC', 'Bar Council exam', 'M.A / LLM / MBA'],
        color: '#5b21b6',
      },
    ],
    actions: ['Read newspapers daily for UPSC prep', 'Build writing and communication skills', 'Choose specialization thoughtfully', 'Explore research and internship opportunities'],
  },
  {
    id: 'design',
    title: 'Design & Creative',
    icon: PenTool,
    color: '#db2777',
    accent: '#be185d',
    bgFrom: '#fdf2f8',
    bgTo: '#fce7f3',
    borderColor: '#fbcfe8',
    tagline: 'Imagine. Create. Shape experiences.',
    desc: 'Architecture, UI/UX, animation, and visual design — for those who see the world differently and build it better.',
    chapters: [
      {
        chapter: '01',
        label: '10th Standard',
        sublabel: 'Foundation Phase',
        desc: 'Creative instinct and visual curiosity are the first signals. Any academic group can lead to design — what matters is how you see.',
        status: 'done',
        icon: BookMarked,
        keyFacts: ['Drawing & visual arts', 'Creativity and observation', 'Any academic group'],
        color: '#db2777',
      },
      {
        chapter: '02',
        label: '11th & 12th',
        sublabel: 'Core Building Phase',
        desc: 'PCM for Architecture, any stream for Design courses. Portfolio building begins now — every sketch, project, and experiment counts.',
        status: 'future',
        icon: FlaskConical,
        keyFacts: ['PCM for Architecture', 'Portfolio development', 'Learn design tools early'],
        color: '#be185d',
      },
      {
        chapter: '03',
        label: 'Design Entrance Exams',
        sublabel: 'Gateway Phase',
        desc: 'NATA for Architecture, NID/UCEED for design institutes, CEED for postgraduate design. Portfolio reviews determine admission.',
        status: 'future',
        icon: Target,
        keyFacts: ['NATA (Architecture)', 'NID / UCEED', 'Portfolio-based review'],
        color: '#7c3aed',
      },
      {
        chapter: '04',
        label: 'B.Des / B.Arch',
        sublabel: 'Creative Development Phase',
        desc: '4–5 years of immersive design education. Studios, critiques, real-world projects, and mentorship shape your creative voice.',
        status: 'future',
        icon: GraduationCap,
        keyFacts: ['4–5 year programme', 'Studio-based learning', 'Real client projects'],
        color: '#db2777',
      },
      {
        chapter: '05',
        label: 'Professional Design Career',
        sublabel: 'Creation Phase',
        desc: 'UX Designer, Architect, Creative Director, Animator — design professionals shape everything people see, touch, and experience.',
        status: 'future',
        icon: TrendingUp,
        keyFacts: ['UX / UI Design', 'Architecture practice', 'Creative direction'],
        color: '#9d174d',
      },
    ],
    actions: ['Build a design portfolio today', 'Learn Figma and Adobe tools', 'Prepare NATA sketch practice', 'Document every creative project'],
  },
]

/* ─────────────────────────────────────────────────────────
   PATH SELECTOR
───────────────────────────────────────────────────────── */
function PathSelector({ paths, selected, onSelect }) {
  return (
    <div className="flex flex-col w-full transition-all duration-300">
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2">
        <span className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest shrink-0 mr-2">Choose Path:</span>
        {paths.map(p => {
            const Icon = p.icon
            const isSelected = selected === p.id
            return (
              <motion.button
                key={p.id}
                onClick={() => onSelect(p.id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black transition-all whitespace-nowrap border ${
                  isSelected
                    ? 'text-white border-transparent shadow-md'
                    : 'bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
                style={isSelected ? { background: `linear-gradient(135deg, ${p.color}, ${p.accent})` } : {}}
              >
                <Icon size={14} />
                {p.title}
              </motion.button>
            )
          })}
        </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   CHAPTER SCENE — Standard vertical flow
───────────────────────────────────────────────────────── */
function ChapterScene({ chapter, index, path }) {
  const Icon = chapter.icon
  const isDone = chapter.status === 'done'
  const isCurrent = chapter.status === 'current'
  const isFuture = chapter.status === 'future'

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, margin: "-20% 0px -20% 0px" }}
      transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
      className="flex items-center justify-center px-4 w-full py-6 lg:py-8"
    >
      <div className="w-full max-w-2xl relative">
        {/* Decorative connecting line for visual flow (except last) */}
        {index < path.chapters.length - 1 && (
          <div 
            className="absolute left-6 top-[100%] w-px h-24 lg:h-32 -z-10" 
            style={{ background: `linear-gradient(to bottom, ${path.color}40, transparent)` }} 
          />
        )}
        
        {/* Chapter Number */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full border bg-white dark:bg-neutral-900"
            style={{ color: path.color, borderColor: `${path.color}40`, boxShadow: `0 4px 12px ${path.color}15` }}
          >
            Chapter {chapter.chapter}
          </div>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${path.color}30, transparent)` }} />
          {isDone && (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={14} className="text-emerald-500" /> Completed
            </div>
          )}
          {isCurrent && (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
              <Star size={14} className="text-amber-500 fill-amber-400" /> You are here
            </div>
          )}
          {isFuture && (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400">
              <Clock size={14} /> Ahead
            </div>
          )}
        </div>

        {/* Main Card */}
        <div
          className="bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-xl overflow-hidden"
          style={{ boxShadow: `0 20px 60px ${path.color}15, 0 4px 20px rgba(0,0,0,0.06)` }}
        >
          {/* Top accent bar */}
          <div
            className="h-1 w-full"
            style={{ background: `linear-gradient(90deg, ${path.color}, ${path.accent})` }}
          />

          <div className="p-8 md:p-10">
            {/* Icon + Title */}
            <div className="flex items-start gap-5 mb-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-md"
                style={{ background: `linear-gradient(135deg, ${path.color}, ${path.accent})` }}
              >
                <Icon size={26} className="text-white" />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-1">{chapter.sublabel}</p>
                <h2
                  className="text-2xl md:text-3xl font-black text-neutral-900 dark:text-neutral-100 leading-tight"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {chapter.label}
                </h2>
              </div>
            </div>

            {/* Description */}
            <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium mb-8">
              {chapter.desc}
            </p>

            {/* Key Facts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {chapter.keyFacts.map((fact, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 px-4 py-3 rounded-xl border text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                  style={{ borderColor: `${path.color}20`, background: `${path.color}06` }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                    style={{ background: path.color }}
                  />
                  {fact}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────
   PROGRESS SIDEBAR (depth layer indicator)
───────────────────────────────────────────────────────── */
function ProgressSidebar({ chapters, scrollYProgress, path }) {
  return (
    <div className="absolute right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3 pointer-events-none">
      {chapters.map((ch, i) => {
        const stepSize = 1 / chapters.length
        const isCurrent = ch.status === 'current'
        const isDone = ch.status === 'done'

        return (
          <div key={ch.chapter} className="flex flex-col items-center gap-1">
            <div
              className={`rounded-full transition-all duration-300 ${
                isDone
                  ? 'w-2 h-2'
                  : isCurrent
                  ? 'w-3 h-3 ring-2'
                  : 'w-2 h-2 opacity-40'
              }`}
              style={{
                background: isDone || isCurrent ? path.color : '#d1d5db',
                ringColor: path.color,
              }}
            />
            {i < chapters.length - 1 && (
              <div
                className="w-px h-3 opacity-20"
                style={{ background: path.color }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   STORY CONTAINER (scroll driver)
───────────────────────────────────────────────────────── */
function StoryContainer({ path }) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  })

  return (
    <div ref={containerRef} className="relative w-full pb-20">
      {/* Sticky Background & HUD layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="sticky top-[144px] w-full" style={{ height: 'calc(100vh - 144px)' }}>

          {/* Soft ambient glow */}
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-20 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${path.color}40, transparent 70%)`,
              filter: 'blur(60px)',
            }}
          />

          {/* Progress Sidebar */}
          <ProgressSidebar chapters={path.chapters} scrollYProgress={scrollYProgress} path={path} />

          {/* Bottom HUD */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-6 pointer-events-none">
            <div className="flex items-center justify-between text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2">
              <span>{path.chapters[0].label}</span>
              <span>{path.tagline}</span>
              <span>{path.chapters[path.chapters.length - 1].label}</span>
            </div>
            <div className="w-full h-1 bg-neutral-200/60 dark:bg-neutral-800/60 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full origin-left"
                style={{
                  scaleX: scrollYProgress,
                  background: `linear-gradient(90deg, ${path.color}, ${path.accent})`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Scenes — standard vertical flow */}
      <div className="relative z-10 flex flex-col pt-4">
        {path.chapters.map((chapter, i) => (
          <ChapterScene
            key={`${path.id}-${chapter.chapter}`}
            chapter={chapter}
            index={i}
            path={path}
          />
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   PATH INTRO — before the scroll experience begins
───────────────────────────────────────────────────────── */
function PathIntro({ path }) {
  const Icon = path.icon
  return (
    <div className="px-4 pt-12 pb-2 relative z-10">
      <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
        <p
          className="text-[11px] font-black uppercase tracking-widest mb-3"
          style={{ color: path.color }}
        >
          Career Roadmap
        </p>
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
            style={{ background: `linear-gradient(135deg, ${path.color}, ${path.accent})` }}
          >
            <Icon size={18} className="text-white" />
          </div>
          <h1
            className="text-2xl font-black text-neutral-900 dark:text-neutral-100"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {path.title}
          </h1>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed max-w-lg mx-auto mb-6">
          {path.desc}
        </p>
        <div className="flex items-center justify-center gap-2 text-sm font-bold" style={{ color: path.color }}>
          <span>{path.chapters.length} Chapters</span>
          <span className="text-neutral-300">·</span>
          <span>Scroll to journey through</span>
          <ArrowDown size={16} />
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   ACTION PANEL — after the scroll, shows actionable steps
───────────────────────────────────────────────────────── */
function ActionPanel({ path }) {
  return (
    <div
      className="px-4 py-16"
      style={{
        background: `var(--bg-base)`,
        borderTop: `1px solid ${path.borderColor}`,
      }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
            style={{ background: `linear-gradient(135deg, ${path.color}, ${path.accent})` }}
          >
            <Lightbulb size={18} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Your Next Steps</p>
            <h3 className="text-lg font-black text-neutral-900 dark:text-neutral-100" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Actions to take right now
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {path.actions.map((action, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3 p-4 bg-white dark:bg-neutral-800 rounded-2xl border dark:border-neutral-700 shadow-sm hover:shadow-md transition-all group"
              style={{ borderColor: `${path.color}30` }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm text-[11px] font-black text-white group-hover:scale-110 transition-transform"
                style={{ background: `linear-gradient(135deg, ${path.color}, ${path.accent})` }}
              >
                {i + 1}
              </div>
              <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 leading-relaxed">{action}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   MAIN ROADMAP PAGE
───────────────────────────────────────────────────────── */
export default function Roadmap() {
  const [selectedPath, setSelectedPath] = useState('engineering')
  const path = PATHS.find(p => p.id === selectedPath)

  // Scroll to top when the path is changed
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [selectedPath])

  const collapsed = useThemeStore((s) => s.sidebarCollapsed)

  return (
    <PageWrapper>
      <div className="w-full max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 transition-all duration-300"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shrink-0"
            style={{ boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}>
            <Map size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-neutral-900 dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Career Roadmap
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
              Discover paths and chapters for your career
            </p>
          </div>
        </motion.div>
          
          {/* Path Selector */}
          <PathSelector paths={PATHS} selected={selectedPath} onSelect={setSelectedPath} />

        {/* Path changes with smooth cross-fade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedPath}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="relative rounded-3xl overflow-hidden min-h-[800px] border border-neutral-100 dark:border-neutral-800"
            style={{ background: `linear-gradient(180deg, ${path.bgFrom} 0%, ${path.bgTo} 100%)` }}
          >
            {/* Intro panel */}
            <PathIntro path={path} />

            {/* The scroll storytelling experience */}
            <StoryContainer path={path} />

            {/* Action panel after scroll */}
            <ActionPanel path={path} />
          </motion.div>
        </AnimatePresence>
      </div>
    </PageWrapper>
  )
}
