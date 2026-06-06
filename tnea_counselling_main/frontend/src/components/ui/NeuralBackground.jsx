import { useEffect, useRef } from 'react'

/**
 * NeuralBackground — animated canvas neural network with glowing nodes and connection lines
 * Inspired by AI/futuristic ambient visuals
 * Props: opacity (0–1), color (hex), nodeCount
 */
export default function NeuralBackground({
  opacity = 0.35,
  color = '#14b8a6',
  nodeCount = 55,
  className = '',
}) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // Resize to fill parent
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // Parse color to rgb
    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return { r, g, b }
    }
    const { r, g, b } = hexToRgb(color)

    // Generate nodes
    const w = () => canvas.offsetWidth
    const h = () => canvas.offsetHeight

    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * w(),
      y: Math.random() * h(),
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2.5 + 1,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
    }))

    const CONNECTION_DIST = 130
    let mouse = { x: -1000, y: -1000 }

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    window.addEventListener('mousemove', onMouseMove)

    const draw = () => {
      const cw = canvas.offsetWidth
      const ch = canvas.offsetHeight
      ctx.clearRect(0, 0, cw, ch)

      // Update positions
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        n.pulse += n.pulseSpeed

        if (n.x < 0 || n.x > cw) n.vx *= -1
        if (n.y < 0 || n.y > ch) n.vy *= -1

        // Mouse attraction (subtle)
        const dx = mouse.x - n.x
        const dy = mouse.y - n.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 150) {
          n.x += dx * 0.0015
          n.y += dy * 0.0015
        }
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], bNode = nodes[j]
          const dx = a.x - bNode.x
          const dy = a.y - bNode.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < CONNECTION_DIST) {
            const alpha = (1 - d / CONNECTION_DIST) * opacity * 0.6
            ctx.beginPath()
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`
            ctx.lineWidth = (1 - d / CONNECTION_DIST) * 1.2
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(bNode.x, bNode.y)
            ctx.stroke()
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        const pulseR = n.r + Math.sin(n.pulse) * 0.8
        const alpha = (0.4 + Math.sin(n.pulse) * 0.3) * opacity

        // Outer glow
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, pulseR * 4)
        grad.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.8})`)
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
        ctx.beginPath()
        ctx.arc(n.x, n.y, pulseR * 4, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        // Core dot
        ctx.beginPath()
        ctx.arc(n.x, n.y, pulseR, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 1.5})`
        ctx.fill()
      }

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('mousemove', onMouseMove)
      ro.disconnect()
    }
  }, [color, nodeCount, opacity])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    />
  )
}
