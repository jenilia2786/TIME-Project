import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Sparkles, X, ChevronRight, CheckCircle2,
  MessageSquare, Mic, LayoutDashboard, BookOpen, Building2,
  Map, Compass, GraduationCap, UserCircle, Rocket, Target
} from 'lucide-react'
import useStudentStore from '../../store/useStudentStore'
import { useNavigate, useLocation } from 'react-router-dom'

/* ─── Tutorial step definitions ─────────────────────────────── */
const GENERIC_STEPS = [
  {
    id: 'journey',
    icon: Map,
    iconColor: 'from-violet-500 to-purple-500',
    title: 'Your Educational Journey',
    description: 'This interactive timeline shows exactly how the platform works. You start here with generic exploration and end up with a fully personalized dashboard.',
    highlight: 'Click the nodes to see what\'s next!',
    target: 'generic-journey-timeline',
    position: 'bottom',
    actionLabel: 'Next',
  },
  {
    id: 'domains_10th',
    icon: Compass,
    iconColor: 'from-emerald-500 to-teal-500',
    title: 'Domains After 10th',
    description: 'Choose your group wisely — it shapes your 12th grade, entrance exams, and career path. Explore the main streams available.',
    highlight: 'Tap any card to flip and explore.',
    target: 'generic-domains',
    position: 'bottom',
    actionLabel: 'Next',
  },
  {
    id: 'domains_12th',
    icon: GraduationCap,
    iconColor: 'from-sky-500 to-blue-500',
    title: 'Domains After 12th',
    description: 'Explore all higher education pathways open to you. Discover degrees, required exams, and career prospects for each domain.',
    highlight: 'Click any domain to expand and see specializations.',
    target: 'generic-domains-12th',
    position: 'bottom',
    actionLabel: 'Next',
  },
  {
    id: 'trending',
    icon: Rocket,
    iconColor: 'from-amber-500 to-orange-500',
    title: 'Trending Fields',
    description: 'Discover the fields with the highest job growth in India and globally. Future-proof your career by exploring high-demand domains.',
    highlight: 'Click a domain to see the courses inside.',
    target: 'generic-trending',
    position: 'bottom',
    actionLabel: 'Next',
  },
  {
    id: 'cutoff',
    icon: Target,
    iconColor: 'from-teal-500 to-emerald-500',
    title: 'Cutoff Calculator',
    description: 'Understand how your engineering cutoff is calculated using the TNEA formula. Use our live calculator to estimate your score.',
    highlight: 'Your cutoff determines your rank in TNEA counselling.',
    target: 'generic-cutoff',
    position: 'bottom',
    actionLabel: 'Next',
  },
  {
    id: 'counselling',
    icon: Building2,
    iconColor: 'from-indigo-500 to-violet-500',
    title: 'Counselling & Quotas',
    description: 'Learn which counselling portal to use for each domain, and see which reservation categories you may qualify for.',
    highlight: 'Crucial for admissions in Tamil Nadu.',
    target: 'generic-counselling',
    position: 'bottom',
    actionLabel: 'Next',
  },
  {
    id: 'chat',
    icon: MessageSquare,
    iconColor: 'from-brand-500 to-emerald-500',
    title: 'Your Dedicated AI Mentor',
    description: 'This chat bar is always available at the bottom of your screen. Ask me questions in English or Tanglish!',
    highlight: 'Try clicking one of the suggested prompt pills.',
    target: 'persistent-chat-bar',
    position: 'top',
    actionLabel: 'Next',
  },
  {
    id: 'profile',
    icon: UserCircle,
    iconColor: 'from-brand-500 to-cyan-500',
    title: 'Unlock AI Personalization',
    description: 'Create your profile in under 5 minutes to unlock AI-matched colleges, career roadmaps, and scholarships.',
    highlight: 'This instantly customizes the entire dashboard just for you.',
    target: 'generic-create-profile-bottom',
    position: 'top',
    actionLabel: 'Let\'s go!',
  }
]

