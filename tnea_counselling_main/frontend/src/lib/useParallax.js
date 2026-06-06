/**
 * useParallax — returns a motion value for scroll-based parallax
 * Usage: const y = useParallax(scrollY, [0, 1], [0, -80])
 */
import { useScroll, useTransform, useSpring } from 'framer-motion'

export function useParallax(inputRange = [0, 1], outputRange = [0, -80], smooth = true) {
  const { scrollYProgress } = useScroll()
  const raw = useTransform(scrollYProgress, inputRange, outputRange)
  return smooth ? useSpring(raw, { stiffness: 60, damping: 20 }) : raw
}

/**
 * useSectionParallax — parallax tied to a specific element's scroll position
 */
export function useSectionParallax(ref, outputRange = [60, -60]) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], outputRange)
  return useSpring(y, { stiffness: 50, damping: 18 })
}
