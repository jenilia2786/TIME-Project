import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, X, Send, CheckCircle, Sparkles } from 'lucide-react'

export default function AddReviewModal({ isOpen, onClose, onSubmit }) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [name, setName] = useState('')
  const [standard, setStandard] = useState('')
  const [review, setReview] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!rating || !name.trim() || !review.trim()) return
    setSubmitted(true)
    if (onSubmit) onSubmit({ name, standard, review, rating })
    setTimeout(() => {
      setSubmitted(false)
      setRating(0); setName(''); setStandard(''); setReview('')
      onClose()
    }, 2200)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', bounce: 0.35, duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ pointerEvents: 'none' }}
          >
            <div
              className="relative w-full max-w-md rounded-[2rem] overflow-hidden"
              style={{
                pointerEvents: 'all',
                background: 'linear-gradient(135deg, #ffffff, #f5f3ff)',
                boxShadow: '0 30px 80px rgba(139,92,246,0.2), 0 8px 30px rgba(0,0,0,0.08)',
              }}
            >
              {/* Top accent bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-brand-500 to-teal-400" />

              {/* Content */}
              <div className="p-7">
                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-brand-500 flex items-center justify-center">
                              <Sparkles size={15} className="text-white" />
                            </div>
                            <h3 className="font-extrabold text-neutral-900 text-lg tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                              Share Your Experience
                            </h3>
                          </div>
                          <p className="text-xs text-neutral-500 ml-10">Help other students with your honest feedback</p>
                        </div>
                        <button
                          onClick={onClose}
                          className="w-8 h-8 rounded-xl bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
                        >
                          <X size={15} className="text-neutral-500" />
                        </button>
                      </div>

                      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Rating */}
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-2">Your Rating *</label>
                          <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <motion.button
                                key={star}
                                type="button"
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                className="p-1"
                              >
                                <Star
                                  size={24}
                                  fill={(hoverRating || rating) >= star ? '#f59e0b' : 'none'}
                                  className={(hoverRating || rating) >= star ? 'text-amber-400' : 'text-neutral-300'}
                                />
                              </motion.button>
                            ))}
                            {rating > 0 && (
                              <motion.span
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="ml-1 text-xs font-bold text-amber-500 self-center"
                              >
                                {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][rating]}
                              </motion.span>
                            )}
                          </div>
                        </div>

                        {/* Name */}
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-1.5">Your Name *</label>
                          <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Karthik S."
                            required
                            className="w-full rounded-xl border border-neutral-200 bg-white/ dark:bg-slate-800/ px-4 py-3 text-sm font-medium text-neutral-800 placeholder:text-neutral-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all"
                          />
                        </div>

                        {/* Standard */}
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-1.5">Your Standard / Status</label>
                          <input
                            value={standard}
                            onChange={(e) => setStandard(e.target.value)}
                            placeholder="e.g. 12th Grade Student, Parent of 10th student"
                            className="w-full rounded-xl border border-neutral-200 bg-white/ dark:bg-slate-800/ px-4 py-3 text-sm font-medium text-neutral-800 placeholder:text-neutral-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all"
                          />
                        </div>

                        {/* Review */}
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-1.5">Your Review *</label>
                          <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Tell us how this platform helped you..."
                            required
                            rows={3}
                            className="w-full rounded-xl border border-neutral-200 bg-white/ dark:bg-slate-800/ px-4 py-3 text-sm font-medium text-neutral-800 placeholder:text-neutral-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all resize-none"
                          />
                          <p className="text-[10px] text-neutral-400 mt-1">{review.length}/300</p>
                        </div>

                        {/* Submit */}
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.97 }}
                          disabled={!rating || !name.trim() || !review.trim()}
                          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-violet-500 to-brand-500 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                          style={{ boxShadow: '0 8px 24px rgba(139,92,246,0.3)' }}
                        >
                          <Send size={15} /> Submit Review
                        </motion.button>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center gap-4 py-10"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', bounce: 0.6, delay: 0.1 }}
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center shadow-lg"
                      >
                        <CheckCircle size={30} className="text-white" />
                      </motion.div>
                      <div className="text-center">
                        <h4 className="font-extrabold text-neutral-900 text-lg">Thank you!</h4>
                        <p className="text-sm text-neutral-500 mt-1">Your review has been submitted successfully.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
