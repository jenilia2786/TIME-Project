import { useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'

/**
 * GameCard — 3D tilt on mouse move, neon glow on hover, scroll reveal entrance
 * Usage: <GameCard className="...">...</GameCard>
 */
export default function GameCard({
  children,
  className = '',
  glowColor = 'rgba(20,184,166,0.3)',
  delay = 0,
  onClick,
  noBorder = false,
}) {
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { stiffness: 200, damping: 25, mass: 0.5 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig)
  const glowX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), springConfig)
  const glowY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), springConfig)

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }, [mouseX, mouseY])

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }, [mouseX, mouseY])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay, type: 'spring', bounce: 0.3 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: '800px',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative overflow-hidden rounded-[1.5rem] transition-all duration-300 cursor-default ${className}`}
    >
      {/* Glass background */}
      <div
        className="absolute inset-0 rounded-[1.5rem] transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.55) 100%)',
          backdropFilter: 'blur(20px)',
          border: noBorder ? 'none' : `1px solid ${isHovered ? 'rgba(20,184,166,0.35)' : 'rgba(255,255,255,0.7)'}`,
          boxShadow: isHovered
            ? `0 20px 60px rgba(0,0,0,0.08), 0 0 0 1px rgba(20,184,166,0.15), 0 0 30px ${glowColor}`
            : '0 4px 24px rgba(0,0,0,0.05), 0 0 0 1px rgba(255,255,255,0.6)',
        }}
      />

      {/* Mouse-follow glow spot */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-[1.5rem] opacity-30"
          style={{
            background: `radial-gradient(circle at ${glowX}% ${glowY}%, ${glowColor} 0%, transparent 60%)`,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
