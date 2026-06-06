import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../components/layout/PageWrapper'
import CourseCard from '../components/ui/CourseCard'
import courses, { emergingTech } from '../data/courses'
import NeuralBackground from '../components/ui/NeuralBackground'
import AnimatedCounter from '../components/ui/AnimatedCounter'
import useThemeStore from '../store/useThemeStore'

const CATS = ['Engineering', 'Medical', 'Arts & Science', 'Polytechnic', 'Nursing', 'Pharmacy', 'Emerging Tech']

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}
const itemVariants = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 22 } },
}

function Courses() {
  const [activeCategory, setActiveCategory] = useState(null)
  const collapsed = useThemeStore((s) => s.sidebarCollapsed)

  return (
    <PageWrapper>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className={`transition-all duration-300`}>
          <h1 className="text-2xl font-black text-neutral-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Explore Courses
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Discover <AnimatedCounter target={1200} suffix="+" /> courses across various domains
          </p>
        </motion.div>

        {/* Category chips */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-7">
          {CATS.map((c, i) => (
            <motion.button
              key={c}
              onClick={() => setActiveCategory(activeCategory === c ? null : c)}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-xl py-2.5 px-2 text-center transition-all font-semibold text-xs ${
                activeCategory === c
                  ? 'bg-gradient-to-br from-brand-500 to-cyan-500 text-white shadow-md'
                  : 'border border-neutral-200 bg-white text-neutral-700 hover:border-brand-300 hover:bg-brand-50'
              }`}
              style={activeCategory === c ? { boxShadow: '0 4px 16px rgba(20,184,166,0.35)' } : {}}
            >
              {c}
            </motion.button>
          ))}
        </motion.div>

        {/* Undergraduate Courses */}
        <motion.div variants={itemVariants}>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-black text-neutral-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Popular Undergraduate Courses
            </h2>
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100"
            >
              {courses.length} courses
            </motion.span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Emerging Tech */}
        <motion.div variants={itemVariants}>
          <div className="relative overflow-hidden rounded-3xl p-8 mb-6"
            style={{
              background: 'linear-gradient(135deg, rgba(20,184,166,0.06) 0%, rgba(139,92,246,0.04) 50%, rgba(6,182,212,0.06) 100%)',
              border: '1px solid rgba(20,184,166,0.12)',
            }}
          >
            <NeuralBackground opacity={0.18} nodeCount={30} color="#14b8a6" />
            <div className="relative z-10">
              <h2 className="text-lg font-black text-neutral-900 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                ⚡ Emerging Tech & Future Fields
              </h2>
              <p className="text-sm text-neutral-500 mb-6">High-growth sectors with increasing demand</p>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {emergingTech.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, type: 'spring', stiffness: 180 }}
                    whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(20,184,166,0.12)' }}
                    className="relative overflow-hidden rounded-2xl border border-white/70 bg-white/80 backdrop-blur-sm p-5 cursor-default"
                    style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}
                  >
                    {/* Gradient top bar */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-400 to-cyan-400" />

                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-neutral-900 text-sm">{item.title}</h3>
                      <motion.span
                        whileHover={{ scale: 1.08 }}
                        className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 shrink-0"
                      >
                        {item.growth} Growth
                      </motion.span>
                    </div>

                    <div className="space-y-1.5 text-xs text-neutral-600 mb-3 border-b border-neutral-100 pb-3">
                      <p><span className="font-bold text-neutral-800">Demand:</span> {item.demand}</p>
                    </div>

                    {/* Animated demand bar */}
                    <div className="mb-3">
                      <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: '78%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: i * 0.08 + 0.2, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full rounded-full bg-gradient-to-r from-brand-400 to-cyan-400"
                          style={{ boxShadow: '0 0 6px rgba(20,184,166,0.5)' }}
                        />
                      </div>
                    </div>

                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Top Hiring Companies</p>
                    <p className="text-xs text-neutral-600">{item.companies.join(', ')}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </PageWrapper>
  )
}

export default Courses
