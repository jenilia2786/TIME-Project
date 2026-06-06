import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import useStudentStore from '../../store/useStudentStore'

function CollegeCard({ college }) {
  const { t } = useTranslation()
  const { addRecentCollege } = useStudentStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -6,
        boxShadow: '0 20px 50px rgba(20,184,166,0.12), 0 0 0 1px rgba(20,184,166,0.15)',
        borderColor: 'rgba(20,184,166,0.3)',
      }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
      className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:bg-slate-800 p-5 cursor-default"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
    >
      {/* Hover glow corner */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand-100/40 to-transparent rounded-bl-3xl pointer-events-none" />

      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex gap-3 min-w-0">
          <motion.div
            whileHover={{ scale: 1.12, rotate: 5 }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-cyan-50 border border-brand-100 font-bold text-brand-700 text-sm"
          >
            {college.initials}
          </motion.div>
          <div className="min-w-0">
            <p className="truncate font-bold text-neutral-900 text-sm">{college.name}</p>
            <p className="truncate text-xs text-neutral-500 mt-0.5">{college.location}</p>
          </div>
        </div>
        <motion.span whileHover={{ scale: 1.05 }} className="badge-blue shrink-0">{college.naac}</motion.span>
      </div>

      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-neutral-600 border-t border-neutral-100 pt-3">
        <p><span className="font-semibold text-neutral-900">Rank:</span> {college.rank}</p>
        <p><span className="font-semibold text-neutral-900">Fees:</span> ₹{college.fees.toLocaleString('en-IN')}</p>
        <p><span className="font-semibold text-neutral-900">Placement:</span> {college.placement}%</p>
        <p className="font-medium">{college.type}</p>
      </div>

      <div className="mt-4 flex gap-2">
        <motion.button
          onClick={() => addRecentCollege(college.id)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          className="btn-primary flex-1 py-2.5 text-xs"
        >
          Shortlist
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          className="btn-secondary flex-1 py-2.5 text-xs"
        >
          {t('compare')}
        </motion.button>
      </div>
    </motion.div>
  )
}

export default CollegeCard
