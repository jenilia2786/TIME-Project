/**
 * GlobalBackground — Unified animated background with:
 * - Slow, gradual hue-cycling gradient (no sudden section color jumps)
 * - Roaming soft bubbles that drift across the full page
 * - Subtle twinkling particles
 */
import { useEffect, useRef } from 'react'
import { motion, useAnimationFrame } from 'framer-motion'

/* ── Roaming Bubble config ───────────────────────────────── */
const BUBBLES = [
  { size: 520, color: 'rgba(20,184,166,0.10)',  x: -5,  y: 5,  dur: 22, delay: 0   },
  { size: 420, color: 'rgba(139,92,246,0.09)',  x: 88,  y: 15, dur: 28, delay: 3   },
  { size: 360, color: 'rgba(56,189,248,0.09)',  x: 55,  y: 70, dur: 26, delay: 7   },
  { size: 300, color: 'rgba(16,185,129,0.08)',  x: 10,  y: 60, dur: 32, delay: 11  },
  { size: 260, color: 'rgba(244,63,94,0.06)',   x: 75,  y: 80, dur: 20, delay: 5   },
  { size: 200, color: 'rgba(249,115,22,0.06)',  x: 30,  y: 35, dur: 36, delay: 14  },
  { size: 180, color: 'rgba(139,92,246,0.08)',  x: 65,  y: 50, dur: 24, delay: 8   },
  { size: 150, color: 'rgba(20,184,166,0.07)',  x: 45,  y: 90, dur: 18, delay: 2   },
]

/* ── Twinkle Particle config ─────────────────────────────── */
const TWINKLES = Array.from({ length: 28 }, (_, i) => ({
  x: `${(i * 37) % 100}%`,
  y: `${(i * 53 + 17) % 100}%`,
  size: 1.5 + (i % 3) * 1.2,
  dur: 2.5 + (i % 4) * 1.2,
  delay: (i * 0.4) % 6,
  color: ['rgba(20,184,166,0.5)', 'rgba(139,92,246,0.4)', 'rgba(56,189,248,0.4)', 'rgba(16,185,129,0.4)'][i % 4],
}))

function RoamingBubble({ bubble }) {
  // Each bubble roams on its own slow lemniscate-like path
  const amp = { x: 18 + bubble.size * 0.02, y: 14 + bubble.size * 0.015 }
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: bubble.size,
        height: bubble.size,
        left: `${bubble.x}%`,
        top: `${bubble.y}%`,
        background: `radial-gradient(circle at 40% 40%, ${bubble.color}, transparent 70%)`,
        filter: 'blur(48px)',
        transform: 'translate(-50%, -50%)',
      }}
      animate={{
        x: [0, amp.x, -amp.x * 0.6, amp.x * 0.3, 0],
        y: [0, -amp.y * 0.7, amp.y, -amp.y * 0.4, 0],
        scale: [1, 1.08, 0.96, 1.04, 1],
      }}
      transition={{
        duration: bubble.dur,
        repeat: Infinity,
        delay: bubble.delay,
        ease: 'easeInOut',
      }}
    />
  )
}

function TwinkleParticle({ p }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: p.x,
        top: p.y,
        width: p.size,
        height: p.size,
        background: p.color,
        boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
      }}
      animate={{
        opacity: [0, 0.8, 0.1, 0.9, 0],
        scale: [0.5, 1.2, 0.8, 1, 0.5],
      }}
      transition={{
        duration: p.dur,
        repeat: Infinity,
        delay: p.delay,
        ease: 'easeInOut',
      }}
    />
  )
}

export default function GlobalBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none transition-colors duration-500" style={{ backgroundColor: 'var(--bg-base)' }}>

      {/* ── Slow cycling hue gradient — the "base wash" ── */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(ellipse 90% 70% at 20% 20%, rgba(20,184,166,0.08) 0%, transparent 60%), radial-gradient(ellipse 70% 60% at 80% 80%, rgba(139,92,246,0.07) 0%, transparent 60%)',
            'radial-gradient(ellipse 90% 70% at 70% 30%, rgba(56,189,248,0.08) 0%, transparent 60%), radial-gradient(ellipse 70% 60% at 20% 70%, rgba(20,184,166,0.07) 0%, transparent 60%)',
            'radial-gradient(ellipse 90% 70% at 50% 80%, rgba(139,92,246,0.08) 0%, transparent 60%), radial-gradient(ellipse 70% 60% at 60% 10%, rgba(16,185,129,0.07) 0%, transparent 60%)',
            'radial-gradient(ellipse 90% 70% at 20% 20%, rgba(20,184,166,0.08) 0%, transparent 60%), radial-gradient(ellipse 70% 60% at 80% 80%, rgba(139,92,246,0.07) 0%, transparent 60%)',
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Roaming large bubbles ── */}
      {BUBBLES.map((b, i) => (
        <RoamingBubble key={i} bubble={b} />
      ))}

      {/* ── Subtle dot grid ── */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(20,184,166,0.25) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* ── Twinkling particles ── */}
      {TWINKLES.map((p, i) => (
        <TwinkleParticle key={i} p={p} />
      ))}

      {/* Top center soft glow removed as per user request to make background consistent */}
    </div>
  )
}
