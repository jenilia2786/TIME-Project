import { motion } from 'framer-motion'

/**
 * StreakCounter — animated flame/streak display
 * Props: count (number), label (string), compact (bool)
 */
export default function StreakCounter({ count = 1, label = 'Day Streak', compact = false }) {
  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <motion.span
          animate={{ scaleY: [1, 1.15, 1], rotate: [-3, 3, -3] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-lg leading-none"
          style={{ display: 'inline-block', transformOrigin: 'bottom center' }}
        >
          🔥
        </motion.span>
        <span className="text-sm font-bold text-orange-500">{count}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-2xl px-4 py-3">
      {/* Animated flame */}
      <motion.div
        animate={{
          scaleY: [1, 1.15, 1],
          scaleX: [1, 0.95, 1],
          rotate: [-4, 4, -4],
        }}
        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
        className="text-3xl leading-none shrink-0"
        style={{ transformOrigin: 'bottom center' }}
      >
        🔥
      </motion.div>

      <div>
        <div className="flex items-baseline gap-1">
          <motion.span
            key={count}
            initial={{ opacity: 0, y: -10, scale: 1.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="text-2xl font-black text-orange-500 leading-none"
          >
            {count}
          </motion.span>
          <span className="text-sm font-bold text-orange-400">{label}</span>
        </div>
        <p className="text-xs text-orange-300 font-medium mt-0.5">Keep it going! 💪</p>
      </div>

      {/* Glow ring behind flame */}
      <div className="absolute opacity-20 w-8 h-8 rounded-full bg-orange-400 blur-md" />
    </div>
  )
}
