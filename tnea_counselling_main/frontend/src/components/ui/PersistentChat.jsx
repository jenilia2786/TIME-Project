import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic, Send, Sparkles, MessageSquare, X, Bot
} from 'lucide-react'
import useStudentStore from '../../store/useStudentStore'
import { useLocation, useNavigate } from 'react-router-dom'

const CHAT_ROUTES = ['/dashboard', '/courses', '/colleges', '/careers', '/scholarships', '/profile', '/exams', '/predictions', '/roadmap', '/reports', '/settings']

function CrackerBurst({ trigger }) {
  if (!trigger) return null;
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
      {[...Array(30)].map((_, i) => {
        const angle = (Math.random() * Math.PI * 2);
        const velocity = 50 + Math.random() * 100;
        const x = Math.cos(angle) * velocity;
        const y = Math.sin(angle) * velocity;
        const colors = ['bg-brand-500', 'bg-rose-500', 'bg-amber-400', 'bg-sky-400', 'bg-violet-500', 'bg-emerald-400'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        return (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${color}`}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{ x, y, scale: 1, opacity: 0 }}
            transition={{ duration: 0.6 + Math.random() * 0.4, ease: 'easeOut' }}
          />
        );
      })}
    </div>
  );
}

export default function PersistentChat() {
  const { student, onboardingDone } = useStudentStore()
  const location = useLocation()
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false)
  const [burstKey, setBurstKey] = useState(0)

  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [voiceBars, setVoiceBars] = useState([4, 4, 4, 4, 5])

  const recognitionRef = useRef(null)
  const inputRef = useRef(null)

  const firstName = student.loginName?.split(' ')[0] || 'there'
  const isVisible = CHAT_ROUTES.some(r => location.pathname.startsWith(r))

  // Hide on /assistant route entirely
  if (location.pathname.startsWith('/assistant')) return null;

  /* Voice recognition setup */
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const rec = new SR()
    rec.continuous = false
    rec.interimResults = true
    rec.lang = 'en-IN'
    rec.onresult = (e) => {
      let t = ''
      for (let i = e.resultIndex; i < e.results.length; i++) t += e.results[i][0].transcript
      setInput(t)
    }
    rec.onstart = () => setIsListening(true)
    rec.onend = () => setIsListening(false)
    rec.onerror = () => setIsListening(false)
    recognitionRef.current = rec
  }, [])

  /* Animated voice bars */
  useEffect(() => {
    if (!isListening) { setVoiceBars([4, 4, 4, 4, 5]); return }
    const interval = setInterval(() => {
      setVoiceBars([...Array(5)].map(() => Math.floor(Math.random() * 22) + 4))
    }, 120)
    return () => clearInterval(interval)
  }, [isListening])

  const toggleListen = () => {
    if (!recognitionRef.current) return
    if (isListening) { recognitionRef.current.stop() } else { setInput(''); recognitionRef.current.start() }
  }

  const handleSend = (textOverride) => {
    const text = textOverride || input
    if (!text.trim()) return
    if (isListening) recognitionRef.current?.stop()

    navigate('/assistant', { state: { initialQuery: text } })
    setInput('')
    setIsOpen(false)
  }

  const handleOpen = () => {
    setIsOpen(true)
    setBurstKey(k => k + 1)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex items-center justify-end">
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, width: 0, scale: 0.9, originX: 1 }}
            animate={{ opacity: 1, width: 1000, scale: 1 }}
            exit={{ opacity: 0, width: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="h-14 max-w-[calc(100vw-120px)] lg:max-w-[calc(100vw-360px)] bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 rounded-full shadow-2xl flex items-center pl-6 pr-2 mr-4 overflow-hidden"
            style={{ zIndex: 5, boxShadow: '-10px 10px 40px rgba(0,0,0,0.08)' }}
          >
            {/* Input Area */}
            <div className="flex-1 flex items-center h-full mr-6 min-w-0">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Ask AI Mentor for ${firstName}...`}
                className="w-full bg-transparent text-sm font-bold text-neutral-800 dark:text-neutral-100 outline-none placeholder:text-neutral-400 placeholder:font-medium truncate"
              />
            </div>
            {/* Action buttons (Mic/Send) */}
            <div className="flex items-center gap-1 mr-4 shrink-0">
              <motion.button
                onClick={toggleListen}
                whileTap={{ scale: 0.9 }}
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${isListening ? 'bg-brand-100 text-brand-600' : 'text-neutral-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-neutral-800'}`}
              >
                <Mic size={16} className={isListening ? 'animate-pulse' : ''} />
              </motion.button>
              <motion.button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                whileTap={{ scale: 0.9 }}
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${input.trim() ? 'bg-brand-500 text-white shadow-md' : 'text-neutral-300 dark:text-neutral-600'}`}
              >
                {input.trim() ? <Send size={14} /> : <Sparkles size={14} />}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <div className="relative z-10 shrink-0">
        <CrackerBurst trigger={burstKey > 0 ? burstKey : null} />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isOpen ? () => setIsOpen(false) : handleOpen}
          className="relative w-14 h-14 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-xl shadow-brand-500/40 flex items-center justify-center"
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </motion.button>
      </div>

    </div>
  )
}
