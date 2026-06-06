import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useStudentStore from '../../store/useStudentStore'
import useThemeStore from '../../store/useThemeStore'
import ThemeToggle from '../ui/ThemeToggle'
import { useState } from 'react'

function Header() {
  const theme = useThemeStore((s) => s.theme)
  const isDark = theme === 'dark'

  return (
    <>
      {/* Brand Pill */}
      <Link
        to="/dashboard"
        className="fixed top-4 left-4 z-50 hidden lg:flex items-center gap-3 group px-4 h-[52px] rounded-full"
      >
        <motion.div
          whileHover={{ scale: 1.08, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-[11px] font-bold text-white"
          style={{ boxShadow: '0 2px 10px rgba(20,184,166,0.4)' }}
        >
          TIME
        </motion.div>
        <div className="flex items-baseline gap-2">
          <span
            className="text-sm font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            T.I.M.E
          </span>
        </div>
      </Link>

      {/* Theme Changer Pill */}
      <div
        className="fixed top-4 right-4 z-50 hidden lg:flex items-center justify-center h-[52px] px-4 rounded-full"
      >
        <ThemeToggle />
      </div>
    </>
  )
}

export default Header
