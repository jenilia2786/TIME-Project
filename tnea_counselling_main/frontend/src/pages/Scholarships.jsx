import { useState, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap, Search, SlidersHorizontal, Star, Calendar,
  CheckCircle, AlertCircle, ArrowRight, Zap, Brain, Trophy,
  DollarSign, Users, Filter, X, ChevronDown, Award, Bookmark, 
  Landmark, Info, ChevronLeft, Heart
} from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import useThemeStore from '../store/useThemeStore'
import useStudentStore from '../store/useStudentStore'
import OnboardingPopup from '../components/ui/OnboardingPopup'

/* ─────────────────────────────────────────────────────────
   ACTUAL SCHOLARSHIP DATASET
───────────────────────────────────────────────────────── */
const SCHOLARSHIPS = [
  // ADI DRAVIDAR WELFARE
  {
    id: 'scc-hes', name: 'SCC-Higher Education Special Scholarship',
    department: 'Adi Dravidar And Tribal Welfare Department', subDepartment: 'Adi Dravidar Welfare',
    scholarshipType: 'Special Scholarship', community: ['SCC'], courseLevel: ['Undergraduate', 'Postgraduate', 'Professional Course'],
    institutionType: ['Government College', 'Government Aided College'], benefitType: 'Educational Assistance',
    amount: '₹8,000/year', deadline: 'Nov 30, 2025', provider: 'Government of Tamil Nadu',
    desc: 'Special scholarship for SCC students residing in hostels and pursuing higher education.',
    eligibility: 'SCC students, family income limit applies, must be hosteller.',
    gradient: 'from-emerald-500 to-teal-500', glow: 'rgba(16,185,129,0.3)'
  },
  {
    id: 'scc-ss-pm', name: 'SCC-State Special Post Matric Scholarship',
    department: 'Adi Dravidar And Tribal Welfare Department', subDepartment: 'Adi Dravidar Welfare',
    scholarshipType: 'Post Matric Scholarship', community: ['SCC'], courseLevel: ['Undergraduate', 'Postgraduate', 'Diploma'],
    institutionType: ['Private College'], benefitType: 'Scholarship Amount',
    amount: 'Varies', deadline: 'Oct 15, 2025', provider: 'Government of Tamil Nadu',
    desc: 'State special post matric scholarship for SCC students pursuing studies in private institutions.',
    eligibility: 'SCC students in post-matric courses in private colleges.',
    gradient: 'from-sky-500 to-blue-600', glow: 'rgba(14,165,233,0.3)'
  },
  {
    id: 'sc-govt-tfc', name: 'SC-Government-Tuition Fee Concession',
    department: 'Adi Dravidar And Tribal Welfare Department', subDepartment: 'Adi Dravidar Welfare',
    scholarshipType: 'Tuition Fee Concession', community: ['SC'], courseLevel: ['Undergraduate', 'Postgraduate', 'Professional Course'],
    institutionType: ['Government College', 'Government Aided College'], benefitType: 'Tuition Fee Waiver',
    amount: 'Full Tuition', deadline: 'Oct 30, 2025', provider: 'Government of Tamil Nadu',
    desc: 'Full tuition fee concession for SC students studying in Government and Aided colleges.',
    eligibility: 'SC students, no income limit for Govt colleges.',
    gradient: 'from-violet-500 to-purple-600', glow: 'rgba(139,92,246,0.3)'
  },
  {
    id: 'scc-govt-tfc', name: 'SCC-Government-Tuition Fee Concession',
    department: 'Adi Dravidar And Tribal Welfare Department', subDepartment: 'Adi Dravidar Welfare',
    scholarshipType: 'Tuition Fee Concession', community: ['SCC'], courseLevel: ['Undergraduate', 'Postgraduate', 'Professional Course'],
    institutionType: ['Government College', 'Government Aided College'], benefitType: 'Tuition Fee Waiver',
    amount: 'Full Tuition', deadline: 'Oct 30, 2025', provider: 'Government of Tamil Nadu',
    desc: 'Full tuition fee concession for SCC students studying in Government and Aided colleges.',
    eligibility: 'SCC students, no income limit for Govt colleges.',
    gradient: 'from-violet-500 to-purple-600', glow: 'rgba(139,92,246,0.3)'
  },
  {
    id: 'sc-free-ug', name: 'SC-Free Education-Concessions to the Under Graduate Students',
    department: 'Adi Dravidar And Tribal Welfare Department', subDepartment: 'Adi Dravidar Welfare',
    scholarshipType: 'Free Education Scheme', community: ['SC'], courseLevel: ['Undergraduate'],
    institutionType: ['Government College', 'Government Aided College', 'Private College'], benefitType: 'Full Fee Concession',
    amount: 'Full Fee', deadline: 'Sep 30, 2025', provider: 'Government of Tamil Nadu',
    desc: 'Free education scheme for SC students pursuing UG degree courses.',
    eligibility: 'SC students enrolling in 3-year UG courses. First generation learner preference.',
    gradient: 'from-rose-500 to-pink-600', glow: 'rgba(244,63,94,0.3)'
  },
  {
    id: 'sc-free-pg', name: 'SC-Free Education-Concessions to the Post Graduate Students',
    department: 'Adi Dravidar And Tribal Welfare Department', subDepartment: 'Adi Dravidar Welfare',
    scholarshipType: 'Free Education Scheme', community: ['SC'], courseLevel: ['Postgraduate'],
    institutionType: ['Government College', 'Government Aided College', 'Private College'], benefitType: 'Full Fee Concession',
    amount: 'Full Fee', deadline: 'Sep 30, 2025', provider: 'Government of Tamil Nadu',
    desc: 'Free education scheme for SC students pursuing PG courses.',
    eligibility: 'SC students enrolling in PG courses.',
    gradient: 'from-rose-500 to-pink-600', glow: 'rgba(244,63,94,0.3)'
  },
  {
    id: 'scc-free-ug', name: 'SCC-Free Education-Concessions to the Under Graduate Students',
    department: 'Adi Dravidar And Tribal Welfare Department', subDepartment: 'Adi Dravidar Welfare',
    scholarshipType: 'Free Education Scheme', community: ['SCC'], courseLevel: ['Undergraduate'],
    institutionType: ['Government College', 'Government Aided College', 'Private College'], benefitType: 'Full Fee Concession',
    amount: 'Full Fee', deadline: 'Sep 30, 2025', provider: 'Government of Tamil Nadu',
    desc: 'Free education scheme for SCC students pursuing UG degree courses.',
    eligibility: 'SCC students enrolling in 3-year UG courses.',
    gradient: 'from-rose-500 to-pink-600', glow: 'rgba(244,63,94,0.3)'
  },
  {
    id: 'scc-free-pg', name: 'SCC-Free Education-Concessions to the Post Graduate Students',
    department: 'Adi Dravidar And Tribal Welfare Department', subDepartment: 'Adi Dravidar Welfare',
    scholarshipType: 'Free Education Scheme', community: ['SCC'], courseLevel: ['Postgraduate'],
    institutionType: ['Government College', 'Government Aided College', 'Private College'], benefitType: 'Full Fee Concession',
    amount: 'Full Fee', deadline: 'Sep 30, 2025', provider: 'Government of Tamil Nadu',
    desc: 'Free education scheme for SCC students pursuing PG courses.',
    eligibility: 'SCC students enrolling in PG courses.',
    gradient: 'from-rose-500 to-pink-600', glow: 'rgba(244,63,94,0.3)'
  },
  {
    id: 'sc-hes', name: 'SC-Higher Education Special Scholarship',
    department: 'Adi Dravidar And Tribal Welfare Department', subDepartment: 'Adi Dravidar Welfare',
    scholarshipType: 'Higher Education Scholarship', community: ['SC'], courseLevel: ['Undergraduate', 'Postgraduate', 'Professional Course'],
    institutionType: ['Government College', 'Government Aided College'], benefitType: 'Educational Assistance',
    amount: '₹8,000/year', deadline: 'Nov 30, 2025', provider: 'Government of Tamil Nadu',
    desc: 'Special scholarship for SC students residing in hostels and pursuing higher education.',
    eligibility: 'SC students, family income below ₹2.5 Lakh, must be hosteller.',
    gradient: 'from-emerald-500 to-teal-500', glow: 'rgba(16,185,129,0.3)'
  },
  {
    id: 'sc-goi-pmss', name: 'SC-GOI-PMSS',
    department: 'Adi Dravidar And Tribal Welfare Department', subDepartment: 'Adi Dravidar Welfare',
    scholarshipType: 'GOI-PMSS', community: ['SC'], courseLevel: ['Undergraduate', 'Postgraduate', 'Professional Course', 'Diploma'],
    institutionType: ['Government College', 'Government Aided College', 'Private College'], benefitType: 'Scholarship Amount',
    amount: 'Varies', deadline: 'Oct 31, 2025', provider: 'Government of India',
    desc: 'Government of India Post Matric Scholarship Scheme for SC students.',
    eligibility: 'SC students, family income below ₹2.5 Lakh.',
    gradient: 'from-amber-400 to-orange-500', glow: 'rgba(245,158,11,0.3)'
  },

  // TRIBAL WELFARE
  {
    id: 'st-goi-pmss-pvt', name: 'ST-GOI-PMSS-Private',
    department: 'Adi Dravidar And Tribal Welfare Department', subDepartment: 'Tribal Welfare',
    scholarshipType: 'GOI-PMSS', community: ['ST'], courseLevel: ['Undergraduate', 'Postgraduate', 'Professional Course', 'Diploma'],
    institutionType: ['Private College'], benefitType: 'Scholarship Amount',
    amount: 'Varies', deadline: 'Oct 31, 2025', provider: 'Government of India',
    desc: 'GOI Post Matric Scholarship Scheme for ST students in private colleges.',
    eligibility: 'ST students, family income below ₹2.5 Lakh.',
    gradient: 'from-amber-400 to-orange-500', glow: 'rgba(245,158,11,0.3)'
  },
  {
    id: 'st-govt-tfc', name: 'ST-Government-Tuition Fee Concession',
    department: 'Adi Dravidar And Tribal Welfare Department', subDepartment: 'Tribal Welfare',
    scholarshipType: 'Tuition Fee Concession', community: ['ST'], courseLevel: ['Undergraduate', 'Postgraduate', 'Professional Course'],
    institutionType: ['Government College', 'Government Aided College'], benefitType: 'Tuition Fee Waiver',
    amount: 'Full Tuition', deadline: 'Oct 30, 2025', provider: 'Government of Tamil Nadu',
    desc: 'Full tuition fee concession for ST students studying in Government and Aided colleges.',
    eligibility: 'ST students, no income limit for Govt colleges.',
    gradient: 'from-violet-500 to-purple-600', glow: 'rgba(139,92,246,0.3)'
  },
  {
    id: 'st-free-ug', name: 'ST-Free Education-Concessions to the Under Graduate Students',
    department: 'Adi Dravidar And Tribal Welfare Department', subDepartment: 'Tribal Welfare',
    scholarshipType: 'Free Education Scheme', community: ['ST'], courseLevel: ['Undergraduate'],
    institutionType: ['Government College', 'Government Aided College', 'Private College'], benefitType: 'Full Fee Concession',
    amount: 'Full Fee', deadline: 'Sep 30, 2025', provider: 'Government of Tamil Nadu',
    desc: 'Free education scheme for ST students pursuing UG degree courses.',
    eligibility: 'ST students enrolling in 3-year UG courses.',
    gradient: 'from-rose-500 to-pink-600', glow: 'rgba(244,63,94,0.3)'
  },
  {
    id: 'st-free-pg', name: 'ST-Free Education-Concessions to the Post Graduate Students',
    department: 'Adi Dravidar And Tribal Welfare Department', subDepartment: 'Tribal Welfare',
    scholarshipType: 'Free Education Scheme', community: ['ST'], courseLevel: ['Postgraduate'],
    institutionType: ['Government College', 'Government Aided College', 'Private College'], benefitType: 'Full Fee Concession',
    amount: 'Full Fee', deadline: 'Sep 30, 2025', provider: 'Government of Tamil Nadu',
    desc: 'Free education scheme for ST students pursuing PG courses.',
    eligibility: 'ST students enrolling in PG courses.',
    gradient: 'from-rose-500 to-pink-600', glow: 'rgba(244,63,94,0.3)'
  },
  {
    id: 'st-hes', name: 'ST-Higher Education Special Scholarship',
    department: 'Adi Dravidar And Tribal Welfare Department', subDepartment: 'Tribal Welfare',
    scholarshipType: 'Higher Education Scholarship', community: ['ST'], courseLevel: ['Undergraduate', 'Postgraduate', 'Professional Course'],
    institutionType: ['Government College', 'Government Aided College'], benefitType: 'Educational Assistance',
    amount: '₹8,000/year', deadline: 'Nov 30, 2025', provider: 'Government of Tamil Nadu',
    desc: 'Special scholarship for ST students residing in hostels and pursuing higher education.',
    eligibility: 'ST students, family income below ₹2.5 Lakh, must be hosteller.',
    gradient: 'from-emerald-500 to-teal-500', glow: 'rgba(16,185,129,0.3)'
  },
  {
    id: 'st-goi-pmss-govt', name: 'ST-GOI-PMSS-Govt and Govt Aided',
    department: 'Adi Dravidar And Tribal Welfare Department', subDepartment: 'Tribal Welfare',
    scholarshipType: 'GOI-PMSS', community: ['ST'], courseLevel: ['Undergraduate', 'Postgraduate', 'Professional Course', 'Diploma'],
    institutionType: ['Government College', 'Government Aided College'], benefitType: 'Scholarship Amount',
    amount: 'Varies', deadline: 'Oct 31, 2025', provider: 'Government of India',
    desc: 'GOI Post Matric Scholarship Scheme for ST students in Govt and Aided colleges.',
    eligibility: 'ST students, family income below ₹2.5 Lakh.',
    gradient: 'from-amber-400 to-orange-500', glow: 'rgba(245,158,11,0.3)'
  },

  // BC WELFARE
  {
    id: 'bc-pmss-pvt', name: 'BC – Post Matric Scholarship Scheme in Private Colleges',
    department: 'BC Welfare Department', subDepartment: 'BC Welfare',
    scholarshipType: 'Post Matric Scholarship', community: ['BC'], courseLevel: ['Undergraduate', 'Postgraduate', 'Professional Course', 'Diploma'],
    institutionType: ['Private College'], benefitType: 'Scholarship Amount',
    amount: 'Varies', deadline: 'Nov 15, 2025', provider: 'Government of Tamil Nadu',
    desc: 'Post matric scholarship for BC students pursuing higher education in private colleges.',
    eligibility: 'BC students, family income below ₹2.5 Lakh.',
    gradient: 'from-blue-500 to-indigo-600', glow: 'rgba(59,130,246,0.3)'
  },
  {
    id: 'bc-free-prof-pvt', name: 'BC-Free Education-Professional Courses in Private Colleges',
    department: 'BC Welfare Department', subDepartment: 'BC Welfare',
    scholarshipType: 'Free Education Scheme', community: ['BC'], courseLevel: ['Professional Course'],
    institutionType: ['Private College'], benefitType: 'Tuition Fee Waiver',
    amount: 'Tuition Fee Waiver', deadline: 'Nov 15, 2025', provider: 'Government of Tamil Nadu',
    desc: 'Free education scheme for BC students pursuing professional courses in private colleges (First Graduate).',
    eligibility: 'BC students, First Graduate only, income below ₹2.5 Lakh.',
    gradient: 'from-cyan-500 to-blue-600', glow: 'rgba(6,182,212,0.3)'
  },
  {
    id: 'bc-pmss-govt', name: 'BC – Post Matric Scholarship Scheme in Govt. and Govt. Aided Colleges',
    department: 'BC Welfare Department', subDepartment: 'BC Welfare',
    scholarshipType: 'Post Matric Scholarship', community: ['BC'], courseLevel: ['Undergraduate', 'Postgraduate', 'Professional Course', 'Diploma'],
    institutionType: ['Government College', 'Government Aided College'], benefitType: 'Scholarship Amount',
    amount: 'Varies', deadline: 'Nov 15, 2025', provider: 'Government of Tamil Nadu',
    desc: 'Post matric scholarship for BC students in Government and Aided colleges.',
    eligibility: 'BC students, family income below ₹2.5 Lakh.',
    gradient: 'from-blue-500 to-indigo-600', glow: 'rgba(59,130,246,0.3)'
  },
  {
    id: 'bc-free-ug-govt', name: 'BC-Free Education (3 Years UG Course in Govt. and Govt. Aided Colleges)',
    department: 'BC Welfare Department', subDepartment: 'BC Welfare',
    scholarshipType: 'Free Education Scheme', community: ['BC'], courseLevel: ['Undergraduate'],
    institutionType: ['Government College', 'Government Aided College'], benefitType: 'Full Fee Concession',
    amount: 'Full Fee', deadline: 'Nov 15, 2025', provider: 'Government of Tamil Nadu',
    desc: 'Free education for 3-year UG courses for BC students in Govt/Aided colleges.',
    eligibility: 'BC students pursuing 3-year UG degree, no income limit.',
    gradient: 'from-cyan-500 to-blue-600', glow: 'rgba(6,182,212,0.3)'
  },
  {
    id: 'bc-free-dip-govt', name: 'BC-Free Education (Diploma Course in Govt. and Govt. Aided Colleges)',
    department: 'BC Welfare Department', subDepartment: 'BC Welfare',
    scholarshipType: 'Free Education Scheme', community: ['BC'], courseLevel: ['Diploma'],
    institutionType: ['Government College', 'Government Aided College'], benefitType: 'Full Fee Concession',
    amount: 'Full Fee', deadline: 'Nov 15, 2025', provider: 'Government of Tamil Nadu',
    desc: 'Free education for Diploma courses for BC students in Govt/Aided colleges.',
    eligibility: 'BC students pursuing Diploma, no income limit.',
    gradient: 'from-cyan-500 to-blue-600', glow: 'rgba(6,182,212,0.3)'
  },
  {
    id: 'bc-free-prof-govt', name: 'BC – Free Education (Professional Courses) in Govt. and Govt. Aided Colleges',
    department: 'BC Welfare Department', subDepartment: 'BC Welfare',
    scholarshipType: 'Free Education Scheme', community: ['BC'], courseLevel: ['Professional Course'],
    institutionType: ['Government College', 'Government Aided College'], benefitType: 'Full Fee Concession',
    amount: 'Full Fee', deadline: 'Nov 15, 2025', provider: 'Government of Tamil Nadu',
    desc: 'Free education for Professional courses for BC students in Govt/Aided colleges.',
    eligibility: 'BC students pursuing Professional courses, no income limit.',
    gradient: 'from-cyan-500 to-blue-600', glow: 'rgba(6,182,212,0.3)'
  },

  // MBC WELFARE
  {
    id: 'mbc-free-ug-govt', name: 'MBC-Free Education (3 Years UG Course in Govt. and Govt. Aided Colleges)',
    department: 'BC Welfare Department', subDepartment: 'MBC Welfare',
    scholarshipType: 'Free Education Scheme', community: ['MBC'], courseLevel: ['Undergraduate'],
    institutionType: ['Government College', 'Government Aided College'], benefitType: 'Full Fee Concession',
    amount: 'Full Fee', deadline: 'Nov 15, 2025', provider: 'Government of Tamil Nadu',
    desc: 'Free education for 3-year UG courses for MBC students in Govt/Aided colleges.',
    eligibility: 'MBC students pursuing 3-year UG degree, no income limit.',
    gradient: 'from-fuchsia-500 to-pink-600', glow: 'rgba(217,70,239,0.3)'
  },
  {
    id: 'mbc-pmss-govt', name: 'MBC – Post Matric Scholarship Scheme in Govt. and Govt. Aided Colleges',
    department: 'BC Welfare Department', subDepartment: 'MBC Welfare',
    scholarshipType: 'Post Matric Scholarship', community: ['MBC'], courseLevel: ['Undergraduate', 'Postgraduate', 'Professional Course', 'Diploma'],
    institutionType: ['Government College', 'Government Aided College'], benefitType: 'Scholarship Amount',
    amount: 'Varies', deadline: 'Nov 15, 2025', provider: 'Government of Tamil Nadu',
    desc: 'Post matric scholarship for MBC students in Government and Aided colleges.',
    eligibility: 'MBC students, family income below ₹2.5 Lakh.',
    gradient: 'from-purple-500 to-fuchsia-600', glow: 'rgba(168,85,247,0.3)'
  },
  {
    id: 'mbc-free-prof-pvt', name: 'MBC-Free Education-Professional Courses in Private Colleges',
    department: 'BC Welfare Department', subDepartment: 'MBC Welfare',
    scholarshipType: 'Free Education Scheme', community: ['MBC'], courseLevel: ['Professional Course'],
    institutionType: ['Private College'], benefitType: 'Tuition Fee Waiver',
    amount: 'Tuition Fee Waiver', deadline: 'Nov 15, 2025', provider: 'Government of Tamil Nadu',
    desc: 'Free education scheme for MBC students pursuing professional courses in private colleges (First Graduate).',
    eligibility: 'MBC students, First Graduate only, income below ₹2.5 Lakh.',
    gradient: 'from-fuchsia-500 to-pink-600', glow: 'rgba(217,70,239,0.3)'
  },
  {
    id: 'mbc-pmss-pvt', name: 'MBC – Post Matric Scholarship Scheme in Private Colleges',
    department: 'BC Welfare Department', subDepartment: 'MBC Welfare',
    scholarshipType: 'Post Matric Scholarship', community: ['MBC'], courseLevel: ['Undergraduate', 'Postgraduate', 'Professional Course', 'Diploma'],
    institutionType: ['Private College'], benefitType: 'Scholarship Amount',
    amount: 'Varies', deadline: 'Nov 15, 2025', provider: 'Government of Tamil Nadu',
    desc: 'Post matric scholarship for MBC students pursuing higher education in private colleges.',
    eligibility: 'MBC students, family income below ₹2.5 Lakh.',
    gradient: 'from-purple-500 to-fuchsia-600', glow: 'rgba(168,85,247,0.3)'
  },
  {
    id: 'mbc-free-prof-govt', name: 'MBC – Free Education (Professional Courses) in Govt. and Govt. Aided Colleges',
    department: 'BC Welfare Department', subDepartment: 'MBC Welfare',
    scholarshipType: 'Free Education Scheme', community: ['MBC'], courseLevel: ['Professional Course'],
    institutionType: ['Government College', 'Government Aided College'], benefitType: 'Full Fee Concession',
    amount: 'Full Fee', deadline: 'Nov 15, 2025', provider: 'Government of Tamil Nadu',
    desc: 'Free education for Professional courses for MBC students in Govt/Aided colleges.',
    eligibility: 'MBC students pursuing Professional courses, no income limit.',
    gradient: 'from-fuchsia-500 to-pink-600', glow: 'rgba(217,70,239,0.3)'
  },
  {
    id: 'mbc-free-dip-govt', name: 'MBC-Free Education (Diploma Course in Govt. and Govt. Aided Colleges)',
    department: 'BC Welfare Department', subDepartment: 'MBC Welfare',
    scholarshipType: 'Free Education Scheme', community: ['MBC'], courseLevel: ['Diploma'],
    institutionType: ['Government College', 'Government Aided College'], benefitType: 'Full Fee Concession',
    amount: 'Full Fee', deadline: 'Nov 15, 2025', provider: 'Government of Tamil Nadu',
    desc: 'Free education for Diploma courses for MBC students in Govt/Aided colleges.',
    eligibility: 'MBC students pursuing Diploma, no income limit.',
    gradient: 'from-fuchsia-500 to-pink-600', glow: 'rgba(217,70,239,0.3)'
  }
]

