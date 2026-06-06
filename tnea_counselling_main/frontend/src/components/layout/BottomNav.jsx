import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Building2, Bot, Map, FlaskConical,
  GraduationCap, Settings, Briefcase, Target, FileText
} from 'lucide-react'
import { motion } from 'framer-motion'

const ITEMS = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Home' },
  { to: '/assistant',   icon: Bot,             label: 'AI' },
  { to: '/careers',     icon: Briefcase,       label: 'Careers' },
  { to: '/colleges',    icon: Building2,       label: 'Colleges' },
  { to: '/roadmap',     icon: Map,             label: 'Roadmap' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t border-neutral-100 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      {ITEMS.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 py-3 text-[10px] font-bold transition-colors relative ${
              isActive ? 'text-brand-600' : 'text-neutral-400 hover:text-neutral-600'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-pill"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-brand-500"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  style={{ boxShadow: '0 0 8px rgba(20,184,166,0.6)' }}
                />
              )}
              <motion.div
                animate={isActive ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Icon size={19} />
              </motion.div>
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
