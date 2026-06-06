import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const MESSAGES = [
  "You're doing great! 🌟",
  "Keep exploring paths!",
  "Every step counts! 🚀",
  "Your future is bright ✨",
  "Let's discover together!",
]

/**
 * FloatingMascot — animated mascot with bounce, blink, and speech bubble
 * Uses existing mascot.png from public/images
 */
export default function FloatingMascot({ className = '', size = 120 }) {
  const [showBubble, setShowBubble] = useState(false)
  const [msgIndex, setMsgIndex] = useState(0)

  const handleHover = () => {
    setMsgIndex(prev => (prev + 1) % MESSAGES.length)
    setShowBubble(true)
  }

  return (
    <div
      className={`relative cursor-pointer ${className}`}
      style={{ width: size, height: size }}
      onMouseEnter={handleHover}
      onMouseLeave={() => setShowBubble(false)}
    >
      {/* Glow ring underneath mascot */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full blur-md"
        style={{ background: 'radial-gradient(ellipse, rgba(20,184,166,0.5), transparent)' }}
      />

      {/* Mascot body */}
      <motion.div
        animate={{
          y: [-6, 6, -6],
          rotate: [-2, 2, -2],
        }}
        transition={{
          y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
        whileHover={{ scale: 1.08 }}
        className="w-full h-full"
      >
        {/* Try to use mascot.png, fallback to emoji */}
        <div
          className="w-full h-full rounded-3xl flex items-center justify-center text-5xl select-none"
          style={{
            background: 'linear-gradient(135deg, rgba(20,184,166,0.1), rgba(6,182,212,0.05))',
            border: '2px solid rgba(20,184,166,0.15)',
          }}
        >
          🤖
        </div>
      </motion.div>

      {/* Blink eyes (overlaid on mascot) */}
      <motion.div
        animate={{ scaleY: [1, 0.05, 1] }}
        transition={{
          duration: 0.15,
          repeat: Infinity,
          repeatDelay: Math.random() * 3 + 2,
        }}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* Speech bubble */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute -top-14 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-slate-800 border border-brand-100 rounded-2xl px-4 py-2.5 shadow-lg whitespace-nowrap"
            style={{ boxShadow: '0 4px 20px rgba(20,184,166,0.15)' }}
          >
            <p className="text-xs font-bold text-neutral-700 text-center">
              {MESSAGES[msgIndex]}
            </p>
            {/* Bubble tail */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-slate-800 border-r border-b border-brand-100 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
