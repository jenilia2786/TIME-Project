import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, Award, Star, Heart, Building2, BookOpen,
  SlidersHorizontal, Search, ChevronDown, Target,
  BarChart, Gem, Trophy, Medal, X, Map, Calendar,
  Bus, GraduationCap, Phone, Globe, Mail, AlertCircle, Filter, CheckCircle2, ChevronRight, ChevronLeft, Sparkles
} from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import { fetchDirectory, fetchMetadata, fetchCollegeProfile, fetchCollegeInsights } from '../services/collegeService'
import { addChoice, removeChoice } from '../services/choiceService'
import useApi from '../hooks/useApi'
import useThemeStore from '../store/useThemeStore'
import useStudentStore from '../store/useStudentStore'
import OnboardingPopup from '../components/ui/OnboardingPopup'

/* ─────────────────────────────────────────────────────────
   CONFIG & HELPERS
───────────────────────────────────────────────────────── */
const CARD_GRADIENTS = [
  ['#0ea5e9', '#0284c7'],
  ['#8b5cf6', '#6d28d9'],
  ['#f43f5e', '#be123c'],
  ['#f59e0b', '#d97706'],
  ['#10b981', '#059669'],
  ['#06b6d4', '#0891b2'],
  ['#ec4899', '#be185d'],
  ['#64748b', '#475569'],
];

const toTitleCase = (str) => {
  if (!str) return '';
  let s = str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()).replace(/\b(And|Of|In|The|For|On|At)\b/g, match => match.toLowerCase());
  
  // Normalize known variations to prevent repetitions
  s = s.replace(/Agricultural\b/gi, 'Agriculture');
  s = s.replace(/Bussiness\b/gi, 'Business');
  s = s.replace(/\s&\s/g, ' and ');
  s = s.replace(/Bio Technology\b/gi, 'Biotechnology');
  s = s.replace(/Bio Medical\b/gi, 'Biomedical');
  
  return s;
};

// Map raw API directory item to UI-friendly format
const mapDirectoryItem = (item, index) => {
  return {
    id: item.code,
    code: item.code,
    name: toTitleCase(item.name),
    initials: item.name.substring(0, 2).toUpperCase(),
    district: item.district,
    location: item.district,
    nirf: '-',
    naac: '-',
    colors: CARD_GRADIENTS[index % CARD_GRADIENTS.length],
    courses: (() => {
      const bList = item.branches ? item.branches.map(b => toTitleCase(b.name)) : [];
      const cList = item.courses ? item.courses.map(c => toTitleCase(c)) : [];
      return Array.from(new Set([...bList, ...cList]));
    })(),
    cutoff: (() => {
      if (!item.branches || item.branches.length === 0) return 'N/A';
      
      let minOfMax = Infinity;
      let maxOfMax = -Infinity;
      
      item.branches.forEach(b => {
        if (b.max !== undefined && b.max !== null && b.max > 0) {
          if (b.max < minOfMax) minOfMax = b.max;
          if (b.max > maxOfMax) maxOfMax = b.max;
        }
      });
      
      if (minOfMax === Infinity || maxOfMax === -Infinity) return 'N/A';
      if (minOfMax === maxOfMax) return `${maxOfMax}`;
      return `${minOfMax} - ${maxOfMax}`;
    })()
  }
}

/* ─────────────────────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────────────────────── */

// 1. Toast Notification
function Toast({ show, message, isAdd, isError }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl backdrop-blur-xl border"
          style={{
            background: isError ? 'rgba(40,20,20,0.95)' : (isAdd ? 'rgba(20,20,20,0.95)' : 'rgba(40,40,40,0.95)'),
            borderColor: isError ? 'rgba(244,63,94,0.6)' : (isAdd ? 'rgba(244,63,94,0.3)' : 'rgba(255,255,255,0.1)'),
          }}
        >
          {isError ? (
             <X size={16} className="text-rose-500" />
          ) : (
             <Heart size={16} className={isAdd ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'} />
          )}
          <span className="text-sm font-bold text-white">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// 2. Heart Burst Effect
function HeartBurst({ trigger }) {
  if (!trigger) return null
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * 360
        const rad = (angle * Math.PI) / 180
        const x = Math.cos(rad) * 60
        const y = Math.sin(rad) * 60
        return (
          <motion.div
            key={i}
            className="absolute"
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{ x, y, scale: 1, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Heart size={16} className="fill-rose-500 text-rose-500" />
          </motion.div>
        )
      })}
    </motion.div>
  )
}

