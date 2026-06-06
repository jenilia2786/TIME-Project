import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

/**
 * AnimatedCounter — smooth count-up animation when scrolled into view
 * Props: target (number), suffix (string), prefix (string), duration (ms)
 */
export default function AnimatedCounter({
  target = 0,
  suffix = '',
  prefix = '',
  duration = 1500,
  className = '',
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isInView || hasAnimated.current) return
    hasAnimated.current = true

    // Parse target number (remove non-digit except dot)
    const numericTarget = parseFloat(String(target).replace(/[^\d.]/g, ''))
    if (isNaN(numericTarget)) { setCount(numericTarget); return }

    const start = Date.now()
    const isDecimal = String(numericTarget).includes('.')

    const frame = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = numericTarget * eased

      setCount(isDecimal ? Math.round(current * 10) / 10 : Math.floor(current))

      if (progress < 1) requestAnimationFrame(frame)
      else setCount(numericTarget)
    }

    requestAnimationFrame(frame)
  }, [isInView, target, duration])

  // Format large numbers
  const formatted = typeof count === 'number'
    ? count >= 1000
      ? (count / 1000).toFixed(count % 1000 === 0 ? 0 : 1) + 'K'
      : count.toString()
    : count

  return (
    <span ref={ref} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  )
}
