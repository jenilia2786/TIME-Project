import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Compass, GraduationCap, Map, Shield, CheckCircle, BarChart3,
  Heart, Search, Star, Zap, BookOpen, Users, Award, Target, Layers,
  Sparkles, Globe, Briefcase, ArrowRight
} from 'lucide-react'

const FEATURES = [
  // Column 1 (left) — features 1 to 5
  {
    id: 1,
    col: 'left',
    icon: Globe,
    title: '11 Educational Domains',
    desc: 'Explore Engineering, Medicine, AI, Aviation, Government, Marine, Arts, Commerce & more',
    color: 'from-teal-500 to-cyan-500',
    accent: '#14b8a6',
    image: { bg: 'from-teal-50 to-cyan-50', emoji: '🌐', headline: 'Explore Domains', sub: '11 parent domains · 80+ specializations · 500+ career paths', src: '/images/feature_domains_1779857468105.png' }
  },
  {
    id: 2,
    col: 'left',
    icon: BarChart3,
    title: 'College Compatibility Score',
    desc: 'AI rates your fit for each college based on cutoff, district, budget & interests',
    color: 'from-violet-500 to-purple-600',
    accent: '#8b5cf6',
    image: { bg: 'from-violet-50 to-purple-50', emoji: '📊', headline: 'Compatibility Score', sub: 'Match % for every college · AI-powered analysis · Real-time updates', src: '/images/feature_compatibility_1779857483006.png' }
  },
  {
    id: 3,
    col: 'left',
    icon: Map,
    title: 'Career Roadmaps',
    desc: 'Visual step-by-step journey from 10th grade to dream career with salary & demand data',
    color: 'from-sky-500 to-blue-600',
    accent: '#0ea5e9',
    image: { bg: 'from-sky-50 to-blue-50', emoji: '🗺️', headline: 'Career Roadmaps', sub: '10th → Group → College → Career · Salary data · Future demand', src: '/images/feature_roadmaps_1779857504640.png' }
  },
  {
    id: 4,
    col: 'left',
    icon: Search,
    title: 'Smart College Finder',
    desc: 'Filter 500+ colleges by district, cutoff, type, hostel & budget preferences',
    color: 'from-emerald-500 to-teal-600',
    accent: '#10b981',
    image: { bg: 'from-emerald-50 to-teal-50', emoji: '🏫', headline: 'Smart College Finder', sub: '500+ colleges · Multi-filter search · Hostel & budget aware', src: '/images/feature_finder_1779857518863.png' }
  },
  {
    id: 5,
    col: 'left',
    icon: Award,
    title: 'Scholarship Discovery',
    desc: 'Find government, merit & private scholarships matched to your category & district',
    color: 'from-amber-500 to-orange-500',
    accent: '#f59e0b',
    image: { bg: 'from-amber-50 to-orange-50', emoji: '💰', headline: 'Scholarship Finder', sub: 'Government · Merit · Community scholarships · Auto-matched to profile', src: '/images/feature_scholarship_1779857533867.png' }
  },
  // Column 3 (right) — features 6 to 10
  {
    id: 6,
    col: 'right',
    icon: Brain,
    title: 'AI Career Assistant',
    desc: 'Chat with an AI that understands Tamil Nadu education and gives personalized advice',
    color: 'from-brand-500 to-teal-600',
    accent: '#14b8a6',
    image: { bg: 'from-teal-50 to-brand-50', emoji: '🤖', headline: 'AI Career Assistant', sub: 'Tamil Nadu focused · Personalized after profile · Always available', src: '/images/feature_assistant_1779857549528.png' }
  },
  {
    id: 7,
    col: 'right',
    icon: Users,
    title: 'Group Selection Guidance',
    desc: 'Get clarity on which school group aligns best with your career goals',
    color: 'from-pink-500 to-rose-500',
    accent: '#ec4899',
    image: { bg: 'from-pink-50 to-rose-50', emoji: '📚', headline: 'Group Selection', sub: 'Bio-Maths · CS-Maths · Commerce · Matched to career goals', src: '/images/feature_group_1779857562845.png' }
  },
  {
    id: 8,
    col: 'right',
    icon: Target,
    title: 'Personalized Dashboard',
    desc: 'After profile setup, your dashboard transforms with recommendations just for you',
    color: 'from-indigo-500 to-blue-600',
    accent: '#6366f1',
    image: { bg: 'from-indigo-50 to-blue-50', emoji: '✨', headline: 'Personalized Dashboard', sub: 'Smart college matches · Career roadmaps · Scholarship alerts', src: '/images/feature_dashboard_1779857580184.png' }
  },
  {
    id: 9,
    col: 'right',
    icon: Shield,
    title: 'Free. Forever.',
    desc: 'No subscriptions, no hidden fees. All features including AI, college search & scholarships',
    color: 'from-green-500 to-emerald-600',
    accent: '#22c55e',
    image: { bg: 'from-green-50 to-emerald-50', emoji: '🆓', headline: 'Completely Free', sub: 'No subscription · No hidden fees · All features included', src: '/images/feature_free_1779857596061.png' }
  },
  {
    id: 10,
    col: 'right',
    icon: Compass,
    title: 'Instant Access',
    desc: 'Login with just mobile + DOB — no registration. Start exploring in seconds',
    color: 'from-cyan-500 to-teal-500',
    accent: '#06b6d4',
    image: { bg: 'from-cyan-50 to-teal-50', emoji: '⚡', headline: 'Instant Access', sub: 'Mobile + DOB login · No registration · Explore immediately', src: '/images/feature_access_1779857613525.png' }
  },
]

