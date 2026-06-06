import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Sparkles, HelpCircle, ChevronDown, 
  Bot, ArrowRight, BookOpen, GraduationCap, ShieldCheck, Map 
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ParticleField from '../components/ui/ParticleField'

const CATEGORIES = [
  { id: 'all', label: 'All Questions', icon: HelpCircle },
  { id: 'counselling', label: 'Counselling & TNEA', icon: GraduationCap },
  { id: 'colleges', label: 'Colleges & Cutoffs', icon: BookOpen },
  { id: 'careers', label: 'Careers & Streams', icon: Map },
  { id: 'scholarships', label: 'Scholarships', icon: ShieldCheck },
  { id: 'ai', label: 'AI Platform', icon: Bot },
]

const FAQ_DATA = [
  {
    q: 'How does the TNEA cut-off calculation work?',
    a: 'Your TNEA cutoff is calculated out of 200 marks. The formula is: Mathematics Mark (out of 100) + (Physics Mark / 2) + (Chemistry Mark / 2). For example, if you score 90 in Maths, 80 in Physics, and 70 in Chemistry, your cutoff is 90 + 40 + 35 = 165/200.',
    category: 'colleges'
  },
  {
    q: 'What is the schedule or timeline for TNEA counselling?',
    a: 'TNEA counselling typically commences after the publication of 12th Board results. It starts with online registration and document upload, followed by certificate verification, rank publication, and then 3-4 rounds of online choice filling based on cutoff marks.',
    category: 'counselling'
  },
  {
    q: 'Can this platform submit college choices for TNEA official counselling?',
    a: 'No. This is an independent educational guidance platform designed to help you prepare, discover, and simulate options. You must perform final choice locking and college registration directly on the official TNEA portal (tneaonline.org).',
    category: 'counselling'
  },
  {
    q: 'How do B.E. Computer Science and B.Tech Information Technology compare?',
    a: 'B.E. CSE focuses heavily on core computing logic, compilers, hardware integrations, and advanced software architectures. B.Tech IT focuses more on practical application developments, database networks, and information system management. Both offer similar job prospects in tech parks.',
    category: 'careers'
  },
  {
    q: 'What are the first-generation graduate scholarship rules?',
    a: 'If you are the first student in your family to earn a professional degree, you are eligible for the First Graduate Tuition Fee Concession in Tamil Nadu. The scholarship covers tuition fees in government, aided, and self-financing engineering colleges.',
    category: 'scholarships'
  },
  {
    q: 'How accurate is the AI Career Mentor recommendation engine?',
    a: 'Our AI model maps your specific board grades, logical strengths, regional boundaries, and interests to TNEA counseling choice directories. It currently achieves a 96% career compatibility mapping index based on feedback from top engineering graduates.',
    category: 'ai'
  },
  {
    q: 'Are government and private colleges both included in college search?',
    a: 'Yes, our platform catalogs all top tier-1 and tier-2 institutions across Tamil Nadu (including CEG, PSG, SSN, GCT, and MIT) categorized by placements, community cutoff marks, and annual fee budgets.',
    category: 'colleges'
  },
  {
    q: 'Can parents use the dashboard to check progress?',
    a: 'Absolutely! We designed the platform to support students and parents together. The dashboard lets parents review cutoffs, check scholarship matches, and explore career timelines dynamically.',
    category: 'ai'
  }
]

