import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, School, Wrench, Settings, HeartPulse, Laptop, Shield, Lightbulb, Globe } from 'lucide-react'

/* ─── Data Definitions ────────────────────────────────────────── */

const PATHWAYS = [
  {
    id: 'higher-sec',
    name: 'Higher Secondary (11th & 12th)',
    accent: '#14b8a6', // brand teal
    glow: 'rgba(20,184,166,0.35)',
    overview: 'The traditional 2-year school pathway leading to university degrees.',
    icon: School,
    backContent: {
      opportunities: 'Foundation for Engineering, Medical, Arts & Commerce degrees.',
      careers: ['Engineer', 'Doctor', 'CA', 'Scientist'],
      courses: ['B.Tech', 'MBBS', 'B.Com', 'BA'],
    }
  },
  {
    id: 'diploma',
    name: 'Diploma / Polytechnic',
    accent: '#f59e0b', // amber
    glow: 'rgba(245,158,11,0.35)',
    overview: '3-year technical programs for direct industry entry or B.Tech lateral entry.',
    icon: Wrench,
    backContent: {
      opportunities: 'Direct 2nd-year B.Tech entry. Highly valued in core engineering industries.',
      careers: ['Junior Engineer', 'Technician', 'Site Supervisor'],
      courses: ['Mechanical Diploma', 'Civil Diploma', 'ECE Diploma', 'AI & DS Diploma'],
    }
  },
  {
    id: 'iti',
    name: 'ITI & Technical Training',
    accent: '#f43f5e', // rose
    glow: 'rgba(244,63,94,0.35)',
    overview: '1-2 year technical certification for specialized industrial trades.',
    icon: Settings,
    backContent: {
      opportunities: 'High demand in Govt sectors, Railways, and Manufacturing.',
      careers: ['Electrician', 'Fitter', 'Welder', 'Mechanic'],
      courses: ['Electrician Trade', 'Fitter Trade', 'Motor Mechanic'],
    }
  },
  {
    id: 'health',
    name: 'Healthcare & Paramedical',
    accent: '#10b981', // emerald
    glow: 'rgba(16,185,129,0.35)',
    overview: '1-2 year paramedical and healthcare assistance programs.',
    icon: HeartPulse,
    backContent: {
      opportunities: 'Growing demand in hospitals, clinics, and home healthcare.',
      careers: ['Lab Technician', 'Nursing Assistant', 'X-Ray Tech'],
      courses: ['DMLT', 'Nursing Aide', 'Radiology Tech'],
    }
  },
  {
    id: 'skill',
    name: 'Skill & Digital Careers',
    accent: '#0ea5e9', // sky blue
    glow: 'rgba(14,165,233,0.35)',
    overview: 'Short-term bootcamps and certifications for modern digital skills.',
    icon: Laptop,
    backContent: {
      opportunities: 'Freelancing, remote work, and direct entry to tech startups.',
      careers: ['UI/UX Designer', 'Web Developer', 'Video Editor', 'Marketer'],
      courses: ['UI/UX Bootcamp', 'Full Stack Dev', 'Animation', 'Graphic Design'],
    }
  },
  {
    id: 'defence',
    name: 'Defence & Govt Prep',
    accent: '#64748b', // slate
    glow: 'rgba(100,116,139,0.35)',
    overview: 'Preparation for NDA, Police, and Armed Forces entry.',
    icon: Shield,
    backContent: {
      opportunities: 'Job security, pride, and early career settlement in Govt forces.',
      careers: ['Army Soldier', 'Navy Sailor', 'Police Constable'],
      courses: ['NDA Prep', 'Physical Training', 'NCC'],
    }
  },
  {
    id: 'creative',
    name: 'Entrepreneurship & Creative',
    accent: '#8b5cf6', // violet
    glow: 'rgba(139,92,246,0.35)',
    overview: 'Start your own business or build a career in creative arts.',
    icon: Lightbulb,
    backContent: {
      opportunities: 'Limitless potential. High growth in creator economy and startups.',
      careers: ['Founder', 'Content Creator', 'Photographer', 'Designer'],
      courses: ['Business Basics', 'Photography', 'Fine Arts'],
    }
  },
  {
    id: 'alternative',
    name: 'Alternative & Vocational',
    accent: '#d946ef', // fuchsia
    glow: 'rgba(217,70,239,0.35)',
    overview: 'Flexible learning (NIOS) and practical job-ready training.',
    icon: Globe,
    backContent: {
      opportunities: 'Allows time for sports/arts or fast-tracks to employment.',
      careers: ['Pro Athlete', 'Artist', 'Chef', 'Fashion Designer'],
      courses: ['NIOS 12th', 'Distance Learning', 'Culinary Arts'],
    }
  }
]