const leftFeatures = FEATURES.filter(f => f.col === 'left')
const rightFeatures = FEATURES.filter(f => f.col === 'right')

function FeatureRow({ feature, isActive, onClick, side }) {
  const Icon = feature.icon
  const isLeft = side === 'left'

  return (
    <motion.button
      onClick={() => onClick(feature.id)}
      whileHover={{ x: isLeft ? -4 : 4 }}
      className={`w-full flex items-start gap-3 p-3.5 rounded-2xl transition-all duration-300 group ${
        isLeft ? 'flex-row-reverse text-right' : 'text-left'
      } ${
        isActive
          ? 'bg-white dark:bg-slate-800 shadow-md border border-white/50 dark:border-slate-700'
          : 'hover:bg-white/50 dark:hover:bg-slate-800/50 border border-transparent'
      }`}
      style={isActive ? { boxShadow: `0 4px 20px ${feature.accent}22` } : {}}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
          isActive ? `bg-gradient-to-br ${feature.color}` : 'bg-white dark:bg-slate-800 border border-neutral-200'
        }`}
      >
        <Icon size={15} className={isActive ? 'text-white' : 'text-neutral-500'} />
      </div>
      <div className={`flex-1 min-w-0 ${isLeft ? 'items-end' : ''}`}>
        <p className={`text-xs font-bold leading-snug ${isActive ? 'text-neutral-900 dark:text-white' : 'text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200'}`}>
          {feature.title}
        </p>
        <AnimatePresence>
          {isActive && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed overflow-hidden"
            >
              {feature.desc}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      {isActive && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${isLeft ? 'mr-auto' : 'ml-auto'}`}
          style={{ background: feature.accent }}
        >
          <CheckCircle size={10} className="text-white" />
        </motion.div>
      )}
    </motion.button>
  )
}

