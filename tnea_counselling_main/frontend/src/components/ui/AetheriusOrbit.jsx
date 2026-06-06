import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Cpu, Heart, Palette, Sparkles, Compass, Target, ArrowRight } from 'lucide-react'

const CONSTELLATIONS = {
  engineering: {
    name: "Engineering & Tech",
    tagline: "The Architect of Futures",
    color: "from-sky-400 to-blue-500",
    glow: "shadow-[0_0_40px_rgba(14,165,233,0.45)] border-sky-300/50",
    icon: Cpu,
    skills: ["Logic", "Creativity"],
    quote: "Your high Logic and Creativity form a radiant neon path. The digital landscape welcomes your architecture—a future of building intelligent software and emerging engineering awaits you.",
    starPos: { x: "20%", y: "25%" },
    pathD: "M 150,200 Q 100,150 60,87",
    pathHex: "#0ea5e9"
  },
  government: {
    name: "Government",
    tagline: "The Civic Leader",
    color: "from-orange-400 to-amber-500",
    glow: "shadow-[0_0_40px_rgba(249,115,22,0.45)] border-orange-300/50",
    icon: Target,
    skills: ["Leadership", "Logic"],
    quote: "Your strategic Leadership and sound Logic form the pillars of civic duty. A noble path of public service, policy making, and governance awaits your guidance.",
    starPos: { x: "80%", y: "25%" },
    pathD: "M 150,200 Q 200,150 240,87",
    pathHex: "#f97316"
  },
  healing: {
    name: "Medicine & Healthcare",
    tagline: "The Compassionate Guardian",
    color: "from-emerald-400 to-green-500",
    glow: "shadow-[0_0_40px_rgba(16,185,129,0.45)] border-emerald-300/50",
    icon: Heart,
    skills: ["Empathy", "Logic"],
    quote: "Your deep Empathy and Logic align seamlessly with the healing arts. A peaceful pathway of medical discovery, comforting care, and healthcare innovation opens to guide your footsteps.",
    starPos: { x: "80%", y: "80%" },
    pathD: "M 150,200 Q 200,240 240,280",
    pathHex: "#10b981"
  },
  creative: {
    name: "Design & Arts",
    tagline: "The Expressive Trailblazer",
    color: "from-pink-400 to-rose-500",
    glow: "shadow-[0_0_40px_rgba(244,114,182,0.45)] border-pink-300/50",
    icon: Palette,
    skills: ["Creativity", "Empathy"],
    quote: "Your vibrant Creativity and Empathy unlock the portals of pure expression. Design frameworks, interactive media, and immersive arts align to amplify your unique voice and vision.",
    starPos: { x: "20%", y: "80%" },
    pathD: "M 150,200 Q 100,240 60,280",
    pathHex: "#f472b6"
  }
}

const SKILLS = [
  { name: "Logic", color: "bg-blue-500/10 text-blue-600 border-blue-200/50", basePos: { x: "50%", y: "12%" } },
  { name: "Creativity", color: "bg-pink-500/10 text-pink-600 border-pink-200/50", basePos: { x: "20%", y: "50%" } },
  { name: "Empathy", color: "bg-emerald-500/10 text-emerald-600 border-emerald-200/50", basePos: { x: "50%", y: "88%" } },
  { name: "Leadership", color: "bg-orange-500/10 text-orange-600 border-orange-200/50", basePos: { x: "80%", y: "50%" } }
]

