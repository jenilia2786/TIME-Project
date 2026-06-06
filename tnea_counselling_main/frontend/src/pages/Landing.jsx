import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion'
import {
  ArrowRight, BookOpen, Brain, Compass, GraduationCap, Target,
  Star, Zap, TrendingUp, Users, Award, ChevronRight, Sparkles,
  Map, Shield, CheckCircle, BarChart3, Heart, AlertCircle, Search, MessageSquare,
  Cpu, Palette, Briefcase, Microscope, Scale, PenTool, Plane,
  Anchor, Coffee, Monitor, Landmark, Activity, Leaf, Dna, Home,
  ChevronDown, Play, Trophy, Flame, Rocket, BarChart, Globe,
  ChevronUp, Send, Bot, Lock, User, Smartphone, LayoutDashboard,
  Network, Layers, PenLine, Building2
} from 'lucide-react'
import useStudentStore from '../store/useStudentStore'
import ScrollReveal, { ScrollRevealItem } from '../components/ui/ScrollReveal'
import ParticleField from '../components/ui/ParticleField'
import NeonButton from '../components/ui/NeonButton'
import GameCard from '../components/ui/GameCard'
import AnimatedCounter from '../components/ui/AnimatedCounter'
import AchievementBadge from '../components/ui/AchievementBadge'
import FloatingMascot from '../components/ui/FloatingMascot'
import InteractiveJourneyExplorer from '../components/ui/InteractiveJourneyExplorer'
import StudentConstellation from '../components/ui/StudentConstellation'
import FeaturesThreeColumn from '../components/ui/FeaturesThreeColumn'
import AddReviewModal from '../components/ui/AddReviewModal'

/* ─── Static data ─────────────────────────────────────────── */
const STATS = [
  { value: 12000, label: 'Students Guided', suffix: '+', icon: Users, color: 'from-teal-400 to-cyan-400', glow: 'rgba(20,184,166,0.3)' },
  { value: 500,   label: 'Colleges Listed', suffix: '+', icon: GraduationCap, color: 'from-violet-400 to-purple-400', glow: 'rgba(139,92,246,0.3)' },
  { value: 98,    label: 'Success Rate',    suffix: '%', icon: Award, color: 'from-sky-400 to-blue-400', glow: 'rgba(56,189,248,0.3)' },
  { value: 40,    label: 'Career Paths',    suffix: '+', icon: Compass, color: 'from-emerald-400 to-teal-400', glow: 'rgba(16,185,129,0.3)' },
]

/* ─── Platform Story Blocks ─────────────────────────────── */
const STORY_BLOCKS = [
  {
    id: 'domains',
    step: '01',
    badge: 'Explore Freely',
    heading: 'Discover Your\nEducational Universe',
    sub: 'Browse 11 parent domains spanning Engineering, Medicine, Aviation, AI, Government Services, Marine, Hotel Management, Arts, and Commerce. Every domain opens a world of careers.',
    gradient: 'from-teal-500 to-cyan-500',
    softBg: 'from-teal-50 to-cyan-50',
    glowColor: 'rgba(20,184,166,0.25)',
    cta: 'Explore Domains',
    highlights: ['Engineering & Technology', 'Medicine & Healthcare', 'AI & Emerging Tech', 'Aviation & Aerospace', 'Government Services', 'Marine Studies', 'Hotel Management', 'Arts & Humanities', 'Commerce & Finance'],
    icon: Globe,
    image: '/images/step_1_domains.png',
  },
  {
    id: 'login',
    step: '02',
    badge: 'Simple Access',
    heading: 'Login Instantly,\nExplore Immediately',
    sub: 'Sign in with just your mobile number and date of birth — no complicated forms. Start exploring the educational ecosystem right away, before you even create a full profile.',
    gradient: 'from-violet-500 to-purple-500',
    softBg: 'from-violet-50 to-purple-50',
    glowColor: 'rgba(139,92,246,0.25)',
    cta: 'Get Started Free',
    highlights: ['Mobile + DOB Login', 'Instant Generic Dashboard', 'Explore Before Personalizing', 'No Pressure, No Forms'],
    icon: Smartphone,
    image: '/images/step_2_login.png',
  },
  {
    id: 'ai',
    step: '03',
    badge: 'AI Mentorship',
    heading: 'Your Personal\nAI Career Guide',
    sub: 'The built-in AI assistant understands your questions about college admissions, career paths, and scholarships. Have natural conversations and get personalized insights based on your profile.',
    gradient: 'from-brand-500 to-violet-600',
    softBg: 'from-brand-50 to-violet-50',
    glowColor: 'rgba(20,184,166,0.3)',
    cta: 'Meet the AI Assistant',
    highlights: ['AI Career Guidance', 'Voice Interaction Support', 'Educational Conversations', 'Context-Aware Responses'],
    icon: Brain,
    image: '/images/step_3_ai.png',
  },
  {
    id: 'profile',
    step: '04',
    badge: 'Personalization',
    heading: 'Build Your\nLearning Identity',
    sub: 'Create your educational profile in under 5 minutes. Add your interests, career goals, academic strengths, and preferences. The platform immediately adapts to serve you better.',
    gradient: 'from-sky-500 to-blue-600',
    softBg: 'from-sky-50 to-blue-50',
    glowColor: 'rgba(14,165,233,0.25)',
    cta: 'Create Profile',
    highlights: ['Add Interests & Goals', 'Academic Profile Setup', 'Lifestyle Preferences', 'Unlock AI Personalization'],
    icon: User,
    image: '/images/step_4_profile.png',
  },
  {
    id: 'personalized',
    step: '05',
    badge: 'Your Dashboard',
    heading: 'Guidance That\nUnderstands You',
    sub: 'Once personalized, your dashboard transforms. Get smart college recommendations filtered by district, cutoff, budget, and hostel. See compatibility scores, educational roadmaps, and scholarship matches — all tailored to you.',
    gradient: 'from-emerald-500 to-teal-600',
    softBg: 'from-emerald-50 to-teal-50',
    glowColor: 'rgba(16,185,129,0.3)',
    cta: 'See It in Action',
    highlights: ['Personalized College Matches', 'Smart Career Roadmaps', 'Scholarship Discovery', 'AI Mentorship', 'Compatibility Scores'],
    icon: LayoutDashboard,
    image: '/images/step_5_dashboard.png',
  },
]