const PERSONALIZED_STEPS = [
  {
    id: 'welcome-back',
    icon: Sparkles,
    iconColor: 'from-brand-500 to-emerald-500',
    title: 'Your Personalized Dashboard 🎉',
    description:
      'Your profile is complete! The entire platform has instantly adapted to your specific academic background and career goals.',
    highlight: 'Let me show you the new personalized tools you\'ve unlocked.',
    target: null,
    position: 'center',
    actionLabel: 'See changes',
  },
  {
    id: 'compatibility',
    icon: Target,
    iconColor: 'from-brand-500 to-cyan-500',
    title: 'AI Compatibility Scores',
    description:
      'Based on the interests and subjects you just entered, my AI engine calculated exactly how well you match with each career domain.',
    highlight: 'Look for domains with an 80%+ match rate—they are your best fit!',
    target: 'personalized-recommendations-section',
    position: 'top',
    actionLabel: 'Makes sense',
  },
  {
    id: 'roadmap',
    icon: Map,
    iconColor: 'from-violet-500 to-purple-500',
    title: 'Your Educational Roadmap',
    description:
      'This isn\'t a generic timeline. This is a custom, step-by-step roadmap showing exactly which exams to take and which degrees to pursue based on your current standard.',
    highlight: 'Follow these milestones to successfully reach your dream career.',
    target: 'career-roadmap-section',
    position: 'top',
    actionLabel: 'Got it!',
  },
  {
    id: 'chat-context',
    icon: MessageSquare,
    iconColor: 'from-rose-500 to-pink-500',
    title: 'Context-Aware AI Chat',
    description:
      'I now remember your profile! When you ask me a question, I will automatically tailor my answers considering your district, board, and career aspirations.',
    highlight: 'Try asking: "What are the best colleges for me?"',
    target: 'persistent-chat-bar',
    position: 'top',
    actionLabel: 'Start Exploring',
  }
]

