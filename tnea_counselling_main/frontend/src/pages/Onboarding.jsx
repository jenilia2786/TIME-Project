import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft, ArrowRight, Sparkles, CheckCircle2, X,
  User, MapPin, BookOpen, Target, Brain, Heart,
  DollarSign, Building2, Star, Zap, GraduationCap, Map, FlaskConical
} from 'lucide-react'
import useStudentStore from '../store/useStudentStore'
import NeuralBackground from '../components/ui/NeuralBackground'

/* ─── Data ─────────────────────────────────────────────────── */
const DISTRICTS = [
  'Chennai','Coimbatore','Madurai','Tiruchirappalli','Salem',
  'Tirunelveli','Vellore','Erode','Thoothukudi','Dindigul',
  'Thanjavur','Virudhunagar','Namakkal','Kancheepuram','Cuddalore',
  'Nagapattinam','Villupuram','Tiruvannamalai','Krishnagiri','Dharmapuri',
  'Karur','Perambalur','Ariyalur','Ranipet','Chengalpattu',
  'Kallakurichi','Tirupathur','Tenkasi','Other',
]

const STANDARDS = [
  { id: '10th', icon: '🌱', desc: 'Starting your journey' },
  { id: '11th', icon: '📖', desc: 'Choosing your path' },
  { id: '12th', icon: '🎓', desc: 'Preparing for college' },
  { id: 'Diploma', icon: '📜', desc: 'Technical education' },
  { id: 'UG', icon: '🏛️', desc: 'Undergraduate student' },
  { id: 'PG', icon: '🔬', desc: 'Postgraduate student' },
]

const COMMUNITIES = [
  { id: 'OC',  label: 'OC',  desc: 'Open Category' },
  { id: 'BC',  label: 'BC',  desc: 'Backward Class' },
  { id: 'BCM', label: 'BCM', desc: 'Backward Class Muslim' },
  { id: 'MBC', label: 'MBC', desc: 'Most Backward Class' },
  { id: 'SC',  label: 'SC',  desc: 'Scheduled Caste' },
  { id: 'SCA', label: 'SCA', desc: 'Scheduled Caste Arunthathiyar' },
  { id: 'ST',  label: 'ST',  desc: 'Scheduled Tribe' },
]

const BOARDS = ['State Board', 'CBSE', 'ICSE', 'Others']

const INTERESTS = [
  { id: 'Engineering',          icon: '⚙️', desc: 'Design, build & innovate' },
  { id: 'Medical',              icon: '🏥', desc: 'Healthcare & medicine' },
  { id: 'Arts & Science',       icon: '🎨', desc: 'Creative & scientific fields' },
  { id: 'Government Jobs',      icon: '🏛️', desc: 'IAS, IPS, TNPSC & more' },
  { id: 'Technology',           icon: '💻', desc: 'Software, AI & tech careers' },
  { id: 'AI & Data Science',    icon: '🤖', desc: 'Machine learning & data' },
  { id: 'Design',               icon: '🖌️', desc: 'UI/UX, graphic & animation' },
  { id: 'Law',                  icon: '⚖️', desc: 'Legal studies & advocacy' },
  { id: 'Aviation',             icon: '✈️', desc: 'Pilot, ATC & aerospace' },
  { id: 'Hotel Management',     icon: '🏨', desc: 'Hospitality & tourism' },
  { id: 'Marine',               icon: '⚓', desc: 'Naval & maritime careers' },
  { id: 'Research',             icon: '🔬', desc: 'Science & academia' },
  { id: 'Business',             icon: '📈', desc: 'Entrepreneurship & management' },
  { id: 'Confused',             icon: '🤔', desc: "Help me decide what's right" },
]

const COURSES = [
  'Computer Science Engineering', 'MBBS', 'BDS', 'B.Sc Agriculture', 'B.Arch',
  'B.Com', 'BA English', 'BBA', 'BCA', 'B.Tech IT', 'B.Tech AI & DS', 'Mechanical Engineering',
  'Civil Engineering', 'Biotechnology', 'LLB (Law)', 'B.Sc Nursing'
]

