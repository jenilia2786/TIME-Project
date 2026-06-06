import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Smartphone, LayoutDashboard, Brain, User, Sparkles, ArrowRight, Zap, CheckCircle, Star } from 'lucide-react'

const STEPS = {
  login: {
    key: 'login',
    nav: 'Login',
    icon: Smartphone,
    color: 'from-violet-500 to-purple-600',
    accent: '#8b5cf6',
    glow: 'rgba(139, 92, 246, 0.2)',
    title: 'Instant Login,\nZero Barriers',
    subtitle: 'Onboarding & Access',
    description: 'Students can quickly access the platform using a simple onboarding flow without lengthy registration processes.',
    highlights: [
      'Login with mobile number + date of birth',
      'No password or email registration needed',
      'Session saved — return anytime from any device',
      'Instantly access the generic exploration dashboard',
      'No pressure to fill profiles upfront',
    ],
    badge: '30 seconds to start',
    steps: [
      { label: 'Visit the Platform', detail: 'Open the platform from mobile, tablet, or desktop and access the educational guidance system.', status: 'completed' },
      { label: 'Enter Mobile + DOB', detail: 'Use mobile number and date of birth for quick and simple login access.', status: 'completed' },
      { label: 'Secure Verification & Session Setup', detail: 'Quickly continue into the platform with a smooth and seamless access experience.', status: 'current' },
      { label: 'Start Exploring', detail: 'Enter the generic dashboard and begin exploring educational opportunities.', status: 'future' },
    ],
  },
  dashboard: {
    key: 'dashboard',
    nav: 'Explore Dashboard',
    icon: LayoutDashboard,
    color: 'from-sky-500 to-blue-600',
    accent: '#0ea5e9',
    glow: 'rgba(14, 165, 233, 0.2)',
    title: 'Explore Freely,\nNo Limits',
    subtitle: 'Generic Dashboard',
    description: 'Students can freely explore domains, opportunities, colleges, and career pathways before personalization.',
    highlights: [
      'Browse all 11 parent educational domains',
      'Explore 500+ colleges across Tamil Nadu',
      'Filter by district, type, and domain',
      'Chat freely with the AI assistant',
      'Discover scholarships and career paths',
    ],
    badge: 'Full access instantly',
    steps: [
      { label: 'Explore Parent Domains', detail: 'Discover major educational domains available after 10th and 12th standard.', status: 'completed' },
      { label: 'Discover Career Opportunities', detail: 'Explore careers, future scope, industries, and educational pathways.', status: 'completed' },
      { label: 'Use Smart Filters', detail: 'Filter domains and colleges based on district, interests, fees, and preferences.', status: 'current' },
      { label: 'Save & Compare Interests', detail: 'Bookmark domains, compare opportunities, and track educational interests.', status: 'future' },
    ],
  },
  ai: {
    key: 'ai',
    nav: 'AI Guidance',
    icon: Brain,
    color: 'from-brand-500 to-teal-600',
    accent: '#14b8a6',
    glow: 'rgba(20, 184, 166, 0.22)',
    title: 'Your Personal\nAI Career Mentor',
    subtitle: 'AI Guidance',
    description: 'Students can interact with the AI assistant using text or voice to receive educational guidance and future insights.',
    highlights: [
      'Ask about any college, domain or career path',
      'Get Tamil Nadu–specific admission guidance',
      'Query scholarships by category and district',
      'After profile creation, AI becomes context-aware',
      'No generic answers — focused, platform-specific',
    ],
    badge: 'Always available',
    steps: [
      { label: 'Ask Educational Questions', detail: 'Ask doubts related to careers, groups, colleges, and future opportunities.', status: 'completed' },
      { label: 'Chat Using Voice or Text', detail: 'Interact naturally with the AI assistant through voice or text conversations.', status: 'completed' },
      { label: 'Receive Smart Suggestions', detail: 'Get AI-powered domain, career, and educational recommendations.', status: 'current' },
      { label: 'Explore Recommended Pathways', detail: 'Understand personalized pathways, future scope, and educational growth opportunities.', status: 'future' },
    ],
  },
  profile: {
    key: 'profile',
    nav: 'Profile Creation',
    icon: User,
    color: 'from-rose-500 to-pink-500',
    accent: '#f43f5e',
    glow: 'rgba(244, 63, 94, 0.22)',
    title: 'Build Your\nLearning Identity',
    subtitle: 'Personalization Setup',
    description: 'Students can create their educational profile to unlock deeper personalization and adaptive recommendations.',
    highlights: [
      'Add academic standard, board & district',
      'Select domains of interest and career goals',
      'Share strong subjects and confidence levels',
      'Set hostel preference, budget & college type',
      'Unlock AI personalization and smart matches',
    ],
    badge: '~5 minutes · One-time',
    steps: [
      { label: 'Add Basic Information', detail: 'Enter student details such as district, standard, and educational background.', status: 'completed' },
      { label: 'Select Interests & Goals', detail: 'Choose interested domains, career goals, and educational preferences.', status: 'completed' },
      { label: 'Set Preferences & Priorities', detail: 'Configure preferences such as hostel, budget, location, and learning priorities.', status: 'current' },
      { label: 'Complete Educational Profile', detail: 'Finalize the profile to activate intelligent personalization features.', status: 'future' },
    ],
  },
  personalized: {
    key: 'personalized',
    nav: 'Personalized Dashboard',
    icon: Sparkles,
    color: 'from-amber-500 to-orange-500',
    accent: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.22)',
    title: 'Guidance That\nUnderstands You',
    subtitle: 'Your Personalized Space',
    description: 'The platform adapts dynamically based on the student’s profile, interests, and interactions.',
    highlights: [
      'College recommendations filtered for your profile',
      'AI-powered compatibility scores for each domain',
      'Visual career roadmaps from 10th to dream career',
      'Matched scholarships by category, district & domain',
      'Smart alerts and educational milestone tracking',
    ],
    badge: 'Always adapting',
    steps: [
      { label: 'Receive Personalized Recommendations', detail: 'Get tailored domain, career, and educational suggestions.', status: 'completed' },
      { label: 'Explore Smart College Suggestions', detail: 'View personalized colleges based on cutoff, district, preferences, and goals.', status: 'completed' },
      { label: 'View Personalized Roadmaps', detail: 'Explore step-by-step educational and career growth pathways.', status: 'current' },
      { label: 'Unlock Adaptive AI Guidance', detail: 'Receive profile-aware AI guidance and continuously evolving recommendations.', status: 'future' },
    ],
  },
}

