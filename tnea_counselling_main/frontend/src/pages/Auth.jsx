import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, CheckCircle2, Sparkles, Phone, Calendar,
  User, Shield, Eye, EyeOff, ChevronLeft, Zap, RefreshCw
} from 'lucide-react'
import useStudentStore from '../store/useStudentStore'
import ParticleField from '../components/ui/ParticleField'
import NeonButton from '../components/ui/NeonButton'
import ConfettiEffect from '../components/ui/ConfettiEffect'

const API_BASE = import.meta.env.VITE_API_URL || ''

/* ─── Slide animation ────────────────────────────────────── */
const slide = (dir = 1) => ({
  initial:    { opacity: 0, x: 40 * dir, filter: 'blur(4px)' },
  animate:    { opacity: 1, x: 0, filter: 'blur(0px)' },
  exit:       { opacity: 0, x: -30 * dir, filter: 'blur(4px)' },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
})

/* ─── OTP Input ──────────────────────────────────────────── */
function OTPInput({ digits, onChange }) {
  const refs = [useRef(), useRef(), useRef(), useRef()]

  const handleDigit = (i, v) => {
    if (!/^\d?$/.test(v)) return
    const next = [...digits]
    next[i] = v
    onChange(next)
    if (v && i < 3) refs[i + 1].current?.focus()
    if (!v && i > 0) refs[i - 1].current?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs[i - 1].current?.focus()
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    if (paste.length === 4) {
      onChange(paste.split(''))
      refs[3].current?.focus()
    }
  }

  return (
    <div className="flex justify-center gap-3">
      {digits.map((d, i) => (
        <motion.input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => handleDigit(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          whileFocus={{ scale: 1.05, borderColor: '#14b8a6' }}
          className="h-16 w-14 rounded-2xl border-2 border-neutral-200 text-center text-2xl font-black text-neutral-900 outline-none transition-all focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(20,184,166,0.15)] bg-white"
          style={d ? { borderColor: '#14b8a6', boxShadow: '0 0 12px rgba(20,184,166,0.2)' } : {}}
        />
      ))}
    </div>
  )
}

/* ─── Main Auth Page ─────────────────────────────────────── */
export default function Auth() {
  const navigate = useNavigate()
  const { startSession, sessionId } = useStudentStore()

  const [mode, setMode]         = useState('signup') // 'signup' | 'login'
  const [step, setStep]         = useState(0)        // 0=name/phone, 1=otp, 2=success
  const [name, setName]         = useState('')
  const [mobile, setMobile]     = useState('')
  const [dob, setDob]           = useState('')
  const [digits, setDigits]     = useState(['', '', '', ''])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [confetti, setConfetti] = useState(false)
  const [dir, setDir]           = useState(1)
  const [role, setRole]         = useState('student') // 'student' | 'parent'
  const [resendCooldown, setResendCooldown] = useState(0)
  const [backendOnline, setBackendOnline] = useState(null) // null=checking, true/false

  // Redirect if already logged in
  useEffect(() => {
    if (sessionId) navigate('/dashboard', { replace: true })
  }, [sessionId, navigate])

  // Check backend status on mount
  useEffect(() => {
    fetch(`${API_BASE}/health`).then(r => r.ok ? setBackendOnline(true) : setBackendOnline(false)).catch(() => setBackendOnline(false))
  }, [])

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  const goTo = (s, d = 1) => { setDir(d); setStep(s); setError('') }

  /* ── SIGNUP flow ── */
  const handleSignupPhone = async (e) => {
    e.preventDefault()
    if (!name.trim()) { setError('Please enter your full name'); return }
    if (mobile.length < 10) { setError('Enter a valid 10-digit mobile number'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, name })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to send OTP')
      setLoading(false)
      setResendCooldown(30)
      goTo(1)
    } catch (err) {
      setLoading(false)
      // If backend is offline, allow demo mode
      if (err.message.includes('fetch') || err.message.includes('Failed to fetch')) {
        setError('Backend server is offline. Please start the FastAPI server to continue.')
      } else {
        setError(err.message || 'Something went wrong. Please try again.')
      }
    }
  }

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return
    setLoading(true)
    try {
      await fetch(`${API_BASE}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, name })
      })
      setResendCooldown(30)
      setDigits(['', '', '', ''])
      setError('')
    } catch (_) {}
    setLoading(false)
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    if (digits.join('').length < 4) { setError('Enter the 4-digit OTP'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp: digits.join(''), name, role })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'OTP verification failed')
      setLoading(false)
      setConfetti(true)
      goTo(2)
      setTimeout(() => {
        startSession(data.user?.name || name, mobile, role)
        navigate('/onboarding')
      }, 1800)
    } catch (err) {
      setLoading(false)
      setError(err.message || 'Verification failed. Please try again.')
    }
  }

  /* ── LOGIN flow ── */
  const handleLogin = async (e) => {
    e.preventDefault()
    if (mobile.length < 10) { setError('Enter your registered mobile number'); return }
    if (!dob) { setError('Enter your date of birth'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, dob, role })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Login failed')
      setLoading(false)
      startSession(data.user?.name || 'Student', mobile, data.user?.role || role)
      navigate('/dashboard')
    } catch (err) {
      setLoading(false)
      setError(err.message || 'Login failed. Please check your details.')
    }
  }

  const switchMode = (m) => {
    setMode(m); setStep(0); setError('')
    setName(''); setMobile(''); setDob(''); setDigits(['', '', '', ''])
  }

  const canContinue = mode === 'signup'
    ? (step === 0 ? name.trim() && mobile.length === 10 : digits.join('').length === 4)
    : (mobile.length === 10 && !!dob)

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white">
      <ParticleField count={50} />

      {/* Ambient gradient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-5%,rgba(20,184,166,0.1),transparent)]" />
        <motion.div
          animate={{ y: [-20, 20, -20], x: [-15, 15, -15] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-[600px] h-[600px] rounded-full bg-teal-100/30 blur-3xl -top-60 -left-60"
        />
        <motion.div
          animate={{ y: [20, -20, 20], x: [15, -15, 15] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-[500px] h-[500px] rounded-full bg-violet-100/25 blur-3xl top-20 -right-40"
        />
        <motion.div
          animate={{ y: [-10, 15, -10] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-[400px] h-[400px] rounded-full bg-cyan-100/20 blur-3xl bottom-0 left-1/3"
        />
      </div>

      {/* Back to home */}
      <motion.button
        onClick={() => navigate('/')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -3 }}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-brand-600 transition-colors"
      >
        <ChevronLeft size={16} /> Back to home
      </motion.button>

      {/* Auth card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 25 }}
        className="relative w-full max-w-md mx-4 z-10"
      >
        {/* Confetti */}
        <div className="absolute inset-0 pointer-events-none z-50">
          <ConfettiEffect trigger={confetti} count={40} />
        </div>

        <div
          className="rounded-[2rem] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.78) 100%)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(255,255,255,0.7)',
            boxShadow: '0 30px 80px rgba(20,184,166,0.1), 0 8px 32px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.9)',
          }}
        >
          {/* Card header */}
          <div className="px-8 pt-8 pb-6">
            <div className="flex items-center justify-between mb-7">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.08 }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-glow-teal"
                >
                  <span className="text-[11px] font-black text-white">TIME</span>
                </motion.div>
                <div>
                  <p className="font-extrabold text-neutral-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>T.I.M.E</p>
                  <p className="text-[10px] text-neutral-400 font-medium">Educational Guidance</p>
                </div>
              </div>

              {/* Secured badge */}
              <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1.5">
                <Shield size={11} className="text-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-600">Secured</span>
              </div>
            </div>

            {/* Mode tabs */}
            <div className="relative flex bg-neutral-100 rounded-2xl p-1 mb-6">
              {['signup', 'login'].map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className="relative flex-1 py-2.5 text-sm font-bold rounded-xl z-10 transition-colors"
                  style={{ color: mode === m ? '#0f766e' : '#94a3b8' }}
                >
                  {m === 'signup' ? 'New Student' : 'Return Login'}
                  {mode === m && (
                    <motion.div
                      layoutId="auth-tab"
                      className="absolute inset-0 bg-white rounded-xl shadow-sm"
                      style={{ zIndex: -1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Steps indicator (signup only) */}
            {mode === 'signup' && step < 2 && (
              <div className="flex items-center gap-2 mb-5">
                {[0, 1].map(i => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                      i < step ? 'bg-brand-500 text-white' :
                      i === step ? 'bg-brand-100 text-brand-700 border-2 border-brand-400' :
                      'bg-neutral-100 text-neutral-400'
                    }`}>
                      {i < step ? '✓' : i + 1}
                    </div>
                    {i === 0 && <div className={`h-px flex-1 w-8 transition-colors duration-500 ${step > 0 ? 'bg-brand-400' : 'bg-neutral-200'}`} />}
                  </div>
                ))}
                <span className="text-xs text-neutral-400 ml-1">{step === 0 ? 'Your details' : 'Verify OTP'}</span>
              </div>
            )}

            {/* ── SIGNUP FLOW ── */}
            {mode === 'signup' && (
              <AnimatePresence mode="wait">
                {/* Step 0: Name + Phone */}
                {step === 0 && (
                  <motion.form key="s0" {...slide(dir)} onSubmit={handleSignupPhone} className="space-y-4">
                    <div>
                      <h1 className="text-2xl font-extrabold text-neutral-900 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Welcome! 👋
                      </h1>
                      <p className="text-sm text-neutral-500 mt-1">Start your personalised guidance journey.</p>
                    </div>

                    <div className="space-y-3">
                      {/* Role Selection */}
                      <div className="flex gap-2 mb-2">
                        {['student', 'parent'].map(r => (
                          <button
                            key={r} type="button"
                            onClick={() => setRole(r)}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all capitalize border ${
                              role === r ? 'bg-brand-50 border-brand-200 text-brand-700' : 'bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50'
                            }`}
                          >
                            I am a {r}
                          </button>
                        ))}
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                          Full Name
                        </label>
                        <div className="relative">
                          <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                          <input
                            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-9 pr-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all font-medium"
                            type="text" required autoFocus value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Priya Lakshmi"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                          Mobile Number
                        </label>
                        <div className="flex">
                          <div className="flex items-center rounded-l-xl border border-r-0 border-neutral-200 bg-neutral-100 px-3 text-sm text-neutral-500 font-bold">
                            <Phone size={13} className="mr-1.5" />+91
                          </div>
                          <input
                            className="w-full rounded-r-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all font-medium"
                            type="tel" required maxLength={10} value={mobile}
                            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                            placeholder="9876543210"
                          />
                        </div>
                      </div>
                    </div>

                    {error && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 font-medium">
                        {error}
                      </motion.p>
                    )}

                    <NeonButton variant="game" type="submit" disabled={loading || !canContinue} className="w-full py-3.5 text-sm" id="auth-signup-continue">
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full" />
                          Sending OTP...
                        </span>
                      ) : (
                        <>Continue <ArrowRight size={16} /></>
                      )}
                    </NeonButton>

                    <p className="text-center text-xs text-neutral-400">
                      A 4-digit OTP will be sent to your mobile number
                    </p>
                  </motion.form>
                )}

                {/* Step 1: OTP */}
                {step === 1 && (
                  <motion.form key="s1" {...slide(dir)} onSubmit={handleVerifyOTP} className="space-y-6">
                    <div>
                      <h1 className="text-2xl font-extrabold text-neutral-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Verify OTP 🔐
                      </h1>
                      <p className="text-sm text-neutral-500 mt-1">
                        Sent to <span className="font-semibold text-neutral-700">+91 {mobile}</span>
                      </p>
                    </div>

                    <OTPInput digits={digits} onChange={setDigits} />

                    {/* Resend OTP */}
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-neutral-400">Didn't receive the OTP?</p>
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={resendCooldown > 0 || loading}
                        className={`flex items-center gap-1 text-xs font-bold transition-colors ${resendCooldown > 0 ? 'text-neutral-300 cursor-not-allowed' : 'text-brand-600 hover:text-brand-700'}`}
                      >
                        <RefreshCw size={12} />
                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                      </button>
                    </div>

                    {error && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-500 font-medium text-center">
                        {error}
                      </motion.p>
                    )}

                    <NeonButton variant="game" type="submit" disabled={loading || digits.join('').length < 4} className="w-full py-3.5 text-sm" id="auth-verify-otp">
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full" />
                          Verifying...
                        </span>
                      ) : (
                        <>Verify & Enter <ArrowRight size={16} /></>
                      )}
                    </NeonButton>

                    <button type="button" onClick={() => goTo(0, -1)} className="w-full text-center text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                      ← Change number
                    </button>
                  </motion.form>
                )}


                {/* Step 2: Success */}
                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center space-y-5">
                    <motion.div
                      animate={{ scale: [1, 1.12, 1], rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.7 }}
                      className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-100 to-emerald-100"
                      style={{ boxShadow: '0 0 30px rgba(20,184,166,0.3)' }}
                    >
                      <CheckCircle2 size={38} className="text-brand-600" />
                    </motion.div>
                    <div>
                      <p className="text-2xl font-black text-neutral-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        You're in, {name.split(' ')[0]}! 🎉
                      </p>
                      <p className="mt-2 text-sm text-neutral-500">Setting up your personal dashboard...</p>
                    </div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.6, ease: 'easeInOut' }}
                      className="h-1 rounded-full bg-gradient-to-r from-brand-400 to-cyan-400 mx-auto"
                      style={{ maxWidth: 200, boxShadow: '0 0 8px rgba(20,184,166,0.5)' }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* ── LOGIN FLOW ── */}
            {mode === 'login' && (
              <AnimatePresence mode="wait">
                <motion.form key="login" {...slide(1)} onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-extrabold text-neutral-900 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Welcome back! 🌟
                    </h1>
                    <p className="text-sm text-neutral-500 mt-1">Login with your registered mobile and date of birth.</p>
                  </div>

                  <div className="space-y-3">
                    {/* Role Selection */}
                    <div className="flex gap-2 mb-2">
                      {['student', 'parent'].map(r => (
                        <button
                          key={r} type="button"
                          onClick={() => setRole(r)}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all capitalize border ${
                            role === r ? 'bg-brand-50 border-brand-200 text-brand-700' : 'bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50'
                          }`}
                        >
                          I am a {r}
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                        Mobile Number
                      </label>
                      <div className="flex">
                        <div className="flex items-center rounded-l-xl border border-r-0 border-neutral-200 bg-neutral-100 px-3 text-sm text-neutral-500 font-bold">
                          <Phone size={13} className="mr-1.5" />+91
                        </div>
                        <input
                          className="w-full rounded-r-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all font-medium"
                          type="tel" required maxLength={10} value={mobile}
                          onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                          placeholder="9876543210" autoFocus
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                        Date of Birth (used as verification)
                      </label>
                      <div className="relative">
                        <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                          type="date"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-9 pr-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all font-medium"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 font-medium">
                      {error}
                    </motion.p>
                  )}

                  <NeonButton variant="game" type="submit" disabled={loading || !canContinue} className="w-full py-3.5 text-sm" id="auth-login-submit">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full" />
                        Signing you in...
                      </span>
                    ) : (
                      <>Login & Continue <ArrowRight size={16} /></>
                    )}
                  </NeonButton>
                </motion.form>
              </AnimatePresence>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-5 border-t border-neutral-100 bg-neutral-50/50">
            <div className="flex flex-wrap justify-center gap-4 text-[11px] text-neutral-400 font-medium">
              <span className="flex items-center gap-1"><Shield size={11} className="text-brand-400" /> 100% Free</span>
              <span className="flex items-center gap-1"><Sparkles size={11} className="text-brand-400" /> No Spam</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={11} className="text-brand-400" /> Privacy Respected</span>
            </div>
          </div>
        </div>

        {/* Floating social proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-5 text-center"
        >
          <p className="text-sm text-neutral-500">
            Join <span className="font-bold text-neutral-700">12,000+</span> Tamil Nadu students already on their journey 🚀
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
