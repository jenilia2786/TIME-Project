import { useRef } from 'react'
import { ArrowRight, BookOpen, Map, Target, Users, Search, Shield, HelpCircle, CheckCircle, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import ScrollReveal from '../components/ui/ScrollReveal'
import GameCard from '../components/ui/GameCard'
import NeonButton from '../components/ui/NeonButton'
import NeuralBackground from '../components/ui/NeuralBackground'
import ParticleField from '../components/ui/ParticleField'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}
const itemVariants = {
  hidden:  { opacity: 0, y: 30, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 180, damping: 22 } },
}

const STEPS = [
  { step: 1, title: 'Simple Signup',   desc: 'Just your name and mobile number with OTP. No passwords to remember.',                   color: 'from-emerald-400 to-teal-400', glow: 'rgba(16,185,129,0.2)' },
  { step: 2, title: 'Build Profile',   desc: 'Share your academic interests, subjects, and goals through an interactive quiz.',         color: 'from-brand-400 to-cyan-400',   glow: 'rgba(20,184,166,0.2)' },
  { step: 3, title: 'Get Insights',    desc: 'Instantly access personalized career pathways and college eligibility recommendations.',  color: 'from-sky-400 to-blue-400',     glow: 'rgba(14,165,233,0.2)' },
]

const FEATURES = [
  { icon: Map,      title: 'Career Roadmaps',       desc: 'Detailed pathways showing the exact educational steps to reach your dream career.',                    color: 'from-teal-400 to-cyan-400',     glow: 'rgba(20,184,166,0.2)'   },
  { icon: BookOpen, title: 'Stream Guidance',        desc: 'Unsure what to take after 10th? We align your natural strengths with the right academic group.',       color: 'from-violet-400 to-purple-400', glow: 'rgba(139,92,246,0.2)'   },
  { icon: Search,   title: 'College Exploration',    desc: 'Filter through hundreds of colleges based on cutoff, infrastructure, and placement records.',           color: 'from-sky-400 to-blue-400',      glow: 'rgba(14,165,233,0.2)'   },
  { icon: Target,   title: 'Personalized Matches',   desc: 'AI-assisted insights that map your quiz results to the most logical future domains.',                  color: 'from-amber-400 to-orange-400',  glow: 'rgba(245,158,11,0.2)'   },
  { icon: Shield,   title: 'Scholarship Finder',     desc: 'Discover government and private financial aid tailored to your community and income.',                  color: 'from-pink-400 to-rose-400',     glow: 'rgba(236,72,153,0.2)'   },
  { icon: Users,    title: 'Student-First Design',   desc: 'A calm, unbiased environment free from advertisements or sponsored college placements.',                color: 'from-emerald-400 to-teal-400',  glow: 'rgba(16,185,129,0.2)'   },
]

const FAQS = [
  { q: 'Is this connected to TNEA official counselling?', a: 'No. This is an independent educational guidance platform designed to help you prepare and make informed decisions BEFORE you enter official counselling.' },
  { q: 'Can I use this before my results are announced?', a: 'Absolutely! You can explore career pathways and college cutoffs using expected marks or simply by exploring your interests.' },
  { q: 'How are the recommendations generated?', a: 'Our system analyzes your responses to the onboarding quiz—looking at your favorite subjects, working style, and goals—and cross-references them with industry trends and historical college data.' },
  { q: 'Can parents use this platform?', a: 'Yes! We encourage parents and students to use the platform together to have data-backed discussions about future educational investments.' },
]