/* ─────────────────────────────────────────────────────────
   FILTER OPTIONS
───────────────────────────────────────────────────────── */
const COMMUNITIES = ['All', 'SC', 'SCC', 'ST', 'BC', 'MBC']
const DEPARTMENTS = ['All', 'Adi Dravidar And Tribal Welfare Department', 'BC Welfare Department']
const SUB_DEPARTMENTS = ['All', 'Adi Dravidar Welfare', 'Tribal Welfare', 'BC Welfare', 'MBC Welfare']
const COURSE_LEVELS = ['All', 'Diploma', 'Undergraduate', 'Postgraduate', 'Professional Course']
const INSTITUTION_TYPES = ['All', 'Government College', 'Government Aided College', 'Private College']
const SCHOLARSHIP_TYPES = ['All', 'Post Matric Scholarship', 'Higher Education Scholarship', 'Tuition Fee Concession', 'Free Education Scheme', 'GOI-PMSS', 'Special Scholarship']
const STATUSES = ['All', 'Eligible', 'Partially Eligible', 'Not Eligible']
const PRIORITIES = ['All', 'High Priority', 'Medium Priority', 'Low Priority']
const MATCH_RANGES = ['All', '90% – 100%', '80% – 89%', '70% – 79%', 'Below 70%']
const BENEFIT_TYPES = ['All', 'Tuition Fee Waiver', 'Scholarship Amount', 'Educational Assistance', 'Full Fee Concession']

