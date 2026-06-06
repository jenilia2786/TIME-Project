import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function CareerCube({ items, onSelectDomain }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const containerRef = useRef(null)

  const N = items.length
  const faceWidth = 480
  const faceHeight = 320
  const angle = 60 // 60 degrees gives a beautiful hex-prism (cube-like) feel
  // Calculate radius so faces touch perfectly at their edges
  const radius = (faceWidth / 2) / Math.tan((angle / 2) * (Math.PI / 180))

  // Handle scroll wheel
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault()
      if (isScrolling) return

      if (e.deltaY > 0 || e.deltaX > 0) {
        setIsScrolling(true)
        setActiveIndex(prev => prev + 1)
      } else if (e.deltaY < 0 || e.deltaX < 0) {
        setIsScrolling(true)
        setActiveIndex(prev => prev - 1)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false })
    }
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel)
      }
    }
  }, [isScrolling])

  // Debounce the scrolling lock
  useEffect(() => {
    if (isScrolling) {
      const timer = setTimeout(() => setIsScrolling(false), 500)
      return () => clearTimeout(timer)
    }
  }, [isScrolling])

  // Reset active index when items change (e.g. switching tabs)
  useEffect(() => {
    setActiveIndex(0)
  }, [items])

  const nextSlide = () => setActiveIndex(prev => prev + 1)
  const prevSlide = () => setActiveIndex(prev => prev - 1)

  // Modulo for data lookup
  const normalizedIndex = ((activeIndex % N) + N) % N

  // Virtualized array: only render current and +/- 2 items
  const visibleIndices = [
    activeIndex - 2,
    activeIndex - 1,
    activeIndex,
    activeIndex + 1,
    activeIndex + 2
  ]

  return (
    <div 
      ref={containerRef}
      className="w-full h-[400px] md:h-[450px] relative bg-transparent flex flex-col items-center justify-center overflow-visible mt-4"
      style={{ perspective: '1200px' }}
    >
      {/* 3D Scene */}
      <div className="relative w-full h-[400px] flex items-center justify-center scale-100 md:scale-100" style={{ transformStyle: 'preserve-3d' }}>


        <AnimatePresence>
          {visibleIndices.map(absoluteIndex => {
            const dataIndex = ((absoluteIndex % N) + N) % N
            const domain = items[dataIndex]
            if (!domain) return null
            const offset = absoluteIndex - activeIndex
            const Icon = domain.icon
            
            // Only center (0), left (-1), and right (1) are visible.
            const isVisible = Math.abs(offset) <= 1
            const isCenter = offset === 0
            
            return (
              <motion.div
                key={`${domain.id}-${absoluteIndex}`}
                initial={{ rotateY: (offset > 0 ? 1 : -1) * 120, opacity: 0 }}
                animate={{ 
                  rotateY: offset * angle,
                  opacity: isVisible ? 1 : 0,
                  pointerEvents: isVisible ? 'auto' : 'none'
                }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 250, damping: 25 }}
                onClick={() => {
                  if (isCenter) {
                    onSelectDomain(domain.id)
                  } else if (isVisible) {
                    setActiveIndex(absoluteIndex)
                  }
                }}
                className={`absolute top-1/2 left-1/2 cursor-pointer group`}
                style={{
                  width: `${faceWidth}px`,
                  height: `${faceHeight}px`,
                  marginLeft: `-${faceWidth / 2}px`,
                  marginTop: `-${faceHeight / 2}px`,
                  transformOrigin: `50% 50% -${radius}px`,
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                {/* The Card (Split layout) */}
                <div 
                  className={`w-full h-full flex flex-row bg-neutral-900 text-white transition-all duration-300 relative overflow-hidden rounded-[2rem]`}
                  style={{ 
                    border: isCenter ? '3px solid rgba(255,255,255,0.8)' : '1px solid rgba(255,255,255,0.1)',
                    filter: isCenter ? 'brightness(1.1) drop-shadow(0 20px 30px rgba(0,0,0,0.3))' : 'brightness(0.5)'
                  }}
                >
                  {/* Left Half: Image */}
                  <div className="w-1/2 h-full relative overflow-hidden border-r border-white/10">
                    <img 
                      src={domain.image || '/images/tech_domain.png'} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={domain.title}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${domain.gradient} mix-blend-overlay opacity-60`} />
                  </div>
                  
                  {/* Right Half: Content */}
                  <div className={`w-1/2 h-full flex flex-col justify-center p-6 bg-gradient-to-br ${domain.gradient} relative`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                    
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md mb-4 shadow-inner border border-white/10">
                        <Icon size={28} className="text-white" />
                      </div>
                      <span className="bg-white/20 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider backdrop-blur-md inline-block mb-3 border border-white/10">
                        {domain.demand}
                      </span>
                      <h3 className="text-2xl font-black leading-tight mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {domain.title}
                      </h3>
                      <p className="text-xs text-white/80 font-medium">
                        {domain.courses} Courses Available
                      </p>
                    </div>

                    {isCenter && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="absolute bottom-4 left-0 right-0 flex justify-center z-10"
                      >
                        <span className="bg-white text-neutral-900 text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:scale-105 transition-transform">
                          Click to Explore <ChevronRight size={12} />
                        </span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-[-20px] left-0 right-0 flex justify-center items-center gap-6 z-20">
        <button 
          onClick={prevSlide}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:scale-110 shadow-lg border border-neutral-200 dark:border-neutral-700 transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        
        {/* Progress dots */}
        <div className="flex gap-2">
          {items.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => {
                let diff = idx - normalizedIndex
                if (diff > N/2) diff -= N
                if (diff < -N/2) diff += N
                setActiveIndex(activeIndex + diff)
              }}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === normalizedIndex ? 'w-8 bg-brand-500' : 'w-2 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600'
              }`}
            />
          ))}
        </div>

        <button 
          onClick={nextSlide}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:scale-110 shadow-lg border border-neutral-200 dark:border-neutral-700 transition-all"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  )
}
