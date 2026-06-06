/**
 * OnboardingPopup.jsx
 * A dismissable first-visit popup shown to users entering a page for the first time.
 * Reads/writes the seenPages flag in useStudentStore.
 */
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
import useStudentStore from '../../store/useStudentStore'

export default function OnboardingPopup({ pageKey, title, message, icon = '👆', delay = 800 }) {
  const { seenPages, markPageSeen } = useStudentStore()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!seenPages?.[pageKey]) {
      const t = setTimeout(() => setVisible(true), delay)
      return () => clearTimeout(t)
    }
  }, [pageKey, seenPages, delay])

  const dismiss = () => {
    setVisible(false)
    markPageSeen(pageKey)
  }

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -30, x: "-50%", scale: 0.95 }}
          animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
          exit={{ opacity: 0, y: -20, x: "-50%", scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-6 left-1/2 z-50 w-full max-w-sm px-4"
        >
          <div className="bg-white dark:bg-neutral-900 border border-brand-200 rounded-2xl shadow-2xl p-4 flex items-start gap-3"
            style={{ boxShadow: '0 10px 40px rgba(20,184,166,0.15)' }}
          >
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0 text-xl">
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-neutral-900 dark:text-white mb-0.5">{title}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{message}</p>
            </div>
            <button
              onClick={dismiss}
              className="w-7 h-7 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-400 hover:text-neutral-600 flex items-center justify-center transition-colors shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
