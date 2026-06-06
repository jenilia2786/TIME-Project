import { useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Sparkles, Brain, TrendingUp, Star, Zap, BookOpen, Target,
  Award, BarChart2, Map, ArrowRight, Building2, GraduationCap,
  ChevronRight, Activity, Shield, Lightbulb, FlaskConical,
  CheckCircle, Clock, AlertCircle, Flame, Cpu, Heart
} from 'lucide-react'
import useStudentStore from '../store/useStudentStore'
import useThemeStore from '../store/useThemeStore'
import PageWrapper from '../components/layout/PageWrapper'
import { fetchRecommendations, parseTier } from '../services/recommendationService'
import { Users, Plus, X, LayoutDashboard } from 'lucide-react'
import usePersonalization from '../hooks/usePersonalization'

/* ── Add Profile Modal ──────────────────────────────────────── */
function AddProfileModal({ isOpen, onClose, onAdd }) {
  const [name, setName] = useState('')
  const [standard, setStandard] = useState('')
  
  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !standard) return
    onAdd({ name, standard, relation: 'child' })
    setName('')
    setStandard('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center sm:justify-start sm:pl-[280px] lg:pl-[380px] pt-[160px] p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-neutral-200 dark:border-neutral-800"
      >
        <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <h3 className="font-bold text-neutral-900 dark:text-white">Add Child Profile</h3>
          <button onClick={onClose} className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"><X size={18}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Child's Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} required className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-sm outline-none focus:border-brand-500" placeholder="e.g. Rahul" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Standard / Grade</label>
            <select value={standard} onChange={e=>setStandard(e.target.value)} required className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-sm outline-none focus:border-brand-500">
              <option value="">Select standard</option>
              <option value="10th">10th Grade</option>
              <option value="11th">11th Grade</option>
              <option value="12th">12th Grade</option>
              <option value="UG 1st Year">UG 1st Year</option>
              <option value="UG 2nd Year">UG 2nd Year</option>
              <option value="UG 3rd Year">UG 3rd Year</option>
              <option value="UG 4th Year">UG 4th Year</option>
            </select>
          </div>
          <button type="submit" className="mt-2 w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition-colors">Create Profile</button>
        </form>
      </motion.div>
    </div>
  )
}

/* ── Animation variants ──────────────────────────────────────── */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 180, damping: 22 } },
}

