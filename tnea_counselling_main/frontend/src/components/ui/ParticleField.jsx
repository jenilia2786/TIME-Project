import { useEffect, useRef } from 'react'

/** Lightweight CSS-Framer-Motion particle field — no canvas needed */
export default function ParticleField({ count = 40, className = '' }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Clear existing
    container.innerHTML = ''

    const colors = [
      'rgba(20,184,166,', 'rgba(6,182,212,', 'rgba(139,92,246,',
      'rgba(16,185,129,', 'rgba(99,102,241,'
    ]

    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div')
      const size = Math.random() * 4 + 1.5
      const color = colors[Math.floor(Math.random() * colors.length)]
      const opacity = Math.random() * 0.5 + 0.15
      const duration = Math.random() * 15 + 10
      const delay = Math.random() * 8
      const x = Math.random() * 100
      const y = Math.random() * 100
      const dx = (Math.random() - 0.5) * 200
      const dy = (Math.random() - 0.5) * 200

      dot.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        top: ${y}%;
        border-radius: 50%;
        background: ${color}${opacity + 0.2});;
        box-shadow: 0 0 ${size * 2}px ${color}${opacity}), 0 0 ${size * 4}px ${color}${opacity * 0.5});
        animation: particleFloat${i % 5} ${duration}s ease-in-out ${delay}s infinite;
        pointer-events: none;
      `

      // Create individual keyframes
      const styleEl = document.createElement('style')
      styleEl.textContent = `
        @keyframes particleFloat${i % 5} {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: ${opacity}; }
          25% { transform: translate(${dx * 0.5}px, ${dy * 0.3}px) scale(1.2); opacity: ${opacity * 1.5}; }
          50% { transform: translate(${dx}px, ${dy}px) scale(0.8); opacity: ${opacity * 0.6}; }
          75% { transform: translate(${dx * 0.3}px, ${dy * 0.7}px) scale(1.1); opacity: ${opacity * 1.2}; }
        }
      `
      if (i < 5) document.head.appendChild(styleEl)
      container.appendChild(dot)
    }

    return () => {
      container.innerHTML = ''
    }
  }, [count])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    />
  )
}