const CAREER_GOALS = [
  { id: 'High Salary',          icon: '💰', desc: 'Maximise earnings' },
  { id: 'Government Job',       icon: '🏛️', desc: 'Stable, secure career' },
  { id: 'Abroad Opportunities', icon: '✈️', desc: 'Work or study globally' },
  { id: 'Passion-Based',        icon: '❤️', desc: 'Do what I love' },
  { id: 'Stable Career',        icon: '🏡', desc: 'Work-life balance' },
  { id: 'Research',             icon: '🔬', desc: 'Advance knowledge' },
  { id: 'Startup',              icon: '🚀', desc: 'Build something new' },
  { id: 'Social Impact',        icon: '🌱', desc: 'Make a difference' },
]

const SUBJECTS = ['Mathematics','Physics','Chemistry','Biology','Computer Science','History','Economics','English','Tamil', 'Accounts', 'Business Studies']

const BUDGET_OPTIONS = [
  { id: 'Below 50K',  label: '< ₹50,000 / year',   icon: '🟢', desc: 'Government college priority' },
  { id: '50K–1L',    label: '₹50K – ₹1L / year',   icon: '🟡', desc: 'Aided & semi-government' },
  { id: '1L–3L',     label: '₹1L – ₹3L / year',    icon: '🟠', desc: 'Private colleges' },
  { id: 'Above 3L',  label: '> ₹3L / year',         icon: '🔴', desc: 'Premium institutions' },
  { id: 'Scholarship', label: 'Scholarship Needed', icon: '🎓', desc: 'Need financial aid' },
]

const LOCATION_PREFS = [
  { id: 'Home District', icon: '🏠', desc: 'Stay close to family' },
  { id: 'Chennai',       icon: '🏙️', desc: 'Tamil Nadu capital' },
  { id: 'Coimbatore',    icon: '🌆', desc: 'Education city' },
  { id: 'Trichy',        icon: '🏛️', desc: 'Central Tamil Nadu' },
  { id: 'Anywhere TN',   icon: '🗺️', desc: 'Open to all TN cities' },
  { id: 'Pan India',     icon: '🌏', desc: 'Any city in India' },
]

const COLLEGE_TYPE_PREFS = [
  { id: 'Government Only',  icon: '🏛️', desc: 'Low fees, high prestige' },
  { id: 'Private Aided',    icon: '🏫', desc: 'Balance of cost & quality' },
  { id: 'Private Unaided',  icon: '🏢', desc: 'Modern facilities' },
  { id: 'Deemed University', icon: '🎓', desc: 'Research-focused' },
  { id: 'Any - Best Fit',   icon: '⭐', desc: 'Best match for me' },
]

const STEPS = [
  { id: 'academic',  icon: GraduationCap, title: 'Academic Details',   sub: 'Tell us about your education',         color: 'from-brand-500 to-cyan-500'   },
  { id: 'interests', icon: Heart,         title: 'Your Interests',     sub: 'Domains and courses that excite you',  color: 'from-rose-500 to-pink-500'    },
  { id: 'goals',     icon: Target,        title: 'Career Goals',       sub: 'What do you value in your future?',    color: 'from-amber-500 to-orange-500' },
  { id: 'subjects',  icon: BookOpen,      title: 'Subject Strengths',  sub: 'Where do you shine academically?',     color: 'from-violet-500 to-purple-500'},
  { id: 'budget',    icon: DollarSign,    title: 'Preferences',        sub: 'Budget, location & lifestyle needs',   color: 'from-emerald-500 to-teal-500' },
]

/* ─── Helpers ───────────────────────────────────────────────── */
const slide = (d = 1) => ({
  initial:    { opacity: 0, x: 30 * d, filter: 'blur(4px)' },
  animate:    { opacity: 1, x: 0,      filter: 'blur(0px)' },
  exit:       { opacity: 0, x: -20 * d,filter: 'blur(4px)' },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
})