/* SUGGESTED_ACTIONS is now built dynamically from usePersonalization — see SuggestedActions component */
const STATIC_ACTIONS = [
  { icon: FlaskConical, text: 'Complete Cutoff Calculator', priority: 'high', to: '/predictions', color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100' },
  { icon: GraduationCap, text: 'Explore Scholarship Matches', priority: 'medium', to: '/scholarships', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
  { icon: Map, text: 'Build Your Roadmap', priority: 'medium', to: '/roadmap', color: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-100' },
  { icon: BookOpen, text: 'Generate AI Report', priority: 'low', to: '/reports', color: 'text-brand-500', bg: 'bg-brand-50', border: 'border-brand-100' },
]

/* ── AI Insight Card ─────────────────────────────────────────── */
function AIInsightCard({ student, computedCutoff }) {
  const [pulse, setPulse] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 3000)
    return () => clearTimeout(t)
  }, [])

  const firstName = student.name ? student.name.split(' ')[0] : null
  const strongSubs = student.strongSubjects?.join(', ') || 'core subjects'

  return (
    <motion.div
      variants={item}
      className="relative overflow-hidden rounded-2xl p-1"
      style={{
        background: 'linear-gradient(135deg, rgba(20,184,166,0.15) 0%, rgba(139,92,246,0.15) 50%, rgba(20,184,166,0.15) 100%)',
      }}
    >
      <motion.div
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 rounded-2xl opacity-60"
        style={{
          background: 'linear-gradient(270deg, #14b8a6, #8b5cf6, #06b6d4, #14b8a6)',
          backgroundSize: '300% 300%',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          padding: '1px',
        }}
      />

      <div
        className="relative rounded-xl p-5 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,253,250,0.95))',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px bg-brand-500"
              style={{ left: `${i * 14}%`, top: 0, bottom: 0 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>

        <div className="relative z-10 flex items-start gap-4">
          <motion.div
            animate={{ scale: pulse ? [1, 1.15, 1] : 1, rotate: [0, 360] }}
            transition={{
              scale: { duration: 1.5, repeat: pulse ? Infinity : 0, ease: 'easeInOut' },
              rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
            }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-violet-500 flex items-center justify-center shadow-lg shrink-0"
            style={{ boxShadow: '0 0 20px rgba(20,184,166,0.4)' }}
          >
            <Brain size={22} className="text-white" />
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">AI Insight</span>
              <motion.div
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-brand-500"
              />
            </div>
            <p className="text-sm font-bold text-neutral-900 leading-snug mb-2">
              {student.role === 'parent' 
                ? `${firstName ? firstName + "'s" : "Your child's"} profile shows strong potential in ${strongSubs}.`
                : `${firstName ? `${firstName}, your` : 'Your'} profile shows strong potential in ${strongSubs}.`}
              {computedCutoff > 0 && ` Computed TNEA cutoff: ${computedCutoff}/200.`}
            </p>
            <p className="text-xs text-neutral-500 leading-relaxed">
              {student.community
                ? `Under ${student.community} category, you have strong eligibility for top engineering programs.`
                : 'Complete your profile to unlock personalized AI recommendations tailored to your marks and community.'
              }
              {' '}
              <span className="text-brand-600 font-bold">
                {student.district ? `Colleges near ${student.district} are included in your matches.` : 'Add your district for location-based matching.'}
              </span>
            </p>
            <Link to="/assistant">
              <motion.span
                whileHover={{ x: 3 }}
                className="mt-3 flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
              >
                Ask AI Mentor <ArrowRight size={11} />
              </motion.span>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Complete Profile Banner ─────────────────────────────────── */
function CompleteProfileBanner({ completion, navigate }) {
  if (completion >= 100) return null

  return (
    <motion.div
      variants={item}
      className="relative overflow-hidden rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-rose-200 shadow-sm cursor-pointer group"
      style={{
        background: 'linear-gradient(135deg, rgba(255,241,242,0.9) 0%, rgba(255,228,230,0.9) 100%)',
      }}
      onClick={() => navigate('/onboarding')}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/50 rounded-full blur-2xl -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-500" />
      
      <div className="flex items-center gap-4 relative z-10 w-full sm:w-auto">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-[0_4px_15px_rgba(244,63,94,0.2)] shrink-0 group-hover:scale-105 transition-transform">
          <AlertCircle size={24} className="text-rose-500" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-black text-rose-950 mb-0.5">Complete Profile to see Matches</h3>
          <p className="text-xs text-rose-700/80 font-medium">
            Finish setting up your details to receive accurate AI college predictions.
          </p>
        </div>
      </div>

      <div className="relative z-10 w-full sm:w-auto flex items-center gap-3">
        <div className="flex-1 sm:w-32 h-2 rounded-full bg-white overflow-hidden shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-rose-400 to-rose-500 rounded-full"
          />
        </div>
        <button className="shrink-0 bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md hover:bg-rose-700 transition-colors flex items-center gap-1.5 group-hover:shadow-[0_4px_15px_rgba(244,63,94,0.3)]">
          Continue <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  )
}

/* ── Parent Profiles Banner ─────────────────────────────────── */
function ParentProfilesBanner({ profiles, activeProfileId, switchProfile, student, navigate, onAddClick }) {
  if (student.role !== 'parent') return null

  const childrenProfiles = profiles.filter(p => p.relation !== 'self')

  return (
    <motion.div variants={item} className="bg-white rounded-2xl border border-neutral-100 p-5 mb-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-brand-500" />
          <h3 className="text-sm font-bold text-neutral-900">Your Managed Profiles</h3>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        {childrenProfiles.map(p => {
          const isActive = p.id === activeProfileId
          return (
            <button
              key={p.id}
              onClick={() => switchProfile(p.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all border text-left ${
                isActive 
                  ? 'border-brand-200 bg-brand-50 shadow-sm' 
                  : 'border-neutral-200 bg-white hover:bg-neutral-50 hover:border-brand-200'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-cyan-500 flex items-center justify-center text-[11px] font-black text-white shrink-0">
                {p.name?.[0]?.toUpperCase() || 'C'}
              </div>
              <div className="flex flex-col pr-4">
                <span className={`text-xs font-bold leading-tight ${isActive ? 'text-brand-700' : 'text-neutral-700'}`}>{p.name}</span>
                <span className={`text-[9.5px] font-semibold mt-0.5 ${isActive ? 'text-brand-500' : 'text-neutral-400'}`}>
                  {p.standard || 'No Standard'} {p.domain ? `• ${p.domain}` : ''}
                </span>
              </div>
            </button>
          )
        })}
        
        <button onClick={onAddClick} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all border border-dashed border-neutral-300 bg-neutral-50 hover:bg-brand-50 hover:border-brand-200 text-left group">
          <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center shrink-0 group-hover:border-brand-200 transition-colors">
            <Plus size={14} className="text-neutral-400 group-hover:text-brand-500" />
          </div>
          <span className="text-xs font-bold text-neutral-600 group-hover:text-brand-600 pr-2">Add Child</span>
        </button>
      </div>
    </motion.div>
  )
}


/* ── Animated Counter ───────────────────────────────────── */
function AnimCounter({ value, suffix = '', decimals = 0 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let start = 0
    const end = parseFloat(value)
    if (!end) { setCount(end); return }
    const duration = 1500
    const step = (end - start) / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, value])
  return (
    <span ref={ref}>{decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}{suffix}</span>
  )
}

/* ── Stats Row ───────────────────────────────────────────── */
function StatsRow({ profileCompletion, computedCutoff, matchedCount }) {
  const stats = [
    { label: 'Profile Score', value: profileCompletion, suffix: '%', icon: Activity, color: 'from-brand-400 to-cyan-400', glow: 'rgba(20,184,166,0.3)' },
    { label: 'Predicted Cutoff', value: computedCutoff || 0, suffix: '/200', icon: Target, color: 'from-violet-400 to-purple-500', glow: 'rgba(139,92,246,0.3)', decimals: 2 },
    { label: 'Readiness Score', value: Math.min(100, Math.round(profileCompletion * 0.87)), suffix: '%', icon: Zap, color: 'from-amber-400 to-orange-400', glow: 'rgba(245,158,11,0.3)' },
    { label: 'Matched Colleges', value: matchedCount || 0, suffix: '+', icon: Building2, color: 'from-emerald-400 to-teal-400', glow: 'rgba(16,185,129,0.3)' },
  ]

  return (
    <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s, i) => {
        const Icon = s.icon
        return (
          <motion.div
            key={s.label}
            whileHover={{ y: -4, scale: 1.02 }}
            className="relative overflow-hidden rounded-2xl bg-white border border-neutral-100 p-4 cursor-default"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 + 0.2, type: 'spring', stiffness: 200 }}
          >
            <div className={`absolute -top-3 -right-3 w-12 h-12 rounded-full bg-gradient-to-br ${s.color} opacity-10 blur-lg`} />

            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-sm`}
              style={{ boxShadow: `0 4px 12px ${s.glow}` }}>
              <Icon size={15} className="text-white" />
            </div>
            <p className="text-xl font-black text-neutral-900 leading-none mb-1">
              <AnimCounter value={s.value} suffix={s.suffix} decimals={s.decimals || 0} />
            </p>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{s.label}</p>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

/* ── Subject Performance ─────────────────────────────────── */
function SubjectPerformance({ student }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  // Build subjects from real marks if available
  const hasMarks = student.maths || student.physics || student.chemistry
  const subjects = hasMarks
    ? [
        { name: 'Maths',     score: Math.round((parseFloat(student.maths) || 0)),     color: 'from-brand-400 to-cyan-500',   glow: 'rgba(20,184,166,0.4)',   strong: (parseFloat(student.maths) || 0) >= 70 },
        { name: 'Physics',   score: Math.round((parseFloat(student.physics) || 0)),   color: 'from-sky-400 to-blue-500',     glow: 'rgba(14,165,233,0.4)',   strong: (parseFloat(student.physics) || 0) >= 70 },
        { name: 'Chemistry', score: Math.round((parseFloat(student.chemistry) || 0)), color: 'from-violet-400 to-purple-500',glow: 'rgba(139,92,246,0.4)',   strong: (parseFloat(student.chemistry) || 0) >= 70 },
      ]
    : (student.strongSubjects || []).slice(0, 5).map((s, i) => ({
        name: s, score: 80 - i * 5,
        color: ['from-brand-400 to-cyan-500','from-sky-400 to-blue-500','from-violet-400 to-purple-500','from-amber-400 to-orange-500','from-emerald-400 to-teal-500'][i],
        glow: 'rgba(20,184,166,0.4)', strong: true,
      }))

  const strong = subjects.filter(s => s.strong)
  const weak = subjects.filter(s => !s.strong)

  return (
    <motion.div ref={ref} variants={item} className="bg-white rounded-2xl border border-neutral-100 p-5" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
      <div className="flex items-center gap-2 mb-5">
        <BarChart2 size={15} className="text-brand-500" />
        <h3 className="text-sm font-bold text-neutral-900">Subject Performance</h3>
        <span className="ml-auto text-[10px] font-bold text-brand-600 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded-full">
          {hasMarks ? 'From Marks' : 'From Profile'}
        </span>
      </div>

      {subjects.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-neutral-400 font-medium">Complete your profile to see subject performance</p>
          <Link to="/onboarding" className="mt-2 inline-block text-xs font-bold text-brand-600 hover:underline">Go to Onboarding →</Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {subjects.map((s, i) => (
              <div key={s.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-neutral-700">{s.name}</span>
                    {s.strong
                      ? <span className="text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded-full">Strong</span>
                      : <span className="text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-100 px-1.5 py-0.5 rounded-full">Improve</span>
                    }
                  </div>
                  <span className="text-xs font-black text-neutral-700">{s.score}{hasMarks ? '/100' : '%'}</span>
                </div>
                <div className="h-2.5 rounded-full bg-neutral-100 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${hasMarks ? s.score : s.score}%` } : { width: 0 }}
                    transition={{ duration: 1.2, delay: i * 0.1 + 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={`h-full rounded-full bg-gradient-to-r ${s.color}`}
                    style={{ boxShadow: `0 0 8px ${s.glow}` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
              <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1.5">Strong Subjects</p>
              {strong.length > 0 ? strong.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5 mb-1">
                  <CheckCircle size={10} className="text-emerald-500 shrink-0" />
                  <span className="text-[11px] font-semibold text-emerald-700">{s.name} — {s.score}{hasMarks ? '' : '%'}</span>
                </div>
              )) : <p className="text-[10px] text-neutral-400 italic">None yet</p>}
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
              <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1.5">Need Improvement</p>
              {weak.length > 0 ? weak.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5 mb-1">
                  <AlertCircle size={10} className="text-amber-500 shrink-0" />
                  <span className="text-[11px] font-semibold text-amber-700">{s.name} — {s.score}{hasMarks ? '' : '%'}</span>
                </div>
              )) : <p className="text-[10px] text-neutral-400 italic">All subjects strong! ✨</p>}
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}

/* ── Recommended Colleges ────────────────────────────────── */
function RecommendedColleges({ recommendations, loading }) {
  const tierConfig = {
    safe:     { label: 'Safe',   color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', dot: 'bg-emerald-500' },
    moderate: { label: 'Target', color: 'text-brand-600',   bg: 'bg-brand-50',   border: 'border-brand-100',   dot: 'bg-brand-500'   },
    dream:    { label: 'Dream',  color: 'text-violet-600',  bg: 'bg-violet-50',  border: 'border-violet-100',  dot: 'bg-violet-500'  },
    unknown:  { label: 'Match',  color: 'text-neutral-600', bg: 'bg-neutral-50', border: 'border-neutral-100', dot: 'bg-neutral-500' },
  }

  return (
    <motion.div variants={item} className="bg-white rounded-2xl border border-neutral-100 p-5" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
      <div className="flex items-center gap-2 mb-5">
        <Building2 size={15} className="text-violet-500" />
        <h3 className="text-sm font-bold text-neutral-900">Recommended Colleges</h3>
        <Link to="/predictions" className="ml-auto text-[10px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-0.5">
          See all <ChevronRight size={10} />
        </Link>
      </div>

      {loading && (
        <div className="py-8 flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
          <span className="text-xs text-neutral-400 font-medium">Loading recommendations...</span>
        </div>
      )}

      {!loading && recommendations.length === 0 && (
        <div className="py-8 text-center">
          <Building2 size={28} className="text-neutral-200 mx-auto mb-2" />
          <p className="text-xs font-bold text-neutral-500">Complete your profile to get recommendations</p>
          <Link to="/predictions" className="mt-2 inline-block text-xs font-bold text-brand-600 hover:underline">Use Cutoff Predictor →</Link>
        </div>
      )}

      {!loading && recommendations.length > 0 && (
        <div className="space-y-2.5">
          {recommendations.slice(0, 5).map((c, i) => {
            const tierKey = parseTier(c.tier)
            const tier = tierConfig[tierKey]
            return (
              <motion.div
                key={`${c.college_code}-${i}`}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 p-3 rounded-xl border border-neutral-100 hover:border-brand-100 hover:bg-brand-50/30 transition-all cursor-pointer group"
              >
                <div className={`w-2 h-2 rounded-full ${tier.dot} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-neutral-800 truncate group-hover:text-brand-700 transition-colors">{c.college_name}</p>
                  <p className="text-[10px] text-neutral-400 font-medium">{c.branch_name} · {c.district}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${tier.color} ${tier.bg} ${tier.border}`}>{tier.label}</span>
                  <span className="text-xs font-black text-brand-600">{c.cutoff}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

/* ── Next Actions ────────────────────────────────────────── */
function SuggestedActions() {
  const priorityConfig = {
    high: { label: 'Urgent', dot: 'bg-rose-500', pulse: true },
    medium: { label: 'Recommended', dot: 'bg-amber-500', pulse: false },
    low: { label: 'Optional', dot: 'bg-neutral-300', pulse: false },
  }
  const navigate = useNavigate()
  const { nextSteps, stage } = usePersonalization()

  // Map next steps to display-ready action items
  const STEP_ICONS = { '⚙️': FlaskConical, '📝': BookOpen, '🗺️': Map, '🎓': GraduationCap, '📚': BookOpen, '🔬': FlaskConical, '🚀': Zap, '📊': BarChart2, '🏥': Heart, '🏆': Award }
  const actions = nextSteps.slice(0, 4).map((step, i) => ({
    icon: STEP_ICONS[step.icon] || Lightbulb,
    text: step.label,
    desc: step.desc,
    priority: i === 0 ? 'high' : i === 1 ? 'medium' : 'low',
    to: step.link,
    color: ['text-rose-500', 'text-amber-500', 'text-violet-500', 'text-brand-500'][i],
    bg: ['bg-rose-50', 'bg-amber-50', 'bg-violet-50', 'bg-brand-50'][i],
    border: ['border-rose-100', 'border-amber-100', 'border-violet-100', 'border-brand-100'][i],
  }))

  return (
    <motion.div variants={item} className="bg-white rounded-2xl border border-neutral-100 p-5" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
      <div className="flex items-center gap-2 mb-5">
        <Lightbulb size={15} className="text-amber-500" />
        <h3 className="text-sm font-bold text-neutral-900">Suggested Next Steps</h3>
        <span className="ml-auto text-[9px] font-black uppercase tracking-widest text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded-full border border-neutral-100">{stage === '10th' ? '10th Stage' : stage === '12th' ? '12th Stage' : stage === 'ug' ? 'UG Stage' : stage === 'pg' ? 'PG Stage' : 'General'}</span>
      </div>
      <div className="space-y-2.5">
        {actions.map((a, i) => {
          const Icon = a.icon
          const p = priorityConfig[a.priority]
          return (
            <motion.button
              key={a.text}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ x: 4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(a.to)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border ${a.border} ${a.bg} hover:shadow-sm transition-all text-left group`}
            >
              <div className={`w-8 h-8 rounded-xl ${a.bg} border ${a.border} flex items-center justify-center shrink-0`}>
                <Icon size={15} className={a.color} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-neutral-700 group-hover:text-neutral-900 block">{a.text}</span>
                {a.desc && <span className="text-[10px] text-neutral-400 font-medium block truncate">{a.desc}</span>}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <motion.div
                  className={`w-1.5 h-1.5 rounded-full ${p.dot}`}
                  animate={p.pulse ? { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-[9px] font-bold text-neutral-400">{p.label}</span>
                <ChevronRight size={11} className="text-neutral-300 group-hover:text-neutral-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}

/* ── Profile Summary Card ────────────────────────────────── */
function ProfileSummary({ student, activeProfile, computedCutoff }) {
  const displayName = activeProfile?.name || student.name || 'Student'
  const displayStandard = activeProfile?.standard || student.standard || '12th Grade'
  const displayDomain = activeProfile?.domain || student.interests?.[0] || 'Engineering'
  const displayDistrict = activeProfile?.district || student.district || 'Tamil Nadu'
  const isDark = useThemeStore((s) => s.theme) === 'dark'

  const tags = [
    displayStandard,
    displayDomain,
    student.board || 'State Board',
    displayDistrict,
    student.community || null,
  ].filter(Boolean)

  return (
    <motion.div
      variants={item}
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f1f2e 100%)'
          : 'linear-gradient(135deg, #f0fdf4 0%, #ecfeff 50%, #f0fdfa 100%)',
        boxShadow: isDark ? '0 8px 40px rgba(0,0,0,0.2)' : '0 8px 40px rgba(20,184,166,0.08)',
        border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(20,184,166,0.15)',
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 rounded-full bg-brand-400"
            style={{
              left: `${(i % 4) * 25 + 12}%`,
              top: `${Math.floor(i / 4) * 35 + 15}%`,
            }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.8, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.25, ease: 'easeInOut' }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 via-transparent to-violet-500/5" />
      </div>

      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-1">Profile Overview</p>
            <h2 className="text-xl font-black text-neutral-900 dark:text-white">{displayName}</h2>
            <p className="text-sm text-neutral-600 dark:text-slate-400 font-medium">{displayDomain} · {displayStandard}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-violet-500 flex items-center justify-center text-lg shadow-lg"
            style={{ boxShadow: '0 0 20px rgba(20,184,166,0.4)' }}>
            🎓
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {tags.map((tag) => (
            <span key={tag} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-brand-500/10 dark:bg-white/10 border border-brand-200 dark:border-white/20 text-brand-700 dark:text-slate-300">
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Target Domain', value: displayDomain || 'Engineering', icon: '🎯' },
            { label: 'Cutoff Score', value: computedCutoff > 0 ? `${computedCutoff}/200` : 'N/A', icon: '📊' },
            { label: 'Community', value: student.community || 'N/A', icon: '🏷️' },
          ].map((stat) => (
            <div key={stat.label} className="bg-brand-500/10 dark:bg-white/5 border border-brand-200/50 dark:border-white/10 rounded-xl p-3 text-center">
              <div className="text-lg mb-1">{stat.icon}</div>
              <p className="text-xs font-black text-neutral-900 dark:text-white leading-snug">{stat.value}</p>
              <p className="text-[9px] text-neutral-500 dark:text-slate-400 font-medium mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ── Progress Indicators ─────────────────────────────────── */
function ProgressMetrics({ profileCompletion }) {
  const metrics = [
    { label: 'Profile Complete', value: profileCompletion, total: 100, icon: Activity, color: 'from-brand-400 to-cyan-400' },
    { label: 'Exam Preparation', value: Math.round(profileCompletion * 0.6), total: 100, icon: FlaskConical, color: 'from-violet-400 to-purple-400' },
    { label: 'Scholarship Hunt', value: Math.round(profileCompletion * 0.2), total: 100, icon: GraduationCap, color: 'from-amber-400 to-orange-400' },
    { label: 'Roadmap Clarity', value: Math.round(profileCompletion * 0.75), total: 100, icon: Map, color: 'from-emerald-400 to-teal-400' },
  ]
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div ref={ref} variants={item} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
      <div className="flex items-center gap-2 mb-5">
        <Activity size={15} className="text-emerald-500" />
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Progress Metrics</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((m, i) => {
          const Icon = m.icon
          return (
            <div key={m.label}>
              <div className="flex items-center gap-1.5 mb-2">
                <Icon size={11} className="text-neutral-400" />
                <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">{m.label}</span>
              </div>
              <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden mb-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${m.value}%` } : { width: 0 }}
                  transition={{ duration: 1.2, delay: i * 0.15 + 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className={`h-full rounded-full bg-gradient-to-r ${m.color}`}
                />
              </div>
              <span className="text-[10px] font-black text-neutral-600 dark:text-neutral-400">{m.value}%</span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

function DashboardHeader({ student }) {
  return (
    <div className="shrink-0 pt-1 pb-3 transition-all duration-300">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Hello, {student.loginName ? student.loginName.split(' ')[0] : (student.name ? student.name.split(' ')[0] : 'Student')}! 👋
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">Your personalized educational intelligence platform</p>
        </div>
      </div>
    </div>
  )
}
/* ── Domain Analysis Report ─────────────────────────────────── */
function DomainAnalysisReport({ student }) {
  const hasData = student?.interests?.length > 0 || student?.domain;
  
  const domains = [
    { name: 'AI & Data Science', score: 92, icon: Brain, color: 'text-brand-500', bg: 'bg-brand-50' },
    { name: 'Software Engineering', score: 85, icon: Cpu, color: 'text-sky-500', bg: 'bg-sky-50' },
    { name: 'Robotics', score: 76, icon: Zap, color: 'text-violet-500', bg: 'bg-violet-50' }
  ]

  return (
    <motion.div variants={item} className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
            <Target size={20} className="text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h3 className="font-bold text-neutral-900 dark:text-white">Domain Compatibility</h3>
            <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mt-0.5">AI Analysis Report</p>
          </div>
        </div>
        <Link to="/reports" className="text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/20 dark:hover:bg-brand-900/40 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
          Full Report <ChevronRight size={14} />
        </Link>
      </div>

      {!hasData ? (
        <div className="text-center py-8 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-700">
          <Activity size={32} className="text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
          <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400">Complete profile to generate analysis</p>
          <Link to="/onboarding" className="inline-block mt-3 text-xs font-bold text-brand-600 hover:underline">
            Update Profile &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {domains.map((d, i) => (
            <div key={i} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg ${d.bg} dark:bg-neutral-800 flex items-center justify-center`}>
                    <d.icon size={14} className={d.color} />
                  </div>
                  <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">{d.name}</span>
                </div>
                <span className="text-sm font-black text-neutral-900 dark:text-white">{d.score}%</span>
              </div>
              <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${d.score}%` }}
                  transition={{ duration: 1, delay: 0.2 + (i * 0.1) }}
                  className="h-full rounded-full bg-gradient-to-r from-violet-400 to-brand-500"
                />
              </div>
            </div>
          ))}

          <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-brand-50 to-sky-50 dark:from-brand-900/10 dark:to-sky-900/10 border border-brand-100/50 dark:border-brand-900/20">
            <div className="flex gap-3">
              <Sparkles size={18} className="text-brand-500 shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-brand-800 dark:text-brand-300 leading-relaxed">
                <strong className="font-black">AI Insight:</strong> Based on your profile, your strong foundation in logical reasoning makes Engineering and Technology fields highly compatible.
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}


/* ── Main Dashboard Page ─────────────────────────────────── */
export default function Dashboard() {
  const { student, profileCompletion, computedCutoff, profiles, activeProfileId, switchProfile, addProfile } = useStudentStore()
  const collapsed = useThemeStore((s) => s.sidebarCollapsed)
  const [isAddProfileModalOpen, setAddProfileModalOpen] = useState(false)
  const navigate = useNavigate()

  const [recommendations, setRecommendations] = useState([])
  const [recsLoading, setRecsLoading] = useState(false)

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || null

  useEffect(() => {
    if (!student.community && !student.district) return
    setRecsLoading(true)
    fetchRecommendations()
      .then(data => setRecommendations(Array.isArray(data) ? data : []))
      .catch(() => setRecommendations([]))
      .finally(() => setRecsLoading(false))
  }, [student.community, student.district, computedCutoff])

  return (
    <div className="flex flex-col h-full">
      {/* ── Greeting: fixed above the scroll area — content can never scroll behind it ── */}
      <div className={`shrink-0 px-5 lg:pr-7 ${collapsed ? 'lg:pl-20' : 'lg:pl-7'} pt-5 lg:pt-[88px] transition-all duration-300`}>
        <div className="max-w-7xl mx-auto w-full">
          <DashboardHeader student={student} />
        </div>
      </div>

      {/* ── Scrollable cards area below the greeting ── */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className={`px-5 lg:pr-7 ${collapsed ? 'lg:pl-20' : 'lg:pl-7'} transition-all duration-300`}>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-7xl mx-auto w-full space-y-6"
          >
            <AddProfileModal 
              isOpen={isAddProfileModalOpen} 
              onClose={() => setAddProfileModalOpen(false)} 
              onAdd={(prof) => addProfile(prof)} 
            />

            {/* Parent Profiles Banner */}
            <ParentProfilesBanner 
              profiles={profiles} 
              activeProfileId={activeProfileId} 
              switchProfile={switchProfile} 
              student={student} 
              navigate={navigate} 
              onAddClick={() => setAddProfileModalOpen(true)} 
            />

            {/* Complete Profile Banner */}
            <CompleteProfileBanner completion={profileCompletion} navigate={navigate} />

            {/* AI Insight */}
            <AIInsightCard student={student} computedCutoff={computedCutoff} />

            {/* Stats row */}
            <StatsRow profileCompletion={profileCompletion} computedCutoff={computedCutoff} matchedCount={recommendations.length} />

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left column - 7 cols */}
              <div className="lg:col-span-7 space-y-5">
                <ProfileSummary student={student} activeProfile={activeProfile} computedCutoff={computedCutoff} />
                <SubjectPerformance student={student} />
                <DomainAnalysisReport student={student} />
              </div>

              {/* Right column - 5 cols */}
              <div className="lg:col-span-5 space-y-5">
                <RecommendedColleges recommendations={recommendations} loading={recsLoading} />
                <SuggestedActions />
                <ProgressMetrics profileCompletion={profileCompletion} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
