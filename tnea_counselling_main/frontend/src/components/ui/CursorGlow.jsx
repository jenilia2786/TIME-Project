import { useEffect, useRef, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

/**
 * CursorGlow — soft glowing dot that follows the mouse
 * Mount once in App.jsx or a layout wrapper.
 * Automatically hides on touch devices.
 */
export default function CursorGlow() {
  const [visible, setVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const rawX = useMotionValue(-100)
  const rawY = useMotionValue(-100)

  const springConfig = { stiffness: 200, damping: 25, mass: 0.5 }
  const x = useSpring(rawX, springConfig)
  const y = useSpring(rawY, springConfig)

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia('(hover: none)').matches) return

    const onMove = (e) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
      if (!visible) setVisible(true)
    }

    const onEnter = (e) => {
      if (e.target.closest('button, a, [role="button"], input, textarea, select, [data-interactive]')) {
        setIsHovering(true)
      }
    }

    const onLeave = () => setIsHovering(false)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onEnter)
    window.addEventListener('mouseout', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onEnter)
      window.removeEventListener('mouseout', onLeave)
    }
  }, [rawX, rawY, visible])

  if (!visible) return null

  return (
    <>
      {/* Outer glow ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
          width: isHovering ? 50 : 32,
          height: isHovering ? 50 : 32,
          background: isHovering
            ? 'radial-gradient(circle, rgba(20,184,166,0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)',
          border: `1px solid rgba(20,184,166,${isHovering ? 0.5 : 0.25})`,
          boxShadow: `0 0 ${isHovering ? 20 : 10}px rgba(20,184,166,${isHovering ? 0.3 : 0.15})`,
          transition: 'width 0.2s ease, height 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        }}
      />
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: rawX,
          y: rawY,
          translateX: '-50%',
          translateY: '-50%',
          width: isHovering ? 6 : 5,
          height: isHovering ? 6 : 5,
          background: '#14b8a6',
          boxShadow: '0 0 6px rgba(20,184,166,0.8)',
        }}
      />
    </>
  )
}
