import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Bot, Building2, Briefcase,
  GraduationCap, LogOut, ChevronLeft, ChevronRight,
  BookOpen, FlaskConical, Map, Trophy, FileText, Settings,
  ChevronDown, Plus, UserCircle, Star, Zap, Bookmark
} from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStudentStore from '../../store/useStudentStore'
import useThemeStore from '../../store/useThemeStore'
import XPBar from '../ui/XPBar'

const NAV = [
  { to: '/dashboard',      icon: LayoutDashboard, label: 'Overview',      emoji: '🏠' },
  { to: '/assistant',      icon: Bot,             label: 'AI Guidance',   emoji: '🤖' },
  { to: '/careers',        icon: Briefcase,       label: 'Careers',       emoji: '💼' },
  { to: '/colleges',       icon: Building2,       label: 'Colleges',      emoji: '🏫' },
  { to: '/shortlist',      icon: Bookmark,        label: 'Shortlist',     emoji: '🔖' },
  { to: '/exams',          icon: FlaskConical,    label: 'Exams',         emoji: '📋' },
  { to: '/predictions',    icon: Star,            label: 'Predictions',   emoji: '🎯' },
  { to: '/roadmap',        icon: Map,             label: 'Roadmap',       emoji: '🗺️' },
  { to: '/scholarships',   icon: GraduationCap,   label: 'Scholarships',  emoji: '🏆' },
  { to: '/reports',        icon: FileText,        label: 'Reports',       emoji: '📊' },
  { to: '/settings',       icon: Settings,        label: 'Settings',      emoji: '⚙️' },
]

const LEVEL_COLORS = [
  'from-emerald-400 to-teal-400',
  'from-sky-400 to-blue-400',
  'from-violet-400 to-purple-400',
  'from-brand-400 to-cyan-400',
  'from-amber-400 to-orange-400',
]

function getLevel(pct) {
  if (pct >= 80) return { emoji: '🤖', label: 'AI Scholar',    color: LEVEL_COLORS[4] }
  if (pct >= 60) return { emoji: '🗺️', label: 'Navigator',     color: LEVEL_COLORS[3] }
  if (pct >= 40) return { emoji: '✦',  label: 'Path Finder',   color: LEVEL_COLORS[2] }
  if (pct >= 20) return { emoji: '🔍', label: 'Smart Seeker',  color: LEVEL_COLORS[1] }
  return           { emoji: '🌱', label: 'Rookie Explorer', color: LEVEL_COLORS[0] }
}

const AVATAR_COLORS = [
  'from-teal-400 to-cyan-500',
  'from-violet-400 to-purple-500',
  'from-rose-400 to-pink-500',
  'from-amber-400 to-orange-500',
  'from-sky-400 to-blue-500',
  'from-emerald-400 to-green-500',
]

function getAvatarColor(name) {
  if (!name) return AVATAR_COLORS[0]
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length
  return AVATAR_COLORS[idx]
}

export default function Sidebar() {
  const { student, profiles, activeProfileId, profileCompletion, clearSession, switchProfile } = useStudentStore()
  const activeProfile = profiles.find((p) => p.id === activeProfileId)
  const navigate = useNavigate()
  const collapsed = useThemeStore((s) => s.sidebarCollapsed)
  const setCollapsed = useThemeStore((s) => s.setSidebarCollapsed)
  const [profileOpen, setProfileOpen] = useState(false)

  const level = getLevel(profileCompletion)

  const initials = (name) =>
    name ? name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() : '?'

  const displayName = activeProfile?.name || student.name || 'Student'
  const displayStandard = activeProfile?.standard || student.standard || ''
  const displayDomain = activeProfile?.domain || ''

  const handleLogout = () => {
    clearSession()
    navigate('/', { replace: true })
  }

  return (
    <motion.aside
      id="nav-sidebar"
      animate={{ width: collapsed ? 68 : 260 }}
      transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }}
      className="hidden lg:flex flex-col border border-neutral-200/80 dark:border-neutral-700/80 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl overflow-hidden shrink-0 sticky top-[88px] z-30 ml-4 mb-4 mt-[88px] rounded-3xl"
      style={{ 
        boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
        height: 'calc(100vh - 88px - 16px)'
      }}
    >
      {/* Collapse toggle */}
      <motion.button
        onClick={() => setCollapsed((v) => !v)}
        whileHover={{ backgroundColor: 'rgba(20,184,166,0.06)' }}
        className={`flex h-10 items-center ${collapsed ? 'justify-start pl-[26px]' : 'justify-end pr-5'} text-neutral-400 dark:text-neutral-500 hover:text-brand-500 dark:hover:text-brand-400 transition-colors border-b border-neutral-100 dark:border-neutral-800 w-full`}
      >
        <motion.div animate={{ rotate: collapsed ? 0 : 180 }} transition={{ duration: 0.3 }}>
          <ChevronRight size={14} />
        </motion.div>
      </motion.button>

      {/* Nav links */}
      <nav className="flex-1 space-y-0.5 px-2 pt-2 overflow-hidden">
        {NAV.map(({ to, icon: Icon, label, emoji }, i) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className="block"
          >
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: collapsed ? 0 : 3 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`relative flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'text-brand-700 dark:text-brand-400 font-bold'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-brand-50/20 dark:hover:bg-brand-500/10'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-100/50 dark:border-brand-500/20 -z-10 shadow-sm"
                    transition={{ type: 'spring', bounce: 0.22, duration: 0.45 }}
                    style={{ boxShadow: '0 2px 8px rgba(20,184,166,0.06)' }}
                  />
                )}

                <motion.span
                  className={`shrink-0 transition-colors duration-300 ${isActive ? 'text-brand-500' : ''}`}
                  whileHover={{ rotate: 10, scale: 1.15 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Icon size={17} />
                </motion.span>

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      transition={{ duration: 0.15 }}
                      className="truncate flex-1 text-xs"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {isActive && !collapsed && (
                  <motion.div
                    layoutId="activeNavDot"
                    className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: '#14b8a6', boxShadow: '0 0 8px #14b8a6' }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-neutral-100 dark:border-neutral-800 p-2">
        {/* User row */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-all ${isActive ? 'bg-brand-50 dark:bg-brand-500/10' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'}`
          }
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${level.color} text-[10px] font-bold text-white`}
            style={{ boxShadow: '0 0 10px rgba(20,184,166,0.3)' }}
          >
            {initials(student.name)}
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="truncate text-xs font-bold text-neutral-800 dark:text-neutral-100">{student.name || 'Student'}</p>
                <p className="truncate text-[10px] text-neutral-400">
                  {student.standard || ''}{student.standard && student.district ? ' · ' : ''}{student.district || ''}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </NavLink>

        <motion.button
          onClick={handleLogout}
          whileHover={{ backgroundColor: 'rgba(239,68,68,0.06)', color: '#ef4444' }}
          title="Sign out"
          className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs text-neutral-400 transition-all"
        >
          <LogOut size={14} className="shrink-0" />
          <AnimatePresence>
            {!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Sign out</motion.span>}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  )
}
