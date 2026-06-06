import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Target, Calculator, TrendingUp, Building2, Zap,
  AlertCircle, CheckCircle, BarChart2, Brain,
  ArrowRight, Sparkles, RefreshCw, Link2
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import useStudentStore from '../store/useStudentStore'
import useThemeStore from '../store/useThemeStore'
import { calculateCutoff, fetchRecommendations, parseTier } from '../services/recommendationService'

const COMMUNITIES = ['OC', 'BC', 'BCM', 'MBC', 'SC', 'SCA', 'ST']
const BOARDS = ['State Board', 'CBSE', 'ICSE', 'Matriculation']

/* ── Animated Gauge ──────────────────────────────────────── */
function CutoffGauge({ value, max = 200, color }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const angle = (value / max) * 180 - 90

  return (
    <div ref={ref} className="flex flex-col items-center">
      <svg width="160" height="90" viewBox="0 0 160 90">
        <path d="M 20 80 A 60 60 0 0 1 140 80" fill="none" stroke="#f1f5f9" strokeWidth="12" strokeLinecap="round" />
        <motion.path
          d="M 20 80 A 60 60 0 0 1 140 80"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: value / max } : { pathLength: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
        <motion.line
          x1="80" y1="80" x2="80" y2="25"
          stroke="#334155" strokeWidth="2.5" strokeLinecap="round"
          initial={{ rotate: -90 }}
          animate={inView ? { rotate: angle } : { rotate: -90 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: '80px 80px' }}
        />
        <circle cx="80" cy="80" r="4" fill="#334155" />
      </svg>
      <div className="text-center -mt-2">
        <motion.p
          className="text-2xl font-black text-neutral-900"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8 }}
        >
          {value.toFixed(2)}
        </motion.p>
        <p className="text-[10px] font-bold text-neutral-400">out of {max}</p>
      </div>
    </div>
  )
}