/* ─── FAQ data ────────────────────────────────────────────── */
const FAQ_ITEMS = [
  {
    q: 'Is this connected to the official TNEA portal?',
    a: 'No, this is an independent educational guidance platform. It is NOT the official TNEA (Tamil Nadu Engineering Admissions) portal. We provide guidance and information to help students understand the process, but all official admissions must be done through the official TNEA website.',
  },
  {
    q: 'Can I use this platform before my results are announced?',
    a: 'Absolutely! In fact, we recommend starting early. You can explore all educational domains, career paths, colleges, and scholarships well before your results. This gives you time to research and make informed decisions without last-minute pressure.',
  },
  {
    q: 'How does personalization work on this platform?',
    a: 'After you create a profile (takes under 5 minutes), you share your interests, academic strengths, career goals, and lifestyle preferences. Our AI analyzes this data and adapts your dashboard — showing college matches, career roadmaps, and scholarships most relevant to your unique profile.',
  },
  {
    q: 'Can parents use this platform alongside their children?',
    a: 'Yes! Parents are welcome to explore the platform. It is designed to be accessible to both students and parents. Families can explore domains together, understand career pathways, and make collaborative educational decisions with clarity and confidence.',
  },
  {
    q: 'How does the AI assistant help with career guidance?',
    a: 'The AI assistant answers questions about college admissions, career paths, scholarship eligibility, and educational requirements — specifically focused on Tamil Nadu education. After you complete your profile, it becomes even more intelligent and gives you context-aware, personalized guidance.',
  },
  {
    q: 'How are college and career recommendations generated?',
    a: 'Recommendations are generated based on your profile data: your academic background, stated interests, preferred district, budget range, hostel preference, and college type preference. We also factor in real-time demand data for career fields to suggest future-ready paths.',
  },
]

