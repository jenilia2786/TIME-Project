import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, ChevronRight, Brain, Cpu, Shield, Database, Zap } from 'lucide-react'

const TRENDING_DOMAINS = [
  {
    id: 'ai',
    title: 'Artificial Intelligence',
    icon: Brain,
    growth: '+65%',
    pct: 92,
    color: 'from-teal-500 to-cyan-500',
    accent: '#14b8a6',
    glow: 'rgba(20,184,166,0.35)',
    jobs: '2.4M new roles by 2030',
    desc: 'The most explosive field of this decade. AI is transforming every industry.',
    courses: [
      { name: 'AI Engineering', demand: 96, tag: '🔥 Explosive' },
      { name: 'Machine Learning', demand: 91, tag: '📈 Very High' },
      { name: 'Generative AI (GenAI)', demand: 95, tag: '🔥 Explosive' },
      { name: 'Computer Vision', demand: 83, tag: '📈 High' },
      { name: 'NLP & Language AI', demand: 87, tag: '📈 Very High' },
    ],
  },
  {
    id: 'robotics',
    title: 'Robotics & Automation',
    icon: Cpu,
    growth: '+55%',
    pct: 86,
    color: 'from-violet-500 to-purple-600',
    accent: '#8b5cf6',
    glow: 'rgba(139,92,246,0.35)',
    jobs: '1.8M new roles by 2030',
    desc: 'Robots are entering healthcare, manufacturing, and agriculture.',
    courses: [
      { name: 'Robotics Engineering', demand: 88, tag: '📈 Very High' },
      { name: 'Automation Engineering', demand: 82, tag: '📈 High' },
      { name: 'Mechatronics', demand: 78, tag: '📈 High' },
      { name: 'Drone Technology', demand: 85, tag: '📈 Very High' },
    ],
  },
  {
    id: 'cyber',
    title: 'Cybersecurity',
    icon: Shield,
    growth: '+44%',
    pct: 78,
    color: 'from-sky-500 to-blue-600',
    accent: '#0ea5e9',
    glow: 'rgba(14,165,233,0.35)',
    jobs: '3.5M unfilled roles globally',
    desc: 'Every company needs security experts. Roles are massively understaffed.',
    courses: [
      { name: 'Ethical Hacking (CEH)', demand: 90, tag: '📈 Very High' },
      { name: 'Network Security', demand: 82, tag: '📈 High' },
      { name: 'Cloud Security', demand: 88, tag: '📈 Very High' },
      { name: 'Digital Forensics', demand: 75, tag: '📈 High' },
    ],
  },
  {
    id: 'data',
    title: 'Data Science',
    icon: Database,
    growth: '+52%',
    pct: 82,
    color: 'from-emerald-500 to-teal-600',
    accent: '#10b981',
    glow: 'rgba(16,185,129,0.35)',
    jobs: '11.5M jobs in India by 2026',
    desc: 'Data is the new oil. Companies need experts to mine and interpret it.',
    courses: [
      { name: 'Data Science & Analytics', demand: 90, tag: '🔥 Explosive' },
      { name: 'Business Intelligence', demand: 78, tag: '📈 High' },
      { name: 'Big Data Engineering', demand: 82, tag: '📈 Very High' },
      { name: 'Data Visualization', demand: 72, tag: '📈 High' },
    ],
  },
  {
    id: 'energy',
    title: 'Renewable Energy',
    icon: Zap,
    growth: '+38%',
    pct: 66,
    color: 'from-amber-500 to-orange-500',
    accent: '#f59e0b',
    glow: 'rgba(245,158,11,0.35)',
    jobs: '30M jobs globally by 2030',
    desc: 'Solar, wind, and clean energy will power the next generation of economies.',
    courses: [
      { name: 'Solar Energy Engineering', demand: 78, tag: '📈 High' },
      { name: 'Wind Power Systems', demand: 72, tag: '📈 High' },
      { name: 'Energy Storage & Batteries', demand: 80, tag: '📈 Very High' },
      { name: 'Green Building Design', demand: 68, tag: '📈 Growing' },
    ],
  },
]

