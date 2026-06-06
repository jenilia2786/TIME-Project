/**
 * usePersonalization.js
 * Central hook for deriving stage-based, interest-based personalized recommendations.
 * Reads from useStudentStore and returns structured suggestion data for all pages.
 */
import { useMemo } from 'react'
import useStudentStore from '../store/useStudentStore'

/* ── Stage classifier ─────────────────────────────────────── */
export function classifyStage(standard) {
  if (!standard) return 'unknown'
  const s = standard.toLowerCase()
  if (s.includes('10')) return '10th'
  if (s.includes('11') || s.includes('12')) return '12th'
  if (s.includes('ug') || s.includes('bachelor') || s.includes('b.') || s.includes('be') || s.includes('btech')) return 'ug'
  if (s.includes('pg') || s.includes('master') || s.includes('m.') || s.includes('me') || s.includes('mtech') || s.includes('mba') || s.includes('msc')) return 'pg'
  return '12th' // default
}

/* ── Domain → branches mapping ────────────────────────────── */
const DOMAIN_BRANCHES = {
  'Computer Science': ['Computer Science and Engineering', 'Artificial Intelligence & Data Science', 'Information Technology', 'Computer Science'],
  'Electronics': ['Electronics and Communication Engineering', 'Electrical and Electronics Engineering', 'Electronics Engineering'],
  'Mechanical': ['Mechanical Engineering', 'Automobile Engineering', 'Manufacturing Engineering'],
  'Civil': ['Civil Engineering', 'Construction Engineering'],
  'Biomedical': ['Bio Medical Engineering', 'Bio Technology', 'Pharmaceutical Technology'],
  'Aerospace': ['Aeronautical Engineering', 'Aerospace Engineering'],
}

/* ── Stage-based next-step recommendations ─────────────────── */
const STAGE_RECOMMENDATIONS = {
  '10th': [
    { label: 'Science Group (PCM)', icon: '🔬', desc: 'Best for Engineering & Technology careers', link: '/careers', interest: ['science', 'maths', 'physics', 'chemistry', 'engineering'] },
    { label: 'Commerce Group', icon: '📊', desc: 'Foundation for Business, Finance & CA', link: '/careers', interest: ['commerce', 'business', 'finance'] },
    { label: 'Arts & Humanities', icon: '🎨', desc: 'Best for Law, Journalism & Social Sciences', link: '/careers', interest: ['arts', 'language', 'history', 'social'] },
    { label: 'Diploma / ITI', icon: '🔧', desc: 'Skill-based programs for quick career entry', link: '/careers', interest: [] },
    { label: 'Future Career Paths', icon: '🚀', desc: 'Explore what careers suit you best', link: '/careers', interest: [] },
  ],
  '12th': [
    { label: 'Engineering (B.E/B.Tech)', icon: '⚙️', desc: 'Top pick for Science group students', link: '/colleges', interest: ['engineering', 'science', 'technology'] },
    { label: 'Medical (MBBS/BDS)', icon: '🏥', desc: 'NEET-based medical admissions', link: '/exams', interest: ['biology', 'medical', 'health'] },
    { label: 'Entrance Exams', icon: '📝', desc: 'TNEA, JEE, NEET, CLAT and more', link: '/exams', interest: [] },
    { label: 'Scholarships', icon: '🎓', desc: 'Check your eligibility for funding', link: '/scholarships', interest: [] },
    { label: 'Career Roadmap', icon: '🗺️', desc: 'Build your personalized study plan', link: '/roadmap', interest: [] },
  ],
  'ug': [
    { label: 'PG Courses (M.E/MBA/M.Sc)', icon: '📚', desc: 'Advance your specialization', link: '/careers', interest: [] },
    { label: 'Competitive Exams', icon: '📝', desc: 'GATE, CAT, UPSC and more', link: '/exams', interest: [] },
    { label: 'Certifications', icon: '🏆', desc: 'Industry certifications to boost employability', link: '/careers', interest: [] },
    { label: 'Research Opportunities', icon: '🔬', desc: 'Research programs and fellowships', link: '/careers', interest: ['research', 'science'] },
    { label: 'Career Advancement', icon: '📈', desc: 'Top placements and career paths', link: '/careers', interest: [] },
  ],
  'pg': [
    { label: 'PhD Opportunities', icon: '🎓', desc: 'Doctoral research programs', link: '/careers', interest: ['research'] },
    { label: 'Research Careers', icon: '🔬', desc: 'Academic and industrial R&D', link: '/careers', interest: [] },
    { label: 'Fellowships', icon: '🏅', desc: 'National and international fellowships', link: '/scholarships', interest: [] },
    { label: 'Industry Roles', icon: '🏢', desc: 'Senior specialist and leadership tracks', link: '/careers', interest: [] },
    { label: 'Academic Careers', icon: '🧑‍🏫', desc: 'Teaching, research and academia', link: '/careers', interest: [] },
  ],
  'unknown': [
    { label: 'Explore Careers', icon: '🚀', desc: 'Discover career paths that suit you', link: '/careers', interest: [] },
    { label: 'Browse Colleges', icon: '🏫', desc: 'Find the best institutions in Tamil Nadu', link: '/colleges', interest: [] },
    { label: 'Scholarships', icon: '🎓', desc: 'Find funding opportunities', link: '/scholarships', interest: [] },
    { label: 'Entrance Exams', icon: '📝', desc: 'Prepare for competitive exams', link: '/exams', interest: [] },
  ],
}

