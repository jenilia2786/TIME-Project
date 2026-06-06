import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { BookOpen, GraduationCap, Brain, Compass, Sparkles, Rocket, Zap, Star } from 'lucide-react'

const MESSAGES = [
  'Loading your universe...',
  'Calculating future paths...',
  'Mapping career galaxies...',
  'Powering up AI guidance...',
  'Almost ready to explore...',
]

const ICONS = [BookOpen, GraduationCap, Brain, Compass, Rocket, Zap, Star, Sparkles]

const COLORS = [
  'from-brand-400 to-cyan-400',
  'from-violet-400 to-purple-400',
  'from-sky-400 to-blue-400',
  'from-emerald-400 to-teal-400',
  'from-pink-400 to-rose-400',
  'from-amber-400 to-orange-400',
]

export default function IconLoader() {
  const [msgIndex, setMsgIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Cycle messages
    const msgTimer = setInterval(() => {
      setMsgIndex(p => (p + 1) % MESSAGES.length)
    }, 450)

    // Progress bar
    const progressTimer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(progressTimer); return 100 }
        return p + Math.random() * 12 + 4
      })
    }, 100)

    return () => { clearInterval(msgTimer); clearInterval(progressTimer) }
  }, [])

  return (
    <motion.div
      key="icon-loader"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 30%, #f0f7ff 60%, #f5f3ff 100%)',
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 6 + 3,
              height: Math.random() * 6 + 3,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: ['#14b8a6', '#06b6d4', '#8b5cf6', '#10b981'][i % 4],
              opacity: 0.3,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Animated rings */}
        {[200, 320, 440].map((size, i) => (
          <motion.div
            key={size}
            className="absolute top-1/2 left-1/2 rounded-full border"
            style={{
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
              borderColor: `rgba(20,184,166,${0.12 - i * 0.03})`,
            }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{
              duration: 8 + i * 4,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {/* Small dot on ring */}
            <motion.div
              className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-brand-400"
              style={{ boxShadow: '0 0 8px rgba(20,184,166,0.6)' }}
            />
          </motion.div>
        ))}
      </div>

      {/* Center logo */}
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.1 }}
        className="relative mb-8"
      >
        <motion.div
          animate={{ boxShadow: [
            '0 0 20px rgba(20,184,166,0.3)',
            '0 0 50px rgba(20,184,166,0.6)',
            '0 0 20px rgba(20,184,166,0.3)',
          ]}}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center"
        >
          <Sparkles size={36} className="text-white" />
        </motion.div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-3 rounded-[2rem] border border-dashed border-brand-200/60"
        />
      </motion.div>

      {/* Brand name */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-black text-neutral-900 tracking-tight mb-1"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        tnea
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-brand-500 font-semibold tracking-widest uppercase mb-8"
      >
        Educational Guidance
      </motion.p>

      {/* Bouncing icon row */}
      <div className="flex items-center gap-3 mb-8">
        {ICONS.slice(0, 6).map((Icon, i) => (
          <motion.div
            key={i}
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${COLORS[i]} flex items-center justify-center`}
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            animate={{
              y: [0, -14, 0],
              rotate: [0, 6, -6, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          >
            <Icon size={18} className="text-white" />
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-56 mb-4">
        <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden border border-neutral-200/60">
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${Math.min(progress, 100)}%`,
              background: 'linear-gradient(90deg, #14b8a6, #06b6d4)',
              boxShadow: '0 0 8px rgba(20,184,166,0.5)',
              transition: 'width 0.1s ease',
            }}
          />
        </div>
      </div>

      {/* Animated messages */}
      <div className="h-5 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="text-xs font-semibold text-brand-500 tracking-wider text-center"
          >
            {MESSAGES[msgIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