/* ─── Selection chip ────────────────────────────────────────── */
function Chip({ selected, onClick, icon, label, desc, size = 'md' }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`relative flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all duration-200 ${
        selected
          ? 'border-brand-400 bg-gradient-to-br from-brand-50 to-cyan-50 shadow-[0_0_12px_rgba(20,184,166,0.15)]'
          : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm'
      }`}
    >
      {icon && <span className="text-2xl shrink-0">{icon}</span>}
      <div className="min-w-0">
        <p className={`text-sm font-semibold leading-snug ${selected ? 'text-brand-700' : 'text-neutral-800'}`}>
          {label}
        </p>
        {desc && <p className="text-[11px] text-neutral-400 mt-0.5">{desc}</p>}
      </div>
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-white"
          >
            <CheckCircle2 size={12} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

/* ─── Simple tag chip ────────────────────────────────────────── */
function TagChip({ selected, onClick, children }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-all duration-200 ${
        selected
          ? 'border-brand-500 bg-gradient-to-r from-brand-50 to-cyan-50 text-brand-700 shadow-sm'
          : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
      }`}
    >
      {children}
    </motion.button>
  )
}

/* ═══════════════════════════════════════════════════════════════ */
export default function Onboarding() {
  const navigate = useNavigate()
  const { student, updateStudentProfile, updateMarks, completeOnboarding } = useStudentStore()

  const [step,          setStep]         = useState(0)
  const [dir,           setDir]          = useState(1)

  /* Step 0 — Academic */
  const [standard,   setStandard]  = useState(student.standard  || '')
  const [school,     setSchool]    = useState(student.school    || '')
  const [board,      setBoard]     = useState(student.board     || '')
  const [district,   setDistrict]  = useState(student.district  || '')
  const [community,  setCommunity] = useState(student.community || '')

  /* Step 0 — Marks (TNEA cutoff inputs) */
  const [maths,      setMaths]     = useState(student.maths     || '')
  const [physics,    setPhysics]   = useState(student.physics   || '')
  const [chemistry,  setChemistry] = useState(student.chemistry || '')

  /* Live cutoff preview */
  const computeLiveCutoff = (m, p, c) => {
    const mv = parseFloat(m) || 0
    const pv = parseFloat(p) || 0
    const cv = parseFloat(c) || 0
    return parseFloat(Math.min(200, Math.max(0, mv + pv / 2 + cv / 2)).toFixed(2))
  }

  /* Step 1 — Interests */
  const [interests, setInterests] = useState(student.interests || [])
  const [courses,   setCourses]   = useState(student.courses || [])

  /* Step 2 — Goals */
  const [careerGoals, setCareerGoals] = useState(student.careerGoals || [])

  /* Step 3 — Subjects */
  const [strongSubjects, setStrong] = useState(student.strongSubjects || [])
  const [weakSubjects,   setWeak]   = useState(student.weakSubjects   || [])
  const [confidence,  setConf]      = useState(student.subjectConfidence || {})

  /* Step 4 — Preferences */
  const [budget,   setBudget]   = useState(student.budget   || '')
  const [location, setLocation] = useState(student.preferredLocation || '')
  const [collegeType, setCollegeType] = useState(student.institutionTypePref || '')
  const [hostel, setHostel] = useState(student.hostelRequired || '')
  const [studyAbroad, setStudyAbroad] = useState(student.studyAbroad || '')

  const toggle = (list, setList, val) =>
    setList(p => p.includes(val) ? p.filter(x => x !== val) : [...p, val])

  const saveAndGo = (next) => {
    const id = STEPS[step].id
    if (id === 'academic')  {
      updateStudentProfile({ standard, school, board, district, community })
      updateMarks(maths, physics, chemistry)
    }
    if (id === 'interests') updateStudentProfile({ interests, courses })
    if (id === 'goals')     updateStudentProfile({ careerGoals })
    if (id === 'subjects')  updateStudentProfile({ strongSubjects, weakSubjects, subjectConfidence: confidence })
    if (id === 'budget')    updateStudentProfile({ budget, preferredLocation: location, institutionTypePref: collegeType, hostelRequired: hostel, studyAbroad })
    setDir(next > step ? 1 : -1)
    setStep(next)
  }

  const goNext = () => {
    if (step < STEPS.length - 1) saveAndGo(step + 1)
    else { saveAndGo(step); completeOnboarding(); navigate('/dashboard') }
  }
  const goBack = () => {
    if (step === 0) navigate('/dashboard')
    else saveAndGo(step - 1)
  }

  const currentStep = STEPS[step]
  const StepIcon = currentStep.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50/30">

      {/* ── Header ─────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-30 border-b border-neutral-100 bg-white/90 backdrop-blur-xl"
        style={{ boxShadow: '0 1px 20px rgba(0,0,0,0.05)' }}
      >
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${currentStep.color} shadow-sm`}
            >
              <StepIcon size={15} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900">{currentStep.title}</p>
              <p className="text-[10px] text-neutral-400">Step {step + 1} of {STEPS.length}</p>
            </div>
          </div>
          <button
            onClick={() => { completeOnboarding(); navigate('/dashboard') }}
            className="text-xs font-semibold text-neutral-400 hover:text-brand-600 transition-colors flex items-center gap-1"
          >
            Skip for now <X size={12} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-neutral-100">
          <motion.div
            className={`h-full bg-gradient-to-r ${currentStep.color}`}
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ boxShadow: '0 0 8px rgba(20,184,166,0.5)' }}
          />
        </div>
      </header>

      {/* ── Step breadcrumbs ──────────────────────────────── */}
      <div className="border-b border-neutral-100 bg-white/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center gap-1.5 overflow-x-auto px-6 py-2.5 scrollbar-hide">
          {STEPS.map((s, i) => {
            const SIcon = s.icon
            return (
              <div key={s.id} className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => i < step && saveAndGo(i)}
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
                    i === step
                      ? 'bg-gradient-to-r from-brand-50 to-cyan-50 text-brand-700 border border-brand-200'
                      : i < step
                      ? 'text-emerald-600 hover:bg-emerald-50 cursor-pointer'
                      : 'text-neutral-400 cursor-default'
                  }`}
                >
                  {i < step
                    ? <CheckCircle2 size={11} className="text-emerald-500" />
                    : <SIcon size={11} />
                  }
                  {s.title}
                </button>
                {i < STEPS.length - 1 && <span className="text-neutral-200 text-xs">›</span>}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────── */}
      <div className="mx-auto max-w-2xl px-6 py-8">
        <AnimatePresence mode="wait">

          {/* ── Step 0: Academic ────────────────────────────── */}
          {step === 0 && (
            <motion.div key="academic" {...slide(dir)} className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-neutral-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {STEPS[0].title}
                </h1>
                <p className="text-sm text-neutral-500 mt-1">{STEPS[0].sub}</p>
              </div>

              {/* Standard */}
              <div>
                <label className="section-label mb-3 block">📚 Current Standard / Level</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {STANDARDS.map((s) => (
                    <Chip key={s.id} selected={standard === s.id} onClick={() => setStandard(s.id)} icon={s.icon} label={s.id} desc={s.desc} />
                  ))}
                </div>
              </div>

              {/* School / College Name */}
              <div>
                <label className="section-label mb-2 block">🏫 School / College Name</label>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="Enter your institution name"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                />
              </div>

              {/* Board */}
              <div>
                <label className="section-label mb-3 block">📋 Education Board</label>
                <div className="grid grid-cols-2 gap-2">
                  {BOARDS.map((b) => (
                    <Chip key={b} selected={board === b} onClick={() => setBoard(b)} label={b} />
                  ))}
                </div>
              </div>

              {/* District */}
              <div>
                <label className="section-label mb-2 block">📍 Your District / Location</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-4 py-3 text-sm font-medium text-neutral-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all appearance-none"
                  >
                    <option value="">Select your district…</option>
                    {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Community */}
              <div>
                <label className="section-label mb-3 block">🏷️ Community Category</label>
                <p className="text-xs text-neutral-400 mb-3">Used for cutoff calculations and scholarship matching.</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {COMMUNITIES.map((c) => (
                    <motion.button
                      key={c.id}
                      type="button"
                      onClick={() => setCommunity(c.id)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`relative flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition-all duration-200 ${
                        community === c.id
                          ? 'border-brand-400 bg-gradient-to-br from-brand-50 to-cyan-50 shadow-[0_0_12px_rgba(20,184,166,0.15)]'
                          : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm'
                      }`}
                    >
                      <span className={`text-sm font-black ${
                        community === c.id ? 'text-brand-700' : 'text-neutral-800'
                      }`}>{c.label}</span>
                      <span className="text-[10px] text-neutral-400 mt-0.5 leading-tight">{c.desc}</span>
                      {community === c.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-white"
                        >
                          <CheckCircle2 size={10} />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Subject Marks */}
              <div>
                <label className="section-label mb-2 block">📊 Subject Marks (optional but recommended)</label>
                <p className="text-xs text-neutral-400 mb-3">Enables precise cutoff calculation and college recommendations.</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Maths', icon: '➕', value: maths, setter: setMaths, color: 'border-sky-200 focus:border-sky-500 focus:ring-sky-100' },
                    { label: 'Physics', icon: '⚛️', value: physics, setter: setPhysics, color: 'border-violet-200 focus:border-violet-500 focus:ring-violet-100' },
                    { label: 'Chemistry', icon: '🧪', value: chemistry, setter: setChemistry, color: 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100' },
                  ].map(({ label, icon, value, setter, color }) => (
                    <div key={label}>
                      <p className="text-[11px] font-bold text-neutral-500 mb-1.5">{icon} {label}</p>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) => setter(e.target.value)}
                        placeholder="0–100"
                        className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm font-bold text-neutral-800 focus:ring-2 outline-none transition-all text-center ${color}`}
                      />
                    </div>
                  ))}
                </div>

                {/* Live cutoff preview */}
                {(maths || physics || chemistry) && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-brand-50 to-cyan-50 border border-brand-100"
                  >
                    <div className="flex items-center gap-2">
                      <FlaskConical size={14} className="text-brand-500" />
                      <span className="text-xs font-bold text-brand-700">Live TNEA Cutoff Preview</span>
                    </div>
                    <span className="text-lg font-black text-brand-600">
                      {computeLiveCutoff(maths, physics, chemistry)}
                      <span className="text-xs font-bold text-brand-400">/200</span>
                    </span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── Step 1: Interests ────────────────────────────── */}
          {step === 1 && (
            <motion.div key="interests" {...slide(dir)} className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-neutral-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {STEPS[1].title}
                </h1>
                <p className="text-sm text-neutral-500 mt-1">Select domains and courses that spark your curiosity.</p>
              </div>

              <div>
                <label className="section-label mb-3 block">🌟 Interested Domains</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {INTERESTS.map((item) => (
                    <Chip
                      key={item.id}
                      selected={interests.includes(item.id)}
                      onClick={() => toggle(interests, setInterests, item.id)}
                      icon={item.icon}
                      label={item.id}
                      desc={item.desc}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="section-label mb-3 block">🎓 Interested Courses</label>
                <div className="flex flex-wrap gap-2">
                  {COURSES.map((c) => (
                    <TagChip key={c} selected={courses.includes(c)} onClick={() => toggle(courses, setCourses, c)}>{c}</TagChip>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Goals ─────────────────────────────────── */}
          {step === 2 && (
            <motion.div key="goals" {...slide(dir)} className="space-y-5">
              <div>
                <h1 className="text-2xl font-black text-neutral-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {STEPS[2].title}
                </h1>
                <p className="text-sm text-neutral-500 mt-1">What matters most to you in your future career?</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CAREER_GOALS.map((g) => (
                  <Chip
                    key={g.id}
                    selected={careerGoals.includes(g.id)}
                    onClick={() => toggle(careerGoals, setCareerGoals, g.id)}
                    icon={g.icon}
                    label={g.id}
                    desc={g.desc}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Subjects ──────────────────────────────── */}
          {step === 3 && (
            <motion.div key="subjects" {...slide(dir)} className="space-y-5">
              <div>
                <h1 className="text-2xl font-black text-neutral-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {STEPS[3].title}
                </h1>
                <p className="text-sm text-neutral-500 mt-1">Helps us match courses to your academic profile.</p>
              </div>

              <div>
                <label className="section-label mb-3 block">💪 Strong Subjects</label>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.map((s) => (
                    <TagChip key={s} selected={strongSubjects.includes(s)} onClick={() => {
                      toggle(strongSubjects, setStrong, s)
                      if (weakSubjects.includes(s)) setWeak(w => w.filter(x => x !== s))
                    }}>{s}</TagChip>
                  ))}
                </div>
              </div>

              <div>
                <label className="section-label mb-3 block">📉 Weak Subjects</label>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.filter((s) => !strongSubjects.includes(s)).map((s) => (
                    <TagChip key={s} selected={weakSubjects.includes(s)} onClick={() => toggle(weakSubjects, setWeak, s)}>{s}</TagChip>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step 4: Preferences ──────────────────────── */}
          {step === 4 && (
            <motion.div key="preferences" {...slide(dir)} className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-neutral-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {STEPS[4].title}
                </h1>
                <p className="text-sm text-neutral-500 mt-1">We'll match colleges that fit your lifestyle and budget.</p>
              </div>

              <div>
                <label className="section-label mb-3 block">📍 Preferred College Location</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {LOCATION_PREFS.map((l) => (
                    <Chip key={l.id} selected={location === l.id} onClick={() => setLocation(l.id)} icon={l.icon} label={l.id} desc={l.desc} />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="section-label mb-3 block">🏠 Hostel Requirement</label>
                  <div className="flex gap-2.5">
                    {['Yes', 'No'].map((h) => (
                      <Chip key={h} selected={hostel === h} onClick={() => setHostel(h)} label={h} />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="section-label mb-3 block">✈️ Study Abroad Interest</label>
                  <div className="flex gap-2.5">
                    {['Yes', 'No'].map((a) => (
                      <Chip key={a} selected={studyAbroad === a} onClick={() => setStudyAbroad(a)} label={a} />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="section-label mb-3 block">💰 Annual Education Budget</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {BUDGET_OPTIONS.map((b) => (
                    <Chip key={b.id} selected={budget === b.id} onClick={() => setBudget(b.id)} icon={b.icon} label={b.label} desc={b.desc} />
                  ))}
                </div>
              </div>

              <div>
                <label className="section-label mb-3 block">🏛️ Government vs Private Preference</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {COLLEGE_TYPE_PREFS.map((c) => (
                    <Chip key={c.id} selected={collegeType === c.id} onClick={() => setCollegeType(c.id)} icon={c.icon} label={c.id} desc={c.desc} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* ── Navigation ────────────────────────────────────── */}
        <div className="mt-8 flex items-center justify-between gap-4">
          <motion.button
            onClick={goBack}
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.97 }}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft size={14} /> {step === 0 ? 'Dashboard' : 'Back'}
          </motion.button>

          <motion.button
            onClick={goNext}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary flex items-center gap-2"
            id="onboarding-continue"
          >
            {step === STEPS.length - 1 ? (
              <><CheckCircle2 size={15} /> Complete Profile</>
            ) : (
              <>Continue <ArrowRight size={14} /></>
            )}
          </motion.button>
        </div>

        <p className="mt-5 text-center text-xs text-neutral-400">
          You can skip any step and return later. Your AI recommendations improve with each detail you share.
        </p>
      </div>
    </div>
  )
}