/* ── Default trending items (shown when profile incomplete) ── */
export const TRENDING_BY_STAGE = {
  '10th': {
    careers: ['Science Group (PCM)', 'Commerce Group', 'Diploma Engineering', 'Arts & Humanities', 'ITI Trades'],
    exams: ['JEE Mains', 'NEET', 'CLAT', 'NDA', 'State Board 10th'],
    colleges: ['Government High Schools', 'Kendriya Vidyalayas', 'CBSE Schools'],
    desc: 'Popular paths for 10th standard students',
  },
  '12th': {
    careers: ['Engineering & Technology', 'Medicine & Healthcare', 'Commerce & Business', 'Law', 'Design'],
    exams: ['TNEA', 'JEE Main', 'NEET', 'CLAT', 'NATA', 'CUET'],
    colleges: ['Anna University Affiliated Colleges', 'IITs', 'NITs', 'AIIMS', 'NLUs'],
    desc: 'High-demand options for 12th standard students',
  },
  'ug': {
    careers: ['PG Engineering (M.E/M.Tech)', 'MBA / Management', 'Data Science & AI', 'Research & Development', 'Civil Services'],
    exams: ['GATE', 'CAT', 'GMAT', 'GRE', 'UPSC', 'TNPSC'],
    colleges: ['IITs for M.Tech', 'IIMs', 'NITs', 'Foreign Universities'],
    desc: 'Next steps for undergraduate students',
  },
  'pg': {
    careers: ['PhD Research', 'Academic / Faculty Roles', 'Senior Industry Roles', 'Consulting', 'Entrepreneurship'],
    exams: ['UGC NET', 'CSIR NET', 'JEST', 'JAM'],
    colleges: ['Research Institutes', 'IISc Bangalore', 'TIFR', 'IITs'],
    desc: 'Advanced opportunities for postgraduate students',
  },
  'unknown': {
    careers: ['Software Engineering', 'Data Science', 'Medicine & Healthcare', 'Commerce & Finance', 'Law'],
    exams: ['TNEA', 'JEE Main', 'NEET', 'GATE', 'CAT'],
    colleges: ['Top Tamil Nadu Engineering Colleges', 'IITs', 'IIMs'],
    desc: 'Trending choices across all student levels',
  },
}

/* ── Main hook ────────────────────────────────────────────── */
export default function usePersonalization() {
  const { student, profileCompletion, computedCutoff, selectedCareerOption } = useStudentStore()

  return useMemo(() => {
    const stage = classifyStage(student.standard)
    const interests = (student.interests || []).map(i => i.toLowerCase())
    const careerGoals = (student.careerGoals || []).map(g => g.toLowerCase())
    const strongSubjects = (student.strongSubjects || []).map(s => s.toLowerCase())
    const hasProfile = profileCompletion >= 30

    // Stage-based next steps, filtered by interest if available
    const allNextSteps = STAGE_RECOMMENDATIONS[stage] || STAGE_RECOMMENDATIONS['unknown']
    const nextSteps = interests.length > 0
      ? allNextSteps.sort((a, b) => {
          const aMatch = a.interest.some(i => interests.some(ui => ui.includes(i) || i.includes(ui)))
          const bMatch = b.interest.some(i => interests.some(ui => ui.includes(i) || i.includes(ui)))
          return bMatch - aMatch
        })
      : allNextSteps

    // Recommended branches based on interest/career goals
    const recommendedBranches = []
    const allInterestTokens = [...interests, ...careerGoals, ...strongSubjects]
    for (const [domain, branches] of Object.entries(DOMAIN_BRANCHES)) {
      const domainLower = domain.toLowerCase()
      if (allInterestTokens.some(t => t.includes(domainLower) || domainLower.includes(t))) {
        recommendedBranches.push(...branches)
      }
    }

    // Trending defaults (for pages with no profile data)
    const trending = TRENDING_BY_STAGE[stage] || TRENDING_BY_STAGE['unknown']

    return {
      stage,
      hasProfile,
      nextSteps,
      recommendedBranches: [...new Set(recommendedBranches)],
      trending,
      student,
      profileCompletion,
      computedCutoff,
      selectedCareerOption,
      interests,
      careerGoals,
      strongSubjects,
    }
  }, [student, profileCompletion, computedCutoff, selectedCareerOption])
}
