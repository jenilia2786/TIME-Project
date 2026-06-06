import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import BottomNav from './components/layout/BottomNav'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Colleges from './pages/Colleges'
import Courses from './pages/Courses'
import Careers from './pages/Careers'
import Assistant from './pages/Assistant'
import Scholarships from './pages/Scholarships'
import Profile from './pages/Profile'
import Onboarding from './pages/Onboarding'
import LearnMore from './pages/LearnMore'
import Auth from './pages/Auth'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Exams from './pages/Exams'
import Predictions from './pages/Predictions'
import Roadmap from './pages/Roadmap'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Shortlist from './pages/Shortlist'
import PublicLayout from './components/layout/PublicLayout'
import GlobalBackground from './components/layout/GlobalBackground'
import IconLoader from './components/ui/IconLoader'
import CursorGlow from './components/ui/CursorGlow'
import PersistentChat from './components/ui/PersistentChat'
import TutorialOverlay from './components/ui/TutorialOverlay'
import useStudentStore from './store/useStudentStore'
import useSmoothScroll, { getLenis } from './lib/useSmoothScroll'
import useThemeStore from './store/useThemeStore'

/* Page transition variants */
const PAGE_VARIANTS = {
  initial:  { opacity: 0, y: 14, filter: 'blur(4px)' },
  animate:  { opacity: 1, y: 0,  filter: 'blur(0px)' },
  exit:     { opacity: 0, y: -10, filter: 'blur(4px)' },
}

const PAGE_TRANSITION = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1],
}

/** Wraps all pages that require a session */
function AppShell({ children, hideSidebar = false }) {
  const { i18n } = useTranslation()
  const location = useLocation()
  const setLastVisitedPath = useStudentStore((s) => s.setLastVisitedPath)

  useEffect(() => {
    if (location.pathname !== '/') setLastVisitedPath(location.pathname)
  }, [location.pathname, setLastVisitedPath])

  return (
    <div className={`min-h-screen bg-transparent ${i18n.language === 'ta' ? 'font-ta' : 'font-en'}`}>

      <Header />
      <div className="flex min-h-[calc(100vh-88px)] relative z-10 w-full">
        {!hideSidebar && <Sidebar />}
        <main className="flex-1 min-w-0 overflow-x-clip relative">
          {children}
        </main>
      </div>
      <BottomNav />
      <PersistentChat />
      <TutorialOverlay />
    </div>
  )
}

/** Redirect to landing if no session */
function ProtectedRoute({ children, bare = false, hideSidebar = false }) {
  const sessionId = useStudentStore((s) => s.sessionId)
  if (!sessionId) return <Navigate to="/" replace />
  if (bare) return children
  return <AppShell hideSidebar={hideSidebar}>{children}</AppShell>
}

/** Dashboard route — always shows sidebar now (unified dashboard) */
function DashboardRoute({ children }) {
  const sessionId = useStudentStore((s) => s.sessionId)
  if (!sessionId) return <Navigate to="/" replace />
  return <AppShell hideSidebar={false}>{children}</AppShell>
}

/* Page motion wrapper helper */
const P = ({ k, children }) => (
  <motion.div key={k} variants={PAGE_VARIANTS} initial="initial" animate="animate" exit="exit" transition={PAGE_TRANSITION}>
    {children}
  </motion.div>
)

function App() {
  const location = useLocation()
  const [loading, setLoading] = useState(true)

  // Lenis smooth scroll
  useSmoothScroll()

  // Theme synchronization
  const theme = useThemeStore((s) => s.theme)
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200)
    return () => clearTimeout(timer)
  }, [])

  // Scroll restoration on route change
  useEffect(() => {
    window.scrollTo(0, 0)
    getLenis()?.scrollTo(0, { immediate: true })
  }, [location.pathname])

  return (
    <>
      <GlobalBackground />
      <CursorGlow />

      <AnimatePresence mode="wait">
        {loading ? (
          <IconLoader key="loader" />
        ) : (
          <Routes location={location} key={location.pathname}>
            {/* Public routes */}
            <Route path="/"           element={<PublicLayout>{({ openModal }) => <Landing openModal={openModal} />}</PublicLayout>} />
            <Route path="/learn-more" element={<PublicLayout>{({ openModal }) => <LearnMore openModal={openModal} />}</PublicLayout>} />
            <Route path="/contact"    element={<PublicLayout><P k="ctc"><Contact /></P></PublicLayout>} />
            <Route path="/faq"        element={<PublicLayout><P k="faq"><FAQ /></P></PublicLayout>} />
            <Route path="/privacy"    element={<PublicLayout><P k="prv"><Privacy /></P></PublicLayout>} />
            <Route path="/terms"      element={<PublicLayout><P k="tms"><Terms /></P></PublicLayout>} />
            <Route path="/auth"       element={<Auth />} />

            {/* Unified Dashboard Routes — ALL use the same AppShell with Sidebar */}
            <Route path="/dashboard"    element={<DashboardRoute><P k="dash"><Dashboard /></P></DashboardRoute>} />
            <Route path="/assistant"    element={<DashboardRoute><P k="ast"><Assistant /></P></DashboardRoute>} />
            <Route path="/careers"      element={<DashboardRoute><P k="car"><Careers /></P></DashboardRoute>} />
            <Route path="/colleges"     element={<DashboardRoute><P k="col"><Colleges /></P></DashboardRoute>} />
            <Route path="/shortlist"    element={<DashboardRoute><P k="shrt"><Shortlist /></P></DashboardRoute>} />
            <Route path="/exams"        element={<DashboardRoute><P k="exm"><Exams /></P></DashboardRoute>} />
            <Route path="/predictions"  element={<DashboardRoute><P k="prd"><Predictions /></P></DashboardRoute>} />
            <Route path="/roadmap"      element={<DashboardRoute><P k="rdm"><Roadmap /></P></DashboardRoute>} />
            <Route path="/scholarships" element={<DashboardRoute><P k="sch"><Scholarships /></P></DashboardRoute>} />
            <Route path="/reports"      element={<DashboardRoute><P k="rep"><Reports /></P></DashboardRoute>} />
            <Route path="/settings"     element={<DashboardRoute><P k="set"><Settings /></P></DashboardRoute>} />
            <Route path="/courses"      element={<DashboardRoute><P k="crs"><Courses /></P></DashboardRoute>} />
            <Route path="/profile"      element={<DashboardRoute><P k="prof"><Profile /></P></DashboardRoute>} />

            {/* Onboarding — bare (no shell) */}
            <Route path="/onboarding" element={<ProtectedRoute bare><Onboarding /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </AnimatePresence>
    </>
  )
}

export default App