/* ─── Platform-specific Q&A knowledge base ─────────────────── */
const FAQ_KB = [
  { keywords: ['tnea', 'official', 'connected', 'government'], answer: 'This is an independent educational guidance platform — not the official TNEA portal. We help students understand and prepare for the TNEA process, but official admissions must be done at tnea.ac.in.' },
  { keywords: ['login', 'sign in', 'access', 'mobile', 'otp'], answer: 'You can sign in with just your mobile number and date of birth. No complicated forms or passwords required. Your session is saved so you can return anytime.' },
  { keywords: ['free', 'cost', 'price', 'pay', 'subscription'], answer: 'The platform is completely free to use — forever. No hidden fees, no subscription required. All features including AI guidance, college search, and scholarship discovery are free.' },
  { keywords: ['personalize', 'personal', 'profile', 'how does'], answer: 'After creating a profile with your interests, academic background, and goals (takes ~5 minutes), your dashboard personalizes with college matches, career roadmaps, compatibility scores, and scholarship recommendations tailored to you.' },
  { keywords: ['ai', 'assistant', 'chat', 'mentor'], answer: 'The AI assistant is a platform-focused guide. Ask it about colleges, career paths, domain exploration, scholarships, or how to use platform features. After you build a profile, it becomes context-aware and gives personalized suggestions.' },
  { keywords: ['college', 'colleges', 'recommend', 'suggestion', 'find'], answer: 'You can explore 500+ colleges across Tamil Nadu. Filter by domain, district, type (government/private), cutoff range, budget, and hostel availability. After creating a profile, you get personalized college matches with compatibility scores.' },
  { keywords: ['scholarship', 'financial', 'aid', 'money', 'fund'], answer: 'Browse government, merit, community, and private scholarships. Filter by category, district, and eligibility. After personalizing your profile, we surface the most relevant scholarships for your background.' },
  { keywords: ['domain', 'field', 'stream', 'career', 'path'], answer: 'The platform covers 11 educational domains: Engineering & Technology, Medicine & Healthcare, AI & Emerging Tech, Aviation, Government Services, Commerce & Finance, Marine Studies, Hotel Management, and Arts & Humanities. Each expands into specific fields and career paths.' },
  { keywords: ['result', 'cutoff', 'mark', 'rank', 'score'], answer: 'You can explore all domains and colleges before your results. After results, use the cutoff filter in college search to find colleges matching your actual score. The platform helps you strategize based on realistic cutoff ranges.' },
  { keywords: ['parent', 'parents', 'family', 'guardian'], answer: 'Yes, parents are welcome to use the platform alongside their children. It helps families understand career options, college landscapes, and educational pathways together — reducing confusion and improving joint decision-making.' },
  { keywords: ['roadmap', 'pathway', 'journey', 'steps'], answer: 'Educational roadmaps show your complete journey from 10th grade to your dream career — step by step. Each roadmap shows the right subject group, college entrance requirements, degree options, and career destinations with salary and demand data.' },
  { keywords: ['data', 'privacy', 'safe', 'secure'], answer: 'Your data is stored locally in your browser and is never shared with third parties. The platform does not collect sensitive personal or financial data. Your session recovery ID allows you to restore your profile on any device.' },
]

const TESTIMONIALS = [
  { name: 'Karthik S.', standard: '12th Grade Student', text: 'I was confused between Biology and Computer Science. The platform helped me understand both pathways and my own strengths.', rating: 5, avatar: 'KS', color: 'from-violet-400 to-purple-400' },
  { name: 'Priya M.', standard: '1st Year B.E. AI & DS', text: "The career roadmap helped me discover AI Engineering. I didn't even know this branch existed before I used the explorer!", rating: 5, avatar: 'PM', color: 'from-teal-400 to-cyan-400' },
  { name: 'Ramesh K.', standard: 'Parent of 10th Student', text: "It took away all the stress of group selection. We now have a clear 5-year plan for our daughter's education.", rating: 5, avatar: 'RK', color: 'from-sky-400 to-blue-400' },
  { name: 'Divya R.', standard: 'B.Tech IT, Trichy', text: 'This guided me perfectly through TNEA counselling. No more information overload, just clear, step-by-step guidance.', rating: 5, avatar: 'DR', color: 'from-emerald-400 to-teal-400' },
]

/* ─── Helpers ─────────────────────────────────────────────── */
const heroWord = (delay = 0) => ({
  initial: { opacity: 0, y: 30, rotateX: -20 },
  animate: { opacity: 1, y: 0, rotateX: 0 },
  transition: { duration: 0.6, delay, type: 'spring', bounce: 0.4 },
})

function FloatingBlob({ className }) {
  return (
    <motion.div
      animate={{ borderRadius: ['60% 40% 30% 70% / 60% 30% 70% 40%', '30% 60% 70% 40% / 50% 60% 30% 60%', '60% 40% 30% 70% / 60% 30% 70% 40%'] }}
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      className={`absolute pointer-events-none ${className}`}
    />
  )
}