export default function AetheriusOrbit() {
  const [activeStar, setActiveStar] = useState("engineering")
  const data = CONSTELLATIONS[activeStar]
  const ActiveIcon = data.icon

  // Automatically cycle stars every 5 seconds, resetting on interaction
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStar(prev => {
        if (prev === "engineering") return "government"
        if (prev === "government") return "healing"
        if (prev === "healing") return "creative"
        return "engineering"
      })
    }, 5000)
    return () => clearInterval(timer)
  }, [activeStar])

  return (
    <div className="relative w-full min-h-[520px] flex flex-col justify-between p-6 sm:p-8 rounded-[2.5rem] bg-gradient-to-b from-white/60 to-white/30 backdrop-blur-xl border border-white/ dark:border-slate-700/ shadow-xl overflow-hidden group">
      
      {/* 1. Celestial background stars & glowing aura */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2.5rem]">
        {/* Subtle dynamic glow */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`glow-${activeStar}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1.2 }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-tr ${data.color} opacity-[0.08] blur-3xl`}
          />
        </AnimatePresence>

        {/* Tiny stars */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.2, 1] }}
            transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.2 }}
            className="absolute w-1 h-1 bg-neutral-300 rounded-full"
            style={{
              top: `${15 + (i * 73) % 70}%`,
              left: `${10 + (i * 47) % 80}%`
            }}
          />
        ))}
      </div>

      {/* 2. Top Title Info */}
      <div className="relative z-10 w-full flex items-center justify-between">
        <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/ dark:bg-slate-800/ border border-neutral-100 text-neutral-500 text-[10px] font-extrabold tracking-widest uppercase shadow-sm">
          <Sparkles size={11} className="text-brand-500 animate-pulse" /> Constellation View
        </span>
        <span className="text-[10px] text-neutral-400 font-bold tracking-wider uppercase">
          Tap stars to explore
        </span>
      </div>

      {/* 3. Immersive Constellation Scene */}
      <div className="relative z-10 flex-1 w-full min-h-[300px] flex items-center justify-center">
        
        {/* SVG Neon Pathway Connectors */}
        <svg className="absolute w-[300px] h-[350px] pointer-events-none z-0" viewBox="0 0 300 350" fill="none">
          {Object.entries(CONSTELLATIONS).map(([key, item]) => {
            const isActive = activeStar === key
            return (
              <g key={`path-${key}`}>
                {/* Base pathway thread */}
                <path
                  d={item.pathD}
                  stroke={isActive ? "url(#activeGrad)" : "#e5e7eb"}
                  strokeWidth={isActive ? "2.5" : "1.5"}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
                
                {/* Pulsing neon light trail traveling down path */}
                {isActive && (
                  <motion.path
                    d={item.pathD}
                    stroke={`url(#activePulse)`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray="10, 80"
                    animate={{ strokeDashoffset: [-90, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </g>
            )
          })}

          <defs>
            <linearGradient id="activeGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#e5e7eb" stopOpacity="0.2" />
              <stop offset="100%" stopColor={data.pathHex} stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="activePulse" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={data.pathHex} stopOpacity="0" />
              <stop offset="50%" stopColor={data.pathHex} stopOpacity="1" />
              <stop offset="100%" stopColor={data.pathHex} stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* --- Center: The Student Pulse Core --- */}
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-brand-500 via-teal-400 to-cyan-300 p-0.5 shadow-lg shadow-teal-500/20"
        >
          <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="text-brand-500"
            >
              <Compass size={22} className="stroke-[1.5]" />
            </motion.div>
            <span className="text-[9px] font-black text-neutral-800 tracking-wider uppercase mt-0.5">You</span>
            
            {/* Breathing aura rings */}
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2 border-brand-200 pointer-events-none"
            />
          </div>
        </motion.div>

        {/* --- Skill Orbitals --- */}
        {SKILLS.map((skill) => {
          const isMatching = data.skills.includes(skill.name)
          return (
            <div 
              key={`wrapper-${skill.name}`}
              className="absolute z-10"
              style={{ left: skill.basePos.x, top: skill.basePos.y, transform: "translate(-50%, -50%)" }}
            >
              <motion.div
                key={skill.name}
                animate={isMatching ? {
                  scale: [1, 1.08, 1],
                  y: [0, -3, 0],
                  boxShadow: "0 4px 15px rgba(20,184,166,0.06)",
                  borderColor: "rgba(20, 184, 166, 0.3)"
                } : {
                  scale: 0.9,
                  borderColor: "rgba(229, 231, 235, 0.3)"
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className={`px-3 py-1.5 rounded-full border text-[10px] font-bold transition-colors duration-500 ${
                  isMatching ? skill.color : "bg-white/ dark:bg-slate-800/ text-neutral-400 border-neutral-200/40"
                }`}
              >
                {skill.name}
              </motion.div>
            </div>
          )
        })}

        {/* --- Outer Elements: Glowing Career Constellation Stars --- */}
        {Object.entries(CONSTELLATIONS).map(([key, item]) => {
          const StarIcon = item.icon
          const isActive = activeStar === key
          return (
            <button
              key={key}
              onClick={() => setActiveStar(key)}
              className="absolute group z-20"
              style={{ left: item.starPos.x, top: item.starPos.y, transform: "translate(-50%, -50%)" }}
            >
              <div className="flex flex-col items-center gap-2">
                {/* Glowing Star Orb */}
                <motion.div
                  animate={isActive ? {
                    scale: [1, 1.1, 1],
                    y: [-2, 2, -2]
                  } : {
                    y: 0,
                    scale: 0.95
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className={`w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border flex items-center justify-center transition-all duration-500 ${
                    isActive
                      ? `bg-gradient-to-tr ${item.color} text-white ${item.glow}`
                      : "text-neutral-400 border-neutral-200 shadow-sm hover:border-neutral-300 hover:text-neutral-700"
                  }`}
                >
                  <StarIcon size={20} className={isActive ? "animate-pulse" : ""} />
                </motion.div>
                
                {/* Lbl */}
                <span className={`text-[10px] font-extrabold tracking-wide uppercase px-2 py-0.5 rounded transition-all duration-300 ${
                  isActive ? "text-neutral-900 bg-white dark:bg-slate-800 shadow-sm border border-neutral-100 scale-105 font-black" : "text-neutral-400 group-hover:text-neutral-600"
                }`}>
                  {item.name}
                </span>
              </div>
            </button>
          )
        })}

      </div>

      {/* 4. Minimalist Emotional Storytelling Panel */}
      <motion.div
        key={activeStar}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full p-5 rounded-2xl bg-white/ dark:bg-slate-800/ backdrop-blur-md border border-white/ dark:border-slate-700/ shadow-sm flex flex-col gap-3"
      >
        <div>
          <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md text-white bg-gradient-to-r ${data.color}`}>
            {data.tagline}
          </span>
          <h4 className="font-black text-sm text-neutral-900 mt-2 flex items-center gap-1.5">
            {data.name} Constellation
          </h4>
        </div>
        <p className="text-xs text-neutral-500 font-medium leading-relaxed italic">
          "{data.quote}"
        </p>

        <div className="flex items-center justify-between mt-2 pt-3 border-t border-neutral-100">
          <div className="flex gap-1.5">
            {data.skills.map((s) => (
              <span key={s} className="text-[9px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                ✦ {s} Match
              </span>
            ))}
          </div>
          <button className={`flex items-center gap-1 text-[10px] font-extrabold tracking-wide uppercase bg-gradient-to-r ${data.color} bg-clip-text text-transparent group/btn`}>
            Navigate Stars <ArrowRight size={10} className="text-brand-500 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>

    </div>
  )
}
