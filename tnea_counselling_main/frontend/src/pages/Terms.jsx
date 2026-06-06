import { motion } from 'framer-motion'
import { Landmark, ShieldAlert, Scale, HelpCircle, ArrowRight } from 'lucide-react'
import ParticleField from '../components/ui/ParticleField'

export default function Terms() {
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(139,92,246,0.06),transparent)]" />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-violet-100/20 blur-3xl top-40 -left-20" />
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
            <Scale size={12} className="text-brand-500" /> Platform Policies
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-neutral-900 leading-tight tracking-tight mb-5"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Terms of{' '}
            <span className="bg-gradient-to-r from-violet-500 via-brand-500 to-cyan-400 bg-clip-text text-transparent">
              Service
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-neutral-500 text-base sm:text-lg font-medium leading-relaxed"
          >
            Please read these conditions carefully before accessing the dashboard tools or counseling simulators. By utilizing the platform, you agree to these limits.
          </motion.p>
        </div>

        {/* Essential Disclaimers Widget */}
        <div className="p-6 sm:p-8 rounded-[2rem] bg-gradient-to-br from-rose-50/50 to-amber-50/50 border border-rose-100/30 flex flex-col sm:flex-row gap-5.5 items-start sm:items-center mb-16">
          <div className="w-12 h-12 rounded-2xl bg-white border border-rose-200 flex items-center justify-center shrink-0 text-rose-500 shadow-sm shadow-rose-500/5">
            <ShieldAlert size={22} className="animate-pulse" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-neutral-800 mb-1">Independent Advisory Tool Statement</h4>
            <p className="text-[11px] sm:text-xs text-neutral-500 font-semibold leading-relaxed">
              This platform is a private educational guide. We are **not** associated with Anna University, DoTE, or any government authority of Tamil Nadu. We do **not** allocate college seats or process official counseling transactions.
            </p>
          </div>
        </div>

        {/* Split Section: Table of Contents + Document Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Quick Links */}
          <div className="hidden lg:block lg:col-span-3 sticky top-24 flex flex-col gap-3">
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-1 pl-1">Document Index</span>
            {[
              { id: 'user-rules', title: '1. User Account Rules' },
              { id: 'sim-limits', title: '2. Simulation limitations' },
              { id: 'intel-prop', title: '3. Intellectual property' },
              { id: 'tnea-quota', title: '4. TNEA authority limits' },
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
            
            <section id="user-rules" className="space-y-3">
              <h3 className="font-black text-sm sm:text-base text-neutral-900 tracking-tight uppercase border-b border-neutral-100 pb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                1. User Account & Eligibility Rules
              </h3>
              <p>
                To utilize the onboarding quiz and register custom cutoffs, students must submit accurate academic markers. You agree that:
              </p>
              <ul className="list-disc list-inside pl-4 space-y-1 text-neutral-500">
                <li>All marks inputted represent genuine or reasonably expected school outcomes.</li>
                <li>Your name and contact tags submitted are correct.</li>
                <li>You will protect access credentials to secure your private dashboard states.</li>
              </ul>
            </section>

            <section id="sim-limits" className="space-y-3">
              <h3 className="font-black text-sm sm:text-base text-neutral-900 tracking-tight uppercase border-b border-neutral-100 pb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                2. Unbiased AI guidance limitations
              </h3>
              <p>
                Compatibility metrics, college cutoff predictions, and psychometric stream matching ratios are compile-time approximations meant to direct options.
              </p>
              <p>
                Engineering and medicine requirements shift annually based on student ratios. While we perform extensive verification runs, we **do not** promise seat matches or rank consistency against active TNEA lists. All outputs are simulated references.
              </p>
            </section>

            <section id="intel-prop" className="space-y-3">
              <h3 className="font-black text-sm sm:text-base text-neutral-900 tracking-tight uppercase border-b border-neutral-100 pb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                3. Intellectual property & open details
              </h3>
              <p>
                The custom interface configurations, Aetherius Orbit models, layout matrices, and software codeboards are proprietary assets. Users are given a single private access scope to query metrics. 
              </p>
              <p>
                You may not scrape directory lists, mirror analytical streams, or replicate styling models without clear consent. High-school students are free to download personal result compilations for private counselling choice locking.
              </p>
            </section>

            <section id="tnea-quota" className="space-y-3">
              <h3 className="font-black text-sm sm:text-base text-neutral-900 tracking-tight uppercase border-b border-neutral-100 pb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                4. Disclaimer of official representation
              </h3>
              <div className="p-5.5 rounded-2xl bg-neutral-50 border border-neutral-150 flex gap-4">
                <div className="w-9 h-9 rounded-xl bg-white border border-neutral-200/50 flex items-center justify-center shrink-0 text-neutral-500 shadow-sm">
                  <Landmark size={18} />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-neutral-800 mb-1">State Counseling Disclaimer</h4>
                  <p className="text-[11px] text-neutral-600 leading-relaxed font-semibold">
                    The official counselling process is strictly governed by DoTE (Directorate of Technical Education, Tamil Nadu). Users must follow official schedules and submit choices within tneaonline.org to be eligible for university allocations.
                  </p>
                </div>
              </div>
              <p>
                This guidance suite operates solely as an auxiliary preparation companion tool.
              </p>
            </section>

          </div>

        </div>

      </div>
    </div>
  )
}