/* ── Scholarship Card ────────────────────────────────────── */
function ScholarshipCard({ scholarship, delay, onSave, saved, onClickCard }) {
  const isHighPriority = scholarship.priority === 'High Priority'
  const timerRef = useRef(null)

  const handleClick = (e) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
      onSave()
    } else {
      timerRef.current = setTimeout(() => {
        timerRef.current = null
        onClickCard(scholarship)
      }, 250)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, type: 'spring', stiffness: 200 }}
      className="bg-white rounded-2xl border border-neutral-100 overflow-hidden group hover:shadow-md transition-all relative cursor-pointer"
      style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}
      onClick={handleClick}
    >
      {/* Top gradient bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${scholarship.gradient}`} />

      {/* Recommended Badge */}
      {isHighPriority && (
        <div className="absolute top-3 right-3 bg-brand-50 border border-brand-200 text-brand-600 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
          <Star size={10} className="fill-brand-500 text-brand-500" /> Recommended
        </div>
      )}

      {/* Wishlist indicator */}
      <motion.div
        key={`heart-${saved}`}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`absolute top-12 right-5 w-8 h-8 rounded-full flex items-center justify-center border shadow-sm transition-all z-10 ${
          saved ? 'bg-rose-50 border-rose-200' : 'bg-white border-neutral-200'
        }`}
        onClick={(e) => {
          e.stopPropagation()
          if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
          }
          onSave()
        }}
      >
        <Heart size={14} className={saved ? 'text-rose-500 fill-rose-500' : 'text-neutral-300'} />
      </motion.div>

      <div className="p-5">
        <div className="flex items-start gap-3 mb-3 pr-24">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${scholarship.gradient} flex items-center justify-center text-white shrink-0`}
            style={{ boxShadow: `0 4px 12px ${scholarship.glow}` }}>
            <Landmark size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-black text-neutral-900 group-hover:text-brand-700 transition-colors leading-snug">{scholarship.name}</h3>
            <p className="text-[10px] text-neutral-500 font-bold mt-1 line-clamp-1">{scholarship.department} · {scholarship.subDepartment}</p>
          </div>
        </div>

        <p className="text-[11px] text-neutral-600 leading-relaxed mb-4 line-clamp-2">{scholarship.desc}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <DollarSign size={13} className="text-emerald-500" />
            <span className="text-sm font-black text-emerald-600">{scholarship.benefitType}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className="text-neutral-400" />
            <span className="text-[10px] font-bold text-neutral-500">{scholarship.deadline}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
          <div className="flex items-center gap-2">
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
              scholarship.statusCategory === 'Eligible' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' :
              scholarship.statusCategory === 'Partially Eligible' ? 'text-amber-600 bg-amber-50 border-amber-100' :
              'text-rose-600 bg-rose-50 border-rose-100'
            }`}>
              {scholarship.statusCategory}
            </span>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border bg-neutral-50 border-neutral-200 text-neutral-600 truncate max-w-[100px]">
              {scholarship.scholarshipType}
            </span>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold text-neutral-400">Match Score</span>
              <span className={`text-xs font-black ${scholarship.aiScore >= 90 ? 'text-brand-600' : scholarship.aiScore >= 80 ? 'text-blue-600' : 'text-neutral-600'}`}>
                {scholarship.aiScore}%
              </span>
            </div>
            <div className="w-16 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${scholarship.aiScore}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className={`h-full rounded-full bg-gradient-to-r ${scholarship.gradient}`}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ScholarshipModal({ scholarship, onClose, onSave, saved }) {
  if (!scholarship) return null

  return createPortal(
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ y: 50, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }}
          className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative"
          onClick={e => e.stopPropagation()}
        >
          <div className={`h-4 w-full bg-gradient-to-r ${scholarship.gradient}`} />
          
          <div className="absolute top-8 right-6 z-20">
            <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-sm transition-colors shadow-sm">
              <ChevronLeft size={16} /> Go Back
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-hide" data-lenis-prevent="true">
            <div className="flex items-start gap-4 mb-6 pr-12">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${scholarship.gradient} flex items-center justify-center text-white shrink-0 shadow-lg`}
                style={{ boxShadow: `0 8px 24px ${scholarship.glow}` }}>
                <Landmark size={28} />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-neutral-900 leading-tight mb-2">{scholarship.name}</h2>
                <p className="text-xs font-bold text-neutral-500">{scholarship.department} · {scholarship.subDepartment}</p>
              </div>
            </div>

            <p className="text-sm text-neutral-600 leading-relaxed mb-8">{scholarship.desc}</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <p className="text-[10px] font-black text-neutral-400 uppercase mb-2">Community</p>
                <div className="flex flex-wrap gap-1.5">
                  {scholarship.community.map(c => (
                    <span key={c} className="text-xs font-bold px-2.5 py-1 rounded-md bg-neutral-50 border border-neutral-200 text-neutral-700">{c}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-neutral-400 uppercase mb-2">Course Level</p>
                <div className="flex flex-wrap gap-1.5">
                  {scholarship.courseLevel.map(c => (
                    <span key={c} className="text-xs font-bold px-2.5 py-1 rounded-md bg-neutral-50 border border-neutral-200 text-neutral-700">{c}</span>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-black text-neutral-400 uppercase mb-2">Institution Types</p>
                <p className="text-sm font-medium text-neutral-700">{scholarship.institutionType.join(', ')}</p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-neutral-100 shadow-sm mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Brain size={16} className="text-brand-500" />
                <p className="text-xs font-black text-brand-600 uppercase tracking-widest">AI Eligibility Analysis</p>
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed mb-4">{scholarship.eligibility}</p>
              <div className="flex flex-wrap items-center justify-between text-xs font-bold border-t border-neutral-50 pt-3">
                <span className="text-neutral-500">Breakdown:</span>
                <span className="text-emerald-600">Community (+40%)</span>
                <span className="text-emerald-600">Course (+30%)</span>
                <span className="text-emerald-600">Institution (+30%)</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={(e) => { e.stopPropagation(); onSave(); }}
                className={`flex-1 py-3.5 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  saved ? 'bg-brand-50 border-brand-200 text-brand-600' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <Bookmark size={16} className={saved ? 'fill-brand-500' : ''} />
                {saved ? 'Saved to Wishlist' : 'Save to Wishlist'}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); alert('Redirecting to application portal...') }}
                className={`flex-1 py-3.5 rounded-xl bg-gradient-to-r ${scholarship.gradient} text-white text-sm font-bold shadow-md flex items-center justify-center gap-2 hover:opacity-90`}
              >
                Apply Now <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}