const STEP_KEYS = ['login', 'dashboard', 'ai', 'profile', 'personalized']

export default function JourneyExplorer() {
  const [activeStep, setActiveStep] = useState('login')
  const step = STEPS[activeStep]
  const StepIcon = step.icon

  // Removed auto-cycle as requested
  // useEffect(() => {
  //   const t = setInterval(() => {
  //     setActiveStep(prev => {
  //       const idx = STEP_KEYS.indexOf(prev)
  //       return STEP_KEYS[(idx + 1) % STEP_KEYS.length]
  //     })
  //   }, 5000)
  //   return () => clearInterval(t)
  // }, [activeStep])

  const handleStepClick = (key) => setActiveStep(key)

  return (
    <div className="w-full flex flex-col gap-6">

      {/* ── Top Navigation Pills ── */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-white/ dark:bg-slate-800/ border border-white/ dark:border-slate-700/ shadow-inner">
        {STEP_KEYS.map((key, i) => {
          const s = STEPS[key]
          const Icon = s.icon
          const isActive = activeStep === key
          return (
            <button
              key={key}
              onClick={() => handleStepClick(key)}
              className={`flex-1 min-w-[80px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                isActive
                  ? `bg-gradient-to-r ${s.color} text-white shadow-md`
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-white/ dark:bg-slate-800/'
              }`}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{s.nav}</span>
            </button>
          )
        })}
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left: Step Description */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={`left-${activeStep}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="p-6 rounded-[1.75rem] bg-white/ dark:bg-slate-800/ backdrop-blur-md border border-white/ dark:border-slate-700/ shadow-sm flex flex-col gap-5 h-full"
            >
              {/* Icon + step badge */}
              <div className="flex items-center justify-between">
                <div
                  className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-md`}
                >
                  <StepIcon size={20} className="text-white" />
                </div>
                <span
                  className="text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full text-white"
                  style={{ background: step.accent }}
                >
                  {step.badge}
                </span>
              </div>

              {/* Title */}
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">{step.subtitle}</p>
                <h3
                  className="text-2xl font-extrabold text-neutral-900 leading-[1.2] tracking-tight whitespace-pre-line"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {step.title.split('\n').map((line, i) =>
                    i === 1
                      ? <span key={i} className={`block bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>{line}</span>
                      : <span key={i} className="block">{line}</span>
                  )}
                </h3>
              </div>

              {/* Description */}
              <p className="text-sm text-neutral-600 leading-relaxed">{step.description}</p>

              {/* Highlights */}
              <div className="flex flex-col gap-2">
                {step.highlights.map((hl, i) => (
                  <motion.div
                    key={hl}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-2.5 text-xs text-neutral-700 font-medium"
                  >
                    <CheckCircle size={13} className="shrink-0 mt-0.5" style={{ color: step.accent }} />
                    {hl}
                  </motion.div>
                ))}
              </div>

              {/* Step progress dots */}
              <div className="flex gap-1.5 mt-auto pt-3 border-t border-neutral-100">
                {STEP_KEYS.map((key, i) => (
                  <button
                    key={key}
                    onClick={() => handleStepClick(key)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: key === activeStep ? 24 : 8,
                      height: 8,
                      background: key === activeStep ? step.accent : '#e5e7eb',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Platform Journey Sequence */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={`right-${activeStep}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="p-6 sm:p-7 rounded-[1.75rem] bg-white/ dark:bg-slate-800/ backdrop-blur-md border border-white/ dark:border-slate-700/ shadow-sm flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-7">
                <span className="text-xs font-extrabold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Zap size={13} style={{ color: step.accent }} /> Platform Journey Sequence
                </span>
                <span className="flex items-center gap-1 bg-white/ dark:bg-slate-800/ border border-white dark:border-slate-700 px-2.5 py-1 rounded-lg text-[10px] font-bold text-neutral-500">
                  Step {STEP_KEYS.indexOf(activeStep) + 1} of 5
                </span>
              </div>

              {/* Timeline */}
              <div className="relative flex flex-col gap-5 pl-9">
                {/* Connecting line */}
                <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-neutral-200/60 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ duration: 1.2, ease: 'easeInOut' }}
                    className={`w-full rounded-full bg-gradient-to-b ${step.color}`}
                    style={{ boxShadow: `0 0 8px ${step.glow}` }}
                  />
                </div>

                {step.steps.map((s, idx) => {
                  const isCurrent = s.status === 'current'
                  const isCompleted = s.status === 'completed'
                  return (
                    <motion.div
                      key={`${activeStep}-step-${idx}`}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: idx * 0.08 }}
                      className="flex items-start gap-4 relative z-10 group"
                    >
                      {/* Node */}
                      <div className="relative mt-1 w-8 flex justify-center">
                        <motion.div
                          animate={isCurrent ? {
                            scale: [1, 1.25, 1],
                            boxShadow: [`0 0 0 0 ${step.glow}`, `0 0 0 8px transparent`, `0 0 0 0 ${step.glow}`],
                          } : {}}
                          transition={{ duration: 1.8, repeat: Infinity }}
                          className={`w-3.5 h-3.5 rounded-full border-[2.5px] border-white dark:border-slate-700 shadow-sm ${
                            isCompleted
                              ? `bg-gradient-to-r ${step.color}`
                              : isCurrent
                                ? ''
                                : 'bg-neutral-200'
                          }`}
                          style={isCurrent ? { background: step.accent } : {}}
                        />
                      </div>

                      {/* Card */}
                      <div className={`flex-1 p-4 rounded-2xl border transition-all duration-300 ${
                        isCurrent
                          ? 'bg-white/ dark:bg-slate-800/ border-white dark:border-slate-700 shadow-md'
                          : isCompleted
                            ? 'bg-white/ dark:bg-slate-800/ border-white/ dark:border-slate-700/'
                            : 'bg-white/ dark:bg-slate-800/ border-white/ dark:border-slate-700/ opacity-60'
                      }`}
                        style={isCurrent ? { borderColor: `${step.accent}40`, boxShadow: `0 4px 16px ${step.glow}` } : {}}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-extrabold text-sm text-neutral-900">{s.label}</h4>
                          {isCurrent && (
                            <span
                              className="text-[9px] font-bold px-2 py-0.5 rounded text-white uppercase tracking-widest animate-pulse"
                              style={{ background: step.accent }}
                            >
                              Now
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{s.detail}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Bottom nav */}
              <div className="mt-7 flex justify-between items-center pt-4 border-t border-neutral-100">
                <div className="flex gap-1.5">
                  {STEP_KEYS.map((key) => (
                    <button
                      key={key}
                      onClick={() => handleStepClick(key)}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: key === activeStep ? 24 : 8,
                        height: 8,
                        background: key === activeStep ? step.accent : '#e5e7eb',
                      }}
                    />
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    const idx = STEP_KEYS.indexOf(activeStep)
                    setActiveStep(STEP_KEYS[(idx + 1) % STEP_KEYS.length])
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r ${step.color} shadow-md`}
                  style={{ boxShadow: `0 6px 18px ${step.glow}` }}
                >
                  Next Step <ArrowRight size={15} />
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}
