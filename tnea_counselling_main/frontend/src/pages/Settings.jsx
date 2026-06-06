import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings, User, Shield, Bell, Globe, Sun, Moon, Trash2,
  Download, Plus, Edit3, X, Check, ChevronRight,
  UserCircle, Baby, Phone, Mail, Calendar, LogOut
} from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import useStudentStore from '../store/useStudentStore'
import useThemeStore from '../store/useThemeStore'
import { useNavigate } from 'react-router-dom'

const SECTIONS = [
  { id: 'account', label: 'Account', icon: User, color: 'from-brand-400 to-cyan-400' },
  { id: 'profiles', label: 'Profiles', icon: UserCircle, color: 'from-violet-400 to-purple-400' },
  { id: 'preferences', label: 'Preferences', icon: Settings, color: 'from-amber-400 to-orange-400' },
  { id: 'notifications', label: 'Notifications', icon: Bell, color: 'from-rose-400 to-pink-400' },
  { id: 'language', label: 'Language', icon: Globe, color: 'from-sky-400 to-blue-400' },
  { id: 'appearance', label: 'Appearance', icon: Sun, color: 'from-amber-400 to-yellow-400' },
  { id: 'privacy', label: 'Privacy & Data', icon: Shield, color: 'from-emerald-400 to-teal-400' },
]

const AVATAR_COLORS = [
  'from-teal-400 to-cyan-500',
  'from-violet-400 to-purple-500',
  'from-rose-400 to-pink-500',
  'from-amber-400 to-orange-500',
  'from-sky-400 to-blue-500',
  'from-emerald-400 to-green-500',
]

function getAvatarColor(name) {
  if (!name) return AVATAR_COLORS[0]
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length
  return AVATAR_COLORS[idx]
}

