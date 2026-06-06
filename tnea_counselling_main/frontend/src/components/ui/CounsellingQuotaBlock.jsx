import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronDown, CheckCircle, Users } from 'lucide-react'

const COUNSELLING_DATA = [
  {
    domain: 'Engineering & Technology',
    emoji: '⚙️',
    system: 'TNEA',
    fullName: 'Tamil Nadu Engineering Admissions',
    body: 'Anna University',
    color: 'from-teal-500 to-cyan-500',
    accent: '#14b8a6',
    steps: ['Apply online at tneaonline.in', 'Upload marks & community certificates', 'Cutoff-based rank list published', 'Choose college & branch in counselling'],
    link: 'tneaonline.in',
  },
  {
    domain: 'Medicine & Healthcare',
    emoji: '🏥',
    system: 'NEET Counselling',
    fullName: 'National Eligibility cum Entrance Test',
    body: 'Medical Counselling Committee (MCC)',
    color: 'from-rose-500 to-pink-500',
    accent: '#f43f5e',
    steps: ['Clear NEET UG exam', 'Register on mcc.nic.in', 'Fill college & course preferences', 'Allotment based on NEET score & category'],
    link: 'mcc.nic.in',
  },
  {
    domain: 'Law',
    emoji: '⚖️',
    system: 'CLAT / TSLAT',
    fullName: 'Common Law Admission Test',
    body: 'Consortium of NLUs / Tamil Nadu Bar Council',
    color: 'from-indigo-500 to-blue-600',
    accent: '#6366f1',
    steps: ['Apply for CLAT for NLUs nationally', 'TSLAT for Tamil Nadu law colleges', 'Merit-based seat allotment', 'Attend document verification'],
    link: 'consortiumofnlus.ac.in',
  },
  {
    domain: 'Agriculture & Related',
    emoji: '🌾',
    system: 'TANUVAS / TN Agri',
    fullName: 'Tamil Nadu Agri University Admissions',
    body: 'TANUVAS & Tamil Nadu Agricultural University',
    color: 'from-green-500 to-lime-500',
    accent: '#22c55e',
    steps: ['Apply through TANUVAS portal', 'Separate entrance for some courses', 'Community-wise seat allocation', 'Document verification & joining'],
    link: 'tanuvas.ac.in',
  },
  {
    domain: 'Arts, Commerce & Science',
    emoji: '🎓',
    system: 'TNAU / Single Window',
    fullName: 'Tamil Nadu Collegiate Education Single Window',
    body: 'Directorate of Collegiate Education (DCE)',
    color: 'from-violet-500 to-purple-500',
    accent: '#8b5cf6',
    steps: ['Register on TNEA / DCE portal', 'Submit 12th mark sheet', 'Merit-based college allotment', 'Join within deadline'],
    link: 'tamilnadu.gov.in',
  },
  {
    domain: 'Aviation',
    emoji: '✈️',
    system: 'DGCA / Direct Admission',
    fullName: 'Directorate General of Civil Aviation',
    body: 'DGCA India',
    color: 'from-sky-500 to-blue-500',
    accent: '#0ea5e9',
    steps: ['Apply directly to flying schools', 'Clear DGCA written exams', 'Complete mandatory flying hours', 'Get Commercial Pilot License (CPL)'],
    link: 'dgca.gov.in',
  },
]

const QUOTAS = [
  {
    name: 'Community (Caste) Quota',
    emoji: '🏘️',
    color: 'from-teal-500 to-cyan-500',
    accent: '#14b8a6',
    who: 'OC, BC, MBC, SC, ST community students',
    eligibility: 'Produce valid community certificate issued by Tahsildar',
    benefit: '65–80% of seats reserved across all Tamil Nadu colleges',
    note: 'BC: 27%, MBC: 20%, SC: 15%, ST: 7.5%',
  },
  {
    name: 'Government School Quota',
    emoji: '🏫',
    color: 'from-emerald-500 to-green-500',
    accent: '#10b981',
    who: 'Students who studied from 6th to 12th in Government schools',
    eligibility: '7.5% additional reservation on top of category quota',
    benefit: 'Extra 7.5% seats in engineering colleges (Anna University)',
    note: 'Implemented since 2020 in Tamil Nadu',
  },
  {
    name: 'Sports Quota',
    emoji: '🏆',
    color: 'from-amber-500 to-orange-500',
    accent: '#f59e0b',
    who: 'Students with outstanding achievements in sports / games',
    eligibility: 'State/National level certificates from recognized sports bodies',
    benefit: '5% seats reserved in government & aided colleges',
    note: 'Must produce Sports Board certificate',
  },
  {
    name: 'Minority Quota',
    emoji: '☪️',
    color: 'from-violet-500 to-purple-500',
    accent: '#8b5cf6',
    who: 'Muslim, Christian, Sikh, Buddhist, Jain minority communities',
    eligibility: 'Minority certificate from relevant religious board',
    benefit: '12.5% seats in minority-run institutions',
    note: 'Applies to minority-declared institutions only',
  },
  {
    name: 'Ex-Servicemen / Defense Quota',
    emoji: '🎖️',
    color: 'from-rose-500 to-pink-500',
    accent: '#f43f5e',
    who: 'Children of Indian Armed Forces personnel (Army, Navy, Air Force)',
    eligibility: 'Ex-serviceman certificate from Zila Sainik Board',
    benefit: '5% seats reserved in all government engineering colleges',
    note: 'Applicable in both engineering and medical admissions',
  },
  {
    name: 'Persons With Disabilities (PWD)',
    emoji: '♿',
    color: 'from-sky-500 to-blue-500',
    accent: '#0ea5e9',
    who: 'Students with physical / visual / hearing disabilities',
    eligibility: '3% or more disability certificate from government hospital',
    benefit: '5% reservation in all government institutions',
    note: 'Horizontal reservation — applies across all categories',
  },
]

