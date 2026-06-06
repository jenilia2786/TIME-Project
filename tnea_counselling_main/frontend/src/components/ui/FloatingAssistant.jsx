import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Mic, Sparkles, Loader2, Maximize2, Minimize2 } from 'lucide-react'
import useStudentStore from '../../store/useStudentStore'

const presetPrompts = [
  "What courses should I pick?",
  "How to get a scholarship?",
  "Top colleges in Chennai",
  "Engineering vs Medical"
]

export default function FloatingAssistant() {
  const { isAiAssistantOpen, toggleAiAssistant, aiMessages, addAiMessage, student } = useStudentStore()
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Voice state
  const [isListening, setIsListening] = useState(false)
  const [voiceVolume, setVoiceVolume] = useState(0)
  const recognitionRef = useRef(null)
  
  const endOfMessagesRef = useRef(null)

  // Scroll to bottom on new message
  useEffect(() => {
    if (isAiAssistantOpen) {
      endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [aiMessages, isAiAssistantOpen, isTyping])

  // Setup Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const rec = new SpeechRecognition()
      rec.continuous = true
      rec.interimResults = true
      rec.lang = 'en-IN'

      rec.onresult = (event) => {
        let currentTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript
        }
        setInput(currentTranscript)
      }

      rec.onstart = () => setIsListening(true)
      rec.onend = () => setIsListening(false)
      rec.onerror = (e) => { console.error('Speech recognition error', e); setIsListening(false) }

      recognitionRef.current = rec
    }
  }, [])

  // Fake volume meter for mic visualizer
  useEffect(() => {
    let interval
    if (isListening) {
      interval = setInterval(() => {
        setVoiceVolume(Math.random() * 100)
      }, 100)
    } else {
      setVoiceVolume(0)
    }
    return () => clearInterval(interval)
  }, [isListening])

  const toggleListen = () => {
    if (!recognitionRef.current) return alert("Speech recognition not supported in this browser.")
    if (isListening) {
      recognitionRef.current.stop()
    } else {
      setInput('')
      recognitionRef.current.start()
    }
  }

  const handleSend = async (textOverride) => {
    const text = textOverride || input
    if (!text.trim()) return

    if (isListening) recognitionRef.current?.stop()

    // Add user message
    addAiMessage({ role: 'user', text, time: Date.now() })
    setInput('')
    setIsTyping(true)

    // Simulate AI thinking
    setTimeout(() => {
      setIsTyping(false)
      addAiMessage({ 
        role: 'ai', 
        text: `Here is some tailored guidance for ${text}. (This is a simulated AI response adapting to your profile!)`, 
        time: Date.now() 
      })
    }, 1500)
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {!isAiAssistantOpen && (
          <motion.button
            id="ai-assistant-toggle"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleAiAssistant(true)}
            className="fixed bottom-6 right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-cyan-500 shadow-[0_8px_30px_rgba(20,184,166,0.4)] transition-all hover:shadow-[0_8px_40px_rgba(20,184,166,0.6)]"
          >
            <div className="absolute inset-0 rounded-full bg-white/ dark:bg-slate-800/ animate-ping" style={{ animationDuration: '3s' }} />
            <Sparkles size={24} className="text-white relative z-10" />
            
            {/* Notification Dot */}
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 border-2 border-white dark:border-slate-700 shadow-sm" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isAiAssistantOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`fixed z-[100] flex flex-col overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] border border-white/ dark:border-slate-700/ transition-all duration-300 ease-in-out ${
              isExpanded 
                ? 'bottom-4 right-4 left-4 top-4 md:bottom-6 md:right-6 md:w-[450px] md:top-6 md:left-auto rounded-[2rem]' 
                : 'bottom-4 right-4 w-[calc(100vw-2rem)] h-[550px] md:bottom-6 md:right-6 md:w-[380px] rounded-3xl'
            }`}
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-brand-50/80 to-cyan-50/80 border-b border-brand-100/50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-glow-teal">
                    <Sparkles size={18} className="text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-700" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>AI Mentor</h3>
                  <p className="text-[10px] font-medium text-brand-600 flex items-center gap-1">
                    <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span></span>
                    Always here to help
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setIsExpanded(!isExpanded)} className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-white/ dark:bg-slate-800/ hover:text-neutral-700 transition-colors">
                  {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button onClick={() => toggleAiAssistant(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-white/ dark:bg-slate-800/ hover:text-neutral-700 transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-hide">
              {aiMessages.map((msg, idx) => (
                <motion.div 
                  key={msg.id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-tr-[4px]' 
                      : 'bg-white dark:bg-slate-800 border border-neutral-100 text-neutral-800 rounded-tl-[4px]'
                  }`}>
                    <p className="leading-relaxed">{msg.text}</p>
                    {msg.time && (
                      <p className={`text-[9px] mt-1.5 ${msg.role === 'user' ? 'text-white/70 text-right' : 'text-neutral-400'}`}>
                        {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 border border-neutral-100 rounded-2xl rounded-tl-[4px] px-4 py-3 shadow-sm flex items-center gap-1.5">
                    <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-neutral-300 rounded-full" />
                    <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-neutral-300 rounded-full" />
                    <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-neutral-300 rounded-full" />
                  </div>
                </motion.div>
              )}
              <div ref={endOfMessagesRef} />
            </div>

            {/* Suggestions */}
            {!isTyping && aiMessages[aiMessages.length - 1]?.role === 'ai' && (
              <div className="px-5 pb-3">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                  {presetPrompts.map((p) => (
                    <button 
                      key={p} 
                      onClick={() => handleSend(p)}
                      className="shrink-0 rounded-full border border-brand-100 bg-brand-50/50 px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-100 hover:border-brand-200 transition-colors whitespace-nowrap"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white/ dark:bg-slate-800/ border-t border-neutral-100/50 backdrop-blur-md">
              <div className="relative flex items-center bg-white dark:bg-slate-800 rounded-2xl border border-neutral-200 shadow-sm overflow-hidden focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100/50 transition-all">
                
                {/* Voice Visualizer Overlay */}
                <AnimatePresence>
                  {isListening && (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-brand-50 flex items-center px-4 gap-1 z-10"
                    >
                      <div className="flex items-end gap-1 h-6 w-full max-w-[100px] mr-auto">
                        {[...Array(6)].map((_, i) => (
                          <motion.div 
                            key={i}
                            animate={{ height: isListening ? Math.max(4, Math.random() * 24) : 4 }}
                            transition={{ duration: 0.1, repeat: Infinity }}
                            className="w-1.5 bg-brand-500 rounded-full"
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-brand-600 animate-pulse mr-2">Listening...</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                  onClick={toggleListen}
                  className={`flex h-12 w-12 items-center justify-center transition-colors z-20 ${
                    isListening ? 'text-brand-600 bg-brand-100' : 'text-neutral-400 hover:text-brand-500 hover:bg-neutral-50'
                  }`}
                >
                  <Mic size={18} className={isListening ? 'animate-pulse' : ''} />
                </button>
                
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent py-3 px-2 text-sm font-medium text-neutral-900 outline-none placeholder:text-neutral-400 z-0"
                />
                
                <button 
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className={`flex h-12 w-12 items-center justify-center transition-colors z-20 ${
                    input.trim() ? 'text-white bg-brand-500 hover:bg-brand-600' : 'text-neutral-300 bg-transparent'
                  }`}
                >
                  <Send size={16} className={input.trim() ? 'translate-x-[-1px] translate-y-[1px]' : ''} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