export default function TrendingFieldsExplorer() {
  const [activeDomain, setActiveDomain] = useState(null)
  const active = TRENDING_DOMAINS.find(d => d.id === activeDomain)

  return (
    <div className="flex flex-col gap-6">
      {/* ── Domain Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {TRENDING_DOMAINS.map((domain, i) => {
          const isActive = activeDomain === domain.id
          return (
            <motion.button
              key={domain.id}
              onClick={() => setActiveDomain(isActive ? null : domain.id)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.4, delay: i * 0.07, type: 'spring', bounce: 0.25 }}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`relative flex flex-col gap-3 p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 ${
                isActive
                  ? 'border-transparent shadow-xl'
                  : 'border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-neutral-300 dark:hover:border-slate-600'
              }`}
              style={isActive ? {
                background: `linear-gradient(135deg, ${domain.accent}18, ${domain.accent}08)`,
                borderColor: domain.accent,
                boxShadow: `0 8px 32px ${domain.glow}`,
              } : {}}
            >
              {/* Active ring */}
              {isActive && (
                <motion.div
                  layoutId="activeDomainRing"
                  className="absolute inset-0 rounded-2xl border-2"
                  style={{ borderColor: domain.accent }}
                  transition={{ type: 'spring', bounce: 0.2 }}
                />
              )}

              {/* Top */}
              <div className="flex items-start justify-between">
                <domain.icon size={32} style={{ color: domain.accent }} />
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                  {domain.growth}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-neutral-900 dark:text-white leading-tight">{domain.title}</h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-snug">{domain.desc}</p>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Demand Index</span>
                  <span className="text-xs font-black text-neutral-700 dark:text-neutral-300">{domain.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-neutral-100 dark:bg-slate-700 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${domain.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: i * 0.1 + 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={`h-full rounded-full bg-gradient-to-r ${domain.color}`}
                    style={{ boxShadow: `0 0 8px ${domain.glow}` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                  <TrendingUp size={10} className="text-emerald-500" />
                  {domain.jobs}
                </p>
                <motion.div
                  animate={{ x: isActive ? 3 : 0 }}
                  className="text-xs font-bold flex items-center gap-0.5"
                  style={{ color: domain.accent }}
                >
                  {isActive ? 'Close' : 'Explore'} <ChevronRight size={12} />
                </motion.div>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* ── Expanded Courses Panel ── */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div
              className="p-5 md:p-6 rounded-2xl border"
              style={{
                background: `linear-gradient(135deg, ${active.accent}10, ${active.accent}05)`,
                borderColor: `${active.accent}40`,
                boxShadow: `0 8px 32px ${active.glow}30`,
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <active.icon size={36} style={{ color: active.accent }} />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: active.accent }}>
                    Trending Courses Inside
                  </p>
                  <h3 className="font-extrabold text-lg text-neutral-900 dark:text-white">{active.title}</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {active.courses.map((course, i) => (
                  <motion.div
                    key={course.name}
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: i * 0.07 }}
                    className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-white/80 dark:border-slate-700 shadow-sm"
                    style={{ boxShadow: `0 4px 16px ${active.glow}20` }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-white leading-snug">{course.name}</h4>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${active.accent}20`, color: active.accent }}>
                      {course.tag}
                    </span>
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Job Demand</span>
                        <span className="text-xs font-black" style={{ color: active.accent }}>{course.demand}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-neutral-100 dark:bg-slate-700 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${course.demand}%` }}
                          transition={{ duration: 0.8, delay: i * 0.06 + 0.2, ease: [0.22, 1, 0.36, 1] }}
                          className={`h-full rounded-full bg-gradient-to-r ${active.color}`}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