export default function FAQ() {
  const navigate = useNavigate()
  const [searchVal, setSearchVal] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [expandedIndex, setExpandedIndex] = useState(null)

  const toggleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx)
  }

  // Filter logic
  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesSearch = 
      item.q.toLowerCase().includes(searchVal.toLowerCase()) || 
      item.a.toLowerCase().includes(searchVal.toLowerCase())
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen relative overflow-hidden bg-neutral-50/20 py-16 sm:py-24">
      <ParticleField count={35} />
      
      {/* Background Lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(139,92,246,0.08),transparent)]" />
        <motion.div
          animate={{ y: [-15, 15, -15], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-[500px] h-[500px] rounded-full bg-violet-100/30 blur-3xl -top-40 right-10"
        />
        <motion.div
          animate={{ y: [15, -15, 15], scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-[450px] h-[450px] rounded-full bg-brand-100/30 blur-3xl bottom-10 left-10"
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header Title */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-700 rounded-full px-4.5 py-1.5 text-xs font-black tracking-widest uppercase mb-5"
          >
            <Sparkles size={12} className="text-brand-500 animate-pulse" /> Knowledge Directory
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-neutral-900 leading-tight tracking-tight mb-5"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-violet-500 via-brand-500 to-cyan-400 bg-clip-text text-transparent">
              Questions
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-neutral-500 text-base sm:text-lg font-medium max-w-2xl mx-auto"
          >
            Instant clarification regarding counseling rounds, community quotas, cutoffs calculation, and scholarship finder guidelines.
          </motion.p>
        </div>

        {/* Live Search Engine Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative max-w-2xl mx-auto mb-10"
        >
          <div className="relative flex items-center bg-white border border-neutral-200/80 p-3 rounded-2xl focus-within:border-brand-400 focus-within:shadow-[0_0_15px_rgba(20,184,166,0.15)] focus-within:bg-white transition-all shadow-sm">
            <Search className="text-neutral-400 ml-2" size={18} />
            <input
              type="text"
              placeholder="Search by keyword (e.g. cutoff, first graduate, SSN)..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="flex-1 bg-transparent border-none text-xs font-bold text-neutral-800 placeholder-neutral-450 focus:outline-none pl-3 py-1.5"
            />
            {searchVal && (
              <button 
                onClick={() => setSearchVal('')}
                className="px-2 text-xs font-bold text-neutral-400 hover:text-neutral-600 mr-2"
              >
                Clear
              </button>
            )}
          </div>
        </motion.div>

        {/* Pill categories switcher */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-12"
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setExpandedIndex(null) }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 border ${
                  isActive 
                    ? 'bg-brand-600 dark:bg-neutral-900 border-brand-600 dark:border-neutral-900 text-white shadow-md' 
                    : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 hover:border-neutral-300'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-brand-300' : 'text-neutral-400'} />
                {cat.label}
              </button>
            )
          })}
        </motion.div>

        {/* FAQ Accordion Lists */}
        <div className="space-y-4 mb-16">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.map((faq, idx) => {
              const isExpanded = expandedIndex === idx
              return (
                <motion.div
                  key={faq.q}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl border border-neutral-150 bg-white/70 backdrop-blur-sm overflow-hidden transition-shadow duration-300"
                  style={{ boxShadow: isExpanded ? '0 8px 30px rgba(0, 0, 0, 0.03)' : 'none' }}
                >
                  <button
                    onClick={() => toggleExpand(idx)}
                    className="w-full px-6 py-5 text-left flex justify-between items-center gap-4 hover:bg-neutral-50/50 transition-colors group"
                  >
                    <h3 className="font-extrabold text-sm sm:text-base text-neutral-800 tracking-tight group-hover:text-brand-600 transition-colors">
                      {faq.q}
                    </h3>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 group-hover:text-brand-500 shrink-0"
                    >
                      <ChevronDown size={14} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 pt-1 text-xs sm:text-sm font-semibold text-neutral-600 leading-relaxed border-t border-neutral-100 bg-neutral-50/20">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {filteredFaqs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white/40 border border-dashed border-neutral-250 rounded-2xl"
            >
              <HelpCircle size={32} className="text-neutral-300 mx-auto mb-3" />
              <h4 className="font-bold text-neutral-700 text-sm">No matched questions</h4>
              <p className="text-xs text-neutral-450 mt-1">Try searching another phrase or change category.</p>
            </motion.div>
          )}
        </div>

        {/* Dynamic AI Assistant Callout */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-8 rounded-[2rem] bg-gradient-to-br from-violet-50/70 via-brand-50/50 to-cyan-50/50 border border-brand-100/40 text-center relative overflow-hidden shadow-sm"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/30 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
          
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-violet-500 flex items-center justify-center text-white mx-auto mb-5 shadow-md shadow-brand-500/10">
            <Bot size={24} className="animate-bounce" />
          </div>

          <h3 className="font-black text-xl text-neutral-900 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Don't see your specific question?
          </h3>
          <p className="text-xs text-neutral-500 font-bold max-w-lg mx-auto leading-relaxed mb-6">
            Ask our AI Career Mentor. It is customized with the latest TNEA cutoffs, counseling structures, and district placement records.
          </p>

          <button
            onClick={() => navigate('/assistant')}
            className="btn-primary py-3.5 px-8 text-xs font-black uppercase tracking-widest inline-flex items-center gap-2 shadow-glow-teal group"
          >
            Ask AI Assistant Now <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </motion.div>

      </div>
    </div>
  )
}
