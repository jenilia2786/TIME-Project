import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sparkles, Compass, BookOpen, ChevronRight, ArrowRight, ChevronDown } from 'lucide-react'
import ThemeToggle from '../ui/ThemeToggle'

const NAV_LINKS = [
  { label: 'Overview', href: '/#overview', hasDropdown: false },
  { label: 'Features', href: '/#features', hasDropdown: false },
  { label: 'FAQ', href: '/#faq', hasDropdown: false },
  { label: 'Learn More', href: '/learn-more', hasDropdown: false },
]

export default function PublicLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeHover, setActiveHover] = useState(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.substring(1)
      const element = document.getElementById(targetId)
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 200)
        return () => clearTimeout(timer)
      }
    }
  }, [location.pathname, location.hash])

  const openModal = () => navigate('/auth')

  const handleNavClick = (e, href) => {
    e.preventDefault()
    setMobileMenuOpen(false)

    if (href.startsWith('/') && !href.includes('#')) {
      navigate(href)
      return
    }

    const [path, hash] = href.split('#')
    const targetPath = path || '/'
    
    if (location.pathname === targetPath && hash) {
      const element = document.getElementById(hash)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        window.history.pushState(null, '', href)
      }
    } else {
      navigate(href)
    }
  }

  return (
    <div className="min-h-screen bg-transparent font-sans text-neutral-800 overflow-x-hidden">

      {/* ── Animated Sticky Glassmorphic Navbar ─────────────────── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.35 }}
        className={`fixed top-4 inset-x-4 max-w-7xl mx-auto z-50 transition-all duration-500 rounded-full ${
          scrolled
            ? 'bg-white/90 dark:bg-[#080B14]/90 backdrop-blur-xl shadow-lg border border-neutral-200/50'
            : 'bg-white/60 dark:bg-[#080B14]/60 backdrop-blur-md shadow-sm border border-white/40'
        }`}
      >
        <div className={`mx-auto flex w-full items-center justify-between px-4 sm:px-6 transition-all duration-300 ${scrolled ? 'h-14' : 'h-16'}`}>
          
          {/* Logo Brand Hub */}
          <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.08 }}
              transition={{ duration: 0.4 }}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600"
              style={{ boxShadow: '0 0 16px rgba(20,184,166,0.4), 0 2px 8px rgba(0,0,0,0.12)' }}
            >
              <span className="text-[11px] font-black text-white tracking-wide">TIME</span>
              <motion.div
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent"
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-neutral-900 tracking-tight group-hover:text-brand-600 transition-colors leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                T.I.M.E
              </span>
              <span className="text-[9px] font-semibold text-neutral-400 tracking-widest uppercase leading-none mt-0.5 hidden sm:block">
                Educational Guidance
              </span>
            </div>
          </button>

          {/* Desktop Central Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2">
            {NAV_LINKS.map(({ label, href, hasDropdown }) => {
              const isExternal = !href.includes('#')
              const hash = href.split('#')[1]
              const isActive = isExternal
                ? location.pathname === href
                : location.pathname === '/' && (
                    location.hash === `#${hash}` ||
                    (hash === 'overview' && (location.hash === '' || location.hash === '#overview'))
                  )

              return (
                <a
                  key={label}
                  href={href}
                  onClick={(e) => handleNavClick(e, href)}
                  onMouseEnter={() => setActiveHover(label)}
                  onMouseLeave={() => setActiveHover(null)}
                  className={`relative flex items-center gap-1.5 px-4 py-2.5 text-[14px] font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'
                  }`}
                >
                  {label}
                  {hasDropdown && (
                    <ChevronDown size={14} className="opacity-50 mt-0.5" />
                  )}
                  
                  {/* Hover glow underline */}
                  {!isActive && activeHover === label && (
                    <motion.div
                      layoutId="nav-hover"
                      initial={{ opacity: 0, scaleX: 0.5 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      exit={{ opacity: 0, scaleX: 0.5 }}
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-5 rounded-full bg-brand-400"
                    />
                  )}
                </a>
              )
            })}
          </nav>

          {/* Right Action Center CTAs */}
          <div className="flex items-center gap-4">
            
            <ThemeToggle />

            <div className="hidden lg:flex items-center gap-3 ml-2">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={openModal}
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white py-2.5 px-5 text-[14px] font-bold rounded-full transition-all"
                style={{ boxShadow: '0 4px 14px rgba(13, 148, 136, 0.4)' }}
              >
                Get Started
                <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <ArrowRight size={14} />
                </motion.span>
              </motion.button>
            </div>

            {/* Mobile Hamburger toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors border border-neutral-200/60"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X size={18} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden bg-white/ dark:bg-slate-800/ backdrop-blur-xl border-t border-neutral-100 overflow-hidden shadow-xl"
            >
              <div className="px-6 py-5 flex flex-col gap-1.5">
                {NAV_LINKS.map(({ label, href, icon: Icon }) => {
                  const isExternal = !href.includes('#')
                  const hash = href.split('#')[1]
                  const isActive = isExternal
                    ? location.pathname === href
                    : location.pathname === '/' && (
                        location.hash === `#${hash}` ||
                        (hash === 'overview' && (location.hash === '' || location.hash === '#overview'))
                      )

                  return (
                    <motion.a
                      key={label}
                      href={href}
                      onClick={(e) => handleNavClick(e, href)}
                      whileHover={{ x: 4 }}
                      className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? 'text-brand-600 bg-brand-50 border border-brand-100/40'
                          : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                      }`}
                    >
                      <Icon size={16} className={isActive ? 'text-brand-500' : 'text-neutral-400'} />
                      {label}
                      <ChevronRight size={14} className="ml-auto text-neutral-300" />
                    </motion.a>
                  )
                })}
                
                <div className="pt-4 border-t border-neutral-100 mt-2 flex flex-col gap-3">
                  <button 
                    onClick={() => { openModal(); setMobileMenuOpen(false) }} 
                    className="btn-primary w-full py-3 text-sm font-bold rounded-2xl shadow-md"
                  >
                    Get Started Free <ArrowRight size={14} className="inline ml-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer for fixed header removed so page backgrounds flow under it */}

      {/* Page Content */}
      <main>
        {typeof children === 'function' ? children({ openModal }) : children}
      </main>
    </div>
  )
}