/* ── College Category Section ────────────────────────────── */
function CollegeList({ colleges, tier }) {
  const tierConfig = {
    dream:    { label: 'Dream Colleges',  color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100', dot: 'bg-violet-500', glow: '0 0 8px rgba(139,92,246,0.4)' },
    moderate: { label: 'Target Colleges', color: 'text-brand-600',  bg: 'bg-brand-50',  border: 'border-brand-100',  dot: 'bg-brand-500',  glow: '0 0 8px rgba(20,184,166,0.4)'  },
    safe:     { label: 'Safe Colleges',   color: 'text-emerald-600',bg: 'bg-emerald-50',border: 'border-emerald-100',dot: 'bg-emerald-500',glow: '0 0 8px rgba(16,185,129,0.4)'  },
  }
  const t = tierConfig[tier]

  if (!colleges || colleges.length === 0) return null

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, type: 'spring' }}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full ${t.dot}`} style={{ boxShadow: t.glow }} />
        <h3 className={`text-sm font-black ${t.color}`}>{t.label}</h3>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${t.color} ${t.bg} ${t.border}`}>
          {colleges.length} colleges
        </span>
      </div>
      <div className="space-y-2">
        {colleges.slice(0, 5).map((c, i) => (
          <motion.div
            key={`${c.college_code}-${c.branch_name}-${i}`}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ x: 4 }}
            className={`flex items-center gap-3 p-3 rounded-xl border ${t.border} ${t.bg} cursor-pointer group`}
          >
            <Building2 size={13} className={t.color} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-neutral-800 truncate group-hover:text-neutral-900">{c.college_name}</p>
              <p className="text-[10px] text-neutral-400">{c.branch_name} · Cutoff: {c.cutoff}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs font-black ${t.color}`}>{c.district}</span>
              <ArrowRight size={11} className={`${t.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

/* ── Main Predictions Page ───────────────────────────────── */
export default function Predictions() {
  const student = useStudentStore((s) => s.student)
  const computedCutoff = useStudentStore((s) => s.computedCutoff) || 0
  const updateMarks = useStudentStore((s) => s.updateMarks)
  const updateStudentProfile = useStudentStore((s) => s.updateStudentProfile)
  const collapsed = useThemeStore((s) => s.sidebarCollapsed)

  // Pre-fill from store if available
  const [physics, setPhysics] = useState(student.physics || '')
  const [chemistry, setChemistry] = useState(student.chemistry || '')
  const [maths, setMaths] = useState(student.maths || '')
  const [community, setCommunity] = useState(student.community || 'OC')
  const [board, setBoard] = useState(student.board || 'State Board')
  const [district, setDistrict] = useState(student.district || '')

  const [predicted, setPredicted] = useState(null)
  const [calculating, setCalculating] = useState(false)
  const [error, setError] = useState(null)
  const [colleges, setColleges] = useState({ dream: [], moderate: [], safe: [] })
  const [loadingColleges, setLoadingColleges] = useState(false)

  // If marks already computed from onboarding, show result immediately
  useEffect(() => {
    if (computedCutoff > 0 && student.maths && !predicted) {
      setPredicted({
        cutoff: computedCutoff,
        community: student.community || 'OC',
        board: student.board || 'State Board',
        summary: null,
        suggestedBranches: [],
        fromStore: true,
      })
      fetchCollegeMatches(computedCutoff, student.community || 'OC')
    }
  }, [])

  const fetchCollegeMatches = async (cutoffVal, cat) => {
    setLoadingColleges(true)
    try {
      const data = await fetchRecommendations({
        cutoff: cutoffVal,
        category: cat,
        district: district || student.district || null,
      })
      const arr = Array.isArray(data) ? data : []
      setColleges({
        dream:    arr.filter(c => parseTier(c.tier) === 'dream'),
        moderate: arr.filter(c => parseTier(c.tier) === 'moderate'),
        safe:     arr.filter(c => parseTier(c.tier) === 'safe'),
      })
    } catch {
      setColleges({ dream: [], moderate: [], safe: [] })
    } finally {
      setLoadingColleges(false)
    }
  }

  const handleCalculate = async () => {
    const p = parseFloat(physics) || 0
    const c = parseFloat(chemistry) || 0
    const m = parseFloat(maths) || 0
    if (!p && !c && !m) {
      setError('Please enter at least one subject mark.')
      return
    }

    setCalculating(true)
    setError(null)

    try {
      // Save to store
      updateMarks(maths, physics, chemistry)
      updateStudentProfile({ community, board })

      const result = await calculateCutoff({ maths: m, physics: p, chemistry: c, category: community, district: district || null })
      
      setPredicted({
        cutoff: result.cutoff,
        community,
        board,
        summary: result.recommendation_summary,
        suggestedBranches: result.suggested_branches || [],
        eligibilityTier: result.eligibility_tier,
        fromStore: false,
      })

      // Fetch real college matches using the returned cutoff
      await fetchCollegeMatches(result.cutoff, community)
    } catch (err) {
      setError(err?.message || 'Failed to connect to backend. Please check your connection.')
    } finally {
      setCalculating(false)
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm font-semibold text-neutral-800 focus:outline-none focus:border-brand-400 focus:bg-white transition-all"

  return (
    <PageWrapper>
      <div className="w-full max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-3 transition-all duration-300`}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0"
            style={{ boxShadow: '0 4px 15px rgba(245,158,11,0.4)' }}>
            <Target size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-neutral-900 dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Predictions
            </h1>
            <p className="text-sm text-neutral-500">AI-powered cutoff calculator & live college matcher</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 bg-white rounded-3xl border border-neutral-100 p-6 space-y-5"
            style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}
          >
            <div className="flex items-center gap-2">
              <Calculator size={16} className="text-amber-500" />
              <h2 className="text-sm font-black text-neutral-900">Enter Your Marks</h2>
              {computedCutoff > 0 && (
                <span className="ml-auto text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-100">
                  Saved: {computedCutoff}/200
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-1.5">Physics (out of 100)</label>
                <input type="number" max="100" min="0" value={physics} onChange={(e) => setPhysics(e.target.value)} placeholder="e.g. 90" className={inputClass} />
              </div>
              <div>
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-1.5">Chemistry (out of 100)</label>
                <input type="number" max="100" min="0" value={chemistry} onChange={(e) => setChemistry(e.target.value)} placeholder="e.g. 93" className={inputClass} />
              </div>
              <div>
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-1.5">Maths (out of 100)</label>
                <input type="number" max="100" min="0" value={maths} onChange={(e) => setMaths(e.target.value)} placeholder="e.g. 98" className={inputClass} />
              </div>
              <div>
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-1.5">Community</label>
                <select value={community} onChange={(e) => setCommunity(e.target.value)} className={inputClass}>
                  {COMMUNITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-1.5">District (optional)</label>
                <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="e.g. Chennai" className={inputClass} />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-2 p-3 bg-rose-50 rounded-xl border border-rose-100">
                <AlertCircle size={14} className="text-rose-500 shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-rose-700">{error}</p>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCalculate}
              disabled={calculating}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black text-sm shadow-lg transition-all"
              style={{ boxShadow: '0 4px 20px rgba(245,158,11,0.4)' }}
            >
              {calculating ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  AI Calculating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles size={15} />
                  Calculate & Predict
                </span>
              )}
            </motion.button>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">TNEA Formula</p>
              <p className="text-xs text-amber-700 font-medium">Cutoff = Maths + (Physics/2) + (Chemistry/2)</p>
              <p className="text-[10px] text-amber-600 mt-1">Max Cutoff = 200 · Marks out of 100 each</p>
            </div>
          </motion.div>

          {/* Results */}
          <div className="lg:col-span-7 space-y-5">
            <AnimatePresence mode="wait">
              {predicted ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 250, damping: 28 }}
                  className="space-y-4"
                >
                  {/* Cutoff Result */}
                  <div className="bg-white rounded-3xl border border-neutral-100 p-6" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Your Predicted Cutoff</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-4xl font-black text-neutral-900">{predicted.cutoff.toFixed(2)}</span>
                          <div>
                            <p className="text-xs font-bold text-brand-600">({predicted.community})</p>
                            {predicted.eligibilityTier && (
                              <p className="text-[10px] text-neutral-400">{predicted.eligibilityTier}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <CutoffGauge value={predicted.cutoff} color="#14b8a6" />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Raw Cutoff', value: predicted.cutoff.toFixed(2), color: 'text-brand-600' },
                        { label: 'Community', value: predicted.community, color: 'text-violet-600' },
                        { label: 'Source', value: predicted.fromStore ? 'Saved' : 'New Calc', color: 'text-amber-600' },
                      ].map((s) => (
                        <div key={s.label} className="text-center p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                          <p className={`text-sm font-black ${s.color}`}>{s.value}</p>
                          <p className="text-[9px] text-neutral-400 font-medium">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Recommendation Summary */}
                  {predicted.summary && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="p-5 rounded-2xl bg-gradient-to-r from-brand-50 to-violet-50 border border-brand-100"
                    >
                      <div className="flex items-start gap-3">
                        <Brain size={18} className="text-brand-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-black text-brand-700 mb-1">AI Recommendation</p>
                          <p className="text-xs text-brand-600 leading-relaxed">
                            {predicted.summary.replace(/\*\*/g, '')}
                          </p>
                          {predicted.suggestedBranches?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {predicted.suggestedBranches.map(b => (
                                <span key={b} className="text-[10px] font-bold px-2 py-1 bg-brand-100 text-brand-700 rounded-lg">{b}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* College Lists */}
                  <div className="bg-white rounded-2xl border border-neutral-100 p-6 space-y-5" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-brand-500" />
                      <h3 className="text-sm font-black text-neutral-900">Live College Matches</h3>
                      {loadingColleges && (
                        <div className="ml-auto flex items-center gap-1.5 text-[10px] font-bold text-brand-500">
                          <RefreshCw size={10} className="animate-spin" /> Loading...
                        </div>
                      )}
                    </div>
                    {!loadingColleges && colleges.dream.length === 0 && colleges.moderate.length === 0 && colleges.safe.length === 0 ? (
                      <div className="py-8 text-center">
                        <Building2 size={32} className="text-neutral-200 mx-auto mb-3" />
                        <p className="text-sm text-neutral-400 font-medium">No college matches found.</p>
                        <p className="text-xs text-neutral-400 mt-1">Try changing your district or community filters.</p>
                      </div>
                    ) : (
                      <>
                        <CollegeList colleges={colleges.dream}    tier="dream"    />
                        <CollegeList colleges={colleges.moderate} tier="moderate" />
                        <CollegeList colleges={colleges.safe}     tier="safe"     />
                      </>
                    )}
                    <Link to="/colleges" className="flex items-center justify-center gap-2 py-3 text-xs font-bold text-brand-600 hover:text-brand-700 border-t border-neutral-100 mt-2">
                      <Link2 size={12} /> Browse Full College Directory
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-64 flex flex-col items-center justify-center bg-white rounded-3xl border border-neutral-100 gap-4"
                  style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"
                    style={{ boxShadow: '0 0 20px rgba(245,158,11,0.4)' }}
                  >
                    <Target size={24} className="text-white" />
                  </motion.div>
                  <div className="text-center">
                    <p className="text-sm font-black text-neutral-700">Enter your marks to see predictions</p>
                    <p className="text-xs text-neutral-400 mt-1">AI will match real colleges from the TNEA database</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
