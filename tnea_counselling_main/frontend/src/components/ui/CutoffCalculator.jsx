import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, BookOpen, AlertCircle } from 'lucide-react'

const CATEGORIES = [
  { name: 'OC (Open Category)', cutoffRange: '198.25 – 200', color: 'from-teal-500 to-cyan-500', accent: '#14b8a6', note: 'Highest competition. Requires near-perfect scores.' },
  { name: 'BC (Backward Class)', cutoffRange: '192.50 – 197.75', color: 'from-sky-500 to-blue-500', accent: '#0ea5e9', note: '27% reservation. Most populated category.' },
  { name: 'MBC (Most Backward Class)', cutoffRange: '185.00 – 193.25', color: 'from-violet-500 to-purple-500', accent: '#8b5cf6', note: 'Multiple sub-categories with separate cutoffs.' },
  { name: 'SC (Scheduled Caste)', cutoffRange: '155.00 – 178.50', color: 'from-emerald-500 to-green-500', accent: '#10b981', note: '15% reservation. Government-mandated priority.' },
  { name: 'ST (Scheduled Tribe)', cutoffRange: '135.00 – 160.25', color: 'from-amber-500 to-orange-500', accent: '#f59e0b', note: '7.5% reservation. Lowest minimum cutoff.' },
]

function Mark({ label, value, onChange, color }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">{label}</span>
        <span className="text-sm font-black" style={{ color }}>{value}</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} ${value}%, #e2e8f0 ${value}%)`,
          outline: 'none',
        }}
      />
    </div>
  )
}

export default function CutoffCalculator() {
  const [maths, setMaths] = useState(90)
  const [physics, setPhysics] = useState(88)
  const [chemistry, setChemistry] = useState(85)

  // Tamil Nadu Engineering Cutoff formula
  const cutoff = ((maths * 2) + physics + chemistry) / 4
  const cutoffDisplay = cutoff.toFixed(2)

  const getGrade = (val) => {
    if (val >= 195) return { label: 'Excellent!', color: '#10b981', emoji: '🏆' }
    if (val >= 180) return { label: 'Very Good', color: '#14b8a6', emoji: '⭐' }
    if (val >= 160) return { label: 'Good', color: '#0ea5e9', emoji: '👍' }
    if (val >= 140) return { label: 'Average', color: '#f59e0b', emoji: '📚' }
    return { label: 'Needs Improvement', color: '#f43f5e', emoji: '💪' }
  }

  const grade = getGrade(cutoff)
  const pct = (cutoff / 200) * 100

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ── Formula Explainer ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-5 md:p-6 rounded-2xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
            <BookOpen size={15} className="text-white" />
          </div>
          <h3 className="font-extrabold text-sm text-neutral-900 dark:text-white">How Cutoff is Calculated</h3>
        </div>

        {/* Formula visual */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border border-teal-100 dark:border-teal-800 mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-teal-600 mb-3">TNEA Cutoff Formula</p>
          <div className="flex flex-wrap items-center gap-2 text-sm font-extrabold text-neutral-800 dark:text-white">
            <div className="flex flex-col items-center px-3 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-teal-100 dark:border-slate-700">
              <span className="text-teal-600 text-xs">Maths</span>
              <span>÷ 2</span>
            </div>
            <span className="text-neutral-400">+</span>
            <div className="flex flex-col items-center px-3 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-sky-100 dark:border-slate-700">
              <span className="text-sky-600 text-xs">Physics</span>
              <span>÷ 4</span>
            </div>
            <span className="text-neutral-400">+</span>
            <div className="flex flex-col items-center px-3 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-violet-100 dark:border-slate-700">
              <span className="text-violet-600 text-xs">Chemistry</span>
              <span>÷ 4</span>
            </div>
            <span className="text-neutral-400">=</span>
            <div className="flex flex-col items-center px-3 py-2 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-md">
              <span className="text-teal-100 text-xs">Cutoff</span>
              <span className="text-white">/ 200</span>
            </div>
          </div>
          <p className="text-xs text-teal-600 mt-3 font-semibold">
            Maths is weighted double — it has a 100 mark contribution out of 200.
          </p>
        </div>

        {/* Key notes */}
        <div className="space-y-2">
          {[
            'Maximum cutoff is 200 marks',
            'Biology group uses Bio instead of Maths (same formula)',
            'Cutoff is used for TNEA Engineering counselling',
            'Different cutoffs apply for each college & branch',
          ].map((note, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-400">
              <AlertCircle size={11} className="text-teal-500 mt-0.5 shrink-0" />
              {note}
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Live Calculator ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
        className="p-5 md:p-6 rounded-2xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
            <Calculator size={15} className="text-white" />
          </div>
          <h3 className="font-extrabold text-sm text-neutral-900 dark:text-white">Try the Calculator</h3>
        </div>

        {/* Sliders */}
        <div className="space-y-5 mb-6">
          <Mark label="📐 Maths (out of 100)" value={maths} onChange={setMaths} color="#14b8a6" />
          <Mark label="⚛️ Physics (out of 100)" value={physics} onChange={setPhysics} color="#0ea5e9" />
          <Mark label="🧪 Chemistry (out of 100)" value={chemistry} onChange={setChemistry} color="#8b5cf6" />
        </div>

        {/* Result */}
        <motion.div
          key={cutoffDisplay}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="p-4 rounded-2xl text-center"
          style={{ background: `${grade.color}12`, border: `1px solid ${grade.color}30` }}
        >
          <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: grade.color }}>
            Your Estimated Cutoff
          </p>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-4xl font-black" style={{ color: grade.color, fontFamily: "'Space Grotesk', sans-serif" }}>
              {cutoffDisplay}
            </span>
            <span className="text-lg text-neutral-400">/200</span>
          </div>
          <div className="h-2 rounded-full bg-neutral-100 dark:bg-slate-700 overflow-hidden mb-2">
            <motion.div
              className="h-full rounded-full"
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: grade.color }}
            />
          </div>
          <span className="text-sm font-bold">{grade.emoji} {grade.label}</span>
        </motion.div>
      </motion.div>

      {/* ── Category Cutoffs ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-2 p-5 md:p-6 rounded-2xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm"
      >
        <h3 className="font-extrabold text-sm text-neutral-900 dark:text-white mb-4">
          📊 Typical Category-wise Cutoff Ranges (Engineering — Top Colleges)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="p-4 rounded-xl border dark:border-slate-700"
              style={{ background: `${cat.accent}08`, borderColor: `${cat.accent}25` }}
            >
              <div className={`h-1 w-full rounded-full bg-gradient-to-r ${cat.color} mb-3`} />
              <p className="text-[10px] font-black uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-1">{cat.name}</p>
              <p className="text-base font-extrabold" style={{ color: cat.accent }}>{cat.cutoffRange}</p>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 leading-snug">{cat.note}</p>
            </motion.div>
          ))}
        </div>
        <p className="text-[10px] text-neutral-400 mt-3">
          * These are indicative ranges for top-tier engineering colleges. Actual cutoffs vary by college, branch, and year.
        </p>
      </motion.div>
    </div>
  )
}