export default function LearnMore({ openModal }) {
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.04])

  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section ref={heroRef} className="bg-white pt-24 pb-28 relative overflow-hidden">
        <ParticleField count={40} />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(20,184,166,0.12),transparent)]" />
          <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
            <motion.div
              animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-[500px] h-[500px] rounded-full bg-teal-100/40 blur-3xl -top-40 -left-40"
            />
            <motion.div
              animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
              transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-[400px] h-[400px] rounded-full bg-violet-100/30 blur-3xl top-10 -right-20"
            />
          </motion.div>
        </div>

        <div className="mx-auto max-w-[900px] px-6 text-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-700 rounded-full px-4 py-2 text-sm font-semibold mb-6">
              <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }} className="inline-block">✨</motion.span>
              Tamil Nadu's Premier Guidance Platform
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-[4.5rem] font-extrabold text-neutral-900 leading-[1.05] tracking-tight mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Guidance Designed for{' '}
              <span
                className="bg-gradient-to-r from-brand-500 via-cyan-400 to-teal-400 bg-clip-text text-transparent"
                style={{ backgroundSize: '200% auto', animation: 'gradientX 3s ease infinite' }}
              >
                Tamil Nadu Students
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed mb-10">
              Helping students and parents make better educational decisions through intelligent profiling, unbiased recommendations, and personalized pathway analysis.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
              <NeonButton variant="game" onClick={openModal} className="px-8 py-4 text-base" id="learnmore-start">
                Start Your Journey <ArrowRight size={18} />
              </NeonButton>
              <NeonButton variant="outline" onClick={() => navigate('/')} className="px-8 py-4 text-base">
                Go Back Home
              </NeonButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── About (Ice Blue) ──────────────────────────────── */}
      <section id="about" className="py-24 bg-[#F0F7FF] relative overflow-hidden">
        <NeuralBackground opacity={0.12} nodeCount={35} />
        <div className="mx-auto max-w-[1000px] px-6 relative z-10">
          <ScrollReveal variant="zoomIn" className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              What is this platform?
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: CheckCircle,
                iconClass: 'from-emerald-400 to-teal-400',
                title: 'What it IS',
                items: [
                  'An intelligent educational guidance assistant.',
                  'A tool to explore careers, colleges, and streams.',
                  'A decision-support system for students and parents.',
                ],
                color: 'rgba(16,185,129,0.1)',
              },
              {
                icon: X,
                iconClass: 'from-rose-400 to-red-400',
                title: 'What it is NOT',
                items: [
                  'NOT a replacement for official TNEA counselling.',
                  'NOT a portal to perform college admissions.',
                  'NOT a system that guarantees college seats.',
                ],
                color: 'rgba(244,63,94,0.1)',
              },
            ].map((card, i) => (
              <GameCard key={card.title} delay={i * 0.15} glowColor={card.color} className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${card.iconClass} flex items-center justify-center shadow-sm`}>
                    <card.icon size={18} className="text-white" />
                  </div>
                  <h3 className="font-bold text-neutral-900 text-lg">{card.title}</h3>
                </div>
                <ul className="space-y-3">
                  {card.items.map((item, j) => (
                    <motion.li
                      key={j}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: j * 0.08 + i * 0.1 }}
                      className="flex gap-2.5 text-neutral-600 font-medium text-sm"
                    >
                      <span className="mt-0.5 shrink-0 text-brand-400">•</span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </GameCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works (Mint) ─────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-[#F0FDF4] relative overflow-hidden">
        <div className="mx-auto max-w-[1000px] px-6">
          <ScrollReveal variant="zoomIn" className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-4 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              How the Platform Works
            </h2>
            <p className="text-lg text-neutral-500">A frictionless flow designed to respect your time and provide immediate value.</p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Animated connector line */}
            <div className="hidden md:block absolute top-14 left-[18%] right-[18%] h-px overflow-hidden">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                className="h-full origin-left"
                style={{ background: 'linear-gradient(90deg, #34d399, #14b8a6, #06b6d4)', opacity: 0.5 }}
              />
            </div>

            {STEPS.map((s, i) => (
              <GameCard key={s.step} delay={i * 0.15} glowColor={s.glow} className="p-8 text-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`h-16 w-16 mx-auto bg-gradient-to-br ${s.color} text-white rounded-2xl flex items-center justify-center text-2xl font-black mb-6 shadow-lg`}
                >
                  {s.step}
                </motion.div>
                <h3 className="text-lg font-bold text-neutral-900 mb-3">{s.title}</h3>
                <p className="text-neutral-500 leading-relaxed text-sm">{s.desc}</p>
              </GameCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features (White) ─────────────────────────────── */}
      <section id="features" className="py-24 bg-white relative overflow-hidden">
        <NeuralBackground opacity={0.08} nodeCount={40} />
        <div className="mx-auto max-w-[1200px] px-6 relative z-10">
          <ScrollReveal variant="zoomIn" className="mb-14 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-4 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Powerful Features
            </h2>
            <p className="text-neutral-500 max-w-lg mx-auto">Everything you need to navigate the TNEA process and discover your perfect educational match.</p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <GameCard key={f.title} delay={i * 0.08} glowColor={f.glow} className="p-8 group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 shadow-md`}
                >
                  <f.icon size={26} className="text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">{f.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{f.desc}</p>
              </GameCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── Journey (Warm Cream) ─────────────────────────── */}
      <section id="journey" className="py-24 bg-[#FFFBEB] relative overflow-hidden">
        <div className="mx-auto max-w-[1000px] px-6">
          <ScrollReveal variant="zoomIn" className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-4 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Visualizing Your Educational Journey
            </h2>
            <p className="text-neutral-600 text-lg max-w-xl mx-auto">We help you see the destination before you take the first step.</p>
          </ScrollReveal>

          <GameCard className="p-8 md:p-12" glowColor="rgba(20,184,166,0.15)">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {[
                { label: '10th Standard', value: 'Math & Logic',      accent: 'brand', active: false },
                { label: '11th/12th',     value: 'Computer Science',  accent: 'brand', active: false },
                { label: 'Undergrad',     value: 'B.E. AI & ML',      accent: 'brand', active: true  },
                { label: 'Career Goal',   value: 'ML Engineer',       accent: 'emerald', active: false },
              ].map((node, i) => (
                <div key={node.label} className="flex items-center gap-4 w-full md:w-auto flex-col md:flex-row">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, type: 'spring', stiffness: 200 }}
                    whileHover={{ scale: 1.05, y: -3 }}
                    className={`relative px-6 py-5 rounded-2xl text-center w-full md:w-auto shadow-sm cursor-default ${
                      node.active
                        ? 'border-2 border-brand-400 bg-white'
                        : node.accent === 'emerald'
                          ? 'border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50'
                          : 'border border-neutral-100 bg-white'
                    }`}
                    style={node.active ? { boxShadow: '0 0 20px rgba(20,184,166,0.25)' } : {}}
                  >
                    {node.active && (
                      <>
                        <div className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-brand-500 rounded-full animate-ping opacity-60" />
                        <div className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center">
                          <Target size={10} className="text-white" />
                        </div>
                      </>
                    )}
                    <p className={`font-bold text-xs uppercase tracking-widest mb-2 ${node.active ? 'text-brand-600' : node.accent === 'emerald' ? 'text-emerald-600' : 'text-brand-500'}`}>
                      {node.label}
                    </p>
                    <p className="font-extrabold text-neutral-900 text-sm">{node.value}</p>
                  </motion.div>

                  {i < 3 && (
                    <motion.div
                      initial={{ scaleX: 0, opacity: 0 }}
                      whileInView={{ scaleX: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 + 0.2, duration: 0.4 }}
                      className="hidden md:block"
                    >
                      <ArrowRight size={20} className="text-brand-300" />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </GameCard>
        </div>
      </section>

      {/* ── FAQ (Lavender) ───────────────────────────────── */}
      <section id="faq" className="py-24 bg-[#F5F3FF] relative overflow-hidden">
        <div className="mx-auto max-w-[800px] px-6">
          <ScrollReveal variant="zoomIn" className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Frequently Asked Questions
            </h2>
          </ScrollReveal>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <ScrollReveal key={i} delay={i * 0.1} variant="slideLeft">
                <motion.div
                  whileHover={{ scale: 1.01, x: 4 }}
                  className="glass-card bg-white/80 p-6 border border-white/80 cursor-default"
                >
                  <div className="flex gap-4">
                    <motion.div
                      whileHover={{ rotate: 20, scale: 1.1 }}
                      className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center"
                    >
                      <HelpCircle size={15} />
                    </motion.div>
                    <div>
                      <h4 className="font-bold text-neutral-900 mb-2">{faq.q}</h4>
                      <p className="text-neutral-600 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-32 bg-white relative overflow-hidden">
        <ParticleField count={35} />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] -z-10"
          style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.15), transparent)' }}
        />

        <div className="text-center px-6 relative z-10">
          <ScrollReveal variant="zoomIn">
            <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-700 rounded-full px-4 py-2 text-sm font-semibold mb-6">
              🚀 Ready to launch your future?
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-900 mb-6 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Ready to find{' '}
              <span className="bg-gradient-to-r from-brand-500 to-cyan-500 bg-clip-text text-transparent" style={{ backgroundSize: '200% auto', animation: 'gradientX 3s ease infinite' }}>
                your path?
              </span>
            </h2>
            <p className="text-neutral-500 mb-10 max-w-xl mx-auto text-lg">Join thousands of students making informed educational decisions today.</p>
            <NeonButton variant="game" onClick={openModal} className="px-10 py-5 text-lg font-bold" id="learnmore-cta">
              Get Started for Free <ArrowRight size={20} />
            </NeonButton>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
