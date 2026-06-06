import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, TrendingUp } from 'lucide-react'

function CourseCard({ course, index = 0 }) {
  const { t } = useTranslation()

  const scopeColor = course.scope === 'High'
    ? { bar: 'from-emerald-400 to-teal-400', badge: 'bg-emerald-50 text-emerald-700', pct: 85 }
    : { bar: 'from-amber-400 to-orange-400', badge: 'bg-amber-50 text-amber-700', pct: 55 }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.06, type: 'spring', stiffness: 180 }}
      whileHover={{
        y: -8,
        boxShadow: '0 24px 60px rgba(20,184,166,0.12), 0 0 0 1px rgba(20,184,166,0.15)',
      }}
      className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:bg-slate-800 p-5 flex flex-col justify-between cursor-default"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
    >
      {/* Corner decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-brand-50/60 to-transparent rounded-bl-3xl pointer-events-none" />

      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-[10px] font-black uppercase tracking-wider text-brand-600">{course.category}</p>
          {course.scope === 'High' && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 rounded-full px-2 py-0.5"
            >
              <TrendingUp size={9} /> Trending
            </motion.div>
          )}
        </div>

        <h3 className="text-sm font-bold text-neutral-900 leading-snug mb-1">{course.name}</h3>
        <p className="text-xs font-medium text-neutral-400">{course.duration} • {course.eligibility}</p>

        <div className="mt-4 space-y-1.5 border-t border-neutral-100 pt-3 text-xs">
          <div className="flex justify-between">
            <span className="text-neutral-500">Expected Salary:</span>
            <span className="font-bold text-neutral-800">{course.salary}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-500">Future Scope:</span>
            <motion.span
              whileHover={{ scale: 1.05 }}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${scopeColor.badge}`}
            >
              {course.scope}
            </motion.span>
          </div>

          {/* Animated scope bar */}
          <div className="mt-2">
            <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
              <span>Growth potential</span>
              <span className="font-bold">{scopeColor.pct}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${scopeColor.pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: index * 0.06 + 0.2, ease: [0.22, 1, 0.36, 1] }}
                className={`h-full rounded-full bg-gradient-to-r ${scopeColor.bar}`}
                style={{ boxShadow: course.scope === 'High' ? '0 0 6px rgba(20,184,166,0.4)' : 'none' }}
              />
            </div>
          </div>
        </div>

        <div className="mt-3">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Career Paths</p>
          <div className="flex flex-wrap gap-1">
            {course.paths.slice(0, 3).map(path => (
              <span key={path} className="text-[10px] font-medium bg-brand-50 text-brand-700 rounded-full px-2 py-0.5">{path}</span>
            ))}
          </div>
        </div>
      </div>

      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="btn-secondary w-full mt-5 py-2.5 text-xs"
      >
        {t('learnMore')} <ArrowRight size={13} />
      </motion.button>
    </motion.div>
  )
}

export default CourseCard