function StatCard({ stat, delay }) {
  const Icon = stat.icon
  return (
    <GameCard delay={delay * 0.15} glowColor={stat.glow} className="p-6 flex flex-col gap-3">
      <motion.div
        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
        transition={{ duration: 0.4 }}
        className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-glow-teal`}
      >
        <Icon size={20} className="text-white" />
      </motion.div>
      <div>
        <p className="text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
          <AnimatedCounter target={stat.value} suffix={stat.suffix} />
        </p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">{stat.label}</p>
      </div>
    </GameCard>
  )
}

/* ─── Story Block Component ─────────────────────────────── */
function StoryBlock({ block, index, openModal, navigate }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const isEven = index % 2 === 0
  const Icon = block.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, type: 'spring', bounce: 0.2, delay: 0.1 }}
      className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${isEven ? '' : 'lg:grid-flow-dense'}`}
    >
      {/* Text side */}
      <div className={`flex flex-col gap-6 ${!isEven ? 'lg:col-start-2' : ''}`}>
        {/* Step badge */}
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full bg-gradient-to-r ${block.gradient} text-white`}>
            Step {block.step}
          </span>
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{block.badge}</span>
        </div>

        {/* Heading */}
        <h3
          className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-[1.1] tracking-tight whitespace-pre-line"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {block.heading.split('\n').map((line, i) => (
            i === 1 ? (
              <span key={i} className={`bg-gradient-to-r ${block.gradient} bg-clip-text text-transparent block`}>{line}</span>
            ) : <span key={i} className="block">{line}</span>
          ))}
        </h3>

        {/* Sub */}
        <p className="text-base text-neutral-600 leading-relaxed max-w-md">{block.sub}</p>

        {/* Highlights */}
        <div className="grid grid-cols-2 gap-2">
          {block.highlights.map((hl, i) => (
            <motion.div
              key={hl}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.06 }}
              className="flex items-center gap-2 text-sm font-medium text-neutral-700"
            >
              <CheckCircle size={14} className={`bg-gradient-to-r ${block.gradient} bg-clip-text text-transparent`} style={{ color: block.gradient.includes('teal') ? '#14b8a6' : block.gradient.includes('violet') ? '#8b5cf6' : block.gradient.includes('brand') ? '#14b8a6' : block.gradient.includes('sky') ? '#0ea5e9' : '#10b981' }} />
              {hl}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={openModal}
          className={`inline-flex items-center gap-2 w-fit px-6 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r ${block.gradient} shadow-lg`}
          style={{ boxShadow: `0 8px 24px ${block.glowColor}` }}
        >
          {block.cta}
          <ArrowRight size={14} />
        </motion.button>
      </div>

      {/* Visual side */}
      <div className={`relative ${!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 5 + index, repeat: Infinity, ease: 'easeInOut' }}
          className="relative"
        >
          {/* Main visual card */}
          <div
            className={`relative overflow-hidden rounded-[2rem] p-8 bg-gradient-to-br ${block.softBg} border border-white/60`}
            style={{ boxShadow: `0 24px 64px ${block.glowColor}, 0 4px 16px rgba(0,0,0,0.06)` }}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                backgroundSize: '32px 32px',
              }}
            />

            {/* Generated Image */}
            <div className="relative z-10 rounded-xl overflow-hidden shadow-lg border border-white/40 mb-6 bg-white dark:bg-neutral-800">
              <img src={block.image} alt={block.badge} className="w-full h-auto object-cover" />
            </div>

            {/* Highlight chips */}
            <div className="flex flex-wrap gap-2 relative z-10">
              {block.highlights.slice(0, 3).map((hl) => (
                <span
                  key={hl}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-full bg-white dark:bg-neutral-800 border border-white/90 shadow-sm`}
                  style={{ color: block.gradient.includes('teal') ? '#0f766e' : block.gradient.includes('violet') ? '#6d28d9' : block.gradient.includes('sky') ? '#0369a1' : block.gradient.includes('brand') ? '#0d9488' : '#065f46' }}
                >
                  {hl}
                </span>
              ))}
            </div>

            {/* Step number overlay */}
            <div className="absolute top-6 right-6 text-7xl font-black opacity-[0.03] select-none z-0">
              {block.step}
            </div>
          </div>

          {/* Floating accent */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20 + index * 3, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-4 -right-4 w-16 h-16 rounded-full border-2 border-dashed opacity-20"
            style={{ borderColor: block.glowColor.replace('0.', '0.6').replace('rgba', 'rgba') }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}





/* ─── FAQ Section ─────────────────────────────────────── */
function FAQSection({ openModal }) {
  const [openIdx, setOpenIdx] = useState(null)
  const [faqInput, setFaqInput] = useState('')
  const [faqAnswer, setFaqAnswer] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const inputRef = useRef(null)

  const handleFaqSubmit = (e) => {
    e.preventDefault()
    if (!faqInput.trim()) return

    const query = faqInput.toLowerCase()
    setIsTyping(true)
    setFaqAnswer(null)

    setTimeout(() => {
      const match = FAQ_KB.find(item =>
        item.keywords.some(kw => query.includes(kw))
      )

      setFaqAnswer(match?.answer || "I can only answer questions about the TNEA Guidance Platform — its features, how personalization works, college and career discovery, and the AI assistant. Try asking about 'how does AI assistant help?' or 'is this platform free?'")
      setIsTyping(false)
    }, 1000)
  }

  return (
    <section id="faq" className="py-24 bg-transparent relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <ScrollReveal variant="zoomIn" className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-700 dark:text-violet-300 rounded-full px-4 py-2 text-sm font-semibold mb-4">
            <MessageSquare size={13} className="text-violet-500 dark:text-violet-400" /> Frequently Asked Questions
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-neutral-100 dark:text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Your Questions,{' '}
            <span className="bg-gradient-to-r from-violet-500 to-brand-500 bg-clip-text text-transparent">Answered</span>
          </h2>
          <p className="text-lg text-neutral-500 dark:text-neutral-400 mt-4 max-w-xl mx-auto">
            Everything students and parents need to know about the platform.
          </p>
        </ScrollReveal>

        {/* FAQ Items */}
        <div className="space-y-3 mb-12">
          {FAQ_ITEMS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="border border-neutral-200 dark:border-neutral-700 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-neutral-800 dark:bg-slate-800/50"
              style={{ boxShadow: openIdx === i ? '0 4px 20px rgba(139,92,246,0.1)' : '0 2px 8px rgba(0,0,0,0.04)' }}
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-neutral-50 dark:bg-neutral-800/50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <span className="font-semibold text-sm text-neutral-800 dark:text-white pr-4">{faq.q}</span>
                <motion.div
                  animate={{ rotate: openIdx === i ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="shrink-0"
                >
                  <ChevronDown size={16} className={openIdx === i ? 'text-violet-500' : 'text-neutral-400'} />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-slate-700/50 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* AI FAQ Assistant */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-brand-100 dark:border-brand-900/30 p-6 bg-gradient-to-br from-teal-50/90 to-cyan-50/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-sm"
          style={{ boxShadow: '0 8px 32px rgba(20,184,166,0.1)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-cyan-500 flex items-center justify-center shadow-sm"
            >
              <Bot size={18} className="text-white" />
            </motion.div>
            <div>
              <p className="font-bold text-neutral-900 dark:text-neutral-100 dark:text-white text-sm">Ask the Platform Assistant</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 dark:text-neutral-400">Answers only platform-related questions</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[11px] font-bold text-emerald-600">Online</span>
            </div>
          </div>

          {/* Answer display */}
          <AnimatePresence mode="wait">
            {isTyping && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 p-4 rounded-2xl bg-white dark:bg-neutral-800/80 dark:bg-slate-700/80 border border-brand-100 dark:border-brand-900/50"
              >
                <div className="flex gap-1.5 items-center">
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i} animate={{ y: [-3, 3, -3] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-brand-400" />
                  ))}
                  <span className="text-xs text-neutral-400 ml-2">Searching platform knowledge...</span>
                </div>
              </motion.div>
            )}
            {faqAnswer && !isTyping && (
              <motion.div
                key="answer"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 rounded-2xl bg-white dark:bg-neutral-800/80 dark:bg-slate-700/80 border border-brand-100 dark:border-brand-900/50"
              >
                <div className="flex items-start gap-2">
                  <Bot size={14} className="text-brand-500 dark:text-brand-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">{faqAnswer}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input */}
          <form onSubmit={handleFaqSubmit} className="flex items-center gap-3">
            <input
              ref={inputRef}
              value={faqInput}
              onChange={(e) => setFaqInput(e.target.value)}
              placeholder="Ask about the platform... (e.g. 'Is this free?', 'How does AI help?')"
              className="flex-1 rounded-xl border border-brand-100 dark:border-slate-700 bg-white dark:bg-neutral-800/80 dark:bg-slate-900/80 px-4 py-3 text-sm font-medium text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/50 outline-none transition-all"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-400 to-cyan-500 flex items-center justify-center shadow-sm"
              style={{ boxShadow: '0 4px 12px rgba(20,184,166,0.35)' }}
            >
              <Send size={15} className="text-white" />
            </motion.button>
          </form>
          <p className="text-[10px] text-neutral-400 mt-2 font-medium">
            ⚠️ This assistant only answers questions about this platform's features and usage.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

/* ─── MAIN PAGE ─────────────────────────────────────────── */
export default function Landing({ openModal }) {
  const navigate = useNavigate()
  const { sessionId, lastVisitedPath, startSession } = useStudentStore()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.7])

  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const testimonialsRef = useRef(null)

  useEffect(() => {
    if (sessionId && lastVisitedPath && lastVisitedPath !== '/') {
      navigate(lastVisitedPath, { replace: true })
    }
  }, [sessionId, lastVisitedPath, navigate])

  useEffect(() => {
    const t = setInterval(() => {
      setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length)
    }, 4000)
    return () => clearInterval(t)
  }, [])

  if (sessionId && lastVisitedPath && lastVisitedPath !== '/') return null

  return (
    <div ref={containerRef} className="overflow-x-hidden relative">

      {/* AddReviewModal */}
      <AddReviewModal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} />

      {/* ══════════════════════════════════════════
          1. UNIFIED INTRO SECTION
      ══════════════════════════════════════════ */}
      <section id="overview" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-28 pb-24 bg-transparent">
        <ParticleField count={40} />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(20,184,166,0.1),transparent)]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
          {/* Top badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <span className="flex items-center gap-2 bg-gradient-to-r from-brand-50 to-cyan-50 border border-brand-200 text-brand-700 rounded-full px-5 py-2 text-sm font-semibold"
              style={{ boxShadow: '0 0 20px rgba(20,184,166,0.15)' }}>
              <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }} className="inline-block">
                <Sparkles size={14} className="text-brand-500" />
              </motion.span>
              Guidance designed for Tamil Nadu students
            </span>
          </motion.div>

          {/* Two-column: Left text + Right constellation */}
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* ── Left: Merged intro text ── */}
            <div className="flex flex-col gap-7">
              <div style={{ perspective: '600px' }}>
                <h1 className="text-5xl sm:text-6xl xl:text-[4.25rem] font-extrabold text-neutral-900 dark:text-neutral-100 leading-[1.05] tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {['Helping', 'Students'].map((word, i) => (
                    <motion.span key={word} {...heroWord(i * 0.08)} className="inline-block mr-3">{word}</motion.span>
                  ))}
                  <br />
                  <motion.span {...heroWord(0.2)} className="inline-block mr-3">Discover</motion.span>
                  <motion.span
                    {...heroWord(0.28)}
                    className="inline-block bg-gradient-to-r from-brand-500 via-cyan-400 to-teal-400 bg-clip-text text-transparent"
                    style={{ backgroundSize: '200% auto', animation: 'gradientX 3s ease infinite' }}
                  >
                    Better Paths
                  </motion.span>
                </h1>
              </div>

              {/* Problem statement */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
              >
                <p className="text-xl font-extrabold text-neutral-900 dark:text-neutral-100 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Choosing your future should not feel{' '}
                  <span className="text-rose-500">overwhelming.</span>
                </p>
                <p className="text-base text-neutral-500 dark:text-neutral-400 leading-relaxed mt-2">
                  This platform exists to simplify decision making, guide students step-by-step, and provide calm, intelligent educational insights so you can confidently plan your future.
                </p>
              </motion.div>


              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex flex-wrap items-center gap-4"
              >
                <NeonButton variant="game" onClick={openModal} id="hero-get-started" className="text-base px-8 py-4">
                  Get Started Free
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <ArrowRight size={18} />
                  </motion.span>
                </NeonButton>
                <NeonButton variant="outline" onClick={() => navigate('/learn-more')} className="text-base px-8 py-4">
                  Learn More
                </NeonButton>
                
                {/* Demo Logins */}
                <button
                  onClick={() => { startSession('Student Demo', '9999999999', 'student'); navigate('/dashboard'); }}
                  className="px-6 py-4 rounded-2xl border border-brand-200 text-brand-600 bg-brand-50 hover:bg-brand-100 font-bold transition-colors"
                >
                  Student Demo
                </button>
                <button
                  onClick={() => { startSession('Parent Demo', '8888888888', 'parent'); navigate('/dashboard'); }}
                  className="px-6 py-4 rounded-2xl border border-violet-200 text-violet-600 bg-violet-50 hover:bg-violet-100 font-bold transition-colors"
                >
                  Parent Demo
                </button>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75 }}
                className="flex flex-wrap items-center gap-5 text-sm text-neutral-500 dark:text-neutral-400"
              >
                {['Free to use', 'AI-powered', 'Trusted by 12K+ students'].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-brand-500 shrink-0" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── Right: Student Constellation ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8, type: 'spring', bounce: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-[2.5rem] overflow-hidden border border-white/60 dark:border-slate-700/50 bg-gradient-to-br from-white/70 to-white/40 dark:from-slate-800/70 dark:to-slate-900/40 backdrop-blur-xl p-6 shadow-xl transition-colors duration-300"
                style={{ boxShadow: '0 20px 60px rgba(20,184,166,0.12), 0 4px 20px rgba(0,0,0,0.06)' }}
              >
                {/* Label */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black tracking-widest uppercase text-neutral-400 flex items-center gap-1.5">
                    <Sparkles size={11} className="text-brand-500 animate-pulse" /> Constellation View
                  </span>
                </div>

                {/* Constellation */}
                <StudentConstellation />


              </div>
            </motion.div>
          </div>
        </div>

      </section>

      {/* ── Demo Video Frame ── */}
      <section className="relative z-20 mt-12 md:mt-16 mb-4 px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, type: 'spring' }}
          className="max-w-4xl mx-auto"
        >
          <motion.div 
            whileHover={{ y: -5, boxShadow: '0 25px 60px -12px rgba(20,184,166,0.35)' }}
            className="relative rounded-[2rem] overflow-hidden bg-slate-900 shadow-[0_20px_50px_rgba(8,14,27,0.25)] border border-white/20 aspect-video group flex flex-col items-center justify-center transition-all duration-500 cursor-pointer"
          >
            {/* Animated background glow */}
            <motion.div 
              animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-to-br from-brand-600/30 via-violet-600/30 to-sky-500/30 opacity-60 group-hover:opacity-100 transition-opacity duration-700" 
              style={{ backgroundSize: '200% 200%' }}
            />
            
            {/* Pulsing play button placeholder */}
            <motion.div 
              animate={{ scale: [1, 1.05, 1], boxShadow: ['0 0 0 rgba(255,255,255,0)', '0 0 20px rgba(255,255,255,0.2)', '0 0 0 rgba(255,255,255,0)'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/30 text-white mb-5 z-10"
            >
              <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1" />
            </motion.div>
            
            {/* Explanatory text */}
            <div className="relative z-10 text-center px-4">
              <h3 className="text-white font-extrabold text-lg sm:text-xl mb-1.5 drop-shadow-lg tracking-tight">See T.I.M.E in Action</h3>
              <p className="text-white/80 text-xs sm:text-sm max-w-sm mx-auto font-medium leading-relaxed drop-shadow">
                Watch this quick demo to learn how our AI guidance platform simplifies your educational journey.
              </p>
            </div>
            
            {/* Glass reflection highlight */}
            <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-[2rem]" />
          </motion.div>
        </motion.div>
      </section>




      {/* ══════════════════════════════════════════
          4. FEATURES — 3 COLUMN LAYOUT
      ══════════════════════════════════════════ */}
      <section id="features" className="pb-24 pt-8 bg-transparent relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(20,184,166,0.04),transparent)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal variant="zoomIn" className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white dark:bg-neutral-800 border border-brand-200 text-brand-700 rounded-full px-4 py-2 text-sm font-semibold mb-4" style={{ boxShadow: '0 0 20px rgba(20,184,166,0.12)' }}>
              <Layers size={13} className="text-brand-500" /> Platform Features
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Everything You Need,{' '}
              <span className="bg-gradient-to-r from-brand-500 via-cyan-400 to-violet-500 bg-clip-text text-transparent" style={{ backgroundSize: '200% auto', animation: 'gradientX 3s ease infinite' }}>
                In One Place
              </span>
            </h2>
            <p className="text-lg text-neutral-500 dark:text-neutral-400 mt-4 max-w-xl mx-auto">
              10 powerful features — click any to see how it helps you.
            </p>
          </ScrollReveal>

          <FeaturesThreeColumn openModal={openModal} />
        </div>
      </section>


      {/* ══════════════════════════════════════════
          5. JOURNEY EXPLORER
      ══════════════════════════════════════════ */}
      <section id="journey" className="py-24 bg-transparent overflow-hidden relative">
        <ParticleField count={15} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal variant="zoomIn" className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white dark:bg-neutral-800 border border-violet-200 text-violet-700 rounded-full px-4 py-2 text-sm font-semibold mb-4">
              <Map size={13} className="text-violet-500" /> Platform Walkthrough
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Your Journey to{' '}
              <span className="bg-gradient-to-r from-violet-500 to-brand-500 bg-clip-text text-transparent">Career Confidence</span>
            </h2>
            <p className="text-lg text-neutral-500 dark:text-neutral-400 mt-3 max-w-xl mx-auto">
              Five steps from first login to a fully personalized educational dashboard — click any step to explore.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <InteractiveJourneyExplorer />
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          7. TESTIMONIALS
      ══════════════════════════════════════════ */}
      <section id="testimonials" className="py-24 bg-transparent overflow-hidden relative">
        <ParticleField count={20} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal variant="zoomIn" className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white dark:bg-neutral-800 border border-violet-200 text-violet-700 rounded-full px-4 py-2 text-sm font-semibold mb-4">
              <MessageSquare size={13} className="text-violet-500" /> Guidance Success Stories
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Student{' '}
              <span className="bg-gradient-to-r from-violet-500 to-brand-500 bg-clip-text text-transparent">Experiences</span>
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 mt-3 max-w-xl mx-auto text-lg">
              Real feedback from families who found clarity and confidence.
            </p>
          </ScrollReveal>

          <div ref={testimonialsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <GameCard
                key={i}
                delay={i * 0.12}
                glowColor="rgba(139,92,246,0.15)"
                className={`p-7 flex flex-col gap-4 transition-all duration-300 ${i === activeTestimonial ? 'ring-2 ring-violet-300' : ''}`}
              >
                <div className="flex gap-1">
                  {[...Array(t.rating)].map((_, j) => (
                    <motion.div key={j} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.12 + j * 0.06 }}>
                      <Star size={14} fill="#f59e0b" className="text-amber-400" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed italic flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-white/60">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold shadow-md`}
                  >
                    {t.avatar}
                  </motion.div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{t.name}</p>
                    <p className="text-xs text-neutral-400">{t.standard}</p>
                  </div>
                </div>
              </GameCard>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === activeTestimonial ? 'w-8 bg-violet-500' : 'w-2 bg-neutral-300 hover:bg-neutral-400'}`}
              />
            ))}
          </div>

          {/* Add Review button */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mt-10"
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setReviewModalOpen(true)}
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-violet-500 to-brand-500 shadow-lg"
              style={{ boxShadow: '0 8px 24px rgba(139,92,246,0.3)' }}
            >
              <PenLine size={16} />
              Add Your Review
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          8. FAQ SECTION
      ══════════════════════════════════════════ */}
      <FAQSection openModal={openModal} />

      {/* ══════════════════════════════════════════
          9. FOOTER CTA + FOOTER
      ══════════════════════════════════════════ */}
      <footer className="relative overflow-hidden bg-[var(--theme-bg-primary)] transition-colors duration-300 border-t border-neutral-100 dark:border-slate-800">
        {/* CTA section */}
        <div className="relative py-24 px-6 overflow-hidden">
          <ParticleField count={40} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.05),transparent_70%)] pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <ScrollReveal variant="zoomIn">
              <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-700 rounded-full px-4 py-2 text-sm font-semibold mb-6 shadow-sm">
                <Rocket size={13} className="text-brand-500" /> Ready to launch your future?
              </div>
              
              <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight mb-6 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Start discovering your{' '}
                <span className="bg-gradient-to-r from-brand-500 via-cyan-400 to-teal-500 bg-clip-text text-transparent" style={{ backgroundSize: '200% auto', animation: 'gradientX 3s ease infinite' }}>
                  opportunities
                </span>
              </h2>
              
              <p className="text-lg text-neutral-600 mb-10 max-w-lg mx-auto leading-relaxed">
                Join thousands of Tamil Nadu students making intelligent, stress-free educational choices.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <NeonButton variant="game" onClick={openModal} className="text-base px-8 py-4 shadow-lg shadow-teal-500/20" id="footer-get-started">
                  Get Started Free <ArrowRight size={18} />
                </NeonButton>
                <button
                  className="px-8 py-4 text-base font-bold text-brand-600 bg-[var(--theme-bg-primary)] border border-brand-200 rounded-2xl hover:bg-brand-50 transition-all shadow-sm"
                >
                  Learn More
                </button>
              </div>

              <div className="mt-16 flex flex-wrap justify-center gap-4">
                {[
                  { icon: Trophy, text: '12K+ Students Guided' },
                  { icon: Building2, text: '500+ Colleges Listed' },
                  { icon: Sparkles, text: 'Free Forever' }
                ].map((badge, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.12 }}
                    className="flex items-center gap-2 bg-[var(--theme-bg-primary)] border border-neutral-200 dark:border-neutral-700 text-neutral-700 text-xs font-bold py-2.5 px-5 rounded-full shadow-sm"
                  >
                    <span>{badge.emoji}</span>
                    <span>{badge.text}</span>
                  </motion.div>
                ))}
              </div>

            </ScrollReveal>
          </div>
        </div>

        {/* Footer links */}
        <div className="py-16 px-6 bg-[var(--theme-bg-primary)] border-t border-neutral-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">
            <div className="flex flex-col gap-4 max-w-xs">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-[11px] font-black"
                  style={{ boxShadow: '0 0 16px rgba(20,184,166,0.35)' }}
                >
                  TIME
                </motion.div>
                <span className="text-2xl font-extrabold text-neutral-900 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>T.I.M.E</span>
              </div>
              <p className="text-sm text-neutral-500 leading-relaxed font-medium">AI-powered educational guidance for Tamil Nadu students. Discover your path, explore your future.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 lg:gap-16 text-sm">
              {[
                { heading: 'Platform', links: [{ label: 'Explore Domains', action: () => { const el = document.getElementById('domains'); el?.scrollIntoView({ behavior: 'smooth' }) } }, { label: 'Learn More', action: () => navigate('/learn-more') }, { label: 'Get Started', action: openModal }] },
                { heading: 'Support', links: [{ label: 'Contact', action: () => navigate('/contact') }, { label: 'FAQ', action: () => navigate('/faq') }] },
                { heading: 'Legal', links: [{ label: 'Privacy', action: () => navigate('/privacy') }, { label: 'Terms', action: () => navigate('/terms') }] },
              ].map(col => (
                <div key={col.heading} className="flex flex-col gap-3">
                  <h4 className="font-bold text-neutral-900 mb-2">{col.heading}</h4>
                  {col.links.map(link => (
                    <button key={link.label} onClick={link.action} className="text-neutral-500 hover:text-brand-600 text-left transition-colors font-semibold">
                      {link.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-500 font-medium">© 2026 T.I.M.E Guidance Platform. All rights reserved.</p>
            <div className="flex items-center gap-2 text-xs text-neutral-600 font-semibold bg-[var(--theme-bg-amber)] px-3.5 py-2 rounded-full border border-amber-200">
              <AlertCircle size={14} className="text-amber-500" />
              Educational Disclaimer: This is an independent guidance tool, not the official TNEA portal.
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
