import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, Users, Building2, TrendingUp,
  Brain, Heart, Briefcase, BookOpen, PenTool, Scale,
  GraduationCap, Play, Compass, DollarSign, Award, Target, Zap,
  Wrench, Shield, Palette, Activity, Rocket, Globe, Sparkles
} from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import useThemeStore from '../store/useThemeStore'
import useStudentStore from '../store/useStudentStore'
import CareerCube from '../components/ui/CareerCube'
import { DOMAINS_DATA, COURSES_DATA, TENTH_FACES, UG_FACES, PG_FACES } from '../data/careersData'
import { useNavigate } from 'react-router-dom'
import usePersonalization from '../hooks/usePersonalization'
import OnboardingPopup from '../components/ui/OnboardingPopup'

/* ── COMPONENTS ───────────────────────────────────────────── */

function DegreeModal({ domainId, onSelectDegree, onClose }) {
  const domain = DOMAINS_DATA[domainId]
  const scrollRef = useRef(null)
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false)

  useEffect(() => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight } = scrollRef.current
      if (scrollHeight <= clientHeight) {
        setIsScrolledToBottom(true)
      }
    }
  }, [])

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    setIsScrolledToBottom(scrollHeight - scrollTop <= clientHeight + 20)
  }

  if (!domain) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-md pointer-events-auto" 
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-4xl max-h-[85vh] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl pointer-events-auto flex flex-col overflow-hidden"
      >
        {/* Header & Back Button */}
        <div className="p-6 pb-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between shrink-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl z-10">
          <div className="flex items-center gap-3">
            <domain.icon size={24} className="text-brand-500" />
            <h2 className="text-xl font-black text-neutral-900 dark:text-white">{domain.title}</h2>
          </div>
          <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold text-sm transition-all shadow-sm">
            <ChevronLeft size={16} /> Go Back
          </button>
        </div>

        {/* Scrollable Content */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="p-6 md:p-8 overflow-y-auto overflow-x-hidden scrollbar-hide relative" 
          data-lenis-prevent="true"
        >
          <p className="text-neutral-500 mb-6 font-medium">Select a degree path to explore specialized courses:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {domain.degrees.map((deg, i) => (
              <motion.div
                key={deg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => onSelectDegree(deg.id)}
                className="group cursor-pointer bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 p-6 rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-brand-300 transition-all shadow-sm hover:shadow-md relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-neutral-900 dark:text-white">{deg.name}</h3>
                  <p className="text-brand-600 text-sm font-semibold mb-3">{deg.fullName}</p>
                  <p className="text-neutral-600 dark:text-neutral-400 text-xs mb-4 h-10 line-clamp-2">{deg.desc}</p>
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 bg-neutral-200/50 dark:bg-neutral-700 w-max px-3 py-1 rounded-full">
                    <Clock size={12} /> {deg.duration}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <AnimatePresence>
          {!isScrolledToBottom && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-neutral-900 to-transparent pointer-events-none flex items-end justify-center pb-2 z-20"
            >
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest animate-bounce">
                Scroll for more <ChevronLeft size={12} className="-rotate-90" />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>,
    document.body
  )
}

function Clock({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  )
}

function CourseModal({ degreeId, onSelectCourse, onClose }) {
  const courses = COURSES_DATA[degreeId] || COURSES_DATA.btech
  const scrollRef = useRef(null)
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false)

  useEffect(() => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight } = scrollRef.current
      if (scrollHeight <= clientHeight) {
        setIsScrolledToBottom(true)
      }
    }
  }, [])

  const { wishlistCareers, addToWishlist, removeFromWishlist } = useStudentStore()

  const handleSave = (course) => {
    const isAlreadySaved = wishlistCareers.find(w => w.id === course.id)
    if (isAlreadySaved) {
      removeFromWishlist('Careers', course.id)
    } else {
      addToWishlist('Careers', {
        id: course.id,
        name: course.name,
        salary: course.salary,
        growth: course.growth
      })
    }
  }

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    setIsScrolledToBottom(scrollHeight - scrollTop <= clientHeight + 20)
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-md pointer-events-auto" 
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-5xl max-h-[85vh] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl pointer-events-auto flex flex-col overflow-hidden"
      >
        {/* Header & Back Button */}
        <div className="p-6 pb-4 border-b border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-neutral-900 dark:text-white">Course Explorer</h2>
            <p className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full hidden sm:block">Discover specializations</p>
          </div>
          <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold text-sm transition-all shadow-sm">
            <ChevronLeft size={16} /> Go Back
          </button>
        </div>

        {/* Scrollable Content */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="p-6 md:p-8 overflow-y-auto overflow-x-hidden scrollbar-hide relative" 
          data-lenis-prevent="true"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-12">
            {courses.map((course, i) => {
              const saved = !!wishlistCareers.find(w => w.id === course.id)
              const timerRef = useRef(null)

              const handleClick = (e) => {
                if (timerRef.current) {
                  clearTimeout(timerRef.current)
                  timerRef.current = null
                  handleSave(course)
                } else {
                  timerRef.current = setTimeout(() => {
                    timerRef.current = null
                    onSelectCourse(course.id)
                  }, 250)
                }
              }

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -2 }}
                  onClick={handleClick}
                  className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all relative cursor-pointer group"
                >
                  {/* Wishlist indicator */}
                  <motion.div
                    key={`heart-${saved}`}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center border shadow-sm transition-all z-10 ${
                      saved ? 'bg-rose-50 border-rose-200' : 'bg-white dark:bg-neutral-700 border-neutral-200 dark:border-neutral-600'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (timerRef.current) {
                        clearTimeout(timerRef.current)
                        timerRef.current = null
                      }
                      handleSave(course)
                    }}
                  >
                    <Heart size={14} className={saved ? 'text-rose-500 fill-rose-500' : 'text-neutral-300 dark:text-neutral-400'} />
                  </motion.div>

                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4 leading-tight pr-10">{course.name}</h3>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-xs">
                        <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5"><DollarSign size={12} /> Avg. Salary</span>
                        <span className="text-brand-600 font-bold">{course.salary}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5"><TrendingUp size={12} /> Growth</span>
                        <span className="text-success font-bold">+{course.growth}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5"><Building2 size={12} /> Top Recruiters</span>
                        <span className="text-neutral-700 dark:text-neutral-300 font-semibold">{course.recruiters.slice(0, 2).join(', ')}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onSelectCourse(course.id); }}
                    className="w-full py-2.5 rounded-xl bg-white dark:bg-neutral-700 text-brand-600 dark:text-brand-400 text-xs font-black uppercase tracking-wide border border-neutral-200 dark:border-neutral-600 hover:bg-brand-500 hover:text-white hover:border-brand-500 transition-all flex items-center justify-center gap-2"
                  >
                    View Roadmap <Play size={12} className="fill-current" />
                  </button>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Scroll Indicator */}
        <AnimatePresence>
          {!isScrolledToBottom && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-neutral-900 to-transparent pointer-events-none flex items-end justify-center pb-2 z-20"
            >
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest animate-bounce">
                Scroll for more <ChevronLeft size={12} className="-rotate-90" />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>,
    document.body
  )
}

