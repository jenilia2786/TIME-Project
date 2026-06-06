import { useEffect, useRef } from 'react'

const COLORS = ['#14b8a6', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899', '#10b981', '#f97316']

/**
 * ConfettiEffect — CSS-only burst triggered via `trigger` prop
 * Usage: <ConfettiEffect trigger={shouldBurst} />
 */
export default function ConfettiEffect({ trigger = false, count = 30, origin = 'center' }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!trigger) return
    const container = containerRef.current
    if (!container) return

    // Burst confetti
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div')
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      const size = Math.random() * 8 + 4
      const shape = Math.random() > 0.5 ? '50%' : '2px'
      const angle = Math.random() * 360
      const distance = Math.random() * 120 + 60
      const dx = Math.cos((angle * Math.PI) / 180) * distance
      const dy = Math.sin((angle * Math.PI) / 180) * distance - 60
      const duration = Math.random() * 600 + 600
      const delay = Math.random() * 150

      el.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: ${shape};
        left: 50%;
        top: 50%;
        pointer-events: none;
        transform-origin: center;
        animation: confettiBurst ${duration}ms ease-out ${delay}ms forwards;
        --dx: ${dx}px;
        --dy: ${dy}px;
      `
      container.appendChild(el)
      setTimeout(() => el.remove(), duration + delay + 50)
    }
  }, [trigger, count])

  return (
    <>
      <div
        ref={containerRef}
        className="absolute inset-0 pointer-events-none overflow-visible z-50"
        aria-hidden="true"
      />
      <style>{`
        @keyframes confettiBurst {
          0%   { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
          60%  { opacity: 1; }
          100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.3) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </>
  )
}