// Sub-component for Card Courses to handle its own scroll state
function CardCourseList({ courses, colors }) {
  const scrollRef = useRef(null)
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false)

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        setIsScrolledToBottom(true)
      } else {
        setIsScrolledToBottom(false)
      }
    }
  }

  useEffect(() => {
    handleScroll()
    const t = setTimeout(handleScroll, 300)
    return () => clearTimeout(t)
  }, [courses])

  return (
    <>
      <motion.div 
        ref={scrollRef}
        onScroll={handleScroll}
        data-lenis-prevent="true"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="w-full flex-1 overflow-y-auto scrollbar-hide flex flex-col justify-start items-start gap-2 pt-4 border-t border-neutral-100 px-3 text-left pb-10"
      >
        {courses.map((course, i) => (
          <div key={course} className="flex items-start gap-2.5 w-full">
            <span className="text-[11px] font-black w-3 shrink-0 text-right mt-[1px]" style={{ color: colors[0] }}>
              {i + 1}.
            </span>
            <span className="text-[11px] font-bold leading-tight text-neutral-700 flex-1">
              {course}
            </span>
          </div>
        ))}
        {courses.length === 0 && (
          <span className="text-xs text-neutral-400 italic">No branch data available</span>
        )}
      </motion.div>

      <AnimatePresence>
        {!isScrolledToBottom && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none flex items-end justify-center pb-3 z-20 rounded-b-[2.3rem]"
          >
            <span className="flex items-center gap-1 text-[9px] font-bold text-neutral-400 uppercase tracking-widest animate-bounce">
              Scroll <ChevronDown size={10} />
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// 3. Carousel Component (The Symmetrical Coverflow)
function CollegeCarousel({ title, icon: TitleIcon, color, colleges, wishlisted, onToggleWishlist, onClickCard }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [burstKey, setBurstKey] = useState(0)

  // Reset index if data changes
  useEffect(() => setActiveIndex(0), [colleges])

  if (!colleges || colleges.length === 0) return null

  const handleDragEnd = (e, { offset }) => {
    if (offset.x < -50 && activeIndex < colleges.length - 1) setActiveIndex(prev => prev + 1)
    else if (offset.x > 50 && activeIndex > 0) setActiveIndex(prev => prev - 1)
  }

  const handleDoubleClick = (id, college) => {
    const isAdding = !wishlisted.includes(id)
    if (isAdding) setBurstKey(k => k + 1)
    onToggleWishlist(id, college)
  }

  return (
    <div className="py-12 w-full overflow-hidden">
      <div className="flex items-center gap-3 mb-10 w-full max-w-[1400px] mx-auto md:pl-2">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg`} style={{ background: color }}>
          <TitleIcon size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-neutral-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h2>
          <p className="text-sm font-bold text-neutral-400">Swipe to explore · Double tap to wishlist · Tap to view details</p>
        </div>
      </div>

      <div className="relative w-full h-[450px] flex items-center justify-center perspective-[1200px]">
        {colleges.map((college, index) => {
          const offset = index - activeIndex
          const isCenter = offset === 0
          
          const x = offset * 260
          const scale = isCenter ? 1.1 : Math.max(0.65, 1 - Math.abs(offset) * 0.25)
          const zIndex = 30 - Math.abs(offset)
          const opacity = Math.abs(offset) > 2 ? 0 : 1
          
          const rotateY = offset === 0 ? 0 : offset > 0 ? -15 : 15
          const isWishlisted = wishlisted.includes(college.id)

          return (
            <motion.div
              key={college.id}
              className="absolute top-0 flex flex-col items-center"
              initial={false}
              animate={{ x, scale, rotateY, zIndex, opacity }}
              transition={{ type: 'spring', stiffness: 220, damping: 25 }}
              style={{ transformStyle: 'preserve-3d' }}
              drag={isCenter ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              onClick={() => { 
                if (!isCenter) setActiveIndex(index);
                else onClickCard(college); 
              }}
              onDoubleClick={(e) => { 
                if (isCenter) {
                  e.stopPropagation(); // prevent modal opening on double click
                  handleDoubleClick(college.id, college);
                }
              }}
            >
              {/* Card Container */}
              <div 
                className={`w-[320px] h-[420px] rounded-[2.5rem] relative overflow-hidden transition-all duration-500 cursor-pointer ${
                  isCenter ? '' : 'bg-white/80 hover:bg-white shadow-md border border-neutral-100'
                }`}
                style={{
                  boxShadow: isCenter ? `0 0 30px ${college.colors[0]}40` : undefined,
                  transform: isCenter ? 'translateZ(20px)' : 'translateZ(0)' // subtle pop
                }}
              >
                {/* Animated Neon Border Background */}
                {isCenter && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="absolute -inset-[100%] z-0 opacity-80"
                    style={{
                      background: `conic-gradient(from 0deg, transparent 60%, ${college.colors[0]} 100%)`
                    }}
                  />
                )}

                {/* Inner White Box */}
                <div 
                  className={`absolute z-10 flex flex-col items-center justify-start p-6 text-center bg-white ${
                    isCenter ? 'inset-[3px] rounded-[2.3rem]' : 'inset-0 rounded-[2.5rem]'
                  }`}
                >
                  {isCenter && <HeartBurst trigger={burstKey > 0} />}

                  {/* Wishlist indicator — filled heart if saved, outline if not */}
                  <motion.div
                    key={`heart-${isWishlisted}`}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center border shadow-sm transition-all ${
                      isWishlisted
                        ? 'bg-rose-50 border-rose-200'
                        : 'bg-white/80 border-neutral-200'
                    }`}
                  >
                    <Heart
                      size={15}
                      className={isWishlisted ? 'text-rose-500 fill-rose-500' : 'text-neutral-300'}
                    />
                  </motion.div>

                  {/* College Avatar */}
                  <div 
                    className={`w-20 h-20 rounded-[1.5rem] mb-4 mt-2 flex items-center justify-center text-white font-black text-2xl shadow-lg shrink-0`}
                    style={{ background: `linear-gradient(135deg, ${college.colors[0]}, ${college.colors[1]})` }}
                  >
                    {college.initials}
                  </div>
                  
                  {/* Minimal Info */}
                  <h3 className={`font-black text-neutral-900 leading-tight px-2 transition-all ${isCenter ? 'text-xl mb-3 line-clamp-2' : 'text-sm line-clamp-2 mt-1 opacity-60'}`}>
                    {college.name}
                  </h3>
                  
                  <div className={`flex flex-col gap-2 items-center shrink-0 transition-all duration-300 ${isCenter ? 'opacity-100 mb-5 h-auto' : 'opacity-0 h-0 overflow-hidden'}`}>
                    <span className="px-3 py-1 bg-neutral-100 text-neutral-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                      CODE {college.code}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-neutral-500 mt-0.5">
                      <MapPin size={12} /> {college.location}
                    </span>
                  </div>

                  {/* Courses List INSIDE the card (only if center) */}
                  {isCenter && (
                    <CardCourseList courses={college.courses} colors={college.colors} />
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
      
      {/* Navigation Indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {colleges.map((_, idx) => (
          <div 
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-8' : 'w-2 bg-neutral-200'}`}
            style={{ background: idx === activeIndex ? color : undefined }}
          />
        ))}
      </div>
    </div>
  )
}

// 4. View All Grid Card
function GridCard({ college, onClick, onToggleWishlist, wishlisted }) {
  const isWishlisted = wishlisted.includes(college.id)
  const timerRef = useRef(null)

  const handleClick = (e) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
      onToggleWishlist(college.id, college)
    } else {
      timerRef.current = setTimeout(() => {
        timerRef.current = null
        onClick(college)
      }, 250)
    }
  }
  
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={handleClick}
      className="bg-white rounded-[2rem] overflow-hidden cursor-pointer border shadow-sm hover:shadow-xl transition-all group relative"
      style={{ borderColor: `${college.colors[0]}25` }}
    >
      <div className="h-2" style={{ background: `linear-gradient(90deg, ${college.colors[0]}, ${college.colors[1]})` }} />
      <div className="p-6">
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(college.id, college) }}
          className={`absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center border transition-all z-10 ${
            isWishlisted
              ? 'bg-rose-50 border-rose-200 shadow-sm'
              : 'bg-white border-neutral-200 hover:border-rose-200 hover:bg-rose-50'
          }`}
        >
          <Heart size={15} className={isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-neutral-300 group-hover:text-rose-400'} />
        </button>

        <div className="flex items-start gap-4 mb-5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black shrink-0 shadow-md"
            style={{ background: `linear-gradient(135deg, ${college.colors[0]}, ${college.colors[1]})` }}
          >
            {college.initials}
          </div>
          <div className="flex-1 min-w-0 pt-0.5 pr-6">
            <h3 className="text-sm font-black text-neutral-900 leading-tight mb-1 line-clamp-2 group-hover:text-brand-700 transition-colors">
              {college.name}
            </h3>
            <p className="text-[10px] font-bold text-neutral-400">
              Code {college.code} · {college.district}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5 min-h-[50px]">
          {college.courses.slice(0, 3).map(c => (
            <span key={c} className="px-2.5 py-1 rounded-lg text-[10px] font-bold border truncate max-w-full" style={{ background: `${college.colors[0]}10`, borderColor: `${college.colors[0]}25`, color: college.colors[0] }}>
              {c}
            </span>
          ))}
          {college.courses.length > 3 && (
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-neutral-50 text-neutral-400 border border-neutral-100">
              +{college.courses.length - 3}
            </span>
          )}
          {college.courses.length === 0 && (
            <span className="text-[10px] text-neutral-400 italic">Various Branches</span>
          )}
        </div>

        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black text-neutral-400 uppercase tracking-wider mb-0.5">Top Cutoff</p>
            <p className="text-sm font-black text-neutral-800">{college.cutoff}</p>
          </div>
          <div className="text-right">
            <span className="px-3 py-1.5 rounded-xl bg-brand-50 text-brand-600 text-xs font-bold group-hover:bg-brand-500 group-hover:text-white transition-colors">
              View Profile
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// 5. College Detail Modal
function CollegeModal({ college, onClose, onToggleWishlist, wishlisted }) {
  const { data: profile, loading, execute } = useApi(fetchCollegeProfile)
  const { data: insightsData, loading: insightsLoading, execute: executeInsights } = useApi(fetchCollegeInsights)
  const scrollRef = useRef(null)
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false)
  
  useEffect(() => {
    if (college?.code) {
      execute(college.code)
      executeInsights(college.code)
    }
  }, [college])

  useEffect(() => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight } = scrollRef.current
      if (scrollHeight <= clientHeight) {
        setIsScrolledToBottom(true)
      } else {
        setIsScrolledToBottom(false)
      }
    }
  }, [profile, loading])

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    setIsScrolledToBottom(scrollHeight - scrollTop <= clientHeight + 20)
  }

  if (!college) return null
  const isWishlisted = wishlisted.includes(college.id)

  return createPortal(
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ y: 50, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }}
          className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative"
          onClick={e => e.stopPropagation()}
        >
          <div className="h-4" style={{ background: `linear-gradient(90deg, ${college.colors[0]}, ${college.colors[1]})` }} />
          
          <div className="absolute top-8 right-6 z-20">
            <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold text-sm transition-all shadow-sm">
              <ChevronLeft size={16} /> Go Back
            </button>
          </div>

          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-6 md:p-10 pb-20 scrollbar-hide"
            data-lenis-prevent="true"
          >
            <div className="flex flex-col md:flex-row gap-6 mb-10 items-start">
               <div
                  className="w-24 h-24 rounded-3xl flex items-center justify-center text-white font-black text-3xl shrink-0 shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${college.colors[0]}, ${college.colors[1]})` }}
                >
                  {college.initials}
                </div>
                <div className="flex-1 pr-8">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h2 className="text-2xl md:text-3xl font-black text-neutral-900 leading-tight">{college.name}</h2>
                    <button onClick={() => onToggleWishlist(college.id, college)} className="p-2 border border-neutral-200 rounded-full hover:bg-rose-50 hover:border-rose-200 transition-all">
                      <Heart size={20} className={isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm font-bold text-neutral-500 mt-3">
                    <span className="flex items-center gap-1.5"><MapPin size={16} /> {college.district}</span>
                    <span className="flex items-center gap-1.5"><Building2 size={16} /> Code: {college.code}</span>
                  </div>
                </div>
            </div>

            {loading && (
              <div className="py-20 flex flex-col items-center justify-center text-brand-500">
                <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin mb-4" />
                <p className="font-bold animate-pulse">Loading detailed profile...</p>
              </div>
            )}

            {!loading && profile && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  
                  {/* AI Insights */}
                  {(insightsLoading || insightsData) && (
                    <div className="bg-gradient-to-br from-brand-50 to-brand-100/50 rounded-2xl border border-brand-200 p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 blur-3xl rounded-full" />
                      <h3 className="text-sm font-black text-brand-700 mb-3 flex items-center gap-2">
                        <Sparkles size={16} className="text-brand-500" /> AI Insights
                      </h3>
                      {insightsLoading ? (
                        <div className="animate-pulse flex flex-col gap-2">
                          <div className="h-3 bg-brand-200/50 rounded w-full" />
                          <div className="h-3 bg-brand-200/50 rounded w-5/6" />
                          <div className="h-3 bg-brand-200/50 rounded w-4/6" />
                        </div>
                      ) : (
                        <p className="text-sm text-neutral-700 leading-relaxed font-medium relative z-10">
                          {insightsData?.insights}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Courses */}
                  <div>
                    <h3 className="text-lg font-black text-neutral-800 mb-4 flex items-center gap-2">
                      <BookOpen size={20} className="text-brand-500" /> Offered Courses & Cutoffs
                    </h3>
                    <div className="bg-neutral-50 rounded-2xl border border-neutral-100 overflow-hidden">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-neutral-100/50 text-neutral-500 font-black uppercase text-[10px] tracking-wider">
                          <tr>
                            <th className="px-5 py-4">Branch Name</th>
                            <th className="px-5 py-4 text-right">Cutoff Range</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {(() => {
                            const branches = profile.branches || {};
                            const coursesList = profile.courses || [];
                            
                            // Map branches to titlecase
                            const titleCaseBranches = {};
                            Object.entries(branches).forEach(([bName, data]) => {
                              titleCaseBranches[toTitleCase(bName)] = data;
                            });

                            const allCourses = new Set([
                              ...Object.keys(titleCaseBranches),
                              ...coursesList.map(c => toTitleCase(c.branch_name))
                            ]);

                            if (allCourses.size === 0) {
                              return <tr><td colSpan="2" className="px-5 py-8 text-center text-neutral-400 italic font-medium">Branch cutoff data unavailable</td></tr>;
                            }

                            return Array.from(allCourses).map((courseName, idx) => {
                              const categories = titleCaseBranches[courseName];
                              let highest = 0;
                              if (categories) {
                                Object.values(categories).forEach(years => {
                                  Object.values(years).forEach(val => {
                                    if (val && val > highest) highest = val;
                                  })
                                });
                              }
                              return (
                                <tr key={idx} className="hover:bg-white transition-colors">
                                  <td className="px-5 py-3.5 font-bold text-neutral-700">{courseName}</td>
                                  <td className="px-5 py-3.5 font-black text-neutral-900 text-right">
                                    {highest > 0 ? highest.toFixed(1) + '+' : 'N/A'}
                                  </td>
                                </tr>
                              )
                            });
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Facilities */}
                  <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
                    <h3 className="text-sm font-black text-neutral-800 mb-4 uppercase tracking-wider">Facilities</h3>
                    <div className="space-y-4 text-sm font-bold text-neutral-600">
                      <div className="flex items-center justify-between">
                         <span className="flex items-center gap-2"><Map size={16} className="text-neutral-400"/> Boys Hostel</span>
                         <span className={profile.hostel?.boys_hostel_available ? 'text-emerald-500' : 'text-neutral-400'}>
                           {profile.hostel?.boys_hostel_available ? 'Available' : 'No'}
                         </span>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="flex items-center gap-2"><Map size={16} className="text-neutral-400"/> Girls Hostel</span>
                         <span className={profile.hostel?.girls_hostel_available ? 'text-emerald-500' : 'text-neutral-400'}>
                           {profile.hostel?.girls_hostel_available ? 'Available' : 'No'}
                         </span>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="flex items-center gap-2"><Bus size={16} className="text-neutral-400"/> Transport</span>
                         <span className={profile.transport?.facilities_available ? 'text-emerald-500' : 'text-neutral-400'}>
                           {profile.transport?.facilities_available ? 'Available' : 'No'}
                         </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Contact Info */}
                  <div className="bg-neutral-50 rounded-2xl p-5">
                    <h3 className="text-sm font-black text-neutral-800 mb-4 uppercase tracking-wider">Contact</h3>
                    <div className="space-y-3 text-sm font-bold text-neutral-600 break-words">
                       <p className="flex items-start gap-2">
                         <Phone size={16} className="text-neutral-400 shrink-0 mt-0.5"/>
                         {profile.contact?.phone || 'N/A'}
                       </p>
                       <p className="flex items-start gap-2">
                         <Globe size={16} className="text-neutral-400 shrink-0 mt-0.5"/>
                         {profile.contact?.website ? (
                           <a href={profile.contact.website.startsWith('http') ? profile.contact.website : `https://${profile.contact.website}`} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">
                             {profile.contact.website}
                           </a>
                         ) : 'N/A'}
                       </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {!loading && !profile && (
              <div className="py-20 text-center text-neutral-500 font-bold">Failed to load detailed profile.</div>
            )}
          </div>
          
          {/* Scroll Indicator */}
          <AnimatePresence>
            {!isScrolledToBottom && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none flex items-end justify-center pb-2 z-20"
              >
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest animate-bounce">
                  Scroll for more <ChevronDown size={12} />
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}

/* ─────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────── */
export default function Colleges() {
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('') // For debounce
  const [selectedDistrict, setSelectedDistrict] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const collapsed = useThemeStore((s) => s.sidebarCollapsed)
  const { selectedCareerOption, setSelectedCareerOption } = useStudentStore()
  
  const [page, setPage] = useState(1)
  const LIMIT = 40
  
  const [wishlisted, setWishlisted] = useState([])
  const [toast, setToast] = useState({ show: false, message: '', isAdd: true, isError: false })
  const [selectedCollege, setSelectedCollege] = useState(null)

  const { data: directoryData, loading: dirLoading, error: dirError, execute: execDir } = useApi(fetchDirectory)
  const { data: metadata, execute: execMeta } = useApi(fetchMetadata)

  // Fetch metadata on mount
  useEffect(() => {
    execMeta()
  }, [])

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1) }, 500)
    return () => clearTimeout(t)
  }, [searchInput])

  // Fetch directory when filters/page change
  useEffect(() => {
    execDir({
      search: search || undefined,
      districts: selectedDistrict !== 'All' ? [selectedDistrict] : undefined,
      institution_type: selectedCategory !== 'All' ? selectedCategory : undefined,
      page,
      limit: LIMIT
    })
  }, [search, selectedDistrict, selectedCategory, page])

  const handleToggleWishlist = async (id, college) => {
    const isAdding = !wishlisted.includes(id)
    if (isAdding) {
      // Optimistic UI
      setWishlisted(prev => [...prev, id])
      try {
        await addChoice({ code: college.code, branch: 'General', name: college.name, district: college.district })
        setToast({ show: true, message: 'Added to Shortlist', isAdd: true })
      } catch (e) {
        setWishlisted(prev => prev.filter(x => x !== id))
        setToast({ show: true, message: 'Failed to add. Please try again.', isAdd: false, isError: true })
      }
    } else {
      // Optimistic UI for removal
      setWishlisted(prev => prev.filter(x => x !== id))
      try {
        await removeChoice({ code: college.code, branch: 'General' })
        setToast({ show: true, message: 'Removed from Shortlist', isAdd: false })
      } catch (e) {
        // Revert on failure
        setWishlisted(prev => [...prev, id])
        setToast({ show: true, message: 'Failed to remove. Please try again.', isAdd: false, isError: true })
      }
    }
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2500)
  }

  // Derive data for UI
  const mappedColleges = useMemo(() => {
    if (!directoryData?.colleges) return []
    return directoryData.colleges.map(mapDirectoryItem)
  }, [directoryData])

  // Top 30 for carousel (Platinum, Gold, Silver)
  const carouselData = useMemo(() => {
    return {
      platinum: mappedColleges.slice(0, 10),
      gold: mappedColleges.slice(10, 20),
      silver: mappedColleges.slice(20, 30),
    }
  }, [mappedColleges])

  // Filters from metadata
  const districts = ['All', ...(metadata?.districts || [])]
  const categories = ['All', ...(metadata?.institution_types || [])]

  return (
    <PageWrapper>
      <div className="max-w-[1400px] mx-auto pb-32">
        <Toast show={toast.show} message={toast.message} isAdd={toast.isAdd} isError={toast.isError} />
        <CollegeModal college={selectedCollege} onClose={() => setSelectedCollege(null)} onToggleWishlist={handleToggleWishlist} wishlisted={wishlisted} />
        <OnboardingPopup
          pageKey="colleges"
          title="Welcome to College Discovery!"
          message="Double tap a college card to save it to your Colleges Wishlist."
          icon="🏫"
        />
        {/* Career Suggestion Banner */}
        <AnimatePresence>
          {selectedCareerOption && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-8 p-6 bg-gradient-to-br from-brand-50 to-brand-100/50 border border-brand-200 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
            >
              <div>
                <h3 className="text-lg font-black text-brand-900 mb-1">Career Match Discovered 🎯</h3>
                <p className="text-sm font-semibold text-brand-700">We noticed you chose <span className="px-2 py-0.5 bg-white rounded-lg border border-brand-200 mx-1 shadow-sm">{selectedCareerOption}</span>. Do you want to see suggested colleges for this career option?</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button 
                  onClick={() => {
                    setSearchInput(selectedCareerOption);
                    setSearch(selectedCareerOption);
                    setSelectedCategory('Engineering'); // Most tech courses fall here
                  }}
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-brand-500/20"
                >
                  Show Suggested Colleges
                </button>
                <button 
                  onClick={() => setSelectedCareerOption(null)}
                  className="w-10 h-10 rounded-xl bg-white hover:bg-neutral-50 text-neutral-500 border border-neutral-200 flex items-center justify-center transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sticky Top Bar Container */}
        <div className="flex flex-col gap-4 mb-10">
          
          {/* ── Header ─────────────── */}
          <div className={`w-full max-w-[1400px] mx-auto transition-all duration-300`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shrink-0" style={{ boxShadow: '0 4px 15px rgba(14,165,233,0.4)' }}>
                  <Building2 size={18} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-neutral-900 dark:text-neutral-100" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Colleges
                  </h1>
                  <p className="text-sm text-neutral-500 font-medium mt-0.5">
                    Explore comprehensive records of Tamil Nadu Engineering Institutions
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                   <select value={selectedDistrict} onChange={e => { setSelectedDistrict(e.target.value); setPage(1) }} className="appearance-none bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-bold rounded-xl pl-4 pr-10 py-3 shadow-sm focus:outline-none focus:border-brand-500 cursor-pointer">
                      {districts.map(d => <option key={d} value={d}>{d}</option>)}
                   </select>
                   <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="w-full max-w-[1400px] mx-auto flex pointer-events-none pb-2">
          <div className="bg-white/90 backdrop-blur-xl border border-neutral-200 p-2.5 rounded-2xl shadow-sm pointer-events-auto flex flex-nowrap gap-2 max-w-full overflow-x-auto hide-scrollbar">
            {categories.slice(0, 15).map((d, idx) => { // Limit tabs to top 15 for UI sanity
              const isActive = selectedCategory === d
              const color = CARD_GRADIENTS[idx % CARD_GRADIENTS.length]
              return (
                <motion.button
                  key={d} onClick={() => { setSelectedCategory(d); setPage(1) }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative shrink-0 px-6 py-2.5 rounded-xl text-sm font-black transition-all whitespace-nowrap ${
                    isActive ? 'text-white shadow-md' : 'bg-neutral-100/80 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900'
                  }`}
                  style={isActive ? { background: `linear-gradient(135deg, ${color[0]}, ${color[1]})` } : {}}
                >
                  {d}
                </motion.button>
              )
            })}
            {categories.length > 15 && (
               <div className="relative shrink-0">
                 <select value={selectedCategory} onChange={e => { setSelectedCategory(e.target.value); setPage(1) }} className="appearance-none bg-neutral-100/80 text-neutral-500 text-sm font-black rounded-xl pl-6 pr-10 py-2.5 hover:bg-neutral-200 hover:text-neutral-900 focus:outline-none cursor-pointer">
                    <option value="All" disabled>More Categories...</option>
                    {categories.slice(15).map(b => <option key={b} value={b}>{b}</option>)}
                 </select>
                 <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
               </div>
            )}
           </div>
          </div>
        </div>

        {/* Loading / Error States */}
        {dirLoading && mappedColleges.length === 0 && (
           <div className="py-32 flex flex-col items-center justify-center text-brand-500">
             <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin mb-4" />
             <p className="font-bold text-neutral-500 animate-pulse">Scanning database...</p>
           </div>
        )}

        {dirError && (
          <div className="text-center py-20 bg-rose-50 rounded-3xl border border-rose-100 mt-4 mx-4 md:mx-8">
            <AlertCircle size={40} className="text-rose-400 mx-auto mb-4" />
            <p className="text-lg font-black text-rose-600">Failed to load colleges</p>
            <p className="text-sm font-bold text-rose-400 mt-1">{dirError}</p>
          </div>
        )}

        {/* ── The 3 Tiers (Platinum, Gold, Silver) for Page 1 ─────────── */}
        {!dirLoading && !dirError && page === 1 && mappedColleges.length > 0 && (
          <div className="space-y-4">
            {carouselData.platinum.length > 0 && (
              <div className="bg-slate-50/50 rounded-[4rem]">
                <CollegeCarousel 
                  title={`💎 Top Matches (1-${carouselData.platinum.length})`} 
                  icon={Gem} color="#8b5cf6" 
                  colleges={carouselData.platinum} wishlisted={wishlisted} onToggleWishlist={handleToggleWishlist} onClickCard={setSelectedCollege}
                />
              </div>
            )}
            {carouselData.gold.length > 0 && (
              <div className="bg-amber-50/30 rounded-[4rem]">
                <CollegeCarousel 
                  title={`🥇 Next Matches (${carouselData.platinum.length + 1}-${carouselData.platinum.length + carouselData.gold.length})`} 
                  icon={Trophy} color="#f59e0b" 
                  colleges={carouselData.gold} wishlisted={wishlisted} onToggleWishlist={handleToggleWishlist} onClickCard={setSelectedCollege}
                />
              </div>
            )}
          </div>
        )}

        {/* ── Divider ─────────────────── */}
        {!dirError && mappedColleges.length > 0 && (
          <div className="my-16 px-8">
            <div className="flex items-center gap-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-neutral-200" />
              <div className="flex items-center gap-2 px-6 py-3 bg-white border border-neutral-200 rounded-full shadow-sm shrink-0">
                <BarChart size={18} className="text-brand-500" />
                <span className="text-base font-black text-neutral-800">All Results ({directoryData?.total || 0})</span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-neutral-200" />
            </div>
          </div>
        )}

        {/* ── View More Grid ────────────── */}
        {!dirError && (
          <div className="px-4 md:px-8">
            <div className="relative max-w-md mx-auto mb-10">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
              <input
                value={searchInput} onChange={e => setSearchInput(e.target.value)}
                placeholder="Search by college name, code, or location..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-neutral-200 text-sm font-bold text-neutral-700 focus:border-brand-500 focus:ring-4 focus:ring-brand-50 transition-all focus:outline-none bg-white shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {mappedColleges.map((college, i) => (
                <motion.div key={college.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (i % 10) * 0.04 }}>
                  <GridCard college={college} onClick={setSelectedCollege} onToggleWishlist={handleToggleWishlist} wishlisted={wishlisted} />
                </motion.div>
              ))}
            </div>

            {!dirLoading && mappedColleges.length === 0 && (
              <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-neutral-100 mt-4">
                <Search size={40} className="text-neutral-200 mx-auto mb-4" />
                <p className="text-lg font-black text-neutral-500">No colleges found</p>
                <p className="text-sm font-medium text-neutral-400 mt-1">Try adjusting your search or filters</p>
              </div>
            )}
            
            {/* Pagination Controls */}
            {!dirLoading && directoryData && directoryData.pages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-5 py-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-700 font-bold hover:bg-neutral-50 disabled:opacity-50 transition-all"
                >
                  Previous
                </button>
                <span className="text-sm font-black text-neutral-500">
                  Page {page} of {directoryData.pages}
                </span>
                <button 
                  onClick={() => setPage(p => Math.min(directoryData.pages, p + 1))} disabled={page === directoryData.pages}
                  className="px-5 py-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-700 font-bold hover:bg-neutral-50 disabled:opacity-50 transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </PageWrapper>
  )
}
