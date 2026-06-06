import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import useThemeStore from '../../store/useThemeStore'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.88 }}
      aria-label="Toggle theme"
      className="relative flex h-8 w-16 items-center rounded-full border transition-all duration-500 overflow-hidden"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #0d1117, #161b22)'
          : 'linear-gradient(135deg, #e0f2fe, #f0fdf4)',
        borderColor: isDark ? 'rgba(45,212,191,0.3)' : 'rgba(20,184,166,0.2)',
        boxShadow: isDark
          ? '0 0 12px rgba(45,212,191,0.2), inset 0 1px 0 rgba(255,255,255,0.04)'
          : '0 0 12px rgba(20,184,166,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
      }}
    >
      {/* Track stars (dark) */}
      {isDark && (
        <>
          {[{ x: 12, y: 4, s: 1.5 }, { x: 22, y: 6, s: 1 }, { x: 18, y: 2, s: 1 }].map((star, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{ left: star.x, top: star.y, width: star.s, height: star.s }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0.6, 1, 0.6], scale: 1 }}
              transition={{ duration: 1.5 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </>
      )}

      {/* Track sun rays (light) */}
      {!isDark && (
        <motion.div
          className="absolute left-1 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.6), transparent 70%)' }}
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Thumb */}
      <motion.div
        className="absolute flex h-6 w-6 items-center justify-center rounded-full shadow-lg"
        animate={{ x: isDark ? 36 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #2dd4bf, #06b6d4)'
            : 'linear-gradient(135deg, #fbbf24, #f97316)',
          boxShadow: isDark
            ? '0 0 10px rgba(45,212,191,0.5), 0 2px 8px rgba(0,0,0,0.3)'
            : '0 0 10px rgba(251,191,36,0.5), 0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.25 }}
            >
              <Moon size={13} className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.25 }}
            >
              <Sun size={13} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Label */}
      <motion.span
        className="absolute text-[8px] font-black uppercase tracking-widest pointer-events-none"
        animate={{ x: isDark ? 6 : 26, opacity: 0.5 }}
        transition={{ duration: 0.3 }}
        style={{ color: isDark ? '#2dd4bf' : '#f97316' }}
      >
        {isDark ? '🌙' : '☀️'}
      </motion.span>
    </motion.button>
  )
}
