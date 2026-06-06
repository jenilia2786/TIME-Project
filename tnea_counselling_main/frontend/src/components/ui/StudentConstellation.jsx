import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Sparkles, AlertCircle, CheckCircle2, Compass } from 'lucide-react'

const PROBLEM_NODES = [
  { id: 'p1', label: 'Career confusion', solution: 'AI Guidance Paths', x: '25%', y: '25%', color: '#14b8a6', activeColor: '#14b8a6', delay: 0, duration: 4 },
  { id: 'p2', label: 'Fear of wrong decisions', solution: 'Personalized Clarity', x: '75%', y: '25%', color: '#3b82f6', activeColor: '#3b82f6', delay: 0.5, duration: 5 },
  { id: 'p3', label: 'Which college suits me?', solution: 'Smart College Matches', x: '25%', y: '70%', color: '#8b5cf6', activeColor: '#8b5cf6', delay: 1, duration: 4.5 },
  { id: 'p4', label: 'Information overload', solution: 'Step-by-step Roadmaps', x: '75%', y: '70%', color: '#ec4899', activeColor: '#ec4899', delay: 1.5, duration: 5.5 },
  { id: 'p5', label: 'Group selection stress', solution: 'Domain Exploration', x: '50%', y: '15%', color: '#f59e0b', activeColor: '#f59e0b', delay: 2, duration: 4.2 },
  { id: 'p6', label: 'Lack of awareness', solution: 'Futuristic Insights', x: '50%', y: '82%', color: '#10b981', activeColor: '#10b981', delay: 2.5, duration: 4.8 },
]

const CENTER = { x: '50%', y: '48%' }

export default function StudentConstellation() {
  const [hoveredNode, setHoveredNode] = useState(null)
  
  const activeNodeData = PROBLEM_NODES.find(n => n.id === hoveredNode)

  return (
    <div className="relative w-full h-[450px] select-none overflow-hidden">
      {/* Immersive Background */}
      <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.03),transparent)]" />
      
      {/* Particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-1 h-1 rounded-full bg-teal-400"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
            filter: 'blur(1px)',
          }}
        />
      ))}

      {/* SVG connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 450" preserveAspectRatio="none">
        {PROBLEM_NODES.map((node) => {
          const isHovered = hoveredNode === node.id
          const isAnyHovered = hoveredNode !== null
          
          return (
            <motion.line
              key={`line-${node.id}`}
              x1="300" y1="216"
              x2={parseFloat(node.x) * 6}
              y2={parseFloat(node.y) * 4.5}
              stroke={isHovered ? node.activeColor : (isAnyHovered ? '#cbd5e1' : node.color)}
              strokeWidth={isHovered ? "2.5" : "1"}
              strokeDasharray={isHovered ? "0" : "4 4"}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: isHovered ? 0.8 : (isAnyHovered ? 0.1 : 0.3) 
              }}
              transition={{ duration: 0.5 }}
            />
          )
        })}
        {/* Animated Light Particles on lines when hovered */}
        {PROBLEM_NODES.map((node) => {
          if (hoveredNode !== node.id) return null;
          return (
            <motion.circle
              key={`particle-line-${node.id}`}
              r="3"
              fill={node.activeColor}
              initial={{ offsetDistance: "0%" }}
              animate={{ offsetDistance: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              style={{
                offsetPath: `path('M 300 216 L ${parseFloat(node.x) * 6} ${parseFloat(node.y) * 4.5}')`
              }}
            />
          )
        })}
      </svg>

      {/* Center node: YOU */}
      <div
        className="absolute z-20"
        style={{ left: CENTER.x, top: CENTER.y, transform: 'translate(-50%, -50%)' }}
      >
        <motion.div
          animate={{
            scale: hoveredNode ? 1.05 : [1, 1.08, 1],
            boxShadow: hoveredNode
              ? '0 0 30px rgba(20,184,166,0.5)'
              : ['0 0 20px rgba(244,63,94,0.2)', '0 0 40px rgba(244,63,94,0.4)', '0 0 20px rgba(244,63,94,0.2)'],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-24 h-24 rounded-full flex flex-col items-center justify-center transition-colors duration-500"
          style={{
            background: hoveredNode && activeNodeData
              ? `linear-gradient(135deg, ${activeNodeData.activeColor}, ${activeNodeData.activeColor}dd)`
              : 'linear-gradient(135deg, #14b8a6, #0ea5e9)',
          }}
        >
          <motion.div className="flex flex-col items-center" animate={{ scale: hoveredNode ? 1.1 : 1 }}>
            {hoveredNode ? (
              <Sparkles size={26} className="text-white mb-1" />
            ) : (
              <Compass size={26} className="text-white mb-1" />
            )}
            <span className="text-[10px] text-white font-black tracking-widest uppercase block text-center">YOU</span>
          </motion.div>

          {/* Breathing rings */}
          <motion.div
            animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 rounded-full border border-white"
          />
          <motion.div
            animate={{ scale: [1, 2.2, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            className="absolute inset-0 rounded-full border border-white"
          />
        </motion.div>
      </div>

      {/* Floating Problem Pills */}
      {PROBLEM_NODES.map((node) => {
        const isHovered = hoveredNode === node.id
        const isAnyHovered = hoveredNode !== null && !isHovered

        return (
          <div
            key={`pill-wrapper-${node.id}`}
            className="absolute z-30"
            style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)' }}
          >
            <motion.div
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              animate={{
                y: isHovered ? 0 : [-8, 8, -8],
                x: isHovered ? 0 : [-4, 4, -4],
                opacity: isAnyHovered ? 0.3 : 1,
                scale: isHovered ? 1.05 : (isAnyHovered ? 0.95 : 1),
              }}
              transition={{ 
                y: { duration: node.duration, repeat: Infinity, ease: 'easeInOut', delay: node.delay },
                x: { duration: node.duration * 1.2, repeat: Infinity, ease: 'easeInOut', delay: node.delay },
                scale: { duration: 0.3 },
                opacity: { duration: 0.3 }
              }}
            >
              <div
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-[11px] font-bold shadow-lg whitespace-nowrap transition-all duration-300 bg-white`}
                style={{
                  background: isHovered 
                    ? `linear-gradient(135deg, ${node.activeColor}, ${node.activeColor}dd)` 
                    : 'white',
                  border: `1.5px solid ${isHovered ? 'transparent' : node.color}`,
                  color: isHovered ? 'white' : node.color,
                  boxShadow: isHovered 
                    ? `0 8px 24px ${node.activeColor}66, 0 0 0 2px white` 
                    : `0 4px 16px ${node.color}22`,
                }}
              >
                <AnimatePresence mode="wait">
                  {isHovered ? (
                    <motion.div key="solution" initial={{ opacity: 0, w: 0 }} animate={{ opacity: 1, w: 'auto' }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-white" />
                      <span>{node.solution}</span>
                    </motion.div>
                  ) : (
                    <motion.div key="problem" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                      <AlertCircle size={14} />
                      <span>{node.label}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )
      })}

      {/* Guidance Text */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <motion.div
          animate={{ opacity: hoveredNode ? 1 : 0.6 }}
          className="flex flex-col items-center gap-1"
        >
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
            {hoveredNode ? 'Clarity Found' : 'Hover a problem to see clarity'}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
