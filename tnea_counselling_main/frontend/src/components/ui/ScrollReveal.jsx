import { motion } from 'framer-motion'

const VARIANTS = {
  fadeUp: {
    hidden:  { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden:  { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
  },
  slideLeft: {
    hidden:  { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden:  { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  zoomIn: {
    hidden:  { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1 },
  },
  zoomOut: {
    hidden:  { opacity: 0, scale: 1.1 },
    visible: { opacity: 1, scale: 1 },
  },
  flipY: {
    hidden:  { opacity: 0, rotateX: 40, y: 30 },
    visible: { opacity: 1, rotateX: 0, y: 0 },
  },
  rotateIn: {
    hidden:  { opacity: 0, rotate: -8, scale: 0.95 },
    visible: { opacity: 1, rotate: 0, scale: 1 },
  },
}

/**
 * ScrollReveal — upgraded with variants, stagger, and 3D support
 * variant: 'fadeUp' | 'fadeDown' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'zoomOut' | 'flipY' | 'rotateIn'
 * stagger: number (seconds between children)
 */
export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  variant = 'fadeUp',
  stagger = 0,
  once = true,
  duration = 0.75,
}) {
  const chosen = VARIANTS[variant] || VARIANTS.fadeUp
  const isStagger = stagger > 0

  if (isStagger) {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: '-60px' }}
        className={className}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: stagger,
              delayChildren: delay,
            },
          },
        }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-60px' }}
      transition={{
        duration,
        delay,
        type: 'spring',
        bounce: 0.3,
      }}
      variants={chosen}
      className={className}
      style={variant === 'flipY' ? { perspective: '800px' } : {}}
    >
      {children}
    </motion.div>
  )
}

/**
 * ScrollRevealItem — child of ScrollReveal when stagger is used
 */
export function ScrollRevealItem({ children, className = '', variant = 'fadeUp', duration = 0.6 }) {
  const chosen = VARIANTS[variant] || VARIANTS.fadeUp
  return (
    <motion.div
      variants={chosen}
      transition={{ duration, type: 'spring', bounce: 0.25 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
