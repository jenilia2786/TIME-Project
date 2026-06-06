import { motion } from 'framer-motion'
import { ShieldCheck, Eye, Lock, FileLock2, Award, ArrowRight } from 'lucide-react'
import ParticleField from '../components/ui/ParticleField'

const TRUST_CARDS = [
  {
    icon: Lock,
    title: 'SSL Encryption',
    desc: 'All grades and counselling marks are encrypted in transit and at rest.',
    color: 'text-cyan-500 bg-cyan-50 border-cyan-100'
  },
  {
    icon: Eye,
    title: 'Ad-Free Content',
    desc: 'Zero ads, sponsored college listings, or tracking cookies.',
    color: 'text-brand-500 bg-brand-50 border-brand-100'
  },
  {
    icon: ShieldCheck,
    title: 'Student Control',
    desc: 'Download, erase, or modify your profile inputs dynamically at any time.',
    color: 'text-violet-500 bg-violet-50 border-violet-100'
  }
]

export default function Privacy() {
  const handleScrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-neutral-50/20 py-16 sm:py-24">
      <ParticleField count={25} />
      
      {/* Background radial effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(20,184,166,0.06),transparent)]" />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-100/20 blur-3xl top-40 -left-20" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-700 rounded-full px-4.5 py-1.5 text-xs font-black tracking-widest uppercase mb-5"
          >
            <FileLock2 size={12} className="text-brand-500" /> Trust Center
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-neutral-900 leading-tight tracking-tight mb-5"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Privacy{' '}
            <span className="bg-gradient-to-r from-brand-500 to-cyan-400 bg-clip-text text-transparent">
              Respected
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-neutral-500 text-base sm:text-lg font-medium leading-relaxed"
          >
            We appreciate the sensitivity of your academic grades, counseling options, and personal goals. Learn how we handle your data ethically.
          </motion.p>
        </div>

        {/* Core Principles (Trust Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {TRUST_CARDS.map((card, idx) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                whileHover={{ y: -2 }}
                className="p-6 rounded-2xl bg-white border border-neutral-150 shadow-sm flex flex-col items-start gap-4 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${card.color}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-neutral-800 mb-1">{card.title}</h4>
                  <p className="text-[11px] text-neutral-500 font-semibold leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Split Section: Table of Contents + Document Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Quick Links (Desktop Sticky) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-24 flex flex-col gap-3">
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-1 pl-1">Document Index</span>
            {[
              { id: 'data-collection', title: '1. What we collect' },
              { id: 'engine-use', title: '2. AI processing use' },
              { id: 'ethical-ai', title: '3. Unbiased guidance' },
              { id: 'data-rights', title: '4. Your access rights' },
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => handleScrollTo(link.id)}
                className="text-left text-xs font-bold text-neutral-500 hover:text-brand-600 transition-colors flex items-center gap-1.5 py-1 group"
              >
                <ArrowRight size={10} className="text-neutral-300 group-hover:translate-x-0.5 transition-transform" />
                {link.title}
              </button>
            ))}
          </div>

          {/* Right Column: High Legibility Document */}
          <div className="lg:col-span-9 p-8 sm:p-12 rounded-[2.5rem] bg-white border border-neutral-150 shadow-sm leading-relaxed text-xs sm:text-sm font-medium text-neutral-600 space-y-8">
            
            <section id="data-collection" className="space-y-3">
              <h3 className="font-black text-sm sm:text-base text-neutral-900 tracking-tight uppercase border-b border-neutral-100 pb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                1. What information do we collect?
              </h3>
              <p>
                We only collect parameters required to generate accurate college rankings and stream matches. This consists of:
              </p>
              <ul className="list-disc list-inside pl-4 space-y-1 text-neutral-500">
                <li>Academic parameters: Current grade level, subject scores, school board type, and district location.</li>
                <li>Psychometric attributes: Career interests, job goal preferences, and logic quiz selections.</li>
                <li>Access details: Account setup name, registered email address, and authentication log timestamps.</li>
              </ul>
              <p>
                We **do not** collect bank details, permanent residential maps, or official TNEA counseling portal credentials.
              </p>
            </section>

            <section id="engine-use" className="space-y-3">
              <h3 className="font-black text-sm sm:text-base text-neutral-900 tracking-tight uppercase border-b border-neutral-100 pb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                2. How is this data processed by AI?
              </h3>
              <p>
                Your profiles are mapped dynamically in the frontend to predict compatibility coefficients against Anna University catalogues, structural stream syllabi, and government placement timelines. 
              </p>
              <p>
                All statistical simulations run within secure memory containers. The model parameters are continuously calibrated against historic TNEA rank cutoff listings to avoid data leakage or unauthorized profile sharing.
              </p>
            </section>

            <section id="ethical-ai" className="space-y-3">
              <h3 className="font-black text-sm sm:text-base text-neutral-900 tracking-tight uppercase border-b border-neutral-100 pb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                3. Unbiased Guidance Principle
              </h3>
              <div className="p-5.5 rounded-2xl bg-gradient-to-br from-brand-50/50 to-cyan-50/50 border border-brand-100/30 flex gap-4">
                <div className="w-9 h-9 rounded-xl bg-white border border-brand-200/50 flex items-center justify-center shrink-0 text-brand-500 shadow-sm">
                  <Award size={18} />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-brand-800 mb-1">Unbiased Career Guarantee</h4>
                  <p className="text-[11px] text-neutral-600 leading-relaxed font-semibold">
                    We maintain absolute independence. We never accept sponsorships, pay-to-list fees, or affiliate agreements from colleges. All recommendations are generated purely based on merit and suitability scores.
                  </p>
                </div>
              </div>
              <p>
                This ensures parents and students receive unbiased suggestions free from standard advertisement traps or sponsored ranking biases.
              </p>
            </section>

            <section id="data-rights" className="space-y-3">
              <h3 className="font-black text-sm sm:text-base text-neutral-900 tracking-tight uppercase border-b border-neutral-100 pb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                4. Your control and data access rights
              </h3>
              <p>
                We believe in total transparency. You retain complete ownership over all academic records uploaded to the guidance ecosystem:
              </p>
              <ul className="list-disc list-inside pl-4 space-y-1 text-neutral-500">
                <li>You can inspect or download all quiz variables stored in your local profile dashboard at any time.</li>
                <li>You can reset or modify your subjects and district filters to recalculate compatibility gauges.</li>
                <li>You can delete your student account entirely, which instantly wipes all records from our active servers.</li>
              </ul>
              <p>
                For further trust audits, you can contact our security helpdesk directly at **trust@tneaguide.org**.
              </p>
            </section>

          </div>

        </div>

      </div>
    </div>
  )
}
