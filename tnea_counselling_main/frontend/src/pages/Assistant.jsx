import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Sparkles, Brain, Compass, Users, Bot,
  Plus, Search, Mic, Paperclip, ChevronRight, ChevronLeft,
  AlertCircle, Trash2, ArrowRight, BookOpen, GraduationCap, Map, Building2, Dna, CalendarDays
} from 'lucide-react'
import useStudentStore from '../store/useStudentStore'
import { sendChatMessage } from '../services/chatService'

const SUGGESTIONS = [
  { icon: Building2, label: "TNEA CSE Cutoffs", prompt: "What are the TNEA cutoffs for Computer Science in top government colleges?" },
  { icon: Dna, label: "CS vs Biotech Stream", prompt: "Can you compare the curriculum and placements for B.E. CSE vs B.Tech Biotechnology in Tamil Nadu?" },
  { icon: CalendarDays, label: "12th Career Milestones", prompt: "What are the critical academic milestones and counselling steps after finishing 12th Board exams?" },
  { icon: Map, label: "AI & DS 5-Year Path", prompt: "Explain the career roadmap and job outlook for an AI & Data Science graduate from TNEA." }
]

import { useLocation } from 'react-router-dom'
import useThemeStore from '../store/useThemeStore'

export default function Assistant() {
  const location = useLocation()
  const { student, profileCompletion, aiMessages: messages, addAiMessage, clearAiMessages, activeProfileId } = useStudentStore()
  const collapsed = useThemeStore((s) => s.sidebarCollapsed)
  
  const [inputVal, setInputVal] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const [conversations, setConversations] = useState([])
  const threadEndRef = useRef(null)

  // Panel toggles
  const [isHistoryOpen, setIsHistoryOpen] = useState(true)
  const [isInsightsOpen, setIsInsightsOpen] = useState(true)

  // Scroll to bottom on new messages
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  // Silently persist chat to backend
  const persistMessageToBackend = (role, message) => {
    if (!activeProfileId) return
    const API_BASE = import.meta.env.VITE_API_URL || ''
    fetch(`${API_BASE}/chat-history/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile_id: activeProfileId, role, message })
    }).catch(() => {}) // silently fail
  }

  // Call real AI backend
  const triggerAiResponse = async (userPrompt) => {
    setIsThinking(true)
    try {
      const response = await sendChatMessage(userPrompt)
      
      let aiReply = response.answer
      
      // Interest detection
      const keywords = ['interest', 'study', 'career', 'become', 'want to be', 'engineering', 'medical', 'arts', 'science', 'computer']
      const lowerPrompt = userPrompt.toLowerCase()
      const detected = keywords.some(k => lowerPrompt.includes(k))
      
      if (detected) {
        aiReply += "\n\n---\n*I noticed you mentioned some specific career interests. Would you like to personalize your dashboard based on your recent conversations?*"
      }
      
      addAiMessage({
        id: `ai-reply-${Date.now()}`,
        role: "ai",
        text: aiReply,
        time: "Just now"
      })
      persistMessageToBackend('ai', aiReply)
    } catch (err) {
      addAiMessage({
        id: `ai-error-${Date.now()}`,
        role: "ai",
        text: "I encountered an error connecting to the AI mentor. Please try again.",
        time: "Just now"
      })
    } finally {
      setIsThinking(false)
    }
  }

  const handleSend = (e, overrideText) => {
    e?.preventDefault()
    const userMsg = overrideText || inputVal
    if (!userMsg.trim()) return

    addAiMessage({
      id: `user-msg-${Date.now()}`,
      role: "user",
      text: userMsg,
      time: "Just now"
    })
    persistMessageToBackend('user', userMsg)
    setInputVal("")
    triggerAiResponse(userMsg)

    // Add query to sidebar history if unique
    if (!conversations.some(c => c.title.toLowerCase() === userMsg.toLowerCase())) {
      setConversations(prev => [{ id: Date.now(), title: userMsg.slice(0, 26) + (userMsg.length > 26 ? '...' : ''), date: "Today" }, ...prev])
    }
  }


  // Handle initialQuery from location state
  useEffect(() => {
    if (location.state?.initialQuery) {
      handleSend(null, location.state.initialQuery)
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  // Prevent global body scroll on this full-screen view and reset scroll position
  useEffect(() => {
    window.scrollTo(0, 0)
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const injectPrompt = (promptText) => {
    addAiMessage({
      id: `user-msg-${Date.now()}`,
      role: "user",
      text: promptText,
      time: "Just now"
    })
    triggerAiResponse(promptText)
  }

  const clearHistory = () => {
    setConversations([])
  }

  const centerSpanClass = 
    (isHistoryOpen && isInsightsOpen) ? 'lg:col-span-6' :
    (isHistoryOpen && !isInsightsOpen) ? 'lg:col-span-9' :
    (!isHistoryOpen && isInsightsOpen) ? 'lg:col-span-9' : 'lg:col-span-12';

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-transparent">
      {/* Page Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 px-5 lg:px-7 pt-6 lg:pt-[88px] shrink-0 transition-all duration-300 ${collapsed ? 'lg:pl-20' : ''}`}>
        <div className="flex items-center gap-3 transition-all duration-300">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shrink-0" style={{ boxShadow: '0 4px 15px rgba(20,184,166,0.4)' }}>
            <Bot size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-neutral-900 dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              AI Guidance
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Your personalized AI career mentor for admissions and opportunities.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 px-4 pb-4 bg-transparent relative">
        
        {/* ─── Column 1: History & Saved Prompts (Sidebar) ─── */}
        <AnimatePresence>
          {isHistoryOpen && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="hidden lg:flex lg:col-span-3 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 rounded-3xl flex-col justify-between p-4 h-full relative min-h-0 shadow-sm"
            >

              <button onClick={() => setIsHistoryOpen(false)} className="absolute top-4 right-4 p-1 text-neutral-400 hover:text-neutral-600 bg-neutral-50 rounded hover:bg-neutral-100 transition-colors z-10" title="Close history">
                <ChevronLeft size={16} />
              </button>
              
              <div className="flex flex-col gap-5 overflow-y-auto h-full pr-2" data-lenis-prevent="true">
                {/* New Chat Button */}
                <button
                  onClick={clearAiMessages}
                  className="flex items-center justify-center gap-2 w-[calc(100%-24px)] py-3 rounded-2xl border border-brand-100 hover:border-brand-200 text-xs font-black tracking-wide uppercase text-brand-600 bg-brand-50/50 hover:bg-brand-50 transition-all shadow-sm"
                >
                  <Plus size={14} /> New Conversation
                </button>

                {/* Search bar */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-100 bg-neutral-50/50 text-xs text-neutral-700 placeholder-neutral-450 focus:outline-none focus:border-brand-300 focus:bg-white transition-all"
                  />
                </div>

                {/* History Lists */}
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">History</span>
                  <div className="flex flex-col gap-1.5 overflow-y-auto hide-scrollbar max-h-[300px] pr-1" data-lenis-prevent="true">
                    {conversations.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => injectPrompt(c.title)}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl text-left text-xs font-bold text-neutral-600 hover:text-brand-600 hover:bg-brand-50/40 border border-transparent hover:border-brand-100/30 transition-all group"
                      >
                        <BookOpen size={12} className="text-neutral-400 group-hover:text-brand-500 shrink-0" />
                        <span className="truncate flex-1">{c.title}</span>
                        <ChevronRight size={10} className="text-neutral-350 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    ))}
                    {conversations.length === 0 && (
                      <p className="text-xs text-neutral-400 italic text-center py-4">No recent queries</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Clear Trigger */}
              {conversations.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="mt-4 flex items-center justify-center gap-2 py-3 border border-transparent hover:border-rose-100 text-xs font-bold text-neutral-400 hover:text-rose-500 rounded-xl hover:bg-rose-50/30 transition-all shrink-0"
                >
                  <Trash2 size={13} /> Clear Query Logs
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Column 2: Main Conversational Workspace ─── */}
        <div className={`col-span-1 ${centerSpanClass} min-h-0 flex flex-col justify-between h-full bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 rounded-3xl relative transition-all duration-300 shadow-sm overflow-hidden`}>
          
          {/* Floating AI Cognitive Orb in background */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 pointer-events-none z-0">
            <motion.div
              animate={{
                scale: isThinking ? [1, 1.15, 1] : [1, 1.05, 1],
                rotate: 360,
                y: [-5, 5, -5]
              }}
              transition={{
                scale: { duration: isThinking ? 1.2 : 4, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
              }}
              className={`w-32 h-32 rounded-full bg-gradient-to-tr from-brand-300 via-teal-200 to-violet-300 opacity-[0.14] blur-xl`}
            />
          </div>

          {/* Workspace Conversation Header */}
          <div className="relative z-10 p-4 flex items-center justify-between bg-transparent">
            <div className="flex items-center gap-3">
              {!isHistoryOpen && (
                <button onClick={() => setIsHistoryOpen(true)} className="p-1.5 bg-neutral-100 rounded-lg hover:bg-neutral-200 text-neutral-500 transition-colors" title="Open history">
                  <ChevronRight size={16} />
                </button>
              )}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white shadow-glow-teal shrink-0">
                <Bot size={18} className="animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-neutral-900 tracking-tight">AI Career Mentor</h3>
                <p className="text-[9px] text-teal-600 font-bold uppercase tracking-wider">Connected & Ready</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-500">
                <Sparkles size={11} className="text-brand-500" /> TNEA Expert V2
              </span>
              {!isInsightsOpen && (
                <button onClick={() => setIsInsightsOpen(true)} className="p-1.5 bg-neutral-100 rounded-lg hover:bg-neutral-200 text-neutral-500 transition-colors" title="Open insights">
                  <ChevronLeft size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Message Thread Scroll Container */}
          <div className="relative z-10 flex-1 overflow-y-auto hide-scrollbar p-4 sm:p-6 flex flex-col gap-6" data-lenis-prevent="true">
            
            <AnimatePresence mode="popLayout">
              {messages.map((m) => {
                const isAi = m.role === "ai" || m.sender === "system"
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
                    className={`flex gap-3 max-w-[85%] ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                  >
                    {/* Icon Badge */}
                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold border ${
                      isAi
                        ? 'bg-brand-50 border-brand-100 text-brand-600'
                        : 'bg-gradient-to-br from-violet-500 to-purple-500 border-transparent text-white shadow-md'
                    }`}>
                      {isAi ? <Bot size={14} /> : student.loginName ? student.loginName[0].toUpperCase() : 'U'}
                    </div>

                    {/* Message Bubble */}
                    <div className="flex flex-col gap-1 max-w-[calc(100%-2.5rem)]">
                      {!isAi && <span className="text-[9px] font-bold text-neutral-400 px-1 text-right">{student.loginName || 'User'}</span>}
                      <div className={`p-4 rounded-2xl border leading-relaxed text-xs font-medium whitespace-pre-line transition-all ${
                        isAi
                          ? 'bg-neutral-50/50 border-neutral-200/50 text-neutral-700 shadow-sm'
                          : 'bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/10'
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  </motion.div>
                )
              })}

              {/* Simulated Thinking indicator */}
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-3 mr-auto items-center"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                    <Bot size={14} className="animate-spin" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-neutral-50/50 border border-neutral-200/50 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={threadEndRef} />
          </div>

          {/* Input Bar & Suggestions Dock */}
          <div className="relative z-10 p-4 bg-gradient-to-t from-white via-white/80 to-transparent">
            
            {/* Suggestion Chips */}
            {messages.length <= 2 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => injectPrompt(s.prompt)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-100 bg-white hover:border-brand-200 hover:bg-brand-50/30 text-[10px] font-bold text-neutral-600 hover:text-brand-600 shadow-sm transition-all"
                  >
                    <s.icon size={12} className="text-brand-500 shrink-0" /> {s.label}
                  </button>
                ))}
              </div>
            )}

            {/* The Active Input Bar */}
            <form onSubmit={handleSend} className="flex items-center gap-2.5 bg-neutral-50/70 border border-neutral-200/50 p-2 rounded-2xl focus-within:border-brand-300 focus-within:bg-white transition-all shadow-sm">
              <button
                type="button"
                className="p-2 text-neutral-400 hover:text-brand-500 rounded-lg hover:bg-neutral-100 transition-colors shrink-0"
                title="Attach context file"
              >
                <Paperclip size={16} />
              </button>
              
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask me anything (e.g. Trichy cutoffs, streams)..."
                className="flex-1 bg-transparent border-none text-xs text-neutral-700 placeholder-neutral-400 focus:outline-none py-1.5"
              />

              <button
                type="button"
                className="p-2 text-neutral-400 hover:text-brand-500 rounded-lg hover:bg-neutral-100 transition-colors shrink-0"
                title="Voice input support"
              >
                <Mic size={16} />
              </button>

              <button
                type="submit"
                disabled={!inputVal.trim()}
                className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  inputVal.trim()
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20 hover:scale-105'
                    : 'bg-neutral-100 text-neutral-350'
                }`}
              >
                <Send size={14} />
              </button>
            </form>
          </div>

        </div>

        {/* ─── Column 3: Live Guidance Insight Panel (Right) ─── */}
        <AnimatePresence>
          {isInsightsOpen && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="hidden lg:flex lg:col-span-3 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 rounded-3xl flex-col p-5 gap-6 h-full overflow-y-auto hide-scrollbar relative min-h-0 shadow-sm"
              data-lenis-prevent="true"
            >

              <button onClick={() => setIsInsightsOpen(false)} className="absolute top-4 left-4 p-1 text-neutral-400 hover:text-neutral-600 bg-neutral-50 rounded hover:bg-neutral-100 transition-colors z-10" title="Close insights">
                <ChevronRight size={16} />
              </button>

              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block pl-8">Student Guidance Scope</span>
              
              {/* Student Profile Overview Card */}
              <div className="p-5 rounded-2xl bg-white border border-neutral-100 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-brand-500 flex items-center justify-center text-white text-[10px] font-bold shadow-md shrink-0">
                    {student.name ? student.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() : 'ST'}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-neutral-800 tracking-tight">{student.name || 'Student'}</h4>
                    <p className="text-[9px] text-neutral-400 font-bold uppercase">{student.standard || '12th Grade'} · {student.district || 'Tamil Nadu'}</p>
                  </div>
                </div>
                
                <div className="h-px bg-neutral-150" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wide">Community</p>
                    <p className="text-xs font-black text-neutral-700 mt-0.5">{student.community || 'Open Category'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wide">Ready score</p>
                    <p className="text-xs font-black text-brand-600 mt-0.5">{profileCompletion}% Complete</p>
                  </div>
                </div>
              </div>

              {/* Live Compatibility Insights Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-50/50 to-cyan-50/50 border border-brand-100/30 flex flex-col gap-3">
                <h5 className="font-bold text-xs text-brand-700 flex items-center gap-1.5">
                  <Brain size={14} className="shrink-0" /> Cognitive Aptitude matches
                </h5>
                <p className="text-[11px] text-neutral-600 leading-relaxed font-medium">
                  Based on active profile preferences, matches cluster high in **Logic** and **Curiosity**. 
                  Engineering Star and emerging technology timelines exhibit a **96.4% compatibility rating**.
                </p>
                <div className="flex items-center gap-1 text-[10px] font-extrabold tracking-wide uppercase text-brand-600 mt-1 cursor-pointer hover:translate-x-0.5 transition-transform" onClick={() => injectPrompt("Compare B.E. Computer Science vs B.E. AI & Data Science compatibility")}>
                  Ask Compatibility Details <ArrowRight size={10} />
                </div>
              </div>

              {/* Dynamic mini-roadmap widget */}
              <div className="p-5 rounded-2xl bg-white border border-neutral-100 shadow-sm flex flex-col gap-4">
                <h5 className="font-bold text-xs text-neutral-800 flex items-center gap-1.5">
                  <Map size={14} className="text-neutral-500 shrink-0" /> Milestone Checkpoints
                </h5>
                <div className="relative pl-3.5 flex flex-col gap-3 text-[10px]">
                  <div className="absolute left-[3.5px] top-1.5 bottom-1.5 w-0.5 bg-neutral-150" />
                  
                  <button
                    onClick={() => injectPrompt("What group after 10th aligns with high computer aptitude?")}
                    className="flex items-center gap-2 relative text-left group hover:text-brand-600 transition-colors"
                  >
                    <div className="absolute -left-[14px] w-2 h-2 rounded-full bg-brand-500 border border-white shadow-sm shadow-brand-500/30" />
                    <span className="font-bold text-neutral-850 group-hover:text-brand-600 transition-colors">11th: Physics-Chemistry-Maths</span>
                  </button>

                  <button
                    onClick={() => injectPrompt("Tell me about Anna University colleges cutoff trends")}
                    className="flex items-center gap-2 relative text-left group hover:text-brand-600 transition-colors"
                  >
                    <div className="absolute -left-[14px] w-2 h-2 rounded-full bg-brand-500 border border-white shadow-sm shadow-brand-500/30" />
                    <span className="font-bold text-neutral-850 group-hover:text-brand-600 transition-colors">College: B.Tech AI & Data Science</span>
                  </button>

                  <button
                    onClick={() => injectPrompt("Draft placements profile checklist for software engineer")}
                    className="flex items-center gap-2 relative text-left group hover:text-brand-600 transition-colors"
                  >
                    <div className="absolute -left-[14px] w-2 h-2 rounded-full bg-neutral-200 border border-white" />
                    <span className="font-bold text-neutral-400 group-hover:text-brand-600 transition-colors">Industry Placement (Tech Architect)</span>
                  </button>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
