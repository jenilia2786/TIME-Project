import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Smartphone, LayoutDashboard, Brain, User, Sparkles, ArrowRight, Zap, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

/* ─── Journey Step Definitions ───────────────────────────────── */
const STEPS = [
  {
    key: 'login',
    index: 0,
    icon: Smartphone,
    emoji: '📱',
    label: 'Login',
    phase: 'Confusion',
    phaseColor: '#94a3b8',
    color: 'from-slate-500 to-violet-600',
    accent: '#8b5cf6',
    glow: 'rgba(139,92,246,0.6)',
    glowSoft: 'rgba(139,92,246,0.15)',
    bg: 'from-violet-950/40 via-slate-900/60 to-slate-950/80',
    story: 'Every journey begins with a single step. You arrive uncertain — a sea of options, no map, no guide.',
    storyTitle: 'The Beginning',
    mood: '😟',
    moodLabel: 'Confused',
    characterScale: 0.55,
    characterGlow: '#7c3aed',
    floatingSymbols: ['?', '📚', '🎓', '?', '💭'],
    highlights: ['Zero barriers — login in 30 seconds', 'Mobile number + date of birth only', 'No password, no registration hassle'],
    panelVisual: 'login',
    confettiColor: '#8b5cf6',
  },
  {
    key: 'explore',
    index: 1,
    icon: LayoutDashboard,
    emoji: '🗺️',
    label: 'Explore',
    phase: 'Exploration',
    phaseColor: '#0ea5e9',
    color: 'from-sky-500 to-blue-600',
    accent: '#0ea5e9',
    glow: 'rgba(14,165,233,0.6)',
    glowSoft: 'rgba(14,165,233,0.15)',
    bg: 'from-sky-950/40 via-slate-900/60 to-slate-950/80',
    story: 'The map unfolds. 11 domains, 500+ colleges, countless paths. Curiosity sparks — you start exploring freely.',
    storyTitle: 'Curiosity Awakens',
    mood: '🤔',
    moodLabel: 'Curious',
    characterScale: 0.65,
    characterGlow: '#0284c7',
    floatingSymbols: ['🏫', '🌐', '📊', '🔍', '🗺️'],
    highlights: ['Browse 11 parent educational domains', 'Discover 500+ colleges across Tamil Nadu', 'Chat with AI without any profile setup'],
    panelVisual: 'explore',
    confettiColor: '#0ea5e9',
  },
  {
    key: 'ai',
    index: 2,
    icon: Brain,
    emoji: '🤖',
    label: 'AI Guidance',
    phase: 'Guidance',
    phaseColor: '#14b8a6',
    color: 'from-teal-500 to-cyan-500',
    accent: '#14b8a6',
    glow: 'rgba(20,184,166,0.6)',
    glowSoft: 'rgba(20,184,166,0.15)',
    bg: 'from-teal-950/40 via-slate-900/60 to-slate-950/80',
    story: 'An AI mentor appears. Purpose-built for Tamil Nadu education, it answers every question — colleges, careers, scholarships.',
    storyTitle: 'The AI Mentor Arrives',
    mood: '😊',
    moodLabel: 'Guided',
    characterScale: 0.75,
    characterGlow: '#0d9488',
    floatingSymbols: ['🤖', '💡', '🧠', '⚡', '✨'],
    highlights: ['Ask anything about colleges & careers', 'Tamil Nadu-specific guidance always', 'No generic answers — hyper-focused'],
    panelVisual: 'ai',
    confettiColor: '#14b8a6',
  },
  {
    key: 'profile',
    index: 3,
    icon: User,
    emoji: '👤',
    label: 'Profile',
    phase: 'Understanding',
    phaseColor: '#f43f5e',
    color: 'from-rose-500 to-pink-500',
    accent: '#f43f5e',
    glow: 'rgba(244,63,94,0.6)',
    glowSoft: 'rgba(244,63,94,0.15)',
    bg: 'from-rose-950/40 via-slate-900/60 to-slate-950/80',
    story: 'You reveal yourself — interests, strengths, dreams. In under 5 minutes, you build your learning identity.',
    storyTitle: 'Identity Takes Shape',
    mood: '😄',
    moodLabel: 'Growing',
    characterScale: 0.85,
    characterGlow: '#e11d48',
    floatingSymbols: ['🌟', '📝', '🎯', '💪', '🏆'],
    highlights: ['Academic standard, board & district', 'Domains of interest & career goals', 'Unlock full AI personalization'],
    panelVisual: 'profile',
    confettiColor: '#f43f5e',
  },
  {
    key: 'personalized',
    index: 4,
    icon: Sparkles,
    emoji: '✨',
    label: 'Personalized',
    phase: 'Confidence',
    phaseColor: '#f59e0b',
    color: 'from-amber-400 to-orange-500',
    accent: '#f59e0b',
    glow: 'rgba(245,158,11,0.8)',
    glowSoft: 'rgba(245,158,11,0.2)',
    bg: 'from-amber-950/40 via-slate-900/60 to-slate-950/80',
    story: 'Everything transforms. Your dashboard is now uniquely yours — matched colleges, AI roadmaps, scholarships aligned to your goals.',
    storyTitle: 'Destination Reached 🏆',
    mood: '🥳',
    moodLabel: 'Confident',
    characterScale: 1.0,
    characterGlow: '#d97706',
    floatingSymbols: ['🏆', '🌟', '🎓', '✨', '🚀'],
    highlights: ['College matches ranked for your profile', 'AI-powered compatibility scores', 'Visual career roadmap — 10th to dream career'],
    panelVisual: 'personalized',
    confettiColor: '#f59e0b',
    isFinal: true,
  },
]

