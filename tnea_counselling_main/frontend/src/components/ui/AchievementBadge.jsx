import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Lock, CheckCircle } from 'lucide-react'

/**
 * AchievementBadge — locked/unlocked badge with pop animation and tooltip
 * Props: icon (emoji or Lucide), title, desc, unlocked, color (tailwind gradient)
 */
export default function AchievementBadge({
  icon = '⭐',
  title = 'Achievement',
  desc = '',
  unlocked = false,
  color = 'from-brand-400 to-cyan-400',
  delay = 0,
}) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay,
        type: 'spring',
        stiffness: 200,
        damping: 15,
      }}
      className="relative flex flex-col items-center gap-2 cursor-default"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Badge circle */}
      <motion.div
        whileHover={unlocked ? { scale: 1.12, y: -3 } : { scale: 1.04 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative"
      >
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 ${
            unlocked
              ? `bg-gradient-to-br ${color} shadow-glow-teal`
              : 'bg-neutral-100 opacity-50'
          }`}
        >
          {typeof icon === 'string' ? icon : <span className="text-white">{icon}</span>}

          {/* Lock overlay for locked badges */}
          {!unlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/ dark:bg-slate-800/ rounded-2xl">
              <Lock size={16} className="text-neutral-400" />
            </div>
          )}
        </div>

        {/* Unlocked checkmark */}
        {unlocked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.3, type: 'spring', stiffness: 300 }}
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-md"
          >
            <CheckCircle size={14} className="text-brand-500 fill-brand-100" />
          </motion.div>
        )}

        {/* Glow ring for unlocked */}
        {unlocked && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              boxShadow: '0 0 0 2px rgba(20,184,166,0.2), 0 0 20px rgba(20,184,166,0.2)',
            }}
          />
        )}
      </motion.div>

      {/* Label */}
      <p className={`text-xs font-bold text-center leading-tight max-w-[72px] ${
        unlocked ? 'text-neutral-700' : 'text-neutral-400'
      }`}>
        {title}
      </p>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && desc && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-14 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl pointer-events-none"
          >
            {desc}
            <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-900 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