/* ── Toggle Switch ───────────────────────────────────────── */
function Toggle({ value, onChange, color = 'bg-brand-500' }) {
  return (
    <motion.button
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5.5 rounded-full transition-all ${value ? color : 'bg-neutral-200'}`}
      style={{ height: '22px' }}
    >
      <motion.div
        animate={{ x: value ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
      />
    </motion.button>
  )
}

/* ── Add Profile Modal ───────────────────────────────────── */
function AddProfileModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', standard: '', domain: '', relation: 'child' })

  const handleAdd = () => {
    if (!form.name) return
    onAdd(form)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-6 max-w-md w-full"
        style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-black text-neutral-900">Add Profile</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors">
            <X size={14} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-1.5">Name *</label>
            <input
              value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Arjun"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm font-semibold focus:outline-none focus:border-brand-400 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-1.5">Standard</label>
            <select value={form.standard} onChange={(e) => setForm((f) => ({ ...f, standard: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm font-semibold focus:outline-none focus:border-brand-400 focus:bg-white transition-all">
              <option value="">Select Standard</option>
              {['10th', '11th', '12th', 'Graduate', 'Post Graduate'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-1.5">Domain / Interest</label>
            <select value={form.domain} onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm font-semibold focus:outline-none focus:border-brand-400 focus:bg-white transition-all">
              <option value="">Select Domain</option>
              {['Engineering', 'Medical', 'Commerce', 'Arts', 'Law', 'Design', 'Agriculture'].map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-1.5">Relation</label>
            <div className="flex gap-2">
              {['self', 'child', 'sibling'].map((r) => (
                <button key={r} onClick={() => setForm((f) => ({ ...f, relation: r }))}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all capitalize ${
                    form.relation === r ? 'bg-brand-500 text-white shadow-sm' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-600 hover:bg-neutral-50 transition-all">
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            disabled={!form.name}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-violet-600 text-white text-sm font-bold shadow-lg disabled:opacity-50"
          >
            Add Profile
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Settings Section Wrapper ────────────────────────────── */
function SettingSection({ id, title, icon: Icon, color, children, activeSection, onSelect }) {
  const isActive = activeSection === id
  return (
    <div>
      <motion.button
        whileHover={{ x: 2 }}
        onClick={() => onSelect(isActive ? null : id)}
        className="w-full flex items-center gap-3 p-4 rounded-2xl border border-neutral-100 bg-white hover:border-neutral-200 transition-all text-left group mb-2"
      >
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
          <Icon size={16} className="text-white" />
        </div>
        <span className="text-sm font-bold text-neutral-800 flex-1">{title}</span>
        <motion.div animate={{ rotate: isActive ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronRight size={14} className="text-neutral-300 group-hover:text-neutral-500" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="bg-neutral-50 rounded-2xl border border-neutral-100 p-5 mb-2 ml-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Main Settings Page ──────────────────────────────────── */
export default function SettingsPage() {
  const student = useStudentStore((s) => s.student)
  const profiles = useStudentStore((s) => s.profiles)
  const activeProfileId = useStudentStore((s) => s.activeProfileId)
  const switchProfile = useStudentStore((s) => s.switchProfile)
  const addProfile = useStudentStore((s) => s.addProfile)
  const removeProfile = useStudentStore((s) => s.removeProfile)
  const updateStudentProfile = useStudentStore((s) => s.updateStudentProfile)
  const clearSession = useStudentStore((s) => s.clearSession)
  const collapsed = useThemeStore((s) => s.sidebarCollapsed)
  const navigate = useNavigate()

  const [activeSection, setActiveSection] = useState('account')
  const [showAddProfile, setShowAddProfile] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('English')
  const [notifs, setNotifs] = useState({
    exams: true, scholarships: true, counseling: false, roadmap: true
  })
  const [editName, setEditName] = useState(student.name)
  const [editMobile, setEditMobile] = useState(student.mobile)
  const [saved, setSaved] = useState(false)

  const handleSaveAccount = () => {
    updateStudentProfile({ name: editName, mobile: editMobile })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const initials = (name) => name ? name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() : '?'

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-3 transition-all duration-300`}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center shrink-0"
            style={{ boxShadow: '0 4px 15px rgba(71,85,105,0.4)' }}>
            <Settings size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-neutral-900 dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Settings
            </h1>
            <p className="text-sm text-neutral-500">Manage your account, profiles & preferences</p>
          </div>
        </motion.div>

        {/* User card at top */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl p-5 flex items-center gap-4 dark:border dark:border-white/5"
          style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)',
          }}
        >
          <div className="dark:[background:linear-gradient(135deg,#0f172a,#1e293b)] absolute inset-0 rounded-2xl opacity-0 dark:opacity-100" 
            style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.15)' }}
          />
          <div className="relative z-10 flex items-center gap-4 w-full">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getAvatarColor(student.name)} flex items-center justify-center text-xl font-black text-white shrink-0`}
            style={{ boxShadow: '0 0 20px rgba(20,184,166,0.4)' }}>
            {initials(student.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-black text-neutral-900 dark:text-white">{student.name || 'Student'}</p>
            <p className="text-sm text-neutral-500 dark:text-slate-400">{student.mobile || 'No mobile'} · {student.district || 'Tamil Nadu'}</p>
            <p className="text-xs text-brand-600 dark:text-brand-400 mt-1">{profiles.length} profile{profiles.length !== 1 ? 's' : ''} linked</p>
          </div>
          </div>
        </motion.div>

        {/* Settings Sections */}
        <div className="space-y-2">
          {/* Account */}
          <SettingSection id="account" title="Account Settings" icon={User} color="from-brand-400 to-cyan-400" activeSection={activeSection} onSelect={setActiveSection}>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-1.5">Name</label>
                <input value={editName} onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm font-semibold focus:outline-none focus:border-brand-400 transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-1.5">Mobile</label>
                <input value={editMobile} onChange={(e) => setEditMobile(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm font-semibold focus:outline-none focus:border-brand-400 transition-all" />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveAccount}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-500 text-white text-sm font-bold shadow-md flex items-center justify-center gap-2"
              >
                {saved ? <><Check size={14} /> Saved!</> : 'Save Changes'}
              </motion.button>
            </div>
          </SettingSection>

          {/* Profiles */}
          <SettingSection id="profiles" title="Profile Management" icon={UserCircle} color="from-violet-400 to-purple-400" activeSection={activeSection} onSelect={setActiveSection}>
            <div className="space-y-3">
              {profiles.length === 0 ? (
                <p className="text-sm text-neutral-400 text-center py-4">No profiles added yet</p>
              ) : (
                profiles.map((p) => (
                  <motion.div
                    key={p.id}
                    whileHover={{ x: 2 }}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      p.id === activeProfileId ? 'border-brand-200 bg-brand-50' : 'border-neutral-100 bg-white'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarColor(p.name)} flex items-center justify-center text-[10px] font-black text-white shrink-0`}>
                      {initials(p.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-neutral-800">{p.name}</p>
                      <p className="text-[10px] text-neutral-400">{p.standard} · {p.domain || 'Not set'} · {p.relation}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {p.id !== activeProfileId && (
                        <button onClick={() => switchProfile(p.id)}
                          className="text-[10px] font-bold text-brand-600 bg-brand-50 border border-brand-100 px-2 py-1 rounded-full hover:bg-brand-100 transition-colors">
                          Switch
                        </button>
                      )}
                      {p.id === activeProfileId && (
                        <span className="text-[9px] font-black text-brand-600 bg-brand-50 border border-brand-100 px-2 py-1 rounded-full">Active</span>
                      )}
                      <button onClick={() => removeProfile(p.id)}
                        className="w-6 h-6 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center hover:bg-rose-100 transition-colors">
                        <X size={10} className="text-rose-500" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}

              {student.role === 'parent' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddProfile(true)}
                  className="w-full py-3 rounded-xl border border-dashed border-brand-200 text-sm font-bold text-brand-600 hover:bg-brand-50 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={14} /> Add Profile
                </motion.button>
              )}
            </div>
          </SettingSection>

          {/* Notifications */}
          <SettingSection id="notifications" title="Notifications" icon={Bell} color="from-rose-400 to-pink-400" activeSection={activeSection} onSelect={setActiveSection}>
            <div className="space-y-3">
              {[
                { key: 'exams', label: 'Exam Alerts', desc: 'Upcoming exam dates and deadlines' },
                { key: 'scholarships', label: 'Scholarship Alerts', desc: 'New scholarships and closing deadlines' },
                { key: 'counseling', label: 'Counseling Updates', desc: 'TNEA counselling round notifications' },
                { key: 'roadmap', label: 'Roadmap Reminders', desc: 'Milestone and progress reminders' },
              ].map((n) => (
                <div key={n.key} className="flex items-center justify-between p-3 bg-white rounded-xl border border-neutral-100">
                  <div>
                    <p className="text-xs font-bold text-neutral-800">{n.label}</p>
                    <p className="text-[10px] text-neutral-400">{n.desc}</p>
                  </div>
                  <Toggle value={notifs[n.key]} onChange={(v) => setNotifs((p) => ({ ...p, [n.key]: v }))} />
                </div>
              ))}
            </div>
          </SettingSection>

          {/* Language */}
          <SettingSection id="language" title="Language" icon={Globe} color="from-sky-400 to-blue-400" activeSection={activeSection} onSelect={setActiveSection}>
            <div className="grid grid-cols-3 gap-2">
              {['English', 'Tamil', 'Bilingual'].map((lang) => (
                <button key={lang} onClick={() => setLanguage(lang)}
                  className={`py-3 rounded-xl text-xs font-bold transition-all ${
                    language === lang ? 'bg-sky-500 text-white shadow-sm' : 'bg-white border border-neutral-200 text-neutral-600 hover:border-sky-200'
                  }`}>
                  {lang}
                </button>
              ))}
            </div>
          </SettingSection>

          {/* Appearance */}
          <SettingSection id="appearance" title="Appearance" icon={Sun} color="from-amber-400 to-yellow-400" activeSection={activeSection} onSelect={setActiveSection}>
            <div className="flex gap-3">
              {[
                { mode: false, label: 'Light Mode', icon: Sun },
                { mode: true, label: 'Dark Mode', icon: Moon },
              ].map(({ mode, label, icon: ModeIcon }) => (
                <motion.button
                  key={label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDarkMode(mode)}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                    darkMode === mode ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-neutral-200 bg-white text-neutral-500'
                  }`}
                >
                  <ModeIcon size={20} />
                  <span className="text-xs font-bold">{label}</span>
                </motion.button>
              ))}
            </div>
          </SettingSection>

          {/* Privacy */}
          <SettingSection id="privacy" title="Privacy & Data" icon={Shield} color="from-emerald-400 to-teal-400" activeSection={activeSection} onSelect={setActiveSection}>
            <div className="space-y-2">
              <motion.button
                whileHover={{ scale: 1.01 }}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-neutral-200 bg-white text-left hover:border-sky-200 transition-all"
              >
                <Download size={14} className="text-sky-500 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-neutral-800">Export My Data</p>
                  <p className="text-[10px] text-neutral-400">Download all your profile and usage data</p>
                </div>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.01 }}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-rose-100 bg-rose-50 text-left hover:border-rose-200 transition-all"
              >
                <Trash2 size={14} className="text-rose-500 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-rose-700">Delete My Data</p>
                  <p className="text-[10px] text-rose-500">Permanently remove all your data</p>
                </div>
              </motion.button>
            </div>
          </SettingSection>
        </div>

        {/* Sign Out */}
        <motion.button
          whileHover={{ scale: 1.01, backgroundColor: 'rgba(239,68,68,0.06)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { clearSession(); navigate('/', { replace: true }) }}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-rose-100 text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all"
        >
          <LogOut size={15} />
          Sign Out
        </motion.button>
      </div>

      <AnimatePresence>
        {showAddProfile && (
          <AddProfileModal onClose={() => setShowAddProfile(false)} onAdd={addProfile} />
        )}
      </AnimatePresence>
    </PageWrapper>
  )
}