/* ─── Floating Particle ──────────────────────────────────────── */
function FloatingParticle({ accent, index, count }) {
  const angle = (index / count) * Math.PI * 2
  const radius = 60 + Math.random() * 80
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full pointer-events-none"
      style={{ background: accent, left: '50%', top: '50%' }}
      animate={{
        x: [0, Math.cos(angle) * radius, Math.cos(angle + 1) * (radius * 0.7), 0],
        y: [0, Math.sin(angle) * radius * 0.4, Math.sin(angle + 2) * (radius * 0.3), 0],
        opacity: [0, 0.8, 0.4, 0],
        scale: [0, 1.5, 0.8, 0],
      }}
      transition={{
        duration: 3 + index * 0.3,
        repeat: Infinity,
        delay: index * 0.2,
        ease: 'easeInOut',
      }}
    />
  )
}

/* ─── Evolving Character SVG ─────────────────────────────────── */
function EvolvingCharacter({ step, isActive }) {
  const scale = step.characterScale
  const accent = step.accent
  const glow = step.characterGlow
  const isFinal = step.isFinal

  return (
    <div className="relative flex flex-col items-center" style={{ height: 85 }}>
      {/* Glow aura behind character */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        animate={{
          width: isFinal ? [80, 110, 80] : [50, 70, 50],
          height: isFinal ? [80, 110, 80] : [50, 70, 50],
          opacity: isActive ? [0.3, 0.6, 0.3] : 0.15,
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: `radial-gradient(circle, ${glow}80, transparent 70%)`,
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />

      {/* Character body */}
      <motion.div
        className="absolute bottom-0 left-1/2"
        style={{ transform: 'translateX(-50%)' }}
        animate={{ scale, y: isActive ? [-2, 2, -2] : 0 }}
        transition={{ scale: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }, y: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
      >
        <svg width="48" height="80" viewBox="0 0 48 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Shadow */}
          <ellipse cx="24" cy="78" rx={10 * scale} ry="2" fill={accent} opacity="0.2" />

          {/* Legs */}
          <motion.rect
            x="14" y="55" width="8" height={isFinal ? 22 : 18} rx="4"
            fill={accent} opacity="0.8"
            animate={isActive ? { rotate: [-8, 8, -8] } : {}}
            transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '18px 55px' }}
          />
          <motion.rect
            x="26" y="55" width="8" height={isFinal ? 22 : 18} rx="4"
            fill={accent} opacity="0.8"
            animate={isActive ? { rotate: [8, -8, 8] } : {}}
            transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '30px 55px' }}
          />

          {/* Body */}
          <rect
            x="12" y={isFinal ? 22 : 28} width="24"
            height={isFinal ? 34 : 28}
            rx="6"
            fill={`url(#bodyGrad${step.index})`}
          />

          {/* Body gradient */}
          <defs>
            <linearGradient id={`bodyGrad${step.index}`} x1="12" y1="22" x2="36" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={accent} />
              <stop offset="100%" stopColor={glow} />
            </linearGradient>
          </defs>

          {/* Arms */}
          {isFinal ? (
            <>
              <motion.line x1="12" y1="35" x2="2" y2="28" stroke={accent} strokeWidth="5" strokeLinecap="round"
                animate={{ rotate: [0, -20, 0] }} transition={{ duration: 0.8, repeat: Infinity }}
                style={{ transformOrigin: '12px 35px' }}
              />
              <motion.line x1="36" y1="35" x2="46" y2="28" stroke={accent} strokeWidth="5" strokeLinecap="round"
                animate={{ rotate: [0, 20, 0] }} transition={{ duration: 0.8, repeat: Infinity }}
                style={{ transformOrigin: '36px 35px' }}
              />
            </>
          ) : (
            <>
              <line x1="12" y1="35" x2="4" y2="44" stroke={accent} strokeWidth="4" strokeLinecap="round" opacity="0.8" />
              <line x1="36" y1="35" x2="44" y2="44" stroke={accent} strokeWidth="4" strokeLinecap="round" opacity="0.8" />
            </>
          )}

          {/* Head */}
          <circle cx="24" cy={isFinal ? 14 : 18} r={isFinal ? 12 : 10}
            fill={`url(#headGrad${step.index})`}
            style={{ filter: isActive ? `drop-shadow(0 0 8px ${glow})` : 'none' }}
          />
          <defs>
            <radialGradient id={`headGrad${step.index}`} cx="40%" cy="35%">
              <stop offset="0%" stopColor="white" stopOpacity="0.3" />
              <stop offset="100%" stopColor={accent} />
            </radialGradient>
          </defs>

          {/* Face — changes by step */}
          {step.index === 0 && (
            // Confused/sad
            <g>
              <circle cx="20" cy={16} r="1.5" fill="white" opacity="0.9" />
              <circle cx="28" cy={16} r="1.5" fill="white" opacity="0.9" />
              <path d="M 19 22 Q 24 19 29 22" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8" />
              {/* Sweat drop */}
              <motion.ellipse cx="33" cy={10} rx="1.5" ry="2.5" fill="#60a5fa" opacity="0.7"
                animate={{ y: [0, 3, 0] }} transition={{ duration: 1.2, repeat: Infinity }} />
            </g>
          )}
          {step.index === 1 && (
            // Curious
            <g>
              <circle cx="20" cy={16} r="2" fill="white" opacity="0.9" />
              <circle cx="28" cy={16} r="2" fill="white" opacity="0.9" />
              <path d="M 19 22 Q 24 23 29 22" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8" />
              {/* Raised eyebrow */}
              <path d="M 18 13 Q 21 11 23 13" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7" />
            </g>
          )}
          {step.index === 2 && (
            // Guided / sparkle eyes
            <g>
              <motion.circle cx="20" cy={16} r="2" fill="white"
                animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
              <motion.circle cx="28" cy={16} r="2" fill="white"
                animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }} />
              <path d="M 18 22 Q 24 25 30 22" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.9" />
            </g>
          )}
          {step.index === 3 && (
            // Confident
            <g>
              <circle cx="20" cy={16} r="2.5" fill="white" opacity="0.95" />
              <circle cx="28" cy={16} r="2.5" fill="white" opacity="0.95" />
              <path d="M 18 22 Q 24 27 30 22" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9" />
            </g>
          )}
          {step.index === 4 && (
            // Happy / stars in eyes
            <g>
              <text x="17" y={19} fontSize="6" fill="white" textAnchor="middle">★</text>
              <text x="31" y={19} fontSize="6" fill="white" textAnchor="middle">★</text>
              <path d="M 17 23 Q 24 29 31 23" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.95" />
              {/* Crown */}
              <motion.g animate={{ y: [-1, 1, -1] }} transition={{ duration: 1, repeat: Infinity }}>
                <path d="M 14 4 L 17 8 L 24 4 L 31 8 L 34 4 L 34 8 L 14 8 Z" fill="#fbbf24" opacity="0.95" />
              </motion.g>
            </g>
          )}
        </svg>

        {/* Final step: success ring */}
        {isFinal && isActive && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ border: `2px solid ${accent}`, borderRadius: '50%', width: 48, height: 48, top: 4, left: 0 }}
          />
        )}
      </motion.div>

      {/* Mood bubble */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 text-base select-none pointer-events-none"
        animate={{ y: isActive ? [-4, 0, -4] : 0, opacity: isActive ? 1 : 0.5 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        {step.mood}
      </motion.div>
    </div>
  )
}

/* ─── Curved SVG Path ────────────────────────────────────────── */
function CurvedPath({ activeStep, steps }) {
  const pathRef = useRef(null)
  const totalSteps = steps.length

  // Build a smooth serpentine SVG path through 5 waypoints
  const W = 800
  const H = 70
  const pts = steps.map((_, i) => ({
    x: 80 + (i / (totalSteps - 1)) * (W - 160),
    y: 35 + (i % 2 === 0 ? -12 : 12),
  }))

  // Smooth curve through all points
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const mx = (pts[i].x + pts[i + 1].x) / 2
    d += ` Q ${mx} ${pts[i].y} ${mx} ${(pts[i].y + pts[i + 1].y) / 2}`
    d += ` Q ${mx} ${pts[i + 1].y} ${pts[i + 1].x} ${pts[i + 1].y}`
  }

  const activeColor = steps[activeStep].accent
  const progressPct = activeStep / (steps.length - 1)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H, overflow: 'visible' }}>
      <defs>
        <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          {steps.map((s, i) => (
            <stop key={s.key} offset={`${(i / (steps.length - 1)) * 100}%`} stopColor={s.accent} stopOpacity="0.6" />
          ))}
        </linearGradient>
        <filter id="pathGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="nodeGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Base dim path */}
      <path d={d} strokeWidth="3" fill="none" strokeLinecap="round" className="stroke-neutral-200 dark:stroke-white/10" />

      {/* Glowing gradient path */}
      <motion.path
        d={d} stroke="url(#pathGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round"
        filter="url(#pathGlow)"
        strokeDasharray="8 4"
        animate={{ strokeDashoffset: [0, -24] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />

      {/* Progress fill up to active step */}
      <motion.path
        d={d} stroke={activeColor} strokeWidth="3.5" fill="none" strokeLinecap="round"
        filter="url(#pathGlow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: progressPct + 0.01 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ opacity: 0.9 }}
      />

      {/* Moving energy pulse along path */}
      {[0, 0.3, 0.6].map((offset, i) => (
        <motion.circle key={i} r="4" fill={activeColor} filter="url(#nodeGlow)"
          animate={{ offsetDistance: ['0%', '100%'] }}
          transition={{ duration: 3, delay: offset * 3, repeat: Infinity, ease: 'linear' }}
          style={{ offsetPath: `path("${d}")`, opacity: 0.8 - i * 0.2 }}
        />
      ))}

      {/* Step nodes */}
      {steps.map((s, i) => {
        const isActive = i === activeStep
        const isPast = i < activeStep
        return (
          <g key={s.key}>
            {/* Outer glow ring for active */}
            {isActive && (
              <motion.circle
                cx={pts[i].x} cy={pts[i].y} r={22}
                fill="none" stroke={s.accent} strokeWidth="2"
                animate={{ r: [18, 26, 18], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
            {/* Node bg */}
            <circle
              cx={pts[i].x} cy={pts[i].y} r={isActive ? 16 : 12}
              fill={isActive || isPast ? s.accent : 'rgba(255,255,255,0.08)'}
              stroke={s.accent}
              strokeWidth={isActive ? 3 : 1.5}
              opacity={isActive ? 1 : isPast ? 0.85 : 0.4}
              filter={isActive ? 'url(#nodeGlow)' : 'none'}
              style={{ transition: 'all 0.4s' }}
            />
            {/* Step number or check */}
            <text
              x={pts[i].x} y={pts[i].y + 4}
              textAnchor="middle" fontSize={isActive ? 10 : 8}
              fontWeight="900"
              className={isActive || isPast ? "fill-white" : "fill-neutral-500 dark:fill-white/50"}
            >
              {isPast ? '✓' : i + 1}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* ─── Panel Visual Components ────────────────────────────────── */
function PanelVisual({ step }) {
  if (step.panelVisual === 'login') return (
    <div className="flex items-center justify-center h-full">
      <motion.div className="relative" animate={{ y: [-4, 4, -4] }} transition={{ duration: 2, repeat: Infinity }}>
        <div className="w-20 h-32 rounded-2xl border-2 border-violet-400/50 bg-violet-900/30 flex flex-col items-center justify-center gap-2 relative overflow-hidden">
          <motion.div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 to-transparent"
            animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} />
          <Smartphone size={24} className="text-violet-400" />
          <div className="text-violet-300 text-[10px] font-bold text-center">Mobile<br/>DOB</div>
          <motion.div className="w-10 h-1 rounded-full bg-violet-400"
            animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity }} />
        </div>
      </motion.div>
    </div>
  )

  if (step.panelVisual === 'explore') return (
    <div className="grid grid-cols-3 gap-2 h-full content-center">
      {['⚙️', '🏥', '💼', '🎭', '✈️', '🤖'].map((emoji, i) => (
        <motion.div key={i}
          className="aspect-square rounded-xl bg-sky-900/30 border border-sky-400/20 flex items-center justify-center text-xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.15, borderColor: 'rgba(14,165,233,0.6)' }}
          transition={{ delay: i * 0.06 }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  )

  if (step.panelVisual === 'ai') return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      <motion.div className="relative"
        animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg"
          style={{ boxShadow: '0 0 24px rgba(20,184,166,0.5)' }}>
          <Brain size={28} className="text-white" />
        </div>
        {[0, 1, 2].map(i => (
          <motion.div key={i} className="absolute rounded-full border border-teal-400/40"
            animate={{ scale: [1, 1.8 + i * 0.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
            style={{ inset: -8 - i * 8, borderRadius: '1rem' }}
          />
        ))}
      </motion.div>
      <div className="flex gap-1">
        {['Colleges', 'Careers', 'Scholarships'].map((tag, i) => (
          <motion.span key={tag} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 + 0.3 }}>
            {tag}
          </motion.span>
        ))}
      </div>
    </div>
  )

  if (step.panelVisual === 'profile') return (
    <div className="flex flex-col gap-2 h-full justify-center">
      {[
        { label: 'Interests', value: 'AI & CS', w: 80 },
        { label: 'Strength', value: 'Maths', w: 90 },
        { label: 'Goal', value: 'Engineer', w: 70 },
      ].map((item, i) => (
        <motion.div key={item.label}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.12 }}
          className="flex items-center gap-2">
          <div className="text-[10px] font-bold text-rose-300 w-14 shrink-0">{item.label}</div>
          <div className="flex-1 h-1.5 rounded-full bg-rose-900/40 overflow-hidden">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-400"
              initial={{ width: 0 }}
              animate={{ width: `${item.w}%` }}
              transition={{ duration: 0.8, delay: i * 0.1 + 0.3, ease: [0.22, 1, 0.36, 1] }} />
          </div>
          <div className="text-[9px] text-rose-300 font-semibold shrink-0">{item.value}</div>
        </motion.div>
      ))}
    </div>
  )

  if (step.panelVisual === 'personalized') return (
    <div className="flex flex-col items-center justify-center h-full gap-2">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="text-3xl"
      >✨</motion.div>
      <div className="text-center">
        <motion.div className="text-amber-300 font-extrabold text-sm"
          animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.5, repeat: Infinity }}>
          Personalized Just For You
        </motion.div>
        <div className="flex justify-center gap-1 mt-1">
          {['🎯 College Match', '🤖 AI Score', '💰 Scholarship'].map((t, i) => (
            <motion.span key={t}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15 }}
              className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {t}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  )

  return null
}

/* ─── Confetti Burst for Final Step ──────────────────────────── */
function ConfettiBurst({ active }) {
  if (!active) return null
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * 360
        const dist = 80 + Math.random() * 120
        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-sm"
            style={{
              left: '50%', top: '30%',
              background: ['#fbbf24', '#f43f5e', '#14b8a6', '#8b5cf6', '#0ea5e9'][i % 5],
            }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
            animate={{
              x: Math.cos((angle * Math.PI) / 180) * dist,
              y: Math.sin((angle * Math.PI) / 180) * dist * 0.5,
              opacity: 0,
              rotate: angle * 3,
              scale: 0,
            }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
        )
      })}
    </div>
  )
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function JourneyTimeline() {
  const activeStep = 1 // Hardcoded to 'Explore' phase for generic dashboard
  const step = STEPS[activeStep]
  const progressPct = (activeStep / (STEPS.length - 1)) * 100

  return (
    <div className="relative w-full select-none">

      {/* ── Ambient background particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-lg opacity-10"
            style={{
              left: `${(i / 12) * 100}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [-8, 8, -8],
              opacity: [0.05, 0.15, 0.05],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 3 + i * 0.4,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          >
            {['📚', '🎓', '🏫', '🤖', '🌟', '💡', '🎯', '🔬', '📊', '✨', '🚀', '🧠'][i]}
          </motion.div>
        ))}
      </div>

      {/* ── Evolving Characters Row ── */}
      <div className="relative grid grid-cols-5 gap-0 mb-2 px-4">
        {STEPS.map((s, i) => (
          <div
            key={s.key}
            className="flex flex-col items-center gap-1 group"
          >
            <EvolvingCharacter step={s} isActive={i === activeStep} />
            {/* Step label + phase */}
            <div className="text-center mt-0">
              <p className={`text-[10px] md:text-xs font-extrabold transition-colors ${i === activeStep ? 'text-neutral-900 dark:text-white' : i < activeStep ? 'text-neutral-700 dark:text-white/80' : 'text-neutral-400 dark:text-white/40'}`}>
                {s.label}
              </p>
              <motion.p
                className={`text-[8px] font-bold uppercase tracking-widest ${i > activeStep ? 'text-neutral-400 dark:text-white/20' : ''}`}
                style={{ color: i <= activeStep ? s.phaseColor : undefined }}
              >
                {s.phase}
              </motion.p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Curved glowing path ── */}
      <div className="px-4 -mt-2 mb-4">
        <CurvedPath activeStep={activeStep} steps={STEPS} />
      </div>

      {/* ── Miles Crossed Progress Bar ── */}
      <div className="px-4 mb-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500 dark:text-white/40">
            Educational Growth Journey
          </span>
          <motion.span
            key={activeStep}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-black"
            style={{ color: step.accent }}
          >
            {Math.round(progressPct)}% Clarity Reached
          </motion.span>
        </div>
        <div className="h-2 rounded-full bg-neutral-200 dark:bg-white/5 overflow-hidden relative">
          <motion.div
            className="h-full rounded-full"
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: `linear-gradient(90deg, #8b5cf6, ${step.accent})`,
              boxShadow: `0 0 12px ${step.glow}`,
            }}
          />
          {/* Moving shimmer */}
          <motion.div
            className="absolute top-0 h-full w-6 rounded-full"
            animate={{ left: [`${progressPct - 10}%`, `${progressPct}%`] }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: 'rgba(255,255,255,0.3)', filter: 'blur(4px)' }}
          />
        </div>
        {/* Milestones labels */}
        <div className="flex justify-between mt-1">
          <span className="text-[8px] text-neutral-400 dark:text-white/30 font-bold">Confusion</span>
          <span className="text-[8px] text-neutral-400 dark:text-white/30 font-bold">Confidence</span>
        </div>
      </div>


    </div>
  )
}