function ImageDeck({ activeFeature }) {
  const feature = FEATURES.find(f => f.id === activeFeature) || FEATURES[0]
  const allFeatures = FEATURES

  // Stack: show 3 cards behind
  const deck = allFeatures.filter(f => f.id !== activeFeature).slice(0, 3)

  return (
    <div className="relative flex items-center justify-center w-full h-full min-h-[380px]">
      {/* Stacked back cards */}
      {deck.map((f, i) => (
        <motion.div
          key={`deck-${f.id}`}
          className={`absolute w-full max-w-[280px] rounded-[1.5rem] bg-gradient-to-br ${f.image.bg} dark:from-slate-800 dark:to-slate-900 border border-white/50 dark:border-slate-700`}
          style={{ height: 300 }}
          animate={{
            rotate: [(i + 1) * 3 - 4, (i + 1) * 3 + 4 - 8, (i + 1) * 3 - 4][(i % 3)],
            y: (i + 1) * 10,
            scale: 1 - (i + 1) * 0.055,
            zIndex: 10 - i,
            filter: `brightness(${1 - (i + 1) * 0.06})`,
          }}
          transition={{ duration: 0.5 }}
        />
      ))}

      {/* Active card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`active-${activeFeature}`}
          initial={{ opacity: 0, scale: 0.85, y: 30, rotateX: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: -20, rotateX: -10 }}
          transition={{ duration: 0.45, type: 'spring', bounce: 0.3 }}
          className={`relative z-20 w-full max-w-[280px] rounded-[1.5rem] bg-gradient-to-br ${feature.image.bg} dark:from-slate-800 dark:to-slate-900 border border-white/50 dark:border-slate-700 overflow-hidden`}
          style={{
            height: 330,
            boxShadow: `0 20px 60px ${feature.accent}30, 0 6px 20px rgba(0,0,0,0.08), 0 0 0 1px ${feature.accent}20`
          }}
        >
          {/* Top accent bar */}
          <div className={`h-1.5 w-full bg-gradient-to-r ${feature.color}`} />

          {/* Content */}
          <div className="p-0 h-full flex flex-col items-center justify-between pb-6">
            <div className="w-full h-[140px] relative overflow-hidden bg-white/50 dark:bg-white/95">
              <img 
                src={feature.image.src} 
                alt={feature.title} 
                className="w-full h-full object-cover mix-blend-multiply" 
              />
            </div>
            
            <div className="text-center px-4 pb-6 pt-2">
              <motion.h4
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="font-extrabold text-neutral-900 dark:text-white text-base tracking-tight"
              >
                {feature.image.headline}
              </motion.h4>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
                className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed max-w-[200px] mx-auto"
              >
                {feature.image.sub}
              </motion.p>
            </div>

            {/* Feature number badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest text-white"
              style={{ background: `linear-gradient(135deg, ${feature.accent}, ${feature.accent}99)` }}
            >
              <Zap size={9} /> Feature {feature.id} of 10
            </motion.div>
          </div>

          {/* Floating decorative dots */}
          <div className="absolute top-4 right-4 w-2 h-2 rounded-full opacity-30" style={{ background: feature.accent }} />
          <div className="absolute bottom-6 left-5 w-1.5 h-1.5 rounded-full opacity-20" style={{ background: feature.accent }} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function FeaturesThreeColumn({ openModal }) {
  const [activeFeature, setActiveFeature] = useState(1)

  // Removed auto-cycle as requested
  // useEffect(() => {
  //   const t = setInterval(() => {
  //     setActiveFeature(prev => (prev % 10) + 1)
  //   }, 3500)
  //   return () => clearInterval(t)
  // }, [])

  const handleClick = (id) => {
    setActiveFeature(id)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px_1fr] gap-6 items-start">
      
      {/* Column 1: Left features 1–5 */}
      <div className="flex flex-col gap-1.5 p-4 rounded-[1.75rem] bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/50 dark:border-slate-700/50 shadow-sm">
        <p className="text-[9px] font-black tracking-widest uppercase text-neutral-400 px-2 mb-2 text-right">Core Features</p>
        {leftFeatures.map(feature => (
          <FeatureRow
            key={feature.id}
            feature={feature}
            isActive={activeFeature === feature.id}
            onClick={handleClick}
            side="left"
          />
        ))}
      </div>

      {/* Column 2: Center image deck */}
      <div className="lg:sticky lg:top-8">
        <ImageDeck activeFeature={activeFeature} />

        {/* Pagination dots */}
        <div className="flex justify-center gap-1.5 mt-4">
          {FEATURES.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFeature(f.id)}
              className="rounded-full transition-all duration-300"
              style={{
                width: activeFeature === f.id ? 20 : 6,
                height: 6,
                background: activeFeature === f.id ? f.accent : '#d1d5db',
              }}
            />
          ))}
        </div>
      </div>

      {/* Column 3: Right features 6–10 */}
      <div className="flex flex-col gap-1.5 p-4 rounded-[1.75rem] bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/50 dark:border-slate-700/50 shadow-sm">
        <p className="text-[9px] font-black tracking-widest uppercase text-neutral-400 px-2 mb-2">Smart Features</p>
        {rightFeatures.map(feature => (
          <FeatureRow
            key={feature.id}
            feature={feature}
            isActive={activeFeature === feature.id}
            onClick={handleClick}
            side="right"
          />
        ))}
      </div>

    </div>
  )
}