/* ─── Step icon renderer ─────────────────────────────────────── */
function StepIcon({ step }) {
  const Icon = step.icon
  return (
    <div
      className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${step.iconColor} shadow-lg shrink-0`}
      style={{ boxShadow: '0 0 20px rgba(20,184,166,0.25)' }}
    >
      <Icon size={20} className="text-white" />
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────────── */
export default function TutorialOverlay() {
  const { hasSeenGenericTutorial, completeGenericTutorial, hasSeenPersonalizedTutorial, completePersonalizedTutorial, onboardingDone } = useStudentStore()
  
  const isPersonalized = onboardingDone
  const activeTutorial = isPersonalized 
    ? (hasSeenPersonalizedTutorial ? null : 'personalized') 
    : (hasSeenGenericTutorial ? null : 'generic')
    
  const currentSteps = activeTutorial === 'personalized' ? PERSONALIZED_STEPS : GENERIC_STEPS

  const [step, setStep]             = useState(0)
  const [targetRect, setTargetRect] = useState(null)
  const [visible, setVisible]       = useState(false)
  const [actualHeight, setActualHeight] = useState(380)
  const navigate                    = useNavigate()
  const location                    = useLocation()
  const cardRef                     = useRef(null)

  // Continuously track the actual height of the card to prevent overflows
  useEffect(() => {
    if (cardRef.current && cardRef.current.offsetHeight !== actualHeight) {
      setActualHeight(cardRef.current.offsetHeight)
    }
  })

  /* Delay then show on first dashboard visit */
  useEffect(() => {
    if (activeTutorial && location.pathname === '/dashboard') {
      const t = setTimeout(() => setVisible(true), 1400)
      return () => clearTimeout(t)
    }
  }, [activeTutorial, location.pathname])

  /* Compute spotlight rect for current step */
  useEffect(() => {
    if (!visible || !currentSteps) return
    const s = currentSteps[step]
    if (!s.target) { setTargetRect(null); return }

    const measure = () => {
      const el = document.getElementById(s.target)
      if (!el) { setTargetRect(null); return }
      const r = el.getBoundingClientRect()
      
      setTargetRect(prev => {
        const next = { top: r.top - 8, left: r.left - 8, width: r.width + 16, height: r.height + 16 }
        // Prevent excessive state updates if position hasn't meaningfully changed
        if (prev && Math.abs(prev.top - next.top) < 0.5 && Math.abs(prev.left - next.left) < 0.5 && prev.width === next.width && prev.height === next.height) {
          return prev
        }
        return next
      })
    }

    const el = document.getElementById(s.target)
    if (el) {
      const topPos = el.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: Math.max(0, topPos - 120), behavior: 'smooth' })
      measure()
    }

    // Poll for the first 1.2s to smoothly track the element during the scrollIntoView animation
    let isPolling = true
    const poll = () => {
      if (isPolling) {
        measure()
        requestAnimationFrame(poll)
      }
    }
    requestAnimationFrame(poll)
    const timeoutId = setTimeout(() => { isPolling = false }, 1200)

    window.addEventListener('resize', measure)
    // Listen to scroll events globally to keep spotlight glued to the element
    window.addEventListener('scroll', measure, { passive: true, capture: true })
    
    return () => {
      isPolling = false
      clearTimeout(timeoutId)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, { capture: true })
    }
  }, [step, visible])

  const handleNext = () => {
    if (step < currentSteps.length - 1) setStep(s => s + 1)
    else finish()
  }

  const finish = () => {
    setVisible(false)
    if (activeTutorial === 'personalized') completePersonalizedTutorial()
    if (activeTutorial === 'generic') completeGenericTutorial()
  }

  if (!visible || !currentSteps) return null

  const current  = currentSteps[step]
  const isLast   = step === currentSteps.length - 1
  const progress = ((step + 1) / currentSteps.length) * 100

  /* ── Card position logic ─────────────────────────────────── */
  const getCardStyle = () => {
    const W = window.innerWidth
    const H = window.innerHeight
    const CARD_W = Math.min(360, W - 32)
    const ACTUAL_H = actualHeight

    // Calculate exact pixel coordinates for perfect centering
    // This avoids using CSS 'transform' which conflicts with Framer Motion's 'y' animation
    const centerLeft = Math.max(16, W / 2 - CARD_W / 2)
    const centerTop = Math.max(12, H / 2 - ACTUAL_H / 2)

    if (current.position === 'center' || !targetRect) {
      return { top: centerTop, left: centerLeft }
    }

    const clampLeft = (l) => Math.max(12, Math.min(l, W - CARD_W - 12))
    const clampTop = (t) => Math.max(12, Math.min(t, H - ACTUAL_H - 12))

    if (current.position === 'right') {
      const left = targetRect.left + targetRect.width + 16
      const fitsRight = left + CARD_W < W - 12
      return fitsRight
        ? { top: clampTop(targetRect.top), left }
        : { top: centerTop, left: centerLeft }
    }
    
    if (current.position === 'top') {
      const left = clampLeft(targetRect.left + targetRect.width / 2 - CARD_W / 2)
      
      const topAbove = targetRect.top - 16 - ACTUAL_H
      
      // Try to place above. If it fits perfectly, use topAbove.
      if (topAbove >= 12) {
        return { top: topAbove, left }
      } 
      
      // If it doesn't fit perfectly but the target is reasonably low on screen, 
      // stick the card to the top of the screen so it still appears ABOVE the target.
      if (targetRect.top > 120) {
        return { top: 12, left }
      }

      // Only flip below if the target is very high up (so sticking it to the top would completely obscure the target)
      const topBelow = targetRect.top + targetRect.height + 16
      if (topBelow + ACTUAL_H <= H - 12) {
        return { top: topBelow, left }
      }

      // If it fits neither, push it to the opposite edge of the screen to avoid obscuring the element
      if (targetRect.top < H / 2) {
        return { top: Math.max(12, H - ACTUAL_H - 12), left }
      } else {
        return { top: 12, left }
      }
    }

    if (current.position === 'bottom') {
      const left = clampLeft(targetRect.left + targetRect.width / 2 - CARD_W / 2)
      
      const topBelow = targetRect.top + targetRect.height + 16
      if (topBelow + ACTUAL_H <= H - 12) {
        return { top: topBelow, left }
      }
      
      const topAbove = targetRect.top - 16 - ACTUAL_H
      if (topAbove >= 12) {
        return { top: topAbove, left }
      }

      if (targetRect.top < H / 2) {
        return { top: Math.max(12, H - ACTUAL_H - 12), left }
      } else {
        return { top: 12, left }
      }
    }

    return { top: centerTop, left: centerLeft }
  }

  return (
    <div className="fixed inset-0 z-[200] pointer-events-auto">

      {/* ── Spotlight SVG overlay ──────────────────────────── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id="tutorial-spotlight">
            <rect width="100%" height="100%" fill="white" />
            {targetRect && (
              <motion.rect
                key={step}
                initial={false}
                animate={{
                  x: targetRect.left,
                  y: targetRect.top,
                  width: targetRect.width,
                  height: targetRect.height,
                  rx: 18,
                }}
                transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                fill="black"
              />
            )}
          </mask>
        </defs>

        {/* Dark overlay — highlights the spotlight clearly */}
        <rect
          width="100%"
          height="100%"
          fill="rgba(15,23,42,0.7)"
          mask="url(#tutorial-spotlight)"
        />

        {/* Spotlight glow border */}
        {targetRect && (
          <motion.rect
            initial={false}
            animate={{
              x: targetRect.left - 4,
              y: targetRect.top - 4,
              width: targetRect.width + 8,
              height: targetRect.height + 8,
              rx: 22,
            }}
            transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            fill="none"
            stroke="#14b8a6"
            strokeWidth="3"
            strokeDasharray="8 6"
            className="drop-shadow-[0_0_8px_rgba(20,184,166,0.8)]"
          />
        )}
      </svg>

      {/* ── Tutorial card ──────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`tour-${step}`}
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ type: 'spring', bounce: 0.35, duration: 0.6 }}
          className="fixed z-[200] flex flex-col pointer-events-none"
          style={getCardStyle()}
        >
          <div
            ref={cardRef}
            className="w-[340px] bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] pointer-events-auto border border-neutral-100 overflow-hidden"
          >
            {/* Top gradient bar */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${current.iconColor}`} />

            <div className="p-5">
              {/* Header */}
              <header className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${current.iconColor} flex items-center justify-center text-white shadow-sm`}>
                    <current.icon size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.15em] text-brand-600">
                      AI MENTOR · {step + 1} / {currentSteps.length}
                    </p>
                    <p className="text-[11px] font-bold text-neutral-400 mt-0.5">Platform Tour</p>
                  </div>
                </div>
                <button
                  onClick={finish}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </header>

              {/* Content */}
              <h3 className="mt-4 text-lg font-extrabold text-neutral-900 leading-tight">
                {current.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                {current.description}
              </p>

              {current.highlight && (
                <div className="mt-3 p-3 bg-brand-50/50 border border-brand-100/50 rounded-xl flex gap-2.5 items-start">
                  <Sparkles size={14} className="text-brand-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-brand-700 leading-relaxed">
                    {current.highlight}
                  </p>
                </div>
              )}

              {/* Footer */}
              <footer className="mt-5 flex items-center justify-between">
                <button
                  onClick={finish}
                  className="text-[11px] font-semibold text-neutral-400 hover:text-neutral-600 px-2 py-1 transition-colors"
                >
                  Skip tour
                </button>
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    {currentSteps.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-4 bg-brand-500' : 'w-1.5 bg-neutral-200'}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-brand-500 to-cyan-500 text-white px-4 py-2 rounded-full text-xs font-bold hover:shadow-[0_0_15px_rgba(20,184,166,0.4)] transition-all active:scale-95"
                  >
                    {current.actionLabel}
                    {!isLast && <ChevronRight size={14} strokeWidth={3} />}
                  </button>
                </div>
              </footer>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
