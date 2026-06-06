import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, Phone, MapPin, Send, Sparkles, MessageSquare, 
  CheckCircle2, AlertCircle, Bot, ArrowRight, CornerDownRight 
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ParticleField from '../components/ui/ParticleField'

const CONTACT_INFO = [
  {
    icon: Mail,
    title: 'Direct Support',
    value: 'support@tneaguide.org',
    desc: 'Get in touch with human counselors or technical helpers.',
    color: 'from-cyan-400 to-brand-500',
    glow: 'rgba(20,184,166,0.15)'
  },
  {
    icon: Phone,
    title: 'Guidance Helpline',
    value: '+91 44 2235 7300',
    desc: 'Available Mon-Fri, 9:00 AM - 5:00 PM for general TNEA advice.',
    color: 'from-teal-400 to-emerald-500',
    glow: 'rgba(16,185,129,0.15)'
  },
  {
    icon: MapPin,
    title: 'Innovation Hub',
    value: 'Guindy Campus, Anna University',
    desc: 'Chennai, Tamil Nadu - 600025',
    color: 'from-violet-400 to-purple-500',
    glow: 'rgba(139,92,246,0.15)'
  }
]

export default function Contact() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', subject: 'Counselling Round Help', message: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    let err = {}
    if (!form.name.trim()) err.name = 'Please provide your full name.'
    if (!form.email.trim()) {
      err.email = 'Email address is required.'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      err.email = 'Please enter a valid email address.'
    }
    if (!form.message.trim()) {
      err.message = 'Please type a short message.'
    } else if (form.message.trim().length < 10) {
      err.message = 'Message must be at least 10 characters.'
    }
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    // Simulate premium API call
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      // Reset form
      setForm({ name: '', email: '', subject: 'Counselling Round Help', message: '' })
    }, 2000)
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-neutral-50/20 py-16 sm:py-24">
      {/* Background Orbs and Particles */}
      <ParticleField count={30} />
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(20,184,166,0.1),transparent)]" />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-[500px] h-[500px] rounded-full bg-brand-100/40 blur-3xl -top-20 -left-20"
        />
        <motion.div
          animate={{ scale: [1.1, 0.95, 1.1], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-[400px] h-[400px] rounded-full bg-violet-100/30 blur-3xl top-1/2 -right-10"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-700 rounded-full px-4.5 py-1.5 text-xs font-black tracking-widest uppercase mb-5"
          >
            <Sparkles size={12} className="text-brand-500 animate-pulse" /> Connect with Support
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-neutral-900 leading-tight tracking-tight mb-5"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            We are here to{' '}
            <span className="bg-gradient-to-r from-brand-500 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              guide your steps
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-neutral-500 text-base sm:text-lg font-medium leading-relaxed"
          >
            Have a question about college rankings, counseling procedures, or technical account status? Pick your topic and our team will resolve it.
          </motion.p>
        </div>

        {/* Dual-Pane Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cards */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block pl-1">Support Info</span>
              {CONTACT_INFO.map((info, idx) => {
                const Icon = info.icon
                return (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, x: -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + idx * 0.1 }}
                    whileHover={{ y: -2 }}
                    className="p-5.5 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-sm flex gap-4 transition-all"
                    style={{ boxShadow: `0 4px 20px ${info.glow}` }}
                  >
                    <div className={`h-11 w-11 rounded-xl shrink-0 bg-gradient-to-br ${info.color} flex items-center justify-center shadow-md text-white`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-neutral-800 mb-1">{info.title}</h4>
                      <p className="font-black text-xs text-neutral-900 tracking-tight mb-1">{info.value}</p>
                      <p className="text-[11px] text-neutral-400 font-bold leading-normal">{info.desc}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* AI Assistant Quick Invite Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-6.5 rounded-3xl bg-gradient-to-br from-brand-50/70 to-cyan-50/50 border border-brand-100/40 shadow-sm relative overflow-hidden group"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-brand-400 opacity-5 blur-2xl group-hover:scale-110 transition-transform" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white shadow-glow-teal">
                  <Bot size={18} className="animate-pulse" />
                </div>
                <div>
                  <h4 className="font-black text-xs text-brand-700 uppercase tracking-widest">Instant Career AI</h4>
                  <p className="text-[9px] text-teal-600 font-bold uppercase">Online & Responsive</p>
                </div>
              </div>
              <p className="text-[11px] text-neutral-600 leading-relaxed font-semibold mb-5">
                Unsure about TNEA community tiers or cutoff scores? Tap the AI Career Mentor for a conversational analysis tailored directly to your high school strengths.
              </p>
              <button
                onClick={() => navigate('/assistant')}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-white hover:bg-brand-50 border border-brand-100 hover:border-brand-200 text-xs font-black uppercase tracking-wider text-brand-600 shadow-sm transition-all group/btn"
              >
                Launch AI Assistant Workspace <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </motion.div>

          </div>

          {/* Right Column: Interaction Form Container */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-6 sm:p-10 rounded-[2.5rem] bg-white border border-white shadow-xl shadow-neutral-100/50 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-teal-50 opacity-20 blur-2xl pointer-events-none" />
              
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form 
                    key="form"
                    onSubmit={handleSubmit} 
                    className="space-y-6"
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div>
                      <h3 className="font-black text-lg text-neutral-900 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Send us a message</h3>
                      <p className="text-xs text-neutral-450 font-bold mt-1">Fields marked are checked in real time.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name input */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-neutral-450 uppercase tracking-widest pl-1">Full Name</label>
                        <input
                          type="text"
                          placeholder="Anbarasan S"
                          value={form.name}
                          onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                          className={`w-full px-4.5 py-3 rounded-xl border bg-neutral-50/50 text-xs font-bold text-neutral-800 placeholder-neutral-350 focus:outline-none focus:bg-white transition-all ${
                            errors.name ? 'border-rose-300 focus:border-rose-400' : 'border-neutral-150 focus:border-brand-400'
                          }`}
                        />
                        {errors.name && (
                          <p className="text-[10px] text-rose-500 font-extrabold flex items-center gap-1 mt-0.5">
                            <AlertCircle size={10} /> {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Email input */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-neutral-450 uppercase tracking-widest pl-1">Email Address</label>
                        <input
                          type="email"
                          placeholder="anbu@example.com"
                          value={form.email}
                          onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                          className={`w-full px-4.5 py-3 rounded-xl border bg-neutral-50/50 text-xs font-bold text-neutral-800 placeholder-neutral-350 focus:outline-none focus:bg-white transition-all ${
                            errors.email ? 'border-rose-300 focus:border-rose-400' : 'border-neutral-150 focus:border-brand-400'
                          }`}
                        />
                        {errors.email && (
                          <p className="text-[10px] text-rose-500 font-extrabold flex items-center gap-1 mt-0.5">
                            <AlertCircle size={10} /> {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Topic/Subject */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-neutral-450 uppercase tracking-widest pl-1">Select Topic</label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm(p => ({ ...p, subject: e.target.value }))}
                        className="w-full px-4.5 py-3 rounded-xl border border-neutral-150 bg-neutral-50/50 text-xs font-bold text-neutral-800 focus:outline-none focus:border-brand-400 focus:bg-white transition-all appearance-none"
                      >
                        <option value="Counselling Round Help">🏫 Counselling Round choice filling</option>
                        <option value="AI Recommendation Feedback">🤖 AI Recommendation accuracy</option>
                        <option value="Premium Account Setup">💎 Account access / technical details</option>
                        <option value="Partnership Proposal">🤝 Regional College directory additions</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-neutral-450 uppercase tracking-widest pl-1">Message Text</label>
                      <textarea
                        rows={5}
                        placeholder="Detail your question here. Include expected cutoff marks if discussing specific colleges..."
                        value={form.message}
                        onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))}
                        className={`w-full px-4.5 py-3.5 rounded-2xl border bg-neutral-50/50 text-xs font-medium text-neutral-800 placeholder-neutral-350 focus:outline-none focus:bg-white transition-all resize-none ${
                          errors.message ? 'border-rose-300 focus:border-rose-400' : 'border-neutral-150 focus:border-brand-400'
                        }`}
                      />
                      {errors.message && (
                        <p className="text-[10px] text-rose-500 font-extrabold flex items-center gap-1 mt-0.5">
                          <AlertCircle size={10} /> {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-primary w-full py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-glow-teal disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Encrypting Data...
                        </>
                      ) : (
                        <>
                          Send Message <Send size={13} />
                        </>
                      )}
                    </motion.button>

                  </motion.form>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: 'spring', bounce: 0.2 }}
                    className="text-center py-10 flex flex-col items-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 mb-6 shadow-sm shadow-emerald-500/10">
                      <CheckCircle2 size={32} className="animate-pulse" />
                    </div>
                    <h3 className="font-black text-2xl text-neutral-900 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Message Transmitted!</h3>
                    <p className="text-xs text-neutral-500 font-medium max-w-sm mx-auto leading-relaxed mb-8">
                      Thank you! Your query has been logged securely under SSL encryption. An AI career specialist and a regional counsellor have been assigned. 
                    </p>
                    
                    <div className="w-full bg-neutral-50/50 border border-neutral-100 rounded-2xl p-4.5 mb-8 text-left space-y-2">
                      <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Expected Next Steps</p>
                      <div className="flex gap-2 text-xs font-bold text-neutral-700">
                        <CornerDownRight size={13} className="text-neutral-400 mt-0.5" />
                        <span>AI review completes in 5 minutes</span>
                      </div>
                      <div className="flex gap-2 text-xs font-bold text-neutral-700">
                        <CornerDownRight size={13} className="text-neutral-400 mt-0.5" />
                        <span>Counselor email summary within 12 hours</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-xs font-black uppercase tracking-wider text-brand-600 hover:text-brand-700 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          </div>

        </div>

      </div>
    </div>
  )
}
