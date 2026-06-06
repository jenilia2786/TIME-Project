import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useInView, animate } from 'framer-motion'

/**
 * XPBar — animated experience point progress bar with level display
 * Props: completion (0–100), level (string), nextLevel (string), xpLabel (string)
 */
export default function XPBar({
  completion = 0,
  level = 'Rookie Explorer',
  levelEmoji = '🌱',
  nextLevel = null,
  compact = false,
}) {
  const barRef = useRef(null)
  const isInView = useInView(barRef, { once: true })
  const width = useMotionValue(0)

  useEffect(() => {
    if (isInView) {
      animate(width, completion, {
        duration: 1.4,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.2,
      })
    }
  }, [isInView, completion, width])

  if (compact) {
    return (
      <div ref={barRef} className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-neutral-700">{levelEmoji} {level}</span>
          <span className="font-semibold text-brand-600">{completion}%</span>
        </div>
        <div className="h-2 w-full rounded-full overflow-hidden bg-neutral-100 border border-neutral-200/60">
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${completion}%`,
              background: 'linear-gradient(90deg, #14b8a6, #06b6d4)',
              boxShadow: '0 0 8px rgba(20,184,166,0.5)',
            }}
            initial={{ width: 0 }}
            animate={isInView ? { width: `${completion}%` } : { width: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          />
        </div>
      </div>
    )
  }

  return (
    <div ref={barRef} className="flex flex-col gap-3">
      {/* Level header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400 to-cyan-400 flex items-center justify-center text-sm shadow-glow-teal">
            {levelEmoji}
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-800">{level}</p>
            {nextLevel && (
              <p className="text-xs text-neutral-400">Next: {nextLevel}</p>
            )}
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-black text-brand-600">{completion}</span>
          <span className="text-xs text-neutral-400 ml-0.5">/ 100 XP</span>
        </div>
      </div>

      {/* Bar */}
      <div className="relative h-3 w-full rounded-full overflow-hidden bg-gradient-to-r from-neutral-100 to-neutral-50 border border-neutral-200/60">
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #14b8a6 0%, #06b6d4 50%, #14b8a6 100%)',
            backgroundSize: '200% 100%',
            boxShadow: '0 0 10px rgba(20,184,166,0.6)',
          }}
          initial={{ width: '0%' }}
          animate={isInView ? { width: `${completion}%` } : { width: '0%' }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        />
        {/* Shimmer overlay */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s linear infinite',
          }}
        />
        {/* Milestone dots */}
        {[20, 40, 60, 80].map(milestone => (
          <div
            key={milestone}
            className={`absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full transition-colors duration-300 ${
              completion >= milestone ? 'bg-white/ dark:bg-slate-800/' : 'bg-neutral-300'
            }`}
            style={{ left: `${milestone}%`, marginLeft: '-2px' }}
          />
        ))}
      </div>

      {/* Milestone labels */}
      <div className="flex justify-between text-[10px] text-neutral-400 font-semibold px-0.5">
        <span className={completion >= 0  ? 'text-brand-500' : ''}>🌱</span>
        <span className={completion >= 20 ? 'text-brand-500' : ''}>🔍</span>
        <span className={completion >= 40 ? 'text-brand-500' : ''}>✦</span>
        <span className={completion >= 60 ? 'text-brand-500' : ''}>🗺️</span>
        <span className={completion >= 80 ? 'text-brand-500' : ''}>🤖</span>
      </div>
    </div>
  )
}