function CourseDetailModal({ courseId, onClose }) {
  const course = Object.values(COURSES_DATA).flat().find(c => c.id === courseId) || COURSES_DATA.btech[0]
  const scrollRef = useRef(null)
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false)
  const { setSelectedCareerOption, wishlistCareers, addToWishlist, removeFromWishlist } = useStudentStore()
  const navigate = useNavigate()

  const saved = !!wishlistCareers.find(w => w.id === course.id)
  const handleSave = () => {
    if (saved) {
      removeFromWishlist('Careers', course.id)
    } else {
      addToWishlist('Careers', {
        id: course.id,
        name: course.name,
        salary: course.salary,
        growth: course.growth
      })
    }
  }

  useEffect(() => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight } = scrollRef.current
      if (scrollHeight <= clientHeight) {
        setIsScrolledToBottom(true)
      }
    }
  }, [])

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    setIsScrolledToBottom(scrollHeight - scrollTop <= clientHeight + 20)
  }

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center pointer-events-none p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-md pointer-events-auto" 
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-3xl max-h-[85vh] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl pointer-events-auto flex flex-col overflow-hidden"
      >
        <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
          <button onClick={handleSave} className="w-10 h-10 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center border shadow-sm transition-all text-neutral-500 hover:text-rose-500">
            <Heart size={18} className={saved ? 'fill-rose-500 text-rose-500' : ''} />
          </button>
          <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold text-sm transition-all shadow-sm">
            <ChevronLeft size={16} /> Go Back
          </button>
        </div>

        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="p-8 pb-20 overflow-y-auto scrollbar-hide relative flex-1"
          data-lenis-prevent="true"
        >

        <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center mb-4 border border-brand-100">
          <Zap size={24} className="text-brand-500" />
        </div>
        <h2 className="text-3xl font-black text-neutral-900 mb-2">{course.name}</h2>
        <p className="text-neutral-600 text-sm mb-8 leading-relaxed">
          Master the fundamentals of {course.name} and prepare for a high-growth career in modern tech industries. 
          This course blends theoretical knowledge with intense practical applications.
        </p>

        <div className="space-y-8">
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5">
            <h4 className="text-neutral-900 font-bold mb-4 flex items-center gap-2"><Target size={16} className="text-brand-500" /> Career Path</h4>
            <div className="relative pl-6 space-y-6 before:absolute before:inset-y-2 before:left-[11px] before:w-px before:bg-neutral-200">
              {['Fresher (0-2 Yrs)', 'Mid-Level (3-5 Yrs)', 'Senior (5+ Yrs)'].map((level, i) => (
                <div key={level} className="relative">
                  <div className="absolute -left-[30px] top-1 w-3 h-3 rounded-full bg-neutral-0 border-2 border-brand-500" />
                  <p className="text-neutral-900 font-semibold text-sm">{level}</p>
                  <p className="text-brand-600 text-xs mt-1">
                    {i === 0 ? '₹4L - ₹8L / yr' : i === 1 ? '₹10L - ₹18L / yr' : '₹20L+ / yr'}
                  </p>
                </div>
              ))}
            </div>
          </div>

            <div>
              <h4 className="text-neutral-900 font-bold mb-4 flex items-center gap-2"><Award size={16} className="text-success" /> Top Recruiters</h4>
              <div className="flex flex-wrap gap-2">
                {course.recruiters.map(r => (
                  <span key={r} className="px-4 py-2 bg-neutral-50 rounded-xl text-xs font-semibold text-neutral-700 border border-neutral-200">
                    {r}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-200 pb-10">
              <button
                onClick={() => {
                  setSelectedCareerOption(course.name)
                  navigate('/colleges')
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-black uppercase tracking-wide hover:shadow-lg hover:shadow-brand-500/30 transition-all flex items-center justify-center gap-3"
              >
                Select Career & Find Colleges <ChevronLeft size={16} className="-rotate-180" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <AnimatePresence>
          {!isScrolledToBottom && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-0 right-0 w-full md:w-[45%] lg:w-[40%] h-16 bg-gradient-to-t from-white dark:from-neutral-900 to-transparent pointer-events-none flex items-end justify-center pb-2 z-50"
            >
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest animate-bounce">
                Scroll for more <ChevronLeft size={12} className="-rotate-90" />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>,
    document.body
  )
}

/* ── MAIN PAGE ───────────────────────────────────────────── */

export default function Careers() {
  const [selectedDomain, setSelectedDomain] = useState(null)
  const [selectedDegree, setSelectedDegree] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [toastMessage, setToastMessage] = useState('')
  const collapsed = useThemeStore((s) => s.sidebarCollapsed)
  const navigate = useNavigate()
  
  const { student, setSelectedCareerOption } = useStudentStore()
  const { stage, trending } = usePersonalization()

  const stageLabel = {
    '10th': 'Recommended for 10th standard students',
    '12th': 'Recommended after 12th standard',
    'ug': 'Recommended for UG degree students',
    'pg': 'Recommended for PG degree students',
    'unknown': 'Based on emerging industry trends',
  }[stage] || 'Based on emerging industry trends'
  
  // Decide which view to show
  const [viewMode, setViewMode] = useState(stage === '10th' ? '10th' : stage === 'pg' ? 'pg' : 'ug')

  // Determine which items to pass to the cube
  const getFaces = () => {
    if (viewMode === '10th') return TENTH_FACES
    if (viewMode === 'pg') return PG_FACES
    return UG_FACES
  }

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto min-h-[calc(100vh-8rem)] relative">
        <OnboardingPopup
          pageKey="careers"
          title="Explore Career Paths"
          message="Double tap a career card to save it to your Careers Wishlist."
          icon="💼"
        />
        
        {/* Sticky Header Container */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 transition-all duration-300">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0" style={{ boxShadow: '0 4px 15px rgba(245,158,11,0.4)' }}>
              <Briefcase size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-neutral-900 dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Careers
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Navigate the educational metaverse. Interactive domains, degrees & roadmaps.
              </p>
              <p className="text-xs font-semibold text-brand-500 mt-0.5">{stageLabel}</p>
            </div>
          </div>
          
          <div className="bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-2xl flex items-center shrink-0 border border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => setViewMode('10th')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${viewMode === '10th' ? 'bg-white dark:bg-neutral-900 text-brand-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
            >
              Below 10th
            </button>
            <button
              onClick={() => setViewMode('ug')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${viewMode === 'ug' ? 'bg-white dark:bg-neutral-900 text-brand-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
            >
              After 12th / UG
            </button>
            <button
              onClick={() => setViewMode('pg')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${viewMode === 'pg' ? 'bg-white dark:bg-neutral-900 text-brand-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
            >
              After UG / PG
            </button>
          </div>
        </div>

        {/* Dynamic Container directly wrapping CareerCube (Outer Box Removed) */}
        <div className="relative w-full h-[450px] md:h-[500px]">
          
          {/* Level 1: Career Cube */}
          <div className={`absolute inset-0 transition-all duration-700 ${selectedDomain ? 'blur-md scale-95 opacity-40 pointer-events-none z-0' : 'opacity-100 z-10'}`}>
            <CareerCube 
              items={getFaces()} 
              onSelectDomain={(id) => {
                if (id !== 'engineering') {
                  const faces = getFaces()
                  const domain = faces.find(f => f.id === id)
                  const domainTitle = domain ? domain.title : 'This domain'
                  setToastMessage(`${domainTitle} is coming soon! In the meantime, you can explore detailed career paths for Engineering.`)
                  setTimeout(() => setToastMessage(''), 4000)
                } else {
                  setSelectedDomain(id)
                }
              }} 
            />
          </div>

          {/* Level 2: Degree Modal */}
          <AnimatePresence>
            {selectedDomain && !selectedDegree && (
              <DegreeModal 
                domainId={selectedDomain} 
                onSelectDegree={setSelectedDegree} 
                onClose={() => setSelectedDomain(null)} 
              />
            )}
          </AnimatePresence>

          {/* Level 3: Course Modal */}
          <AnimatePresence>
            {selectedDegree && (
              <CourseModal 
                degreeId={selectedDegree} 
                onSelectCourse={setSelectedCourse} 
                onClose={() => { setSelectedDegree(null); setSelectedCourse(null) }} 
              />
            )}
          </AnimatePresence>

          {/* Level 4: Course Detail Modal */}
          {selectedCourse && (
            <AnimatePresence>
              <CourseDetailModal courseId={selectedCourse} onClose={() => setSelectedCourse(null)} />
            </AnimatePresence>
          )}
        
          {/* Toast Notification (Positioned exactly above the active cube) */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[50] w-full flex justify-center pointer-events-none">
            <AnimatePresence>
              {toastMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className="bg-white dark:bg-slate-900 border border-brand-200 shadow-2xl rounded-2xl p-4 w-[90%] max-w-sm flex items-start gap-3 pointer-events-auto"
                  style={{ boxShadow: '0 10px 40px rgba(20,184,166,0.15)' }}
                >
                  <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                    <span className="text-brand-600 text-sm font-bold">⏳</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 dark:text-white text-sm mb-0.5">Coming Soon</h4>
                    <p className="text-xs text-neutral-500 font-medium leading-relaxed">{toastMessage}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* New Section: Recommended Domains & Specs */}
        <div className="mt-20 mb-10 pb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0 border border-brand-100">
              <Sparkles size={20} className="text-brand-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-neutral-900 dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>AI Recommended Career Domains</h2>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Based on your cognitive profile and emerging industry trends</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Domain 1 */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                  <Globe size={20} />
                </div>
                <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-wider rounded-full border border-green-100">98% Match</span>
              </div>
              <h3 className="text-lg font-black text-neutral-900 dark:text-white mb-2">Software & Computing</h3>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-6">High growth potential in AI, Web3, and Enterprise solutions.</p>
              
              <div className="space-y-3">
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Recommended Specs</p>
                {['Artificial Intelligence & Data Science', 'Computer Science and Engineering', 'Information Technology'].map(spec => (
                  <button 
                    key={spec}
                    onClick={() => {
                      setSelectedCareerOption(spec);
                      navigate('/colleges');
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl bg-neutral-50 hover:bg-brand-50 hover:text-brand-700 dark:bg-neutral-800/50 dark:hover:bg-brand-900/30 border border-neutral-100 dark:border-neutral-800 hover:border-brand-200 transition-all text-sm font-bold text-neutral-700 dark:text-neutral-300 flex items-center justify-between group"
                  >
                    <span className="truncate pr-2">{spec}</span>
                    <ChevronLeft size={14} className="-rotate-180 text-neutral-400 group-hover:text-brand-500 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Domain 2 */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                  <Zap size={20} />
                </div>
                <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-wider rounded-full border border-green-100">92% Match</span>
              </div>
              <h3 className="text-lg font-black text-neutral-900 dark:text-white mb-2">Electronics & Comm</h3>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-6">Semiconductor booming market and core hardware design.</p>
              
              <div className="space-y-3">
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Recommended Specs</p>
                {['Electronics and Communication Engineering', 'Electrical and Electronics Engineering', 'VLSI Design (PG)'].map(spec => (
                  <button 
                    key={spec}
                    onClick={() => {
                      setSelectedCareerOption(spec);
                      navigate('/colleges');
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl bg-neutral-50 hover:bg-brand-50 hover:text-brand-700 dark:bg-neutral-800/50 dark:hover:bg-brand-900/30 border border-neutral-100 dark:border-neutral-800 hover:border-brand-200 transition-all text-sm font-bold text-neutral-700 dark:text-neutral-300 flex items-center justify-between group"
                  >
                    <span className="truncate pr-2">{spec}</span>
                    <ChevronLeft size={14} className="-rotate-180 text-neutral-400 group-hover:text-brand-500 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Domain 3 */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
                  <Activity size={20} />
                </div>
                <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-wider rounded-full border border-green-100">85% Match</span>
              </div>
              <h3 className="text-lg font-black text-neutral-900 dark:text-white mb-2">Medical & Biotech</h3>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-6">Intersection of tech and healthcare for next-gen treatments.</p>
              
              <div className="space-y-3">
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Recommended Specs</p>
                {['Bio Medical Engineering', 'Bio Technology', 'Pharmaceutical Technology'].map(spec => (
                  <button 
                    key={spec}
                    onClick={() => {
                      setSelectedCareerOption(spec);
                      navigate('/colleges');
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl bg-neutral-50 hover:bg-brand-50 hover:text-brand-700 dark:bg-neutral-800/50 dark:hover:bg-brand-900/30 border border-neutral-100 dark:border-neutral-800 hover:border-brand-200 transition-all text-sm font-bold text-neutral-700 dark:text-neutral-300 flex items-center justify-between group"
                  >
                    <span className="truncate pr-2">{spec}</span>
                    <ChevronLeft size={14} className="-rotate-180 text-neutral-400 group-hover:text-brand-500 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </PageWrapper>
  )
}
