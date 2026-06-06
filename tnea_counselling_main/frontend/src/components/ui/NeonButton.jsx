import { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

/**
 * NeonButton — magnetic hover, ripple click, neon glow
 * variant: 'primary' | 'outline' | 'ghost' | 'game'
 */
export default function NeonButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
  id,
}) {
  const btnRef = useRef(null)
  const [ripples, setRipples] = useState([])
  const [magnet, setMagnet] = useState({ x: 0, y: 0 })

  /* ── Magnetic effect ── */
  const handleMouseMove = useCallback((e) => {
    const btn = btnRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) * 0.25
    const dy = (e.clientY - cy) * 0.25
    setMagnet({ x: dx, y: dy })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setMagnet({ x: 0, y: 0 })
  }, [])

  /* ── Ripple effect ── */
  const handleClick = useCallback((e) => {
    const btn = btnRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()
    setRipples(prev => [...prev, { x, y, id }])
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 700)
    onClick?.(e)
  }, [onClick])

  const variantStyles = {
    primary: 'bg-brand-500 text-white hover:bg-brand-600',
    outline: 'border-2 border-brand-500 text-brand-600 hover:bg-brand-50',
    ghost:   'text-brand-600 hover:bg-brand-50',
    game:    'bg-gradient-to-r from-brand-500 to-cyan-500 text-white font-bold',
  }

  const glowStyles = {
    primary: '0 4px 20px rgba(20,184,166,0.4)',
    outline: '0 0 20px rgba(20,184,166,0.3)',
    ghost:   'none',
    game:    '0 6px 30px rgba(20,184,166,0.5), 0 0 50px rgba(20,184,166,0.2)',
  }

  return (
    <motion.button
      ref={btnRef}
      id={id}
      type={type}
      disabled={disabled}
      animate={{ x: magnet.x, y: magnet.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileTap={{ scale: 0.97 }}
      style={{ '--glow': glowStyles[variant] }}
      className={`
        relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5
        text-sm font-semibold transition-all duration-200 overflow-hidden
        focus:outline-none disabled:opacity-50 disabled:pointer-events-none
        ${variantStyles[variant]} ${className}
      `}
    >
      {/* Shimmer sweep */}
      <span
        className="absolute inset-0 overflow-hidden rounded-full pointer-events-none"
        aria-hidden="true"
      >
        <span className="absolute top-0 left-[-60%] w-[40%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-shimmer" />
      </span>

      {/* Ripples */}
      {ripples.map(r => (
        <span
          key={r.id}
          className="absolute rounded-full bg-white/ dark:bg-slate-800/ pointer-events-none"
          style={{
            left: r.x - 40,
            top: r.y - 40,
            width: 80,
            height: 80,
            animation: 'rippleExpand 0.7s ease-out forwards',
          }}
        />
      ))}

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">{children}</span>

      <style>{`
        @keyframes rippleExpand {
          0%   { transform: scale(0); opacity: 0.6; }
          100% { transform: scale(4); opacity: 0; }
        }
      `}</style>
    </motion.button>
  )
}