/* ── Main Scholarships Page ──────────────────────────────── */
export default function Scholarships() {
  const { student, wishlistScholarships, addToWishlist, removeFromWishlist } = useStudentStore()
  const collapsed = useThemeStore((s) => s.sidebarCollapsed)
  
  // Derive course level from student standard
  const deriveCourseLevel = (standard) => {
    const s = (standard || '').toLowerCase()
    if (s.includes('ug') || s.includes('degree') || s.includes('b.e') || s.includes('b.tech')) return 'Undergraduate'
    if (s.includes('pg') || s.includes('m.e') || s.includes('m.tech') || s.includes('mba')) return 'Postgraduate'
    if (s.includes('diploma') || s.includes('polytechnic')) return 'Diploma'
    if (s.includes('12') || s.includes('hsc') || s.includes('+2')) return 'Undergraduate' // About to enter UG
    if (s.includes('10') || s.includes('sslc')) return 'Diploma' // Might pursue Diploma
    if (s.includes('phd') || s.includes('research')) return 'Postgraduate'
    return 'Undergraduate'
  }

  // Derived Student Profile State for AI Engine Evaluation
  const mockProfile = {
    community: student.community || 'BC',
    gender: student.gender || 'Female',
    annualFamilyIncome: student.annualFamilyIncome || 200000,
    courseLevel: deriveCourseLevel(student.standard),
    courseType: 'Regular',
    institutionType: student.institutionTypePref || 'Government College',
    academicPerformance: 85,
    firstGraduateStatus: student.firstGraduateStatus || false,
    disabilityStatus: false,
    district: student.district || 'Chennai',
    yearOfStudy: 1
  }

  // Filters State — pre-fill community from student profile
  const [search, setSearch] = useState('')
  const [selectedCommunity, setSelectedCommunity] = useState(
    student.community && student.community !== '' ? student.community : 'All'
  )
  const [selectedDepartment, setSelectedDepartment] = useState('All')
  const [selectedSubDept, setSelectedSubDept] = useState('All')

  const [selectedCourseLevel, setSelectedCourseLevel] = useState('All')
  const [selectedInstType, setSelectedInstType] = useState('All')
  const [selectedSchType, setSelectedSchType] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedPriority, setSelectedPriority] = useState('All')
  const [selectedMatch, setSelectedMatch] = useState('All')
  const [selectedBenefit, setSelectedBenefit] = useState('All')
  
  const [showFilters, setShowFilters] = useState(false)
  const [selectedScholarship, setSelectedScholarship] = useState(null)

  const handleSave = (scholarship) => {
    const isAlreadySaved = wishlistScholarships.find(s => s.id === scholarship.id)
    if (isAlreadySaved) {
      removeFromWishlist('Scholarships', scholarship.id)
    } else {
      addToWishlist('Scholarships', {
        id: scholarship.id,
        name: scholarship.name,
        desc: scholarship.desc,
        amount: scholarship.amount,
        domain: scholarship.department,
      })
    }
  }

  /* ─────────────────────────────────────────────────────────
     AI SCHOLARSHIP RECOMMENDATION ENGINE
  ───────────────────────────────────────────────────────── */
  const evaluatedScholarships = useMemo(() => {
    return SCHOLARSHIPS.map(s => {
      let score = 0;
      
      // Community Match (Critical, 40 points)
      let commMatch = false;
      if (s.community.includes(mockProfile.community)) {
        score += 40;
        commMatch = true;
      } else if (mockProfile.community === 'MBC' && s.community.includes('BC')) {
        score += 20; // Partial related match
      }

      // Course Level Match (30 points)
      let courseMatch = false;
      if (s.courseLevel.includes(mockProfile.courseLevel)) {
        score += 30;
        courseMatch = true;
      }

      // Institution Match (30 points)
      let instMatch = false;
      if (s.institutionType.includes(mockProfile.institutionType)) {
        score += 30;
        instMatch = true;
      }
      
      // First Graduate bonus
      if (mockProfile.firstGraduateStatus && s.desc.includes('First Graduate')) score = Math.min(100, score + 10);
      
      // Final deductions if critical mismatch
      if (!commMatch) score = Math.min(score, 65); // Cap if wrong community

      // Classifications
      let priority = 'Low Priority';
      let statusCategory = 'Not Eligible';
      
      if (score >= 90) { priority = 'High Priority'; statusCategory = 'Eligible'; }
      else if (score >= 80) { priority = 'Medium Priority'; statusCategory = 'Eligible'; }
      else if (score >= 70) { priority = 'Medium Priority'; statusCategory = 'Partially Eligible'; }
      else { priority = 'Low Priority'; statusCategory = 'Not Eligible'; }

      return {
        ...s,
        aiScore: score,
        priority,
        statusCategory
      }
    }).sort((a, b) => b.aiScore - a.aiScore)
  }, [student])

  /* Filtering Logic */
  const filtered = evaluatedScholarships.filter((s) => {
    // 11. SEARCH across multiple fields
    const q = search.toLowerCase()
    const matchSearch = !q || 
      s.name.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.subDepartment.toLowerCase().includes(q) ||
      s.scholarshipType.toLowerCase().includes(q) ||
      s.community.join(',').toLowerCase().includes(q)

    if (!matchSearch) return false

    if (selectedCommunity !== 'All' && !s.community.includes(selectedCommunity)) return false
    if (selectedDepartment !== 'All' && s.department !== selectedDepartment) return false
    if (selectedSubDept !== 'All' && s.subDepartment !== selectedSubDept) return false
    if (selectedCourseLevel !== 'All' && !s.courseLevel.includes(selectedCourseLevel)) return false
    if (selectedInstType !== 'All' && !s.institutionType.includes(selectedInstType)) return false
    if (selectedSchType !== 'All' && s.scholarshipType !== selectedSchType) return false
    if (selectedStatus !== 'All' && s.statusCategory !== selectedStatus) return false
    if (selectedPriority !== 'All' && s.priority !== selectedPriority) return false
    if (selectedBenefit !== 'All' && s.benefitType !== selectedBenefit) return false

    if (selectedMatch !== 'All') {
      if (selectedMatch === '90% – 100%' && s.aiScore < 90) return false
      if (selectedMatch === '80% – 89%' && (s.aiScore < 80 || s.aiScore >= 90)) return false
      if (selectedMatch === '70% – 79%' && (s.aiScore < 70 || s.aiScore >= 80)) return false
      if (selectedMatch === 'Below 70%' && s.aiScore >= 70) return false
    }

    return true
  })

  /* Dashboard Analytics */
  const totalEligible = evaluatedScholarships.filter(s => s.statusCategory === 'Eligible').length;
  const eligibilityRate = Math.round((totalEligible / SCHOLARSHIPS.length) * 100);
  const highPriorityCount = evaluatedScholarships.filter(s => s.aiScore >= 90).length;

  return (
    <PageWrapper>
      <div className="w-full max-w-7xl mx-auto space-y-6 pb-24">
        <OnboardingPopup
          pageKey="scholarships"
          title="Find Your Scholarships"
          message="Save scholarships to your Scholarships Wishlist from any card."
          icon="🎓"
        />
        {/* Sticky Header Container */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 transition-all duration-300">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shrink-0"
              style={{ boxShadow: '0 4px 15px rgba(244,63,94,0.4)' }}>
              <GraduationCap size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-neutral-900 dark:text-neutral-100" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Scholarships
              </h1>
              <p className="text-sm text-neutral-500 font-medium">Intelligent matching based on your profile</p>
            </div>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm font-bold shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-700">
            <Users size={16} className="text-brand-500" />
            <span className="text-neutral-700 dark:text-neutral-300">Edit Profile: {mockProfile.community}, {mockProfile.courseLevel}</span>
          </button>
        </div>

        {/* Dashboard Analytics Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm text-center">
            <p className="text-3xl font-black bg-gradient-to-r from-brand-500 to-cyan-500 bg-clip-text text-transparent">{filtered.length}</p>
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-1">Matched Scholarships</p>
          </div>
          <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm text-center">
            <p className="text-3xl font-black bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">{eligibilityRate}%</p>
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-1">Eligibility Rate</p>
          </div>
          <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm text-center">
            <p className="text-3xl font-black bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">₹2.4L+</p>
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-1">Estimated Benefit Value</p>
          </div>
          <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm text-center">
            <p className="text-3xl font-black bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">{highPriorityCount}</p>
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-1">High Priority</p>
          </div>
        </motion.div>

        {/* AI Insight */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-2xl bg-gradient-to-r from-brand-50 to-violet-50 border border-brand-100 flex items-start gap-4 shadow-sm"
        >
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
            <Brain size={20} className="text-brand-500" />
          </div>
          <div>
            <p className="text-xs font-black text-brand-800 uppercase tracking-widest mb-1">AI Insights Generated</p>
            <div className="text-sm text-brand-700 font-medium leading-relaxed space-y-1">
              <p>• You are eligible for <b>{totalEligible}</b> scholarships under <b>{mockProfile.community} Welfare</b>.</p>
              {mockProfile.institutionType === 'Government College' && <p>• Government college students receive higher fee concessions.</p>}
              <p>• Professional course scholarships provide the highest benefit value.</p>
              <p>• You have <b>{highPriorityCount} highly recommended</b> scholarships to apply for immediately.</p>
            </div>
          </div>
        </motion.div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search across names, departments, or types..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-neutral-200 bg-white text-sm font-bold text-neutral-700 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50 transition-all shadow-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl border font-bold text-sm transition-all shadow-sm ${
              showFilters ? 'bg-brand-50 border-brand-200 text-brand-700' : 'bg-white border-neutral-200 text-neutral-700 hover:border-brand-300'
            }`}
          >
            <SlidersHorizontal size={18} /> Filters
          </button>
        </div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-xl relative mt-2">
                <button onClick={() => setShowFilters(false)} className="absolute top-4 right-4 p-2 text-neutral-400 hover:bg-neutral-100 rounded-full transition-colors">
                  <X size={16} />
                </button>
                <h3 className="text-lg font-black text-neutral-800 mb-6 flex items-center gap-2"><Filter size={18} className="text-brand-500"/> Advanced Filters</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {/* Comm */}
                  <div>
                    <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">1. Community</label>
                    <select value={selectedCommunity} onChange={e => setSelectedCommunity(e.target.value)} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-700 focus:border-brand-500 outline-none">
                      {COMMUNITIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  {/* Dept */}
                  <div>
                    <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">2. Department</label>
                    <select value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-700 focus:border-brand-500 outline-none truncate">
                      {DEPARTMENTS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  {/* Sub Dept */}
                  <div>
                    <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">3. Sub Department</label>
                    <select value={selectedSubDept} onChange={e => setSelectedSubDept(e.target.value)} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-700 focus:border-brand-500 outline-none">
                      {SUB_DEPARTMENTS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  {/* Course Level */}
                  <div>
                    <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">4. Course Level</label>
                    <select value={selectedCourseLevel} onChange={e => setSelectedCourseLevel(e.target.value)} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-700 focus:border-brand-500 outline-none">
                      {COURSE_LEVELS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  {/* Inst Type */}
                  <div>
                    <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">5. Institution Type</label>
                    <select value={selectedInstType} onChange={e => setSelectedInstType(e.target.value)} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-700 focus:border-brand-500 outline-none">
                      {INSTITUTION_TYPES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  {/* Sch Type */}
                  <div>
                    <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">6. Scholarship Type</label>
                    <select value={selectedSchType} onChange={e => setSelectedSchType(e.target.value)} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-700 focus:border-brand-500 outline-none">
                      {SCHOLARSHIP_TYPES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  {/* Status */}
                  <div>
                    <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">7. Eligibility Status</label>
                    <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-700 focus:border-brand-500 outline-none">
                      {STATUSES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  {/* Priority */}
                  <div>
                    <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">8. Priority</label>
                    <select value={selectedPriority} onChange={e => setSelectedPriority(e.target.value)} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-700 focus:border-brand-500 outline-none">
                      {PRIORITIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  {/* Match Range */}
                  <div>
                    <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">9. AI Match Range</label>
                    <select value={selectedMatch} onChange={e => setSelectedMatch(e.target.value)} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-700 focus:border-brand-500 outline-none">
                      {MATCH_RANGES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  {/* Benefit */}
                  <div>
                    <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">10. Benefit Type</label>
                    <select value={selectedBenefit} onChange={e => setSelectedBenefit(e.target.value)} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-700 focus:border-brand-500 outline-none">
                      {BENEFIT_TYPES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scholarships Grid */}
        <div className="flex items-center justify-between mt-8 mb-4 px-1">
          <h2 className="text-sm font-black text-neutral-800 uppercase tracking-widest">Recommended Schemes ({filtered.length})</h2>
          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-500" title="High Match"></span>
            <span className="w-2 h-2 rounded-full bg-blue-500" title="Medium Match"></span>
            <span className="w-2 h-2 rounded-full bg-neutral-300" title="Low Match"></span>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-start">
            {filtered.map((s, i) => (
              <ScholarshipCard 
                key={s.id} 
                scholarship={s} 
                delay={(i % 10) * 0.05} 
                onSave={() => handleSave(s)} 
                saved={!!(wishlistScholarships && wishlistScholarships.find(w => w.id === s.id))} 
                onClickCard={setSelectedScholarship}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-white rounded-3xl border border-neutral-100 shadow-sm"
          >
            <GraduationCap size={48} className="text-neutral-200 mx-auto mb-4" />
            <p className="text-lg font-black text-neutral-800">No scholarships match your filters</p>
            <p className="text-sm text-neutral-400 mt-2 font-medium">Try adjusting your advanced filter criteria</p>
          </motion.div>
        )}
      </div>

      {selectedScholarship && (
        <ScholarshipModal 
          scholarship={selectedScholarship} 
          onClose={() => setSelectedScholarship(null)} 
          onSave={() => handleSave(selectedScholarship)} 
          saved={!!(wishlistScholarships && wishlistScholarships.find(w => w.id === selectedScholarship.id))} 
        />
      )}
    </PageWrapper>
  )
}