/* ─── Components ─────────────────────────────────────────────── */

function FlipCard({ pathway, delay }) {
  const [flipped, setFlipped] = useState(false)
  const Icon = pathway.icon

  const handleFlip = () => {
    setFlipped(f => !f)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.6, delay, type: 'spring', bounce: 0.25 }}
      style={{ perspective: '1500px' }}
      className="cursor-pointer h-[260px] group relative"
      onClick={handleFlip}
      whileHover={{ scale: 1.02, y: -4 }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 70, damping: 14 }}
        className="w-full h-full relative"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* ── Front ── */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden bg-white dark:bg-slate-800 flex flex-col transition-all duration-500 shadow-sm hover:shadow-xl"
          style={{ 
            backfaceVisibility: 'hidden', 
            borderLeft: `5px solid ${pathway.accent}`,
            borderTop: '1px solid rgba(150,150,150,0.1)',
            borderRight: '1px solid rgba(150,150,150,0.1)',
            borderBottom: '1px solid rgba(150,150,150,0.1)',
          }}
        >
          {/* Glowing origin from the left border */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" 
            style={{ background: `linear-gradient(90deg, ${pathway.glow}, transparent 60%)` }} 
          />

          <div className="flex-1 flex flex-col p-5 relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                style={{ background: `linear-gradient(135deg, ${pathway.accent}, ${pathway.accent}dd)` }}
              >
                <Icon size={22} />
              </div>
            </div>

            <h3 className="font-extrabold text-[15px] text-neutral-900 dark:text-white leading-tight mb-2">
              {pathway.name}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed flex-1">
              {pathway.overview}
            </p>

            <div className="flex items-center gap-1.5 mt-3 text-[10px] font-bold opacity-60 group-hover:opacity-100 transition-opacity" style={{ color: pathway.accent }}>
              <RotateCcw size={11} />
              Tap to see future pathways
            </div>
          </div>
        </div>

        {/* ── Back ── */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col p-5 bg-white dark:bg-slate-800 shadow-xl"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            border: `2px solid ${pathway.accent}`,
            boxShadow: `inset 0 0 40px ${pathway.glow}, 0 10px 20px ${pathway.glow}30`
          }}
        >
          {/* Expansive Energy Top Border */}
          <div className="absolute top-0 left-0 w-full h-1.5" style={{ background: pathway.accent }} />
          
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm" style={{ background: pathway.accent, color: 'white' }}>
              <Icon size={16} />
            </div>
            <h4 className="text-[13px] font-black text-neutral-900 dark:text-white">{pathway.name}</h4>
          </div>

          <div className="flex-1 flex flex-col gap-4 justify-center">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: pathway.accent }}>Future Opportunities</p>
              <p className="text-[10.5px] text-neutral-600 dark:text-neutral-300 leading-relaxed">{pathway.backContent.opportunities}</p>
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: pathway.accent }}>Example Careers</p>
              <div className="flex flex-wrap gap-1.5">
                {pathway.backContent.careers.slice(0,4).map(c => (
                  <span key={c} className="text-[9px] font-bold px-2 py-1 rounded bg-neutral-100 dark:bg-slate-700/50 border border-neutral-200 dark:border-slate-600 text-neutral-800 dark:text-neutral-200">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function After10thCards() {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 relative">
        {PATHWAYS.map((pathway, i) => (
          <FlipCard 
            key={pathway.id}
            pathway={pathway} 
            delay={i * 0.05} 
          />
        ))}
      </div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Lightbulb size={16} className="inline text-brand-500 mb-0.5 mr-1" />
        <span className="font-bold text-brand-500">Tip:</span> Engineering and Medical are great, but they aren't the only options. Choose a path that fits your goals!
      </motion.p>
    </div>
  )
}
