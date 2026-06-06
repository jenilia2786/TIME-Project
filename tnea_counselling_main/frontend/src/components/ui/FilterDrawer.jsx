import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

function FilterDrawer({ open, onClose }) {
  const { t } = useTranslation()
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40 bg-black/20 lg:hidden" />
          <motion.aside
            initial={{ y: 400 }}
            animate={{ y: 0 }}
            exit={{ y: 400 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white dark:bg-slate-800 p-4 lg:static lg:translate-y-0 lg:rounded-2xl lg:border lg:border-sky-100"
          >
            <h3 className="mb-3 font-semibold">Filters</h3>
            <label className="mb-2 block text-sm">Fees Range</label>
            <input type="range" min={0} max={200000} className="mb-3 w-full" />
            <label className="mb-2 block text-sm">Placement %</label>
            <input type="range" min={40} max={100} className="mb-3 w-full" />
            <div className="space-y-2 text-sm">
              <label className="flex gap-2"><input type="checkbox" /> Scholarships</label>
              <label className="flex gap-2"><input type="checkbox" /> Hostel</label>
              <label className="flex gap-2"><input type="checkbox" /> Girls Only</label>
              <label className="flex gap-2"><input type="checkbox" /> Tamil Medium</label>
            </div>
            <button type="button" onClick={onClose} className="mt-4 min-h-11 w-full rounded-full bg-primary text-white">{t('applyFilters')}</button>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default FilterDrawer