export default function CounsellingQuotaBlock() {
  const [expandedCounselling, setExpandedCounselling] = useState(null)

  return (
    <div className="flex flex-col gap-8">

      {/* ── Counselling Block ── */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
            <span className="text-lg">🏛️</span>
          </div>
          <div>
            <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">Counselling Systems by Domain</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Which portal to apply for, based on your chosen field</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COUNSELLING_DATA.map((item, i) => {
            const isOpen = expandedCounselling === item.domain
            return (
              <motion.div
                key={item.domain}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="rounded-2xl border border-neutral-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800 shadow-sm"
                style={{ boxShadow: isOpen ? `0 8px 32px ${item.accent}25` : '0 2px 8px rgba(0,0,0,0.04)' }}
              >
                {/* Header row — matchbook style */}
                <button
                  onClick={() => setExpandedCounselling(isOpen ? null : item.domain)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-neutral-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  {/* Domain */}
                  <div className={`w-1 h-12 rounded-full bg-gradient-to-b ${item.color} shrink-0`} />
                  <span className="text-2xl shrink-0">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Domain</p>
                    <p className="font-extrabold text-sm text-neutral-900 dark:text-white truncate">{item.domain}</p>
                  </div>

                  {/* Arrow */}
                  <ArrowRight size={14} className="text-neutral-300 shrink-0" />

                  {/* Counselling System */}
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold uppercase tracking-wide" style={{ color: item.accent }}>{item.system}</p>
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500">{item.body}</p>
                  </div>

                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown size={16} className="text-neutral-400 shrink-0" />
                  </motion.div>
                </button>

                {/* Expanded steps */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4" style={{ borderTop: `1px solid ${item.accent}25` }}>
                        <p className="text-[9px] font-black uppercase tracking-widest pt-3 mb-3" style={{ color: item.accent }}>
                          How to Apply — Step by Step
                        </p>
                        <div className="flex flex-col gap-2">
                          {item.steps.map((step, si) => (
                            <motion.div
                              key={si}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: si * 0.06 }}
                              className="flex items-start gap-3"
                            >
                              <div
                                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white shrink-0 mt-0.5"
                                style={{ background: item.accent }}
                              >
                                {si + 1}
                              </div>
                              <p className="text-xs text-neutral-600 dark:text-neutral-300">{step}</p>
                            </motion.div>
                          ))}
                        </div>
                        <p className="text-[10px] font-semibold mt-3" style={{ color: item.accent }}>
                          Portal: {item.link}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* ── Quota Block ── */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
            <Users size={16} className="text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">Quota Types & Eligibility</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Know which reservation categories you might qualify for</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUOTAS.map((quota, i) => (
            <motion.div
              key={quota.name}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07, type: 'spring', bounce: 0.2 }}
              whileHover={{ y: -4 }}
              className="p-5 rounded-2xl border dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm flex flex-col gap-3"
              style={{
                borderColor: `${quota.accent}30`,
                boxShadow: `0 4px 20px ${quota.accent}10`,
              }}
            >
              {/* Header */}
              <div className="flex items-start gap-3">
                <span className="text-2xl">{quota.emoji}</span>
                <div className="flex-1">
                  <div className={`h-1 w-full rounded-full bg-gradient-to-r ${quota.color} mb-2`} />
                  <h4 className="font-extrabold text-sm text-neutral-900 dark:text-white leading-tight">{quota.name}</h4>
                </div>
              </div>

              {/* Who can apply */}
              <div className="p-2.5 rounded-xl" style={{ background: `${quota.accent}10` }}>
                <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: quota.accent }}>Who Can Apply</p>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-snug">{quota.who}</p>
              </div>

              {/* Eligibility */}
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1">Eligibility</p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-snug">{quota.eligibility}</p>
              </div>

              {/* Benefit */}
              <div className="flex items-start gap-2 p-2 rounded-lg" style={{ background: `${quota.accent}08` }}>
                <CheckCircle size={12} style={{ color: quota.accent }} className="mt-0.5 shrink-0" />
                <p className="text-[10px] font-semibold text-neutral-700 dark:text-neutral-300 leading-snug">{quota.benefit}</p>
              </div>

              <p className="text-[9px] text-neutral-400 italic">{quota.note}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
