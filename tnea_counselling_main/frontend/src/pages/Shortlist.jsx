import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart, Trash2, ArrowUp, ArrowDown, StickyNote,
  Building2, MapPin, BarChart2, Bookmark, RefreshCw,
  AlertCircle, CheckCircle, X, Plus, Briefcase, GraduationCap, FileText, Award
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import { getChoices, removeChoice, reorderChoice, updateChoiceNotes, clearChoices } from '../services/choiceService'
import useStudentStore from '../store/useStudentStore'

/* ── Tier badge helper ────────────────────────────────── */
const TIER_CONFIG = {
  Safe:     { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  Moderate: { color: 'text-brand-700',   bg: 'bg-brand-50',   border: 'border-brand-200'   },
  Dream:    { color: 'text-violet-700',  bg: 'bg-violet-50',  border: 'border-violet-200'  },
}
function TierBadge({ tier }) {
  const cfg = TIER_CONFIG[tier] || { color: 'text-neutral-600', bg: 'bg-neutral-50', border: 'border-neutral-200' }
  if (!tier) return null
  return (
    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
      {tier}
    </span>
  )
}

/* ── Toast notification ──────────────────────────────── */
function Toast({ message, type }) {
  if (!message) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-full shadow-2xl text-sm font-bold ${
        type === 'error' ? 'bg-rose-600 text-white' : 'bg-neutral-800 dark:bg-neutral-900 text-white'
      }`}
    >
      {type === 'error' ? <AlertCircle size={15} /> : <CheckCircle size={15} />}
      {message}
    </motion.div>
  )
}

/* ── Shortlist Card (Colleges) ───────────────────────── */
function ShortlistCard({ item, index, total, onRemove, onMoveUp, onMoveDown, onNotesChange }) {
  const [editingNotes, setEditingNotes] = useState(false)
  const [notesVal, setNotesVal] = useState(item.notes || '')
  const [savingNotes, setSavingNotes] = useState(false)

  const handleNotesSave = async () => {
    setSavingNotes(true)
    try {
      await onNotesChange(index, notesVal)
    } finally {
      setSavingNotes(false)
      setEditingNotes(false)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 220, damping: 24 }}
      className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex">
        <div className="w-1.5 shrink-0" style={{
          background: index === 0
            ? 'linear-gradient(180deg, #f59e0b, #d97706)'
            : index === 1
            ? 'linear-gradient(180deg, #94a3b8, #64748b)'
            : 'linear-gradient(180deg, #f97316, #ea580c)',
          minHeight: '100%'
        }} />
        <div className="flex-1 p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0 text-sm font-black text-neutral-600">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="text-sm font-black text-neutral-900 truncate">{item.name || 'College'}</h3>
                <TierBadge tier={item.tier} />
              </div>
              <div className="flex flex-wrap gap-3 text-[10px] font-bold text-neutral-400">
                {item.branch && <span className="flex items-center gap-1"><BarChart2 size={10} /> {item.branch}</span>}
                {item.district && <span className="flex items-center gap-1"><MapPin size={10} /> {item.district}</span>}
                {item.code && <span className="flex items-center gap-1"><Building2 size={10} /> Code: {item.code}</span>}
                {item.cutoff && <span className="text-brand-600">Cutoff: {item.cutoff}</span>}
              </div>
              <div className="mt-3">
                {editingNotes ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      value={notesVal}
                      onChange={(e) => setNotesVal(e.target.value)}
                      placeholder="Add a note..."
                      className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-brand-200 bg-brand-50 focus:outline-none focus:border-brand-400 font-medium text-neutral-700"
                      onKeyDown={(e) => { if (e.key === 'Enter') handleNotesSave(); if (e.key === 'Escape') setEditingNotes(false) }}
                    />
                    <button onClick={handleNotesSave} disabled={savingNotes} className="text-[10px] font-bold text-brand-600 hover:text-brand-700 px-2 py-1 rounded-lg hover:bg-brand-50 transition-colors">
                      {savingNotes ? '...' : 'Save'}
                    </button>
                    <button onClick={() => setEditingNotes(false)} className="text-neutral-400 hover:text-neutral-600"><X size={12} /></button>
                  </div>
                ) : (
                  <button onClick={() => setEditingNotes(true)} className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 hover:text-brand-600 transition-colors group">
                    <StickyNote size={11} className="group-hover:text-brand-500" />
                    {item.notes ? <span className="text-neutral-600">{item.notes}</span> : 'Add note...'}
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1.5 shrink-0">
              <button onClick={() => onMoveUp(index)} disabled={index === 0} className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all" title="Move up"><ArrowUp size={13} /></button>
              <button onClick={() => onMoveDown(index)} disabled={index === total - 1} className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all" title="Move down"><ArrowDown size={13} /></button>
              <button onClick={() => onRemove(index, item)} className="p-1.5 rounded-lg hover:bg-rose-50 text-neutral-300 hover:text-rose-500 transition-all" title="Remove"><Trash2 size={13} /></button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Generic Wishlist Card ────────────────────────────── */
function WishlistCard({ item, onRemove, accentColor = 'text-brand-600' }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 220, damping: 24 }}
      className="bg-white rounded-2xl border border-neutral-100 p-4 shadow-sm hover:shadow-md transition-shadow flex items-start gap-3"
    >
      <div className="flex-1 min-w-0">
        <h3 className={`text-sm font-black text-neutral-900 truncate`}>{item.name}</h3>
        {item.domain && <p className="text-[10px] font-semibold text-neutral-400 mt-0.5">{item.domain}</p>}
        {item.desc && <p className="text-[10px] text-neutral-400 mt-1 line-clamp-2">{item.desc}</p>}
        {item.amount && <p className="text-[10px] font-bold text-emerald-600 mt-1">{item.amount}</p>}
        {item.date && <p className="text-[10px] font-bold text-amber-600 mt-1">📅 {item.date}</p>}
      </div>
      <button onClick={() => onRemove(item.id)} className="p-1.5 rounded-lg hover:bg-rose-50 text-neutral-300 hover:text-rose-500 transition-all shrink-0" title="Remove">
        <Trash2 size={13} />
      </button>
    </motion.div>
  )
}

/* ── Section component ───────────────────────────────── */
function WishlistSection({ title, icon: Icon, iconColor, items, emptyMsg, emptySubMsg, emptyLink, emptyLinkText, onRemove, renderCard }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${iconColor}`}>
          <Icon size={16} className="text-white" />
        </div>
        <h2 className="text-base font-black text-neutral-900 dark:text-white">{title}</h2>
        <span className="ml-auto text-[10px] font-black text-neutral-400 bg-neutral-50 border border-neutral-100 px-2 py-0.5 rounded-full">{items.length} saved</span>
      </div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-24 flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-16 h-16 rounded-3xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center border border-rose-200"
          >
            <Icon size={28} className="text-rose-400" />
          </motion.div>
          <div className="text-center">
            <p className="text-lg font-black text-neutral-700">{emptyMsg}</p>
            <p className="text-sm text-neutral-400 mt-1">{emptySubMsg}</p>
          </div>
          {emptyLink && (
            <Link
              to={emptyLink}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 text-white text-sm font-bold rounded-xl hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200"
            >
              <Plus size={14} /> {emptyLinkText}
            </Link>
          )}
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {items.map(item => renderCard ? renderCard(item) : (
              <WishlistCard key={item.id} item={item} onRemove={onRemove} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

/* ── Main Shortlist Page ─────────────────────────────── */
export default function Shortlist() {
  const [choices, setChoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState({ message: '', type: 'info' })
  const [activeTab, setActiveTab] = useState('colleges')

  const { wishlistCareers, wishlistExams, wishlistScholarships, removeFromWishlist } = useStudentStore()

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast({ message: '', type: 'info' }), 2500)
  }

  const loadChoices = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getChoices()
      setChoices(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err?.message || 'Failed to load shortlist. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadChoices() }, [])

  const handleRemove = async (index, item) => {
    const prev = [...choices]
    setChoices(c => c.filter((_, i) => i !== index))
    try {
      await removeChoice({ code: item.code, branch: item.branch || 'General' })
      showToast('Removed from shortlist')
    } catch {
      setChoices(prev)
      showToast('Failed to remove. Please try again.', 'error')
    }
  }

  const handleMoveUp = async (index) => {
    if (index === 0) return
    const newChoices = [...choices]
    ;[newChoices[index], newChoices[index - 1]] = [newChoices[index - 1], newChoices[index]]
    setChoices(newChoices)
    try {
      const res = await reorderChoice('up', index)
      if (res?.choices) setChoices(res.choices)
    } catch {
      setChoices(choices)
      showToast('Failed to reorder. Please try again.', 'error')
    }
  }

  const handleMoveDown = async (index) => {
    if (index === choices.length - 1) return
    const newChoices = [...choices]
    ;[newChoices[index], newChoices[index + 1]] = [newChoices[index + 1], newChoices[index]]
    setChoices(newChoices)
    try {
      const res = await reorderChoice('down', index)
      if (res?.choices) setChoices(res.choices)
    } catch {
      setChoices(choices)
      showToast('Failed to reorder. Please try again.', 'error')
    }
  }

  const handleNotesChange = async (index, notes) => {
    try {
      const res = await updateChoiceNotes(index, notes)
      if (res?.choices) setChoices(res.choices)
      else {
        const updated = [...choices]
        updated[index] = { ...updated[index], notes }
        setChoices(updated)
      }
    } catch {
      showToast('Failed to save notes.', 'error')
    }
  }

  const handleClearAll = async () => {
    if (!window.confirm('Clear your entire shortlist? This cannot be undone.')) return
    const prev = [...choices]
    setChoices([])
    try {
      await clearChoices()
      showToast('Shortlist cleared')
    } catch {
      setChoices(prev)
      showToast('Failed to clear shortlist.', 'error')
    }
  }

  const TABS = [
    { key: 'colleges',      label: 'Colleges',      icon: Building2,      count: choices.length,              color: 'bg-violet-500' },
    { key: 'careers',       label: 'Careers',        icon: Briefcase,      count: wishlistCareers.length,      color: 'bg-amber-500' },
    { key: 'exams',         label: 'Exams',          icon: FileText,       count: wishlistExams.length,        color: 'bg-sky-500' },
    { key: 'scholarships',  label: 'Scholarships',   icon: Award,          count: wishlistScholarships.length, color: 'bg-emerald-500' },
  ]

  return (
    <PageWrapper>
      <div className="w-full max-w-7xl mx-auto space-y-6">
        <AnimatePresence>
          {toast.message && <Toast message={toast.message} type={toast.type} />}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shrink-0"
              style={{ boxShadow: '0 4px 15px rgba(244,63,94,0.4)' }}
            >
              <Heart size={18} className="text-white fill-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-neutral-900 dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Shortlist
              </h1>
              <p className="text-sm text-neutral-500">Your saved colleges, careers, exams & scholarships</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadChoices}
              disabled={loading}
              className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-500 transition-all"
              title="Refresh"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
            {activeTab === 'colleges' && choices.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-100 text-rose-500 hover:bg-rose-50 text-xs font-bold transition-all"
              >
                <Trash2 size={12} /> Clear All
              </button>
            )}
          </div>
        </motion.div>

        {/* Section Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-2xl flex items-center gap-1 border border-neutral-200 dark:border-neutral-700 overflow-x-auto hide-scrollbar"
        >
          {TABS.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
              >
                <Icon size={13} className={isActive ? 'text-brand-500' : ''} />
                {tab.label}
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${isActive ? `${tab.color} text-white` : 'bg-neutral-200 text-neutral-500'}`}>
                  {tab.count}
                </span>
              </button>
            )
          })}
        </motion.div>

        {/* ── Colleges Tab ─────────────────────────────── */}
        {activeTab === 'colleges' && (
          <>
            {choices.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-4 p-4 bg-white rounded-2xl border border-neutral-100 shadow-sm">
                {[
                  { label: 'Total Choices', value: choices.length, color: 'text-neutral-900' },
                  { label: 'Dream', value: choices.filter(c => c.tier === 'Dream').length, color: 'text-violet-600' },
                  { label: 'Moderate', value: choices.filter(c => c.tier === 'Moderate').length, color: 'text-brand-600' },
                  { label: 'Safe', value: choices.filter(c => c.tier === 'Safe').length, color: 'text-emerald-600' },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {loading && (
              <div className="py-24 flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin" />
                <p className="text-sm text-neutral-400 font-medium">Loading your shortlist...</p>
              </div>
            )}

            {!loading && error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 flex flex-col items-center gap-4 bg-rose-50 rounded-3xl border border-rose-100">
                <AlertCircle size={36} className="text-rose-400" />
                <p className="text-base font-bold text-rose-700">{error}</p>
                <button onClick={loadChoices} className="px-5 py-2.5 bg-rose-500 text-white text-sm font-bold rounded-xl hover:bg-rose-600 transition-colors">Try Again</button>
              </motion.div>
            )}

            {!loading && !error && choices.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 flex flex-col items-center gap-4">
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }} className="w-16 h-16 rounded-3xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center border border-rose-200">
                  <Bookmark size={28} className="text-rose-400" />
                </motion.div>
                <div className="text-center">
                  <p className="text-lg font-black text-neutral-700">Your college shortlist is empty</p>
                  <p className="text-sm text-neutral-400 mt-1">Add colleges from the College Discovery page</p>
                </div>
                <Link to="/colleges" className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 text-white text-sm font-bold rounded-xl hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200">
                  <Plus size={14} /> Browse Colleges
                </Link>
              </motion.div>
            )}

            {!loading && !error && choices.length > 0 && (
              <motion.div layout className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {choices.map((choice, i) => (
                    <ShortlistCard
                      key={`${choice.code}-${choice.branch}-${i}`}
                      item={choice}
                      index={i}
                      total={choices.length}
                      onRemove={handleRemove}
                      onMoveUp={handleMoveUp}
                      onMoveDown={handleMoveDown}
                      onNotesChange={handleNotesChange}
                    />
                  ))}
                </AnimatePresence>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-brand-50 rounded-2xl border border-brand-100 flex items-start gap-3">
                  <CheckCircle size={15} className="text-brand-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black text-brand-700">TNEA Counselling Tip</p>
                    <p className="text-xs text-brand-600 mt-0.5 leading-relaxed">
                      List order matters! During TNEA counselling, your choices are considered in this exact order.
                      Put your most preferred college first. You can add up to 200 choices.
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </>
        )}

        {/* ── Careers Tab ─────────────────────────────── */}
        {activeTab === 'careers' && (
          <WishlistSection
            title="Saved Careers & Courses"
            icon={Briefcase}
            iconColor="bg-amber-500"
            items={wishlistCareers}
            emptyMsg="Your careers list is empty"
            emptySubMsg="Save career paths from the Careers page"
            emptyLink="/careers"
            emptyLinkText="Explore Careers"
            onRemove={(id) => removeFromWishlist('Careers', id)}
            renderCard={(item) => (
              <WishlistCard key={item.id} item={item} onRemove={(id) => removeFromWishlist('Careers', id)} accentColor="text-amber-600" />
            )}
          />
        )}

        {/* ── Exams Tab ────────────────────────────────── */}
        {activeTab === 'exams' && (
          <WishlistSection
            title="Saved Entrance Exams"
            icon={FileText}
            iconColor="bg-sky-500"
            items={wishlistExams}
            emptyMsg="Your exams list is empty"
            emptySubMsg="Save exams you want to prepare for"
            emptyLink="/exams"
            emptyLinkText="Explore Exams"
            onRemove={(id) => removeFromWishlist('Exams', id)}
            renderCard={(item) => (
              <WishlistCard key={item.id} item={item} onRemove={(id) => removeFromWishlist('Exams', id)} accentColor="text-sky-600" />
            )}
          />
        )}

        {/* ── Scholarships Tab ─────────────────────────── */}
        {activeTab === 'scholarships' && (
          <WishlistSection
            title="Saved Scholarships"
            icon={Award}
            iconColor="bg-emerald-500"
            items={wishlistScholarships}
            emptyMsg="Your scholarships list is empty"
            emptySubMsg="Save scholarships you are eligible for"
            emptyLink="/scholarships"
            emptyLinkText="Find Scholarships"
            onRemove={(id) => removeFromWishlist('Scholarships', id)}
            renderCard={(item) => (
              <WishlistCard key={item.id} item={item} onRemove={(id) => removeFromWishlist('Scholarships', id)} accentColor="text-emerald-600" />
            )}
          />
        )}

      </div>
    </PageWrapper>
  )
}
